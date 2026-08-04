import { API_BASE_URL } from '@/constants/api';
import { Story } from '@/types/story';

export async function fetchStories(categoryId?: string, search?: string): Promise<Story[]> {
  const params = new URLSearchParams();
  if (categoryId) params.set('categoryId', categoryId);
  if (search) params.set('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';

  const response = await fetch(`${API_BASE_URL}/stories${query}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch stories: ${response.status}`);
  }

  return response.json();
}

export async function fetchStoryById(id: string): Promise<Story> {
  const response = await fetch(`${API_BASE_URL}/stories/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch story: ${response.status}`);
  }

  return response.json();
}
