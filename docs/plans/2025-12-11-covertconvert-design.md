# CovertConvert.app — Design Document

**Date:** 2025-12-11
**Status:** Validated
**Domain:** covertconvert.app (acquired)

---

## Executive Summary

CovertConvert is a privacy-first image converter that runs entirely in the browser. Files never leave the user's device — conversion happens client-side using WebAssembly. Monetized via Google AdSense with genuinely unlimited free usage.

**Tagline:** "Your files never leave your device."

---

## Product Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Positioning | Privacy-first | Differentiator in a crowded market |
| Target audience | All (consumers, professionals, privacy-conscious) | Privacy angle serves everyone |
| Output formats | JPEG + PNG toggle | Covers 95% of needs without complexity |
| Monetization | Google AdSense (bootstrap) | Pragmatic; can switch to ethical ads later |
| Hosting | Cloudflare Pages | Unlimited bandwidth free, fastest CDN |
| Tech stack | Plain HTML/JS + Tailwind + WASM | No framework overhead, fastest load |
| Batch support | Yes, ZIP output | Matches droplet UX, differentiator |
| Limits | Soft warning only, no hard cap | Trust users, "unlimited" is marketing strength |

---

## Technical Architecture

### Stack
- Static HTML/CSS/JS (no framework)
- Tailwind CSS via CDN
- Vanilla JS for logic

### Image Processing
| Format | Method | Library |
|--------|--------|---------|
| PNG, WebP, BMP, GIF | Native Canvas API | Built-in |
| HEIC/HEIF | WASM decoder | libheif-js (~300KB) |
| TIFF | JS decoder | UTIF.js (~50KB) |
| AVIF | WASM decoder | Squoosh codec (~200KB) |

Codecs lazy-loaded only when file type detected.

### ZIP Creation
- JSZip (~90KB)
- Client-side, no server involvement

### Data Flow
```
User drops files
       ↓
FileReader API (browser, local)
       ↓
Detect format → lazy-load codec if needed
       ↓
Decode via WASM/Canvas (browser, local)
       ↓
Encode to JPEG/PNG via Canvas (browser, local)
       ↓
Single file → direct download
Multiple files → bundle with JSZip → download
       ↓
Revoke blob URL, release memory, process next
```

### Memory Management
- Sequential processing (one file at a time)
- Release memory after each file
- Soft warning at 30+ files
- User-facing note: "If browser freezes, try fewer files"

### Performance Targets
- Initial load: <1s LCP
- Time to interactive: <2s
- WASM codec load: <500ms (lazy, after first relevant file)

---

## Site Architecture

### URL Structure
```
covertconvert.app/                    ← Home (universal converter)
covertconvert.app/heic-to-jpg         ← SEO landing page
covertconvert.app/heic-to-png         ← SEO landing page
covertconvert.app/webp-to-jpg         ← SEO landing page
covertconvert.app/webp-to-png         ← SEO landing page
covertconvert.app/png-to-jpg          ← SEO landing page
covertconvert.app/avif-to-jpg         ← SEO landing page
covertconvert.app/avif-to-png         ← SEO landing page
covertconvert.app/tiff-to-jpg         ← SEO landing page
covertconvert.app/iphone-photo-to-jpg ← Non-technical users
covertconvert.app/about               ← Trust/credibility
covertconvert.app/privacy             ← Privacy policy
covertconvert.app/how-it-works        ← Technical transparency
covertconvert.app/blog/               ← Content marketing
```

Each converter page is the same tool with unique:
- Title tag
- Meta description
- H1
- Introductory copy
- FAQ section

---

## SEO Strategy

### Target Keywords

#### Tier 1: Head Terms (High Volume)
```
heic to jpg (500K+)
heic to jpeg
webp to jpg (200K+)
png to jpg
convert heic
heic converter
```

#### Tier 2: Long-Tail (Lower Competition)
```
heic to jpg converter online free
convert heic to jpg without uploading
heic to jpg privacy
webp to jpg bulk converter
convert iphone photos to jpg on pc
heic not uploading to [platform]
```

#### Tier 3: Question-Based (Featured Snippets)
```
how do i convert heic to jpg
why are my iphone photos heic
is it safe to convert heic online
can i convert heic without software
what is heic format
```

