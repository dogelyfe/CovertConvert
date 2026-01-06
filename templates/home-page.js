/**
 * Home Page Template - Universal Converter
 * FR43-FR45: Universal converter at root URL with JPEG/PNG toggle
 * Epic 2: Batch warnings, quality slider
 */

const BASE_URL = 'https://covertconvert.app';

/**
 * Generate hreflang tags for SEO
 * @param {string} slug - Page slug (empty string for home page)
 * @param {string[]} locales - Array of locale codes
 * @param {string} defaultLocale - Default locale code
 */
const generateHreflang = (slug, locales, defaultLocale) => {
  const path = slug ? `/${slug}/` : '/';
  const tags = locales.map(l => {
    const url = l === defaultLocale ? `${BASE_URL}${path}` : `${BASE_URL}/${l}${path}`;
    return `<link rel="alternate" hreflang="${l}" href="${url}" />`;
  });
  // x-default points to the default locale version
  tags.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}${path}" />`);
  return tags.join('\n  ');
};

/**
 * Language names for display
 */
const LANG_NAMES = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch'
};

/**
 * Generate language switcher HTML
 * @param {string} slug - Current page slug (empty for home)
 * @param {string} locale - Current locale
 * @param {string[]} locales - Available locales
 * @param {string} defaultLocale - Default locale
 */
const generateLangSwitcher = (slug, locale, locales, defaultLocale) => {
  const path = slug ? `/${slug}/` : '/';
  const options = locales.map(l => {
    const href = l === defaultLocale ? path : `/${l}${path}`;
    const isActive = l === locale;
    return `<a href="${href}" class="lang-switcher__option${isActive ? ' is-active' : ''}">${LANG_NAMES[l] || l.toUpperCase()}</a>`;
  }).join('\n          ');

  return `<div class="lang-switcher" id="lang-switcher">
        <button class="lang-switcher__toggle" aria-expanded="false" aria-haspopup="true">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
          ${locale.toUpperCase()}
        </button>
        <div class="lang-switcher__dropdown">
          ${options}
        </div>
      </div>`;
};

