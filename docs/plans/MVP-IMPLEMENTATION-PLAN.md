# MVP Implementation Plan: CovertConvert.app

**Target:** 6 weeks to launch
**Approach:** Incremental delivery, working software at each phase

---

## Phase 1: Project Setup & Foundation
**Duration:** 2-3 days

### 1.1 Repository Setup
- [ ] Create new repo: `covertconvert`
- [ ] Initialize with README
- [ ] Add .gitignore (node_modules, .DS_Store, dist)
- [ ] Create folder structure:
  ```
  covertconvert/
  ├── src/
  │   ├── index.html
  │   ├── css/
  │   ├── js/
  │   │   ├── main.js
  │   │   ├── converter.js
  │   │   ├── codecs/
  │   │   └── utils/
  │   └── assets/
  ├── pages/           # Landing pages
  ├── blog/            # Blog content (later)
  ├── public/          # Static assets
  └── docs/            # Documentation
  ```

### 1.2 Cloudflare Pages Setup
- [ ] Create Cloudflare account (if needed)
- [ ] Create new Pages project
- [ ] Connect to GitHub repo
- [ ] Configure custom domain: covertconvert.app
- [ ] Verify DNS propagation
- [ ] Confirm HTTPS working

### 1.3 Base HTML Structure
- [ ] Create index.html with semantic structure
- [ ] Add meta tags (viewport, charset, description)
- [ ] Add Open Graph tags
- [ ] Add favicon
- [ ] Link Tailwind CSS (CDN)
- [ ] Create basic page layout

**Deliverable:** Empty but deployed site at covertconvert.app

---

## Phase 2: Core UI Components
**Duration:** 3-4 days

### 2.1 Header & Navigation
- [ ] Logo/brand text
- [ ] Navigation links (About, How It Works)
- [ ] Mobile hamburger menu
- [ ] Responsive behavior

### 2.2 Drop Zone Component
- [ ] Large, prominent drop area
- [ ] Visual states:
  - Default: "Drop files here or click to browse"
  - Drag hover: highlighted border
  - Files added: file list
  - Converting: progress state
  - Complete: success state
- [ ] Click to open file picker
- [ ] Accept multiple files
- [ ] File type filtering (accept attribute)

### 2.3 File List Display
- [ ] Show added files with names
- [ ] File size display
- [ ] Remove individual file button
- [ ] Clear all button
- [ ] Format icon per file type

### 2.4 Output Format Toggle
- [ ] JPEG / PNG radio or toggle
- [ ] Default to JPEG
- [ ] Clear visual indication of selection

### 2.5 Convert Button
- [ ] Primary action button
- [ ] Disabled state when no files
- [ ] Loading state during conversion

### 2.6 Progress & Results
- [ ] Progress bar during conversion
- [ ] "Converting X of Y" text
- [ ] Success message
- [ ] Download button (single file)
- [ ] Download ZIP button (multiple files)
- [ ] Error messages per file

### 2.7 Footer
- [ ] Privacy link
- [ ] About link
- [ ] "Your files never leave your device" tagline
- [ ] Copyright

**Deliverable:** Fully styled UI (non-functional conversion)

---

## Phase 3: Core Conversion Logic
**Duration:** 5-7 days

### 3.1 File Detection
```javascript
// Implement format detection
function detectFormat(file) {
  // Check MIME type first
  // Fallback to extension
  // Handle edge cases (HEIC often has wrong MIME)
}
```
- [ ] Detect by MIME type
- [ ] Fallback to file extension
- [ ] Handle HEIC edge cases (image/heic, image/heif, etc.)
- [ ] Return standardized format string

### 3.2 Native Canvas Conversions
Formats that don't need WASM:
- [ ] PNG → JPEG/PNG
- [ ] WebP → JPEG/PNG (modern browsers)
- [ ] BMP → JPEG/PNG
- [ ] GIF → JPEG/PNG (first frame)

