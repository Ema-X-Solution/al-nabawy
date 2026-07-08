import type { LocalizedString } from './categories.types'

export interface ExportPolicySection {
  id: string
  title: LocalizedString
  content: LocalizedString
}

export interface ExportPolicyDocument {
  pageTitle: LocalizedString
  pageDescription: LocalizedString
  sections: ExportPolicySection[]
}

export const emptyLocStr = (): LocalizedString => ({ en: '', ar: '', fr: '', de: '', tr: '', pl: '' })

export function createDefaultExportPolicyDocument(): ExportPolicyDocument {
  return {
    pageTitle: {
      en: 'Export Policy',
      ar: 'سياسة التصدير',
      fr: 'Politique d\'exportation',
      de: 'Exportrichtlinie',
      tr: 'İhracat Politikası',
      pl: 'Polityka eksportowa'
    },
    pageDescription: {
      en: 'Please read our export policy carefully before placing international orders.',
      ar: 'يرجى قراءة سياسة التصدير الخاصة بنا بعناية قبل تقديم الطلبات الدولية.',
      fr: 'Veuillez lire attentivement notre politique d\'exportation avant de passer des commandes internationales.',
      de: 'Bitte lesen Sie unsere Exportrichtlinien sorgfältig durch, bevor Sie internationale Bestellungen aufgeben.',
      tr: 'Uluslararası sipariş vermeden önce lütfen ihracat politikamızı dikkatlice okuyun.',
      pl: 'Przed złożeniem zamówień międzynarodowych prosimy o uważne zapoznanie się z naszą polityką eksportową.'
    },
    sections: [
      {
        id: 'sec_1',
        title: {
          en: '1. Minimum Order Quantity (MOQ)',
          ar: '1. الحد الأدنى لكمية الطلب',
          fr: '1. Quantité Minimale de Commande',
          de: '1. Mindestbestellmenge',
          tr: '1. Minimum Sipariş Miktarı',
          pl: '1. Minimalna ilość zamówienia'
        },
        content: {
          en: 'Our standard Minimum Order Quantity (MOQ) for export shipments is a 20ft container.',
          ar: 'الحد الأدنى للكمية القياسية لدينا (MOQ) لشحنات التصدير هو حاوية 20 قدمًا.',
          fr: 'Notre quantité minimale de commande (MOQ) standard pour les expéditions d\'exportation est un conteneur de 20 pieds.',
          de: 'Unsere Standard-Mindestbestellmenge (MOQ) für Exportsendungen ist ein 20-Fuß-Container.',
          tr: 'İhracat sevkiyatları için standart Minimum Sipariş Miktarımız (MOQ) 20ft konteynerdir.',
          pl: 'Nasza standardowa minimalna ilość zamówienia (MOQ) dla przesyłek eksportowych wynosi kontener 20-stopowy.'
        }
      }
    ]
  }
}
