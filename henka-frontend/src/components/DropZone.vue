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
    class="w-full transition-colors duration-200"
  >
    <label
      :class="[
        'relative flex flex-col items-center justify-center w-full h-48 rounded-xl cursor-pointer border-2 border-dashed overflow-hidden transition-colors duration-200',
        isDragging
          ? 'border-blue-500 bg-blue-500/5'
          : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500',
      ]"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <div class="p-3 rounded-lg bg-slate-700/50 mb-4 text-slate-400">
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
        </div>
        <p class="mb-1 text-lg font-medium text-slate-200">
          <span class="text-blue-400">Click to upload</span> or drag and drop
        </p>
        <p class="text-sm text-slate-500 mt-1 text-center">
          Supports Images, Spreadsheets, JSON, Word Docs, and .ZIP archives<br /><span
            class="text-xs text-slate-600"
            >(Local & Server Processing)</span
          >
        </p>
      </div>
      <input type="file" class="hidden" multiple @change="handleFileSelect" />
    </label>
  </div>
</template>
