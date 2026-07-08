'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CategoryDocument, LocalizedString } from '@/types/categories.types'
import { saveCategory } from '@/app/actions/categoriesActions'
import MediaPicker from '@/components/admin/MediaPicker'
import ContentEditor from '@/components/admin/ContentEditor'
import FormField from '@/components/admin/ui/FormField'
import type { MediaAssetMetadata } from '@/lib/media/mediaSystem'

interface Props {
  initialData?: CategoryDocument | null
  lang: string
}

export default function CategoryEditorClient({ initialData, lang }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Form states
  const [id, setId] = useState(initialData?.id || '')
  const [name, setName] = useState<LocalizedString>(
    initialData?.name || { en: '', ar: '', tr: '', pl: '', de: '', fr: '' }
  )
  const [description, setDescription] = useState<LocalizedString>(
    initialData?.description || { en: '', ar: '', tr: '', pl: '', de: '', fr: '' }
  )
  const [image, setImage] = useState<MediaAssetMetadata | null>(
    initialData?.image ? { secure_url: initialData.image, public_id: '', format: '', bytes: 0, width: 0, height: 0, resource_type: 'image', created_at: '', folder: 'categories', type: 'upload', url: initialData.image } as any : null
  )

  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published')
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder || 0)

  // We consider ID editable only if creating a new one
  const isEditing = !!initialData

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!id || !name.en || !name.ar) {
      alert('ID, English Name, and Arabic Name are required.')
      return
    }

    setLoading(true)
    const category: CategoryDocument = {
      id,
      slug: id,
      name,
      description,
      image: image?.secure_url || '',
      status,
      featured,
      displayOrder,
      createdAt: initialData?.createdAt || Date.now(),
      updatedAt: Date.now()
    }

    const res = await saveCategory(category)
    setLoading(false)

    if (res.success) {
      setHasUnsavedChanges(false)
      router.push(`/${lang}/admin/categories`)
      router.refresh()
    } else {
      alert(res.error || 'Failed to save category')
    }
  }

  // Simple tracker to mark dirty state
  const handleChange = (setter: any, val: any) => {
    setter(val)
    setHasUnsavedChanges(true)
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          {isEditing ? 'Edit Category' : 'Create Category'}
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={() => router.push(`/${lang}/admin/categories`)}
            style={{ padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            style={{ padding: '8px 16px', background: '#169DF7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
          >
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* General Info */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600 }}>General Information</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <FormField label="Category ID (Slug)" required>
                <input 
                  type="text" 
                  className="form-input" 
                  value={id}
                  onChange={e => handleChange(setId, e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="e.g. milk"
                  disabled={isEditing}
                  style={{ opacity: isEditing ? 0.6 : 1 }}
                />
              </FormField>
            </div>
            
            <ContentEditor 
              label="Name" 
              value={name} 
              onChange={val => handleChange(setName, val)}
              type="text"
              required
            />
          </div>

          {/* Description */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600 }}>Description</h3>
            <ContentEditor 
              label="Short Description" 
              value={description} 
              onChange={val => handleChange(setDescription, val)}
              type="textarea"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Visibility */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600 }}>Visibility & Sorting</h3>
            
            <FormField label="Status">
              <select 
                className="form-input"
                value={status}
                onChange={e => handleChange(setStatus, e.target.value as any)}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </FormField>

            <div style={{ marginTop: '16px' }}>
              <FormField label="Display Order">
                <input 
                  type="number" 
                  className="form-input" 
                  value={displayOrder}
                  onChange={e => handleChange(setDisplayOrder, Number(e.target.value))}
                />
              </FormField>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={featured}
                  onChange={e => handleChange(setFeatured, e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Featured Category</span>
              </label>
            </div>
          </div>

          {/* Media */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600 }}>Category Image</h3>
            <MediaPicker 
              value={image}
              folder="categories"
              onChange={val => { handleChange(setImage as any, val); }}
            />
          </div>

        </div>
      </div>
      
      {/* Floating Save Button */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: `translateX(-50%) translateY(${hasUnsavedChanges ? '0' : '80px'})`,
        opacity: hasUnsavedChanges ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: '#1F2937', color: 'white', padding: '12px 24px', borderRadius: '100px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '16px',
        zIndex: 50
      }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>You have unsaved changes</span>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={loading}
          style={{
            background: '#169DF7', color: 'white', border: 'none', padding: '8px 20px',
            borderRadius: '99px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          {loading ? 'Saving...' : 'Save Now'}
        </button>
      </div>
    </form>
  )
}
