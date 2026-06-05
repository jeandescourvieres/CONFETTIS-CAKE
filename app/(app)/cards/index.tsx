import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../src/services/supabase';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { BackHeader } from '../../../src/components/ui/BackHeader';

const OCCASIONS = [
  { key: 'birthday',      emoji: '🎂', label: 'Anniversaire',     color: '#E91E63', bg: '#FCE4EC' },
  { key: 'nameday',       emoji: '🌸', label: 'Bonne fête',        color: '#9C27B0', bg: '#F3E5F5' },
  { key: 'valentines',    emoji: '💕', label: 'Saint-Valentin',    color: '#E91E63', bg: '#FCE4EC' },
  { key: 'wedding',       emoji: '💍', label: 'Mariage',           color: '#9C27B0', bg: '#EDE7F6' },
  { key: 'birth',         emoji: '👶', label: 'Naissance',         color: '#2196F3', bg: '#E3F2FD' },
  { key: 'graduation',    emoji: '🎓', label: 'Diplôme',           color: '#FF9800', bg: '#FFF3E0' },
  { key: 'mothersday',    emoji: '💐', label: 'Fête des mères',    color: '#E91E63', bg: '#FCE4EC' },
  { key: 'fathersday',    emoji: '👔', label: 'Fête des pères',    color: '#1565C0', bg: '#E3F2FD' },
  { key: 'christmas',     emoji: '🎄', label: 'Noël',              color: '#388E3C', bg: '#E8F5E9' },
  { key: 'newyear',       emoji: '🎆', label: 'Nouvel An',         color: '#F57F17', bg: '#FFFDE7' },
  { key: 'support',       emoji: '🤗', label: 'Soutien',           color: '#0288D1', bg: '#E1F5FE' },
  { key: 'thanks',        emoji: '🙏', label: 'Merci',             color: '#558B2F', bg: '#F1F8E9' },
  { key: 'birthday_late', emoji: '🎂', label: 'Anniversaire tardif', color: '#795548', bg: '#EFEBE9' },
  { key: 'courage',       emoji: '🎉', label: 'Félicitations',     color: '#E65100', bg: '#FBE9E7' },
  { key: 'weekend',       emoji: '🌞', label: 'Bon weekend',       color: '#F9A825', bg: '#FFFDE7' },
  { key: 'universal',     emoji: '🌟', label: 'Universel',         color: '#6A1B9A', bg: '#F3E5F5' },
];

export default function CardsOccasionScreen() {
  const C = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ occasion?: string; contactName?: string; contactId?: string }>();
  const [loading, setLoading] = useState<string | null>(null);
  const styles = useMemo(() => makeStyles(C), [C]);

  const handleOccasion = useCallback(async (occasionKey: string) => {
    setLoading(occasionKey);
    try {
      const { data } = await supabase
        .from('card_templates')
        .select('id')
        .eq('occasion', occasionKey)
        .eq('active', true)
        .order('sort_order')
        .limit(1)
        .single() as { data: { id: string } | null; error: unknown };

      if (data?.id) {
        router.push({
          pathname: '/(app)/cards/[id]',
          params: {
            id: data.id,
            contactName: params.contactName ?? '',
            contactId:   params.contactId   ?? '',
          },
        } as never);
      }
    } catch {
      // Aucun template trouvé — on essaie universal
      const { data: fallback } = await supabase
        .from('card_templates')
        .select('id')
        .eq('active', true)
        .order('sort_order')
        .limit(1)
        .single() as { data: { id: string } | null; error: unknown };
      if (fallback?.id) {
        router.push({ pathname: '/(app)/cards/[id]', params: { id: fallback.id, contactName: params.contactName ?? '', contactId: params.contactId ?? '' } } as never);
      }
    } finally {
      setLoading(null);
    }
  }, [router, params]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Message festif animé 🎴" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.onSurface }}>
            🎉 Surprends tes proches avec un message qui s'anime !
          </Text>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22, fontStyle: 'italic' }}>
            {'Imagine : tu envoies un lien à quelqu\'un. Il clique. Sur son téléphone s\'ouvre une page toute colorée, avec son prénom en grand, une animation festive, une musique, et ton message personnel.\n\nPas besoin que le destinataire ait l\'appli. Un simple lien, et c\'est la fête.\n\nC\'est ça, le Message Festif Animé — bien plus sympa qu\'un SMS ou un mail, et une attention dont on se souvient.'}
          </Text>
        </View>

        {/* Explication hero */}
        <LinearGradient
          colors={['#7C3AED', '#9b6bb5', '#c084fc']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.infoCard}
        >
          <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 20, color: '#fff', marginBottom: 6 }}>
            ✨ Comment ça marche ?
          </Text>
          <View style={{ gap: 10 }}>
            {[
              { n: '1', emoji: '🎯', text: 'Choisis l\'occasion ci-dessous' },
              { n: '2', emoji: '✍️', text: 'Personnalise ton message avec une animation et une musique' },
              { n: '3', emoji: '📲', text: 'Envoie le lien — ton proche voit l\'animation sur son téléphone, sans avoir l\'appli' },
            ].map((step) => (
              <View key={step.n} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 12, color: '#fff' }}>{step.n}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                  <Text style={{ fontSize: 16 }}>{step.emoji}</Text>
                  <Text style={{ flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 19 }}>{step.text}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            {[['🎉','Animation'], ['🎵','Musique'], ['💌','Message'], ['📲','Lien direct']].map(([emoji, label]) => (
              <View key={label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radii.lg, paddingVertical: 8, alignItems: 'center', gap: 3 }}>
                <Text style={{ fontSize: 16 }}>{emoji}</Text>
                <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 9, color: '#fff', textAlign: 'center' }}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Pour quelle occasion ?</Text>

        <View style={styles.grid}>
          {OCCASIONS.map((occ) => (
            <TouchableOpacity
              key={occ.key}
              style={[styles.tile, { backgroundColor: occ.bg, borderColor: occ.color + '40' }]}
              onPress={() => handleOccasion(occ.key)}
              activeOpacity={0.8}
              disabled={!!loading}
            >
              {loading === occ.key ? (
                <ActivityIndicator size="small" color={occ.color} />
              ) : (
                <Text style={styles.tileEmoji}>{occ.emoji}</Text>
              )}
              <Text style={[styles.tileLabel, { color: occ.color }]}>{occ.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content:   { padding: Spacing[4], gap: Spacing[4], paddingBottom: 80 },
    infoCard:  { borderRadius: Radii.xl, padding: Spacing[4], gap: 12, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
    infoTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.base },
    infoText:  { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, lineHeight: 20 },
    sectionTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      marginTop: Spacing[2],
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    tile: {
      width: '30%',
      borderRadius: Radii.lg,
      borderWidth: 1.5,
      paddingVertical: Spacing[3],
      paddingHorizontal: Spacing[2],
      alignItems: 'center',
      gap: 5,
      minHeight: 72,
      justifyContent: 'center',
    },
    tileEmoji: { fontSize: 24 },
    tileLabel: {
      fontFamily: 'BeVietnamPro_600SemiBold',
      fontSize: Typography.xs,
      textAlign: 'center',
      lineHeight: 14,
    },
  });
}
