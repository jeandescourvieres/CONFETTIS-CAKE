// Messages "Je déteste les messages mais quand même"
// 100 messages × 5 occasions

export interface DestesteMessage {
  id: string;
  angle: string;
  body: string; // [Prénom] placeholder — pour ado_parent : remplacer par Papa/Maman selon civilité
}

export const DETESTE_MESSAGES: Record<'birthday' | 'nameday' | 'graduation' | 'first_job' | 'ado_parent', DestesteMessage[]> = {

  // ── ANNIVERSAIRE ────────────────────────────────────────────────────────────
  birthday: [
    { id: 'dt_b_01', angle: "Je déteste les messages d'anniversaire. Joyeux anniversaire quand même.", body: `1. "Je déteste les messages d'anniversaire. Joyeux anniversaire quand même."
C'est dit. Je suis pas du genre à envoyer des messages pour les anniversaires. Je trouve ça souvent inutile. Trop formel. Trop attendu. Et pourtant là je l'ai fait. Parce que c'est toi. Et que toi t'es une exception à presque toutes mes règles. Joyeux anniversaire, [Prénom].
Avec aveu complet de ma position sur les messages d'anniversaire et exception assumée,
— quelqu'un qui t'envoie quelque chose pour la première fois peut-être et qui espère que tu mesures l'effort 🙄` },
    { id: 'dt_b_02', angle: "Je suis pas quelqu'un qui envoie des messages pour les anniversaires. Mais t'as un anniversaire et je voulais que tu le saches.", body: `2. "Je suis pas quelqu'un qui envoie des messages pour les anniversaires. Mais t'as un anniversaire et je voulais que tu le saches."
Pas avec un emoji posté sur ton mur. Pas avec un like. Avec ça. Quelque chose qui dit que j'ai pensé à toi. Que j'ai pris le temps. Que ton anniversaire méritait plus qu'un geste automatique. Joyeux anniversaire, [Prénom].
Avec explication de pourquoi j'ai fait une exception à ma politique anti-messages,
— quelqu'un qui a pesé le pour et le contre et qui a choisi toi 📬` },
    { id: 'dt_b_03', angle: "Joyeux anniversaire. Je précise que j'envoie pas de messages d'anniversaire d'habitude.", body: `3. "Joyeux anniversaire. Je précise que j'envoie pas de messages d'anniversaire d'habitude."
Pour que tu mesures. Pour que tu saches que ça représente quelque chose. Pour que tu comprennes que recevoir ça de moi c'est pas anodin. C'est une exception. Une exception motivée. Une exception qui s'appelle toi. Joyeux anniversaire, [Prénom].
Avec mise en contexte de l'exception pour en maximiser la valeur,
— quelqu'un qui veut que tu saches exactement ce que ça lui a coûté 📊` },
    { id: 'dt_b_04', angle: "T'as un anniversaire. J'aime pas envoyer des trucs pour les anniversaires. Et pourtant.", body: `4. "T'as un anniversaire. J'aime pas envoyer des trucs pour les anniversaires. Et pourtant."
Et pourtant me voilà. À écrire des trucs. À chercher les bons mots. À me demander si ça sonne juste. Tout ça pour toi. Pour ton anniversaire. Parce que certaines personnes méritent qu'on surmonte ses principes pour elles. Joyeux anniversaire, [Prénom].
Avec description honnête du processus de rédaction contre ma nature,
— quelqu'un qui a surmonté ses principes pour toi et qui en est encore surpris 😅` },
    { id: 'dt_b_05', angle: "Joyeux anniversaire. Je sais pas trop quoi écrire pour un anniversaire.", body: `5. "Joyeux anniversaire. Je sais pas trop quoi écrire pour un anniversaire."
C'est pour ça que je le fais pas d'habitude. Parce que devant un écran blanc je sais jamais quoi mettre. Les trucs qui sonnent bien me semblent faux. Les trucs vrais me semblent trop. Alors j'écris ça. La vérité brute. Joyeux anniversaire, [Prénom].
Avec honnêteté totale sur mon incapacité à écrire pour les anniversaires et ma décision de le dire quand même,
— quelqu'un qui a décidé que la vérité brute valait mieux que rien 🤷` },
    { id: 'dt_b_06', angle: "Je déteste les messages d'anniversaire parce qu'ils sonnent toujours faux. Alors je vais être direct.", body: `6. "Je déteste les messages d'anniversaire parce qu'ils sonnent toujours faux. Alors je vais être direct."
Te dire que t'es quelqu'un d'important pour moi. Que ton anniversaire compte. Que je suis content que tu existes. Pas avec des fleurs et des formules. Juste direct. Joyeux anniversaire, [Prénom].
Avec explication de mon rapport aux messages d'anniversaire et choix de la directness comme alternative,
— quelqu'un qui pense que le direct vaut mieux que le fleuri 🎯` },
    { id: 'dt_b_07', angle: "Joyeux anniversaire. J'aurais pu juste ignorer. J'ai écrit quelque chose.", body: `7. "Joyeux anniversaire. J'aurais pu juste ignorer. J'ai écrit quelque chose."
La différence entre les deux c'est l'effort. Ignorer c'est zéro seconde. Écrire quelque chose c'est une décision. Un temps de réflexion. Un choix conscient de faire quelque chose plutôt que rien. T'as mérité le quelque chose. Joyeux anniversaire, [Prénom].
Avec distinction claire entre ignorer et écrire quelque chose comme niveaux d'effort différents,
— quelqu'un qui a choisi le niveau supérieur pour toi 📈` },
    { id: 'dt_b_08', angle: "Je suis pas du genre romantique avec les anniversaires. Mais t'es pas du genre ordinaire.", body: `8. "Je suis pas du genre romantique avec les anniversaires. Mais t'es pas du genre ordinaire."
Les grands messages les belles déclarations les formules fleuries c'est pas mon truc. Et pourtant là y'a ça. Parce que toi t'es pas quelqu'un d'ordinaire. Et l'ordinaire aurait pas suffi. Joyeux anniversaire, [Prénom].
Avec logique imparable entre l'extraordinaire de ta personne et l'effort non ordinaire du message,
— quelqu'un dont la logique interne est cohérente même si elle prend du temps à expliquer 🧩` },
    { id: 'dt_b_09', angle: "Joyeux anniversaire. J'espère que le fait que j'aime pas écrire pour les anniversaires donne plus de valeur à ça.", body: `9. "Joyeux anniversaire. J'espère que le fait que j'aime pas écrire pour les anniversaires donne plus de valeur à ça."
Théorie : un message envoyé par quelqu'un qui aime ça c'est normal. Un message envoyé par quelqu'un qui déteste ça c'est exceptionnel. Le même message a plus de valeur selon qui l'envoie. Celui-là a beaucoup de valeur. Joyeux anniversaire, [Prénom].
Avec théorie économique de la valeur des messages selon l'émetteur,
— quelqu'un qui espère que la logique tient et que tu apprécies en conséquence 💎` },
    { id: 'dt_b_10', angle: "J'avais dit à moi-même que j'écrirais plus pour les anniversaires. T'as eu raison de moi.", body: `10. "J'avais dit à moi-même que j'écrirais plus pour les anniversaires. T'as eu raison de moi."
J'avais pris cette décision. Plus de messages d'anniversaire. Trop de pression. Trop de trucs à dire. Trop de cases à cocher. Et puis ton anniversaire est arrivé. Et j'ai craqué. T'as eu raison de ma décision. Joyeux anniversaire, [Prénom].
Avec aveu de capitulation face à ton anniversaire malgré mes bonnes résolutions,
— quelqu'un dont les résolutions tiennent jusqu'à toi 😔` },
    { id: 'dt_b_11', angle: "Joyeux anniversaire. Je préfère les actes aux mots. Mais là les mots c'est l'acte.", body: `11. "Joyeux anniversaire. Je préfère les actes aux mots. Mais là les mots c'est l'acte."
Normalement je montre les choses plutôt que de les dire. Les messages d'anniversaire c'est des mots. Et les mots me mettent mal à l'aise. Mais là les mots sont l'acte. Le fait d'écrire ça c'est déjà le truc. C'est déjà la preuve. Joyeux anniversaire, [Prénom].
Avec réflexion sur les mots comme acte dans le contexte de quelqu'un qui préfère les actes,
— quelqu'un qui a retourné sa propre logique pour arriver jusqu'ici 🔄` },
    { id: 'dt_b_12', angle: "T'as un anniversaire. J'ai écrit quelque chose. C'est déjà beaucoup venant de moi.", body: `12. "T'as un anniversaire. J'ai écrit quelque chose. C'est déjà beaucoup venant de moi."
Je veux pas être dramatique. Je veux juste que tu saches. Que ça représente quelque chose. Que si t'avais été n'importe qui tu aurais eu rien ou un emoji. T'as eu ça. C'est déjà beaucoup. Joyeux anniversaire, [Prénom].
Avec contextualisation modeste mais réelle de l'effort que ça représente,
— quelqu'un qui espère que tu lis entre les lignes ce que les lignes ont du mal à dire 📖` },
    { id: 'dt_b_13', angle: "Joyeux anniversaire. Je trouve les messages d'anniversaire souvent inutiles. Pas celui-là.", body: `13. "Joyeux anniversaire. Je trouve les messages d'anniversaire souvent inutiles. Pas celui-là."
Les messages génériques. Les formules toutes faites. Les joyeux anniversaire automatiques. Ceux-là sont inutiles. Celui-là est différent. Parce qu'il vient de moi. Parce qu'il est pour toi. Parce qu'il dit quelque chose de vrai. Joyeux anniversaire, [Prénom].
Avec distinction entre les messages inutiles et celui-là qui ne l'est pas,
— quelqu'un qui pense que la distinction est importante et qui tient à la préciser 🎯` },
    { id: 'dt_b_14', angle: "J'envoie pas de messages pour les anniversaires. Sauf apparemment pour les tiens.", body: `14. "J'envoie pas de messages pour les anniversaires. Sauf apparemment pour les tiens."
Historique personnel. Zéro message envoyé sur un nombre respectable d'anniversaires autour de moi. Et là. Toi. Quelque chose d'écrit. T'es la seule exception documentée à ma règle. Je sais même pas trop comment t'as réussi ça. Joyeux anniversaire, [Prénom].
Avec constat de ton statut d'exception unique documentée dans mon historique,
— quelqu'un qui s'interroge encore sur comment tu as contourné sa règle 🤔` },
    { id: 'dt_b_15', angle: "Joyeux anniversaire. Je sais pas si c'est bien écrit. Mais c'est vrai.", body: `15. "Joyeux anniversaire. Je sais pas si c'est bien écrit. Mais c'est vrai."
Peut-être que les mots sont pas parfaits. Peut-être que c'est pas le plus beau message que t'as reçu. Mais c'est vrai. Écrit par quelqu'un qui t'a pensé. Qui a pris le temps. Qui a voulu que tu saches. Ça vaut ce que ça vaut. Joyeux anniversaire, [Prénom].
Avec modestie sur la qualité et insistance sur l'authenticité,
— quelqu'un qui préfère l'authentique au parfait et qui espère que toi aussi 💛` },
    { id: 'dt_b_16', angle: "T'aurais pu avoir rien. T'as eu ça. Joyeux anniversaire.", body: `16. "T'aurais pu avoir rien. T'as eu ça. Joyeux anniversaire."
Franchise totale. La probabilité que tu reçoives quelque chose de moi pour ton anniversaire était faible. Et pourtant ça. Ces mots. Ce temps passé à chercher quoi dire. T'as eu ça. Joyeux anniversaire, [Prénom].
Avec franchise absolue sur la probabilité initiale et satisfaction du résultat,
— quelqu'un qui pense que la franchise est la forme d'affection la plus honnête 🎲` },
    { id: 'dt_b_17', angle: "Joyeux anniversaire. J'ai cherché quoi écrire pendant dix minutes. C'est ce que j'ai trouvé.", body: `17. "Joyeux anniversaire. J'ai cherché quoi écrire pendant dix minutes. C'est ce que j'ai trouvé."
Dix minutes. Devant l'écran blanc. À me demander ce qui sonnerait juste. Ce qui serait vrai. Ce qui ne serait pas trop. Ces dix minutes sont pour toi. Le résultat c'est ça. Imparfait mais sincère. Joyeux anniversaire, [Prénom].
Avec transparence totale sur le processus de rédaction et son coût temporel,
— quelqu'un qui pense que dix minutes de réflexion sincère valent plus que rien 🕐` },
    { id: 'dt_b_18', angle: "Je déteste écrire pour les anniversaires parce que ça oblige à dire des trucs vrais.", body: `18. "Je déteste écrire pour les anniversaires parce que ça oblige à dire des trucs vrais."
C'est pour ça en fait. Pas parce que c'est inutile. Parce que ça oblige à dire des trucs vrais. Et les trucs vrais c'est plus dur à formuler que les trucs convenus. Alors là je le dis. Le truc vrai. T'es quelqu'un qui compte. Joyeux anniversaire, [Prénom].
Avec révélation de la vraie raison de mon rapport aux messages d'anniversaire et dépassement de cette raison,
— quelqu'un qui a trouvé la vraie raison et qui a décidé de la dépasser pour toi 💡` },
    { id: 'dt_b_19', angle: "Joyeux anniversaire. C'est peut-être le seul message que tu recevras jamais de moi pour ton anniversaire.", body: `19. "Joyeux anniversaire. C'est peut-être le seul message que tu recevras jamais de moi pour ton anniversaire."
Ou pas. On verra. Mais sache que si c'est le seul il représente quelque chose. Il représente que ton anniversaire cette année méritait plus que le silence de ma part. Il représente toi. Joyeux anniversaire, [Prénom].
Avec perspective sur le caractère possiblement unique de ce message dans notre histoire,
— quelqu'un qui laisse la porte ouverte sans rien promettre 🚪` },
    { id: 'dt_b_20', angle: "Je déteste les messages d'anniversaire. T'es mon exception. Joyeux anniversaire.", body: `20. "Je déteste les messages d'anniversaire. T'es mon exception. Joyeux anniversaire."
Deux phrases. L'essentiel. Mon rapport aux messages d'anniversaire est établi. Ton statut d'exception est confirmé. Tout le reste découle de ces deux faits. Joyeux anniversaire, [Prénom].
Avec économie de mots totale parce que parfois deux phrases disent tout,
— quelqu'un qui pense que la concision est la forme suprême de l'expression 🎯` },
  ],

  // ── FÊTE DU PRÉNOM ──────────────────────────────────────────────────────────
  nameday: [
    { id: 'dt_n_01', angle: "Joyeuse fête. J'envoie pas de messages pour les fêtes du prénom. Sauf là.", body: `1. "Joyeuse fête. J'envoie pas de messages pour les fêtes du prénom. Sauf là."
La fête du prénom c'est déjà une occasion que beaucoup ignorent. Et moi j'ignore les messages d'anniversaire. Double ignorance statistiquement probable. Et pourtant là y'a ça. Pour toi. Parce que t'as décidé que ta fête du prénom comptait et j'ai décidé que toi tu comptais. Joyeuse fête, [Prénom].
Avec calcul de la probabilité statistique de ce message et de son caractère exceptionnel,
— quelqu'un qui a bravé deux de ses principes en même temps pour toi 📊` },
    { id: 'dt_n_02', angle: "Je savais même pas que t'avais une fête du prénom. Et j'envoie pas de messages pour ça. Et pourtant.", body: `2. "Je savais même pas que t'avais une fête du prénom. Et j'envoie pas de messages pour ça. Et pourtant."
Double découverte. Que t'avais une fête du prénom. Et que j'étais capable d'envoyer quelque chose pour ça. Les deux m'ont surpris. Toi en premier pour avoir une fête du prénom. Moi ensuite pour avoir fait ça. Joyeuse fête, [Prénom].
Avec double surprise documentée sur la fête du prénom et sur moi-même,
— quelqu'un qui apprend des trucs sur lui-même grâce à toi 😮` },
    { id: 'dt_n_03', angle: "Joyeuse fête. J'aime pas écrire pour les occasions. Mais t'as insisté pour qu'on sache que c'était ta fête. Alors voilà.", body: `3. "Joyeuse fête. J'aime pas écrire pour les occasions. Mais t'as insisté pour qu'on sache que c'était ta fête. Alors voilà."
T'as prévenu. T'as mis le rappel sur le groupe. T'as fait en sorte qu'on sache. Et moi j'ai décidé que si t'avais fait l'effort d'exister ce jour-là je pouvais faire l'effort d'écrire quelque chose. Logique imparable. Joyeuse fête, [Prénom].
Avec logique directe entre ton effort d'exister et mon effort d'écrire,
— quelqu'un dont la réciprocité des efforts a des limites mais qui les a dépassées pour toi 🔄` },
    { id: 'dt_n_04', angle: "Une fête du prénom. Un message de quelqu'un qui déteste les messages. Deux trucs improbables.", body: `4. "Une fête du prénom. Un message de quelqu'un qui déteste les messages. Deux trucs improbables."
Ces deux événements qui ont peu de chances de se produire. La fête du prénom que beaucoup ignorent. Le message de ma part que personne attendait. Et pourtant les deux sont là. Aujourd'hui. Pour toi. Joyeuse fête, [Prénom].
Avec constat de la double improbabilité de cette situation,
— quelqu'un qui trouve la coïncidence remarquable et qui voulait le souligner 🎲` },
    { id: 'dt_n_05', angle: "Joyeuse fête. T'as un prénom. Ce prénom a un saint. Ce saint a un jour. J'ai écrit quelque chose.", body: `5. "Joyeuse fête. T'as un prénom. Ce prénom a un saint. Ce saint a un jour. J'ai écrit quelque chose."
La chaîne causale complète. Depuis le saint jusqu'au message. En passant par toi. Par ta décision de fêter ça. Par ma décision de marquer le coup. Ce message c'est l'aboutissement d'une chaîne de décisions improbables. Joyeuse fête, [Prénom].
Avec traçage de la chaîne causale complète depuis le saint jusqu'au message,
— quelqu'un qui trouve cette chaîne philosophiquement intéressante 🔗` },
    { id: 'dt_n_06', angle: "Je déteste écrire pour les occasions. Et ta fête du prénom m'a semblé mériter une exception.", body: `6. "Je déteste écrire pour les occasions. Et ta fête du prénom m'a semblé mériter une exception."
Pas tous les jours. Pas pour tout le monde. Pas pour toutes les occasions. Mais ta fête du prénom cette année. Cette occasion précise. Avec toi. Ça m'a semblé mériter une exception à ma règle habituelle. Joyeuse fête, [Prénom].
Avec justification claire et précise de l'exception accordée,
— quelqu'un qui accorde ses exceptions avec discernement et qui t'en accorde une 🎯` },
    { id: 'dt_n_07', angle: "Joyeuse fête. J'aurais pu ignorer ta fête du prénom. Comme tout le monde.", body: `7. "Joyeuse fête. J'aurais pu ignorer ta fête du prénom. Comme tout le monde."
Beaucoup de gens ont ignoré. C'est statistiquement probable. Moi j'ai pas ignoré. J'ai écrit quelque chose. Pour marquer que j'avais pas ignoré. Que ta fête du prénom existait pour moi. Que toi tu existais pour moi. Joyeuse fête, [Prénom].
Avec distinction entre ignorer comme la majorité et ne pas ignorer comme choix actif,
— quelqu'un qui a choisi de ne pas ignorer et qui est content de ce choix 👁️` },
    { id: 'dt_n_08', angle: "Ta fête du prénom plus un message de ma part c'est deux trucs rares le même jour.", body: `8. "Ta fête du prénom plus un message de ma part c'est deux trucs rares le même jour."
La fête du prénom c'est une fois par an. Un message de moi c'est peut-être une fois dans une vie. Le fait que les deux coïncident le même jour c'est un événement statistiquement remarquable. Profites-en. Joyeuse fête, [Prénom].
Avec calcul de la rareté combinée des deux événements simultanés,
— quelqu'un qui te conseille de marquer ce jour dans ton calendrier 📅` },
    { id: 'dt_n_09', angle: "Joyeuse fête. J'envoie pas de messages pour les fêtes mais t'avais l'air d'y tenir.", body: `9. "Joyeuse fête. J'envoie pas de messages pour les fêtes mais t'avais l'air d'y tenir."
À ta fête du prénom. À ce que les gens sachent. À ce que ça soit marqué. J'ai vu ça. Et j'ai décidé que si ça comptait pour toi ça méritait que ça compte pour moi aussi. Joyeuse fête, [Prénom].
Avec reconnaissance de l'importance que tu accordes à ta fête comme déclencheur du message,
— quelqu'un qui répond à ce qui compte pour toi même quand ça dépasse ses habitudes 💛` },
    { id: 'dt_n_10', angle: "Je déteste écrire pour les occasions et j'aurais voulu pas le faire. T'as gagné.", body: `10. "Je déteste écrire pour les occasions et j'aurais voulu pas le faire. T'as gagné."
Ce conflit interne. Mes principes d'un côté. Ta fête du prénom de l'autre. Mes principes ont perdu. Ta fête a gagné. Par extension toi t'as gagné. Contre moi. C'est pas rien. Joyeuse fête, [Prénom].
Avec déclaration officielle de ta victoire sur mes principes,
— quelqu'un qui accepte sa défaite avec grâce et une certaine satisfaction 🏆` },
    { id: 'dt_n_11', angle: "Joyeuse fête. Ce message prouve que t'es quelqu'un d'exceptionnel.", body: `11. "Joyeuse fête. Ce message prouve que t'es quelqu'un d'exceptionnel."
Raisonnement logique. J'envoie pas de messages pour les occasions. J'en ai envoyé un. Donc quelque chose d'exceptionnel s'est produit. Ce quelque chose c'est toi. Le message est une preuve de ton caractère exceptionnel. Logique imparable. Joyeuse fête, [Prénom].
Avec démonstration logique de ton caractère exceptionnel via le message,
— quelqu'un qui pense que ce raisonnement est valide et qui le maintient 🧮` },
    { id: 'dt_n_12', angle: "Joyeuse fête. J'aime pas les formules alors je vais juste dire un truc vrai.", body: `12. "Joyeuse fête. J'aime pas les formules alors je vais juste dire un truc vrai."
T'es quelqu'un qui compte pour moi. Voilà le truc vrai. Sans formule. Sans fleur. Sans joyeuse fête suivi de plein de trucs qui sonnent bien mais veulent rien dire. Juste ça. T'es quelqu'un qui compte. Joyeuse fête, [Prénom].
Avec rejet des formules au profit d'un seul truc vrai dit directement,
— quelqu'un qui pense qu'un truc vrai vaut mille formules 💬` },
    { id: 'dt_n_13', angle: "Joyeuse fête. T'as un prénom fêté. Moi j'ai une politique anti-messages. On a tous nos trucs.", body: `13. "Joyeuse fête. T'as un prénom fêté. Moi j'ai une politique anti-messages. On a tous nos trucs."
On a tous nos trucs. Tes trucs incluent avoir une fête du prénom et y tenir. Mes trucs incluent détester écrire pour les occasions. Aujourd'hui nos trucs respectifs se sont rencontrés. Et ma politique a cédé face à ta fête. Joyeuse fête, [Prénom].
Avec acceptation philosophique de nos trucs respectifs et de leur rencontre d'aujourd'hui,
— quelqu'un qui pense que cette rencontre de nos trucs respectifs est finalement charmante 🤝` },
    { id: 'dt_n_14', angle: "J'écris ce message en sachant pas trop pourquoi je l'écris.", body: `14. "J'écris ce message en sachant pas trop pourquoi je l'écris."
C'est la vérité. Je me suis retrouvé à écrire. Pour ta fête du prénom. Sans avoir vraiment décidé consciemment de le faire. Comme si c'était évident. Comme si pour toi ça s'imposait. Joyeuse fête, [Prénom].
Avec honnêteté totale sur l'absence de décision consciente et l'évidence qui l'a remplacée,
— quelqu'un qui découvre en écrivant pourquoi il écrit 💡` },
    { id: 'dt_n_15', angle: "Joyeuse fête. T'aurais pu avoir rien. T'as eu quelque chose de quelqu'un qui écrit jamais pour les occasions.", body: `15. "Joyeuse fête. T'aurais pu avoir rien. T'as eu quelque chose de quelqu'un qui écrit jamais pour les occasions."
Mesure bien ce que ça représente. Pas juste un message. Un message d'une source inhabituelle. Un message qui coûte plus que la normale en termes d'effort et de dépassement de soi. Ce message vaut son poids en exception. Joyeuse fête, [Prénom].
Avec invitation à mesurer la valeur au poids de l'exception plutôt qu'au poids des mots,
— quelqu'un qui espère que tu lis bien le sous-texte de ce message 💎` },
    { id: 'dt_n_16', angle: "Je suis pas du genre à marquer les fêtes des prénoms. Et pourtant là je marque.", body: `16. "Je suis pas du genre à marquer les fêtes des prénoms. Et pourtant là je marque."
Le marquage de ta fête du prénom était improbable venant de moi. Et pourtant. Ça s'est imposé. Comme une évidence que j'avais pas anticipée. Joyeuse fête, [Prénom].
Avec constat tranquille de l'évidence non anticipée du marquage de ta fête,
— quelqu'un qui se laisse surprendre par ses propres décisions parfois 😌` },
    { id: 'dt_n_17', angle: "Joyeuse fête. J'ai cherché quoi dire pour une fête du prénom. J'ai abandonné les formules.", body: `17. "Joyeuse fête. J'ai cherché quoi dire pour une fête du prénom. J'ai abandonné les formules."
Internet proposait des trucs. Des formules. Des poèmes. Des citations sur les prénoms. J'ai tout abandonné. Et j'ai décidé d'écrire juste ça. La vérité sur le fait que j'allais pas t'écrire et que je t'écris quand même. Joyeuse fête, [Prénom].
Avec transparence totale sur le processus de recherche abandonné au profit de la vérité brute,
— quelqu'un qui pense que la vérité brute est toujours mieux que les formules trouvées sur internet 🔍` },
    { id: 'dt_n_18', angle: "T'es la raison pour laquelle ma politique anti-messages a une exception.", body: `18. "T'es la raison pour laquelle ma politique anti-messages a une exception."
Officiellement. Dans le règlement interne de ma vie. T'es mentionné comme exception à la politique anti-messages pour les occasions. C'est le plus grand honneur que je peux accorder. Joyeuse fête, [Prénom].
Avec inscription officielle dans le règlement interne de ta vie comme exception nommée,
— quelqu'un qui prend ses règlements internes sérieusement et qui t'y inscrit quand même 📜` },
    { id: 'dt_n_19', angle: "Joyeuse fête. Le saint qui porte ton prénom a un jour. Ce jour t'a eu un message de moi.", body: `19. "Joyeuse fête. Le saint qui porte ton prénom a un jour. Ce jour t'a eu un message de moi."
Ces deux faits. Ce saint qui existe depuis des siècles. Ce message qui existe depuis aujourd'hui. Les deux sont liés par toi. Par ton prénom. Par ta décision de fêter ça. Et par ma décision de marquer ta décision. Joyeuse fête, [Prénom].
Avec connexion philosophique entre le saint centenaire et le message d'aujourd'hui,
— quelqu'un qui trouve ce fil de connexion à travers les siècles finalement assez beau 🕰️` },
    { id: 'dt_n_20', angle: "Joyeuse fête. Je déteste écrire pour les occasions. T'as une fête du prénom. On a trouvé un terrain d'entente.", body: `20. "Joyeuse fête. Je déteste écrire pour les occasions. T'as une fête du prénom. On a trouvé un terrain d'entente."
Toi avec ta fête du prénom que tu tiens à célébrer. Moi avec ma politique anti-messages que je tiens à respecter. Et entre les deux ce terrain d'entente. Ce message. Qui dit que parfois les principes cèdent face aux gens qui comptent. Joyeuse fête, [Prénom].
Avec métaphore du terrain d'entente entre nos positions respectives,
— quelqu'un qui pense que trouver des terrains d'entente est la base de toute relation durable 🤝` },
  ],

  // ── DIPLÔME ─────────────────────────────────────────────────────────────────
  graduation: [
    { id: 'dt_g_01', angle: "Félicitations. J'envoie pas de messages pour les occasions. Mais t'as eu ton diplôme et j'avais besoin que tu le saches.", body: `1. "Félicitations. J'envoie pas de messages pour les occasions. Mais t'as eu ton diplôme et j'avais besoin que tu le saches."
Pas avec un like. Pas avec un emoji. Avec quelque chose qui dit que j'ai pensé à toi. Que j'ai pris le temps. Que ton diplôme méritait plus que trente secondes de mon attention. Ce message c'est ce plus-là. Félicitations, [Prénom].
Avec explication de pourquoi un diplôme méritait une exception à ma politique,
— quelqu'un qui a jugé que l'occasion méritait de dépasser ses principes 🎓` },
    { id: 'dt_g_02', angle: "T'as eu ton diplôme. J'aime pas écrire pour les occasions. Mais y'a des moments qui méritent une exception.", body: `2. "T'as eu ton diplôme. J'aime pas écrire pour les occasions. Mais y'a des moments qui méritent une exception."
Ce moment. Ce diplôme. Cette réussite. C'est un de ces moments. Un de ceux qui méritent d'être marqués même par quelqu'un qui marque pas grand chose d'habitude. Félicitations, [Prénom].
Avec identification de l'obtention du diplôme comme moment méritant l'exception,
— quelqu'un dont la liste des moments méritant l'exception est courte et sur laquelle tu figures 📋` },
    { id: 'dt_g_03', angle: "Félicitations pour ton diplôme. J'aurais pu rien dire. J'ai écrit quelque chose. Tu méritais les deux options.", body: `3. "Félicitations pour ton diplôme. J'aurais pu rien dire. J'ai écrit quelque chose. Tu méritais les deux options."
Rien dire c'était valide. Mon style habituel. Ma façon de fonctionner. Et écrire quelque chose c'était aussi valide. Plus rare. Plus représentatif de ce que ton diplôme représente. J'ai choisi la deuxième option. Félicitations, [Prénom].
Avec présentation des deux options et justification du choix de la plus exceptionnelle,
— quelqu'un qui pèse ses options et qui t'a accordé la plus rare 🎯` },
    { id: 'dt_g_04', angle: "T'as travaillé pour ce diplôme. Moi j'ai fait l'effort d'écrire quelque chose. On est quittes.", body: `4. "T'as travaillé pour ce diplôme. Moi j'ai fait l'effort d'écrire quelque chose. On est quittes."
Toi ton effort c'était des mois de travail. Le mien c'était quelques minutes d'écriture et un dépassement de mes principes. Les efforts ne sont pas comparables. Mais les deux disent quelque chose. Félicitations, [Prénom].
Avec comparaison modeste mais honnête de nos efforts respectifs,
— quelqu'un qui reconnaît que ton effort était infiniment plus grand et qui le respecte 🏋️` },
    { id: 'dt_g_05', angle: "Félicitations. J'envoie pas de messages parce que j'aime pas les formules toutes faites. Alors j'ai fait le mien.", body: `5. "Félicitations. J'envoie pas de messages parce que j'aime pas les formules toutes faites. Alors j'ai fait le mien."
Pas une formule trouvée quelque part. Pas un truc copié-collé. Quelque chose d'écrit pour toi. Pour ton diplôme. Pour ce que ça représente. Même si c'est maladroit. Même si c'est pas parfait. C'est le mien. Félicitations, [Prénom].
Avec distinction entre les formules toutes faites rejetées et ce message personnel accepté,
— quelqu'un qui a fait l'effort du sur-mesure plutôt que du générique 🪡` },
    { id: 'dt_g_06', angle: "T'as eu ton diplôme. Je suis content pour toi. J'arrive même à l'écrire.", body: `6. "T'as eu ton diplôme. Je suis content pour toi. J'arrive même à l'écrire."
Ces deux faits. Ta réussite que je célèbre vraiment. Et ma capacité surprise à le mettre en mots. Les deux sont vrais. Les deux sont remarquables à leur façon. Félicitations, [Prénom].
Avec émerveillement partagé devant ta réussite et devant ma propre capacité à écrire quelque chose,
— quelqu'un qui découvre de nouvelles capacités en lui-même grâce à tes succès 😄` },
    { id: 'dt_g_07', angle: "Félicitations. Ce message prouve deux choses. T'as réussi. Et j'étais capable d'écrire quelque chose.", body: `7. "Félicitations. Ce message prouve deux choses. T'as réussi. Et j'étais capable d'écrire quelque chose."
Double preuve. La tienne c'est le diplôme. La mienne c'est le message. Deux preuves de capacités qu'on pouvait douter. Toi tu savais que tu pouvais avoir le diplôme. Moi j'étais moins sûr pour le message. Félicitations, [Prénom].
Avec mise en parallèle de nos preuves respectives de capacités inattendues,
— quelqu'un qui est presque aussi fier du message que toi du diplôme 😅` },
    { id: 'dt_g_08', angle: "J'aime pas écrire pour les occasions parce que ça demande de trouver les bons mots. Là j'ai essayé quand même.", body: `8. "J'aime pas écrire pour les occasions parce que ça demande de trouver les bons mots. Là j'ai essayé quand même."
Pour ton diplôme. Pour marquer ce moment. J'ai essayé de trouver les bons mots. J'y suis peut-être pas arrivé complètement. Mais l'essai compte. L'intention est là. Félicitations, [Prénom].
Avec valorisation de l'essai et de l'intention au-delà du résultat,
— quelqu'un qui pense que l'intention dans un message vaut autant que les mots ✍️` },
    { id: 'dt_g_09', angle: "Félicitations pour ton diplôme. Et désolé d'avance si c'est mal écrit.", body: `9. "Félicitations pour ton diplôme. Et désolé d'avance si c'est mal écrit."
Je suis pas expert. Je m'entraîne pas. C'est une des premières fois que j'écris pour une occasion. Le résultat est ce qu'il est. Imparfait peut-être. Sincère sûrement. Félicitations, [Prénom].
Avec excuse préventive pour la qualité relative du message et insistance sur la sincérité,
— quelqu'un qui préfère être honnête sur ses limites que de prétendre être bon 🙏` },
    { id: 'dt_g_10', angle: "T'as travaillé. T'as réussi. J'ai écrit quelque chose. Chacun fait des trucs contre sa nature parfois.", body: `10. "T'as travaillé. T'as réussi. J'ai écrit quelque chose. Chacun fait des trucs contre sa nature parfois."
Toi tu as travaillé dur alors que t'avais peut-être pas toujours envie. Moi j'ai écrit pour une occasion alors que c'est pas dans ma nature. Deux dépassements de soi. Deux victoires. Félicitations, [Prénom].
Avec parallèle philosophique entre ton dépassement et le mien,
— quelqu'un qui pense que se dépasser c'est toujours bien peu importe l'échelle 🌱` },
    { id: 'dt_g_11', angle: "Félicitations. Je déteste écrire pour les occasions. Et là j'en voulais un pour toi.", body: `11. "Félicitations. Je déteste écrire pour les occasions. Et là j'en voulais un pour toi."
Pas j'en ai écrit un. J'en voulais un. Ce désir spontané. Cette envie non planifiée de marquer ton diplôme d'une façon particulière. Ça m'a surpris. Et j'ai suivi cette surprise. Félicitations, [Prénom].
Avec description du désir spontané d'écrire comme quelque chose qui m'a surpris moi-même,
— quelqu'un qui suit ses surprises et qui en est souvent content 🌊` },
    { id: 'dt_g_12', angle: "T'as eu ton diplôme. Normalement j'écris rien. Là j'ai écrit quelque chose.", body: `12. "T'as eu ton diplôme. Normalement j'écris rien. Là j'ai écrit quelque chose."
L'écart entre le normalement et le là c'est toi. C'est ton diplôme. C'est l'importance de ce moment. C'est ma façon de dire que ce moment méritait d'être plus que le normalement. Félicitations, [Prénom].
Avec identification de l'écart entre le normalement et le là comme mesure de l'importance du moment,
— quelqu'un qui espère que tu comprends ce que cet écart représente 📐` },
    { id: 'dt_g_13', angle: "Félicitations. Reçois ce message comme ce qu'il est. La preuve que tu comptes.", body: `13. "Félicitations. Reçois ce message comme ce qu'il est. La preuve que tu comptes."
Pas juste un message. Une preuve. La preuve que tu comptes assez pour que je dépasse mes habitudes. Pour que je fasse quelque chose d'inhabituel. Pour que je cherche les mots. Cette preuve-là est tangible. Félicitations, [Prénom].
Avec définition du message comme preuve tangible de ton importance,
— quelqu'un qui espère que tu gardes cette preuve et que tu y reviens les jours de doute 💛` },
    { id: 'dt_g_14', angle: "J'aime pas écrire pour les occasions. Ton diplôme a changé quelque chose.", body: `14. "J'aime pas écrire pour les occasions. Ton diplôme a changé quelque chose."
Pas pour toujours peut-être. Pas une conversion définitive. Mais pour aujourd'hui. Pour toi. Pour ce diplôme. Quelque chose a changé. Et ce changement a produit ça. Félicitations, [Prénom].
Avec description du changement temporaire ou permanent opéré par ton diplôme,
— quelqu'un qui découvre encore les effets de ton diplôme sur lui 🌀` },
    { id: 'dt_g_15', angle: "Félicitations. T'as réussi ton diplôme. Moi j'ai réussi à écrire quelque chose. Petites victoires.", body: `15. "Félicitations. T'as réussi ton diplôme. Moi j'ai réussi à écrire quelque chose. Petites victoires."
Les deux sont des victoires. De tailles différentes. D'importances différentes. Mais des victoires quand même. T'as réussi quelque chose de difficile. Moi aussi à ma façon et à mon échelle. On célèbre les deux. Félicitations, [Prénom].
Avec célébration humble de nos victoires respectives à nos échelles respectives,
— quelqu'un qui pense que toutes les victoires méritent d'être célébrées 🏆` },
    { id: 'dt_g_16', angle: "T'as eu ton diplôme. Ce message dit que j'étais là pour ça.", body: `16. "T'as eu ton diplôme. Ce message dit que j'étais là pour ça."
Présent. Même de loin. Même sous forme de mots sur un écran. J'étais là pour ton diplôme. Ce message en est la trace. La preuve que ce moment existait pour moi aussi. Félicitations, [Prénom].
Avec définition du message comme trace de ma présence à ce moment important,
— quelqu'un qui voulait laisser une trace de sa présence à ton moment 🌟` },
    { id: 'dt_g_17', angle: "Félicitations. J'aurais pu rester dans mes habitudes. Je l'ai pas fait.", body: `17. "Félicitations. J'aurais pu rester dans mes habitudes. Je l'ai pas fait."
Mes habitudes c'est pas écrire pour les occasions. Pas de formalisme. Pas de marquage explicite. Et là j'ai pas suivi mes habitudes. Parce que ton diplôme méritait que je les dépasse. Félicitations, [Prénom].
Avec mise en valeur du dépassement de mes habitudes comme acte volontaire pour toi,
— quelqu'un qui sort de ses habitudes rarement et qui l'a fait pour toi 🚶` },
    { id: 'dt_g_18', angle: "Je sais pas écrire pour les occasions. J'ai écrit quand même.", body: `18. "Je sais pas écrire pour les occasions. J'ai écrit quand même."
Maladroitement peut-être. Sans le talent de ceux qui savent faire ça bien. Mais sincèrement. Et avec l'intention que tu le sentes malgré la maladresse. Félicitations, [Prénom].
Avec aveu de maladresse et insistance sur la sincérité qui la compense,
— quelqu'un qui pense que la sincérité maladroite vaut mieux que l'élégance creuse 💙` },
    { id: 'dt_g_19', angle: "Félicitations. Ce message c'est ma façon de dire que ton diplôme c'est pas rien.", body: `19. "Félicitations. Ce message c'est ma façon de dire que ton diplôme c'est pas rien."
Pas juste pour toi. Pour moi aussi. Pour les gens autour de toi. Ce diplôme compte. Il méritait d'être marqué. Et la façon dont je l'ai marqué dit que j'avais compris son importance. Félicitations, [Prénom].
Avec explication du message comme marqueur de l'importance du diplôme pour moi aussi,
— quelqu'un qui voulait que tu saches que ce moment comptait au-delà de toi 📌` },
    { id: 'dt_g_20', angle: "Je déteste écrire pour les occasions. T'as eu ton diplôme. Y'avait pas d'autre option.", body: `20. "Je déteste écrire pour les occasions. T'as eu ton diplôme. Y'avait pas d'autre option."
Simple. Direct. La logique s'impose. Ton diplôme était trop important pour que mes principes tiennent. Y'avait pas d'autre option que d'écrire quelque chose. Félicitations, [Prénom].
Avec raisonnement imparable qui ne laissait pas d'autre option,
— quelqu'un qui accepte quand la logique force sa main ❤️` },
  ],

  // ── PREMIER JOB ─────────────────────────────────────────────────────────────
  first_job: [
    { id: 'dt_j_01', angle: "Félicitations pour le poste. J'envoie pas de messages pour les occasions. Mais là j'en ai envoyé un.", body: `1. "Félicitations pour le poste. J'envoie pas de messages pour les occasions. Mais là j'en ai envoyé un."
Pour que tu saches. Que ce premier poste méritait plus qu'un silence. Que j'avais envie de marquer ça. Que toi et ce poste vous méritiez cet effort. Félicitations, [Prénom].
Avec explication de pourquoi un premier poste méritait une exception à ma règle,
— quelqu'un qui a jugé que l'occasion valait le dépassement de ses principes 💼` },
    { id: 'dt_j_02', angle: "T'as eu ton premier poste. J'aime pas écrire pour les occasions. Mais certaines premières fois méritent d'être marquées.", body: `2. "T'as eu ton premier poste. J'aime pas écrire pour les occasions. Mais certaines premières fois méritent d'être marquées."
La première fois. Le premier vrai poste. Cette étape-là est différente. Elle mérite d'être notée. D'être célébrée. Même par quelqu'un qui célèbre pas grand chose d'habitude. Félicitations, [Prénom].
Avec identification des premières fois comme catégorie méritant l'exception,
— quelqu'un dont les exceptions sont rares et qui t'en accorde une pour ta première fois 🌅` },
    { id: 'dt_j_03', angle: "Félicitations. Ce message dit que ton entrée dans le monde du travail était assez importante pour changer mes habitudes.", body: `3. "Félicitations. Ce message dit que ton entrée dans le monde du travail était assez importante pour changer mes habitudes."
Temporairement peut-être. Mais assez. Pour aujourd'hui. Pour cette occasion. Pour toi. Tes nouvelles ont changé mes habitudes. C'est de l'influence. Félicitations, [Prénom].
Avec reconnaissance de l'influence de ton entrée dans le monde du travail sur mes habitudes,
— quelqu'un qui mesure son influence sur les autres et qui t'attribue un score élevé 📊` },
    { id: 'dt_j_04', angle: "T'as trouvé un poste. J'ai trouvé les mots. On a tous réussi quelque chose.", body: `4. "T'as trouvé un poste. J'ai trouvé les mots. On a tous réussi quelque chose."
Deux réussites le même jour. La tienne est plus grande objectivement. La mienne était plus inattendue subjectivement. Les deux méritent d'être notées. Félicitations, [Prénom].
Avec mise en parallèle légère de nos réussites respectives,
— quelqu'un qui est peut-être aussi surpris de son message que toi de ton poste 😄` },
    { id: 'dt_j_05', angle: "Félicitations pour le poste. J'aurais dû juste rien dire. J'ai écrit quelque chose.", body: `5. "Félicitations pour le poste. J'aurais dû juste rien dire. J'ai écrit quelque chose."
L'escalade non planifiée. De l'intention de rien dire à la réalisation d'un message. Quelque chose m'a poussé à faire plus. Ce quelque chose c'est toi. C'est ce que représente ce poste pour toi. Félicitations, [Prénom].
Avec description de l'escalade non planifiée vers le message,
— quelqu'un qui a suivi l'impulsion sans trop l'analyser et qui en est content 🎯` },
    { id: 'dt_j_06', angle: "T'entres dans le monde du travail. J'entre dans le monde des messages d'occasion. Bienvenue à nous deux.", body: `6. "T'entres dans le monde du travail. J'entre dans le monde des messages d'occasion. Bienvenue à nous deux."
Deux entrées simultanées dans des mondes inhabituels. Le tien c'est le monde professionnel. Le mien c'est le monde des messages pour les occasions. On traverse nos premières fois ensemble d'une certaine façon. Bienvenue à nous deux. Félicitations, [Prénom].
Avec parallèle poétique entre ton entrée dans le monde du travail et la mienne dans les messages d'occasion,
— quelqu'un qui trouve ce parallèle à la fois absurde et touchant 🌀` },
    { id: 'dt_j_07', angle: "Félicitations. Je déteste écrire pour les occasions parce que ça oblige à dire ce qu'on pense vraiment.", body: `7. "Félicitations. Je déteste écrire pour les occasions parce que ça oblige à dire ce qu'on pense vraiment."
Et ce que je pense vraiment c'est que t'as fait quelque chose de courageux. Que chercher un travail et en trouver un c'est pas simple. Et que je suis content pour toi. Voilà ce que le message m'a obligé à dire. Félicitations, [Prénom].
Avec révélation de ce que le message m'a forcé à dire à voix haute,
— quelqu'un qui admet que l'obligation d'écrire a produit quelque chose d'utile 💬` },
    { id: 'dt_j_08', angle: "T'as un premier poste. J'ai une politique anti-messages d'occasion. L'un des deux a cédé.", body: `8. "T'as un premier poste. J'ai une politique anti-messages d'occasion. L'un des deux a cédé."
Ce n'est pas la politique qui a eu ton premier poste. Et c'est pas ton premier poste qui m'a forcé à aimer écrire pour les occasions. Mais c'est ton premier poste qui a eu raison de ma politique. Pour cette fois. Félicitations, [Prénom].
Avec résolution claire du conflit entre ton premier poste et ma politique,
— quelqu'un qui enregistre cette défaite avec philosophie 🤷` },
    { id: 'dt_j_09', angle: "Félicitations. J'aurais pu ignorer ce moment. J'ai choisi de pas l'ignorer.", body: `9. "Félicitations. J'aurais pu ignorer ce moment. J'ai choisi de pas l'ignorer."
Ce choix. Actif. Conscient. De pas passer à côté. De pas laisser ce moment se dérouler sans que je le marque. Cette décision d'écrire plutôt que le silence. C'est une décision qui dit quelque chose sur ce que ce moment représente. Félicitations, [Prénom].
Avec mise en valeur du choix actif de ne pas ignorer comme déclaration d'importance,
— quelqu'un qui pense que choisir de marquer un moment est toujours un acte significatif 📌` },
    { id: 'dt_j_10', angle: "T'as survécu à la recherche d'emploi. Moi j'ai survécu à l'écriture d'un message d'occasion. Toutes proportions gardées.", body: `10. "T'as survécu à la recherche d'emploi. Moi j'ai survécu à l'écriture d'un message d'occasion. Toutes proportions gardées."
Nos survies respectives. Les tiennes étaient plus longues et plus difficiles. La mienne était plus courte et plus symbolique. Les deux sont des victoires. Félicitations, [Prénom].
Avec comparaison humble et honnête de nos survies respectives,
— quelqu'un qui maintient la proportion mais qui célèbre les deux quand même 🏅` },
    { id: 'dt_j_11', angle: "Félicitations. Ce message dit que ton premier poste c'est un truc important. Pour toi. Et pour moi aussi.", body: `11. "Félicitations. Ce message dit que ton premier poste c'est un truc important. Pour toi. Et pour moi aussi."
Pour moi aussi. C'est le message central. Ton premier poste compte pour moi. Pas juste pour toi. Et ce message est la preuve que ça compte pour moi. Félicitations, [Prénom].
Avec insistance sur le fait que ce moment compte pour moi aussi pas juste pour toi,
— quelqu'un qui voulait que tu le saches explicitement 💛` },
    { id: 'dt_j_12', angle: "J'aime pas écrire pour les occasions. T'as trouvé un travail. Y'a des fois où les principes tiennent pas.", body: `12. "J'aime pas écrire pour les occasions. T'as trouvé un travail. Y'a des fois où les principes tiennent pas."
Mes principes tiennent dans la plupart des situations. Cette situation a été plus forte que mes principes. C'est une information sur l'importance de cette situation. Félicitations, [Prénom].
Avec identification de l'exception comme information sur l'importance de la situation,
— quelqu'un qui lit ses propres exceptions comme des données sur ce qui compte pour lui 📖` },
    { id: 'dt_j_13', angle: "Félicitations pour le poste. Et excuse si c'est mal écrit. Je pratique pas souvent.", body: `13. "Félicitations pour le poste. Et excuse si c'est mal écrit. Je pratique pas souvent."
Manque d'entraînement. Peu d'occasions de pratiquer vu ma politique habituelle. Le résultat est ce qu'il est. L'intention est bonne. Félicitations, [Prénom].
Avec excuse préventive pour le niveau relatif du message et validation de l'intention,
— quelqu'un qui préfère l'honnêteté sur ses limites à la prétention à la perfection 🙏` },
    { id: 'dt_j_14', angle: "T'as un premier poste. C'est le début de quelque chose. Ce message marque le début.", body: `14. "T'as un premier poste. C'est le début de quelque chose. Ce message marque le début."
Marquer les débuts. Même quand on marque pas grand chose d'habitude. Parce que les débuts méritent d'être notés. Ils sont uniques. Ils ne se répètent pas. Ton début dans le monde du travail méritait une trace. Félicitations, [Prénom].
Avec philosophie du marquage des débuts comme acte de reconnaissance de leur unicité,
— quelqu'un qui pense que les débuts méritent toujours d'être marqués 🌅` },
    { id: 'dt_j_15', angle: "Félicitations. Je déteste écrire pour les occasions et j'en ai quand même écrit un. C'est ma façon de dire que t'as réussi quelque chose.", body: `15. "Félicitations. Je déteste écrire pour les occasions et j'en ai quand même écrit un. C'est ma façon de dire que t'as réussi quelque chose."
Pas juste trouver un travail. Réussir quelque chose. Quelque chose qui mérite d'être célébré d'une façon qui sort de mes habitudes. Ce message c'est ma célébration à ma façon. Félicitations, [Prénom].
Avec définition du message comme célébration personnalisée à ma façon,
— quelqu'un qui célèbre à sa façon même quand sa façon est inhabituelle 🎉` },
    { id: 'dt_j_16', angle: "T'as trouvé un poste. Moi j'ai trouvé les mots. On cherchait des trucs différents. On a trouvé.", body: `16. "T'as trouvé un poste. Moi j'ai trouvé les mots. On cherchait des trucs différents. On a trouvé."
Deux recherches simultanées. La tienne pour un poste. La mienne pour les mots justes. Les deux ont abouti. Les deux méritent d'être notées. Félicitations, [Prénom].
Avec parallèle entre ta recherche d'emploi et ma recherche des mots,
— quelqu'un qui trouve ce parallèle approprié et un peu satisfaisant 🔍` },
    { id: 'dt_j_17', angle: "Félicitations. Ce message c'est mon investissement dans ta réussite.", body: `17. "Félicitations. Ce message c'est mon investissement dans ta réussite."
Un investissement symbolique. Pas financier. En temps. En effort. En dépassement de mes habitudes. Cet investissement dit que je crois en toi. Que je veux que tu réussisses. Que ton premier poste compte pour moi. Félicitations, [Prénom].
Avec définition du message comme investissement symbolique dans ta réussite,
— quelqu'un qui investit symboliquement dans les gens qui comptent pour lui 💰` },
    { id: 'dt_j_18', angle: "J'envoie pas de messages pour les occasions. Sauf quand quelqu'un fait quelque chose qui mérite vraiment d'être célébré.", body: `18. "J'envoie pas de messages pour les occasions. Sauf quand quelqu'un fait quelque chose qui mérite vraiment d'être célébré."
Et ton premier poste mérite vraiment d'être célébré. Dans cette catégorie rare. Des choses qui méritent vraiment. Des occasions qui dépassent mes habitudes. T'es dans cette catégorie. Félicitations, [Prénom].
Avec placement de ton premier poste dans la catégorie rare des choses méritant vraiment d'être célébrées,
— quelqu'un dont la liste de cette catégorie est courte et sur laquelle tu figures 🌟` },
    { id: 'dt_j_19', angle: "Félicitations pour le poste. Ce message dit simplement que j'étais là pour ça.", body: `19. "Félicitations pour le poste. Ce message dit simplement que j'étais là pour ça."
Là. Présent. Même sous forme de mots sur un écran. Ce message c'est une façon d'être là pour ton premier poste. De marquer que ce moment existait pour moi aussi. Félicitations, [Prénom].
Avec définition simple et directe du message comme marqueur de présence à ce moment,
— quelqu'un qui voulait être présent à ce moment même à distance 📍` },
    { id: 'dt_j_20', angle: "Je déteste écrire pour les occasions. T'as eu ton premier poste. Y'avait pas d'autre option que d'ignorer ou d'écrire quelque chose. J'ai écrit quelque chose.", body: `20. "Je déteste écrire pour les occasions. T'as eu ton premier poste. Y'avait pas d'autre option que d'ignorer ou d'écrire quelque chose. J'ai écrit quelque chose."
Le choix binaire. Ignorer ou écrire. Mes habitudes penchaient pour ignorer. Quelque chose en moi a penché pour écrire. L'écriture a gagné. T'as gagné. Félicitations, [Prénom].
Avec description du choix binaire et de son résolution en faveur du message,
— quelqu'un qui est content du résultat de ce choix ❤️` },
  ],

  // ── ADO → PARENT ANNIVERSAIRE ───────────────────────────────────────────────
  // [Prénom] = Papa ou Maman selon contact.civilite ('M.' → Papa, 'Mme' → Maman)
  ado_parent: [
    { id: 'dt_ap_01', angle: "Joyeux anniversaire. J'envoie pas de messages d'habitude. Même à toi. Surtout à toi peut-être.", body: `1. "Joyeux anniversaire. J'envoie pas de messages d'habitude. Même à toi. Surtout à toi peut-être."
Parce que les trucs vrais c'est plus dur à dire aux gens les plus proches. Parce que t'es là tous les jours et que les mots semblent moins nécessaires. Et pourtant là j'en ai un. Pour toi. Pour ton anniversaire. Joyeux anniversaire, [Prénom].
Avec explication paradoxale que les messages sont plus difficiles pour les plus proches,
— ton enfant qui surmonte ce paradoxe pour toi aujourd'hui 💛` },
    { id: 'dt_ap_02', angle: "Joyeux anniversaire. J'aurais pu juste te dire joyeux anniversaire ce matin. J'ai écrit quelque chose.", body: `2. "Joyeux anniversaire. J'aurais pu juste te dire joyeux anniversaire ce matin. J'ai écrit quelque chose."
L'effort supplémentaire. Non obligatoire. Non attendu peut-être. Mais fait quand même. Parce que ton anniversaire cette année méritait plus que le minimum. Parce que toi tu mérites plus que le minimum. Joyeux anniversaire, [Prénom].
Avec mise en valeur du choix du plus contre le minimum,
— ton enfant qui choisit le plus pour toi même quand c'est pas dans ses habitudes 📈` },
    { id: 'dt_ap_03', angle: "Je sais pas trop écrire pour les occasions. Mais t'as un anniversaire et j'avais des trucs à dire.", body: `3. "Je sais pas trop écrire pour les occasions. Mais t'as un anniversaire et j'avais des trucs à dire."
Des trucs que je dis pas assez dans le quotidien. Des trucs qui restent dans ma tête et que je formule pas. Ton anniversaire m'a donné l'occasion. Et l'écran blanc m'a forcé à les mettre en mots. Joyeux anniversaire, [Prénom].
Avec identification de l'anniversaire comme occasion de dire des trucs non dits,
— ton enfant qui a des trucs à dire plus souvent qu'il le montre 🗣️` },
    { id: 'dt_ap_04', angle: "Joyeux anniversaire. J'ai cherché ce qu'on écrit pour l'anniversaire d'un parent.", body: `4. "Joyeux anniversaire. J'ai cherché ce qu'on écrit pour l'anniversaire d'un parent."
Internet m'a donné des trucs très convenus. Des poèmes. Des citations. Des formules. J'ai tout rejeté. Et j'ai décidé d'écrire juste ce que je pensais vraiment. Ce qui est plus difficile mais plus honnête. Joyeux anniversaire, [Prénom].
Avec rejet des formules trouvées sur internet au profit de ce que je pense vraiment,
— ton enfant qui préfère l'honnête au convenu même quand c'est plus difficile 💬` },
    { id: 'dt_ap_05', angle: "Je t'aurais dit joyeux anniversaire à l'oral. J'ai écrit quelque chose. Mesure l'effort.", body: `5. "Je t'aurais dit joyeux anniversaire à l'oral. J'ai écrit quelque chose. Mesure l'effort."
L'oral c'est facile. Deux mots. En passant. Ce message c'est une décision. Un temps. Une réflexion. Une recherche de mots. Une façon de dire que ton anniversaire mérite ce temps-là. Mesure l'effort. Joyeux anniversaire, [Prénom].
Avec invitation explicite à mesurer l'effort du message par rapport à l'alternative orale,
— ton enfant qui veut que tu apprécies l'effort à sa juste valeur 📏` },
    { id: 'dt_ap_06', angle: "Joyeux anniversaire. J'aime pas écrire pour les occasions parce que ça demande de dire des trucs vrais.", body: `6. "Joyeux anniversaire. J'aime pas écrire pour les occasions parce que ça demande de dire des trucs vrais."
Et les trucs vrais avec toi c'est pas toujours simple. On est proches mais on dit pas tout. L'écran blanc force à dire quelque chose de réel. Alors voilà le truc réel. T'es quelqu'un d'important dans ma vie. Le plus important peut-être. Joyeux anniversaire, [Prénom].
Avec révélation du truc réel que le message a forcé à dire,
— ton enfant qui admet que t'es le plus important même si il le dit pas souvent 💛` },
    { id: 'dt_ap_07', angle: "T'as un anniversaire. Je déteste écrire pour les occasions. Et je t'ai écrit quelque chose quand même parce que t'es mon parent.", body: `7. "T'as un anniversaire. Je déteste écrire pour les occasions. Et je t'ai écrit quelque chose quand même parce que t'es mon parent."
Ce lien. Ce truc particulier. Qui fait que certaines règles s'appliquent différemment. Qui fait que même ma politique a une exception nommée. Cette exception c'est toi. Joyeux anniversaire, [Prénom].
Avec identification du lien parent-enfant comme raison suffisante pour l'exception,
— ton enfant pour qui t'es l'exception à presque toutes les règles 🔑` },
    { id: 'dt_ap_08', angle: "Joyeux anniversaire. J'ai mis du temps à écrire ça. C'est pour toi donc ça valait le temps.", body: `8. "Joyeux anniversaire. J'ai mis du temps à écrire ça. C'est pour toi donc ça valait le temps."
Ce temps passé à chercher les mots. À recommencer. À trouver ce qui sonnait juste. Ce temps-là c'est pour toi. C'est ma façon de marquer que ton anniversaire valait ce temps. Joyeux anniversaire, [Prénom].
Avec identification du temps passé comme mesure de la valeur que j'accorde à ton anniversaire,
— ton enfant qui pense que le temps qu'on donne dit plus que les mots qu'on écrit ⏱️` },
    { id: 'dt_ap_09', angle: "Je suis pas du genre à écrire pour les occasions. Mais t'as vieilli d'un an et ça méritait d'être noté.", body: `9. "Je suis pas du genre à écrire pour les occasions. Mais t'as vieilli d'un an et ça méritait d'être noté."
Chaque année qui passe mérite d'être notée. Surtout tes années à toi. Surtout par moi. Ce message c'est une façon de noter que t'as un an de plus. Que cette année a existé. Que je l'ai vue passer avec toi. Joyeux anniversaire, [Prénom].
Avec définition du message comme notation du passage de l'année,
— ton enfant qui observe le passage de tes années et qui voulait en laisser une trace 📅` },
    { id: 'dt_ap_10', angle: "Joyeux anniversaire. Ce message dit que ton anniversaire était plus fort que mes principes.", body: `10. "Joyeux anniversaire. Ce message dit que ton anniversaire était plus fort que mes principes."
Mes principes de pas écrire pour les occasions. Solides. Durables. Et ton anniversaire. Qui a été plus fort. Cette victoire de ton anniversaire sur mes principes dit quelque chose sur l'importance de l'un sur l'autre. Joyeux anniversaire, [Prénom].
Avec mesure de l'importance de ton anniversaire à l'aune de sa victoire sur mes principes,
— ton enfant qui accepte cette défaite de ses principes comme une bonne défaite 🏳️` },
    { id: 'dt_ap_11', angle: "Je suis pas sentimental. Sauf apparemment pour ton anniversaire.", body: `11. "Je suis pas sentimental. Sauf apparemment pour ton anniversaire."
Toute l'année. Pas sentimental. Pas de grande déclaration. Pas de grands gestes. Et ton anniversaire. Et ce message. Cette exception sentimentale annuelle. Joyeux anniversaire, [Prénom].
Avec identification de ton anniversaire comme exception sentimentale annuelle,
— ton enfant qui découvre chaque année que ton anniversaire le rend un peu sentimental 🌀` },
    { id: 'dt_ap_12', angle: "Joyeux anniversaire. J'avais des trucs à te dire. L'écran blanc m'a forcé à les dire.", body: `12. "Joyeux anniversaire. J'avais des trucs à te dire. L'écran blanc m'a forcé à les dire."
Ces trucs non dits. Qui restent là. Dans ma tête. Que je formule pas dans le quotidien. Ce message a créé un espace pour les dire. Un espace inhabituel. Un espace qui m'a mis un peu mal à l'aise. Mais utile. Joyeux anniversaire, [Prénom].
Avec reconnaissance du rôle du message comme espace forcé pour les trucs non dits,
— ton enfant qui a des trucs non dits et qui te remercie de lui avoir donné cet espace 📝` },
    { id: 'dt_ap_13', angle: "T'as un anniversaire. J'ai une réticence à écrire pour les occasions. Cette fois la réticence a perdu.", body: `13. "T'as un anniversaire. J'ai une réticence à écrire pour les occasions. Cette fois la réticence a perdu."
Pas toujours. Pas pour tout le monde. Mais cette fois. Ton anniversaire cette année. Ma réticence a perdu. Et c'est bien qu'elle ait perdu. Joyeux anniversaire, [Prénom].
Avec satisfaction que la réticence ait perdu cette fois,
— ton enfant content du résultat même si la réticence reviendra probablement l'année prochaine 😅` },
    { id: 'dt_ap_14', angle: "Joyeux anniversaire. Ce message c'est ma façon de dire que t'es dans ma catégorie exception.", body: `14. "Joyeux anniversaire. Ce message c'est ma façon de dire que t'es dans ma catégorie exception."
La catégorie des gens pour qui je dépasse mes habitudes. Pour qui je fais des trucs que je ferais pas pour n'importe qui. T'es dans cette catégorie. T'y as toujours été. Joyeux anniversaire, [Prénom].
Avec placement dans la catégorie exception comme honneur particulier,
— ton enfant pour qui t'as toujours été dans la catégorie exception 🌟` },
    { id: 'dt_ap_15', angle: "J'aurais pu rien faire pour ton anniversaire. Enfin si. Je t'aurais dit quelque chose.", body: `15. "J'aurais pu rien faire pour ton anniversaire. Enfin si. Je t'aurais dit quelque chose."
Parce que c'est ton anniversaire et que ça compte. Et que même sans message j'aurais marqué le coup à l'oral. Mais j'ai voulu faire plus. Ce message c'est le plus. Joyeux anniversaire, [Prénom].
Avec distinction entre le minimum garanti et le plus choisi,
— ton enfant qui a choisi le plus et qui est content de ce choix 📈` },
    { id: 'dt_ap_16', angle: "Joyeux anniversaire. Je t'ai pas choisi mais je t'aurais choisi. Alors écrire quelque chose ça semblait logique.", body: `16. "Joyeux anniversaire. Je t'ai pas choisi mais je t'aurais choisi. Alors écrire quelque chose ça semblait logique."
La logique interne. Si j'aurais choisi quelqu'un pour mon parent je t'aurais choisi. Et les gens qu'on aurait choisis méritent qu'on écrive pour leurs anniversaires même quand on aime pas ça. Logique imparable. Joyeux anniversaire, [Prénom].
Avec raisonnement logique du choix hypothétique au message réel,
— ton enfant dont la logique interne est parfois tortueuse mais toujours cohérente 🧩` },
    { id: 'dt_ap_17', angle: "T'as un an de plus. Moi j'ai un principe en moins. On a tous perdu quelque chose.", body: `17. "T'as un an de plus. Moi j'ai un principe en moins. On a tous perdu quelque chose."
Toi une année. Moi un principe. Les deux sont des pertes d'une certaine façon. Les deux sont aussi des gains. Ton année de plus c'est une année vécue. Mon principe perdu c'est ce message pour toi. Joyeux anniversaire, [Prénom].
Avec philosophie légèrement absurde sur nos pertes respectives et ce qu'elles représentent,
— ton enfant qui devient philosophe les jours d'anniversaire 🤔` },
    { id: 'dt_ap_18', angle: "Joyeux anniversaire. Ce message dit que t'as un enfant qui pense à toi même quand il le montre pas.", body: `18. "Joyeux anniversaire. Ce message dit que t'as un enfant qui pense à toi même quand il le montre pas."
Pas toujours les mots. Pas toujours les gestes. Mais la pensée. La présence dans ma tête. Ce message dit que t'y es. Que t'as ta place dans mes pensées. Même les jours sans message. Joyeux anniversaire, [Prénom].
Avec révélation que la présence dans les pensées existe même sans les signes extérieurs habituels,
— ton enfant qui pense à toi plus qu'il ne le montre et qui voulait que tu le saches 💛` },
    { id: 'dt_ap_19', angle: "Je suis ton enfant. T'es mon parent. Y'a des liens pour lesquels les principes comptent pas.", body: `19. "Je suis ton enfant. T'es mon parent. Y'a des liens pour lesquels les principes comptent pas."
Les liens fondamentaux. Ceux qui existent avant les principes. Avant les politiques de pas écrire pour les occasions. Avant les habitudes. Toi et moi c'est un de ces liens. Et pour ces liens-là les principes comptent pas. Joyeux anniversaire, [Prénom].
Avec identification du lien parent-enfant comme supérieur à tout principe,
— ton enfant pour qui ce lien dépasse toutes ses règles internes ❤️` },
    { id: 'dt_ap_20', angle: "Je déteste écrire pour les occasions. T'es mon parent. Joyeux anniversaire. C'est tout ce qu'il faut savoir.", body: `20. "Je déteste écrire pour les occasions. T'es mon parent. Joyeux anniversaire. C'est tout ce qu'il faut savoir."
Trois faits. Mon rapport aux messages d'occasion. Ton statut. Le jour qu'on célèbre. Ces trois faits ensemble disent tout. Ils disent pourquoi ce message existe malgré mes habitudes. Ils disent que tu comptes. Joyeux anniversaire, [Prénom].
Avec économie de mots totale parce que trois faits disent parfois tout ce qui est nécessaire,
— ton enfant qui dit tout en peu de mots aujourd'hui ❤️` },
  ],
};
