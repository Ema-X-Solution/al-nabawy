'use client'
import { useState } from 'react'
import { submitContact } from '@/lib/submitContact'
import type { Locale } from '@/dictionaries'

interface Props {
  lang: Locale
  t: {
    formTitle: string
    formSubtitle: string
    name: string
    company: string
    country: string
    email: string
    phone: string
    interest: string
    message: string
    submit: string
    submitting: string
    success: string
    error: string
  }
  productOptions: Record<string, { name: string }>
}

export default function ContactForm({ lang, t, productOptions }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '', company: '', country: '', email: '', phone: '', interest: '', message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', company: '', country: '', email: '', phone: '', interest: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 8px 40px rgba(22,157,247,0.1)', border: '1px solid rgba(22,157,247,0.1)' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1F2937', marginBottom: '0.5rem' }}>{t.formTitle}</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>{t.formSubtitle}</p>

      {status === 'success' ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <p style={{ fontWeight: 700, color: '#8BC34A', fontSize: '1.1rem' }}>{t.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">{t.name} *</label>
              <input name="name" required value={form.name} onChange={handleChange} className="form-input" placeholder={t.name} />
            </div>
            <div>
              <label className="form-label">{t.company}</label>
              <input name="company" value={form.company} onChange={handleChange} className="form-input" placeholder={t.company} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">{t.email} *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className="form-input" placeholder={t.email} />
            </div>
            <div>
              <label className="form-label">{t.phone}</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" placeholder={t.phone} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">{t.country}</label>
              <input name="country" value={form.country} onChange={handleChange} className="form-input" placeholder={t.country} />
            </div>
            <div>
              <label className="form-label">{t.interest}</label>
              <select name="interest" value={form.interest} onChange={handleChange} className="form-input">
                <option value="">— Select —</option>
                {Object.entries(productOptions).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">{t.message} *</label>
            <textarea
              name="message"
              required
              value={form.message}
              onChange={handleChange}
              className="form-input"
              rows={5}
              placeholder={t.message}
              style={{ resize: 'vertical' }}
            />
          </div>

          {status === 'error' && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{t.error}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary"
            style={{ justifyContent: 'center', fontSize: '1rem', padding: '0.9rem', opacity: status === 'loading' ? 0.7 : 1 }}
            id="contact-submit-btn"
          >
            {status === 'loading' ? t.submitting : t.submit}
          </button>
        </form>
      )}
    </div>
  )
}
