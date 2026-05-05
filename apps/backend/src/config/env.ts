import { z } from 'zod'

export const env = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1).optional(),
    REDIS_URL: z.string().min(1),
    FRONTEND_URL: z.string().url(),
    FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  })
  .parse(process.env)
