# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Cloudflare Pages** application with three main features:

1. **Chat Interface** (`/`) - Interactive chat for exploring Cloudflare Workers AI text generation models
2. **Market Intelligence Generator** (`/research`) - Comprehensive market research report generator for businesses (Stages 1-6)
3. **Strategic Offer Design** (`/offer-design`) - AI-powered offer creation with pricing, bonuses, and upsells (Stages 7-13)
4. **Content Strategy Generator** (`/content-strategy`) - Content pillar strategy generator for building authority and driving traffic (Stage 17)

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
     - `GET /offer-design` - Offer Design Generator form (Stages 7-13)
     - `POST /api/offer/stage/7` through `/api/offer/stage/13` - Offer generation endpoints
     - `GET /content-strategy` - Content Strategy Generator (Stage 17)
     - `POST /api/content/stage/17` - Content pillar strategy generation
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
    content-strategy-form.tsx    - Content Strategy Generator component
  prompts/
    stage1-market-analysis.ts    - Stage 1: Market validation & Power 4%
    stage2-buyer-psychology.ts   - Stage 2: Buyer language, fears, desires
    stage3-competitive-analysis.ts - Stage 3: Competitor intelligence
    stage4-avatar-creation.ts    - Stage 4: Dream customer persona
    stage5-offer-design.ts       - Stage 5: Pricing, messaging, bonuses
    stage6-report-synthesis-condensed.ts - Stage 6: Final markdown report assembly
    stage7-offer-rationale.ts    - Stage 7: Offer rationale & unique mechanism
    stage8-value-stack.ts        - Stage 8: Value stack components
    stage9-price-positioning.ts  - Stage 9: Price positioning & anchoring
    stage10-bonuses.ts           - Stage 10: Bonus design & stacking
    stage11-guarantee.ts         - Stage 11: Risk reversal & guarantees
    stage12-power-guarantee.ts   - Stage 12: Power guarantee design
    stage13-upsell.ts            - Stage 13: Upsell & downsell paths
    stage17-pillars.ts           - Stage 17: Content pillar strategy

public/
  static/
    script.js                    - Client-side chat logic, model list
    research.js                  - Client-side research form logic
    research-editor.js           - Research Data Editor modal component
    content-strategy.js          - Content Strategy Generator client-side logic
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

