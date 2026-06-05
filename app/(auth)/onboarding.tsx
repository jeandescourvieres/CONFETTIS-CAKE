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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useAuthStore } from '../../src/stores/authStore';
import { useUIStore } from '../../src/stores/uiStore';
import { applyReferralCode } from '../../src/services/referral.service';
import { createContact } from '../../src/services/contacts.service';
import { Colors, Typography, Spacing, Radii } from '../../src/constants/theme';


type OnboardingStep = 'auth' | 'profile' | 'notifs' | 'firstContact';

// ── Help Modal ────────────────────────────────────────────────────────────────

function HelpModal({ visible, onClose, title, body }: {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={helpStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={helpStyles.card}>
          <Text style={helpStyles.title}>{title}</Text>
          <Text style={helpStyles.body}>{body}</Text>
          <TouchableOpacity style={helpStyles.btn} onPress={onClose} activeOpacity={0.8}>
            <Text style={helpStyles.btnText}>OK, j'ai compris !</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const helpStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    color: Colors.onSurface,
  },
  body: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: '#fff',
  },
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

function AuthScreen({
  onSignupSuccess,
  onLoginSuccess,
  onHelp,
}: {
  onSignupSuccess: () => void;
  onLoginSuccess: () => void;
  onHelp: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const { signUpWithPassword, signInWithPassword, resetPassword, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) { showToast('Adresse email invalide', 'error'); return; }
    if (password.length < 6) { showToast('Mot de passe : 6 caractères minimum', 'error'); return; }
    try {
      if (isSignUp) {
        await signUpWithPassword(email.trim(), password);
        // Appliquer code parrainage si renseigné
        const user = useAuthStore.getState().user;
        if (referralCode.trim() && user) {
          await applyReferralCode(referralCode.trim(), user.id, email.trim()).catch(() => {});
          await useAuthStore.getState().fetchProfile();
        }
        onSignupSuccess();
      } else {
        await signInWithPassword(email.trim(), password);
        showToast('Bon retour ! 👋', 'success');
        onLoginSuccess();
      }
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg.includes('already registered') || msg.includes('already exists')) {
        showToast('Email déjà utilisé. Connecte-toi.', 'error'); setIsSignUp(false);
      } else if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        showToast('Email ou mot de passe incorrect.', 'error');
      } else {
        showToast('Une erreur est survenue. Réessayez.', 'error');
      }
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      // Google auth redirige via deep link — la navigation se fait dans _layout
    } catch { showToast('Connexion Google échouée', 'error'); }
  };

  const handleApple = async () => {
    try { await signInWithApple(); } catch { showToast('Connexion Apple échouée', 'error'); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.authScroll]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Help button */}
        <View style={styles.stepHelpRow}>
          <HelpBtn onPress={onHelp} />
        </View>

        <Text style={[styles.title, { color: Colors.primary, fontStyle: 'italic', fontSize: Typography['3xl'], textAlign: 'center' }]}>
          Confettis & Cake
        </Text>
        <Text style={[styles.title, { fontSize: Typography['2xl'], marginTop: 4, textAlign: 'center' }]}>
          {isSignUp ? 'On commence ! 🎉' : 'Bon retour !'}
        </Text>
        <Text style={[styles.subtitle, { marginTop: 6, marginBottom: 24, textAlign: 'center' }]}>
          {isSignUp ? 'Crée ton compte gratuitement — aucune carte requise' : 'Connecte-toi à ton compte'}
        </Text>

        {/* Google */}
        <TouchableOpacity style={styles.socialBtn} onPress={handleGoogle} activeOpacity={0.8}>
          <Text style={{ fontSize: 18 }}>G</Text>
          <Text style={styles.socialBtnText}>Continuer avec Google</Text>
        </TouchableOpacity>

        {/* Apple (iOS only) */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#302e34', borderColor: '#302e34' }]} onPress={handleApple} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, color: '#fff' }}>🍎</Text>
            <Text style={[styles.socialBtnText, { color: '#fff' }]}>Continuer avec Apple</Text>
          </TouchableOpacity>
        )}

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou par email</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          style={styles.emailInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Ton adresse email"
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
            placeholder="Mot de passe (6 caractères min.)"
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
              {showPassword ? 'Masquer' : 'Voir'}
            </Text>
          </TouchableOpacity>
        </View>

        {isSignUp && (
          <>
            <TextInput
              style={styles.emailInput}
              value={referralCode}
              onChangeText={(v) => setReferralCode(v.toUpperCase())}
              placeholder="Code parrainage (optionnel)"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.referralHint}>
              🎟️ Tu as reçu un code d'un ami ? Saisis-le ici — vous recevrez chacun 5 crédits IA offerts !
            </Text>
          </>
        )}

        <TouchableOpacity
          style={[styles.emailBtn, isLoading && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.emailBtnText}>
            {isSignUp ? 'Créer mon compte gratuitement →' : 'Se connecter →'}
          </Text>
        </TouchableOpacity>

        {!isSignUp && (
          <TouchableOpacity
            style={{ marginTop: 8, alignSelf: 'center' }}
            onPress={async () => {
              if (!email.trim() || !email.includes('@')) { showToast('Saisis ton email ci-dessus d\'abord', 'error'); return; }
              try { await resetPassword(email.trim()); showToast('Email de réinitialisation envoyé !', 'success'); }
              catch { showToast('Erreur lors de l\'envoi. Réessayez.', 'error'); }
            }}
          >
            <Text style={[styles.loginLink, { color: Colors.primary }]}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 12, alignSelf: 'center' }}>
          <Text style={styles.loginLink}>
            {isSignUp
              ? <>Déjà un compte ? <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>Se connecter</Text></>
              : <>Pas encore de compte ? <Text style={{ color: Colors.primary, fontFamily: 'BeVietnamPro_700Bold' }}>Créer un compte</Text></>
            }
          </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Profile Step ──────────────────────────────────────────────────────────────

function ProfileStep({ onNext, onHelp }: { onNext: (firstName: string) => void; onHelp: () => void }) {
  const [civilite, setCivilite] = useState<'M.' | 'Mme' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const { updateProfile, isLoading } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const handleNext = async () => {
    if (!civilite) { showToast('Ta civilité est requise 😊', 'error'); return; }
    if (!firstName.trim()) { showToast('Ton prénom est requis 😊', 'error'); return; }
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const birthdayStr = birthday ? format(birthday, 'yyyy-MM-dd') : null;
      await updateProfile({
        full_name: fullName,
        civilite,
        ...(birthdayStr ? { birthday: birthdayStr } : {}),
      });
      onNext(firstName.trim());
    } catch {
      showToast('Erreur lors de la sauvegarde. Réessayez.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHelpRow}>
          <HelpBtn onPress={onHelp} />
        </View>

        <Text style={styles.stepEmoji}>👋</Text>
        <Text style={styles.stepTitle}>Bienvenue ! Dis-nous qui tu es</Text>
        <Text style={styles.stepSubtitle}>
          Pour personnaliser tes messages et te souhaiter bonne fête le moment venu 😉
        </Text>

        {/* Civilité */}
        <Text style={styles.civiliteLabel}>Civilité *</Text>
        <View style={styles.civiliteRow}>
          <TouchableOpacity
            style={[styles.civiliteBtn, civilite === 'M.' && styles.civiliteBtnActive]}
            onPress={() => setCivilite('M.')}
            activeOpacity={0.8}
          >
            <Text style={[styles.civiliteBtnText, civilite === 'M.' && styles.civiliteBtnTextActive]}>👨 M.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.civiliteBtn, civilite === 'Mme' && styles.civiliteBtnActive]}
            onPress={() => setCivilite('Mme')}
            activeOpacity={0.8}
          >
            <Text style={[styles.civiliteBtnText, civilite === 'Mme' && styles.civiliteBtnTextActive]}>👩 Mme</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.emailInput}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ton prénom *"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TextInput
          style={styles.emailInput}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Ton nom (optionnel)"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
          autoCorrect={false}
        />

        {/* Date de naissance */}
        <TouchableOpacity
          style={[styles.emailInput, { justifyContent: 'center' }]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: birthday ? Colors.onSurface : Colors.outlineVariant }}>
            {birthday ? `🎂 ${format(birthday, 'dd/MM/yyyy')}` : '🎂 Ta date de naissance (optionnel)'}
          </Text>
        </TouchableOpacity>

        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={birthday ?? new Date(1990, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, d) => {
              setShowPicker(false);
              if (d) setBirthday(d);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.emailBtn, { marginTop: 8 }, isLoading && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.emailBtnText}>Continuer →</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Notifications Step ────────────────────────────────────────────────────────

function NotifsStep({ firstName, onNext, onSkip, onHelp }: {
  firstName: string;
  onNext: () => void;
  onSkip: () => void;
  onHelp: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // OK
      }
    } finally {
      setLoading(false);
      onNext();
    }
  };

  return (
    <View style={[styles.stepScroll, { alignItems: 'center' }]}>
      <View style={styles.stepHelpRow}>
        <HelpBtn onPress={onHelp} />
      </View>

      <Text style={[styles.stepEmoji, { fontSize: 56 }]}>🔔</Text>
      <Text style={[styles.stepTitle, { textAlign: 'center' }]}>
        {firstName}, active les notifications !
      </Text>
      <Text style={[styles.stepSubtitle, { textAlign: 'center', marginBottom: 28 }]}>
        On te prévient 7 jours avant chaque anniversaire et fête — pour que tu aies le temps de préparer quelque chose de mémorable.
      </Text>

      {/* Benefit cards */}
      <View style={{ gap: 10, width: '100%', marginBottom: 24 }}>
        {[
          { e: '🎂', t: 'Rappels anniversaires', sub: '7 jours avant, jamais pris de court' },
          { e: '🌸', t: 'Fêtes des prénoms', sub: 'Détectées automatiquement' },
          { e: '⏰', t: 'Rappels personnalisés', sub: 'Ceux que toi-même tu crées' },
        ].map((b) => (
          <View key={b.t} style={styles.notifBenefit}>
            <Text style={{ fontSize: 22, width: 32 }}>{b.e}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifBenefitTitle}>{b.t}</Text>
              <Text style={styles.notifBenefitSub}>{b.sub}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.emailBtn, loading && { opacity: 0.5 }]}
        onPress={handleAllow}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.emailBtnText}>🔔 Activer les notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSkip} style={{ marginTop: 10, alignSelf: 'center' }}>
        <Text style={styles.skipText}>Pas maintenant</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── First Contact Step ────────────────────────────────────────────────────────

