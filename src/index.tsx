import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { renderer } from "./renderer";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { Ai } from "@cloudflare/workers-types";
import { ResearchFormPage } from "./components/research-form";
import { buildMasterPrompt } from "./prompts/master-research-prompt";
import type { BusinessContext } from "./types";

// Import multi-stage prompt builders
import { buildStage1MarketAnalysisPrompt } from "./prompts/stage1-market-analysis";
import { buildStage2BuyerPsychologyPrompt } from "./prompts/stage2-buyer-psychology";
import { buildStage3CompetitiveAnalysisPrompt } from "./prompts/stage3-competitive-analysis";
import { buildStage4AvatarCreationPrompt } from "./prompts/stage4-avatar-creation";
import { buildStage5OfferDesignPrompt } from "./prompts/stage5-offer-design";
import { buildStage6ReportSynthesisPrompt } from "./prompts/stage6-report-synthesis";

// Import multi-stage types
import type {
  Stage1MarketAnalysis,
  Stage2BuyerPsychology,
  Stage3CompetitiveAnalysis,
  Stage4AvatarCreation,
  Stage5OfferDesign,
  CompleteResearchData,
} from "./types/research-stages";

type Bindings = {
  AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
  return c.render(
    <>
      <div className="flex h-screen bg-gray-200">
        <div
          className="flex-grow flex flex-col"
          style="max-width: calc(100% - 20rem)"
        >
          <div
            id="chat-history"
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-white flex flex-col-reverse messages-container"
          ></div>
          <div className="px-6 py-2 bg-white shadow-up">
            <form className="flex items-center" id="chat-form">
              <textarea
                id="message-input"
                className="flex-grow m-2 p-2 border border-chat-border rounded shadow-sm placeholder-chat-placeholder"
                placeholder="Type a message..."
              ></textarea>
              <button
                type="submit"
                className="m-2 px-4 py-2 bg-chat-button text-black rounded hover:bg-gray-300"
              >
                Send
              </button>
            </form>
            <div className="text-xs text-gray-500 mt-2">
              <p className="model-display">-</p>
              <input
                type="hidden"
                class="message-user message-assistant message-model"
              />
            </div>
          </div>
        </div>
        <div className="w-80 bg-chat-settings p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Chat Settings</h2>
              <p className="text-sm text-chat-helpertext mt-1">
                Try out different models and configurations for your chat
                application
              </p>
            </div>
            <form>
              <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-2">
                  Model
                </label>
                <select
                  id="model-select"
                  className="border border-chat-border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                ></select>
              </div>
              <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-2">
                  System Message
                </label>
                <p className="text-sm text-chat-helpertext mb-2">
                  Guides the tone of the response
                </p>
                <textarea
                  id="system-message"
                  className="border border-chat-border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter system message..."
                ></textarea>
              </div>
              <button
                id="apply-chat-settings"
                className="w-full px-4 py-2 bg-chat-apply text-white rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
              >
                Apply Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <script src="/static/script.js"></script>
    </>
  );
});

app.post("/api/chat", async (c) => {
  const payload = await c.req.json();
  const messages = [...payload.messages];

  // Prepend the systemMessage
  if (payload?.config?.systemMessage) {
    messages.unshift({ role: "system", content: payload.config.systemMessage });
  }

  // Check if AI binding is available (it won't be in local dev)
  if (!c.env?.AI) {
    console.warn("⚠️  AI binding not available - using mock response for local development");
    console.log("📝 To use real AI, deploy with: npm run deploy");

    // Return a mock streaming response for local development
    return streamText(c, async (stream) => {
      const mockResponse = `**Local Development Mode**\n\nCloudflare Workers AI is not available in local development. This is a mock response.\n\n**Your message was:** "${messages[messages.length - 1].content}"\n\n**To use real AI:**\n1. Deploy: \`npm run deploy\`\n2. Visit your deployed URL\n\n**Model requested:** ${payload.config.model}`;

      // Simulate streaming by writing character by character
      for (const char of mockResponse) {
        stream.write(char);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });
  }

  // Production code with real AI
  let eventSourceStream;
  let retryCount = 0;
  let successfulInference = false;
  let lastError;
  const MAX_RETRIES = 3;

  while (successfulInference === false && retryCount < MAX_RETRIES) {
    try {
      eventSourceStream = (await c.env.AI.run(payload.config.model, {
        messages,
        stream: true,
      })) as ReadableStream;
      successfulInference = true;
    } catch (err) {
      lastError = err;
      retryCount++;
      console.error(err);
      console.log(`Retrying #${retryCount}...`);
    }
  }

  if (eventSourceStream === undefined) {
    if (lastError) {
      throw lastError;
    }
    throw new Error(`Problem with model`);
  }

  // EventSource stream is handy for local event sources, but we want to just stream text
  const tokenStream = eventSourceStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream());

  return streamText(c, async (stream) => {
    for await (const msg of tokenStream) {
      if (msg.data !== "[DONE]") {
        const data = JSON.parse(msg.data);
        stream.write(data.response);
      }
    }
  });
});

