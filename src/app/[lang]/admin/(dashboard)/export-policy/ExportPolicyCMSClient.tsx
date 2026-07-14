'use client'

import React, { useState, useEffect } from 'react'
import type { ExportPolicyDocument, ExportPolicySection } from '@/types/exportPolicy.types'
import { emptyLocStr } from '@/types/exportPolicy.types'
import { saveExportPolicyConfig } from '@/app/actions/exportPolicyActions'

const LANGUAGES = ['en', 'ar', 'fr', 'de', 'tr', 'pl'] as const
type Lang = typeof LANGUAGES[number]

interface Props {
  initialConfig: ExportPolicyDocument
}

export default function ExportPolicyCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<ExportPolicyDocument>(initialConfig)
  const [activeLang, setActiveLang] = useState<Lang>('ar')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Sync initial config if changed
  useEffect(() => {
    setConfig(initialConfig)
  }, [initialConfig])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await saveExportPolicyConfig(config)
      if (res.success) {
        setSaveMsg('Saved successfully!')
        const { revalidatePublicPath } = await import('@/app/actions/revalidateActions')
        await revalidatePublicPath('/')
      } else {
        setSaveMsg(`Error: ${res.error}`)
      }
    } catch (err: any) {
      setSaveMsg(`Error: ${err.message}`)
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  const addSection = () => {
    const newSection: ExportPolicySection = {
      id: `sec_${Date.now()}`,
      title: emptyLocStr(),
      content: emptyLocStr()
    }
    setConfig(prev => ({ ...prev, sections: [...prev.sections, newSection] }))
  }

  const removeSection = (id: string) => {
    setConfig(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }))
  }

  const updateSectionTitle = (id: string, val: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, title: { ...s.title, [activeLang]: val } } : s)
    }))
  }

  const updateSectionContent = (id: string, val: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, content: { ...s.content, [activeLang]: val } } : s)
    }))
  }

  // Helper styles
  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    marginBottom: '1.5rem'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '0.5rem'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      
      {/* Top Bar (Language tabs & Save) */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'white', padding: '1rem 1.5rem', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {LANGUAGES.map(l => (
            <button
              key={l}
              onClick={() => setActiveLang(l)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: activeLang === l ? '#169DF7' : '#f1f5f9',
                color: activeLang === l ? 'white' : '#475569',
                fontWeight: activeLang === l ? 600 : 400,
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontSize: '0.85rem'
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {saveMsg && (
            <span style={{ fontSize: '0.875rem', color: saveMsg.includes('Error') ? '#ef4444' : '#10b981' }}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: saving ? '#94a3b8' : '#10b981',
              color: 'white',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Page Header Strings */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Page Header</h2>
        
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Page Title ({activeLang})</label>
          <input
            style={inputStyle}
            value={config.pageTitle[activeLang]}
            onChange={e => setConfig(p => ({ ...p, pageTitle: { ...p.pageTitle, [activeLang]: e.target.value } }))}
          />
        </div>

        <div>
          <label style={labelStyle}>Page Description ({activeLang})</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            value={config.pageDescription[activeLang]}
            onChange={e => setConfig(p => ({ ...p, pageDescription: { ...p.pageDescription, [activeLang]: e.target.value } }))}
          />
        </div>
      </div>

      {/* Sections List */}
      <div style={{ ...cardStyle, background: 'transparent', boxShadow: 'none', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Policy Sections</h2>
          <button
            onClick={addSection}
            style={{
              padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
              background: '#169DF7', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            + Add Section
          </button>
        </div>

        {config.sections.map((section, idx) => (
          <div key={section.id} style={{ ...cardStyle, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
              <button
                onClick={() => removeSection(section.id)}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none',
                  background: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
            
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: '#334155' }}>
              Section {idx + 1}
            </h3>

            <div style={{ marginBottom: '1.25rem', paddingRight: '5rem' }}>
              <label style={labelStyle}>Title ({activeLang})</label>
              <input
                style={inputStyle}
                value={section.title[activeLang]}
                onChange={e => updateSectionTitle(section.id, e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Content ({activeLang})</label>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.6 }}
                value={section.content[activeLang]}
                onChange={e => updateSectionContent(section.id, e.target.value)}
                placeholder="Paragraph text..."
              />
            </div>
          </div>
        ))}

        {config.sections.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
            <p style={{ color: '#64748b' }}>No sections added yet.</p>
          </div>
        )}
      </div>

    </div>
  )
}
