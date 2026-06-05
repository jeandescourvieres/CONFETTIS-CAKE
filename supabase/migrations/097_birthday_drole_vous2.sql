-- Migration 097 : Templates anniversaire — Drôle, ton=vous, thèmes 11-20

INSERT INTO message_templates (occasion, ton, longueur, style, is_system, is_manual_only, title, content) VALUES

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Encore un tour de soleil de complété. Vous gérez ça avec beaucoup de régularité, il faut le reconnaître.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On ne compte plus les bougies — on admire la résistance. Et la vôtre est impressionnante.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
J''espère sincèrement que vous recevez aujourd''hui au moins un cadeau qui vous surprend vraiment. Vous le méritez.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Une année de plus, donc une année de sagesse supplémentaire. Le stock doit commencer à être conséquent.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Les années passent mais vous restez. C''est l''essentiel. Pour le reste on verra.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
J''espère que vous avez de bons poumons. Les bougies ne vont pas souffler toutes seules.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On sait tous les deux que vous auriez préféré passer incognito aujourd''hui. Trop tard.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Vous avez l''âge que vous avez et franchement vous le portez bien. Mieux que prévu, même.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Le gâteau d''abord. Les discours ensuite. Dans cet ordre et pas l''inverse.'),

('birthday', 'vous', 'moyen', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
On accumule les années ensemble et franchement c''est beaucoup plus drôle à deux.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Un an de plus. On pourrait faire semblant que ça ne compte pas, que les chiffres sont sans importance, que l''âge c''est dans la tête. Et il y a du vrai là-dedans. Mais soyons honnêtes — les années s''accumulent quand même. La bonne nouvelle c''est que vous semblez vous améliorer avec chaque millésime. Comme un bon vin. Ou un fromage. Dans tous les cas quelque chose de bien.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je vais vous proposer un pacte. On décide ensemble que l''âge c''est une information purement administrative — utile pour les formulaires, sans réelle signification dans la vraie vie. Officiellement vous avez le nombre d''années que le calendrier indique. Officieusement vous avez l''énergie, l''humour et la façon d''être de quelqu''un qui n''en a aucune idée. Restons-en là.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Aujourd''hui c''est le grand jour des cadeaux. Le moment où on découvre ce que les gens ont imaginé pour vous — avec plus ou moins de succès, avec plus ou moins d''inspiration. La règle c''est de tout accueillir avec le même enthousiasme convaincant. Vous maîtrisez ça. Et si par chance un cadeau est vraiment bien, vous avez le droit d''être sincèrement surpris. Bonne récolte.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Chaque année qui passe est censée apporter son lot de sagesse. C''est ce qu''on dit. C''est probablement vrai dans l''ensemble. Dans votre cas j''observe effectivement une progression — vous posez de meilleures questions, vous vous énervez pour moins de choses, et vous choisissez mieux vos batailles. C''est exactement ce à quoi ressemble la sagesse de l''extérieur. Bravo.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Il paraît qu''avec l''âge le corps commence à envoyer des messages. Parfois c''est le dos. Parfois c''est les genoux. Parfois c''est cette douleur mystérieuse dont on ne sait pas trop d''où elle vient. La bonne nouvelle c''est qu''on développe aussi une sagesse corporelle — on sait mieux quand s''arrêter, quand se reposer, quand écouter ce que le corps dit. C''est une forme de progrès. Bonne journée quand même.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Le rituel des bougies est fascinant si on y réfléchit une seconde. On plante des petites flammes dans de la nourriture. On chante une chanson. On fait un vœu en secret. On souffle. Tout le monde applaudit comme si c''était un exploit sportif. Et ensuite on mange. Ce rituel est absurde, universel, et indémodable. Profitez bien de votre moment de gloire pyrotechnique.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Je sais que l''idéal pour vous aujourd''hui aurait été que tout le monde oublie. Que la date passe discrètement. Que personne ne fasse de bruit. Ça n''a pas fonctionné — et c''est tant mieux. Parce que les gens autour de vous ont très envie de vous dire qu''ils sont contents que vous soyez là. Et votre anniversaire est une excellente occasion pour ça. Désolé pour le dérangement. Vraiment pas.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Si vous pouviez croiser votre version d''il y a quinze ans dans un couloir, je pense qu''elle serait assez étonnée. Pas parce que vous êtes devenu quelqu''un de différent — mais parce que vous êtes devenu quelqu''un de mieux. Plus posé. Plus sûr. Plus vous. Les années ont travaillé dans le bon sens. Et la version actuelle de vous est clairement la meilleure à ce jour.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Parlons de l''essentiel. Le gâteau. C''est la vraie raison pour laquelle les anniversaires existent — tout le reste, les vœux, les cadeaux, les discours, c''est du contexte. Le gâteau c''est le cœur du sujet. Alors j''espère qu''il est excellent, qu''il y en a assez, et que vous vous réservez la plus belle part sans vous justifier auprès de qui que ce soit. Vous l''avez largement mérité.'),

('birthday', 'vous', 'long', 'drole', true, false, 'Anniversaire drôle',
'Joyeux anniversaire, {prenom}.
Il y a quelque chose de réconfortant dans le fait de vieillir avec des gens qu''on apprécie. On partage les mêmes références qui ne parlent plus aux jeunes. On se comprend sans avoir à tout expliquer. On rit des mêmes choses depuis des années. Et quelque part dans tout ça on réalise qu''on a construit quelque chose de solide — une complicité qui s''est bonifiée avec le temps. Merci d''en faire partie.');
