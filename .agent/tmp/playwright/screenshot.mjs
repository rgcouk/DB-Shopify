import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = '/Users/ricky/.gemini/antigravity/brain/ca25e276-259f-4417-9d79-2147ae72a746';

async function main() {
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Scroll down progressively to trigger lazy loading
    for (let i = 0; i < 20; i++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await page.waitForTimeout(500);
    }

    // Wait a moment for any final images/animations
    await page.waitForTimeout(1000);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    console.log('Capturing full page screenshot...');
    await page.screenshot({
        path: `${SCREENSHOTS_DIR}/localhost_homepage_full_playwright.png`,
        fullPage: true,
    });

    await browser.close();
    console.log('Saved to localhost_homepage_full_playwright.png');
}

main().catch(console.error);
