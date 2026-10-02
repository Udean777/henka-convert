<script lang="ts">
  import { getContext } from "svelte";
  import PreferenceControls from "$lib/features/preferences/PreferenceControls.svelte";
  import { messages } from "$lib/i18n/messages";
  import { siteChrome } from "$lib/features/marketing/content";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
  const chrome = $derived(siteChrome[preferences.language]);
</script>

<header class="app-header">
  <a class="brand" href="/" aria-label={text.homeLabel}>
    <img
      class="brand-mark"
      src="/brand/henka-folded-ribbon.webp"
      alt=""
      aria-hidden="true"
      width="40"
      height="40"
      decoding="async"
    />
    <span class="brand-name">henka</span>
    <span class="brand-descriptor">file lab</span>
  </a>
  <nav class="site-navigation" aria-label={chrome.navigation}>
    <a href="/">{chrome.home}</a>
    <a href="/convert">{chrome.convert}</a>
    <a href="/formats">{chrome.formats}</a>
    <a href="/help">{chrome.help}</a>
  </nav>
  <PreferenceControls />
</header>

<style>
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 1.1rem;
    flex-wrap: wrap;
  }

  .site-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(0.8rem, 2vw, 1.6rem);
    margin-left: auto;
  }

  .site-navigation a {
    border-bottom: 2px solid transparent;
    padding-block: 0.35rem;
    color: var(--ink-muted);
    font-size: 0.84rem;
    font-weight: 700;
    text-decoration: none;
  }

  .site-navigation a:hover,
  .site-navigation a:focus-visible {
    border-color: var(--riso-pink);
    color: var(--ink);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    color: var(--ink);
    text-decoration: none;
  }

  .brand-mark {
    display: block;
    width: 2.5rem;
    height: 2.5rem;
    flex: none;
    object-fit: contain;
  }

  .brand-name {
    font-size: 1.25rem;
    font-weight: 850;
    letter-spacing: -0.07em;
  }

  .brand-descriptor {
    align-self: end;
    margin: 0 0 0.22rem 0.15rem;
    color: var(--ink-muted);
    font-size: 0.63rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  @media (max-width: 480px) {
    .app-header {
      align-items: flex-start;
    }

    .site-navigation {
      order: 3;
      width: 100%;
      justify-content: space-between;
      gap: 0.5rem;
      margin: 0;
    }

    .site-navigation a {
      font-size: 0.78rem;
    }

    .brand-descriptor {
      display: none;
    }
  }
</style>
