/**
 * Targeted cache invalidation for CMS mutations.
 *
 * Previously every save/delete called revalidatePath('/', 'layout'), which
 * purges the ENTIRE site (all 6 locales x ~167 prerendered pages) so the next
 * visits re-render everything and re-read Firestore at build-sized cost.
 * With the Spark daily read quota that turned a handful of CMS saves into a
 * site outage (2026-11-24).
 *
 * Now each mutation busts only its own data tag (used by
 * src/lib/cached-data.ts) and only the public pages that actually render
 * that content.
 */

import { revalidatePath, updateTag } from 'next/cache'

/** Products list + product detail pages, all locales. */
export function revalidateProducts() {
  updateTag('products')
  revalidatePath('/[lang]/products', 'page')
  revalidatePath('/[lang]/products/[slug]', 'page')
}

/** Categories render on home and on the products pages; deleting a category also deletes its products. */
export function revalidateCategories() {
  updateTag('categories')
  updateTag('products')
  revalidatePath('/[lang]', 'page')
  revalidatePath('/[lang]/products', 'page')
  revalidatePath('/[lang]/products/[slug]', 'page')
}

/** Home page only, all locales. */
export function revalidateHome() {
  updateTag('home')
  revalidatePath('/[lang]', 'page')
}

/** Footer renders on every page, so a footer change genuinely needs a layout-wide purge. Rare operation. */
export function revalidateFooter() {
  updateTag('footer')
  revalidatePath('/', 'layout')
}

/** Certifications render on home and the certifications page. */
export function revalidateCertifications() {
  updateTag('certifications')
  revalidatePath('/[lang]', 'page')
  revalidatePath('/[lang]/certifications', 'page')
}

/** Export markets render on home and the export-markets page. */
export function revalidateExportMarkets() {
  updateTag('export-markets')
  revalidatePath('/[lang]', 'page')
  revalidatePath('/[lang]/export-markets', 'page')
}

/** Single-section pages: about, contact, gallery, export-policy. */
export function revalidateSection(tag: string, sectionPath: string) {
  updateTag(tag)
  revalidatePath(`/[lang]/${sectionPath}`, 'page')
}
