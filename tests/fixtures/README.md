# Test Fixtures

This directory contains test files for E2E testing.

## Directory Structure

```
fixtures/
├── valid/          # Valid image files for successful conversion tests
├── invalid/        # Invalid/corrupted files for error handling tests
└── edge-cases/     # Edge case files (large, unusual dimensions, etc.)
```

## Required Test Files

### valid/
One sample file per supported input format:
- `sample.heic` - HEIC image (iPhone photo)
- `sample.avif` - AVIF image
- `sample.tiff` - TIFF image
- `sample.webp` - WebP image
- `sample.png` - PNG image
- `sample.bmp` - BMP image
- `sample.gif` - GIF image (single frame)

### invalid/
- `corrupted.heic` - Truncated/corrupted HEIC
- `not-an-image.txt` - Text file with image extension
- `empty.png` - Zero-byte file

### edge-cases/
- `large-25mb.png` - File exceeding 25MB threshold
- `tiny-1x1.png` - Minimum dimension image
- `wide-10000x100.png` - Unusual aspect ratio

## Obtaining Test Files

Sample files can be generated using:
```bash
# Create 1x1 PNG
convert -size 1x1 xc:red tests/fixtures/valid/sample.png

# Or use online converters to create various formats
```