#### Tier 4: Problem-Aware (Non-Technical Users)
```
iphone photo to jpg
iphone photo won't open
iphone photo won't open on windows
iphone photo won't upload
photo won't upload to instagram
photo format not supported
convert iphone photos
why won't my photo open
fix photo format
```

#### Tier 5: Platform-Specific Problems
```
instagram won't accept photo
facebook photo upload failed
photo won't upload to website
canva image format not supported
wordpress image not supported
etsy listing photo format
email attachment photo format
```

#### Tier 6: Device-Specific
```
iphone photo to jpg
iphone photos to jpg on pc
iphone photos to jpg on windows
iphone photo won't open on android
mac photo to jpg
convert photo from iphone to pc
airdrop photo won't open on windows
```

#### Tier 7: Competitor/Alternative
```
cloudconvert alternative
zamzar alternative free
convertio safe
is cloudconvert safe
heic converter without upload
private heic converter
image converter no data collection
```

### Technical SEO Checklist
- [ ] Core Web Vitals passing
- [ ] Mobile-first responsive design
- [ ] HTTPS (forced by .app TLD)
- [ ] Self-referencing canonical URLs
- [ ] XML sitemap submitted to GSC
- [ ] robots.txt allowing all
- [ ] FAQ schema on all landing pages
- [ ] HowTo schema on tutorial content
- [ ] SoftwareApplication schema on home
- [ ] Internal linking between converter pages
- [ ] Clean URL structure (keyword in slug)
- [ ] All content in raw HTML (not JS-rendered)
- [ ] Preload critical WASM files
- [ ] Lazy load below-fold content
- [ ] Service worker for repeat visits

### Featured Snippet Strategy

**Steps format (HowTo):**
```html
<h2>How to Convert HEIC to JPG</h2>
<ol>
  <li>Drop your HEIC file onto the converter</li>
  <li>Click "Convert"</li>
  <li>Download your JPG instantly</li>
</ol>
```

**Definition format:**
```html
<p>HEIC (High Efficiency Image Container) is Apple's default photo
format since iOS 11. It offers better compression than JPEG while
maintaining quality, but isn't universally compatible.</p>
```

### Content Clusters

**Cluster 1: HEIC**
```
PILLAR: /heic-to-jpg
├── /blog/what-is-heic
├── /blog/heic-vs-jpg
├── /blog/why-iphone-uses-heic
├── /blog/stop-iphone-saving-heic
├── /blog/heic-on-windows
├── /blog/heic-on-android
├── /blog/is-heic-converter-safe
```

**Cluster 2: iPhone Photos**
```
PILLAR: /iphone-photo-to-jpg
├── /blog/iphone-photo-formats-explained
├── /blog/iphone-photo-wont-open-fix
├── /blog/transfer-iphone-photos-to-pc
├── /blog/send-iphone-photo-as-jpg
```

**Cluster 3: WebP**
```
PILLAR: /webp-to-jpg
├── /blog/what-is-webp
├── /blog/webp-vs-jpg
├── /blog/why-websites-use-webp
├── /blog/save-webp-as-jpg-chrome
```

### Content Calendar

**Launch (Day 1):**
- All converter landing pages
- /about, /privacy, /how-it-works

**Month 1:**
- Week 1: "What is HEIC? (And Why Your iPhone Uses It)"
- Week 2: "Is It Safe to Convert Photos Online? What to Look For"
- Week 3: "How to Convert iPhone Photos to JPG — 3 Methods"
- Week 4: "HEIC vs JPG: Quality, Size, and Compatibility Compared"

**Month 2:**
- Week 1: "Why Won't My iPhone Photo Open on Windows? (Fixed)"
- Week 2: "What is WebP? Why Websites Use It"
- Week 3: "How to Stop iPhone Saving Photos as HEIC"
- Week 4: "Photo Won't Upload to Instagram? Here's Why"

**Month 3:**
- Week 1: "AVIF Explained: The New Image Format You'll See Everywhere"
- Week 2: "Convert Photos Without Uploading: Why Privacy Matters"
- Week 3: "Best Free Image Converters Compared (2025)"
- Week 4: "[Competitor] Alternative: Private, Free, No Upload"

**Ongoing triggers:**
- New iOS release → update content
- New iPhone release → new landing page
- Competitor news → newsjacking
- Privacy breaches → thought leadership

### Link Building Strategy

