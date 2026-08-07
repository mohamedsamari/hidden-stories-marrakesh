import { API_BASE_URL } from '@/constants/api';
import { Location } from '@/types/location';
import { LocationPlanPoint } from '@/types/location-plan-point';

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/locations`);

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status}`);
  }

  return response.json();
}

export async function fetchLocationPlanPoints(locationId: string): Promise<LocationPlanPoint[]> {
  const response = await fetch(`${API_BASE_URL}/locations/${locationId}/plan-points`);

  if (!response.ok) {
    throw new Error(`Failed to fetch plan points: ${response.status}`);
  }

  return response.json();
}
