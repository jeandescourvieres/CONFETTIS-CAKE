import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTabScrollToTop } from '../../src/hooks/useTabScrollToTop';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../src/constants/theme';
import { useColors } from '../../src/hooks/useColors';
import { BackHeader } from '../../src/components/ui/BackHeader';
import { Config } from '../../src/constants/config';

// ── Steps (mode d'emploi) ────────────────────────────────────────────────────
type SubStep = { emoji: string; title: string; desc: string };
type Step =
  | { n: string; emoji: string; title: string; desc: string; subSteps?: never }
  | { n: string; emoji: string; title: string; desc?: never; subSteps: SubStep[] };

const STEPS: Step[] = [
  { n: '1',  emoji: '👥', title: 'La gestion des contacts',        desc: 'Tu peux les créer manuellement ou les importer directement (après sélection) depuis les contacts de ton téléphone. Dans les 2 cas, leur date de naissance et leur prénom devront être bien renseignés pour activer la détection automatique des anniversaires et des fêtes.\n\n🐾 Tu peux aussi ajouter l\'animal de compagnie d\'un proche comme contact ! Choisis la relation "Animal de compagnie" et renseigne le champ "Animal de qui ?" avec le prénom du propriétaire. Dans ta liste, tu verras alors "🐾 Animal de Michel" sous le nom de l\'animal — impossible de les confondre !' },
  { n: '2',  emoji: '🔔', title: 'Les alertes',                    desc: 'L\'appli va t\'envoyer une notification 7 jours avant chaque anniversaire ou fête des contacts que tu as créés. Plus de surprise de dernière minute !' },
  { n: '3',  emoji: '✦',  title: 'Envoyer un message IA',          desc: 'Pour générer ton message IA, choisis un contact, l\'occasion, le format (chanson, poème, message, humour) et la tonalité. L\'IA compose un texte unique en quelques secondes.\n\n💡 Idées & modèles : en mode "À ma façon", appuie sur "💡 Idées" pour choisir parmi des dizaines de modèles classés par occasion et longueur (court, moyen, long).\n\n✍️ Signature personnalisée : en bas de l\'aperçu, le bouton "Signature" te permet d\'ajouter ton prénom ou un surnom, de choisir son style visuel, et de l\'activer ou désactiver en un tap.\n\n🌍 Traduction : le bouton fixe "🌍 Traduire ce message" apparaît toujours en bas — tape dessus pour traduire ton message en anglais, espagnol, allemand, italien ou portugais en un tap.\n\n🎭 En poème : tape "🎭 En poème ✍️" pour réécrire ton message sous forme de poème avec rimes, en conservant le sens et les émojis.\n\n🐾 Feature préférée ! Dans la fiche d\'un contact avec un animal, un bouton "Message de la part de [animal]" apparaît — envoie un message signé de la patte de Médor !' },
  { n: '4',  emoji: '↺',  title: 'Régénère gratuitement ton message IA', desc: 'Le premier message IA coûte 1 crédit. Les suivants pour la même création sont GRATUITS — parce que l\'IA peut parfois proposer un texte maladroit ou qui ne te correspond pas. Tu peux relancer autant de fois que nécessaire jusqu\'à trouver le message parfait, qui ne te coûtera donc, en final, qu\'un crédit !' },
  { n: '5',  emoji: '✏️', title: 'Tu préfères écrire toi-même ?',  desc: 'Pas de problème — et c\'est gratuit, sans limite ! En bas du générateur, le bouton "✏️ À ma façon" te permet de saisir ton propre texte. Tu bénéficies de toutes les options de mise en forme (8 styles d\'écriture, taille, italique), des idées & modèles ("💡 Idées"), de la traduction, du poème, de la signature — exactement comme avec l\'IA, mais tu gardes le contrôle total sur le contenu.' },
  { n: '6',  emoji: '📊', title: 'Les 3 plans d\'utilisation de l\'appli', subSteps: [
    { emoji: '💜', title: 'Le plan Gratuit',             desc: 'Tu démarres avec des crédits offerts. En version gratuite : 5 créations IA par mois, 2 occasions (Anniversaire & Fête), 2 formats (Message & Humour). Des publicités apparaissent dans l\'app. Tu peux écrire tes messages manuellement, gratuitement et sans limite.' },
    { emoji: '✦',  title: 'Le plan Essentiel — 2,49 €/mois', desc: 'Le juste milieu ! 10 créations IA par mois, toutes les occasions (8), tous les formats (Chanson, Poème, Message, Humour), toutes les tonalités, 3 cagnottes actives, historique illimité — et zéro publicité.' },
    { emoji: '⭐', title: 'Le plan Premium — 4,99 €/mois',  desc: 'Le plan tout illimité ! Créations IA sans limite, studio d\'édition, QR code de partage, cagnottes illimitées, priorité serveur IA, support prioritaire — et bien sûr zéro publicité. Disponible aussi en annuel : 34,99 €/an (−42 %).' },
  ]},
  { n: '7',  emoji: '🎁', title: 'La cagnotte collective',          desc: 'Organise une cagnotte pour un cadeau commun. Donne un nom à ta cagnotte, choisis le/la bénéficiaire, fixe un objectif et éventuellement une date limite.\n\n🔗 Un lien de partage unique est généré automatiquement. Tu pourras l\'envoyer par SMS, WhatsApp ou email. Tes proches n\'auront pas besoin de télécharger l\'app — ils accèderont directement à une page de paiement sécurisée.\n\n🧾 Chaque contributeur reçoit automatiquement un justificatif comptable par email dès que son paiement est validé.\n\n⏳ La page de contribution en ligne et le suivi en temps réel seront disponibles lors du lancement officiel de l\'app.' },
  { n: '8',  emoji: '🎉', title: 'Envoie ton message',              desc: 'Choisis comment l\'envoyer : via WhatsApp, par SMS, par Email, ou en copiant le texte pour le coller où tu veux. Si tu as renseigné le numéro ou l\'email du contact, l\'app le pré-remplit automatiquement.\n\n🕐 Tu peux aussi choisir le moment idéal pour envoyer ton message. Si tu as renseigné la préférence d\'horaire de ton contact (matin, après-midi, soir) dans sa fiche, l\'app te l\'indique pour que tu envoies au bon moment !' },
  { n: '9',  emoji: '🤖', title: 'Les envois automatiques',         desc: 'Tu peux programmer l\'envoi automatique d\'un message d\'anniversaire ou de fête à un contact, par SMS ou par email — sans avoir à y penser le jour J !\n\nComment ça marche ?\n1. Va dans "Envois automatiques" depuis l\'accueil.\n2. Choisis un modèle de message parmi 10 propositions (festif, humoristique, touchant, poétique…) ou rédige le tien.\n3. Sélectionne un ou plusieurs contacts.\n4. Choisis le déclencheur (Anniversaire ou Fête du prénom) et le canal (SMS ou Email).\n5. Active l\'envoi — et oublie-le !\n\n🔔 La veille de chaque envoi programmé, tu reçois une notification de rappel : "Un SMS d\'anniversaire partira demain pour Marie". C\'est ta fenêtre pour annuler si besoin — par exemple si votre relation a changé entre-temps.\n\n⛔ Annuler un envoi : depuis la notification ou depuis l\'écran "Envois automatiques", il suffit de désactiver le toggle ou de supprimer l\'entrée. L\'envoi du lendemain sera automatiquement bloqué.\n\n♻️ L\'envoi se réactive automatiquement l\'année suivante — tu n\'as à configurer qu\'une seule fois pour ne plus jamais oublier un anniversaire !' },
  { n: '10', emoji: '⏰', title: 'Les rappels personnalisés',         desc: 'Crée des rappels sur mesure qui déclenchent une notification au bon moment — sans aucun automatisme, juste un coup de pouce au bon moment.\n\n📅 Hebdomadaire : "Appelle papa" → chaque dimanche\n🗓 Mensuel : "SMS à Marie" → le 15 de chaque mois\n🎯 Annuel : "Envoie des fleurs à maman" → chaque 25 mai\n📌 Une seule fois : rappel pour une date précise\n\nTu peux associer un contact à chaque rappel, les activer / désactiver à tout moment, et en supprimer sans affecter les autres.\n\nAccès : depuis l\'accueil → "Rappels personnalisés".' },
  { n: '11', emoji: '📜', title: 'Historique des messages',          desc: 'Retrouve tous les messages que tu as créés pour un contact, classés par année.\n\nAccès : fiche contact → "📜 Historique des messages".\n\nPour chaque message, tu vois :\n• Le format (chanson, poème, message, humour) et la tonalité\n• La date de création\n• Un aperçu du texte\n• Le statut : ✅ Envoyé ou ✏️ Brouillon\n• Le canal utilisé (WhatsApp, SMS, email…)\n\nUn tap sur un message ouvre son détail complet. En bas de la timeline, un bouton "✨ Créer un nouveau message" te ramène directement dans le générateur pour ce contact.' },
  { n: '12', emoji: '👥', title: 'Co-signer "De la part de nous tous"', desc: 'Tu peux inviter d\'autres personnes à co-signer un message avec toi — parfait pour un message "De la part de toute la famille" ou "De la part de l\'équipe" !\n\nComment ça marche ?\n1. Génère ton message dans le studio.\n2. Sur la page d\'aperçu, appuie sur "👥 Inviter à co-signer".\n3. Un lien unique est créé et partagé via ton appli de partage préférée.\n4. Les co-signataires ouvrent le lien, saisissent leur prénom et un petit mot optionnel, et appuient sur "✍️ Je co-signe".\n5. Dans la page du message, tu vois la liste des co-signataires : "Jean, Marie et 3 autres".\n6. Copie la liste pour l\'ajouter manuellement à ton message avant de l\'envoyer.\n\n✅ Aucune inscription requise pour les co-signataires — le lien fonctionne directement dans un navigateur.' },
  { n: '13', emoji: '📱', title: 'Le widget Android',                desc: 'Installe le widget ConfettiCake sur l\'écran d\'accueil de ton téléphone Android pour voir d\'un coup d\'œil les prochains anniversaires et fêtes — sans ouvrir l\'appli !\n\nComment l\'ajouter ?\n1. Maintiens ton doigt appuyé sur l\'écran d\'accueil de ton Android.\n2. Appuie sur "Widgets".\n3. Cherche "ConfettiCake" dans la liste.\n4. Glisse le widget où tu veux.\n\nLe widget affiche :\n🎁 Le prochain anniversaire (prénom + jours restants)\n🌸 La prochaine fête du prénom (prénom + jours restants)\n\nUn simple tap sur le widget ouvre directement l\'appli. Les données sont mises à jour automatiquement dès que tu ouvres l\'appli.' },
  { n: '14', emoji: '🎟️', title: 'Le parrainage',                   desc: 'Tu peux parrainer tes proches ET être parrainé·e :\n\n👉 Tu invites quelqu\'un : partage ton code depuis la page "Parrainage" ou "Mon profil". Dès que ton filleul s\'inscrit avec ton code, vous recevez chacun 5 crédits IA offerts. Plus tu parraines, plus tu envoies de messages gratuitement !\n\n👈 Quelqu\'un t\'a invité : lors de ton inscription, saisis le code que ton parrain t\'a communiqué dans le champ "Code parrainage (optionnel)". Vous recevrez chacun 5 crédits offerts automatiquement.' },
  { n: '15', emoji: '🎨', title: 'Personnalise les couleurs',        desc: 'L\'appli s\'adapte à ton style ! Dans Mon profil → "Couleur de l\'appli", choisis parmi 9 ambiances : Rose 🌸, Corail 🧡, Soleil 🌅, Océan 🔵, Nature 🌿, Prune 🍇, Or 💛, Gris 🩶 ou Noir 🖤. Le changement est immédiat sur toute l\'appli.' },
  { n: '16', emoji: '💑', title: 'Le mode couple',                   desc: 'Connecte ton compte avec celui de ton/ta partenaire pour partager vos agendas de contacts.\n\nComment ça marche ?\n1. L\'un de vous va dans "Mode couple" (accueil → "💑 Mode couple").\n2. Il crée une invitation → un code à 6 lettres s\'affiche (ex. ABCDEF).\n3. Il partage ce code à l\'autre.\n4. L\'autre saisit le code dans "Rejoindre avec un code".\n5. Le lien est activé !\n\nUne fois en mode couple :\n• Vous voyez chacun les contacts de l\'autre dans vos listes (avec le badge 💑).\n• Les anniversaires et fêtes du partenaire apparaissent dans l\'agenda principal.\n• Un bloc "Agenda de [prénom]" s\'affiche sur l\'accueil.\n\n💔 Dissocier le lien à tout moment depuis la page "Mode couple" → "Dissocier le mode couple". Les contacts redeviennent privés immédiatement.' },
  { n: '17', emoji: '🗓', title: 'Fêtes & Journées généralistes',   desc: 'En plus des anniversaires et fêtes de tes contacts, l\'appli te rappelle les grandes fêtes de l\'année :\n\n🎆 Jour de l\'An · ❤️ Saint-Valentin · 👵 Fête des grand-mères · 💜 Journée de la femme · 🐟 Poisson d\'avril · 🌹 Fête des secrétaires · 🌹 Fête du travail · 💐 Fête des mères · 🏘️ Fête des voisins · 🎵 Fête de la musique · 🔥 Saint-Jean · 👨 Fête des pères · 🤝 Journée de l\'amitié · 🐱 Journée du chat · 🐶 Journée du chien · 🎃 Halloween · 👒 Sainte-Catherine · 🎄 Noël\n\n📍 Où les trouver ?\n• Sur l\'accueil : un bloc "Les fêtes spéciales à venir" apparaît automatiquement quand une fête approche.\n• Dans le calendrier : clique sur "Les fêtes spéciales à venir" pour voir toutes les fêtes du mois.\n\n🔔 Tu reçois aussi une notification quelques jours avant chaque fête.\n\n✨ Pour les fêtes liées à des proches (Saint-Valentin, Fête des mères, Fête des pères, Halloween, Noël…), un bouton "Créer un message" t\'amène directement dans le générateur avec l\'occasion déjà pré-sélectionnée.' },

  { n: '18', emoji: '🎴', title: 'Les cartes animées',              desc: 'Envoie une carte animée unique à la place (ou en plus) d\'un message texte !\n\n🃏 Galerie : parcours plus de 60 cartes classées par occasion (anniversaire, mariage, noël, soutien…) et par genre (elle, lui, enfant). Chaque carte s\'anime avec le prénom de ton proche et, pour les anniversaires milestones, affiche son âge en grand ("Enfin 40 ans !").\n\n✨ Carte IA : un wizard en 5 étapes — tu choisis le contact, l\'occasion, le style visuel, le message, et la carte est générée automatiquement depuis nos templates.\n\n🔗 Partage : un simple lien (WhatsApp, email, SMS…) suffit. Ton proche clique et voit la carte animée directement dans son navigateur — aucune app à installer.\n\nAccès : footer → onglet Contacts → fiche contact → "Envoyer une carte 🎴", ou footer → Cartes.' },

  { n: '19', emoji: '🎛️', title: 'Mode Apprentissage & Mode Complet', desc: 'Confettis & Cake propose deux expériences selon ton niveau :\n\n🟣 Mode Apprentissage : navigation simplifiée, les 3 fonctions essentielles en avant (Message IA, Modèle, À ma façon), guides intermédiaires pour comprendre chaque étape. Idéal pour commencer.\n\n🟠 Mode Complet : toutes les fonctionnalités accessibles, navigation rapide avec raccourcis vers numérologie, zodiaque, compatibilité, cagnottes, cartes. Pour les utilisateurs qui connaissent déjà l\'appli.\n\n🔄 Changer de mode à tout moment : Paramètres → "Mode d\'affichage" → "Changer de mode". Tu retombes sur la page de sélection et tu choisis.' },

  { n: '20', emoji: '🌤️', title: 'Accueil intelligent',             desc: 'L\'écran d\'accueil s\'adapte à ta journée :\n\n🌤️ Météo en direct : la météo de ta ville s\'affiche avec un fond coloré selon les conditions (soleil, nuages, pluie, orage, neige). Appuie dessus pour voir les détails.\n\n🌸 Fête du jour : le prénom fêté aujourd\'hui s\'affiche automatiquement. Appuie sur "En savoir plus sur [prénom]" pour accéder à la fiche complète du prénom (signification, origine, numérologie…).\n\n📜 Dicton du jour : un dicton ou proverbe change chaque jour pour une touche de sagesse.\n\n📅 Agenda intégré : les événements des jours suivants (anniversaires, fêtes, rappels) s\'affichent directement sur l\'accueil, regroupés par période.' },

  { n: '21', emoji: '📖', title: 'Livre d\'or',                     desc: 'Le livre d\'or te permet de collecter des messages de tes proches sur une page partageable.\n\nComment ça marche ?\n1. Dans le footer → "Livre d\'or".\n2. Partage ton lien de livre d\'or via WhatsApp, SMS ou email.\n3. Tes proches ouvrent le lien, laissent un message et une note.\n4. Tous les messages apparaissent dans ton livre d\'or, classés chronologiquement.\n\nParfait pour un anniversaire, un mariage, une retraite : tous les proches contribuent sans avoir l\'app !' },

  { n: '22', emoji: '🔊', title: 'Lecture à voix haute (TTS)',      desc: 'Fais lire ton message à voix haute par une voix IA !\n\nDans l\'aperçu du message, appuie sur le bouton "🔊 Écouter le message". L\'IA génère un fichier audio avec une voix naturelle — tu peux écouter avant d\'envoyer, et même partager l\'audio directement.\n\n🎙️ Disponible en voix masculine et féminine. La langue de lecture suit automatiquement la langue de ton message.' },
];

