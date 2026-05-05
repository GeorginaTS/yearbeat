import type { ActiveSong, Player, PlayerScore, RoundAnswer } from './game.types'

export interface ClientToServerEvents {
  'game:join': (payload: { code: string; playerName: string }) => void
  'game:start': (payload: { gameId: string }) => void
  'game:submitAnswer': (payload: { gameSongId: string; yearGuess: number }) => void
  'game:nextSong': (payload: { gameId: string }) => void
  'game:reaction': (payload: { gameId: string; emoji: string }) => void
}

export interface ServerToClientEvents {
  'game:playerJoined': (payload: { players: Player[] }) => void
  'game:started': (payload: { firstSong: ActiveSong; songNumber: number }) => void
  'game:songPlaying': (payload: { song: ActiveSong; songNumber: number }) => void
  'game:timerUpdate': (payload: { secondsLeft: number }) => void
  'game:answerReceived': (payload: { playerId: string; answered: boolean }) => void
  'game:reaction': (payload: { playerId: string; emoji: string }) => void
  'game:showAnswers': (payload: { answers: RoundAnswer[]; correctYear: number }) => void
  'game:finished': (payload: { finalScores: PlayerScore[] }) => void
  'game:error': (payload: { message: string }) => void
}
