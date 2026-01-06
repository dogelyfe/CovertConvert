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

    // Settings panel
    advancedOptions: document.querySelector('#advanced-options'),
    advancedToggle: document.querySelector('.settings-panel__toggle'),
    showLog: document.querySelector('#show-log'),
    convertButton: document.querySelector('#convert-button'),
    sizeEstimate: document.querySelector('#size-estimate'),
    sizeEstimateValue: document.querySelector('#size-estimate-value'),

    // Conversion log (Epic 6)
    conversionLog: document.querySelector('#conversion-log'),
    logClose: document.querySelector('#log-close'),
    logBody: document.querySelector('#log-body'),
    logFooter: document.querySelector('#log-footer'),

    // Other
    trustMessage: document.querySelector('.trust-message'),
    formatButtons: document.querySelectorAll('[data-format]'),
    converter: document.querySelector('#converter'),

    // Donation banner
    donationBanner: document.querySelector('#donation-banner'),
    donationCta: document.querySelector('#donation-cta'),
    donationDismiss: document.querySelector('#donation-dismiss'),

    // Resize options
    resizeContainer: document.querySelector('#resize-container'),
    resizeMode: document.querySelector('#resize-mode'),
    resizeValue: document.querySelector('#resize-value'),
    resizeNoUpscale: document.querySelector('#resize-no-upscale'),
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
 * Check if show log is enabled
 * @returns {boolean}
 */
function isLogEnabled() {
  const el = getElements();
  return el.showLog?.checked || false;
}

// ============================================================================
// CONVERSION LOG
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
 * Save settings to localStorage
 */
function saveAdvancedSettings() {
  const el = getElements();

  const settings = {
    showLog: el.showLog?.checked || false,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    // localStorage not available, ignore
  }
}

/**
 * Load settings from localStorage
 */
function loadAdvancedSettings() {
  const el = getElements();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const settings = JSON.parse(saved);

    if (el.showLog) {
      el.showLog.checked = settings.showLog || false;
    }
  } catch (e) {
    // Parse error or localStorage not available
  }
}

// ============================================================================
// RESIZE OPTIONS
// ============================================================================

/**
 * Get current resize settings
 * @returns {{mode: string, value: number|null, noUpscale: boolean}}
 */
function getResizeSettings() {
  const el = getElements();

  const mode = el.resizeMode?.value || 'none';
  const rawValue = el.resizeValue?.value;
  const value = rawValue ? parseInt(rawValue, 10) : null;
  const noUpscale = el.resizeNoUpscale?.checked ?? true;

  return {
    mode,
    value: (mode !== 'none' && value && value > 0) ? value : null,
    noUpscale,
  };
}

/**
 * Update resize input disabled state based on mode
 */
function updateResizeInputState() {
  const el = getElements();
  if (!el.resizeMode || !el.resizeValue) return;

  const isDisabled = el.resizeMode.value === 'none';
  el.resizeValue.disabled = isDisabled;
}

// ============================================================================
// SIZE ESTIMATION
// ============================================================================

/**
 * Format bytes to human readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "~1.2MB")
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `~${bytes}B`;
  if (bytes < 1024 * 1024) return `~${Math.round(bytes / 1024)}KB`;
  return `~${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * Estimate output size based on input files, quality, and resize settings
 * @param {object} params - Estimation parameters
 * @param {Array<{file: File, width?: number, height?: number}>} params.files - Input files with dimensions
 * @param {number} params.quality - Quality (0-1)
 * @param {string} params.format - Output format ('jpeg' | 'png')
 * @param {object} params.resize - Resize settings
 * @returns {string} Estimated size range
 */
