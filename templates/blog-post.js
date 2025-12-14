/**
 * Blog Post Template
 * Markdown-based blog posts with Article schema
 */

export const blogPost = ({ slug, title, description, date, updated, content, author = 'CovertConvert', tags = [] }) => {
  // Format updated date if provided (shown to users)
  const formattedUpdated = updated ? new Date(updated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": date,
    "dateModified": updated || date,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "CovertConvert",
      "url": "https://covertconvert.app"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://covertconvert.app/blog/${slug}/`
    }
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | CovertConvert Blog</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://covertconvert.app/blog/${slug}/">
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

  <!-- Article Schema -->
  <script type="application/ld+json">
${articleSchema}
  </script>
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

  <main class="container mx-auto px-4 py-8 max-w-2xl">
    <nav class="mb-8">
      <a href="/blog/" class="text-gray-500 hover:text-gray-700 text-sm">&larr; Back to Blog</a>
    </nav>

    <article>
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${title}</h1>
        ${formattedUpdated ? `<p class="text-gray-500 text-sm">Last updated: ${formattedUpdated}</p>` : ''}
      </header>

      <div class="prose prose-gray max-w-none blog-content">
        ${content}
      </div>
    </article>

    <div class="mt-12 p-6 bg-white rounded-lg border border-gray-200">
      <p class="text-gray-700 mb-4">Ready to convert your images?</p>
      <a href="/" class="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
        Convert Images Now &rarr;
      </a>
    </div>

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
  </main>

  <footer class="text-center py-8 text-sm text-gray-500">
    <nav class="space-x-4">
      <a href="/" class="hover:text-gray-700">Home</a>
      <a href="/blog/" class="hover:text-gray-700">Blog</a>
      <a href="/about/" class="hover:text-gray-700">About</a>
      <a href="/privacy/" class="hover:text-gray-700">Privacy</a>
    </nav>
  </footer>

  <script>
    (function() {
      var checkbox = document.getElementById('theme-checkbox');
      var html = document.documentElement;
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
};
