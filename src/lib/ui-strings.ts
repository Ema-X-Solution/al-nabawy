// Small UI labels used by client and server components that have no dictionary access.
type L = 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'

const strings = {
  selectLanguage: {
    en: 'Select Language', ar: 'اختر اللغة', tr: 'Dil Seçin', pl: 'Wybierz język', de: 'Sprache wählen', fr: 'Choisir la langue',
  },
  noImage: {
    en: 'No Image', ar: 'لا توجد صورة', tr: 'Görsel Yok', pl: 'Brak zdjęcia', de: 'Kein Bild', fr: 'Aucune image',
  },
  exportPolicy: {
    en: 'Export Policy', ar: 'سياسة التصدير', tr: 'İhracat Politikası', pl: 'Polityka eksportowa', de: 'Exportrichtlinie', fr: "Politique d'exportation",
  },
  loading: {
    en: 'Loading...', ar: 'جارٍ التحميل...', tr: 'Yükleniyor...', pl: 'Ładowanie...', de: 'Wird geladen...', fr: 'Chargement...',
  },
  certifiedFactory: {
    en: 'Certified Factory', ar: 'مصنع معتمد', tr: 'Sertifikalı Fabrika', pl: 'Certyfikowana fabryka', de: 'Zertifizierte Fabrik', fr: 'Usine certifiée',
  },
} satisfies Record<string, Record<L, string>>

export function uiString(key: keyof typeof strings, lang: string): string {
  const entry = strings[key] as Record<string, string>
  return entry[lang] ?? entry.en
}
