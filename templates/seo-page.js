/**
 * SEO Landing Page Template
 * FR33-FR38: Format-specific landing pages with schema markup
 * Epic 2: Batch warnings, quality slider
 */

// Map tool slugs to relevant blog articles
const getRelatedArticles = (slug) => {
  const articles = {
    'heic': [
      { href: '/blog/what-is-heic/', title: 'What is HEIC?' },
      { href: '/blog/heic-vs-jpg/', title: 'HEIC vs JPG: Which is Better?' },
      { href: '/blog/convert-iphone-photos-to-jpg/', title: 'Convert iPhone Photos to JPG' }
    ],
    'webp': [
      { href: '/blog/what-is-webp/', title: 'What is WebP?' },
      { href: '/blog/save-webp-as-jpg-chrome/', title: 'Save WebP as JPG in Chrome' }
    ],
    'avif': [
      { href: '/blog/what-is-avif/', title: 'What is AVIF?' }
    ],
    'tiff': [
      { href: '/blog/what-is-tiff/', title: 'What is TIFF?' }
    ],
    'png': [
      { href: '/blog/png-vs-jpg/', title: 'PNG vs JPG: When to Use Each' }
    ],
    'gif': [
      { href: '/blog/convert-gif-to-jpg/', title: 'How to Convert GIF to JPG' }
    ],
    'bmp': [
      { href: '/blog/bmp-to-jpg/', title: 'BMP to JPG: Complete Guide' }
    ]
  };

  // Find matching articles based on slug prefix
  for (const [key, arts] of Object.entries(articles)) {
    if (slug.startsWith(key)) return arts;
  }

  // Default articles for any tool
  return [
    { href: '/blog/is-online-converter-safe/', title: 'Is Online Image Conversion Safe?' },
    { href: '/blog/convert-photos-without-uploading/', title: 'Convert Photos Without Uploading' }
  ];
};

