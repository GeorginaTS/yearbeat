<template>
  <main class="game-shell text-game-text">
    <OfflineBanner />
    <RouterView />
    <InstallPWA v-if="!isInGame" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import OfflineBanner from './components/shared/OfflineBanner.vue'
import InstallPWA from './components/shared/InstallPWA.vue'

const route = useRoute()
const isInGame = computed(() => route.name === 'game')
</script>
