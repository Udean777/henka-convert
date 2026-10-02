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

<main
  class="page-main mx-auto w-full max-w-[1240px] flex-1 pb-[clamp(3rem,8vw,7rem)]"
>
  <PageIntro
    eyebrow={text.eyebrow}
    title={text.title}
    description={text.description}
  />

  <div class="grid gap-4">
    {#each text.groups as group, index (group.title)}
      <article
        class="grid grid-cols-1 gap-[clamp(1.25rem,4vw,3.5rem)] border border-ink bg-paper-raised p-[clamp(1.2rem,3vw,2rem)] min-[681px]:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)] {index ===
        0
          ? 'shadow-[6px_6px_0_var(--riso-pink)]'
          : ''}"
      >
        <div class="grid grid-cols-[minmax(0,1fr)_3rem] items-start gap-x-4">
          {#if group.icon}
            <div class="col-start-2 row-start-1">
              <FormatIcon kind={group.icon as FormatIconKind} />
            </div>
          {/if}
          <p
            class="col-start-1 row-start-1 mb-3 text-[0.68rem] font-extrabold tracking-[0.14em] text-riso-blue"
          >
            {group.eyebrow}
          </p>
          <h2
            class="col-span-2 row-start-2 m-0 font-display text-[clamp(1.6rem,3vw,2.3rem)] tracking-[-0.055em]"
          >
            {group.title}
          </h2>
          <p
            class="col-span-2 row-start-3 mt-3 text-[0.91rem] leading-[1.65] text-ink-muted"
          >
            {group.description}
          </p>
        </div>
        <div
          class="grid grid-cols-1 content-center gap-4 min-[481px]:grid-cols-2"
        >
          <div class="border-l-2 border-riso-blue pl-4">
            <h3 class="m-0 text-xs tracking-[0.1em] uppercase">
              {preferences.language === "id" ? "Masukan" : "Input"}
            </h3>
            <p class="mt-3 text-[0.91rem] leading-[1.65] text-ink-muted">
              {group.input}
            </p>
          </div>
          <div class="border-l-2 border-riso-blue pl-4">
            <h3 class="m-0 text-xs tracking-[0.1em] uppercase">
              {preferences.language === "id" ? "Keluaran" : "Output"}
            </h3>
            <p class="mt-3 text-[0.91rem] leading-[1.65] text-ink-muted">
              {group.output}
            </p>
          </div>
        </div>
      </article>
    {/each}
  </div>

  <a
    class="mt-8 inline-flex min-h-12 items-center gap-3 border border-ink bg-riso-pink px-4 py-[0.7rem] font-extrabold text-[#201e1e] no-underline shadow-[4px_4px_0_var(--ink)]"
    href="/convert">{text.action}<span aria-hidden="true">↗</span></a
  >
</main>
