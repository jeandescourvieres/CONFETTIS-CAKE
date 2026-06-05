import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useContacts } from '../../../src/hooks/useContacts';
import { useAuthStore } from '../../../src/stores/authStore';
import { generateMessageContent } from '../../../src/services/messages.service';
import { fetchCardTemplates } from '../../../src/services/cards.service';
import type { CardMode } from '../../../src/services/cards.service';
import { useCreateStore } from '../../../src/stores/createStore';
import { Avatar } from '../../../src/components/ui/Avatar';
import { HelpModal } from '../../../src/components/ui/HelpModal';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../../src/constants/theme';
import { useColors } from '../../../src/hooks/useColors';
import type { Contact } from '../../../src/types/models';
import type { Occasion } from '../../../src/stores/createStore';

// ── Occasions ─────────────────────────────────────────────────────────────────
type CardOccasion = Occasion | 'birthday_late' | 'weekend' | 'courage';

const CARD_OCCASIONS: { value: CardOccasion; label: string; emoji: string }[] = [
  { value: 'birthday',      label: 'Anniversaire',        emoji: '🎂' },
  { value: 'birthday_late', label: 'Anniv en retard 😅',  emoji: '⏰' },
  { value: 'nameday',       label: 'Fête de prénom',      emoji: '🌸' },
  { value: 'birth',         label: 'Naissance',           emoji: '👶' },
  { value: 'baptism',       label: 'Baptême',             emoji: '🕊️' },
  { value: 'communion',     label: 'Communion',           emoji: '🙏' },
  { value: 'engagement',    label: 'Fiançailles',         emoji: '💍' },
  { value: 'wedding',       label: 'Mariage',             emoji: '💒' },
  { value: 'graduation',    label: 'Diplôme',             emoji: '🎓' },
  { value: 'promotion',     label: 'Promotion',           emoji: '🎉' },
  { value: 'retirement',    label: 'Retraite',            emoji: '🌅' },
  { value: 'newyear',       label: 'Nouvel An',           emoji: '🎆' },
  { value: 'christmas',     label: 'Noël',                emoji: '🎄' },
  { value: 'easter',        label: 'Pâques',              emoji: '🐣' },
  { value: 'valentines',    label: 'Saint-Valentin',      emoji: '💝' },
  { value: 'mothersday',    label: 'Fête des mères',      emoji: '👩' },
  { value: 'fathersday',    label: 'Fête des pères',      emoji: '👨' },
  { value: 'halloween',     label: 'Halloween',           emoji: '🎃' },
  { value: 'support',       label: 'Soutien',             emoji: '🤍' },
  { value: 'weekend',       label: 'Bon weekend',         emoji: '🌞' },
  { value: 'courage',       label: 'Bon courage',         emoji: '💪' },
];

