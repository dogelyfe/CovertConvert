/**
 * Blog Index Template
 * Lists all blog posts
 */

export const blogIndex = ({ posts }) => {
  const postsList = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(post => {
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return `
      <article class="py-6 border-b border-gray-200 last:border-0">
        <a href="/blog/${post.slug}/" class="block group">
          <h2 class="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">${post.title}</h2>
          <time datetime="${post.date}" class="text-gray-500 text-sm mt-1 block">${formattedDate}</time>
          <p class="text-gray-600 mt-2">${post.description}</p>
        </a>
      </article>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | CovertConvert - Image Conversion Tips & Guides</title>
  <meta name="description" content="Learn about image formats, conversion tips, and how to handle HEIC, WebP, AVIF, and other modern image formats.">
  <link rel="canonical" href="https://covertconvert.app/blog/">
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
</head>
<body class="min-h-screen">
  <!-- Site Header -->
  <header class="site-header">
    <a href="/" class="site-header__wordmark">CovertConvert</a>
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
  </header>

  <main class="container mx-auto px-4 py-8 max-w-2xl">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
      <p class="text-gray-600">Tips, guides, and everything about image formats.</p>
    </header>

    <div class="divide-y divide-gray-200">
      ${postsList}
    </div>

    ${posts.length === 0 ? '<p class="text-gray-500 py-8">No posts yet. Check back soon!</p>' : ''}
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
