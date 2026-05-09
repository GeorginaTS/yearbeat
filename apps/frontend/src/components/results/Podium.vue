<template>
  <div class="grid grid-cols-3 items-end gap-4">
    <div
      v-for="entry in arranged"
      :key="entry.position"
      v-motion
      :initial="{ opacity: 0, y: 24, height: 0 }"
      :enter="{ opacity: 1, y: 0, height: entry.height }"
      class="rounded-t-[28px] text-center shadow-card"
      :class="entry.cardClass"
      :style="{ height: `${entry.height}px` }"
    >
      <div class="flex h-full flex-col items-center justify-center gap-2 px-3 pb-4 pt-3">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/50 bg-cover bg-center text-xl font-black text-white"
          :style="{ backgroundColor: entry.avatarColor }"
        >
          {{ entry.playerName.slice(0, 1).toUpperCase() }}
        </div>
        <div v-if="entry.position === 1" class="text-2xl">⭐</div>
        <div class="text-4xl font-black leading-none">{{ entry.position }}</div>
        <div class="font-bold uppercase">{{ entry.playerName }}</div>
        <div class="text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">{{ entry.badge }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlayerScore } from '@yearbeat/shared-types'

const props = defineProps<{ scores: PlayerScore[] }>()
const arranged = computed(() => {
  const top = props.scores.slice(0, 3)
  const display = [top[1], top[0], top[2]].filter(Boolean) as PlayerScore[]
  return display.map((entry) => ({
    ...entry,
    height: entry.position === 1 ? 228 : entry.position === 2 ? 170 : 150,
    cardClass:
      entry.position === 1
        ? 'bg-gradient-to-b from-pink-400 to-cyan-500 text-white'
        : entry.position === 2
          ? 'bg-[#41395f] text-white'
          : 'bg-[#5c3a2f] text-white',
  }))
})
</script>
