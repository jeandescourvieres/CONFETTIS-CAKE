# Confettis & Cake — Récapitulatif complet des fonctions
*Document de référence pour la mise à jour du mode d'emploi*
*Généré le 22 mai 2026*

---

## 1. Création de messages

### Flux principal
L'utilisateur choisit un contact, une occasion, puis navigue dans une bibliothèque de messages organisée par thèmes.

**Occasions disponibles :**
| Occasion | Description |
|---|---|
| 🎂 Anniversaire | Messages pour la date d'anniversaire |
| 🌸 Fête du prénom | Messages pour le jour de la fête (calendrier français) |
| 🎓 Diplôme / Bac / Brevet | Félicitations pour les réussites scolaires |
| 💼 Premier job / Stage | Encouragements pour la vie professionnelle |
| 💏 Fête des amoureux | Saint-Valentin et occasions romantiques |
| 🌸 Fête des mères | Messages pour la maman |
| 👨 Fête des pères | Messages pour le papa |
| 🎄 Noël | Messages de vœux de fin d'année |
| 🎉 Bonne année | Messages de nouvelle année |
| 🏆 Félicitations | Réussites diverses |
| 💔 Rupture / Soutien | Messages de soutien |
| 🎁 Cadeau surprise | Messages d'accompagnement de cadeaux |
| ✈️ Bon voyage | Messages de départ |
| 🏠 Nouvelle maison | Pendaison de crémaillère |
| 👶 Naissance | Félicitations pour une naissance |
| 💒 Mariage | Félicitations nuptiales |
| 🤒 Rétablissement | Souhaits de prompt rétablissement |
| 😢 Condoléances | Messages de compassion |

**Catégories de styles :**
- **Chaleureux** : tonalité émotionnelle et affectueuse
- **Humoristique** : décalé, fun, second degré
- **Poétique** : texte littéraire, métaphores
- **Professionnel** : registre formel
- **Court** : texte concis, idéal SMS
- **En vers** : messages rimés

**Variables automatiques :** `{prenom}` est remplacé par le prénom du contact. Dans la catégorie "Ado → Parent", `{prenom}` devient automatiquement "Papa" ou "Maman" selon la civilité du contact.

---

### Bibliothèque classique (adultes)
Messages regroupés par sous-catégories thématiques avec compteur, aperçu et bouton "Utiliser". Pour anniversaire et fête du prénom : plus de **1 000 messages** au total.

---

### Personnalisation du message

**Éditeur de message :**
- Zone de texte éditable avec compteur de caractères
- Saisie vocale (microphone)
- Correction automatique (IA) : reformulation, correction orthographique
- Complétion automatique : suggestions de fin de phrase

**Styles d'écriture (8 polices) :**
Serif · Sans-serif · Manuscrit · Imprimé · Élégant · Moderne · Gras · Minimaliste

**Effets animés :**
- Confettis 🎊
- Feux d'artifice ✨
- Ballons 🎈
- Neige ❄️
- Cœurs 💕
- Pluie de pétales 🌸

**Fond / Thème :** Couleur de fond, dégradé, ou image personnalisée.

---

### Aperçu et envoi
- Aperçu en plein écran avant envoi (rendu final du message + effets)
- Choix du canal : SMS, WhatsApp, email, copie dans le presse-papier
- **Mode automatique (Auto-envoi)** : programmer l'envoi à la date souhaitée
- Ajout d'une signature personnalisée

---

## 2. Mode Jeune (13-25 ans)

Page dédiée accessible depuis l'accueil et le flow de création.

**Détection automatique :**
- Si l'utilisateur a entre 13 et 25 ans → badge "Pour toi 😎" + mise en avant prioritaire
- Si un contact a entre 13 et 25 ans avec un événement dans les 7 prochains jours → bandeau sur l'accueil

**8 catégories de messages :**

| Catégorie | Âge cible | Nb messages | Description |
|---|---|---|---|
| 🎂 Anniversaire Ado (13-17) | 13-17 ans | 120 | Messages d'anniversaire ton ado |
| 🎂 Anniversaire Jeune adulte (18-25) | 18-25 ans | 120 | Anniversaire jeune adulte |
| 🌸 Fête du prénom Ado | 13-17 ans | 120 | Fête du prénom ton ado |
| 🌸 Fête du prénom Jeune adulte | 18-25 ans | 120 | Fête du prénom jeune adulte |
| 🎓 Diplôme / Bac / Brevet | 13-17 ans | 100 | Félicitations pour les examens |
| 💼 Premier job / Stage | 18-25 ans | 100 | Entrée dans la vie pro |
| 🫂 Ado → Parent (anniversaire) | Écrit par un ado | 100 | Un ado écrit à son papa/maman |

