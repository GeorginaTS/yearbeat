import { redis } from '../config/redis'

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key)
    return raw ? (JSON.parse(raw) as T) : null
  },
  async set<T>(key: string, value: T, ttlSeconds: number) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  },
}
