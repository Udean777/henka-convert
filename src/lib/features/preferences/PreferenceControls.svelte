<script lang="ts">
  import { getContext } from "svelte";
  import { Moon, Sun } from "@lucide/svelte";
  import { messages } from "$lib/i18n/messages";
  import { PREFERENCES_CONTEXT, type Preferences } from "./preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
</script>

<div class="flex items-center gap-3">
  <div
    class="flex items-center gap-1 rounded-full border border-border p-1"
    role="group"
    aria-label={text.languageLabel}
  >
    <button
      class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors {preferences.language ===
      'en'
        ? 'bg-foreground text-background'
        : 'text-muted hover:bg-surface'}"
      aria-pressed={preferences.language === "en"}
      onclick={() => preferences.setLanguage("en")}>EN</button
    >
    <button
      class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors {preferences.language ===
      'id'
        ? 'bg-foreground text-background'
        : 'text-muted hover:bg-surface'}"
      aria-pressed={preferences.language === "id"}
      onclick={() => preferences.setLanguage("id")}>ID</button
    >
  </div>
  <button
    class="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
    aria-label={preferences.dark ? text.lightTheme : text.darkTheme}
    aria-pressed={preferences.dark}
    title={preferences.dark ? text.lightTheme : text.darkTheme}
    onclick={() => preferences.toggleTheme()}
  >
    {#if preferences.dark}
      <Sun size={18} aria-hidden="true" />
    {:else}
      <Moon size={18} aria-hidden="true" />
    {/if}
  </button>
</div>
