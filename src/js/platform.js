/**
 * Platform Detection Module
 * Platform detection for downloads, touch, and memory
 *
 * Architecture: Named exports, unbundled detection per architecture
 * - Width-based for downloads
 * - Touch-based for copy actions
 * - CSS for ads (not in JS)
 */

// Breakpoint for mobile/desktop download behavior
const MOBILE_BREAKPOINT = 768;

// Mobile download limits (per UX spec)
const MOBILE_MAX_FILES = 10;
const MOBILE_WARNING_THRESHOLD = 6;

// Batch warnings (per FR28-FR29)
const BATCH_WARNING_THRESHOLD = 30;
const FILE_SIZE_WARNING_BYTES = 25 * 1024 * 1024; // 25MB

/**
 * Check if viewport is mobile-sized (for download behavior)
 * @returns {boolean}
 */
function isMobileViewport() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Check if device has touch support (for copy actions)
 * @returns {boolean}
 */
function hasTouch() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device memory if available (for memory warnings)
 * @returns {number|null} Memory in GB or null if unavailable
 */
function getDeviceMemory() {
  return navigator.deviceMemory || null;
}

/**
 * Check if batch exceeds warning threshold
 * @param {number} fileCount - Number of files in batch
 * @returns {boolean}
 */
function shouldWarnBatchSize(fileCount) {
  return fileCount > BATCH_WARNING_THRESHOLD;
}

/**
 * Check if file size exceeds warning threshold
 * @param {number} sizeBytes - File size in bytes
 * @returns {boolean}
 */
function shouldWarnFileSize(sizeBytes) {
  return sizeBytes > FILE_SIZE_WARNING_BYTES;
}

/**
 * Get mobile download limits and messages
 * @param {number} fileCount - Total files to download
 * @returns {{ canDownload: number, showWarning: boolean, message: string|null }}
 */
function getMobileDownloadLimits(fileCount) {
  if (fileCount <= 5) {
    // 1-5 files: download all, no warning
    return {
      canDownload: fileCount,
      showWarning: false,
      message: null,
    };
  }

  if (fileCount <= MOBILE_MAX_FILES) {
    // 6-10 files: download all, show warning
    return {
      canDownload: fileCount,
      showWarning: true,
      message: 'Large batches work better on desktop',
    };
  }

  // 11+ files: download first 10, show truncation message
  return {
    canDownload: MOBILE_MAX_FILES,
    showWarning: true,
    message: `Downloaded ${MOBILE_MAX_FILES} files. For more, continue on desktop`,
  };
}

/**
 * Get download strategy based on platform and file count
 * @param {number} fileCount - Number of files to download
 * @returns {{ type: 'single'|'zip'|'sequential', isMobile: boolean }}
 */
function getDownloadStrategy(fileCount) {
  const isMobile = isMobileViewport();

  if (fileCount === 1) {
    return { type: 'single', isMobile };
  }

  if (isMobile) {
    return { type: 'sequential', isMobile: true };
  }

  return { type: 'zip', isMobile: false };
}

// Named exports only (per architecture)
export {
  isMobileViewport,
  hasTouch,
  getDeviceMemory,
  shouldWarnBatchSize,
  shouldWarnFileSize,
  getMobileDownloadLimits,
  getDownloadStrategy,
  MOBILE_BREAKPOINT,
  MOBILE_MAX_FILES,
  MOBILE_WARNING_THRESHOLD,
  BATCH_WARNING_THRESHOLD,
  FILE_SIZE_WARNING_BYTES,
};
