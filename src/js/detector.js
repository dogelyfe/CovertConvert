/**
 * Format Detection Module
 * Detects image format from file signature (magic bytes) with extension fallback
 *
 * Architecture: Named exports only, Result objects { ok, data, error }
 */

// Magic byte signatures for supported formats
const SIGNATURES = {
  // HEIC/HEIF - ftyp box with heic, heix, hevc, hevx, heim, heis, mif1
  heic: [
    [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63], // ftyp heic
    [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x78], // ftyp heix
    [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x69, 0x66, 0x31], // ftyp mif1
    [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70, 0x4D, 0x53, 0x46, 0x31], // ftyp MSF1
  ],
  // AVIF - ftyp box with avif
  avif: [
    [0x00, 0x00, 0x00, null, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66], // ftyp avif
  ],
  // PNG - 89 50 4E 47 0D 0A 1A 0A
  png: [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  ],
  // JPEG - FF D8 FF
  jpeg: [
    [0xFF, 0xD8, 0xFF],
  ],
  // WebP - RIFF....WEBP
  webp: [
    [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50],
  ],
  // GIF - GIF87a or GIF89a
  gif: [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], // GIF87a
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], // GIF89a
  ],
  // BMP - BM
  bmp: [
    [0x42, 0x4D],
  ],
  // TIFF - II (little-endian) or MM (big-endian)
  tiff: [
    [0x49, 0x49, 0x2A, 0x00], // Little-endian
    [0x4D, 0x4D, 0x00, 0x2A], // Big-endian
  ],
};

// Supported INPUT formats (Tier 1 = Canvas, Tier 2 = WASM)
const SUPPORTED_FORMATS = {
  // Tier 1: Canvas API (no WASM needed)
  jpeg: { tier: 1, mime: 'image/jpeg', extensions: ['.jpg', '.jpeg', '.jpe'] },
  png: { tier: 1, mime: 'image/png', extensions: ['.png'] },
  webp: { tier: 1, mime: 'image/webp', extensions: ['.webp'] },
  gif: { tier: 1, mime: 'image/gif', extensions: ['.gif'] },
  bmp: { tier: 1, mime: 'image/bmp', extensions: ['.bmp', '.dib'] },
  // Tier 2: WASM codecs required
  heic: { tier: 2, mime: 'image/heic', extensions: ['.heic', '.heif'] },
  avif: { tier: 2, mime: 'image/avif', extensions: ['.avif'] },
  tiff: { tier: 2, mime: 'image/tiff', extensions: ['.tiff', '.tif'] },
};

// Output formats
const OUTPUT_FORMATS = ['jpeg', 'png'];

/**
 * Check if bytes match a signature pattern
 * null in pattern = wildcard (any byte matches)
 */
function matchesSignature(bytes, pattern) {
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] !== null && bytes[i] !== pattern[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Detect format from file signature (magic bytes)
 * @param {ArrayBuffer} buffer - First 16+ bytes of file
 * @returns {string|null} Format name or null if not detected
 */
function detectFromSignature(buffer) {
  const bytes = new Uint8Array(buffer);

  for (const [format, patterns] of Object.entries(SIGNATURES)) {
    for (const pattern of patterns) {
      if (bytes.length >= pattern.length && matchesSignature(bytes, pattern)) {
        return format;
      }
    }
  }

  return null;
}

/**
 * Detect format from file extension
 * @param {string} filename - File name with extension
 * @returns {string|null} Format name or null if not recognized
 */
function detectFromExtension(filename) {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();

  for (const [format, info] of Object.entries(SUPPORTED_FORMATS)) {
    if (info.extensions.includes(ext)) {
      return format;
    }
  }

  return null;
}

/**
 * Read first N bytes of a file
 * @param {File} file - File object
 * @param {number} bytes - Number of bytes to read
 * @returns {Promise<ArrayBuffer>}
 */
async function readFileHeader(file, bytes = 16) {
  const slice = file.slice(0, bytes);
  return slice.arrayBuffer();
}

/**
 * Detect format from a File object
 * Uses signature detection first, falls back to extension
 *
 * @param {File} file - File object to detect
 * @returns {Promise<{ok: boolean, data?: object, error?: object}>} Result object
 */
async function detectFormat(file) {
  try {
    // Read file header for signature detection
    const header = await readFileHeader(file, 16);

    // Try signature detection first (more reliable)
    let format = detectFromSignature(header);
    let detectionMethod = 'signature';

    // Fall back to extension if signature not recognized
    if (!format) {
      format = detectFromExtension(file.name);
      detectionMethod = 'extension';
    }

    // If still not detected, it's unsupported
    if (!format) {
      return {
        ok: false,
        error: {
          type: 'unsupported_format',
          message: "This file type isn't supported.",
          file: file.name,
          supportedFormats: Object.keys(SUPPORTED_FORMATS),
        },
      };
    }

    // Check if it's a supported input format
    const formatInfo = SUPPORTED_FORMATS[format];
    if (!formatInfo) {
      return {
        ok: false,
        error: {
          type: 'unsupported_format',
          message: "This file type isn't supported.",
          file: file.name,
          detectedFormat: format,
          supportedFormats: Object.keys(SUPPORTED_FORMATS),
        },
      };
    }

    return {
      ok: true,
      data: {
        format,
        tier: formatInfo.tier,
        mime: formatInfo.mime,
        detectionMethod,
        fileName: file.name,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        type: 'detection_failed',
        message: "Couldn't read this file.",
        file: file.name,
        originalError: error.message,
      },
    };
  }
}

/**
 * Validate a batch of files
 * @param {File[]} files - Array of File objects
 * @returns {Promise<{valid: object[], invalid: object[]}>}
 */
async function validateFiles(files) {
  const results = await Promise.all(files.map(detectFormat));

  const valid = [];
  const invalid = [];

  results.forEach((result, index) => {
    if (result.ok) {
      valid.push({ file: files[index], ...result.data });
    } else {
      invalid.push({ file: files[index], ...result.error });
    }
  });

  return { valid, invalid };
}

/**
 * Check if a format is supported
 * @param {string} format - Format name
 * @returns {boolean}
 */
function isSupported(format) {
  return format in SUPPORTED_FORMATS;
}

/**
 * Get format info
 * @param {string} format - Format name
 * @returns {object|null}
 */
function getFormatInfo(format) {
  return SUPPORTED_FORMATS[format] || null;
}

/**
 * Get list of supported format names
 * @returns {string[]}
 */
function getSupportedFormats() {
  return Object.keys(SUPPORTED_FORMATS);
}

/**
 * Get human-readable supported formats string
 * @returns {string}
 */
function getSupportedFormatsString() {
  const formats = Object.keys(SUPPORTED_FORMATS).map(f => f.toUpperCase());
  return formats.join(', ');
}

// Named exports only (per architecture)
export {
  detectFormat,
  detectFromSignature,
  detectFromExtension,
  validateFiles,
  isSupported,
  getFormatInfo,
  getSupportedFormats,
  getSupportedFormatsString,
  SUPPORTED_FORMATS,
  OUTPUT_FORMATS,
};
