<template>
  <section class="relative mx-auto min-h-screen max-w-2xl px-5 py-8">
    <button class="absolute right-5 top-8 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base text-game-muted transition hover:bg-white/20" @click="showInstructions = true">❓</button>

    <div>
      <div class="text-sm uppercase tracking-[0.24em] text-game-muted">Sala</div>
      <div class="mt-3 flex items-center gap-3">
        <div class="rounded-full bg-button-violet px-6 py-3 font-mono text-4xl font-black shadow-glow max-sm:text-3xl">
          {{ game?.code }}
        </div>
        <button class="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-game-muted transition hover:bg-white/20" @click="copyCode">Copiar</button>
      </div>
    </div>

    <InstructionsModal v-model="showInstructions" />

    <div class="mt-8 flex items-center justify-between">
      <div class="text-2xl font-bold">Jugadors</div>
      <div class="text-game-muted">{{ players.length }} / 6</div>
    </div>

    <div class="mt-5">
      <PlayerList :players="players" />
    </div>

    <div class="mt-8">
      <button v-if="isHost" class="primary-pill" :disabled="players.length < 2" @click="startGame">Iniciar partida</button>
      <div v-else class="text-center text-lg text-game-muted">Esperant l'host...</div>
    </div>

    <!-- Instructions nudge -->
    <button
      class="mt-6 flex w-full items-center gap-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-left transition hover:bg-violet-500/20 animate-pulse-slow"
      @click="showInstructions = true"
    >
      <span class="text-2xl">💡</span>
      <div>
        <div class="text-sm font-bold text-white">Mentre esperes...</div>
        <div class="text-xs text-white/60">Revisa les instruccions i el sistema de puntuació per estar preparat!</div>
      </div>
      <span class="ml-auto text-game-muted">→</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PlayerList from '../components/lobby/PlayerList.vue'
import InstructionsModal from '../components/game/InstructionsModal.vue'
import { useGameStore } from '../stores/gameStore'
import { useSocket } from '../composables/useSocket'

const gameStore = useGameStore()
const socketStore = useSocket()

const game = computed(() => gameStore.currentGame)
const players = computed(() => gameStore.players)
const isHost = computed(() => gameStore.isHost)
const showInstructions = ref(false)

function startGame() {
  if (!game.value) return
  socketStore.emit('game:start', { gameId: game.value.id })
}

function copyCode() {
  navigator.clipboard.writeText(game.value?.code || '')
}
</script>
