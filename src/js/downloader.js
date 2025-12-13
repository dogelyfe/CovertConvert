/**
 * Downloader Module
 * Triggers file downloads (single, ZIP, or sequential)
 *
 * Architecture: Named exports, Blob URL management, lazy JSZip loading
 * Platform-specific: Desktop = ZIP, Mobile = Sequential
 */

import {
  isMobileViewport,
  getMobileDownloadLimits,
  getDownloadStrategy,
} from './platform.js';

// Success pause before auto-download (per UX spec)
const DOWNLOAD_DELAY_MS = 500;

// Sequential download delay between files
const SEQUENTIAL_DELAY_MS = 500;

// JSZip CDN with SRI hash for supply chain security
const JSZIP_CDN = {
  url: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
  integrity: 'sha384-+mbV2IY1Zk/X1p/nWllGySJSUN8uMs+gUAN10Or95UBH0fpj6GfKgPmgC5EXieXG',
};

// Memory warning threshold (100MB total)
const MEMORY_WARNING_BYTES = 100 * 1024 * 1024;

// Module-scoped JSZip reference
let JSZip = null;
let jsZipLoading = null;

/**
 * Load JSZip library dynamically
 * @returns {Promise<void>}
 * @throws {Error} If JSZip fails to load
 */
async function loadJSZip() {
  // Already loaded
  if (JSZip) {
    return;
  }

  // Already loading - wait for it
  if (jsZipLoading) {
    return jsZipLoading;
  }

  jsZipLoading = new Promise((resolve, reject) => {
    // Check if already in DOM (e.g., loaded elsewhere)
    if (window.JSZip) {
      JSZip = window.JSZip;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = JSZIP_CDN.url;
    script.integrity = JSZIP_CDN.integrity;
    script.crossOrigin = 'anonymous';
    script.async = true;

    // Timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      reject(new Error('JSZip library load timed out. Please check your connection.'));
    }, 10000);

    script.onload = () => {
      clearTimeout(timeoutId);
      if (window.JSZip) {
        JSZip = window.JSZip;
        resolve();
      } else {
        reject(new Error('JSZip loaded but not available'));
      }
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('Failed to load ZIP library. Please check your connection and try again.'));
    };

    document.head.appendChild(script);
  });

  try {
    await jsZipLoading;
  } finally {
    jsZipLoading = null; // Reset so we can retry on failure
  }
}

/**
 * Trigger download for a single file
 * @param {Blob} blob - File blob to download
 * @param {string} filename - Name for the downloaded file
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke URL after download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download single converted file with delay
 * @param {object} result - Conversion result { blob, name }
 * @returns {Promise<void>}
 */
async function downloadSingle(result) {
  // Wait for success pause (per UX spec: 500ms)
  await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY_MS));

  downloadBlob(result.blob, result.name);
}

/**
 * Download multiple files sequentially
 * Used for mobile downloads
 * @param {Array} results - Array of conversion results
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<{ downloaded: number, message: string|null }>}
 */
async function downloadSequential(results, onProgress) {
  const limits = getMobileDownloadLimits(results.length);
  const toDownload = results.slice(0, limits.canDownload);

  // Initial delay before first download
  await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY_MS));

  for (let i = 0; i < toDownload.length; i++) {
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, SEQUENTIAL_DELAY_MS));
    }

    if (onProgress) {
      onProgress(i + 1, toDownload.length);
    }

    downloadBlob(toDownload[i].blob, toDownload[i].name);
  }

  return {
    downloaded: toDownload.length,
    message: limits.message,
  };
}

/**
 * Calculate total size of results
 * @param {Array} results - Array of conversion results { blob }
 * @returns {number} Total size in bytes
 */
function calculateTotalSize(results) {
  return results.reduce((sum, r) => sum + (r.blob?.size || 0), 0);
}

/**
 * Check if total size exceeds memory warning threshold
 * @param {Array} results - Array of conversion results
 * @returns {{ exceeds: boolean, totalMB: number }}
 */
function checkMemoryWarning(results) {
  const totalSize = calculateTotalSize(results);
  return {
    exceeds: totalSize > MEMORY_WARNING_BYTES,
    totalMB: Math.round(totalSize / (1024 * 1024)),
  };
}

/**
 * Create and download ZIP bundle
 * Used for desktop multi-file downloads
 * @param {Array} results - Array of conversion results { blob, name }
 * @param {Function} onProgress - Progress callback (percent: number)
 * @returns {Promise<void>}
 * @throws {Error} If JSZip fails to load or ZIP creation fails
 */
async function downloadAsZip(results, onProgress) {
  // Load JSZip if needed - this can throw
  await loadJSZip();

  // Create ZIP
  const zip = new JSZip();

  // Add files to ZIP
  for (const result of results) {
    zip.file(result.name, result.blob);
  }

  // Generate ZIP blob with progress callback
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      // metadata.percent is 0-100
      if (onProgress && metadata.percent !== undefined) {
        onProgress(metadata.percent);
      }
    }
  );

  // Wait for success pause
  await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY_MS));

  // Download ZIP
  downloadBlob(zipBlob, 'covertconvert-images.zip');
}

/**
 * Trigger download based on platform and result count
 * @param {Array} results - Array of conversion results
 * @param {object} callbacks - Callback functions
 * @param {Function} callbacks.onSequentialProgress - Progress callback for sequential downloads (current, total)
 * @param {Function} callbacks.onZipProgress - Progress callback for ZIP creation (percent)
 * @param {Function} callbacks.onMemoryWarning - Called if total size exceeds threshold (totalMB)
 * @returns {Promise<{ ok: boolean, type: string, downloaded: number, message: string|null, error?: string }>}
 */
async function triggerDownload(results, callbacks = {}) {
  const { onSequentialProgress, onZipProgress, onMemoryWarning } = callbacks;

  if (results.length === 0) {
    return { ok: true, type: 'none', downloaded: 0, message: null };
  }

  const strategy = getDownloadStrategy(results.length);

  // Single file download
  if (strategy.type === 'single') {
    try {
      await downloadSingle(results[0]);
      return { ok: true, type: 'single', downloaded: 1, message: null };
    } catch (error) {
      return { ok: false, type: 'single', downloaded: 0, message: null, error: error.message };
    }
  }

  // Sequential download (mobile)
  if (strategy.type === 'sequential') {
    try {
      const { downloaded, message } = await downloadSequential(results, onSequentialProgress);
      return { ok: true, type: 'sequential', downloaded, message };
    } catch (error) {
      return { ok: false, type: 'sequential', downloaded: 0, message: null, error: error.message };
    }
  }

  // ZIP download (desktop)
  try {
    // Check memory warning
    const memCheck = checkMemoryWarning(results);
    if (memCheck.exceeds && onMemoryWarning) {
      onMemoryWarning(memCheck.totalMB);
    }

    await downloadAsZip(results, onZipProgress);
    return { ok: true, type: 'zip', downloaded: results.length, message: null };
  } catch (error) {
    console.error('[CovertConvert] ZIP download failed:', error);
    return {
      ok: false,
      type: 'zip',
      downloaded: 0,
      message: null,
      error: error.message || 'Failed to create ZIP file',
    };
  }
}

// Named exports only (per architecture)
export {
  downloadBlob,
  downloadSingle,
  downloadSequential,
  downloadAsZip,
  triggerDownload,
  loadJSZip,
  calculateTotalSize,
  checkMemoryWarning,
  DOWNLOAD_DELAY_MS,
  SEQUENTIAL_DELAY_MS,
  MEMORY_WARNING_BYTES,
};
