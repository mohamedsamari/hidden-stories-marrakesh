import type { HistoricalPeriod } from '../types/historical-period'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchHistoricalPeriods(): Promise<HistoricalPeriod[]> {
  const response = await fetch(`${API_BASE_URL}/historical-periods`)
  if (!response.ok) {
    throw new Error(`Failed to fetch historical periods: ${response.status}`)
  }
  return response.json()
}
