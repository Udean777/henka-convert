<script lang="ts">
  import type { FormatIconKind } from "../content";

  let { kind }: { kind: FormatIconKind } = $props();
</script>

<svg
  class="format-icon"
  viewBox="0 0 64 64"
  fill="none"
  aria-hidden="true"
  focusable="false"
>
  {#if kind === "image"}
    <rect x="10" y="11" width="38" height="40" rx="1" class="blue-fill" />
    <path d="m15 43 10-12 8 8 6-7 8 11" class="ink-stroke" />
    <circle cx="22" cy="23" r="4" class="pink-fill" />
    <path d="M46 17h8v34h-8" class="pink-stroke" />
  {:else if kind === "pdf"}
    <path d="M15 8h25l10 10v38H15z" class="blue-fill" />
    <path d="M40 8v12h11" class="ink-stroke" />
    <path d="M22 31h20M22 38h15M22 45h12" class="ink-stroke" />
    <path d="M22 23h13" class="pink-stroke" />
  {:else if kind === "document"}
    <path d="M14 8h27l9 9v39H14z" class="blue-fill" />
    <path d="M41 8v11h10" class="ink-stroke" />
    <path d="M22 28h20M22 35h20M22 42h13" class="ink-stroke" />
    <path d="M22 22h8" class="pink-stroke" />
  {:else if kind === "table"}
    <rect x="9" y="12" width="46" height="40" class="blue-fill" />
    <path d="M9 24h46M9 38h46M25 12v40M41 12v40" class="ink-stroke" />
    <path d="M9 12h46v12H9z" class="pink-fill" />
  {:else if kind === "audio"}
    <path d="M12 35h8l8-10v27l-8-10h-8z" class="blue-fill" />
    <path d="M37 25c5 4 5 14 0 18M44 19c9 7 9 23 0 30" class="pink-stroke" />
    <path d="M34 31c2 2 2 7 0 9" class="ink-stroke" />
  {:else if kind === "video"}
    <rect x="9" y="14" width="46" height="36" class="blue-fill" />
    <path d="m27 23 15 9-15 9z" class="pink-fill" />
    <path d="M9 14h46v36H9z" class="ink-stroke" />
    <path d="M15 9v5M49 9v5M15 50v5M49 50v5" class="pink-stroke" />
  {:else}
    <rect x="10" y="12" width="44" height="40" class="blue-fill" />
    <path d="m29 21 11 11-11 11M15 32h25" class="pink-stroke" />
  {/if}
</svg>

<style>
  .format-icon {
    display: block;
    width: 3rem;
    height: 3rem;
    flex: none;
    overflow: visible;
  }

  .blue-fill {
    fill: var(--riso-blue);
    stroke: var(--ink);
    stroke-width: 1.8;
    stroke-linejoin: round;
  }

  .pink-fill {
    fill: var(--riso-pink);
    stroke: var(--ink);
    stroke-width: 1.5;
  }

  .ink-stroke,
  .pink-stroke {
    stroke-linecap: square;
    stroke-linejoin: round;
    stroke-width: 2.2;
  }

  .ink-stroke {
    stroke: var(--ink);
  }

  .pink-stroke {
    stroke: var(--riso-pink);
  }
</style>
