// ═══════════════════════════════════════════════════════════════════
//  ConfettiCake — Landing page publique (confetticake.fr)
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Linking, Platform, useWindowDimensions, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import Animated, {
  FadeInUp, FadeInDown, FadeIn,
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSequence, Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, setLanguage, type AppLanguage } from '../src/i18n';
import { FR, DE, ES, IT, GB, BR } from 'country-flag-icons/react/3x2';

const FLAG_ICONS: Record<AppLanguage, React.ComponentType<{ style?: any }>> = {
  fr: FR, de: DE, es: ES, it: IT, en: GB, pt: BR,
};

const APP_STORE_URL = 'https://apps.apple.com/app/confettis-cake';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.confettiscake.app';

const VIOLET = '#9b6bb5';
const VIOLET_DARK = '#5e2d80';
const VIOLET_LIGHT = '#c084fc';

const ACCENT_COLORS = [VIOLET, '#F97316', '#EC4899'];

const FEATURE_VISUALS = [
  { emoji: '🎂', color: '#9b6bb5' },
  { emoji: '✨', color: '#F97316' },
  { emoji: '🎬', color: '#7C3AED' },
  { emoji: '🎁', color: '#EC4899' },
];

const STEP_VISUALS = [{ num: '1' }, { num: '2' }, { num: '3' }];

const AI_EXAMPLE_COUNT = 3;

const CARD_GALLERY_VISUALS = [
  { emoji: '🎈', colors: ['#9b6bb5', '#c084fc'] as const },
  { emoji: '💍', colors: ['#EC4899', '#F472B6'] as const },
  { emoji: '🎓', colors: ['#F97316', '#FBBF24'] as const },
  { emoji: '🌸', colors: ['#7C3AED', '#A78BFA'] as const },
  { emoji: '❄️', colors: ['#2563EB', '#60A5FA'] as const },
  { emoji: '💌', colors: ['#DB2777', '#FB7185'] as const },
];

const VALUE_VISUALS = [
  { emoji: '🔒', color: VIOLET },
  { emoji: '🇫🇷', color: '#F97316' },
  { emoji: '💜', color: '#EC4899' },
];

const CATEGORY_VISUALS = [
  { emoji: '🎯', itemCount: 1 },
  { emoji: '👥', itemCount: 6 },
  { emoji: '📅', itemCount: 6 },
  { emoji: '🔍', itemCount: 4 },
  { emoji: '🔢', itemCount: 3 },
  { emoji: '💞', itemCount: 3 },
  { emoji: '🎂', itemCount: 4 },
  { emoji: '✉️', itemCount: 7 },
  { emoji: '🤝', itemCount: 2 },
  { emoji: '🌍', itemCount: 2 },
];

const FAQ_COUNT = 4;

function CategoryCard({ emoji, title, items, onPress }: { emoji: string; title: string; items: { name: string; text: string }[]; onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.catCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.catCardEmoji}>{emoji}</Text>
      <Text style={styles.catCardTitle}>{title}</Text>
      <Text style={styles.catCount}>{t('landing.functionCount', { count: items.length })}</Text>
      <Text style={styles.catCardArrow}>+</Text>
    </TouchableOpacity>
  );
}

type CategoryType = { emoji: string; title: string; items: { name: string; text: string }[] } | null;

