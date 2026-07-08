// Trigger Next.js recompile
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/dictionaries'
import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { getContactConfig } from '@/app/actions/contactActions'
import { Icons } from '@/lib/icons'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return { title: dict.contact.heroTitle }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const locale = lang as Locale
  const dict = await getDictionary(locale)
  const t = dict.contact

  const config = await getContactConfig()

  const contactItems = [
    { icon: <Icons.MapPin size={22} color="#169DF7" />, label: config.labelCountry[locale] || 'Address', value: config.address },
    { icon: <Icons.Phone size={22} color="#169DF7" />, label: config.labelPhone[locale] || 'Phone', value: config.phone },
    { icon: <Icons.MessageCircle size={22} color="#169DF7" />, label: 'WhatsApp', value: config.whatsapp },
    { icon: <Icons.Mail size={22} color="#169DF7" />, label: config.labelEmail[locale] || 'Email', value: config.email },
    { icon: <Icons.Info size={22} color="#169DF7" />, label: config.hours[locale], value: config.hoursValue[locale] },
  ]

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#169DF7,#0d6fb8)', padding: '8rem 1.5rem 5rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, margin: '0 0 0.5rem', fontFamily: locale === 'ar' ? 'Cairo,sans-serif' : 'Poppins,sans-serif' }}>
          {config.heroTitle[locale]}
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>{config.heroSub[locale]}</p>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '3rem', alignItems: 'flex-start' }}>
            {/* Form */}
            <ContactForm lang={locale} config={config} tSystem={{ success: t.success, error: t.error, submitting: t.submitting }} productOptions={dict.categories.items} />

            {/* Contact Info */}
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1F2937', marginBottom: '1.5rem' }}>
                {config.infoTitle[locale]}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {contactItems.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      background: 'white',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      boxShadow: '0 2px 12px rgba(22,157,247,0.08)',
                      border: '1px solid rgba(22,157,247,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', minWidth: 36 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#169DF7', marginBottom: '0.2rem' }}>
                        {item.label}
                      </div>
                      <div style={{ color: '#374151', fontSize: '0.9rem' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp quick button */}
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: '#25D366',
                  color: 'white',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginBottom: '1.5rem',
                  transition: 'all 0.3s ease',
                }}
                id="contact-whatsapp-link"
              >
                <Icons.MessageCircle size={22} /> WhatsApp: {t.whatsapp}
              </a>

              {/* Map */}
              <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(22,157,247,0.1)' }}>
                <iframe
                  src={config.mapEmbedUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Al-Nabawy Factory Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
