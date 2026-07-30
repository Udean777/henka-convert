<script setup lang="ts"></script>

<template>
  <div class="min-h-dvh bg-paper text-ink font-[family-name:var(--font-body)]">
    <header
      class="sticky top-0 z-50 bg-paper/85 backdrop-blur-sm border-b border-rule flex items-center justify-between px-[var(--page-gutter)] py-4">
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-[var(--radius-lg)] bg-accent flex items-center justify-center shadow-[0_2px_0_0_var(--color-accent-deep)]">
          <svg class="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
        </div>
        <h1 class="text-xl font-bold tracking-tight" style="font-family: var(--font-display)">
          Henka<span class="font-normal text-ink-2">Convert</span>
        </h1>
      </div>
      <div class="flex items-center gap-4">
        <span class="tag">100% Local</span>
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

    <footer class="border-t border-rule overflow-hidden py-4">
      <div class="flex whitespace-nowrap" style="animation: ft8-scroll 32s linear infinite">
        <span class="inline-flex items-center gap-2 px-4 text-sm text-ink-3 font-mono">
          HENKA CONVERT <span class="text-accent-3">·</span> CONVERT ANYTHING
          <span class="text-accent-3">·</span> 100% LOCAL
          <span class="text-accent-3">·</span> PRIVATE BY DESIGN
          <span class="text-accent-3">·</span> HENKA CONVERT
          <span class="text-accent-3">·</span> CONVERT ANYTHING
          <span class="text-accent-3">·</span> 100% LOCAL <span class="text-accent-3">·</span>
          PRIVATE BY DESIGN
        </span>
      </div>

    </footer>
  </div>
</template>

<style scoped>
@keyframes ft8-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  [style*='ft8-scroll'] {
    animation: none;
  }
}
</style>
