---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
status: COMPLETE
inputDocuments:
  - docs/PRD.md
  - docs/ux-design-specification.md
  - docs/plans/2025-12-11-covertconvert-design.md
  - docs/plans/MVP-IMPLEMENTATION-PLAN.md
workflowType: 'architecture'
lastStep: 7
project_name: 'CovertConvert'
user_name: 'Andrew'
date: '2025-12-12'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
52 FRs organized into 8 categories:
- File Input & Detection (FR1-FR6): Drag-drop, click-browse, multi-select, format detection
- Image Conversion (FR7-FR17): 7 input formats, 2 output formats, quality slider, lazy WASM loading
- Output & Download (FR18-FR21): Direct download, ZIP bundling, auto-trigger, meaningful filenames
- Progress & Feedback (FR22-FR27): Progress indicators, batch status, error handling, graceful degradation
- Warnings & Guidance (FR28-FR30): Soft warnings for large batches/files, dismissible
- SEO Landing Pages (FR33-FR38): Format-specific pages, URL-determined output, schema markup
- Trust & Transparency (FR39-FR42): /about, /privacy, /how-it-works, verifiable architecture
- Universal Converter (FR43-FR45): Home page with JPEG/PNG toggle

**Non-Functional Requirements:**
- **Performance (NFR-P):** <1s LCP, <100ms FID, <0.1 CLS, <3s typical conversion
- **Security/Privacy (NFR-S):** Zero file transmission, no PII collection, verifiable via network inspector
- **Accessibility (NFR-A):** WCAG 2.1 AA, 48px touch targets, keyboard navigation, reduced motion
- **Reliability (NFR-R):** <2% failure rate, batch failures don't crash processing
- **Integration (NFR-I):** GA4 events, AdSense with reserved heights, Schema.org markup
- **Maintainability (NFR-M):** Single Node script build, no frameworks, vanilla HTML/CSS/JS

**Scale & Complexity:**

- Primary domain: Static Web Application (MPA with SPA-like interactions)
- Complexity level: Low (by design — solo developer constraint)
- Estimated architectural components: 7
  1. Page generation system (build script)
  2. File selector component
  3. Conversion pipeline (format detection → decode → encode → download)
  4. WASM codec loader
  5. Progress/feedback UI
  6. Platform adaptation layer
  7. Analytics/error telemetry integration

### Non-Negotiable Architectural Constraints

These override all other considerations:

1. **Speed** — Conversion must complete in <3s p95. Architecture decisions that risk this are rejected.
2. **SEO Crawlability** — Every page renders without JS. No client-side routing.
3. **AdSense Compliance** — Reserved ad heights, no CLS. Monetization depends on this.
4. **Solo Developer Maintainability** — If Andrew can't debug it at 2am alone, it doesn't ship.

### Tiered Capability Model

Graceful degradation based on browser capabilities:

| Tier | Capability | Formats | Dependency |
|------|------------|---------|------------|
| Tier 1 | Always available | PNG, WebP, BMP, GIF | Canvas API only |
| Tier 2 | WASM required | HEIC, AVIF, TIFF | libheif-js, Squoosh |

**Implication:** Error messaging distinguishes "format not supported" from "your browser can't load the converter for this format."

### Technical Constraints & Dependencies

**Hard Constraints (Non-Negotiable):**
- All processing client-side (privacy architecture)
- No build system beyond single Node script (NFR-M1)
- No framework dependencies (NFR-M2)
- Static hosting only — Cloudflare Pages

**Dependencies:**
| Dependency | Purpose | Size |
|------------|---------|------|
| libheif-js | HEIC/HEIF decoding | ~300KB |
| Squoosh AVIF | AVIF decoding | ~200KB |
| UTIF.js | TIFF decoding | ~50KB |
| JSZip | Batch ZIP creation (desktop only) | ~90KB |
| Tailwind CSS | Utility classes | CDN |

**Browser Support Matrix:**
| Browser | Minimum | Required APIs |
|---------|---------|---------------|
| Chrome | 88+ | WASM, Canvas, File API, Blob URLs |
| Firefox | 78+ | Same |
| Safari | 14+ | Same |
| Edge | 88+ | Same |

