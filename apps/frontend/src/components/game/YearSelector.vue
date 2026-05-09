<template>
  <section class="space-y-3">
    <div v-motion :initial="{ scale: 0.8, opacity: 0.8 }" :enter="{ scale: 1.05, opacity: 1 }" class="text-center">
      <div class="text-[68px] font-black leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] max-sm:text-[56px]">{{ year }}</div>
    </div>

    <div class="px-1">
      <input
        type="range"
        min="1960"
        max="2024"
        :disabled="disabled"
        :value="year"
        class="w-full accent-cyan-400"
        @input="updateYear"
      />
      <div class="mt-2 flex justify-between text-xs font-semibold uppercase tracking-[0.12em] text-game-muted">
        <span>1960</span>
        <span>2024</span>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4">
      <button
        v-for="option in decades"
        :key="option.label"
        class="rounded-2xl px-4 py-2 text-sm font-semibold"
        :class="year >= option.start && year <= option.end ? 'bg-button-violet text-white shadow-glow' : 'bg-white/5 text-game-muted'"
        @click="setDecade(option.start)"
      >
        {{ option.label }}
      </button>
      <button class="rounded-2xl bg-white/5 px-4 py-2 text-sm text-game-muted" @click="reset">↺</button>
    </div>

    <button class="primary-pill !py-3 !mt-12" :disabled="disabled" @click="$emit('confirm')">Confirmar →</button>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: number; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [number]; confirm: [] }>()

const year = computed(() => props.modelValue)
const decades = [
  { label: '60s', start: 1960, end: 1969 },
  { label: '70s', start: 1970, end: 1979 },
  { label: '80s', start: 1980, end: 1989 },
  { label: '90s', start: 1990, end: 1999 },
  { label: '00s', start: 2000, end: 2009 },
  { label: '10s', start: 2010, end: 2019 },
  { label: '20s', start: 2020, end: 2024 },
]

function updateYear(event: Event) {
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
}

function setDecade(value: number) {
  navigator.vibrate?.(20)
  emit('update:modelValue', value)
}

function reset() {
  emit('update:modelValue', 1994)
}
</script>
