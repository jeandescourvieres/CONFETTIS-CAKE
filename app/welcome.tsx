import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as SecureStore from '../src/utils/storage';
import { Radii, Typography } from '../src/constants/theme';
import { useTablet } from '../src/hooks/useTablet';

const { width: W, height: H } = Dimensions.get('window');
const IMG_W = Math.round(W * 0.70);
const IMG_H = IMG_W; // format carré

// ── Photos de fond (rotation aléatoire à chaque lancement) ──────────────────
const HERO_IMAGES = [
  require('../assets/heroes/hero1.png'),
  require('../assets/heroes/hero2.png'),
  require('../assets/heroes/hero3.png'),
  require('../assets/heroes/hero4.png'),
  require('../assets/heroes/hero5.png'),
  require('../assets/heroes/hero6.png'),
  require('../assets/heroes/hero7.png'),
  require('../assets/heroes/hero8.png'),
  require('../assets/heroes/hero9.png'),
  require('../assets/heroes/hero10.png'),
];

// ── Playlist locale — libres de droits ───────────────────────────────────────
const WELCOME_PLAYLIST = [
  require('../assets/sounds/welcome1.mp3'),
  require('../assets/sounds/welcome2.mp3'),
  require('../assets/sounds/welcome3.mp3'),
  require('../assets/sounds/welcome4.mp3'),
  require('../assets/sounds/welcome5.mp3'),
  require('../assets/sounds/welcome6.mp3'),
  require('../assets/sounds/welcome7.mp3'),
  require('../assets/sounds/welcome8.mp3'),
];

// ── Confettis flottants ───────────────────────────────────────────────────────
const CONFETTI = [
  { emoji: '🎉', x: 0.05, delay: 0 },
  { emoji: '✨', x: 0.20, delay: 300 },
  { emoji: '🎊', x: 0.70, delay: 150 },
  { emoji: '💜', x: 0.88, delay: 450 },
  { emoji: '🌸', x: 0.38, delay: 600 },
  { emoji: '⭐', x: 0.55, delay: 200 },
  { emoji: '🎈', x: 0.12, delay: 800 },
  { emoji: '💛', x: 0.82, delay: 700 },
  { emoji: '🎀', x: 0.48, delay: 1000 },
  { emoji: '💫', x: 0.63, delay: 500 },
];

function FloatingParticle({ emoji, xRatio, delay }: { emoji: string; xRatio: number; delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 0.9, duration: 500,  useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -H,  duration: 3600, useNativeDriver: true }),
        ]),
        Animated.timing(opacity,    { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 0,   useNativeDriver: true }),
        Animated.delay(600),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [delay, opacity, translateY]);

  return (
    <Animated.Text style={[styles.particle, { left: xRatio * W, opacity, transform: [{ translateY }] }]}>
      {emoji}
    </Animated.Text>
  );
}

// ── Écran de bienvenue ────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router     = useRouter();
  const { isTablet } = useTablet();
  const soundRef   = useRef<Audio.Sound | null>(null);
  const mountedRef = useRef(true);
  const [heroImage] = useState(() => HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);

  // Musique aléatoire locale à chaque lancement
  useEffect(() => {
    const track = WELCOME_PLAYLIST[Math.floor(Math.random() * WELCOME_PLAYLIST.length)];
    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      try {
        const { sound } = await Audio.Sound.createAsync(
          track,
          { shouldPlay: true, isLooping: true, volume: 0.7 },
        );
        if (mountedRef.current) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch { /* silent */ }
    })();
    return () => {
      mountedRef.current = false;
      soundRef.current?.unloadAsync();
    };
  }, []);


  // Fade-in général
  const fadeOpacity = useRef(new Animated.Value(0)).current;
  const fadeY       = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeOpacity, { toValue: 1, duration: 700, delay: 150, useNativeDriver: true }),
      Animated.timing(fadeY,       { toValue: 0, duration: 700, delay: 150, useNativeDriver: true }),
    ]).start();
  }, [fadeOpacity, fadeY]);

  const stopAndEnter = async () => {
    mountedRef.current = false;
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch { /* silent */ }
    // Si le mode est déjà choisi → home directement, sinon → features-intro
    const mode = await SecureStore.getItemAsync('cc_home_mode');
    if (mode === 'simple' || mode === 'advanced') {
      router.replace('/(app)' as never);
    } else {
      router.replace('/(app)/features-intro' as never);
    }
  };

  return (
    <View style={styles.gradient}>
      {/* Image pleine largeur, pas de zoom/crop */}
      <Image source={heroImage} style={styles.heroImage} resizeMode="contain" />

      {/* Confettis flottants */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {CONFETTI.map((c, i) => (
          <FloatingParticle key={i} emoji={c.emoji} xRatio={c.x} delay={c.delay} />
        ))}
      </View>

      {/* Boutons collés en bas, par-dessus l'image */}
      <SafeAreaView style={styles.safe} edges={['bottom']} pointerEvents="box-none">
        <Animated.View style={[styles.bottomGroup, { opacity: fadeOpacity, transform: [{ translateY: fadeY }] }]}>
          <View style={[styles.btnWrap, isTablet && styles.btnWrapTablet]}>
            <TouchableOpacity style={styles.btn} onPress={stopAndEnter} activeOpacity={0.85}>
              <Text style={styles.btnText}>C'est parti ! 🎉</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, backgroundColor: '#ffffff' },
  heroImage: {
    position: 'absolute',
    top: -Math.round(H * 0.03),
    left: 0,
    width: W,
    height: H,
  },
  safe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  particle: {
    position: 'absolute',
    bottom: 0,
    fontSize: 24,
  },

  cakeArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
  },

  cakeImage: {
    width: IMG_W,
    height: IMG_H,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
  },

  bottomGroup: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  textWrap: {
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 4,
  },

  title: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 38,
    color: '#E8357A',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titleBy: {
    fontFamily: 'BeVietnamPro_300Light',
    fontSize: Typography.sm,
    color: 'rgba(232,53,122,0.6)',
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  taglineLine1: {
    fontFamily: 'BeVietnamPro_300Light',
    fontSize: Typography.lg,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 26,
  },
  taglineLine2: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg + 3,
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 30,
  },
  taglineLine3: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg + 3,
    color: '#1A1A2E',
    textAlign: 'center',
    lineHeight: 30,
  },

  noFautesTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  noFautesPrefix: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: 'rgba(255,255,255,0.9)',
  },
  noFautesWrong: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: '#ffcdd2',
    textDecorationLine: 'line-through',
  },
  noFautesSpace: {
    fontSize: Typography.md,
  },
  noFautesRight: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: '#a5d6a7',
  },

  noFautesBadge: {
    alignSelf: 'center',
    backgroundColor: '#FFF0F6',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#F9A8D4',
    shadowColor: '#E8357A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  noFautesBadgeText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: '#4A1040',
    textAlign: 'center',
  },
  noFautesBadgeStrike: {
    textDecorationLine: 'line-through',
    color: '#E8357A',
    fontFamily: 'BeVietnamPro_700Bold',
  },
  noFautesBadgeCorrect: {
    color: '#16A34A',
    fontFamily: 'BeVietnamPro_800ExtraBold',
  },

  btnWrap: {
    width: '50%',
    alignSelf: 'center',
  },
  btnWrapTablet: {
    width: '40%',
    maxWidth: 280,
  },

  btn: {
    backgroundColor: '#E8357A',
    borderRadius: Radii.full,
    paddingVertical: 8,
    alignItems: 'center',
    shadowColor: '#E8357A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  btnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.base,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
