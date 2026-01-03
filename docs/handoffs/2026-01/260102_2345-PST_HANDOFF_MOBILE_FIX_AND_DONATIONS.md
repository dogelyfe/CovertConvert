# Handoff: Mobile File Picker Fix + Donation Monetization

**Date:** 2026-01-02 23:45 PST
**Status:** COMPLETED
**Branch:** main
**Deployed:** Yes

---

## Summary

This session addressed two major areas:
1. **Mobile file picker bug** - Files weren't being captured when returning from iOS photo gallery
2. **Donation monetization** - Removed all AdSense, implemented Ko-fi donation system

---

## Part 1: Mobile File Picker Fix

### Problem
Users on iOS Safari reported: "I tap to select files, go to my photo gallery, select files, click the check mark, then it just goes back to the main page as if I never left."

### Root Causes Identified

1. **Page lifecycle issue** - When iOS Safari backgrounds the page to show the photo picker, the page can be evicted from memory or restored from bfcache without JS event listeners firing properly.

2. **Double-trigger bug** - The file selector had both:
   - A `<label for="file-input">` that natively triggers the file input
   - A click handler on the parent div that calls `fileInput.click()`

   On iOS, this caused the picker to potentially open twice and fail to capture the selection.

### Fixes Applied

**File: `src/js/main.js`**

1. Added page lifecycle event handlers (lines 119-148):
```javascript
function bindPageLifecycleEvents(elements) {
  // Handle bfcache restoration
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      checkForPendingFiles(elements);
    }
  });

  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.status === 'idle') {
      setTimeout(() => checkForPendingFiles(elements), 100);
    }
  });

  // Handle window focus
  window.addEventListener('focus', () => {
    if (state.status === 'idle') {
      setTimeout(() => checkForPendingFiles(elements), 150);
    }
  });
}
```

2. Fixed double-trigger by checking if click came from label (lines 191-199):
```javascript
elements.fileSelector?.addEventListener('click', (e) => {
  // If click is on or inside the label, let native behavior handle it
  if (e.target.closest('label[for="file-input"]')) {
    return;
  }
  elements.fileInput?.click();
});
```

### Commits
- `c4a54c7` - Fix mobile file picker losing selection on page restore
- `7a96cb4` - Fix iOS Safari double-trigger on file selector

---

## Part 2: Web Share API for Mobile

### Problem
Converted images were downloading to iOS Files app, not the Photos library.

### Solution
Implemented Web Share API to open native share sheet on mobile, allowing users to "Save Image" to Photos, AirDrop, etc.

**File: `src/js/platform.js`** - Added `canShareFiles()` detection:
```javascript
function canShareFiles() {
  if (!navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}
```

**File: `src/js/downloader.js`** - Added `shareFiles()` function and modified `triggerDownload()` to use share on mobile when supported.

### Commit
- `0c48e36` - Add Web Share API for mobile - enables save to Photos

---

## Part 3: Donation Monetization (AdSense Removal)

### Decision
Switch from AdSense to Ko-fi donations to maintain privacy-first branding.

### Ko-fi Account
- **Username:** `untraced`
- **URL:** https://ko-fi.com/untraced

### What Was Added