### Cross-Cutting Concerns Identified

1. **WASM Integration** — Affects all conversion code; must handle load failures gracefully (Tier 1 fallback), lazy-load appropriately, manage memory on large batches

2. **Platform Adaptation Layer** — First-class architectural component affecting:
   - Download strategy (ZIP vs sequential)
   - UI copy ("drop" vs "tap")
   - Touch target sizing (48px mobile)
   - Error message length
   - Ad placement (sidebar vs below-fold)

3. **Ad Integration** — Affects page layout (reserved heights to prevent CLS), load performance (lazy-load required), must never interrupt critical path

4. **Analytics & Error Telemetry** — GA4 custom events for aggregate tracking. Structured `console.error()` with browser/file context for user-reported debugging. "Copy error details" UX pattern for support. No external error monitoring (Sentry) at MVP; revisit at 25K+ monthly visitors.

5. **Accessibility** — All interactive elements need keyboard support, ARIA labels, focus indicators, reduced motion support; tested via Lighthouse

6. **Testability** — All cross-cutting concerns must be mockable/injectable for automated testing. Platform detection injectable for CI. Browser-specific behaviors tested via Playwright device emulation.

7. **Error Handling** — Tiered messaging based on failure type. Batch failures don't crash processing. User-facing "copy error details" for support escalation.

## Starter Template Evaluation

### Primary Technology Domain

Static Web Application (MPA) with vanilla JavaScript — no framework, no bundler.

### Growth Trajectory

| Timeframe | Estimated Pages |
|-----------|-----------------|
| Launch | 13 (9 SEO + 3 trust + 1 home) |
| Month 12 | 20-30 (blog posts begin) |
| Month 18 | 50+ (i18n variants) |
| Year 2 | 100+ |

Architecture must scale without rearchitecting.

### Starter Options Considered

| Option | Verdict | Reason |
|--------|---------|--------|
| Vite vanilla template | ❌ Rejected | Adds bundler we don't need |
| Next.js static export | ❌ Rejected | Framework violates NFR-M2 |
| 11ty (Eleventy) | ❌ Rejected | SSG overhead, another dependency |
| Raw HTML files (no templating) | ❌ Rejected | Doesn't scale to 100+ pages |
| String.replace() templating | ❌ Rejected | Too fragile for arrays/loops |
| EJS/Handlebars | ❌ Rejected | Unnecessary dependency |
| **Template literals + JSON** | ✅ Selected | Zero deps, full JS power, scales infinitely |

### Selected Approach: Vanilla + Tailwind CLI + Template Literals

**Rationale:**
- NFR-M1 mandates "no build system more complex than a single Node script"
- NFR-M2 mandates "no framework dependencies"
- Template literals are native JS — zero parsing, zero dependencies
- Full JS power for loops, conditionals, expressions
- Testable as pure functions
- Same 30-line build script works at 13 or 1300 pages
- JSON data files enable non-technical content editing

**Performance Comparison:**

| Metric | This Approach | Framework Alternative |
|--------|---------------|----------------------|
| Initial HTML | ~5KB | ~5KB |
| CSS (purged) | ~10-15KB | ~10-15KB |
| Framework JS | **0KB** | ~80-110KB |
| Hydration | **0ms** | 50-150ms |
| Estimated LCP | **~350ms** | ~600-900ms |

### Initialization Commands

```bash
# Create project structure
mkdir -p covertconvert/{src/{css,js/codecs,assets},templates,data/blog,scripts,dist}

# Create source files
touch covertconvert/src/index.html
touch covertconvert/src/css/{input.css,covertconvert.css}
touch covertconvert/src/js/{main,converter,platform}.js
touch covertconvert/templates/{seo-page,trust-page,home-page,blog-post}.js
touch covertconvert/data/{seo-pages,trust-pages}.json
touch covertconvert/scripts/build.js

# Download Tailwind CLI standalone (pin version for reproducibility)
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.0/tailwindcss-macos-arm64
chmod +x tailwindcss-macos-arm64
mv tailwindcss-macos-arm64 covertconvert/tailwindcss
```

