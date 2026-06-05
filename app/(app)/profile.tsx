import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Share,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTabScrollToTop } from '../../src/hooks/useTabScrollToTop';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { useMessages } from '../../src/hooks/useAIGenerate';
import { useContacts, useMyPets } from '../../src/hooks/useContacts';
import { useMyPots } from '../../src/hooks/usePot';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '../../src/i18n';
import { useThemeStore } from '../../src/stores/themeStore';
import { APP_THEMES } from '../../src/constants/appThemes';
import { useColors } from '../../src/hooks/useColors';
import { schedulePetBirthdayReminders } from '../../src/services/notifications.service';
import Constants from 'expo-constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
// settingsCard : marginH=16×2, themeGrid : padding=16×2, gap=12×2 (entre 3 colonnes)
const SWATCH_W = Math.floor((SCREEN_WIDTH - 32 - 32 - 24) / 3);

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, emoji }: { value: number; label: string; emoji: string }) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({
  emoji,
  label,
  onPress,
  value,
  isToggle,
  toggled,
  onToggle,
  destructive,
}: {
  emoji: string;
  label: string;
  onPress?: () => void;
  value?: string;
  isToggle?: boolean;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  destructive?: boolean;
}) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={!isToggle ? onPress : undefined}
      activeOpacity={isToggle ? 1 : 0.7}
    >
      <Text style={styles.settingEmoji}>{emoji}</Text>
      <Text style={[styles.settingLabel, destructive && { color: Colors.error }]}>{label}</Text>
      <View style={styles.settingRight}>
        {isToggle ? (
          <Switch
            value={toggled}
            onValueChange={onToggle}
            trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
            thumbColor={toggled ? Colors.primary : Colors.outlineVariant}
          />
        ) : value ? (
          <Text style={styles.settingValue}>{value}</Text>
        ) : (
          <Text style={styles.settingChevron}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const C = useColors();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { profile, user, signOut, updateProfile } = useAuthStore();
  const { data: messages = [] } = useMessages();
  const { data: contacts = [] } = useContacts();
  const { data: pots = [] } = useMyPots();

  const { theme: appTheme, setTheme } = useThemeStore();

  const [notifsBirthday, setNotifsBirthday] = useState(profile?.notif_birthday !== false);
  const [notifsNameday, setNotifsNameday] = useState(profile?.notif_nameday !== false);
  const [notifsPot, setNotifsPot] = useState(profile?.notif_pot !== false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  useTabScrollToTop('profile', () => scrollRef.current?.scrollTo({ y: 0, animated: false }));
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editBirthday, setEditBirthday] = useState<Date | null>(null);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [editCivilite, setEditCivilite] = useState<'M.' | 'Mme' | null>(null);
  const [showSignature, setShowSignature] = useState(profile?.show_signature !== false);

  const handleToggleSignature = async (val: boolean) => {
    setShowSignature(val);
    await updateProfile({ show_signature: val });
  };

  const handleToggleBirthday = async (val: boolean) => {
    setNotifsBirthday(val);
    await updateProfile({ notif_birthday: val });
  };
  const handleToggleNameday = async (val: boolean) => {
    setNotifsNameday(val);
    await updateProfile({ notif_nameday: val });
  };
  const handleTogglePot = async (val: boolean) => {
    setNotifsPot(val);
    await updateProfile({ notif_pot: val });
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language)
    ?? SUPPORTED_LANGUAGES[0];

  const isPremium = profile?.plan === 'premium';
  const initials = profile?.full_name
    ?.split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') ?? '?';

  const sentMessages = messages.filter((m) => m.status === 'sent').length;
  const activePots = pots.filter((p) => p.status !== 'closed').length;
  const myPets = useMyPets();

  // Planifie les rappels anniversaire pour les animaux (build natif uniquement)
  useEffect(() => {
    if (Constants.appOwnership === 'expo') return; // pas disponible dans Expo Go
    const petsWithBirthday = myPets.filter((p) => !!p.birthday);
    if (petsWithBirthday.length === 0) return;
    schedulePetBirthdayReminders(petsWithBirthday).catch(() => {});
  }, [myPets.map((p) => p.id + p.birthday).join(',')]);

  const handleSignOut = () => {
    Alert.alert(t('profile.signOutTitle'), t('profile.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.signOutBtn'), style: 'destructive', onPress: signOut },
    ]);
  };

  const handleShareReferral = () => {
    if (!profile?.referral_code) return;
    Share.share({
      message: t('profile.referral.message', { code: profile.referral_code })
        + `\nhttps://confettis-cake.app/invite/${profile.referral_code}`,
    });
  };

  const handleSaveProfile = async () => {
    const missing: string[] = [];
    if (!editLastName.trim())  missing.push('• Nom de famille');
    if (!editFirstName.trim()) missing.push('• Prénom');
    if (!editCivilite)         missing.push('• Civilité (M. ou Mme)');
    if (!editBirthday)         missing.push('• Date de naissance');
    if (missing.length > 0) {
      Alert.alert(
        'Champs obligatoires manquants',
        'L\'enregistrement n\'est pas possible tant que les champs suivants ne sont pas renseignés :\n\n' + missing.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }
    try {
      const fullName = [editFirstName.trim(), editLastName.trim()].filter(Boolean).join(' ');
      const birthdayStr = `${editBirthday!.getFullYear()}-${String(editBirthday!.getMonth() + 1).padStart(2,'0')}-${String(editBirthday!.getDate()).padStart(2,'0')}`;
      await updateProfile({ full_name: fullName, birthday: birthdayStr, civilite: editCivilite });
      setShowEditProfile(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      Alert.alert('Erreur de sauvegarde', msg);
    }
  };

  const formatFirstName = (raw: string) =>
    raw.split(/(-| )/).map((p) =>
      p === '-' || p === ' ' ? p : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    ).join('');

  const formatLastName = (raw: string) => raw.toUpperCase();

  const handleSelectLanguage = async (code: AppLanguage) => {
    await i18n.changeLanguage(code);
    await updateProfile({ language: code });
    setShowLangPicker(false);
  };

  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={styles.scroll}>

        {/* ── Hero profil ───────────────────────────── */}
        <LinearGradient
          colors={isPremium ? ['#fdd34d', '#c97d10'] : ['#9b6bb5', '#7a4d99']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', top: 14, left: 16 }} activeOpacity={0.75}>
            <Text style={{ fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 15, color: 'rgba(255,255,255,0.9)' }}>‹ Retour</Text>
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.heroName}>{profile?.full_name ?? t('profile.user')}</Text>
          {user?.email ? (
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{user.email}</Text>
          ) : null}
          <Text style={styles.heroSelfie}>C'est moi ! 🙋‍♂️✨😎</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>
              {isPremium ? t('profile.premium') : t('profile.free')}
            </Text>
          </View>
          {profile?.credits != null && profile.credits > 0 && (
            <Text style={styles.heroCredits}>{t('profile.credits', { count: profile.credits })}</Text>
          )}
        </LinearGradient>

        {/* ── Stats ────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard value={messages.length} label={t('profile.stats.messages')} emoji="💬" />
          <StatCard value={sentMessages} label={t('profile.stats.sent')} emoji="📤" />
          <StatCard value={contacts.length} label={t('profile.stats.contacts')} emoji="👥" />
          <StatCard value={activePots} label={t('profile.stats.pots')} emoji="🎁" />
        </View>

        {/* ── Upgrade banner (si free) ─────────────── */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/(app)/profile/premium' as never)}
            activeOpacity={0.85}
          >
            <View style={styles.upgradeBannerLeft}>
              <Text style={styles.upgradeBannerTitle}>{t('profile.upgrade.title')}</Text>
              <Text style={styles.upgradeBannerSub}>{t('profile.upgrade.sub')}</Text>
            </View>
            <Text style={styles.upgradeBannerArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* ── Parrainage ───────────────────────────── */}
        {profile?.referral_code && (
          <View style={styles.referralCard}>
            <View style={styles.referralLeft}>
              <Text style={styles.referralTitle}>🎁 {t('profile.referral.title')}</Text>
              <Text style={styles.referralCode}>{profile.referral_code}</Text>
            </View>
            <View style={styles.referralActions}>
              <TouchableOpacity style={styles.referralShareBtn} onPress={handleShareReferral}>
                <Text style={styles.referralShareBtnText}>{t('profile.referral.share')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.referralInfoBtn}
                onPress={() => router.push('/(app)/referral' as never)}
                activeOpacity={0.7}
              >
                <Text style={styles.referralInfoBtnText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Ma famille ───────────────────────────── */}
        {(() => {
          const familyContacts = contacts.filter((c) => c.relation === 'family' || c.relation === 'partner');
          if (familyContacts.length === 0) return null;
          return (
            <>
              <Text style={styles.sectionTitle}>👨‍👩‍👧 Ma famille</Text>
              <View style={{ backgroundColor: Colors.white, borderRadius: Radii.xl, padding: Spacing[4], gap: 8, ...Shadows.sm }}>
                {familyContacts.map((contact) => {
                  const linkMatch = contact.notes?.match(/^Lien\s*:\s*(.+?)(\n|$)/);
                  const link = linkMatch ? linkMatch[1].trim() : contact.relation === 'partner' ? 'Partenaire' : 'Famille';
                  const nameParts = contact.name.trim().split(' ');
                  const displayName = nameParts.length > 1
                    ? `${nameParts.slice(1).join(' ')} ${nameParts[0]}`
                    : nameParts[0];
                  return (
                    <TouchableOpacity
                      key={contact.id}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.primaryContainer + '40', borderRadius: Radii.lg, padding: Spacing[3] }}
                      onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: contact.id } } as never)}
                      activeOpacity={0.8}
                    >
                      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 22 }}>{contact.relation === 'partner' ? '💑' : '👨‍👩‍👧'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface }}>{displayName}</Text>
                        <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, textTransform: 'capitalize' }}>{link}</Text>
                      </View>
                      <TouchableOpacity
                        style={{ backgroundColor: C.primary, borderRadius: Radii.full, paddingVertical: 6, paddingHorizontal: 12 }}
                        onPress={() => router.push({ pathname: '/(app)/create', params: { contactId: contact.id } } as never)}
                        activeOpacity={0.8}
                      >
                        <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.xs, color: Colors.white }}>✉ Écrire</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          );
        })()}

        {/* ── Mes animaux ──────────────────────────── */}
        <Text style={styles.sectionTitle}>🐾 Mes animaux</Text>
        <View style={{ backgroundColor: Colors.white, borderRadius: Radii.xl, padding: Spacing[4], gap: 10, ...Shadows.sm }}>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 }}>
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: C.onSurface }}>{'Ton chien a des choses à dire.\nTon chat aussi — même s\'il fait semblant que non. 🐾\n\n'}</Text>
            {'Ajoute tes animaux ici et laisse l\'IA parler en leur nom pour les occasions de tes contacts. Anniversaire, fête... '}
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: C.onSurface }}>C'est complètement dingue. C'est complètement génial.</Text>
            {'\n\n'}
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: C.primary }}>Comment ça marche ?</Text>
            {'\n→ Va sur la fiche d\'un contact\n→ Appuie sur '}
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', color: '#92400E' }}>"🐾 Un de mes animaux lui écrit"</Text>
            {'\n→ Choisis ton animal\n→ L\'IA rédige le message comme si c\'était LUI qui l\'avait écrit 🤣'}
          </Text>
          {myPets.map((pet) => {
            const petEmoji = ({ chien: '🐶', chat: '🐱', lapin: '🐰', oiseau: '🐦', cheval: '🐴', hamster: '🐹', perroquet: '🦜', cochon_d_inde: '🐾', souris: '🐭', poisson: '🐠', tortue: '🐢' } as Record<string, string>)[pet.pet_type ?? ''] ?? '🐾';
            return (
              <TouchableOpacity
                key={pet.id}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.primaryContainer + '40', borderRadius: Radii.lg, padding: Spacing[3] }}
                onPress={() => router.push({ pathname: '/(app)/contact/[id]', params: { id: pet.id } } as never)}
                activeOpacity={0.8}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryContainer, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 22 }}>{petEmoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface }}>{pet.name}</Text>
                  {pet.pet_type && <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant }}>{pet.pet_type}</Text>}
                </View>
                <Text style={{ color: C.primary, fontSize: 20 }}>›</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={{ borderWidth: 1.5, borderColor: C.primary, borderRadius: Radii.full, paddingVertical: 11, alignItems: 'center' }}
            onPress={() => router.push({ pathname: '/(app)/animaux/new', params: { myPet: '1' } } as never)}
            activeOpacity={0.85}
          >
            <Text style={{ fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: C.primary }}>
              🐾 {myPets.length === 0 ? 'Ajouter mon animal' : 'Ajouter un autre animal'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Thème couleur ────────────────────────── */}
        <Text style={styles.sectionTitle}>Couleur de l'appli</Text>
        <View style={styles.themeHint}>
          <Text style={styles.themeHintEmoji}>🎨</Text>
          <Text style={styles.themeHintText}>Choisis l'ambiance qui te ressemble — le changement est immédiat sur toute l'appli !</Text>
        </View>
        <View style={styles.settingsCard}>
          <View style={styles.themeGrid}>
            {APP_THEMES.map((t) => {
              const active = appTheme.id === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.themeSwatch, active && styles.themeSwatchActive]}
                  onPress={() => setTheme(t.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.themeCircle, { backgroundColor: t.primary }]}>
                    {active && <Text style={styles.themeCheck}>✓</Text>}
                  </View>
                  <Text style={[styles.themeLabel, active && { color: t.primary }]}>{t.emoji} {t.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Langue ───────────────────────────────── */}
        <Text style={styles.sectionTitle}>Choisis ta langue</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.langRow} onPress={() => setShowLangPicker(true)} activeOpacity={0.7}>
            <Text style={styles.langFlag}>{currentLang.flag}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.langLabel}>{currentLang.label}</Text>
              <Text style={styles.langSub}>{t('profile.language.subtitle')}</Text>
            </View>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── Notifications ────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('profile.sections.notifications')}</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            emoji="🎁" label={t('profile.notifications.birthdays')}
            isToggle toggled={notifsBirthday} onToggle={handleToggleBirthday}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="🌸" label={t('profile.notifications.nameDays')}
            isToggle toggled={notifsNameday} onToggle={handleToggleNameday}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="🎁" label={t('profile.notifications.pots')}
            isToggle toggled={notifsPot} onToggle={handleTogglePot}
          />
        </View>

        {/* ── Mon compte ───────────────────────────── */}
        <Text style={styles.sectionTitle}>{t('profile.sections.account')}</Text>
        <View style={styles.settingsCard}>
          <SettingRow
            emoji="✏️" label={t('profile.account.editProfile')}
            onPress={() => {
              const parts = (profile?.full_name ?? '').split(' ');
              setEditFirstName(parts[0] ?? '');
              setEditLastName(parts.slice(1).join(' ') ?? '');
              // Pré-remplir le birthday
              if (profile?.birthday) {
                const [y, m, d] = profile.birthday.split('-');
                const year = y === '0000' ? 1985 : parseInt(y, 10);
                setEditBirthday(new Date(year, parseInt(m, 10) - 1, parseInt(d, 10)));
              } else {
                setEditBirthday(null);
              }
              setEditCivilite(profile?.civilite ?? null);
              setShowEditProfile(true);
            }} value=""
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="🎁" label={t('profile.account.myPots')}
            onPress={() => router.push('/(app)/pot/' as never)}
          />
          <View style={styles.rowDivider} />
          {isPremium && (
            <>
              <SettingRow
                emoji="⭐" label={t('profile.account.manageSubscription')}
                onPress={() => router.push('/(app)/profile/premium' as never)}
              />
              <View style={styles.rowDivider} />
              <SettingRow
                emoji="✍️"
                label="Signature Confettis & Cake"
                isToggle
                toggled={showSignature}
                onToggle={handleToggleSignature}
              />
              <View style={styles.rowDivider} />
            </>
          )}
          <SettingRow
            emoji="🔒" label={t('profile.account.privacy')}
            onPress={() => {}}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            emoji="❓" label={t('profile.account.help')}
            onPress={() => {}}
          />
        </View>

        {/* ── Déconnexion ──────────────────────────── */}
        <View style={styles.settingsCard}>
          <SettingRow
            emoji="🚪" label={t('profile.signOut')}
            onPress={handleSignOut}
            destructive
          />
        </View>

        <Text style={styles.version}>{t('profile.version')}</Text>

        {/* ── Modal édition profil ─────────────────── */}
        <Modal
          visible={showEditProfile}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEditProfile(false)}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowEditProfile(false)}
            >
              <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>Mon profil</Text>
                <Text style={styles.modalSub}>Ta civilité, ton prénom et ton nom apparaîtront dans l'appli.</Text>

                <Text style={styles.editLabel}>Civilité *</Text>
                <View style={styles.civiliteRow}>
                  {(['M.', 'Mme'] as const).map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[styles.civiliteBtn, editCivilite === val && styles.civiliteBtnActive]}
                      onPress={() => setEditCivilite(val)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.civiliteBtnText, editCivilite === val && styles.civiliteBtnTextActive]}>
                        {val === 'M.' ? '👨 M.' : '👩 Mme'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.editLabel}>Prénom</Text>
                <TextInput
                  style={styles.editInput}
                  value={editFirstName}
                  onChangeText={(v) => setEditFirstName(formatFirstName(v))}
                  placeholder="Ton prénom"
                  placeholderTextColor={Colors.outlineVariant}
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <Text style={styles.editLabel}>Nom</Text>
                <TextInput
                  style={styles.editInput}
                  value={editLastName}
                  onChangeText={(v) => setEditLastName(formatLastName(v))}
                  placeholder="Ton nom de famille"
                  placeholderTextColor={Colors.outlineVariant}
                  autoCapitalize="none"
                  returnKeyType="next"
                />
                <Text style={styles.editLabel}>Ta date de naissance ✨</Text>
                <TouchableOpacity
                  style={styles.editInput}
                  onPress={() => setShowBirthdayPicker(true)}
                  activeOpacity={0.8}
                >
                  <Text style={editBirthday ? styles.editInputText : styles.editInputPlaceholder}>
                    {editBirthday
                      ? editBirthday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Sélectionner ta date de naissance'}
                  </Text>
                </TouchableOpacity>

                {/* Picker iOS — modal roue */}
                {showBirthdayPicker && Platform.OS === 'ios' && (
                  <Modal transparent animationType="slide" visible onRequestClose={() => setShowBirthdayPicker(false)}>
                    <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowBirthdayPicker(false)}>
                      <View style={styles.pickerSheet}>
                        <View style={styles.pickerHeader}>
                          <Text style={styles.pickerTitle}>Date de naissance</Text>
                          <TouchableOpacity onPress={() => setShowBirthdayPicker(false)}>
                            <Text style={styles.pickerOk}>OK ✓</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={editBirthday ?? new Date(1985, 0, 1)}
                          mode="date"
                          display="spinner"
                          minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                          maximumDate={new Date()}
                          textColor={Colors.primary}
                          accentColor={Colors.primary}
                          style={{ width: '100%', height: 215 }}
                          onChange={(_e: unknown, date?: Date) => { if (date) setEditBirthday(date); }}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                )}

                {/* Picker Android — natif */}
                {showBirthdayPicker && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={editBirthday ?? new Date(1985, 0, 1)}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                    maximumDate={new Date()}
                    onChange={(_e: unknown, date?: Date) => {
                      setShowBirthdayPicker(false);
                      if (date) setEditBirthday(date);
                    }}
                  />
                )}

                <Text style={styles.editHint}>
                  🔮 Permet de calculer ta compatibilité zodiacale avec tes contacts !
                </Text>
                <TouchableOpacity style={styles.editSaveBtn} onPress={handleSaveProfile}>
                  <Text style={styles.editSaveBtnText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>

        {/* ── Modal sélecteur de langue ────────────── */}
        <Modal
          visible={showLangPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLangPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLangPicker(false)}
          >
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>{t('profile.language.title')}</Text>
              <Text style={styles.modalSub}>{t('profile.language.subtitle')}</Text>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = lang.code === i18n.language;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.langOption, isActive && styles.langOptionActive]}
                    onPress={() => handleSelectLanguage(lang.code)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.langOptionFlag}>{lang.flag}</Text>
                    <Text style={[styles.langOptionLabel, isActive && styles.langOptionLabelActive]}>
                      {lang.label}
                    </Text>
                    {isActive && <Text style={styles.langOptionCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 16, paddingTop: 12 },

  hero: {
    padding: Spacing[6],
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['4xl'], color: Colors.white },
  heroName: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['3xl'], color: Colors.white },
  heroSelfie: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
    letterSpacing: 0.3,
    marginTop: -4,
  },
  planBadge: {
    paddingVertical: 4, paddingHorizontal: 14,
    borderRadius: Radii.full, backgroundColor: 'rgba(255,255,255,0.25)',
  },
  planBadgeText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
  heroCredits: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    gap: 10,
  },
  statCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radii.xl,
    paddingVertical: Spacing[3], alignItems: 'center', gap: 2, ...Shadows.sm,
  },
  statEmoji: { fontSize: 18 },
  statValue: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography['2xl'], color: C.primary },
  statLabel: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant },

  // Upgrade banner
  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing[4], marginBottom: Spacing[2],
    padding: Spacing[4], borderRadius: Radii.xl,
    backgroundColor: C.primary, ...Shadows.md,
  },
  upgradeBannerLeft: { flex: 1 },
  upgradeBannerTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.white },
  upgradeBannerSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  upgradeBannerArrow: { fontSize: 26, color: Colors.white },

  // Referral
  referralCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing[4], marginBottom: Spacing[2],
    paddingVertical: Spacing[3], paddingHorizontal: Spacing[4],
    borderRadius: Radii.xl,
    backgroundColor: Colors.secondaryContainer,
    borderWidth: 1, borderColor: Colors.secondaryFixed,
    gap: Spacing[3],
  },
  referralLeft: { flex: 1, gap: 2 },
  referralTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSecondaryContainer },
  referralCode: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.secondary, letterSpacing: 2 },
  referralActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  referralShareBtn: {
    paddingVertical: 7, paddingHorizontal: 14, borderRadius: Radii.full,
    backgroundColor: Colors.secondary,
  },
  referralShareBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.white },
  referralInfoBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  referralInfoBtnText: { fontSize: 18 },

  // Sections
  sectionTitle: {
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
    paddingLeft: 8,
    paddingVertical: 4,    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: C.primary,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
    marginLeft: Spacing[4],
    marginRight: Spacing[4],
  },
  settingsCard: {
    marginHorizontal: Spacing[4], marginBottom: Spacing[3],
    backgroundColor: Colors.white, borderRadius: Radii.xl, ...Shadows.sm,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: Spacing[4], gap: 14,
  },
  settingEmoji: { fontSize: 20, width: 28 },
  settingLabel: {
    flex: 1, fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md, color: Colors.onSurface,
  },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValue: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant },
  settingChevron: { fontSize: 22, color: Colors.outlineVariant },
  rowDivider: { height: 0.5, backgroundColor: Colors.surfaceContainer, marginLeft: 56 },

  version: {
    textAlign: 'center',
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.outlineVariant,
    marginTop: Spacing[4],
  },

  // Theme hint banner
  themeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[3],
    padding: Spacing[3],
    backgroundColor: C.primaryContainer + '60',
    borderRadius: Radii.lg,
    borderWidth: 0.5,
    borderColor: C.primaryContainer,
  },
  themeHintEmoji: { fontSize: 22 },
  themeHintText: {
    flex: 1,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onPrimaryContainer,
    lineHeight: 18,
  },

  // Theme selector
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing[4],
    gap: 12,
  },
  themeSwatch: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    width: SWATCH_W,
    minHeight: 58,
  },
  themeSwatchActive: {},
  themeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCheck: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  themeLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Language selector
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
    gap: 14,
  },
  langFlag: { fontSize: 24, width: 28 },
  langLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
  },
  langSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },

  civiliteRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  civiliteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.primaryContainer,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  civiliteBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  civiliteBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  civiliteBtnTextActive: { color: C.primary },

  editLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.md,
    color: Colors.onSurface,
    marginBottom: 4,
    marginTop: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: C.primaryContainer,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
    marginBottom: 12,
    marginTop: 4,
  },
  editInputText: {
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.onSurface,
  },
  editInputPlaceholder: {
    fontSize: Typography.md,
    fontFamily: 'BeVietnamPro_400Regular',
    color: Colors.outlineVariant,
  },
  pickerOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: 24,
  },
  pickerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing[5], paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest,
  },
  pickerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md, color: Colors.onSurface,
  },
  pickerOk: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: Typography.md, color: C.primary,
  },
  editHint: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: -8,
    marginBottom: 16,
    lineHeight: 16,
  },
  editSaveBtn: {
    backgroundColor: C.primary,
    borderRadius: Radii.full,
    paddingVertical: 13,
    alignItems: 'center',
  },
  editSaveBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    paddingBottom: 40,
    gap: 6,
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurfaceVariant,
    marginBottom: 12,
    lineHeight: 21,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: Spacing[4],
    borderRadius: Radii.xl,
    backgroundColor: Colors.background,
    marginBottom: 4,
  },
  langOptionActive: {
    backgroundColor: C.primaryContainer,
  },
  langOptionFlag: { fontSize: 24 },
  langOptionLabel: {
    flex: 1,
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  langOptionLabelActive: { color: C.primary },
  langOptionCheck: {
    fontSize: Typography.lg,
    color: C.primary,
    fontFamily: 'BeVietnamPro_700Bold',
  },
  });
}