**Tier 1: Immediate (Low Effort)**
- Product Hunt launch
- AlternativeTo.net listing
- Slant.co listing
- SaaSHub listing
- PrivacyTools.io submission
- GitHub (if open-sourcing)
- Social profiles (Twitter, Reddit, LinkedIn)

**Tier 2: Ongoing (Medium Effort)**
- Reddit participation (r/privacy, r/iphone, r/windows, r/techsupport)
- Hacker News "Show HN"
- Resource page outreach
- "Free tools" roundup requests

**Tier 3: Authority (Higher Effort)**
- Guest posts on privacy/tech blogs
- HARO journalist responses
- Original research ("We analyzed 50 converters' privacy policies")
- Digital PR pitches

### Video SEO

**YouTube content:**
- "How to Convert HEIC to JPG" (screen recording)
- "Why Your iPhone Photos Won't Open on Windows"
- "Is It Safe to Convert Photos Online?"

**Optimization:**
- Keyword in title
- Keyword in first 100 chars of description
- Custom thumbnails
- Chapters with timestamps
- End screens linking to tool

### International SEO (Future)

**Phase 2 languages (when traffic justifies):**
- Spanish (/es/heic-a-jpg)
- Portuguese (/pt/heic-para-jpg)
- German (/de/heic-zu-jpg)
- French (/fr/heic-en-jpg)
- Japanese (/ja/)
- Korean (/ko/)

---

## Monetization

### Revenue Model
- Google AdSense (bootstrap phase)
- Non-intrusive placement (sidebar or below fold)
- No ads interrupting the drop zone or conversion flow

### Revenue Projections

| Monthly Visitors | AdSense Revenue | Hosting Cost | Profit |
|------------------|-----------------|--------------|--------|
| 50K | $500-1,500 | ~$20 | $480-1,480 |
| 150K | $1,500-4,500 | ~$20 | $1,480-4,480 |
| 500K | $5,000-15,000 | ~$50 | $4,950-14,950 |

### Future Options
- Switch to Ethical Ads (Carbon Ads, EthicalAds) for brand alignment
- Add affiliate links (Lightroom, photo tools)
- Premium tier if demand emerges (unlikely needed)

---

## UX Requirements

### Core Flow
1. Land on page
2. See drop zone prominently (above fold)
3. See output format toggle (JPEG/PNG, default JPEG)
4. Drop file(s) or click to browse
5. See progress indicator during conversion
6. Single file: auto-download
7. Multiple files: "Download ZIP" button
8. Clear feedback on completion

### Trust Signals
- "Your files never leave your device" prominent on page
- "How it works" link explaining client-side processing
- Network tab proof in /how-it-works
- No signup, no email capture
- Clean, professional design (not ad-farm aesthetic)

### Warning States
- 30+ files: "Converting many files may slow your browser"
- Unsupported format: "This format isn't supported yet"
- Conversion error: "Couldn't convert [filename]. Try a different file."

### Mobile UX
- Touch-friendly drop zone
- "Tap to select files" (not just drag)
- Full-width on mobile
- Large touch targets

---

## Competitive Advantages

| Us | Them |
|----|------|
| Files never uploaded | Files uploaded to servers |
| No signup required | Often require email |
| Unlimited free | Artificial limits to push paid |
| Clean UX | Ad-heavy, popups |
| Fast (client-side) | Slow (upload/download) |
| Works offline (after load) | Requires internet throughout |
| Verifiable privacy claim | "Trust us" privacy claims |

---

## Success Metrics

### Traffic
- Organic sessions (weekly, monthly)
- Traffic by landing page
- Traffic by country

### Rankings
- Position for top 20 target keywords
- Keywords in top 3 / top 10
- Featured snippet ownership

### Engagement
- Bounce rate by page
- Conversions (file conversions tracked as events)
- Return visitors

### Revenue
- Monthly ad revenue
- Revenue per 1K sessions

### Links
- New referring domains (monthly)
- Domain rating trend

---

## Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Hard cap on files? | No, soft warning only |
| Quality slider? | No, keep simple for MVP |
| Which ad network? | AdSense to bootstrap |
| Framework? | None, plain HTML/JS |
| Output format choice? | Yes, JPEG/PNG toggle |

---

## Next Steps

1. Create PRD with BMAD structure
2. Create implementation plan
3. Build MVP
4. Launch and iterate