### Template Architecture

**Template Literal Pattern:**

```javascript
// templates/seo-page.js
export const seoPage = ({ title, description, h1, outputFormat, faqs, crossLink }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${h1}</h1>
  <div id="converter" data-output="${outputFormat}"></div>
  <p class="cross-link">${crossLink}</p>

  <section class="faq">
    ${faqs.map(({ q, a }) => `
      <details>
        <summary>${q}</summary>
        <p>${a}</p>
      </details>
    `).join('\n')}
  </section>

  <script src="/js/main.js" type="module"></script>
</body>
</html>
`;
```

**Build Script (~30 lines):**

```javascript
// scripts/build.js
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { execSync } from 'child_process';
import { seoPage } from '../templates/seo-page.js';
import { trustPage } from '../templates/trust-page.js';
import { homePage } from '../templates/home-page.js';

// 1. Load page data
const seoPages = JSON.parse(readFileSync('data/seo-pages.json', 'utf8'));
const trustPages = JSON.parse(readFileSync('data/trust-pages.json', 'utf8'));

// 2. Generate SEO pages
for (const page of seoPages) {
  mkdirSync(`dist/${page.slug}`, { recursive: true });
  writeFileSync(`dist/${page.slug}/index.html`, seoPage(page));
}

// 3. Generate trust pages
for (const page of trustPages) {
  mkdirSync(`dist/${page.slug}`, { recursive: true });
  writeFileSync(`dist/${page.slug}/index.html`, trustPage(page));
}

// 4. Generate home page
writeFileSync('dist/index.html', homePage());

// 5. Build CSS with Tailwind
execSync('./tailwindcss -i src/css/input.css -o dist/css/styles.css --minify');

// 6. Copy static assets
cpSync('src/js', 'dist/js', { recursive: true });
cpSync('src/assets', 'dist/assets', { recursive: true });

console.log('✓ Build complete');
```

### Blog Architecture (Future-Ready)

When blog content unlocks at 15K monthly visitors:

**Option A: JSON + Template Literals (consistent with SEO pages)**
```
data/blog/
├── what-is-heic.json
├── heic-vs-jpg.json
└── ...
```

**Option B: Markdown with Frontmatter (better for long-form)**
```markdown
---
title: What is HEIC?
date: 2025-02-15
slug: what-is-heic
---

HEIC (High Efficiency Image Container) is Apple's default...
```

Add `marked` (~30KB) as single blog dependency when needed. Same build script pattern, ~10 additional lines.

### Project Structure

```
covertconvert/
├── src/
│   ├── index.html              # Home page source (or generated)
│   ├── css/
│   │   ├── input.css           # Tailwind directives
│   │   └── covertconvert.css   # khrome fork + custom (~65 lines)
│   ├── js/
│   │   ├── main.js             # Entry point
│   │   ├── converter.js        # Conversion pipeline
│   │   ├── platform.js         # Platform detection (injectable)
│   │   └── codecs/             # WASM loader wrappers
│   └── assets/                 # Favicon, images
├── templates/
│   ├── seo-page.js             # SEO landing page template
│   ├── trust-page.js           # About/Privacy/How-it-works
│   ├── home-page.js            # Universal converter
│   └── blog-post.js            # Future: blog template
├── data/
│   ├── seo-pages.json          # 9 SEO page definitions
│   ├── trust-pages.json        # 3 trust page definitions
│   └── blog/                   # Future: blog content
├── scripts/
│   └── build.js                # Single build script (~30 lines)
├── tailwindcss                 # Standalone binary (gitignored)
├── tailwind.config.js          # Tailwind configuration
├── package.json                # Dev scripts only, zero runtime deps
└── dist/                       # Build output → Cloudflare Pages
```

### Development Workflow

```json
// package.json (dev ergonomics only)
{
  "scripts": {
    "dev": "concurrently \"./tailwindcss -i src/css/input.css -o dist/css/styles.css -w\" \"live-server dist\"",
    "build": "node scripts/build.js",
    "test": "playwright test"
  },
  "devDependencies": {
    "concurrently": "^8.0.0",
    "live-server": "^1.2.0",
    "playwright": "^1.40.0"
  }
}
```

**Key principle:** Zero runtime npm dependencies. `dist/` folder has no `node_modules`.

### CI/CD Considerations

```yaml
# GitHub Actions
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      # Download Tailwind CLI for Linux
      - run: curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.0/tailwindcss-linux-x64
      - run: chmod +x tailwindcss-linux-x64 && mv tailwindcss-linux-x64 tailwindcss
      - run: npm run build

  test:
    steps:
      - run: npx playwright install --with-deps
      - run: npm test

  deploy:
    steps:
      - uses: cloudflare/pages-action@v1
        with:
          directory: dist
