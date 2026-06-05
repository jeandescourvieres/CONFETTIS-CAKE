-- Modèles batch 2 : chat → humain, occasion Bonne Fête (nameday)

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'J''ai su que c''était un jour spécial au type de vaisselle sortie.',
$$Joyeuse fête. J''ai su que c''était un jour spécial au type de vaisselle sortie.
Pas la vaisselle du quotidien. L''autre. Celle du placard du haut. Avec les bords dorés. Que tu sors quatre fois par an maximum. Je connais cette vaisselle. Elle annonce quelque chose. J''ai immédiatement ajusté mon programme de la journée en conséquence. Sieste déplacée. Position de surveillance revue. Stratégie de soirée activée. Joyeuse fête, mon humain préféré, dont les événements se lisent dans les placards.
Avec lecture des signes avant-coureurs et adaptation logistique immédiate, — {prenom}, ton animal météorologue des grandes occasions 🍽️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai refusé le nœud papillon.',
$$Joyeuse fête. J''ai refusé le nœud papillon.
Tu l''avais acheté exprès. Rouge. Avec un élastique. Tu avais l''air tellement content de ton idée. Tu t''es approché avec ce sourire. J''ai reculé d''exactement la distance nécessaire. Tu as avancé. J''ai reculé encore. On a fait le tour du salon deux fois. Tu as fini par poser le nœud sur le canapé. Il y est encore. Je l''ai regardé toute la soirée avec la satisfaction de quelqu''un qui a défendu quelque chose d''essentiel. Joyeuse fête, mon humain préféré.
Avec dignité préservée et nœud papillon définitivement vaincu, — {prenom}, ton animal aux standards vestimentaires non négociables 🎀$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai testé chaque siège libéré par tes invités.',
$$Pour ta fête j''ai testé chaque siège libéré par tes invités.
Chaque fois que quelqu''un se levait j''étais là en moins de dix secondes. La chaise de la cuisine encore chaude. Le fauteuil du salon avec l''empreinte dedans. Le coin du canapé avec le coussin dérangé. Chacun a une température. Une odeur. Une histoire. J''ai tout testé méthodiquement. C''était ma façon de participer à la fête. Une participation discrète mais totale. Joyeuse fête, mon humain préféré.
Avec inventaire thermique des sièges complété et conclusions gardées pour moi, — {prenom}, ton animal testeur de surfaces abandonnées 🪑$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'La lumière était différente ce soir.',
$$Joyeuse fête. La lumière était différente ce soir.
Tu avais allumé des choses que tu allumes pas d''habitude. Des petites lumières dans le couloir. Une bougie sur l''étagère. L''appartement avait une autre texture lumineuse. Plus chaude. Plus étrange aussi. J''ai passé dix minutes à observer comment les ombres avaient changé de place. Mon appartement mais pas tout à fait. En mieux peut-être. Joyeuse fête, mon humain préféré, dont les célébrations transforment l''espace.
Avec cartographie lumineuse mise à jour et verdict rendu prudemment positif, — {prenom}, ton animal architecte de l''atmosphère 💡$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Quelqu''un a voulu me filmer.',
$$Pour ta fête quelqu''un a voulu me filmer.
Le téléphone levé. L''objectif tourné vers moi. Cette façon de s''approcher en croyant être discret. J''ai regardé ailleurs. Puis le plafond. Puis mes pattes. Puis j''ai baillé avec une lenteur calculée. Puis je me suis retourné. La vidéo existe peut-être mais elle ne contient que mon dos et une partie de l''étagère. C''est mon droit à l''image. Je l''exerce. Joyeuse fête, mon humain préféré.
Avec droit à l''image revendiqué et dos photographié avec élégance, — {prenom}, ton animal aux apparitions cadrées selon sa volonté 📱$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai su qui t''aimait vraiment ce soir.',
$$Joyeuse fête. J''ai su qui t''aimait vraiment ce soir.
Pas à ce qu''ils ont dit. À la façon dont ils ont fermé la porte en partant. Certains l''ont claquée légèrement. D''autres l''ont fermée avec soin comme si la maison méritait ce respect. Un seul a regardé en arrière une seconde avant de tirer la poignée. Celui-là. C''est lui. Je note ces choses. Elles en disent plus que les discours. Joyeuse fête, mon humain préféré, entouré de gens que j''ai évalués.
Avec analyse comportementale des départs et classement établi en toute discrétion, — {prenom}, ton animal juge des gestes involontaires 🚪$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai dormi entre toi et la porte toute la soirée.',
$$Pour ta fête j''ai dormi entre toi et la porte toute la soirée.
Pas sur toi. Pas loin. Entre toi et la sortie. Sur le tapis du couloir. En faction. Certains invités ont failli trébucher sur moi deux fois. Je me suis pas déplacé. Ma position était stratégique. Si quelqu''un devait partir avec toi cette nuit il passait d''abord par moi. Personne n''est parti avec toi. Mission accomplie. Joyeuse fête, mon humain préféré.
Avec poste de garde tenu sans relâche et sécurité de la soirée pleinement assurée, — {prenom}, ton animal dernier rempart entre toi et le monde 🛡️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Il y a le silence d''avant et le silence d''après.',
$$Joyeuse fête. Il y a le silence d''avant et le silence d''après.
Avant la fête le silence était tendu. Chargé d''attente. Tu préparais. Tu bougeais. Tu vérifiais. C''était un silence actif. Après la fête quand tout le monde est parti le silence était différent. Plein. Satisfait. Le silence de quelque chose qui s''est bien passé. Je connais tous tes silences. Celui d''après ta fête est parmi mes préférés. Joyeuse fête, mon humain préféré.
Avec dictionnaire personnel des silences et expertise dans leur lecture fine, — {prenom}, ton animal spécialiste du non-dit sonore 🔇$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai mémorisé chaque odeur nouvelle de ce soir.',
$$Pour ta fête j''ai mémorisé chaque odeur nouvelle introduite ce soir.
Le parfum de la dame du troisième. Le manteau en laine mouillée de celui qui était venu à pied. Le bouquet de fleurs dans l''entrée. Le plat qu''on avait apporté. Les bougies. Le vin. En une soirée mon appartement avait absorbé vingt nouvelles histoires. Je les ai toutes enregistrées. L''appartement mettra trois jours à redevenir normal. Joyeuse fête, mon humain préféré.
Avec base de données olfactive enrichie et retour à la normale planifié sous 72 heures, — {prenom}, ton animal archiviste des parfums de passage 👃$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai évalué la qualité acoustique de ta soirée depuis le couloir.',
$$Joyeuse fête. J''ai évalué la qualité acoustique de ta soirée depuis le couloir.
Les rires trop forts : trois occurrences. La musique trop haute pendant vingt minutes : notée. La conversation qui a monté en volume vers 22h : entendue et analysée. Le bruit des verres : acceptable. Le moment de calme vers 21h30 quand tout le monde mangeait : excellent. Bilan global : soirée bruyante mais de bonne qualité. Joyeuse fête, mon humain préféré.
Avec rapport acoustique complet et oreilles remises de leurs émotions, — {prenom}, ton animal critique sonore indépendant 🎚️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Une opinion sur les bougies d''anniversaire.',
$$Pour ta fête je dois exprimer une opinion sur les bougies d''anniversaire.
Cette tradition qui consiste à mettre des flammes sur de la nourriture et demander à quelqu''un de souffler dessus. Avec tout le monde qui regarde. Puis manger ce sur quoi on vient de souffler. C''est objectivement étrange. J''observe ça chaque année avec la même incompréhension totale. Et chaque année tu as l''air sincèrement ravi. C''est fascinant. Joyeuse fête, mon humain préféré, adepte de rituels que je ne comprends pas.
Avec analyse critique du rituel des bougies et mystère intact après toutes ces années, — {prenom}, ton animal anthropologue de tes coutumes 🕯️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai observé comment tu ranges après.',
$$Joyeuse fête. J''ai observé comment tu ranges après.
D''abord les verres. Puis les assiettes. Tu empiles avec une méthode que tu es seul à comprendre. Tu fredonnes parfois. Tu t''arrêtes pour regarder une chose et sourire à une pensée que j''entends pas. Le rangement d''après fête c''est un moment qui t''appartient. Je reste à distance. Je regarde. C''est une des versions de toi que je préfère. Joyeuse fête, mon humain préféré.
Avec observation respectueuse de tes rituels post-fête et distance maintenue avec tendresse, — {prenom}, ton animal spectateur de tes moments solitaires 🍷$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai fait une sieste stratégique de 19h à 22h.',
$$Pour ta fête j''ai fait une sieste stratégique de 19h à 22h.
En plein cœur du bruit maximum. Sur le lit. Porte fermée. Les sons de la fête en fond. Les rires. La musique. Les verres. Tout ça comme une berceuse grave et joyeuse. J''ai dormi profondément. J''ai récupéré mes forces. Je suis réapparu à 22h parfaitement reposé pendant que tout le monde commençait à être fatigué. C''est de la gestion d''énergie. Joyeuse fête, mon humain préféré.
Avec optimisation du repos en contexte festif et retour en forme garanti, — {prenom}, ton animal expert en gestion de l''énergie 😴$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Le moment où le dernier invité est parti était le meilleur.',
$$Joyeuse fête. Le moment où le dernier invité est parti était le meilleur.
La porte s''est fermée. Le bruit s''est arrêté d''un coup. L''appartement a repris sa forme normale. Son odeur normale. Sa température normale. Et toi tu as soupiré et tu t''es laissé tomber dans le canapé. Et là j''ai su que c''était notre moment. Celui qu''on attendait tous les deux sans se le dire. Joyeuse fête, mon humain préféré.
Avec patience récompensée et appartement enfin rendu à ses vrais habitants, — {prenom}, ton animal pour l''après qui vaut tout le pendant ❤️$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai supervisé la préparation du repas depuis le plan de travail.',
$$Pour ta fête j''ai supervisé la préparation du repas depuis le plan de travail.
J''avais une vue dégagée sur tout. Les ingrédients. Les gestes. Les décisions prises sous pression. À deux reprises tu m''as demandé de descendre. J''ai regardé ailleurs. Ma présence était nécessaire. Quelqu''un devait contrôler. Valider. S''assurer que tout se passait correctement. Le repas était bon. Mon rôle dans ce succès est indéniable. Joyeuse fête, mon humain préféré.
Avec supervision culinaire assurée depuis la hauteur et résultat satisfaisant validé, — {prenom}, ton animal chef de cuisine honoraire 🍳$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Ton téléphone a reçu des messages toute la journée.',
$$Joyeuse fête. Ton téléphone a reçu des messages toute la journée.
Buzz après buzz. Chaque fois tu souriais en lisant. Chaque fois tu répondais avec cette expression. J''ai passé la journée à côté de ce téléphone qui monopolisait ton attention avec une efficacité que je trouvais injuste. J''ai fini par m''asseoir dessus. Brièvement. Pour rééquilibrer les priorités. Joyeuse fête quand même, mon humain préféré, dont l''attention est une ressource que je gère.
Avec rééquilibrage des priorités effectué et message envoyé sans mot, — {prenom}, ton animal gestionnaire de ton attention 📲$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai testé chaque cadeau emballé avec le poids de mon corps.',
$$Pour ta fête j''ai testé chaque cadeau emballé avec le poids de mon corps.
Un par un. Dans l''ordre qui me semblait logique. Celui avec le papier brillant d''abord parce que la texture m''intéressait. Puis le grand carré. Puis la boîte longue qui craquait légèrement sous mon poids d''une façon satisfaisante. J''ai passé une heure sur l''ensemble. Tu attendais pour ouvrir. J''ai fini quand j''ai eu fini. Joyeuse fête, mon humain préféré.
Avec contrôle qualité structurel des emballages et certification accordée après inspection, — {prenom}, ton animal ingénieur en résistance des matériaux 📦$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Je ne comprends pas pourquoi vous chantez tous cette chanson.',
$$Joyeuse fête. Je ne comprends pas pourquoi vous chantez tous cette chanson ensemble.
Elle dure vingt secondes. Vous la connaissez tous. Vous la chantez en vous regardant avec des yeux ronds comme si c''était exceptionnel. Puis ça s''arrête et tout le monde applaudit quelque chose qui n''a duré que vingt secondes. J''observe ce rituel chaque année avec une perplexité renouvelée. Et chaque année tu as l''air sincèrement touché. Je garde mes questions pour moi. Joyeuse fête, mon humain préféré.
Avec mystère du joyeux anniversaire collectif intact et questions soigneusement retenues, — {prenom}, ton animal anthropologue des rituels humains 🎂$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai mémorisé les voix de tous ceux qui ont dit ton prénom ce soir.',
$$Pour ta fête j''ai mémorisé les voix de tous ceux qui ont dit ton prénom ce soir.
Chaque voix le dit différemment. Certains avec l''accent de l''amitié longue. D''autres avec la chaleur de l''habitude. Un avec une intonation que j''avais jamais entendue et qui m''a intrigué. Ton prénom dit par dix personnes différentes c''est dix mots différents. Je les ai tous gardés. C''est ma collection du soir. Joyeuse fête, mon humain préféré, dont le prénom a autant de visages.
Avec collection vocale constituée et archivée pour une durée indéterminée, — {prenom}, ton animal musicien des prénoms 🎙️$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'Tu souris différemment ce jour-là.',
$$Joyeuse fête. Tu souris différemment ce jour-là.
Pas le sourire du mardi ordinaire. Pas le sourire quand tu rentres. Pas le sourire quand tu me regardes. Un autre. Plus grand et plus intérieur en même temps. Comme si quelque chose de bien se passait à la fois dehors et dedans. Je l''ai observé toute la journée. Je l''ai mémorisé. Pour les jours où tu souris moins. Pour me souvenir que ce sourire-là existe en toi. Joyeuse fête, mon humain préféré.
Avec catalogue des sourires tenu à jour et celui-ci marqué d''une étoile, — {prenom}, ton animal gardien de tes meilleurs visages 🌟$$,
'touching', true, false, 'nameday', 'chat', 'from')

on conflict do nothing;
