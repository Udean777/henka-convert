# SEO and public asset placement

The public origin is `https://henka-convert.vercel.app`, defined once in
`src/lib/seo/site.ts`. Change it there if the production domain changes. The
origin is used to build canonical URLs, social image URLs, JSON-LD, and the
prerendered sitemap.

## Page metadata

`src/lib/components/SeoHead.svelte` owns titles, descriptions, canonical links,
Open Graph tags, and Twitter card metadata. Each indexable route supplies its
localized page copy, route path, and language. The homepage also emits the
`WebSite` JSON-LD entity with the public site name. This keeps metadata in the
server-rendered HTML and avoids hand-maintained, inconsistent tags.

English and Indonesian currently share each route URL; the language preference
is client-side. The prerendered HTML therefore has English metadata by default,
then updates to the selected language in the browser. Do not add `hreflang`
until each language has a stable, separately crawlable URL.

## Crawl files

- `static/robots.txt` allows public pages to be crawled and points to the sitemap.
- `src/routes/sitemap.xml/+server.ts` prerenders only the canonical public routes.
- No `lastmod` values are emitted until content update dates are maintained as
  reliable data.

## Asset locations

Crawler-facing assets live in `static/` so they have stable root-relative URLs
and are copied unchanged by SvelteKit's static adapter:

- `/brand/henka-folded-ribbon.webp`: transparent brand mark used in the app header.
- `/favicon.webp` and `/favicon-32.webp`: browser icons.
- `/apple-touch-icon.webp`: iOS home-screen icon.
- `/icons/*.webp`: installable app icons referenced by `/site.webmanifest`.
- `/images/henka-convert-og.webp`: 1200 × 628 image for Open Graph and Twitter Cards.

All production image assets use WebP. This reduces transfer size but can limit
favicon discovery in Google Search and Apple Home Screen icon recognition,
which document PNG support specifically.

Use `$lib/assets` for assets that should be imported into components and
fingerprinted by Vite. Keep public paths stable for manifest, crawler, and
social-card references.

## Research notes

SvelteKit recommends route-specific titles and descriptions in `svelte:head`,
and its SEO guidance calls out SSR, canonical URL normalization, and sitemap
generation. Google recommends descriptive page metadata, crawlable links, and
canonical consistency; its site-name documentation calls for a homepage
`WebSite` entity. Open Graph defines the social metadata and image alt fields
used here. Google's favicon guidance recommends a stable, crawlable icon that
represents the site. See the official references:

- [SvelteKit SEO](https://svelte.dev/docs/kit/seo)
- [Google Search developer guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google site names](https://developers.google.com/search/docs/appearance/site-names)
- [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Open Graph protocol](https://ogp.me/)
