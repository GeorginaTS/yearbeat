<template>
  <div class="space-y-3">
    <div v-for="score in scores" :key="score.playerId" class="game-card flex items-center justify-between px-4 py-4">
      <div class="flex items-center gap-4">
        <div class="w-6 text-xl font-bold text-game-warning">{{ score.position }}</div>
        <div class="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white" :style="{ backgroundColor: score.avatarColor }">
          {{ score.playerName.slice(0, 1).toUpperCase() }}
        </div>
        <div>
          <div class="font-semibold">{{ score.playerName }}</div>
          <div class="text-xs text-game-muted">{{ score.badge }}</div>
        </div>
      </div>
      <div class="font-black">{{ score.totalScore.toLocaleString() }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerScore } from '@yearbeat/shared-types'

defineProps<{ scores: PlayerScore[] }>()
</script>
