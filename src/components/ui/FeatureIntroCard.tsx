// ═══════════════════════════════════════════════════════════════
//  FeatureIntroCard — intro + mode d'emploi repliable
//  • Intro : toujours visible
//  • Mode d'emploi : masqué par défaut, toggle via bouton "Mode d'emploi 📖"
//  • Bouton devient "Fermer ▲" quand déplié
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Radii } from '../../constants/theme';
import { useColors } from '../../hooks/useColors';

interface Props {
  /** Texte d'introduction — toujours visible */
  introText: string;
  /** Lignes du mode d'emploi — masquées par défaut */
  modeEmploiLines: string[];
  /** Couleur d'accent (bordure + bouton + lignes). Défaut : C.primary */
  accentColor?: string;
  /** Couleur de fond. Défaut : C.primaryContainer */
  backgroundColor?: string;
  /** Épaisseur de la bordure gauche. Défaut : 3 */
  borderWidth?: number;
  /** Style conteneur optionnel (marges…) */
  containerStyle?: object;
}

export function FeatureIntroCard({
  introText,
  modeEmploiLines,
  accentColor,
  backgroundColor,
  borderWidth = 3,
  containerStyle,
}: Props) {
  const C = useColors();
  const color  = accentColor ?? C.primary;
  const bgColor = backgroundColor ?? C.primaryContainer;
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: color, borderLeftWidth: borderWidth, backgroundColor: bgColor },
        containerStyle,
      ]}
    >
      {/* Intro — toujours visible */}
      <Text style={styles.introText}>{introText}</Text>

      {/* Bouton toggle */}
      <TouchableOpacity
        style={[styles.toggleBtn, { borderColor: color + '55' }]}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.75}
      >
        <Text style={[styles.toggleBtnText, { color }]}>
          {expanded ? 'Fermer ▲' : "Mode d'emploi 📖"}
        </Text>
      </TouchableOpacity>

      {/* Mode d'emploi repliable */}
      {expanded && (
        <View style={styles.modeEmploiWrap}>
          {modeEmploiLines.map((line, i) => (
            <Text key={i} style={[styles.modeEmploiLine, { color: color + 'DD' }]}>
              {line}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.md,
    padding: 12,
    gap: 8,
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    lineHeight: 20,
  },
  toggleBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  toggleBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
  },
  modeEmploiWrap: {
    gap: 4,
    marginTop: 2,
  },
  modeEmploiLine: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
});
