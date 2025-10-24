# Vanilla JavaScript Chat Application using Cloudflare Workers AI

A web based chat interface built on [Cloudflare Pages](https://pages.cloudflare.com) that allows for exploring [Text Generation models](https://developers.cloudflare.com/workers-ai/models/#text-generation) on [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/). Design is built using [tailwind](https://tailwindcss.com/).

[<img src="https://img.youtube.com/vi/5UTExUQ8Fwo/0.jpg">](https://youtu.be/5UTExUQ8Fwo "Workers AI - Getting Started - Vanilla Chat App")

This demo makes use of [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to maintain state. We have better solutions available (moar coming soon).

This is a template repository. Please feel free to create your own repository from this one by using the "Use this template" button. It's right next to the ⭐️ this repo button, which you could totally do as well if you wanted to.

This is, like all of us, a Work in Progress.

## Features

- **Chat Interface** (`/`) - Interactive chat with multiple AI models
- **Market Research Generator** (`/research`) - Comprehensive business research tool with 18-field context collection and AI-powered analysis. See [RESEARCH-GENERATOR.md](./RESEARCH-GENERATOR.md) for details.

## Installation

```bash
npm install
# If this is your first time here
npx wrangler login
```

## Develop

This uses the local Vite server for rapid development

```bash
npm run dev
```

### Preview

This builds and runs in Wrangler your site locally, just as it will run on production

```bash
npm run preview
```

## Deploy

This hosts your site on [Cloudflare Pages](https://pages.cloudflare.com)

```bash
npm run deploy
```

###  Debug

```bash
npx wrangler pages deployment tail
```

## Advanced

If you are on a Mac, you can generate the list of models in [script.js](./public/static/script.js) by running the following commands:

```bash
# If this is your first time here. You won't regret it.
brew install jq
```

```bash
# Filter all Text Generation models into "ga" and "beta"
npx wrangler ai models --json | jq ' 
  reduce .[] as $item (
    {beta: [], ga: []};
    if ($item.task.name == "Text Generation") then
      if ($item.properties | any(.property_id == "beta" and .value == "true")) then
        .beta += [$item.name]
      else
        .ga += [$item.name]
      end
    else
      .
    end
  ) |
  .beta |= sort |
  .ga |= sort
'
```


# Testing Procedure

For Real AI Testing During Development:

# Terminal 1 - Auto-rebuild on changes:
npm run dev:remote

This watches your files and rebuilds automatically when you save. 

# Terminal 2 - Deploy when ready to test:
npm run preview:remote

This quickly deploys your built files to a preview URL. 

# So your workflow becomes:

Start watch mode once: npm run dev:remote (leave running)
Make your edits in your IDE
Files auto-rebuild (watch mode detects changes)
Deploy to test: npm run preview:remote (only when you want to test)
Visit the preview URL to test with real AI