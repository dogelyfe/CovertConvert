/**
 * CovertConvert - Client-side image conversion
 * All processing happens in the browser. Files never leave the device.
 */

// State
let selectedFiles = [];
let outputFormat = 'jpeg';
let isConverting = false;

// DOM elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const fileItems = document.getElementById('file-items');
const convertBtn = document.getElementById('convert-btn');
const clearFilesBtn = document.getElementById('clear-files');
const progressSection = document.getElementById('progress-section');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const batchWarning = document.getElementById('batch-warning');
const btnJpg = document.getElementById('btn-jpg');
const btnPng = document.getElementById('btn-png');

// Lazy-loaded modules
let heifDecoder = null;
let JSZip = null;

// Supported formats
const SUPPORTED_EXTENSIONS = [
  '.heic', '.heif', '.webp', '.png', '.avif',
  '.tiff', '.tif', '.bmp', '.gif', '.jpg', '.jpeg'
];

const SUPPORTED_MIME_TYPES = [
  'image/heic', 'image/heif', 'image/webp', 'image/png',
  'image/avif', 'image/tiff', 'image/bmp', 'image/gif',
  'image/jpeg', 'image/jpg'
];

// Initialize
function init() {
  setupEventListeners();
}

function setupEventListeners() {
  // Format toggle
  btnJpg.addEventListener('click', () => setOutputFormat('jpeg'));
  btnPng.addEventListener('click', () => setOutputFormat('png'));

  // File input
  fileInput.addEventListener('change', handleFileSelect);

  // Drag and drop
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);

  // Buttons
  convertBtn.addEventListener('click', startConversion);
  clearFilesBtn.addEventListener('click', clearFiles);
}

function setOutputFormat(format) {
  outputFormat = format;

  if (format === 'jpeg') {
    btnJpg.className = 'px-4 py-1.5 text-sm font-medium rounded-md bg-brand-600 text-white transition-colors';
    btnPng.className = 'px-4 py-1.5 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 transition-colors';
  } else {
    btnPng.className = 'px-4 py-1.5 text-sm font-medium rounded-md bg-brand-600 text-white transition-colors';
    btnJpg.className = 'px-4 py-1.5 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 transition-colors';
  }
}

// Drag and drop handlers
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('drag-over');

  const files = Array.from(e.dataTransfer.files);
  addFiles(files);
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  addFiles(files);
  fileInput.value = ''; // Reset for re-selection
}

function addFiles(files) {
  const validFiles = files.filter(file => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const isValidExt = SUPPORTED_EXTENSIONS.includes(ext);
    const isValidMime = SUPPORTED_MIME_TYPES.includes(file.type) || file.type === '';
    return isValidExt || isValidMime;
  });

  selectedFiles = [...selectedFiles, ...validFiles];
  updateFileList();
}

function clearFiles() {
  selectedFiles = [];
  updateFileList();
}

function updateFileList() {
  if (selectedFiles.length === 0) {
    fileList.classList.add('hidden');
    convertBtn.classList.add('hidden');
    batchWarning.classList.add('hidden');
    return;
  }

  fileList.classList.remove('hidden');
  convertBtn.classList.remove('hidden');

  // Show warning for large batches
  if (selectedFiles.length > 20) {
    batchWarning.classList.remove('hidden');
  } else {
    batchWarning.classList.add('hidden');
  }

  fileItems.innerHTML = selectedFiles.map((file, index) => `
    <div class="file-item" data-index="${index}">
      <span class="file-name" title="${file.name}">${file.name}</span>
      <span class="file-size">${formatFileSize(file.size)}</span>
    </div>
  `).join('');
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Conversion
async function startConversion() {
  if (isConverting || selectedFiles.length === 0) return;

  isConverting = true;
  convertBtn.disabled = true;
  progressSection.classList.remove('hidden');

  const results = [];
  const total = selectedFiles.length;

  for (let i = 0; i < total; i++) {
    const file = selectedFiles[i];
    const fileItem = document.querySelector(`.file-item[data-index="${i}"]`);

    try {
      // Update UI
      fileItem.classList.add('converting');
      updateProgress((i / total) * 100, `Converting ${i + 1} of ${total}...`);

      // Convert
      const result = await convertFile(file);
      results.push(result);

      // Mark done
      fileItem.classList.remove('converting');
      fileItem.classList.add('done');
    } catch (err) {
      console.error(`Error converting ${file.name}:`, err);
      fileItem.classList.remove('converting');
      fileItem.classList.add('error');
    }
  }

  // Download results
  updateProgress(100, 'Preparing download...');
  await downloadResults(results);

  // Reset
  isConverting = false;
  convertBtn.disabled = false;
  progressSection.classList.add('hidden');
  updateProgress(0, '');
}

function updateProgress(percent, text) {
  progressBar.style.width = `${percent}%`;
  progressText.textContent = text || `${Math.round(percent)}%`;
}

async function convertFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  let imageData;

  // Decode based on format
  if (['heic', 'heif'].includes(ext)) {
    imageData = await decodeHEIC(file);
  } else if (ext === 'avif') {
    imageData = await decodeWithCanvas(file); // Browser native AVIF support
  } else {
    imageData = await decodeWithCanvas(file);
  }

  // Encode to target format
  const outputBlob = await encodeImage(imageData, outputFormat);
  const outputName = file.name.replace(/\.[^.]+$/, `.${outputFormat === 'jpeg' ? 'jpg' : 'png'}`);

  return { name: outputName, blob: outputBlob };
}

// Decode using Canvas API (PNG, WebP, BMP, GIF, TIFF via browser)
async function decodeWithCanvas(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');

      // White background for JPEG (transparency handling)
      if (outputFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to decode ${file.name}`));
    };

    img.src = url;
  });
}

// Decode HEIC using libheif-js
async function decodeHEIC(file) {
  // Lazy load libheif
  if (!heifDecoder) {
    await loadHeifDecoder();
  }

  const buffer = await file.arrayBuffer();
  const decoder = new heifDecoder.HeifDecoder();
  const data = decoder.decode(new Uint8Array(buffer));

  if (!data || data.length === 0) {
    throw new Error('Failed to decode HEIC');
  }

  const image = data[0];
  const width = image.get_width();
  const height = image.get_height();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // White background for JPEG
  if (outputFormat === 'jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  const imageData = ctx.createImageData(width, height);
  await new Promise((resolve, reject) => {
    image.display(imageData, (displayData) => {
      if (!displayData) {
        reject(new Error('HEIC display failed'));
        return;
      }
      ctx.putImageData(displayData, 0, 0);
      resolve();
    });
  });

  return canvas;
}

async function loadHeifDecoder() {
  // Load libheif-js from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/libheif-js@1.17.1/libheif-bundle.min.js';
    script.onload = () => {
      heifDecoder = window.libheif;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Encode to target format
async function encodeImage(canvas, format) {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpeg' ? 0.92 : undefined;

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to encode image'));
      }
    }, mimeType, quality);
  });
}

// Download results
async function downloadResults(results) {
  if (results.length === 0) return;

  if (results.length === 1) {
    // Single file - direct download
    downloadBlob(results[0].blob, results[0].name);
  } else {
    // Multiple files - create ZIP
    await downloadAsZip(results);
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadAsZip(results) {
  // Lazy load JSZip
  if (!JSZip) {
    await loadJSZip();
  }

  const zip = new JSZip();

  for (const result of results) {
    zip.file(result.name, result.blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, 'converted-images.zip');
}

async function loadJSZip() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = () => {
      JSZip = window.JSZip;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Start
init();
