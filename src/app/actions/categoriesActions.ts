'use server'

import { adminDb } from '@/lib/firebase-admin'
import type { CategoryDocument } from '@/types/categories.types'
import { revalidatePath } from 'next/cache'
import { getProducts } from './productsActions'

export async function getCategories(): Promise<CategoryDocument[]> {
  try {
    const snap = await adminDb.collection('categories').get()
    return snap.docs
      .map(d => d.data() as CategoryDocument)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryById(id: string): Promise<CategoryDocument | null> {
  try {
    const snap = await adminDb.collection('categories').doc(id).get()
    return snap.exists ? (snap.data() as CategoryDocument) : null
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error)
    return null
  }
}

export async function getCategoryProductCount(categoryId: string): Promise<number> {
  try {
    const products = await getProducts()
    return products.filter(p => p.category === categoryId).length
  } catch {
    return 0
  }
}

export async function saveCategory(category: CategoryDocument): Promise<{ success: boolean; error?: string }> {
  try {
    const c = { ...category, updatedAt: Date.now() }
    if (!c.createdAt) c.createdAt = Date.now()
    if (!c.id) c.id = `cat_${Date.now()}`
    if (!c.slug) c.slug = c.id

    await adminDb.collection('categories').doc(c.id).set(c)
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving category:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; deletedProducts: number; error?: string }> {
  try {
    const products = await getProducts()
    const linkedProducts = products.filter(p => p.category === id)

    const batch = adminDb.batch()
    for (const p of linkedProducts) {
      batch.delete(adminDb.collection('products').doc(p.id))
    }
    batch.delete(adminDb.collection('categories').doc(id))
    await batch.commit()

    revalidatePath('/', 'layout')
    return { success: true, deletedProducts: linkedProducts.length }
  } catch (error: any) {
    console.error(`Error deleting category ${id}:`, error)
    return { success: false, deletedProducts: 0, error: error.message }
  }
}

export async function deleteAllCategories(): Promise<{ success: boolean; deletedCategories: number; deletedProducts: number; error?: string }> {
  try {
    const [categoriesSnap, products] = await Promise.all([
      adminDb.collection('categories').get(),
      getProducts(),
    ])

    const batch = adminDb.batch()
    for (const p of products) {
      batch.delete(adminDb.collection('products').doc(p.id))
    }
    for (const c of categoriesSnap.docs) {
      batch.delete(c.ref)
    }
    await batch.commit()

    revalidatePath('/', 'layout')
    return {
      success: true,
      deletedCategories: categoriesSnap.docs.length,
      deletedProducts: products.length,
    }
  } catch (error: any) {
    console.error('Error deleting all categories:', error)
    return { success: false, deletedCategories: 0, deletedProducts: 0, error: error.message }
  }
}
