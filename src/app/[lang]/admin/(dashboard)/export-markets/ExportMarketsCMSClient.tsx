'use client'

import React, { useState, useEffect } from 'react'
import type { ExportMarketsDocument, ExportCountry } from '@/types/exportMarkets.types'
import { saveExportMarketsConfig } from '@/app/actions/exportMarketsActions'
import ContentEditor from '@/components/admin/ContentEditor'
import { Icons } from '@/lib/icons'
import { emptyLocStr } from '@/types/exportMarkets.types'

interface Props { initialConfig: ExportMarketsDocument }

const deepEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)

export default function ExportMarketsCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<ExportMarketsDocument>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    setHasUnsavedChanges(!deepEqual(config, initialConfig))
  }, [config, initialConfig])

  const patch = (key: keyof ExportMarketsDocument, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const patchCountry = (id: string, updates: Partial<ExportCountry>) => {
    setConfig(prev => ({
      ...prev,
      countries: prev.countries.map(item => item.id === id ? { ...item, ...updates } : item),
    }))
  }

  const removeCountry = (id: string) => {
    setConfig(prev => ({ ...prev, countries: prev.countries.filter(i => i.id !== id) }))
  }

  const addCountry = () => {
    const newItem: ExportCountry = {
      id: `country_${Date.now()}`,
      name: emptyLocStr(),
      flag: '🏳️',
      region: {
        en: 'Middle East',
        ar: 'الشرق الأوسط',
        fr: 'Moyen-Orient',
        de: 'Naher Osten',
        tr: 'Orta Doğu',
        pl: 'Bliski Wschód'
      }
    }
    setConfig(prev => ({ ...prev, countries: [...prev.countries, newItem] }))
  }

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const res = await saveExportMarketsConfig(config)
    setIsSaving(false)
    if (res.success) window.location.reload()
    else alert(res.error || 'Failed to save.')
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px',
    fontSize: '13px', fontFamily: 'Poppins, sans-serif', color: '#111827',
    background: '#fff', boxSizing: 'border-box'
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px' }}>
      
      {/* Hero Banner */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Hero Banner</h2>
        <ContentEditor label="Hero Title" value={config.heroTitle || emptyLocStr()} onChange={val => patch('heroTitle', val)} />
        <ContentEditor label="Hero Subtitle" value={config.heroSub || emptyLocStr()} onChange={val => patch('heroSub', val)} type="textarea" />
      </div>

      {/* Logistics Section */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Logistics Section</h2>
        <ContentEditor label="Logistics Label" value={config.logisticsLabel || emptyLocStr()} onChange={val => patch('logisticsLabel', val)} />
        <ContentEditor label="Logistics Title" value={config.logisticsTitle || emptyLocStr()} onChange={val => patch('logisticsTitle', val)} />
        <ContentEditor label="Logistics Description" value={config.logisticsBody || emptyLocStr()} onChange={val => patch('logisticsBody', val)} type="textarea" />
      </div>

      {/* Countries Section Title */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Countries Header</h2>
        <ContentEditor label="Countries Label" value={config.countriesLabel || emptyLocStr()} onChange={val => patch('countriesLabel', val)} />
        <ContentEditor label="Countries Title" value={config.countriesTitle || emptyLocStr()} onChange={val => patch('countriesTitle', val)} />
      </div>

      {/* Countries List */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Countries</h2>
          <button onClick={addCountry} style={{ background: '#169DF7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Add Country</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {config.countries?.map((item, index) => (
            <div key={item.id} style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: 600, color: '#374151' }}>Country #{index + 1}</span>
                <button onClick={() => removeCountry(item.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Trash2 size={16} /> Remove</button>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Flag Emoji</label>
                <input style={{...fieldStyle, width: '80px', textAlign: 'center', fontSize: '20px'}} value={item.flag} onChange={e => patchCountry(item.id, { flag: e.target.value })} title="Emoji Flag" />
              </div>
              <ContentEditor label="Country Name" value={item.name || emptyLocStr()} onChange={val => patchCountry(item.id, { name: val })} />
              <ContentEditor label="Region" value={item.region || emptyLocStr()} onChange={val => patchCountry(item.id, { region: val })} />
            </div>
          ))}
          {(!config.countries || config.countries.length === 0) && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No countries added yet. Click "+ Add Country" to begin.
            </div>
          )}
        </div>
      </div>

      {/* Floating Save */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: `translateX(-50%) translateY(${hasUnsavedChanges ? '0' : '80px'})`,
        opacity: hasUnsavedChanges ? 1 : 0, pointerEvents: hasUnsavedChanges ? 'auto' : 'none', transition: 'all 0.3s', zIndex: 100
      }}>
        <div style={{ background: '#111', color: 'white', padding: '12px 20px', borderRadius: '9999px', display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Unsaved changes</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setConfig(initialConfig)} disabled={isSaving} style={{ background: 'transparent', color: '#9ca3af', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Discard</button>
            <button onClick={handleSave} disabled={isSaving} style={{ background: 'white', color: '#111', padding: '8px 18px', borderRadius: '9999px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              {isSaving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
