'use client'

import React, { useState, useEffect } from 'react'
import type {
  AboutDocument,
  AboutLocalizedString,
  AboutLocale,
  AboutTimelineItem,
} from '@/types/about.types'
import { aboutLocales } from '@/types/about.types'
import { saveAboutConfig } from '@/app/actions/aboutActions'
import MediaPicker from '@/components/admin/MediaPicker'
import type { AboutImageAsset } from '@/types/about.types'
import { Icons } from '@/lib/icons'

interface Props {
  initialConfig: AboutDocument
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const LANGS: { key: AboutLocale; label: string; full: string }[] = [
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
const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '12px',
  marginBottom: '24px', paddingBottom: '16px', borderBottom: '1.5px solid #f3f4f6',
}
const deepEqual = (a: any, b: any): boolean => JSON.stringify(a) === JSON.stringify(b)

// ─── Language Tab Bar ────────────────────────────────────────────────────────
function LangTabs({ lang, setLang }: { lang: AboutLocale; setLang: (l: AboutLocale) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px', flexWrap: 'wrap' }}>
      {LANGS.map(({ key, label, full }) => (
        <button
          key={key} type="button" onClick={() => setLang(key)} title={full}
          style={{
            padding: '6px 16px', fontSize: '13px', fontWeight: 700,
            fontFamily: 'Poppins, sans-serif', border: '1.5px solid',
            borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s ease',
            borderColor: lang === key ? '#169DF7' : '#e5e7eb',
            background: lang === key ? '#169DF7' : '#fff',
            color: lang === key ? '#fff' : '#9ca3af',
          }}
        >
          {label}
        </button>
      ))}
      <span style={{ marginLeft: '8px', fontSize: '13px', color: '#9ca3af', fontFamily: 'Poppins, sans-serif' }}>
        — {LANGS.find(l => l.key === lang)?.full}
      </span>
    </div>
  )
}

// ─── Field helpers ───────────────────────────────────────────────────────────
function setLoc(obj: AboutLocalizedString, lang: AboutLocale, val: string): AboutLocalizedString {
  return { ...obj, [lang]: val }
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '10px', overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
          padding: '16px 20px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', color: '#169DF7' }}>{icon}</span>
        <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: 'Poppins, sans-serif' }}>{title}</span>
        <span style={{ color: '#9ca3af', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>{open ? 'Collapse' : 'Expand'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: '24px 28px 28px', borderTop: '1px solid #f3f4f6' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Input Components ────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, multiline = false, dir,
}: {
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
        <textarea rows={4} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} style={fs} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} style={fs} />
      )}
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>{children}</div>
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AboutCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<AboutDocument>(initialConfig)
  const [lang, setLang] = useState<AboutLocale>('en')
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
      return next as AboutDocument
    })
  }

  const patchLoc = (path: string, val: string) => {
    const keys = path.split('.')
    let cur: any = config
    for (const k of keys) cur = cur[k]
    const updated = { ...cur as AboutLocalizedString, [lang]: val }
    patch(path, updated)
  }

  const getLoc = (path: string): string => {
    const keys = path.split('.')
    let cur: any = config
    for (const k of keys) cur = cur?.[k]
    return (cur as AboutLocalizedString)?.[lang] || ''
  }

  const handleDiscard = () => setConfig(initialConfig)

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const res = await saveAboutConfig(config)
    setIsSaving(false)
    if (res.success) window.location.reload()
    else alert(res.error || 'Failed to save.')
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  // ── Timeline helpers
  const addTimelineItem = () => {
    const newItem: AboutTimelineItem = {
      id: `t_${Date.now()}`,
      year: String(new Date().getFullYear()),
      order: config.timelineItems.length,
      event: { en: '', ar: '', tr: '', pl: '', de: '', fr: '' },
    }
    patch('timelineItems', [...config.timelineItems, newItem])
  }

  const removeTimelineItem = (id: string) => {
    patch('timelineItems', config.timelineItems.filter(i => i.id !== id)
      .map((item, idx) => ({ ...item, order: idx })))
  }

  const patchTimelineItem = (id: string, updates: Partial<AboutTimelineItem>) => {
    patch('timelineItems', config.timelineItems.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ── 1. HERO ──────────────────────────────────── */}
      <Section icon={<Icons.ImageIcon size={18} />} title="Hero Banner">
        <LangTabs lang={lang} setLang={setLang} />
        <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Brand Badge" value={getLoc('hero.badge')} onChange={v => patchLoc('hero.badge', v)} placeholder="Al-Nabawy Dairy" />
          <Field label="Page Title" value={getLoc('hero.title')} onChange={v => patchLoc('hero.title', v)} placeholder="About Al-Nabawy" />
          <Field label="Subtitle" value={getLoc('hero.subtitle')} onChange={v => patchLoc('hero.subtitle', v)} placeholder="Crafting premium dairy since 2009" />
        </div>
      </Section>

      {/* ── 2. OUR STORY ─────────────────────────────── */}
      <Section icon={<Icons.FileText size={18} />} title="Our Story">
        <LangTabs lang={lang} setLang={setLang} />
        <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Grid2>
            <Field label="Section Label" value={getLoc('story.label')} onChange={v => patchLoc('story.label', v)} placeholder="Our Story" />
            <Field label="Section Title" value={getLoc('story.title')} onChange={v => patchLoc('story.title', v)} placeholder="15+ Years of Dairy Excellence" />
          </Grid2>
          <Field label="Body Text" value={getLoc('story.body')} onChange={v => patchLoc('story.body', v)} placeholder="Founded in 2009..." multiline />

          {/* Story image */}
          <div>
            <label style={labelStyle}>Story Image</label>
            <div style={{ padding: '12px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px' }}>
              {config.story.image?.secure_url && (
                <img
                  src={config.story.image.secure_url} alt="Story"
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                />
              )}
              <MediaPicker
                value={config.story.image as any}
                folder="about"
                onChange={(asset) => patch('story.image', asset ? { ...asset } as AboutImageAsset : undefined)}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3. VISION & MISSION ──────────────────────── */}
      <Section icon={<Icons.Target size={18} />} title="Vision & Mission">
        <LangTabs lang={lang} setLang={setLang} />
        <div dir={dir} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#eff8ff', borderRadius: '10px', borderTop: '3px solid #169DF7' }}>
            <div style={{ marginBottom: '4px', color: '#169DF7' }}><Icons.Target size={24} /></div>
            <Field label="Vision Title" value={getLoc('visionMission.visionTitle')} onChange={v => patchLoc('visionMission.visionTitle', v)} placeholder="Our Vision" />
            <Field label="Vision Body" value={getLoc('visionMission.visionBody')} onChange={v => patchLoc('visionMission.visionBody', v)} multiline />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#f0fdf4', borderRadius: '10px', borderTop: '3px solid #8BC34A' }}>
            <div style={{ marginBottom: '4px', color: '#8BC34A' }}><Icons.Target size={24} /></div>
            <Field label="Mission Title" value={getLoc('visionMission.missionTitle')} onChange={v => patchLoc('visionMission.missionTitle', v)} placeholder="Our Mission" />
            <Field label="Mission Body" value={getLoc('visionMission.missionBody')} onChange={v => patchLoc('visionMission.missionBody', v)} multiline />
          </div>
        </div>
      </Section>

      {/* ── 4. CORE VALUES ───────────────────────────── */}
      <Section icon={<Icons.Star size={18} />} title="Core Values">
        <LangTabs lang={lang} setLang={setLang} />
        <div style={{ marginBottom: '16px' }}>
          <Field label="Section Title" value={getLoc('values.sectionTitle')} onChange={v => patchLoc('values.sectionTitle', v)} placeholder="Core Values" />
        </div>
        <div dir={dir} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { path: 'values.quality',      icon: <Icons.Target size={22} color="#169DF7" />, label: 'Quality (Label Only — Icon Fixed)' },
            { path: 'values.integrity',    icon: <Icons.Users size={22} color="#169DF7" />, label: 'Integrity (Label Only — Icon Fixed)' },
            { path: 'values.innovation',   icon: <Icons.Star size={22} color="#169DF7" />, label: 'Innovation (Label Only — Icon Fixed)' },
            { path: 'values.sustainability', icon: <Icons.Globe size={22} color="#169DF7" />, label: 'Sustainability (Label Only — Icon Fixed)' },
          ].map(({ path, icon, label }) => (
            <div key={path} style={{ padding: '14px', background: '#f0f9ff', border: '1px solid rgba(22,157,247,0.15)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>{icon}</div>
              <Field label={label} value={getLoc(path)} onChange={v => patchLoc(path, v)} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. TIMELINE ──────────────────────────────── */}
      <Section icon={<Icons.ClipboardList size={18} />} title="Timeline — Milestones">
        <LangTabs lang={lang} setLang={setLang} />

        {/* Section heading */}
        <Grid2>
          <Field label="Section Label" value={getLoc('timelineSection.label')} onChange={v => patchLoc('timelineSection.label', v)} placeholder="Our Journey" />
          <Field label="Section Title" value={getLoc('timelineSection.title')} onChange={v => patchLoc('timelineSection.title', v)} placeholder="Milestones" />
        </Grid2>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[...config.timelineItems].sort((a, b) => a.order - b.order).map((item, idx) => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', background: '#f9fafb',
              border: '1.5px solid #e5e7eb', borderRadius: '10px',
            }}>
              {/* Year badge */}
              <div style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#169DF7,#0d6fb8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '11px',
                boxShadow: '0 4px 12px rgba(22,157,247,0.3)', fontFamily: 'Poppins, sans-serif',
              }}>
                {item.year.slice(-2)}
              </div>

              {/* Year input */}
              <div style={{ width: '80px', flexShrink: 0 }}>
                <input
                  type="text" value={item.year} maxLength={4}
                  onChange={e => patchTimelineItem(item.id, { year: e.target.value })}
                  style={{ ...fieldStyle, textAlign: 'center', fontWeight: 700, fontSize: '13px' }}
                  placeholder="2009"
                />
              </div>

              {/* Event text */}
              <div style={{ flex: 1 }} dir={dir}>
                <input
                  type="text"
                  value={item.event[lang] || ''}
                  onChange={e => patchTimelineItem(item.id, {
                    event: { ...item.event, [lang]: e.target.value }
                  })}
                  style={fieldStyle}
                  placeholder="Milestone description..."
                />
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeTimelineItem(item.id)}
                style={{
                  flexShrink: 0, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: '1.5px solid #e5e7eb',
                  borderRadius: '8px', color: '#9ca3af', cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#fca5a5'; (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}

          <button
            type="button" onClick={addTimelineItem}
            style={{
              width: '100%', padding: '12px', background: 'transparent',
              border: '1.5px dashed #d1d5db', borderRadius: '10px',
              color: '#9ca3af', fontSize: '13px', fontWeight: 600,
              fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#169DF7'; (e.currentTarget as HTMLButtonElement).style.color = '#169DF7'; (e.currentTarget as HTMLButtonElement).style.background = '#eff8ff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d1d5db'; (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Milestone
          </button>
        </div>
      </Section>

      {/* ── 6. BOTTOM CTA ────────────────────────────── */}
      <Section icon={<Icons.Mailbox size={18} />} title="Bottom CTA">
        <LangTabs lang={lang} setLang={setLang} />
        <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="CTA Title" value={getLoc('cta.title')} onChange={v => patchLoc('cta.title', v)} placeholder="Contact Us Today" />
          <Grid2>
            <Field label="Button Label" value={getLoc('cta.buttonLabel')} onChange={v => patchLoc('cta.buttonLabel', v)} placeholder="Contact Us" />
            <div dir="ltr">
              <Field label="Button URL (route)" value={config.cta.buttonLink} onChange={v => patch('cta.buttonLink', v)} placeholder="/contact" />
            </div>
          </Grid2>
        </div>
      </Section>

      {/* ── Floating Save Banner ─────────────────────── */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%',
        transform: `translateX(-50%) translateY(${hasUnsavedChanges ? '0' : '80px'})`,
        opacity: hasUnsavedChanges ? 1 : 0, pointerEvents: hasUnsavedChanges ? 'auto' : 'none',
        transition: 'transform 0.3s ease, opacity 0.3s ease', zIndex: 100,
      }}>
        <div style={{
          background: '#111', color: 'white',
          padding: '12px 20px', borderRadius: '9999px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.24)',
          border: '1px solid #333',
          display: 'flex', alignItems: 'center', gap: '20px',
          minWidth: '320px', justifyContent: 'space-between',
          fontFamily: 'Poppins, sans-serif',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', boxShadow: '0 0 0 4px rgba(59,130,246,0.25)' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Unsaved changes</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handleDiscard} disabled={isSaving}
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              Discard
            </button>
            <button onClick={handleSave} disabled={isSaving}
              style={{
                background: 'white', color: '#111', border: 'none',
                padding: '8px 18px', borderRadius: '9999px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              {isSaving ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
