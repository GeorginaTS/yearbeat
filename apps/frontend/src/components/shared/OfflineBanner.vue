<template>
  <div v-if="!online" class="bg-game-danger/90 px-4 py-2 text-center text-sm font-semibold">
    Mode fora de línia
  </div>
</template>

<script setup lang="ts">
import { useOnline } from '@vueuse/core'
const online = useOnline()
</script>
