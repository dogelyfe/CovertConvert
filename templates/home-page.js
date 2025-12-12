/**
 * Home Page Template - Universal Converter
 * FR43-FR45: Universal converter at root URL with JPEG/PNG toggle
 * Epic 2: Batch warnings, quality slider
 */

export const homePage = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CovertConvert - Free Image Converter | Private & Instant</title>
  <meta name="description" content="Convert HEIC, WebP, AVIF, TIFF to JPG or PNG instantly. Your files never leave your device - 100% private, no uploads.">
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
  <!-- Replace G-XXXXXXXXXX with your GA4 Measurement ID -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>

  <!-- Google AdSense -->
  <!-- Replace ca-pub-XXXXXXXXXX with your AdSense Publisher ID -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>

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
</head>
<body class="min-h-screen bg-gray-50 text-gray-900">
  <!-- Theme Toggle -->
  <div class="theme-toggle" role="group" aria-label="Theme switcher">
    <svg class="icon-sun" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
    <label class="theme-switch">
      <input type="checkbox" id="theme-checkbox" aria-label="Toggle dark mode">
      <span class="thumb"></span>
    </label>
    <svg class="icon-moon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
  </div>

  <div class="container mx-auto px-4 py-8">
    <div class="lg:flex lg:gap-8 lg:justify-center">
      <!-- Main Content -->
      <main class="max-w-2xl w-full">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Free Image Converter</h1>
      <p class="text-gray-600">Convert HEIC, WebP, AVIF, TIFF, PNG, BMP, GIF to JPG or PNG</p>
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
            Drop files here or click to select
          </span>
          <span class="text-sm text-gray-500 mt-1 block">
            Supports HEIC, WebP, AVIF, TIFF, PNG, BMP, GIF
          </span>
        </label>
      </div>

      <!-- Output Format Toggle (home page only) -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500 mb-2">Convert to:</p>
        <div class="flex justify-center gap-4" role="radiogroup" aria-label="Output format">
          <button
            type="button"
            class="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-900 text-white"
            data-format="jpeg"
            aria-pressed="true"
          >
            JPEG
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
            data-format="png"
            aria-pressed="false"
          >
            PNG
          </button>
        </div>
      </div>

      <!-- Quality Slider (JPEG only - Story 1.7) -->
      <div id="quality-container" class="mt-4 text-center">
        <label for="quality-slider" class="text-sm text-gray-500 block mb-2">
          Quality: <span id="quality-value">92%</span>
        </label>
        <input
          type="range"
          id="quality-slider"
          min="10"
          max="100"
          value="92"
          class="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
          aria-label="JPEG quality"
          aria-valuemin="10"
          aria-valuemax="100"
          aria-valuenow="92"
        >
        <div class="flex justify-between w-48 mx-auto text-xs text-gray-600 mt-1">
          <span>Smaller</span>
          <span>Better</span>
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
        Your files never leave your device
      </p>
    </div>
      </main>

      <!-- Desktop Sidebar Ad (hidden on mobile) -->
      <aside class="hidden lg:block flex-shrink-0" aria-label="Advertisement">
        <div class="ad-container ad-container--sidebar sticky top-8">
          <!-- Ad unit placeholder - replace data-ad-slot with your AdSense slot ID -->
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-XXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"
               data-ad-format="auto"
               data-full-width-responsive="false"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
      </aside>
    </div>

    <!-- Mobile Below-Fold Ad (hidden on desktop) -->
    <div class="lg:hidden mt-12" aria-label="Advertisement">
      <div class="ad-container ad-container--mobile mx-auto">
        <!-- Ad unit placeholder - replace data-ad-slot with your AdSense slot ID -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="horizontal"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </div>
  </div>

  <footer class="text-center py-8 text-sm text-gray-500">
    <nav class="space-x-4">
      <a href="/about/" class="hover:text-gray-700">About</a>
      <a href="/privacy/" class="hover:text-gray-700">Privacy</a>
      <a href="/how-it-works/" class="hover:text-gray-700">How It Works</a>
    </nav>
  </footer>

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
  </script>
</body>
</html>`;
