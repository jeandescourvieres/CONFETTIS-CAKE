// ═══════════════════════════════════════════════════════════
//  Confettis & Cake — Livres d'or (liste + création)
// ═══════════════════════════════════════════════════════════

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Share,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radii } from '../../../src/constants/theme';
import { useContact } from '../../../src/hooks/useContacts';
import { useColors } from '../../../src/hooks/useColors';
import { useGuestbooks, useCreateGuestbook, useDeleteGuestbook, useToggleGuestbook, useGuestbookEntries } from '../../../src/hooks/useGuestbook';
import type { Guestbook } from '../../../src/hooks/useGuestbook';
import { FeatureIntroCard } from '../../../src/components/ui/FeatureIntroCard';

function shareLink(token: string): string {
  // Deeplink vers la page publique de contribution
  return `confettiscake://guestbook/${token}`;
}

export default function GuestbookListScreen() {
  const router = useRouter();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { contactId } = useLocalSearchParams<{ contactId?: string }>();
  const { data: contactData } = useContact(contactId ?? '');

  const { data: books = [], isLoading } = useGuestbooks();
  const { mutateAsync: createBook, isPending: isCreating } = useCreateGuestbook();
  const { mutateAsync: deleteBook } = useDeleteGuestbook();
  const { mutateAsync: toggleBook } = useToggleGuestbook();

  const [createVisible, setCreateVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  // Pré-remplissage depuis la fiche contact
  useEffect(() => {
    if (contactData) {
      const firstName = contactData.name.split(' ').slice(1).join(' ') || contactData.name.split(' ')[0];
      setNewTitle(`Livre d'or — ${firstName}`);
      setCreateVisible(true);
    }
  }, [contactData?.id]);

  const [selectedBook, setSelectedBook] = useState<Guestbook | null>(null);
  const [bookDetailVisible, setBookDetailVisible] = useState(false);

  const { data: entries = [], isLoading: isLoadingEntries } = useGuestbookEntries(selectedBook?.id ?? '');

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await createBook({
        title: newTitle.trim(),
        event_date: newDate.trim() || null,
        contact_id: contactId ?? null,
      });
      setCreateVisible(false);
      setNewTitle('');
      setNewDate('');
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le livre d\'or pour le moment.');
    }
  };

  const handleDelete = (book: Guestbook) => {
    Alert.alert(
      'Supprimer le livre d\'or ?',
      `"${book.title}" et toutes ses contributions seront supprimés définitivement.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteBook(book.id);
            if (selectedBook?.id === book.id) {
              setBookDetailVisible(false);
              setSelectedBook(null);
            }
          },
        },
      ]
    );
  };

  const handleShare = async (book: Guestbook) => {
    const link = shareLink(book.token);
    await Share.share({
      message: `💛 Tu es invité·e à contribuer au livre d'or "${book.title}" — laisse un mot ici :\n${link}`,
    });
  };

  const openBook = (book: Guestbook) => {
    setSelectedBook(book);
    setBookDetailVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>📒 Livre d'or</Text>
        <TouchableOpacity onPress={() => setHelpVisible(true)} style={styles.helpBtn}>
          <Text style={styles.helpBtnText}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <FeatureIntroCard
          introText={"Parce qu'un message venant de tous ceux qu'on aime vaut mille cadeaux 💛 Réunis les mots de tes proches en un seul endroit et créez ensemble un souvenir inoubliable ✨"}
          modeEmploiLines={[
            '🌟 Crée un livre d\'or depuis ce bouton',
            '✨ Partage le lien par SMS ou WhatsApp — pas besoin d\'installer l\'appli',
            '💫 Chacun contribue à son rythme — un mot, un souvenir',
            '👁️ Suis les contributions en temps réel',
            '🎉 Le jour J, envoie le livre d\'or final 💛✨',
          ]}
        />

        {/* Bouton créer */}
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: C.primary }]}
          onPress={() => setCreateVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>+ Créer un livre d'or</Text>
        </TouchableOpacity>

        {/* Loading */}
        {isLoading && (
          <View style={styles.center}>
            <ActivityIndicator color={C.primary} />
          </View>
        )}

        {/* Liste */}
        {!isLoading && books.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📒</Text>
            <Text style={styles.emptyTitle}>Aucun livre d'or</Text>
            <Text style={styles.emptySub}>Crée ton premier livre d'or et invite tes proches à laisser un mot 💛</Text>
          </View>
        )}

        {books.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={[styles.bookCard, !book.is_open && styles.bookCardClosed]}
            onPress={() => openBook(book)}
            activeOpacity={0.8}
          >
            <View style={styles.bookCardLeft}>
              <Text style={styles.bookEmoji}>📒</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                {book.event_date && (
                  <Text style={styles.bookDate}>
                    📅 {new Date(book.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                )}
                <View style={[styles.bookStatusPill, book.is_open ? styles.bookStatusOpen : styles.bookStatusClosed]}>
                  <Text style={[styles.bookStatusText, book.is_open ? { color: '#2E7D32' } : { color: Colors.onSurfaceVariant }]}>
                    {book.is_open ? '✅ Ouvert aux contributions' : '🔒 Fermé'}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[styles.bookArrow, { color: C.primary }]}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal création ─────────────────────────────── */}
      <Modal visible={createVisible} transparent animationType="slide" onRequestClose={() => setCreateVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau livre d'or</Text>
              <TouchableOpacity onPress={() => setCreateVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
              <Text style={styles.fieldLabel}>Pour qui ? (titre)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : Anniversaire de Marie, Retraite de Papa..."
                placeholderTextColor="#aaa"
                value={newTitle}
                onChangeText={setNewTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
              <Text style={styles.fieldLabel}>Date de l'événement (optionnel)</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor="#aaa"
                value={newDate}
                onChangeText={setNewDate}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
              />
              <Text style={styles.fieldHint}>
                💡 Un lien unique est généré automatiquement. Tu pourras l'envoyer à tes proches par SMS ou WhatsApp — ils n'ont pas besoin d'installer l'appli.
              </Text>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: C.primary }, (!newTitle.trim() || isCreating) && { opacity: 0.4 }]}
                onPress={handleCreate}
                disabled={!newTitle.trim() || isCreating}
                activeOpacity={0.85}
              >
                {isCreating
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.saveBtnText}>Créer le livre d'or</Text>}
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Modal détail livre d'or ─────────────────── */}
      {selectedBook && (
        <Modal visible={bookDetailVisible} transparent animationType="slide" onRequestClose={() => setBookDetailVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { flex: 1 }]} numberOfLines={1}>{selectedBook.title}</Text>
                <TouchableOpacity onPress={() => setBookDetailVisible(false)} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Actions */}
              <View style={styles.bookActions}>
                <TouchableOpacity
                  style={[styles.bookActionBtn, { backgroundColor: '#25D366' }]}
                  onPress={() => handleShare(selectedBook)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bookActionBtnText}>💬 Partager le lien</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bookActionBtn, { backgroundColor: selectedBook.is_open ? Colors.onSurfaceVariant : C.primary }]}
                  onPress={() => toggleBook({ id: selectedBook.id, is_open: !selectedBook.is_open })}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bookActionBtnText}>{selectedBook.is_open ? '🔒 Fermer' : '✅ Rouvrir'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bookActionBtn, { backgroundColor: Colors.error }]}
                  onPress={() => handleDelete(selectedBook)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.bookActionBtnText}>🗑 Supprimer</Text>
                </TouchableOpacity>
              </View>

              {/* Compteur */}
              <Text style={styles.entriesCount}>
                {isLoadingEntries ? 'Chargement...' : `${entries.length} contribution${entries.length !== 1 ? 's' : ''}`}
              </Text>

              {/* Liste contributions */}
              <ScrollView style={styles.entriesList} showsVerticalScrollIndicator={false}>
                {entries.length === 0 && !isLoadingEntries && (
                  <View style={styles.entriesEmpty}>
                    <Text style={styles.entriesEmptyText}>
                      Aucune contribution pour l'instant.{'\n'}Partage le lien pour inviter tes proches 💛
                    </Text>
                  </View>
                )}
                {entries.map((entry) => (
                  <View key={entry.id} style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                      <Text style={[styles.entryName, { color: C.primary }]}>{entry.contributor_name}</Text>
                      <Text style={styles.entryDate}>
                        {new Date(entry.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                    <Text style={styles.entryMessage}>{entry.message}</Text>
                  </View>
                ))}
                <View style={{ height: 40 }} />
              </ScrollView>

              {/* Bouton envoyer le livre d'or */}
              {entries.length > 0 && (
                <View style={styles.sendFinalWrap}>
                  <TouchableOpacity
                    style={[styles.sendFinalBtn, { backgroundColor: C.primary }]}
                    onPress={async () => {
                      const recap = entries.map((e) => `— ${e.contributor_name} : "${e.message}"`).join('\n');
                      await Share.share({
                        message: `📒 Livre d'or — ${selectedBook.title}\n\n${recap}\n\n💛 Créé avec ConfettiCake`,
                      });
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.sendFinalBtnText}>🎉 Envoyer le livre d'or final</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* ── Modal aide ─────────────────────────────────── */}
      <Modal visible={helpVisible} transparent animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <TouchableOpacity style={styles.helpModalOverlay} activeOpacity={1} onPress={() => setHelpVisible(false)}>
          <View style={styles.helpModalCard}>
            <View style={styles.helpModalHeader}>
              <Text style={styles.helpModalTitle}>Comment fonctionne le livre d'or numérique ? 💛</Text>
              <TouchableOpacity onPress={() => setHelpVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.helpModalClose}>Fermer ✕</Text>
              </TouchableOpacity>
            </View>
            {[
              { title: 'Créer le livre d\'or', body: 'Appuie sur + Créer un livre d\'or. Indique le contact concerné et la date de l\'événement.' },
              { title: 'Inviter les proches', body: 'Via le bouton Partager le lien — par SMS, WhatsApp ou toute autre appli. Aucune installation requise pour les contributeurs !' },
              { title: 'Les contributions', body: 'Chaque invité dépose un mot ou un souvenir à son rythme. Tu suis en temps réel depuis cet écran.' },
              { title: 'Envoyer le livre d\'or', body: 'Le jour J, appuie sur Envoyer le livre d\'or final — toutes les contributions sont compilées et partagées en un message.' },
              { title: 'Bon à savoir 💡', body: 'Ferme le livre d\'or pour arrêter les nouvelles contributions. Tu peux le rouvrir à tout moment !' },
            ].map((s) => (
              <View key={s.title} style={styles.helpModalSection}>
                <Text style={styles.helpModalSectionTitle}>{s.title}</Text>
                <Text style={styles.helpModalSectionBody}>{s.body}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryContainer },
  backBtnText: { fontSize: 34, color: C.primary, lineHeight: 38 },
  topbarTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface },
  helpBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primaryContainer },
  helpBtnText: { fontSize: 18 },

  content: { padding: Spacing[4], gap: Spacing[3] },

  createBtn: {
    borderRadius: Radii.full,
    paddingVertical: 15,
    alignItems: 'center',
  },
  createBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.md, color: Colors.white },

  center: { alignItems: 'center', paddingVertical: 32 },

  emptyWrap: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.xl, color: Colors.onSurface },
  emptySub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

  bookCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing[4], borderWidth: 0.5, borderColor: Colors.surfaceContainerHighest,
    gap: 12,
  },
  bookCardClosed: { opacity: 0.65 },
  bookCardLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  bookEmoji: { fontSize: 28, lineHeight: 34 },
  bookTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: Colors.onSurface, marginBottom: 4 },
  bookDate: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginBottom: 6 },
  bookStatusPill: {
    alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 10,
    borderRadius: Radii.full,
  },
  bookStatusOpen: { backgroundColor: '#E8F5E9' },
  bookStatusClosed: { backgroundColor: Colors.surfaceContainerLow },
  bookStatusText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },
  bookArrow: { fontSize: 26, lineHeight: 30 },

  // Modal commun
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-start' },
  modalSheet: {
    backgroundColor: Colors.background, borderBottomLeftRadius: Radii['2xl'],
    borderBottomRightRadius: Radii['2xl'], paddingTop: 8, paddingBottom: 0,
    maxHeight: '85%',
  },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.outlineVariant, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainer,
  },
  modalTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.onSurface },
  modalCloseBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
  modalBody: { paddingHorizontal: Spacing[4], paddingTop: 16 },

  fieldLabel: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.onSurfaceVariant, marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radii.md,
    paddingVertical: 12, paddingHorizontal: 14,
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface,
    backgroundColor: Colors.white, marginBottom: 20,
  },
  fieldHint: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: 20, fontStyle: 'italic' },
  saveBtn: { borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  saveBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.white },

  // Détail
  bookActions: { flexDirection: 'row', gap: 8, padding: Spacing[4], paddingBottom: 0 },
  bookActionBtn: { flex: 1, borderRadius: Radii.full, paddingVertical: 10, alignItems: 'center' },
  bookActionBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: Colors.white },
  entriesCount: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurfaceVariant, paddingHorizontal: Spacing[4], paddingVertical: 12 },
  entriesList: { paddingHorizontal: Spacing[4] },
  entriesEmpty: { alignItems: 'center', paddingVertical: 32 },
  entriesEmptyText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22 },
  entryCard: {
    backgroundColor: Colors.white, borderRadius: Radii.lg, padding: Spacing[4],
    marginBottom: 10, borderWidth: 0.5, borderColor: C.primaryContainer, gap: 6,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryName: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md },
  entryDate: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
  entryMessage: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurface, lineHeight: 22 },
  sendFinalWrap: { padding: Spacing[4], paddingTop: 0 },
  sendFinalBtn: { borderRadius: Radii.full, paddingVertical: 15, alignItems: 'center' },
  sendFinalBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.md, color: Colors.white },

  // Modal aide
  helpModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  helpModalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '100%', gap: 12 },
  helpModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  helpModalTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.base, color: Colors.onSurface, flex: 1, lineHeight: 22 },
  helpModalClose: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: C.primary },
  helpModalSection: { gap: 3 },
  helpModalSectionTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface },
  helpModalSectionBody: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 19 },
  });
}
