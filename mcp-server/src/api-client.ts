const BACKEND_API_URL = process.env.BACKEND_API_URL ?? 'http://localhost:3000';

export interface Story {
  id: string;
  titleEn: string;
  titleFr: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  fullStoryEn: string;
  fullStoryFr: string;
  coverImageUrl: string;
  century: number | null;
  categoryId: string;
  locationId: string;
  historicalPeriodId: string | null;
  dynastyId: string | null;
}

export interface Category {
  id: string;
  nameEn: string;
  nameFr: string;
}

export async function searchStories(params: {
  search?: string;
  categoryId?: string;
}): Promise<Story[]> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.categoryId) query.set('categoryId', params.categoryId);

  const response = await fetch(`${BACKEND_API_URL}/stories?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to search stories: ${response.status}`);
  }
  return response.json();
}

export async function getStoryById(id: string): Promise<Story | null> {
  const response = await fetch(`${BACKEND_API_URL}/stories/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch story: ${response.status}`);
  }
  return response.json();
}

export async function listCategories(): Promise<Category[]> {
  const response = await fetch(`${BACKEND_API_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  return response.json();
}
