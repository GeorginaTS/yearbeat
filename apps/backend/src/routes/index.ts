import { Router } from 'express'
import gameRoutes from './game.routes'
import deezerRoutes from './deezer.routes'

const router = Router()

router.use('/games', gameRoutes)
router.use('/deezer', deezerRoutes)

export default router
