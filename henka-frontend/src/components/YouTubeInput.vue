<script setup lang="ts">
import { ref } from 'vue'
import { useConversionStore } from '../stores/conversion'

const store = useConversionStore()
const url = ref('')

const handleAdd = () => {
  if (url.value.trim() !== '') {
    store.addYouTubeJob(url.value.trim())
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
      <div class="flex gap-2">
        <input
          v-model="url"
          type="text"
          placeholder="https://youtube.com/watch?v=..."
          class="flex-1 border border-rule rounded-[var(--radius-lg)] px-4 py-2 text-ink bg-paper outline-none transition-all duration-200 placeholder:text-ink-3/50 focus:border-accent-2 focus:shadow-[0_0_0_3px_var(--color-accent-2/15)]"
          style="font-size: var(--text-sm)"
          @keyup.enter="handleAdd"
        />
        <button @click="handleAdd" class="btn btn--primary btn--sm shrink-0">Add to Queue</button>
      </div>
      <p class="text-xs text-ink-3 mt-3 text-center" style="font-size: var(--text-xs)">
        Video will be downloaded and converted to high-quality audio formats.
      </p>
    </div>
  </div>
</template>
