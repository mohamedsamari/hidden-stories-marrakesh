import { useEffect, useState } from 'react';

import { fetchLocations } from '@/services/locations';
import { Location } from '@/types/location';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  }, []);

  return { locations, loading };
}
