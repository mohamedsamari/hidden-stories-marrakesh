import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const { stories, loading, error } = useStories(selectedCategoryId, debouncedSearch);
  const { categories } = useCategories();
  const { language } = useLanguage();
  const theme = useTheme();

  const categoryNameById = Object.fromEntries(
    categories.map((c) => [c.id, pickTranslation(c.nameEn, c.nameFr, language)])
  );
  const chips = [{ id: undefined, nameEn: 'All', nameFr: 'Tout' }, ...categories];

  function handleToggleSearch() {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchQuery('');
    } else {
      setSearchOpen(true);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[theme.tint, theme.accent, theme.background]}
        locations={[0, 0.55, 1]}
        style={styles.heroGradient}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <ThemedText type="subtitle" style={[styles.wordmark, styles.wordmarkOnGradient]}>
              Hidden Stories
            </ThemedText>
            <ThemedText type="smallBold" style={[styles.wordmarkSub, styles.wordmarkSubOnGradient]}>
              OF MARRAKESH
            </ThemedText>
          </View>

          <Pressable onPress={handleToggleSearch} style={styles.searchIconButton} hitSlop={8}>
            <Ionicons name={searchOpen ? 'close' : 'search'} color="#ffffff" size={18} />
          </Pressable>
        </View>

        {searchOpen && (
          <View style={[styles.searchRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <Ionicons name="search" color={theme.textSecondary} size={14} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={pickTranslation('Search stories…', 'Rechercher une histoire…', language)}
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
              autoFocus
            />
          </View>
        )}

        <Pressable
          onPress={() => router.push('/assistant')}
          style={[styles.chatHint, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={[styles.chatHintIcon, { backgroundColor: theme.tint }]}>
            <Ionicons name="sparkles" color="#ffffff" size={14} />
          </View>
          <View style={styles.chatHintText}>
            <ThemedText type="smallBold">
              {pickTranslation('Ask the AI assistant', 'Utiliser le chat', language)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {pickTranslation(
                'Ask about any monument, get answers instantly',
                "Pose une question sur un monument, obtiens une réponse instantanée",
                language
              )}
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" color={theme.textSecondary} size={16} />
        </Pressable>

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
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  safeArea: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  searchIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordmark: {
    fontSize: 20,
    lineHeight: 24,
  },
  wordmarkOnGradient: {
    color: '#ffffff',
  },
  wordmarkSubOnGradient: {
    color: 'rgba(255, 255, 255, 0.85)',
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
  chatHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    marginTop: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chatHintIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHintText: {
    flex: 1,
    gap: 2,
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
