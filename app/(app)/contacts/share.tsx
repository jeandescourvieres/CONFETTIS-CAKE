import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '../../../src/hooks/useColors';
import { Colors, Spacing, Typography, Radii, Shadows } from '../../../src/constants/theme';
import { useContacts } from '../../../src/hooks/useContacts';
import { supabase } from '../../../src/services/supabase';
import { BackHeader } from '../../../src/components/ui/BackHeader';

const RELATION_LABELS: Record<string, string> = {
  friend: 'Ami·e', family: 'Famille', partner: 'Partenaire',
  colleague: 'Collègue', pet: 'Animal', child_of: 'Enfant',
};

export default function ShareContactsScreen() {
  const C = useColors();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(C), [C]);
  const { data: contacts = [] } = useContacts();
  const humanContacts = contacts.filter((c) => (c as any).relation !== 'pet');

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === humanContacts.length) setSelected(new Set());
    else setSelected(new Set(humanContacts.map((c) => c.id)));
  };

  const handleShare = async () => {
    if (!selected.size) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-contact-share', {
        body: { contact_ids: Array.from(selected) },
      });
      if (error || !data?.url) throw new Error(error?.message ?? 'Erreur');

      await Share.share({
        message: `🎁 Je te partage ${selected.size} contact${selected.size > 1 ? 's' : ''} depuis ConfettiCake !\n\nClique sur ce lien pour les importer en un clin d'œil :\n${data.url}\n\n⏳ Lien valable 24h`,
        url: data.url,
      });
    } catch (e) {
      Alert.alert('Erreur', (e as Error).message ?? 'Impossible de créer le lien de partage.');
    } finally {
      setLoading(false);
    }
  };

  const formatBirthday = (bd: string | null) => {
    if (!bd) return null;
    const months = ['jan.','fév.','mar.','avr.','mai','juin','juil.','août','sep.','oct.','nov.','déc.'];
    const d = new Date(bd.startsWith('0000-') ? bd.replace('0000-', '2000-') : bd);
    return `🎂 ${d.getDate()} ${months[d.getMonth()]}`;
  };

  const displayName = (name: string) => {
    const parts = name.trim().split(' ');
    return parts.slice(1).join(' ') || parts[0] || name;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Partager mes contacts" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Explication */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🎁 Comment ça marche ?</Text>
          <View style={{ gap: 8, marginTop: 8 }}>
            {[
              { emoji: '1️⃣', text: 'Sélectionne les contacts que tu veux partager' },
              { emoji: '2️⃣', text: 'Un lien unique est généré — valable 24h' },
              { emoji: '3️⃣', text: 'Envoie ce lien par WhatsApp, SMS, email…' },
              { emoji: '4️⃣', text: 'La personne choisit quels contacts importer dans son appli' },
            ].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
                <Text style={styles.infoText}>{item.text}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.privacyBadge]}>
            <Text style={styles.privacyText}>🔒 Seuls les noms, dates d'anniversaire et relations sont partagés. Tes messages restent privés.</Text>
          </View>
        </View>

        {/* Sélection */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{humanContacts.length} contact{humanContacts.length > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={toggleAll} activeOpacity={0.7}>
            <Text style={[styles.selectAll, { color: C.primary }]}>
              {selected.size === humanContacts.length ? 'Tout déselectionner' : 'Tout sélectionner'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {humanContacts.map((c) => {
            const isSelected = selected.has(c.id);
            const bd = formatBirthday((c as any).birthday ?? null);
            const rel = RELATION_LABELS[(c as any).relation] ?? (c as any).relation;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.contactItem, isSelected && { borderColor: C.primary, backgroundColor: C.primaryContainer + '40' }]}
                onPress={() => toggle(c.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, isSelected && { backgroundColor: C.primary, borderColor: C.primary }]}>
                  {isSelected && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{displayName(c.name)}</Text>
                  <Text style={styles.contactMeta}>{[rel, bd].filter(Boolean).join(' · ')}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton flottant */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.shareBtn, (!selected.size || loading) && { opacity: 0.5 }]}
          onPress={handleShare}
          disabled={!selected.size || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.shareBtnText}>🔗 Générer le lien de partage ({selected.size})</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: Spacing[4], gap: Spacing[4] },
    infoCard: { backgroundColor: C.primaryContainer + '60', borderRadius: Radii.xl, padding: Spacing[4], borderWidth: 1, borderColor: C.primary + '30' },
    infoTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: C.primary, marginBottom: 4 },
    infoText: { flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 18 },
    privacyBadge: { backgroundColor: '#F0FDF4', borderRadius: Radii.lg, padding: 10, marginTop: 12, borderWidth: 1, borderColor: '#BBF7D0' },
    privacyText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 12, color: '#166534', lineHeight: 17 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
    selectAll: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
    list: { gap: 8 },
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: Radii.lg, borderWidth: 1.5, borderColor: Colors.outlineVariant, backgroundColor: Colors.white },
    checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    contactName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurface },
    contactMeta: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: Spacing[4], paddingTop: 12, paddingBottom: 32, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, ...Shadows.sm },
    shareBtn: { backgroundColor: C.primary, borderRadius: Radii.full, paddingVertical: 16, alignItems: 'center' },
    shareBtnText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: '#fff' },
  });
}
