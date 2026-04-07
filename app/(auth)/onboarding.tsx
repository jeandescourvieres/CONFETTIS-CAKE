import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  FlatList,
  Platform,
  TextInput,
} from 'react-native';
import Svg, { Ellipse, Rect, Circle, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';
import { useUIStore } from '../../src/stores/uiStore';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';

const { width: W, height: H } = Dimensions.get('window');

// ── Confetti (slide 1 uniquement) ─────────────────────────────────────────────
const CONFETTI_ITEMS = [
  { leftRatio: 0.04, color: '#fdd34d', size: 10, delay: 0 },
  { leftRatio: 0.12, color: '#fff', size: 6, delay: 400 },
  { leftRatio: 0.20, color: '#FF6B9D', size: 9, delay: 800 },
  { leftRatio: 0.28, color: '#fdd34d', size: 7, delay: 1200 },
  { leftRatio: 0.36, color: '#FF8C42', size: 11, delay: 200 },
  { leftRatio: 0.44, color: '#fff', size: 6, delay: 600 },
  { leftRatio: 0.52, color: '#fdd34d', size: 9, delay: 1000 },
  { leftRatio: 0.60, color: '#FF6B9D', size: 8, delay: 300 },
  { leftRatio: 0.67, color: '#fff', size: 7, delay: 700 },
  { leftRatio: 0.74, color: '#FF8C42', size: 10, delay: 1400 },
  { leftRatio: 0.81, color: '#fdd34d', size: 6, delay: 900 },
  { leftRatio: 0.88, color: '#FF6B9D', size: 9, delay: 100 },
  { leftRatio: 0.93, color: '#fff', size: 7, delay: 1600 },
  { leftRatio: 0.16, color: '#FF8C42', size: 8, delay: 1800 },
  { leftRatio: 0.56, color: '#fdd34d', size: 6, delay: 500 },
  { leftRatio: 0.97, color: '#FF6B9D', size: 5, delay: 1100 },
];

function ConfettiPiece({ leftRatio, color, size, delay }: typeof CONFETTI_ITEMS[0]) {
  const left = W * leftRatio;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, H * 0.7] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });
  const opacity = anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 0.7, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top: 0,
        width: size,
        height: size,
        borderRadius: 2,
        backgroundColor: color,
        transform: [{ translateY }, { rotate }],
        opacity,
      }}
    />
  );
}

// ── Flamme animée (SVG + Animated) ───────────────────────────────────────────
const CANDLES = [
  { x: 97,  color: '#FF6B9D' },
  { x: 110, color: '#fdd34d' },
  { x: 123, color: '#FF8C42' },
  { x: 136, color: '#fff' },
  { x: 149, color: '#FF6B9D' },
  { x: 162, color: '#fdd34d' },
  { x: 175, color: '#FF8C42' },
  { x: 188, color: '#fff' },
  { x: 201, color: '#FF6B9D' },
];

const CANDLE_H = 32;
const CANDLE_W = 10;
const CANDLE_TOP_Y = 84; // y du haut des bougies

function AnimatedFlame({ x, delay }: { x: number; delay: number }) {
  const flicker = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, { toValue: 1, duration: 180 + delay % 120, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 0, duration: 200 + delay % 100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const scaleX = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] });
  const scaleY = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const opacity = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 0.85] });

  // Pivot en bas de la flamme
  const flameY = CANDLE_TOP_Y - 18;
  const glowScale = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });
  const glowOpacity = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.55] });

  return (
    <>
      {/* Halo lumineux */}
      <Animated.View
        style={{
          position: 'absolute',
          left: x - 12,
          top: flameY - 18,
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: '#FFD34D',
          transform: [{ scale: glowScale }],
          opacity: glowOpacity,
        }}
      />
      {/* Flamme */}
      <Animated.View
        style={{
          position: 'absolute',
          left: x - 9,
          top: flameY - 18,
          width: 18,
          height: 22,
          transform: [{ scaleX }, { scaleY }],
          opacity,
          transformOrigin: 'bottom',
        }}
      >
        <Svg width={18} height={22} viewBox="0 0 18 22">
          {/* Flamme extérieure orange */}
          <Path d="M9 22 C3 17 0 12 4 6 C5 4 7 1 9 0 C11 1 13 4 14 6 C18 12 15 17 9 22Z" fill="#FF6B35" />
          {/* Cœur jaune */}
          <Path d="M9 19 C5 16 4 12 6 8 C7 6 8 4 9 3 C10 4 11 6 12 8 C14 12 13 16 9 19Z" fill="#fdd34d" />
          {/* Reflet blanc */}
          <Path d="M9 15 C8 13 8 10 9 8.5 C10 10 10 13 9 15Z" fill="rgba(255,255,255,0.65)" />
        </Svg>
      </Animated.View>
    </>
  );
}

