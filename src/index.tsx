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

// Multi-Stage Research - Individual Stage Endpoints
// Each stage is a separate endpoint to avoid 60s Pages Function timeout

// Model configuration - Llama 3.1 70B balances quality and speed for 60s timeout
const RESEARCH_MODEL = "@cf/meta/llama-3.1-70b-instruct"; // Stages 1-3 (good reasoning, fast enough)
const CREATIVE_MODEL = "@cf/meta/llama-3.1-70b-instruct"; // Stages 4-5 (excellent creative writing)

// Helper function to call AI and parse JSON response
async function callAIStage<T>(
  c: any,
  stageName: string,
  stageNumber: number,
  prompt: string,
  maxTokens: number = 2500,
  modelName: string = RESEARCH_MODEL
): Promise<T> {
  // Check AI binding
  if (!c.env?.AI) {
    throw new Error('AI binding not available');
  }

  const estimatedInputTokens = Math.ceil(prompt.length / 4);
  console.log(`📍 Stage ${stageNumber}: ${stageName} - Starting...`, {
    model: modelName,
    maxTokens,
    estimatedInputTokens,
    promptLength: prompt.length,
    totalEstimatedTokens: estimatedInputTokens + maxTokens,
  });

  const startTime = Date.now();
  const messages = [
    { role: "system", content: "You are a professional market research analyst. Return ONLY valid JSON as specified in the prompt." },
    { role: "user", content: prompt }
  ];

  let retryCount = 0;
  const MAX_RETRIES = 3;
  let lastError: any;

  // Dynamic timeout based on token allocation
  const TIMEOUT_MS = maxTokens > 2500 ? 60000 : 45000;

  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`⏱️  Stage ${stageNumber}: Calling AI (timeout: ${TIMEOUT_MS/1000}s)...`);

      // Add timeout wrapper (adjust based on expected output size)
      const aiCallPromise = c.env.AI.run(
        modelName,
        {
          messages,
          max_tokens: maxTokens,
          stream: false, // CRITICAL: Must be false for JSON responses
          response_format: { type: "json_object" }, // Enable JSON mode for structured output
        }
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`AI call timeout after ${TIMEOUT_MS/1000}s`)), TIMEOUT_MS)
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

      const errorDetails = {
        stage: stageNumber,
        stageName,
        attempt: retryCount,
        errorType: err instanceof Error ? err.constructor.name : typeof err,
        errorMessage: err instanceof Error ? err.message : String(err),
        promptLength: prompt.length,
        estimatedTokens: estimatedInputTokens,
        elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
      };

      console.error(`❌ Stage ${stageNumber} attempt ${retryCount} failed:`, errorDetails);

      if (retryCount < MAX_RETRIES) {
        const delayMs = 2000 * retryCount;
        console.log(`🔄 Retrying stage ${stageNumber} in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  const finalError = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Stage ${stageNumber} (${stageName}) failed after ${MAX_RETRIES} attempts: ${finalError}`);
}

// Stage 1: Market Analysis (No dependencies)
app.post("/api/research/stage/1", async (c) => {
  try {
    const businessContext: BusinessContext = await c.req.json();

    const prompt = buildStage1MarketAnalysisPrompt(businessContext);
    const result: Stage1MarketAnalysis = await callAIStage(
      c,
      "Market Analysis",
      1,
      prompt,
      2500,
      RESEARCH_MODEL
    );

    return c.json(result);
  } catch (error) {
    console.error('❌ Stage 1 error:', error);
    return c.json({
      error: 'Stage 1 failed',
      message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

// Stage 2: Buyer Psychology (Depends on Stage 1)
app.post("/api/research/stage/2", async (c) => {
  try {
    const { context, stage1 } = await c.req.json<{
      context: BusinessContext;
      stage1: Stage1MarketAnalysis;
    }>();

    const prompt = buildStage2BuyerPsychologyPrompt(context, stage1);
    const result: Stage2BuyerPsychology = await callAIStage(
      c,
      "Buyer Psychology",
      2,
      prompt,
      2500, // Reduced from 3000 to match Stage 1's successful allocation
      RESEARCH_MODEL
    );

    return c.json(result);
  } catch (error) {
    console.error('❌ Stage 2 error:', error);
    return c.json({
      error: 'Stage 2 failed',
      message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

// Stage 3: Competitive Analysis (Depends on Stages 1-2)
app.post("/api/research/stage/3", async (c) => {
  try {
    const { context, stage1, stage2 } = await c.req.json<{
      context: BusinessContext;
      stage1: Stage1MarketAnalysis;
      stage2: Stage2BuyerPsychology;
    }>();

    const prompt = buildStage3CompetitiveAnalysisPrompt(context, stage1, stage2);
    const result: Stage3CompetitiveAnalysis = await callAIStage(
      c,
      "Competitive Analysis",
      3,
      prompt,
      2000,
      RESEARCH_MODEL
    );

    return c.json(result);
  } catch (error) {
    console.error('❌ Stage 3 error:', error);
    return c.json({
      error: 'Stage 3 failed',
      message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

// Stage 4: Avatar Creation (Depends on Stages 1-3)
app.post("/api/research/stage/4", async (c) => {
  try {
    const { context, stage1, stage2, stage3 } = await c.req.json<{
      context: BusinessContext;
      stage1: Stage1MarketAnalysis;
      stage2: Stage2BuyerPsychology;
      stage3: Stage3CompetitiveAnalysis;
    }>();

    const prompt = buildStage4AvatarCreationPrompt(context, stage1, stage2, stage3);
    const result: Stage4AvatarCreation = await callAIStage(
      c,
      "Avatar Creation",
      4,
      prompt,
      2500,
      CREATIVE_MODEL
    );

    return c.json(result);
  } catch (error) {
    console.error('❌ Stage 4 error:', error);
    return c.json({
      error: 'Stage 4 failed',
      message: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

// Stage 5: Offer Design (Depends on Stages 1-4)
app.post("/api/research/stage/5", async (c) => {
  try {
    const { context, stage1, stage2, stage3, stage4 } = await c.req.json<{
      context: BusinessContext;
      stage1: Stage1MarketAnalysis;
      stage2: Stage2BuyerPsychology;
      stage3: Stage3CompetitiveAnalysis;
      stage4: Stage4AvatarCreation;
    }>();

    const prompt = buildStage5OfferDesignPrompt(context, stage1, stage2, stage3, stage4);
    const result: Stage5OfferDesign = await callAIStage(
      c,
      "Offer Design",
      5,
      prompt,
      2500,
      CREATIVE_MODEL
    );

    return c.json(result);
  } catch (error) {
    console.error('❌ Stage 5 error:', error);
    return c.json({
      error: 'Stage 5 failed',
      message: error instanceof Error ? error.message : String(error),
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

    // Use creative model for final synthesis (long-form writing) - Full precision for quality
    const SYNTHESIS_MODEL = "@cf/meta/llama-3.1-70b-instruct";

    const estimatedInputTokens = Math.ceil(stage6Prompt.length / 4);
    const maxOutputTokens = Math.min(5000, 24000 - estimatedInputTokens - 500); // Leave 500 token buffer

    console.log('📏 Stage 6 Prompt Statistics', {
      model: SYNTHESIS_MODEL,
      promptLength: stage6Prompt.length,
      estimatedInputTokens,
      maxOutputTokens,
      totalEstimated: estimatedInputTokens + maxOutputTokens,
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
            max_tokens: maxOutputTokens, // Dynamically calculated to avoid exceeding context window
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
