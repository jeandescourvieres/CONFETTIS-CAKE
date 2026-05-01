import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  fetchPhoneContacts,
  fetchContacts,
  type PhoneContactCandidate,
} from '../../../src/services/contacts.service';
import { useAuthStore } from '../../../src/stores/authStore';
import { supabase } from '../../../src/services/supabase';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';

export default function ImportContactsScreen() {
  const router = useRouter();
  const C = useColors();
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const [candidates, setCandidates] = useState<PhoneContactCandidate[]>([]);
  const [existingNames, setExistingNames] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    Promise.all([fetchPhoneContacts(), fetchContacts(userId)])
      .then(([phoneList, dbContacts]) => {
        // Noms déjà en base (normalisés)
        const names = new Set(dbContacts.map((c) => c.name.toLowerCase().trim()));
        setExistingNames(names);
        setCandidates(phoneList);
        setSelected(new Set());
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger les contacts.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const toggleOne = useCallback((phoneId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(phoneId)) next.delete(phoneId);
      else next.add(phoneId);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === candidates.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(candidates.map((c) => c.phoneId)));
    }
  }, [selected.size, candidates]);

  const doImport = useCallback(async (toImport: PhoneContactCandidate[]) => {
    if (!userId) return;
    try {
      setImporting(true);
      const rows = toImport.map((c) => ({
        user_id: userId,
        name: c.name,
        phone: c.phone,
        email: null,
        birthday: null,
        name_day: null,
        avatar_url: null,
        notes: null,
        relation: 'friend' as const,
        imported_from: 'phone',
      }));
      const { error: dbError } = await supabase.from('contacts').insert(rows as any);
      if (dbError) throw dbError;
      await queryClient.invalidateQueries({ queryKey: ['contacts', userId] });
      Alert.alert(
        'Importé !',
        `${toImport.length} contact${toImport.length > 1 ? 's' : ''} ajouté${toImport.length > 1 ? 's' : ''}.`,
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur lors de l\'import.');
    } finally {
      setImporting(false);
    }
  }, [userId, queryClient, router]);

  const handleImport = useCallback(async () => {
    if (!userId || selected.size === 0) return;
    const toImport = candidates.filter((c) => selected.has(c.phoneId));

    // Détecter les doublons (même nom déjà en base)
    const duplicates = toImport.filter((c) => existingNames.has(c.name.toLowerCase().trim()));

    if (duplicates.length > 0) {
      const names = duplicates.map((c) => `• ${c.name}`).join('\n');
      Alert.alert(
        '⚠️ Contacts déjà importés',
        `Ces contacts existent déjà :\n\n${names}\n\nVoulez-vous quand même les importer en double ?`,
        [
          { text: 'Ignorer les doublons', style: 'default', onPress: () => {
            const fresh = toImport.filter((c) => !existingNames.has(c.name.toLowerCase().trim()));
            if (fresh.length === 0) {
              Alert.alert('Rien à importer', 'Tous les contacts sélectionnés existent déjà.');
            } else {
              doImport(fresh);
            }
          }},
          { text: 'Importer quand même', style: 'destructive', onPress: () => doImport(toImport) },
          { text: 'Annuler', style: 'cancel' },
        ],
      );
      return;
    }

    doImport(toImport);
  }, [userId, selected, candidates, existingNames, doImport]);

  const styles = useMemo(() => makeStyles(C), [C]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={C.primary} size="large" />
          <Text style={styles.loadingText}>Chargement des contacts…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Importer des contacts</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const allSelected = selected.size === candidates.length && candidates.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Importer des contacts</Text>
        <TouchableOpacity onPress={toggleAll} style={styles.selectAllBtn}>
          <Text style={styles.selectAllText}>{allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}</Text>
        </TouchableOpacity>
      </View>

      {/* Sous-titre */}
      <View style={styles.subHeader}>
        <Text style={styles.subHint}>Sélectionnez les contacts à importer</Text>
        <Text style={styles.subText}>
          {candidates.length} contact{candidates.length !== 1 ? 's' : ''} trouvé{candidates.length !== 1 ? 's' : ''}
          {selected.size > 0 ? ` · ${selected.size} sélectionné${selected.size !== 1 ? 's' : ''}` : ''}
        </Text>
        <Text style={styles.subNote}>Seuls le prénom, le nom et le téléphone seront importés.</Text>
      </View>

      <FlatList
        data={candidates}
        keyExtractor={(item) => item.phoneId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selected.has(item.phoneId);
          return (
            <TouchableOpacity
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => toggleOne(item.phoneId)}
              activeOpacity={0.7}
            >
              {/* Checkbox */}
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>

              {/* Infos */}
              <View style={styles.rowInfo}>
                <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                {!!item.phone && (
                  <Text style={styles.rowPhone} numberOfLines={1}>{item.phone}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Bouton importer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing[4] }]}>
        <TouchableOpacity
          style={[styles.importBtn, (selected.size === 0 || importing) && { opacity: 0.45 }]}
          onPress={handleImport}
          disabled={selected.size === 0 || importing}
        >
          {importing ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.importBtnText}>
              Importer {selected.size > 0 ? `${selected.size} contact${selected.size > 1 ? 's' : ''}` : ''}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryContainer },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
  },
  selectAllBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: C.primary,
    maxWidth: 150,
  },
  selectAllText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },

  subHeader: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[2],
    gap: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerHighest,
  },
  subHint: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  subText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  subNote: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },

  list: { paddingBottom: 100 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: Spacing[5],
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
    backgroundColor: Colors.white,
  },
  rowSelected: {
    backgroundColor: C.primaryContainer,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  checkmark: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: 'BeVietnamPro_700Bold',
    lineHeight: 17,
  },
  rowInfo: { flex: 1 },
  rowName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  rowPhone: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing[4],
    paddingHorizontal: Spacing[4],
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerHighest,
  },
  importBtn: {
    height: 52,
    borderRadius: Radii.full,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },

  loadingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
  },
  errorText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.error,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  });
}
