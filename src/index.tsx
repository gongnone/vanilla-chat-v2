import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { renderer } from "./renderer";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { Ai } from "@cloudflare/workers-types";
import { ResearchFormPage } from "./components/research-form";
import { buildMasterPrompt } from "./prompts/master-research-prompt";
import type { BusinessContext } from "./types";

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

export default app;
