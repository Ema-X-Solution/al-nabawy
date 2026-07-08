import { getDictionary, type Locale } from '@/dictionaries'
import { getExportPolicyConfig } from '@/app/actions/exportPolicyActions'
import { createDefaultExportPolicyDocument } from '@/types/exportPolicy.types'


export default async function ExportPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)
  const isAr = lang === 'ar'

  const dbConfig = await getExportPolicyConfig()
  const config = dbConfig || createDefaultExportPolicyDocument()

  const title = config.pageTitle[lang as Locale] || config.pageTitle.en
  const desc = config.pageDescription[lang as Locale] || config.pageDescription.en

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem' }}>
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '8rem 1.5rem 5rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: lang === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {title}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{desc}</p>
      </section>

      <div className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          padding: '3rem 2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {config.sections.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b' }}>No policies defined.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {config.sections.map((section, idx) => {
                const secTitle = section.title[lang as Locale] || section.title.en
                const secContent = section.content[lang as Locale] || section.content.en
                
                return (
                  <section key={section.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      borderRadius: '12px',
                      background: 'rgba(22, 157, 247, 0.1)',
                      color: '#169DF7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.25rem'
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                        {secTitle}
                      </h2>
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        color: '#475569',
                        whiteSpace: 'pre-line'
                      }}>
                        {secContent}
                      </p>
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
