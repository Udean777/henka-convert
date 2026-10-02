<script lang="ts">
  import { getContext } from "svelte";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import PageIntro from "$lib/features/marketing/ui/PageIntro.svelte";
  import InfoCards from "$lib/features/marketing/ui/InfoCards.svelte";
  import { marketingCopy } from "$lib/features/marketing/content";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(marketingCopy[preferences.language].howItWorks);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/how-it-works"
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
  <InfoCards cards={text.steps} />

  <section
    class="mt-8 grid grid-cols-1 items-center gap-[clamp(1.25rem,4vw,3rem)] border border-ink bg-paper-raised p-[clamp(1.25rem,4vw,2.5rem)] shadow-[6px_6px_0_var(--riso-pink)] min-[541px]:grid-cols-[auto_1fr]"
  >
    <span
      class="grid aspect-square w-[clamp(4.5rem,10vw,7rem)] place-items-center border border-ink bg-riso-blue font-display text-[1.3rem] font-extrabold text-accent-foreground rotate-[-7deg]"
      aria-hidden="true">01—04</span
    >
    <div>
      <p
        class="mb-[0.65rem] text-[0.68rem] font-extrabold tracking-[0.14em] text-riso-blue"
      >
        {preferences.language === "id" ? "DI PERANGKAT ANDA" : "ON YOUR DEVICE"}
      </p>
      <h2
        class="m-0 font-display text-[clamp(1.7rem,3vw,2.5rem)] tracking-[-0.05em]"
      >
        {text.localTitle}
      </h2>
      <p class="max-w-[55rem] leading-[1.7] text-ink-muted">
        {text.localDescription}
      </p>
      <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
        <a
          class="font-bold text-ink underline decoration-riso-pink decoration-2 underline-offset-1"
          href="/privacy">{text.privacyAction}</a
        >
        <a
          class="inline-flex min-h-[2.9rem] items-center gap-3 border border-ink bg-riso-pink px-[0.9rem] py-[0.65rem] font-bold text-[#201e1e] no-underline shadow-[3px_3px_0_var(--ink)]"
          href="/convert"
          >{text.convertAction}<span aria-hidden="true">↗</span></a
        >
      </div>
    </div>
  </section>
</main>
