<script lang="ts">
  import type { Language } from "$lib/i18n/messages";
  import { absoluteUrl, SITE_ORIGIN, SOCIAL_IMAGE_PATH } from "$lib/seo/site";

  let {
    title,
    description,
    path,
    language,
    website = false,
  }: {
    title: string;
    description: string;
    path: string;
    language: Language;
    website?: boolean;
  } = $props();

  const canonical = $derived(absoluteUrl(path));
  const socialImage = absoluteUrl(SOCIAL_IMAGE_PATH);
  const locale = $derived(language === "id" ? "id_ID" : "en_US");
  const websiteJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Henka Convert",
    alternateName: "Henka",
    url: `${SITE_ORIGIN}/`,
  }).replaceAll("<", "\\u003c");
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Henka Convert" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:locale" content={locale} />
  <meta property="og:image" content={socialImage} />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="628" />
  <meta
    property="og:image:alt"
    content="Folded Ribbon artwork for Henka Convert, a browser-based file conversion lab"
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={socialImage} />
  <meta
    name="twitter:image:alt"
    content="Folded Ribbon artwork for Henka Convert, a browser-based file conversion lab"
  />
  {#if website}
    {@html `<script type="application/ld+json">${websiteJsonLd}</script>`}
  {/if}
</svelte:head>
