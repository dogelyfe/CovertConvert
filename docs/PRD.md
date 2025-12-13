---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - docs/plans/2025-12-11-covertconvert-design.md
  - docs/PRD.md
  - docs/plans/MVP-IMPLEMENTATION-PLAN.md
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 2
workflowType: 'prd'
lastStep: 11
project_name: 'CovertConvert'
user_name: 'Andrew'
date: '2025-12-11'
---

# Product Requirements Document - CovertConvert

**Author:** Andrew
**Date:** 2025-12-11

## Executive Summary

CovertConvert is a free image converter that works entirely in your browser. Unlike traditional converters that upload files to remote servers, CovertConvert processes images locally — your files never leave your device, ever.

**The Problem:** Millions of users encounter image format compatibility issues daily. iPhone photos (HEIC) won't open on Windows. Website images (WebP) can't be edited in older software. Photos won't upload to social media due to format restrictions. Existing solutions require uploading to third-party servers — creating privacy concerns, upload wait times, and artificial usage limits designed to push paid tiers.

**The Solution:** A client-side converter that's:
- **Faster** — No upload/download wait; conversion is instant
- **Unlimited** — No server costs means no reason to gate usage
- **Private** — Your photos stay on your computer; we never see them

**Why This Works (Business Model):**
- Revenue: Google AdSense display advertising
- Costs: ~$7/year (domain) + $0 hosting (Cloudflare Pages free tier)
- Break-even: ~500 monthly visitors at typical CPMs
- Path to $1K MRR: ~50K monthly organic visitors (achievable at 6-12 months with SEO traction)

**Competitive Moat:**
1. **SEO-first architecture** — Programmatic landing pages for every format combination, optimized for long-tail keywords competitors ignore
2. **Verifiable trust** — "Check the network tab" creates word-of-mouth in privacy communities
3. **Cost structure** — Near-zero marginal costs allow genuinely unlimited free tier; competitors can't match without losing money

### What Makes This Special

Your photos stay on your computer. We never see them. Ever.

This isn't a privacy policy promise — it's how the technology works. There's no upload button because there's nothing to upload to. When you convert a file, your own device does the work.

**For most users:** It's just faster. No waiting for uploads. Drop, convert, done.

**For privacy-conscious users:** It's the only converter you can actually verify. Open developer tools, watch the network tab — nothing leaves.

**For professionals:** It works in environments where other converters are blocked. Compliance-restricted industries (legal, healthcare, finance) can use this without IT approval.

### Technical Approach & Limitations

**Architecture:** Static HTML/JS with WebAssembly codecs (libheif for HEIC, Squoosh for AVIF) loaded on-demand. Canvas API for encoding. JSZip for batch downloads.

**Known Limitations:**
- Very large images (50+ megapixels) may strain mobile browser memory
- Some corporate proxies block .wasm files — graceful error messaging planned
- Batch conversion of 30+ files may slow older devices (soft warning implemented)

**Fallback Strategy:** If WASM fails to load, display clear error with alternative suggestions rather than silent failure.

### Key Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SEO takes 6-12 months to gain traction | High | Low burn rate allows patience; content marketing accelerates |
| Browser compatibility edge cases | Medium | Cross-browser testing matrix; graceful degradation |
| Competitor copies approach | Medium | First-mover SEO advantage; brand trust in privacy community |
| AdSense policy issues | Low | Strict compliance; backup ad networks identified |

### Validation Approach

- Cross-browser testing: Chrome, Firefox, Safari, Edge (desktop + mobile)
- Format testing: Sample files from iPhone 12-16, various cameras, web sources
- Memory testing: Large file handling on constrained devices
- User testing: Non-technical users (the "Maria test") before launch

## Project Classification

**Technical Type:** Web Application (SPA/PWA)
**Domain:** General (Consumer Utility)
**Complexity:** Low
**Project Context:** Greenfield — new build

