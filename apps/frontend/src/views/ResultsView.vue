<template>
  <section class="mx-auto min-h-screen max-w-3xl px-5 py-8">
    <div class="text-center">
      <div class="text-sm uppercase tracking-[0.26em] text-fuchsia-400">♫ YearBeat</div>
      <div class="mt-4 text-5xl font-black drop-shadow-[0_0_18px_rgba(124,58,237,0.6)] max-sm:text-4xl">Partida acabada 🎉</div>
    </div>

    <div class="mt-10">
      <Podium :scores="scores" />
    </div>

    <div class="mt-8">
      <div class="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-game-muted">Classificació completa</div>
      <Leaderboard :scores="scores" />
    </div>

    <div class="mt-8 grid gap-4">
      <button class="primary-pill" @click="goHome">Jugar de nou</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Podium from '../components/results/Podium.vue'
import Leaderboard from '../components/results/Leaderboard.vue'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'

const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()
const scores = computed(() => gameStore.finalScores)

function goHome() {
  gameStore.reset()
  playerStore.reset()
  router.push('/')
}
</script>
