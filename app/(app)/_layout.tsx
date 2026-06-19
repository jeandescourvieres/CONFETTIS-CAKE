import { Tabs, useRouter, useSegments } from 'expo-router';
import type React from 'react';
const TabsAny = Tabs as React.ComponentType<any>;
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Radii, Spacing } from '@constants/theme';
import { useThemeStore } from '../../src/stores/themeStore';
import { scrollToTopRegistry } from '../../src/utils/scrollRegistry';
import { useTablet } from '../../src/hooks/useTablet';

// ── Tabs visibles (13 items dans l'ordre demandé) ─────────────────────────────
const VISIBLE_TABS: { routeName: string; emoji: string; label: string }[] = [
  { routeName: 'index',           emoji: '🏠', label: 'Accueil'        },
  { routeName: 'dashboard',       emoji: '📊', label: 'Tableau de bord'},
  { routeName: 'contacts/index',  emoji: '👥', label: 'Contacts'       },
  { routeName: 'create/index',    emoji: '✨', label: 'Créer message'  },
  { routeName: 'cards/index',     emoji: '✨', label: 'Animation'     },
  { routeName: 'profile',         emoji: '👤', label: 'Mon profil'     },
  { routeName: 'notes',           emoji: '📝', label: 'Notes'          },
  { routeName: 'creations',       emoji: '💬', label: 'Messages'       },
  { routeName: 'agenda',          emoji: '📅', label: 'Agenda'         },
  { routeName: 'search/index',    emoji: '🔍', label: 'Recherche'      },
  { routeName: 'compat/index',    emoji: '💑', label: 'Compatibilité'  },
  { routeName: 'explore',         emoji: '🔭', label: 'Explorer'       },
  { routeName: 'numerologie',     emoji: '🔢', label: 'Numérologie'    },
  { routeName: 'zodiac-season',   emoji: '⭐', label: 'Zodiaque'       },
  { routeName: 'animaux',         emoji: '🐾', label: 'Animaux'        },
  { routeName: 'pot/index',       emoji: '🎁', label: 'Cagnotte'       },
  { routeName: 'help',            emoji: '📖', label: 'Aide'           },
  { routeName: 'settings',        emoji: '⚙️', label: 'Paramètres'    },
];

