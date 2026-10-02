<script lang="ts">
  import { getContext } from "svelte";
  import SeoHead from "$lib/components/SeoHead.svelte";
  import { messages } from "$lib/i18n/messages";
  import ConverterWorkspace from "$lib/features/converter/ui/ConverterWorkspace.svelte";
  import FormatShiftArtwork from "$lib/features/marketing/ui/FormatShiftArtwork.svelte";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
</script>

<SeoHead
  title={text.seoTitle}
  description={text.seoDescription}
  path="/convert"
  language={preferences.language}
/>

<main class="page-main mx-auto w-full max-w-[1240px] flex-1">
  <section
    class="grid grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)] items-center gap-[clamp(2rem,7vw,7rem)] pt-[clamp(3.5rem,8vw,7.5rem)] pb-[clamp(3rem,6vw,5.25rem)] max-[760px]:grid-cols-1 max-[760px]:gap-6 max-[760px]:pt-12 max-[520px]:pt-10 max-[520px]:pb-10"
    aria-labelledby="page-title"
  >
    <div class="max-w-[720px]">
      <p
        class="mb-[1.1rem] text-[0.74rem] font-extrabold tracking-[0.13em] text-riso-blue uppercase"
      >
        {text.workbenchLabel}
      </p>
      <h1
        id="page-title"
        class="m-0 max-w-[16ch] font-display text-[clamp(2.8rem,5.9vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.075em] max-[480px]:text-[clamp(2.35rem,11vw,3.4rem)]"
      >
        {text.title}
      </h1>
      <p
        class="mt-6 max-w-[38rem] text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.65] text-ink-muted"
      >
        {text.description}
      </p>
      <p
        class="mt-6 inline-flex border-b-2 border-riso-pink pb-1 text-[0.9rem] font-bold"
      >
        {text.privacy}
      </p>
    </div>

    <FormatShiftArtwork
      source={text.sourceLabel}
      result={text.resultLabel}
      transform={text.transformLabel}
    />
  </section>

  <section
    class="mb-[clamp(3.5rem,8vw,7rem)] border border-ink bg-paper-raised p-[clamp(1rem,3vw,2.5rem)] shadow-[8px_8px_0_var(--riso-pink)] max-[480px]:shadow-[5px_5px_0_var(--riso-pink)]"
    aria-label={text.fileConverter}
  >
    <div
      class="mb-6 flex items-baseline justify-between gap-4 border-b border-rule pb-[0.85rem] max-[480px]:items-start max-[480px]:flex-col max-[480px]:gap-[0.35rem]"
    >
      <h2
        class="m-0 font-display text-[clamp(1.45rem,3vw,2rem)] tracking-[-0.045em]"
      >
        {text.fileConverter}
      </h2>
      <span
        class="text-right text-[0.78rem] text-ink-muted max-[480px]:text-left"
        >{text.status}</span
      >
    </div>
    <ConverterWorkspace />
  </section>
</main>
