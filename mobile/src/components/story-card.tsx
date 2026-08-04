import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useFavorites } from '@/contexts/favorites-context';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/hooks/use-theme';
import { Story } from '@/types/story';
import { toRoman } from '@/utils/roman-numeral';
import { pickTranslation } from '@/utils/translate';

export function StoryCard({ story, categoryName }: { story: Story; categoryName?: string }) {
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { language } = useLanguage();

  return (
    <Pressable onPress={() => router.push({ pathname: '/story/[id]', params: { id: story.id } })}>
      <ThemedView type="backgroundElement" style={[styles.container, { borderColor: theme.border }]}>
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: story.coverImageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          <Pressable
            onPress={() => toggleFavorite(story.id)}
            style={styles.favoriteButton}
            hitSlop={8}>
            <Ionicons
              name={isFavorite(story.id) ? 'heart' : 'heart-outline'}
              color={isFavorite(story.id) ? theme.accent : '#ffffff'}
              size={16}
            />
          </Pressable>

          {story.century !== null && (
            <ThemedView style={styles.centuryBadge}>
              <ThemedText type="smallBold" style={styles.centuryText}>
                {language === 'fr'
                  ? `${toRoman(story.century)}ᵉ siècle`
                  : `${story.century}th century`}
              </ThemedText>
            </ThemedView>
          )}
        </View>

        <ThemedView style={styles.textContainer}>
          {categoryName && (
            <ThemedText type="smallBold" style={[styles.categoryTag, { color: theme.tint }]}>
              {categoryName.toUpperCase()}
            </ThemedText>
          )}
          <ThemedText type="subtitle" style={styles.title}>
            {pickTranslation(story.titleEn, story.titleFr, language)}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {pickTranslation(story.shortDescriptionEn, story.shortDescriptionFr, language)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  coverContainer: {
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 16, 20, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centuryBadge: {
    position: 'absolute',
    left: Spacing.two,
    bottom: Spacing.two,
    backgroundColor: 'rgba(15, 16, 20, 0.55)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.five,
  },
  centuryText: {
    color: '#ffffff',
    fontSize: 11,
  },
  textContainer: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  categoryTag: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
