<script lang="ts">
  import type { MarketingCard } from "../content";
  import FormatIcon from "./FormatIcon.svelte";

  let { cards }: { cards: MarketingCard[] } = $props();
</script>

<div
  class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,245px),1fr))] gap-4"
>
  {#each cards as card, index (card.title)}
    <article
      class="min-h-[190px] border border-ink bg-paper-raised p-[clamp(1.1rem,2.5vw,1.6rem)] {index ===
      1
        ? 'shadow-[5px_5px_0_var(--riso-pink)]'
        : ''}"
    >
      {#if card.icon}
        <div class="mb-[1.1rem]"><FormatIcon kind={card.icon} /></div>
      {/if}
      <p
        class="mb-[1.4rem] text-[0.67rem] font-extrabold tracking-[0.13em] text-riso-blue"
      >
        {card.eyebrow}
      </p>
      <h3
        class="m-0 font-display text-[clamp(1.35rem,2.5vw,1.75rem)] tracking-[-0.04em]"
      >
        {card.title}
      </h3>
      <p class="mt-3 max-w-[38rem] text-[0.92rem] leading-[1.6] text-ink-muted">
        {card.description}
      </p>
    </article>
  {/each}
</div>
