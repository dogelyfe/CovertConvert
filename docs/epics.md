---
stepsCompleted: [1, 2, 3, 4]
status: COMPLETE
inputDocuments:
  - docs/PRD.md
  - docs/architecture.md
  - docs/ux-design-specification.md
workflowType: 'epics-stories'
lastStep: 4
project_name: 'CovertConvert'
user_name: 'Andrew'
date: '2025-12-12'
---

# CovertConvert - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for CovertConvert, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Implementation Status

**All epics complete.** Deployed to https://covertconvert.pages.dev/

| Epic | Status | Completed | Stories |
|------|--------|-----------|---------|
| Epic 1: Core Conversion Engine | COMPLETE | 2025-12-12 | 8/8 |
| Epic 2: Batch Processing & Platform Downloads | COMPLETE | 2025-12-12 | 7/7 |
| Epic 3: Landing Pages & SEO | COMPLETE | 2025-12-12 | 6/6 |
| Epic 4: Trust & Transparency | COMPLETE | 2025-12-12 | 3/3 |
| Epic 5: Analytics, Ads & Accessibility | COMPLETE | 2025-12-12 | 4/4 |

**Total: 28 stories implemented**

### Post-MVP Enhancements (2025-12-13)
- Dark mode with localStorage persistence (default: dark)
- Fixed frosted-glass header with wordmark + theme toggle
- 48 E2E tests passing

## Requirements Inventory

### Functional Requirements

**File Input & Detection (FR1-FR6):**
- FR1: Users can drop image files onto the converter drop zone
- FR2: Users can click to browse and select image files
- FR3: Users can select multiple files at once for batch processing
- FR4: System can detect input file format from file signature and extension
- FR5: System can validate whether a file format is supported
- FR6: System can display clear error for unsupported formats with list of supported types

**Image Conversion (FR7-FR17):**
- FR7: Users can convert HEIC/HEIF images to output format
- FR8: Users can convert WebP images to output format
- FR9: Users can convert AVIF images to output format
- FR10: Users can convert TIFF images to output format
- FR11: Users can convert PNG images to output format
- FR12: Users can convert BMP images to output format
- FR13: Users can convert GIF images to output format (first frame)
- FR14: Users can select JPEG as output format
- FR15: Users can select PNG as output format
- FR16: Users can adjust JPEG compression quality via slider
- FR17: System can lazy-load WASM codecs only when required format is detected

**Output & Download (FR18-FR21):**
- FR18: Users can download a single converted file directly
- FR19: Users can download multiple converted files as a ZIP archive
- FR20: System can auto-trigger download for single file conversions
- FR21: System can generate meaningful output filenames (original name + new extension)

**Progress & Feedback (FR22-FR27):**
- FR22: Users can see conversion progress indicator during processing
- FR23: Users can see "Converting X of Y" status for batch operations
- FR24: Users can see success confirmation when conversion completes
- FR25: Users can see per-file error messages when individual conversions fail
- FR26: Users can see graceful error message when WASM codec fails to load
- FR27: System can continue batch processing when individual files fail

**Warnings & Guidance (FR28-FR30):**
- FR28: System can display soft warning when batch exceeds 30 files
- FR29: System can display soft warning for individual files exceeding 25MB
- FR30: Users can dismiss warnings and proceed with conversion anyway

**Conversion Reset (FR31-FR32):**
- FR31: Users can clear completed conversions to start a fresh session
- FR32: Drop zone can accept new files after previous conversion completes

**SEO Landing Pages (FR33-FR38):**
- FR33: Users can access format-specific landing pages via direct URL (e.g., /heic-to-jpg)
- FR34: Users can navigate to alternative output format via cross-link on each page
- FR35: Each landing page can display unique title, description, and H1 matching URL intent
- FR36: Each landing page can display format-specific FAQ content
- FR37: System can serve pages with proper schema markup (FAQ, HowTo, SoftwareApplication)
- FR38: System can determine output format based on landing page URL path

**Trust & Transparency Pages (FR39-FR42):**
- FR39: Users can access /about page with product information
- FR40: Users can access /privacy page with privacy policy
- FR41: Users can access /how-it-works page with technical explanation
- FR42: Users can verify no network requests occur during conversion (architecture supports this)

**Universal Converter - Home Page (FR43-FR45):**
- FR43: Users can access universal converter at root URL (/)
- FR44: Users can toggle between JPEG and PNG output on home page
- FR45: Home page can accept any supported input format

**Analytics Integration (FR46-FR48):**
- FR46: System can track file_dropped events to GA4
- FR47: System can track file_downloaded events to GA4
- FR48: System can track conversion_error events to GA4 with error type

**Accessibility (FR49-FR52):**
- FR49: Users can navigate all interactive elements via keyboard
- FR50: Users can perceive focus indicators on interactive elements
- FR51: Screen reader users can understand drop zone purpose via ARIA labels
- FR52: Users can disable animations via reduced motion preference

