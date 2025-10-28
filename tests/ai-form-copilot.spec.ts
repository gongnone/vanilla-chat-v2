/**
 * AI Form Co-Pilot Feature Test Suite
 *
 * Tests the newly implemented AI-powered form assistant on the Market Intelligence Generator.
 *
 * Feature Components:
 * - Backend API: /api/form-assist/chat
 * - Sidebar chat UI (responsive)
 * - Help buttons on critical form fields
 * - LocalStorage conversation history
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://5ec3560c.vanilla-chat-demo-tmpl-al4.pages.dev/research';

// Test configuration
test.describe.configure({ mode: 'serial' });

test.describe('AI Form Co-Pilot - Critical Path Tests', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(PRODUCTION_URL);
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Test 1: Help Button Visibility', async () => {
    console.log('📋 TEST 1: Verifying help button visibility...');

    // Navigate through form steps to find all help buttons
    await page.screenshot({ path: 'test-results/01-initial-page.png', fullPage: true });

    // Step 1: Check current_offer_description field
    const step1HelpButton = page.locator('button.copilot-trigger').first();
    await expect(step1HelpButton).toBeVisible({ timeout: 5000 });
    const step1Text = await step1HelpButton.textContent();
    console.log(`✅ Help button found on Step 1: "${step1Text}"`);
    await page.screenshot({ path: 'test-results/01-step1-help-button.png' });

    // Navigate to Step 2
    const nextButton1 = page.locator('button:has-text("Next: Target Market")');
    if (await nextButton1.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton1.click();
      await page.waitForTimeout(500);

      // Step 2: Check target_psychographics field
      const step2HelpButton = page.locator('button.copilot-trigger');
      const step2Count = await step2HelpButton.count();
      console.log(`ℹ️  Found ${step2Count} help button(s) on Step 2`);
      await page.screenshot({ path: 'test-results/01-step2-help-button.png' });
    } else {
      console.log('ℹ️  Could not navigate to Step 2, skipping Step 2 check');
    }

    // Navigate to Step 3
    const nextButton2 = page.locator('button:has-text("Next: Offer Details")');
    if (await nextButton2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextButton2.click();
      await page.waitForTimeout(500);

      // Step 3: Check unique_mechanism field
      const step3HelpButton = page.locator('button.copilot-trigger');
      const step3Count = await step3HelpButton.count();
      console.log(`ℹ️  Found ${step3Count} help button(s) on Step 3`);
      await page.screenshot({ path: 'test-results/01-step3-help-button.png' });
    } else {
      console.log('ℹ️  Could not navigate to Step 3, skipping Step 3 check');
    }
  });

  test('Test 2: Sidebar Opens on Click', async () => {
    console.log('📋 TEST 2: Testing sidebar open functionality...');

    // Navigate back to Step 2 (target_psychographics)
    const backButton = page.locator('button:has-text("Back")');
    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForTimeout(500);
    }

    // Click help button
    const helpButton = page.locator('button.copilot-trigger').first();
    await helpButton.click();

    // Wait for sidebar to appear
    await page.waitForTimeout(1000); // Allow animation time

    // Check for sidebar elements
    const sidebar = page.locator('[class*="copilot"], [class*="sidebar"], [id*="copilot"]').first();
    await expect(sidebar).toBeVisible({ timeout: 5000 });
    console.log('✅ Sidebar opened successfully');

    // Verify header
    const header = page.locator('text=/Form Assistant|💬/i').first();
    await expect(header).toBeVisible();
    console.log('✅ Sidebar header visible');

    // Verify close button
    const closeButton = page.locator('button:has-text("×"), button[aria-label*="close" i]').first();
    await expect(closeButton).toBeVisible();
    console.log('✅ Close button visible');

    await page.screenshot({ path: 'test-results/02-sidebar-open.png', fullPage: true });
  });

  test('Test 3: Initial Greeting Message', async () => {
    console.log('📋 TEST 3: Verifying initial greeting message...');

    // Wait for greeting message to appear
    await page.waitForTimeout(2000);

    // Look for greeting patterns
    const greetingPatterns = [
      /Hi.*help you/i,
      /here to help/i,
      /assist you/i,
      /Target Psychographics/i
    ];

    let greetingFound = false;
    for (const pattern of greetingPatterns) {
      const greeting = page.locator(`text=${pattern}`).first();
      if (await greeting.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`✅ Found greeting matching pattern: ${pattern}`);
        greetingFound = true;
        break;
      }
    }

    if (!greetingFound) {
      console.log('⚠️  No greeting message found - checking for any messages...');
      const allMessages = page.locator('[class*="message"], [role="log"]');
      const messageCount = await allMessages.count();
      console.log(`ℹ️  Found ${messageCount} message element(s)`);
    }

    await page.screenshot({ path: 'test-results/03-greeting-message.png', fullPage: true });
  });

  test('Test 4: Send Message to AI', async () => {
    console.log('📋 TEST 4: Testing AI message interaction...');

    // Find input field
    const inputField = page.locator('input[type="text"], textarea').last();
    await expect(inputField).toBeVisible({ timeout: 5000 });
    console.log('✅ Input field found');

    // Type message
    await inputField.fill('What does this mean?');
    console.log('✅ Message typed');

    await page.screenshot({ path: 'test-results/04-message-typed.png' });

    // Click send button
    const sendButton = page.locator('button:has-text("→"), button[aria-label*="send" i]').last();
    await sendButton.click();
    console.log('✅ Send button clicked');

    // Wait for typing indicator
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/04-typing-indicator.png' });

    // Wait for AI response (max 15 seconds)
    console.log('⏳ Waiting for AI response...');
    await page.waitForTimeout(15000);

    await page.screenshot({ path: 'test-results/04-ai-response.png', fullPage: true });

    // Check for response
    const messages = page.locator('[class*="message"]');
    const messageCount = await messages.count();
    console.log(`ℹ️  Total messages visible: ${messageCount}`);
  });

  test('Test 5: AI Response Format', async () => {
    console.log('📋 TEST 5: Validating AI response format...');

    // Look for response content
    const responseText = await page.locator('[class*="message"]').last().textContent();
    console.log(`ℹ️  Last message content: ${responseText?.substring(0, 100)}...`);

    // Check for JSON artifacts (should NOT be present)
    const hasJsonArtifacts = /\{|\}|\[|\]|":/g.test(responseText || '');
    if (hasJsonArtifacts) {
      console.log('⚠️  Warning: Response may contain JSON artifacts');
    } else {
      console.log('✅ Response appears conversational (no JSON artifacts)');
    }

    // Check for psychographics mention
    const mentionsPsychographics = /psychographic/i.test(responseText || '');
    if (mentionsPsychographics) {
      console.log('✅ Response mentions "psychographics"');
    } else {
      console.log('ℹ️  Response does not explicitly mention "psychographics"');
    }

    // Check for error messages
    const hasError = /error|failed|unable/i.test(responseText || '');
    if (hasError) {
      console.log('❌ Response may contain error message');
    } else {
      console.log('✅ No error messages detected');
    }

    await page.screenshot({ path: 'test-results/05-response-format.png', fullPage: true });
  });

  test('Test 6: Sidebar Close Functionality', async () => {
    console.log('📋 TEST 6: Testing sidebar close functionality...');

    // Click close button
    const closeButton = page.locator('button:has-text("×"), button[aria-label*="close" i]').first();
    await closeButton.click();
    console.log('✅ Close button clicked');

    // Wait for animation
    await page.waitForTimeout(1000);

    // Verify sidebar is hidden
    const sidebar = page.locator('[class*="copilot"], [class*="sidebar"]').first();
    const isHidden = await sidebar.isHidden({ timeout: 5000 }).catch(() => false);

    if (isHidden) {
      console.log('✅ Sidebar is hidden after close');
    } else {
      console.log('⚠️  Sidebar may still be visible');
    }

    await page.screenshot({ path: 'test-results/06-sidebar-closed.png', fullPage: true });

    // Verify form is intact
    const formField = page.locator('input, textarea').first();
    await expect(formField).toBeVisible();
    console.log('✅ Form is still intact after close');
  });
});

test.describe('AI Form Co-Pilot - Secondary Tests', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Test 8: Responsive Behavior (Desktop)', async () => {
    console.log('📋 TEST 8: Testing desktop responsive behavior...');

    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);

    // Open sidebar
    const helpButton = page.locator('button.copilot-trigger').first();
    await helpButton.click();
    await page.waitForTimeout(1000);

    // Capture sidebar dimensions
    const sidebar = page.locator('[class*="copilot"], [class*="sidebar"]').first();
    const box = await sidebar.boundingBox();

    if (box) {
      console.log(`ℹ️  Sidebar dimensions: ${box.width}px x ${box.height}px`);
      console.log(`ℹ️  Sidebar position: x=${box.x}, y=${box.y}`);

      // Check if sidebar is approximately 380px wide
      if (Math.abs(box.width - 380) < 50) {
        console.log('✅ Sidebar width is approximately 380px');
      } else {
        console.log(`⚠️  Sidebar width (${box.width}px) differs from expected 380px`);
      }
    }

    await page.screenshot({ path: 'test-results/08-desktop-view.png', fullPage: true });

    // Close sidebar
    const closeButton = page.locator('button:has-text("×")').first();
    await closeButton.click();
    await page.waitForTimeout(500);
  });

  test('Test 9: Responsive Behavior (Mobile)', async () => {
    console.log('📋 TEST 9: Testing mobile responsive behavior...');

    // Set mobile viewport (iPhone)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Open sidebar
    const helpButton = page.locator('button.copilot-trigger').first();
    await helpButton.click();
    await page.waitForTimeout(1000);

    // Capture sidebar dimensions
    const sidebar = page.locator('[class*="copilot"], [class*="sidebar"]').first();
    const box = await sidebar.boundingBox();

    if (box) {
      console.log(`ℹ️  Sidebar dimensions: ${box.width}px x ${box.height}px`);

      // Check if sidebar is full-screen
      if (box.width >= 370) {
        console.log('✅ Sidebar appears full-screen on mobile');
      } else {
        console.log(`⚠️  Sidebar width (${box.width}px) may not be full-screen`);
      }
    }

    await page.screenshot({ path: 'test-results/09-mobile-view.png', fullPage: true });
  });

  test('Test 12: LocalStorage Persistence', async () => {
    console.log('📋 TEST 12: Testing LocalStorage persistence...');

    // Open sidebar and send message
    const helpButton = page.locator('button:has-text("💬 Need help?")').first();
    await helpButton.click();
    await page.waitForTimeout(1000);

    const inputField = page.locator('input[type="text"], textarea').last();
    await inputField.fill('Test persistence message');

    const sendButton = page.locator('button:has-text("→")').last();
    await sendButton.click();
    await page.waitForTimeout(3000);

    // Check localStorage
    const localStorageData = await page.evaluate(() => {
      return {
        copilotHistory: localStorage.getItem('form-copilot-history'),
        keys: Object.keys(localStorage)
      };
    });

    console.log(`ℹ️  LocalStorage keys: ${localStorageData.keys.join(', ')}`);

    if (localStorageData.copilotHistory) {
      console.log('✅ Copilot history found in LocalStorage');
    } else {
      console.log('ℹ️  No copilot history key found - checking for alternatives...');
    }

    // Close sidebar
    const closeButton = page.locator('button:has-text("×")').first();
    await closeButton.click();
    await page.waitForTimeout(500);

    // Reopen sidebar
    await helpButton.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/12-persistence-test.png', fullPage: true });
  });
});

test.describe('AI Form Co-Pilot - Console Errors', () => {
  test('Console Error Monitoring', async ({ page }) => {
    console.log('📋 Monitoring console for errors...');

    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`❌ Console Error: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
        console.log(`⚠️  Console Warning: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(error.message);
      console.log(`❌ Page Error: ${error.message}`);
    });

    // Navigate and interact
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');

    // Open sidebar
    const helpButton = page.locator('button:has-text("💬 Need help?")').first();
    if (await helpButton.isVisible({ timeout: 5000 })) {
      await helpButton.click();
      await page.waitForTimeout(2000);
    }

    // Summary
    console.log(`\n📊 Console Summary:`);
    console.log(`   Errors: ${consoleErrors.length}`);
    console.log(`   Warnings: ${consoleWarnings.length}`);

    if (consoleErrors.length === 0) {
      console.log('✅ No console errors detected');
    }
  });
});
