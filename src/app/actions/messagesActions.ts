'use server'

import { adminDb } from '@/lib/firebase-admin'
import type { ContactMessage } from '@/types/messages.types'

const MESSAGES_COLLECTION = 'messages'

export async function submitContactMessage(
  data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const newMessage = {
      ...data,
      status: 'unread',
      createdAt: new Date().toISOString(),
    }
    await adminDb.collection(MESSAGES_COLLECTION).add(newMessage)
    return { success: true }
  } catch (error: any) {
    console.error('Error submitting contact message:', error)
    return { success: false, error: error.message }
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const snap = await adminDb
      .collection(MESSAGES_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage))
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return []
  }
}

export async function markMessageRead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.collection(MESSAGES_COLLECTION).doc(id).update({ status: 'read' })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await adminDb.collection(MESSAGES_COLLECTION).doc(id).delete()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
