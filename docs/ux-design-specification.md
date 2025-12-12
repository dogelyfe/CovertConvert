---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - docs/PRD.md
  - docs/plans/2025-12-11-covertconvert-design.md
  - docs/plans/MVP-IMPLEMENTATION-PLAN.md
workflowType: 'ux-design'
lastStep: 7
project_name: 'CovertConvert'
user_name: 'Andrew'
date: '2025-12-11'
---

# UX Design Specification - CovertConvert

**Author:** Andrew
**Date:** 2025-12-11

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Design Foundation

**Adopted System:** khrome Design Bible v1.1 (grayscale)

**Philosophy:** "Calm & effortless" — matches CovertConvert's "it just works" positioning

**Why Grayscale:**
- "Covert" branding = understated, professional, nothing flashy
- Aligns with privacy message: "nothing to hide"
- Professional aesthetic trusted by compliance-restricted users (James persona)
- Photography-inspired naming (High Key/Low Key) fits image converter context

**Core Palette:**
```css
/* True neutral grays (R=G=B) */
--gray-0: #f2f2f2;    /* Page background */
--gray-50: #f0f0f0;   /* Card surfaces */
--gray-200: #cccccc;  /* Borders */
--gray-500: #808080;  /* Secondary text */
--gray-700: #4d4d4d;  /* Body text */
--gray-800: #333333;  /* Headings, buttons */
--gray-900: #0d0d0d;  /* Maximum emphasis */

/* Functional colors (feedback only) */
--success: muted green
--error: muted red
--warning: muted amber
```

**Dark Mode:** `.low-key` class, respects `prefers-color-scheme`

## Executive Summary

### Project Vision

CovertConvert is a client-side image format converter that solves the "iPhone photo won't open" problem in under 10 seconds. The UX must serve users who don't know what HEIC means while satisfying power users and privacy verifiers.

**Core UX Principle:** "It just works" — the absence of friction IS the feature.

### Target Users

| Persona | Need | Tech Level | UX Priority |
|---------|------|------------|-------------|
| Maria (Confused) | Fix "broken" file | Low | Zero jargon, instant results |
| Derek (Power) | Batch convert fast | High | Progress feedback, no limits |
| Priya (Verifier) | Prove privacy claim | High | Discoverable verification |
| James (Compliance) | Works without IT | Medium | Professional aesthetic |
| Alex (Error) | Clear failure guidance | Medium | Actionable error messages |

### Key Design Challenges

1. **Format-Agnostic Language** — Users may not know file formats. UI language must be neutral: "Drop your files here" not "Drop your HEIC files."

2. **Trust Hierarchy** — Three levels of trust communication:
   - Passive (Maria): Just works, no explanation needed
   - Surface (James): "Your files never leave your device" — visible but secondary
   - Verifiable (Priya): "How it works" link for those who want proof

3. **Progress Thresholds** — Adaptive progress UI:
   - < 500ms: No progress indicator (instant feedback)
   - 500ms - 2s: Minimal indicator (subtle spinner)
   - > 2s: Full progress (counter, progress bar)

4. **Error Without Alarm** — Muted functional colors (khrome palette):
   - Error: `#7f2020` text, `#fce8e8` bg — visible but not panic-inducing
   - Warning: `#5c3d0a` text, `#fef9e7` bg — caution without alarm
   - Success: `#2d5016` text, `#e8f5e0` bg — brief confirmation

5. **Consistent Cross-Page UX** — Landing pages (fixed output) and home page (toggle) must feel like the same product.

### Design Opportunities

1. **Simplicity as Differentiator** — Competitors are cluttered with options, upsells, captchas. Our empty space and single focus IS the feature.

2. **No Upload Bar** — The absence of an upload progress bar subtly communicates "nothing is uploading." Users notice what's missing.

3. **Speed as Delight** — If conversion is genuinely fast, the UI should feel fast. No unnecessary loading theater.

4. **Progressive Trust Discovery** — Trust messaging available but not blocking. Priya finds it; Maria ignores it.

5. **SEO-Friendly Aliases** — Consider `/iphone-photo-to-jpg` alongside `/heic-to-jpg` to match Maria's actual search terms.

## Core User Experience

### Defining Experience

**Core Action:** Select files → Get converted files

This single interaction is the product. Everything else — landing pages, SEO content, trust messaging, progress indicators — exists to serve this moment. The select-convert-download flow must be flawless.

