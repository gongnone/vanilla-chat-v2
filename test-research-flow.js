import { chromium } from '@playwright/test';

(async () => {
  console.log('🚀 Starting browser test of research flow...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for ALL console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });

  // Listen for network errors
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    if (url.includes('/api/research/stage/') && status !== 200) {
      console.log(`❌ API Error: ${url} - Status ${status}`);
    } else if (url.includes('/api/research/stage/')) {
      console.log(`✅ API Success: ${url} - Status ${status}`);
    }
  });

  // Navigate to research page
  console.log('📍 Navigating to research page...');
  await page.goto('https://10586a03.vanilla-chat-demo-tmpl-al4.pages.dev/research');
  await page.waitForLoadState('networkidle');

  console.log('✅ Page loaded\n');

  // Click the test data button
  console.log('🧪 Clicking Fill Test Data button...');
  await page.click('button:has-text("Fill Test Data")');
  await page.waitForTimeout(1000);

  console.log('✅ Test data filled\n');

  // Note: Multi-stage is now the default and only option (no toggle needed)
  console.log('ℹ️  Multi-stage generation is now default\n');

  // Start the research
  console.log('🔬 Starting research generation...\n');
  await page.click('button:has-text("Generate Research Report")');

  // Wait for stages to complete (max 5 minutes)
  console.log('⏳ Waiting for research to complete (max 5 minutes)...\n');

  try {
    // Wait for the report content to appear
    await page.waitForSelector('#report-content', { timeout: 300000 });

    console.log('\n✅ Report container appeared. Waiting for streaming to complete...\n');

    // Wait for streaming to complete - check if content is no longer the placeholder
    let streamingComplete = false;
    let attempts = 0;
    const maxAttempts = 180; // 3 minutes (180 * 1 second)

    while (!streamingComplete && attempts < maxAttempts) {
      const reportText = await page.textContent('#report-content');

      // Check if still showing placeholder or if we have substantial content
      if (!reportText.includes('Synthesizing final report') && reportText.length > 1000) {
        streamingComplete = true;
        console.log(`✅ Streaming complete! Report length: ${reportText.length} characters\n`);
      } else {
        if (attempts % 10 === 0) {
          console.log(`⏳ Still streaming... (${reportText.length} chars, ${attempts}s elapsed)`);
        }
        await page.waitForTimeout(1000);
        attempts++;
      }
    }

    if (!streamingComplete) {
      console.warn('⚠️  Streaming timeout - capturing current state\n');
    }

    // Get final report content
    const reportText = await page.textContent('#report-content');
    const reportHTML = await page.innerHTML('#report-content');
    console.log(`\n📄 Final report length: ${reportText.length} characters`);
    console.log(`📝 Report text preview (first 300 chars):\n${reportText.substring(0, 300)}...\n`);
    console.log(`📝 Report text preview (last 300 chars):\n...${reportText.substring(reportText.length - 300)}\n`);

    // Take a screenshot
    await page.screenshot({ path: '/tmp/research-success.png', fullPage: true });
    console.log('📸 Screenshot saved to /tmp/research-success.png\n');

  } catch (error) {
    console.error(`\n❌ Test failed: ${error.message}\n`);

    // Take error screenshot
    await page.screenshot({ path: '/tmp/research-error.png', fullPage: true });
    console.log('📸 Error screenshot saved to /tmp/research-error.png\n');
  }

  console.log('🏁 Test complete. Browser will close in 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