// ── Grand gâteau SVG ──────────────────────────────────────────────────────────
const SVG_W = 300;
const SVG_H = 240;
const CAKE_SVG_HEIGHT = H * 0.56;

function BigCakeSVG() {
  return (
    <View style={styles.bigCakeWrap}>
      {/* Flammes animées (par-dessus le SVG) */}
      {CANDLES.map((c, i) => (
        <AnimatedFlame key={i} x={(c.x / SVG_W) * W} delay={i * 80} />
      ))}

      <Svg width={W} height={CAKE_SVG_HEIGHT} viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMax meet">
        <Defs>
          <RadialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <Stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </RadialGradient>
        </Defs>

        {/* ── Ombre portée ── */}
        <Ellipse cx={150} cy={237} rx={105} ry={8} fill="rgba(0,0,0,0.18)" />

        {/* ══ ÉTAGE BAS (le plus large) ══ */}
        {/* Corps */}
        <Rect x={28} y={162} width={244} height={68} rx={10} fill="rgba(255,255,255,0.96)" />
        {/* Glaçage rose clair en haut */}
        <Rect x={28} y={162} width={244} height={16} rx={8} fill="#FFB3CE" />
        {/* Drips glaçage */}
        {[50, 80, 115, 155, 195, 230, 255].map((dx, i) => (
          <Path key={i} d={`M${dx} 178 Q${dx + 4} ${188 + (i % 3) * 5} ${dx + 4} ${192 + (i % 3) * 5}`} stroke="#FFB3CE" strokeWidth={7} strokeLinecap="round" fill="none" />
        ))}
        {/* Déco : rangée de perles */}
        {[55, 80, 107, 134, 161, 188, 215, 242].map((dx, i) => (
          <Circle key={i} cx={dx} cy={204} r={5} fill={i % 2 === 0 ? '#fdd34d' : '#ff8eaf'} />
        ))}
        {/* Petites étoiles */}
        {[68, 122, 178, 232].map((dx, i) => (
          <Path key={i} d={`M${dx} 220 l2 -5 2 5 -5 -3 6 0z`} fill="#fff" opacity={0.7} />
        ))}

        {/* ══ ÉTAGE MILIEU ══ */}
        <Rect x={62} y={100} width={176} height={64} rx={9} fill="rgba(255,255,255,0.96)" />
        {/* Glaçage jaune */}
        <Rect x={62} y={100} width={176} height={15} rx={7} fill="#fdd34d" />
        {/* Drips */}
        {[80, 108, 135, 163, 193, 215].map((dx, i) => (
          <Path key={i} d={`M${dx} 115 Q${dx + 4} ${124 + (i % 2) * 6} ${dx + 4} ${128 + (i % 2) * 6}`} stroke="#fdd34d" strokeWidth={6} strokeLinecap="round" fill="none" />
        ))}
        {/* Déco : points roses */}
        {[80, 106, 132, 158, 184, 210].map((dx, i) => (
          <Circle key={i} cx={dx} cy={143} r={4.5} fill={i % 3 === 0 ? '#FF6B9D' : i % 3 === 1 ? '#FF8C42' : '#fdd34d'} />
        ))}
        {/* Petites fleurs */}
        {[95, 150, 205].map((dx, i) => (
          <G key={i}>
            <Circle cx={dx} cy={126} r={3} fill="#ff8eaf" opacity={0.8} />
            <Circle cx={dx - 3} cy={126} r={2} fill="#ff8eaf" opacity={0.5} />
            <Circle cx={dx + 3} cy={126} r={2} fill="#ff8eaf" opacity={0.5} />
          </G>
        ))}

        {/* ══ ÉTAGE HAUT ══ */}
        <Rect x={93} y={44} width={114} height={58} rx={8} fill="rgba(255,255,255,0.97)" />
        {/* Glaçage rose corail */}
        <Rect x={93} y={44} width={114} height={14} rx={7} fill="#FF6B9D" />
        {/* Drips */}
        {[108, 128, 150, 172, 193].map((dx, i) => (
          <Path key={i} d={`M${dx} 58 Q${dx + 3} ${66 + (i % 2) * 5} ${dx + 3} ${70 + (i % 2) * 5}`} stroke="#FF6B9D" strokeWidth={5.5} strokeLinecap="round" fill="none" />
        ))}
        {/* Déco petits points blancs */}
        {[108, 126, 144, 162, 180, 198].map((dx, i) => (
          <Circle key={i} cx={dx} cy={82} r={3.5} fill={i % 2 === 0 ? '#fdd34d' : 'rgba(255,255,255,0.9)'} />
        ))}

        {/* ══ BOUGIES ══ */}
        {CANDLES.map((c, i) => (
          <G key={i}>
            {/* Corps bougie */}
            <Rect x={c.x - CANDLE_W / 2} y={CANDLE_TOP_Y} width={CANDLE_W} height={CANDLE_H} rx={3} fill={c.color} />
            {/* Stries décoratives */}
            <Rect x={c.x - CANDLE_W / 2} y={CANDLE_TOP_Y + 6} width={CANDLE_W} height={2} rx={1} fill="rgba(255,255,255,0.5)" />
            <Rect x={c.x - CANDLE_W / 2} y={CANDLE_TOP_Y + 13} width={CANDLE_W} height={2} rx={1} fill="rgba(255,255,255,0.5)" />
            {/* Mèche */}
            <Path d={`M${c.x} ${CANDLE_TOP_Y} L${c.x} ${CANDLE_TOP_Y - 6}`} stroke="#555" strokeWidth={1.5} strokeLinecap="round" />
          </G>
        ))}

        {/* ══ ÉTOILES / SPARKLES DÉCO ══ */}
        {[
          { x: 15, y: 60, s: 1.3 }, { x: 280, y: 80, s: 1 }, { x: 25, y: 140, s: 0.9 },
          { x: 278, y: 155, s: 1.1 }, { x: 10, y: 200, s: 0.8 }, { x: 290, y: 210, s: 1 },
        ].map((sp, i) => (
          <G key={i} transform={`translate(${sp.x},${sp.y}) scale(${sp.s})`}>
            <Path d="M0 -7 L1.5 -1.5 L7 0 L1.5 1.5 L0 7 L-1.5 1.5 L-7 0 L-1.5 -1.5 Z" fill="#fdd34d" opacity={0.9} />
          </G>
        ))}
      </Svg>
    </View>
  );
}

