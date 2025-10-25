# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Cloudflare Pages** application with two main features:

1. **Chat Interface** (`/`) - Interactive chat for exploring Cloudflare Workers AI text generation models
2. **Market Intelligence Generator** (`/research`) - Comprehensive market research report generator for businesses

Built with Hono web framework, Vite for building, and Tailwind CSS for styling.

**Critical Architecture Constraint**: Cloudflare Workers AI bindings **cannot run in local development**. The AI service requires remote execution on Cloudflare's infrastructure.

## Development Commands

### Local Development (Mock AI)
```bash
npm run dev
```
- Runs `wrangler pages dev` locally on http://localhost:8788
- Builds are watched automatically (Vite + Tailwind CSS)
- AI responses are **mocked** - not real AI
- Use for rapid UI/UX iteration

### Remote Development (Real AI)
```bash
# Terminal 1: Watch and rebuild on file changes
npm run dev:remote

# Terminal 2: Deploy preview when ready to test
npm run preview:remote
```
- `dev:remote`: Watches files and rebuilds automatically
- `preview:remote`: Creates temporary preview deployment with real AI
- Use when you need to test actual AI integration

### Production Build
```bash
npm run build
```
- Builds CSS: `tailwindcss -i src/style.css -o public/static/style.css`
- Builds worker: `vite build` → outputs to `dist/_worker.js`

### Production Deploy
```bash
npm run deploy
```
- Runs full build then deploys to Cloudflare Pages
- Live at: `https://vanilla-chat-demo-tmpl-al4.pages.dev`

### Debug Production
```bash
npx wrangler pages deployment tail
```
- Tails logs from production deployment

### Update AI Models List
```bash
npx wrangler ai models --json | jq 'reduce .[] as $item ({beta: [], ga: []}; if ($item.task.name == "Text Generation") then if ($item.properties | any(.property_id == "beta" and .value == "true")) then .beta += [$item.name] else .ga += [$item.name] end else . end) | .beta |= sort | .ga |= sort'
```
- Fetches latest text generation models from Cloudflare Workers AI
- Update the models object in `public/static/script.js` with output

## Architecture

### Request Flow

1. **Client-side** (`public/static/script.js`):
   - Vanilla JS, no framework
   - Uses LocalStorage for chat history and settings
   - Fetches `/api/chat` with streaming response
   - Markdown rendering via `markdown-it`
   - Syntax highlighting via `highlight.js`

2. **Server-side** (`src/index.tsx`):
   - Hono app with JSX renderer
   - Routes:
     - `GET /` - Chat interface
     - `POST /api/chat` - Chat API endpoint
     - `GET /research` - Market Intelligence Generator form
     - `POST /api/research` - Single-stage research report generation (legacy)
     - `POST /api/research/multi-stage` - Multi-stage research orchestration (recommended)
     - `POST /api/research/synthesize` - Final report synthesis for multi-stage
   - Streams AI responses using `hono/streaming`
   - Parses Server-Sent Events from Workers AI
   - Falls back to mock responses when `c.env.AI` is unavailable

3. **Build Process**:
   - Vite builds `src/index.tsx` → `dist/_worker.js`
   - Tailwind processes `src/style.css` → `public/static/style.css`
   - Static assets from `public/` are copied to `dist/`

### File Structure

```
src/
  index.tsx                      - Hono app, main entry point, all routes
  renderer.tsx                   - JSX renderer for HTML shell
  style.css                      - Tailwind input file
  global.d.ts                    - TypeScript declarations
  types.ts                       - TypeScript interfaces (BusinessContext)
  types/
    research-stages.ts           - Multi-stage research output interfaces
  components/
    research-form.tsx            - Market Intelligence form component
  prompts/
    master-research-prompt.ts    - Single-stage research prompt (legacy)
    stage1-market-analysis.ts    - Stage 1: Market validation & Power 4%
    stage2-buyer-psychology.ts   - Stage 2: Buyer language, fears, desires
    stage3-competitive-analysis.ts - Stage 3: Competitor intelligence
    stage4-avatar-creation.ts    - Stage 4: Dream customer persona
    stage5-offer-design.ts       - Stage 5: Pricing, messaging, bonuses
    stage6-report-synthesis.ts   - Stage 6: Final markdown report assembly

public/
  static/
    script.js                    - Client-side chat logic, model list
    research.js                  - Client-side research form logic
    style.css                    - Compiled Tailwind output (generated)
    cloudflare-logo.png
  favicon.ico

dist/                            - Build output (generated)
  _worker.js                     - Compiled Hono worker
  static/                        - Static assets
```