### NonFunctional Requirements

**Performance (NFR-P1-P4):**
- NFR-P1: Sequential processing to prevent browser memory exhaustion
- NFR-P2: No browser freeze or crash on 50+ file batches (desktop)
- NFR-P3: Progress feedback updates at least every 2 seconds during batch
- NFR-P4: Graceful handling of browser memory pressure

**Core Web Vitals:**
- LCP < 1.0s
- FID < 100ms
- CLS < 0.1
- TTI < 2.0s
- WASM codec load < 500ms
- Initial page weight < 100KB

**Security & Privacy (NFR-S1-S4):**
- NFR-S1: Zero file data transmitted to any server (verifiable via network inspector)
- NFR-S2: No cookies set except for analytics (GA4)
- NFR-S3: No user accounts, no password storage, no PII collection
- NFR-S4: No third-party scripts except GA4 and AdSense

**Accessibility (NFR-A1-A8):**
- NFR-A1: Color contrast ratio >= 4.5:1 for all text
- NFR-A2: All interactive elements keyboard accessible
- NFR-A3: Focus indicators visible (not suppressed by CSS)
- NFR-A4: Touch targets minimum 48x48px on mobile
- NFR-A5: Screen reader compatibility (ARIA labels on custom controls)
- NFR-A6: Respects prefers-reduced-motion setting
- NFR-A7: No content relies solely on color to convey meaning
- NFR-A8: Error messages visible without scrolling on mobile viewport

**Reliability (NFR-R1-R5):**
- NFR-R1: Cloudflare Pages provides CDN-level availability (99.9%+ SLA)
- NFR-R2: Site functions after initial load without network (offline-capable after WASM cached)
- NFR-R3: Failure rate tracked via GA4; investigate if exceeds 2%
- NFR-R4: Individual file failures don't crash batch processing
- NFR-R5: Clear error messages with actionable guidance

**Integration (NFR-I1-I13):**
- NFR-I1: Track page_view, file_dropped, file_downloaded, conversion_error events
- NFR-I2: Ad containers have reserved height to prevent layout shift (CLS)
- NFR-I3: Ad placements don't interfere with file selector interaction
- NFR-I4: Ads lazy-loaded to not impact LCP
- NFR-I5: Site functions normally if AdSense blocked or fails to load
- NFR-I6: No interstitial ads
- NFR-I7: No ads between user action and result (critical path protected)
- NFR-I8: Desktop: sidebar ads only (300x250 or 300x600)
- NFR-I9: Mobile: ads below fold only (320x100 or 300x250)
- NFR-I10: Ad containers use --gray-50 placeholder background
- NFR-I11: FAQ schema on all landing pages
- NFR-I12: HowTo schema on /how-it-works
- NFR-I13: SoftwareApplication schema on home page

**Maintainability (NFR-M1-M5):**
- NFR-M1: No build system more complex than a single Node script
- NFR-M2: No framework dependencies (vanilla HTML/CSS/JS)
- NFR-M3: Template changes propagate to all pages via rebuild
- NFR-M4: All code readable by a single developer without specialized knowledge
- NFR-M5: Dependencies limited to: WASM codecs, JSZip, Tailwind CSS (CDN)

### Additional Requirements

**From Architecture - Starter Template (CRITICAL for Epic 1):**
- Initialize project with Vanilla + Tailwind CLI + Template Literals
- Create project structure per architecture spec
- Download Tailwind CLI standalone binary
- Create build.js script (~50 lines)
- Zero runtime npm dependencies

**From Architecture - Technical Decisions:**
- WASM codecs: Lazy load with connection-aware preload hints
- State management: Module-scoped with reset function
- Platform detection: Unbundled (width for downloads, touch for copy, CSS for ads)
- Error handling: Result objects { ok, data, error } with classification
- Analytics: Rich parameters, snake_case, no PII

**From Architecture - Implementation Patterns:**
- File naming: kebab-case dirs, camelCase JS files
- Named exports only (no default exports)
- Cache DOM queries at module scope
- BEM-lite for CSS component classes
- GA4 snake_case event naming

