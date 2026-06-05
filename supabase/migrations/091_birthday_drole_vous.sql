-- Migration 091 : Templates anniversaire — Drôle, ton=vous, thèmes 1-10

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Un an de plus au compteur — mais on va dire que c''est une mise à jour, pas une dégradation.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
L''âge c''est relatif. Et aujourd''hui on décide collectivement que vous êtes encore très loin d''être vieux.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
J''espère que vous recevez exactement ce que vous vouliez — et que vous faites semblant d''être surpris avec classe.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On dit qu''avec l''âge vient la sagesse. Je vous laisse juger si c''est en train de marcher pour vous.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Le dos, les genoux, la mémoire — tout ça c''est optionnel. Profitez de votre journée quand même.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Cette année on a décidé de mettre moins de bougies sur le gâteau. Pas pour économiser — juste pour éviter l''incendie.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Vous aviez peut-être espéré que personne ne s''en souvienne. Raté.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Vous à vingt ans n''auriez jamais cru que vous aujourd''hui seriez aussi bien. Il avait tort.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
L''essentiel aujourd''hui c''est le gâteau. Le reste c''est du bonus.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On vieillit ensemble et franchement c''est la meilleure façon de le faire.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Alors voilà — un an de plus. On pourrait s''en inquiéter, faire une réunion de crise, revoir les priorités. Ou on pourrait décider que c''est une excellente nouvelle et fêter ça dignement. Je vote pour la deuxième option. Vous méritez une belle journée, un bon gâteau, et au moins une personne qui vous dit que vous vous en sortez vraiment bien pour quelqu''un qui accumule les années comme vous le faites.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je tiens à vous rappeler que l''âge est une construction sociale. Les chiffres sont arbitraires. Le temps est relatif. Einstein avait dit un truc là-dessus. Bref, officiellement, vous n''avez pas vieilli cette année — vous avez simplement acquis une année supplémentaire d''expérience. Ce qui est totalement différent. Profitez de votre journée sans culpabilité.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Voilà le moment de l''année où vous allez devoir ouvrir des cadeaux avec enthousiasme quelle que soit leur nature, remercier avec sincérité même pour les trucs que vous comprenez pas pourquoi on vous offrait, et faire semblant que vous n''aviez pas regardé sur internet ce que vous vouliez depuis trois semaines. Vous gérez ça très bien en général. Bonne performance aujourd''hui.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On dit qu''avec l''âge vient la sagesse. C''est une théorie. Pas universellement vérifiée. Mais dans votre cas je dois admettre que vous semblez effectivement un peu plus sage chaque année — ou du moins meilleur pour cacher les erreurs. Dans tous les cas le résultat est là et c''est bien. Bonne année pleine de sagesse ou de sa simulation convaincante.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
À partir d''un certain âge les anniversaires s''accompagnent d''un inventaire corporel involontaire. Le dos. Les genoux. La mémoire. Cette chose que vous avez faite le mois dernier et dont vous ne vous souvenez plus. Tout ça fait partie du package. Mais le package comprend aussi l''expérience, le recul, et une capacité à s''en ficher qui s''améliore avec les années. Profitez de l''ensemble.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je veux juste qu''on prenne un moment pour réfléchir au rituel des bougies. On met du feu sur de la nourriture. On éteint ce feu en soufflant dessus. Tout le monde applaudit. Et ensuite on mange la nourriture sur laquelle on a soufflé. C''est notre tradition préférée et personne ne remet ça en question. Profitez bien de ce moment absurde et magnifique.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je sais que vous auriez peut-être préféré que cette date passe inaperçue cette année. Que les gens oublient. Que le temps s''arrête discrètement. Ça n''a pas marché. On est tous là. On sait. Et on est ravis de le savoir parce que ça nous donne une excellente raison de vous dire qu''on est contents que vous soyez là. Désolé pour le dérangement. Pas vraiment.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Si vous pouviez envoyer un message à votre version d''il y a dix ans, je pense qu''elle serait assez impressionnée par où vous en êtes. Pas parce que tout est parfait. Mais parce que vous avez traversé des trucs, vous vous en êtes sorti, et vous continuez d''avancer avec une façon d''être qui est clairement la bonne. Vous à vingt ans aurait bien aimé vous connaître.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On peut parler des vœux, de la symbolique du temps qui passe, de tout ce que cette journée représente. Mais soyons honnêtes — le vrai point culminant de l''anniversaire c''est le gâteau. Le reste c''est de l''emballage. Alors j''espère que le gâteau est excellent, que vous en prenez deux parts, et que personne ne vous regarde comme si c''était excessif.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Il y a quelque chose de particulièrement satisfaisant à vieillir avec des gens qu''on aime bien. On se voit accumuler les années ensemble. On compare les douleurs de dos. On rigole des mêmes trucs qu''il y a dix ans. Et quelque part dans tout ça on réalise qu''on a construit quelque chose de solide. Merci d''être quelqu''un avec qui le temps passe bien.');
