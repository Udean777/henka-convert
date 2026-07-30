<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConversionStore } from '../stores/conversion'
import JSZip from 'jszip'

const store = useConversionStore()
const appendSuffix = ref(true)

const reversedJobs = computed(() => store.jobs.slice().reverse())

const allCompleted = computed(() => {
  return store.jobs.length > 0 && store.jobs.every((j) => j.status === 'COMPLETED')
})

const hasIdleOrError = computed(() => {
  return store.jobs.some((j) => j.status === 'IDLE' || j.status === 'ERROR')
})

function getFileName(job: any) {
  if (job.resultName) return job.resultName
  const originalName = job.file.name
  const targetExt = job.targetFormat?.extension
  const baseName = originalName.split('.').slice(0, -1).join('.') || originalName
  const suffix = appendSuffix.value ? '_henka_convert' : ''
  return `${baseName}${suffix}.${targetExt}`
}

async function downloadAll() {
  const zip = new JSZip()
  const nameCount: Record<string, number> = {}
  for (const job of store.jobs) {
    if (job.status === 'COMPLETED' && job.resultUrl) {
      const response = await fetch(job.resultUrl)
      const blob = await response.blob()
      let fileName = getFileName(job)
      if (nameCount[fileName]) {
        const parts = fileName.split('.')
        const ext = parts.pop()
        fileName = `${parts.join('.')}_(${nameCount[fileName]}).${ext}`
        nameCount[fileName] = 1
      } else {
        nameCount[fileName] = 1
      }
      zip.file(fileName, blob)
    }
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(zipBlob)
  a.download = 'henka_convert_batch.zip'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<template>
  <div
    v-if="store.jobs.length > 0"
    class="w-full mt-[var(--space-lg)] flex flex-col gap-[var(--space-sm)]"
  >
    <div class="flex justify-between items-center px-1 mb-1">
      <h3 class="text-sm font-medium text-ink" style="font-size: var(--text-sm)">
        Queue ({{ store.jobs.length }})
      </h3>
      <div class="flex items-center gap-4">
        <label
          class="flex items-center gap-2 text-xs text-ink-3 cursor-pointer hover:text-ink-2 transition-colors"
          style="font-size: var(--text-xs)"
        >
          <input
            type="checkbox"
            v-model="appendSuffix"
            class="rounded border-rule bg-paper text-accent-2"
            style="accent-color: var(--color-accent-2)"
          />
          <span>Add suffix</span>
        </label>

        <div class="flex gap-2">
          <button
            @click="store.clearAll()"
            class="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-pill)] text-ink-3 hover:text-accent-3 hover:bg-accent-3/5 transition-all duration-200"
            style="font-size: var(--text-xs)"
          >
            Clear All
          </button>

          <button v-if="hasIdleOrError" @click="store.startAll()" class="btn btn--primary btn--sm">
            Convert All
          </button>

          <button v-else-if="allCompleted" @click="downloadAll()" class="btn btn--mint btn--sm">
            Download ZIP
          </button>
        </div>
      </div>
    </div>

    <div
      v-for="job in reversedJobs"
      :key="job.id"
      class="card p-[var(--space-sm)] flex items-center justify-between gap-4"
    >
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex items-center gap-2">
          <span
            class="text-sm font-medium text-ink truncate"
            :title="job.resultName || job.file.name"
            style="font-size: var(--text-sm)"
          >
            {{ job.resultName || job.file.name }}
          </span>
          <span class="text-xs text-ink-3 font-mono shrink-0" style="font-size: var(--text-xs)">
            {{ (job.file.size / 1024 / 1024).toFixed(2) }} MB
          </span>
        </div>

        <div class="mt-1 flex items-center gap-2">
          <span
            v-if="job.status === 'ERROR'"
            class="text-xs"
            style="font-size: var(--text-xs); color: var(--color-error)"
          >
            {{ job.error || 'Failed' }}
          </span>
          <span
            v-else-if="job.status === 'COMPLETED'"
            class="text-xs font-medium"
            style="font-size: var(--text-xs); color: var(--color-mint)"
          >
            Completed
          </span>
          <span
            v-else-if="job.status === 'PROCESSING'"
            class="text-xs flex items-center gap-1"
            style="font-size: var(--text-xs); color: var(--color-accent-2)"
          >
            <svg
              class="animate-spin h-3 w-3"
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
            Processing {{ job.progress > 0 ? job.progress + '%' : '...' }}
          </span>
          <span v-else class="text-xs text-ink-3" style="font-size: var(--text-xs)">Ready</span>
        </div>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <select
          v-if="job.status === 'IDLE' || job.status === 'ERROR'"
          :value="job.targetFormat?.extension"
          @change="
            (e) => {
              const val = (e.target as HTMLSelectElement).value
              const fmt = job.availableTargets.find((t) => t.extension === val)
              if (fmt) store.setTargetFormat(job.id, fmt)
            }
          "
          class="border border-rule text-ink text-sm rounded-[var(--radius-lg)] px-2 py-1 outline-none cursor-pointer bg-paper transition-all duration-200 focus:border-accent-2"
          style="font-size: var(--text-sm)"
        >
          <option v-for="fmt in job.availableTargets" :key="fmt.extension" :value="fmt.extension">
            {{ fmt.extension.toUpperCase() }}
          </option>
          <option v-if="job.availableTargets.length === 0" value="" disabled>No target</option>
        </select>

        <span
          v-else-if="job.targetFormat"
          class="text-xs font-medium px-2 py-1 rounded-[var(--radius-md)] bg-paper-2 text-ink-3 border border-rule font-mono"
          style="font-size: var(--text-xs)"
        >
          {{ job.targetFormat.extension.toUpperCase() }}
        </span>

        <button
          v-if="job.status === 'IDLE' || job.status === 'ERROR'"
          @click="store.startJob(job.id)"
          :disabled="!job.targetFormat || job.availableTargets.length === 0"
          class="btn btn--primary btn--sm"
        >
          Convert
        </button>

        <a
          v-if="job.status === 'COMPLETED' && job.resultUrl"
          :href="job.resultUrl"
          :download="getFileName(job)"
          class="btn btn--mint btn--sm"
        >
          Download
        </a>

        <button
          @click="store.removeJob(job.id)"
          class="p-1.5 text-ink-3 hover:text-accent-3 hover:bg-accent-3/5 rounded-[var(--radius-md)] transition-all duration-200"
          title="Remove"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
</template>