// ── Démarrage rapide ────────────────────────────────────────────────────────
const QUICK_STEPS = [
  { n: '1', emoji: '👥', title: 'Ajouter un contact', desc: "Va dans l'onglet Contacts → bouton '+ Ajouter un contact 👤'. Renseigne le prénom et la date de naissance — c'est tout ce qu'il faut pour démarrer !", route: '/(app)/contacts' },
  { n: '2', emoji: '✨', title: 'Générer un message IA', desc: "Dans la fiche de ton contact, appuie sur 'Envoyer un message ✨'. Choisis l'occasion, le format et la tonalité — l'IA crée un texte unique en quelques secondes.", route: '/(app)/contacts' },
  { n: '3', emoji: '📤', title: 'Envoyer le message', desc: "Sur la page d'aperçu, choisis ton canal : WhatsApp 💬, SMS 📱, Email 📧 ou Copier 📋. Ton message est prêt à partir !", route: '/(app)/create' },
  { n: '4', emoji: '🔔', title: 'Activer les alertes', desc: "Dans Paramètres → Notifications, active les rappels pour ne plus jamais rater un anniversaire ou une fête !", route: '/(app)/settings' },
];

// ── FAQ ─────────────────────────────────────────────────────────────────────
interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  ctaLabel: string;
  onCta: (router: ReturnType<typeof useRouter>) => void;
}

