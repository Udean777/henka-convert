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
│   └── types.ts                        # Shared jobs and conversion output types
├── image/
│   ├── convert.ts                      # Worker entry point
│   └── image.worker.ts                 # Native decode / HEIC decode and encode
├── pdf/
│   └── convert.ts                      # PDF pages to images or selectable text
└── documents/
    └── convert.ts                      # Experimental DOCX to HTML, text, Markdown

src/lib/components/
└── FileDropzone.svelte                 # Shared accessible file picker and drop area

src/lib/features/converter/
└── ConverterWorkspace.svelte           # Queue, format controls, progress, downloads
```

The first MVP supports JPG/JPEG, PNG, WebP, HEIC/HEIF input to JPG, PNG, or
WebP; PDF pages to PNG/JPG or selectable text to TXT; and experimental DOCX
export to HTML, TXT, or Markdown. Audio and video are not part of this release.
Heavy PDF and DOCX code is dynamically imported, and image conversion runs in
a Web Worker. PDF pages are rendered one at a time and capped at 16 megapixels
per output page. Multi-file outputs can be downloaded together as a ZIP.

## Boundaries

- Keep `src/routes` focused on URL structure, page composition, route metadata,
  and SvelteKit route options. Route-only components may stay beside their
  route; reusable cross-feature UI belongs in `src/lib/components`.
- Keep each converter's implementation and UI inside its feature. Put only
  genuinely shared format metadata, request/result types, and limits in
  `converter/shared`.
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
