-- Migration 074 : Templates anniversaire — Catégorie 4 : Poétique et doux (style=poetique)
-- 10 messages moyens + 10 messages longs, ton=tu

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

-- Moyens
('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Que ce jour soit lumineux — comme tu l''es, comme tu le mérites.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Le temps passe, et avec lui il apporte des choses belles. Que cette année t''en apporte beaucoup.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Chaque saison de ta vie t''a construit quelque chose. Que celle qui commence aujourd''hui soit douce et riche.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Tu portes en toi quelque chose de rare — une façon d''être au monde qui fait du bien à ceux qui t''entourent.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Ce qu''on a vécu ensemble reste. Et aujourd''hui s''ajoute à ces choses qu''on gardera.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Que cette nouvelle année fasse fleurir tout ce que tu as semé avec soin.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Aujourd''hui prends le temps d''être là — vraiment là — dans chaque moment de ce jour.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Il y a des gens qui brillent sans chercher à le faire. Tu es de ceux-là.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Regarde le chemin parcouru — il est beau, même là où il fut difficile.'),

('birthday', 'tu', 'moyen', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Que cette année soit une page blanche sur laquelle s''écrivent les plus belles choses.'),

-- Longs
('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Il y a des jours qui ont leur propre lumière — une lumière différente des autres, plus douce, plus particulière. Le tien est un de ces jours. C''est le jour où les pensées de ceux qui t''aiment se tournent vers toi, où tu es au centre de quelque chose de beau sans même avoir à faire quoi que ce soit. Laisse cette lumière t''atteindre aujourd''hui. Tu la mérites.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Le temps a cette façon silencieuse d''avancer — sans demander la permission, sans s''arrêter pour qu''on puisse tout voir. Et pourtant il laisse des choses. Des visages. Des moments. Des sensations qu''on garde sans savoir pourquoi. Que cette nouvelle année t''apporte des choses que tu garderas longtemps, et que le temps qui passe soit pour toi une rivière douce plutôt qu''un torrent.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
La vie a ses saisons — des printemps d''élan et d''espoir, des étés pleins et généreux, des automnes qui récoltent ce qu''on a semé, des hivers qui invitent au calme et à la profondeur. Chacune a sa beauté propre. Chacune t''a construit quelque chose. Que la saison qui s''ouvre aujourd''hui soit celle dont tu avais besoin — riche de ce qu''elle a à t''offrir.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Il y a des gens qui portent en eux quelque chose de difficile à nommer — une façon d''être présent, d''écouter, de faire sentir aux autres qu''ils comptent. Ce quelque chose ne s''apprend pas vraiment. Il est là ou il n''est pas. Chez toi il est là, et ceux qui ont la chance de te côtoyer le savent. Que cette année te rende tout le bien que tu donnes si naturellement.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Il y a des moments qu''on ne choisit pas de garder — ils restent tout seuls, sans qu''on leur demande. Une conversation, un rire, un silence partagé. Les moments passés avec toi font partie de ceux-là. Ils sont là, quelque part, et ils ont une couleur particulière. Que ce jour laisse en toi quelque chose de beau à son tour.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Il y a dans une vie des choses qu''on sème sans toujours savoir ce qu''elles deviendront — des efforts discrets, des attentions données, des graines posées dans la terre avec soin. Ces choses poussent à leur rythme, parfois lentement, parfois là où on ne les attendait pas. Que cette nouvelle année fasse fleurir tout ce que tu as semé — que tu voies enfin certaines de ces pousses devenir quelque chose de beau.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Il y a une forme de grâce dans la capacité à être vraiment là — dans l''instant, sans penser à ce qui vient ou à ce qui est passé. Aujourd''hui, pour ce jour qui est le tien, j''espère que tu trouves cette grâce-là. Que tu sois pleinement dans chaque moment de cette journée, que tu laisses la joie t''atteindre sans la filtrer, que tu reçoives tout ce qu''on te donne avec légèreté.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Il y a des étoiles qu''on remarque à peine parce qu''elles brillent sans faire de bruit. Elles sont là, constantes, et c''est leur présence silencieuse qui illumine la nuit. Tu es un peu comme ça — quelqu''un qui apporte de la lumière sans chercher à être vu, qui rayonne doucement et sûrement. Que cette année te rende visible à toi-même autant que tu l''es pour les autres.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Chaque anniversaire est une invitation à regarder en arrière — pas avec nostalgie ni avec regret, mais avec une tendresse douce pour tout ce qu''on a traversé. Les chemins difficiles. Les détours inattendus. Les belles surprises. Tout ça t''a amené là où tu es. Et là où tu es, c''est bien. Que la suite soit à la hauteur du chemin parcouru.'),

('birthday', 'tu', 'long', 'poetique', true, false, 'Anniversaire poétique',
'Joyeux anniversaire, {prenom}.
Je te souhaite une année qui ressemble à un matin de printemps — douce au réveil, lumineuse progressivement, pleine de promesses discrètes. Une année où les bonnes choses arrivent sans prévenir. Où les gens que tu aimes sont là. Où tu trouves dans les petits moments la preuve que la vie est belle.');
