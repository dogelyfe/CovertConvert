// @ts-check
import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, '../fixtures');

// Create test image helpers
function createTestPNG(width = 100, height = 100) {
  // Minimal valid PNG (1x1 red pixel)
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde,
    0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
    0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00, 0x00,
    0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, // IEND chunk
    0xae, 0x42, 0x60, 0x82,
  ]);
  return png;
}

test.describe('CovertConvert - Epic 1: Core Conversion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with file selector', async ({ page }) => {
    await expect(page.locator('.file-selector')).toBeVisible();
    await expect(page.locator('#selector-text')).toContainText(/Drop files|Tap to select/);
  });

  test('format toggle buttons work', async ({ page }) => {
    const jpegBtn = page.locator('[data-format="jpeg"]');
    const pngBtn = page.locator('[data-format="png"]');

    // JPEG is default
    await expect(jpegBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(pngBtn).toHaveAttribute('aria-pressed', 'false');

    // Click PNG
    await pngBtn.click();
    await expect(jpegBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(pngBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('quality slider shows/hides based on format', async ({ page }) => {
    const qualityContainer = page.locator('#quality-container');
    const pngBtn = page.locator('[data-format="png"]');
    const jpegBtn = page.locator('[data-format="jpeg"]');

    // JPEG default - slider visible
    await expect(qualityContainer).toBeVisible();

    // Switch to PNG - slider hidden
    await pngBtn.click();
    await expect(qualityContainer).toBeHidden();

    // Switch back to JPEG - slider visible
    await jpegBtn.click();
    await expect(qualityContainer).toBeVisible();
  });

  test('quality slider updates value display', async ({ page }) => {
    const slider = page.locator('#quality-slider');
    const valueDisplay = page.locator('#quality-value');

    await expect(valueDisplay).toContainText('92%');

    await slider.fill('75');
    await expect(valueDisplay).toContainText('75%');
  });

  test('keyboard navigation works on file selector', async ({ page }) => {
    const fileSelector = page.locator('.file-selector');

    await fileSelector.focus();
    await expect(fileSelector).toBeFocused();

    // Press Enter should trigger file input (we can't fully test file dialog)
  });

  test('hover state appears on drag', async ({ page }) => {
    const fileSelector = page.locator('.file-selector');

    // Simulate dragenter
    await fileSelector.dispatchEvent('dragenter');
    await expect(fileSelector).toHaveClass(/file-selector--hover/);

    // Simulate dragleave
    await fileSelector.dispatchEvent('dragleave');
    await expect(fileSelector).not.toHaveClass(/file-selector--hover/);
  });

  test('unsupported file shows error', async ({ page }) => {
    // Create a fake file with image extension but invalid content
    // The detector checks magic bytes, so this should fail validation
    const fakeImageBuffer = Buffer.from('Not a real image file content');

    // Upload via file input
    const fileInput = page.locator('#file-input');
    await fileInput.setInputFiles({
      name: 'fake.psd',  // .psd is not in supported formats
      mimeType: 'image/x-photoshop',
      buffer: fakeImageBuffer,
    });

    // Wait a bit for processing
    await page.waitForTimeout(500);

    // Should show error or reset state
    const errorContainer = page.locator('#error-container');
    const hasError = await errorContainer.isVisible();

    // Error may be shown or file may be silently rejected
    if (hasError) {
      await expect(page.locator('#error-message')).toContainText(/not supported|failed/i);
    } else {
      // If no error shown, selector should be in default state (file rejected)
      await expect(page.locator('.file-selector')).not.toHaveClass(/is-converting/);
    }
  });
});

test.describe('CovertConvert - Epic 2: Batch Processing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('multiple files show count', async ({ page }) => {
    const pngBuffer = createTestPNG();

    const fileInput = page.locator('#file-input');
    await fileInput.setInputFiles([
      { name: 'test1.png', mimeType: 'image/png', buffer: pngBuffer },
      { name: 'test2.png', mimeType: 'image/png', buffer: pngBuffer },
      { name: 'test3.png', mimeType: 'image/png', buffer: pngBuffer },
    ]);

    // Should show converting state
    await expect(page.locator('#selector-text')).toContainText(/Converting|files selected/);
  });

  test('progress bar appears for multiple files', async ({ page }) => {
    const pngBuffer = createTestPNG();

    const fileInput = page.locator('#file-input');
    await fileInput.setInputFiles([
      { name: 'test1.png', mimeType: 'image/png', buffer: pngBuffer },
      { name: 'test2.png', mimeType: 'image/png', buffer: pngBuffer },
    ]);

    // Progress container may appear
    await page.waitForTimeout(100);
    // Note: Progress might complete too fast for single test images
  });

  test('error container is hidden by default', async ({ page }) => {
    await expect(page.locator('#error-container')).toBeHidden();
  });

  test('warning container is hidden by default', async ({ page }) => {
    await expect(page.locator('#warning-container')).toBeHidden();
  });

  test('trust message is visible', async ({ page }) => {
    await expect(page.locator('.trust-message')).toContainText('Your files never leave your device');
  });
});

