<template>
  <button
    v-if="canInstall"
    class="fixed bottom-24 right-4 z-40 rounded-full bg-button-violet px-4 py-3 text-sm font-semibold shadow-glow"
    @click="install"
  >
    Instal·la l'app
  </button>
</template>

<script setup lang="ts">
import { usePWA } from '../../composables/usePWA'
const { canInstall, install } = usePWA()
</script>
