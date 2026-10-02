<script lang="ts">
  import { getContext } from "svelte";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import PageIntro from "$lib/features/marketing/ui/PageIntro.svelte";
  import { marketingCopy } from "$lib/features/marketing/content";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(marketingCopy[preferences.language].help);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/help"
  language={preferences.language}
/>

<main class="page-main content-page">
  <PageIntro
    eyebrow={text.eyebrow}
    title={text.title}
    description={text.description}
  />

  <section class="faq-list" aria-label={text.eyebrow}>
    {#each text.questions as question, index (question.title)}
      <details class="faq-item" open={index === 0}>
        <summary>
          <span>{question.title}</span>
          <span class="faq-mark" aria-hidden="true">+</span>
        </summary>
        <p>{question.answer}</p>
      </details>
    {/each}
  </section>

  <aside class="help-callout">
    <div>
      <p class="eyebrow">{text.contactLabel}</p>
      <h2>{text.contactTitle}</h2>
      <p>{text.contactDescription}</p>
    </div>
    <a class="action-link" href="/convert">
      {preferences.language === "id" ? "Buka konverter" : "Open converter"}
      <span aria-hidden="true">↗</span>
    </a>
  </aside>
</main>

<style>
  .content-page {
    padding-bottom: clamp(3rem, 8vw, 7rem);
  }

  .faq-list {
    border-top: 1px solid var(--ink);
  }

  .faq-item {
    border-bottom: 1px solid var(--rule);
    padding-block: 1.15rem;
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    color: var(--ink);
    cursor: pointer;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.15rem, 2.4vw, 1.55rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  .faq-mark {
    display: grid;
    width: 2rem;
    height: 2rem;
    flex: none;
    place-items: center;
    background: var(--riso-blue);
    color: #fff9ed;
    font-family: sans-serif;
    font-size: 1.3rem;
    transition: transform 120ms ease;
  }

  :global(:root.dark) .faq-mark {
    color: #201e1e;
  }

  details[open] .faq-mark {
    transform: rotate(45deg);
  }

  .faq-item > p {
    max-width: 54rem;
    margin: 0.9rem 3.5rem 0 0;
    color: var(--ink-muted);
    font-size: 0.98rem;
    line-height: 1.7;
  }

  .help-callout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    margin-top: 3rem;
    border: 1px solid var(--ink);
    background: var(--paper-raised);
    box-shadow: 6px 6px 0 var(--riso-pink);
    padding: clamp(1.25rem, 4vw, 2.5rem);
  }

  .help-callout h2 {
    max-width: 24ch;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.6rem, 3vw, 2.5rem);
    letter-spacing: -0.05em;
  }

  .help-callout > div > p:last-child {
    max-width: 42rem;
    color: var(--ink-muted);
    line-height: 1.6;
  }

  .eyebrow {
    margin: 0 0 0.7rem;
    color: var(--riso-blue);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .action-link {
    display: inline-flex;
    min-height: 3rem;
    flex: none;
    align-items: center;
    gap: 0.7rem;
    border: 1px solid var(--ink);
    background: var(--riso-pink);
    box-shadow: 4px 4px 0 var(--ink);
    padding: 0.7rem 1rem;
    color: #201e1e;
    font-weight: 800;
    text-decoration: none;
  }

  @media (max-width: 680px) {
    .help-callout {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