```

**Note:** Tailwind CLI binary differs per OS. CI downloads Linux version; local dev uses macOS version.

## Core Architectural Decisions

### Decision Priority Analysis

**Already Decided (from PRD + constraints):**
- Database: None (client-side only)
- Authentication: None (no accounts)
- API/Backend: None (static hosting)
- Framework: Vanilla JS (NFR-M2)
- Hosting: Cloudflare Pages
- Build System: Node script + Tailwind CLI

**Decisions Made This Step:**
1. WASM Codec Architecture
2. Client-Side State Management
3. Platform Detection Strategy
4. Error Handling Pattern
5. Analytics Event Structure

### WASM Codec Architecture

**Decision:** Lazy load with connection-aware preload hints

**Pattern:**
```javascript
// codecs/loader.js
const codecs = {
  heic: () => import('./libheif-wrapper.js'),
  avif: () => import('./squoosh-avif-wrapper.js'),
  tiff: () => import('./utif-wrapper.js'),
};

let loaded = {};

export async function getCodec(format) {
  if (!codecs[format]) return null; // Tier 1 format, use Canvas
  if (!loaded[format]) {
    loaded[format] = await codecs[format]();
  }
  return loaded[format];
}
```

**Preload Strategy:**
```javascript
// After DOMContentLoaded, only on fast connections
document.addEventListener('DOMContentLoaded', () => {
  if (navigator.connection?.effectiveType === '4g') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/js/codecs/libheif.js';
    link.as = 'script';
    document.head.appendChild(link);
  }
});
```

**Rationale:**
- WASM binary loads on first `decode()` call, not on import
- Connection check prevents hurting slow connections with 300KB preload
- Codec wrappers are mockable for testing

### Client-Side State Management

**Decision:** Module-scoped state with reset function (no framework)

**Pattern:**
```javascript
// converter.js
let state = {
  files: [],           // Selected files
  currentIndex: 0,     // Batch progress
  outputFormat: 'jpeg', // From URL or toggle
  quality: 0.92,       // JPEG quality
  status: 'idle',      // idle | converting | done | error
};

export function getState() { return { ...state }; }
export function setFiles(files) { state.files = files; state.status = 'idle'; }
export function setOutputFormat(fmt) { state.outputFormat = fmt; }
export function resetState() {
  state = { files: [], currentIndex: 0, outputFormat: 'jpeg', quality: 0.92, status: 'idle' };
}
```

**Rationale:**
- Single component (converter) doesn't need pub/sub or stores
- State changes directly update DOM
- Reset function enables test isolation
- Zero dependencies

### Platform Detection Strategy

**Decision:** Unbundled detection — different concerns use different signals

**Pattern:**
```javascript
// platform.js
export const platform = {
  // For download strategy: width-based (tablets get desktop behavior)
  get useSequentialDownloads() {
    return window.innerWidth < 768;
  },

  // For UI copy: touch-based
  get hasTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // For batch limits: memory-based (rough proxy)
  get isLowMemoryDevice() {
    return navigator.deviceMemory ? navigator.deviceMemory < 4 : this.useSequentialDownloads;
  }
};
```

**Ad Layout:** Pure CSS, no JS detection:
```css
@media (min-width: 1024px) { .ad-sidebar { display: block; } }
@media (max-width: 1023px) { .ad-sidebar { display: none; } }
```

**Rationale:**
- Download strategy depends on screen size (tablets can handle ZIP)
- UI copy depends on touch capability
- Ad layout is CSS concern, not JS concern
- Unbundled approach avoids false "isMobile" conflation

### Error Handling Pattern

**Decision:** Result objects with error classification

**Pattern:**
```javascript
// Result type for conversion operations
async function convertFile(file, outputFormat) {
  try {
    const codec = await getCodec(detectFormat(file));
    const imageData = codec ? await codec.decode(file) : await canvasDecode(file);
    const blob = await encodeToBlob(imageData, outputFormat);
    return { ok: true, data: { blob, name: newFilename(file.name, outputFormat) } };
  } catch (error) {
    return { ok: false, error: { type: classifyError(error), message: error.message, file: file.name } };
  }
}

