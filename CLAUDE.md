# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Cloudflare Pages** application that provides a web-based chat interface for exploring Cloudflare Workers AI text generation models. It uses Hono as the web framework, Vite for building, and Tailwind CSS for styling.

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
   - Single route: `POST /api/chat`
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
  index.tsx       - Hono app, main entry point, /api/chat endpoint
  renderer.tsx    - JSX renderer for HTML shell
  style.css       - Tailwind input file
  global.d.ts     - TypeScript declarations

public/
  static/
    script.js     - Client-side chat logic, model list
    style.css     - Compiled Tailwind output (generated)
    cloudflare-logo.png
  favicon.ico

dist/              - Build output (generated)
  _worker.js       - Compiled Hono worker
  static/          - Static assets
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

The `/api/chat` endpoint:
1. Calls `c.env.AI.run(model, { messages, stream: true })`
2. Receives Server-Sent Events stream
3. Pipes through `EventSourceParserStream` to parse SSE
4. Uses `streamText()` to stream tokens back to client
5. Client reads stream via `response.body.pipeThrough(new TextDecoderStream())`

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
