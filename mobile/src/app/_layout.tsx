import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemePreferenceProvider, useThemePreference } from '@/contexts/theme-preference-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <RootLayoutContent />
        </FavoritesProvider>
      </LanguageProvider>
    </ThemePreferenceProvider>
  );
}

function RootLayoutContent() {
  const { resolvedScheme } = useThemePreference();
  return (
    <ThemeProvider value={resolvedScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="story/[id]" />
      </Stack>
    </ThemeProvider>
  );
}
