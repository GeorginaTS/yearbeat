import { PrismaClient } from '../generated/prisma'
import type {
  ActiveSong,
  CreateGameResponse,
  GameRoom,
  JoinGameResponse,
  PlayerScore,
  RoundAnswer,
} from '@yearbeat/shared-types'
import { deezerService } from './deezerService'
import { calculateScore } from './scoreService'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

async function withReconnect<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes("Can't reach database") || msg.includes('connection') || msg.includes('ECONNRESET') || msg.includes('cached plan must not change result type') || msg.includes('0A000')) {
      await prisma.$disconnect()
      await prisma.$connect()
      return await fn()
    }
    throw e
  }
}
const AVATAR_COLORS = ['#7c3aed', '#a855f7', '#f97316', '#10b981', '#38bdf8', '#ef4444', '#f59e0b', '#14b8a6']
const MAX_PLAYERS = 6
const SONGS_PER_GAME = 10
type MappedPlayer = {
  id: string
  name: string
  isHost: boolean
  totalScore: number
  socketId: string | null
}

type GameSongEntry = {
  id: string
  order: number
  song: {
    id: string
    deezerTrackId: number
    title: string
    artist: string
    year: number
    previewUrl: string
    coverUrl: string
  }
}

type RevealAnswer = {
  player: {
    id: string
    name: string
  }
  yearGuess: number
  diff: number
  score: number
}

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function mapGame(game: {
  id: string
  code: string
  status: string
  currentSong: number
  players: MappedPlayer[]
  gameSongs: Array<unknown>
}): GameRoom {
  return {
    id: game.id,
    code: game.code,
    status: game.status as GameRoom['status'],
    currentSong: game.currentSong,
    totalSongs: game.gameSongs.length,
    players: game.players.map((player, index) => ({
      ...player,
      answered: false,
      avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    })),
  }
}

