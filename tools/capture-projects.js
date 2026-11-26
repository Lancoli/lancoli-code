// Captures a screenshot of every portfolio project into assets/<id>.jpg (the images of the project cards).
// Uses Playwright to open each project and take a capture. Run from LancoliCode/: node tools/capture-projects.js
// (HAL must be serving the sites on port 4101, and Jondi on 4021).

const { chromium } = require('playwright');
const fs = require('fs/promises');
const path = require('path');

// The projects to capture, with their local URLs (through HAL on port 4101)
const captures = [
  { name: 'lancoli', url: 'http://localhost:4101/Lancoli/', viewport: { width: 1600, height: 900 } },
  { name: 'studio', url: 'http://localhost:4101/LancoliStudio/', viewport: { width: 1600, height: 900 } },
  { name: 'jondi', url: 'http://localhost:4021/', viewport: { width: 1600, height: 900 } },
  { name: 'jardin', url: 'http://localhost:4101/JardinDeDemain/temps-au-jardin.html', viewport: { width: 1600, height: 900 } },
  { name: 'survie', url: 'http://localhost:4101/Prototypes/calculateur-survie-alimentaire.html', viewport: { width: 1600, height: 900 } },
  { name: 'archive', url: 'http://localhost:4101/ArchiveBotanique/', viewport: { width: 1600, height: 900 } },
  { name: 'code', url: 'http://localhost:4101/LancoliCode/', viewport: { width: 1600, height: 900 } },
];

async function captureProjects() {
  console.log('🎬 Starting captures...\n');

  const browser = await chromium.launch({ headless: true });
  const assetsDir = path.join(__dirname, '..', 'assets');

  // Check that the assets folder exists
  try {
    await fs.access(assetsDir);
  } catch {
    console.error(`❌ The assets folder does not exist: ${assetsDir}`);
    await browser.close();
    return;
  }

  let succeeded = 0;
  let failed = 0;

  for (const project of captures) {
    const page = await browser.newPage({ viewport: project.viewport });
    const file = path.join(assetsDir, `${project.name}.jpg`);

    try {
      console.log(`📸 Capturing ${project.name}...`);
      console.log(`   URL: ${project.url}`);

      // Load the page with a 30 s timeout
      await page.goto(project.url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait a little for the animations to finish
      await page.waitForTimeout(1500);

      // Take the capture as JPEG, quality 85
      await page.screenshot({
        path: file,
        type: 'jpeg',
        quality: 85,
        fullPage: false,
      });

      // Check the file size
      const stats = await fs.stat(file);
      const sizeKb = Math.round(stats.size / 1024);
      console.log(`   ✓ ${project.name}.jpg written (${sizeKb} KB)\n`);
      succeeded++;

    } catch (err) {
      console.error(`   ✗ Failed for ${project.name}: ${err.message}\n`);
      failed++;
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log(`\n✨ Done: ${succeeded} capture${succeeded > 1 ? 's' : ''} succeeded`);
  if (failed > 0) {
    console.log(`⚠️  ${failed} failure${failed > 1 ? 's' : ''}`);
  }
}

// Run the captures
captureProjects().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
