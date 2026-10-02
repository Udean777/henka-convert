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
  const text = $derived(marketingCopy[preferences.language].privacy);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/privacy"
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
  <InfoCards cards={text.points} />
  <aside
    class="mt-10 grid grid-cols-[auto_1fr] items-start gap-[1.1rem] border-t border-rule pt-6"
  >
    <span
      class="grid size-[2.2rem] place-items-center bg-riso-pink font-display text-[1.35rem] font-extrabold text-[#201e1e]"
      aria-hidden="true">!</span
    >
    <div>
      <h2 class="m-0 font-display text-[1.45rem] tracking-[-0.04em]">
        {text.noteTitle}
      </h2>
      <p class="mt-[0.6rem] max-w-[58rem] leading-[1.7] text-ink-muted">
        {text.noteDescription}
      </p>
    </div>
  </aside>
</main>
