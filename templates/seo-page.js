/**
 * SEO Landing Page Template
 * FR33-FR38: Format-specific landing pages with schema markup
 */

export const seoPage = ({ slug, title, description, h1, outputFormat, crossLink, faqs = [] }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://covertconvert.com/${slug}/">
  <link rel="stylesheet" href="/css/styles.css">

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
<body class="min-h-screen bg-gray-50 text-gray-900">
  <main class="container mx-auto px-4 py-8 max-w-2xl">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">${h1}</h1>
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
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
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
  </main>

  <footer class="text-center py-8 text-sm text-gray-500">
    <nav class="space-x-4">
      <a href="/" class="hover:text-gray-700">Home</a>
      <a href="/about/" class="hover:text-gray-700">About</a>
      <a href="/privacy/" class="hover:text-gray-700">Privacy</a>
      <a href="/how-it-works/" class="hover:text-gray-700">How It Works</a>
    </nav>
  </footer>

  <script type="module" src="/js/main.js"></script>
</body>
</html>`;
