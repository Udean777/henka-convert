<script lang="ts">
  import { page } from "$app/state";
  import { getContext } from "svelte";
  import PreferenceControls from "$lib/features/preferences/PreferenceControls.svelte";
  import { messages } from "$lib/i18n/messages";
  import { siteChrome } from "$lib/features/marketing/content";
  import {
    PREFERENCES_CONTEXT,
    type Preferences,
  } from "$lib/features/preferences/preferences-context";

  const preferences = getContext<Preferences>(PREFERENCES_CONTEXT);
  const text = $derived(messages[preferences.language]);
  const chrome = $derived(siteChrome[preferences.language]);
  const currentPath = $derived(page.url.pathname);

  const navigation = $derived([
    { href: "/", label: chrome.home },
    { href: "/convert", label: chrome.convert },
    { href: "/formats", label: chrome.formats },
    { href: "/help", label: chrome.help },
  ]);
</script>

<header
  class="mx-auto flex w-full max-w-[1240px] flex-none flex-wrap items-center justify-between gap-4 border-b border-rule py-[1.1rem] max-[480px]:items-start"
>
  <a
    class="inline-flex items-center gap-[0.65rem] text-ink no-underline"
    href="/"
    aria-label={text.homeLabel}
  >
    <img
      class="block size-10 shrink-0 object-contain"
      src="/brand/henka-folded-ribbon.webp"
      alt=""
      aria-hidden="true"
      width="40"
      height="40"
      decoding="async"
    />
    <span class="text-xl font-extrabold tracking-[-0.07em]">henka</span>
    <span
      class="mb-[0.22rem] ml-[0.15rem] self-end text-[0.63rem] font-bold tracking-[0.12em] text-ink-muted uppercase max-[480px]:hidden"
      >file lab</span
    >
  </a>
  <nav
    class="ml-auto flex items-center justify-center gap-[clamp(0.8rem,2vw,1.6rem)] max-[480px]:order-3 max-[480px]:m-0 max-[480px]:w-full max-[480px]:justify-between max-[480px]:gap-2"
    aria-label={chrome.navigation}
  >
    {#each navigation as item (item.href)}
      {@const active =
        currentPath === item.href ||
        (item.href !== "/" && currentPath.startsWith(`${item.href}/`))}
      <a
        href={item.href}
        aria-current={active ? "page" : undefined}
        class="border-b-2 px-2 py-[0.45rem] text-[0.84rem] font-bold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-riso-pink max-[480px]:px-1 max-[480px]:text-[0.78rem] {active
          ? 'border-riso-pink bg-riso-blue text-accent-foreground shadow-[2px_2px_0_var(--riso-pink)]'
          : 'border-transparent text-ink-muted hover:border-riso-pink hover:bg-riso-blue-soft hover:text-ink'}"
        >{item.label}</a
      >
    {/each}
  </nav>
  <PreferenceControls />
</header>
