import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { StoryImagesGallery } from '../components/StoryImagesGallery'
import { fetchCategories } from '../services/categories'
import { fetchDynasties } from '../services/dynasties'
import { fetchHistoricalPeriods } from '../services/historical-periods'
import { fetchLocations } from '../services/locations'
import {
  createStory,
  fetchAdminStoryById,
  updateStory,
  type StoryInput,
} from '../services/stories'
import type { Category } from '../types/category'
import type { Dynasty } from '../types/dynasty'
import type { HistoricalPeriod } from '../types/historical-period'
import type { Location } from '../types/location'

const EMPTY_FORM: StoryInput = {
  titleEn: '',
  titleFr: '',
  shortDescriptionEn: '',
  shortDescriptionFr: '',
  fullStoryEn: '',
  fullStoryFr: '',
  coverImageUrl: '',
  categoryId: '',
  locationId: '',
}

export function StoryFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { getToken } = useKindeAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [dynasties, setDynasties] = useState<Dynasty[]>([])
  const [periods, setPeriods] = useState<HistoricalPeriod[]>([])

  const [form, setForm] = useState<StoryInput>(EMPTY_FORM)
  const [century, setCentury] = useState('')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reference data for the dropdowns — public routes, no token needed.
  useEffect(() => {
    Promise.all([fetchCategories(), fetchLocations(), fetchDynasties(), fetchHistoricalPeriods()]).then(
      ([c, l, d, p]) => {
        setCategories(c)
        setLocations(l)
        setDynasties(d)
        setPeriods(p)
      }
    )
  }, [])

  // In edit mode, load the existing story and pre-fill the form.
  useEffect(() => {
    if (!id) return
    getToken().then((token) => {
      if (!token) return
      fetchAdminStoryById(token, id).then((story) => {
        setForm({
          titleEn: story.titleEn,
          titleFr: story.titleFr,
          shortDescriptionEn: story.shortDescriptionEn,
          shortDescriptionFr: story.shortDescriptionFr,
          fullStoryEn: story.fullStoryEn,
          fullStoryFr: story.fullStoryFr,
          coverImageUrl: story.coverImageUrl,
          categoryId: story.categoryId,
          locationId: story.locationId,
          historicalPeriodId: story.historicalPeriodId ?? undefined,
          dynastyId: story.dynastyId ?? undefined,
        })
        setCentury(story.century?.toString() ?? '')
        setLoading(false)
      })
    })
  }, [id, getToken])

  function updateField<K extends keyof StoryInput>(field: K, value: StoryInput[K]) {
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

    const payload: StoryInput = {
      ...form,
      century: century ? Number(century) : undefined,
      historicalPeriodId: form.historicalPeriodId || undefined,
      dynastyId: form.dynastyId || undefined,
    }

    try {
      if (isEditing && id) {
        await updateStory(token, id, payload)
      } else {
        await createStory(token, payload)
      }
      navigate('/')
    } catch {
      setError("Impossible d'enregistrer l'histoire.")
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
      <h2>{isEditing ? "Modifier l'histoire" : 'Nouvelle histoire'}</h2>

      {error && <p className="error-text">{error}</p>}

      <label>
        Titre (français)
        <input
          value={form.titleFr}
          onChange={(e) => updateField('titleFr', e.target.value)}
          required
        />
      </label>

      <label>
        Titre (anglais)
        <input
          value={form.titleEn}
          onChange={(e) => updateField('titleEn', e.target.value)}
          required
        />
      </label>

      <label>
        Résumé court (français)
        <textarea
          value={form.shortDescriptionFr}
          onChange={(e) => updateField('shortDescriptionFr', e.target.value)}
          required
        />
      </label>

      <label>
        Résumé court (anglais)
        <textarea
          value={form.shortDescriptionEn}
          onChange={(e) => updateField('shortDescriptionEn', e.target.value)}
          required
        />
      </label>

      <label>
        Récit complet (français)
        <textarea
          value={form.fullStoryFr}
          onChange={(e) => updateField('fullStoryFr', e.target.value)}
          rows={8}
          required
        />
      </label>

      <label>
        Récit complet (anglais)
        <textarea
          value={form.fullStoryEn}
          onChange={(e) => updateField('fullStoryEn', e.target.value)}
          rows={8}
          required
        />
      </label>

      <label>
        URL de l'image de couverture
        <input
          value={form.coverImageUrl}
          onChange={(e) => updateField('coverImageUrl', e.target.value)}
          required
        />
      </label>

      <label>
        Siècle
        <input type="number" value={century} onChange={(e) => setCentury(e.target.value)} />
      </label>

      <label>
        Catégorie
        <select
          value={form.categoryId}
          onChange={(e) => updateField('categoryId', e.target.value)}
          required
        >
          <option value="" disabled>
            Choisir une catégorie
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameFr}
            </option>
          ))}
        </select>
      </label>

      <label>
        Localisation
        <select
          value={form.locationId}
          onChange={(e) => updateField('locationId', e.target.value)}
          required
        >
          <option value="" disabled>
            Choisir une localisation
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.nameFr}
            </option>
          ))}
        </select>
      </label>

      <label>
        Dynastie (optionnel)
        <select
          value={form.dynastyId ?? ''}
          onChange={(e) => updateField('dynastyId', e.target.value)}
        >
          <option value="">Aucune</option>
          {dynasties.map((dynasty) => (
            <option key={dynasty.id} value={dynasty.id}>
              {dynasty.nameFr}
            </option>
          ))}
        </select>
      </label>

      <label>
        Période historique (optionnel)
        <select
          value={form.historicalPeriodId ?? ''}
          onChange={(e) => updateField('historicalPeriodId', e.target.value)}
        >
          <option value="">Aucune</option>
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.nameFr}
            </option>
          ))}
        </select>
      </label>

      <div>
        <button type="submit" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>{' '}
        <button type="button" onClick={() => navigate('/')}>
          Annuler
        </button>
      </div>
    </form>

    {isEditing && id && <StoryImagesGallery storyId={id} />}
    </div>
  )
}
