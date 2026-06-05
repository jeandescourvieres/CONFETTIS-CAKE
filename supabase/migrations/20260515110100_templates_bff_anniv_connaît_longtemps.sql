-- Templates BFF anniversaire — "On se connaît depuis trop longtemps"
-- occasion = 'birthday' | subtype = 'bff' | is_system = true

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, subtype)
values

(null, 'Joyeux anniversaire. On se connaît depuis combien de temps exactement.',
$$"Joyeux anniversaire. On se connaît depuis combien de temps exactement." J'ai calculé. C'est beaucoup. C'est suffisamment longtemps pour avoir traversé plusieurs versions de nous deux. Plusieurs coiffures. Plusieurs appartements. Plusieurs crises. Plusieurs bonheurs. Plusieurs trucs dont on parle encore et d'autres dont on ne parle plus jamais. Joyeux anniversaire, {prenom}, vieille histoire.
Avec calcul précis du nombre d'années et respect pour ce que ça représente, — Quelqu'un qui était là avant que tu sois vraiment toi et le sera après 📅$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. Tu peux plus me mentir.',
$$"Joyeux anniversaire. Tu peux plus me mentir." Pas sur les vraies choses. T'essaies parfois. Je vois. Ton visage fait quelque chose. Ta voix change légèrement. Il y a un micro-décalage entre ce que tu dis et ce que tu penses. Je dis rien. Mais je vois. Depuis le temps je vois tout. Joyeux anniversaire, {prenom}.
Avec détecteur de mensonge calibré sur ta fréquence spécifique depuis des années, — Quelqu'un qui sait et attend que tu le dises toi-même quand tu seras prêt 🔍$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. J''ai connu ta pire période.',
$$"Joyeux anniversaire. J'ai connu ta pire période." Pas la plus facile à raconter. Pas celle que tu mets en avant. L'autre. Celle où tu étais moins bien. Moins toi. Moins sûr. Et j'étais là. Et j'ai vu. Et je suis toujours là. Et je t'aime autant maintenant qu'à ce moment-là. Joyeux anniversaire, {prenom}.
Avec mémoire complète de toutes les périodes et présence dans chacune, — Quelqu'un qui te connaît dans toutes tes versions et reste 💛$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On a survécu à des trucs qui auraient dû nous séparer.',
$$"Joyeux anniversaire. On a survécu à des trucs qui auraient dû nous séparer." Des malentendus. Des distances. Des périodes de silence. Des moments où l'un de nous était pas disponible pour l'autre. Des moments difficiles qui auraient pu tout abîmer. Et ça a tenu. Pas par hasard. Par choix. Joyeux anniversaire, {prenom}.
Avec respect pour la résistance de ce lien face à tout ce qui aurait pu le casser, — Quelqu'un qui a choisi de rester à chaque carrefour et referait ce choix 🛤️$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. Je t''ai vu avant que tu sois présentable.',
$$"Joyeux anniversaire. Je t'ai vu avant que tu sois présentable." Physiquement. Émotionnellement. T'as pas fait d'efforts pour m'impressionner. T'étais juste toi. Avec le désordre et les doutes et les mauvais jours et les bonnes idées mélangés. Et c'est cette version-là que j'ai choisie. Joyeux anniversaire, {prenom}.
Avec référence à des moments spécifiques où tu étais clairement pas à ton meilleur, — Quelqu'un qui t'a vu sans préparation et est quand même resté 🪞$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. Je sais comment tu étais à vingt ans.',
$$"Joyeux anniversaire. Je sais comment tu étais à vingt ans." En détail. Avec les preuves. Les photos existent. Les anecdotes existent. Les témoignages existent. Je suis une archive vivante de qui tu étais avant que tu deviennes qui tu es. C'est un pouvoir que je n'utilise qu'avec modération. Joyeux anniversaire, {prenom}.
Avec archives complètes accessibles sur demande ou en cas de nécessité diplomatique, — Quelqu'un qui garde les preuves au chaud mais les utilise rarement 📁$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. T''as changé et je t''aime autant.',
$$"Joyeux anniversaire. T'as changé et je t'aime autant." Pas pareil qu'avant. Différent. Sur des points importants. Certains changements je les avais vus venir. D'autres m'ont surpris. Dans le bon sens. T'es devenu quelqu'un que j'aurais peut-être pas prévu mais que je préfère probablement. Joyeux anniversaire, {prenom}.
Avec bilan des changements observés et verdict globalement très positif, — Quelqu'un qui a suivi toute l'évolution et approuve la direction générale 📈$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. Je me souviens exactement comment on s''est rencontrés.',
$$"Joyeux anniversaire. Je me souviens exactement comment on s'est rencontrés." T'en souviens-tu de la même façon. Probablement pas. On a chacun notre version. La mienne est précise. Elle a des détails que t'as peut-être oubliés. Ce premier moment où quelque chose a dit que ça allait durer. Joyeux anniversaire, {prenom}.
Avec version personnelle du moment fondateur conservée intacte, — Quelqu'un qui se souvient du début et qui pense que c'était bien de commencer 🌱$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On a des opinions l''un sur l''autre que les autres ont pas.',
$$"Joyeux anniversaire. On a des opinions l'un sur l'autre que les autres ont pas." Des vraies. Des fondées sur des preuves réelles. Des années d'observation directe. Personne autour de toi te connaît comme je te connais. C'est une responsabilité. Je la prends au sérieux. Joyeux anniversaire, {prenom}.
Avec conscience de ce que cette connaissance représente et du soin qu'elle demande, — Quelqu'un qui utilise cette connaissance pour ton bien presque toujours 🧠$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On a eu des désaccords sérieux.',
$$"Joyeux anniversaire. On a eu des désaccords sérieux." Pas des broutilles. Des vrais. Sur des sujets importants. Où on avait tort et raison différemment. Où on s'est dit des choses difficiles. Et on a tenu quand même. Parce que le lien était plus fort que les désaccords. Joyeux anniversaire, {prenom}.
Avec respect pour ce que traverser des désaccords sérieux ensemble représente, — Quelqu'un qui a eu tort dans certains de ces désaccords et préfère pas dire lesquels 🤝$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. Je sais ce qui te ferait vraiment plaisir.',
$$"Joyeux anniversaire. Je sais ce qui te ferait vraiment plaisir." Pas ce que tu demandes. Ce qui te ferait vraiment plaisir. Ces deux choses ne sont pas toujours les mêmes. T'as des besoins que tu n'exprimes pas. Des envies que tu ne formules pas. Je les connais. Depuis le temps. Joyeux anniversaire, {prenom}.
Avec connaissance de tes vrais besoins et effort pour y répondre même sans demande, — Quelqu'un qui essaie d'anticiper depuis des années et réussit parfois 🎯$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. T''as été là pour moi d''une façon que je peux pas oublier.',
$$"Joyeux anniversaire. T'as été là pour moi d'une façon que je peux pas oublier." Il y a eu des moments. Précis. Où t'aurais pu pas être là. Où c'était compliqué pour toi aussi. Où t'as quand même choisi d'être présent. Ces moments-là je les porte. Ils font partie de pourquoi je suis là ce soir. Joyeux anniversaire, {prenom}.
Avec reconnaissance pour des moments spécifiques gardés précieusement, — Quelqu'un qui n'oublie pas ce genre de chose et compte bien le rendre 💛$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On a un langage qu''on est les seuls à parler.',
$$"Joyeux anniversaire. On a un langage qu'on est les seuls à parler." Des références. Des raccourcis. Des mots qui veulent dire quelque chose de précis pour nous et rien pour les autres. Ce vocabulaire commun construit sur des années d'histoires partagées. Ce langage privé. Joyeux anniversaire, {prenom}.
Avec gratitude pour ce langage et tout ce qu'il a fallu vivre pour le construire, — Quelqu'un qui parle couramment cette langue et apprécie d'être bilingue avec toi 🗣️$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On se connaît depuis assez longtemps pour se dire les vraies choses.',
$$"Joyeux anniversaire. On se connaît depuis assez longtemps pour se dire les vraies choses." Pas toujours agréables. Mais vraies. Ce niveau de confiance où on peut dire quelque chose de difficile parce qu'on sait comment ça sera reçu. Parce qu'on sait que ça vient d'un bon endroit. Parce que l'amitié est assez solide pour supporter la vérité. Joyeux anniversaire, {prenom}.
Avec gratitude pour cette solidité qui permet la franchise, — Quelqu'un qui t'a dit des vérités difficiles et vice versa et qui trouve ça précieux 💎$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. Je me souviens de la première fois que t''as parlé de quelque chose d''important.',
$$"Joyeux anniversaire. Je me souviens de la première fois que t'as parlé de quelque chose d'important." Ce sujet. Cette conversation. Ce moment où t'avais décidé de me faire confiance sur quelque chose de vrai. Je me souviens de l'endroit. De l'heure approximativement. De ce que j'ai ressenti. C'était un tournant. Joyeux anniversaire, {prenom}.
Avec mémoire précise du moment de confiance fondateur et de ce qu'il a représenté, — Quelqu'un qui a compris ce que ce moment signifiait et l'a traité avec soin 🤍$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On a passé des heures à ne rien faire ensemble.',
$$"Joyeux anniversaire. On a passé des heures à ne rien faire ensemble." Pas seulement des moments forts. Des heures ordinaires. Assis quelque part. Pas obligés de se divertir. Pas obligés de se parler tout le temps. Ces heures de présence silencieuse et confortable. Joyeux anniversaire, {prenom}.
Avec nostalgie pour ces heures et gratitude pour leur existence dans notre histoire, — Quelqu'un avec qui le silence est confortable depuis longtemps 🛋️$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. T''as été témoin de ma vie aussi.',
$$"Joyeux anniversaire. T'as été témoin de ma vie aussi." C'est réciproque. Je t'ai vu. Tu m'as vu. On est les témoins l'un de l'autre. Cette fonction rare. Être là quand quelque chose se passe. Être la personne qui peut dire j'étais là. Joyeux anniversaire, {prenom}, mon témoin.
Avec reconnaissance de ce rôle mutuel et de sa valeur unique, — Quelqu'un qui est content que tu aies été là pour voir aussi 👀$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On a ri de choses qu''on peut raconter à personne.',
$$"Joyeux anniversaire. On a ri de choses qu'on peut raconter à personne." Ces fous rires. Ces situations. Ces moments qu'on a partagés et qui n'appartiennent qu'à nous. Pas par honte. Par intimité. Parce que certaines choses n'existent que dans le contexte de ce qu'on est l'un pour l'autre. Joyeux anniversaire, {prenom}.
Avec pensée pour au moins trois de ces moments précis ce soir, — Quelqu'un qui rit encore en y pensant et sait exactement lesquels tu penses aussi 😂$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. Je t''aurais choisi si on s''était pas rencontrés par hasard.',
$$"Joyeux anniversaire. Je t'aurais choisi si on s'était pas rencontrés par hasard." Si on m'avait décrit quelqu'un. Avec tes qualités. Tes défauts. Ta façon d'être. Et qu'on m'avait demandé si je voulais cette personne dans ma vie. J'aurais dit oui. Pas parce que t'es parfait. Parce que t'es exactement le type de personne dont j'ai besoin. Joyeux anniversaire, {prenom}.
Avec certitude que ce n'était pas que du hasard et que le choix aurait été le même, — Quelqu'un qui te choisit activement et pas juste par inertie depuis longtemps 🎯$$,
'humorous', true, false, 'birthday', 'bff'),

(null, 'Joyeux anniversaire. On se connaît depuis trop longtemps pour que je t''offre autre chose que la vérité.',
$$"Joyeux anniversaire. On se connaît depuis trop longtemps pour que je t'offre autre chose que la vérité." Les beaux discours je pourrais. Les compliments polis aussi. Mais t'as pas besoin de ça de ma part. T'as besoin de quelqu'un qui te connaît vraiment et qui est là vraiment. Voilà ce que je suis. Voilà ce que je t'offre ce soir. Joyeux anniversaire, {prenom}.
Avec honnêteté comme cadeau principal et présence comme cadeau secondaire, — Quelqu'un qui est là ce soir et le sera demain et c'est tout ce qu'il y a à dire ❤️$$,
'humorous', true, false, 'birthday', 'bff');
