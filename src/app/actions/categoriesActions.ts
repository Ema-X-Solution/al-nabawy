import { db } from '@/lib/firebase'
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore'
import type { CategoryDocument } from '@/types/categories.types'
import { getProducts } from './productsActions'

export async function getCategories(): Promise<CategoryDocument[]> {
  try {
    const snap = await getDocs(collection(db, 'categories'))
    return snap.docs.map(d => d.data() as CategoryDocument).sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryById(id: string): Promise<CategoryDocument | null> {
  try {
    const snap = await getDoc(doc(db, 'categories', id))
    return snap.exists() ? (snap.data() as CategoryDocument) : null
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
    
    // Default slug to id if not provided
    if (!c.slug) c.slug = c.id

    await setDoc(doc(db, 'categories', c.id), c)
    return { success: true }
  } catch (error: any) {
    console.error('Error saving category:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Deletes a category AND all products linked to it (cascade delete).
 */
export async function deleteCategory(id: string): Promise<{ success: boolean; deletedProducts: number; error?: string }> {
  try {
    const products = await getProducts()
    const linkedProducts = products.filter(p => p.category === id)

    const batch = writeBatch(db)

    // Delete all linked products
    for (const p of linkedProducts) {
      batch.delete(doc(db, 'products', p.id))
    }

    // Delete the category itself
    batch.delete(doc(db, 'categories', id))

    await batch.commit()
    return { success: true, deletedProducts: linkedProducts.length }
  } catch (error: any) {
    console.error(`Error deleting category ${id}:`, error)
    return { success: false, deletedProducts: 0, error: error.message }
  }
}

/**
 * Deletes ALL categories AND all their linked products.
 */
export async function deleteAllCategories(): Promise<{ success: boolean; deletedCategories: number; deletedProducts: number; error?: string }> {
  try {
    const [categories, products] = await Promise.all([
      getDocs(collection(db, 'categories')),
      getProducts(),
    ])

    const batch = writeBatch(db)

    // Delete all products
    for (const p of products) {
      batch.delete(doc(db, 'products', p.id))
    }

    // Delete all categories
    for (const c of categories.docs) {
      batch.delete(c.ref)
    }

    await batch.commit()
    return {
      success: true,
      deletedCategories: categories.docs.length,
      deletedProducts: products.length,
    }
  } catch (error: any) {
    console.error('Error deleting all categories:', error)
    return { success: false, deletedCategories: 0, deletedProducts: 0, error: error.message }
  }
}
