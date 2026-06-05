import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { usePot, useContributions, useUpdatePotStatus, useUpdatePotDeadline, useUpdatePotGift } from '../../../src/hooks/usePot';
import { useAuthStore } from '../../../src/stores/authStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import { HelpModal } from '../../../src/components/ui/HelpModal';
import type { Contribution } from '../../../src/types/models';

// ── Suggestions de cadeaux par tranche de budget ─────────────────────────────
const GIFT_TIERS: { max: number; label: string; gifts: string[] }[] = [
  { max: 15,   label: '< 15 €',     gifts: ['📚 Livre', '🕯 Bougie parfumée', '🍫 Chocolats artisanaux', '🌿 Plante verte'] },
  { max: 30,   label: '15–30 €',    gifts: ['☕ Coffret café / thé', '🎨 Carnet & crayons d\'art', '🧴 Mini coffret bien-être', '🍓 Panier gourmand'] },
  { max: 50,   label: '30–50 €',    gifts: ['🔐 Escape game', '🍽 Restaurant', '💆 Soin spa', '🎬 Séance ciné + repas'] },
  { max: 80,   label: '50–80 €',    gifts: ['👨‍🍳 Cours de cuisine', '🎵 Concert / spectacle', '📸 Séance photo', '🧺 Coffret gastronomique'] },
  { max: 120,  label: '80–120 €',   gifts: ['🏡 Week-end Airbnb', '🎮 Console retro / jeu collector', '🌊 Journée spa ou aquatique', '🎸 Cours de musique'] },
  { max: 200,  label: '120–200 €',  gifts: ['✈️ Billet d\'avion', '💆 Week-end spa', '⌚ Montre', '💍 Bijou'] },
  { max: Infinity, label: '200 € +', gifts: ['🌍 Séjour / voyage', '🏡 Location vacances', '🍾 Expérience gastronomique', '🎁 Chèque cadeau sur mesure'] },
];

function getGiftSuggestions(amount: number): { label: string; gifts: string[] } {
  const tier = GIFT_TIERS.find((t) => amount <= t.max) ?? GIFT_TIERS[GIFT_TIERS.length - 1];
  return tier;
}

// ── Bloc suggestions de cadeaux ───────────────────────────────────────────────
function GiftSuggestionsBlock({ amount, compact = false }: { amount: number; compact?: boolean }) {
  const C = useColors();
  const styles = useMemo(() => makeSuggestionStyles(C), [C]);
  if (amount <= 0) return null;
  const { label, gifts } = getGiftSuggestions(amount);
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.header}>
        <Text style={styles.title}>💡 Idées de cadeaux</Text>
        <Text style={styles.budget}>Budget {label}</Text>
      </View>
      <View style={styles.grid}>
        {gifts.map((g) => (
          <View key={g} style={styles.pill}>
            <Text style={styles.pillText}>{g}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function makeSuggestionStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: {
    backgroundColor: C.primaryContainer + '55',
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: C.primary + '40',
    padding: Spacing[4],
    marginTop: Spacing[4],
    gap: 10,
  },
  containerCompact: {
    marginTop: Spacing[2],
    backgroundColor: Colors.white,
    borderColor: C.primaryContainer,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: C.primary },
  budget: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    paddingVertical: 3, paddingHorizontal: 10,
    backgroundColor: Colors.white, borderRadius: Radii.full,
    borderWidth: 1, borderColor: C.primaryContainer,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingVertical: 6, paddingHorizontal: 12,
    backgroundColor: Colors.white, borderRadius: Radii.full,
    borderWidth: 1, borderColor: C.primaryContainer,
  },
  pillText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface },
  });
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, target, large }: { current: number; target: number; large?: boolean }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const pct = Math.min((current / target) * 100, 100);
  return (
    <View style={[styles.track, large && styles.trackLarge]}>
      <View style={[styles.fill, { width: `${Math.round(pct)}%` as `${number}%` }, large && styles.fillLarge]} />
    </View>
  );
}