export const seoPage = ({ slug, title, description, h1, outputFormat, crossLink, faqs = [] }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://covertconvert.app/${slug}/">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#0d0d0d">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon-192.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
  <link rel="apple-touch-icon" href="/assets/icon-192.png">
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

  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JKXZE02VCC"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-JKXZE02VCC');
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8099101912328978" crossorigin="anonymous"></script>

  <!-- FAQ Schema -->
  ${faqs.length > 0 ? `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [${faqs.map(faq => `
    {
      "@type": "Question",
      "name": "${faq.q.replace(/"/g, '\\"')}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${faq.a.replace(/"/g, '\\"')}"
      }
    }`).join(',')}
  ]
}
</script>` : ''}
</head>
<body class="min-h-screen">
  <!-- Site Header -->
  <header class="site-header">
    <a href="/" class="site-header__wordmark"><span class="wordmark-covert">Covert</span><span class="wordmark-convert">Convert</span></a>
    <nav class="site-header__nav">
      <a href="/blog/" class="site-header__nav-link">Blog</a>
      <div class="theme-toggle" role="group" aria-label="Theme switcher">
        <svg class="icon-sun" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <label class="theme-switch">
          <input type="checkbox" id="theme-checkbox" aria-label="Toggle dark mode">
          <span class="thumb"></span>
        </label>
        <svg class="icon-moon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </div>
    </nav>
  </header>

  <div class="container mx-auto px-4 py-8">
    <div class="tool-layout">
      <!-- Main Content (centered) -->
      <main class="tool-layout__main max-w-2xl w-full mx-auto lg:mx-0">
    <header class="text-center mb-8">
      <h1 class="font-bold text-gray-900 mb-2">${h1}</h1>
      <p class="text-gray-600">${description}</p>
    </header>

    <!-- File Selector Component -->
    <div id="converter" data-output="${outputFormat}">
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
        </label>
      </div>

      <!-- Quality Slider (JPEG pages only - Story 1.7) -->
      ${outputFormat === 'jpeg' ? `
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
      ` : ''}

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
          <span>Advanced options</span>
        </button>
        <div class="advanced-options__content" id="advanced-options-content">
          <!-- Target Filesize -->
          <div class="target-filesize">
            <label class="target-filesize__label">Target filesize</label>
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
              <span>Lock quality (resize only)</span>
            </label>
            <label class="lock-option">
              <input type="checkbox" id="lock-dimensions" name="lock-dimensions">
              <span>Lock dimensions (quality only)</span>
            </label>
          </div>

          <!-- Show Log Option -->
          <label class="log-option">
            <input type="checkbox" id="show-log" name="show-log">
            <span>Show conversion log</span>
          </label>
        </div>
      </div>

      <!-- Convert Button (Manual Start - shown when target is set and files queued) -->
      <button type="button" id="convert-button" class="convert-button" disabled>
        Convert files
      </button>

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

    ${crossLink ? `
    <p class="text-center text-gray-500 mt-4">
      ${crossLink.text} <a href="${crossLink.href}" class="text-gray-700 hover:underline">${crossLink.linkText || 'Convert here'} &rarr;</a>
    </p>
    ` : ''}

    ${faqs.length > 0 ? `
    <section class="mt-12">
      <h2 class="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
      <div class="space-y-4">
        ${faqs.map((faq, i) => `
        <details class="bg-white rounded-lg p-4 shadow-sm" ${i < 2 ? 'open' : ''}>
          <summary class="font-medium cursor-pointer text-gray-900">${faq.q}</summary>
          <p class="mt-2 text-gray-600">${faq.a}</p>
        </details>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <section class="mt-12">
      <h2 class="font-semibold text-gray-900 mb-4">Related Articles</h2>
      <div class="space-y-2">
        ${getRelatedArticles(slug).map(article => `
        <a href="${article.href}" class="block text-gray-600 hover:text-gray-900 hover:underline">${article.title} &rarr;</a>
        `).join('')}
      </div>
    </section>
      </main>

      <!-- Desktop Sidebar Ad (hidden on mobile) -->
      <aside class="tool-layout__sidebar hidden lg:block" aria-label="Advertisement">
        <div class="ad-container ad-container--sidebar">
          <!-- Ad unit placeholder - replace data-ad-slot with your AdSense slot ID -->
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-8099101912328978"
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
             data-ad-client="ca-pub-8099101912328978"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="horizontal"
             data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </div>
  </div>

  <footer class="site-footer">
    <div class="site-footer__grid">
      <div class="site-footer__section">
        <h3>Tools</h3>
        <ul>
          <li><a href="/heic-to-jpg/">HEIC to JPG</a></li>
          <li><a href="/webp-to-jpg/">WebP to JPG</a></li>
          <li><a href="/png-to-jpg/">PNG to JPG</a></li>
          <li><a href="/avif-to-jpg/">AVIF to JPG</a></li>
        </ul>
        <a href="/heic-to-png/" class="site-footer__view-all">More tools &rarr;</a>
      </div>
      <div class="site-footer__section">
        <h3>Learn</h3>
        <ul>
          <li><a href="/blog/what-is-heic/">What is HEIC?</a></li>
          <li><a href="/blog/heic-vs-jpg/">HEIC vs JPG</a></li>
          <li><a href="/blog/is-online-converter-safe/">Is Online Converter Safe?</a></li>
          <li><a href="/blog/convert-photos-without-uploading/">Convert Without Uploading</a></li>
        </ul>
        <a href="/blog/" class="site-footer__view-all">All articles &rarr;</a>
      </div>
      <div class="site-footer__section">
        <h3>Company</h3>
        <ul>
          <li><a href="/about/">About</a></li>
          <li><a href="/privacy/">Privacy</a></li>
          <li><a href="/how-it-works/">How It Works</a></li>
        </ul>
      </div>
    </div>
    <div class="site-footer__bottom">
      <p class="site-footer__copyright">&copy; 2025 CovertConvert. All rights reserved.</p>
    </div>
  </footer>

  <!-- Conversion Log Panel (Epic 6) -->
  <div class="conversion-log" id="conversion-log" aria-label="Conversion log">
    <div class="conversion-log__header">
      <span>Conversion Log</span>
      <button type="button" class="conversion-log__close" id="log-close" aria-label="Close log">
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
  </script>
</body>
</html>`;
