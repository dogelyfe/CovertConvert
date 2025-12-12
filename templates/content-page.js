/**
 * Content Page Template - Static trust/info pages
 * Epic 4: About, Privacy, How It Works
 */

export const contentPage = ({ slug, title, description, h1, content, schema = null }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://covertconvert.com/${slug}/">
  <link rel="stylesheet" href="/css/styles.css">

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
${schema ? `
  <!-- Schema Markup -->
  <script type="application/ld+json">
${schema}
</script>
` : ''}
</head>
<body class="min-h-screen bg-gray-50 text-gray-900">
  <main class="container mx-auto px-4 py-8 max-w-2xl">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">${h1}</h1>
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

    <!-- Below-Content Ad -->
    <div class="mt-12" aria-label="Advertisement">
      <div class="ad-container ad-container--content mx-auto">
        <!-- Ad unit placeholder - replace data-ad-slot with your AdSense slot ID -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-XXXXXXXXXX"
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
      <a href="/about/" class="hover:text-gray-700">About</a>
      <a href="/privacy/" class="hover:text-gray-700">Privacy</a>
      <a href="/how-it-works/" class="hover:text-gray-700">How It Works</a>
    </nav>
  </footer>
</body>
</html>`;