This classification indicates standard web development practices apply, with SEO and user experience as primary concerns rather than regulatory compliance.

## Success Criteria

### User Success

**Primary Metric:** Conversion completion — a user successfully converts and downloads at least one file.

**Target Experience:** "Problem solved in <10 seconds" from file drop to download.

**Success Indicators:**
- User drops file(s) and receives converted output without confusion
- No waiting for uploads or processing spinners beyond 2-3 seconds for typical files
- Clear feedback at every step (file detected → converting → done → download)
- Zero account creation, email capture, or friction barriers

**Confused User Success:** User with unknown format (doesn't know what HEIC means) successfully converts without needing to understand file formats. They came to "fix a broken photo" — they leave with a working photo.

**Emotional Success:** Relief ("finally, something that just works") and trust ("I can verify nothing left my device").

### Business Success

**Primary Metric:** Ad revenue sustainability.

**Kill Metric:** Less than $200/month ad revenue after 12 months of consistent organic traffic growth. This threshold covers infrastructure costs ($7 domain + monitoring tools) with margin, proving the model works at small scale.

**Secondary Metrics:**
- Conversion attempts (total files dropped)
- Conversion completions (successful downloads)
- Completion rate (completions ÷ attempts, target >95%)

High attempts with low completions = UX problem. Low attempts with high completions = traffic/SEO problem.

**Milestones:**
| Timeframe | Traffic Target | Revenue Gate | Unlocks |
|-----------|---------------|--------------|---------|
| Month 3 | 5K monthly visitors | — | Validation |
| Month 6 | 15K monthly visitors | $50+ MRR | Blog content begins |
| Month 9 | 25K monthly visitors | $150+ MRR | Quality slider feature |
| Month 12 | 50K monthly visitors | $200+ MRR | Sustainability proven |
| Month 18 | 100K monthly visitors | $500+ MRR | International versions |

### Technical Success

**Device Coverage:**
- Mobile: iPhone 12+ / iOS 14+ (covers >95% of active iPhone users)
- Desktop: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+

**Performance Targets:**
- Initial page load: <1s LCP
- Time to interactive: <2s
- WASM codec load: <500ms (lazy, after first relevant file)
- End-to-end conversion: <10 seconds total (includes codec load + processing + download trigger)
- Typical photo processing: <3s for files under 10MB

**Reliability:**
- Failure rate budget: <2% of conversion attempts should fail
- Graceful degradation when WASM blocked (clear error message, not silent failure)
- Memory management prevents browser crashes on batch processing
- Works offline after initial load

**Failure Path Testing:** Smoke test must verify WASM-blocked fallback message renders correctly. Don't just measure success paths.

### Measurable Outcomes

| Metric | Target | Measurement |
|--------|--------|-------------|
| Conversion attempts | Track all | GA4 event: file_dropped |
| Conversion completions | Track all | GA4 event: file_downloaded |
| Completion rate | >95% | completions ÷ attempts |
| Failure rate | <2% | errors ÷ attempts |
| Time to first download | <10 seconds | Performance monitoring |
| Return visitor rate | >15% | GA4 |
| Core Web Vitals | All green | PageSpeed Insights |
| Keyword rankings (top 10) | 10+ keywords | Search Console |

## Product Scope

### MVP - Minimum Viable Product

**Must ship for launch:**
- Format-specific SEO landing pages (output determined by URL, no toggle)
  - Each page has fixed output format matching URL intent
  - Cross-link to alternative format: "Need PNG instead? → Convert to PNG"
- Universal converter on home page (`/`) with JPEG/PNG toggle for unknown intent
- HEIC, WebP, PNG, AVIF, TIFF, BMP, GIF input support
- Single file direct download
- Batch files → ZIP download
- 9 SEO landing pages (heic-to-jpg, heic-to-png, webp-to-jpg, etc.)
- /about, /privacy, /how-it-works trust pages
- Mobile-responsive design
- Google Analytics 4 with conversion events (attempts + completions)
- Google AdSense integration
- WASM failure fallback with user-friendly error message
- Browser compatibility: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+
- JPEG quality slider (user-controlled compression)

### Growth Features (Traffic-Gated)

| Feature | Traffic Gate | Rationale |
|---------|-------------|-----------|
| Blog content (weekly posts) | 15K monthly | SEO multiplier when base traffic exists |
| ~~JPEG quality slider~~ | ~~25K monthly~~ | *Promoted to MVP* |
| PWA / "Add to Home Screen" | 25K monthly | Return visitor optimization |
| International (Spanish) | 50K monthly | Proven model before localization cost |
| International (German, Portuguese) | 100K monthly | Scaling proven model |

### Vision (Future)

**If product-market fit proven ($500+ MRR sustained):**
- RAW format support (CR2, NEF, ARW)
- Video format conversion (MOV → MP4)
- Ethical ad network switch (Carbon Ads)
- API for developers
- White-label/embed licensing

## User Journeys

### Journey 1: Maria Santos — "Why Won't My Photo Open?"

Maria is a 34-year-old real estate agent who just took listing photos on her iPhone 15. She emails them to herself to add to a property listing on her Windows laptop. Double-click. Nothing happens. "The file format is not supported." She Googles "iPhone photo won't open Windows" and lands on `/iphone-photo-to-jpg`.

She sees a big drop zone and the words "Your files never leave your device" — she doesn't fully understand what that means, but it sounds safe. She drags her photo. Three seconds later, a JPG downloads automatically. She opens it. It works. "Finally."

She converts the remaining 12 listing photos, gets a ZIP file, and uploads them to her listing within 5 minutes of hitting the problem. She bookmarks the site. Two weeks later, when a colleague mentions the same issue, Maria texts: "Use this site, it just works."

**Journey reveals requirements for:**
- Clear, jargon-free messaging ("iPhone photo" not "HEIC")
- Prominent drop zone above the fold
- Auto-download for single files
- ZIP for batch
- Fast enough that Maria doesn't second-guess

---

### Journey 2: Derek Chen — Batch Power User

Derek is a 28-year-old photographer's assistant who needs to convert 47 WebP images from a website mockup back to JPG for a client who "can't open these weird files." He's done this before with other tools — the upload takes forever, there's a file limit, and then they want $9.99 for batch.

He finds CovertConvert, notes there's no upload bar filling up, and drops all 47 files at once. A progress indicator shows "Converting 23 of 47..." — no spinning beach ball, no browser freeze. Forty seconds later: ZIP downloaded. He spot-checks three files. Perfect.

He notices the "Your files never leave your device" tagline and opens DevTools out of curiosity. Network tab is empty except for the initial page load. "Huh, they actually mean it." He bookmarks it and shares it in his photography Discord.

**Journey reveals requirements for:**
- Batch processing with clear progress feedback
- No artificial file limits
- ZIP output with sensible filename
- Performance that handles 50+ files without browser freeze
- Memory management (sequential processing)

---

### Journey 3: Priya Sharma — The Privacy Verifier

Priya is a 41-year-old security consultant who needs to convert some personal medical images from HEIC before uploading to a patient portal. She's professionally paranoid — she's seen too many "free tools" that harvest data.

She lands on CovertConvert and immediately scrolls to find the privacy policy. It's short: "We don't collect your files because we never receive them." Skeptical, she clicks "How it works" and reads about client-side WebAssembly processing.

Before converting anything real, she opens DevTools, switches to Network tab, and drops a test image. She watches. Page load resources only — no POST requests, no outbound data. She filters by "fetch" and "xhr" — nothing. She converts. The file downloads. Still nothing sent.

"Okay, I believe you." She converts her actual files, satisfied that she verified the claim herself rather than trusting marketing copy.

**Journey reveals requirements for:**
- Transparent technical explanation (/how-it-works)
- Verifiable architecture (nothing to hide in network tab)
- Trust signals that invite verification, not just claim privacy
- Short, honest privacy policy

---

### Journey 4: James Morrison — Compliance-Locked Professional

James is a 52-year-old partner at a law firm. A client sent case evidence as HEIC files from their iPhone. James needs them as JPGs for the case file system, but firm policy prohibits uploading client documents to third-party services — and IT has blocked most converter sites at the firewall anyway.

His paralegal finds CovertConvert and notes it's not blocked (it's just a static site, not a known "upload service"). James is skeptical until the paralegal explains: "It doesn't upload anything. The conversion happens in your browser. IT can't block what doesn't leave."