**"Je déteste les messages mais quand même" (100 messages)**
Pour ceux qui n'aiment pas les messages trop longs ou trop conventionnels. 20 messages par occasion :
- Anniversaire · Fête du prénom · Diplôme · Premier job · Ado → Parent

**Total Mode Jeune : ~880 messages**

---

## 3. Messages animaux

Deux flux distincts :

### De la part de l'animal (animal écrit à son maître)
Messages comme si le chien ou le chat rédigeait lui-même.

**Espèces :**
- 🐶 Chien — Anniversaire (200 messages, 6 thèmes × sous-groupes)
- 🐶 Chien — Fête du prénom (200 messages, 7 thèmes × sous-groupes)
- 🐱 Chat — Anniversaire (200 messages, 7 thèmes × sous-groupes)
- 🐱 Chat — Fête du prénom (220 messages, 7 thèmes × sous-groupes)

**Navigation :** Liste de thèmes → liste de sous-groupes → liste de messages → aperçu → utiliser.

### Du maître à l'animal
Messages pour souhaiter un joyeux anniversaire à son propre animal.

**Champs de la fiche animal :** Nom, espèce, race, date de naissance, couleur, traits de personnalité.

---

## 4. Cartes animées

**Bibliothèque de cartes :**
- Cartes thématiques avec animations Lottie (effets visuels avancés)
- Filtrage par occasion et style
- Aperçu animé avant sélection

**Création par IA :**
- Génération d'une carte personnalisée à partir d'un prompt texte (DALL-E / GPT)
- Style artistique paramétrable

**Partage :**
- URL unique générée pour chaque carte
- Accessible via QR code ou lien direct
- Le destinataire voit la carte animée dans son navigateur

---

## 5. Cagnotte collective

**Création d'une cagnotte :**
1. Titre + description + montant cible (optionnel)
2. Photo de couverture
3. Date limite (optionnelle)
4. Lien de partage généré

**Participation :**
- Le destinataire clique sur le lien partagé → page web dédiée (Edge Function Supabase)
- Paiement en ligne (Stripe)
- Contribution visible dans le récap

**Suivi :**
- Montant collecté vs objectif
- Liste des contributeurs avec montants
- Notifications à chaque nouvelle contribution
- Clôture manuelle ou automatique à la date limite

---

## 6. Contacts

**Fiche contact :**
- Prénom · NOM · âge · civilité
- Date d'anniversaire (avec calcul automatique de l'âge et du prochain anniversaire)
- Date de fête du prénom (auto-calculée)
- Relation (ami, famille, collègue, partenaire, enfant, animal...)
- Email · téléphone
- Photo de profil
- Notes libres

**Import de contacts :**
- Depuis le carnet d'adresses du téléphone (permissions requises)
- Import manuel un par un

**Liste des contacts :**
- Tri par prénom, nom, prochain événement
- Recherche instantanée par nom
- Filtres par relation
- Indicateurs : prochain événement + nb de jours restants

**Fiche contact étendue :**
- Ligne "Prénom NOM · X ans" en header
- Timeline des messages envoyés
- Rappels personnalisés associés au contact

---

## 7. Calendrier & Agenda

**Calendrier mensuel :**
- Vue mensuelle avec points de couleur sur les jours avec événements
- Tap sur un jour → liste des événements du jour
- Couleurs par type d'événement (anniversaire 🎂, fête 🌸, perso 📅)

**Agenda :**
- Liste chronologique des événements à venir (30 jours)
- Badges "J-X" (ex. : "J-3")
- Accès rapide à la création de message pour chaque événement

**Création d'événement personnalisé :**
- Titre, date, heure, contact associé, rappel

**Rappels :**
- Notification push à la date choisie (J-7, J-1, Jour J)
- Rappels récurrents annuels pour anniversaires et fêtes
- Gestion complète : liste, création, suppression

---

## 8. Auto-envois

Programmation automatique de messages à envoyer à une date future.

**Configuration :**
- Contact cible
- Occasion
- Message rédigé ou sélectionné
- Date et heure d'envoi
- Canal (SMS, WhatsApp, email)
- Récurrence (ponctuel ou annuel)

**Gestion :**
- Liste des envois programmés avec statut (en attente, envoyé, échoué)
- Modification ou annulation avant la date

---

## 9. Tableau de bord

Vue synthétique de l'activité :

- **Événements à venir** : les 5 prochains avec J-X
- **Messages envoyés** : compteur total + graphique hebdomadaire
- **Contacts actifs** : nb total de contacts
- **Rappels en attente** : liste des rappels programmés
- **Dernières activités** : fil des actions récentes

---

