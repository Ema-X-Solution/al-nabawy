export interface ContactMessage {
  id: string
  name: string
  company?: string
  country: string
  email: string
  phone: string
  interest: string
  message: string
  status: 'read' | 'unread'
  createdAt: string
}
