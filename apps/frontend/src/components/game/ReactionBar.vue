<template>
  <div class="grid grid-cols-4 gap-3">
    <button
      v-for="emoji in emojis"
      :key="emoji"
      class="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-2xl shadow-card transition hover:-translate-y-1 hover:border-game-accent/70 hover:bg-game-accent/10"
      @click="$emit('react', emoji)"
    >
      {{ emoji }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ react: [string] }>()
const emojis = ['😄', '😱', '🔥', '🤯']
</script>
