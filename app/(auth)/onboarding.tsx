import { useState, useRef, useEffect, useCallback } from 'react';
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
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import Svg, { Ellipse, Rect, Circle, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useAuthStore } from '../../src/stores/authStore';
import { useUIStore } from '../../src/stores/uiStore';
import { applyReferralCode } from '../../src/services/referral.service';
import { createContact } from '../../src/services/contacts.service';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';

const { width: W, height: H } = Dimensions.get('window');

type OnboardingStep = 'slides' | 'auth' | 'profile' | 'notifs' | 'firstContact';

// ── Help Modal ────────────────────────────────────────────────────────────────

function HelpModal({ visible, onClose, title, body }: {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={helpStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={helpStyles.card}>
          <Text style={helpStyles.title}>{title}</Text>
          <Text style={helpStyles.body}>{body}</Text>
          <TouchableOpacity style={helpStyles.btn} onPress={onClose} activeOpacity={0.8}>
            <Text style={helpStyles.btnText}>OK, j'ai compris !</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const helpStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  body: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: '#fff',
  },
});

// ── Help Button ───────────────────────────────────────────────────────────────

function HelpBtn({ onPress, light }: { onPress: () => void; light?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.helpBtn, light && styles.helpBtnLight]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <Text style={[styles.helpBtnText, light && styles.helpBtnTextLight]}>ℹ️</Text>
    </TouchableOpacity>
  );
}

