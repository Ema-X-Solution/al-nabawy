'use client'
import { useState } from 'react'
import { submitContactMessage } from '@/app/actions/messagesActions'
import { Icons } from '@/lib/icons'
import type { Locale } from '@/dictionaries'

import type { ContactDocument } from '@/types/contact.types'

interface Props {
  lang: Locale
  config: ContactDocument
  tSystem: {
    success: string
    error: string
    submitting: string
  }
  productOptions: Record<string, { name: string }>
}

export default function ContactForm({ lang, config, tSystem, productOptions }: Props) {
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
      const res = await submitContactMessage(form)
      if (res.success) {
        setStatus('success')
        setForm({ name: '', company: '', country: '', email: '', phone: '', interest: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 8px 40px rgba(22,157,247,0.1)', border: '1px solid rgba(22,157,247,0.1)' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1F2937', marginBottom: '0.5rem' }}>{config.formTitle[lang]}</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>{config.formSubtitle[lang]}</p>

      {status === 'success' ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><Icons.CheckCircle size={64} color="#8BC34A" /></div>
          <p style={{ fontWeight: 700, color: '#8BC34A', fontSize: '1.1rem' }}>{tSystem.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">{config.labelName[lang]} *</label>
              <input name="name" required value={form.name} onChange={handleChange} className="form-input" placeholder={config.labelName[lang]} />
            </div>
            <div>
              <label className="form-label">{config.labelCompany[lang]}</label>
              <input name="company" value={form.company} onChange={handleChange} className="form-input" placeholder={config.labelCompany[lang]} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">{config.labelEmail[lang]} *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className="form-input" placeholder={config.labelEmail[lang]} />
            </div>
            <div>
              <label className="form-label">{config.labelPhone[lang]}</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" placeholder={config.labelPhone[lang]} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">{config.labelCountry[lang]}</label>
              <input name="country" value={form.country} onChange={handleChange} className="form-input" placeholder={config.labelCountry[lang]} />
            </div>
            <div>
              <label className="form-label">{config.labelInterest[lang]}</label>
              <select name="interest" value={form.interest} onChange={handleChange} className="form-input">
                <option value="">— Select —</option>
                {Object.entries(productOptions).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">{config.labelMessage[lang]} *</label>
            <textarea
              name="message"
              required
              value={form.message}
              onChange={handleChange}
              className="form-input"
              rows={5}
              placeholder={config.labelMessage[lang]}
              style={{ resize: 'vertical' }}
            />
          </div>

          {status === 'error' && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{tSystem.error}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary"
            style={{ justifyContent: 'center', fontSize: '1rem', padding: '0.9rem', opacity: status === 'loading' ? 0.7 : 1 }}
            id="contact-submit-btn"
          >
            {status === 'loading' ? tSystem.submitting : config.labelSubmit[lang]}
          </button>
        </form>
      )}
    </div>
  )
}
