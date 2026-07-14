'use client'

import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import type {
  HomeDocument,
  HomeSectionId,
  HomeLocale,
  HomeLocalizedString,
  HomeImageAsset
} from '@/types/home.types'
import { saveHomeConfig } from '@/app/actions/homeActions'
import SectionCard from '@/components/admin/home-cms/SectionCard'
import MediaPicker from '@/components/admin/MediaPicker'

interface Props {
  initialConfig: HomeDocument
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const LANGS: { key: HomeLocale; label: string; full: string }[] = [
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
const deepEqual = (a: any, b: any): boolean => JSON.stringify(a) === JSON.stringify(b)

// ─── Language Tab Bar ────────────────────────────────────────────────────────
function LangTabs({ lang, setLang }: { lang: HomeLocale; setLang: (l: HomeLocale) => void }) {
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

function Field({
  label, value, onChange, placeholder, multiline = false, dir, type = 'text',
}: {
  label: string; value: string | number; onChange: (v: string) => void
  placeholder?: string; multiline?: boolean; dir?: string; type?: string
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
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder} style={fs} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
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
export default function HomeCMSClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<HomeDocument>(initialConfig)
  const [lang, setLang] = useState<HomeLocale>('en')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Derive sortable array from sectionMeta dict
  const metaArray = Object.values(config.sectionMeta).sort((a, b) => a.order - b.order)

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
      return next as HomeDocument
    })
  }

  const patchLoc = (path: string, val: string) => {
    const keys = path.split('.')
    let cur: any = config
    for (const k of keys) cur = cur[k]
    const updated = { ...cur as HomeLocalizedString, [lang]: val }
    patch(path, updated)
  }

  const getLoc = (path: string): string => {
    const keys = path.split('.')
    let cur: any = config
    for (const k of keys) cur = cur?.[k]
    return (cur as HomeLocalizedString)?.[lang] || ''
  }

