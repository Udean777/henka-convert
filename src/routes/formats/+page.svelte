<script lang="ts">
  import { getContext } from "svelte";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import PageIntro from "$lib/features/marketing/ui/PageIntro.svelte";
  import FormatIcon from "$lib/features/marketing/ui/FormatIcon.svelte";
  import type { FormatIconKind } from "$lib/features/marketing/content";
  import { marketingCopy } from "$lib/features/marketing/content";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(marketingCopy[preferences.language].formats);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/formats"
  language={preferences.language}
/>

<main class="page-main content-page">
  <PageIntro
    eyebrow={text.eyebrow}
    title={text.title}
    description={text.description}
  />

  <div class="format-list">
    {#each text.groups as group, index (group.title)}
      <article class="format-card" class:format-accent={index === 0}>
        <div class="format-heading">
          {#if group.icon}
            <FormatIcon kind={group.icon as FormatIconKind} />
          {/if}
          <p class="eyebrow">{group.eyebrow}</p>
          <h2>{group.title}</h2>
          <p class="description">{group.description}</p>
        </div>
        <div class="format-details">
          <div>
            <h3>{preferences.language === "id" ? "Masukan" : "Input"}</h3>
            <p>{group.input}</p>
          </div>
          <div>
            <h3>{preferences.language === "id" ? "Keluaran" : "Output"}</h3>
            <p>{group.output}</p>
          </div>
        </div>
      </article>
    {/each}
  </div>

  <a class="action-link" href="/convert"
    >{text.action}<span aria-hidden="true">↗</span></a
  >
</main>

<style>
  .content-page {
    padding-bottom: clamp(3rem, 8vw, 7rem);
  }

  .format-list {
    display: grid;
    gap: 1rem;
  }

  .format-card {
    display: grid;
    grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.2fr);
    gap: clamp(1.25rem, 4vw, 3.5rem);
    border: 1px solid var(--ink);
    background: var(--paper-raised);
    padding: clamp(1.2rem, 3vw, 2rem);
  }

  .format-accent {
    box-shadow: 6px 6px 0 var(--riso-pink);
  }

  .format-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 3rem;
    grid-template-areas:
      "eyebrow icon"
      "title title"
      "description description";
    align-items: start;
    column-gap: 1rem;
  }

  .format-heading :global(.format-icon) {
    grid-area: icon;
    width: 3rem;
    height: 3rem;
  }

  .format-heading .eyebrow {
    grid-area: eyebrow;
  }

  .format-heading h2 {
    grid-area: title;
  }

  .format-heading .description {
    grid-area: description;
  }

  .eyebrow {
    margin: 0 0 0.8rem;
    color: var(--riso-blue);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  h2 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.6rem, 3vw, 2.3rem);
    letter-spacing: -0.055em;
  }

  .description,
  .format-details p {
    margin: 0.8rem 0 0;
    color: var(--ink-muted);
    font-size: 0.91rem;
    line-height: 1.65;
  }

  .format-details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    align-content: center;
  }

  .format-details > div {
    border-left: 2px solid var(--riso-blue);
    padding-left: 1rem;
  }

  .format-details h3 {
    margin: 0;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .action-link {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    min-height: 3rem;
    margin-top: 2rem;
    border: 1px solid var(--ink);
    background: var(--riso-pink);
    box-shadow: 4px 4px 0 var(--ink);
    padding: 0.7rem 1rem;
    color: #201e1e;
    font-weight: 800;
    text-decoration: none;
  }

  .action-link span {
    font-size: 1.2rem;
  }

  @media (max-width: 680px) {
    .format-card {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .format-details {
      grid-template-columns: 1fr;
    }
  }
</style>
