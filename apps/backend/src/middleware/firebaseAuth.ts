import type { RequestHandler } from 'express'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { env } from '../config/env'

if (getApps().length === 0) {
  initializeApp(
    env.FIREBASE_PROJECT_ID
      ? {
          projectId: env.FIREBASE_PROJECT_ID,
        }
      : undefined,
  )
}

export const requireFirebaseAuth: RequestHandler = async (req, res, next) => {
  try {
    if (!env.FIREBASE_PROJECT_ID) {
      return res.status(500).json({ message: 'Missing FIREBASE_PROJECT_ID in backend environment' })
    }

    const authorization = req.headers.authorization
    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing Authorization Bearer token' })
    }

    const idToken = authorization.slice('Bearer '.length).trim()
    if (!idToken) {
      return res.status(401).json({ message: 'Invalid Authorization token' })
    }

    const decoded = await getAuth().verifyIdToken(idToken)
    const profileName = typeof decoded.name === 'string' && decoded.name.trim().length > 1 ? decoded.name.trim() : null
    const fallbackFromEmail = typeof decoded.email === 'string' ? decoded.email.split('@')[0] : null

    res.locals.authUser = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: profileName ?? fallbackFromEmail ?? 'Player',
    }

    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired Firebase token' })
  }
}
