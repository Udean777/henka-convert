<script lang="ts">
  import type { MarketingCard } from "../content";
  import FormatIcon from "./FormatIcon.svelte";

  let { cards }: { cards: MarketingCard[] } = $props();
</script>

<div class="info-grid">
  {#each cards as card, index (card.title)}
    <article class="info-card" class:accent-card={index === 1}>
      {#if card.icon}
        <FormatIcon kind={card.icon} />
      {/if}
      <p class="eyebrow">{card.eyebrow}</p>
      <h3>{card.title}</h3>
      <p class="description">{card.description}</p>
    </article>
  {/each}
</div>

<style>
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 245px), 1fr));
    gap: 1rem;
  }

  .info-card {
    min-height: 190px;
    border: 1px solid var(--ink);
    background: var(--paper-raised);
    padding: clamp(1.1rem, 2.5vw, 1.6rem);
  }

  .info-card :global(.format-icon) {
    margin-bottom: 1.1rem;
  }

  .accent-card {
    box-shadow: 5px 5px 0 var(--riso-pink);
  }

  .eyebrow {
    margin: 0 0 1.4rem;
    color: var(--riso-blue);
    font-size: 0.67rem;
    font-weight: 800;
    letter-spacing: 0.13em;
  }

  h3 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.35rem, 2.5vw, 1.75rem);
    letter-spacing: -0.04em;
  }

  .description {
    max-width: 38rem;
    margin: 0.75rem 0 0;
    color: var(--ink-muted);
    font-size: 0.92rem;
    line-height: 1.6;
  }
</style>