function FirstContactStep({ onNext, onSkip, onHelp }: {
  onNext: () => void;
  onSkip: () => void;
  onHelp: () => void;
}) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const showToast = useUIStore((s) => s.showToast);

  const RELATIONS = [
    { id: 'family', label: 'Famille', emoji: '👨‍👩‍👧' },
    { id: 'best_friend', label: 'Meilleur·e ami·e', emoji: '🤝' },
    { id: 'friend', label: 'Ami·e', emoji: '😊' },
    { id: 'partner', label: 'Partenaire', emoji: '💑' },
  ] as const;
  const [relation, setRelation] = useState<typeof RELATIONS[number]['id']>('family');

  const handleAdd = async () => {
    if (!name.trim()) { showToast('Saisis un prénom au moins 😊', 'error'); return; }
    if (!user) { onNext(); return; }
    setLoading(true);
    try {
      await createContact(user.id, {
        name: name.trim(),
        birthday: birthday ? format(birthday, 'yyyy-MM-dd') : null,
        relation,
        phone: null,
        email: null,
        notes: null,
        avatar_url: null,
        imported_from: 'manual',
        personality_tags: [],
        preferred_channel: null,
        preferred_send_time: null,
        pet_owner_name: null,
        pet_type: null,
        preferred_language: null,
        name_day: null,
        favourite_color: null,
        pet_gender: null,
        pet_owner_contact_id: null,
        breed: null,
      });
      showToast(`${name.trim()} ajouté·e ! 🎉`, 'success');
      onNext();
    } catch {
      showToast('Erreur lors de l\'ajout. Réessayez.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.stepHelpRow}>
          <HelpBtn onPress={onHelp} />
        </View>

        <Text style={styles.stepEmoji}>🎁</Text>
        <Text style={styles.stepTitle}>Ton premier proche !</Text>
        <Text style={styles.stepSubtitle}>
          Qui ne doit jamais manquer un message de ta part ? Commence par une seule personne — tu ajouteras les autres ensuite.
        </Text>

        <TextInput
          style={styles.emailInput}
          value={name}
          onChangeText={setName}
          placeholder="Son prénom et nom"
          placeholderTextColor={Colors.outlineVariant}
          autoCapitalize="words"
          autoCorrect={false}
        />

        {/* Relation picker */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {RELATIONS.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={[styles.relationChip, relation === r.id && styles.relationChipSelected]}
              onPress={() => setRelation(r.id)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14 }}>{r.emoji}</Text>
              <Text style={[styles.relationChipText, relation === r.id && { color: Colors.primary }]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Birthday picker */}
        <TouchableOpacity
          style={[styles.emailInput, { justifyContent: 'center' }]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: birthday ? Colors.onSurface : Colors.outlineVariant }}>
            {birthday ? `🎂 ${format(birthday, 'dd/MM/yyyy')}` : '🎂 Sa date de naissance (optionnel)'}
          </Text>
        </TouchableOpacity>

        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={birthday ?? new Date(1990, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_, d) => {
              setShowPicker(false);
              if (d) setBirthday(d);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.emailBtn, { marginTop: 8 }, loading && { opacity: 0.5 }]}
          onPress={handleAdd}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.emailBtnText}>Ajouter et commencer ! 🎉</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkip} style={{ marginTop: 10, alignSelf: 'center' }}>
          <Text style={styles.skipText}>Passer pour l'instant</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Help content per step ─────────────────────────────────────────────────────

const HELP_CONTENT: Record<string, { title: string; body: string }> = {
  auth: {
    title: 'Ton compte',
    body: 'Crée ton compte gratuitement en quelques secondes — sans carte bancaire. Tu peux utiliser Google, Apple (iOS) ou simplement ton email. Tes données sont stockées en sécurité et ne sont jamais revendues.',
  },
  profile: {
    title: 'Ton profil',
    body: 'Ta civilité (M. ou Mme) permet à l\'IA de personnaliser les messages avec le bon accord grammatical et de générer les bonnes signatures famille. Ton prénom apparaîtra dans tes messages. Ta date de naissance est optionnelle — elle servira à calculer ta compatibilité avec tes contacts !',
  },
  notifs: {
    title: 'Les notifications',
    body: 'Les notifications te permettent de recevoir un rappel 7 jours avant chaque anniversaire et fête. Elles ne seront jamais intrusives — tu peux les configurer finement dans l\'app. Sans elles, tu devras consulter l\'app manuellement.',
  },
  firstContact: {
    title: 'Ton premier contact',
    body: 'Ajoute la personne qui te tient le plus à cœur — celle que tu ne veux JAMAIS oublier. Tu pourras en ajouter autant que tu veux ensuite, y compris en important depuis ton téléphone.',
  },
};

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [step, setStep] = useState<OnboardingStep>('auth');
  const [firstName, setFirstName] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);

  const router = useRouter();

  const handleSignupSuccess = () => setStep('profile');
  const handleLoginSuccess = () => router.replace('/(app)');

  const handleProfileNext = (name: string) => {
    setFirstName(name);
    setStep('notifs');
  };

  const handleNotifsNext = () => setStep('firstContact');
  const handleFirstContactDone = () => router.replace('/(app)');

  const STEPS: OnboardingStep[] = ['auth', 'profile', 'notifs', 'firstContact'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top']}>
      <HelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        title={HELP_CONTENT[step]?.title ?? ''}
        body={HELP_CONTENT[step]?.body ?? ''}
      />

      {/* Progress dots */}
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
          onSignupSuccess={handleSignupSuccess}
          onLoginSuccess={handleLoginSuccess}
          onHelp={() => setHelpVisible(true)}
        />
      )}
      {step === 'profile' && (
        <ProfileStep
          onNext={handleProfileNext}
          onHelp={() => setHelpVisible(true)}
        />
      )}
      {step === 'notifs' && (
        <ScrollView contentContainerStyle={[styles.stepScroll, { paddingHorizontal: Spacing[6] }]} showsVerticalScrollIndicator={false}>
          <NotifsStep
            firstName={firstName}
            onNext={handleNotifsNext}
            onSkip={handleNotifsNext}
            onHelp={() => setHelpVisible(true)}
          />
        </ScrollView>
      )}
      {step === 'firstContact' && (
        <FirstContactStep
          onNext={handleFirstContactDone}
          onSkip={handleFirstContactDone}
          onHelp={() => setHelpVisible(true)}
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Typography
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },

  // Auth styles
  authScroll: {
    paddingHorizontal: Spacing[6],
    paddingTop: 16,
    paddingBottom: 24,
  },
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
  emailBtn: {
    width: '100%', paddingVertical: 13, borderRadius: Radii.full,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  emailBtnText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.base, color: Colors.white },
  loginLink: { fontSize: 13, color: Colors.onSurfaceVariant, fontFamily: 'BeVietnamPro_400Regular' },

  // Step screens
  stepScroll: {
    paddingHorizontal: Spacing[6],
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  stepHelpRow: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  stepEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  stepTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography['2xl'],
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
  },
  stepSubtitle: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },

  // Civilité
  civiliteLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurface,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  civiliteRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  civiliteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  civiliteBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  civiliteBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurfaceVariant,
  },
  civiliteBtnTextActive: { color: Colors.primary },

  // Gender cards (kept for potential future use)
  genderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
  },
  genderCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  genderLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  genderSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  genderCheck: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  // Notifs benefits
  notifBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: Colors.primaryContainer,
  },
  notifBenefitTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.onSurface },
  notifBenefitSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, marginTop: 2 },

  // Relation chips
  relationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryContainer,
    backgroundColor: Colors.white,
  },
  relationChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  relationChipText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },

  // Help button
  helpBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1, borderColor: Colors.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  helpBtnLight: { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.4)' },
  helpBtnText: { fontSize: 14 },
  helpBtnTextLight: {},

  // Step progress dots
  stepDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: Spacing[6],
  },
  stepDot: { height: 5, width: 6, borderRadius: Radii.full, backgroundColor: Colors.outlineVariant },

  skipText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
});
