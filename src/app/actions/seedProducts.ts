'use server'

import { adminDb } from '@/lib/firebase-admin'
import { products } from '@/data/products'
import type { ProductDocument } from '@/types/products.types'

function makeLocString(str: string) {
  return { en: str, ar: str, tr: str, pl: str, de: str, fr: str }
}

export async function seedProductsIfEmpty() {
  const snap = await adminDb.collection('products').get()
  if (!snap.empty) return

  const batch = adminDb.batch()

  for (const p of products) {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const docRef = adminDb.collection('products').doc(id)

    const productDoc: ProductDocument = {
      id,
      slug: p.slug,
      category: p.category,
      image: p.image,
      status: 'published',
      featured: false,
      name: makeLocString(p.nameKey),
      description: makeLocString(p.descKey),
      packaging: makeLocString(p.packaging),
      weight: makeLocString(p.weight),
      shelfLife: makeLocString(p.shelfLife),
      storage: makeLocString(p.storage),
      origin: makeLocString(p.origin),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    batch.set(docRef, productDoc)
  }

  await batch.commit()
}
