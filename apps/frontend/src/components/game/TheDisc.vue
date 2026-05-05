<template>
  <div class="relative mx-auto flex w-full max-w-md flex-col items-center mt-12">
    <div class="relative h-56 w-56 max-sm:h-44 max-sm:w-44">
      <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/30 blur-sm" />
      <div
        class="vinyl-rings relative h-full w-full overflow-hidden rounded-full border-4 border-white/15 bg-[#0c0f1f] shadow-[0_0_50px_rgba(124,58,237,0.38)]"
        :class="playing ? 'animate-spinSlow' : ''"
      >
        <img :src="coverUrl" alt="cover" class="h-full w-full object-cover" :class="blurred ? 'scale-110 blur-md' : ''" />
        <div class="absolute inset-0 bg-[radial-gradient(circle,transparent_18%,rgba(0,0,0,0.26)_19%,transparent_20%,transparent_34%,rgba(255,255,255,0.06)_35%,transparent_36%)]" />
        <div class="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-[#121321] shadow-[0_0_12px_rgba(255,255,255,0.15)]" />
      </div>
      <div class="absolute right-0 top-0 translate-x-2 -translate-y-2 rounded-full bg-[#13192a] p-1 shadow-card">
        <CountdownTimer :seconds="seconds" :total="20" />
      </div>
    </div>

    <div class="mt-2 text-center">
      <div class="text-2xl font-bold max-sm:text-lg" :class="blurred ? 'select-none blur-sm opacity-70' : ''">{{ title }}</div>
      <div class="mt-1 text-base text-game-muted max-sm:text-sm" :class="blurred ? 'select-none blur-sm opacity-70' : ''">{{ artist }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CountdownTimer from './CountdownTimer.vue'

defineProps<{
  coverUrl: string
  title: string
  artist: string
  seconds: number
  blurred?: boolean
  playing?: boolean
}>()
</script>
