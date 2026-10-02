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
  const text = $derived(marketingCopy[preferences.language].about);
</script>

<SeoHead
  title={text.metaTitle}
  description={text.metaDescription}
  path="/about"
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
  <InfoCards cards={text.principles} />
  <a
    class="mt-8 inline-flex min-h-12 items-center gap-3 border border-ink bg-riso-pink px-4 py-[0.7rem] font-extrabold text-[#201e1e] no-underline shadow-[4px_4px_0_var(--ink)]"
    href="/convert">{text.action}<span aria-hidden="true">↗</span></a
  >
</main>
