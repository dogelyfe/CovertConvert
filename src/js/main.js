/**
 * CovertConvert - Main Entry Point
 * DOM initialization and event binding
 *
 * Epic 2: Batch Processing & Platform Downloads
 */

import { validateFiles, getSupportedFormatsString } from './detector.js';
import { getUserMessage, getErrorGuidance, ERROR_TYPES } from './errors.js';
import { setFiles, setOutputFormat, setQuality, convertAll, resetState } from './converter.js';
import { triggerDownload } from './downloader.js';
import { initPreload } from './codecs/loader.js';
import {
  shouldWarnBatchSize,
  shouldWarnFileSize,
  FILE_SIZE_WARNING_BYTES,
  BATCH_WARNING_THRESHOLD,
} from './platform.js';

// Cache DOM elements at module load (per architecture pattern)
const elements = {
  fileInput: document.querySelector('#file-input'),
  fileSelector: document.querySelector('.file-selector'),
  selectorText: document.querySelector('#selector-text'),
  progressContainer: document.querySelector('#progress-container'),
  progressFill: document.querySelector('.progress-batch__fill'),
  progressText: document.querySelector('#progress-text'),
  formatButtons: document.querySelectorAll('[data-format]'),
  converter: document.querySelector('#converter'),
  errorContainer: document.querySelector('#error-container'),
  errorMessage: document.querySelector('#error-message'),
  errorGuidance: document.querySelector('#error-guidance'),
  warningContainer: document.querySelector('#warning-container'),
  warningMessage: document.querySelector('#warning-message'),
  warningDismiss: document.querySelector('#warning-dismiss'),
  qualitySlider: document.querySelector('#quality-slider'),
  qualityValue: document.querySelector('#quality-value'),
  qualityContainer: document.querySelector('#quality-container'),
};

// State
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
  bindEvents();

  // Update UI for touch devices
  updateSelectorText();

  // Update quality slider visibility
  updateQualityVisibility();

  // Preload HEIC codec on fast connections
  initPreload();

  console.log('[CovertConvert] Initialized', { outputFormat: state.outputFormat });
}

/**
 * Bind all event listeners
 */