## 10. Explorer

### Signification des prénoms
- Base de données des prénoms français avec étymologie, origine, caractère, éléments
- Courbe de popularité INSEE (évolution depuis 1900)
- Partage de la fiche prénom
- Navigation croisée prénoms ↔ noms de famille

### Signification des noms de famille
- Étymologie et origine géographique des noms
- Popularité INSEE

### Compatibilité amoureuse
- Analyse basée sur les prénoms et dates de naissance
- Score de compatibilité + détail par dimension (communication, passion, durée...)
- Partage du résultat

---

## 11. Numérologie

Calcul numérologiques à partir du prénom + nom + date de naissance.

**Nombres calculés :**
- Chemin de vie
- Expression
- Âme
- Réalisation

Chaque nombre : définition complète + conseils personnalisés.

---

## 12. Zodiaque & Saison

- Signe solaire du contact calculé automatiquement
- Compatibilité zodiacale entre deux signes
- **Saison zodiacale en cours** : signe actuel, dates, traits principaux
- Descriptions détaillées pour les 12 signes

---

## 13. Compatibilité (animaux chinois)

- Calcul basé sur l'année de naissance
- 12 signes du zodiaque chinois
- Matrice de compatibilité inter-signes
- Description des forces et faiblesses de chaque paire

---

## 14. Accueil

**Mode apprentissage (débutant) :**
- Sections guidées : Que faire aujourd'hui ? / Événements proches / Actions rapides
- Explication de chaque fonctionnalité au fur et à mesure

**Mode initié (avancé) :**
- Vue condensée avec accès rapide à toutes les fonctions
- Grille de 9 actions rapides personnalisables

**Éléments permanents :**
- Météo du jour (température + conditions)
- Fête du jour (prénom fêté aujourd'hui)
- Dicton du jour
- Citation inspirante
- Prochains événements (J-7)
- Bandeau Mode Jeune si contact 13-25 ans avec événement proche

---

## 15. Livre d'or

- L'utilisateur peut laisser un message dans le livre d'or de l'appli
- Les messages sont visibles par tous les utilisateurs
- Modération manuelle activable

---

## 16. QR Codes

**Génération :**
- Créer un QR code lié à une carte animée ou un message
- Partager en image ou imprimer

**Scanner :**
- Scanner un QR code d'un autre utilisateur → affiche la carte/message associé

---

## 17. Profil utilisateur

**Informations personnelles :**
- Prénom, nom, date de naissance, photo de profil
- Couleur favorite (utilisée par l'IA pour personnalisation)
- Bio courte

**Compte :**
- Connexion Google OAuth
- Connexion email + mot de passe
- Réinitialisation du mot de passe par email

**Premium :**
- Accès au mode complet (fonctionnalités avancées)
- Gestion de l'abonnement

**Parrainage :**
- Lien de parrainage unique
- Suivi des parrainages validés
- Récompenses (crédits, accès premium)

---

## 18. Paramètres

- **Thème de couleur** : choix parmi plusieurs palettes (accent principal + teintes)
- **Notifications** : activer/désactiver push, rappels, auto-envois
- **Langue** : français (par défaut)
- **Compte** : déconnexion, suppression de compte
- **À propos** : version de l'appli, mentions légales, politique de confidentialité

---

## 19. Aide & FAQ

Page d'aide intégrée avec :
- Questions fréquentes par catégorie (thématique)
- Recherche dans les articles
- Liens vers les sections concernées de l'appli
- Contact support (email)

---

## 20. Carte postale numérique

- Composition d'une carte postale avec photo + message + décoration
- Envoi par lien ou QR code
- Rendu "imprimable" disponible

---

## 21. Gestion des messages envoyés

**Historique :**
- Liste de tous les messages envoyés avec date, contact, occasion
- Statut de lecture (si applicable)

**Réactions :**
- Le destinataire peut réagir au message (emoji)
- L'expéditeur est notifié de la réaction

**Re-envoi :**
- Dupliquer un message pour le renvoyer à un autre contact

---

## 22. Notifications

- Push notifications pour : rappels d'événements, réactions reçues, contributions cagnotte, messages auto-envoyés
- Centre de notifications in-app
- Badge sur l'icône de l'appli

---

## Chiffres clés

| Catégorie | Nb messages |
|---|---|
| Messages adultes (anniversaire + fête) | ~1 000+ |
| Mode Jeune (toutes catégories) | ~880 |
| Messages animaux (4 bibliothèques) | ~820 |
| Je déteste les messages | 100 |
| **Total bibliothèque** | **~2 800+** |

---

*Ce document doit être reporté dans Notion (WebView mode d'emploi in-app) une fois finalisé.*
