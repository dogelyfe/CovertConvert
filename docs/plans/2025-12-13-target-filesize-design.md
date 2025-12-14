# Target Filesize Feature Design

**Date:** 2025-12-13
**Status:** Draft — pending implementation readiness check

## Overview

Add a target filesize optimization feature that dynamically adjusts quality and/or dimensions to hit a user-specified size constraint. Designed for bulk processing workflows where consistent output size matters (email attachments, CMS uploads, form submissions with limits).

## User Flow

### Standard flow (no target):
```
Drop files → auto-convert → download
```
Unchanged from current behavior.

### Power user flow (target set):
```
Open "Advanced options" → set target filesize → drop files →
files queue with "Convert" button → user confirms →
processing with optimization → results appear in console log → download
```

## UI Components

### Advanced Options Panel

**Location:** After quality slider, before warning/error containers. Part of the settings stack that follows the drop zone.

**Default state:** Collapsed — single line: `▸ Advanced options`

**Expanded state:**
```
▾ Advanced options

  Target filesize
  [100KB]—[250KB]—[500KB]—●—[1MB]—[2MB]—[5MB]  [____] KB
                          ↑                      ↑
                     slider with snaps      manual override

  ☐ Lock quality (use resize only)
  ☐ Lock dimensions (use quality reduction only)

  ☐ Show conversion log
```

**Behaviors:**
- Slider snaps to common values (100KB, 250KB, 500KB, 1MB, 2MB, 5MB)
- Manual input overrides slider, accepts any value in KB
- Lock checkboxes are mutually exclusive — can't lock both
- Neither locked = smart mode (algorithm chooses based on image characteristics)
- "Show conversion log" enables the slide-in console panel

**Persistence:** Settings persist in localStorage across sessions.

### Conversion Log Panel

**Trigger:** Only appears when "Show conversion log" is checked.

**Behavior:** Slide-in panel from right (desktop) or bottom (mobile). Stays open during and after conversion.

**Visual style:** Console/terminal aesthetic — monospace font, dark background, compact lines.

**Content format:**
```
┌─────────────────────────────────────┐
│ Conversion Log                   ✕  │
├─────────────────────────────────────┤
│ ✓ IMG_001.heic → IMG_001.jpg (487KB)│
│ ✓ IMG_002.heic → IMG_002.jpg (512KB)│
│ ⚠ IMG_003.heic → IMG_003.jpg (847KB)│
│   target: 500KB                     │
│ ✓ IMG_004.heic → IMG_004.jpg (493KB)│
│                                     │
│ ─────────────────────────────────── │
│ 5 files • 4 on target • 1 best effort│
└─────────────────────────────────────┘
```

**Without target set:** Shows sizes without ✓/⚠ indicators:
```
│ IMG_001.heic → IMG_001.jpg (1.2MB)  │
```

### Queued State UI

When target is set and files are dropped:

```
│     ┌──────────────────────────────┐    │
│     │  📁 12 files ready           │    │
│     │  Drop more or click Convert  │    │
│     └──────────────────────────────┘    │
├─────────────────────────────────────────┤
│  Convert to: [JPEG] [PNG]               │
│  Quality: ====●===== 92%                │
│  ▾ Advanced options                     │
│    Target: 500KB  ☐ Lock Q  ☐ Lock Dim  │
│                                         │
│  [ Convert 12 files ]  ← primary button │
```

## Algorithm

### Approach

Binary search with quality and/or resize as levers.

### Inputs
- Target filesize (bytes)
- Lock quality (boolean) — if true, only resize
- Lock dimensions (boolean) — if true, only reduce quality
- Neither locked — algorithm chooses based on image type

### Image Type Detection (Simple Heuristic)
- **Photo:** High color variance, many unique colors → prefer quality reduction
- **Graphic/screenshot:** Low color variance, sharp edges → prefer resize

Detection runs once per image using sampled pixel analysis.

### Algorithm Flow

```
1. Encode at current settings
2. If size ≤ target → done (return result)
3. If size > target:
   a. Determine available lever(s) based on locks
   b. If quality available → binary search quality (90→10 range)
   c. If resize available → binary search scale (100%→25% range)
   d. If both available → use heuristic to pick primary lever,
      fall back to secondary if primary hits floor
4. After each encode → check size
5. Stop when: size ≤ target OR all levers exhausted
6. Return best result achieved (even if above target)
```

### Bounds
- Quality floor: 10% (below this, artifacts unacceptable)
- Scale floor: 25% (below this, image unusable)
- Max iterations: 8 (prevents runaway on edge cases)

### Performance
Canvas `toBlob()` is ~50-200ms per encode. Worst case 8 iterations = ~1.5s per file. Acceptable.

## Conditional Auto-Start

| Condition | Behavior |
|-----------|----------|
| No target set | Auto-start on drop (current behavior) |
| Target set | Queue files, show "Convert" button, require manual start |

This preserves the quick flow for simple conversions while giving control when precision matters.

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Target set, no files yet | Normal drop zone, Convert button hidden |
| Target set mid-queue | Apply to pending files, confirm before processing |
| Target cleared mid-queue | Revert to auto-start for next drop |
| Single file + target | Still require manual start (consistency) |
| All files fail to meet target | Complete with all ⚠ results, still download |
| Target impossibly small (e.g., 1KB) | Best effort, log shows actual sizes |
| Both locks checked | Prevent — checkboxes are mutually exclusive |

## Files to Modify

### Templates
- `templates/home-page.js` — Add Advanced options section
- `templates/seo-page.js` — Add Advanced options section (same component)

### JavaScript
- `src/js/converter.js` — Add resize capability, filesize targeting algorithm
- `src/js/ui.js` — Add log panel, queued state, advanced options toggle
- `src/js/main.js` — Wire up new controls, conditional auto-start logic

### CSS
- `src/css/input.css` — Styles for advanced options, log panel, slider

### New Files (if needed)
- `src/js/optimizer.js` — Filesize targeting algorithm (or inline in converter.js)

## Out of Scope

- Per-file target customization (batch only)
- Verbose logging mode
- Export report to file
- Preset profiles (e.g., "Email attachment", "Web upload")

## Open Questions

None — all design questions resolved during brainstorming.

## Success Criteria

1. User can set target filesize via slider or manual input
2. Files optimize to hit target using quality/resize as needed
3. Lock checkboxes constrain which levers are available
4. Console log shows per-file results with ✓/⚠ indicators
5. Manual start flow triggers only when target is active
6. Settings persist across sessions
7. Existing auto-start flow unchanged when no target set
