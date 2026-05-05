<template>
  <div class="space-y-3">
    <div
      v-for="(player, index) in filledPlayers"
      :key="player.id"
      v-motion
      :initial="{ opacity: 0, y: 12 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: index * 70 } }"
      class="game-card flex items-center justify-between px-4 py-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-glow"
          :style="{ backgroundColor: player.avatarColor || '#7c3aed' }"
        >
          {{ player.name.slice(0, 1).toUpperCase() }}
        </div>
        <div>
          <div class="font-semibold">{{ player.name }}</div>
          <div v-if="index === 0" class="text-xs uppercase tracking-[0.2em] text-game-warning">HOST</div>
        </div>
      </div>
      <div class="text-game-muted">{{ player.totalScore }}</div>
    </div>

    <div
      v-for="slot in emptySlots"
      :key="slot"
      class="rounded-[24px] border border-dashed border-white/15 px-4 py-6 text-center text-game-muted"
    >
      Esperant jugador...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '@yearbeat/shared-types'

const props = defineProps<{ players: Player[] }>()
const filledPlayers = computed(() => props.players)
const emptySlots = computed(() => props.players.length < 6 ? [0] : [])
</script>
