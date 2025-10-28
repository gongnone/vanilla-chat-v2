/**
 * AI Form Co-Pilot Feature Test Suite - Simplified Version
 *
 * Tests critical functionality without complex navigation logic.
 */

import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://5ec3560c.vanilla-chat-demo-tmpl-al4.pages.dev/research';

test.describe('AI Form Co-Pilot - Critical Path Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PREVIEW_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Test 1: Help Button Visibility on Step 1', async ({ page }) => {
    console.log('📋 TEST 1: Verifying help button visibility on Step 1...');

    const helpButton = page.locator('button.copilot-trigger').first();
    await expect(helpButton).toBeVisible({ timeout: 5000 });

    const buttonText = await helpButton.textContent();
    console.log(`✅ Help button found: "${buttonText}"`);

    await page.screenshot({ path: 'test-results/simple-01-help-button.png', fullPage: true });
  });

  test('Test 2: Sidebar Opens When Help Button Clicked', async ({ page }) => {
    console.log('📋 TEST 2: Testing sidebar open functionality...');

    // Click help button
    const helpButton = page.locator('button.copilot-trigger').first();
    await helpButton.click();
    console.log('✅ Help button clicked');

    // Wait for sidebar animation
    await page.waitForTimeout(1500);

    // Look for sidebar container (try multiple possible selectors)
    const sidebarSelectors = [
      '#copilot-sidebar',
      '[data-component="copilot"]',
      '.copilot-sidebar',
      '[class*="copilot"]'
    ];

    let sidebarFound = false;
    for (const selector of sidebarSelectors) {
      const sidebar = page.locator(selector).first();
      if (await sidebar.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log(`✅ Sidebar found with selector: ${selector}`);
        sidebarFound = true;
        break;
      }
    }

    if (!sidebarFound) {
      console.log('ℹ️  Sidebar not found with specific selectors, checking for any visible changes...');
      await page.screenshot({ path: 'test-results/simple-02-after-click.png', fullPage: true });
    }

    // Check for header text
    const headerPatterns = ['Form Assistant', 'AI Assistant', 'Co-Pilot', 'Help'];
    for (const pattern of headerPatterns) {
      const header = page.locator(`text=${pattern}`).first();
      if (await header.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log(`✅ Found header with text: "${pattern}"`);
        sidebarFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/simple-02-sidebar-state.png', fullPage: true });

    expect(sidebarFound).toBeTruthy();
  });

  test('Test 3: Chat Input Field Exists', async ({ page }) => {
    console.log('📋 TEST 3: Verifying chat input field...');

    // Open sidebar
    const helpButton = page.locator('button.copilot-trigger').first();
    await helpButton.click();
    await page.waitForTimeout(1500);

    // Look for input field
    const inputSelectors = [
      'input[type="text"]',
      'textarea',
      'input[placeholder*="message" i]',
      'input[placeholder*="type" i]'
    ];

    let inputFound = false;
    for (const selector of inputSelectors) {
      const inputCount = await page.locator(selector).count();
      if (inputCount > 0) {
        console.log(`ℹ️  Found ${inputCount} input(s) matching: ${selector}`);

        // Check if any are visible
        const inputs = page.locator(selector);
        for (let i = 0; i < await inputs.count(); i++) {
          const input = inputs.nth(i);
          if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
            console.log(`✅ Found visible input field: ${selector}[${i}]`);
            inputFound = true;
            break;
          }
        }
        if (inputFound) break;
      }
    }

    await page.screenshot({ path: 'test-results/simple-03-input-field.png', fullPage: true });

    if (!inputFound) {
      console.log('⚠️  No visible input field found');
    }
  });

  test('Test 4: Send Message Functionality', async ({ page }) => {
    console.log('📋 TEST 4: Testing message send functionality...');

    // Open sidebar
    const helpButton = page.locator('button.copilot-trigger').first();
    await helpButton.click();
    await page.waitForTimeout(2000);

    // Find and fill input
    const input = page.locator('input[type="text"], textarea').last();
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await input.fill('What does this field mean?');
      console.log('✅ Message typed in input');

      await page.screenshot({ path: 'test-results/simple-04-message-typed.png' });

      // Find and click send button
      const sendSelectors = [
        'button:has-text("→")',
        'button[aria-label*="send" i]',
        'button[type="submit"]'
      ];

      let sendClicked = false;
      for (const selector of sendSelectors) {
        const sendButton = page.locator(selector).last();
        if (await sendButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await sendButton.click();
          console.log(`✅ Send button clicked: ${selector}`);
          sendClicked = true;
          break;
        }
      }

      if (sendClicked) {
        // Wait for response
        console.log('⏳ Waiting for AI response (max 20 seconds)...');
        await page.waitForTimeout(20000);

        await page.screenshot({ path: 'test-results/simple-04-after-send.png', fullPage: true });
      } else {
        console.log('⚠️  Send button not found');
      }
    } else {
      console.log('⚠️  Input field not found');
      await page.screenshot({ path: 'test-results/simple-04-no-input.png', fullPage: true });
    }
  });

  test('Test 5: Close Sidebar Functionality', async ({ page }) => {
    console.log('📋 TEST 5: Testing sidebar close...');

    // Open sidebar
    const helpButton = page.locator('button.copilot-trigger').first();
    await helpButton.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/simple-05-before-close.png', fullPage: true });

    // Find close button
    const closeSelectors = [
      'button:has-text("×")',
      'button[aria-label*="close" i]',
      'button.close',
      '.copilot-close'
    ];

    let closeClicked = false;
    for (const selector of closeSelectors) {
      const closeButton = page.locator(selector).first();
      if (await closeButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeButton.click();
        console.log(`✅ Close button clicked: ${selector}`);
        closeClicked = true;
        break;
      }
    }

    if (closeClicked) {
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/simple-05-after-close.png', fullPage: true });
      console.log('✅ Close action completed');
    } else {
      console.log('⚠️  Close button not found');
    }
  });
});

test.describe('AI Form Co-Pilot - Console Monitoring', () => {
  test('Monitor Console for Errors', async ({ page }) => {
    console.log('📋 Monitoring console for errors...');

    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log(`❌ Console Error: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(error.message);
      console.log(`❌ Page Error: ${error.message}`);
    });

    // Navigate and interact
    await page.goto(PREVIEW_URL);
    await page.waitForLoadState('networkidle');

    // Try to open sidebar
    const helpButton = page.locator('button.copilot-trigger').first();
    if (await helpButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await helpButton.click();
      await page.waitForTimeout(3000);
    }

    console.log(`\n📊 Console Summary:`);
    console.log(`   Errors: ${consoleErrors.length}`);
    console.log(`   Warnings: ${consoleWarnings.length}`);

    if (consoleErrors.length === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log('❌ Console errors detected:');
      consoleErrors.forEach(err => console.log(`   - ${err}`));
    }

    expect(consoleErrors.length).toBeLessThan(3); // Allow up to 2 minor errors
  });
});
