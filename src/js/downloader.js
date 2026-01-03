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
  canShareFiles,
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
 * Share files using Web Share API (mobile)
 * Opens native share sheet allowing save to Photos, AirDrop, etc.
 * @param {Array} results - Array of conversion results { blob, name }
 * @returns {Promise<{ ok: boolean, shared: number, message: string|null }>}
 */
async function shareFiles(results) {
  // Convert blobs to File objects for sharing
  const files = results.map(result => {
    const mimeType = result.name.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return new File([result.blob], result.name, { type: mimeType });
  });

  // Wait for success pause
  await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY_MS));

  try {
    await navigator.share({
      files,
      title: files.length === 1 ? 'Converted Image' : `${files.length} Converted Images`,
    });

    return {
      ok: true,
      shared: files.length,
      message: null,
    };
  } catch (error) {
    // User cancelled share - not an error
    if (error.name === 'AbortError') {
      return {
        ok: true,
        shared: 0,
        message: 'Share cancelled',
      };
    }

    // Actual error - fall back to download
    console.warn('[CovertConvert] Share failed, falling back to download:', error);
    return {
      ok: false,
      shared: 0,
      message: error.message,
    };
  }
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
 * On mobile with Web Share support, uses native share sheet for saving to Photos
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

  // On mobile, try Web Share API first (enables save to Photos)
  if (strategy.isMobile && canShareFiles()) {
    const shareResult = await shareFiles(results);

    if (shareResult.ok) {
      return {
        ok: true,
        type: 'share',
        downloaded: shareResult.shared,
        message: shareResult.message,
      };
    }

    // Share failed - fall through to regular download
    console.log('[CovertConvert] Share failed, falling back to download');
  }

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
  shareFiles,
  triggerDownload,
  loadJSZip,
  calculateTotalSize,
  checkMemoryWarning,
  DOWNLOAD_DELAY_MS,
  SEQUENTIAL_DELAY_MS,
  MEMORY_WARNING_BYTES,
};
