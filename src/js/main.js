/**
 * CovertConvert - Main Entry Point
 * DOM initialization, event binding, and application logic
 *
 * Architecture: main.js handles logic/events, ui.js handles display
 */

import { validateFiles } from './detector.js';
import { getUserMessage, getErrorGuidance, ERROR_TYPES } from './errors.js';
import { setFiles, setOutputFormat, setQuality, convertAll, resetState, getConvertedCanvas } from './converter.js';
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

// Import optimizer (Epic 6)
import { optimizeToSize } from './optimizer.js';

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
  // Epic 6 UI functions
  toggleAdvancedOptions,
  getTargetFilesize,
  syncTargetFilesize,
  getLockStates,
  enforceLockExclusivity,
  isLogEnabled,
  showQueuedState,
  hideQueuedState,
  isManualStartMode,
  openLog,
  closeLog,
  clearLog,
  addLogEntry,
  updateLogSummary,
  saveAdvancedSettings,
  loadAdvancedSettings,
} from './ui.js';

// State (logic state - UI state handled by ui.js)
let state = {
  outputFormat: 'jpeg',
  quality: 0.92,
  files: [],
  validatedFiles: [],
  status: 'idle',
  warningDismissed: false,
  // Epic 6: Queue for manual start mode
  queuedFiles: [],
  queuedValidated: [],
  // Epic 6: Log stats
  logStats: { total: 0, onTarget: 0, bestEffort: 0 },
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

  // Load saved advanced settings (Epic 6)
  loadAdvancedSettings();

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

  // === Epic 6: Advanced options event bindings ===

  // Advanced options toggle
  elements.advancedToggle?.addEventListener('click', () => {
    toggleAdvancedOptions();
  });

  // Target filesize slider
  elements.targetFilesizeSlider?.addEventListener('input', (e) => {
    syncTargetFilesize(parseInt(e.target.value, 10), 'slider');
    saveAdvancedSettings();
  });

  // Target filesize input
  elements.targetFilesizeInput?.addEventListener('change', (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      syncTargetFilesize(value, 'input');
    }
    saveAdvancedSettings();
  });

  // Lock quality checkbox
  elements.lockQuality?.addEventListener('change', (e) => {
    if (e.target.checked) {
      enforceLockExclusivity('quality');
    }
    saveAdvancedSettings();
  });

  // Lock dimensions checkbox
  elements.lockDimensions?.addEventListener('change', (e) => {
    if (e.target.checked) {
      enforceLockExclusivity('dimensions');
    }
    saveAdvancedSettings();
  });

  // Show log checkbox
  elements.showLog?.addEventListener('change', () => {
    saveAdvancedSettings();
  });

  // Convert button (manual start)
  elements.convertButton?.addEventListener('click', handleConvertClick);

  // Log close button
  elements.logClose?.addEventListener('click', () => {
    closeLog();
  });
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
 * Process selected files - validate, warn, convert (or queue), and download
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

  // Epic 6: Check if in manual start mode (target filesize is set)
  if (isManualStartMode()) {
    // Add to queue instead of auto-converting
    state.queuedFiles = [...state.queuedFiles, ...valid.map(v => v.file)];
    state.queuedValidated = [...state.queuedValidated, ...valid];
    showQueuedState(state.queuedValidated.length);
    return;
  }

  // Start conversion (auto-start mode)
  await startConversion(valid);
}

/**
 * Handle convert button click (Epic 6 - Manual Start)
 */
async function handleConvertClick() {
  if (state.queuedValidated.length === 0) return;

  // Move queued files to active state
  state.validatedFiles = state.queuedValidated;
  state.files = state.queuedFiles;

  // Clear queue
  state.queuedFiles = [];
  state.queuedValidated = [];

  // Hide queued state
  hideQueuedState();

  // Start conversion
  await startConversion(state.validatedFiles);
}

/**
 * Start the conversion process
 */
