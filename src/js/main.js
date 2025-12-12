/**
 * CovertConvert - Main Entry Point
 * DOM initialization and event binding
 */

import { validateFiles, getSupportedFormatsString } from './detector.js';
import { getUserMessage, getErrorGuidance, ERROR_TYPES } from './errors.js';
import { setFiles, setOutputFormat, convertAll } from './converter.js';
import { triggerDownload } from './downloader.js';
import { initPreload } from './codecs/loader.js';

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
};

// State (will be moved to converter.js in Story 1.4+)
let state = {
  outputFormat: 'jpeg',
  files: [],
  status: 'idle',
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

  // Drag and drop (dragenter + dragover for reliable hover state)
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
 * Process selected files - validate, convert, and download
 */
async function processFiles(files) {
  // Immediate visual feedback (< 100ms per AC)
  showActiveState(files.length);
  hideError();

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
      // Partial success
      showPartialSuccess(successCount, total);
    } else {
      // Full success
      showSuccess(successCount);
    }

    // Trigger download after 500ms success pause
    if (successful.length > 0) {
      await triggerDownload(successful);
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
 * Show partial success
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
  if (elements.selectorText) {
    elements.selectorText.textContent = count === 1
      ? '1 file selected'
      : `${count} files selected`;
  }
}

/**
 * Handle drag enter (initial drag detection)
 */
function handleDragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.fileSelector?.classList.add('file-selector--hover');
}

/**
 * Handle drag over (required to allow drop)
 */
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  // Keep hover state active
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

  console.log('[CovertConvert] Output format changed:', format);
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
 * Show error message to user
 * @param {string} errorType - Error type from ERROR_TYPES
 * @param {string} filename - Name of the file that caused the error
 */
function showError(errorType, filename) {
  const message = getUserMessage(errorType);
  const guidance = getErrorGuidance(errorType);

  // Update error container
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

  // Add error state to file selector
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
 * Reset UI to default state
 */
function resetToDefault() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  elements.fileSelector?.classList.remove('file-selector--active', 'has-error', 'is-success');

  if (elements.selectorText) {
    elements.selectorText.textContent = hasTouch
      ? 'Tap to select files'
      : 'Drop files here or click to select';
  }

  // Reset file input
  if (elements.fileInput) {
    elements.fileInput.value = '';
  }

  // Reset state
  state.files = [];
  state.validatedFiles = [];
  state.status = 'idle';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { init, state };