function bindEvents() {
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
  showActiveState(files.length);

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

  console.log('[CovertConvert] Validation complete:', {
    valid: valid.length,
    invalid: invalid.length,
    formats: valid.map(v => v.format),
  });

  // Show error for invalid files
  if (invalid.length > 0) {
    const firstError = invalid[0];
    showError(firstError.type, firstError.file);

    // If ALL files are invalid, reset state
    if (valid.length === 0) {
      resetToDefault();
      return;
    }
  }

  // Store valid files for conversion
  state.files = valid.map(v => v.file);
  state.validatedFiles = valid;

  // Update UI with valid file count
  if (valid.length !== files.length) {
    showActiveState(valid.length);
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
  showConvertingState(1, total);

  // Set up converter
  setFiles(validatedFiles);
  setOutputFormat(state.outputFormat);
  setQuality(state.quality);

  // Track conversion start time for progress threshold
  const startTime = Date.now();

  // Run conversion with progress callback
  const result = await convertAll((current, total, fileResult) => {
    // Only show progress if conversion takes > 500ms
    if (Date.now() - startTime > 500) {
      updateProgress(current, total);
    }
  });

  console.log('[CovertConvert] Conversion complete:', result);

  if (result.ok) {
    const { successful, failed, successCount, failCount, total } = result.data;

    if (failCount > 0 && successCount > 0) {
      // Partial success (Story 2.5)
      showPartialSuccess(successCount, total);
    } else {
      // Full success
      showSuccess(successCount);
    }

    // Trigger download with progress callback for sequential downloads
    if (successful.length > 0) {
      const downloadResult = await triggerDownload(successful, (current, dlTotal) => {
        showDownloadingState(current, dlTotal);
      });

      // Show mobile info message if applicable (Story 2.4)
      if (downloadResult.message) {
        showInfo(downloadResult.message);
      }

      console.log('[CovertConvert] Download complete:', downloadResult);
    }

    // Show any conversion errors
    if (failed.length > 0) {
      const firstFailed = failed[0];
      showError(firstFailed.error.type, firstFailed.file);
    }
  } else {
    // All failed
    showError(ERROR_TYPES.DECODE_FAILED, 'conversion');
  }
}

/**
 * Show converting state UI
 */
function showConvertingState(current, total) {
  elements.fileSelector?.classList.add('is-converting');
  elements.fileSelector?.classList.remove('file-selector--active', 'is-success', 'has-error');

  if (elements.selectorText) {
    elements.selectorText.textContent = total === 1
      ? 'Converting...'
      : `Converting ${current} of ${total}...`;
  }

  // Show progress bar for multiple files
  if (total > 1 && elements.progressContainer) {
    elements.progressContainer.hidden = false;
    elements.progressContainer.classList.remove('hidden');
  }
}

/**
 * Show downloading state (for sequential mobile downloads)
 */
function showDownloadingState(current, total) {
  if (elements.selectorText) {
    elements.selectorText.textContent = `Downloading ${current} of ${total}...`;
  }

  if (elements.progressText) {
    elements.progressText.textContent = `Downloading ${current} of ${total}...`;
  }
}

/**
 * Update progress bar
 */
function updateProgress(current, total) {
  const percent = Math.round((current / total) * 100);

  if (elements.progressFill) {
    elements.progressFill.style.width = `${percent}%`;
  }

  if (elements.progressText) {
    elements.progressText.textContent = `Converting ${current} of ${total}...`;
  }

  if (elements.selectorText) {
    elements.selectorText.textContent = `Converting ${current} of ${total}...`;
  }
}

/**
 * Show success state
 */
function showSuccess(count) {
  elements.fileSelector?.classList.remove('is-converting', 'has-error');
  elements.fileSelector?.classList.add('is-success');

  if (elements.selectorText) {
    elements.selectorText.textContent = count === 1
      ? '✓ Done!'
      : `✓ ${count} files converted!`;
  }

  // Complete progress bar
  if (elements.progressFill) {
    elements.progressFill.style.width = '100%';
  }

  if (elements.progressText) {
    elements.progressText.textContent = 'Complete!';
  }
}

/**
 * Show partial success (Story 2.5)
 */
function showPartialSuccess(success, total) {
  elements.fileSelector?.classList.remove('is-converting');
  elements.fileSelector?.classList.add('is-success');

  if (elements.selectorText) {
    elements.selectorText.textContent = `Converted ${success} of ${total} files`;
  }
}

/**
 * Show active state with file count feedback
 */
function showActiveState(count) {
  elements.fileSelector?.classList.add('file-selector--active');
  elements.fileSelector?.classList.remove('is-success', 'has-error', 'is-converting');

  if (elements.selectorText) {
    elements.selectorText.textContent = count === 1
      ? '1 file selected'
      : `${count} files selected`;
  }
}

/**
 * Handle drag enter
 */
function handleDragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.fileSelector?.classList.add('file-selector--hover');
}

/**
 * Handle drag over
 */
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.fileSelector?.classList.add('file-selector--hover');
}

/**
 * Handle drag leave
 */
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.fileSelector?.classList.remove('file-selector--hover');
}

/**
 * Handle file drop
 */
async function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.fileSelector?.classList.remove('file-selector--hover');

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

  // Update button states
  elements.formatButtons?.forEach(btn => {
    const isActive = btn.dataset.format === format;
    btn.setAttribute('aria-pressed', isActive.toString());
    btn.classList.toggle('bg-gray-900', isActive);
    btn.classList.toggle('text-white', isActive);
    btn.classList.toggle('bg-gray-200', !isActive);
    btn.classList.toggle('text-gray-700', !isActive);
  });

  // Update quality slider visibility (Story 1.7)
  updateQualityVisibility();

  console.log('[CovertConvert] Output format changed:', format);
}