**Experience Equation:**
```
User has file → Selects file(s) → Gets converted file(s)
   (3 seconds max, ideally under 1 second for typical files)
```

### Platform Strategy

| Platform | Interaction | UI Copy |
|----------|-------------|---------|
| Desktop | Drag-and-drop + click | "Drop files here or click to select" |
| Mobile | Tap → native file picker | "Tap to select files" |
| iOS Safari | Tap → Action sheet | Photo Library / Take Photo / Choose File / Browse |
| Android Chrome | Tap → Picker | Camera / Gallery / Files |

**Responsive Component:** Single `FileSelector` component adapts affordance to platform. Desktop shows drag-and-drop hints; mobile shows tap-friendly language.

**Component Naming Convention:**
| Context | Name |
|---------|------|
| Code/component | `FileSelector` |
| Desktop UI | "Drop files here or click to select" |
| Mobile UI | "Tap to select files" |
| Documentation | "file selector" or "converter" |

**Implementation Pattern:**
```html
<label class="file-selector">
  <input type="file" accept="image/*" multiple hidden>
  <span class="desktop-text">Drop files here or click to select</span>
  <span class="mobile-text">Tap to select files</span>
</label>
```

**Not Building:** Native apps, browser extensions, CLI tools

### Visual Hierarchy (Desktop Landing Pages)

| Element | Above-Fold Attention | Position |
|---------|---------------------|----------|
| File selector | 60% | Center, dominant |
| H1 headline | 20% | Above selector, SEO context |
| Trust message | 10% | Below selector, subtle |
| Navigation | 10% | Top, minimal |
| Ads, FAQ | — | Below fold |

**Mobile:** File selector IS the above-fold experience. Full-width, thumb-friendly, impossible to miss.

### Effortless Interactions

**Zero-Thought Interactions:**
- File selection — selector dominates viewport, platform-native picker
- Format detection — automatic, invisible
- Output format — pre-decided by URL (landing pages)
- Single file download — automatic after brief success confirmation
- Batch download — automatic ZIP, no configuration
- Reset — selector ready for more files, previous success visible as context

**Eliminated Steps (vs. competitors):**
- ❌ Account creation
- ❌ Email verification
- ❌ File upload wait
- ❌ Captcha
- ❌ "Processing..." modal
- ❌ "Click to download" button (auto-download with 500ms success pause)
- ❌ Upsell interruption

### Critical Success Moments

| Moment | User Feels | UX Response | Timing |
|--------|------------|-------------|--------|
| File selected | "It's working" | Instant visual feedback | < 100ms |
| First conversion (ever) | "Setting up" | Brief "Loading converter..." | Once per session |
| Conversion | "That was fast" | Speed surprise, minimal progress | < 3s typical |
| Success | "Done!" | ✓ confirmation visible | 500ms pause |
| Download | "Got it" | Auto-download triggers | After success pause |
| Ready for more | "I can do another" | Selector ready, success persists as context | Immediate |

### Post-Conversion State

**Success persists until next action (State C):**
- After download, success indicator remains visible
- File selector is active and ready for new files
- Selecting new files naturally replaces success state
- No manual "reset" or "clear" needed — next action is the reset
- Provides visual "history" of what just happened

**State Flow:**
```
[Empty] → [Files selected] → [Converting...] → [✓ Done! Downloading...] → [Success + Ready]
                                                      ↑ 500ms pause              ↓
                                               (user registers success)    [New files selected]
                                                                                 ↓
                                                                          [Success dismissed]
```

### First-Time Experience

**WASM codec loading (once per session):**
- First conversion may show brief "Loading converter..." (300-500ms)
- Subsequent conversions are instant (codec cached)
- Don't hide the setup — frame it as one-time initialization
- Return visitors skip this entirely (browser-cached WASM)

**First-time vs Return visitor:**
| User Type | WASM Load | Experience |
|-----------|-----------|------------|
| First visit | 300-500ms load | "Loading converter..." once |
| Return visit (cached) | Instant | No loading message |
| Same session, 2nd file | Instant | Codec already loaded |

### Competitive Differentiation

| Feature | Competitors | CovertConvert |
|---------|-------------|---------------|
| File input | Upload to server | Client-side only |
| Progress | Upload bar (implies server) | Conversion progress only |
| Download | "Click to download" button | Auto-download |
| Account | Required or upsold | Never |
| Speed | 5-20s (upload dependent) | <3s typical |

