#!/usr/bin/env node
/**
 * CovertConvert Build Script
 * Generates static pages from templates + JSON data
 * Supports multi-language (i18n) via locale loop
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// i18n Configuration
const LOCALES = ['en', 'es', 'pt', 'fr', 'de'];
const DEFAULT_LOCALE = 'en';

/**
 * Load JSON file if it exists, return null otherwise
 */
function loadJSON(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

/**
 * Get output directory for a locale
 * Default locale (en) goes to dist/, others go to dist/{locale}/
 */
function getDistPath(locale, ...paths) {
  if (locale === DEFAULT_LOCALE) {
    return join(ROOT, 'dist', ...paths);
  }
  return join(ROOT, 'dist', locale, ...paths);
}

// 1. Ensure dist directories exist
mkdirSync(join(ROOT, 'dist/css'), { recursive: true });
mkdirSync(join(ROOT, 'dist/js'), { recursive: true });
mkdirSync(join(ROOT, 'dist/assets'), { recursive: true });

// 2. Load templates
const { homePage } = await import(join(ROOT, 'templates/home-page.js'));
const { seoPage } = await import(join(ROOT, 'templates/seo-page.js'));
const { contentPage } = await import(join(ROOT, 'templates/content-page.js'));
const { blogPost } = await import(join(ROOT, 'templates/blog-post.js'));
const { blogIndex } = await import(join(ROOT, 'templates/blog-index.js'));

// 3. Generate pages for each locale
for (const locale of LOCALES) {
  // Load i18n strings for this locale (fall back to English if not found)
  const i18nPath = join(ROOT, 'data/i18n', `${locale}.json`);
  const i18nFallback = join(ROOT, 'data/i18n/en.json');
  const i18n = loadJSON(i18nPath) || loadJSON(i18nFallback);

  if (!i18n) {
    console.log(`⚠ Skipping locale '${locale}': No i18n data found`);
    continue;
  }

  // Load page data for this locale (fall back to English)
  const seoDataPath = join(ROOT, 'data/pages', locale, 'seo-pages.json');
  const seoFallback = join(ROOT, 'data/pages/en/seo-pages.json');
  const seoPages = loadJSON(seoDataPath) || loadJSON(seoFallback);

  const trustDataPath = join(ROOT, 'data/pages', locale, 'trust-pages.json');
  const trustFallback = join(ROOT, 'data/pages/en/trust-pages.json');
  const trustPages = loadJSON(trustDataPath) || loadJSON(trustFallback);

  const localeLabel = locale === DEFAULT_LOCALE ? '' : `[${locale}] `;

  // 3a. Generate home page
  const homeDir = getDistPath(locale);
  mkdirSync(homeDir, { recursive: true });
  writeFileSync(join(homeDir, 'index.html'), homePage({ i18n, locale, locales: LOCALES, defaultLocale: DEFAULT_LOCALE }));
  console.log(`✓ ${localeLabel}Generated: ${locale === DEFAULT_LOCALE ? 'dist' : 'dist/' + locale}/index.html`);

  // 3b. Generate SEO pages
  if (seoPages?.pages) {
    for (const page of seoPages.pages) {
      const pageDir = getDistPath(locale, page.slug);
      mkdirSync(pageDir, { recursive: true });
      writeFileSync(join(pageDir, 'index.html'), seoPage({ ...page, i18n, locale, locales: LOCALES, defaultLocale: DEFAULT_LOCALE }));
      console.log(`✓ ${localeLabel}Generated: ${page.slug}/index.html`);
    }
  }

  // 3c. Generate trust/content pages
  if (trustPages?.pages) {
    for (const page of trustPages.pages) {
      const pageDir = getDistPath(locale, page.slug);
      mkdirSync(pageDir, { recursive: true });
      writeFileSync(join(pageDir, 'index.html'), contentPage({ ...page, i18n, locale, locales: LOCALES, defaultLocale: DEFAULT_LOCALE }));
      console.log(`✓ ${localeLabel}Generated: ${page.slug}/index.html`);
    }
  }

  // 3d. Generate blog posts from markdown
  const blogDir = join(ROOT, 'content/blog');
  if (existsSync(blogDir)) {
    const posts = [];
    const mdFiles = readdirSync(blogDir).filter(f => {
      // For default locale: only files without language suffix (e.g., post.md)
      // For other locales: only files with matching suffix (e.g., post.es.md)
      if (locale === DEFAULT_LOCALE) {
        return f.endsWith('.md') && !f.match(/\.[a-z]{2}\.md$/);
      }
      return f.endsWith(`.${locale}.md`);
    });

    for (const file of mdFiles) {
      const raw = readFileSync(join(blogDir, file), 'utf8');
      const { data, content } = matter(raw);
      const html = marked(content);

      posts.push({ ...data, content: html });

      const postDir = getDistPath(locale, 'blog', data.slug);
      mkdirSync(postDir, { recursive: true });
      writeFileSync(
        join(postDir, 'index.html'),
        blogPost({ ...data, content: html, i18n, locale, locales: LOCALES, defaultLocale: DEFAULT_LOCALE })
      );
      console.log(`✓ ${localeLabel}Generated: blog/${data.slug}/index.html`);
    }

    // Generate blog index
    if (posts.length > 0) {
      const blogIndexDir = getDistPath(locale, 'blog');
      mkdirSync(blogIndexDir, { recursive: true });
      writeFileSync(join(blogIndexDir, 'index.html'), blogIndex({ posts, i18n, locale, locales: LOCALES, defaultLocale: DEFAULT_LOCALE }));
      console.log(`✓ ${localeLabel}Generated: blog/index.html`);
    }
  }
}

// 4. Build CSS with Tailwind
execSync('npx tailwindcss -i src/css/input.css -o dist/css/styles.css --minify', { cwd: ROOT, stdio: 'inherit' });

// 5. Copy static assets
if (existsSync(join(ROOT, 'src/js'))) {
  cpSync(join(ROOT, 'src/js'), join(ROOT, 'dist/js'), { recursive: true });
  console.log('✓ Copied: src/js → dist/js');
}
if (existsSync(join(ROOT, 'src/assets'))) {
  cpSync(join(ROOT, 'src/assets'), join(ROOT, 'dist/assets'), { recursive: true });
  console.log('✓ Copied: src/assets → dist/assets');
}

// 6. Copy public folder (static files: _headers, robots.txt, sitemap.xml, manifest.json)
if (existsSync(join(ROOT, 'public'))) {
  cpSync(join(ROOT, 'public'), join(ROOT, 'dist'), { recursive: true });
  console.log('✓ Copied: public → dist (static files)');
}

console.log('\n✅ Build complete');
