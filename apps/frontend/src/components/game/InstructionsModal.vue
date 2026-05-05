<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="w-full max-w-sm rounded-3xl bg-[#13192a] p-6 shadow-[0_0_60px_rgba(124,58,237,0.3)]">
        <div class="mb-4 flex items-center justify-between">
          <div class="text-lg font-black uppercase tracking-[0.15em] text-white">Com es juga</div>
          <button class="text-xl text-game-muted hover:text-white" @click="$emit('update:modelValue', false)">✕</button>
        </div>
        <ul class="space-y-3 text-sm text-white/80">
          <li class="flex gap-3"><span class="text-base">🎵</span><span>Escolta el fragment de cançó que sona automàticament.</span></li>
          <li class="flex gap-3"><span class="text-base">📅</span><span>Endevina l'any en què va sortir la cançó movent el selector.</span></li>
          <li class="flex gap-3"><span class="text-base">🔟</span><span>Fes servir els botons de dècada per moure't ràpidament.</span></li>
          <li class="flex gap-3"><span class="text-base">✅</span><span>Prem <strong class="text-white">Confirmar</strong> abans que s'acabi el temps.</span></li>
          </ul>

          <div class="mt-5 border-t border-white/10 pt-4">
            <div class="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-game-muted">Puntuació</div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span class="text-base">🎯</span>
                <div><div class="font-black text-white">1000 pts</div><div class="text-[11px] text-game-muted">Any exacte</div></div>
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span class="text-base">✨</span>
                <div><div class="font-black text-white">800 pts</div><div class="text-[11px] text-game-muted">±1 any</div></div>
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span class="text-base">👍</span>
                <div><div class="font-black text-white">600 pts</div><div class="text-[11px] text-game-muted">±3 anys</div></div>
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span class="text-base">🙂</span>
                <div><div class="font-black text-white">400 pts</div><div class="text-[11px] text-game-muted">±5 anys</div></div>
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span class="text-base">😅</span>
                <div><div class="font-black text-white">200 pts</div><div class="text-[11px] text-game-muted">±10 anys</div></div>
              </div>
              <div class="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span class="text-base">😬</span>
                <div><div class="font-black text-white">50 pts</div><div class="text-[11px] text-game-muted">±20 anys</div></div>
              </div>
            </div>
            <p class="mt-3 text-[11px] text-game-muted">Més de 20 anys de diferència: 0 punts.</p>
          </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [boolean] }>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
