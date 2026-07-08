export interface LocalizedString {
  en: string
  ar: string
  tr: string
  pl: string
  de: string
  fr: string
}

export interface CategoryDocument {
  id: string
  slug: string
  name: LocalizedString
  description: LocalizedString
  image: string
  status: 'published' | 'draft'
  featured: boolean
  displayOrder: number
  createdAt: number
  updatedAt: number
}
