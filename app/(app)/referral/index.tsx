import React, { useMemo, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Share, ScrollView,
  Modal, TextInput, KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { useReferralHistory, useMyReferral, useLatestMonthlyChallenge } from '../../../src/hooks/useReferrals';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../../../src/i18n';
import { useAuthStore } from '../../../src/stores/authStore';
import { useUIStore } from '../../../src/stores/uiStore';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { BackHeader } from '../../../src/components/ui/BackHeader';
import { HelpModal } from '../../../src/components/ui/HelpModal';
import { useColors } from '../../../src/hooks/useColors';
import { getSignatureLabels } from '../../../src/utils/signature';

// ── Sujet de l'email d'invitation ─────────────────────────────────────────────
const EMAIL_SUBJECT = "Je t'invite sur ConfettiCake 🎁";

export default function ReferralScreen() {
  const C = useColors();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const showToast = useUIStore((s) => s.showToast);
  const code = profile?.referral_code || '—';
  const credits = profile?.credits ?? 0;
  const isPremium = profile?.plan === 'premium';
  const CHALLENGE_GOAL = 5;
  const challengeWon = !!profile?.challenge_won_at;
  const firstName = profile?.full_name?.split(' ')[0] ?? '';
  const { data: referralHistory = [] } = useReferralHistory();
  const { data: myReferral } = useMyReferral();
  const { data: monthlyChallenge } = useLatestMonthlyChallenge();
  const sigLabels = getSignatureLabels(i18n.language);

  // ── État du flow d'invitation ──────────────────────────────────────────────
  const [shareStep, setShareStep] = useState<null | 'form' | 'options'>(null);
  const [challengeHelpVisible, setChallengeHelpVisible] = useState(false);
  const [rankingHelpVisible, setRankingHelpVisible] = useState(false);
  const [inviteName,  setInviteName]  = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const buildMessage = (recipientName: string) =>
    t('profile.referral.message', { code, firstName: recipientName.trim() || 'toi' });

  const openForm = () => {
    setInviteName('');
    setInviteEmail('');
    setShareStep('form');
  };

  // ── Actions de partage ────────────────────────────────────────────────────
  const handleShareEmail = () => {
    const body    = buildMessage(inviteName);
    const subject = encodeURIComponent(EMAIL_SUBJECT);
    const bEncoded = encodeURIComponent(body);
    const to = inviteEmail.trim() ? inviteEmail.trim() : '';
    Linking.openURL(`mailto:${to}?subject=${subject}&body=${bEncoded}`)
      .catch(() => showToast("Impossible d'ouvrir le client mail", 'error'));
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(buildMessage(inviteName));
    Linking.openURL(`https://wa.me/?text=${text}`)
      .catch(() => showToast('WhatsApp non disponible', 'error'));
  };

  const handleShareSMS = () => {
    const body = encodeURIComponent(buildMessage(inviteName));
    // Android: sms:?body=  /  iOS: sms:&body=
    const sep = Platform.OS === 'ios' ? '&' : '?';
    Linking.openURL(`sms:${sep}body=${body}`).catch(() => {});
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(buildMessage(inviteName));
    showToast('Texte copié dans le presse-papier !', 'success');
  };

  const handleShareNative = async () => {
    try {
      await Share.share({
        message: buildMessage(inviteName),
        title: EMAIL_SUBJECT,
      });
    } catch { /* silent */ }
  };

  const styles = useMemo(() => makeStyles(C), [C]);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader
        title="Parrainage"
        rightElement={
          <HelpModal
            title="Parrainage"
            content={"Partage ton code unique — dès qu'un ami s'inscrit avec ton code, vous recevez chacun 5 crédits IA offerts !\n\n👈 Tu as été parrainé·e ? Lors de ton inscription, tu pouvais saisir le code de ton parrain dans le champ dédié."}
          />
        }
      />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Hero titre personnalisé ───────────────── */}
        <LinearGradient
          colors={C.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroEmojis}>🌟 ✨ 🌟</Text>
          <Text style={styles.heroName}>{firstName || 'Toi'},</Text>
          <Text style={styles.heroQuestion}>pourquoi parrainer tes proches ?</Text>
        </LinearGradient>

        {/* ── Accroche ──────────────────────────────── */}
        <View style={styles.catchCard}>
          <Text style={styles.catchText}>
            En les parrainant, tu gagneras des crédits gratuits pour envoyer des messages IA – et tes filleuls en recevront autant !{'\n'}
            ET plus tu parraineras, plus tu auras la possibilité en retour d'envoyer des messages IA sans dépenser un centime. 🤣
          </Text>
          <Text style={styles.catchNote}>(Une bonne raison de partager l'appli avec ceux qui comptent pour toi !) 😉</Text>
        </View>

        <Text style={styles.title}>{t('profile.referral.title')}</Text>

        {/* Code */}
        <View style={styles.codeCard}>
          <Text style={styles.code}>{code}</Text>
        </View>

        {/* Crédits — uniquement pour les utilisateurs free */}
        {!isPremium && (
          <View style={styles.creditsRow}>
            <Text style={styles.creditsEmoji}>💜</Text>
            <Text style={styles.creditsText}>
              Tes crédits IA : <Text style={styles.creditsValue}>{credits} disponible{credits > 1 ? 's' : ''}</Text>
            </Text>
          </View>
        )}
        {isPremium && (
          <View style={[styles.creditsRow, styles.creditsRowPremium]}>
            <Text style={styles.creditsEmoji}>⭐</Text>
            <Text style={styles.creditsText}>Tu es Premium — créations illimitées !</Text>
          </View>
        )}

        {/* ── Challenge prescripteurs ────────────────── */}
        {(() => {
          const progress = Math.min(referralHistory.length, CHALLENGE_GOAL);
          const pct = progress / CHALLENGE_GOAL;
          if (challengeWon) {
            return (
              <View style={styles.challengeWonCard}>
                <Text style={styles.challengeWonEmoji}>🏆</Text>
                <Text style={styles.challengeWonTitle}>Challenge réussi !</Text>
                <Text style={styles.challengeWonSub}>Notre équipe te contacte sous 48h pour ton cadeau 🎁</Text>
              </View>
            );
          }
          return (
            <View style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeEmoji}>🏆</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.challengeTitle}>Challenge prescripteurs</Text>
                  <Text style={styles.challengeSub}>Parraine 5 amis → 1 mois Premium offert !</Text>
                </View>
                <TouchableOpacity onPress={() => setChallengeHelpVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.challengeInfoBtn}>ℹ️</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.challengeBarBg}>
                <View style={[styles.challengeBarFill, { width: `${Math.round(pct * 100)}%` as any }]} />
              </View>
              <Text style={styles.challengeCount}>{progress} / {CHALLENGE_GOAL} amis parrainés</Text>
            </View>
          );
        })()}

        {/* ── Classement du mois ───────────────────────── */}
        {monthlyChallenge && (monthlyChallenge.volume_winner_name || monthlyChallenge.quality_winner_name) && (
          <View style={styles.rankingCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[styles.rankingTitle, { flex: 1 }]}>
                🏆 Classement du mois — {new Date(monthlyChallenge.period_start).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => setRankingHelpVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.challengeInfoBtn}>ℹ️</Text>
              </TouchableOpacity>
            </View>
            {monthlyChallenge.volume_winner_name && (
              <View style={styles.rankingRow}>
                <Text style={styles.rankingEmoji}>🥇</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankingName}>{monthlyChallenge.volume_winner_name}</Text>
                  <Text style={styles.rankingDesc}>Le plus de filleuls parrainés</Text>
                </View>
                <Text style={styles.rankingScore}>{monthlyChallenge.volume_winner_count}</Text>
              </View>
            )}
            {monthlyChallenge.quality_winner_name && (
              <View style={styles.rankingRow}>
                <Text style={styles.rankingEmoji}>💎</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankingName}>{monthlyChallenge.quality_winner_name}</Text>
                  <Text style={styles.rankingDesc}>Le plus de filleuls passés en Premium</Text>
                </View>
                <Text style={styles.rankingScore}>{monthlyChallenge.quality_winner_count}</Text>
              </View>
            )}
            <Text style={styles.rankingFooter}>Un nouveau classement est tiré chaque mois — à toi de grimper ! ✨</Text>
          </View>
        )}

        {/* Qui m'a parrainé */}
        {myReferral && (
          <View style={styles.myReferralCard}>
            <Text style={styles.myReferralTitle}>🎁 Tu as été parrainé·e</Text>
            <View style={styles.myReferralRow}>
              <Text style={styles.myReferralEmoji}>👤</Text>
              <View style={styles.myReferralInfo}>
                <Text style={styles.myReferralName}>
                  {myReferral.referrer_name ?? 'Un ami'}
                </Text>
                <Text style={styles.myReferralDate}>
                  {new Date(myReferral.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </Text>
              </View>
              <Text style={styles.myReferralCredits}>+{myReferral.credits_awarded} crédits</Text>
            </View>
          </View>
        )}

        {/* Historique parrainages */}
        {referralHistory.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>👥 Tes filleuls</Text>
            {referralHistory.map((r: any) => {
              const date = new Date(r.created_at);
              const label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
              const email = r.referred_email ?? 'Anonyme';
              const shortEmail = email.length > 22 ? email.slice(0, 20) + '…' : email;
              const isNew = (Date.now() - date.getTime()) < 7 * 24 * 60 * 60 * 1000;
              return (
                <View key={r.id} style={[styles.historyRow, isNew && styles.historyRowNew]}>
                  <Text style={styles.historyEmoji}>{isNew ? '🎉' : '✅'}</Text>
                  <View style={styles.historyInfo}>
                    <View style={styles.historyEmailRow}>
                      <Text style={styles.historyEmail}>{shortEmail}</Text>
                      {isNew && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>Nouveau !</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.historyDate}>Inscrit le {label}</Text>
                  </View>
                  <Text style={[styles.historyCredits, isNew && { color: '#4CAF50' }]}>
                    +{r.credits_awarded} crédits
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Explication */}
        <Text style={styles.howTitle}>Comment ça marche ?</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>🎁</Text>
            <Text style={styles.infoText}>Partage ton code avec un ami</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoEmoji}>✅</Text>
            <Text style={styles.infoText}>Il s'inscrit avec ton code</Text>
          </View>
          <View style={styles.infoDivider} />
          {isPremium ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>💜</Text>
              <Text style={styles.infoText}>
                Votre ami reçoit <Text style={styles.infoHighlight}>5 crédits IA</Text> offerts pour démarrer
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoEmoji}>💜</Text>
                <Text style={styles.infoText}>
                  Toi et lui, vous gagnez <Text style={styles.infoHighlight}>5 crédits IA</Text> chacun
                </Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoEmoji}>✨</Text>
                <Text style={styles.infoText}>
                  <Text style={styles.infoHighlight}>1 crédit</Text> = 1 message généré par l'IA.{'\n'}ET tu peux le régénérer gratuitement autant de fois que tu veux ! Jusqu'à ce qu'il te convienne.
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Bouton partager */}
        <TouchableOpacity style={styles.shareBtn} onPress={openForm} activeOpacity={0.85}>
          <Text style={styles.shareBtnText}>🎁 Je partage mon code</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ── Modal d'invitation ─────────────────────────────────────────────── */}
      <Modal
        visible={shareStep !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setShareStep(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShareStep(null)} />

          <View style={styles.modalSheet}>
            {/* ── Drag handle ── */}
            <View style={styles.sheetHandle} />

            {shareStep === 'form' ? (
              <>
                <Text style={styles.sheetTitle}>📬 À qui envoies-tu l'invitation ?</Text>
                <Text style={styles.sheetSub}>
                  Renseigne le prénom pour personnaliser le message — l'email est optionnel mais pratique pour l'envoyer directement.
                </Text>

                <Text style={styles.fieldLabel}>Prénom *</Text>
                <TextInput
                  style={[styles.input, { borderColor: C.primaryContainer }]}
                  value={inviteName}
                  onChangeText={setInviteName}
                  placeholder="Ex : Sophie"
                  placeholderTextColor={Colors.outlineVariant}
                  autoCapitalize="words"
                  returnKeyType="next"
                />

                <Text style={styles.fieldLabel}>Email (optionnel)</Text>
                <TextInput
                  style={[styles.input, { borderColor: C.primaryContainer }]}
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  placeholder="sophie@example.com"
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />

                <TouchableOpacity
                  style={[styles.nextBtn, { backgroundColor: C.primary }, !inviteName.trim() && { opacity: 0.4 }]}
                  onPress={() => setShareStep('options')}
                  disabled={!inviteName.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextBtnText}>Voir les options de partage →</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.sheetTitle}>
                  Envoyer l'invitation à {inviteName} 🎉
                </Text>
                <Text style={styles.sheetSub}>
                  Choisis comment partager ton code avec {inviteName} :
                </Text>

                {/* Email */}
                <TouchableOpacity style={styles.channelBtn} onPress={handleShareEmail} activeOpacity={0.8}>
                  <View style={[styles.channelIcon, { backgroundColor: '#EA4335' }]}>
                    <Text style={styles.channelEmoji}>📧</Text>
                  </View>
                  <View style={styles.channelInfo}>
                    <Text style={styles.channelLabel}>Email</Text>
                    <Text style={styles.channelDesc}>
                      {inviteEmail.trim()
                        ? `Envoyer à ${inviteEmail}`
                        : 'Ouvre ton client mail'}
                    </Text>
                  </View>
                  <Text style={styles.channelArrow}>›</Text>
                </TouchableOpacity>

                {/* WhatsApp */}
                <TouchableOpacity style={styles.channelBtn} onPress={handleShareWhatsApp} activeOpacity={0.8}>
                  <View style={[styles.channelIcon, { backgroundColor: '#25D366' }]}>
                    <Text style={styles.channelEmoji}>💬</Text>
                  </View>
                  <View style={styles.channelInfo}>
                    <Text style={styles.channelLabel}>WhatsApp</Text>
                    <Text style={styles.channelDesc}>Message personnalisé</Text>
                  </View>
                  <Text style={styles.channelArrow}>›</Text>
                </TouchableOpacity>

                {/* SMS */}
                <TouchableOpacity style={styles.channelBtn} onPress={handleShareSMS} activeOpacity={0.8}>
                  <View style={[styles.channelIcon, { backgroundColor: '#34AADC' }]}>
                    <Text style={styles.channelEmoji}>📱</Text>
                  </View>
                  <View style={styles.channelInfo}>
                    <Text style={styles.channelLabel}>SMS</Text>
                    <Text style={styles.channelDesc}>Via l'appli Messages</Text>
                  </View>
                  <Text style={styles.channelArrow}>›</Text>
                </TouchableOpacity>

                {/* Copier */}
                <TouchableOpacity style={styles.channelBtn} onPress={handleCopy} activeOpacity={0.8}>
                  <View style={[styles.channelIcon, { backgroundColor: Colors.onSurfaceVariant }]}>
                    <Text style={styles.channelEmoji}>📋</Text>
                  </View>
                  <View style={styles.channelInfo}>
                    <Text style={styles.channelLabel}>Copier le texte</Text>
                    <Text style={styles.channelDesc}>Colle-le où tu veux</Text>
                  </View>
                  <Text style={styles.channelArrow}>›</Text>
                </TouchableOpacity>

                {/* Autres */}
                <TouchableOpacity style={styles.channelBtn} onPress={handleShareNative} activeOpacity={0.8}>
                  <View style={[styles.channelIcon, { backgroundColor: C.primary }]}>
                    <Text style={styles.channelEmoji}>📤</Text>
                  </View>
                  <View style={styles.channelInfo}>
                    <Text style={styles.channelLabel}>Autres applications</Text>
                    <Text style={styles.channelDesc}>Messenger, Telegram…</Text>
                  </View>
                  <Text style={styles.channelArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShareStep('form')} style={styles.backLink}>
                  <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Modifier le prénom / email</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Modale aide Challenge ──────────────────────────────────────────── */}
      <Modal
        visible={challengeHelpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setChallengeHelpVisible(false)}
      >
        <TouchableOpacity
          style={styles.helpOverlay}
          activeOpacity={1}
          onPress={() => setChallengeHelpVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.helpPanel, { borderTopColor: '#F59E0B' }]}>
            <Text style={styles.helpPanelTitle}>🏆 Challenge prescripteurs</Text>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>C'est quoi ?</Text>
              <Text style={styles.helpSectionBody}>
                Un défi réservé aux utilisateurs qui adorent partager l'appli avec leurs proches. Parraine 5 amis et gagne 1 mois Premium offert !
              </Text>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Comment ça marche ?</Text>
              <Text style={styles.helpSectionBody}>
                {'1️⃣  Partage ton code unique avec des amis.\n2️⃣  Ils s\'inscrivent en saisissant ton code.\n3️⃣  Chaque inscription compte comme 1 filleul.\n4️⃣  Dès 5 filleuls atteints, tu gagnes !'}
              </Text>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>La récompense 🎁</Text>
              <Text style={styles.helpSectionBody}>
                1 mois Premium offert, soit l'accès illimité à toutes les fonctions de l'appli sans dépenser un centime. Notre équipe te contacte sous 48h dès que tu atteins l'objectif.
              </Text>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Suivre ma progression</Text>
              <Text style={styles.helpSectionBody}>
                La barre de progression en bas de la carte se met à jour en temps réel à chaque inscription d'un filleul. Tes filleuls sont aussi listés dans la section "Tes filleuls" ci-dessous.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.helpCloseBtn, { backgroundColor: '#F59E0B' }]}
              onPress={() => setChallengeHelpVisible(false)}
            >
              <Text style={styles.helpCloseBtnText}>Compris !</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Modal aide — Classement du mois ──────────────────────────────── */}
      <Modal
        visible={rankingHelpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRankingHelpVisible(false)}
      >
        <TouchableOpacity
          style={styles.helpOverlay}
          activeOpacity={1}
          onPress={() => setRankingHelpVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.helpPanel, { borderTopColor: '#9b6bb5' }]}>
            <Text style={styles.helpPanelTitle}>🏆 Classement du mois</Text>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>C'est quoi ?</Text>
              <Text style={styles.helpSectionBody}>
                Chaque mois, on met à l'honneur les deux meilleurs prescripteurs de ConfettiCake — ceux qui font le plus rayonner l'appli autour d'eux.
              </Text>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Deux façons de gagner</Text>
              <Text style={styles.helpSectionBody}>
                {'🥇  Volume — la personne qui a parrainé le plus de filleuls dans le mois.\n💎  Qualité — la personne dont le plus de filleuls ont choisi de passer en Premium.'}
              </Text>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>La récompense 🎁</Text>
              <Text style={styles.helpSectionBody}>
                Notre équipe contacte les gagnants pour leur offrir une récompense (Premium offert, et même un cadeau surprise pour les plus exceptionnels sur la durée !).
              </Text>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Le classement repart à zéro</Text>
              <Text style={styles.helpSectionBody}>
                Un nouveau podium est calculé le 1er de chaque mois sur la base du mois écoulé — une nouvelle chance de briller à chaque fois !
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.helpCloseBtn, { backgroundColor: '#9b6bb5' }]}
              onPress={() => setRankingHelpVisible(false)}
            >
              <Text style={styles.helpCloseBtnText}>Compris !</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: 80,
    gap: 16,
  },
  heroCard: {
    width: '100%',
    borderRadius: Radii.xl,
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    gap: 6,
    ...Shadows.md,
  },
  heroEmojis: { fontSize: 18, marginBottom: 2, letterSpacing: 4 },
  heroName: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['3xl'],
    color: Colors.white,
  },
  heroQuestion: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xl,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 28,
  },
  catchCard: {
    width: '100%',
    backgroundColor: C.primaryContainer + '50',
    borderRadius: Radii.xl,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    padding: Spacing[4],
    gap: 8,
  },
  catchText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  catchNote: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontStyle: 'italic',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  emoji: { fontSize: 36, marginBottom: 0 },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  codeCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: C.primaryContainer,
    ...Shadows.sm,
  },
  codeLabel: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  code: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
    color: C.primary,
    letterSpacing: 4,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.primaryContainer,
    borderRadius: Radii.full,
    paddingVertical: 10,
    paddingHorizontal: Spacing[5],
  },
  creditsEmoji: { fontSize: 18 },
  creditsText: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  creditsValue: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: C.primary,
  },
  creditsRowPremium: {
    backgroundColor: '#fef9e7',
    borderWidth: 1,
    borderColor: '#fdd34d',
  },
  shareBtn: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    ...Shadows.md,
  },
  shareBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.xl,
    color: Colors.white,
  },
  signatureBanner: {
    width: '100%',
    backgroundColor: C.primary,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 6,
    ...Shadows.sm,
  },
  sigMain: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.white,
    lineHeight: 20,
  },
  sigCta: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  sigUrl: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: '#fdd34d',
  },
  myReferralCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
    ...Shadows.sm,
  },
  myReferralTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    padding: Spacing[4],
    paddingBottom: Spacing[2],
  },
  myReferralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerLow,
  },
  myReferralEmoji: { fontSize: 20 },
  myReferralInfo: { flex: 1 },
  myReferralName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  myReferralDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  myReferralCredits: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  historyCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  historyTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    padding: Spacing[4],
    paddingBottom: Spacing[2],
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing[4],
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerLow,
  },
  historyEmoji: { fontSize: 20 },
  historyInfo: { flex: 1 },
  historyEmail: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
  },
  historyDate: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  historyCredits: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: C.primary,
  },
  howTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    width: '100%',
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
  },
  infoEmoji: { fontSize: 20 },
  infoText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  infoHighlight: {
    fontFamily: 'BeVietnamPro_700Bold',
    color: C.primary,
  },
  infoDivider: {
    height: 0.5,
    backgroundColor: Colors.surfaceContainerLow,
    marginLeft: Spacing[4] + 20 + 12,
  },
  // ── Modal d'invitation ──────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    paddingHorizontal: Spacing[5],
    paddingBottom: Platform.OS === 'ios' ? 36 : Spacing[6],
    paddingTop: Spacing[3],
    gap: 0,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: Spacing[4],
  },
  sheetTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    marginBottom: 6,
  },
  sheetSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: Spacing[5],
  },
  fieldLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 0.5,
    borderRadius: Radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
    marginBottom: Spacing[4],
  },
  nextBtn: {
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  nextBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  // ── Canaux de partage ────────────────────────────────────────────────────
  channelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  channelIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  channelEmoji: { fontSize: 20 },
  channelInfo: { flex: 1 },
  channelLabel: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  channelDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  channelArrow: {
    fontSize: 22,
    color: Colors.outlineVariant,
  },
  backLink: {
    alignItems: 'center',
    paddingTop: Spacing[4],
  },
  backLinkText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
  },
  // ── Challenge prescripteurs ──────────────────────────────────────────────
  challengeCard: {
    width: '100%',
    backgroundColor: '#FFF9E6',
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: Spacing[4],
    gap: 10,
    ...Shadows.sm,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  challengeEmoji: { fontSize: 28 },
  challengeTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: '#92400E',
  },
  challengeSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: '#B45309',
    lineHeight: 18,
    marginTop: 2,
  },
  challengeBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#FDE68A',
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  challengeBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: Radii.full,
    minWidth: 10,
  },
  challengeCount: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: '#92400E',
    textAlign: 'center',
  },
  challengeWonCard: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderRadius: Radii.xl,
    borderWidth: 2,
    borderColor: '#F59E0B',
    paddingVertical: Spacing[5],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    gap: 6,
    ...Shadows.md,
  },
  challengeWonEmoji: { fontSize: 40 },
  challengeWonTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: '#92400E',
  },
  challengeWonSub: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: Typography.md,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 22,
  },
  challengeInfoBtn: { fontSize: 20 },
  rankingCard: {
    width: '100%',
    backgroundColor: '#F5F0FF',
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: '#9b6bb5',
    padding: Spacing[4],
    gap: 10,
    ...Shadows.sm,
  },
  rankingTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.md,
    color: '#5B3E78',
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankingEmoji: { fontSize: 24 },
  rankingName: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.base,
    color: '#5B3E78',
  },
  rankingDesc: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: '#7C5C99',
    marginTop: 1,
  },
  rankingScore: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: '#9b6bb5',
  },
  rankingFooter: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: '#7C5C99',
    textAlign: 'center',
    marginTop: 2,
  },
  helpOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  helpPanel: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    borderTopWidth: 4,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Platform.OS === 'ios' ? 36 : Spacing[6],
    gap: 12,
  },
  helpPanelTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    marginBottom: 4,
  },
  helpSection: { gap: 4 },
  helpSectionTitle: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  helpSectionBody: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  helpCloseBtn: {
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  helpCloseBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.lg,
    color: Colors.white,
  },
  // ── Badges existants ─────────────────────────────────────────────────────
  historyRowNew: {
    backgroundColor: '#f0faf0',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  historyEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: Radii.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 10,
    color: Colors.white,
  },
  });
}
