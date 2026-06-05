-- Migration 075 : Templates anniversaire — Catégorie 5 : Famille (style=famille)
-- 10 messages moyens + 10 messages longs, ton=tu

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

-- Moyens
('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je t''aime. C''est simple, c''est vrai, et aujourd''hui c''est important de le dire.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
On a traversé beaucoup de choses ensemble. Et je suis content qu''on l''ait fait ensemble.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je suis fier de qui tu es. Pas juste aujourd''hui — tout le temps. Mais aujourd''hui je le dis.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Quoi qu''il arrive, quoi que la vie apporte, tu sais que je suis là. Toujours.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Certains souvenirs qu''on partage sont parmi les plus beaux que j''ai. Merci pour ça.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Merci pour tout ce que tu fais, souvent en silence, souvent sans qu''on te le dise assez.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
On vieillit ensemble et franchement il n''y a pas meilleure compagnie pour le faire.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Tu as ce don de rendre les endroits où tu es plus chaleureux. C''est un cadeau rare.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Tu m''as appris des choses sans t''en rendre compte. Des choses importantes. Merci pour ça.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je te souhaite tout le bonheur du monde — et je le pense vraiment, de tout mon cœur.'),

-- Longs
('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Dans une famille on dit parfois moins qu''on ne ressent — parce que l''amour est là, évident, constant, et qu''on suppose que l''autre le sait. Mais aujourd''hui j''ai envie de le dire quand même. Je t''aime. Pas parce que c''est ton anniversaire. Parce que tu comptes pour moi d''une façon profonde et permanente. Que cette journée soit belle et que tu te sentes aimé comme tu l''es.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
On a traversé des choses ensemble — des bonnes, des moins bonnes, des moments qui semblaient insurmontables et qui l''étaient pas. Et à chaque fois on était là l''un pour l''autre, d''une façon ou d''une autre. Ce qu''on a construit à travers tout ça c''est solide. C''est réel. Et je suis reconnaissant de l''avoir. Bonne journée à toi — tu mérites une belle journée.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je veux que tu saches que je suis fier de toi. Pas pour une raison précise aujourd''hui — pour tout. Pour qui tu es. Pour la façon dont tu traverses les choses. Pour ce que tu apportes aux gens autour de toi. Pour les choix que tu fais, même les difficiles. Cette fierté-là elle est là tous les jours. Aujourd''hui je la dis à voix haute parce que tu mérites de l''entendre.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des liens qu''on ne choisit pas et qui deviennent les plus importants de notre vie. Le nôtre en fait partie. Quoi qu''il arrive — les distances, les silences, les moments compliqués — ce lien est là. Solide. Permanent. Et je ne le prends pas pour acquis. Je sais ce que tu représentes pour moi, et aujourd''hui je voulais que tu le saches aussi.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des souvenirs qui appartiennent qu''à nous — des images, des odeurs, des moments partagés qu''on n''a pas besoin d''expliquer parce que l''autre était là. Ces souvenirs font partie de qui je suis. Ils ont une couleur particulière, douce et permanente. Merci de les partager avec moi. Merci d''être dans mes souvenirs les plus précieux. Que cette année t''en apporte de nouveaux.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des choses qu''on fait en famille sans les comptabiliser — les efforts discrets, les présences silencieuses, les petits gestes qu''on remarque pas sur le moment mais qui font toute la différence. Tu en fais beaucoup de ces choses-là. Souvent sans qu''on te le dise. Aujourd''hui je te le dis. Merci. Pour tout ça et pour le reste. Tu mérites une journée aussi belle que ce que tu donnes.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a quelque chose de particulièrement beau à vieillir avec les gens qu''on aime — à se voir changer, à regarder les années passer ensemble, à partager ce temps qui avance. On vieillit ensemble et je trouve qu''on le fait bien. On garde ce qui compte. On s''adapte à ce qui change. Et on reste là l''un pour l''autre. C''est ça la famille. Et je suis content d''en faire partie avec toi.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des personnes qui ont ce don rare de rendre les endroits où elles se trouvent plus chauds, plus accueillants, plus sûrs. Tu es une de ces personnes. Sans forcément t''en rendre compte, tu crées autour de toi un espace où les autres se sentent bien, où ils peuvent être eux-mêmes. Ce cadeau-là il est précieux. Que cette journée soit pour toi aussi chaleureuse que ce que tu donnes aux autres.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des leçons qu''on reçoit sans cours, sans discours — juste en regardant quelqu''un vivre. Tu m''as appris des choses comme ça. Sur la façon de traverser les difficultés. Sur ce qui mérite vraiment d''être important. Sur comment traiter les gens. Ces leçons-là font partie de qui je suis aujourd''hui. Et je ne t''en ai peut-être pas assez remercié. Alors merci.'),

('birthday', 'tu', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Si je pouvais t''offrir quelque chose aujourd''hui ce serait simple — la santé, la paix, et des gens qui t''aiment autour de toi. Ces trois choses suffisent à rendre une vie belle. Tu mérites les trois. Tu mérites une année légère, pleine de moments qui comptent, et des jours où tu te réveilles content d''être là. Je te le souhaite du fond du cœur.');
