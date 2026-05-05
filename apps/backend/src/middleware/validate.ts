import type { RequestHandler } from 'express'
import type { ZodSchema } from 'zod'

export const validate =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.flatten() })
    }
    req.body = parsed.data
    next()
  }
