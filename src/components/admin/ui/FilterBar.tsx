'use client'

interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  filters: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export default function FilterBar({ filters, value, onChange }: FilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
      {filters.map((f) => {
        const active = f.value === value
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              border: active ? 'none' : '1px solid #e5e7eb',
              background: active ? '#169DF7' : 'white',
              color: active ? 'white' : '#374151',
              fontSize: '0.8rem',
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
