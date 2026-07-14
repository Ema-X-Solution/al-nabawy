'use client'

import React, { useState, useEffect } from 'react'
import type { ContactDocument, ContactLocale, ContactLocalizedString } from '@/types/contact.types'
import { saveContactConfig } from '@/app/actions/contactActions'
import { Icons } from '@/lib/icons'

interface Props { initialConfig: ContactDocument }

const LANGS: { key: ContactLocale; label: string; full: string }[] = [
  { key: 'en', label: 'EN', full: 'English' },
  { key: 'ar', label: 'AR', full: 'Arabic' },
  { key: 'tr', label: 'TR', full: 'Turkish' },
  { key: 'pl', label: 'PL', full: 'Polish' },
  { key: 'de', label: 'DE', full: 'German' },
  { key: 'fr', label: 'FR', full: 'French' },
]

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '11px 16px',
  border: '1.5px solid #e5e7eb', borderRadius: '10px',
  fontSize: '14px', fontFamily: 'Poppins, sans-serif',
  color: '#111827', background: '#fff', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 700,
  letterSpacing: '0.05em', color: '#6b7280', marginBottom: '8px',
  textTransform: 'uppercase', fontFamily: 'Poppins, sans-serif',
}
const deepEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)

function LangTabs({ lang, setLang }: { lang: ContactLocale; setLang: (l: ContactLocale) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px', flexWrap: 'wrap' }}>
      {LANGS.map(({ key, label, full }) => (
        <button key={key} type="button" onClick={() => setLang(key)} title={full} style={{
          padding: '6px 16px', fontSize: '13px', fontWeight: 700,
          fontFamily: 'Poppins, sans-serif', border: '1.5px solid',
          borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s ease',
          borderColor: lang === key ? '#169DF7' : '#e5e7eb',
          background: lang === key ? '#169DF7' : '#fff',
          color: lang === key ? '#fff' : '#9ca3af',
        }}>{label}</button>
      ))}
      <span style={{ marginLeft: '8px', fontSize: '13px', color: '#9ca3af', fontFamily: 'Poppins, sans-serif' }}>
        — {LANGS.find(l => l.key === lang)?.full}
      </span>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '10px', overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', color: '#169DF7' }}>{icon}</span>
        <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: 'Poppins, sans-serif' }}>{title}</span>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>{open ? 'Collapse' : 'Expand'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && <div style={{ padding: '24px 28px 28px', borderTop: '1px solid #f3f4f6' }}>{children}</div>}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, multiline = false, dir }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; multiline?: boolean; dir?: string
}) {
  const [focused, setFocused] = useState(false)
  const fs: React.CSSProperties = {
    ...fieldStyle,
    borderColor: focused ? '#169DF7' : '#e5e7eb',
    boxShadow: focused ? '0 0 0 3px rgba(22,157,247,0.12)' : 'none',
    ...(dir ? { direction: dir as any } : {}),
    ...(multiline ? { resize: 'vertical' as const, lineHeight: 1.7 } : {}),
  }
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} style={fs} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} style={fs} />
      )}
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>{children}</div>
}