function CategoryModal({ cat, onClose }: { cat: CategoryType; onClose: () => void }) {
  if (!cat) return null;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalEmoji}>{cat.emoji}</Text>
            <Text style={styles.modalTitle}>{cat.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn} activeOpacity={0.7}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
            {cat.items.map((it) => (
              <View key={it.name} style={styles.catRow}>
                <Text style={styles.catBullet}>•</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.catItemName}>{it.name}</Text>
                  <Text style={styles.catItemText}>{it.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}


function openStore() {
  const url = Platform.select({ ios: APP_STORE_URL, default: PLAY_STORE_URL }) ?? PLAY_STORE_URL;
  Linking.openURL(url).catch(() => {});
}

// ── Soulignement façon "tracé à la main" sous les titres ──
function TitleSquiggle({ color = VIOLET_LIGHT, width = 96, rotate = '-2deg' }: { color?: string; width?: number; rotate?: string }) {
  return <View style={[styles.titleSquiggle, { backgroundColor: color, width, transform: [{ rotate }] }]} />;
}

// ── Sticker / post-it qui dépasse, façon scrapbook ──
function StickerNote({ text, color, rotate, style }: { text: string; color: string; rotate: string; style?: any }) {
  return (
    <View style={[styles.stickerNote, { backgroundColor: color, transform: [{ rotate }] }, style]}>
      <Text style={styles.stickerNoteText}>{text}</Text>
    </View>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={styles.faqItem} onPress={() => setOpen((o) => !o)} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{q}</Text>
        <Text style={styles.faqArrow}>{open ? '−' : '+'}</Text>
      </View>
      {open && <Text style={styles.faqAnswer}>{a}</Text>}
    </TouchableOpacity>
  );
}

// ── Feux d'artifice ──
const FW_COLORS = ['#FDE047', '#F472B6', '#60A5FA', '#34D399', '#C084FC', '#FB7185', '#FF9800', '#fff'];
const FW_ANGLES_A = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345];
const FW_ANGLES_B = [7, 22, 37, 52, 67, 82, 97, 112, 127, 142, 157, 172, 187, 202, 217, 232, 247, 262, 277, 292, 307, 322, 337, 352];

function FwSpark({ angle, color, progress, distMult = 1, sizeMult = 1 }: { angle: number; color: string; progress: SharedValue<number>; distMult?: number; sizeMult?: number }) {
  const animStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const dist = p * 130 * distMult;
    const rad = (angle * Math.PI) / 180;
    return {
      opacity: p < 0.2 ? p / 0.2 : Math.max(0, 1 - (p - 0.2) / 0.8),
      transform: [
        { translateX: Math.cos(rad) * dist },
        { translateY: Math.sin(rad) * dist },
        { scale: Math.max(0.1, 1 - p * 0.5) },
      ],
    };
  });
  const size = 12 * sizeMult;
  return <Animated.View style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color }, animStyle]} />;
}

function FireworkBurst({ left, top, delay }: { left: string; top: string; delay: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 }),
        withTiming(0, { duration: 1400 }),
      ),
      -1, false,
    ));
  }, []);
  return (
    <View style={{ position: 'absolute', left: left as any, top: top as any, alignItems: 'center', justifyContent: 'center' }}>
      {FW_ANGLES_A.map((angle, i) => (
        <FwSpark key={`a${angle}`} angle={angle} color={FW_COLORS[i % FW_COLORS.length]} progress={progress} distMult={1} sizeMult={1} />
      ))}
      {FW_ANGLES_B.map((angle, i) => (
        <FwSpark key={`b${angle}`} angle={angle} color={FW_COLORS[(i + 3) % FW_COLORS.length]} progress={progress} distMult={0.65} sizeMult={0.75} />
      ))}
    </View>
  );
}

function FireworksBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' } as any]}>
      <FireworkBurst left="12%"  top="18%" delay={0}    />
      <FireworkBurst left="78%"  top="12%" delay={600}  />
      <FireworkBurst left="88%"  top="55%" delay={1200} />
      <FireworkBurst left="8%"   top="65%" delay={1800} />
      <FireworkBurst left="50%"  top="8%"  delay={300}  />
    </View>
  );
}

// ── Confettis animés en fond du hero ──
const CONFETTI_COLORS = ['#FBBF24', '#F472B6', '#60A5FA', '#34D399', '#C084FC', '#FB7185', '#FDE047'];

function ConfettiPiece({ left, color, size, duration, delay, spin }: {
  left: number; color: string; size: number; duration: number; delay: number; spin: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const translateY = -40 + progress.value * 540;
    const translateX = Math.sin(progress.value * Math.PI * 2) * 18;
    const rotate = `${progress.value * 360 * spin}deg`;
    const opacity = progress.value > 0.82 ? Math.max(0, (1 - progress.value) / 0.18) : 1;
    return { transform: [{ translateY }, { translateX }, { rotate }], opacity };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.confettiPiece,
        { left: `${left}%`, width: size, height: size * 0.42, backgroundColor: color, borderRadius: size * 0.18 },
        animStyle,
      ]}
    />
  );
}

function ConfettiBackground() {
  const pieces = useMemo(
    () => Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 8 + Math.random() * 9,
      duration: 7000 + Math.random() * 6000,
      delay: Math.random() * 7000,
      spin: Math.random() > 0.5 ? 1 : -1,
    })),
    [],
  );

  return (
    <View style={styles.confettiLayer} pointerEvents="none">
      {pieces.map((p) => <ConfettiPiece key={p.id} {...p} />)}
    </View>
  );
}

// ── Barre de navigation (web) ──
const NAV_LINKS = [
  { id: 'fonctionnalites', key: 'navFonctionnalites' },
  { id: 'exemples', key: 'navExemples' },
  { id: 'comment-ca-marche', key: 'navComment' },
  { id: 'faq', key: 'navFaq' },
];

