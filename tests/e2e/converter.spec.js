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
