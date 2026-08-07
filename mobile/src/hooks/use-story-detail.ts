import { useEffect, useState } from 'react';

import { fetchDynasties } from '@/services/dynasties';
import { fetchHistoricalPeriods } from '@/services/historical-periods';
import { fetchLocationPlanPoints, fetchLocations } from '@/services/locations';
import { fetchStoryImages } from '@/services/story-images';
import { fetchStoryReferences } from '@/services/story-references';
import { fetchStoryById } from '@/services/stories';
import { Dynasty } from '@/types/dynasty';
import { HistoricalPeriod } from '@/types/historical-period';
import { Location } from '@/types/location';
import { LocationPlanPoint } from '@/types/location-plan-point';
import { Story } from '@/types/story';
import { StoryImage } from '@/types/story-image';
import { StoryReference } from '@/types/story-reference';

export function useStoryDetail(id: string) {
  const [story, setStory] = useState<Story | null>(null);
  const [images, setImages] = useState<StoryImage[]>([]);
  const [references, setReferences] = useState<StoryReference[]>([]);
  const [dynasty, setDynasty] = useState<Dynasty | null>(null);
  const [historicalPeriod, setHistoricalPeriod] = useState<HistoricalPeriod | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [planPoints, setPlanPoints] = useState<LocationPlanPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchStoryById(id),
      fetchStoryImages(id),
      fetchStoryReferences(id),
      fetchDynasties(),
      fetchHistoricalPeriods(),
      fetchLocations(),
    ])
      .then(([fetchedStory, fetchedImages, fetchedReferences, dynasties, periods, locations]) => {
        setStory(fetchedStory);
        setImages(fetchedImages);
        setReferences(fetchedReferences);
        setDynasty(dynasties.find((d) => d.id === fetchedStory.dynastyId) ?? null);
        setHistoricalPeriod(periods.find((p) => p.id === fetchedStory.historicalPeriodId) ?? null);
        const matchedLocation = locations.find((l) => l.id === fetchedStory.locationId) ?? null;
        setLocation(matchedLocation);
        return matchedLocation;
      })
      .then((matchedLocation) => {
        if (!matchedLocation?.planImageUrl) return [];
        return fetchLocationPlanPoints(matchedLocation.id);
      })
      .then(setPlanPoints)
      .catch(() => setError('Impossible de charger cette histoire.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { story, images, references, dynasty, historicalPeriod, location, planPoints, loading, error };
}