export const gameService = {
  async createGame(playerName: string): Promise<CreateGameResponse> {
    return withReconnect(async () => {
    const songs = await deezerService.generateGameSongs(SONGS_PER_GAME)

    const game = await prisma.game.create({
      data: {
        code: randomCode(),
        config: { rounds: songs.length, secondsPerRound: 20 },
        players: {
          create: {
            name: playerName,
            isHost: true,
          },
        },
      },
      include: { players: true, gameSongs: true },
    })

    for (const [index, song] of songs.entries()) {
      const dbSong = await prisma.song.upsert({
        where: { deezerTrackId: BigInt(song.deezerTrackId!) },
        update: {
          title: song.title,
          artist: song.artist,
          year: song.year,
          previewUrl: song.previewUrl,
          coverUrl: song.coverUrl,
        },
        create: {
          deezerTrackId: BigInt(song.deezerTrackId!),
          title: song.title,
          artist: song.artist,
          year: song.year,
          previewUrl: song.previewUrl,
          coverUrl: song.coverUrl,
        },
      })

      await prisma.gameSong.create({
        data: {
          gameId: game.id,
          songId: dbSong.id,
          order: index + 1,
        },
      })
    }

    const fullGame = await this.getGameById(game.id)
    const player = fullGame.players[0]
    return { game: fullGame, player }
    })
  },

  async joinGame(code: string, playerName: string, socketId?: string): Promise<JoinGameResponse> {
    return withReconnect(async () => {
    const game = await prisma.game.findUnique({
      where: { code: code.toUpperCase() },
      include: { players: true, gameSongs: true },
    })

    if (!game) throw new Error('Sala no trobada')
    if (game.players.length >= MAX_PLAYERS) throw new Error('La sala està plena (màxim 6 jugadors)')

    const existing = game.players.find((player: MappedPlayer) => player.name.toLowerCase() === playerName.toLowerCase())
    const player = existing
      ? await prisma.player.update({
          where: { id: existing.id },
          data: { socketId: socketId ?? existing.socketId },
        })
      : await prisma.player.create({
          data: {
            name: playerName,
            gameId: game.id,
            socketId,
          },
        })

    const fullGame = await this.getGameById(game.id)
    const mapped = fullGame.players.find((entry: GameRoom['players'][number]) => entry.id === player.id)!
    return { game: fullGame, player: mapped }
    })
  },

  async getGameById(gameId: string) {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        players: true,
        gameSongs: { include: { song: true, answers: true }, orderBy: { order: 'asc' } },
      },
    })
    return mapGame(game)
  },

  async getGameByCode(code: string) {
    const game = await prisma.game.findUniqueOrThrow({
      where: { code: code.toUpperCase() },
      include: {
        players: true,
        gameSongs: { include: { song: true, answers: true }, orderBy: { order: 'asc' } },
      },
    })
    return mapGame(game)
  },

  async setPlayerSocket(playerId: string, socketId: string | null) {
    await prisma.player.update({ where: { id: playerId }, data: { socketId } })
  },

  async startGame(gameId: string) {
    await prisma.game.update({
      where: { id: gameId },
      data: { status: 'PLAYING', currentSong: 1 },
    })
    return this.getActiveSong(gameId, 1)
  },

  async getActiveSong(gameId: string, order?: number): Promise<ActiveSong> {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        gameSongs: {
          include: { song: true },
          orderBy: { order: 'asc' },
        },
      },
    })

    const currentOrder = order ?? game.currentSong
    const gameSong = game.gameSongs.find((entry: GameSongEntry) => entry.order === currentOrder)
    if (!gameSong) throw new Error('Cançó no trobada')

    // Comprova si el token de l'URL de Deezer CDN ha expirat
    let previewUrl = gameSong.song.previewUrl
    const expMatch = previewUrl.match(/[?&]hdnea=exp=(\d+)/)
    if (expMatch) {
      const expTs = parseInt(expMatch[1], 10)
      if (Date.now() / 1000 > expTs - 60) {
        // Token expirat o a punt d'expirar: re-fetch URL fresca de Deezer
        try {
          const fresh = await deezerService.fetchFreshPreviewUrl(Number(gameSong.song.deezerTrackId))
          if (fresh) {
            previewUrl = fresh
            await prisma.song.update({ where: { id: gameSong.song.id }, data: { previewUrl: fresh } })
          }
        } catch { /* si falla, usa l'URL original */ }
      }
    }

    return {
      gameSongId: gameSong.id,
      id: gameSong.song.id,
      deezerTrackId: Number(gameSong.song.deezerTrackId),
      title: gameSong.song.title,
      artist: gameSong.song.artist,
      year: gameSong.song.year,
      previewUrl,
      coverUrl: gameSong.song.coverUrl,
    }
  },

  async submitAnswer(gameSongId: string, playerId: string, yearGuess: number) {
    const gameSong = await prisma.gameSong.findUniqueOrThrow({
      where: { id: gameSongId },
      include: { song: true },
    })

    const diff = Math.abs(gameSong.song.year - yearGuess)
    const score = calculateScore(gameSong.song.year, yearGuess)

    await prisma.$transaction(async (tx) => {
      await tx.answer.upsert({
        where: { playerId_gameSongId: { playerId, gameSongId } },
        update: { yearGuess, diff, score },
        create: { playerId, gameSongId, yearGuess, diff, score },
      })

      const total = await tx.answer.aggregate({
        where: { playerId },
        _sum: { score: true },
      })

      await tx.player.update({
        where: { id: playerId },
        data: { totalScore: total._sum.score ?? 0 },
      })
    })

    return { diff, score, correctYear: gameSong.song.year }
  },

  async allAnswered(gameId: string) {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: { players: true },
    })

    const current = await prisma.gameSong.findFirstOrThrow({
      where: { gameId, order: game.currentSong },
      include: { answers: true },
    })

    return current.answers.length >= game.players.length
  },

  async buildReveal(gameId: string): Promise<{ answers: RoundAnswer[]; correctYear: number }> {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        gameSongs: {
          include: {
            song: true,
            answers: { include: { player: true } },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    const gameSong = game.gameSongs.find((entry: { order: number }) => entry.order === game.currentSong)
    if (!gameSong) throw new Error('Ronda no trobada')

    const answers = gameSong.answers
      .map((answer: RevealAnswer, index: number) => ({
        playerId: answer.player.id,
        playerName: answer.player.name,
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        yearGuess: answer.yearGuess,
        diff: answer.diff,
        score: answer.score,
      }))
      .sort((a: RoundAnswer, b: RoundAnswer) => b.score - a.score)

    return { answers, correctYear: gameSong.song.year }
  },

  async nextSong(gameId: string) {
    return withReconnect(async () => {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: { gameSongs: true },
    })

    const nextOrder = game.currentSong + 1
    if (nextOrder > game.gameSongs.length) {
      await prisma.game.update({
        where: { id: gameId },
        data: { status: 'FINISHED' },
      })
      return null
    }

    await prisma.game.update({
      where: { id: gameId },
      data: { currentSong: nextOrder },
    })

    return this.getActiveSong(gameId, nextOrder)
    })
  },

  async getFinalScores(gameId: string): Promise<PlayerScore[]> {
    return withReconnect(async () => {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: { players: true },
    })

    const titles = ['DJ DEL GRUP 🎧', 'LA NOSTÀLGICA', "L'ALEATURI"]
    return game.players
      .sort((a: MappedPlayer, b: MappedPlayer) => b.totalScore - a.totalScore)
      .map((player: MappedPlayer, index: number) => ({
        playerId: player.id,
        playerName: player.name,
        totalScore: player.totalScore,
        position: index + 1,
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        badge: titles[index],
      }))
    })
  },
}