const FAQ_ITEMS: FaqItem[] = [
  // Contacts & profil
  {
    id: 'faq_add_contact',
    category: 'Contacts & profil',
    question: 'Comment ajouter un contact ?',
    answer: "Dans le footer, appuie sur l'onglet Contacts, puis sur le bouton '+ Ajouter un contact 👤' en haut de l'écran.",
    ctaLabel: 'Voir Contacts ▶️',
    onCta: (router) => router.push('/(app)/contacts' as never),
  },
  {
    id: 'faq_civility',
    category: 'Contacts & profil',
    question: 'Comment modifier ma Civilité ?',
    answer: "Dans Mon Profil, appuie sur 'Modifier mon profil ✏️', puis modifie le champ Civilité (M. / Mme).",
    ctaLabel: 'Voir Mon profil ▶️',
    onCta: (router) => router.push('/(app)/profile' as never),
  },
  {
    id: 'faq_pet',
    category: 'Contacts & profil',
    question: 'Comment ajouter un animal de compagnie ?',
    answer: "Dans la fiche d'un contact, va dans la section 'Nature de ta relation', appuie sur 'Animal de compagnie 🐾' puis sur '+ Ajouter un animal'.",
    ctaLabel: 'Voir mes contacts ▶️',
    onCta: (router) => router.push('/(app)/contacts' as never),
  },
  {
    id: 'faq_child',
    category: 'Contacts & profil',
    question: 'Comment ajouter l\'enfant d\'un contact ?',
    answer: "Dans la fiche d'un contact (ex : Sophie), descends jusqu'à la section 'Enfants 👶' et appuie sur '+ Ajouter un enfant'. Tu renseignes le prénom, le genre, la date de naissance et la fête.\n\nEn faisant ça, tu débloques deux super fonctions :\n🎂 Envoyer un message à Sophie pour l'anniversaire ou la fête de son enfant\n💌 Générer un message comme si c'était l'enfant qui écrivait à Sophie (ou à son père) — 'Bon anni Maman !' — avec des modèles drôles et touchants\n🎴 Accompagner le message d'une carte animée\n\nSi tu lies Sophie à son partenaire via la section 'Partenaire 💑', l'enfant apparaît automatiquement dans la fiche du partenaire. Pas besoin de le saisir deux fois !",
    ctaLabel: 'Voir mes contacts ▶️',
    onCta: (router) => router.push('/(app)/contacts' as never),
  },
  {
    id: 'faq_interests',
    category: 'Contacts & profil',
    question: 'Comment renseigner les centres d\'intérêt ?',
    answer: "Dans la fiche d'un contact, descends jusqu'à la section 'Centres d'intérêt' et appuie sur '+ Ajouter un centre d'intérêt'.",
    ctaLabel: 'Voir mes contacts ▶️',
    onCta: (router) => router.push('/(app)/contacts' as never),
  },
  // Messages & envois
  {
    id: 'faq_send_msg',
    category: 'Messages & envois',
    question: 'Comment envoyer un message personnalisé ?',
    answer: "Dans la fiche d'un contact, appuie sur le bouton 'Envoyer un message ✨'. L'IA génère un message unique selon l'occasion.",
    ctaLabel: 'Voir mes contacts ▶️',
    onCta: (router) => router.push('/(app)/contacts' as never),
  },
  {
    id: 'faq_auto_send',
    category: 'Messages & envois',
    question: 'Comment programmer un envoi automatique ?',
    answer: "Dans la fiche d'un contact, va dans la section 'Envoi automatique' et appuie sur 'Activer le pilote automatique 🤖'.",
    ctaLabel: 'Voir les envois auto ▶️',
    onCta: (router) => router.push('/(app)/auto-sends' as never),
  },
  {
    id: 'faq_music',
    category: 'Messages & envois',
    question: 'Comment ajouter une musique à mon message ?',
    answer: "Dans l'écran de composition du message (après avoir choisi un contact et une occasion), descends jusqu'à la section 'Ajouter une musique 🎵' et choisis une ambiance.",
    ctaLabel: 'Créer un message ▶️',
    onCta: (router) => router.push('/(app)/create' as never),
  },
  {
    id: 'faq_writing_style',
    category: 'Messages & envois',
    question: 'Comment changer le style d\'écriture ?',
    answer: "Dans l'écran de composition du message, descends jusqu'à la section 'Style d'écriture ✍️'. Choisis parmi 8 styles : Standard, Manuscrit gras, Élégant, Romantique, Enfantin, Calligraphie, Vintage, Comic.",
    ctaLabel: 'Créer un message ▶️',
    onCta: (router) => router.push('/(app)/create' as never),
  },
  // Notifications
  {
    id: 'faq_notif_enable',
    category: 'Notifications',
    question: 'Comment activer les notifications ?',
    answer: "Dans Paramètres → Notifications, appuie sur le bouton 'Activer les notifications 🔔'. L'appli demandera l'autorisation sur ton téléphone.",
    ctaLabel: 'Voir Paramètres ▶️',
    onCta: (router) => router.push('/(app)/settings' as never),
  },
  {
    id: 'faq_notif_freq',
    category: 'Notifications',
    question: 'Comment gérer la fréquence des notifications ?',
    answer: "Dans Paramètres → Notifications, accède à 'Fréquence des rappels' pour choisir combien de jours avant l'événement tu veux être notifié·e.",
    ctaLabel: 'Voir Paramètres ▶️',
    onCta: (router) => router.push('/(app)/settings' as never),
  },
  {
    id: 'faq_notif_missing',
    category: 'Notifications',
    question: 'Pourquoi je ne reçois pas de notifications ?',
    answer: "Dans Paramètres → Notifications, appuie sur 'Vérifier les autorisations du téléphone' — ce bouton ouvre directement les paramètres de notifications de ton téléphone pour que tu puisses vérifier que les notifications sont autorisées.",
    ctaLabel: 'Vérifier ▶️',
    onCta: (router) => router.push('/(app)/settings' as never),
  },
  // Numérologie & astrologie
  {
    id: 'faq_numerologie',
    category: 'Numérologie & astrologie',
    question: 'Comment fonctionne la numérologie ?',
    answer: "Dans le footer, appuie sur Explorer. Saisis un prénom pour ouvrir sa fiche → descends jusqu'à la section 'Signification numérologique' pour voir le chemin de vie, le chiffre du destin et plus encore.",
    ctaLabel: 'Voir Explorer ▶️',
    onCta: (router) => router.push('/(app)/explore/prenoms' as never),
  },
  {
    id: 'faq_chemin_vie',
    category: 'Numérologie & astrologie',
    question: 'Qu\'est-ce que le chemin de vie ?',
    answer: "Dans la fiche d'un contact, descends jusqu'à la section 'Signification numérologique' et consulte le bloc 'Chemin de vie'. C'est le chiffre calculé depuis la date de naissance — il révèle la mission de vie d'une personne.",
    ctaLabel: 'Voir mes contacts ▶️',
    onCta: (router) => router.push('/(app)/contacts' as never),
  },
  {
    id: 'faq_compat',
    category: 'Numérologie & astrologie',
    question: 'Comment fonctionne la compatibilité ?',
    answer: "Dans la fiche d'un contact, appuie sur le bouton 'Compatibilité avec [prénom du contact]' pour accéder à l'analyse complète de votre compatibilité astrologique et numérologique.",
    ctaLabel: 'Voir Compatibilité ▶️',
    onCta: (router) => router.push('/(app)/couple' as never),
  },
  // Cartes & nouveautés
  {
    id: 'faq_carte_animee',
    category: 'Cartes & nouveautés',
    question: 'Comment envoyer une carte animée ?',
    answer: "Dans le footer → Contacts → fiche contact → 'Envoyer une carte 🎴'. Ou depuis l'accueil (mode complet) → 'Cartes animées'.\n\nTon proche reçoit un simple lien — en l'ouvrant il découvre la carte animée sans avoir besoin de l'appli.\n\nCe que tu peux personnaliser :\n• ✍️ Titre — remplace le texte d'en-tête par ce que tu veux (ex : 'Joyeux Noël', 'Bon courage')\n• 💬 Message personnel — texte affiché dans un encadré en bas de la carte (max. 500 caractères)\n• 🎨 Fond du message — s'adapte automatiquement au thème choisi, ou choisis parmi 7 couleurs (Violet, Rouge, Rose, Bleu, Vert, Or, Noir)\n• 📸 Photo — selfie, galerie ou photo du contact, avec choix de la taille (Petite / Moyenne / Grande) et de la forme (Ronde / Carrée)\n• 🎵 Musique — 8 ambiances au choix (Festive, Piano, Guitare, Jazz…)\n• 🎊 Animation — 7 thèmes de particules (Confetti, Cœurs, Étoiles, Ballons, Pétales, Flocons, Feux d'artifice)\n• 📡 Mode Morse — le message personnel est converti en points et tirets. Le destinataire reçoit un message d'accroche ("Tu as reçu un message secret en code Morse !"), puis sur la carte il peut écouter les bips audio, lire le code affiché, et révéler le texte original d'un tap sur "🔓 Révéler le message" 🤫",
    ctaLabel: 'Voir les cartes ▶️',
    onCta: (router) => router.push('/(app)/cards' as never),
  },
  {
    id: 'faq_changer_mode',
    category: 'Cartes & nouveautés',
    question: 'Comment passer du Mode Apprentissage au Mode Complet ?',
    answer: "Va dans Paramètres → section 'Mode d'affichage' → bouton 'Changer de mode'. La page de sélection s'affiche — choisis ton mode et appuie sur le bouton correspondant.",
    ctaLabel: 'Voir Paramètres ▶️',
    onCta: (router) => router.push('/(app)/settings' as never),
  },
  {
    id: 'faq_traduction',
    category: 'Cartes & nouveautés',
    question: 'Comment traduire mon message dans une autre langue ?',
    answer: "Dans l'aperçu de ton message (après génération ou saisie), appuie sur le bouton fixe '🌍 Traduire ce message'. Choisis la langue cible (Anglais, Espagnol, Allemand, Italien, Portugais) — l'IA traduit en quelques secondes. Le bouton '↩ Texte original' te permet de revenir à la version initiale.",
    ctaLabel: 'Créer un message ▶️',
    onCta: (router) => router.push('/(app)/create' as never),
  },
  {
    id: 'faq_poeme',
    category: 'Cartes & nouveautés',
    question: 'Comment réécrire mon message en poème ?',
    answer: "Dans l'aperçu du message, appuie sur le bouton '🎭 En poème ✍️'. L'IA réécrit ton message en 2-3 strophes de 4 vers avec des rimes, en conservant le sens, le destinataire et les émojis. Le bouton '↩ Texte original' te permet de revenir au texte initial.",
    ctaLabel: 'Créer un message ▶️',
    onCta: (router) => router.push('/(app)/create' as never),
  },
  {
    id: 'faq_livre_or',
    category: 'Cartes & nouveautés',
    question: 'Comment utiliser le livre d\'or ?',
    answer: "Dans le footer → onglet 'Livre d'or'. Partage ton lien avec tes proches. Ils ouvrent le lien dans leur navigateur (sans app), laissent un message et une note. Tous les messages s'affichent dans ton livre d'or en temps réel.",
    ctaLabel: 'Voir le livre d\'or ▶️',
    onCta: (router) => router.push('/(app)/guestbook' as never),
  },

  // Technique
  {
    id: 'faq_backup',
    category: 'Technique',
    question: 'Comment sauvegarder mes données ?',
    answer: "Dans Paramètres → section Sauvegarde, appuie sur 'Sauvegarder maintenant 💾'. Tu peux aussi exporter tes données via 'Exporter mes données 📥'.",
    ctaLabel: 'Voir Paramètres ▶️',
    onCta: (router) => router.push('/(app)/settings' as never),
  },
  {
    id: 'faq_new_phone',
    category: 'Technique',
    question: 'Comment changer de téléphone ?',
    answer: "Installe Confetticake sur ton nouveau téléphone et connecte-toi avec le même compte Google, Apple ou email qu'avant. Toutes tes données (contacts, messages, préférences) sont restaurées automatiquement.",
    ctaLabel: 'Voir Mon compte ▶️',
    onCta: (router) => router.push('/(app)/settings' as never),
  },
  {
    id: 'faq_delete',
    category: 'Technique',
    question: 'Comment supprimer mon compte ?',
    answer: "Dans Paramètres → section Mon compte, appuie sur 'Supprimer mon compte 🗑️'. Une confirmation en 2 étapes est demandée (lecture de l'avertissement + saisie de ton email).",
    ctaLabel: 'Voir Mon compte ▶️',
    onCta: (router) => router.push('/(app)/settings' as never),
  },
];

