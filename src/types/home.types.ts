// ─── Home Page Types ───────────────────────────────────────────────────────
// Derived directly from the frontend page at:
// src/app/[lang]/(public)/page.tsx

export const homeLocales = ['en', 'ar', 'tr', 'pl', 'de', 'fr'] as const
export type HomeLocale = typeof homeLocales[number]
export type HomeLocalizedString = Record<HomeLocale, string>

export const emptyLocStr = (): HomeLocalizedString => ({
  en: '', ar: '', tr: '', pl: '', de: '', fr: '',
})

export interface HomeImageAsset {
  public_id: string
  secure_url: string
  width?: number
  height?: number
}

// ── 1. Hero
export interface HomeHero {
  badge: HomeLocalizedString
  headline: HomeLocalizedString
  headlineSub: HomeLocalizedString
  subheadline: HomeLocalizedString
  cta1: HomeLocalizedString
  cta2: HomeLocalizedString
  bgImage?: HomeImageAsset
}

// ── 2. Overview
export interface HomeOverview {
  label: HomeLocalizedString
  title: HomeLocalizedString
  body: HomeLocalizedString
  readMore: HomeLocalizedString
  statsYears: HomeLocalizedString
  statsProducts: HomeLocalizedString
  statsCountries: HomeLocalizedString
  image?: HomeImageAsset
}

// ── 3. Categories (Module config only)
export interface HomeCategoriesConfig {
  label: HomeLocalizedString
  title: HomeLocalizedString
  subtitle: HomeLocalizedString
  viewDetails: HomeLocalizedString
}

// ── 4. Why Choose Us
export interface HomeWhyUsItem {
  title: HomeLocalizedString
  desc: HomeLocalizedString
}
export interface HomeWhyUs {
  label: HomeLocalizedString
  title: HomeLocalizedString
  subtitle: HomeLocalizedString
  natural: HomeWhyUsItem
  quality: HomeWhyUsItem
  expert: HomeWhyUsItem
  global: HomeWhyUsItem
}

// ── 5. Facility
export interface HomeFacility {
  label: HomeLocalizedString
  title: HomeLocalizedString
  subtitle: HomeLocalizedString
  viewGallery: HomeLocalizedString
  image?: HomeImageAsset
  // Chips are fixed in UI to 4 specific items, just editable labels
  chip1: HomeLocalizedString
  chip2: HomeLocalizedString
  chip3: HomeLocalizedString
  chip4: HomeLocalizedString
}

// ── 6. Certifications (Module config only)
export interface HomeCertificationsConfig {
  label: HomeLocalizedString
  title: HomeLocalizedString
  subtitle: HomeLocalizedString
  maxItems: number
}

// ── 7. Export Markets (Module config only)
export interface HomeExportMarketsConfig {
  label: HomeLocalizedString
  title: HomeLocalizedString
  subtitle: HomeLocalizedString
  viewAll: HomeLocalizedString
  maxItems: number
  region1: HomeLocalizedString // Middle East
  region2: HomeLocalizedString // Europe
  region3: HomeLocalizedString // Africa
}

// ── 8. Catalog Download
export interface HomeCatalog {
  label: HomeLocalizedString
  title: HomeLocalizedString
  subtitle: HomeLocalizedString
  download: HomeLocalizedString
  requestCustom: HomeLocalizedString
  file?: HomeImageAsset
}

// ── 9. Final CTA
export interface HomeCTA {
  title: HomeLocalizedString
  subtitle: HomeLocalizedString
  quote: HomeLocalizedString
  contact: HomeLocalizedString
  bgImage?: HomeImageAsset
}

// ── Section Ordering (dnd-kit)
export type HomeSectionId =
  | 'hero' | 'overview' | 'categories' | 'whyUs' | 'facility'
  | 'certifications' | 'exportMarkets' | 'catalog' | 'cta'

export interface HomeSectionMeta {
  id: HomeSectionId
  order: number
  enabled: boolean
}

// ── Root Document
export interface HomeDocument {
  updatedAt: string
  sectionMeta: Record<HomeSectionId, HomeSectionMeta>
  hero: HomeHero
  overview: HomeOverview
  categories: HomeCategoriesConfig
  whyUs: HomeWhyUs
  facility: HomeFacility
  certifications: HomeCertificationsConfig
  exportMarkets: HomeExportMarketsConfig
  catalog: HomeCatalog
  cta: HomeCTA
}

