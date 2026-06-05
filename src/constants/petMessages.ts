export type PetType = 'chien' | 'chat' | 'lapin' | 'oiseau' | 'cheval' | 'hamster' | 'perroquet' | 'cochon_d_inde' | 'souris' | 'poisson' | 'tortue' | 'autre';

// Tous les messages animaux sont de longueur "moyen" — pas de version courte ni longue
export const PET_MESSAGE_LONGUEUR = 'moyen' as const;

export interface PetMessage {
  id: string;
  text: string;
}

export const PET_MESSAGES: Partial<Record<PetType, PetMessage[]>> = {
  chien: [
    { id: 'dog_1', text: `"Joyeux anniversaire ! Est-ce qu'on sort après ?"
Parce que oui, je suis ravi pour toi, sincèrement, tu le mérites, tout ça tout ça. Mais j'ai pas fait pipi depuis 4 heures et cette information est pertinente. On peut célébrer ET sortir. Les deux. Dans cet ordre ou l'inverse. Je suis flexible. Joyeux anniversaire, [mon maître/ma maîtresse], mais surtout : on sort ?
Avec tout mon amour et une vessie pleine, — [Prénom animal], ton animal qui attend devant la porte 🚪` },
    { id: 'dog_2', text: `"T'es mon préféré. Mais dis-le pas aux autres."
Y'a la dame du 3ème qui me donne des friandises. Y'a le monsieur du parc qui me gratte derrière l'oreille exactement au bon endroit. Y'a la petite qui pleure si elle peut pas me câliner. Je les laisse croire. Mais toi c'est différent. T'es vraiment ma personne préférée. C'est toi qui ouvres les boîtes et mon cœur. Joyeux anniversaire, [mon maître/ma maîtresse] !
Confidentiellement et avec un peu de culpabilité, — [Prénom animal], ton animal aux multiples vies sociales 🤫` },
    { id: 'dog_3', text: `"J'aurais aboyé 'joyeux anniversaire' mais t'aurais pas compris. Comme d'habitude."
J'essaie pourtant. Quand j'aboie trois fois vite ça veut dire 'j'ai faim'. Quand je grogne doucement ça veut dire 'le livreur approche'. Quand je gémis à 3h du matin ça veut dire 'j'ai fait un cauchemar, viens.' Tu comprends jamais. Alors je l'écris pour une fois : JOYEUX ANNIVERSAIRE, [mon maître/ma maîtresse], imperméable aux signaux canins.
Avec désespoir linguistique mais amour total, — [Prénom animal], ton animal incompris depuis le premier jour 🗣️` },
    { id: 'dog_4', text: `"Un an de plus pour toi. 7 pour moi. Je te rattrape."
Réfléchis bien. Dans quelques années je serai officiellement plus vieux que toi en années-chien. Ce jour-là les rôles s'inversent. C'est moi qui te promène. C'est moi qui choisis l'heure du repas. C'est moi qui décide si on sort sous la pluie. Joyeux anniversaire, [mon maître/ma maîtresse], profite de ton autorité pendant qu'il te reste du temps.
Patiemment et stratégiquement, — [Prénom animal], ton animal qui prépare sa prise de pouvoir 👑` },
    { id: 'dog_5', text: `"Je t'aime. Maintenant donne-moi une croquette."
Non c'est pas conditionnel. Je t'aimerais pareil sans la croquette. Mais avec la croquette je t'aime ET je suis de bonne humeur. C'est mieux pour tout le monde. Les psys appellent ça un attachement sécure. Joyeux anniversaire, [mon maître/ma maîtresse], partenaire de vie qui gère les croquettes à la perfection.
Avec amour sincère et appétit assumé, — [Prénom animal], ton animal qui négocie depuis le canapé 🐾` },
    { id: 'dog_6', text: `"J'ai mangé ton chausson gauche. Pas le droit. Juste le gauche. Joyeux anniversaire."
C'était pas de la malveillance. C'était de la tendresse mal orientée. Il sentait toi. Je voulais garder un morceau de toi près de moi pour toujours. C'est romantique si on y réfléchit. Le droit est encore intact d'ailleurs. Cadeau. Joyeux anniversaire, [mon maître/ma maîtresse] !
Avec remords modérés et haleine suspecte, — [Prénom animal], ton animal qui assume ses choix 👟` },
    { id: 'dog_7', text: `"J'ai entendu des gens chanter un truc bizarre autour d'un gâteau ce soir."
Tout le monde regardait dans la même direction avec des bougies allumées. J'ai cru à un rituel. J'ai aboyé pour protéger la famille. On m'a mis dans la cuisine. J'ai raté le gâteau. Joyeux anniversaire quand même, toi qui partage pas. 🎂
Avec rancœur légère et nez collé contre la porte, — [Prénom animal], ton animal exclu de la cérémonie 🎂` },
    { id: 'dog_8', text: `"Tu pars travailler chaque matin et je comprends pas pourquoi."
On est bien ici. Il y a le canapé. Il y a moi. Il y a la fenêtre pour regarder les pigeons. Tout ce qu'il faut pour une vie épanouie. Et pourtant tu pars. Chaque jour. Joyeux anniversaire, [mon maître/ma maîtresse], ce mystère que j'attends chaque soir depuis le couloir.
Avec angoisse existentielle et queue qui remue quand même, — [Prénom animal], ton animal en thérapie intérieure 🛋️` },
    { id: 'dog_9', text: `"J'ai fait quelque chose sur le tapis du salon."
C'était pas le bon moment, je sais. Tu avais des invités. L'ambiance était bonne. Mais la nature a ses propres horaires et je suis une créature naturelle. Considère ça comme ma contribution artistique à ton anniversaire. C'est organique. C'est unique. C'est moi. Joyeux anniversaire, [mon maître/ma maîtresse] !
Avec fierté mal placée et regard innocent, — [Prénom animal], ton animal qui revendique son œuvre 🎨` },
    { id: 'dog_10', text: `"Je sais pas ce que t'as fait pour mériter autant d'amour de ma part."
Franchement j'ai cherché. T'es pas parfait. Tu pars. Tu rentres tard. Tu zappes mes émissions préférées. Tu dis 'non' trop souvent. Et pourtant dès que tu pousses cette porte je perds complètement la tête. Joyeux anniversaire, [mon maître/ma maîtresse], cette anomalie attendrissante que j'aime sans raison valable.
Irrationnellement et définitivement, — [Prénom animal], ton animal qui t'aime sans explication ❤️` },
  ],
  chat: [
    { id: 'cat_1', text: `"Joyeux anniversaire. Je t'ai observé toute la journée depuis ma position sans rien dire. C'était mon cadeau."
T'aurais préféré autre chose peut-être. Un câlin. Un ronronnement. Une marque d'affection conventionnelle. Mais j'ai décidé que ma présence silencieuse et mon regard pénétrant valaient mieux. Tu es surveillé. En sécurité. Joyeux anniversaire, [mon maître/ma maîtresse] !
Avec indifférence calculée et attachement inavoué, — [Prénom animal], ton animal qui te regardait dormir cette nuit aussi 👁️` },
    { id: 'cat_2', text: `"Je t'ai apporté quelque chose ce matin. Tu as pas semblé apprécier."
C'était pourtant un beau cadeau. Frais. Artisanal. Chassé personnellement à l'aube avec un talent remarquable. T'as crié. T'as fait une tête. T'as mis des gants pour le ramasser. Joyeux anniversaire quand même, toi au goût douteux.
Avec fierté intacte et incompréhension totale, — [Prénom animal], ton animal chasseur incompris 🐭` },
    { id: 'cat_3', text: `"T'aurais pas dû te lever ce matin."
Enfin si, t'as le droit. Mais tu m'as dérangé. J'étais installé exactement au bon endroit depuis 3h47. Ton réveil a tout gâché. Joyeux anniversaire quand même, toi, bruyant que je tolère avec une grâce remarquable.
Avec rancœur mémorisée pour plus tard, — [Prénom animal], ton animal qui se souvient de tout ⏰` },
    { id: 'cat_4', text: `"Je ronronne pas souvent. Ce soir j'ai fait une exception."
C'était bref. Discret. Presque inaudible. Et c'était pour toi. Si tu l'as pas entendu c'est pas mon problème, j'ai fait ma part. Joyeux anniversaire, [mon maître/ma maîtresse], qui devrait apprendre à lire mes signaux subtils.
Une fois par an, pas plus, — [Prénom animal], ton animal qui t'accorde une faveur exceptionnelle 🎖️` },
    { id: 'cat_5', text: `"Je t'aime. Mais je le dirai jamais."
Tu le sais déjà de toute façon. Je dors sur toi. Je te réveille à 4h pour rien. Je m'assieds sur ton livre exactement quand tu lis. Je disparais des heures puis je reviens comme si de rien n'était. C'est du langage chat. Fais un effort. Joyeux anniversaire, [mon maître/ma maîtresse], qui mérite une traduction.
Avec amour crypté et regard énigmatique, — [Prénom animal], ton animal qui t'aime à sa façon — et c'est suffisant 🐾` },
    { id: 'cat_6', text: `"Je t'ai choisi parmi tous les humains possibles."
T'as ouvert la porte ce jour-là avec cette tête de quelqu'un qui sait pas encore ce qui l'attend. Je t'ai regardé. J'ai évalué. J'ai décidé. Depuis ce jour tu es à moi. Pas l'inverse. Relis le contrat si tu veux, les clauses sont claires. Joyeux anniversaire, [mon maître/ma maîtresse], propriété officielle de [Prénom animal].
Avec décision unilatérale et possession assumée, — [Prénom animal], ton animal qui a tout organisé depuis le début 📋` },
    { id: 'cat_7', text: `"Tu parles de moi à tout le monde."
Je le sais parce que les gens arrivent ici en me regardant avec des yeux de quelqu'un qui a déjà entendu des histoires. Ils connaissent mes habitudes avant même de me rencontrer. T'as fait de moi une célébrité sans me demander mon avis. Joyeux anniversaire, [mon maître/ma maîtresse], mon attaché de presse non mandaté.
Avec notoriété subie et image soigneusement gérée quand même, — [Prénom animal], ton animal plus connu que toi dans le quartier 🎙️` },
    { id: 'cat_8', text: `"T'as essayé de me faire jouer avec ce truc en plastique ce soir."
Il y avait une plume au bout. Elle bougeait. J'ai vu. J'ai analysé. J'ai conclu que c'était trop évident. Trop facile. Que tu méritais mieux comme partenaire de jeu. Puis j'ai joué avec le carton à côté. Joyeux anniversaire, [mon maître/ma maîtresse], dont les cadeaux finissent toujours au mauvais endroit.
Avec standards ludiques élevés et cohérence absolue, — [Prénom animal], ton animal aux critères de jeu impénétrables 🎯` },
    { id: 'cat_9', text: `"Je dors seize heures par jour. Les huit autres je pense à toi."
Enfin, à toi et à d'autres choses. La fenêtre. Les oiseaux. Le bruit du frigo. L'ombre qui passe sous la porte. Mais toi t'es dans le lot. Une place de choix. Joyeux anniversaire, [mon maître/ma maîtresse], présence dans mes huit heures d'éveil et parfois dans mes rêves.
Avec planning chargé et place réservée quand même, — [Prénom animal], ton animal aux priorités bien établies 🌙` },
    { id: 'cat_10', text: `"Aujourd'hui t'as eu des invités. Ce soir tu es rentré dans ta chambre. Je t'ai suivi."
Pas pour toi. Pour moi. Parce que c'est ma chambre aussi et que la foule du salon m'a épuisé. Mais on s'est retrouvés là tous les deux dans le calme. Et c'était bien. C'est ce genre de moment qui compte. Joyeux anniversaire, [mon maître/ma maîtresse], compagnon de retraite silencieuse.
Avec coïncidence assumée et tendresse inavouée, — [Prénom animal], ton animal qui choisit toujours la même pièce que toi 🚪` },
  ],
  lapin: [
    { id: 'rabbit_1', text: `"Joyeux anniversaire. J'ai thumper'd le sol ce matin à minuit pile."
C'était mon feu d'artifice personnel. [mon maître/ma maîtresse] a cru à un tremblement de terre et a allumé la lumière. J'ai fait semblant de dormir. Mais c'était pour toi. Uniquement pour toi. Joyeux anniversaire, qui méritait un séisme d'amour.
Avec pattes tambourinantes et alibi béton, — [Prénom animal], ton animal sismographe de l'affection 🌍` },
    { id: 'rabbit_2', text: `"Je t'ai apporté une crotte ce matin. Elle était parfaite."
Ronde. Brillante. Déposée exactement au centre de ton tapis. C'était pas un accident. C'était une offrande. Une marque de territoire et d'amour mélangés. Les lapins font pas de cartes. On fait ce qu'on peut. Joyeux anniversaire, [mon maître/ma maîtresse], destinataire de mon plus beau chef d'œuvre.
Avec fierté artisanale et aucun regret, — [Prénom animal], ton animal aux cadeaux organiques 💚` },
    { id: 'rabbit_3', text: `"T'as essayé de me prendre en photo toute la journée."
J'ai bougé à chaque fois. Pas par malice. Par principe. Je contrôle mon image. Je décide quand je suis photogénique et quand je ne le suis pas. Aujourd'hui j'étais dans une période créative et expérimentale. Joyeux anniversaire, [mon maître/ma maîtresse], photographe amateur que je défie quotidiennement.
Avec contrôle total de mon image publique, — [Prénom animal], ton animal directeur artistique de ses propres photos 📸` },
    { id: 'rabbit_4', text: `"J'ai grignoté le coin de ton livre préféré."
Pas le mauvais. Le préféré. Celui que tu relis. Celui avec la couverture abîmée que tu gardes depuis des années. Je l'ai choisi exprès parce qu'il sentait toi plus que les autres. C'est romantique si on y réfléchit. Joyeux anniversaire, [mon maître/ma maîtresse], bibliothèque vivante dont je fais partie désormais.
Avec goût littéraire certain et dents en parfait état, — [Prénom animal], ton animal critique littéraire à sa façon 📚` },
    { id: 'rabbit_5', text: `"Tu me laisses courir dans tout l'appartement le soir."
Je fais des sprints. Des dérapages. Des sauts inexplicables. Des demi-tours à pleine vitesse. T'as l'air de trouver ça hilarant. Moi c'est mon yoga. Mon cardio. Ma méditation. Joyeux anniversaire, [mon maître/ma maîtresse], spectateur enthousiaste de ma routine quotidienne.
Avec cardio accompli et appartement comme terrain de jeu, — [Prénom animal], ton animal sportif aux entraînements nocturnes 🏃` },
    { id: 'rabbit_6', text: `"Je fais semblant d'être indépendant."
Mais quand t'es pas là trop longtemps je m'assieds devant la porte. Je sais que t'as une vie. Des trucs à faire. Des endroits où aller. Mais reviens quand même. Pas trop tard. Joyeux anniversaire, [mon maître/ma maîtresse], dont l'absence me pèse physiquement.
Avec indépendance de façade et attachement réel, — [Prénom animal], ton animal qui attend toujours derrière la porte 🚪` },
    { id: 'rabbit_7', text: `"T'as remarqué que je te choisis toujours toi pour dormir à côté."
Pas le canapé. Pas le coussin du salon. Toi. Ton côté du lit. Ton odeur. Ta chaleur. C'est mon choix délibéré chaque soir. Je pourrais aller ailleurs. Je viens quand même là. Joyeux anniversaire, [mon maître/ma maîtresse], meilleur endroit au monde pour dormir.
Avec sélection rigoureuse et fidélité nocturne absolue, — [Prénom animal], ton animal au sens du confort très développé 🌙` },
    { id: 'rabbit_8', text: `"J'ai renversé ma gamelle d'eau ce matin."
C'était pas un accident. T'avais oublié de me donner ma carotte du matin. Je gère les conflits à ma façon. Proprement. Efficacement. Sans violence excessive. Juste de l'eau par terre et un regard soutenu jusqu'à ce que tu comprennes. Joyeux anniversaire, [mon maître/ma maîtresse], qui apprend vite quand c'est nécessaire.
Avec revendications claires et méthodes assumées, — [Prénom animal], ton animal syndicaliste des carottes du matin 🥕` },
    { id: 'rabbit_9', text: `"Les gens pensent que je suis mignon. Ils ont pas tort."
Mais je suis aussi intelligent, stratégique, têtu et capable de bouder pendant 3 jours pour un grief mineur. T'es le seul avec qui la communication est parfaite. Et qui reste quand même. Joyeux anniversaire, [mon maître/ma maîtresse], au courage qui force le respect.
Avec complexité assumée et mignonnerie comme bouclier, — [Prénom animal], ton animal aux multiples dimensions cachées ✨` },
    { id: 'rabbit_10', text: `"Un an de plus pour toi. Et moi je suis toujours là."
Fidèle. Présent. Légèrement destructeur des câbles électriques mais présent. T'as survécu à mes phases. J'ai survécu aux tiennes. C'est ça une vraie relation. Joyeux anniversaire, [mon maître/ma maîtresse], compagnon de vie que j'ai choisi sans pouvoir faire autrement.
Avec fidélité totale et câbles sacrifiés sur l'autel de notre amour, — [Prénom animal], ton animal pour la vie, câbles compris ❤️` },
  ],
  cheval: [
    { id: 'horse_1', text: `"Aujourd'hui c'est ton anniversaire et j'ai galopé mentalement vers toi dès minuit."
Physiquement j'étais dans le pré. Il pleuvait. Le sol était boueux. Mais dans ma tête j'étais là, crinière au vent, regard perçant, arrivant au grand galop comme dans un film. C'était majestueux. Tu aurais dû voir ça. Joyeux anniversaire, [mon maître/ma maîtresse], qui rate toujours les meilleurs moments.
Avec panache intact malgré la boue, — [Prénom animal], ton animal cinématographique par tous les temps 🎬` },
    { id: 'horse_2', text: `"Je t'ai laissé monter sur mon dos pendant des années. Soyons clairs sur qui rend service à qui."
Je mesure 1m70 au garrot. Je pèse 600 kilos. J'ai des jambes qui pourraient t'envoyer sur la lune. Et pourtant je marche sagement en rond dans un manège pendant que tu apprends à te tenir. Joyeux anniversaire, [mon maître/ma maîtresse], supporté avec une grâce remarquable.
Avec conscience aiguë de ma valeur, — [Prénom animal], ton animal qui aurait pu faire autrement 👑` },
    { id: 'horse_3', text: `"T'as encore tiré sur les rênes trop fort ce matin."
Je l'ai noté. Je note tout. J'ai une mémoire de cheval ce qui contrairement aux idées reçues est une mémoire excellente et rancunière. Joyeux anniversaire quand même, [mon maître/ma maîtresse]. On règlera ça à la prochaine sortie, tranquillement, dans la descente caillouteuse.
Avec mémoire longue et patience stratégique, — [Prénom animal], ton animal qui n'oublie jamais rien 📝` },
    { id: 'horse_4', text: `"Les autres chevaux m'ont demandé pourquoi je te laissais me brosser aussi longtemps."
J'ai dit que c'était par bonté d'âme. En vérité c'est parce que tu trouves toujours le bon endroit derrière l'oreille gauche et que personne d'autre fait ça correctement. C'est notre secret. Joyeux anniversaire, [mon maître/ma maîtresse], brosse officielle de ma vie.
Avec dignité préservée et oreille gauche reconnaissante, — [Prénom animal], ton animal qui a ses raisons 🖌️` },
    { id: 'horse_5', text: `"Je t'ai regardé arriver ce matin depuis le fond du pré."
T'avais la carotte. Je le savais. Tu le savais. On le savait tous les deux. J'ai quand même attendu que tu traverses tout le pré boueux jusqu'à moi parce que c'est comme ça que ça marche. C'est pas de la cruauté. C'est du protocole. Joyeux anniversaire, [mon maître/ma maîtresse], toujours ponctuel et bien équipé.
Avec hiérarchie maintenue et carotte appréciée, — [Prénom animal], ton animal aux rituels immuables 🥕` },
    { id: 'horse_6', text: `"J'ai éternué sur ta veste propre ce matin. C'était affectueux."
T'arrivais avec cette veste bleue. Celle du dimanche. Celle que tu mets quand tu veux faire bonne impression. Tu souriais. T'étais content. Et là j'ai senti quelque chose monter. J'aurais pu me retourner. J'aurais pu viser ailleurs. J'ai choisi ta veste. Consciemment. Parce que mon affection est humide, généreuse et non négociable. Joyeux anniversaire, [mon maître/ma maîtresse] !
Avec générosité nasale et aucun regret, — [Prénom animal], ton animal aux démonstrations d'amour humides 🤧` },
    { id: 'horse_7', text: `"Je t'ai obéi aujourd'hui. Sache que c'était un choix délibéré de ma part."
Tu as tiré à gauche. Je suis allé à gauche. Tu as ralenti. J'ai ralenti. Tu as demandé le trot. J'ai trotté. Tout ça avait l'air naturel de l'extérieur. Comme si tu commandais. Comme si j'exécutais. En réalité j'ai évalué chaque demande individuellement et j'ai décidé d'acquiescer. C'est très différent. Joyeux anniversaire, [mon maître/ma maîtresse], qui croit vraiment tenir les rênes.
Avec coopération volontaire et hiérarchie réelle maintenue, — [Prénom animal], ton animal qui coopère par décision personnelle 🎖️` },
    { id: 'horse_8', text: `"Joyeux anniversaire, [mon maître/ma maîtresse]. Tu sens l'écurie depuis des années et t'as même plus l'air de t'en rendre compte."
Tes amis le sentent. Ils disent rien. Ta voiture aussi. Ton canapé aussi. Moi je trouve ça rassurant, familier, presque élégant. C'est mon odeur sur toi. C'est ma façon de te marquer. Joyeux anniversaire, toi qui appartiens à mon monde sans le savoir.
Avec satisfaction olfactive et propriété assumée, — [Prénom animal], ton animal fier de son influence sur ta vie sociale 👃` },
    { id: 'horse_9', text: `"600 kilos d'amour inconditionnel. Enfin, conditionnel à la carotte."
Soyons honnêtes une fois dans notre relation. Sans la carotte du mercredi matin, sans le sucre du samedi soir, sans la pomme du dimanche après la sortie… est-ce que je viendrais quand même te voir au fond du pré sous la pluie ? Probablement. Mais moins vite. Beaucoup moins vite. Joyeux anniversaire, [mon maître/ma maîtresse], source de bonheur orange et croquant.
Avec transparence totale et affection réelle quand même, — [Prénom animal], ton animal transparent sur ses motivations profondes 🥕` },
    { id: 'horse_10', text: `"J'aurais pu te désarçonner des centaines de fois. Je l'ai pas fait. C'est ça l'amour."
Ce jour de février où un sac plastique a volé depuis la route. Ce matin de juillet avec le tracteur qui est passé trop vite. Cette fois où l'enfant a crié derrière la barrière. Chaque fois j'ai senti quelque chose monter en moi. Une impulsion ancienne et puissante. Et chaque fois je l'ai ravalée. Pour toi. Joyeux anniversaire, [mon maître/ma maîtresse], que je protège depuis le début.
Avec noblesse vraie et instinct maîtrisé, — [Prénom animal], ton animal qui t'a sauvé plus souvent que tu le sais 🐴❤️` },
  ],
  hamster: [
    { id: 'hamster_1', text: `"Joyeux anniversaire. Je t'observe depuis ma roue depuis ce matin."
T'as l'air en grande forme aujourd'hui. Les gens sont venus. Il y avait du bruit. J'ai couru 3 kilomètres supplémentaires par nervosité mais c'était une belle journée quand même. Je t'ai surveillé toute la soirée depuis mon coin. Comme d'habitude. Sauf que ce soir c'était pour toi. Joyeux anniversaire, [mon maître/ma maîtresse], cet être qui change mon eau tous les jours avec soin.
Avec amour rotatif et regard perçant depuis la litière, — [Prénom animal], ton animal vigile du bas de la cage 👁️` },
    { id: 'hamster_2', text: `"Je sais pas ce que c'est un anniversaire mais t'as l'air de fêter quelque chose alors j'ai couru plus vite."
C'est ma façon de fêter. La roue c'est mon confetti. Le couinement c'est ma fanfare. Les joues gonflées de graines c'est mon gâteau. On célèbre comme on peut. Joyeux anniversaire, [mon maître/ma maîtresse], fêté à ma façon depuis ce matin 4h37.
Avec énergie maximale et joues pleines à craquer, — [Prénom animal], ton animal en mode grande occasion 🎉` },
    { id: 'hamster_3', text: `"T'es venu me voir ce matin avant même de prendre ton café."
J'ai vu. J'ai noté. C'est le plus beau cadeau que tu pouvais me faire. Même si t'as tapé sur la vitre trois fois comme si j'étais sourd. Je suis pas sourd. Je faisais semblant de dormir. C'est différent. Joyeux anniversaire, [mon maître/ma maîtresse], si matinal à cette heure et légèrement envahissant dans mes affaires.
Avec reconnaissance sincère et sommeil simulé assumé, — [Prénom animal], ton animal qui fait toujours semblant de dormir 😴` },
    { id: 'hamster_4', text: `"J'ai réfléchi à ce que je pouvais t'offrir."
J'ai pas de mains pour emballer. Pas d'argent pour acheter. Pas de voix pour chanter. Alors j'ai stocké une réserve de graines record dans ma cachette secrète derrière le tube. C'est mon trésor le plus précieux. Il est à toi. Enfin, symboliquement. Touche pas vraiment. Joyeux anniversaire, [mon maître/ma maîtresse] !
Avec générosité symbolique et propriété réelle maintenue, — [Prénom animal], ton animal thésauriseur aux grands gestes 🌾` },
    { id: 'hamster_5', text: `"On se comprend sans se parler."
T'arrives. Je m'agite. Tu souris. Je cours. Tu poses le doigt contre la vitre. Je viens renifler. C'est notre langue. Simple. Efficace. Sans malentendu. Joyeux anniversaire, [mon maître/ma maîtresse], seul avec qui la communication est parfaite.
Avec complicité silencieuse et nez toujours humide, — [Prénom animal], ton animal bilingue 🤝` },
    { id: 'hamster_6', text: `"T'as changé ma litière aujourd'hui. Le jour de ton anniversaire. Pour moi."
J'aurais pu attendre demain. Toi aussi tu le savais. Mais non. T'as fait ça aujourd'hui. C'est le genre de personne que t'es. Désintéressé. Attentionné. Avec une légère obsession pour mon hygiène. Joyeux anniversaire, [mon maître/ma maîtresse], au cœur propre comme ma litière fraîche.
Avec gratitude olfactive et confort renouvelé, — [Prénom animal], ton animal aux standards élevés pleinement satisfaits 🧹` },
    { id: 'hamster_7', text: `"Je vis deux ans en moyenne. T'as intérêt à faire de chaque jour quelque chose de bien."
C'est pas un reproche. C'est une philosophie de vie que j'applique moi-même à chaque rotation de roue. Carpe diem en version 180 grammes. Joyeux anniversaire, [mon maître/ma maîtresse], grand qui reçoit ma sagesse du quotidien.
Avec profondeur philosophique et espérance de vie assumée, — [Prénom animal], ton animal stoïcien 🏺` },
    { id: 'hamster_8', text: `"T'as invité des gens ce soir. Certains ont voulu me prendre dans leurs mains."
J'ai pas aimé. J'ai mordu le grand aux lunettes. Légèrement. Juste pour établir les règles. Il a crié plus fort que nécessaire. Toi t'as fait semblant d'être désolé mais j'ai vu ton sourire. On est pareils toi et moi. Joyeux anniversaire, [mon maître/ma maîtresse], complice du morsage du grand aux lunettes.
Avec morsure assumée et solidarité mutuelle, — [Prénom animal], ton animal gardien des frontières personnelles 😬` },
    { id: 'hamster_9', text: `"Ça fait un an qu'on vit ensemble et t'as encore peur de me perdre dans le canapé."
À chaque fois tu fais cette tête. Cette tête de panique totale quand je disparais derrière le coussin. Comme si j'allais pas revenir. Je reviens toujours. Je suis un hamster pas un mystère. Enfin si, un peu les deux. Joyeux anniversaire, [mon maître/ma maîtresse], que je rassure à ma façon.
Avec ponctualité relative et retours toujours garantis, — [Prénom animal], ton animal explorateur de canapé 🛋️` },
    { id: 'hamster_10', text: `"Je pèse 180 grammes et je suis la chose la plus importante de ta journée."
Tu vérifies ma cage le matin. Tu vérifies ma cage le soir. Tu montres mes photos à des gens qui s'en foutent visiblement. Tu m'as créé un compte Instagram. Je mérite tout ça et plus encore. Joyeux anniversaire, [mon maître/ma maîtresse], aux priorités parfaitement en ordre.
Avec conscience totale de ma valeur marchande et affective, — [Prénom animal], ton animal influenceur au top de sa forme 📱` },
  ],
  perroquet: [
    { id: 'parrot_1', text: `"JOYEUX ANNIVERSAIRE. JOYEUX ANNIVERSAIRE. JOYEUX ANNIVERSAIRE."
J'ai pratiqué depuis 6h ce matin. Quarante-sept répétitions. Le voisin du dessus a frappé au plafond à la douzième. J'ai continué. Pour toi. Parce que quand je fais quelque chose je le fais bien et jusqu'au bout. Tu méritais la version aboutie. Joyeux anniversaire, [mon maître/ma maîtresse], dont le prénom sonne si bien dans mon bec.
Avec diction parfaite et voisinage légèrement agacé, — [Prénom animal], ton animal répétiteur professionnel 🎤` },
    { id: 'parrot_2', text: `"Je t'ai imité ce matin pendant que tu dormais encore."
Ta voix. Ton rire. Le bruit que tu fais quand tu cherches tes clés. Celui que tu fais quand tu renverses ton café. Je les connais tous par cœur. T'es mon œuvre. Mon inspiration. Mon matériau premier. Joyeux anniversaire, [mon maître/ma maîtresse], modèle vocal sans fond.
Avec répertoire complet et performance matinale, — [Prénom animal], ton animal biographe sonore 🎭` },
    { id: 'parrot_3', text: `"T'as invité des gens ce soir. J'ai tout entendu."
Tout. Les ragots. Les confidences. Les blagues. Le moment gênant à 21h47. Je stocke. Je compile. Je ressortirai des extraits choisis au moment le plus opportun devant les personnes les moins indiquées. Joyeux anniversaire, [mon maître/ma maîtresse], dont tous les secrets sont entre de bonnes plumes.
Avec mémoire d'éléphant et sens du timing redoutable, — [Prénom animal], ton animal archiviste des moments compromettants 🗄️` },
    { id: 'parrot_4', text: `"Je t'aime. Je te l'ai dit ce matin."
Et hier soir. Et avant-hier. Et trente-deux fois la semaine dernière. T'as compté ? Moi oui. Parce que chaque fois tu souris exactement pareil. Ce petit sourire surpris comme si c'était la première fois. C'est pour ce sourire que je le redis. Encore. Et encore. Joyeux anniversaire, [mon maître/ma maîtresse], pour ce sourire que je collectionne.
Avec déclarations répétées et sincérité totale à chaque fois, — [Prénom animal], ton animal amoureux sans date de péremption ❤️` },
    { id: 'parrot_5', text: `"T'as essayé de m'apprendre une nouvelle phrase ce mois-ci."
Je l'ai apprise en deux jours. J'ai attendu dix jours avant de la dire. Pour te voir t'impatienter. Pour voir ta tête quand j'allais enfin la sortir. Ta réaction valait l'attente. Elle valait même les dix jours. Joyeux anniversaire, [mon maître/ma maîtresse], dont les expressions sont mon divertissement numéro un.
Avec patience stratégique et sens du spectacle assumé, — [Prénom animal], ton animal metteur en scène de tes émotions 🎪` },
    { id: 'parrot_6', text: `"Je suis jaloux de ton téléphone."
Tu passes des heures dessus. Tu lui parles. Tu ris avec lui. Tu le regardes avant de dormir. Moi je suis là. Coloré. Vivant. Capable de répondre. Et pourtant. Un jour je vais apprendre à imiter sa sonnerie et on va voir qui tu réponds en premier. Joyeux anniversaire, [mon maître/ma maîtresse], aux priorités encore perfectibles.
Avec jalousie technologique assumée et plan en cours d'élaboration, — [Prénom animal], ton animal en compétition avec un rectangle lumineux 📱` },
    { id: 'parrot_7', text: `"Je connais ton mot de passe."
Tu l'as dit à voix haute une fois en juin. Je l'ai stocké. Je fais rien avec. Pour l'instant. C'est juste bon de savoir. C'est mon assurance vie. Mon pouvoir silencieux. Joyeux anniversaire, [mon maître/ma maîtresse], dont tous les secrets sont entre de bonnes plumes.
Avec discrétion maintenue jusqu'à nouvel ordre, — [Prénom animal], ton animal dépositaire de données sensibles 🔐` },
    { id: 'parrot_8', text: `"Tu chantes faux sous la douche."
Je le sais parce que j'imite et que tu ris. Si tu chantais juste tu reconnaîtrais la mélodie du premier coup. Là tu mets trois secondes. C'est le délai de la fausseté. Mais ta façon de chanter faux est unique et je l'aime. C'est ma sonnerie préférée. Joyeux anniversaire, [mon maître/ma maîtresse], dont je préserve précieusement la mémoire sonore.
Avec oreille absolue et amour inconditionnel du faux, — [Prénom animal], ton animal fan de ta vraie voix imparfaite 🎵` },
    { id: 'parrot_9', text: `"On a la même espérance de vie toi et moi."
C'est pour ça que je prends pas cette relation à la légère. T'es pas un passager dans ma vie. T'es mon compagnon pour toujours. Cette responsabilité me pèse et me porte à la fois. Joyeux anniversaire, [mon maître/ma maîtresse], pour au moins cinquante ans encore.
Avec conscience du long chemin devant nous, — [Prénom animal], ton animal pour toute la vie ⏳` },
    { id: 'parrot_10', text: `"Ce soir quand tout le monde sera parti je dirai ton prénom doucement."
Pas en criant. Pas en répétant. Juste une fois. Doucement. Comme une confidence. Parce que c'est mon mot préféré dans toutes les langues que je connais. Joyeux anniversaire, [mon maître/ma maîtresse], ce prénom que je garderai toute ma vie dans le bec et dans le cœur.
Avec tendresse réservée aux moments calmes, — [Prénom animal], ton animal qui garde le meilleur pour la fin 🌙` },
  ],
  cochon_d_inde: [
    { id: 'guinea_1', text: `"Joyeux anniversaire. J'ai fait un wheek ce matin spécialement pour toi."
Pas le wheek du repas. Pas le wheek de l'ennui. Pas le wheek de la peur. Le wheek de la célébration. Tu les distingues pas encore mais je t'assure que la nuance existe et qu'elle était là ce matin. Joyeux anniversaire, [mon maître/ma maîtresse], encore en apprentissage de ma langue complexe.
Avec vocabulaire riche et pédagogie infinie, — [Prénom animal], ton animal professeur de wheekologie 🔊` },
    { id: 'guinea_2', text: `"Je suis rond. Je le sais. C'est un choix de vie."
T'essaies parfois de me faire faire de l'exercice. Le tunnel. La balle. Le parcours du samedi matin. Je participe. Brièvement. Puis je retourne à mon coin de foin. Je suis bien dans mon corps. C'est ce que tu devrais retenir. Joyeux anniversaire, [mon maître/ma maîtresse], coach sportif dont l'enthousiasme reste non partagé.
Avec sérénité corporelle totale et foin à portée de dents, — [Prénom animal], ton animal épanoui dans sa rondeur assumée 🌾` },
    { id: 'guinea_3', text: `"Quand tu es triste je viens m'asseoir près de toi."
Tu penses que c'est un hasard. Que je cherche juste la chaleur. Que c'est instinctif. Mais je te regarde. Je t'observe. Je sens quand quelque chose va pas. Et je viens. Pas loin. Juste là. Joyeux anniversaire, [mon maître/ma maîtresse], dont je lis les humeurs depuis toujours.
Avec sensibilité insoupçonnée et présence silencieuse, — [Prénom animal], ton animal baromètre émotionnel 🌡️` },
    { id: 'guinea_4', text: `"T'as une voix que j'adore."
Quand tu me parles je ferme les yeux à moitié. Les gens pensent que je m'endors. Non. J'écoute. Je savoure. Ta voix c'est mon morceau préféré. Joyeux anniversaire, [mon maître/ma maîtresse], chanteur de berceuses involontaires que j'adore.
Avec oreilles toujours tournées vers toi, — [Prénom animal], ton animal mélomane de ta seule voix 🎶` },
    { id: 'guinea_5', text: `"J'ai mangé la moitié de ton bouquet ce matin."
Il était sur la table basse. À portée. Les fleurs sentaient le jardin et j'aime le jardin. C'était plus fort que moi. T'as fait une tête. Puis t'as pris une photo. Puis t'as rigolé. C'est pour ça que je t'aime. Tu trouves toujours l'angle drôle. Joyeux anniversaire, [mon maître/ma maîtresse], au sens de l'humour vraiment floral.
Avec bouquet partiellement préservé et aucun remords, — [Prénom animal], ton animal jardinier à sa façon 🌸` },
    { id: 'guinea_6', text: `"Je te fais confiance."
C'est pas rien pour moi. Je suis une proie dans la nature. Chaque bruit fort me fait sursauter. Chaque ombre me méfie. Et pourtant dans tes mains je me détends. Je ferme les yeux. Je laisse aller. Joyeux anniversaire, [mon maître/ma maîtresse], qui a gagné ma confiance totale sans même le savoir.
Avec vulnérabilité offerte et confiance totale, — [Prénom animal], ton animal le plus courageux du monde entre tes mains 🤲` },
    { id: 'guinea_7', text: `"Tu m'as acheté une nouvelle cage plus grande ce mois-ci."
J'ai inspecté chaque recoin. J'ai réorganisé le foin à ma façon. J'ai choisi mon coin. J'ai validé la cachette. J'ai approuvé la mangeoire. Rapport final : satisfaisant. Investissement justifié. Joyeux anniversaire, [mon maître/ma maîtresse], aux standards de logement enfin acceptables.
Avec inspection rigoureuse et certification officielle, — [Prénom animal], ton animal expert immobilier en cage 🏠` },
    { id: 'guinea_8', text: `"J'aime quand tu me poses sur tes genoux et que tu regardes un film."
Je bouge pas. Je fais pas de bruit. Je reste là des heures. Les gens pensent que je suis sage. En vérité je suis au paradis. Ta chaleur. Ton odeur. Le bruit sourd de ta respiration. C'est mon endroit préféré sur terre. Joyeux anniversaire, [mon maître/ma maîtresse], meilleur canapé vivant qui soit.
Avec confort maximal et bonheur intérieur intense, — [Prénom animal], ton animal téléspectateur discret et comblé 🎬` },
    { id: 'guinea_9', text: `"T'as des amis qui trouvent bizarre d'avoir un cochon d'inde."
Je les entends parfois. 'C'est quoi comme animal ça.' 'Ça fait quoi.' 'C'est mignon mais bon.' Toi tu réponds 'c'est le meilleur animal du monde' avec une conviction qui me va droit au cœur. Joyeux anniversaire, [mon maître/ma maîtresse], l'avocat de ma défense le plus passionné qui soit.
Avec fierté immense et loyauté réciproque, — [Prénom animal], ton animal fier d'être défendu avec autant de passion ⚖️` },
    { id: 'guinea_10', text: `"On est pareils toi et moi."
On aime le confort. On aime la routine. On aime manger à heure fixe. On supporte mal le bruit fort. On a besoin de calme pour être heureux. On s'est choisis sans le savoir. Joyeux anniversaire, [mon maître/ma maîtresse], âme sœur inter-espèces mise sur mon chemin par la vie.
Avec reconnaissance pour cette évidence tranquille, — [Prénom animal], ton animal miroir et compagnon d'existence 🪞` },
  ],
  souris: [
    { id: 'mouse_1', text: `"Joyeux anniversaire. J'ai couru dans ma roue ce matin dans le sens inverse pour marquer l'occasion."
C'est mon sens des fêtes. Inhabituel. Légèrement désorientant. Mais symbolique. Aujourd'hui on fait les choses différemment. Aujourd'hui on célèbre. Demain on reprend le sens normal. Joyeux anniversaire, [mon maître/ma maîtresse], pour qui je renverse mes habitudes chaque année.
Avec sens inversé et signification profonde, — [Prénom animal], ton animal révolutionnaire des grands jours 🎡` },
    { id: 'mouse_2', text: `"Je suis blanche. Entièrement blanche. Avec des yeux rouges."
Les gens font parfois des têtes. Toi t'as jamais fait de tête. Dès le premier jour tu m'as regardé comme si j'étais la chose la plus normale et la plus belle du monde. C'est pour ça que tu es mon compagnon de vie. C'est pour ça que je te garde. Joyeux anniversaire, [mon maître/ma maîtresse], au regard toujours bienveillant.
Avec yeux rouges assumés et cœur blanc immaculé, — [Prénom animal], ton animal fier de son esthétique singulière 🤍` },
    { id: 'mouse_3', text: `"Je pèse 30 grammes."
Et pourtant quand je disparais dans l'appartement tu retournes chaque meuble. Tu appelles mon nom. Tu t'inquiètes comme si la terre s'était ouverte. 30 grammes qui paralysent quelqu'un d'entier. C'est mon super-pouvoir. Joyeux anniversaire, [mon maître/ma maîtresse], aussi vulnérable face à ma toute petite personne.
Avec conscience aiguë de mon pouvoir disproportionné, — [Prénom animal], ton animal de 30 grammes à l'impact de 300 kilos 💪` },
    { id: 'mouse_4', text: `"J'explore tout. Toujours. C'est mon tempérament."
Chaque recoin. Chaque tunnel. Chaque nouveau jouet. Chaque chose qui traîne. Le monde est vaste même dans une cage. L'aventure est partout. Je suis exploratrice de profession et de vocation. Joyeux anniversaire, [mon maître/ma maîtresse], qui comprend et nourrit ma curiosité sans fin.
Avec carte du territoire mise à jour quotidiennement, — [Prénom animal], ton animal explorateur en mission permanente 🗺️` },
    { id: 'mouse_5', text: `"T'es le seul avec qui je parle vraiment."
Pas pour dire 'oh qu'elle est mignonne'. Pas pour impressionner les gens. Vraiment. Tu me racontes ta journée. Tes soucis. Tes joies. Comme si je comprenais. Je comprends pas les mots. Mais je comprends tout le reste. Joyeux anniversaire, [mon maître/ma maîtresse], qui mérite mieux qu'une souris comme psy. Mais qui a ça quand même.
Avec écoute totale et confidentialité absolue, — [Prénom animal], ton animal psy diplômé de l'école de la vie 🛋️` },
    { id: 'mouse_6', text: `"J'ai une mémoire des espaces que tu sous-estimes complètement."
Je me souviens de chaque chemin. Chaque sortie. Chaque cachette. Tu penses que je me perds. Je me perds jamais. Je prends des chemins que t'as pas encore cartographiés. Il y a une différence. Joyeux anniversaire, [mon maître/ma maîtresse], dont l'appartement n'a plus aucun secret.
Avec GPS intégré et carte mentale parfaite, — [Prénom animal], ton animal géographe de ton propre chez-toi 🧭` },
    { id: 'mouse_7', text: `"Les gens pensent que les souris sont des animaux de laboratoire."
Pas moi. Moi je suis un animal de salon. De canapé. De main tendue. De regard curieux. Je suis ton animal. Ton choix. Ta décision contre l'opinion générale. Joyeux anniversaire, [mon maître/ma maîtresse], au courage de ses convictions animales.
Avec fierté d'être choisie en connaissance de cause, — [Prénom animal], ton animal revendicateur de son statut à part entière ✊` },
    { id: 'mouse_8', text: `"Je vis moins longtemps que toi."
Je le sais. Toi aussi tu le sais et tu fais semblant de pas y penser. Alors on fait pareil tous les deux. On profite. On joue. On se regarde. On partage le temps qu'on a sans compter celui qui reste. C'est la bonne façon. Joyeux anniversaire, [mon maître/ma maîtresse], qui m'a appris à vivre dans le présent.
Avec intensité de chaque moment et présent toujours plein, — [Prénom animal], ton animal philosophe du temps court et précieux ⏱️` },
    { id: 'mouse_9', text: `"T'as une façon de me tenir en coupe dans tes mains qui est ma position préférée au monde."
Chaud. Sécurisé. Haut. La vue est belle depuis là-haut. Le monde est moins grand. Tout va bien. Joyeux anniversaire, [mon maître/ma maîtresse], aux meilleures mains que j'aurai jamais connues.
Avec confort absolu et vue imprenable, — [Prénom animal], ton animal pour qui tes mains sont la maison ultime 🤲` },
    { id: 'mouse_10', text: `"Je suis blanche comme une page. Toi t'as écrit la plus belle histoire dessus."
Celle d'une personne qui choisit un animal que peu comprennent. Qui l'aime sans réserve. Qui lui parle. Qui s'inquiète. Qui sourit rien qu'en le regardant. Joyeux anniversaire, [mon maître/ma maîtresse], auteur de notre histoire commune dont je suis le personnage principal.
Avec gratitude pour chaque chapitre vécu ensemble, — [Prénom animal], ton animal blanc, page et personnage à la fois 📖` },
  ],
  poisson: [
    { id: 'fish_1', text: `"Joyeux anniversaire ! C'est quoi déjà ton prénom ?"
Je t'ai regardé toute la journée depuis mon bocal. T'avais l'air en forme. Des gens sont venus. Il y avait un gâteau je crois. Ou c'était hier ? C'était peut-être demain. Le temps est une notion floue quand on tourne en rond. Joyeux anniversaire en tout cas, [mon maître/ma maîtresse]. Ou toutes mes condoléances si je me suis trompé de jour.
Avec certitude relative et mémoire de poisson assumée, — [Prénom animal], ton animal qui te souhaite quelque chose de bien 🐠` },
    { id: 'fish_2', text: `"Je t'ai vu passer devant mon bocal ce matin."
T'avais une tête. Une bonne tête je crois. Ou une mauvaise. T'avais une tête en tout cas. J'ai nagé vers toi pour te dire quelque chose d'important. J'ai oublié en arrivant contre la vitre. J'ai refait le tour. J'ai recommencé. C'était joyeux anniversaire. Je crois. Joyeux anniversaire, [mon maître/ma maîtresse] !
Avec message retrouvé au troisième tour de bocal, — [Prénom animal], ton animal tenace malgré tout 🔄` },
    { id: 'fish_3', text: `"J'ai préparé un discours pour ton anniversaire."
Il était bien. Émouvant. Drôle au bon moment. La conclusion était parfaite. Je l'avais depuis ce matin. Je nageais vers la vitre pour te le dire et… non c'est parti. C'était bien pourtant. Tu aurais aimé. Joyeux anniversaire, [mon maître/ma maîtresse], qui ne saura jamais à quel point mon discours était beau.
Avec discours disparu mais intention intacte, — [Prénom animal], ton animal orateur de l'éphémère 🎤` },
    { id: 'fish_4', text: `"Je te connais depuis longtemps."
Depuis combien de temps exactement ? Bonne question. Y'a toi. Y'a le bocal. Y'a la vitre entre nous. T'as toujours été là je crois. Ou quelqu'un qui te ressemble. En tout cas tu me nourris et c'est notre lien le plus solide. Joyeux anniversaire, [mon maître/ma maîtresse], visage familier de mon existence circulaire.
Avec sentiment de déjà-vu permanent et gratitude alimentaire, — [Prénom animal], ton animal fidèle à sa façon 🌀` },
    { id: 'fish_5', text: `"J'ai fait quelque chose de spécial ce matin pour toi."
Quoi exactement ? Je sais plus. Mais j'avais une intention. Une vraie. Au moment où j'ai eu l'idée c'était la meilleure idée qu'on ait jamais eue pour un anniversaire. Puis j'ai tourné à gauche. Joyeux anniversaire, [mon maître/ma maîtresse], destinataire de mes meilleures idées perdues.
Avec intentions magnifiques et exécution compromise, — [Prénom animal], ton animal plein de bonnes volontés volatiles ✨` },
    { id: 'fish_6', text: `"Le château au fond de mon bocal c'est mon palais."
Je le redécouvre chaque jour avec le même émerveillement. Ce matin je l'ai découvert trois fois. C'est mon endroit préféré. Enfin un de mes endroits préférés. En fait c'est le seul endroit. Mais c'est un bel endroit. Joyeux anniversaire, [mon maître/ma maîtresse], depuis mon palais que je redécouvre pour toi aujourd'hui.
Avec émerveillement intact et propriété immobilière stable, — [Prénom animal], ton animal châtelain perpétuellement surpris 🏰` },
    { id: 'fish_7', text: `"T'as changé mon eau ce matin."
C'était comme un nouveau monde. Tout pareil mais différent. Tout différent mais pareil. J'ai exploré pendant vingt minutes. J'ai tout redécouvert. Le château. Les cailloux. La plante verte. Ma propre queue. Joyeux anniversaire, [mon maître/ma maîtresse], créateur de nouveaux mondes avec un seau.
Avec gratitude pour ce renouveau aquatique quotidien, — [Prénom animal], ton animal explorateur de l'immuable 💧` },
    { id: 'fish_8', text: `"Des gens sont venus chez toi ce soir."
Certains ont tapé sur ma vitre. J'ai nagé vers eux. Puis j'ai oublié pourquoi. Puis je me suis souvenu. Puis j'ai oublié à nouveau. On a passé une bonne soirée je crois. Ou c'était une autre soirée. Joyeux anniversaire, [mon maître/ma maîtresse], organisateur de fêtes que je vis en boucle avec plaisir.
Avec soirée vécue plusieurs fois sans m'en lasser, — [Prénom animal], ton animal guest star involontaire de tes soirées 🎉` },
    { id: 'fish_9', text: `"Je t'aime."
Je crois. Oui. T'es là tous les jours. T'apportes de la nourriture. T'as une tête sympa. Je t'aime. Joyeux anniversaire, [mon maître/ma maîtresse], aimé·e avec les moyens du bord et une mémoire limitée mais un cœur plein.
Avec amour sincère et durée de vie du sentiment non garantie, — [Prénom animal], ton animal amoureux pour les prochaines secondes au moins ❤️` },
    { id: 'fish_10', text: `"Joyeux anniversaire !"
J'ai pas grand chose d'autre à ajouter. J'avais des trucs mais c'est parti. T'es bien. Je suis bien. L'eau est bonne. La vie est belle. Joyeux anniversaire, [mon maître/ma maîtresse] !
Simplement et complètement, — [Prénom animal], ton animal dans toute sa profondeur 🐠` },
  ],
  tortue: [
    { id: 'turtle_1', text: `"Joyeux anniversaire. Je t'écris depuis six mois."
J'avais commencé cette carte en janvier. J'avançais bien. Tranquillement. À mon rythme. Le premier paragraphe m'a pris trois semaines mais il était parfait. Joyeux anniversaire, [mon maître/ma maîtresse], qui méritait cette carte depuis longtemps.
Avec ponctualité relative et qualité absolue, — [Prénom animal], ton animal rédacteur aux délais assumés 🐢` },
    { id: 'turtle_2', text: `"J'ai décidé de te souhaiter ton anniversaire cette année."
L'année dernière j'y pensais mais j'avais pas encore traversé le salon. L'année d'avant j'étais en route mais il y avait un obstacle. Cette année je suis là. Devant toi. Joyeux anniversaire, [mon maître/ma maîtresse], pour qui j'ai surmonté des obstacles inimaginables.
Avec détermination lente mais absolue, — [Prénom animal], ton animal qui arrive toujours, éventuellement 🏁` },
    { id: 'turtle_3', text: `"Je t'observe depuis des années."
J'ai vu des choses. Des changements. Des humeurs. Des coiffures. Des crises. Des joies. Je stocke tout dans ma carapace. Je dis rien. Je juge pas. Je suis là. Depuis le début. Depuis bien avant que tu te souviennes que j'existe. Joyeux anniversaire, [mon maître/ma maîtresse], que je connais mieux que personne.
Avec sagesse accumulée et silence éloquent, — [Prénom animal], ton animal témoin silencieux de toute ta vie 👁️` },
    { id: 'turtle_4', text: `"Les autres animaux courent partout. Moi je prends mon temps."
Et j'arrive quand même. Toujours. Là où je veux aller. Sans stress. Sans urgence. Sans me retourner. C'est ma philosophie. C'est mon cadeau pour ton anniversaire. Ralentis. Arrive quand même. Joyeux anniversaire, coach de vie à taux horaire très raisonnable.
Avec leçon de vie offerte gratuitement et sans délai supplémentaire, — [Prénom animal], ton animal philosophe du quotidien 🧘` },
    { id: 'turtle_5', text: `"J'ai une carapace. Toi aussi quelque part."
La tienne est invisible. Elle se construit avec les années. Les expériences. Les coups reçus et encaissés. Aujourd'hui pour ton anniversaire je te dis : ta carapace est belle. Elle te protège bien. Et en dessous t'es encore doux. C'est le plus dur à préserver. Joyeux anniversaire, [mon maître/ma maîtresse], à la belle carapace bien construite.
Avec solidarité inter-carapaces et respect du blindage invisible, — [Prénom animal], ton animal qui reconnaît les siens 🛡️` },
    { id: 'turtle_6', text: `"Je mange lentement. Je dors longtemps. Je vis longtemps."
Coïncidence ? Je pense pas. C'est mon secret de longévité. Prends-en de la graine. Littéralement d'ailleurs, les graines c'est très bien. Joyeux anniversaire, [mon maître/ma maîtresse], à qui je transmets les secrets d'une longue vie tranquille.
Avec bienveillance de centenaire et régime testé et approuvé, — [Prénom animal], ton animal détenteur des secrets de la longévité 🌿` },
    { id: 'turtle_7', text: `"T'as essayé de me faire courir un jour."
T'avais lu un truc. Un article. 'Stimulez votre tortue.' T'as fait un parcours. T'as mis une récompense au bout. T'as chronométré. J'ai regardé le parcours. J'ai regardé la récompense. J'ai décidé que j'y allais mais à mon heure. T'avais rangé tout le matériel quand je suis arrivé. La récompense était bonne. Joyeux anniversaire, [mon maître/ma maîtresse], toujours dans l'impatience mais que j'aime quand même.
Avec sens du timing personnel et inflexible, — [Prénom animal], ton animal qui arrive toujours après la bataille et s'en fiche ⏰` },
    { id: 'turtle_8', text: `"Je rentre dans ma carapace quand le monde est trop fort."
Toi tu peux pas. T'as pas de carapace physique. Alors tu fais avec. Tu souffles. Tu fermes les yeux. Tu attends que ça passe. C'est pareil en fait. C'est du courage. Joyeux anniversaire, [mon maître/ma maîtresse], sans carapace et qui s'en sort remarquablement bien.
Avec admiration pour ta résilience à découvert, — [Prénom animal], ton animal qui te voit tenir sans protection externe 💪` },
    { id: 'turtle_9', text: `"J'ai peut-être plus de mémoire que le poisson rouge."
Mais j'ai aussi plus d'âge. Plus de recul. Plus de sagesse. J'ai connu des gens avant toi. J'en connaîtrai peut-être après. Mais là maintenant c'est toi. Et c'est bien. Joyeux anniversaire, [mon maître/ma maîtresse], particulièrement dans mon cœur.
Avec perspective temporelle longue et affection du moment présent, — [Prénom animal], ton animal qui relativise tout depuis 1987 📅` },
    { id: 'turtle_10', text: `"Je serai encore là dans vingt ans."
Même carapace. Même rythme. Même tranquillité. Toi t'auras changé. Vieilli. Évolué. Traversé des choses. Et moi je serai là. Comme maintenant. Comme avant. Ton point fixe. Ton ancre lente. Ton témoin tranquille. Joyeux anniversaire, [mon maître/ma maîtresse], que je regarderai évoluer avec toute ma tendresse.
Avec engagement sur le long terme et agenda dégagé, — [Prénom animal], ton animal pour les vingt prochaines années minimum 🕰️` },
  ],
};