// ── Styles visuels par occasion (avec mood pour filtrer les templates) ─────────
type CardStyle = { emoji: string; label: string; mood: string };
const AI_CARD_STYLES: Partial<Record<CardOccasion, CardStyle[]>> = {
  birthday: [
    { emoji: '🎉', label: 'Festif & coloré',           mood: 'joyful'   },
    { emoji: '🌸', label: 'Floral & élégant',           mood: 'elegant'  },
    { emoji: '✨', label: 'Magique & féerique',          mood: 'elegant'  },
    { emoji: '😄', label: 'Humoristique & cartoon',     mood: 'funny'    },
    { emoji: '🎨', label: 'Aquarelle & doux',            mood: 'tender'   },
    { emoji: '🎂', label: 'Gourmand & sucré',            mood: 'joyful'   },
    { emoji: '🌿', label: 'Nature & bohème',             mood: 'tender'   },
    { emoji: '🌙', label: 'Nocturne & chic',             mood: 'elegant'  },
  ],
  nameday: [
    { emoji: '🌸', label: 'Floral & délicat',           mood: 'tender'   },
    { emoji: '✨', label: 'Doré & élégant',              mood: 'elegant'  },
    { emoji: '🎨', label: 'Aquarelle & poétique',        mood: 'tender'   },
    { emoji: '🌿', label: 'Nature & bohème',             mood: 'tender'   },
    { emoji: '💫', label: 'Étoilé & magique',            mood: 'elegant'  },
    { emoji: '🕯️', label: 'Chaleureux & intime',        mood: 'tender'   },
  ],
  birth: [
    { emoji: '👶', label: 'Doux & pastel',               mood: 'tender'   },
    { emoji: '🌸', label: 'Floral & délicat',            mood: 'tender'   },
    { emoji: '⭐', label: 'Étoilé & féerique',           mood: 'elegant'  },
    { emoji: '🐻', label: 'Animaux & mignon',            mood: 'joyful'   },
    { emoji: '🌈', label: 'Arc-en-ciel & coloré',        mood: 'joyful'   },
    { emoji: '🌿', label: 'Nature & bohème',             mood: 'tender'   },
  ],
  baptism: [
    { emoji: '🕊️', label: 'Doux & spirituel',           mood: 'tender'   },
    { emoji: '🌸', label: 'Floral & délicat',            mood: 'tender'   },
    { emoji: '✨', label: 'Doré & solennel',             mood: 'elegant'  },
    { emoji: '🌿', label: 'Nature & épuré',              mood: 'tender'   },
    { emoji: '💫', label: 'Céleste & lumineux',          mood: 'elegant'  },
    { emoji: '🎨', label: 'Aquarelle & poétique',        mood: 'tender'   },
  ],
  communion: [
    { emoji: '🕊️', label: 'Spirituel & solennel',       mood: 'elegant'  },
    { emoji: '✨', label: 'Doré & élégant',              mood: 'elegant'  },
    { emoji: '🌸', label: 'Floral & délicat',            mood: 'tender'   },
    { emoji: '🌿', label: 'Nature & épuré',              mood: 'tender'   },
    { emoji: '💫', label: 'Céleste & lumineux',          mood: 'elegant'  },
    { emoji: '🎨', label: 'Aquarelle & doux',            mood: 'tender'   },
  ],
  engagement: [
    { emoji: '💍', label: 'Romantique & élégant',        mood: 'romantic' },
    { emoji: '🌸', label: 'Floral & délicat',            mood: 'tender'   },
    { emoji: '✨', label: 'Doré & chic',                 mood: 'elegant'  },
    { emoji: '💫', label: 'Étoilé & magique',            mood: 'elegant'  },
    { emoji: '🎨', label: 'Aquarelle & poétique',        mood: 'tender'   },
    { emoji: '🌙', label: 'Nocturne & romantique',       mood: 'romantic' },
  ],
  wedding: [
    { emoji: '💍', label: 'Romantique & élégant',        mood: 'romantic' },
    { emoji: '🌸', label: 'Floral & bohème',             mood: 'tender'   },
    { emoji: '✨', label: 'Doré & luxueux',              mood: 'elegant'  },
    { emoji: '🕊️', label: 'Blanc & solennel',           mood: 'elegant'  },
    { emoji: '🎨', label: 'Aquarelle & poétique',        mood: 'tender'   },
    { emoji: '🌙', label: 'Nocturne & chic',             mood: 'elegant'  },
    { emoji: '🌿', label: 'Nature & champêtre',          mood: 'tender'   },
    { emoji: '💫', label: 'Étoilé & féerique',           mood: 'elegant'  },
  ],
  graduation: [
    { emoji: '🎓', label: 'Académique & solennel',       mood: 'elegant'  },
    { emoji: '✨', label: 'Doré & élégant',              mood: 'elegant'  },
    { emoji: '🌟', label: 'Étoilé & brillant',           mood: 'epic'     },
    { emoji: '🎉', label: 'Festif & coloré',             mood: 'joyful'   },
    { emoji: '🚀', label: 'Moderne & dynamique',         mood: 'epic'     },
    { emoji: '🌿', label: 'Nature & épuré',              mood: 'tender'   },
  ],
  promotion: [
    { emoji: '🚀', label: 'Moderne & dynamique',         mood: 'epic'     },
    { emoji: '✨', label: 'Doré & élégant',              mood: 'elegant'  },
    { emoji: '🌟', label: 'Étoilé & brillant',           mood: 'epic'     },
    { emoji: '🎉', label: 'Festif & coloré',             mood: 'joyful'   },
    { emoji: '💼', label: 'Professionnel & sobre',       mood: 'elegant'  },
    { emoji: '🏆', label: 'Trophée & victoire',          mood: 'epic'     },
  ],
  retirement: [
    { emoji: '🌅', label: 'Coucher de soleil & chaleureux', mood: 'tender' },
    { emoji: '🌿', label: 'Nature & sérénité',           mood: 'tender'   },
    { emoji: '✈️', label: 'Voyage & aventure',           mood: 'epic'     },
    { emoji: '🎉', label: 'Festif & coloré',             mood: 'joyful'   },
    { emoji: '🌸', label: 'Floral & doux',               mood: 'tender'   },
    { emoji: '🎨', label: 'Aquarelle & nostalgique',     mood: 'tender'   },
  ],
  newyear: [
    { emoji: '🎆', label: "Feux d'artifice & festif",    mood: 'epic'     },
    { emoji: '✨', label: 'Doré & pétillant',            mood: 'elegant'  },
    { emoji: '🌙', label: 'Nocturne & étoilé',           mood: 'elegant'  },
    { emoji: '🥂', label: 'Champagne & chic',            mood: 'elegant'  },
    { emoji: '🎉', label: 'Coloré & explosif',           mood: 'joyful'   },
    { emoji: '❄️', label: 'Hivernal & magique',          mood: 'tender'   },
  ],
  christmas: [
    { emoji: '🎄', label: 'Traditionnel & chaleureux',   mood: 'tender'   },
    { emoji: '❄️', label: 'Hivernal & féerique',         mood: 'tender'   },
    { emoji: '✨', label: 'Doré & élégant',              mood: 'elegant'  },
    { emoji: '🦌', label: 'Renne & cartoon',             mood: 'funny'    },
    { emoji: '🌿', label: 'Nature & rustique',           mood: 'tender'   },
    { emoji: '🕯️', label: 'Bougie & intime',            mood: 'tender'   },
    { emoji: '⛄', label: 'Bonhomme de neige & joyeux',  mood: 'joyful'   },
    { emoji: '🎁', label: 'Cadeaux & coloré',            mood: 'joyful'   },
  ],
  easter: [
    { emoji: '🐣', label: 'Poussin & mignon',            mood: 'joyful'   },
    { emoji: '🌸', label: 'Floral & printanier',         mood: 'tender'   },
    { emoji: '🎨', label: 'Aquarelle & pastel',          mood: 'tender'   },
    { emoji: '🐰', label: 'Lapin & cartoon',             mood: 'funny'    },
    { emoji: '🌿', label: 'Nature & champêtre',          mood: 'tender'   },
    { emoji: '🌈', label: 'Arc-en-ciel & coloré',        mood: 'joyful'   },
  ],
  valentines: [
    { emoji: '❤️', label: 'Romantique & passionné',      mood: 'romantic' },
    { emoji: '🌸', label: 'Floral & délicat',            mood: 'tender'   },
    { emoji: '✨', label: 'Doré & élégant',              mood: 'elegant'  },
    { emoji: '🎨', label: 'Aquarelle & poétique',        mood: 'tender'   },
    { emoji: '🌙', label: 'Nocturne & romantique',       mood: 'romantic' },
    { emoji: '😄', label: 'Humoristique & décalé',       mood: 'funny'    },
    { emoji: '💫', label: 'Étoilé & magique',            mood: 'elegant'  },
    { emoji: '🕯️', label: 'Bougie & intime',            mood: 'tender'   },
  ],
  mothersday: [
    { emoji: '🌸', label: 'Floral & délicat',            mood: 'tender'   },
    { emoji: '💛', label: 'Chaleureux & tendre',         mood: 'tender'   },
    { emoji: '🎨', label: 'Aquarelle & poétique',        mood: 'tender'   },
    { emoji: '🌿', label: 'Nature & bohème',             mood: 'tender'   },
    { emoji: '✨', label: 'Doré & élégant',              mood: 'elegant'  },
    { emoji: '👑', label: 'Royal & précieux',            mood: 'elegant'  },
    { emoji: '🦋', label: 'Papillon & féerique',         mood: 'elegant'  },
    { emoji: '🕯️', label: 'Bougie & intime',            mood: 'tender'   },
  ],
  fathersday: [
    { emoji: '💪', label: 'Moderne & dynamique',         mood: 'epic'     },
    { emoji: '🌿', label: 'Nature & aventure',           mood: 'tender'   },
    { emoji: '⚽', label: 'Sport & fun',                 mood: 'joyful'   },
    { emoji: '🎨', label: 'Graphique & sobre',           mood: 'elegant'  },
    { emoji: '🏆', label: 'Trophée & victoire',          mood: 'epic'     },
    { emoji: '🌊', label: 'Marine & élégant',            mood: 'elegant'  },
    { emoji: '🎸', label: 'Rock & décalé',               mood: 'funny'    },
    { emoji: '🌲', label: 'Forêt & rustique',            mood: 'tender'   },
  ],
  halloween: [
    { emoji: '🎃', label: 'Citrouille & classique',      mood: 'funny'    },
    { emoji: '👻', label: 'Fantôme & amusant',           mood: 'funny'    },
    { emoji: '🕷️', label: 'Sombre & mystérieux',        mood: 'epic'     },
    { emoji: '🧙', label: 'Sorcière & magique',          mood: 'funny'    },
    { emoji: '💀', label: 'Squelette & décalé',          mood: 'funny'    },
    { emoji: '🌙', label: 'Nocturne & effrayant',        mood: 'epic'     },
    { emoji: '🦇', label: 'Chauve-souris & gothique',    mood: 'epic'     },
    { emoji: '🍬', label: 'Bonbons & coloré',            mood: 'joyful'   },
  ],
  support: [
    { emoji: '🕊️', label: 'Doux & apaisant',            mood: 'tender'   },
    { emoji: '🌿', label: 'Nature & sérénité',           mood: 'tender'   },
    { emoji: '🌸', label: 'Floral & délicat',            mood: 'tender'   },
    { emoji: '☀️', label: 'Ensoleillé & positif',        mood: 'joyful'   },
    { emoji: '🌈', label: 'Arc-en-ciel & espoir',        mood: 'joyful'   },
    { emoji: '💫', label: 'Étoilé & réconfortant',       mood: 'elegant'  },
  ],
  birthday_late: [
    { emoji: '😅', label: 'Décalé & amusant',            mood: 'funny'    },
    { emoji: '🎉', label: 'Festif malgré tout',           mood: 'joyful'   },
    { emoji: '🌸', label: 'Sincère & tendre',            mood: 'tender'   },
  ],
  weekend: [
    { emoji: '☀️', label: 'Ensoleillé & joyeux',         mood: 'joyful'   },
    { emoji: '🌿', label: 'Zen & nature',                 mood: 'tender'   },
    { emoji: '✨', label: 'Lumineux & doux',              mood: 'elegant'  },
  ],
  courage: [
    { emoji: '💪', label: 'Motivant & épique',            mood: 'epic'     },
    { emoji: '🌸', label: 'Doux & bienveillant',          mood: 'tender'   },
    { emoji: '✨', label: 'Lumineux & positif',           mood: 'elegant'  },
  ],
};