// Error classification for debugging + analytics
function classifyError(error) {
  if (error.name === 'WasmError' || error.message.includes('WASM')) return 'codec_load_failed';
  if (error.message.includes('memory')) return 'memory_exceeded';
  if (error.message.includes('decode')) return 'decode_failed';
  if (error.message.includes('format')) return 'unsupported_format';
  return 'unknown';
}
```

**Rationale:**
- No nested try/catch spaghetti
- Batch processing naturally handles partial failures
- Error classification maps to user messages AND GA4 events
- TypeScript-friendly discriminated union pattern

### Analytics Event Structure

**Decision:** Rich parameters for actionable insights, no PII

**Events:**

| Event | Parameters |
|-------|------------|
| `file_selected` | `count`, `formats[]` |
| `conversion_started` | `count`, `output_format` |
| `conversion_completed` | `count`, `duration_ms`, `output_format` |
| `conversion_error` | `error_type`, `input_format`, `browser`, `platform` |
| `download_triggered` | `type` (single/zip/sequential), `count` |

**Error Event Pattern:**
```javascript
gtag('event', 'conversion_error', {
  error_type: result.error.type,           // 'codec_load_failed'
  input_format: detectFormat(file),        // 'heic'
  browser: getBrowserName(),               // 'Chrome'
  browser_version: getBrowserVersion(),    // '120'
  platform: platform.useSequentialDownloads ? 'mobile' : 'desktop'
});
```

**Not Tracked (privacy):**
- Filenames
- File contents
- Exact file sizes
- Full user agent strings
- Stack traces

**Rationale:**
- Answers key business questions (conversion rate, popular formats, error frequency)
- Enough detail to debug without PII exposure
- Maps to structured console errors for user-reported issues

## Implementation Patterns & Consistency Rules

### Pattern Categories

**Conflict points addressed:** File naming, JS naming, JSON schema, CSS classes, DOM manipulation, GA4 events, error messages.

**Not applicable (no database/API/auth):** Database naming, API response format, authentication patterns.

### File & Directory Naming

| Type | Convention | Example |
|------|------------|---------|
| Directories | kebab-case | `src/js/codecs/` |
| HTML/CSS files | kebab-case | `seo-page.html`, `input.css` |
| JS files | camelCase | `converter.js`, `platform.js` |
| JSON data | kebab-case | `seo-pages.json` |
| Template JS | kebab-case | `seo-page.js` |

### JavaScript Naming Conventions

```javascript
// Functions: camelCase verbs
function convertFile() {}
function detectFormat() {}
function getCodec() {}

// Variables: camelCase nouns
const outputFormat = 'jpeg';
const currentIndex = 0;

// Constants: UPPER_SNAKE for true constants
const MAX_BATCH_SIZE = 50;
const SUPPORTED_FORMATS = ['heic', 'avif', 'tiff'];

