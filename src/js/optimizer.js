/**
 * Optimizer Module (Epic 6)
 * Filesize optimization via binary search on quality and/or resize
 *
 * Story 6.5: Filesize Optimization Algorithm
 * Story 6.7: Image Resize Implementation
 * Story 6.8: Image Type Detection
 */

// Algorithm bounds
const QUALITY_MIN = 10;
const QUALITY_MAX = 100;
const SCALE_MIN = 0.25;
const SCALE_MAX = 1.0;
const MAX_ITERATIONS = 8;

// Image type detection thresholds
const COLOR_VARIANCE_THRESHOLD = 2000; // Higher = more likely photo

/**
 * Detect if image is a photo or graphic based on color variance
 * Photos have high variance, graphics/screenshots have low variance
 * @param {HTMLCanvasElement} canvas - Canvas with image drawn
 * @returns {'photo' | 'graphic'} Image type classification
 */
function detectImageType(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Sample a grid of pixels (not full image for performance)
  const sampleSize = 100;
  const stepX = Math.max(1, Math.floor(width / 10));
  const stepY = Math.max(1, Math.floor(height / 10));

  const samples = [];

  for (let y = 0; y < height && samples.length < sampleSize; y += stepY) {
    for (let x = 0; x < width && samples.length < sampleSize; x += stepX) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      samples.push({
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
      });
    }
  }

  // Calculate color variance
  const avgR = samples.reduce((sum, p) => sum + p.r, 0) / samples.length;
  const avgG = samples.reduce((sum, p) => sum + p.g, 0) / samples.length;
  const avgB = samples.reduce((sum, p) => sum + p.b, 0) / samples.length;

  let variance = 0;
  for (const p of samples) {
    variance += Math.pow(p.r - avgR, 2);
    variance += Math.pow(p.g - avgG, 2);
    variance += Math.pow(p.b - avgB, 2);
  }
  variance /= samples.length;

  return variance > COLOR_VARIANCE_THRESHOLD ? 'photo' : 'graphic';
}

/**
 * Resize canvas to new dimensions
 * @param {HTMLCanvasElement} source - Source canvas
 * @param {number} scale - Scale factor (0-1)
 * @returns {HTMLCanvasElement} New canvas at scaled dimensions
 */
function resizeCanvas(source, scale) {
  const newWidth = Math.round(source.width * scale);
  const newHeight = Math.round(source.height * scale);

  const resized = document.createElement('canvas');
  resized.width = newWidth;
  resized.height = newHeight;

  const ctx = resized.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, newWidth, newHeight);

  return resized;
}

/**
 * Encode canvas to blob with given quality
 * @param {HTMLCanvasElement} canvas - Canvas to encode
 * @param {string} format - 'image/jpeg' or 'image/png'
 * @param {number} quality - Quality 0-1 for JPEG
 * @returns {Promise<Blob>} Encoded blob
 */
function encodeToBlob(canvas, format, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to encode image'));
        }
      },
      format,
      format === 'image/jpeg' ? quality : undefined
    );
  });
}

/**
 * Optimize image to target filesize using binary search
 * @param {HTMLCanvasElement} sourceCanvas - Original image canvas
 * @param {object} options - Optimization options
 * @param {number} options.targetBytes - Target filesize in bytes
 * @param {string} options.format - 'image/jpeg' or 'image/png'
 * @param {number} options.initialQuality - Starting quality (0-1)
 * @param {boolean} options.lockQuality - If true, only resize
 * @param {boolean} options.lockDimensions - If true, only adjust quality
 * @param {function} [options.onProgress] - Progress callback
 * @returns {Promise<{blob: Blob, quality: number, scale: number, iterations: number, hitTarget: boolean}>}
 */
