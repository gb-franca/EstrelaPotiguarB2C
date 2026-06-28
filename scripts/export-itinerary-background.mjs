import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'export-itinerary-background.html');
const outputPath = path.join(__dirname, '..', 'src', 'assets', 'itinerary-background.png');

const WIDTH = 1920;
const HEIGHT = 1080;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
await page.goto(`file://${htmlPath}`);
await page.screenshot({ path: outputPath, type: 'png' });
await browser.close();

console.log(`Saved ${outputPath} (${WIDTH}x${HEIGHT})`);