James tries it on a non-sensitive test file first. It works. He has the paralegal convert the case files. No compliance forms, no IT tickets, no vendor approval process. Problem solved in 10 minutes instead of 2 days.

He mentions it to the managing partner, who forwards it to the entire litigation team. CovertConvert becomes the unofficial "how we handle iPhone photos" tool at Morrison & Associates.

**Journey reveals requirements for:**
- Works without special network permissions (static hosting)
- No login, no account, no audit trail to manage
- Professional enough aesthetic that it doesn't look like malware
- Word-of-mouth in professional networks = organic growth

---

### Journey 5: Error Recovery — Unsupported Format

Alex is a 25-year-old content creator who downloads an image from a design tool. The file is .PSD (Photoshop native). They drag it onto CovertConvert expecting magic.

The drop zone accepts the file, attempts detection, and displays: "Sorry, .PSD files aren't supported yet. CovertConvert works with HEIC, WebP, AVIF, TIFF, PNG, BMP, and GIF. For PSD files, try opening in Photoshop or GIMP and exporting as PNG."

Alex isn't thrilled, but they're not confused. They know exactly what happened and what to do next. They make a mental note: "This site is for photo formats, not design files."

A week later, Alex has actual HEIC files from their iPhone. They remember CovertConvert, return, and successfully convert. The clear error message built trust rather than destroying it.