function estimateOutputSize({ files, quality, format, resize }) {
  if (!files || files.length === 0) return '';

  // Calculate total estimated bytes
  let totalMinBytes = 0;
  let totalMaxBytes = 0;

  for (const { file, width = 1920, height = 1080 } of files) {
    // Calculate resize scale
    let scale = 1;
    if (resize?.mode !== 'none' && resize?.value) {
      const targetDim = resize.value;
      const longSide = Math.max(width, height);
      const shortSide = Math.min(width, height);

      switch (resize.mode) {
        case 'long-side':
          if (!resize.noUpscale || longSide > targetDim) {
            scale = targetDim / longSide;
          }
          break;
        case 'short-side':
          if (!resize.noUpscale || shortSide > targetDim) {
            scale = targetDim / shortSide;
          }
          break;
        case 'width':
          if (!resize.noUpscale || width > targetDim) {
            scale = targetDim / width;
          }
          break;
        case 'height':
          if (!resize.noUpscale || height > targetDim) {
            scale = targetDim / height;
          }
          break;
      }
    }

    // Estimate output size based on format
    const scaledPixels = width * height * scale * scale;

    if (format === 'jpeg') {
      // JPEG: roughly 0.1-0.5 bytes per pixel depending on quality
      const bytesPerPixel = 0.1 + (quality * 0.4);
      const estimated = scaledPixels * bytesPerPixel;
      totalMinBytes += estimated * 0.7;
      totalMaxBytes += estimated * 1.3;
    } else {
      // PNG: roughly 0.3-1.0 bytes per pixel (lossless, varies with content)
      const estimated = scaledPixels * 0.5;
      totalMinBytes += estimated * 0.5;
      totalMaxBytes += estimated * 1.5;
    }
  }

  // Format the range
  if (totalMaxBytes < 1024) return '< 1KB';

  const minStr = formatBytes(totalMinBytes);
  const maxStr = formatBytes(totalMaxBytes);

  // If min and max are similar, just show one value
  if (minStr === maxStr) return minStr;

  // Show range
  return `${minStr} - ${maxStr}`;
}

/**
 * Update size estimate display
 * @param {object} params - Same params as estimateOutputSize
 */
function updateSizeEstimate(params) {
  const el = getElements();
  if (!el.sizeEstimate || !el.sizeEstimateValue) return;

  const estimate = estimateOutputSize(params);

  if (estimate) {
    el.sizeEstimateValue.textContent = estimate;
    el.sizeEstimate.classList.remove('hidden');
  } else {
    el.sizeEstimate.classList.add('hidden');
  }
}

/**
 * Hide size estimate display
 */
function hideSizeEstimate() {
  const el = getElements();
  if (el.sizeEstimate) {
    el.sizeEstimate.classList.add('hidden');
  }
}

// ============================================================================
// DONATION BANNER
// ============================================================================

const DONATION_SHOWN_KEY = 'cc-donation-shown';

/**
 * Check if donation banner should be shown (not shown this session)
 * @returns {boolean}
 */
function shouldShowDonationBanner() {
  try {
    return !sessionStorage.getItem(DONATION_SHOWN_KEY);
  } catch {
    return false; // sessionStorage not available
  }
}

/**
 * Mark donation banner as shown for this session
 */
function markDonationShown() {
  try {
    sessionStorage.setItem(DONATION_SHOWN_KEY, 'true');
  } catch {
    // Ignore - sessionStorage not available
  }
}

/**
 * Show donation banner (if not already shown this session)
 */
function showDonationBanner() {
  const el = getElements();
  if (!el.donationBanner || !shouldShowDonationBanner()) return;

  el.donationBanner.classList.remove('hidden');
  markDonationShown();
}

/**
 * Hide donation banner
 */
function hideDonationBanner() {
  const el = getElements();
  if (el.donationBanner) {
    el.donationBanner.classList.add('hidden');
  }
}

/**
 * Create and show Ko-fi modal with iframe
 */
function openKofiModal() {
  // Don't create duplicate modals
  if (document.querySelector('.kofi-modal')) return;

  const modal = document.createElement('div');
  modal.className = 'kofi-modal';
  modal.innerHTML = `
    <div class="kofi-modal__content">
      <button type="button" class="kofi-modal__close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      <iframe
        src="https://ko-fi.com/untraced/?hidefeed=true&widget=true&embed=true"
        title="Support on Ko-fi"
      ></iframe>
    </div>
  `;

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Close on button click
  modal.querySelector('.kofi-modal__close').addEventListener('click', () => {
    modal.remove();
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  document.body.appendChild(modal);
  hideDonationBanner();
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

  // Settings panel
  toggleAdvancedOptions,
  isLogEnabled,

  // Conversion log
  openLog,
  closeLog,
  clearLog,
  addLogEntry,
  updateLogSummary,

  // Settings persistence (Epic 6)
  saveAdvancedSettings,
  loadAdvancedSettings,

  // Resize options
  getResizeSettings,
  updateResizeInputState,

  // Size estimation
  updateSizeEstimate,
  hideSizeEstimate,

  // Donation banner
  showDonationBanner,
  hideDonationBanner,
  openKofiModal,

  // Constants
  PROGRESS_THRESHOLD_MS,
};