  const handleToggleEnabled = (id: HomeSectionId, enabled: boolean) => {
    patch(`sectionMeta.${id}.enabled`, enabled)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = metaArray.findIndex((i) => i.id === active.id)
      const newIndex = metaArray.findIndex((i) => i.id === over.id)
      const newArray = arrayMove(metaArray, oldIndex, newIndex)
      
      const newMetaMap = { ...config.sectionMeta }
      newArray.forEach((item, index) => {
        newMetaMap[item.id] = { ...item, order: index }
      })
      patch('sectionMeta', newMetaMap)
    }
  }

  const handleDiscard = () => setConfig(initialConfig)

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const res = await saveHomeConfig(config)
    setIsSaving(false)
    if (res.success) {
      const { revalidatePublicPath } = await import('@/app/actions/revalidateActions')
      await revalidatePublicPath('/')
      window.location.reload()
    }
    else alert(res.error || 'Failed to save.')
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  // --- Render Editors for each section type ---
  const renderHero = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Brand Badge" value={getLoc('hero.badge')} onChange={v => patchLoc('hero.badge', v)} />
        <Field label="Headline" value={getLoc('hero.headline')} onChange={v => patchLoc('hero.headline', v)} />
      </Grid2>
      <Grid2>
        <Field label="Headline Highlight (Blue text)" value={getLoc('hero.headlineSub')} onChange={v => patchLoc('hero.headlineSub', v)} />
        <Field label="Subheadline" value={getLoc('hero.subheadline')} onChange={v => patchLoc('hero.subheadline', v)} multiline />
      </Grid2>
      <Grid2>
        <Field label="Primary Button" value={getLoc('hero.cta1')} onChange={v => patchLoc('hero.cta1', v)} />
        <Field label="Secondary Button" value={getLoc('hero.cta2')} onChange={v => patchLoc('hero.cta2', v)} />
      </Grid2>
      <div>
        <label style={labelStyle}>Background Image</label>
        <div style={{ padding: '12px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px' }}>
          {config.hero.bgImage?.secure_url && (
            <img src={config.hero.bgImage.secure_url} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
          )}
          <MediaPicker value={config.hero.bgImage as any} folder="home" onChange={(asset) => patch('hero.bgImage', asset ? { ...asset } as HomeImageAsset : undefined)} />
        </div>
      </div>
    </div>
  )

  const renderOverview = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Section Label" value={getLoc('overview.label')} onChange={v => patchLoc('overview.label', v)} />
        <Field label="Section Title" value={getLoc('overview.title')} onChange={v => patchLoc('overview.title', v)} />
      </Grid2>
      <Field label="Body Description" value={getLoc('overview.body')} onChange={v => patchLoc('overview.body', v)} multiline />
      <Grid2>
        <Field label="Stats Label (Years)" value={getLoc('overview.statsYears')} onChange={v => patchLoc('overview.statsYears', v)} />
        <Field label="Stats Label (Products)" value={getLoc('overview.statsProducts')} onChange={v => patchLoc('overview.statsProducts', v)} />
      </Grid2>
      <Grid2>
        <Field label="Stats Label (Countries)" value={getLoc('overview.statsCountries')} onChange={v => patchLoc('overview.statsCountries', v)} />
        <Field label="Read More Button" value={getLoc('overview.readMore')} onChange={v => patchLoc('overview.readMore', v)} />
      </Grid2>
      <div>
        <label style={labelStyle}>Overview Image</label>
        <div style={{ padding: '12px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px' }}>
          {config.overview.image?.secure_url && (
            <img src={config.overview.image.secure_url} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
          )}
          <MediaPicker value={config.overview.image as any} folder="home" onChange={(asset) => patch('overview.image', asset ? { ...asset } as HomeImageAsset : undefined)} />
        </div>
      </div>
    </div>
  )

  const renderCategories = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Section Label" value={getLoc('categories.label')} onChange={v => patchLoc('categories.label', v)} />
        <Field label="Section Title" value={getLoc('categories.title')} onChange={v => patchLoc('categories.title', v)} />
      </Grid2>
      <Grid2>
        <Field label="Subtitle" value={getLoc('categories.subtitle')} onChange={v => patchLoc('categories.subtitle', v)} />
        <Field label="View Details Button" value={getLoc('categories.viewDetails')} onChange={v => patchLoc('categories.viewDetails', v)} />
      </Grid2>
      <p style={{ fontSize: '12px', color: '#6b7280' }}>* The actual category cards are managed globally in the Categories Module.</p>
    </div>
  )

  const renderWhyUs = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Section Label" value={getLoc('whyUs.label')} onChange={v => patchLoc('whyUs.label', v)} />
        <Field label="Section Title" value={getLoc('whyUs.title')} onChange={v => patchLoc('whyUs.title', v)} />
      </Grid2>
      <Field label="Subtitle" value={getLoc('whyUs.subtitle')} onChange={v => patchLoc('whyUs.subtitle', v)} />
      <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Feature: 100% Natural</h4>
        <Grid2>
          <Field label="Title" value={getLoc('whyUs.natural.title')} onChange={v => patchLoc('whyUs.natural.title', v)} />
          <Field label="Description" value={getLoc('whyUs.natural.desc')} onChange={v => patchLoc('whyUs.natural.desc', v)} />
        </Grid2>
      </div>
      <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Feature: International Quality</h4>
        <Grid2>
          <Field label="Title" value={getLoc('whyUs.quality.title')} onChange={v => patchLoc('whyUs.quality.title', v)} />
          <Field label="Description" value={getLoc('whyUs.quality.desc')} onChange={v => patchLoc('whyUs.quality.desc', v)} />
        </Grid2>
      </div>
      <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Feature: Expert Team</h4>
        <Grid2>
          <Field label="Title" value={getLoc('whyUs.expert.title')} onChange={v => patchLoc('whyUs.expert.title', v)} />
          <Field label="Description" value={getLoc('whyUs.expert.desc')} onChange={v => patchLoc('whyUs.expert.desc', v)} />
        </Grid2>
      </div>
      <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Feature: Global Export</h4>
        <Grid2>
          <Field label="Title" value={getLoc('whyUs.global.title')} onChange={v => patchLoc('whyUs.global.title', v)} />
          <Field label="Description" value={getLoc('whyUs.global.desc')} onChange={v => patchLoc('whyUs.global.desc', v)} />
        </Grid2>
      </div>
    </div>
  )

  const renderFacility = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Section Label" value={getLoc('facility.label')} onChange={v => patchLoc('facility.label', v)} />
        <Field label="Section Title" value={getLoc('facility.title')} onChange={v => patchLoc('facility.title', v)} />
      </Grid2>
      <Grid2>
        <Field label="Subtitle" value={getLoc('facility.subtitle')} onChange={v => patchLoc('facility.subtitle', v)} />
        <Field label="View Gallery Button" value={getLoc('facility.viewGallery')} onChange={v => patchLoc('facility.viewGallery', v)} />
      </Grid2>
      <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Feature Chips</h4>
        <Grid2>
          <Field label="Chip 1 (Modern Lines)" value={getLoc('facility.chip1')} onChange={v => patchLoc('facility.chip1', v)} />
          <Field label="Chip 2 (QC Lab)" value={getLoc('facility.chip2')} onChange={v => patchLoc('facility.chip2', v)} />
        </Grid2>
        <Grid2>
          <Field label="Chip 3 (Packaging)" value={getLoc('facility.chip3')} onChange={v => patchLoc('facility.chip3', v)} />
          <Field label="Chip 4 (Cold Chain)" value={getLoc('facility.chip4')} onChange={v => patchLoc('facility.chip4', v)} />
        </Grid2>
      </div>
      <div>
        <label style={labelStyle}>Facility Image</label>
        <div style={{ padding: '12px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px' }}>
          {config.facility.image?.secure_url && (
            <img src={config.facility.image.secure_url} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
          )}
          <MediaPicker value={config.facility.image as any} folder="home" onChange={(asset) => patch('facility.image', asset ? { ...asset } as HomeImageAsset : undefined)} />
        </div>
      </div>
    </div>
  )

  const renderCertifications = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Section Label" value={getLoc('certifications.label')} onChange={v => patchLoc('certifications.label', v)} />
        <Field label="Section Title" value={getLoc('certifications.title')} onChange={v => patchLoc('certifications.title', v)} />
      </Grid2>
      <Field label="Subtitle" value={getLoc('certifications.subtitle')} onChange={v => patchLoc('certifications.subtitle', v)} />
      <div dir="ltr">
        <Field type="number" label="Max Certs to Display" value={config.certifications.maxItems} onChange={v => patch('certifications.maxItems', Number(v) || 4)} />
      </div>
      <p style={{ fontSize: '12px', color: '#6b7280' }}>* The actual certificates are managed in the Certifications Module.</p>
    </div>
  )

  const renderExport = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Section Label" value={getLoc('exportMarkets.label')} onChange={v => patchLoc('exportMarkets.label', v)} />
        <Field label="Section Title" value={getLoc('exportMarkets.title')} onChange={v => patchLoc('exportMarkets.title', v)} />
      </Grid2>
      <Grid2>
        <Field label="Subtitle" value={getLoc('exportMarkets.subtitle')} onChange={v => patchLoc('exportMarkets.subtitle', v)} />
        <Field label="View All Button" value={getLoc('exportMarkets.viewAll')} onChange={v => patchLoc('exportMarkets.viewAll', v)} />
      </Grid2>
      <div style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', background: '#f9fafb' }}>
        <h4 style={{ marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Region Labels</h4>
        <Grid2>
          <Field label="Region 1 (Middle East)" value={getLoc('exportMarkets.region1')} onChange={v => patchLoc('exportMarkets.region1', v)} />
          <Field label="Region 2 (Europe)" value={getLoc('exportMarkets.region2')} onChange={v => patchLoc('exportMarkets.region2', v)} />
        </Grid2>
        <Grid2>
          <Field label="Region 3 (Africa)" value={getLoc('exportMarkets.region3')} onChange={v => patchLoc('exportMarkets.region3', v)} />
          <div dir="ltr">
            <Field type="number" label="Max Countries Displayed per Region" value={config.exportMarkets.maxItems} onChange={v => patch('exportMarkets.maxItems', Number(v) || 12)} />
          </div>
        </Grid2>
      </div>
      <p style={{ fontSize: '12px', color: '#6b7280' }}>* The actual countries list is managed in the Export Markets Module.</p>
    </div>
  )

  const renderCatalog = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Section Label" value={getLoc('catalog.label')} onChange={v => patchLoc('catalog.label', v)} />
        <Field label="Section Title" value={getLoc('catalog.title')} onChange={v => patchLoc('catalog.title', v)} />
      </Grid2>
      <Field label="Subtitle" value={getLoc('catalog.subtitle')} onChange={v => patchLoc('catalog.subtitle', v)} multiline />
      <Grid2>
        <Field label="Download Button" value={getLoc('catalog.download')} onChange={v => patchLoc('catalog.download', v)} />
        <Field label="Request Custom Button" value={getLoc('catalog.requestCustom')} onChange={v => patchLoc('catalog.requestCustom', v)} />
      </Grid2>
      <div>
        <label style={labelStyle}>Catalog Document (PDF)</label>
        <div style={{ padding: '12px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px' }}>
          <MediaPicker
            value={config.catalog.file as any}
            folder="home"
            accept="document"
            onChange={(asset) => patch('catalog.file', asset ? { ...asset } as HomeImageAsset : undefined)}
          />
        </div>
      </div>
    </div>
  )

  const renderCTA = () => (
    <div dir={dir} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LangTabs lang={lang} setLang={setLang} />
      <Grid2>
        <Field label="Main Title" value={getLoc('cta.title')} onChange={v => patchLoc('cta.title', v)} />
        <Field label="Subtitle" value={getLoc('cta.subtitle')} onChange={v => patchLoc('cta.subtitle', v)} />
      </Grid2>
      <Grid2>
        <Field label="Primary Button" value={getLoc('cta.quote')} onChange={v => patchLoc('cta.quote', v)} />
        <Field label="Secondary Button" value={getLoc('cta.contact')} onChange={v => patchLoc('cta.contact', v)} />
      </Grid2>
      <div>
        <label style={labelStyle}>Background Image</label>
        <div style={{ padding: '12px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px' }}>
          {config.cta.bgImage?.secure_url && (
            <img src={config.cta.bgImage.secure_url} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
          )}
          <MediaPicker value={config.cta.bgImage as any} folder="home" onChange={(asset) => patch('cta.bgImage', asset ? { ...asset } as HomeImageAsset : undefined)} />
        </div>
      </div>
    </div>
  )

  const RENDERERS: Record<HomeSectionId, () => React.ReactNode> = {
    hero: renderHero,
    overview: renderOverview,
    categories: renderCategories,
    whyUs: renderWhyUs,
    facility: renderFacility,
    certifications: renderCertifications,
    exportMarkets: renderExport,
    catalog: renderCatalog,
    cta: renderCTA,
  }

  return (
    <div className="max-w-4xl mx-auto pb-48 pt-4">
      {/* Page Header */}
      <div className="mb-10 px-2">
        <h2 className="text-[28px] font-semibold tracking-tight text-gray-900 font-sans">Home Page Elements</h2>
        <p className="text-[15px] text-gray-500 mt-1 max-w-2xl">
          Manage the content of your landing page sections. Drag the cards to reorder them on the public storefront. Changes apply instantly after saving.
        </p>
      </div>

      {/* DND Context */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-3">
          <SortableContext 
            items={metaArray.map(m => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {metaArray.map((meta) => (
              <SectionCard
                key={meta.id}
                meta={meta}
                onToggleEnabled={handleToggleEnabled}
              >
                {RENDERERS[meta.id]()}
              </SectionCard>
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* Vercel-style Floating Save Banner */}
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
