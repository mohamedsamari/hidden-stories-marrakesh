import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { type ChangeEvent, useEffect, useState } from 'react'

import {
  addLocationImage,
  deleteLocationImage,
  fetchLocationImages,
  setCoverLocationImage,
} from '../services/location-images'
import { uploadImage } from '../services/uploads'
import type { LocationImage } from '../types/location-image'

export function LocationImagesGallery({ locationId }: { locationId: string }) {
  const { getToken } = useKindeAuth()
  const [images, setImages] = useState<LocationImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchLocationImages(locationId)
      .then(setImages)
      .finally(() => setLoading(false))
  }, [locationId])

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    const token = await getToken()
    if (!token) {
      setUploading(false)
      return
    }

    try {
      const url = await uploadImage(token, file)
      const image = await addLocationImage(token, locationId, url)
      setImages((current) => [...current, image])
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(image: LocationImage) {
    if (!window.confirm('Retirer cette image de la galerie ?')) return
    const token = await getToken()
    if (!token) return
    await deleteLocationImage(token, image.id)
    setImages((current) => current.filter((i) => i.id !== image.id))
  }

  async function handleSetCover(image: LocationImage) {
    const token = await getToken()
    if (!token) return
    const updated = await setCoverLocationImage(token, image.id)
    // The endpoint atomically unsets any previous cover for this location,
    // so we mirror that locally instead of refetching the whole gallery.
    setImages((current) => current.map((img) => ({ ...img, isCover: img.id === updated.id })))
  }

  if (loading) {
    return <p>Chargement de la galerie...</p>
  }

  return (
    <div className="form-stack" style={{ marginTop: '1.5rem' }}>
      <h2>Galerie d'images</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {images.map((image) => (
          <div key={image.id} style={{ position: 'relative' }}>
            <img
              src={image.imageUrl}
              alt={image.altTextFr ?? ''}
              style={{
                width: 140,
                height: 100,
                objectFit: 'cover',
                borderRadius: 8,
                border: image.isCover ? '2px solid var(--accent)' : '1px solid var(--border)',
              }}
            />
            <button
              type="button"
              className="danger"
              onClick={() => handleDelete(image)}
              style={{ position: 'absolute', top: 4, right: 4, padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}
            >
              ✕
            </button>
            {image.isCover ? (
              <span
                style={{
                  position: 'absolute',
                  bottom: 4,
                  left: 4,
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '0.1rem 0.4rem',
                  borderRadius: 999,
                }}
              >
                Couverture
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSetCover(image)}
                style={{
                  position: 'absolute',
                  bottom: 4,
                  left: 4,
                  padding: '0.15rem 0.45rem',
                  fontSize: '0.65rem',
                }}
              >
                Définir comme couverture
              </button>
            )}
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