// ── Vue ORGANISATEUR ──────────────────────────────────────────────────────────
function OrganizerView({
  pot,
  contributions,
  onClose,
}: {
  pot: ReturnType<typeof usePot>['data'];
  contributions: Contribution[];
  onClose: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  if (!pot) return null;
  const total = pot.current_amount;
  const target = pot.target_amount;
  const pct = Math.min(Math.round((total / target) * 100), 100);
  const shareUrl = `https://rlwxcbnsqokpirhzzurj.supabase.co/functions/v1/pot-page?token=${pot.share_token}`;
  const contact = pot.contact as { name?: string } | undefined;

  return (
    <>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{total.toFixed(2)} €</Text>
          <Text style={styles.statLabel}>Collectés</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{target.toFixed(2)} €</Text>
          <Text style={styles.statLabel}>Objectif</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: Colors.primary }]}>{pct} %</Text>
          <Text style={styles.statLabel}>Atteint</Text>
        </View>
      </View>

      <ProgressBar current={total} target={target} large />

      {/* Idées de cadeaux selon le montant collecté */}
      <GiftSuggestionsBlock amount={total} />

      {/* Lien de partage */}
      <Text style={styles.sectionLabel}>Lien de partage</Text>
      <TouchableOpacity
        style={styles.shareLink}
        onPress={() => Share.share({ message: shareUrl, url: shareUrl })}
        activeOpacity={0.8}
      >
        <Text style={styles.shareLinkText} numberOfLines={1}>{shareUrl}</Text>
        <Text style={styles.shareLinkIcon}>📤</Text>
      </TouchableOpacity>

      {/* Contributions individuelles */}
      <Text style={styles.sectionLabel}>
        Contributions ({contributions.length})
      </Text>
      {contributions.length === 0 ? (
        <View style={styles.emptyContribs}>
          <Text style={styles.emptyContribsText}>Aucune contribution pour l'instant</Text>
          <Text style={styles.emptyContribsSub}>Partagez le lien ci-dessus pour collecter !</Text>
        </View>
      ) : (
        contributions.map((c) => (
          <View key={c.id} style={styles.contribRow}>
            <View style={styles.contribAvatar}>
              <Text style={styles.contribInitial}>
                {c.contributor_name[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <View style={styles.contribInfo}>
              <Text style={styles.contribName}>{c.contributor_name}</Text>
              <Text style={styles.contribEmail}>{c.contributor_email}</Text>
            </View>
            <Text style={styles.contribAmount}>{c.amount.toFixed(2)} €</Text>
          </View>
        ))
      )}

      {/* Actions clôture */}
      {pot.status === 'open' && (
        <>
          <Text style={styles.sectionLabel}>Actions</Text>
          <TouchableOpacity
            style={styles.contributeBtn}
            onPress={() => router.push(`/(app)/pot/contribute/${pot.id}` as never)}
            activeOpacity={0.85}
          >
            <Text style={styles.contributeBtnText}>💳 Contribuer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.closeBtnText}>Clôturer la cagnotte</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
}

// ── Vue PARTICIPANT ────────────────────────────────────────────────────────────
function ParticipantView({
  pot,
  contributions,
}: {
  pot: ReturnType<typeof usePot>['data'];
  contributions: Contribution[];
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();
  if (!pot) return null;
  const total = pot.current_amount;
  const target = pot.target_amount;
  const pct = Math.min(Math.round((total / target) * 100), 100);

  return (
    <>
      {/* Progress hero */}
      <View style={styles.participantProgress}>
        <Text style={styles.participantPct}>{pct} %</Text>
        <Text style={styles.participantSub}>de l'objectif atteint</Text>
        <ProgressBar current={total} target={target} large />
        <Text style={styles.participantAmounts}>
          {total.toFixed(2)} € / {target.toFixed(2)} €
        </Text>
      </View>

      {/* Contributeurs (sans montants) */}
      <Text style={styles.sectionLabel}>
        Participants ({contributions.length})
      </Text>
      {contributions.length === 0 ? (
        <View style={styles.emptyContribs}>
          <Text style={styles.emptyContribsText}>Soyez le premier à contribuer !</Text>
        </View>
      ) : (
        <View style={styles.participantsGrid}>
          {contributions.map((c) => (
            <View key={c.id} style={styles.participantPill}>
              <Text style={styles.participantCheck}>✓</Text>
              <Text style={styles.participantName} numberOfLines={1}>{c.contributor_name}</Text>
            </View>
          ))}
        </View>
      )}

      {/* CTA contribution */}
      {pot.status === 'open' && (
        <TouchableOpacity
          style={styles.contributeBtn}
          onPress={() => router.push(`/(app)/pot/contribute/${pot.id}` as never)}
          activeOpacity={0.85}
        >
          <Text style={styles.contributeBtnText}>💳 Contribuer au cadeau</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

// ── Modal clôture (organisateur) ──────────────────────────────────────────────
function CloseModal({
  potId,
  currentAmount,
  onDismiss,
}: {
  potId: string;
  currentAmount: number;
  onDismiss: () => void;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const [newDeadline, setNewDeadline] = useState<Date | null>(null);
  const [newGift, setNewGift] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [option, setOption] = useState<'extend' | 'adapt' | 'refund' | null>(null);
  const queryClient_extend = useUpdatePotDeadline();
  const queryClient_gift = useUpdatePotGift();
  const statusMutation = useUpdatePotStatus();

  const handleConfirm = async () => {
    try {
      if (option === 'extend' && newDeadline) {
        const dl = `${newDeadline.getFullYear()}-${String(newDeadline.getMonth() + 1).padStart(2, '0')}-${String(newDeadline.getDate()).padStart(2, '0')}`;
        await queryClient_extend.mutateAsync({ id: potId, deadline: dl });
        onDismiss();
      } else if (option === 'adapt' && newGift.trim()) {
        await queryClient_gift.mutateAsync({ id: potId, gift_description: newGift.trim() });
        await statusMutation.mutateAsync({ id: potId, status: 'completed' });
        onDismiss();
      } else if (option === 'refund') {
        Alert.alert(
          'Remboursement',
          'Le remboursement sera traité manuellement via ton tableau de bord Stripe.',
          [{ text: 'Compris', onPress: async () => {
            await statusMutation.mutateAsync({ id: potId, status: 'closed' });
            onDismiss();
          }}],
        );
      }
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>Clôturer la cagnotte</Text>
        <Text style={styles.modalSub}>Choisissez comment clôturer :</Text>

        {/* Option 1 : prolonger */}
        <TouchableOpacity
          style={[styles.optionBtn, option === 'extend' && styles.optionBtnActive]}
          onPress={() => setOption('extend')}
        >
          <Text style={styles.optionEmoji}>📅</Text>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, option === 'extend' && styles.optionTitleActive]}>Prolonger</Text>
            <Text style={styles.optionDesc}>Étendre la date limite</Text>
          </View>
        </TouchableOpacity>
        {option === 'extend' && (
          <View style={styles.optionExtra}>
            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowPicker(true)}>
              <Text style={styles.datePickerBtnText}>
                {newDeadline
                  ? newDeadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                  : 'Choisir une nouvelle date'}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={newDeadline ?? new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={(_e: unknown, d?: Date) => { setShowPicker(false); if (d) setNewDeadline(d); }}
              />
            )}
          </View>
        )}

        {/* Option 2 : adapter */}
        <TouchableOpacity
          style={[styles.optionBtn, option === 'adapt' && styles.optionBtnActive]}
          onPress={() => setOption('adapt')}
        >
          <Text style={styles.optionEmoji}>🎁</Text>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, option === 'adapt' && styles.optionTitleActive]}>Adapter le cadeau</Text>
            <Text style={styles.optionDesc}>Choisir un cadeau correspondant au montant collecté</Text>
          </View>
        </TouchableOpacity>
        {option === 'adapt' && (
          <View style={styles.optionExtra}>
            <GiftSuggestionsBlock amount={currentAmount} compact />
            <TextInput
              style={[styles.optionInput, { marginTop: 10 }]}
              value={newGift}
              onChangeText={setNewGift}
              placeholder="Décris le cadeau choisi..."
              placeholderTextColor={Colors.outlineVariant}
            />
          </View>
        )}

        {/* Option 3 : rembourser */}
        <TouchableOpacity
          style={[styles.optionBtn, option === 'refund' && styles.optionBtnActive]}
          onPress={() => setOption('refund')}
        >
          <Text style={styles.optionEmoji}>↩️</Text>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, option === 'refund' && styles.optionTitleActive]}>Rembourser</Text>
            <Text style={styles.optionDesc}>Rembourser tous les participants via Stripe</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.modalCancel} onPress={onDismiss}>
            <Text style={styles.modalCancelText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalConfirm, !option && { opacity: 0.4 }]}
            onPress={handleConfirm}
            disabled={!option}
          >
            <Text style={styles.modalConfirmText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function PotDetailScreen() {
  const C = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const { data: pot, isLoading } = usePot(id ?? null);
  const { data: contributions = [] } = useContributions(id ?? null);

  const isOrganizer = pot?.creator_id === user?.id;
  const contact = pot?.contact as { name?: string } | undefined;
  const statusColor = pot?.status === 'completed' ? '#4CAF50'
    : pot?.status === 'closed' ? Colors.outlineVariant
    : Colors.primary;

  const styles = useMemo(() => makeStyles(C), [C]);

  if (isLoading || !pot) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingCenter}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.topbarTitle} numberOfLines={1}>{pot.title}</Text>
        <HelpModal
          title="Cagnotte — mode d'emploi"
          content={
            isOrganizer
              ? (
                "👑 TU ES L'ORGANISATEUR\n\n" +
                "📊 SUIVRE LES CONTRIBUTIONS\n" +
                "Tu vois le montant collecté, l'objectif, la liste de tous les participants et leur contribution individuelle.\n\n" +
                "🔗 PARTAGER LE LIEN\n" +
                "Copie le lien et envoie-le par WhatsApp, SMS ou email. Tes proches contribuent sans l'appli.\n\n" +
                "💡 IDÉES DE CADEAUX\n" +
                "Des suggestions s'affichent selon le montant collecté. Elles changent au fil des contributions.\n\n" +
                "🏁 CLÔTURER LA CAGNOTTE\n" +
                "• 📅 Prolonger : repousser la date limite\n" +
                "• 🎁 Adapter le cadeau : des idées te sont proposées selon le budget, puis tu décris le cadeau choisi\n" +
                "• ↩️ Rembourser : remboursement de tous les participants via Stripe\n\n" +
                "📧 REÇUS AUTOMATIQUES\n" +
                "Chaque contributeur a déjà reçu un reçu officiel Stripe par email au moment de son paiement. Tu n'as rien à faire."
              ) : (
                "💜 COMMENT CONTRIBUER ?\n\n" +
                "Appuie sur '💳 Contribuer au cadeau', entre ton prénom/nom, ton email et le montant souhaité. Le paiement est sécurisé par Stripe.\n\n" +
                "📧 TON JUSTIFICATIF\n" +
                "Dès ton paiement validé, tu reçois automatiquement un reçu par email. Ce reçu Stripe est valable comme justificatif comptable.\n\n" +
                "👀 QUI VOIT QUOI ?\n" +
                "• Les participants voient les noms des contributeurs, mais pas les montants\n" +
                "• Seul l'organisateur voit le détail des montants\n\n" +
                "💡 Pas besoin d'avoir l'appli pour contribuer !"
              )
          }
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Hero ───────────────────────────────────── */}
        <LinearGradient
          colors={['#9b6bb5', '#5e2d80']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>{pot.title}</Text>
          <Text style={styles.heroPour}>Pour {contact?.name ?? '—'}</Text>
          <View style={[styles.heroBadge, { backgroundColor: statusColor + '30' }]}>
            <Text style={[styles.heroBadgeText, { color: Colors.white }]}>
              {pot.status === 'completed' ? '✓ Objectif atteint'
                : pot.status === 'closed' ? 'Clôturée'
                : '● En cours'}
            </Text>
          </View>
          {isOrganizer && (
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>👑 Organisateur</Text>
            </View>
          )}
        </LinearGradient>

        {/* ── Contenu selon rôle ─────────────────────── */}
        <View style={styles.bodySection}>
          {isOrganizer ? (
            <OrganizerView
              pot={pot}
              contributions={contributions}
              onClose={() => setShowCloseModal(true)}
            />
          ) : (
            <ParticipantView pot={pot} contributions={contributions} />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal clôture */}
      {showCloseModal && (
        <CloseModal potId={pot.id} currentAmount={pot.current_amount} onDismiss={() => setShowCloseModal(false)} />
      )}
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant },

  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: C.primaryContainer,
    backgroundColor: Colors.surfaceContainerLow,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  topbarTitle: { flex: 1, fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, textAlign: 'center' },

  hero: {
    margin: Spacing[4], borderRadius: Radii['2xl'],
    padding: Spacing[6], alignItems: 'center', gap: 8, ...Shadows.lg,
  },
  heroEmoji: { fontSize: 52 },
  heroTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'], color: Colors.white, textAlign: 'center' },
  heroPour: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.lg, color: 'rgba(255,255,255,0.85)' },
  heroBadge: { paddingVertical: 4, paddingHorizontal: 14, borderRadius: Radii.full },
  heroBadgeText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs },
  roleTag: {
    marginTop: 4, paddingVertical: 4, paddingHorizontal: 12,
    borderRadius: Radii.full, backgroundColor: 'rgba(255,255,255,0.2)',
  },
  roleTagText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.white },

  scrollContent: { paddingBottom: 80 },
  bodySection: { paddingHorizontal: Spacing[4] },
  sectionLabel: {
    borderLeftWidth: 2,
    borderLeftColor: C.primary,
    paddingLeft: 8,
    paddingVertical: 4,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: C.primary,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },

  // Stats (organizer)
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: Radii.xl, padding: Spacing[4], marginTop: Spacing[4],
    ...Shadows.sm,
  },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.surfaceContainer },
  statValue: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['2xl'], color: Colors.onSurface },
  statLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  // Progress bar
  track: { height: 8, borderRadius: 4, backgroundColor: Colors.surfaceContainer, overflow: 'hidden', marginTop: Spacing[4] },
  trackLarge: { height: 12, borderRadius: 6 },
  fill: { height: '100%', borderRadius: 4, backgroundColor: C.primary },
  fillLarge: { borderRadius: 6 },

  // Share link
  shareLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radii.md, padding: Spacing[3],
    borderWidth: 0.5, borderColor: C.primaryContainer, ...Shadows.sm,
  },
  shareLinkText: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
    color: C.primary, flex: 1, textDecorationLine: 'underline',
  },
  shareLinkIcon: { fontSize: 20, marginLeft: 8 },

  // Contribution rows (organizer)
  contribRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: Radii.lg,
    padding: Spacing[3], marginBottom: 8, ...Shadows.sm,
  },
  contribAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  contribInitial: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: C.primary },
  contribInfo: { flex: 1 },
  contribName: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurface },
  contribEmail: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
  contribAmount: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: C.primary },

  // Empty contributions
  emptyContribs: { alignItems: 'center', paddingVertical: Spacing[6], gap: 6 },
  emptyContribsText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.md, color: Colors.onSurfaceVariant },
  emptyContribsSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.outlineVariant, textAlign: 'center' },

  // Participant progress
  participantProgress: {
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing[5], marginTop: Spacing[4], alignItems: 'center', gap: 8, ...Shadows.sm,
  },
  participantPct: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['6xl'], color: C.primary },
  participantSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurfaceVariant, marginTop: -4 },
  participantAmounts: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant },

  // Participants grid (pills without amounts)
  participantsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  participantPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14,
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.full,
  },
  participantCheck: { fontSize: 14, color: C.primary },
  participantName: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base,
    color: C.primary, maxWidth: 120,
  },

  // CTA buttons
  contributeBtn: {
    marginTop: Spacing[5], paddingVertical: 16, borderRadius: Radii.full,
    backgroundColor: C.primary, alignItems: 'center', ...Shadows.md,
  },
  contributeBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, color: Colors.white },
  closeBtn: {
    marginTop: Spacing[3], paddingVertical: 14, borderRadius: Radii.full,
    borderWidth: 1.5, borderColor: Colors.error, alignItems: 'center',
  },
  closeBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.error },

  // Modal clôture
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.background, borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'], padding: Spacing[5], gap: 0,
  },
  modalTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['2xl'], color: Colors.onSurface, marginBottom: 4 },
  modalSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, marginBottom: 16 },

  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: Spacing[4], borderRadius: Radii.xl, marginBottom: 10,
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  optionBtnActive: { borderColor: C.primary, backgroundColor: C.primaryContainer + '40' },
  optionEmoji: { fontSize: 28 },
  optionText: { flex: 1 },
  optionTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
  optionTitleActive: { color: C.primary },
  optionDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },
  optionExtra: { marginTop: -4, marginBottom: 10, paddingHorizontal: 4 },
  datePickerBtn: {
    padding: Spacing[3], borderRadius: Radii.md,
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: C.primaryContainer,
  },
  datePickerBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: C.primary },
  optionInput: {
    backgroundColor: Colors.white, borderWidth: 0.5, borderColor: C.primaryContainer,
    borderRadius: Radii.md, paddingVertical: 10, paddingHorizontal: 12,
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface,
  },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: Spacing[4] },
  modalCancel: {
    flex: 1, paddingVertical: 14, borderRadius: Radii.full,
    borderWidth: 1.5, borderColor: Colors.outlineVariant, alignItems: 'center',
  },
  modalCancelText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurfaceVariant },
  modalConfirm: {
    flex: 1, paddingVertical: 14, borderRadius: Radii.full,
    backgroundColor: C.primary, alignItems: 'center',
  },
  modalConfirmText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.white },
  });
}
