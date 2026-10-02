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
  const text = $derived(marketingCopy[preferences.language].privacy);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/privacy"
  language={preferences.language}
/>

<main class="page-main content-page">
  <PageIntro
    eyebrow={text.eyebrow}
    title={text.title}
    description={text.description}
  />
  <InfoCards cards={text.points} />
  <aside class="privacy-note">
    <span class="note-mark" aria-hidden="true">!</span>
    <div>
      <h2>{text.noteTitle}</h2>
      <p>{text.noteDescription}</p>
    </div>
  </aside>
</main>

<style>
  .content-page {
    padding-bottom: clamp(3rem, 8vw, 7rem);
  }

  .privacy-note {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.1rem;
    align-items: start;
    margin-top: 2.5rem;
    border-top: 1px solid var(--rule);
    padding-top: 1.5rem;
  }

  .note-mark {
    display: grid;
    width: 2.2rem;
    height: 2.2rem;
    place-items: center;
    background: var(--riso-pink);
    color: #201e1e;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.35rem;
    font-weight: 800;
  }

  h2 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.45rem;
    letter-spacing: -0.04em;
  }

  .privacy-note p {
    max-width: 58rem;
    margin: 0.6rem 0 0;
    color: var(--ink-muted);
    line-height: 1.7;
  }
</style>