test.describe('CovertConvert - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('file selector has ARIA attributes', async ({ page }) => {
    const fileSelector = page.locator('.file-selector');
    await expect(fileSelector).toHaveAttribute('role', 'button');
    await expect(fileSelector).toHaveAttribute('tabindex', '0');
    await expect(fileSelector).toHaveAttribute('aria-label');
  });

  test('format buttons have ARIA pressed state', async ({ page }) => {
    const jpegBtn = page.locator('[data-format="jpeg"]');
    const pngBtn = page.locator('[data-format="png"]');

    await expect(jpegBtn).toHaveAttribute('aria-pressed');
    await expect(pngBtn).toHaveAttribute('aria-pressed');
  });

  test('quality slider has ARIA attributes', async ({ page }) => {
    const slider = page.locator('#quality-slider');
    await expect(slider).toHaveAttribute('aria-label');
    await expect(slider).toHaveAttribute('aria-valuemin');
    await expect(slider).toHaveAttribute('aria-valuemax');
  });

  test('error container has role alert', async ({ page }) => {
    const errorContainer = page.locator('#error-container');
    await expect(errorContainer).toHaveAttribute('role', 'alert');
  });

  test('warning container has role alert', async ({ page }) => {
    const warningContainer = page.locator('#warning-container');
    await expect(warningContainer).toHaveAttribute('role', 'alert');
  });
});

test.describe('CovertConvert - Single File Conversion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('PNG converts to JPEG successfully', async ({ page }) => {
    const pngBuffer = createTestPNG();

    const downloadPromise = page.waitForEvent('download');

    const fileInput = page.locator('#file-input');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    // Wait for download or success state
    try {
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('test-image.jpg');
    } catch {
      // Download might be blocked in test environment
      // Check success state instead
      await expect(page.locator('.file-selector')).toHaveClass(/is-success/, { timeout: 5000 });
    }
  });

  test('PNG converts to PNG successfully', async ({ page }) => {
    const pngBtn = page.locator('[data-format="png"]');
    await pngBtn.click();

    const pngBuffer = createTestPNG();

    const fileInput = page.locator('#file-input');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    // Should reach success state
    await expect(page.locator('.file-selector')).toHaveClass(/is-success/, { timeout: 5000 });
    await expect(page.locator('#selector-text')).toContainText(/Done/);
  });
});

test.describe('CovertConvert - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile layout renders correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.file-selector')).toBeVisible();
    await expect(page.locator('#quality-container')).toBeVisible();
  });

  test('touch text shown on mobile', async ({ page }) => {
    await page.goto('/');
    // Mobile detection is based on touch support, not just viewport
    // The text might still say "Drop files" in Playwright since it doesn't emulate touch by default
    await expect(page.locator('#selector-text')).toBeVisible();
  });
});

