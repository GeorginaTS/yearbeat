import { defineStore } from 'pinia'
import type {
  ActiveSong,
  GamePhase,
  GameRoom,
  Player,
  PlayerScore,
  RoundAnswer,
} from '@yearbeat/shared-types'
import { usePlayerStore } from './playerStore'

export const useGameStore = defineStore('game', {
  state: () => ({
    currentGame: null as GameRoom | null,
    players: [] as Player[],
    currentSong: null as ActiveSong | null,
    songNumber: 0,
    phase: 'lobby' as GamePhase,
    timeLeft: 20,
    roundAnswers: [] as RoundAnswer[],
    correctYear: 0,
    myAnswer: null as number | null,
    finalScores: [] as PlayerScore[],
    lastReaction: '' as string,
  }),
  getters: {
    isHost: (state) => {
      const player = usePlayerStore()
      return state.players.some((entry) => entry.id === player.myId && entry.isHost)
    },
    hasAnswered: (state) => state.myAnswer !== null,
    progress: (state) => (state.currentGame ? Math.round((state.songNumber / state.currentGame.totalSongs) * 100) : 0),
    totalSongs: (state) => state.currentGame?.totalSongs ?? 25,
  },
  actions: {
    setGame(game: GameRoom) {
      this.currentGame = game
      this.players = game.players
      this.phase = game.status === 'LOBBY' ? 'lobby' : 'listening'
    },
    updatePlayers(players: Player[]) {
      this.players = players
      if (this.currentGame) this.currentGame.players = players
    },
    startSong(song: ActiveSong, songNumber: number) {
      this.currentSong = song
      this.songNumber = songNumber
      this.phase = 'listening'
      this.timeLeft = 20
      this.roundAnswers = []
      this.correctYear = 0
      this.myAnswer = null
      this.lastReaction = ''
      this.players = this.players.map((player) => ({ ...player, answered: false }))
    },
    submitAnswer(year: number) {
      this.myAnswer = year
    },
    showReveal(answers: RoundAnswer[], correctYear: number) {
      this.phase = 'reveal'
      this.roundAnswers = answers
      this.correctYear = correctYear
      this.players = this.players.map((player) => {
        const answer = answers.find((entry) => entry.playerId === player.id)
        return {
          ...player,
          totalScore: player.totalScore + (answer?.score ?? 0),
        }
      })
    },
    updateTimer(seconds: number) {
      this.timeLeft = seconds
    },
    markAnswered(playerId: string) {
      this.players = this.players.map((player) =>
        player.id === playerId ? { ...player, answered: true } : player,
      )
    },
    setReaction(emoji: string) {
      this.lastReaction = emoji
    },
    finishGame(finalScores: PlayerScore[]) {
      this.phase = 'finished'
      this.finalScores = finalScores
    },
    reset() {
      this.$reset()
    },
  },
})
