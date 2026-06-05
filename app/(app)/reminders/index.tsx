import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  useReminders, useToggleReminder, useDeleteReminder, recurrenceLabel,
  type Reminder,
} from '../../../src/hooks/useReminders';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

const RECURRENCE_EMOJI: Record<string, string> = {
  weekly: '📅', monthly: '🗓', yearly: '🎯', once: '📌',
};

export default function RemindersScreen() {
  const router  = useRouter();
  const C       = useColors();
  const styles  = useMemo(() => makeStyles(C), [C]);

  const { data: reminders = [], isLoading, refetch } = useReminders();
  const { mutateAsync: toggle }  = useToggleReminder();
  const { mutateAsync: remove }  = useDeleteReminder();

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  const activeCount = reminders.filter((r) => r.is_active).length;

  const handleEdit = (r: Reminder) => {
    router.push({
      pathname: '/(app)/reminders/new',
      params: {
        editId:         r.id,
        editTitle:      r.title,
        editRecurrence: r.recurrence,
        editDayOfWeek:  r.day_of_week  ?? '',
        editDayOfMonth: r.day_of_month ?? '',
        editMonth:      r.month        ?? '',
        editOnceDate:   r.once_date    ?? '',
        editContactId:  r.contact_id   ?? '',
      },
    } as never);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Supprimer ce rappel ?',
      `"${title}" ne sera plus envoyé.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => remove(id) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⏰</Text>
          <Text style={styles.heroTitle}>Rappels personnalisés</Text>
          <Text style={styles.heroSub}>
            {reminders.length === 0
              ? 'Crée ton premier rappel'
              : `${reminders.length} rappel${reminders.length > 1 ? 's' : ''} · ${activeCount} actif${activeCount > 1 ? 's' : ''}`}
          </Text>
        </View>

        {/* Intro explicative */}
        <FeatureIntroCard
          introText={"Parce que les petites attentions régulières sont souvent celles qui comptent le plus 💛 Les rappels personnalisés te permettent de programmer toi-même les moments où tu veux penser à tes proches — en dehors des anniversaires et fêtes automatiques. Hebdomadaire, mensuel, annuel ou ponctuel : tu choisis quand et à quelle fréquence être alerté, pour ne jamais laisser passer ce qui compte vraiment ⏰✨"}
          modeEmploiLines={[
            "⏰ Appuie sur « + Nouveau rappel » pour créer ton premier rappel en quelques secondes",
            "✏️ Donne-lui un titre parlant — ex : « Appeler papa », « Fleurs pour maman »",
            "📅 Choisis la date de départ et la fréquence : une seule fois, chaque semaine, chaque mois ou chaque année",
            "🔔 Tu reçois une notification le jour J pour ne jamais oublier",
            "✅ Active ou désactive chaque rappel d'un simple tap sur le bouton — sans le supprimer",
            "🗑️ Supprime un rappel définitivement en appuyant sur la corbeille",
            "💡 Exemples : appeler un proche chaque dimanche · envoyer des fleurs en mai · écrire à un ami chaque mois · une date unique à ne pas rater 💛✨",
          ]}
        />

        {/* Bouton créer */}
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: C.primary }]}
          onPress={() => router.push('/(app)/reminders/new' as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>＋ Nouveau rappel</Text>
        </TouchableOpacity>

        {/* Loading */}
        {isLoading && (
          <Text style={styles.empty}>Chargement...</Text>
        )}

        {/* Empty */}
        {!isLoading && reminders.length === 0 && (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyTitle}>Aucun rappel</Text>
            <Text style={styles.emptyDesc}>
              "Appelle papa le dimanche", "Envoie des fleurs en mai"… Crée des rappels personnalisés et reçois une notification au bon moment.
            </Text>
          </View>
        )}

        {/* Liste */}
        {reminders.map((r) => (
          <View key={r.id} style={[styles.card, !r.is_active && styles.cardInactive]}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardEmoji}>
                {RECURRENCE_EMOJI[r.recurrence] ?? '⏰'}
              </Text>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, !r.is_active && styles.cardTitleOff]}>
                  {r.title}
                </Text>
                <Text style={styles.cardSub}>
                  {recurrenceLabel(r)}
                  {r.contact?.name ? ` · ${r.contact.name.split(' ')[0]}` : ''}
                </Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              {r.contact_id && (
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: r.contact_id } } as never)}
                  style={styles.deleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.deleteBtnText}>💬</Text>
                </TouchableOpacity>
              )}
              <Switch
                value={r.is_active}
                onValueChange={(val) => toggle({ id: r.id, is_active: val })}
                trackColor={{ false: Colors.outlineVariant, true: C.primary }}
                thumbColor="#fff"
              />
              <TouchableOpacity
                onPress={() => handleEdit(r)}
                style={styles.deleteBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteBtnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(r.id, r.title)}
                style={styles.deleteBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteBtnText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content:   { paddingHorizontal: Spacing[4], paddingBottom: 24 },

    hero: { alignItems: 'center', paddingVertical: 20, gap: 4 },
    heroEmoji: { fontSize: 36 },
    heroTitle: {
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontSize: Typography['2xl'],
      color: Colors.onSurface,
      textAlign: 'center',
      marginTop: 4,
    },
    heroSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
    },

    introCard: {
      backgroundColor: Colors.white,
      borderRadius: Radii.xl,
      borderLeftWidth: 4,
      borderLeftColor: C.primary,
      padding: Spacing[4],
      marginBottom: Spacing[4],
      gap: 10,
    },
    introTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.onSurface,
    },
    introText: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      lineHeight: 20,
    },
    introExamples: { gap: 6 },
    introRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    introEmoji: { fontSize: 16, width: 22 },
    introExText: {
      fontFamily: 'BeVietnamPro_500Medium',
      fontSize: Typography.sm,
      color: Colors.onSurface,
      flex: 1,
    },
    introFooter: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
      lineHeight: 18,
      fontStyle: 'italic',
      borderTopWidth: 0.5,
      borderTopColor: Colors.surfaceContainerHighest,
      paddingTop: 8,
      marginTop: 2,
    },

    createBtn: {
      borderRadius: Radii.full,
      paddingVertical: 13,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 20,
    },
    createBtnText: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: '#fff',
    },

    empty: {
      textAlign: 'center',
      color: Colors.onSurfaceVariant,
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.md,
      marginTop: 32,
    },
    emptyBlock: { alignItems: 'center', paddingTop: 24, gap: 8 },
    emptyTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.lg,
      color: Colors.onSurface,
      textAlign: 'center',
    },
    emptyDesc: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
    },

    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.surfaceContainer,
      borderRadius: Radii.lg,
      padding: Spacing[3],
      marginBottom: 10,
    },
    cardInactive: { opacity: 0.5 },
    cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
    cardEmoji: { fontSize: 26 },
    cardInfo: { flex: 1 },
    cardTitle: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: Typography.md,
      color: Colors.onSurface,
    },
    cardTitleOff: { color: Colors.onSurfaceVariant },
    cardSub: {
      fontFamily: 'BeVietnamPro_400Regular',
      fontSize: Typography.sm,
      color: Colors.onSurfaceVariant,
      marginTop: 2,
    },
    cardRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    deleteBtn: { padding: 4 },
    deleteBtnText: { fontSize: 16 },
  });
}
