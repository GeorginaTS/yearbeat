import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { env } from '../config/env'
import { registerGameHandlers } from './handlers/gameHandler'
import { registerPlayerHandlers } from './handlers/playerHandler'

export function createSocketServer(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    registerGameHandlers(io, socket)
    registerPlayerHandlers(socket)
  })

  return io
}
