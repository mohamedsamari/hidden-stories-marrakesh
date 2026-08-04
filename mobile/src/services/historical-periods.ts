import { API_BASE_URL } from '@/constants/api';
import { HistoricalPeriod } from '@/types/historical-period';

export async function fetchHistoricalPeriods(): Promise<HistoricalPeriod[]> {
  const response = await fetch(`${API_BASE_URL}/historical-periods`);

  if (!response.ok) {
    throw new Error(`Failed to fetch historical periods: ${response.status}`);
  }

  return response.json();
}
