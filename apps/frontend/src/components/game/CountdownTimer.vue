<template>
  <div :class="['relative h-20 w-20', seconds < 5 ? 'animate-pulseSoft' : '']">
    <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90 drop-shadow-[0_0_15px_rgba(239,68,68,0.35)]">
      <circle cx="60" cy="60" r="50" class="fill-none stroke-white/10" stroke-width="10" />
      <circle
        cx="60"
        cy="60"
        r="50"
        class="fill-none transition-all duration-500"
        :class="ringClass"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="314"
        :stroke-dashoffset="314 - (seconds / total) * 314"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center text-2xl font-black italic text-[#ff3b6c]">
      {{ String(seconds).padStart(2, '0') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ seconds: number; total: number }>()
const ringClass = computed(() =>
  props.seconds > 10 ? 'stroke-game-success' : props.seconds > 5 ? 'stroke-game-warning' : 'stroke-game-danger',
)
</script>
