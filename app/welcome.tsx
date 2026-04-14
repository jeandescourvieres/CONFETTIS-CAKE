import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { Radii, Typography } from '../src/constants/theme';
import { useThemeStore } from '../src/stores/themeStore';

const { width: W, height: H } = Dimensions.get('window');
const IMG_W = Math.round(W * 0.82);
const IMG_H = IMG_W; // format carré

// ── Photos du gâteau (rotation aléatoire à chaque lancement) ─────────────────
// Pour ajouter une photo : glisser le fichier dans assets/cakes/ puis ajouter
// une ligne require() ci-dessous. Le require() DOIT être statique (pas de variable).
const CAKE_IMAGES = [
  require('../assets/cakes/cake-01.jpg'),
  require('../assets/cakes/cake-02.jpg'),
  require('../assets/cakes/cake-03.jpg'),
  require('../assets/cakes/cake-04.jpg'),
  require('../assets/cakes/cake-05.jpg'),
  require('../assets/cakes/cake-06.jpg'),
  require('../assets/cakes/cake-07.jpg'),
  require('../assets/cakes/cake-08.jpg'),
  require('../assets/cakes/cake-09.jpg'),
  require('../assets/cakes/cake-10.jpg'),
];
const CAKE_IMAGE = CAKE_IMAGES[Math.floor(Math.random() * CAKE_IMAGES.length)];

// ── Playlists saisonnières (libres de droits) ─────────────────────────────────
//  • Kevin MacLeod — incompetech.com  (CC BY 4.0)
//  • Bensound       — bensound.com     (CC BY-ND)

const CHRISTMAS_PLAYLIST = [
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deck%20the%20Halls%20B.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Jingle%20Bells%20B.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/O%20Christmas%20Tree.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Silent%20Night.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Joy%20to%20the%20World.mp3',
];
const NEW_YEAR_PLAYLIST = [
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Auld%20Lang%20Syne.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Celebration.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fireworks.mp3',
  'https://www.bensound.com/bensound-music/bensound-happyrock.mp3',
];
const VALENTINES_PLAYLIST = [
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Romantic%20Adventure.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Love%20Song.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Canon%20in%20D.mp3',
  'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
];
const FESTIVE_PLAYLIST = [
  'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
  'https://www.bensound.com/bensound-music/bensound-happyrock.mp3',
  'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fluffing%20a%20Duck.mp3',
  'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Happy%20Bee.mp3',
];

function getSeasonalPlaylist(): string[] {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day   = now.getDate();
  if (month === 12)               return CHRISTMAS_PLAYLIST;
  if (month === 1  && day <= 15)  return NEW_YEAR_PLAYLIST;
  if (month === 2  && day === 14) return VALENTINES_PLAYLIST;
  return FESTIVE_PLAYLIST;
}
function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
  const soundRef   = useRef<Audio.Sound | null>(null);
  const mountedRef = useRef(true);
  const appTheme   = useThemeStore((s) => s.theme);

  // Musique saisonnière — essaie les pistes dans un ordre aléatoire jusqu'à succès
  useEffect(() => {
    const playlist = getSeasonalPlaylist();
    // Mélange à partir d'un index aléatoire pour varier à chaque lancement
    const startIdx = Math.floor(Math.random() * playlist.length);
    const shuffled = [...playlist.slice(startIdx), ...playlist.slice(0, startIdx)];

    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      for (const uri of shuffled) {
        if (!mountedRef.current) break;
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true, isLooping: true, volume: 0.7 },
          );
          if (mountedRef.current) {
            soundRef.current = sound;
          } else {
            await sound.unloadAsync();
          }
          return; // succès — on arrête
        } catch {
          // Cette piste a échoué — on essaie la suivante
        }
      }
    })();
    return () => {
      mountedRef.current = false;
      soundRef.current?.unloadAsync();
    };
  }, []);

  // Lévitation douce du gâteau
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, [floatAnim]);

  // Halo pulsant derrière le gâteau
  const glowAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.08, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1,    duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
  }, [glowAnim]);

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
    mountedRef.current = false; // empêche le son de se stocker s'il charge encore
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch { /* silent */ }
    router.replace('/(app)' as never);
  };

  return (
    <LinearGradient colors={appTheme.gradient} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Photo du gâteau avec halo et lévitation */}
        <Animated.View style={[styles.cakeArea, { opacity: fadeOpacity, transform: [{ translateY: fadeY }] }]}>
          {/* Halo pulsant */}
          <Animated.View style={[styles.cakeGlow, { transform: [{ scale: glowAnim }] }]} />
          {/* Photo flottante */}
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <Image source={CAKE_IMAGE} style={styles.cakeImage} resizeMode="cover" />
          </Animated.View>
        </Animated.View>

        {/* Texte */}
        <Animated.View style={[styles.textWrap, { opacity: fadeOpacity, transform: [{ translateY: fadeY }] }]}>
          <Text style={styles.title}>Confettis & Cake</Text>
          <Text style={styles.taglineLine2}>L'application IA{'\n'}pour ne plus jamais rater{'\n'}un anniversaire,</Text>
          <Text style={styles.taglineLine3}>une fête ou un événement{'\n'}qui compte pour toi !</Text>
        </Animated.View>

        {/* Confettis flottants — par-dessus tout */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {CONFETTI.map((c, i) => (
            <FloatingParticle key={i} emoji={c.emoji} xRatio={c.x} delay={c.delay} />
          ))}
        </View>

        {/* Bouton */}
        <Animated.View style={[styles.btnWrap, { opacity: fadeOpacity }]}>
          <TouchableOpacity style={styles.btn} onPress={stopAndEnter} activeOpacity={0.85}>
            <Text style={styles.btnText}>C'est parti ! 🎉</Text>
          </TouchableOpacity>
        </Animated.View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1, justifyContent: 'space-between' },

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

  // Halo blanc semi-transparent derrière la photo
  cakeGlow: {
    position: 'absolute',
    width: IMG_W + 28,
    height: IMG_H + 28,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.22)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 0,
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

  textWrap: {
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 4,
    marginTop: -24,
  },

  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 34,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
  },
  taglineLine3: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg + 3,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
  },

  btnWrap: {
    paddingHorizontal: 96,
    paddingBottom: 16,
  },

  btn: {
    backgroundColor: '#fff',
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  btnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: '#FF6B9D',
    letterSpacing: 0.5,
  },
});
