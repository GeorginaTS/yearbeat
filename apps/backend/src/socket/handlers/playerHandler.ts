import type { Socket } from 'socket.io'
import { gameService } from '../../services/gameService'

export function registerPlayerHandlers(socket: Socket) {
  socket.on('disconnect', async () => {
    if (socket.data.playerId) {
      await gameService.setPlayerSocket(socket.data.playerId, null)
    }
  })
}
