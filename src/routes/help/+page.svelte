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

<main
  class="page-main mx-auto w-full max-w-[1240px] flex-1 pb-[clamp(3rem,8vw,7rem)]"
>
  <PageIntro
    eyebrow={text.eyebrow}
    title={text.title}
    description={text.description}
  />

  <section class="border-t border-ink" aria-label={text.eyebrow}>
    {#each text.questions as question, index (question.title)}
      <details
        class="group border-b border-rule py-[1.15rem]"
        open={index === 0}
      >
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-[clamp(1.15rem,2.4vw,1.55rem)] font-bold tracking-[-0.025em] text-ink marker:hidden"
        >
          <span>{question.title}</span>
          <span
            class="grid size-8 shrink-0 place-items-center bg-riso-blue font-sans text-[1.3rem] text-accent-foreground transition-transform duration-150 group-open:rotate-45"
            aria-hidden="true">+</span
          >
        </summary>
        <p
          class="mt-4 mr-14 max-w-[54rem] text-[0.98rem] leading-[1.7] text-ink-muted"
        >
          {question.answer}
        </p>
      </details>
    {/each}
  </section>

  <aside
    class="mt-12 flex items-center justify-between gap-8 border border-ink bg-paper-raised p-[clamp(1.25rem,4vw,2.5rem)] shadow-[6px_6px_0_var(--riso-pink)] max-[680px]:flex-col max-[680px]:items-start"
  >
    <div>
      <p
        class="mb-3 text-[0.68rem] font-extrabold tracking-[0.14em] text-riso-blue uppercase"
      >
        {text.contactLabel}
      </p>
      <h2
        class="m-0 max-w-[24ch] font-display text-[clamp(1.6rem,3vw,2.5rem)] tracking-[-0.05em]"
      >
        {text.contactTitle}
      </h2>
      <p class="max-w-[42rem] leading-[1.6] text-ink-muted">
        {text.contactDescription}
      </p>
    </div>
    <a
      class="inline-flex min-h-12 shrink-0 items-center gap-3 border border-ink bg-riso-pink px-4 py-[0.7rem] font-extrabold text-[#201e1e] no-underline shadow-[4px_4px_0_var(--ink)]"
      href="/convert"
    >
      {preferences.language === "id" ? "Buka konverter" : "Open converter"}
      <span aria-hidden="true">↗</span>
    </a>
  </aside>
</main>

<style>
  summary::-webkit-details-marker {
    display: none;
  }
</style>
