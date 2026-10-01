<script lang="ts">
  import { onMount, setContext } from "svelte";
  import "../app.css";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import favicon from "$lib/assets/favicon.svg";
  import { messages } from "$lib/i18n/messages";
  import { createPreferences } from "$lib/features/preferences/preferences.svelte";
  import { PREFERENCES_CONTEXT } from "$lib/features/preferences/preferences-context";

  let { children } = $props();
  const preferences = createPreferences();
  setContext(PREFERENCES_CONTEXT, preferences);
  const text = $derived(messages[preferences.language]);

  onMount(() => preferences.initialize());
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 sm:px-10">
  <AppHeader />
  {@render children()}
  <footer class="border-t border-border pt-5 text-sm text-muted">
    {text.footer}
  </footer>
</div>