// Research form route
app.get("/research", (c) => {
  return c.render(<ResearchFormPage />);
});

// Research API endpoint
app.post("/api/research", async (c) => {
  try {
    const businessContext: BusinessContext = await c.req.json();

    // Log received data for debugging
    console.log('📥 Received business context:', {
      business_name: businessContext.business_name,
      fieldCount: Object.keys(businessContext).length,
    });

    // Build comprehensive prompt with all context
    const systemMessage = "You are a professional market research analyst specializing in creating comprehensive business intelligence reports.";
    const userMessage = buildMasterPrompt(businessContext);

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage }
  ];

  // Check if AI binding is available (it won't be in local dev)
  if (!c.env?.AI) {
    console.warn("⚠️  AI binding not available - using mock response for local development");
    console.log("📝 To use real AI, deploy with: npm run deploy");

    return streamText(c, async (stream) => {
      const mockResponse = `**Local Development Mode**\n\n⚠️ Cloudflare Workers AI is not available in local development.\n\n**Business:** ${businessContext.business_name}\n**Niche:** ${businessContext.niche}\n**Target:** ${businessContext.target_market_hypothesis}\n\n**To generate a real research report:**\n1. Deploy: \`npm run preview:remote\`\n2. Visit your preview URL\n\nThis would normally generate an 8,000-12,000 word comprehensive market research report including:\n- Market validation & Power 4% analysis\n- Demographics & community ecosystem\n- Buyer language extraction\n- Emotional intelligence (pain points, desires, fears)\n- Dream buyer avatar\n- Copy hooks & headlines\n- Godfather offer design\n- Pricing strategy\n- And more...`;

      for (const char of mockResponse) {
        stream.write(char);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });
  }

  // Log request details for monitoring
  console.log('🚀 Research Generation Started', {
    timestamp: new Date().toISOString(),
    business: businessContext.business_name,
    niche: businessContext.niche,
  });

  console.log('📏 Prompt Statistics', {
    promptLength: userMessage.length,
    estimatedInputTokens: Math.ceil(userMessage.length / 4),
    maxOutputTokens: 8000,
    expectedWords: '~6,000',
  });

  console.log('⚙️ AI Configuration', {
    model: '@cf/meta/llama-3.1-70b-instruct',
    maxTokens: 8000,
    streaming: true,
    contextLimit: 24000,
  });

  // Production code with real AI - use most capable model for best results
  let eventSourceStream;
  let retryCount = 0;
  let successfulInference = false;
  let lastError;
  const MAX_RETRIES = 3;

  while (successfulInference === false && retryCount < MAX_RETRIES) {
    try {
      eventSourceStream = (await c.env.AI.run(
        "@cf/meta/llama-3.1-70b-instruct", // Use most capable model
        {
          messages,
          stream: true,
          max_tokens: 8000, // Reduced to fit within 24K context window (input ~15K + output 8K = 23K)
        }
      )) as ReadableStream;
      successfulInference = true;
    } catch (err) {
      lastError = err;
      retryCount++;
      console.error(err);
      console.log(`Retrying #${retryCount}...`);
    }
  }

  if (eventSourceStream === undefined) {
    if (lastError) {
      throw lastError;
    }
    throw new Error(`Problem with AI model`);
  }

  // Stream the AI response
  const tokenStream = eventSourceStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream());

  return streamText(c, async (stream) => {
    let tokenCount = 0;
    let lastLogTime = Date.now();
    const startTime = Date.now();

    for await (const msg of tokenStream) {
      if (msg.data !== "[DONE]") {
        const data = JSON.parse(msg.data);
        stream.write(data.response);
        tokenCount++;

        // Log progress every 1000 tokens or every 30 seconds
        if (tokenCount % 1000 === 0 || Date.now() - lastLogTime > 30000) {
          const elapsed = Math.round((Date.now() - startTime) / 1000);
          const estimatedWords = Math.round(tokenCount * 0.75);
          console.log(`📊 Generation Progress`, {
            tokensGenerated: tokenCount,
            estimatedWords,
            elapsedSeconds: elapsed,
            percentComplete: Math.round((tokenCount / 8000) * 100) + '%'
          });
          lastLogTime = Date.now();
        }
      }
    }

    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const estimatedWords = Math.round(tokenCount * 0.75);
    console.log('✅ Generation Complete', {
      totalTokens: tokenCount,
      estimatedWords,
      totalTimeSeconds: totalTime,
      avgTokensPerSecond: (tokenCount / totalTime).toFixed(2)
    });
  });
  } catch (error) {
    console.error('❌ Error in /api/research endpoint:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json({
      error: 'Failed to generate research report',
      message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

// Multi-Stage Research Orchestration Endpoint
app.post("/api/research/multi-stage", async (c) => {
  try {
    const businessContext: BusinessContext = await c.req.json();

    console.log('🚀 Multi-Stage Research Generation Started', {
      timestamp: new Date().toISOString(),
      business: businessContext.business_name,
      niche: businessContext.niche,
      stages: 6,
    });

    // Check if AI binding is available
    if (!c.env?.AI) {
      console.warn("⚠️  AI binding not available - multi-stage requires real AI deployment");
      return c.json({
        error: 'Multi-stage research requires AI deployment',
        message: 'Deploy with: npm run preview:remote',
      }, 503);
    }

    // Helper function to call AI and parse JSON response
    async function callAIStage<T>(
      stageName: string,
      stageNumber: number,
      prompt: string,
      maxTokens: number = 2500,
      modelName: string = "@cf/meta/llama-3.1-70b-instruct"
    ): Promise<T> {
      console.log(`📍 Stage ${stageNumber}: ${stageName} - Starting...`, {
        model: modelName,
        maxTokens,
        estimatedInputTokens: Math.ceil(prompt.length / 4),
      });

      const startTime = Date.now();
      const messages = [
        { role: "system", content: "You are a professional market research analyst. Return ONLY valid JSON as specified in the prompt." },
        { role: "user", content: prompt }
      ];

      let retryCount = 0;
      const MAX_RETRIES = 3;
      let lastError: any;

      while (retryCount < MAX_RETRIES) {
        try {
          console.log(`⏱️  Stage ${stageNumber}: Calling AI with model ${modelName}...`);

          // Add timeout wrapper (Workers AI calls should complete in <30s)
          const aiCallPromise = c.env.AI.run(
            modelName,
            {
              messages,
              max_tokens: maxTokens,
              stream: false, // CRITICAL: Must be false for JSON responses
            }
          );

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI call timeout after 45s')), 45000)
          );

          const response = await Promise.race([aiCallPromise, timeoutPromise]) as any;
          console.log(`✓ Stage ${stageNumber}: AI response received`);

          // Extract the response text
          const responseText = response.response || JSON.stringify(response);

          console.log(`✅ Stage ${stageNumber}: ${stageName} - Raw response received`, {
            responseLength: responseText.length,
            elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          // Try to parse JSON - handle markdown code blocks if present
          let jsonText = responseText.trim();

          // Remove markdown code blocks if present
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const parsedData = JSON.parse(jsonText) as T;

          console.log(`✅ Stage ${stageNumber}: ${stageName} - Complete`, {
            totalTimeSeconds: Math.round((Date.now() - startTime) / 1000),
          });

          return parsedData;
        } catch (err) {
          lastError = err;
          retryCount++;
          console.error(`❌ Stage ${stageNumber} attempt ${retryCount} failed:`, err);

          if (retryCount < MAX_RETRIES) {
            console.log(`🔄 Retrying stage ${stageNumber}...`);
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          }
        }
      }

      throw new Error(`Stage ${stageNumber} (${stageName}) failed after ${MAX_RETRIES} attempts: ${lastError}`);
    }

    // Execute all 6 stages sequentially
    const overallStart = Date.now();

    // Model specialization: Using same proven Llama 70B for all stages to ensure reliability
    // TODO: Can experiment with smaller models once we confirm multi-stage works end-to-end
    const RESEARCH_MODEL = "@cf/meta/llama-3.1-70b-instruct"; // Proven, reliable
    const CREATIVE_MODEL = "@cf/meta/llama-3.1-70b-instruct"; // Proven, reliable

    // Stage 1: Market Analysis (Research specialist)
    const stage1Prompt = buildStage1MarketAnalysisPrompt(businessContext);
    const stage1: Stage1MarketAnalysis = await callAIStage(
      "Market Analysis",
      1,
      stage1Prompt,
      2500,
      RESEARCH_MODEL
    );

    // Stage 2: Buyer Psychology (Research specialist)
    const stage2Prompt = buildStage2BuyerPsychologyPrompt(businessContext, stage1);
    const stage2: Stage2BuyerPsychology = await callAIStage(
      "Buyer Psychology",
      2,
      stage2Prompt,
      3000,
      RESEARCH_MODEL
    );

    // Stage 3: Competitive Analysis (Research specialist)
    const stage3Prompt = buildStage3CompetitiveAnalysisPrompt(businessContext, stage1, stage2);
    const stage3: Stage3CompetitiveAnalysis = await callAIStage(
      "Competitive Analysis",
      3,
      stage3Prompt,
      2000,
      RESEARCH_MODEL
    );

    // Stage 4: Avatar Creation (Creative specialist for narratives)
    const stage4Prompt = buildStage4AvatarCreationPrompt(businessContext, stage1, stage2, stage3);
    const stage4: Stage4AvatarCreation = await callAIStage(
      "Avatar Creation",
      4,
      stage4Prompt,
      2500,
      CREATIVE_MODEL
    );

    // Stage 5: Offer Design (Creative specialist for marketing messages)
    const stage5Prompt = buildStage5OfferDesignPrompt(businessContext, stage1, stage2, stage3, stage4);
    const stage5: Stage5OfferDesign = await callAIStage(
      "Offer Design",
      5,
      stage5Prompt,
      2500,
      CREATIVE_MODEL
    );

    // Compile complete research data
    const completeData: CompleteResearchData = {
      stage1_market_analysis: stage1,
      stage2_buyer_psychology: stage2,
      stage3_competitive_analysis: stage3,
      stage4_avatar_creation: stage4,
      stage5_offer_design: stage5,
    };

    const totalTime = Math.round((Date.now() - overallStart) / 1000);
    console.log('🎉 All Research Stages Complete', {
      totalTimeSeconds: totalTime,
      totalTimeMinutes: (totalTime / 60).toFixed(1),
      stagesCompleted: 5,
      modelsUsed: {
        research: RESEARCH_MODEL + ' (Stages 1-3)',
        creative: CREATIVE_MODEL + ' (Stages 4-5)'
      }
    });

    // Return the complete research data (Stage 6 synthesis happens in separate endpoint)
    return c.json(completeData);

  } catch (error) {
    console.error('❌ Error in multi-stage research:', error);
    return c.json({
      error: 'Multi-stage research generation failed',
      message: error instanceof Error ? error.message : String(error),
      stage: 'unknown',
    }, 500);
  }
});

// Stage 6: Report Synthesis Endpoint (streams final markdown report)
app.post("/api/research/synthesize", async (c) => {
  try {
    const payload = await c.req.json<{
      context: BusinessContext;
      researchData: CompleteResearchData;
    }>();

    const { context, researchData } = payload;

    console.log('📝 Stage 6: Report Synthesis - Starting...', {
      timestamp: new Date().toISOString(),
      business: context.business_name,
    });

    // Check if AI binding is available
    if (!c.env?.AI) {
      console.warn("⚠️  AI binding not available - synthesis requires real AI deployment");
      return streamText(c, async (stream) => {
        stream.write("# Mock Report\n\nDeploy to see real synthesis.\n");
      });
    }

    // Build Stage 6 prompt
    const stage6Prompt = buildStage6ReportSynthesisPrompt(context, researchData);

    const messages = [
      { role: "system", content: "You are a professional market intelligence report writer. Create a comprehensive markdown report using ALL the provided research data." },
      { role: "user", content: stage6Prompt }
    ];

    // Use creative model for final synthesis (long-form writing)
    const SYNTHESIS_MODEL = "@cf/meta/llama-3.1-70b-instruct";

    console.log('📏 Stage 6 Prompt Statistics', {
      model: SYNTHESIS_MODEL,
      promptLength: stage6Prompt.length,
      estimatedInputTokens: Math.ceil(stage6Prompt.length / 4),
      maxOutputTokens: 6000,
    });

    // Stream the final report
    let eventSourceStream;
    let retryCount = 0;
    let successfulInference = false;
    let lastError;
    const MAX_RETRIES = 3;

    while (successfulInference === false && retryCount < MAX_RETRIES) {
      try {
        eventSourceStream = (await c.env.AI.run(
          SYNTHESIS_MODEL,
          {
            messages,
            stream: true,
            max_tokens: 6000, // Comprehensive report
          }
        )) as ReadableStream;
        successfulInference = true;
      } catch (err) {
        lastError = err;
        retryCount++;
        console.error('❌ Stage 6 attempt failed:', err);
        console.log(`🔄 Retrying Stage 6 #${retryCount}...`);
      }
    }

    if (eventSourceStream === undefined) {
      throw lastError || new Error('Stage 6 synthesis failed');
    }

    const tokenStream = eventSourceStream
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream());

    return streamText(c, async (stream) => {
      let tokenCount = 0;
      const startTime = Date.now();

      for await (const msg of tokenStream) {
        if (msg.data !== "[DONE]") {
          const data = JSON.parse(msg.data);
          stream.write(data.response);
          tokenCount++;
        }
      }

      const totalTime = Math.round((Date.now() - startTime) / 1000);
      console.log('✅ Stage 6: Report Synthesis - Complete', {
        totalTokens: tokenCount,
        totalTimeSeconds: totalTime,
      });
    });

  } catch (error) {
    console.error('❌ Error in report synthesis:', error);
    return c.json({
      error: 'Report synthesis failed',
      message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

export default app;
