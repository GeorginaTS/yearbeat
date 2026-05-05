import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

export function useTimer() {
  const game = useGameStore()
  const progress = computed(() => Math.max(0, (game.timeLeft / 20) * 100))
  return { progress }
}