**Auto-download is unique** — every competitor requires a click. Preserve this.

### Experience Principles

1. **Speed Is the Feature** — Every millisecond matters. If it's fast, it feels trustworthy.

2. **Platform-Native Feel** — Desktop gets drag-and-drop. Mobile gets native file picker. Each platform's strengths respected.

3. **Invisible Complexity** — Format detection, WASM loading, memory management — all invisible to user.

4. **No Dead Ends** — Every state has a clear next action. Errors include guidance.

5. **Progressive Disclosure** — Simple by default, details available for those who seek them.

6. **Respect the File** — Users trust us with their files. The privacy architecture respects that trust.

7. **Acknowledge Then Disappear** — Brief success confirmation (500ms), then get out of the way.

## Desired Emotional Response

### Primary Emotional Goals

**The Core Feeling:** Relief — "Finally, something that just works."

This is the universal emotion across all personas. Maria feels relief that her "broken" photo works. Derek feels relief that batch processing is effortless. Priya feels relief that privacy claims are verifiable. James feels relief that no IT ticket is needed.

**Supporting Emotions:**
- **Trust** — Built through transparency and verifiable claims
- **Confidence** — Created by clear UI states and obvious actions
- **Efficiency** — Delivered through speed and no unnecessary steps
- **Respect** — Demonstrated by absence of dark patterns

### Emotional Journey Mapping

| Stage | Starting State | Target Emotion | Design Implication |
|-------|---------------|----------------|-------------------|
| Discovery | Skeptical/hopeful | Trust | Professional aesthetic, no gimmicks |
| File selection | Anticipating | Confidence | Large, obvious target area |
| Conversion | Waiting | Surprise | Speed exceeds expectations |
| Download | Satisfied | Delight | Auto-download, brief success |
| Error | Concerned | Understanding | Clear message, next steps |
| Return | Remembering | Recognition | Consistent, familiar interface |

### Micro-Emotions

**Critical Emotional States:**

| Cultivate | Avoid | UX Approach |
|-----------|-------|-------------|
| Confidence | Confusion | Single clear action per screen |
| Trust | Suspicion | "How it works" available, network tab verifiable |
| Control | Helplessness | User initiates everything, no auto-play |
| Accomplishment | Frustration | Fast feedback, visible progress |
| Calm | Anxiety | No timers, no "running out" messaging |
| Respect | Manipulation | No fake urgency, no upsell interruptions |

### Design Implications

**Emotion → Design Connection:**

| Emotion | Design Choice |
|---------|---------------|
| Relief | Instant results, auto-download |
| Trust | Grayscale palette (professional), verifiable architecture |
| Confidence | Prominent file selector, clear state indicators |
| Efficiency | No unnecessary steps, batch processing |
| Respect | No ads in critical path, no account wall |
| Calm | khrome's muted colors, subtle motion |

### Ad Placement Strategy

**Business Context:** AdSense is the revenue model. Ads are necessary for sustainability, but must not undermine user trust or experience.

**Golden Rule:** Ads NEVER appear in the critical path (select → convert → download).

**Placement Rules:**

| Rule | Rationale |
|------|-----------|
| Never pre-conversion interstitial | Destroys trust, feels like bait-and-switch |
| Never between action and result | Feels like ransom |
| Never post-conversion before download | User earned their file |
| Reserved height always | Prevents CLS (layout shift) |
| Lazy load all ads | Don't block page render or LCP |
| Sidebar on desktop only | Mobile has no room |
| Below fold on mobile | File selector must dominate viewport |

**Desktop Layout:**
```
┌─────────────────────────────────────┐
│  Navigation (minimal)               │
├─────────────────────────────────────┤
│  H1 Headline                        │
├──────────────────────┬──────────────┤
│                      │              │
│   File Selector      │  Sidebar Ad  │
│   (60% attention)    │  (reserved)  │
│                      │              │
├──────────────────────┴──────────────┤
│  Trust message                      │
├─────────────────────────────────────┤
│  ─────────── FOLD ───────────       │
├─────────────────────────────────────┤
│  FAQ Content (SEO)                  │
├─────────────────────────────────────┤
│  In-content Ad (optional)           │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────┐
│  Navigation         │
├─────────────────────┤
│  H1 Headline        │
├─────────────────────┤
│                     │
│   File Selector     │
│   (full width)      │
│                     │
├─────────────────────┤
│  Trust message      │
├─────────────────────┤
│  ───── FOLD ─────   │
├─────────────────────┤
│  Mobile Ad          │
│  (below fold only)  │
├─────────────────────┤
│  FAQ Content        │
└─────────────────────┘
```

