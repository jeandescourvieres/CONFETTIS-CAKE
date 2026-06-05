-- Templates : message de l'humain AU poisson du contact, pour son anniversaire
-- animal_type = 'poisson' | animal_direction = 'to' | occasion = 'birthday'

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'Joyeux anniversaire petit(e) amnésique adoré(e).',
$$"Joyeux anniversaire petit(e) amnésique adoré(e)." Ton humain m'a dit que t'avais une mémoire de trois secondes. J'ai vérifié sur internet. C'est un mythe. T'as en réalité une mémoire de plusieurs mois. Mais honnêtement la version mythologique te va tellement mieux que je préfère y croire. Joyeux anniversaire, légende vivante plus vraie que la réalité.
Avec fact-checking abandonné au profit du romantisme, Celui/celle qui préfère le mythe à la vérité 🔬$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'On s''est rencontrés la dernière fois que je suis venu(e).',
$$"On s'est rencontrés la dernière fois que je suis venu(e)." T'as nagé vers moi. T'as ouvert la bouche. T'es reparti(e). J'ai pris ça pour un bonjour. Ton humain a dit que tu faisais ça avec tout le monde. J'ai décidé que pour moi c'était différent. Joyeux anniversaire, être dont j'interprète chaque geste à mon avantage.
Avec projection émotionnelle totalement assumée, Celui/celle que ton bonjour générique a quand même touché(e) 🐟$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'Ton humain te parle.',
$$"Ton humain te parle." Vraiment. En rentrant. En te nourrissant. En passant devant ton bocal. Des vraies phrases. Des vraies nouvelles de sa journée. T'ouvres la bouche. Tu fais des bulles. Il/elle prend ça pour une réponse. Vous avez l'air de vous comprendre parfaitement. Joyeux anniversaire, interlocuteur(interlocutrice) idéal(e) qui juge jamais.
Avec légère jalousie pour ta capacité d'écoute sans interruption, Le/la témoin de vos conversations aquatiques 💬$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'J''ai tapé sur la vitre en arrivant.',
$$"J'ai tapé sur la vitre en arrivant." T'as nagé vers moi. J'étais content(e). Puis t'as continué à nager. Droit devant. Comme si j'avais jamais existé. J'ai retapé. T'as refait un tour. On a recommencé trois fois. C'était notre conversation. Elle était belle à sa façon. Joyeux anniversaire, partenaire de dialogue circulaire.
Avec index légèrement endolori et bonne humeur intacte, Ton interlocuteur/ton interlocutrice à travers la vitre 🪟$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'Ton humain t''a mis des décorations dans le bocal pour ton anniversaire.',
$$"Ton humain t'a mis des décorations dans le bocal pour ton anniversaire." Un petit drapeau. Des cailloux colorés. Une nouvelle plante. T'as tout redécouvert avec l'air de quelqu'un qui visite un pays étranger magnifique. Quatre fois. Avec le même émerveillement à chaque passage. Joyeux anniversaire, voyageur(voyageuse) immobile aux destinations infinies.
Avec émerveillement vicaire pour tes découvertes répétées, Le/la témoin de tes quatre premières fois simultanées 🗺️$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'Je t''ai apporté de la nourriture spéciale pour ton anniversaire.',
$$"Je t'ai apporté de la nourriture spéciale pour ton anniversaire." Ton humain m'avait briefé(e). Dosage précis. Pas trop. Juste ce qu'il faut. J'ai respecté la consigne. T'as mangé en trois secondes avec une concentration totale et une joie pure. Puis t'as continué à nager comme si rien s'était passé. Joyeux anniversaire, être dont le bonheur est simple, immédiat et complet.
Avec leçon de vie reçue cinq à la fois, Celui/celle que tu as rendu(e) jaloux(se) de ta simplicité 🍽️$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'Je sais pas si tu te souviens de moi.',
$$"Je sais pas si tu te souviens de moi." Statistiquement non. Émotionnellement j'espère que si. Ton humain dit que t'as de bonnes capacités de reconnaissance en réalité. Alors peut-être. Peut-être que quelque part dans ton cerveau de poisson il y a un tout petit fichier avec mon visage dedans. Joyeux anniversaire, archiviste mystérieux(se) de mes espoirs.
Avec optimisme inversement proportionnel aux probabilités, Celui/celle qui croit être dans ta mémoire quelque part 🗂️$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'T''as l''air serein(e).',
$$"T'as l'air serein(e)." Vraiment. Profondément. T'as pas de réunions. Pas de mails. Pas de lundi matin. Pas de questions existentielles visibles. Juste le bocal. Le château. Les cailloux. L'eau. Et toi dedans. Joyeux anniversaire, maître(maîtresse) zen que j'observe avec une envie croissante.
Avec jalousie profonde et thérapie envisagée, Celui/celle qui aimerait ta vie pendant cinq minutes 🧘$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'Ton bocal est toujours propre. Ton eau toujours claire.',
$$"Ton bocal est toujours propre. Ton eau toujours claire." Ton humain fait ça sans que tu le demandes. Sans que tu le remarques vraiment. Sans attendre de remerciements. C'est de l'amour pur. Discret. Régulier. Invisible. Joyeux anniversaire, être choyé(e) en silence par quelqu'un qui t'aime sans calcul.
Avec émotion pour cette belle dynamique silencieuse, Le/la témoin de l'amour aquatique quotidien 💙$$,
'humorous', true, false, 'birthday', 'poisson', 'to'),

(null, 'Je comprends pas vraiment ta vie. Mais je la trouve belle.',
$$"Je comprends pas vraiment ta vie. Mais je la trouve belle." Un cercle. Un château. De l'eau claire. De la nourriture qui arrive. Un humain qui passe et qui sourit. C'est simple. C'est complet. C'est tout ce qu'il faut peut-être. Joyeux anniversaire, philosophe aquatique dont j'essaie d'apprendre la sagesse.
Avec admiration sincère pour ton existence épurée, Celui/celle que ton bocal a rendu(e) pensif(ve) 🌊$$,
'humorous', true, false, 'birthday', 'poisson', 'to');
