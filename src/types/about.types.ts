// ─── About Page Types ──────────────────────────────────────────────────────
// Derived directly from the frontend page at:
// src/app/[lang]/(public)/about/page.tsx
//
// These types represent ONLY the content that is actually editable.
// Hardcoded design decisions (gradient colors, icons, card colors) are excluded.

export const aboutLocales = ['en', 'ar', 'tr', 'pl', 'de', 'fr'] as const
export type AboutLocale = typeof aboutLocales[number]
export type AboutLocalizedString = Record<AboutLocale, string>

// Helper factory
export const emptyLocStr = (): AboutLocalizedString => ({
  en: '', ar: '', tr: '', pl: '', de: '', fr: '',
})

/** Minimal Cloudinary image reference */
export interface AboutImageAsset {
  public_id: string
  secure_url: string
  width?: number
  height?: number
}

// ── Section 1: Hero ───────────────────────────────────────────────────────
// Fields: badge (brand name), heroTitle, heroSub
export interface AboutHero {
  badge: AboutLocalizedString        // "Al-Nabawy Dairy" / "النبوي للألبان"
  title: AboutLocalizedString        // t.heroTitle
  subtitle: AboutLocalizedString     // t.heroSub
}

// ── Section 2: Our Story ──────────────────────────────────────────────────
// Fields: label, title, body, image (Cloudinary)
export interface AboutStory {
  label: AboutLocalizedString        // t.storyLabel
  title: AboutLocalizedString        // t.storyTitle
  body: AboutLocalizedString         // t.storyBody (long text)
  image?: AboutImageAsset            // Currently /images/factory.png → Cloudinary
}

// ── Section 3: Vision & Mission ───────────────────────────────────────────
// Two fixed cards — icons and colors stay hardcoded in the frontend
export interface AboutVisionMission {
  visionTitle: AboutLocalizedString  // t.vision
  visionBody: AboutLocalizedString   // t.visionBody
  missionTitle: AboutLocalizedString // t.mission
  missionBody: AboutLocalizedString  // t.missionBody
}

// ── Section 4: Core Values ────────────────────────────────────────────────
// Section title + 4 fixed value labels. Icons 🎯🤝💡🌱 stay hardcoded.
export interface AboutValues {
  sectionTitle: AboutLocalizedString // t.values
  quality: AboutLocalizedString      // t.qualityLabel
  integrity: AboutLocalizedString    // t.integrityLabel
  innovation: AboutLocalizedString   // t.innovationLabel
  sustainability: AboutLocalizedString // t.sustainLabel
}

// ── Section 5: Timeline (header only — items are a sub-collection) ─────────
export interface AboutTimelineSection {
  label: AboutLocalizedString        // t.timelineLabel
  title: AboutLocalizedString        // t.timelineTitle
}

// ── Timeline Item (stored as ordered array inside the document) ────────────
// Each item was previously a hardcoded object in the page:
// { year: '2009', event: 'Factory Founded' / 'تأسيس المصنع' }
export interface AboutTimelineItem {
  id: string
  year: string                       // "2009", "2012" etc. — not localized
  event: AboutLocalizedString        // localized event description
  order: number
}

// ── Section 6: Bottom CTA ─────────────────────────────────────────────────
// Was completely hardcoded — extracted to CMS
export interface AboutCTA {
  title: AboutLocalizedString        // "Contact Us Today"
  buttonLabel: AboutLocalizedString  // "Contact Us"
  buttonLink: string                 // "/en/contact" — route stays, link editable
}

// ── Root Document ─────────────────────────────────────────────────────────
// Singleton stored at Firestore path: settings/about
export interface AboutDocument {
  updatedAt: string
  hero: AboutHero
  story: AboutStory
  visionMission: AboutVisionMission
  values: AboutValues
  timelineSection: AboutTimelineSection
  timelineItems: AboutTimelineItem[]
  cta: AboutCTA
}

// ── Default / seed document ───────────────────────────────────────────────
// Pre-filled from the existing EN dictionary values for a smooth first launch
export function createDefaultAboutDocument(): AboutDocument {
  const loc = (en: string, ar: string = ''): AboutLocalizedString => ({
    en, ar, tr: en, pl: en, de: en, fr: en,
  })

  return {
    updatedAt: new Date().toISOString(),
    hero: {
      badge: loc('Al-Nabawy Dairy', 'النبوي للألبان'),
      title: loc('About Al-Nabawy', 'عن النبوي'),
      subtitle: loc('Crafting premium dairy since 2009', 'نصنع الألبان الفاخرة منذ 2009'),
    },
    story: {
      label: loc('Our Story', 'قصتنا'),
      title: loc('15+ Years of Dairy Excellence', '15+ سنة من التميز'),
      body: loc(
        'Founded in 2009, Al-Nabawy Dairy Factory has grown from a local producer into an international exporter trusted by importers and distributors across three continents.',
        'تأسست في 2009، ونمت من منتج محلي إلى مصدّر دولي موثوق به.',
      ),
      image: undefined,
    },
    visionMission: {
      visionTitle: loc('Our Vision', 'رؤيتنا'),
      visionBody: loc(
        'To be the leading dairy exporter from Egypt, recognized globally for product quality, food safety, and reliable supply chains.',
        'أن نكون الرائدين في تصدير الألبان من مصر.',
      ),
      missionTitle: loc('Our Mission', 'مهمتنا'),
      missionBody: loc(
        'To manufacture and export premium dairy products that meet international quality standards while maintaining competitive pricing.',
        'تصنيع وتصدير منتجات الألبان الفاخرة التي تستوفي المعايير الدولية.',
      ),
    },
    values: {
      sectionTitle: loc('Core Values', 'قيمنا الأساسية'),
      quality: loc('Quality First', 'الجودة أولاً'),
      integrity: loc('Integrity', 'النزاهة'),
      innovation: loc('Innovation', 'الابتكار'),
      sustainability: loc('Sustainability', 'الاستدامة'),
    },
    timelineSection: {
      label: loc('Our Journey', 'رحلتنا'),
      title: loc('Milestones', 'المحطات'),
    },
    timelineItems: [
      { id: 't1', year: '2009', order: 0, event: loc('Factory Founded', 'تأسيس المصنع') },
      { id: 't2', year: '2012', order: 1, event: loc('ISO 22000 Certified', 'الحصول على شهادة ISO') },
      { id: 't3', year: '2015', order: 2, event: loc('Gulf Export Launched', 'بدء التصدير للخليج') },
      { id: 't4', year: '2018', order: 3, event: loc('HALAL & HACCP Certified', 'شهادة حلال وHACCP') },
      { id: 't5', year: '2020', order: 4, event: loc('Africa & Europe Expansion', 'التوسع لأفريقيا وأوروبا') },
      { id: 't6', year: '2024', order: 5, event: loc('17+ Countries Served', '17+ دولة مصدّر إليها') },
    ],
    cta: {
      title: loc('Contact Us Today', 'تواصل معنا اليوم'),
      buttonLabel: loc('Contact Us', 'اتصل بنا'),
      buttonLink: '/contact',
    },
  }
}
