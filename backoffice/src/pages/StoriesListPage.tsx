import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { deleteStory, fetchAdminStories, setStoryPublished } from '../services/stories'
import type { Story } from '../types/story'

export function StoriesListPage() {
  const { getToken } = useKindeAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getToken()
      .then((token) => {
        if (!token) {
          throw new Error('No token available')
        }
        return fetchAdminStories(token)
      })
      .then(setStories)
      .catch(() => setError('Impossible de charger les histoires.'))
      .finally(() => setLoading(false))
  }, [getToken])

  async function handleTogglePublish(story: Story) {
    const token = await getToken()
    if (!token) return
    const updated = await setStoryPublished(token, story.id, !story.isPublished)
    setStories((current) => current.map((s) => (s.id === updated.id ? updated : s)))
  }

  async function handleDelete(story: Story) {
    const confirmed = window.confirm(`Supprimer « ${story.titleFr} » ? Cette action est irréversible.`)
    if (!confirmed) return

    const token = await getToken()
    if (!token) return
    await deleteStory(token, story.id)
    setStories((current) => current.filter((s) => s.id !== story.id))
  }

  if (loading) {
    return <p>Chargement...</p>
  }

  if (error) {
    return <p className="error-text">{error}</p>
  }

  return (
    <div>
      <h2>Histoires</h2>
      <p>
        <Link to="/stories/new">+ Ajouter une histoire</Link>
      </p>
      <table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Siècle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stories.map((story) => (
            <tr key={story.id}>
              <td>{story.titleFr}</td>
              <td>{story.century ?? '—'}</td>
              <td>{story.isPublished ? 'Publié' : 'Brouillon'}</td>
              <td className="actions-cell">
                <Link to={`/stories/${story.id}/edit`}>Modifier</Link>
                <button onClick={() => handleTogglePublish(story)}>
                  {story.isPublished ? 'Dépublier' : 'Publier'}
                </button>
                <button className="danger" onClick={() => handleDelete(story)}>
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
