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
  // Resize settings
  resizeMode: 'none', // none | long-side | short-side | width | height
  resizeValue: null,  // target dimension in pixels
  resizeNoUpscale: true, // don't enlarge smaller images
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
 * Set resize settings
 * @param {object} settings - Resize settings
 * @param {string} settings.mode - 'none' | 'long-side' | 'short-side' | 'width' | 'height'
 * @param {number|null} settings.value - Target dimension in pixels
 * @param {boolean} settings.noUpscale - Don't enlarge smaller images
 */
function setResizeSettings(settings) {
  state.resizeMode = settings.mode || 'none';
  state.resizeValue = settings.value || null;
  state.resizeNoUpscale = settings.noUpscale ?? true;
}

/**
 * Calculate new dimensions based on resize mode
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {string} mode - Resize mode
 * @param {number} targetValue - Target dimension in pixels
 * @param {boolean} noUpscale - Don't enlarge smaller images
 * @returns {{width: number, height: number, scale: number}}
 */
function calculateResizeDimensions(originalWidth, originalHeight, mode, targetValue, noUpscale) {
  if (mode === 'none' || !targetValue) {
    return { width: originalWidth, height: originalHeight, scale: 1 };
  }

  const aspectRatio = originalWidth / originalHeight;
  const isLandscape = originalWidth >= originalHeight;
  const longSide = Math.max(originalWidth, originalHeight);
  const shortSide = Math.min(originalWidth, originalHeight);

  let newWidth, newHeight;

  switch (mode) {
    case 'long-side':
      // Resize so the longer side equals targetValue
      if (noUpscale && longSide <= targetValue) {
        return { width: originalWidth, height: originalHeight, scale: 1 };
      }
      if (isLandscape) {
        newWidth = targetValue;
        newHeight = Math.round(targetValue / aspectRatio);
      } else {
        newHeight = targetValue;
        newWidth = Math.round(targetValue * aspectRatio);
      }
      break;

    case 'short-side':
      // Resize so the shorter side equals targetValue
      if (noUpscale && shortSide <= targetValue) {
        return { width: originalWidth, height: originalHeight, scale: 1 };
      }
      if (isLandscape) {
        newHeight = targetValue;
        newWidth = Math.round(targetValue * aspectRatio);
      } else {
        newWidth = targetValue;
        newHeight = Math.round(targetValue / aspectRatio);
      }
      break;

    case 'width':
      // Resize to specific width
      if (noUpscale && originalWidth <= targetValue) {
        return { width: originalWidth, height: originalHeight, scale: 1 };
      }
      newWidth = targetValue;
      newHeight = Math.round(targetValue / aspectRatio);
      break;

    case 'height':
      // Resize to specific height
      if (noUpscale && originalHeight <= targetValue) {
        return { width: originalWidth, height: originalHeight, scale: 1 };
      }
      newHeight = targetValue;
      newWidth = Math.round(targetValue * aspectRatio);
      break;

    default:
      return { width: originalWidth, height: originalHeight, scale: 1 };
  }

  // Ensure minimum dimensions
  newWidth = Math.max(1, newWidth);
  newHeight = Math.max(1, newHeight);

  const scale = newWidth / originalWidth;
  return { width: newWidth, height: newHeight, scale };
}

/**
 * Apply resize to a canvas
 * @param {HTMLCanvasElement} sourceCanvas - Source canvas
 * @param {number} newWidth - Target width
 * @param {number} newHeight - Target height
 * @returns {HTMLCanvasElement} Resized canvas (new instance)
 */
function applyResize(sourceCanvas, newWidth, newHeight) {
  if (newWidth === sourceCanvas.width && newHeight === sourceCanvas.height) {
    return sourceCanvas;
  }

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = newWidth;
  resizedCanvas.height = newHeight;

  const ctx = resizedCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight);

  return resizedCanvas;
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
    resizeMode: 'none',
    resizeValue: null,
    resizeNoUpscale: true,
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
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // Calculate resize dimensions
    const resizeDims = calculateResizeDimensions(
      originalWidth,
      originalHeight,
      state.resizeMode,
      state.resizeValue,
      state.resizeNoUpscale
    );

    // Create canvas from image, applying resize if needed
    let canvas = document.createElement('canvas');
    canvas.width = resizeDims.width;
    canvas.height = resizeDims.height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, resizeDims.width, resizeDims.height);

    // Encode to target format
    const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    const encodingQuality = outputFormat === 'jpeg' ? quality : undefined;

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode image'))),
        mimeType,
        encodingQuality
      );
    });

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
        width: resizeDims.width,
        height: resizeDims.height,
        originalWidth,
        originalHeight,
        resized: resizeDims.scale !== 1,
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
    const originalWidth = decoded.width;
    const originalHeight = decoded.height;

    // Calculate resize dimensions
    const resizeDims = calculateResizeDimensions(
      originalWidth,
      originalHeight,
      state.resizeMode,
      state.resizeValue,
      state.resizeNoUpscale
    );

    // Create canvas from decoded ImageData
    let canvas = document.createElement('canvas');
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    let ctx = canvas.getContext('2d');
    ctx.putImageData(decoded.imageData, 0, 0);

    // Apply resize if needed
    if (resizeDims.scale !== 1) {
      canvas = applyResize(canvas, resizeDims.width, resizeDims.height);
    }

    // Encode to target format
    const mimeType = outputFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
    const encodingQuality = outputFormat === 'jpeg' ? quality : undefined;

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode image'))),
        mimeType,
        encodingQuality
      );
    });

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
        width: resizeDims.width,
        height: resizeDims.height,
        originalWidth,
        originalHeight,
        resized: resizeDims.scale !== 1,
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

/**
 * Epic 6: Decode image and return canvas for optimization
 * Returns a NEW canvas (not the shared one) to allow optimization operations
 * @param {object} fileInfo - Validated file info from detector
 * @returns {Promise<HTMLCanvasElement|null>} Canvas with decoded image, or null on error
 */
async function getConvertedCanvas(fileInfo) {
  try {
    let img, imageData, width, height;

    if (fileInfo.tier === 2) {
      // Tier 2: Use WASM codec to decode
      const codecResult = await getCodec(fileInfo.format);
      if (!codecResult.ok) {
        return null;
      }

      const codec = codecResult.data;
      const decoded = await codec.decode(fileInfo.file);
      imageData = decoded.imageData;
      width = decoded.width;
      height = decoded.height;
    } else {
      // Tier 1: Load via Image element
      img = await loadImage(fileInfo.file);
      width = img.naturalWidth;
      height = img.naturalHeight;
    }

    // Create a new canvas (not shared, so optimizer can manipulate)
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    if (imageData) {
      // Tier 2: Put ImageData
      ctx.putImageData(imageData, 0, 0);
    } else if (img) {
      // Tier 1: Draw image
      ctx.drawImage(img, 0, 0);
    }

    return canvas;
  } catch (error) {
    console.error('[CovertConvert] getConvertedCanvas failed:', error);
    return null;
  }
}

// Named exports only (per architecture)
export {
  getState,
  setFiles,
  setOutputFormat,
  setQuality,
  setResizeSettings,
  resetState,
  convertFile,
  convertAll,
  isTier1Format,
  generateOutputFilename,
  getConvertedCanvas, // Epic 6
  JPEG_DEFAULT_QUALITY,
  SUPPORTED_OUTPUT_FORMATS,
};
