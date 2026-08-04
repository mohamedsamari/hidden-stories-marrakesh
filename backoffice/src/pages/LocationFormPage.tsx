import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { LocationImagesGallery } from '../components/LocationImagesGallery'
import { fetchCategories } from '../services/categories'
import { createLocation, fetchLocations, updateLocation, type LocationInput } from '../services/locations'
import type { Category } from '../types/category'

const EMPTY_FORM: LocationInput = {
  nameEn: '',
  nameFr: '',
  descriptionEn: '',
  descriptionFr: '',
  addressEn: '',
  addressFr: '',
  latitude: 0,
  longitude: 0,
}

export function LocationFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { getToken } = useKindeAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<LocationInput>(EMPTY_FORM)
  const [latitude, setLatitude] = useState('0')
  const [longitude, setLongitude] = useState('0')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  // There's no "get one location" endpoint — we already have the full list
  // in memory from the mobile/other pages' pattern, so we just fetch the
  // list again and find the matching entry.
  useEffect(() => {
    if (!id) return
    fetchLocations().then((locations) => {
      const location = locations.find((l) => l.id === id)
      if (!location) return
      setForm({
        nameEn: location.nameEn,
        nameFr: location.nameFr,
        descriptionEn: location.descriptionEn ?? '',
        descriptionFr: location.descriptionFr ?? '',
        addressEn: location.addressEn ?? '',
        addressFr: location.addressFr ?? '',
        latitude: location.latitude,
        longitude: location.longitude,
        categoryId: location.categoryId ?? undefined,
      })
      setLatitude(location.latitude.toString())
      setLongitude(location.longitude.toString())
      setLoading(false)
    })
  }, [id])

  function updateField<K extends keyof LocationInput>(field: K, value: LocationInput[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const token = await getToken()
    if (!token) {
      setSaving(false)
      return
    }

    const payload: LocationInput = {
      ...form,
      latitude: Number(latitude),
      longitude: Number(longitude),
      categoryId: form.categoryId || undefined,
    }

    try {
      if (isEditing && id) {
        await updateLocation(token, id, payload)
      } else {
        await createLocation(token, payload)
      }
      navigate('/locations')
    } catch {
      setError("Impossible d'enregistrer le lieu.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Chargement...</p>
  }

  return (
    <div>
    <form onSubmit={handleSubmit} className="form-stack">
      <h2>{isEditing ? 'Modifier le lieu' : 'Nouveau lieu'}</h2>

      {error && <p className="error-text">{error}</p>}

      <label>
        Nom (français)
        <input value={form.nameFr} onChange={(e) => updateField('nameFr', e.target.value)} required />
      </label>

      <label>
        Nom (anglais)
        <input value={form.nameEn} onChange={(e) => updateField('nameEn', e.target.value)} required />
      </label>

      <label>
        Description (français)
        <textarea
          value={form.descriptionFr}
          onChange={(e) => updateField('descriptionFr', e.target.value)}
        />
      </label>

      <label>
        Description (anglais)
        <textarea
          value={form.descriptionEn}
          onChange={(e) => updateField('descriptionEn', e.target.value)}
        />
      </label>

      <label>
        Adresse (français)
        <input value={form.addressFr} onChange={(e) => updateField('addressFr', e.target.value)} />
      </label>

      <label>
        Adresse (anglais)
        <input value={form.addressEn} onChange={(e) => updateField('addressEn', e.target.value)} />
      </label>

      <label>
        Latitude
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
      </label>

      <label>
        Longitude
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
      </label>

      <label>
        Catégorie (optionnel)
        <select
          value={form.categoryId ?? ''}
          onChange={(e) => updateField('categoryId', e.target.value)}
        >
          <option value="">Aucune</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameFr}
            </option>
          ))}
        </select>
      </label>

      <div>
        <button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>{' '}
        <button type="button" onClick={() => navigate('/locations')}>
          Annuler
        </button>
      </div>
    </form>

    {isEditing && id && <LocationImagesGallery locationId={id} />}
    </div>
  )
}
