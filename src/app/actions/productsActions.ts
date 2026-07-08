import { db } from '@/lib/firebase'
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore'
import type { ProductDocument } from '@/types/products.types'

export async function getProducts(): Promise<ProductDocument[]> {
  try {
    const snap = await getDocs(collection(db, 'products'))
    return snap.docs.map(d => d.data() as ProductDocument).sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<ProductDocument | null> {
  try {
    const snap = await getDoc(doc(db, 'products', id))
    return snap.exists() ? (snap.data() as ProductDocument) : null
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    return null
  }
}

export async function saveProduct(product: ProductDocument): Promise<{ success: boolean; error?: string }> {
  try {
    const p = { ...product, updatedAt: Date.now() }
    if (!p.createdAt) p.createdAt = Date.now()
    if (!p.id) p.id = `prod_${Date.now()}`
    
    await setDoc(doc(db, 'products', p.id), p)
    return { success: true }
  } catch (error: any) {
    console.error('Error saving product:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'products', id))
    return { success: true }
  } catch (error: any) {
    console.error(`Error deleting product ${id}:`, error)
    return { success: false, error: error.message }
  }
}

export async function deleteAllProducts(): Promise<{ success: boolean; error?: string }> {
  try {
    const snap = await getDocs(collection(db, 'products'))
    const batch = writeBatch(db)
    snap.docs.forEach(d => {
      batch.delete(d.ref)
    })
    await batch.commit()
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting all products:', error)
    return { success: false, error: error.message }
  }
}
