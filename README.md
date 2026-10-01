# Henka Convert

Henka Convert is a local-first file conversion web app. Conversion engines run in the user's browser; the deployed site only serves static frontend assets.

## Stack

- SvelteKit with Svelte 5 and TypeScript
- `@sveltejs/adapter-static` for static deployment without a runtime backend
- Vite and Tailwind CSS v4 (`@tailwindcss/vite`)
- Bits UI for accessible, unstyled interaction primitives
- `@lucide/svelte` for icons
- FFmpeg.wasm for local audio and video conversion with fixed codec profiles
- Mammoth, Marked, Turndown, LinkeDOM, and docx for local document conversion
- Papa Parse for local CSV and TSV parsing and serialization
- SheetJS Community Edition for local spreadsheet and HTML table conversion
- WebAssembly image codecs for JPEG, PNG, WebP, AVIF, and JPEG XL
- `elheif` and `gifenc` for local HEIC and GIF encoding
- PDF.js and `pdf-lib` for PDF page export and image-to-PDF conversion

Format-specific conversion engines are client-side modules and Web Workers. Browser-only engines load when their converter is selected; conversion does not send files to an API or backend. Avoid importing browser-only conversion engines from server-rendered module scope.

## Supported conversions

- Images: JPG, PNG, WebP, AVIF, SVG, BMP, TIFF, GIF, ICO, JPEG XL, HEIC, and HEIF inputs. Outputs include JPEG, PNG, WebP, AVIF, HEIC, BMP, TIFF, GIF, ICO, JPEG XL, SVG, and PDF. GIF inputs and multi-page TIFF inputs use their first frame/page. Raster-to-SVG embeds a PNG image; it does not vectorize pixels.
- Documents: PDF to PNG, JPEG, WebP, AVIF, HEIC, BMP, TIFF, GIF, ICO, JPEG XL, or selectable text; images to PDF; and experimental DOCX to HTML, text, or Markdown
- Video: MP4, MOV/QuickTime, WebM, MKV, AVI, M4V, 3GP, MPEG/MPG, and TS input and output. Output profiles use H.264/AAC, VP9/Opus, MPEG-4/MP3, or MPEG-2/MP2, depending on the container.
- Audio: MP3, WAV, M4A/AAC, OGG/Opus, FLAC, AIFF, and WMA input and output
- Documents: DOCX, HTML, TXT, and Markdown input and output. DOCX conversion preserves basic text structure; advanced layout, styles, and embedded media can be lost. HTML output is sanitized.
- Data tables: CSV, TSV, JSON, XLSX, XLS, ODS, and HTML table conversions. CSV/TSV use the first row as headers and keep cells as text. JSON input must be an array of flat objects; nested values are not supported. Spreadsheet conversion uses one selected worksheet, exports one worksheet, and does not preserve formulas, macros, or styling. HTML input reads the first table.

Data table conversion runs in a browser worker and accepts files up to 20 MB. XLSX worksheets are limited to 1,000,000 cells per conversion.

Audio and video conversion uses a single-thread FFmpeg.wasm core that is loaded on the first media conversion. Its download is about 31 MB; conversion time depends on the file and device. The bundled `@ffmpeg/core` package is GPL-2.0-or-later, so review the included engine's license and distribution obligations before publishing a release. See the [format matrix](docs/format-matrix.md) for per-format behavior and limits.

## Development

```sh
bun install
bun run dev
```

Check the app with:

```sh
bun run check
bun run build
```

## Static deployment

`adapter-static` produces static files in `build/`. Routes should be prerenderable. No API routes, server functions, database, or file upload service are part of the product architecture.

## References

- [SvelteKit project setup](https://svelte.dev/docs/kit/creating-a-project)
- [SvelteKit static site generation](https://svelte.dev/docs/kit/adapter-static)
- [Tailwind CSS with SvelteKit](https://tailwindcss.com/docs/installation/framework-guides/sveltekit)
- [Bits UI](https://www.bits-ui.com/)