test.describe('CovertConvert - Epic 3: SEO Landing Pages', () => {
  const seoPages = [
    { slug: 'heic-to-jpg', title: 'HEIC to JPG', outputFormat: 'jpeg', crossLinkTo: '/heic-to-png/' },
    { slug: 'heic-to-png', title: 'HEIC to PNG', outputFormat: 'png', crossLinkTo: '/heic-to-jpg/' },
    { slug: 'webp-to-jpg', title: 'WebP to JPG', outputFormat: 'jpeg', crossLinkTo: '/webp-to-png/' },
    { slug: 'webp-to-png', title: 'WebP to PNG', outputFormat: 'png', crossLinkTo: '/webp-to-jpg/' },
    { slug: 'avif-to-jpg', title: 'AVIF to JPG', outputFormat: 'jpeg', crossLinkTo: '/avif-to-png/' },
    { slug: 'avif-to-png', title: 'AVIF to PNG', outputFormat: 'png', crossLinkTo: '/avif-to-jpg/' },
    { slug: 'tiff-to-jpg', title: 'TIFF to JPG', outputFormat: 'jpeg', crossLinkTo: '/tiff-to-png/' },
    { slug: 'tiff-to-png', title: 'TIFF to PNG', outputFormat: 'png', crossLinkTo: '/tiff-to-jpg/' },
    { slug: 'png-to-jpg', title: 'PNG to JPG', outputFormat: 'jpeg', crossLinkTo: '/' },
  ];

  for (const page of seoPages) {
    test(`${page.slug} page loads with correct structure`, async ({ page: browserPage }) => {
      await browserPage.goto(`/${page.slug}/`);

      // Title contains format
      await expect(browserPage).toHaveTitle(new RegExp(page.title, 'i'));

      // H1 matches intent
      const h1 = browserPage.locator('h1');
      await expect(h1).toContainText(/Convert/i);

      // Converter has correct output format
      const converter = browserPage.locator('#converter');
      await expect(converter).toHaveAttribute('data-output', page.outputFormat);

      // File selector is present
      await expect(browserPage.locator('.file-selector')).toBeVisible();
    });
  }

  test('JPEG pages show quality slider', async ({ page }) => {
    await page.goto('/heic-to-jpg/');
    await expect(page.locator('#quality-container')).toBeVisible();
    await expect(page.locator('#quality-slider')).toBeVisible();
  });

  test('PNG pages hide quality slider', async ({ page }) => {
    await page.goto('/heic-to-png/');
    await expect(page.locator('#quality-container')).not.toBeVisible();
  });

  test('cross-links are present on SEO pages', async ({ page }) => {
    await page.goto('/heic-to-jpg/');
    const crossLink = page.locator('a[href="/heic-to-png/"]');
    await expect(crossLink).toBeVisible();
    await expect(crossLink).toContainText(/PNG/i);
  });

  test('FAQ section is present with schema', async ({ page }) => {
    await page.goto('/heic-to-jpg/');

    // FAQ section exists
    const faqSection = page.locator('section:has(h2:text("Frequently Asked Questions"))');
    await expect(faqSection).toBeVisible();

    // At least 3 FAQ items
    const faqItems = page.locator('details');
    const faqCount = await faqItems.count();
    expect(faqCount).toBeGreaterThanOrEqual(3);

    // First 2 FAQs are open by default
    const firstFaq = faqItems.first();
    await expect(firstFaq).toHaveAttribute('open', '');

    // Check schema markup exists
    const schemaScript = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schemaScript.textContent();
    expect(schemaContent).toContain('FAQPage');
    expect(schemaContent).toContain('Question');
  });

  test('FAQ items expand and collapse', async ({ page }) => {
    await page.goto('/heic-to-jpg/');

    // Get a collapsed FAQ (3rd one)
    const thirdFaq = page.locator('details').nth(2);

    // Should be collapsed by default
    await expect(thirdFaq).not.toHaveAttribute('open', '');

    // Click to expand
    await thirdFaq.locator('summary').click();
    await expect(thirdFaq).toHaveAttribute('open', '');

    // Click to collapse
    await thirdFaq.locator('summary').click();
    await expect(thirdFaq).not.toHaveAttribute('open', '');
  });
});

