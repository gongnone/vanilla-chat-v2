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
     - `POST /api/research` - Deprecated endpoint (returns 410 Gone)
     - `POST /api/research/stage/1` through `/api/research/stage/5` - Individual stage endpoints
     - `POST /api/research/synthesize` - Final report synthesis (Stage 6)
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
    stage1-market-analysis.ts    - Stage 1: Market validation & Power 4%
    stage2-buyer-psychology.ts   - Stage 2: Buyer language, fears, desires
    stage3-competitive-analysis.ts - Stage 3: Competitor intelligence
    stage4-avatar-creation.ts    - Stage 4: Dream customer persona
    stage5-offer-design.ts       - Stage 5: Pricing, messaging, bonuses
    stage6-report-synthesis-condensed.ts - Stage 6: Final markdown report assembly

public/
  static/
    script.js                    - Client-side chat logic, model list
    research.js                  - Client-side research form logic
    research-editor.js           - Research Data Editor modal component
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

**Multi-Stage Research Generation (Production):**

The Market Intelligence Generator uses a 6-stage architecture for complete, high-quality reports:

**Stage Endpoints** (`/api/research/stage/1` through `/api/research/stage/5`):
1. **Stage 1** - Market Analysis (2.5K tokens JSON): Market validation, Power 4% identification
2. **Stage 2** - Buyer Psychology (2.5K tokens JSON): Real buyer quotes, fears, desires
3. **Stage 3** - Competitive Analysis (2K tokens JSON): Specific competitor intelligence
4. **Stage 4** - Avatar Creation (2.5K tokens JSON): Named persona with day-in-life narratives
5. **Stage 5** - Offer Design (2.5K tokens JSON): 3-tier pricing, marketing messages

Each stage returns structured JSON data that feeds into subsequent stages.

**Synthesis Endpoint** (`/api/research/synthesize`):
1. Receives `CompleteResearchData` from all 5 stages + original `BusinessContext`
2. Builds condensed Stage 6 prompt using `buildStage6ReportSynthesisPromptCondensed()`
3. Streams final markdown report (~8K tokens) using complete data from Stages 1-5
4. **Result**: 100% complete ~6,000 word report with NO placeholders

**Legacy Endpoint** (`/api/research`):
- Returns 410 Gone with migration guidance
- Previously used single-stage generation (removed for quality reasons)

## Configuration Files

- **vite.config.ts**: Uses `@hono/vite-cloudflare-pages` plugin for Pages build
- **wrangler.toml**: Cloudflare Pages config with AI binding
- **tailwind.config.js**: Tailwind with custom color theme (chat-border, chat-button, etc.)
- **tsconfig.json**: TypeScript config for Hono/JSX

## Best Practices & Guidelines

### Cloudflare Workers AI Best Practices
**See**: `cloudflare-best-practices.md`

This document contains comprehensive best practices for building production AI applications with Cloudflare Workers AI. Key topics include:

- **Section 4.4: Managing Context Windows and Token Limits** ⚠️ **CRITICAL**
  - Understanding the 24K token context window constraint
  - Token budget planning and calculation formulas
  - Avoiding `JSON.stringify()` for large data objects (can bloat prompts 5-10x)
  - Pre-deployment testing checklist for context overflow
  - Production monitoring for token usage and truncation

**Why This Matters**: The most common production failure in AI apps is context window overflow, where large input prompts leave insufficient room for quality output. This causes:
- Silent truncation (responses cut off mid-sentence)
- Incomplete reports or content
- Poor user experience

**Key Takeaway**: Always calculate token budgets BEFORE implementation:
```typescript
const estimatedInputTokens = Math.ceil(promptString.length / 3.5);
const maxOutputTokens = Math.max(
  MIN_REQUIRED,
  Math.min(DESIRED, CONTEXT_WINDOW - estimatedInputTokens - BUFFER)
);
```

Use inline value extraction instead of `JSON.stringify()` to reduce prompt size by 70-80%.

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
- **Multi-Stage Generation**: 6 sequential AI calls for complete data, NO placeholders
- **Progress Tracking**: Real-time status updates for each stage (⏳ → ✅)
- **Client-side State**: Form data and reports saved to LocalStorage for persistence

