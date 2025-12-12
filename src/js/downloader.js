/**
 * Downloader Module
 * Triggers file downloads (single direct download for now)
 *
 * Architecture: Named exports, Blob URL management
 */

// Success pause before auto-download (per UX spec)
const DOWNLOAD_DELAY_MS = 500;

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
 * Used for mobile or when ZIP is not needed
 * @param {Array} results - Array of conversion results
 * @param {number} delayMs - Delay between downloads
 */
async function downloadSequential(results, delayMs = 500) {
  for (let i = 0; i < results.length; i++) {
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    downloadBlob(results[i].blob, results[i].name);
  }
}

/**
 * Trigger download based on result count
 * Single file = direct download
 * Multiple files = sequential (ZIP in Story 2.3)
 *
 * @param {Array} results - Array of conversion results
 * @returns {Promise<void>}
 */
async function triggerDownload(results) {
  if (results.length === 0) {
    return;
  }

  if (results.length === 1) {
    // Single file: direct download with delay
    await downloadSingle(results[0]);
  } else {
    // Multiple files: sequential for now (ZIP in Epic 2)
    await downloadSequential(results);
  }
}

// Named exports only (per architecture)
export {
  downloadBlob,
  downloadSingle,
  downloadSequential,
  triggerDownload,
  DOWNLOAD_DELAY_MS,
};
