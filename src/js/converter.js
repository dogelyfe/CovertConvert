/**
 * Converter Module
 * Conversion pipeline with Canvas API (Tier 1) and WASM codecs (Tier 2)
 *
 * Architecture: Named exports, Result objects { ok, data, error }, module-scoped state
 */

import { ERROR_TYPES } from './errors.js';
import { getCodec } from './codecs/loader.js';

// Constants
const JPEG_DEFAULT_QUALITY = 0.92;
const SUPPORTED_OUTPUT_FORMATS = ['jpeg', 'png'];

// Reusable canvas for encoding (prevents memory pressure during batch processing)
let encodingCanvas = null;

/**
 * Get or create the shared encoding canvas
 * Reusing a single canvas prevents GC pressure during large batches
 * @param {number} width - Required width
 * @param {number} height - Required height
 * @returns {HTMLCanvasElement}
 */
function getEncodingCanvas(width, height) {
  if (!encodingCanvas) {
    encodingCanvas = document.createElement('canvas');
  }
  encodingCanvas.width = width;
  encodingCanvas.height = height;
  return encodingCanvas;
}

/**
 * Release canvas memory after batch processing
 * Called by resetState to free pixel buffer
 */
function releaseEncodingCanvas() {
  if (encodingCanvas) {
    encodingCanvas.width = 0;
    encodingCanvas.height = 0;
  }
}

// Module-scoped state (per architecture)
let state = {
  files: [],
  validatedFiles: [],
  currentIndex: 0,
  outputFormat: 'jpeg',
  quality: JPEG_DEFAULT_QUALITY,
  status: 'idle', // idle | converting | done | error
  results: [],
};

/**
 * Get current state (immutable copy)
 */
function getState() {
  return { ...state };
}

/**
 * Set files to convert
 * @param {Array} validatedFiles - Array of validated file objects from detector
 */
function setFiles(validatedFiles) {
  state.files = validatedFiles.map(v => v.file);
  state.validatedFiles = validatedFiles;
  state.currentIndex = 0;
  state.results = [];
  state.status = 'idle';
}

/**
 * Set output format
 * @param {string} format - 'jpeg' or 'png'
 */
function setOutputFormat(format) {
  if (SUPPORTED_OUTPUT_FORMATS.includes(format)) {
    state.outputFormat = format;
  }
}

/**
 * Set JPEG quality
 * @param {number} quality - 0.0 to 1.0
 */
function setQuality(quality) {
  state.quality = Math.max(0.01, Math.min(1.0, quality));
}

/**
 * Reset state to initial values
 * Also releases canvas memory to prevent accumulation
 */
function resetState() {
  state = {
    files: [],
    validatedFiles: [],
    currentIndex: 0,
    outputFormat: 'jpeg',
    quality: JPEG_DEFAULT_QUALITY,
    status: 'idle',
    results: [],
  };

  // Release canvas memory after batch completes
  releaseEncodingCanvas();
}

/**
 * Load image file into an Image element
 * @param {File} file - Image file
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Convert image to target format using Canvas API
 * Uses shared canvas to prevent memory pressure during batch processing
 * @param {HTMLImageElement} img - Loaded image
 * @param {string} outputFormat - 'jpeg' or 'png'
 * @param {number} quality - JPEG quality (0.0-1.0)
 * @returns {Promise<Blob>}
 */
function encodeToBlobFromImage(img, outputFormat, quality) {
  return new Promise((resolve, reject) => {
    const canvas = getEncodingCanvas(img.naturalWidth, img.naturalHeight);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // Draw image to canvas
    ctx.drawImage(img, 0, 0);

    // Convert to blob
    const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    const encodingQuality = outputFormat === 'jpeg' ? quality : undefined;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to encode image'));
        }
      },
      mimeType,
      encodingQuality
    );
  });
}

/**
 * Convert ImageData to blob (for Tier 2 codec output)
 * Uses shared canvas to prevent memory pressure during batch processing
 * @param {ImageData} imageData - Decoded image data from WASM codec
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} outputFormat - 'jpeg' or 'png'
 * @param {number} quality - JPEG quality (0.0-1.0)
 * @returns {Promise<Blob>}
 */
function encodeToBlobFromImageData(imageData, width, height, outputFormat, quality) {
  return new Promise((resolve, reject) => {
    const canvas = getEncodingCanvas(width, height);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // Put ImageData to canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert to blob
    const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    const encodingQuality = outputFormat === 'jpeg' ? quality : undefined;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to encode image'));
        }
      },
      mimeType,
      encodingQuality
    );
  });
}

/**
 * Generate output filename
 * @param {string} originalName - Original file name
 * @param {string} outputFormat - Target format
 * @returns {string}
 */
function generateOutputFilename(originalName, outputFormat) {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const extension = outputFormat === 'jpeg' ? 'jpg' : 'png';
  return `${baseName}.${extension}`;
}

/**
 * Convert a single file (Tier 1 - Canvas API)
 * @param {File} file - File to convert
 * @param {object} fileInfo - Validated file info from detector
 * @param {string} outputFormat - Target format
 * @param {number} quality - JPEG quality
 * @returns {Promise<{ok: boolean, data?: object, error?: object}>}
 */
