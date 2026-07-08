import PageHeader from '@/components/admin/ui/PageHeader'
import PageContainer from '@/components/admin/ui/PageContainer'
import SectionCard from '@/components/admin/ui/SectionCard'
import { Icons } from '@/lib/icons'

interface ComingSoonPageProps {
  title: string
  description?: string
  comingSoonLabel: string
  comingSoonDesc: string
  breadcrumbs?: { label: string; href?: string }[]
}

export default function ComingSoonPage({
  title,
  description,
  comingSoonLabel,
  comingSoonDesc,
  breadcrumbs,
}: ComingSoonPageProps) {
  return (
    <PageContainer>
      <PageHeader title={title} subtitle={description} breadcrumbs={breadcrumbs} />
      <SectionCard>
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(22,157,247,0.15), rgba(22,157,247,0.05))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
            border: '2px dashed rgba(22,157,247,0.3)',
          }}>
            <Icons.HardHat size={40} color="#169DF7" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {comingSoonLabel}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, maxWidth: 400 }}>
            {comingSoonDesc}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(22,157,247,0.08)',
            borderRadius: '9999px',
            fontSize: '0.78rem', fontWeight: 600, color: '#169DF7',
            marginTop: '0.5rem',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#169DF7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            {title}
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      </SectionCard>
    </PageContainer>
  )
}
