import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { type FormEvent, useEffect, useState } from 'react'

import {
  createSimpleEntity,
  deleteSimpleEntity,
  updateSimpleEntity,
  type SimpleEntity,
} from '../services/admin-simple-entities'

interface Props {
  title: string
  resourcePath: string
  fetchEntities: () => Promise<SimpleEntity[]>
}

export function SimpleEntityListPage({ title, resourcePath, fetchEntities }: Props) {
  const { getToken } = useKindeAuth()
  const [entities, setEntities] = useState<SimpleEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [nameFr, setNameFr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchEntities()
      .then(setEntities)
      .finally(() => setLoading(false))
  }, [fetchEntities])

  function resetForm() {
    setEditingId(null)
    setNameFr('')
    setNameEn('')
  }

  function startEdit(entity: SimpleEntity) {
    setEditingId(entity.id)
    setNameFr(entity.nameFr)
    setNameEn(entity.nameEn)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const token = await getToken()
    if (!token) return

    if (editingId) {
      const updated = await updateSimpleEntity(token, resourcePath, editingId, { nameFr, nameEn })
      setEntities((current) => current.map((e) => (e.id === updated.id ? updated : e)))
    } else {
      const created = await createSimpleEntity(token, resourcePath, { nameFr, nameEn })
      setEntities((current) => [...current, created])
    }
    resetForm()
  }

  async function handleDelete(entity: SimpleEntity) {
    if (!window.confirm(`Supprimer « ${entity.nameFr} » ?`)) return
    const token = await getToken()
    if (!token) return
    await deleteSimpleEntity(token, resourcePath, entity.id)
    setEntities((current) => current.filter((e) => e.id !== entity.id))
  }

  if (loading) {
    return <p>Chargement...</p>
  }

  return (
    <div>
      <h2>{title}</h2>

      <form onSubmit={handleSubmit} className="form-inline" style={{ marginBottom: '1.5rem' }}>
        <input
          placeholder="Nom (français)"
          value={nameFr}
          onChange={(e) => setNameFr(e.target.value)}
          required
        />
        <input
          placeholder="Nom (anglais)"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Annuler
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Français</th>
            <th>Anglais</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => (
            <tr key={entity.id}>
              <td>{entity.nameFr}</td>
              <td>{entity.nameEn}</td>
              <td className="actions-cell">
                <button onClick={() => startEdit(entity)}>Modifier</button>
                <button className="danger" onClick={() => handleDelete(entity)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
