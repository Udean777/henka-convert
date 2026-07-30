<script setup lang="ts">
import { ref } from 'vue'
import { usePdfStore } from '../stores/pdf'

const store = usePdfStore()
const isDragging = ref(false)
const selectedAction = ref<'merge' | 'rotate' | 'split'>('merge')

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files) {
    store.addFiles(e.dataTransfer.files)
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    store.addFiles(target.files)
  }
  target.value = ''
}

const executeAction = () => {
  store.resultUrl = null // Reset previous result
  if (selectedAction.value === 'merge') {
    store.mergePdfs()
  } else if (selectedAction.value === 'rotate') {
    store.rotatePdf(90) // Rotate 90 degrees clockwise
  } else {
    store.error = 'Not implemented yet'
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <!-- PDF Specific DropZone -->
    <div
      @dragenter.prevent="isDragging = true"
      @dragover.prevent
      @dragleave.prevent="isDragging = false"
      @drop="handleDrop"
    >
      <label
        :class="[
          'relative flex flex-col items-center justify-center w-full h-32 rounded-xl cursor-pointer border-2 border-dashed transition-colors duration-200',
          isDragging
            ? 'border-red-500 bg-red-500/5'
            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500',
        ]"
      >
        <div class="flex flex-col items-center justify-center">
          <p class="mb-1 text-base font-medium text-slate-200">
            <span class="text-red-400">Click</span> or drag PDF files here
          </p>
          <p class="text-xs text-slate-500">Only .pdf files are supported here</p>
        </div>
        <input
          type="file"
          class="hidden"
          multiple
          accept="application/pdf"
          @change="handleFileSelect"
        />
      </label>
    </div>

    <!-- Error Alert -->
    <div
      v-if="store.error"
      class="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
    >
      {{ store.error }}
    </div>

    <!-- Tool Selection & File List -->
    <div v-if="store.files.length > 0" class="flex flex-col gap-4">
      <!-- Files List -->
      <div class="bg-slate-800 border border-slate-700 rounded-xl p-3">
        <div class="flex justify-between items-center mb-2 px-1">
          <span class="text-sm font-medium text-slate-300"
            >Selected PDFs ({{ store.files.length }})</span
          >
          <button
            @click="store.clear()"
            class="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-for="(file, index) in store.files"
            :key="index"
            class="flex justify-between items-center bg-slate-900/50 p-2 rounded-md border border-slate-700/50"
          >
            <span class="text-sm text-slate-300 truncate max-w-[80%]">{{ file.name }}</span>
            <button @click="store.removeFile(index)" class="text-slate-500 hover:text-red-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Tool Action Bar -->
      <div
        class="flex items-center justify-between gap-4 bg-slate-800 border border-slate-700 p-3 rounded-xl"
      >
        <div class="flex gap-2">
          <button
            @click="selectedAction = 'merge'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedAction === 'merge'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
            ]"
          >
            Merge
          </button>
          <button
            @click="selectedAction = 'rotate'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              selectedAction === 'rotate'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
            ]"
          >
            Rotate 90°
          </button>
        </div>

        <div class="flex items-center gap-2">
          <a
            v-if="store.resultUrl"
            :href="store.resultUrl"
            download="henka_pdf_tools_result.pdf"
            class="px-4 py-1.5 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Download Result
          </a>

          <button
            @click="executeAction"
            :disabled="store.isProcessing"
            class="px-4 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <svg
              v-if="store.isProcessing"
              class="animate-spin h-3.5 w-3.5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-if="store.isProcessing">Processing...</span>
            <span v-else>Execute</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
