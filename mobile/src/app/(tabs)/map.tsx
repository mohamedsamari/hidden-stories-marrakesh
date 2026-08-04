import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/contexts/language-context';
import { useLocations } from '@/hooks/use-locations';
import { useStories } from '@/hooks/use-stories';
import { pickTranslation } from '@/utils/translate';

const MARRAKESH_REGION = {
  latitude: 31.63,
  longitude: -7.99,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const { locations, loading: locationsLoading } = useLocations();
  const { stories, loading: storiesLoading } = useStories();
  const { language } = useLanguage();

  const storyByLocationId = useMemo(
    () => Object.fromEntries(stories.map((story) => [story.locationId, story])),
    [stories]
  );

  if (locationsLoading || storiesLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <MapView style={styles.map} initialRegion={MARRAKESH_REGION}>
      {locations.map((location) => {
        const story = storyByLocationId[location.id];
        return (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={pickTranslation(location.nameEn, location.nameFr, language)}
            description={
              story ? pickTranslation(story.titleEn, story.titleFr, language) : undefined
            }
            onCalloutPress={() => {
              if (story) {
                router.push({ pathname: '/story/[id]', params: { id: story.id } });
              }
            }}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