async function startConversion(validatedFiles) {
  const total = validatedFiles.length;
  const targetBytes = getTargetFilesize();
  const hasTarget = targetBytes > 0;
  const showLogPanel = isLogEnabled();

  // Epic 6: Reset log stats and clear log
  state.logStats = { total: 0, onTarget: 0, bestEffort: 0 };
  if (showLogPanel) {
    clearLog();
    openLog();
  }

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

  // Epic 6: If we have a target filesize, use optimized conversion
  let result;
  if (hasTarget) {
    result = await convertWithOptimization(validatedFiles, targetBytes, startTime, showLogPanel);
  } else {
    // Standard conversion without optimization
    result = await convertAll((current, total, fileResult) => {
      // Only show progress if conversion takes > 500ms
      if (Date.now() - startTime > 500) {
        updateProgress(current, total);
      }

      // Epic 6: Add to log if enabled (no target)
      if (showLogPanel && fileResult?.ok) {
        const inputName = fileResult.originalName || `file_${current}`;
        const outputName = fileResult.name;
        const sizeBytes = fileResult.blob?.size || 0;
        addLogEntry(inputName, outputName, sizeBytes, null, true);
        state.logStats.total++;
      }
    });
  }

  // Calculate conversion duration
  const durationMs = Date.now() - startTime;

  // Update log summary if enabled
  if (showLogPanel) {
    updateLogSummary(state.logStats.total, state.logStats.onTarget, state.logStats.bestEffort);
  }

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
 * Epic 6: Convert files with filesize optimization
 */
async function convertWithOptimization(validatedFiles, targetBytes, startTime, showLogPanel) {
  const { lockQuality, lockDimensions } = getLockStates();
  const format = state.outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
  const successful = [];
  const failed = [];
  const total = validatedFiles.length;

  for (let i = 0; i < validatedFiles.length; i++) {
    const validated = validatedFiles[i];
    const current = i + 1;

    // Update progress UI
    showConverting(current, total);
    if (Date.now() - startTime > 500) {
      updateProgress(current, total);
    }

    try {
      // First, decode the image to canvas using the existing converter
      const canvas = await getConvertedCanvas(validated);

      if (!canvas) {
        failed.push({
          file: validated.file,
          error: { type: ERROR_TYPES.DECODE_FAILED },
        });
        continue;
      }

      // Run optimization
      const optimized = await optimizeToSize(canvas, {
        targetBytes,
        format,
        initialQuality: state.quality,
        lockQuality,
        lockDimensions,
      });

      // Create result object
      const baseName = validated.file.name.replace(/\.[^.]+$/, '');
      const ext = state.outputFormat === 'jpeg' ? 'jpg' : 'png';
      const outputName = `${baseName}.${ext}`;

      const fileResult = {
        name: outputName,
        originalName: validated.file.name,
        blob: optimized.blob,
        ok: true,
      };

      successful.push(fileResult);

      // Update log stats and add entry
      state.logStats.total++;
      if (optimized.hitTarget) {
        state.logStats.onTarget++;
      } else {
        state.logStats.bestEffort++;
      }

      if (showLogPanel) {
        addLogEntry(
          validated.file.name,
          outputName,
          optimized.blob.size,
          targetBytes,
          optimized.hitTarget
        );
      }
    } catch (error) {
      console.error(`[CovertConvert] Optimization failed for ${validated.file.name}:`, error);
      failed.push({
        file: validated.file,
        error: { type: ERROR_TYPES.DECODE_FAILED },
      });
    }
  }

  return {
    ok: successful.length > 0,
    data: {
      successful,
      failed,
      successCount: successful.length,
      failCount: failed.length,
      total,
    },
  };
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

  // Epic 6: Hide queued state and log
  hideQueuedState();
  closeLog();

  // Reset converter state
  resetState();

  // Reset local state
  state.files = [];
  state.validatedFiles = [];
  state.status = 'idle';
  state.warningDismissed = false;
  // Epic 6: Clear queue
  state.queuedFiles = [];
  state.queuedValidated = [];
  state.logStats = { total: 0, onTarget: 0, bestEffort: 0 };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { init, state, resetToDefault };
