export const SITE_ORIGIN = "https://henka-convert.vercel.app";
export const SOCIAL_IMAGE_PATH = "/images/henka-convert-og.webp?v=2";

export const INDEXABLE_ROUTES = [
  "/",
  "/convert",
  "/formats",
  "/how-it-works",
  "/help",
  "/privacy",
  "/about",
] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}
