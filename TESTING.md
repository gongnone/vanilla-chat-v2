# Testing Guide

## Playwright MCP Setup

This project uses Playwright MCP (Model Context Protocol) for browser automation and E2E testing.

### Installation Complete ✅

- `@executeautomation/playwright-mcp-server` - Installed
- `playwright` - Installed
- Chromium browser - Downloaded

### Configuration

The MCP server is configured in `.vscode/settings.json` and will be automatically available in Claude Code.

If you need to configure it manually:

1. Open Command Palette (`Cmd+Shift+P`)
2. Search for "Claude Code: Open MCP Settings"
3. The configuration is already set to use the local installation

### Using Playwright MCP with Claude Code

Simply ask Claude Code to perform browser automation tasks, for example:

**"Navigate to the deployed chat app and take a screenshot"**

Claude Code will automatically use the Playwright MCP to:
1. Launch a browser
2. Navigate to your URL
3. Capture screenshots
4. Interact with the page

### Testing Workflow

#### 1. Deploy Preview
```bash
npm run preview:remote
```
This creates a temporary deployment with real AI.

#### 2. Ask Claude to Test

Example prompts:
- "Navigate to [preview URL] and test sending a message"
- "Screenshot the chat interface after sending 'Hello'"
- "Verify that markdown rendering works in the chat"
- "Test the model selector dropdown"
- "Check if the system message configuration works"

#### 3. Review Results

Claude Code will:
- Show screenshots
- Report any issues found
- Suggest improvements

### Example Test Scenarios

**Visual Regression**
```
"Navigate to [URL], screenshot the initial state,
send a message, wait for response, screenshot final state"
```

**Functionality Test**
```
"Navigate to [URL], select a different model,
send a test message, verify the response streams correctly"
```

**Mobile Test**
```
"Navigate to [URL] in mobile viewport (375x667),
verify the chat interface is responsive"
```

**Performance Test**
```
"Navigate to [URL], measure page load time,
check if the page is interactive within 3 seconds"
```

### Limitations

- **Local dev cannot be tested with real AI** - Deploy preview first
- **AI responses require remote deployment** - Use `npm run preview:remote`
- Screenshots are saved to `/tmp` by default

### Debugging

If Playwright MCP isn't working:

1. Check browser installation:
   ```bash
   npx playwright install chromium
   ```

2. Test Playwright directly:
   ```bash
   npx playwright codegen https://vanilla-chat-demo-tmpl-al4.pages.dev
   ```

3. Verify MCP server:
   ```bash
   node node_modules/@executeautomation/playwright-mcp-server/dist/index.js
   ```

### Manual Playwright Scripts

You can also create traditional Playwright test files in a `tests/` directory if needed. See [Playwright documentation](https://playwright.dev) for details.