**From Architecture - Module Structure:**
- main.js: DOM initialization, event binding
- converter.js: Conversion orchestration, state
- detector.js: Format detection (signature/extension)
- downloader.js: Download triggering (ZIP/direct/sequential)
- platform.js: Platform detection (touch, width, memory)
- analytics.js: GA4 event helpers
- errors.js: Error constants and user messages
- ui.js: DOM updates, progress, error display
- codecs/loader.js: Lazy codec loading
- codecs/*-wrapper.js: Individual codec interfaces

**From UX - Design System:**
- khrome Design Bible v1.1 (grayscale) - forked subset (~65 lines CSS)
- High Key (light) / Low Key (dark) theme support
- prefers-color-scheme detection
- prefers-reduced-motion support
- Functional colors: muted green (success), muted red (error), muted amber (warning)

**From UX - Component States:**
- File selector states: default, hover, active, success, error
- Progress thresholds: skip if <500ms, minimal 500ms-2s, full >2s
- 500ms success pause before auto-download
- Batch progress: "Converting X of Y..." with thin 4px progress bar

**From UX - Platform-Specific Download:**
- Desktop: Single = direct, Multiple = ZIP
- Mobile: 1-5 files = sequential direct downloads
- Mobile: 6-10 files = sequential + "Large batches work better on desktop"
- Mobile: 11+ files = first 10 + "Continue on desktop for more"

**From UX - Ad Placement:**
- Desktop: Sidebar ads only (300x250 or 300x600)
- Mobile: Below fold only (320x100 or 300x250)
- Reserved height with --gray-50 placeholder
- Never in critical path (select -> convert -> download)

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1-FR6 | Epic 1 | File input & detection |
| FR7-FR17 | Epic 1 | All image conversions + quality slider |
| FR18 | Epic 1 | Single file download |
| FR19 | Epic 2 | ZIP archive download |
| FR20-FR21 | Epic 1 | Auto-download, filenames |
| FR22-FR27 | Epic 2 | Progress & feedback (batch) |
| FR28-FR30 | Epic 2 | Warnings & guidance |
| FR31-FR32 | Epic 2 | Reset functionality |
| FR33-FR38 | Epic 3 | SEO landing pages |
| FR39-FR42 | Epic 4 | Trust pages |
| FR43-FR45 | Epic 3 | Home page / universal converter |
| FR46-FR48 | Epic 5 | Analytics |
| FR49-FR52 | Epic 5 | Accessibility |

## Epic List

### Epic 1: Core Conversion Engine
A user can convert a single image file and download the result instantly. This epic delivers the complete "it just works" experience for single files.

**FRs covered:** FR1-FR6, FR7-FR17, FR18, FR20-FR21

**Includes:**
- Project foundation (structure, build system, CSS)
- File selector (drop/click)
- All format conversions (Canvas + WASM codecs)
- Format detection
- Single file direct download (auto-trigger)
- Basic progress & success states
- JPEG quality slider
- Trust message in UI ("Your files never leave your device")

**Story Sequencing Notes:**
- Story 1.1 = project setup only (no conversion code)
- WASM codecs come in later stories within this epic
- Basic a11y considered during implementation

---

### Epic 2: Batch Processing & Platform Downloads
A user can convert multiple files efficiently, with platform-appropriate download behavior.

**FRs covered:** FR19, FR22-FR27, FR28-FR30, FR31-FR32

**Includes:**
- ZIP download (desktop)
- Sequential downloads (mobile)
- Batch progress ("Converting X of Y...")
- Per-file error handling
- Batch warnings (30+ files, 25MB+ files)
- Reset/clear functionality

---

### Epic 3: Landing Pages & SEO
A user discovers the right converter via Google and finds a page that matches their intent.

**FRs covered:** FR33-FR38, FR43-FR45

**Includes:**
- 9 SEO landing pages (/heic-to-jpg, etc.)
- Home page with JPEG/PNG toggle
- URL-based output format
- Cross-links between formats
- FAQ content per page
- Schema markup (FAQ, HowTo, SoftwareApplication)

---

### Epic 4: Trust & Transparency
A user can verify the privacy claims and understand how the product works.

**FRs covered:** FR39-FR42

**Includes:**
- /about page
- /privacy page
- /how-it-works page (technical explanation)
- Verifiable architecture documentation

---

### Epic 5: Analytics, Ads & Accessibility
Business can track conversions and monetize; all users can access the converter regardless of ability. This epic also includes cross-browser test matrix verification.

**FRs covered:** FR46-FR52

**Includes:**
- GA4 events (file_dropped, file_downloaded, conversion_error)
- AdSense integration with reserved heights
- Keyboard navigation verification
- Focus indicators verification
- ARIA labels verification
- Reduced motion support verification
- Cross-browser test matrix execution

**Notes:**
- Basic a11y is considered throughout Epics 1-4
- Epic 5 is the verification and polish pass
- Tests written in earlier epics; Epic 5 runs them across browser matrix

---

## Epic Dependencies

```
Epic 1 (Core Engine) ← Foundation, standalone
    ↓
Epic 2 (Batch) ← Builds on Epic 1's converter
    ↓
Epic 3 (Landing Pages) ← Uses converter component from Epic 1/2
    ↓
Epic 4 (Trust Pages) ← Uses page templates from Epic 3
    ↓
Epic 5 (Analytics/Ads/A11y) ← Cross-cutting, enhances all
```

Each epic is **standalone** — Epic 2 adds batch features but Epic 1 is complete without it.

---

## Epic 1: Core Conversion Engine

A user can convert a single image file and download the result instantly. This epic delivers the complete "it just works" experience for single files.

### Story 1.1: Project Foundation & Build System

As a **developer**,
I want **the project structure and build system initialized per architecture spec**,
So that **I have a working foundation to build features on**.

**Acceptance Criteria:**

**Given** I clone the repository
**When** I run `npm install`
**Then** dev dependencies are installed (concurrently, live-server, playwright)
**And** no runtime dependencies exist in node_modules for production

**Given** the project structure exists
**When** I inspect the directories
**Then** I see the exact structure from architecture.md:
- `src/js/`, `src/css/`, `src/assets/`
- `templates/`, `templates/partials/`
- `data/`, `scripts/`, `tests/e2e/`, `tests/fixtures/`

**Given** Tailwind CLI is downloaded
**When** I run `npm run build`
**Then** CSS is compiled from `src/css/input.css` to `dist/css/styles.css`
**And** the build completes without errors

**Given** the khrome CSS subset exists
**When** I inspect `src/css/covertconvert.css`
**Then** I see the grayscale palette, typography scale, spacing, and functional colors (~65 lines)

**Given** I run `npm run dev`
**When** I open the browser
**Then** I see a basic HTML page with Tailwind styles applied
**And** live-reload works on file changes

**Given** the test fixtures folder
**When** I inspect `tests/fixtures/`
**Then** I see subdirectories: `valid/`, `invalid/`, `edge-cases/`
**And** `valid/` contains at least one sample file per supported format (HEIC, AVIF, TIFF, PNG, WebP, BMP, GIF)

---

### Story 1.2: File Selector Component

As a **user**,
I want **to select image files via drag-drop or click**,
So that **I can choose files to convert using my preferred method**.

**Acceptance Criteria:**

**Given** I am on any converter page
**When** I view the page
**Then** I see a prominent file selector with platform-appropriate copy:
- Desktop: "Drop files here or click to select"
- Mobile: "Tap to select files"

**Given** I am on desktop
**When** I drag a file over the drop zone
**Then** the drop zone shows hover state (visual feedback)
**And** dropping the file triggers file selection

**Given** I am on any device
**When** I click/tap the file selector
**Then** the native file picker opens
**And** I can select one or more image files

**Given** I select file(s)
**When** the selection completes
**Then** visual feedback appears within 100ms
**And** the file selector shows "active" state

**Given** the file selector component
**When** I inspect accessibility
**Then** it has proper ARIA labels
**And** it is keyboard accessible (Enter/Space to activate)
**And** focus indicators are visible

---

### Story 1.3: Format Detection & Validation

As a **user**,
I want **the system to automatically detect my file's format**,
So that **I don't need to know technical details about file types**.

**Acceptance Criteria:**

**Given** I select a supported image file (HEIC, WebP, AVIF, TIFF, PNG, BMP, GIF)
**When** the file is processed
**Then** the format is detected from file signature (magic bytes)
**And** extension is used as fallback if signature is ambiguous

**Given** I select an unsupported file (e.g., .psd, .pdf, .doc)
**When** format detection runs
**Then** I see a clear error: "This file type isn't supported."
**And** the error lists supported formats: "CovertConvert works with HEIC, WebP, AVIF, TIFF, PNG, BMP, and GIF."

**Given** I select a file with wrong extension (e.g., .jpg that's actually PNG)
**When** format detection runs
**Then** the actual format is detected from signature
**And** conversion proceeds correctly

**Given** the detector module
**When** I inspect the code
**Then** it exports named functions only (no default export)
**And** follows architecture patterns

---

### Story 1.4: Canvas-Based Conversion (Tier 1 Formats)

As a **user**,
I want **to convert PNG, WebP, BMP, and GIF images to JPEG or PNG**,
So that **I can get compatible files without waiting for codec downloads**.

**Acceptance Criteria:**

**Given** I select a PNG, WebP, BMP, or GIF file
**When** conversion starts
**Then** the image is decoded using Canvas API (no WASM required)
**And** the image is encoded to the target format (JPEG or PNG)

**Given** I am converting to JPEG
**When** conversion completes
**Then** the output uses default quality (92%)
**And** the file is a valid JPEG

**Given** I am converting to PNG
**When** conversion completes
**Then** the output is a valid PNG with lossless compression

**Given** I select a GIF file
**When** conversion runs
**Then** only the first frame is converted (per FR13)
**And** the output is the target format

**Given** conversion is in progress
**When** I observe the UI
**Then** I see "Converting..." state
**And** if conversion takes >500ms, progress is visible

**Given** the converter module
**When** I inspect the code
**Then** it uses Result objects `{ ok, data, error }` per architecture
**And** state is module-scoped with reset function

---

### Story 1.5: WASM Codec Integration (Tier 2 Formats)

As a **user**,
I want **to convert HEIC, AVIF, and TIFF images**,
So that **I can convert iPhone photos and modern formats**.

**Implementation Note:** Implement HEIC (libheif-js) first — it's the most common use case and validates the lazy-loading pattern. AVIF and TIFF follow the same pattern.

**Acceptance Criteria:**

**Given** I select a HEIC/HEIF file
**When** conversion starts
**Then** libheif-js is lazy-loaded (if not cached)
**And** the image is decoded and converted to target format

**Given** I select an AVIF file
**When** conversion starts
**Then** Squoosh AVIF decoder is lazy-loaded
**And** the image is decoded and converted

**Given** I select a TIFF file
**When** conversion starts
**Then** UTIF.js is lazy-loaded
**And** the image is decoded and converted

**Given** this is my first WASM conversion in the session
**When** the codec loads
**Then** I see "Loading converter..." briefly (300-500ms typical)
**And** subsequent conversions of the same format are instant

**Given** I am on a fast connection (4g per navigator.connection)
**When** the page loads
**Then** HEIC codec is preloaded via `<link rel="preload">`

**Given** WASM fails to load (blocked proxy, old browser)
**When** I try to convert a Tier 2 format
**Then** I see error: "Please update your browser." (per FR26)
**And** the error is tracked to GA4 as conversion_error

**Given** the codecs/loader module
**When** I inspect the code
**Then** each codec is dynamically imported only when needed
**And** loaded codecs are cached in module scope

---

### Story 1.6: Single File Download

As a **user**,
I want **my converted file to download automatically**,
So that **I get my result with zero extra clicks**.

**Acceptance Criteria:**

**Given** single file conversion succeeds
**When** the conversion completes
**Then** success state appears ("✓ Done!")
**And** after 500ms pause, download auto-triggers

**Given** the original file was named "IMG_1234.heic"
**When** downloading as JPEG
**Then** the filename is "IMG_1234.jpg"
**And** the original name is preserved with new extension

**Given** download triggers
**When** the browser handles it
**Then** the file downloads to the user's default location
**And** no "click to download" button is shown

**Given** the download completes
**When** I view the file selector
**Then** it shows success state with trust message visible
**And** it is ready to accept new files

**Given** the downloader module
**When** I inspect the code
**Then** it creates Blob URLs and triggers via anchor click
**And** Blob URLs are revoked after download

---

### Story 1.7: JPEG Quality Slider

As a **user**,
I want **to adjust JPEG compression quality**,
So that **I can balance file size and image quality**.

**Acceptance Criteria:**

**Given** I am converting to JPEG
**When** I view the converter
**Then** I see a quality slider (range 1-100)
**And** default value is 92

**Given** I adjust the slider to 75
**When** conversion completes
**Then** the JPEG is encoded at 75% quality
**And** the file is smaller than 92% quality

**Given** I am converting to PNG
**When** I view the converter
**Then** the quality slider is hidden or disabled (PNG is lossless)

**Given** the slider component
**When** I inspect accessibility
**Then** it has proper ARIA labels
**And** it is keyboard accessible
**And** current value is announced to screen readers

---

### Story 1.8: UI States & Feedback

As a **user**,
I want **clear visual feedback at every step**,
So that **I always know what's happening**.

**Acceptance Criteria:**

**Given** no file is selected
**When** I view the file selector
**Then** it shows default state (ready for input)
**And** trust message is visible: "Your files never leave your device."

**Given** files are being converted
**When** I view the UI
**Then** I see "Converting..." text
**And** the file selector shows active state

**Given** conversion succeeds
**When** the result appears
**Then** I see "✓ Done!" with muted green styling
**And** success persists until I select new files

**Given** conversion fails
**When** the error appears
**Then** I see the error message with muted red styling
**And** the message includes guidance for next steps

**Given** any state transition
**When** I observe the UI
**Then** transitions use 100-250ms duration (per khrome)
**And** `prefers-reduced-motion` disables animations

**Given** the UI module
**When** I inspect the code
**Then** DOM queries are cached at module scope
**And** it uses BEM-lite class naming (.file-selector, .file-selector--active, etc.)

---

## Epic 2: Batch Processing & Platform Downloads

A user can convert multiple files efficiently, with platform-appropriate download behavior.

### Story 2.1: Multi-File Selection & Batch State

As a **user**,
I want **to select multiple files at once**,
So that **I can convert a batch of images efficiently**.

**Acceptance Criteria:**

**Given** I am on the converter
**When** I select multiple files via file picker
**Then** all selected files are queued for conversion
**And** I see the count of files selected

**Given** I drag multiple files onto the drop zone
**When** I drop them
**Then** all files are accepted and queued
**And** conversion begins automatically

**Given** the converter state module
**When** batch files are set
**Then** state tracks: files[], currentIndex, status
**And** resetState() clears all batch data

---

### Story 2.2: Batch Progress UI

As a **user**,
I want **to see progress during batch conversion**,
So that **I know how many files are done and how many remain**.

**Acceptance Criteria:**

**Given** I am converting multiple files
**When** conversion is in progress
**Then** I see "Converting X of Y..." text
**And** a thin 4px progress bar shows percentage complete

**Given** batch conversion takes >2 seconds total
**When** I observe the UI
**Then** progress updates at least every 2 seconds (per NFR-P3)

**Given** individual files complete at varying speeds
**When** each file finishes
**Then** the counter increments immediately
**And** progress bar updates smoothly

**Given** the progress component
**When** I inspect the CSS
**Then** it uses `.progress-batch`, `.progress-batch__fill`, `.progress-batch__text`
**And** fill color is `--gray-700` on `--gray-300` background

---

### Story 2.3: ZIP Download (Desktop)

As a **desktop user**,
I want **multiple converted files bundled in a ZIP**,
So that **I get one download instead of many**.

**Acceptance Criteria:**

**Given** I am on desktop (viewport >= 768px)
**When** batch conversion completes (2+ files)
**Then** a ZIP file is created containing all converted files
**And** download auto-triggers after 500ms success pause

**Given** the ZIP is created
**When** I inspect the filename
**Then** it is named "covertconvert-images.zip" or similar
**And** internal files have meaningful names (original name + new extension)

**Given** JSZip library
**When** batch processing runs
**Then** JSZip is lazy-loaded only when needed
**And** ZIP creation happens client-side (no server)

---

### Story 2.4: Sequential Downloads (Mobile)

As a **mobile user**,
I want **files to download individually to my camera roll/Downloads**,
So that **I don't have to extract a ZIP file**.

**Acceptance Criteria:**

**Given** I am on mobile (viewport < 768px)
**When** batch conversion completes (1-5 files)
**Then** each file downloads sequentially with 500ms delay between
**And** files go to camera roll (iOS) or Downloads (Android)

**Given** I convert 6-10 files on mobile
**When** downloads complete
**Then** all files download sequentially
**And** I see soft message: "Large batches work better on desktop"

**Given** I convert 11+ files on mobile
**When** processing runs
**Then** first 10 files are converted and downloaded
**And** I see message: "For more files, continue on desktop"

**Given** sequential downloads are in progress
**When** I observe the UI
**Then** I see "Downloading X of Y..."

---

### Story 2.5: Per-File Error Handling

As a **user**,
I want **batch conversion to continue when individual files fail**,
So that **one bad file doesn't stop my entire batch**.

**Acceptance Criteria:**

**Given** I convert 10 files and 2 fail
**When** batch completes
**Then** I see: "Converted 8 of 10 files."
**And** the 8 successful files are downloadable

**Given** a file fails during batch
**When** the error occurs
**Then** the error is logged with file name
**And** processing continues to next file (per FR27)

**Given** all files in a batch fail
**When** batch completes
**Then** I see appropriate error message
**And** no download is triggered

**Given** the converter module
**When** handling batch errors
**Then** each file result uses `{ ok, data, error }` pattern
**And** errors are classified (unsupported_format, decode_failed, etc.)

---

### Story 2.6: Batch Warnings

As a **user**,
I want **soft warnings for large batches or files**,
So that **I'm informed but not blocked**.

**Acceptance Criteria:**

**Given** I select more than 30 files
**When** selection completes
**Then** I see warning: "Large batch — this may take a moment."
**And** I can dismiss and proceed anyway (per FR30)

**Given** I select a file larger than 25MB
**When** the file is detected
**Then** I see warning: "Large file — conversion may take longer."
**And** I can dismiss and proceed

**Given** warnings appear
**When** I view the styling
**Then** warnings use muted amber (`--warning-text`, `--warning-bg`)
**And** they don't block the conversion flow

**Given** I dismiss a warning
**When** conversion proceeds
**Then** the warning disappears
**And** conversion runs normally

---

### Story 2.7: Reset & New Batch

As a **user**,
I want **to start fresh after completing a batch**,
So that **I can convert more files without refreshing the page**.

**Acceptance Criteria:**

**Given** batch conversion completes
**When** I view the file selector
**Then** it shows success state AND is ready for new files
**And** selecting new files clears previous results

**Given** I want to explicitly reset
**When** I interact with the selector (click/drop new files)
**Then** previous state is cleared
**And** new batch begins

**Given** the converter state
**When** resetState() is called
**Then** files[], currentIndex, status all reset to initial values
**And** UI reflects the reset state

---

## Epic 3: Landing Pages & SEO

A user discovers the right converter via Google and finds a page that matches their intent.

### Story 3.1: Page Generation System

As a **developer**,
I want **a template-based page generation system**,
So that **I can create many pages from JSON data without repetition**.

**Acceptance Criteria:**

**Given** templates exist in `templates/`
**When** I run `npm run build`
**Then** pages are generated from JSON data in `data/`
**And** output goes to `dist/` with proper directory structure

**Given** `data/seo-pages.json` contains page definitions
**When** build runs
**Then** each entry generates `/[slug]/index.html`
**And** template variables are replaced (title, description, h1, outputFormat)

**Given** the build script
**When** I inspect `scripts/build.js`
**Then** it is ~50 lines or less
**And** uses template literals (no templating library)

**Given** I add a new entry to seo-pages.json
**When** I rebuild
**Then** the new page is generated automatically
**And** no code changes are required

---

### Story 3.2: SEO Landing Pages (9 Pages)

As a **user searching Google**,
I want **format-specific landing pages**,
So that **I find exactly what I searched for**.

**Acceptance Criteria:**

**Given** the build completes
**When** I check the dist folder
**Then** I see the initial SEO landing pages (expandable via seo-pages.json):
- `/heic-to-jpg/`, `/heic-to-png/`
- `/webp-to-jpg/`, `/webp-to-png/`
- `/avif-to-jpg/`, `/avif-to-png/`
- `/tiff-to-jpg/`, `/tiff-to-png/`
- `/png-to-jpg/`

**Given** I visit `/heic-to-jpg/`
**When** the page loads
**Then** title is "HEIC to JPG Converter — Free, Private, Instant"
**And** H1 matches the URL intent
**And** output format is pre-set to JPEG (no toggle needed)

**Given** any SEO landing page
**When** I view the HTML source
**Then** all content is in raw HTML (not JS-rendered)
**And** page is fully crawlable without JavaScript

---

### Story 3.3: URL-Based Output Format

As a **user on a landing page**,
I want **the output format determined by the URL**,
So that **I don't have to configure anything**.

**Acceptance Criteria:**

**Given** I am on `/heic-to-jpg/`
**When** I convert a file
**Then** output is JPEG (no toggle visible)

**Given** I am on `/heic-to-png/`
**When** I convert a file
**Then** output is PNG

**Given** the converter component
**When** it initializes
**Then** it reads `data-output` attribute from the page
**And** uses that as the output format

---

### Story 3.4: Cross-Links Between Formats

As a **user**,
I want **to easily switch to an alternative output format**,
So that **I can get PNG if I wanted JPG or vice versa**.

**Acceptance Criteria:**

**Given** I am on `/heic-to-jpg/`
**When** I look below the file selector
**Then** I see: "Need PNG instead? Convert to PNG →"
**And** the link goes to `/heic-to-png/`

**Given** cross-links
**When** I inspect the styling
**Then** they use secondary text color (`--gray-500`)
**And** they are subtle, not prominent

**Given** cross-link data
**When** I check seo-pages.json
**Then** each page has a `crossLink` object with `text` and `href`

---

### Story 3.5: FAQ Content & Schema Markup

As a **user (and Google)**,
I want **relevant FAQ content with schema markup**,
So that **I get answers and the page ranks well**.

**Acceptance Criteria:**

**Given** any SEO landing page
**When** I scroll below the fold
**Then** I see 3-5 FAQs relevant to the format (e.g., "What is HEIC?")

**Given** FAQs on the page
**When** I interact with them
**Then** first 2 are expanded by default
**And** others are collapsed with chevron indicator
**And** click expands/collapses with 250ms transition

**Given** the page source
**When** I inspect the `<head>`
**Then** I see FAQ schema markup (JSON-LD)
**And** schema passes Google Rich Results Test

---

### Story 3.6: Home Page with Output Toggle

As a **user on the home page**,
I want **to choose between JPEG and PNG output**,
So that **I can convert any format to my preferred output**.

**Acceptance Criteria:**

**Given** I visit `/` (home page)
**When** the page loads
**Then** I see a JPEG/PNG toggle near the file selector
**And** default is JPEG

**Given** I toggle to PNG
**When** I convert a file
**Then** output is PNG regardless of input format

**Given** the home page
**When** I view the H1
**Then** it says "Free Image Converter" or similar (not format-specific)
**And** SoftwareApplication schema is present

**Given** the toggle component
**When** I inspect accessibility
**Then** it is keyboard accessible
**And** current selection is announced to screen readers

---

## Epic 4: Trust & Transparency

A user can verify the privacy claims and understand how the product works.

### Story 4.1: About Page

As a **user**,
I want **to know who built this tool**,
So that **I can decide if I trust it**.

**Acceptance Criteria:**

**Given** I visit `/about/`
**When** the page loads
**Then** I see brief, professional content (3 paragraphs max)
**And** it explains who built it and why

**Given** the about page
**When** I view the layout
**Then** it uses the same template/partial system as other pages
**And** navigation and footer are consistent

---

### Story 4.2: Privacy Page

As a **user**,
I want **a clear privacy policy**,
So that **I understand exactly what data is (and isn't) collected**.

**Acceptance Criteria:**

**Given** I visit `/privacy/`
**When** I read the content
**Then** it is short and in plain English
**And** key message: "We don't collect your files because we never receive them."

**Given** the privacy policy
**When** I look for data collection info
**Then** it clearly states:
- No file data transmitted
- Only GA4 analytics (page views, events)
- No cookies except analytics
- No user accounts or PII

---

### Story 4.3: How It Works Page

As a **privacy-conscious user**,
I want **technical explanation of client-side processing**,
So that **I can verify the privacy claims**.

**Acceptance Criteria:**

**Given** I visit `/how-it-works/`
**When** I read the content
**Then** I see a technical explanation of:
- WebAssembly codecs running in browser
- Canvas API for encoding
- Blob URLs for download
- Why nothing is uploaded

**Given** the how-it-works page
**When** I view the structure
**Then** it includes a simple diagram or flow visualization
**And** HowTo schema markup is present

**Given** a skeptical user (Priya persona)
**When** she reads this page
**Then** she understands how to verify via DevTools Network tab
**And** the explanation matches what she observes

---

## Epic 5: Analytics, Ads & Accessibility

Business can track conversions and monetize; all users can access the converter regardless of ability.

### Story 5.1: GA4 Event Tracking

As a **product owner**,
I want **conversion events tracked in GA4**,
So that **I can measure success and debug issues**.

**Acceptance Criteria:**

**Given** GA4 is configured
**When** a user drops/selects files
**Then** `file_selected` event fires with: count, formats[]

**Given** conversion starts
**When** processing begins
**Then** `conversion_started` event fires with: count, output_format

**Given** conversion completes successfully
**When** download triggers
**Then** `conversion_completed` event fires with: count, duration_ms, output_format
**And** `download_triggered` event fires with: type (single/zip/sequential), count

**Given** conversion fails
**When** error occurs
**Then** `conversion_error` event fires with: error_type, input_format, browser, platform

**Given** the analytics module
**When** I inspect event parameters
**Then** all use snake_case (GA4 convention)
**And** no PII is included (no filenames, no user agent strings)

---

### Story 5.2: AdSense Integration

As a **product owner**,
I want **AdSense ads integrated without hurting UX**,
So that **the product generates revenue sustainably**.

**Acceptance Criteria:**

**Given** any page with ads
**When** the page loads
**Then** ad containers have reserved height
**And** CLS remains < 0.1 (no layout shift when ads load)

**Given** desktop layout (>= 1024px)
**When** I view the page
**Then** sidebar ad is visible (300x250 or 300x600)
**And** ads are outside the converter component

**Given** mobile layout (< 1024px)
**When** I view the page
**Then** ads appear below fold only
**And** file selector dominates above-fold viewport

**Given** AdSense fails to load (blocked, error)
**When** the page renders
**Then** placeholder shows subtle `--gray-50` background
**And** site functions normally

**Given** the critical path (select → convert → download)
**When** user is in this flow
**Then** NO ads appear between action and result
**And** NO interstitial ads ever

---

### Story 5.3: Accessibility Verification

As a **user with disabilities**,
I want **the converter to be fully accessible**,
So that **I can use it regardless of my abilities**.

**Acceptance Criteria:**

**Given** any interactive element
**When** I navigate via keyboard
**Then** I can reach and activate it (Tab, Enter, Space)
**And** focus order is logical

**Given** focus is on an element
**When** I look at the screen
**Then** focus indicator is clearly visible
**And** it is not suppressed by CSS

**Given** the file selector and controls
**When** I use a screen reader
**Then** ARIA labels communicate purpose
**And** state changes are announced

**Given** color is used for meaning (success=green, error=red)
**When** I view the UI
**Then** text/icons also communicate the meaning
**And** color contrast is >= 4.5:1

**Given** I have `prefers-reduced-motion` enabled
**When** state transitions occur
**Then** animations are disabled or minimal
**And** functionality is preserved

**Given** I run Lighthouse accessibility audit
**When** audit completes
**Then** score is >= 90

---

### Story 5.4: Cross-Browser Testing

As a **developer**,
I want **verified cross-browser compatibility**,
So that **users on all supported browsers have a good experience**.

**Acceptance Criteria:**

**Given** the test suite
**When** I run E2E tests
**Then** they pass on: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+

**Given** Playwright configuration
**When** tests run in CI
**Then** they run against multiple browser engines
**And** mobile viewports are tested (iOS Safari, Android Chrome)

**Given** a user on an unsupported browser
**When** they visit the site
**Then** they see clear error message
**And** the page doesn't crash or show blank screen

**Given** test results
**When** I review the output
**Then** coverage includes: single file, batch, WASM formats, errors
**And** all critical paths are verified
