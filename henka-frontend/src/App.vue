<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from './components/MainLayout.vue'
import DropZone from './components/DropZone.vue'
import YouTubeInput from './components/YouTubeInput.vue'
import JobQueue from './components/JobQueue.vue'
import PdfTools from './components/PdfTools.vue'

const activeTab = ref<'converter' | 'youtube' | 'pdf-tools'>('converter')
</script>

<template>
  <MainLayout>
    <!-- Tab Navigation -->
    <div
      class="w-full max-w-2xl flex p-1 bg-slate-800/50 rounded-lg mb-6 border border-slate-700/50 shadow-sm"
    >
      <button
        @click="activeTab = 'converter'"
        :class="[
          'flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200',
          activeTab === 'converter'
            ? 'bg-slate-700 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30',
        ]"
      >
        File Converter
      </button>
      <button
        @click="activeTab = 'youtube'"
        :class="[
          'flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200',
          activeTab === 'youtube'
            ? 'bg-slate-700 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30',
        ]"
      >
        YouTube to Audio
      </button>
      <button
        @click="activeTab = 'pdf-tools'"
        :class="[
          'flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200',
          activeTab === 'pdf-tools'
            ? 'bg-slate-700 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30',
        ]"
      >
        PDF Tools
      </button>
    </div>

    <!-- Views -->
    <div
      v-if="activeTab === 'converter'"
      class="w-full flex flex-col items-center gap-4 transition-opacity duration-300"
    >
      <DropZone />
      <JobQueue />
    </div>

    <div
      v-else-if="activeTab === 'youtube'"
      class="w-full flex flex-col items-center gap-4 transition-opacity duration-300"
    >
      <YouTubeInput />
      <JobQueue />
    </div>

    <div
      v-else-if="activeTab === 'pdf-tools'"
      class="w-full max-w-2xl transition-opacity duration-300"
    >
      <PdfTools />
    </div>
  </MainLayout>
</template>
