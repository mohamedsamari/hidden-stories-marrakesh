import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { type ChangeEvent, useEffect, useState } from 'react'

import { addStoryImage, deleteStoryImage, fetchAdminStoryImages } from '../services/story-images'
import { uploadImage } from '../services/uploads'
import type { StoryImage } from '../types/story-image'

export function StoryImagesGallery({ storyId }: { storyId: string }) {
  const { getToken } = useKindeAuth()
  const [images, setImages] = useState<StoryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getToken().then((token) => {
      if (!token) return
      fetchAdminStoryImages(token, storyId)
        .then(setImages)
        .finally(() => setLoading(false))
    })
  }, [storyId, getToken])

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow selecting the same file again later
    if (!file) return

    setUploading(true)
    const token = await getToken()
    if (!token) {
      setUploading(false)
      return
    }

    try {
      const url = await uploadImage(token, file)
      const image = await addStoryImage(token, storyId, url)
      setImages((current) => [...current, image])
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(image: StoryImage) {
    if (!window.confirm('Retirer cette image de la galerie ?')) return
    const token = await getToken()
    if (!token) return
    await deleteStoryImage(token, image.id)
    setImages((current) => current.filter((i) => i.id !== image.id))
  }

  if (loading) {
    return <p>Chargement de la galerie...</p>
  }

  return (
    <div className="form-stack" style={{ marginTop: '1.5rem' }}>
      <h2>Galerie d'images</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {images.map((image) => (
          <div key={image.id} style={{ position: 'relative' }}>
            <img
              src={image.imageUrl}
              alt={image.altTextFr ?? ''}
              style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
            />
            <button
              type="button"
              className="danger"
              onClick={() => handleDelete(image)}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                padding: '0.15rem 0.45rem',
                fontSize: '0.7rem',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <label>
        Ajouter une image
        <input type="file" accept="image/*" onChange={handleFileSelected} disabled={uploading} />
      </label>
      {uploading && <p className="muted">Envoi en cours...</p>}
    </div>
  )
}
