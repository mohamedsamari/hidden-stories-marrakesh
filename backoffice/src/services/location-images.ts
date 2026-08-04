import type { LocationImage } from '../types/location-image'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchLocationImages(locationId: string): Promise<LocationImage[]> {
  const response = await fetch(`${API_BASE_URL}/locations/${locationId}/images`)
  if (!response.ok) {
    throw new Error(`Failed to fetch location images: ${response.status}`)
  }
  return response.json()
}

export async function addLocationImage(
  token: string,
  locationId: string,
  imageUrl: string
): Promise<LocationImage> {
  const response = await fetch(`${API_BASE_URL}/admin/location-images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ locationId, imageUrl }),
  })
  if (!response.ok) {
    throw new Error(`Failed to add location image: ${response.status}`)
  }
  return response.json()
}

export async function deleteLocationImage(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/location-images/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Failed to delete location image: ${response.status}`)
  }
}

export async function setCoverLocationImage(token: string, id: string): Promise<LocationImage> {
  const response = await fetch(`${API_BASE_URL}/admin/location-images/${id}/set-cover`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Failed to set cover image: ${response.status}`)
  }
  return response.json()
}
