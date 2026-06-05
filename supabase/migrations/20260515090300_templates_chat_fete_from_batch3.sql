-- Modèles batch 3 : chat → humain, occasion Bonne Fête (nameday)

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'J''ai su que c''était aujourd''hui à l''odeur du nettoyage.',
$$Joyeuse fête. J''ai su que c''était aujourd''hui à l''odeur du nettoyage.
Tu avais nettoyé. Vraiment nettoyé. Pas le nettoyage du dimanche soir. L''autre. Avec les produits forts. Qui changent complètement l''atmosphère olfactive de l''appartement pendant plusieurs heures. J''ai dû tout réinspecter depuis le début. Chaque surface. Chaque coin. Recartographier entièrement mon territoire. C''est épuisant. Mais j''ai compris que quelque chose d''important approchait. Joyeuse fête, mon humain préféré, dont le ménage est ma météo.
Avec recartographie complète du territoire post-nettoyage et diagnostic établi, — {prenom}, ton animal dont le nez lit les événements avant qu''ils arrivent 🧹$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Je me suis approprié le bouquet de fleurs.',
$$Pour ta fête je me suis approprié le bouquet de fleurs.
Il était là dans l''entrée. Grand. Coloré. Occupant un espace qui n''avait pas demandé à être occupé. Je me suis assis devant. Puis à côté. Puis j''ai posé une patte dessus très brièvement. C''est mon appartement. Tout ce qui entre dans mon appartement passe sous ma juridiction. Le bouquet a accepté cette réalité avec la dignité des choses qui n''ont pas le choix. Joyeuse fête, mon humain préféré.
Avec prise de juridiction sur les végétaux entrants et autorité établie sans violence, — {prenom}, ton animal souverain de tout ce qui franchit ce seuil 🌺$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai observé chaque invité manger sans jamais rien recevoir.',
$$Pour ta fête j''ai observé chaque invité manger sans jamais rien recevoir.
Une heure et demie. Les assiettes qui passaient. Les odeurs qui montaient. Les mains qui portaient des choses à la bouche sans jamais dévier vers moi. J''étais là pourtant. Visible. Expressif. Mon regard allait d''une assiette à l''autre avec une clarté que j''estimais impossible à ignorer. Et pourtant. Tout le monde a mangé. Personne n''a rien partagé. Joyeuse fête quand même, mon humain préféré.
Avec campagne de regard intense menée sans succès et leçon d''ingratitude collective reçue, — {prenom}, ton animal dont les appels à la générosité restent sans écho 🍽️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai entendu comment tu parles de moi aux gens qui ne me connaissent pas.',
$$Joyeuse fête. J''ai entendu comment tu parles de moi aux gens qui ne me connaissent pas.
Tu les prépares. Tu dis mon prénom. Tu expliques mes habitudes. Ma façon d''être. Ce que j''aime et ce que je n''accepte pas. Tu les briefs comme si je méritais une notice d''utilisation complète. Et tu le fais avec une voix particulière. Celle de quelqu''un qui présente quelque chose d''important. J''ai écouté tout ça depuis le couloir. Joyeuse fête, mon humain préféré, dont je suis visiblement le sujet préféré.
Avec discours de présentation écouté dans son intégralité et ego discrètement satisfait, — {prenom}, ton animal plus documenté que la plupart de tes amis 📖$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai dormi dans le manteau d''un invité.',
$$Pour ta fête j''ai dormi dans le manteau d''un invité.
Celui qu''on avait posé sur le lit avec les autres. Le gris. Avec la doublure douce. Il sentait quelqu''un que je connaissais pas encore. C''était intéressant. Je me suis installé dedans avec méthode. Bien calé dans la doublure. Quand le propriétaire est venu le reprendre j''ai ouvert un œil. Il a hésité. Puis il a récupéré son manteau délicatement sans me déranger complètement. Il a compris les règles. Joyeuse fête, mon humain préféré.
Avec choix du manteau le plus confortable et invité ayant su se comporter, — {prenom}, ton animal juge du comportement humain en situation de manteau occupé 🧥$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Je comprends pas pourquoi tout le monde arrive en même temps.',
$$Joyeuse fête. Je comprends pas pourquoi tout le monde arrive en même temps.
Ils habitent à des endroits différents. Ils ont des vies différentes. Et pourtant ils convergent tous vers cet appartement dans une fenêtre de quarante minutes. Comme si un signal invisible les guidait. Moi j''ai pas reçu ce signal. Ou je l''ai ignoré. En tout cas l''appartement est passé de calme à plein très vite et j''ai eu besoin de plusieurs minutes pour m''adapter. Joyeuse fête, mon humain préféré, dont les amis se déplacent en meute.
Avec incompréhension sincère de la synchronisation des invités et adaptation réussie malgré tout, — {prenom}, ton animal dont le seuil de tolérance sociale a ses limites 🚶$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai évalué chaque siège occupé par tes invités.',
$$Pour ta fête j''ai évalué chaque siège occupé par tes invités.
Pas pour m''y installer. Pour évaluer. Le fauteuil du salon supporte le poids différemment avec quelqu''un dedans. Le canapé change de texture. La chaise de la cuisine craque autrement. J''ai fait le tour plusieurs fois. Posé une patte ici. Flairé là. Établi un classement. Le fauteuil du coin reste le meilleur même occupé. L''information est importante. Joyeuse fête, mon humain préféré.
Avec audit immobilier complet en conditions d''occupation et classement mis à jour, — {prenom}, ton animal expert en confort des surfaces habitées 🪑$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai trouvé injuste d''être mis dans la chambre pendant l''apéro.',
$$Joyeuse fête. J''ai trouvé injuste d''être mis dans la chambre pendant l''apéro.
La porte fermée. De l''autre côté les odeurs. Les voix. Le son des verres. Tout se passait sans moi pendant vingt minutes. J''ai gratté une fois. Deux fois. J''ai attendu. Quand la porte s''est rouverte je suis sorti avec la dignité de quelqu''un qui avait autre chose à faire de toute façon. Mais j''ai noté. Je note toujours. Joyeuse fête quand même, mon humain préféré.
Avec grief mémorisé et sortie de chambre assurée avec une dignité totale, — {prenom}, ton animal dont la mémoire des injustices est longue et précise 🚪$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai identifié le seul invité qui comprend les chats.',
$$Pour ta fête j''ai identifié le seul invité qui comprend les chats.
Il est entré sans chercher à me toucher. Il s''est assis. Il a regardé ailleurs. Il a attendu. Au bout de vingt minutes je suis allé vers lui. Il n''a pas réagi de façon excessive. Il a juste laissé sa main disponible. On a passé dix minutes ensemble. Il a compris que c''était moi qui décidais. Ces gens-là sont rares. Dis-lui qu''il peut revenir. Joyeuse fête, mon humain préféré.
Avec identification du profil compatible et invitation à revenir accordée exceptionnellement, — {prenom}, ton animal aux certifications d''accès non transférables 🏅$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Ta voix change selon les gens.',
$$Joyeuse fête. J''ai remarqué que ta voix change selon les gens.
Avec certains elle est plus haute. Plus légère. Avec d''autres plus posée. Plus sérieuse. Avec moi elle a sa propre version que tu emploies nulle part ailleurs. Plus douce. Plus lente. Avec quelque chose dedans que j''entends que là. C''est ma voix à moi. Celle que tu as développée pour moi seul. Joyeuse fête, mon humain préféré, dont la voix réservée à moi est la meilleure de toutes.
Avec analyse vocale complète et version personnelle identifiée comme la préférée, — {prenom}, ton animal propriétaire d''une voix unique au monde 🎙️$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'Je me suis installé au point le plus haut de l''appartement.',
$$Pour ta fête je me suis installé au point le plus haut de l''appartement.
Le dessus de l''armoire. Vue dégagée sur tout. Le salon. Le couloir. La cuisine. L''entrée. Chaque mouvement visible. Chaque conversation observable. J''ai supervisé l''intégralité de ta fête depuis là-haut pendant deux heures. Personne n''a levé les yeux. Tout le monde ignorait que la soirée était sous surveillance permanente. Joyeuse fête, mon humain préféré, dont les fêtes sont entre de bonnes mains.
Avec poste de commandement en hauteur et supervision totale assurée dans l''ombre, — {prenom}, ton animal directeur des opérations depuis le sommet 👁️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Je comprends pas pourquoi les gens apportent de la nourriture qu''on ne me donne pas.',
$$Joyeuse fête. Je comprends pas pourquoi les gens apportent de la nourriture qu''on ne me donne pas.
Ils arrivent avec des boîtes. Des sacs. Des choses emballées qui sentent extraordinairement bien. Ils les donnent à toi. Tu les ouvres. Ça sent encore mieux. Tout le monde mange. Moi je suis là. À portée. Avec un regard qui dit clairement ce que je veux. Et personne ne vient. C''est une organisation collective de l''ingratitude. Joyeuse fête quand même, mon humain préféré.
Avec analyse sociologique de l''ingratitude collective et demande officielle de révision des protocoles, — {prenom}, ton animal exclu du circuit alimentaire festif sans raison valable 🎁$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai entendu ton rire de fête.',
$$Pour ta fête j''ai entendu ton rire de fête.
Pas le rire du quotidien. Le rire de fête est plus grand. Il part de plus loin. Il remplit la pièce différemment. Je le reconnais entre mille. Quand je l''entends depuis ma cachette quelque chose se détend en moi. Comme un signal que tout va bien. Que tu es bien. Que la soirée se passe comme elle devait se passer. Joyeuse fête, mon humain préféré, dont le rire est mon meilleur indicateur.
Avec catalogue des rires tenu à jour et rire de fête classé premier, — {prenom}, ton animal dont ton bonheur est la donnée la plus importante 😄$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai fait tomber exactement la chose la moins importante.',
$$Pour ta fête j''ai fait tomber exactement la chose la moins importante.
J''avais évalué. Le stylo. Le sous-verre. La petite cuillère sur le rebord de la tasse. J''ai choisi la petite cuillère. Légère. Sans conséquences. Juste le bruit. Juste ce petit signal qui dit que je suis là. Que la fête c''est aussi moi. Que mon existence dans cet appartement ne doit pas être oubliée même quand il y a du monde. Joyeuse fête, mon humain préféré.
Avec destruction minimale et message maximal, — {prenom}, ton animal aux rappels d''existence calibrés avec précision 🥄$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Il y a eu un moment où tu as cherché mon regard dans la pièce.',
$$Joyeuse fête. Il y a eu un moment où tu as cherché mon regard dans la pièce.
Au milieu de la soirée. Entre deux conversations. Tu as levé les yeux et tu as cherché. Pas les invités. Moi. Pour vérifier que j''étais là. Que tout allait bien. Ce regard-là je l''attends chaque fois. Et chaque fois quand nos yeux se croisent quelque chose passe entre nous que les autres autour ne voient pas. Joyeuse fête, mon humain préféré.
Avec regard attendu et échange silencieux chéri au-dessus de tout le reste, — {prenom}, ton animal présent dans chaque pièce même depuis les marges 👁️$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai mémorisé l''heure exacte d''arrivée de chaque invité.',
$$Pour ta fête j''ai mémorisé l''heure exacte d''arrivée de chaque invité.
Le premier à 19h51. Toujours en avance celui-là. Le dernier à 20h38. Toujours en retard. Entre les deux huit arrivées à des intervalles que j''ai tous enregistrés. Ces données me permettront de prédire la prochaine fois. De me préparer encore mieux. D''optimiser ma stratégie de soirée. La connaissance c''est le pouvoir. Joyeuse fête, mon humain préféré.
Avec registre horaire complet et modélisation prédictive des prochaines fêtes en cours, — {prenom}, ton animal statisticien des événements sociaux 📊$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Je comprends pas pourquoi les gens parlent tous en même temps.',
$$Joyeuse fête. Je comprends pas pourquoi les gens parlent tous en même temps.
Il y a des moments dans la soirée où toutes les conversations se superposent. Plusieurs voix. Plusieurs histoires. Plusieurs rires. Tout en même temps. Comment vous faites pour démêler ça. Comment vous savez à qui répondre. Moi quand plusieurs sons arrivent ensemble je tourne la tête vers chacun. Je finis par m''asseoir et attendre que ça se trie. Joyeuse fête, mon humain préféré, dont les fêtes sont un chaos sonore fascinant.
Avec incompréhension sincère de la communication humaine en contexte festif, — {prenom}, ton animal à l''écoute séquentielle et rigoureuse 🔊$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai suivi l''évolution de l''odeur de l''appartement heure par heure.',
$$Pour ta fête j''ai suivi l''évolution de l''odeur de l''appartement heure par heure.
À 20h l''odeur du nettoyage encore présente. À 20h30 les premiers parfums des invités. À 21h le repas qui prenait le dessus sur tout. À 22h le mélange de tout ça ensemble. À 23h une légère fatigue olfactive collective. Chaque heure une carte différente. Chaque heure une version différente de ce soir. Joyeuse fête, mon humain préféré, dont les fêtes se lisent aussi en odeurs.
Avec cartographie olfactive horaire complète et archives disponibles pour référence future, — {prenom}, ton animal chroniqueur de l''invisible 🕰️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai accordé une faveur exceptionnelle à un invité.',
$$Pour ta fête j''ai accordé une faveur exceptionnelle à un invité.
Celui qui s''était assis par terre contre le canapé à un moment. Pas sur un siège. Par terre. Comme quelqu''un qui comprend que le sol a ses avantages. Je suis allé vers lui. Je me suis assis à côté. On a regardé la pièce ensemble depuis le bas pendant quelques minutes. C''était bien. Je lui ai accordé cette présence. Il ne savait pas que c''était exceptionnel. Maintenant tu sais. Joyeuse fête, mon humain préféré.
Avec faveur accordée en silence et valeur de celle-ci connue de moi seul, — {prenom}, ton animal aux grâces rares et précieuses 🤝$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Ce soir avant d''éteindre la lumière tu m''as regardé.',
$$Joyeuse fête. Ce soir avant d''éteindre la lumière tu m''as regardé.
Pas cherché. Regardé. Tu savais où j''étais. Au bout du lit. Les pattes repliées. Les yeux presque fermés. Et tu m''as regardé une seconde dans le noir avant d''éteindre. Juste une seconde. Comme pour vérifier que la journée se terminait bien. Qu''on était là tous les deux. Que c''était suffisant. C''était suffisant. Joyeuse fête, mon humain préféré.
Avec ce dernier regard gardé comme le meilleur moment de la journée, — {prenom}, ton animal pour les secondes qui valent des heures 🌙$$,
'touching', true, false, 'nameday', 'chat', 'from')

on conflict do nothing;
