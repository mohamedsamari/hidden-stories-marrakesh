import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { deleteLocation, fetchLocations } from '../services/locations'
import type { Location } from '../types/location'

export function LocationsListPage() {
  const { getToken } = useKindeAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(location: Location) {
    if (!window.confirm(`Supprimer « ${location.nameFr} » ?`)) return
    const token = await getToken()
    if (!token) return
    await deleteLocation(token, location.id)
    setLocations((current) => current.filter((l) => l.id !== location.id))
  }

  if (loading) {
    return <p>Chargement...</p>
  }

  return (
    <div>
      <h2>Lieux</h2>
      <p>
        <Link to="/locations/new">+ Ajouter un lieu</Link>
      </p>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Coordonnées</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>{location.nameFr}</td>
              <td>{location.addressFr ?? '—'}</td>
              <td>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </td>
              <td className="actions-cell">
                <Link to={`/locations/${location.id}/edit`}>Modifier</Link>
                <button className="danger" onClick={() => handleDelete(location)}>
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
