<script setup lang="ts">
import { ref } from 'vue'
import { useConversionStore } from '../stores/conversion'

const store = useConversionStore()
const isDragging = ref(false)

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    store.addFiles(e.dataTransfer.files)
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    store.addFiles(target.files)
  }
  target.value = ''
}
</script>

<template>
  <div
    @dragenter="handleDragEnter"
    @dragover.prevent
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    class="w-full"
  >
    <label
      :class="[
        'relative flex flex-col items-center justify-center w-full h-48 cursor-pointer border-2 border-dashed overflow-hidden transition-colors duration-200',
        isDragging
          ? 'border-accent bg-accent/5 scale-[1.01]'
          : 'border-rule hover:border-accent-2/50 bg-paper-2/30',
      ]"
      :style="{ borderRadius: 'var(--radius-card)' }"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <div
          class="flex items-center justify-center mb-4 w-12 h-12 rounded-[var(--radius-lg)] bg-paper-2/50 text-ink-3 shadow-[inset_0_1px_0_0_var(--color-rule)]"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
        </div>
        <p class="mb-1 text-lg font-medium text-ink" style="font-size: var(--text-lg)">
          <span class="text-accent-2">Click to upload</span> or drag and drop
        </p>
        <p class="text-sm text-ink-3 mt-1 text-center" style="font-size: var(--text-sm)">
          Supports 40+ Formats across Images, Audio, Video, Documents, and Archives<br />
          <span
            class="text-xs"
            style="font-size: var(--text-xs); color: var(--color-ink-3); opacity: 0.7"
            >Local & Server Processing</span
          >
        </p>
      </div>
      <input type="file" class="hidden" multiple @change="handleFileSelect" />
    </label>
  </div>
</template>
