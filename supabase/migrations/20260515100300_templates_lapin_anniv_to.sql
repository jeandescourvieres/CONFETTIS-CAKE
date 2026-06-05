-- Templates : message de l'humain AU lapin du contact, pour son anniversaire
-- animal_type = 'lapin' | animal_direction = 'to' | occasion = 'birthday'

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'Joyeux anniversaire petite(e) boule de poils.',
$$"Joyeux anniversaire petite(e) boule de poils." Ton humain m'a envoyé ta photo ce matin. T'avais les oreilles en arrière et un air de quelqu'un qui supporte le monde avec dignité. J'ai trouvé ça profondément beau. Joyeux anniversaire, philosophe silencieux(se) aux grandes oreilles.
Avec admiration pour ton maintien et ta sérénité apparente, Ton fan du matin qui reçoit les photos avant son café 📱$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'On s''est rencontrés chez ton humain un dimanche.',
$$"On s'est rencontrés chez ton humain un dimanche." T'es venu(e) renifler mes chaussures. Puis tu t'es assis(e) à exactement 30 centimètres de moi. Ni plus ni moins. Comme si t'avais calculé la distance de sécurité optimale. J'ai respecté ça. On s'est regardés. C'était un moment. Joyeux anniversaire, être aux frontières précises et respectables.
Avec respect total de tes 30 centimètres, Celui/celle qui n'a jamais franchi la limite 📐$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'Ton humain t''a construit un parcours de jeu le week-end dernier.',
$$"Ton humain t'a construit un parcours de jeu le week-end dernier." Tunnels. Rampes. Obstacles. Il/elle a passé quatre heures dessus. T'as reniflé l'entrée du premier tunnel. T'es reparti(e) sur ton coussin. Il/elle a quand même pris une photo du parcours vide pour m'envoyer. Joyeux anniversaire, juge impitoyable des initiatives humaines.
Avec compassion pour ton humain bricoleur/bricoleuse, Le/la témoin de ses efforts non reconnus 🔨$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'Je savais pas que les lapins pouvaient bouder.',
$$"Je savais pas que les lapins pouvaient bouder." Ton humain m'a expliqué que quand tu tournes le dos et que tu t'assieds dans le coin c'est que t'es vexé(e). Que ça peut durer des heures. Que la seule solution c'est de s'excuser verbalement et sincèrement. À un lapin. Joyeux anniversaire, être qui a inventé le silence punitif avant tout le monde.
Avec respect pour tes techniques de communication avancées, Celui/celle qui prendra des notes pour usage personnel 📓$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'Ton humain m''a dit que tu fais des binkies quand t''es heureux(se).',
$$"Ton humain m'a dit que tu fais des binkies quand t'es heureux(se)." J'ai cherché ce que c'était. J'ai regardé une vidéo. T'as sauté en l'air en faisant une rotation complète et t'as atterri comme si de rien n'était. J'ai regardé la vidéo six fois. Joyeux anniversaire, danseur/danseuse de joie le plus pur(e) que j'ai jamais vu.
Avec six visionnages et sourire persistant, Ton spectateur/ta spectatrice converti(e) aux binkies 💫$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'J''ai apporté des carottes. Les meilleures. Celles du marché.',
$$"J'ai apporté des carottes. Les meilleures. Celles du marché." Ton humain m'avait dit que tu étais difficile. Que t'aimais les carottes mais pas n'importe lesquelles. Que la texture comptait. La fraîcheur aussi. J'ai pris ça au sérieux. Je les ai choisies une par une. Joyeux anniversaire, gourmet exigeant(e) qui mérite le meilleur.
Avec sélection rigoureuse et attente de ton verdict, Ton fournisseur officiel de carottes premium 🥕$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'Ton humain m''a montré comment te faire des câlins correctement.',
$$"Ton humain m'a montré comment te faire des câlins correctement." Y'a une technique apparemment. Une façon de poser les mains. Un endroit précis derrière les oreilles. Un rythme. Une durée. J'ai pris des notes mentales. J'ai essayé. T'as fermé les yeux deux secondes. C'était ma plus grande victoire de l'année. Joyeux anniversaire, être aux câlins techniques et précis.
Avec technique maîtrisée et victoire chérie, Ton câlineur/câlineuse certifié(e) niveau débutant 🤲$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'Je comprends pas pourquoi t''es aussi silencieux(se).',
$$"Je comprends pas pourquoi t'es aussi silencieux(se)." Les chiens aboient. Les chats ronronnent. Les oiseaux chantent. Toi tu communiques avec des mouvements d'oreilles et des regards que seul ton humain décode. C'est mystérieux. C'est élégant. C'est légèrement intimidant. Joyeux anniversaire, maître/maîtresse du langage non verbal.
Avec incompréhension respectueuse et admiration sincère, Celui/celle qui essaie encore de te lire 👂$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'Ton humain t''a fait une séance photo pour ton anniversaire.',
$$"Ton humain t'a fait une séance photo pour ton anniversaire." Chapeau de fête. Petit décor. Lumière soignée. T'as regardé l'objectif exactement une fois. Une seule. La photo est magnifique. Encadrée dans le salon maintenant. T'as l'air d'un(e) monarque qui accorde une audience. Joyeux anniversaire, modèle naturel(le) sans effort apparent.
Avec admiration pour ton instinct photographique inné, Le/la fan de ta photo encadrée au salon 👑$$,
'humorous', true, false, 'birthday', 'lapin', 'to'),

(null, 'Je pensais que les lapins c''était simple à avoir.',
$$"Je pensais que les lapins c'était simple à avoir." Ton humain m'a détrompé(e). Alimentation spécifique. Espace vital calculé. Stimulation intellectuelle quotidienne. Vétérinaire spécialisé. Bouderies à gérer. Câlins techniques. T'es un projet de vie complet. Joyeux anniversaire, être infiniment plus complexe que prévu et infiniment plus attachant.
Avec idées reçues définitivement balayées, Celui/celle que tu as rendu(e) humble 🎓$$,
'humorous', true, false, 'birthday', 'lapin', 'to');
