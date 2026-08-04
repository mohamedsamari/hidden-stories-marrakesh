import type { Story } from '../types/story'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface StoryInput {
  titleEn: string
  titleFr: string
  shortDescriptionEn: string
  shortDescriptionFr: string
  fullStoryEn: string
  fullStoryFr: string
  coverImageUrl: string
  century?: number
  categoryId: string
  locationId: string
  historicalPeriodId?: string
  dynastyId?: string
}

export async function fetchAdminStories(token: string): Promise<Story[]> {
  const response = await fetch(`${API_BASE_URL}/admin/stories`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch stories: ${response.status}`)
  }

  return response.json()
}

export async function fetchAdminStoryById(token: string, id: string): Promise<Story> {
  const response = await fetch(`${API_BASE_URL}/admin/stories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch story: ${response.status}`)
  }

  return response.json()
}

export async function createStory(token: string, data: StoryInput): Promise<Story> {
  const response = await fetch(`${API_BASE_URL}/admin/stories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create story: ${response.status}`)
  }

  return response.json()
}

export async function updateStory(token: string, id: string, data: StoryInput): Promise<Story> {
  const response = await fetch(`${API_BASE_URL}/admin/stories/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update story: ${response.status}`)
  }

  return response.json()
}

export async function setStoryPublished(
  token: string,
  id: string,
  publish: boolean
): Promise<Story> {
  const response = await fetch(`${API_BASE_URL}/admin/stories/${id}/${publish ? 'publish' : 'unpublish'}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to update story: ${response.status}`)
  }

  return response.json()
}

export async function deleteStory(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/stories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete story: ${response.status}`)
  }
}
