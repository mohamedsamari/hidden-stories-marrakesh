import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StoryCard } from '@/components/story-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useLanguage } from '@/contexts/language-context';
import { useCategories } from '@/hooks/use-categories';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useStories } from '@/hooks/use-stories';
import { useTheme } from '@/hooks/use-theme';
import { pickTranslation } from '@/utils/translate';

export default function HomeScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const { stories, loading, error } = useStories(selectedCategoryId, debouncedSearch);
  const { categories } = useCategories();
  const { language } = useLanguage();
  const theme = useTheme();

  const categoryNameById = Object.fromEntries(
    categories.map((c) => [c.id, pickTranslation(c.nameEn, c.nameFr, language)])
  );
  const chips = [{ id: undefined, nameEn: 'All', nameFr: 'Tout' }, ...categories];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.wordmark}>
            Hidden Stories
          </ThemedText>
          <ThemedText type="smallBold" style={[styles.wordmarkSub, { color: theme.accent }]}>
            OF MARRAKESH
          </ThemedText>
        </View>

        <View style={[styles.searchRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Ionicons name="search" color={theme.textSecondary} size={14} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={pickTranslation('Search stories…', 'Rechercher une histoire…', language)}
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          {chips.map((chip) => {
            const isActive = chip.id === selectedCategoryId;
            return (
              <Pressable
                key={chip.id ?? 'all'}
                onPress={() => setSelectedCategoryId(chip.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? theme.tint : theme.backgroundElement,
                    borderColor: isActive ? theme.tint : theme.border,
                  },
                ]}>
                <ThemedText
                  type="smallBold"
                  themeColor="textSecondary"
                  style={isActive && styles.chipTextActive}>
                  {pickTranslation(chip.nameEn, chip.nameFr, language)}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {loading ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" />
        </ThemedView>
      ) : error ? (
        <ThemedView style={styles.centered}>
          <ThemedText type="small" themeColor="textSecondary">
            {error}
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
  },
  wordmark: {
    fontSize: 20,
    lineHeight: 24,
  },
  wordmarkSub: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  chipRow: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Spacing.five,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipTextActive: {
    color: '#ffffff',
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
  },
  listContent: {
    gap: Spacing.three,
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});
