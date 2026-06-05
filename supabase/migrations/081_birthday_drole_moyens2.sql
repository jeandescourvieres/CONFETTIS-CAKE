-- Migration 081 : Templates anniversaire — Catégorie Drôle, moyens thèmes 11-20

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Encore un tour de soleil de complété. Tu gères ça avec beaucoup de régularité, il faut le reconnaître.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On ne compte plus les bougies — on admire la résistance. Et la tienne est impressionnante.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
J''espère sincèrement que tu reçois aujourd''hui au moins un cadeau qui te surprend vraiment. Tu le mérites.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Une année de plus, donc une année de sagesse supplémentaire. Le stock doit commencer à être conséquent.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Les années passent mais toi tu restes. C''est l''essentiel. Pour le reste on verra.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
J''espère que tu as de bons poumons. Les bougies ne vont pas souffler toutes seules.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On sait tous les deux que tu aurais préféré passer incognito aujourd''hui. Trop tard.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Tu as l''âge que tu as et franchement tu le portes bien. Mieux que prévu, même.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Le gâteau d''abord. Les discours ensuite. Dans cet ordre et pas l''inverse.'),

('birthday', 'tu', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On accumule les années ensemble et franchement c''est beaucoup plus drôle à deux.');
