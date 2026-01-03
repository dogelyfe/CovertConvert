---
created: 2026-01-03T00:05-PST
updated: 2026-01-03T01:01-PST
status: IN_PROGRESS
topic: i18n Implementation - Multi-language Support
source_handoff: null
---

# i18n Implementation Handoff

## Session Summary

Adding multi-language support for Spanish, Portuguese, French, and German to expand SEO surface area from ~13 pages to ~65 pages.

## Current Status: ALL Page Content Translations Complete

**Build tested and working!** All 5 locales now have full page content:
- **English (EN)**: 14 SEO pages + 6 trust pages (original)
- **German (DE)**: 14 SEO pages + 6 trust pages (translated)
- **Spanish (ES)**: 14 SEO pages + 6 trust pages (translated)
- **Portuguese (PT)**: 14 SEO pages + 6 trust pages (translated)
- **French (FR)**: 14 SEO pages + 6 trust pages (translated)

**Total: 100 localized pages** (20 pages × 5 languages)

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| URL structure | Subdirectories (`/es/`, `/pt/`, etc.) | Better SEO, consolidated domain authority |
| URL slugs | Keep English slugs | Simpler to manage |
| Languages | ES, PT, FR, DE | Top 4 internet languages after English |
| Launch | All 4 at once | Ship together |
| Blog scope | Top 5-10 posts first | Prioritize high-value content |

## Plan File

Full implementation plan at: `/Users/capturemotion/.claude/plans/piped-zooming-hoare.md`

## Implementation Phases

### Phase 1: Extract & Structure ✅ COMPLETE
- [x] Create `data/i18n/en.json` - Extract hardcoded strings
- [x] Move `seo-pages.json` to `data/pages/en/`
- [x] Move `trust-pages.json` to `data/pages/en/`
- [x] Update `scripts/build.js` with locale loop
- [x] Update templates to accept i18n parameter
- [ ] Update `src/js/ui.js` for i18n strings (PENDING)

### Phase 2: Add Languages - UI Strings ✅ COMPLETE
- [x] Generate `data/i18n/es.json` (Spanish)
- [x] Generate `data/i18n/pt.json` (Portuguese)
- [x] Generate `data/i18n/fr.json` (French)
- [x] Generate `data/i18n/de.json` (German)

### Phase 2.5: Page Content Translations ✅ COMPLETE
- [x] Generate `data/pages/de/seo-pages.json` (14 pages)
- [x] Generate `data/pages/de/trust-pages.json` (6 pages)
- [x] Generate `data/pages/es/seo-pages.json` (14 pages)
- [x] Generate `data/pages/es/trust-pages.json` (6 pages)
- [x] Generate `data/pages/pt/seo-pages.json` (14 pages)
- [x] Generate `data/pages/pt/trust-pages.json` (6 pages)
- [x] Generate `data/pages/fr/seo-pages.json` (14 pages)
- [x] Generate `data/pages/fr/trust-pages.json` (6 pages)
- [ ] Add hreflang tags to templates

### Phase 3: Language Switcher UI
- [ ] Add language selector to header
- [ ] Store preference in localStorage
- [ ] Update footer with language links

### Phase 4: Blog Translation
- [ ] Translate top 5 blog posts to all 4 languages
- [ ] Update build script for language-suffixed blog files
- [ ] Add hreflang to blog posts

## Key Files to Modify

**Build system:**
- `scripts/build.js` - Add locale loop

**Templates:**
- `templates/home-page.js`
- `templates/seo-page.js`
- `templates/content-page.js`
- `templates/blog-post.js`
- `templates/blog-index.js`

**JavaScript:**
- `src/js/ui.js` - Dynamic strings
- `src/js/errors.js` - Error messages

**Data files to create:**
- `data/i18n/en.json` (and es, pt, fr, de)
- `data/pages/en/seo-pages.json`
- `data/pages/en/trust-pages.json`

## Strings to Extract

### From templates (hardcoded HTML):
- Nav: "Blog", "Donate"
- Page titles and descriptions
- UI labels: "Convert to:", "Quality:", "Advanced options"
- File selector: "Drop files here...", "Tap to select..."
- Trust message: "Your files never leave your device..."
- Footer sections: "Tools", "Learn", "Company"
- Explainer section titles and text

### From ui.js (textContent assignments):
- "1 file selected" / "{count} files selected"
- "Converting..." / "Converting {current} of {total}..."
- "Done!" / "{count} files converted!"
- "Downloading {current} of {total}..."
- "Creating ZIP... {percent}%"

### From errors.js:
- USER_MESSAGES object (8 error messages)
- ERROR_GUIDANCE object (8 guidance messages)

## Output Structure

```
dist/
├── index.html              # English
├── heic-to-jpg/            # English SEO pages
├── es/
│   ├── index.html          # Spanish home
│   └── heic-to-jpg/        # Spanish SEO
├── pt/                     # Portuguese
├── fr/                     # French
└── de/                     # German
```

## Files Created This Session

```
data/i18n/
├── en.json  ✅ (UI strings extracted)
├── es.json  ✅ (Spanish translations)
├── pt.json  ✅ (Portuguese translations)
├── fr.json  ✅ (French translations)
└── de.json  ✅ (German translations)

data/pages/en/
├── seo-pages.json  ✅ (copied from data/)
└── trust-pages.json  ✅ (copied from data/)

data/pages/de/
├── seo-pages.json  ✅ (14 pages translated - all FAQs included)
└── trust-pages.json  ✅ (6 pages translated - full content)

data/pages/es/
├── seo-pages.json  ✅ (14 pages translated - all FAQs included)
└── trust-pages.json  ✅ (6 pages translated - full content)

data/pages/pt/
├── seo-pages.json  ✅ (14 pages translated - all FAQs included)
└── trust-pages.json  ✅ (6 pages translated - full content)

data/pages/fr/
├── seo-pages.json  ✅ (14 pages translated - all FAQs included)
└── trust-pages.json  ✅ (6 pages translated - full content)
```

## Files Modified This Session

- `scripts/build.js` - Added locale loop, i18n loading, fallback logic
- `templates/home-page.js` - Added i18n params, locale-aware lang attr
- `templates/seo-page.js` - Added i18n params
- `templates/content-page.js` - Added i18n params, locale date formatting
- `templates/blog-post.js` - Added i18n params, locale date formatting
- `templates/blog-index.js` - Added i18n params

## Action Items for Next Agent

1. **Add hreflang tags** - Critical for SEO (tells Google about language alternatives)
2. **Templates still use hardcoded strings** - Need to replace with `${i18n.section.key}` pattern
3. **Language switcher UI** - Add to header so users can switch languages
4. **Blog translations** - Create translated markdown files for top posts
5. **Update `src/js/ui.js`** - Wire up dynamic i18n strings for runtime UI

## Quick Start for Next Agent

```bash
# Test build works
npm run build

# Should see output for all 5 locales: en, es, pt, fr, de
# Pages fall back to English content until translations exist
```

## Notes

- Epic 6 (Target Filesize) is already implemented on production (docs were outdated)
- GA4 tracking ID: G-JKXZE02VCC
- Production URL: https://covertconvert.pages.dev
- All 48 E2E tests currently passing
