# Henka Convert

Henka Convert is a local-first file conversion web app. Conversion engines run in the user's browser; the deployed site only serves static frontend assets.

## Stack

- SvelteKit with Svelte 5 and TypeScript
- `@sveltejs/adapter-static` for static deployment without a runtime backend
- Vite and Tailwind CSS v4 (`@tailwindcss/vite`)
- Bits UI for accessible, unstyled interaction primitives
- `@lucide/svelte` for icons
- Mediabunny for local video and audio conversion, with the official MP3 encoder extension for MP3 output

Format-specific conversion engines are client-side modules and Web Workers. Browser-only engines load when their converter is selected; conversion does not send files to an API or backend. Avoid importing browser-only conversion engines from server-rendered module scope.

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
