-- Templates : message de l'humain AU hamster du contact, pour son anniversaire
-- animal_type = 'hamster' | animal_direction = 'to' | occasion = 'birthday'

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'Joyeux anniversaire petit(e) chose.',
$$"Joyeux anniversaire petit(e) chose." Ton humain m'a envoyé ta photo ce matin. T'étais dans ta roue. À 6h du matin. Avec une énergie que je t'envie profondément. Moi à 6h du matin je ressemble à rien. Toi t'avais l'air d'un champion olympique en pleine compétition. Joyeux anniversaire, athlète incompris(e) du monde moderne.
Avec admiration pour ton endurance et honte pour la mienne, Ton fan qui dort encore à 6h du mat 🏅$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'On s''est rencontrés une fois. Tu m''as reniflé le pouce.',
$$"On s'est rencontrés une fois. Tu m'as reniflé le pouce." J'ai pas bougé. J'avais trop peur de te faire tomber. Ton humain m'avait dit "tiens le bien" comme si je tenais un objet précieux et fragile. C'est exactement ce que t'es. Joyeux anniversaire, petite merveille que je tenais avec une terreur respectueuse.
Avec souvenir intact et mains encore légèrement tremblantes, Celui/celle qui t'a tenu(e) une fois et s'en souvient encore 🤲$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'Ton humain parle de toi comme si t''étais une célébrité.',
$$"Ton humain parle de toi comme si t'étais une célébrité." "Il/elle a fait ça hier." "Il/elle a couru 5 kilomètres cette nuit." "Il/elle a fait une tête trop mignonne." J'entends ton nom au moins trois fois par conversation. T'as plus de présence dans sa vie que la plupart des humains qu'il/elle connaît. Joyeux anniversaire, star du quotidien à fourrure miniature.
Avec légère jalousie et admiration totale, L'ami qui arrive loin derrière toi dans les conversations 🎙️$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'J''ai cherché un cadeau d''anniversaire pour un hamster.',
$$"J'ai cherché un cadeau d'anniversaire pour un hamster." Internet m'a proposé des roues, des tunnels, des balles roulantes et un spa pour rongeurs. J'ai pris la balle roulante parce que l'image était drôle. Ton humain m'a dit que t'allais adorer. J'espère. Joyeux anniversaire, consommateur exigeant de produits de niche.
Avec recherches approfondies et budget raisonnable, Ton fournisseur officiel de matériel roulant 🔮$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'Je comprends pas comment quelque chose d''aussi petit peut prendre autant de place.',
$$"Je comprends pas comment quelque chose d'aussi petit peut prendre autant de place." Dans la cage d'abord, t'as tout réorganisé à ta façon. Dans l'appartement ensuite, tout tourne autour de toi. Dans la vie de ton humain surtout, t'es partout. Photos. Anecdotes. Inquiétudes nocturnes. Joyeux anniversaire, phénomène miniature à impact maximum.
Avec incompréhension bienveillante et fascination réelle, Celui/celle qui essaie de comprendre ton pouvoir 🔬$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'Ton humain m''a appelé(e) un soir parce qu''il/elle te trouvait plus dans la cage.',
$$"Ton humain m'a appelé(e) un soir parce qu'il/elle te trouvait plus dans la cage." Vingt minutes de panique au téléphone. T'étais dans ton tube. Endormi(e). Comme d'habitude. On a raccroché soulagés tous les deux. Toi t'as continué à dormir sans te douter de rien. Joyeux anniversaire, source d'angoisses nocturnes involontaires.
Avec soulagement mémorisé et numéro toujours en favoris, Le/la confident(e) des crises hamster à 22h 📞$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'J''ai vu une vidéo de toi sur le téléphone de ton humain.',
$$"J'ai vu une vidéo de toi sur le téléphone de ton humain." T'étais en train de manger une graine avec une concentration et un sérieux qui m'ont ému(e). Deux minutes de vidéo. J'ai regardé jusqu'au bout. J'ai trouvé ça fascinant. Je remets en question mes centres d'intérêt. Joyeux anniversaire, réalisateur(trice) involontaire de contenu captivant.
Avec deux minutes de ma vie parfaitement investies, Ton spectateur/ta spectatrice conquis(e) 🎬$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'Je sais pas si tu dors la nuit ou si tu fais semblant.',
$$"Je sais pas si tu dors la nuit ou si tu fais semblant." Ton humain dit que t'es nocturne. Que t'es en pleine forme à 3h du matin. Que la roue tourne pendant des heures dans le noir. Je trouve ça à la fois impressionnant et légèrement inquiétant. Joyeux anniversaire, créature de la nuit aux activités mystérieuses.
Avec curiosité mêlée de respect, Celui/celle qui dort pendant tes meilleures heures 🌙$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'Ton humain t''a fait un gâteau spécial graines et légumes.',
$$"Ton humain t'a fait un gâteau spécial graines et légumes." Il/elle a passé une heure dessus. Il/elle était fier(fière) comme tout. T'as mangé le coin gauche en quatre secondes et t'es reparti(e). Il/elle a quand même pris une photo du gâteau entamé. Joyeux anniversaire, critique gastronomique au palais sélectif.
Avec respect pour ton humain pâtissier/pâtissière et compassion pour son ego, Le/la témoin attendri(e) de vos échanges culinaires 🎂$$,
'humorous', true, false, 'birthday', 'hamster', 'to'),

(null, 'Je pensais pas qu''on pouvait s''attacher autant à un hamster.',
$$"Je pensais pas qu'on pouvait s'attacher autant à un hamster." Et puis ton humain t'a montré. La façon dont il/elle te regarde. Dont il/elle s'inquiète. Dont il/elle raconte tes exploits quotidiens comme si t'avais décroché la lune. Et maintenant moi aussi j'attends des nouvelles. Moi aussi je demande comment tu vas. Moi aussi j'ai ta photo dans mon téléphone. Joyeux anniversaire, petit être qui élargit les cœurs sans effort.
Avec attachement inattendu et totalement assumé, Ton fan officiel numéro deux, converti(e) sans prévenir ❤️$$,
'humorous', true, false, 'birthday', 'hamster', 'to');