// ── Confetti ──────────────────────────────────────────────────────────────────

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
        Animated.timing(anim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
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

// ── Animated Flames ────────────────────────────────────────────────────────────

const CANDLES = [
  { x: 97, color: '#FF6B9D' }, { x: 110, color: '#fdd34d' }, { x: 123, color: '#FF8C42' },
  { x: 136, color: '#fff' }, { x: 149, color: '#FF6B9D' }, { x: 162, color: '#fdd34d' },
  { x: 175, color: '#FF8C42' }, { x: 188, color: '#fff' }, { x: 201, color: '#FF6B9D' },
];
const CANDLE_H = 32;
const CANDLE_W = 10;
const CANDLE_TOP_Y = 84;

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
  const flameY = CANDLE_TOP_Y - 18;
  const glowScale = flicker.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });
  const glowOpacity = flicker.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.55] });

  return (
    <>
      <Animated.View style={{ position: 'absolute', left: x - 12, top: flameY - 18, width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFD34D', transform: [{ scale: glowScale }], opacity: glowOpacity }} />
      <Animated.View style={{ position: 'absolute', left: x - 9, top: flameY - 18, width: 18, height: 22, transform: [{ scaleX }, { scaleY }], opacity, transformOrigin: 'bottom' }}>
        <Svg width={18} height={22} viewBox="0 0 18 22">
          <Path d="M9 22 C3 17 0 12 4 6 C5 4 7 1 9 0 C11 1 13 4 14 6 C18 12 15 17 9 22Z" fill="#FF6B35" />
          <Path d="M9 19 C5 16 4 12 6 8 C7 6 8 4 9 3 C10 4 11 6 12 8 C14 12 13 16 9 19Z" fill="#fdd34d" />
          <Path d="M9 15 C8 13 8 10 9 8.5 C10 10 10 13 9 15Z" fill="rgba(255,255,255,0.65)" />
        </Svg>
      </Animated.View>
    </>
  );
}

// ── BigCakeSVG ────────────────────────────────────────────────────────────────

const SVG_W = 300;
const SVG_H = 240;
const CAKE_SVG_HEIGHT = H * 0.56;

function BigCakeSVG() {
  return (
    <View style={styles.bigCakeWrap}>
      {CANDLES.map((c, i) => <AnimatedFlame key={i} x={(c.x / SVG_W) * W} delay={i * 80} />)}
      <Svg width={W} height={CAKE_SVG_HEIGHT} viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMax meet">
        <Defs>
          <RadialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <Stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={150} cy={237} rx={105} ry={8} fill="rgba(0,0,0,0.18)" />
        <Rect x={28} y={162} width={244} height={68} rx={10} fill="rgba(255,255,255,0.96)" />
        <Rect x={28} y={162} width={244} height={16} rx={8} fill="#FFB3CE" />
        {[50, 80, 115, 155, 195, 230, 255].map((dx, i) => <Path key={i} d={`M${dx} 178 Q${dx + 4} ${188 + (i % 3) * 5} ${dx + 4} ${192 + (i % 3) * 5}`} stroke="#FFB3CE" strokeWidth={7} strokeLinecap="round" fill="none" />)}
        {[55, 80, 107, 134, 161, 188, 215, 242].map((dx, i) => <Circle key={i} cx={dx} cy={204} r={5} fill={i % 2 === 0 ? '#fdd34d' : '#ff8eaf'} />)}
        {[68, 122, 178, 232].map((dx, i) => <Path key={i} d={`M${dx} 220 l2 -5 2 5 -5 -3 6 0z`} fill="#fff" opacity={0.7} />)}
        <Rect x={62} y={100} width={176} height={64} rx={9} fill="rgba(255,255,255,0.96)" />
        <Rect x={62} y={100} width={176} height={15} rx={7} fill="#fdd34d" />
        {[80, 108, 135, 163, 193, 215].map((dx, i) => <Path key={i} d={`M${dx} 115 Q${dx + 4} ${124 + (i % 2) * 6} ${dx + 4} ${128 + (i % 2) * 6}`} stroke="#fdd34d" strokeWidth={6} strokeLinecap="round" fill="none" />)}
        {[80, 106, 132, 158, 184, 210].map((dx, i) => <Circle key={i} cx={dx} cy={143} r={4.5} fill={i % 3 === 0 ? '#FF6B9D' : i % 3 === 1 ? '#FF8C42' : '#fdd34d'} />)}
        {[95, 150, 205].map((dx, i) => <G key={i}><Circle cx={dx} cy={126} r={3} fill="#ff8eaf" opacity={0.8} /><Circle cx={dx - 3} cy={126} r={2} fill="#ff8eaf" opacity={0.5} /><Circle cx={dx + 3} cy={126} r={2} fill="#ff8eaf" opacity={0.5} /></G>)}
        <Rect x={93} y={44} width={114} height={58} rx={8} fill="rgba(255,255,255,0.97)" />
        <Rect x={93} y={44} width={114} height={14} rx={7} fill="#FF6B9D" />
        {[108, 128, 150, 172, 193].map((dx, i) => <Path key={i} d={`M${dx} 58 Q${dx + 3} ${66 + (i % 2) * 5} ${dx + 3} ${70 + (i % 2) * 5}`} stroke="#FF6B9D" strokeWidth={5.5} strokeLinecap="round" fill="none" />)}
        {[108, 126, 144, 162, 180, 198].map((dx, i) => <Circle key={i} cx={dx} cy={82} r={3.5} fill={i % 2 === 0 ? '#fdd34d' : 'rgba(255,255,255,0.9)'} />)}
        {CANDLES.map((c, i) => <G key={i}><Rect x={c.x - CANDLE_W / 2} y={CANDLE_TOP_Y} width={CANDLE_W} height={CANDLE_H} rx={3} fill={c.color} /><Rect x={c.x - CANDLE_W / 2} y={CANDLE_TOP_Y + 6} width={CANDLE_W} height={2} rx={1} fill="rgba(255,255,255,0.5)" /><Rect x={c.x - CANDLE_W / 2} y={CANDLE_TOP_Y + 13} width={CANDLE_W} height={2} rx={1} fill="rgba(255,255,255,0.5)" /><Path d={`M${c.x} ${CANDLE_TOP_Y} L${c.x} ${CANDLE_TOP_Y - 6}`} stroke="#555" strokeWidth={1.5} strokeLinecap="round" /></G>)}
        {[{ x: 15, y: 60, s: 1.3 }, { x: 280, y: 80, s: 1 }, { x: 25, y: 140, s: 0.9 }, { x: 278, y: 155, s: 1.1 }, { x: 10, y: 200, s: 0.8 }, { x: 290, y: 210, s: 1 }].map((sp, i) => <G key={i} transform={`translate(${sp.x},${sp.y}) scale(${sp.s})`}><Path d="M0 -7 L1.5 -1.5 L7 0 L1.5 1.5 L0 7 L-1.5 1.5 L-7 0 L-1.5 -1.5 Z" fill="#fdd34d" opacity={0.9} /></G>)}
      </Svg>
    </View>
  );
}

// ── Slides ────────────────────────────────────────────────────────────────────

function Slide1() {
  return (
    <View style={styles.slide1Wrap}>
      {CONFETTI_ITEMS.map((c, i) => <ConfettiPiece key={i} {...c} />)}
      <View style={styles.dotsPattern} />
      <BigCakeSVG />
      <View style={styles.slide1Text}>
        <Text style={[styles.title, { color: Colors.white, fontStyle: 'italic', fontSize: Typography['4xl'], marginBottom: 8 }]}>
          Confettis & Cake
        </Text>
        <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.85)' }]}>
          Ne manque plus jamais un anniversaire, une fête ou un moment qui compte vraiment ✨
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
      <Text style={[styles.title, { textAlign: 'left', marginTop: 16 }]}>Des messages vraiment personnalisés</Text>
      <Text style={[styles.subtitle, { textAlign: 'left', marginTop: 10, marginBottom: 20 }]}>
        L'IA compose une chanson, un poème ou un message unique — adapté à la personne, à ta relation et à tes souvenirs partagés.
      </Text>
      <View style={styles.exCard}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          <View style={[styles.tag, { backgroundColor: Colors.primary }]}><Text style={[styles.tagText, { color: '#fff' }]}>🎵 Chanson</Text></View>
          <View style={[styles.tag, { backgroundColor: Colors.primaryContainer }]}><Text style={[styles.tagText, { color: Colors.onPrimaryContainer }]}>👫 Meilleur·e ami·e</Text></View>
          <View style={[styles.tag, { backgroundColor: '#FEF3C7' }]}><Text style={[styles.tagText, { color: '#92400E' }]}>😄 Humoristique</Text></View>
        </View>
        <View style={styles.lyricBlock}>
          <Text style={styles.lyricText}>{'(Refrain)\nC\'est ta journée, ton moment de gloire,\nUn nouveau chapitre dans ton histoire !'}</Text>
        </View>
      </View>
      <View style={styles.formatGrid}>
        {[{ e: '🎵', l: 'Chanson' }, { e: '✍️', l: 'Poème' }, { e: '💬', l: 'Message' }, { e: '✨', l: 'Humour' }].map((f) => (
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
      <Text style={[styles.title, { textAlign: 'left', marginTop: 16 }]}>Anniversaires ET fêtes des prénoms</Text>
      <Text style={[styles.subtitle, { textAlign: 'left', marginTop: 10, marginBottom: 20 }]}>
        L'app détecte automatiquement les fêtes des prénoms de tes contacts et t'alerte 7 jours à l'avance.
      </Text>
      <View style={[styles.exCard, { flexDirection: 'row', alignItems: 'center', gap: 10, borderLeftWidth: 3, borderLeftColor: Colors.primary }]}>
        <View style={[styles.contactAvatar, { backgroundColor: Colors.primary }]}><Text style={{ fontSize: 18 }}>🎁</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactName}>Marc · 30 ans</Text>
          <Text style={[styles.contactSub, { color: Colors.primary }]}>Demain — Anniversaire 🔥</Text>
        </View>
        <View style={styles.tagPrimary}><Text style={{ color: '#fff', fontSize: 11, fontFamily: 'BeVietnamPro_700Bold' }}>Créer</Text></View>
      </View>
      <View style={[styles.exCard, { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }]}>
        <View style={[styles.contactAvatar, { backgroundColor: Colors.primaryContainer }]}><Text style={{ fontSize: 18 }}>🌸</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactName}>Sophie</Text>
          <Text style={styles.contactSub}>Dans 3 jours — Fête</Text>
        </View>
        <View style={[styles.tagPrimary, { backgroundColor: Colors.primaryContainer }]}><Text style={{ color: Colors.primary, fontSize: 11, fontFamily: 'BeVietnamPro_700Bold' }}>🌸 Fête</Text></View>
      </View>
      <View style={styles.notifPill}>
        <Text style={{ fontSize: 14 }}>🔔</Text>
        <Text style={styles.notifText}>Rappels configurables — 7 jours avant par défaut</Text>
      </View>
    </View>
  );
}

function Slide4() {
  return (
    <View style={[styles.slideBody, { alignItems: 'center', justifyContent: 'center', paddingTop: 0 }]}>
      {/* Big emoji */}
      <Text style={{ fontSize: 72, marginBottom: 16 }}>🎉</Text>

      <Text style={[styles.title, { fontSize: Typography['3xl'], textAlign: 'center' }]}>
        Prêt à célébrer comme jamais ?
      </Text>
      <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 14, marginBottom: 32, maxWidth: 300 }]}>
        En 2 minutes, crée ton compte et envoie ton premier message magique gratuitement — sans carte bancaire.
      </Text>

      {/* Feature pills */}
      <View style={{ gap: 10, width: '100%' }}>
        {[
          { e: '🤖', t: 'Messages IA sans faute, toujours juste' },
          { e: '📅', t: 'Calendrier anniversaires & fêtes auto' },
          { e: '🎁', t: 'Cagnottes collectives simplifiées' },
          { e: '🔔', t: 'Rappels personnalisés pour ne rien oublier' },
        ].map((f) => (
          <View key={f.t} style={styles.ctaFeatureRow}>
            <Text style={{ fontSize: 18, width: 28 }}>{f.e}</Text>
            <Text style={styles.ctaFeatureText}>{f.t}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────

function AuthScreen({
  onSignupSuccess,
  onLoginSuccess,
  onHelp,
}: {
  onSignupSuccess: () => void;
  onLoginSuccess: () => void;
  onHelp: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { signUpWithPassword, signInWithPassword, resetPassword, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) { showToast('Adresse email invalide', 'error'); return; }
    if (password.length < 6) { showToast('Mot de passe : 6 caractères minimum', 'error'); return; }
    try {
      if (isSignUp) {
        await signUpWithPassword(email.trim(), password);
        // Appliquer code parrainage si renseigné
        const user = useAuthStore.getState().user;
        if (referralCode.trim() && user) {
          await applyReferralCode(referralCode.trim(), user.id, email.trim()).catch(() => {});
          await useAuthStore.getState().fetchProfile();
        }
        onSignupSuccess();
      } else {
        await signInWithPassword(email.trim(), password);
        showToast('Bon retour ! 👋', 'success');
        onLoginSuccess();
      }
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        showToast('Email déjà utilisé. Connecte-toi.', 'error'); setIsSignUp(false);
      } else if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        showToast('Email ou mot de passe incorrect.', 'error');
      } else {
        showToast('Une erreur est survenue. Réessayez.', 'error');
      }
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      // Google auth redirige via deep link — la navigation se fait dans _layout
    } catch { showToast('Connexion Google échouée', 'error'); }
  };

  const handleApple = async () => {
    try { await signInWithApple(); } catch { showToast('Connexion Apple échouée', 'error'); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.authScroll]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Help button */}
        <View style={styles.stepHelpRow}>
          <HelpBtn onPress={onHelp} />
        </View>

        <Text style={[styles.title, { color: Colors.primary, fontStyle: 'italic', fontSize: Typography['3xl'], textAlign: 'center' }]}>
          Confettis & Cake
        </Text>
        <Text style={[styles.title, { fontSize: Typography['2xl'], marginTop: 4, textAlign: 'center' }]}>
          {isSignUp ? 'On commence ! 🎉' : 'Bon retour !'}
        </Text>
        <Text style={[styles.subtitle, { marginTop: 6, marginBottom: 24, textAlign: 'center' }]}>
          {isSignUp ? 'Crée ton compte gratuitement — aucune carte requise' : 'Connecte-toi à ton compte'}
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

        <TextInput
          style={styles.emailInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Ton adresse email"
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ width: '100%', marginBottom: 10 }}>
          <TextInput
            style={[styles.emailInput, { marginBottom: 0 }]}
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

        {isSignUp && (
          <>
            <TextInput
              style={styles.emailInput}
              value={referralCode}
              onChangeText={(v) => setReferralCode(v.toUpperCase())}
              placeholder="Code parrainage (optionnel)"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.referralHint}>
              🎟️ Tu as reçu un code d'un ami ? Saisis-le ici — vous recevrez chacun 5 crédits IA offerts !
            </Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.emailBtn, isLoading && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.emailBtnText}>
            {isSignUp ? 'Créer mon compte gratuitement →' : 'Se connecter →'}
          </Text>
        </TouchableOpacity>

        {!isSignUp && (
          <TouchableOpacity
            style={{ marginTop: 8, alignSelf: 'center' }}
            onPress={async () => {
              if (!email.trim() || !email.includes('@')) { showToast('Saisis ton email ci-dessus d\'abord', 'error'); return; }
              try { await resetPassword(email.trim()); showToast('Email de réinitialisation envoyé !', 'success'); }
              catch { showToast('Erreur lors de l\'envoi. Réessayez.', 'error'); }
            }}
          >
            <Text style={[styles.loginLink, { color: Colors.primary }]}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 12, alignSelf: 'center' }}>
          <Text style={styles.loginLink}>
            {isSignUp
              ? <>Déjà un compte ? <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>Se connecter</Text></>
              : <>Pas encore de compte ? <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>Créer un compte</Text></>
            }
          </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Profile Step ──────────────────────────────────────────────────────────────

function ProfileStep({ onNext, onHelp }: { onNext: (firstName: string) => void; onHelp: () => void }) {
  const [civilite, setCivilite] = useState<'M.' | 'Mme' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const { updateProfile, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const handleNext = async () => {
    if (!civilite) { showToast('Ta civilité est requise 😊', 'error'); return; }
    if (!firstName.trim()) { showToast('Ton prénom est requis 😊', 'error'); return; }
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const birthdayStr = birthday ? format(birthday, 'yyyy-MM-dd') : null;
      await updateProfile({
        full_name: fullName,
        civilite,
        ...(birthdayStr ? { birthday: birthdayStr } : {}),
      });
      onNext(firstName.trim());
    } catch {
      showToast('Erreur lors de la sauvegarde. Réessayez.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHelpRow}>
          <HelpBtn onPress={onHelp} />
        </View>

        <Text style={styles.stepEmoji}>👋</Text>
        <Text style={styles.stepTitle}>Bienvenue ! Dis-nous qui tu es</Text>
        <Text style={styles.stepSubtitle}>
          Pour personnaliser tes messages et te souhaiter bonne fête le moment venu 😉
        </Text>

        {/* Civilité */}
        <Text style={styles.civiliteLabel}>Civilité *</Text>
        <View style={styles.civiliteRow}>
          <TouchableOpacity
            style={[styles.civiliteBtn, civilite === 'M.' && styles.civiliteBtnActive]}
            onPress={() => setCivilite('M.')}
            activeOpacity={0.8}
          >
            <Text style={[styles.civiliteBtnText, civilite === 'M.' && styles.civiliteBtnTextActive]}>👨 M.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.civiliteBtn, civilite === 'Mme' && styles.civiliteBtnActive]}
            onPress={() => setCivilite('Mme')}
            activeOpacity={0.8}
          >
            <Text style={[styles.civiliteBtnText, civilite === 'Mme' && styles.civiliteBtnTextActive]}>👩 Mme</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.emailInput}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ton prénom *"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TextInput
          style={styles.emailInput}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Ton nom (optionnel)"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
          autoCorrect={false}
        />

        {/* Date de naissance */}
        <TouchableOpacity
          style={[styles.emailInput, { justifyContent: 'center' }]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: birthday ? Colors.onSurface : Colors.outlineVariant }}>
            {birthday ? `🎂 ${format(birthday, 'dd/MM/yyyy')}` : '🎂 Ta date de naissance (optionnel)'}
          </Text>
        </TouchableOpacity>

        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={birthday ?? new Date(1990, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, d) => {
              setShowPicker(false);
              if (d) setBirthday(d);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.emailBtn, { marginTop: 8 }, isLoading && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.emailBtnText}>Continuer →</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Notifications Step ────────────────────────────────────────────────────────

function NotifsStep({ firstName, onNext, onSkip, onHelp }: {
  firstName: string;
  onNext: () => void;
  onSkip: () => void;
  onHelp: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // OK
      }
    } finally {
      setLoading(false);
      onNext();
    }
  };

  return (
    <View style={[styles.stepScroll, { alignItems: 'center' }]}>
      <View style={styles.stepHelpRow}>
        <HelpBtn onPress={onHelp} />
      </View>

      <Text style={[styles.stepEmoji, { fontSize: 56 }]}>🔔</Text>
      <Text style={[styles.stepTitle, { textAlign: 'center' }]}>
        {firstName}, active les notifications !
      </Text>
      <Text style={[styles.stepSubtitle, { textAlign: 'center', marginBottom: 28 }]}>
        On te prévient 7 jours avant chaque anniversaire et fête — pour que tu aies le temps de préparer quelque chose de mémorable.
      </Text>

      {/* Benefit cards */}
      <View style={{ gap: 10, width: '100%', marginBottom: 24 }}>
        {[
          { e: '🎂', t: 'Rappels anniversaires', sub: '7 jours avant, jamais pris de court' },
          { e: '🌸', t: 'Fêtes des prénoms', sub: 'Détectées automatiquement' },
          { e: '⏰', t: 'Rappels personnalisés', sub: 'Ceux que toi-même tu crées' },
        ].map((b) => (
          <View key={b.t} style={styles.notifBenefit}>
            <Text style={{ fontSize: 22, width: 32 }}>{b.e}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifBenefitTitle}>{b.t}</Text>
              <Text style={styles.notifBenefitSub}>{b.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.emailBtn, loading && { opacity: 0.5 }]}
        onPress={handleAllow}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.emailBtnText}>🔔 Activer les notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSkip} style={{ marginTop: 10, alignSelf: 'center' }}>
        <Text style={styles.skipText}>Pas maintenant</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── First Contact Step ────────────────────────────────────────────────────────

function FirstContactStep({ onNext, onSkip, onHelp }: {
  onNext: () => void;
  onSkip: () => void;
  onHelp: () => void;
}) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const RELATIONS = [
    { id: 'family', label: 'Famille', emoji: '👨‍👩‍👧' },
    { id: 'best_friend', label: 'Meilleur·e ami·e', emoji: '🤝' },
    { id: 'friend', label: 'Ami·e', emoji: '😊' },
    { id: 'partner', label: 'Partenaire', emoji: '💑' },
  ] as const;
  const [relation, setRelation] = useState<typeof RELATIONS[number]['id']>('family');

  const handleAdd = async () => {
    if (!name.trim()) { showToast('Saisis un prénom au moins 😊', 'error'); return; }
    if (!user) { onNext(); return; }
    setLoading(true);
    try {
      await createContact(user.id, {
        name: name.trim(),
        birthday: birthday ? format(birthday, 'yyyy-MM-dd') : null,
        relation,
        phone: null,
        email: null,
        notes: null,
        avatar_url: null,
        imported_from: 'manual',
        personality_tags: [],
        preferred_channel: null,
        preferred_send_time: null,
        pet_owner_name: null,
        pet_type: null,
        preferred_language: null,
        name_day: null,
        favourite_color: null,
        pet_gender: null,
        pet_owner_contact_id: null,
      });
      showToast(`${name.trim()} ajouté·e ! 🎉`, 'success');
      onNext();
    } catch {
      showToast('Erreur lors de l\'ajout. Réessayez.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHelpRow}>
          <HelpBtn onPress={onHelp} />
        </View>

        <Text style={styles.stepEmoji}>🎁</Text>
        <Text style={styles.stepTitle}>Ton premier proche !</Text>
        <Text style={styles.stepSubtitle}>
          Qui ne doit jamais manquer un message de ta part ? Commence par une seule personne — tu ajouteras les autres ensuite.
        </Text>

        <TextInput
          style={styles.emailInput}
          value={name}
          onChangeText={setName}
          placeholder="Son prénom et nom"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
          autoCorrect={false}
        />

        {/* Relation picker */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {RELATIONS.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[styles.relationChip, relation === r.id && styles.relationChipSelected]}
              onPress={() => setRelation(r.id)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14 }}>{r.emoji}</Text>
              <Text style={[styles.relationChipText, relation === r.id && { color: Colors.primary }]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Birthday picker */}
        <TouchableOpacity
          style={[styles.emailInput, { justifyContent: 'center' }]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: birthday ? Colors.onSurface : Colors.outlineVariant }}>
            {birthday ? `🎂 ${format(birthday, 'dd/MM/yyyy')}` : '🎂 Sa date de naissance (optionnel)'}
          </Text>
        </TouchableOpacity>

        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={birthday ?? new Date(1990, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, d) => {
              setShowPicker(false);
              if (d) setBirthday(d);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.emailBtn, { marginTop: 8 }, loading && { opacity: 0.5 }]}
          onPress={handleAdd}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.emailBtnText}>Ajouter et commencer ! 🎉</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkip} style={{ marginTop: 10, alignSelf: 'center' }}>
          <Text style={styles.skipText}>Passer pour l'instant</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Help content per step ─────────────────────────────────────────────────────

const HELP_CONTENT: Record<string, { title: string; body: string }> = {
  slides: {
    title: 'Confettis & Cake',
    body: 'Confettis & Cake est une app gratuite pour ne plus jamais manquer un anniversaire, une fête ou un moment qui compte. L\'IA rédige des messages uniques, la chanson ou le poème parfait pour chaque personne.',
  },
  auth: {
    title: 'Ton compte',
    body: 'Crée ton compte gratuitement en quelques secondes — sans carte bancaire. Tu peux utiliser Google, Apple (iOS) ou simplement ton email. Tes données sont stockées en sécurité et ne sont jamais revendues.',
  },
  profile: {
    title: 'Ton profil',
    body: 'Ta civilité (M. ou Mme) permet à l\'IA de personnaliser les messages avec le bon accord grammatical et de générer les bonnes signatures famille. Ton prénom apparaîtra dans tes messages. Ta date de naissance est optionnelle — elle servira à calculer ta compatibilité avec tes contacts !',
  },
  notifs: {
    title: 'Les notifications',
    body: 'Les notifications te permettent de recevoir un rappel 7 jours avant chaque anniversaire et fête. Elles ne seront jamais intrusives — tu peux les configurer finement dans l\'app. Sans elles, tu devras consulter l\'app manuellement.',
  },
  firstContact: {
    title: 'Ton premier contact',
    body: 'Ajoute la personne qui te tient le plus à cœur — celle que tu ne veux JAMAIS oublier. Tu pourras en ajouter autant que tu veux ensuite, y compris en important depuis ton téléphone.',
  },
};

// ── Main Screen ───────────────────────────────────────────────────────────────

const SLIDE_COUNT = 4;
const SLIDES_DATA = [{ key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }];

export default function OnboardingScreen() {
  const [step, setStep] = useState<OnboardingStep>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);

  const flatRef = useRef<FlatList>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goTo = useCallback((index: number) => {
    flatRef.current?.scrollToIndex({ index, animated: true });
    setCurrentSlide(index);
  }, []);

  const handleNextSlide = () => {
    if (currentSlide < SLIDE_COUNT - 1) {
      goTo(currentSlide + 1);
    } else {
      setStep('auth');
    }
  };

  const handleSkipSlides = () => setStep('auth');

  const handleSignupSuccess = () => setStep('profile');
  const handleLoginSuccess = () => router.replace('/(app)');

  const handleProfileNext = (name: string) => {
    setFirstName(name);
    setStep('notifs');
  };

  const handleNotifsNext = () => setStep('firstContact');

  const handleFirstContactDone = () => router.replace('/(app)');

  const helpKey = step === 'slides' ? 'slides' : step;

  // ── Slide rendering ──────────────────────────────────────────────────────

  const isSlide1 = currentSlide === 0;
  const isSlide4 = currentSlide === 3;
  const dotActiveColor = isSlide1 ? '#fdd34d' : isSlide4 ? Colors.primary : Colors.primary;
  const dotInactiveColor = isSlide1 ? 'rgba(255,255,255,0.3)' : Colors.outlineVariant;

  const renderSlide = ({ item }: { item: { key: string } }) => {
    const bg: [string, string, ...string[]] =
      item.key === '1' ? ['#FF6B9D', '#e84f7d', '#FF8C42']
      : item.key === '4' ? ['#FDF6FF', '#EDE7FF']
      : [Colors.background, Colors.background];

    return (
      <LinearGradient colors={bg} style={{ width: W, flex: 1 }}>
        {item.key === '1' && <Slide1 />}
        {item.key === '2' && <Slide2 />}
        {item.key === '3' && <Slide3 />}
        {item.key === '4' && <Slide4 />}
      </LinearGradient>
    );
  };

  // ── Step screens (post-slides) ────────────────────────────────────────────

  if (step !== 'slides') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
        <HelpModal
          visible={helpVisible}
          onClose={() => setHelpVisible(false)}
          title={HELP_CONTENT[helpKey]?.title ?? ''}
          body={HELP_CONTENT[helpKey]?.body ?? ''}
        />

        {/* Progress dots */}
        <View style={styles.stepDotsRow}>
          {(['auth', 'profile', 'notifs', 'firstContact'] as OnboardingStep[]).map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                s === step
                  ? { backgroundColor: Colors.primary, width: 24 }
                  : (['auth', 'profile', 'notifs', 'firstContact'] as OnboardingStep[]).indexOf(s)
                    < (['auth', 'profile', 'notifs', 'firstContact'] as OnboardingStep[]).indexOf(step)
                    ? { backgroundColor: Colors.primary, opacity: 0.4 }
                    : { backgroundColor: Colors.outlineVariant },
              ]}
            />
          ))}
        </View>

        {step === 'auth' && (
          <AuthScreen
            onSignupSuccess={handleSignupSuccess}
            onLoginSuccess={handleLoginSuccess}
            onHelp={() => setHelpVisible(true)}
          />
        )}
        {step === 'profile' && (
          <ProfileStep
            onNext={handleProfileNext}
            onHelp={() => setHelpVisible(true)}
          />
        )}
        {step === 'notifs' && (
          <ScrollView contentContainerStyle={[styles.stepScroll, { paddingHorizontal: Spacing[6] }]} showsVerticalScrollIndicator={false}>
            <NotifsStep
              firstName={firstName}
              onNext={handleNotifsNext}
              onSkip={handleNotifsNext}
              onHelp={() => setHelpVisible(true)}
            />
          </ScrollView>
        )}
        {step === 'firstContact' && (
          <FirstContactStep
            onNext={handleFirstContactDone}
            onSkip={handleFirstContactDone}
            onHelp={() => setHelpVisible(true)}
          />
        )}
      </SafeAreaView>
    );
  }

  // ── Slides screen ─────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        title={HELP_CONTENT.slides.title}
        body={HELP_CONTENT.slides.body}
      />

      {/* Help button flottant sur les slides (hors slide 1 pour lisibilité) */}
      {!isSlide1 && (
        <View style={styles.slidesHelpBtn}>
          <HelpBtn onPress={() => setHelpVisible(true)} />
        </View>
      )}

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
          setCurrentSlide(idx);
        }}
        style={{ flex: 1 }}
      />

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dotsRow}>
          {SLIDES_DATA.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[
                styles.dot,
                i === currentSlide
                  ? [styles.dotActive, { backgroundColor: dotActiveColor }]
                  : [styles.dotInactive, { backgroundColor: dotInactiveColor }],
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: isSlide1 ? '#fdd34d' : Colors.primary }]}
          onPress={handleNextSlide}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { color: isSlide1 ? '#463600' : '#fff' }]}>
            {currentSlide === 0 ? 'Commencer →' : isSlide4 ? 'Créer mon compte →' : 'Suivant →'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkipSlides} style={styles.skipBtn}>
          <Text style={[styles.skipText, isSlide1 && { color: 'rgba(255,255,255,0.5)' }]}>
            {currentSlide === 0 ? 'Passer l\'intro' : 'Passer'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  slideBody: {
    flex: 1,
    paddingHorizontal: Spacing[6],
    position: 'relative',
    overflow: 'hidden',
  },

  dotsPattern: { position: 'absolute', inset: 0, opacity: 0.06 },

  // Slide 1
  slide1Wrap: { flex: 1, position: 'relative', overflow: 'hidden' },
  bigCakeWrap: { width: '100%', position: 'relative' },
  slide1Text: { paddingHorizontal: Spacing[6], paddingTop: 4, alignItems: 'center' },

  // Slide 4 CTA
  ctaFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
  },
  ctaFeatureText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    flex: 1,
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

  iconBox: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  exCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 13,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 24, elevation: 4,
    borderWidth: 0.5, borderColor: Colors.primaryContainer, width: '100%', marginBottom: 8,
  },
  tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: Radii.full },
  tagText: { fontSize: 10, fontFamily: 'BeVietnamPro_700Bold' },
  tagPrimary: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: Radii.full, backgroundColor: Colors.primary },
  lyricBlock: { backgroundColor: Colors.primaryContainer, borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  lyricText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, fontStyle: 'italic', color: Colors.onPrimaryContainer, lineHeight: 19 },
  formatGrid: { flexDirection: 'row', gap: 8, width: '100%' },
  formatCell: { flex: 1, backgroundColor: Colors.white, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.primaryContainer },
  formatLabel: { fontSize: 9, fontFamily: 'BeVietnamPro_700Bold', color: Colors.onSurfaceVariant },
  contactAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  contactName: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, color: Colors.onSurface },
  contactSub: { fontSize: 11, fontFamily: 'BeVietnamPro_600SemiBold', color: Colors.onSurfaceVariant },
  notifPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 12, padding: 10, paddingHorizontal: 14, width: '100%', marginTop: 8 },
  notifText: { flex: 1, fontSize: 11, color: Colors.white, fontFamily: 'BeVietnamPro_600SemiBold' },

  // Auth styles
  authScroll: {
    paddingHorizontal: Spacing[6],
    paddingTop: 16,
    paddingBottom: 24,
  },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    width: '100%', paddingVertical: 13, borderRadius: Radii.full, borderWidth: 1.5,
    borderColor: Colors.primaryContainer, backgroundColor: Colors.white, marginBottom: 10,
  },
  socialBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', marginVertical: 14 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: Colors.primaryContainer },
  dividerText: { fontSize: 12, color: Colors.outlineVariant, fontFamily: 'BeVietnamPro_600SemiBold' },
  emailInput: {
    width: '100%', backgroundColor: Colors.surfaceContainerLow, borderWidth: 0.5,
    borderColor: Colors.primaryContainer, borderRadius: 12, padding: 12, paddingHorizontal: 14,
    fontSize: Typography.base, color: Colors.onSurface, fontFamily: 'BeVietnamPro_400Regular', marginBottom: 10,
  },
  referralHint: {
    width: '100%', fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant, lineHeight: 17, marginTop: -4, marginBottom: 10, paddingHorizontal: 2,
  },
  emailBtn: {
    width: '100%', paddingVertical: 13, borderRadius: Radii.full,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  emailBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.base, color: Colors.white },
  loginLink: { fontSize: 13, color: Colors.onSurfaceVariant, fontFamily: 'BeVietnamPro_400Regular' },

  // Step screens
  stepScroll: {
    paddingHorizontal: Spacing[6],
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  stepHelpRow: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  stepEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  stepTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
  },
  stepSubtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },

  // Civilité
  civiliteLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  civiliteRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  civiliteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  civiliteBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  civiliteBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  civiliteBtnTextActive: { color: Colors.primary },

  // Gender cards (kept for potential future use)
  genderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
  },
  genderCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  genderLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  genderSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  genderCheck: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  // Notifs benefits
  notifBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
  },
  notifBenefitTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface },
  notifBenefitSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },

  // Relation chips
  relationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.white,
  },
  relationChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  relationChipText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // Help button
  helpBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1, borderColor: Colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  helpBtnLight: { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.4)' },
  helpBtnText: { fontSize: 14 },
  helpBtnTextLight: {},

  // Step progress dots
  stepDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: Spacing[6],
  },
  stepDot: { height: 5, width: 6, borderRadius: Radii.full, backgroundColor: Colors.outlineVariant },

  // Slides help btn overlay
  slidesHelpBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 10,
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
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
  dot: { height: 6, borderRadius: Radii.full },
  dotActive: { width: 24 },
  dotInactive: { width: 6, backgroundColor: Colors.outlineVariant },
  btn: { width: '100%', paddingVertical: 14, borderRadius: Radii.full, alignItems: 'center' },
  btnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg },
  skipBtn: { alignItems: 'center', paddingVertical: 4 },
  skipText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.outlineVariant },
});
