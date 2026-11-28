/**
 * Generates the Open Graph image for Lancoli Code (1200×630px)
 * Visual identity: accent #5fb98a, background #10140f, radius 6px
 * Represents the devlog
 */

import fs from 'fs';
import path from 'path';

// Check if canvas is available
let createCanvas, registerFont;
try {
    const Canvas = await import('canvas');
    createCanvas = Canvas.createCanvas;
    registerFont = Canvas.registerFont;
} catch (e) {
    console.error('The "canvas" module is not installed.');
    console.error('Installation: npm install canvas');
    process.exit(1);
}

// Standard Open Graph dimensions
const WIDTH = 1200;
const HEIGHT = 630;

// Lancoli Code palette
const BG = '#10140f';
const ACCENT = '#5fb98a';
const TEXT = '#e8f0e3';
const RADIUS = 6;

async function generateOGImage() {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Fond
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Marque en haut à gauche
    ctx.fillStyle = TEXT;
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('Lancoli', 60, 100);

    ctx.fillStyle = ACCENT;
    ctx.font = '48px monospace';
    ctx.fillText('/code', 230, 100);

    // Titre principal
    ctx.fillStyle = TEXT;
    ctx.font = 'bold 72px sans-serif';
    const title = 'Journal de bord';
    ctx.fillText(title, 60, 220);

    // Sous-titre
    ctx.fillStyle = TEXT;
    ctx.font = '36px sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText('Projets · UX · Design · Développement', 60, 290);
    ctx.globalAlpha = 1;

    // Visual elements representing the devlog
    // Three horizontal lines styled like journal entries
    const lineY = 380;
    const lineSpacing = 70;

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

    // Save the image
    const outputPath = new URL('../assets/og-image.png', import.meta.url).pathname;
    const buffer = canvas.toBuffer('image/png');

    // Create assets folder if it doesn't exist
    const assetsDir = path.dirname(outputPath);
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ Open Graph image created: ${outputPath}`);
    console.log(`  Dimensions: ${WIDTH}×${HEIGHT}px`);
    console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

/**
 * Draws a rectangle with rounded corners
 */
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

// Run the generation
generateOGImage().catch(err => {
    console.error('Error during generation:', err);
    process.exit(1);
});
