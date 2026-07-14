'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { ProductDocument } from '@/types/products.types'
import { deleteProduct, deleteAllProducts } from '@/app/actions/productsActions'
import Image from 'next/image'

interface Props {
  initialProducts: ProductDocument[]
  lang: string
}

export default function ProductsListClient({ initialProducts, lang }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'single' | 'all' | null>(null)
  const [targetId, setTargetId] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const filtered = products.filter(p => 
    p.name.en.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const confirmDeleteSingle = (id: string) => {
    setModalType('single')
    setTargetId(id)
    setConfirmText('')
    setModalOpen(true)
  }

  const confirmDeleteAll = () => {
    setModalType('all')
    setConfirmText('')
    setModalOpen(true)
  }

  const executeDelete = async () => {
    if (modalType === 'single' && targetId) {
      setIsDeleting(targetId)
      setModalOpen(false)
      const res = await deleteProduct(targetId)
      setIsDeleting(null)
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== targetId))
        const { revalidatePublicPath } = await import('@/app/actions/revalidateActions')
        await revalidatePublicPath('/')
      }
    } else if (modalType === 'all') {
      if (confirmText !== 'DELETE ALL') return
      setIsDeleting('all')
      setModalOpen(false)
      const res = await deleteAllProducts()
      setIsDeleting(null)
      if (res.success) {
        setProducts([])
        const { revalidatePublicPath } = await import('@/app/actions/revalidateActions')
        await revalidatePublicPath('/')
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input 
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            width: '300px',
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={confirmDeleteAll}
            disabled={isDeleting === 'all' || products.length === 0}
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              cursor: (isDeleting === 'all' || products.length === 0) ? 'not-allowed' : 'pointer',
              opacity: products.length === 0 ? 0.5 : 1
            }}
          >
            {isDeleting === 'all' ? 'Deleting...' : 'Delete All'}
          </button>
          <Link 
            href={`/${lang}/admin/products/create`}
            style={{
              background: '#169DF7',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ 
            background: 'white', 
            borderRadius: '12px', 
            border: '1px solid #e5e7eb', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{ height: '180px', position: 'relative', background: '#f3f4f6' }}>
              {p.image ? (
                <Image src={p.image} alt={p.name.en} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>No Image</div>
              )}
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: '6px' }}>
                <span style={{ background: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>
                  {p.category}
                </span>
                {p.featured && (
                  <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    Featured
                  </span>
                )}
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <span style={{ 
                  background: p.status === 'published' ? '#10b981' : '#6b7280', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: 600 
                }}>
                  {p.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#111827', fontFamily: 'Poppins, sans-serif' }}>
                {p.name.en}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7280', flex: 1 }}>
                {p.description.en.length > 80 ? p.description.en.slice(0, 80) + '...' : p.description.en}
              </p>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <Link 
                  href={`/${lang}/admin/products/edit/${p.id}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    background: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Edit
                </Link>
                <Link 
                  href={`/${lang}/admin/products/preview/${p.id}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    background: '#eff6ff',
                    color: '#3b82f6',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Preview
                </Link>
                <button
                  onClick={() => confirmDeleteSingle(p.id)}
                  disabled={isDeleting === p.id}
                  style={{
                    padding: '8px 12px',
                    background: '#fef2f2',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isDeleting === p.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#6b7280', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            No products found.
          </div>
        )}
      </div>

      {/* Custom Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '16px',
            width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#111827', fontSize: '18px', fontWeight: 700 }}>
              {modalType === 'all' ? 'Delete All Products' : 'Delete Product'}
            </h3>
            
            <p style={{ margin: '0 0 20px 0', color: '#4b5563', fontSize: '14px', lineHeight: 1.5 }}>
              {modalType === 'all' 
                ? 'Are you absolutely sure? This action cannot be undone and will permanently delete all products in the database.' 
                : 'Are you sure you want to delete this product? This action cannot be undone.'}
            </p>

            {modalType === 'all' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Please type <span style={{ color: '#ef4444' }}>DELETE ALL</span> to confirm:
                </label>
                <input 
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', border: '1px solid #e5e7eb',
                    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none'
                  }}
                  autoFocus
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '8px 16px', background: 'white', color: '#374151',
                  border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                disabled={modalType === 'all' && confirmText !== 'DELETE ALL'}
                style={{
                  padding: '8px 16px', background: '#ef4444', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: (modalType === 'all' && confirmText !== 'DELETE ALL') ? 'not-allowed' : 'pointer', fontWeight: 600,
                  opacity: (modalType === 'all' && confirmText !== 'DELETE ALL') ? 0.5 : 1
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
