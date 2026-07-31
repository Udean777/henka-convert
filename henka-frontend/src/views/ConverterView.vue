<script setup lang="ts">
import { ref, computed } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import DropZone from '../components/DropZone.vue'
import YouTubeInput from '../components/YouTubeInput.vue'
import JobQueue from '../components/JobQueue.vue'
import PdfTools from '../components/PdfTools.vue'
import { useI18nStore, translations } from '../stores/i18n'

const activeTab = ref<'converter' | 'youtube' | 'pdf-tools'>('converter')
const i18nStore = useI18nStore()
const t = computed(() => translations[i18nStore.currentLang])
</script>

<template>
  <MainLayout>
    <div class="text-center space-y-3 mb-4">
      <h2
        class="text-4xl font-bold tracking-tight"
        style="font-family: var(--font-display); font-size: var(--text-4xl)"
      >
        {{ t.heroTitlePrefix }}<span class="hl">{{ t.heroTitleHighlight }}</span
        >{{ t.heroTitleSuffix }}
      </h2>
      <p class="text-ink-2 text-base max-w-lg mx-auto" style="font-size: var(--text-base)">
        {{ t.heroSubtitle }}
      </p>
    </div>

    <div
      class="w-full max-w-[var(--page-max)] flex p-1 rounded-[var(--radius-card)] mb-[var(--space-md)]"
      style="background: var(--color-paper-2)"
    >
      <button
        @click="activeTab = 'converter'"
        :class="[
          'flex-1 py-2 text-sm font-medium rounded-[var(--radius-pill)] transition-colors duration-200 cursor-pointer',
          activeTab === 'converter'
            ? 'shadow-[0_1px_0_0_var(--color-rule)] text-ink font-semibold'
            : 'text-ink-3 hover:text-ink-2',
        ]"
        :style="
          activeTab === 'converter'
            ? {
                background: 'var(--color-paper)',
                boxShadow: '0 1px 0 0 var(--color-rule), 0 1px 4px oklch(0 0 0 / 0.06)',
              }
            : {}
        "
      >
        {{ t.fileConverter }}
      </button>
      <button
        @click="activeTab = 'youtube'"
        :class="[
          'flex-1 py-2 text-sm font-medium rounded-[var(--radius-pill)] transition-colors duration-200 cursor-pointer',
          activeTab === 'youtube'
            ? 'shadow-[0_1px_0_0_var(--color-rule)] text-ink font-semibold'
            : 'text-ink-3 hover:text-ink-2',
        ]"
        :style="
          activeTab === 'youtube'
            ? {
                background: 'var(--color-paper)',
                boxShadow: '0 1px 0 0 var(--color-rule), 0 1px 4px oklch(0 0 0 / 0.06)',
              }
            : {}
        "
      >
        {{ t.youtubeToSomething }}
      </button>
      <button
        @click="activeTab = 'pdf-tools'"
        :class="[
          'flex-1 py-2 text-sm font-medium rounded-[var(--radius-pill)] transition-colors duration-200 cursor-pointer',
          activeTab === 'pdf-tools'
            ? 'shadow-[0_1px_0_0_var(--color-rule)] text-ink font-semibold'
            : 'text-ink-3 hover:text-ink-2',
        ]"
        :style="
          activeTab === 'pdf-tools'
            ? {
                background: 'var(--color-paper)',
                boxShadow: '0 1px 0 0 var(--color-rule), 0 1px 4px oklch(0 0 0 / 0.06)',
              }
            : {}
        "
      >
        {{ t.pdfTools }}
      </button>
    </div>

    <div
      v-if="activeTab === 'converter'"
      class="w-full flex flex-col items-center gap-[var(--space-md)] transition-opacity duration-300"
      style="animation: reveal 420ms var(--ease-out) forwards"
    >
      <DropZone />
      <JobQueue />
    </div>

    <div
      v-else-if="activeTab === 'youtube'"
      class="w-full flex flex-col items-center gap-[var(--space-md)] transition-opacity duration-300"
      style="animation: reveal 420ms var(--ease-out) forwards"
    >
      <YouTubeInput />
      <JobQueue />
    </div>

    <div
      v-else-if="activeTab === 'pdf-tools'"
      class="w-full max-w-[var(--page-max)] transition-opacity duration-300"
      style="animation: reveal 420ms var(--ease-out) forwards"
    >
      <PdfTools />
    </div>
  </MainLayout>
</template>
