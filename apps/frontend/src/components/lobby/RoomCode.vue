<template>
  <div class="flex justify-center gap-4">
    <input
      v-for="(_, index) in chars"
      :key="index"
      :ref="(el) => setRef(el as HTMLInputElement | null, index)"
      :value="chars[index]"
      maxlength="1"
      class="h-24 w-24 rounded-[26px] border-2 border-game-accent/45 bg-[#17162a] text-center font-mono text-5xl font-black uppercase text-white outline-none transition focus:border-game-accent focus:shadow-glow max-sm:h-20 max-sm:w-20 max-sm:text-4xl"
      @input="onInput(index, $event)"
      @keydown.backspace.prevent="onBackspace(index)"
      @paste.prevent="onPaste"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
const inputs = ref<HTMLInputElement[]>([])
const chars = ref(['', '', '', ''])

watch(
  () => props.modelValue,
  (value) => {
    chars.value = value
      .padEnd(4, ' ')
      .slice(0, 4)
      .split('')
      .map((char) => (char === ' ' ? '' : char))
  },
  { immediate: true },
)

function setRef(el: HTMLInputElement | null, index: number) {
  if (el) inputs.value[index] = el
}

function update() {
  emit('update:modelValue', chars.value.join('').toUpperCase())
}

function onInput(index: number, event: Event) {
  const value = (event.target as HTMLInputElement).value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  chars.value[index] = value
  update()
  if (value && index < 3) inputs.value[index + 1]?.focus()
}

function onBackspace(index: number) {
  if (chars.value[index]) {
    chars.value[index] = ''
    update()
    return
  }
  if (index > 0) {
    inputs.value[index - 1]?.focus()
    chars.value[index - 1] = ''
    update()
  }
}

function onPaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text')?.toUpperCase().replace(/[^A-Z0-9]/g, '') || ''
  text.slice(0, 4)
    .split('')
    .forEach((char, index) => {
      chars.value[index] = char
    })
  update()
}
</script>