export default function ContactCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<ContactDocument>(initialConfig)
  const [lang, setLang] = useState<ContactLocale>('en')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    setHasUnsavedChanges(!deepEqual(config, initialConfig))
  }, [config, initialConfig])

  const patch = (path: string, value: any) => {
    setConfig(prev => {
      const next = { ...prev } as any
      const keys = path.split('.')
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] }
        cur = cur[keys[i]]
      }
      cur[keys[keys.length - 1]] = value
      return next as ContactDocument
    })
  }

  const patchLoc = (path: string, val: string) => {
    const keys = path.split('.')
    let cur: any = config
    for (const k of keys) cur = cur[k]
    const updated = { ...cur as ContactLocalizedString, [lang]: val }
    patch(path, updated)
  }

  const getLoc = (path: string): string => {
    const keys = path.split('.')
    let cur: any = config
    for (const k of keys) cur = cur?.[k]
    return (cur as ContactLocalizedString)?.[lang] || ''
  }

  const handleDiscard = () => setConfig(initialConfig)

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const res = await saveContactConfig(config)
    setIsSaving(false)
    if (res.success) {
      const { revalidatePublicPath } = await import('@/app/actions/revalidateActions')
      await revalidatePublicPath('/')
      window.location.reload()
    }
    else alert(res.error || 'Failed to save.')
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ── 1. HERO ─────────────────────────────────── */}
      <Section icon={<Icons.ImageIcon size={18} />} title="Hero Banner">
        <LangTabs lang={lang} setLang={setLang} />
        <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Grid2>
            <Field label="Page Title" value={getLoc('heroTitle')} onChange={v => patchLoc('heroTitle', v)} />
            <Field label="Subtitle" value={getLoc('heroSub')} onChange={v => patchLoc('heroSub', v)} />
          </Grid2>
        </div>
      </Section>

      {/* ── 2. CONTACT INFO ──────────────────────────── */}
      <Section icon={<Icons.Phone size={18} />} title="Contact Information">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Static fields (no localization — these are data, not content) */}
          <div style={{ padding: '14px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid rgba(22,157,247,0.15)', marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: '#169DF7', fontWeight: 600, margin: 0 }}>Contact details below are not localized — they are the actual business info shown in all languages.
            </p>
          </div>
          <Grid2>
            <Field label="Phone Number" value={config.phone} onChange={v => patch('phone', v)} placeholder="+20 123 456 7890" />
            <Field label="WhatsApp Number" value={config.whatsapp} onChange={v => patch('whatsapp', v)} placeholder="+20 123 456 789" />
          </Grid2>
          <Grid2>
            <Field label="Email Address" value={config.email} onChange={v => patch('email', v)} placeholder="info@alnabawy.com" />
            <Field label="Physical Address" value={config.address} onChange={v => patch('address', v)} placeholder="Industrial Area, Egypt" />
          </Grid2>

          <LangTabs lang={lang} setLang={setLang} />
          <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Grid2>
              <Field label="Info Section Title" value={getLoc('infoTitle')} onChange={v => patchLoc('infoTitle', v)} />
              <Field label="Business Hours Label" value={getLoc('hours')} onChange={v => patchLoc('hours', v)} />
            </Grid2>
            <Field label="Business Hours Value" value={getLoc('hoursValue')} onChange={v => patchLoc('hoursValue', v)} placeholder="Sunday – Thursday: 9:00 AM – 5:00 PM" />
          </div>
        </div>
      </Section>

      {/* ── 3. MAP ───────────────────────────────────── */}
      <Section icon={<Icons.MapPin size={18} />} title="Google Maps Embed">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field
            label="Google Maps Embed URL"
            value={config.mapEmbedUrl}
            onChange={v => patch('mapEmbedUrl', v)}
            placeholder="https://www.google.com/maps/embed?..."
          />
          {config.mapEmbedUrl && (
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
              <iframe src={config.mapEmbedUrl} width="100%" height="220" style={{ border: 0, display: 'block' }} loading="lazy" title="Map Preview" />
            </div>
          )}
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
            To get this URL: open Google Maps → search your location → Share → Embed a map → Copy the <code>src</code> URL from the iframe code.
          </p>
        </div>
      </Section>

      {/* ── 4. FORM TEXTS ────────────────────────────── */}
      <Section icon={<Icons.MessageSquare size={18} />} title="Contact Form Labels">
        <LangTabs lang={lang} setLang={setLang} />
        <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Grid2>
            <Field label="Form Title" value={getLoc('formTitle')} onChange={v => patchLoc('formTitle', v)} />
            <Field label="Form Subtitle" value={getLoc('formSubtitle')} onChange={v => patchLoc('formSubtitle', v)} />
          </Grid2>
          <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Field Labels</h4>
            <Grid2>
              <Field label="Full Name" value={getLoc('labelName')} onChange={v => patchLoc('labelName', v)} />
              <Field label="Company Name" value={getLoc('labelCompany')} onChange={v => patchLoc('labelCompany', v)} />
            </Grid2>
            <Grid2>
              <Field label="Country" value={getLoc('labelCountry')} onChange={v => patchLoc('labelCountry', v)} />
              <Field label="Email Address" value={getLoc('labelEmail')} onChange={v => patchLoc('labelEmail', v)} />
            </Grid2>
            <Grid2>
              <Field label="Phone Number" value={getLoc('labelPhone')} onChange={v => patchLoc('labelPhone', v)} />
              <Field label="Product Interest" value={getLoc('labelInterest')} onChange={v => patchLoc('labelInterest', v)} />
            </Grid2>
            <Grid2>
              <Field label="Message" value={getLoc('labelMessage')} onChange={v => patchLoc('labelMessage', v)} />
              <Field label="Submit Button" value={getLoc('labelSubmit')} onChange={v => patchLoc('labelSubmit', v)} />
            </Grid2>
          </div>
        </div>
      </Section>

      {/* ── Floating Save Banner ─────────────────────── */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%',
        transform: `translateX(-50%) translateY(${hasUnsavedChanges ? '0' : '80px'})`,
        opacity: hasUnsavedChanges ? 1 : 0, pointerEvents: hasUnsavedChanges ? 'auto' : 'none',
        transition: 'transform 0.3s ease, opacity 0.3s ease', zIndex: 100,
      }}>
        <div style={{ background: '#111', color: 'white', padding: '12px 20px', borderRadius: '9999px', boxShadow: '0 8px 30px rgba(0,0,0,0.24)', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px', minWidth: '320px', justifyContent: 'space-between', fontFamily: 'Poppins, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', boxShadow: '0 0 0 4px rgba(59,130,246,0.25)' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Unsaved changes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handleDiscard} disabled={isSaving} style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>Discard</button>
            <button onClick={handleSave} disabled={isSaving} style={{ background: 'white', color: '#111', border: 'none', padding: '8px 18px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isSaving ? <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                Saving…
              </> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
