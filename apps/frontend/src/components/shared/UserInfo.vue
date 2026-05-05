<template>
  <div class="flex items-center gap-1.5 sm:gap-2">
    <div
      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-game-accent text-xs font-black text-white sm:h-8 sm:w-8 sm:text-sm"
    >
      {{ initial }}
    </div>
    <span class="hidden text-sm text-white/60 sm:inline">{{ name }}</span>
    <button
      class="rounded-md px-1.5 py-0.5 text-[10px] text-white/40 transition-colors hover:text-white/70 sm:px-2 sm:py-1 sm:text-xs"
      @click="emit('signOut')"
    >
      Sortir
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string }>()
const emit = defineEmits<{ signOut: [] }>()

const initial = computed(() => props.name.slice(0, 1).toUpperCase())
</script>
