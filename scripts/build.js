#!/usr/bin/env node
/**
 * CovertConvert Build Script
 * Generates static pages from templates + JSON data
 * ~50 lines as per architecture spec
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Ensure dist directories exist
mkdirSync(join(ROOT, 'dist/css'), { recursive: true });
mkdirSync(join(ROOT, 'dist/js'), { recursive: true });
mkdirSync(join(ROOT, 'dist/assets'), { recursive: true });

// 2. Load templates
const { homePage } = await import(join(ROOT, 'templates/home-page.js'));

// 3. Generate home page
writeFileSync(join(ROOT, 'dist/index.html'), homePage());
console.log('✓ Generated: dist/index.html');

// 4. Generate SEO pages (when data exists)
const seoDataPath = join(ROOT, 'data/seo-pages.json');
if (existsSync(seoDataPath)) {
  const { seoPage } = await import(join(ROOT, 'templates/seo-page.js'));
  const seoPages = JSON.parse(readFileSync(seoDataPath, 'utf8'));
  for (const page of seoPages.pages || []) {
    mkdirSync(join(ROOT, 'dist', page.slug), { recursive: true });
    writeFileSync(join(ROOT, 'dist', page.slug, 'index.html'), seoPage(page));
    console.log(`✓ Generated: dist/${page.slug}/index.html`);
  }
}

// 5. Generate trust/content pages (when data exists)
const trustDataPath = join(ROOT, 'data/trust-pages.json');
if (existsSync(trustDataPath)) {
  const { contentPage } = await import(join(ROOT, 'templates/content-page.js'));
  const trustPages = JSON.parse(readFileSync(trustDataPath, 'utf8'));
  for (const page of trustPages.pages || []) {
    mkdirSync(join(ROOT, 'dist', page.slug), { recursive: true });
    writeFileSync(join(ROOT, 'dist', page.slug, 'index.html'), contentPage(page));
    console.log(`✓ Generated: dist/${page.slug}/index.html`);
  }
}

// 6. Build CSS with Tailwind
execSync('npx tailwindcss -i src/css/input.css -o dist/css/styles.css --minify', { cwd: ROOT, stdio: 'inherit' });

// 7. Copy static assets
if (existsSync(join(ROOT, 'src/js'))) {
  cpSync(join(ROOT, 'src/js'), join(ROOT, 'dist/js'), { recursive: true });
  console.log('✓ Copied: src/js → dist/js');
}
if (existsSync(join(ROOT, 'src/assets'))) {
  cpSync(join(ROOT, 'src/assets'), join(ROOT, 'dist/assets'), { recursive: true });
  console.log('✓ Copied: src/assets → dist/assets');
}

// 8. Copy public folder (static files: _headers, robots.txt, sitemap.xml, manifest.json)
if (existsSync(join(ROOT, 'public'))) {
  cpSync(join(ROOT, 'public'), join(ROOT, 'dist'), { recursive: true });
  console.log('✓ Copied: public → dist (static files)');
}

console.log('\n✅ Build complete');
