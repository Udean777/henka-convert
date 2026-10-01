# Frontend architecture

This app is a statically deployed SvelteKit site. File conversion runs in the
user's browser; the project does not need an application backend.

## Current structure

```text
src/
├── app.css
├── app.html
├── lib/
│   ├── assets/                         # Imported, build-processed assets
│   ├── components/                     # UI shared across unrelated features
│   ├── features/
│   │   └── preferences/                # Theme and language behavior + controls
│   └── i18n/                           # Shared language types and messages
└── routes/
    ├── +layout.svelte                  # App shell and per-app preference context
    ├── +layout.ts                      # Static prerender setting
    └── +page.svelte                    # Home/converter route composition

static/                                 # Files that need stable public URLs
docs/                                   # Project decisions and contributor docs
```

## Where conversion code belongs

```text
src/lib/features/converter/
├── shared/
│   ├── download.ts                     # Local single-file and ZIP downloads
│   ├── files.ts                        # File type checks and display helpers
│   ├── limits.ts                       # Shared pixel and output-size limits
│   └── types.ts                        # Shared jobs and conversion output types
├── image/
│   ├── capabilities.worker.ts          # Check browser worker and WebAssembly support
│   ├── codecs.ts                       # Local WASM codec loading and per-format options
│   ├── convert.ts                      # Small image-conversion entry point
│   ├── errors.ts                       # Image-specific conversion error type
│   ├── image.worker.ts                 # Decode, normalize, and encode orchestration
│   ├── svg.ts                          # SVG validation, sizing, and rasterization
│   ├── tiff.ts                         # Lazy TIFF decode; first page only
│   ├── types.ts                        # Image formats and image error codes
│   └── worker-client.ts                # Worker lifecycle and message protocol
├── pdf/
│   ├── convert.ts                      # PDF pages to images or selectable text
│   └── types.ts                        # PDF-only output formats
└── documents/
    ├── convert.ts                      # Experimental DOCX to HTML, text, Markdown
    └── types.ts                        # DOCX output formats

src/lib/components/
└── FileDropzone.svelte                 # Shared accessible file picker and drop area

src/lib/features/converter/
├── ConverterWorkspace.svelte           # Compose converter UI and shared preferences
├── ConversionOptions.svelte            # Target format and format-specific options
├── ConversionJobList.svelte            # Job progress, actions, and downloads
├── run-conversion.ts                    # Dispatch a typed job to its converter
└── workspace.svelte.ts                 # Per-instance queue and conversion orchestration
```

The image converter accepts JPG/JPEG, PNG, WebP, AVIF, SVG, BMP, TIFF, and HEIC/HEIF.
It offers JPG, PNG, WebP, and AVIF output when the browser supports workers,
OffscreenCanvas, and WebAssembly. JPEG, PNG, WebP, and AVIF output use bundled
WebAssembly codecs so the available formats do not depend on each browser's
native canvas encoders. Native image decoding is used when available; bundled
WebAssembly decoders provide a fallback for JPEG, PNG, WebP, and AVIF. Codecs
load only when a conversion needs them. TIFF decoding is also lazy-loaded in
the worker; multi-page TIFF input converts its first page. HEIC/HEIF decoding
remains a separate lazy-loaded path.
SVG output is rasterized at a user-selected width with its aspect ratio
preserved; the resulting bitmap is transferred to the image worker for encoding.
Raster inputs and rendered SVG outputs are limited to 40 megapixels and 16,384
pixels per side to reduce memory pressure. PDF pages can be exported to PNG/JPG
or selectable text; DOCX export to HTML, TXT, or Markdown remains experimental.
Audio and video are not part of this release. Heavy PDF and DOCX code is
dynamically imported. Raster conversion and output encoding run in a Web Worker;
SVG is decoded through the browser's image loader, then its bitmap is transferred
to the worker. PDF pages are rendered one at a time and capped at 16 megapixels
per output page. Multi-file outputs can be downloaded together as a ZIP.

## Boundaries

- Keep `src/routes` focused on URL structure, page composition, route metadata,
  and SvelteKit route options. Route-only components may stay beside their
  route; reusable cross-feature UI belongs in `src/lib/components`.
- Keep each converter's implementation and UI inside its feature. Put only
  genuinely shared job/result types and limits in `converter/shared`. Keep
  format types beside their converter so unsupported format combinations are
  excluded by the type system.
- Keep the converter workspace as composition. Queue state and conversion
  orchestration belong in the per-instance `workspace.svelte.ts` factory; UI
  components should own a small, coherent part of the workspace.
- Keep image worker protocol and pixel normalization in the worker, while SVG
  preparation, worker lifecycle, and WASM codec configuration stay in their
  own image modules. Add new modules when they establish a useful boundary,
  rather than splitting every helper into a separate file.
- Create browser APIs (`File`, `Blob`, canvas, media elements, object URLs,
  `localStorage`, and `Worker`) in client lifecycle code or in response to a
  user action. Do not touch them at module initialization, so prerendering stays
  safe.
- Load heavy codec libraries only when the corresponding conversion is chosen.
  Move CPU-intensive work to a worker when it would otherwise block controls.
  Vite supports workers through `new Worker(new URL('./worker.ts', import.meta.url),
{ type: 'module' })`.
- Do not add `src/lib/server` or `.server.ts` for conversion logic: that code
  must stay in the browser. Keep credentials and server-only behavior out of
  this project unless the product scope changes.
- Import source assets from `src/lib/assets` so Vite can fingerprint them.
  Reserve `static/` for files that need a stable path, such as `robots.txt`.
- Keep the current static adapter and prerendering. The converter page can be
  rendered as static HTML and use browser-side code after hydration; turning
  off SSR globally would discard the rendered HTML without helping conversion.
- Add route groups only when distinct URL sections need distinct layouts. Do
  not add a second router or a backend-style domain/use-case/adapter hierarchy
  for the current browser-only feature set.
