export type LocalizedString = Record<'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr', string>

export interface ProductDocument {
  id: string
  slug: string
  category: string
  image: string
  status: 'published' | 'draft'
  featured: boolean

  // Localized Content
  name: LocalizedString
  description: LocalizedString
  packaging: LocalizedString
  weight: LocalizedString
  shelfLife: LocalizedString
  storage: LocalizedString
  origin: LocalizedString

  createdAt: number
  updatedAt: number
}
