<script lang="ts">
  import { getContext } from "svelte";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import PageIntro from "$lib/features/marketing/ui/PageIntro.svelte";
  import InfoCards from "$lib/features/marketing/ui/InfoCards.svelte";
  import { marketingCopy } from "$lib/features/marketing/content";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(marketingCopy[preferences.language].about);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/about"
  language={preferences.language}
/>

<main class="page-main content-page">
  <PageIntro
    eyebrow={text.eyebrow}
    title={text.title}
    description={text.description}
  />
  <InfoCards cards={text.principles} />
  <a class="action-link" href="/convert"
    >{text.action}<span aria-hidden="true">↗</span></a
  >
</main>

<style>
  .content-page {
    padding-bottom: clamp(3rem, 8vw, 7rem);
  }

  .action-link {
    display: inline-flex;
    min-height: 3rem;
    align-items: center;
    gap: 0.7rem;
    margin-top: 2rem;
    border: 1px solid var(--ink);
    background: var(--riso-pink);
    box-shadow: 4px 4px 0 var(--ink);
    padding: 0.7rem 1rem;
    color: #201e1e;
    font-weight: 800;
    text-decoration: none;
  }
</style>
