# macOS Droplet Converters

Drag-and-drop image converters for macOS. Drop files onto the app icon to convert.

## Available Droplets

| Droplet | Input | Output |
|---------|-------|--------|
| Any to PNG.app | Any sips-compatible format | PNG |
| HEIC to JPEG.app | HEIC/HEIF | JPEG |
| WebP to JPEG.app | WebP | JPEG |

## Usage

1. Double-click to "install" (or drag to Applications)
2. Drag image files onto the app icon
3. Converted files appear in an output folder next to the droplet

## Supported Input Formats

The "Any to PNG" droplet uses macOS `sips` and supports:
- HEIC/HEIF (iPhone photos)
- JPEG/JPG
- PNG
- TIFF
- GIF
- BMP
- WebP (macOS 11+)

## Source Code

The `.applescript` files contain the source. To recompile:

```bash
osacompile -o "Any to PNG.app" "Any to PNG.applescript"
```