### AI Binding Configuration

**wrangler.toml**:
```toml
[ai]
binding = "AI"
```

This binds Cloudflare Workers AI to `c.env.AI` in the Hono context. The binding is:
- **Available**: When deployed to Cloudflare Pages
- **Unavailable**: During local `wrangler pages dev`

The code in `src/index.tsx` detects missing AI binding and returns mock responses for local dev.

### State Management

- **LocalStorage** stores:
  - Chat message history (role + content)
  - Current model selection
  - System message configuration
- No server-side persistence
- Messages cleared when localStorage is cleared

### Streaming Implementation

**`/api/chat` endpoint:**
1. Calls `c.env.AI.run(model, { messages, stream: true })`
2. Receives Server-Sent Events stream
3. Pipes through `EventSourceParserStream` to parse SSE
4. Uses `streamText()` to stream tokens back to client
5. Client reads stream via `response.body.pipeThrough(new TextDecoderStream())`

**`/api/research` endpoint (Single-Stage - Legacy):**
1. Collects 18 business context fields from form
2. Builds comprehensive prompt using `buildMasterPrompt()`
3. Calls `c.env.AI.run('@cf/meta/llama-3.1-70b-instruct', { messages, stream: true, max_tokens: 8000 })`
4. Streams ~6,000 word Market Intelligence Report back to client
5. **Limitation**: Often produces incomplete reports with placeholders due to token limits

**`/api/research/multi-stage` endpoint (Recommended):**
1. Collects 18 business context fields from form
2. Executes 6 sequential stages, each with focused AI call:
   - **Stage 1**: Market Analysis (2K tokens JSON) - Market validation, Power 4% identification
   - **Stage 2**: Buyer Psychology (2.5K tokens JSON) - Real buyer quotes, fears, desires
   - **Stage 3**: Competitive Analysis (1.5K tokens JSON) - Specific competitor intelligence
   - **Stage 4**: Avatar Creation (2K tokens JSON) - Named persona with day-in-life narratives
   - **Stage 5**: Offer Design (2.5K tokens JSON) - 3-tier pricing, marketing messages
3. Returns `CompleteResearchData` object with all JSON data
4. Frontend then calls `/api/research/synthesize` for final report

**`/api/research/synthesize` endpoint:**
1. Receives `CompleteResearchData` from multi-stage + original `BusinessContext`
2. Builds Stage 6 prompt using `buildStage6ReportSynthesisPrompt()` with ALL data
3. Streams final markdown report (6K tokens) using complete data from Stages 1-5
4. **Result**: 100% complete report with NO placeholders - all sections filled with specific data

## Configuration Files

- **vite.config.ts**: Uses `@hono/vite-cloudflare-pages` plugin for Pages build
- **wrangler.toml**: Cloudflare Pages config with AI binding
- **tailwind.config.js**: Tailwind with custom color theme (chat-border, chat-button, etc.)
- **tsconfig.json**: TypeScript config for Hono/JSX

## Important Constraints

### DO NOT Convert to Workers
This is a **Cloudflare Pages** project, not a Workers project. Do not:
- Add `main = "dist/_worker.js"` to wrangler.toml
- Add `[site]` configuration to wrangler.toml
- Change deployment from `wrangler pages deploy` to `wrangler publish`

### Local AI Limitation
Accept that local dev cannot test real AI. Solutions:
1. Use mock responses (already implemented)
2. Deploy preview: `npm run preview:remote`
3. Set up Git integration for automatic preview URLs

### Dependencies
- Uses CDN resources (markdown-it, highlight.js) - avoid bundling these
- Minimal dependencies by design - think twice before adding new ones

