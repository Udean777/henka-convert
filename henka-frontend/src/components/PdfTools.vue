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
  store.resultUrl = null
  if (selectedAction.value === 'merge') {
    store.mergePdfs()
  } else if (selectedAction.value === 'rotate') {
    store.rotatePdf(90)
  } else {
    store.error = 'Not implemented yet'
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-[var(--space-lg)]">
    <div
      @dragenter.prevent="isDragging = true"
      @dragover.prevent
      @dragleave.prevent="isDragging = false"
      @drop="handleDrop"
    >
      <label
        :class="[
          'relative flex flex-col items-center justify-center w-full h-32 cursor-pointer border-2 border-dashed transition-colors duration-200',
          isDragging
            ? 'border-accent-3 bg-accent-3/5 scale-[1.01]'
            : 'border-rule hover:border-ink-3/30 bg-paper-2/30',
        ]"
        :style="{ borderRadius: 'var(--radius-card)' }"
      >
        <div class="flex flex-col items-center justify-center">
          <p class="mb-1 text-base font-medium text-ink" style="font-size: var(--text-base)">
            <span class="text-accent-3">Click</span> or drag PDF files here
          </p>
          <p class="text-xs text-ink-3" style="font-size: var(--text-xs)">
            Only .pdf files are supported here
          </p>
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

    <div
      v-if="store.error"
      class="p-3 rounded-[var(--radius-lg)] text-sm"
      style="
        background: var(--color-error-bg);
        color: var(--color-error);
        border: 1px solid color-mix(in oklch, var(--color-error) 20%, transparent);
      "
    >
      {{ store.error }}
    </div>

    <div v-if="store.files.length > 0" class="flex flex-col gap-[var(--space-md)]">
      <div class="card p-3">
        <div class="flex justify-between items-center mb-2 px-1">
          <span class="text-sm font-medium text-ink" style="font-size: var(--text-sm)">
            Selected PDFs ({{ store.files.length }})
          </span>
          <button
            @click="store.clear()"
            class="text-xs text-ink-3 hover:text-accent-3 transition-colors"
            style="font-size: var(--text-xs)"
          >
            Clear All
          </button>
        </div>
        <div class="flex flex-col gap-[var(--space-2xs)]">
          <div
            v-for="(file, index) in store.files"
            :key="index"
            class="flex justify-between items-center p-2 rounded-[var(--radius-md)]"
            style="background: var(--color-paper-2)"
          >
            <span class="text-sm text-ink truncate max-w-[80%]" style="font-size: var(--text-sm)">{{
              file.name
            }}</span>
            <button
              @click="store.removeFile(index)"
              class="text-ink-3 hover:text-accent-3 transition-colors p-1"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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

      <div
        class="flex items-center justify-between gap-4 p-3"
        style="background: var(--color-paper-2); border-radius: var(--radius-card)"
      >
        <div class="flex gap-2">
          <button
            @click="selectedAction = 'merge'"
            :class="[
              'px-3 py-1.5 rounded-[var(--radius-pill)] text-sm font-medium transition-colors duration-200',
              selectedAction === 'merge'
                ? 'btn btn--coral btn--sm'
                : 'text-ink-2 hover:text-ink hover:bg-paper-3',
            ]"
          >
            Merge
          </button>
          <button
            @click="selectedAction = 'rotate'"
            :class="[
              'px-3 py-1.5 rounded-[var(--radius-pill)] text-sm font-medium transition-colors duration-200',
              selectedAction === 'rotate'
                ? 'btn btn--coral btn--sm'
                : 'text-ink-2 hover:text-ink hover:bg-paper-3',
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
            class="btn btn--mint btn--sm"
          >
            Download Result
          </a>

          <button @click="executeAction" :disabled="store.isProcessing" class="btn btn--coral">
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
