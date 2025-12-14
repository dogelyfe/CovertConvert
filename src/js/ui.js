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

    // Advanced options (Epic 6)
    advancedOptions: document.querySelector('#advanced-options'),
    advancedToggle: document.querySelector('.advanced-options__toggle'),
    targetFilesizeSlider: document.querySelector('#target-filesize-slider'),
    targetFilesizeInput: document.querySelector('#target-filesize-input'),
    lockQuality: document.querySelector('#lock-quality'),
    lockDimensions: document.querySelector('#lock-dimensions'),
    showLog: document.querySelector('#show-log'),
    convertButton: document.querySelector('#convert-button'),

    // Conversion log (Epic 6)
    conversionLog: document.querySelector('#conversion-log'),
    logClose: document.querySelector('#log-close'),
    logBody: document.querySelector('#log-body'),
    logFooter: document.querySelector('#log-footer'),

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
 * Update format button states (pill toggle design)
 * @param {string} activeFormat - Currently selected format ('jpeg' or 'png')
 */
function updateFormatButtons(activeFormat) {
  const el = getElements();

  // Update pill container data attribute (controls slider position via CSS)
  const pillContainer = document.querySelector('.format-pill');
  if (pillContainer) {
    pillContainer.dataset.selected = activeFormat;
  }

  // Update aria-pressed on buttons
  el.formatButtons?.forEach(btn => {
    const isActive = btn.dataset.format === activeFormat;
    btn.setAttribute('aria-pressed', isActive.toString());
  });
}

// ============================================================================
// ADVANCED OPTIONS (Epic 6)
// ============================================================================

/**
 * Toggle advanced options panel
 * @param {boolean} [forceState] - Optional: force open (true) or closed (false)
 */
function toggleAdvancedOptions(forceState) {
  const el = getElements();
  if (!el.advancedOptions || !el.advancedToggle) return;

  const currentState = el.advancedOptions.dataset.expanded === 'true';
  const newState = forceState !== undefined ? forceState : !currentState;

  el.advancedOptions.dataset.expanded = newState.toString();
  el.advancedToggle.setAttribute('aria-expanded', newState.toString());
}

/**
 * Get current target filesize in bytes (0 = disabled)
 * @returns {number} Target in bytes, or 0 if disabled
 */
function getTargetFilesize() {
  const el = getElements();
  if (!el.targetFilesizeInput) return 0;

  const value = parseInt(el.targetFilesizeInput.value, 10);
  return isNaN(value) || value <= 0 ? 0 : value * 1024; // KB to bytes
}

/**
 * Update target filesize slider and input to stay in sync
 * @param {number} valueKB - Value in KB
 * @param {'slider' | 'input'} source - Which control triggered the change
 */
function syncTargetFilesize(valueKB, source) {
  const el = getElements();

  if (source === 'slider' && el.targetFilesizeInput) {
    el.targetFilesizeInput.value = valueKB;
  } else if (source === 'input' && el.targetFilesizeSlider) {
    // Clamp to slider range
    const clamped = Math.min(5000, Math.max(50, valueKB));
    el.targetFilesizeSlider.value = clamped;
  }
}

/**
 * Get lock states
 * @returns {{lockQuality: boolean, lockDimensions: boolean}}
 */
function getLockStates() {
  const el = getElements();
  return {
    lockQuality: el.lockQuality?.checked || false,
    lockDimensions: el.lockDimensions?.checked || false,
  };
}

/**
 * Enforce mutual exclusivity of lock checkboxes
 * @param {'quality' | 'dimensions'} checked - Which was just checked
 */
function enforceLockExclusivity(checked) {
  const el = getElements();

  if (checked === 'quality' && el.lockDimensions) {
    el.lockDimensions.checked = false;
  } else if (checked === 'dimensions' && el.lockQuality) {
    el.lockQuality.checked = false;
  }
}

/**
 * Check if show log is enabled
 * @returns {boolean}
 */
function isLogEnabled() {
  const el = getElements();
  return el.showLog?.checked || false;
}

// ============================================================================
// MANUAL START FLOW (Epic 6)
// ============================================================================

/**
 * Show queued state with file count
 * @param {number} count - Number of files queued
 */
function showQueuedState(count) {
  const el = getElements();

  el.fileSelector?.classList.add('file-selector--queued');
  el.fileSelector?.classList.remove('is-success', 'has-error', 'is-converting');

  const text = count === 1 ? '1 file ready' : `${count} files ready`;
  updateSelectorText(text);

  // Show convert button
  if (el.convertButton) {
    el.convertButton.classList.add('convert-button--visible');
    el.convertButton.disabled = false;
    el.convertButton.textContent = count === 1 ? 'Convert file' : `Convert ${count} files`;
  }
}

/**
 * Hide queued state and convert button
 */
function hideQueuedState() {
  const el = getElements();

  el.fileSelector?.classList.remove('file-selector--queued');

  if (el.convertButton) {
    el.convertButton.classList.remove('convert-button--visible');
    el.convertButton.disabled = true;
  }
}

