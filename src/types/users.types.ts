export type UserRole = 'admin' | 'editor'
export type UserStatus = 'active' | 'suspended'

export interface UserDocument {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  lastLogin?: string
}