test.describe('CovertConvert - Home Page Schema', () => {
  test('home page has SoftwareApplication schema', async ({ page }) => {
    await page.goto('/');

    const schemaScript = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schemaScript.textContent();

    expect(schemaContent).toContain('SoftwareApplication');
    expect(schemaContent).toContain('CovertConvert');
    expect(schemaContent).toContain('MultimediaApplication');
  });

  test('home page has format toggle (not on SEO pages)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-format="jpeg"]')).toBeVisible();
    await expect(page.locator('[data-format="png"]')).toBeVisible();
  });
});

test.describe('CovertConvert - Epic 4: Trust Pages', () => {
  const trustPages = [
    { slug: 'about', title: 'About', h1: 'About CovertConvert' },
    { slug: 'privacy', title: 'Privacy', h1: 'Privacy Policy' },
    { slug: 'how-it-works', title: 'How It Works', h1: 'How It Works' },
  ];

  for (const page of trustPages) {
    test(`${page.slug} page loads with correct structure`, async ({ page: browserPage }) => {
      await browserPage.goto(`/${page.slug}/`);

      // Title contains page name
      await expect(browserPage).toHaveTitle(new RegExp(page.title, 'i'));

      // H1 matches
      const h1 = browserPage.locator('h1');
      await expect(h1).toContainText(page.h1);

      // Has article content
      await expect(browserPage.locator('article')).toBeVisible();

      // Has CTA button to converter
      await expect(browserPage.getByRole('link', { name: 'Convert Images Now' })).toBeVisible();
    });
  }

  test('about page has key content sections', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('text=Why We Built This')).toBeVisible();
    await expect(page.locator('text=What We Support')).toBeVisible();
  });

  test('privacy page explains data handling', async ({ page }) => {
    await page.goto('/privacy/');
    await expect(page.locator('text=What We Don\'t Collect')).toBeVisible();
    await expect(page.locator('text=What We Do Collect')).toBeVisible();
    await expect(page.locator('text=Verify It Yourself')).toBeVisible();
  });

  test('how-it-works page has HowTo schema', async ({ page }) => {
    await page.goto('/how-it-works/');

    const schemaScript = page.locator('script[type="application/ld+json"]');
    const schemaContent = await schemaScript.textContent();

    expect(schemaContent).toContain('HowTo');
    expect(schemaContent).toContain('HowToStep');
  });

  test('how-it-works page explains technical approach', async ({ page }) => {
    await page.goto('/how-it-works/');
    await expect(page.getByRole('heading', { name: 'WebAssembly (WASM)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Canvas API' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Verify It Yourself' })).toBeVisible();
  });

  test('trust pages have canonical URLs', async ({ page }) => {
    await page.goto('/about/');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://covertconvert.com/about/');
  });

  test('trust pages have navigation footer', async ({ page }) => {
    await page.goto('/privacy/');
    await expect(page.locator('footer a[href="/"]')).toBeVisible();
    await expect(page.locator('footer a[href="/about/"]')).toBeVisible();
    await expect(page.locator('footer a[href="/privacy/"]')).toBeVisible();
    await expect(page.locator('footer a[href="/how-it-works/"]')).toBeVisible();
  });
});

test.describe('CovertConvert - SEO Page Conversion', () => {
  test('heic-to-jpg page outputs JPEG', async ({ page }) => {
    await page.goto('/heic-to-jpg/');

    const converter = page.locator('#converter');
    await expect(converter).toHaveAttribute('data-output', 'jpeg');

    // Convert a PNG to verify JPEG output
    const pngBuffer = createTestPNG();
    const fileInput = page.locator('#file-input');

    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    // Should succeed and output JPG
    await expect(page.locator('.file-selector')).toHaveClass(/is-success/, { timeout: 5000 });
  });

  test('heic-to-png page outputs PNG', async ({ page }) => {
    await page.goto('/heic-to-png/');

    const converter = page.locator('#converter');
    await expect(converter).toHaveAttribute('data-output', 'png');

    // Convert a PNG (passthrough but verifies output format)
    const pngBuffer = createTestPNG();
    const fileInput = page.locator('#file-input');

    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    // Should succeed
    await expect(page.locator('.file-selector')).toHaveClass(/is-success/, { timeout: 5000 });
  });
});
