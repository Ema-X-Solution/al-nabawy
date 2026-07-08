import React from 'react'
import { Icons } from '@/lib/icons'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon = <Icons.Inbox size={56} color="#d1d5db" />, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1F2937', margin: 0 }}>{title}</h3>
      {description && (
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, maxWidth: 380 }}>{description}</p>
      )}
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  )
}
