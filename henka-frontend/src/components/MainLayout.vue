<script setup lang="ts">
import { ref } from 'vue'
import GenericModal from './GenericModal.vue'

const isModalOpen = ref(false)
const modalContent = ref<'features' | 'formats' | null>(null)

const openModal = (type: 'features' | 'formats') => {
  modalContent.value = type
  isModalOpen.value = true
}
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-paper text-ink font-[family-name:var(--font-body)]">
    <header class="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-rule">
      <div class="max-w-[var(--page-max)] mx-auto px-[var(--page-gutter)] h-16 flex items-center justify-between"
        style="--page-max: 48rem">
        <!-- Logo -->
        <div class="flex items-center cursor-default group">
          <img src="/logo.png" alt="Henka Convert Logo"
            class="w-12 h-12 object-contain group-hover:-translate-y-0.5 transition-transform duration-200 drop-shadow-sm" />
          <h1 class="text-lg font-bold tracking-tight text-ink" style="font-family: var(--font-display)">
            Henka<span class="font-normal text-ink-3 transition-colors">Convert</span>
          </h1>
        </div>

        <!-- Right Side Badges & Links -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-paper-2 border border-rule">
            <span class="w-1.5 h-1.5 rounded-full bg-mint animate-pulse"
              style="background-color: var(--color-mint)"></span>
            <span class="text-[10px] font-mono text-ink-2 font-medium tracking-wide uppercase">WASM Engine</span>
          </div>

          <a href="https://github.com/Udean777/henka-convert" target="_blank"
            class="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-ink-3 hover:text-ink hover:bg-paper-2 border border-transparent hover:border-rule transition-all duration-200">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z">
              </path>
            </svg>
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>

    <main class="flex flex-col items-center px-[var(--page-gutter)] py-[var(--space-xl)]">
      <div class="w-full max-w-[var(--page-max)] flex flex-col items-center gap-[var(--space-lg)]"
        style="--page-max: 48rem">
        <div class="text-center space-y-3 mb-1">
          <h2 class="text-4xl font-bold tracking-tight"
            style="font-family: var(--font-display); font-size: var(--text-4xl)">
            Convert <span class="hl">Anything</span>, Locally.
          </h2>
          <p class="text-ink-2 text-base max-w-lg mx-auto" style="font-size: var(--text-base)">
            Your files never leave your device. Fast, secure, and private conversion powered by
            WebAssembly.
          </p>
        </div>

        <slot></slot>
      </div>
    </main>

    <footer class="mt-auto w-full border-t border-rule bg-paper">
      <div class="max-w-[var(--page-max)] mx-auto px-[var(--page-gutter)] py-10" style="--page-max: 48rem">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand & Mission -->
          <div class="flex flex-col gap-4">
            <div class="flex items-center">
              <img src="/logo.png" alt="Henka Convert Logo" class="w-12 h-12 object-contain drop-shadow-sm" />
              <h2 class="text-lg font-bold tracking-tight" style="font-family: var(--font-display)">
                Henka<span class="font-normal text-ink-2">Convert</span>
              </h2>
            </div>
            <p class="text-xs text-ink-3 leading-relaxed" style="font-size: var(--text-xs)">
              A privacy-first, lightning-fast file converter powered by WebAssembly and local
              engines. Your files never leave your device.
            </p>
          </div>

          <!-- Links Grid -->
          <div class="md:col-span-2 grid grid-cols-2 gap-8">
            <div class="flex flex-col gap-3">
              <h3 class="text-xs font-semibold text-ink uppercase tracking-wider">Product</h3>
              <a href="#" @click.prevent="openModal('features')"
                class="text-sm text-ink-3 hover:text-accent-2 transition-colors duration-200">Features</a>
              <a href="#" @click.prevent="openModal('formats')"
                class="text-sm text-ink-3 hover:text-accent-2 transition-colors duration-200">Supported Formats</a>
            </div>
            <div class="flex flex-col gap-3">
              <h3 class="text-xs font-semibold text-ink uppercase tracking-wider">Resources</h3>
              <a href="https://github.com/Udean777/henka-convert#readme" target="_blank"
                class="text-sm text-ink-3 hover:text-accent-2 transition-colors duration-200">Documentation</a>
              <a href="https://github.com/Udean777/henka-convert" target="_blank"
                class="text-sm text-ink-3 hover:text-accent-2 transition-colors duration-200">GitHub Repository</a>
              <a href="https://github.com/Udean777/henka-convert/issues" target="_blank"
                class="text-sm text-ink-3 hover:text-accent-2 transition-colors duration-200">Report Issue</a>
            </div>
          </div>
        </div>

        <div
          class="mt-10 pt-6 border-t border-rule flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-ink-3">
            <span>Crafted for privacy & speed.</span>
            <span class="hidden sm:inline w-1 h-1 rounded-full bg-ink-3/30"></span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              0 bytes uploaded to the cloud.
            </span>
          </div>
          <div class="flex items-center gap-3 text-xs text-ink-3 font-mono">
            <span>v1.0.0-beta</span>
            <span class="w-1 h-1 rounded-full bg-ink-3/30"></span>
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-accent-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              WASM Ready
            </span>
          </div>
        </div>
      </div>

      <!-- Subtle Marquee -->
      <div class="border-t border-rule bg-paper-2 overflow-hidden py-2">
        <div class="flex w-max marquee-scroll gap-2" aria-hidden="true">
          <!-- Block 1 -->
          <div class="flex items-center shrink-0 gap-2">
            <span>100% LOCAL</span><span class="text-accent-3">·</span>
            <span>PRIVATE BY DESIGN</span><span class="text-accent-3">·</span>
            <span>CONVERT ANYTHING</span><span class="text-accent-3">·</span>
            <span>NO CLOUD UPLOADS</span><span class="text-accent-3">·</span>
            <span>OPEN SOURCE</span><span class="text-accent-3">·</span> <span>100% LOCAL</span><span
              class="text-accent-3">·</span> <span>PRIVATE BY DESIGN</span><span class="text-accent-3">·</span>
            <span>CONVERT ANYTHING</span><span class="text-accent-3">·</span> <span>NO CLOUD UPLOADS</span><span
              class="text-accent-3">·</span> <span>OPEN SOURCE</span><span class="text-accent-3">·</span> <span>100%
              LOCAL</span><span class="text-accent-3">·</span> <span>PRIVATE BY DESIGN</span><span
              class="text-accent-3">·</span> <span>CONVERT ANYTHING</span><span class="text-accent-3">·</span> <span>NO
              CLOUD UPLOADS</span><span class="text-accent-3">·</span> <span>OPEN SOURCE</span><span
              class="text-accent-3">·</span> <span>100% LOCAL</span><span class="text-accent-3">·</span> <span>PRIVATE
              BY DESIGN</span><span class="text-accent-3">·</span> <span>CONVERT ANYTHING</span><span
              class="text-accent-3">·</span> <span>NO CLOUD UPLOADS</span><span class="text-accent-3">·</span>
            <span>OPEN SOURCE</span><span class="text-accent-3">·</span>
          </div>
          <!-- Block 2 (Clone) -->
          <div class="flex items-center shrink-0 gap-2">
            <span>100% LOCAL</span><span class="text-accent-3">·</span>
            <span>PRIVATE BY DESIGN</span><span class="text-accent-3">·</span>
            <span>CONVERT ANYTHING</span><span class="text-accent-3">·</span>
            <span>NO CLOUD UPLOADS</span><span class="text-accent-3">·</span>
            <span>OPEN SOURCE</span><span class="text-accent-3">·</span> <span>100% LOCAL</span><span
              class="text-accent-3">·</span> <span>PRIVATE BY DESIGN</span><span class="text-accent-3">·</span>
            <span>CONVERT ANYTHING</span><span class="text-accent-3">·</span> <span>NO CLOUD UPLOADS</span><span
              class="text-accent-3">·</span> <span>OPEN SOURCE</span><span class="text-accent-3">·</span> <span>100%
              LOCAL</span><span class="text-accent-3">·</span> <span>PRIVATE BY DESIGN</span><span
              class="text-accent-3">·</span> <span>CONVERT ANYTHING</span><span class="text-accent-3">·</span> <span>NO
              CLOUD UPLOADS</span><span class="text-accent-3">·</span> <span>OPEN SOURCE</span><span
              class="text-accent-3">·</span> <span>100% LOCAL</span><span class="text-accent-3">·</span> <span>PRIVATE
              BY DESIGN</span><span class="text-accent-3">·</span> <span>CONVERT ANYTHING</span><span
              class="text-accent-3">·</span> <span>NO CLOUD UPLOADS</span><span class="text-accent-3">·</span>
            <span>OPEN SOURCE</span><span class="text-accent-3">·</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <GenericModal :is-open="isModalOpen"
      :title="modalContent === 'features' ? 'Platform Features' : 'Supported Formats'" @close="isModalOpen = false">
      <div v-if="modalContent === 'features'" class="space-y-6 text-sm text-ink-2">
        <div class="flex gap-4">
          <div
            class="shrink-0 w-8 h-8 rounded-[var(--radius-md)] bg-paper-2 border border-rule flex items-center justify-center text-lg">
            🔒
          </div>
          <div>
            <h4 class="font-semibold text-ink text-base mb-1">100% Local & Private</h4>
            <p class="leading-relaxed">
              Semua konversi dilakukan langsung di perangkat Anda melalui WebAssembly dan server
              lokal. File Anda tidak pernah diunggah ke cloud.
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <div
            class="shrink-0 w-8 h-8 rounded-[var(--radius-md)] bg-paper-2 border border-rule flex items-center justify-center text-lg">
            🎥
          </div>
          <div>
            <h4 class="font-semibold text-ink text-base mb-1">YouTube to Media</h4>
            <p class="leading-relaxed">
              Unduh dan konversi video YouTube menjadi MP3 (Audio) atau MP4 (Video) secara instan
              dengan dukungan berbagai pilihan kualitas resolusi terbaik.
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <div
            class="shrink-0 w-8 h-8 rounded-[var(--radius-md)] bg-paper-2 border border-rule flex items-center justify-center text-lg">
            📄
          </div>
          <div>
            <h4 class="font-semibold text-ink text-base mb-1">PDF Toolkit</h4>
            <p class="leading-relaxed">
              Alat komprehensif untuk memanipulasi dokumen PDF Anda, termasuk menggabungkan,
              memisahkan halaman, kompresi cerdas, dan ekstraksi.
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <div
            class="shrink-0 w-8 h-8 rounded-[var(--radius-md)] bg-paper-2 border border-rule flex items-center justify-center text-lg">
            🖼️
          </div>
          <div>
            <h4 class="font-semibold text-ink text-base mb-1">Image & Docs Engine</h4>
            <p class="leading-relaxed">
              Konversi massal untuk semua format gambar modern (WebP, PNG, JPG) dan dokumen Office
              (DOCX, XLSX, PPTX) langsung dari tab browser Anda.
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="modalContent === 'formats'" class="space-y-4 text-sm text-ink-2">
        <p class="leading-relaxed">
          HenkaConvert mendukung operasi dua arah dan satu arah untuk standar format populer berikut
          ini:
        </p>

        <div class="grid grid-cols-2 gap-4 mt-6">
          <div class="p-4 bg-paper-2 rounded-[var(--radius-md)] border border-rule">
            <h4 class="font-semibold text-ink mb-3 flex items-center gap-2">
              <span>🎵</span> Media & Audio
            </h4>
            <ul class="space-y-2 text-ink-3">
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-accent-3"></span> MP4, WEBM, AVI, MOV, MKV
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-accent-3"></span> MP3, WAV, AAC, M4A, FLAC
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-accent-3"></span> OGG, WMA, OPUS, AIFF
              </li>
            </ul>
          </div>

          <div class="p-4 bg-paper-2 rounded-[var(--radius-md)] border border-rule">
            <h4 class="font-semibold text-ink mb-3 flex items-center gap-2">
              <span>🖼️</span> Images
            </h4>
            <ul class="space-y-2 text-ink-3">
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-accent-3"></span> JPG, PNG, WEBP, GIF
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-accent-3"></span> BMP, TIFF, ICO
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-accent-3"></span> SVG, HEIC, EPS
              </li>
            </ul>
          </div>

          <div class="col-span-2 p-4 bg-paper-2 rounded-[var(--radius-md)] border border-rule">
            <h4 class="font-semibold text-ink mb-3 flex items-center gap-2">
              <span>📄</span> Documents & Data
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <ul class="space-y-2 text-ink-3">
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-accent-3"></span> PDF ↔ Merge/Split
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-accent-3"></span> DOCX, DOC, RTF → PDF
                </li>
              </ul>
              <ul class="space-y-2 text-ink-3">
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-accent-3"></span> XLSX, CSV, JSON
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1 h-1 rounded-full bg-accent-3"></span> PPTX, PPT, ODP → PDF
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GenericModal>
  </div>
</template>

<style scoped>
.marquee-scroll {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-ink-3);
  opacity: 0.5;
  animation: ft8-scroll 30s linear infinite;
}

@keyframes ft8-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-scroll {
    animation: none;
  }
}
</style>
