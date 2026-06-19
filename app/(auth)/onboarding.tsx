import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/authStore';
import { useUIStore } from '../../src/stores/uiStore';
import { applyReferralCode } from '../../src/services/referral.service';
import { createContact } from '../../src/services/contacts.service';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';

type OnboardingStep = 'auth' | 'profile' | 'notifs' | 'firstContact';
type TFunc = (key: string, opts?: Record<string, unknown>) => string;

// ── Help Modal ────────────────────────────────────────────────────────────────

function HelpModal({ visible, onClose, title, body, t }: {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string;
  t: TFunc;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={helpStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={helpStyles.card}>
          <Text style={helpStyles.title}>{title}</Text>
          <Text style={helpStyles.body}>{body}</Text>
          <TouchableOpacity style={helpStyles.btn} onPress={onClose} activeOpacity={0.8}>
            <Text style={helpStyles.btnText}>{t('auth.understood')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const helpStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 28,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  title: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.lg, color: Colors.onSurface },
  body: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, lineHeight: 22 },
  btn: { backgroundColor: Colors.primary, borderRadius: Radii.full, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.base, color: '#fff' },
});

// ── Help Button ───────────────────────────────────────────────────────────────

function HelpBtn({ onPress, light }: { onPress: () => void; light?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.helpBtn, light && styles.helpBtnLight]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <Text style={[styles.helpBtnText, light && styles.helpBtnTextLight]}>ℹ️</Text>
    </TouchableOpacity>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────

function AuthScreen({ onSignupSuccess, onLoginSuccess, onHelp, t }: {
  onSignupSuccess: () => void;
  onLoginSuccess: () => void;
  onHelp: () => void;
  t: TFunc;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { signUpWithPassword, signInWithPassword, resetPassword, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) { showToast(t('auth.invalidEmail'), 'error'); return; }
    if (password.length < 6) { showToast(t('auth.passwordMin'), 'error'); return; }
    try {
      if (isSignUp) {
        await signUpWithPassword(email.trim(), password);
        const user = useAuthStore.getState().user;
        if (referralCode.trim() && user) {
          await applyReferralCode(referralCode.trim(), user.id, email.trim()).catch(() => {});
          await useAuthStore.getState().fetchProfile();
        }
        onSignupSuccess();
      } else {
        await signInWithPassword(email.trim(), password);
        showToast(`${t('auth.greetingBack')} 👋`, 'success');
        onLoginSuccess();
      }
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        showToast(t('auth.emailAlreadyUsed'), 'error'); setIsSignUp(false);
      } else if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        showToast(t('errors.signInError'), 'error');
      } else {
        showToast(t('errors.generic'), 'error');
      }
    }
  };

  const handleGoogle = async () => {
    try { await signInWithGoogle(); }
    catch { showToast(t('auth.googleFailed'), 'error'); }
  };

  const handleApple = async () => {
    try { await signInWithApple(); }
    catch { showToast(t('auth.appleFailed'), 'error'); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.authScroll]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepHelpRow}>
          <HelpBtn onPress={onHelp} />
        </View>

        <Text style={[styles.title, { color: Colors.primary, fontStyle: 'italic', fontSize: Typography['3xl'], textAlign: 'center' }]}>
          Confettis & Cake
        </Text>
        <Text style={[styles.title, { fontSize: Typography['2xl'], marginTop: 4, textAlign: 'center' }]}>
          {isSignUp ? t('auth.letsStart') : t('auth.greetingBack')}
        </Text>
        <Text style={[styles.subtitle, { marginTop: 6, marginBottom: 24, textAlign: 'center' }]}>
          {isSignUp ? t('auth.signUpSubtitle') : t('auth.signInSubtitle')}
        </Text>

        <TouchableOpacity style={styles.socialBtn} onPress={handleGoogle} activeOpacity={0.8}>
          <Text style={{ fontSize: 18 }}>G</Text>
          <Text style={styles.socialBtnText}>{t('auth.continueWithGoogle')}</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#302e34', borderColor: '#302e34' }]} onPress={handleApple} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, color: '#fff' }}>🍎</Text>
            <Text style={[styles.socialBtnText, { color: '#fff' }]}>{t('auth.continueWithApple')}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.orByEmail')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          style={styles.emailInput}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.emailPlaceholder')}
          placeholderTextColor={Colors.outlineVariant}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ width: '100%', marginBottom: 10 }}>
          <TextInput
            style={[styles.emailInput, { marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.passwordPlaceholder')}
            placeholderTextColor={Colors.outlineVariant}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ fontSize: 12, color: Colors.onSurfaceVariant, fontFamily: 'BeVietnamPro_500Medium' }}>
              {showPassword ? t('auth.hide') : t('auth.show')}
            </Text>
          </TouchableOpacity>
        </View>

        {isSignUp && (
          <>
            <TextInput
              style={styles.emailInput}
              value={referralCode}
              onChangeText={(v) => setReferralCode(v.toUpperCase())}
              placeholder={t('auth.referralPlaceholder')}
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.referralHint}>{t('auth.referralHint')}</Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.emailBtn, isLoading && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.emailBtnText}>
            {isSignUp ? t('auth.createFreeAccount') : `${t('auth.signIn')} →`}
          </Text>
        </TouchableOpacity>

        {!isSignUp && (
          <TouchableOpacity
            style={{ marginTop: 8, alignSelf: 'center' }}
            onPress={async () => {
              if (!email.trim() || !email.includes('@')) { showToast(t('auth.enterEmailFirst'), 'error'); return; }
              try { await resetPassword(email.trim()); showToast(t('auth.resetSent'), 'success'); }
              catch { showToast(t('auth.resetError'), 'error'); }
            }}
          >
            <Text style={[styles.loginLink, { color: Colors.primary }]}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 12, alignSelf: 'center' }}>
          <Text style={styles.loginLink}>
            {isSignUp
              ? <>{t('auth.alreadyAccount').split('?')[0]} ?{'  '}<Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>{t('auth.signIn')}</Text></>
              : <>{t('auth.noAccountQuestion')}{'  '}<Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>{t('auth.createAccountLink')}</Text></>
            }
          </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Profile Step ──────────────────────────────────────────────────────────────

function ProfileStep({ onNext, onHelp, t }: { onNext: (firstName: string) => void; onHelp: () => void; t: TFunc }) {
  const [civilite, setCivilite] = useState<'M.' | 'Mme' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const { updateProfile, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const handleNext = async () => {
    if (!civilite) { showToast(t('auth.civiliteRequired'), 'error'); return; }
    if (!firstName.trim()) { showToast(t('auth.firstNameRequired'), 'error'); return; }
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const birthdayStr = birthday ? format(birthday, 'yyyy-MM-dd') : null;
      await updateProfile({ full_name: fullName, civilite, ...(birthdayStr ? { birthday: birthdayStr } : {}) });
      onNext(firstName.trim());
    } catch {
      showToast(t('auth.saveError'), 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHelpRow}><HelpBtn onPress={onHelp} /></View>

        <Text style={styles.stepEmoji}>👋</Text>
        <Text style={styles.stepTitle}>{t('auth.welcomeTitle')}</Text>
        <Text style={styles.stepSubtitle}>{t('auth.welcomeSubtitle')}</Text>

        <Text style={styles.civiliteLabel}>{t('auth.civilite')}</Text>
        <View style={styles.civiliteRow}>
          <TouchableOpacity style={[styles.civiliteBtn, civilite === 'M.' && styles.civiliteBtnActive]} onPress={() => setCivilite('M.')} activeOpacity={0.8}>
            <Text style={[styles.civiliteBtnText, civilite === 'M.' && styles.civiliteBtnTextActive]}>👨 M.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.civiliteBtn, civilite === 'Mme' && styles.civiliteBtnActive]} onPress={() => setCivilite('Mme')} activeOpacity={0.8}>
            <Text style={[styles.civiliteBtnText, civilite === 'Mme' && styles.civiliteBtnTextActive]}>👩 Mme</Text>
          </TouchableOpacity>
        </View>

        <TextInput style={styles.emailInput} value={firstName} onChangeText={setFirstName} placeholder={t('auth.firstNamePlaceholder')} placeholderTextColor={Colors.outlineVariant} autoCapitalize="words" autoCorrect={false} />
        <TextInput style={styles.emailInput} value={lastName} onChangeText={setLastName} placeholder={t('auth.lastNamePlaceholder')} placeholderTextColor={Colors.outlineVariant} autoCapitalize="words" autoCorrect={false} />

        <TouchableOpacity style={[styles.emailInput, { justifyContent: 'center' }]} onPress={() => setShowPicker(true)} activeOpacity={0.8}>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: birthday ? Colors.onSurface : Colors.outlineVariant }}>
            {birthday ? `🎂 ${format(birthday, 'dd/MM/yyyy')}` : t('auth.birthdayPlaceholder')}
          </Text>
        </TouchableOpacity>

        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker value={birthday ?? new Date(1990, 0, 1)} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()} onChange={(_, d) => { setShowPicker(false); if (d) setBirthday(d); }} />
        )}

        <TouchableOpacity style={[styles.emailBtn, { marginTop: 8 }, isLoading && { opacity: 0.5 }]} onPress={handleNext} disabled={isLoading} activeOpacity={0.85}>
          <Text style={styles.emailBtnText}>{t('auth.continue')}</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Notifications Step ────────────────────────────────────────────────────────

