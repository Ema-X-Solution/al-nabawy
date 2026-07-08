'use server'

import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore'
import type { ContactMessage } from '@/types/messages.types'

const MESSAGES_COLLECTION = 'messages'

export async function submitContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<{ success: boolean; error?: string }> {
  try {
    const newMessage = {
      ...data,
      status: 'unread',
      createdAt: new Date().toISOString()
    }
    
    await addDoc(collection(db, MESSAGES_COLLECTION), newMessage)
    return { success: true }
  } catch (error: any) {
    console.error('Error submitting contact message:', error)
    return { success: false, error: error.message }
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, MESSAGES_COLLECTION), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage))
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return []
  }
}

export async function markMessageRead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, MESSAGES_COLLECTION, id), { status: 'read' })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, MESSAGES_COLLECTION, id))
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
