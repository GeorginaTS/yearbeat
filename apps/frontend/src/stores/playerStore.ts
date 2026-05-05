import { defineStore } from 'pinia'

export const usePlayerStore = defineStore(
  'player',
  {
    state: () => ({
      myId: '',
      myName: '',
      myScore: 0,
    }),
    actions: {
      setPlayer(payload: { id: string; name: string; totalScore?: number }) {
        this.myId = payload.id
        this.myName = payload.name
        this.myScore = payload.totalScore ?? 0
      },
      updateScore(score: number) {
        this.myScore = score
      },
      reset() {
        this.$reset()
      },
    },
    persist: true,
  },
)
