<script lang="ts">
  import { getContext } from "svelte";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import PageIntro from "$lib/features/marketing/ui/PageIntro.svelte";
  import InfoCards from "$lib/features/marketing/ui/InfoCards.svelte";
  import HeroPrintArtwork from "$lib/features/marketing/ui/HeroPrintArtwork.svelte";
  import { marketingCopy } from "$lib/features/marketing/content";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(marketingCopy[preferences.language].home);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/"
  language={preferences.language}
  website
/>

<main class="page-main home-page">
  <section class="hero" aria-labelledby="home-title">
    <div class="hero-copy">
      <p class="eyebrow">{text.eyebrow}</p>
      <h1 id="home-title">{text.title}</h1>
      <p class="description">{text.description}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="/convert">{text.primaryAction}</a
        >
        <a class="text-link" href="/formats">{text.secondaryAction}</a>
      </div>
    </div>

    <div class="print-illustration"><HeroPrintArtwork /></div>
  </section>

  <section class="workbench-section" aria-labelledby="workbench-title">
    <div class="section-heading">
      <p class="eyebrow">{text.workbenchLabel}</p>
      <h2 id="workbench-title">{text.workbenchTitle}</h2>
      <p>{text.workbenchDescription}</p>
    </div>
    <InfoCards cards={text.categories} />
    <a class="button button-secondary" href="/convert">{text.primaryAction}</a>
  </section>

  <section class="steps-section" aria-labelledby="steps-title">
    <div class="section-heading compact-heading">
      <p class="eyebrow">{text.stepsLabel}</p>
      <h2 id="steps-title">{text.stepsTitle}</h2>
    </div>
    <InfoCards cards={text.steps} />
  </section>

  <section class="privacy-panel" aria-labelledby="privacy-title">
    <div class="privacy-stamp" aria-hidden="true">LOCAL<br />FIRST</div>
    <div>
      <p class="eyebrow">{text.privacyLabel}</p>
      <h2 id="privacy-title">{text.privacyTitle}</h2>
      <p>{text.privacyDescription}</p>
      <a class="text-link" href="/privacy">{text.privacyAction}</a>
    </div>
  </section>

  <section class="help-strip" aria-label={text.faqLabel}>
    <div>
      <p class="eyebrow">{text.faqLabel}</p>
      <h2>{text.faqTitle}</h2>
    </div>
    <a class="button button-secondary" href="/help">{text.faqLink}</a>
  </section>
</main>

<style>
  .home-page {
    padding-bottom: clamp(3rem, 8vw, 7rem);
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
    align-items: center;
    gap: clamp(2rem, 7vw, 7rem);
    padding-block: clamp(3.5rem, 8vw, 7.5rem) clamp(4rem, 9vw, 8rem);
  }

  .hero-copy {
    max-width: 700px;
  }

  .eyebrow {
    margin: 0 0 1rem;
    color: var(--riso-blue);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 12ch;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(3.3rem, 7.5vw, 7rem);
    letter-spacing: -0.085em;
    line-height: 0.91;
  }

  .description {
    max-width: 39rem;
    margin: 1.5rem 0 0;
    color: var(--ink-muted);
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
    margin-top: 2rem;
  }

  .button {
    display: inline-flex;
    min-height: 3rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--ink);
    padding: 0.7rem 1rem;
    color: var(--ink);
    font-size: 0.9rem;
    font-weight: 800;
    text-decoration: none;
    transition:
      transform 120ms ease,
      box-shadow 120ms ease;
  }

  .button:hover {
    transform: translate(-2px, -2px);
  }

  .button-primary {
    background: var(--riso-pink);
    box-shadow: 4px 4px 0 var(--ink);
    color: #201e1e;
  }

  .button-secondary {
    background: var(--paper-raised);
    box-shadow: 3px 3px 0 var(--riso-blue);
  }

  .text-link {
    color: var(--ink);
    font-size: 0.9rem;
    font-weight: 750;
    text-decoration-color: var(--riso-pink);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.28em;
  }

  .print-illustration {
    width: min(100%, 340px);
    height: 310px;
    justify-self: center;
  }

  .workbench-section,
  .steps-section {
    padding-block: clamp(2.5rem, 6vw, 5rem);
  }

  .workbench-section {
    border-top: 1px solid var(--rule);
  }

  .section-heading {
    max-width: 760px;
    margin-bottom: 2rem;
  }

  .section-heading h2,
  .privacy-panel h2,
  .help-strip h2 {
    max-width: 20ch;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2rem, 4vw, 3.8rem);
    letter-spacing: -0.065em;
    line-height: 1;
  }

  .section-heading > p:last-child,
  .privacy-panel > div:last-child > p:not(.eyebrow) {
    max-width: 42rem;
    color: var(--ink-muted);
    font-size: 1rem;
    line-height: 1.7;
  }

  .workbench-section > .button {
    margin-top: 1.6rem;
  }

  .compact-heading {
    max-width: 640px;
  }

  .privacy-panel {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: clamp(1.5rem, 5vw, 4rem);
    border: 1px solid var(--ink);
    background: var(--paper-raised);
    box-shadow: 8px 8px 0 var(--riso-pink);
    padding: clamp(1.5rem, 5vw, 3.5rem);
  }

  .privacy-panel h2 {
    max-width: 16ch;
  }

  .privacy-panel .text-link {
    display: inline-block;
    margin-top: 0.7rem;
  }

  .privacy-stamp {
    display: grid;
    width: clamp(100px, 16vw, 170px);
    aspect-ratio: 1;
    place-items: center;
    border: 2px solid var(--ink);
    border-radius: 50%;
    outline: 1px solid var(--ink);
    outline-offset: 5px;
    background: var(--riso-blue);
    color: #fff9ed;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1rem, 2vw, 1.6rem);
    font-weight: 800;
    line-height: 1.05;
    text-align: center;
    transform: rotate(-9deg);
  }

  :global(:root.dark) .privacy-stamp {
    color: #201e1e;
  }

  .help-strip {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1.5rem;
    padding-block: clamp(3rem, 7vw, 6rem) 0;
  }

  .help-strip h2 {
    font-size: clamp(1.8rem, 3.5vw, 3rem);
  }

  @media (max-width: 760px) {
    .hero {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .print-illustration {
      justify-self: end;
      transform: scale(0.88);
      transform-origin: right top;
      margin-bottom: -2rem;
    }

    .privacy-panel {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .hero {
      padding-top: 3rem;
    }

    .hero h1 {
      font-size: clamp(3.1rem, 16vw, 4.6rem);
    }

    .help-strip {
      align-items: flex-start;
      flex-direction: column;
    }

    .privacy-panel {
      box-shadow: 5px 5px 0 var(--riso-pink);
    }
  }
</style>