**Journey reveals requirements for:**
- Clear, specific error messages (not "conversion failed")
- List of supported formats in error context
- Suggest alternatives when possible
- Don't accept files silently and then fail — fail fast with explanation
- Error recovery builds trust for future visits

---

### Journey Requirements Summary

| Capability Area | Revealed By Journey |
|-----------------|---------------------|
| Jargon-free UX copy | Maria |
| Single-file auto-download | Maria |
| Batch ZIP download | Maria, Derek |
| Progress feedback | Derek |
| 50+ file handling | Derek |
| /how-it-works transparency page | Priya |
| Network-verifiable architecture | Priya |
| Static hosting (firewall-friendly) | James |
| No-login, no-account flow | James, all |
| Clear error messages with alternatives | Alex |
| Supported format list in error context | Alex |
| Professional visual design | James |
| Bookmarkable/shareable | Maria, Derek |

## Web Application Specific Requirements

### Architecture Overview

**Type:** Multi-Page Application (MPA) with SPA-like interactions
- Separate static HTML pages for each SEO landing page
- Embedded converter component with client-side interactivity
- No server-side rendering required (pure static hosting)
- WebAssembly codecs loaded on-demand per page

**Rationale:** MPA structure maximizes SEO (each page is independently crawlable) while SPA-like converter UX keeps interactions smooth within each page.

### Browser Support Matrix

| Browser | Minimum Version | Required Features |
|---------|----------------|-------------------|
| Chrome | 88+ | WASM, Canvas API, File API, Blob URLs |
| Firefox | 78+ | WASM, Canvas API, File API, Blob URLs |
| Safari | 14+ | WASM, Canvas API, File API, Blob URLs |
| Edge | 88+ | WASM, Canvas API, File API, Blob URLs |
| Chrome Mobile | 88+ | Same as desktop |
| Safari iOS | 14+ | Same as desktop |

**Not Supported:** IE11 (no WASM), older mobile browsers. Graceful error message for unsupported browsers.

