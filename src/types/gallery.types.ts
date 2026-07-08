export type GalleryCategory = 'factory' | 'production' | 'products' | 'packaging' | 'exhibitions'

export type LocalizedString = Record<'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr', string>

export const emptyLocStr = (): LocalizedString => ({ en: '', ar: '', fr: '', de: '', tr: '', pl: '' })

export interface GalleryImageAsset {
  public_id: string
  secure_url: string
  width?: number
  height?: number
  format?: string
}

export interface GalleryItem {
  id: string
  src: string
  alt: LocalizedString
  category: GalleryCategory
  order: number
  status: 'published' | 'draft'
  featured: boolean
}

export interface GalleryDocument {
  // Hero
  heroTitle: LocalizedString
  heroSub: LocalizedString

  // Items (managed as a collection)
  items: GalleryItem[]

  updatedAt?: string
}

export function createDefaultGalleryDocument(): GalleryDocument {
  return {
    heroTitle: {
      en: 'Gallery',
      ar: 'معرض الصور',
      fr: 'Galerie',
      de: 'Galerie',
      tr: 'Galeri',
      pl: 'Galeria'
    },
    heroSub: {
      en: 'See our factory, products, and operations',
      ar: 'شاهد مصنعنا ومنتجاتنا وعملياتنا',
      fr: 'Voir notre usine, nos produits et nos opérations',
      de: 'Sehen Sie sich unsere Fabrik, Produkte und Abläufe an',
      tr: 'Fabrikamızı, ürünlerimizi ve operasyonlarımızı görün',
      pl: 'Zobacz naszą fabrykę, produkty i operacje'
    },
    items: [],
  }
}
