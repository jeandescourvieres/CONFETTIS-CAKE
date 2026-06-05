-- Migration 085 : Templates anniversaire — Catégorie Famille, moyens thèmes 11-20

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Dans notre famille on ne le dit peut-être pas assez — alors je le dis aujourd''hui. Je t''aime.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Ce qu''on a vécu ensemble — le bon et le moins bon — a construit quelque chose de solide entre nous.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Voir qui tu es devenu me rend fier. Vraiment fier. Pas juste aujourd''hui — tout le temps.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Peu importe la distance ou le temps qui passe — ce lien entre nous ne change pas. Il est là.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Les souvenirs qu''on partage depuis l''enfance font partie de ce que j''ai de plus précieux.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Tu fais tellement pour les autres sans jamais en faire une histoire. Aujourd''hui c''est toi qu''on célèbre.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
On vieillit tous les deux et je dois dire que ta compagnie rend ça beaucoup plus agréable.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Là où tu es il fait toujours un peu plus chaud. C''est un cadeau que tu ne mesures pas assez.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Sans forcément t''en rendre compte tu m''as appris des choses essentielles. Merci pour ça.'),

('birthday', 'tu', 'moyen', 'famille', true, false, 'Anniversaire famille',
'Joyeux anniversaire, {prenom}.
Du fond du cœur je te souhaite une année belle, douce et pleine de ce qui compte vraiment pour toi.');
