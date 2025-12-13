/**
 * Error Constants and User Messages
 * Per architecture: separate user-facing from technical messages
 *
 * Architecture: Named exports only
 */

/**
 * Standard error object structure used throughout the application
 * All modules should produce errors matching this shape for consistency
 *
 * @typedef {Object} ConversionError
 * @property {string} type - One of ERROR_TYPES constants (required)
 * @property {string} message - User-facing error message (required)
 * @property {string} [file] - Original filename that caused the error
 * @property {string} [inputFormat] - Detected input format (e.g., 'heic', 'avif')
 * @property {string[]} [supportedFormats] - List of valid formats (for unsupported_format errors)
 * @property {string} [originalError] - Original exception message for debugging
 *
 * @example
 * // Error from detector.js
 * { type: 'unsupported_format', message: "This file type isn't supported.", file: 'photo.psd', supportedFormats: ['heic', 'png', ...] }
 *
 * @example
 * // Error from converter.js
 * { type: 'decode_failed', message: "Couldn't convert this file.", file: 'photo.heic', inputFormat: 'heic' }
 */

// Error type constants
const ERROR_TYPES = {
  UNSUPPORTED_FORMAT: 'unsupported_format',
  DETECTION_FAILED: 'detection_failed',
  DECODE_FAILED: 'decode_failed',
  ENCODE_FAILED: 'encode_failed',
  CODEC_LOAD_FAILED: 'codec_load_failed',
  MEMORY_EXCEEDED: 'memory_exceeded',
  FILE_TOO_LARGE: 'file_too_large',
  BATCH_PARTIAL: 'batch_partial',
  UNKNOWN: 'unknown',
};

// User-facing error messages (short, no jargon)
const USER_MESSAGES = {
  [ERROR_TYPES.UNSUPPORTED_FORMAT]: "This file type isn't supported.",
  [ERROR_TYPES.DETECTION_FAILED]: "Couldn't read this file.",
  [ERROR_TYPES.DECODE_FAILED]: "Couldn't convert this file.",
  [ERROR_TYPES.ENCODE_FAILED]: "Couldn't save the converted file.",
  [ERROR_TYPES.CODEC_LOAD_FAILED]: "Please update your browser.",
  [ERROR_TYPES.MEMORY_EXCEEDED]: "This file is too large for your browser.",
  [ERROR_TYPES.FILE_TOO_LARGE]: "This file is very large and may take a while.",
  [ERROR_TYPES.UNKNOWN]: "Something went wrong. Please try again.",
};

// Guidance messages for each error type
const ERROR_GUIDANCE = {
  [ERROR_TYPES.UNSUPPORTED_FORMAT]:
    "CovertConvert works with HEIC, WebP, AVIF, TIFF, PNG, BMP, and GIF.",
  [ERROR_TYPES.DETECTION_FAILED]:
    "The file may be corrupted or incomplete.",
  [ERROR_TYPES.DECODE_FAILED]:
    "The file may be corrupted or in an unsupported variant.",
  [ERROR_TYPES.ENCODE_FAILED]:
    "Try refreshing the page and converting again.",
  [ERROR_TYPES.CODEC_LOAD_FAILED]:
    "Your browser doesn't support this file type. Try Chrome, Firefox, Safari, or Edge.",
  [ERROR_TYPES.MEMORY_EXCEEDED]:
    "Try a smaller file or close other browser tabs.",
  [ERROR_TYPES.FILE_TOO_LARGE]:
    "Consider compressing the file first or converting on desktop.",
  [ERROR_TYPES.UNKNOWN]:
    "If this keeps happening, try a different browser.",
};

/**
 * Get user-facing error message
 * @param {string} errorType - Error type constant
 * @returns {string}
 */
function getUserMessage(errorType) {
  return USER_MESSAGES[errorType] || USER_MESSAGES[ERROR_TYPES.UNKNOWN];
}

/**
 * Get guidance for an error
 * @param {string} errorType - Error type constant
 * @returns {string}
 */
function getErrorGuidance(errorType) {
  return ERROR_GUIDANCE[errorType] || ERROR_GUIDANCE[ERROR_TYPES.UNKNOWN];
}

/**
 * Get full error message with guidance
 * @param {string} errorType - Error type constant
 * @returns {string}
 */
function getFullErrorMessage(errorType) {
  return `${getUserMessage(errorType)} ${getErrorGuidance(errorType)}`;
}

/**
 * Format batch result message
 * @param {number} success - Number of successful conversions
 * @param {number} total - Total number of files
 * @returns {string}
 */
function getBatchResultMessage(success, total) {
  if (success === total) {
    return total === 1 ? 'File converted!' : `All ${total} files converted!`;
  }
  if (success === 0) {
    return total === 1 ? "Couldn't convert this file." : "Couldn't convert any files.";
  }
  return `Converted ${success} of ${total} files.`;
}

/**
 * Create structured error for logging
 * @param {string} type - Error type
 * @param {object} context - Additional context
 * @returns {object}
 */
function createError(type, context = {}) {
  return {
    type,
    message: getUserMessage(type),
    guidance: getErrorGuidance(type),
    timestamp: new Date().toISOString(),
    ...context,
  };
}

// Named exports only (per architecture)
export {
  ERROR_TYPES,
  USER_MESSAGES,
  ERROR_GUIDANCE,
  getUserMessage,
  getErrorGuidance,
  getFullErrorMessage,
  getBatchResultMessage,
  createError,
};
