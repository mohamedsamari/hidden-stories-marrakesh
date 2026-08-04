import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StoryCard } from '@/components/story-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useFavorites } from '@/contexts/favorites-context';
import { useLanguage } from '@/contexts/language-context';
import { useCategories } from '@/hooks/use-categories';
import { useFavoriteStories } from '@/hooks/use-favorite-stories';
import { useTheme } from '@/hooks/use-theme';
import { pickTranslation } from '@/utils/translate';

export default function FavoritesScreen() {
  const { favoriteIds } = useFavorites();
  const { stories, loading } = useFavoriteStories(favoriteIds);
  const { categories } = useCategories();
  const { language } = useLanguage();
  const theme = useTheme();

  const categoryNameById = Object.fromEntries(
    categories.map((c) => [c.id, pickTranslation(c.nameEn, c.nameFr, language)])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Favoris
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {stories.length} histoire{stories.length !== 1 ? 's' : ''} enregistrée
            {stories.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        <View
          style={[styles.note, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Ionicons name="phone-portrait-outline" color={theme.accent} size={14} />
          <ThemedText type="small" themeColor="textSecondary" style={styles.noteText}>
            Enregistrés uniquement sur cet appareil — aucun compte requis.
          </ThemedText>
        </View>
      </SafeAreaView>

      {loading ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" />
        </ThemedView>
      ) : stories.length === 0 ? (
        <ThemedView style={styles.centered}>
          <Ionicons name="heart-outline" color={theme.textSecondary} size={32} />
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
            Aucun favori pour l&apos;instant. Tape sur le cœur d&apos;une histoire pour l&apos;ajouter
            ici.
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(story) => story.id}
          renderItem={({ item }) => (
            <StoryCard story={item} categoryName={categoryNameById[item.categoryId]} />
          )}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.half,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  noteText: {
    flex: 1,
  },
  list: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.six,
  },
  emptyText: {
    textAlign: 'center',
  },
  listContent: {
    gap: Spacing.three,
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
