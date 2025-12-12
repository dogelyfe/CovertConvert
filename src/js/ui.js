/**
 * UI Module
 * Single source of truth for DOM updates, progress display, state feedback
 *
 * Architecture: Named exports, cached DOM queries at module scope, BEM-lite classes
 *
 * IMPORTANT: All visual DOM manipulation should go through this module.
 * main.js handles logic/events, ui.js handles display.
 */

// Threshold for showing progress (per UX spec)
const PROGRESS_THRESHOLD_MS = 500;

// Cache DOM references at module load (per architecture)
let elements = null;
let initialized = false;

/**
 * Initialize UI module with DOM references
 * Must be called after DOMContentLoaded
 * @returns {object} Cached elements
 */
function initUI() {
  if (initialized && elements) {
    return elements;
  }

  elements = {
    // File selector
    fileSelector: document.querySelector('.file-selector'),
    fileInput: document.querySelector('#file-input'),
    selectorText: document.querySelector('#selector-text'),

    // Progress
    progressContainer: document.querySelector('#progress-container'),
    progressFill: document.querySelector('.progress-batch__fill'),
    progressText: document.querySelector('#progress-text'),

    // Error display
    errorContainer: document.querySelector('#error-container'),
    errorMessage: document.querySelector('#error-message'),
    errorGuidance: document.querySelector('#error-guidance'),

    // Warning display
    warningContainer: document.querySelector('#warning-container'),
    warningMessage: document.querySelector('#warning-message'),
    warningDismiss: document.querySelector('#warning-dismiss'),

    // Quality slider
    qualityContainer: document.querySelector('#quality-container'),
    qualitySlider: document.querySelector('#quality-slider'),
    qualityValue: document.querySelector('#quality-value'),

    // Other
    trustMessage: document.querySelector('.trust-message'),
    formatButtons: document.querySelectorAll('[data-format]'),
    converter: document.querySelector('#converter'),
  };

  initialized = true;
  return elements;
}

/**
 * Get cached elements (initialize if needed)
 * @returns {object} DOM elements
 */
function getElements() {
  if (!initialized) {
    initUI();
  }
  return elements;
}

// ============================================================================
// FILE SELECTOR STATES
// ============================================================================

/**
 * Update selector text and aria-label together (a11y: label-content-name-mismatch)
 * @param {string} text - Text to display and use for aria-label
 */
function updateSelectorText(text) {
  const el = getElements();
  if (el.selectorText) {
    el.selectorText.textContent = text;
  }
  // Keep aria-label in sync with visible text for accessibility
  el.fileSelector?.setAttribute('aria-label', text);
}

/**
 * Show file count after selection (active state)
 * @param {number} count - Number of files selected
 */
function showFileCount(count) {
  const el = getElements();

  el.fileSelector?.classList.add('file-selector--active');
  el.fileSelector?.classList.remove('is-success', 'has-error', 'is-converting');

  const text = count === 1 ? '1 file selected' : `${count} files selected`;
  updateSelectorText(text);

  hideError();
  hideWarning();
}

/**
 * Show converting state
 * @param {number} current - Current file index (1-based)
 * @param {number} total - Total files
 */
function showConverting(current, total) {
  const el = getElements();

  el.fileSelector?.classList.add('is-converting');
  el.fileSelector?.classList.remove('file-selector--active', 'is-success', 'has-error');

  const text = total === 1 ? 'Converting...' : `Converting ${current} of ${total}...`;
  updateSelectorText(text);

  // Show progress bar for multiple files
  if (total > 1 && el.progressContainer) {
    el.progressContainer.hidden = false;
    el.progressContainer.classList.remove('hidden');
  }
}

/**
 * Show success state
 * @param {number} count - Number of files converted
 */
function showSuccess(count) {
  const el = getElements();

  el.fileSelector?.classList.remove('is-converting', 'has-error');
  el.fileSelector?.classList.add('is-success');

  const text = count === 1 ? 'Done!' : `${count} files converted!`;
  updateSelectorText(text);

  // Complete progress bar
  if (el.progressFill) {
    el.progressFill.style.width = '100%';
  }

  if (el.progressText) {
    el.progressText.textContent = 'Complete!';
  }
}

