import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '../../src/hooks/useColors';
import { Colors, Spacing, Typography, Radii } from '../../src/constants/theme';
import { BackHeader } from '../../src/components/ui/BackHeader';

type Entry = {
  letter: string;
  term: string;
  desc: string;
  route?: string;
};

const ENTRIES: Entry[] = [
  {
    letter: 'A',
    term: 'Agenda',
    desc: "L'Agenda est ton calendrier personnel intelligent. Il regroupe automatiquement tous les anniversaires, fêtes et événements de tes contacts dans un seul endroit.\n\nChaque date apparaît dans l'ordre chronologique avec le nombre de jours restants. Plus besoin de fouiller dans ton téléphone pour savoir qui fête son anniversaire cette semaine.\n\nL'Agenda est mis à jour automatiquement dès que tu ajoutes ou modifies un contact. Tu peux naviguer de semaine en semaine pour anticiper les événements à venir.",
    route: '/(app)/agenda',
  },
  {
    letter: 'A',
    term: 'Alertes',
    desc: "Les Alertes (ou Rappels) sont des notifications que tu crées manuellement pour ne pas oublier un événement.\n\nPour créer une alerte :\n1. Va dans la section \"Rappels\" (accessible depuis le menu)\n2. Appuie sur \"+ Nouveau rappel\"\n3. Donne un titre, choisis un contact et une date ou récurrence\n4. Active ou désactive chaque rappel avec le bouton on/off de la liste\n\nExemples d'utilisation :\n• Un rappel annuel pour l'anniversaire de ta mère\n• Un rappel mensuel pour appeler un ami\n• Un rappel unique pour ne pas oublier un événement particulier\n\nTu peux modifier, supprimer ou activer/désactiver chaque rappel à tout moment depuis la liste.",
    route: '/(app)/reminders',
  },
  {
    letter: 'A',
    term: 'Animaux',
    desc: "La section Animaux te permet de créer un contact pour l'animal de compagnie d'un proche.\n\nElle ouvre deux possibilités originales :\n\n• Envoyer un message À l'animal — tu souhaites un joyeux anniversaire à l'animal, et son propriétaire reçoit ce message attendrissant.\n\n• Envoyer un message DE la part de l'animal — l'IA écrit comme si c'était l'animal qui parlait ! \"Waf waf, joyeux anniversaire ! Je t'apporte ma baballe en cadeau 🐾\"\n\nIdéal pour les familles qui adorent leur animal et veulent apporter un moment de douceur et d'humour.",
    route: '/(app)/animaux',
  },
  {
    letter: 'C',
    term: 'Cagnotte',
    desc: "La Cagnotte permet d'organiser une collecte d'argent en groupe pour offrir un cadeau commun.\n\nTu définis un objectif (ex : 150€ pour un dîner), une date limite, et tu partages un lien de paiement avec les participants. Chacun contribue à hauteur de ce qu'il souhaite, directement en ligne.\n\nTu suis en temps réel les contributions et tu reçois une notification à chaque participation. À la date limite, les fonds sont disponibles.\n\nParfait pour les cadeaux d'anniversaire entre amis, les départs à la retraite ou les événements en famille.",
    route: '/(app)/pot',
  },
  {
    letter: 'C',
    term: 'Calendrier',
    desc: "Le Calendrier affiche tous les événements de tes contacts dans une vue mensuelle, comme un agenda papier.\n\nLes jours avec un événement sont mis en évidence. Tu peux naviguer de mois en mois pour planifier à l'avance.\n\nContrairement à l'Agenda qui liste les événements dans l'ordre, le Calendrier te donne une vue d'ensemble visuelle pour voir en un coup d'œil les mois chargés.",
    route: '/(app)/calendar',
  },
  {
    letter: 'C',
    term: 'Cartes animées',
    desc: "Les Cartes animées te permettent d'envoyer une carte qui s'anime, avec confettis, musique et le prénom de ton proche, en plus ou à la place d'un message texte.\n\n🃏 Galerie — parcours plus de 60 cartes classées par occasion (anniversaire, mariage, Noël, soutien…) et par genre (elle, lui, enfant). Pour les anniversaires marquants, l'âge s'affiche en grand (\"Enfin 40 ans !\").\n\n✨ Carte IA — un wizard en 5 étapes (contact, occasion, style visuel, message) génère une carte personnalisée automatiquement à partir de nos templates.\n\n🔗 Partage — ton proche reçoit un simple lien et découvre la carte animée directement dans son navigateur, sans avoir besoin d'installer l'appli.",
    route: '/(app)/cards',
  },
  {
    letter: 'C',
    term: 'Compatibilité',
    desc: "La Compatibilité astrologique calcule l'entente entre toi et un contact selon vos deux signes du zodiaque.\n\nElle analyse plusieurs dimensions : la compatibilité en amour, en amitié, au travail et en communication. Chaque dimension est notée et expliquée clairement.\n\nC'est un contenu fun et original, parfait pour briser la glace, taquiner un ami ou en apprendre plus sur vos affinités. Aucune valeur scientifique — mais beaucoup de plaisir !",
    route: '/(app)/compat',
  },
  {
    letter: 'C',
    term: 'Contact Enfant',
    desc: "Le Contact Enfant permet de créer une fiche pour l'enfant d'un de tes contacts, et de générer des messages comme si c'était l'enfant qui les écrivait.\n\nExemple : pour l'anniversaire de la maman, l'IA écrit à sa place — \"Bonne fête Maman ! Tu es la meilleure maman du monde 💛\" — et c'est toi qui envoies le lien.\n\n── Comment faire ? ──\n\n1. Va dans \"Mes contacts\" et ouvre la fiche du parent (ex : la maman)\n2. Fais défiler jusqu'à la section \"Enfants 👶\"\n3. Appuie sur \"Ajouter un enfant\"\n4. Renseigne le prénom de l'enfant, son sexe et sa date de naissance\n5. Valide\n\nL'enfant est maintenant lié à ce parent. Sur la fiche du parent, tu verras apparaître un bouton 💌 \"De la part de [prénom enfant]\" qui lance directement la création d'un message signé par l'enfant.\n\nTrès utile pour les petits qui ne savent pas encore écrire, ou pour surprendre un parent avec un message qui vient vraiment du cœur.",
    route: '/(app)/contacts',
  },
  {
    letter: 'C',
    term: 'Contacts',
    desc: "Les Contacts sont le cœur de ConfettiCake. C'est ton carnet d'adresses enrichi.\n\nPour chaque contact, tu peux renseigner :\n• Prénom et nom\n• Date de naissance et/ou fête\n• Relation (ami, famille, collègue…)\n• Photo, notes, couleur préférée, langue…\n\nPlus un profil contact est complet, plus les messages générés par l'IA seront personnalisés et pertinents.\n\n🐾 Tu peux aussi ajouter l'animal de compagnie d'un contact directement depuis sa fiche, section \"Animaux de compagnie\".\n\nPourquoi ? Parce que ConfettiCake peut alors faire écrire l'animal ! L'IA rédige un message comme si c'était Rex ou Minou qui tenait la plume — hilarant, attendrissant, et totalement inattendu pour la personne qui le reçoit 💛\n\nTu peux créer des contacts manuellement, les importer depuis ton téléphone, ou les recevoir via un lien de partage.",
    route: '/(app)/contacts',
  },
  {
    letter: 'C',
    term: 'Crédits IA',
    desc: "Les Crédits IA sont la monnaie de ConfettiCake pour la génération de messages par l'intelligence artificielle.\n\nChaque fois que tu demandes à l'IA de créer un nouveau message, cela coûte 1 crédit. En revanche, régénérer ou modifier un message déjà créé est toujours gratuit.\n\nTu commences avec des crédits offerts. Tu peux en obtenir davantage en parrainant des amis (5 crédits offerts à chaque parrainage réussi), ou en passant au plan Premium qui donne des créations illimitées.\n\nConsulte ton solde à tout moment dans le Tableau de bord.",
    route: '/(app)/dashboard',
  },
  {
    letter: 'D',
    term: 'Diffusion groupée',
    desc: "La Diffusion groupée envoie un même message festif à plusieurs contacts à la fois, en un seul geste — idéal pour souhaiter la bonne année, joyeux Noël ou de joyeuses Pâques à toute ta liste sans recommencer pour chacun.\n\nComment faire ?\n1. Va dans \"Diffusion groupée\" (accueil → 📢)\n2. Choisis l'occasion (Nouvel An, Noël, Pâques, Saint-Valentin, fête des mères/pères, Halloween, ou simple coucou)\n3. Choisis un ton (tu/vous) et une longueur, puis un modèle proposé — ou écris ton propre texte \"à ma façon\"\n4. Sélectionne les contacts qui recevront le message (un par un, ou \"Tout sélectionner\")\n5. Choisis le canal (SMS ou Email) et appuie sur \"Envoyer maintenant\"\n\nChaque contact reçoit le message avec son prénom inséré automatiquement. C'est un envoi ponctuel, à la différence des Envois automatiques qui se répètent chaque année.",
    route: '/(app)/broadcast/new',
  },
  {
    letter: 'E',
    term: 'Envois automatiques',
    desc: "Les Envois automatiques programment l'envoi d'un message d'anniversaire ou de fête à un contact, par SMS ou par email — une seule fois, et l'appli s'en souvient chaque année.\n\nComment ça marche ?\n1. Va dans \"Envois automatiques\" (accueil → 🤖)\n2. Choisis un modèle de message (festif, humoristique, touchant, poétique…) ou rédige le tien\n3. Sélectionne un ou plusieurs contacts\n4. Choisis le déclencheur (Anniversaire ou Fête du prénom) et le canal (SMS ou Email)\n5. Active l'envoi — et oublie-le !\n\n🔔 La veille de chaque envoi programmé, tu reçois une notification de rappel — ta fenêtre pour annuler si besoin. L'envoi se réactive automatiquement l'année suivante, tu n'as à le configurer qu'une seule fois.",
    route: '/(app)/auto-sends',
  },
  {
    letter: 'F',
    term: 'Format',
    desc: "Le Format détermine la forme littéraire du message que l'IA va rédiger.\n\nQuatre formats sont disponibles :\n• Message classique — un texte chaleureux et naturel, idéal pour la plupart des occasions\n• Poème — des vers rimés, élégants et originaux\n• Chanson — paroles rythmées sur le thème de l'occasion\n• Humour — un message décalé et drôle pour faire sourire\n\nLe même contenu peut donner des résultats très différents selon le format choisi. N'hésite pas à tester plusieurs formats et à régénérer pour trouver le ton parfait.",
  },
  {
    letter: 'L',
    term: 'Langue du message',
    desc: "L'IA peut rédiger ton message dans 6 langues différentes.\n\nC'est particulièrement utile si tu as des contacts étrangers ou de la famille à l'étranger — recevoir un message dans sa langue maternelle, c'est une attention qui touche vraiment.\n\nLangues disponibles :\n🇫🇷 Français\n🇬🇧 Anglais\n🇩🇪 Allemand\n🇪🇸 Espagnol\n🇮🇹 Italien\n🇵🇹 Portugais\n\nTu peux choisir la langue au moment de créer le message, ou l'enregistrer dans la fiche contact pour qu'elle soit automatiquement sélectionnée à chaque fois.",
  },
  {
    letter: 'L',
    term: "Livre d'or",
    desc: "Le Livre d'or te permet de collecter des messages de tes proches sur une page partageable — parfait pour un anniversaire, un mariage ou un départ à la retraite.\n\nComment ça marche ?\n1. Partage ton lien de livre d'or via WhatsApp, SMS ou email\n2. Tes proches ouvrent le lien dans leur navigateur (sans avoir besoin de l'appli), laissent un message et une note\n3. Tous les messages s'affichent dans ton livre d'or, classés chronologiquement\n\nAucune inscription n'est nécessaire pour tes proches — le lien fonctionne directement.",
    route: '/(app)/guestbook',
  },
  {
    letter: 'M',
    term: 'Message IA',
    desc: "Le Message IA est la fonctionnalité principale de ConfettiCake. L'intelligence artificielle rédige pour toi un message unique et personnalisé en quelques secondes.\n\nPour créer un message IA :\n1. Appuie sur le bouton \"✨ Créer\" dans la barre du bas\n2. Choisis le contact\n3. Choisis comment tu veux écrire → sélectionne \"Avec l'IA\"\n4. Sélectionne l'occasion (anniversaire, fête, mariage…)\n5. Règle le format et la tonalité\n6. Appuie sur \"Générer\"\n\nL'IA tient compte de tout ce que tu as renseigné dans la fiche contact : prénom, relation, couleur préférée, centres d'intérêt, langue… Plus le profil est complet, plus le message sera personnalisé.",
  },
  {
    letter: 'M',
    term: 'Message manuel',
    desc: "Le Message manuel te permet d'écrire toi-même ton texte, sans l'aide de l'IA.\n\nC'est la solution si tu as déjà une idée précise en tête, si tu veux quelque chose de très personnel, ou si tu préfères simplement rédiger à ta façon.\n\nLe message manuel est entièrement gratuit et ne consomme aucun crédit IA. Tu bénéficies quand même de toutes les fonctionnalités d'envoi : fond animé, police d'écriture, signature, message vocal…\n\nPour l'utiliser : Créer message → \"À ma façon\".",
  },
  {
    letter: 'M',
    term: 'Message vocal',
    desc: "Le Message vocal transforme ton texte en audio : l'IA lit ton message à voix haute, avec une voix naturelle et expressive.\n\nTon destinataire reçoit un lien qu'il peut ouvrir depuis son téléphone pour écouter le message, comme s'il t'entendait parler. C'est un format très touchant, idéal pour les personnes âgées ou les moments importants.\n\nTu peux choisir une voix (féminine, masculine) et un fond sonore musical (piano, guitare, festif…) qui joue en même temps que la lecture — voix et musique arrivent ensemble dans un seul lien.\n\nPour y accéder : Créer message → aperçu → section \"Message vocal\" → ouvrir le panneau → choisir la voix et le fond sonore → Générer.",
  },
  {
    letter: 'M',
    term: 'Modèles',
    desc: "Les Modèles sont une bibliothèque de messages prêts à l'emploi, rédigés par l'IA et sélectionnés avec soin.\n\nSi tu n'es pas inspiré ou si tu veux gagner du temps, tu peux parcourir les modèles classés par occasion (anniversaire, fête, naissance…) et par tonalité (touchant, humoristique, poétique…).\n\nUne fois un modèle sélectionné, tu peux le modifier librement avant de l'envoyer. C'est une base de départ, pas un texte figé.\n\nPour y accéder : Créer message → étape 3 \"Avec l'IA\" → \"Choisir un modèle\".",
  },
  {
    letter: 'M',
    term: 'Mode apprentissage',
    desc: "Le Mode apprentissage est conçu pour les nouveaux utilisateurs qui découvrent ConfettiCake.\n\nDans ce mode, chaque section de l'accueil est accompagnée d'explications détaillées sur son utilité et son fonctionnement. Des bulles d'aide et des descriptions étape par étape t'accompagnent tout au long de ta navigation.\n\nC'est le mode idéal pour prendre en main l'application sans se sentir perdu.\n\nPour l'activer : sur l'accueil, appuie sur le bouton \"🍰 Passer en mode apprentissage\". Tu peux basculer vers le Mode complet à tout moment.",
  },
  {
    letter: 'M',
    term: 'Mode complet',
    desc: "Le Mode complet est l'interface épurée pour les utilisateurs qui connaissent déjà bien ConfettiCake.\n\nLes explications et textes d'introduction sont masqués pour aller à l'essentiel. L'interface est plus dense et plus rapide à parcourir.\n\nTu peux toujours accéder aux informations d'aide via les petits boutons ℹ️ présents sur chaque section.\n\nPour l'activer : sur l'accueil, appuie sur le bouton \"🍭 Passer en mode complet\". Tu peux revenir au Mode apprentissage à tout moment.",
  },
  {
    letter: 'M',
    term: 'Mode couple',
    desc: "Le Mode couple connecte ton compte à celui de ton/ta partenaire pour partager vos agendas de contacts.\n\nComment ça marche ?\n1. L'un de vous crée une invitation depuis \"Mode couple\" → un code à 6 lettres s'affiche\n2. Il partage ce code à l'autre\n3. L'autre saisit le code dans \"Rejoindre avec un code\"\n4. Le lien est activé !\n\nUne fois en mode couple, vous voyez chacun les contacts de l'autre (avec le badge 💑), et les anniversaires/fêtes du partenaire apparaissent dans l'agenda principal. Tu peux dissocier le lien à tout moment depuis \"Mode couple\" — les contacts redeviennent privés immédiatement.",
    route: '/(app)/couple',
  },
  {
    letter: 'M',
    term: 'Mode Morse',
    desc: "Le Mode Morse transforme ton message en code Morse caché derrière un lien animé et ludique.\n\nTon destinataire ouvre le lien, écoute une série de bips audio (les vrais points et traits du message en Morse), puis appuie sur le bouton \"Révéler le message\" pour découvrir le texte décodé. Un clin d'œil original pour surprendre et faire sourire.\n\nPour l'activer : Créer message → aperçu → bascule \"Mode Morse\" (sous le message vocal) — ou dans une Carte animée, section \"Mode Morse\".",
  },
  {
    letter: 'N',
    term: 'Notes',
    desc: "Les Notes te permettent de garder une trace de ce que tu sais sur un contact, pour t'en souvenir au bon moment.\n\nExemples d'utilisation :\n• Idées de cadeaux (\"aime le jazz\", \"veut une raquette de tennis\")\n• Anecdotes ou souvenirs partagés\n• Allergies ou préférences pour un dîner\n• Ce qu'il t'a dit lors de ta dernière conversation\n\nCes notes sont entièrement privées — personne d'autre ne peut les voir.\n\n── Comment accéder aux notes ? ──\n\n1. Va dans \"Mes contacts\" et ouvre la fiche d'un contact\n2. Fais défiler vers le bas jusqu'à la section \"Notes personnelles\"\n3. Appuie sur la zone de texte pour écrire ou modifier ta note\n\nTu peux aussi renseigner une note au moment de créer ou modifier un contact, dans le champ prévu à cet effet.",
    route: '/(app)/contacts',
  },
  {
    letter: 'N',
    term: 'Numérologie',
    desc: "La Numérologie calcule un profil de personnalité à partir du prénom et de la date de naissance d'un contact.\n\nElle donne plusieurs indicateurs :\n• Le Chemin de vie — la mission profonde de la personne\n• Le Nombre d'expression — sa façon d'être vue par les autres\n• Le Nombre actif — son énergie au quotidien\n\nChaque chiffre est accompagné d'une explication accessible pour les débutants.\n\nC'est un contenu original et divertissant, parfait pour mieux comprendre les personnes qui t'entourent — ou juste pour le plaisir de la découverte !",
    route: '/(app)/numerologie',
  },
  {
    letter: 'O',
    term: 'Occasions',
    desc: "Les Occasions sont les différents types d'événements pour lesquels tu peux créer un message.\n\nL'IA adapte complètement le ton et le contenu selon l'occasion choisie. Un message d'anniversaire n'a rien à voir avec un message de soutien ou de félicitations.\n\nOccasions disponibles :\n🎂 Anniversaire\n🌸 Fête du prénom\n💍 Mariage / Fiançailles\n👶 Naissance\n🎓 Diplôme\n🏆 Promotion\n🌴 Retraite\n💪 Soutien / Encouragement\n🎆 Nouvel An\n…et bien d'autres\n\nChoisis toujours l'occasion la plus précise pour obtenir le message le plus adapté.",
  },
  {
    letter: 'P',
    term: 'Parrainage',
    desc: "Le Parrainage te permet de gagner des crédits IA gratuits en invitant des amis à rejoindre ConfettiCake.\n\nComment ça marche :\n1. Récupère ton code de parrainage unique dans la section Parrainage\n2. Partage-le avec tes amis (par SMS, WhatsApp, email…)\n3. Quand un ami s'inscrit avec ton code, vous recevez chacun 5 crédits IA offerts\n\nIl n'y a pas de limite — plus tu parraines, plus tu cumules de crédits. C'est la meilleure façon d'utiliser l'IA gratuitement sur le long terme.",
    route: '/(app)/referral',
  },
  {
    letter: 'P',
    term: 'Partage de contacts',
    desc: "Le Partage de contacts te permet de transmettre une liste de contacts à quelqu'un d'autre via un lien temporaire.\n\nCas d'usage typique : tu organises un anniversaire surprise et tu veux que tes proches sachent qui inviter, sans leur donner accès à toute ton appli.\n\nLe lien est valable 24 heures. Seules les informations essentielles sont partagées : prénoms, dates et relations. Tes messages, notes et données personnelles restent entièrement privés.\n\nPratique aussi pour aider un proche à démarrer sur ConfettiCake avec les mêmes contacts que toi.",
    route: '/(app)/contacts',
  },
  {
    letter: 'P',
    term: "Police d'écriture",
    desc: "La Police d'écriture te permet de choisir le style visuel du texte de ton message, tel qu'il apparaîtra dans le lien web envoyé à ton destinataire.\n\nDisponible en 18 styles différents, par exemple :\n✍️ Manuscrit — comme écrit à la main\n📖 Classique — sobre et élégant\n🎪 Comic — décontracté et fun\n🌸 Vintage — rétro et poétique\n…et bien d'autres\n\nLa police ne change pas le contenu du message, seulement son apparence visuelle. Un même texte peut faire un effet très différent selon la police choisie.\n\nAccessible depuis : Créer message → aperçu → section \"Style d'écriture\".",
  },
  {
    letter: 'P',
    term: 'Profil',
    desc: "Le Profil contient tes informations personnelles utilisées par l'IA pour personnaliser tes messages.\n\nTu peux y renseigner :\n• Ton prénom et nom (pour la signature automatique)\n• Ta date de naissance\n• Ta civilité (Monsieur, Madame…)\n• Ton thème de couleur préféré dans l'appli\n• Ton plan d'abonnement (gratuit ou Premium)\n\nPlus ton profil est complet, plus l'IA comprend qui tu es et peut adapter le ton et la signature de tes messages. Pense à le remplir dès le départ !",
    route: '/(app)/profile',
  },
  {
    letter: 'Q',
    term: 'QR code de partage',
    desc: "Le QR code de partage transforme un de tes messages déjà créés en code scannable : ton proche n'a qu'à pointer son appareil photo dessus pour lire le message, sans cliquer sur aucun lien.\n\nComment faire ?\n1. Ouvre un message depuis son historique, sa fiche contact, ou directement après création\n2. Appuie sur \"QR code\" (ou \"⬛ QR code à partager\" depuis l'accueil)\n3. Le code s'affiche immédiatement — fais-le scanner par ton proche, ou partage le texte directement\n\nIdéal pour une carte imprimée, une affiche ou un moment en face à face où tu veux surprendre quelqu'un.\n\n✨ En version gratuite, tu disposes de 3 QR codes. Le plan Premium les rend illimités.",
    route: '/(app)/qr',
  },
  {
    letter: 'R',
    term: 'Rappels collectifs',
    desc: "Les Rappels collectifs préviennent d'autres proches qu'une date importante approche pour quelqu'un — par exemple, rappeler à toute la famille que c'est bientôt l'anniversaire de Mamie, sans avoir à le faire toi-même chaque année.\n\nComment faire ?\n1. Va dans \"Rappels collectifs\" (accueil → 🔔)\n2. Choisis le contact concerné et l'occasion — anniversaire ou fête du prénom (seules les dates déjà renseignées sur sa fiche sont proposées)\n3. Choisis combien de jours avant la date le rappel doit partir (1, 3, 7 ou 14 jours)\n4. Laisse le texte généré automatiquement, ou écris le tien\n5. Sélectionne les destinataires à prévenir et le canal (SMS ou Email)\n\nUne fois programmé, le rappel se redéclenche automatiquement chaque année. Tu reçois une notification à chaque envoi effectué, et tu peux activer, désactiver ou supprimer un rappel à tout moment.",
    route: '/(app)/group-reminders',
  },
  {
    letter: 'R',
    term: 'Réactions',
    desc: "Les Réactions permettent à ton destinataire de répondre à un message reçu sans avoir besoin de l'appli — d'un simple tap sur un emoji (cœur, rire, adoration, mains jointes, larmes) et, s'il le souhaite, un petit mot.\n\nChaque lien de réaction est unique et expire après 30 jours. Il ne donne accès qu'à la page de réaction — aucune autre donnée n'est visible. Tu retrouves toutes les réactions reçues sur la page \"Réactions\", et tu reçois une notification à chaque nouvelle réaction.",
    route: '/(app)/reactions',
  },
  {
    letter: 'R',
    term: 'Régénération',
    desc: "La Régénération te permet de demander à l'IA un nouveau message entièrement différent, sur la même base.\n\nSi le message généré ne te convient pas — trop formel, trop court, pas assez personnel — appuie sur le bouton \"↺ Générer une nouvelle version\" dans la page d'aperçu.\n\nL'IA repart de zéro et te propose un texte complètement différent, avec les mêmes paramètres (contact, occasion, tonalité, format).\n\nBonne nouvelle : la régénération est toujours gratuite, même avec le plan gratuit. Tu peux régénérer autant de fois que tu veux jusqu'à trouver le message parfait.",
  },
  {
    letter: 'S',
    term: 'Signature',
    desc: "La Signature est le texte qui apparaît en bas de ton message pour identifier qui l'envoie.\n\nTu peux choisir parmi plusieurs styles :\n• Ton prénom seul (\"Jean\")\n• Ton prénom et nom complet\n• Un lien familial (\"Ton fils\", \"Ta sœur\")\n• Un surnom ou un texte entièrement libre\n\nLa signature est automatiquement suggérée selon les informations de ton Profil, mais tu peux la modifier à chaque message.\n\nElle est visible uniquement sur le lien web du message — pas dans le SMS ou WhatsApp qui contient juste le lien.",
  },
  {
    letter: 'T',
    term: 'Tonalité',
    desc: "La Tonalité définit l'ambiance émotionnelle du message que l'IA va écrire.\n\nC'est l'un des paramètres les plus importants : le même anniversaire peut donner un message complètement différent selon la tonalité choisie.\n\nTonalités disponibles :\n💛 Touchant — sincère, chaleureux, qui vient du cœur\n🌸 Poétique — élégant, littéraire, avec des images et métaphores\n😄 Humoristique — drôle, décalé, pour faire rire\n🎮 Joueur — léger et espiègle\n💼 Professionnel — sobre et respectueux, idéal pour les collègues\n\nChoisir la bonne tonalité est la clé pour un message réussi. Pense à la relation que tu as avec la personne avant de choisir.",
  },
  {
    letter: 'Z',
    term: 'Zodiaque',
    desc: "La section Zodiaque te plonge dans l'univers astrologique de tes contacts.\n\nElle propose deux contenus :\n• Le profil astrologique d'un contact — son signe du zodiaque, ses traits de caractère, ses forces et faiblesses selon l'astrologie occidentale.\n• Les saisons zodiacales — les signes actuellement \"en saison\" selon le calendrier astrologique, avec des contenus thématiques du moment.\n\nC'est un contenu fun et contemplatif, idéal pour mieux comprendre les personnes qui t'entourent ou simplement pour le plaisir de la lecture.",
    route: '/(app)/zodiac-season',
  },
];

