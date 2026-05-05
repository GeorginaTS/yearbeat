import { defineStore } from 'pinia'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  getIdToken,
  type User,
} from 'firebase/auth'
import { auth, facebookProvider, googleProvider } from '../lib/firebase'

type AuthProfile = {
  uid: string
  name: string
  email: string | null
  provider: string
  photoURL: string | null
}

function mapUser(user: User): AuthProfile {
  return {
    uid: user.uid,
    name: user.displayName || (user.email ? user.email.split('@')[0] : 'Player'),
    email: user.email,
    provider: user.providerData[0]?.providerId || 'unknown',
    photoURL: user.photoURL,
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthProfile | null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    initAuth() {
      if (this.initialized) return
      this.initialized = true

      onAuthStateChanged(auth, (user: User | null) => {
        this.user = user ? mapUser(user) : null
      })
    },

    async signInWithGoogle() {
      const result = await signInWithPopup(auth, googleProvider)
      this.user = mapUser(result.user)
    },

    async signInWithFacebook() {
      const result = await signInWithPopup(auth, facebookProvider)
      this.user = mapUser(result.user)
    },

    async signOut() {
      await firebaseSignOut(auth)
      this.user = null
    },

    async getAccessToken(forceRefresh = false): Promise<string | null> {
      if (!auth.currentUser) return null
      return getIdToken(auth.currentUser, forceRefresh)
    },
  },
  persist: true,
})