// ── Sections ─────────────────────────────────────────────────────────────────
type Section = 'start' | 'faq' | 'guide' | 'video' | 'contact';

const SECTIONS: { key: Section; emoji: string; label: string }[] = [
  { key: 'start',   emoji: '🎯', label: 'Démarrage'      },
  { key: 'faq',     emoji: '❓', label: 'FAQ'             },
  { key: 'guide',   emoji: '📚', label: "Modes d'emploi" },
  { key: 'video',   emoji: '🎬', label: 'Tutoriel'       },
  { key: 'contact', emoji: '📩', label: 'Contact'        },
];

// ── FAQ Categories ─────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [...new Set(FAQ_ITEMS.map((f) => f.category))];

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HelpScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const [section, setSection] = useState<Section>('start');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Contact support form
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);

  useTabScrollToTop('help', () => scrollRef.current?.scrollTo({ y: 0, animated: false }));

  const handleSupportSend = async () => {
    if (!supportEmail.trim() || !supportMsg.trim()) {
      Alert.alert('Champs requis', 'Merci de renseigner ton email et ton message.');
      return;
    }
    setSupportLoading(true);
    try {
      await Linking.openURL(
        `mailto:support@confetticake.fr?subject=Support Confetticake&body=${encodeURIComponent(`De : ${supportEmail}\n\n${supportMsg}`)}`
      );
    } catch {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le client email. Écris-nous à support@confetticake.fr');
    } finally {
      setSupportLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="📖 Aide & Mode d'emploi" />

      {/* Section selector — 2 lignes */}
      <View style={styles.sectionGrid}>
        {/* Ligne 1 : 3 onglets */}
        <View style={styles.sectionRow}>
          {SECTIONS.slice(0, 3).map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sectionTab, section === s.key && { borderColor: C.primary, backgroundColor: C.primaryContainer + '40' }]}
              onPress={() => { setSection(s.key); scrollRef.current?.scrollTo({ y: 0, animated: true }); }}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionTabEmoji}>{s.emoji}</Text>
              <Text style={[styles.sectionTabLabel, section === s.key && { color: C.primary }]}>{s.label}</Text>
              {section === s.key && <View style={[styles.sectionActiveLine, { backgroundColor: C.primary }]} />}
            </TouchableOpacity>
          ))}
        </View>
        {/* Ligne 2 : 2 onglets */}
        <View style={styles.sectionRow}>
          {SECTIONS.slice(3).map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sectionTab, styles.sectionTabWide, section === s.key && { borderColor: C.primary, backgroundColor: C.primaryContainer + '40' }]}
              onPress={() => { setSection(s.key); scrollRef.current?.scrollTo({ y: 0, animated: true }); }}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionTabEmoji}>{s.emoji}</Text>
              <Text style={[styles.sectionTabLabel, section === s.key && { color: C.primary }]}>{s.label}</Text>
              {section === s.key && <View style={[styles.sectionActiveLine, { backgroundColor: C.primary }]} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Guide A-Z ───────────────────────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/(app)/glossaire' as never)}
          activeOpacity={0.85}
          style={{ marginBottom: Spacing[4], backgroundColor: C.primaryContainer, borderRadius: Radii.xl, padding: Spacing[4], flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.primary + '40' }}
        >
          <Text style={{ fontSize: 28 }}>📚</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: C.primary }}>Guide A-Z de l'appli</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 2, lineHeight: 17 }}>Toutes les fonctions classées par ordre alphabétique, avec barre de recherche.</Text>
          </View>
          <Text style={{ color: C.primary, fontSize: 20 }}>›</Text>
        </TouchableOpacity>

        {/* ── 🚀 Démarrage rapide ─────────────────────── */}
        {section === 'start' && (
          <>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>🚀 Démarrage rapide</Text>
              <Text style={styles.pageSub}>En 4 étapes, tu es prêt·e !</Text>
            </View>
            <View style={styles.stepsCard}>
              {QUICK_STEPS.map((step, i) => (
                <View key={step.n}>
                  <View style={styles.stepRow}>
                    <View style={[styles.stepBadge, { backgroundColor: C.primary }]}>
                      <Text style={styles.stepBadgeText}>{step.n}</Text>
                    </View>
                    <View style={styles.stepBody}>
                      <Text style={styles.stepTitle}>{step.emoji}  {step.title}</Text>
                      <Text style={styles.stepDesc}>{step.desc}</Text>
                      <TouchableOpacity
                        style={[styles.ctaSmall, { backgroundColor: C.primaryContainer }]}
                        onPress={() => router.navigate(step.route as never)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.ctaSmallText, { color: C.primary }]}>Voir comment faire ▶️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {i < QUICK_STEPS.length - 1 && <View style={styles.stepDivider} />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── ❓ FAQ ────────────────────────────────────── */}
        {section === 'faq' && (
          <>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>❓ Questions fréquentes</Text>
              <Text style={styles.pageSub}>Clique sur une question pour la déplier</Text>
            </View>
            {FAQ_CATEGORIES.map((cat) => (
              <View key={cat} style={styles.faqCatBlock}>
                <Text style={[styles.faqCatTitle, { color: C.primary }]}>{cat}</Text>
                <View style={styles.faqCard}>
                  {FAQ_ITEMS.filter((f) => f.category === cat).map((faq, i, arr) => (
                    <View key={faq.id}>
                      <TouchableOpacity
                        style={styles.faqRow}
                        onPress={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.faqQuestion} numberOfLines={openFaqId === faq.id ? undefined : 2}>
                          {faq.question}
                        </Text>
                        <Text style={[styles.faqChevron, { color: C.primary }]}>
                          {openFaqId === faq.id ? '▲' : '▼'}
                        </Text>
                      </TouchableOpacity>
                      {openFaqId === faq.id && (
                        <View style={styles.faqAnswer}>
                          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                          <TouchableOpacity
                            style={[styles.faqCta, { backgroundColor: C.primary }]}
                            onPress={() => faq.onCta(router)}
                            activeOpacity={0.85}
                          >
                            <Text style={styles.faqCtaText}>{faq.ctaLabel}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {i < arr.length - 1 && <View style={styles.stepDivider} />}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}

        {/* ── 📖 Guide complet ─────────────────────────── */}
        {section === 'guide' && (
          <>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>📖 Mode d'emploi complet</Text>
              <Text style={styles.pageSub}>Toutes les fonctionnalités expliquées</Text>
            </View>
            <View style={styles.stepsCard}>
              {STEPS.map((step, i) => (
                <View key={step.n}>
                  <View style={styles.stepRow}>
                    <View style={[styles.stepBadge, { backgroundColor: C.primary }]}>
                      <Text style={styles.stepBadgeText}>{step.n}</Text>
                    </View>
                    <View style={styles.stepBody}>
                      <Text style={styles.stepTitle}>{step.emoji}  {step.title}</Text>
                      {step.desc ? (
                        <Text style={styles.stepDesc}>{step.desc}</Text>
                      ) : step.subSteps ? (
                        <View style={styles.subStepsList}>
                          {step.subSteps.map((sub, j) => (
                            <View key={j} style={styles.subStepItem}>
                              <Text style={styles.subStepTitle}>{sub.emoji}  {sub.title}</Text>
                              <Text style={styles.stepDesc}>{sub.desc}</Text>
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </View>
                  {i < STEPS.length - 1 && <View style={styles.stepDivider} />}
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.notionBtn}
              onPress={() => Linking.openURL(Config.manualUrl)}
              activeOpacity={0.85}
            >
              <Text style={styles.notionBtnEmoji}>📖</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notionBtnTitle}>Version complète en ligne</Text>
                <Text style={styles.notionBtnSub}>Ouvrir le mode d'emploi dans le navigateur</Text>
              </View>
              <Text style={[styles.notionBtnArrow, { color: C.primary }]}>›</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── 🎬 Tutoriel vidéo ────────────────────────── */}
        {section === 'video' && (
          <>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>🎬 Tutoriel vidéo</Text>
              <Text style={styles.pageSub}>Regarde Confetticake en action</Text>
            </View>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoEmoji}>🎬</Text>
              <Text style={styles.videoTitle}>Tutoriel vidéo — bientôt disponible !</Text>
              <Text style={styles.videoText}>
                {'Un tutoriel vidéo complet est en cours de préparation. Il couvrira toutes les fonctionnalités principales de l\'appli 💛\n\nEn attendant, consulte le guide complet ou contacte le support.'}
              </Text>
              <TouchableOpacity
                style={[styles.videoBtn, { backgroundColor: C.primary }]}
                onPress={() => setSection('guide')}
                activeOpacity={0.85}
              >
                <Text style={styles.videoBtnText}>📖 Voir le guide complet</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── 📩 Contact support ───────────────────────── */}
        {section === 'contact' && (
          <>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>📩 Contacter le support</Text>
              <Text style={styles.pageSub}>On te répond sous 24h 💛</Text>
            </View>
            <View style={styles.contactCard}>
              <Text style={styles.contactLabel}>Ton adresse email</Text>
              <TextInput
                style={styles.contactInput}
                value={supportEmail}
                onChangeText={setSupportEmail}
                placeholder="ton@email.com"
                placeholderTextColor={Colors.outlineVariant}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={[styles.contactLabel, { marginTop: 12 }]}>Ton message</Text>
              <TextInput
                style={[styles.contactInput, styles.contactTextArea]}
                value={supportMsg}
                onChangeText={setSupportMsg}
                placeholder="Décris ton problème ou ta question..."
                placeholderTextColor={Colors.outlineVariant}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.contactSendBtn, { backgroundColor: C.primary }, (!supportEmail.trim() || !supportMsg.trim()) && { opacity: 0.5 }]}
                onPress={handleSupportSend}
                disabled={!supportEmail.trim() || !supportMsg.trim() || supportLoading}
                activeOpacity={0.85}
              >
                {supportLoading
                  ? <ActivityIndicator size="small" color={Colors.white} />
                  : <Text style={styles.contactSendBtnText}>📩 Envoyer</Text>}
              </TouchableOpacity>
              <Text style={styles.contactNote}>
                Tu peux aussi nous écrire directement à support@confetticake.fr
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 80, gap: 16, paddingTop: 8 },

  sectionGrid: {
    paddingHorizontal: Spacing[3], paddingVertical: Spacing[2], gap: 8,
    borderBottomWidth: 0.5, borderBottomColor: Colors.surfaceContainerHighest,
  },
  sectionRow: { flexDirection: 'row', gap: 8 },
  sectionTab: {
    flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6,
    borderRadius: Radii.lg, borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHighest, backgroundColor: Colors.white,
    position: 'relative', gap: 3,
  },
  sectionTabWide: { flex: 1 },
  sectionTabActive: {},
  sectionTabEmoji: { fontSize: 18 },
  sectionTabLabel: {
    fontFamily: 'BeVietnamPro_600SemiBold', fontSize: 11,
    color: Colors.onSurfaceVariant, textAlign: 'center',
  },
  sectionActiveLine: {
    position: 'absolute', bottom: 0, left: 4, right: 4, height: 2, borderRadius: 1,
  },

  pageHeader: { paddingHorizontal: Spacing[4], paddingTop: Spacing[2], alignItems: 'center' },
  pageTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography['2xl'], color: Colors.onSurface,
  },
  pageSub: {
    fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md,
    color: C.primary, marginTop: 4,
  },

  stepsCard: {
    marginHorizontal: Spacing[4],
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    overflow: 'hidden', ...Shadows.sm,
  },
  stepRow: { flexDirection: 'row', padding: Spacing[4], gap: 14, alignItems: 'flex-start' },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
  },
  stepBadgeText: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.sm, color: Colors.white },
  stepBody: { flex: 1, gap: 6 },
  subStepsList: { gap: 12, marginTop: 6 },
  subStepItem: { gap: 3, paddingLeft: 4, borderLeftWidth: 2, borderLeftColor: Colors.surfaceContainerHighest },
  subStepTitle: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface },
  stepTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.md, color: Colors.onSurface },
  stepDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.md, color: Colors.onSurface, lineHeight: 22 },
  stepDivider: { height: 0.5, backgroundColor: Colors.surfaceContainer, marginLeft: Spacing[4] },
  ctaSmall: {
    alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: Radii.full, marginTop: 4,
  },
  ctaSmallText: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm },

  // FAQ
  faqCatBlock: { paddingHorizontal: Spacing[4], gap: 8 },
  faqCatTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  faqCard: { backgroundColor: Colors.white, borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.sm },
  faqRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing[4], paddingVertical: Spacing[3], gap: 8,
  },
  faqQuestion: { flex: 1, fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.base, color: Colors.onSurface },
  faqChevron: { fontSize: 12, fontFamily: 'BeVietnamPro_700Bold' },
  faqAnswer: {
    paddingHorizontal: Spacing[4], paddingBottom: Spacing[3],
    gap: 10, borderTopWidth: 0.5, borderTopColor: Colors.surfaceContainer,
  },
  faqAnswerText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurface, lineHeight: 22, paddingTop: Spacing[3] },
  faqCta: {
    alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: Radii.full,
  },
  faqCtaText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.sm, color: Colors.white },

  // Video
  videoPlaceholder: {
    marginHorizontal: Spacing[4], backgroundColor: Colors.white,
    borderRadius: Radii.xl, padding: Spacing[6], alignItems: 'center', gap: 14, ...Shadows.sm,
  },
  videoEmoji: { fontSize: 56 },
  videoTitle: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.lg, color: Colors.onSurface, textAlign: 'center' },
  videoText: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 24 },
  videoBtn: { borderRadius: Radii.full, paddingVertical: 13, paddingHorizontal: 24, ...Shadows.sm },
  videoBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },

  // Contact form
  contactCard: {
    marginHorizontal: Spacing[4], backgroundColor: Colors.white,
    borderRadius: Radii.xl, padding: Spacing[5], gap: 4, ...Shadows.sm,
  },
  contactLabel: { fontFamily: 'BeVietnamPro_600SemiBold', fontSize: Typography.sm, color: Colors.onSurface },
  contactInput: {
    borderWidth: 1.5, borderColor: Colors.surfaceContainerHighest, borderRadius: Radii.lg,
    paddingHorizontal: Spacing[3], paddingVertical: 11,
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurface,
    marginTop: 6,
  },
  contactTextArea: { height: 120, textAlignVertical: 'top' },
  contactSendBtn: { borderRadius: Radii.full, paddingVertical: 13, alignItems: 'center', marginTop: 8, ...Shadows.sm },
  contactSendBtnText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.white },
  contactNote: {
    fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.xs,
    color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 4,
  },

  // Notion button
  notionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: Spacing[4], padding: Spacing[4],
    backgroundColor: Colors.white, borderRadius: Radii.xl,
    borderWidth: 1.5, borderColor: C.primaryContainer, ...Shadows.sm,
  },
  notionBtnEmoji: { fontSize: 28 },
  notionBtnTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: Typography.md, color: Colors.onSurface },
  notionBtnSub: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, marginTop: 2 },
  notionBtnArrow: { fontSize: 22, lineHeight: 26 },
  });
}
