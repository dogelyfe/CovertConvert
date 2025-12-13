# Blog Post Template

## Quick Reference

Copy this to start a new post:

```markdown
---
title: "Your Title Here"
description: "One sentence that would work as a Google snippet. 150-160 chars."
date: "YYYY-MM-DD"
slug: "url-friendly-slug"
tags: ["relevant", "tags", "here"]
updated: "YYYY-MM-DD"  # Optional: only add when post is significantly revised
---

Opening paragraph. No heading needed—dive right in. Set up the problem or question.

## First Section

Content here...

## Second Section

More content...

## Bottom line

Wrap-up without saying "in conclusion." Often just 1-2 sentences.
```

---

## Frontmatter Fields

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | 50-60 chars ideal for search results |
| `description` | Yes | 150-160 chars. This becomes the meta description. |
| `date` | Yes | Original publication date (YYYY-MM-DD) |
| `slug` | Yes | URL path. Use hyphens, lowercase, no special chars |
| `tags` | Yes | 2-5 relevant tags for organization |
| `updated` | No | Only add when making significant content changes |

**Note:** Dates are used for schema.org Article markup but not displayed to users. We show "Last updated" only if the `updated` field is present.

---

## Structure Guidelines

### Opening (no heading)
- Jump right into the topic
- Set up the problem, question, or situation
- Keep it to 1-3 short paragraphs
- No "In this post, we'll cover..."

### Body (2-5 sections with H2s)
- Each section should be scannable
- Use H3s sparingly for subsections if needed
- Mix paragraphs with occasional:
  - Bullet lists (for 3+ items)
  - Bold text for key terms
  - Short code blocks if relevant

### Closing
- Don't use "Conclusion" or "In summary" as a heading
- "Bottom line" or "My take" work better
- Or just end naturally without a wrap-up section
- Keep CTAs casual: `[convert your photos](/)` not "CLICK HERE NOW"

---

## Length Guidelines

| Post Type | Target Length |
|-----------|---------------|
| Format explainer | 400-600 words |
| How-to guide | 500-800 words |
| Comparison | 600-900 words |
| Troubleshooting | 300-500 words |
| Competitor alternative | 400-600 words |

Shorter is usually better. Don't pad.

---

## Post Categories

When writing, know which type you're creating:

**Format Explainers** (what-is-heic, what-is-webp, what-is-avif)
- What is it?
- Why does it exist?
- Where will you encounter it?
- What to do about it

**How-To Guides** (convert-iphone-photos, stop-iphone-saving-heic)
- The problem
- The solution(s), numbered or sectioned
- Quick recommendation

**Comparisons** (heic-vs-jpg, png-vs-jpg)
- Quick verdict upfront
- Category-by-category breakdown
- When to use each
- Don't overthink tables—they often look worse than prose

**Troubleshooting** (iphone-photo-wont-open, photo-wont-upload-instagram)
- Symptom (what the user searched)
- Likely cause
- Fix
- Prevention (optional)

**Competitor Alternatives** (cloudconvert-alternative, zamzar-alternative)
- Acknowledge the competitor is decent
- Explain the limitation that matters
- Offer the alternative
- Be fair, not salty

---

## Internal Linking

Link naturally to:
- The homepage `/` for conversion CTA
- Related blog posts `/blog/related-slug/`
- Relevant SEO landing pages `/heic-to-jpg/` etc.

Use descriptive anchor text, not "click here."

Good: `[convert it to JPG](/)` or `[more about HEIC](/blog/what-is-heic/)`
Bad: `[click here](/)` or `[this article](/blog/what-is-heic/)`

---

## Checklist Before Publishing

- [ ] Title under 60 characters
- [ ] Description is 150-160 characters
- [ ] Slug is URL-friendly
- [ ] Tags are relevant (check existing tags for consistency)
- [ ] Opens with the problem/question, not a preamble
- [ ] Sections are scannable with clear H2s
- [ ] At least one internal link to homepage or relevant post
- [ ] Follows VOICE_GUIDE.md tone
- [ ] No "In conclusion" / "Let's dive in" / other AI tells
- [ ] 1-2 subtle typos (see VOICE_GUIDE for guidance)
- [ ] Run `npm run build` to verify it generates correctly

---

## File Naming

Save as: `content/blog/{slug}.md`

The slug in the frontmatter must match the filename (minus .md).

Example:
- File: `content/blog/what-is-heic.md`
- Frontmatter: `slug: "what-is-heic"`
- URL: `covertconvert.app/blog/what-is-heic/`

---

## See Also

- `content/VOICE_GUIDE.md` — Tone, style, and character guidance
- `templates/blog-post.js` — The HTML template that wraps your content
