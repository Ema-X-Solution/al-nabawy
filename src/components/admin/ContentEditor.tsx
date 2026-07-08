'use client'

import React, { useState } from 'react'
import type { LocalizedString } from '@/types/categories.types'

interface Props {
  label: string
  value: LocalizedString
  onChange: (val: LocalizedString) => void
  type?: 'text' | 'textarea'
  required?: boolean
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'tr', label: 'Turkish' },
  { code: 'pl', label: 'Polish' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' }
] as const

export default function ContentEditor({ label, value, onChange, type = 'text', required }: Props) {
  const [activeLang, setActiveLang] = useState<keyof LocalizedString>('en')
  
  const isRtl = activeLang === 'ar'
  
  const safeValue = value || { en: '', ar: '', tr: '', pl: '', de: '', fr: '' }
  
  const updateValue = (newVal: string) => {
    onChange({ ...safeValue, [activeLang]: newVal })
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', 
    padding: '10px 14px', 
    border: '1.5px solid #e5e7eb', 
    borderRadius: '8px',
    fontSize: '14px', 
    fontFamily: 'Poppins, sans-serif', 
    boxSizing: 'border-box',
    direction: isRtl ? 'rtl' : 'ltr'
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151' }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        
        {/* Language Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLang(l.code as any)}
              style={{
                padding: '4px 8px', 
                borderRadius: '6px', 
                fontWeight: 600, 
                fontSize: '11px', 
                cursor: 'pointer', 
                border: 'none',
                background: activeLang === l.code ? 'white' : 'transparent',
                color: activeLang === l.code ? '#169DF7' : '#6b7280',
                boxShadow: activeLang === l.code ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {l.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {type === 'text' ? (
        <input 
          style={fieldStyle} 
          value={safeValue[activeLang] || ''} 
          onChange={e => updateValue(e.target.value)} 
          required={required && activeLang === 'en'} // only require English
        />
      ) : (
        <textarea 
          style={{ ...fieldStyle, minHeight: '100px', resize: 'vertical' }} 
          value={safeValue[activeLang] || ''} 
          onChange={e => updateValue(e.target.value)} 
          required={required && activeLang === 'en'}
        />
      )}
    </div>
  )
}
