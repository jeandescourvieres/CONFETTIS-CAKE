import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../src/services/supabase';
import { useAuthStore } from '../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { useTabScrollToTop } from '../../src/hooks/useTabScrollToTop';

type Note = { id: string; content: string; created_at: string; updated_at: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotesScreen() {
  const C = useColors();
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  useTabScrollToTop('notes', () => listRef.current?.scrollToOffset({ offset: 0, animated: true }));

  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [draft, setDraft] = useState('');

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('notes')
        .select('id, content, created_at, updated_at')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as Note[];
    },
    enabled: !!user,
  });

  const { mutateAsync: saveNote, isPending: isSaving } = useMutation({
    mutationFn: async ({ id, content }: { id?: string; content: string }) => {
      if (id) {
        const { error } = await (supabase as any)
          .from('notes')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('notes').insert({ content, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });

  const { mutateAsync: deleteNote } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });

  const openNew = () => {
    setEditingNote(null);
    setDraft('');
    setModalVisible(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setDraft(note.content);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!draft.trim()) return;
    await saveNote({ id: editingNote?.id, content: draft.trim() });
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer cette note ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteNote(id) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: C.onSurface }]}>📝 Mes notes</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: C.primary }]} onPress={openNew} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>+ Nouvelle note</Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      {isLoading ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: C.onSurfaceVariant }]}>Chargement…</Text>
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={[styles.emptyText, { color: C.onSurfaceVariant }]}>Aucune note pour l'instant.</Text>
          <Text style={[styles.emptySub, { color: C.outlineVariant }]}>Appuie sur "+ Nouvelle note" pour commencer.</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={notes}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: C.surface }]}
              onPress={() => openEdit(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.cardContent, { color: C.onSurface }]} numberOfLines={4}>
                {item.content}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardDate, { color: C.outlineVariant }]}>{formatDate(item.updated_at)}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.deleteBtn}>🗑</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal édition */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={[styles.modalCard, { backgroundColor: C.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: C.onSurface }]}>
                {editingNote ? 'Modifier la note' : 'Nouvelle note'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalClose, { color: C.outlineVariant }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.modalInput, { color: C.onSurface, borderColor: C.outline }]}
              value={draft}
              onChangeText={setDraft}
              placeholder="Écris ta note ici…"
              placeholderTextColor={C.outlineVariant}
              multiline
              autoFocus
            />
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: C.primary }, (!draft.trim() || isSaving) && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={!draft.trim() || isSaving}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>{isSaving ? 'Enregistrement…' : 'Enregistrer'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.eventBtn, { borderColor: C.primary }]}
              onPress={() => { setModalVisible(false); router.push('/(app)/upcoming-events' as never); }}
              activeOpacity={0.85}
            >
              <Text style={[styles.eventBtnText, { color: C.primary }]}>📅 Créer un événement</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing[4], paddingVertical: Spacing[3] },
  title:      { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'] },
  addBtn:     { borderRadius: Radii.full, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.white },
  list:       { padding: Spacing[4], gap: 12, paddingBottom: 100 },
  card:       { borderRadius: Radii.xl, padding: Spacing[4], ...Shadows.sm },
  cardContent:{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, lineHeight: 22, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate:   { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs },
  deleteBtn:  { fontSize: 18 },
  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48 },
  emptyText:  { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.lg, textAlign: 'center' },
  emptySub:   { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, textAlign: 'center' },
  modalOverlay:  { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard:     { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing[5], gap: 14 },
  modalHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle:    { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl },
  modalClose:    { fontSize: 22, padding: 4 },
  modalInput:    { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, borderWidth: 1, borderRadius: Radii.lg, padding: 12, minHeight: 160, textAlignVertical: 'top' },
  saveBtn:       { borderRadius: Radii.full, paddingVertical: 14, alignItems: 'center' },
  saveBtnText:   { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.white },
  eventBtn:      { borderRadius: Radii.full, paddingVertical: 13, alignItems: 'center', borderWidth: 1.5 },
  eventBtnText:  { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md },
});
