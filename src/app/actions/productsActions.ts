'use server'

import { adminDb } from '@/lib/firebase-admin'
import type { ProductDocument } from '@/types/products.types'
import { revalidatePath } from 'next/cache'

export async function getProducts(): Promise<ProductDocument[]> {
  try {
    const snap = await adminDb.collection('products').get()
    return snap.docs
      .map(d => d.data() as ProductDocument)
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<ProductDocument | null> {
  try {
    const snap = await adminDb.collection('products').doc(id).get()
    return snap.exists ? (snap.data() as ProductDocument) : null
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    return null
  }
}

export async function saveProduct(product: ProductDocument): Promise<{ success: boolean; error?: string }> {
  try {
    // Auto-sanitize slug: lowercase, spaces → dashes, strip non-URL chars
    const sanitizedSlug = (product.slug || product.id)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')

    const p = { ...product, slug: sanitizedSlug, updatedAt: Date.now() }
    if (!p.createdAt) p.createdAt = Date.now()
    if (!p.id) p.id = `prod_${Date.now()}`

    await adminDb.collection('products').doc(p.id).set(p)
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving product:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.collection('products').doc(id).delete()
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error(`Error deleting product ${id}:`, error)
    return { success: false, error: error.message }
  }
}

export async function deleteAllProducts(): Promise<{ success: boolean; error?: string }> {
  try {
    const snap = await adminDb.collection('products').get()
    const batch = adminDb.batch()
    snap.docs.forEach(d => batch.delete(d.ref))
    await batch.commit()
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting all products:', error)
    return { success: false, error: error.message }
  }
}
