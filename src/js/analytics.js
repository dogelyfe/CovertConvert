/**
 * Analytics Module - GA4 Event Tracking
 * Story 5.1: Track conversion events to GA4
 *
 * Events tracked:
 * - file_selected: User selects files (count, formats)
 * - conversion_started: Conversion begins (count, output_format)
 * - conversion_completed: Conversion succeeds (count, duration_ms, output_format)
 * - download_triggered: Download starts (type, count)
 * - conversion_error: Conversion fails (error_type, input_format, browser, platform)
 *
 * All event names use snake_case per GA4 convention.
 * No PII is included in any event.
 */

/**
 * Check if GA4 is available
 * @returns {boolean}
 */
function isGtagAvailable() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Get simplified browser name (no PII, just category)
 * @returns {string}
 */
function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  if (ua.includes('Edge')) return 'edge';
  if (ua.includes('Chrome')) return 'chrome';
  return 'other';
}

/**
 * Get simplified platform name (no PII)
 * @returns {string}
 */
function getPlatformName() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Mac/.test(ua)) return 'macos';
  if (/Win/.test(ua)) return 'windows';
  if (/Linux/.test(ua)) return 'linux';
  return 'other';
}

/**
 * Send event to GA4
 * @param {string} eventName - Event name (snake_case)
 * @param {object} params - Event parameters
 */
function trackEvent(eventName, params = {}) {
  if (!isGtagAvailable()) {
    return;
  }

  window.gtag('event', eventName, params);
}

/**
 * Track file selection
 * @param {number} count - Number of files selected
 * @param {string[]} formats - Array of detected formats
 */
export function trackFileSelected(count, formats = []) {
  trackEvent('file_selected', {
    count,
    formats: formats.join(','),
  });
}

/**
 * Track conversion start
 * @param {number} count - Number of files to convert
 * @param {string} outputFormat - Target format (jpeg/png)
 */
export function trackConversionStarted(count, outputFormat) {
  trackEvent('conversion_started', {
    count,
    output_format: outputFormat,
  });
}

/**
 * Track conversion completion
 * @param {number} count - Number of files converted
 * @param {number} durationMs - Total conversion time in ms
 * @param {string} outputFormat - Target format
 */
export function trackConversionCompleted(count, durationMs, outputFormat) {
  trackEvent('conversion_completed', {
    count,
    duration_ms: Math.round(durationMs),
    output_format: outputFormat,
  });
}

/**
 * Track download trigger
 * @param {'single'|'zip'|'sequential'} type - Download type
 * @param {number} count - Number of files
 */
export function trackDownloadTriggered(type, count) {
  trackEvent('download_triggered', {
    download_type: type,
    count,
  });
}

/**
 * Track conversion error (single file)
 * @param {string} errorType - Error classification
 * @param {string} inputFormat - Input file format that failed
 */
export function trackConversionError(errorType, inputFormat = 'unknown') {
  trackEvent('conversion_error', {
    error_type: errorType,
    input_format: inputFormat,
    browser: getBrowserName(),
    platform: getPlatformName(),
  });
}

/**
 * Track batch conversion errors (aggregated to avoid flooding GA4)
 * @param {Array} failures - Array of { file: string, error: { type, inputFormat } } objects
 */
export function trackBatchErrors(failures) {
  if (!failures || failures.length === 0) return;

  // Aggregate error types and formats from nested error objects
  const errorTypes = [...new Set(failures.map(f => f.error?.type || 'unknown'))];
  const formats = [...new Set(failures.map(f => f.error?.inputFormat || 'unknown'))];

  trackEvent('conversion_error', {
    error_type: errorTypes.join(','),
    input_format: formats.join(','),
    failed_count: failures.length,
    browser: getBrowserName(),
    platform: getPlatformName(),
  });
}

/**
 * Track page view (called automatically by GA4 snippet)
 * Included here for completeness - GA4 handles this via config
 */
export function trackPageView() {
  // GA4 handles page views automatically via gtag('config', ...)
  // This is a no-op but documents the event
}
