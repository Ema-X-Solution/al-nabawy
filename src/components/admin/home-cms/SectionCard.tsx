'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { HomeSectionMeta, HomeSectionId } from '@/types/home.types'
import { Icons } from '@/lib/icons'

interface SectionCardProps {
  meta: HomeSectionMeta
  children: React.ReactNode
  onToggleEnabled: (id: HomeSectionId, enabled: boolean) => void
}

const SECTION_META: Record<HomeSectionId, { label: string; icon: React.ReactNode; color: string; isRef?: boolean }> = {
  hero:           { label: 'Hero Banner',        icon: <Icons.ImageIcon size={18} />,  color: '#3b82f6' },
  overview:       { label: 'Company Overview',   icon: <Icons.Building2 size={18} />,  color: '#8b5cf6' },
  categories:     { label: 'Categories',         icon: <Icons.FolderOpen size={18} />,  color: '#0ea5e9', isRef: true },
  whyUs:          { label: 'Why Choose Us',      icon: <Icons.Star size={18} />,  color: '#f59e0b' },
  facility:       { label: 'Production Facility',icon: <Icons.Factory size={18} />,  color: '#10b981' },
  certifications: { label: 'Certifications',     icon: <Icons.Trophy size={18} />,  color: '#d97706', isRef: true },
  exportMarkets:  { label: 'Export Markets',     icon: <Icons.Globe size={18} />,  color: '#059669', isRef: true },
  catalog:        { label: 'Catalog Download',   icon: <Icons.FileText size={18} />,  color: '#6366f1' },
  cta:            { label: 'Final CTA',          icon: <Icons.Target size={18} />,  color: '#ef4444' },
}

export default function SectionCard({ meta, children, onToggleEnabled }: SectionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: meta.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: 'relative' as const,
  }

  const m = SECTION_META[meta.id]

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'white',
        borderRadius: '12px',
        border: isDragging ? '2px solid #169DF7' : '1px solid #e5e7eb',
        boxShadow: isDragging
          ? '0 20px 60px rgba(22,157,247,0.2)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        marginBottom: '10px',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* ── Collapsed Header ─────────────────────── */}
      <div
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('[data-drag]') || (e.target as HTMLElement).closest('[data-toggle]')) return
          setExpanded(!expanded)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 20px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Drag handle */}
        <button
          data-drag
          {...attributes}
          {...listeners}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 6px',
            cursor: 'grab',
            color: '#d1d5db',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/>
            <circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
          </svg>
        </button>

        {/* Status dot button */}
        <button
          data-toggle
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleEnabled(meta.id, !meta.enabled)
          }}
          title={meta.enabled ? "Disable section" : "Enable section"}
          style={{
            width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
            background: meta.enabled ? '#22c55e' : '#d1d5db',
            boxShadow: meta.enabled ? '0 0 0 3px rgba(34,197,94,0.2)' : 'none',
            border: 'none', cursor: 'pointer', padding: 0
          }}
        />

        {/* Icon badge */}
        <div style={{
          width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
          background: `${m.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: m.color
        }}>
          {m.icon}
        </div>

        {/* Title + desc */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: 'Poppins, sans-serif' }}>
              {m.label}
            </span>
            {m.isRef && (
              <span style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                color: '#7c3aed', background: '#f5f3ff',
                border: '1px solid #ddd6fe', borderRadius: '4px',
                padding: '1px 6px', textTransform: 'uppercase',
              }}>
                REF
              </span>
            )}
            {!meta.enabled && (
              <span style={{
                fontSize: '10px', fontWeight: 600,
                color: '#9ca3af', background: '#f9fafb',
                border: '1px solid #e5e7eb', borderRadius: '4px',
                padding: '1px 6px',
              }}>
                Hidden
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', fontFamily: 'Poppins, sans-serif' }}>
            Order #{meta.order + 1}
          </div>
        </div>

        {/* Expand arrow */}
        <div style={{
          width: 28, height: 28, borderRadius: '6px', flexShrink: 0,
          background: expanded ? '#eff8ff' : '#f9fafb',
          border: `1px solid ${expanded ? '#bae0fd' : '#e5e7eb'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: expanded ? '#169DF7' : '#9ca3af',
          transition: 'all 0.2s ease',
        }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* ── Expanded Editor Body ──────────────────── */}
      {expanded && (
        <div style={{
          borderTop: '1px solid #f3f4f6',
          background: '#ffffff',
          padding: '32px 36px',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}
