<template>
  <div
    class="rounded-[18px] border px-4 py-4 shadow-card"
    :class="toneClass"
  >
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white">
          {{ answer.playerName.slice(0, 1).toUpperCase() }}
        </div>
        <div>
          <div class="font-bold">{{ answer.playerName }}</div>
          <div class="text-sm text-white/80">
            Vot: {{ answer.yearGuess }}
            <span v-if="answer.diff === 0">(Exacte!)</span>
            <span v-else>({{ answer.diff }} anys)</span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-black">+{{ answer.score }}</div>
        <div v-if="answer.streak" class="text-[10px] font-bold uppercase tracking-[0.18em]">{{ answer.streak }} en ratxa</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RoundAnswer } from '@yearbeat/shared-types'

const props = defineProps<{ answer: RoundAnswer }>()
const toneClass = computed(() => {
  if (props.answer.score >= 800) return 'border-game-success bg-game-success/12 text-white'
  if (props.answer.score >= 400) return 'border-game-warning bg-game-warning/12 text-white'
  return 'border-game-danger/60 bg-game-danger/10 text-white'
})
</script>
