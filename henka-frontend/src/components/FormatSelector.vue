<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Format } from '../core/types'
import {
  ChevronDown,
  Search,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Database,
} from '@lucide/vue'

const props = defineProps<{
  modelValue?: Format | null
  options: Format[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Format): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const selectedTab = ref<string>('All')
const containerRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const placement = ref<'bottom' | 'top'>('bottom')

const categories = ['All', 'Image', 'Document', 'Audio', 'Video', 'Data']

const categoryIcons: Record<string, any> = {
  Image: ImageIcon,
  Document: FileText,
  Audio: Music,
  Video: Video,
  Data: Database,
}

const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || FileText
}

const filteredOptions = computed(() => {
  return props.options.filter((fmt) => {
    const matchesTab = selectedTab.value === 'All' || fmt.category === selectedTab.value
    const query = searchQuery.value.trim().toLowerCase()
    const matchesQuery =
      query === '' ||
      fmt.extension.toLowerCase().includes(query) ||
      fmt.label.toLowerCase().includes(query)
    return matchesTab && matchesQuery
  })
})

const groupedFilteredOptions = computed(() => {
  const groups: Record<string, Format[]> = {}
  for (const fmt of filteredOptions.value) {
    const cat = fmt.category || 'Other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(fmt)
  }
  return groups
})

const updatePlacement = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const estimatedDropdownHeight = 380
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top

  // Jika ruang di bawah kurang dari tinggi dropdown DAN ruang di atas lebih luas dari di bawah
  if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
    placement.value = 'top'
  } else {
    placement.value = 'bottom'
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    updatePlacement()
    nextTick(() => {
      updatePlacement()
    })
  }
}

const selectFormat = (fmt: Format) => {
  emit('update:modelValue', fmt)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

const handleScrollOrResize = () => {
  if (isOpen.value) {
    updatePlacement()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleScrollOrResize, true)
  window.addEventListener('resize', handleScrollOrResize)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>

<template>
  <div ref="containerRef" class="relative inline-block text-left select-none">
    <!-- Trigger Button -->
    <button
      type="button"
      @click.stop="toggleDropdown"
      class="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-[var(--radius-lg)] border border-rule bg-paper hover:bg-paper-2 text-ink text-sm font-medium transition-all duration-200 focus:outline-none focus:border-accent-2 shadow-xs cursor-pointer min-w-[130px]"
    >
      <div class="flex items-center gap-1.5 truncate">
        <component
          :is="getCategoryIcon(modelValue?.category || '')"
          class="w-3.5 h-3.5 text-accent-2 shrink-0"
        />
        <span class="font-mono font-semibold tracking-wide uppercase text-xs">
          {{ modelValue ? modelValue.extension : 'Select' }}
        </span>
      </div>
      <ChevronDown
        class="w-4 h-4 text-ink-3 transition-transform duration-200 shrink-0"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Modal Popup -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      :enter-from-class="
        placement === 'top'
          ? 'transform scale-95 opacity-0 translate-y-1'
          : 'transform scale-95 opacity-0 -translate-y-1'
      "
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      :leave-to-class="
        placement === 'top'
          ? 'transform scale-95 opacity-0 translate-y-1'
          : 'transform scale-95 opacity-0 -translate-y-1'
      "
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :class="[
          'absolute right-0 sm:right-auto sm:left-0 w-72 sm:w-80 rounded-[var(--radius-card)] bg-paper border border-rule shadow-2xl z-[500] overflow-hidden flex flex-col max-h-[380px]',
          placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
        ]"
      >
        <!-- Header Search Bar -->
        <div class="p-2.5 border-b border-rule bg-paper-2 flex flex-col gap-2">
          <div class="relative flex items-center">
            <Search class="w-4 h-4 text-ink-3 absolute left-3 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search format (e.g. mp4, pdf)..."
              class="w-full pl-9 pr-3 py-1.5 text-xs text-ink bg-paper border border-rule rounded-[var(--radius-md)] outline-none focus:border-accent-2 transition-colors placeholder:text-ink-3/50"
              @click.stop
            />
          </div>

          <!-- Filter Category Tabs -->
          <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              @click.stop="selectedTab = cat"
              :class="[
                'px-2 py-1 text-[11px] font-medium rounded-[var(--radius-pill)] transition-all shrink-0 cursor-pointer',
                selectedTab === cat
                  ? 'bg-accent-2 text-white font-semibold shadow-xs'
                  : 'text-ink-3 hover:text-ink hover:bg-paper-3',
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Format Options List -->
        <div class="flex-1 overflow-y-auto p-2 space-y-3">
          <template v-if="Object.keys(groupedFilteredOptions).length > 0">
            <div
              v-for="(formats, category) in groupedFilteredOptions"
              :key="category"
              class="space-y-1"
            >
              <div
                class="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-3 flex items-center gap-1.5"
              >
                <component :is="getCategoryIcon(category)" class="w-3 h-3 text-accent-2" />
                {{ category }}
              </div>

              <div class="grid grid-cols-2 gap-1">
                <button
                  v-for="fmt in formats"
                  :key="fmt.extension"
                  type="button"
                  @click.stop="selectFormat(fmt)"
                  :class="[
                    'flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs text-left transition-all cursor-pointer border',
                    modelValue?.extension === fmt.extension
                      ? 'bg-accent-2/15 text-accent-2 border-accent-2/40 font-semibold'
                      : 'border-transparent text-ink hover:bg-paper-2 hover:border-rule',
                  ]"
                >
                  <span class="font-mono font-bold uppercase">{{ fmt.extension }}</span>
                  <span
                    class="text-[10px] text-ink-3 truncate ml-1 max-w-[80px]"
                    :title="fmt.label"
                  >
                    {{ fmt.label.split(' ')[0] }}
                  </span>
                </button>
              </div>
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="py-8 text-center text-xs text-ink-3">
            No formats found for "{{ searchQuery }}"
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Hide scrollbar for category tabs */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