**Ad Container Specs:**
- Desktop sidebar: 300x250 (medium rectangle) or 300x600 (half page)
- Mobile: 320x100 (large mobile banner) or 300x250
- Reserved height with subtle `--gray-50` placeholder
- Graceful handling if AdSense blocked or fails to load

### Emotional Design Principles

1. **Speed Creates Trust** — Fast performance feels more trustworthy than slow. Users subconsciously associate speed with competence.

2. **Absence Is Design** — What we DON'T show matters. No upsells, no account prompts, no progress theater creates emotional space.

3. **Earn Skepticism** — Assume users have been burned by competitors. Don't demand trust; make it verifiable.

4. **Graceful Failure** — Errors should inform, not alarm. Muted colors, clear guidance, preserved dignity.

5. **Recognition Over Recall** — Return visitors should feel instant familiarity. Consistent layout, no redesigns.

6. **Ads Are Guests, Not Hosts** — Ads exist to sustain the product, not define it. They stay out of the way.

### Emotions to Actively Avoid

| Emotion | Cause | Prevention |
|---------|-------|------------|
| Anxiety | Slow/uncertain progress | Threshold-based progress (skip if fast) |
| Suspicion | Privacy claims without proof | "How it works" page, verifiable architecture |
| Frustration | Unclear errors, dead ends | Every state has next action |
| Manipulation | Dark patterns, urgency | No fake timers, no "limited time" |
| Confusion | Too many options | Single action per page context |
| Abandonment | Broken flows | Comprehensive error handling |
| Exploitation | Ads blocking actions | Ads never in critical path |

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Primary Inspiration: Linear (via khrome Design Bible)**

| Aspect | Linear Pattern | CovertConvert Application |
|--------|---------------|---------------------------|
| Philosophy | "Calm & effortless" | Grayscale palette, no visual noise |
| Motion | Subtle, purposeful (100-250ms) | Micro-interactions that inform, not decorate |
| Typography | Clean hierarchy, Major Third scale | Clear visual hierarchy, readable at all sizes |
| Color | Minimal, functional | Grayscale primary, color only for feedback |
| Density | Breathing room, not cramped | Generous spacing around file selector |

**Secondary Inspiration: Apple (via khrome)**

| Aspect | Apple Pattern | CovertConvert Application |
|--------|--------------|---------------------------|
| Naming | Photography terms (High Key/Low Key) | Theme naming matches image converter context |
| Corners | Rounded, warm geometry | Border radius system for approachable feel |
| States | Clear feedback, no ambiguity | Distinct visual states for every interaction |
| Touch | 44pt minimum targets | 48px touch targets on mobile |

### Competitive Anti-Patterns

**Analyzed:** CloudConvert, Convertio, iLoveIMG

| Anti-Pattern | Seen In | Our Approach |
|--------------|---------|--------------|
| Upload progress bar | All competitors | No upload (client-side), conversion progress only |
| "Click to download" button | All competitors | Auto-download with success confirmation |
| Account upsells mid-flow | CloudConvert, Convertio | Never interrupt critical path |
| File limits with paywall | All competitors | No artificial limits |
| Format selection dropdowns | All competitors | URL determines format (landing pages) |
| CAPTCHA challenges | Convertio | Never (no server abuse to prevent) |
| Processing modals | All competitors | Inline progress, no modal overlay |
| Cluttered options | iLoveIMG | Single action per page |

### Transferable UX Patterns

**From Linear/khrome:**
- Progressive disclosure — Trust details hidden until sought
- State persistence — Success visible until next action
- Keyboard-first — Full keyboard accessibility
- Reduced motion respect — Honor `prefers-reduced-motion`
- Theme switching — High Key/Low Key (light/dark)

**From Apple:**
- Platform-native pickers — iOS Photo Library, Android Gallery
- Direct manipulation — Drag-and-drop on desktop
- Instant feedback — <100ms response to all actions
- Forgiveness — Easy to undo/retry, clear recovery

