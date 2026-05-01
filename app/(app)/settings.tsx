import React, { useMemo, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Share, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../src/stores/authStore';
import { useContacts } from '../../src/hooks/useContacts';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { supabase } from '../../src/services/supabase';

const LAST_BACKUP_KEY = 'cc_last_backup_at';

// ── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.card}>
      <Text style={sectionStyles.title}>{title}</Text>
      {children}
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 12,
    ...Shadows.sm,
  },
  title: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    marginBottom: 4,
  },
});

// ── Row button ────────────────────────────────────────────────────────────────
function RowBtn({
  emoji, label, sub, onPress, color, disabled,
}: {
  emoji: string; label: string; sub?: string;
  onPress: () => void; color?: string; disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={rowStyles.row}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={rowStyles.emoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[rowStyles.label, color ? { color } : null]}>{label}</Text>
        {sub ? <Text style={rowStyles.sub}>{sub}</Text> : null}
      </View>
      <Text style={[rowStyles.arrow, color ? { color } : null]}>›</Text>
    </TouchableOpacity>
  );
}
const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 8,
  },
  emoji: { fontSize: 20, width: 28, textAlign: 'center' },
  label: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  sub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  arrow: { fontSize: 20, color: Colors.onSurfaceVariant },
});

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return <View style={{ height: 0.5, backgroundColor: Colors.surfaceContainerHighest, marginVertical: 2 }} />;
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const { user, profile, signOut } = useAuthStore();
  const { data: contacts = [] } = useContacts();
  const { data: messages = [] } = useMessages();

  // Sauvegarde
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(LAST_BACKUP_KEY).then((v) => setLastBackup(v));
  }, []);

  const handleBackupNow = async () => {
    setBackupLoading(true);
    try {
      const exportData = {
        version: 1,
        exported_at: new Date().toISOString(),
        contacts,
        messages,
        profile,
      };
      await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: 'Sauvegarde Confetticake',
      });
      const now = new Date().toLocaleString('fr-FR');
      await SecureStore.setItemAsync(LAST_BACKUP_KEY, now);
      setLastBackup(now);
    } catch {
      // User cancelled share
    } finally {
      setBackupLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const exportData = {
        version: 1,
        exported_at: new Date().toISOString(),
        contacts,
        messages,
        profile,
      };
      await Share.share({
        message: JSON.stringify(exportData, null, 2),
        title: 'Export Confetticake',
      });
    } catch { /* cancelled */ }
  };

  const handleImport = () => {
    Alert.alert(
      '📤 Importer des données',
      "L'importation depuis un fichier sera disponible dans la prochaine mise à jour de l'appli 💛",
      [{ text: 'OK' }],
    );
  };

  // ── Suppression du compte ────────────────────────────────────────────────────
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0); // 0=hidden 1=warning 2=confirm
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const emailMatches = deleteEmail.trim().toLowerCase() === (user?.email ?? '').toLowerCase();

  const handleDeleteConfirm = async () => {
    if (!emailMatches) return;
    setDeleteLoading(true);
    try {
      // Delete all user data via Supabase (cascade RLS)
      await supabase.rpc('delete_user_account' as any);
      await signOut();
      router.replace('/(auth)/onboarding' as never);
    } catch {
      Alert.alert('Erreur', 'Impossible de supprimer le compte. Contactez le support.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Notifications (stubs) ────────────────────────────────────────────────────
  const handleNotifications = () => router.push('/(app)/notifications/index' as never);

  const authMethod = user?.app_metadata?.provider === 'google'
    ? 'Google'
    : user?.app_metadata?.provider === 'apple'
    ? 'Apple'
    : 'Email';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚙️ Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Sauvegarde ───────────────────────────────────── */}
        <SectionCard title="💾 Sauvegarde">
          <View style={styles.backupInfo}>
            <Text style={styles.backupInfoLabel}>Sauvegarde automatique</Text>
            <Text style={styles.backupInfoValue}>
              {authMethod === 'Google' ? '☁️ Google Drive'
               : authMethod === 'Apple' ? '☁️ iCloud'
               : '☁️ Serveurs Confetticake'}
            </Text>
          </View>
          {lastBackup && (
            <Text style={styles.lastBackupText}>Dernière sauvegarde : {lastBackup}</Text>
          )}
          <TouchableOpacity
            style={[styles.backupBtn, { backgroundColor: C.primary }, backupLoading && { opacity: 0.6 }]}
            onPress={handleBackupNow}
            disabled={backupLoading}
            activeOpacity={0.85}
          >
            {backupLoading
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <Text style={styles.backupBtnText}>💾 Sauvegarder maintenant</Text>}
          </TouchableOpacity>
          <Divider />
          <RowBtn emoji="📥" label="Exporter mes données" sub="Génère un fichier JSON / CSV" onPress={handleExport} />
          <Divider />
          <RowBtn emoji="📤" label="Importer mes données" sub="Restaurer depuis un fichier" onPress={handleImport} />
        </SectionCard>

        {/* ── Notifications ────────────────────────────────── */}
        <SectionCard title="🔔 Notifications">
          <RowBtn
            emoji="🔔"
            label="Activer les notifications"
            sub="Rappels anniversaires & fêtes"
            onPress={handleNotifications}
          />
          <Divider />
          <RowBtn
            emoji="📅"
            label="Fréquence des rappels"
            sub="Quotidien, hebdo, mensuel…"
            onPress={handleNotifications}
          />
          <Divider />
          <RowBtn
            emoji="📱"
            label="Vérifier les autorisations"
            sub="Ouvre les réglages du téléphone"
            onPress={handleNotifications}
          />
        </SectionCard>

        {/* ── Mon compte ───────────────────────────────────── */}
        <SectionCard title="👤 Mon compte">
          <View style={styles.accountInfo}>
            <Text style={styles.accountEmail}>{user?.email ?? '—'}</Text>
            <Text style={styles.accountProvider}>Connecté via {authMethod}</Text>
          </View>
          <RowBtn
            emoji="👤"
            label="Voir mon profil"
            onPress={() => router.push('/(app)/profile' as never)}
          />
          <Divider />
          <RowBtn
            emoji="🚪"
            label="Se déconnecter"
            onPress={() => {
              Alert.alert('Se déconnecter', 'Tu vas être déconnecté·e de Confetticake.', [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Se déconnecter', style: 'destructive', onPress: signOut },
              ]);
            }}
          />
          <Divider />
          <TouchableOpacity
            style={styles.deleteAccountRow}
            onPress={() => setDeleteStep(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteAccountEmoji}>🗑️</Text>
            <Text style={styles.deleteAccountText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* ── Parrainage ───────────────────────────────────── */}
        <SectionCard title="🌟 Parrainage">
          <RowBtn
            emoji="🎁"
            label="Parrainer des amis"
            sub="Gagne des crédits en invitant"
            onPress={() => router.push('/(app)/referral/index' as never)}
          />
        </SectionCard>

        {/* ── Premium ──────────────────────────────────────── */}
        <SectionCard title="⭐ Abonnement">
          <RowBtn
            emoji="⭐"
            label="Passer à Premium"
            sub="Débloque toutes les fonctionnalités"
            onPress={() => router.push('/(app)/profile/premium' as never)}
            color={C.primary}
          />
        </SectionCard>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal suppression — Étape 1 : Avertissement ───── */}
      <Modal visible={deleteStep === 1} transparent animationType="slide" onRequestClose={() => setDeleteStep(0)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>⚠️ Attention — Cette action est irréversible</Text>
            <Text style={styles.modalBody}>
              {'La suppression de ton compte entraîne la perte définitive de :\n\n— Tous tes contacts et leurs fiches complètes\n— Tout l\'historique de tes messages envoyés\n— Toutes tes préférences et paramètres\n— Toutes tes listes de souhaits\n— Tous tes animaux de compagnie\n\nCette action ne peut pas être annulée.'}
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setDeleteStep(0)}>
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnDanger]} onPress={() => setDeleteStep(2)}>
                <Text style={styles.modalBtnDangerText}>Je veux supprimer mon compte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal suppression — Étape 2 : Confirmation email ── */}
      <Modal visible={deleteStep === 2} transparent animationType="slide" onRequestClose={() => setDeleteStep(0)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmation de suppression</Text>
            <Text style={styles.modalBody}>
              {'Pour confirmer la suppression de ton compte, saisis ton adresse email ci-dessous :'}
            </Text>
            <TextInput
              style={styles.emailInput}
              value={deleteEmail}
              onChangeText={setDeleteEmail}
              placeholder="ton@email.com"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => { setDeleteStep(0); setDeleteEmail(''); }}
              >
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnDanger, !emailMatches && { opacity: 0.4 }]}
                onPress={handleDeleteConfirm}
                disabled={!emailMatches || deleteLoading}
              >
                {deleteLoading
                  ? <ActivityIndicator size="small" color={Colors.white} />
                  : <Text style={styles.modalBtnDangerText}>🗑️ Confirmer la suppression</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], gap: 8,
    },
    backBtn: { padding: 4 },
    backBtnText: { fontSize: 28, color: C.primary, fontFamily: 'BeVietnamPro_700Bold', lineHeight: 32 },
    headerTitle: {
      flex: 1, fontFamily: 'BeVietnamPro_700Bold',
      fontSize: Typography.xl, color: Colors.onSurface, textAlign: 'center',
    },
    content: { paddingHorizontal: Spacing[4], gap: 16, paddingTop: Spacing[3] },

    backupInfo: { gap: 2 },
    backupInfoLabel: { fontFamily: 'BeVietnamPro_500Medium', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
    backupInfoValue: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
    lastBackupText: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
      color: Colors.onSurfaceVariant,
    },
    backupBtn: {
      borderRadius: Radii.full, paddingVertical: 13, alignItems: 'center', ...Shadows.sm,
    },
    backupBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

    accountInfo: { gap: 2, marginBottom: 4 },
    accountEmail: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
    accountProvider: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant },

    deleteAccountRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8,
    },
    deleteAccountEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
    deleteAccountText: {
      fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: '#e53935',
    },

    // Modals
    modalOverlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalCard: {
      backgroundColor: Colors.white, borderTopLeftRadius: Radii.xl, borderTopRightRadius: Radii.xl,
      padding: Spacing[6], gap: 16,
    },
    modalTitle: {
      fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg,
      color: Colors.onSurface, textAlign: 'center',
    },
    modalBody: {
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
      color: Colors.onSurfaceVariant, lineHeight: 22,
    },
    modalBtns: { gap: 10, marginTop: 4 },
    modalBtn: {
      borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center',
    },
    modalBtnCancel: { backgroundColor: Colors.surfaceContainerLow },
    modalBtnCancelText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurface },
    modalBtnDanger: { backgroundColor: '#e53935' },
    modalBtnDangerText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
    emailInput: {
      borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest, borderRadius: Radii.lg,
      paddingHorizontal: Spacing[4], paddingVertical: 12,
      fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurface,
    },
  });
}
