#!/usr/bin/env node
/**
 * Generate CovertConvert Favicon
 * Design: Two overlapping C shapes with shadow/depth effect
 * Philosophy: "Shadowed Convergence"
 */

import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, '../src/assets');

// Color palette (grayscale, matches site dark mode)
const COLORS = {
  background: '#0d0d0d',    // Dark background (matches site)
  shadowC: '#404040',       // Back C - darker, recedes
  frontC: '#f5f5f5',        // Front C - lighter, advances
};

/**
 * Draw a C shape (arc)
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} radius - Outer radius
 * @param {number} thickness - Stroke thickness
 * @param {string} color - Fill color
 */
function drawC(ctx, cx, cy, radius, thickness, color) {
  ctx.beginPath();

  // C shape: arc from ~45° to ~315° (opening to the right)
  const startAngle = Math.PI * 0.3;  // ~54°
  const endAngle = Math.PI * 1.7;    // ~306°

  // Outer arc (clockwise)
  ctx.arc(cx, cy, radius, startAngle, endAngle, false);

  // Inner arc (counter-clockwise)
  const innerRadius = radius - thickness;
  ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Generate favicon at specified size
 * @param {number} size - Canvas size in pixels
 * @returns {Buffer} PNG buffer
 */
function generateFavicon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, size, size);

  // Calculate dimensions relative to canvas size
  const padding = size * 0.12;
  const availableSize = size - (padding * 2);
  const radius = availableSize * 0.42;
  const thickness = radius * 0.32;

  // Center point
  const centerY = size / 2;

  // Offset for the two Cs (creates the shadow/depth effect)
  const offset = size * 0.08;

  // First C position (back/shadow - shifted left and down slightly)
  const backCx = size / 2 - offset * 0.3;
  const backCy = centerY + offset * 0.2;

  // Second C position (front - shifted right and up)
  const frontCx = size / 2 + offset * 0.5;
  const frontCy = centerY - offset * 0.2;

  // Draw back C (shadow)
  drawC(ctx, backCx, backCy, radius, thickness, COLORS.shadowC);

  // Draw front C (light)
  drawC(ctx, frontCx, frontCy, radius, thickness, COLORS.frontC);

  return canvas.toBuffer('image/png');
}

// Generate both sizes
const sizes = [192, 512];

for (const size of sizes) {
  const buffer = generateFavicon(size);
  const filename = `icon-${size}.png`;
  const filepath = join(ASSETS_DIR, filename);
  writeFileSync(filepath, buffer);
  console.log(`✓ Generated: ${filename}`);
}

console.log('\n✅ Favicons generated successfully');
