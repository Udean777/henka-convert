import { INDEXABLE_ROUTES, absoluteUrl } from "$lib/seo/site";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = () => {
  const urls = INDEXABLE_ROUTES.map(
    (path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`,
  ).join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
