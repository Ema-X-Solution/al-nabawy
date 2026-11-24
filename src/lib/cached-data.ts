/**
 * Cached read layer for PUBLIC pages.
 *
 * Why this exists: every server action used to hit Firestore on every call.
 * With 6 locales prerendered at build time that multiplied each collection
 * read by ~100x per deploy and exhausted the Firestore Spark daily quota.
 *
 * Every getter here is wrapped in `unstable_cache` (persisted in the Vercel
 * Data Cache across requests and build renders) and is invalidated ONLY by
 * the matching CMS save/delete action via `revalidateTag()`.
 *
 * Admin pages intentionally keep calling the raw actions in
 * src/app/actions/* so they always see fresh data.
 *
 * Dev aid: set FIRESTORE_MOCK=1 locally to serve fixture products/categories
 * from ./dev-fixtures instead of Firestore (no Firestore reads at all).
 * Never set it in production.
 */

import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getProducts } from '@/app/actions/productsActions'
import { getCategories } from '@/app/actions/categoriesActions'
import { getHomeConfig } from '@/app/actions/homeActions'
import { getFooterConfig } from '@/app/actions/footerActions'
import { getCertificationsConfig } from '@/app/actions/certificationsActions'
import { getExportMarketsConfig } from '@/app/actions/exportMarketsActions'
import { getExportPolicyConfig } from '@/app/actions/exportPolicyActions'
import { getGalleryConfig } from '@/app/actions/galleryActions'
import { getAboutConfig } from '@/app/actions/aboutActions'
import { getContactConfig } from '@/app/actions/contactActions'
import { mockProducts, mockCategories } from './dev-fixtures'
import type { ProductDocument } from '@/types/products.types'

const MOCK = process.env.FIRESTORE_MOCK === '1'

export const getProductsCached = unstable_cache(
  async () => (MOCK ? mockProducts : getProducts()),
  ['products-list'],
  { tags: ['products'] }
)

export const getCategoriesCached = unstable_cache(
  async () => (MOCK ? mockCategories : getCategories()),
  ['categories-list'],
  { tags: ['categories'] }
)

export const getHomeConfigCached = unstable_cache(
  async () => getHomeConfig(),
  ['home-config'],
  { tags: ['home'] }
)

export const getFooterConfigCached = unstable_cache(
  async () => getFooterConfig(),
  ['footer-config'],
  { tags: ['footer'] }
)

export const getCertificationsConfigCached = unstable_cache(
  async () => getCertificationsConfig(),
  ['certifications-config'],
  { tags: ['certifications'] }
)

export const getExportMarketsConfigCached = unstable_cache(
  async () => getExportMarketsConfig(),
  ['export-markets-config'],
  { tags: ['export-markets'] }
)

export const getExportPolicyConfigCached = unstable_cache(
  async () => getExportPolicyConfig(),
  ['export-policy-config'],
  { tags: ['export-policy'] }
)

export const getGalleryConfigCached = unstable_cache(
  async () => getGalleryConfig(),
  ['gallery-config'],
  { tags: ['gallery'] }
)

export const getAboutConfigCached = unstable_cache(
  async () => getAboutConfig(),
  ['about-config'],
  { tags: ['about'] }
)

export const getContactConfigCached = unstable_cache(
  async () => getContactConfig(),
  ['contact-config'],
  { tags: ['contact'] }
)

/**
 * Single product by slug (or id). Reads through the cached product list, so
 * with a catalog of this size (~16 docs) it costs ZERO extra Firestore reads:
 * one cached collection read serves all 96 product pages, instead of each
 * page re-reading the whole collection twice (metadata + body).
 * `cache()` memoizes per request so generateMetadata and the page share it.
 */
export const getProductBySlugCached = cache(
  async (slug: string): Promise<ProductDocument | null> => {
    const products = await getProductsCached()
    return products.find((p) => p.slug === slug || p.id === slug) ?? null
  }
)

/** Up to 3 published products in the same category, excluding the current one. */
export const getRelatedProductsCached = cache(
  async (category: string, excludeSlug: string): Promise<ProductDocument[]> => {
    const products = await getProductsCached()
    return products
      .filter(
        (p) =>
          p.category === category &&
          p.slug !== excludeSlug &&
          p.id !== excludeSlug &&
          p.status === 'published'
      )
      .slice(0, 3)
  }
)
