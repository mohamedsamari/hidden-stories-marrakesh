import { Ionicons } from '@expo/vector-icons';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet } from 'react-native';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/contexts/theme-preference-context';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/(tabs)" asChild>
            <TabButton icon="compass-outline" iconFocused="compass">Accueil</TabButton>
          </TabTrigger>
          <TabTrigger name="favorites" href="/(tabs)/favorites" asChild>
            <TabButton icon="heart-outline" iconFocused="heart">Favoris</TabButton>
          </TabTrigger>
          <TabTrigger name="map" href="/(tabs)/map" asChild>
            <TabButton icon="map-outline" iconFocused="map">Carte</TabButton>
          </TabTrigger>
          <TabTrigger name="assistant" href="/(tabs)/assistant" asChild>
            <TabButton icon="sparkles-outline" iconFocused="sparkles">Assistant</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/(tabs)/settings" asChild>
            <TabButton icon="settings-outline" iconFocused="settings">Réglages</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

interface ExtendedTabButtonProps extends TabTriggerSlotProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconFocused?: keyof typeof Ionicons.glyphMap;
}

export function TabButton({ children, isFocused, icon, iconFocused, ...props }: ExtendedTabButtonProps) {
  const { resolvedScheme } = useThemePreference();
  const colors = Colors[resolvedScheme];
  const iconName = isFocused ? (iconFocused || icon) : icon;

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={16}
            color={isFocused ? colors.tint : colors.textSecondary}
          />
        )}
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { resolvedScheme } = useThemePreference();
  const colors = Colors[resolvedScheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Hidden Stories Marrakesh
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView tintColor={colors.text} name="arrow.up.right.square" size={12} />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
