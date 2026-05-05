import type { Prisma } from '../generated/prisma'

export type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    players: true
    gameSongs: {
      include: {
        song: true
        answers: true
      }
      orderBy: { order: 'asc' }
    }
  }
}>
