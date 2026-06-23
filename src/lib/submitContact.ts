'use client'
import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export interface ContactFormData {
  name: string
  company: string
  country: string
  email: string
  phone: string
  interest: string
  message: string
}

export async function submitContact(data: ContactFormData): Promise<void> {
  await addDoc(collection(db, 'contact_requests'), {
    ...data,
    createdAt: serverTimestamp(),
    status: 'new',
  })
}
