import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { requireFirebaseAuth } from '../middleware/firebaseAuth'
import { gameService } from '../services/gameService'

const router = Router()

router.post('/create', requireFirebaseAuth, validate(z.object({}).passthrough()), async (_req, res, next) => {
  try {
    const playerName = String(res.locals.authUser?.name || 'Player').slice(0, 20)
    const result = await gameService.createGame(playerName)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post(
  '/join',
  requireFirebaseAuth,
  validate(z.object({ code: z.string().length(4) }).passthrough()),
  async (req, res, next) => {
    try {
      const playerName = String(res.locals.authUser?.name || 'Player').slice(0, 20)
      const result = await gameService.joinGame(req.body.code, playerName)
      res.json(result)
    } catch (error) {
      next(error)
    }
  },
)

router.get('/:code', async (req, res, next) => {
  try {
    const game = await gameService.getGameByCode(req.params.code)
    res.json(game)
  } catch (error) {
    next(error)
  }
})

export default router
