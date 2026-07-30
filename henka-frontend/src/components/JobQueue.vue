<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConversionStore } from '../stores/conversion'
import JSZip from 'jszip'

const store = useConversionStore()
const appendSuffix = ref(true)

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

  // Add all completed files to zip
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

  // Generate and download zip
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
  <div v-if="store.jobs.length > 0" class="w-full mt-6 space-y-3">
    <!-- Header Controls -->
    <div class="flex justify-between items-center px-1 mb-2">
      <h3 class="text-slate-300 font-medium">Conversion Queue ({{ store.jobs.length }})</h3>
      <div class="flex items-center gap-4">
        <!-- Naming Option -->
        <label
          class="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
        >
          <input
            type="checkbox"
            v-model="appendSuffix"
            class="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/50"
          />
          <span>Add _henka_convert suffix</span>
        </label>

        <div class="flex gap-2">
          <button
            @click="store.clearAll()"
            class="text-xs font-medium px-3 py-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Clear All
          </button>

          <button
            v-if="hasIdleOrError"
            @click="store.startAll()"
            class="text-xs font-medium px-4 py-1.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Convert All
          </button>

          <button
            v-else-if="allCompleted"
            @click="downloadAll()"
            class="text-xs font-medium px-4 py-1.5 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Download ZIP
          </button>
        </div>
      </div>
    </div>

    <!-- Job List -->
    <div
      v-for="job in store.jobs"
      :key="job.id"
      class="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center justify-between gap-4"
    >
      <!-- File Info -->
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-slate-200 truncate" :title="job.resultName || job.file.name">{{
            job.resultName || job.file.name
          }}</span>
          <span class="text-xs text-slate-500 font-mono shrink-0"
            >{{ (job.file.size / 1024 / 1024).toFixed(2) }} MB</span
          >
        </div>

        <!-- Status Indicator -->
        <div class="mt-1 flex items-center gap-2">
          <span v-if="job.status === 'ERROR'" class="text-xs text-red-400">{{
            job.error || 'Failed'
          }}</span>
          <span v-else-if="job.status === 'COMPLETED'" class="text-xs text-emerald-400"
            >Completed</span
          >
          <span
            v-else-if="job.status === 'PROCESSING'"
            class="text-xs text-blue-400 flex items-center gap-1"
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
          <span v-else class="text-xs text-slate-500">Ready</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-3">
        <!-- Target Format Selector -->
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
          class="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1 outline-none focus:border-blue-500 cursor-pointer"
        >
          <option v-for="fmt in job.availableTargets" :key="fmt.extension" :value="fmt.extension">
            {{ fmt.extension.toUpperCase() }}
          </option>
          <option v-if="job.availableTargets.length === 0" value="" disabled>
            No target available
          </option>
        </select>

        <span
          v-else-if="job.targetFormat"
          class="text-xs font-medium px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-700"
        >
          ➜ {{ job.targetFormat.extension.toUpperCase() }}
        </span>

        <!-- Action Buttons -->
        <button
          v-if="job.status === 'IDLE' || job.status === 'ERROR'"
          @click="store.startJob(job.id)"
          :disabled="!job.targetFormat || job.availableTargets.length === 0"
          class="px-3 py-1.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Convert
        </button>

        <a
          v-if="job.status === 'COMPLETED' && job.resultUrl"
          :href="job.resultUrl"
          :download="getFileName(job)"
          class="px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
        >
          Download
        </a>

        <!-- Remove Button -->
        <button
          @click="store.removeJob(job.id)"
          class="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          title="Remove"
        >
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
</template>
