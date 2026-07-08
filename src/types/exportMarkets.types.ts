import type { LocalizedString } from './categories.types'

export interface ExportCountry {
  id: string
  name: LocalizedString
  flag: string
  region: LocalizedString
}

export interface ExportMarketsDocument {
  heroTitle: LocalizedString
  heroSub: LocalizedString
  
  countriesLabel: LocalizedString
  countriesTitle: LocalizedString
  
  logisticsLabel: LocalizedString
  logisticsTitle: LocalizedString
  logisticsBody: LocalizedString

  countries: ExportCountry[]
}

export const emptyLocStr = (): LocalizedString => ({ en: '', ar: '', fr: '', de: '', tr: '', pl: '' })

export function createDefaultExportMarketsDocument(): ExportMarketsDocument {
  return {
    heroTitle: {
      en: 'Export Markets',
      ar: 'أسواق التصدير',
      fr: 'Marchés d\'exportation',
      de: 'Exportmärkte',
      tr: 'İhracat Pazarları',
      pl: 'Rynki Eksportowe'
    },
    heroSub: {
      en: 'Delivering premium quality products to our global partners.',
      ar: 'تقديم منتجات عالية الجودة لشركائنا العالميين.',
      fr: 'Livraison de produits de première qualité à nos partenaires mondiaux.',
      de: 'Lieferung von Premium-Qualitätsprodukten an unsere globalen Partner.',
      tr: 'Küresel ortaklarımıza üstün kaliteli ürünler sunuyoruz.',
      pl: 'Dostarczanie produktów najwyższej jakości do naszych globalnych partnerów.'
    },
    countriesLabel: {
      en: 'Global Reach',
      ar: 'التواجد العالمي',
      fr: 'Portée Mondiale',
      de: 'Globale Reichweite',
      tr: 'Küresel Erişim',
      pl: 'Globalny Zasięg'
    },
    countriesTitle: {
      en: 'Countries We Export To',
      ar: 'الدول التي نصدر إليها',
      fr: 'Pays vers lesquels nous exportons',
      de: 'Länder, in die wir exportieren',
      tr: 'İhracat Yaptığımız Ülkeler',
      pl: 'Kraje, do których eksportujemy'
    },
    logisticsLabel: {
      en: 'Logistics',
      ar: 'الخدمات اللوجستية',
      fr: 'Logistique',
      de: 'Logistik',
      tr: 'Lojistik',
      pl: 'Logistyka'
    },
    logisticsTitle: {
      en: 'Reliable Global Shipping',
      ar: 'شحن عالمي موثوق',
      fr: 'Expédition Mondiale Fiable',
      de: 'Zuverlässiger Weltweiter Versand',
      tr: 'Güvenilir Küresel Nakliye',
      pl: 'Niezawodna Globalna Wysyłka'
    },
    logisticsBody: {
      en: 'We partner with leading shipping and logistics companies to ensure our products reach you safely and on time, anywhere in the world. Our dedicated export team handles all documentation and compliance requirements to ensure smooth customs clearance.',
      ar: 'نتشارك مع شركات الشحن والخدمات اللوجستية الرائدة لضمان وصول منتجاتنا إليك بأمان وفي الوقت المحدد في أي مكان في العالم. يتولى فريق التصدير المتخصص لدينا جميع متطلبات التوثيق والامتثال لضمان تخليص جمركي سلس.',
      fr: 'Nous travaillons avec les principales entreprises de transport et de logistique pour nous assurer que nos produits vous parviennent en toute sécurité et à temps, partout dans le monde.',
      de: 'Wir arbeiten mit führenden Versand- und Logistikunternehmen zusammen, um sicherzustellen, dass unsere Produkte sicher und pünktlich überall auf der Welt bei Ihnen ankommen.',
      tr: 'Ürünlerimizin size güvenli ve zamanında ulaşmasını sağlamak için önde gelen nakliye ve lojistik şirketleriyle ortaklık yapıyoruz.',
      pl: 'Współpracujemy z wiodącymi firmami spedycyjnymi i logistycznymi, aby zapewnić, że nasze produkty dotrą do Ciebie bezpiecznie i na czas, w dowolne miejsce na świecie.'
    },
    countries: [
      { id: '1', name: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية', fr: 'Arabie Saoudite', de: 'Saudi-Arabien', tr: 'Suudi Arabistan', pl: 'Arabia Saudyjska' }, flag: '🇸🇦', region: { en: 'Middle East', ar: 'الشرق الأوسط', fr: 'Moyen-Orient', de: 'Naher Osten', tr: 'Orta Doğu', pl: 'Bliski Wschód' } },
      { id: '2', name: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة', fr: 'Émirats Arabes Unis', de: 'Vereinigte Arabische Emirate', tr: 'Birleşik Arap Emirlikleri', pl: 'Zjednoczone Emiraty Arabskie' }, flag: '🇦🇪', region: { en: 'Middle East', ar: 'الشرق الأوسط', fr: 'Moyen-Orient', de: 'Naher Osten', tr: 'Orta Doğu', pl: 'Bliski Wschód' } },
      { id: '3', name: { en: 'Germany', ar: 'ألمانيا', fr: 'Allemagne', de: 'Deutschland', tr: 'Almanya', pl: 'Niemcy' }, flag: '🇩🇪', region: { en: 'Europe', ar: 'أوروبا', fr: 'Europe', de: 'Europa', tr: 'Avrupa', pl: 'Europa' } },
      { id: '4', name: { en: 'Kenya', ar: 'كينيا', fr: 'Kenya', de: 'Kenia', tr: 'Kenya', pl: 'Kenia' }, flag: '🇰🇪', region: { en: 'Africa', ar: 'أفريقيا', fr: 'Afrique', de: 'Afrika', tr: 'Afrika', pl: 'Afryka' } }
    ]
  }
}
