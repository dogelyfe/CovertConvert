/**
 * Content Page Template - Static trust/info pages
 * Epic 4: About, Privacy, How It Works
 */

const BASE_URL = 'https://covertconvert.app';

/**
 * Generate hreflang tags for SEO
 * @param {string} slug - Page slug
 * @param {string[]} locales - Array of locale codes
 * @param {string} defaultLocale - Default locale code
 */
const generateHreflang = (slug, locales, defaultLocale) => {
  const path = `/${slug}/`;
  const tags = locales.map(l => {
    const url = l === defaultLocale ? `${BASE_URL}${path}` : `${BASE_URL}/${l}${path}`;
    return `<link rel="alternate" hreflang="${l}" href="${url}" />`;
  });
  tags.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}${path}" />`);
  return tags.join('\n  ');
};

const LANG_NAMES = { en: 'English', es: 'Español', pt: 'Português', fr: 'Français', de: 'Deutsch' };

const generateLangSwitcher = (slug, locale, locales, defaultLocale) => {
  const path = `/${slug}/`;
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

export const contentPage = ({ slug, title, description, h1, content, schema = null, updated = null, i18n = {}, locale = 'en', locales = ['en'], defaultLocale = 'en' }) => {
  // Format updated date if provided (shown to users)
  const formattedUpdated = updated ? new Date(updated).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${locale === defaultLocale ? BASE_URL : BASE_URL + '/' + locale}/${slug}/" />
  ${generateHreflang(slug, locales, defaultLocale)}
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

${schema ? `
  <!-- Schema Markup -->
  <script type="application/ld+json">
${schema}
</script>
` : ''}

  <!-- BreadcrumbList Schema -->
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://covertconvert.app/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "${h1}",
      "item": "https://covertconvert.app/${slug}/"
    }
  ]
}
  </script>
</head>
<body class="min-h-screen">
  <!-- Site Header -->
  <header class="site-header">
    <a href="/" class="site-header__wordmark"><span class="wordmark-covert">Covert</span><span class="wordmark-convert">Convert</span></a>
    <nav class="site-header__nav">
      <a href="/blog/" class="site-header__nav-link">Blog</a>
      <a href="/support/" class="site-header__nav-link site-header__nav-link--support">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        Donate
      </a>
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
      ${generateLangSwitcher(slug, locale, locales, defaultLocale)}
    </nav>
  </header>

  <main class="container mx-auto px-4 py-8 max-w-2xl">
    <header class="text-center mb-8">
      <h1 class="font-bold text-gray-900 mb-2">${h1}</h1>
      ${formattedUpdated ? `<p class="text-gray-500 text-sm">Last updated: ${formattedUpdated}</p>` : ''}
    </header>

    <article class="prose prose-gray max-w-none">
      ${content}
    </article>

    <div class="mt-12 text-center">
      <a href="/" class="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        Convert Images Now
      </a>
    </div>
  </main>

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
          <li><a href="/terms/">Terms</a></li>
          <li><a href="/how-it-works/">How It Works</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/support/" class="site-footer__support-link">♥  Donate</a></li>
        </ul>
      </div>
    </div>
    <div class="site-footer__bottom">
      <p class="site-footer__copyright">&copy; 2025 CovertConvert. All rights reserved.</p>
    </div>
  </footer>

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
    })();
  </script>
</body>
</html>`;
};