**Unique to CovertConvert:**
- Auto-download — Competitors require click; we auto-trigger
- Verifiable privacy — "Check network tab" as trust mechanism
- URL-as-configuration — Landing page URL determines output format
- No progress theater — Skip progress for fast operations
- Zero-onboarding — "Obvious by design" — UI teaches itself

### Additional UX Patterns

#### Zero-Onboarding Pattern

**Approach:** "Obvious by design"
- No tooltips, tutorials, or "first time?" modals
- The UI IS the instruction: big file selector, obvious action
- If a user can't figure it out in 3 seconds, the design has failed

#### Trust Page UX Patterns

| Page | Style | Content Approach |
|------|-------|------------------|
| `/about` | Brief, professional | 3 paragraphs max: who built it, why |
| `/privacy` | Short, plain English | "We don't collect your files because we never receive them." |
| `/how-it-works` | Technical, precise | Explainer with diagram showing browser-only flow |

#### Loading State Patterns

| State | Visual Pattern |
|-------|----------------|
| WASM loading (first time) | "Loading converter..." with subtle text pulse |
| Single file converting | "Converting..." → "✓ Done!" (text transition) |
| Batch converting | "Converting 12 of 47..." + thin 4px progress bar |
| Fast operation (<500ms) | Skip entirely — straight to "✓ Done!" |

#### Offline UX Pattern

- After first visit, WASM cached — works offline silently
- No "You're offline" banner (unnecessary)
- First visit while offline: "Connect to internet to load converter (one-time setup)"

#### Unsupported Browser Pattern

Message: "Your browser doesn't support the features needed. Please try Chrome 88+, Firefox 78+, Safari 14+, or Edge 88+."
Styling: Muted error colors, centered where file selector would be

#### FAQ Interaction Pattern

- First 2 FAQs expanded by default
- Remaining collapsed with chevron
- Click to expand/collapse, 250ms transition
- Keyboard accessible

#### Cross-Link Pattern

Below file selector: "Need PNG instead? Convert to PNG →"
- Secondary text color (`--gray-500`)
- Subtle, not prominent

### Design Inspiration Strategy

**Adopt:** khrome grayscale system, typography, spacing, motion, functional colors
**Adapt:** Linear's density (more generous), Apple's touch targets (48px)
**Avoid:** Upload bars, modals, download buttons, dropdowns, accounts, limits, CAPTCHAs

**Design North Star:** If a user can't figure out what to do within 3 seconds, the design has failed.

## Design System Foundation

### Design System Choice

**Selected:** khrome Design Bible v1.1 (Grayscale) — Forked
**Type:** Forked design system, adapted for vanilla HTML/CSS
**Relationship:** Forked from khrome v1.1, soft sync quarterly

### Rationale for Selection

| Factor | Decision Driver |
|--------|-----------------|
| Brand alignment | "Covert" = understated, professional, nothing flashy |
| Privacy message | Grayscale reinforces "nothing to hide" positioning |
| Target user trust | James (compliance) needs professional aesthetic |
| Photography context | High Key/Low Key naming fits image converter |
| Maintenance | Solo developer — one system across projects |
| Speed | Already designed and validated in khrome |

### Implementation Approach

**Forked, Not Copied:**
- Extract minimal CSS subset (~65 lines, not 860)
- Adapt for vanilla HTML/CSS (no React, no `@layer`)
- No build system — single CSS file or inline `<style>`
- Tailwind CSS via CDN for utility classes only

**Architecture:**
```
/css
  covertconvert.css    ← Forked khrome subset + custom components
```

### Minimal CSS Subset (Forked from khrome)