// Module exports: named exports only
export { convertFile, detectFormat };  // ✅
export default converter;              // ❌
```

### JSON Data Schema

**Standard structure for `seo-pages.json`:**
```json
{
  "pages": [
    {
      "slug": "heic-to-jpg",
      "title": "HEIC to JPG Converter",
      "description": "Convert HEIC to JPG instantly...",
      "h1": "Convert HEIC to JPG",
      "outputFormat": "jpeg",
      "crossLink": {
        "text": "Need PNG instead?",
        "href": "/heic-to-png"
      },
      "faqs": [
        { "q": "What is HEIC?", "a": "HEIC is Apple's..." }
      ]
    }
  ]
}
```

**Conventions:**
- `slug`: kebab-case, matches URL path
- Object keys: camelCase
- Arrays for repeating items (faqs, pages)

### CSS Class Naming

```css
/* BEM-lite for custom components */
.file-selector {}
.file-selector--hover {}
.file-selector--active {}
.file-selector__input {}
.file-selector__text {}

/* State classes: is-* or has-* prefix */
.file-selector.is-converting {}
.file-selector.has-error {}

/* Utility classes via Tailwind */
<div class="flex items-center gap-4">
```

**Avoid:**
- camelCase classes (`.fileSelector`)
- Generic names (`.container`, `.wrapper`)
- Deeply nested BEM (`.file-selector__input__icon`)

### DOM Manipulation Pattern

```javascript
// Cache DOM references at module load
const elements = {
  fileInput: document.querySelector('#file-input'),
  progressText: document.querySelector('.progress-text'),
  dropZone: document.querySelector('.file-selector'),
  successMessage: document.querySelector('.success-message'),
};

// Update via cached reference
function updateProgress(current, total) {
  elements.progressText.textContent = `Converting ${current} of ${total}...`;
}

function showSuccess() {
  elements.dropZone.classList.add('is-success');
  elements.successMessage.hidden = false;
}
```

**Avoid:** Querying DOM on every update.

### GA4 Event Naming

```javascript
// Event names: snake_case (GA4 convention)
gtag('event', 'file_selected', { count: 5, formats: ['heic', 'png'] });
gtag('event', 'conversion_started', { count: 5, output_format: 'jpeg' });
gtag('event', 'conversion_completed', { count: 5, duration_ms: 1200 });
gtag('event', 'conversion_error', { error_type: 'codec_load_failed', input_format: 'heic' });
gtag('event', 'download_triggered', { type: 'zip', count: 5 });

