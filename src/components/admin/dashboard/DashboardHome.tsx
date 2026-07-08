'use client'

import { useEffect, useState } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth/authContext'
import StatCard from '@/components/admin/ui/StatCard'
import PageHeader from '@/components/admin/ui/PageHeader'
import PageContainer from '@/components/admin/ui/PageContainer'
import SectionCard from '@/components/admin/ui/SectionCard'
import type { Locale } from '@/dictionaries'
import { Icons } from '@/lib/icons'

interface Props {
  lang: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>
}

interface Stats {
  products: number
  categories: number
  contactRequests: number
  media: number
  certifications: number
}

async function fetchCounts(): Promise<Stats> {
  const [products, categories, contactRequests, media, certifications] = await Promise.all([
    getCountFromServer(collection(db, 'products')),
    getCountFromServer(collection(db, 'categories')),
    getCountFromServer(collection(db, 'contact_requests')),
    getCountFromServer(collection(db, 'media_assets')),
    getCountFromServer(collection(db, 'certifications')),
  ])
  return {
    products: products.data().count,
    categories: categories.data().count,
    contactRequests: contactRequests.data().count,
    media: media.data().count,
    certifications: certifications.data().count,
  }
}

export default function DashboardHome({ lang, t }: Props) {
  const { user } = useAuth()
  const dt = t?.dashboard ?? {}
  const navT = t?.nav ?? {}
  const base = `/${lang}/admin`

  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCounts()
      .then(setStats)
      .catch(() => setStats({ products: 0, categories: 0, contactRequests: 0, media: 0, certifications: 0 }))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    {
      title: dt.totalProducts,
      value: stats?.products ?? 0,
      icon: <Icons.ShoppingBag size={24} color="#169DF7" />,
      color: '#169DF7',
      href: `${base}/products`,
      linkLabel: dt.manage,
    },
    {
      title: dt.categories,
      value: stats?.categories ?? 0,
      icon: <Icons.FolderOpen size={24} color="#8b5cf6" />,
      color: '#8b5cf6',
      href: `${base}/categories`,
      linkLabel: dt.manage,
    },
    {
      title: dt.contactRequests,
      value: stats?.contactRequests ?? 0,
      icon: <Icons.MessageSquare size={24} color="#f59e0b" />,
      color: '#f59e0b',
      href: `${base}/inbox`,
      linkLabel: dt.viewAll,
    },
    {
      title: dt.mediaAssets,
      value: stats?.media ?? 0,
      icon: <Icons.ImageIcon size={24} color="#10b981" />,
      color: '#10b981',
      href: `${base}/media`,
      linkLabel: dt.manage,
    },
    {
      title: dt.certifications,
      value: stats?.certifications ?? 0,
      icon: <Icons.Award size={24} color="#ef4444" />,
      color: '#ef4444',
      href: `${base}/certifications`,
      linkLabel: dt.manage,
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title={`${dt.welcome}, ${user?.displayName?.split(' ')[0] ?? ''}!`}
        subtitle={new Date().toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      />

      {/* Stat grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} loading={loading} />
        ))}
      </div>

      {/* Quick navigation */}
      <SectionCard title="Quick Access" subtitle="Jump to any module">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.75rem',
        }}>
            {[
              { label: navT.home, href: `${base}/home`, icon: <Icons.Home size={28} strokeWidth={1.5} /> },
              { label: navT.about, href: `${base}/about`, icon: <Icons.Info size={28} strokeWidth={1.5} /> },
              { label: navT.products, href: `${base}/products`, icon: <Icons.ShoppingBag size={28} strokeWidth={1.5} /> },
              { label: navT.gallery, href: `${base}/gallery`, icon: <Icons.ImageIcon size={28} strokeWidth={1.5} /> },
              { label: navT.certifications, href: `${base}/certifications`, icon: <Icons.Award size={28} strokeWidth={1.5} /> },
              { label: navT.exportMarkets, href: `${base}/export-markets`, icon: <Icons.Globe size={28} strokeWidth={1.5} /> },
              { label: navT.contactRequests, href: `${base}/inbox`, icon: <Icons.MessageSquare size={28} strokeWidth={1.5} /> },
              { label: navT.mediaLibrary, href: `${base}/media`, icon: <Icons.FolderOpen size={28} strokeWidth={1.5} /> },
            ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem',
                padding: '1.25rem 0.75rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #f1f5f9',
                textDecoration: 'none',
                color: '#374151',
                fontSize: '0.82rem',
                fontWeight: 500,
                transition: 'all 0.18s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(22,157,247,0.06)'
                el.style.borderColor = 'rgba(22,157,247,0.2)'
                el.style.color = '#169DF7'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#f8fafc'
                el.style.borderColor = '#f1f5f9'
                el.style.color = '#374151'
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center' }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  )
}