// ── Slides content ────────────────────────────────────────────────────────────

function Slide1() {
  return (
    <View style={styles.slide1Wrap}>
      {CONFETTI_ITEMS.map((c, i) => <ConfettiPiece key={i} {...c} />)}
      <View style={styles.dotsPattern} />

      {/* Gâteau occupe tout l'espace supérieur */}
      <BigCakeSVG />

      {/* Texte collé directement sous le gâteau */}
      <View style={styles.slide1Text}>
        <Text style={[styles.title, { color: Colors.white, fontStyle: 'italic', fontSize: Typography['4xl'], marginBottom: 8 }]}>
          Confettis & Cake
        </Text>
        <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.85)' }]}>
          Ne manquez plus jamais un anniversaire, une fête ou un moment qui compte pour vous ✨
        </Text>
      </View>
    </View>
  );
}

function Slide2() {
  return (
    <View style={[styles.slideBody, { alignItems: 'flex-start', paddingTop: 48 }]}>
      <View style={styles.iconBox}>
        <Text style={{ fontSize: 22 }}>✦</Text>
      </View>
      <Text style={[styles.title, { textAlign: 'left', marginTop: 16 }]}>
        Des messages vraiment personnalisés
      </Text>
      <Text style={[styles.subtitle, { textAlign: 'left', marginTop: 10, marginBottom: 20 }]}>
        L'IA compose une chanson, un poème ou un message unique — adapté à la personne, à votre relation et à vos souvenirs partagés.
      </Text>
      {/* Example card */}
      <View style={styles.exCard}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          <View style={[styles.tag, { backgroundColor: Colors.primary }]}>
            <Text style={[styles.tagText, { color: '#fff' }]}>🎵 Chanson</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: Colors.primaryContainer }]}>
            <Text style={[styles.tagText, { color: Colors.onPrimaryContainer }]}>👫 Meilleur·e ami·e</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.tagText, { color: '#92400E' }]}>😄 Humoristique</Text>
          </View>
        </View>
        <View style={styles.lyricBlock}>
          <Text style={styles.lyricText}>
            {'(Refrain)\nC\'est ta journée, ton moment de gloire,\nUn nouveau chapitre dans ton histoire !'}
          </Text>
        </View>
      </View>
      {/* Format grid */}
      <View style={styles.formatGrid}>
        {[
          { e: '🎵', l: 'Chanson' },
          { e: '✍️', l: 'Poème' },
          { e: '💬', l: 'Message' },
          { e: '✨', l: 'Humour' },
        ].map((f) => (
          <View key={f.l} style={styles.formatCell}>
            <Text style={{ fontSize: 20, marginBottom: 3 }}>{f.e}</Text>
            <Text style={styles.formatLabel}>{f.l}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Slide3() {
  return (
    <View style={[styles.slideBody, { alignItems: 'flex-start', paddingTop: 48 }]}>
      <View style={[styles.iconBox, { backgroundColor: '#fdd34d' }]}>
        <Text style={{ fontSize: 22 }}>📅</Text>
      </View>
      <Text style={[styles.title, { textAlign: 'left', marginTop: 16 }]}>
        Anniversaires ET fêtes des prénoms
      </Text>
      <Text style={[styles.subtitle, { textAlign: 'left', marginTop: 10, marginBottom: 20 }]}>
        L'app détecte automatiquement les fêtes des prénoms de vos contacts et vous alerte 7 jours à l'avance.
      </Text>
      {/* Contact cards */}
      <View style={[styles.exCard, { flexDirection: 'row', alignItems: 'center', gap: 10, borderLeftWidth: 3, borderLeftColor: Colors.primary }]}>
        <View style={[styles.contactAvatar, { backgroundColor: Colors.primary }]}>
          <Text style={{ fontSize: 18 }}>🎂</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactName}>Marc · 30 ans</Text>
          <Text style={[styles.contactSub, { color: Colors.primary }]}>Demain — Anniversaire 🔥</Text>
        </View>
        <View style={styles.tagPrimary}><Text style={{ color: '#fff', fontSize: 11, fontFamily: 'BeVietnamPro_700Bold' }}>Créer</Text></View>
      </View>
      <View style={[styles.exCard, { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }]}>
        <View style={[styles.contactAvatar, { backgroundColor: Colors.primaryContainer }]}>
          <Text style={{ fontSize: 18 }}>🌸</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactName}>Sophie</Text>
          <Text style={styles.contactSub}>Dans 3 jours — Fête du prénom</Text>
        </View>
        <View style={[styles.tagPrimary, { backgroundColor: Colors.primaryContainer }]}>
          <Text style={{ color: Colors.primary, fontSize: 11, fontFamily: 'BeVietnamPro_700Bold' }}>🌸 Fête</Text>
        </View>
      </View>
      {/* Notification pill */}
      <View style={styles.notifPill}>
        <Text style={{ fontSize: 14 }}>🔔</Text>
        <Text style={styles.notifText}>Rappels configurables — 7 jours avant par défaut</Text>
      </View>
    </View>
  );
}

function Slide4() {
  return (
    <View style={[styles.slideBody, { alignItems: 'flex-start', paddingTop: 48 }]}>
      <View style={[styles.iconBox, { backgroundColor: '#c97d10' }]}>
        <Text style={{ fontSize: 22 }}>🎁</Text>
      </View>
      <Text style={[styles.title, { textAlign: 'left', marginTop: 16 }]}>
        La cagnotte collective en toute confiance
      </Text>
      <Text style={[styles.subtitle, { textAlign: 'left', marginTop: 10, marginBottom: 20 }]}>
        Organisez un cadeau commun, suivez les contributions, et recevez un justificatif comptable automatique.
      </Text>
      {/* Pot card */}
      <View style={styles.exCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <View>
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: Colors.onSurface }}>Weekend à Paris 🗼</Text>
            <Text style={{ fontSize: 10, color: Colors.onSurfaceVariant }}>Pour Mia · 25 ans · 8 participants</Text>
          </View>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 16, color: '#c97d10' }}>450€</Text>
        </View>
        <View style={styles.progressTrack}>
          <LinearGradient colors={['#fdd34d', '#c97d10']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: '75%' }]} />
        </View>
        <Text style={{ fontSize: 10, color: '#c97d10', fontFamily: 'BeVietnamPro_700Bold', textAlign: 'right', marginTop: 4 }}>75% · Objectif 600€</Text>
      </View>
      {/* Feature list */}
      {[
        { e: '🎁', l: 'Cadeau déclaré dès la création' },
        { e: '📸', l: 'Photo de confirmation post-achat' },
        { e: '📄', l: 'Reçu PDF automatique par email' },
      ].map((f) => (
        <View key={f.l} style={styles.featureRow}>
          <Text style={{ fontSize: 16 }}>{f.e}</Text>
          <Text style={styles.featureLabel}>{f.l}</Text>
        </View>
      ))}
    </View>
  );
}

