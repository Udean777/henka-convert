<script lang="ts">
  import { getContext } from "svelte";
  import { Moon, Sun } from "@lucide/svelte";
  import { messages } from "$lib/i18n/messages";
  import { PREFERENCES_CONTEXT, type Preferences } from "./preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
</script>

<div class="preference-controls">
  <div class="language-control" role="group" aria-label={text.languageLabel}>
    <button
      class="language-option {preferences.language === 'en'
        ? 'is-selected'
        : ''}"
      aria-pressed={preferences.language === "en"}
      onclick={() => preferences.setLanguage("en")}>EN</button
    >
    <button
      class="language-option {preferences.language === 'id'
        ? 'is-selected'
        : ''}"
      aria-pressed={preferences.language === "id"}
      onclick={() => preferences.setLanguage("id")}>ID</button
    >
  </div>
  <button
    class="theme-toggle"
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

<style>
  .preference-controls {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .language-control {
    display: flex;
    gap: 0.15rem;
    border: 1px solid var(--ink);
    padding: 0.2rem;
  }

  .language-option,
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    color: var(--ink-muted);
    cursor: pointer;
    transition:
      background-color 120ms ease,
      color 120ms ease;
  }

  .language-option {
    min-width: 2.35rem;
    min-height: 2rem;
    padding: 0.35rem 0.55rem;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .language-option:hover,
  .theme-toggle:hover {
    color: var(--ink);
  }

  .language-option.is-selected {
    background: var(--riso-blue);
    color: #fff9ed;
  }

  :global(:root.dark) .language-option.is-selected {
    color: #201e1e;
  }

  .theme-toggle {
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid var(--ink);
    color: var(--ink);
  }

  .theme-toggle:hover {
    background: var(--riso-pink-soft);
  }

  @media (max-width: 480px) {
    .preference-controls {
      gap: 0.4rem;
    }
  }
</style>
