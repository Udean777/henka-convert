import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeMode>('light')

  const initTheme = () => {
    const saved = localStorage.getItem('henka_theme') as ThemeMode | null
    if (saved === 'dark' || saved === 'light') {
      currentTheme.value = saved
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme.value = 'dark'
    } else {
      currentTheme.value = 'light'
    }
    applyTheme()
  }

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('henka_theme', currentTheme.value)
    applyTheme()
  }

  const applyTheme = () => {
    if (currentTheme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    currentTheme,
    initTheme,
    toggleTheme,
  }
})
