'use client'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder = 'Search…' }: SearchInputProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"
        style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none', flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: '2.25rem',
          paddingRight: '0.875rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.6rem',
          fontSize: '0.84rem',
          color: '#374151',
          background: 'white',
          outline: 'none',
          width: 240,
          transition: 'border-color 0.18s, box-shadow 0.18s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#169DF7'
          e.target.style.boxShadow = '0 0 0 3px rgba(22,157,247,0.12)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e5e7eb'
          e.target.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}