function NotifsStep({ firstName, onNext, onSkip, onHelp, t }: {
  firstName: string; onNext: () => void; onSkip: () => void; onHelp: () => void; t: TFunc;
}) {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    try { await Notifications.requestPermissionsAsync(); }
    finally { setLoading(false); onNext(); }
  };

  const benefits = [
    { e: '🎂', tKey: 'auth.notifBirthdays', subKey: 'auth.notifBirthdaysSub' },
    { e: '🌸', tKey: 'auth.notifNamedays', subKey: 'auth.notifNamedaysSub' },
    { e: '⏰', tKey: 'auth.notifCustom', subKey: 'auth.notifCustomSub' },
  ];

  return (
    <View style={[styles.stepScroll, { alignItems: 'center' }]}>
      <View style={styles.stepHelpRow}><HelpBtn onPress={onHelp} /></View>

      <Text style={[styles.stepEmoji, { fontSize: 56 }]}>🔔</Text>
      <Text style={[styles.stepTitle, { textAlign: 'center' }]}>{t('auth.notifsTitle', { name: firstName })}</Text>
      <Text style={[styles.stepSubtitle, { textAlign: 'center', marginBottom: 28 }]}>{t('auth.notifsSubtitle')}</Text>

      <View style={{ gap: 10, width: '100%', marginBottom: 24 }}>
        {benefits.map((b) => (
          <View key={b.tKey} style={styles.notifBenefit}>
            <Text style={{ fontSize: 22, width: 32 }}>{b.e}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifBenefitTitle}>{t(b.tKey)}</Text>
              <Text style={styles.notifBenefitSub}>{t(b.subKey)}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.emailBtn, loading && { opacity: 0.5 }]} onPress={handleAllow} disabled={loading} activeOpacity={0.85}>
        <Text style={styles.emailBtnText}>{t('auth.enableNotifs')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSkip} style={{ marginTop: 10, alignSelf: 'center' }}>
        <Text style={styles.skipText}>{t('auth.notNow')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── First Contact Step ────────────────────────────────────────────────────────

function FirstContactStep({ onNext, onSkip, onHelp, t }: {
  onNext: () => void; onSkip: () => void; onHelp: () => void; t: TFunc;
}) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const RELATIONS = [
    { id: 'family',      label: t('contacts.relations.family'),      emoji: '👨‍👩‍👧' },
    { id: 'best_friend', label: t('contacts.relations.best_friend'), emoji: '🤝' },
    { id: 'friend',      label: t('contacts.relations.friend'),      emoji: '😊' },
    { id: 'partner',     label: t('contacts.relations.partner'),     emoji: '💑' },
  ] as const;
  const [relation, setRelation] = useState<typeof RELATIONS[number]['id']>('family');

  const handleAdd = async () => {
    if (!name.trim()) { showToast(t('auth.enterNameFirst'), 'error'); return; }
    if (!user) { onNext(); return; }
    setLoading(true);
    try {
      await createContact(user.id, {
        name: name.trim(),
        birthday: birthday ? format(birthday, 'yyyy-MM-dd') : null,
        relation,
        phone: null, email: null, notes: null, avatar_url: null,
        imported_from: 'manual', personality_tags: [],
        preferred_channel: null, preferred_send_time: null,
        pet_owner_name: null, pet_type: null, preferred_language: null,
        name_day: null, favourite_color: null, pet_gender: null,
        pet_owner_contact_id: null, breed: null,
      });
      showToast(`${name.trim()} 🎉`, 'success');
      onNext();
    } catch {
      showToast(t('auth.addError'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHelpRow}><HelpBtn onPress={onHelp} /></View>

        <Text style={styles.stepEmoji}>🎁</Text>
        <Text style={styles.stepTitle}>{t('auth.firstContactTitle')}</Text>
        <Text style={styles.stepSubtitle}>{t('auth.firstContactSubtitle')}</Text>

        <TextInput style={styles.emailInput} value={name} onChangeText={setName} placeholder={t('auth.firstContactNamePlaceholder')} placeholderTextColor={Colors.outlineVariant} autoCapitalize="words" autoCorrect={false} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {RELATIONS.map((r) => (
            <TouchableOpacity key={r.id} style={[styles.relationChip, relation === r.id && styles.relationChipSelected]} onPress={() => setRelation(r.id)} activeOpacity={0.8}>
              <Text style={{ fontSize: 14 }}>{r.emoji}</Text>
              <Text style={[styles.relationChipText, relation === r.id && { color: Colors.primary }]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.emailInput, { justifyContent: 'center' }]} onPress={() => setShowPicker(true)} activeOpacity={0.8}>
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: birthday ? Colors.onSurface : Colors.outlineVariant }}>
            {birthday ? `🎂 ${format(birthday, 'dd/MM/yyyy')}` : t('auth.contactBirthdayPlaceholder')}
          </Text>
        </TouchableOpacity>

        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker value={birthday ?? new Date(1990, 0, 1)} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()} onChange={(_, d) => { setShowPicker(false); if (d) setBirthday(d); }} />
        )}

        <TouchableOpacity style={[styles.emailBtn, { marginTop: 8 }, loading && { opacity: 0.5 }]} onPress={handleAdd} disabled={loading} activeOpacity={0.85}>
          <Text style={styles.emailBtnText}>{t('auth.addAndStart')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkip} style={{ marginTop: 10, alignSelf: 'center' }}>
          <Text style={styles.skipText}>{t('auth.skipForNow')}</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [step, setStep] = useState<OnboardingStep>('auth');
  const [firstName, setFirstName] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);
  const router = useRouter();

  const HELP_CONTENT: Record<string, { title: string; body: string }> = {
    auth: {
      title: t('auth.helpAuthTitle'),
      body: t('auth.helpAuthBody'),
    },
    profile: {
      title: t('auth.helpProfileTitle'),
      body: t('auth.helpProfileBody'),
    },
    notifs: {
      title: t('auth.helpNotifsTitle'),
      body: t('auth.helpNotifsBody'),
    },
    firstContact: {
      title: t('auth.helpFirstContactTitle'),
      body: t('auth.helpFirstContactBody'),
    },
  };

  const STEPS: OnboardingStep[] = ['auth', 'profile', 'notifs', 'firstContact'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        title={HELP_CONTENT[step]?.title ?? ''}
        body={HELP_CONTENT[step]?.body ?? ''}
        t={t}
      />

      <View style={styles.stepDotsRow}>
        {STEPS.map((s) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              s === step
                ? { backgroundColor: Colors.primary, width: 24 }
                : STEPS.indexOf(s) < STEPS.indexOf(step)
                  ? { backgroundColor: Colors.primary, opacity: 0.4 }
                  : { backgroundColor: Colors.outlineVariant },
            ]}
          />
        ))}
      </View>

      {step === 'auth' && (
        <AuthScreen
          onSignupSuccess={() => setStep('profile')}
          onLoginSuccess={() => router.replace('/(app)')}
          onHelp={() => setHelpVisible(true)}
          t={t}
        />
      )}
      {step === 'profile' && (
        <ProfileStep
          onNext={(name) => { setFirstName(name); setStep('notifs'); }}
          onHelp={() => setHelpVisible(true)}
          t={t}
        />
      )}
      {step === 'notifs' && (
        <ScrollView contentContainerStyle={[styles.stepScroll, { paddingHorizontal: Spacing[6] }]} showsVerticalScrollIndicator={false}>
          <NotifsStep
            firstName={firstName}
            onNext={() => setStep('firstContact')}
            onSkip={() => setStep('firstContact')}
            onHelp={() => setHelpVisible(true)}
            t={t}
          />
        </ScrollView>
      )}
      {step === 'firstContact' && (
        <FirstContactStep
          onNext={() => router.replace('/(app)')}
          onSkip={() => router.replace('/(app)')}
          onHelp={() => setHelpVisible(true)}
          t={t}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, textAlign: 'center', lineHeight: 34 },
  subtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22, maxWidth: 320 },
  authScroll: { paddingHorizontal: Spacing[6], paddingTop: 16, paddingBottom: 24 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    width: '100%', paddingVertical: 13, borderRadius: Radii.full, borderWidth: 1.5,
    borderColor: Colors.primaryContainer, backgroundColor: Colors.white, marginBottom: 10,
  },
  socialBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', marginVertical: 14 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: Colors.primaryContainer },
  dividerText: { fontSize: 12, color: Colors.outlineVariant, fontFamily: 'BeVietnamPro_600SemiBold' },
  emailInput: {
    width: '100%', backgroundColor: Colors.surfaceContainerLow, borderWidth: 0.5,
    borderColor: Colors.primaryContainer, borderRadius: 12, padding: 12, paddingHorizontal: 14,
    fontSize: Typography.base, color: Colors.onSurface, fontFamily: 'BeVietnamPro_400Regular', marginBottom: 10,
  },
  referralHint: {
    width: '100%', fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant, lineHeight: 17, marginTop: -4, marginBottom: 10, paddingHorizontal: 2,
  },
  emailBtn: { width: '100%', paddingVertical: 13, borderRadius: Radii.full, backgroundColor: Colors.primary, alignItems: 'center' },
  emailBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.base, color: Colors.white },
  loginLink: { fontSize: 13, color: Colors.onSurfaceVariant, fontFamily: 'BeVietnamPro_400Regular' },
  stepScroll: { paddingHorizontal: Spacing[6], paddingTop: 8, paddingBottom: 24, flexGrow: 1 },
  stepHelpRow: { alignItems: 'flex-end', marginBottom: 8 },
  stepEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  stepTitle: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface, textAlign: 'center', lineHeight: 32, marginBottom: 10 },
  stepSubtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  civiliteLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface, marginBottom: 8, alignSelf: 'flex-start' },
  civiliteRow: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 },
  civiliteBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.primaryContainer, backgroundColor: Colors.white, alignItems: 'center' },
  civiliteBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer },
  civiliteBtnText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.base, color: Colors.onSurfaceVariant },
  civiliteBtnTextActive: { color: Colors.primary },
  genderCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: Colors.primaryContainer },
  genderCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer },
  genderLabel: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.base, color: Colors.onSurface },
  genderSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },
  genderCheck: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  notifBenefit: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: Colors.primaryContainer },
  notifBenefitTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface },
  notifBenefitSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },
  relationChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 12, borderRadius: Radii.full, borderWidth: 1.5, borderColor: Colors.primaryContainer, backgroundColor: Colors.white },
  relationChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryContainer },
  relationChipText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.xs, color: Colors.onSurfaceVariant },
  helpBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceContainerLow, borderWidth: 1, borderColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  helpBtnLight: { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.4)' },
  helpBtnText: { fontSize: 14 },
  helpBtnTextLight: {},
  stepDotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingVertical: 10, paddingHorizontal: Spacing[6] },
  stepDot: { height: 5, width: 6, borderRadius: Radii.full, backgroundColor: Colors.outlineVariant },
  skipText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
});