const LETTERS = Array.from(new Set(ENTRIES.map((e) => e.letter))).sort();

export default function GlossaireScreen() {
  const C = useColors();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(C), [C]);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ENTRIES;
    const q = search.toLowerCase();
    return ENTRIES.filter((e) => e.term.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    filtered.forEach((e) => {
      if (!map[e.letter]) map[e.letter] = [];
      map[e.letter].push(e);
    });
    return map;
  }, [filtered]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackHeader title="Guide A-Z" />

      <View style={styles.searchWrap}>
        <Text style={{ fontSize: 16, marginRight: 6 }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Recherche une fonction…"
          placeholderTextColor={Colors.onSurfaceVariant}
          autoCapitalize="none"
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!search && (
          <Text style={styles.intro}>
            {'Toutes les fonctions de ConfettiCake classées de A à Z. Appuie sur une entrée pour lire son mode d\'emploi.'}
          </Text>
        )}

        {Object.keys(grouped).sort().map((letter) => (
          <View key={letter}>
            <View style={styles.letterHeader}>
              <Text style={[styles.letter, { color: C.primary }]}>{letter}</Text>
              <View style={[styles.letterLine, { backgroundColor: C.primary + '30' }]} />
            </View>
            {grouped[letter].map((entry) => (
              <TouchableOpacity
                key={entry.term}
                style={styles.entry}
                onPress={() => setSelectedEntry(entry)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.term}>{entry.term}</Text>
                  <Text style={styles.desc} numberOfLines={2}>{entry.desc}</Text>
                </View>
                <Text style={[styles.arrow, { color: C.primary }]}>{entry.route ? '›' : 'ℹ️'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ fontSize: 36 }}>🔍</Text>
            <Text style={{ fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurfaceVariant, marginTop: 12 }}>
              Aucun résultat pour "{search}"
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Modal visible={!!selectedEntry} transparent animationType="fade" onRequestClose={() => setSelectedEntry(null)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setSelectedEntry(null)}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
          <View style={[styles.modalCard, { backgroundColor: Colors.surfaceContainerLow }]}>
            <Text style={[styles.modalTerm, { color: C.primary }]}>{selectedEntry?.term}</Text>
            <ScrollView key={selectedEntry?.term} showsVerticalScrollIndicator nestedScrollEnabled style={{ maxHeight: 380 }}>
              <Text style={styles.modalDesc}>{selectedEntry?.desc}</Text>
            </ScrollView>
            <View style={styles.modalActions}>
              {selectedEntry?.route && (
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: C.primary }]}
                  onPress={() => {
                    setSelectedEntry(null);
                    router.navigate(selectedEntry.route as never);
                  }}
                >
                  <Text style={styles.modalBtnPrimaryText}>Accéder →</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSecondary, { borderColor: C.primary }]}
                onPress={() => setSelectedEntry(null)}
              >
                <Text style={[styles.modalBtnSecondaryText, { color: C.primary }]}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    searchWrap: { flexDirection: 'row', alignItems: 'center', margin: Spacing[4], marginBottom: Spacing[2], backgroundColor: Colors.surfaceContainerLow, borderRadius: Radii.full, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: Colors.outlineVariant },
    searchInput: { flex: 1, fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurface },
    content: { paddingHorizontal: Spacing[4], paddingBottom: 40 },
    intro: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: Spacing[4], textAlign: 'center' },
    letterHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: Spacing[4], marginBottom: Spacing[2] },
    letter: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, width: 28 },
    letterLine: { flex: 1, height: 1.5 },
    entry: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: Colors.outlineVariant + '80' },
    term: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: Colors.onSurface, marginBottom: 2 },
    desc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.sm, color: Colors.onSurfaceVariant, lineHeight: 18 },
    arrow: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 22, marginTop: 2 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: Spacing[5] },
    modalCard: { width: '100%', maxHeight: '85%', borderRadius: Radii.lg, padding: Spacing[5], gap: Spacing[3] },
    modalTerm: { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: Typography.xl, marginBottom: Spacing[3] },
    modalDesc: { fontFamily: 'BeVietnamPro_400Regular', fontSize: Typography.base, color: Colors.onSurface, lineHeight: 24 },
    modalActions: { flexDirection: 'row', gap: Spacing[3], justifyContent: 'flex-end', marginTop: Spacing[2] },
    modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: Radii.full },
    modalBtnPrimary: {},
    modalBtnPrimaryText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base, color: '#fff' },
    modalBtnSecondary: { borderWidth: 1.5 },
    modalBtnSecondaryText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: Typography.base },
  });
}