1. **Support page** (`/support/`)
   - Added to `data/trust-pages.json`
   - Contains Ko-fi button with brand colors (#FF5E5B)
   - Explains why donations matter

2. **Header navigation** (all 5 templates)
   - Added "♥ Support" link between Blog and theme toggle
   - Red heart icon with Ko-fi brand color

3. **Trust message** (home + SEO pages)
   - Changed from: "Your files never leave your device"
   - Changed to: "Your files never leave your device · No ads · Community supported"

4. **Footer** (all 5 templates)
   - Added "♥ Support" link to Company section

5. **CSS** (`src/css/input.css`)
   - `.site-header__nav-link--support` - Header support link styling
   - `.trust-message__link` - Trust message link styling
   - `.site-footer__support-link` - Footer support link styling

### What Was Removed (AdSense Code)

**For posterity, here's exactly what was removed in case you want to restore ads:**

#### AdSense Publisher ID
```
ca-pub-8099101912328978
```

#### Script Tag (was in head of all 5 templates)
```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8099101912328978" crossorigin="anonymous"></script>
```

#### Desktop Sidebar Ad (was in home-page.js and seo-page.js)
```html
<!-- Desktop Sidebar Ad (hidden on mobile) -->
<aside class="tool-layout__sidebar hidden lg:block" aria-label="Advertisement">
  <div class="ad-container ad-container--sidebar">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-8099101912328978"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"
         data-full-width-responsive="false"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>
</aside>
```

#### Mobile Below-Fold Ad (was in home-page.js and seo-page.js)
```html
<!-- Mobile Below-Fold Ad (hidden on desktop) -->
<div class="lg:hidden mt-12" aria-label="Advertisement">
  <div class="ad-container ad-container--mobile mx-auto">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-8099101912328978"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="horizontal"
         data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>
</div>
```

#### Below-Content Ad (was in content-page.js and blog-post.js)
```html
<!-- Below-Content Ad -->
<div class="mt-12" aria-label="Advertisement">
  <div class="ad-container ad-container--content mx-auto">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-8099101912328978"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>
</div>
```

#### Ad Container CSS (still exists in input.css, just not used)
The `.ad-container` styles remain in `src/css/input.css` (lines ~421-450) but are unused. They can be removed for cleanup or left for if ads return.

### To Restore AdSense

If you want to go back to ads:
1. Add the script tag back to the `<head>` of each template
2. Add the ad containers back to the appropriate locations
3. Replace `XXXXXXXXXX` with actual ad slot IDs from AdSense dashboard
4. Remove or hide the donation-related additions

### Commit
- `fb5fa78` - Switch to donation-based monetization - remove all ads

---

## Remaining Work

### Post-Conversion Donation Prompt (Not Implemented)
The highest-impact donation touchpoint would be a prompt that appears after successful conversion:

```
┌─────────────────────────────────────────────────────┐
│  ♥ CovertConvert is free, private, and ad-free.    │
│    Help keep it that way.                           │
│                                                     │
│    [☕ Buy me a coffee]     [Maybe later]           │
└─────────────────────────────────────────────────────┘
```

This would require:
- New UI component in `ui.js`
- Trigger after `showSuccess()` in `main.js`
- localStorage flag to not nag (show once per session or per week)
- CSS styling

This was scoped but not implemented in this session.

---

## Files Modified

| File | Changes |
|------|---------|
| `src/js/main.js` | Page lifecycle handlers, double-trigger fix |
| `src/js/platform.js` | Added `canShareFiles()` |
| `src/js/downloader.js` | Added `shareFiles()`, modified `triggerDownload()` |
| `src/css/input.css` | Support link styles |
| `data/trust-pages.json` | Added /support page |
| `templates/home-page.js` | Header, trust message, footer, removed ads |
| `templates/seo-page.js` | Header, trust message, footer, removed ads |
| `templates/content-page.js` | Header, footer, removed ads |
| `templates/blog-post.js` | Header, footer, removed ads |
| `templates/blog-index.js` | Header, footer, removed ads |

---

## Commits This Session

```
fb5fa78 Switch to donation-based monetization - remove all ads
0c48e36 Add Web Share API for mobile - enables save to Photos
7a96cb4 Fix iOS Safari double-trigger on file selector
c4a54c7 Fix mobile file picker losing selection on page restore
```

---

## Verification

After Cloudflare deployment:
- [ ] Test mobile file picker on iOS Safari
- [ ] Test Web Share API (should open share sheet)
- [ ] Verify /support page loads with Ko-fi button
- [ ] Verify no AdSense scripts in page source
- [ ] Verify ♥ Support in header and footer

---

## Notes

- Ko-fi has 0% platform fee on donations (you keep 100%)
- The privacy-first messaging ("No ads · Community supported") reinforces brand differentiation
- Web Share API falls back to regular download if unsupported
