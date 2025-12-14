/**
 * CovertConvert - Main Entry Point
 * DOM initialization, event binding, and application logic
 *
 * Architecture: main.js handles logic/events, ui.js handles display
 */

import { validateFiles } from './detector.js';
import { getUserMessage, getErrorGuidance, ERROR_TYPES } from './errors.js';
import { setFiles, setOutputFormat, setQuality, convertAll, resetState } from './converter.js';
import { triggerDownload } from './downloader.js';
import { initPreload } from './codecs/loader.js';
import { shouldWarnBatchSize, shouldWarnFileSize } from './platform.js';
import {
  trackFileSelected,
  trackConversionStarted,
  trackConversionCompleted,
  trackConversionError,
  trackBatchErrors,
  trackDownloadTriggered,
} from './analytics.js';

// Import UI functions - single source of truth for DOM manipulation
import {
  initUI,
  getElements,
  showFileCount,
  showConverting,
  showSuccess,
  showPartialSuccess,
  setHoverState,
  resetUI,
  updateSelectorTextForTouch,
  updateProgress,
  showDownloading,
  showZipProgress,
  showError,
  hideError,
  showWarning,
  hideWarning,
  showInfo,
  updateQualityDisplay,
  setQualityVisibility,
  updateFormatButtons,
} from './ui.js';

// State (logic state - UI state handled by ui.js)
let state = {
  outputFormat: 'jpeg',
  quality: 0.92,
  files: [],
  validatedFiles: [],
  status: 'idle',
  warningDismissed: false,
};

/**
 * Initialize the application
 */
function init() {
  // Initialize UI and get elements
  const elements = initUI();

  if (!elements.fileSelector) {
    console.warn('[CovertConvert] File selector not found');
    return;
  }

  // Read output format from data attribute (SEO pages)
  const dataOutput = elements.converter?.dataset.output;
  if (dataOutput) {
    state.outputFormat = dataOutput;
  }

  // Bind events
  bindEvents(elements);

  // Update UI for touch devices
  updateSelectorTextForTouch();

  // Update quality slider visibility
  setQualityVisibility(state.outputFormat === 'jpeg');

  // Preload HEIC codec on fast connections
  initPreload();
}

/**
 * Bind all event listeners
 * @param {object} elements - Cached DOM elements from ui.js
 */
function bindEvents(elements) {
  // File input change
  elements.fileInput?.addEventListener('change', handleFileSelect);

  // Drag and drop
  elements.fileSelector?.addEventListener('dragenter', handleDragEnter);
  elements.fileSelector?.addEventListener('dragover', handleDragOver);
  elements.fileSelector?.addEventListener('dragleave', handleDragLeave);
  elements.fileSelector?.addEventListener('drop', handleDrop);

  // Click to open file picker
  elements.fileSelector?.addEventListener('click', () => elements.fileInput?.click());

  // Keyboard accessibility
  elements.fileSelector?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      elements.fileInput?.click();
    }
  });

  // Format toggle buttons (home page only)
  elements.formatButtons?.forEach(btn => {
    btn.addEventListener('click', () => handleFormatChange(btn.dataset.format));
  });

  // Quality slider
  elements.qualitySlider?.addEventListener('input', handleQualityChange);

  // Warning dismiss button
  elements.warningDismiss?.addEventListener('click', dismissWarning);
}

/**
 * Handle file selection from input
 */
async function handleFileSelect(e) {
  const files = Array.from(e.target.files || []);
  if (files.length > 0) {
    await processFiles(files);
  }
}

/**
 * Process selected files - validate, warn, convert, and download
 */
async function processFiles(files) {
  // Reset state for new batch
  state.warningDismissed = false;
  hideWarning();
  hideError();

  // Immediate visual feedback (< 100ms per AC)
  showFileCount(files.length);

  // Check for batch size warning (FR28)
  if (shouldWarnBatchSize(files.length)) {
    showWarning(`Large batch (${files.length} files) — this may take a moment.`);
  }

  // Check for large file warning (FR29)
  const largeFiles = files.filter(f => shouldWarnFileSize(f.size));
  if (largeFiles.length > 0 && !shouldWarnBatchSize(files.length)) {
    const sizeMB = Math.round(largeFiles[0].size / (1024 * 1024));
    showWarning(`Large file (${sizeMB}MB) — conversion may take longer.`);
  }

  // Validate all files
  const { valid, invalid } = await validateFiles(files);

  // Track file selection (Story 5.1)
  const formats = valid.map(v => v.format);
  trackFileSelected(valid.length, formats);

  // Show error for invalid files
  if (invalid.length > 0) {
    const firstError = invalid[0];
    const message = getUserMessage(firstError.type);
    const guidance = getErrorGuidance(firstError.type);
    showError(message, guidance);

    // If ALL files are invalid, reset state
    if (valid.length === 0) {
      resetToDefault();
      return;
    }
  }

  // Store valid files for conversion
  state.files = valid.map(v => v.file);
  state.validatedFiles = valid;

  // Update UI with valid file count (if different from original)
  if (valid.length !== files.length) {
    showFileCount(valid.length);
  }

  // Start conversion
  await startConversion(valid);
}

