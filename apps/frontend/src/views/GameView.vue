<template>
  <section class="mx-auto flex h-dvh max-w-2xl flex-col px-5 py-3">
    <header class="flex flex-shrink-0 items-center justify-between"> 
      <div class="text-sm font-semibold uppercase tracking-[0.2em] text-white">
        Cançó {{ songNumber }}/{{ totalSongs }}
      </div>
      <button class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base text-game-muted transition hover:bg-white/20" @click="showInstructions = true">❓</button>
    </header>

    <InstructionsModal v-model="showInstructions" />

    <div class="my-3 h-2 flex-shrink-0 overflow-hidden rounded-full bg-white/10 mb-6">
      <div class="h-full rounded-full bg-button-violet" :style="{ width: `${progress}%` }" />
    </div>

    <template v-if="phase === 'listening' && currentSong">
      <div class="flex flex-1 flex-col justify-between">
        <div class="flex items-center justify-center">
          <TheDisc
            :cover-url="currentSong.coverUrl"
            :title="currentSong.title"
            :artist="currentSong.artist"
            :seconds="timeLeft"
            :blurred="true"
            :playing="playing"
          />
        </div>

        <div>
          <YearSelector v-model="selectedYear" :disabled="hasAnswered" @confirm="confirm" />
        </div>

        <div class="flex items-center justify-center">
          <PlayerOrbit :players="players" />
        </div>
      </div>
    </template>

    <template v-else-if="phase === 'reveal' && currentSong">
      <div class="mx-auto max-w-sm text-center">
        <img :src="currentSong.coverUrl" alt="cover" class="mx-auto h-48 w-48 rounded-[24px] object-cover shadow-card" />
        <div class="mt-4 text-3xl font-bold">{{ currentSong.title }}</div>
        <div class="mt-1 text-lg text-game-muted">{{ currentSong.artist }}</div>
      </div>

      <div class="mt-8">
        <RoundReveal :answers="roundAnswers" :correct-year="correctYear" />
      </div>

      <div class="mt-8">
        <button v-if="isHost" class="primary-pill" @click="nextSong">Següent cançó</button>
        <div v-else class="text-center text-game-muted">Esperant que l'host continuï la partida...</div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import TheDisc from '../components/game/TheDisc.vue'
import YearSelector from '../components/game/YearSelector.vue'
import RoundReveal from '../components/game/RoundReveal.vue'
import PlayerOrbit from '../components/game/PlayerOrbit.vue'
import InstructionsModal from '../components/game/InstructionsModal.vue'
import { useGameStore } from '../stores/gameStore'
import { useSocket } from '../composables/useSocket'
import { useAudio } from '../composables/useAudio'

const gameStore = useGameStore()
const socketStore = useSocket()
const selectedYear = ref(1994)
const showInstructions = ref(false)

const phase = computed(() => gameStore.phase)
const currentSong = computed(() => gameStore.currentSong)
const songNumber = computed(() => gameStore.songNumber)
const totalSongs = computed(() => gameStore.totalSongs)
const progress = computed(() => gameStore.progress)
const timeLeft = computed(() => gameStore.timeLeft)
const players = computed(() => gameStore.players)
const roundAnswers = computed(() => gameStore.roundAnswers)
const correctYear = computed(() => gameStore.correctYear)
const isHost = computed(() => gameStore.isHost)
const hasAnswered = computed(() => gameStore.hasAnswered)
const { playing } = useAudio(() => {
  return currentSong.value?.previewUrl || undefined
})

function confirm() {
  if (!currentSong.value) return
  gameStore.submitAnswer(selectedYear.value)
  socketStore.emit('game:submitAnswer', {
    gameSongId: currentSong.value.gameSongId,
    yearGuess: selectedYear.value,
  })
}

function nextSong() {
  if (!gameStore.currentGame) return
  socketStore.emit('game:nextSong', { gameId: gameStore.currentGame.id })
}
</script>
