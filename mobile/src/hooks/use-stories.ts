import { useEffect, useState } from 'react';

import { fetchStories } from '@/services/stories';
import { Story } from '@/types/story';

export function useStories(categoryId?: string, search?: string) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchStories(categoryId, search)
      .then(setStories)
      .catch(() => setError('Impossible de charger les histoires.'))
      .finally(() => setLoading(false));
  }, [categoryId, search]);

  return { stories, loading, error };
}
