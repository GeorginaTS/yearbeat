import { Router } from 'express'
import axios from 'axios'
import { deezerService } from '../services/deezerService'

const router = Router()

router.get('/sample', async (_req, res, next) => {
  try {
    const songs = await deezerService.generateGameSongs(10)
    res.json(songs)
  } catch (error) {
    next(error)
  }
})

router.get('/preview', async (req, res, next) => {
  try {
    const url = req.query.url as string
    if (!url || !url.startsWith('https://') || (!url.includes('deezer') && !url.includes('dzcdn.net'))) {
      res.status(400).json({ message: 'URL invàlida' })
      return
    }
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.deezer.com/',
        'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
      },
    })
    res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    ;(response.data as NodeJS.ReadableStream).pipe(res)
  } catch (error) {
    next(error)
  }
})

export default router
