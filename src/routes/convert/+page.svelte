<script lang="ts">
  import { getContext } from "svelte";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import { messages } from "$lib/i18n/messages";
  import ConverterWorkspace from "$lib/features/converter/ui/ConverterWorkspace.svelte";
  import FormatShiftArtwork from "$lib/features/marketing/ui/FormatShiftArtwork.svelte";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
</script>

<SeoHead
  title={text.seoTitle}
  description={text.seoDescription}
  path="/convert"
  language={preferences.language}
/>

<main class="page-main">
  <section class="hero" aria-labelledby="page-title">
    <div class="hero-copy">
      <p class="hero-kicker">{text.workbenchLabel}</p>
      <h1 id="page-title" class="hero-title">{text.title}</h1>
      <p class="hero-description">{text.description}</p>
      <p class="privacy-note">{text.privacy}</p>
    </div>

    <FormatShiftArtwork
      source={text.sourceLabel}
      result={text.resultLabel}
      transform={text.transformLabel}
    />
  </section>

  <section class="converter-panel" aria-label={text.fileConverter}>
    <div class="panel-heading">
      <h2>{text.fileConverter}</h2>
      <span>{text.status}</span>
    </div>
    <ConverterWorkspace />
  </section>
</main>

<style>
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.8fr);
    align-items: center;
    gap: clamp(2rem, 7vw, 7rem);
    padding-block: clamp(3.5rem, 8vw, 7.5rem) clamp(3rem, 6vw, 5.25rem);
  }

  .hero-copy {
    max-width: 720px;
  }

  .hero-kicker {
    margin: 0 0 1.1rem;
    color: var(--riso-blue);
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .hero-title {
    max-width: 16ch;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.8rem, 5.9vw, 5.5rem);
    font-weight: 700;
    letter-spacing: -0.075em;
    line-height: 0.98;
  }

  .hero-description {
    max-width: 38rem;
    margin: 1.5rem 0 0;
    color: var(--ink-muted);
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    line-height: 1.65;
  }

  .privacy-note {
    display: inline-flex;
    margin: 1.5rem 0 0;
    border-bottom: 2px solid var(--riso-pink);
    padding-bottom: 0.25rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .converter-panel {
    margin-bottom: clamp(3.5rem, 8vw, 7rem);
    border: 1px solid var(--ink);
    background: var(--paper-raised);
    box-shadow: 8px 8px 0 var(--riso-pink);
    padding: clamp(1rem, 3vw, 2.5rem);
  }

  .panel-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 0.85rem;
  }

  .panel-heading h2 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.45rem, 3vw, 2rem);
    letter-spacing: -0.045em;
  }

  .panel-heading span {
    color: var(--ink-muted);
    font-size: 0.78rem;
    text-align: right;
  }

  @media (max-width: 760px) {
    .hero {
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;
      padding-top: 3rem;
    }

    :global(.format-shift) {
      width: 280px;
      height: 220px;
      justify-self: end;
      transform: scale(0.85);
      transform-origin: right top;
      margin-bottom: -2rem;
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: clamp(2.55rem, 12vw, 3.7rem);
    }

    .panel-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.35rem;
    }

    .panel-heading span {
      text-align: left;
    }

    .converter-panel {
      box-shadow: 5px 5px 0 var(--riso-pink);
    }
  }
</style>
