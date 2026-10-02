<script lang="ts">
  import { getContext } from "svelte";
  import { Moon, Sun } from "@lucide/svelte";
  import { messages } from "$lib/i18n/messages";
  import { PREFERENCES_CONTEXT, type Preferences } from "./preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
</script>

<div class="flex items-center gap-[0.65rem] max-[480px]:gap-[0.4rem]">
  <div
    class="flex gap-[0.15rem] border border-ink bg-surface p-[0.2rem]"
    role="group"
    aria-label={text.languageLabel}
  >
    <button
      class="inline-flex min-h-8 min-w-[2.35rem] items-center justify-center border px-[0.55rem] py-[0.35rem] text-[0.72rem] font-extrabold transition-all duration-200 {preferences.language ===
      'en'
        ? 'border-riso-blue bg-riso-blue text-accent-foreground shadow-[2px_2px_0_var(--riso-pink)]'
        : 'border-transparent bg-transparent text-ink-muted hover:bg-riso-blue-soft hover:text-ink'}"
      aria-pressed={preferences.language === "en"}
      onclick={() => preferences.setLanguage("en")}>EN</button
    >
    <button
      class="inline-flex min-h-8 min-w-[2.35rem] items-center justify-center border px-[0.55rem] py-[0.35rem] text-[0.72rem] font-extrabold transition-all duration-200 {preferences.language ===
      'id'
        ? 'border-riso-blue bg-riso-blue text-accent-foreground shadow-[2px_2px_0_var(--riso-pink)]'
        : 'border-transparent bg-transparent text-ink-muted hover:bg-riso-blue-soft hover:text-ink'}"
      aria-pressed={preferences.language === "id"}
      onclick={() => preferences.setLanguage("id")}>ID</button
    >
  </div>
  <button
    class="inline-flex size-10 items-center justify-center border border-ink bg-transparent text-ink transition-colors hover:bg-riso-pink-soft"
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
