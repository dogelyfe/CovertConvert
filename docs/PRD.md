# Product Requirements Document: CovertConvert.app

**Version:** 1.0
**Date:** 2025-12-11
**Author:** [capturemotion]
**Status:** Draft

---

## Table of Contents

1. [Business Context](#1-business-context)
2. [Market Analysis](#2-market-analysis)
3. [Audience Definition](#3-audience-definition)
4. [Product Definition](#4-product-definition)
5. [Technical Requirements](#5-technical-requirements)
6. [SEO & Growth Strategy](#6-seo--growth-strategy)
7. [Monetization](#7-monetization)
8. [MVP Scope](#8-mvp-scope)
9. [Success Metrics](#9-success-metrics)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Implementation Roadmap](#11-implementation-roadmap)

---

## 1. Business Context

### 1.1 Problem Statement

Millions of users encounter image format compatibility issues daily:
- iPhone photos (HEIC) won't open on Windows/Android
- Website images (WebP) can't be edited in older software
- Photos won't upload to social platforms due to format restrictions

Current solutions require uploading files to third-party servers, creating privacy concerns and friction.

### 1.2 Opportunity

A client-side image converter eliminates the upload requirement entirely. This enables:
- **Genuine privacy** — files physically cannot be accessed by the service
- **Unlimited free usage** — no server compute costs to offset
- **Speed** — no upload/download wait times
- **Trust** — verifiable claims, not "trust us" policies

### 1.3 Vision

CovertConvert becomes the default recommendation for "how to convert HEIC to JPG" by being the only converter that provably never sees user files.

### 1.4 Business Model

- **Revenue:** Google AdSense display advertising
- **Cost structure:** Near-zero marginal cost (static hosting, no compute)
- **Moat:** SEO dominance + brand trust in privacy-conscious segment

---

## 2. Market Analysis

### 2.1 Market Size

**Search volume (monthly, US):**
| Query | Volume |
|-------|--------|
| heic to jpg | 500K-1M |
| webp to jpg | 200K+ |
| convert heic | 100K+ |
| png to jpg | 150K+ |
| iphone photo converter | 50K+ |

**Total addressable searches:** 1M+ monthly (US alone)
**Global potential:** 3-5x US volume

### 2.2 Competitive Landscape

| Competitor | Model | Weakness |
|------------|-------|----------|
| CloudConvert | Server-side, freemium | Privacy concerns, limits on free |
| Zamzar | Server-side, freemium | Slow, dated UX, email required |
| Convertio | Server-side, freemium | Ads everywhere, limits |
| ILoveIMG | Server-side, freemium | Privacy concerns |
| Squoosh | Client-side, Google | No SEO focus, limited formats |
| heictojpg.com | Server-side, free | Privacy concerns, single format |

### 2.3 Competitive Advantage

| CovertConvert | Competitors |
|---------------|-------------|
| Client-side (files never uploaded) | Server-side (files uploaded) |
| No signup | Often require email |
| Unlimited free | Artificial limits |
| Clean UX | Ad-heavy, popups |
| Fast (no upload wait) | Slow (upload + download) |
| Works offline after load | Requires constant internet |
| Verifiable privacy | "Trust us" privacy |

### 2.4 Market Trends

- iPhone market share growing (more HEIC files)
- WebP adoption increasing (more conversion needs)
- AVIF emerging (future conversion demand)
- Privacy awareness increasing post-GDPR
- "Local-first" software movement gaining traction

---

## 3. Audience Definition

### 3.1 Primary Personas

#### Persona 1: The Frustrated iPhone User
- **Demographics:** Any age, non-technical, iPhone owner
- **Situation:** Sent photo to Windows friend/colleague, they can't open it
- **Search behavior:** "iphone photo won't open", "convert iphone photo"
- **Needs:** Instant solution, no learning curve
- **Pain points:** Doesn't know what HEIC is, just wants it to work

#### Persona 2: The Privacy-Conscious Professional
- **Demographics:** 25-55, works in legal/healthcare/finance/tech
- **Situation:** Needs to convert files but can't upload sensitive documents
- **Search behavior:** "heic converter without uploading", "private image converter"
- **Needs:** Verifiable privacy, professional-grade reliability
- **Pain points:** Compliance requirements, data handling policies

#### Persona 3: The Tech-Savvy Privacy Advocate
- **Demographics:** 20-40, technical background, privacy-focused
- **Situation:** Actively avoids uploading files to random services
- **Search behavior:** "client-side converter", "offline heic converter"
- **Needs:** Transparency, verifiable claims, open source preferred
- **Pain points:** Most "free" tools are data harvesting operations

#### Persona 4: The Bulk Converter
- **Demographics:** Photographers, content creators, office workers
- **Situation:** Has 20-50 files to convert, doesn't want to do one at a time
- **Search behavior:** "bulk heic to jpg", "batch convert webp"
- **Needs:** Multiple file support, ZIP download
- **Pain points:** Most free tools limit batch size

### 3.2 User Journey

```
Awareness
    └── Searches "heic to jpg" or "iphone photo won't open"
    └── Sees CovertConvert in results
    └── Clicks (compelling title: "Free, No Upload")

Consideration
    └── Lands on page, sees clean UI
    └── Reads "files never leave your device"
    └── Notices no signup required

Conversion
    └── Drops file(s)
    └── Clicks convert
    └── Downloads result

Retention
    └── Bookmarks for next time
    └── Tells friends/colleagues
    └── Returns when needed

Advocacy
    └── Recommends in forums/social
    └── Links from blog/article
    └── Organic backlinks
```

---

## 4. Product Definition

### 4.1 Value Proposition

**One-liner:** "Convert images instantly. Your files never leave your device."

**Elevator pitch:** CovertConvert is a free image converter that works entirely in your browser. Unlike other converters, your files are never uploaded anywhere — conversion happens locally on your device. No signup, no limits, no privacy concerns.

### 4.2 Core Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| Drag-and-drop conversion | Drop files to convert | P0 |
| Format auto-detection | Automatically identify input format | P0 |
| JPEG output | Convert to JPEG | P0 |
| PNG output | Convert to PNG (toggle) | P0 |
| Multi-file support | Convert multiple files at once | P0 |
| ZIP download | Bundle multiple outputs | P0 |
| Progress indicator | Show conversion progress | P0 |
| Mobile support | Touch-friendly, responsive | P0 |
| Error handling | Clear messages for failures | P0 |

### 4.3 Supported Formats (MVP)

**Input formats:**
- HEIC / HEIF (Apple photos)
- WebP (web images)
- PNG
- AVIF
- TIFF / TIF
- BMP
- GIF (first frame)

**Output formats:**
- JPEG (default)
- PNG (toggle option)

### 4.4 User Interface

#### Home Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] CovertConvert          [About] [How It Works]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│     Convert Images Privately                            │
│     Your files never leave your device.                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │     [ Drop files here or click to browse ]       │  │
│  │                                                   │  │
│  │     Supports: HEIC, WebP, PNG, AVIF, TIFF, BMP   │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│     Output format: [JPEG ▼] / [PNG]                     │
│                                                         │
│                    [ Convert ]                          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  How to Convert:                                        │
│  1. Drop your files above                               │
│  2. Click Convert                                       │
│  3. Download instantly                                  │
│                                                         │
│  [FAQ Section]                                          │
│  [Privacy explanation]                                  │
├─────────────────────────────────────────────────────────┤
│  [Ad placement - sidebar or below fold]                 │
└─────────────────────────────────────────────────────────┘
```

#### Conversion States
```
Empty:        "Drop files here or click to browse"
Files added:  "[filename.heic] ✕" (removable list)
Converting:   "Converting... 3 of 5" + progress bar
Complete:     "Done! [Download] or [Download ZIP]"
Error:        "Couldn't convert [file]. [Try again]"
Warning:      "Converting 30+ files may slow your browser"
```

### 4.5 Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Initial page load | <1s LCP |
| Time to interactive | <2s |
| Conversion speed | <2s per typical photo |
| Mobile responsive | Full functionality on mobile |
| Offline capability | Works after initial load |
| Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Accessibility | WCAG 2.1 AA compliant |

---

## 5. Technical Requirements

### 5.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                      │
│                   (Static Hosting)                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   HTML      │  │   CSS       │  │   JS        │     │
│  │   Pages     │  │  (Tailwind) │  │  (Vanilla)  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              WASM Codecs (Lazy-loaded)           │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │libheif  │ │ UTIF.js │ │ Squoosh │           │   │
│  │  │ (HEIC)  │ │ (TIFF)  │ │ (AVIF)  │           │   │
│  │  └─────────┘ └─────────┘ └─────────┘           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              JSZip (Multi-file bundling)         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

User's Browser (all processing happens here):
┌─────────────────────────────────────────────────────────┐
│  FileReader API → Decode → Canvas API → Encode → Blob  │
│                         ↓                               │
│              Download (blob URL, no server)             │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Hosting | Cloudflare Pages | Unlimited bandwidth free, fastest CDN |
| HTML | Static HTML | Best SEO, no hydration |
| CSS | Tailwind (CDN) | Rapid styling, small footprint |
| JS | Vanilla ES6+ | No framework overhead |
| HEIC decode | libheif-js | Best HEIC support |
| TIFF decode | UTIF.js | Lightweight TIFF support |
| AVIF decode | Squoosh codec | Google's battle-tested codec |
| Image encode | Canvas API | Native, fast, universal |
| ZIP creation | JSZip | Client-side ZIP, well-maintained |

### 5.3 File Processing Flow

```javascript
// Pseudocode for core conversion logic

async function convertFile(file) {
  // 1. Detect format
  const format = detectFormat(file);

  // 2. Lazy-load codec if needed
  if (format === 'heic') await loadHeicCodec();
  if (format === 'avif') await loadAvifCodec();
  if (format === 'tiff') await loadTiffCodec();

  // 3. Decode to ImageData
  const imageData = await decode(file, format);

  // 4. Create canvas, draw image
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  // 5. Encode to output format
  const outputFormat = getSelectedFormat(); // 'image/jpeg' or 'image/png'
  const quality = outputFormat === 'image/jpeg' ? 0.92 : undefined;
  const blob = await canvasToBlob(canvas, outputFormat, quality);

  // 6. Cleanup
  canvas.width = 0;
  canvas.height = 0;

  return blob;
}

async function convertFiles(files) {
  const results = [];

  for (const file of files) {
    try {
      const blob = await convertFile(file);
      results.push({ name: file.name, blob, success: true });
    } catch (error) {
      results.push({ name: file.name, error, success: false });
    }

    // Memory cleanup between files
    await new Promise(r => setTimeout(r, 10));
  }

  return results;
}
```

### 5.4 Memory Management

| Concern | Mitigation |
|---------|------------|
| Large files | Sequential processing, not parallel |
| Memory leaks | Revoke blob URLs, nullify references |
| Browser limits | Soft warning at 30+ files |
| Tab crashes | User documentation on limits |

### 5.5 Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | Full |
| Firefox | 90+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| Mobile Chrome | Latest | Full |
| Mobile Safari | 14+ | Full |

### 5.6 Security Considerations

| Aspect | Implementation |
|--------|----------------|
| No server uploads | Architecturally impossible to leak files |
| HTTPS only | Enforced by .app TLD |
| No cookies (for conversion) | No tracking of file data |
| CSP headers | Prevent XSS |
| Subresource integrity | Verify CDN resources |

---

## 6. SEO & Growth Strategy

### 6.1 Keyword Strategy

See [Design Document](./plans/2025-12-11-covertconvert-design.md) for complete keyword research.

**Primary targets:**
- heic to jpg (500K+)
- webp to jpg (200K+)
- iphone photo to jpg (high intent)
- convert heic to jpg without uploading (differentiator)

### 6.2 Site Structure

```
/                           ← Universal converter (home)
/heic-to-jpg               ← HEIC landing page
/heic-to-png               ← HEIC to PNG
/webp-to-jpg               ← WebP landing page
/png-to-jpg                ← PNG landing page
/avif-to-jpg               ← AVIF landing page
/tiff-to-jpg               ← TIFF landing page
/iphone-photo-to-jpg       ← Non-technical users
/about                     ← Trust/credibility
/privacy                   ← Privacy policy
/how-it-works              ← Technical transparency
/blog/                     ← Content marketing hub
```

### 6.3 On-Page SEO

Each landing page includes:
- Unique `<title>` with target keyword
- Unique `<meta description>` with CTA
- H1 with target keyword
- 100-200 words of unique copy
- FAQ section (5-6 questions)
- Schema markup (FAQ, HowTo, SoftwareApplication)
- Internal links to related converters

### 6.4 Content Marketing

**Launch content:**
- All converter landing pages
- /about, /privacy, /how-it-works

**Month 1-3 blog posts:**
- What is HEIC?
- Is it safe to convert photos online?
- How to convert iPhone photos
- HEIC vs JPG comparison
- Why photos won't upload to Instagram
- WebP explained
- How to stop iPhone saving HEIC
- [Competitor] alternatives

### 6.5 Link Building

**Phase 1 (Launch):**
- Product Hunt
- Hacker News "Show HN"
- AlternativeTo, SaaSHub listings
- Reddit engagement (r/privacy, r/iphone)

**Phase 2 (Ongoing):**
- Guest posts on privacy/tech blogs
- HARO journalist responses
- Resource page outreach
- Original research content

### 6.6 Growth Channels

| Channel | Effort | Expected Impact |
|---------|--------|-----------------|
| Organic search | High (ongoing) | Primary driver |
| Product Hunt | Low (one-time) | Launch spike |
| Hacker News | Low | Lottery, high if hits |
| Reddit | Medium | Steady referral |
| Word of mouth | Low | Compounds over time |
| YouTube tutorials | Medium | Secondary traffic |

---

## 7. Monetization

### 7.1 Revenue Model

**Primary:** Google AdSense display advertising

**Placement:**
- Sidebar (desktop)
- Below converter (mobile)
- Between FAQ items (native feel)

**NOT placed:**
- Interrupting conversion flow
- Covering drop zone
- Pop-ups or interstitials

### 7.2 Revenue Projections

| Traffic | AdSense CPM | Monthly Revenue | Annual Revenue |
|---------|-------------|-----------------|----------------|
| 50K | $10 | $1,000 | $12,000 |
| 100K | $10 | $2,000 | $24,000 |
| 250K | $10 | $5,000 | $60,000 |
| 500K | $10 | $10,000 | $120,000 |

*CPM estimate conservative; utility sites often see $5-15 CPM*

### 7.3 Cost Structure

| Item | Monthly Cost |
|------|--------------|
| Domain | ~$0.60 ($7/yr) |
| Cloudflare Pages | $0 (free tier) |
| Development | $0 (built) |
| **Total** | **~$1/month** |

### 7.4 Profitability Timeline

- **Month 1-3:** Minimal traffic, ~$0-100 revenue
- **Month 4-6:** SEO traction, ~$100-500 revenue
- **Month 6-12:** Rankings improving, ~$500-2,000 revenue
- **Year 2+:** Established rankings, $2,000-10,000+ revenue

### 7.5 Future Monetization Options

| Option | Consideration |
|--------|---------------|
| Ethical Ads | Lower CPM but brand-aligned |
| Affiliate links | Lightroom, photo tools |
| Premium tier | Unlikely needed given cost structure |
| API access | Developer market, different product |
| White-label | B2B opportunity |

---

## 8. MVP Scope

### 8.1 In Scope (MVP)

| Feature | Details |
|---------|---------|
| Core converter | Drag-drop, auto-detect, convert |
| Input formats | HEIC, WebP, PNG, AVIF, TIFF, BMP, GIF |
| Output formats | JPEG, PNG (toggle) |
| Multi-file | Up to any number (soft warning at 30+) |
| ZIP download | JSZip bundling |
| Landing pages | Home + 7 format-specific pages |
| Trust pages | /about, /privacy, /how-it-works |
| Mobile support | Fully responsive |
| AdSense | Integrated, non-intrusive |
| Analytics | GA4 + Search Console |
| Basic SEO | Titles, metas, schema, sitemap |

### 8.2 Out of Scope (MVP)

| Feature | Reason | Future? |
|---------|--------|---------|
| Quality slider | Complexity, minimal value | Maybe |
| Resize/crop | Scope creep | Maybe |
| Image editing | Different product | No |
| Account system | Unnecessary | No |
| API | Different market | Maybe |
| Native apps | Web-first | Maybe |
| All blog content | Post-launch | Yes |
| International | Post-traction | Yes |
| Video conversion | Different product | No |

### 8.3 MVP Success Criteria

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Indexed pages | All pages indexed | 2 weeks |
| Core Web Vitals | All green | Launch |
| First organic click | >0 | 1 month |
| 1K monthly visitors | Achieved | 3 months |
| First ad revenue | >$0 | 3 months |
| Page 1 ranking (any keyword) | Achieved | 6 months |

---

## 9. Success Metrics

### 9.1 North Star Metric

**Monthly organic visitors** — Primary indicator of SEO success and revenue potential

### 9.2 Key Performance Indicators

| Category | Metric | Target (6mo) | Target (12mo) |
|----------|--------|--------------|---------------|
| Traffic | Monthly organic visitors | 10K | 50K |
| Traffic | Organic traffic growth (MoM) | 20% | 15% |
| SEO | Keywords in top 10 | 10 | 50 |
| SEO | Referring domains | 20 | 100 |
| Engagement | Bounce rate | <60% | <50% |
| Engagement | Conversions (files converted) | 5K | 25K |
| Revenue | Monthly ad revenue | $200 | $1,000 |
| Technical | Core Web Vitals | All green | All green |

### 9.3 Tracking Implementation

| Tool | Purpose |
|------|---------|
| Google Analytics 4 | Traffic, behavior, conversions |
| Google Search Console | Rankings, impressions, CTR |
| Cloudflare Analytics | Bandwidth, performance |
| Custom events | File conversions, format breakdown |

### 9.4 Conversion Events to Track

```javascript
// GA4 events
gtag('event', 'file_converted', {
  'input_format': 'heic',
  'output_format': 'jpeg',
  'file_count': 1
});

gtag('event', 'batch_converted', {
  'file_count': 5,
  'output_format': 'jpeg'
});

gtag('event', 'download_zip', {
  'file_count': 5
});
```

---

## 10. Risks & Mitigations

### 10.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| WASM codec breaks on browser update | Low | High | Pin versions, monitor, have fallbacks |
| Memory issues crash browsers | Medium | Medium | Sequential processing, warnings |
| New image format emerges | Low | Low | Modular architecture, add codec |
| Mobile Safari quirks | Medium | Medium | Extensive testing, polyfills |

### 10.2 Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SEO takes longer than expected | Medium | High | Content marketing, paid ads as backup |
| Google algorithm change | Medium | High | Diversify traffic, build email list |
| Competitor copies approach | Medium | Low | First-mover advantage, brand trust |
| AdSense account issues | Low | High | Comply strictly, backup ad networks |
| Apple changes HEIC default | Low | Medium | Diversified format support |

### 10.3 Legal Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GDPR compliance | Low | Medium | No data collected, clear privacy policy |
| Cookie consent | Low | Low | AdSense handles, minimal cookies |
| Accessibility lawsuit | Low | Medium | WCAG 2.1 AA compliance |

---

## 11. Implementation Roadmap

### 11.1 Phase 1: Foundation (Week 1-2)

- [ ] Set up Cloudflare Pages project
- [ ] Configure domain (covertconvert.app)
- [ ] Create base HTML structure
- [ ] Implement Tailwind styling
- [ ] Build drop zone component
- [ ] Implement file detection logic
- [ ] Integrate Canvas API encoding

### 11.2 Phase 2: Core Conversion (Week 2-3)

- [ ] Integrate libheif-js (HEIC)
- [ ] Integrate UTIF.js (TIFF)
- [ ] Integrate Squoosh AVIF codec
- [ ] Implement lazy-loading for codecs
- [ ] Build progress indicator
- [ ] Implement single-file download
- [ ] Integrate JSZip for multi-file
- [ ] Add output format toggle

### 11.3 Phase 3: Polish & UX (Week 3-4)

- [ ] Error handling and messaging
- [ ] Warning for large batches
- [ ] Mobile responsive testing
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Memory leak testing

### 11.4 Phase 4: SEO & Content (Week 4-5)

- [ ] Create all landing pages
- [ ] Write unique copy per page
- [ ] Implement schema markup
- [ ] Create /about page
- [ ] Create /privacy page
- [ ] Create /how-it-works page
- [ ] Generate XML sitemap
- [ ] Submit to Search Console

### 11.5 Phase 5: Monetization & Launch (Week 5-6)

- [ ] Apply for AdSense
- [ ] Implement ad placements
- [ ] Set up GA4 tracking
- [ ] Configure conversion events
- [ ] Final QA pass
- [ ] Soft launch
- [ ] Product Hunt submission
- [ ] Hacker News post
- [ ] Reddit announcements

### 11.6 Phase 6: Post-Launch (Ongoing)

- [ ] Monitor Search Console
- [ ] Publish blog content (weekly)
- [ ] Build backlinks
- [ ] Monitor Core Web Vitals
- [ ] Respond to user feedback
- [ ] Iterate based on data

---

## Appendices

### Appendix A: Complete Keyword List

See [Design Document](./plans/2025-12-11-covertconvert-design.md#exhaustive-long-tail-keyword-list)

### Appendix B: Competitor Analysis

See [Design Document](./plans/2025-12-11-covertconvert-design.md#competitor-reverse-engineering)

### Appendix C: Content Calendar

See [Design Document](./plans/2025-12-11-covertconvert-design.md#content-calendar-strategy)

### Appendix D: Link Building Playbook

See [Design Document](./plans/2025-12-11-covertconvert-design.md#link-building-playbook)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-11 | capturemotion | Initial PRD |

---

## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| Stakeholder | | | |