// ── Tab bar persistante (toujours visible) ────────────────────────────────────
function PersistentTabBar() {
  const insets = useSafeAreaInsets();
  const appTheme = useThemeStore((s) => s.theme);
  const primary = appTheme?.primary ?? Colors.primary;
  const router = useRouter();
  const segments = useSegments();
  const { isTablet } = useTablet();

  // segments = ['(app)', 'dashboard'] ou ['(app)', 'contacts', 'new'] etc.
  const seg1 = (segments[1] ?? '') as string;

  return (
    <View style={[tabStyles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[tabStyles.scrollContent, isTablet && tabStyles.scrollContentTablet]}
        bounces={false}
      >
        {VISIBLE_TABS.map((tab) => {
          const firstPart = tab.routeName.split('/')[0];
          let isFocused = false;
          if (tab.routeName === 'index') {
            isFocused = seg1 === 'index' || seg1 === '';
          } else if (tab.routeName.includes('/')) {
            isFocused = seg1 === firstPart;
          } else {
            isFocused = seg1 === tab.routeName;
          }

          const onPress = () => {
            if (isFocused) {
              scrollToTopRegistry.trigger(tab.routeName);
              return;
            }
            if (tab.routeName === 'index') {
              router.navigate('/(app)/' as never);
            } else {
              const path = tab.routeName.replace('/index', '');
              router.navigate(`/(app)/${path}` as never);
            }
          };

          return (
            <TouchableOpacity
              key={tab.routeName}
              style={[tabStyles.item, isTablet && tabStyles.itemTablet, isFocused && tabStyles.itemActive]}
              onPress={onPress}
              activeOpacity={0.75}
            >
              <Text style={[tabStyles.emoji, isTablet && tabStyles.emojiTablet]}>{tab.emoji}</Text>
              <Text style={[tabStyles.label, isTablet && tabStyles.labelTablet, isFocused && { color: primary }]}>
                {tab.label}
              </Text>
              {isFocused && (
                <View style={[tabStyles.activeDot, { backgroundColor: primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerHighest,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[2],
    paddingTop: 5,
    paddingBottom: 3,
    gap: 4,
  },
  scrollContentTablet: {
    paddingHorizontal: Spacing[6],
    gap: 8,
    alignSelf: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radii.md,
    minWidth: 60,
    gap: 1,
  },
  itemTablet: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 76,
    gap: 3,
  },
  itemActive: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  emoji: { fontSize: 18 },
  emojiTablet: { fontSize: 22 },
  label: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 10,
    color: Colors.outlineVariant,
    textAlign: 'center',
  },
  labelTablet: {
    fontSize: 12,
  },
  activeDot: {
    width: 4, height: 4, borderRadius: 2, marginTop: 1,
  },
});

// Hauteur fixe de la tab bar (emoji + label + padding, hors safe area)
export const TAB_BAR_CONTENT_HEIGHT = 48;

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const tabBarTotalHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <TabsAny
        tabBar={() => null}
        screenOptions={{ headerShown: false }}
        sceneContainerStyle={{ paddingBottom: tabBarTotalHeight }}
        backBehavior="history"
      >
        {/* ── 13 onglets visibles ────────────────────────── */}
        <Tabs.Screen name="index" />
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="contacts/index" />
        <Tabs.Screen name="notes" />
        <Tabs.Screen name="creations" />
        <Tabs.Screen name="agenda" />
        <Tabs.Screen name="search/index" />
        <Tabs.Screen name="compat/index" />
        <Tabs.Screen name="explore/index" />
        <Tabs.Screen name="explore/prenoms"           options={{ href: null }} />
        <Tabs.Screen name="numerologie" />
        <Tabs.Screen name="zodiac-season" />
        <Tabs.Screen name="animaux" />
        <Tabs.Screen name="help" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="settings" />

        {/* ── Écrans sans onglet ─────────────────────────── */}
        <Tabs.Screen name="create/index" />
        <Tabs.Screen name="calendar"               options={{ href: null }} />
        <Tabs.Screen name="calendar/new-event"     options={{ href: null }} />
        <Tabs.Screen name="contact/[id]"           options={{ href: null }} />
        <Tabs.Screen name="contacts/new"           options={{ href: null }} />
        <Tabs.Screen name="contacts/import"        options={{ href: null }} />
        <Tabs.Screen name="contacts/share"         options={{ href: null }} />
        <Tabs.Screen name="glossaire"              options={{ href: null }} />
        <Tabs.Screen name="create/preview"         options={{ href: null }} />
        <Tabs.Screen name="create/studio"          options={{ href: null }} />
        <Tabs.Screen name="create/sent"            options={{ href: null }} />
        <Tabs.Screen name="message/[id]"           options={{ href: null }} />
        <Tabs.Screen name="profile/premium"        options={{ href: null }} />
        <Tabs.Screen name="qr/index"               options={{ href: null }} />
        <Tabs.Screen name="qr/[id]"                options={{ href: null }} />
        <Tabs.Screen name="notifications/index"    options={{ href: null }} />
        <Tabs.Screen name="referral/index"         options={{ href: null }} />
        <Tabs.Screen name="pot/index"              options={{ href: null }} />
        <Tabs.Screen name="pot/[id]"               options={{ href: null }} />
        <Tabs.Screen name="pot/new"                options={{ href: null }} />
        <Tabs.Screen name="pot/contribute/[id]"    options={{ href: null }} />
        <Tabs.Screen name="couple/index"           options={{ href: null }} />
        <Tabs.Screen name="animaux/new"             options={{ href: null }} />
        <Tabs.Screen name="animal-message"         options={{ href: null }} />
        <Tabs.Screen name="animal-message-library" options={{ href: null }} />
        <Tabs.Screen name="youth-message-library"   options={{ href: null }} />
        <Tabs.Screen name="deteste-message-library" options={{ href: null }} />
        <Tabs.Screen name="ado-parent-library"      options={{ href: null }} />
        <Tabs.Screen name="mode-jeune"              options={{ href: null }} />
        <Tabs.Screen name="cards/index"            options={{}} />
        <Tabs.Screen name="cards/[id]"             options={{ href: null }} />
        <Tabs.Screen name="cards/ai-create"        options={{ href: null }} />
        <Tabs.Screen name="upcoming-events"        options={{ href: null }} />
        <Tabs.Screen name="auto-sends/index"       options={{ href: null }} />
        <Tabs.Screen name="auto-sends/new"         options={{ href: null }} />
        <Tabs.Screen name="contact-timeline/[id]"  options={{ href: null }} />
        <Tabs.Screen name="reminders/index"        options={{ href: null }} />
        <Tabs.Screen name="reminders/new"          options={{ href: null }} />
        <Tabs.Screen name="postcard/index"         options={{ href: null }} />
        <Tabs.Screen name="explore/noms"           options={{ href: null }} />
        <Tabs.Screen name="reactions/index"        options={{ href: null }} />
        <Tabs.Screen name="guestbook/index"        options={{ href: null }} />
        <Tabs.Screen name="features-intro"          options={{ href: null }} />
        <Tabs.Screen name="message-guide"           options={{ href: null }} />
        <Tabs.Screen name="cagnotte-guide"          options={{ href: null }} />
        <Tabs.Screen name="studio/index"           options={{ href: null }} />
        <Tabs.Screen name="cremaillere-library"    options={{ href: null }} />
        <Tabs.Screen name="depart-library"         options={{ href: null }} />
        <Tabs.Screen name="dix-huit-ans-library"   options={{ href: null }} />
        <Tabs.Screen name="timide-library"         options={{ href: null }} />
        <Tabs.Screen name="preview/index"          options={{ href: null }} />
        <Tabs.Screen name="sent/index"             options={{ href: null }} />
      </TabsAny>
      <PersistentTabBar />
    </View>
  );
}
