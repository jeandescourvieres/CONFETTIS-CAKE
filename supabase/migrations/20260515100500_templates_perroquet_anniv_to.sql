-- Templates : message de l'humain AU perroquet du contact, pour son anniversaire
-- animal_type = 'perroquet' | animal_direction = 'to' | occasion = 'birthday'

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'Joyeux anniversaire. Tu m''as dit bonjour la dernière fois que je suis venu.',
$$"Joyeux anniversaire. Tu m'as dit bonjour la dernière fois que je suis venu." Ton humain dit que tu fais pas ça avec tout le monde. Que tu choisis. Que c'est un honneur. J'ai pris ça très au sérieux. J'ai même un peu les larmes aux yeux en l'écrivant. Joyeux anniversaire, sélectionneur(sélectionneuse) au goût irréprochable.
Avec fierté disproportionnée et totalement assumée, Celui/celle que tu as daigné saluer 🏆$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'T''as répété mon prénom la dernière fois que je suis venu(e).',
$$"T'as répété mon prénom la dernière fois que je suis venu(e)." Juste une fois. Avec ton accent. Avec ta voix. T'avais l'air de tester le son. De l'évaluer. De décider si ça valait la peine d'être conservé. J'attends encore le verdict. Joyeux anniversaire, juge suprême du patrimoine sonore de l'appartement.
Avec prénom soumis à ton appréciation depuis six mois, Celui/celle en attente de ta validation définitive 🎙️$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'Ton humain m''avait prévenu(e) de pas répéter certaines choses devant toi.',
$$"Ton humain m'avait prévenu(e) de pas répéter certaines choses devant toi." J'ai fait attention pendant deux heures. Puis j'ai oublié. J'ai raconté l'anecdote du week-end. Celle avec le parking et la voiture de location. T'as eu l'air intéressé(e). Très intéressé(e). Je prie pour que tu l'aies pas stockée. Joyeux anniversaire, coffre-fort à plumes que je surveille désormais.
Avec inquiétude modérée et comportement exemplaire depuis lors, Celui/celle qui choisit ses mots très soigneusement maintenant 😬$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'T''as une mémoire qui me dépasse complètement.',
$$"T'as une mémoire qui me dépasse complètement." Ton humain m'a dit que tu te souviens de chaque voix. Chaque son. Chaque mot entendu une seule fois. Que tu peux les ressortir des années après. Dans un silence. Devant des inconnus. Au moment le plus inattendu. Joyeux anniversaire, encyclopédie vivante aux plumes colorées.
Avec respect mêlé de crainte respectueuse, Celui/celle qui surveille ses paroles depuis ta rencontre 📚$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'Je t''ai apporté des fruits exotiques pour ton anniversaire.',
$$"Je t'ai apporté des fruits exotiques pour ton anniversaire." Mangue. Papaye. Fruit de la passion. Ton humain m'a dit que t'étais gourmet. Que la qualité comptait. Que tu crachais ce que t'aimais pas avec une précision chirurgicale et sans avertissement. Je me suis placé(e) prudemment sur le côté. Joyeux anniversaire, critique gastronomique à l'expression directe.
Avec plateau soigneusement préparé et distance de sécurité maintenue, Ton fournisseur de fruits debout légèrement sur le côté 🥭$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'T''as chanté quand je suis arrivé(e).',
$$"T'as chanté quand je suis arrivé(e)." Pas un mot. Une mélodie. Quelque chose de reconnaissable mais que j'arrivais pas à identifier. Ton humain a dit que tu composais parfois. Que c'était tes propres créations. J'avais un concert privé sans le savoir. Joyeux anniversaire, compositeur(compositrice) génial(e) au public non averti.
Avec oreilles désormais toujours en alerte chez toi, Ton spectateur/ta spectatrice de concerts improvisés 🎼$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'La première fois qu''on s''est rencontrés tu m''as regardé(e) de haut.',
$$"La première fois qu'on s'est rencontrés tu m'as regardé(e) de haut." Littéralement. T'étais sur ton perchoir. Je suis grand(e) pourtant. T'avais quand même l'air de me toiser. De m'évaluer. De rendre un verdict intérieur. Je saurai jamais ce que t'as conclu. Joyeux anniversaire, juge perché(e) aux conclusions impénétrables.
Avec verdict accepté sans appel possible, Celui/celle qui a passé ton examen sans connaître sa note ⚖️$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'Ton humain m''a dit que tu faisais des crises de jalousie.',
$$"Ton humain m'a dit que tu faisais des crises de jalousie." Que quand il/elle est au téléphone tu cries plus fort. Que quand il/elle parle à quelqu'un tu interviens. Que quand il/elle t'ignore trop longtemps tu inventes un bruit d'alarme pour ramener l'attention. Je trouve ça absolument légitime. Joyeux anniversaire, être aux besoins clairement exprimés.
Avec solidarité totale pour tes méthodes, Celui/celle qui aurait fait pareil à ta place 📣$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'J''ai essayé de te siffler un air.',
$$"J'ai essayé de te siffler un air." T'as écouté. T'as attendu que je finisse. T'as reproduit exactement ce que j'avais sifflé mais mieux. Plus juste. Avec une variation à la fin que j'avais pas prévue et qui était franchement meilleure que mon original. Joyeux anniversaire, arrangeur(arrangeuse) de talent qui améliore tout ce qu'il/elle touche.
Avec humilité musicale et leçon retenue, Ton élève qui est devenu(e) moins bon(ne) que le prof en trente secondes 🎹$$,
'humorous', true, false, 'birthday', 'perroquet', 'to'),

(null, 'Je comprends pourquoi ton humain est aussi attaché(e) à toi.',
$$"Je comprends pourquoi ton humain est aussi attaché(e) à toi." T'es unique. Vraiment. Dans le sens propre du terme. Y'a pas deux comme toi. Ta voix. Tes couleurs. Ta mémoire. Ta personnalité. Ta façon d'être présent(e) dans une pièce comme personne d'autre. Joyeux anniversaire, être irremplaçable dans tous les sens du terme.
Avec admiration sincère et compréhension tardive mais totale, Celui/celle que tu as définitivement conquis(e) 🌈$$,
'humorous', true, false, 'birthday', 'perroquet', 'to');
