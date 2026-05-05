<template>
  <div class="space-y-6">
    <div class="mx-auto w-fit rounded-[32px] bg-reveal-badge px-10 py-6 text-center text-game-bg shadow-reveal">
      <div class="text-sm font-bold uppercase tracking-[0.24em]">Any correcte</div>
      <div class="text-6xl font-black max-sm:text-5xl">{{ correctYear }}</div>
    </div>

    <TransitionGroup name="score-row" tag="div" class="space-y-3">
      <ScoreCard v-for="answer in enhancedAnswers" :key="answer.playerId" :answer="answer" />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RoundAnswer } from '@yearbeat/shared-types'
import ScoreCard from './ScoreCard.vue'

const props = defineProps<{ answers: RoundAnswer[]; correctYear: number }>()
const enhancedAnswers = computed(() =>
  props.answers.map((answer, index) => ({
    ...answer,
    streak: index === 0 && answer.score >= 800 ? 3 : undefined,
  })),
)
</script>
