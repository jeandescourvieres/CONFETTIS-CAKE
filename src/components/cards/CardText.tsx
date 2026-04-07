import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import type { CardTextConfig } from '../../services/cards.service';
import type { CardMode } from '../../services/cards.service';

interface Props {
  config: CardTextConfig;
  recipientName: string;
  recipientAge?: number;
  mode?: CardMode;
}

// ── Animation helper ─────────────────────────────────────────

function useEntrance(animation: CardTextConfig['animation'], delay: number) {
  const opacity    = useRef(new Animated.Value(animation === 'none' ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(animation === 'slide_up' ? 28 : 0)).current;
  const scale      = useRef(new Animated.Value(animation === 'bounce'   ? 0.5 : 1)).current;

  useEffect(() => {
    if (animation === 'none') return;

    const anims: Animated.CompositeAnimation[] = [
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
    ];

    if (animation === 'slide_up') {
      anims.push(Animated.timing(translateY, {
        toValue: 0, duration: 500, delay, useNativeDriver: true,
      }));
    }
    if (animation === 'bounce') {
      anims.push(Animated.spring(scale, {
        toValue: 1, delay, useNativeDriver: true, tension: 80, friction: 5,
      }));
    }

    Animated.parallel(anims).start();
  }, [animation, delay]);

  return { opacity, translateY, scale };
}

// ── Mode AGE ─────────────────────────────────────────────────
// Affiche le chiffre de l'âge en très grand + suffix "ans"

function AgeDisplay({ config, recipientAge }: { config: CardTextConfig; recipientAge?: number }) {
  const delay = config.animation_delay_ms ?? 300;
  const { opacity, translateY, scale } = useEntrance(config.animation, delay);

  const textShadow = config.shadow
    ? { textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8 }
    : {};

  const posStyle = config.position === 'top'
    ? styles.posTop : config.position === 'bottom'
    ? styles.posBottom : styles.posCenter;

  const ageLabel = recipientAge != null ? String(recipientAge) : '?';

  return (
    <View style={[StyleSheet.absoluteFill, styles.container, posStyle]} pointerEvents="none">
      <Animated.View style={{
        opacity,
        transform: [{ translateY }, { scale }],
        alignItems: 'center',
        paddingHorizontal: 16,
      }}>
        <Text
          style={[styles.ageNumber, { fontSize: config.name_size, color: config.color }, textShadow]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {ageLabel}
        </Text>
        {!!config.suffix && (
          <Text style={[styles.ageSuffix, { fontSize: config.prefix_size, color: config.color }, textShadow]}>
            {config.suffix}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

// ── Mode AGE + NAME ───────────────────────────────────────────
// Affiche le chiffre (grand) + le prénom (en dessous)

function AgeNameDisplay({
  config, recipientAge, recipientName,
}: {
  config: CardTextConfig;
  recipientAge?: number;
  recipientName: string;
}) {
  const delay = config.animation_delay_ms ?? 300;
  const { opacity: opAge,  scale: scAge  } = useEntrance('bounce',    delay);
  const { opacity: opName, translateY }    = useEntrance('slide_up',  delay + 200);

  const textShadow = config.shadow
    ? { textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8 }
    : {};

  const posStyle = config.position === 'top'
    ? styles.posTop : config.position === 'bottom'
    ? styles.posBottom : styles.posCenter;

  const ageLabel = recipientAge != null ? String(recipientAge) : '?';
  const name = recipientName.trim() || '…';

  return (
    <View style={[StyleSheet.absoluteFill, styles.container, posStyle]} pointerEvents="none">
      {/* Chiffre de l'âge */}
      <Animated.Text
        style={[
          styles.ageNumber,
          { fontSize: config.name_size, color: config.color, opacity: opAge },
          { transform: [{ scale: scAge }] },
          textShadow,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {ageLabel}{config.suffix}
      </Animated.Text>

      {/* Prénom */}
      <Animated.Text
        style={[
          styles.ageName,
          { fontSize: config.prefix_size, color: config.color, opacity: opName },
          { transform: [{ translateY }] },
          textShadow,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {name}
      </Animated.Text>
    </View>
  );
}

// ── Mode NAME (comportement original) ────────────────────────

function NameDisplay({ config, recipientName }: { config: CardTextConfig; recipientName: string }) {
  const delay = config.animation_delay_ms ?? 600;
  const { opacity, translateY, scale } = useEntrance(config.animation, delay);

  const posStyle = config.position === 'top'
    ? styles.posTop : config.position === 'bottom'
    ? styles.posBottom : styles.posCenter;

  const textShadow = config.shadow
    ? { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 }
    : {};

  const name = recipientName.trim() || '…';

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container, posStyle,
        config.align === 'left' && styles.alignLeft]}
      pointerEvents="none"
    >
      <Animated.View style={{
        opacity,
        transform: [{ translateY }, { scale }],
        alignItems: config.align === 'left' ? 'flex-start' : 'center',
        paddingHorizontal: 24,
      }}>
        {!!config.prefix && (
          <Text style={[styles.prefix, { fontSize: config.prefix_size, color: config.color }, textShadow]}>
            {config.prefix}
          </Text>
        )}
        <Text
          style={[styles.name, { fontSize: config.name_size, color: config.color }, textShadow]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {name}
        </Text>
        {!!config.suffix && (
          <Text style={[styles.suffix, { fontSize: config.prefix_size, color: config.color }, textShadow]}>
            {config.suffix}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

// ── Composant principal ───────────────────────────────────────

export function CardText({ config, recipientName, recipientAge, mode = 'name' }: Props) {
  if (mode === 'age') {
    return <AgeDisplay config={config} recipientAge={recipientAge} />;
  }
  if (mode === 'age_name') {
    return <AgeNameDisplay config={config} recipientAge={recipientAge} recipientName={recipientName} />;
  }
  return <NameDisplay config={config} recipientName={recipientName} />;
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container:  { justifyContent: 'center', alignItems: 'center' },
  posTop:     { justifyContent: 'flex-start', paddingTop: 72 },
  posCenter:  { justifyContent: 'center' },
  posBottom:  { justifyContent: 'flex-end', paddingBottom: 72 },
  alignLeft:  { alignItems: 'flex-start', paddingLeft: 24 },

  // Mode age / age_name
  ageNumber: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    textAlign: 'center',
    letterSpacing: -4,
    lineHeight: undefined,
  },
  ageSuffix: {
    fontFamily: 'BeVietnamPro_700Bold',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 1,
  },
  ageName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginTop: 8,
  },

  // Mode name (original)
  prefix: {
    fontFamily: 'BeVietnamPro_400Regular',
    textAlign: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  suffix: {
    fontFamily: 'BeVietnamPro_400Regular',
    textAlign: 'center',
    marginTop: 4,
  },
});