```javascript
async function convertWithCanvas(file, outputFormat) {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');

  // White background for JPEG (no transparency)
  if (outputFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);
  return await canvasToBlob(canvas, outputFormat, 0.92);
}
```

### 3.3 HEIC Codec Integration
- [ ] Add libheif-js to project
- [ ] Create lazy-loader for HEIC codec
- [ ] Implement HEIC → ImageData decoder
- [ ] Test with various HEIC files (iPhone, iPad)
- [ ] Handle HEIF variant

```javascript
let heicDecoder = null;

async function loadHeicCodec() {
  if (heicDecoder) return heicDecoder;
  const { HeicDecoder } = await import('./codecs/libheif.js');
  heicDecoder = new HeicDecoder();
  return heicDecoder;
}

async function decodeHeic(file) {
  const decoder = await loadHeicCodec();
  const buffer = await file.arrayBuffer();
  return decoder.decode(buffer);
}
```

### 3.4 TIFF Codec Integration
- [ ] Add UTIF.js to project
- [ ] Create lazy-loader for TIFF codec
- [ ] Implement TIFF → ImageData decoder
- [ ] Test with various TIFF files

### 3.5 AVIF Codec Integration
- [ ] Add Squoosh AVIF codec (WASM)
- [ ] Create lazy-loader
- [ ] Implement AVIF → ImageData decoder
- [ ] Test with AVIF files

### 3.6 Unified Conversion Pipeline
```javascript
async function convertFile(file, outputFormat) {
  const format = detectFormat(file);

  let imageData;
  switch (format) {
    case 'heic':
    case 'heif':
      imageData = await decodeHeic(file);
      break;
    case 'tiff':
      imageData = await decodeTiff(file);
      break;
    case 'avif':
      imageData = await decodeAvif(file);
      break;
    default:
      // Use native canvas for PNG, WebP, BMP, GIF
      return await convertWithCanvas(file, outputFormat);
  }

  // Render decoded imageData to canvas, export
  return await imageDataToBlob(imageData, outputFormat);
}
```

### 3.7 Batch Processing
- [ ] Sequential processing (not parallel)
- [ ] Progress callbacks
- [ ] Error handling per file
- [ ] Memory cleanup between files

```javascript
async function convertFiles(files, outputFormat, onProgress) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    onProgress({ current: i + 1, total: files.length, status: 'converting' });

    try {
      const blob = await convertFile(files[i], outputFormat);
      const newName = replaceExtension(files[i].name, outputFormat);
      results.push({ name: newName, blob, success: true });
    } catch (error) {
      results.push({ name: files[i].name, error: error.message, success: false });
    }

    // Yield to prevent UI freeze
    await new Promise(r => setTimeout(r, 10));
  }

  onProgress({ current: files.length, total: files.length, status: 'complete' });
  return results;
}
```

### 3.8 Download Logic
- [ ] Single file: direct blob download
- [ ] Multiple files: JSZip bundle
- [ ] Proper filename handling
- [ ] Blob URL cleanup

```javascript
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadAsZip(results) {
  const JSZip = await import('jszip');
  const zip = new JSZip();

  for (const result of results) {
    if (result.success) {
      zip.file(result.name, result.blob);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, 'converted-images.zip');
}
```

**Deliverable:** Fully functional converter (home page only)

---

## Phase 4: UX Polish & Error Handling
**Duration:** 2-3 days

### 4.1 Loading States
- [ ] Codec loading indicator
- [ ] Conversion progress bar
- [ ] "Converting X of Y files" text
- [ ] Disable interactions during conversion

