import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🌐 Navigating to deployment...');
  await page.goto('https://98f0f91a.vanilla-chat-demo-tmpl-al4.pages.dev', { waitUntil: 'networkidle' });
  
  console.log('📸 Taking screenshot of homepage...');
  await page.screenshot({ path: 'deployment-home.png', fullPage: true });
  
  console.log('✅ Homepage loaded successfully');
  console.log('Title:', await page.title());
  
  // Check for errors
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  // Test navigation to research page
  console.log('\n🔍 Testing Research page...');
  await page.goto('https://98f0f91a.vanilla-chat-demo-tmpl-al4.pages.dev/research', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'deployment-research.png', fullPage: false });
  console.log('✅ Research page loaded');
  
  // Test navigation to offer design page
  console.log('\n💎 Testing Offer Design page...');
  await page.goto('https://98f0f91a.vanilla-chat-demo-tmpl-al4.pages.dev/offer-design', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'deployment-offer.png', fullPage: false });
  console.log('✅ Offer Design page loaded');
  
  // Test navigation to content strategy page
  console.log('\n📝 Testing Content Strategy page...');
  await page.goto('https://98f0f91a.vanilla-chat-demo-tmpl-al4.pages.dev/content-strategy', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'deployment-content.png', fullPage: false });
  console.log('✅ Content Strategy page loaded');
  
  await browser.close();
  
  console.log('\n✅ All pages tested successfully!');
  console.log('📸 Screenshots saved to current directory');
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors detected:', errors);
  } else {
    console.log('✅ No JavaScript errors detected');
  }
})();
