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
  const text = $derived(marketingCopy[preferences.language].howItWorks);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/how-it-works"
  language={preferences.language}
/>

<main class="page-main content-page">
  <PageIntro
    eyebrow={text.eyebrow}
    title={text.title}
    description={text.description}
  />
  <InfoCards cards={text.steps} />

  <section class="local-note">
    <span class="registration" aria-hidden="true">01—04</span>
    <div>
      <p class="eyebrow">
        {preferences.language === "id" ? "DI PERANGKAT ANDA" : "ON YOUR DEVICE"}
      </p>
      <h2>{text.localTitle}</h2>
      <p>{text.localDescription}</p>
      <div class="actions">
        <a href="/privacy">{text.privacyAction}</a>
        <a class="primary-action" href="/convert"
          >{text.convertAction}<span aria-hidden="true">↗</span></a
        >
      </div>
    </div>
  </section>
</main>

<style>
  .content-page {
    padding-bottom: clamp(3rem, 8vw, 7rem);
  }

  .local-note {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: clamp(1.25rem, 4vw, 3rem);
    margin-top: 2rem;
    border: 1px solid var(--ink);
    background: var(--paper-raised);
    box-shadow: 6px 6px 0 var(--riso-pink);
    padding: clamp(1.25rem, 4vw, 2.5rem);
  }

  .registration {
    display: grid;
    width: clamp(4.5rem, 10vw, 7rem);
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid var(--ink);
    background: var(--riso-blue);
    color: #fff9ed;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.3rem;
    font-weight: 800;
    transform: rotate(-7deg);
  }

  :global(:root.dark) .registration {
    color: #201e1e;
  }

  .eyebrow {
    margin: 0 0 0.65rem;
    color: var(--riso-blue);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  h2 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.7rem, 3vw, 2.5rem);
    letter-spacing: -0.05em;
  }

  .local-note p:not(.eyebrow) {
    max-width: 55rem;
    color: var(--ink-muted);
    line-height: 1.7;
  }

  .actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    margin-top: 1.2rem;
  }

  .actions a {
    color: var(--ink);
    font-weight: 750;
    text-decoration-color: var(--riso-pink);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.25em;
  }

  .actions .primary-action {
    display: inline-flex;
    min-height: 2.9rem;
    align-items: center;
    gap: 0.7rem;
    border: 1px solid var(--ink);
    background: var(--riso-pink);
    box-shadow: 3px 3px 0 var(--ink);
    padding: 0.65rem 0.9rem;
    color: #201e1e;
    text-decoration: none;
  }

  @media (max-width: 540px) {
    .local-note {
      grid-template-columns: 1fr;
    }
  }
</style>
