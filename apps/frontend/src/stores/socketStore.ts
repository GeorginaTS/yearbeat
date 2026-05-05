import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@yearbeat/shared-types'

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

export const useSocketStore = defineStore('socket', {
  state: () => ({
    socket: null as Socket<ServerToClientEvents, ClientToServerEvents> | null,
  }),
  actions: {
    connect() {
      if (!this.socket) {
        this.socket = io(URL, { transports: ['websocket'] })
      }
      return this.socket
    },
    emit<K extends keyof ClientToServerEvents>(
      event: K,
      payload: Parameters<ClientToServerEvents[K]>[0],
    ) {
      this.socket?.emit(event, payload as never)
    },
    disconnect() {
      this.socket?.disconnect()
      this.socket = null
    },
  },
})
