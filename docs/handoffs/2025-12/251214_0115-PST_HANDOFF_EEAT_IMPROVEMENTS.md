# Handoff: E-E-A-T Improvements

**Date:** 2025-12-14 01:15 PST
**Agent:** Claude Opus 4.5
**Status:** IN PROGRESS

---

## Context

User wants to improve E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) for SEO. Analysis was completed, Tier 1 improvements identified, implementation started but interrupted.

## User Decisions Made

1. **Author name:** Use a **pen name** (not real name, not "editorial team")
2. **Contact email:** `hello@covertconvert.app`

## Tier 1 Tasks (Prioritized)

| Task | Status | Notes |
|------|--------|-------|
| Add contact page with email | ⏳ Not started | Add to trust-pages.json |
| Add Organization schema to homepage | ⏳ Not started | Add to home-page.js |
| Create author persona with bio | ⏳ Not started | Create pen name, add to About or /team/ |
| Add "Last updated" to trust pages | ⏳ Not started | Already on Privacy, add to About + How It Works |
| Add Person schema for blog author | ⏳ Not started | Update blog-post.js template |

---

## Implementation Details

### 1. Contact Page

Add to `data/trust-pages.json`:

```json
{
  "slug": "contact",
  "title": "Contact Us - CovertConvert",
  "description": "Get in touch with the CovertConvert team.",
  "h1": "Contact Us",
  "content": "<p>Email: hello@covertconvert.app</p>..."
}
```

Also add ContactPage schema.

### 2. Organization Schema

Add to `templates/home-page.js` in the `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CovertConvert",
  "url": "https://covertconvert.app",
  "logo": "https://covertconvert.app/assets/icon-192.png",
  "description": "Free private image converter. Your files never leave your device.",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@covertconvert.app",
    "contactType": "customer support"
  },
  "sameAs": []
}
```

### 3. Author Persona

Create a pen name like "Jordan Riley" or "Alex Chen" with:
- Brief bio (developer/privacy advocate)
- Optional: Add to About page or create /team/ page
- Add Person schema for blog posts

### 4. Last Updated Dates

Add `"updated": "2025-12-14"` to trust-pages.json entries and display in template.

### 5. Person Schema for Blog

Update `templates/blog-post.js` author section:

```json
"author": {
  "@type": "Person",
  "name": "Jordan Riley",
  "url": "https://covertconvert.app/about/"
}
```

---

## Files to Modify

1. `data/trust-pages.json` — Add contact page, add updated dates
2. `templates/home-page.js` — Add Organization schema
3. `templates/blog-post.js` — Change author from Organization to Person
4. `templates/content-page.js` — Display "Last updated" if provided

---

## Action Items for Next Agent

- [ ] Create pen name (suggest: "Jordan Riley" - gender-neutral, professional)
- [ ] Add contact page to trust-pages.json
- [ ] Add Organization schema to home-page.js
- [ ] Add Person schema to blog-post.js with pen name
- [ ] Add "updated" field to About and How It Works in trust-pages.json
- [ ] Rebuild and test
- [ ] Commit changes

---

## Predecessor

- `251214_0004-PST_HANDOFF_EPIC6_FILESIZE.md` — Epic 6 completed before this work

---

## Completion Record

| Field | Value |
|-------|-------|
| Completed By | — |
| Date | — |
| Status | IN PROGRESS |
| Commit | — |
