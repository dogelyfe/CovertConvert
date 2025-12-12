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

// JSZip CDN URL - lazy loaded only when needed
const JSZIP_CDN_URL = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';

// Module-scoped JSZip reference
let JSZip = null;
let jsZipLoading = null;

/**
 * Load JSZip library dynamically
 * @returns {Promise<void>}
 */
async function loadJSZip() {
  // Already loaded
  if (JSZip) {
    return;
  }

  // Already loading
  if (jsZipLoading) {
    return jsZipLoading;
  }

  jsZipLoading = new Promise((resolve, reject) => {
    // Check if already in DOM
    if (window.JSZip) {
      JSZip = window.JSZip;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = JSZIP_CDN_URL;
    script.async = true;

    script.onload = () => {
      JSZip = window.JSZip;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load JSZip library'));
    };

    document.head.appendChild(script);
  });

  return jsZipLoading;
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
 * Create and download ZIP bundle
 * Used for desktop multi-file downloads
 * @param {Array} results - Array of conversion results { blob, name }
 * @returns {Promise<void>}
 */
async function downloadAsZip(results) {
  // Load JSZip if needed
  await loadJSZip();

  // Create ZIP
  const zip = new JSZip();

  // Add files to ZIP
  for (const result of results) {
    zip.file(result.name, result.blob);
  }

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  // Wait for success pause
  await new Promise(resolve => setTimeout(resolve, DOWNLOAD_DELAY_MS));

  // Download ZIP
  downloadBlob(zipBlob, 'covertconvert-images.zip');
}

/**
 * Trigger download based on platform and result count
 * @param {Array} results - Array of conversion results
 * @param {Function} onProgress - Optional progress callback for sequential downloads
 * @returns {Promise<{ type: string, downloaded: number, message: string|null }>}
 */
async function triggerDownload(results, onProgress) {
  if (results.length === 0) {
    return { type: 'none', downloaded: 0, message: null };
  }

  const strategy = getDownloadStrategy(results.length);

  if (strategy.type === 'single') {
    await downloadSingle(results[0]);
    return { type: 'single', downloaded: 1, message: null };
  }

  if (strategy.type === 'sequential') {
    const { downloaded, message } = await downloadSequential(results, onProgress);
    return { type: 'sequential', downloaded, message };
  }

  // ZIP download for desktop
  await downloadAsZip(results);
  return { type: 'zip', downloaded: results.length, message: null };
}

// Named exports only (per architecture)
export {
  downloadBlob,
  downloadSingle,
  downloadSequential,
  downloadAsZip,
  triggerDownload,
  loadJSZip,
  DOWNLOAD_DELAY_MS,
  SEQUENTIAL_DELAY_MS,
};
