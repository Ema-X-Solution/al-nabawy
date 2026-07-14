import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initApp() {
  if (getApps().length > 0) {
    return getApp()
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || ''

  // Log diagnostics (safe – only lengths, not secrets)
  console.log('[firebase-admin] init – projectId:', projectId ?? '(missing)')
  console.log('[firebase-admin] init – clientEmail:', clientEmail ?? '(missing)')
  console.log('[firebase-admin] init – privateKey length:', privateKey.length)

  if (!projectId || !clientEmail || !privateKey) {
    console.error('[firebase-admin] MISSING env vars – cannot initialise')
    return undefined
  }

  try {
    // Remove wrapping quotes if they exist (common when pasting into Vercel)
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1)
      console.log('[firebase-admin] stripped surrounding quotes, new length:', privateKey.length)
    }

    // Replace literal '\n' with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n')

    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  } catch (error) {
    console.error('[firebase-admin] initialization error:', error)
    return undefined
  }
}

const app = initApp()

const throwNotInitialized = (method: string) => {
  throw new Error(`Firebase Admin not initialized – cannot call ${method}`)
}

// Safe fallback that won't interfere with Next.js module resolution
const adminDbFallback = {
  doc: (path: string) => throwNotInitialized(`doc("${path}")`),
  collection: (path: string) => throwNotInitialized(`collection("${path}")`),
} as any

const adminAuthFallback = {
  createUser: () => throwNotInitialized('createUser'),
  updateUser: () => throwNotInitialized('updateUser'),
  deleteUser: () => throwNotInitialized('deleteUser'),
  getUser: () => throwNotInitialized('getUser'),
  verifyIdToken: () => throwNotInitialized('verifyIdToken'),
} as any

export const adminAuth = app ? getAuth(app) : adminAuthFallback
export const adminDb = app ? getFirestore(app) : adminDbFallback
