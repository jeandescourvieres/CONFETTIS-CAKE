-- Migration 073 : Templates anniversaire — Catégorie 3 : Drôle mais universel (style=drole)
-- 10 messages moyens + 10 messages longs, ton=tu

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

-- Moyens
('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Un an de plus au compteur — mais on va dire que c''est une mise à jour, pas une dégradation.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
L''âge c''est relatif. Et aujourd''hui on décide collectivement que tu es encore très loin d''être vieux.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
J''espère que tu reçois exactement ce que tu voulais — et que tu fais semblant d''être surpris avec classe.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On dit qu''avec l''âge vient la sagesse. Je te laisse juger si c''est en train de marcher pour toi.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Le dos, les genoux, la mémoire — tout ça c''est optionnel. Profite de ta journée quand même.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Cette année on a décidé de mettre moins de bougies sur le gâteau. Pas pour économiser — juste pour éviter l''incendie.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Tu avais peut-être espéré que personne ne s''en souvienne. Raté.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Toi à vingt ans n''aurait jamais cru que toi aujourd''hui serait aussi bien. Il avait tort.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
L''essentiel aujourd''hui c''est le gâteau. Le reste c''est du bonus.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On vieillit ensemble et franchement c''est la meilleure façon de le faire.'),

-- Longs
('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Alors voilà — un an de plus. On pourrait s''en inquiéter, faire une réunion de crise, revoir les priorités. Ou on pourrait décider que c''est une excellente nouvelle et fêter ça dignement. Je vote pour la deuxième option. Tu mérites une belle journée, un bon gâteau, et au moins une personne qui te dit que tu t''en sors vraiment bien pour quelqu''un qui accumule les années comme tu le fais.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je tiens à te rappeler que l''âge est une construction sociale. Les chiffres sont arbitraires. Le temps est relatif. Einstein avait dit un truc là-dessus. Bref, officiellement, tu n''as pas vieilli cette année — tu as simplement acquis une année supplémentaire d''expérience. Ce qui est totalement différent. Profite de ta journée sans culpabilité.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Voilà le moment de l''année où tu vas devoir ouvrir des cadeaux avec enthousiasme quelle que soit leur nature, remercier avec sincérité même pour les trucs que tu comprends pas pourquoi on t''offrait, et faire semblant que tu avais pas regardé sur internet ce que tu voulais depuis trois semaines. Tu gères ça très bien en général. Bonne performance aujourd''hui.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On dit qu''avec l''âge vient la sagesse. C''est une théorie. Pas universellement vérifiée. Mais dans ton cas je dois admettre que tu sembles effectivement un peu plus sage chaque année — ou du moins meilleur pour cacher les erreurs. Dans tous les cas le résultat est là et c''est bien. Bonne année pleine de sagesse ou de sa simulation convaincante.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
À partir d''un certain âge les anniversaires s''accompagnent d''un inventaire corporel involontaire. Le dos. Les genoux. La mémoire. Cette chose que tu as faite le mois dernier et dont tu te souviens plus. Tout ça fait partie du package. Mais le package comprend aussi l''expérience, le recul, et une capacité à s''en ficher qui s''améliore avec les années. Profite de l''ensemble.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je veux juste qu''on prenne un moment pour réfléchir au rituel des bougies. On met du feu sur de la nourriture. On éteint ce feu en soufflant dessus. Tout le monde applaudit. Et ensuite on mange la nourriture sur laquelle on a soufflé. C''est notre tradition préférée et personne ne remet ça en question. Profite bien de ce moment absurde et magnifique.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je sais que tu aurais peut-être préféré que cette date passe inaperçue cette année. Que les gens oublient. Que le temps s''arrête discrètement. Ça n''a pas marché. On est tous là. On sait. Et on est ravis de le savoir parce que ça nous donne une excellente raison de te dire qu''on est contents que tu sois là. Désolé pour le dérangement. Pas vraiment.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Si tu pouvais envoyer un message à ta version d''il y a dix ans, je pense qu''elle serait assez impressionnée par où tu en es. Pas parce que tout est parfait. Mais parce que t''as traversé des trucs, tu t''en es sorti, et tu continues d''avancer avec une façon d''être qui est clairement la bonne. Toi à vingt ans aurait bien aimé te connaître.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On peut parler des vœux, de la symbolique du temps qui passe, de tout ce que cette journée représente. Mais soyons honnêtes — le vrai point culminant de l''anniversaire c''est le gâteau. Le reste c''est de l''emballage. Alors j''espère que le gâteau est excellent, que tu en prends deux parts, et que personne ne te regarde comme si c''était excessif.'),

('birthday', 'tu', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Il y a quelque chose de particulièrement satisfaisant à vieillir avec des gens qu''on aime bien. On se voit accumuler les années ensemble. On compare les douleurs de dos. On rigole des mêmes trucs qu''il y a dix ans. Et quelque part dans tout ça on réalise qu''on a construit quelque chose de solide. Merci d''être quelqu''un avec qui le temps passe bien.');