/**
 * Handle quality slider change (Story 1.7 / Epic 2)
 */
function handleQualityChange(e) {
  const value = parseInt(e.target.value, 10);
  state.quality = value / 100;

  // Update display
  if (elements.qualityValue) {
    elements.qualityValue.textContent = `${value}%`;
  }

  console.log('[CovertConvert] Quality changed:', state.quality);
}

/**
 * Update quality slider visibility based on output format
 */
function updateQualityVisibility() {
  if (elements.qualityContainer) {
    // Show for JPEG, hide for PNG (PNG is lossless)
    const showSlider = state.outputFormat === 'jpeg';
    elements.qualityContainer.hidden = !showSlider;
    elements.qualityContainer.classList.toggle('hidden', !showSlider);
  }
}

/**
 * Update selector text for touch devices
 */
function updateSelectorText() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (hasTouch && elements.selectorText) {
    elements.selectorText.textContent = 'Tap to select files';
  }
}

/**
 * Show warning message (Story 2.6)
 */
function showWarning(message) {
  if (elements.warningContainer) {
    elements.warningContainer.hidden = false;
    elements.warningContainer.classList.remove('hidden');
  }

  if (elements.warningMessage) {
    elements.warningMessage.textContent = message;
  }
}

/**
 * Hide warning message
 */
function hideWarning() {
  if (elements.warningContainer) {
    elements.warningContainer.hidden = true;
    elements.warningContainer.classList.add('hidden');
  }
}

/**
 * Dismiss warning (FR30)
 */
function dismissWarning() {
  state.warningDismissed = true;
  hideWarning();
}

/**
 * Show info message (non-blocking)
 */
function showInfo(message) {
  if (elements.warningContainer) {
    elements.warningContainer.hidden = false;
    elements.warningContainer.classList.remove('hidden');
    // Use neutral styling for info
    elements.warningContainer.classList.remove('bg-warning-bg', 'border-warning');
    elements.warningContainer.classList.add('bg-gray-100', 'border-gray-300');
  }

  if (elements.warningMessage) {
    elements.warningMessage.textContent = message;
    elements.warningMessage.classList.remove('text-warning-text');
    elements.warningMessage.classList.add('text-gray-600');
  }
}

/**
 * Show error message to user
 */
function showError(errorType, filename) {
  const message = getUserMessage(errorType);
  const guidance = getErrorGuidance(errorType);

  if (elements.errorContainer) {
    elements.errorContainer.hidden = false;
    elements.errorContainer.classList.remove('hidden');
  }
  if (elements.errorMessage) {
    elements.errorMessage.textContent = message;
  }
  if (elements.errorGuidance) {
    elements.errorGuidance.textContent = guidance;
  }

  elements.fileSelector?.classList.add('has-error');
  elements.fileSelector?.classList.remove('file-selector--active');

  console.warn('[CovertConvert] Error:', { type: errorType, file: filename, message });
}

/**
 * Hide error message
 */
function hideError() {
  if (elements.errorContainer) {
    elements.errorContainer.hidden = true;
    elements.errorContainer.classList.add('hidden');
  }
  elements.fileSelector?.classList.remove('has-error');
}

/**
 * Reset UI to default state (Story 2.7)
 */
function resetToDefault() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Reset file selector
  elements.fileSelector?.classList.remove(
    'file-selector--active',
    'has-error',
    'is-success',
    'is-converting'
  );

  if (elements.selectorText) {
    elements.selectorText.textContent = hasTouch
      ? 'Tap to select files'
      : 'Drop files here or click to select';
  }

  // Reset file input
  if (elements.fileInput) {
    elements.fileInput.value = '';
  }

  // Hide progress
  if (elements.progressContainer) {
    elements.progressContainer.hidden = true;
    elements.progressContainer.classList.add('hidden');
  }

  if (elements.progressFill) {
    elements.progressFill.style.width = '0%';
  }

  // Hide errors and warnings
  hideError();
  hideWarning();

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
