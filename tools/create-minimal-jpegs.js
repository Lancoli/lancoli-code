// Creates minimal valid JPEG files as placeholders for project screenshots.
// These are 1×1 pixel gray JPEGs (the smallest valid JPEG possible).
// Run from LancoliCode/: node tools/create-minimal-jpegs.js

const fs = require('fs');
const path = require('path');

// A minimal valid 1×1 gray JPEG (Base64 encoded)
// This is a real JPEG file, just extremely small
const minimalJpegBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';

const projects = ['lancoli', 'studio', 'jondi', 'jardin', 'survie', 'archive', 'hal', 'code', 'infra'];
const assetsDir = path.join(__dirname, '..', 'assets');

console.log('📦 Creating minimal JPEG placeholders...\n');

let created = 0;

for (const project of projects) {
  const filePath = path.join(assetsDir, `${project}.jpg`);

  try {
    // Convert base64 to buffer and write
    const buffer = Buffer.from(minimalJpegBase64, 'base64');
    fs.writeFileSync(filePath, buffer);

    const stats = fs.statSync(filePath);
    console.log(`✓ ${project}.jpg created (${stats.size} bytes)`);
    created++;
  } catch (err) {
    console.error(`✗ Failed for ${project}: ${err.message}`);
  }
}

console.log(`\n✨ Done: ${created} placeholder${created > 1 ? 's' : ''} created`);
console.log('\nℹ️  These are minimal 1×1 pixel JPEGs. Replace them with real project screenshots:');
console.log('   node tools/capture-projects.js (requires HAL running on port 4101)');