/**
 * Show partial success (some files failed)
 * @param {number} success - Successful conversions
 * @param {number} total - Total files attempted
 */
function showPartialSuccess(success, total) {
  const el = getElements();

  el.fileSelector?.classList.remove('is-converting');
  el.fileSelector?.classList.add('is-success');

  const text = `Converted ${success} of ${total} files`;
  updateSelectorText(text);
}

/**
 * Set hover state (for drag events)
 * @param {boolean} hover - Whether to show hover state
 */
function setHoverState(hover) {
  const el = getElements();

  if (hover) {
    el.fileSelector?.classList.add('file-selector--hover');
  } else {
    el.fileSelector?.classList.remove('file-selector--hover');
  }
}

/**
 * Reset UI to default state
 */
function resetUI() {
  const el = getElements();
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Reset file selector classes
  el.fileSelector?.classList.remove(
    'file-selector--active',
    'file-selector--hover',
    'is-converting',
    'is-success',
    'has-error'
  );

  // Reset selector text (with aria-label sync)
  const text = hasTouch ? 'Tap to select files' : 'Drop files here or click to select';
  updateSelectorText(text);

  // Reset file input
  if (el.fileInput) {
    el.fileInput.value = '';
  }

  // Hide progress and errors
  hideProgress();
  hideError();
  hideWarning();
}

/**
 * Update selector text for touch devices
 * Uses updateSelectorText helper for aria-label sync
 */
function updateSelectorTextForTouch() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (hasTouch) {
    updateSelectorText('Tap to select files');
  }
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

/**
 * Update progress bar and text
 * @param {number} current - Current file index (1-based)
 * @param {number} total - Total files
 */
function updateProgress(current, total) {
  const el = getElements();

  const percent = Math.round((current / total) * 100);

  if (el.progressFill) {
    el.progressFill.style.width = `${percent}%`;
  }

  if (el.progressText) {
    el.progressText.textContent = `Converting ${current} of ${total}...`;
  }

  if (el.selectorText) {
    el.selectorText.textContent = `Converting ${current} of ${total}...`;
  }
}

/**
 * Show downloading state (for sequential mobile downloads)
 * @param {number} current - Current file being downloaded
 * @param {number} total - Total files to download
 */
function showDownloading(current, total) {
  const el = getElements();

  if (el.selectorText) {
    el.selectorText.textContent = `Downloading ${current} of ${total}...`;
  }

  if (el.progressText) {
    el.progressText.textContent = `Downloading ${current} of ${total}...`;
  }
}

/**
 * Show ZIP creation progress
 * @param {number} percent - Percentage complete (0-100)
 */
function showZipProgress(percent) {
  const el = getElements();

  if (el.selectorText) {
    el.selectorText.textContent = `Creating ZIP... ${Math.round(percent)}%`;
  }

  if (el.progressFill) {
    el.progressFill.style.width = `${percent}%`;
  }

  if (el.progressText) {
    el.progressText.textContent = `Creating ZIP... ${Math.round(percent)}%`;
  }
}

/**
 * Hide progress bar
 */
function hideProgress() {
  const el = getElements();

  if (el.progressContainer) {
    el.progressContainer.hidden = true;
    el.progressContainer.classList.add('hidden');
  }

  if (el.progressFill) {
    el.progressFill.style.width = '0%';
  }
}

// ============================================================================
// ERROR DISPLAY
// ============================================================================

/**
 * Show error state
 * @param {string} message - Error message
 * @param {string} guidance - Guidance text
 */
function showError(message, guidance = '') {
  const el = getElements();

  // Update file selector state
  el.fileSelector?.classList.remove('is-converting', 'is-success', 'file-selector--active');
  el.fileSelector?.classList.add('has-error');

  // Show error container
  if (el.errorContainer) {
    el.errorContainer.hidden = false;
    el.errorContainer.classList.remove('hidden');
  }

  if (el.errorMessage) {
    el.errorMessage.textContent = message;
  }

  if (el.errorGuidance) {
    el.errorGuidance.textContent = guidance;
  }
}

