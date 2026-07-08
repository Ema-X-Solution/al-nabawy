export type LocalizedString = Record<'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr', string>

export const emptyLocStr = (): LocalizedString => ({ en: '', ar: '', fr: '', de: '', tr: '', pl: '' })

export interface CertificationItem {
  id: string
  title: LocalizedString
  desc: LocalizedString
  color: string
  // Primary: certificate image (required in CMS)
  image: string
  // Issue / expiry
  issueDate?: string
  validUntil?: string
  // Optional extras
  certNumber?: string
  order: number
  status: 'published' | 'draft'
}

export interface CertificationsDocument {
  heroTitle: LocalizedString
  heroSub: LocalizedString
  items: CertificationItem[]
}
