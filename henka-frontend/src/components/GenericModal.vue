<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useI18nStore, translations } from '../stores/i18n'

const props = defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const i18nStore = useI18nStore()
const t = computed(() => translations[i18nStore.currentLang])

// Close on escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
          @click="emit('close')"
        ></div>

        <!-- Modal Panel -->
        <div
          class="relative w-full max-w-lg bg-paper rounded-[var(--radius-xl)] shadow-2xl border border-rule overflow-hidden flex flex-col max-h-[85vh]"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-rule">
            <h3 class="text-lg font-semibold text-ink" style="font-family: var(--font-display)">
              {{ title }}
            </h3>
            <button
              @click="emit('close')"
              class="p-2 -mr-2 text-ink-3 hover:text-ink transition-colors rounded-full hover:bg-paper-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 overflow-y-auto">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-rule bg-paper-2 flex justify-end">
            <button
              @click="emit('close')"
              class="px-4 py-2 text-sm font-medium text-ink bg-paper border border-rule rounded-[var(--radius-md)] hover:bg-paper-2 transition-colors cursor-pointer"
            >
              {{ t.close }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
