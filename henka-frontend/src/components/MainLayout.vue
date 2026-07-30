<script setup lang="ts">
// MainLayout.vue - Kerangka utama aplikasi yang bersih dan profesional
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
    <!-- Header Aplikasi -->
    <header class="p-6 flex items-center justify-between border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-slate-100">
          Henka<span class="font-normal text-slate-400">Convert</span>
        </h1>
      </div>
      <div
        class="text-xs font-medium px-3 py-1.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
      >
        100% Local (Tier A)
      </div>
    </header>

    <!-- Konten Utama -->
    <main class="flex flex-col items-center justify-center min-h-[calc(100vh-85px)] p-6">
      <div class="w-full max-w-2xl flex flex-col items-center gap-8">
        <div class="text-center space-y-3 mb-2">
          <h2 class="text-4xl font-bold text-slate-100">Convert Anything, Locally.</h2>
          <p class="text-slate-400 text-base max-w-lg mx-auto">
            Your files never leave your device. Fast, secure, and private conversion powered by
            WebAssembly.
          </p>
        </div>

        <slot></slot>
      </div>
    </main>
  </div>
</template>
