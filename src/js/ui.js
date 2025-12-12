/**
 * UI Module
 * DOM updates, progress display, state feedback
 *
 * Architecture: Named exports, cached DOM queries at module scope, BEM-lite classes
 */

// Threshold for showing progress (per UX spec)
const PROGRESS_THRESHOLD_MS = 500;

// Cache DOM references at module load (per architecture)
let elements = null;

/**
 * Initialize UI module with DOM references
 * Must be called after DOMContentLoaded
 */
function initUI() {
  elements = {
    fileSelector: document.querySelector('.file-selector'),
    selectorText: document.querySelector('#selector-text'),
    progressContainer: document.querySelector('#progress-container'),
    progressFill: document.querySelector('.progress-batch__fill'),
    progressText: document.querySelector('#progress-text'),
    errorContainer: document.querySelector('#error-container'),
    errorMessage: document.querySelector('#error-message'),
    errorGuidance: document.querySelector('#error-guidance'),
    trustMessage: document.querySelector('.trust-message'),
    warningContainer: document.querySelector('#warning-container'),
    warningMessage: document.querySelector('#warning-message'),
    warningDismiss: document.querySelector('#warning-dismiss'),
    qualitySlider: document.querySelector('#quality-slider'),
    qualityValue: document.querySelector('#quality-value'),
  };
  return elements;
}

/**
 * Get cached elements (initialize if needed)
 */
function getElements() {
  if (!elements) {
    initUI();
  }
  return elements;
}

/**
 * Show converting state
 * @param {number} current - Current file index (1-based)
 * @param {number} total - Total files
 */
function showConverting(current, total) {
  const el = getElements();

  // Update file selector state
  el.fileSelector?.classList.add('is-converting');
  el.fileSelector?.classList.remove('file-selector--active', 'is-success', 'has-error');

  // Update selector text
  if (el.selectorText) {
    el.selectorText.textContent = total === 1
      ? 'Converting...'
      : `Converting ${current} of ${total}...`;
  }

  // Show progress bar for multiple files
  if (total > 1 && el.progressContainer) {
    el.progressContainer.hidden = false;
    el.progressContainer.classList.remove('hidden');
  }
}

/**
 * Update progress bar
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
}

/**
 * Show success state
 * @param {number} count - Number of files converted
 */
function showSuccess(count) {
  const el = getElements();

  // Update file selector state
  el.fileSelector?.classList.remove('is-converting', 'has-error');
  el.fileSelector?.classList.add('is-success');

  // Update selector text
  if (el.selectorText) {
    el.selectorText.textContent = count === 1
      ? '✓ Done!'
      : `✓ ${count} files converted!`;
  }

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

  if (el.selectorText) {
    el.selectorText.textContent = `Converted ${success} of ${total} files`;
  }
}

/**
 * Show error state
 * @param {string} message - Error message
 * @param {string} guidance - Guidance text
 */
function showError(message, guidance) {
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

/**
 * Reset UI to default state
 */
function resetUI() {
  const el = getElements();
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Reset file selector
  el.fileSelector?.classList.remove(
    'file-selector--active',
    'file-selector--hover',
    'is-converting',
    'is-success',
    'has-error'
  );

  // Reset selector text
  if (el.selectorText) {
    el.selectorText.textContent = hasTouch
      ? 'Tap to select files'
      : 'Drop files here or click to select';
  }

  // Hide progress and errors
  hideProgress();
  hideError();
}

/**
 * Show file count after selection
 * @param {number} count - Number of files selected
 */
function showFileCount(count) {
  const el = getElements();

  el.fileSelector?.classList.add('file-selector--active');
  el.fileSelector?.classList.remove('is-success', 'has-error', 'is-converting');

  if (el.selectorText) {
    el.selectorText.textContent = count === 1
      ? '1 file selected'
      : `${count} files selected`;
  }

  hideError();
}

/**
 * Show warning message (dismissible)
 * @param {string} message - Warning text
 */
function showWarning(message) {
  const el = getElements();

  if (el.warningContainer) {
    el.warningContainer.hidden = false;
    el.warningContainer.classList.remove('hidden');
  }

  if (el.warningMessage) {
    el.warningMessage.textContent = message;
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
 * Show info message (non-error, non-warning)
 * @param {string} message - Info message text
 */
function showInfo(message) {
  const el = getElements();

  // Use warning container with info styling
  if (el.warningContainer) {
    el.warningContainer.hidden = false;
    el.warningContainer.classList.remove('hidden');
    el.warningContainer.classList.remove('bg-warning-bg', 'border-warning');
    el.warningContainer.classList.add('bg-gray-100', 'border-gray-300');
  }

  if (el.warningMessage) {
    el.warningMessage.textContent = message;
    el.warningMessage.classList.remove('text-warning-text');
    el.warningMessage.classList.add('text-gray-600');
  }
}

/**
 * Update quality slider display
 * @param {number} value - Quality value (0-100)
 */
function updateQualityDisplay(value) {
  const el = getElements();

  if (el.qualityValue) {
    el.qualityValue.textContent = `${value}%`;
  }
}

// Named exports only (per architecture)
export {
  initUI,
  getElements,
  showConverting,
  updateProgress,
  showSuccess,
  showPartialSuccess,
  showError,
  hideError,
  hideProgress,
  resetUI,
  showFileCount,
  showWarning,
  hideWarning,
  showDownloading,
  showInfo,
  updateQualityDisplay,
  PROGRESS_THRESHOLD_MS,
};