### Responsive Design Breakpoints

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Mobile | < 640px | Single column, full-width drop zone, stacked elements |
| Tablet | 640px - 1024px | Flexible layout, drop zone prominent |
| Desktop | > 1024px | Two-column optional (content + sidebar for ads) |

**Mobile-First Approach:**
- Touch-friendly drop zone (minimum 48px tap targets)
- "Tap to select files" messaging on touch devices
- No hover-dependent interactions
- Thumb-reachable primary actions

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Largest Contentful Paint (LCP) | < 1.0s | PageSpeed Insights |
| First Input Delay (FID) | < 100ms | PageSpeed Insights |
| Cumulative Layout Shift (CLS) | < 0.1 | PageSpeed Insights |
| Time to Interactive (TTI) | < 2.0s | Lighthouse |
| WASM Codec Load | < 500ms | Performance API |
| Total Page Weight | < 100KB initial | Network tab (excludes lazy WASM) |

**Performance Strategy:**
- Static HTML served from Cloudflare CDN edge
- Tailwind CSS via CDN (cached globally)
- WASM codecs lazy-loaded only when needed
- No JavaScript framework overhead
- Images optimized and lazy-loaded below fold

### SEO Implementation

**Technical SEO:**
- Self-referencing canonical URLs on all pages
- XML sitemap submitted to Google Search Console
- robots.txt allowing all crawlers
- Structured data: FAQ schema, HowTo schema, SoftwareApplication schema
- All content in raw HTML (not JS-rendered)
- Internal linking between converter pages

**Page Structure:**
- Unique `<title>` per landing page (keyword-optimized)
- Unique `<meta description>` per page
- Single H1 per page matching user intent
- Semantic heading hierarchy (H1 → H2 → H3)
- FAQ sections with schema markup

**Content Strategy:**
- 9 SEO landing pages at launch
- Content clusters around HEIC, WebP, iPhone photos
- Blog content unlocked at 15K monthly visitors
- Long-tail keyword targeting

### Programmatic SEO Architecture

**Page Generation Strategy:**
```
/src
  /templates
    converter-page.html    ← Single shared template
  /data
    pages.json             ← All page variations (title, desc, FAQ, output format)
/scripts
  generate-pages.js        ← Build-time generation script
/dist
  /heic-to-jpg/index.html  ← Generated output
  /heic-to-png/index.html  ← Generated output
  ...
```

**Maintenance Model:**
- **Template + Data + Build Script** — not a CMS
- Change template → regenerate all pages → deploy
- Adding new pages = add entry to `pages.json`, run build
- No runtime page generation; all pages are static HTML

**Publishing Strategy:**
- Batch publish all pages at launch (no SEO penalty per Google)
- Add new format pages as demand identified via Search Console
- No artificial trickling needed — quality matters, not velocity

**Ongoing Maintenance:**

| Task | Frequency | Effort |
|------|-----------|--------|
| Template updates (design refresh) | Rare | Medium |
| Content data updates (new formats) | Occasional | Low |
| Stale page audit | Quarterly | Low |
| 404/indexing checks via Search Console | Monthly | Low |
| Broken link check | Monthly | Low |

**Quality Assurance:**
- After any template change, spot-check 3-5 generated pages
- Validate schema markup with Google Rich Results Test
- Check all pages render without JS (view-source test)

### Accessibility (WCAG 2.1 AA)

**Target:** WCAG 2.1 Level AA compliance

**Implementation Checklist:**
- [ ] Keyboard navigation for all interactive elements
- [ ] Visible focus indicators (not removed by CSS)
- [ ] Alt text on all images and icons
- [ ] ARIA labels on drop zone and buttons
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] No content relies solely on color to convey meaning
- [ ] Skip-to-content link for keyboard users
- [ ] Reduced motion support (`prefers-reduced-motion`)

