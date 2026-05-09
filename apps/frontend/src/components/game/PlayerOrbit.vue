<template>
  <div class="flex flex-wrap justify-center gap-3">
    <div
      v-for="player in players"
      :key="player.id"
      class="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 shadow-card"
      :style="{ backgroundColor: player.avatarColor || '#22d3ee' }"
    >
      <span class="text-sm font-black text-white">{{ player.name.slice(0, 1).toUpperCase() }}</span>
      <span
        class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
        :class="player.answered ? 'bg-game-success text-white' : 'bg-slate-600 text-slate-200'"
      >
        {{ player.answered ? '✓' : '•' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@yearbeat/shared-types'

defineProps<{ players: Player[] }>()
</script>
