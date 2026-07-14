/**
 * Server-side Firebase utilities.
 *
 * We intentionally avoid importing the `firebase-admin` package because its
 * auth sub-package depends on `jose` (ESM-only), which crashes Vercel's
 * serverless bundler.  Instead we use:
 *
 *   • `@google-cloud/firestore` directly (already installed as a transitive
 *     dependency of firebase-admin) for Firestore operations.
 *   • The Firebase Auth REST API for user-management operations.
 */

import { Firestore } from '@google-cloud/firestore'

// ---------------------------------------------------------------------------
// Firestore (Admin-level, bypasses security rules)
// ---------------------------------------------------------------------------

function createFirestore() {
  try {
    let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || ''

    // Remove wrapping quotes if they exist (common when pasting into hosting dashboards)
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1)
    }

    // Replace literal '\n' with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n')

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL

    if (!projectId || !clientEmail || !privateKey) {
      console.error('[firebase-admin] MISSING env vars – Firestore will not be available')
      return null
    }

    return new Firestore({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    })
  } catch (error) {
    console.error('[firebase-admin] Firestore init error:', error)
    return null
  }
}

const _firestore = createFirestore()

/** Firestore instance with admin privileges. Throws if env vars are missing. */
export const adminDb = _firestore ?? (() => {
  throw new Error('Firestore not initialised – check FIREBASE_ADMIN_* env vars')
})() as never

// ---------------------------------------------------------------------------
// Firebase Auth helpers (REST API – no firebase-admin dependency)
// ---------------------------------------------------------------------------

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''
const AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1'

interface GoogleOAuthToken {
  access_token: string
  expires_at: number
}

let _cachedToken: GoogleOAuthToken | null = null

/**
 * Obtain a short-lived OAuth2 access token from the service-account
 * credentials (the same ones used for Firestore).  This token is then used to
 * call the Identity Toolkit REST API with admin privileges.
 */
async function getAccessToken(): Promise<string> {
  if (_cachedToken && Date.now() < _cachedToken.expires_at - 60_000) {
    return _cachedToken.access_token
  }

  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || ''
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1)
  }
  privateKey = privateKey.replace(/\\n/g, '\n')

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || ''
  const now = Math.floor(Date.now() / 1000)

  // Build a JWT to exchange for an access token
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
      scope: 'https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/cloud-platform',
    }),
  ).toString('base64url')

  const { createSign } = await import('crypto')
  const sign = createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = sign.sign(privateKey, 'base64url')

  const jwt = `${header}.${payload}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OAuth token exchange failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  _cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }
  return data.access_token
}

const IDENTITY_TOOLKIT_V1 = 'https://identitytoolkit.googleapis.com/v1'
const PROJECT_ID = process.env.FIREBASE_ADMIN_PROJECT_ID || ''

/**
 * Lightweight replacement for firebase-admin/auth that uses the REST API.
 * Only the methods actually used in this project are implemented.
 */
export const adminAuth = {
  /** Create a new user in Firebase Auth */
  async createUser(props: {
    email: string
    password: string
    displayName: string
  }): Promise<{ uid: string }> {
    const token = await getAccessToken()
    const res = await fetch(
      `${IDENTITY_TOOLKIT_V1}/projects/${PROJECT_ID}/accounts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: props.email,
          password: props.password,
          displayName: props.displayName,
          emailVerified: false,
          disabled: false,
        }),
      },
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `createUser failed: ${res.status}`)
    }
    const data = await res.json()
    return { uid: data.localId }
  },

  /** Update an existing user's properties */
  async updateUser(
    uid: string,
    props: { disabled?: boolean },
  ): Promise<void> {
    const token = await getAccessToken()
    const body: Record<string, unknown> = { localId: uid }
    if (props.disabled !== undefined) body.disableUser = props.disabled
    const res = await fetch(
      `${IDENTITY_TOOLKIT_V1}/projects/${PROJECT_ID}/accounts:update`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `updateUser failed: ${res.status}`)
    }
  },

  /** Delete a user from Firebase Auth */
  async deleteUser(uid: string): Promise<void> {
    const token = await getAccessToken()
    const res = await fetch(
      `${IDENTITY_TOOLKIT_V1}/projects/${PROJECT_ID}/accounts:delete`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ localId: uid }),
      },
    )
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `deleteUser failed: ${res.status}`)
    }
  },
}
