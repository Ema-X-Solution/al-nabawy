'use client'

import React, { useState } from 'react'
import { Icons } from '@/lib/icons'
import type { ContactMessage } from '@/types/messages.types'
import { markMessageRead, deleteMessage } from '@/app/actions/messagesActions'

interface Props { initialMessages: ContactMessage[] }

export default function InboxClient({ initialMessages }: Props) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const selectedMsg = messages.find(m => m.id === selectedId)

  const handleSelect = async (id: string) => {
    setSelectedId(id)
    const msg = messages.find(m => m.id === id)
    if (msg && msg.status === 'unread') {
      // Optimistic update
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m))
      await markMessageRead(id)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    setIsProcessing(true)
    const res = await deleteMessage(id)
    setIsProcessing(false)
    if (res.success) {
      setMessages(prev => prev.filter(m => m.id !== id))
      if (selectedId === id) setSelectedId(null)
    } else {
      alert('Failed to delete message.')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 180px)' }}>
      {/* Messages List Sidebar */}
      <div style={{ width: '350px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Messages</h2>
          <span style={{ background: '#169DF7', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
            {messages.filter(m => m.status === 'unread').length} Unread
          </span>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {messages.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>No messages yet.</div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => handleSelect(msg.id)}
                style={{ 
                  padding: '16px 20px', 
                  borderBottom: '1px solid #f3f4f6', 
                  cursor: 'pointer',
                  background: selectedId === msg.id ? '#eff6ff' : (msg.status === 'unread' ? 'white' : '#f9fafb'),
                  borderLeft: `4px solid ${selectedId === msg.id ? '#169DF7' : (msg.status === 'unread' ? '#3b82f6' : 'transparent')}`,
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: msg.status === 'unread' ? 700 : 500, fontSize: '14px', color: '#111827' }}>
                    {msg.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.company || msg.email}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Viewer */}
      <div style={{ flex: 1, background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedMsg ? (
          <>
            {/* Viewer Header */}
            <div style={{ padding: '24px 30px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>{selectedMsg.name}</h2>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#4b5563' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icons.Mail size={16} /> <a href={`mailto:${selectedMsg.email}`} style={{ color: '#169DF7', textDecoration: 'none' }}>{selectedMsg.email}</a>
                  </span>
                  {selectedMsg.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icons.Phone size={16} /> <a href={`tel:${selectedMsg.phone}`} style={{ color: '#169DF7', textDecoration: 'none' }}>{selectedMsg.phone}</a>
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(selectedMsg.id)} 
                disabled={isProcessing}
                style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
              >
                <Icons.Trash2 size={16} /> Delete
              </button>
            </div>

            {/* Viewer Body */}
            <div style={{ padding: '30px', flex: 1, overflowY: 'auto', background: '#fcfcfc' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Company</div>
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>{selectedMsg.company || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Country</div>
                  <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>{selectedMsg.country || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Interested In</div>
                  <div style={{ fontSize: '14px', color: '#169DF7', fontWeight: 600 }}>{selectedMsg.interest || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Date Submitted</div>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>{formatDate(selectedMsg.createdAt)}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px' }}>Message Content</div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '15px', lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-wrap' }}>
                  {selectedMsg.message}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            <span style={{ marginBottom: '16px', color: '#94a3b8' }}><Icons.Inbox size={48} /></span>
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Select a message to view its contents.</p>
          </div>
        )}
      </div>
    </div>
  )
}