**Testing:**
- Lighthouse accessibility audit (target 90+)
- Manual keyboard navigation test
- Screen reader spot-check (VoiceOver, NVDA)

## Project Scoping & Phased Development

### Resource Model

**Team:** Solo developer
**Skills Required:** HTML/CSS/JS, WebAssembly integration, SEO fundamentals, Cloudflare Pages deployment

**Implication:** All features must be implementable and maintainable by one person. Complexity is the enemy. Scope ruthlessly.

### MVP Strategy

**Approach:** Problem-Solving MVP
- Solve the core problem (image format conversion) reliably
- Privacy positioning as differentiator, not feature bloat
- Launch fast, iterate based on Search Console and analytics data

**MVP Validation Goal:** Prove organic traffic can be acquired for image conversion keywords with a client-side tool.

### Explicit Cut List (Out of Scope for MVP)

**Deliberately NOT building:**
- ❌ User accounts or authentication
- ❌ Server-side processing of any kind
- ❌ Video format conversion
- ❌ RAW format support (CR2, NEF, ARW)
- ❌ Image resizing or cropping
- ❌ Image editing features
- ❌ Watermarking
- ❌ Cloud storage integration
- ❌ API for developers
- ❌ PWA/offline mode
- ❌ Internationalization (non-English)
- ❌ Blog content
- ❌ Email capture or newsletter
- ❌ Comments or user feedback forms

**Rationale:** Every feature not built is maintenance not required. Solo operator = maximum simplicity.

### Risk Mitigation

| Risk | Response |
|------|----------|
| WASM blocked by corporate proxy | Graceful error message with explanation; no fallback codec exists |
| libheif-js fails on edge-case HEIC | Log error, show user-friendly message, suggest trying different file |
| SEO takes longer than 12 months | Low burn rate ($7/year) allows patience; pivot to paid acquisition if needed |
| Browser compatibility issue discovered | Document in known issues; fix if affecting >5% of users |
| AdSense rejection | Apply to backup networks (Carbon Ads, EthicalAds); site works without ads |

### Post-MVP Feature Tiers

**S-TIER — High Value, Low Effort (First post-MVP sprint)**
| Feature | Effort | Rationale |
|---------|--------|-----------|
| Blog content | Ongoing (no code) | Pure SEO multiplier, can outsource writing |
| Additional landing pages | 10 min each | Template exists, just add JSON entries |

**A-TIER — High Value, Medium Effort (After 15K monthly visitors)**
| Feature | Effort | Rationale |
|---------|--------|-----------|
| PWA / Add to Home Screen | 2-4 hours | Service worker + manifest, improves return visits |
| RAW format support (CR2/NEF) | 1-2 days | New codec, same integration pattern |
| Spanish translation | 1-2 days | Biggest non-English market, content not code |

**B-TIER — Medium Value, Medium Effort (After 50K monthly visitors)**
| Feature | Effort | Rationale |
|---------|--------|-----------|
| German/Portuguese i18n | 1-2 days each | Smaller markets than Spanish |
| Image resizing | 4-8 hours | Canvas API makes it easy, but scope creep risk |
| Video conversion (MOV→MP4) | 1-2 weeks | High search volume, significant codec complexity |

**C-TIER — Low Value or High Effort (Probably Never)**
| Feature | Rationale |
|---------|-----------|
| User accounts | Zero value for this use case, massive maintenance |
| Cloud storage integration | Violates privacy positioning |
| API for developers | Different product, different audience |
| Image editing/cropping | Scope creep into different product category |
| Watermarking | Niche need, adds complexity |

**FUTURE EXPLORATION — Requires Research**
| Feature | Notes | Spec |
|---------|-------|------|
| Background Removal / Sticker Creator | Client-side ML (WASM), privacy-preserving alternative to remove.bg. Natural extension of privacy-first positioning. Significant complexity. | `docs/backlog/background-removal.md` |

### Phase Summary