/**
 * Check if we're in manual start mode (target filesize is set)
 * @returns {boolean}
 */
function isManualStartMode() {
  return getTargetFilesize() > 0;
}

// ============================================================================
// CONVERSION LOG (Epic 6)
// ============================================================================

/**
 * Open the conversion log panel
 */
function openLog() {
  const el = getElements();
  el.conversionLog?.classList.add('conversion-log--open');
}

/**
 * Close the conversion log panel
 */
function closeLog() {
  const el = getElements();
  el.conversionLog?.classList.remove('conversion-log--open');
}

/**
 * Clear the conversion log
 */
function clearLog() {
  const el = getElements();
  if (el.logBody) {
    el.logBody.innerHTML = '';
  }
  if (el.logFooter) {
    el.logFooter.textContent = '';
  }
}

/**
 * Add entry to conversion log
 * @param {string} inputName - Original filename
 * @param {string} outputName - Output filename
 * @param {number} sizeBytes - Final size in bytes
 * @param {number|null} targetBytes - Target size (null if no target)
 * @param {boolean} hitTarget - Whether target was met
 */
function addLogEntry(inputName, outputName, sizeBytes, targetBytes, hitTarget) {
  const el = getElements();
  if (!el.logBody) return;

  const sizeStr = formatSizeForLog(sizeBytes);
  const hasTarget = targetBytes !== null && targetBytes > 0;

  const entry = document.createElement('div');
  entry.className = 'conversion-log__entry';

  if (hasTarget) {
    entry.classList.add(hitTarget ? 'conversion-log__entry--success' : 'conversion-log__entry--warning');
    const icon = hitTarget ? '✓' : '⚠';
    entry.textContent = `${icon} ${inputName} → ${outputName} (${sizeStr})`;

    if (!hitTarget) {
      const detail = document.createElement('div');
      detail.className = 'conversion-log__entry-detail';
      detail.textContent = `target: ${formatSizeForLog(targetBytes)}`;
      el.logBody.appendChild(entry);
      el.logBody.appendChild(detail);
      return;
    }
  } else {
    entry.textContent = `${inputName} → ${outputName} (${sizeStr})`;
  }

  el.logBody.appendChild(entry);
  el.logBody.scrollTop = el.logBody.scrollHeight;
}

/**
 * Update log footer with summary
 * @param {number} total - Total files
 * @param {number} onTarget - Files that hit target
 * @param {number} bestEffort - Files that missed target
 */
function updateLogSummary(total, onTarget, bestEffort) {
  const el = getElements();
  if (!el.logFooter) return;

  if (bestEffort > 0) {
    el.logFooter.textContent = `${total} files • ${onTarget} on target • ${bestEffort} best effort`;
  } else {
    el.logFooter.textContent = `${total} files converted`;
  }
}

/**
 * Format bytes for log display
 * @param {number} bytes
 * @returns {string}
 */
function formatSizeForLog(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  } else if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
}

// ============================================================================
// SETTINGS PERSISTENCE (Epic 6)
// ============================================================================

const STORAGE_KEY = 'cc-advanced-settings';

/**
 * Save advanced settings to localStorage
 */
function saveAdvancedSettings() {
  const el = getElements();

  const settings = {
    targetFilesize: el.targetFilesizeInput?.value || '',
    lockQuality: el.lockQuality?.checked || false,
    lockDimensions: el.lockDimensions?.checked || false,
    showLog: el.showLog?.checked || false,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    // localStorage not available, ignore
  }
}

/**
 * Load advanced settings from localStorage
 */
function loadAdvancedSettings() {
  const el = getElements();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const settings = JSON.parse(saved);

    if (settings.targetFilesize && el.targetFilesizeInput) {
      el.targetFilesizeInput.value = settings.targetFilesize;
      syncTargetFilesize(parseInt(settings.targetFilesize, 10), 'input');
    }

    if (el.lockQuality) {
      el.lockQuality.checked = settings.lockQuality || false;
    }

    if (el.lockDimensions) {
      el.lockDimensions.checked = settings.lockDimensions || false;
    }

    if (el.showLog) {
      el.showLog.checked = settings.showLog || false;
    }
  } catch (e) {
    // Parse error or localStorage not available
  }
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

  // Advanced options (Epic 6)
  toggleAdvancedOptions,
  getTargetFilesize,
  syncTargetFilesize,
  getLockStates,
  enforceLockExclusivity,
  isLogEnabled,

  // Manual start (Epic 6)
  showQueuedState,
  hideQueuedState,
  isManualStartMode,

  // Conversion log (Epic 6)
  openLog,
  closeLog,
  clearLog,
  addLogEntry,
  updateLogSummary,

  // Settings persistence (Epic 6)
  saveAdvancedSettings,
  loadAdvancedSettings,

  // Constants
  PROGRESS_THRESHOLD_MS,
};
