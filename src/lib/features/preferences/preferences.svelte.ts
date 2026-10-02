import type { Language } from "$lib/i18n/messages";

export type Preferences = ReturnType<typeof createPreferences>;

export function createPreferences() {
  const state = $state({
    language: "en" as Language,
    dark: false,
  });

  return {
    get language() {
      return state.language;
    },
    get dark() {
      return state.dark;
    },
    initialize() {
      try {
        const savedLanguage = localStorage.getItem("henka-language");
        if (savedLanguage === "id" || savedLanguage === "en") {
          state.language = savedLanguage;
        }
      } catch {
        // Keep the defaults when browser storage is unavailable.
      }

      document.documentElement.lang = state.language;
      state.dark = document.documentElement.classList.contains("dark");
    },
    setLanguage(language: Language) {
      state.language = language;
      document.documentElement.lang = language;
      try {
        localStorage.setItem("henka-language", language);
      } catch {
        // The choice still applies until this page is closed.
      }
    },
    toggleTheme() {
      state.dark = !state.dark;
      document.documentElement.classList.toggle("dark", state.dark);
      try {
        localStorage.setItem("henka-theme", state.dark ? "dark" : "light");
      } catch {
        // The choice still applies until this page is closed.
      }
    },
  };
}
