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
    class="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl border-slate-700 bg-slate-800/50">
    <div class="w-full max-w-md">
      <label class="block text-sm font-medium text-slate-300 mb-2">Paste YouTube Link</label>
      <div class="flex space-x-2">
        <input v-model="url" type="text" placeholder="https://youtube.com/watch?v=..."
          class="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          @keyup.enter="handleAdd" />
        <button @click="handleAdd"
          class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Add to Queue
        </button>
      </div>
      <p class="text-xs text-slate-500 mt-3 text-center">
        Video will be downloaded and converted to high-quality audio formats.
      </p>
    </div>
  </div>
</template>
