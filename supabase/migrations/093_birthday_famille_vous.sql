-- Migration 093 : Templates anniversaire — Famille, ton=vous, thèmes 1-10

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je vous aime. C''est simple, c''est vrai, et aujourd''hui c''est important de le dire.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
On a traversé beaucoup de choses ensemble. Et je suis content qu''on l''ait fait ensemble.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je suis fier de qui vous êtes. Pas juste aujourd''hui — tout le temps. Mais aujourd''hui je le dis.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Quoi qu''il arrive, quoi que la vie apporte, vous savez que je suis là. Toujours.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Certains souvenirs qu''on partage sont parmi les plus beaux que j''ai. Merci pour ça.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Merci pour tout ce que vous faites, souvent en silence, souvent sans qu''on vous le dise assez.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
On vieillit ensemble et franchement il n''y a pas meilleure compagnie pour le faire.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Vous avez ce don de rendre les endroits où vous êtes plus chaleureux. C''est un cadeau rare.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Vous m''avez appris des choses sans vous en rendre compte. Des choses importantes. Merci pour ça.'),

('birthday', 'vous', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je vous souhaite tout le bonheur du monde — et je le pense vraiment, de tout mon cœur.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Dans une famille on dit parfois moins qu''on ne ressent — parce que l''amour est là, évident, constant, et qu''on suppose que l''autre le sait. Mais aujourd''hui j''ai envie de le dire quand même. Je vous aime. Pas parce que c''est votre anniversaire. Parce que vous comptez pour moi d''une façon profonde et permanente. Que cette journée soit belle et que vous vous sentiez aimé comme vous l''êtes.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
On a traversé des choses ensemble — des bonnes, des moins bonnes, des moments qui semblaient insurmontables et qui l''étaient pas. Et à chaque fois on était là l''un pour l''autre, d''une façon ou d''une autre. Ce qu''on a construit à travers tout ça c''est solide. C''est réel. Et je suis reconnaissant de l''avoir. Bonne journée à vous — vous méritez une belle journée.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Je veux que vous sachiez que je suis fier de vous. Pas pour une raison précise aujourd''hui — pour tout. Pour qui vous êtes. Pour la façon dont vous traversez les choses. Pour ce que vous apportez aux gens autour de vous. Pour les choix que vous faites, même les difficiles. Cette fierté-là elle est là tous les jours. Aujourd''hui je la dis à voix haute parce que vous méritez de l''entendre.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des liens qu''on ne choisit pas et qui deviennent les plus importants de notre vie. Le nôtre en fait partie. Quoi qu''il arrive — les distances, les silences, les moments compliqués — ce lien est là. Solide. Permanent. Et je ne le prends pas pour acquis. Je sais ce que vous représentez pour moi, et aujourd''hui je voulais que vous le sachiez aussi.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des souvenirs qui appartiennent qu''à nous — des images, des odeurs, des moments partagés qu''on n''a pas besoin d''expliquer parce que l''autre était là. Ces souvenirs font partie de qui je suis. Ils ont une couleur particulière, douce et permanente. Merci de les partager avec moi. Merci d''être dans mes souvenirs les plus précieux. Que cette année vous en apporte de nouveaux.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des choses qu''on fait en famille sans les comptabiliser — les efforts discrets, les présences silencieuses, les petits gestes qu''on remarque pas sur le moment mais qui font toute la différence. Vous en faites beaucoup de ces choses-là. Souvent sans qu''on vous le dise. Aujourd''hui je vous le dis. Merci. Pour tout ça et pour le reste. Vous méritez une journée aussi belle que ce que vous donnez.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a quelque chose de particulièrement beau à vieillir avec les gens qu''on aime — à se voir changer, à regarder les années passer ensemble, à partager ce temps qui avance. On vieillit ensemble et je trouve qu''on le fait bien. On garde ce qui compte. On s''adapte à ce qui change. Et on reste là l''un pour l''autre. C''est ça la famille. Et je suis content d''en faire partie avec vous.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des personnes qui ont ce don rare de rendre les endroits où elles se trouvent plus chauds, plus accueillants, plus sûrs. Vous êtes une de ces personnes. Sans forcément vous en rendre compte, vous créez autour de vous un espace où les autres se sentent bien, où ils peuvent être eux-mêmes. Ce cadeau-là il est précieux. Que cette journée soit pour vous aussi chaleureuse que ce que vous donnez aux autres.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Il y a des leçons qu''on reçoit sans cours, sans discours — juste en regardant quelqu''un vivre. Vous m''avez appris des choses comme ça. Sur la façon de traverser les difficultés. Sur ce qui mérite vraiment d''être important. Sur comment traiter les gens. Ces leçons-là font partie de qui je suis aujourd''hui. Et je ne vous en ai peut-être pas assez remercié. Alors merci.'),

('birthday', 'vous', 'long', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Si je pouvais vous offrir quelque chose aujourd''hui ce serait simple — la santé, la paix, et des gens qui vous aiment autour de vous. Ces trois choses suffisent à rendre une vie belle. Vous méritez les trois. Vous méritez une année légère, pleine de moments qui comptent, et des jours où vous vous réveillez content d''être là. Je vous le souhaite du fond du cœur.');
