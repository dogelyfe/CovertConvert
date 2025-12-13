# Feature Spec: Background Removal / Sticker Creator

**Status:** Backlog — Future Exploration
**Priority:** Low (post-MVP, requires research)
**Added:** 2025-12-13
**Source:** User discussion about iOS sticker functionality

---

## Problem Statement

iOS 16+ allows users to "lift" subjects from photos to create stickers with transparency. This uses on-device ML for subject segmentation. Users who want similar functionality on other platforms typically must:

1. Use paid services (remove.bg, Canva Pro, etc.)
2. Upload photos to third-party servers (privacy concern)
3. Install desktop software (Photoshop, GIMP, etc.)

A privacy-first, browser-based background removal tool would align with CovertConvert's positioning.

---

## User Stories

- As a user, I want to remove the background from a photo so I can create a sticker/cutout
- As a user, I want my photos processed locally so they never leave my device
- As a user, I want to download the result as a PNG with transparency

---

## Technical Research

### What iOS Stickers Actually Are

- iOS uses Core ML for on-device subject segmentation
- The "lifted" subject is essentially a PNG with alpha channel
- iOS 17 sticker format is proprietary but exports as standard PNG

### Browser-Based ML Options

| Library | Model | Size | Speed | Quality |
|---------|-------|------|-------|---------|
| @imgly/background-removal | ISNet/MODNet | ~40MB | Fast (WebGPU) | Good |
| rembg (WASM port) | U2-Net | ~170MB | Slow | Excellent |
| Segment Anything (SAM) | ViT-based | ~400MB | Very slow | Best |
| TensorFlow.js BodyPix | MobileNet | ~5MB | Very fast | Basic (people only) |

**Recommendation:** Start with @imgly/background-removal — good balance of quality, size, and browser compatibility.

### Technical Requirements

- WebGPU preferred (falls back to WebGL)
- Model lazy-loaded only when feature accessed
- Processing happens entirely in browser
- Output: PNG with transparency

### Complexity Assessment

| Aspect | Difficulty |
|--------|------------|
| Core functionality | Medium — libraries exist |
| Bundle size management | Medium — lazy loading required |
| UX (preview, refine edges) | High — good UX is complex |
| Cross-browser support | Medium — WebGPU still emerging |
| Mobile performance | High — may be too slow on phones |

---

## Proposed Implementation

### Option A: Separate Page (Recommended)

Add `/remove-background/` page that:
- Lazy-loads ML model only when visited
- Keeps main converter lightweight
- Can be promoted as separate tool
- URL: `covertconvert.app/remove-background/`

### Option B: Integrated Feature

Add as toggle on main converter:
- "Remove background before converting"
- More complex UX
- Affects core converter load time
- Not recommended for MVP

### Option C: Separate Product

"CovertCut" or similar:
- Same privacy-first philosophy
- Different domain/branding
- Clean separation of concerns
- Higher marketing effort

---

## SEO Opportunity

High-value keywords:
- "remove background from image" (1M+ monthly searches)
- "background remover" (500K+)
- "remove bg" (200K+)
- "remove background free" (150K+)
- "png maker transparent background" (50K+)

Privacy angle differentiator:
- "remove background without uploading"
- "private background remover"
- "offline background removal"

---

## Open Questions

1. Is the added complexity worth the traffic potential?
2. Should this be same brand or separate product?
3. What's the minimum viable UX for background removal?
4. How to handle edge cases (hair, transparent objects, etc.)?

---

## Next Steps (When Prioritized)

1. [ ] Prototype with @imgly/background-removal
2. [ ] Benchmark performance on various devices
3. [ ] Design minimal UX for subject selection
4. [ ] Test output quality vs remove.bg
5. [ ] Estimate development effort

---

## References

- iOS 16 Visual Look Up: https://support.apple.com/guide/iphone/lift-a-subject-from-the-photo-background-iphfe4809658/ios
- @imgly/background-removal: https://github.com/nickelm/background-removal-js
- Segment Anything: https://segment-anything.com/
- remove.bg (competitor): https://www.remove.bg/

---

*This feature is in the exploration backlog. Implementation not currently scheduled.*
