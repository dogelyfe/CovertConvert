/**
 * Codec Loader Module
 * Lazy-loads WASM codecs for Tier 2 formats
 *
 * Architecture: Named exports, dynamic imports, module-scoped cache
 */

import { ERROR_TYPES } from '../errors.js';

// Codec URLs with SRI hashes for supply chain security
const CODEC_URLS = {
  heic: {
    url: 'https://cdn.jsdelivr.net/npm/libheif-js@1.18.0/libheif/libheif.js',
    integrity: 'sha384-ZtxS4OBdDAgj7qYhhHmg2NnUuFlkH3EHWi9kNuyCjAnLYR66JhAGUvdZe7gT+qG2',
  },
  avif: {
    url: 'https://cdn.jsdelivr.net/npm/@aspect-ratio/avif-decoder@0.2.0/avif-decoder.js',
    integrity: null, // Not used - native browser support preferred
  },
  tiff: {
    url: 'https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js',
    integrity: 'sha384-RyBmXHdfZ/Uon+ud+/AqSyWpUWnKYt2tkRG/P4gWoRUGDU+qIAV3tGBPNlYTBZEF',
  },
};

// Module-scoped codec cache
const loadedCodecs = new Map();
const loadingPromises = new Map();

/**
 * Check if a codec is already loaded
 * @param {string} format - Format name (heic, avif, tiff)
 * @returns {boolean}
 */
function isCodecLoaded(format) {
  return loadedCodecs.has(format);
}

// Script load timeout (matches JSZip timeout in downloader.js)
const SCRIPT_LOAD_TIMEOUT_MS = 10000;

/**
 * Load a script dynamically with timeout and SRI verification
 * @param {string} url - Script URL
 * @param {string|null} integrity - SRI hash (sha384-...) or null to skip
 * @param {number} timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns {Promise<void>}
 */
