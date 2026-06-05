-- Modèles : chat → humain, occasion Bonne Fête (nameday)
-- Placeholders : {prenom} = prénom de l'animal, mon humain préféré = prénom du propriétaire

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'Ta fête. Encore.',
$$Ta fête. Encore.
L''année dernière t''avais déjà fait ta fête. L''année d''avant aussi. C''est devenu une habitude apparemment. Les gens ont sonné. Tu as souri. Il y avait du bruit. J''ai passé la soirée sur le rebord de la fenêtre à regarder la rue en attendant que ça se calme. C''est ma façon de participer. Joyeuse fête, mon humain préféré, dont les célébrations annuelles perturbent mon emploi du temps.
Avec tolérance renouvelée et programme de la soirée modifié en conséquence, — {prenom}, ton animal aux adaptations silencieuses 📅$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai appris que ta fête c''est le jour d''un saint.',
$$J''ai appris que ta fête c''est le jour d''un saint.
J''ai cherché ce saint. Il a apparemment fait des choses remarquables. Moi aussi je fais des choses remarquables tous les jours. Je dors avec une précision absolue. Je surveille les oiseaux avec une concentration totale. Je disparais exactement quand on a besoin de moi. Personne ne me canonise pour ça. C''est une injustice que je note. Joyeuse fête quand même, mon humain préféré.
Avec revendication de sainteté non reconnue et dossier en cours de constitution, — {prenom}, ton animal aux mérites sous-estimés 🙏$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Des gens sont venus pour ta fête. J''ai disparu.',
$$Des gens sont venus pour ta fête ce soir. J''ai disparu.
Pas parce que j''avais peur. Pas parce que je les aime pas. Parce que c''est ma façon de gérer les foules. Je suis allé sous le lit. C''est calme sous le lit. C''est mon bureau. Mon espace de réflexion. Deux heures plus tard je suis réapparu comme si de rien n''était. Tout le monde a fait une tête. C''est la réaction que je cherchais. Joyeuse fête, mon humain préféré, dont les soirées ont toujours un moment de magie.
Avec disparition calculée et réapparition parfaitement orchestrée, — {prenom}, ton animal spécialiste de l''entrée remarquée 🎩$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Pour ta fête j''ai décidé de ronronner ce soir.',
$$Pour ta fête j''ai décidé de ronronner ce soir.
Pas parce que tu me l''as demandé. Pas parce que t''as insisté. Parce que j''ai évalué la situation et conclu que c''était approprié. C''est mon cadeau. Intérieur. Vibratoire. Non matériel mais d''une valeur thérapeutique prouvée scientifiquement. Tu peux pas l''encadrer ni le revendre mais tu peux le recevoir ce soir si tu restes tranquille et que tu fais pas de bruit brusque. Joyeuse fête, mon humain préféré.
Avec cadeau sonore conditionnel et conditions clairement établies, — {prenom}, ton animal aux dons précieux et rares 🎁$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Joyeuse fête. J''ai renversé ton verre ce matin.',
$$Joyeuse fête. J''ai renversé ton verre ce matin.
C''était intentionnel. Tu dormais encore à 9h un jour de fête. C''est inadmissible. Le verre était là. L''occasion était parfaite. J''ai poussé doucement. Puis un peu moins doucement. Le bruit a été satisfaisant. Tu t''es levé. La journée a commencé. Je t''ai rendu service. On me remerciera jamais pour ça. Joyeuse fête, mon humain préféré, dont je gère le réveil avec efficacité.
Avec préméditation totale et résultat conforme aux attentes, — {prenom}, ton animal gestionnaire de ton emploi du temps matinal 🥛$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Ta fête c''est aujourd''hui et tu as reçu des fleurs.',
$$Ta fête c''est aujourd''hui et tu as reçu des fleurs.
Des fleurs. Dans un vase. Sur la table basse. À portée de patte. J''ai d''abord reniflé. Puis j''ai évalué la stabilité du vase. Puis j''ai regardé ailleurs pour faire croire que ça m''intéressait pas. Le vase est encore debout. C''est mon cadeau. La survie de tes fleurs d''anniversaire. Tu peux pas savoir ce que ça m''a coûté. Joyeuse fête, mon humain préféré.
Avec maîtrise de soi exceptionnelle et vase miraculeusement intact, — {prenom}, ton animal aux renoncements héroïques 🌸$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Joyeuse fête. J''ai une chose importante à te dire.',
$$Joyeuse fête. J''ai une chose importante à te dire.
Ce matin quand tu t''es levé et que tu m''as dit bonjour avec cette voix du matin, celle qui est un peu rauque et un peu douce, j''ai fermé les yeux à moitié. Les gens pensent que ça veut dire que je m''endors. Non. Ça veut dire que je suis bien. Que ce moment est bon. Que ta voix du matin fait partie de mes choses préférées au monde. Joyeuse fête, mon humain préféré, à la voix qui commence mes journées.
Avec aveu rare et sincérité totale pour l''occasion, — {prenom}, ton animal aux démonstrations annuelles d''affection 💛$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'Pour ta fête j''ai inspecté tous tes cadeaux.',
$$Pour ta fête j''ai inspecté tous tes cadeaux.
Chaque paquet. Chaque sac. Chaque boîte. Je me suis assis dessus dans un ordre que j''ai moi-même établi selon des critères qui m''appartiennent. L''un d''eux sentait très bien. Je suis resté dessus vingt minutes. Tu attendais pour l''ouvrir. J''ai fini par partir quand j''en ai eu envie. T''as ouvert le cadeau. Il était moins bien que l''emballage. Joyeuse fête, mon humain préféré.
Avec audit complet et conclusions partagées sans filtre, — {prenom}, ton animal expert en emballages 📦$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Tu m''as appelé par mon prénom toute la journée.',
$$Joyeuse fête. Tu m''as appelé par mon prénom toute la journée avec cette voix.
Cette voix particulière que tu prends seulement pour moi. Ni trop fort ni trop doux. Juste ce ton qui veut dire que tu penses à moi. Que je suis dans ta tête. Que tu veux ma présence. J''ai fait semblant de pas entendre les trois premières fois. La quatrième fois je suis venu. Pas parce que tu m''as eu. Parce que j''avais décidé que c''était le bon moment. Joyeuse fête, mon humain préféré.
Avec timing personnel et décisions souveraines maintenues, — {prenom}, ton animal aux apparitions toujours volontaires 👂$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Ta fête tombe un samedi cette année.',
$$Ta fête tombe un samedi cette année. C''est une information pertinente.
Un samedi ça veut dire que tu es là toute la journée. Toute la journée à la maison. Toute la journée dans mon espace. Toute la journée à faire du bruit, à ouvrir des placards, à recevoir des gens. En théorie c''est trop. En pratique j''aime ça. Ta présence constante même quand elle me fatigue reste ma préférence absolue. Joyeuse fête, mon humain préféré, occupant permanent de mon territoire.
Avec contradiction assumée et attachement inavouable mais réel, — {prenom}, ton animal aux sentiments complexes et bien cachés 📆$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai pétri ton oreiller pendant douze minutes.',
$$Joyeuse fête. J''ai fait quelque chose sur le lit ce matin.
Pas ce que tu penses. J''ai pétri ton oreiller pendant douze minutes. Les deux mains. En rythme. Les yeux mi-clos. T''étais encore dedans. Tu t''es pas plaint. T''as juste posé ta main sur mon dos. C''était le meilleur moment de la journée pour nous deux même si on l''a pas dit. Joyeuse fête, mon humain préféré, oreiller de référence.
Avec séance de pétrissage offerte et moment partagé en silence, — {prenom}, ton animal boulanger de l''affection 🤲$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai toléré que tu me prennes en photo avec le chapeau.',
$$Pour ta fête j''ai toléré que tu me prennes en photo.
Avec le chapeau. Oui ce chapeau-là. Celui avec la petite étoile dorée. Je savais ce que tu préparais depuis que tu l''avais sorti du tiroir. J''aurais pu partir. J''aurais pu me cacher. Je suis resté. Trente secondes. Le temps que tu fasses ta photo. Avec une dignité absolue. La photo est magnifique. Tu me dois quelque chose. Joyeuse fête, mon humain préféré.
Avec sacrifice de la dignité pour une durée limitée et dette mémorisée, — {prenom}, ton animal au sens du sacrifice exceptionnel 📸$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Une question philosophique sur les fêtes de prénom.',
$$Joyeuse fête. J''ai une question philosophique.
Pourquoi fête-t-on les prénoms ? Les prénoms ne font rien. Ils existent juste. Moi je fais des choses. Je chasse. Je surveille. Je dors avec une expertise que peu peuvent égaler. Je maintiens l''ordre dans cet appartement par ma seule présence. Personne me fait une fête pour ça. C''est une inégalité que je signale. Joyeuse fête quand même, mon humain préféré, bénéficiaire d''un système qui te favorise.
Avec revendication légitime et participation quand même par magnanimité, — {prenom}, ton animal aux droits à revoir 🤔$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Après ta fête tu t''es assis par terre contre le canapé.',
$$Ce soir après ta fête tu t''es assis par terre contre le canapé.
Fatigué. Les yeux fermés. La tête appuyée en arrière. Et je suis descendu du canapé sans bruit. Et je me suis installé juste à côté de toi. Pas sur toi. À côté. À dix centimètres. Comme ça. Sans raison officielle. Tu as ouvert un œil. Tu as souri. On a passé vingt minutes comme ça en silence. C''était ta fête. C''était aussi la mienne. Joyeuse fête, mon humain préféré.
Avec présence choisie et distance parfaitement calibrée, — {prenom}, ton animal aux dix centimètres les plus précieux du monde 🌙$$,
'touching', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai mangé un peu de ton gâteau.',
$$Joyeuse fête. J''ai mangé un peu de ton gâteau.
Pas beaucoup. Juste une légère exploration de la surface avec la langue pendant que tu avais le dos tourné. C''était de la curiosité intellectuelle. Une démarche scientifique. Le résultat : c''était bon. Très bon. J''aurais voulu continuer l''expérience mais tu t''es retourné. Le regard que tu m''as lancé était éloquent. Je revendique néanmoins l''intégrité de ma démarche. Joyeuse fête, mon humain préféré.
Avec rigueur scientifique et absence totale de regrets, — {prenom}, ton animal chercheur en gastronomie appliquée 🎂$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'J''ai décidé de venir sur tes genoux ce soir.',
$$Pour ta fête j''ai décidé de venir sur tes genoux ce soir.
T''étais avec des gens. En train de parler. D''être joyeux. D''exister socialement. Et je me suis installé sur toi quand même. Parce que c''était le moment. Parce que tes genoux étaient disponibles même si le reste de toi ne l''était pas. Tout le monde a regardé. Certains ont fait des bruits attendris. J''ai ignoré tout ça avec classe. Joyeuse fête, mon humain préféré, propriétaire des meilleurs genoux connus.
Avec choix du moment contestable mais résultat indéniablement réussi, — {prenom}, ton animal aux apparitions toujours remarquées 🛋️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Tu m''as cherché partout ce matin.',
$$Joyeuse fête. Tu m''as cherché partout ce matin.
Je t''entendais. Chaque pièce. Mon prénom répété avec cette intonation inquiète. J''étais dans le placard du couloir. Celui qui est entrouvert. Depuis toujours entrouvert. Le même placard où je vais depuis des années. Tu le sais. Tu l''oublies à chaque fois. Et chaque fois tu fais cette tête soulagée quand tu me trouves. C''est mon cadeau annuel. Cette tête soulagée. Joyeuse fête, mon humain préféré.
Avec cachette stratégique et effet garanti depuis des années, — {prenom}, ton animal aux planques bien entretenues 🚪$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Ta fête et tu sembles attendre quelque chose de moi.',
$$Ta fête c''est aujourd''hui et tu sembles attendre quelque chose de moi.
Je le sens dans ta façon de me regarder. Cette attente. Cette espérance. Tu voudrais que je fasse quelque chose de particulier. Un câlin peut-être. Un ronronnement. Un geste. Je t''ai regardé en retour pendant trente secondes. Puis j''ai baillé. Puis je me suis retourné. C''était mon geste. Subtil. Mais c''était le mien. Joyeuse fête, mon humain préféré, dont les attentes s''adaptent à ma réalité.
Avec communication subtile et message livré à ma façon, — {prenom}, ton animal aux expressions minimalistes et chargées de sens 😶$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'La liste des choses que je n''ai pas faites aujourd''hui.',
$$Joyeuse fête. J''ai une liste de choses que j''aurais pu faire aujourd''hui et que je n''ai pas faites.
Renverser le vase. Griffer le nouveau coussin. Manger les fleurs. Sauter sur la table pendant le repas. Ignorer tous tes invités avec ostentation. Dormir exactement où tu voulais t''asseoir. J''ai fait certaines de ces choses. Mais pas toutes. C''est mon cadeau. La liste de ce que j''ai épargné. Joyeuse fête, mon humain préféré.
Avec retenue sélective et inventaire des dégâts évités, — {prenom}, ton animal aux cadeaux négatifs d''une valeur inestimable 🛡️$$,
'humorous', true, false, 'nameday', 'chat', 'from'),

(null, 'Fin de soirée : je me suis installé sur ta poitrine.',
$$Ce soir quand ta fête était finie et que la maison était redevenue silencieuse.
Tu t''es allongé sur le canapé avec ce soupir de fin de journée. Celui qui dit que c''était bien mais que c''est bon aussi que ce soit fini. Et je suis venu. Pas immédiatement. Après quelques minutes. Pour ne pas avoir l''air d''attendre. Je me suis installé sur ta poitrine. Mes pattes pliées sous moi. Mon poids sur toi. Et on a regardé le plafond tous les deux sans rien dire. C''était ta fête. C''était parfait. Joyeuse fête, mon humain préféré.
Avec fin de soirée parfaite et présence au bon moment, — {prenom}, ton animal pour les silences qui valent tous les discours ❤️$$,
'touching', true, false, 'nameday', 'chat', 'from')

on conflict do nothing;
