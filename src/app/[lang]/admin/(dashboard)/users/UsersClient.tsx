'use client'

import React, { useState } from 'react'
import type { AdminUser, UserRole } from '@/lib/auth/authService'
import { Icons } from '@/lib/icons'
import { createAdminUser, updateAdminUser, deleteAdminUser } from '@/app/actions/usersActions'

interface Props { initialUsers: AdminUser[] }

const ROLE_BADGE: Record<UserRole, { bg: string; color: string; label: string }> = {
  SuperAdmin: { bg: '#fef3c7', color: '#92400e', label: 'Super Admin' },
  Editor: { bg: '#e0f2fe', color: '#075985', label: 'Editor' },
  Viewer: { bg: '#f3f4f6', color: '#4b5563', label: 'Viewer' },
}

export default function UsersClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Editor' as UserRole, isActive: true })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreate = () => {
    setEditingUser(null)
    setForm({ name: '', email: '', password: '', role: 'Editor', isActive: true })
    setShowModal(true)
  }

  const openEdit = (user: AdminUser) => {
    setEditingUser(user)
    setForm({ name: user.displayName, email: user.email, password: '', role: user.role, isActive: user.isActive })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    if (editingUser) {
      // Edit mode: password is not sent, only role and isActive
      const res = await updateAdminUser(editingUser.uid, { role: form.role, isActive: form.isActive })
      if (res.success) {
        setUsers(prev => prev.map(u => u.uid === editingUser.uid ? { ...u, role: form.role, isActive: form.isActive } : u))
        setShowModal(false)
      } else alert(res.error)
    } else {
      // Create mode
      if (!form.password || form.password.length < 6) {
        alert("Password must be at least 6 characters")
        setSaving(false)
        return
      }
      const res = await createAdminUser(form.email, form.password, form.name, form.role)
      if (res.success) {
        window.location.reload()
      } else alert(res.error)
    }
    setSaving(false)
  }

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Delete user "${user.displayName}"? This action is permanent and removes their login.`)) return
    setDeletingId(user.uid)
    const res = await deleteAdminUser(user.uid)
    if (res.success) setUsers(prev => prev.filter(u => u.uid !== user.uid))
    else alert(res.error)
    setDeletingId(null)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'Poppins,sans-serif', color: '#111827', background: '#fff', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Team Members</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button onClick={openCreate} style={{ background: '#169DF7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
          + Add User
        </button>
      </div>

      <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', color: '#1e3a8a', border: '1px solid #bfdbfe' }}>
        <strong>Role Access:</strong> SuperAdmins have full access. Editors can manage content. Viewers have read-only access.
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {users.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
            <span style={{ marginBottom: '12px', color: '#94a3b8' }}><Icons.Users size={40} /></span>
            <p>No users yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const role = ROLE_BADGE[user.role] || ROLE_BADGE['Viewer']
                return (
                  <tr key={user.uid} style={{ borderBottom: i < users.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#169DF7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                          {user.displayName[0]?.toUpperCase() || 'U'}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{user.displayName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#4b5563' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: role.bg, color: role.color, padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                        {role.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: user.isActive ? '#dcfce7' : '#fee2e2', color: user.isActive ? '#166534' : '#991b1b', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(user)} style={{ padding: '5px 12px', borderRadius: '6px', background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Edit</button>
                        <button onClick={() => handleDelete(user)} disabled={deletingId === user.uid} style={{ padding: '5px 12px', borderRadius: '6px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                          {deletingId === user.uid ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 24px' }}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {!editingUser && (
                <>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input style={inputStyle} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" style={inputStyle} required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Temporary Password</label>
                    <input type="password" style={inputStyle} required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="At least 6 characters" />
                  </div>
                </>
              )}

              {editingUser && (
                <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  <strong>Editing:</strong> {editingUser.email}
                  <br />
                  <span style={{ fontSize: '11px' }}>Name and Email cannot be changed here. Password changes must be done via password reset.</span>
                </div>
              )}

              <div>
                <label style={labelStyle}>Role</label>
                <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}>
                  <option value="Viewer">Viewer (Read Only)</option>
                  <option value="Editor">Editor (Manage Content)</option>
                  <option value="SuperAdmin">Super Admin (Full Access)</option>
                </select>
              </div>

              {editingUser && (
                <div>
                  <label style={labelStyle}>Account Status</label>
                  <select style={inputStyle} value={form.isActive ? 'active' : 'suspended'} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'active' }))}>
                    <option value="active">Active (Can Login)</option>
                    <option value="suspended">Suspended (Cannot Login)</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: '8px', background: '#169DF7', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                  {saving ? 'Saving…' : editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
