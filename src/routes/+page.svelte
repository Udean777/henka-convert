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

<main
  class="page-main mx-auto w-full max-w-[1240px] flex-1 pb-[clamp(3rem,8vw,7rem)]"
>
  <section
    class="grid grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] items-center gap-[clamp(2rem,7vw,7rem)] pt-[clamp(3.5rem,8vw,7.5rem)] pb-[clamp(4rem,9vw,8rem)] max-[760px]:grid-cols-1 max-[760px]:gap-7 max-[520px]:pt-10 max-[520px]:pb-14"
    aria-labelledby="home-title"
  >
    <div class="max-w-[700px]">
      <p
        class="mb-4 text-[0.72rem] font-extrabold tracking-[0.15em] text-riso-blue uppercase"
      >
        {text.eyebrow}
      </p>
      <h1
        id="home-title"
        class="m-0 max-w-[12ch] font-display text-[clamp(3.3rem,7.5vw,7rem)] leading-[0.91] tracking-[-0.085em] max-[520px]:text-[clamp(2.85rem,13.5vw,4.25rem)]"
      >
        {text.title}
      </h1>
      <p
        class="mt-6 max-w-[39rem] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.7] text-ink-muted"
      >
        {text.description}
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-5">
        <a
          class="inline-flex min-h-12 items-center justify-center border border-ink bg-riso-pink px-4 py-[0.7rem] font-extrabold text-[#201e1e] no-underline shadow-[4px_4px_0_var(--ink)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
          href="/convert">{text.primaryAction}</a
        >
        <a
          class="text-[0.9rem] font-bold text-ink underline decoration-riso-pink decoration-2 underline-offset-[0.28em]"
          href="/formats">{text.secondaryAction}</a
        >
      </div>
    </div>

    <div
      class="aspect-[9/8] w-[min(100%,340px)] justify-self-center max-[760px]:w-[min(82vw,340px)]"
    >
      <HeroPrintArtwork />
    </div>
  </section>

  <section
    class="border-t border-rule py-[clamp(2.5rem,6vw,5rem)]"
    aria-labelledby="workbench-title"
  >
    <div class="mb-8 max-w-[760px]">
      <p
        class="mb-4 text-[0.72rem] font-extrabold tracking-[0.15em] text-riso-blue uppercase"
      >
        {text.workbenchLabel}
      </p>
      <h2
        id="workbench-title"
        class="m-0 max-w-[20ch] font-display text-[clamp(2rem,4vw,3.8rem)] leading-none tracking-[-0.065em]"
      >
        {text.workbenchTitle}
      </h2>
      <p class="mt-4 max-w-[42rem] text-base leading-[1.7] text-ink-muted">
        {text.workbenchDescription}
      </p>
    </div>
    <InfoCards cards={text.categories} />
    <a
      class="mt-6 inline-flex min-h-12 items-center justify-center border border-ink bg-paper-raised px-4 py-[0.7rem] font-extrabold text-ink no-underline shadow-[3px_3px_0_var(--riso-blue)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
      href="/convert">{text.primaryAction}</a
    >
  </section>

  <section class="py-[clamp(2.5rem,6vw,5rem)]" aria-labelledby="steps-title">
    <div class="mb-8 max-w-[640px]">
      <p
        class="mb-4 text-[0.72rem] font-extrabold tracking-[0.15em] text-riso-blue uppercase"
      >
        {text.stepsLabel}
      </p>
      <h2
        id="steps-title"
        class="m-0 max-w-[20ch] font-display text-[clamp(2rem,4vw,3.8rem)] leading-none tracking-[-0.065em]"
      >
        {text.stepsTitle}
      </h2>
    </div>
    <InfoCards cards={text.steps} />
  </section>

  <section
    class="grid grid-cols-[auto_1fr] items-center gap-[clamp(1.5rem,5vw,4rem)] border border-ink bg-paper-raised p-[clamp(1.5rem,5vw,3.5rem)] shadow-[8px_8px_0_var(--riso-pink)] max-[760px]:grid-cols-1 max-[520px]:shadow-[5px_5px_0_var(--riso-pink)]"
    aria-labelledby="privacy-title"
  >
    <div
      class="grid aspect-square w-[clamp(100px,16vw,170px)] place-items-center rounded-full border-2 border-ink bg-riso-blue text-center font-display text-[clamp(1rem,2vw,1.6rem)] leading-[1.05] font-extrabold text-accent-foreground outline outline-1 outline-ink outline-offset-[5px] rotate-[-9deg]"
      aria-hidden="true"
    >
      LOCAL<br />FIRST
    </div>
    <div>
      <p
        class="mb-4 text-[0.72rem] font-extrabold tracking-[0.15em] text-riso-blue uppercase"
      >
        {text.privacyLabel}
      </p>
      <h2
        id="privacy-title"
        class="m-0 max-w-[16ch] font-display text-[clamp(2rem,4vw,3.8rem)] leading-none tracking-[-0.065em]"
      >
        {text.privacyTitle}
      </h2>
      <p class="mt-4 max-w-[42rem] text-base leading-[1.7] text-ink-muted">
        {text.privacyDescription}
      </p>
      <a
        class="mt-3 inline-block text-[0.9rem] font-bold text-ink underline decoration-riso-pink decoration-2 underline-offset-[0.28em]"
        href="/privacy">{text.privacyAction}</a
      >
    </div>
  </section>

  <section
    class="flex items-end justify-between gap-6 pt-[clamp(3rem,7vw,6rem)] max-[520px]:flex-col max-[520px]:items-start"
    aria-label={text.faqLabel}
  >
    <div>
      <p
        class="mb-4 text-[0.72rem] font-extrabold tracking-[0.15em] text-riso-blue uppercase"
      >
        {text.faqLabel}
      </p>
      <h2
        class="m-0 max-w-[20ch] font-display text-[clamp(1.8rem,3.5vw,3rem)] leading-none tracking-[-0.065em]"
      >
        {text.faqTitle}
      </h2>
    </div>
    <a
      class="inline-flex min-h-12 items-center justify-center border border-ink bg-paper-raised px-4 py-[0.7rem] font-extrabold text-ink no-underline shadow-[3px_3px_0_var(--riso-blue)] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
      href="/help">{text.faqLink}</a
    >
  </section>
</main>