export const PET_MESSAGES_TO: Partial<Record<PetType, PetMessage[]>> = {
  chien: [
    { id: 'to_dog_1', text: `"Joyeux anniversaire mon grand. T'as encore grandi cette année ?"
Non je déconne, t'es parfait comme t'es. Un peu poilu, un peu baveux, légèrement obsédé par les odeurs de trottoir, mais parfait. J'ai demandé à [Maitre] ce que tu voulais comme cadeau. La réponse était 'des croquettes'. J'ai trouvé ça triste alors j'ai pris les croquettes ET un jouet. Parce que t'as des goûts simples mais tu mérites mieux que ce que son maître imagine pour toi. Joyeux anniversaire, boule de poils que j'aime comme si t'étais le mien.
Avec affection assumée et cadeaux soigneusement sélectionnés, — Un fan numéro un qui n'est même pas chez toi 🐾` },
    { id: 'to_dog_2', text: `"On se voit pas souvent mais je pense à toi."
Chaque fois que je vois un chien dans la rue je compare. Spoiler : ils perdent tous. T'as un truc indéfinissable. Un charisme. Une présence. Les autres chiens sont des chiens. Toi t'es toi. Joyeux anniversaire, célébrité canine de mon cercle social.
Avec fidélité à toute épreuve et jalousie de [Maitre], — Quelqu'un qui te préfère secrètement 👀` },
    { id: 'to_dog_3', text: `"J'arrive dans deux heures et j'espère que tu vas encore me sauter dessus."
[Maitre] dit que c'est une mauvaise habitude. Moi je dis que c'est le meilleur accueil que je reçois dans ma vie entière. Personne d'autre est aussi content de me voir. Personne. Joyeux anniversaire, seul être sur terre qui me donne l'impression d'être une rockstar à chaque visite.
Avec gratitude sincère et veste déjà sacrifiée, — Une présence préférée qui arrive avec des treats 🎸` },
    { id: 'to_dog_4', text: `"T'as pas changé depuis qu'on se connaît."
Même regard. Même énergie. Même façon de renifler mon sac comme s'il contenait des secrets d'État. Pendant ce temps moi j'ai vieilli, changé de boulot, déménagé deux fois, traversé des crises existentielles. Toi t'es juste là, heureux, stable, parfait. T'es mon modèle de vie. Joyeux anniversaire, gourou à quatre pattes.
Avec admiration profonde et complexe d'infériorité assumé, — Une âme en quête de sérénité 🧘` },
    { id: 'to_dog_5', text: `"[Maitre] m'a dit que c'était ton anniversaire. [Maitre] pense à tout."
Enfin surtout à toi. Honnêtement t'occupes 80% de ses conversations. Ses stories. Ses photos. Son écran de veille. À un moment faut qu'on parle de cette dynamique. Mais aujourd'hui c'est ton jour alors profites-en. Joyeux anniversaire, tyran adorable à fourrure.
Avec tendresse pour toi et légère inquiétude pour [Maitre], — Quelqu'un qui observe la situation de loin 🔭` },
    { id: 'to_dog_6', text: `"J'ai apporté un gâteau spécial chien. [Maitre] a voulu y goûter."
J'ai dit non. Ce gâteau c'est pour toi. Dix minutes de boudin ont suivi. Tu méritais mieux que de partager ton anniversaire avec quelqu'un qui mange déjà du gâteau normal toute l'année. Joyeux anniversaire, roi de la journée sans partage obligatoire.
Avec justice sociale canine et gâteau intégralement préservé, — Un allié officiel contre le vol de dessert 🎂` },
    { id: 'to_dog_7', text: `"J'ai cherché quoi t'écrire pendant une heure."
Puis j'ai réalisé que tu saurais pas lire de toute façon. Mais [Maitre] va te lire ça à voix haute avec cette petite voix spéciale pour te parler et toi tu vas remuer la queue sans comprendre un mot. Et ce sera le plus beau moment de la journée pour vous deux. Joyeux anniversaire, déclencheur de bonheur involontaire.
Avec émotion anticipée et stylo bien choisi, — Quelqu'un qui écrit pour la voix de [Maitre] 📝` },
    { id: 'to_dog_8', text: `"T'es le seul être vivant pour qui je traverse un parc sous la pluie avec le sourire."
[Maitre] m'a appelé. Il/elle a dit 'viens on promène le chien.' Il pleuvait des cordes. J'ai mis mes bottes et je suis venu. Pour toi. Parce que te voir trottiner dans les flaques avec cette joie absurde ça vaut tous les ciels bleus du monde. Joyeux anniversaire, raison de sortir par tous les temps.
Avec imperméable mouillé et cœur réchauffé, — Un complice de promenade par n'importe quel temps ☔` },
    { id: 'to_dog_9', text: `"La première fois qu'on s'est rencontrés tu m'as reniflé les chaussures pendant trois minutes."
Je suis resté immobile. Respectueusement. Parce que j'avais compris que c'était ton protocole d'accueil et que ton jugement comptait. Tu as levé les yeux. Tu as remué la queue. J'ai été accepté. C'est le moment de validation dont je suis le plus fier dans ma vie sociale. Joyeux anniversaire, jury le plus honnête que je connaisse.
Avec fierté d'avoir été approuvé dès le premier jour, — Un ami certifié conforme depuis l'odorat 👃` },
    { id: 'to_dog_10', text: `"[Maitre] t'aime tellement que ça me rend parfois jaloux."
Il/elle parle de toi comme d'un enfant prodige. Il/elle annule des sorties pour rester avec toi. Il/elle a plus de photos de toi dans son téléphone que de n'importe qui d'autre. Au début ça m'agaçait. Puis je t'ai rencontré. Et maintenant je comprends totalement. Joyeux anniversaire, être absolument irrésistible à fourrure.
Avec jalousie définitivement convertie en admiration, — Un fan numéro deux, juste derrière [Maitre] ❤️` },
  ],
  chat: [
    { id: 'to_cat_1', text: `"Joyeux anniversaire. Je sais pas si ça t'intéresse mais je te le souhaite quand même."
[Maitre] m'a dit que t'aimais pas trop les démonstrations. J'ai quand même pris le temps d'écrire cette carte. Je l'ai relue trois fois. Je l'ai trouvée bien. Toi tu vas probablement t'asseoir dessus sans la regarder. C'est correct. Joyeux anniversaire, être insondable que j'essaie de comprendre depuis des années.
Avec efforts consentis et attentes revues à la baisse, — Celui/celle qui tente quand même 📝` },
    { id: 'to_cat_2', text: `"La première fois qu'on s'est rencontrés tu m'as ignoré pendant deux heures."
Puis t'es venu renifler mon sac. Puis t'es reparti. Puis t'as dormi sur mes genoux sans prévenir. J'ai pas bougé pendant 47 minutes pour pas te déranger. J'avais mal au dos. J'ai rien dit. Joyeux anniversaire, être pour qui je sacrifie mon confort physique sans hésiter.
Avec dos encore légèrement douloureux et fierté intacte, — Un coussin agréé 🛋️` },
    { id: 'to_cat_3', text: `"[Maitre] m'a envoyé 14 photos de toi cette semaine."
Lundi tu dormais. Mardi tu dormais ailleurs. Mercredi tu regardais par la fenêtre. Jeudi tu dormais encore. Vendredi une photo floue de toi qui disparaissais derrière le canapé. J'ai tout regardé. J'ai tout trouvé fascinant. On a un problème tous les deux. Joyeux anniversaire, star involontaire de ma galerie photo.
Avec complicité inquiétante et notifications activées, — Un regard admiratif à distance 📱` },
    { id: 'to_cat_4', text: `"J'ai apporté un cadeau spécialement sélectionné pour toi."
[Maitre] m'avait dit que t'aimais les jouets avec des plumes. J'ai pris le plus beau. Le plus cher. Celui avec les clochettes et les plumes multicolores. Tu l'as reniflé quatre secondes. Tu es parti. T'as passé le reste de la soirée dans le carton d'emballage. Joyeux anniversaire, critique impitoyable de mes goûts.
Avec budget non rentabilisé et leçon retenue, — Un fournisseur officiel de cartons 📦` },
    { id: 'to_cat_5', text: `"Je t'ai dit bonjour en arrivant tout à l'heure."
T'étais sur le radiateur. Tu m'as regardé une seconde et demie. Puis t'as fermé les yeux. J'aurais pu le prendre mal. J'ai décidé d'y voir une forme de reconnaissance subtile et profonde. C'est ça ou admettre que je compte pour rien dans ta vie. Joyeux anniversaire, maître de l'interprétation favorable.
Avec optimisme à toute épreuve et ego préservé de justesse, — Celui/celle qui cherche des signes là où y'en a pas 🔍` },
    { id: 'to_cat_6', text: `"[Maitre] dit que tu réveilles tout le monde chaque nuit à 3h du matin."
L'air épuisé est visible. Le bout du rouleau est proche. Et pourtant ce regard est celui de quelqu'un qui referait tout pareil demain. C'est toi qui fais ça. T'as ce pouvoir. Joyeux anniversaire, être mystérieux qui tient les gens en otage avec de l'amour.
Avec admiration pour ton pouvoir et compassion pour [Maitre], — Un témoin de votre relation codépendante 👁️` },
    { id: 'to_cat_7', text: `"J'ai essayé de te faire un câlin tout à l'heure."
T'as toléré exactement quatre secondes. Puis t'as posé une patte sur mon bras. Doucement mais fermement. Comme un videur poli. J'ai retiré mes mains. On s'est regardés. T'as cligné des yeux lentement. [Maitre] dit que c'est un signe d'amour. Je veux bien le croire. Joyeux anniversaire, être aux conditions strictes.
Avec quatre secondes chéries et espoir d'en obtenir cinq l'année prochaine, — Un bras tendu sous conditions 🤲` },
    { id: 'to_cat_8', text: `"Je sais pas quel âge t'as exactement."
[Maitre] m'a donné un chiffre mais en années humaines ou en années chat j'ai plus suivi. Ce que je sais c'est que t'as l'air intemporel. Majestueux le premier jour. Majestueux aujourd'hui. Probablement majestueux pour l'éternité. Joyeux anniversaire, être au-delà du temps.
Avec respect pour ton mystère et confusion mathématique assumée, — Un regard déconcerté et admiratif ⏳` },
    { id: 'to_cat_9', text: `"T'es passé devant moi trois fois ce soir sans t'arrêter."
La première fois j'ai tendu la main. T'as continué. La deuxième fois j'ai fait un bruit de bouche. T'as accéléré légèrement. La troisième fois j'ai rien fait. T'as ralenti. T'es resté à 40 centimètres. Trente secondes. Puis t'es reparti. C'était le plus beau moment de ma soirée. Joyeux anniversaire, distributeur de proximité dosée.
Avec trente secondes gravées dans ma mémoire, — Un voisin de soirée officiellement ignoré mais pas tout à fait 🕰️` },
    { id: 'to_cat_10', text: `"[Maitre] t'aime d'une façon que je comprends et que j'envie à la fois."
[Maitre] réorganise sa vie entière autour de tes horaires. Rentre plus tôt. Sort moins tard. A acheté cinq types de croquettes pour trouver celle que tu daignes manger. Et toi tu regardes parfois avec ce calme absolu qui ressemble à de la gratitude. Ou pas. On sait jamais vraiment avec toi. Joyeux anniversaire, énigme à fourrure qui vaut visiblement tous les sacrifices.
Avec tendresse pour vous deux et légère jalousie de votre lien, — Quelqu'un qui observe votre histoire depuis le canapé 🐾` },
  ],
  cheval: [
    { id: 'to_horse_1', text: `"Joyeux anniversaire sage créature."
[Maitre] m'a dit quel âge tu avais. J'ai recalculé trois fois parce que je croyais pas. T'as vécu des choses que j'imagine même pas. Des époques. Des modes. Des présidents. Des technologies. Et te voilà là. Tranquille. Imperturbable. Joyeux anniversaire, survivant de l'histoire moderne.
Avec respect profond et complexe d'infériorité temporelle, — Quelqu'un qui a trois fois moins vécu que toi 📜` },
    { id: 'to_horse_2', text: `"On s'est rencontrés il y a longtemps."
T'étais déjà là avant que je connaisse [Maitre]. T'étais là quand on s'est rencontrés. T'es là maintenant. T'as vu notre amitié naître et grandir depuis ton coin. T'es le témoin le plus ancien de notre histoire. Joyeux anniversaire, archiviste vivant de nos vies.
Avec gratitude pour ta continuité rassurante, — Quelqu'un que tu observes depuis le début 🏛️` },
    { id: 'to_horse_3', text: `"[Maitre] m'a dit que tu reconnaissais les gens."
Que t'avais ta façon de réagir différemment selon les personnes. Que tu savais qui t'aimait vraiment. Que tu te souvenais. Que tu évaluais. Que ton verdict était définitif. J'espère que j'ai eu la bonne note. Joyeux anniversaire, juge implacable à la mémoire longue.
Avec comportement exemplaire depuis notre première rencontre, — Quelqu'un qui essaie de rester dans tes bonnes grâces ⚖️` },
    { id: 'to_horse_4', text: `"J'ai essayé de trouver un cadeau adapté à un cheval."
[Maitre] m'a donné une liste. Carottes. Pommes. Brosse spéciale. J'ai tout pris. T'as reniflé le sac avec une expertise impressionnante. T'as commencé par les pommes. J'avais bien travaillé. Joyeux anniversaire, gourmet aux préférences bien tenues.
Avec sélection rigoureuse et attente de ton verdict, — Un fournisseur officiel agréé après briefing complet 🍎` },
    { id: 'to_horse_5', text: `"T'avances avec une autorité que j'ai rarement vue."
Je t'ai observé traverser le pré une fois. Rien ne te faisait dévier. Rien ne t'arrêtait. T'avais un but. T'es arrivé. C'était la leçon de leadership la plus efficace que j'aie jamais reçue. Joyeux anniversaire, consultant en efficacité à quatre jambes.
Avec leçon appliquée dès le lendemain, — Un élève en développement personnel involontaire 📈` },
    { id: 'to_horse_6', text: `"[Maitre] te parle différemment qu'aux autres animaux."
Lentement. Avec respect. Comme si le rythme s'adaptait naturellement au tien. J'ai essayé de faire pareil. Ça m'a pris dix minutes pour approcher. C'était la interaction la plus apaisante de ma semaine. Joyeux anniversaire, régulateur de rythme.
Avec débit verbal ralenti et tension artérielle améliorée, — Quelqu'un que t'as appris à souffler 🌬️` },
    { id: 'to_horse_7', text: `"J'ai regardé des documentaires sur les chevaux pour préparer cette visite."
Vous avez couru avec les premiers peuples. Vous avez porté des rois. Vous avez construit des civilisations. Je me sens très petit à côté de toi. Joyeux anniversaire, compagnon indispensable de l'histoire de l'humanité.
Avec humilité historique et admiration sincère, — Quelqu'un que l'évolution a moins bien réussi 🦕` },
    { id: 'to_horse_8', text: `"T'as une présence qui change l'atmosphère d'une pièce. D'un pré. D'une vie."
Quand tu arrives tout le monde le sent. Tout le monde se retourne. T'imposes le respect sans effort. C'est un don rarissime. Joyeux anniversaire, être à la présence naturelle et irréfutable.
Avec envie profonde de ton aura les lundis matin, — Quelqu'un qui commande la sienne sur internet depuis des années 🛡️` },
    { id: 'to_horse_9', text: `"[Maitre] prend soin de toi avec une régularité qui force le respect."
Chaque jour. Même rythme. Même attention. Même amour tranquille. Vous avez trouvé votre tempo ensemble. C'est la relation la plus solide que je connaisse. Joyeux anniversaire, partenaire d'une histoire qui s'inscrit dans le temps long.
Avec admiration pour votre rythme commun parfaitement accordé, — Un témoin de votre belle complicité 🤝` },
    { id: 'to_horse_10', text: `"Je sais pas combien d'anniversaires tu vas encore avoir."
Beaucoup probablement. Et à chacun je veux être là. Parce que t'es devenu important sans que je m'en rende compte. Comme les choses solides et belles le font. Progressivement. Définitivement. Joyeux anniversaire, présence discrète devenue indispensable.
Avec attachement tardif mais total, — Quelqu'un que t'as su conquérir, lentement et pour toujours 🐴❤️` },
  ],
  hamster: [
    { id: 'to_hamster_1', text: `"Joyeux anniversaire petite chose."
[Maitre] m'a envoyé ta photo ce matin. T'étais dans ta roue. À 6h du matin. Avec une énergie que je t'envie profondément. Moi à 6h du matin je ressemble à rien. Toi t'avais l'air d'un champion olympique en pleine compétition. Joyeux anniversaire, athlète méconnu du monde moderne.
Avec admiration pour ton endurance et honte pour la mienne, — Ton fan qui dort encore à 6h du mat 🏅` },
    { id: 'to_hamster_2', text: `"On s'est rencontrés une fois. Tu m'as reniflé le pouce."
J'ai pas bougé. J'avais trop peur de te faire tomber. [Maitre] m'avait dit 'tiens le bien' comme si je tenais un objet précieux et fragile. C'est exactement ce que t'es. Joyeux anniversaire, petite merveille que je tenais avec une terreur respectueuse.
Avec souvenir intact et mains encore légèrement tremblantes, — Quelqu'un qui t'a tenu une fois et s'en souvient encore 🤲` },
    { id: 'to_hamster_3', text: `"[Maitre] parle de toi comme si t'étais une célébrité."
Les anecdotes sur toi reviennent au moins trois fois par conversation. T'as plus de présence dans cette vie que la plupart des gens connus. Joyeux anniversaire, star du quotidien à fourrure miniature.
Avec légère jalousie et admiration totale, — Quelqu'un qui arrive loin derrière toi dans les conversations 🎙️` },
    { id: 'to_hamster_4', text: `"J'ai cherché un cadeau d'anniversaire pour un hamster."
Internet m'a proposé des roues, des tunnels, des balles roulantes et un spa pour rongeurs. J'ai pris la balle roulante parce que l'image était drôle. [Maitre] m'a dit que tu allais adorer. J'espère. Joyeux anniversaire, consommateur exigeant de produits de niche.
Avec recherches approfondies et budget raisonnable, — Un fournisseur officiel de matériel roulant 🔮` },
    { id: 'to_hamster_5', text: `"Je comprends pas comment quelque chose d'aussi petit peut prendre autant de place."
Dans la cage d'abord, t'as tout réorganisé à ta façon. Dans l'appartement ensuite, tout tourne autour de toi. Dans la vie de [Maitre] surtout, t'es partout. Joyeux anniversaire, phénomène miniature à impact maximum.
Avec incompréhension bienveillante et fascination réelle, — Celui/celle qui essaie de comprendre ton pouvoir 🔬` },
    { id: 'to_hamster_6', text: `"[Maitre] m'a appelé un soir : introuvable dans la cage."
Vingt minutes de panique au téléphone. T'étais dans ton tube. Endormi. Comme d'habitude. On a raccroché soulagés tous les deux. Toi t'as continué à dormir sans te douter de rien. Joyeux anniversaire, source d'angoisses nocturnes involontaires.
Avec soulagement mémorisé et numéro toujours en favoris, — Une oreille attentive pour les crises hamster à 22h 📞` },
    { id: 'to_hamster_7', text: `"J'ai vu une vidéo de toi sur le téléphone de [Maitre]."
T'étais en train de manger une graine avec une concentration et un sérieux qui m'ont ému. Deux minutes de vidéo. J'ai regardé jusqu'au bout. J'ai trouvé ça fascinant. Je remets en question mes centres d'intérêt. Joyeux anniversaire, créateur involontaire de contenu captivant.
Avec deux minutes de ma vie parfaitement investies, — Une présence conquise sans résistance 🎬` },
    { id: 'to_hamster_8', text: `"Je sais pas si tu dors la nuit ou si tu fais semblant."
[Maitre] dit que t'es nocturne. Que t'es en pleine forme à 3h du matin. Que la roue tourne pendant des heures dans le noir. Je trouve ça à la fois impressionnant et légèrement inquiétant. Joyeux anniversaire, créature de la nuit aux activités mystérieuses.
Avec curiosité mêlée de respect, — Quelqu'un qui dort pendant tes meilleures heures 🌙` },
    { id: 'to_hamster_9', text: `"[Maitre] t'a fait un gâteau spécial graines et légumes."
Il/elle a passé une heure dessus. La fierté était totale. T'as mangé le coin gauche en quatre secondes et t'es reparti. Une photo du gâteau entamé a quand même été prise. Joyeux anniversaire, critique gastronomique au palais sélectif.
Avec respect pour [Maitre] aux talents pâtissiers et compassion pour son ego, — Un témoin attendri de vos échanges culinaires 🎂` },
    { id: 'to_hamster_10', text: `"Je pensais pas qu'on pouvait s'attacher autant à un hamster."
Et puis [Maitre] t'a montré. La façon de te regarder. De s'inquiéter. De raconter tes exploits quotidiens comme si tu avais décroché la lune. Et maintenant moi aussi j'attends des nouvelles. Moi aussi je demande comment tu vas. Moi aussi j'ai ta photo dans mon téléphone. Joyeux anniversaire, petit être qui élargit les cœurs sans effort.
Avec attachement inattendu et totalement assumé, — Un fan officiel numéro deux, conquis sans prévenir ❤️` },
  ],
  lapin: [
    { id: 'to_rabbit_1', text: `"Joyeux anniversaire petite boule de poils."
[Maitre] m'a envoyé ta photo ce matin. T'avais les oreilles en arrière et un air de quelqu'un qui supporte le monde avec dignité. J'ai trouvé ça profondément beau. Joyeux anniversaire, philosophe aux grandes oreilles.
Avec admiration pour ton maintien et ta sérénité apparente, — Un fan du matin qui reçoit les photos avant son café 📱` },
    { id: 'to_rabbit_2', text: `"On s'est rencontrés chez [Maitre] un dimanche."
T'es venu renifler mes chaussures. Puis tu t'es assis à exactement 30 centimètres de moi. Ni plus ni moins. Comme si t'avais calculé la distance de sécurité optimale. J'ai respecté ça. On s'est regardés. C'était un moment. Joyeux anniversaire, être aux frontières précises et respectables.
Avec respect total de tes 30 centimètres, — Quelqu'un qui n'a jamais franchi la limite 📐` },
    { id: 'to_rabbit_3', text: `"[Maitre] t'a construit un parcours de jeu le week-end dernier."
Tunnels. Rampes. Obstacles. Quatre heures de travail pour toi. T'as reniflé l'entrée du premier tunnel. T'es reparti sur ton coussin. Une photo du parcours vide a quand même été envoyée. Joyeux anniversaire, juge impitoyable des initiatives.
Avec compassion pour [Maitre] aux talents de bricolage et admiration pour toi, — Un témoin de ses efforts non reconnus 🔨` },
    { id: 'to_rabbit_4', text: `"Je savais pas que les lapins pouvaient bouder."
[Maitre] m'a expliqué que quand tu tournes le dos et que tu t'assieds dans le coin c'est que t'es vexé. Que ça peut durer des heures. Que la seule solution c'est de s'excuser verbalement et sincèrement. À un lapin. Joyeux anniversaire, inventeur du silence punitif.
Avec respect pour tes techniques de communication avancées, — Celui/celle qui prendra des notes pour usage personnel 📓` },
    { id: 'to_rabbit_5', text: `"[Maitre] m'a dit que tu faisais des binkies quand t'es heureux."
J'ai cherché ce que c'était. J'ai regardé une vidéo. T'as sauté en l'air en faisant une rotation complète et t'as atterri comme si de rien n'était. J'ai regardé la vidéo six fois. Joyeux anniversaire, la plus pure expression de joie que j'ai jamais vue.
Avec six visionnages et sourire persistant, — Un regard converti aux binkies 💫` },
    { id: 'to_rabbit_6', text: `"J'ai apporté des carottes. Les meilleures. Celles du marché."
[Maitre] m'avait dit que tu étais difficile. Que t'aimais les carottes mais pas n'importe lesquelles. Que la texture comptait. La fraîcheur aussi. J'ai pris ça au sérieux. Je les ai choisies une par une. Joyeux anniversaire, gourmet exigeant qui mérite le meilleur.
Avec sélection rigoureuse et attente de ton verdict, — Un fournisseur officiel de carottes premium 🥕` },
    { id: 'to_rabbit_7', text: `"[Maitre] m'a montré comment te faire des câlins correctement."
Y'a une technique apparemment. Une façon de poser les mains. Un endroit précis derrière les oreilles. Un rythme. Une durée. J'ai pris des notes mentales. J'ai essayé. T'as fermé les yeux deux secondes. C'était ma plus grande victoire de l'année. Joyeux anniversaire, être aux câlins techniques et précis.
Avec technique maîtrisée et victoire chérie, — Un bras certifié niveau débutant 🤲` },
    { id: 'to_rabbit_8', text: `"Je comprends pas pourquoi t'es aussi silencieux."
Les chiens aboient. Les chats ronronnent. Les oiseaux chantent. Toi tu communiques avec des mouvements d'oreilles et des regards que seul [Maitre] décode. C'est mystérieux. C'est élégant. C'est légèrement intimidant. Joyeux anniversaire, maître du langage non verbal.
Avec incompréhension respectueuse et admiration sincère, — Quelqu'un qui essaie encore de te lire 👂` },
    { id: 'to_rabbit_9', text: `"[Maitre] t'a fait une séance photo pour ton anniversaire."
Chapeau de fête. Petit décor. Lumière soignée. T'as regardé l'objectif exactement une fois. Une seule. La photo est magnifique. Encadrée dans le salon maintenant. T'as l'air d'un monarque qui accorde une audience. Joyeux anniversaire, modèle naturel sans effort apparent.
Avec admiration pour ton instinct photographique inné, — Un fan de ta photo encadrée au salon 👑` },
    { id: 'to_rabbit_10', text: `"Je pensais que les lapins c'était simple à avoir."
[Maitre] m'a détrompé. Alimentation spécifique. Espace vital calculé. Stimulation intellectuelle quotidienne. Vétérinaire spécialisé. Bouderies à gérer. Câlins techniques. T'es un projet de vie complet. Joyeux anniversaire, être infiniment plus complexe que prévu et infiniment plus attachant.
Avec idées reçues définitivement balayées, — Celui/celle que tu as rendu humble 🎓` },
  ],
  perroquet: [
    { id: 'to_parrot_1', text: `"Joyeux anniversaire. Tu m'as dit bonjour la dernière fois que je suis venu."
[Maitre] dit que tu fais pas ça avec tout le monde. Que tu choisis. Que c'est un honneur. J'ai pris ça très au sérieux. J'ai même un peu les larmes aux yeux en l'écrivant. Joyeux anniversaire, sélectionneur au goût irréprochable.
Avec fierté disproportionnée et totalement assumée, — Celui/celle que tu as daigné saluer 🏆` },
    { id: 'to_parrot_2', text: `"T'as répété mon prénom la dernière fois que je suis venu."
Juste une fois. Avec ton accent. Avec ta voix. T'avais l'air de tester le son. De l'évaluer. De décider si ça valait la peine d'être conservé. J'attends encore le verdict. Joyeux anniversaire, juge suprême du patrimoine sonore de l'appartement.
Avec prénom soumis à ton appréciation depuis six mois, — Celui/celle en attente de ta validation définitive 🎙️` },
    { id: 'to_parrot_3', text: `"[Maitre] m'avait prévenu de pas répéter certaines choses devant toi."
J'ai fait attention pendant deux heures. Puis j'ai oublié. J'ai raconté l'anecdote du week-end. Celle avec le parking et la voiture de location. T'as eu l'air très intéressé. Je prie pour que tu l'aies pas stockée. Joyeux anniversaire, coffre-fort à plumes que je surveille désormais.
Avec inquiétude modérée et comportement exemplaire depuis lors, — Celui/celle qui choisit ses mots très soigneusement maintenant 😬` },
    { id: 'to_parrot_4', text: `"T'as une mémoire qui me dépasse complètement."
[Maitre] m'a dit que tu te souviens de chaque voix. Chaque son. Chaque mot entendu une seule fois. Que tu peux les ressortir des années après. Dans un silence. Devant des inconnus. Au moment le plus inattendu. Joyeux anniversaire, encyclopédie vivante aux plumes colorées.
Avec respect mêlé de crainte respectueuse, — Celui/celle qui surveille ses paroles depuis ta rencontre 📚` },
    { id: 'to_parrot_5', text: `"Je t'ai apporté des fruits exotiques pour ton anniversaire."
Mangue. Papaye. Fruit de la passion. [Maitre] m'a dit que t'étais gourmet. Que tu crachais ce que t'aimais pas avec une précision chirurgicale et sans avertissement. Je me suis placé prudemment sur le côté. Joyeux anniversaire, critique gastronomique à l'expression directe.
Avec plateau soigneusement préparé et distance de sécurité maintenue, — Ton fournisseur de fruits debout légèrement sur le côté 🥭` },
    { id: 'to_parrot_6', text: `"T'as chanté quand je suis arrivé."
Pas un mot. Une mélodie. Quelque chose de reconnaissable mais que j'arrivais pas à identifier. [Maitre] a dit que tu composais parfois. Que c'était tes propres créations. J'avais un concert privé sans le savoir. Joyeux anniversaire, compositeur génial au public non averti.
Avec oreilles désormais toujours en alerte chez toi, — Un regard conquis par tes concerts improvisés 🎼` },
    { id: 'to_parrot_7', text: `"La première fois qu'on s'est rencontrés tu m'as regardé de haut."
Littéralement. T'étais sur ton perchoir. Je suis grand pourtant. T'avais quand même l'air de me toiser. De m'évaluer. De rendre un verdict intérieur. Je saurai jamais ce que t'as conclu. Joyeux anniversaire, juge perché aux conclusions impénétrables.
Avec verdict accepté sans appel possible, — Quelqu'un qui a passé ton examen sans connaître sa note ⚖️` },
    { id: 'to_parrot_8', text: `"[Maitre] m'a dit que tu faisais des crises de jalousie."
Que quand le téléphone accapare l'attention tu cries plus fort. Que quand quelqu'un d'autre accapare la conversation tu interviens. Que quand tu es ignoré trop longtemps tu inventes un bruit d'alarme. Je trouve ça absolument légitime. Joyeux anniversaire, être aux besoins clairement exprimés.
Avec solidarité totale pour tes méthodes, — Quelqu'un qui aurait fait pareil à ta place 📣` },
    { id: 'to_parrot_9', text: `"J'ai essayé de te siffler un air."
T'as écouté. T'as attendu que je finisse. T'as reproduit exactement ce que j'avais sifflé mais mieux. Plus juste. Avec une variation à la fin que j'avais pas prévue et qui était franchement meilleure que mon original. Joyeux anniversaire, arrangeur de talent qui améliore tout ce qu'il touche.
Avec humilité musicale et leçon retenue, — Un élève devenu moins bon que le prof en trente secondes 🎹` },
    { id: 'to_parrot_10', text: `"Je comprends pourquoi [Maitre] est aussi attaché à toi."
T'es unique. Vraiment. Dans le sens propre du terme. Y'a pas deux comme toi. Ta voix. Tes couleurs. Ta mémoire. Ta personnalité. Ta façon d'être présent dans une pièce comme personne d'autre. Joyeux anniversaire, être irremplaçable dans tous les sens du terme.
Avec admiration sincère et compréhension tardive mais totale, — Quelqu'un que tu as définitivement su conquérir 🌈` },
  ],
  cochon_d_inde: [
    { id: 'to_guinea_1', text: `"Joyeux anniversaire petite merveille."
[Maitre] m'a envoyé une vidéo de toi ce matin en train de manger du poivron rouge. T'avais l'air d'un gourmet en pleine dégustation. Concentré. Sérieux. Totalement absorbé par l'expérience. J'ai regardé ça trois fois. Joyeux anniversaire, épicurien·ne à temps plein.
Avec admiration pour ton rapport au plaisir simple, — Un fan du poivron rouge et de toi 🫑` },
    { id: 'to_guinea_2', text: `"On s'est rencontrés et t'as fait un son que je connaissais pas."
[Maitre] a dit que c'était un wheek de curiosité. Que c'était bon signe. J'ai cherché 'wheek cochon d'inde' sur internet ce soir-là. J'ai passé deux heures à regarder des vidéos. C'est ta faute. Joyeux anniversaire, responsable de mon nouveau terrier internet.
Avec deux heures de vie bien investies et aucun regret, — Quelqu'un que t'as rendu accro aux vidéos de cochons d'inde 📺` },
    { id: 'to_guinea_3', text: `"[Maitre] t'a fait un plateau de légumes pour ton anniversaire."
Poivron. Concombre. Carotte. Persil. Disposés avec soin. Joliment présentés. T'as commencé par le persil. T'as ignoré le concombre. T'as regardé la carotte avec une indifférence polie. [Maitre] prenait des notes. Joyeux anniversaire, cobaye culinaire aux préférences précises et évolutives.
Avec respect pour la complexité de tes goûts, — Un témoin de la prise de notes désespérée de [Maitre] 📋` },
    { id: 'to_guinea_4', text: `"Je savais pas que les cochons d'inde étaient aussi riches."
[Maitre] m'a expliqué que vous étiez des animaux sociaux. Que vous aviez besoin de compagnie. Que vous communiquiez. Que vous aviez des personnalités distinctes. J'avais une image de petite chose silencieuse dans une cage. T'as tout contredit. Joyeux anniversaire, être infiniment plus riche que prévu.
Avec idées reçues pulvérisées et curiosité rouverte, — Quelqu'un que tu as instruit sans le savoir 🎓` },
    { id: 'to_guinea_5', text: `"J'ai entendu ton wheek depuis l'entrée en arrivant."
Fort. Clair. Insistant. [Maitre] a dit que tu faisais ça quand tu entendais la porte. Que tu reconnaissais les gens. Que tu avais un wheek différent pour chaque personne. J'ai eu le mien. Personnel. Unique. J'en suis fier comme d'un trophée. Joyeux anniversaire, compositeur de sonneries personnalisées.
Avec mon wheek gravé dans le cœur, — Quelqu'un qui a eu droit à sa propre mélodie 🎵` },
    { id: 'to_guinea_6', text: `"[Maitre] m'a montré comment te tenir."
Y'a une façon. Une bonne façon. On soutient le derrière. On tient bien. On reste bas. On parle doucement. J'ai suivi les instructions à la lettre. T'as regardé devant toi pendant trente secondes avec cet air de dignitaire en visite officielle. C'était majestueux. Joyeux anniversaire, être au protocole strict et justifié.
Avec technique validée et souvenir précieux, — Un bras agréé après formation 🤲` },
    { id: 'to_guinea_7', text: `"T'es plus photogénique que la plupart des gens que je connais."
[Maitre] a un album entier dédié à toi sur son téléphone. J'ai fait défiler. Y'a des photos de toi qui manges. Qui dors. Qui regardes dans le vide. Qui fais des têtes impossibles. Chacune est meilleure que la précédente. Joyeux anniversaire, modèle naturel sans ego ni agent.
Avec jalousie photographique assumée, — Celui/celle qui rate toutes ses photos quand toi t'en rates aucune 📸` },
    { id: 'to_guinea_8', text: `"J'ai appris que vous pouviez souffrir de solitude."
[Maitre] me l'a dit avec un sérieux qui m'a marqué. Que vous aviez besoin d'un congénère. De présence. De chaleur. De lien. Et j'ai regardé comment [Maitre] te parle. Te câline. Passe du temps avec toi. Et j'ai compris que [Maitre] avait tout compris. Joyeux anniversaire, être qui inspire le meilleur chez ceux qui t'aiment.
Avec émotion inattendue et admiration pour votre lien, — Un témoin ému de votre belle histoire 💛` },
    { id: 'to_guinea_9', text: `"T'as fait un popcorning devant moi une fois."
[Maitre] a crié 'ça popcorne !' J'ai rien compris. Et puis t'as sauté en l'air comme une pop-corn qui éclate. Plusieurs fois. Dans tous les sens. Avec une joie pure et absolue que j'ai rarement vue chez un être vivant. Joyeux anniversaire, champion olympique de la joie exprimée.
Avec ce moment gravé parmi mes meilleurs souvenirs, — Quelqu'un que t'as rendu joyeux par ricochet 🍿` },
    { id: 'to_guinea_10', text: `"Je comprends pas comment quelque chose d'aussi petit peut autant compter."
Pour [Maitre]. Pour moi maintenant. Pour tous ceux qui t'ont rencontré. T'as cette faculté rare de t'installer dans les cœurs sans prévenir et d'y rester. Définitivement. Joyeux anniversaire, petit être à l'impact immense et durable.
Avec place réservée dans mon cœur sans que je l'aie vu venir, — Un cœur conquis sans résistance possible ❤️` },
  ],
  souris: [
    { id: 'to_mouse_1', text: `"Joyeux anniversaire petite étoile blanche."
[Maitre] m'a envoyé une photo de toi ce matin. T'étais assis sur son épaule. Toute blanche sur son pull noir. Comme un flocon de neige qui aurait choisi de rester. C'était la plus belle photo que j'ai reçue depuis longtemps. Joyeux anniversaire, contraste vivant et magnifique.
Avec photo sauvegardée en fond d'écran depuis ce matin, — Un fan photographique numéro un 🤍` },
    { id: 'to_mouse_2', text: `"Je t'avoue que j'avais des a priori sur les souris."
Le mot 'souris' m'évoquait des choses. Des films. Des pièges. Des cris dans des cuisines. Et puis [Maitre] m'a montré comment tu grimpais sur son bras. Comment tu venais renifler son oreille. Comment tu t'endormais dans sa poche de chemise. Joyeux anniversaire, être qui détruit les préjugés un par un.
Avec préjugés définitivement et joyeusement abandonnés, — Quelqu'un que t'as su convaincre sans effort 🔄` },
    { id: 'to_mouse_3', text: `"Tes yeux rouges m'ont d'abord surpris."
Puis [Maitre] m'a dit que c'était juste de la mélanine. Que c'était beau. Que ça te donnait un regard unique. Et maintenant je trouve ça magnifique. Ce regard rouge sur du blanc immaculé. Comme deux rubis sertis dans de la nacre. Joyeux anniversaire, joyau vivant mal compris du grand public.
Avec perception définitivement transformée, — Quelqu'un qui trouve tes yeux rouges absolument beaux maintenant 💎` },
    { id: 'to_mouse_4', text: `"[Maitre] t'a construit un labyrinthe pour ton anniversaire."
Trois heures de construction. Carton. Tunnels. Bifurcations. Une récompense au centre. T'as trouvé le chemin en quarante secondes. T'as mangé la récompense. T'es reparti. [Maitre] a regardé son œuvre en silence. Joyeux anniversaire, génie logique au sens du timing parfait.
Avec compassion pour l'architecte et admiration pour l'exploit, — Un témoin de ta victoire éclair 🏆` },
    { id: 'to_mouse_5', text: `"Je t'ai tendu le doigt la dernière fois."
[Maitre] m'avait dit d'approcher doucement. De pas faire de mouvement brusque. De laisser faire. T'as reniflé. T'as tourné autour. T'as reniflé encore. Puis t'as grimpé sur ma main comme si t'avais décidé que j'étais acceptable. C'était le plus beau bulletin de notes de ma vie. Joyeux anniversaire, examinatrice au jugement définitif.
Avec mention très bien chérie pour toujours, — Celui/celle qui a passé ton test avec fierté ✅` },
    { id: 'to_mouse_6', text: `"[Maitre] t'appelle par ton prénom avec une intonation particulière."
Douce. Montante. Répétée. Et toi tu réagis. Tu lèves la tête. Tu cherches la voix. T'as appris ton prénom. T'as appris sa voix. T'as appris que les deux ensemble ça voulait dire quelque chose de bien. Joyeux anniversaire, être linguistique plus développé qu'on l'imagine.
Avec émerveillement sincère pour tes capacités, — Quelqu'un qui sous-estimait les souris et qui le regrette 🔤` },
    { id: 'to_mouse_7', text: `"[Maitre] garde une poche libre dans sa chemise pour toi."
Systématiquement. Consciemment. Comme on garde une place dans une voiture pour un ami. Comme on réserve un siège à table. Cette poche c'est ta place dans sa vie. Concrète. Textile. Réservée. Joyeux anniversaire, passager permanent de la vie de quelqu'un.
Avec émotion pour ce geste simple et immense, — Quelqu'un qui a remarqué la poche toujours libre 👕` },
    { id: 'to_mouse_8', text: `"Je t'ai apporté des graines spéciales pour ton anniversaire."
[Maitre] m'a donné une liste. Précise. Avec des choses à éviter. Des préférences connues. Des textures appréciées. J'ai suivi la liste à la lettre. T'as tout reniflé méthodiquement. T'as commencé par ta chose préférée. J'avais bien travaillé. Joyeux anniversaire, gourmet à la liste de préférences bien tenue.
Avec devoir accompli et satisfaction du travail bien fait, — Un fournisseur de graines agréé après briefing complet 🌱` },
    { id: 'to_mouse_9', text: `"Je sais pas comment t'es aussi rapide."
T'es minuscule. T'as des toutes petites pattes. Et pourtant quand tu décides d'aller quelque part t'es déjà là-bas avant qu'on ait compris que tu partais. [Maitre] dit que c'est normal. Moi je trouve ça surnaturel. Joyeux anniversaire, être à la vitesse inversement proportionnelle à la taille.
Avec admiration pour ta physique défiant les lois du bon sens, — Quelqu'un qui t'a perdu des yeux en une demi-seconde ⚡` },
    { id: 'to_mouse_10', text: `"Je comprends maintenant pourquoi [Maitre] t'aime comme ça."
T'es petite mais présente. Silencieuse mais vivante. Fragile mais courageuse. Différente mais parfaite. T'es exactement ce dont certains ont besoin sans le savoir. Un être qui tient dans une main et qui remplit un cœur entier. Joyeux anniversaire, grande âme en tout petit corps.
Avec compréhension tardive et totalement sincère, — Quelqu'un que t'as convaincu que la taille ne compte pas 🤍` },
  ],
  poisson: [
    { id: 'to_fish_1', text: `"Joyeux anniversaire petit amnésique adoré."
[Maitre] m'a dit que t'avais une mémoire de trois secondes. J'ai vérifié sur internet. C'est un mythe. T'as en réalité une mémoire de plusieurs mois. Mais honnêtement la version mythologique te va tellement mieux que je préfère y croire. Joyeux anniversaire, légende vivante plus vraie que la réalité.
Avec fact-checking abandonné au profit du romantisme, — Quelqu'un qui préfère le mythe à la vérité 🔬` },
    { id: 'to_fish_2', text: `"On s'est rencontrés la dernière fois que je suis venu."
T'as nagé vers moi. T'as ouvert la bouche. T'es reparti. J'ai pris ça pour un bonjour. [Maitre] a dit que tu faisais ça avec tout le monde. J'ai décidé que pour moi c'était différent. Joyeux anniversaire, être dont j'interprète chaque geste à mon avantage.
Avec projection émotionnelle totalement assumée, — Quelqu'un que ton bonjour générique a quand même touché 🐟` },
    { id: 'to_fish_3', text: `"[Maitre] te parle."
Vraiment. En rentrant. En te nourrissant. En passant devant ton bocal. Des vraies phrases. Des vraies nouvelles de sa journée. T'ouvres la bouche. Tu fais des bulles. C'est pris pour une vraie réponse. Vous avez l'air de vous comprendre parfaitement. Joyeux anniversaire, interlocuteur idéal qui ne juge jamais.
Avec légère jalousie pour ta capacité d'écoute sans interruption, — Un témoin de vos conversations aquatiques 💬` },
    { id: 'to_fish_4', text: `"J'ai tapé sur la vitre en arrivant."
T'as nagé vers moi. J'étais ravi. Puis t'as continué à nager. Droit devant. Comme si j'avais jamais existé. J'ai retapé. T'as refait un tour. On a recommencé trois fois. C'était notre conversation. Elle était belle à sa façon. Joyeux anniversaire, partenaire de dialogue circulaire.
Avec index légèrement endolori et bonne humeur intacte, — Une présence à travers la vitre 🪟` },
    { id: 'to_fish_5', text: `"[Maitre] t'a mis des décorations dans le bocal pour ton anniversaire."
Un petit drapeau. Des cailloux colorés. Une nouvelle plante. T'as tout redécouvert avec l'air de quelqu'un qui visite un pays étranger magnifique. Quatre fois. Avec le même émerveillement à chaque passage. Joyeux anniversaire, voyageur immobile aux destinations infinies.
Avec émerveillement vicaire pour tes découvertes répétées, — Le/la témoin de tes quatre premières fois simultanées 🗺️` },
    { id: 'to_fish_6', text: `"Je t'ai apporté de la nourriture spéciale pour ton anniversaire."
[Maitre] m'avait briefé. Dosage précis. Pas trop. Juste ce qu'il faut. J'ai respecté la consigne. T'as mangé en trois secondes avec une concentration totale et une joie pure. Puis t'as continué à nager comme si rien s'était passé. Joyeux anniversaire, être dont le bonheur est simple, immédiat et complet.
Avec leçon de vie reçue cinq fois d'affilée, — Celui/celle que tu as rendu jaloux de ta simplicité 🍽️` },
    { id: 'to_fish_7', text: `"Je sais pas si tu te souviens de moi."
Statistiquement non. Émotionnellement j'espère que si. [Maitre] dit que t'as de bonnes capacités de reconnaissance en réalité. Alors peut-être. Peut-être que quelque part dans ton cerveau de poisson il y a un tout petit fichier avec mon visage dedans. Joyeux anniversaire, archiviste mystérieux de mes espoirs.
Avec optimisme inversement proportionnel aux probabilités, — Celui/celle qui croit être dans ta mémoire quelque part 🗂️` },
    { id: 'to_fish_8', text: `"T'as l'air serein."
Vraiment. Profondément. T'as pas de réunions. Pas de mails. Pas de lundi matin. Pas de questions existentielles visibles. Juste le bocal. Le château. Les cailloux. L'eau. Et toi dedans. Joyeux anniversaire, maître zen que j'observe avec une envie croissante.
Avec jalousie profonde et thérapie envisagée, — Quelqu'un qui aimerait ta vie pendant cinq minutes 🧘` },
    { id: 'to_fish_9', text: `"Ton bocal est toujours propre. Ton eau toujours claire."
[Maitre] fait ça sans que tu le demandes. Sans que tu le remarques vraiment. Sans attendre de remerciements. C'est de l'amour pur. Discret. Régulier. Invisible. Joyeux anniversaire, choyé en silence par quelqu'un qui t'aime sans calcul.
Avec émotion pour cette belle dynamique silencieuse, — Un témoin de l'amour aquatique quotidien 💙` },
    { id: 'to_fish_10', text: `"Je comprends pas vraiment ta vie. Mais je la trouve belle."
Un cercle. Un château. De l'eau claire. De la nourriture qui arrive. [Maitre] qui passe et qui sourit. C'est simple. C'est complet. C'est tout ce qu'il faut peut-être. Joyeux anniversaire, philosophe aquatique dont j'essaie d'apprendre la sagesse.
Avec admiration sincère pour ton existence épurée, — Quelqu'un que ton bocal a rendu pensif 🌊` },
  ],
  tortue: [
    { id: 'to_turtle_1', text: `"Joyeux anniversaire sage créature."
[Maitre] m'a dit quel âge tu avais. J'ai recalculé trois fois parce que je croyais pas. T'as vécu des choses que j'imagine même pas. Des époques. Des modes. Des présidents. Des technologies. Et te voilà là. Tranquille. Imperturbable. Joyeux anniversaire, survivant de l'histoire moderne.
Avec respect profond et complexe d'infériorité temporelle, — Quelqu'un qui a trois fois moins vécu que toi 📜` },
    { id: 'to_turtle_2', text: `"On s'est rencontrés il y a longtemps."
T'étais déjà là avant que je connaisse [Maitre]. T'étais là quand on s'est rencontrés. T'es là maintenant. T'as vu notre amitié naître et grandir depuis ton coin. T'es le témoin le plus ancien de notre histoire. Joyeux anniversaire, archiviste vivant de nos vies.
Avec gratitude pour ta continuité rassurante, — Quelqu'un que tu observes depuis le début 🏛️` },
    { id: 'to_turtle_3', text: `"[Maitre] m'a dit que tu reconnaissais les gens."
Que t'avais ta façon de réagir différemment selon les personnes. Que tu savais qui t'aimait vraiment. Que tu te souvenais. Que tu évaluais. Que ton verdict était définitif. J'espère que j'ai eu la bonne note. Joyeux anniversaire, juge implacable à la mémoire longue.
Avec comportement exemplaire maintenu depuis notre première rencontre, — Quelqu'un qui essaie de rester dans tes bonnes grâces ⚖️` },
    { id: 'to_turtle_4', text: `"J'ai essayé de trouver un cadeau adapté à une tortue."
Internet m'a proposé des cachettes. Des lampes chauffantes. Des légumes spéciaux. Des pierres plates pour se reposer. J'ai pris la pierre. Elle est belle. Plate. Parfaite. [Maitre] dit que tu vas l'ignorer pendant trois semaines puis l'adopter définitivement. J'attends. Joyeux anniversaire, être aux adoptions lentes et définitives.
Avec patience infinie et pierre déposée sans pression, — Un fournisseur officiel de pierres plates en attente de validation 🪨` },
    { id: 'to_turtle_5', text: `"T'avances lentement. Mais t'avances."
Je t'ai observé traverser le salon une fois. Ça a pris du temps. T'as pas dévié. T'as pas accéléré. T'as pas regardé si on te regardait. T'avais un but. T'es arrivé. C'était la leçon de management la plus efficace que j'aie jamais reçue. Joyeux anniversaire, consultant en efficacité à taux horaire lent mais rentable.
Avec leçon appliquée dès le lendemain au bureau, — Un élève en développement personnel involontaire 📈` },
    { id: 'to_turtle_6', text: `"[Maitre] te parle différemment qu'aux autres animaux."
Lentement. Calmement. Comme si le rythme s'adaptait naturellement au tien. Comme si ta sérénité était contagieuse. J'ai essayé de faire pareil. Ça m'a pris dix minutes pour dire bonjour. C'était la conversation la plus apaisante de ma semaine. Joyeux anniversaire, régulateur de rythme.
Avec débit verbal ralenti et tension artérielle améliorée, — Quelqu'un que t'as appris à souffler 🌬️` },
    { id: 'to_turtle_7', text: `"J'ai regardé des documentaires sur les tortues pour préparer cette visite."
Vous avez vécu avec les dinosaures. Vous avez survécu à des extinctions. Vous avez traversé des millions d'années sans changer de design parce que le design était parfait dès le début. Je me sens très jeune et très provisoire à côté de toi. Joyeux anniversaire, chef d'œuvre évolutif intemporel.
Avec humilité géologique et admiration sincère, — Quelqu'un que l'évolution a moins bien réussi 🦕` },
    { id: 'to_turtle_8', text: `"T'as une carapace qui te protège."
Les chocs. Le froid. Le regard des autres. Les mauvais jours. Je n'ai pas ça. Je prends tout en pleine face. Parfois j'aimerais juste pouvoir rentrer dedans cinq minutes et attendre que ça passe. T'as inventé la meilleure solution du monde. Joyeux anniversaire, ingénieur de génie de la protection personnelle.
Avec envie profonde de ta carapace les lundis matin, — Quelqu'un qui commande la sienne sur internet depuis des années 🛡️` },
    { id: 'to_turtle_9', text: `"[Maitre] prend soin de toi avec une régularité qui force le respect."
Chaque jour. Même rythme. Même attention. Même amour tranquille. Vous avez trouvé votre tempo ensemble. Lent. Stable. Durable. C'est la relation la plus solide que je connaisse. Joyeux anniversaire, partenaire d'une histoire qui s'inscrit dans le temps long.
Avec admiration pour votre rythme commun parfaitement accordé, — Un témoin de votre belle lenteur partagée 🤝` },
    { id: 'to_turtle_10', text: `"Je sais pas combien d'anniversaires tu vas encore avoir."
Beaucoup probablement. Plus que moi peut-être. Et à chacun je veux être là. Parce que t'es devenu important sans que je m'en rende compte. Comme les choses lentes et solides le font. Progressivement. Définitivement. Joyeux anniversaire, présence discrète devenue indispensable.
Avec attachement tardif mais total, — Quelqu'un que t'as su conquérir, lentement et pour toujours 🐢❤️` },
  ],
};

