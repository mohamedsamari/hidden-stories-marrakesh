import type { Location } from '../types/location'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface LocationInput {
  nameEn: string
  nameFr: string
  descriptionEn?: string
  descriptionFr?: string
  addressEn?: string
  addressFr?: string
  latitude: number
  longitude: number
  categoryId?: string
}

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/locations`)
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status}`)
  }
  return response.json()
}

export async function createLocation(token: string, data: LocationInput): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/admin/locations`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`Failed to create location: ${response.status}`)
  return response.json()
}

export async function updateLocation(token: string, id: string, data: LocationInput): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/admin/locations/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`Failed to update location: ${response.status}`)
  return response.json()
}

export async function deleteLocation(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/locations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(`Failed to delete location: ${response.status}`)
}
