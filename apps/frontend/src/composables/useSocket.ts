import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'
import { useSocketStore } from '../stores/socketStore'

export function useSocket() {
  const socketStore = useSocketStore()
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const router = useRouter()
  const socket = socketStore.connect()

  socket.off('game:playerJoined')
  socket.off('game:started')
  socket.off('game:songPlaying')
  socket.off('game:timerUpdate')
  socket.off('game:answerReceived')
  socket.off('game:showAnswers')
  socket.off('game:finished')
  socket.off('game:reaction')
  socket.off('game:error')

  socket.on('game:playerJoined', ({ players }) => {
    gameStore.updatePlayers(players)
  })

  socket.on('game:started', ({ firstSong, songNumber }) => {
    gameStore.startSong(firstSong, songNumber)
    router.push(`/game/${gameStore.currentGame?.code}`)
  })

  socket.on('game:songPlaying', ({ song, songNumber }) => {
    gameStore.startSong(song, songNumber)
  })

  socket.on('game:timerUpdate', ({ secondsLeft }) => {
    gameStore.updateTimer(secondsLeft)
  })

  socket.on('game:answerReceived', ({ playerId }) => {
    gameStore.markAnswered(playerId)
  })

  socket.on('game:reaction', ({ emoji }) => {
    gameStore.setReaction(emoji)
  })

  socket.on('game:showAnswers', ({ answers, correctYear }) => {
    gameStore.showReveal(answers, correctYear)
    const me = answers.find((entry) => entry.playerId === playerStore.myId)
    if (me) playerStore.updateScore(playerStore.myScore + me.score)
  })

  socket.on('game:finished', ({ finalScores }) => {
    gameStore.finishGame(finalScores)
    router.push(`/results/${gameStore.currentGame?.code}`)
  })

  socket.on('game:error', ({ message }) => {
    window.alert(message)
  })

  return socketStore
}