// Parameter names: snake_case
{ error_type: 'decode_failed', input_format: 'heic', browser: 'Chrome' }
```

### Error Message Format

**User-facing messages (short, no jargon):**
```javascript
const USER_ERRORS = {
  unsupported_format: "This file type isn't supported.",
  codec_load_failed: "Please update your browser.",
  decode_failed: "Couldn't convert this file.",
  memory_exceeded: "This file is too large for your browser.",
  batch_partial: (success, total) => `Converted ${success} of ${total} files.`,
};
```

**Technical messages (console only):**
```javascript
console.error('[CovertConvert]', {
  type: 'decode_failed',
  file: file.name,
  format: detectedFormat,
  browser: navigator.userAgent,
  timestamp: new Date().toISOString(),
});
```

### Enforcement Guidelines

**All code MUST:**
1. Follow naming conventions above — no exceptions
2. Use named exports, never default exports
3. Cache DOM queries at module scope
4. Use snake_case for GA4 events and parameters
5. Separate user-facing and technical error messages

**Pattern violations:**
- Caught during code review
- Fixed before merge
- Document exceptions in code comments with rationale

## Project Structure & Boundaries

### Complete Project Directory Structure

```
covertconvert/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD pipeline
├── data/
│   ├── seo-pages.json              # 9 SEO page definitions
│   └── trust-pages.json            # 3 trust page definitions
├── dist/                           # Build output (gitignored)
├── scripts/
│   └── build.js                    # Single build script (~50 lines)
├── src/
│   ├── assets/
│   │   ├── favicon.ico
│   │   └── og-image.png
│   ├── css/
│   │   ├── input.css               # Tailwind directives
│   │   └── covertconvert.css       # khrome fork (~65 lines)
│   └── js/
│       ├── main.js                 # Entry point, DOM init
│       ├── converter.js            # Conversion pipeline + state
│       ├── detector.js             # Format detection
│       ├── downloader.js           # Download triggering
│       ├── platform.js             # Platform detection
│       ├── analytics.js            # GA4 event helpers
│       ├── errors.js               # Error constants
│       ├── ui.js                   # DOM updates, progress
│       └── codecs/
│           ├── loader.js           # Lazy codec loader
│           ├── libheif-wrapper.js  # HEIC decoder
│           ├── squoosh-wrapper.js  # AVIF decoder
│           └── utif-wrapper.js     # TIFF decoder
├── templates/
│   ├── seo-page.js                 # SEO landing page template
│   ├── trust-page.js               # Trust pages template
│   ├── home-page.js                # Universal converter
│   └── partials/
│       ├── head.js
│       ├── nav.js
│       ├── converter.js            # Converter component HTML
│       ├── footer.js
│       └── ad-slots.js
├── tests/
│   ├── e2e/
│   │   ├── conversion.spec.js
│   │   ├── batch.spec.js
│   │   ├── errors.spec.js
│   │   └── mobile.spec.js
│   └── fixtures/
│       ├── valid/
│       ├── invalid/
│       └── edge-cases/
├── .gitignore
├── package.json                    # Dev dependencies only
├── tailwind.config.js
├── playwright.config.js
└── README.md
```

### Architectural Boundaries

**Build-time vs Runtime:**
- Build-time: Templates, JSON data, build.js, Tailwind CSS
- Runtime: All src/js/, WASM codecs

**Module Boundaries:**

| Boundary | Contains | Consumes |
|----------|----------|----------|
| Converter Core | converter.js, detector.js, codecs/ | platform.js |
| UI Layer | ui.js, main.js | converter.js (state) |
| Platform | platform.js | Nothing (leaf module) |
| Analytics | analytics.js | Nothing (fire-and-forget) |
| Downloads | downloader.js | platform.js, converter.js (blobs) |

**Data Flow:**
```
User drops file → main.js (event) → converter.js (orchestrate)
    → detector.js (format) → codecs/loader.js (lazy)
    → wrapper (decode) → converter.js (Canvas encode)
    → downloader.js (trigger) → ui.js (success)
    → analytics.js (event)