/**
 * Start the conversion process
 */
async function startConversion(validatedFiles) {
  const total = validatedFiles.length;

  // Update UI to converting state
  showConverting(1, total);

  // Set up converter
  setFiles(validatedFiles);
  setOutputFormat(state.outputFormat);
  setQuality(state.quality);

  // Track conversion start time for progress threshold
  const startTime = Date.now();

  // Track conversion started (Story 5.1)
  trackConversionStarted(total, state.outputFormat);

  // Run conversion with progress callback
  const result = await convertAll((current, total, fileResult) => {
    // Only show progress if conversion takes > 500ms
    if (Date.now() - startTime > 500) {
      updateProgress(current, total);
    }
  });

  // Calculate conversion duration
  const durationMs = Date.now() - startTime;

  if (result.ok) {
    const { successful, failed, successCount, failCount } = result.data;

    // Track conversion completed (Story 5.1)
    trackConversionCompleted(successCount, durationMs, state.outputFormat);

    // Track any conversion errors (aggregated to avoid flooding GA4)
    if (failed.length > 0) {
      trackBatchErrors(failed);
    }

    if (failCount > 0 && successCount > 0) {
      // Partial success (Story 2.5)
      showPartialSuccess(successCount, result.data.total);
    } else {
      // Full success
      showSuccess(successCount);
    }

    // Trigger download with callbacks
    if (successful.length > 0) {
      const downloadResult = await triggerDownload(successful, {
        // Sequential download progress (mobile)
        onSequentialProgress: (current, dlTotal) => {
          showDownloading(current, dlTotal);
        },
        // ZIP creation progress (desktop)
        onZipProgress: (percent) => {
          showZipProgress(percent);
        },
        // Memory warning for large ZIPs
        onMemoryWarning: (totalMB) => {
          showWarning(`Large download (${totalMB}MB) — this may slow your browser.`);
        },
      });

      // Handle download result
      if (!downloadResult.ok) {
        // Download failed - show error
        showError(
          downloadResult.error || 'Download failed',
          'Please try again or use a smaller batch.'
        );
        console.error('[CovertConvert] Download failed:', downloadResult.error);
      } else if (downloadResult.message) {
        // Show info message (e.g., mobile limits)
        showInfo(downloadResult.message);
      }

      // Track download triggered (Story 5.1)
      if (downloadResult.ok) {
        trackDownloadTriggered(downloadResult.type || 'single', successful.length);
      }
    }

    // Show any conversion errors (after download completes)
    if (failed.length > 0) {
      const firstFailed = failed[0];
      const message = getUserMessage(firstFailed.error.type);
      const guidance = getErrorGuidance(firstFailed.error.type);
      showError(message, guidance);
    }
  } else {
    // All failed - track error
    trackConversionError(ERROR_TYPES.DECODE_FAILED, 'batch');

    const message = getUserMessage(ERROR_TYPES.DECODE_FAILED);
    const guidance = getErrorGuidance(ERROR_TYPES.DECODE_FAILED);
    showError(message, guidance);
  }
}

/**
 * Handle drag enter
 */
function handleDragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
  setHoverState(true);
}

/**
 * Handle drag over
 */
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  setHoverState(true);
}

/**
 * Handle drag leave
 */
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  setHoverState(false);
}

/**
 * Handle file drop
 */
async function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  setHoverState(false);

  const files = Array.from(e.dataTransfer?.files || []);
  if (files.length > 0) {
    await processFiles(files);
  }
}

/**
 * Handle format toggle (home page)
 */
function handleFormatChange(format) {
  state.outputFormat = format;

  // Update button states via ui.js
  updateFormatButtons(format);

  // Update quality slider visibility (Story 1.7)
  setQualityVisibility(format === 'jpeg');
}

/**
 * Handle quality slider change (Story 1.7)
 */
function handleQualityChange(e) {
  const value = parseInt(e.target.value, 10);
  state.quality = value / 100;

  // Update display via ui.js (includes aria-valuenow fix)
  updateQualityDisplay(value);
}

/**
 * Dismiss warning (FR30)
 */
function dismissWarning() {
  state.warningDismissed = true;
  hideWarning();
}

/**
 * Reset to default state (Story 2.7)
 */
function resetToDefault() {
  // Reset UI via ui.js
  resetUI();

  // Reset converter state
  resetState();

  // Reset local state
  state.files = [];
  state.validatedFiles = [];
  state.status = 'idle';
  state.warningDismissed = false;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { init, state, resetToDefault };