/**
 * Hide error state
 */
function hideError() {
  const el = getElements();

  if (el.errorContainer) {
    el.errorContainer.hidden = true;
    el.errorContainer.classList.add('hidden');
  }

  el.fileSelector?.classList.remove('has-error');
}

// ============================================================================
// WARNING DISPLAY
// ============================================================================

/**
 * Show warning message (dismissible)
 * @param {string} message - Warning text
 */
function showWarning(message) {
  const el = getElements();

  if (el.warningContainer) {
    el.warningContainer.hidden = false;
    el.warningContainer.classList.remove('hidden');
    // Ensure warning styling
    el.warningContainer.classList.remove('bg-gray-100', 'border-gray-300');
    el.warningContainer.classList.add('bg-warning-bg', 'border-warning');
  }

  if (el.warningMessage) {
    el.warningMessage.textContent = message;
    el.warningMessage.classList.remove('text-gray-600');
    el.warningMessage.classList.add('text-warning-text');
  }
}

/**
 * Hide warning message
 */
function hideWarning() {
  const el = getElements();

  if (el.warningContainer) {
    el.warningContainer.hidden = true;
    el.warningContainer.classList.add('hidden');
  }
}

/**
 * Show info message (non-error, non-warning - neutral styling)
 * @param {string} message - Info message text
 */
function showInfo(message) {
  const el = getElements();

  if (el.warningContainer) {
    el.warningContainer.hidden = false;
    el.warningContainer.classList.remove('hidden');
    // Use neutral styling for info
    el.warningContainer.classList.remove('bg-warning-bg', 'border-warning');
    el.warningContainer.classList.add('bg-gray-100', 'border-gray-300');
  }

  if (el.warningMessage) {
    el.warningMessage.textContent = message;
    el.warningMessage.classList.remove('text-warning-text');
    el.warningMessage.classList.add('text-gray-600');
  }
}

// ============================================================================
// QUALITY SLIDER
// ============================================================================

/**
 * Update quality slider display value
 * @param {number} value - Quality value (0-100)
 */
function updateQualityDisplay(value) {
  const el = getElements();

  if (el.qualityValue) {
    el.qualityValue.textContent = `${value}%`;
  }

  // Update aria-valuenow for accessibility
  if (el.qualitySlider) {
    el.qualitySlider.setAttribute('aria-valuenow', value.toString());
  }
}

/**
 * Show/hide quality slider based on output format
 * @param {boolean} show - Whether to show the slider
 */
function setQualityVisibility(show) {
  const el = getElements();

  if (el.qualityContainer) {
    el.qualityContainer.hidden = !show;
    el.qualityContainer.classList.toggle('hidden', !show);
  }
}

// ============================================================================
// FORMAT BUTTONS
// ============================================================================

/**
 * Update format button states
 * @param {string} activeFormat - Currently selected format ('jpeg' or 'png')
 */
function updateFormatButtons(activeFormat) {
  const el = getElements();

  el.formatButtons?.forEach(btn => {
    const isActive = btn.dataset.format === activeFormat;
    btn.setAttribute('aria-pressed', isActive.toString());
    btn.classList.toggle('bg-gray-900', isActive);
    btn.classList.toggle('text-white', isActive);
    btn.classList.toggle('bg-gray-200', !isActive);
    btn.classList.toggle('text-gray-700', !isActive);
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

// Named exports only (per architecture)
export {
  // Initialization
  initUI,
  getElements,

  // File selector states
  showFileCount,
  showConverting,
  showSuccess,
  showPartialSuccess,
  setHoverState,
  resetUI,
  updateSelectorTextForTouch,

  // Progress
  updateProgress,
  showDownloading,
  showZipProgress,
  hideProgress,

  // Error
  showError,
  hideError,

  // Warning
  showWarning,
  hideWarning,
  showInfo,

  // Quality
  updateQualityDisplay,
  setQualityVisibility,

  // Format buttons
  updateFormatButtons,

  // Constants
  PROGRESS_THRESHOLD_MS,
};
