import Redis from 'ioredis'
import { env } from './env'

export const redis = new Redis(env.REDIS_URL)

redis.on('error', (error) => {
	console.error('[redis] connection error:', error.message)
})