// Fallback si une occasion n'a pas de styles définis
const DEFAULT_STYLES: CardStyle[] = [
  { emoji: '✨', label: 'Élégant & lumineux', mood: 'elegant' },
  { emoji: '🌸', label: 'Floral & délicat',   mood: 'tender'  },
  { emoji: '🎉', label: 'Festif & coloré',    mood: 'joyful'  },
  { emoji: '🌿', label: 'Nature & épuré',     mood: 'tender'  },
];

type BirthdayDisplayOption = 'name' | 'age' | 'both' | 'none';

export default function AICardCreateScreen() {
  const C = useColors();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(C), [C]);

  const { data: contacts = [] } = useContacts();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  // ── État wizard ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState<CardOccasion | null>(null);
  const [birthdayDisplay, setBirthdayDisplay] = useState<BirthdayDisplayOption>('name');
  const [selectedStyle, setSelectedStyle] = useState<CardStyle | null>(null);
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  // ── Langue du message ────────────────────────────────────────────────────────
  const [language, setLanguage] = useState<'fr' | 'en' | 'es' | 'it' | 'de' | 'pt'>('fr');
  const [langModeEmploiOpen, setLangModeEmploiOpen] = useState(false);
  const [langHelpVisible, setLangHelpVisible] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const firstName = selectedContact
    ? (selectedContact.name.split(' ').slice(1).join(' ') || selectedContact.name.split(' ')[0])
    : '';

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contacts;
    const q = contactSearch.toLowerCase();
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, contactSearch]);

  const occasionStyles = selectedOccasion
    ? (AI_CARD_STYLES[selectedOccasion] ?? DEFAULT_STYLES)
    : [];

  // ── Génération message IA ────────────────────────────────────────────────────
  const handleGenerateMessage = useCallback(async () => {
    if (!selectedContact || !selectedOccasion) return;
    setIsGenerating(true);
    try {
      // Mapping card-only occasions → occasion IA la plus proche
      const occasionForAI: Occasion =
        selectedOccasion === 'birthday_late' ? 'birthday' :
        selectedOccasion === 'weekend'       ? 'greetings' :
        selectedOccasion === 'courage'       ? 'support' :
        selectedOccasion as Occasion;

      const content = await generateMessageContent({
        format: 'message',
        tone: 'touching',
        relation: selectedContact.relation,
        contact_name: firstName,
        age: selectedContact.birthday ? undefined : undefined,
        occasion: occasionForAI,
        style_hint: 'Court',
        language,
      });
      setMessage(content);
    } catch {
      Alert.alert('Erreur', 'La génération du message a échoué. Réessaie.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedContact, selectedOccasion, firstName]);

  // ── Génération carte — sélection intelligente de template ───────────────────
  const handleGenerateCard = useCallback(async () => {
    if (!selectedContact || !selectedOccasion) return;
    setIsGeneratingCard(true);
    try {
      // Déterminer le mode selon l'option anniversaire
      const targetMode: CardMode = selectedOccasion === 'birthday'
        ? (birthdayDisplay === 'age' ? 'age' : birthdayDisplay === 'both' ? 'age_name' : 'name')
        : 'name';

      // Chercher des templates correspondant à l'occasion + mood visuel + mode
      const mood = selectedStyle?.mood ?? null;
      let templates = await fetchCardTemplates(selectedOccasion, mood, targetMode);
      if (templates.length === 0) {
        // Fallback : même occasion sans filtre mood
        templates = await fetchCardTemplates(selectedOccasion, null, targetMode);
      }
      if (templates.length === 0) {
        // Fallback : même occasion sans aucun filtre
        templates = await fetchCardTemplates(selectedOccasion);
      }
      if (templates.length === 0) {
        // Dernier recours : template universel
        templates = await fetchCardTemplates('universal');
      }
      if (templates.length === 0) throw new Error('no-template');

      // Choisir aléatoirement parmi les templates correspondants
      const picked = templates[Math.floor(Math.random() * templates.length)];

      // Pré-remplir le store de création pour "Ajouter un message"
      const store = useCreateStore.getState();
      store.setCardTemplateId(picked.id);
      store.setContact(selectedContact.id, selectedContact.name, selectedContact.relation);
      const occasionForStore: Occasion =
        selectedOccasion === 'birthday_late' ? 'birthday' :
        selectedOccasion === 'weekend'       ? 'greetings' :
        selectedOccasion === 'courage'       ? 'support' :
        selectedOccasion as Occasion;
      store.setOccasion(occasionForStore);
      store.setMessageLanguage(language as Parameters<typeof store.setMessageLanguage>[0]);
      if (message.trim()) {
        store.setGeneratedContent(message.trim());
      }

      // Naviguer vers l'aperçu de la carte
      router.push({
        pathname: '/(app)/cards/[id]',
        params: {
          id: picked.id,
          contactName: firstName,
          contactId: selectedContact.id,
        },
      } as never);
    } catch {
      Alert.alert('Erreur', 'Impossible de trouver une carte pour cette occasion. Réessaie.');
      setIsGeneratingCard(false);
    }
  }, [selectedContact, selectedOccasion, birthdayDisplay, firstName, message, language, router]);


  // ── Navigation ───────────────────────────────────────────────────────────────
  const goBack = () => {
    if (step === 1) { router.back(); return; }
    setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4 | 5);
  };

  const selectedOccasionInfo = CARD_OCCASIONS.find((o) => o.value === selectedOccasion);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: C.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Carte IA personnalisée</Text>
          <Text style={styles.stepIndicator}>Étape {step} / 5</Text>
        </View>
        <HelpModal
          title="Comment créer ta carte IA ?"
          content={"🎨 Clique sur Créer une carte IA depuis l'écran de composition du message\n\n👤 Étape 1 — Choisis le contact à qui tu veux envoyer la carte\n\n🎉 Étape 2 — Sélectionne l'occasion parmi la liste complète — chaque occasion propose ses propres styles visuels\n\n🖼️ Étape 3 — Parcours les vignettes d'aperçu et choisis le style qui te plaît\n\n✍️ Étape 4 — Claude AI génère automatiquement le message adapté à l'occasion et au contact — modifie-le si tu veux\n\n📲 Étape 5 — Choisis comment envoyer ta carte — WhatsApp, SMS, email ou autre — et c'est parti !\n\n🔄 Le résultat ne te convient pas ? Clique sur Regénérer pour une nouvelle carte unique 💛✨"}
        />
      </View>

      {/* Barre de progression */}
      <View style={styles.progressBar}>
        {([1, 2, 3, 4, 5] as const).map((s) => (
          <View
            key={s}
            style={[styles.progressDot, s <= step && { backgroundColor: C.primary }]}
          />
        ))}
        <View style={[styles.progressFill, { width: `${((step - 1) / 4) * 100}%`, backgroundColor: C.primary }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Intro (toujours visible) ─────────────────── */}
        {step === 1 && (
          <View style={[styles.introCard, { borderLeftColor: C.primary, backgroundColor: C.primaryContainer + '50' }]}>
            <Text style={[styles.introText, { color: Colors.onSurface }]}>
              {"Fini les cartes génériques qu'on a déjà toutes reçues ! 🎨 Chaque personne mérite une carte qui lui ressemble vraiment — laisse l'IA créer pour toi une carte unique et personnalisée selon l'occasion, le style visuel et les couleurs de ton proche. Tu choisis, l'IA fait la magie — pour une attention visuelle inoubliable qui touchera le cœur de ton proche 💛✨"}
            </Text>
          </View>
        )}

        {/* ── Étape 1 — Contact ────────────────────────── */}
        {step === 1 && (
          <>
            <Text style={styles.stepTitle}>👤 À qui veux-tu envoyer cette carte ?</Text>
            <TextInput
              style={[styles.searchInput, { borderColor: C.primaryContainer }]}
              placeholder="Rechercher un contact…"
              placeholderTextColor={Colors.onSurfaceVariant}
              value={contactSearch}
              onChangeText={setContactSearch}
            />
            <View style={styles.contactList}>
              {filteredContacts.map((c) => {
                const fn = c.name.split(' ').slice(1).join(' ') || c.name.split(' ')[0];
                const selected = selectedContact?.id === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.contactRow, selected && { borderColor: C.primary, backgroundColor: C.primaryContainer + '40' }]}
                    onPress={() => { setSelectedContact(c); setStep(2); }}
                    activeOpacity={0.8}
                  >
                    <Avatar uri={c.avatar_url} name={c.name} size="sm" />
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{c.name}</Text>
                      <Text style={styles.contactSub}>{fn}</Text>
                    </View>
                    {selected && <Text style={[styles.checkmark, { color: C.primary }]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ── Étape 2 — Occasion ───────────────────────── */}
        {step === 2 && (
          <>
            <Text style={styles.stepTitle}>🎉 Pour quelle occasion ?</Text>
            <View style={styles.occasionGrid}>
              {CARD_OCCASIONS.map((o) => {
                const active = selectedOccasion === o.value;
                return (
                  <TouchableOpacity
                    key={o.value}
                    style={[styles.occasionChip, active && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                    onPress={() => { setSelectedOccasion(o.value); setSelectedStyle(null); }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.occasionEmoji}>{o.emoji}</Text>
                    <Text style={[styles.occasionLabel, active && { color: C.primary }]}>{o.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Option spéciale Anniversaire */}
            {selectedOccasion === 'birthday' && (
              <View style={[styles.birthdayBox, { borderColor: C.primaryContainer, backgroundColor: C.primaryContainer + '40' }]}>
                <Text style={styles.birthdayBoxTitle}>🎂 Tu veux faire apparaître sur la carte ?</Text>
                {([ ['name', 'Le prénom uniquement'], ['age', "L'âge uniquement"], ['both', 'Le prénom ET l\'âge'], ['none', 'Rien du tout'] ] as [BirthdayDisplayOption, string][]).map(([val, lbl]) => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.birthdayOption, birthdayDisplay === val && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                    onPress={() => setBirthdayDisplay(val)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.birthdayOptionText, birthdayDisplay === val && { color: C.primary }]}>{lbl}</Text>
                    {birthdayDisplay === val && <Text style={[styles.checkmark, { color: C.primary }]}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* ── Étape 3 — Style visuel ───────────────────── */}
        {step === 3 && (
          <>
            <Text style={styles.stepTitle}>🎨 Quel style visuel tu veux ?</Text>
            {selectedOccasionInfo && (
              <Text style={styles.stepSub}>
                Styles disponibles pour {selectedOccasionInfo.emoji} {selectedOccasionInfo.label} :
              </Text>
            )}
            <View style={styles.styleGrid}>
              {occasionStyles.map((s) => {
                const active = selectedStyle?.label === s.label;
                return (
                  <TouchableOpacity
                    key={s.label}
                    style={[styles.styleCard, active && { borderColor: C.primary, backgroundColor: C.primaryContainer + '60' }]}
                    onPress={() => setSelectedStyle(s)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.styleEmoji}>{s.emoji}</Text>
                    <Text style={[styles.styleLabel, active && { color: C.primary }]}>{s.label}</Text>
                    {active && <Text style={[styles.checkmark, { color: C.primary, marginTop: 4 }]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ── Étape 4 — Message IA ─────────────────────── */}
        {step === 4 && (
          <>
            <Text style={styles.stepTitle}>✍️ Le message de ta carte</Text>
            <Text style={styles.stepSub}>
              Claude AI a généré un message adapté à l'occasion et à ton proche. Modifie-le librement avant de l'intégrer dans la carte.
            </Text>

            {/* Langue du message */}
            <View style={[styles.langSection, { borderColor: C.primaryContainer, backgroundColor: C.primaryContainer + '30' }]}>
              {/* Titre + ℹ️ */}
              <View style={styles.langHeader}>
                <Text style={styles.langTitle}>🌍 Langue du message</Text>
                <TouchableOpacity onPress={() => setLangHelpVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.langInfoBtn}>ℹ️</Text>
                </TouchableOpacity>
              </View>

              {/* Intro */}
              <Text style={styles.langIntro}>
                {"Et si ton message parlait la langue de ton proche ? 🌍 Parce que la langue c'est le chemin le plus court vers le cœur de quelqu'un — choisis parmi 6 langues et laisse Claude AI rédiger ton texte dans ta carte directement dans la langue de ton proche. Une petite attention qui traverse toutes les frontières et fait toute la différence 💛✨"}
              </Text>

              {/* Mode d'emploi dépliable */}
              <TouchableOpacity onPress={() => setLangModeEmploiOpen((v) => !v)} activeOpacity={0.7} style={styles.langModeBtn}>
                <Text style={[styles.langModeBtnText, { color: C.primary }]}>
                  {langModeEmploiOpen ? '▾ Fermer le mode d\'emploi' : '📖 Mode d\'emploi'}
                </Text>
              </TouchableOpacity>
              {langModeEmploiOpen && (
                <View style={[styles.langModeContent, { borderColor: C.primaryContainer }]}>
                  {[
                    "🌍 Clique sur l'option Langue du message dans l'écran de création",
                    "✨ Choisis parmi 6 langues disponibles : 🇫🇷 Français • 🇬🇧 Anglais • 🇪🇸 Espagnol • 🇮🇹 Italien • 🇩🇪 Allemand • 🇵🇹 Portugais",
                    "💡 Le français est sélectionné par défaut — change de langue en un clic",
                    "💫 Claude AI génère automatiquement le texte dans la langue choisie",
                    "📲 Ton proche reçoit un message dans sa langue — une attention unique qui traverse toutes les frontières 💛✨",
                  ].map((line, i) => (
                    <Text key={i} style={styles.langModeLine}>• {line}</Text>
                  ))}
                </View>
              )}

              {/* Sélecteur de langue */}
              <View style={styles.langGrid}>
                {([
                  { code: 'fr', flag: '🇫🇷', label: 'Français' },
                  { code: 'en', flag: '🇬🇧', label: 'Anglais' },
                  { code: 'es', flag: '🇪🇸', label: 'Espagnol' },
                  { code: 'it', flag: '🇮🇹', label: 'Italien' },
                  { code: 'de', flag: '🇩🇪', label: 'Allemand' },
                  { code: 'pt', flag: '🇵🇹', label: 'Portugais' },
                ] as const).map((l) => (
                  <TouchableOpacity
                    key={l.code}
                    style={[styles.langBtn, language === l.code && { borderColor: C.primary, backgroundColor: C.primaryContainer }]}
                    onPress={() => setLanguage(l.code)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.langFlag}>{l.flag}</Text>
                    <Text style={[styles.langLabel, language === l.code && { color: C.primary }]}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Popup ℹ️ langue */}
            {langHelpVisible && (
              <TouchableOpacity
                style={styles.helpOverlay}
                activeOpacity={1}
                onPress={() => setLangHelpVisible(false)}
              >
                <View style={styles.helpPopup}>
                  <Text style={styles.helpPopupTitle}>Comment fonctionne la langue du message ? 🌍</Text>
                  <Text style={styles.helpPopupBody}>
                    {"Par défaut, le message est généré en français. Pour choisir une autre langue, sélectionne la langue de ton proche parmi les 6 disponibles.\n\nConfetticake s'occupe de tout une fois la langue choisie et génère automatiquement le message dans cette langue — tu n'as rien d'autre à faire !\n\n💡 Bon à savoir : Le ton et le style s'adaptent automatiquement — un message en anglais ne sera pas une simple traduction mais un vrai message naturel dans cette langue !"}
                  </Text>
                  <TouchableOpacity onPress={() => setLangHelpVisible(false)} style={[styles.helpPopupClose, { backgroundColor: C.primary }]}>
                    <Text style={styles.helpPopupCloseText}>Fermer ✕</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}

            {isGenerating ? (
              <View style={styles.generatingBox}>
                <ActivityIndicator color={C.primary} />
                <Text style={[styles.generatingText, { color: C.primary }]}>Génération du message en cours…</Text>
              </View>
            ) : message ? (
              <View style={[styles.messageBox, { borderColor: C.primaryContainer }]}>
                {isEditing ? (
                  <TextInput
                    style={[styles.messageInput, { borderColor: C.primary }]}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    autoFocus
                  />
                ) : (
                  <Text style={styles.messageText}>{message}</Text>
                )}
                <View style={styles.messageActions}>
                  <TouchableOpacity
                    style={[styles.msgActionBtn, { borderColor: C.primary }]}
                    onPress={() => setIsEditing((v) => !v)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.msgActionBtnText, { color: C.primary }]}>
                      {isEditing ? '✓ Valider' : '✏️ Modifier'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.msgActionBtn, { borderColor: Colors.onSurfaceVariant }]}
                    onPress={handleGenerateMessage}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.msgActionBtnText, { color: Colors.onSurfaceVariant }]}>↺ Régénérer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.generateMsgBtn, { backgroundColor: C.primary }]}
                onPress={handleGenerateMessage}
                activeOpacity={0.85}
              >
                <Text style={styles.generateMsgBtnText}>✨ Générer le message avec l'IA</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* ── Étape 5 — Récapitulatif & envoi ─────────────── */}
        {step === 5 && (
          <>
            <Text style={styles.stepTitle}>🚀 Tout est prêt !</Text>
            <Text style={styles.stepSub}>Vérifie le récapitulatif de ta carte avant de la générer.</Text>

            <View style={[styles.recapCard, { borderColor: C.primaryContainer, backgroundColor: C.primaryContainer + '30' }]}>
              <View style={styles.recapRow}>
                <Text style={styles.recapIcon}>👤</Text>
                <View style={styles.recapInfo}>
                  <Text style={styles.recapLabel}>Destinataire</Text>
                  <Text style={styles.recapValue}>{selectedContact?.name ?? '—'}</Text>
                </View>
              </View>
              <View style={styles.recapDivider} />
              <View style={styles.recapRow}>
                <Text style={styles.recapIcon}>{selectedOccasionInfo?.emoji ?? '🎉'}</Text>
                <View style={styles.recapInfo}>
                  <Text style={styles.recapLabel}>Occasion</Text>
                  <Text style={styles.recapValue}>{selectedOccasionInfo?.label ?? '—'}</Text>
                </View>
              </View>
              <View style={styles.recapDivider} />
              <View style={styles.recapRow}>
                <Text style={styles.recapIcon}>{selectedStyle?.emoji ?? '🎨'}</Text>
                <View style={styles.recapInfo}>
                  <Text style={styles.recapLabel}>Style visuel</Text>
                  <Text style={styles.recapValue}>{selectedStyle?.label ?? '—'}</Text>
                </View>
              </View>
              <View style={styles.recapDivider} />
              <View style={styles.recapRow}>
                <Text style={styles.recapIcon}>✍️</Text>
                <View style={styles.recapInfo}>
                  <Text style={styles.recapLabel}>Message</Text>
                  <Text style={styles.recapValue} numberOfLines={3}>{message.trim() || '—'}</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.stepSub, { marginTop: 8, textAlign: 'center' }]}>
              La carte sera générée avec le style visuel choisi. Tu pourras l'envoyer par WhatsApp, SMS, email ou lien partageable.
            </Text>
          </>
        )}

      </ScrollView>

      {/* Bouton Suivant / Générer la carte */}
      <View style={styles.footer}>
        {step === 1 && (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: selectedContact ? C.primary : Colors.surfaceContainerHighest }]}
            onPress={() => selectedContact && setStep(2)}
            activeOpacity={0.85}
            disabled={!selectedContact}
          >
            <Text style={[styles.nextBtnText, !selectedContact && { color: Colors.onSurfaceVariant }]}>
              Suivant — Choisir l'occasion →
            </Text>
          </TouchableOpacity>
        )}
        {step === 2 && (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: selectedOccasion ? C.primary : Colors.surfaceContainerHighest }]}
            onPress={() => selectedOccasion && setStep(3)}
            activeOpacity={0.85}
            disabled={!selectedOccasion}
          >
            <Text style={[styles.nextBtnText, !selectedOccasion && { color: Colors.onSurfaceVariant }]}>
              Suivant — Choisir le style →
            </Text>
          </TouchableOpacity>
        )}
        {step === 3 && (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: selectedStyle ? C.primary : Colors.surfaceContainerHighest }]}
            onPress={async () => { if (!selectedStyle) return; await handleGenerateMessage(); setStep(4); }}
            activeOpacity={0.85}
            disabled={!selectedStyle}
          >
            <Text style={[styles.nextBtnText, !selectedStyle && { color: Colors.onSurfaceVariant }]}>
              Suivant — Générer le message →
            </Text>
          </TouchableOpacity>
        )}
        {step === 4 && (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: message.trim() ? C.primary : Colors.surfaceContainerHighest }]}
            onPress={() => message.trim() && setStep(5)}
            activeOpacity={0.85}
            disabled={!message.trim()}
          >
            <Text style={[styles.nextBtnText, !message.trim() && { color: Colors.onSurfaceVariant }]}>
              Suivant — Récapitulatif →
            </Text>
          </TouchableOpacity>
        )}
        {step === 5 && (
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: C.primary }, isGeneratingCard && { opacity: 0.6 }]}
            onPress={handleGenerateCard}
            activeOpacity={0.85}
            disabled={isGeneratingCard}
          >
            {isGeneratingCard
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.nextBtnText}>✨ Générer et voir ma carte →</Text>
            }
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.surfaceContainerHighest,
  },
  backLink: { justifyContent: 'center', minWidth: 70 },
  backLinkText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  stepIndicator: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },

  // Barre de progression
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    position: 'relative',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.surfaceContainerHighest,
    zIndex: 1,
  },
  progressFill: {
    position: 'absolute',
    height: 3,
    top: '50%',
    left: '10%',
  },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[5], paddingBottom: 120, gap: 16 },

  // Intro
  introCard: {
    borderLeftWidth: 4,
    borderRadius: Radii.lg,
    padding: Spacing[4],
  },
  introText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Steps
  stepTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.xl,
    color: Colors.onSurface,
  },
  stepSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginTop: -8,
  },

  // Step 1 — Contacts
  searchInput: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    borderWidth: 1.5,
    borderRadius: Radii.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: Colors.onSurface,
    backgroundColor: Colors.white,
  },
  contactList: { gap: 8 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    padding: Spacing[3],
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    ...Shadows.sm,
  },
  contactInfo: { flex: 1 },
  contactName: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  contactSub: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
  },
  checkmark: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 18,
  },

  // Step 2 — Occasions
  occasionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  occasionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
  },
  occasionEmoji: { fontSize: 16 },
  occasionLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
  },
  birthdayBox: {
    borderWidth: 1.5,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 8,
  },
  birthdayBoxTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  birthdayOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest,
    borderRadius: Radii.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
  },
  birthdayOptionText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },

  // Step 3 — Styles visuels
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  styleCard: {
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: Radii.xl,
    borderWidth: 2,
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.white,
    gap: 4,
    ...Shadows.sm,
  },
  styleEmoji: { fontSize: 32 },
  styleLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // Step 4 — Message
  generatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  generatingText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
  },
  messageBox: {
    borderWidth: 1.5,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 12,
    backgroundColor: Colors.white,
  },
  messageText: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
    lineHeight: 24,
  },
  messageInput: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
    lineHeight: 24,
    minHeight: 100,
    borderWidth: 1.5,
    borderRadius: Radii.lg,
    padding: 10,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 10,
  },
  msgActionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radii.full,
    paddingVertical: 8,
    alignItems: 'center',
  },
  msgActionBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },
  generateMsgBtn: {
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  generateMsgBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },

  // Step 5 — Envoi
  cardRecap: {
    borderWidth: 1.5,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: 6,
  },
  cardRecapRow: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.base,
    color: Colors.onSurface,
  },
  cardRecapLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    color: Colors.onSurface,
  },
  cardRecapMessage: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.sm,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
    fontStyle: 'italic',
  },
  shareBtn: {
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  // Réseaux sociaux
  socialSection: { borderWidth: 1.5, borderRadius: Radii.xl, padding: Spacing[4], gap: 10 },
  socialInfo: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant, lineHeight: 18, fontStyle: 'italic',
  },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 2, borderRadius: Radii.full,
    paddingVertical: 11, backgroundColor: Colors.white,
  },
  socialBtnEmoji: { fontSize: 18 },
  socialBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base },

  regenBtn: {
    borderWidth: 1.5,
    borderRadius: Radii.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  regenBtnText: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.sm,
  },

  // Step 5 — Récapitulatif
  recapCard: {
    borderWidth: 1.5,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: Spacing[4],
  },
  recapIcon: { fontSize: 22, marginTop: 2 },
  recapInfo: { flex: 1 },
  recapLabel: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.xs,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  recapValue: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: Typography.base,
    color: Colors.onSurface,
    lineHeight: 22,
  },
  recapDivider: {
    height: 0.5,
    backgroundColor: Colors.surfaceContainerHighest,
    marginHorizontal: Spacing[4],
  },

  // Langue
  langSection: { borderWidth: 1.5, borderRadius: Radii.xl, padding: Spacing[4], gap: 10 },
  langHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  langTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.base, color: Colors.onSurface },
  langInfoBtn: { fontSize: 18 },
  langIntro: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20, fontStyle: 'italic' },
  langModeBtn: { alignSelf: 'flex-start' },
  langModeBtnText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },
  langModeContent: { borderWidth: 1, borderRadius: Radii.lg, padding: Spacing[3], gap: 6 },
  langModeLine: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs, color: Colors.onSurfaceVariant, lineHeight: 18 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: Radii.full, borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
  },
  langFlag: { fontSize: 16 },
  langLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurfaceVariant },
  // Popup aide langue
  helpOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  helpPopup: {
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    padding: Spacing[5], marginHorizontal: Spacing[5], gap: 12,
    ...Shadows.sm,
  },
  helpPopupTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.lg, color: Colors.onSurface },
  helpPopupBody: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 20 },
  helpPopupClose: { borderRadius: Radii.full, paddingVertical: 10, alignItems: 'center' },
  helpPopupCloseText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

  // Footer
  footer: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderTopWidth: 0.5,
    borderTopColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.background,
  },
  nextBtn: {
    borderRadius: Radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: Typography.md,
    color: Colors.white,
  },
  });
}
