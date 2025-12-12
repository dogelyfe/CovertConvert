---
stepsCompleted: [1, 2]
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
lastStep: 2
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

