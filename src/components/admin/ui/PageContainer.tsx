interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: string
}

export default function PageContainer({ children, maxWidth = '1200px' }: PageContainerProps) {
  return (
    <div style={{ maxWidth, margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  )
}
