import { API_BASE_URL } from '@/constants/api';
import { StoryReference } from '@/types/story-reference';

export async function fetchStoryReferences(storyId: string): Promise<StoryReference[]> {
  const response = await fetch(`${API_BASE_URL}/stories/${storyId}/references`);

  if (!response.ok) {
    throw new Error(`Failed to fetch story references: ${response.status}`);
  }

  return response.json();
}