export const homePage = ({ i18n = {}, locale = 'en', locales = ['en'], defaultLocale = 'en' } = {}) => `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${i18n.site?.title || 'CovertConvert - Free Image Converter | Private & Instant'}</title>
  <meta name="description" content="${i18n.site?.description || 'Convert HEIC, WebP, AVIF, TIFF to JPG or PNG instantly. Your files never leave your device - 100% private, no uploads.'}">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0d0d0d">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon-192.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
  <link rel="apple-touch-icon" href="/assets/icon-192.png">
  <link rel="canonical" href="${locale === defaultLocale ? BASE_URL + '/' : BASE_URL + '/' + locale + '/'}" />
  ${generateHreflang('', locales, defaultLocale)}
  <link rel="stylesheet" href="/css/styles.css">

  <!-- Theme initialization (prevents flash) -->
  <script>
    (function() {
      var theme = localStorage.getItem('cc-theme');
      // Default to dark mode if no preference saved
      if (!theme) theme = 'dark';
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  </script>

  <!-- Preconnect for potential codec CDN -->
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">

  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JKXZE02VCC"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-JKXZE02VCC');
  </script>

  <!-- SoftwareApplication Schema -->
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CovertConvert",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Free image converter that works in your browser. Convert HEIC, WebP, AVIF, TIFF to JPG or PNG. Your files never leave your device.",
  "featureList": [
    "Convert HEIC to JPG or PNG",
    "Convert WebP to JPG or PNG",
    "Convert AVIF to JPG or PNG",
    "Convert TIFF to JPG or PNG",
    "Batch conversion with ZIP download",
    "100% private - files never uploaded",
    "Works offline after initial load"
  ]
}
</script>

  <!-- Organization Schema -->
  <script type="application/ld+json">
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
  }
}
</script>

  <!-- WebSite Schema with Sitelinks Search -->
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CovertConvert",
  "url": "https://covertconvert.app",
  "description": "Free private image converter. Convert HEIC, WebP, AVIF, TIFF to JPG or PNG. Your files never leave your device.",
  "publisher": {
    "@type": "Organization",
    "name": "CovertConvert"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://covertconvert.app/blog/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>
</head>
<body class="min-h-screen">
  <!-- Site Header -->
  <header class="site-header">
    <a href="/" class="site-header__wordmark"><span class="wordmark-covert">Covert</span><span class="wordmark-convert">Convert</span></a>
    <nav class="site-header__nav">
      <a href="/blog/" class="site-header__nav-link">${i18n.nav?.blog || 'Blog'}</a>
      <a href="/support/" class="site-header__nav-link site-header__nav-link--support">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        ${i18n.nav?.donate || 'Donate'}
      </a>
      <div class="theme-toggle" role="group" aria-label="${i18n.nav?.themeSwitcher || 'Theme switcher'}">
        <svg class="icon-sun" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <label class="theme-switch">
          <input type="checkbox" id="theme-checkbox" aria-label="${i18n.nav?.toggleDarkMode || 'Toggle dark mode'}">
          <span class="thumb"></span>
        </label>
        <svg class="icon-moon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </div>
      ${generateLangSwitcher('', locale, locales, defaultLocale)}
    </nav>
  </header>

  <div class="container mx-auto px-4 py-8">
    <div class="tool-layout">
      <!-- Main Content (centered) -->
      <main class="tool-layout__main max-w-2xl w-full mx-auto lg:mx-0">
    <header class="text-center mb-8">
      <h1 class="font-bold text-gray-900 mb-2">${i18n.home?.title || 'Free Image Converter'}</h1>
      <p class="text-gray-600">${i18n.home?.subtitle || 'Convert HEIC, WebP, AVIF, TIFF, PNG, BMP, GIF to JPG or PNG'}</p>
    </header>

    <!-- File Selector Component -->
    <div id="converter" data-output="jpeg">
      <div
        class="file-selector"
        role="button"
        tabindex="0"
        aria-label="Drop files here or click to select images for conversion"
      >
        <input
          type="file"
          id="file-input"
          class="sr-only"
          accept="image/*,.heic,.heif,.avif,.webp,.tiff,.tif,.bmp,.gif,.png"
          multiple
        >
        <label for="file-input" class="cursor-pointer text-center">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <span class="text-lg font-medium text-gray-700 block" id="selector-text">
            ${i18n.converter?.dropText || 'Drop files here or click to select'}
          </span>
          <span class="text-sm text-gray-500 mt-1 block">
            ${i18n.converter?.supportedFormats || 'Supports HEIC, WebP, AVIF, TIFF, PNG, BMP, GIF'}
          </span>
        </label>
      </div>

      <!-- Output Format Toggle (home page only) -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500 mb-3">${i18n.converter?.convertTo || 'Convert to:'}</p>
        <div class="format-pill" data-selected="jpeg" role="radiogroup" aria-label="${i18n.accessibility?.outputFormat || 'Output format'}">
          <div class="format-pill__slider"></div>
          <button
            type="button"
            class="format-pill__option"
            data-format="jpeg"
            aria-pressed="true"
          >
            ${i18n.converter?.formatJpg || 'JPG'}
          </button>
          <button
            type="button"
            class="format-pill__option"
            data-format="png"
            aria-pressed="false"
          >
            ${i18n.converter?.formatPng || 'PNG'}
          </button>
        </div>
      </div>

      <!-- Quality Slider (JPEG only - Story 1.7) -->
      <div id="quality-container" class="mt-4 text-center">
        <label for="quality-slider" class="text-sm text-gray-500 block mb-2">
          ${i18n.converter?.quality || 'Quality:'} <span id="quality-value">92%</span>
        </label>
        <input
          type="range"
          id="quality-slider"
          min="10"
          max="100"
          value="92"
          class="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
          aria-label="${i18n.accessibility?.jpegQuality || 'JPEG quality'}"
          aria-valuemin="10"
          aria-valuemax="100"
          aria-valuenow="92"
        >
        <div class="flex justify-between w-48 mx-auto text-xs text-gray-600 mt-1">
          <span>${i18n.converter?.qualitySmaller || 'Smaller file'}</span>
          <span>${i18n.converter?.qualityBetter || 'Better quality'}</span>
        </div>
      </div>

      <!-- Advanced Options (Epic 6) -->
      <div class="advanced-options" data-expanded="false" id="advanced-options">
        <button
          type="button"
          class="advanced-options__toggle"
          aria-expanded="false"
          aria-controls="advanced-options-content"
        >
          <svg class="advanced-options__chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span>${i18n.converter?.advancedOptions || 'Advanced options'}</span>
        </button>
        <div class="advanced-options__content" id="advanced-options-content">
          <!-- Target Filesize -->
          <div class="target-filesize">
            <label class="target-filesize__label">${i18n.converter?.targetFilesize || 'Target filesize'}</label>
            <div class="target-filesize__controls">
              <input
                type="range"
                id="target-filesize-slider"
                min="50"
                max="5000"
                value="500"
                step="50"
                class="target-filesize__slider"
                aria-label="Target filesize"
              >
              <input
                type="number"
                id="target-filesize-input"
                min="10"
                max="10000"
                placeholder="500"
                class="target-filesize__input"
                aria-label="Target filesize in KB"
              >
              <span class="target-filesize__unit">KB</span>
            </div>
            <div class="target-filesize__presets">
              100KB • 250KB • 500KB • 1MB • 2MB • 5MB
            </div>
          </div>

          <!-- Lock Options -->
          <div class="lock-options">
            <label class="lock-option">
              <input type="checkbox" id="lock-quality" name="lock-quality">
              <span>${i18n.converter?.lockQuality || 'Lock quality'}</span>
            </label>
            <label class="lock-option">
              <input type="checkbox" id="lock-dimensions" name="lock-dimensions">
              <span>${i18n.converter?.lockDimensions || 'Lock dimensions'}</span>
            </label>
          </div>

          <!-- Show Log Option -->
          <label class="log-option">
            <input type="checkbox" id="show-log" name="show-log">
            <span>${i18n.converter?.showLog || 'Show conversion log'}</span>
          </label>
        </div>
      </div>

      <!-- Convert Button (Manual Start - shown when target is set and files queued) -->
      <button type="button" id="convert-button" class="convert-button" disabled>
        ${i18n.converter?.convertButton || 'Convert files'}
      </button>

      <!-- Donation Banner (shown after successful conversion, once per session) -->
      <div id="donation-banner" class="donation-banner hidden" role="complementary" aria-label="Support CovertConvert">
        <p class="donation-banner__headline">${i18n.donation?.headline || 'You just converted without ads or tracking.'}</p>
        <p class="donation-banner__subtext">${i18n.donation?.subtext || 'Every donation keeps one more developer away from the dark side.'}</p>
        <div class="donation-banner__actions">
          <button type="button" class="donation-banner__cta" id="donation-cta">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
            </svg>
            ${i18n.donation?.cta || 'Buy me a coffee'}
          </button>
          <button type="button" class="donation-banner__dismiss" id="donation-dismiss">${i18n.donation?.dismiss || 'Maybe later'}</button>
        </div>
      </div>

      <!-- Warning Container (Story 2.6 - hidden by default) -->
      <div id="warning-container" class="mt-6 hidden p-4 bg-warning-bg border border-warning rounded-lg" role="alert">
        <div class="flex items-start justify-between">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-warning-text mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <p class="text-warning-text text-sm" id="warning-message"></p>
          </div>
          <button
            type="button"
            id="warning-dismiss"
            class="text-warning-text hover:text-gray-700 ml-4"
            aria-label="Dismiss warning"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Error Container (hidden by default) -->
      <div id="error-container" class="mt-6 hidden p-4 bg-error-bg border border-error rounded-lg" role="alert">
        <p class="text-error-text font-medium" id="error-message"></p>
        <p class="text-sm text-gray-600 mt-1" id="error-guidance"></p>
      </div>

      <!-- Progress (hidden by default) -->
      <div id="progress-container" class="mt-6 hidden">
        <div class="progress-batch">
          <div class="progress-batch__fill" style="width: 0%"></div>
        </div>
        <p class="text-center text-sm text-gray-600 mt-2" id="progress-text">Converting...</p>
      </div>

      <!-- Trust Message -->
      <p class="trust-message text-center">
        <svg class="w-4 h-4 inline-block mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
        </svg>
        ${i18n.trust?.message || 'Your files never leave your device · No ads · '}<a href="/support/" class="trust-message__link">${i18n.trust?.communitySupported || 'Community supported'}</a>
      </p>
    </div>
      </main>

    </div>
  </div>

  <!-- Explainer Section -->
  <section class="explainer">
    <div class="explainer__grid">
      <div class="explainer__item">
        <svg class="explainer__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="explainer__title">${i18n.explainer?.anyFormat?.title || 'Any Format, Instantly'}</h3>
        <p class="explainer__text">${i18n.explainer?.anyFormat?.text || 'Convert HEIC, WebP, AVIF, TIFF, and more to JPG or PNG. No software to install.'}</p>
      </div>
      <div class="explainer__item">
        <svg class="explainer__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <h3 class="explainer__title">${i18n.explainer?.private?.title || '100% Private'}</h3>
        <p class="explainer__text">${i18n.explainer?.private?.text || 'Your files never leave your device. We never see, store, or process your images.'}</p>
      </div>
      <div class="explainer__item">
        <svg class="explainer__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <h3 class="explainer__title">${i18n.explainer?.fast?.title || 'Fast & Free'}</h3>
        <p class="explainer__text">${i18n.explainer?.fast?.text || 'Runs entirely in your browser using WebAssembly. No uploads, no waiting.'}</p>
      </div>
    </div>
    <div class="explainer__cta">
      <a href="/how-it-works/" class="explainer__link">${i18n.explainer?.howItWorks || 'How it works'}</a>
      <a href="/privacy/" class="explainer__link">${i18n.explainer?.privacyPolicy || 'Privacy policy'}</a>
    </div>
  </section>

  <!-- Featured Articles -->
  <section class="featured-articles">
    <h2 class="featured-articles__title">${i18n.blog?.title || 'From the Blog'}</h2>
    <div class="featured-articles__grid">
      <a href="/blog/what-is-heic/" class="featured-articles__item">
        <h3 class="featured-articles__item-title">${i18n.featuredArticles?.whatIsHeic || 'What is HEIC?'}</h3>
        <p class="featured-articles__item-desc">${i18n.featuredArticles?.whatIsHeicDesc || "Why your iPhone photos won't open on Windows"}</p>
      </a>
      <a href="/blog/is-online-converter-safe/" class="featured-articles__item">
        <h3 class="featured-articles__item-title">${i18n.featuredArticles?.isOnlineSafe || 'Is Online Conversion Safe?'}</h3>
        <p class="featured-articles__item-desc">${i18n.featuredArticles?.isOnlineSafeDesc || 'What to look for in a secure converter'}</p>
      </a>
      <a href="/blog/heic-vs-jpg/" class="featured-articles__item">
        <h3 class="featured-articles__item-title">${i18n.featuredArticles?.heicVsJpg || 'HEIC vs JPG'}</h3>
        <p class="featured-articles__item-desc">${i18n.featuredArticles?.heicVsJpgDesc || 'Which format should you use?'}</p>
      </a>
      <a href="/blog/convert-photos-without-uploading/" class="featured-articles__item">
        <h3 class="featured-articles__item-title">${i18n.featuredArticles?.convertWithoutUploading || 'Convert Without Uploading'}</h3>
        <p class="featured-articles__item-desc">${i18n.featuredArticles?.convertWithoutUploadingDesc || 'How browser-based conversion works'}</p>
      </a>
    </div>
  </section>

  <footer class="site-footer">
    <div class="site-footer__grid">
      <div class="site-footer__section">
        <h3>${i18n.footer?.tools || 'Tools'}</h3>
        <ul>
          <li><a href="/heic-to-jpg/">${i18n.links?.heicToJpg || 'HEIC to JPG'}</a></li>
          <li><a href="/webp-to-jpg/">${i18n.links?.webpToJpg || 'WebP to JPG'}</a></li>
          <li><a href="/png-to-jpg/">${i18n.links?.pngToJpg || 'PNG to JPG'}</a></li>
          <li><a href="/avif-to-jpg/">${i18n.links?.avifToJpg || 'AVIF to JPG'}</a></li>
        </ul>
        <a href="/heic-to-png/" class="site-footer__view-all">${i18n.footer?.moreTools || 'More tools →'}</a>
      </div>
      <div class="site-footer__section">
        <h3>${i18n.footer?.learn || 'Learn'}</h3>
        <ul>
          <li><a href="/blog/what-is-heic/">${i18n.featuredArticles?.whatIsHeic || 'What is HEIC?'}</a></li>
          <li><a href="/blog/heic-vs-jpg/">${i18n.featuredArticles?.heicVsJpg || 'HEIC vs JPG'}</a></li>
          <li><a href="/blog/is-online-converter-safe/">${i18n.featuredArticles?.isOnlineSafe || 'Is Online Converter Safe?'}</a></li>
          <li><a href="/blog/convert-photos-without-uploading/">${i18n.featuredArticles?.convertWithoutUploading || 'Convert Without Uploading'}</a></li>
        </ul>
        <a href="/blog/" class="site-footer__view-all">${i18n.footer?.allArticles || 'All articles →'}</a>
      </div>
      <div class="site-footer__section">
        <h3>${i18n.footer?.company || 'Company'}</h3>
        <ul>
          <li><a href="/about/">${i18n.links?.about || 'About'}</a></li>
          <li><a href="/privacy/">${i18n.links?.privacy || 'Privacy'}</a></li>
          <li><a href="/terms/">${i18n.links?.terms || 'Terms'}</a></li>
          <li><a href="/how-it-works/">${i18n.links?.howItWorks || 'How It Works'}</a></li>
          <li><a href="/contact/">${i18n.links?.contact || 'Contact'}</a></li>
          <li><a href="/support/" class="site-footer__support-link">♥  ${i18n.nav?.donate || 'Donate'}</a></li>
        </ul>
      </div>
    </div>
    <div class="site-footer__bottom">
      <p class="site-footer__copyright">${i18n.site?.copyright || '© 2025 CovertConvert. All rights reserved.'}</p>
    </div>
  </footer>

  <!-- Conversion Log Panel (Epic 6) -->
  <div class="conversion-log" id="conversion-log" aria-label="${i18n.log?.title || 'Conversion log'}">
    <div class="conversion-log__header">
      <span>${i18n.log?.title || 'Conversion Log'}</span>
      <button type="button" class="conversion-log__close" id="log-close" aria-label="${i18n.log?.close || 'Close log'}">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="conversion-log__body" id="log-body"></div>
    <div class="conversion-log__footer" id="log-footer"></div>
  </div>

  <script type="module" src="/js/main.js"></script>
  <script>
    // Theme toggle functionality
    (function() {
      var checkbox = document.getElementById('theme-checkbox');
      var html = document.documentElement;

      // Set initial checkbox state based on current theme
      var isDark = html.getAttribute('data-theme') === 'dark';
      checkbox.checked = isDark;

      checkbox.addEventListener('change', function() {
        if (this.checked) {
          html.setAttribute('data-theme', 'dark');
          localStorage.setItem('cc-theme', 'dark');
        } else {
          html.removeAttribute('data-theme');
          localStorage.setItem('cc-theme', 'light');
        }
      });
    })();

    // Language switcher toggle
    (function() {
      var switcher = document.getElementById('lang-switcher');
      if (!switcher) return;
      var toggle = switcher.querySelector('.lang-switcher__toggle');

      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = switcher.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen);
      });

      document.addEventListener('click', function(e) {
        if (!switcher.contains(e.target)) {
          switcher.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Store language preference when clicking an option
      switcher.querySelectorAll('.lang-switcher__option').forEach(function(opt) {
        opt.addEventListener('click', function() {
          var lang = this.href.split('/')[3] || 'en';
          localStorage.setItem('cc-lang', lang === '' ? 'en' : lang);
        });
      });
    })();
  </script>
</body>
</html>`;