function loadScript(url, integrity = null, timeoutMs = SCRIPT_LOAD_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve();
      return;
    }

    // Set timeout for slow/blocked CDN
    const timeoutId = setTimeout(() => {
      reject(new Error('Codec load timed out. Please check your connection and try again.'));
    }, timeoutMs);

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    // Add SRI if provided
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = 'anonymous';
    }

    script.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to load codec. Please check your connection.`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Load HEIC codec (libheif-js)
 * @returns {Promise<object>}
 */
async function loadHeicCodec() {
  await loadScript(CODEC_URLS.heic.url, CODEC_URLS.heic.integrity);

  // libheif-js exposes global `libheif`
  if (typeof window.libheif === 'undefined') {
    throw new Error('libheif not available after script load');
  }

  return {
    name: 'heic',
    decode: async (file) => {
      const buffer = await file.arrayBuffer();
      const decoder = new window.libheif.HeifDecoder();
      const data = decoder.decode(new Uint8Array(buffer));

      if (!data || data.length === 0) {
        throw new Error('Failed to decode HEIC image');
      }

      // Get the first image
      const image = data[0];
      const width = image.get_width();
      const height = image.get_height();

      // Create ImageData from decoded pixels
      const imageData = new ImageData(width, height);
      await new Promise((resolve, reject) => {
        image.display(imageData, (displayData) => {
          if (displayData) {
            resolve(displayData);
          } else {
            reject(new Error('Failed to display HEIC image'));
          }
        });
      });

      return { imageData, width, height };
    },
  };
}

/**
 * Load AVIF codec
 * Note: Modern browsers support AVIF natively via Canvas
 * This is a fallback for older browsers
 * @returns {Promise<object>}
 */
async function loadAvifCodec() {
  // First check if browser supports AVIF natively
  const nativeSupport = await checkNativeAvifSupport();

  if (nativeSupport) {
    return {
      name: 'avif',
      native: true,
      decode: async (file) => {
        // Use native decoding via Image element
        const img = new Image();
        const url = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Failed to decode AVIF'));
          img.src = url;
        });

        URL.revokeObjectURL(url);

        // Create canvas and get ImageData
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        return {
          imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
          width: canvas.width,
          height: canvas.height,
        };
      },
    };
  }

  // Fallback: Browser doesn't support AVIF natively
  // Rather than load a complex WASM fallback for <7% of users,
  // provide a clear error message guiding them to update their browser
  return {
    name: 'avif',
    native: false,
    decode: async () => {
      throw new Error('Your browser doesn\'t support AVIF images. Please use Chrome 85+, Firefox 93+, Safari 16+, or Edge 85+.');
    },
  };
}

/**
 * Check native AVIF support
 * @returns {Promise<boolean>}
 */
async function checkNativeAvifSupport() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    // Tiny valid AVIF image (1x1 pixel)
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABpAQ0AIyExAAAAAP+j/AAAAQAAID';
  });
}

/**
 * Load TIFF codec (UTIF.js)
 * @returns {Promise<object>}
 */
async function loadTiffCodec() {
  await loadScript(CODEC_URLS.tiff.url, CODEC_URLS.tiff.integrity);

  // UTIF.js exposes global `UTIF`
  if (typeof window.UTIF === 'undefined') {
    throw new Error('UTIF not available after script load');
  }

  return {
    name: 'tiff',
    decode: async (file) => {
      const buffer = await file.arrayBuffer();
      const ifds = window.UTIF.decode(buffer);

      if (!ifds || ifds.length === 0) {
        throw new Error('Failed to decode TIFF image');
      }

      // Decode the first page
      window.UTIF.decodeImage(buffer, ifds[0]);
      const rgba = window.UTIF.toRGBA8(ifds[0]);

      const width = ifds[0].width;
      const height = ifds[0].height;

      // Create ImageData
      const imageData = new ImageData(new Uint8ClampedArray(rgba), width, height);

      return { imageData, width, height };
    },
  };
}

/**
 * Get codec for a format (loads if needed)
 * @param {string} format - Format name (heic, avif, tiff)
 * @returns {Promise<{ok: boolean, data?: object, error?: object}>}
 */
async function getCodec(format) {
  // Return cached codec if available
  if (loadedCodecs.has(format)) {
    return { ok: true, data: loadedCodecs.get(format) };
  }

  // Return existing loading promise if in progress
  if (loadingPromises.has(format)) {
    try {
      const codec = await loadingPromises.get(format);
      return { ok: true, data: codec };
    } catch (error) {
      return {
        ok: false,
        error: { type: ERROR_TYPES.CODEC_LOAD_FAILED, message: error.message },
      };
    }
  }

  // Start loading
  let loadPromise;
  switch (format) {
    case 'heic':
      loadPromise = loadHeicCodec();
      break;
    case 'avif':
      loadPromise = loadAvifCodec();
      break;
    case 'tiff':
      loadPromise = loadTiffCodec();
      break;
    default:
      return {
        ok: false,
        error: { type: ERROR_TYPES.UNSUPPORTED_FORMAT, message: `No codec for: ${format}` },
      };
  }

  loadingPromises.set(format, loadPromise);

  try {
    const codec = await loadPromise;
    loadedCodecs.set(format, codec);
    loadingPromises.delete(format);
    return { ok: true, data: codec };
  } catch (error) {
    loadingPromises.delete(format);
    console.error(`[CovertConvert] Codec load failed for ${format}:`, error);
    return {
      ok: false,
      error: {
        type: ERROR_TYPES.CODEC_LOAD_FAILED,
        message: error.message,
        format,
      },
    };
  }
}

/**
 * Preload a codec (non-blocking)
 * Used for connection-aware preloading
 * Failure is intentionally silent - actual use will retry with proper error handling
 * @param {string} format - Format to preload
 */
function preloadCodec(format) {
  if (!loadedCodecs.has(format) && !loadingPromises.has(format)) {
    getCodec(format).catch(() => {
      // Silent preload failure is intentional - will retry on actual use
    });
  }
}

/**
 * Check connection and preload HEIC if on fast connection
 * Called after DOMContentLoaded
 */
function initPreload() {
  // Check for fast connection (4g or better)
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isFastConnection = connection?.effectiveType === '4g' || !connection;

  if (isFastConnection) {
    preloadCodec('heic');
  }
}

// Named exports only (per architecture)
export {
  getCodec,
  isCodecLoaded,
  preloadCodec,
  initPreload,
  CODEC_URLS,
};