```css
/* CovertConvert Design System - Forked from khrome v1.1 */

:root {
  /* Grayscale (true neutral R=G=B) */
  --gray-0: #f2f2f2;
  --gray-50: #f0f0f0;
  --gray-100: #e6e6e6;
  --gray-200: #cccccc;
  --gray-300: #b3b3b3;
  --gray-400: #999999;
  --gray-500: #808080;
  --gray-600: #666666;
  --gray-700: #4d4d4d;
  --gray-800: #333333;
  --gray-900: #1a1a1a;
  --gray-950: #0d0d0d;

  /* Functional Colors (muted) */
  --success-text: #2d5016;
  --success-bg: #e8f5e0;
  --success-border: #c2e6b3;

  --error-text: #7f2020;
  --error-bg: #fce8e8;
  --error-border: #f5c2c2;

  --warning-text: #5c3d0a;
  --warning-bg: #fef9e7;
  --warning-border: #f5e6c2;

  /* Typography Scale (Major Third 1.250) */
  --font-xs: 0.64rem;
  --font-sm: 0.8rem;
  --font-base: 1rem;
  --font-lg: 1.25rem;
  --font-xl: 1.563rem;
  --font-2xl: 1.953rem;
  --font-3xl: 2.441rem;

  /* Spacing (4px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Motion */
  --duration-fast: 100ms;
  --duration-normal: 250ms;
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}

/* Dark Mode (Low Key) */
.low-key,
[data-theme="dark"] {
  --gray-0: #0d0d0d;
  --gray-50: #1a1a1a;
  --gray-100: #262626;
  --gray-200: #333333;
  --gray-300: #4d4d4d;
  --gray-400: #666666;
  --gray-500: #808080;
  --gray-600: #999999;
  --gray-700: #b3b3b3;
  --gray-800: #cccccc;
  --gray-900: #e6e6e6;
  --gray-950: #f2f2f2;
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Apply low-key values */
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

### Custom Components (CovertConvert-Specific)

Components to CREATE (not in khrome):

| Component | Purpose | Key Specs |
|-----------|---------|-----------|
| `.file-selector` | Main interaction element | 48px min touch target, drag-drop states |
| `.progress-batch` | Thin batch progress bar | 4px height, `--gray-300` bg, `--gray-700` fill |
| `.download-success` | Success + auto-download state | Muted green, 500ms visibility |
| `.ad-container` | Reserved ad space | Min-height, `--gray-50` placeholder |
| `.faq-accordion` | Collapsible FAQ items | 250ms transition, chevron indicator |

### Component States

**File Selector States:**
```
.file-selector           → Default (ready for input)
.file-selector--hover    → Drag hovering / mouse hover
.file-selector--active   → Files being processed
.file-selector--success  → Conversion complete
.file-selector--error    → Conversion failed
```

**Progress States:**
```
.progress-batch          → Container
.progress-batch__fill    → Animated fill (width: X%)
.progress-batch__text    → "Converting 12 of 47..."
```

### Design System Verification Checklist

Before launch, verify:

- [ ] Color contrast passes WCAG AA (4.5:1 for text) — test with WebAIM
- [ ] All touch targets ≥ 48px on mobile
- [ ] Focus indicators visible on all interactive elements
- [ ] Dark mode toggles correctly (manual + `prefers-color-scheme`)
- [ ] `prefers-reduced-motion` disables animations
- [ ] File selector states are visually distinct
- [ ] Error/warning/success colors are distinguishable
- [ ] Progress bar visible on `--gray-0` background

### Maintenance Strategy

**Relationship to khrome:**
- Forked from khrome v1.1 (December 2025)
- Soft sync quarterly — check khrome for improvements
- No shared package (over-engineering for solo dev)
- CovertConvert can diverge freely for product-specific needs

**Sync Checklist (Quarterly):**
- [ ] Review khrome CSS changes
- [ ] Adopt improvements that benefit CovertConvert
- [ ] Document any divergence reasons

## Defining Core Experience

### The Core Interaction

**One-sentence definition:** Drop files → Get converted files (in under 3 seconds)

**Tinder-style description:** "Convert any image instantly without uploading"

**Why it works:**
- Solves real frustration ("iPhone photo won't open")
- Speed creates delight (expectation: slow upload; reality: instant)
- Privacy creates trust (nothing leaves, verifiable)

### User Mental Model

**How users currently solve this:**
- Google "heic to jpg converter"
- Upload to CloudConvert/Convertio (5-20 second wait)
- Maybe create account, hit file limits
- Click download button, maybe see upsell

**What they expect from us:**
- Same pattern (upload, wait, download)
- But faster and simpler

**The surprise:**
- No upload bar (there IS no upload)
- It's already done before they expect it
- File auto-downloads

### Success Criteria for Core Interaction

| Criterion | Target | Measurable Via |
|-----------|--------|----------------|
| Time to result | < 3 seconds | Performance API |
| User actions required | 1 (drop/select) | Event count |
| Decisions required | 0 | No decision UI exists |
| Friction points | 0 | Funnel analysis |

**Measurable Success Proxies:**

| Indicator | Proxy For | Target |
|-----------|-----------|--------|
| Return visitor rate | "They bookmarked it" | >15% |
| Conversion completion rate | "It worked" | >95% |
| Multi-file sessions | "They trust it" | >20% of sessions |
| Time on page | "No confusion" | <30 seconds |

**The True Aha Moment:**

Our product ends at download. The REAL success is when the user opens the converted file and it works — that happens outside our product. Our job is to get them there as fast as possible and stay out of the way.

### Platform-Specific Download Strategy

**The Problem:** ZIP files on mobile are terrible UX (Files app extraction on iOS, extra steps on Android). But mobile users typically have 1-5 photos, not 47.

**Solution:** Different batch handling per platform.

| Files | Desktop | Mobile |
|-------|---------|--------|
| 1 | Direct download | Direct download |
| 2-5 | ZIP download | Sequential direct downloads |
| 6-10 | ZIP download | Sequential + soft warning |
| 11+ | ZIP download | Convert first 10, show message |

**Mobile Batch Limits:**
- Files 1-5: Sequential direct downloads (each file to camera roll/Downloads)
- Files 6-10: Sequential downloads + "Large batches work better on desktop"
- Files 11+: Convert first 10 + "For more files, continue on desktop"

**Rationale:**
- Mobile users realistically converting 1-5 photos from camera roll
- Direct downloads go to camera roll (iOS) or Downloads (Android) — usable immediately
- No ZIP extraction friction
- Heavy users are on desktop anyway

**Implementation Notes:**
- Detect mobile via viewport width or user agent
- Sequential downloads with 500ms delay between each
- Each file named clearly: `photo1.jpg`, `photo2.jpg`, etc.
- Progress: "Downloading 3 of 5..."

### Novel vs Established Patterns

**Established patterns we use:**
- Drag-and-drop file input (familiar)
- Progress indicators (familiar)
- Download triggering (familiar)

**Novel patterns (our innovation):**
- Auto-download (competitors require click)
- No upload progress (because no upload)
- URL-as-configuration (format in URL, not dropdown)
- Verifiable privacy ("check your network tab")
- Platform-aware batch handling (no ZIP on mobile)

### Conscious Omissions

Things we deliberately DON'T do:

| Omission | Rationale |
|----------|-----------|
| Before/after preview | Adds friction; optimize for speed |
| Quality preview | Users trust default; slider for power users |
| File size display | Users don't care; just give them the result |
| Format explanation | Maria doesn't need to know what HEIC means |
| Undo/history | Each conversion is independent |
| Account/save | Violates privacy promise; adds friction |
| ZIP on mobile | Terrible UX; sequential downloads instead |

### Experience Mechanics

**1. Initiation:**
- User arrives via Google search
- Sees dominant file selector
- Copy: "Drop files here or click to select" (desktop) / "Tap to select files" (mobile)

**2. Interaction:**
- User drops/selects file(s)
- Visual feedback: selector changes state immediately (<100ms)
- If first conversion: "Loading converter..." (300-500ms, once)
- Progress: "Converting..." or "Converting 12 of 47..."

**3. Feedback:**
- Success: "✓ Done!" with muted green
- 500ms pause (user registers success)
- Auto-download triggers

**4. Completion (Platform-Specific):**

**Desktop:**
- Single file: Direct download
- Multiple files: ZIP download

**Mobile:**
- 1-5 files: Sequential direct downloads
- 6-10 files: Sequential + "Large batches work better on desktop"
- 11+ files: First 10 + "Continue on desktop for more"

**Both:**
- Selector returns to ready state with success context
- Cross-link visible: "Need PNG instead? Convert to PNG →"

**5. Failure Paths:**

| Failure | User Sees |
|---------|-----------|
| Unsupported format | "This file type isn't supported." |
| Single file fails | "Couldn't convert this file." |
| Batch partial failure | "Converted 45 of 47 files." |
| Old browser | "Please update your browser." |
| Unknown browser issue | "Try a different browser." |
| Memory pressure | "Large batch — this may take longer." |

**6. Helper Text (Always Visible):**

Below file selector, subtle `--gray-500`:
```
Supports HEIC, WebP, AVIF, PNG, TIFF, BMP, GIF
Your files never leave your device.
Need PNG instead? Convert to PNG →
```

**7. Graceful Degradation:**

When browser struggles with large batches:
- Progress updates slow (but continue)
- No freeze — sequential processing prevents crash
- Never lose completed conversions
