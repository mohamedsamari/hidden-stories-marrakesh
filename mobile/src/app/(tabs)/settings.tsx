import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { Language, useLanguage } from '@/contexts/language-context';
import { ThemePreference, useThemePreference } from '@/contexts/theme-preference-context';
import { useTheme } from '@/hooks/use-theme';

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'system', label: 'Système', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Clair', icon: 'sunny-outline' },
  { value: 'dark', label: 'Sombre', icon: 'moon-outline' },
];

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export default function SettingsScreen() {
  const { themePreference, setThemePreference } = useThemePreference();
  const { language, setLanguage } = useLanguage();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Réglages
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" style={[styles.sectionTitle, { color: theme.accent }]}>
            APPARENCE
          </ThemedText>

          <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
            {THEME_OPTIONS.map((option, index) => {
              const isActive = option.value === themePreference;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setThemePreference(option.value)}
                  style={[
                    styles.row,
                    index < THEME_OPTIONS.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.border,
                    },
                  ]}>
                  <Ionicons
                    name={option.icon}
                    color={isActive ? theme.tint : theme.textSecondary}
                    size={18}
                  />
                  <ThemedText type="default" style={styles.rowLabel}>
                    {option.label}
                  </ThemedText>
                  {isActive && <Ionicons name="checkmark" color={theme.tint} size={18} />}
                </Pressable>
              );
            })}
          </ThemedView>
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" style={[styles.sectionTitle, { color: theme.accent }]}>
            LANGUE
          </ThemedText>

          <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
            {LANGUAGE_OPTIONS.map((option, index) => {
              const isActive = option.value === language;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setLanguage(option.value)}
                  style={[
                    styles.row,
                    index < LANGUAGE_OPTIONS.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.border,
                    },
                  ]}>
                  <ThemedText
                    type="default"
                    style={[styles.rowLabel, { color: isActive ? theme.tint : theme.text }]}>
                    {option.label}
                  </ThemedText>
                  {isActive && <Ionicons name="checkmark" color={theme.tint} size={18} />}
                </Pressable>
              );
            })}
          </ThemedView>
        </View>
      </SafeAreaView>
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
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  section: {
    marginTop: Spacing.five,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  sectionTitle: {
    letterSpacing: 0.5,
    marginLeft: Spacing.one,
  },
  card: {
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowLabel: {
    flex: 1,
  },
});