## Market Intelligence Generator

**Route**: `/research`
**Documentation**: See `RESEARCH-GENERATOR.md` and `MULTI-STAGE-IMPLEMENTATION.md` for full details

### Key Features

- **3-Step Wizard Form**: Collects 18 business context fields across 3 progressive steps
- **Fill Test Data Button**: Development tool (🧪 button in header) auto-fills form with realistic test data
- **Multi-Stage Generation** (Beta): 6 sequential AI calls for complete data, NO placeholders
- **Single-Stage Generation** (Legacy): Fast but often incomplete with placeholder text
- **Progress Tracking**: Real-time status updates for each stage (⏳ → ✅)
- **Client-side State**: Form data and reports saved to LocalStorage for persistence

### Generation Modes

**Single-Stage (Legacy):**
- Time: 8-12 minutes
- Cost: ~$0.13 per report
- Quality: Often incomplete with `[placeholder]` text
- Use case: Quick drafts, testing

**Multi-Stage (Recommended):**
- Time: 15-20 minutes
- Cost: ~$0.30 per report
- Quality: 100% complete data, NO placeholders
- Use case: Client-ready reports, professional deliverables
- Stages: Market Analysis → Buyer Psychology → Competitive Analysis → Avatar Creation → Offer Design → Report Synthesis

### Toggle Between Modes

Users can switch between modes via checkbox in the `/research` page header:
- **Checkbox unchecked**: Single-stage (default for backward compatibility)
- **Checkbox checked**: Multi-stage (recommended for quality)
- Preference saved to LocalStorage

### Token Budget

**Single-Stage:**
- Input: ~15K tokens
- Output: 8K tokens max (24K total limit)
- **Limitation**: Not enough for complete reports

**Multi-Stage:**
- 6 separate AI calls, each within limits:
  - Stage 1-5: ~7K-10.5K total per stage (JSON output)
  - Stage 6: ~21K total (Markdown synthesis)
- **Advantage**: Each stage focused, complete data guaranteed

### Development Testing

For rapid testing without filling the 18-field form manually:

1. Navigate to `/research`
2. Click **"🧪 Fill Test Data"** button (top-right corner)
3. Form auto-populates and advances to Step 3
4. **Toggle Multi-Stage** (checkbox in header) for best results
5. Click "Generate Research Report"
6. Watch 6 stages complete: 📊 → 🧠 → 🎯 → 👤 → 💎 → 📝

Test data features realistic executive coaching business context (Ashley Shaw Consulting - women in tech leadership).

## Testing with Playwright MCP

This project has Playwright MCP server installed for automated browser testing and E2E testing of the chat interface. READ THE TESTING.md FILE FOR DETAILED INSTRUCTIONS. Always use the Playwright MCP to test the UI functionality.

### MCP Configuration

Add to Claude Code MCP settings (Command Palette → "Claude Code: Open MCP Settings"):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [
        "/Users/williamshaw/vanilla/vanilla-chat-v2/node_modules/@executeautomation/playwright-mcp-server/dist/index.js"
      ]
    }
  }
}
```

Or use npx for a global approach:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@executeautomation/playwright-mcp-server"
      ]
    }
  }
}
```

### Available Playwright Tools via MCP

Once configured, you can use Playwright MCP to:
- **Navigate**: Visit deployed URLs (local or preview/production)
- **Screenshot**: Capture visual state of the chat interface
- **Click/Type**: Interact with chat input, send messages
- **Evaluate**: Run JavaScript in browser context to inspect state
- **Wait**: Wait for AI responses to stream in
- **Assert**: Verify chat messages appear correctly

### Example Testing Workflow

1. Deploy preview: `npm run preview:remote`
2. Use Playwright MCP to navigate to preview URL
3. Screenshot initial state
4. Type message in chat input
5. Click send button
6. Wait for streaming response
7. Screenshot final state
8. Verify markdown rendering worked

### Limitations

- Can only test **deployed** versions (preview or production)
- Cannot test local dev (`npm run dev`) because AI is mocked
- For real E2E testing, use `npm run preview:remote` first
