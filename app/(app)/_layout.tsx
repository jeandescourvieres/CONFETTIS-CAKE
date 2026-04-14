import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Radii } from '@constants/theme';
import { useThemeStore } from '../../src/stores/themeStore';

function HomeTabButton(props: React.ComponentProps<typeof TouchableOpacity>) {
  const router = useRouter();
  return (
    <TouchableOpacity
      {...props}
      onPress={() => router.replace('/(app)' as never)}
    />
  );
}

function CalendarIcon({ focused }: { focused: boolean }) {
  const day = new Date().getDate();
  const color = focused ? Colors.primary : Colors.outlineVariant;
  return (
    <View style={[calStyles.wrap, focused && { borderColor: Colors.primary }]}>
      <View style={[calStyles.header, { backgroundColor: focused ? Colors.primary : Colors.outlineVariant }]} />
      <Text style={[calStyles.day, { color }]}>{day}</Text>
    </View>
  );
}

const calStyles = StyleSheet.create({
  wrap: {
    width: 26,
    height: 26,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 7,
  },
  day: {
    fontSize: 11,
    fontFamily: 'BeVietnamPro_700Bold',
    lineHeight: 17,
  },
});

// Icônes Unicode Material-style simplifiées (remplacé par expo-icons en Phase 2)
const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  index:     { active: '🏠', inactive: '🏠' },
  dashboard: { active: '📊', inactive: '📊' },
};

const TAB_LABELS: Record<string, string> = {
  index:     'Accueil',
  dashboard: 'Mon tableau de bord',
};

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const appTheme = useThemeStore((s) => s.theme);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () => <View style={styles.tabBarBg} />,
        tabBarIcon: ({ focused }) => {
          const icon = TAB_ICONS[route.name];
          return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Text style={styles.iconText}>{focused ? icon?.active : icon?.inactive}</Text>
            </View>
          );
        },
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
            {TAB_LABELS[route.name] ?? route.name}
          </Text>
        ),
        tabBarActiveTintColor: appTheme.primary,
        tabBarInactiveTintColor: Colors.outlineVariant,
      })}
    >
      <Tabs.Screen name="index" options={{ tabBarButton: (props) => <HomeTabButton {...props} /> }} />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="create/index" options={{ href: null }} />

      {/* Écrans sans onglet (anciens onglets) */}
      <Tabs.Screen name="calendar" options={{ href: null }} />
      <Tabs.Screen name="creations" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />

      {/* Écrans sans onglet */}
      <Tabs.Screen name="contact/[id]" options={{ href: null }} />
      <Tabs.Screen name="contacts/index" options={{ href: null }} />
      <Tabs.Screen name="contacts/new" options={{ href: null }} />
      <Tabs.Screen name="contacts/import" options={{ href: null }} />
      <Tabs.Screen name="create/preview" options={{ href: null }} />
      <Tabs.Screen name="create/sent" options={{ href: null }} />
      <Tabs.Screen name="studio/index" options={{ href: null }} />
      <Tabs.Screen name="preview/index" options={{ href: null }} />
      <Tabs.Screen name="sent/index" options={{ href: null }} />
      <Tabs.Screen name="calendar/new-event" options={{ href: null }} />
      <Tabs.Screen name="message/[id]" options={{ href: null }} />
      <Tabs.Screen name="profile/premium" options={{ href: null }} />
      <Tabs.Screen name="qr/[id]" options={{ href: null }} />
      <Tabs.Screen name="notifications/index" options={{ href: null }} />
      <Tabs.Screen name="referral/index" options={{ href: null }} />
      <Tabs.Screen name="pot/index" options={{ href: null }} />
      <Tabs.Screen name="pot/[id]" options={{ href: null }} />
      <Tabs.Screen name="pot/new" options={{ href: null }} />
      <Tabs.Screen name="cards/index" options={{ href: null }} />
      <Tabs.Screen name="cards/[id]"  options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerHighest,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radii.full,
  },
  iconWrapActive: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  iconText: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: Typography.xs - 1,
    fontFamily: 'BeVietnamPro_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: Colors.outlineVariant,
    marginTop: 1,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});
