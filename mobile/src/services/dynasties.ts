import { API_BASE_URL } from '@/constants/api';
import { Dynasty } from '@/types/dynasty';

export async function fetchDynasties(): Promise<Dynasty[]> {
  const response = await fetch(`${API_BASE_URL}/dynasties`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dynasties: ${response.status}`);
  }

  return response.json();
}