```

### Requirements Mapping

| FR Category | Files |
|-------------|-------|
| File Input (FR1-6) | main.js, converter.js, detector.js |
| Conversion (FR7-17) | converter.js, codecs/* |
| Download (FR18-21) | downloader.js |
| Progress (FR22-27) | ui.js |
| Warnings (FR28-30) | ui.js, errors.js |
| SEO Pages (FR33-38) | templates/seo-page.js, data/seo-pages.json |
| Trust Pages (FR39-42) | templates/trust-page.js |
| Universal (FR43-45) | templates/home-page.js |
| Analytics (FR46-48) | analytics.js |
| Accessibility (FR49-52) | Cross-cutting |

### File Responsibilities

| File | Single Responsibility |
|------|----------------------|
| main.js | DOM initialization, event binding |
| converter.js | Conversion orchestration, state |
| detector.js | Format detection (signature/extension) |
| downloader.js | Download triggering (ZIP/direct/sequential) |
| platform.js | Platform detection (touch, width, memory) |
| analytics.js | GA4 event helpers |
| errors.js | Error constants and user messages |
| ui.js | DOM updates, progress, error display |
| codecs/loader.js | Lazy codec loading |

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts:
- Vanilla JS + Tailwind CLI + Template Literals — no version conflicts possible
- WASM codecs (libheif-js, Squoosh, UTIF.js) — independent, format-specific loaders
- JSZip for batch downloads — standalone library, no framework integration needed
- GA4 + AdSense — standard Google integrations, compatible

**Pattern Consistency:**
- Named exports throughout all JS files
- Result objects `{ ok, data, error }` used consistently for all async operations
- snake_case for GA4, camelCase for JS, kebab-case for files — clear separation
- BEM-lite for custom CSS, Tailwind utilities for layout

**Structure Alignment:**
- Build-time (templates, JSON, build.js) cleanly separated from runtime (src/js/)
- Module boundaries enforce single responsibility
- Data flow is unidirectional: user → main.js → converter.js → codecs → downloader → ui.js

### Requirements Coverage Validation ✅

**Functional Requirements (52 FRs):** All mapped to specific files.

| FR Category | Files |
|-------------|-------|
| File Input (FR1-6) | main.js, detector.js |
| Conversion (FR7-17) | converter.js, codecs/* |
| Download (FR18-21) | downloader.js |
| Progress (FR22-27) | ui.js |
| Warnings (FR28-30) | ui.js, errors.js |
| Reset (FR31-32) | converter.js (resetState) |
| SEO Pages (FR33-38) | templates/seo-page.js, data/seo-pages.json |
| Trust Pages (FR39-42) | templates/trust-page.js |
| Universal (FR43-45) | templates/home-page.js |
| Analytics (FR46-48) | analytics.js |
| Accessibility (FR49-52) | Cross-cutting |

**Non-Functional Requirements:** All categories have architectural support.

| NFR Category | Support |
|--------------|---------|
| Performance (NFR-P1-P4) | Lazy WASM, sequential batch, Canvas encode |
| Security (NFR-S1-S4) | Client-side only, no server, verifiable |
| Accessibility (NFR-A1-A8) | Cross-cutting, tested via Lighthouse |
| Reliability (NFR-R1-R5) | Result objects, batch isolation, GA4 tracking |
| Integration (NFR-I1-I13) | analytics.js, ad-slots partial, schema templates |
| Maintainability (NFR-M1-M5) | Single Node script, vanilla JS, zero runtime deps |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical decisions documented with specific library versions
- Implementation patterns include code examples
- Consistency rules are enforceable
- Error handling pattern has classification → user message mapping

**Structure Completeness:**
- All 20+ source files defined with single responsibility
- Directory structure matches requirements mapping
- Build output (dist/) clearly separated from source

**Pattern Completeness:**
- Potential conflict points (naming, exports, GA4 params) all addressed
- Communication patterns (module boundaries, data flow) fully specified
- Process patterns (error handling, state reset) documented

### Gap Analysis Results

**Critical Gaps:** None.

**Implementation Notes (for Epic 1):**
- Create `errors.js` with USER_ERRORS and ERROR_TYPES constants
- Create `constants.js` for magic numbers (MAX_BATCH_SIZE, JPEG_DEFAULT_QUALITY, etc.)
- E2E tests via Playwright; no unit test framework at MVP (appropriate for vanilla JS)

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (52 FRs, NFRs)
- [x] Scale and complexity assessed (low complexity, solo dev)
- [x] Technical constraints identified (client-side only, no framework)
- [x] Cross-cutting concerns mapped (7 items)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (vanilla + Tailwind + WASM)
- [x] Integration patterns defined (GA4, AdSense)
- [x] Performance considerations addressed (lazy load, sequential batch)

**✅ Implementation Patterns**
- [x] Naming conventions established (5 categories)
- [x] Structure patterns defined (build-time vs runtime)
- [x] Communication patterns specified (module boundaries)
- [x] Process patterns documented (error handling, state)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
1. Zero-dependency runtime — nothing to update, nothing to break
2. Clear module boundaries prevent spaghetti code
3. All 52 FRs have explicit file mappings
4. Build system scales from 13 to 1300 pages without rearchitecting
5. Testable architecture (injectable platform detection, mockable codecs)

**Areas for Future Enhancement:**
- Sentry or similar error monitoring at 25K+ monthly visitors
- PWA support when return visitors justify it
- i18n architecture when Spanish version unlocked

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
# Initialize project structure
mkdir -p covertconvert/{src/{css,js/codecs,assets},templates/partials,data,scripts,tests/{e2e,fixtures/{valid,invalid,edge-cases}},dist}

# Download Tailwind CLI (macOS)
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.0/tailwindcss-macos-arm64
chmod +x tailwindcss-macos-arm64 && mv tailwindcss-macos-arm64 covertconvert/tailwindcss
```