// ── Default / seed document
export function createDefaultHomeDocument(): HomeDocument {
  const loc = (en: string, ar: string = ''): HomeLocalizedString => ({
    en, ar, tr: en, pl: en, de: en, fr: en,
  })

  return {
    updatedAt: new Date().toISOString(),
    sectionMeta: {
      hero: { id: 'hero', order: 0, enabled: true },
      overview: { id: 'overview', order: 1, enabled: true },
      categories: { id: 'categories', order: 2, enabled: true },
      whyUs: { id: 'whyUs', order: 3, enabled: true },
      facility: { id: 'facility', order: 4, enabled: true },
      certifications: { id: 'certifications', order: 5, enabled: true },
      exportMarkets: { id: 'exportMarkets', order: 6, enabled: true },
      catalog: { id: 'catalog', order: 7, enabled: true },
      cta: { id: 'cta', order: 8, enabled: true },
    },
    hero: {
      badge: loc('Al-Nabawy Dairy', 'النبوي للألبان'),
      headline: loc('Premium Dairy Products', 'منتجات ألبان فاخرة'),
      headlineSub: loc('From Nature To The World', 'من الطبيعة إلى العالم'),
      subheadline: loc(
        'High quality dairy products produced with care and exported to global markets across 3 continents',
        'منتجات ألبان عالية الجودة يتم إنتاجها بعناية وتصديرها إلى الأسواق العالمية'
      ),
      cta1: loc('Explore Products', 'استعرض المنتجات'),
      cta2: loc('Contact Us', 'اتصل بنا'),
      bgImage: undefined,
    },
    overview: {
      label: loc('About Al-Nabawy', 'عن النبوي'),
      title: loc('A Leader in Dairy Manufacturing', 'الرائد في صناعة الألبان'),
      body: loc(
        'Al-Nabawy is a leading dairy manufacturer specialized in producing high quality dairy products and exporting them worldwide. Our state-of-the-art facilities and commitment to quality ensure every product meets international standards.',
        'النبوي هو مصنع رائد متخصص في إنتاج منتجات الألبان عالية الجودة وتصديرها إلى جميع أنحاء العالم.'
      ),
      readMore: loc('Read More', 'اقرأ المزيد'),
      statsYears: loc('Years Experience', 'سنوات خبرة'),
      statsProducts: loc('Dairy Products', 'منتج ألبان'),
      statsCountries: loc('Export Countries', 'دولة تصدير'),
      image: undefined,
    },
    categories: {
      label: loc('Our Products', 'منتجاتنا'),
      title: loc('Product Categories', 'فئات المنتجات'),
      subtitle: loc('Explore our full range of premium dairy products crafted to international standards', 'استكشف مجموعتنا الكاملة من منتجات الألبان الفاخرة'),
      viewDetails: loc('View Details', 'عرض التفاصيل'),
    },
    whyUs: {
      label: loc('Why Choose Us', 'لماذا نحن'),
      title: loc('Our Competitive Advantages', 'مميزاتنا التنافسية'),
      subtitle: loc('We set the benchmark for quality, safety, and reliability in the global dairy industry', 'نضع معيار الجودة والسلامة والموثوقية في صناعة الألبان العالمية'),
      natural: {
        title: loc('100% Natural', '100% طبيعي'),
        desc: loc('Made from real milk and natural ingredients with no artificial additives.', 'مصنوع من حليب حقيقي ومكونات طبيعية.')
      },
      quality: {
        title: loc('International Quality', 'جودة دولية'),
        desc: loc('ISO, HACCP, HALAL and FDA certified manufacturing processes.', 'معتمدة ISO وHACCP وحلال وFDA.')
      },
      expert: {
        title: loc('Expert Team', 'فريق خبراء'),
        desc: loc('Experienced team with deep knowledge of the dairy industry.', 'فريق متمرس بمعرفة عميقة بصناعة الألبان.')
      },
      global: {
        title: loc('Global Export', 'تصدير عالمي'),
        desc: loc('Exporting to over 17 countries worldwide across 3 continents.', 'نصدر إلى أكثر من 17 دولة حول العالم.')
      },
    },
    facility: {
      label: loc('Our Factory', 'مصنعنا'),
      title: loc('State-of-the-Art Production Facility', 'منشأة إنتاج متطورة'),
      subtitle: loc('Modern machinery, hygienic production lines, and strict quality controls', 'آلات حديثة وخطوط إنتاج صحية ورقابة صارمة'),
      viewGallery: loc('View Gallery', 'عرض المعرض'),
      chip1: loc('Modern Production Lines', 'خطوط إنتاج حديثة'),
      chip2: loc('Quality Control Lab', 'مختبر مراقبة الجودة'),
      chip3: loc('Advanced Packaging', 'تعبئة متقدمة'),
      chip4: loc('Full Cold Chain', 'سلسلة تبريد كاملة'),
      image: undefined,
    },
    certifications: {
      label: loc('Certifications', 'الشهادات'),
      title: loc('Internationally Certified', 'معتمد دولياً'),
      subtitle: loc('Our products meet the highest global food safety and quality standards', 'تلبي منتجاتنا أعلى معايير سلامة الغذاء العالمية'),
      maxItems: 4,
    },
    exportMarkets: {
      label: loc('Global Reach', 'انتشارنا العالمي'),
      title: loc('Exporting To The World', 'التصدير إلى العالم'),
      subtitle: loc('Our products reach customers across the Middle East, Europe and Africa', 'تصل منتجاتنا إلى العملاء في الشرق الأوسط وأوروبا وأفريقيا'),
      viewAll: loc('View All Countries', 'عرض جميع الدول'),
      maxItems: 12,
      region1: loc('Middle East', 'الشرق الأوسط'),
      region2: loc('Europe', 'أوروبا'),
      region3: loc('Africa', 'أفريقيا'),
    },
    catalog: {
      label: loc('Company Catalog', 'كتالوج الشركة'),
      title: loc('Download Our Product Catalog', 'تحميل كتالوج المنتجات'),
      subtitle: loc('Get the complete catalog with all specifications, packaging options and export details', 'احصل على الكتالوج الكامل بجميع المواصفات وتفاصيل التصدير'),
      download: loc('Download Catalog (PDF)', 'تحميل الكتالوج (PDF)'),
      requestCustom: loc('Request Custom Quotation', 'طلب عرض سعر مخصص'),
    },
    cta: {
      title: loc('Ready To Import Premium Dairy Products?', 'هل أنت مستعد لاستيراد منتجات الألبان الفاخرة؟'),
      subtitle: loc('Contact our export team today and let us build a partnership that grows your business.', 'تواصل مع فريق التصدير لدينا اليوم.'),
      quote: loc('Request Quotation', 'طلب عرض سعر'),
      contact: loc('Contact Us', 'اتصل بنا'),
      bgImage: undefined,
    }
  }
}
