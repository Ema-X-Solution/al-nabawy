'use client'

export interface DataTableColumn<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyField: keyof T
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = 'No items found.',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{
            height: 52, borderRadius: '0.5rem',
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
        ))}
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: '0.875rem' }}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '0.75rem 1rem', textAlign: 'start',
                  fontWeight: 600, color: '#6b7280', fontSize: '0.78rem',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  width: col.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String(row[keyField])}
              style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.12s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#fafcff')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = 'transparent')}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '0.875rem 1rem', color: '#374151', verticalAlign: 'middle' }}>
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
