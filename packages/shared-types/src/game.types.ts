export type GameStatus = 'LOBBY' | 'PLAYING' | 'FINISHED'
export type GamePhase = 'lobby' | 'listening' | 'reveal' | 'finished'

export interface Song {
  id: string
  deezerTrackId?: number
  title: string
  artist: string
  year: number
  previewUrl: string
  coverUrl: string
}

export interface ActiveSong extends Song {
  gameSongId: string
}

export interface Player {
  id: string
  name: string
  isHost: boolean
  totalScore: number
  socketId?: string | null
  answered?: boolean
  avatarColor?: string
}

export interface RoundAnswer {
  playerId: string
  playerName: string
  avatarColor?: string
  yearGuess: number
  diff: number
  score: number
  streak?: number
}

export interface PlayerScore {
  playerId: string
  playerName: string
  avatarColor?: string
  totalScore: number
  position: number
  badge?: string
}

export interface GameRoom {
  id: string
  code: string
  status: GameStatus
  currentSong: number
  totalSongs: number
  players: Player[]
}

export interface CreateGameResponse {
  game: GameRoom
  player: Player
}

export interface JoinGameResponse {
  game: GameRoom
  player: Player
}