async function optimizeToSize(sourceCanvas, options) {
  const {
    targetBytes,
    format,
    initialQuality,
    lockQuality = false,
    lockDimensions = false,
    onProgress,
  } = options;

  // For PNG, quality doesn't affect size much - only resize helps
  const isPng = format === 'image/png';

  // Determine which levers are available
  const canAdjustQuality = !lockQuality && !isPng;
  const canResize = !lockDimensions;

  // Detect image type for smart mode
  let imageType = 'photo';
  if (!lockQuality && !lockDimensions) {
    imageType = detectImageType(sourceCanvas);
  }

  // Initial encode to check if already under target
  let currentCanvas = sourceCanvas;
  let currentQuality = initialQuality;
  let currentScale = 1.0;
  let blob = await encodeToBlob(currentCanvas, format, currentQuality);
  let iterations = 0;

  // If already under target, return immediately
  if (blob.size <= targetBytes) {
    return {
      blob,
      quality: currentQuality,
      scale: currentScale,
      iterations: 0,
      hitTarget: true,
    };
  }

  // Best result tracking
  let bestBlob = blob;
  let bestQuality = currentQuality;
  let bestScale = currentScale;

  // Determine optimization strategy based on image type and locks
  // Photos tolerate quality loss better, graphics need sharpness
  const preferQualityFirst = canAdjustQuality && (lockDimensions || imageType === 'photo');
  const preferResizeFirst = canResize && (lockQuality || imageType === 'graphic');

  // Binary search on primary lever first, then secondary
  if (preferQualityFirst && canAdjustQuality) {
    // Try quality reduction first
    const result = await binarySearchQuality(
      currentCanvas,
      format,
      targetBytes,
      QUALITY_MIN / 100,
      currentQuality,
      MAX_ITERATIONS / 2
    );

    blob = result.blob;
    currentQuality = result.quality;
    iterations += result.iterations;

    if (blob.size <= targetBytes) {
      return {
        blob,
        quality: currentQuality,
        scale: currentScale,
        iterations,
        hitTarget: true,
      };
    }

    // Update best if closer
    if (blob.size < bestBlob.size) {
      bestBlob = blob;
      bestQuality = currentQuality;
    }
  }

  if ((preferResizeFirst || blob.size > targetBytes) && canResize) {
    // Try resize
    const result = await binarySearchScale(
      sourceCanvas,
      format,
      targetBytes,
      SCALE_MIN,
      SCALE_MAX,
      canAdjustQuality ? currentQuality : initialQuality,
      MAX_ITERATIONS - iterations
    );

    blob = result.blob;
    currentScale = result.scale;
    currentQuality = result.quality;
    iterations += result.iterations;

    if (blob.size <= targetBytes) {
      return {
        blob,
        quality: currentQuality,
        scale: currentScale,
        iterations,
        hitTarget: true,
      };
    }

    // Update best if closer
    if (blob.size < bestBlob.size) {
      bestBlob = blob;
      bestQuality = currentQuality;
      bestScale = currentScale;
    }
  }

  // If quality wasn't tried first and we still have iterations, try it now
  if (!preferQualityFirst && canAdjustQuality && iterations < MAX_ITERATIONS && blob.size > targetBytes) {
    const scaledCanvas = currentScale < 1 ? resizeCanvas(sourceCanvas, currentScale) : sourceCanvas;

    const result = await binarySearchQuality(
      scaledCanvas,
      format,
      targetBytes,
      QUALITY_MIN / 100,
      currentQuality,
      MAX_ITERATIONS - iterations
    );

    blob = result.blob;
    currentQuality = result.quality;
    iterations += result.iterations;

    if (blob.size <= targetBytes) {
      return {
        blob,
        quality: currentQuality,
        scale: currentScale,
        iterations,
        hitTarget: true,
      };
    }

    if (blob.size < bestBlob.size) {
      bestBlob = blob;
      bestQuality = currentQuality;
      bestScale = currentScale;
    }
  }

  // Return best effort
  return {
    blob: bestBlob,
    quality: bestQuality,
    scale: bestScale,
    iterations,
    hitTarget: bestBlob.size <= targetBytes,
  };
}

/**
 * Binary search on quality to find target size
 */
async function binarySearchQuality(canvas, format, targetBytes, minQ, maxQ, maxIter) {
  let lo = minQ;
  let hi = maxQ;
  let bestBlob = null;
  let bestQuality = maxQ;
  let iterations = 0;

  while (iterations < maxIter && hi - lo > 0.02) {
    const mid = (lo + hi) / 2;
    const blob = await encodeToBlob(canvas, format, mid);
    iterations++;

    if (blob.size <= targetBytes) {
      // Under target - try higher quality
      bestBlob = blob;
      bestQuality = mid;
      lo = mid;
    } else {
      // Over target - try lower quality
      hi = mid;
      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
        bestQuality = mid;
      }
    }
  }

  // Final encode at best quality if not set
  if (!bestBlob) {
    bestBlob = await encodeToBlob(canvas, format, lo);
    bestQuality = lo;
    iterations++;
  }

  return { blob: bestBlob, quality: bestQuality, iterations };
}

/**
 * Binary search on scale to find target size
 */
async function binarySearchScale(sourceCanvas, format, targetBytes, minScale, maxScale, quality, maxIter) {
  let lo = minScale;
  let hi = maxScale;
  let bestBlob = null;
  let bestScale = maxScale;
  let iterations = 0;

  while (iterations < maxIter && hi - lo > 0.05) {
    const mid = (lo + hi) / 2;
    const scaled = resizeCanvas(sourceCanvas, mid);
    const blob = await encodeToBlob(scaled, format, quality);
    iterations++;

    if (blob.size <= targetBytes) {
      // Under target - try larger scale
      bestBlob = blob;
      bestScale = mid;
      lo = mid;
    } else {
      // Over target - try smaller scale
      hi = mid;
      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
        bestScale = mid;
      }
    }
  }

  // Final encode at best scale if not set
  if (!bestBlob) {
    const scaled = resizeCanvas(sourceCanvas, lo);
    bestBlob = await encodeToBlob(scaled, format, quality);
    bestScale = lo;
    iterations++;
  }

  return { blob: bestBlob, scale: bestScale, quality, iterations };
}

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "487KB", "1.2MB")
 */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  } else if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
}

export {
  optimizeToSize,
  detectImageType,
  resizeCanvas,
  formatFileSize,
  QUALITY_MIN,
  QUALITY_MAX,
  SCALE_MIN,
  MAX_ITERATIONS,
};
