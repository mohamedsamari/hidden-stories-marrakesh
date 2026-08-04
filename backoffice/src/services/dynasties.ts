import type { Dynasty } from '../types/dynasty'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchDynasties(): Promise<Dynasty[]> {
  const response = await fetch(`${API_BASE_URL}/dynasties`)
  if (!response.ok) {
    throw new Error(`Failed to fetch dynasties: ${response.status}`)
  }
  return response.json()
}
