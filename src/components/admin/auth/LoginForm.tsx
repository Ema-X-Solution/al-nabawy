'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/authContext'
import { loginWithEmail } from '@/lib/auth/authService'
import { Icons } from '@/lib/icons'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>
}

export default function LoginForm({ lang, t }: Props) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const lt = t?.login ?? {}

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated) router.replace(`/${lang}/admin`)
  }, [isAuthenticated, router, lang])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithEmail(email, password, rememberMe)
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // Hard redirect to force AuthContext to remount and read localStorage
        window.location.href = `/${lang}/admin`
      } else {
        router.replace(`/${lang}/admin`)
      }
    } catch {
      setError(lt.error)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1.5px solid ${focused ? '#169DF7' : '#e5e7eb'}`,
    borderRadius: '0.65rem',
    fontSize: '0.9rem',
    color: '#1F2937',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
    boxShadow: focused ? '0 0 0 3px rgba(22,157,247,0.12)' : 'none',
    boxSizing: 'border-box',
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1b2a 0%, #0f2035 40%, #1a3a5c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,157,247,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,195,247,0.1) 0%, transparent 70%)' }} />
      </div>

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        position: 'relative',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #169DF7, #4FC3F7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(22,157,247,0.35)',
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>N</span>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.3rem' }}>{lt.title}</h1>
          <p style={{ fontSize: '0.84rem', color: '#6b7280', margin: 0 }}>{lt.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              {lt.email}
            </label>
            <FocusableInput
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              {lt.password}
            </label>
            <div style={{ position: 'relative' }}>
              <FocusableInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute', right: '0.85rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9ca3af', padding: 0, display: 'flex',
                }}
              >
                {showPassword
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: '#169DF7', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.83rem', color: '#374151' }}>{lt.rememberMe}</span>
          </label>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '0.65rem', padding: '0.75rem 1rem',
              fontSize: '0.84rem', color: '#dc2626',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <Icons.AlertTriangle size={16} /> {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem',
              background: loading ? '#93c5fd' : 'linear-gradient(135deg, #169DF7, #1e88e5)',
              border: 'none', borderRadius: '0.75rem',
              color: 'white', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(22,157,247,0.35)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
              </svg>
            )}
            {loading ? lt.submitting : lt.submit}
          </button>
        </form>

        {/* Back to site */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href={`/${lang}`}
            style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'none' }}
          >
            ← {lt.backToSite}
          </Link>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}

// ─── Focusable input helper (manages focus state locally) ────────────────────

function FocusableInput({
  type, value, onChange, placeholder, required, autoComplete,
}: {
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: '0.75rem 1rem',
        border: `1.5px solid ${focused ? '#169DF7' : '#e5e7eb'}`,
        borderRadius: '0.65rem',
        fontSize: '0.9rem',
        color: '#1F2937',
        background: 'white',
        outline: 'none',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: focused ? '0 0 0 3px rgba(22,157,247,0.12)' : 'none',
        boxSizing: 'border-box',
      }}
    />
  )
}