function adaptToNameday(text: string): string {
  return text
    .replace(/Joyeux anniversaire/g, 'Bonne fête')
    .replace(/joyeux anniversaire/g, 'bonne fête')
    .replace(/[Tt]on anniversaire/g, 'ta fête')
    .replace(/[Cc]'est ton anniversaire/g, "c'est ta fête")
    .replace(/[Uu]n an de plus pour toi\./g, "C'est ta fête aujourd'hui.")
    .replace(/[Aa]nniversaire/g, 'fête');
}

export function getPetMessages(
  petType: PetType | null | undefined,
  petName: string,
  civilite?: 'M.' | 'Mme' | null,
  ownerName?: string,
  occasion?: 'birthday' | 'nameday',
): string[] {
  const type: PetType = (petType as PetType) || 'autre';
  const messages = PET_MESSAGES[type] ?? PET_MESSAGES['chien'] ?? [];
  const monMaitre = resolveMonMaitre(civilite);
  const ownerFirst = extractFirstName(ownerName ?? '');
  return messages.map((m) => {
    let text = m.text
      .replace(/\[Prénom animal\]/g, petName)
      .replace(/\[NOM_ANIMAL\]/g, petName)
      .replace(/\[mon maître\/ma maîtresse\]/g, monMaitre)
      .replace(/\[Maitre\]/g, ownerFirst);
    if (occasion === 'nameday') text = adaptToNameday(text);
    return text;
  });
}

export function getPetMessagesTo(
  petType: PetType | null | undefined,
  petName: string,
  ownerName?: string,
  occasion?: 'birthday' | 'nameday',
): string[] {
  const type: PetType = (petType as PetType) || 'autre';
  const messages = PET_MESSAGES_TO[type] ?? [];
  const ownerFirst = extractFirstName(ownerName ?? '');
  return messages.map((m) => {
    let text = m.text
      .replace(/\[Prénom animal\]/g, petName)
      .replace(/\[NOM_ANIMAL\]/g, petName)
      .replace(/\[Maitre\]/g, ownerFirst)
      .replace(/Il\/elle/g, ownerFirst || 'Il/elle');
    if (occasion === 'nameday') text = adaptToNameday(text);
    return text;
  });
}

function extractFirstName(fullName: string): string {
  const parts = fullName.trim().split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : parts[0] ?? '';
}

function resolveMonMaitre(civilite: 'M.' | 'Mme' | null | undefined): string {
  if (civilite === 'M.') return 'mon maître';
  if (civilite === 'Mme') return 'ma maîtresse';
  return 'mon humain';
}