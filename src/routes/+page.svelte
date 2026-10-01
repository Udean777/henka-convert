<script lang="ts">
  import { getContext } from "svelte";
  import { messages } from "$lib/i18n/messages";
  import ConverterWorkspace from "$lib/features/converter/ConverterWorkspace.svelte";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
</script>

<svelte:head>
  <title>{text.seoTitle}</title>
  <meta name="description" content={text.seoDescription} />
</svelte:head>

<main
  class="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16"
>
  <div class="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
    <p class="mb-3 text-sm font-medium text-muted">{text.privacy}</p>
    <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
      {text.title}
    </h1>
    <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">
      {text.description}
    </p>
  </div>
  <ConverterWorkspace />
  <p class="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-muted">
    {text.footer}
  </p>
</main>
