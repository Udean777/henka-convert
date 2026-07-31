<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import { useI18nStore, translations } from '../stores/i18n'
import { ShieldCheck, Zap, Layers, Video, ArrowRight, ChevronDown } from '@lucide/vue'

const router = useRouter()
const i18nStore = useI18nStore()
const t = computed(() => translations[i18nStore.currentLang])

const activeFaq = ref<number | null>(0)

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const goToApp = () => {
  router.push('/app')
}
</script>

<template>
  <MainLayout>
    <!-- Hero Section -->
    <div class="w-full flex flex-col items-center text-center py-6 sm:py-12 gap-6 max-w-3xl">
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper-2 border border-rule text-xs font-mono text-ink-2 font-medium"
      >
        <span class="w-2 h-2 rounded-full bg-mint animate-pulse"></span>
        <span>{{ t.landingTag }}</span>
      </div>

      <h1
        class="text-4xl sm:text-6xl font-bold tracking-tight text-ink"
        style="font-family: var(--font-display); line-height: 1.1"
      >
        {{ t.landingTitlePrefix }}<span class="hl">{{ t.landingTitleHighlight }}</span>
      </h1>

      <p class="text-base sm:text-lg text-ink-2 max-w-xl leading-relaxed">
        {{ t.landingSubtitle }}
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-4 mt-2">
        <button @click="goToApp" class="btn btn--primary btn--lg group cursor-pointer">
          <span>{{ t.openConverterApp }}</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <a href="#features" class="btn btn--secondary btn--lg cursor-pointer">
          {{ t.exploreFeatures }}
        </a>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-3 gap-4 sm:gap-8 pt-8 mt-4 border-t border-rule w-full max-w-lg">
        <div>
          <div class="text-xl sm:text-2xl font-bold text-ink font-mono">0ms</div>
          <div class="text-xs text-ink-3 mt-0.5">{{ t.statUsers }}</div>
        </div>
        <div>
          <div class="text-xl sm:text-2xl font-bold text-ink font-mono">7,400+</div>
          <div class="text-xs text-ink-3 mt-0.5">{{ t.statFormats }}</div>
        </div>
        <div>
          <div class="text-xl sm:text-2xl font-bold text-accent-2 font-mono">100%</div>
          <div class="text-xs text-ink-3 mt-0.5">{{ t.statPrivacy }}</div>
        </div>
      </div>
    </div>

    <!-- Feature Grid Section -->
    <div id="features" class="w-full py-12 flex flex-col items-center gap-10 border-t border-rule">
      <div class="text-center space-y-2 max-w-md">
        <h2
          class="text-2xl sm:text-3xl font-bold tracking-tight text-ink"
          style="font-family: var(--font-display)"
        >
          {{ t.whyHenkaTitle }}
        </h2>
        <p class="text-sm text-ink-3">
          {{ t.whyHenkaSubtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        <div class="card p-6 flex flex-col gap-3 border border-rule bg-paper">
          <div
            class="w-10 h-10 rounded-[var(--radius-lg)] bg-accent-2/10 text-accent-2 flex items-center justify-center"
          >
            <ShieldCheck class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-semibold text-ink">{{ t.feature1Title }}</h3>
          <p class="text-sm text-ink-3 leading-relaxed">{{ t.feature1Desc }}</p>
        </div>

        <div class="card p-6 flex flex-col gap-3 border border-rule bg-paper">
          <div
            class="w-10 h-10 rounded-[var(--radius-lg)] bg-accent-3/10 text-accent-3 flex items-center justify-center"
          >
            <Layers class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-semibold text-ink">{{ t.feature2Title }}</h3>
          <p class="text-sm text-ink-3 leading-relaxed">{{ t.feature2Desc }}</p>
        </div>

        <div class="card p-6 flex flex-col gap-3 border border-rule bg-paper">
          <div
            class="w-10 h-10 rounded-[var(--radius-lg)] bg-mint/10 text-mint flex items-center justify-center"
          >
            <Zap class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-semibold text-ink">{{ t.feature3Title }}</h3>
          <p class="text-sm text-ink-3 leading-relaxed">{{ t.feature3Desc }}</p>
        </div>

        <div class="card p-6 flex flex-col gap-3 border border-rule bg-paper">
          <div
            class="w-10 h-10 rounded-[var(--radius-lg)] bg-accent/20 text-ink flex items-center justify-center"
          >
            <Video class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-semibold text-ink">{{ t.feature4Title }}</h3>
          <p class="text-sm text-ink-3 leading-relaxed">{{ t.feature4Desc }}</p>
        </div>
      </div>
    </div>

    <!-- FAQ Accordion Section -->
    <div class="w-full py-12 flex flex-col items-center gap-8 border-t border-rule max-w-3xl">
      <div class="text-center">
        <h2
          class="text-2xl sm:text-3xl font-bold text-ink"
          style="font-family: var(--font-display)"
        >
          {{ t.faqTitle }}
        </h2>
      </div>

      <div class="w-full space-y-3">
        <div class="card border border-rule overflow-hidden transition-all duration-200">
          <button
            @click="toggleFaq(0)"
            class="w-full p-4 text-left font-medium text-ink flex justify-between items-center cursor-pointer hover:bg-paper-2"
          >
            <span>{{ t.faq1Q }}</span>
            <ChevronDown
              class="w-4 h-4 text-ink-3 transition-transform duration-200"
              :class="{ 'rotate-180': activeFaq === 0 }"
            />
          </button>
          <div
            v-if="activeFaq === 0"
            class="px-4 pb-4 text-sm text-ink-3 leading-relaxed border-t border-rule/40 pt-3"
          >
            {{ t.faq1A }}
          </div>
        </div>

        <div class="card border border-rule overflow-hidden transition-all duration-200">
          <button
            @click="toggleFaq(1)"
            class="w-full p-4 text-left font-medium text-ink flex justify-between items-center cursor-pointer hover:bg-paper-2"
          >
            <span>{{ t.faq2Q }}</span>
            <ChevronDown
              class="w-4 h-4 text-ink-3 transition-transform duration-200"
              :class="{ 'rotate-180': activeFaq === 1 }"
            />
          </button>
          <div
            v-if="activeFaq === 1"
            class="px-4 pb-4 text-sm text-ink-3 leading-relaxed border-t border-rule/40 pt-3"
          >
            {{ t.faq2A }}
          </div>
        </div>

        <div class="card border border-rule overflow-hidden transition-all duration-200">
          <button
            @click="toggleFaq(2)"
            class="w-full p-4 text-left font-medium text-ink flex justify-between items-center cursor-pointer hover:bg-paper-2"
          >
            <span>{{ t.faq3Q }}</span>
            <ChevronDown
              class="w-4 h-4 text-ink-3 transition-transform duration-200"
              :class="{ 'rotate-180': activeFaq === 2 }"
            />
          </button>
          <div
            v-if="activeFaq === 2"
            class="px-4 pb-4 text-sm text-ink-3 leading-relaxed border-t border-rule/40 pt-3"
          >
            {{ t.faq3A }}
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div
      class="w-full my-8 p-8 sm:p-12 rounded-[var(--radius-card)] bg-paper-2 border border-rule flex flex-col items-center text-center gap-4 max-w-3xl"
    >
      <h2 class="text-3xl font-bold text-ink" style="font-family: var(--font-display)">
        {{ t.ctaTitle }}
      </h2>
      <p class="text-sm text-ink-3 max-w-md">
        {{ t.ctaSubtitle }}
      </p>
      <button @click="goToApp" class="btn btn--primary btn--lg cursor-pointer mt-2">
        {{ t.openConverterApp }}
      </button>
    </div>
  </MainLayout>
</template>
