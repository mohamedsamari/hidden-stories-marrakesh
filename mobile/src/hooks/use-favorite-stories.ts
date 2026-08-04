import { useEffect, useState } from 'react';

import { fetchStoryById } from '@/services/stories';
import { Story } from '@/types/story';

export function useFavoriteStories(favoriteIds: string[]) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setStories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.allSettled(favoriteIds.map((id) => fetchStoryById(id))).then((results) => {
      const found = results
        .filter((result): result is PromiseFulfilledResult<Story> => result.status === 'fulfilled')
        .map((result) => result.value);
      setStories(found);
      setLoading(false);
    });
  }, [favoriteIds]);

  return { stories, loading };
}
