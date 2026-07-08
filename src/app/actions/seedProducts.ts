import { db } from '@/lib/firebase'
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore'
import { products } from '@/data/products'
import type { ProductDocument } from '@/types/products.types'

function makeLocString(str: string) {
  return { en: str, ar: str, tr: str, pl: str, de: str, fr: str }
}

export async function seedProductsIfEmpty() {
  const snap = await getDocs(collection(db, 'products'))
  if (!snap.empty) return

  const batch = writeBatch(db)
  
  for (const p of products) {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const docRef = doc(db, 'products', id)
    
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
      updatedAt: Date.now()
    }
    
    batch.set(docRef, productDoc)
  }

  await batch.commit()
}