# AI Gateway configuration for monitoring and observability
[vars]
AI_GATEWAY_NAME = "observe"
```

This binds Cloudflare Workers AI to `c.env.AI` in the Hono context. The binding is:
- **Available**: When deployed to Cloudflare Pages
- **Unavailable**: During local `wrangler pages dev`

The code in `src/index.tsx` detects missing AI binding and returns mock responses for local dev.

### AI Gateway Integration

All AI requests are routed through Cloudflare AI Gateway ("observe") for monitoring, analytics, and caching.

**Dashboard**: [View AI Gateway Analytics](https://dash.cloudflare.com/78dde92d5e604fcfcc21f110b421ba79/ai/ai-gateway/gateways/observe/overview)

**Configuration** (`src/index.tsx:62`):
```typescript
const getGatewayConfig = (gatewayName?: string) => {
  if (!gatewayName) {
    return {}; // No gateway configuration if missing gateway name
  }

  return {
    gateway: {
      id: gatewayName, // Just the gateway name (e.g., "observe")
      skipCache: false, // Enable caching for improved performance
      cacheTtl: 3360,   // Cache TTL in seconds (~1 hour)
    }
  };
};
```

**What gets monitored**:
- All chat messages (`/api/chat`)
- All research generation stages (Stages 1-6)
- All offer generation stages (Stages 7-13)
- Content strategy generation (Stage 17)

**Benefits**:
- Real-time usage analytics and cost tracking
- Response caching (1 hour TTL) for improved performance
- Latency and error monitoring
- Token usage analytics across all models

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
**Documentation**: See `RESEARCH-GENERATOR.md` for full details

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

## Content Strategy Generator

**Route**: `/content-strategy`
**Documentation**: See `docs/CONTENT-STRATEGY-USER-GUIDE.md` and `docs/CONTENT-STRATEGY-IMPLEMENTATION.md` for full details

### Key Features

- **Content Pillar Generation**: Creates 3-5 strategic content themes based on market research and offer positioning
- **Example Topics**: 10-15 content ideas per pillar (50+ total topics)
- **Content Mix Framework**: Visual breakdown of Educational/Entertaining/Promotional/Engagement content percentages
- **Accordion Interface**: Expand/collapse pillars to view detailed information
- **Edit Functionality**: Modify pillar names, descriptions, business goals, and frequency percentages
- **Save & Export**: LocalStorage persistence with JSON export capability
- **Fill Test Data Button**: Development tool (🧪 button) auto-loads research + offer test data

### Generation Architecture

**Single-Stage AI Call:**
- Time: 3-4 minutes
- Cost: ~$0.02 per generation
- Quality: Strategic, research-backed content pillars aligned with buyer psychology
- Use case: Create content strategy after completing research and offer design

**Prerequisites:**
- **Required**: Market Research (Stages 1-2 minimum)
- **Recommended**: Offer Design (Stages 7-8) for positioning alignment
- **Color Indicators**:
  - 🔴 Red: Missing required research data
  - 🟡 Yellow: Have research, missing offer (can generate but less targeted)
  - 🟢 Green: Have both research + offer (optimal results)

### Token Budget

**Stage 17 Architecture:**
- Single AI call within 24K context window:
  - Input: ~12K tokens (business context + research data + offer data + prompt)
  - Output: ~3K tokens (3-5 pillars with topics)
  - Buffer: ~9K tokens unused
- **Advantage**: Fast generation (3-4 min), strategic focus, complete data in one call

### Content Strategy Output

**What You Get:**
```json
{
  "pillar_count": 4,
  "pillars": [
    {
      "pillar_name": "Authority Building",
      "description": "Establish expertise and thought leadership...",
      "audience_value": "Learn cutting-edge strategies...",
      "business_goal": "Position as category leader...",
      "buyer_psychology_tie": "Addresses fear: 'Being Found Out'...",
      "example_topics": [
        "5 leadership mistakes that sabotage women in tech",
        "How to command respect in male-dominated meetings",
        // ... 13 more topics
      ],
      "frequency_percentage": 30
    }
    // ... 3-4 more pillars
  ],
  "content_mix_framework": {
    "educational": 45,
    "entertaining": 25,
    "promotional": 20,
    "engagement": 10
  },
  "strategic_rationale": "Your content strategy focuses on...",
  "competitive_differentiation": "Unlike competitors who..."
}
```

### Development Testing

For rapid testing without completing prerequisites:

1. Navigate to `/content-strategy`
2. Click **"🧪 Fill Test Data"** button (top-right corner)
3. Test data loads:
   - Business context (Ashley Shaw Consulting example)
   - Research data (Stages 1-2: market + buyer psychology)
   - Offer data (Stages 7-8: offer rationale + value stack)
4. Prerequisites status changes to **GREEN**
5. 4 mock content pillars display instantly
6. Can also test real generation by clicking "🎯 Generate Content Pillars"

Test data enables both UI testing (instant mock results) AND real AI testing (3-4 min generation with test data).

### UI Features

**Accordion Interface:**
- Click pillar header to expand/collapse content
- Chevron icon rotates to show state
- Multiple pillars can be expanded simultaneously

**Edit Mode:**
- Click "✏️ Edit" button on any pillar
- Edit form appears with:
  - Pillar Name (max 50 chars)
  - Description (max 200 chars)
  - Value Proposition (max 150 chars)
  - Business Goal (max 150 chars)
  - Psychology Tie (max 150 chars)
  - Frequency Percentage (0-100)
- Character counters with color warnings (green/orange/red)
- Save or cancel changes
- Modified pillars show yellow "MODIFIED" badge

**Content Mix Bars:**
- Visual representation of content type distribution
- Animated bar charts with color coding:
  - 📘 Educational (Blue): How-to guides, tutorials
  - 🎭 Entertaining (Green): Stories, case studies
  - 💰 Promotional (Purple): Product features, offers
  - 💬 Engagement (Orange): Questions, polls

**LocalStorage Persistence:**
- `content-pillar-strategy` - Current active strategy
- `content-pillar-strategy-original` - Pristine AI-generated copy
- `content-pillar-strategy-modified` - Exists if user made edits

**Export JSON:**
- Click "📥 Export JSON" to download
- Filename: `content-strategy-YYYYMMDD-HHMMSS.json`
- Use for backup, archival, or external tools

### Known Limitations

- **LocalStorage Only**: No cloud sync, per-browser/per-device storage
- **Single Strategy**: Can only store one active strategy at a time
- **No Undo/Redo**: Edits are permanent once saved (must regenerate or restore from original)
- **No Topic-Level Editing**: Must edit entire pillar, cannot add/remove individual topics
- **No Pillar Reordering**: Display order based on frequency percentage
- **No Collaboration**: Single-user system, no team editing

**Workarounds**: Export JSON regularly for backups, use external tools for extended functionality

**Future Enhancements**: Cloud storage, multiple strategy profiles, topic-level CRUD, drag-and-drop reordering, PDF export

**Full Details**: See `docs/CONTENT-STRATEGY-KNOWN-ISSUES.md`

## Documentation

- **[CLAUDE.md](CLAUDE.md)** (this file) - Main development guide
- **[RESEARCH-GENERATOR.md](RESEARCH-GENERATOR.md)** - Market Intelligence Generator feature documentation
- **[cloudflare-best-practices.md](cloudflare-best-practices.md)** - Cloudflare Workers AI best practices
- **[TESTING.md](TESTING.md)** - Testing procedures and Playwright MCP setup
- **[docs/](docs/)** - Technical documentation, changelogs, and bug fix records
  - **Content Strategy Generator (Stage 17)**:
    - **[docs/CONTENT-STRATEGY-USER-GUIDE.md](docs/CONTENT-STRATEGY-USER-GUIDE.md)** - User guide for Content Strategy Generator
    - **[docs/CONTENT-STRATEGY-IMPLEMENTATION.md](docs/CONTENT-STRATEGY-IMPLEMENTATION.md)** - Technical implementation details
    - **[docs/CONTENT-STRATEGY-TESTING-GUIDE.md](docs/CONTENT-STRATEGY-TESTING-GUIDE.md)** - Comprehensive testing procedures
    - **[docs/CONTENT-STRATEGY-KNOWN-ISSUES.md](docs/CONTENT-STRATEGY-KNOWN-ISSUES.md)** - Known limitations and workarounds
    - **[docs/CONTENT-STRATEGY-API.md](docs/CONTENT-STRATEGY-API.md)** - Stage 17 API specifications
    - **[docs/CONTENT-STRATEGY-DEPLOYMENT-VALIDATION.md](docs/CONTENT-STRATEGY-DEPLOYMENT-VALIDATION.md)** - Deployment validation report
    - **[docs/CONTENT-STRATEGY-TEST-DATA-ENHANCEMENT.md](docs/CONTENT-STRATEGY-TEST-DATA-ENHANCEMENT.md)** - Test data enhancement details
  - **Research Generator (Stages 1-6)**:
    - **[docs/STAGE6-BUGFIX-CHANGELOG.md](docs/STAGE6-BUGFIX-CHANGELOG.md)** - Stage 6 synthesis bug fixes (Oct 2025)
    - **[docs/RESEARCH-DATA-EDITING-ANALYSIS.md](docs/RESEARCH-DATA-EDITING-ANALYSIS.md)** - Research Data Editor analysis
    - **[docs/RESEARCH-DATA-EDITOR-IMPLEMENTATION.md](docs/RESEARCH-DATA-EDITOR-IMPLEMENTATION.md)** - Research Data Editor implementation
    - **[docs/RESEARCH-DATA-EDITOR-USER-GUIDE.md](docs/RESEARCH-DATA-EDITOR-USER-GUIDE.md)** - Research Data Editor user guide

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
