import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Radii } from '../../constants/theme';
import type { CardTemplate } from '../../services/cards.service';

interface Props {
  template: CardTemplate;
  isPremium: boolean;
  onPress: () => void;
  onPressLocked: () => void;
}

export function CardThumbnail({ template, isPremium, onPress, onPressLocked }: Props) {
  const locked = template.tier === 'pro' && !isPremium;

  return (
    <TouchableOpacity
      style={styles.wrap}
      onPress={locked ? onPressLocked : onPress}
      activeOpacity={0.85}
    >
      {/* Image de prévisualisation */}
      <Image
        source={{ uri: template.background.thumbnail_url }}
        style={styles.thumb}
        resizeMode="cover"
      />

      {/* Overlay sombre en bas pour le titre */}
      <View style={styles.overlay} />

      {/* Titre */}
      <Text style={styles.title} numberOfLines={2}>
        {template.title}
      </Text>

      {/* Icône effet */}
      <View style={styles.effectBadge}>
        <Text style={styles.effectIcon}>{EFFECT_ICONS[template.effect.effect_type] ?? '✨'}</Text>
      </View>

      {/* Badge Pro verrouillé */}
      {locked && (
        <View style={styles.lockOverlay}>
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>⭐</Text>
            <Text style={styles.lockText}>Pro</Text>
          </View>
        </View>
      )}

      {/* Indicateur occasion */}
      <View style={[styles.occasionDot, { backgroundColor: OCCASION_COLORS[template.occasion] ?? Colors.primary }]} />
    </TouchableOpacity>
  );
}

const EFFECT_ICONS: Record<string, string> = {
  confetti: '🎊',
  balloons: '🎈',
  snow:     '❄️',
  fireworks:'🎆',
  sparkle:  '✨',
  hearts:   '💕',
  bubbles:  '🫧',
  none:     '▶️',
};

const OCCASION_COLORS: Record<string, string> = {
  birthday:   '#FF6B9D',
  wedding:    '#FF8C42',
  newyear:    '#fdd34d',
  birth:      '#a8e6cf',
  graduation: '#9b59b6',
  thanks:     '#3498db',
  universal:  Colors.primary,
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainer,
    aspectRatio: 9 / 16,  // format portrait carte
    margin: 4,
  },
  thumb: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    background: undefined,
    backgroundColor: 'transparent',
    // dégradé simulé par opacité en bas
    bottom: 0,
    top: '50%' as unknown as number,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: Radii.lg,
    borderBottomRightRadius: Radii.lg,
  },
  title: {
    position: 'absolute',
    bottom: 10,
    left: 8,
    right: 8,
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#fff',
    lineHeight: 16,
  },
  effectBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: Radii.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  effectIcon: { fontSize: 14 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockIcon: { fontSize: 13 },
  lockText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#fff',
  },
  occasionDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
