// Generates the Open Graph image for Lancoli Code (1200×630px)
// Uses Playwright to render a canvas and capture the image
// Run from LancoliCode/: node tools/generate-og-image-playwright.mjs

// Use Playwright from Hal
import { chromium } from '../../Hal/node_modules/playwright-core/index.mjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

async function generateOGImage() {
  console.log('🎨 Generating Open Graph image...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });

  // Create HTML content with canvas
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="canvas" width="1200" height="630"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Configuration
    const BG = '#10140f';
    const ACCENT = '#5fb98a';
    const TEXT = '#e8f0e3';
    const RADIUS = 6;

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, 1200, 630);

    // Brand in top-left
    ctx.fillStyle = TEXT;
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('Lancoli', 60, 100);

    ctx.fillStyle = ACCENT;
    ctx.font = '48px monospace';
    ctx.fillText('/code', 230, 100);

    // Main title
    ctx.fillStyle = TEXT;
    ctx.font = 'bold 72px sans-serif';
    ctx.fillText('Journal de bord', 60, 220);

    // Subtitle
    ctx.fillStyle = TEXT;
    ctx.font = '36px sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText('Projets · UX · Design · Développement', 60, 290);
    ctx.globalAlpha = 1;

    // Visual elements representing the devlog
    const lineY = 380;
    const lineSpacing = 70;

    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    for (let i = 0; i < 3; i++) {
      const y = lineY + i * lineSpacing;

      // Rounded rectangle for each line
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.15 + i * 0.1;
      roundRect(ctx, 60, y, 1080, 50, RADIUS);
      ctx.fill();

      // Accent bullet
      ctx.globalAlpha = 0.9 - i * 0.15;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(90, y + 25, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Mark as ready
    document.body.setAttribute('data-ready', 'true');
  </script>
</body>
</html>
  `;

  try {
    // Load HTML content
    await page.setContent(html);

    // Wait for canvas to be ready
    await page.waitForSelector('[data-ready="true"]', { timeout: 5000 });

    // Small delay to ensure everything is rendered
    await page.waitForTimeout(500);

    // Capture the image
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const outputPath = path.join(__dirname, '..', 'assets', 'og-image.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
    });

    // Check file size
    const stats = await fs.stat(outputPath);
    const sizeKb = Math.round(stats.size / 1024);

    console.log(`✓ Open Graph image created: ${outputPath}`);
    console.log(`  Dimensions: 1200×630px`);
    console.log(`  Size: ${sizeKb} KB\n`);

  } catch (err) {
    console.error('❌ Error during generation:', err.message);
    throw err;
  } finally {
    await browser.close();
  }
}

// Run the generation
generateOGImage().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
