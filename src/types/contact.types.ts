export type ContactLocale = 'en' | 'ar' | 'tr' | 'pl' | 'de' | 'fr'
export const contactLocales: ContactLocale[] = ['en', 'ar', 'tr', 'pl', 'de', 'fr']

export type ContactLocalizedString = Record<ContactLocale, string>

export interface ContactDocument {
  // Hero Section
  heroTitle: ContactLocalizedString
  heroSub: ContactLocalizedString

  // Contact Info
  infoTitle: ContactLocalizedString
  // Localized map; a plain string from an older CMS doc stays valid
  address: ContactLocalizedString | string
  phone: string
  whatsapp: string
  email: string
  hours: ContactLocalizedString
  hoursValue: ContactLocalizedString
  mapEmbedUrl: string

  // Form Section
  formTitle: ContactLocalizedString
  formSubtitle: ContactLocalizedString

  // Labels
  labelName: ContactLocalizedString
  labelCompany: ContactLocalizedString
  labelCountry: ContactLocalizedString
  labelEmail: ContactLocalizedString
  labelPhone: ContactLocalizedString
  labelInterest: ContactLocalizedString
  labelMessage: ContactLocalizedString
  labelSubmit: ContactLocalizedString

  updatedAt?: string
}

export function createDefaultContactDocument(): ContactDocument {
  return {
    heroTitle: {
      en: 'Contact Us',
      ar: 'تواصل معنا',
      tr: 'İletişim',
      pl: 'Kontakt',
      de: 'Kontakt',
      fr: 'Contactez-nous',
    },
    heroSub: {
      en: "Let's build a partnership",
      ar: 'دعنا نبني شراكة',
      tr: 'Bir ortaklık kuralım',
      pl: 'Zbudujmy partnerstwo',
      de: 'Lassen Sie uns eine Partnerschaft aufbauen',
      fr: 'Construisons un partenariat',
    },
    infoTitle: {
      en: 'Contact Information',
      ar: 'معلومات التواصل',
      tr: 'İletişim Bilgileri',
      pl: 'Informacje kontaktowe',
      de: 'Kontaktinformationen',
      fr: 'Informations de contact',
    },
    address: {
      en: 'Tala, Menoufia, Egypt',
      ar: 'تلا، محافظة المنوفية، مصر',
      tr: 'Tala, Menoufia, Mısır',
      pl: 'Tala, Menoufia, Egipt',
      de: 'Tala, Menoufia, Ägypten',
      fr: 'Tala, Menoufia, Égypte',
    },
    phone: '+20 10 08661480',
    whatsapp: '+20 10 08661480',
    email: 'alnbwy660@gmail.com',
    hours: {
      en: 'Business Hours',
      ar: 'ساعات العمل',
      tr: 'Çalışma Saatleri',
      pl: 'Godziny pracy',
      de: 'Geschäftszeiten',
      fr: "Heures d'ouverture",
    },
    hoursValue: {
      en: 'Open 24 hours, every day of the week',
      ar: 'مفتوح 24 ساعة، كل أيام الأسبوع',
      tr: 'Haftanın her günü 24 saat açık',
      pl: 'Otwarte 24 godziny na dobę, 7 dni w tygodniu',
      de: '24 Stunden geöffnet, jeden Tag der Woche',
      fr: 'Ouvert 24h/24, tous les jours de la semaine',
    },
    mapEmbedUrl:
      'https://www.google.com/maps?q=Tala,+Menoufia,+Egypt&output=embed',
    formTitle: {
      en: 'Send Us a Message',
      ar: 'أرسل لنا رسالة',
      tr: 'Bize Mesaj Gönderin',
      pl: 'Wyślij nam wiadomość',
      de: 'Senden Sie uns eine Nachricht',
      fr: 'Envoyez-nous un message',
    },
    formSubtitle: {
      en: "Fill in the form and our export team will get back to you soon.",
      ar: 'أكمل النموذج وسيتواصل معك فريق التصدير قريباً.',
      tr: 'Formu doldurun, ihracat ekibimiz en kısa sürede size geri dönecektir.',
      pl: 'Wypełnij formularz, a nasz zespół eksportowy skontaktuje się z Tobą wkrótce.',
      de: 'Füllen Sie das Formular aus und unser Exportteam wird sich bald bei Ihnen melden.',
      fr: "Remplissez le formulaire et notre équipe export vous contactera prochainement.",
    },
    labelName: { en: 'Full Name', ar: 'الاسم الكامل', tr: 'Ad Soyad', pl: 'Imię i Nazwisko', de: 'Vollständiger Name', fr: 'Nom complet' },
    labelCompany: { en: 'Company Name', ar: 'اسم الشركة', tr: 'Şirket Adı', pl: 'Nazwa firmy', de: 'Firmenname', fr: 'Nom de la société' },
    labelCountry: { en: 'Country', ar: 'الدولة', tr: 'Ülke', pl: 'Kraj', de: 'Land', fr: 'Pays' },
    labelEmail: { en: 'Email Address', ar: 'البريد الإلكتروني', tr: 'E-posta Adresi', pl: 'Adres e-mail', de: 'E-Mail-Adresse', fr: 'Adresse e-mail' },
    labelPhone: { en: 'Phone Number', ar: 'رقم الهاتف', tr: 'Telefon Numarası', pl: 'Numer telefonu', de: 'Telefonnummer', fr: 'Numéro de téléphone' },
    labelInterest: { en: 'Product Interest', ar: 'المنتج المطلوب', tr: 'İlgilenilen Ürün', pl: 'Interesujący produkt', de: 'Produktinteresse', fr: 'Intérêt produit' },
    labelMessage: { en: 'Message', ar: 'الرسالة', tr: 'Mesaj', pl: 'Wiadomość', de: 'Nachricht', fr: 'Message' },
    labelSubmit: { en: 'Submit Request', ar: 'إرسال الطلب', tr: 'Talebi Gönder', pl: 'Wyślij zapytanie', de: 'Anfrage senden', fr: 'Envoyer la demande' },
  }
}
