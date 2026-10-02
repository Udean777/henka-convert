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
  <link rel="icon" type="image/webp" sizes="32x32" href="/favicon-32.webp" />
  <link rel="icon" type="image/webp" sizes="512x512" href="/favicon.webp" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.webp" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content={preferences.dark ? "#201d22" : "#f3e7cc"} />
</svelte:head>

<div class="site-frame">
  <AppHeader />
  {@render children()}
  <footer class="site-footer">
    <div class="footer-brand">
      <strong>Henka Convert</strong>
      <span>{footerNote}</span>
    </div>
    <nav class="footer-navigation" aria-label={chrome.navigation}>
      <a href="/formats">{chrome.formats}</a>
      <a href="/how-it-works">{chrome.howItWorks}</a>
      <a href="/help">{chrome.help}</a>
      <a href="/privacy">{chrome.privacy}</a>
      <a href="/about">{chrome.about}</a>
    </nav>
  </footer>
</div>

<style>
  .footer-brand {
    display: grid;
    gap: 0.35rem;
  }

  .footer-brand strong {
    color: var(--ink);
    font-size: 0.82rem;
  }

  .footer-navigation {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-navigation a {
    color: var(--ink-muted);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }

  .footer-navigation a:hover {
    color: var(--ink);
  }
</style>