function Slide5({ onLogin }: { onLogin: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { signUpWithPassword, signInWithPassword, resetPassword, updateProfile, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      showToast('Adresse email invalide', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Mot de passe : 6 caractères minimum', 'error');
      return;
    }
    try {
      if (isSignUp) {
        if (!firstName.trim()) {
          showToast('Ton prénom est requis', 'error');
          return;
        }
        await signUpWithPassword(email.trim(), password);
        await updateProfile({ full_name: firstName.trim() });
        showToast(`Bienvenue ${firstName.trim()} !`, 'success');
      } else {
        await signInWithPassword(email.trim(), password);
        showToast('Connexion réussie !', 'success');
      }
      router.replace('/(app)');
      return;
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        showToast('Email déjà utilisé. Connectez-vous.', 'error');
        setIsSignUp(false);
      } else if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        showToast('Email ou mot de passe incorrect.', 'error');
      } else {
        showToast('Une erreur est survenue. Réessayez.', 'error');
      }
    }
  };

  const handleGoogle = async () => {
    try { await signInWithGoogle(); } catch { showToast('Connexion Google échouée', 'error'); }
  };

  const handleApple = async () => {
    try { await signInWithApple(); } catch { showToast('Connexion Apple échouée', 'error'); }
  };

  return (
    <View style={[styles.slideBody, { alignItems: 'center', paddingTop: 48 }]}>
      <Text style={[styles.title, { color: Colors.primary, fontStyle: 'italic', fontSize: Typography['3xl'] }]}>
        Confettis & Cake
      </Text>
      <Text style={[styles.title, { fontSize: Typography['2xl'], marginTop: 4 }]}>
        {isSignUp ? 'On commence ! 🎉' : 'Bon retour !'}
      </Text>
      <Text style={[styles.subtitle, { marginTop: 6, marginBottom: 28 }]}>
        {isSignUp ? 'Créez votre compte gratuitement — aucune carte requise' : 'Connectez-vous à votre compte'}
      </Text>

      {/* Google */}
      <TouchableOpacity style={styles.socialBtn} onPress={handleGoogle} activeOpacity={0.8}>
        <Text style={{ fontSize: 18 }}>G</Text>
        <Text style={styles.socialBtnText}>Continuer avec Google</Text>
      </TouchableOpacity>

      {/* Apple (iOS only) */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#302e34', borderColor: '#302e34' }]} onPress={handleApple} activeOpacity={0.8}>
          <Text style={{ fontSize: 18, color: '#fff' }}>🍎</Text>
          <Text style={[styles.socialBtnText, { color: '#fff' }]}>Continuer avec Apple</Text>
        </TouchableOpacity>
      )}

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou par email</Text>
        <View style={styles.dividerLine} />
      </View>

      {isSignUp && (
        <TextInput
          style={styles.emailInput}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Votre prénom"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
          autoCorrect={false}
        />
      )}

      <TextInput
        style={[styles.emailInput, isSignUp && { marginTop: 10 }]}
        value={email}
        onChangeText={setEmail}
        placeholder="Votre adresse email"
        placeholderTextColor={Colors.outlineVariant}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={{ width: '100%', marginTop: 10 }}>
        <TextInput
          style={styles.emailInput}
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe (6 caractères min.)"
          placeholderTextColor={Colors.outlineVariant}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((v) => !v)}
          style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 12, color: Colors.onSurfaceVariant, fontFamily: 'BeVietnamPro_500Medium' }}>
            {showPassword ? 'Masquer' : 'Voir'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.emailBtn, isLoading && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        <Text style={styles.emailBtnText}>
          {isSignUp ? 'Créer mon compte gratuitement' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      {!isSignUp && (
        <TouchableOpacity
          style={{ marginTop: 8 }}
          onPress={async () => {
            if (!email.trim() || !email.includes('@')) {
              showToast('Saisis ton email ci-dessus d\'abord', 'error');
              return;
            }
            try {
              await resetPassword(email.trim());
              showToast('Email de réinitialisation envoyé !', 'success');
            } catch {
              showToast('Erreur lors de l\'envoi. Réessayez.', 'error');
            }
          }}
        >
          <Text style={[styles.loginLink, { color: Colors.primary }]}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 12 }}>
        <Text style={styles.loginLink}>
          {isSignUp
            ? <>Déjà un compte ? <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>Se connecter</Text></>
            : <>Pas encore de compte ? <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>Créer un compte</Text></>
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

const SLIDE_COUNT = 5;

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goTo = (index: number) => {
    flatRef.current?.scrollToIndex({ index, animated: true });
    setCurrent(index);
  };

  const handleNext = () => {
    if (current < SLIDE_COUNT - 1) {
      goTo(current + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => router.replace('/(auth)/login');

  const isSlide1 = current === 0;
  const isSlide4 = current === 3;
  const isSlide5 = current === 4;

  const dotActiveColor = isSlide1 ? '#fdd34d' : isSlide4 ? '#c97d10' : Colors.primary;
  const dotInactiveColor = isSlide1 ? 'rgba(255,255,255,0.3)' : Colors.outlineVariant;

  const SLIDES_DATA = [
    { key: '1' },
    { key: '2' },
    { key: '3' },
    { key: '4' },
    { key: '5' },
  ];

  const renderSlide = ({ item }: { item: { key: string } }) => {
    const bg: [string, string, ...string[]] =
      item.key === '1' ? ['#FF6B9D', '#e84f7d', '#FF8C42']
      : item.key === '4' ? ['#FAEEDA', '#FEF3C7']
      : [Colors.background, Colors.background];

    return (
      <LinearGradient colors={bg} style={{ width: W, flex: 1 }}>
        {item.key === '1' && <Slide1 />}
        {item.key === '2' && <Slide2 />}
        {item.key === '3' && <Slide3 />}
        {item.key === '4' && <Slide4 />}
        {item.key === '5' && <Slide5 onLogin={handleSkip} />}
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        ref={flatRef}
        data={SLIDES_DATA}
        renderItem={renderSlide}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / W);
          setCurrent(idx);
        }}
        style={{ flex: 1 }}
      />

      {/* Footer fixe */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: isSlide1 ? 'transparent' : 'transparent' }]}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {SLIDES_DATA.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[
                styles.dot,
                i === current
                  ? [styles.dotActive, { backgroundColor: dotActiveColor }]
                  : [styles.dotInactive, { backgroundColor: dotInactiveColor }],
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Boutons (masqués sur slide 5 — elle gère ses propres boutons) */}
        {!isSlide5 && (
          <>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: isSlide1 ? '#fdd34d' : Colors.primary,
                },
              ]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={[styles.btnText, { color: isSlide1 ? '#463600' : '#fff' }]}>
                {isSlide4 ? 'Créer mon compte →' : current === 0 ? 'Commencer →' : 'Suivant →'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={[styles.skipText, isSlide1 && { color: 'rgba(255,255,255,0.5)' }]}>
                {current === 0 ? 'Passer l\'intro' : 'Passer'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  slideBody: {
    flex: 1,
    paddingHorizontal: Spacing[6],
    position: 'relative',
    overflow: 'hidden',
  },

  dotsPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.06,
  },

  // Slide 1
  slide1Wrap: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  bigCakeWrap: {
    width: '100%',
    position: 'relative',
  },
  slide1Text: {
    paddingHorizontal: Spacing[6],
    paddingTop: 4,
    alignItems: 'center',
  },

  // Typography
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },

  // Icon box (slides 2–4)
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Example cards
  exCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 13,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    width: '100%',
    marginBottom: 8,
  },

  // Tags
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  tagPrimary: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },

  // Lyric
  lyricBlock: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  lyricText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.onPrimaryContainer,
    lineHeight: 19,
  },

  // Format grid
  formatGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  formatCell: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
  },
  formatLabel: {
    fontSize: 9,
    fontFamily: 'BeVietnamPro_700Bold',
    color: Colors.onSurfaceVariant,
  },

  // Contact items
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 13,
    color: Colors.onSurface,
  },
  contactSub: {
    fontSize: 11,
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.onSurfaceVariant,
  },

  // Notif pill
  notifPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
    width: '100%',
    marginTop: 8,
  },
  notifText: {
    flex: 1,
    fontSize: 11,
    color: Colors.white,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },

  // Pot progress
  progressTrack: {
    height: 8,
    borderRadius: Radii.full,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.full,
  },

  // Feature rows (slide 4)
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    width: '100%',
    marginTop: 6,
  },
  featureLabel: {
    fontSize: 12,
    color: Colors.onSurface,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },

  // Slide 5 — auth
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 13,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  socialBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginVertical: 14,
  },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: Colors.primaryContainer },
  dividerText: {
    fontSize: 12,
    color: Colors.outlineVariant,
    fontFamily: 'BeVietnamPro_600SemiBold',
  },
  emailInput: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    fontSize: Typography.base,
    color: Colors.onSurface,
    fontFamily: 'BeVietnamPro_400Regular',
    marginBottom: 10,
  },
  emailBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    marginBottom: 0,
  },
  emailBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.base,
    color: Colors.white,
  },
  loginLink: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontFamily: 'BeVietnamPro_400Regular',
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing[6],
    paddingTop: 6,
    gap: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dot: { height: 6, borderRadius: Radii.full },
  dotActive: { width: 24 },
  dotInactive: { width: 6, backgroundColor: Colors.outlineVariant },
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: Radii.full,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
  },
  skipBtn: { alignItems: 'center', paddingVertical: 4 },
  skipText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.outlineVariant,
  },
});
