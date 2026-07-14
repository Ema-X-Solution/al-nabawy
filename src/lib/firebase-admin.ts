import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function initApp() {
  if (getApps().length > 0) {
    return getApp()
  }
  
  try {
    let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || ''
    
    // Remove wrapping quotes if they exist (common when pasting into Vercel)
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1)
    }
    
    // Replace literal '\n' with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n')

    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    })
  } catch (error) {
    console.error('Firebase Admin initialization error', error)
    // Return undefined to prevent crashing at the module level
    return undefined
  }
}

const throwProxy = new Proxy({} as any, {
  get: (target, prop) => {
    if (typeof prop === 'symbol' || prop === 'then' || prop === '__esModule' || prop === '$$typeof') {
      return undefined;
    }
    return () => { throw new Error('Firebase not initialized') };
  }
});

const app = initApp();

// Export proxies or initialize directly if successful
// If app failed to initialize, these will throw when USED, not when imported.
export const adminAuth = app ? getAuth(app) : throwProxy;
export const adminDb = app ? getFirestore(app) : throwProxy;