| Phase | Trigger | Features |
|-------|---------|----------|
| **MVP** | Launch | Core converter, 9 SEO pages, trust pages, JPEG quality slider, GA4, AdSense |
| **Growth** | 15K-50K monthly visitors | Blog, PWA, Spanish i18n |
| **Expansion** | 50K-100K monthly visitors | RAW support, German/Portuguese |
| **Vision** | $500+ MRR sustained | Video, API, white-label |

## Functional Requirements

### File Input & Detection

- FR1: Users can drop image files onto the converter drop zone
- FR2: Users can click to browse and select image files
- FR3: Users can select multiple files at once for batch processing
- FR4: System can detect input file format from file signature and extension
- FR5: System can validate whether a file format is supported
- FR6: System can display clear error for unsupported formats with list of supported types

### Image Conversion

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

### Output & Download

- FR18: Users can download a single converted file directly
- FR19: Users can download multiple converted files as a ZIP archive
- FR20: System can auto-trigger download for single file conversions
- FR21: System can generate meaningful output filenames (original name + new extension)

### Progress & Feedback

- FR22: Users can see conversion progress indicator during processing
- FR23: Users can see "Converting X of Y" status for batch operations
- FR24: Users can see success confirmation when conversion completes
- FR25: Users can see per-file error messages when individual conversions fail
- FR26: Users can see graceful error message when WASM codec fails to load
- FR27: System can continue batch processing when individual files fail

### Warnings & Guidance

- FR28: System can display soft warning when batch exceeds 30 files
- FR29: System can display soft warning for individual files exceeding 25MB
- FR30: Users can dismiss warnings and proceed with conversion anyway

### Conversion Reset

- FR31: Users can clear completed conversions to start a fresh session
- FR32: Drop zone can accept new files after previous conversion completes

### SEO Landing Pages

- FR33: Users can access format-specific landing pages via direct URL (e.g., /heic-to-jpg)
- FR34: Users can navigate to alternative output format via cross-link on each page
- FR35: Each landing page can display unique title, description, and H1 matching URL intent
- FR36: Each landing page can display format-specific FAQ content
- FR37: System can serve pages with proper schema markup (FAQ, HowTo, SoftwareApplication)

### Landing Page Behavior

- FR38: System can determine output format based on landing page URL path (e.g., /heic-to-jpg outputs JPEG, /heic-to-png outputs PNG)

### Trust & Transparency Pages

- FR39: Users can access /about page with product information
- FR40: Users can access /privacy page with privacy policy
- FR41: Users can access /how-it-works page with technical explanation
- FR42: Users can verify no network requests occur during conversion (architecture supports this)

### Universal Converter (Home Page)

- FR43: Users can access universal converter at root URL (/)
- FR44: Users can toggle between JPEG and PNG output on home page
- FR45: Home page can accept any supported input format

### Analytics Integration

- FR46: System can track file_dropped events to GA4
- FR47: System can track file_downloaded events to GA4
- FR48: System can track conversion_error events to GA4 with error type

### Accessibility

- FR49: Users can navigate all interactive elements via keyboard
- FR50: Users can perceive focus indicators on interactive elements
- FR51: Screen reader users can understand drop zone purpose via ARIA labels
- FR52: Users can disable animations via reduced motion preference

## Non-Functional Requirements

### Performance

**Core Web Vitals (SEO-critical):**
| Metric | Target | Measurement |
|--------|--------|-------------|
| Largest Contentful Paint (LCP) | < 1.0s | PageSpeed Insights |
| First Input Delay (FID) | < 100ms | PageSpeed Insights |
| Cumulative Layout Shift (CLS) | < 0.1 | PageSpeed Insights |
| Time to Interactive (TTI) | < 2.0s | Lighthouse |

**Conversion Performance:**
| Metric | Target | Context |
|--------|--------|---------|
| End-to-end conversion | < 10 seconds | User success metric |
| Typical photo (<10MB) | < 3 seconds | Processing time |
| WASM codec lazy load | < 500ms | On first relevant file |
| Initial page weight | < 100KB | Excludes lazy-loaded WASM |

