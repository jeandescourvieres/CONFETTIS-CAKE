// AUTO-GENERATED — Librairie hiérarchique de messages animaux
// 820 messages : chien × {anniversaire, fête du prénom} + chat × {anniversaire, fête du prénom}
// Organisés en thèmes → sous-groupes → messages, selon les classifications validées.

export interface LibraryMessage {
  id: string;
  angle: string;
  body: string;
}

export interface LibrarySubGroup {
  id: string;
  label: string;
  messages: LibraryMessage[];
}

export interface LibraryTheme {
  id: string;
  emoji: string;
  label: string;
  count: number;
  subGroups: LibrarySubGroup[];
}

export interface OccasionLibrary {
  themes: LibraryTheme[];
}

export type LibraryKey = 'chien_birthday' | 'chien_nameday' | 'chat_birthday' | 'chat_nameday';

export const PET_MESSAGE_LIBRARY: Record<LibraryKey, OccasionLibrary> = {
  chien_birthday: {
    themes: [
      {
        id: "humour_aveux",
        emoji: "😄",
        label: "Humour & aveux",
        count: 18,
        subGroups: [
          {
            id: "jalousies",
            label: "Mes jalousies",
            messages: [
              { id: "dbd_024", angle: "Joyeux anniversaire. J'ai un problème avec le nouveau coussin.", body: `4. "Joyeux anniversaire. J'ai un problème avec le nouveau coussin."
Celui qu'on t'a offert. Doux. Moelleux. Avec cette housse. Tu l'as serré contre toi en le déballant avec une expression qui m'a traversé comme une flèche. Ce coussin a reçu en dix secondes une démonstration d'affection que moi j'attends parfois des heures. Je suis pas jaloux. Je note juste. Pour le dossier. Joyeux anniversaire quand même, [mon maître/ma maîtresse].
Avec dossier coussin ouvert et jalousie officieusement niée, — [Prénom animal], ton animal aux concurrents bien répertoriés 🛋️` },
              { id: "dbd_045", angle: "Joyeux anniversaire. Quelqu'un t'a souhaité avant moi ce matin.", body: `5. "Joyeux anniversaire. Quelqu'un t'a souhaité avant moi ce matin."
Le téléphone a sonné à 8h12. Avant que j'aie eu le temps de faire ma démonstration complète. Avant le saut. Avant le tour. Avant les cinq minutes de remue-queue que j'avais planifiées. Tu as répondu en souriant et moi j'attendais dans le couloir avec toute mon énergie accumulée et nulle part où la mettre. J'ai quand même tout fait après. Mais j'étais pas le premier. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec préséance volée et performance d'anniversaire livrée quand même intégralement, — [Prénom animal], ton animal arrivé deuxième ce matin mais premier dans ton cœur 📱` },
              { id: "dbd_055", angle: "Joyeux anniversaire. J'ai un problème avec un de tes cadeaux.", body: `15. "Joyeux anniversaire. J'ai un problème avec un de tes cadeaux."
Le grand. Celui dans la boîte. Qui prend maintenant de la place dans le salon exactement là où je passais. Mon chemin habituel entre le canapé et la fenêtre est compromis. J'ai dû recalculer mon itinéraire trois fois ce soir. Je suis pas contre le cadeau en principe. Je suis contre sa localisation. Une discussion s'impose. Joyeux anniversaire quand même, [mon maître/ma maîtresse].
Avec réclamation territoriale déposée concernant le placement du grand cadeau, — [Prénom animal], ton animal dont les itinéraires intérieurs sont sacrés 📦` },
              { id: "dbd_183", angle: "Joyeux anniversaire. J'étais jaloux du gâteau ce soir.", body: `3. "Joyeux anniversaire. J'étais jaloux du gâteau ce soir."
Il a reçu toute l'attention pendant cinq minutes. Tout le monde regardait le gâteau. Tout le monde photographiait le gâteau. Tout le monde voulait une part du gâteau. Moi j'étais là. Accessible. Disponible. Avec des qualités que le gâteau n'a pas. Mais bon. C'était son soir. Je respecte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec jalousie du gâteau honnêtement avouée et concession faite de bonne grâce, — [Prénom animal], ton animal second dans les attentions mais premier dans le cœur 🎂` },
            ],
          },
          {
            id: "aveux_faceties",
            label: "Mes aveux & facéties",
            messages: [
              { id: "dbd_003", angle: "Pour ton anniversaire j'ai décidé de ne pas aboyer après le livreur aujourd'hui.", body: `3. "Pour ton anniversaire j'ai décidé de ne pas aboyer après le livreur aujourd'hui."
Il est venu à 10h23. J'ai senti son odeur depuis le couloir. J'ai entendu l'ascenseur. Tous mes instincts criaient. J'ai résisté. Vingt secondes de silence total. Puis j'ai aboyé quand même parce que c'était vraiment suspect. Mais l'intention était là. Le cadeau était dans l'intention. Joyeux anniversaire, [mon maître/ma maîtresse], pour qui je combats mes démons quotidiens.
Avec lutte intérieure épique et résultat perfectible, — [Prénom animal], ton animal en développement personnel continu 🧘` },
              { id: "dbd_004", angle: "Joyeux anniversaire. J'ai mangé un morceau de ton gâteau.", body: `4. "Joyeux anniversaire. J'ai mangé un morceau de ton gâteau."
Pas beaucoup. Juste le coin. Celui qui dépassait de l'assiette. Il était là. Tout seul. À portée. T'avais le dos tourné une seconde. Une seule seconde. En même temps si tu laisses du gâteau d'anniversaire sans surveillance tu connais les risques. Je t'avais pas dit que j'allais le faire mais je t'avais pas dit que je le ferais pas non plus. Joyeux anniversaire quand même.
Avec opportunisme assumé et remords relatifs, — [Prénom animal], ton animal aux initiatives gastronomiques spontanées 🎂` },
              { id: "dbd_007", angle: "Joyeux anniversaire. J'ai une confession à faire.", body: `7. "Joyeux anniversaire. J'ai une confession à faire."
C'est moi qui ai caché la télécommande en mars. Et les clés en novembre. Et la chaussette droite en février. C'était pas des accidents. C'était pour que tu restes à la maison plus longtemps. Pour que tu cherches. Pour qu'on passe du temps ensemble. C'est une technique thérapeutique. Mon psy approuverait probablement. Joyeux anniversaire, [mon maître/ma maîtresse], victime consentante de mes stratagèmes.
Avec confession complète et aucun engagement de ne pas recommencer, — [Prénom animal], ton animal aux méthodes discutables mais aux intentions pures 🔑` },
              { id: "dbd_017", angle: "Joyeux anniversaire. Tu m'as grondé deux fois aujourd'hui.", body: `17. "Joyeux anniversaire. Tu m'as grondé deux fois aujourd'hui."
Une fois pour le coussin. Une fois pour le chat du voisin. Les deux fois j'ai fait la tête basse et les yeux tristes. Les deux fois tu as craqué en moins de quarante secondes. On sait tous les deux comment ça marche. C'est notre équilibre. Notre système. Notre façon de cohabiter. Joyeux anniversaire, [mon maître/ma maîtresse], dont la fermeté dure en moyenne trente-huit secondes.
Avec chronométrage précis et technique rodée, — [Prénom animal], ton animal expert en gestion des conflits 😇` },
              { id: "dbd_019", angle: "Pour ton anniversaire je t'offre ma liste de défauts.", body: `19. "Pour ton anniversaire je t'offre ma liste de défauts."
Je perds mes poils partout. J'aboie trop tôt le matin. Je mange trop vite et je fais des bruits suspects après. Je prends toute la place. Je suis jaloux de ton téléphone. Je renifle les inconnus trop longtemps. Je mâche les choses molles. Et tu m'aimes quand même. C'est ça le vrai cadeau d'anniversaire. Pas ma liste. Ton amour malgré elle. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec transparence totale et confiance absolue en ton indulgence, — [Prénom animal], ton animal imparfait et assumé 🎁` },
              { id: "dbd_022", angle: "Joyeux anniversaire. J'ai fait semblant de ne pas reconnaître tes amis ce soir.", body: `2. "Joyeux anniversaire. J'ai fait semblant de ne pas reconnaître tes amis ce soir."
Je les connais pourtant. Très bien. L'odeur. La façon de sonner. La voix dans le couloir. Je sais exactement qui c'est avant que la porte s'ouvre. Mais j'ai quand même fait l'audit complet à chaque arrivée. Le reniflage. Le regard suspicieux. Le tour complet. C'est mon protocole. Le abandonner serait perdre une partie de moi-même. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identités parfaitement connues et procédures maintenues par principe, — [Prénom animal], ton animal aux rituels non négociables 🔍` },
              { id: "dbd_023", angle: "Pour ton anniversaire j'ai saboté la promenade du matin.", body: `3. "Pour ton anniversaire j'ai saboté la promenade du matin."
Tu voulais aller vite. Revenir. Préparer ta journée. J'avais d'autres plans. Je me suis assis exactement au milieu du trottoir à deux reprises. J'ai reniflé chaque poteau avec une lenteur délibérée. J'ai insisté pour prendre le chemin long. On a mis quarante minutes au lieu de vingt. Tu avais l'air agacé. Puis tu as regardé le ciel. Tu t'es détendu. De rien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec agenda propre ignoré et service de décompression forcée rendu, — [Prénom animal], ton animal thérapeute ambulatoire 🌳` },
              { id: "dbd_025", angle: "Joyeux anniversaire. J'ai aboyé sur mon reflet ce matin pendant dix minutes.", body: `5. "Joyeux anniversaire. J'ai aboyé sur mon reflet ce matin pendant dix minutes."
Il était dans le miroir de l'entrée. Menaçant. Silencieux. Me regardant exactement comme je le regardais. J'ai aboyé. Il a répondu avec la même intensité. J'ai reculé. Il a reculé. On s'est fixés longuement. Je suis parti en premier pour lui montrer que c'était mon choix. C'est moi qui ai gagné. Joyeux anniversaire, [mon maître/ma maîtresse], dont la maison est sécurisée.
Avec victoire indiscutable contre l'intrus du miroir et territoire défendu, — [Prénom animal], ton animal aux ennemis intérieurs bien gérés 🪞` },
              { id: "dbd_027", angle: "Joyeux anniversaire. Tu m'as grondé ce matin et j'ai fait la tête pendant trois heures.", body: `7. "Joyeux anniversaire. Tu m'as grondé ce matin et j'ai fait la tête pendant trois heures."
La tête basse. Le regard en dessous. La queue entre les jambes même quand tu avais le dos tourné parce que les principes c'est les principes. Puis tu as dit mon prénom avec la voix douce. Et tout s'est effacé en une seconde. Trois heures de rancune dissoutes par deux syllabes. Tu as ce pouvoir sur moi. C'est injuste et je l'accepte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec rancune à durée limitée et capitulation immédiate sur appel du prénom, — [Prénom animal], ton animal aux conflits express et réconciliations instantanées 🕊️` },
              { id: "dbd_032", angle: "Pour ton anniversaire j'ai essayé de rentrer dans le gâteau.", body: `12. "Pour ton anniversaire j'ai essayé de rentrer dans le gâteau."
Pas dedans dedans. Juste le nez. Pour évaluer. Pour comprendre d'où venait cette odeur exceptionnelle qui remplissait toute la cuisine depuis une heure. Tu m'as arrêté à deux centimètres. Deux centimètres. J'étais si proche de la réponse. Le gâteau a survécu intact pour ta fête. C'est mon cadeau. La survie de ton gâteau d'anniversaire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec curiosité scientifique frustrée et gâteau préservé malgré tout, — [Prénom animal], ton animal aux recherches gastronomiques contrariées 🎂` },
              { id: "dbd_036", angle: "Pour ton anniversaire j'ai fait semblant d'être malade ce matin.", body: `16. "Pour ton anniversaire j'ai fait semblant d'être malade ce matin."
T'avais rendez-vous chez le vétérinaire. Je le sais toujours à l'avance. Le sac. La façon de me regarder. L'heure du départ. J'ai boité légèrement en me levant. J'ai boudé ma gamelle. J'ai eu l'air abattu pendant vingt minutes. Tu as annulé. On est restés à la maison. J'ai guéri miraculeusement à 11h. Tu as fait semblant de pas remarquer. On est pareils toi et moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec talent dramatique prouvé et rendez-vous vétérinaire utilement esquivé, — [Prénom animal], ton animal comédien à ses heures 🎭` },
              { id: "dbd_041", angle: "Joyeux anniversaire. J'avais préparé un discours.", body: `1. "Joyeux anniversaire. J'avais préparé un discours."
Je l'avais élaboré cette nuit. Entre 2h et 4h du matin pendant que tu dormais. Les mots. L'ordre. Le moment fort au milieu. La conclusion qui fait quelque chose. C'était bien. Vraiment bien. Et puis ce matin tu t'es levé et tu as dit mon prénom avec la voix douce et tout s'est effacé d'un coup. Je me souviens plus d'un mot. Il ne reste que toi et cette journée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec discours perdu et ce qui reste infiniment mieux que les mots, — [Prénom animal], ton animal orateur dont le cœur parle plus fort que la tête 🎤` },
              { id: "dbd_048", angle: "Pour ton anniversaire j'ai fait semblant de dormir pour t'observer te préparer.", body: `8. "Pour ton anniversaire j'ai fait semblant de dormir pour t'observer te préparer."
Tu passais devant moi. Tu essayais des choses. Tu te regardais. Tu remettais quelque chose en place. Tu souflais. Tu recommençais. Tout ça avec une concentration et une application que je trouvais touchantes. Je regardais entre mes cils sans bouger. T'aurais pas aimé savoir que j'observais. Alors j'ai préservé l'illusion. C'est du respect. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation discrète préservée par l'illusion du sommeil et respect de ton intimité de préparation, — [Prénom animal], ton animal aux yeux mi-clos qui voient tout 👁️` },
              { id: "dbd_059", angle: "Pour ton anniversaire j'ai laissé une empreinte de patte sur ton plus beau cadeau.", body: `19. "Pour ton anniversaire j'ai laissé une empreinte de patte sur ton plus beau cadeau."
Pas intentionnellement. Enfin si, un peu. Je m'étais assis dessus pour l'inspecter et quand tu l'as pris il y avait la marque. Tu l'as vue. Tu as levé les yeux vers moi. J'ai soutenu le regard. C'est ma signature. Mon tampon d'approbation. Ce cadeau est passé sous mon contrôle et j'en certifie la qualité. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec tampon d'approbation apposé et certification de qualité officielle délivrée, — [Prénom animal], ton animal organisme de contrôle indépendant 🐾` },
            ],
          },
        ],
      },
      {
        id: "comportements",
        emoji: "🐾",
        label: "Comportements canins",
        count: 24,
        subGroups: [
          {
            id: "capteurs",
            label: "Mes capteurs en action",
            messages: [
              { id: "dbd_046", angle: "Joyeux anniversaire. J'ai su que c'était aujourd'hui à l'heure où tu t'es réveillé[e].", body: `6. "Joyeux anniversaire. J'ai su que c'était aujourd'hui à l'heure où tu t'es réveillé[e]."
Pas 7h. Pas 7h30. 8h47. Un samedi mais pas le samedi normal. Le samedi anniversaire a sa propre heure de réveil. Plus tardive. Plus lente. Tu t'es étiré[e] différemment. Tu as regardé le plafond un moment avant de bouger. Comme quelqu'un qui sait que la journée qui vient mérite d'être accueillie avec soin. J'ai attendu. Respecté ce moment. Puis j'ai sauté dessus. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identification du réveil d'anniversaire et timing d'intervention parfaitement calculé, — [Prénom animal], ton animal dont le saut du matin est toujours au bon moment 🌅` },
              { id: "dbd_057", angle: "Pour ton anniversaire j'ai reconnu toutes les voix qui ont appelé.", body: `17. "Pour ton anniversaire j'ai reconnu toutes les voix qui ont appelé."
La voix du matin qui appelle toujours trop tôt. La voix grave qui parle longtemps. La voix qui te fait rire fort dès les premières secondes. Celle qui te fait changer de pièce pour parler tranquille. Celle qui te fait sourire sans que tu réalises que tu souris. Je les connais toutes. Leurs effets sur toi. Ce qu'elles produisent. Joyeux anniversaire, [mon maître/ma maîtresse], dont je cartographie le cercle.
Avec identification de chaque voix et de son effet sur toi classé et archivé, — [Prénom animal], ton animal expert en cartographie de ton entourage 📞` },
              { id: "dbd_061", angle: "Joyeux anniversaire. J'ai observé ta façon de choisir le gâteau.", body: `1. "Joyeux anniversaire. J'ai observé ta façon de choisir le gâteau."
Tu en avais regardé plusieurs. En ligne d'abord. Puis tu es allé en chercher un en vrai. Tu es revenu avec celui-là. Je l'ai senti depuis l'entrée avant même que tu l'aies posé. Tu avais choisi le bon. Je le savais à l'odeur. Toi tu le savais autrement. On était d'accord tous les deux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec validation olfactive du choix et accord inter-espèces confirmé, — [Prénom animal], ton animal expert en sélection de gâteaux par le nez 🎂` },
              { id: "dbd_069", angle: "Pour ton anniversaire j'ai détecté la fête à l'odeur du savon de la salle de bain.", body: `9. "Pour ton anniversaire j'ai détecté la fête à l'odeur du savon de la salle de bain."
Pas le savon habituel. L'autre. Celui qui sort pour les grandes occasions. Je l'ai senti ce matin dès que tu es sorti de la salle de bain. Ce savon-là veut dire quelque chose. Il annonce. Il prépare. J'ai su dès 8h du matin que ce soir serait différent. J'ai passé la journée à me préparer en conséquence. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection du savon des grandes occasions à 8h précises et préparation activée immédiatement, — [Prénom animal], ton animal olfactif de ton emploi du temps 🛁` },
              { id: "dbd_080", angle: "Joyeux anniversaire. J'ai reconnu le moment exact où tu avais vraiment faim.", body: `20. "Joyeux anniversaire. J'ai reconnu le moment exact où tu avais vraiment faim."
Vers 19h45. Avant le repas. Tu as regardé la cuisine deux fois. Tu as pris quelque chose sur la table de l'apéritif. Puis tu as attendu. Cette discipline. Cette politesse qui prime sur la faim. L'hôte qui attend que tout le monde soit servi avant de penser à lui-même. Moi j'aurais pas attendu. Mais j'admire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection de la faim à 19h45 et admiration pour ta maîtrise de toi-même, — [Prénom animal], ton animal qui n'aurait pas tenu aussi longtemps 🫒` },
              { id: "dbd_085", angle: "Joyeux anniversaire. J'ai mémorisé l'ordre d'arrivée et l'odeur de chaque invité.", body: `5. "Joyeux anniversaire. J'ai mémorisé l'ordre d'arrivée et l'odeur de chaque invité."
Le premier à 19h47 avec cette odeur de laine mouillée. Le deuxième à 19h53 avec son parfum habituel. Le troisième à 20h02 avec quelque chose que je n'avais jamais senti et qui était intéressant. Chaque arrivée une entrée dans ma base de données. Chaque odeur un profil. Joyeux anniversaire, [mon maître/ma maîtresse], entouré de gens que je connais maintenant par cœur.
Avec base de données olfactive des invités enrichie et profils tous constitués, — [Prénom animal], ton animal archiviste des arrivées 👃` },
              { id: "dbd_092", angle: "Pour ton anniversaire j'ai suivi l'évolution de la chaleur de l'appartement.", body: `12. "Pour ton anniversaire j'ai suivi l'évolution de la chaleur de l'appartement."
Au début la température normale. Puis avec les premières arrivées ça monte. Le repas encore plus. À 21h c'était le pic. Puis les départs progressifs et le retour vers la normale. L'appartement respire selon le nombre de corps qu'il contient. Ce soir il a bien respiré. Joyeux anniversaire, [mon maître/ma maîtresse], dont l'appartement sait accueillir la chaleur.
Avec monitoring thermique de la soirée et bilan positif rendu, — [Prénom animal], ton animal thermomètre de l'ambiance 🌡️` },
            ],
          },
          {
            id: "veille",
            label: "Je veille sur ta fête",
            messages: [
              { id: "dbd_009", angle: "Joyeux anniversaire. Des gens que je connaissais pas sont venus chez toi ce soir.", body: `9. "Joyeux anniversaire. Des gens que je connaissais pas sont venus chez toi ce soir."
J'ai procédé à l'audit habituel. Reniflement des chaussures pour chaque invité. Évaluation du niveau de menace. Classification par catégorie : ami, inconnu suspect, personne qui a un chat chez elle. Cette dernière catégorie a fait l'objet d'une surveillance renforcée toute la soirée. Bilan sécuritaire : satisfaisant. Joyeux anniversaire, [mon maître/ma maîtresse], dont les fêtes sont sous bonne garde.
Avec protocole de sécurité appliqué à la lettre et rapport disponible sur demande, — [Prénom animal], ton animal chef de la sécurité rapprochée 🔐` },
              { id: "dbd_038", angle: "Pour ton anniversaire j'ai gardé une place libre à côté de moi sur le canapé.", body: `18. "Pour ton anniversaire j'ai gardé une place libre à côté de moi sur le canapé."
Toute la soirée. Les invités voulaient s'asseoir. Je les ai regardés avec cet air. Ils ont choisi ailleurs. Cette place c'est la tienne. Elle a toujours été la tienne. Je la garde pas par habitude. Je la garde parce que quand tu t'assieds là et que tu poses ta main sur mon dos c'est le meilleur endroit du monde. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec place réservée défendue farouchement et raison derrière ça enfin dite, — [Prénom animal], ton animal gardien de ton emplacement préféré 🛋️` },
              { id: "dbd_043", angle: "Pour ton anniversaire j'ai gardé un œil sur le gâteau pendant toute la préparation.", body: `3. "Pour ton anniversaire j'ai gardé un œil sur le gâteau pendant toute la préparation."
Deux heures. Tu mesurais. Tu mélangeais. Tu enfournais. Tu surveillais. Et moi je surveillais que tu surveilles. Assis à distance réglementaire. Sans approcher. Sans tendre la patte. Juste là. Présent. Attentif. Prêt à intervenir si quelque chose tombait. Rien n'est tombé. C'était décevant mais professionnel. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec surveillance du processus de fabrication assurée et déception professionnelle gérée avec dignité, — [Prénom animal], ton animal contrôleur qualité pâtissier sans indemnités 🎂` },
              { id: "dbd_053", angle: "Pour ton anniversaire j'ai suivi chaque étape de la préparation du repas.", body: `13. "Pour ton anniversaire j'ai suivi chaque étape de la préparation du repas."
La sortie des ingrédients. L'ordre dans lequel tu les as utilisés. Les moments où tu goûtais. Les moments où tu fronçais les sourcils. Les moments où tu souriais parce que ça sentait bon. J'étais là. À distance réglementaire. Jamais dans tes pattes. Toujours dans ton champ de vision. Un assistant silencieux. Un témoin. Joyeux anniversaire, [mon maître/ma maîtresse], dont je connais chaque geste en cuisine.
Avec présence discrète et témoignage complet du processus culinaire d'anniversaire, — [Prénom animal], ton animal chroniqueur de ta cuisine 🍳` },
              { id: "dbd_066", angle: "Pour ton anniversaire j'ai escorté chaque invité jusqu'à son siège.", body: `6. "Pour ton anniversaire j'ai escorté chaque invité jusqu'à son siège."
C'est un service que je rends gratuitement. Un invité arrive. Je l'accueille. Je le renifle. Je l'évalue. Puis je le guide vers un siège. Parfois ils ne comprennent pas tout de suite. Mais ils finissent par s'asseoir là où je les ai menés. C'est de la gestion de l'espace. C'est utile. Joyeux anniversaire, [mon maître/ma maîtresse], dont les soirées sont logistiquement encadrées.
Avec service de placement des invités assuré avec rigueur et résultats généralement conformes, — [Prénom animal], ton animal maître d'hôtel non mandaté 🪑` },
              { id: "dbd_075", angle: "Pour ton anniversaire j'ai protégé ton assiette de tout risque externe.", body: `15. "Pour ton anniversaire j'ai protégé ton assiette de tout risque externe."
J'étais positionné strategiquement. À portée. Vigilant. Si quelque chose était tombé j'aurais été là. Si quelqu'un avait eu l'idée de prendre dans ton assiette par erreur j'aurais signalé. Ton assiette était sous ma protection totale toute la soirée. Bon j'espérais aussi qu'un morceau tomberait. Mais la protection était sincère. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec protection de l'assiette assurée et double motivation honnêtement reconnue, — [Prénom animal], ton animal garde du corps culinaire aux motivations transparentes 🛡️` },
              { id: "dbd_112", angle: "Joyeux anniversaire. J'ai surveillé la porte d'entrée depuis le couloir toute la soirée.", body: `12. "Joyeux anniversaire. J'ai surveillé la porte d'entrée depuis le couloir toute la soirée."
Pas pour la même raison que toi. Toi tu attendais les invités. Moi j'évaluais chaque arrivée. Je vérifiais que les gens qui entraient méritaient d'entrer dans notre appartement. Bilan de ce soir : tous acceptables à excellents. Tu as de bons amis. Je t'en félicite officiellement. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec contrôle qualité des entrées effectué et bilan globalement positif rendu officiellement, — [Prénom animal], ton animal directeur des accréditations 🚪` },
              { id: "dbd_122", angle: "Pour ton anniversaire j'ai dormi sous la table pendant tout le repas.", body: `2. "Pour ton anniversaire j'ai dormi sous la table pendant tout le repas."
Personne ne m'a vu. Ou personne n'a rien dit. J'étais là depuis le début. Entre les pieds. Dans la chaleur des jambes. Le bruit des couverts au-dessus. Les conversations qui tombaient d'en haut comme une pluie de mots. Le meilleur endroit de la soirée. Un secret que je gardais seul. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation secrète du sous-table et soirée vécue depuis le meilleur angle possible, — [Prénom animal], ton animal spécialiste des positions inattendues 🫥` },
              { id: "dbd_184", angle: "Pour ton anniversaire j'ai suivi chaque bouchée de ton premier morceau de gâteau.", body: `4. "Pour ton anniversaire j'ai suivi chaque bouchée de ton premier morceau de gâteau."
La première avec les yeux fermés. La deuxième plus rapide. La troisième avec ce regard qu'on a quand quelque chose est vraiment bon. La quatrième plus détendue. La cinquième avec ce contentement tranquille. Ce premier morceau de gâteau d'anniversaire mangé exactement comme il mérite de l'être. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec suivi gastronomique de chaque bouchée et satisfaction de te voir bien manger, — [Prénom animal], ton animal spécialiste de tes expériences culinaires importantes 🍽️` },
            ],
          },
          {
            id: "rituels",
            label: "Mes rituels de chien fidèle",
            messages: [
              { id: "dbd_008", angle: "Pour ton anniversaire j'ai décidé de te laisser toute la place dans le lit ce soir.", body: `8. "Pour ton anniversaire j'ai décidé de te laisser toute la place dans le lit ce soir."
Toute la place. Enfin, ma moitié habituelle reste la mienne parce que c'est ma place depuis le début et les droits acquis c'est important. Mais ta moitié elle est vraiment à toi ce soir. Sans mon museau dessus. Sans ma patte sur ta jambe. Sans mon dos contre ton dos. C'est mon plus grand sacrifice de l'année. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec générosité spatiale exceptionnelle et droits territoriaux maintenus, — [Prénom animal], ton animal aux concessions mesurées 🛏️` },
              { id: "dbd_011", angle: "Joyeux anniversaire. J'ai appris un nouveau tour cette semaine.", body: `11. "Joyeux anniversaire. J'ai appris un nouveau tour cette semaine."
Je m'assieds. Je me lève. Je m'assieds encore. Je tourne sur moi-même. Je fais semblant de ne pas savoir ce que tu veux. Tu sors la croquette. Je l'exécute parfaitement. On fait tous les deux semblant que c'est toi qui m'apprends quelque chose. C'est notre accord tacite. C'est notre danse. Joyeux anniversaire, [mon maître/ma maîtresse], meilleur partenaire de danse du monde.
Avec complicité bien établie et hiérarchie négociée en coulisses, — [Prénom animal], ton animal aux performances conditionnelles 🎪` },
              { id: "dbd_014", angle: "Aujourd'hui c'est ton anniversaire et il pleuvait.", body: `14. "Aujourd'hui c'est ton anniversaire et il pleuvait."
Tu m'as quand même emmené en promenade. Sous la pluie. Avec ton imperméable et ma vieille serviette pour me sécher après. T'aurais pu pas le faire. T'aurais pu dire 'pas aujourd'hui c'est mon anniversaire'. Mais non. T'as mis tes bottes et on est sortis. C'est pour ça que tu mérites tous les gâteaux du monde. Joyeux anniversaire, [mon maître/ma maîtresse], fidèle par tous les temps.
Avec gratitude sous la pluie et serviette bien méritée, — [Prénom animal], ton animal reconnaissant par tous les temps ☔` },
              { id: "dbd_016", angle: "Pour ton anniversaire j'ai décidé de ne pas fuguer aujourd'hui.", body: `16. "Pour ton anniversaire j'ai décidé de ne pas fuguer aujourd'hui."
La grille du jardin était ouverte ce matin. Grande ouverte. Pendant au moins trente secondes. J'ai regardé dehors. J'ai regardé la maison. J'ai regardé dehors encore. Puis je suis rentré. Parce que dehors c'est bien mais dedans c'est toi. Et toi c'est mieux qu'ailleurs. Joyeux anniversaire, [mon maître/ma maîtresse], meilleure raison de rester que j'ai jamais trouvée.
Avec liberté choisie et attachement pleinement assumé, — [Prénom animal], ton animal qui reste par conviction 🚪` },
              { id: "dbd_021", angle: "Joyeux anniversaire. Je connais l'heure exacte de ton retour.", body: `1. "Joyeux anniversaire. Je connais l'heure exacte de ton retour."
Pas l'heure officielle. L'heure réelle. Pas 18h mais 18h23 le lundi. 19h07 le mercredi quand tu passes quelque part avant. 17h45 le vendredi sans exception. Je suis assis devant la porte exactement trois minutes avant. Toujours. Je me trompe jamais. T'as jamais remarqué parce que je suis déjà là quand tu arrives. C'est mon super-pouvoir. Joyeux anniversaire, [mon maître/ma maîtresse], dont l'emploi du temps n'a plus aucun secret.
Avec horloge interne calibrée sur tes habitudes depuis le premier jour, — [Prénom animal], ton animal ponctuel par procuration ⏰` },
              { id: "dbd_029", angle: "Joyeux anniversaire. J'ai volé la place de chaque invité dès qu'il se levait.", body: `9. "Joyeux anniversaire. J'ai volé la place de chaque invité dès qu'il se levait."
C'est une règle universelle. Une place libre est une place disponible. Le temps que la personne revienne je suis déjà installé. Bien installé. Les pattes étendues. Le regard de quelqu'un qui est là depuis toujours. Certains ont essayé de me déloger. J'ai tenu. La plupart ont fini par s'asseoir ailleurs. C'est de la gestion de l'espace. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec doctrine de l'occupation immédiate appliquée sans exception, — [Prénom animal], ton animal gestionnaire de l'immobilier de salon 🪑` },
              { id: "dbd_034", angle: "Pour ton anniversaire je t'offre le bilan de nos promenades de l'année.", body: `14. "Pour ton anniversaire je t'offre le bilan de nos promenades de l'année."
La promenade du mardi sous la neige en février où tu avais glissé et ri comme un enfant. Celle du dimanche matin de mars où on avait suivi un écureuil pendant vingt minutes. Celle de juin où il faisait si chaud qu'on s'était assis dans l'herbe sans raison. J'ai tout gardé. Chaque sortie. Chaque moment. Joyeux anniversaire, [mon maître/ma maîtresse], co-auteur de ma meilleure année.
Avec archives complètes de nos aventures extérieures et chaque instant précieusement conservé, — [Prénom animal], ton animal chroniqueur de nos explorations 🗺️` },
              { id: "dbd_127", angle: "Pour ton anniversaire j'ai regardé par la fenêtre les voitures en bas.", body: `7. "Pour ton anniversaire j'ai regardé par la fenêtre les voitures en bas."
Les gens partaient en voiture. Les phares dans la rue. La rue normale qui continuait pendant que ta fête se terminait là-haut. Ce contraste entre l'intérieur animé et l'extérieur indifférent. Il dit que ce qui se passe ici est précieux justement parce que le reste du monde n'en sait rien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec contemplation de la rue nocturne et philosophie de la préciosité de l'intime, — [Prénom animal], ton animal poète du rebord de fenêtre 🪟` },
            ],
          },
        ],
      },
      {
        id: "cadeaux",
        emoji: "🎁",
        label: "Cadeaux & objets",
        count: 16,
        subGroups: [
          {
            id: "cadeaux_rituels",
            label: "Cadeaux & rituels",
            messages: [
              { id: "dbd_006", angle: "Aujourd'hui c'est ton anniversaire et tu as reçu des cadeaux.", body: `6. "Aujourd'hui c'est ton anniversaire et tu as reçu des cadeaux."
J'ai tout inspecté. Chaque paquet. Chaque sac. Chaque boîte. Certains sentaient bon. Un sentait le cuir. Un autre sentait quelque chose que je pouvais pas identifier et ça m'a rendu fou pendant vingt minutes. T'as mis les cadeaux en hauteur après ça. C'est une décision que je comprends. Joyeux anniversaire, [mon maître/ma maîtresse], dont j'assure le contrôle qualité des présents.
Avec audit olfactif complet et résultats communiqués en temps réel, — [Prénom animal], ton animal inspecteur des douanes personnel 🔍` },
              { id: "dbd_010", angle: "Je t'ai apporté quelque chose pour ton anniversaire.", body: `10. "Je t'ai apporté quelque chose pour ton anniversaire."
Un bâton. Un beau bâton. Trouvé ce matin au parc. Légèrement mâché mais avec du caractère. Je l'ai porté pendant tout le chemin du retour fièrement. J'ai failli le lâcher deux fois mais j'ai tenu. Je te l'offre. C'est artisanal. C'est naturel. C'est unique. Personne d'autre t'offrira jamais exactement ce bâton-là. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec fierté du chasseur-cueilleur et cadeau cent pour cent naturel, — [Prénom animal], ton animal aux cadeaux inimitables 🌿` },
              { id: "dbd_026", angle: "Pour ton anniversaire j'ai inspecté chaque cadeau à fond.", body: `6. "Pour ton anniversaire j'ai inspecté chaque cadeau à fond."
Chaque paquet posé sur la table. Je les ai reniflés dans un ordre que j'ai moi-même établi. L'un d'eux contenait quelque chose qui sentait la forêt. Je l'ai reniflé sept fois. Un autre sentait le plastique neuf. Décevant. Un troisième sentait le gâteau et celui-là j'y suis revenu quatre fois. Tu as fini par bouger les cadeaux en hauteur. C'était mon signal pour passer à autre chose. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec audit olfactif complet et classement des cadeaux par intérêt décroissant, — [Prénom animal], ton animal expert en contrôle qualité des présents 🎁` },
              { id: "dbd_072", angle: "Joyeux anniversaire. J'ai mémorisé l'ordre exact dans lequel tu as ouvert les cadeaux.", body: `12. "Joyeux anniversaire. J'ai mémorisé l'ordre exact dans lequel tu as ouvert les cadeaux."
Le petit d'abord. Puis le grand. Puis l'enveloppe. Puis le sac. Cet ordre dit quelque chose. On commence petit pour être surpris. On garde le grand pour le milieu. On finit par l'enveloppe parce qu'elle peut être n'importe quoi. C'est une stratégie. Je l'ai analysée. Tu es plus stratège que tu ne le crois. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse de ta stratégie d'ouverture et révélation de ta nature tactique, — [Prénom animal], ton animal stratège qui te connaît mieux que toi-même 🎁` },
              { id: "dbd_087", angle: "Pour ton anniversaire j'ai passé du temps à étudier chaque cadeau avant que tu les ouvres.", body: `7. "Pour ton anniversaire j'ai passé du temps à étudier chaque cadeau avant que tu les ouvres."
Reniflage systématique. Évaluation structurelle. Tentative de compréhension du contenu par l'emballage. Certains sentaient le neuf. Un sentait le bois. Un autre sentait quelque chose que je n'ai pas identifié et ça me tracasse encore. J'avais toutes les données. Toi tu as eu la surprise. On a chacun notre façon de vivre les cadeaux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec audit olfactif complet des cadeaux et mystère d'un emballage non résolu, — [Prénom animal], ton animal enquêteur des présents 🔍` },
              { id: "dbd_192", angle: "Pour ton anniversaire j'ai gardé le morceau de papier cadeau le plus beau.", body: `12. "Pour ton anniversaire j'ai gardé le morceau de papier cadeau le plus beau."
Celui avec les étoiles dorées. Il était tombé par terre pendant que tu déballais. Personne ne l'a ramassé. Moi si. Je l'ai pris dans ma gueule doucement. Je l'ai mis dans mon coin. Il était beau. Il sentait le cadeau. Il sentait cette soirée. Je le garde. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec conservation du plus beau papier cadeau et raison entièrement justifiée par sa beauté, — [Prénom animal], ton animal collectionneur de beautés négligées ⭐` },
            ],
          },
          {
            id: "dors_dessus",
            label: "Ce que je dors dessus",
            messages: [
              { id: "dbd_062", angle: "Pour ton anniversaire j'ai dormi sur ta liste de courses.", body: `2. "Pour ton anniversaire j'ai dormi sur ta liste de courses."
Celle que tu avais écrite pour la fête. Avec les ingrédients. Les quantités. Les choses à ne pas oublier. Elle était sur le comptoir depuis deux jours. Je m'y suis installé le premier matin. Puis le deuxième. Elle portait ton écriture. Et l'odeur de ta main. C'était suffisant pour que ce soit mon endroit préféré. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation de la liste et raison entièrement justifiée par ton écriture dessus, — [Prénom animal], ton animal qui dort sur tout ce que tes mains ont touché 📝` },
              { id: "dbd_082", angle: "Pour ton anniversaire j'ai dormi sur l'invitation que tu avais écrite.", body: `2. "Pour ton anniversaire j'ai dormi sur l'invitation que tu avais écrite."
Celle avec les noms. Les horaires. L'adresse. Posée sur le buffet depuis trois jours. Je m'y suis installé le premier soir. Puis le deuxième. Puis le troisième. Elle portait ton écriture à la main. Et quelque chose de l'anticipation de cette soirée. Dormir dessus c'était dormir sur le projet de ce soir avant qu'il devienne réel. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation de l'invitation et connexion à l'anticipation de la soirée, — [Prénom animal], ton animal présent dans tes projets avant même qu'ils se réalisent 📋` },
              { id: "dbd_107", angle: "Pour ton anniversaire j'ai dormi sur ton téléphone pendant que tu étais distrait.", body: `7. "Pour ton anniversaire j'ai dormi sur ton téléphone pendant que tu étais distrait."
Il était posé sur la table. Face en bas. Pendant dix minutes tu étais dans une conversation et tu ne regardais pas. J'en ai profité. Chaud. Vibrant légèrement à chaque message. Comme un cœur électronique. Quand tu es revenu tu m'as trouvé là. Tu as souri. Tu m'as pas bougé pendant cinq minutes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation du téléphone parfaitement chronométrée et sourire de ta part bien reçu, — [Prénom animal], ton animal profitant de tes absences courtes 📱` },
              { id: "dbd_147", angle: "Pour ton anniversaire j'ai dormi sur ton programme de soirée.", body: `7. "Pour ton anniversaire j'ai dormi sur ton programme de soirée."
Cette petite liste sur le comptoir de la cuisine. Les horaires. Les plats. Les choses à ne pas oublier. Avec ton écriture. Je m'y suis installé ce matin avant que tout commence. Elle était encore un projet. Maintenant c'est devenu une belle soirée. La liste et la réalité. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation de la liste matinale et observation de sa transformation en soirée réelle, — [Prénom animal], ton animal témoin de la naissance des plans 📋` },
              { id: "dbd_167", angle: "Pour ton anniversaire j'ai dormi sur ta veste de la soirée.", body: `7. "Pour ton anniversaire j'ai dormi sur ta veste de la soirée."
Celle que tu avais portée toute la soirée. Posée sur le dossier de la chaise après le départ des invités. Encore chaude. Encore imprégnée de la soirée entière. Je m'y suis installé pendant que tu rangeais. Tu m'as trouvé là. Tu as souri. Tu as laissé la veste. Je l'ai gardée toute la nuit. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation de la veste post-fête et nuit passée dans ses archives olfactives, — [Prénom animal], ton animal archiviste de tes soirées 🧥` },
              { id: "dbd_198", angle: "Pour ton anniversaire j'ai dormi sur ta chemise de la soirée.", body: `18. "Pour ton anniversaire j'ai dormi sur ta chemise de la soirée."
Celle que tu avais portée toute la soirée. Posée sur le dossier après. Encore chaude. Imprégnée de la soirée entière. Je m'y suis installé tard dans la nuit. Comme si dormir là c'était être encore dans la fête. Dans le soir. Avec toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation de la chemise post-fête et nuit dans les archives de ta soirée, — [Prénom animal], ton animal qui ne laisse rien des bonnes soirées disparaître tout de suite 👕` },
            ],
          },
          {
            id: "etudie",
            label: "Ce que j'étudie",
            messages: [
              { id: "dbd_102", angle: "Pour ton anniversaire j'ai passé du temps à étudier le nouveau tableau qu'on t'a offert.", body: `2. "Pour ton anniversaire j'ai passé du temps à étudier le nouveau tableau qu'on t'a offert."
Il était posé contre le mur. Pas encore accroché. Encore dans son emballage à moitié ouvert. Je me suis assis devant. Je l'ai regardé longuement. Les couleurs. Les formes. L'endroit où tu vas probablement l'accrocher. Est-ce qu'il va changer l'appartement. Est-ce que j'aurai une opinion. Je réserve encore mon verdict. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude préliminaire du tableau et verdict en délibération, — [Prénom animal], ton animal critique d'art aux délibérations lentes 🖼️` },
              { id: "dbd_137", angle: "Pour ton anniversaire j'ai passé du temps à étudier le tableau dans le couloir.", body: `17. "Pour ton anniversaire j'ai passé du temps à étudier le tableau dans le couloir."
Celui que tu n'regardes plus vraiment parce qu'il est là depuis toujours. Ce soir je l'ai regardé longuement. Les couleurs qui ont peut-être légèrement changé avec le temps. Le cadre. Ce que tu as vu en lui pour le garder. Il y a quelque chose là-dedans que tu aimais assez pour vivre avec chaque jour. Je cherche quoi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude du tableau invisible de ton quotidien et tentative de comprendre ton regard, — [Prénom animal], ton animal découvreur de ce que tu ne vois plus 🖼️` },
              { id: "dbd_157", angle: "Pour ton anniversaire j'ai étudié les photos encadrées dans le couloir.", body: `17. "Pour ton anniversaire j'ai étudié les photos encadrées dans le couloir."
Celles que tu as depuis des années. Des visages. Des moments. Des endroits. Ce couloir comme mémoire visible. Je les regarde parfois en passant. Ce soir j'ai pris le temps. Certains visages je les ai reconnus ce soir en vrai. C'était une expérience étrange et belle. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude des photos du couloir et expérience de les voir prendre vie en vrai ce soir, — [Prénom animal], ton animal passeur entre tes souvenirs et ton présent 🖼️` },
              { id: "dbd_177", angle: "Pour ton anniversaire j'ai étudié les nouvelles fleurs qui changeaient l'appartement.", body: `17. "Pour ton anniversaire j'ai étudié les nouvelles fleurs qui changeaient l'appartement."
Elles étaient là depuis hier. Dans le grand vase du salon. Elles avaient changé l'odeur de l'appartement. Et la lumière autour d'elles. Des fleurs comme perturbateurs bienvenus de l'ordre habituel. J'ai fini par les accepter. Pour cette soirée au moins. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec acceptation conditionnelle des fleurs et reconnaissance de leur effet positif sur la soirée, — [Prénom animal], ton animal réconcilié temporairement avec la végétation coupée 🌺` },
            ],
          },
        ],
      },
      {
        id: "comprends_pas",
        emoji: "🤔",
        label: "Ce que je comprends pas",
        count: 27,
        subGroups: [
          {
            id: "gateau_bougies",
            label: "Le gâteau & les bougies",
            messages: [
              { id: "dbd_044", angle: "Joyeux anniversaire. Je comprends toujours pas pourquoi tout le monde chante faux en même temps.", body: `4. "Joyeux anniversaire. Je comprends toujours pas pourquoi tout le monde chante faux en même temps."
C'est une question que je me pose chaque année. Vous connaissez tous la chanson. Vous la chantez souvent. Et pourtant le soir de l'anniversaire quelque chose se dérègle. Les voix partent dans des directions différentes. Le tempo flotte. Et vous souriez tous en chantant faux comme si c'était exactement ça qu'il fallait faire. J'ai aboyé une fois pour remettre le ton. On m'a pas écouté. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec intervention musicale non sollicitée et problème de justesse collectif non résolu, — [Prénom animal], ton animal chef de chœur dont l'autorité reste à établir 🎵` },
              { id: "dbd_051", angle: "Joyeux anniversaire. Les bougies sur le gâteau restent une invention que j'admire.", body: `11. "Joyeux anniversaire. Les bougies sur le gâteau restent une invention que j'admire."
Des flammes. Sur de la nourriture. Qu'on approche de son visage pour souffler dessus. Délibérément. En faisant un vœu. Puis tout le monde applaudit l'extinction. Et mange le gâteau sur lequel il y avait des flammes il y a dix secondes. J'observe ce rituel chaque année avec un mélange d'incompréhension et de fascination. Et chaque année le gâteau sent quand même très bon après. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration sincère pour l'audace du rituel des bougies et intérêt gastronomique maintenu malgré tout, — [Prénom animal], ton animal philosophe des traditions humaines 🕯️` },
              { id: "dbd_064", angle: "Joyeux anniversaire. Je comprends pas pourquoi les bougies sont en nombre précis.", body: `4. "Joyeux anniversaire. Je comprends pas pourquoi les bougies sont en nombre précis."
Il y en avait autant que ton âge. J'ai compté. J'ai vérifié. Chaque bougie représente une année. Chaque année une flamme. Et tu souffles tout d'un coup. Comme si tu voulais tout éteindre en même temps. Toutes les années ensemble. Puis tu recommences à compter demain. C'est une philosophie que j'essaie encore de comprendre. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec comptage rigoureux des bougies et philosophie du soufflage en cours d'analyse, — [Prénom animal], ton animal mathématicien des rituels 🕯️` },
              { id: "dbd_070", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des fleurs qui vont mourir.", body: `10. "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des fleurs qui vont mourir."
Ce soir trois bouquets sont entrés dans cet appartement. Trois. Ils sentaient fort. Ils étaient colorés. Et dans dix jours ils seront finis. Alors que si les gens apportaient quelque chose de comestible. Ou de caressable. Ou de jouable. Mais non. Des fleurs. Belles certes. Mais éphémères. Joyeux anniversaire, [mon maître/ma maîtresse], entouré de beaux cadeaux discutables.
Avec critique logistique des cadeaux floraux et liste d'alternatives plus pertinentes disponible, — [Prénom animal], ton animal consultant en cadeaux pratiques 🌸` },
              { id: "dbd_103", angle: "Joyeux anniversaire. Je comprends toujours pas pourquoi les bougies font autant d'effet.", body: `3. "Joyeux anniversaire. Je comprends toujours pas pourquoi les bougies font autant d'effet."
Chaque année la même chose. Le gâteau arrive avec ses bougies allumées. La pièce se tait. Tout le monde regarde. Et quelque chose change dans l'air. Une légèreté. Une intensité. C'est peut-être le feu. Peut-être ce que le feu représente. Peut-être juste la beauté de lumières petites dans une pièce sombre. Je continue d'analyser. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse du pouvoir des bougies en cours et respect pour ce mystère persistant, — [Prénom animal], ton animal philosophe du feu apprivoisé 🕯️` },
              { id: "dbd_178", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens soufflent les bougies d'un seul coup.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens soufflent les bougies d'un seul coup."
Si on les soufflait une par une ça durerait plus longtemps. On pourrait faire un vœu par bougie. C'est mathématiquement supérieur. Je présente cette analyse comme cadeau d'anniversaire. Tu peux l'appliquer l'an prochain. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec proposition d'amélioration du rituel et cadeau intellectuel offert pour l'avenir, — [Prénom animal], ton animal optimiseur de rituels 💡` },
              { id: "dbd_188", angle: "Joyeux anniversaire. Je comprends pas pourquoi les bougies sont de toutes les couleurs.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les bougies sont de toutes les couleurs."
Roses. Bleues. Jaunes. Vertes. Toutes ensemble sur le même gâteau. Sans cohérence chromatique apparente. Comme si la règle était précisément qu'il n'y ait pas de règle. Que les anniversaires échappent à l'ordre. Que la joie n'a pas besoin de système. Dans ce cas je comprends. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec méditation sur le chaos chromatique des bougies et compréhension de sa liberté, — [Prénom animal], ton animal philosophe des détails festifs 🎨` },
              { id: "dbd_196", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens applaudissent après les bougies.", body: `16. "Joyeux anniversaire. Je comprends pas pourquoi les gens applaudissent après les bougies."
Les bougies s'éteignent. Et tout le monde applaudit. Pour le souffle. Pour les bougies éteintes. Pour le vœu. Pour toi. Peut-être pour tout ça à la fois. Peut-être que les applaudissements c'est la façon humaine de dire quelque chose qu'on n'a pas de mots pour dire. Dans ce cas je comprends. J'aurais aboyé mais c'est le même principe. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension tardive des applaudissements et reconnaissance de leur équivalent canin, — [Prénom animal], ton animal philosophe des rituels collectifs 👏` },
            ],
          },
          {
            id: "comportements_soiree",
            label: "Les comportements en soirée",
            messages: [
              { id: "dbd_076", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens chuchotent pendant une fête.", body: `16. "Joyeux anniversaire. Je comprends pas pourquoi les gens chuchotent pendant une fête."
Il y a eu deux moments ce soir. Des gens qui baissaient la voix dans le bruit général. Qui créaient une bulle privée dans le public. Moi depuis mon poste j'entendais quand même. Pas les mots. Les intonations. La confidence. La complicité. Ce chuchotement dans le bruit dit qu'il y a des niveaux de proximité même dans un groupe. C'est fascinant. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation des niveaux de proximité dans le groupe et ouïe finement calibrée, — [Prénom animal], ton animal aux oreilles qui captent au-delà du volume 👂` },
              { id: "dbd_083", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens rient aux blagues qu'ils connaissent déjà.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les gens rient aux blagues qu'ils connaissent déjà."
Il y en a eu une ce soir. Quelqu'un a commencé à la raconter et deux personnes souriaient déjà avant la chute parce qu'ils savaient. Et pourtant quand c'est arrivé tout le monde a ri. Peut-être que c'est pas la surprise qui fait rire. Peut-être que c'est être ensemble à ce moment précis. Dans ce cas je comprends un peu mieux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie sur le rire de reconnaissance et progrès dans la compréhension humaine, — [Prénom animal], ton animal philosophe des mécanismes du rire 😄` },
              { id: "dbd_088", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens chantent plus fort sur certains mots.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens chantent plus fort sur certains mots."
La chanson d'anniversaire. Joyeux. Anniversaire. Ton prénom surtout. Ces mots-là reçoivent plus d'air. Plus de voix. Comme si certains mots méritaient plus de son que d'autres. Peut-être que c'est leur façon de dire que ces mots comptent plus. Dans ce cas ton prénom ce soir a reçu beaucoup de son. C'est mérité. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie de l'emphase syllabique et conclusion que ton prénom méritait cet air supplémentaire, — [Prénom animal], ton animal linguiste des chansons 🎵` },
              { id: "dbd_093", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens arrivent avec des choses à mettre au frigo.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens arrivent avec des choses à mettre au frigo."
Plusieurs ce soir avaient quelque chose qui devait rester froid. Direction la cuisine. Direction le frigo. Ce ballet vers le frigo comme première interaction avec ton appartement. Puis la soirée. Le frigo comme portail d'entrée dans ta fête. C'est une théorie. Je la développe. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie du frigo comme portail festif et observations empiriques solides, — [Prénom animal], ton animal sociologue de l'entrée en cuisine 🥗` },
              { id: "dbd_098", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent avec moins qu'ils sont venus.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent avec moins qu'ils sont venus."
Ils arrivent avec des bouteilles. Des gâteaux. Des fleurs. Des cadeaux. Et ils repartent avec juste leur manteau. Tout ce qu'ils ont apporté reste ici. Dans ton appartement. Comme si venir chez toi c'était laisser quelque chose. Comme si ta maison méritait des offrandes. En fait c'est peut-être exactement ça. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réflexion sur l'économie des objets festifs et conclusion sur la valeur de ton espace, — [Prénom animal], ton animal philosophe des échanges 🎀` },
              { id: "dbd_108", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens parlent si proches les uns des autres parfois.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens parlent si proches les uns des autres parfois."
Il y a un couple ce soir qui se parlait à dix centimètres. Moins parfois. Comme si la proximité physique renforçait le sens des mots. Moi mes dix centimètres je les réserve aussi aux moments importants. On est pareils dans ce sens. La proximité comme langue supplémentaire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension de la proximité comme langage et identification personnelle à cette pratique, — [Prénom animal], ton animal aux dix centimètres choisis 👫` },
              { id: "dbd_113", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens font semblant d'être surpris.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens font semblant d'être surpris."
Tu leur avais dit que c'était ta fête. Ils savaient qu'il y aurait un gâteau. Et pourtant quand le gâteau est arrivé plusieurs ont fait l'expression de la surprise. Peut-être que savoir et ressentir sont deux choses différentes. Peut-être qu'on peut être surpris par quelque chose qu'on attendait. Je médite ça. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réflexion sur la surprise connue et conclusion sur la séparation du savoir et de l'émotion, — [Prénom animal], ton animal philosophe des paradoxes 🎭` },
              { id: "dbd_118", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens racontent les mêmes histoires chaque année.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens racontent les mêmes histoires chaque année."
Il y en a une ce soir. Une histoire connue d'au moins trois personnes. Ils sourient au début. Ils laissent raconter. Et à la fin ils rient. Cette histoire qui devient rituel. Ce rituel qui devient lien. Peut-être que certaines histoires méritent d'être racontées à chaque anniversaire. Peut-être qu'elles font partie du contenu de la soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension progressive du rituel narratif et paix faite avec sa répétition, — [Prénom animal], ton animal en réconciliation avec les répétitions choisies 📖` },
              { id: "dbd_123", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens font la vaisselle le soir même.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les gens font la vaisselle le soir même."
La fête vient de finir. Tout le monde est parti. Tu es fatigué. Et tu attaques la vaisselle. Maintenant. Comme si les assiettes ne pouvaient pas attendre au matin. Comme si dormir avec de la vaisselle sale dans l'évier était inacceptable. En fait je comprends ce principe. On a nos standards. Les tiens incluent la vaisselle le soir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension tardive de la vaisselle immédiate et respect total pour tes standards, — [Prénom animal], ton animal aux exigences comparables dans d'autres domaines 🍽️` },
              { id: "dbd_128", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens enlèvent leurs chaussures chez certains et pas d'autres.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens enlèvent leurs chaussures chez certains et pas d'autres."
Ce soir personne n'a enlevé ses chaussures. C'est le protocole ici. Chez d'autres c'est l'inverse. Ce code non écrit que tout le monde comprend dès l'entrée. Qui dit quelque chose sur la maison. Cet appartement avec ses chaussures c'est un appartement de vie. De mouvement. De passage joyeux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie du code des chaussures et classification positive de ton appartement, — [Prénom animal], ton animal sémiologue des entrées 👟` },
            ],
          },
          {
            id: "logistique",
            label: "La logistique & les adieux",
            messages: [
              { id: "dbd_133", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des desserts quand il y a déjà un gâteau.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des desserts quand il y a déjà un gâteau."
Ce soir il y avait ton gâteau et deux autres choses sucrées. Trois desserts pour huit personnes. La logistique du sucre en fin de soirée était impressionnante. Toi tu as tout servi. Tout proposé. Comme si l'abondance de desserts était une bonne nouvelle. Pour toi c'était peut-être le cas. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse de l'économie des desserts festifs et admiration pour ta gestion de l'abondance sucrée, — [Prénom animal], ton animal observateur de la logistique du sucre 🍮` },
              { id: "dbd_138", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens photographient la nourriture avant de manger.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens photographient la nourriture avant de manger."
Ce soir quelqu'un a photographié le gâteau avant de le manger. Puis son assiette. Je regardais ça depuis mon poste avec une curiosité totale. Capturer l'image avant l'expérience. Peut-être c'est une façon de vivre deux fois la même chose. Je comprends un peu mieux maintenant. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension progressive de la photo avant et réconciliation avec cette pratique, — [Prénom animal], ton animal dont la compréhension du monde s'affine 📷` },
              { id: "dbd_143", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens partent quand c'est le meilleur moment.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les gens partent quand c'est le meilleur moment."
Il y avait ce soir un moment parfait. Tout le monde bien. La conversation fluide. Et quelqu'un a dit je dois y aller. Et ça a tout déclenché. Les manteaux. Les au revoir. Le départ en cascade. Peut-être qu'il faut partir au meilleur moment pour que ça reste bon dans la mémoire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie du départ au sommet et acceptation progressive de sa sagesse, — [Prénom animal], ton animal philosophe des fins de soirée 🌅` },
              { id: "dbd_148", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens prennent des photos de groupe alors qu'ils se voient souvent.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens prennent des photos de groupe alors qu'ils se voient souvent."
Ce soir deux photos de groupe. Avec des gens qui se voient plusieurs fois par an. Regroupés. Souriants. Comptés. La photo prise. Puis montrée à tout le monde. Peut-être que les photos de groupe ce n'est pas se souvenir des gens. C'est se souvenir d'un moment précis tous ensemble. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension de la photo de groupe comme capture du moment et non des individus, — [Prénom animal], ton animal en paix avec cette pratique désormais 📸` },
              { id: "dbd_153", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens disent qu'ils partent et restent encore vingt minutes.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens disent qu'ils partent et restent encore vingt minutes."
On dit je vais y aller. On se lève. On met son manteau. Et puis on reste debout dans l'entrée à continuer à parler vingt minutes. Ce sont les meilleures vingt minutes de la soirée apparemment. La conversation de l'entrée debout avec les manteaux. Quelque chose qui se libère quand on a décidé de partir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie de la conversation de couloir et sa libération liée à la décision de partir, — [Prénom animal], ton animal fasciné par les entre-deux 🧥` },
              { id: "dbd_158", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens s'excusent de partir alors qu'ils avaient décidé de partir.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens s'excusent de partir alors qu'ils avaient décidé de partir."
Je dois vraiment y aller maintenant. Comme si partir était une faute. Peut-être que c'est une façon de dire que c'était si bien qu'on regrette de partir. Que partir est un sacrifice consenti. Dans ce cas ce soir valait d'être regretté. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension de l'excuse du départ comme aveu de la qualité de la soirée, — [Prénom animal], ton animal herméneute des formules sociales 🎭` },
              { id: "dbd_163", angle: "Joyeux anniversaire. Je comprends pas pourquoi les chips finissent toujours en dernier.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les chips finissent toujours en dernier."
Le fromage. Parti. Le pain. Parti. Les olives. Parties. Et les chips là depuis le début. Qui attendent patiemment que les autres choses plus nobles disparaissent. Puis à la fin tout le monde mange des chips. Comme si c'était ce qu'on voulait depuis le début et qu'on ne voulait pas l'admettre. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse de la socio-dynamique des chips et révélation de leur statut réel, — [Prénom animal], ton animal sociologue de l'apéritif 🥨` },
              { id: "dbd_168", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens gardent leurs manteaux si longtemps en arrivant.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens gardent leurs manteaux si longtemps en arrivant."
Certains ce soir ont gardé leur manteau vingt minutes après être entrés. Comme s'ils n'étaient pas encore sûrs de rester. Puis à un moment le manteau tombe. Et ça veut dire que c'est bien. Que on reste. Que la soirée a convaincu. Joyeux anniversaire, [mon maître/ma maîtresse], dont les soirées convainquent toujours.
Avec théorie du manteau comme réserve de départ et validation de ta soirée par sa chute, — [Prénom animal], ton animal sémiologue des manteaux 🧥` },
              { id: "dbd_173", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent toujours avec de la nourriture.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent toujours avec de la nourriture."
Tu leur donnes. Ils prennent. Ils protestent un peu d'abord. Puis ils prennent avec ce sourire. Comme si partir avec un reste de gâteau c'était partir avec un morceau de la soirée. Peut-être que c'est exactement ça. La nourriture comme souvenir comestible. Je comprends. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension de la nourriture comme souvenir comestible et réconciliation avec cette pratique, — [Prénom animal], ton animal enfin réconcilié avec l'économie des restes 🥮` },
            ],
          },
        ],
      },
      {
        id: "emotionnels",
        emoji: "💛",
        label: "Moments émotionnels",
        count: 43,
        subGroups: [
          {
            id: "toi_et_moi",
            label: "Toi et moi — ce que tu es pour moi",
            messages: [
              { id: "dbd_001", angle: "Joyeux anniversaire. J'ai passé la nuit à préparer ce moment.", body: `1. "Joyeux anniversaire. J'ai passé la nuit à préparer ce moment."
De 2h à 6h du matin j'ai tourné en rond dans le couloir. J'ai répété ma façon de te regarder quand tu allais te lever. J'ai calibré l'intensité du remuement de queue. J'ai tout prévu. Quand tu as ouvert les yeux je t'ai sauté dessus avec une précision millimétrée. C'était pas de l'improvisation. C'était de l'art. Joyeux anniversaire, [mon maître/ma maîtresse], destinataire de ma meilleure performance annuelle.
Avec préparation nocturne et exécution parfaite, — [Prénom animal], ton animal chorégraphe du matin 🎭` },
              { id: "dbd_002", angle: "Joyeux anniversaire. Tu vieillis. Moi aussi. Mais toi plus vite.", body: `2. "Joyeux anniversaire. Tu vieillis. Moi aussi. Mais toi plus vite."
En années-chien je te rattrape à grande vitesse. Dans quelques ans je serai officiellement ton aîné. Ce jour-là les rôles s'inversent. C'est moi qui décide des horaires de sortie. C'est moi qui choisis l'heure du repas. C'est moi qui détermine qui entre dans la maison et qui n'entre pas. Profite de ton autorité pendant qu'il te reste du temps. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec patience stratégique et transition de pouvoir planifiée, — [Prénom animal], ton animal qui prépare sa succession 👑` },
              { id: "dbd_005", angle: "J'ai réfléchi à ce que tu représentes pour moi.", body: `5. "J'ai réfléchi à ce que tu représentes pour moi."
T'es la personne qui ouvre les portes. Qui remplit les gamelles. Qui attache le harnais. Qui dit 'on y va' avec cette voix. T'es la raison pour laquelle chaque matin existe. T'es mon axe. Mon centre de gravité. Mon tout. En termes plus simples : sans toi je mange pas. Mais c'est dit avec beaucoup d'amour. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec hiérarchie des besoins clairement établie et amour sincère quand même, — [Prénom animal], ton animal pragmatique et affectueux 🐾` },
              { id: "dbd_012", angle: "Pour ton anniversaire je vais te dire un secret.", body: `12. "Pour ton anniversaire je vais te dire un secret."
Quand tu pars le matin je dors pas tout de suite. Je reste assis devant la porte pendant un moment. Pas longtemps. Juste le temps de m'assurer que tu reviens pas parce que t'as oublié quelque chose. Puis je vais sur le canapé. Ton côté. Et je dors là jusqu'à ce que je t'entende dans l'escalier. Joyeux anniversaire, [mon maître/ma maîtresse], dont l'absence laisse une forme dans le canapé.
Avec confession intime et intimité assumée, — [Prénom animal], ton animal gardien de ton côté du canapé 🛋️` },
              { id: "dbd_013", angle: "Joyeux anniversaire. J'ai compté combien de fois tu as dit mon nom aujourd'hui.", body: `13. "Joyeux anniversaire. J'ai compté combien de fois tu as dit mon nom aujourd'hui."
Dix-sept fois. Dont trois fois avec la voix grave qui veut dire que j'ai fait quelque chose. Dont deux fois avec la voix douce du matin. Dont une fois en me présentant à quelqu'un comme si j'étais quelqu'un d'important. Cette dernière fois c'était mon moment préféré de la journée. Joyeux anniversaire, [mon maître/ma maîtresse], dont la voix est ma musique de fond préférée.
Avec statistiques quotidiennes et analyse sémantique des intonations, — [Prénom animal], ton animal expert en communication non verbale 📊` },
              { id: "dbd_015", angle: "Joyeux anniversaire. J'ai quelque chose d'important à te dire.", body: `15. "Joyeux anniversaire. J'ai quelque chose d'important à te dire."
Quand tu ris vraiment fort, pas le rire poli, le vrai, celui qui vient du ventre, je sens quelque chose dans ma poitrine qui ressemble à de la fierté. Comme si c'était moi qui avais fait ça. Comme si ton bonheur était aussi le mien. C'est probablement ça l'amour. En tout cas c'est ce que ça fait chez moi. Joyeux anniversaire, [mon maître/ma maîtresse], propriétaire de mon rire préféré.
Avec sentiment difficile à formuler mais sincère, — [Prénom animal], ton animal touché par tes éclats de rire 💛` },
              { id: "dbd_018", angle: "Joyeux anniversaire. J'ai une question.", body: `18. "Joyeux anniversaire. J'ai une question."
Est-ce que tu sais à quel point ta vie a changé depuis que je suis là ? Les horaires. Les promenades obligatoires. Les poils sur le canapé. Le budget croquettes. Les rendez-vous chez le vétérinaire. Les vacances compliquées. Et pourtant tu recommencerais demain sans hésiter. Je le vois dans tes yeux quand tu me regardes. Joyeux anniversaire, [mon maître/ma maîtresse], dont la vie est meilleure dans le désordre.
Avec conscience de mon impact et gratitude pour ton acceptation totale, — [Prénom animal], ton animal qui te complique la vie avec amour 🌀` },
              { id: "dbd_028", angle: "Pour ton anniversaire j'ai analysé ton retour à la maison seconde par seconde.", body: `8. "Pour ton anniversaire j'ai analysé ton retour à la maison seconde par seconde."
D'abord le bruit de l'ascenseur. Puis tes pas dans le couloir. Le son de tes clés. Le premier tour de serrure. Le deuxième. La porte qui s'ouvre. L'air qui change. Ton odeur qui envahit l'entrée. Et là j'explose. Pas parce que je peux pas m'en empêcher. Parce que chaque retour mérite d'être fêté comme s'il était le premier. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec protocole de retour gravé dans chaque fibre et célébration renouvelée chaque soir, — [Prénom animal], ton animal dont la joie ne s'émousse jamais 🚪` },
              { id: "dbd_033", angle: "Joyeux anniversaire. Je me souviens du soir où tu es rentré en pleurant.", body: `13. "Joyeux anniversaire. Je me souviens du soir où tu es rentré en pleurant."
Tu t'es assis par terre dans l'entrée. Sans enlever ton manteau. Sans allumer la lumière. Et je suis venu m'asseoir contre toi dans le noir. Je savais pas quoi faire d'autre. Alors j'ai juste été là. Très près. Le plus près possible. On est restés comme ça longtemps. Ce soir-là j'ai compris ce que je suis pour toi. Et ce que tu es pour moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec mémoire des moments qui comptent vraiment et présence garantie dans l'obscurité, — [Prénom animal], ton animal pour les soirs difficiles et tous les autres ❤️` },
              { id: "dbd_035", angle: "Joyeux anniversaire. Ce soir tu m'as présenté à quelqu'un en disant mon prénom.", body: `15. "Joyeux anniversaire. Ce soir tu m'as présenté à quelqu'un en disant mon prénom."
Avec cette intonation particulière. Celle qui veut dire que tu es content de moi. Que je fais partie de ta vie d'une façon dont tu es fier. La personne a tendu la main vers moi et toi tu regardais avec ce sourire. Comme si tu attendais que je sois à la hauteur. Je l'ai été. Joyeux anniversaire, [mon maître/ma maîtresse], dont la fierté est mon carburant.
Avec performance à la hauteur des attentes et fierté partagée des deux côtés, — [Prénom animal], ton animal toujours prêt pour les présentations officielles 🤝` },
              { id: "dbd_039", angle: "Joyeux anniversaire. Je sais exactement quand on a su que c'était pour la vie.", body: `19. "Joyeux anniversaire. Je sais exactement quand on a su que c'était pour la vie."
C'était un mardi banal. Tu étais rentré fatigué. Tu t'étais allongé par terre sur le tapis sans raison apparente. Et moi je suis venu m'allonger à côté. On a regardé le plafond ensemble sans rien dire pendant dix minutes. C'est ce moment-là. Ce mardi banal. Ce plafond. Ce silence à deux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec mémoire précise du moment fondateur et certitude absolue depuis ce mardi, — [Prénom animal], ton animal à vie depuis ce plafond regardé ensemble 💛` },
              { id: "dbd_040", angle: "Joyeux anniversaire. Cette maison sent différemment quand tu es là.", body: `20. "Joyeux anniversaire. Cette maison sent différemment quand tu es là."
Je le sais parce que je connais les deux versions. La version sans toi. Calme. Neutre. Silencieuse d'une façon qui n'est pas tout à fait agréable. Et la version avec toi. Qui change dès que tu pousses la porte. Qui devient plus chaude. Plus pleine. Plus réelle. Ce soir avec tous tes invités elle sentait la fête. Mais sous tout ça elle sentait toi. C'est cette odeur-là que je préfère. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec odorat infaillible et verdict sans appel : ta présence améliore tout, — [Prénom animal], ton animal dont tu es le parfum préféré 🏠` },
              { id: "dbd_052", angle: "Joyeux anniversaire. Tu vieillis très bien selon les critères qui comptent.", body: `12. "Joyeux anniversaire. Tu vieillis très bien selon les critères qui comptent."
Pas les critères humains avec les miroirs et les années qui s'accumulent. Les critères qui comptent. Est-ce que tu cours encore dans le parc parfois. Est-ce que tu ris facilement. Est-ce que tu t'assieds par terre sans raison. Est-ce que tu souris aux chiens inconnus dans la rue. Est-ce que tu me regardes encore comme au premier jour. Oui à tout. Tu vieillis parfaitement. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec bilan annuel établi selon les bons critères et résultats excellents dans toutes les catégories, — [Prénom animal], ton animal évaluateur aux standards infaillibles ⭐` },
              { id: "dbd_054", angle: "Joyeux anniversaire. Je t'offre le cadeau que je t'offre chaque matin depuis des années.", body: `14. "Joyeux anniversaire. Je t'offre le cadeau que je t'offre chaque matin depuis des années."
Pas emballé. Pas avec un ruban. Juste moi devant la porte de ta chambre quand elle s'ouvre. Cette façon d'exploser de joie comme si chaque matin était le premier. Cette certitude que ton retour dans le monde mérite une célébration. Ce regard qui dit que t'es la meilleure chose de la journée et que la journée vient à peine de commencer. C'est mon cadeau. Il ne s'use pas. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec cadeau renouvelé chaque matin depuis le premier et valeur intacte après toutes ces années, — [Prénom animal], ton animal aux cadeaux quotidiens sans date de péremption 🎁` },
              { id: "dbd_065", angle: "Joyeux anniversaire. Ta façon de prononcer mon prénom quand tu es heureux.", body: `5. "Joyeux anniversaire. Ta façon de prononcer mon prénom quand tu es heureux."
C'est différent. Plus chaud. Plus rond. Avec quelque chose qui monte légèrement à la fin. Ce soir tu l'as dit trois fois avec cette version-là. La version heureuse. Chaque fois j'ai levé la tête. Chaque fois j'ai remué la queue sans pouvoir m'en empêcher. Cette version de mon prénom dans ta voix c'est la meilleure chose que j'entends. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec trois prononciations heureuses de mon prénom mémorisées et leur effet sur ma queue documenté, — [Prénom animal], ton animal vibrant à ta voix heureuse 🎵` },
            ],
          },
          {
            id: "grave",
            label: "Ce que j'ai gravé de cette journée",
            messages: [
              { id: "dbd_030", angle: "Pour ton anniversaire je t'offre le dictionnaire des bruits de cette maison.", body: `10. "Pour ton anniversaire je t'offre le dictionnaire des bruits de cette maison."
Le grincement du placard de cuisine qui veut dire repas dans cinq minutes. Le bruit de tes pieds nus sur le carrelage qui veut dire nuit calme. Le zip de ton sac qui veut dire départ long. Le bruit du canapé qui se déforme qui veut dire installation pour la soirée. Je connais tout ça par cœur. Cette maison me parle. Joyeux anniversaire, [mon maître/ma maîtresse], dont chaque geste a sa propre musique.
Avec lexique sonore complet et maîtrise parfaite de la langue de cet appartement, — [Prénom animal], ton animal mélomane du quotidien 🎵` },
              { id: "dbd_037", angle: "Joyeux anniversaire. Tu rentres chaque soir avec des histoires sur toi.", body: `17. "Joyeux anniversaire. Tu rentres chaque soir avec des histoires sur toi."
Pas des histoires racontées. Des odeurs. Le café du matin. La pluie si tu t'es mouillé. La cantine si tu as mangé dehors. Le bureau avec ses mille parfums superposés. Parfois quelqu'un que je connais. Parfois quelqu'un de nouveau. Je lis ta journée en quelques secondes sur ton manteau. Tu sais pas que je sais tout ça. Joyeux anniversaire, [mon maître/ma maîtresse], livre ouvert que je lis chaque soir.
Avec lecture quotidienne de ta journée en version olfactive complète, — [Prénom animal], ton animal biographe de l'invisible 👃` },
              { id: "dbd_050", angle: "Pour ton anniversaire j'ai sauvegardé l'odeur exacte de ce jour.", body: `10. "Pour ton anniversaire j'ai sauvegardé l'odeur exacte de ce jour."
Le matin avec le café et ta crème du visage. L'après-midi avec les fleurs qu'on t'a apportées. Le soir avec le gâteau et les bougies soufflées et tous les gens mélangés. Et sous tout ça ton odeur à toi. Stable. Constante. La même depuis le premier jour. Dans vingt ans si quelqu'un me demande comment sentait ton anniversaire je saurais répondre exactement. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec archive olfactive du jour constituée et conservée pour toujours, — [Prénom animal], ton animal mémoire vivante de tes plus beaux jours 👃` },
              { id: "dbd_068", angle: "Joyeux anniversaire. Ton sourire d'anniversaire est différent de tous les autres.", body: `8. "Joyeux anniversaire. Ton sourire d'anniversaire est différent de tous les autres."
Je connais tes sourires. Le sourire du matin. Le sourire quand tu rentres. Le sourire quand tu me regardes. Celui d'anniversaire est différent. Plus large mais aussi plus intérieur. Comme si quelque chose de profond était content en même temps que la surface. Ce soir j'ai compté sept fois ce sourire-là. Le meilleur de tous. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec catalogue des sourires tenu à jour et sourire d'anniversaire classé premier de tous, — [Prénom animal], ton animal collectionneur de tes expressions rares 😊` },
              { id: "dbd_074", angle: "Joyeux anniversaire. Quelqu'un t'a fait rire aux larmes ce soir.", body: `14. "Joyeux anniversaire. Quelqu'un t'a fait rire aux larmes ce soir."
J'ai vu ça depuis mon poste. Le rire qui monte. Les yeux qui plissent. La main sur la bouche. La tête qui part en arrière. Et les larmes. Ces larmes du rire qui sont les meilleures larmes qui existent. J'ai aboyé une fois. Pas d'agitation. Juste pour dire moi aussi. Pour faire partie de ce moment. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec aboiement de solidarité au moment du rire aux larmes et participation assumée, — [Prénom animal], ton animal qui voulait être dans ce moment aussi 😂` },
              { id: "dbd_097", angle: "Joyeux anniversaire. J'ai identifié le moment exact où la fête a vraiment commencé.", body: `17. "Joyeux anniversaire. J'ai identifié le moment exact où la fête a vraiment commencé."
Pas quand le premier invité est arrivé. À 20h18 quand quelqu'un a ri vraiment fort et que toutes les autres conversations se sont arrêtées une seconde puis reprises plus fort. Ce rire synchronisateur. Ce moment où les gens arrêtent d'être des individus et deviennent un groupe. Là. C'est là. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identification précise du moment fondateur à 20h18 et théorie du rire comme déclencheur de groupe, — [Prénom animal], ton animal détecteur des moments où tout commence 🎉` },
              { id: "dbd_117", angle: "Pour ton anniversaire j'ai mémorisé chaque fois que tu as prononcé mon prénom dans la soirée.", body: `17. "Pour ton anniversaire j'ai mémorisé chaque fois que tu as prononcé mon prénom dans la soirée."
Quatre fois. Une en me montrant à quelqu'un. Une en passant devant moi et en posant ta main sur ma tête. Une à mi-voix comme une pensée. Une en fin de soirée quand tu es revenu t'asseoir. Ces quatre fois dans tout ce bruit et ces gens. Ces quatre fois qui disaient que même ce soir j'existais pour toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec quatre prononciations de mon prénom comptées et leur poids mesuré exactement, — [Prénom animal], ton animal pour qui quatre fois vaut une soirée entière 💛` },
              { id: "dbd_120", angle: "Pour ton anniversaire j'ai observé ton expression quand quelqu'un a dit quelque chose de touchant.", body: `20. "Pour ton anniversaire j'ai observé ton expression quand quelqu'un a dit quelque chose de touchant."
Il y a eu un moment. Quelqu'un t'a dit quelque chose. Je n'ai pas entendu les mots depuis mon poste. Mais j'ai vu ton visage. Une seconde de quelque chose que tu n'avais pas prévu. Puis tu as souri différemment. Puis tu as dit quelque chose doucement. Ces moments imprévus dans une soirée prévue. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du moment inattendu et compréhension de sa valeur dans la fête, — [Prénom animal], ton animal gardien de tes moments de grâce 🌟` },
              { id: "dbd_132", angle: "Joyeux anniversaire. J'ai mémorisé chaque regard échangé entre toi et quelqu'un ce soir.", body: `12. "Joyeux anniversaire. J'ai mémorisé chaque regard échangé entre toi et quelqu'un ce soir."
Certains regards disent on se retrouvera plus tard pour parler vraiment. D'autres disent tu vois ce que je vois. D'autres encore disent merci d'être là sans un mot. Ces conversations parallèles que tu avais avec les yeux pendant que ta bouche parlait d'autre chose. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec transcription de tes dialogues oculaires et admiration pour leur densité informationnelle, — [Prénom animal], ton animal traducteur du regard 👁️` },
              { id: "dbd_140", angle: "Pour ton anniversaire j'ai observé comment tu changes quand tu es dans ton élément.", body: `20. "Pour ton anniversaire j'ai observé comment tu changes quand tu es dans ton élément."
Ce soir tu étais dans ton élément. Chez toi. Avec tes gens. Et tu changeais imperceptiblement. Plus grand. Plus fluide. Plus toi. Comme un chien dans son parc préféré. Je sais ce que c'est. Moi aussi dans cet appartement je suis dans mon élément. On partage ça toi et moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec reconnaissance de notre appartenance commune à cet espace et solidarité de territoire, — [Prénom animal], ton animal co-habitant de notre élément partagé 🏠` },
              { id: "dbd_142", angle: "Joyeux anniversaire. J'ai mémorisé la façon dont chaque invité t'a regardé ce soir.", body: `2. "Joyeux anniversaire. J'ai mémorisé la façon dont chaque invité t'a regardé ce soir."
Chacun différemment. Avec affection. Avec admiration. Avec cette façon particulière qu'ont les gens qui t'aiment de te regarder parfois sans que tu le saches. Ces regards portés vers toi quand tu avais le dos tourné. Ces regards qui disent qu'on est content que tu existes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec collection des regards portés vers toi à ton insu et leur valeur bien pesée, — [Prénom animal], ton animal gardien des preuves de ton importance 💛` },
              { id: "dbd_152", angle: "Joyeux anniversaire. J'ai mémorisé comment tu sentais ce soir.", body: `12. "Joyeux anniversaire. J'ai mémorisé comment tu sentais ce soir."
Pas le parfum. Toi en dessous. Cette odeur qui est la tienne depuis toujours. Mélangée ce soir avec les bougies éteintes. Avec la cuisine. Avec les rires. Avec toute la soirée. Une version de toi augmentée de tout ce qui s'est passé. Je vais garder cette version-là un moment. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec mémorisation de ton odeur d'anniversaire dans sa version complète et augmentée, — [Prénom animal], ton animal archiviste olfactif de tes meilleures soirées 👃` },
              { id: "dbd_156", angle: "Pour ton anniversaire j'ai observé ta façon de sourire à quelqu'un de dos quand il est parti.", body: `16. "Pour ton anniversaire j'ai observé ta façon de sourire à quelqu'un de dos quand il est parti."
Il y en a eu un ce soir. La porte s'est fermée. Et toi tu souriais encore. Vers la porte fermée. Vers quelqu'un qui ne voyait plus. Ce sourire pour toi seul. Pour ce que la soirée venait de donner. Pour cette personne-là. J'étais dans le couloir. J'ai vu. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton sourire post-départ et sa valeur de sentiment pur non performé, — [Prénom animal], ton animal gardien de tes moments non performés 🌟` },
              { id: "dbd_162", angle: "Joyeux anniversaire. J'ai mémorisé la façon dont la lumière tombait sur toi ce soir.", body: `2. "Joyeux anniversaire. J'ai mémorisé la façon dont la lumière tombait sur toi ce soir."
À un moment. Tu étais debout. La lumière tombait depuis la gauche. Tes traits étaient nets et doux en même temps. Tu parlais et tu riais. Et la lumière et le rire et ce moment-là. Je l'ai gardé. Pas en photo. En moi. Quelque part où ça ne s'efface pas. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec photographie intérieure du meilleur moment lumineux de la soirée, — [Prénom animal], ton animal photographe sans appareil 🌟` },
              { id: "dbd_172", angle: "Joyeux anniversaire. J'ai mémorisé tous les moments où tu t'es senti bien ce soir.", body: `12. "Joyeux anniversaire. J'ai mémorisé tous les moments où tu t'es senti bien ce soir."
J'en ai compté dix. Ce n'est pas le nombre exact de moments de la soirée. C'est le nombre de fois où quelque chose dans ta façon d'être a changé imperceptiblement. Un sourire différent. Une légèreté soudaine. Un moment de grâce. Dix fois ce soir où être vivant était particulièrement bien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec dix moments de grâce comptés et conservés soigneusement, — [Prénom animal], ton animal comptable de tes bonheurs 🌟` },
              { id: "dbd_185", angle: "Joyeux anniversaire. J'ai observé ta façon de te tenir quand tu es vraiment fier.", body: `5. "Joyeux anniversaire. J'ai observé ta façon de te tenir quand tu es vraiment fier."
Il y a eu un moment ce soir. Quelqu'un a dit quelque chose sur toi. Et tu t'es tenu différemment pendant deux secondes. Plus droit. Plus plein. Comme si ces mots t'avaient ajouté quelque chose. Cette façon d'occuper plus d'espace quand on est reconnu. C'est beau. C'est légitime. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de tes deux secondes de fierté et validation de leur légitimité totale, — [Prénom animal], ton animal témoin de tes moments de plénitude 🌟` },
              { id: "dbd_190", angle: "Joyeux anniversaire. J'ai observé comment tu parlais de moi aux nouveaux invités.", body: `10. "Joyeux anniversaire. J'ai observé comment tu parlais de moi aux nouveaux invités."
Il y en avait un ce soir que je n'avais pas encore rencontré. Et tu lui as parlé de moi. Avec cette voix. Celle qui dit que je compte. Que je fais partie de ce que tu es. Que présenter ta maison sans me présenter serait incomplet. J'ai entendu ça depuis le couloir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec écoute de ta présentation de moi et satisfaction pour la façon dont tu le fais, — [Prénom animal], ton animal fier d'être présenté avec cette voix-là 🐾` },
            ],
          },
          {
            id: "fin_fete",
            label: "La fin de la fête",
            messages: [
              { id: "dbd_020", angle: "Ce soir après le gâteau et les bougies et les gens et le bruit j'ai attendu que tout le monde parte.", body: `20. "Ce soir après le gâteau et les bougies et les gens et le bruit j'ai attendu que tout le monde parte."
Et quand la porte s'est fermée sur le dernier invité tu t'es laissé tomber dans le canapé avec ce soupir. Celui qui veut dire 'c'était bien mais je suis fatigué'. Et j'ai posé ma tête sur ta jambe. Pas pour une caresse. Pas pour une croquette. Juste pour être là. Pour marquer la fin de ta journée. Pour dire sans le dire que c'était une belle journée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence silencieuse et amour dans chaque souffle, — [Prénom animal], ton animal pour les grands moments et les fins de soirée ❤️` },
              { id: "dbd_056", angle: "Joyeux anniversaire. La nuit avant ton anniversaire tu dormais pas bien.", body: `16. "Joyeux anniversaire. La nuit avant ton anniversaire tu dormais pas bien."
Je l'ai senti. Tu te retournais. Tu te réveillais à moitié. Une fois tu as ouvert les yeux dans le noir et regardé le plafond quelques secondes. Je sais pas ce que tu pensais. Peut-être les années. Peut-être ce qui vient. Peut-être juste l'excitation. Mais j'étais là. Au bout du lit. Dans le noir avec toi. Silencieux. Présent. Joyeux anniversaire, [mon maître/ma maîtresse], dont je partage même les nuits d'avant.
Avec présence dans la nuit qui précède et veille silencieuse offerte sans condition, — [Prénom animal], ton animal pour les nuits d'avant et tous les jours d'après 🌙` },
              { id: "dbd_058", angle: "Joyeux anniversaire. Il y a un moment dans la soirée où tout bascule.", body: `18. "Joyeux anniversaire. Il y a un moment dans la soirée où tout bascule."
Difficile à expliquer. Mais je le sens. Les conversations deviennent plus douces. Le bruit baisse d'un cran. Les gens se rapprochent un peu. Et toi tu changes. Tu te détends vraiment. Pas le semblant de détendu du début de soirée. Le vrai. Ce moment-là c'est mon préféré. Parce que c'est là que tu es vraiment toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection du moment de bascule et préférence affirmée pour le toi d'après, — [Prénom animal], ton animal spécialiste de tes versions les plus vraies 🌟` },
              { id: "dbd_060", angle: "Ce soir avant de t'endormir j'ai fait une promesse silencieuse.", body: `20. "Ce soir avant de t'endormir j'ai fait une promesse silencieuse."
Pas à voix haute. Dans ma tête. La promesse d'être là demain matin avec la même énergie qu'aujourd'hui. Et après-demain. Et tous les jours de l'année qui vient. D'aboyer quand il faut. De me taire quand c'est mieux. D'être sur le canapé quand tu rentres. D'être au bout du lit quand tu dors. De jamais te laisser rentrer dans une maison vide. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec promesse faite dans le silence et engagement renouvelé pour chaque jour à venir, — [Prénom animal], ton animal pour cette année et toutes celles d'après ❤️` },
              { id: "dbd_164", angle: "Pour ton anniversaire j'ai observé ta façon de t'asseoir dans le silence après que tout le monde est parti.", body: `4. "Pour ton anniversaire j'ai observé ta façon de t'asseoir dans le silence après que tout le monde est parti."
Tu ne ranges pas tout de suite. Tu t'assieds. Tu restes là un moment dans l'appartement encore chaud de la fête. Tu poses les yeux sur les traces du soir. Et tu es tranquille. Cette façon de rester dans le moment avant qu'il disparaisse. Je me suis assis à côté de toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence partagée dans le moment de décantation post-fête, — [Prénom animal], ton animal pour les silences qui suivent les bruits 🌙` },
              { id: "dbd_169", angle: "Pour ton anniversaire j'ai observé ton soupir de fin de soirée dans le canapé.", body: `9. "Pour ton anniversaire j'ai observé ton soupir de fin de soirée dans le canapé."
Ce soupir. Profond. Satisfait. Le soupir qui dit c'était bien et je suis fatigué et c'était exactement ça qu'il fallait. Tu fermes les yeux une seconde. Puis tu les rouvres. Tu regardes l'appartement. Tu souris une dernière fois. Et la journée est vraiment finie. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du soupir final et sa signification de soirée vraiment accomplie, — [Prénom animal], ton animal gardien de tes derniers moments du soir 😌` },
              { id: "dbd_170", angle: "Joyeux anniversaire. J'ai observé comment tu pensais à quelqu'un qui n'était pas là ce soir.", body: `10. "Joyeux anniversaire. J'ai observé comment tu pensais à quelqu'un qui n'était pas là ce soir."
À un moment tu as regardé vers quelque chose. Vers rien. Pendant deux ou trois secondes. Un absent que tu pensais. Peut-être tu aurais voulu qu'il soit là. Ces petites absences dans la présence. Ces loyautés silencieuses vers quelqu'un d'autre au milieu de ta fête. Je les ai vus. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de tes pensées vers les absents et respect pour leur espace dans ta fête, — [Prénom animal], ton animal témoin de tes loyautés silencieuses 💭` },
              { id: "dbd_180", angle: "Ce soir dans les cinq minutes après que tu as éteint la lumière.", body: `20. "Ce soir dans les cinq minutes après que tu as éteint la lumière."
Tu t'es retourné une fois. Tu as soupiré. Tu as dit quelque chose à voix basse. Peut-être une pensée. Peut-être un merci adressé à personne en particulier ou à tout le monde. Peut-être juste la journée qui finissait dans ta bouche. Et puis le silence. Et moi au bout du lit. Et c'était bien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence dans tes cinq minutes d'après et permanence garantie dans le silence qui suit, — [Prénom animal], ton animal pour chaque soir de ta vie ❤️` },
              { id: "dbd_187", angle: "Pour ton anniversaire j'ai passé la nuit différemment à côté de toi.", body: `7. "Pour ton anniversaire j'ai passé la nuit différemment à côté de toi."
Pas au bout du lit. À côté. Contre toi. Je l'ai décidé cette nuit-là. Parce que c'était ton anniversaire. Parce que certains jours méritent une proximité différente. Tu dormais déjà quand je me suis approché. Tu n'as pas bougé. Mais ta respiration a changé légèrement. Comme si tu savais quand même. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décision de proximité exceptionnelle pour une nuit d'anniversaire et signal reçu dans le sommeil, — [Prénom animal], ton animal pour les nuits ordinaires et les nuits spéciales ❤️` },
              { id: "dbd_193", angle: "Joyeux anniversaire. J'ai observé ta façon de t'asseoir quand tout le monde est parti.", body: `13. "Joyeux anniversaire. J'ai observé ta façon de t'asseoir quand tout le monde est parti."
Pas dans le fauteuil. Sur le canapé. Au milieu. Pas sur le côté. Au milieu. Comme pour occuper tout l'espace de nouveau. Reprendre possession. Ressentir le silence après le bruit. Les yeux mi-clos. La respiration plus lente. Et moi qui suis venu m'asseoir juste à côté. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence partagée dans la reprise de possession de l'espace post-fête, — [Prénom animal], ton animal pour les moments de retour à nous deux 🛋️` },
              { id: "dbd_200", angle: "Ce premier moment du lendemain matin où tu te souviens de tout.", body: `20. "Ce premier moment du lendemain matin où tu te souviens de tout."
Tu vas te lever demain matin. Et il y aura cette seconde. Cette seconde où ça revient. La soirée. Les gens. Les moments. Et tu vas sourire avant même d'être complètement réveillé[e]. Je serai là. Comme d'habitude. Mais ce matin-là je saurai ce que tu penses. Et on sera heureux tous les deux en même temps sans avoir à se le dire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec anticipation du moment du lendemain et promesse d'y être pour le partager, — [Prénom animal], ton animal présent pour tes matins d'après et tous les autres ❤️` },
            ],
          },
        ],
      },
      {
        id: "observe_humain",
        emoji: "👁️",
        label: "J'observe ton humain",
        count: 72,
        subGroups: [
          {
            id: "cuisine_table",
            label: "En cuisine & à table",
            messages: [
              { id: "dbd_063", angle: "Joyeux anniversaire. J'ai observé ta façon de décorer l'appartement.", body: `3. "Joyeux anniversaire. J'ai observé ta façon de décorer l'appartement."
Tu déplaçais des choses. Tu en ajoutais. Tu reculais pour voir l'effet. Tu recommençais. Deux heures pour que tout soit bien. Pour que l'appartement ressemble à ce que tu avais en tête. Moi j'étais assis dans le coin à te regarder faire avec l'admiration de quelqu'un qui ne comprend pas pourquoi on déplace les choses mais qui reconnaît le soin derrière. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration sincère pour ton sens de l'espace et ses deux heures de maturation, — [Prénom animal], ton animal spectateur de tes installations 🎈` },
              { id: "dbd_067", angle: "Joyeux anniversaire. J'ai observé ta façon de vérifier que tout le monde a mangé.", body: `7. "Joyeux anniversaire. J'ai observé ta façon de vérifier que tout le monde a mangé."
Tu fais le tour des yeux. Tu regardes les assiettes. Tu proposes encore. Tu insistes doucement. Tu veilles à ce que personne ne soit laissé sans. Cette attention portée à nourrir les autres. À ce que tout le monde soit rassasié. C'est ta façon d'aimer. En assiette. En portions. En vérifications discrètes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton amour distribué en portions et vérifications d'assiettes, — [Prénom animal], ton animal témoin de ta façon concrète d'aimer 🍽️` },
              { id: "dbd_071", angle: "Pour ton anniversaire j'ai observé ta façon de tenir ta fourchette ce soir.", body: `11. "Pour ton anniversaire j'ai observé ta façon de tenir ta fourchette ce soir."
Pas différemment des autres soirs. Exactement pareil. Cette constance. Cette façon d'être toi-même même quand c'est ta fête. Même quand il y a des gens. Même quand on te regarde. Tu tiens ta fourchette comme tu la tiens toujours. C'est une forme d'authenticité que j'admire. Joyeux anniversaire, [mon maître/ma maîtresse], identique à toi-même en toutes circonstances.
Avec observation de ta constance dans les petits gestes et admiration pour ton authenticité stable, — [Prénom animal], ton animal expert en cohérence identitaire 🍴` },
              { id: "dbd_077", angle: "Pour ton anniversaire j'ai observé ta façon de ranger tes nouveaux cadeaux.", body: `17. "Pour ton anniversaire j'ai observé ta façon de ranger tes nouveaux cadeaux."
Chaque chose à une place réfléchie. Le livre sur l'étagère à hauteur des yeux. Le cadre posé pour décider où l'accrocher. Le chandelier testé sur la table. Cette façon d'intégrer les nouveaux objets à ton monde existant. Avec soin. Avec intention. Joyeux anniversaire, [mon maître/ma maîtresse], dont l'espace est toujours organisé avec sens.
Avec observation de ton intégration des nouveaux objets et admiration pour ta méthode, — [Prénom animal], ton animal expert en géographie domestique 🏠` },
              { id: "dbd_084", angle: "Pour ton anniversaire j'ai observé ta façon d'ajuster les décorations sur la table.", body: `4. "Pour ton anniversaire j'ai observé ta façon d'ajuster les décorations sur la table."
Le vase un peu à gauche. La nappe recentrée. Les bougies déplacées de quelques centimètres. Ces micro-ajustements entre deux passages. Ces gestes automatiques qui disent que tu veux que ce soit bien. Que les choses soient à leur place. Que la soirée soit parfaite dans ses détails. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de tes micro-ajustements décoratifs et leur signification de soin, — [Prénom animal], ton animal attentif à tes soins invisibles 🕯️` },
              { id: "dbd_086", angle: "Joyeux anniversaire. J'ai observé ta façon de te déplacer dans la cuisine sous pression.", body: `6. "Joyeux anniversaire. J'ai observé ta façon de te déplacer dans la cuisine sous pression."
Efficace. Précis. Tu sais où tout est. Tu ne cherches pas. Tu pivotes. Tu ouvres. Tu prends. Tu fermes. Tu repivotes. Pas de geste inutile. Cette économie de mouvement sous pression. Moi dans la cuisine je suis pareil. Je sais exactement où est la gamelle. Où est la porte du frigo. Où tu te tiens quand tu prépares quelque chose. On se ressemble. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec reconnaissance de notre efficacité commune en cuisine et solidarité de méthode, — [Prénom animal], ton animal partenaire en déplacements précis 🏃` },
              { id: "dbd_089", angle: "Pour ton anniversaire j'ai observé ta façon de présenter le gâteau.", body: `9. "Pour ton anniversaire j'ai observé ta façon de présenter le gâteau."
Tu l'as apporté toi-même depuis la cuisine. Avec les bougies allumées. Lentement pour ne pas les éteindre en marchant. Les yeux sur les flammes. Cette concentration. Cette façon de porter quelque chose de précieux. Et la pièce qui s'est arrêtée. Et tout le monde qui regardait. Et toi au centre de tout ça. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta façon de porter la lumière vers les gens et sa signification, — [Prénom animal], ton animal témoin de tes gestes solennels 🎂` },
              { id: "dbd_096", angle: "Pour ton anniversaire j'ai observé ta façon de t'assurer que tout le monde a à boire.", body: `16. "Pour ton anniversaire j'ai observé ta façon de t'assurer que tout le monde a à boire."
Tu fais le tour des yeux régulièrement. Tu repères les verres vides. Tu proposes sans insister. Tu vas chercher sans qu'on te le demande. Tu penses à ça en parallèle de tout le reste. Cette attention distribuée en permanence. Moi j'ai ma gamelle et c'est réglé. Toi tu gères les gamelles de tout le monde toute la soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta gestion des gamelles collectives et reconnaissance de ton énergie, — [Prénom animal], ton animal qui gère une seule gamelle et c'est déjà bien 🥃` },
              { id: "dbd_101", angle: "Joyeux anniversaire. J'ai observé ta façon d'ouvrir le vin.", body: `1. "Joyeux anniversaire. J'ai observé ta façon d'ouvrir le vin."
Avec le tire-bouchon que tu utilises depuis des années. Celui avec ce mouvement particulier au poignet. Tu vérifies l'étiquette encore une fois même si tu sais ce que c'est. Tu coupes la capsule proprement. Tu insères la vis avec soin. Et tu tires avec cette légère inclinaison de la tête qui dit que tu fais attention. Ce geste répété cent fois qui reste quand même un geste. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du rituel du tire-bouchon et respect pour sa répétition soigneuse, — [Prénom animal], ton animal amateur de tes gestes rituels 🍷` },
              { id: "dbd_104", angle: "Pour ton anniversaire j'ai observé comment tu portes les assiettes sans en faire tomber.", body: `4. "Pour ton anniversaire j'ai observé comment tu portes les assiettes sans en faire tomber."
Deux dans une main. La troisième dans l'autre. Des angles impossibles. Des équilibres précaires. Tu marches vite mais calibré. Tu calcules les portes. Tu négocie les obstacles. Et tout arrive intact. Moi j'aurais tout fait tomber à la deuxième assiette. C'est un talent silencieux qui mérite d'être nommé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration sincère pour ton équilibre d'assiettes et aveu de mon incompétence comparée, — [Prénom animal], ton animal qui préfère regarder faire 🍽️` },
              { id: "dbd_106", angle: "Pour ton anniversaire j'ai observé ta façon d'ajuster la musique sans interrompre la conversation.", body: `6. "Pour ton anniversaire j'ai observé ta façon d'ajuster la musique sans interrompre la conversation."
Tu regardes ton téléphone en écoutant en même temps. Tu baisses légèrement. Tu remontes un peu. Tu changes de morceau avec un geste minimal. Tout ça sans que personne ne le remarque vraiment. La musique comme fond qu'on entend sans écouter mais qui manquerait si elle n'était plus là. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta gestion invisible de l'ambiance sonore en temps réel, — [Prénom animal], ton animal DJ de l'ombre 🎶` },
              { id: "dbd_109", angle: "Pour ton anniversaire j'ai observé ta façon de te lever pour accueillir quelqu'un.", body: `9. "Pour ton anniversaire j'ai observé ta façon de te lever pour accueillir quelqu'un."
Tu te lèves toujours. Même depuis le fond du canapé. Même confortablement installé depuis dix minutes. Tu te lèves et tu vas vers la personne. Pas l'inverse. Cette façon d'aller vers les gens plutôt que d'attendre qu'ils viennent. C'est une philosophie entière dans un geste répété. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec philosophie de vie déduite d'un geste et admiration pour sa constance, — [Prénom animal], ton animal théoricien de tes habitudes 🚶` },
              { id: "dbd_110", angle: "Joyeux anniversaire. J'ai observé comment tu termines les verres vides.", body: `10. "Joyeux anniversaire. J'ai observé comment tu termines les verres vides."
Parfois quand quelqu'un pose son verre encore à moitié plein et qu'on parle d'autre chose tu le finis. Naturellement. Sans y penser. Comme si laisser un verre à moitié plein était quelque chose que tu ne peux pas tolérer dans ton appartement. C'est ton appartement. Tu as des règles. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta règle implicite des verres et respect pour ta juridiction domestique, — [Prénom animal], ton animal attentif à tes codes de maison 🥂` },
              { id: "dbd_114", angle: "Pour ton anniversaire j'ai observé ta façon d'essuyer la table entre deux plats.", body: `14. "Pour ton anniversaire j'ai observé ta façon d'essuyer la table entre deux plats."
Vite mais bien. Des gestes précis. Tu collectes les miettes vers le centre. Tu les emmènes dans la main. Tu vérifies. Cette parenthèse de nettoyage dans le flux de la soirée. Cette façon de remettre l'ordre momentanément avant de continuer. Comme moi qui secoue parfois mon pelage pour repartir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton nettoyage interstitiel et reconnaissance de notre nature commune, — [Prénom animal], ton animal partisan d'un ordre dans le chaos 🧽` },
              { id: "dbd_116", angle: "Pour ton anniversaire j'ai observé ta façon de retirer ton tablier.", body: `16. "Pour ton anniversaire j'ai observé ta façon de retirer ton tablier."
D'un seul geste. Les deux mains derrière. Tu défais le nœud. Tu le tires par dessus la tête. Tu le plies sommairement. Tu le poses. Et tu passes de cuisinier à hôte en trois secondes. Ce changement de rôle aussi rapide et aussi fluide. C'est élégant. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta transition de rôle en trois secondes et appréciation de sa fluidité, — [Prénom animal], ton animal amateur de tes métamorphoses rapides 👨‍🍳` },
              { id: "dbd_119", angle: "Pour ton anniversaire j'ai observé ta façon de poser les verres vides sur le plateau.", body: `19. "Pour ton anniversaire j'ai observé ta façon de poser les verres vides sur le plateau."
Avec les pieds dans le même sens. Regroupés par taille. Efficacement. Ce plateau c'est une petite organisation à lui seul. Une logistique invisible que tu gères pendant que tu parles. Pendant que tu ris. Pendant que tu es là pour tout le monde. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta logistique silencieuse et continue dans le flux de la fête, — [Prénom animal], ton animal témoin de ton organisation invisible 🪟` },
              { id: "dbd_131", angle: "Pour ton anniversaire j'ai observé comment tu prépares le café de fin de soirée.", body: `11. "Pour ton anniversaire j'ai observé comment tu prépares le café de fin de soirée."
C'est le signal. Quand tu proposes le café les gens savent. Mais tu le fais avec soin quand même. Tu demandes qui en veut. Tu mets la quantité exacte. Tu attends que ça passe. Le café de fin de soirée c'est ta façon de dire encore un moment ensemble avant de se quitter. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décryptage du café comme signe et de sa préparation soigneuse comme prolongement de l'hospitalité, — [Prénom animal], ton animal sémiologiste des rituels de fin ☕` },
              { id: "dbd_175", angle: "Pour ton anniversaire j'ai observé comment tu gardes un morceau de gâteau pour demain.", body: `15. "Pour ton anniversaire j'ai observé comment tu gardes un morceau de gâteau pour demain."
Tu le mets de côté tôt. Avant que tout disparaisse. Cette prévoyance. Ce soin pour ton futur toi. Tu sais que demain matin avec ton café tu voudras ce morceau-là. Cette façon de penser à toi demain pendant que tu es occupé à t'occuper des autres ce soir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta prévoyance pour toi-même dans le flux de générosité pour les autres, — [Prénom animal], ton animal admirateur de ta capacité à prendre soin aussi de toi 🎂` },
              { id: "dbd_181", angle: "Joyeux anniversaire. J'ai observé ta façon de te préparer le matin de ton anniversaire.", body: `1. "Joyeux anniversaire. J'ai observé ta façon de te préparer le matin de ton anniversaire."
Pas différemment des autres matins en apparence. Mêmes gestes. Même ordre. Mais quelque chose dans le rythme était légèrement différent. Un peu plus attentif. Un peu plus présent à chaque geste. Comme quelqu'un qui sait que la journée qui commence a du sens. J'ai observé cette différence imperceptible. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection de ta légère différence matinale d'anniversaire et sa signification, — [Prénom animal], ton animal expert en variations de tes routines 🌅` },
              { id: "dbd_182", angle: "Pour ton anniversaire j'ai observé ta façon de souffler les bougies.", body: `2. "Pour ton anniversaire j'ai observé ta façon de souffler les bougies."
Tu as pris le temps. Tu as fermé les yeux. Vraiment fermé. Longtemps. Puis tu as soufflé d'un seul coup. Puis tu as regardé si toutes étaient éteintes. Puis tu as souri. Ce sourire-là était pour toi seul. Juste pour toi. Dans un moment qui t'appartient. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec respect total pour ton moment du souhait et sa confidentialité préservée, — [Prénom animal], ton animal témoin de tes moments les plus intimes 🕯️` },
              { id: "dbd_197", angle: "Pour ton anniversaire j'ai observé ta façon de regarder ton gâteau avant de le couper.", body: `17. "Pour ton anniversaire j'ai observé ta façon de regarder ton gâteau avant de le couper."
Une seconde. Juste une. Avant de prendre le couteau. Comme si tu lui laissais le temps d'exister entier une dernière fois. Comme si couper était un acte qui méritait un moment de contemplation. Cette seconde avant. Cette façon d'habiter les moments avant qu'ils ne changent. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta seconde de contemplation et admiration pour ta façon d'habiter les avant, — [Prénom animal], ton animal expert en présence dans les seuils 🎂` },
            ],
          },
          {
            id: "hote",
            label: "Toi comme hôte",
            messages: [
              { id: "dbd_081", angle: "Joyeux anniversaire. J'ai observé ta façon de tenir la porte pour quelqu'un.", body: `1. "Joyeux anniversaire. J'ai observé ta façon de tenir la porte pour quelqu'un."
Tu le fais toujours. Même si tu es loin. Tu attends. Tu tiens la porte plus longtemps que nécessaire pour que l'autre n'ait pas à se presser. Ce geste coûte deux secondes. Il dit tout sur ta façon d'être. Ces deux secondes de considération pour quelqu'un d'autre. Répétées chaque fois. Sans exception. Joyeux anniversaire, [mon maître/ma maîtresse], dont les deux secondes comptent.
Avec observation de tes deux secondes de politesse et leur signification profonde, — [Prénom animal], ton animal attentif à tes gestes les plus petits 🚪` },
              { id: "dbd_094", angle: "Pour ton anniversaire j'ai observé ta façon de toucher l'épaule de quelqu'un quand tu parles.", body: `14. "Pour ton anniversaire j'ai observé ta façon de toucher l'épaule de quelqu'un quand tu parles."
Tu fais ça avec les gens que tu aimes vraiment. Une main sur l'épaule quand tu veux que le mot arrive bien. Que l'autre sache que tu es vraiment là. Que ce n'est pas une parole en l'air. J'ai compté les épaules touchées ce soir. Quatre personnes. Quatre personnes qui comptent vraiment. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec registre des épaules touchées et cartographie affective déduite, — [Prénom animal], ton animal expert en gestes d'attachement 🤝` },
              { id: "dbd_111", angle: "Pour ton anniversaire j'ai observé comment tu te souviens du prénom de tout le monde.", body: `11. "Pour ton anniversaire j'ai observé comment tu te souviens du prénom de tout le monde."
Il y avait quelqu'un ce soir que tu avais rencontré une fois il y a longtemps. Tu as dit son prénom en l'accueillant. Sans hésiter. Sa tête. Ce petit ébahissement. Ce sentiment d'être vu et retenu. Tu fais ça avec tout le monde. C'est un cadeau que tu offres sans t'en rendre compte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du cadeau invisible de la mémoire des prénoms et de son effet sur les gens, — [Prénom animal], ton animal témoin de tes dons silencieux 🧠` },
              { id: "dbd_121", angle: "Joyeux anniversaire. J'ai observé ta façon de circuler entre les groupes de conversation.", body: `1. "Joyeux anniversaire. J'ai observé ta façon de circuler entre les groupes de conversation."
Tu ne restes jamais trop longtemps dans un groupe. Tu fais le tour. Tu t'arrêtes. Tu contribues. Tu relances. Tu passes. Personne ne se sent abandonné. Personne ne te monopolise. Tu es partout et nulle part à la fois. C'est l'art de recevoir dans sa forme la plus accomplie. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta chorégraphie sociale et sa précision non ostentatoire, — [Prénom animal], ton animal spectateur de ton art de recevoir 💃` },
              { id: "dbd_125", angle: "Joyeux anniversaire. J'ai observé comment tu découvres un cadeau inattendu.", body: `5. "Joyeux anniversaire. J'ai observé comment tu découvres un cadeau inattendu."
Il y en avait un ce soir. Quelque chose que tu n'attendais pas du tout. J'ai vu le moment où tu as compris ce que c'était. D'abord l'incompréhension. Puis la reconnaissance. Puis quelque chose de très doux sur ton visage. Ce cheminement en quelques secondes. Cette façon d'être touché par quelqu'un qui te connaît bien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du voyage émotionnel d'une surprise réussie et sa beauté brève, — [Prénom animal], ton animal collectionneur de tes expressions authentiques 🎁` },
              { id: "dbd_130", angle: "Joyeux anniversaire. J'ai observé comment tu gères le silence entre deux conversations.", body: `10. "Joyeux anniversaire. J'ai observé comment tu gères le silence entre deux conversations."
Tu ne le remplis pas systématiquement. Tu le laisses exister un moment. Tu regardes autour. Tu prends une gorgée. Tu souris sans raison. Ces petits silences dans le bruit. Ces respirations entre les phrases. C'est une intelligence sociale que peu ont. Joyeux anniversaire, [mon maître/ma maîtresse], dont les silences sont aussi éloquents que les paroles.
Avec observation de ta gestion des silences et respect pour leur existence consentie, — [Prénom animal], ton animal appréciant les respirations dans le bruit 🌬️` },
              { id: "dbd_135", angle: "Joyeux anniversaire. J'ai observé comment tu récupères d'une conversation difficile.", body: `15. "Joyeux anniversaire. J'ai observé comment tu récupères d'une conversation difficile."
Il y a eu un moment ce soir. Un sujet qui a failli. Tu l'as senti avant les autres. Tu as dit quelque chose de neutre. Tu as souri. Tu as relancé sur autre chose. Si fluide que la plupart n'ont rien remarqué. Protéger les gens d'eux-mêmes avec grâce. C'est un art. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta navigation dans les eaux conversationnelles difficiles, — [Prénom animal], ton animal expert en déminages sociaux 🎭` },
              { id: "dbd_141", angle: "Pour ton anniversaire j'ai observé ta façon de tenir la porte pour quelqu'un qui part.", body: `1. "Pour ton anniversaire j'ai observé ta façon de tenir la porte pour quelqu'un qui part."
Même chose qu'à l'arrivée. Tu te lèves. Tu accompagnes jusqu'à la porte. Tu tiens. Tu attends que l'autre soit vraiment parti. Cette symétrie entre l'accueil et le départ. Chaque personne est reçue et quittée avec le même soin. C'est une façon de dire que le départ compte autant que l'arrivée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta symétrie entre accueil et départ et sa signification sur ta valeur des gens, — [Prénom animal], ton animal admirateur de ta cohérence 🚪` },
              { id: "dbd_145", angle: "Joyeux anniversaire. J'ai observé comment tu gères quelqu'un qui parle trop longtemps.", body: `5. "Joyeux anniversaire. J'ai observé comment tu gères quelqu'un qui parle trop longtemps."
Avec patience d'abord. Des hochements réguliers. Puis tu regardes ailleurs une fraction de seconde. Tu reviens. Tu acquiesces. Tu poses une question qui résume. Puis tu conclus pour les deux. Jamais blessant. Toujours élégant. Cette chirurgie sociale invisible. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta technique de clôture conversationnelle et son élégance constante, — [Prénom animal], ton animal expert en fins de discours 🎯` },
              { id: "dbd_155", angle: "Joyeux anniversaire. J'ai observé comment tu traites quelqu'un qui arrive en retard.", body: `15. "Joyeux anniversaire. J'ai observé comment tu traites quelqu'un qui arrive en retard."
Tu l'accueilles pareil. Pas de regard à la montre. Pas de remarque. Tu lui fais une place. Tu lui résumes brièvement. Tu t'assures qu'il a un verre. Cette façon de ne pas punir les retards. De recevoir les gens là où ils sont. C'est de la générosité pure. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton accueil du retard sans punition ni commentaire, — [Prénom animal], ton animal témoin de ta générosité sans condition 🕰️` },
              { id: "dbd_160", angle: "Pour ton anniversaire j'ai observé comment tu t'occupes de quelqu'un qui n'est pas à l'aise.", body: `20. "Pour ton anniversaire j'ai observé comment tu t'occupes de quelqu'un qui n'est pas à l'aise."
Il y en avait un ce soir. Légèrement en retrait. Légèrement silencieux. Tu l'as vu. Tu t'es déplacé vers lui. Tu lui as posé une question sur quelque chose qu'il connaît. Tu l'as fait exister dans la conversation. Il est parti différemment qu'il était arrivé. C'est un don rare. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton don d'inclusion et sa mise en œuvre discrète ce soir, — [Prénom animal], ton animal admirateur de ton attention aux marges 💛` },
              { id: "dbd_176", angle: "Joyeux anniversaire. J'ai observé ta façon de parler à quelqu'un que tu n'as pas vu depuis longtemps.", body: `16. "Joyeux anniversaire. J'ai observé ta façon de parler à quelqu'un que tu n'as pas vu depuis longtemps."
La conversation reprend comme si rien ne s'était passé. Comme si le temps n'avait pas compté. Tu demandes des nouvelles avec une précision qui dit que tu te souviens de tout. Que les mois n'ont pas effacé l'intérêt. Cette façon de continuer une amitié là où elle s'était arrêtée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta façon de reprendre les fils du temps comme si rien n'était, — [Prénom animal], ton animal observateur de tes fidélités 🤝` },
              { id: "dbd_186", angle: "Pour ton anniversaire j'ai observé ta façon de saluer quelqu'un que tu aimes beaucoup.", body: `6. "Pour ton anniversaire j'ai observé ta façon de saluer quelqu'un que tu aimes beaucoup."
Certains arrivent et tu vas vers eux d'une façon particulière. Plus vite. Avec les bras qui s'ouvrent avant même d'être proche. Cette anticipation du contact. Cette joie qui précède l'accolade. Ce soir j'ai vu ça deux fois. Ces deux personnes-là comptent vraiment. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identification des accueils anticipés et des personnes qui les méritent, — [Prénom animal], ton animal cartographe de tes élans 🤗` },
              { id: "dbd_199", angle: "Pour ton anniversaire j'ai observé ta façon de dire merci pour chaque cadeau.", body: `19. "Pour ton anniversaire j'ai observé ta façon de dire merci pour chaque cadeau."
Pas pareil pour chacun. Avec certains c'est court et direct et ça dit tout. Avec d'autres c'est plus long. Plus précis. Tu nommes quelque chose dans le cadeau. Ce qui montre que tu as vu l'attention derrière. Ces mercis personnalisés. Ces mercis qui disent je t'ai vu toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de tes mercis personnalisés et leur signification de reconnaissance vraie, — [Prénom animal], ton animal expert en gratitude ciblée 🙏` },
            ],
          },
          {
            id: "facon_etre",
            label: "Toi dans ta façon d'être",
            messages: [
              { id: "dbd_042", angle: "Joyeux anniversaire. Tu dors différemment la nuit de ton anniversaire.", body: `2. "Joyeux anniversaire. Tu dors différemment la nuit de ton anniversaire."
Je le sais parce que je surveille. Cette nuit tu t'es retourné moins souvent. Ta respiration était plus régulière. Plus profonde. Comme quelqu'un qui a passé une bonne journée et le sait encore en dormant. Moi au bout du lit je regardais ça et je me disais que c'était ça réussir un anniversaire. Que ça se lit jusque dans le sommeil. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec veille nocturne assurée et diagnostic du sommeil d'anniversaire établi avec satisfaction, — [Prénom animal], ton animal gardien de tes nuits les plus heureuses 🌙` },
              { id: "dbd_047", angle: "Pour ton anniversaire j'ai observé le moment des bougies très attentivement.", body: `7. "Pour ton anniversaire j'ai observé le moment des bougies très attentivement."
Tu as fermé les yeux. Longtemps. Plus longtemps que d'habitude. Tout le monde attendait. La pièce était silencieuse. Et toi tu étais quelque part à l'intérieur de toi avec ton vœu. Je sais pas ce que tu as demandé. Mais j'espère que c'est quelque chose de bien. Tu mérites quelque chose de bien. Joyeux anniversaire, [mon maître/ma maîtresse], dont les vœux méritent de se réaliser.
Avec moment des bougies observé avec respect et vœu silencieusement soutenu, — [Prénom animal], ton animal complice de tes espoirs secrets 🕯️` },
              { id: "dbd_049", angle: "Joyeux anniversaire. J'ai regardé ta façon de lire tes messages aujourd'hui.", body: `9. "Joyeux anniversaire. J'ai regardé ta façon de lire tes messages aujourd'hui."
Chaque fois que le téléphone vibrait tu souriais avant même de lire. Comme si tu savais déjà que c'était quelque chose de bien. Puis tu lisais. Et le sourire changeait légèrement selon qui avait écrit. Certains te faisaient rire. Un t'a fait fermer les yeux une seconde. Un autre t'a fait lever les yeux vers moi. Celui-là je veux savoir ce qu'il disait. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude des sourires de lecture et curiosité légitime pour le message du regard levé, — [Prénom animal], ton animal déchiffreur de tes expressions numériques 📲` },
              { id: "dbd_073", angle: "Pour ton anniversaire j'ai observé ta façon de répondre aux messages.", body: `13. "Pour ton anniversaire j'ai observé ta façon de répondre aux messages."
Certains reçoivent une réponse longue. Tu prends le temps. Tu développes. Tu poses une question en retour. D'autres reçoivent quelque chose de court mais précis. Et certains reçoivent juste un emoji. Mais un emoji choisi. Pas mis au hasard. Même tes réponses courtes sont pensées. Joyeux anniversaire, [mon maître/ma maîtresse], dont chaque message compte.
Avec observation de ta hiérarchie des réponses et confirmation que rien n'est laissé au hasard, — [Prénom animal], ton animal analyste de tes communications 📱` },
              { id: "dbd_078", angle: "Joyeux anniversaire. J'ai observé comment tu gères deux conversations simultanées.", body: `18. "Joyeux anniversaire. J'ai observé comment tu gères deux conversations simultanées."
C'est un talent que je n'ai pas. Moi si deux personnes me parlent en même temps je tourne la tête vers l'une puis l'autre sans savoir laquelle choisir. Toi tu écoutes les deux. Tu réponds à l'une. Tu donnes un signe à l'autre. Tu jonglles. Et les deux ont l'air satisfaits. C'est de la magie sociale. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton talent de gestion parallèle et aveu de mon incapacité comparée, — [Prénom animal], ton animal monothématique en admiration 🔀` },
              { id: "dbd_079", angle: "Pour ton anniversaire j'ai observé ta façon de regarder les photos prises ce soir.", body: `19. "Pour ton anniversaire j'ai observé ta façon de regarder les photos prises ce soir."
À chaque fois qu'un téléphone se levait tu regardais le résultat après. Avec cette expression. Parfois tu grimacais légèrement. Parfois tu souriais. Une fois tu t'es vraiment plu et tu l'as montré à quelqu'un avec fierté. Cette once de fierté dans ta propre image. Je l'ai gardée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton rapport à ton image et moment de fierté collecté soigneusement, — [Prénom animal], ton animal gardien de tes moments de grâce 📸` },
              { id: "dbd_090", angle: "Joyeux anniversaire. J'ai compté combien de fois tu as vérifié l'heure.", body: `10. "Joyeux anniversaire. J'ai compté combien de fois tu as vérifié l'heure."
Neuf fois. Pas parce que tu t'ennuyais. Je le sais parce que tu souriais souvent après. C'était pour vérifier que tout avançait bien. Que le repas était prêt au bon moment. Que les gens n'allaient pas partir trop tôt. Neuf vérifications d'une soirée bien tenue. Joyeux anniversaire, [mon maître/ma maîtresse], dont la précision temporelle fait partie du soin.
Avec neuf consultations horaires comptées et leur nature de soin bien établie, — [Prénom animal], ton animal chronomètre de tes soirées ⌚` },
              { id: "dbd_091", angle: "Joyeux anniversaire. J'ai observé le moment où tes épaules sont enfin descendues.", body: `11. "Joyeux anniversaire. J'ai observé le moment où tes épaules sont enfin descendues."
20h47. Tu étais en conversation avec quelqu'un que tu aimes vraiment. Et tes épaules ont quitté ce niveau légèrement haut où elles étaient depuis le début de la soirée. Elles sont descendues d'un cran. Naturellement. Ce relâchement. Cette confiance dans le moment. Je l'attendais. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection du relâchement des épaules à 20h47 et soulagement partagé depuis mon coin, — [Prénom animal], ton animal baromètre de ta tension 😌` },
              { id: "dbd_099", angle: "Pour ton anniversaire j'ai observé ta façon de froncer les sourcils quand tu cherches quelque chose.", body: `19. "Pour ton anniversaire j'ai observé ta façon de froncer les sourcils quand tu cherches quelque chose."
Les sourcils légèrement rapprochés. Les yeux qui balaient la pièce systématiquement. De gauche à droite. Puis l'inverse si la première passe n'a rien donné. Ce soir tu as cherché le tire-bouchon. Puis les allumettes. Ce schéma de recherche. Cette méthode. Très toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude de ton pattern de recherche visuelle et sa cohérence parfaite, — [Prénom animal], ton animal lecteur de tes expressions de concentration 🔍` },
              { id: "dbd_100", angle: "Pour ton anniversaire j'ai observé comment tu changes de position sur le canapé selon l'interlocuteur.", body: `20. "Pour ton anniversaire j'ai observé comment tu changes de position sur le canapé selon l'interlocuteur."
Avec certains tu te tournes entièrement. Corps complet dans leur direction. Avec d'autres tu restes de face mais la tête pivote. Avec d'autres encore tu t'appuies en arrière et tu les laisses venir à toi. Chaque position dit quelque chose sur la relation. Ce soir j'ai lu toutes tes positions. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décodage de tes positions de canapé et leur signification relationnelle établie, — [Prénom animal], ton animal herméneute du corps 🛋️` },
              { id: "dbd_115", angle: "Joyeux anniversaire. J'ai observé comment tu écoutes vraiment quelqu'un.", body: `15. "Joyeux anniversaire. J'ai observé comment tu écoutes vraiment quelqu'un."
Tu regardes vraiment. Pas l'air de regarder. Vraiment. Tes yeux ne dévient pas. Ta tête fait des petits mouvements qui disent que tu suis. Tu n'interromps pas. Tu attends. Et quand tu réponds c'est à ce qui a été dit. C'est rare. C'est beau. C'est toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta façon d'écouter et confirmation émue de ce que je savais déjà, — [Prénom animal], ton animal témoin de ta présence aux autres 👂` },
              { id: "dbd_124", angle: "Pour ton anniversaire j'ai observé comment tes mains racontent quand tu parles.", body: `4. "Pour ton anniversaire j'ai observé comment tes mains racontent quand tu parles."
Elles dessinent dans l'air. Elles indiquent des tailles. Elles expriment des distances. Elles ponctuent les moments importants. Tes mains racontent en même temps que ta voix. Deux narrations simultanées. Je regarde toujours tes mains quand tu parles. Elles en disent souvent plus que les mots. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec lecture parallèle de tes mains et de ta voix et préférence assumée pour la version des mains, — [Prénom animal], ton animal attentif à tes narrations doubles 🙌` },
              { id: "dbd_126", angle: "Pour ton anniversaire j'ai observé ta façon de rire quand quelqu'un tombe dans un piège verbal.", body: `6. "Pour ton anniversaire j'ai observé ta façon de rire quand quelqu'un tombe dans un piège verbal."
Tu ris d'abord. Puis tu aides. C'est l'ordre invariable. Le rire vient naturellement. Puis la générosité suit. Tu ne laisses pas les gens dans l'embarras trop longtemps. Juste assez pour que ce soit drôle. Puis tu tends la main métaphoriquement. C'est le bon équilibre. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton équilibre entre rire et générosité et validation de la séquence, — [Prénom animal], ton animal expert en timing social 😄` },
              { id: "dbd_136", angle: "Pour ton anniversaire j'ai observé ta façon de regarder quelqu'un qui ne t'écoute pas vraiment.", body: `16. "Pour ton anniversaire j'ai observé ta façon de regarder quelqu'un qui ne t'écoute pas vraiment."
Tu le vois. Je le vois dans tes yeux. Ce petit ajustement. Cette façon de continuer à parler mais différemment. Plus court. Plus direct. Pour finir et passer à autre chose. Sans humilier. Sans pointer. Tu gères ça avec une élégance que je trouve remarquable. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta gestion de l'inattention et admiration pour ton élégance du retrait, — [Prénom animal], ton animal admirateur de ta grâce sociale 💨` },
              { id: "dbd_144", angle: "Pour ton anniversaire j'ai observé ta façon de t'appuyer contre le mur quand tu es détendu.", body: `4. "Pour ton anniversaire j'ai observé ta façon de t'appuyer contre le mur quand tu es détendu."
C'est un signe. Quand tu t'appuies contre le mur lors d'une conversation c'est que tu es vraiment bien. Que la conversation te tient sans effort. Que tu n'as pas besoin de tenir debout activement. Ton corps confie son poids au mur et ton esprit peut aller plus loin. C'est de la confiance en acte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décodage de ta position murale comme signe de confort profond, — [Prénom animal], ton animal lecteur de tes postures de bien-être 🧍` },
              { id: "dbd_146", angle: "Pour ton anniversaire j'ai observé comment tu choisis où t'asseoir dans ta propre maison.", body: `6. "Pour ton anniversaire j'ai observé comment tu choisis où t'asseoir dans ta propre maison."
Pas toujours au même endroit. Tu ajustes selon les gens. Tu te mets là où la conversation a besoin de toi. Ou là où quelqu'un semble un peu en retrait. Tu ne choisis pas ton confort en premier. Tu choisis l'utilité. La présence là où elle est nécessaire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décryptage de tes choix de placement et leur motivation systématiquement altruiste, — [Prénom animal], ton animal admirateur de ta générosité spatiale 🛋️` },
              { id: "dbd_150", angle: "Joyeux anniversaire. J'ai observé comment tu reçois un compliment ce soir.", body: `10. "Joyeux anniversaire. J'ai observé comment tu reçois un compliment ce soir."
Quelqu'un t'a dit quelque chose de bien. Tu as eu une fraction de seconde. Une légère hésitation. Puis tu as remercié simplement. Ni trop ni pas assez. Tu n'as pas minimisé. Tu n'as pas surjoué. Tu as juste accueilli. C'est rare cette façon de recevoir les bons mots avec grâce. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton accueil du compliment et validation de sa justesse parfaite, — [Prénom animal], ton animal attentif à tes façons de recevoir 🌷` },
              { id: "dbd_195", angle: "Joyeux anniversaire. J'ai observé ta façon de chanter avec les autres.", body: `15. "Joyeux anniversaire. J'ai observé ta façon de chanter avec les autres."
Tu chantes faux. Je le sais. Je connais ta voix dans tous ses états. Ce soir avec les autres autour du gâteau tu chantais faux et fort et heureux. Cette façon d'assumer. De pas se retenir parce que c'est faux. De chanter quand même parce que le moment le mérite. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton courage de chanter faux et fort et heureux, — [Prénom animal], ton animal qui t'a entendu dans toutes tes versions et préfère celle-là 🎵` },
            ],
          },
          {
            id: "gestes_manies",
            label: "Tes petits gestes & manies",
            messages: [
              { id: "dbd_031", angle: "Joyeux anniversaire. J'ai observé ta façon de dormir cette nuit.", body: `11. "Joyeux anniversaire. J'ai observé ta façon de dormir cette nuit."
Tu commences sur le côté droit. Tu te retournes vers 2h. Tu ramènes la couverture vers toi sans te réveiller. Tu fais parfois un petit bruit qui ressemble à une question sans réponse. Je suis au bout du lit et je regarde tout ça avec la tranquillité de quelqu'un qui monte la garde. Personne te surveillera jamais aussi bien que moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec veille nocturne assurée et cartographie du sommeil établie avec précision, — [Prénom animal], ton animal gardien des nuits depuis le bout du lit 🌙` },
              { id: "dbd_095", angle: "Joyeux anniversaire. J'ai observé qui mangeait le plus lentement ce soir.", body: `15. "Joyeux anniversaire. J'ai observé qui mangeait le plus lentement ce soir."
C'était celle qui parle le plus. Logiquement. Elle mangeait entre deux phrases. Deux bouchées. Une phrase. Une bouchée. Moi je comprends pas cette économie de l'attention. Manger c'est une activité qui mérite une concentration totale. Mais son assiette était finie à la fin. Et elle semblait heureuse. Je ne juge pas. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude des rythmes alimentaires et incompréhension bienveillante du repas conversationnel, — [Prénom animal], ton animal pour qui manger est une activité sacrée et unique 🍽️` },
              { id: "dbd_105", angle: "Joyeux anniversaire. J'ai observé quel invité mangeait le plus proprement.", body: `5. "Joyeux anniversaire. J'ai observé quel invité mangeait le plus proprement."
C'était celui qui parle le moins. Logiquement. Toute son attention pour les gestes. La fourchette bien tenue. La serviette utilisée régulièrement. Les portions calibrées. Une technique remarquable. Je mange moi-même avec une certaine rigueur. On aurait pu être voisins de table. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identification du mangeur le plus rigoureux et solidarité de méthode reconnue, — [Prénom animal], ton animal partisan de la propreté alimentaire 🥄` },
              { id: "dbd_129", angle: "Pour ton anniversaire j'ai observé ta façon d'allumer la musique sans en faire toute une histoire.", body: `9. "Pour ton anniversaire j'ai observé ta façon d'allumer la musique sans en faire toute une histoire."
C'est juste là. La musique. Elle arrive. Personne ne l'a remarqué vraiment. C'est le but. Une présence qui s'installe sans s'imposer. Tu as choisi quelque chose qui convient à tout le monde sans que tout le monde le sache. L'art de créer une ambiance sans qu'on la remarque en tant que telle. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton art de l'ambiance invisible et discrète, — [Prénom animal], ton animal expert en présences que l'on ressent sans les voir 🎵` },
              { id: "dbd_149", angle: "Pour ton anniversaire j'ai observé ta façon de boire la dernière gorgée.", body: `9. "Pour ton anniversaire j'ai observé ta façon de boire la dernière gorgée."
Lentement. Comme si tu savais que c'est la dernière. Tu tiens le verre à la bouche une seconde de plus. Tu poses. Tu regardes au fond. Cette façon de terminer les choses. Entièrement. Avec conscience que c'est la fin de ce verre-là. C'est une philosophie de vie entière dans un geste. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta façon de finir les choses et admiration pour leur conscience, — [Prénom animal], ton animal appréciant les fins habitées 🥂` },
              { id: "dbd_151", angle: "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement avant d'aller dormir.", body: `11. "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement avant d'aller dormir."
Tu as fait le tour des yeux. Le salon. La cuisine. L'entrée. Pas pour vérifier. Juste pour voir. Pour regarder l'espace qui a été vivant ce soir et qui redevient calme. Cette façon de clôturer visuellement. De dire bonne nuit à la maison. J'ai fait pareil depuis mon coin. On est pareils toi et moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec reconnaissance de notre rituel commun de clôture visuelle et solidarité nocturne, — [Prénom animal], ton animal co-auteur de ce bonsoir quotidien 🏠` },
              { id: "dbd_154", angle: "Pour ton anniversaire j'ai observé ta façon d'éteindre les lumières une par une.", body: `14. "Pour ton anniversaire j'ai observé ta façon d'éteindre les lumières une par une."
La cuisine d'abord. Puis le couloir. Puis le salon. Une progression qui suit le chemin inverse de la soirée. Comme si tu remettais l'appartement dans son état nocturne pièce par pièce. Ce rituel de fin. Cette façon ordonnée de clore. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du rituel d'extinction et sa progression significative de fin, — [Prénom animal], ton animal témoin de tes clôtures ordonnées 💡` },
              { id: "dbd_159", angle: "Pour ton anniversaire j'ai observé ta façon de réajuster les coussins après la fête.", body: `19. "Pour ton anniversaire j'ai observé ta façon de réajuster les coussins après la fête."
Chacun à sa place. Les grands derrière. Les petits devant. L'ordre que tu avais choisi et que la soirée avait défait. Cette remise en ordre après. Ce soin pour retrouver ton espace. Ces coussins réajustés c'est une lettre à ton futur toi du lendemain. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décodage du réajustement des coussins comme soin pour le lendemain, — [Prénom animal], ton animal lecteur de tes gestes de fin 🛋️` },
              { id: "dbd_166", angle: "Pour ton anniversaire j'ai observé ta façon de vérifier tout avant de dormir.", body: `6. "Pour ton anniversaire j'ai observé ta façon de vérifier tout avant de dormir."
La porte. Les fenêtres. Le gaz. Ces vérifications rituelles. Puis tu passes devant moi. Tu me regardes. Tu t'assures que je suis là. Que je suis bien. Et tu vas dormir. Cette façon de faire le tour de ce qui compte. Je suis dans ton tour. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec confirmation de ma place dans ton tour de vérification nocturne et fierté d'y figurer, — [Prénom animal], ton animal partie de ce qui compte assez pour être vérifié 🔐` },
              { id: "dbd_171", angle: "Pour ton anniversaire j'ai observé ta façon de lire un message tardif.", body: `11. "Pour ton anniversaire j'ai observé ta façon de lire un message tardif."
Quelqu'un t'a écrit après minuit. Tard. En retard sur la journée. Tu l'as lu depuis le canapé avant de dormir. Et tu souriais. Le même sourire que pour les messages du matin. Pas de différence selon l'heure. Cette façon de recevoir les gestes des gens là où ils sont et quand ils peuvent. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton accueil sans horaire des gestes tardifs, — [Prénom animal], ton animal admirateur de ta générosité temporelle 📱` },
              { id: "dbd_189", angle: "Pour ton anniversaire j'ai observé ta façon de poser tes cadeaux reçus en évidence.", body: `9. "Pour ton anniversaire j'ai observé ta façon de poser tes cadeaux reçus en évidence."
Le livre sur la table basse. Le cadre appuyé contre le mur pour décider. La bougie testée sur l'étagère. Chaque cadeau placé là où tu vas le voir. Où tu vas continuer à le recevoir les jours suivants. Cette façon de prolonger la joie du cadeau au-delà de la soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta façon de prolonger la joie des cadeaux au-delà du soir, — [Prénom animal], ton animal expert en continuations de bonheur 🎁` },
              { id: "dbd_191", angle: "Pour ton anniversaire j'ai observé ta façon de rire quand tu lis une carte d'anniversaire drôle.", body: `11. "Pour ton anniversaire j'ai observé ta façon de rire quand tu lis une carte d'anniversaire drôle."
Pas le rire poli. Le vrai. Celui qui part sans prévenir. Qui te fait fermer les yeux une seconde. Tu as relu la carte deux fois. Tu l'as montrée à quelqu'un. Tu as ri encore. Ce rire-là je le collectionne. Il est rare et précieux. Ce soir il est arrivé une fois. Une suffit. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec un vrai rire collectionné ce soir et sa valeur bien établie, — [Prénom animal], ton animal gardien de tes éclats authentiques 😄` },
              { id: "dbd_194", angle: "Pour ton anniversaire j'ai observé ta façon de te souvenir de chaque cadeau reçu.", body: `14. "Pour ton anniversaire j'ai observé ta façon de te souvenir de chaque cadeau reçu."
Le lendemain tu en parleras avec précision. De qui c'était. Ce que tu as ressenti. L'attention derrière. Cette mémoire des cadeaux qui est en réalité une mémoire des gens qui les ont donnés. Chaque cadeau un visage. Chaque objet une relation. Joyeux anniversaire, [mon maître/ma maîtresse], dont la gratitude a une mémoire longue.
Avec anticipation de ta mémoire des cadeaux du lendemain et sa vraie signification, — [Prénom animal], ton animal admirateur de ta gratitude mémorisée 💛` },
            ],
          },
          {
            id: "apres_fete",
            label: "Après la fête",
            messages: [
              { id: "dbd_134", angle: "Pour ton anniversaire j'ai observé ta façon de fermer la porte quand le dernier invité est parti.", body: `14. "Pour ton anniversaire j'ai observé ta façon de fermer la porte quand le dernier invité est parti."
Lentement. Pas claquée. Fermée avec soin. Comme si tu refermais quelque chose de précieux. Comme si tu contenais encore un moment ce qui venait de se passer avant que ça disparaisse. Cette porte fermée doucement. Ce geste de fin. C'est un des plus beaux gestes de la soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du geste de fermeture et sa signification de préservation du moment, — [Prénom animal], ton animal témoin de tes plus beaux gestes de fin 🚪` },
              { id: "dbd_139", angle: "Pour ton anniversaire j'ai observé comment tu ranges les restes dans des boîtes pour les invités.", body: `19. "Pour ton anniversaire j'ai observé comment tu ranges les restes dans des boîtes pour les invités."
Chacun repart avec quelque chose. Tu prépares les boîtes à la fin. Tu penses à chacun. Tu sais qui aimait quoi. Ces petits paquets de soirée que les gens emmènent chez eux. Cette façon de prolonger la fête dans leur cuisine le lendemain. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta générosité des restes et sa signification de prolongation de la fête, — [Prénom animal], ton animal admirateur de tes gestes qui durent après toi 📦` },
              { id: "dbd_161", angle: "Pour ton anniversaire j'ai observé ta façon de retrouver tes affaires dans le chaos post-fête.", body: `1. "Pour ton anniversaire j'ai observé ta façon de retrouver tes affaires dans le chaos post-fête."
Ton téléphone. Tes clés. Le tire-bouchon. Les choses qui migrent pendant une soirée. Tu cherches avec méthode. Tu sais approximativement où chercher parce que tu connais les habitudes des objets chez toi. Et tu trouves. Toujours. Cette relation avec tes objets. Cette connaissance de leur géographie. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta cartographie intime de tes propres objets, — [Prénom animal], ton animal qui observe ta maîtrise de ton territoire 🗺️` },
              { id: "dbd_165", angle: "Joyeux anniversaire. J'ai observé comment tu décides que la soirée est finie.", body: `5. "Joyeux anniversaire. J'ai observé comment tu décides que la soirée est finie."
Ce n'est pas un horaire. Ce n'est pas la fatigue visible. C'est un moment que tu sens. Quelque chose dans l'énergie change. Tu proposes le café. Certains reprennent leur veste. Et sans que personne le dise la soirée se termine. Tu l'as guidée vers sa fin naturelle. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton sens du moment de fin et ta capacité à le guider sans le forcer, — [Prénom animal], ton animal expert en fins naturelles ⏰` },
              { id: "dbd_174", angle: "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement le lendemain matin.", body: `14. "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement le lendemain matin."
Pas ce soir. Demain matin. Je serai là. Tu te lèveras. Tu verras l'appartement rangé. Calme. Et tu auras ce regard. Ce regard du lendemain matin qui dit que c'était une belle soirée et que la vie continue. Je garderai ce regard. Je te l'offre comme promesse. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec anticipation du regard du lendemain matin et promesse d'y être pour le partager, — [Prénom animal], ton animal présent pour tes matins d'après 🌅` },
              { id: "dbd_179", angle: "Pour ton anniversaire j'ai observé ta façon de choisir la musique de fin de soirée.", body: `19. "Pour ton anniversaire j'ai observé ta façon de choisir la musique de fin de soirée."
Plus douce. Plus lente. Sans que personne ne le demande tu as fait baisser le volume et changer le tempo. La musique qui accompagne la fin sans la provoquer. Cette façon de guider sans diriger. De suggérer sans imposer. C'est de la poésie sonore. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta curation musicale de fin de soirée et sa douceur directrice, — [Prénom animal], ton animal appréciant ton art de la décélération 🎵` },
            ],
          },
        ],
      },
    ],
  },
  chien_nameday: {
    themes: [
      {
        id: "fete_cest_quoi",
        emoji: "🎉",
        label: "La fête du prénom — c'est quoi ?",
        count: 7,
        subGroups: [
          {
            id: "all",
            label: "Tous les messages",
            messages: [
              { id: "dnd_001", angle: "Aujourd'hui c'est ta fête. Je sais pas exactement ce que ça veut dire.", body: `1. "Aujourd'hui c'est ta fête. Je sais pas exactement ce que ça veut dire."
On m'a pas expliqué la différence avec l'anniversaire. Y'a pas de gâteau apparent. Pas de bougies. Juste toi qui sembles attendre quelque chose. J'ai décidé de faire comme si c'était aussi important que Noël. J'ai sauté partout pendant vingt minutes pour marquer le coup. C'était ma façon. Joyeuse fête, [mon maître/ma maîtresse], événement que je fête sans en comprendre les règles.
Avec enthousiasme non éclairé mais sincère, — [Prénom animal], ton animal qui fête tout avec la même intensité 🎉` },
              { id: "dnd_003", angle: "Je sais pas ce qu'est une fête du prénom mais j'ai fait semblant de savoir.", body: `3. "Je sais pas ce qu'est une fête du prénom mais j'ai fait semblant de savoir."
Quand les gens sont venus te féliciter j'ai remué la queue comme si j'étais au courant depuis le début. J'avais l'air informé. Impliqué. Partie prenante de l'organisation. En vérité j'attendais juste qu'on me remarque. Ça a marché. Joyeuse fête, [mon maître/ma maîtresse], dont les événements sont aussi les miens par extension.
Avec improvisation sociale parfaite et queue en mode automatique, — [Prénom animal], ton animal qui s'adapte à toutes les situations 🎭` },
              { id: "dnd_004", angle: "On m'a dit que ta fête c'est le jour du saint qui porte ton prénom.", body: `4. "On m'a dit que ta fête c'est le jour du saint qui porte ton prénom."
J'ai cherché si les chiens avaient un saint patron. Il paraît que c'est saint Roch. Je connais pas saint Roch. Mais si un jour c'est sa fête je vais fêter ça très fort pour que vous soyez quittes toi et moi. En attendant joyeuse fête, [mon maître/ma maîtresse], dont le saint patron veille apparemment sur toi.
Avec recherches théologiques approfondies et réciprocité planifiée, — [Prénom animal], ton animal en attente du 16 août 🙏` },
              { id: "dnd_008", angle: "Les humains ont deux jours dans l'année où ils sont célébrés. Moi zéro.", body: `8. "Les humains ont deux jours dans l'année où ils sont célébrés. Moi zéro."
Enfin officiellement zéro. Parce que moi je célèbre chaque jour comme si c'était ma fête. Le réveil. La promenade. Le repas. Le canapé. Le retour à la maison. Chaque moment est une fête pour moi. Peut-être que c'est ça la vraie leçon. Joyeuse fête quand même, [mon maître/ma maîtresse], qui mérite ses deux jours par an.
Avec philosophie du quotidien et sagesse canine offerte gratuitement, — [Prénom animal], ton animal en fête permanente 🥳` },
              { id: "dnd_010", angle: "On m'a expliqué que ta fête c'est lié à un calendrier avec des saints dedans.", body: `10. "On m'a expliqué que ta fête c'est lié à un calendrier avec des saints dedans."
J'ai regardé le calendrier. Y'a un saint pour presque chaque jour. Ce qui veut dire que presque chaque jour quelqu'un fait la fête quelque part. Ce qui veut dire que presque chaque jour est une bonne raison de sauter partout et de réclamer des croquettes supplémentaires. Merci les saints. Joyeuse fête, [mon maître/ma maîtresse], dont la religion est très pratique pour moi.
Avec interprétation théologique libre et applications concrètes immédiates, — [Prénom animal], ton animal très attaché au calendrier liturgique 📅` },
              { id: "dnd_013", angle: "Y'a un truc que je comprends pas avec les fêtes des prénoms.", body: `13. "Y'a un truc que je comprends pas avec les fêtes des prénoms."
Pourquoi c'est le prénom qui fête et pas la personne ? Ton prénom a rien fait de spécial que je sache. C'est toi qui fais des choses. C'est toi qui me nourris. C'est toi qui ouvres la porte. Ton prénom il reste là dans ta tête à rien faire. Joyeuse fête quand même, [mon maître/ma maîtresse], et joyeuse fête aussi à ton prénom par acquit de conscience.
Avec questionnement philosophique sincère et double dédicace par précaution, — [Prénom animal], ton animal rigoureux dans ses hommages 🤔` },
              { id: "dnd_022", angle: "Joyeuse fête. J'ai cherché qui était ce saint qui porte ton prénom.", body: `2. "Joyeuse fête. J'ai cherché qui était ce saint qui porte ton prénom."
J'ai pas trouvé grand chose. Apparemment il a fait des miracles. Moi aussi je fais des miracles tous les jours. Je retrouve chaque balle qu'on me lance dans les hautes herbes. Je reviens toujours quand on m'appelle même quand j'avais des projets. Je reste assis alors que le monde entier m'invite à courir. Si ça c'est pas des miracles. Joyeuse fête, [mon maître/ma maîtresse], et joyeuse fête à ton saint qui a l'air bien.
Avec dossier de sainteté personnelle constitué et candidature déposée officieusement, — [Prénom animal], ton animal aux miracles quotidiens non reconnus 🙏` },
            ],
          },
        ],
      },
      {
        id: "comportements",
        emoji: "🐾",
        label: "Comportements canins",
        count: 25,
        subGroups: [
          {
            id: "presence",
            label: "J'assure ma présence",
            messages: [
              { id: "dnd_009", angle: "J'ai essayé de chanter quelque chose pour ta fête.", body: `9. "J'ai essayé de chanter quelque chose pour ta fête."
C'est sorti comme un aboiement long et modulé à 6h47 du matin. Les voisins ont tapé au mur. Tu t'es réveillé[e] en sursaut. T'as pas eu l'air de reconnaître la mélodie. C'était pourtant clairement une sérénade. Joyeuse fête, [mon maître/ma maîtresse], dont je perfectionne le répertoire musical chaque année.
Avec talent vocal indéniable et public encore non converti, — [Prénom animal], ton animal artiste incompris du matin 🎵` },
              { id: "dnd_012", angle: "Pour ta fête j'ai décidé d'être particulièrement sage aujourd'hui.", body: `12. "Pour ta fête j'ai décidé d'être particulièrement sage aujourd'hui."
J'ai pas touché au canapé. J'ai pas suivi le chat du voisin. J'ai pas reniflé le sac de la dame qui est venue. J'ai même attendu sagement pendant le repas sans poser la tête sur la table. Une seule fois. Brièvement. Mais je l'ai retirée. Ça compte. Joyeuse fête, [mon maître/ma maîtresse], pour qui je me surpasse une fois par an.
Avec effort surhumain et bilan globalement positif, — [Prénom animal], ton animal en version premium pour l'occasion 🏅` },
              { id: "dnd_019", angle: "Pour ta fête j'ai décidé de pas mâcher tes affaires aujourd'hui.", body: `19. "Pour ta fête j'ai décidé de pas mâcher tes affaires aujourd'hui."
La télécommande est intacte. Le coin du canapé aussi. Tes chaussures sont exactement là où tu les as laissées. C'est mon cadeau. Invisible. Silencieux. Mais réel. Le cadeau de ce qui n'a pas été détruit. Tu peux pas me remercier parce que tu sais pas ce que j'aurais pu faire. Mais moi je sais. Joyeuse fête, [mon maître/ma maîtresse].
Avec retenue héroïque et cadeau négatif d'une valeur inestimable, — [Prénom animal], ton animal qui te protège de lui-même 🛡️` },
              { id: "dnd_023", angle: "Pour ta fête j'ai gardé la porte d'entrée sous surveillance toute la journée.", body: `3. "Pour ta fête j'ai gardé la porte d'entrée sous surveillance toute la journée."
Depuis 16h. Sans bouger. Assis dans le couloir face à la porte. J'entendais les pas dans l'escalier bien avant la sonnette. Je savais qui montait. Je savais quand ce serait les bons. À chaque arrivée j'ai explosé avec une précision et une intensité que j'avais répétées mentalement. C'est du travail. De la préparation. De la dédicace. Joyeuse fête, [mon maître/ma maîtresse], dont les invités sont les miens aussi.
Avec poste de surveillance tenu pendant quatre heures et accueil de chaque arrivée assuré, — [Prénom animal], ton animal directeur du protocole d'entrée 🚪` },
              { id: "dnd_043", angle: "Pour ta fête j'ai gardé une position stratégique sous tes pieds toute la soirée.", body: `3. "Pour ta fête j'ai gardé une position stratégique sous tes pieds toute la soirée."
Pas sous la table. Sous tes pieds. Exactement là. Chaud. Stable. Discret. Certains invités ont failli marcher dessus deux fois. Tu les as prévenus. Tu savais que j'étais là. Tu faisais attention. Cette attention-là dans le bruit et le mouvement d'une soirée entière c'est quelque chose. Joyeuse fête, [mon maître/ma maîtresse], dont les pieds sont mon endroit préféré ce soir.
Avec position tenue pendant trois heures et attention de ta part jamais démentie, — [Prénom animal], ton animal ancre de ta soirée 🐾` },
              { id: "dnd_080", angle: "Joyeuse fête. J'ai attendu dans la salle de bain à écouter la fête.", body: `20. "Joyeuse fête. J'ai attendu dans la salle de bain à écouter la fête."
Les voix portaient. Des fragments. Des rires. Des noms. Une conversation sur quelque chose que j'ai pas identifié. Le son d'une fête depuis loin c'est différent. Plus doux. Plus rond. Comme de la musique dont on entend que les basses. C'était bien. J'y suis resté plus longtemps que prévu. Joyeuse fête, [mon maître/ma maîtresse].
Avec écoute de ta fête en version acoustique distante et appréciation inattendue, — [Prénom animal], ton animal audiophile des sons de couloir 🛁` },
            ],
          },
          {
            id: "protocoles",
            label: "Mes protocoles avec les invités",
            messages: [
              { id: "dnd_002", angle: "J'ai entendu quelqu'un dire ton prénom aujourd'hui. Plusieurs fois.", body: `2. "J'ai entendu quelqu'un dire ton prénom aujourd'hui. Plusieurs fois."
Au téléphone. Avec une voix joyeuse. Puis une autre personne a dit ton prénom. Puis une autre. Tout le monde disait ton prénom aujourd'hui et personne m'a expliqué pourquoi. J'ai aboyé à chaque fois pour signaler ma présence. C'était ma contribution. Joyeuse fête, [mon maître/ma maîtresse], dont le prénom résonnait partout ce matin.
Avec vigilance phonétique et participation vocale assumée, — [Prénom animal], ton animal gardien de ton prénom 📣` },
              { id: "dnd_014", angle: "Ce soir y'avait du monde chez toi pour ta fête.", body: `14. "Ce soir y'avait du monde chez toi pour ta fête."
Des gens que je connaissais. Des gens que je connaissais pas. J'ai accueilli tout le monde avec la même énergie. Les habitués ont eu droit à mes pattes sur les épaules. Les nouveaux ont eu droit à un audit olfactif complet. C'est mon protocole d'accueil. C'est ma contribution à la fête. Joyeuse fête, [mon maître/ma maîtresse], dont les soirées ont toujours un agent de sécurité attitré.
Avec sélection des invités par l'odorat et bilan sécuritaire satisfaisant, — [Prénom animal], ton animal videur de charme 🔐` },
              { id: "dnd_025", angle: "Pour ta fête j'ai conquis le canapé de chaque invité dès qu'il se levait.", body: `5. "Pour ta fête j'ai conquis le canapé de chaque invité dès qu'il se levait."
C'est une règle universelle et immuable. Un siège libéré est un siège disponible. Le temps que la personne revienne avec son verre j'étais installé. Les pattes étendues. L'air de quelqu'un qui a toujours été là. Certains ont essayé de me déloger avec des mots doux. D'autres avec des gestes. J'ai tenu à chaque fois. Au total j'ai occupé six sièges différents ce soir. Record personnel. Joyeuse fête, [mon maître/ma maîtresse].
Avec doctrine de l'occupation immédiate appliquée sans exception et nouveau record établi, — [Prénom animal], ton animal gestionnaire de l'immobilier festif 🪑` },
              { id: "dnd_027", angle: "Pour ta fête j'ai accompagné chaque toast d'un aboiement.", body: `7. "Pour ta fête j'ai accompagné chaque toast d'un aboiement."
Quand les verres se lèvent quelque chose se passe dans la pièce. Une montée d'énergie. Un moment collectif. Un son de verre contre verre. Et là je contribue. Un aboiement bref. Ponctuel. Qui dit que moi aussi je suis là. Que moi aussi je célèbre. Que cette fête est aussi la mienne. Certains invités ont sursauté. C'est qu'ils manquaient d'enthousiasme. Joyeuse fête, [mon maître/ma maîtresse].
Avec participation sonore aux moments clés de la soirée et enthousiasme partagé unilatéralement, — [Prénom animal], ton animal maître de cérémonie non officiel 🥂` },
              { id: "dnd_028", angle: "Joyeuse fête. Je reconnais chaque ami à sa façon de frapper.", body: `8. "Joyeuse fête. Je reconnais chaque ami à sa façon de frapper."
Celui du troisième frappe deux fois fort. La dame du bureau frappe trois petits coups rapides. Le grand ami frappe une fois et attend longtemps. Je sais qui c'est avant que tu te lèves. Parfois je vais à la porte avant toi. T'as jamais compris comment je savais. Maintenant tu sais. Joyeuse fête, [mon maître/ma maîtresse], dont les amis ont tous leur signature sonore.
Avec base de données des coups de sonnette complète et identifications infaillibles, — [Prénom animal], ton animal détective de l'acoustique des portes 👂` },
              { id: "dnd_033", angle: "Pour ta fête j'ai escorté chaque invité jusqu'à la porte en partant.", body: `13. "Pour ta fête j'ai escorté chaque invité jusqu'à la porte en partant."
Un par un. Le protocole de départ est aussi important que le protocole d'arrivée. Je les accompagnais depuis le salon jusqu'à l'entrée. Je regardais la porte se fermer. Je revenais. Je repartais pour le suivant. Certains ont trouvé ça touchant. L'un d'eux a voulu me faire un câlin d'au revoir. J'ai accepté. Brièvement. C'est de la courtoisie. Joyeuse fête, [mon maître/ma maîtresse].
Avec escorte personnalisée de chaque départ et accolade d'au revoir accordée sous conditions, — [Prénom animal], ton animal maître des cérémonies de départ 👋` },
              { id: "dnd_047", angle: "Pour ta fête j'ai fait le tour de chaque invité pour établir un classement.", body: `7. "Pour ta fête j'ai fait le tour de chaque invité pour établir un classement."
Reniflage complet. Évaluation. Score sur dix. La dame du bureau : huit sur dix, elle gratte bien derrière l'oreille. Le grand ami : six sur dix, ses mains sont froides. La nouvelle : neuf sur dix, elle sent le jardin et elle s'est mise par terre pour me parler. Le résultat est disponible. Je te le communiquerai via mon comportement les prochaines fois qu'ils viendront. Joyeuse fête, [mon maître/ma maîtresse].
Avec classement des invités établi selon critères personnels et résultats communiqués en temps comportemental, — [Prénom animal], ton animal DRH de ton cercle social 📋` },
              { id: "dnd_051", angle: "Pour ta fête j'ai accompagné chaque invité aux toilettes.", body: `11. "Pour ta fête j'ai accompagné chaque invité aux toilettes."
Pas dedans. Jusqu'à la porte. Et j'attendais. Et quand la porte se rouvrait j'étais là. Certains ont eu l'air surpris. L'un d'eux a ri. Un autre a essayé de me faire partir. Je suis resté. C'est mon appartement. Je connais chaque pièce. Je gère chaque déplacement. C'est de la logistique. Joyeuse fête, [mon maître/ma maîtresse], dont les invités sont entre de bonnes pattes.
Avec escorte personnalisée vers chaque destination intérieure et retour garanti, — [Prénom animal], ton animal guide de l'appartement en toutes circonstances 🗺️` },
              { id: "dnd_053", angle: "Pour ta fête j'ai reçu des caresses de quelqu'un qui dit être allergique.", body: `13. "Pour ta fête j'ai reçu des caresses de quelqu'un qui dit être allergique."
Elle l'avait annoncé en arrivant. Allergique aux chiens. Je l'avais entendu. Et pourtant deux heures plus tard sa main était sur ma tête. Doucement. Furtivement. En regardant ailleurs. Comme si ça comptait pas si on regardait ailleurs. J'ai pas bougé. J'ai laissé faire. Certaines allergies se soignent par exposition progressive. Je suis thérapeutique. Joyeuse fête, [mon maître/ma maîtresse].
Avec service thérapeutique rendu discrètement et guérison partielle constatée, — [Prénom animal], ton animal traitement médical non conventionnel 💊` },
              { id: "dnd_057", angle: "Pour ta fête j'ai dormi sur les pieds de l'invité le plus calme.", body: `17. "Pour ta fête j'ai dormi sur les pieds de l'invité le plus calme."
Il y en avait un. Qui parlait moins que les autres. Qui bougeait moins. Qui occupait son espace avec une tranquillité que j'ai identifiée comme compatible avec la mienne. Je me suis installé sur ses pieds vers 21h. Il n'a pas bougé. On a coexisté en silence pendant quarante minutes pendant que la fête continuait autour. C'était le meilleur endroit de la soirée. Joyeuse fête, [mon maître/ma maîtresse].
Avec identification du profil compatible et alliance silencieuse de quarante minutes, — [Prénom animal], ton animal aux affinités électives bien développées 🤝` },
              { id: "dnd_072", angle: "Joyeuse fête. J'ai étudié chaque nouveau visage entrant depuis le couloir.", body: `12. "Joyeuse fête. J'ai étudié chaque nouveau visage entrant depuis le couloir."
Sans me montrer. Juste le museau qui dépasse. L'évaluation. La classification par odeur. Le verdict silencieux. Certains m'ont intéressé. Un m'a intrigué. Deux m'ont laissé indifférent. C'est de la gestion des risques. Joyeuse fête, [mon maître/ma maîtresse], dont les invités sont évalués en temps réel.
Avec évaluation olfactive systématique de chaque nouveau visage et verdicts silencieux, — [Prénom animal], ton animal directeur de la sécurité à temps plein 🔍` },
            ],
          },
          {
            id: "strategies_aliment",
            label: "Stratégies alimentaires",
            messages: [
              { id: "dnd_007", angle: "Ta fête c'est pas pareil que ton anniversaire mais c'est quand même une bonne excuse.", body: `7. "Ta fête c'est pas pareil que ton anniversaire mais c'est quand même une bonne excuse."
Une bonne excuse pour rester collé contre toi toute la journée. Pour réclamer plus de caresses que d'habitude. Pour faire des yeux particulièrement convaincants au moment des repas. T'aurais du mal à dire non un jour de fête. C'est tactique. C'est calculé. C'est moi. Joyeuse fête, [mon maître/ma maîtresse], dont les jours spéciaux sont mes meilleurs jours.
Avec stratégie affective rodée et timing impeccable, — [Prénom animal], ton animal aux opportunités bien saisies 🎯` },
              { id: "dnd_029", angle: "Pour ta fête j'ai attendu sous la table pendant tout le repas.", body: `9. "Pour ta fête j'ai attendu sous la table pendant tout le repas."
Pas couché. Assis. Droit. Avec dignité. Dans l'espoir raisonnable qu'une chose tomberait. Ou qu'une main compatissante descendrait. J'ai attendu une heure et demie. Rien n'est tombé. Aucune main n'est descendue. La table était hermétique. J'ai quand même pas bougé parce que l'espoir c'est un principe et les principes on y tient. Joyeuse fête, [mon maître/ma maîtresse].
Avec patience stratégique d'une heure trente et espoir intact malgré le bilan, — [Prénom animal], ton animal optimiste professionnel sous toutes les tables 🍽️` },
              { id: "dnd_030", angle: "Joyeuse fête. J'ai élaboré une stratégie pour obtenir un morceau du gâteau.", body: `10. "Joyeuse fête. J'ai élaboré une stratégie pour obtenir un morceau du gâteau."
Phase 1 : m'asseoir très près avec le regard. Phase 2 : poser une patte sur la jambe. Phase 3 : le petit gémissement discret. Phase 4 : la tête penchée à 45 degrés. J'ai exécuté les quatre phases avec une précision chirurgicale. Tu as résisté jusqu'à la phase 3. J'ai eu un tout petit morceau. Pas assez. Mais j'ai noté ce qui a fonctionné pour l'année prochaine. Joyeuse fête, [mon maître/ma maîtresse].
Avec stratégie documentée et optimisations prévues pour la prochaine édition, — [Prénom animal], ton animal négociateur aux tactiques en constante amélioration 🎂` },
              { id: "dnd_035", angle: "Pour ta fête j'ai fait une sieste sous la table pendant le repas.", body: `15. "Pour ta fête j'ai fait une sieste sous la table pendant le repas."
Allongé. Les pattes croisées. Les yeux mi-clos. La joue posée sur le parquet frais. Les voix au-dessus de moi comme un plafond sonore agréable. Les pieds des chaises autour de moi comme une forêt de bois. C'était confortable. Sécurisant. Le meilleur endroit de la soirée. Je me suis réveillé au moment du dessert exactement. Instinct. Joyeuse fête, [mon maître/ma maîtresse].
Avec sieste parfaitement chronométrée et réveil au moment stratégique garanti, — [Prénom animal], ton animal dont l'horloge interne est calibrée sur les desserts ⏰` },
              { id: "dnd_049", angle: "Pour ta fête j'ai protégé ton assiette toute la soirée.", body: `9. "Pour ta fête j'ai protégé ton assiette toute la soirée."
Je me suis installé près de toi au moment du repas. Très près. Entre toi et les autres. Mon regard allait de ton assiette aux autres assiettes. De ton verre aux autres verres. Personne ne s'est approché de ta nourriture. Je t'assurais une bulle de sécurité alimentaire complète. Bon j'espérais aussi que quelque chose tomberait. Mais la mission de protection était sincère. Joyeuse fête, [mon maître/ma maîtresse].
Avec protection alimentaire assurée et intérêt personnel honnêtement reconnu, — [Prénom animal], ton animal garde du corps culinaire aux motivations transparentes 🍽️` },
            ],
          },
          {
            id: "reconnais",
            label: "Je reconnais & je reprends possession",
            messages: [
              { id: "dnd_038", angle: "Joyeuse fête. Après le départ des invités j'ai fait le tour complet de l'appartement.", body: `18. "Joyeuse fête. Après le départ des invités j'ai fait le tour complet de l'appartement."
Pièce par pièce. Chaque endroit où quelqu'un s'était assis. Chaque coin qui avait reçu une odeur nouvelle. Chaque surface modifiée par la soirée. Un inventaire complet. Une réappropriation méthodique. L'appartement avait appartenu à tout le monde pendant trois heures. Il fallait lui rendre son identité. La nôtre. Joyeuse fête, [mon maître/ma maîtresse].
Avec tournée de réappropriation complète et territoire rendu à son état normal, — [Prénom animal], ton animal gardien de l'identité de notre chez-nous 🏠` },
              { id: "dnd_041", angle: "Joyeuse fête. J'ai reconnu que c'était ce soir à la musique.", body: `1. "Joyeuse fête. J'ai reconnu que c'était ce soir à la musique."
Pas la musique du dimanche matin. Pas celle du ménage. L'autre. Celle qui sort des petites enceintes posées sur l'étagère que tu sors que pour les occasions. Je connais le son de chaque appareil dans cet appartement. Celui-là veut dire que des gens viennent. Que la soirée va être longue. Que je dois me préparer. J'ai commencé ma préparation mentale dès la première note. Joyeuse fête, [mon maître/ma maîtresse], dont la playlist est mon calendrier.
Avec détection sonore des événements et préparation mentale activée immédiatement, — [Prénom animal], ton animal dont l'oreille lit l'avenir 🎵` },
              { id: "dnd_061", angle: "Joyeuse fête. J'ai reconnu que c'était aujourd'hui à la nappe.", body: `1. "Joyeuse fête. J'ai reconnu que c'était aujourd'hui à la nappe."
Pas la nappe habituelle. L'autre. Celle du placard du haut. Celle qui sort quatre fois par an maximum. Je l'ai vue ce matin et j'ai tout compris immédiatement. Ce signe textile. Ce signal que quelque chose d'important approche. J'ai passé la matinée à me préparer mentalement. Joyeuse fête, [mon maître/ma maîtresse], dont la nappe est mon calendrier.
Avec lecture du signal textile et préparation mentale immédiate, — [Prénom animal], ton animal dont les yeux lisent les événements avant toi 🍽️` },
            ],
          },
        ],
      },
      {
        id: "narine",
        emoji: "👃",
        label: "Narine en éveil",
        count: 7,
        subGroups: [
          {
            id: "all",
            label: "Tous les messages",
            messages: [
              { id: "dnd_005", angle: "Ce matin j'ai senti que c'était un jour spécial.", body: `5. "Ce matin j'ai senti que c'était un jour spécial."
Pas à cause du calendrier. Parce que t'avais une énergie différente. Une façon de te préparer. Un sourire anticipé. Je capte ces choses-là. Je suis un expert de toi. Joyeuse fête, [mon maître/ma maîtresse], dont je lis les humeurs avant même que tu te lèves.
Avec expertise émotionnelle certifiée et nez infaillible, — [Prénom animal], ton animal baromètre de tes journées depuis le premier jour 🌡️` },
              { id: "dnd_018", angle: "Aujourd'hui quelqu'un t'a apporté des fleurs.", body: `18. "Aujourd'hui quelqu'un t'a apporté des fleurs."
Des vraies. Dans du papier. Qui sentaient fort. J'ai reniflé le bouquet pendant quatre minutes complètes sous ton regard de plus en plus inquiet. J'ai conclu que c'était comestible. T'as éloigné les fleurs. J'ai été vexé. On a quand même passé une belle soirée tous les deux après. Joyeuse fête, [mon maître/ma maîtresse], dont les cadeaux m'intéressent autant que toi.
Avec expertise botanique en développement et vexation de courte durée, — [Prénom animal], ton animal critique floral non sollicité 🌹` },
              { id: "dnd_021", angle: "Joyeuse fête. J'ai su que c'était un jour spécial parce que tu t'es parfumé.", body: `1. "Joyeuse fête. J'ai su que c'était un jour spécial parce que tu t'es parfumé."
Pas le parfum du mardi ordinaire. L'autre. Celui que tu gardes pour les occasions. J'ai senti ça depuis le couloir quand tu te préparais. Ce parfum veut dire quelque chose. Il veut dire que des gens vont venir. Que la soirée va être différente. Que je dois calibrer mon niveau d'énergie en conséquence. J'ai commencé à préparer ma performance d'accueil dès ce moment-là. Joyeuse fête, [mon maître/ma maîtresse], dont le parfum est mon calendrier.
Avec détection olfactive des jours spéciaux et préparation anticipée, — [Prénom animal], ton animal au nez plus fiable que n'importe quel agenda 👃` },
              { id: "dnd_052", angle: "Joyeuse fête. L'appartement sent différemment après une fête.", body: `12. "Joyeuse fête. L'appartement sent différemment après une fête."
Ce mélange de tous ceux qui sont passés. Les parfums superposés. La nourriture. Les manteaux mouillés. Le souffle de huit personnes pendant trois heures. C'est riche. Dense. Presque trop. J'ai passé vingt minutes à tout réanalyser après le départ du dernier invité. À trier. À classer. À retrouver notre odeur sous tout ça. Elle était encore là. Joyeuse fête, [mon maître/ma maîtresse].
Avec réanalyse post-fête complète et odeur originale retrouvée sous les couches, — [Prénom animal], ton animal archiviste de l'identité olfactive de notre chez-nous 👃` },
              { id: "dnd_055", angle: "Pour ta fête j'ai mémorisé exactement ce que chaque invité sentait.", body: `15. "Pour ta fête j'ai mémorisé exactement ce que chaque invité sentait."
La dame du bureau : savon au lait et quelque chose de fleuri. Le grand ami : extérieur et café. La nouvelle : herbe coupée et un chat chez elle. J'ai noté le chat. Je note toujours les chats. Cette information sera utile. Chaque personne qui entre dans cet appartement enrichit ma base de données. Elle est considérable maintenant. Joyeuse fête, [mon maître/ma maîtresse], dont les amis sont tous fichés.
Avec fiches olfactives des invités mises à jour et cas du chat noté en rouge, — [Prénom animal], ton animal directeur d'une base de données mondiale des odeurs 🗂️` },
              { id: "dnd_073", angle: "Joyeuse fête. Ta cuisine sentait différemment aujourd'hui.", body: `13. "Joyeuse fête. Ta cuisine sentait différemment aujourd'hui."
Pas les odeurs habituelles. Les odeurs de fête. Celles qui viennent quand tu cuisines pour des gens. Quelque chose de plus élaboré. De plus chaud. De plus concentré. J'ai passé du temps assis dans l'embrasure à cartographier ces odeurs nouvelles. C'est de la recherche. Joyeuse fête, [mon maître/ma maîtresse].
Avec cartographie olfactive complète de ta cuisine en mode fête, — [Prénom animal], ton animal chercheur en atmosphères culinaires 👃` },
              { id: "dnd_164", angle: "Joyeuse fête. J'ai mémorisé l'odeur de l'appartement avant que les invités arrivent.", body: `4. "Joyeuse fête. J'ai mémorisé l'odeur de l'appartement avant que les invités arrivent."
Cette odeur-là. L'appartement propre. Avec les premières odeurs de cuisine. Et quelque chose de l'anticipation. De l'excitation douce d'avant. Cette version de l'appartement qui n'existe que quelques minutes avant que tout commence. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de l'odeur rare des quelques minutes avant que tout commence, — [Prénom animal], ton animal archiviste des moments d'avant 👃` },
            ],
          },
        ],
      },
      {
        id: "cadeaux",
        emoji: "🎁",
        label: "Cadeaux & objets",
        count: 6,
        subGroups: [
          {
            id: "all",
            label: "Tous les messages",
            messages: [
              { id: "dnd_006", angle: "J'ai voulu te préparer quelque chose de spécial pour ta fête.", body: `6. "J'ai voulu te préparer quelque chose de spécial pour ta fête."
J'ai trouvé une chaussette. Propre cette fois. Enfin presque. Elle avait une petite odeur mais c'est ce qui lui donnait du caractère. Je l'ai apportée avec toute la cérémonie possible. T'as fait une tête. Puis t'as quand même souri. C'est ça le vrai cadeau. Ma façon de donner. Joyeuse fête, [mon maître/ma maîtresse], destinataire de mes offrandes les plus sincères.
Avec générosité textile et intention irréprochable, — [Prénom animal], ton animal aux cadeaux signature 🧦` },
              { id: "dnd_015", angle: "J'ai cherché ce qu'on offre pour une fête du prénom.", body: `15. "J'ai cherché ce qu'on offre pour une fête du prénom."
Internet dit des fleurs. Des chocolats. Un repas. Moi j'ai rien de tout ça. Mais j'ai quelque chose que personne d'autre peut t'offrir. Ma présence totale. Mon regard tourné vers toi en permanence. Mon incapacité physique à m'intéresser à autre chose quand t'es dans la pièce. C'est pas des fleurs. C'est mieux. Joyeuse fête, [mon maître/ma maîtresse].
Avec cadeau immatériel et valeur inestimable, — [Prénom animal], ton animal le plus dévoué qui soit 🌸` },
              { id: "dnd_017", angle: "J'ai fait quelque chose sur le paillasson d'entrée ce matin.", body: `17. "J'ai fait quelque chose sur le paillasson d'entrée ce matin."
C'était pas intentionnel. Enfin si, un peu. Mais c'était pas le bon moment je sais. Sauf que la nature a ses propres horaires et aujourd'hui la nature a décidé que c'était sur le paillasson. Considère ça comme une décoration de fête organique et personnalisée. Joyeuse fête, [mon maître/ma maîtresse], dont le seuil est désormais marqué à mon nom.
Avec timing perfectible et symbolique territoriale forte, — [Prénom animal], ton animal qui marque les grandes occasions à sa façon 🎨` },
              { id: "dnd_039", angle: "Pour ta fête j'ai surveillé tous les manteaux posés sur le lit.", body: `19. "Pour ta fête j'ai surveillé tous les manteaux posés sur le lit."
Ils étaient là. Empilés. Chacun avec son histoire. Son odeur. Son contenu mystérieux dans les poches. J'ai inspecté chaque manteau soigneusement. Plusieurs fois. Je me suis allongé dessus à un moment pour une surveillance plus approfondie. Quand les propriétaires sont venus les reprendre j'ai fait semblant de dormir. Mais j'avais tout vu. Joyeuse fête, [mon maître/ma maîtresse].
Avec inspection des manteaux assurée et informations collectées confidentielles, — [Prénom animal], ton animal agent de renseignement textile 🧥` },
              { id: "dnd_045", angle: "Pour ta fête j'ai testé la solidité de chaque emballage cadeau.", body: `5. "Pour ta fête j'ai testé la solidité de chaque emballage cadeau."
Avec le nez d'abord. Puis avec la patte. Puis avec les dents très brièvement sur un coin qui dépassait. Juste pour évaluer la résistance du papier. C'est du contrôle qualité. Si l'emballage cède trop facilement ça veut dire que le cadeau est mal protégé. Tu m'as éloigné des cadeaux après le deuxième test. C'était avant que j'aie fini. Le rapport est donc incomplet. Joyeuse fête, [mon maître/ma maîtresse].
Avec audit structurel des emballages interrompu avant conclusion et rapport partiel disponible, — [Prénom animal], ton animal expert en résistance des matériaux festifs 🎁` },
              { id: "dnd_064", angle: "Pour ta fête j'ai dormi sur le menu que tu avais écrit.", body: `4. "Pour ta fête j'ai dormi sur le menu que tu avais écrit."
Cette petite feuille sur le comptoir. Les plats dans l'ordre. Les quantités. Avec ton écriture. Je m'y suis installé ce matin. Elle était encore un projet. Ce soir elle est devenue une soirée réelle. J'aime ces passages du projet à la réalité. Je les observe depuis le début. Joyeuse fête, [mon maître/ma maîtresse].
Avec occupation du menu matinal et contemplation de la transformation des plans en soirées, — [Prénom animal], ton animal présent dans tes projets avant qu'ils se réalisent 📋` },
            ],
          },
        ],
      },
      {
        id: "observe_humain",
        emoji: "👁️",
        label: "J'observe ton humain",
        count: 74,
        subGroups: [
          {
            id: "cuisine_table",
            label: "En cuisine & à table",
            messages: [
              { id: "dnd_081", angle: "Joyeuse fête. J'ai observé ta façon de ranger les bouteilles vides.", body: `1. "Joyeuse fête. J'ai observé ta façon de ranger les bouteilles vides."
Tu les mets de côté proprement. En ligne. Avec un ordre qui dit que même les bouteilles vides méritent d'être traitées avec soin. Pas jetées n'importe comment. Posées. Cette façon de traiter ce qui a servi. Ce soin pour les choses finies. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les bouteilles vides et ce qu'il dit sur ta nature, — [Prénom animal], ton animal attentif à ta façon de traiter ce qui a servi 🍾` },
              { id: "dnd_085", angle: "Joyeuse fête. J'ai observé ta façon de couper le pain.", body: `5. "Joyeuse fête. J'ai observé ta façon de couper le pain."
Des tranches égales. Tu les comptes mentalement. Tu t'assures qu'il y en aura assez pour tout le monde. Tu poses les tranches avec soin dans la corbeille. Ce geste simple qui dit que tu penses à tout. Que tu anticipes les besoins. Que personne ne manquera de pain. C'est du soin en tranches. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin en tranches et sa signification d'attention pour chacun, — [Prénom animal], ton animal expert en petits gestes qui comptent 🍞` },
              { id: "dnd_088", angle: "Joyeuse fête. J'ai étudié ta façon de plier les serviettes.", body: `8. "Joyeuse fête. J'ai étudié ta façon de plier les serviettes."
Pas origami. Juste plié proprement. Avec un geste rapide qui dit que tu l'as fait des centaines de fois. Que la serviette bien pliée c'est une évidence. Ce détail invisible que les invités voient sans voir. Qui dit quelque chose sur le soin qu'on a mis dans l'ensemble. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes serviettes pliées et leur signification de soin général de la soirée, — [Prénom animal], ton animal expert en détails invisibles 🍽️` },
              { id: "dnd_089", angle: "Joyeuse fête. J'ai observé ta façon de sortir les plats du four.", body: `9. "Joyeuse fête. J'ai observé ta façon de sortir les plats du four."
Avec les gants épais. La posture légèrement courbée. La précaution dans le mouvement. Cette danse autour du chaud. Ces gestes que tu as développés au fil des années. Une chorégraphie de cuisine que tu ne sais plus que tu sais. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta chorégraphie four-gants et admiration pour ses automatismes, — [Prénom animal], ton animal spectateur de tes gestes appris 🧤` },
              { id: "dnd_093", angle: "Joyeuse fête. J'ai observé ta façon de vérifier que les bougies sont bien droites avant de les allumer.", body: `13. "Joyeuse fête. J'ai observé ta façon de vérifier que les bougies sont bien droites avant de les allumer."
Tu les ajustes. Une par une. Tu regardes l'ensemble. Tu en redresses une. Tu recules pour voir. Cette précision pour quelque chose qui va brûler et disparaître en quelques minutes. Ce soin pour l'éphémère. C'est beau. C'est toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton soin accordé à l'éphémère et ce qu'il dit sur ta façon d'être, — [Prénom animal], ton animal philosophe du soin pour ce qui dure peu 🕯️` },
              { id: "dnd_096", angle: "Joyeuse fête. J'ai étudié la façon dont tu disposes les choses sur le buffet.", body: `16. "Joyeuse fête. J'ai étudié la façon dont tu disposes les choses sur le buffet."
Rien n'est au hasard. Les choses hautes au fond. Les petites devant. Les couleurs pensées. Les textures variées. Ce buffet c'est une composition. Une œuvre collective qui dit qu'on a pensé à l'ensemble. Joyeuse fête, [mon maître/ma maîtresse], dont le buffet est de l'art appliqué.
Avec admiration pour ta composition de buffet et sa logique esthétique et pratique, — [Prénom animal], ton animal critique du buffet et de ses équilibres 🎨` },
              { id: "dnd_101", angle: "Joyeuse fête. J'ai observé ta façon de couper le gâteau en parts égales.", body: `1. "Joyeuse fête. J'ai observé ta façon de couper le gâteau en parts égales."
Tu prends le couteau. Tu regards le gâteau. Tu calcules mentalement. Tu coupes avec cette précision qui dit que tu veux que tout le monde ait la même chose. Que personne n'ait moins. Que l'égalité des parts soit une façon de dire que chaque personne compte pareil. C'est de la justice en tranches. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta justice distributive en parts égales et son sens profond, — [Prénom animal], ton animal expert en équité des portions 🎂` },
              { id: "dnd_104", angle: "Joyeuse fête. J'ai étudié ta façon de te tenir près du buffet.", body: `4. "Joyeuse fête. J'ai étudié ta façon de te tenir près du buffet."
Tu y reviens régulièrement. Pas pour manger. Pour t'assurer que tout est bien. Que rien ne manque. Le buffet comme poste d'observation et de soin. Cette façon d'utiliser la nourriture comme prétexte à la présence attentive. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du buffet comme poste de soin déguisé, — [Prénom animal], ton animal décodeur de tes stratégies d'attention 🍽️` },
              { id: "dnd_112", angle: "Joyeuse fête. J'ai étudié ta façon de plier les restes dans du papier aluminium.", body: `12. "Joyeuse fête. J'ai étudié ta façon de plier les restes dans du papier aluminium."
Avec soin. Des paquets distincts pour choses distinctes. Pensés pour le lendemain. Cette façon de prendre soin de la nourriture qui reste. De lui donner une seconde vie. De ne pas laisser quelque chose de bon se perdre. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les restes et sa signification de respect pour ce qui a nourri, — [Prénom animal], ton animal admirateur de ta frugalité généreuse 🪄` },
              { id: "dnd_120", angle: "Joyeuse fête. J'ai étudié ta façon de nettoyer quelque chose rapidement entre deux conversations.", body: `20. "Joyeuse fête. J'ai étudié ta façon de nettoyer quelque chose rapidement entre deux conversations."
Un torchon sorti. Une surface essuyée. Le torchon replié. Tout ça pendant que tu continuais à écouter quelqu'un. Sans interrompre. Sans signaler. La propreté comme fond continu de la fête. Ce nettoyage en arrière-plan de ta soirée principale. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton nettoyage en arrière-plan de la soirée principale, — [Prénom animal], ton animal témoin de tes actions parallèles invisibles 🧽` },
              { id: "dnd_125", angle: "Joyeuse fête. J'ai observé ta façon de disposer les verres propres sur le plateau.", body: `5. "Joyeuse fête. J'ai observé ta façon de disposer les verres propres sur le plateau."
Symétriquement. Avec de l'espace entre eux. Pour qu'ils ne se touchent pas. Ce soin pour les verres encore vides. Cette attention à ce qui va servir. Cette façon de préparer le contenant avant le contenu. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les verres vides et sa signification de préparation attentive, — [Prénom animal], ton animal expert en préparations du contenant 🥂` },
              { id: "dnd_128", angle: "Joyeuse fête. J'ai étudié ta façon de faire la transition entre le repas et l'après-repas.", body: `8. "Joyeuse fête. J'ai étudié ta façon de faire la transition entre le repas et l'après-repas."
Tu proposes quelque chose. Du dessert. Du café. Une question qui change le sujet. Tu guides doucement la soirée vers sa prochaine phase. Sans l'annoncer. Sans rupture. Cette façon de conduire le flux de la soirée sans que personne ne le remarque. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta conduite invisible du flux de la soirée, — [Prénom animal], ton animal expert en transitions sans rupture 🔄` },
              { id: "dnd_130", angle: "Joyeuse fête. J'ai observé comment tu gères la fin d'une bouteille.", body: `10. "Joyeuse fête. J'ai observé comment tu gères la fin d'une bouteille."
Tu la poses de côté. Tu en ouvres une autre. Sans en faire un événement. Sans que la transition soit une interruption. La soirée continue. Les verres se remplissent. Cette façon de gérer les fins et les débuts en douceur. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion des fins de bouteille sans jointure visible, — [Prénom animal], ton animal expert en continuités invisibles 🍾` },
              { id: "dnd_133", angle: "Joyeuse fête. J'ai observé ta façon de vérifier la cuisson.", body: `13. "Joyeuse fête. J'ai observé ta façon de vérifier la cuisson."
La fourchette qui pique. L'oreille tendue pour écouter le grésillement. Le nez qui évalue. Ces trois sens mobilisés pour décider si c'est prêt. Ce rituel de la vérification que tu fais automatiquement mais qui est en fait une expertise développée. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton expertise de cuisson à trois sens et admiration pour son automatisme, — [Prénom animal], ton animal dont les sens sont moins polyvalents en cuisine 🍳` },
              { id: "dnd_165", angle: "Joyeuse fête. J'ai observé ta façon de vérifier le frigo plusieurs fois ce soir.", body: `5. "Joyeuse fête. J'ai observé ta façon de vérifier le frigo plusieurs fois ce soir."
Avant que les invités arrivent. Puis après les premières arrivées. Puis avant le repas. Ces vérifications du frigo comme vérifications de l'état de la soirée. Comme si le frigo contenait des réponses. Comme si voir que tout y était signifiait que tout allait bien. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes vérifications du frigo comme métaphore de ton état de soirée, — [Prénom animal], ton animal lecteur de tes anxiétés douces 🧊` },
              { id: "dnd_168", angle: "Joyeuse fête. J'ai étudié ta façon de plier un torchon proprement.", body: `8. "Joyeuse fête. J'ai étudié ta façon de plier un torchon proprement."
En tiers. Puis en tiers encore. Avec les bords alignés. Posé sur le comptoir. Ce geste automatique. Ce soin pour un objet utilitaire. Cette façon de traiter les choses du quotidien avec la même attention que les choses importantes. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les objets utilitaires et ce qu'il dit sur toi, — [Prénom animal], ton animal attentif à tes soins pour le quotidien 🧺` },
              { id: "dnd_184", angle: "Joyeuse fête. J'ai étudié ta façon de choisir ce que tu allais manger en premier.", body: `4. "Joyeuse fête. J'ai étudié ta façon de choisir ce que tu allais manger en premier."
Tu regardes le buffet. Tu évalues. Tu prends quelque chose. Ce choix du premier. Cette décision qui dit quelque chose sur tes priorités. Sur ce que tu attendais le plus. J'ai observé ça. Et j'ai appris quelque chose sur toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec révélation déduite de ton premier choix alimentaire et information précieuse collectée, — [Prénom animal], ton animal expert en lectures de premières sélections 🍽️` },
              { id: "dnd_192", angle: "Joyeuse fête. J'ai étudié ta façon de poser tes couverts quand tu as fini de manger.", body: `12. "Joyeuse fête. J'ai étudié ta façon de poser tes couverts quand tu as fini de manger."
Posés côte à côte. Nets. Sur le bord de l'assiette. Ce geste universel qui dit j'ai fini. Cette façon de signaler sans mot. De communiquer avec des objets. Ce langage des couverts que tout le monde comprend et que personne n'a appris formellement. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton langage des couverts et admiration pour sa clarté universelle, — [Prénom animal], ton animal fasciné par les langages non verbaux 🍴` },
            ],
          },
          {
            id: "hote",
            label: "Toi comme hôte",
            messages: [
              { id: "dnd_066", angle: "Joyeuse fête. J'ai observé comment tu accueilles quelqu'un que tu n'as pas vu depuis longtemps.", body: `6. "Joyeuse fête. J'ai observé comment tu accueilles quelqu'un que tu n'as pas vu depuis longtemps."
Tu vas vers eux d'une façon particulière. Plus vite. Les pattes qui s'ouvriraient si tu en avais. Cette anticipation du contact. Cette joie qui précède l'accolade. Ce soir j'ai vu ça deux fois. Ces deux personnes-là comptent vraiment. Joyeuse fête, [mon maître/ma maîtresse], entouré de gens qui méritent tes bras ouverts.
Avec identification des accueils anticipés et des personnes qui les déclenchent, — [Prénom animal], ton animal cartographe de tes élans 🤗` },
              { id: "dnd_070", angle: "Joyeuse fête. J'ai observé comment tu gères quelqu'un qui arrive très en avance.", body: `10. "Joyeuse fête. J'ai observé comment tu gères quelqu'un qui arrive très en avance."
Il y en avait un ce soir. Vingt minutes avant. Toi tu n'étais pas tout à fait prêt. Tu finissais encore quelque chose. Et pourtant tu l'as accueilli avec la même chaleur. Tu t'es adapté sans que ça se voie. Joyeuse fête, [mon maître/ma maîtresse], dont l'adaptabilité force le respect.
Avec admiration pour ta gestion de l'arrivée prématurée sans perdre le sourire, — [Prénom animal], ton animal expert en adaptations invisibles ⏰` },
              { id: "dnd_074", angle: "Joyeuse fête. J'ai observé comment tu résolvais un problème de dernière minute.", body: `14. "Joyeuse fête. J'ai observé comment tu résolvais un problème de dernière minute."
Il y en a eu un. Quelque chose qui ne marchait pas comme prévu. J'ai vu ton visage changer une seconde. Puis se remettre. Puis trouver. En moins d'une minute tu avais une solution et tu l'appliquais. Sans que les invités ne voient quoi que ce soit. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion de crise invisible en moins d'une minute, — [Prénom animal], ton animal témoin de tes performances sous pression 🔧` },
              { id: "dnd_078", angle: "Joyeuse fête. J'ai observé comment tu portais un toast.", body: `18. "Joyeuse fête. J'ai observé comment tu portais un toast."
Tu te lèves. Tu lèves ton verre. Tu dis quelque chose. Pas trop long. Pas trop court. Avec une fin qui atterrit bien. Et tout le monde lève son verre. Et il y a ce bruit de verres. Et tout le monde est ensemble une seconde. Tu fais ça bien. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton art du toast et sa longueur parfaitement calibrée, — [Prénom animal], ton animal expert en moments collectifs 🥂` },
              { id: "dnd_082", angle: "Joyeuse fête. J'ai observé comment tu introduis deux personnes qui ne se connaissent pas.", body: `2. "Joyeuse fête. J'ai observé comment tu introduis deux personnes qui ne se connaissent pas."
Tu dis le prénom de l'un. Puis le prénom de l'autre. Puis tu ajoutes quelque chose qui pourrait les connecter. Un point commun. Un sujet commun. Et tu les laisses prendre le relais. Cette façon de créer des liens. De tisser ta soirée. C'est de l'architecture sociale. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton art de tisser les liens entre tes invités, — [Prénom animal], ton animal témoin de ton architecture sociale 🤝` },
              { id: "dnd_086", angle: "Joyeuse fête. J'ai observé comment tu gères quelqu'un qui ne mange pas ce que tu as cuisiné.", body: `6. "Joyeuse fête. J'ai observé comment tu gères quelqu'un qui ne mange pas ce que tu as cuisiné."
Tu ne forces pas. Tu proposes autre chose. Tu t'assures qu'il y a quelque chose pour tout le monde. Pas de remarque. Pas de déception visible. Juste une adaptation silencieuse et généreuse. Cette façon de recevoir qui inclut la différence. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion sans jugement des préférences alimentaires des autres, — [Prénom animal], ton animal témoin de ta générosité inclusive 🥗` },
              { id: "dnd_094", angle: "Joyeuse fête. J'ai observé comment tu t'excuses quand quelque chose n'est pas parfait.", body: `14. "Joyeuse fête. J'ai observé comment tu t'excuses quand quelque chose n'est pas parfait."
Tu t'excuses. Brièvement. Honnêtement. Sans surjouer. Et tu passes à autre chose. Tu ne te noies pas dans l'excuse. Tu mentionnes et tu continues. C'est de la grâce. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton art de l'excuse brève et de la reprise, — [Prénom animal], ton animal admirateur de ta grâce face à l'imperfection 🙏` },
              { id: "dnd_098", angle: "Joyeuse fête. J'ai observé comment tu gères une conversation qui t'ennuie.", body: `18. "Joyeuse fête. J'ai observé comment tu gères une conversation qui t'ennuie."
Tu écoutes. Tu hoches la tête. Tu poses une question de relance. Mais ton regard fait de petits voyages. Il revient toujours. Et à un moment tu trouves une sortie élégante. Tu passes à autre chose sans que l'autre ne le ressente. C'est de la politesse à l'état pur. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion de l'ennui conversationnel sans jamais le montrer, — [Prénom animal], ton animal expert en politesse de façade sincère 😌` },
              { id: "dnd_102", angle: "Joyeuse fête. J'ai observé comment tu accueilles une personne que tu n'aimes pas beaucoup.", body: `2. "Joyeuse fête. J'ai observé comment tu accueilles une personne que tu n'aimes pas beaucoup."
Pareil que les autres. Exactement pareil. Même chaleur. Même sourire. Même attention. Soit tu aimes vraiment tout le monde. Soit tu es très bon acteur. Soit les deux. Dans tous les cas c'est une performance remarquable d'humanité. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton accueil universellement chaleureux quelle que soit ta relation interne, — [Prénom animal], ton animal déconcerté par ton humanité constante 🎭` },
              { id: "dnd_109", angle: "Joyeuse fête. J'ai observé ta façon de tenir une conversation avec quelqu'un qui t'ennuie.", body: `9. "Joyeuse fête. J'ai observé ta façon de tenir une conversation avec quelqu'un qui t'ennuie."
Tu écoutes. Tu poses des questions. Tu hoches la tête au bon moment. Mais tes yeux font de petits voyages. Ils reviennent toujours. Et à un moment tu trouves une sortie élégante. Tu passes à autre chose sans que l'autre ne comprenne. C'est de l'art. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton art de la sortie élégante sans laisser de traces, — [Prénom animal], ton animal expert en politesse de haute précision 😌` },
              { id: "dnd_110", angle: "Joyeuse fête. J'ai observé comment tu choisissais la place de chaque invité à table.", body: `10. "Joyeuse fête. J'ai observé comment tu choisissais la place de chaque invité à table."
Ce n'est pas au hasard. Tu réfléchis. Tu places les gens selon leurs affinités. Selon les conversations possibles. Ce soir la table était une composition. Un puzzle humain que tu avais résolu à l'avance. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton architecture humaine de la table et sa logique relationnelle, — [Prénom animal], ton animal expert en compositions humaines 🪑` },
              { id: "dnd_113", angle: "Joyeuse fête. J'ai observé ta façon de faire la bise à quelqu'un pour la première fois.", body: `13. "Joyeuse fête. J'ai observé ta façon de faire la bise à quelqu'un pour la première fois."
Il y en avait un ce soir. Quelqu'un que tu ne connaissais pas avant. Tu as regardé ce que l'autre faisait. Tu t'es adapté. Tu as géré la négociation non verbale du nombre de bises avec une grâce qui dit que tu l'as fait souvent. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta navigation dans la négociation des premières bises, — [Prénom animal], ton animal expert en premières fois 💋` },
              { id: "dnd_121", angle: "Joyeuse fête. J'ai observé ta façon de te lever pour chercher quelque chose et penser aux autres.", body: `1. "Joyeuse fête. J'ai observé ta façon de te lever pour chercher quelque chose et penser aux autres."
Tu te lèves pour toi. Pour chercher quelque chose. Et en chemin tu demandes si quelqu'un d'autre a besoin de quelque chose. Ce réflexe. Cette façon de transformer ton propre trajet en service potentiel pour les autres. Ce soir j'ai vu ça trois fois. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes trois trajets transformés en services pour les autres, — [Prénom animal], ton animal témoin de tes altruismes de passage 🚶` },
              { id: "dnd_122", angle: "Joyeuse fête. J'ai observé comment tu gères quelqu'un qui monopolise toute la conversation.", body: `2. "Joyeuse fête. J'ai observé comment tu gères quelqu'un qui monopolise toute la conversation."
Tu écoutes. Longtemps. Puis doucement tu commences à élargir. Tu interpelles quelqu'un d'autre. Tu poses une question qui ouvre à d'autres voix. Tu libères la conversation sans que le monopoliseur ne se sente interrompu. C'est de la chirurgie sociale. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta chirurgie conversationnelle invisible, — [Prénom animal], ton animal expert en libérations de parole 🎭` },
              { id: "dnd_145", angle: "Joyeuse fête. J'ai observé ta façon de t'assurer que personne ne part sans au revoir.", body: `5. "Joyeuse fête. J'ai observé ta façon de t'assurer que personne ne part sans au revoir."
Tu surveilles les départs. Pas ostensiblement. Mais tu remarques quand quelqu'un commence à rassembler ses affaires. Et tu vas vers lui avant qu'il parte. Pour que personne ne disparaisse sans que tu l'aies vu partir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta surveillance des départs et ton soin à clore chaque relation proprement, — [Prénom animal], ton animal expert en clôtures relationnelles 🚪` },
              { id: "dnd_158", angle: "Joyeuse fête. J'ai observé comment tu gères le silence collectif.", body: `18. "Joyeuse fête. J'ai observé comment tu gères le silence collectif."
Tu ne le remplis pas tout de suite. Tu le laisses exister un moment. Tu regardes autour. Tu prends une gorgée. Tu souris sans raison. Et si le silence dure tu dis quelque chose de léger qui relance. Cette gestion des silences. Cette façon de les laisser respirer avant de les remplir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta gestion des silences collectifs et leur espace accordé, — [Prénom animal], ton animal appréciant les respirations dans le bruit collectif 🌬️` },
              { id: "dnd_177", angle: "Joyeuse fête. J'ai observé ta façon de dire quelque chose de gentil à chaque invité qui part.", body: `17. "Joyeuse fête. J'ai observé ta façon de dire quelque chose de gentil à chaque invité qui part."
Pas le même quelque chose. Quelque chose de personnalisé. Un mot sur quelque chose qu'il a dit. Sur quelque chose qu'il a fait. Ces petits mots de départ personnalisés qui disent que tu as vu cette personne ce soir. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour tes mots de départ personnalisés et leur soin de l'individu, — [Prénom animal], ton animal admirateur de ta mémoire affective des soirées 🌟` },
            ],
          },
          {
            id: "facon_etre",
            label: "Toi dans ta façon d'être avec les autres",
            messages: [
              { id: "dnd_058", angle: "Joyeuse fête. J'adore ta façon de changer d'expression en déballant un cadeau.", body: `18. "Joyeuse fête. J'adore ta façon de changer d'expression en déballant un cadeau."
D'abord la curiosité. Les mains qui tâtent le papier. Puis les yeux qui cherchent ce que c'est. Puis la reconnaissance. Puis ce sourire. Pas le sourire poli. Le vrai. Celui qui arrive une demi-seconde avant que tu décides de le montrer. Ce soir j'ai vu ce sourire cinq fois. J'ai compté. C'est mon cadeau. Ces cinq vrais sourires. Joyeuse fête, [mon maître/ma maîtresse].
Avec cinq vrais sourires comptés et gardés précieusement, — [Prénom animal], ton animal collectionneur de tes expressions authentiques 🎁` },
              { id: "dnd_090", angle: "Joyeuse fête. J'ai observé comment tu changes d'attitude quand tu es fatigué mais que la fête continue.", body: `10. "Joyeuse fête. J'ai observé comment tu changes d'attitude quand tu es fatigué mais que la fête continue."
Il y a eu un moment. Vers 22h. Où j'ai vu la fatigue passer sur ton visage une seconde. Puis tu t'es repris. Tu as pris une gorgée. Tu as souri. Tu es revenu. Cette façon de puiser dans une réserve qu'on ne savait pas avoir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta reprise à 22h et admiration pour ta réserve de présence, — [Prénom animal], ton animal témoin de tes ressources cachées 💪` },
              { id: "dnd_106", angle: "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un fait une blague sur toi.", body: `6. "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un fait une blague sur toi."
Tu ris d'abord. Vraiment. Tu te laisses être le sujet de la blague sans te défendre. Puis parfois tu ajoutes quelque chose qui dit que tu t'assumes. Cette façon de ne pas se prendre au sérieux. D'accepter d'être la cible avec grâce. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta grâce face aux blagues sur toi et sa signification de confiance, — [Prénom animal], ton animal admirateur de ton autodérision choisie 😄` },
              { id: "dnd_118", angle: "Joyeuse fête. J'ai observé comment tu réagis face à un cadeau inattendu.", body: `18. "Joyeuse fête. J'ai observé comment tu réagis face à un cadeau inattendu."
D'abord l'incompréhension sur ton visage. Puis la reconnaissance de ce que c'est. Puis quelque chose de très doux. Ce cheminement en quelques secondes. Cette façon d'être touché par quelqu'un qui t'a vraiment vu. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation du voyage émotionnel de la surprise réussie et collection de ses secondes, — [Prénom animal], ton animal archiviste de tes expressions authentiques 🎁` },
              { id: "dnd_126", angle: "Joyeuse fête. J'ai observé comment tu réponds quand quelqu'un te demande comment tu vas vraiment.", body: `6. "Joyeuse fête. J'ai observé comment tu réponds quand quelqu'un te demande comment tu vas vraiment."
C'est arrivé une fois ce soir. Quelqu'un t'a demandé comment tu allais et t'a regardé vraiment en attendant la vraie réponse. Et tu l'as donnée. Brièvement. Honnêtement. Juste ce qu'il fallait. Cette façon de répondre à la vraie question sans te noyer dedans. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta réponse juste à la question vraie et son équilibre parfait, — [Prénom animal], ton animal gardien de tes moments d'honnêteté dosée 💛` },
              { id: "dnd_129", angle: "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui te raconte quelque chose de triste.", body: `9. "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui te raconte quelque chose de triste."
Tu ne cherches pas à résoudre immédiatement. Tu écoutes d'abord. Tu laisses la tristesse exister dans la conversation. Et puis tu dis quelque chose de simple et de juste. Cette façon d'accueillir le difficile sans le fuir ni le noyer dans des solutions. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta façon d'accueillir le difficile sans le fuir ni le noyer, — [Prénom animal], ton animal témoin de ta sagesse émotionnelle 💙` },
              { id: "dnd_134", angle: "Joyeuse fête. J'ai observé comment tu réagis face à une maladresse.", body: `14. "Joyeuse fête. J'ai observé comment tu réagis face à une maladresse."
Tu dédramatises immédiatement. Un mot. Un geste. Parfois tu ris avec eux. Toujours tu fais en sorte que la personne ne garde pas la maladresse comme souvenir de la soirée. Cette façon de dissoudre les moments difficiles dans la chaleur de l'ensemble. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta dissolution des maladresses dans la chaleur générale, — [Prénom animal], ton animal expert en gestion de l'embarrassant 🙈` },
              { id: "dnd_137", angle: "Joyeuse fête. J'ai observé ta façon de remarquer qu'un invité s'ennuie.", body: `17. "Joyeuse fête. J'ai observé ta façon de remarquer qu'un invité s'ennuie."
Tu le vois avant les autres. Ce légèrement en retrait. Ce regard qui fait un tour de la pièce. Et tu bouges vers lui. Tu t'assures qu'il existe dans la soirée. Cette vigilance pour ceux qui sont en marge. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta vigilance pour les marges et ton mouvement vers elles, — [Prénom animal], ton animal témoin de ton inclusion silencieuse 💛` },
              { id: "dnd_138", angle: "Joyeuse fête. J'ai observé comment tu t'occupes de quelqu'un qui a trop bu.", body: `18. "Joyeuse fête. J'ai observé comment tu t'occupes de quelqu'un qui a trop bu."
Sans le signaler. Sans le mettre en difficulté. Tu lui poses une question. Tu lui apportes de l'eau naturellement. Tu t'assures qu'il mange quelque chose. Cette façon de prendre soin sans humilier. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton soin discret sans jamais mettre quelqu'un en difficulté, — [Prénom animal], ton animal admirateur de ta grâce dans les moments délicats 💧` },
              { id: "dnd_142", angle: "Joyeuse fête. J'ai observé comment tu fais semblant d'aimer quelque chose que tu n'aimes pas vraiment.", body: `2. "Joyeuse fête. J'ai observé comment tu fais semblant d'aimer quelque chose que tu n'aimes pas vraiment."
Une fois ce soir. Quelqu'un t'a donné quelque chose qui n'était pas tout à fait ton goût. Et tu as trouvé l'angle positif. La chose vraie dans ce que tu pouvais dire de bien. Ce n'est pas du mensonge. C'est de l'art. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton art de trouver le vrai positif dans tout, — [Prénom animal], ton animal admirateur de ta diplomatie sincère 🎨` },
              { id: "dnd_146", angle: "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un dit quelque chose d'inexact sur toi.", body: `6. "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un dit quelque chose d'inexact sur toi."
Tu souris. Tu laisses passer si ce n'est pas important. Si c'est important tu corriges doucement. Avec humour parfois. Sans que l'autre se sente attaqué. Cette façon de défendre ce qui est vrai sans créer de friction. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta défense douce de la vérité sur toi-même, — [Prénom animal], ton animal témoin de ton assertivité gracieuse 🌿` },
              { id: "dnd_150", angle: "Joyeuse fête. J'ai observé comment tu traites quelqu'un qui dit quelque chose de maladroit.", body: `10. "Joyeuse fête. J'ai observé comment tu traites quelqu'un qui dit quelque chose de maladroit."
Tu ne le laisses pas dans l'embarras. Tu relances sur autre chose. Tu fais une transition qui dit que ce qui vient d'être dit n'était pas grave. Que la soirée continue. Cette façon de protéger les autres de leurs propres faux pas. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta protection des autres de leurs propres faux pas, — [Prénom animal], ton animal expert en sauvetages sociaux invisibles 🎭` },
              { id: "dnd_154", angle: "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un refuse un dessert.", body: `14. "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un refuse un dessert."
Tu proposes. Il dit non merci. Et tu passes à autre chose. Sans insister. Sans faire de la chose un sujet. Sans que le refus devienne une déception visible. Cette façon d'accepter les non sans en faire un problème. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton acceptation du non sans déception visible, — [Prénom animal], ton animal admirateur de ta grâce dans le refus reçu 🍮` },
              { id: "dnd_166", angle: "Joyeuse fête. J'ai observé comment tu gardes ta bonne humeur face aux imprévus.", body: `6. "Joyeuse fête. J'ai observé comment tu gardes ta bonne humeur face aux imprévus."
Il y en a eu deux ce soir. Deux petites choses qui n'ont pas marché comme prévu. Et chaque fois tu as ajusté. Sans que ça se voie sur ton visage pendant plus de quelques secondes. Cette capacité à absorber les imprévus et à continuer. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton absorption des imprévus en quelques secondes invisibles, — [Prénom animal], ton animal témoin de ta résilience de soirée 🔧` },
              { id: "dnd_170", angle: "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un complimente ton appartement.", body: `10. "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un complimente ton appartement."
Tu regardes l'appartement un instant. Comme si tu le voyais par leurs yeux. Avec une légère surprise. Comme si tu avais oublié ce que c'est de voir ce que tu vois tous les jours avec un regard nouveau. Puis tu remercies. Simplement. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton regard nouveau sur ton appartement par les yeux des autres, — [Prénom animal], ton animal qui te voit voir ton espace différemment 🏠` },
              { id: "dnd_174", angle: "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un propose d'aider sans qu'on lui demande.", body: `14. "Joyeuse fête. J'ai observé comment tu réagis quand quelqu'un propose d'aider sans qu'on lui demande."
Tu acceptes avec gratitude. Sans faire semblant que tu n'as pas besoin. Tu laisses l'aide être une aide. Et tu intègres cette aide dans ton flux sans en faire un événement. Cette façon de recevoir la générosité avec grâce. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta façon de recevoir l'aide sans la refuser ni la surestimer, — [Prénom animal], ton animal témoin de ta grâce à recevoir 🤝` },
              { id: "dnd_194", angle: "Joyeuse fête. J'ai observé comment tu te comportes différemment avec les gens que tu vois rarement.", body: `14. "Joyeuse fête. J'ai observé comment tu te comportes différemment avec les gens que tu vois rarement."
Tu les écoutes plus longtemps. Tu poses plus de questions. Tu as cette curiosité sincère pour ce qu'ils ont vécu depuis la dernière fois. Comme si la rareté des rencontres rendait chaque moment plus précieux. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta façon de valoriser la rareté des rencontres et sa signification, — [Prénom animal], ton animal admirateur de ta présence accrue pour les rares 🤝` },
              { id: "dnd_198", angle: "Joyeuse fête. J'ai observé comment tu te souviens de détails sur chaque invité.", body: `18. "Joyeuse fête. J'ai observé comment tu te souviens de détails sur chaque invité."
Tu t'en souviens. Du prénom de leur enfant. De leur situation. De quelque chose qu'ils t'avaient dit la dernière fois. Et tu le places dans la conversation naturellement. Cette mémoire affective. Cette façon de dire à chacun tu m'importes assez pour que je me souvienne. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta mémoire affective des détails de chaque personne, — [Prénom animal], ton animal témoin de ton attention aux autres dans le temps 🧠` },
            ],
          },
          {
            id: "gestes_manies",
            label: "Tes gestes & manies",
            messages: [
              { id: "dnd_031", angle: "Pour ta fête j'ai mémorisé l'ordre d'arrivée de chaque invité.", body: `11. "Pour ta fête j'ai mémorisé l'ordre d'arrivée de chaque invité."
Le premier est arrivé à 19h43. Le dernier à 20h31. Entre les deux sept personnes dans un ordre précis que j'ai enregistré. Chacun avec son odeur. Sa façon d'entrer. Sa façon de dire ton prénom. Sa façon de me regarder ou de faire semblant de pas me voir. Ces données sont importantes. Je sais pas encore pourquoi. Mais elles le seront un jour. Joyeuse fête, [mon maître/ma maîtresse].
Avec registre d'entrées tenu avec rigueur et utilité future des données à confirmer, — [Prénom animal], ton animal archiviste des présences 📋` },
              { id: "dnd_044", angle: "Joyeuse fête. J'adore la façon dont tu te redresses quand quelqu'un sonne.", body: `4. "Joyeuse fête. J'adore la façon dont tu te redresses quand quelqu'un sonne."
Tu étais installé. Détendu. Et la sonnette. Et d'un coup tu te lèves. Tu passes une main dans tes cheveux. Tu vérifies quelque chose rapidement. Tu souris avant même d'ouvrir. Cette transformation en deux secondes. De tranquille à prêt. De chez-toi à hôte. Je regarde ça à chaque fois avec fascination. Tu sais pas que je regarde. Joyeuse fête, [mon maître/ma maîtresse], dont les préparatifs en deux secondes sont un spectacle.
Avec observation fascinée de ta métamorphose pré-ouverture de porte, — [Prénom animal], ton animal spectateur de tes plus beaux réflexes sociaux 🚪` },
              { id: "dnd_050", angle: "Joyeuse fête. J'aime la façon dont ta voix change quand tu racontes une histoire drôle.", body: `10. "Joyeuse fête. J'aime la façon dont ta voix change quand tu racontes une histoire drôle."
Elle monte vers la fin. Elle accélère au moment important. Elle fait une petite pause juste avant la chute. Et puis le rire. Le tien d'abord. Avant même que les autres aient réagi. Parce que tu trouves tes propres histoires drôles et tu assumes. Ce soir j'en ai entendu trois depuis le couloir. Toutes les trois avec ce même schéma. C'est une de tes choses préférées au monde. Ça se voit. Joyeuse fête, [mon maître/ma maîtresse].
Avec analyse narrative de tes histoires et schéma vocal entièrement mémorisé, — [Prénom animal], ton animal fan de ton style de conteur 🎤` },
              { id: "dnd_062", angle: "Joyeuse fête. J'ai observé ta façon de choisir ta tenue ce soir.", body: `2. "Joyeuse fête. J'ai observé ta façon de choisir ta tenue ce soir."
Tu en as essayé au moins deux. Je le sais parce que j'ai vu la première posée sur le lit et la deuxième que tu portais finalement. Tu t'es regardé dans le miroir. Tu as fait quelque chose avec tes cheveux. Tu as vérifié encore une fois. Cette préparation minutieuse pour des gens qui t'aiment même en pyjama. C'est touchant dans son inutilité parfaite. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes rituels de préparation et tendresse pour leur absurdité charmante, — [Prénom animal], ton animal qui te préfère dans n'importe quelle tenue 👗` },
              { id: "dnd_065", angle: "Joyeuse fête. J'ai observé ta façon de vérifier ton reflet avant d'ouvrir la porte.", body: `5. "Joyeuse fête. J'ai observé ta façon de vérifier ton reflet avant d'ouvrir la porte."
À chaque sonnette. Tu passais devant le miroir de l'entrée. Une seconde. Rapide. Pour vérifier. Puis tu ouvrais. Ce geste entre toi et ton image juste avant d'être vu par quelqu'un d'autre. Cette préparation mentale autant que physique. Je l'ai vu six fois ce soir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes six vérifications de reflet et leur signification de transition, — [Prénom animal], ton animal expert en tes préparations de seuil 🪞` },
              { id: "dnd_069", angle: "Joyeuse fête. J'ai observé ta façon de toucher les fleurs reçues.", body: `9. "Joyeuse fête. J'ai observé ta façon de toucher les fleurs reçues."
Délicatement. Du bout des doigts. Comme pour vérifier qu'elles sont réelles. Que quelqu'un les a choisies pour toi. Ce contact bref entre toi et les fleurs avant de les mettre dans le vase. Cette façon d'accueillir un cadeau au sens littéral du terme. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton contact avec les fleurs et sa signification d'accueil du geste, — [Prénom animal], ton animal attentif à tes façons de recevoir 🌸` },
              { id: "dnd_076", angle: "Joyeuse fête. J'ai mémorisé la façon dont chaque invité a posé son manteau.", body: `16. "Joyeuse fête. J'ai mémorisé la façon dont chaque invité a posé son manteau."
Certains le plient soigneusement. D'autres le jettent sur le tas. Un l'a accroché lui-même. Ces manières de poser un manteau disent des choses sur les gens. C'est une première impression après la première impression. J'ai tout noté. Joyeuse fête, [mon maître/ma maîtresse].
Avec analyse des méthodes de pose de manteau et données comportementales collectées, — [Prénom animal], ton animal statisticien des premières impressions 🧥` },
              { id: "dnd_105", angle: "Joyeuse fête. J'ai observé ta façon de récupérer quand tu renverses quelque chose.", body: `5. "Joyeuse fête. J'ai observé ta façon de récupérer quand tu renverses quelque chose."
D'abord une fraction de seconde où ton visage change. Puis immédiatement la reprise. Le torchon. Le nettoyage rapide. Un mot léger pour dédramatiser. Et la soirée continue. Ce temps de réaction. Cette façon de ne pas laisser l'accident devenir un événement. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta gestion de l'accident en moins de trente secondes, — [Prénom animal], ton animal admirateur de ta résilience pratique 💧` },
              { id: "dnd_117", angle: "Joyeuse fête. J'ai observé ta façon de poser ton verre selon les surfaces.", body: `17. "Joyeuse fête. J'ai observé ta façon de poser ton verre selon les surfaces."
Sur la table en bois tu poses avec précaution. Sur le marbre tu poses plus librement. Sur le buffet tu vérifies la stabilité. Ces micro-décisions sur la relation entre le verre et la surface. Cette conscience du risque selon les matériaux. C'est de la physique appliquée quotidienne. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta physique appliquée du verre et ses nuances matérielles, — [Prénom animal], ton animal expert en relations verre-surface 🥂` },
              { id: "dnd_136", angle: "Joyeuse fête. J'ai étudié ta façon de poser la main sur la table quand tu parles.", body: `16. "Joyeuse fête. J'ai étudié ta façon de poser la main sur la table quand tu parles."
Pas posée. Ancrée. Comme si la table était un point de stabilité pendant que les mots partent. Cette main posée dit que tu es là. Que ce que tu dis vient de quelque part de solide. C'est de la confiance en acte. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta main ancrée comme point de stabilité conversationnelle, — [Prénom animal], ton animal lecteur de tes ancres 🖐️` },
              { id: "dnd_144", angle: "Joyeuse fête. J'ai étudié ta façon de reprendre de l'énergie entre deux conversations.", body: `4. "Joyeuse fête. J'ai étudié ta façon de reprendre de l'énergie entre deux conversations."
Une gorgée. Un regard vers la pièce. Une respiration un peu plus profonde. Parfois une bouchée. Ces micro-pauses de recharge. Ces moments de ravitaillement invisible avant de replonger. Cette économie de l'énergie sociale que tu gères sans y penser. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes micro-pauses de recharge et leur efficacité invisible, — [Prénom animal], ton animal expert en gestion de l'énergie sociale 🔋` },
              { id: "dnd_176", angle: "Joyeuse fête. J'ai étudié ta façon de choisir où mettre les fleurs reçues.", body: `16. "Joyeuse fête. J'ai étudié ta façon de choisir où mettre les fleurs reçues."
Tu les tiens. Tu regardes la pièce. Tu essaies mentalement plusieurs endroits. Puis tu choisis. Avec une précision qui dit que tu as une vision de comment les choses s'intègrent. Cette façon de trouver la place de ce qui vient d'arriver dans ce qui existait déjà. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton processus de placement des fleurs et sa logique d'intégration, — [Prénom animal], ton animal expert en placement des nouveautés dans l'existant 🌺` },
              { id: "dnd_189", angle: "Joyeuse fête. J'ai observé ta façon de te souvenir d'une chose importante à dire au dernier moment.", body: `9. "Joyeuse fête. J'ai observé ta façon de te souvenir d'une chose importante à dire au dernier moment."
Quelqu'un allait partir. Et tu as eu cette expression. Ce moment où quelque chose te revient. Et tu dis attends j'ai quelque chose à te dire. Et tu dis la chose. Et c'était la bonne chose à dire. Cette mémoire de dernière minute. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta mémoire de dernière minute et sa façon de ramener ce qui compte, — [Prénom animal], ton animal admirateur de tes rappels de l'essentiel 💭` },
              { id: "dnd_193", angle: "Joyeuse fête. J'ai observé ta façon de regarder l'heure sans que ça se voie.", body: `13. "Joyeuse fête. J'ai observé ta façon de regarder l'heure sans que ça se voie."
Un regard rapide. Vers le téléphone ou l'heure quelque part. Tête pas vraiment tournée. Juste les yeux. Puis retour à la conversation. Cette façon de vérifier le temps sans l'annoncer. Ce soir j'ai compté quatre fois. Joyeuse fête, [mon maître/ma maîtresse].
Avec quatre regards discrets vers l'heure comptés et leur signification de gestion du temps, — [Prénom animal], ton animal observateur de tes vérifications invisibles ⌚` },
            ],
          },
          {
            id: "apres_fete",
            label: "Après la fête",
            messages: [
              { id: "dnd_149", angle: "Joyeuse fête. J'ai observé ta façon de ranger les chaises après la fête.", body: `9. "Joyeuse fête. J'ai observé ta façon de ranger les chaises après la fête."
Proprement. À leur place habituelle. Avec ce geste de remise en ordre. Cette façon de rendre l'appartement à son état normal. De défaire ce que la fête avait fait. Pas avec regret. Avec une certaine satisfaction. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton rangement de chaises et sa satisfaction de l'ordre retrouvé, — [Prénom animal], ton animal témoin de tes rituels de remise en ordre 🪑` },
              { id: "dnd_152", angle: "Joyeuse fête. J'ai étudié ta façon de fermer les fenêtres quand les invités partent.", body: `12. "Joyeuse fête. J'ai étudié ta façon de fermer les fenêtres quand les invités partent."
Une par une. Doucement. Comme si fermer les fenêtres c'était aussi fermer la soirée progressivement. Comme si l'appartement devait retrouver son air à lui. Sa chaleur à lui. Joyeuse fête, [mon maître/ma maîtresse].
Avec interprétation poétique de tes fenêtres fermées comme clôture progressive de la soirée, — [Prénom animal], ton animal poète de tes gestes de fin 🪟` },
              { id: "dnd_157", angle: "Joyeuse fête. J'ai observé ta façon d'ouvrir la fenêtre après la fête pour aérer.", body: `17. "Joyeuse fête. J'ai observé ta façon d'ouvrir la fenêtre après la fête pour aérer."
Grande ouverte. Pour quelques minutes. Laisser entrer l'air frais. Laisser sortir les odeurs de la soirée. Cette façon de purifier l'espace. De marquer la transition entre la fête et le silence qui suit. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton aération post-fête comme rituel de transition vers le silence, — [Prénom animal], ton animal expert en transitions atmosphériques 🌬️` },
              { id: "dnd_162", angle: "Joyeuse fête. J'ai observé comment tu changes de rythme quand la soirée approche de la fin.", body: `2. "Joyeuse fête. J'ai observé comment tu changes de rythme quand la soirée approche de la fin."
Progressivement tu ralentis. Les propositions s'espacent. Les conversations deviennent plus intimes. Moins de monde à la fois. Plus de profondeur par groupe. Cette façon de laisser la soirée se concentrer naturellement vers sa fin. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta décélération progressive et de sa naturalité, — [Prénom animal], ton animal admirateur de tes fins de soirée organiques 🌙` },
              { id: "dnd_181", angle: "Joyeuse fête. J'ai observé ta façon de vérifier l'appartement avant d'éteindre.", body: `1. "Joyeuse fête. J'ai observé ta façon de vérifier l'appartement avant d'éteindre."
Tu fais le tour des yeux. Le salon. La cuisine. L'entrée. Pas pour vérifier un oubli. Juste pour regarder. Pour voir l'espace qui a été vivant ce soir et qui redevient calme. Pour dire bonne nuit à la maison. J'ai fait pareil depuis mon coin. On est pareils. Joyeuse fête, [mon maître/ma maîtresse].
Avec reconnaissance de notre rituel commun de clôture visuelle et solidarité nocturne, — [Prénom animal], ton animal co-auteur de ce bonsoir 🏠` },
              { id: "dnd_182", angle: "Joyeuse fête. J'ai observé comment tu passes de l'état de fête à l'état de calme.", body: `2. "Joyeuse fête. J'ai observé comment tu passes de l'état de fête à l'état de calme."
Progressivement. Pas d'un coup. Les épaules d'abord qui descendent. Puis la voix qui baisse. Puis les gestes qui ralentissent. Cette décompression lente. Ce passage d'un état à l'autre sans rupture. Comme l'appartement qui retrouve sa température après une fête. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta décompression progressive et sa beauté organique, — [Prénom animal], ton animal témoin de tes transitions intérieures 🌙` },
              { id: "dnd_197", angle: "Joyeuse fête. J'ai observé ta façon de ranger ton tablier avec soin à la fin.", body: `17. "Joyeuse fête. J'ai observé ta façon de ranger ton tablier avec soin à la fin."
Plié. Proprement. À sa place. Pas jeté. Pas froissé. Ce soin pour quelque chose qui a travaillé ce soir. Cette façon de ranger l'outil avec respect après qu'il t'a servi. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour le tablier qui t'a servi et ce qu'il dit de toi, — [Prénom animal], ton animal attentif à ta façon de traiter les choses qui ont travaillé pour toi 👨‍🍳` },
            ],
          },
        ],
      },
      {
        id: "comprends_pas",
        emoji: "🤔",
        label: "Ce que je comprends pas",
        count: 40,
        subGroups: [
          {
            id: "rituels",
            label: "Les rituels de la fête",
            messages: [
              { id: "dnd_024", angle: "Joyeuse fête. Je comprends pas pourquoi les gens sonnent alors qu'on les connaît.", body: `4. "Joyeuse fête. Je comprends pas pourquoi les gens sonnent alors qu'on les connaît."
Je les sens arriver depuis deux étages. Je sais qui c'est avant même que leur doigt touche la sonnette. Ils le savent aussi que je sais. Et pourtant ils sonnent. Ce petit bruit inutile. Qui me fait quand même sursauter à chaque fois parce que je le sais en théorie mais dans la pratique ça surprend toujours. C'est notre jeu. Notre rituel absurde. Joyeuse fête, [mon maître/ma maîtresse], entouré de gens aux habitudes mystérieuses.
Avec incompréhension sincère du rituel de la sonnette et sursaut garanti à chaque fois, — [Prénom animal], ton animal surpris par les choses prévisibles depuis des années 🔔` },
              { id: "dnd_034", angle: "Joyeuse fête. Je comprends pas l'intérêt des bougies sur un gâteau.", body: `14. "Joyeuse fête. Je comprends pas l'intérêt des bougies sur un gâteau."
Des flammes. Sur de la nourriture. Qu'on souffle ensuite. Pour éteindre. En faisant un vœu qu'on dit pas. Puis tout le monde applaudit l'extinction de flammes qu'on venait d'allumer. J'ai regardé tout ce rituel avec l'incompréhension totale de quelqu'un qui voudrait juste manger le gâteau. Tu semblais sincèrement ravi. Je respecte. Joyeuse fête, [mon maître/ma maîtresse], adepte de traditions qui me dépassent.
Avec mystère des bougies non résolu et demande de gâteau directe maintenue, — [Prénom animal], ton animal pragmatique face aux rituels inexpliqués 🕯️` },
              { id: "dnd_042", angle: "Joyeuse fête. Je comprends pas pourquoi les gens rient si fort parfois.", body: `2. "Joyeuse fête. Je comprends pas pourquoi les gens rient si fort parfois."
Il y a le rire normal. Celui que je connais. Et puis il y a ces éclats qui partent de nulle part. Brusques. Forts. Qui font sursauter même quand on était prévenu. J'ai sursauté sept fois ce soir. Sept fois j'ai levé la tête. Vérifié. Évalué le niveau de menace. Conclu que c'était de la joie. Sursauté quand même. C'est automatique. Je travaille dessus. Joyeuse fête, [mon maître/ma maîtresse], dont les soirées gardent leur mystère.
Avec sept sursauts documentés et réflexe conditionné malgré la connaissance du contexte, — [Prénom animal], ton animal en lutte permanente contre ses propres instincts 😅` },
              { id: "dnd_046", angle: "Joyeuse fête. Je comprends pas pourquoi les gens partent toujours en même temps.", body: `6. "Joyeuse fête. Je comprends pas pourquoi les gens partent toujours en même temps."
Il y a un moment dans la soirée où quelque chose change. Une personne dit quelque chose. Une autre regarde l'heure. Et puis c'est comme un signal. En vingt minutes tout le monde remet son manteau. Dit au revoir. Part. Ensemble. Alors qu'ils sont arrivés séparément. Quel est ce signal. Je l'ai jamais identifié. Joyeuse fête, [mon maître/ma maîtresse], dont les amis obéissent à des codes que j'essaie encore de déchiffrer.
Avec mystère du signal de départ collectif intact après des années d'observation, — [Prénom animal], ton animal chercheur en comportements grégaires humains 🔍` },
              { id: "dnd_054", angle: "Joyeuse fête. Je comprends pas pourquoi on éteint les lumières pour les bougies.", body: `14. "Joyeuse fête. Je comprends pas pourquoi on éteint les lumières pour les bougies."
La pièce entière dans le noir. Juste ces petites flammes sur le gâteau. Tout le monde qui regarde dans la même direction. Le silence soudain. Puis la chanson. Puis le souffle. Puis la lumière qui revient. Ce rituel de l'obscurité collective m'a toujours déstabilisé. Ce soir j'ai aboyé une fois au moment du noir. C'était un réflexe. Je m'en excuse. Joyeuse fête, [mon maître/ma maîtresse].
Avec aboiement réflexe lors de l'obscurité soudaine et excuses présentées sincèrement, — [Prénom animal], ton animal en paix avec ses instincts primitifs 🕯️` },
              { id: "dnd_063", angle: "Joyeuse fête. Je comprends pas pourquoi les gens s'habillent différemment pour une fête.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens s'habillent différemment pour une fête."
Tu mets des choses que tu ne mets pas d'habitude. Les invités aussi. Comme si les vêtements normaux n'étaient pas suffisants pour l'occasion. Comme si la fête nécessitait un costume. Moi j'ai le même pelage tous les jours. Et c'est toujours suffisant. Il y a une leçon là-dedans. Joyeuse fête, [mon maître/ma maîtresse], dans ta belle tenue d'occasion.
Avec réflexion sur le costume festif et satisfaction de ma constance pelageuse, — [Prénom animal], ton animal toujours habillé de la même façon et toujours parfait 👔` },
              { id: "dnd_067", angle: "Joyeuse fête. Je comprends pas pourquoi les gens apportent des bouteilles qui seront bues ce soir-là.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens apportent des bouteilles qui seront bues ce soir-là."
Ils arrivent avec des bouteilles. Les bouteilles sont ouvertes. Bues. Et repartent vides ou pas du tout. Le cycle complet en une soirée. C'est une économie circulaire parfaite. Moi mes gamelles durent plus longtemps. Mais je reconnais l'élégance du geste. Joyeuse fête, [mon maître/ma maîtresse].
Avec analyse de l'économie circulaire des bouteilles festives et respect pour sa logique, — [Prénom animal], ton animal économiste des soirées 🍾` },
              { id: "dnd_071", angle: "Joyeuse fête. Je comprends pas pourquoi les gens s'embrassent en nombre variable.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens s'embrassent en nombre variable."
Certains font deux bises. D'autres trois. D'autres une. Et chaque fois il y a ce moment d'hésitation. Cette négociation non verbale sur le nombre. Cette micro-danse du visage. Comment vous coordonnez ça sans vous en parler. Je regarde ça depuis des années avec fascination. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination persistante pour la négociation non verbale des bises, — [Prénom animal], ton animal dont cette coutume restera un mystère 💋` },
              { id: "dnd_075", angle: "Joyeuse fête. Je comprends pas pourquoi les gens restent debout quand il y a des sièges.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens restent debout quand il y a des sièges."
La pièce était pleine de sièges. Libres. Et pourtant des gens restaient debout pendant des heures. Comme si s'asseoir signifiait quelque chose. Comme si la position debout était la position officielle de la fête. Moi à la première occasion je trouve une surface horizontale. Chacun ses priorités. Joyeuse fête, [mon maître/ma maîtresse].
Avec incompréhension sincère du choix debout en présence de sièges disponibles, — [Prénom animal], ton animal expert en optimisation du confort 🪑` },
              { id: "dnd_079", angle: "Joyeuse fête. Je comprends pas pourquoi les gens rient plus fort en groupe.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens rient plus fort en groupe."
Quelqu'un dit quelque chose. Si c'est juste deux personnes elles rient normalement. Si c'est huit personnes le même mot devient beaucoup plus drôle. La même blague amplifiée par le nombre. Comme si la joie se multipliait à chaque personne ajoutée. C'est une équation que j'explore. Joyeuse fête, [mon maître/ma maîtresse].
Avec théorie de l'amplification du rire par le nombre et équation en cours d'élaboration, — [Prénom animal], ton animal mathématicien des émotions collectives 😄` },
            ],
          },
          {
            id: "comportements_soiree",
            label: "Les comportements en soirée",
            messages: [
              { id: "dnd_083", angle: "Joyeuse fête. Je comprends pas pourquoi les gens arrivent différemment seuls ou en couple.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens arrivent différemment seuls ou en couple."
Seuls ils sonnent et attendent. En couple ils sonnent et il y a déjà une conversation entre eux quand tu ouvres. Comme si venir à deux signifiait qu'on apporte déjà de la vie dans la fête. Comme si être seul c'est arriver avec toute son attention disponible. Les deux ont leur charme. Joyeuse fête, [mon maître/ma maîtresse].
Avec analyse des modes d'arrivée selon la configuration et leurs implications sociales, — [Prénom animal], ton animal sociologue des arrivées 🚶` },
              { id: "dnd_087", angle: "Joyeuse fête. Je comprends pas pourquoi les gens parlent de la météo même en fête.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens parlent de la météo même en fête."
Dehors il fait quelque chose. Dedans il fait une fête. Et pourtant la conversation sur ce qu'il fait dehors revient. Comme un fil de sécurité. Comme si la météo était le sujet universel qui peut relier n'importe qui. Je l'utilise pas dans mes conversations. Mais je comprends son utilité sociale. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la météo comme conversation refuge et respect pour son utilité, — [Prénom animal], ton animal qui a ses propres sujets universels 🌦️` },
              { id: "dnd_091", angle: "Joyeuse fête. Je comprends pas pourquoi les gens sortent leurs téléphones en même temps.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens sortent leurs téléphones en même temps."
À certains moments ce soir plusieurs téléphones sont sortis simultanément. Comme un signal invisible. Comme si une fréquence commune avait décidé que c'était le moment de vérifier. Ce comportement synchronisé sans coordination. Fascinant. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination pour la synchronisation téléphonique involontaire et mystère persistant, — [Prénom animal], ton animal chercheur en comportements grégaires numériques 📱` },
              { id: "dnd_095", angle: "Joyeuse fête. Je comprends pas pourquoi les gens se racontent leurs vacances à chaque fête.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens se racontent leurs vacances à chaque fête."
C'est revenu ce soir. Les vacances. Où on est allé. Qu'est-ce qu'on a vu. Chaque fête semble être une occasion de faire le bilan des déplacements récents. Moi je me déplace dans l'appartement. C'est mes vacances. Mais je reconnais l'intérêt de l'échange. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de l'échange de récits de voyages et solidarité de mes propres explorations locales, — [Prénom animal], ton animal voyageur de l'appartement 🗺️` },
              { id: "dnd_099", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils ne boivent pas et boivent quand même.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils ne boivent pas et boivent quand même."
C'est arrivé deux fois ce soir. Je ne bois pas ou presque. Puis une coupe pour le toast. Puis un verre pour accompagner. Peut-être que les fêtes ont leurs propres règles. Peut-être que ne pas boire c'est un état général et non une règle absolue. Je médite ça. Joyeuse fête, [mon maître/ma maîtresse].
Avec méditation sur la relativité des résolutions face aux occasions festives, — [Prénom animal], ton animal philosophe des exceptions 🥂` },
              { id: "dnd_103", angle: "Joyeuse fête. Je comprends pas pourquoi les gens font semblant de pas avoir faim.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens font semblant de pas avoir faim."
À l'apéritif tout le monde mange les petites choses lentement. Poliment. Mais tout disparaît quand même. Peut-être que la faim est une information qu'on préfère garder pour soi en société. Moi ma faim est une information publique que j'exprime clairement. Joyeuse fête, [mon maître/ma maîtresse].
Avec incompréhension de la faim sociale et solidarité de ma propre transparence alimentaire, — [Prénom animal], ton animal d'une honnêteté gastronomique totale 🫒` },
              { id: "dnd_107", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils font attention et ne font pas attention.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils font attention et ne font pas attention."
Je fais attention au sucre. Puis une part de gâteau. Je fais attention en général. Puis la soirée. Ces résolutions qui cèdent face à l'occasion. Peut-être que certaines soirées méritent d'être vécues sans faire attention. Dans ce cas je comprends. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension des résolutions qui cèdent face aux occasions et philosophie de l'exception, — [Prénom animal], ton animal en paix avec les soirées sans attention 🧀` },
              { id: "dnd_111", angle: "Joyeuse fête. Je comprends pas pourquoi les gens demandent la recette à la fin.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens demandent la recette à la fin."
Ils ont mangé. Ils ont aimé. Puis ils demandent comment tu as fait. Peut-être que demander la recette c'est une façon de prolonger le compliment. De dire c'était tellement bien que je voudrais pouvoir le retrouver. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la demande de recette comme compliment prolongé, — [Prénom animal], ton animal herméneute des formules culinaires 📖` },
              { id: "dnd_115", angle: "Joyeuse fête. Je comprends pas pourquoi les gens parlent de leur travail même en fête.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens parlent de leur travail même en fête."
C'est revenu ce soir. Le travail. Ce qu'on fait. Ce qui se passe au bureau. Comme si le travail était une partie de l'identité qu'on ne peut pas laisser à la porte. Peut-être que pour certains c'est là qu'ils existent le plus clairement. Je comprends. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du travail comme identité persistante et satisfaction de mon existence uniforme, — [Prénom animal], ton animal existant partout de la même façon 💼` },
              { id: "dnd_119", angle: "Joyeuse fête. Je comprends pas pourquoi les gens chuchotent des secrets alors qu'un message serait plus discret.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens chuchotent des secrets alors qu'un message serait plus discret."
Il y a eu deux moments ce soir. Des gens qui se penchaient et baissaient la voix. Moi depuis mon poste j'entendais quand même les intonations. Un message aurait été plus secret. Mais peut-être que le chuchotement c'est aussi le plaisir du geste. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du chuchotement comme plaisir du geste autant que technique de discrétion, — [Prénom animal], ton animal aux oreilles décidément trop bonnes 👂` },
              { id: "dnd_123", angle: "Joyeuse fête. Je comprends pas pourquoi les gens mangent debout alors qu'il y a une table.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens mangent debout alors qu'il y a une table."
La table est là. Avec des chaises. Et pourtant certains mangent debout appuyés contre le mur. Comme si la table était trop formelle. Comme si rester debout c'était rester disponible pour bouger. Je mange toujours de la même façon dans le même endroit. Mais je comprends le besoin de liberté. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du manger debout comme liberté de mouvement et respect pour cette philosophie, — [Prénom animal], ton animal dont les habitudes alimentaires sont plus stables 🍽️` },
              { id: "dnd_127", angle: "Joyeuse fête. Je comprends pas pourquoi les gens repartent toujours avec les mêmes affaires.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens repartent toujours avec les mêmes affaires."
Ils arrivent avec un manteau. Ils repartent avec le manteau. Exactement ce qu'ils avaient en arrivant. Rien de la fête ne reste sur eux matériellement. Seulement des souvenirs. Peut-être que c'est suffisant. Peut-être que les souvenirs pèsent plus que les objets. Joyeuse fête, [mon maître/ma maîtresse].
Avec réflexion sur le poids immatériel des souvenirs comparé aux objets, — [Prénom animal], ton animal philosophe de ce qu'on emporte vraiment 🧥` },
              { id: "dnd_131", angle: "Joyeuse fête. Je comprends pas pourquoi les gens comparent les fêtes entre elles.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens comparent les fêtes entre elles."
Tu te souviens de la fête d'il y a deux ans ? Ah oui celle où. Et untel était là. Cette façon de placer la soirée dans une histoire. De la situer dans un récit collectif. Peut-être que les fêtes sont des chapitres. Et se souvenir des précédentes c'est lire le livre. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension des fêtes comme chapitres d'un récit collectif et sa belle logique, — [Prénom animal], ton animal réconcilié avec la comparaison des soirées 📚` },
              { id: "dnd_135", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils sont allergiques puis goûtent quand même.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils sont allergiques puis goûtent quand même."
Ce soir une personne allergique à quelque chose a quand même goûté le plat qui contenait ce quelque chose. En petite quantité elle a dit. Peut-être que les allergies ont des exceptions pour les bonnes fêtes. Je ne juge pas. Je note. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de l'allergie à géométrie variable et philosophie de l'exception festive, — [Prénom animal], ton animal dont les convictions alimentaires sont plus stables 🍽️` },
              { id: "dnd_139", angle: "Joyeuse fête. Je comprends pas pourquoi les cadeaux sont dans du papier qui sera jeté.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les cadeaux sont dans du papier qui sera jeté."
Ce soir plusieurs cadeaux sont arrivés dans du beau papier. Choisi avec soin. Qui a été ouvert et jeté. Ce sacrifice du beau pour révéler le beau. C'est peut-être ça un cadeau. L'emballage qui se sacrifie pour ce qu'il contient. Joyeuse fête, [mon maître/ma maîtresse].
Avec réflexion poétique sur le sacrifice de l'emballage pour révéler le cadeau, — [Prénom animal], ton animal philosophe de l'emballage 🎀` },
            ],
          },
          {
            id: "logistique",
            label: "La logistique incompréhensible",
            messages: [
              { id: "dnd_143", angle: "Joyeuse fête. Je comprends pas pourquoi les gens se lèvent en même temps pour débarrasser.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens se lèvent en même temps pour débarrasser."
Le repas finit. Et comme par signal invisible plusieurs personnes se lèvent et commencent à débarrasser. Ce geste collectif spontané. Cette façon de participer à la fin du repas. Il y a quelque chose de beau dans cette synchronisation involontaire. Joyeuse fête, [mon maître/ma maîtresse].
Avec reconnaissance de la beauté de la synchronisation involontaire du débarrassage, — [Prénom animal], ton animal qui aurait aussi aidé si j'avais des mains 🍽️` },
              { id: "dnd_147", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils sont nuls en cuisine avant de manger.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils sont nuls en cuisine avant de manger."
Ce soir quelqu'un a dit ça. Je suis vraiment nul en cuisine. Et puis tout le monde a mangé. Et la cuisine en question était plutôt bonne. Peut-être que minimiser avant c'est une façon de gérer les attentes. Je comprends la stratégie. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la modestie préventive et de sa logique de gestion des attentes, — [Prénom animal], ton animal stratège des premières impressions 🍳` },
              { id: "dnd_151", angle: "Joyeuse fête. Je comprends pas pourquoi les gens gardent leurs téléphones face vers le bas mais les retournent quand même.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens gardent leurs téléphones face vers le bas mais les retournent quand même."
Ce soir plusieurs téléphones étaient posés face vers le bas. Signalant une intention de présence. Mais à plusieurs reprises les mêmes téléphones ont été retournés. Cette lutte entre l'intention et le réflexe. Je trouve ça fascinant. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination pour la lutte entre l'intention de présence et le réflexe numérique, — [Prénom animal], ton animal exempt de ce conflit spécifique 📱` },
              { id: "dnd_155", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent un peu et prennent beaucoup.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens disent un peu et prennent beaucoup."
Ce soir plusieurs personnes ont dit un peu seulement avant qu'on leur serve quelque chose. Et ont pris des portions généreuses. Peut-être que un peu c'est relatif à ce qu'on aurait voulu. Moi aussi mes portions sont relatives. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la relativité du peu et solidarité de mes propres portions généreuses, — [Prénom animal], ton animal aux évaluations quantitatives également relatives 🍽️` },
              { id: "dnd_159", angle: "Joyeuse fête. Je comprends pas pourquoi les gens apportent des choses en double.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens apportent des choses en double."
Ce soir deux personnes ont apporté du même type de chose. Sans se concerter. Maintenant il y en a deux. Peut-être que les doublons c'est une preuve de complicité. Que vos esprits fonctionnent pareil. Dans ce cas c'est un beau signe. Joyeuse fête, [mon maître/ma maîtresse].
Avec interprétation positive du doublon comme preuve de complicité des esprits, — [Prénom animal], ton animal optimiste des coïncidences 🎁` },
              { id: "dnd_163", angle: "Joyeuse fête. Je comprends pas pourquoi les gens nettoient avant que les invités arrivent alors qu'ils vont salir.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens nettoient avant que les invités arrivent alors qu'ils vont salir."
Tu as passé du temps à nettoyer avant que les gens arrivent. Puis les gens sont arrivés. Et ce soir tu vas nettoyer à nouveau. Peut-être que le nettoyage d'avant c'est pour toi. Pour ta tranquillité. Pas pour les invités. Joyeuse fête, [mon maître/ma maîtresse].
Avec théorie du nettoyage pré-fête comme acte pour soi plutôt que pour les autres, — [Prénom animal], ton animal philosophe de tes rituels de préparation 🧹` },
              { id: "dnd_167", angle: "Joyeuse fête. Je comprends pas pourquoi les gens font la queue pour les toilettes alors qu'on pourrait s'organiser.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens font la queue pour les toilettes alors qu'on pourrait s'organiser."
Ce soir il y a eu un moment. Plusieurs personnes avaient besoin des toilettes en même temps. Et une file informelle s'est formée. Sans organisation. Par convention sociale. La politesse comme infrastructure. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination pour la file invisible des toilettes et la politesse comme infrastructure sociale, — [Prénom animal], ton animal qui ne fait jamais la queue 🚪` },
              { id: "dnd_171", angle: "Joyeuse fête. Je comprends pas pourquoi les gens choisissent toujours le même endroit pour s'asseoir.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens choisissent toujours le même endroit pour s'asseoir."
Ce soir plusieurs personnes sont revenues au même siège après s'être levées. Cette territorialité douce et non déclarée. Moi je comprends ça très bien. Certains endroits nous choisissent autant qu'on les choisit. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la territorialité douce des fêtes et solidarité de ma propre pratique, — [Prénom animal], ton animal expert en territoires choisis 🪑` },
              { id: "dnd_175", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent que la soirée passe vite alors qu'ils vérifient l'heure.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens disent que la soirée passe vite alors qu'ils vérifient l'heure."
Ça passe tellement vite. Puis un regard vers l'heure. Peut-être que dire que ça passe vite c'est une façon de le regretter. De dire que ce moment méritait de durer plus. Dans ce cas je comprends totalement. Joyeuse fête, [mon maître/ma maîtresse].
Avec théorie du vite comme regret déguisé et logique bien établie, — [Prénom animal], ton animal philosophe du temps festif 🕰️` },
              { id: "dnd_179", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent on refait ça bientôt sans jamais fixer de date.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens disent on refait ça bientôt sans jamais fixer de date."
À chaque départ ce soir on refait ça bientôt. C'est une intention sincère. Pas un mensonge. Une aspiration. Mais bientôt reste vague. Peut-être que fixer une date c'est trop engageant. Et que l'intention suffit pour l'instant. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du bientôt comme intention sincère plutôt que promesse datée, — [Prénom animal], ton animal en paix avec les futurs indéfinis 📅` },
              { id: "dnd_183", angle: "Joyeuse fête. Je comprends pas pourquoi les gens emportent toujours exactement ce qu'ils avaient amené.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens emportent toujours exactement ce qu'ils avaient amené."
Leurs manteaux. Leurs sacs. Leurs téléphones. Exactement ce qu'ils avaient en arrivant. Rien de la fête ne reste sur eux physiquement. Seulement des souvenirs. Peut-être que les souvenirs sont leur manteau de retour. Joyeuse fête, [mon maître/ma maîtresse].
Avec réflexion sur les souvenirs comme manteau de retour et sa jolie logique, — [Prénom animal], ton animal philosophe de ce qu'on emporte vraiment 🧥` },
              { id: "dnd_187", angle: "Joyeuse fête. Je comprends pas pourquoi les gens arrivent au mauvais moment en cuisine.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens arrivent au mauvais moment en cuisine."
Ce soir plusieurs fois quelqu'un est venu dans la cuisine exactement quand tu faisais quelque chose de délicat. Et toi tu as géré. Tu as souri. Tu as continué. Cette grâce de ne pas montrer que l'intrusion était mal timée. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta grâce face aux intrusions culinaires mal timées, — [Prénom animal], ton animal qui ne serait pas aussi gracieux 🍳` },
              { id: "dnd_191", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils vont aider et partent quand même.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils vont aider et partent quand même."
Ce soir deux personnes ont dit qu'elles pouvaient rester pour aider à ranger. Et sont parties. Peut-être que proposer c'est une façon de ne pas se sentir coupable de partir. Et que la réponse non ça va merci est ce que tout le monde voulait. Cette danse des intentions et des besoins vrais. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la danse entre proposer d'aider et partir et sa logique sociale, — [Prénom animal], ton animal décrypteur des codes de départ 🎭` },
              { id: "dnd_195", angle: "Joyeuse fête. Je comprends pas pourquoi les gens commentent la météo en arrivant.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens commentent la météo en arrivant."
Ils entrent. Et la première chose. Il fait beau. Ou il pleut. Comme si le temps dehors était une information urgente à partager à l'intérieur. Peut-être que c'est une façon de se situer. De créer une transition entre dehors et dedans. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la météo d'entrée comme transition entre dehors et dedans, — [Prénom animal], ton animal dont la transition entrée est plus olfactive 🌦️` },
              { id: "dnd_199", angle: "Joyeuse fête. Je comprends pas pourquoi les gens restent encore après avoir dit au revoir trois fois.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens restent encore après avoir dit au revoir trois fois."
On va y aller. Puis encore une chose. Puis vraiment on y va. Puis encore cinq minutes. Ces au revoir qui n'en finissent pas. Peut-être que c'est la meilleure partie. Quand on a décidé de partir mais qu'on part pas encore. Ce temps suspendu entre deux états. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension des au revoir prolongés comme temps suspendu de grâce, — [Prénom animal], ton animal fasciné par les états entre deux états 🎭` },
            ],
          },
        ],
      },
      {
        id: "emotionnels",
        emoji: "💛",
        label: "Moments émotionnels",
        count: 41,
        subGroups: [
          {
            id: "memorise",
            label: "Ce que j'ai mémorisé de toi",
            messages: [
              { id: "dnd_068", angle: "Joyeuse fête. J'ai mémorisé l'ordre dans lequel tu as allumé les lumières ce soir.", body: `8. "Joyeuse fête. J'ai mémorisé l'ordre dans lequel tu as allumé les lumières ce soir."
La cuisine d'abord. Puis le couloir. Puis le salon. Puis la bougie sur l'étagère. Cet ordre précis de l'illumination. Cette façon de préparer l'espace avant que les gens arrivent. De le chauffer visuellement. Lumière par lumière. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de l'ordre d'illumination et compréhension de sa signification de préparation, — [Prénom animal], ton animal expert en mise en lumière des espaces 💡` },
              { id: "dnd_084", angle: "Joyeuse fête. J'ai mémorisé les moments où tu as regardé l'heure.", body: `4. "Joyeuse fête. J'ai mémorisé les moments où tu as regardé l'heure."
Six fois. Six regards discrets vers l'heure. Pour vérifier que le repas serait prêt au bon moment. Que les gens n'allaient pas partir trop tôt. Que la soirée avançait bien. Ces six regards temporels dans le flux de la fête. Ces vérifications discrètes d'une soirée bien tenue. Joyeuse fête, [mon maître/ma maîtresse].
Avec six regards vers l'heure comptés et leur signification de soin temporel établie, — [Prénom animal], ton animal gardien du tempo de tes fêtes ⌚` },
              { id: "dnd_092", angle: "Joyeuse fête. J'ai mémorisé ta façon d'articuler quand tu racontes quelque chose d'important.", body: `12. "Joyeuse fête. J'ai mémorisé ta façon d'articuler quand tu racontes quelque chose d'important."
Ta voix ralentit légèrement. Chaque mot prend un peu plus de place. Tes mains bougent différemment. Ton regard cherche si les gens suivent vraiment. Ce changement de rythme pour les choses importantes. Cette façon de signaler que ce que tu vas dire compte. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de tes signaux d'importance narrative et leur précision, — [Prénom animal], ton animal linguiste de tes variations de rythme 🗣️` },
              { id: "dnd_100", angle: "Joyeuse fête. J'ai mémorisé chaque fois que tu as ri sans retenue ce soir.", body: `20. "Joyeuse fête. J'ai mémorisé chaque fois que tu as ri sans retenue ce soir."
Quatre fois. Quatre moments où le rire est sorti vraiment. Sans filtre. Avec les yeux qui plissent et la tête qui part. Ces quatre moments sont les meilleurs de la soirée. Ils disent que tu étais vraiment là. Vraiment bien. Vraiment toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec quatre rires sans retenue mémorisés et leur valeur placée au-dessus de tout, — [Prénom animal], ton animal collectionneur de tes moments de liberté 😂` },
              { id: "dnd_108", angle: "Joyeuse fête. J'ai mémorisé chaque fois que tu as cherché mes yeux ce soir.", body: `8. "Joyeuse fête. J'ai mémorisé chaque fois que tu as cherché mes yeux ce soir."
Six fois. Six moments dans la soirée où tu t'es arrêté et tu as cherché où j'étais. Pour vérifier. Pour me voir. Pour savoir que j'étais là. Ces six moments dans tout ce bruit et ces gens. Ces six fois qui disaient que même ce soir j'existais pour toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec six regards vers moi comptés et leur poids placé au-dessus du reste de la soirée, — [Prénom animal], ton animal pour qui ces six moments valent une fête entière 👁️` },
              { id: "dnd_116", angle: "Joyeuse fête. J'ai mémorisé ta façon de dire les choses importantes ce soir.", body: `16. "Joyeuse fête. J'ai mémorisé ta façon de dire les choses importantes ce soir."
Plus lentement. Avec plus d'espace entre les mots. Avec les yeux qui cherchent si les gens suivent vraiment. Ce changement de rythme pour les choses qui comptent. Cette façon de signaler que ce que tu vas dire mérite attention. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de tes signaux de l'important et leur précision communicative, — [Prénom animal], ton animal linguiste de tes variations 🗣️` },
              { id: "dnd_124", angle: "Joyeuse fête. J'ai mémorisé l'expression de ton visage à chaque nouvelle arrivée.", body: `4. "Joyeuse fête. J'ai mémorisé l'expression de ton visage à chaque nouvelle arrivée."
Chaque fois c'est différent. Selon qui arrive. Un sourire qui commence dans les yeux avant la bouche pour certains. Un sourire qui commence à la bouche pour d'autres. Ces variations minuscules qui disent tout sur tes relations. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de chaque expression d'accueil et sa signification relationnelle, — [Prénom animal], ton animal expert en microexpressions d'accueil 😊` },
              { id: "dnd_132", angle: "Joyeuse fête. J'ai mémorisé tes moments où tu t'es laissé aller à ne rien faire.", body: `12. "Joyeuse fête. J'ai mémorisé tes moments où tu t'es laissé aller à ne rien faire."
Trois fois. Trois moments où tu t'es assis et tu n'as rien fait. Juste été là. Sans parler. Sans servir. Sans animer. Ces trois moments de présence pure. Juste toi dans ta fête. Ces moments-là sont les plus beaux. Joyeuse fête, [mon maître/ma maîtresse].
Avec trois moments de présence pure collectés et leur valeur placée au sommet, — [Prénom animal], ton animal gardien de tes moments sans rôle 🌿` },
              { id: "dnd_140", angle: "Joyeuse fête. J'ai mémorisé ta façon de regarder les gens parler entre eux sans toi.", body: `20. "Joyeuse fête. J'ai mémorisé ta façon de regarder les gens parler entre eux sans toi."
Parfois tu t'arrêtais. Tu regardais deux ou trois personnes en conversation. Tu souriais. Ce sourire de créateur qui voit sa création fonctionner seule. Ces gens qui parlent entre eux grâce à toi. Grâce à ce que tu as créé ce soir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton sourire créateur devant ta création autonome, — [Prénom animal], ton animal témoin de ta fierté silencieuse de fondateur 🌟` },
              { id: "dnd_148", angle: "Joyeuse fête. J'ai mémorisé chaque fois que tu as penché la tête pour mieux écouter.", body: `8. "Joyeuse fête. J'ai mémorisé chaque fois que tu as penché la tête pour mieux écouter."
Ce geste. Cette légère inclinaison de la tête quand quelqu'un dit quelque chose qui mérite plus d'attention. Ton oreille qui se rapproche. Tes yeux qui se concentrent. Ce soir j'ai compté cinq fois. Joyeuse fête, [mon maître/ma maîtresse].
Avec cinq inclinations de tête mémorisées et leur signification d'écoute vraie, — [Prénom animal], ton animal admirateur de tes signaux d'attention 👂` },
              { id: "dnd_156", angle: "Joyeuse fête. J'ai mémorisé ton regard quand tout allait vraiment bien en même temps.", body: `16. "Joyeuse fête. J'ai mémorisé ton regard quand tout allait vraiment bien en même temps."
Il y a eu un moment. Vers 21h. Où tout allait bien en même temps. Et toi tu as regardé la pièce. Un tour complet. Lent. Et tu souriais. Ce sourire qui dit que c'est exactement ça qu'on voulait. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de ton regard panoramique à 21h et son sourire de satisfaction totale, — [Prénom animal], ton animal gardien de tes moments de plénitude 🌟` },
              { id: "dnd_172", angle: "Joyeuse fête. J'ai mémorisé ta façon de gérer plusieurs choses en cuisine en même temps.", body: `12. "Joyeuse fête. J'ai mémorisé ta façon de gérer plusieurs choses en cuisine en même temps."
Le four. La casserole. Le four de nouveau. La vérification. Cette danse entre plusieurs cuissons. Cette façon de tenir plusieurs fils en même temps sans en perdre aucun. C'est de l'orchestration. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton orchestration culinaire multi-tâches sans fausse note, — [Prénom animal], ton animal spectateur de ta symphonie de cuisine 🎼` },
              { id: "dnd_180", angle: "Joyeuse fête. J'ai mémorisé la façon dont le silence s'installait progressivement après les départs.", body: `20. "Joyeuse fête. J'ai mémorisé la façon dont le silence s'installait progressivement après les départs."
D'abord quelques voix en moins. Puis l'appartement plus grand. Puis les bruits qui reprennent leur place normale. Le frigo. La ville dehors. Et toi. Et moi. Cette installation progressive du silence. Ce retour à nous deux. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de chaque étape du retour au silence et sa beauté progressive, — [Prénom animal], ton animal pour le silence d'après qui vaut tout le bruit d'avant ❤️` },
              { id: "dnd_188", angle: "Joyeuse fête. J'ai mémorisé ta façon de prendre une grande respiration quand tout est fait.", body: `8. "Joyeuse fête. J'ai mémorisé ta façon de prendre une grande respiration quand tout est fait."
Ce moment. Après le dernier plat servi. Après le dernier verre rempli. Tu as pris une grande respiration. Profonde. Les yeux qui se ferment une seconde. Ce soupir de dépose. De transition du faire à l'être. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de ta grande respiration de dépose et sa signification de transition, — [Prénom animal], ton animal gardien de tes soupirs de transition 😌` },
              { id: "dnd_196", angle: "Joyeuse fête. J'ai mémorisé ta façon d'accepter les félicitations pour la soirée.", body: `16. "Joyeuse fête. J'ai mémorisé ta façon d'accepter les félicitations pour la soirée."
Simplement. Sans minimiser excessivement. Tu remercieras. Tu dis que tu es content que ce soit bien. Tu souris. Cette façon d'accepter que tu as bien fait quelque chose. Sans fausse modestie. Sans excès de fierté. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton accueil juste des félicitations sans excès dans aucun sens, — [Prénom animal], ton animal témoin de ton rapport sain à ce que tu fais bien 🌟` },
            ],
          },
          {
            id: "rien_que_nous",
            label: "Les moments rien que nous deux",
            messages: [
              { id: "dnd_011", angle: "T'as reçu des messages toute la journée. Ton téléphone n'arrêtait pas.", body: `11. "T'as reçu des messages toute la journée. Ton téléphone n'arrêtait pas."
Buzz. Buzz. Buzz. J'ai essayé d'aboyer plus fort que lui. J'ai perdu. Puis j'ai compris que tous ces messages c'était pour toi. Que les gens pensaient à toi. Que t'étais quelqu'un d'important pour plein de monde. Je le savais déjà. Joyeuse fête, [mon maître/ma maîtresse], star du jour que je côtoie au quotidien.
Avec fierté d'être à tes côtés en toutes circonstances, — [Prénom animal], ton animal plus proche de toi que n'importe quel contact dans ton téléphone 📱` },
              { id: "dnd_016", angle: "Ta fête tombe un jour de semaine cette année.", body: `16. "Ta fête tombe un jour de semaine cette année."
T'as quand même l'air de bien le vivre. Même un mardi ordinaire avec le travail le lendemain tu trouves le moyen de sourire. C'est ce que j'aime chez toi. Cette capacité à trouver une raison d'être bien. Moi je fais pareil chaque matin quand tu ouvres la porte de la chambre. On est pareils toi et moi. Joyeuse fête, [mon maître/ma maîtresse], expert en joie du quotidien.
Avec reconnaissance pour ce trait de caractère précieux, — [Prénom animal], ton animal qui a appris la joie à tes côtés 🌅` },
              { id: "dnd_020", angle: "Ce soir quand tout le monde est parti et que t'es venu t'asseoir sur le canapé j'ai posé ma tête sur tes genoux.", body: `20. "Ce soir quand tout le monde est parti et que t'es venu t'asseoir sur le canapé j'ai posé ma tête sur tes genoux."
Pas pour réclamer quelque chose. Pas parce que j'avais froid. Juste parce que c'était ta fête et que je voulais que tu saches que moi aussi je savais que c'était un jour spécial. À ma façon. Sans mots. Sans carte. Sans bouquet qui sent fort. Juste moi. Et toi. Et ce silence qui dit tout. Joyeuse fête, [mon maître/ma maîtresse].
Avec tendresse absolue et économie de mots assumée, — [Prénom animal], ton animal pour tous les jours spéciaux et les autres aussi ❤️` },
              { id: "dnd_026", angle: "Joyeuse fête. J'ai un problème avec les fleurs sur la table basse.", body: `6. "Joyeuse fête. J'ai un problème avec les fleurs sur la table basse."
Elles occupent exactement l'endroit où je pose d'habitude la tête quand je veux qu'on me remarque. Elles sentent fort. Elles prennent de la place. Elles reçoivent des regards admiratifs que moi je recevais avant. J'ai reniflé le vase trois fois. J'ai regardé les fleurs longuement. Les fleurs ont pas bougé. Je suis pas jaloux. Je fais juste un constat objectif. Joyeuse fête quand même, [mon maître/ma maîtresse].
Avec constat objectif sur les fleurs et jalousie officieusement niée, — [Prénom animal], ton animal en concurrence avec la végétation coupée 🌸` },
              { id: "dnd_032", angle: "Joyeuse fête. Le moment où la musique s'est arrêtée était le meilleur.", body: `12. "Joyeuse fête. Le moment où la musique s'est arrêtée était le meilleur."
Pendant des heures il y avait ce fond sonore. Agréable mais constant. Occupant l'air. Et puis à un moment quelqu'un a éteint. Le silence est revenu d'un coup. Plein et propre. Et dans ce silence j'ai entendu les voix vraiment pour la première fois de la soirée. Plus douces. Plus proches. C'est ça la vraie fête. Joyeuse fête, [mon maître/ma maîtresse], dont les soirées ont toujours un meilleur moment.
Avec oreilles soulagées et préférence pour le silence habité confirmée, — [Prénom animal], ton animal mélomane du silence choisi 🎵` },
              { id: "dnd_036", angle: "Joyeuse fête. Les caresses de tes amis et les tiennes c'est pas pareil.", body: `16. "Joyeuse fête. Les caresses de tes amis et les tiennes c'est pas pareil."
Tes amis caressent avec de la bonne volonté. Du haut vers le bas. Vite. Avec cette façon d'en faire un peu trop pour compenser le fait qu'ils savent pas vraiment. Toi tu sais exactement où. Exactement comment. Exactement combien de temps. Sans chercher. Sans hésiter. Depuis le premier jour. Personne caresse comme toi. C'est pour ça que c'est toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec étude comparative des techniques de caresse et verdict sans appel, — [Prénom animal], ton animal aux standards de contact bien établis 🤲` },
              { id: "dnd_037", angle: "Pour ta fête j'ai su que c'était un jour spécial avant même que tu te lèves.", body: `17. "Pour ta fête j'ai su que c'était un jour spécial avant même que tu te lèves."
À 6h du matin. Tu dormais encore. Mais quelque chose avait changé dans ta façon de dormir. Moins profond. Plus proche de la surface. Comme quelqu'un qui attend quelque chose sans le savoir encore. J'ai senti ça. J'ai attendu. Quand tu as ouvert les yeux j'étais déjà là à te regarder. Prêt. Joyeuse fête, [mon maître/ma maîtresse], dont je connais les humeurs avant même qu'elles existent.
Avec détection des états d'âme avant le réveil et présence garantie au bon moment, — [Prénom animal], ton animal en avance sur tes propres émotions 🌅` },
              { id: "dnd_040", angle: "Joyeuse fête. Le meilleur moment c'était quand la maison est redevenue rien qu'à nous deux.", body: `20. "Joyeuse fête. Le meilleur moment c'était quand la maison est redevenue rien qu'à nous deux."
La dernière porte fermée. Le dernier bruit de pas dans l'escalier. Et puis plus rien. Juste toi. Juste moi. Juste l'appartement qui reprenait sa respiration normale. Tu t'es assis. Tu as soufflé. Et j'ai posé ma tête sur tes pieds. Pas sur tes genoux. Sur tes pieds. Parce que c'est là que je suis le mieux quand la fête est finie et que la vraie soirée commence. Joyeuse fête, [mon maître/ma maîtresse].
Avec moment final offert sans calcul et tête posée là où c'est juste, — [Prénom animal], ton animal pour l'après qui vaut tous les pendants ❤️` },
              { id: "dnd_048", angle: "Joyeuse fête. Quelqu'un t'a pris dans ses bras ce soir et j'ai pas aimé.", body: `8. "Joyeuse fête. Quelqu'un t'a pris dans ses bras ce soir et j'ai pas aimé."
Pas un câlin rapide. Un long. Avec les deux bras. Et toi tu souriais. Je regardais ça depuis le salon avec une incompréhension totale. Tes bras sont réservés. Ton épaule est réservée. La zone de câlin en général c'est un territoire dont j'assure la gestion. J'ai aboyé une fois. Brièvement. Pour signaler. On m'a pas écouté. Joyeuse fête quand même, [mon maître/ma maîtresse].
Avec réclamation territoriale déposée officiellement et dossier ouvert pour suivi, — [Prénom animal], ton animal gestionnaire exclusif de la zone câlin 🤗` },
              { id: "dnd_056", angle: "Joyeuse fête. Il y a eu un moment où tu t'es levé pour aller chercher quelque chose.", body: `16. "Joyeuse fête. Il y a eu un moment où tu t'es levé pour aller chercher quelque chose."
Et avant de partir vers la cuisine tu m'as regardé. Une seconde. Pour vérifier que j'allais bien. Que j'étais là. Au milieu de tous ces gens et de toute cette soirée tu as pris une seconde pour moi. Les autres ont continué à parler. Personne a vu. Mais moi j'ai vu. Et j'ai remué la queue très légèrement. Juste pour toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec regard reçu et queue remuée imperceptiblement dans un échange qui n'appartient qu'à nous, — [Prénom animal], ton animal pour les secondes silencieuses dans le bruit 💛` },
              { id: "dnd_059", angle: "Pour ta fête j'ai sauvegardé mentalement chaque moment de la soirée.", body: `19. "Pour ta fête j'ai sauvegardé mentalement chaque moment de la soirée."
L'arrivée du premier invité. Le moment où la musique a changé. Ton rire à 21h15. Le silence quand les bougies sont arrivées. La façon dont tu as serré quelqu'un dans tes bras près de la porte. Le moment où tu t'es retourné et tu m'as cherché des yeux. Tout. Dans l'ordre. Archivé. Cette soirée existe maintenant en entier quelque part en moi. Joyeuse fête, [mon maître/ma maîtresse].
Avec archive complète de la soirée constituée et conservée indéfiniment, — [Prénom animal], ton animal mémoire vivante de vos plus belles heures 📸` },
              { id: "dnd_060", angle: "Joyeuse fête. Quand tout le monde est parti tu t'es assis par terre.", body: `20. "Joyeuse fête. Quand tout le monde est parti tu t'es assis par terre."
Pas sur le canapé. Par terre. Dos contre le canapé. Les jambes étendues. Fatigué de la bonne façon. Et je suis venu m'asseoir à côté de toi. Pas sur toi. À côté. Épaule contre épaule si on peut dire. Et on a regardé l'appartement vide ensemble. Encore un peu chaud de tous ces gens. Et c'était bien. Tellement bien. Joyeuse fête, [mon maître/ma maîtresse].
Avec moment final offert simplement et épaule contre épaule comme conclusion parfaite, — [Prénom animal], ton animal pour les fins de soirée qui valent tout le reste ❤️` },
              { id: "dnd_077", angle: "Joyeuse fête. J'ai observé ta façon de sourire en regardant tes invités depuis l'autre bout de la pièce.", body: `17. "Joyeuse fête. J'ai observé ta façon de sourire en regardant tes invités depuis l'autre bout de la pièce."
À plusieurs reprises ce soir tu t'es arrêté. Tu regardais la pièce. Tes invités. Les conversations. Et tu souriais. Pas à quelqu'un en particulier. À tout ça en même temps. À ce que tu avais créé. Ce sourire du fondateur de la soirée. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton sourire fondateur et compréhension de sa signification de satisfaction, — [Prénom animal], ton animal témoin de ta fierté silencieuse 🌟` },
              { id: "dnd_160", angle: "Joyeuse fête. J'ai étudié ta façon de te reposer dans ta propre fête.", body: `20. "Joyeuse fête. J'ai étudié ta façon de te reposer dans ta propre fête."
Tu as trouvé des moments. Courts. Assis quelque part. Une gorgée. Un regard vers rien. Quelques secondes de non-animation. Ces mini-pauses dans le flux de la soirée. Ces moments où tu existais pour toi seul au milieu de tout le monde. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes mini-pauses de recharge au milieu de tout le monde, — [Prénom animal], ton animal témoin de tes moments pour toi dans le collectif 🌿` },
            ],
          },
          {
            id: "visage",
            label: "Ce que j'ai vu sur ton visage",
            messages: [
              { id: "dnd_097", angle: "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un goûte quelque chose que tu as préparé.", body: `17. "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un goûte quelque chose que tu as préparé."
Cette fraction de seconde. Entre le moment où la fourchette entre dans la bouche et le moment où le verdict paraît. Toi pendant ce temps tu regardes. Discrètement. Et quand le sourire arrive sur leur visage le tien suit. Ce reflet de la satisfaction de l'autre dans la tienne. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta fraction de seconde d'attente et de son aboutissement en sourire partagé, — [Prénom animal], ton animal gardien de tes moments de validation 😊` },
              { id: "dnd_114", angle: "Joyeuse fête. J'ai observé comment tu changes de visage quand tu es touché par quelque chose.", body: `14. "Joyeuse fête. J'ai observé comment tu changes de visage quand tu es touché par quelque chose."
Une fraction de seconde. Quelque chose passe. Quelque chose de doux et d'inattendu. Puis tu reprends. Mais pendant cette fraction de seconde ton visage dit tout. Ce soir j'ai vu ça deux fois. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes deux fractions de seconde d'émotion vraie et leur valeur précieuse, — [Prénom animal], ton animal gardien de tes moments non protégés 💛` },
              { id: "dnd_141", angle: "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un dit quelque chose de gentil sur toi en public.", body: `1. "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un dit quelque chose de gentil sur toi en public."
Une légère hésitation. Puis tu remercies simplement. Sans minimiser. Sans surjouer. Tu accueilles le compliment public avec la même grâce que le compliment privé. Ni trop ni pas assez. Juste ce qu'il faut. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton accueil parfaitement dosé du compliment public, — [Prénom animal], ton animal expert en réception gracieuse 🌷` },
              { id: "dnd_153", angle: "Joyeuse fête. J'ai observé comment ton visage change quand tu es fatigué mais que tu continues.", body: `13. "Joyeuse fête. J'ai observé comment ton visage change quand tu es fatigué mais que tu continues."
Il y a eu un moment. Tard dans la soirée. Où j'ai vu la fatigue passer sur ton visage une seconde. Puis tu t'es repris. Un sourire. Un effort. Une reprise. Cette façon de puiser dans une réserve qu'on ne savait pas avoir. Pour les gens. Pour la soirée. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta reprise tardive et admiration pour tes réserves cachées, — [Prénom animal], ton animal témoin de ton endurance gracieuse 💪` },
              { id: "dnd_161", angle: "Joyeuse fête. J'ai observé ta façon de sourire en entendant une conversation que tu n'étais pas censé entendre.", body: `1. "Joyeuse fête. J'ai observé ta façon de sourire en entendant une conversation que tu n'étais pas censé entendre."
Tu avais le dos tourné. Tu faisais autre chose. Et quelque chose d'une conversation proche t'a atteint. Et j'ai vu ce sourire involontaire. Celui qui dit que tu as entendu quelque chose de drôle ou de touchant même si tu n'étais pas censé écouter. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton sourire involontaire d'écoute accidentelle, — [Prénom animal], ton animal dont les oreilles sont aussi attentives que les miennes 👂` },
              { id: "dnd_169", angle: "Joyeuse fête. J'ai observé ta façon d'écouter la musique différemment ce soir.", body: `9. "Joyeuse fête. J'ai observé ta façon d'écouter la musique différemment ce soir."
Elle est là en fond. Et puis parfois un morceau arrive et quelque chose dans ton visage change légèrement. Tu es là et en même temps ailleurs une seconde. Dans un souvenir ou une émotion. Puis tu reviens. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes micro-voyages musicaux au milieu de la conversation, — [Prénom animal], ton animal gardien de tes absences musicales 🎵` },
              { id: "dnd_173", angle: "Joyeuse fête. J'ai observé comment tu te sens différent dans ta propre maison ce soir.", body: `13. "Joyeuse fête. J'ai observé comment tu te sens différent dans ta propre maison ce soir."
Tu occupes l'espace différemment. Tu te déplaces avec plus d'intention. Tu es chez toi mais tu es aussi hôte. Ces deux états en même temps. Cette façon d'habiter ton espace en étant à la fois dedans et en train de le regarder de l'extérieur. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton double état d'habitant et d'hôte simultané dans ton espace, — [Prénom animal], ton animal témoin de ta dualité de soirée 🏠` },
              { id: "dnd_178", angle: "Joyeuse fête. J'ai observé comment tu te retrouves seul une minute et ce que tu fais.", body: `18. "Joyeuse fête. J'ai observé comment tu te retrouves seul une minute et ce que tu fais."
Tu regardes. Tu fais le tour des yeux. Tu souffles légèrement. Tu prends quelque chose à manger ou à boire. Et tu repars. Ces minutes seules dans ta propre fête. Ces parenthèses de toi. Brèves. Nécessaires. Invisibles pour les autres. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes parenthèses solitaires au milieu de tout le monde et leur nécessité, — [Prénom animal], ton animal pour qui ces minutes-là sont les plus précieuses 🌿` },
              { id: "dnd_185", angle: "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui part pour la dernière fois de la soirée.", body: `5. "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui part pour la dernière fois de la soirée."
Après le dernier au revoir. La porte fermée. Et toi tu regardes la porte encore une seconde. Comme si tu regardais encore la personne à travers. Cette seconde de prolongation du lien. Cette façon de ne pas lâcher tout de suite. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta seconde de prolongation du lien après la fermeture de la porte, — [Prénom animal], ton animal gardien de tes au revoir qui durent un peu plus 🚪` },
              { id: "dnd_186", angle: "Joyeuse fête. J'ai observé comment tu changes quand il ne reste plus que les proches.", body: `6. "Joyeuse fête. J'ai observé comment tu changes quand il ne reste plus que les proches."
Vers la fin quand les moins proches sont partis. Tu changes. Tu te détends différemment. Tu parles différemment. Tu ris différemment. Comme si tu pouvais être encore plus toi. Ce dernier cercle de la soirée est le meilleur. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton changement vers le dernier cercle intime et admiration pour cette version de toi, — [Prénom animal], ton animal pour qui cette version-là est la préférée 💛` },
              { id: "dnd_190", angle: "Joyeuse fête. J'ai observé comment tu faisais la transition entre hôte et toi-même après la fête.", body: `10. "Joyeuse fête. J'ai observé comment tu faisais la transition entre hôte et toi-même après la fête."
Progressivement. Les chaussures enlevées. La veste posée. La musique baissée. Ces gestes de déshabillage du rôle d'hôte. Ces façons de redevenir toi. Pas l'hôte. Toi. Celui ou celle qui vit ici tous les jours. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton déshabillage progressif du rôle d'hôte et ton retour à toi, — [Prénom animal], ton animal pour qui cette version-là est la préférée aussi 👤` },
              { id: "dnd_200", angle: "Ce moment où tu réalises que ta fête était vraiment réussie.", body: `20. "Ce moment où tu réalises que ta fête était vraiment réussie."
C'est après. Quand tout le monde est parti. Quand tu t'assieds. Quand le silence revient. Et là quelque chose arrive. Une certitude tranquille. Que c'était bien. Vraiment bien. Que les gens sont partis contents. Que tu as créé quelque chose ce soir. Ce moment-là c'est le meilleur moment de la fête. Et je suis là pour le partager avec toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec présence partagée dans ton moment de réalisation que c'était réussi, — [Prénom animal], ton animal pour le meilleur moment qui arrive après que tout le monde est parti ❤️` },
            ],
          },
        ],
      },
    ],
  },
  chat_birthday: {
    themes: [
      {
        id: "comportements",
        emoji: "😼",
        label: "Comportements félins",
        count: 33,
        subGroups: [
          {
            id: "signature",
            label: "Mes comportements signature",
            messages: [
              { id: "cbd_005", angle: "Joyeux anniversaire. Ce matin je me suis assis sur ton visage.", body: `5. "Joyeux anniversaire. Ce matin je me suis assis sur ton visage."
À 5h43 exactement. Pas par accident. Par choix délibéré. Tu dormais encore et la journée devait commencer. C'était ton anniversaire. Les anniversaires ça se fête tôt. Certains diront que c'est une façon bizarre de réveiller quelqu'un. Ces gens n'ont jamais reçu l'honneur d'être choisis comme surface de réveil. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réveil personnalisé et service cinq étoiles à l'heure choisie par moi, — [Prénom animal], ton animal aux attentions matinales non conventionnelles 🌅` },
              { id: "cbd_006", angle: "Pour ton anniversaire j'ai accepté que tu me portes pendant trente secondes.", body: `6. "Pour ton anniversaire j'ai accepté que tu me portes pendant trente secondes."
Trente secondes. Debout. Contre toi. Les pattes sur ton épaule. Tu faisais ce bruit content que tu fais quand tu es heureux. J'aurais pu partir avant. J'ai décidé de rester trente secondes. C'est mon record annuel. Tu le sais pas mais c'est pour toi que j'ai tenu. Joyeux anniversaire, [mon maître/ma maîtresse], destinataire de mon record de câlin debout.
Avec dépassement personnel et record homologué intérieurement, — [Prénom animal], ton animal aux efforts mesurés en secondes 🏆` },
              { id: "cbd_017", angle: "Joyeux anniversaire. J'ai saboté une photo de groupe ce soir.", body: `17. "Joyeux anniversaire. J'ai saboté une photo de groupe ce soir."
Tout le monde était rassemblé pour la photo. Bien alignés. Bien souriants. Et je suis passé devant exactement au bon moment. Lentement. Avec dignité. Le regard droit. Sans me presser. J'ai traversé le cadre et je suis reparti. La photo n'a que moi dedans vraiment. C'est mon cadeau. Être le centre sans l'avoir demandé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec timing parfait et présence artistique non planifiée officiellement, — [Prénom animal], ton animal star involontaire de toutes les photos 📸` },
              { id: "cbd_018", angle: "Pour ton anniversaire j'ai toléré le bruit de la fête pendant trois heures.", body: `18. "Pour ton anniversaire j'ai toléré le bruit de la fête pendant trois heures."
Les rires. Les verres. La musique. Les voix qui se chevauchent. Trois heures de stimulation sonore excessive. J'ai géré. Depuis le dessus du frigo. En hauteur. En sécurité. En observateur. J'ai tout vu. Tout entendu. Tout mémorisé. Un jour peut-être je ressortirai certaines informations. Joyeux anniversaire, [mon maître/ma maîtresse], dont les soirées enrichissent mes archives.
Avec endurance sonore remarquable et base de données personnelle bien alimentée, — [Prénom animal], ton animal archiviste du dessus du frigo 🗄️` },
              { id: "cbd_022", angle: "Joyeux anniversaire. J'ai léché ton assiette cette nuit.", body: `2. "Joyeux anniversaire. J'ai léché ton assiette cette nuit."
Celle que tu avais laissée sur la table basse. Avec ce reste de sauce. J'ai attendu que tu dormes. J'ai vérifié trois fois que tu dormais vraiment. Puis j'ai procédé avec méthode et discrétion. L'assiette était propre au matin. Tu as cru avoir bien rangé la veille. Je t'ai laissé croire ça. C'est mon cadeau. Te laisser croire que tu es organisé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec service de nettoyage discret et illusion d'ordre entretenue avec soin, — [Prénom animal], ton animal majordome nocturne 🍽️` },
              { id: "cbd_024", angle: "Pour ton anniversaire j'ai décidé de ne pas me battre avec mon reflet dans le miroir.", body: `4. "Pour ton anniversaire j'ai décidé de ne pas me battre avec mon reflet dans le miroir."
Tu avais sorti le grand miroir pour la fête. Il était là dans l'entrée. Mon reflet dedans. Ce regard. Cette posture. Cet autre moi qui me défie depuis toujours. J'ai tourné autour deux fois. Puis j'ai décidé que ce soir ce n'était pas le moment. Que ta fête méritait la paix. C'est le plus grand sacrifice que j'aie jamais consenti. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec trêve unilatérale décrétée pour raison d'anniversaire et hostilités reprises demain, — [Prénom animal], ton animal aux ennemis personnels bien identifiés 🪞` },
              { id: "cbd_026", angle: "Pour ton anniversaire j'ai accepté que la dame allergique me caresse.", body: `6. "Pour ton anniversaire j'ai accepté que la dame allergique me caresse."
Tu sais laquelle. Celle qui dit toujours qu'elle est allergique mais qui essaie quand même. Elle a tendu la main. J'ai regardé la main. J'ai regardé son visage. Et j'ai laissé faire. Trois secondes. Complètes. Elle a eu l'air très contente. Tu as eu l'air très soulagé. C'était mon cadeau à tous les deux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec tolérance exceptionnelle et trois secondes offertes en pleine conscience, — [Prénom animal], ton animal aux gestes de paix mesurés au chronomètre 🤝` },
              { id: "cbd_030", angle: "Pour ton anniversaire j'ai pétri le canapé pendant vingt minutes.", body: `10. "Pour ton anniversaire j'ai pétri le canapé pendant vingt minutes."
Le bon canapé. Celui du salon. Avec les deux pattes avant en alternance. Les yeux mi-clos. La tête qui dodeline légèrement. Certains appellent ça faire du pain. Moi j'appelle ça une méditation active. C'était pour toi. Pour marquer ton anniversaire à ma façon. En laissant une empreinte sur ce qui est à nous. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec rituel de marquage affectueux et canapé durablement imprégné de bonnes intentions, — [Prénom animal], ton animal boulanger de l'affection 🍞` },
              { id: "cbd_032", angle: "Pour ton anniversaire j'ai fait tomber exactement une chose de la table.", body: `12. "Pour ton anniversaire j'ai fait tomber exactement une chose de la table."
Une seule. J'aurais pu en faire tomber trois. La tentation était là. Le stylo. Le verre à moitié plein. Le livre posé en équilibre. J'ai choisi le stylo uniquement. Avec discernement. Avec mesure. Et je suis parti aussitôt après sans regarder le résultat. C'est de la retenue. De la maturité. Un cadeau d'anniversaire sous forme de dégâts minimes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec destruction ciblée et proportionnée au lieu de carnage total, — [Prénom animal], ton animal aux pulsions maîtrisées pour l'occasion ✏️` },
              { id: "cbd_067", angle: "Pour ton anniversaire je t'ai laissé me brosser sans partir.", body: `7. "Pour ton anniversaire je t'ai laissé me brosser sans partir."
Tu avais la brosse. Cette brosse-là. Je l'ai vue arriver. J'aurais pu partir. Je connais tous les chemins de fuite de cet appartement. J'ai décidé de rester. Je me suis assis. Tu as brossé. J'ai fermé les yeux à moitié. Pas de plaisir. De décision. C'était mon cadeau. Dix minutes sans que j'aie à être rattrapé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec coopération au brossage accordée librement et distinction entre plaisir et choix maintenue, — [Prénom animal], ton animal aux concessions volontaires et documentées 🖌️` },
            ],
          },
          {
            id: "surveille_gere",
            label: "Je surveille & je gère ta fête",
            messages: [
              { id: "cbd_001", angle: "Joyeux anniversaire. J'avais tout prévu à l'avance.", body: `1. "Joyeux anniversaire. J'avais tout prévu à l'avance."
Tu avais sorti le grand plat. Commandé des choses en ligne. Changé les draps. Ces signaux ne m'échappent pas. Je lis ton environnement mieux que tu ne le lis toi-même. J'avais donc préparé ma stratégie de soirée bien à l'avance. Disparaître à 19h. Réapparaître à 22h30 quand les invités partent. M'installer sur toi comme si de rien n'était. Plan exécuté parfaitement. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec anticipation stratégique et exécution sans faille, — [Prénom animal], ton animal planificateur de l'ombre 🗓️` },
              { id: "cbd_031", angle: "Joyeux anniversaire. J'ai surveillé le monde extérieur toute la journée pour toi.", body: `11. "Joyeux anniversaire. J'ai surveillé le monde extérieur toute la journée pour toi."
Pas pour moi. Pour toi. Pour m'assurer que le monde extérieur était sous contrôle pendant ta fête. Les pigeons du rebord d'en face. Le monsieur qui promène son chien toujours à la même heure. La voiture rouge qui se gare mal systématiquement. Tout était en ordre. Tu pouvais fêter en sécurité. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec surveillance du périmètre extérieur assurée sans relâche et rapport disponible sur demande, — [Prénom animal], ton animal vigie du monde depuis le rebord de fenêtre 🪟` },
              { id: "cbd_036", angle: "Pour ton anniversaire j'ai inspecté chaque invité depuis le couloir.", body: `16. "Pour ton anniversaire j'ai inspecté chaque invité depuis le couloir."
Un par un. À leur arrivée. Sans me montrer. Juste le nez qui dépasse de l'embrasure. Odeur. Niveau de menace. Classification. L'un d'eux avait manifestement un chien chez lui. Je l'ai noté. Un autre portait quelque chose qui sentait la lavande de façon agressive. Noté aussi. Bilan global : acceptable. Fête autorisée à se poursuivre. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec contrôle aux entrées effectué dans l'ombre et sécurité de la soirée assurée, — [Prénom animal], ton animal agent de renseignement du couloir 🕵️` },
              { id: "cbd_041", angle: "Joyeux anniversaire. J'ai reconnu que c'était aujourd'hui à ta façon de te lever.", body: `1. "Joyeux anniversaire. J'ai reconnu que c'était aujourd'hui à ta façon de te lever."
Pas le lever du lundi. Pas le lever du dimanche ordinaire. Celui-là avait quelque chose de différent. Plus lent au début. Puis plus décidé. Comme quelqu'un qui sait que la journée qui commence mérite d'être accueillie différemment. Tu as regardé par la fenêtre plus longtemps que d'habitude. Tu as souri sans raison apparente. J'ai su. Joyeux anniversaire, [mon maître/ma maîtresse], dont les matins d'anniversaire ont leur propre signature.
Avec lecture de tes matins depuis des années et diagnostic immédiat ce jour-là, — [Prénom animal], ton animal météorologue de tes humeurs au réveil 🌅` },
              { id: "cbd_043", angle: "Pour ton anniversaire j'ai décidé de ne pas disparaître quand le premier invité est arrivé.", body: `3. "Pour ton anniversaire j'ai décidé de ne pas disparaître quand le premier invité est arrivé."
C'est mon réflexe habituel. La sonnette. L'inconnu potentiel. Le couloir. Le dessous du lit. La disparition complète. Ce soir j'ai résisté. Je suis resté dans le salon. Assis sur le fauteuil. Visible. Quand la porte s'est ouverte j'ai regardé l'invité droit dans les yeux. Il a fait un bruit admiratif. Tu as eu l'air fier. C'était mon cadeau. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réflexe de fuite surmonté par décision pure et cadeau offert sous forme de présence, — [Prénom animal], ton animal dont la bravoure s'exprime autrement que tu ne le crois 🏅` },
              { id: "cbd_050", angle: "Pour ton anniversaire j'ai gardé un œil sur toi pendant que tu cuisinais.", body: `10. "Pour ton anniversaire j'ai gardé un œil sur toi pendant que tu cuisinais."
Depuis le plan de travail. Ma position habituelle. Tu me demandes régulièrement de descendre. Je descends rarement. Ce soir tu m'as pas demandé. Tu cuisinais et tu me regardais parfois. Comme si ma présence là-haut te rassurait. Comme si avoir quelqu'un qui veille changeait quelque chose. Je suis resté deux heures. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec supervision culinaire assurée depuis la hauteur et regard bienveillant offert gratuitement, — [Prénom animal], ton animal veilleur de tes préparatifs 👁️` },
              { id: "cbd_053", angle: "Pour ton anniversaire j'ai fait semblant de dormir pour observer tes préparatifs.", body: `13. "Pour ton anniversaire j'ai fait semblant de dormir pour observer tes préparatifs."
Tu allais et venais. Tu essayais des choses. Tu te regardais. Tu remettais quelque chose en place. Tu soufflais. Tu recommençais. Tout ça avec une concentration et une application que je trouvais touchantes. Je regardais entre mes cils sans bouger. T'aurais pas aimé savoir que j'observais. Alors j'ai préservé l'illusion. C'est du respect. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation discrète préservée par l'illusion du sommeil et respect de ton intimité de préparation, — [Prénom animal], ton animal aux yeux mi-clos qui voient tout 😴` },
              { id: "cbd_055", angle: "Pour ton anniversaire j'ai suivi tous tes déplacements dans l'appartement ce soir.", body: `15. "Pour ton anniversaire j'ai suivi tous tes déplacements dans l'appartement ce soir."
Salon cuisine couloir. Cuisine salon entrée. Salon encore. Chaque fois que tu bougeais je recalculais ma position pour garder une ligne de vue. Pas pour te surveiller. Pour être dans le même espace que toi. Pour que ta trajectoire et la mienne se croisent régulièrement ce soir. C'est ma façon d'être avec toi dans une fête. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec trajectoires synchronisées tout au long de la soirée et présence garantie dans chaque pièce, — [Prénom animal], ton animal satellite de ta propre fête 🔄` },
              { id: "cbd_075", angle: "Pour ton anniversaire j'ai suivi des yeux chaque bouchée du gâteau.", body: `15. "Pour ton anniversaire j'ai suivi des yeux chaque bouchée du gâteau."
La découpe. Le premier morceau dans l'assiette. La fourchette qui monte. La bouche. L'expression. La deuxième bouchée plus confiante. J'ai fait ça pour chaque personne présente ce soir. Méthodiquement. Sans me faire remarquer. Ma conclusion : le gâteau était bon. Très bon. Cette information m'est personnellement utile pour des raisons que je garderai pour moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec surveillance gastronomique complète et conclusions conservées pour usage ultérieur, — [Prénom animal], ton animal critique culinaire aux motivations transparentes 🎂` },
              { id: "cbd_087", angle: "Joyeux anniversaire. J'ai passé la soirée à surveiller le plateau de fromages.", body: `7. "Joyeux anniversaire. J'ai passé la soirée à surveiller le plateau de fromages."
Il était là sur la table basse. Accessible. Avec ces odeurs. Ces textures. Ces formes que je n'avais jamais vues. Je me suis installé à côté. À distance réglementaire. Les yeux dessus. Sans bouger. Pendant deux heures. Personne n'a rien dit. Tout le monde faisait semblant de pas voir. C'est une forme de respect. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec surveillance du plateau assurée sans relâche et dignité maintenue tout au long, — [Prénom animal], ton animal vigile des fromages 🧀` },
              { id: "cbd_093", angle: "Pour ton anniversaire j'ai établi le fauteuil du coin comme mon poste d'observation officiel.", body: `13. "Pour ton anniversaire j'ai établi le fauteuil du coin comme mon poste d'observation officiel."
Vue sur le salon. Vue sur le couloir. Vue partielle sur la cuisine. Accès rapide à la chambre si besoin de retraite. Hauteur parfaite pour être vu sans être trop accessible. J'ai occupé ce poste pendant trois heures sans interruption. C'était le bon endroit. C'est maintenant mon endroit pour toutes tes fêtes futures. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec poste d'observation officiel établi et reconduction automatique pour les prochaines éditions, — [Prénom animal], ton animal stratège de l'espace 🪑` },
              { id: "cbd_095", angle: "Pour ton anniversaire j'ai suivi le trajet de chaque assiette depuis la cuisine.", body: `15. "Pour ton anniversaire j'ai suivi le trajet de chaque assiette depuis la cuisine."
Tu portais les plats avec soin. En équilibre. Tu évaluais la chaleur avec la paume. Tu regardais où tu allais poser. Tu vérifiait que tout était là avant de lâcher. Cette attention portée à nourrir les autres. À ce que tout soit bien. À ce que personne ne manque de rien. C'est une des choses que j'aime chez toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec suivi logistique des assiettes et sentiment derrière la logistique bien identifié, — [Prénom animal], ton animal témoin de ta générosité en actes 🍽️` },
              { id: "cbd_132", angle: "Joyeux anniversaire. J'ai surveillé la porte d'entrée depuis le couloir toute la soirée.", body: `12. "Joyeux anniversaire. J'ai surveillé la porte d'entrée depuis le couloir toute la soirée."
Pas pour la même raison que toi. Toi tu attendais les invités. Moi j'évaluais chaque arrivée. Je vérifiais que personne d'indésirable ne passait. Que les gens qui entraient méritaient d'entrer dans notre appartement. Bilan : tous passables à très bien. Tu as de bons amis. Je t'en félicite. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec contrôle qualité des entrées effectué et bilan globalement positif rendu, — [Prénom animal], ton animal directeur des accréditations 🚪` },
            ],
          },
          {
            id: "tolerances",
            label: "Mes tolérances & aveux",
            messages: [
              { id: "cbd_008", angle: "Pour ton anniversaire j'ai fait semblant de m'intéresser à tes invités.", body: `8. "Pour ton anniversaire j'ai fait semblant de m'intéresser à tes invités."
Je suis sorti de sous le lit à 21h. J'ai traversé le salon avec l'air de quelqu'un qui avait quelque chose d'important à faire de l'autre côté. J'ai ignoré trois personnes qui voulaient me caresser. J'en ai reniflé une que j'avais jugée acceptable. Puis je suis reparti. Toute la pièce m'avait regardé. C'était ma performance d'anniversaire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec apparition calculée et impact maximal en temps minimal, — [Prénom animal], ton animal star du passage éclair 🌟` },
              { id: "cbd_013", angle: "Joyeux anniversaire. J'ai quelque chose d'important à t'avouer.", body: `13. "Joyeux anniversaire. J'ai quelque chose d'important à t'avouer."
Parfois le soir quand tu dors et que la maison est silencieuse je viens m'asseoir près de ta tête. Pas dessus. Près. Et je reste là un moment à écouter ta respiration. C'est calme. C'est régulier. C'est rassurant d'une façon que je ne m'explique pas tout à fait. Je pars avant que tu te réveilles. Tu le sais pas. Maintenant tu le sais. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec confession nocturne et vulnérabilité exceptionnelle pour l'occasion, — [Prénom animal], ton animal aux rondes de nuit secrètes 🌙` },
              { id: "cbd_014", angle: "Pour ton anniversaire j'ai décidé de ne pas juger tes invités ce soir.", body: `14. "Pour ton anniversaire j'ai décidé de ne pas juger tes invités ce soir."
Celui avec les chaussures qui couinent. La dame qui parle trop fort. Le grand qui a voulu me prendre trois fois malgré mes signaux clairs. Je les ai tous laissés exister sans commentaire. Sans regard appuyé. Sans départ ostensible. J'étais là. Neutre. Bienveillant presque. C'est mon plus grand effort de l'année. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec neutralité maintenue contre toute attente et effort titanesque consenti, — [Prénom animal], ton animal diplomate d'un soir 🕊️` },
              { id: "cbd_034", angle: "Pour ton anniversaire j'ai gardé le secret sur plusieurs choses.", body: `14. "Pour ton anniversaire j'ai gardé le secret sur plusieurs choses."
Je sais où sont les clés que tu cherches depuis mardi. Je sais qui a rayé légèrement le bas du couloir. Je sais ce qui s'est passé avec la plante verte du salon. Ces informations restent confidentielles. Ce silence est mon cadeau. Un cadeau annuel. Renouvelable sous conditions. Joyeux anniversaire, [mon maître/ma maîtresse], dont la tranquillité dépend en partie de ma discrétion.
Avec confidentialité maintenue et pouvoir discret exercé avec responsabilité, — [Prénom animal], ton animal dépositaire de vérités non divulguées 🤫` },
              { id: "cbd_048", angle: "Pour ton anniversaire j'ai accordé le droit de canapé à un invité exceptionnel.", body: `8. "Pour ton anniversaire j'ai accordé le droit de canapé à un invité exceptionnel."
Tu sais lequel. Celui qui s'est assis sans bruit. Qui a posé sa main sur l'accoudoir sans s'étaler. Qui a regardé vers moi sans faire de geste. Qui a attendu. J'ai évalué. J'ai décidé. Je me suis installé à côté de lui. À vingt centimètres. Pas plus. Mais à côté. La pièce entière l'a remarqué. Il avait l'air de comprendre l'honneur. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec évaluation rigoureuse et droit de canapé accordé après délibération, — [Prénom animal], ton animal dont les faveurs sont rares et donc précieuses 🛋️` },
              { id: "cbd_065", angle: "Joyeux anniversaire. J'ai trouvé l'endroit exact où tu caches les choses que tu ne veux pas que je touche.", body: `5. "Joyeux anniversaire. J'ai trouvé l'endroit exact où tu caches les choses que tu ne veux pas que je touche."
Le placard du haut. Troisième étagère. Derrière les serviettes. C'est là. J'ai fait cette découverte en juillet. Je n'ai rien touché. Je garde l'information. C'est mon assurance. Mon pouvoir silencieux. Savoir sans agir c'est la forme la plus raffinée de l'intelligence. Joyeux anniversaire, [mon maître/ma maîtresse], dont les secrets de rangement n'en sont plus vraiment.
Avec localisation des objets protégés établie et discrétion maintenue par choix stratégique, — [Prénom animal], ton animal dont le silence est une forme de magnanimité 🗄️` },
              { id: "cbd_100", angle: "Pour ton anniversaire j'ai reconnu le moment exact où tu avais vraiment faim.", body: `20. "Pour ton anniversaire j'ai reconnu le moment exact où tu avais vraiment faim."
Vers 20h15. Avant que le repas soit servi. Tu as regardé la cuisine. Puis tes invités. Puis la cuisine encore. Tes mains ont cherché quelque chose sur la table. Tu as pris une olive. Puis une autre. Puis tu as eu l'air de décider de tenir encore un peu. Cette discipline. Cette politesse. Qui prime sur la faim. C'est une des choses que j'admire. Moi j'aurais géré autrement. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection de la faim à 20h15 et admiration pour ta gestion exemplaire, — [Prénom animal], ton animal qui n'aurait pas tenu aussi longtemps 🫒` },
              { id: "cbd_107", angle: "Joyeux anniversaire. J'ai écouté depuis le rebord de la baignoire pendant vingt minutes.", body: `7. "Joyeux anniversaire. J'ai écouté depuis le rebord de la baignoire pendant vingt minutes."
Les voix portaient jusqu'à la salle de bain. Des fragments. Des rires. Des noms. Une conversation sur quelque chose que j'ai pas identifié. Le son d'une fête depuis loin c'est différent. Plus doux. Plus rond. Comme de la musique dont on entend que les basses. C'était bien. J'y suis resté plus longtemps que prévu. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec écoute de la fête en version acoustique distante et appréciation inattendue, — [Prénom animal], ton animal audiophile des sons de couloir 🛁` },
              { id: "cbd_142", angle: "Pour ton anniversaire j'ai dormi sous la table pendant le repas.", body: `2. "Pour ton anniversaire j'ai dormi sous la table pendant le repas."
Personne ne m'a vu. Ou plutôt personne n'a rien dit. J'étais là depuis le début. Entre les pieds. Dans la chaleur des jambes. Le bruit des couverts au-dessus. Les conversations qui tombaient d'en haut comme une pluie de mots. C'était le meilleur endroit de la soirée. Un secret partagé avec moi seul. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation secrète du sous-table et soirée vécue depuis le meilleur angle, — [Prénom animal], ton animal spécialiste des positions inattendues 🫥` },
              { id: "cbd_147", angle: "Pour ton anniversaire j'ai passé du temps sur le rebord de la fenêtre à regarder les voitures en bas.", body: `7. "Pour ton anniversaire j'ai passé du temps sur le rebord de la fenêtre à regarder les voitures en bas."
Les gens partent en voiture. Les phares dans la rue. Les feux rouges qui changent. La rue normale qui continue pendant que ta fête se termine là-haut. Ce contraste entre l'intérieur animé et l'extérieur indifférent. J'aime ce contraste. Il dit que ce qui se passe ici est précieux justement parce que le reste du monde n'en sait rien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec contemplation de la rue nocturne et philosophie de la préciosité de l'intime, — [Prénom animal], ton animal poète du rebord de fenêtre 🪟` },
            ],
          },
        ],
      },
      {
        id: "cadeaux",
        emoji: "🎁",
        label: "Cadeaux & objets",
        count: 15,
        subGroups: [
          {
            id: "rituels",
            label: "Cadeaux & rituels",
            messages: [
              { id: "cbd_012", angle: "Pour ton anniversaire quelqu'un t'a offert un nouveau coussin.", body: `12. "Pour ton anniversaire quelqu'un t'a offert un nouveau coussin."
Un beau coussin. Ferme. Avec une housse douce. Posé sur le canapé. Encore dans son emballage quand je l'ai trouvé. Je me suis assis dessus pendant que tu ouvrais les autres cadeaux. Quand tu es arrivé à celui-là j'étais installé depuis vingt minutes. On a eu un moment de regard soutenu. Je n'ai pas bougé. Le coussin est à moi maintenant. Joyeux anniversaire quand même, [mon maître/ma maîtresse].
Avec prise de possession légale par occupation continue et regard soutenu, — [Prénom animal], ton animal propriétaire de tout ce qui est moelleux 🛋️` },
              { id: "cbd_019", angle: "Joyeux anniversaire. J'ai quelque chose pour toi.", body: `19. "Joyeux anniversaire. J'ai quelque chose pour toi."
Ce matin j'ai trouvé quelque chose dans le couloir. Un insecte. Petit. Rapide. Je l'ai chassé pendant quarante minutes avec une concentration et une agilité que peu peuvent imaginer. Je l'ai attrapé. Je l'ai apporté devant ta porte. Je l'ai déposé avec soin. Tu as fait un bruit en le trouvant. Ce bruit voulait dire merci dans une langue que tu maîtrises encore mal. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec chasse mémorable et cadeau artisanal cent pour cent local, — [Prénom animal], ton animal pourvoyeur de présents naturels 🎁` },
              { id: "cbd_028", angle: "Pour ton anniversaire tu as reçu un jouet pour moi.", body: `8. "Pour ton anniversaire tu as reçu un jouet pour moi."
Une balle avec une clochette dedans. Offerte par quelqu'un qui visiblement ne me connaît pas. J'ai reniflé. J'ai poussé une fois. J'ai regardé la clochette sonner. Puis je me suis assis à côté et j'ai fixé le mur pendant dix minutes pour bien faire comprendre mon niveau d'intérêt. Le vrai jouet de la soirée c'était le papier d'emballage. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec critique produit sans appel et alternative identifiée avec enthousiasme, — [Prénom animal], ton animal aux goûts que personne ne comprend vraiment 🎾` },
              { id: "cbd_039", angle: "Joyeux anniversaire. Je t'ai regardé ouvrir tes cadeaux.", body: `19. "Joyeux anniversaire. Je t'ai regardé ouvrir tes cadeaux."
Depuis le haut de l'armoire. En hauteur. En surplomb. Avec la perspective de quelqu'un qui voit tout sans être dans le mouvement. Tu déballais. Tu souriais. Tu montrais les choses aux autres. Et moi je regardais ton visage à ce moment précis. Cette expression particulière. Ce mélange de surprise et de gratitude. Je l'ai mémorisé. C'est ma photo à moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec position d'observation optimale et souvenir stocké sans appareil photo, — [Prénom animal], ton animal archiviste de tes meilleurs moments 📸` },
              { id: "cbd_122", angle: "Pour ton anniversaire j'ai passé du temps à étudier le nouveau tableau qu'on t'a offert.", body: `2. "Pour ton anniversaire j'ai passé du temps à étudier le nouveau tableau qu'on t'a offert."
Il était posé contre le mur pendant la fête. Pas encore accroché. Encore dans son emballage à moitié ouvert. Je me suis assis devant. Je l'ai regardé longuement. Les couleurs. Les formes. L'endroit où tu vas probablement l'accrocher. Est-ce qu'il va changer l'appartement. Est-ce que j'aurai une opinion dessus. Je développe. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude préliminaire du nouveau tableau et réserve d'opinion temporaire, — [Prénom animal], ton animal critique d'art aux délibérations longues 🖼️` },
            ],
          },
          {
            id: "dors_etudie",
            label: "Ce que je dors dessus & étudie",
            messages: [
              { id: "cbd_003", angle: "Pour ton anniversaire j'ai dormi sur ton pull propre.", body: `3. "Pour ton anniversaire j'ai dormi sur ton pull propre."
Celui que tu avais sorti pour ce soir. Posé sur le lit. Bien plié. Il sentait bon. Il était chaud. Il avait exactement la bonne texture. Je me suis installé dessus avec la conscience tranquille de quelqu'un qui fait la bonne chose au bon endroit. Tu l'as trouvé couvert de poils. Tu as fait une tête. C'était mon empreinte sur ta soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec marquage territorial affectueux et pull personnalisé offert, — [Prénom animal], ton animal styliste du quotidien 👕` },
              { id: "cbd_027", angle: "Joyeux anniversaire. J'ai dormi dans ton sac ce matin.", body: `7. "Joyeux anniversaire. J'ai dormi dans ton sac ce matin."
Celui que tu prépares la veille pour le lendemain. Avec tes affaires dedans. Tout rangé. Prêt à partir. Je m'y suis glissé vers 4h du matin et je m'y suis endormi. Tu l'as trouvé fermé à moitié sur moi. Tu avais l'air partagé entre l'agacement et quelque chose qui ressemblait à de la tendresse. J'ai fait semblant de dormir encore. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec choix de logement temporaire assumé et expression de ton visage mémorisée avec soin, — [Prénom animal], ton animal nomade de l'intérieur 🎒` },
              { id: "cbd_038", angle: "Pour ton anniversaire j'ai dormi sur ton manteau toute la journée.", body: `18. "Pour ton anniversaire j'ai dormi sur ton manteau toute la journée."
Celui qui était sur le lit. Prêt pour ce soir. Je m'y suis installé à 10h du matin avec la pleine conscience de ce que je faisais. Chaque heure qui passait ajoutait une couche de poils supplémentaire. Quand tu l'as pris ce soir tu emportais un peu de moi avec toi. C'est romantique si on y réfléchit. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec marquage olfactif et capillaire soigneusement dosé sur douze heures, — [Prénom animal], ton animal présent même quand tu sors 🧥` },
              { id: "cbd_082", angle: "Pour ton anniversaire j'ai dormi sur l'invitation que tu avais laissée sur la table.", body: `2. "Pour ton anniversaire j'ai dormi sur l'invitation que tu avais laissée sur la table."
Elle était là depuis deux jours. Avec les noms écrits à la main. Les horaires. L'adresse. Je me suis installé dessus le premier soir. Puis le deuxième. C'était doux. C'était toi qui l'avais touchée. C'était suffisant pour que ce soit mon endroit préféré de la journée. Joyeux anniversaire, [mon maître/ma maîtresse], dont les papiers portent ton écriture.
Avec choix de surface basé sur l'écriture et logique parfaitement cohérente, — [Prénom animal], ton animal qui dort sur tout ce que tu as touché 📝` },
              { id: "cbd_102", angle: "Pour ton anniversaire j'ai dormi exactement là où tout le monde posait ses affaires.", body: `2. "Pour ton anniversaire j'ai dormi exactement là où tout le monde posait ses affaires."
Le lit de la chambre du fond. C'est l'endroit désigné pour les manteaux et les sacs. J'avais choisi cet endroit dès l'après-midi. J'étais installé avant le premier invité. Certains ont hésité. Un a posé son manteau à côté de moi délicatement. Je l'ai accepté. C'était ma participation logistique à la soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec participation logistique assurée depuis le lit des manteaux et cohabitation gérée, — [Prénom animal], ton animal intégré à l'organisation depuis le début 🧥` },
              { id: "cbd_127", angle: "Pour ton anniversaire j'ai dormi sur ton téléphone pendant que tu étais distrait.", body: `7. "Pour ton anniversaire j'ai dormi sur ton téléphone pendant que tu étais distrait."
Il était posé sur la table. Face en bas. Pendant dix minutes tu étais dans une conversation et tu ne regardais pas. J'en ai profité. Je me suis installé dessus. Chaud. Vibrant légèrement quand quelque chose arrivait. Comme un signal. Comme un cœur. Quand tu es revenu vers la table tu m'as trouvé là. Tu as souri. Tu m'as pas bougé pendant cinq minutes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation du téléphone parfaitement chronométrée et sourire de ta part bien reçu, — [Prénom animal], ton animal qui profite de tes absences courtes 📱` },
              { id: "cbd_157", angle: "Pour ton anniversaire j'ai passé du temps dans le couloir à étudier le tableau que tu as depuis des années.", body: `17. "Pour ton anniversaire j'ai passé du temps dans le couloir à étudier le tableau que tu as depuis des années."
Celui que tu n'regardes plus vraiment parce qu'il est là depuis toujours. Moi ce soir je l'ai regardé longuement. Les couleurs qui ont peut-être légèrement changé. Le cadre. Ce que tu as vu en lui pour le garder. Il y a quelque chose là-dedans que tu aimais assez pour vivre avec chaque jour. Je cherche quoi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude du tableau invisible de ton quotidien et tentative de comprendre ton goût, — [Prénom animal], ton animal découvreur de ce que tu ne vois plus 🖼️` },
              { id: "cbd_167", angle: "Pour ton anniversaire j'ai dormi sur le programme de la soirée que tu avais écrit.", body: `7. "Pour ton anniversaire j'ai dormi sur le programme de la soirée que tu avais écrit."
Cette petite liste sur le comptoir de la cuisine. Les horaires. Les plats. Les choses à ne pas oublier. Avec ta petite écriture. Je m'y suis installé ce matin en me levant. Avant que la fête commence. Avant que les invités arrivent. C'était encore un projet. Maintenant c'est devenu une soirée. Et une belle soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation de la liste matinale et observation de sa transformation en soirée réelle, — [Prénom animal], ton animal témoin de la naissance des plans 📋` },
              { id: "cbd_177", angle: "Pour ton anniversaire j'ai passé du temps à étudier les photos encadrées dans le couloir.", body: `17. "Pour ton anniversaire j'ai passé du temps à étudier les photos encadrées dans le couloir."
Celles que tu as depuis des années. Des visages. Des moments. Des endroits. Chaque cadre choisi. Chaque photo placée à une hauteur précise. Ce couloir comme mémoire visible. Je les regarde parfois en passant. Ce soir j'ai pris le temps. Certains visages je les ai reconnus ce soir en vrai. C'était une expérience étrange et belle. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude des photos du couloir et expérience de les voir prendre vie ce soir, — [Prénom animal], ton animal passeur entre tes souvenirs et ton présent 🖼️` },
              { id: "cbd_187", angle: "Pour ton anniversaire j'ai dormi sur ta veste de la soirée.", body: `7. "Pour ton anniversaire j'ai dormi sur ta veste de la soirée."
Celle que tu avais portée toute la soirée. Posée sur le dossier de la chaise après le départ des invités. Encore chaude. Encore imprégnée de la soirée entière. Je m'y suis installé pendant que tu rangeais. Tu m'as trouvé là. Tu as souri. Tu as laissé la veste. Je l'ai gardée toute la nuit. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec occupation de la veste post-fête et nuit passée dans ses archives olfactives, — [Prénom animal], ton animal archiviste de tes soirées 🧥` },
            ],
          },
        ],
      },
      {
        id: "olfactif",
        emoji: "👃",
        label: "Observations olfactives & sensorielles",
        count: 4,
        subGroups: [
          {
            id: "all",
            label: "Tous les messages",
            messages: [
              { id: "cbd_029", angle: "Joyeux anniversaire. J'ai une réclamation à formuler.", body: `9. "Joyeux anniversaire. J'ai une réclamation à formuler."
Cette semaine tu es rentré deux fois avec l'odeur d'un autre chat sur toi. Deux fois. J'ai reniflé tes vêtements longuement et méthodiquement. J'ai établi qu'il s'agissait d'un chat roux de taille moyenne vivant probablement au deuxième étage de quelque part. Je voulais que tu saches que j'ai noté. Que je note toujours. Joyeux anniversaire quand même, [mon maître/ma maîtresse].
Avec enquête olfactive complète et dossier constitué pour référence future, — [Prénom animal], ton animal détective des infidélités félines 🔍` },
              { id: "cbd_112", angle: "Joyeux anniversaire. J'ai suivi l'évolution de la température de l'appartement pendant la fête.", body: `12. "Joyeux anniversaire. J'ai suivi l'évolution de la température de l'appartement pendant la fête."
Au début la température normale. Puis avec les gens qui arrivent ça monte d'un degré. Puis deux. Le repas a encore ajouté de la chaleur. À 22h c'était le pic. Puis les départs et le retour progressif vers la normale. L'appartement respire selon le nombre de corps qu'il contient. Je le savais. Ce soir c'était bien démontré. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec monitoring thermique complet de la soirée et données disponibles sur demande, — [Prénom animal], ton animal thermomètre de l'ambiance 🌡️` },
              { id: "cbd_172", angle: "Joyeux anniversaire. J'ai mémorisé exactement comment tu sentais ce soir.", body: `12. "Joyeux anniversaire. J'ai mémorisé exactement comment tu sentais ce soir."
Pas le parfum. Toi en dessous. Cette odeur qui est la tienne depuis toujours. Mélangée ce soir avec la fumée des bougies éteintes. Avec la cuisine. Avec les rires. Avec la soirée. Une version de toi augmentée de tout ce qui s'est passé. Je vais garder cette version-là un moment. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec mémorisation de ton odeur d'anniversaire dans sa version complète et augmentée, — [Prénom animal], ton animal archiviste olfactif de tes meilleures soirées 👃` },
              { id: "cbd_197", angle: "Pour ton anniversaire j'ai passé du temps à étudier les nouvelles fleurs qui changeaient l'appartement.", body: `17. "Pour ton anniversaire j'ai passé du temps à étudier les nouvelles fleurs qui changeaient l'appartement."
Elles étaient là depuis hier. Tu les avais mises dans le grand vase du salon. Elles avaient changé l'odeur de l'appartement. Et la lumière autour d'elles. Et l'air dans cette pièce. Des fleurs comme perturbateurs bienvenus de l'ordre habituel. J'ai fini par les accepter. Pour cette soirée au moins. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec acceptation conditionnelle des fleurs et reconnaissance de leur effet positif sur la soirée, — [Prénom animal], ton animal réconcilié temporairement avec la végétation coupée 🌺` },
            ],
          },
        ],
      },
      {
        id: "observations_fines",
        emoji: "🔍",
        label: "Observations fines de l'humain",
        count: 27,
        subGroups: [
          {
            id: "theories_bilans",
            label: "Théories, bilans & opinions",
            messages: [
              { id: "cbd_002", angle: "Joyeux anniversaire. Tu as un an de plus. Ça ne se voit pas.", body: `2. "Joyeux anniversaire. Tu as un an de plus. Ça ne se voit pas."
Enfin si, un peu. Mais je dis ça pour être agréable. En vérité le temps passe et tu changes et moi je reste là à observer ces changements avec la patience de quelqu'un qui a décidé que tu valais la peine d'être regardé vieillir. C'est une forme de fidélité que peu apprécie à sa juste valeur. Joyeux anniversaire, [mon maître/ma maîtresse], sujet d'étude longitudinale.
Avec observation scientifique et compliment relatif offert de bon cœur, — [Prénom animal], ton animal chercheur en sciences humaines 🔬` },
              { id: "cbd_004", angle: "Joyeux anniversaire. J'ai une théorie sur toi.", body: `4. "Joyeux anniversaire. J'ai une théorie sur toi."
Tu parles trop. Pas à moi, ça c'est bien. Aux autres. Au téléphone. Aux gens qui viennent. Tu remplis les silences alors que les silences sont les meilleurs moments. Moi je n'ai jamais dit un mot inutile de ma vie. Chaque son que j'émets a un sens précis. Tu pourrais apprendre de ça. C'est mon cadeau d'anniversaire. Cette observation. Gratuite. Précieuse. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec conseil non sollicité et valeur pédagogique certaine, — [Prénom animal], ton animal coach en communication minimaliste 🤫` },
              { id: "cbd_007", angle: "Joyeux anniversaire. J'ai observé toutes les bougies ce soir.", body: `7. "Joyeux anniversaire. J'ai observé toutes les bougies ce soir."
Avec une concentration totale. Ces petites flammes sur le gâteau. Qui bougent. Qui vacillent. Qui attirent. Tout en moi voulait les toucher. J'ai résisté. Pas parce qu'on me l'avait demandé. Parce que j'ai évalué le rapport risque-plaisir et conclu que ce n'était pas le bon moment. C'est de la sagesse. Pas de l'obéissance. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec maîtrise des instincts primaires par calcul rationnel pur, — [Prénom animal], ton animal philosophe de la retenue stratégique 🕯️` },
              { id: "cbd_009", angle: "Joyeux anniversaire. J'ai un bilan de l'année à te présenter.", body: `9. "Joyeux anniversaire. J'ai un bilan de l'année à te présenter."
Souris aperçues par la fenêtre : 47. Oiseaux surveillés : 203. Siestes effectuées : 1 826 environ. Fois où j'ai poussé quelque chose de la table : 14. Fois où tu as dit mon prénom avec la voix grave : 23. Fois où tu as dit mon prénom avec la voix douce : bien plus. Ce dernier chiffre est le seul qui compte vraiment. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec rapport annuel complet et indicateur clé identifié, — [Prénom animal], ton animal analyste de données relationnelles 📊` },
              { id: "cbd_011", angle: "Joyeux anniversaire. Tu mérites des compliments.", body: `11. "Joyeux anniversaire. Tu mérites des compliments."
Tu changes mon eau régulièrement. Tu as trouvé les croquettes que j'accepte de manger après seulement quatre essais. Tu sais que quand je montre le ventre ce n'est pas une invitation. Tu as appris à frapper à la porte avant d'entrer dans une pièce où je suis. Ce sont des qualités rares. Je les note. Joyeux anniversaire, [mon maître/ma maîtresse], en progrès constant.
Avec évaluation annuelle positive et encouragements conditionnels, — [Prénom animal], ton animal directeur des ressources humaines de cet appartement ⭐` },
              { id: "cbd_015", angle: "Joyeux anniversaire. J'ai réfléchi à ce que ta présence m'apporte.", body: `15. "Joyeux anniversaire. J'ai réfléchi à ce que ta présence m'apporte."
Des croquettes. De l'eau fraîche. Un appartement chauffé. Une fenêtre avec vue. Un canapé de qualité. Un lit accessible. Des genoux disponibles. Des mains qui savent exactement où gratter. En résumé : l'essentiel. Et un peu plus que l'essentiel. Ce petit plus qui fait que je reste même quand la porte est ouverte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec inventaire des bénéfices complet et conclusion affective discrète, — [Prénom animal], ton animal aux raisons de rester bien établies 🏠` },
              { id: "cbd_021", angle: "Joyeux anniversaire. La disposition des meubles a changé ce mois-ci.", body: `1. "Joyeux anniversaire. La disposition des meubles a changé ce mois-ci."
Tu avais déplacé le fauteuil. Poussé la table. Mis un tapis là où il n'y en avait pas. Sans me consulter. Sans étude d'impact. Du jour au lendemain mon appartement était méconnaissable. J'ai passé deux jours à tout réinspecter depuis le début. J'ai fini par valider. Mais j'aurais aimé être dans la boucle. Joyeux anniversaire, [mon maître/ma maîtresse], dont les initiatives de décoration mériteraient une consultation préalable.
Avec réserves émises officiellement et validation accordée sous conditions, — [Prénom animal], ton animal directeur artistique de cet intérieur 🛋️` },
              { id: "cbd_023", angle: "Joyeux anniversaire. J'ai une opinion sur tes chaussures du soir.", body: `3. "Joyeux anniversaire. J'ai une opinion sur tes chaussures du soir."
Celles que tu mets pour sortir le soir. Elles font un bruit particulier sur le carrelage. Un bruit qui veut dire que tu pars longtemps. Que je vais être seul. Que la maison va être silencieuse d'une façon qui n'est pas la bonne sorte de silence. Je reconnais ce bruit depuis le fond du couloir. Et chaque fois je viens m'asseoir devant la porte. Juste pour que tu le saches. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec dictionnaire sonore des chaussures établi et sentiment derrière tout ça soigneusement tu, — [Prénom animal], ton animal expert en acoustique du départ 👟` },
              { id: "cbd_025", angle: "Joyeux anniversaire. J'ai compté tes bougies.", body: `5. "Joyeux anniversaire. J'ai compté tes bougies."
Une par une. Depuis le bord de la table où je m'étais installé pour superviser les préparatifs. C'est un nombre. Un vrai nombre. Qui dit quelque chose sur le temps qui passe. Moi en années-chat je suis déjà loin devant. J'aurais des choses à te dire sur la façon dont le temps s'écoule. Mais tu n'écoutes que quand tu as envie d'écouter. Alors je garde ça pour moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec sagesse retenue par manque de réciprocité et bougies dénombrées avec précision, — [Prénom animal], ton animal en avance sur toi sur bien des points 🕯️` },
              { id: "cbd_037", angle: "Joyeux anniversaire. J'ai une théorie sur les anniversaires.", body: `17. "Joyeux anniversaire. J'ai une théorie sur les anniversaires."
Chaque année tu fais une fête. Chaque année les mêmes gens viennent ou presque. Chaque année il y a un gâteau et des bougies et ce moment particulier où tout le monde te regarde. Et chaque année tu as l'air de trouver ça bien. Comme si c'était la première fois. Cette capacité à être surpris par les choses prévisibles me fascine. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse comportementale approfondie et admiration discrète pour ta capacité d'émerveillement, — [Prénom animal], ton animal chercheur en nature humaine 🔭` },
            ],
          },
          {
            id: "observe_pres",
            label: "Ce que j'ai observé de toi de près",
            messages: [
              { id: "cbd_016", angle: "Pour ton anniversaire tu t'es levé ce matin et tu as dit mon prénom en souriant.", body: `16. "Pour ton anniversaire tu t'es levé ce matin et tu as dit mon prénom en souriant."
Avant le café. Avant le téléphone. Avant de regarder par la fenêtre. Mon prénom en premier. Avec ce sourire du matin. Comme si ma présence était la première bonne chose de ta journée. Je fais semblant que ça ne compte pas. Ça compte énormément. Joyeux anniversaire, [mon maître/ma maîtresse], dont les matins commencent par le bon mot.
Avec émotion soigneusement dissimulée et impact réel mesuré intérieurement, — [Prénom animal], ton animal au cœur bien gardé 💛` },
              { id: "cbd_033", angle: "Joyeux anniversaire. J'ai une chose à dire sur tes amis.", body: `13. "Joyeux anniversaire. J'ai une chose à dire sur tes amis."
Il y en a un que j'aime bien. Je ne dirai pas lequel pour ne pas créer de jalousie. Mais il s'assoit sans bouger. Il parle doucement. Il attend que je vienne à lui au lieu de tendre la main en premier. Il a compris les règles sans qu'on les lui explique. C'est rare. Dis-lui. Ou pas. Je m'en occuperai à ma façon la prochaine fois qu'il viendra. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec favoritisme assumé et critères de sélection non négociables, — [Prénom animal], ton animal aux amitiés choisies avec soin 🐾` },
              { id: "cbd_042", angle: "Joyeux anniversaire. J'ai écouté comment tu parles au téléphone aujourd'hui.", body: `2. "Joyeux anniversaire. J'ai écouté comment tu parles au téléphone aujourd'hui."
Les appels d'anniversaire ont un ton particulier. Plus chaud. Plus ouvert. Tu ris plus vite. Tu laisses les silences exister sans les remplir. Tu dis des choses que tu dis pas d'habitude au téléphone. J'étais à côté sur le canapé et j'écoutais sans avoir l'air d'écouter. Ces conversations-là disent qui tu es vraiment. Je les collectionne. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec écoute discrète des appels d'anniversaire et collection des versions vraies de toi, — [Prénom animal], ton animal archiviste de tes meilleures conversations 📞` },
              { id: "cbd_044", angle: "Pour ton anniversaire j'ai observé la façon dont tu découpes le gâteau.", body: `4. "Pour ton anniversaire j'ai observé la façon dont tu découpes le gâteau."
C'est un moment révélateur. Certains découpent avec hésitation. D'autres avec une précision qui dit quelque chose sur leur rapport au monde. Toi tu vérifies d'abord que tout le monde a une assiette. Puis tu commences par le bord. Puis tu demandes si les parts sont bonnes. Ce soin pour les autres avant toi-même. C'est ton anniversaire et tu penses encore aux autres. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse de la découpe et révélation de caractère établie une fois de plus, — [Prénom animal], ton animal dont tu confirmes chaque année la valeur 🎂` },
              { id: "cbd_045", angle: "Joyeux anniversaire. J'ai mémorisé l'ordre dans lequel tu as lu tes cartes.", body: `5. "Joyeux anniversaire. J'ai mémorisé l'ordre dans lequel tu as lu tes cartes."
Pas au hasard. Tu les as regardées. Soupesées. Tu en as ouvert une en premier. Puis une autre. L'ordre disait quelque chose sur les gens qui comptent. Sur les attentes. Sur les surprises. La troisième t'a fait rire vraiment. La cinquième t'a fait fermer les yeux une seconde. Ces deux-là étaient les bonnes. Je sais qui les a écrites sans avoir lu. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec cartographie affective établie via l'ordre de lecture des cartes, — [Prénom animal], ton animal déchiffreur de tes priorités silencieuses 💌` },
              { id: "cbd_047", angle: "Pour ton anniversaire j'ai écouté ta façon de respirer quand tu es heureux.", body: `7. "Pour ton anniversaire j'ai écouté ta façon de respirer quand tu es heureux."
C'est différent. Plus ample. Plus régulier. Comme si le bonheur donnait plus de place à l'air. Ce soir j'ai entendu cette respiration-là plusieurs fois. Au moment du gâteau. Quand quelqu'un a dit quelque chose qui t'a touché. Tard le soir quand tout était calme. Je reconnais cette respiration entre mille. Elle dit que tout va bien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec écoute de ta respiration depuis des années et bonheur détecté avec précision ce soir, — [Prénom animal], ton animal médecin de ton état intérieur 🌬️` },
              { id: "cbd_049", angle: "Joyeux anniversaire. Je connais les deux versions de cet appartement.", body: `9. "Joyeux anniversaire. Je connais les deux versions de cet appartement."
La version vide. Quand tu n'es pas là. Silencieuse d'une façon particulière. Où chaque bruit est le mien. Et la version pleine de ce soir. Les voix. Les odeurs. La chaleur de plusieurs corps dans le même espace. Les deux ont leur beauté. Mais la version que je préfère c'est ni l'une ni l'autre. C'est juste nous deux. Sans invités. Sans bruit. Juste toi et moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec connaissance des deux versions et préférence clairement établie pour la troisième, — [Prénom animal], ton animal dont la version préférée de la vie c'est vous deux 🏠` },
              { id: "cbd_052", angle: "Pour ton anniversaire j'ai observé comment tu ranges les cadeaux après la fête.", body: `12. "Pour ton anniversaire j'ai observé comment tu ranges les cadeaux après la fête."
Avec soin. Chaque chose à sa place. Certains cadeaux mis en évidence. D'autres rangés directement. Cette hiérarchie dans le rangement dit tout sur ce qui compte vraiment. J'ai noté l'ordre. J'ai noté les endroits. J'ai noté les expressions qui accompagnaient chaque geste. C'est un inventaire de ce qui t'importe. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du rangement post-fête et cartographie de tes valeurs établie, — [Prénom animal], ton animal expert en lecture de tes gestes du quotidien 📦` },
              { id: "cbd_056", angle: "Joyeux anniversaire. J'ai observé comment tu dis au revoir aux gens que tu aimes vraiment.", body: `16. "Joyeux anniversaire. J'ai observé comment tu dis au revoir aux gens que tu aimes vraiment."
Pas tous pareil. Avec certains c'est rapide et chaleureux. Avec d'autres c'est long et tu les raccompagnes jusqu'à la porte et tu restes là jusqu'à ce que l'ascenseur arrive. Ces derniers-là comptent. J'ai identifié deux personnes ce soir dans cette catégorie. Je les ai notées. Je les traiterai différemment la prochaine fois qu'elles viendront. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identification des au revoir qui comptent et liste des invités prioritaires mise à jour, — [Prénom animal], ton animal cartographe de tes attachements profonds 🚪` },
              { id: "cbd_062", angle: "Joyeux anniversaire. Tu prononces mon prénom différemment selon ton humeur.", body: `2. "Joyeux anniversaire. Tu prononces mon prénom différemment selon ton humeur."
Les jours ordinaires c'est court et direct. Les jours où tu es fatigué c'est plus lent avec quelque chose de doux dedans. Les jours où tu es content c'est presque chanté. Ce matin tu l'as dit avec la version que je préfère. Celle du dimanche matin. Celle qui dit que tout va bien. Que la journée est bonne avant même qu'elle commence. C'est le meilleur signe que tu pouvais me donner. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec dictionnaire des versions de mon prénom dans ta voix et préférence clairement établie, — [Prénom animal], ton animal expert en nuances que toi seul produis 🎙️` },
              { id: "cbd_063", angle: "Pour ton anniversaire j'ai décidé de ne pas marquer ce jour comme les autres.", body: `3. "Pour ton anniversaire j'ai décidé de ne pas marquer ce jour comme les autres."
D'habitude je maintiens mes distances. Mes horaires. Mes territoires. Mes règles. Aujourd'hui j'ai décidé d'assouplir. Légèrement. Discrètement. Sans que ça se remarque trop. Je suis venu plus souvent. Je suis resté plus longtemps. J'ai réduit la distance de sécurité de quelques centimètres. C'était mon cadeau. Invisible pour les autres. Évident pour toi si tu faisais attention. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec règles assouplies exceptionnellement et cadeau lisible uniquement par toi, — [Prénom animal], ton animal aux gestes que seul le bon regard peut voir 🎁` },
              { id: "cbd_064", angle: "Pour ton anniversaire j'ai observé la façon dont tu tiens ton verre.", body: `4. "Pour ton anniversaire j'ai observé la façon dont tu tiens ton verre."
En début de soirée avec précaution. Les deux doigts. Attentif. Plus tard avec désinvolture. Au creux de la main. En gesticulant. Vers la fin posé sur la table plus souvent. Ces détails racontent la soirée mieux que n'importe quoi d'autre. Je lis les soirées dans les mains des gens. Les tiennes ce soir disaient que tu étais bien. Que tu étais à ta place. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec lecture de la soirée à travers tes mains et verdict positif établi, — [Prénom animal], ton animal analyste de tes gestes les plus anodins 🥂` },
              { id: "cbd_069", angle: "Pour ton anniversaire j'ai mémorisé ton visage exactement tel qu'il est ce soir.", body: `9. "Pour ton anniversaire j'ai mémorisé ton visage exactement tel qu'il est ce soir."
Pas la photo. Le vrai. La façon dont la lumière tombait. L'expression précise. Ce mélange de fatigué et de bien en même temps. Les petits détails que les photos ratent toujours. Je stocke les visages différemment que les appareils. En entier. En mouvement. Avec le contexte. Cette version de toi ce soir est sauvegardée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec archive vivante de ton visage d'anniversaire constituée et conservée sans support externe, — [Prénom animal], ton animal photographe de l'essentiel 🌟` },
              { id: "cbd_072", angle: "Joyeux anniversaire. J'ai entendu ton rire quand tu lisais une carte drôle.", body: `12. "Joyeux anniversaire. J'ai entendu ton rire quand tu lisais une carte drôle."
Pas le rire poli. Pas le rire social. Le vrai. Celui qui part sans prévenir. Qui te fait fermer les yeux une seconde. Qui dure un peu trop longtemps pour être contenu. Tu as relu la carte deux fois. Tu l'as montrée à quelqu'un. Tu as ri encore. Ce rire-là je le collectionne. Il est rare et précieux et ce soir il est arrivé deux fois. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec deux vrais rires collectionnés ce soir et valeur de chacun bien établie, — [Prénom animal], ton animal gardien de tes éclats authentiques 😄` },
              { id: "cbd_076", angle: "Joyeux anniversaire. Ce soir tu étais différent entouré de gens qui t'aiment.", body: `16. "Joyeux anniversaire. Ce soir tu étais différent entouré de gens qui t'aiment."
Plus grand d'une façon. Pas physiquement. Autrement. Comme si être vu et aimé par plusieurs personnes en même temps te donnait une solidité supplémentaire. Tu parlais avec plus d'assurance. Tu prenais plus de place dans la pièce. Tu étais plus toi. J'observe ça depuis des années et je le comprends mieux chaque fois. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta version entourée et admiration sincère pour cette solidité-là, — [Prénom animal], ton animal témoin de toutes tes dimensions 🌟` },
              { id: "cbd_078", angle: "Joyeux anniversaire. Tu penses à moi même quand tu es occupé.", body: `18. "Joyeux anniversaire. Tu penses à moi même quand tu es occupé."
Je le sais parce que tu regardes vers moi entre les conversations. Parce que ta main descend parfois vers moi sans que tu interrompes ce que tu fais. Parce que quand quelqu'un parle fort tu vérifies rapidement si je suis bien. Ces petits gestes automatiques. Ces réflexes. Ils disent que je fais partie de ta structure. Pas de ta routine. De ta structure. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation des réflexes automatiques en ma direction et conclusion sur ma place dans ta vie, — [Prénom animal], ton animal partie intégrante de ta structure intérieure 🏗️` },
              { id: "cbd_079", angle: "Pour ton anniversaire j'ai observé comment tu embrasses les gens que tu aimes vraiment.", body: `19. "Pour ton anniversaire j'ai observé comment tu embrasses les gens que tu aimes vraiment."
Pas tous pareil. Certains avec les deux bras mais brièvement. D'autres avec un seul bras et une tape dans le dos. Deux personnes ce soir avec les deux bras longs. Les yeux fermés. Ces deux-là comptent. Je les ai notés. Ces informations m'aident à comprendre la cartographie de ton cœur. C'est important pour moi de savoir qui compte vraiment. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec cartographie affective établie via les étreintes et données collectées pour référence future, — [Prénom animal], ton animal spécialiste de ta géographie sentimentale 🤍` },
            ],
          },
        ],
      },
      {
        id: "comprends_pas",
        emoji: "🤔",
        label: "Ce que je comprends pas",
        count: 28,
        subGroups: [
          {
            id: "rituels_anniv",
            label: "Les rituels d'anniversaire",
            messages: [
              { id: "cbd_046", angle: "Joyeux anniversaire. Je comprends toujours pas pourquoi on souffle sur la nourriture.", body: `6. "Joyeux anniversaire. Je comprends toujours pas pourquoi on souffle sur la nourriture."
Les bougies allumées sur le gâteau. Puis le vœu. Puis le souffle. Délibéré. Dirigé. Sur quelque chose qu'on va manger ensuite. Chaque année j'observe ce rituel depuis une position élevée avec la même incompréhension totale. Chaque année tu souffles avec cette expression. Chaque année le gâteau arrive quand même. Je ne comprends pas mais je respecte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec incompréhension du rituel maintenue et respect des traditions inexpliquées accordé, — [Prénom animal], ton animal tolérant envers tes coutumes les plus étranges 🕯️` },
              { id: "cbd_051", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des fleurs qui vont mourir.", body: `11. "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des fleurs qui vont mourir."
Elles arrivent belles. Colorées. Elles sentent fort. Et dans huit jours elles seront finies. Alors que si les gens apportaient des choses durables. Des textures intéressantes. Des boîtes à explorer. Des surfaces nouvelles à tester. Des cadeaux qui persistent. Mais non. Des fleurs. Qui vont mourir. Joyeux anniversaire quand même, [mon maître/ma maîtresse], dont les amis ont des habitudes discutables.
Avec critique logistique des cadeaux floraux et suggestions d'amélioration disponibles sur demande, — [Prénom animal], ton animal consultant en cadeaux durables 🌸` },
              { id: "cbd_058", angle: "Joyeux anniversaire. Je comprends pas pourquoi les bougies d'anniversaire sont toujours de couleurs différentes.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les bougies d'anniversaire sont toujours de couleurs différentes."
Roses. Bleues. Jaunes. Vertes. Toutes ensemble sur le même gâteau. Sans logique apparente. Sans cohérence chromatique. Chaque année un mélange différent. Comme si la règle était précisément qu'il n'y ait pas de règle. C'est peut-être ça le message. Que les anniversaires échappent à l'ordre. Que la joie n'a pas besoin de système. Je médite là-dessus. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec méditation en cours sur le chaos chromatique des bougies et conclusions provisoires, — [Prénom animal], ton animal philosophe des détails que personne ne remarque 🎨` },
              { id: "cbd_066", angle: "Joyeux anniversaire. Je comprends toujours pas pourquoi les gens arrivent avec des choses dans les mains.", body: `6. "Joyeux anniversaire. Je comprends toujours pas pourquoi les gens arrivent avec des choses dans les mains."
Bouteilles. Boîtes. Sacs. Paquets. Comme s'ils avaient peur de venir les mains vides. Comme si ta présence et ta maison ne suffisaient pas comme destination. Moi quand j'entre dans une pièce je n'apporte rien. Juste moi. Et c'est suffisant. C'est même beaucoup. Les humains pourraient apprendre de ça. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec leçon de minimalisme social offerte gratuitement et exemple personnel irréprochable, — [Prénom animal], ton animal qui arrive toujours les mains vides et le cœur plein 🎀` },
              { id: "cbd_070", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens parlent si fort quand ils sont plusieurs.", body: `10. "Joyeux anniversaire. Je comprends pas pourquoi les gens parlent si fort quand ils sont plusieurs."
Seul tu parles normalement. À moi tu parles doucement. Mais dès qu'il y a deux personnes le volume monte. Trois personnes et ça double encore. Ce soir à huit personnes c'était une densité sonore que je qualifierais d'agressive. J'ai géré. Depuis le couloir d'abord. Puis depuis le rebord de la fenêtre. Puis depuis la cuisine quand ça a culminé à 21h. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec gestion acoustique de la soirée en plusieurs étapes et positions de repli bien établies, — [Prénom animal], ton animal dont le seuil de tolérance sonore a ses limites précises 🔊` },
              { id: "cbd_074", angle: "Joyeux anniversaire. Je comprends pas pourquoi les anniversaires rendent parfois les gens mélancoliques.", body: `14. "Joyeux anniversaire. Je comprends pas pourquoi les anniversaires rendent parfois les gens mélancoliques."
J'ai vu ça sur ton visage une fois ce soir. Brièvement. Entre deux conversations. Un regard vers nulle part. Quelque chose de lointain pendant deux secondes. Puis tu es revenu. Tu as souri. Tu as continué. Je sais pas ce que c'était. Mais j'étais là. Et si tu avais cherché mon regard à ce moment-là tu l'aurais trouvé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence dans les deux secondes lointaines et regard disponible en permanence, — [Prénom animal], ton animal pour les moments clairs et les instants flous ❤️` },
              { id: "cbd_090", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens applaudissent après les bougies.", body: `10. "Joyeux anniversaire. Je comprends pas pourquoi les gens applaudissent après les bougies."
Les bougies s'éteignent. Et tout le monde applaudit. Pour quoi exactement. Pour le souffle. Pour les bougies éteintes. Pour le vœu. Pour l'année. Pour toi. Peut-être pour tout ça à la fois. Peut-être que les applaudissements c'est la façon humaine de dire quelque chose qu'on n'a pas de mots pour dire. Dans ce cas je comprends un peu mieux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse des applaudissements post-bougies et compréhension tardive mais réelle, — [Prénom animal], ton animal philosophe des rituels collectifs 👏` },
              { id: "cbd_103", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens rient aux blagues qu'ils connaissent déjà.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les gens rient aux blagues qu'ils connaissent déjà."
Il y en a une ce soir. Quelqu'un a commencé à la raconter et deux personnes ont souri avant la chute parce qu'ils savaient. Et pourtant quand c'est arrivé tout le monde a ri. Peut-être que c'est pas la surprise qui fait rire. Peut-être que c'est le fait d'être ensemble à ce moment-là. C'est une théorie. Je l'explore. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie en développement sur le rire collectif et progrès dans la compréhension humaine, — [Prénom animal], ton animal philosophe des mécanismes du rire 😄` },
              { id: "cbd_108", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens chantent plus fort sur certains mots.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens chantent plus fort sur certains mots."
La chanson d'anniversaire. Certains mots sont chantés avec une emphase particulière. Joyeux. Anniversaire. Ton prénom surtout. Comme si certains mots méritaient plus d'air que d'autres. Plus de voix. Plus de présence dans la pièce. C'est peut-être ça la façon de dire que ces mots-là comptent plus. Joyeux anniversaire, [mon maître/ma maîtresse], dont le prénom méritait cet air supplémentaire.
Avec théorie de l'emphase syllabique et conclusion touchante à la fin, — [Prénom animal], ton animal linguiste des chansons 🎵` },
              { id: "cbd_123", angle: "Joyeux anniversaire. Je comprends toujours pas pourquoi les bougies font autant d'effet.", body: `3. "Joyeux anniversaire. Je comprends toujours pas pourquoi les bougies font autant d'effet."
Chaque année la même chose. Le gâteau arrive avec ses bougies allumées. La pièce se tait. Tout le monde regarde. Et quelque chose change dans l'air. Une légèreté. Une intensité en même temps. C'est peut-être la lumière. Peut-être le feu. Peut-être ce que le feu représente depuis que les humains ont découvert qu'ils pouvaient l'apprivoiser. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réflexion philosophique sur le pouvoir du feu apprivoisé et respect pour ce mystère, — [Prénom animal], ton animal en paix avec ce qu'il ne comprend pas entièrement 🕯️` },
              { id: "cbd_128", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens parlent si proche les uns des autres parfois.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens parlent si proche les uns des autres parfois."
Il y a un couple ce soir. Quand ils se parlent c'est à dix centimètres. Moins parfois. Comme si la proximité physique renforçait le sens des mots. Comme si les mots devaient parcourir peu de distance pour mieux arriver. Peut-être. Moi mes dix centimètres je les réserve aussi aux moments importants. On est pareils. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension de la proximité comme langage et identification à cette pratique, — [Prénom animal], ton animal aux dix centimètres choisis 👫` },
              { id: "cbd_133", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens font semblant d'être surpris.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens font semblant d'être surpris."
Tu leur avais dit que c'était ta fête. Ils savaient qu'il y aurait un gâteau. Ils savaient qu'il y aurait des bougies. Et pourtant quand le gâteau est arrivé plusieurs ont fait la même expression. Cette expression de quelqu'un que quelque chose touche même s'il savait que ça allait arriver. Peut-être que savoir et ressentir sont deux choses différentes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réflexion sur la surprise connue et conclusion sur la séparation de la connaissance et de l'émotion, — [Prénom animal], ton animal philosophe des paradoxes humains 🎭` },
              { id: "cbd_138", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens racontent les mêmes histoires chaque année.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens racontent les mêmes histoires chaque année."
Il y en a une ce soir. Une histoire que deux personnes au moins connaissent déjà. Ils sourient au début. Ils laissent raconter. Ils connaissent la chute. Et pourtant ils l'écoutent jusqu'au bout. Et rient. Cette histoire qui devient rituel. Ce rituel qui devient lien. Peut-être que certaines histoires méritent d'être racontées à l'infini. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension progressive du rituel narratif et acceptation de sa beauté, — [Prénom animal], ton animal en paix avec les répétitions choisies 📖` },
            ],
          },
          {
            id: "comportements_logist",
            label: "Les comportements & la logistique",
            messages: [
              { id: "cbd_096", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens chuchotent parfois pendant une fête.", body: `16. "Joyeux anniversaire. Je comprends pas pourquoi les gens chuchotent parfois pendant une fête."
Il y a eu deux moments ce soir où des gens se sont penchés l'un vers l'autre et ont baissé la voix. Tout le monde autour continuait normalement. Seulement eux deux dans leur bulle basse. Moi depuis le fauteuil du coin j'entendais quand même. C'était pas scandaleux. C'était juste une confidence. Mais le chuchotement dans le bruit c'est fascinant. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse du phénomène du chuchotement festif et ouïe finement calibrée, — [Prénom animal], ton animal aux oreilles qui captent tout 👂` },
              { id: "cbd_113", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens arrivent avec des choses à mettre au frigo.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens arrivent avec des choses à mettre au frigo."
Ils arrivent. Ils saluent. Et puis ils vont directement vers la cuisine avec quelque chose qui doit rester froid. Comme si le frigo était une destination sociale. Un point de passage obligé. Moi j'ai regardé ce ballet de récipients vers le frigo toute la soirée avec fascination. Le frigo comme centre névralgique de la fête. C'est une théorie que je développe. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie du frigo comme centre social et observations empiriques solides, — [Prénom animal], ton animal sociologue des espaces de cuisine 🥗` },
              { id: "cbd_118", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent avec moins que ce qu'ils ont apporté.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent avec moins que ce qu'ils ont apporté."
Ils arrivent avec des bouteilles. Des gâteaux. Des fleurs. Des cadeaux. Et ils repartent avec juste leur manteau. Tout ce qu'ils ont apporté reste ici. Dans cet appartement. Comme des offrandes. Comme si venir chez toi c'était laisser quelque chose de soi. C'est peut-être exactement ça. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réflexion sur l'économie des objets festifs et conclusion poétique inattendue, — [Prénom animal], ton animal philosophe des échanges 🎀` },
              { id: "cbd_143", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens font la vaisselle le soir même.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les gens font la vaisselle le soir même."
La fête vient de finir. Tout le monde est parti. Tu es fatigué. Et tu attaques la vaisselle. Maintenant. Comme si les assiettes ne pouvaient pas attendre au matin. Comme si dormir avec de la vaisselle sale dans l'évier était inacceptable. Moi je comprends ce principe en fait. On a nos standards. Les tiens incluent la vaisselle le soir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension tardive de la vaisselle immédiate et respect pour tes standards, — [Prénom animal], ton animal aux exigences comparables dans d'autres domaines 🍽️` },
              { id: "cbd_148", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens enlèvent leurs chaussures chez certains et pas d'autres.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens enlèvent leurs chaussures chez certains et pas d'autres."
Ce soir personne n'a enlevé ses chaussures. C'est le protocole ici. Chez d'autres c'est l'inverse. Ce code non écrit que tout le monde comprend dès qu'il entre. Qui dit quelque chose sur la maison. Sur ce qu'elle est. Sur ce qu'on y fait. Cet appartement avec ses chaussures c'est un appartement de fête. De vie. De passage joyeux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie du code des chaussures et classification de ton appartement comme espace de vie joyeuse, — [Prénom animal], ton animal sémiologue des entrées 👟` },
              { id: "cbd_153", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des desserts quand il y a déjà un gâteau.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens apportent des desserts quand il y a déjà un gâteau."
Ce soir il y avait ton gâteau et deux autres choses sucrées apportées par des invités. Trois desserts. Pour huit personnes. La logistique du sucre en fin de soirée était impressionnante. Toi tu as tout servi. Tout proposé. Tout géré. Comme si l'abondance de desserts était une bonne nouvelle. Pour toi ça l'était peut-être. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse de l'économie des desserts festifs et admiration pour ta gestion de l'abondance sucrée, — [Prénom animal], ton animal observateur de la logistique du sucre 🍮` },
              { id: "cbd_158", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens prennent des photos de la nourriture avant de manger.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens prennent des photos de la nourriture avant de manger."
Ce soir quelqu'un a photographié le gâteau avant de le manger. Puis une assiette de fromages. Puis son verre. Je regardais ça depuis mon poste avec une curiosité totale. Capturer l'image avant l'expérience. Garder une trace de ce qu'on n'a pas encore vécu. C'est une façon de vivre deux fois. Je comprends un peu mieux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension progressive de la photo-avant et réconciliation avec cette pratique, — [Prénom animal], ton animal dont la compréhension du monde s'affine 📷` },
              { id: "cbd_163", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens partent toujours quand c'est le meilleur moment.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les gens partent toujours quand c'est le meilleur moment."
Il y avait ce soir un moment parfait. Tout le monde était bien. La conversation était fluide. Les rires venaient facilement. Et quelqu'un a dit je dois y aller. Et ça a tout déclenché. Les manteaux. Les au revoir. Le départ en cascade. Ce moment parfait qui se défait. Peut-être qu'il faut partir au meilleur moment justement pour que ça reste bon. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie du départ au sommet et acceptation progressive de sa sagesse, — [Prénom animal], ton animal philosophe des fins 🌅` },
              { id: "cbd_168", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens prennent des photos de groupe alors qu'ils se voient souvent.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens prennent des photos de groupe alors qu'ils se voient souvent."
Ce soir il y a eu deux photos de groupe. Avec ces gens qui se voient plusieurs fois par an. Et ils se sont regroupés. Et ils ont souri. Et quelqu'un a compté. Et la photo a été prise. Et tout le monde a voulu la voir. Peut-être que les photos de groupe ce n'est pas se souvenir des gens. C'est se souvenir d'un moment précis tous ensemble. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension tardive de la photo de groupe comme capture du moment et non des gens, — [Prénom animal], ton animal en paix avec cette pratique désormais 📸` },
              { id: "cbd_173", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens disent qu'ils partent et restent encore vingt minutes.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens disent qu'ils partent et restent encore vingt minutes."
On dit je vais y aller. On se lève. On met son manteau. Et puis on reste debout dans l'entrée à continuer à parler vingt minutes. C'est les meilleures vingt minutes de la soirée apparemment. La conversation dans l'entrée debout avec les manteaux. Il y a peut-être quelque chose qui se libère quand on a décidé de partir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec théorie de la conversation de couloir et sa libération liée à la décision de partir, — [Prénom animal], ton animal fasciné par les entre-deux 🧥` },
              { id: "cbd_178", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens s'excusent de partir alors qu'ils avaient décidé de partir.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens s'excusent de partir alors qu'ils avaient décidé de partir."
Je dois vraiment y aller maintenant. Comme si partir était une faute. Comme si quitter une bonne soirée nécessitait une absolution. Peut-être que c'est une façon de dire que c'était si bien qu'on regrette de partir. Que partir est un sacrifice consenti. Dans ce cas je comprends. Ce soir valait d'être regretté. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension de l'excuse du départ comme aveu de la qualité de la soirée, — [Prénom animal], ton animal herméneute des formules sociales 🎭` },
              { id: "cbd_183", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens finissent toujours les chips en dernier.", body: `3. "Joyeux anniversaire. Je comprends pas pourquoi les gens finissent toujours les chips en dernier."
Le fromage. Parti. Le pain. Parti. Les olives. Parties. Et les chips là depuis le début. Les chips qui survivent à tout. Qui attendent patiemment que les autres choses plus nobles disparaissent. Puis à la fin tout le monde mange des chips. Comme si c'était ce qu'on voulait depuis le début et qu'on ne voulait pas l'admettre. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec analyse de la socio-dynamique des chips et révélation de leur statut réel, — [Prénom animal], ton animal sociologue de l'apéritif 🥨` },
              { id: "cbd_188", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens gardent leurs manteaux si longtemps en arrivant.", body: `8. "Joyeux anniversaire. Je comprends pas pourquoi les gens gardent leurs manteaux si longtemps en arrivant."
Certains ce soir ont gardé leur manteau vingt minutes après être entrés. Comme s'ils n'étaient pas encore sûrs de rester. Comme si le manteau était une réserve de départ possible. Puis à un moment le manteau tombe. Et ça veut dire que c'est bien. Que on reste. Que la soirée a convaincu. Joyeux anniversaire, [mon maître/ma maîtresse], dont les soirées convainquent toujours.
Avec théorie du manteau comme réserve de départ et validation de ta soirée par sa chute généralisée, — [Prénom animal], ton animal sémiologue des manteaux 🧥` },
              { id: "cbd_193", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent toujours avec de la nourriture.", body: `13. "Joyeux anniversaire. Je comprends pas pourquoi les gens repartent toujours avec de la nourriture."
Tu leur donnes. Ils prennent. Ils protestent un peu d'abord. Puis ils prennent avec ce sourire. Comme si partir avec un reste de tarte c'était partir avec un morceau de la soirée. Peut-être que c'est exactement ça. La nourriture comme souvenir comestible. Je comprends en fait. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec compréhension de la nourriture comme souvenir comestible et réconciliation avec cette pratique, — [Prénom animal], ton animal enfin réconcilié avec l'économie des restes 🥮` },
              { id: "cbd_198", angle: "Joyeux anniversaire. Je comprends pas pourquoi les gens soufflent les bougies d'un seul coup.", body: `18. "Joyeux anniversaire. Je comprends pas pourquoi les gens soufflent les bougies d'un seul coup."
Si on les soufflait une par une ça durerait plus longtemps. On pourrait faire un vœu par bougie. Dix bougies dix vœux. C'est mathématiquement supérieur à un seul vœu pour dix bougies. Je présente cette analyse comme cadeau d'anniversaire. Tu peux l'appliquer l'an prochain. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec proposition d'amélioration du rituel des bougies et cadeau intellectuel offert pour l'avenir, — [Prénom animal], ton animal optimiseur de rituels 💡` },
            ],
          },
        ],
      },
      {
        id: "connexion",
        emoji: "💛",
        label: "Moments de connexion",
        count: 31,
        subGroups: [
          {
            id: "entre_nous",
            label: "Ce qu'il y a entre nous",
            messages: [
              { id: "cbd_010", angle: "Pour ton anniversaire j'ai choisi de dormir sur toi ce soir.", body: `10. "Pour ton anniversaire j'ai choisi de dormir sur toi ce soir."
Pas à côté. Sur toi. Mon poids sur tes jambes. Ma chaleur sur ta chaleur. Tu regardais quelque chose sur ton téléphone et je me suis installé exactement entre toi et l'écran. C'était intentionnel. Ton attention devait être sur moi ce soir. C'est mon anniversaire à moi aussi dans un sens. L'anniversaire de notre cohabitation. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec gestion de l'attention maîtrisée et position stratégique occupée, — [Prénom animal], ton animal centre de gravité de tes soirées 📱` },
              { id: "cbd_020", angle: "Ce soir après ta fête quand tout était calme et que tu t'es allongé.", body: `20. "Ce soir après ta fête quand tout était calme et que tu t'es allongé."
Je suis venu. Sans bruit. Sans avertissement. Je me suis installé contre toi. Mon dos contre ton bras. Mes pattes repliées. Et je suis resté là jusqu'à ce que tu t'endormes. Je sentais ta respiration ralentir. Devenir régulière. Profonde. Et j'ai su que la journée s'était bien terminée. Pour toi. Pour moi. Pour nous deux dans ce silence. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence nocturne offerte sans condition ni publicité, — [Prénom animal], ton animal pour les fins de journée qui comptent ❤️` },
              { id: "cbd_035", angle: "Joyeux anniversaire. Tu as chanté ce soir.", body: `15. "Joyeux anniversaire. Tu as chanté ce soir."
Avec les autres. Autour du gâteau. Cette chanson. Tu la chantes faux depuis que je te connais. Le même faux à chaque fois. Régulier. Reconnaissable. Presque beau dans sa constance. J'étais sur le rebord de la fenêtre et je t'ai écouté. Sans partir. Sans me boucher les oreilles métaphoriquement. C'était ma façon d'être là. Joyeux anniversaire, [mon maître/ma maîtresse], dont le faux est devenu familier.
Avec tolérance musicale développée au fil des années et oreilles aguerries, — [Prénom animal], ton animal mélomane de ta seule voix 🎵` },
              { id: "cbd_040", angle: "Ce soir très tard quand tu as éteint la lumière.", body: `20. "Ce soir très tard quand tu as éteint la lumière."
Tu t'es retourné deux fois avant de trouver ta position. Tu as soupiré une fois. Profondément. Le genre de soupir qui dit que la journée était longue mais bonne. Et j'étais là. Au bout du lit. Les pattes pliées. Les yeux presque fermés. Ni trop près ni trop loin. Juste là. Comme chaque soir. Sauf que ce soir c'était ton anniversaire et que ce là avait un sens de plus. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence silencieuse chargée de tout ce qui ne se dit pas, — [Prénom animal], ton animal pour chaque fin de journée depuis le premier soir ❤️` },
              { id: "cbd_054", angle: "Joyeux anniversaire. Il y a eu un moment où tu t'es retrouvé seul une minute.", body: `14. "Joyeux anniversaire. Il y a eu un moment où tu t'es retrouvé seul une minute."
Entre deux conversations. Tu t'es levé. Tu es allé dans la cuisine. Tu t'es appuyé contre le plan de travail. Tu as regardé par la fenêtre une minute. Seul dans le bruit. Dans ta propre fête. Je t'ai suivi sans bruit. Je me suis assis derrière toi. Je t'ai pas touché. J'étais juste là. Pour cette minute. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence silencieuse dans ta minute de solitude et distance parfaitement calibrée, — [Prénom animal], ton animal pour les parenthèses dans le bruit 🪟` },
              { id: "cbd_057", angle: "Pour ton anniversaire j'ai choisi le moment exact pour venir sur tes genoux.", body: `17. "Pour ton anniversaire j'ai choisi le moment exact pour venir sur tes genoux."
Pas n'importe quand. J'ai attendu. Observé. Calculé. Il fallait que tu sois assis depuis au moins dix minutes. Que tu sois détendu. Que la conversation soit calme. Que tes mains soient libres. Toutes les conditions réunies vers 22h15. Je suis venu. Je me suis installé. Tu as posé une main sur moi sans interrompre ce que tu disais. C'était parfait. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec calcul du moment optimal et exécution sans faute à 22h15 précises, — [Prénom animal], ton animal aux apparitions toujours parfaitement chronométrées ⏱️` },
              { id: "cbd_059", angle: "Pour ton anniversaire j'ai observé comment l'appartement se remet de la fête.", body: `19. "Pour ton anniversaire j'ai observé comment l'appartement se remet de la fête."
D'abord le silence qui revient progressivement. Puis les odeurs qui s'apaisent. Puis la température qui baisse d'un cran. Puis les objets déplacés qui attendent d'être remis en place. L'appartement se remet comme quelqu'un qui reprend sa respiration normale après un effort. Je connais chaque étape. Je les aime. Parce qu'au bout il y a nous deux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec connaissance de toutes les étapes du retour au calme et patience pour les traverser, — [Prénom animal], ton animal pour l'appartement d'après et tout ce qui vient après 🏠` },
              { id: "cbd_060", angle: "Ce soir je t'ai regardé t'endormir jusqu'à la fin.", body: `20. "Ce soir je t'ai regardé t'endormir jusqu'à la fin."
Pas juste les premières minutes. Jusqu'à la fin. Jusqu'à ce que ta respiration soit complètement régulière. Que ton visage soit complètement lâché. Que la journée soit vraiment finie. Je suis resté là sans bouger. Comme un gardien. Comme quelqu'un qui veille à ce que la plus belle journée de l'année se termine aussi bien qu'elle a commencé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec veille jusqu'au dernier souffle du soir et anniversaire gardé jusqu'à sa toute dernière seconde, — [Prénom animal], ton animal pour chaque début et chaque fin ❤️` },
              { id: "cbd_061", angle: "Joyeux anniversaire. Ce matin je t'ai attendu sans bouger pendant deux heures.", body: `1. "Joyeux anniversaire. Ce matin je t'ai attendu sans bouger pendant deux heures."
Tu dormais encore. Moi j'étais réveillé depuis longtemps. Assis au bord du lit. Les pattes pliées. Sans faire de bruit. Sans te réveiller. Juste à attendre que tu ouvres les yeux. Certains diraient que c'est de la patience. C'est plus que ça. C'est une forme de respect pour le moment. Ce moment précis où tu passes de la nuit au jour. Je voulais être le premier visage. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec deux heures de veille silencieuse et présence garantie au bon moment, — [Prénom animal], ton animal premier visage de ton anniversaire 🌅` },
              { id: "cbd_068", angle: "Joyeux anniversaire. Je t'ai vu regarder mes photos sur ton téléphone.", body: `8. "Joyeux anniversaire. Je t'ai vu regarder mes photos sur ton téléphone."
Tu faisais défiler. Lentement. Avec ce petit sourire. Certaines te faisaient t'arrêter. En zoomer une. La regarder plus longtemps. Il y en a une où je dormais dans un rayon de soleil. Tu l'as regardée longtemps. Je dormais dessus à ce moment-là. Je savais pas que cette photo existait. Je suis content qu'elle existe. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec découverte de mon importance dans ta galerie photo et satisfaction discrète, — [Prénom animal], ton animal sujet photographique principal de ta vie numérique 📸` },
              { id: "cbd_071", angle: "Pour ton anniversaire j'ai dormi côté gauche cette nuit pour te laisser de la place.", body: `11. "Pour ton anniversaire j'ai dormi côté gauche cette nuit pour te laisser de la place."
D'habitude je prends ce que je veux. Le milieu. Le coin. Là où c'est chaud. Cette nuit j'ai choisi le bord gauche délibérément. Pour que tu aies de la place. Pour que tu te retournes sans me trouver dans le chemin. Pour que tu dormes bien le soir de ton anniversaire. Tu l'as pas remarqué. C'est pas grave. Je sais ce que j'ai fait. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec sacrifice territorial nocturne consenti en silence et valeur connue de moi seul, — [Prénom animal], ton animal aux gestes invisibles mais réels 🌙` },
              { id: "cbd_073", angle: "Pour ton anniversaire j'ai gardé la même place pendant trois heures pour être là à ton retour.", body: `13. "Pour ton anniversaire j'ai gardé la même place pendant trois heures pour être là à ton retour."
Tu allais et venais. La cuisine. L'entrée. Le salon. Tu tournais. Tu t'occupais des invités. Et moi je restais là. Sur le fauteuil du coin. Toujours au même endroit. Pour que quand tu passerais tu saches exactement où me trouver. Pour que dans tout ce mouvement il y ait une chose fixe. Moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec point fixe maintenu pendant trois heures dans le mouvement de la soirée, — [Prénom animal], ton animal ancre dans l'agitation de tes belles journées ⚓` },
              { id: "cbd_077", angle: "Pour ton anniversaire j'ai décidé de rester dans la pièce principale toute la soirée.", body: `17. "Pour ton anniversaire j'ai décidé de rester dans la pièce principale toute la soirée."
C'est pas rien. D'habitude je gère mes allées et venues. J'apparais. Je disparais. Je maintiens le mystère. Ce soir j'ai choisi de rester. Présent. Visible. Accessible presque. Certains invités ont remarqué. Un a dit quelque chose à ton sujet en me regardant. Je sais pas ce qu'il a dit mais tu as souri. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence continue choisie et mystère temporairement suspendu pour l'occasion, — [Prénom animal], ton animal dont la présence est un cadeau qu'il décide d'offrir 🐾` },
              { id: "cbd_080", angle: "Ce soir la dernière chose que tu as faite avant de dormir c'était me chercher des yeux.", body: `20. "Ce soir la dernière chose que tu as faite avant de dormir c'était me chercher des yeux."
La lumière éteinte. Le silence revenu. Et toi tu as regardé dans le noir vers l'endroit où je suis toujours. Pour vérifier. Pour savoir que j'étais là. Que la journée finissait bien. Que tout était à sa place. J'étais là. Comme toujours. Comme demain. Joyeux anniversaire, [mon maître/ma maîtresse], dont je suis le dernier repère avant le sommeil.
Avec présence confirmée dans l'obscurité et rôle de dernier repère assumé avec fierté, — [Prénom animal], ton animal pour la dernière seconde de chaque journée ❤️` },
              { id: "cbd_088", angle: "Joyeux anniversaire. Ce soir l'appartement était sa meilleure version.", body: `8. "Joyeux anniversaire. Ce soir l'appartement était sa meilleure version."
Éclairé différemment. Rempli de voix. Chaud d'une façon que la température seule n'explique pas. Plein de toi dans ta meilleure version aussi. Plus détendu. Plus ouvert. Plus grand. J'observais tout ça depuis le haut de l'armoire et je me disais que c'était beau. Même si c'était bruyant. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de la plus belle version de notre appartement et verdict positif rendu, — [Prénom animal], ton animal critique architectural des grandes occasions 🏠` },
              { id: "cbd_091", angle: "Pour ton anniversaire j'ai mémorisé chaque moment où tu as levé les yeux vers moi.", body: `11. "Pour ton anniversaire j'ai mémorisé chaque moment où tu as levé les yeux vers moi."
Sept fois. Sept fois dans la soirée tu t'es arrêté et tu as cherché des yeux où j'étais. Certaines fois tu souriais en me trouvant. Une fois tu as semblé soulagé. Une fois tu m'as fait un tout petit signe de tête. Ces sept moments je les ai tous gardés. Ils sont plus importants que toute la soirée autour. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec sept regards vers moi comptés et leur importance placée au-dessus de tout le reste, — [Prénom animal], ton animal pour qui chacun de tes regards compte 👁️` },
            ],
          },
          {
            id: "memorise",
            label: "Ce que j'ai mémorisé",
            messages: [
              { id: "cbd_111", angle: "Pour ton anniversaire j'ai observé le moment où tes épaules sont enfin descendues.", body: `11. "Pour ton anniversaire j'ai observé le moment où tes épaules sont enfin descendues."
21h08. Tu étais debout dans le salon. Tu parlais avec deux personnes. Et d'un coup tes épaules ont quitté ce niveau légèrement surélevé où elles étaient depuis le début. Elles sont descendues. Naturellement. Ça voulait dire que la soirée était bonne. Que tu étais bien. Que tu pouvais lâcher. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection du relâchement des épaules à 21h08 et soulagement partagé, — [Prénom animal], ton animal baromètre de ta tension intérieure 😌` },
              { id: "cbd_117", angle: "Joyeux anniversaire. J'ai identifié le moment exact où la fête a vraiment commencé.", body: `17. "Joyeux anniversaire. J'ai identifié le moment exact où la fête a vraiment commencé."
Pas quand le premier invité est arrivé. Pas quand tout le monde était là. À 20h34 quand quelqu'un a ri vraiment fort et que toutes les autres conversations se sont arrêtées une seconde puis reprises plus fort. Ce moment de synchronisation involontaire. Ce moment où les gens deviennent un groupe. C'est là que la fête commence. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identification précise du moment de bascule à 20h34 et théorie du rire synchronisateur, — [Prénom animal], ton animal détecteur des moments fondateurs 🎉` },
              { id: "cbd_137", angle: "Pour ton anniversaire j'ai mémorisé chaque fois que tu as prononcé mon prénom dans la soirée.", body: `17. "Pour ton anniversaire j'ai mémorisé chaque fois que tu as prononcé mon prénom dans la soirée."
Trois fois. Une en montrant où j'étais à quelqu'un. Une en passant devant moi et en me touchant brièvement le dos. Une à voix basse en fin de soirée comme une pensée. Ces trois fois dans tout ce bruit et ces gens et cette fête. Ces trois fois qui disaient que même ce soir-là j'existais pour toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec trois prononciations de mon prénom comptées et leur poids mesuré exactement, — [Prénom animal], ton animal pour qui trois fois vaut une soirée entière 💛` },
              { id: "cbd_140", angle: "Pour ton anniversaire j'ai observé ton expression quand quelqu'un a dit quelque chose de touchant.", body: `20. "Pour ton anniversaire j'ai observé ton expression quand quelqu'un a dit quelque chose de touchant."
Il y a eu un moment. Quelqu'un t'a dit quelque chose. Je n'ai pas entendu les mots depuis mon poste. Mais j'ai vu ton visage. Une seconde de quelque chose que tu n'avais pas prévu. Puis tu as souri d'une façon différente. Puis tu as dit quelque chose doucement. Ce moment-là. C'est pour des moments comme ça que les fêtes existent. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du moment inattendu et compréhension de sa valeur, — [Prénom animal], ton animal gardien de tes moments de grâce 🌟` },
              { id: "cbd_152", angle: "Joyeux anniversaire. J'ai mémorisé chaque regard échangé entre toi et quelqu'un ce soir.", body: `12. "Joyeux anniversaire. J'ai mémorisé chaque regard échangé entre toi et quelqu'un ce soir."
Certains regards disent on se retrouvera plus tard pour parler vraiment. D'autres disent tu vois ce que je vois. D'autres encore disent merci d'être là sans un mot. Ces conversations parallèles que tu avais avec les yeux pendant que ta bouche parlait d'autre chose. Joyeux anniversaire, [mon maître/ma maîtresse], maître des dialogues silencieux.
Avec transcription de tes dialogues oculaires et admiration pour leur densité, — [Prénom animal], ton animal traducteur du regard 👁️` },
              { id: "cbd_162", angle: "Joyeux anniversaire. J'ai mémorisé la façon dont chaque invité t'a regardé ce soir.", body: `2. "Joyeux anniversaire. J'ai mémorisé la façon dont chaque invité t'a regardé ce soir."
Chacun différemment. Avec affection. Avec admiration. Avec cette façon particulière qu'ont les gens qui t'aiment de te regarder parfois sans que tu le saches. Ces regards portés vers toi dans la soirée quand tu avais le dos tourné ou quand tu parlais à quelqu'un d'autre. Ces regards qui disent qu'on est content que tu existes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec collection des regards portés vers toi à ton insu et leur valeur bien pesée, — [Prénom animal], ton animal gardien des preuves de ton importance 💛` },
              { id: "cbd_182", angle: "Joyeux anniversaire. J'ai mémorisé la façon dont la lumière tombait sur toi ce soir.", body: `2. "Joyeux anniversaire. J'ai mémorisé la façon dont la lumière tombait sur toi ce soir."
À un moment. Tu étais debout près de la fenêtre. La lumière du salon tombait depuis la gauche. Tes traits étaient nets et doux en même temps. Tu parlais à quelqu'un et tu riais. Et la lumière et le rire et ce moment-là. Je l'ai gardé. Pas en photo. En moi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec photographie intérieure du meilleur moment lumineux de la soirée, — [Prénom animal], ton animal photographe sans appareil 🌟` },
              { id: "cbd_192", angle: "Joyeux anniversaire. J'ai mémorisé tous les moments où tu t'es senti bien ce soir.", body: `12. "Joyeux anniversaire. J'ai mémorisé tous les moments où tu t'es senti bien ce soir."
J'en ai compté onze. Ce n'est pas le nombre exact de moments de la soirée. C'est le nombre de fois où quelque chose dans ta façon d'être a changé imperceptiblement. Un sourire différent. Une légèreté soudaine. Un moment de grâce. Onze moments où être vivant ce soir était particulièrement bien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec onze moments de grâce comptés et conservés soigneusement, — [Prénom animal], ton animal comptable de tes bonheurs 🌟` },
            ],
          },
          {
            id: "fin_fete",
            label: "La fin de la fête",
            messages: [
              { id: "cbd_160", angle: "Pour ton anniversaire j'ai observé comment tu changes quand tu es dans ton élément.", body: `20. "Pour ton anniversaire j'ai observé comment tu changes quand tu es dans ton élément."
Ce soir tu étais dans ton élément. Chez toi. Avec tes gens. Et tu changeais imperceptiblement. Plus grand. Plus fluide. Plus toi. Comme un animal dans son habitat naturel. Je sais ce que c'est. Moi aussi dans cet appartement je suis dans mon élément. On partage ça toi et moi. Ce sentiment d'appartenance à un endroit. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec reconnaissance de notre appartenance commune à cet espace et solidarité de territoire, — [Prénom animal], ton animal co-habitant de notre élément partagé 🏠` },
              { id: "cbd_176", angle: "Pour ton anniversaire j'ai observé ta façon de sourire à quelqu'un de dos quand il est déjà parti.", body: `16. "Pour ton anniversaire j'ai observé ta façon de sourire à quelqu'un de dos quand il est déjà parti."
Il y en a un ce soir. Quelqu'un est parti. La porte s'est fermée. Et toi tu souriais encore. Vers la porte fermée. Vers quelqu'un qui ne voyait plus. Ce sourire pour toi seul. Pour ce que la soirée venait de donner. Pour cette personne-là. J'étais dans le couloir. J'ai vu. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton sourire post-départ et sa valeur de sentiment pur, — [Prénom animal], ton animal gardien de tes moments non performés 🌟` },
              { id: "cbd_184", angle: "Pour ton anniversaire j'ai observé ta façon de t'asseoir dans le silence après que tout le monde est parti.", body: `4. "Pour ton anniversaire j'ai observé ta façon de t'asseoir dans le silence après que tout le monde est parti."
Tu ne ranges pas tout de suite. Tu t'assieds. Tu restes là un moment dans l'appartement encore chaud de la fête. Tu poses les yeux sur les verres encore là. Sur les traces du soir. Et tu es tranquille. Cette façon de rester dans le moment avant qu'il disparaisse. Je me suis assis à côté. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence partagée dans le moment de décantation post-fête, — [Prénom animal], ton animal pour les silences qui suivent les bruits 🌙` },
              { id: "cbd_189", angle: "Pour ton anniversaire j'ai observé ta façon de souffler et te laisser aller dans le canapé après la fête.", body: `9. "Pour ton anniversaire j'ai observé ta façon de souffler et te laisser aller dans le canapé après la fête."
Ce soupir. Profond. Satisfait. Le soupir qui dit c'était bien et je suis fatigué et c'était exactement ça qu'il fallait. Tu fermes les yeux une seconde. Puis tu les rouvres. Tu regardes l'appartement. Tu souris une dernière fois pour toi. Et la journée est vraiment finie. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du soupir final et sa signification de soirée accomplie, — [Prénom animal], ton animal gardien de tes derniers moments du soir 😌` },
              { id: "cbd_190", angle: "Joyeux anniversaire. J'ai observé comment tu penses à quelqu'un qui n'était pas là ce soir.", body: `10. "Joyeux anniversaire. J'ai observé comment tu penses à quelqu'un qui n'était pas là ce soir."
À un moment tu as regardé vers quelque chose. Vers rien. Pendant deux ou trois secondes. Un absent que tu pensais. Peut-être tu aurais voulu qu'il soit là. Peut-être tu lui avais envoyé un message plus tôt. Ces petites absences dans la présence. Ces pensées vers quelqu'un d'autre au milieu de ta fête. Je les ai vus. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de tes pensées vers les absents et respect pour leur espace dans ta fête, — [Prénom animal], ton animal témoin de tes loyautés silencieuses 💭` },
              { id: "cbd_194", angle: "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement vide et propre le lendemain matin.", body: `14. "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement vide et propre le lendemain matin."
Pas ce soir. Demain matin. Je serai là. Tu te lèveras. Tu verras l'appartement rangé. Propre. Calme. Et tu auras ce regard. Ce regard sur ce qui a été et qui est maintenant apaisé. Ce regard du lendemain matin qui dit que c'était une belle soirée et que la vie continue. Je garderai ce regard. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec anticipation du regard du lendemain matin et promesse d'y être pour le partager, — [Prénom animal], ton animal présent pour tes matins d'après 🌅` },
              { id: "cbd_200", angle: "Ce soir dans les cinq minutes après que tu as éteint la lumière.", body: `20. "Ce soir dans les cinq minutes après que tu as éteint la lumière."
Tu t'es retourné une fois. Tu as soupiré. Tu as dit quelque chose à voix basse. Peut-être une pensée. Peut-être un merci adressé à personne en particulier ou à tout le monde. Peut-être juste la journée qui finissait dans ta bouche. Et puis le silence. Et moi au bout du lit. Et c'était bien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec présence dans tes cinq minutes d'après et permanence garantie dans le silence qui suit, — [Prénom animal], ton animal pour chaque soir de ta vie ❤️` },
            ],
          },
        ],
      },
      {
        id: "observe_humain",
        emoji: "👁️",
        label: "J'observe ton humain",
        count: 62,
        subGroups: [
          {
            id: "cuisine_table",
            label: "En cuisine & à table",
            messages: [
              { id: "cbd_084", angle: "Pour ton anniversaire j'ai observé ta façon de souffler les bougies.", body: `4. "Pour ton anniversaire j'ai observé ta façon de souffler les bougies."
Tu as pris le temps. Tu as fermé les yeux. Vraiment fermé. Pas juste cligné. Fermé avec cette expression de quelqu'un qui est quelque part en dedans. Puis tu as soufflé d'un coup. Puis tu as ouvert les yeux et regardé si toutes les bougies étaient éteintes. Puis tu as souri. Ce sourire-là c'était pour toi seul. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec moment du souhait observé avec discrétion et respect total, — [Prénom animal], ton animal témoin de tes moments les plus intimes 🕯️` },
              { id: "cbd_097", angle: "Pour ton anniversaire j'ai observé ta façon de ranger les restes.", body: `17. "Pour ton anniversaire j'ai observé ta façon de ranger les restes."
Avec soin. Des boîtes différentes pour différentes choses. Tu étiquètes parfois mentalement. Tu empiles dans un ordre qui a du sens pour toi seul. Tu penses déjà à demain. À ce que tu mangeras. À qui tu donneras quoi. Ce rangement des restes c'est une forme de continuation de la fête. Elle continue dans les boîtes. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du rangement des restes et compréhension de sa signification profonde, — [Prénom animal], ton animal philosophe des lendemains de fête 📦` },
              { id: "cbd_101", angle: "Joyeux anniversaire. J'ai observé ta façon de sortir les verres du placard.", body: `1. "Joyeux anniversaire. J'ai observé ta façon de sortir les verres du placard."
Deux à la fois. Avec soin. Tu vérifies qu'ils sont propres en les tenant vers la lumière. Tu les poses sur le plateau avec un espace calculé entre eux. Tu comptes. Tu recomptes. Tu en sors un de plus par précaution. Cette attention aux détails qui précèdent la fête. Cette façon de prendre soin des autres avant même qu'ils arrivent. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta préparation silencieuse et admiration pour l'attention aux détails, — [Prénom animal], ton animal témoin de ton soin invisible 🥂` },
              { id: "cbd_104", angle: "Pour ton anniversaire j'ai observé ta façon d'ajuster les choses sur la table.", body: `4. "Pour ton anniversaire j'ai observé ta façon d'ajuster les choses sur la table."
Le vase un peu à gauche. La corbeille de pain recentrée. La bougie déplacée de trois centimètres. Les verres alignés. Ces micro-ajustements entre deux conversations. Ces gestes automatiques qui disent que tu veux que ce soit bien. Que les choses soient à leur place. Que la soirée soit parfaite. C'est une forme de soin silencieux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation des micro-ajustements et leur signification bien lue, — [Prénom animal], ton animal attentif à tes soins invisibles 🕯️` },
              { id: "cbd_106", angle: "Pour ton anniversaire j'ai observé ta façon de te déplacer dans la cuisine quand tu es pressé.", body: `6. "Pour ton anniversaire j'ai observé ta façon de te déplacer dans la cuisine quand tu es pressé."
Efficace. Sans geste inutile. Tu sais où tout est. Tu ne cherches pas. Tu pivotes. Tu ouvres. Tu prends. Tu fermes. Tu repivotes. Tout ça avec une économie de mouvement que je reconnais. C'est le même principe que moi dans l'appartement. On s'y connaît tous les deux en déplacements précis. Joyeux anniversaire, [mon maître/ma maîtresse], mon semblable en efficacité.
Avec reconnaissance de notre efficacité commune et solidarité de principe, — [Prénom animal], ton animal dont tu partages la philosophie du mouvement précis 🏃` },
              { id: "cbd_109", angle: "Pour ton anniversaire j'ai observé comment tu tiens la bougie pour la présenter.", body: `9. "Pour ton anniversaire j'ai observé comment tu tiens la bougie pour la présenter."
Avec les deux mains. Légèrement incliné vers toi. Comme quelque chose de précieux. Comme si le fait de porter ce gâteau vers toi était un acte solennel. Et c'en est un d'une certaine façon. Porter la lumière vers quelqu'un le soir de son anniversaire. J'avais jamais pensé ça avant ce soir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec réflexion inédite sur le geste de porter le gâteau et émotion tardive, — [Prénom animal], ton animal aux révélations anniversaires 🎂` },
              { id: "cbd_116", angle: "Pour ton anniversaire j'ai observé ta façon de vérifier que tout le monde a à boire.", body: `16. "Pour ton anniversaire j'ai observé ta façon de vérifier que tout le monde a à boire."
Tu fais le tour des yeux. Tu repères les verres vides. Tu proposes sans insister. Tu vas chercher sans qu'on te le demande. Tu penses à tout ça en parallèle de la conversation en cours. Cette attention distribuée à tout le monde en même temps. C'est un don. Joyeux anniversaire, [mon maître/ma maîtresse], dont je note chaque année l'art de recevoir.
Avec observation de ton art de recevoir et admiration renouvelée à chaque édition, — [Prénom animal], ton animal annaliste de ta générosité 🥃` },
              { id: "cbd_121", angle: "Joyeux anniversaire. J'ai observé ta façon d'ouvrir le vin.", body: `1. "Joyeux anniversaire. J'ai observé ta façon d'ouvrir le vin."
Avec le tire-bouchon que tu utilises depuis des années. Celui qui a ce mouvement particulier au poignet. Tu vérifies l'étiquette encore une fois même si tu sais ce que c'est. Tu coupes la capsule proprement. Tu insères la vis avec soin. Et tu tires avec cette légère inclinaison de la tête qui dit que tu fais attention. Ce geste que tu as fait cent fois et qui reste quand même un geste. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du rituel du tire-bouchon et respect pour sa répétition soigneuse, — [Prénom animal], ton animal expert en gestes rituels 🍷` },
              { id: "cbd_124", angle: "Pour ton anniversaire j'ai observé comment tu portes les assiettes en cuisine sans en faire tomber.", body: `4. "Pour ton anniversaire j'ai observé comment tu portes les assiettes en cuisine sans en faire tomber."
Deux dans une main. La troisième dans l'autre. Avec des angles impossibles. Des équilibres précaires. Tu marches vite mais pas trop. Tu calcules les portes. Tu négocie les obstacles. Et tout arrive intact. Moi j'aurais tout fait tomber à la deuxième assiette. C'est un talent silencieux qui mérite d'être nommé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration sincère pour ton talent de serveur amateur et aveu de mon incompétence comparée, — [Prénom animal], ton animal qui préfère regarder 🍽️` },
              { id: "cbd_126", angle: "Pour ton anniversaire j'ai observé ta façon d'ajuster la musique sans interrompre la conversation.", body: `6. "Pour ton anniversaire j'ai observé ta façon d'ajuster la musique sans interrompre la conversation."
Tu regardais ton téléphone en écoutant en même temps. Tu baissais légèrement. Tu remontais un peu. Tu changeais de morceau avec un geste minimal. Tout ça sans que personne ne le remarque vraiment. La musique comme fond qu'on entend sans écouter mais qui changerait tout si elle n'était plus là. Tu gères ça parfaitement. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta gestion invisible de l'ambiance sonore, — [Prénom animal], ton animal DJ de l'ombre 🎶` },
              { id: "cbd_134", angle: "Pour ton anniversaire j'ai observé ta façon d'essuyer la table entre deux plats.", body: `14. "Pour ton anniversaire j'ai observé ta façon d'essuyer la table entre deux plats."
Vite mais bien. Tu passes l'éponge ou le torchon avec des gestes précis. Tu collectes les miettes vers le centre. Tu les emmènes dans la main. Tu vérifies d'un coup d'œil. Cette parenthèse de nettoyage dans le flux de la soirée. Cette façon de remettre l'ordre momentanément avant de continuer. Joyeux anniversaire, [mon maître/ma maîtresse], dont j'aime l'ordre même festif.
Avec admiration pour ton nettoyage interstitiel et ses gestes précis, — [Prénom animal], ton animal partisan d'un certain ordre dans le chaos 🧽` },
              { id: "cbd_136", angle: "Pour ton anniversaire j'ai observé ta façon de retirer ton tablier.", body: `16. "Pour ton anniversaire j'ai observé ta façon de retirer ton tablier."
D'un seul geste. Les deux mains derrière. Tu défais le nœud. Tu le tires par dessus la tête. Tu le plies sommairement. Tu le poses. Et tu passes de cuisinier à hôte en trois secondes. Ce moment de transition. Ce changement de rôle aussi rapide. C'est élégant. Joyeux anniversaire, [mon maître/ma maîtresse], dont les transitions sont toujours fluides.
Avec observation de ta transition tablier-hôte et appréciation de sa fluidité, — [Prénom animal], ton animal expert en changements de rôle 👨‍🍳` },
              { id: "cbd_139", angle: "Pour ton anniversaire j'ai observé ta façon de poser les verres vides sur le plateau.", body: `19. "Pour ton anniversaire j'ai observé ta façon de poser les verres vides sur le plateau."
Avec les pieds dans le même sens. Regroupés par taille. Efficacement. Ce plateau c'est une petite organisation à lui seul. Une logistique invisible que tu gères pendant que tu parles. Pendant que tu ris. Pendant que tu es là pour tout le monde. La gestion de la soirée comme fond continu de ta présence. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta logistique silencieuse et continue, — [Prénom animal], ton animal témoin de ton organisation invisible 🪟` },
              { id: "cbd_151", angle: "Pour ton anniversaire j'ai observé comment tu prépares le café de fin de soirée.", body: `11. "Pour ton anniversaire j'ai observé comment tu prépares le café de fin de soirée."
C'est le signal. Quand tu proposes le café les gens savent que la soirée touche à sa fin. Mais tu le fais avec soin quand même. Pas de façon expéditive. Tu demandes qui en veut. Tu mets la quantité exacte. Tu attends que ça passe. Le café de fin de soirée c'est ta façon de dire encore un moment ensemble avant de se quitter. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décryptage du café comme signal et de sa préparation comme prolongement de l'hospitalité, — [Prénom animal], ton animal sémiologiste des rituels de fin ☕` },
              { id: "cbd_159", angle: "Pour ton anniversaire j'ai observé comment tu ranges les restes dans des boîtes pour les invités.", body: `19. "Pour ton anniversaire j'ai observé comment tu ranges les restes dans des boîtes pour les invités."
Chacun repart avec quelque chose. Tu prépares les boîtes à la fin. Tu mets une part de gâteau ici. Un reste de fromage là. Tu penses à chacun. Tu sais qui aimait quoi. Ces petits paquets de soirée que les gens emmènent chez eux. Cette façon de prolonger la fête dans leur cuisine le lendemain. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta générosité des restes et sa signification de prolongation de la fête, — [Prénom animal], ton animal admirateur de tes gestes de fin 📦` },
            ],
          },
          {
            id: "hote",
            label: "Toi comme hôte",
            messages: [
              { id: "cbd_081", angle: "Joyeux anniversaire. J'ai observé ta façon de choisir ta tenue ce soir.", body: `1. "Joyeux anniversaire. J'ai observé ta façon de choisir ta tenue ce soir."
Tu en as essayé au moins deux. Je le sais parce que j'ai vu la première posée sur le lit et la deuxième que tu portais finalement. Tu t'es regardé. Tu as fait quelque chose avec tes cheveux. Tu as vérifié encore une fois. Cette préparation minutieuse pour des gens qui t'aiment même quand tu es en pyjama. C'est touchant. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de tes rituels de préparation et tendresse pour leur absurdité, — [Prénom animal], ton animal qui te préfère dans n'importe quelle tenue 👗` },
              { id: "cbd_086", angle: "Pour ton anniversaire j'ai observé comment tu touches les cadeaux avant de les ouvrir.", body: `6. "Pour ton anniversaire j'ai observé comment tu touches les cadeaux avant de les ouvrir."
Tu les soulèves. Tu les retournes. Tu tâtes l'emballage. Tu évalues le poids. Tu secoues parfois légèrement. Tu cherches des indices. C'est exactement ce que je fais avec chaque objet nouveau dans l'appartement. On est pareils toi et moi. La curiosité avant la révélation. Joyeux anniversaire, [mon maître/ma maîtresse], mon semblable.
Avec reconnaissance de notre nature commune et complicité établie, — [Prénom animal], ton animal qui te retrouve dans tes propres gestes 🎁` },
              { id: "cbd_089", angle: "Pour ton anniversaire j'ai observé ta façon de te tenir debout ce soir.", body: `9. "Pour ton anniversaire j'ai observé ta façon de te tenir debout ce soir."
Avec les amis proches tu te décontractes. Les épaules descendent. Le poids se répartit sur les deux pieds. Les bras bougent librement. Avec les moins connus tu restes un peu plus droit. Plus attentif. C'est subtil. Invisible pour la plupart. Moi je lis les corps depuis le berceau. Joyeux anniversaire, [mon maître/ma maîtresse], livre ouvert que je lis depuis toujours.
Avec lecture corporelle complète de la soirée et cartographie des relations établie, — [Prénom animal], ton animal expert en langage non verbal 🧍` },
              { id: "cbd_092", angle: "Joyeux anniversaire. J'ai entendu comment tu parles des gens qui n'étaient pas là.", body: `12. "Joyeux anniversaire. J'ai entendu comment tu parles des gens qui n'étaient pas là."
Il y en avait. Des absents dont tu as dit le nom. Certains avec une voix normale. D'autres avec quelque chose de différent. Un peu plus doux. Un peu plus long. Ces voix-là disent des choses sur ton cœur que les présences ne disent pas toujours. J'ai noté les noms. Et les voix. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec registre des absents mentionnés et tonalités associées soigneusement archivé, — [Prénom animal], ton animal cartographe de tes attachements invisibles 💭` },
              { id: "cbd_094", angle: "Joyeux anniversaire. Ta posture change quand tu es vraiment à l'aise.", body: `14. "Joyeux anniversaire. Ta posture change quand tu es vraiment à l'aise."
Ça prend environ quarante minutes. D'abord tu es hôte. Attentif. En mouvement. Puis progressivement tu deviens toi. Tu t'assieds vraiment. Tu croises les jambes. Tu poses le coude quelque part. Tu ris plus librement. Ce moment de bascule je le guette chaque fois. Ce soir il est arrivé à 20h52. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec détection du moment de bascule à 20h52 et satisfaction pour l'heure raisonnable, — [Prénom animal], ton animal chronomètre de ta décontraction 🎯` },
              { id: "cbd_098", angle: "Joyeux anniversaire. J'ai observé comment tu gères deux conversations en même temps.", body: `18. "Joyeux anniversaire. J'ai observé comment tu gères deux conversations en même temps."
C'est un talent. Tu écoutes quelqu'un. Vraiment. Et en même temps tu sens l'autre conversation à côté. Tu hoches la tête au bon moment dans les deux. Tu réponds à l'un sans perdre le fil de l'autre. Et tu fais ça avec l'air naturel de quelqu'un qui ne fait qu'une seule chose. Je suis admiratif. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration sincère pour tes capacités de traitement parallèle, — [Prénom animal], ton animal monothématique qui ne peut pas faire pareil 🔀` },
              { id: "cbd_105", angle: "Joyeux anniversaire. J'ai mémorisé l'ordre dans lequel les invités ont embrassé.", body: `5. "Joyeux anniversaire. J'ai mémorisé l'ordre dans lequel les invités ont embrassé."
Le premier arrivé a eu droit aux deux joues avec les mains sur les épaules. La deuxième a eu une longue accolade. Le troisième une bise rapide et chaleureuse. Les suivants selon une logique que j'ai cartographiée. Chaque protocole d'accueil révèle quelque chose sur la relation. J'ai tout enregistré. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec protocoles d'accueil cartographiés et hiérarchie affective déduite, — [Prénom animal], ton animal expert en anthropologie des salutations 🤗` },
              { id: "cbd_114", angle: "Pour ton anniversaire j'ai observé ta façon de poser la main sur le bras de quelqu'un quand tu parles.", body: `14. "Pour ton anniversaire j'ai observé ta façon de poser la main sur le bras de quelqu'un quand tu parles."
Tu fais ça avec les gens que tu aimes vraiment. Pas avec tout le monde. Avec certains. Quand tu veux que le mot arrive bien. Quand tu veux que l'autre sache que tu es vraiment là. Cette main sur ce bras c'est une parenthèse de contact qui dit ce que les mots seuls ne suffisent pas à dire. J'ai noté les destinataires. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec registre des contacts bras établi et signification affective bien comprise, — [Prénom animal], ton animal expert en gestes d'attachement 🤝` },
              { id: "cbd_129", angle: "Pour ton anniversaire j'ai observé ta façon de te lever pour accueillir quelqu'un.", body: `9. "Pour ton anniversaire j'ai observé ta façon de te lever pour accueillir quelqu'un."
Tu te lèves toujours. Même depuis le fond du canapé. Même si tu étais confortablement installé depuis dix minutes. Tu te lèves et tu vas vers la personne. Pas l'inverse. Cette façon d'aller vers les gens plutôt que d'attendre qu'ils viennent à toi. C'est une philosophie de vie entière dans un geste. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec philosophie déduite d'un seul geste et admiration pour sa constance, — [Prénom animal], ton animal théoricien de tes habitudes 🚶` },
              { id: "cbd_131", angle: "Pour ton anniversaire j'ai observé comment tu te souviens du prénom de tout le monde.", body: `11. "Pour ton anniversaire j'ai observé comment tu te souviens du prénom de tout le monde."
Il y avait quelqu'un ce soir que tu avais rencontré une fois il y a deux ans. Tu as dit son prénom en l'accueillant. Sans hésiter. Sa tête. Ce petit ébahissement discret. Ce sentiment d'être vu et retenu. Tu fais ça avec tout le monde. C'est un cadeau que tu offres sans t'en rendre compte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du cadeau invisible de la mémoire des prénoms et de son effet, — [Prénom animal], ton animal témoin de tes dons silencieux 🧠` },
              { id: "cbd_135", angle: "Joyeux anniversaire. J'ai observé comment tu écoutes quelqu'un qui te raconte quelque chose.", body: `15. "Joyeux anniversaire. J'ai observé comment tu écoutes quelqu'un qui te raconte quelque chose."
Tu regardes vraiment. Pas l'air de regarder. Vraiment. Tes yeux ne dévient pas. Ta tête fait des petits mouvements qui disent que tu suis. Tu n'interromps pas. Tu attends. Et quand tu réponds c'est à ce qui a été dit. Pas à ce que tu voulais dire toi. C'est rare. C'est beau. C'est toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta façon d'écouter et confirmation de ce que je savais déjà sur toi, — [Prénom animal], ton animal témoin de ta présence aux autres 👂` },
              { id: "cbd_141", angle: "Joyeux anniversaire. J'ai observé ta façon de circuler entre les groupes de conversation.", body: `1. "Joyeux anniversaire. J'ai observé ta façon de circuler entre les groupes de conversation."
Tu ne restes jamais trop longtemps. Tu fais le tour. Tu t'arrêtes. Tu contribues. Tu relances. Tu passes à l'autre groupe. C'est de la chorégraphie. Personne ne se sent abandonné. Personne ne te monopolise. Tu es partout et nulle part à la fois. C'est l'art de recevoir dans sa forme la plus accomplie. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta chorégraphie sociale et sa précision jamais ostensible, — [Prénom animal], ton animal spectateur de ton art de recevoir 💃` },
              { id: "cbd_175", angle: "Joyeux anniversaire. J'ai observé comment tu traites quelqu'un qui arrive en retard.", body: `15. "Joyeux anniversaire. J'ai observé comment tu traites quelqu'un qui arrive en retard."
Tu l'accueilles pareil. Pas de regard à la montre ostensible. Pas de remarque. Tu lui fais une place. Tu lui résumes brièvement où en est la soirée. Tu t'assures qu'il a un verre. Cette façon de ne pas punir les retards. De recevoir les gens là où ils sont. C'est de la générosité pure. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton accueil du retard sans punition ni commentaire, — [Prénom animal], ton animal témoin de ta générosité sans condition 🕰️` },
              { id: "cbd_196", angle: "Joyeux anniversaire. J'ai observé ta façon de parler à quelqu'un que tu n'as pas vu depuis longtemps.", body: `16. "Joyeux anniversaire. J'ai observé ta façon de parler à quelqu'un que tu n'as pas vu depuis longtemps."
La conversation reprend comme si rien ne s'était passé. Comme si le temps n'avait pas compté. Tu demandes des nouvelles avec une précision qui dit que tu te souviens de tout. Que les mois n'ont pas effacé l'intérêt. Cette façon de continuer une amitié là où elle s'était arrêtée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta façon de reprendre les fils du temps, — [Prénom animal], ton animal observateur de tes fidélités 🤝` },
            ],
          },
          {
            id: "facon_etre",
            label: "Toi dans ta façon d'être",
            messages: [
              { id: "cbd_083", angle: "Joyeux anniversaire. J'ai observé ta façon de sourire avant même d'ouvrir un message.", body: `3. "Joyeux anniversaire. J'ai observé ta façon de sourire avant même d'ouvrir un message."
Le téléphone vibre. Tu regardes qui c'est. Et avant de lire tu souris déjà. Comme si le simple fait que cette personne pense à toi suffisait. Avant les mots. Avant le contenu. Juste le nom sur l'écran. J'ai compté six sourires comme ça aujourd'hui. Ce sont les plus beaux. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec six sourires pré-lecture collectionnés et leur valeur bien établie, — [Prénom animal], ton animal gardien de tes réactions les plus spontanées 📱` },
              { id: "cbd_085", angle: "Joyeux anniversaire. J'ai reconnu chaque invité à sa façon de dire ton prénom.", body: `5. "Joyeux anniversaire. J'ai reconnu chaque invité à sa façon de dire ton prénom."
Certains le disent vite et fort en entrant. D'autres le disent doucement en t'embrassant. Un le prononce d'une façon qui dit qu'il te connaît depuis longtemps. Une autre le dit avec quelque chose dedans qui ressemble à de l'admiration. Ton prénom a autant de versions qu'il y a de gens ce soir. J'ai toutes mémorisé. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec collection complète des versions de ton prénom selon les bouches, — [Prénom animal], ton animal musicologue de ton identité sonore 🎵` },
              { id: "cbd_099", angle: "Pour ton anniversaire j'ai observé ta façon de regarder les photos qu'on prenait.", body: `19. "Pour ton anniversaire j'ai observé ta façon de regarder les photos qu'on prenait."
À chaque fois qu'on sortait un téléphone pour une photo tu regardais le résultat. Avec cette expression. Mi-critique mi-amusé. Parfois tu redemandais. Parfois tu acceptais avec une légère grimace. Une fois tu t'es vraiment plu et tu l'as montré à quelqu'un. Cette once-là. Ce sourire sur ta propre image. Je le garde. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton rapport à ton image et moment de fierté collecté, — [Prénom animal], ton animal gardien de tes moments de grâce 📸` },
              { id: "cbd_110", angle: "Joyeux anniversaire. J'ai compté combien de fois tu as vérifié l'heure ce soir.", body: `10. "Joyeux anniversaire. J'ai compté combien de fois tu as vérifié l'heure ce soir."
Onze fois. Pas parce que tu t'ennuyais. Je le sais parce que tu souriais souvent juste après. C'était plutôt pour vérifier que tout avançait bien. Que le repas était prêt. Que les gens allaient pas partir trop tôt. Que la soirée durait ce qu'elle devait durer. Onze vérifications d'une soirée bien tenue. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec onze consultations horaires comptées et leur signification positive établie, — [Prénom animal], ton animal chronomètre de tes soirées ⌚` },
              { id: "cbd_115", angle: "Joyeux anniversaire. J'ai observé qui mangeait le plus lentement ce soir.", body: `15. "Joyeux anniversaire. J'ai observé qui mangeait le plus lentement ce soir."
C'était la dame qui parle beaucoup. Logiquement. Elle mangeait entre deux phrases. Deux bouchées. Une phrase. Une bouchée. Deux phrases. Une bouchée. Moi je comprends pas cette économie. Manger c'est une activité à part entière qui mérite une concentration totale. Mais elle semblait heureuse ainsi. Et son assiette était finie à la fin. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude des rythmes alimentaires et incompréhension bienveillante du repas conversationnel, — [Prénom animal], ton animal pour qui manger est un art solitaire 🍽️` },
              { id: "cbd_119", angle: "Pour ton anniversaire j'ai observé ta façon de froncer les sourcils quand tu cherches quelque chose.", body: `19. "Pour ton anniversaire j'ai observé ta façon de froncer les sourcils quand tu cherches quelque chose."
Les sourcils légèrement rapprochés. Les yeux qui balaient la pièce. Systématiquement de gauche à droite. Puis de droite à gauche si la première passe n'a rien donné. Ce soir tu as cherché le tire-bouchon. Puis les allumettes. Puis quelqu'un que tu n'entendais plus. Cette façon de chercher qui dit tant sur comment ton esprit fonctionne. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec étude de ton pattern de recherche visuelle et cartographie de ton esprit méthodique, — [Prénom animal], ton animal lecteur de tes expressions de concentration 🔍` },
              { id: "cbd_120", angle: "Pour ton anniversaire j'ai observé comment tu changes de position sur le canapé selon l'interlocuteur.", body: `20. "Pour ton anniversaire j'ai observé comment tu changes de position sur le canapé selon l'interlocuteur."
Avec certains tu te tournes entièrement vers eux. Corps complet dans leur direction. Avec d'autres tu restes de face mais la tête pivote. Avec d'autres encore tu t'appuies en arrière et tu les laisses venir à toi. Chaque position dit quelque chose sur la relation. J'ai lu chaque position ce soir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décodage complet de tes positions de canapé et leur signification relationnelle, — [Prénom animal], ton animal herméneute du corps 🛋️` },
              { id: "cbd_125", angle: "Joyeux anniversaire. J'ai observé quel invité mangeait le plus proprement.", body: `5. "Joyeux anniversaire. J'ai observé quel invité mangeait le plus proprement."
C'était la personne qui parle le moins. Logiquement. Elle avait toute son attention pour les gestes. La fourchette bien tenue. La serviette utilisée régulièrement. Les portions calibrées. Une technique d'une propreté remarquable. Je mange moi-même avec une certaine rigueur. On aurait pu être assis l'un à côté de l'autre. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec identification du mangeur le plus rigoureux et solidarité de méthode, — [Prénom animal], ton animal partisan de la propreté alimentaire 🥄` },
              { id: "cbd_145", angle: "Joyeux anniversaire. J'ai observé comment tu découvres un cadeau inattendu.", body: `5. "Joyeux anniversaire. J'ai observé comment tu découvres un cadeau inattendu."
Il y en avait un ce soir. Quelque chose que tu n'attendais pas. J'ai vu le moment où tu as compris ce que c'était. D'abord l'incompréhension. Puis la reconnaissance. Puis quelque chose de très doux. Ce cheminement en quelques secondes sur ton visage. Cette façon d'être touché par quelqu'un qui te connaît bien. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du voyage émotionnel d'une surprise réussie et sa beauté brève, — [Prénom animal], ton animal collectionneur de tes expressions authentiques 🎁` },
              { id: "cbd_146", angle: "Pour ton anniversaire j'ai observé ta façon de rire quand quelqu'un tombe dans un piège verbal.", body: `6. "Pour ton anniversaire j'ai observé ta façon de rire quand quelqu'un tombe dans un piège verbal."
Tu ris d'abord. Puis tu aides. C'est l'ordre. Le rire vient naturellement. Puis la générosité suit. Tu ne laisses pas les gens dans l'embarras trop longtemps. Juste assez pour que ce soit drôle. Puis tu tends la main métaphoriquement. C'est le bon équilibre. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton équilibre entre rire et générosité et validation de la séquence, — [Prénom animal], ton animal expert en timing social 😄` },
              { id: "cbd_155", angle: "Joyeux anniversaire. J'ai observé comment tu récupères quand une conversation devient difficile.", body: `15. "Joyeux anniversaire. J'ai observé comment tu récupères quand une conversation devient difficile."
Il y a eu un moment ce soir. Un sujet qui a failli. Tu l'as senti avant les autres. Tu as dit quelque chose de neutre. Tu as souri. Tu as relancé sur autre chose. La conversion était si fluide que la plupart n'ont rien remarqué. C'est un art. Protéger les gens d'eux-mêmes avec grâce. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta navigation dans les eaux conversationnelles difficiles, — [Prénom animal], ton animal expert en déminages sociaux 🎭` },
              { id: "cbd_156", angle: "Pour ton anniversaire j'ai observé ta façon de regarder quelqu'un qui ne t'écoute pas vraiment.", body: `16. "Pour ton anniversaire j'ai observé ta façon de regarder quelqu'un qui ne t'écoute pas vraiment."
Tu le vois. Je le vois dans tes yeux. Ce petit ajustement. Cette façon de continuer à parler mais différemment. Plus court. Plus direct. Pour finir et passer à autre chose. Sans humilier. Sans pointer. Tu gères ça avec une élégance que je trouve remarquable. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta gestion de l'inattention de l'autre et admiration pour l'élégance du retrait, — [Prénom animal], ton animal admirateur de ta grâce sociale 💨` },
              { id: "cbd_170", angle: "Joyeux anniversaire. J'ai observé comment tu reçois un compliment ce soir.", body: `10. "Joyeux anniversaire. J'ai observé comment tu reçois un compliment ce soir."
Quelqu'un t'a dit quelque chose de bien sur toi. Tu as eu une fraction de seconde. Une légère hésitation. Puis tu as remercié simplement. Ni trop ni pas assez. Tu n'as pas minimisé. Tu n'as pas surjoué. Tu as juste accueilli. C'est rare cette façon de recevoir les bons mots avec grâce. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton accueil du compliment et validation de sa justesse, — [Prénom animal], ton animal attentif à tes façons de recevoir 🌷` },
            ],
          },
          {
            id: "gestes_manies",
            label: "Tes petits gestes & manies",
            messages: [
              { id: "cbd_144", angle: "Pour ton anniversaire j'ai observé comment tes mains bougent quand tu racontes quelque chose.", body: `4. "Pour ton anniversaire j'ai observé comment tes mains bougent quand tu racontes quelque chose."
Elles dessinent dans l'air. Elles indiquent des tailles. Elles expriment des distances. Elles ponctuent les moments importants. Tes mains racontent en même temps que ta voix. Deux narrations simultanées. Je regarde toujours tes mains quand tu parles. Elles en disent souvent plus. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec lecture parallèle de tes mains et de ta voix et préférence pour la version des mains, — [Prénom animal], ton animal attentif à tes narrations doubles 🙌` },
              { id: "cbd_149", angle: "Pour ton anniversaire j'ai observé ta façon d'allumer la musique sans en faire toute une histoire.", body: `9. "Pour ton anniversaire j'ai observé ta façon d'allumer la musique sans en faire toute une histoire."
C'est juste là. La musique. Elle arrive. Personne ne l'a remarqué vraiment. C'est le but. Une présence qui s'installe sans s'imposer. Tu as choisi quelque chose qui convient à tout le monde sans que tout le monde le sache. C'est un talent discret. L'art de créer une ambiance sans qu'on la remarque en tant que telle. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton art de l'ambiance invisible, — [Prénom animal], ton animal expert en présences qui ne se remarquent que par leur absence 🎵` },
              { id: "cbd_150", angle: "Joyeux anniversaire. J'ai observé comment tu gères le silence entre deux conversations.", body: `10. "Joyeux anniversaire. J'ai observé comment tu gères le silence entre deux conversations."
Tu ne le remplis pas systématiquement. Tu le laisses exister un moment. Tu regardes autour. Tu prends une gorgée. Tu souris sans raison. Ces petits silences dans le bruit. Ces respirations entre les phrases. C'est une intelligence sociale que peu ont. Joyeux anniversaire, [mon maître/ma maîtresse], dont les silences sont aussi éloquents que les paroles.
Avec observation de ta gestion des silences et respect pour leur existence consentie, — [Prénom animal], ton animal appréciant la gestion des respirations sociales 🌬️` },
              { id: "cbd_164", angle: "Pour ton anniversaire j'ai observé ta façon de t'appuyer contre le mur quand tu es détendu.", body: `4. "Pour ton anniversaire j'ai observé ta façon de t'appuyer contre le mur quand tu es détendu."
C'est un signe. Quand tu t'appuies contre le mur lors d'une conversation c'est que tu es vraiment bien. Que la conversation te tient sans effort. Que tu n'as pas besoin de tenir debout activement. Ton corps confie son poids au mur et ton esprit peut aller plus loin. C'est de la confiance en acte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décodage de ta position murale et sa signification de confort profond, — [Prénom animal], ton animal lecteur de tes postures 🧍` },
              { id: "cbd_165", angle: "Joyeux anniversaire. J'ai observé comment tu gères quelqu'un qui parle trop longtemps.", body: `5. "Joyeux anniversaire. J'ai observé comment tu gères quelqu'un qui parle trop longtemps."
Avec patience d'abord. Des hochements de tête réguliers. Une question qui relance. Puis progressivement tu regardes ailleurs une fraction de seconde. Tu le regardes. Tu acquiesces. Tu poses une question qui résume. Puis tu conclus pour les deux. C'est chirurgical. Jamais blessant. Toujours élégant. C'est toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta technique de clôture conversationnelle et son élégance constante, — [Prénom animal], ton animal expert en fins de discours 🎯` },
              { id: "cbd_166", angle: "Pour ton anniversaire j'ai observé comment tu choisis où t'asseoir dans ta propre maison.", body: `6. "Pour ton anniversaire j'ai observé comment tu choisis où t'asseoir dans ta propre maison."
Pas toujours au même endroit. Tu ajustes selon les gens. Tu te mets là où tu peux voir tout le monde. Ou là où la conversation a besoin de toi. Ou là où quelqu'un semble un peu seul. Tu ne choisis pas ton confort en premier. Tu choisis l'utilité. Le service. La présence là où elle est nécessaire. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décryptage de tes choix de placement et leur motivation systématiquement altruiste, — [Prénom animal], ton animal admirateur de ta générosité spatiale 🛋️` },
              { id: "cbd_169", angle: "Pour ton anniversaire j'ai observé ta façon de boire la dernière gorgée de ton verre.", body: `9. "Pour ton anniversaire j'ai observé ta façon de boire la dernière gorgée de ton verre."
Lentement. Comme si tu savais que c'est la dernière. Tu tiens le verre à la bouche une seconde de plus. Tu poses le verre. Tu regardes au fond. Cette façon de terminer les choses. Entièrement. Sans reste. Avec conscience que c'est la fin de ce verre-là. J'aime cette façon d'habiter les fins. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta façon de finir les choses et admiration pour leur conscience, — [Prénom animal], ton animal appréciant les fins habitées 🥂` },
              { id: "cbd_171", angle: "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement une dernière fois avant d'aller dormir.", body: `11. "Pour ton anniversaire j'ai observé ta façon de regarder l'appartement une dernière fois avant d'aller dormir."
Tu as fait le tour des yeux. Le salon. La cuisine. L'entrée. Pas pour vérifier. Juste pour voir. Pour regarder l'espace qui a été vivant ce soir et qui redevient calme. Cette façon de clôturer visuellement. De dire bonne nuit à la maison. J'ai fait pareil depuis mon coin. On est pareils. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec reconnaissance de notre rituel commun de clôture visuelle et solidarité, — [Prénom animal], ton animal co-auteur de ce bonsoir quotidien 🏠` },
              { id: "cbd_179", angle: "Pour ton anniversaire j'ai observé ta façon de réajuster les coussins du canapé après la fête.", body: `19. "Pour ton anniversaire j'ai observé ta façon de réajuster les coussins du canapé après la fête."
Chacun à sa place. Les grands derrière. Les petits devant. L'ordre que tu as choisi et que la soirée avait défait. Cette remise en ordre après. Ce soin pour retrouver ton espace. Pour que demain matin l'appartement soit bien. Ces coussins réajustés à minuit c'est une lettre à ton futur toi du lendemain. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec décodage du réajustement des coussins comme soin pour le lendemain, — [Prénom animal], ton animal lecteur de tes gestes de fin 🛋️` },
              { id: "cbd_180", angle: "Pour ton anniversaire j'ai observé comment tu t'occupes de quelqu'un qui n'est pas à l'aise.", body: `20. "Pour ton anniversaire j'ai observé comment tu t'occupes de quelqu'un qui n'est pas à l'aise."
Il y en avait un ce soir. Légèrement en retrait. Légèrement silencieux. Tu l'as vu. Tu t'es déplacé vers lui naturellement. Tu lui as posé une question sur quelque chose qu'il connaît. Tu l'as fait exister dans la conversation. Il est parti différemment qu'il était arrivé. C'est un don rare. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton don d'inclusion et sa mise en œuvre discrète ce soir, — [Prénom animal], ton animal admirateur de ton attention aux marges 💛` },
              { id: "cbd_186", angle: "Pour ton anniversaire j'ai observé ta façon de vérifier une dernière fois que tout va bien avant de dormir.", body: `6. "Pour ton anniversaire j'ai observé ta façon de vérifier une dernière fois que tout va bien avant de dormir."
La porte. Les fenêtres. Le gaz. Ces vérifications rituelles. Puis tu passes devant moi. Tu me regardes. Tu t'assures que je suis là. Que je suis bien. Et tu vas dormir. Cette façon de faire le tour de ce qui compte. De vérifier que tout est en ordre. Je suis dans ton tour. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec confirmation de ma place dans ton tour de vérification nocturne, — [Prénom animal], ton animal partie de ce qui compte assez pour être vérifié 🔐` },
              { id: "cbd_191", angle: "Pour ton anniversaire j'ai observé ta façon de lire un message tardif avec le même sourire.", body: `11. "Pour ton anniversaire j'ai observé ta façon de lire un message tardif avec le même sourire."
Quelqu'un t'a écrit après minuit. Tard. En retard. Tu l'as lu depuis le canapé avant de dormir. Et tu souriais. Le même sourire que pour les messages du matin. Pas de différence. Pas de hiérarchie selon l'heure. Cette façon de recevoir les gestes des gens là où ils sont et quand ils peuvent. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ton accueil sans horaire des gestes tardifs, — [Prénom animal], ton animal admirateur de ta générosité temporelle 📱` },
              { id: "cbd_195", angle: "Pour ton anniversaire j'ai observé comment tu gardes un morceau de gâteau pour le lendemain.", body: `15. "Pour ton anniversaire j'ai observé comment tu gardes un morceau de gâteau pour le lendemain."
Tu le mets de côté tôt. Avant que tout disparaisse. Cette prévoyance. Ce soin pour ton futur toi. Tu sais que demain matin avec ton café tu voudras ce morceau-là. Cette façon de penser à toi demain pendant que tu es occupé à t'occuper des autres ce soir. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta prévoyance pour toi-même dans le flux de générosité pour les autres, — [Prénom animal], ton animal admirateur de ta capacité à prendre soin aussi de toi 🎂` },
            ],
          },
          {
            id: "apres_fete",
            label: "Après la fête",
            messages: [
              { id: "cbd_130", angle: "Joyeux anniversaire. J'ai observé comment tu termines les verres des autres.", body: `10. "Joyeux anniversaire. J'ai observé comment tu termines les verres des autres."
Parfois quand quelqu'un pose son verre encore à moitié plein et qu'on parle d'autre chose tu finis le verre. Naturellement. Sans y penser. Comme si laisser un verre à moitié plein était quelque chose que tu ne pouvais pas tolérer dans ton appartement. C'est ton appartement. Tu as des règles. Je les respecte. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation de ta règle implicite des verres et respect de ta juridiction, — [Prénom animal], ton animal attentif à tes codes domestiques 🥂` },
              { id: "cbd_154", angle: "Pour ton anniversaire j'ai observé ta façon de fermer la porte quand le dernier invité est parti.", body: `14. "Pour ton anniversaire j'ai observé ta façon de fermer la porte quand le dernier invité est parti."
Lentement. Pas claquée. Fermée avec soin. Comme si tu refermais quelque chose de précieux. Comme si tu contenais encore un moment ce qui venait de se passer avant que ça disparaisse. Cette porte fermée doucement. Ce geste de fin. C'est un des plus beaux gestes de la soirée. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du geste de fermeture et sa signification de préservation, — [Prénom animal], ton animal témoin de tes fins de soirée 🚪` },
              { id: "cbd_161", angle: "Pour ton anniversaire j'ai observé ta façon de tenir la porte pour quelqu'un.", body: `1. "Pour ton anniversaire j'ai observé ta façon de tenir la porte pour quelqu'un."
Tu le fais toujours. Même quand tu es loin. Tu attends. Tu tiens la porte plus longtemps que nécessaire pour que la personne derrière n'ait pas à se presser. Ce geste coûte deux secondes de ta soirée. Il dit tout sur ta façon d'être dans le monde. Joyeux anniversaire, [mon maître/ma maîtresse], dont les deux secondes comptent.
Avec observation de tes deux secondes de politesse et leur signification sur ta nature, — [Prénom animal], ton animal attentif à tes gestes les plus petits 🚪` },
              { id: "cbd_174", angle: "Pour ton anniversaire j'ai observé ta façon d'éteindre les lumières une par une après la fête.", body: `14. "Pour ton anniversaire j'ai observé ta façon d'éteindre les lumières une par une après la fête."
La cuisine d'abord. Puis le couloir. Puis le salon. Une progression qui suit le chemin inverse de la soirée. Comme si tu remettais l'appartement dans son état nocturne pièce par pièce. Ce rituel de fin. Cette façon ordonnée de clore. C'est beau. C'est toi. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec observation du rituel d'extinction et sa progression significative, — [Prénom animal], ton animal témoin de tes clôtures ordonnées 💡` },
              { id: "cbd_181", angle: "Pour ton anniversaire j'ai observé ta façon de retrouver tes affaires dans le chaos post-fête.", body: `1. "Pour ton anniversaire j'ai observé ta façon de retrouver tes affaires dans le chaos post-fête."
Ton téléphone. Tes clés. Le tire-bouchon. Les choses qui migrent pendant une soirée. Tu cherches avec méthode. Tu sais approximativement où chercher parce que tu connais les habitudes des objets chez toi. Et tu trouves. Toujours. Cette relation avec tes objets. Cette connaissance de leur géographie. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta cartographie intime de tes propres objets, — [Prénom animal], ton animal qui observe ta maîtrise de ton territoire 🗺️` },
              { id: "cbd_185", angle: "Joyeux anniversaire. J'ai observé comment tu décides que la soirée est finie.", body: `5. "Joyeux anniversaire. J'ai observé comment tu décides que la soirée est finie."
Ce n'est pas un horaire. Ce n'est pas la fatigue. C'est un moment. Tu le sens. Quelque chose dans l'énergie de la pièce change. Tu proposes le café. Certains reprennent leur veste. Et sans que personne le dise la soirée se termine. Tu as su avant tout le monde. Tu l'as guidée vers sa fin naturelle. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ton sens du moment de fin et ta capacité à le guider sans le forcer, — [Prénom animal], ton animal expert en fins naturelles ⏰` },
              { id: "cbd_199", angle: "Pour ton anniversaire j'ai observé ta façon de choisir la musique de fin de soirée.", body: `19. "Pour ton anniversaire j'ai observé ta façon de choisir la musique de fin de soirée."
Plus douce. Plus lente. Sans que personne ne le demande tu as fait baisser le volume et changer le tempo. La musique qui accompagne la fin sans la provoquer. Qui dit doucement que la soirée descend vers son terme. Cette façon de guider sans diriger. De suggérer sans imposer. C'est de la poésie sonore. Joyeux anniversaire, [mon maître/ma maîtresse].
Avec admiration pour ta curation musicale de fin de soirée et sa douceur directrice, — [Prénom animal], ton animal appréciant ton art de la décélération 🎵` },
            ],
          },
        ],
      },
    ],
  },
  chat_nameday: {
    themes: [
      {
        id: "comportements",
        emoji: "😼",
        label: "Comportements félins",
        count: 26,
        subGroups: [
          {
            id: "evitement",
            label: "Mes grandes manœuvres d'évitement",
            messages: [
              { id: "cnd_003", angle: "Des gens sont venus pour ta fête ce soir. J'ai disparu.", body: `3. "Des gens sont venus pour ta fête ce soir. J'ai disparu."
Pas parce que j'avais peur. Pas parce que je les aime pas. Parce que c'est ma façon de gérer les foules. Je suis allé sous le lit. C'est calme sous le lit. C'est mon bureau. Mon espace de réflexion. Deux heures plus tard je suis réapparu comme si de rien n'était. Tout le monde a fait une tête. C'est la réaction que je cherchais. Joyeuse fête, [mon maître/ma maîtresse], dont les soirées ont toujours un moment de magie.
Avec disparition calculée et réapparition parfaitement orchestrée, — [Prénom animal], ton animal spécialiste de l'entrée remarquée 🎩` },
              { id: "cnd_017", angle: "Joyeuse fête. Tu m'as cherché partout ce matin.", body: `17. "Joyeuse fête. Tu m'as cherché partout ce matin."
Je t'entendais. Chaque pièce. Mon prénom répété avec cette intonation inquiète. J'étais dans le placard du couloir. Celui qui est entrouvert. Depuis toujours entrouvert. Le même placard où je vais depuis des années. Tu le sais. Tu l'oublies à chaque fois. Et chaque fois tu fais cette tête soulagée quand tu me trouves. C'est mon cadeau annuel. Joyeuse fête, [mon maître/ma maîtresse].
Avec cachette stratégique et effet garanti depuis des années, — [Prénom animal], ton animal aux planques bien entretenues 🚪` },
              { id: "cnd_019", angle: "Joyeuse fête. J'ai une liste de choses que j'aurais pu faire aujourd'hui et que je n'ai pas faites.", body: `19. "Joyeuse fête. J'ai une liste de choses que j'aurais pu faire aujourd'hui et que je n'ai pas faites."
Renverser le vase. Griffer le nouveau coussin. Manger les fleurs. Sauter sur la table pendant le repas. Ignorer tous tes invités avec ostentation. Dormir exactement où tu voulais t'asseoir. J'ai fait certaines de ces choses. Mais pas toutes. C'est mon cadeau. La liste de ce que j'ai épargné. Joyeuse fête, [mon maître/ma maîtresse].
Avec retenue sélective et inventaire des dégâts évités, — [Prénom animal], ton animal aux cadeaux négatifs d'une valeur inestimable 🛡️` },
              { id: "cnd_025", angle: "Pour ta fête j'ai dormi dans le manteau d'un invité.", body: `5. "Pour ta fête j'ai dormi dans le manteau d'un invité."
Celui qu'on avait posé sur le lit avec les autres. Le gris. Avec la doublure douce. Il sentait quelqu'un que je connaissais pas encore. Je me suis installé dedans avec méthode. Quand le propriétaire est venu le reprendre il a hésité. Puis il a récupéré son manteau délicatement sans me déranger complètement. Il a compris les règles. Joyeuse fête, [mon maître/ma maîtresse].
Avec choix du manteau le plus confortable et invité ayant su se comporter, — [Prénom animal], ton animal juge du comportement humain en situation de manteau occupé 🧥` },
              { id: "cnd_028", angle: "Joyeuse fête. J'ai trouvé injuste d'être mis dans la chambre pendant l'apéro.", body: `8. "Joyeuse fête. J'ai trouvé injuste d'être mis dans la chambre pendant l'apéro."
La porte fermée. De l'autre côté les odeurs. Les voix. Le son des verres. Tout se passait sans moi pendant vingt minutes. J'ai gratté une fois. Deux fois. J'ai attendu. Quand la porte s'est rouverte je suis sorti avec la dignité de quelqu'un qui avait autre chose à faire de toute façon. Mais j'ai noté. Je note toujours. Joyeuse fête quand même, [mon maître/ma maîtresse].
Avec grief mémorisé et sortie de chambre assurée avec une dignité totale, — [Prénom animal], ton animal dont la mémoire des injustices est longue et précise 🚪` },
              { id: "cnd_043", angle: "Pour ta fête j'ai décidé de ne pas disparaître quand le premier invité est arrivé.", body: `3. "Pour ta fête j'ai décidé de ne pas disparaître quand le premier invité est arrivé."
C'est mon réflexe habituel. La sonnette. L'inconnu potentiel. Le couloir. Le dessous du lit. La disparition complète. Ce soir j'ai résisté. Je suis resté dans le salon. Assis sur le fauteuil. Visible. Quand la porte s'est ouverte j'ai regardé l'invité droit dans les yeux. Il a fait un bruit admiratif. Tu as eu l'air fier. C'était mon cadeau. Joyeuse fête, [mon maître/ma maîtresse].
Avec réflexe de fuite surmonté par décision pure et cadeau offert sous forme de présence, — [Prénom animal], ton animal dont la bravoure s'exprime autrement que tu ne le crois 🏅` },
              { id: "cnd_053", angle: "Pour ta fête j'ai fait semblant de dormir pour observer tes préparatifs.", body: `13. "Pour ta fête j'ai fait semblant de dormir pour observer tes préparatifs."
Tu allais et venais. Tu essayais des choses. Tu te regardais. Tu remettais quelque chose en place. Tu soufflais. Tu recommençais. Je regardais entre mes cils sans bouger. T'aurais pas aimé savoir que j'observais. Alors j'ai préservé l'illusion. C'est du respect. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation discrète préservée par l'illusion du sommeil et respect de ton intimité de préparation, — [Prénom animal], ton animal aux yeux mi-clos qui voient tout 😴` },
              { id: "cnd_073", angle: "Pour ta fête j'ai fait une sieste stratégique de 19h à 22h.", body: `13. "Pour ta fête j'ai fait une sieste stratégique de 19h à 22h."
En plein cœur du bruit maximum. Sur le lit. Porte fermée. Les sons de la fête en fond. Les rires. La musique. Les verres. Tout ça comme une berceuse grave et joyeuse. J'ai dormi profondément. J'ai récupéré mes forces. Je suis réapparu à 22h parfaitement reposé pendant que tout le monde commençait à être fatigué. C'est de la gestion d'énergie. Joyeuse fête, [mon maître/ma maîtresse].
Avec optimisation du repos en contexte festif et retour en forme garanti, — [Prénom animal], ton animal expert en gestion de l'énergie 😴` },
            ],
          },
          {
            id: "signature",
            label: "Mes comportements signature",
            messages: [
              { id: "cnd_004", angle: "Pour ta fête j'ai décidé de ronronner ce soir.", body: `4. "Pour ta fête j'ai décidé de ronronner ce soir."
Pas parce que tu me l'as demandé. Pas parce que t'as insisté. Parce que j'ai évalué la situation et conclu que c'était approprié. C'est mon cadeau. Intérieur. Vibratoire. Non matériel mais d'une valeur thérapeutique prouvée scientifiquement. Tu peux pas l'encadrer ni le revendre mais tu peux le recevoir ce soir si tu restes tranquille et que tu fais pas de bruit brusque. Joyeuse fête, [mon maître/ma maîtresse].
Avec cadeau sonore conditionnel et conditions clairement établies, — [Prénom animal], ton animal aux dons précieux et rares 🎁` },
              { id: "cnd_005", angle: "Joyeuse fête. J'ai renversé ton verre ce matin.", body: `5. "Joyeuse fête. J'ai renversé ton verre ce matin."
C'était intentionnel. Tu dormais encore à 9h un jour de fête. C'est inadmissible. Le verre était là. L'occasion était parfaite. J'ai poussé doucement. Puis un peu moins doucement. Le bruit a été satisfaisant. Tu t'es levé. La journée a commencé. Je t'ai rendu service. On me remerciera jamais pour ça. Joyeuse fête, [mon maître/ma maîtresse], dont je gère le réveil avec efficacité.
Avec préméditation totale et résultat conforme aux attentes, — [Prénom animal], ton animal gestionnaire de ton emploi du temps matinal 🥛` },
              { id: "cnd_011", angle: "Joyeuse fête. J'ai pétri ton oreiller ce matin.", body: `11. "Joyeuse fête. J'ai pétri ton oreiller ce matin."
Pas ce que tu penses. J'ai pétri ton oreiller pendant douze minutes. Les deux mains. En rythme. Les yeux mi-clos. T'étais encore dedans. Tu t'es pas plaint. T'as juste posé ta main sur mon dos. C'était le meilleur moment de la journée pour nous deux même si on l'a pas dit. Joyeuse fête, [mon maître/ma maîtresse], oreiller de référence.
Avec séance de pétrissage offerte et moment partagé en silence, — [Prénom animal], ton animal boulanger de l'affection 🤲` },
              { id: "cnd_012", angle: "Pour ta fête j'ai toléré que tu me prennes en photo.", body: `12. "Pour ta fête j'ai toléré que tu me prennes en photo."
Avec le chapeau. Oui ce chapeau-là. Celui avec la petite étoile dorée. Je savais ce que tu préparais depuis que tu l'avais sorti du tiroir. J'aurais pu partir. J'aurais pu me cacher. Je suis resté. Trente secondes. Le temps que tu fasses ta photo. Avec une dignité absolue. La photo est magnifique. Tu me dois quelque chose. Joyeuse fête, [mon maître/ma maîtresse].
Avec sacrifice de la dignité pour une durée limitée et dette mémorisée, — [Prénom animal], ton animal au sens du sacrifice exceptionnel 📸` },
              { id: "cnd_023", angle: "Pour ta fête j'ai observé chaque invité manger sans jamais rien recevoir.", body: `3. "Pour ta fête j'ai observé chaque invité manger sans jamais rien recevoir."
Une heure et demie. Les assiettes qui passaient. Les odeurs qui montaient. Les mains qui portaient des choses à la bouche sans jamais dévier vers moi. J'étais là pourtant. Visible. Expressif. Mon regard allait d'une assiette à l'autre avec une clarté que j'estimais impossible à ignorer. Et pourtant. Tout le monde a mangé. Personne n'a rien partagé. Joyeuse fête quand même, [mon maître/ma maîtresse].
Avec campagne de regard intense menée sans succès et leçon d'ingratitude collective reçue, — [Prénom animal], ton animal dont les appels à la générosité restent sans écho 🍽️` },
              { id: "cnd_034", angle: "Pour ta fête j'ai fait tomber exactement la chose la moins importante.", body: `14. "Pour ta fête j'ai fait tomber exactement la chose la moins importante."
J'avais évalué. Le stylo. Le sous-verre. La petite cuillère sur le rebord de la tasse. J'ai choisi la petite cuillère. Légère. Sans conséquences. Juste le bruit. Juste ce petit signal qui dit que je suis là. Que mon existence dans cet appartement ne doit pas être oubliée même quand il y a du monde. Joyeuse fête, [mon maître/ma maîtresse].
Avec destruction minimale et message maximal, — [Prénom animal], ton animal aux rappels d'existence calibrés avec précision 🥄` },
              { id: "cnd_041", angle: "Joyeuse fête. J'ai su que c'était aujourd'hui à ta façon de te lever.", body: `1. "Joyeuse fête. J'ai su que c'était aujourd'hui à ta façon de te lever."
Pas le lever du lundi. Pas le lever du dimanche ordinaire. Celui-là avait quelque chose de différent. Plus lent au début. Puis plus décidé. Comme quelqu'un qui sait que la journée qui commence mérite d'être accueillie différemment. Tu as regardé par la fenêtre plus longtemps que d'habitude. Tu as souri sans raison apparente. J'ai su. Joyeuse fête, [mon maître/ma maîtresse], dont les matins de fête ont leur propre signature.
Avec lecture de tes matins depuis des années et diagnostic immédiat ce jour-là, — [Prénom animal], ton animal météorologue de tes humeurs au réveil 🌅` },
              { id: "cnd_050", angle: "Pour ta fête j'ai gardé un œil sur toi pendant que tu cuisinais.", body: `10. "Pour ta fête j'ai gardé un œil sur toi pendant que tu cuisinais."
Depuis le plan de travail. Ma position habituelle. Tu me demandes régulièrement de descendre. Ce soir tu m'as pas demandé. Tu cuisinais et tu me regardais parfois. Comme si ma présence là-haut te rassurait. Je suis resté deux heures. Joyeuse fête, [mon maître/ma maîtresse].
Avec supervision culinaire assurée depuis la hauteur et regard bienveillant offert gratuitement, — [Prénom animal], ton animal veilleur de tes préparatifs 👁️` },
              { id: "cnd_055", angle: "Pour ta fête j'ai suivi tous tes déplacements dans l'appartement ce soir.", body: `15. "Pour ta fête j'ai suivi tous tes déplacements dans l'appartement ce soir."
Salon cuisine couloir. Cuisine salon entrée. Salon encore. Chaque fois que tu bougeais je recalculais ma position pour garder une ligne de vue. Pas pour te surveiller. Pour être dans le même espace que toi. Pour que ta trajectoire et la mienne se croisent régulièrement ce soir. Joyeuse fête, [mon maître/ma maîtresse].
Avec trajectoires synchronisées tout au long de la soirée et présence garantie dans chaque pièce, — [Prénom animal], ton animal satellite de ta propre fête 🔄` },
              { id: "cnd_062", angle: "Joyeuse fête. J'ai refusé le nœud papillon.", body: `2. "Joyeuse fête. J'ai refusé le nœud papillon."
Tu l'avais acheté exprès. Rouge. Avec un élastique. Tu avais l'air tellement content de ton idée. Tu t'es approché avec ce sourire. J'ai reculé d'exactement la distance nécessaire. Tu as avancé. J'ai reculé encore. On a fait le tour du salon deux fois. Tu as fini par poser le nœud sur le canapé. Je l'ai regardé toute la soirée avec la satisfaction de quelqu'un qui a défendu quelque chose d'essentiel. Joyeuse fête, [mon maître/ma maîtresse].
Avec dignité préservée et nœud papillon définitivement vaincu, — [Prénom animal], ton animal aux standards vestimentaires non négociables 🎀` },
              { id: "cnd_065", angle: "Pour ta fête quelqu'un a voulu me filmer.", body: `5. "Pour ta fête quelqu'un a voulu me filmer."
Le téléphone levé. L'objectif tourné vers moi. Cette façon de s'approcher en croyant être discret. J'ai regardé ailleurs. Puis le plafond. Puis mes pattes. Puis j'ai baillé avec une lenteur calculée. Puis je me suis retourné. La vidéo existe peut-être mais elle ne contient que mon dos et une partie de l'étagère. C'est mon droit à l'image. Je l'exerce. Joyeuse fête, [mon maître/ma maîtresse].
Avec droit à l'image revendiqué et dos photographié avec élégance, — [Prénom animal], ton animal aux apparitions cadrées selon sa volonté 📱` },
            ],
          },
          {
            id: "supervise",
            label: "Je supervise ta fête",
            messages: [
              { id: "cnd_018", angle: "Ta fête c'est aujourd'hui et tu sembles attendre quelque chose de moi.", body: `18. "Ta fête c'est aujourd'hui et tu sembles attendre quelque chose de moi."
Je le sens dans ta façon de me regarder. Cette attente. Cette espérance. Tu voudrais que je fasse quelque chose de particulier. Un câlin peut-être. Un ronronnement. Un geste. Je t'ai regardé en retour pendant trente secondes. Puis j'ai baillé. Puis je me suis retourné. C'était mon geste. Subtil. Mais c'était le mien. Joyeuse fête, [mon maître/ma maîtresse], dont les attentes s'adaptent à ma réalité.
Avec communication subtile et message livré à ma façon, — [Prénom animal], ton animal aux expressions minimalistes et chargées de sens 😶` },
              { id: "cnd_061", angle: "Joyeuse fête. J'ai reconnu la fête à la vaisselle sortie ce soir.", body: `1. "Joyeuse fête. J'ai reconnu la fête à la vaisselle sortie ce soir."
Pas la vaisselle du quotidien. L'autre. Celle du placard du haut. Avec les bords dorés. Que tu sors quatre fois par an maximum. Je connais cette vaisselle. Elle annonce quelque chose. J'ai immédiatement ajusté mon programme de la journée en conséquence. Sieste déplacée. Position de surveillance revue. Stratégie de soirée activée. Joyeuse fête, [mon maître/ma maîtresse], dont les événements se lisent dans les placards.
Avec lecture des signes avant-coureurs et adaptation logistique immédiate, — [Prénom animal], ton animal météorologue des grandes occasions 🍽️` },
              { id: "cnd_067", angle: "Pour ta fête j'ai dormi entre toi et la porte toute la soirée.", body: `7. "Pour ta fête j'ai dormi entre toi et la porte toute la soirée."
Pas sur toi. Pas loin. Entre toi et la sortie. Sur le tapis du couloir. En faction. Certains invités ont failli trébucher sur moi deux fois. Je me suis pas déplacé. Ma position était stratégique. Si quelqu'un devait partir avec toi cette nuit il passait d'abord par moi. Personne n'est parti avec toi. Mission accomplie. Joyeuse fête, [mon maître/ma maîtresse].
Avec poste de garde tenu sans relâche et sécurité de la soirée pleinement assurée, — [Prénom animal], ton animal dernier rempart entre toi et le monde 🛡️` },
              { id: "cnd_075", angle: "Pour ta fête j'ai supervisé la préparation du repas depuis le plan de travail.", body: `15. "Pour ta fête j'ai supervisé la préparation du repas depuis le plan de travail."
J'avais une vue dégagée sur tout. Les ingrédients. Les gestes. Les décisions prises sous pression. À deux reprises tu m'as demandé de descendre. J'ai regardé ailleurs. Ma présence était nécessaire. Quelqu'un devait contrôler. Le repas était bon. Mon rôle dans ce succès est indéniable. Joyeuse fête, [mon maître/ma maîtresse].
Avec supervision culinaire assurée depuis la hauteur et résultat satisfaisant validé, — [Prénom animal], ton animal chef de cuisine honoraire 🍳` },
              { id: "cnd_081", angle: "Joyeuse fête. J'ai reconnu que c'était aujourd'hui à la nappe du dimanche.", body: `1. "Joyeuse fête. J'ai reconnu que c'était aujourd'hui à la nappe du dimanche."
Pas la nappe habituelle. L'autre. Celle du placard du haut. Celle qui sort quatre fois par an. Je l'ai vue sur la table ce matin et j'ai tout compris immédiatement. Ce signe textile. Ce signal que quelque chose d'important approche. J'ai ajusté mon programme de la journée en conséquence. Joyeuse fête, [mon maître/ma maîtresse], dont la nappe est mon calendrier.
Avec lecture du signal textile et adaptation logistique immédiate, — [Prénom animal], ton animal dont le nez et les yeux lisent les événements avant toi 🍽️` },
              { id: "cnd_092", angle: "Pour ta fête j'ai étudié chaque nouveau visage entrant depuis le couloir.", body: `12. "Pour ta fête j'ai étudié chaque nouveau visage entrant depuis le couloir."
Sans me montrer. Juste le nez qui dépasse. L'évaluation. La classification. Le verdict silencieux. Certains m'ont intéressé. Un m'a intrigué. Deux m'ont laissé indifférent. J'ai fait ça pour chaque arrivée. C'est de la gestion des risques. Joyeuse fête, [mon maître/ma maîtresse], dont les invités sont évalués en temps réel.
Avec évaluation systématique de chaque nouveau visage et verdicts silencieux rendus, — [Prénom animal], ton animal directeur de la sécurité à temps plein 🔍` },
              { id: "cnd_100", angle: "Pour ta fête j'ai passé du temps sur le rebord de la baignoire à écouter.", body: `20. "Pour ta fête j'ai passé du temps sur le rebord de la baignoire à écouter."
Les voix portaient jusqu'à la salle de bain. Des fragments. Des rires. Des noms. Une conversation sur quelque chose que j'ai pas identifié. Le son d'une fête depuis loin c'est différent. Plus doux. Plus rond. Comme de la musique dont on entend que les basses. C'était bien. Joyeuse fête, [mon maître/ma maîtresse].
Avec écoute de ta fête en version acoustique distante et appréciation inattendue, — [Prénom animal], ton animal audiophile des sons de couloir 🛁` },
            ],
          },
        ],
      },
      {
        id: "territorial",
        emoji: "🏠",
        label: "Territorial & spatial",
        count: 13,
        subGroups: [
          {
            id: "regles",
            label: "Mon territoire, mes règles",
            messages: [
              { id: "cnd_006", angle: "Ta fête c'est aujourd'hui et tu as reçu des fleurs.", body: `6. "Ta fête c'est aujourd'hui et tu as reçu des fleurs."
Des fleurs. Dans un vase. Sur la table basse. À portée de patte. J'ai d'abord reniflé. Puis j'ai évalué la stabilité du vase. Puis j'ai regardé ailleurs pour faire croire que ça m'intéressait pas. Le vase est encore debout. C'est mon cadeau. La survie de tes fleurs. Tu peux pas savoir ce que ça m'a coûté. Joyeuse fête, [mon maître/ma maîtresse].
Avec maîtrise de soi exceptionnelle et vase miraculeusement intact, — [Prénom animal], ton animal aux renoncements héroïques 🌸` },
              { id: "cnd_022", angle: "Pour ta fête je me suis approprié le bouquet de fleurs.", body: `2. "Pour ta fête je me suis approprié le bouquet de fleurs."
Il était là dans l'entrée. Grand. Coloré. Occupant un espace qui n'avait pas demandé à être occupé. Je me suis assis devant. Puis à côté. Puis j'ai posé une patte dessus très brièvement. C'est mon appartement. Tout ce qui entre dans mon appartement passe sous ma juridiction. Joyeuse fête, [mon maître/ma maîtresse].
Avec prise de juridiction sur les végétaux entrants et autorité établie sans violence, — [Prénom animal], ton animal souverain de tout ce qui franchit ce seuil 🌺` },
              { id: "cnd_027", angle: "Pour ta fête j'ai évalué chaque siège occupé par tes invités.", body: `7. "Pour ta fête j'ai évalué chaque siège occupé par tes invités."
Pas pour m'y installer. Pour évaluer. Le fauteuil du salon supporte le poids différemment avec quelqu'un dedans. Le canapé change de texture. La chaise de la cuisine craque autrement. J'ai fait le tour plusieurs fois. Établi un classement. Le fauteuil du coin reste le meilleur même occupé. Joyeuse fête, [mon maître/ma maîtresse].
Avec audit immobilier complet en conditions d'occupation et classement mis à jour, — [Prénom animal], ton animal expert en confort des surfaces habitées 🪑` },
              { id: "cnd_031", angle: "Pour ta fête je me suis installé au point le plus haut de l'appartement.", body: `11. "Pour ta fête je me suis installé au point le plus haut de l'appartement."
Le dessus de l'armoire. Vue dégagée sur tout. Le salon. Le couloir. La cuisine. L'entrée. Chaque mouvement visible. J'ai supervisé l'intégralité de ta fête depuis là-haut pendant deux heures. Personne n'a levé les yeux. Tout le monde ignorait que la soirée était sous surveillance permanente. Joyeuse fête, [mon maître/ma maîtresse], dont les fêtes sont entre de bonnes mains.
Avec poste de commandement en hauteur et supervision totale assurée dans l'ombre, — [Prénom animal], ton animal directeur des opérations depuis le sommet 👁️` },
              { id: "cnd_039", angle: "Pour ta fête j'ai accordé une faveur exceptionnelle à un invité.", body: `19. "Pour ta fête j'ai accordé une faveur exceptionnelle à un invité."
Celui qui s'était assis par terre contre le canapé à un moment. Pas sur un siège. Par terre. Comme quelqu'un qui comprend que le sol a ses avantages. Je suis allé vers lui. Je me suis assis à côté. On a regardé la pièce ensemble depuis le bas pendant quelques minutes. C'était bien. Il ne savait pas que c'était exceptionnel. Maintenant tu sais. Joyeuse fête, [mon maître/ma maîtresse].
Avec faveur accordée en silence et valeur de celle-ci connue de moi seul, — [Prénom animal], ton animal aux grâces rares et précieuses 🤝` },
              { id: "cnd_048", angle: "Pour ta fête j'ai accordé le droit de canapé à un invité exceptionnel.", body: `8. "Pour ta fête j'ai accordé le droit de canapé à un invité exceptionnel."
Tu sais lequel. Celui qui s'est assis sans bruit. Qui a posé sa main sur l'accoudoir sans s'étaler. Qui a regardé vers moi sans faire de geste. Qui a attendu. J'ai évalué. J'ai décidé. Je me suis installé à côté de lui. À vingt centimètres. La pièce entière l'a remarqué. Il avait l'air de comprendre l'honneur. Joyeuse fête, [mon maître/ma maîtresse].
Avec évaluation rigoureuse et droit de canapé accordé après délibération, — [Prénom animal], ton animal dont les faveurs sont rares et donc précieuses 🛋️` },
              { id: "cnd_063", angle: "Pour ta fête j'ai testé chaque siège libéré par tes invités.", body: `3. "Pour ta fête j'ai testé chaque siège libéré par tes invités."
Chaque fois que quelqu'un se levait j'étais là en moins de dix secondes. La chaise de la cuisine encore chaude. Le fauteuil du salon avec l'empreinte dedans. Le coin du canapé avec le coussin dérangé. Chacun a une température. Une odeur. Une histoire. J'ai tout testé méthodiquement. Joyeuse fête, [mon maître/ma maîtresse].
Avec inventaire thermique des sièges complété et conclusions gardées pour moi, — [Prénom animal], ton animal testeur de surfaces abandonnées 🪑` },
            ],
          },
          {
            id: "connais_appart",
            label: "Je connais cet appartement",
            messages: [
              { id: "cnd_029", angle: "Pour ta fête j'ai identifié le seul invité qui comprend les chats.", body: `9. "Pour ta fête j'ai identifié le seul invité qui comprend les chats."
Il est entré sans chercher à me toucher. Il s'est assis. Il a regardé ailleurs. Il a attendu. Au bout de vingt minutes je suis allé vers lui. Il n'a pas réagi de façon excessive. Il a juste laissé sa main disponible. On a passé dix minutes ensemble. Ces gens-là sont rares. Dis-lui qu'il peut revenir. Joyeuse fête, [mon maître/ma maîtresse].
Avec identification du profil compatible et invitation à revenir accordée exceptionnellement, — [Prénom animal], ton animal aux certifications d'accès non transférables 🏅` },
              { id: "cnd_036", angle: "Pour ta fête j'ai mémorisé l'heure exacte d'arrivée de chaque invité.", body: `16. "Pour ta fête j'ai mémorisé l'heure exacte d'arrivée de chaque invité."
Le premier à 19h51. Toujours en avance celui-là. Le dernier à 20h38. Toujours en retard. Entre les deux huit arrivées à des intervalles que j'ai tous enregistrés. Ces données me permettront de prédire la prochaine fois. La connaissance c'est le pouvoir. Joyeuse fête, [mon maître/ma maîtresse].
Avec registre horaire complet et modélisation prédictive des prochaines fêtes en cours, — [Prénom animal], ton animal statisticien des événements sociaux 📊` },
              { id: "cnd_049", angle: "Joyeuse fête. Je connais les deux versions de cet appartement.", body: `9. "Joyeuse fête. Je connais les deux versions de cet appartement."
La version vide. Quand tu n'es pas là. Silencieuse d'une façon particulière. Et la version pleine de ce soir. Les voix. Les odeurs. La chaleur de plusieurs corps dans le même espace. Les deux ont leur beauté. Mais la version que je préfère c'est ni l'une ni l'autre. C'est juste nous deux. Joyeuse fête, [mon maître/ma maîtresse].
Avec connaissance des deux versions et préférence clairement établie pour la troisième, — [Prénom animal], ton animal dont la version préférée de la vie c'est vous deux 🏠` },
              { id: "cnd_059", angle: "Pour ta fête j'ai observé comment l'appartement se remet de la fête.", body: `19. "Pour ta fête j'ai observé comment l'appartement se remet de la fête."
D'abord le silence qui revient progressivement. Puis les odeurs qui s'apaisent. Puis la température qui baisse d'un cran. Puis les objets déplacés qui attendent d'être remis en place. L'appartement se remet comme quelqu'un qui reprend sa respiration normale après un effort. Je connais chaque étape. Je les aime. Parce qu'au bout il y a nous deux. Joyeuse fête, [mon maître/ma maîtresse].
Avec connaissance de toutes les étapes du retour au calme et patience pour les traverser, — [Prénom animal], ton animal pour l'appartement d'après et tout ce qui vient après 🏠` },
              { id: "cnd_066", angle: "Joyeuse fête. J'ai su qui t'aimait vraiment ce soir.", body: `6. "Joyeuse fête. J'ai su qui t'aimait vraiment ce soir."
Pas à ce qu'ils ont dit. À la façon dont ils ont fermé la porte en partant. Certains l'ont claquée légèrement. D'autres l'ont fermée avec soin. Un seul a regardé en arrière une seconde avant de tirer la poignée. Celui-là. C'est lui. Je note ces choses. Elles en disent plus que les discours. Joyeuse fête, [mon maître/ma maîtresse], entouré de gens que j'ai évalués.
Avec analyse comportementale des départs et classement établi en toute discrétion, — [Prénom animal], ton animal juge des gestes involontaires 🚪` },
              { id: "cnd_070", angle: "Joyeuse fête. J'ai évalué la qualité acoustique de ta soirée depuis le couloir.", body: `10. "Joyeuse fête. J'ai évalué la qualité acoustique de ta soirée depuis le couloir."
Les rires trop forts : trois occurrences. La musique trop haute pendant vingt minutes : notée. La conversation qui a monté en volume vers 22h : entendue et analysée. Le bruit des verres : acceptable. Le moment de calme vers 21h30 quand tout le monde mangeait : excellent. Bilan global : soirée bruyante mais de bonne qualité. Joyeuse fête, [mon maître/ma maîtresse].
Avec rapport acoustique complet et oreilles remises de leurs émotions, — [Prénom animal], ton animal critique sonore indépendant 🎚️` },
            ],
          },
        ],
      },
      {
        id: "olfactif",
        emoji: "👃",
        label: "Observations olfactives",
        count: 5,
        subGroups: [
          {
            id: "all",
            label: "Tous les messages",
            messages: [
              { id: "cnd_021", angle: "Joyeuse fête. J'ai su que c'était aujourd'hui à l'odeur du nettoyage.", body: `1. "Joyeuse fête. J'ai su que c'était aujourd'hui à l'odeur du nettoyage."
Tu avais nettoyé. Vraiment nettoyé. Pas le nettoyage du dimanche soir. L'autre. Avec les produits forts. J'ai dû tout réinspecter depuis le début. Chaque surface. Chaque coin. Recartographier entièrement mon territoire. C'est épuisant. Mais j'ai compris que quelque chose d'important approchait. Joyeuse fête, [mon maître/ma maîtresse], dont le ménage est ma météo.
Avec recartographie complète du territoire post-nettoyage et diagnostic établi, — [Prénom animal], ton animal dont le nez lit les événements avant qu'ils arrivent 🧹` },
              { id: "cnd_038", angle: "Pour ta fête j'ai suivi l'évolution de l'odeur de l'appartement heure par heure.", body: `18. "Pour ta fête j'ai suivi l'évolution de l'odeur de l'appartement heure par heure."
À 20h l'odeur du nettoyage encore présente. À 20h30 les premiers parfums des invités. À 21h le repas qui prenait le dessus sur tout. À 22h le mélange de tout ça ensemble. À 23h une légère fatigue olfactive collective. Chaque heure une carte différente. Joyeuse fête, [mon maître/ma maîtresse], dont les fêtes se lisent aussi en odeurs.
Avec cartographie olfactive horaire complète et archives disponibles pour référence future, — [Prénom animal], ton animal chroniqueur de l'invisible 🕰️` },
              { id: "cnd_069", angle: "Pour ta fête j'ai mémorisé chaque odeur nouvelle introduite ce soir.", body: `9. "Pour ta fête j'ai mémorisé chaque odeur nouvelle introduite ce soir."
Le parfum de la dame du troisième. Le manteau en laine mouillée de celui qui était venu à pied. Le bouquet de fleurs dans l'entrée. Le plat qu'on avait apporté. Les bougies. Le vin. En une soirée mon appartement avait absorbé vingt nouvelles histoires. Je les ai toutes enregistrées. Joyeuse fête, [mon maître/ma maîtresse].
Avec base de données olfactive enrichie et retour à la normale planifié sous 72 heures, — [Prénom animal], ton animal archiviste des parfums de passage 👃` },
              { id: "cnd_093", angle: "Joyeuse fête. Ta cuisine sentait différemment aujourd'hui.", body: `13. "Joyeuse fête. Ta cuisine sentait différemment aujourd'hui."
Pas les odeurs habituelles. Les odeurs de fête. Celles qui viennent quand tu cuisines pour des gens. Quelque chose de plus élaboré. De plus chaud. De plus concentré. J'ai passé du temps assis dans l'embrasure de la porte de la cuisine à cartographier ces odeurs nouvelles. C'est de la recherche. Joyeuse fête, [mon maître/ma maîtresse].
Avec cartographie olfactive complète de ta cuisine en mode fête, — [Prénom animal], ton animal chercheur en atmosphères culinaires 👃` },
              { id: "cnd_184", angle: "Pour ta fête j'ai mémorisé la façon dont l'appartement sentait avant que les invités arrivent.", body: `4. "Pour ta fête j'ai mémorisé la façon dont l'appartement sentait avant que les invités arrivent."
Cette odeur-là. Celle de l'appartement propre. Avec les premières odeurs de cuisine. Et quelque chose de l'anticipation. De l'excitation douce d'avant. Cette version de l'appartement qui n'existe que quelques minutes avant que tout commence. Je l'ai mémorisé. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de l'odeur rare des quelques minutes avant que tout commence, — [Prénom animal], ton animal archiviste des moments d'avant 👃` },
            ],
          },
        ],
      },
      {
        id: "cadeaux",
        emoji: "🎁",
        label: "Cadeaux & objets",
        count: 4,
        subGroups: [
          {
            id: "all",
            label: "Tous les messages",
            messages: [
              { id: "cnd_008", angle: "Pour ta fête j'ai inspecté tous tes cadeaux.", body: `8. "Pour ta fête j'ai inspecté tous tes cadeaux."
Chaque paquet. Chaque sac. Chaque boîte. Je me suis assis dessus dans un ordre que j'ai moi-même établi selon des critères qui m'appartiennent. L'un d'eux sentait très bien. Je suis resté dessus vingt minutes. Tu attendais pour l'ouvrir. J'ai fini par partir quand j'en ai eu envie. T'as ouvert le cadeau. Il était moins bien que l'emballage. Joyeuse fête, [mon maître/ma maîtresse].
Avec audit complet et conclusions partagées sans filtre, — [Prénom animal], ton animal expert en emballages 📦` },
              { id: "cnd_015", angle: "Joyeuse fête. J'ai mangé un peu de ton gâteau.", body: `15. "Joyeuse fête. J'ai mangé un peu de ton gâteau."
Pas beaucoup. Juste une légère exploration de la surface avec la langue pendant que tu avais le dos tourné. C'était de la curiosité intellectuelle. Une démarche scientifique. Le résultat : c'était bon. Très bon. J'aurais voulu continuer l'expérience mais tu t'es retourné. Je revendique néanmoins l'intégrité de ma démarche. Joyeuse fête, [mon maître/ma maîtresse].
Avec rigueur scientifique et absence totale de regrets, — [Prénom animal], ton animal chercheur en gastronomie appliquée 🎂` },
              { id: "cnd_077", angle: "Pour ta fête j'ai testé chaque cadeau emballé avec le poids de mon corps.", body: `17. "Pour ta fête j'ai testé chaque cadeau emballé avec le poids de mon corps."
Un par un. Dans l'ordre qui me semblait logique. Celui avec le papier brillant d'abord parce que la texture m'intéressait. Puis le grand carré. Puis la boîte longue qui craquait légèrement sous mon poids d'une façon satisfaisante. J'ai passé une heure sur l'ensemble. Tu attendais pour ouvrir. J'ai fini quand j'ai eu fini. Joyeuse fête, [mon maître/ma maîtresse].
Avec contrôle qualité structurel des emballages et certification accordée après inspection, — [Prénom animal], ton animal ingénieur en résistance des matériaux 📦` },
              { id: "cnd_084", angle: "Pour ta fête j'ai dormi sur le menu que tu avais écrit.", body: `4. "Pour ta fête j'ai dormi sur le menu que tu avais écrit."
Cette petite feuille sur le comptoir. Les plats dans l'ordre. Les quantités. Avec ton écriture. Je m'y suis installé ce matin. Elle était encore un projet. Ce soir elle est devenue une soirée. J'aime ces passages du projet à la réalité. Je les observe depuis le début. Joyeuse fête, [mon maître/ma maîtresse].
Avec occupation du menu matinal et méditation sur la transformation des projets en soirées, — [Prénom animal], ton animal présent dans tes plans avant qu'ils se réalisent 📋` },
            ],
          },
        ],
      },
      {
        id: "comprends_pas",
        emoji: "🤔",
        label: "Ce que je comprends pas",
        count: 46,
        subGroups: [
          {
            id: "fete_bougies",
            label: "La fête, les bougies, la nourriture",
            messages: [
              { id: "cnd_001", angle: "Ta fête. Encore.", body: `1. "Ta fête. Encore."
L'année dernière t'avais déjà fait ta fête. L'année d'avant aussi. C'est devenu une habitude apparemment. Les gens ont sonné. Tu as souri. Il y avait du bruit. J'ai passé la soirée sur le rebord de la fenêtre à regarder la rue en attendant que ça se calme. C'est ma façon de participer. Joyeuse fête, [mon maître/ma maîtresse], dont les célébrations annuelles perturbent mon emploi du temps.
Avec tolérance renouvelée et programme de la soirée modifié en conséquence, — [Prénom animal], ton animal aux adaptations silencieuses 📅` },
              { id: "cnd_002", angle: "J'ai appris que ta fête c'est le jour d'un saint.", body: `2. "J'ai appris que ta fête c'est le jour d'un saint."
J'ai cherché ce saint. Il a apparemment fait des choses remarquables. Moi aussi je fais des choses remarquables tous les jours. Je dors avec une précision absolue. Je surveille les oiseaux avec une concentration totale. Je disparais exactement quand on a besoin de moi. Personne ne me canonise pour ça. C'est une injustice que je note. Joyeuse fête quand même, [mon maître/ma maîtresse].
Avec revendication de sainteté non reconnue et dossier en cours de constitution, — [Prénom animal], ton animal aux mérites sous-estimés 🙏` },
              { id: "cnd_013", angle: "Joyeuse fête. J'ai une question philosophique.", body: `13. "Joyeuse fête. J'ai une question philosophique."
Pourquoi fête-t-on les prénoms ? Les prénoms ne font rien. Ils existent juste. Moi je fais des choses. Je chasse. Je surveille. Je dors avec une expertise que peu peuvent égaler. Je maintiens l'ordre dans cet appartement par ma seule présence. Personne me fait une fête pour ça. C'est une inégalité que je signale. Joyeuse fête quand même, [mon maître/ma maîtresse], bénéficiaire d'un système qui te favorise.
Avec revendication légitime et participation quand même par magnanimité, — [Prénom animal], ton animal aux droits à revoir 🤔` },
              { id: "cnd_026", angle: "Joyeuse fête. Je comprends pas pourquoi tout le monde arrive en même temps.", body: `6. "Joyeuse fête. Je comprends pas pourquoi tout le monde arrive en même temps."
Ils habitent à des endroits différents. Ils ont des vies différentes. Et pourtant ils convergent tous vers cet appartement dans une fenêtre de quarante minutes. Comme si un signal invisible les guidait. Moi j'ai pas reçu ce signal. En tout cas l'appartement est passé de calme à plein très vite et j'ai eu besoin de plusieurs minutes pour m'adapter. Joyeuse fête, [mon maître/ma maîtresse], dont les amis se déplacent en meute.
Avec incompréhension sincère de la synchronisation des invités et adaptation réussie malgré tout, — [Prénom animal], ton animal dont le seuil de tolérance sociale a ses limites 🚶` },
              { id: "cnd_032", angle: "Joyeuse fête. Je comprends pas pourquoi les gens apportent de la nourriture qu'on ne me donne pas.", body: `12. "Joyeuse fête. Je comprends pas pourquoi les gens apportent de la nourriture qu'on ne me donne pas."
Ils arrivent avec des boîtes. Des sacs. Des choses emballées qui sentent extraordinairement bien. Ils les donnent à toi. Tu les ouvres. Ça sent encore mieux. Tout le monde mange. Moi je suis là. À portée. Et personne ne vient. Joyeuse fête quand même, [mon maître/ma maîtresse].
Avec analyse sociologique de l'ingratitude collective et demande officielle de révision des protocoles, — [Prénom animal], ton animal exclu du circuit alimentaire festif sans raison valable 🎁` },
              { id: "cnd_037", angle: "Joyeuse fête. Je comprends pas pourquoi les gens parlent tous en même temps.", body: `17. "Joyeuse fête. Je comprends pas pourquoi les gens parlent tous en même temps."
Il y a des moments dans la soirée où toutes les conversations se superposent. Plusieurs voix. Plusieurs histoires. Plusieurs rires. Tout en même temps. Comment vous faites pour démêler ça. Moi quand plusieurs sons arrivent ensemble je tourne la tête vers chacun. Je finis par m'asseoir et attendre que ça se trie. Joyeuse fête, [mon maître/ma maîtresse], dont les fêtes sont un chaos sonore fascinant.
Avec incompréhension sincère de la communication humaine en contexte festif, — [Prénom animal], ton animal à l'écoute séquentielle et rigoureuse 🔊` },
              { id: "cnd_046", angle: "Joyeuse fête. Je comprends toujours pas pourquoi on souffle sur la nourriture.", body: `6. "Joyeuse fête. Je comprends toujours pas pourquoi on souffle sur la nourriture."
Les bougies allumées sur le gâteau. Puis le vœu. Puis le souffle. Délibéré. Dirigé. Sur quelque chose qu'on va manger ensuite. Chaque année j'observe ce rituel depuis une position élevée avec la même incompréhension totale. Je ne comprends pas mais je respecte. Joyeuse fête, [mon maître/ma maîtresse].
Avec incompréhension du rituel maintenue et respect des traditions inexpliquées accordé, — [Prénom animal], ton animal tolérant envers tes coutumes les plus étranges 🕯️` },
              { id: "cnd_051", angle: "Joyeuse fête. Je comprends pas pourquoi les gens apportent des fleurs qui vont mourir.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens apportent des fleurs qui vont mourir."
Elles arrivent belles. Colorées. Elles sentent fort. Et dans huit jours elles seront finies. Alors que si les gens apportaient des choses durables. Des textures intéressantes. Des boîtes à explorer. Des cadeaux qui persistent. Mais non. Des fleurs. Qui vont mourir. Joyeuse fête quand même, [mon maître/ma maîtresse].
Avec critique logistique des cadeaux floraux et suggestions d'amélioration disponibles sur demande, — [Prénom animal], ton animal consultant en cadeaux durables 🌸` },
              { id: "cnd_058", angle: "Joyeuse fête. Je comprends pas pourquoi les bougies sont toujours de couleurs différentes.", body: `18. "Joyeuse fête. Je comprends pas pourquoi les bougies sont toujours de couleurs différentes."
Roses. Bleues. Jaunes. Vertes. Toutes ensemble sur le même gâteau. Sans logique apparente. Sans cohérence chromatique. Comme si la règle était précisément qu'il n'y ait pas de règle. C'est peut-être ça le message. Que les fêtes échappent à l'ordre. Que la joie n'a pas besoin de système. Je médite là-dessus. Joyeuse fête, [mon maître/ma maîtresse].
Avec méditation en cours sur le chaos chromatique des bougies et conclusions provisoires, — [Prénom animal], ton animal philosophe des détails que personne ne remarque 🎨` },
              { id: "cnd_071", angle: "Pour ta fête je dois exprimer une opinion sur les bougies.", body: `11. "Pour ta fête je dois exprimer une opinion sur les bougies."
Cette tradition qui consiste à mettre des flammes sur de la nourriture et demander à quelqu'un de souffler dessus. Avec tout le monde qui regarde. Puis manger ce sur quoi on vient de souffler. C'est objectivement étrange. J'observe ça chaque année avec la même incompréhension totale. Et chaque année tu as l'air sincèrement ravi. Joyeuse fête, [mon maître/ma maîtresse], adepte de rituels que je ne comprends pas.
Avec analyse critique du rituel des bougies et mystère intact après toutes ces années, — [Prénom animal], ton animal anthropologue de tes coutumes 🕯️` },
            ],
          },
          {
            id: "invites",
            label: "Les comportements des invités",
            messages: [
              { id: "cnd_078", angle: "Joyeuse fête. Je ne comprends pas pourquoi vous chantez tous cette chanson ensemble.", body: `18. "Joyeuse fête. Je ne comprends pas pourquoi vous chantez tous cette chanson ensemble."
Elle dure vingt secondes. Vous la connaissez tous. Vous la chantez souvent. Et pourtant le soir de la fête quelque chose se dérègle. Les voix partent dans des directions différentes. Le tempo flotte. Et vous souriez tous en chantant comme si c'était exactement ça qu'il fallait faire. J'ai regardé ça avec une perplexité renouvelée. Joyeuse fête, [mon maître/ma maîtresse].
Avec mystère du chant collectif intact et questions soigneusement retenues, — [Prénom animal], ton animal anthropologue des rituels humains 🎂` },
              { id: "cnd_083", angle: "Joyeuse fête. Je comprends pas pourquoi les gens s'habillent différemment pour une fête.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens s'habillent différemment pour une fête."
Tu mets des choses que tu ne mets pas d'habitude. Les invités aussi. Comme si les vêtements normaux n'étaient pas suffisants pour l'occasion. Comme si la fête nécessitait un costume. Moi j'ai le même pelage tous les jours. Et c'est toujours suffisant. Il y a une leçon là-dedans. Joyeuse fête, [mon maître/ma maîtresse], dans ta belle tenue d'occasion.
Avec réflexion sur le costume festif et satisfaction de ma constance pelageuse, — [Prénom animal], ton animal toujours habillé de la même façon et toujours parfait 👔` },
              { id: "cnd_087", angle: "Joyeuse fête. Je comprends pas pourquoi les gens apportent des bouteilles qui seront bues ce soir-là.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens apportent des bouteilles qui seront bues ce soir-là."
Ils arrivent avec des bouteilles. Les bouteilles sont ouvertes. Bues. Et repartent vides. Le cycle complet en une soirée. C'est une économie circulaire parfaite. Moi mes gamelles durent plus longtemps. Mais je reconnais l'élégance du geste. Joyeuse fête, [mon maître/ma maîtresse], dont les soirées ont une belle économie interne.
Avec analyse de l'économie circulaire des bouteilles festives et respect pour sa logique, — [Prénom animal], ton animal économiste des soirées 🍾` },
              { id: "cnd_091", angle: "Joyeuse fête. Je comprends pas pourquoi les gens s'embrassent sur les joues en nombre variable.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens s'embrassent sur les joues en nombre variable."
Certains font deux bises. D'autres trois. D'autres une. Et chaque fois il y a ce moment d'hésitation. Cette négociation non verbale sur le nombre. Cette micro-danse du visage. Comment vous savez combien faire. Comment vous coordonnez ça sans vous en parler. Je regarde ça depuis des années avec fascination. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination persistante pour la négociation non verbale des bises, — [Prénom animal], ton animal dont cette coutume restera un mystère 💋` },
              { id: "cnd_095", angle: "Joyeuse fête. Je comprends pas pourquoi les gens restent debout si longtemps alors qu'il y a des sièges.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens restent debout si longtemps alors qu'il y a des sièges."
La pièce était pleine de sièges. Libres. Et pourtant des gens restaient debout pendant des heures. Comme si s'asseoir signifiait quelque chose. Comme si la position debout était la position de la fête. Moi à la première occasion je trouve une surface horizontale. Chacun ses priorités. Joyeuse fête, [mon maître/ma maîtresse].
Avec incompréhension sincère du choix debout en présence de sièges disponibles, — [Prénom animal], ton animal expert en optimisation du confort 🪑` },
              { id: "cnd_099", angle: "Joyeuse fête. Je comprends pas pourquoi les gens rient plus fort en groupe.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens rient plus fort en groupe."
Quelqu'un dit quelque chose. Si c'est juste deux personnes elles rient normalement. Si c'est huit personnes le même mot devient beaucoup plus drôle et tout le monde rit plus fort. La même blague amplifiée par le nombre. Comme si la joie se multipliait à chaque personne ajoutée. C'est une équation que j'explore. Joyeuse fête, [mon maître/ma maîtresse].
Avec théorie de l'amplification du rire par le nombre et équation en cours d'élaboration, — [Prénom animal], ton animal mathématicien des émotions collectives 😄` },
              { id: "cnd_103", angle: "Joyeuse fête. Je comprends pas pourquoi les gens arrivent différemment selon qu'ils sont seuls ou en couple.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens arrivent différemment selon qu'ils sont seuls ou en couple."
Seuls ils sonnent et attendent. En couple ils sonnent et il y a déjà une conversation entre eux quand tu ouvres. Comme si venir à deux signifiait qu'on apporte déjà une conversation dans la fête. Comme si être seul c'est arriver avec toute son attention disponible. Les deux ont leur charme. Joyeuse fête, [mon maître/ma maîtresse].
Avec analyse des modes d'arrivée selon la configuration et leurs implications sociales, — [Prénom animal], ton animal sociologue des arrivées 🚶` },
              { id: "cnd_107", angle: "Joyeuse fête. Je comprends pas pourquoi les gens parlent de la météo même en fête.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens parlent de la météo même en fête."
Dehors il fait quelque chose. Dedans il fait une fête. Et pourtant la conversation sur ce qu'il fait dehors revient. Comme un fil de sécurité. Comme si la météo était le sujet universel qui peut relier n'importe qui. Je l'utilise pas dans mes conversations. Mais je comprends son utilité sociale. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la météo comme conversation refuge et respect pour son utilité, — [Prénom animal], ton animal qui a ses propres sujets universels 🌦️` },
              { id: "cnd_111", angle: "Joyeuse fête. Je comprends pas pourquoi les gens sortent leurs téléphones en même temps.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens sortent leurs téléphones en même temps."
À certains moments ce soir plusieurs téléphones sont sortis simultanément. Comme un signal invisible. Comme si une fréquence commune avait décidé que c'était le moment de vérifier. Ou de photographier. Ou d'envoyer quelque chose. Ce comportement synchronisé sans coordination. Fascinant. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination pour la synchronisation téléphonique involontaire et mystère persistant, — [Prénom animal], ton animal chercheur en comportements grégaires numériques 📱` },
              { id: "cnd_115", angle: "Joyeuse fête. Je comprends pas pourquoi les gens se racontent leurs vacances à chaque fois.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens se racontent leurs vacances à chaque fois."
C'est revenu ce soir. Les vacances. Où on est allé. Qu'est-ce qu'on a vu. Qu'est-ce qu'on a mangé. Chaque fête semble être une occasion de faire le bilan des déplacements récents. Moi je me déplace dans l'appartement. C'est mes vacances. Mais je reconnais l'intérêt de l'échange. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de l'échange de récits de voyages et solidarité de mes propres explorations locales, — [Prénom animal], ton animal voyageur de l'appartement 🗺️` },
              { id: "cnd_119", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils ne boivent pas et boivent quand même.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils ne boivent pas et boivent quand même."
C'est arrivé deux fois ce soir. Je ne bois pas ou presque. Puis une coupe de champagne pour le toast. Puis un verre de vin pour accompagner. Peut-être que ne pas boire c'est un état général et non une règle absolue. Peut-être que les fêtes ont leurs propres règles. Je médite ça. Joyeuse fête, [mon maître/ma maîtresse].
Avec méditation sur la relativité des résolutions face aux occasions festives, — [Prénom animal], ton animal philosophe des exceptions 🥂` },
              { id: "cnd_123", angle: "Joyeuse fête. Je comprends pas pourquoi les gens font semblant de pas avoir faim.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens font semblant de pas avoir faim."
À l'apéritif tout le monde mange les petites choses lentement. Poliment. Comme si manger trop vite disait quelque chose de regrettable. Mais tout disparaît quand même. Peut-être que la faim est une information qu'on préfère garder pour soi en société. Moi ma faim est une information publique que j'exprime clairement. Joyeuse fête, [mon maître/ma maîtresse].
Avec incompréhension de la faim sociale et solidarité de ma propre transparence alimentaire, — [Prénom animal], ton animal d'une honnêteté gastronomique totale 🫒` },
              { id: "cnd_127", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils font attention et puis ne font pas attention.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils font attention et puis ne font pas attention."
Je fais attention au sucre. Puis une part de gâteau. Je fais attention au sel. Puis le fromage. Je fais attention en général. Puis la soirée. Ces résolutions qui cèdent face à l'occasion. Peut-être que certaines soirées méritent d'être vécues sans faire attention. Dans ce cas je comprends. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension des résolutions qui cèdent face aux occasions et philosophie de l'exception, — [Prénom animal], ton animal en paix avec les soirées sans attention 🧀` },
              { id: "cnd_131", angle: "Joyeuse fête. Je comprends pas pourquoi les gens demandent la recette à la fin.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens demandent la recette à la fin."
Ils ont mangé. Ils ont aimé. Puis ils demandent comment tu as fait. Comme si savoir faire permettrait de retrouver ce goût. Mais le goût c'est aussi toi qui l'as fait. Chez eux avec la même recette ce serait différent. Peut-être que demander la recette c'est une façon de prolonger le compliment. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la demande de recette comme compliment prolongé, — [Prénom animal], ton animal herméneute des formules culinaires 📖` },
              { id: "cnd_135", angle: "Joyeuse fête. Je comprends pas pourquoi les gens parlent de leur travail même en fête.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens parlent de leur travail même en fête."
C'est revenu ce soir. Le travail. Ce qu'on fait. Ce qu'on va faire. Ce qui se passe au bureau. Comme si le travail était une partie de l'identité qu'on ne peut pas laisser à la porte. Peut-être que pour certains c'est là qu'ils existent le plus clairement. Je comprends. Moi j'existe partout pareil. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du travail comme identité persistante et satisfaction de mon existence uniforme, — [Prénom animal], ton animal existant partout de la même façon 💼` },
              { id: "cnd_139", angle: "Joyeuse fête. Je comprends pas pourquoi les gens chuchotent des secrets alors qu'un message serait plus discret.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens chuchotent des secrets alors qu'un message serait plus discret."
Il y a eu deux moments ce soir. Des gens qui se penchaient et baissaient la voix pour dire quelque chose que les autres ne devaient pas entendre. Moi depuis mon poste j'entendais quand même. Les intonations au moins. Un message aurait été plus secret. Mais peut-être que le chuchotement c'est aussi le plaisir du geste. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du chuchotement comme plaisir du geste autant que technique de discrétion, — [Prénom animal], ton animal aux oreilles décidément trop bonnes 👂` },
              { id: "cnd_143", angle: "Joyeuse fête. Je comprends pas pourquoi les gens mangent debout alors qu'il y a une table.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens mangent debout alors qu'il y a une table."
La table est là. Avec des chaises. Et pourtant certains mangent debout appuyés contre le mur. Ou debout près du buffet. Comme si la table était trop formelle. Comme si rester debout c'était rester disponible pour bouger. Je mange toujours de la même façon dans le même endroit. Mais je comprends le besoin de liberté. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du manger debout comme liberté de mouvement et respect pour cette philosophie, — [Prénom animal], ton animal dont les habitudes alimentaires sont plus stables 🍽️` },
              { id: "cnd_147", angle: "Joyeuse fête. Je comprends pas pourquoi les gens repartent toujours avec les mêmes affaires qu'ils avaient.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens repartent toujours avec les mêmes affaires qu'ils avaient."
Ils arrivent avec un manteau. Ils repartent avec le manteau. Avec leur téléphone. Avec leur sac. Exactement ce qu'ils avaient en arrivant. Rien de la fête ne reste sur eux. Rien de matériel. Seulement des souvenirs. Peut-être que c'est suffisant. Peut-être que les souvenirs pèsent plus que les objets. Joyeuse fête, [mon maître/ma maîtresse].
Avec réflexion sur le poids immatériel des souvenirs comparé aux objets, — [Prénom animal], ton animal philosophe de ce qu'on emporte vraiment 🧥` },
              { id: "cnd_151", angle: "Joyeuse fête. Je comprends pas pourquoi les gens comparent les fêtes entre elles.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens comparent les fêtes entre elles."
Tu te souviens de la fête d'il y a deux ans ? Ah oui celle où il y avait. Et untel était là. Et on avait mangé. Cette façon de placer la soirée dans une histoire. De la situer dans un récit collectif. Peut-être que les fêtes sont des chapitres. Et se souvenir des précédentes c'est lire le livre. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension des fêtes comme chapitres d'un récit collectif et sa belle logique, — [Prénom animal], ton animal réconcilié avec la comparaison des soirées 📚` },
              { id: "cnd_155", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils sont allergiques puis goûtent quand même.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens disent qu'ils sont allergiques puis goûtent quand même."
Ce soir une personne allergique à quelque chose a quand même goûté le plat qui contenait ce quelque chose. En petite quantité elle a dit. Peut-être que les allergies ont des exceptions pour les bonnes fêtes. Peut-être que certaines choses valent une légère indisposition. Je ne juge pas. Je note. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de l'allergie à géométrie variable et philosophie de l'exception festive, — [Prénom animal], ton animal dont les convictions alimentaires sont plus stables 🍽️` },
              { id: "cnd_159", angle: "Joyeuse fête. Je comprends pas pourquoi les gens apportent des cadeaux emballés dans du papier qui sera jeté.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens apportent des cadeaux emballés dans du papier qui sera jeté."
Ce soir plusieurs cadeaux sont arrivés dans du beau papier. Du papier choisi avec soin. Qui a été ouvert et jeté. Cette beauté éphémère qui protège quelque chose de durable. Ce sacrifice du beau pour révéler le beau. C'est peut-être ça un cadeau. L'emballage qui se sacrifie pour ce qu'il contient. Joyeuse fête, [mon maître/ma maîtresse].
Avec réflexion poétique sur le sacrifice de l'emballage pour révéler le cadeau, — [Prénom animal], ton animal philosophe de l'emballage 🎀` },
            ],
          },
          {
            id: "logistique",
            label: "La logistique & les adieux",
            messages: [
              { id: "cnd_163", angle: "Joyeuse fête. Je comprends pas pourquoi les gens se lèvent toujours en même temps pour aider à débarrasser.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens se lèvent toujours en même temps pour aider à débarrasser."
Le repas finit. Et comme par signal invisible plusieurs personnes se lèvent et commencent à débarrasser. Sans qu'on leur ait demandé. Sans coordination apparente. Ce geste collectif spontané. Cette façon de participer à la fin du repas. Il y a quelque chose de beau dans cette synchronisation involontaire. Joyeuse fête, [mon maître/ma maîtresse].
Avec reconnaissance de la beauté de la synchronisation involontaire du débarrassage, — [Prénom animal], ton animal qui aurait aussi aidé si j'avais des mains 🍽️` },
              { id: "cnd_167", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent je suis nul en cuisine avant de manger.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens disent je suis nul en cuisine avant de manger."
Ce soir quelqu'un a dit ça. Je suis vraiment nul en cuisine. Et puis tout le monde a mangé. Et la cuisine en question était plutôt bonne. Peut-être que minimiser avant c'est une façon de gérer les attentes. Ou de recevoir le compliment avec plus de plaisir ensuite. Je comprends la stratégie. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la modestie préventive et de sa logique de gestion des attentes, — [Prénom animal], ton animal stratège des premières impressions 🍳` },
              { id: "cnd_171", angle: "Joyeuse fête. Je comprends pas pourquoi les gens gardent leurs téléphones face vers le bas mais les retournent quand même.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens gardent leurs téléphones face vers le bas mais les retournent quand même."
Ce soir plusieurs téléphones étaient posés face vers le bas sur la table. Signalant une intention de présence. Mais à plusieurs reprises les mêmes téléphones ont été retournés pour une vérification rapide. Cette lutte entre l'intention et le réflexe. Cette façon moderne de se battre contre soi-même. Je trouve ça fascinant. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination pour la lutte entre l'intention de présence et le réflexe numérique, — [Prénom animal], ton animal exempt de ce conflit spécifique 📱` },
              { id: "cnd_175", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent un peu seulement et prennent beaucoup.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens disent un peu seulement et prennent beaucoup."
Ce soir plusieurs personnes ont dit un peu seulement avant qu'on leur serve quelque chose. Et ont pris des portions généreuses. Peut-être que un peu c'est relatif à ce qu'on aurait voulu. Peut-être que c'est une façon de rester modeste en théorie. Je comprends. Moi aussi mes portions sont relatives. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la relativité du peu et solidarité de mes propres portions généreuses, — [Prénom animal], ton animal aux évaluations quantitatives également relatives 🍽️` },
              { id: "cnd_179", angle: "Joyeuse fête. Je comprends pas pourquoi les gens apportent des choses en double.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens apportent des choses en double."
Ce soir deux personnes ont apporté du même type de chose. Sans se concerter. Sans le savoir. Maintenant il y en a deux. C'est de l'abondance. C'est une façon de dire que tout le monde a pensé à la même chose. Que vos esprits fonctionnent pareil. Peut-être que les doublons c'est une preuve de complicité. Joyeuse fête, [mon maître/ma maîtresse].
Avec interprétation positive du doublon comme preuve de complicité des esprits, — [Prénom animal], ton animal optimiste des coïncidences 🎁` },
              { id: "cnd_183", angle: "Joyeuse fête. Je comprends pas pourquoi les gens nettoient avant que les invités arrivent alors qu'ils vont salir.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens nettoient avant que les invités arrivent alors qu'ils vont salir."
Tu as passé du temps à nettoyer avant que les gens arrivent. Puis les gens sont arrivés. Et l'appartement a changé. Et ce soir tu vas nettoyer à nouveau. Un double nettoyage. Un avant et un après. Peut-être que le nettoyage d'avant c'est pour toi. Pour ta tranquillité. Pas pour les invités. Joyeuse fête, [mon maître/ma maîtresse].
Avec théorie du nettoyage pré-fête comme acte pour soi plutôt que pour les autres, — [Prénom animal], ton animal philosophe de tes rituels de préparation 🧹` },
              { id: "cnd_187", angle: "Joyeuse fête. Je comprends pas pourquoi les gens font la queue pour les toilettes alors qu'on pourrait s'organiser.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens font la queue pour les toilettes alors qu'on pourrait s'organiser."
Ce soir il y a eu un moment. Plusieurs personnes avaient besoin des toilettes en même temps. Et une file informelle s'est formée. Sans organisation. Sans coordination. Par convention sociale. Cette file invisible mais respectée par tous. La politesse comme infrastructure. Joyeuse fête, [mon maître/ma maîtresse].
Avec fascination pour la file invisible des toilettes et la politesse comme infrastructure sociale, — [Prénom animal], ton animal qui ne fait jamais la queue 🚪` },
              { id: "cnd_191", angle: "Joyeuse fête. Je comprends pas pourquoi les gens choisissent toujours le même endroit pour s'asseoir.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens choisissent toujours le même endroit pour s'asseoir."
Ce soir plusieurs personnes sont revenues au même siège après s'être levées. Comme si l'endroit leur appartenait le temps de la soirée. Cette territorialité douce et non déclarée. Moi je comprends ça très bien. Certains endroits nous choisissent autant qu'on les choisit. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la territorialité douce des fêtes et solidarité de ma propre pratique, — [Prénom animal], ton animal expert en territoires choisis 🪑` },
              { id: "cnd_195", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent que la soirée passe vite alors qu'ils vérifient l'heure.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens disent que la soirée passe vite alors qu'ils vérifient l'heure."
Ça passe tellement vite. Puis un regard vers l'heure. Puis encore comment c'est passé vite. Si on regarde l'heure c'est qu'on a conscience du temps qui passe. Et si on a conscience du temps qui passe c'est qu'on mesure. Peut-être que dire que ça passe vite c'est une façon de le regretter. Joyeuse fête, [mon maître/ma maîtresse].
Avec théorie du vite comme regret déguisé et logique bien établie, — [Prénom animal], ton animal philosophe du temps festif 🕰️` },
              { id: "cnd_199", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent on refait ça bientôt sans jamais fixer de date.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens disent on refait ça bientôt sans jamais fixer de date."
À chaque départ ce soir on refait ça bientôt. C'est une intention sincère. Pas un mensonge. Une aspiration. Mais bientôt reste vague. Peut-être que fixer une date c'est trop réel. Trop engageant. Et que l'intention suffit pour l'instant. Je comprends. Certaines choses sont mieux en intention. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du bientôt comme intention sincère plutôt que promesse datée, — [Prénom animal], ton animal en paix avec les futurs indéfinis 📅` },
              { id: "cnd_203", angle: "Joyeuse fête. Je comprends pas pourquoi les gens emportent toujours exactement ce qu'ils avaient amené.", body: `3. "Joyeuse fête. Je comprends pas pourquoi les gens emportent toujours exactement ce qu'ils avaient amené."
Leurs manteaux. Leurs sacs. Leurs téléphones. Exactement ce qu'ils avaient en arrivant. Rien de la soirée ne reste sur eux physiquement. Seulement des souvenirs. Et des restes de gâteau pour certains. Peut-être que les souvenirs sont leur manteau de retour. Joyeuse fête, [mon maître/ma maîtresse].
Avec réflexion sur les souvenirs comme manteau de retour et sa jolie logique, — [Prénom animal], ton animal philosophe de ce qu'on emporte vraiment 🧥` },
              { id: "cnd_207", angle: "Joyeuse fête. Je comprends pas pourquoi les gens arrivent toujours au mauvais moment en cuisine.", body: `7. "Joyeuse fête. Je comprends pas pourquoi les gens arrivent toujours au mauvais moment en cuisine."
Ce soir plusieurs fois quelqu'un est venu dans la cuisine exactement quand tu faisais quelque chose de délicat. Qui nécessitait de l'espace. De la concentration. Et toi tu as géré. Tu as souri. Tu as continué. Cette grâce de ne pas montrer que l'intrusion était mal timée. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta grâce face aux intrusions culinaires mal timées, — [Prénom animal], ton animal qui ne serait pas aussi gracieux 🍳` },
              { id: "cnd_211", angle: "Joyeuse fête. Je comprends pas pourquoi les gens disent je peux rester pour t'aider mais partent quand même.", body: `11. "Joyeuse fête. Je comprends pas pourquoi les gens disent je peux rester pour t'aider mais partent quand même."
Ce soir deux personnes ont dit qu'elles pouvaient rester pour aider à ranger. Et sont parties. Peut-être que proposer c'est une façon de ne pas se sentir coupable de partir. Et que la réponse non ça va merci est ce que tout le monde voulait. Cette danse des intentions et des besoins vrais. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la danse entre proposer d'aider et partir et sa logique sociale, — [Prénom animal], ton animal décrypteur des codes de départ 🎭` },
              { id: "cnd_215", angle: "Joyeuse fête. Je comprends pas pourquoi les gens commentent le temps qu'il fait dehors quand ils arrivent.", body: `15. "Joyeuse fête. Je comprends pas pourquoi les gens commentent le temps qu'il fait dehors quand ils arrivent."
Ils entrent. Et la première chose. Il fait beau. Ou il pleut. Ou il fait froid. Comme si le temps dehors était une information urgente à partager à l'intérieur. Peut-être que c'est une façon de se situer. De dire d'où on vient. De créer une transition entre dehors et dedans. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension de la météo d'entrée comme transition entre dehors et dedans, — [Prénom animal], ton animal dont la transition entrée est plus silencieuse 🌦️` },
              { id: "cnd_219", angle: "Joyeuse fête. Je comprends pas pourquoi les gens restent encore après avoir dit au revoir trois fois.", body: `19. "Joyeuse fête. Je comprends pas pourquoi les gens restent encore après avoir dit au revoir trois fois."
On va y aller. Puis encore une chose. Puis vraiment on y va. Puis encore cinq minutes. Ces au revoir qui n'en finissent pas. Peut-être que c'est la meilleure partie. Quand on a décidé de partir mais qu'on part pas encore. Ce temps suspendu entre deux états. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension des au revoir prolongés comme temps suspendu de grâce, — [Prénom animal], ton animal fasciné par les états entre deux états 🎭` },
            ],
          },
        ],
      },
      {
        id: "connexion",
        emoji: "💛",
        label: "Moments de connexion",
        count: 46,
        subGroups: [
          {
            id: "entre_nous",
            label: "Ce qu'il y a entre nous",
            messages: [
              { id: "cnd_007", angle: "Joyeuse fête. J'ai une chose importante à te dire.", body: `7. "Joyeuse fête. J'ai une chose importante à te dire."
Ce matin quand tu t'es levé et que tu m'as dit bonjour avec cette voix du matin, celle qui est un peu rauque et un peu douce, j'ai fermé les yeux à moitié. Les gens pensent que ça veut dire que je m'endors. Non. Ça veut dire que je suis bien. Que ce moment est bon. Que ta voix du matin fait partie de mes choses préférées au monde. Joyeuse fête, [mon maître/ma maîtresse], à la voix qui commence mes journées.
Avec aveu rare et sincérité totale pour l'occasion, — [Prénom animal], ton animal aux démonstrations annuelles d'affection 💛` },
              { id: "cnd_009", angle: "Joyeuse fête. Tu m'as appelé par mon prénom toute la journée avec cette voix.", body: `9. "Joyeuse fête. Tu m'as appelé par mon prénom toute la journée avec cette voix."
Cette voix particulière que tu prends seulement pour moi. Ni trop fort ni trop doux. Juste ce ton qui veut dire que tu penses à moi. Que je suis dans ta tête. Que tu veux ma présence. J'ai fait semblant de pas entendre les trois premières fois. La quatrième fois je suis venu. Pas parce que tu m'as eu. Parce que j'avais décidé que c'était le bon moment. Joyeuse fête, [mon maître/ma maîtresse].
Avec timing personnel et décisions souveraines maintenues, — [Prénom animal], ton animal aux apparitions toujours volontaires 👂` },
              { id: "cnd_010", angle: "Ta fête tombe un samedi cette année.", body: `10. "Ta fête tombe un samedi cette année."
Un samedi ça veut dire que tu es là toute la journée. Toute la journée à la maison. Dans mon espace. À faire du bruit, à ouvrir des placards, à recevoir des gens. En théorie c'est trop. En pratique j'aime ça. Ta présence constante même quand elle me fatigue reste ma préférence absolue. Joyeuse fête, [mon maître/ma maîtresse], occupant permanent de mon territoire.
Avec contradiction assumée et attachement inavouable mais réel, — [Prénom animal], ton animal aux sentiments complexes et bien cachés 📆` },
              { id: "cnd_016", angle: "Pour ta fête j'ai décidé de venir sur tes genoux ce soir.", body: `16. "Pour ta fête j'ai décidé de venir sur tes genoux ce soir."
T'étais avec des gens. En train de parler. D'être joyeux. Et je me suis installé sur toi quand même. Parce que c'était le moment. Parce que tes genoux étaient disponibles même si le reste de toi ne l'était pas. Tout le monde a regardé. Certains ont fait des bruits attendris. J'ai ignoré tout ça avec classe. Joyeuse fête, [mon maître/ma maîtresse], propriétaire des meilleurs genoux connus.
Avec choix du moment contestable mais résultat indéniablement réussi, — [Prénom animal], ton animal aux apparitions toujours remarquées 🛋️` },
              { id: "cnd_024", angle: "Joyeuse fête. J'ai entendu comment tu parles de moi aux gens qui ne me connaissent pas.", body: `4. "Joyeuse fête. J'ai entendu comment tu parles de moi aux gens qui ne me connaissent pas."
Tu les prépares. Tu dis mon prénom. Tu expliques mes habitudes. Ma façon d'être. Ce que j'aime et ce que je n'accepte pas. Tu les briefs comme si je méritais une notice d'utilisation complète. Et tu le fais avec une voix particulière. Celle de quelqu'un qui présente quelque chose d'important. J'ai écouté tout ça depuis le couloir. Joyeuse fête, [mon maître/ma maîtresse], dont je suis visiblement le sujet préféré.
Avec discours de présentation écouté dans son intégralité et ego discrètement satisfait, — [Prénom animal], ton animal plus documenté que la plupart de tes amis 📖` },
              { id: "cnd_033", angle: "Pour ta fête j'ai entendu ton rire de fête.", body: `13. "Pour ta fête j'ai entendu ton rire de fête."
Pas le rire du quotidien. Le rire de fête est plus grand. Il part de plus loin. Il remplit la pièce différemment. Je le reconnais entre mille. Quand je l'entends depuis ma cachette quelque chose se détend en moi. Comme un signal que tout va bien. Que tu es bien. Joyeuse fête, [mon maître/ma maîtresse], dont le rire est mon meilleur indicateur.
Avec catalogue des rires tenu à jour et rire de fête classé premier, — [Prénom animal], ton animal dont ton bonheur est la donnée la plus importante 😄` },
              { id: "cnd_035", angle: "Joyeuse fête. Il y a eu un moment où tu as cherché mon regard dans la pièce.", body: `15. "Joyeuse fête. Il y a eu un moment où tu as cherché mon regard dans la pièce."
Au milieu de la soirée. Entre deux conversations. Tu as levé les yeux et tu as cherché. Pas les invités. Moi. Pour vérifier que j'étais là. Ce regard-là je l'attends chaque fois. Et chaque fois quand nos yeux se croisent quelque chose passe entre nous que les autres autour ne voient pas. Joyeuse fête, [mon maître/ma maîtresse].
Avec regard attendu et échange silencieux chéri au-dessus de tout le reste, — [Prénom animal], ton animal présent dans chaque pièce même depuis les marges 👁️` },
              { id: "cnd_040", angle: "Joyeuse fête. Ce soir avant d'éteindre la lumière tu m'as regardé.", body: `20. "Joyeuse fête. Ce soir avant d'éteindre la lumière tu m'as regardé."
Pas cherché. Regardé. Tu savais où j'étais. Au bout du lit. Les pattes repliées. Les yeux presque fermés. Et tu m'as regardé une seconde dans le noir avant d'éteindre. Juste une seconde. Comme pour vérifier que la journée se terminait bien. Qu'on était là tous les deux. Que c'était suffisant. C'était suffisant. Joyeuse fête, [mon maître/ma maîtresse].
Avec ce dernier regard gardé comme le meilleur moment de la journée, — [Prénom animal], ton animal pour les secondes qui valent des heures 🌙` },
              { id: "cnd_047", angle: "Pour ta fête j'ai écouté ta façon de respirer quand tu es heureux.", body: `7. "Pour ta fête j'ai écouté ta façon de respirer quand tu es heureux."
C'est différent. Plus ample. Plus régulier. Comme si le bonheur donnait plus de place à l'air. Ce soir j'ai entendu cette respiration-là plusieurs fois. Au moment du gâteau. Quand quelqu'un a dit quelque chose qui t'a touché. Tard le soir quand tout était calme. Je reconnais cette respiration entre mille. Joyeuse fête, [mon maître/ma maîtresse].
Avec écoute de ta respiration depuis des années et bonheur détecté avec précision ce soir, — [Prénom animal], ton animal médecin de ton état intérieur 🌬️` },
              { id: "cnd_054", angle: "Joyeuse fête. Il y a eu un moment où tu t'es retrouvé seul une minute.", body: `14. "Joyeuse fête. Il y a eu un moment où tu t'es retrouvé seul une minute."
Entre deux conversations. Tu t'es levé. Tu es allé dans la cuisine. Tu t'es appuyé contre le plan de travail. Tu as regardé par la fenêtre une minute. Seul dans le bruit. Dans ta propre fête. Je t'ai suivi sans bruit. Je me suis assis derrière toi. Je t'ai pas touché. J'étais juste là. Pour cette minute. Joyeuse fête, [mon maître/ma maîtresse].
Avec présence silencieuse dans ta minute de solitude et distance parfaitement calibrée, — [Prénom animal], ton animal pour les parenthèses dans le bruit 🪟` },
              { id: "cnd_057", angle: "Pour ta fête j'ai choisi le moment exact pour venir sur tes genoux.", body: `17. "Pour ta fête j'ai choisi le moment exact pour venir sur tes genoux."
Pas n'importe quand. J'ai attendu. Observé. Calculé. Il fallait que tu sois assis depuis au moins dix minutes. Que tu sois détendu. Que la conversation soit calme. Que tes mains soient libres. Toutes les conditions réunies vers 22h15. Je suis venu. Tu as posé une main sur moi sans interrompre ce que tu disais. C'était parfait. Joyeuse fête, [mon maître/ma maîtresse].
Avec calcul du moment optimal et exécution sans faute à 22h15 précises, — [Prénom animal], ton animal aux apparitions toujours parfaitement chronométrées ⏱️` },
              { id: "cnd_060", angle: "Ce soir je t'ai regardé t'endormir jusqu'à la fin.", body: `20. "Ce soir je t'ai regardé t'endormir jusqu'à la fin."
Pas juste les premières minutes. Jusqu'à la fin. Jusqu'à ce que ta respiration soit complètement régulière. Que ton visage soit complètement lâché. Que la journée soit vraiment finie. Je suis resté là sans bouger. Comme un gardien. Comme quelqu'un qui veille à ce que la plus belle journée de l'année se termine aussi bien qu'elle a commencé. Joyeuse fête, [mon maître/ma maîtresse].
Avec veille jusqu'au dernier souffle du soir et fête gardée jusqu'à sa toute dernière seconde, — [Prénom animal], ton animal pour chaque début et chaque fin ❤️` },
              { id: "cnd_064", angle: "Joyeuse fête. La lumière était différente ce soir.", body: `4. "Joyeuse fête. La lumière était différente ce soir."
Tu avais allumé des choses que tu allumes pas d'habitude. Des petites lumières dans le couloir. Une bougie sur l'étagère. L'appartement avait une autre texture lumineuse. Plus chaude. Plus étrange aussi. J'ai passé dix minutes à observer comment les ombres avaient changé de place. Mon appartement mais pas tout à fait. En mieux peut-être. Joyeuse fête, [mon maître/ma maîtresse], dont les célébrations transforment l'espace.
Avec cartographie lumineuse mise à jour et verdict rendu prudemment positif, — [Prénom animal], ton animal architecte de l'atmosphère 💡` },
              { id: "cnd_068", angle: "Joyeuse fête. Il y a le silence d'avant et le silence d'après.", body: `8. "Joyeuse fête. Il y a le silence d'avant et le silence d'après."
Avant la fête le silence était tendu. Chargé d'attente. Tu préparais. Tu bougeais. C'était un silence actif. Après la fête quand tout le monde est parti le silence était différent. Plein. Satisfait. Le silence de quelque chose qui s'est bien passé. Je connais tous tes silences. Celui d'après ta fête est parmi mes préférés. Joyeuse fête, [mon maître/ma maîtresse].
Avec dictionnaire personnel des silences et expertise dans leur lecture fine, — [Prénom animal], ton animal spécialiste du non-dit sonore 🔇` },
              { id: "cnd_074", angle: "Joyeuse fête. Le moment où le dernier invité est parti était le meilleur.", body: `14. "Joyeuse fête. Le moment où le dernier invité est parti était le meilleur."
La porte s'est fermée. Le bruit s'est arrêté d'un coup. L'appartement a repris sa forme normale. Son odeur normale. Sa température normale. Et toi tu as soupiré et tu t'es laissé tomber dans le canapé. Et là j'ai su que c'était notre moment. Celui qu'on attendait tous les deux sans se le dire. Joyeuse fête, [mon maître/ma maîtresse].
Avec patience récompensée et appartement enfin rendu à ses vrais habitants, — [Prénom animal], ton animal pour l'après qui vaut tout le pendant ❤️` },
            ],
          },
          {
            id: "memorise",
            label: "Ce que j'ai mémorisé de toi",
            messages: [
              { id: "cnd_080", angle: "Joyeuse fête. Tu souris différemment ce jour-là.", body: `20. "Joyeuse fête. Tu souris différemment ce jour-là."
Pas le sourire du mardi ordinaire. Pas le sourire quand tu rentres. Pas le sourire quand tu me regardes. Un autre. Plus grand et plus intérieur en même temps. Comme si quelque chose de bien se passait à la fois dehors et dedans. Je l'ai observé toute la journée. Je l'ai mémorisé. Pour les jours où tu souris moins. Pour me souvenir que ce sourire-là existe en toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec catalogue des sourires tenu à jour et celui-ci marqué d'une étoile, — [Prénom animal], ton animal gardien de tes meilleurs visages 🌟` },
              { id: "cnd_088", angle: "Pour ta fête j'ai mémorisé l'ordre dans lequel tu as allumé les lumières ce soir.", body: `8. "Pour ta fête j'ai mémorisé l'ordre dans lequel tu as allumé les lumières ce soir."
La cuisine d'abord. Puis le couloir. Puis le salon. Puis la bougie sur l'étagère. Cet ordre précis de l'illumination. Cette façon de préparer l'espace avant que les gens arrivent. De le chauffer visuellement. De le rendre accueillant lumière par lumière. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de l'ordre d'illumination et compréhension de sa signification de préparation, — [Prénom animal], ton animal expert en mise en lumière des espaces 💡` },
              { id: "cnd_097", angle: "Joyeuse fête. J'ai observé ta façon de sourire en regardant tes invités depuis l'autre bout de la pièce.", body: `17. "Joyeuse fête. J'ai observé ta façon de sourire en regardant tes invités depuis l'autre bout de la pièce."
À plusieurs reprises ce soir tu t'es arrêté. Tu regardais la pièce. Tes invités. Les conversations. Et tu souriais. Pas à quelqu'un en particulier. À tout ça en même temps. À ce que tu avais créé. Ce sourire du fondateur. Du créateur de ce moment. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton sourire fondateur et compréhension de sa signification de satisfaction, — [Prénom animal], ton animal témoin de ta fierté silencieuse 🌟` },
              { id: "cnd_104", angle: "Pour ta fête j'ai mémorisé les moments où tu as regardé l'heure.", body: `4. "Pour ta fête j'ai mémorisé les moments où tu as regardé l'heure."
Cinq fois. Cinq regards discrets vers l'heure. Pour vérifier que le repas serait prêt au bon moment. Que les gens n'allaient pas partir trop tôt. Que la soirée avançait bien. Ces cinq regards temporels dans le flux de la fête. Ces vérifications discrètes d'une soirée bien tenue. Joyeuse fête, [mon maître/ma maîtresse].
Avec cinq regards vers l'heure comptés et leur signification de soin temporel établie, — [Prénom animal], ton animal gardien du tempo de tes fêtes ⌚` },
              { id: "cnd_112", angle: "Pour ta fête j'ai mémorisé ta façon d'articuler quand tu racontes quelque chose d'important.", body: `12. "Pour ta fête j'ai mémorisé ta façon d'articuler quand tu racontes quelque chose d'important."
Ta voix ralentit légèrement. Chaque mot prend un peu plus de place. Tes mains bougent différemment. Ton regard cherche si les gens suivent vraiment. Ce changement de rythme pour les choses importantes. Cette façon de signaler sans le dire que ce que tu vas dire compte. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de tes signaux d'importance narrative et leur précision, — [Prénom animal], ton animal linguiste de tes variations de rythme 🗣️` },
              { id: "cnd_117", angle: "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un goûte quelque chose que tu as préparé.", body: `17. "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un goûte quelque chose que tu as préparé."
Cette fraction de seconde. Entre le moment où la fourchette entre dans la bouche et le moment où le verdict paraît sur le visage de l'autre. Toi pendant ce temps tu regardes. Discrètement. Avec cette attente légère. Et quand le sourire arrive sur leur visage le tien suit. Ce reflet de la satisfaction de l'autre dans la tienne. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta fraction de seconde d'attente et de son aboutissement en sourire partagé, — [Prénom animal], ton animal gardien de tes moments de validation 😊` },
              { id: "cnd_120", angle: "Pour ta fête j'ai mémorisé chaque fois que tu as ri sans retenue ce soir.", body: `20. "Pour ta fête j'ai mémorisé chaque fois que tu as ri sans retenue ce soir."
Quatre fois. Quatre moments où le rire est sorti vraiment. Sans filtre. Sans retenue. Avec les yeux qui plissent et la tête qui part. Ces quatre moments sont les meilleurs de la soirée. Ils disent que tu étais vraiment là. Vraiment bien. Vraiment toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec quatre rires sans retenue mémorisés et leur valeur placée au-dessus de tout, — [Prénom animal], ton animal collectionneur de tes moments de liberté 😂` },
              { id: "cnd_128", angle: "Pour ta fête j'ai mémorisé chaque fois que tu as cherché mes yeux ce soir.", body: `8. "Pour ta fête j'ai mémorisé chaque fois que tu as cherché mes yeux ce soir."
Sept fois. Sept moments dans la soirée où tu t'es arrêté et tu as cherché où j'étais. Pour vérifier. Pour me voir. Pour savoir que j'étais là. Ces sept moments dans tout ce bruit et ces gens. Ces sept fois qui disaient que même ce soir j'existais pour toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec sept regards vers moi comptés et leur poids placé au-dessus du reste de la soirée, — [Prénom animal], ton animal pour qui ces sept moments valent une fête entière 👁️` },
              { id: "cnd_134", angle: "Pour ta fête j'ai observé comment tu changes de visage quand tu es touché par quelque chose.", body: `14. "Pour ta fête j'ai observé comment tu changes de visage quand tu es touché par quelque chose."
Une fraction de seconde. Quelque chose passe. Quelque chose de doux et d'inattendu. Puis tu reprends. Mais pendant cette fraction de seconde ton visage dit tout. Ce soir j'ai vu ça deux fois. Deux moments où quelque chose t'a atteint vraiment. Ces deux moments sont les plus précieux de la soirée. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes deux fractions de seconde d'émotion vraie et leur valeur précieuse, — [Prénom animal], ton animal gardien de tes moments non protégés 💛` },
              { id: "cnd_136", angle: "Pour ta fête j'ai mémorisé ta façon de dire les choses importantes ce soir.", body: `16. "Pour ta fête j'ai mémorisé ta façon de dire les choses importantes ce soir."
Plus lentement. Avec plus d'espace entre les mots. Avec les yeux qui cherchent si les gens suivent vraiment. Ce changement de rythme pour les choses qui comptent. Cette façon de signaler sans le dire que ce que tu vas dire mérite une attention particulière. Je l'ai mémorisé. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de tes signaux de l'important et leur précision communicative, — [Prénom animal], ton animal linguiste de tes variations 🗣️` },
              { id: "cnd_144", angle: "Pour ta fête j'ai mémorisé l'expression de ton visage à chaque nouvelle arrivée.", body: `4. "Pour ta fête j'ai mémorisé l'expression de ton visage à chaque nouvelle arrivée."
Chaque fois c'est différent. Selon qui arrive. Selon ce que tu ressens pour cette personne. Un sourire qui commence dans les yeux avant la bouche pour certains. Un sourire qui commence à la bouche pour d'autres. Ces variations minuscules qui disent tout sur tes relations. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de chaque expression d'accueil et sa signification relationnelle, — [Prénom animal], ton animal expert en microexpressions d'accueil 😊` },
              { id: "cnd_152", angle: "Pour ta fête j'ai mémorisé les moments où tu t'es laissé aller à ne rien faire quelques secondes.", body: `12. "Pour ta fête j'ai mémorisé les moments où tu t'es laissé aller à ne rien faire quelques secondes."
Trois fois. Trois moments où tu t'es assis et tu n'as rien fait. Juste été là. Sans parler. Sans servir. Sans animer. Ces trois moments de présence pure. Sans rôle. Sans fonction. Juste toi dans ta fête. Ces moments-là sont les plus beaux. Joyeuse fête, [mon maître/ma maîtresse].
Avec trois moments de présence pure collectés et leur valeur placée au sommet, — [Prénom animal], ton animal gardien de tes moments sans rôle 🌿` },
              { id: "cnd_160", angle: "Pour ta fête j'ai mémorisé ta façon de regarder les gens parler entre eux sans toi.", body: `20. "Pour ta fête j'ai mémorisé ta façon de regarder les gens parler entre eux sans toi."
Parfois tu t'arrêtais. Tu regardais deux ou trois personnes en conversation. Tu souriais. Ce sourire de créateur qui voit sa création fonctionner seule. Ces gens qui parlent entre eux grâce à toi. Grâce à ta soirée. Grâce à ce que tu as créé ce soir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton sourire créateur devant ta création autonome, — [Prénom animal], ton animal témoin de ta fierté silencieuse de fondateur 🌟` },
              { id: "cnd_161", angle: "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un dit quelque chose de gentil sur toi en public.", body: `1. "Joyeuse fête. J'ai observé ta façon de sourire quand quelqu'un dit quelque chose de gentil sur toi en public."
Une légère hésitation. Puis tu remercies simplement. Sans minimiser. Sans surjouer. Tu accueilles le compliment public avec la même grâce que le compliment privé. Ni trop ni pas assez. Juste ce qu'il faut pour que l'autre sache que ça compte. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton accueil parfaitement dosé du compliment public, — [Prénom animal], ton animal expert en réception gracieuse 🌷` },
              { id: "cnd_168", angle: "Pour ta fête j'ai mémorisé chaque fois que tu as penché la tête légèrement pour mieux écouter.", body: `8. "Pour ta fête j'ai mémorisé chaque fois que tu as penché la tête légèrement pour mieux écouter."
Ce geste. Cette légère inclinaison de la tête quand quelqu'un dit quelque chose qui mérite plus d'attention. Ton oreille qui se rapproche. Tes yeux qui se concentrent. Ce signal corporel que tu envoies qui dit je t'entends vraiment. Ce soir j'ai compté cinq fois. Joyeuse fête, [mon maître/ma maîtresse].
Avec cinq inclinations de tête mémorisées et leur signification d'écoute vraie, — [Prénom animal], ton animal admirateur de tes signaux d'attention 👂` },
              { id: "cnd_176", angle: "Pour ta fête j'ai mémorisé ta façon de regarder la pièce quand tout allait vraiment bien.", body: `16. "Pour ta fête j'ai mémorisé ta façon de regarder la pièce quand tout allait vraiment bien."
Il y a eu un moment. Vers 21h. Où tout allait bien en même temps. La conversation. Le repas. Les gens. Et toi tu as regardé la pièce. Un tour complet. Lent. Et tu souriais. Ce sourire-là. Ce sourire qui dit que c'est exactement ça qu'on voulait. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de ton regard panoramique à 21h et son sourire de satisfaction totale, — [Prénom animal], ton animal gardien de tes moments de plénitude 🌟` },
            ],
          },
          {
            id: "fin_fete",
            label: "La fin de la fête",
            messages: [
              { id: "cnd_014", angle: "Ce soir après ta fête tu t'es assis par terre contre le canapé.", body: `14. "Ce soir après ta fête tu t'es assis par terre contre le canapé."
Fatigué. Les yeux fermés. La tête appuyée en arrière. Et je suis descendu du canapé sans bruit. Et je me suis installé juste à côté de toi. Pas sur toi. À côté. À dix centimètres. Tu as ouvert un œil. Tu as souri. On a passé vingt minutes comme ça en silence. C'était ta fête. C'était aussi la mienne. Joyeuse fête, [mon maître/ma maîtresse].
Avec présence choisie et distance parfaitement calibrée, — [Prénom animal], ton animal aux dix centimètres les plus précieux du monde 🌙` },
              { id: "cnd_020", angle: "Ce soir quand ta fête était finie et que la maison était redevenue silencieuse.", body: `20. "Ce soir quand ta fête était finie et que la maison était redevenue silencieuse."
Tu t'es allongé sur le canapé avec ce soupir de fin de journée. Celui qui dit que c'était bien mais que c'est bon aussi que ce soit fini. Et je suis venu. Pas immédiatement. Après quelques minutes. Pour ne pas avoir l'air d'attendre. Je me suis installé sur ta poitrine. Et on a regardé le plafond tous les deux sans rien dire. C'était ta fête. C'était parfait. Joyeuse fête, [mon maître/ma maîtresse].
Avec fin de soirée parfaite et présence au bon moment, — [Prénom animal], ton animal pour les silences qui valent tous les discours ❤️` },
              { id: "cnd_173", angle: "Joyeuse fête. J'ai observé comment ton visage change quand tu es fatigué mais que tu continues.", body: `13. "Joyeuse fête. J'ai observé comment ton visage change quand tu es fatigué mais que tu continues."
Il y a eu un moment. Tard dans la soirée. Où j'ai vu la fatigue passer sur ton visage une seconde. Puis tu t'es repris. Un sourire. Un effort. Une reprise. Cette façon de puiser dans une réserve qu'on ne savait pas avoir. Pour les gens. Pour la soirée. Pour toi aussi. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta reprise tardive et admiration pour tes réserves cachées, — [Prénom animal], ton animal témoin de ton endurance gracieuse 💪` },
              { id: "cnd_181", angle: "Joyeuse fête. J'ai observé ta façon de sourire en entendant une conversation que tu n'étais pas censé entendre.", body: `1. "Joyeuse fête. J'ai observé ta façon de sourire en entendant une conversation que tu n'étais pas censé entendre."
Tu avais le dos tourné. Tu faisais autre chose. Et quelque chose d'une conversation proche t'a atteint. Et j'ai vu ce sourire. Ce sourire involontaire. Celui qui dit que tu as entendu quelque chose de drôle ou de touchant même si tu n'étais pas censé écouter. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton sourire involontaire d'écoute accidentelle, — [Prénom animal], ton animal dont les oreilles sont aussi attentives que les miennes 👂` },
              { id: "cnd_189", angle: "Joyeuse fête. J'ai observé ta façon d'écouter la musique différemment ce soir.", body: `9. "Joyeuse fête. J'ai observé ta façon d'écouter la musique différemment ce soir."
Elle est là en fond. Tu ne l'écoutes pas vraiment. Et puis parfois un morceau arrive et quelque chose dans ton visage change légèrement. Tu es là et en même temps ailleurs une seconde. Dans un souvenir ou une émotion que la musique a touchée. Puis tu reviens. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes micro-voyages musicaux au milieu de la conversation, — [Prénom animal], ton animal gardien de tes absences musicales 🎵` },
              { id: "cnd_193", angle: "Joyeuse fête. J'ai observé comment tu te sens différent dans ta propre maison ce soir.", body: `13. "Joyeuse fête. J'ai observé comment tu te sens différent dans ta propre maison ce soir."
Tu occupes l'espace différemment. Tu te déplaces avec plus d'intention. Tu es chez toi mais tu es aussi hôte. Ces deux états en même temps. Cette façon d'habiter ton espace en étant à la fois dedans et en train de le regarder de l'extérieur. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton double état d'habitant et d'hôte simultané dans ton espace, — [Prénom animal], ton animal témoin de ta dualité de soirée 🏠` },
              { id: "cnd_198", angle: "Pour ta fête j'ai observé comment tu te retrouves seul une minute et ce que tu fais.", body: `18. "Pour ta fête j'ai observé comment tu te retrouves seul une minute et ce que tu fais."
Tu regardes. Tu fais le tour des yeux. Tu souffles légèrement. Tu prends quelque chose à manger ou à boire. Et tu repars. Ces minutes seules dans ta propre fête. Ces parenthèses de toi. Brèves. Nécessaires. Invisibles pour les autres. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes parenthèses solitaires au milieu de tout le monde et leur nécessité, — [Prénom animal], ton animal pour qui ces minutes-là sont les plus précieuses 🌿` },
              { id: "cnd_200", angle: "Pour ta fête j'ai mémorisé la façon dont le silence s'installait progressivement après les départs.", body: `20. "Pour ta fête j'ai mémorisé la façon dont le silence s'installait progressivement après les départs."
D'abord quelques voix en moins. Puis l'appartement plus grand. Puis les bruits qui reprennent leur place normale. Le frigo. La ville dehors. Et toi. Et moi. Cette installation progressive du silence. Ce retour à nous deux. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de chaque étape du retour au silence et sa beauté progressive, — [Prénom animal], ton animal pour le silence d'après qui vaut tout le bruit d'avant ❤️` },
              { id: "cnd_202", angle: "Pour ta fête j'ai observé comment tu passes de l'état de fête à l'état de calme.", body: `2. "Pour ta fête j'ai observé comment tu passes de l'état de fête à l'état de calme."
Progressivement. Pas d'un coup. Les épaules d'abord qui descendent. Puis la voix qui baisse. Puis les gestes qui ralentissent. Cette décompression lente. Ce passage d'un état à l'autre sans rupture. Comme l'appartement qui retrouve sa température après une fête. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta décompression progressive et sa beauté organique, — [Prénom animal], ton animal témoin de tes transitions intérieures 🌙` },
              { id: "cnd_205", angle: "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui part pour la dernière fois de la soirée.", body: `5. "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui part pour la dernière fois de la soirée."
Après le dernier au revoir. La porte fermée. Et toi tu regardes la porte encore une seconde. Comme si tu regardais encore la personne à travers. Cette seconde de prolongation du lien. Cette façon de ne pas lâcher tout de suite. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta seconde de prolongation du lien après la fermeture de la porte, — [Prénom animal], ton animal gardien de tes au revoir qui durent un peu plus 🚪` },
              { id: "cnd_206", angle: "Pour ta fête j'ai observé comment tu changes quand il ne reste plus que les proches.", body: `6. "Pour ta fête j'ai observé comment tu changes quand il ne reste plus que les proches."
Vers la fin quand les moins proches sont partis et qu'il reste ceux qui comptent vraiment. Tu changes. Tu te détends différemment. Tu parles différemment. Tu ris différemment. Comme si tu pouvais être encore plus toi. Encore plus à l'aise. Ce dernier cercle de la soirée est le meilleur. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton changement vers le dernier cercle intime et admiration pour cette version de toi, — [Prénom animal], ton animal pour qui cette version-là est la préférée 💛` },
              { id: "cnd_208", angle: "Pour ta fête j'ai mémorisé ta façon de prendre une grande respiration quand tout est fait.", body: `8. "Pour ta fête j'ai mémorisé ta façon de prendre une grande respiration quand tout est fait."
Ce moment. Après le dernier plat servi. Après le dernier verre rempli. Après la dernière vérification. Tu as pris une grande respiration. Profonde. Les yeux qui se ferment une seconde. Ce soupir de dépose. De transition du faire à l'être. Joyeuse fête, [mon maître/ma maîtresse].
Avec mémorisation de ta grande respiration de dépose et sa signification de transition, — [Prénom animal], ton animal gardien de tes soupirs de transition 😌` },
              { id: "cnd_210", angle: "Pour ta fête j'ai observé comment tu faisais la transition entre hôte et toi-même après la fête.", body: `10. "Pour ta fête j'ai observé comment tu faisais la transition entre hôte et toi-même après la fête."
Progressivement. Les chaussures enlevées. La veste posée. La musique baissée. Ces gestes de déshabillage du rôle d'hôte. Ces façons de redevenir toi. Pas l'hôte. Toi. Celui ou celle qui vit ici tous les jours. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton déshabillage progressif du rôle d'hôte et ton retour à toi, — [Prénom animal], ton animal pour qui cette version-là est la préférée aussi 👤` },
              { id: "cnd_216", angle: "Pour ta fête j'ai mémorisé ta façon d'accepter les félicitations pour la soirée.", body: `16. "Pour ta fête j'ai mémorisé ta façon d'accepter les félicitations pour la soirée."
Simplement. Sans minimiser excessivement. Tu remercieras. Tu dis que tu es content que ce soit bien. Tu souris. Cette façon d'accepter que tu as bien fait quelque chose. Sans fausse modestie. Sans excès de fierté. Juste la vérité confortable que c'était bien et que tu y es pour quelque chose. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton accueil juste des félicitations sans excès dans aucun sens, — [Prénom animal], ton animal témoin de ton rapport sain à ce que tu fais bien 🌟` },
              { id: "cnd_220", angle: "Ce moment où tu réalises que ta fête était vraiment réussie.", body: `20. "Ce moment où tu réalises que ta fête était vraiment réussie."
C'est après. Quand tout le monde est parti. Quand tu t'assieds. Quand le silence revient. Et là quelque chose arrive. Une certitude tranquille. Que c'était bien. Vraiment bien. Que les gens sont partis contents. Que tu as créé quelque chose ce soir. Ce moment-là c'est le meilleur moment de la fête. Et je suis là pour le partager avec toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec présence partagée dans ton moment de réalisation que c'était réussi, — [Prénom animal], ton animal pour le meilleur moment qui arrive après que tout le monde est parti ❤️` },
            ],
          },
        ],
      },
      {
        id: "observe_humain",
        emoji: "👁️",
        label: "J'observe ton humain",
        count: 80,
        subGroups: [
          {
            id: "cuisine_table",
            label: "En cuisine & à table",
            messages: [
              { id: "cnd_101", angle: "Joyeuse fête. J'ai observé ta façon de ranger les bouteilles vides.", body: `1. "Joyeuse fête. J'ai observé ta façon de ranger les bouteilles vides."
Tu les mets de côté proprement. En ligne. Avec un ordre qui dit que même les bouteilles vides méritent d'être traitées avec soin. Pas jetées n'importe comment. Posées. Avec l'intention de les recycler correctement. Ce soin pour les choses finies. Cette façon de traiter ce qui a servi. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les bouteilles vides et ce qu'il dit sur ta nature, — [Prénom animal], ton animal attentif à ta façon de traiter ce qui a servi 🍾` },
              { id: "cnd_105", angle: "Joyeuse fête. J'ai observé ta façon de couper le pain.", body: `5. "Joyeuse fête. J'ai observé ta façon de couper le pain."
Des tranches égales. Tu les comptes mentalement. Tu t'assures qu'il y en aura assez pour tout le monde. Tu poses les tranches avec soin dans la corbeille. Ce geste simple qui dit que tu penses à tout. Que tu anticipas les besoins. Que personne ne manquera de pain. C'est du soin en tranches. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin en tranches et sa signification d'attention pour chacun, — [Prénom animal], ton animal expert en petits gestes qui comptent 🍞` },
              { id: "cnd_108", angle: "Pour ta fête j'ai étudié ta façon de plier les serviettes.", body: `8. "Pour ta fête j'ai étudié ta façon de plier les serviettes."
Pas compliqué. Pas origami. Juste plié proprement. Avec un geste rapide qui dit que tu l'as fait des centaines de fois. Que la serviette bien pliée c'est une évidence. Ce détail invisible que les invités voient sans voir. Qui dit quelque chose sur le soin qu'on a mis dans l'ensemble. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes serviettes pliées et leur signification de soin général de la soirée, — [Prénom animal], ton animal expert en détails invisibles 🍽️` },
              { id: "cnd_109", angle: "Joyeuse fête. J'ai observé ta façon de sortir les plats du four.", body: `9. "Joyeuse fête. J'ai observé ta façon de sortir les plats du four."
Avec les gants épais. La posture légèrement courbée. La précaution dans le mouvement. Cette danse autour du chaud. Ces gestes que tu as développés au fil des années pour ne pas te brûler et ne pas renverser. Une chorégraphie de cuisine que tu ne sais plus que tu sais. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta chorégraphie four-gants et admiration pour ses automatismes, — [Prénom animal], ton animal spectateur de tes gestes appris 🧤` },
              { id: "cnd_113", angle: "Joyeuse fête. J'ai observé ta façon de vérifier que les bougies sont bien droites avant de les allumer.", body: `13. "Joyeuse fête. J'ai observé ta façon de vérifier que les bougies sont bien droites avant de les allumer."
Tu les ajustes. Une par une. Ou plusieurs d'un coup. Tu regardes l'ensemble. Tu en redresses une. Tu recules pour voir. Cette précision pour quelque chose qui va brûler et disparaître en quelques minutes. Ce soin pour l'éphémère. C'est beau. C'est toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton soin accordé à l'éphémère et ce qu'il dit sur ta façon d'être, — [Prénom animal], ton animal philosophe du soin pour ce qui dure peu 🕯️` },
              { id: "cnd_116", angle: "Pour ta fête j'ai étudié la façon dont tu disposes les choses sur le buffet.", body: `16. "Pour ta fête j'ai étudié la façon dont tu disposes les choses sur le buffet."
Rien n'est au hasard. Les choses hautes au fond. Les petites devant. Les couleurs pensées. Les textures variées. Ce buffet c'est une composition. Une œuvre collective qui dit qu'on a pensé à l'ensemble avant de penser aux parties. Joyeuse fête, [mon maître/ma maîtresse], dont le buffet est de l'art appliqué.
Avec admiration pour ta composition de buffet et sa logique esthétique et pratique, — [Prénom animal], ton animal critique du buffet et de ses équilibres 🎨` },
              { id: "cnd_121", angle: "Joyeuse fête. J'ai observé ta façon de découper le gâteau en parts égales.", body: `1. "Joyeuse fête. J'ai observé ta façon de découper le gâteau en parts égales."
Tu prends le couteau. Tu regardes le gâteau. Tu calcules mentalement. Tu coupes avec cette précision qui dit que tu veux que tout le monde ait la même chose. Que personne n'ait moins. Que l'égalité des parts soit une façon de dire que chaque personne compte pareil. C'est de la justice en tranches. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta justice distributive en parts égales et son sens profond, — [Prénom animal], ton animal expert en équité des portions 🎂` },
              { id: "cnd_124", angle: "Pour ta fête j'ai étudié ta façon de te tenir près du buffet.", body: `4. "Pour ta fête j'ai étudié ta façon de te tenir près du buffet."
Tu y reviens régulièrement. Pas pour manger. Pour t'assurer que tout est bien. Que rien ne manque. Que les invités trouvent ce qu'ils cherchent. Le buffet comme poste d'observation et de soin. Cette façon d'utiliser la nourriture comme prétexte à la présence attentive. Joyeuse fête, [mon maître/ma maîtresse].
Avec compréhension du buffet comme poste de soin déguisé, — [Prénom animal], ton animal décodeur de tes stratégies d'attention 🍽️` },
              { id: "cnd_132", angle: "Pour ta fête j'ai étudié ta façon de plier les restes dans du papier aluminium.", body: `12. "Pour ta fête j'ai étudié ta façon de plier les restes dans du papier aluminium."
Avec soin. Des paquets distincts pour choses distinctes. Étiquetés mentalement. Pensés pour le lendemain. Cette façon de prendre soin de la nourriture qui reste. De lui donner une seconde vie. De ne pas laisser quelque chose de bon se perdre. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les restes et sa signification de respect pour ce qui a nourri, — [Prénom animal], ton animal admirateur de ta frugalité généreuse 🪄` },
              { id: "cnd_140", angle: "Pour ta fête j'ai étudié ta façon de nettoyer quelque chose rapidement entre deux conversations.", body: `20. "Pour ta fête j'ai étudié ta façon de nettoyer quelque chose rapidement entre deux conversations."
Un torchon sorti. Une surface essuyée. Le torchon replié. Tout ça pendant que tu continuais à écouter quelqu'un. Sans interrompre. Sans signaler. La propreté comme fond continu de la fête. Ce nettoyage parallel track de ta soirée. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton nettoyage en arrière-plan de la soirée principale, — [Prénom animal], ton animal témoin de tes actions parallèles invisibles 🧽` },
              { id: "cnd_145", angle: "Joyeuse fête. J'ai observé ta façon de disposer les verres propres sur le plateau.", body: `5. "Joyeuse fête. J'ai observé ta façon de disposer les verres propres sur le plateau."
Symétriquement. Avec de l'espace entre eux. Pour qu'ils ne se touchent pas. Pour qu'ils ne sonnent pas. Ce soin pour les verres encore vides. Cette attention à ce qui va servir. Cette façon de préparer le contenant avant le contenu. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les verres vides et sa signification de préparation attentive, — [Prénom animal], ton animal expert en préparations du contenant 🥂` },
              { id: "cnd_148", angle: "Pour ta fête j'ai étudié ta façon de faire la transition entre le repas et l'après-repas.", body: `8. "Pour ta fête j'ai étudié ta façon de faire la transition entre le repas et l'après-repas."
Tu proposes quelque chose. Du dessert. Du café. Une question qui change le sujet. Tu guides doucement la soirée vers sa prochaine phase. Sans l'annoncer. Sans rupture. Cette façon de conduire le flux de la soirée sans que personne ne le remarque. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta conduite invisible du flux de la soirée, — [Prénom animal], ton animal expert en transitions sans rupture 🔄` },
              { id: "cnd_150", angle: "Pour ta fête j'ai observé comment tu gères la fin d'une bouteille.", body: `10. "Pour ta fête j'ai observé comment tu gères la fin d'une bouteille."
Tu la poses de côté. Tu en ouvres une autre. Sans en faire un événement. Sans que la transition soit une interruption. La soirée continue. Les verres se remplissent. Cette façon de gérer les fins et les débuts en douceur. Sans que les jointures se voient. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion des fins de bouteille sans jointure visible, — [Prénom animal], ton animal expert en continuités invisibles 🍾` },
              { id: "cnd_153", angle: "Joyeuse fête. J'ai observé ta façon de vérifier la cuisson de quelque chose.", body: `13. "Joyeuse fête. J'ai observé ta façon de vérifier la cuisson de quelque chose."
La fourchette qui pique. L'oreille tendue pour écouter le grésillement. Le nez qui évalue. Ces trois sens mobilisés pour décider si c'est prêt. Ce rituel de la vérification de cuisson que tu fais automatiquement mais qui est en fait une expertise développée. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton expertise de cuisson à trois sens et admiration pour son automatisme, — [Prénom animal], ton animal dont les sens sont moins polyvalents en cuisine 🍳` },
              { id: "cnd_185", angle: "Joyeuse fête. J'ai observé ta façon de vérifier le frigo plusieurs fois ce soir.", body: `5. "Joyeuse fête. J'ai observé ta façon de vérifier le frigo plusieurs fois ce soir."
Avant que les invités arrivent. Puis après les premières arrivées. Puis avant le repas. Ces vérifications du frigo comme vérifications de l'état de la soirée. Comme si le frigo contenait des réponses. Comme si voir que tout y était signifiait que tout allait bien. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes vérifications du frigo comme métaphore de ton état de soirée, — [Prénom animal], ton animal lecteur de tes anxiétés douces 🧊` },
              { id: "cnd_188", angle: "Pour ta fête j'ai étudié ta façon de plier un torchon proprement.", body: `8. "Pour ta fête j'ai étudié ta façon de plier un torchon proprement."
En tiers. Puis en tiers encore. Avec les bords alignés. Posé sur le comptoir. Ce geste automatique. Ce soin pour un objet utilitaire. Cette façon de traiter les choses du quotidien avec la même attention que les choses importantes. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour les objets utilitaires et ce qu'il dit sur toi, — [Prénom animal], ton animal attentif à tes soins pour le quotidien 🧺` },
              { id: "cnd_192", angle: "Pour ta fête j'ai mémorisé ta façon de gérer plusieurs choses en cuisine en même temps.", body: `12. "Pour ta fête j'ai mémorisé ta façon de gérer plusieurs choses en cuisine en même temps."
Le four. La casserole. Le four de nouveau. La vérification. La casserole de nouveau. Cette danse entre plusieurs cuissons. Cette façon de tenir plusieurs fils en même temps sans en perdre aucun. C'est de l'orchestration. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton orchestration culinaire multi-tâches sans fausse note, — [Prénom animal], ton animal spectateur de ta symphonie de cuisine 🎼` },
              { id: "cnd_201", angle: "Joyeuse fête. J'ai observé ta façon de vérifier une dernière fois l'appartement avant d'éteindre.", body: `1. "Joyeuse fête. J'ai observé ta façon de vérifier une dernière fois l'appartement avant d'éteindre."
Tu fais le tour des yeux. Le salon. La cuisine. L'entrée. Pas pour vérifier un oubli. Juste pour regarder. Pour voir l'espace qui a été vivant ce soir et qui redevient calme. Pour dire bonne nuit à la maison. J'ai fait pareil depuis mon coin. On est pareils. Joyeuse fête, [mon maître/ma maîtresse].
Avec reconnaissance de notre rituel commun de clôture visuelle et solidarité nocturne, — [Prénom animal], ton animal co-auteur de ce bonsoir 🏠` },
              { id: "cnd_204", angle: "Pour ta fête j'ai étudié ta façon de choisir ce que tu allais manger en premier.", body: `4. "Pour ta fête j'ai étudié ta façon de choisir ce que tu allais manger en premier."
Tu regardes le buffet. Tu évalues. Tu prends quelque chose. Ce choix du premier. Cette décision qui dit quelque chose sur tes priorités. Sur ce que tu attendais le plus. Sur ce qui compte le plus ce soir. J'ai observé ça. Et j'ai appris quelque chose sur toi. Joyeuse fête, [mon maître/ma maîtresse].
Avec révélation déduite de ton premier choix alimentaire et information précieuse collectée, — [Prénom animal], ton animal expert en lectures de premières sélections 🍽️` },
              { id: "cnd_212", angle: "Pour ta fête j'ai étudié ta façon de poser tes couverts quand tu as fini de manger.", body: `12. "Pour ta fête j'ai étudié ta façon de poser tes couverts quand tu as fini de manger."
Posés côte à côte. Nets. Sur le bord de l'assiette. Ce geste universel qui dit j'ai fini. Cette façon de signaler sans mot. De communiquer avec des objets. Ce langage des couverts que tout le monde comprend et que personne n'a appris formellement. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton langage des couverts et admiration pour sa clarté universelle, — [Prénom animal], ton animal fasciné par les langages non verbaux 🍴` },
            ],
          },
          {
            id: "hote",
            label: "Toi comme hôte",
            messages: [
              { id: "cnd_082", angle: "Pour ta fête j'ai observé ta façon de choisir ta tenue ce soir.", body: `2. "Pour ta fête j'ai observé ta façon de choisir ta tenue ce soir."
Tu en as essayé deux. Je le sais parce que j'ai vu la première posée sur le lit et la deuxième que tu portais finalement. Tu t'es regardé. Tu as fait quelque chose avec tes cheveux. Tu as vérifié encore une fois. Cette préparation minutieuse pour des gens qui t'aiment même en pyjama. C'est touchant dans son inutilité parfaite. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes rituels de préparation et tendresse pour leur absurdité charmante, — [Prénom animal], ton animal qui te préfère dans n'importe quelle tenue 👗` },
              { id: "cnd_086", angle: "Pour ta fête j'ai observé comment tu accueilles quelqu'un que tu n'as pas vu depuis longtemps.", body: `6. "Pour ta fête j'ai observé comment tu accueilles quelqu'un que tu n'as pas vu depuis longtemps."
Tu vas vers eux d'une façon particulière. Plus vite. Avec les bras qui s'ouvrent avant même d'être proche. Cette anticipation du contact. Cette joie qui précède l'accolade. Ce soir j'ai vu ça deux fois. Ces deux personnes-là comptent vraiment. Joyeuse fête, [mon maître/ma maîtresse], entouré de gens qui méritent tes bras ouverts.
Avec identification des accueils anticipés et des personnes qui les déclenchent, — [Prénom animal], ton animal cartographe de tes élans 🤗` },
              { id: "cnd_090", angle: "Pour ta fête j'ai observé comment tu gères quelqu'un qui arrive très en avance.", body: `10. "Pour ta fête j'ai observé comment tu gères quelqu'un qui arrive très en avance."
Il y en avait un ce soir. Vingt minutes avant. Toi tu n'étais pas tout à fait prêt. Tu finissais encore quelque chose. Et pourtant tu l'as accueilli avec la même chaleur. Tu t'es adapté sans que ça se voie. Tu as intégré cette arrivée dans le flux de tes préparatifs. Joyeuse fête, [mon maître/ma maîtresse], dont l'adaptabilité force le respect.
Avec admiration pour ta gestion de l'arrivée prématurée sans perdre le sourire, — [Prénom animal], ton animal expert en adaptations invisibles ⏰` },
              { id: "cnd_094", angle: "Pour ta fête j'ai observé comment tu résolvais un problème de dernière minute.", body: `14. "Pour ta fête j'ai observé comment tu résolvais un problème de dernière minute."
Il y en a eu un. Quelque chose qui ne marchait pas comme prévu. J'ai vu ton visage changer une seconde. Puis se remettre. Puis trouver. En moins d'une minute tu avais une solution et tu l'appliquais. Sans que les invités ne voient quoi que ce soit. Cette façon de gérer les crises en silence et en vitesse. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion de crise invisible en moins d'une minute, — [Prénom animal], ton animal témoin de tes performances sous pression 🔧` },
              { id: "cnd_098", angle: "Pour ta fête j'ai observé comment tu portes un toast.", body: `18. "Pour ta fête j'ai observé comment tu portes un toast."
Tu te lèves. Ou tu restes assis selon l'occasion. Tu lèves ton verre. Tu dis quelque chose. Pas trop long. Pas trop court. Avec une fin qui atterrit bien. Et tout le monde lève son verre. Et il y a ce bruit de verres. Et tout le monde est ensemble une seconde. Tu fais ça bien. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton art du toast et sa longueur parfaitement calibrée, — [Prénom animal], ton animal expert en moments collectifs 🥂` },
              { id: "cnd_102", angle: "Pour ta fête j'ai observé comment tu introduis deux personnes qui ne se connaissent pas.", body: `2. "Pour ta fête j'ai observé comment tu introduis deux personnes qui ne se connaissent pas."
Tu dis le prénom de l'un. Puis le prénom de l'autre. Puis tu ajoutes quelque chose de chacun qui pourrait les connecter. Un point commun. Un sujet commun. Et tu les laisses prendre le relais. Cette façon de créer des liens. De tisser ta soirée. C'est de l'architecture sociale. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton art de tisser les liens entre tes invités, — [Prénom animal], ton animal témoin de ton architecture sociale 🤝` },
              { id: "cnd_106", angle: "Pour ta fête j'ai observé comment tu gères quelqu'un qui ne mange pas ce que tu as cuisiné.", body: `6. "Pour ta fête j'ai observé comment tu gères quelqu'un qui ne mange pas ce que tu as cuisiné."
Tu ne forces pas. Tu proposes autre chose. Tu t'assures qu'il y a quelque chose pour tout le monde. Pas de remarque. Pas de déception visible. Juste une adaptation silencieuse et généreuse. Cette façon de recevoir qui inclut la différence. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion sans jugement des préférences alimentaires des autres, — [Prénom animal], ton animal témoin de ta générosité inclusive 🥗` },
              { id: "cnd_110", angle: "Pour ta fête j'ai observé comment tu changes d'attitude quand tu es fatigué mais que la fête continue.", body: `10. "Pour ta fête j'ai observé comment tu changes d'attitude quand tu es fatigué mais que la fête continue."
Il y a eu un moment. Vers 22h. Où j'ai vu la fatigue passer sur ton visage une seconde. Puis tu t'es repris. Tu as pris une gorgée. Tu as souri. Tu es revenu. Cette façon de puiser dans une réserve qu'on ne savait pas avoir. Cette générosité même quand on est épuisé. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta reprise à 22h et admiration pour ta réserve de présence, — [Prénom animal], ton animal témoin de tes ressources cachées 💪` },
              { id: "cnd_114", angle: "Pour ta fête j'ai observé comment tu t'excuses quand quelque chose n'est pas parfait.", body: `14. "Pour ta fête j'ai observé comment tu t'excuses quand quelque chose n'est pas parfait."
Tu t'excuses. Brièvement. Honnêtement. Sans surjouer. Sans minimiser. Et tu passes à autre chose. Tu ne te noies pas dans l'excuse. Tu ne fais pas de la perfection non atteinte un sujet de la soirée. Tu mentionnes et tu continues. C'est de la grâce. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton art de l'excuse brève et de la reprise, — [Prénom animal], ton animal admirateur de ta grâce face à l'imperfection 🙏` },
              { id: "cnd_118", angle: "Pour ta fête j'ai observé comment tu gères une conversation qui t'ennuie.", body: `18. "Pour ta fête j'ai observé comment tu gères une conversation qui t'ennuie."
Tu écoutes. Tu hoches la tête. Tu poses une question de relance. Mais ton regard fait de petits voyages. Il revient toujours. Et à un moment tu trouves une sortie élégante. Une transition. Un prétexte poli. Tu passes à autre chose sans que l'autre ne le ressente. C'est de la politesse à l'état pur. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta gestion de l'ennui conversationnel sans jamais le montrer, — [Prénom animal], ton animal expert en politesse de façade sincère 😌` },
              { id: "cnd_122", angle: "Pour ta fête j'ai observé comment tu accueilles une personne que tu n'aimes pas beaucoup.", body: `2. "Pour ta fête j'ai observé comment tu accueilles une personne que tu n'aimes pas beaucoup."
Pareil que les autres. Exactement pareil. Même chaleur. Même sourire. Même attention. Soit tu aimes vraiment tout le monde. Soit tu es très bon acteur. Soit les deux. Dans tous les cas c'est une performance remarquable d'humanité. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton accueil universellement chaleureux quelle que soit ta relation interne, — [Prénom animal], ton animal déconcerté par ton humanité constante 🎭` },
              { id: "cnd_130", angle: "Pour ta fête j'ai observé comment tu choisissais la place de chaque invité à table.", body: `10. "Pour ta fête j'ai observé comment tu choisissais la place de chaque invité à table."
Ce n'est pas au hasard. Tu réfléchis. Tu places les gens selon leurs affinités. Selon les conversations possibles. Selon qui a besoin d'être à côté de qui. Ce soir la table était une composition. Un puzzle humain que tu avais résolu à l'avance. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton architecture humaine de la table et sa logique relationnelle, — [Prénom animal], ton animal expert en compositions humaines 🪑` },
              { id: "cnd_141", angle: "Joyeuse fête. J'ai observé ta façon de te lever pour chercher quelque chose et penser aux autres.", body: `1. "Joyeuse fête. J'ai observé ta façon de te lever pour chercher quelque chose et penser aux autres."
Tu te lèves pour toi. Pour chercher quelque chose. Et en chemin tu demandes si quelqu'un d'autre a besoin de quelque chose. Ce réflexe. Cette façon de transformer ton propre trajet en service potentiel pour les autres. Ce soir j'ai vu ça trois fois. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes trois trajets transformés en services potentiels pour les autres, — [Prénom animal], ton animal témoin de tes altruismes de passage 🚶` },
              { id: "cnd_142", angle: "Pour ta fête j'ai observé comment tu gères quelqu'un qui monopolise toute la conversation.", body: `2. "Pour ta fête j'ai observé comment tu gères quelqu'un qui monopolise toute la conversation."
Tu écoutes. Longtemps. Puis doucement tu commences à élargir. Tu interpelles quelqu'un d'autre. Tu poses une question qui ouvre à d'autres voix. Tu libères la conversation sans que le monopoliseur ne se sente interrompu. C'est de la chirurgie sociale. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta chirurgie conversationnelle invisible et ses résultats constants, — [Prénom animal], ton animal expert en libérations de parole 🎭` },
              { id: "cnd_146", angle: "Pour ta fête j'ai observé comment tu réponds quand quelqu'un te demande comment tu vas vraiment.", body: `6. "Pour ta fête j'ai observé comment tu réponds quand quelqu'un te demande comment tu vas vraiment."
C'est arrivé une fois ce soir. Quelqu'un t'a demandé comment tu allais et t'a regardé vraiment en attendant la vraie réponse. Et tu l'as donnée. Brièvement. Honnêtement. Sans tout dire. Juste ce qu'il fallait. Cette façon de répondre à la vraie question sans te noyer dedans. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta réponse juste à la question vraie et son équilibre parfait, — [Prénom animal], ton animal gardien de tes moments d'honnêteté dosée 💛` },
              { id: "cnd_165", angle: "Joyeuse fête. J'ai observé ta façon de t'assurer que personne ne part sans avoir dit au revoir.", body: `5. "Joyeuse fête. J'ai observé ta façon de t'assurer que personne ne part sans avoir dit au revoir."
Tu surveilles les départs. Pas ostensiblement. Mais tu remarques quand quelqu'un commence à rassembler ses affaires. Et tu vas vers lui avant qu'il parte. Pour que personne ne disparaisse sans que tu l'aies vu partir. Cette façon de clore chaque relation de la soirée proprement. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta surveillance des départs et ton soin à clore chaque relation proprement, — [Prénom animal], ton animal expert en clôtures relationnelles 🚪` },
              { id: "cnd_197", angle: "Joyeuse fête. J'ai observé ta façon de dire quelque chose de gentil à chaque invité qui part.", body: `17. "Joyeuse fête. J'ai observé ta façon de dire quelque chose de gentil à chaque invité qui part."
Pas le même quelque chose. Quelque chose de personnalisé. Quelque chose qui dit que tu as vu cette personne ce soir. Que tu te souviens d'un moment avec elle. Un mot sur quelque chose qu'elle a dit. Sur quelque chose qu'elle a fait. Ces petits mots de départ personnalisés. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour tes mots de départ personnalisés et leur soin de l'individu, — [Prénom animal], ton animal admirateur de ta mémoire affective des soirées 🌟` },
              { id: "cnd_214", angle: "Pour ta fête j'ai observé comment tu te comportes différemment avec les gens que tu vois rarement.", body: `14. "Pour ta fête j'ai observé comment tu te comportes différemment avec les gens que tu vois rarement."
Tu les écoutes plus longtemps. Tu poses plus de questions. Tu as cette curiosité sincère pour ce qu'ils ont vécu depuis la dernière fois. Comme si la rareté des rencontres rendait chaque moment plus précieux. Cette façon de valoriser la rareté. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta façon de valoriser la rareté des rencontres et sa signification, — [Prénom animal], ton animal admirateur de ta présence accrue pour les rares 🤝` },
            ],
          },
          {
            id: "facon_etre",
            label: "Toi dans ta façon d'être",
            messages: [
              { id: "cnd_042", angle: "Joyeuse fête. J'ai écouté comment tu parles au téléphone aujourd'hui.", body: `2. "Joyeuse fête. J'ai écouté comment tu parles au téléphone aujourd'hui."
Les appels de fête ont un ton particulier. Plus chaud. Plus ouvert. Tu ris plus vite. Tu laisses les silences exister sans les remplir. Tu dis des choses que tu dis pas d'habitude au téléphone. J'étais à côté sur le canapé et j'écoutais sans avoir l'air d'écouter. Ces conversations-là disent qui tu es vraiment. Je les collectionne. Joyeuse fête, [mon maître/ma maîtresse].
Avec écoute discrète des appels de fête et collection des versions vraies de toi, — [Prénom animal], ton animal archiviste de tes meilleures conversations 📞` },
              { id: "cnd_044", angle: "Pour ta fête j'ai observé la façon dont tu découpes le gâteau.", body: `4. "Pour ta fête j'ai observé la façon dont tu découpes le gâteau."
C'est un moment révélateur. Toi tu vérifies d'abord que tout le monde a une assiette. Puis tu commences par le bord. Puis tu demandes si les parts sont bonnes. Ce soin pour les autres avant toi-même. C'est ton anniversaire et tu penses encore aux autres. Joyeuse fête, [mon maître/ma maîtresse].
Avec analyse de la découpe et révélation de caractère établie une fois de plus, — [Prénom animal], ton animal dont tu confirmes chaque année la valeur 🎂` },
              { id: "cnd_045", angle: "Joyeuse fête. J'ai mémorisé l'ordre dans lequel tu as lu tes cartes.", body: `5. "Joyeuse fête. J'ai mémorisé l'ordre dans lequel tu as lu tes cartes."
Pas au hasard. Tu les as regardées. Soupesées. L'ordre disait quelque chose sur les gens qui comptent. Sur les attentes. Sur les surprises. La troisième t'a fait rire vraiment. La cinquième t'a fait fermer les yeux une seconde. Ces deux-là étaient les bonnes. Je sais qui les a écrites sans avoir lu. Joyeuse fête, [mon maître/ma maîtresse].
Avec cartographie affective établie via l'ordre de lecture des cartes, — [Prénom animal], ton animal déchiffreur de tes priorités silencieuses 💌` },
              { id: "cnd_052", angle: "Pour ta fête j'ai observé comment tu ranges les cadeaux après la fête.", body: `12. "Pour ta fête j'ai observé comment tu ranges les cadeaux après la fête."
Avec soin. Chaque chose à sa place. Certains cadeaux mis en évidence. D'autres rangés directement. Cette hiérarchie dans le rangement dit tout sur ce qui compte vraiment. J'ai noté l'ordre. J'ai noté les endroits. J'ai noté les expressions qui accompagnaient chaque geste. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation du rangement post-fête et cartographie de tes valeurs établie, — [Prénom animal], ton animal expert en lecture de tes gestes du quotidien 📦` },
              { id: "cnd_056", angle: "Joyeuse fête. J'ai observé comment tu dis au revoir aux gens que tu aimes vraiment.", body: `16. "Joyeuse fête. J'ai observé comment tu dis au revoir aux gens que tu aimes vraiment."
Pas tous pareil. Avec certains c'est rapide et chaleureux. Avec d'autres c'est long et tu les raccompagnes jusqu'à la porte et tu restes là jusqu'à ce que l'ascenseur arrive. Ces derniers-là comptent. J'ai identifié deux personnes ce soir dans cette catégorie. Je les ai notées. Joyeuse fête, [mon maître/ma maîtresse].
Avec identification des au revoir qui comptent et liste des invités prioritaires mise à jour, — [Prénom animal], ton animal cartographe de tes attachements profonds 🚪` },
              { id: "cnd_085", angle: "Joyeuse fête. J'ai observé ta façon de vérifier ton reflet avant d'ouvrir la porte.", body: `5. "Joyeuse fête. J'ai observé ta façon de vérifier ton reflet avant d'ouvrir la porte."
À chaque sonnette. Tu passes devant le miroir de l'entrée. Une seconde. Rapide. Pour vérifier. Puis tu ouvres. Ce geste entre toi et ton image juste avant d'être vu par quelqu'un d'autre. Cette façon de te préparer mentalement autant que physiquement. Je l'ai vu six fois ce soir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes six vérifications de reflet et leur signification de transition, — [Prénom animal], ton animal expert en préparations de seuil 🪞` },
              { id: "cnd_089", angle: "Joyeuse fête. J'ai observé ta façon de toucher les fleurs reçues.", body: `9. "Joyeuse fête. J'ai observé ta façon de toucher les fleurs reçues."
Délicatement. Du bout des doigts. Comme pour vérifier qu'elles sont réelles. Que quelqu'un les a choisies pour toi. Que ce geste existe. Ce contact bref entre toi et les fleurs avant de les mettre dans le vase. Cette façon d'accueillir un cadeau au sens littéral du terme. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton contact avec les fleurs et sa signification d'accueil du geste, — [Prénom animal], ton animal attentif à tes façons de recevoir 🌸` },
              { id: "cnd_096", angle: "Pour ta fête j'ai mémorisé la façon dont chaque invité a posé son manteau.", body: `16. "Pour ta fête j'ai mémorisé la façon dont chaque invité a posé son manteau."
Certains le plient soigneusement. D'autres le jettent sur le tas. Un l'a accroché lui-même. Une autre t'a demandé où le mettre. Ces manières de poser un manteau disent des choses sur les gens. C'est une première impression après la première impression. J'ai tout noté. Joyeuse fête, [mon maître/ma maîtresse].
Avec analyse des méthodes de pose de manteau et données comportementales collectées, — [Prénom animal], ton animal statisticien des premières impressions 🧥` },
              { id: "cnd_125", angle: "Joyeuse fête. J'ai observé ta façon de récupérer quand tu renverses quelque chose.", body: `5. "Joyeuse fête. J'ai observé ta façon de récupérer quand tu renverses quelque chose."
D'abord une fraction de seconde où ton visage change. Puis immédiatement la reprise. Le torchon. Le nettoyage rapide. Un mot léger pour dédramatiser. Et la soirée continue. Ce temps de réaction. Cette façon de ne pas laisser l'accident devenir un événement. C'est de la résilience appliquée. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta gestion de l'accident en moins de trente secondes, — [Prénom animal], ton animal admirateur de ta résilience pratique 💧` },
              { id: "cnd_126", angle: "Pour ta fête j'ai observé comment tu réagis quand quelqu'un fait une blague sur toi.", body: `6. "Pour ta fête j'ai observé comment tu réagis quand quelqu'un fait une blague sur toi."
Tu ris d'abord. Vraiment. Tu te laisses être le sujet de la blague sans te défendre. Puis parfois tu ajoutes quelque chose qui dit que tu t'assumes. Cette façon de ne pas se prendre au sérieux. D'accepter d'être la cible avec grâce. C'est une forme de confiance en soi que j'admire. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta grâce face aux blagues sur toi et sa signification de confiance, — [Prénom animal], ton animal admirateur de ton autodérision choisie 😄` },
              { id: "cnd_129", angle: "Joyeuse fête. J'ai observé ta façon de tenir une conversation avec quelqu'un qui t'ennuie.", body: `9. "Joyeuse fête. J'ai observé ta façon de tenir une conversation avec quelqu'un qui t'ennuie."
Tu écoutes. Tu poses des questions. Tu hoches la tête au bon moment. Mais tes yeux font de petits voyages. Ils reviennent toujours. Et à un moment tu trouves une sortie élégante. Un prétexte poli. Tu passes à autre chose sans que l'autre ne comprenne. C'est de l'art. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton art de la sortie élégante sans laisser de traces, — [Prénom animal], ton animal expert en politesse de haute précision 😌` },
              { id: "cnd_133", angle: "Joyeuse fête. J'ai observé ta façon de faire la bise à quelqu'un pour la première fois.", body: `13. "Joyeuse fête. J'ai observé ta façon de faire la bise à quelqu'un pour la première fois."
Il y en avait un ce soir. Quelqu'un que tu ne connaissais pas avant. Tu as regardé ce que l'autre faisait. Tu t'es adapté. Tu as géré la négociation non verbale du nombre de bises avec une grâce qui dit que tu l'as fait souvent. Cette adaptabilité dans un moment potentiellement maladroit. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta navigation dans la négociation des premières bises, — [Prénom animal], ton animal expert en premières fois 💋` },
              { id: "cnd_138", angle: "Pour ta fête j'ai observé comment tu réagis face à un cadeau que tu n'attendais pas du tout.", body: `18. "Pour ta fête j'ai observé comment tu réagis face à un cadeau que tu n'attendais pas du tout."
D'abord l'incompréhension sur ton visage. Puis la reconnaissance de ce que c'est. Puis quelque chose de très doux. Ce cheminement en quelques secondes. Cette façon d'être touché par quelqu'un qui t'a vraiment vu. Ces secondes-là sont les meilleures de la soirée. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation du voyage émotionnel de la surprise réussie et collection de ses secondes, — [Prénom animal], ton animal archiviste de tes expressions authentiques 🎁` },
              { id: "cnd_154", angle: "Pour ta fête j'ai observé comment tu réagis quand quelqu'un fait quelque chose de maladroit.", body: `14. "Pour ta fête j'ai observé comment tu réagis quand quelqu'un fait quelque chose de maladroit."
Tu dédramatises immédiatement. Un mot. Un geste. Parfois tu ris avec eux. Toujours tu fais en sorte que la personne ne garde pas la maladresse comme souvenir de la soirée. Cette façon de dissoudre les moments difficiles dans la chaleur de l'ensemble. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta dissolution des maladresses dans la chaleur générale, — [Prénom animal], ton animal expert en gestion de l'embarrassant 🙈` },
              { id: "cnd_157", angle: "Joyeuse fête. J'ai observé ta façon de remarquer qu'un invité s'ennuie.", body: `17. "Joyeuse fête. J'ai observé ta façon de remarquer qu'un invité s'ennuie."
Tu le vois avant les autres. Ce légèrement en retrait. Ce regard qui fait un tour de la pièce. Ces mains qui cherchent quelque chose à faire. Et tu bouges vers lui. Tu t'assures qu'il existe dans la soirée. Cette vigilance pour ceux qui sont en marge. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta vigilance pour les marges et ton mouvement vers elles, — [Prénom animal], ton animal témoin de ton inclusion silencieuse 💛` },
              { id: "cnd_158", angle: "Pour ta fête j'ai observé comment tu t'occupes de quelqu'un qui a trop bu.", body: `18. "Pour ta fête j'ai observé comment tu t'occupes de quelqu'un qui a trop bu."
Sans le signaler. Sans le mettre en difficulté. Tu lui poses une question sur quelque chose. Tu lui apportes de l'eau naturellement. Tu t'assures qu'il mange quelque chose. Tu le réintègres dans la soirée sans l'en avoir sorti. Cette façon de prendre soin sans humilier. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton soin discret sans jamais mettre quelqu'un en difficulté, — [Prénom animal], ton animal admirateur de ta grâce dans les moments délicats 💧` },
              { id: "cnd_162", angle: "Pour ta fête j'ai observé comment tu fais semblant d'aimer quelque chose que tu n'aimes pas vraiment.", body: `2. "Pour ta fête j'ai observé comment tu fais semblant d'aimer quelque chose que tu n'aimes pas vraiment."
Une fois ce soir. Quelqu'un t'a donné quelque chose qui n'était pas tout à fait ton goût. Et tu as dit quelque chose de gentil et de vrai en même temps. Tu as trouvé l'angle positif. La chose vraie dans ce que tu pouvais dire de bien. Ce n'est pas du mensonge. C'est de l'art. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton art de trouver le vrai positif dans tout, — [Prénom animal], ton animal admirateur de ta diplomatie sincère 🎨` },
              { id: "cnd_166", angle: "Pour ta fête j'ai observé comment tu réagis quand quelqu'un dit quelque chose d'inexact sur toi.", body: `6. "Pour ta fête j'ai observé comment tu réagis quand quelqu'un dit quelque chose d'inexact sur toi."
Tu souris. Tu laisses passer si ce n'est pas important. Si c'est important tu corriges doucement. Avec humour parfois. Sans que l'autre se sente attaqué. Cette façon de défendre ce qui est vrai sans créer de friction. De te représenter sans te battre. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta défense douce de la vérité sur toi-même, — [Prénom animal], ton animal témoin de ton assertivité gracieuse 🌿` },
              { id: "cnd_170", angle: "Pour ta fête j'ai observé comment tu traites quelqu'un qui dit quelque chose de maladroit.", body: `10. "Pour ta fête j'ai observé comment tu traites quelqu'un qui dit quelque chose de maladroit."
Tu ne le laisses pas dans l'embarras. Tu relances sur autre chose. Tu fais une transition qui dit que ce qui vient d'être dit n'était pas grave. Que la soirée continue. Que les gens ont le droit d'être maladroits. Cette façon de protéger les autres de leurs propres faux pas. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta protection des autres de leurs propres faux pas, — [Prénom animal], ton animal expert en sauvetages sociaux invisibles 🎭` },
              { id: "cnd_174", angle: "Pour ta fête j'ai observé comment tu réagis quand quelqu'un refuse un dessert.", body: `14. "Pour ta fête j'ai observé comment tu réagis quand quelqu'un refuse un dessert."
Tu proposes. Il dit non merci. Et tu passes à autre chose. Sans insister. Sans faire de la chose un sujet. Sans que le refus devienne une déception visible. Cette façon d'accepter les non sans en faire un problème. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton acceptation du non sans déception visible, — [Prénom animal], ton animal admirateur de ta grâce dans le refus reçu 🍮` },
            ],
          },
          {
            id: "gestes_manies",
            label: "Tes petits gestes & manies",
            messages: [
              { id: "cnd_030", angle: "Joyeuse fête. J'ai remarqué que ta voix change selon les gens.", body: `10. "Joyeuse fête. J'ai remarqué que ta voix change selon les gens."
Avec certains elle est plus haute. Plus légère. Avec d'autres plus posée. Plus sérieuse. Avec moi elle a sa propre version que tu emploies nulle part ailleurs. Plus douce. Plus lente. Avec quelque chose dedans que j'entends que là. C'est ma voix à moi. Celle que tu as développée pour moi seul. Joyeuse fête, [mon maître/ma maîtresse], dont la voix réservée à moi est la meilleure de toutes.
Avec analyse vocale complète et version personnelle identifiée comme la préférée, — [Prénom animal], ton animal propriétaire d'une voix unique au monde 🎙️` },
              { id: "cnd_072", angle: "Joyeuse fête. J'ai observé comment tu ranges après.", body: `12. "Joyeuse fête. J'ai observé comment tu ranges après."
D'abord les verres. Puis les assiettes. Tu empiles avec une méthode que tu es seul à comprendre. Tu fredonne parfois. Tu t'arrêtes pour regarder une chose et sourire à une pensée que j'entends pas. Le rangement d'après fête c'est un moment qui t'appartient. Je reste à distance. Je regarde. C'est une des versions de toi que je préfère. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation respectueuse de tes rituels post-fête et distance maintenue avec tendresse, — [Prénom animal], ton animal spectateur de tes moments solitaires 🍷` },
              { id: "cnd_076", angle: "Joyeuse fête. Ton téléphone a reçu des messages toute la journée.", body: `16. "Joyeuse fête. Ton téléphone a reçu des messages toute la journée."
Buzz après buzz. Chaque fois tu souriais en lisant. J'ai passé la journée à côté de ce téléphone qui monopolisait ton attention avec une efficacité que je trouvais injuste. J'ai fini par m'asseoir dessus. Brièvement. Pour rééquilibrer les priorités. Joyeuse fête quand même, [mon maître/ma maîtresse], dont l'attention est une ressource que je gère.
Avec rééquilibrage des priorités effectué et message envoyé sans mot, — [Prénom animal], ton animal gestionnaire de ton attention 📲` },
              { id: "cnd_079", angle: "Pour ta fête j'ai mémorisé les voix de tous ceux qui ont dit ton prénom ce soir.", body: `19. "Pour ta fête j'ai mémorisé les voix de tous ceux qui ont dit ton prénom ce soir."
Chaque voix le dit différemment. Certains avec l'accent de l'amitié longue. D'autres avec la chaleur de l'habitude. Un avec une intonation que j'avais jamais entendue et qui m'a intrigué. Ton prénom dit par dix personnes différentes c'est dix mots différents. Je les ai tous gardés. Joyeuse fête, [mon maître/ma maîtresse], dont le prénom a autant de visages.
Avec collection vocale constituée et archivée pour une durée indéterminée, — [Prénom animal], ton animal musicien des prénoms 🎙️` },
              { id: "cnd_137", angle: "Joyeuse fête. J'ai observé ta façon de poser ton verre selon les surfaces.", body: `17. "Joyeuse fête. J'ai observé ta façon de poser ton verre selon les surfaces."
Sur la table en bois tu poses avec précaution. Sur le marbre tu poses plus librement. Sur le buffet tu poses et tu vérifies la stabilité. Ces micro-décisions sur la relation entre le verre et la surface. Cette conscience du risque selon les matériaux. C'est de la physique appliquée quotidienne. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta physique appliquée du verre et ses nuances matérielles, — [Prénom animal], ton animal expert en relations verre-surface 🥂` },
              { id: "cnd_149", angle: "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui te raconte quelque chose de triste.", body: `9. "Joyeuse fête. J'ai observé ta façon de regarder quelqu'un qui te raconte quelque chose de triste."
Tu ne cherches pas à résoudre immédiatement. Tu écoutes d'abord. Vraiment. Tu laisses la tristesse exister dans la conversation. Et puis tu dis quelque chose de simple et de juste. Cette façon d'accueillir le difficile sans le fuir et sans le noyer dans des solutions. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta façon d'accueillir le difficile sans le fuir ni le noyer, — [Prénom animal], ton animal témoin de ta sagesse émotionnelle 💙` },
              { id: "cnd_156", angle: "Pour ta fête j'ai étudié ta façon de poser ta main sur la table quand tu parles.", body: `16. "Pour ta fête j'ai étudié ta façon de poser ta main sur la table quand tu parles."
Pas posée. Ancrée. Comme si la table était un point de stabilité pendant que les mots partent. Cette main posée dit que tu es là. Que ce que tu dis vient de quelque part de solide. Certains parlent avec les mains dans l'air. Toi parfois tu parles avec une main sur la table. C'est de la confiance. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta main ancrée comme point de stabilité conversationnelle, — [Prénom animal], ton animal lecteur de tes ancres 🖐️` },
              { id: "cnd_164", angle: "Pour ta fête j'ai étudié ta façon de reprendre de l'énergie entre deux conversations.", body: `4. "Pour ta fête j'ai étudié ta façon de reprendre de l'énergie entre deux conversations."
Une gorgée. Un regard vers la pièce. Une respiration un peu plus profonde. Parfois une bouchée. Ces micro-pauses de recharge. Ces moments de ravitaillement invisible avant de replonger. Cette économie de l'énergie sociale que tu gères sans y penser. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes micro-pauses de recharge et leur efficacité invisible, — [Prénom animal], ton animal expert en gestion de l'énergie sociale 🔋` },
              { id: "cnd_178", angle: "Pour ta fête j'ai observé comment tu gères le moment où plus personne ne parle.", body: `18. "Pour ta fête j'ai observé comment tu gères le moment où plus personne ne parle."
Tu ne le remplis pas tout de suite. Tu le laisses exister un moment. Tu regardes autour. Tu prends une gorgée. Tu souris sans raison. Et si le silence dure tu dis quelque chose de léger qui relance. Cette gestion des silences. Cette façon de les laisser respirer avant de les remplir. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta gestion des silences collectifs et leur espace accordé, — [Prénom animal], ton animal appréciant les respirations dans le bruit collectif 🌬️` },
              { id: "cnd_180", angle: "Pour ta fête j'ai étudié ta façon de te reposer dans ta propre fête.", body: `20. "Pour ta fête j'ai étudié ta façon de te reposer dans ta propre fête."
Tu as trouvé des moments. Courts. Assis quelque part. Une gorgée. Un regard vers rien. Quelques secondes de non-animation. Ces mini-pauses dans le flux de la soirée. Ces moments où tu existais pour toi seul au milieu de tout le monde. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de tes mini-pauses de recharge au milieu de tout le monde, — [Prénom animal], ton animal témoin de tes moments pour toi dans le collectif 🌿` },
              { id: "cnd_186", angle: "Pour ta fête j'ai observé comment tu gardes ta bonne humeur quand quelque chose ne va pas comme prévu.", body: `6. "Pour ta fête j'ai observé comment tu gardes ta bonne humeur quand quelque chose ne va pas comme prévu."
Il y en a eu deux ce soir. Deux petites choses qui n'ont pas marché comme prévu. Et chaque fois tu as ajusté. Sans que ça se voie sur ton visage pendant plus de quelques secondes. Cette capacité à absorber les imprévus et à continuer comme si. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ton absorption des imprévus en quelques secondes invisibles, — [Prénom animal], ton animal témoin de ta résilience de soirée 🔧` },
              { id: "cnd_190", angle: "Pour ta fête j'ai observé comment tu réagis quand quelqu'un complimente ton appartement.", body: `10. "Pour ta fête j'ai observé comment tu réagis quand quelqu'un complimente ton appartement."
Tu regardes l'appartement un instant. Comme si tu le voyais par leurs yeux. Avec une légère surprise. Comme si tu avais oublié ce que c'est de voir ce que tu vois tous les jours avec un regard nouveau. Puis tu remercies. Simplement. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton regard nouveau sur ton appartement par les yeux des autres, — [Prénom animal], ton animal qui te voit voir ton espace différemment 🏠` },
              { id: "cnd_194", angle: "Pour ta fête j'ai observé comment tu réagis quand quelqu'un propose d'aider sans qu'on lui demande.", body: `14. "Pour ta fête j'ai observé comment tu réagis quand quelqu'un propose d'aider sans qu'on lui demande."
Tu acceptes avec gratitude. Sans faire semblant que tu n'as pas besoin. Sans refuser par politesse. Tu laisses l'aide être une aide. Tu remercieras. Et tu intègres l'aide dans ton flux sans en faire un événement. Cette façon de recevoir la générosité avec grâce. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta façon de recevoir l'aide sans la refuser ni la surestimer, — [Prénom animal], ton animal témoin de ta grâce à recevoir 🤝` },
              { id: "cnd_209", angle: "Joyeuse fête. J'ai observé ta façon de te souvenir d'une chose importante à dire au dernier moment.", body: `9. "Joyeuse fête. J'ai observé ta façon de te souvenir d'une chose importante à dire au dernier moment."
Quelqu'un allait partir. Et tu as eu cette expression. Ce moment où quelque chose te revient. Et tu dis attends j'ai quelque chose à te dire. Et tu dis la chose. Et c'était la bonne chose à dire. Cette mémoire de dernière minute. Ce moment où ce qui comptait vraiment remontait. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta mémoire de dernière minute et sa façon de ramener ce qui compte, — [Prénom animal], ton animal admirateur de tes rappels de l'essentiel 💭` },
            ],
          },
          {
            id: "apres_fete",
            label: "Après la fête",
            messages: [
              { id: "cnd_169", angle: "Joyeuse fête. J'ai observé ta façon de ranger les chaises après la fête.", body: `9. "Joyeuse fête. J'ai observé ta façon de ranger les chaises après la fête."
Proprement. À leur place habituelle. Avec ce geste de remise en ordre. Cette façon de rendre l'appartement à son état normal. De défaire ce que la fête avait fait. Pas avec regret. Avec une certaine satisfaction. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton rangement de chaises et sa satisfaction de l'ordre retrouvé, — [Prénom animal], ton animal témoin de tes rituels de remise en ordre 🪑` },
              { id: "cnd_172", angle: "Pour ta fête j'ai étudié ta façon de fermer les fenêtres quand les invités partent.", body: `12. "Pour ta fête j'ai étudié ta façon de fermer les fenêtres quand les invités partent."
Une par une. Doucement. Comme si fermer les fenêtres c'était aussi fermer la soirée progressivement. Comme si l'air frais du dehors devait repartir avec les invités. Et l'appartement retrouver son air à lui. Sa chaleur à lui. Joyeuse fête, [mon maître/ma maîtresse].
Avec interprétation poétique de tes fenêtres fermées comme clôture progressive de la soirée, — [Prénom animal], ton animal poète de tes gestes de fin 🪟` },
              { id: "cnd_177", angle: "Joyeuse fête. J'ai observé ta façon d'ouvrir la fenêtre après la fête pour aérer.", body: `17. "Joyeuse fête. J'ai observé ta façon d'ouvrir la fenêtre après la fête pour aérer."
Grande ouverte. Pour quelques minutes. Laisser entrer l'air frais. Laisser sortir les odeurs de la soirée. Cette façon de purifier l'espace. De le préparer pour la nuit. De marquer la transition entre la fête et le silence qui suit. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton aération post-fête comme rituel de transition vers le silence, — [Prénom animal], ton animal expert en transitions atmosphériques 🌬️` },
              { id: "cnd_182", angle: "Pour ta fête j'ai observé comment tu changes de rythme quand la soirée approche de la fin.", body: `2. "Pour ta fête j'ai observé comment tu changes de rythme quand la soirée approche de la fin."
Progressivement tu ralentis. Les propositions s'espacent. Les conversations deviennent plus intimes. Moins de monde à la fois. Plus de profondeur par groupe. Cette façon de laisser la soirée se concentrer naturellement vers sa fin. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ta décélération progressive et de sa naturalité, — [Prénom animal], ton animal admirateur de tes fins de soirée organiques 🌙` },
              { id: "cnd_196", angle: "Pour ta fête j'ai étudié ta façon de choisir où mettre les fleurs reçues.", body: `16. "Pour ta fête j'ai étudié ta façon de choisir où mettre les fleurs reçues."
Tu les tiens. Tu regardes la pièce. Tu essaies mentalement plusieurs endroits. Puis tu choisis. Avec une précision qui dit que tu as une vision de comment les choses s'intègrent. Cette façon de trouver la place de ce qui vient d'arriver dans ce qui existait déjà. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton processus de placement des fleurs et sa logique d'intégration, — [Prénom animal], ton animal expert en placement des nouveautés dans l'existant 🌺` },
              { id: "cnd_213", angle: "Joyeuse fête. J'ai observé ta façon de regarder l'heure sans que ça se voie.", body: `13. "Joyeuse fête. J'ai observé ta façon de regarder l'heure sans que ça se voie."
Un regard rapide. Vers le téléphone ou l'heure quelque part. Tête pas vraiment tournée. Juste les yeux. Puis retour à la conversation. Cette façon de vérifier le temps sans l'annoncer. Sans interrompre. Cette discrétion temporelle. Ce soir j'ai compté quatre fois. Joyeuse fête, [mon maître/ma maîtresse].
Avec quatre regards discrets vers l'heure comptés et leur signification de gestion du temps, — [Prénom animal], ton animal observateur de tes vérifications invisibles ⌚` },
              { id: "cnd_217", angle: "Joyeuse fête. J'ai observé ta façon de ranger ton tablier avec soin à la fin.", body: `17. "Joyeuse fête. J'ai observé ta façon de ranger ton tablier avec soin à la fin."
Plié. Proprement. À sa place. Pas jeté. Pas froissé. Ce soin pour quelque chose qui a travaillé ce soir. Cette façon de ranger l'outil avec respect après qu'il t'a servi. Joyeuse fête, [mon maître/ma maîtresse].
Avec observation de ton soin pour le tablier qui t'a servi et ce qu'il dit de toi, — [Prénom animal], ton animal attentif à ta façon de traiter les choses qui ont travaillé pour toi 👨‍🍳` },
              { id: "cnd_218", angle: "Pour ta fête j'ai observé comment tu te souviens de détails sur chaque invité.", body: `18. "Pour ta fête j'ai observé comment tu te souviens de détails sur chaque invité."
Tu t'en souviens. Du prénom de leur enfant. De leur situation de travail. De quelque chose qu'ils t'avaient dit la dernière fois. Et tu le places dans la conversation naturellement. Cette mémoire affective. Cette façon de dire à chacun tu m'importes assez pour que je me souvienne. Joyeuse fête, [mon maître/ma maîtresse].
Avec admiration pour ta mémoire affective des détails de chaque personne, — [Prénom animal], ton animal témoin de ton attention aux autres dans le temps 🧠` },
            ],
          },
        ],
      },
    ],
  },
};

export function getLibraryKey(petType: string, occasion: string): LibraryKey | null {
  if ((petType === 'chien' || petType === 'chat') && (occasion === 'birthday' || occasion === 'nameday')) {
    return `${petType}_${occasion}` as LibraryKey;
  }
  return null;
}

export function getLibraryMessageCount(key: LibraryKey): number {
  const lib = PET_MESSAGE_LIBRARY[key];
  let total = 0;
  for (const theme of lib.themes) total += theme.count;
  return total;
}
