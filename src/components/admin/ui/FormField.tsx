import React from 'react'

interface Props {
  label: string
  required?: boolean
  children: React.ReactNode
}

export default function FormField({ label, required, children }: Props) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        fontWeight: 700, 
        color: '#374151', 
        marginBottom: '8px', 
        textTransform: 'uppercase' 
      }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  )
}
