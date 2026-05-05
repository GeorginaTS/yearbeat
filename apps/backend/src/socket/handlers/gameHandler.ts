import type { Server, Socket } from 'socket.io'
import type { ClientToServerEvents, ServerToClientEvents } from '@yearbeat/shared-types'
import { gameService } from '../../services/gameService'

const timers = new Map<string, NodeJS.Timeout>()

async function emitReveal(io: Server, gameId: string, roomCode: string) {
  const reveal = await gameService.buildReveal(gameId)
  io.to(roomCode).emit('game:showAnswers', reveal)
}

async function startRound(io: Server, gameId: string, roomCode: string, songNumber: number) {
  const song = await gameService.getActiveSong(gameId, songNumber)
  io.to(roomCode).emit(songNumber === 1 ? 'game:started' : 'game:songPlaying', {
    [songNumber === 1 ? 'firstSong' : 'song']: song,
    songNumber,
  } as never)

  let secondsLeft = 20
  io.to(roomCode).emit('game:timerUpdate', { secondsLeft })

  const timer = setInterval(async () => {
    secondsLeft -= 1
    io.to(roomCode).emit('game:timerUpdate', { secondsLeft })

    if (secondsLeft <= 0) {
      clearInterval(timer)
      timers.delete(gameId)
      await emitReveal(io, gameId, roomCode)
    }
  }, 1000)

  timers.set(gameId, timer)
}

export function registerGameHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) {
  socket.on('game:join', async ({ code, playerName }: { code: string; playerName: string }) => {
    try {
      const { game, player } = await gameService.joinGame(code, playerName, socket.id)
      socket.join(game.code)
      socket.data.playerId = player.id
      socket.data.gameId = game.id
      socket.data.roomCode = game.code
      io.to(game.code).emit('game:playerJoined', { players: game.players })
    } catch (error) {
      socket.emit('game:error', { message: error instanceof Error ? error.message : 'Join error' })
    }
  })

  socket.on('game:start', async ({ gameId }: { gameId: string }) => {
    try {
      const game = await gameService.getGameById(gameId)
      await gameService.startGame(gameId)
      await startRound(io, gameId, game.code, 1)
    } catch (error) {
      socket.emit('game:error', { message: error instanceof Error ? error.message : 'Start error' })
    }
  })

  socket.on('game:submitAnswer', async ({ gameSongId, yearGuess }: { gameSongId: string; yearGuess: number }) => {
    try {
      const playerId = socket.data.playerId as string
      const gameId = socket.data.gameId as string
      const roomCode = socket.data.roomCode as string

      await gameService.submitAnswer(gameSongId, playerId, yearGuess)
      io.to(roomCode).emit('game:answerReceived', { playerId, answered: true })

      const allAnswered = await gameService.allAnswered(gameId)
      if (allAnswered) {
        const timer = timers.get(gameId)
        if (timer) {
          clearInterval(timer)
          timers.delete(gameId)
        }
        await emitReveal(io, gameId, roomCode)
      }
    } catch (error) {
      socket.emit('game:error', { message: error instanceof Error ? error.message : 'Answer error' })
    }
  })

  socket.on('game:nextSong', async ({ gameId }: { gameId: string }) => {
    try {
      const game = await gameService.getGameById(gameId)
      const nextSong = await gameService.nextSong(gameId)

      if (!nextSong) {
        const finalScores = await gameService.getFinalScores(gameId)
        io.to(game.code).emit('game:finished', { finalScores })
        return
      }

      await startRound(io, gameId, game.code, game.currentSong + 1)
    } catch (error) {
      socket.emit('game:error', { message: error instanceof Error ? error.message : 'Next song error' })
    }
  })

  socket.on('game:reaction', async ({ emoji }: { emoji: string }) => {
    const playerId = socket.data.playerId as string
    const roomCode = socket.data.roomCode as string
    io.to(roomCode).emit('game:reaction', { playerId, emoji })
  })
}
