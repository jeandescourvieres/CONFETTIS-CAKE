-- Migration 076 : Templates anniversaire — Catégorie 6 : Collègue / connaissance (style=collegue)
-- 10 messages moyens + 10 messages longs, ton=tu

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

-- Moyens
('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
C''est un plaisir de te côtoyer au quotidien. Que cette journée soit à la hauteur de ce que tu mérites.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Tu apportes beaucoup à notre équipe. Aujourd''hui c''est l''occasion de te le dire en dehors du cadre habituel.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Que cette nouvelle année t''apporte tout ce que tu attends — au travail comme ailleurs.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Ta bonne humeur au quotidien fait une vraie différence. Que ta journée soit aussi agréable que tu la rends pour les autres.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Ce que tu accomplis force le respect. Que cette nouvelle année soit à la hauteur de ton engagement.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Avant tout je te souhaite la santé — le reste suit toujours plus facilement quand elle est là.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Même au milieu d''une semaine chargée, ce jour mérite d''être célébré. Profites-en.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
J''espère que tu trouves le temps de souffler les bougies entre deux réunions.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
On a commencé comme collègues et je suis content que ça soit devenu autre chose. Bonne journée à toi.'),

('birthday', 'tu', 'moyen', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Pas de grands discours — juste un souhait sincère pour une belle journée et une belle année.'),

-- Longs
('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Il y a des gens avec qui le quotidien est plus agréable — pas forcément pour une raison précise, mais parce qu''ils apportent quelque chose de positif dans l''espace commun. Tu es une de ces personnes. Te côtoyer au quotidien est un plaisir réel, et je voulais profiter de ce jour pour te le dire. Que cette journée soit belle et que cette nouvelle année te soit favorable.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
On passe beaucoup de temps ensemble dans le cadre du travail, et je réalise qu''on ne prend pas toujours le temps de dire les choses. Alors aujourd''hui je le fais : tu apportes beaucoup à notre équipe. Ta façon de travailler, ton sérieux, ta disponibilité — tout ça compte et ça se voit. Que cette nouvelle année te rende ce que tu mérites professionnellement et personnellement.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Je ne vais pas m''étendre — ce n''est pas vraiment le style de notre relation. Mais je tenais à marquer ce jour et à te souhaiter une belle année. Que les prochains mois t''apportent ce que tu attends, que ce soit au travail ou dans ta vie personnelle. Profite bien de ta journée.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Il y a des gens dont la présence change l''atmosphère d''un endroit — pas par des grandes actions, mais par leur façon d''être, leur énergie, leur façon de traiter les autres. Tu as ça. Ta bonne humeur au quotidien n''est pas anodine — elle fait une vraie différence pour les gens autour de toi. Que ta journée soit aussi agréable que tu la rends pour nous au quotidien.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
En te côtoyant j''ai pu observer ta façon de travailler, de gérer les difficultés, d''avancer malgré les obstacles. C''est quelque chose que je respecte sincèrement. Tu mets beaucoup de toi-même dans ce que tu fais, et ça se voit. Que cette nouvelle année te rende tout ce que tu investis — et tu investis beaucoup.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Les anniversaires sont une bonne occasion de dire les choses simples. Et la chose la plus simple que je puisse te souhaiter c''est la santé — vraiment, profondément. Parce que c''est la base de tout le reste. Que cette nouvelle année te soit douce et que tu puisses profiter pleinement de tout ce qu''elle a à t''offrir.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Dans le rythme d''une semaine de travail, les anniversaires peuvent parfois passer un peu vite. Mais ce jour mérite quand même d''être marqué — même brièvement, même simplement. C''est ton jour. J''espère que tu trouves le temps de le savourer un peu, de recevoir les bons vœux des gens autour de toi, et de te rappeler que ce jour est pour toi. Profites-en.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Je sais que la journée est chargée — elle l''est toujours. Mais quelque part entre deux réunions et trois dossiers urgents, j''espère que tu trouves un moment pour souffler les bougies, couper un bout de gâteau si quelqu''un en a apporté un, et te rappeler que même les jours de travail peuvent avoir leur petite magie. Bonne journée quand même.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
On a commencé comme collègues — des gens qui se croisent dans un couloir, qui partagent des réunions, qui collaborent sur des projets. Et quelque part en route ça a évolué. Je suis content que ça ait évolué. Tu es quelqu''un que j''apprécie au-delà du cadre du travail, et ton anniversaire est une bonne occasion de te le dire. Bonne journée à toi.'),

('birthday', 'tu', 'long', 'collegue', true, false, 'Anniversaire collègue',
'Joyeux anniversaire, {prenom}.
Pas de grands discours, pas de formules compliquées. Juste un souhait sincère pour une belle journée et une belle année qui commence. Que les prochains mois t''apportent de bonnes choses — au travail, chez toi, partout. Tu le mérites. Profite bien de ce jour.');
