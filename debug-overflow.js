const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:8000');
  await page.waitForLoadState('load');

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log('scrollWidth:', scrollWidth, 'clientWidth:', clientWidth, 'overflow:', scrollWidth - clientWidth);

  // Check if img is visible
  const imgVisible = await page.evaluate(() => {
    const img = document.querySelector('.hero img');
    return img ? window.getComputedStyle(img).display !== 'none' : 'no img';
  });
  console.log('img visible:', imgVisible);

  // Check all elements that might cause overflow
  const elements = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const overflowing = [];
    for (const el of allElements) {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        overflowing.push({
          tag: el.tagName,
          class: el.className,
          width: rect.width,
          right: rect.right,
          left: rect.left
        });
      }
    }
    return overflowing.slice(0, 10); // First 10
  });
  console.log('Overflowing elements:', elements);

  await browser.close();
})();