### 4.2 Error Handling
- [ ] Unsupported format message
- [ ] Conversion failure per file (don't stop batch)
- [ ] Codec load failure fallback
- [ ] Graceful degradation

### 4.3 Warnings
- [ ] 30+ files warning (soft, dismissable)
- [ ] "If browser freezes, try fewer files" note
- [ ] Large file size warning (>50MB)

### 4.4 Success States
- [ ] Clear "Conversion complete" message
- [ ] Show which files succeeded/failed
- [ ] Prominent download button
- [ ] "Convert more" reset option

### 4.5 Mobile UX
- [ ] Touch-friendly drop zone
- [ ] "Tap to select files" text on mobile
- [ ] Full-width layout on small screens
- [ ] Large touch targets (48px min)

### 4.6 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader labels (aria-label)
- [ ] Focus indicators
- [ ] Color contrast check
- [ ] Reduced motion support

**Deliverable:** Production-quality UX

---

## Phase 5: SEO Landing Pages
**Duration:** 3-4 days

### 5.1 Page Template
Create reusable template for landing pages:
```html
<!-- Each page has: -->
- Unique <title>
- Unique <meta description>
- Unique H1
- Same converter component
- Unique intro paragraph (100-200 words)
- Unique FAQ section (5-6 questions)
- Schema markup (FAQ, HowTo)
- Internal links to other converters
```

### 5.2 Landing Pages to Create
- [ ] /heic-to-jpg
- [ ] /heic-to-png
- [ ] /webp-to-jpg
- [ ] /webp-to-png
- [ ] /png-to-jpg
- [ ] /avif-to-jpg
- [ ] /avif-to-png
- [ ] /tiff-to-jpg
- [ ] /iphone-photo-to-jpg

### 5.3 Content Per Page

**Example: /heic-to-jpg**
```
Title: HEIC to JPG Converter — Free, Private, No Upload | CovertConvert
Description: Convert HEIC to JPG instantly. Your files never leave your device. No upload, no signup, unlimited free conversions.

H1: Convert HEIC to JPG

Intro: [100-200 words about HEIC, why convert, why private matters]

FAQ:
- What is a HEIC file?
- Why does my iPhone save photos as HEIC?
- Is it safe to convert HEIC online?
- How do I convert HEIC to JPG without uploading?
- Will converting HEIC to JPG reduce quality?
- Can I convert multiple HEIC files at once?
```

### 5.4 Trust Pages
- [ ] /about — Who made this, why, credibility
- [ ] /privacy — Clear privacy policy (no data collected)
- [ ] /how-it-works — Technical explanation, network tab proof

### 5.5 Technical SEO
- [ ] XML sitemap generation
- [ ] robots.txt
- [ ] Canonical URLs (self-referencing)
- [ ] Schema markup implementation
- [ ] Internal linking structure
- [ ] 404 page

**Deliverable:** All landing pages live and indexable

---

## Phase 6: Analytics & Monetization
**Duration:** 2-3 days

### 6.1 Google Analytics 4
- [ ] Create GA4 property
- [ ] Add tracking code
- [ ] Configure conversion events:
  - file_converted
  - batch_converted
  - download_zip
  - format_toggle
- [ ] Test event firing
- [ ] Set up basic reports

### 6.2 Google Search Console
- [ ] Verify domain ownership
- [ ] Submit sitemap
- [ ] Request indexing for key pages
- [ ] Configure alerts

### 6.3 Google AdSense
- [ ] Apply for AdSense account
- [ ] Wait for approval (can take days)
- [ ] Create ad units:
  - Sidebar (desktop)
  - Below converter (mobile)
  - In-content (optional)
- [ ] Implement responsive ad code
- [ ] Test ad rendering
- [ ] Verify no policy violations

### 6.4 Performance Monitoring
- [ ] Cloudflare Analytics review
- [ ] Core Web Vitals check
- [ ] Set up uptime monitoring (free tier of UptimeRobot)

**Deliverable:** Tracking active, ads ready (pending approval)

---

## Phase 7: Testing & QA
**Duration:** 2-3 days

### 7.1 Functional Testing
- [ ] All input formats convert correctly
- [ ] JPEG output works
- [ ] PNG output works
- [ ] Single file download works
- [ ] ZIP download works
- [ ] Batch processing works
- [ ] Error handling works
- [ ] Progress indication works

### 7.2 Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome mobile
- [ ] Safari mobile (iOS)

### 7.3 Device Testing
- [ ] Desktop (1920px+)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### 7.4 Performance Testing
- [ ] Lighthouse audit (target 90+)
- [ ] Core Web Vitals green
- [ ] WASM load time <500ms
- [ ] Conversion speed reasonable

### 7.5 Edge Case Testing
- [ ] Very large file (50MB+)
- [ ] Many files (50+)
- [ ] Corrupt file handling
- [ ] Wrong extension (heic named .jpg)
- [ ] Mixed valid/invalid batch

### 7.6 SEO Validation
- [ ] All pages render without JS
- [ ] Schema validates (Rich Results Test)
- [ ] Mobile-friendly test passes
- [ ] No broken links

**Deliverable:** QA checklist complete, bugs fixed

---

## Phase 8: Launch
**Duration:** 1-2 days

### 8.1 Pre-Launch Checklist
- [ ] All pages deployed
- [ ] All functionality working
- [ ] Analytics firing
- [ ] Ads approved and showing (or placeholder)
- [ ] Privacy policy accurate
- [ ] About page complete
- [ ] Social meta tags working
- [ ] Favicon in place

### 8.2 Launch Activities
- [ ] Submit to Product Hunt
- [ ] Post on Hacker News (Show HN)
- [ ] Post on relevant subreddits:
  - r/privacy
  - r/iphone
  - r/webdev
  - r/SideProject
- [ ] Tweet/post on social
- [ ] Submit to AlternativeTo
- [ ] Submit to SaaSHub

### 8.3 Post-Launch Monitoring
- [ ] Monitor Search Console for indexing
- [ ] Monitor Analytics for traffic
- [ ] Monitor Cloudflare for errors
- [ ] Respond to feedback/issues
- [ ] Fix any bugs discovered

**Deliverable:** Site launched and announced

---

## Post-MVP Backlog

### Content (Ongoing)
- [ ] Week 1 blog post: "What is HEIC?"
- [ ] Week 2 blog post: "Is It Safe to Convert Photos Online?"
- [ ] Week 3 blog post: "How to Convert iPhone Photos"
- [ ] Week 4 blog post: "HEIC vs JPG Comparison"
- [ ] Continue weekly content

### Features (Future)
- [ ] Quality slider for JPEG
- [ ] PWA / "Add to Home Screen"
- [ ] Keyboard shortcuts
- [ ] Drag-drop reordering
- [ ] Filename customization
- [ ] Remember last output format

### SEO (Ongoing)
- [ ] Link building outreach
- [ ] Guest post pitches
- [ ] Competitor monitoring
- [ ] Ranking tracking
- [ ] Content updates

### International (Future)
- [ ] Spanish translation
- [ ] German translation
- [ ] Portuguese translation

---

## Resource Links

### Libraries
- libheif-js: https://github.com/nicjansma/libheif-js
- UTIF.js: https://github.com/nicjansma/psd.js/tree/master/dist
- Squoosh codecs: https://github.com/nicjansma/nicjansma.github.io/tree/master/nicjansma-js-libs/nicjansma-image-compress
- JSZip: https://stuk.github.io/jszip/

### Tools
- Cloudflare Pages: https://pages.cloudflare.com/
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com/
- Google AdSense: https://www.google.com/adsense/
- Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/

### References
- Schema.org FAQ: https://schema.org/FAQPage
- Schema.org HowTo: https://schema.org/HowTo
- Tailwind CSS: https://tailwindcss.com/
- Web.dev Performance: https://web.dev/performance/

---

## Notes

- Prioritize working software over perfect software
- Ship incrementally, improve based on data
- SEO results take 3-6 months — be patient
- Focus on one thing at a time
- Don't over-engineer MVP
