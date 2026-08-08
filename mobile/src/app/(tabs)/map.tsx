import Mapbox, { Camera, MapView, MarkerView } from '@rnmapbox/maps';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/contexts/language-context';
import { useLocations } from '@/hooks/use-locations';
import { useStories } from '@/hooks/use-stories';
import { pickTranslation } from '@/utils/translate';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

const MARRAKESH_CENTER: [number, number] = [-7.99, 31.63];

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
    <MapView style={styles.map} styleURL="mapbox://styles/mapbox/streets-v12">
      <Camera centerCoordinate={MARRAKESH_CENTER} zoomLevel={13} />
      {locations.map((location) => {
        const story = storyByLocationId[location.id];
        return (
          <MarkerView
            key={location.id}
            coordinate={[location.longitude, location.latitude]}>
            <Pressable
              style={styles.marker}
              onPress={() => {
                if (story) {
                  router.push({ pathname: '/story/[id]', params: { id: story.id } });
                }
              }}>
              <Text style={styles.markerText}>
                {pickTranslation(location.nameEn, location.nameFr, language)}
              </Text>
            </Pressable>
          </MarkerView>
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
  marker: {
    backgroundColor: '#C1502E',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