**Batch Processing:**
- NFR-P1: Sequential processing to prevent browser memory exhaustion
- NFR-P2: No browser freeze or crash on 50+ file batches (desktop)
- NFR-P3: Progress feedback updates at least every 2 seconds during batch
- NFR-P4: Graceful handling of browser memory pressure (warn user or reduce batch rather than crash)

### Security & Privacy

**Data Handling:**
- NFR-S1: Zero file data transmitted to any server (verifiable via network inspector)
- NFR-S2: No cookies set except for analytics (GA4)
- NFR-S3: No user accounts, no password storage, no PII collection
- NFR-S4: No third-party scripts except GA4 and AdSense

**Architecture Constraint:**
- All file processing occurs client-side via WebAssembly and Canvas API
- Privacy claims must be technically verifiable, not just stated

### Accessibility

**Target:** WCAG 2.1 Level AA

**Specific Requirements:**
- NFR-A1: Color contrast ratio ≥ 4.5:1 for all text
- NFR-A2: All interactive elements keyboard accessible
- NFR-A3: Focus indicators visible (not suppressed by CSS)
- NFR-A4: Touch targets minimum 48x48px on mobile
- NFR-A5: Screen reader compatibility (ARIA labels on custom controls)
- NFR-A6: Respects `prefers-reduced-motion` setting
- NFR-A7: No content relies solely on color to convey meaning
- NFR-A8: Error messages visible without scrolling on mobile viewport

**Testing Target:** Lighthouse accessibility score ≥ 90

### Browser Compatibility

**Supported Browsers:**
| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 88+ | Primary target |
| Firefox | 78+ | Full support |
| Safari | 14+ | iOS primary mobile target |
| Edge | 88+ | Chromium-based |

**Graceful Degradation:**
- Unsupported browsers receive clear error message
- No silent failures — always inform user why something doesn't work

### Reliability

**Availability:**
- NFR-R1: Cloudflare Pages provides CDN-level availability (99.9%+ SLA)
- NFR-R2: Site functions after initial load without network (offline-capable after WASM cached)

**Error Handling:**
- NFR-R3: Failure rate tracked via GA4; investigate and remediate if exceeds 2% in any rolling 7-day period
- NFR-R4: Individual file failures don't crash batch processing
- NFR-R5: Clear error messages with actionable guidance

### Integration

**Analytics (GA4):**
- NFR-I1: Track page_view, file_dropped, file_downloaded, conversion_error events
- No PII in event parameters

**Advertising (AdSense):**
- NFR-I2: Ad containers have reserved height to prevent layout shift (CLS) when ads load
- NFR-I3: Ad placements don't interfere with file selector interaction
- NFR-I4: Ads lazy-loaded to not impact LCP
- NFR-I5: Site functions normally if AdSense blocked or fails to load
- NFR-I6: No interstitial ads (pre-conversion or post-conversion)
- NFR-I7: No ads between user action and result (critical path protected)
- NFR-I8: Desktop: sidebar ads only (300x250 or 300x600)
- NFR-I9: Mobile: ads below fold only (320x100 or 300x250)
- NFR-I10: Ad containers use `--gray-50` placeholder background

**SEO (Schema.org):**
- NFR-I11: FAQ schema on all landing pages
- NFR-I12: HowTo schema on /how-it-works
- NFR-I13: SoftwareApplication schema on home page

### Maintainability

**Solo Developer Constraints:**
- NFR-M1: No build system more complex than a single Node script
- NFR-M2: No framework dependencies (vanilla HTML/CSS/JS)
- NFR-M3: Template changes propagate to all pages via rebuild
- NFR-M4: All code readable by a single developer without specialized knowledge
- NFR-M5: Dependencies limited to: WASM codecs, JSZip, Tailwind CSS (CDN)

