import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import { useThemePreference } from '@/contexts/theme-preference-context';

export default function AppTabs() {
  const { resolvedScheme } = useThemePreference();
  const colors = Colors[resolvedScheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={require('@/assets/images/tabIcons/home.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favorites">
        <Label>Favoris</Label>
        <Icon src={require('@/assets/images/tabIcons/favorites.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="map">
        <Label>Carte</Label>
        <Icon src={require('@/assets/images/tabIcons/map.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="assistant">
        <Label>Assistant</Label>
        <Icon src={require('@/assets/images/tabIcons/assistant.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Réglages</Label>
        <Icon src={require('@/assets/images/tabIcons/settings.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
