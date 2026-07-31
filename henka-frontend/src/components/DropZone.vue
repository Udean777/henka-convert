<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConversionStore } from '../stores/conversion'
import { useI18nStore, translations } from '../stores/i18n'

const store = useConversionStore()
const i18nStore = useI18nStore()
const t = computed(() => translations[i18nStore.currentLang])

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false
  if (e.dataTransfer?.files) {
    store.addFiles(Array.from(e.dataTransfer.files))
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    store.addFiles(Array.from(target.files))
    target.value = ''
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div
    class="w-full max-w-[var(--page-max)] cursor-pointer"
    @click="triggerFileInput"
    @dragover.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @drop.prevent="handleDrop"
  >
    <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />

    <div
      :class="[
        'w-full flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-[var(--radius-card)] transition-all duration-200 text-center relative overflow-hidden',
        isDragOver
          ? 'border-accent-2 bg-accent-2/10 scale-[1.01]'
          : 'border-rule hover:border-accent-2/50 bg-paper-2/30',
      ]"
    >
      <div
        class="flex items-center justify-center mb-4 w-12 h-12 rounded-[var(--radius-lg)] bg-paper-2/50 text-ink-3 shadow-[inset_0_1px_0_0_var(--color-rule)]"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      <h3 class="text-lg font-semibold text-ink mb-1">
        {{ t.dropZoneTitle }}
      </h3>
      <p class="text-xs text-ink-3 mb-6 max-w-xs">
        {{ t.dropZoneSubtitle }}
      </p>

      <button
        type="button"
        class="btn btn--secondary btn--sm pointer-events-none"
        @click.stop="triggerFileInput"
      >
        {{ t.chooseFiles }}
      </button>
    </div>
  </div>
</template>
