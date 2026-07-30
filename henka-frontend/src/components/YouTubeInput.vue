<script setup lang="ts">
import { ref } from 'vue'
import { useConversionStore } from '../stores/conversion'

const store = useConversionStore()
const url = ref('')
const mediaType = ref<'audio' | 'video'>('audio')
const videoQuality = ref('720')

const handleAdd = () => {
  if (url.value.trim() !== '') {
    store.addYouTubeJob(
      url.value.trim(),
      mediaType.value,
      mediaType.value === 'video' ? videoQuality.value : undefined,
    )
    url.value = ''
  }
}
</script>

<template>
  <div
    class="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-rule bg-paper-2/30 transition-colors duration-200 hover:border-accent-2/50"
    :style="{ borderRadius: 'var(--radius-card)' }"
  >
    <div class="w-full max-w-md">
      <label class="block text-sm font-medium text-ink mb-2" style="font-size: var(--text-sm)"
        >Paste YouTube Link</label
      >
      <div class="flex flex-col gap-3">
        <!-- Input Row -->
        <div class="flex gap-2">
          <input
            v-model="url"
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            class="flex-1 border border-rule rounded-[var(--radius-lg)] px-4 py-2 text-ink bg-paper outline-none transition-colors duration-200 placeholder:text-ink-3/50 focus:border-accent-2 focus:shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-accent-2)_15%,transparent)]"
            style="font-size: var(--text-sm)"
            @keyup.enter="handleAdd"
          />
          <button @click="handleAdd" class="btn btn--primary btn--sm shrink-0">Add to Queue</button>
        </div>

        <!-- Options Row -->
        <div
          v-if="url.trim()"
          class="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <label class="flex items-center cursor-pointer select-none">
            <input type="radio" value="audio" v-model="mediaType" class="hidden peer" />
            <span
              class="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-lg)] border border-rule text-ink-3 peer-checked:bg-accent-2 peer-checked:text-paper peer-checked:border-accent-2 transition-all duration-200"
              >Audio</span
            >
          </label>
          <label class="flex items-center cursor-pointer select-none">
            <input type="radio" value="video" v-model="mediaType" class="hidden peer" />
            <span
              class="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-lg)] border border-rule text-ink-3 peer-checked:bg-accent-2 peer-checked:text-paper peer-checked:border-accent-2 transition-all duration-200"
              >Video</span
            >
          </label>

          <select
            v-if="mediaType === 'video'"
            v-model="videoQuality"
            class="border border-rule text-ink-2 text-xs rounded-[var(--radius-lg)] px-2 py-1.5 outline-none cursor-pointer bg-paper transition-all duration-200 focus:border-accent-2"
          >
            <option value="360">360p</option>
            <option value="480">480p</option>
            <option value="720">720p</option>
            <option value="1080">1080p</option>
            <option value="best">Best (4K+)</option>
          </select>
        </div>
      </div>
      <p class="text-xs text-ink-3 mt-4 text-center" style="font-size: var(--text-xs)">
        Download and convert YouTube videos to high-quality audio or video formats.
      </p>
    </div>
  </div>
</template>