function scrollToSection(id: string) {
  if (Platform.OS !== 'web') return;
  const doc: any = (globalThis as any).document;
  doc?.getElementById?.(id)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
}

const SORTED_LANGUAGES = SUPPORTED_LANGUAGES
  .filter((l) => l.code !== 'pt')
  .sort((a, b) => a.code.localeCompare(b.code));

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as AppLanguage;
  return (
    <View style={styles.navLangRow}>
      {SORTED_LANGUAGES.map((l) => {
        const FlagIcon = FLAG_ICONS[l.code];
        return (
          <TouchableOpacity
            key={l.code}
            onPress={() => setLanguage(l.code)}
            style={[styles.navFlagBtn, currentLang === l.code && styles.navFlagBtnActive]}
            activeOpacity={0.7}
          >
            <FlagIcon style={styles.navFlagIcon} />
            <Text style={[styles.navFlagCode, currentLang === l.code && styles.navFlagCodeActive]}>{l.code.toUpperCase()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function NavBar({ isWide }: { isWide: boolean }) {
  const { t } = useTranslation();
  return (
    <View style={styles.navBar}>
      <View style={styles.navInner}>
        <Text style={styles.navBrand}>🍰 ConfettiCake</Text>
        {isWide && (
          <View style={styles.navLinks}>
            {NAV_LINKS.map((l) => (
              <Text key={l.id} style={styles.navLink} onPress={() => scrollToSection(l.id)}>{t(`landing.${l.key}`)}</Text>
            ))}
          </View>
        )}
        <View style={styles.navRightGroup}>
          <TouchableOpacity style={styles.navCta} onPress={openStore} activeOpacity={0.85}>
            <LinearGradient colors={[VIOLET, '#EC4899', '#F97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.navCtaGrad}>
              <Text style={styles.navCtaText}>{t('landing.navCta')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <LanguageSwitcher />
        </View>
      </View>
    </View>
  );
}

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= 860;
  const [selectedCat, setSelectedCat] = useState<CategoryType>(null);
  const { t } = useTranslation();

  // Sur mobile natif, la racine "/" doit rester gérée par AuthGate (login / app)
  if (Platform.OS !== 'web') {
    return <Redirect href="/(auth)/login" />;
  }

  const FEATURES = FEATURE_VISUALS.map((v, i) => ({
    ...v,
    title: t(`landing.feature${i + 1}Title`),
    text: t(`landing.feature${i + 1}Text`),
  }));

  const STEPS = STEP_VISUALS.map((v, i) => ({
    ...v,
    title: t(`landing.step${i + 1}Title`),
    text: t(`landing.step${i + 1}Text`),
  }));

  const AI_EXAMPLES = Array.from({ length: AI_EXAMPLE_COUNT }, (_, i) => ({
    to: t(`landing.aiExample${i + 1}To`),
    text: t(`landing.aiExample${i + 1}Text`),
  }));

  const CARD_GALLERY = CARD_GALLERY_VISUALS.map((v, i) => ({
    ...v,
    label: t(`landing.card${i + 1}`),
  }));

  const VALUES = VALUE_VISUALS.map((v, i) => ({
    ...v,
    title: t(`landing.value${i + 1}Title`),
    text: t(`landing.value${i + 1}Text`),
  }));

  const FUNCTION_CATEGORIES = CATEGORY_VISUALS.map((v, ci) => ({
    emoji: v.emoji,
    title: t(`landing.cat${ci + 1}Title`),
    items: Array.from({ length: v.itemCount }, (_, ii) => ({
      name: t(`landing.cat${ci + 1}Item${ii + 1}Name`),
      text: t(`landing.cat${ci + 1}Item${ii + 1}Text`),
    })),
  }));

  const FAQ = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`landing.faq${i + 1}q`),
    a: t(`landing.faq${i + 1}a`),
  }));

  // On force le literal '{{accent}}' à rester dans la chaîne pour pouvoir styliser ce mot séparément.
  // react-native-web ne respecte pas le \n du texte source comme un retour à la ligne dur
  // (il est collapsé comme un espace normal) : on le découpe donc nous-même en 2 blocs <Text>
  // distincts sur desktop. Sur mobile, on laisse tout s'enrouler naturellement en une seule phrase.
  const heroTitleRaw = t('landing.heroTitle', { accent: '{{accent}}' });
  const [heroTitleLine1, heroTitleLine2Raw] = heroTitleRaw.split('\n');
  const heroTitleMobileFull = `${heroTitleLine1} ${heroTitleLine2Raw}`;
  const [heroTitleBefore, heroTitleAfter] = (isWide ? heroTitleLine2Raw : heroTitleMobileFull).split('{{accent}}');

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <CategoryModal cat={selectedCat} onClose={() => setSelectedCat(null)} />
      {/* ── Nav ── */}
      <NavBar isWide={isWide} />

      {/* ── Hero ── */}
      <View style={styles.hero} nativeID="accueil">
        <ConfettiBackground />
        <FireworksBackground />
        <SafeAreaView edges={['top']}>
          <View style={[styles.heroInner, isWide && styles.heroInnerWide]}>
            <Animated.View entering={FadeInUp.duration(500)} style={[styles.heroText, !isWide && styles.heroTextCentered]}>
              <View style={[styles.heroLogoFrame, !isWide && { alignSelf: 'center' }]}>
                <Image source={require('../assets/logo.png')} style={styles.heroLogo} resizeMode="contain" />
              </View>
              <Text style={[styles.brandSub, !isWide && styles.textCenter]}>By Confettis & Cake</Text>
              <View>
                {isWide && (
                  <Text style={styles.heroTitle}>{heroTitleLine1}</Text>
                )}
                <Text style={[styles.heroTitle, !isWide && [styles.textCenter, styles.heroTitleMobile]]}>
                  {heroTitleBefore}
                  <Text style={[styles.heroTitleAccent, !isWide && styles.heroTitleAccentMobile]}>{t('landing.heroAccent')}</Text>
                  {heroTitleAfter}
                </Text>
              </View>
              <Text style={[styles.heroSubtitle, !isWide && styles.textCenter]}>
                {t('landing.heroSubtitle')}
              </Text>
              <View style={[styles.heroCtaRow, !isWide && styles.justifyCenter]}>
                <TouchableOpacity style={styles.heroCta} onPress={openStore} activeOpacity={0.85}>
                  <LinearGradient colors={[VIOLET, '#EC4899', '#F97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.heroCtaGrad}>
                    <Text style={styles.heroCtaText}>{t('landing.heroCta')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.heroCtaGhost} onPress={() => scrollToSection('comment-ca-marche')} activeOpacity={0.7}>
                  <Text style={styles.heroCtaGhostText}>{t('landing.heroCtaGhost')}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.trustRow, !isWide && styles.justifyCenter]}>
                <Text style={styles.trustItem}>{t('landing.trustFree')}</Text>
                <Text style={styles.trustItem}>{t('landing.trustNoCommit')}</Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(150)} style={styles.heroVisual}>
              <View style={styles.heroPhotoWrap}>
                <Image source={require('../assets/cakes/cake-01.jpg')} style={styles.heroPhoto} resizeMode="cover" />
                <View style={styles.heroPhonePreview}>
                  <View style={styles.phoneNotch} />
                  <Text style={styles.phoneGreeting}>{t('landing.phoneGreeting')}</Text>
                  <View style={styles.phoneCard}>
                    <Text style={styles.phoneCardEmoji}>🎂</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.phoneCardTitle}>{t('landing.phoneCardTitle')}</Text>
                      <Text style={styles.phoneCardSub}>{t('landing.phoneCardSub')}</Text>
                    </View>
                  </View>
                </View>
                <StickerNote text={t('landing.stickerText')} color="#FDE047" rotate="-9deg" style={styles.heroSticker} />
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Fonctionnalités ── */}
      <View style={styles.section} nativeID="fonctionnalites">
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>{t('landing.featuresTitle')}</Text>
          <TitleSquiggle color="#F97316" rotate="2deg" />
          <Text style={[styles.sectionSubtitle, { maxWidth: 640 }]}>{t('landing.featuresSub')}</Text>
        </Animated.View>
        <View style={[styles.cardsGrid, isWide && styles.cardsGridWide]}>
          {FEATURES.map((f, i) => (
            <Animated.View key={f.title} entering={FadeInUp.duration(450).delay(i * 90)} style={[styles.featureCard, isWide && styles.featureCardWide, { transform: [{ rotate: i % 2 === 0 ? '1.5deg' : '-1.5deg' }] }]}>
              <View style={[styles.featureIconBadge, { backgroundColor: f.color }]}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Toutes les fonctionnalités, en détail ── */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>{t('landing.allFeaturesTitle')}</Text>
          <Text style={styles.sectionSubtitle}>{t('landing.allFeaturesSub')}</Text>
        </Animated.View>
        <View style={styles.catGrid}>
          {FUNCTION_CATEGORIES.map((cat, i) => (
            <Animated.View
              key={cat.title}
              entering={FadeInUp.duration(400).delay(Math.min(i, 6) * 60)}
              style={[styles.catGridItem, isWide && styles.catGridItemWide]}
            >
              <CategoryCard emoji={cat.emoji} title={cat.title} items={cat.items} onPress={() => setSelectedCat(cat)} />
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Exemples de messages IA ── */}
      <View style={styles.section} nativeID="exemples">
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>{t('landing.aiTitle')}</Text>
          <Text style={styles.sectionSubtitle}>{t('landing.aiSub')}</Text>
        </Animated.View>
        <View style={[styles.aiGrid, isWide && styles.aiGridWide]}>
          {AI_EXAMPLES.map((m, i) => (
            <Animated.View key={m.to} entering={FadeInUp.duration(450).delay(i * 100)} style={[styles.aiCard, { borderLeftColor: ACCENT_COLORS[i % ACCENT_COLORS.length], transform: [{ rotate: i % 2 === 0 ? '-1deg' : '1deg' }] }]}>
              <View style={styles.aiCardHeader}>
                <Text style={styles.aiSparkle}>✨</Text>
                <Text style={styles.aiCardLabel}>{m.to}</Text>
              </View>
              <Text style={styles.aiCardText}>{m.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Galerie + Comment ça marche ── */}
      <View style={[styles.section, styles.sectionWarm]} nativeID="comment-ca-marche">
        <View style={[styles.combinedBand, isWide && styles.combinedBandWide]}>
          <View style={styles.combinedCol}>
            <Animated.View entering={FadeInUp.duration(450)}>
              <Text style={styles.sectionTitle}>{t('landing.cardsTitle')}</Text>
              <Text style={styles.sectionSubtitle}>{t('landing.cardsSub')}</Text>
            </Animated.View>
            <View style={[styles.galleryRow, isWide && styles.galleryRowWide]}>
              {CARD_GALLERY.map((c, i) => (
                <Animated.View key={c.label} entering={FadeInUp.duration(450).delay(i * 90)} style={{ transform: [{ rotate: i % 2 === 0 ? '-2deg' : '2deg' }] }}>
                  <LinearGradient colors={c.colors} style={styles.galleryCard}>
                    <Text style={styles.galleryEmoji}>{c.emoji}</Text>
                    <Text style={styles.galleryLabel}>{c.label}</Text>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>
          </View>

          <View style={styles.combinedCol}>
            <Animated.View entering={FadeInUp.duration(450)}>
              <Text style={styles.sectionTitle}>{t('landing.howTitle')}</Text>
              <Text style={styles.sectionSubtitle}>{t('landing.howSub')}</Text>
            </Animated.View>
            <View style={styles.stepsRow}>
              {STEPS.map((s, i) => (
                <Animated.View key={s.num} entering={FadeInUp.duration(450).delay(i * 100)} style={[styles.stepCard, { transform: [{ rotate: i % 2 === 0 ? '-1deg' : '1deg' }] }]}>
                  <LinearGradient colors={[VIOLET, VIOLET_LIGHT]} style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{s.num}</Text>
                  </LinearGradient>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepText}>{s.text}</Text>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* ── Nos valeurs ── */}
      <View style={[styles.section, styles.sectionAlt]}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>{t('landing.valuesTitle')}</Text>
          <TitleSquiggle color={VIOLET} rotate="2deg" />
        </Animated.View>
        <View style={[styles.valuesRow, isWide && styles.valuesRowWide]}>
          {VALUES.map((v, i) => (
            <Animated.View key={v.title} entering={FadeInUp.duration(450).delay(i * 90)} style={[styles.valueCard, { transform: [{ rotate: i % 2 === 0 ? '-1.5deg' : '1.5deg' }] }]}>
              <View style={[styles.valueIconBadge, { backgroundColor: v.color }]}>
                <Text style={styles.valueEmoji}>{v.emoji}</Text>
              </View>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueText}>{v.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── Cagnotte / co-signature ── */}
      <View style={[styles.section, styles.sectionWarm]}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <LinearGradient colors={[VIOLET, '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.potBanner, isWide && styles.potBannerWide]}>
            <View style={styles.potBannerText}>
              <Text style={styles.potEmoji}>🎁</Text>
              <Text style={styles.potTitle}>{t('landing.potTitle')}</Text>
              <Text style={styles.potText}>{t('landing.potText')}</Text>
            </View>
            <TouchableOpacity style={styles.potBtn} onPress={openStore} activeOpacity={0.85}>
              <Text style={styles.potBtnText}>{t('landing.potCta')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* ── FAQ ── */}
      <View style={styles.section} nativeID="faq">
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.sectionTitle}>{t('landing.faqTitle')}</Text>
        </Animated.View>
        <View style={styles.faqList}>
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </View>
      </View>

      {/* ── CTA final + Footer ── */}
      <LinearGradient colors={[VIOLET_DARK, VIOLET, '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaFooter}>
        <Animated.View entering={FadeIn.duration(500)} style={[styles.ctaFooterInner, isWide && styles.ctaFooterInnerWide]}>
          <View style={styles.ctaFooterText}>
            <Text style={styles.ctaTitle}>{t('landing.ctaTitle')}</Text>
            <Text style={styles.ctaSubtitle}>{t('landing.ctaSub')}</Text>
            <View style={styles.storeRow}>
              <TouchableOpacity style={styles.storeBtnLight} onPress={() => Linking.openURL(APP_STORE_URL).catch(() => {})} activeOpacity={0.85}>
                <Text style={styles.storeBtnIcon}>🍎</Text>
                <Text style={styles.storeBtnTextLight}>App Store</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.storeBtnLight} onPress={() => Linking.openURL(PLAY_STORE_URL).catch(() => {})} activeOpacity={0.85}>
                <Text style={styles.storeBtnIcon}>▶️</Text>
                <Text style={styles.storeBtnTextLight}>Google Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerCol}>
            <Text style={styles.footerBrand}>🍰 ConfettiCake</Text>
            <View style={styles.footerLinks}>
              <Text style={styles.footerLink} onPress={() => Linking.openURL('https://confetticake.fr/cgu').catch(() => {})}>{t('landing.footerCgu')}</Text>
              <Text style={styles.footerDot}>·</Text>
              <Text style={styles.footerLink} onPress={() => Linking.openURL('https://confetticake.fr/confidentialite').catch(() => {})}>{t('landing.footerPrivacy')}</Text>
              <Text style={styles.footerDot}>·</Text>
              <Text style={styles.footerLink} onPress={() => Linking.openURL('mailto:contact@confetticake.fr').catch(() => {})}>{t('landing.footerContact')}</Text>
            </View>
            <Text style={styles.footerCopyright}>{t('landing.footerCopyright', { year: new Date().getFullYear() })}</Text>
            <Text style={styles.footerCopyright}>{t('landing.footerMadeWith')}</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFFFFF' },
  pageContent: { flexGrow: 1 },

  // Nav
  navBar: { backgroundColor: 'rgba(255,255,255,0.92)', borderBottomWidth: 1, borderBottomColor: '#F0E4F2' },
  navInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24, paddingVertical: 12, gap: 16,
  },
  navBrand: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 18, color: '#3A2342', flexShrink: 0 },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: 16, flexShrink: 1 },
  navLink: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: '#3A2342' },
  navRightGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navLangRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  navFlagBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 5, borderRadius: 50,
    backgroundColor: 'rgba(58,35,66,0.06)', borderWidth: 1.5, borderColor: 'transparent',
  },
  navFlagBtnActive: { backgroundColor: 'rgba(155,107,181,0.14)', borderColor: VIOLET },
  navFlagIcon: { width: 18, height: 12, borderRadius: 2 },
  navFlagCode: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 11, color: '#3A2342', opacity: 0.6 },
  navFlagCodeActive: { opacity: 1, color: VIOLET_DARK },
  navCta: { borderRadius: 50, overflow: 'hidden' },
  navCtaGrad: { paddingHorizontal: 18, paddingVertical: 10 },
  navCtaText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#fff' },

  // Hero
  hero: { paddingBottom: 48, overflow: 'hidden', position: 'relative', backgroundColor: '#FBF6FC' },
  confettiLayer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  confettiPiece: { position: 'absolute', top: -40 },
  heroInner: { paddingHorizontal: 24, paddingTop: 24, gap: 32 },
  heroInnerWide: { flexDirection: 'row', alignItems: 'center', maxWidth: 1100, alignSelf: 'center', width: '100%', paddingTop: 56, gap: 48 },
  heroText: { flex: 1.1, gap: 16 },
  heroTextCentered: { alignItems: 'center' },
  textCenter: { textAlign: 'center' },
  justifyCenter: { justifyContent: 'center' },
  heroLogoFrame: {
    alignSelf: 'flex-start', marginBottom: 4,
    backgroundColor: '#fff', borderRadius: 22, padding: 14,
    borderWidth: 2.5, borderColor: '#FDE047',
    transform: [{ rotate: '-2deg' }],
    shadowColor: VIOLET, shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  heroLogo: { width: 220, height: 96 },
  brandSub: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: VIOLET, letterSpacing: 1 },
  heroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 30, lineHeight: 38, color: '#3A2342', marginTop: 4 },
  heroTitleMobile: { fontSize: 22, lineHeight: 28 },
  heroTitleAccent: { fontFamily: 'Pacifico_400Regular', fontSize: 27, color: '#EC4899' },
  heroTitleAccentMobile: { fontSize: 19 },
  heroSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 16, lineHeight: 24, color: '#6B5868', maxWidth: 480 },
  heroCtaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 4 },
  heroCta: { borderRadius: 50, overflow: 'hidden', shadowColor: VIOLET, shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  heroCtaGrad: { paddingHorizontal: 26, paddingVertical: 16 },
  heroCtaText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 16, color: '#fff' },
  heroCtaGhost: { paddingVertical: 16, paddingHorizontal: 4 },
  heroCtaGhostText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: '#3A2342' },
  storeRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  storeBtnIcon: { fontSize: 16 },
  storeBtnLight: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 18, paddingVertical: 12,
  },
  storeBtnTextLight: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: VIOLET_DARK },
  trustRow: { flexDirection: 'row', gap: 18, marginTop: 4, flexWrap: 'wrap' },
  trustItem: { fontFamily: 'BeVietnamPro_500Medium', fontSize: 13, color: '#8C7592' },

  heroVisual: { flex: 0.9, alignItems: 'center', justifyContent: 'center' },
  mockupWrap: { position: 'relative' },
  heroPhotoWrap: { position: 'relative', width: 320, maxWidth: '100%' },
  heroPhoto: {
    width: '100%', height: 340, borderRadius: 28,
    transform: [{ rotate: '-3deg' }],
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 22, shadowOffset: { width: 0, height: 14 }, elevation: 10,
  },
  heroPhonePreview: {
    position: 'absolute', bottom: -28, left: -28, width: 220, zIndex: 4,
    backgroundColor: '#fff', borderRadius: 22, padding: 16, gap: 10,
    transform: [{ rotate: '4deg' }],
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },
  heroSticker: { position: 'absolute', top: -22, right: -16, zIndex: 5, width: 132 },
  phoneNotch: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#EFDFEF', alignSelf: 'center', marginBottom: 2 },
  phoneGreeting: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#3A2342' },
  phoneCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FBF6FC', borderRadius: 14, padding: 10,
  },
  phoneCardGhost: { backgroundColor: '#FBF6FC' },
  phoneCardEmoji: { fontSize: 20 },
  phoneCardTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12, color: '#3A2342' },
  phoneCardSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 10, color: '#8C7592', marginTop: 1 },

  // Sections génériques
  section: { paddingHorizontal: 24, paddingVertical: 56, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  sectionAlt: { backgroundColor: '#F8F5FB' },
  sectionWarm: { backgroundColor: '#FCF1EA' },
  sectionTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 26, color: '#3A2342', textAlign: 'center' },
  sectionSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 15, color: '#6B5868', textAlign: 'center', marginTop: 8, marginBottom: 32, maxWidth: 560, alignSelf: 'center' },
  titleSquiggle: { height: 7, borderRadius: 4, alignSelf: 'center', marginTop: 8 },
  scatterEmoji: { position: 'absolute', zIndex: 2 },
  stickerNote: {
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  stickerNoteText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 13, color: '#3A2342', textAlign: 'center', lineHeight: 18 },

  // Features
  cardsGrid: { gap: 16 },
  cardsGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  featureCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 22, gap: 8,
    borderWidth: 1, borderColor: '#EFDFEF',
    shadowColor: VIOLET, shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
  featureCardWide: { flexBasis: '47%', flexGrow: 1 },
  featureIconBadge: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  featureEmoji: { fontSize: 26 },
  featureTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 17, color: '#3A2342' },
  featureText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#6B5868' },

  // Exemples IA
  aiGrid: { gap: 16 },
  aiGridWide: { flexDirection: 'row' },
  aiCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 20, gap: 10,
    borderWidth: 1, borderColor: '#EFDFEF', borderLeftWidth: 4,
  },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiSparkle: { fontSize: 16 },
  aiCardLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 12, color: VIOLET_DARK, textTransform: 'uppercase', letterSpacing: 0.5 },
  aiCardText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#374151', fontStyle: 'italic' },

  // Galerie + Steps combinés
  combinedBand: { gap: 40 },
  combinedBandWide: { flexDirection: 'row', alignItems: 'flex-start' },
  combinedCol: { flex: 1, gap: 0 },

  // Galerie cartes
  galleryRow: { gap: 16 },
  galleryRowWide: { flexDirection: 'row', flexWrap: 'wrap' },
  galleryCard: {
    flexGrow: 1, flexBasis: '30%', minWidth: 150, height: 180, borderRadius: 22, padding: 18,
    justifyContent: 'flex-end', overflow: 'hidden',
  },
  galleryEmoji: { fontSize: 34, marginBottom: 6 },
  galleryLabel: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' },

  // Steps
  stepsRow: { gap: 16 },
  stepCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 22, gap: 8, alignItems: 'flex-start' },
  stepBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepBadgeText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 15, color: '#fff' },
  stepTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: '#3A2342' },
  stepText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 20, color: '#6B5868' },

  // Valeurs
  valuesRow: { gap: 16, marginTop: 8 },
  valuesRowWide: { flexDirection: 'row' },
  valueCard: {
    flex: 1, alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 20, padding: 22,
    borderWidth: 1, borderColor: '#EFDFEF',
    shadowColor: VIOLET, shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
  valueIconBadge: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  valueEmoji: { fontSize: 26 },
  valueTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: '#3A2342', textAlign: 'center' },
  valueText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, lineHeight: 19, color: '#6B5868', textAlign: 'center', maxWidth: 260 },

  // Cagnotte banner
  potBanner: { borderRadius: 24, padding: 32, gap: 20 },
  potBannerWide: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  potBannerText: { flex: 1, gap: 8 },
  potEmoji: { fontSize: 30 },
  potTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: '#fff' },
  potText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#F1E9F8', maxWidth: 480 },
  potBtn: { backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 22, paddingVertical: 14, alignSelf: 'flex-start' },
  potBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: VIOLET_DARK },

  // Catégories de fonctionnalités
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  catGridItem: { flexBasis: '31%', flexGrow: 1, minWidth: 130 },
  catGridItemWide: { flexBasis: '18%' },
  catCard: {
    flex: 1, alignItems: 'center', gap: 2,
    backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 14,
    borderWidth: 1, borderColor: '#EFDFEF', borderLeftWidth: 4, borderLeftColor: VIOLET_LIGHT,
    shadowColor: VIOLET, shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2,
  },
  catCardEmoji: { fontSize: 22 },
  catCardTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12.5, color: '#3A2342', textAlign: 'center', lineHeight: 16 },
  catCardArrow: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: VIOLET },
  catCount: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, color: '#A98CA0' },
  catList: { gap: 10, paddingTop: 10, width: '100%' },
  catRow: { flexDirection: 'row', gap: 8 },
  catBullet: { fontSize: 14, color: VIOLET, lineHeight: 20 },
  catItemName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: '#3A2342' },
  catItemText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, lineHeight: 19, color: '#6B5868', marginTop: 2 },

  // Modal catégorie
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 520, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  modalEmoji: { fontSize: 28 },
  modalTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: '#3A2342', flex: 1 },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3EEF8', alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 14, color: VIOLET },

  // FAQ
  faqList: { gap: 10, marginTop: 8 },
  faqItem: { backgroundColor: '#F8F5FB', borderRadius: 16, padding: 18, gap: 10, borderLeftWidth: 4, borderLeftColor: '#EC4899' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  faqQuestion: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: '#3A2342', flex: 1 },
  faqArrow: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: VIOLET },
  faqAnswer: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, lineHeight: 21, color: '#6B5868' },

  // CTA final + Footer (bande compacte combinée)
  ctaFooter: { paddingHorizontal: 24, paddingVertical: 48 },
  ctaFooterInner: { gap: 36, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  ctaFooterInnerWide: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaFooterText: { gap: 14, alignItems: 'flex-start', flex: 1.2 },
  ctaTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 24, color: '#fff' },
  ctaSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 15, color: '#F1E9F8', maxWidth: 460 },

  footerCol: { gap: 10, alignItems: 'flex-start' },
  footerBrand: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: '#fff' },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footerLink: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: '#E9DEF5' },
  footerDot: { color: 'rgba(255,255,255,0.4)' },
  footerCopyright: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
});