async function convertFileTier1(file, fileInfo, outputFormat, quality) {
  try {
    // Load image
    const img = await loadImage(file);

    // Encode to target format
    const blob = await encodeToBlobFromImage(img, outputFormat, quality);

    // Generate output filename
    const outputName = generateOutputFilename(file.name, outputFormat);

    return {
      ok: true,
      data: {
        blob,
        name: outputName,
        originalName: file.name,
        inputFormat: fileInfo.format,
        outputFormat,
        size: blob.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      },
    };
  } catch (error) {
    console.error('[CovertConvert] Tier 1 conversion failed:', error);
    return {
      ok: false,
      error: {
        type: ERROR_TYPES.DECODE_FAILED,
        message: error.message,
        file: file.name,
        inputFormat: fileInfo?.format,
      },
    };
  }
}

/**
 * Convert a single file (Tier 2 - WASM Codec)
 * @param {File} file - File to convert
 * @param {object} fileInfo - Validated file info from detector
 * @param {string} outputFormat - Target format
 * @param {number} quality - JPEG quality
 * @returns {Promise<{ok: boolean, data?: object, error?: object}>}
 */
async function convertFileTier2(file, fileInfo, outputFormat, quality) {
  try {
    // Load codec for this format
    const codecResult = await getCodec(fileInfo.format);

    if (!codecResult.ok) {
      return {
        ok: false,
        error: {
          type: ERROR_TYPES.CODEC_LOAD_FAILED,
          message: codecResult.error.message,
          file: file.name,
          inputFormat: fileInfo.format,
        },
      };
    }

    const codec = codecResult.data;

    // Decode using WASM codec
    const decoded = await codec.decode(file);

    // Encode to target format
    const blob = await encodeToBlobFromImageData(
      decoded.imageData,
      decoded.width,
      decoded.height,
      outputFormat,
      quality
    );

    // Generate output filename
    const outputName = generateOutputFilename(file.name, outputFormat);

    return {
      ok: true,
      data: {
        blob,
        name: outputName,
        originalName: file.name,
        inputFormat: fileInfo.format,
        outputFormat,
        size: blob.size,
        width: decoded.width,
        height: decoded.height,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        type: ERROR_TYPES.DECODE_FAILED,
        message: error.message,
        file: file.name,
        inputFormat: fileInfo?.format,
      },
    };
  }
}

/**
 * Convert a single file (auto-selects Tier 1 or Tier 2)
 * @param {File} file - File to convert
 * @param {object} fileInfo - Validated file info from detector
 * @param {string} outputFormat - Target format
 * @param {number} quality - JPEG quality
 * @returns {Promise<{ok: boolean, data?: object, error?: object}>}
 */
async function convertFile(file, fileInfo, outputFormat, quality) {
  if (fileInfo.tier === 2) {
    return convertFileTier2(file, fileInfo, outputFormat, quality);
  }
  return convertFileTier1(file, fileInfo, outputFormat, quality);
}

/**
 * Convert all queued files
 * @param {Function} onProgress - Progress callback (current, total, result)
 * @returns {Promise<{ok: boolean, data?: object, error?: object}>}
 */
async function convertAll(onProgress) {
  if (state.validatedFiles.length === 0) {
    return {
      ok: false,
      error: {
        type: ERROR_TYPES.UNKNOWN,
        message: 'No files to convert',
      },
    };
  }

  state.status = 'converting';
  state.results = [];
  state.currentIndex = 0;

  const total = state.validatedFiles.length;
  const successful = [];
  const failed = [];

  for (let i = 0; i < total; i++) {
    state.currentIndex = i;
    const fileInfo = state.validatedFiles[i];

    // Report progress (before conversion)
    if (onProgress) {
      onProgress(i + 1, total, null);
    }

    // Convert file (auto-selects Tier 1 or Tier 2)
    const result = await convertFile(
      fileInfo.file,
      fileInfo,
      state.outputFormat,
      state.quality
    );

    if (result.ok) {
      successful.push(result.data);
      state.results.push(result);
    } else {
      failed.push({
        file: fileInfo.file.name,
        error: result.error,
      });
      state.results.push(result);
    }

    // Report progress with result
    if (onProgress) {
      onProgress(i + 1, total, result);
    }
  }

  state.status = successful.length > 0 ? 'done' : 'error';

  return {
    ok: successful.length > 0,
    data: {
      successful,
      failed,
      total,
      successCount: successful.length,
      failCount: failed.length,
    },
  };
}

/**
 * Check if format is Tier 1 (Canvas-supported)
 * @param {string} format - Format name
 * @returns {boolean}
 */
function isTier1Format(format) {
  const tier1 = ['png', 'jpeg', 'webp', 'gif', 'bmp'];
  return tier1.includes(format);
}

// Named exports only (per architecture)
export {
  getState,
  setFiles,
  setOutputFormat,
  setQuality,
  resetState,
  convertFile,
  convertAll,
  isTier1Format,
  generateOutputFilename,
  JPEG_DEFAULT_QUALITY,
  SUPPORTED_OUTPUT_FORMATS,
};