### Generation Architecture

**Multi-Stage (Production):**
- Time: 15-20 minutes
- Cost: ~$0.30 per report
- Quality: 100% complete data, NO placeholders
- Use case: Professional, client-ready reports
- Stages: Market Analysis → Buyer Psychology → Competitive Analysis → Avatar Creation → Offer Design → Report Synthesis

### Token Budget

**Multi-Stage Architecture:**
- 6 separate AI calls, each within 24K context window:
  - Stages 1-5: ~7K-10.5K total per stage (JSON output)
  - Stage 6: ~21K total (Markdown synthesis)
- **Advantage**: Each stage focused, complete data guaranteed, no placeholders

### Development Testing

For rapid testing without filling the 18-field form manually:

1. Navigate to `/research`
2. Click **"🧪 Fill Test Data"** button (top-right corner)
3. Form auto-populates and advances to Step 3
4. Click "Generate Research Report"
5. Watch 6 stages complete: 📊 → 🧠 → 🎯 → 👤 → 💎 → 📝

Test data features realistic executive coaching business context (Ashley Shaw Consulting - women in tech leadership).

### Research Data Editor (Phase 1 MVP)

After generating a research report, users can edit the 15 critical fields that directly impact offer quality:

**How to Access**:
1. Generate a research report (or use test data)
2. Click the **"📝 Edit Research Data"** button that appears after generation
3. Modal editor opens with accordion sections for:
   - 🧠 Buyer Psychology (10 fields - HIGHEST IMPACT)
   - 📊 Market Context (5 fields - Medium impact)

**Key Features**:
- **Pre-populated Fields**: AI-generated data loads automatically for easy editing
- **Auto-save**: Changes saved to localStorage every 500ms
- **Modified Indicators**: Yellow highlights and "Modified" badges show edited fields
- **Character Limits**: Enforced to prevent token budget overflow in offer generation
- **Reset Controls**: Reset individual fields or all fields back to AI original
- **LocalStorage Persistence**:
  - `last-research-data` - Current active data
  - `last-research-data-modified` - User edited version
  - `last-research-data-original` - AI-generated original for comparison

**Why Only 15 Fields?**
Due to the 24K token budget in offer generation, only ~15 fields from 100+ research fields are actually used. These 15 fields were identified through code analysis and have 10x more impact on final offer quality than other fields.

**Documentation**: See `docs/RESEARCH-DATA-EDITOR-IMPLEMENTATION.md` and `docs/RESEARCH-DATA-EDITOR-USER-GUIDE.md` for full details.

## Documentation

- **[CLAUDE.md](CLAUDE.md)** (this file) - Main development guide
- **[RESEARCH-GENERATOR.md](RESEARCH-GENERATOR.md)** - Market Intelligence Generator feature documentation
- **[MULTI-STAGE-IMPLEMENTATION.md](MULTI-STAGE-IMPLEMENTATION.md)** - Multi-stage research technical implementation
- **[cloudflare-best-practices.md](cloudflare-best-practices.md)** - Cloudflare Workers AI best practices
- **[TESTING.md](TESTING.md)** - Testing procedures and Playwright MCP setup
- **[docs/](docs/)** - Technical documentation, changelogs, and bug fix records
  - **[docs/STAGE6-BUGFIX-CHANGELOG.md](docs/STAGE6-BUGFIX-CHANGELOG.md)** - Stage 6 synthesis bug fixes (Oct 2025)
  - **[docs/RESEARCH-DATA-EDITING-ANALYSIS.md](docs/RESEARCH-DATA-EDITING-ANALYSIS.md)** - Analysis and recommendation for Research Data Editor
  - **[docs/RESEARCH-DATA-EDITOR-IMPLEMENTATION.md](docs/RESEARCH-DATA-EDITOR-IMPLEMENTATION.md)** - Technical implementation details
  - **[docs/RESEARCH-DATA-EDITOR-USER-GUIDE.md](docs/RESEARCH-DATA-EDITOR-USER-GUIDE.md)** - User guide for the Research Data Editor

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
