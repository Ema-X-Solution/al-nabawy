'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CategoryDocument } from '@/types/categories.types'
import type { ProductDocument } from '@/types/products.types'
import { deleteCategory, deleteAllCategories } from '@/app/actions/categoriesActions'
import { Icons } from '@/lib/icons'

interface Props {
  initialCategories: CategoryDocument[]
  initialProducts: ProductDocument[]
  lang: string
}

type ModalType = 'single' | 'all' | null

export default function CategoriesListClient({ initialCategories, initialProducts, lang }: Props) {
  const [categories, setCategories] = useState(initialCategories)
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [targetId, setTargetId] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const filtered = categories.filter(c =>
    c.name.en.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  )

  // Count how many products belong to a given category
  const getProductCount = (catId: string) =>
    products.filter(p => p.category === catId).length

  // Target category details for modal
  const targetCategory = categories.find(c => c.id === targetId)
  const targetProductCount = targetId ? getProductCount(targetId) : 0
  const totalProductCount = products.length

  const openSingleModal = (id: string) => {
    setModalType('single')
    setTargetId(id)
    setConfirmText('')
    setModalOpen(true)
  }

  const openAllModal = () => {
    setModalType('all')
    setTargetId(null)
    setConfirmText('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalType(null)
    setTargetId(null)
    setConfirmText('')
  }

  const executeDelete = async () => {
    if (modalType === 'single' && targetId) {
      setIsDeleting(targetId)
      closeModal()
      const res = await deleteCategory(targetId)
      setIsDeleting(null)
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== targetId))
        setProducts(prev => prev.filter(p => p.category !== targetId))
      } else {
        alert(res.error || 'Failed to delete category')
      }
    } else if (modalType === 'all') {
      if (confirmText !== 'DELETE ALL') return
      setIsDeleting('all')
      closeModal()
      const res = await deleteAllCategories()
      setIsDeleting(null)
      if (res.success) {
        setCategories([])
        setProducts([])
      } else {
        alert(res.error || 'Failed to delete all categories')
      }
    }
  }

  const canConfirmAll = modalType === 'all' ? confirmText === 'DELETE ALL' : true

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #e5e7eb',
            width: '300px', fontSize: '14px', fontFamily: 'Poppins, sans-serif'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={openAllModal}
            disabled={isDeleting === 'all' || categories.length === 0}
            style={{
              background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '8px',
              border: 'none', fontWeight: 600, fontSize: '14px', fontFamily: 'Poppins, sans-serif',
              cursor: (isDeleting === 'all' || categories.length === 0) ? 'not-allowed' : 'pointer',
              opacity: categories.length === 0 ? 0.5 : 1
            }}
          >
            {isDeleting === 'all' ? 'Deleting...' : 'Delete All'}
          </button>
          <Link
            href={`/${lang}/admin/categories/create`}
            style={{
              background: '#169DF7', color: 'white', padding: '10px 20px', borderRadius: '8px',
              textDecoration: 'none', fontWeight: 600, fontSize: '14px', fontFamily: 'Poppins, sans-serif'
            }}
          >
            + Add Category
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filtered.map(c => {
          const productCount = getProductCount(c.id)
          return (
            <div key={c.id} style={{
              background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ height: '140px', position: 'relative', background: '#f3f4f6' }}>
                {c.image ? (
                  <Image src={c.image} alt={c.name.en} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>No Image</div>
                )}
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <span style={{
                    background: c.status === 'published' ? '#10b981' : '#6b7280',
                    color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600
                  }}>
                    {c.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                    {c.name.en}
                  </h3>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      Order: {c.displayOrder}
                    </span>
                    <span style={{ fontSize: '12px', color: productCount > 0 ? '#169DF7' : '#9ca3af', background: productCount > 0 ? '#eff6ff' : '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {productCount} product{productCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6b7280', flex: 1 }}>
                  {c.description.en.length > 80 ? c.description.en.slice(0, 80) + '...' : c.description.en}
                </p>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                  <Link
                    href={`/${lang}/admin/categories/edit/${c.id}`}
                    style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#f3f4f6', color: '#374151', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/${lang}/admin/categories/preview/${c.id}`}
                    style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#eff6ff', color: '#3b82f6', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => openSingleModal(c.id)}
                    disabled={isDeleting === c.id}
                    style={{
                      padding: '8px 12px', background: '#fef2f2', color: '#ef4444',
                      border: 'none', borderRadius: '6px', cursor: isDeleting === c.id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#6b7280', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            No categories found.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '16px',
            width: '100%', maxWidth: '440px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)'
          }}>
            {/* Icon */}
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>

            <h3 style={{ margin: '0 0 10px 0', color: '#111827', fontSize: '18px', fontWeight: 700 }}>
              {modalType === 'all' ? 'Delete All Categories' : `Delete "${targetCategory?.name.en}"`}
            </h3>

            <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '14px', lineHeight: 1.6 }}>
              {modalType === 'all'
                ? `This will permanently delete all ${categories.length} categories.`
                : `This will permanently delete the category "${targetCategory?.name.en}".`}
            </p>

            {/* Warning box showing affected products */}
            {(modalType === 'single' ? targetProductCount : totalProductCount) > 0 && (
              <div style={{
                background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px',
                padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start'
              }}>
                <span style={{ display: 'flex', alignItems: 'flex-start' }}><Icons.AlertTriangle size={18} color="#f59e0b" /></span>
                <p style={{ margin: 0, fontSize: '13px', color: '#92400e', lineHeight: 1.5 }}>
                  {modalType === 'all'
                    ? `All ${totalProductCount} product${totalProductCount !== 1 ? 's' : ''} across all categories will also be deleted.`
                    : `${targetProductCount} product${targetProductCount !== 1 ? 's' : ''} linked to this category will also be deleted.`}
                  {' '}This action <strong>cannot be undone</strong>.
                </p>
              </div>
            )}

            {/* Extra confirmation input for Delete All */}
            {modalType === 'all' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Type <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>DELETE ALL</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', border: '1.5px solid #e5e7eb',
                    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none',
                    fontFamily: 'monospace'
                  }}
                  autoFocus
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{ padding: '9px 18px', background: 'white', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={!canConfirmAll}
                style={{
                  padding: '9px 18px', background: '#ef4444', color: 'white',
                  border: 'none', borderRadius: '8px', fontWeight: 600,
                  cursor: canConfirmAll ? 'pointer' : 'not-allowed',
                  opacity: canConfirmAll ? 1 : 0.5
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
