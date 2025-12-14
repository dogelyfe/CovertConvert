---
handoff_version: "2.0"
created: "2025-12-13 22:22 PST"
updated: "2025-12-13 22:22 PST"
status: "IN_PROGRESS"
priority: "P1"

source_handoff: "docs/handoffs/2025-12/251213_0313-PST_HANDOFF_POLISH_COMPLETE.md"
chain_position: 6

topic: "UX Expansion - Navigation, Typography, Content"
type: "implementation"

estimated_hours: 8
actual_hours: 2
completion_status: "PARTIAL"
---

# UX Expansion - Navigation, Typography, Content

**Date:** 2025-12-13 22:22 PST
**Status:** IN_PROGRESS
**Live URL:** https://covertconvert.app

---

## Executive Summary

Session focused on expanding the site from a single-purpose tool to a more complete experience. Added 5 SEO tool pages, centered tool layout, and started header/nav improvements. Significant work remains on typography, explainer section, footer, and pillar content.

---

## What Was Completed This Session

### 1. SEO Tool Pages (5 new pages)
Added to `data/seo-pages.json` with unique content per page:
- `/gif-to-jpg/` - Animation lost, transparency becomes black
- `/gif-to-png/` - Animation lost, transparency preserved
- `/bmp-to-jpg/` - 10-50x file size reduction
- `/bmp-to-png/` - Lossless compression
- `/jpg-to-png/` - Editing workflow, won't restore quality

**Total SEO pages:** 14 (was 9)

### 2. Centered Tool Layout
Changed from flexbox to CSS Grid for proper centering:
- Tool now truly centered regardless of ad presence
- Ad floats in right margin
- CSS: `grid-template-columns: 1fr minmax(auto, 42rem) 1fr`

Files changed:
- `src/css/input.css` - Added `.tool-layout` classes
- `templates/home-page.js`
- `templates/seo-page.js`

### 3. Console Log Cleanup
Removed all `console.log`, `console.debug`, `console.info` from production JS.
Kept `console.warn` and `console.error` for actual issues.

Files cleaned:
- `src/js/main.js`
- `src/js/analytics.js`
- `src/js/codecs/loader.js`

### 4. Header/Nav Updates (IN PROGRESS)
Updated all 5 templates with:
- **Two-tone wordmark:** `<span class="wordmark-covert">Covert</span><span class="wordmark-convert">Convert</span>`
- **Larger font:** 1.125rem → 1.5rem, weight 700
- **Blog link added:** New nav link in header
- **Nav structure:** Wrapped in `<nav class="site-header__nav">`

Templates updated:
- `templates/home-page.js`
- `templates/seo-page.js`
- `templates/blog-post.js`
- `templates/blog-index.js`
- `templates/content-page.js`

CSS added to `src/css/input.css`:
- `.wordmark-covert` - text-secondary color
- `.wordmark-convert` - text-primary color
- `.site-header__nav` - flexbox nav container
- `.site-header__nav-link` - nav link styling

**STATUS:** Code complete, needs visual verification and possible color tweaks.

---

## Remaining Tasks (Approved Plan)

### Phase 4: Footer Expansion (~1 hr)
Create expanded footer with site sections:
```
Tools                    Learn                     Company
─────                    ─────                     ───────
HEIC to JPG              What is HEIC?             About
WebP to JPG              HEIC vs JPG               Privacy
PNG to JPG               Is Online Converter Safe? How It Works
[View all →]             [View all →]
```

### Phase 5: Typography/Accessibility (~1 hr)
Increase font sizes:
| Element | Current | Proposed |
|---------|---------|----------|
| Body text | 16px | 18px |
| H1 | 30px | 36px |
| H2 | 24px | 28px |
| Small/muted | 14px | 16px |

### Phase 6: Homepage Explainer (~1.5 hr)
Add section below tool explaining:
- What this tool does
- Why we built it (privacy-first)
- "Your files never leave your device"
- Links to How It Works and Privacy

**Privacy messaging guidance:**
- ✅ "Your files never leave your device"
- ✅ "We never see, store, or process your images"
- ❌ Don't claim "no tracking" (AdSense tracks)
- Focus on FILE privacy, not site-wide claims

### Phase 7: Inter-site Linking (~1.5 hr)
- Tool pages → related blog posts
- Blog posts → relevant tools
- Homepage → blog highlights
- Related conversions cross-links

### Phase 8: Pillar Content (~2-3 hr)
"Complete Guide to Image Formats"
- Covers HEIC, AVIF, WebP, TIFF, PNG, JPG, GIF, BMP
- Links to all tool pages
- Links to relevant blog posts
- Follows voice guide

---

## Key File Locations

| File | Purpose |
|------|---------|
| `src/css/input.css` | All custom CSS (tool-layout, header, wordmark) |
| `data/seo-pages.json` | SEO page definitions |
| `templates/*.js` | All page templates |
| `content/VOICE_GUIDE.md` | Brand voice for blog/content |

---

## Git Status

**Uncommitted changes:**
- `src/css/input.css` - tool-layout, header nav styles
- `src/js/main.js` - console log removal
- `src/js/analytics.js` - console log removal
- `src/js/codecs/loader.js` - console log removal
- `templates/*.js` (5 files) - header updates

**Should commit:** Yes, all changes are working. Commit message suggestion:
```
UX expansion: header nav, centered layout, console cleanup

- Add Blog link to header navigation
- Two-tone wordmark styling (Covert/Convert)
- Larger wordmark font (1.5rem, weight 700)
- Remove console.log statements from production
- CSS Grid centered tool layout (already committed)
```

---

## For Next Agent

### Immediate Actions
1. **Verify header visually** - Start server, take screenshot
2. **Commit current changes** - All code is working
3. **Continue with footer expansion** - Phase 4

### Context
- User wants site to feel less "compressed"
- Privacy messaging should focus on FILES, not claim site is tracking-free
- Voice guide exists at `content/VOICE_GUIDE.md` for content work
- All templates share the same header structure now

### Technical Notes
- Server command: `npx serve dist -p 3457`
- Build command: `npm run build`
- Background server may be running on port 3457

---

**END OF HANDOFF**
