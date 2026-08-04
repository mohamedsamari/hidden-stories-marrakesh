import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Speech from 'expo-speech';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useFavorites } from '@/contexts/favorites-context';
import { useLanguage } from '@/contexts/language-context';
import { useCategories } from '@/hooks/use-categories';
import { useStoryDetail } from '@/hooks/use-story-detail';
import { useTheme } from '@/hooks/use-theme';
import { toRoman } from '@/utils/roman-numeral';
import { pickTranslation } from '@/utils/translate';

type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption: string };

// The seed content only ever uses a leading "# Title" (redundant with the
// screen's own title, so it's dropped) and inline "![caption](url)" images.
// A full markdown library would be overkill for these two constructs.
function parseStoryContent(markdown: string): ContentBlock[] {
  return markdown
    .split('\n\n')
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap((block): ContentBlock[] => {
      if (block.startsWith('# ')) {
        return [];
      }
      const imageMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        return [{ type: 'image', caption: imageMatch[1], url: imageMatch[2] }];
      }
      return [{ type: 'paragraph', text: block }];
    });
}

function MetaChip({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.metaChip, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { story, images, references, dynasty, historicalPeriod, location, loading, error } =
    useStoryDetail(id);
  const { categories } = useCategories();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { language } = useLanguage();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  function handleToggleListen(narrationText: string) {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    if (!narrationText) return;
    setSpeaking(true);
    Speech.speak(narrationText, {
      language: language === 'fr' ? 'fr-FR' : 'en-US',
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !story) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="small" themeColor="textSecondary">
          {error ?? 'Histoire introuvable.'}
        </ThemedText>
      </ThemedView>
    );
  }

  const category = categories.find((c) => c.id === story.categoryId);
  const categoryName = category && pickTranslation(category.nameEn, category.nameFr, language);
  const contentBlocks = parseStoryContent(
    pickTranslation(story.fullStoryEn, story.fullStoryFr, language)
  );
  const narrationText = contentBlocks
    .filter((block): block is Extract<ContentBlock, { type: 'paragraph' }> => block.type === 'paragraph')
    .map((block) => block.text)
    .join('\n\n');

  const openInMaps = () => {
    if (!location) return;
    const { latitude, longitude, nameEn, nameFr } = location;
    const name = pickTranslation(nameEn, nameFr, language);
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${name})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.hero}>
          <Image source={{ uri: story.coverImageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={[styles.heroTop, { paddingTop: insets.top + Spacing.two }]}>
            <Pressable onPress={() => router.back()} style={styles.heroButton} hitSlop={8}>
              <Ionicons name="arrow-back" color="#ffffff" size={18} />
            </Pressable>
            <Pressable
              onPress={() => toggleFavorite(story.id)}
              style={styles.heroButton}
              hitSlop={8}>
              <Ionicons
                name={isFavorite(story.id) ? 'heart' : 'heart-outline'}
                color={isFavorite(story.id) ? theme.accent : '#ffffff'}
                size={18}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          <ThemedText type="title" style={styles.title}>
            {pickTranslation(story.titleEn, story.titleFr, language)}
          </ThemedText>

          <View style={styles.metaRow}>
            {categoryName && <MetaChip label={categoryName} />}
            {story.century !== null && (
              <MetaChip
                label={
                  language === 'fr'
                    ? `${toRoman(story.century)}ᵉ siècle`
                    : `${story.century}th century`
                }
              />
            )}
            {dynasty && (
              <MetaChip
                label={pickTranslation(
                  `${dynasty.nameEn} dynasty`,
                  `Dynastie ${dynasty.nameFr}`,
                  language
                )}
              />
            )}
            {historicalPeriod && (
              <MetaChip label={pickTranslation(historicalPeriod.nameEn, historicalPeriod.nameFr, language)} />
            )}
          </View>

          <Pressable
            onPress={() => handleToggleListen(narrationText)}
            style={[styles.mapButton, { borderColor: theme.tint }]}>
            <Ionicons
              name={speaking ? 'stop-circle-outline' : 'volume-high-outline'}
              color={theme.tint}
              size={16}
            />
            <ThemedText type="smallBold" style={{ color: theme.tint }}>
              {speaking
                ? pickTranslation('Stop listening', 'Arrêter la lecture', language)
                : pickTranslation('Listen to the story', "Écouter l'histoire", language)}
            </ThemedText>
          </Pressable>

          <View style={styles.prose}>
            {contentBlocks.map((block, index) =>
              block.type === 'image' ? (
                <View key={index} style={[styles.inlineFigure, { borderColor: theme.border }]}>
                  <Image source={{ uri: block.url }} style={styles.inlineImage} contentFit="cover" />
                  {block.caption && (
                    <ThemedText
                      type="small"
                      themeColor="textSecondary"
                      style={[styles.inlineCaption, { backgroundColor: theme.backgroundElement }]}>
                      {block.caption}
                    </ThemedText>
                  )}
                </View>
              ) : (
                <ThemedText key={index} style={styles.paragraph}>
                  {block.text}
                </ThemedText>
              )
            )}
          </View>

          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gallery}>
              {images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.imageUrl }}
                  style={styles.galleryImage}
                  contentFit="cover"
                />
              ))}
            </ScrollView>
          )}

          {location && (
            <Pressable
              onPress={openInMaps}
              style={[styles.mapButton, { borderColor: theme.tint }]}>
              <Ionicons name="location-outline" color={theme.tint} size={16} />
              <ThemedText type="smallBold" style={{ color: theme.tint }}>
                {pickTranslation('Open in Maps', 'Ouvrir dans Plans', language)}
              </ThemedText>
            </Pressable>
          )}

          {references.length > 0 && (
            <View style={styles.references}>
              <ThemedText type="smallBold" style={[styles.referencesTitle, { color: theme.accent }]}>
                {pickTranslation('REFERENCES & SOURCES', 'RÉFÉRENCES & SOURCES', language)}
              </ThemedText>
              {references.map((reference) => (
                <Pressable
                  key={reference.id}
                  onPress={() => reference.url && Linking.openURL(reference.url)}
                  style={[styles.referenceRow, { borderColor: theme.border }]}>
                  <ThemedText type="small" style={styles.referenceLabel}>
                    {reference.label}
                  </ThemedText>
                  {reference.url && (
                    <Ionicons name="open-outline" color={theme.textSecondary} size={14} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    height: 260,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
  },
  heroButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 16, 20, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metaChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
    borderWidth: StyleSheet.hairlineWidth,
  },
  prose: {
    gap: Spacing.three,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
  },
  inlineFigure: {
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  inlineImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  inlineCaption: {
    padding: Spacing.two,
  },
  gallery: {
    gap: Spacing.two,
  },
  galleryImage: {
    width: 140,
    height: 100,
    borderRadius: Spacing.two,
  },
  mapButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  references: {
    gap: Spacing.one,
  },
  referencesTitle: {
    letterSpacing: 0.5,
    marginBottom: Spacing.one,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  referenceLabel: {
    flex: 1,
  },
});
