import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCreateStore } from '../../../src/stores/createStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

export default function SentScreen() {
  const router = useRouter();
  const C = useColors();
  const { contactName, format, reset } = useCreateStore();

  // Scale-in animation for the checkmark
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNewMessage = () => {
    reset();
    router.replace('/(app)/create/' as never);
  };

  const handleGoHome = () => {
    reset();
    router.replace('/(app)/' as never);
  };

  const formatLabel: Record<string, string> = {
    song: 'chanson',
    poem: 'poème',
    message: 'message',
    joke: 'texte',
  };

  // contactName stocké "NOM Prénom" → afficher "Prénom NOM"
  const nameParts = contactName.trim().split(' ');
  const displayName = nameParts.length > 1
    ? `${nameParts.slice(1).join(' ')} ${nameParts[0]}`
    : nameParts[0];
  const subtitle = displayName
    ? `Ton ${formatLabel[format] ?? 'message'} pour ${displayName} a été envoyé ! 🎉`
    : `Ton ${formatLabel[format] ?? 'message'} a été envoyé ! 🎉`;

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#faf4fc', '#f0e4fa']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity }]}>
          {/* Checkmark circle */}
          <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
            <LinearGradient
              colors={['#9b6bb5', '#5e2d80']}
              style={styles.checkGradient}
            >
              <Text style={styles.checkEmoji}>✓</Text>
            </LinearGradient>
          </Animated.View>

          {/* Confetti */}
          <View style={styles.confettiRow}>
            {['🎉', '🎊', '✨', '💜', '🎈'].map((c, i) => (
              <Text key={i} style={styles.confettiItem}>{c}</Text>
            ))}
          </View>

          {/* Message */}
          <Text style={styles.title}>Envoyé !</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Stats card */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Message créé</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {format === 'song' ? '🎵' : format === 'poem' ? '✍️' : format === 'joke' ? '✨' : '💬'}
              </Text>
              <Text style={styles.statLabel}>
                {format === 'song' ? 'Chanson' : format === 'poem' ? 'Poème' : format === 'joke' ? 'Humour' : 'Message'}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>IA</Text>
              <Text style={styles.statLabel}>Généré par</Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleNewMessage} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>✨ Créer un autre message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleGoHome} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
    gap: 16,
  },

  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    ...Shadows.lg,
  },
  checkGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkEmoji: {
    fontSize: 48,
    color: Colors.white,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },

  confettiRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  confettiItem: { fontSize: 24 },

  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['6xl'],
    color: C.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.lg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    gap: 0,
    marginVertical: 8,
    ...Shadows.sm,
    alignSelf: 'stretch',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.surfaceContainer },
  statValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography['3xl'],
    color: C.primary,
  },
  statLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  primaryBtn: {
    alignSelf: 'stretch',
    paddingVertical: 17,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
    alignItems: 'center',
    ...Shadows.md,
  },
  primaryBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.white,
  },

  secondaryBtn: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: C.primary,
  },
  });
}
