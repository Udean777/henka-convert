<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { onMount, setContext } from "svelte";
  import "../app.css";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import { messages } from "$lib/i18n/messages";
  import { siteChrome, marketingCopy } from "$lib/features/marketing/content";
  import { createPreferences } from "$lib/features/preferences/preferences.svelte";
  import { PREFERENCES_CONTEXT } from "$lib/features/preferences/preferences-context";

  let { children } = $props();
  const preferences = createPreferences();
  setContext(PREFERENCES_CONTEXT, preferences);
  const text = $derived(messages[preferences.language]);
  const chrome = $derived(siteChrome[preferences.language]);
  const footerNote = $derived(
    marketingCopy[preferences.language].home.footerNote,
  );

  onMount(() => preferences.initialize());

  onNavigate((navigation) => {
    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => Promise<void>) => unknown;
    };

    if (
      !transitionDocument.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    return new Promise<void>((resolve) => {
      transitionDocument.startViewTransition!(async () => {
        resolve();
        await navigation.complete.catch(() => {});
      });
    });
  });
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=1" />
  <link rel="icon" type="image/webp" sizes="32x32" href="/favicon-32.webp" />
  <link rel="icon" type="image/webp" sizes="512x512" href="/favicon.webp" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.webp" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content={preferences.dark ? "#201d22" : "#f3e7cc"} />
</svelte:head>

<div class="flex min-h-screen flex-col px-[clamp(1rem,5vw,5rem)]">
  <AppHeader />
  {@render children()}
  <footer
    class="mx-auto flex w-full max-w-[1240px] flex-col justify-between gap-[0.4rem] border-t border-rule pt-5 pb-6 text-xs text-ink-muted sm:flex-row sm:gap-4"
  >
    <div class="grid gap-1.5">
      <strong class="text-[0.82rem] text-ink">Henka Convert</strong>
      <span>{footerNote}</span>
    </div>
    <nav class="flex flex-wrap gap-4" aria-label={chrome.navigation}>
      <a
        class="text-ink-muted underline-offset-4 hover:text-ink"
        href="/formats">{chrome.formats}</a
      >
      <a
        class="text-ink-muted underline-offset-4 hover:text-ink"
        href="/how-it-works">{chrome.howItWorks}</a
      >
      <a class="text-ink-muted underline-offset-4 hover:text-ink" href="/help"
        >{chrome.help}</a
      >
      <a
        class="text-ink-muted underline-offset-4 hover:text-ink"
        href="/privacy">{chrome.privacy}</a
      >
      <a class="text-ink-muted underline-offset-4 hover:text-ink" href="/about"
        >{chrome.about}</a
      >
    </nav>
  </footer>
</div>
