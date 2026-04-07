import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  fetchPhoneContacts,
  type PhoneContactCandidate,
} from '../../../src/services/contacts.service';
import { useAuthStore } from '../../../src/stores/authStore';
import { supabase } from '../../../src/services/supabase';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';

export default function ImportContactsScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const [candidates, setCandidates] = useState<PhoneContactCandidate[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPhoneContacts()
      .then((list) => {
        setCandidates(list);
        // Aucun contact sélectionné par défaut
        setSelected(new Set());
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger les contacts.');
      })
      .finally(() => setLoading(false));
  }, []);

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

  const handleImport = useCallback(async () => {
    if (!userId || selected.size === 0) return;
    const toImport = candidates.filter((c) => selected.has(c.phoneId));
    try {
      setImporting(true);
      // Importer uniquement prénom, nom, téléphone
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
      Alert.alert('Importé !', `${toImport.length} contact${toImport.length > 1 ? 's' : ''} ajouté${toImport.length > 1 ? 's' : ''}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Erreur lors de l\'import.');
    } finally {
      setImporting(false);
    }
  }, [userId, selected, candidates, queryClient, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
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
      <View style={styles.footer}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 28, color: Colors.primary, lineHeight: 32 },
  topbarTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  selectAllBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    maxWidth: 150,
  },
  selectAllText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.primary,
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
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
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
    backgroundColor: Colors.primaryContainer,
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
    padding: Spacing[4],
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerHighest,
  },
  importBtn: {
    height: 52,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
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
