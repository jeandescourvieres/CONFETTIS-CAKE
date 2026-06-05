-- Migration 087 : Templates anniversaire — Catégorie Collègue, moyens thèmes 11-20

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Te croiser au quotidien est toujours un plaisir. Que cette journée soit aussi agréable que toi.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Ce que tu apportes à l''équipe mérite d''être reconnu. Aujourd''hui c''est l''occasion de le faire.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Je te souhaite une belle journée et une très bonne année — au travail comme dans ta vie personnelle.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Ton énergie positive au quotidien est contagieuse dans le bon sens. Que ta journée soit à la hauteur.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Ton sérieux et ton engagement forcent le respect. Que cette année te récompense à la hauteur de tes efforts.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Je te souhaite avant tout la santé et l''énergie pour profiter de tout ce que cette nouvelle année t''apportera.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Même dans une semaine chargée ce jour mérite une petite pause. Prends le temps d''en profiter.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
J''espère qu''il y a du gâteau au bureau aujourd''hui. Tu le mérites bien.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Au fil du temps tu es devenu bien plus qu''un simple collègue. Et c''est une belle chose.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Un souhait simple et sincère pour une belle journée et une belle année. Tu le mérites.');
