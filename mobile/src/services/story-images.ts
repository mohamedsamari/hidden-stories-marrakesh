import { API_BASE_URL } from '@/constants/api';
import { StoryImage } from '@/types/story-image';

export async function fetchStoryImages(storyId: string): Promise<StoryImage[]> {
  const response = await fetch(`${API_BASE_URL}/stories/${storyId}/images`);

  if (!response.ok) {
    throw new Error(`Failed to fetch story images: ${response.status}`);
  }

  return response.json();
}
