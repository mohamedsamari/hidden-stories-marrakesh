import type { StoryImage } from '../types/story-image'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchAdminStoryImages(token: string, storyId: string): Promise<StoryImage[]> {
  const response = await fetch(`${API_BASE_URL}/admin/stories/${storyId}/images`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch story images: ${response.status}`)
  }
  return response.json()
}

export async function addStoryImage(
  token: string,
  storyId: string,
  imageUrl: string
): Promise<StoryImage> {
  const response = await fetch(`${API_BASE_URL}/admin/story-images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ storyId, imageUrl }),
  })
  if (!response.ok) {
    throw new Error(`Failed to add story image: ${response.status}`)
  }
  return response.json()
}

export async function deleteStoryImage(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/story-images/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Failed to delete story image: ${response.status}`)
  }
}
