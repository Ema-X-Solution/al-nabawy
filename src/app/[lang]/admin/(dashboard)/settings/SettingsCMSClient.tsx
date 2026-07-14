'use client'

import React, { useState, useEffect } from 'react'
import type { FooterDocument, SocialLink } from '@/types/footer.types'
import { saveFooterConfig } from '@/app/actions/footerActions'

interface Props { initialConfig: FooterDocument }

const deepEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)

export default function SettingsCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<FooterDocument>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    setHasUnsavedChanges(!deepEqual(config, initialConfig))
  }, [config, initialConfig])

  const patch = (key: keyof FooterDocument, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const patchSocial = (id: string, updates: Partial<SocialLink>) => {
    setConfig(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(item => item.id === id ? { ...item, ...updates } : item),
    }))
  }

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const res = await saveFooterConfig(config)
    setIsSaving(false)
    if (res.success) {
      const { revalidatePublicPath } = await import('@/app/actions/revalidateActions')
      await revalidatePublicPath('/')
      window.location.reload()
    }
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
      
      {/* Brand & Slogan */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Brand Slogan</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Slogan (EN)</label>
            <input style={fieldStyle} value={config.sloganEn} onChange={e => patch('sloganEn', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Slogan (AR)</label>
            <input style={{ ...fieldStyle, direction: 'rtl' }} value={config.sloganAr} onChange={e => patch('sloganAr', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Contact Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Phone 1</label>
            <input style={fieldStyle} value={config.phone1} onChange={e => patch('phone1', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone 2</label>
            <input style={fieldStyle} value={config.phone2} onChange={e => patch('phone2', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp Number</label>
            <input style={fieldStyle} value={config.whatsapp || ''} onChange={e => patch('whatsapp', e.target.value)} placeholder="+20 123 456 789" />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input style={fieldStyle} value={config.email} onChange={e => patch('email', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Address (EN)</label>
            <textarea style={{...fieldStyle, minHeight: 80}} value={config.addressEn} onChange={e => patch('addressEn', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Address (AR)</label>
            <textarea style={{...fieldStyle, minHeight: 80, direction: 'rtl'}} value={config.addressAr} onChange={e => patch('addressAr', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Copyright Text</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Copyright (EN)</label>
            <input style={fieldStyle} value={config.copyrightEn} onChange={e => patch('copyrightEn', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Copyright (AR)</label>
            <input style={{ ...fieldStyle, direction: 'rtl' }} value={config.copyrightAr} onChange={e => patch('copyrightAr', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Social Links</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {config.socialLinks.map(item => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'center', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
              <label style={{ fontWeight: 600, fontSize: '13px' }}>{item.platform}</label>
              <input style={fieldStyle} value={item.url} onChange={e => patchSocial(item.id, { url: e.target.value })} placeholder={`https://...`} />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Save */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: `translateX(-50%) translateY(${hasUnsavedChanges ? '0' : '80px'})`,
        opacity: hasUnsavedChanges ? 1 : 0, pointerEvents: hasUnsavedChanges ? 'auto' : 'none', transition: 'all 0.3s', zIndex: 100
      }}>
        <div style={{ background: '#111', color: 'white', padding: '12px 20px', borderRadius: '9999px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Unsaved changes</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setConfig(initialConfig)} disabled={isSaving} style={{ background: 'transparent', color: '#9ca3af', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Discard</button>
            <button onClick={handleSave} disabled={isSaving} style={{ background: 'white', color: '#111', padding: '8px 18px', borderRadius: '9999px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
