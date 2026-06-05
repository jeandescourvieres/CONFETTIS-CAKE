// Auto-generated — Messages Mode Jeune
// 480 messages : anniversaire + fête du prénom × (13-17 ans + 18-25 ans) × 6 sous-catégories

export interface YouthMessage {
  id: string;
  angle: string;
  body: string;
}

export interface YouthSubCategory {
  id: string;
  label: string;
  emoji: string;
  messages: YouthMessage[];
}

export interface YouthAgeGroup {
  id: string;
  label: string;
  minAge: number;
  maxAge: number;
  subCategories: YouthSubCategory[];
}

export const YOUTH_MESSAGE_LIBRARY: Record<'birthday' | 'nameday', YouthAgeGroup[]> = {
  birthday: [
    {
      id: 'ado',
      label: '13-17 ans',
      minAge: 13,
      maxAge: 17,
      subCategories: [
        {
          id: 'tu_geres',
          label: "Tu gères",
          emoji: '🙌',
          messages: [
            { id: "a13_s1_001", angle: "Joyeux anniversaire frr t\'es une légende.", body: `1. "Joyeux anniversaire frr t'es une légende."
Sérieux. Une vraie légende. Pas le genre de légende que les profs inventent dans les livres d'histoire. Une vraie. Vivante. Qui répond aux messages parfois. Qui existe dans la vraie vie. T'as un autre année de faite et t'as géré. Comme toujours. Comme un chef. Joyeux anniversaire [Prénom] t'es littéralement incroyable.
No cap aucun cap du tout,
— Quelqu'un qui te le dit frr et c'est pas du vent 🔥` },
            { id: "a13_s1_002", angle: "Joyeux anniversaire bro/sis t\'assures trop.", body: `2. "Joyeux anniversaire bro/sis t'assures trop."
Genre vraiment. T'assures sur tous les fronts. La vie. Les trucs compliqués. Les journées de ouf. Les moments où c'est trop. Et t'es toujours là. Toujours debout. Toujours toi. C'est pas donné à tout le monde ça. Joyeux anniversaire [Prénom] t'es built different.
C'est la vérité brute,
— Quelqu'un qui te voit assurer et qui est là pour le confirmer 💪` },
            { id: "a13_s1_003", angle: "Joyeux anniversaire [Prénom] t\'es trop fort franchement.", body: `3. "Joyeux anniversaire [Prénom] t'es trop fort franchement."
Pas trop fort dans le sens bizarre. Trop fort dans le sens impressionnant. Dans le sens je sais pas comment tu fais mais tu le fais. Dans le sens t'as un truc que les autres ont pas. Ce truc-là il se voit. Il se sent. Il est là. Joyeux anniversaire [Prénom] garde ce truc.
Lowkey impressionné depuis le début,
— Quelqu'un qui a remarqué ton truc depuis longtemps 👀` },
            { id: "a13_s1_004", angle: "Joyeux anniversaire t\'es pas comme les autres frr.", body: `4. "Joyeux anniversaire t'es pas comme les autres frr."
Et c'est un compliment. Être comme les autres c'est overrated. Toi t'as ta propre vibe. Ta propre façon. Ton propre truc. Les autres font ce qu'ils font. Toi tu fais toi. Et toi c'est mieux. Joyeux anniversaire [Prénom] reste toi.
C'est ton meilleur attribut,
— Quelqu'un qui préfère ta version originale à toutes les copies 🌟` },
            { id: "a13_s1_005", angle: "Joyeux anniversaire [Prénom] tu gères ta life.", body: `5. "Joyeux anniversaire [Prénom] tu gères ta life."
Même quand c'est le chaos. Même quand tout part en vrille. Même quand les journées sont trop longues et les nuits trop courtes. Tu gères. Pas parfaitement. Mais tu gères. Et c'est déjà énorme. Plus que la plupart des gens. Joyeux anniversaire [Prénom].
Respect total pour ta gestion,
— Quelqu'un qui a vu le chaos de près et confirme que tu t'en sors bien 🎯` },
            { id: "a13_s1_006", angle: "Joyeux anniversaire t\'es littéralement une personne de qualité.", body: `6. "Joyeux anniversaire t'es littéralement une personne de qualité."
Qualité supérieure. Premium. Pas le genre bas de gamme. Le genre rare. Le genre qu'on trouve pas partout. Le genre qui fait que les gens autour de toi ont de la chance sans le savoir forcément. Joyeux anniversaire [Prénom] t'es premium.
No cap t'es vraiment différent niveau qualité,
— Quelqu'un qui sait reconnaître le premium quand il le voit ⭐` },
            { id: "a13_s1_007", angle: "Joyeux anniversaire frr t\'as une aura.", body: `7. "Joyeux anniversaire frr t'as une aura."
Une vraie aura. Pas la fausse que les gens essaient de se créer. La vraie. Celle qui est là naturellement. Celle que tu cherches pas à montrer. Celle qui existe juste parce que t'es toi. Cette aura-là elle est rare. Joyeux anniversaire [Prénom].
L'aura est réelle et vérifiée,
— Quelqu'un qui la voit depuis le début et peut confirmer son existence ✨` },
            { id: "a13_s1_008", angle: "Joyeux anniversaire [Prénom] t\'es built different et c\'est un fait.", body: `8. "Joyeux anniversaire [Prénom] t'es built different et c'est un fait."
Pas construit comme les autres. Différemment. Avec des trucs en plus peut-être. Ou juste différemment assemblés. En tout cas le résultat c'est quelqu'un qui gère des trucs que les autres gèrent pas. Qui voit des trucs que les autres voient pas. Joyeux anniversaire [Prénom].
C'est scientifiquement établi,
— Quelqu'un qui a fait l'étude comparative et confirme le résultat 🔬` },
            { id: "a13_s1_009", angle: "Joyeux anniversaire tu slay littéralement.", body: `9. "Joyeux anniversaire tu slay littéralement."
Chaque jour. Même les jours de flemme. Même les jours où t'as pas dormi. Même les jours où tu penses pas slay du tout. De l'extérieur ça slay. C'est objectif. C'est mesurable. Joyeux anniversaire [Prénom] continue de slay.
Le slay est constant et documenté,
— Quelqu'un qui observe le slay depuis longtemps et peut en attester 💅` },
            { id: "a13_s1_010", angle: "Joyeux anniversaire [Prénom] t\'es vraiment quelqu\'un de ouf.", body: `10. "Joyeux anniversaire [Prénom] t'es vraiment quelqu'un de ouf."
Ouf dans le bon sens. Le sens où les gens utilisent ouf pour dire impressionnant. Remarquable. Au-dessus de la moyenne. T'as des trucs qui font que les gens autour de toi se disent wsh ce [Prénom] c'est quelqu'un. Joyeux anniversaire [Prénom].
Wsh vraiment,
— Quelqu'un qui pense wsh ce [Prénom] régulièrement 🤯` },
            { id: "a13_s1_011", angle: "Joyeux anniversaire frr t\'as passé une année et tu t\'en sors.", body: `11. "Joyeux anniversaire frr t'as passé une année et tu t'en sors."
C'est pas rien une année. C'est des journées. Des semaines. Des trucs qui arrivent. Des trucs qui partent. Des moments trop bien. Des moments moins bien. Et t'as traversé tout ça. Et t'es là. En vie. En forme. Joyeux anniversaire [Prénom].
Respect pour la traversée complète,
— Quelqu'un qui était là pendant une partie et confirme que c'était une année de ouf 📅` },
            { id: "a13_s1_012", angle: "Joyeux anniversaire [Prénom] tu mérites trop ce jour.", body: `12. "Joyeux anniversaire [Prénom] tu mérites trop ce jour."
Ce jour qui est le tien. Cette journée où c'est toi le centre. Où les gens pensent à toi. Où les messages arrivent. Où c'est officiel que t'existes et que les gens sont contents que t'existes. Tu mérites ça. Vraiment. Joyeux anniversaire [Prénom].
T'as mérité chaque message de ce jour,
— Quelqu'un qui pense à toi aujourd'hui et voulait que tu le saches 💛` },
            { id: "a13_s1_013", angle: "Joyeux anniversaire t\'es top tier [Prénom].", body: `13. "Joyeux anniversaire t'es top tier [Prénom]."
Top tier. Le niveau le plus haut. Le classement le plus élevé. Pas mid. Pas bas. Top. Le genre de personne qu'on met dans la catégorie au-dessus dans sa tête. Le genre qu'on est content d'avoir dans sa vie. Joyeux anniversaire [Prénom] top tier confirmé.
Le classement est définitif,
— Quelqu'un qui t'a mis top tier depuis longtemps et maintient ce classement 🏆` },
            { id: "a13_s1_014", angle: "Joyeux anniversaire frr t\'as une énergie de ouf.", body: `14. "Joyeux anniversaire frr t'as une énergie de ouf."
Cette énergie. Qui est là quand tu arrives. Qui change l'ambiance. Qui fait que les trucs sont différents quand t'es présent. Pas tout le monde a cette énergie-là. Toi t'as. Et c'est un cadeau pour les gens autour de toi. Joyeux anniversaire [Prénom].
L'énergie est réelle et appréciée,
— Quelqu'un qui recharge grâce à ton énergie et t'en est reconnaissant ⚡` },
            { id: "a13_s1_015", angle: "Joyeux anniversaire [Prénom] t\'es vraiment W.", body: `15. "Joyeux anniversaire [Prénom] t'es vraiment W."
W comme win. Comme winner. Comme quelqu'un qui gagne même quand ça semble perdu. Même quand c'est compliqué. Même quand les odds sont contre. T'es W. C'est dans ta nature. Joyeux anniversaire [Prénom].
W absolu certifié,
— Quelqu'un qui te voit gagner depuis longtemps et confirme le statut W 🥇` },
            { id: "a13_s1_016", angle: "Joyeux anniversaire t\'es pas mid du tout frr.", body: `16. "Joyeux anniversaire t'es pas mid du tout frr."
Le contraire de mid. Au-dessus de mid. Largement. Mid c'est pour les autres. Toi t'es au-dessus. Significativement. Objectivement. Sans discussion possible. Joyeux anniversaire [Prénom] loin au-dessus de mid.
Anti-mid certifié,
— Quelqu'un qui confirme que mid c'est pas ton vibe du tout 📈` },
            { id: "a13_s1_017", angle: "Joyeux anniversaire [Prénom] t\'as une façon de gérer les trucs qui est trop bien.", body: `17. "Joyeux anniversaire [Prénom] t'as une façon de gérer les trucs qui est trop bien."
Cette façon. De prendre les trucs. De les gérer. De passer à travers. De ressortir de l'autre côté. Pas tout le monde fait ça pareil. Toi t'as une méthode. Elle marche. Elle est à toi. Joyeux anniversaire [Prénom].
La méthode est validée,
— Quelqu'un qui a observé la méthode en action et peut confirmer son efficacité 🎯` },
            { id: "a13_s1_018", angle: "Joyeux anniversaire frr t\'es le genre de personne qui élève les autres.", body: `18. "Joyeux anniversaire frr t'es le genre de personne qui élève les autres."
Juste par ta présence. Par ce que tu dégages. Par ta façon d'être. Les gens autour de toi sont mieux quand t'es là. Ils gèrent mieux. Ils voient mieux. Ils sont mieux. C'est ton effet sur les autres. Joyeux anniversaire [Prénom].
L'effet élévateur est documenté,
— Quelqu'un qui est meilleur quand t'es là et le sait 🚀` },
            { id: "a13_s1_019", angle: "Joyeux anniversaire [Prénom] t\'as survécu à une année entière c\'est W.", body: `19. "Joyeux anniversaire [Prénom] t'as survécu à une année entière c'est W."
Une année complète. Avec tout ce que ça contient. Les bonnes journées. Les journées de merde. Les trucs qui arrivent sans prévenir. Les trucs qu'on prévoit et qui arrivent quand même. T'as tout traversé. T'es là. C'est W. Joyeux anniversaire [Prénom].
La survie annuelle mérite d'être célébrée,
— Quelqu'un qui était là pour une partie et confirme que c'était une vraie année 💪` },
            { id: "a13_s1_020", angle: "Joyeux anniversaire [Prénom] no cap t\'es une des meilleures personnes que je connais.", body: `20. "Joyeux anniversaire [Prénom] no cap t'es une des meilleures personnes que je connais."
No cap. Aucun cap. La vérité brute sans filtre. Une des meilleures. Peut-être la meilleure selon les jours. Selon les critères. Selon comment on définit meilleure. Mais clairement dans le top. Clairement quelqu'un qui compte. Joyeux anniversaire [Prénom].
No cap absolu sur cette déclaration,
— Quelqu'un qui le pense vraiment et voulait le dire aujourd'hui ❤️` },
          ],
        },
        {
          id: 'chelou',
          label: "T'es chelou mais t'es mon chelou",
          emoji: '🌀',
          messages: [
            { id: "a13_s2_001", angle: "Joyeux anniversaire [Prénom] t\'es chelou mais c\'est cool.", body: `1. "Joyeux anniversaire [Prénom] t'es chelou mais c'est cool."
Chelou dans le bon sens. Le sens où t'as des trucs que personne d'autre a. Des façons de voir. Des réactions inattendues. Des opinions qu'on voit pas venir. Ce chelou-là c'est pas un défaut. C'est une caractéristique. Une feature pas un bug. Joyeux anniversaire [Prénom] reste chelou.
Le chelou est apprécié et encouragé,
— Quelqu'un qui préfère ton chelou à la normalité des autres 🌀` },
            { id: "a13_s2_002", angle: "Joyeux anniversaire frr t\'as des réactions trop bizarres et c\'est pour ça qu\'on t\'aime.", body: `2. "Joyeux anniversaire frr t'as des réactions trop bizarres et c'est pour ça qu'on t'aime."
Ces réactions. Qu'on voit pas venir. Qui arrivent de nulle part. Qui font que les gens autour se regardent avec un sourire. Ce truc imprévisible que t'as. Cette façon de réagir qui est juste la tienne. Joyeux anniversaire [Prénom] garde ces réactions.
Les réactions bizarres sont le meilleur de toi,
— Quelqu'un qui attend tes réactions avec impatience à chaque fois 😂` },
            { id: "a13_s2_003", angle: "Joyeux anniversaire [Prénom] t\'as des opinions de ouf qu\'on comprend pas toujours.", body: `3. "Joyeux anniversaire [Prénom] t'as des opinions de ouf qu'on comprend pas toujours."
Ces opinions. Sur des trucs. Que t'as réfléchis différemment. Que t'arrives avec. Que personne attendait. Qu'on comprend pas forcément. Mais qu'on écoute. Parce que t'as un cerveau qui fonctionne autrement. Et c'est fascinant. Joyeux anniversaire [Prénom].
Les opinions incompréhensibles sont quand même intéressantes,
— Quelqu'un qui écoute tes théories même quand elles partent loin 🧠` },
            { id: "a13_s2_004", angle: "Joyeux anniversaire frr t\'as un humour que tout le monde comprend pas et c\'est parfait.", body: `4. "Joyeux anniversaire frr t'as un humour que tout le monde comprend pas et c'est parfait."
Cet humour. Décalé. Qui arrive au mauvais moment parfois. Qui est drôle pour toi clairement. Qui est drôle pour les bonnes personnes. Les autres passent à côté. Tant mieux. L'humour de qualité c'est pas pour tout le monde. Joyeux anniversaire [Prénom].
L'humour de niche est le meilleur humour,
— Quelqu'un qui comprend tes blagues et rit au bon moment 😄` },
            { id: "a13_s2_005", angle: "Joyeux anniversaire [Prénom] t\'as des intérêts random et c\'est trop bien.", body: `5. "Joyeux anniversaire [Prénom] t'as des intérêts random et c'est trop bien."
Ces trucs que t'aimes. Qui viennent de nulle part. Que personne d'autre dans ton entourage aime forcément. Ces passions inattendues. Ces sujets que tu maîtrises mieux que quiconque sans raison apparente. Joyeux anniversaire [Prénom] garde tes intérêts random.
Les intérêts random sont une richesse,
— Quelqu'un qui a appris des trucs grâce à tes passions inattendues 🎲` },
            { id: "a13_s2_006", angle: "Joyeux anniversaire t\'es le genre de chelou qu\'on veut dans sa vie.", body: `6. "Joyeux anniversaire t'es le genre de chelou qu'on veut dans sa vie."
Pas le chelou qui fait peur. Pas le chelou qui met mal à l'aise. Le chelou attachant. Le chelou qui rend les journées meilleures. Le chelou dont l'absence se fait sentir. Ce chelou-là c'est toi. Joyeux anniversaire [Prénom].
Le bon type de chelou certifié,
— Quelqu'un qui est content d'avoir ce chelou précis dans sa vie 💛` },
            { id: "a13_s2_007", angle: "Joyeux anniversaire [Prénom] tes références sont trop random et c\'est drôle.", body: `7. "Joyeux anniversaire [Prénom] tes références sont trop random et c'est drôle."
Ces références. Que tu sors. Qui viennent d'un film de 2003. D'un mème de l'année dernière. D'un truc que t'as vu à 2h du matin. Que personne a la même. Que tu dois expliquer. Et l'explication est encore plus drôle que la référence. Joyeux anniversaire [Prénom].
Les références random sont toujours appréciées,
— Quelqu'un qui googlelait tes références au début et maintenant les connaît toutes 📱` },
            { id: "a13_s2_008", angle: "Joyeux anniversaire frr t\'as une énergie chelou qu\'on aime.", body: `8. "Joyeux anniversaire frr t'as une énergie chelou qu'on aime."
Cette énergie. Qu'on définit pas facilement. Qui est là. Qui fait quelque chose. Qui est différente des énergies normales. Pas meilleure forcément. Juste différente. Juste la tienne. Et on l'aime pour ça. Joyeux anniversaire [Prénom].
L'énergie chelou est une énergie de qualité,
— Quelqu'un qui s'est adapté à ton énergie et la préfère aux autres maintenant ⚡` },
            { id: "a13_s2_009", angle: "Joyeux anniversaire [Prénom] tu fais des trucs bizarres et c\'est iconic.", body: `9. "Joyeux anniversaire [Prénom] tu fais des trucs bizarres et c'est iconic."
Ces trucs. Qu'on peut pas expliquer aux gens qui te connaissent pas. Ces comportements. Ces habitudes. Ces façons de faire. Qui sont juste les tiennes. Qui sont devenues légendaires dans ton entourage. Qui font partie de ton identité maintenant. Joyeux anniversaire [Prénom].
L'iconique c'est toi,
— Quelqu'un qui raconte tes trucs bizarres aux autres avec fierté 👑` },
            { id: "a13_s2_010", angle: "Joyeux anniversaire t\'as un cerveau qui part dans tous les sens frr.", body: `10. "Joyeux anniversaire t'as un cerveau qui part dans tous les sens frr."
Ces pensées. Ces associations. Ces trucs que tu dis qui semblent random mais qui ont une logique interne que toi seul comprends. Ce cerveau qui fait des connexions inattendues. Qui arrive à des conclusions surprenantes. Joyeux anniversaire [Prénom].
Le cerveau random est un cerveau de qualité,
— Quelqu'un qui essaie de suivre tes pensées et y arrive parfois 🌀` },
            { id: "a13_s2_011", angle: "Joyeux anniversaire [Prénom] t\'as des goûts chelous et c\'est refreshing.", body: `11. "Joyeux anniversaire [Prénom] t'as des goûts chelous et c'est refreshing."
Ces goûts. En musique. En nourriture. En tout. Qui surprennent. Qui font lever des sourcils. Qui font sourire. Qui sont juste les tiens. Pas influencés par ce que tout le monde aime. Authentiquement les tiens. Joyeux anniversaire [Prénom].
Les goûts chelous c'est l'authenticité pure,
— Quelqu'un qui a découvert des trucs bien grâce à tes goûts chelous 🎵` },
            { id: "a13_s2_012", angle: "Joyeux anniversaire frr tes questions sont trop random mais pertinentes.", body: `12. "Joyeux anniversaire frr tes questions sont trop random mais pertinentes."
Ces questions. Qui arrivent de nulle part. Qui changent le sujet complètement. Qui font réfléchir à des trucs qu'on avait jamais envisagés. Qui sont chelou en surface et profondes en vrai. Joyeux anniversaire [Prénom] continue de poser ces questions.
Les questions random sont les meilleures questions,
— Quelqu'un qui n'a toujours pas répondu à ta question de l'autre jour et y pense encore 🤔` },
            { id: "a13_s2_013", angle: "Joyeux anniversaire [Prénom] t\'as une façon de voir les trucs qui est pas normale.", body: `13. "Joyeux anniversaire [Prénom] t'as une façon de voir les trucs qui est pas normale."
Pas normale dans le sens rare. Dans le sens que tout le monde voit pas pareil. Que t'as un angle. Une perspective. Une façon d'interpréter les situations qui est juste différente. Et souvent plus intéressante. Joyeux anniversaire [Prénom].
La vision anormale est en fait la meilleure,
— Quelqu'un qui emprunte ton angle de vue régulièrement sans le dire 👁️` },
            { id: "a13_s2_014", angle: "Joyeux anniversaire t\'es imprévisible frr et c\'est le meilleur truc.", body: `14. "Joyeux anniversaire t'es imprévisible frr et c'est le meilleur truc."
On sait jamais ce que tu vas faire. Ce que tu vas dire. Comment tu vas réagir. Et c'est pas stressant. C'est excitant. C'est ce qui rend les moments avec toi différents des moments avec les autres. Joyeux anniversaire [Prénom].
L'imprévisibilité est une qualité sous-estimée,
— Quelqu'un qui apprécie de jamais savoir ce qui va se passer avec toi 🎲` },
            { id: "a13_s2_015", angle: "Joyeux anniversaire [Prénom] t\'arrives avec des idées de ouf à des heures de ouf.", body: `15. "Joyeux anniversaire [Prénom] t'arrives avec des idées de ouf à des heures de ouf."
Ces idées. Qui arrivent tard le soir. Tôt le matin. Au moment où personne les attend. Qui sont parfois géniales et parfois juste chelou. Mais toujours intéressantes. Toujours les tiennes. Joyeux anniversaire [Prénom].
Les idées tardives sont souvent les meilleures,
— Quelqu'un qui reçoit tes messages d'idées à 2h du matin et les lit quand même 💡` },
            { id: "a13_s2_016", angle: "Joyeux anniversaire frr t\'as une logique perso que les autres suivent pas.", body: `16. "Joyeux anniversaire frr t'as une logique perso que les autres suivent pas."
Cette logique. Qui est cohérente pour toi. Qui tient debout de l'intérieur. Qui amène à des conclusions que les autres atteignent pas. Une façon de raisonner qui est juste différente. Et souvent plus créative. Joyeux anniversaire [Prénom].
La logique perso est souvent supérieure à la logique commune,
— Quelqu'un qui a fini par comprendre ta logique et la trouve souvent meilleure 🧩` },
            { id: "a13_s2_017", angle: "Joyeux anniversaire [Prénom] t\'as des phases et c\'est trop divertissant.", body: `17. "Joyeux anniversaire [Prénom] t'as des phases et c'est trop divertissant."
Ces phases. Ces périodes où t'es dans quelque chose. Un sujet. Une passion. Une obsession temporaire. Qui prend toute la place pendant un moment. Qui est intense. Qui passe. Et qui laisse des traces intéressantes. Joyeux anniversaire [Prénom].
Les phases sont le meilleur divertissement,
— Quelqu'un qui attend tes prochaines phases avec impatience 🎭` },
            { id: "a13_s2_018", angle: "Joyeux anniversaire frr t\'as un rapport au temps chelou et c\'est iconic.", body: `18. "Joyeux anniversaire frr t'as un rapport au temps chelou et c'est iconic."
Ce rapport. Au temps. Aux horaires. Aux délais. Aux secondes qui durent dix minutes. Aux minutes qui durent une heure. Cette façon particulière de vivre dans le temps. Qui est juste la tienne. Joyeux anniversaire [Prénom].
Le rapport chelou au temps est une caractéristique distinctive,
— Quelqu'un qui a appris à ajouter une heure à toutes tes estimations ⏰` },
            { id: "a13_s2_019", angle: "Joyeux anniversaire [Prénom] les gens qui te comprennent vraiment sont chanceux.", body: `19. "Joyeux anniversaire [Prénom] les gens qui te comprennent vraiment sont chanceux."
Parce que te comprendre vraiment c'est pas donné. Ça demande du temps. De l'attention. Une ouverture d'esprit. Mais ceux qui y arrivent ont accès à quelque chose de rare. À une personne qui vaut vraiment la peine d'être comprise. Joyeux anniversaire [Prénom].
Les chanceux qui te comprennent le savent,
— Quelqu'un qui a mis le temps qu'il fallait et confirme que ça valait l'effort 🌟` },
            { id: "a13_s2_020", angle: "Joyeux anniversaire t\'es chelou t\'es mon chelou et c\'est pour la vie frr.", body: `20. "Joyeux anniversaire t'es chelou t'es mon chelou et c'est pour la vie frr."
Pour la vie. Le chelou que j'ai choisi. Que je rechoisirais. Avec tous les trucs incompréhensibles. Toutes les réactions inattendues. Toutes les idées de 2h du matin. Tout le package. Joyeux anniversaire [Prénom] pour la vie.
Pour la vie no cap,
— Quelqu'un qui a signé pour le chelou complet et le regrette pas ❤️

On continue avec` },
          ],
        },
        {
          id: 'vieilli',
          label: "Franchement t'as vieilli",
          emoji: '😄',
          messages: [
            { id: "a13_s3_001", angle: "Joyeux anniversaire frr t\'as genre vieilli.", body: `1. "Joyeux anniversaire frr t'as genre vieilli."
C'est un fait. Mathématique. Implacable. T'avais un âge l'année dernière. T'en as un autre maintenant. Le chiffre a augmenté. C'est comme ça. C'est la vie. C'est le temps qui passe. C'est toi qui vieillis. Joyeux anniversaire [Prénom] t'as vieilli et c'est validé.
Le vieillissement est confirmé et acté,
— Quelqu'un qui note le changement de chiffre avec attention 📈` },
            { id: "a13_s3_002", angle: "Joyeux anniversaire [Prénom] t\'es littéralement plus un bébé.", body: `2. "Joyeux anniversaire [Prénom] t'es littéralement plus un bébé."
C'est terminé le stade bébé. C'est fini. T'as des années derrière toi maintenant. Des vraies. Avec des trucs dedans. Des expériences. Des souvenirs. Des moments. T'es plus un bébé frr. T'as grandi. Joyeux anniversaire [Prénom].
La phase bébé est officiellement terminée,
— Quelqu'un qui confirme que t'as effectivement grandi depuis 👶` },
            { id: "a13_s3_003", angle: "Joyeux anniversaire frr t\'as un an de plus c\'est pas le move mais c\'est la vie.", body: `3. "Joyeux anniversaire frr t'as un an de plus c'est pas le move mais c'est la vie."
C'est pas ce qu'on aurait choisi. Rester jeune c'est mieux en théorie. Mais le temps il demande pas la permission. Il passe. Il ajoute. Il accumule. Et te voilà avec un an de plus. C'est pas le move mais c'est le seul disponible. Joyeux anniversaire [Prénom].
Le move imposé par le temps est accepté,
— Quelqu'un qui subit le même move et compatit totalement ⏳` },
            { id: "a13_s3_004", angle: "Joyeux anniversaire [Prénom] t\'es ancient maintenant bro.", body: `4. "Joyeux anniversaire [Prénom] t'es ancient maintenant bro."
Ancient. Pas vieux. Ancient. Comme quelqu'un qui a de l'histoire. Du vécu. Des années derrière soi. T'accumules les années et ça se voit pas forcément mais c'est là. T'es ancient [Prénom]. Joyeux anniversaire ancient.
Le statut ancient est conféré officiellement,
— Quelqu'un qui te confère ce titre avec tout le respect qui lui est dû 🏛️` },
            { id: "a13_s3_005", angle: "Joyeux anniversaire frr dans quelques années tu seras vraiment vieux.", body: `5. "Joyeux anniversaire frr dans quelques années tu seras vraiment vieux."
C'est une projection. Un calcul simple. T'as l'âge que t'as maintenant. Dans quelques années t'en auras plus. Et dans encore quelques années encore plus. La trajectoire est claire. Le destin est tracé. Joyeux anniversaire [Prénom] profite maintenant.
La projection temporelle est scientifiquement exacte,
— Quelqu'un qui fait le même calcul pour soi et préfère ne pas y penser 📊` },
            { id: "a13_s3_006", angle: "Joyeux anniversaire [Prénom] t\'as un chiffre de ouf maintenant.", body: `6. "Joyeux anniversaire [Prénom] t'as un chiffre de ouf maintenant."
Ce chiffre. Ton âge. Qui existait pas avant. Qui est là maintenant. Qui dit quelque chose sur le temps passé. Sur les années traversées. Sur tout ce qui s'est accumulé depuis le début. Ce chiffre de ouf qui est le tien. Joyeux anniversaire [Prénom].
Le chiffre est noted,
— Quelqu'un qui a noté le nouveau chiffre et le trouve impressionnant 🔢` },
            { id: "a13_s3_007", angle: "Joyeux anniversaire frr les petits enfants te trouvent vieux maintenant.", body: `7. "Joyeux anniversaire frr les petits enfants te trouvent vieux maintenant."
C'est un signe. Quand les petits regardent avec ces yeux. Ces yeux qui disent t'es grand toi. Que pour eux t'es quelqu'un d'âgé. C'est brutal venant de quelqu'un qui a cinq ans. Mais c'est honnête. Joyeux anniversaire [Prénom].
L'honnêteté des enfants est un service rendu,
— Quelqu'un qui a entendu pareil de la part d'un enfant et s'en remet encore 👶` },
            { id: "a13_s3_008", angle: "Joyeux anniversaire [Prénom] t\'as des souvenirs que les plus jeunes comprennent pas.", body: `8. "Joyeux anniversaire [Prénom] t'as des souvenirs que les plus jeunes comprennent pas."
Ces références. Ces trucs. Ces moments culturels. Que t'as vécus. Que les plus jeunes connaissent pas. Ou connaissent comme histoire ancienne. Comme patrimoine. Comme truc du passé. Tu portes des souvenirs historiques maintenant. Joyeux anniversaire [Prénom].
Les souvenirs historiques sont une richesse,
— Quelqu'un qui partage certains de ces souvenirs et s'y accroche 📼` },
            { id: "a13_s3_009", angle: "Joyeux anniversaire frr t\'as survécu à des trucs que les ados actuels connaîtront jamais.", body: `9. "Joyeux anniversaire frr t'as survécu à des trucs que les ados actuels connaîtront jamais."
Ces trucs. Ces périodes. Ces technologies. Ces façons de vivre. Que t'as connues et qui existent plus. Ou qui ont changé. Cette expérience de vie unique à ta génération. Joyeux anniversaire [Prénom] survivant d'une époque.
La survie générationnelle mérite respect,
— Quelqu'un qui a survécu aux mêmes trucs et en est légèrement fier 🦕` },
            { id: "a13_s3_010", angle: "Joyeux anniversaire [Prénom] chaque année qui passe te rend plus toi.", body: `10. "Joyeux anniversaire [Prénom] chaque année qui passe te rend plus toi."
C'est le truc avec vieillir. On devient plus soi. Plus défini. Plus installé dans qui on est. Moins influencé par ce que les autres pensent. Plus à l'aise avec ses propres trucs. Vieillir c'est devenir plus toi. Joyeux anniversaire [Prénom].
Devenir plus soi c'est le meilleur effet du vieillissement,
— Quelqu'un qui observe cette évolution et la trouve vraiment bien 🌱` },
            { id: "a13_s3_011", angle: "Joyeux anniversaire frr t\'as l\'âge où les trucs commencent à avoir du sens.", body: `11. "Joyeux anniversaire frr t'as l'âge où les trucs commencent à avoir du sens."
Cet âge. Où certaines choses se clarifient. Où des trucs qui semblaient compliqués deviennent plus simples. Où l'expérience commence à servir à quelque chose. Où on commence à voir les patterns. Joyeux anniversaire [Prénom].
L'âge de la clarté progressive c'est un bon âge,
— Quelqu'un qui attend que les trucs fassent sens pour lui aussi 💡` },
            { id: "a13_s3_012", angle: "Joyeux anniversaire [Prénom] t\'as vieilli mais t\'as pas changé ce qui compte.", body: `12. "Joyeux anniversaire [Prénom] t'as vieilli mais t'as pas changé ce qui compte."
Ce truc. Ce truc essentiel. Ce fond. Ce qui fait que c'est toi. Qui était là avant. Qui est là maintenant. Qui sera là après. Les années passent. Ce truc reste. Et c'est le meilleur truc qui pouvait rester. Joyeux anniversaire [Prénom].
Le truc essentiel est intact et c'est ce qui compte,
— Quelqu'un qui vérifie que ce truc est toujours là et confirme sa présence 💛` },
            { id: "a13_s3_013", angle: "Joyeux anniversaire frr t\'as un an de plus et t\'as l\'air serein avec ça.", body: `13. "Joyeux anniversaire frr t'as un an de plus et t'as l'air serein avec ça."
Cette sérénité. Face au chiffre qui monte. Cette façon de pas dramatiser. De prendre ça cool. De pas faire une crise existentielle à chaque anniversaire. Cette maturité face au vieillissement. Impressionnant franchement. Joyeux anniversaire [Prénom].
La sérénité face au vieillissement c'est une compétence rare,
— Quelqu'un qui est moins serein que toi là-dessus et prend note 😌` },
            { id: "a13_s3_014", angle: "Joyeux anniversaire [Prénom] les années s\'accumulent mais toi tu restes W.", body: `14. "Joyeux anniversaire [Prénom] les années s'accumulent mais toi tu restes W."
Le chiffre monte. Les années passent. Et toi tu restes W. Cette constance. Cette façon de rester au niveau peu importe ce que le temps fait. W l'année dernière. W cette année. W l'année prochaine probablement. Joyeux anniversaire [Prénom].
Le statut W est indépendant de l'âge,
— Quelqu'un qui confirme que le W ne vieillit pas 🏆` },
            { id: "a13_s3_015", angle: "Joyeux anniversaire frr vieillir c\'est pas ouf mais toi tu le gères bien.", body: `15. "Joyeux anniversaire frr vieillir c'est pas ouf mais toi tu le gères bien."
Vieillir c'est pas le truc le plus exciting. Tout le monde est d'accord là-dessus. Mais certains le gèrent mieux que d'autres. Toi tu le gères bien. Tu prends ça. Tu continues. Tu avances. Joyeux anniversaire [Prénom] bonne gestion du vieillissement.
La gestion du vieillissement est notée positivement,
— Quelqu'un qui observe ta technique et essaie de l'adopter 📋` },
            { id: "a13_s3_016", angle: "Joyeux anniversaire [Prénom] t\'as l\'âge de quelqu\'un qui a vécu des trucs.", body: `16. "Joyeux anniversaire [Prénom] t'as l'âge de quelqu'un qui a vécu des trucs."
Cet âge. Où on commence à avoir un bagage. Des expériences. Des histoires. Des moments qu'on a traversés. Des trucs qui nous ont appris quelque chose. Cet âge où le vécu commence à se voir. Joyeux anniversaire [Prénom].
L'âge du vécu c'est l'âge intéressant,
— Quelqu'un qui veut entendre tes histoires de vécu 🎒` },
            { id: "a13_s3_017", angle: "Joyeux anniversaire frr dans le futur t\'auras l\'air jeune sur les photos d\'aujourd\'hui.", body: `17. "Joyeux anniversaire frr dans le futur t'auras l'air jeune sur les photos d'aujourd'hui."
C'est une certitude. Dans dix ans tu regarderas les photos de maintenant. Et tu penseras wsh j'étais jeune. Et tu seras nostalgique. Et tu trouveras que t'avais l'air bien. Profite d'avoir l'air jeune maintenant même si tu t'en rends pas compte. Joyeux anniversaire [Prénom].
La jeunesse actuelle sera regrettée dans le futur c'est garanti,
— Quelqu'un qui regarde déjà ses vieilles photos avec nostalgie et confirme la théorie 📸` },
            { id: "a13_s3_018", angle: "Joyeux anniversaire [Prénom] t\'as vieilli et c\'est lowkey pas grave.", body: `18. "Joyeux anniversaire [Prénom] t'as vieilli et c'est lowkey pas grave."
Lowkey vraiment pas grave. C'est le temps qui fait son truc. C'est la vie. C'est normal. C'est humain. Tout le monde vieillit. Toi tu vieillis. Et c'est pas grave du tout en vrai. Joyeux anniversaire [Prénom] le vieillissement c'est overrated comme problème.
Le vieillissement est overrated comme problème confirmé,
— Quelqu'un qui relativise le vieillissement et trouve que t'as raison de pas t'en inquiéter 🌿` },
            { id: "a13_s3_019", angle: "Joyeux anniversaire frr t\'as l\'âge parfait pour faire des trucs.", body: `19. "Joyeux anniversaire frr t'as l'âge parfait pour faire des trucs."
Cet âge. Ni trop jeune pour pas être pris au sérieux. Ni trop vieux pour pas pouvoir faire certaines choses. Cet âge du milieu parfait. Où tout est encore possible. Où l'énergie est là. Où les idées sont là. Joyeux anniversaire [Prénom] profite de cet âge parfait.
L'âge parfait pour faire des trucs c'est maintenant,
— Quelqu'un qui confirme que c'est le bon âge pour tout ce que t'as envie de faire 🚀` },
            { id: "a13_s3_020", angle: "Joyeux anniversaire [Prénom] vieillir avec toi c\'est un privilège frr.", body: `20. "Joyeux anniversaire [Prénom] vieillir avec toi c'est un privilège frr."
Un vrai privilège. Pas dit pour faire joli. Voir quelqu'un évoluer. Changer. Grandir. Devenir plus soi. Traverser des trucs. Ressortir de l'autre côté. Être là pendant tout ça. C'est quelque chose. Joyeux anniversaire [Prénom].
Le privilège est réel et apprécié,
— Quelqu'un qui est là depuis un moment et compte bien rester pour la suite ❤️

On continue avec` },
          ],
        },
        {
          id: 'trucs',
          label: "On a vécu des trucs",
          emoji: '🧡',
          messages: [
            { id: "a13_s4_001", angle: "Joyeux anniversaire frr on a vécu des trucs toi et moi.", body: `1. "Joyeux anniversaire frr on a vécu des trucs toi et moi."
Des vrais trucs. Pas des trucs inventés. Des moments. Des situations. Des journées. Des nuits. Des fous rires. Des moments de merde. Des trucs qu'on raconte encore. Des trucs qu'on raconte jamais. Tout ça c'est entre nous. Joyeux anniversaire [Prénom].
Les trucs vécus ensemble sont gravés,
— Quelqu'un qui pense à au moins trois de ces trucs là maintenant 🔥` },
            { id: "a13_s4_002", angle: "Joyeux anniversaire [Prénom] on a des souvenirs que personne d\'autre a.", body: `2. "Joyeux anniversaire [Prénom] on a des souvenirs que personne d'autre a."
Ces souvenirs. Qui existent que dans nos deux têtes. Qui appartiennent qu'à nous. Que les autres pourraient pas comprendre même si on expliquait. Ces souvenirs privés. Ces moments à nous. Joyeux anniversaire [Prénom].
Les souvenirs privés sont les plus précieux,
— Quelqu'un qui sourit à ces souvenirs en ce moment même 😄` },
            { id: "a13_s4_003", angle: "Joyeux anniversaire frr on a survécu à des situations de ouf ensemble.", body: `3. "Joyeux anniversaire frr on a survécu à des situations de ouf ensemble."
Ces situations. Ces moments où c'était intense. Où c'était compliqué. Où on savait pas comment ça allait finir. Et on a géré. Ensemble. Et on s'en est sortis. Et on en parle encore parfois. Joyeux anniversaire [Prénom] survivants ensemble.
La survie collective mérite d'être célébrée,
— Quelqu'un qui pense à une situation précise là et sourit 💪` },
            { id: "a13_s4_004", angle: "Joyeux anniversaire [Prénom] on a eu des fous rires de ouf.", body: `4. "Joyeux anniversaire [Prénom] on a eu des fous rires de ouf."
Ces fous rires. Qui partaient de rien. Qui s'arrêtaient pas. Qui revenaient par vagues. Qui faisaient mal au ventre. Ces moments où c'était drôle pour nous et personne d'autre comprenait pourquoi. Ces fous rires-là sont dans la catégorie trésors. Joyeux anniversaire [Prénom].
Les fous rires partagés sont irremplaçables,
— Quelqu'un qui rit encore en y repensant maintenant 😂` },
            { id: "a13_s4_005", angle: "Joyeux anniversaire frr t\'étais là pendant des moments importants pour moi.", body: `5. "Joyeux anniversaire frr t'étais là pendant des moments importants pour moi."
Ces moments. Où t'étais là. Présent. Même si tu savais pas forcément que c'était important. Même si ça semblait normal sur le moment. Ces présences qui comptaient vraiment. Ces moments où avoir quelqu'un là ça change tout. Joyeux anniversaire [Prénom].
La présence dans les moments importants c'est tout,
— Quelqu'un qui se souvient de ces moments et de ce que ta présence représentait 💛` },
            { id: "a13_s4_006", angle: "Joyeux anniversaire [Prénom] on a eu des conversations de ouf à des heures de ouf.", body: `6. "Joyeux anniversaire [Prénom] on a eu des conversations de ouf à des heures de ouf."
Ces conversations. Tard. Très tard. Ou tôt. Sur des trucs profonds. Sur des trucs random. Sur des trucs qu'on dirait pas à d'autres. Ces conversations nocturnes qui changent des trucs. Qui clarifient des trucs. Qui créent des liens. Joyeux anniversaire [Prénom].
Les conversations nocturnes sont les meilleures conversations,
— Quelqu'un qui se souvient exactement de ce qu'on s'est dit ces nuits-là 🌙` },
            { id: "a13_s4_007", angle: "Joyeux anniversaire frr on a traversé des phases ensemble.", body: `7. "Joyeux anniversaire frr on a traversé des phases ensemble."
Ces phases. Les tiennes. Les miennes. Ces périodes où on était dans quelque chose. Dans un état. Dans une énergie. Et on était là l'un pour l'autre pendant. Sans forcément tout comprendre. Mais là. Joyeux anniversaire [Prénom].
Les phases traversées ensemble créent des liens solides,
— Quelqu'un qui était là pendant toutes tes phases et sera là pour les prochaines 🌊` },
            { id: "a13_s4_008", angle: "Joyeux anniversaire [Prénom] on a des inside jokes que personne comprend.", body: `8. "Joyeux anniversaire [Prénom] on a des inside jokes que personne comprend."
Ces blagues. Ces références. Ces trucs qu'on dit. Qui font rire que nous deux. Que les autres regardent avec des yeux de quelqu'un qui est à côté de la plaque. Qui demandent des explications impossibles à donner. Joyeux anniversaire [Prénom].
Les inside jokes sont le langage de l'amitié vraie,
— Quelqu'un qui pense à une inside joke précise là et retient son rire 😄` },
            { id: "a13_s4_009", angle: "Joyeux anniversaire frr on s\'est dit des trucs qu\'on dirait à personne d\'autre.", body: `9. "Joyeux anniversaire frr on s'est dit des trucs qu'on dirait à personne d'autre."
Ces trucs. Ces confidences. Ces pensées vraies. Ces trucs qu'on garde d'habitude. Qu'on sort pas facilement. Qui demandent de la confiance. Et on se les est dits. Et c'est resté là où ça devait rester. Joyeux anniversaire [Prénom].
Les confidences partagées sont sacrées,
— Quelqu'un qui garde tout ce qui a été dit et continuera de le garder 🤫` },
            { id: "a13_s4_010", angle: "Joyeux anniversaire [Prénom] on a fait des trucs qu\'on pourrait pas expliquer.", body: `10. "Joyeux anniversaire [Prénom] on a fait des trucs qu'on pourrait pas expliquer."
Ces trucs. Ces décisions. Ces moments. Ces aventures improbables. Qui semblaient logiques sur le moment. Qui seraient impossibles à justifier maintenant. Qui font partie de nos meilleures histoires quand même. Joyeux anniversaire [Prénom].
Les trucs inexplicables font les meilleures histoires,
— Quelqu'un qui pense à un truc précis là et assume totalement 😏` },
            { id: "a13_s4_011", angle: "Joyeux anniversaire frr on a géré des situations de stress ensemble.", body: `11. "Joyeux anniversaire frr on a géré des situations de stress ensemble."
Ces situations. Ces moments de stress. Ces trucs qui arrivaient. Et on gérait. Ensemble. Chacun avec son rôle. Chacun avec son apport. Et ça se réglait. Et après on soufflait. Et c'était bien d'avoir pas géré seul. Joyeux anniversaire [Prénom].
La gestion collective du stress c'est une compétence d'équipe,
— Quelqu'un qui préfère gérer les situations de stress avec toi que sans toi 🎯` },
            { id: "a13_s4_012", angle: "Joyeux anniversaire [Prénom] on a eu des moments trop calmes et c\'était bien aussi.", body: `12. "Joyeux anniversaire [Prénom] on a eu des moments trop calmes et c'était bien aussi."
Pas que les moments intenses. Les moments calmes aussi. Où on était là. Sans rien faire de spécial. Sans chercher à divertir ou être divertis. Juste présents. Ces moments-là ont leur valeur aussi. Joyeux anniversaire [Prénom].
Les moments calmes ensemble sont underrated,
— Quelqu'un qui apprécie les moments calmes avec toi autant que les intenses 🌿` },
            { id: "a13_s4_013", angle: "Joyeux anniversaire frr on a des trucs qu\'on raconte encore.", body: `13. "Joyeux anniversaire frr on a des trucs qu'on raconte encore."
Ces histoires. Qui reviennent. Qui ont leur place dans notre répertoire commun. Qu'on sort dans certaines conversations. Qui font rire ou sourire à chaque fois. Ces histoires qui font partie de ce qu'on est ensemble. Joyeux anniversaire [Prénom].
Le répertoire commun est riche et bien entretenu,
— Quelqu'un qui a sorti une de ces histoires récemment et qui a bien marché 🎭` },
            { id: "a13_s4_014", angle: "Joyeux anniversaire [Prénom] on a eu des désaccords et on s\'en est sortis.", body: `14. "Joyeux anniversaire [Prénom] on a eu des désaccords et on s'en est sortis."
Ces moments. Où on était pas d'accord. Où c'était tendu peut-être. Où quelque chose aurait pu casser. Et ça a pas cassé. Parce que le truc entre nous était plus solide que le désaccord. Joyeux anniversaire [Prénom].
La solidité face aux désaccords c'est la vraie preuve,
— Quelqu'un qui est content qu'on s'en soit sortis à chaque fois 🤝` },
            { id: "a13_s4_015", angle: "Joyeux anniversaire frr on a partagé des trucs que les autres ont pas vus.", body: `15. "Joyeux anniversaire frr on a partagé des trucs que les autres ont pas vus."
Ces coulisses. Ces moments non filtrés. Ces versions de nous que les autres connaissent pas. Ces faces cachées qu'on partage qu'avec certaines personnes. Ces accès exclusifs. Joyeux anniversaire [Prénom].
L'accès exclusif est un privilege rare,
— Quelqu'un qui apprécie d'avoir cet accès et le traite avec respect 👁️` },
            { id: "a13_s4_016", angle: "Joyeux anniversaire [Prénom] on a été là l\'un pour l\'autre quand c\'était pas facile.", body: `16. "Joyeux anniversaire [Prénom] on a été là l'un pour l'autre quand c'était pas facile."
Ces moments. Où c'était pas facile pour toi. Ou pour moi. Et l'autre était là. Pas forcément avec les bons mots. Pas forcément avec les solutions. Mais là. Présent. Et c'est ça qui comptait. Joyeux anniversaire [Prénom].
La présence dans les moments difficiles c'est tout ce qui compte,
— Quelqu'un qui était là et qui sera là pour les prochains moments difficiles aussi 💙` },
            { id: "a13_s4_017", angle: "Joyeux anniversaire frr on a eu des aventures random de ouf.", body: `17. "Joyeux anniversaire frr on a eu des aventures random de ouf."
Ces aventures. Qui partaient de rien. D'une décision spontanée. D'un pourquoi pas. D'un allez on y va. Et ça devenait quelque chose. Une histoire. Un souvenir. Un truc qu'on raconte. Ces aventures random sont les meilleures. Joyeux anniversaire [Prénom].
Les aventures random sont supérieures aux aventures planifiées,
— Quelqu'un qui est partant pour la prochaine aventure random quand tu veux 🗺️` },
            { id: "a13_s4_018", angle: "Joyeux anniversaire [Prénom] on a grandi ensemble et c\'est pas rien.", body: `18. "Joyeux anniversaire [Prénom] on a grandi ensemble et c'est pas rien."
Grandir ensemble. Voir l'autre évoluer. Changer. Devenir plus soi. Être là pendant ces évolutions. Ces changements. Ces passages. Cette croissance parallèle et connectée. C'est quelque chose de rare. Joyeux anniversaire [Prénom].
Grandir ensemble crée un lien unique,
— Quelqu'un qui est fier de ce qu'on est devenus tous les deux 🌱` },
            { id: "a13_s4_019", angle: "Joyeux anniversaire frr nos trucs vécus font partie de qui je suis.", body: `19. "Joyeux anniversaire frr nos trucs vécus font partie de qui je suis."
Ces expériences. Ces moments. Ces conversations. Ces aventures. Ces fous rires. Ces trucs difficiles. Tout ça a contribué. À qui je suis maintenant. À comment je vois les choses. T'es dans ma construction. Joyeux anniversaire [Prénom].
La contribution à la construction de l'autre c'est le plus beau cadeau,
— Quelqu'un qui reconnaît ta contribution à qui il est et t'en est reconnaissant ❤️` },
            { id: "a13_s4_020", angle: "Joyeux anniversaire [Prénom] les meilleurs trucs qu\'on a vécu sont encore devant nous frr.", body: `20. "Joyeux anniversaire [Prénom] les meilleurs trucs qu'on a vécu sont encore devant nous frr."
C'est la conviction. Que ce qu'on a eu c'était bien. Et que ce qui vient c'est encore mieux. Que les meilleures aventures sont pas encore arrivées. Que les meilleurs fous rires sont pas encore là. Que le meilleur de nous deux ensemble c'est devant. Joyeux anniversaire [Prénom].
No cap les meilleurs trucs sont devant,
— Quelqu'un qui est là pour tous les trucs qui viennent et les attend avec impatience 🚀

On continue avec` },
          ],
        },
        {
          id: 'no_cap',
          label: "No cap t'assures",
          emoji: '⭐',
          messages: [
            { id: "a13_s5_001", angle: "Joyeux anniversaire [Prénom] no cap t\'assures sur tous les fronts.", body: `1. "Joyeux anniversaire [Prénom] no cap t'assures sur tous les fronts."
Tous les fronts. Sans exception. Le front de la vie quotidienne. Le front des trucs compliqués. Le front des journées de merde. Le front des moments où c'est trop. Sur tous ces fronts t'assures. No cap aucune exagération. Joyeux anniversaire [Prénom].
No cap total sur cette affirmation,
— Quelqu'un qui a observé tous les fronts et confirme le résultat 🔥` },
            { id: "a13_s5_002", angle: "Joyeux anniversaire frr t\'assures avec les gens que t\'aimes.", body: `2. "Joyeux anniversaire frr t'assures avec les gens que t'aimes."
Cette façon. D'être là. De prendre soin. De remarquer. De te souvenir. De faire des trucs pour les autres. Cette façon d'aimer les gens autour de toi. C'est pas donné à tout le monde. T'assures là-dessus vraiment. Joyeux anniversaire [Prénom].
L'assurance avec les gens qu'on aime c'est la plus importante,
— Quelqu'un qui bénéficie de cette façon d'être et l'apprécie énormément 💛` },
            { id: "a13_s5_003", angle: "Joyeux anniversaire [Prénom] t\'assures même quand c\'est dur.", body: `3. "Joyeux anniversaire [Prénom] t'assures même quand c'est dur."
Surtout quand c'est dur. C'est là que ça se voit vraiment. Quand les journées sont longues. Quand les trucs arrivent. Quand c'est compliqué. Et toi tu continues. Tu gères. Tu avances. T'assures même dans les moments de merde. Joyeux anniversaire [Prénom].
L'assurance dans les moments difficiles c'est la vraie,
— Quelqu'un qui t'a vu assurer dans des moments difficiles et en est impressionné 💪` },
            { id: "a13_s5_004", angle: "Joyeux anniversaire frr t\'assures avec ton attitude.", body: `4. "Joyeux anniversaire frr t'assures avec ton attitude."
Cette attitude. Cette façon d'aborder les trucs. De te présenter. D'être dans le monde. Cette posture. Cette énergie. Cette façon d'exister. T'as une attitude qui assure. Qui dit quelque chose. Qui laisse une impression. Joyeux anniversaire [Prénom].
L'attitude qui assure ça se travaille pas c'est naturel,
— Quelqu'un qui remarque ton attitude depuis le début et la trouve top 😎` },
            { id: "a13_s5_005", angle: "Joyeux anniversaire [Prénom] no cap t\'assures avec ta créativité.", body: `5. "Joyeux anniversaire [Prénom] no cap t'assures avec ta créativité."
Ce truc créatif que t'as. Ces idées. Ces façons de faire les choses différemment. Ces solutions inattendues. Ces approches originales. Cette créativité qui sort naturellement. Qui est juste là. Qui est juste toi. Joyeux anniversaire [Prénom].
La créativité naturelle c'est un don rare,
— Quelqu'un qui utilise tes idées sans toujours le dire et qui avoue maintenant 🎨` },
            { id: "a13_s5_006", angle: "Joyeux anniversaire frr t\'assures avec ta loyauté.", body: `6. "Joyeux anniversaire frr t'assures avec ta loyauté."
Cette loyauté. Concrète. Ancrée dans des actes. Dans des présences. Dans des choix répétés. Dans des moments où t'aurais pu pas être là et t'étais là quand même. Cette loyauté-là est rare. T'assures là-dessus no cap. Joyeux anniversaire [Prénom].
La loyauté concrète c'est plus rare que les discours,
— Quelqu'un qui a bénéficié de cette loyauté et ne l'oublie pas 🤝` },
            { id: "a13_s5_007", angle: "Joyeux anniversaire [Prénom] t\'assures avec ton humour.", body: `7. "Joyeux anniversaire [Prénom] t'assures avec ton humour."
Cet humour. Qui arrive au bon moment. Qui désamorce les trucs. Qui rend les journées meilleures. Qui fait rire les bonnes personnes. Qui est juste le tien. Calibré à ta façon. Unique à ta personnalité. T'assures avec ça vraiment. Joyeux anniversaire [Prénom].
L'humour personnel c'est une signature,
— Quelqu'un qui rit à tes blagues même les moyennes et assume 😄` },
            { id: "a13_s5_008", angle: "Joyeux anniversaire frr t\'assures avec ta façon d\'être honnête.", body: `8. "Joyeux anniversaire frr t'assures avec ta façon d'être honnête."
Cette honnêteté. Qui dit les trucs. Qui ne tourne pas autour. Qui répond vraiment quand on demande vraiment. Cette franchise. Calibrée. Pas brutale. Juste vraie. T'assures avec ça et c'est précieux. Joyeux anniversaire [Prénom].
L'honnêteté calibrée c'est un équilibre difficile à trouver,
— Quelqu'un qui préfère ta vérité aux mensonges confortables des autres 💎` },
            { id: "a13_s5_009", angle: "Joyeux anniversaire [Prénom] no cap t\'assures avec ta présence.", body: `9. "Joyeux anniversaire [Prénom] no cap t'assures avec ta présence."
Cette présence. Quand t'es là t'es vraiment là. Pas à moitié. Pas en train de penser à autre chose. Vraiment là. Attentif. Présent. Cette qualité de présence. C'est rare. C'est toi. T'assures avec ça vraiment. Joyeux anniversaire [Prénom].
La présence vraie c'est le cadeau le plus rare,
— Quelqu'un qui se sent vraiment vu quand t'es là et l'apprécie 👁️` },
            { id: "a13_s5_010", angle: "Joyeux anniversaire frr t\'assures avec ta résilience.", body: `10. "Joyeux anniversaire frr t'assures avec ta résilience."
Cette façon de rebondir. De reprendre. De pas rester à terre trop longtemps. De trouver comment continuer. De ressortir de l'autre côté des trucs difficiles. Cette résilience. Elle est réelle. Elle est tienne. T'assures là-dessus no cap. Joyeux anniversaire [Prénom].
La résilience c'est la compétence la plus utile,
— Quelqu'un qui t'a vu rebondir plusieurs fois et est à chaque fois impressionné 🏀` },
            { id: "a13_s5_011", angle: "Joyeux anniversaire [Prénom] t\'assures avec ta curiosité.", body: `11. "Joyeux anniversaire [Prénom] t'assures avec ta curiosité."
Cette curiosité. Pour les trucs. Pour les gens. Pour les idées. Cette façon de vouloir comprendre. D'aller chercher. De pas rester en surface. D'être intéressé par le monde. Cette curiosité-là elle enrichit tout. Joyeux anniversaire [Prénom].
La curiosité authentique c'est rare et précieux,
— Quelqu'un qui apprécie tes questions et les trouve toujours intéressantes 🔍` },
            { id: "a13_s5_012", angle: "Joyeux anniversaire frr t\'assures avec ta générosité.", body: `12. "Joyeux anniversaire frr t'assures avec ta générosité."
Cette générosité. En temps. En énergie. En attention. En présence. En trucs concrets aussi. Cette façon de donner sans compter tout le temps. Sans attendre en retour. Sans faire le calcul. T'assures avec ça vraiment. Joyeux anniversaire [Prénom].
La générosité sans calcul c'est la vraie générosité,
— Quelqu'un qui a reçu cette générosité et ne l'oublie pas 🤲` },
            { id: "a13_s5_013", angle: "Joyeux anniversaire [Prénom] no cap t\'assures avec ta façon de gérer le stress.", body: `13. "Joyeux anniversaire [Prénom] no cap t'assures avec ta façon de gérer le stress."
Ces moments de stress. Ces trucs qui arrivent. Ces situations tendues. Et toi tu gères. Pas parfaitement toujours. Mais tu gères. Tu trouves comment. Tu passes à travers. T'assures avec ça vraiment. Joyeux anniversaire [Prénom].
La gestion du stress c'est une compétence de vie,
— Quelqu'un qui observe ta technique et essaie de l'appliquer 🎯` },
            { id: "a13_s5_014", angle: "Joyeux anniversaire frr t\'assures avec ta façon d\'écouter.", body: `14. "Joyeux anniversaire frr t'assures avec ta façon d'écouter."
Cette écoute. Vraie. Qui entend ce qui est dit et ce qui est pas dit. Qui retient. Qui répond à ce qui a vraiment été dit. Cette qualité rare d'être vraiment écouté par toi. T'assures avec ça no cap. Joyeux anniversaire [Prénom].
L'écoute vraie c'est un cadeau qu'on donne rarement,
— Quelqu'un qui se sent toujours vraiment écouté par toi et en est reconnaissant 👂` },
            { id: "a13_s5_015", angle: "Joyeux anniversaire [Prénom] t\'assures avec ton ambition.", body: `15. "Joyeux anniversaire [Prénom] t'assures avec ton ambition."
Cette ambition. Ces trucs que tu veux. Ces objectifs. Ces directions. Cette façon d'avoir des envies et d'aller vers. Cette énergie orientée vers quelque chose. Cette ambition qui dit que tu te vois quelque part. Joyeux anniversaire [Prénom].
L'ambition qui sait où elle va c'est la meilleure,
— Quelqu'un qui croit en tes objectifs et sera là pour les célébrer avec toi 🚀` },
            { id: "a13_s5_016", angle: "Joyeux anniversaire frr no cap t\'assures avec ta façon d\'assumer qui tu es.", body: `16. "Joyeux anniversaire frr no cap t'assures avec ta façon d'assumer qui tu es."
Cette façon. D'être toi. Sans t'excuser. Sans te diminuer. Sans jouer un rôle pour les autres. Cette façon d'assumer ta personnalité. Tes trucs. Tes façons. T'assures avec ça énormément. Joyeux anniversaire [Prénom].
S'assumer complètement c'est le travail d'une vie,
— Quelqu'un qui trouve que tu fais ce travail-là vraiment bien 🌟` },
            { id: "a13_s5_017", angle: "Joyeux anniversaire [Prénom] t\'assures avec ta mémoire des gens.", body: `17. "Joyeux anniversaire [Prénom] t'assures avec ta mémoire des gens."
Cette mémoire. Des détails. Des trucs que les gens disent. Des situations. Des prénoms. Des préférences. Cette façon de se souvenir qui dit que les gens comptent pour toi. Que tu les écoutes vraiment. Joyeux anniversaire [Prénom].
La mémoire des gens c'est une forme d'amour concrète,
— Quelqu'un qui a été surpris par ta mémoire de ses détails et a trouvé ça touchant 🧠` },
            { id: "a13_s5_018", angle: "Joyeux anniversaire frr t\'assures avec ton énergie positive.", body: `18. "Joyeux anniversaire frr t'assures avec ton énergie positive."
Cette énergie. Qui est là. Qui influence l'ambiance. Qui rend les trucs mieux. Qui fait que les gens autour de toi vont mieux. Cette énergie positive qui n'est pas forcée. Qui est naturelle. Qui est toi. Joyeux anniversaire [Prénom].
L'énergie positive naturelle c'est un don rare,
— Quelqu'un qui recharge grâce à ton énergie et t'en est reconnaissant ⚡` },
            { id: "a13_s5_019", angle: "Joyeux anniversaire [Prénom] no cap t\'assures avec ta façon de faire rire.", body: `19. "Joyeux anniversaire [Prénom] no cap t'assures avec ta façon de faire rire."
Ce talent. De trouver le drôle dans les trucs. De le partager. De faire rire les gens autour de toi. Cette façon de rendre les journées plus légères. Les moments plus fun. Les situations plus supportables. T'assures avec ça vraiment. Joyeux anniversaire [Prénom].
Faire rire les gens c'est un superpouvoir,
— Quelqu'un qui rit grâce à toi régulièrement et l'apprécie énormément 😂` },
            { id: "a13_s5_020", angle: "Joyeux anniversaire frr no cap t\'assures et tout le monde le sait.", body: `20. "Joyeux anniversaire frr no cap t'assures et tout le monde le sait."
Pas juste moi. Tout le monde. Les gens autour de toi. Ceux qui te connaissent bien. Ceux qui te connaissent moins. Ils voient. Ils sentent. Ils savent. Que t'assures. Que t'es quelqu'un. Que ta présence compte. Joyeux anniversaire [Prénom].
Le consensus est universel et no cap,
— Quelqu'un qui fait partie du consensus et le confirme aujourd'hui ❤️

On finit le niveau ados avec` },
          ],
        },
        {
          id: 'move',
          label: "C'est pas le move mais on t'aime",
          emoji: '💛',
          messages: [
            { id: "a13_s6_001", angle: "Joyeux anniversaire [Prénom] t\'as fait des moves discutables et on t\'aime quand même.", body: `1. "Joyeux anniversaire [Prénom] t'as fait des moves discutables et on t'aime quand même."
Ces moves. Ces décisions. Ces trucs que t'as faits. Que personne avait demandé. Que tout le monde regardait avec des yeux ronds. Qui semblaient pas le move sur le moment. Et peut-être que c'était pas le move. Mais t'étais toi. Et on t'aime pour ça. Joyeux anniversaire [Prénom].
Les moves discutables font partie du package et le package est aimé,
— Quelqu'un qui a regardé certains de ces moves avec des yeux ronds et qui est encore là 👀` },
            { id: "a13_s6_002", angle: "Joyeux anniversaire frr tes décisions sont parfois chelou mais c\'est toi.", body: `2. "Joyeux anniversaire frr tes décisions sont parfois chelou mais c'est toi."
Ces décisions. Qui arrivent. Qui surprennent. Qui font dire wsh vraiment. Qui ont leur logique interne que toi seul comprends. Et on comprend pas toujours. Mais on accepte. Parce que c'est toi. Et toi c'est le deal. Joyeux anniversaire [Prénom].
Le deal inclut les décisions chelou et on a signé,
— Quelqu'un qui a accepté le deal complet depuis le début 🤝` },
            { id: "a13_s6_003", angle: "Joyeux anniversaire [Prénom] t\'as ghosté des gens et on t\'aime quand même.", body: `3. "Joyeux anniversaire [Prénom] t'as ghosté des gens et on t'aime quand même."
Ces moments. Où tu répondais plus. Où tu disparaissais. Où les messages restaient sans réponse pendant des durées variables. C'est pas le move. On est d'accord. Mais t'es là maintenant. Et on t'aime. Joyeux anniversaire [Prénom].
Le ghosting est noté mais pardonné dans le cadre de l'amour inconditionnel,
— Quelqu'un qui a été ghosté une ou deux fois et a survécu 👻` },
            { id: "a13_s6_004", angle: "Joyeux anniversaire frr t\'as eu des phases de ouf et on a tenu.", body: `4. "Joyeux anniversaire frr t'as eu des phases de ouf et on a tenu."
Ces phases. Ces périodes où t'étais dans quelque chose d'intense. Une obsession. Une énergie particulière. Un truc qui prenait toute la place. C'était beaucoup parfois. Mais on a tenu. Parce que les phases passent et toi tu restes. Joyeux anniversaire [Prénom].
Les phases passent et l'amitié reste c'est prouvé,
— Quelqu'un qui a traversé plusieurs de tes phases et attend la prochaine 🌊` },
            { id: "a13_s6_005", angle: "Joyeux anniversaire [Prénom] t\'as pris des risques chelou et on t\'a soutenu.", body: `5. "Joyeux anniversaire [Prénom] t'as pris des risques chelou et on t'a soutenu."
Ces risques. Ces trucs hasardeux. Ces décisions un peu folles. Ces paris sur l'avenir. Certains ont marché. D'autres moins. Mais tu les as pris. Et on était là. Avant pendant après. Joyeux anniversaire [Prénom].
Le soutien dans les risques chelou c'est l'amitié vraie,
— Quelqu'un qui était là avant pendant et après chaque risque pris 🎲` },
            { id: "a13_s6_006", angle: "Joyeux anniversaire frr t\'as dit des trucs sans filtre et on t\'aime quand même.", body: `6. "Joyeux anniversaire frr t'as dit des trucs sans filtre et on t'aime quand même."
Ces trucs. Dits sans réfléchir. Sans filtrer. Sans calculer l'effet. Ces sorties directes. Ces vérités non demandées. Ces opinions exprimées avec une liberté totale. C'est pas toujours le move. Mais c'est authentic. Joyeux anniversaire [Prénom].
Le sans filtre est apprécié même quand c'est beaucoup,
— Quelqu'un qui a reçu quelques vérités non demandées et en est globalement reconnaissant 🎤` },
            { id: "a13_s6_007", angle: "Joyeux anniversaire [Prénom] t\'as annulé des plans au dernier moment et on t\'a pardonné.", body: `7. "Joyeux anniversaire [Prénom] t'as annulé des plans au dernier moment et on t'a pardonné."
Ces annulations. Ces désistements de dernière minute. Ces on peut pas finalement. Ces trucs qui arrivaient juste avant. C'est pas le move clairement. Mais le pardon était là. Parce que t'es toi. Et toi ça vaut le pardon. Joyeux anniversaire [Prénom].
Le pardon des annulations est accordé dans le cadre de l'amour inconditionnel,
— Quelqu'un qui a réorganisé ses soirées plusieurs fois à cause de toi et recommencerait 📅` },
            { id: "a13_s6_008", angle: "Joyeux anniversaire frr t\'as eu des opinions de ouf qu\'on partageait pas.", body: `8. "Joyeux anniversaire frr t'as eu des opinions de ouf qu'on partageait pas."
Ces opinions. Fortes. Défendues avec conviction. Sur des trucs où on était pas d'accord. Où on voyait différemment. Où le débat était réel. Et on a débattu. Et on est restés. Parce que les opinions passent mais les liens restent. Joyeux anniversaire [Prénom].
Les désaccords d'opinions renforcent les liens quand ils sont bien gérés,
— Quelqu'un qui a débattu avec toi plusieurs fois et apprécie que ça tienne malgré tout 💬` },
            { id: "a13_s6_009", angle: "Joyeux anniversaire [Prénom] t\'as fait confiance à des gens chelou et on t\'a quand même soutenu.", body: `9. "Joyeux anniversaire [Prénom] t'as fait confiance à des gens chelou et on t'a quand même soutenu."
Ces personnes. À qui t'as fait confiance. Qu'on regardait avec des doutes. Qui ont parfois confirmé nos doutes. Et on t'a soutenu quand même. Avant pendant et après. Sans dire on t'avait prévenu. Presque jamais. Joyeux anniversaire [Prénom].
Le soutien sans je t'avais prévenu c'est l'amitié de qualité,
— Quelqu'un qui a retenu je t'avais prévenu au moins trois fois et en est fier 🤐` },
            { id: "a13_s6_010", angle: "Joyeux anniversaire frr t\'as été imprévisible et on a adoré.", body: `10. "Joyeux anniversaire frr t'as été imprévisible et on a adoré."
Cette imprévisibilité. Ces trucs qu'on voyait pas venir. Ces décisions surprises. Ces changements de direction. Ces moments où on savait pas ce qui allait se passer. Et finalement c'était souvent mieux que ce qu'on avait prévu. Joyeux anniversaire [Prénom].
L'imprévisibilité positive c'est un talent rare,
— Quelqu'un qui préfère ton imprévisible aux gens trop prévisibles 🎲` },
            { id: "a13_s6_011", angle: "Joyeux anniversaire [Prénom] t\'as eu des coups de tête et on a géré.", body: `11. "Joyeux anniversaire [Prénom] t'as eu des coups de tête et on a géré."
Ces coups de tête. Ces décisions soudaines. Ces envies immédiates. Ces trucs qui arrivaient sans prévenir. Et on gérait. Avec toi. Parfois pour toi. Parfois malgré toi. Mais on gérait. Joyeux anniversaire [Prénom].
La gestion des coups de tête c'est une spécialité développée grâce à toi,
— Quelqu'un qui est devenu expert en gestion de tes coups de tête 🎯` },
            { id: "a13_s6_012", angle: "Joyeux anniversaire frr t\'as pas toujours été disponible et on comprend.", body: `12. "Joyeux anniversaire frr t'as pas toujours été disponible et on comprend."
Ces moments. Où t'étais dans ta bulle. Où t'avais besoin de ton espace. Où les réponses tardaient. Où la disponibilité était limitée. On comprend. T'as droit à ta vie. T'as droit à tes moments. Joyeux anniversaire [Prénom].
La compréhension de la non-disponibilité c'est le respect de l'autre,
— Quelqu'un qui respecte ta bulle et attend que tu en sortes 🫧` },
            { id: "a13_s6_013", angle: "Joyeux anniversaire [Prénom] t\'as dramatisé des trucs et on a écouté quand même.", body: `13. "Joyeux anniversaire [Prénom] t'as dramatisé des trucs et on a écouté quand même."
Ces trucs. Ces situations. Qui devenaient des crises dans le récit. Qui prenaient des proportions. Qu'on écoutait avec attention. Même quand on savait que le pic allait passer. Même quand on calculait le délai de retour à la normale. On écoutait. Joyeux anniversaire [Prénom].
L'écoute pendant les pics de dramatisation c'est de l'amitié avancée,
— Quelqu'un qui a chronométré tes pics et sait qu'ils durent exactement vingt-deux minutes 🎢` },
            { id: "a13_s6_014", angle: "Joyeux anniversaire frr t\'as changé d\'avis souvent et on s\'est adaptés.", body: `14. "Joyeux anniversaire frr t'as changé d'avis souvent et on s'est adaptés."
Ces changements. Ces revirements. Ces nouvelles positions. Ces opinions révisées. Ces plans modifiés. Ces directions changées. Et on s'adaptait. Parce que c'est toi. Et toi ça vaut l'adaptation. Joyeux anniversaire [Prénom].
L'adaptation aux changements d'avis fréquents c'est une compétence acquise grâce à toi,
— Quelqu'un qui s'est adapté tellement de fois que c'est devenu automatique 🔄` },
            { id: "a13_s6_015", angle: "Joyeux anniversaire [Prénom] t\'as eu des moments de flemme intense et on t\'a pas jugé.", body: `15. "Joyeux anniversaire [Prénom] t'as eu des moments de flemme intense et on t'a pas jugé."
Ces moments. Ces journées. Ces périodes. Où la flemme prenait tout. Où bouger demandait un effort surhumain. Où les projets attendaient. Où le canapé gagnait. On t'a pas jugé. On a compris. Joyeux anniversaire [Prénom].
La flemme intense est une condition humaine universelle,
— Quelqu'un qui a eu ses propres moments de flemme intense et ne jette pas la première pierre 🛋️` },
            { id: "a13_s6_016", angle: "Joyeux anniversaire frr t\'as eu tort parfois et on t\'a pas frotté le nez dedans.", body: `16. "Joyeux anniversaire frr t'as eu tort parfois et on t'a pas frotté le nez dedans."
Ces fois. Où t'avais tort. Où on avait raison. Où on aurait pu dire je t'avais dit. Où on s'est retenus. Parce que frotter le nez dedans c'est pas le move. Parce que t'es humain. Parce qu'on t'aime. Joyeux anniversaire [Prénom].
Ne pas frotter le nez dedans c'est l'amitié mature,
— Quelqu'un qui a retenu je t'avais dit plusieurs fois et en est très fier 🤐` },
            { id: "a13_s6_017", angle: "Joyeux anniversaire [Prénom] t\'as oversharé parfois et c\'est resté entre nous.", body: `17. "Joyeux anniversaire [Prénom] t'as oversharé parfois et c'est resté entre nous."
Ces moments. Où tu partageais beaucoup. Où les détails étaient nombreux. Où les infos dépassaient ce qu'on avait demandé. Tout ça est resté là où ça devait rester. Joyeux anniversaire [Prénom].
L'oversharing reçu avec discrétion c'est un service précieux,
— Quelqu'un qui a tout gardé et continuera de tout garder 🤫` },
            { id: "a13_s6_018", angle: "Joyeux anniversaire frr t\'as eu des mauvais jours et on était là.", body: `18. "Joyeux anniversaire frr t'as eu des mauvais jours et on était là."
Ces mauvais jours. Ces journées de merde. Ces moments où tout allait pas. Où t'étais pas à ton meilleur. Où c'était difficile. Et on était là. Sans jugement. Sans attendre que t'ailles mieux pour être là. Juste là. Joyeux anniversaire [Prénom].
Être là les mauvais jours c'est la définition de l'amitié vraie,
— Quelqu'un qui était là les mauvais jours et sera là pour les prochains aussi 💙` },
            { id: "a13_s6_019", angle: "Joyeux anniversaire [Prénom] t\'as eu des trucs compliqués et on a tenu ensemble.", body: `19. "Joyeux anniversaire [Prénom] t'as eu des trucs compliqués et on a tenu ensemble."
Ces trucs compliqués. Ces périodes. Ces situations. Ces moments où c'était lourd. Où c'était difficile à porter. Et on tenait ensemble. Chacun de son côté mais connectés. Et on s'en est sortis. Joyeux anniversaire [Prénom].
Tenir ensemble dans les trucs compliqués c'est ce qui crée les vrais liens,
— Quelqu'un qui a tenu avec toi et recommencerait sans hésiter 🌊` },
            { id: "a13_s6_020", angle: "Joyeux anniversaire frr c\'est pas toujours le move mais t\'es mon move préféré.", body: `20. "Joyeux anniversaire frr c'est pas toujours le move mais t'es mon move préféré."
Avec tout. Avec les décisions chelou. Les phases intenses. Les annulations. Les changements d'avis. Les mauvais jours. Le package complet. T'es mon move préféré. No cap. Joyeux anniversaire [Prénom].
Le move préféré c'est toi et c'est définitif,
— Quelqu'un qui a choisi ce move et ne le regrette absolument pas ❤️` },
          ],
        },
      ],
    },
    {
      id: 'young_adult',
      label: '18-25 ans',
      minAge: 18,
      maxAge: 25,
      subCategories: [
        {
          id: 'tu_geres',
          label: "Tu gères",
          emoji: '🙌',
          messages: [
            { id: "a25_s1_001", angle: "Joyeux anniversaire. Lowkey t\'es une des personnes qui gère le mieux que je connais.", body: `1. "Joyeux anniversaire. Lowkey t'es une des personnes qui gère le mieux que je connais."
Pas highkey. Lowkey. Discrètement. Sans faire de bruit. Sans chercher la reconnaissance. Tu gères les trucs. Les petits. Les grands. Les inattendus. Les prévisibles. Avec une efficacité qui impressionne ceux qui regardent de près. Joyeux anniversaire [Prénom].
Lowkey impressionné depuis longtemps,
— Quelqu'un qui regarde de près et confirme le niveau de gestion 🎯` },
            { id: "a25_s1_002", angle: "Joyeux anniversaire [Prénom] franchement t\'assures et tout le monde le sait.", body: `2. "Joyeux anniversaire [Prénom] franchement t'assures et tout le monde le sait."
Franchement. Sans détour. Sans enrobage. T'assures. C'est un fait établi. Documenté. Confirmé par les gens autour de toi. Par les situations traversées. Par les trucs gérés. T'assures et c'est pas une opinion c'est un constat. Joyeux anniversaire [Prénom].
Le constat est objectif et partagé,
— Quelqu'un qui fait partie des témoins et confirme le constat 🔥` },
            { id: "a25_s1_003", angle: "Joyeux anniversaire t\'as une façon de gérer les trucs qui est vraiment impressionnante.", body: `3. "Joyeux anniversaire t'as une façon de gérer les trucs qui est vraiment impressionnante."
Cette façon. Spécifique. Qui est la tienne. Qui prend les situations. Qui les traite. Qui trouve des sorties. Qui avance. Sans se bloquer trop longtemps. Sans rester dans le problème. Cette façon de gérer qui est juste au-dessus de la moyenne. Joyeux anniversaire [Prénom].
La façon de gérer au-dessus de la moyenne mérite d'être nommée,
— Quelqu'un qui a observé cette façon en action plusieurs fois et valide 💪` },
            { id: "a25_s1_004", angle: "Joyeux anniversaire [Prénom] tu gères ta vie avec une cohérence que j\'admire.", body: `4. "Joyeux anniversaire [Prénom] tu gères ta vie avec une cohérence que j'admire."
Cette cohérence. Entre ce que tu dis et ce que tu fais. Entre ce que tu veux et ce que tu cherches. Entre tes valeurs et tes actes. Cette ligne directrice. Pas parfaite. Mais cohérente. Et cette cohérence-là elle est rare. Joyeux anniversaire [Prénom].
La cohérence entre valeurs et actes c'est un travail quotidien,
— Quelqu'un qui observe cette cohérence et essaie de s'en inspirer 🧭` },
            { id: "a25_s1_005", angle: "Joyeux anniversaire t\'as géré une année entière et ça se voit pas forcément mais c\'est énorme.", body: `5. "Joyeux anniversaire t'as géré une année entière et ça se voit pas forcément mais c'est énorme."
Une année. Avec tout ce qu'elle contenait. Les trucs visibles. Les trucs invisibles. Les charges que personne voit. Les efforts que personne mesure. Les journées qui coûtaient plus que les autres. Et t'as géré tout ça. Joyeux anniversaire [Prénom].
Les charges invisibles gérées méritent autant de reconnaissance que les visibles,
— Quelqu'un qui voit les trucs invisibles et les reconnaît aujourd'hui 🌟` },
            { id: "a25_s1_006", angle: "Joyeux anniversaire [Prénom] tu gères les relations avec une intelligence émotionnelle de ouf.", body: `6. "Joyeux anniversaire [Prénom] tu gères les relations avec une intelligence émotionnelle de ouf."
Cette intelligence émotionnelle. Cette façon de lire les gens. De comprendre les dynamiques. De naviguer les relations. De dire les bons trucs au bon moment. De savoir quand se taire. Cette compétence rare. Joyeux anniversaire [Prénom].
L'intelligence émotionnelle c'est la compétence la plus underrated,
— Quelqu'un qui bénéficie de cette intelligence émotionnelle et l'apprécie énormément 🧠` },
            { id: "a25_s1_007", angle: "Joyeux anniversaire t\'as une résilience qui force le respect franchement.", body: `7. "Joyeux anniversaire t'as une résilience qui force le respect franchement."
Franchement. Cette résilience. Ces trucs que t'as traversés. Ces fois où c'était difficile. Ces moments où t'aurais pu rester à terre. Et tu t'es relevé. Chaque fois. Avec plus ou moins de facilité. Mais tu t'es relevé. Joyeux anniversaire [Prénom].
La résilience répétée c'est de la force pure,
— Quelqu'un qui t'a vu te relever et en est à chaque fois impressionné 🏆` },
            { id: "a25_s1_008", angle: "Joyeux anniversaire [Prénom] lowkey tu inspires des gens sans le savoir.", body: `8. "Joyeux anniversaire [Prénom] lowkey tu inspires des gens sans le savoir."
Sans le chercher. Sans le voir. Sans que personne te le dise forcément. Tu inspires. Par tes choix. Par ta façon d'être. Par ce que tu traverses et comment tu le traverses. Ces gens qui te regardent et qui ajustent quelque chose en eux. Joyeux anniversaire [Prénom].
Inspirer sans le savoir c'est la forme la plus pure d'influence,
— Quelqu'un que tu as inspiré et qui te le dit aujourd'hui 💛` },
            { id: "a25_s1_009", angle: "Joyeux anniversaire t\'as une façon de rester toi-même sous pression qui est rare.", body: `9. "Joyeux anniversaire t'as une façon de rester toi-même sous pression qui est rare."
Sous pression. Quand les trucs arrivent. Quand les gens attendent quelque chose. Quand c'est compliqué. Toi tu restes toi. T'adaptes ta réponse mais pas ta personne. Cette stabilité d'identité sous pression. C'est une force. Joyeux anniversaire [Prénom].
Rester soi sous pression c'est le vrai test du caractère,
— Quelqu'un qui t'a vu sous pression et confirme que tu restes toi 🌊` },
            { id: "a25_s1_010", angle: "Joyeux anniversaire [Prénom] tu gères le fait d\'être humain avec grâce.", body: `10. "Joyeux anniversaire [Prénom] tu gères le fait d'être humain avec grâce."
Être humain c'est compliqué. Les erreurs. Les doutes. Les moments de faiblesse. Les trucs pas parfaits. Toi tu gères ça. Tu t'acceptes dans ton imperfection. Tu continues. Tu te corriges. Tu avances. Cette gestion de l'humanité avec grâce. Joyeux anniversaire [Prénom].
Gérer son humanité avec grâce c'est le travail d'une vie,
— Quelqu'un qui pense que tu fais ce travail vraiment bien 🌸` },
            { id: "a25_s1_011", angle: "Joyeux anniversaire t\'as une clarté sur ce que tu veux qui impressionne.", body: `11. "Joyeux anniversaire t'as une clarté sur ce que tu veux qui impressionne."
Cette clarté. Sur tes directions. Sur ce qui compte. Sur ce que tu refuses. Sur ce que tu cherches. Cette façon de savoir assez bien où tu vas. Même quand c'est flou parfois. Le cap est là. Joyeux anniversaire [Prénom].
La clarté sur ce qu'on veut c'est rare à tout âge,
— Quelqu'un qui cherche encore cette clarté et t'envie un peu sur ce point 🧭` },
            { id: "a25_s1_012", angle: "Joyeux anniversaire [Prénom] tu gères le quotidien avec une efficacité silencieuse.", body: `12. "Joyeux anniversaire [Prénom] tu gères le quotidien avec une efficacité silencieuse."
Silencieuse. Sans faire de bruit. Sans annoncer. Sans attendre des félicitations. Le quotidien est géré. Les trucs sont faits. Les responsabilités sont tenues. Cette efficacité discrète qui fait que tout tourne. Joyeux anniversaire [Prénom].
L'efficacité silencieuse est la plus sous-estimée,
— Quelqu'un qui a remarqué cette efficacité et choisit de la nommer aujourd'hui 👁️` },
            { id: "a25_s1_013", angle: "Joyeux anniversaire tu navigues les trucs compliqués avec une intelligence que j\'admire.", body: `13. "Joyeux anniversaire tu navigues les trucs compliqués avec une intelligence que j'admire."
Ces trucs compliqués. Ces situations. Ces dynamiques. Ces moments où la bonne réponse n'est pas évidente. Et toi tu navigues. Tu trouves comment. Tu avances dans le flou. Cette navigation dans la complexité. Joyeux anniversaire [Prénom].
Naviguer dans la complexité sans se perdre c'est une compétence rare,
— Quelqu'un qui t'observe naviguer et apprend en regardant 🗺️` },
            { id: "a25_s1_014", angle: "Joyeux anniversaire [Prénom] tu gères la pression sociale avec une aisance qui me fascine.", body: `14. "Joyeux anniversaire [Prénom] tu gères la pression sociale avec une aisance qui me fascine."
Cette pression. Ce que les autres attendent. Ce qu'on est censé faire ou être. Et toi tu navigues ça. Tu fais ta chose. Tu restes dans ton axe. Sans te laisser totalement dévorer par les attentes externes. Joyeux anniversaire [Prénom].
Résister à la pression sociale sans s'isoler c'est l'équilibre parfait,
— Quelqu'un qui essaie de trouver le même équilibre et n'y est pas encore totalement 🌿` },
            { id: "a25_s1_015", angle: "Joyeux anniversaire t\'as une façon de prendre soin des gens autour de toi qui est touchante.", body: `15. "Joyeux anniversaire t'as une façon de prendre soin des gens autour de toi qui est touchante."
Cette façon. Ces gestes. Ces attentions. Ces vérifications discrètes. Ces présences aux bons moments. Cette façon de prendre soin sans en faire toute une histoire. Joyeux anniversaire [Prénom].
Prendre soin sans en faire toute une histoire c'est la forme la plus pure,
— Quelqu'un qui a bénéficié de ce soin et te remercie aujourd'hui 🤲` },
            { id: "a25_s1_016", angle: "Joyeux anniversaire [Prénom] tu gères les transitions de vie avec plus de grâce que la plupart.", body: `16. "Joyeux anniversaire [Prénom] tu gères les transitions de vie avec plus de grâce que la plupart."
Ces transitions. Ces changements. Ces passages d'une étape à une autre. Ces moments où tout se réorganise. Et toi tu traverses ça. Pas sans difficulté toujours. Mais avec grâce. Avec adaptation. Joyeux anniversaire [Prénom].
Les transitions de vie gracieuses c'est un art,
— Quelqu'un qui t'a vu traverser des transitions et a trouvé ça inspirant 🦋` },
            { id: "a25_s1_017", angle: "Joyeux anniversaire t\'as une capacité à apprendre de tes expériences qui est réelle.", body: `17. "Joyeux anniversaire t'as une capacité à apprendre de tes expériences qui est réelle."
Ces expériences. Ces trucs traversés. Et les leçons tirées. Pas toujours immédiatement. Pas toujours facilement. Mais tirées. Et appliquées. Cette capacité de transformer l'expérience en sagesse. Joyeux anniversaire [Prénom].
Transformer l'expérience en sagesse c'est le vrai apprentissage,
— Quelqu'un qui observe cette transformation et la trouve précieuse 📚` },
            { id: "a25_s1_018", angle: "Joyeux anniversaire [Prénom] tu gères le fait de pas tout contrôler avec maturité.", body: `18. "Joyeux anniversaire [Prénom] tu gères le fait de pas tout contrôler avec maturité."
Cette maturité. Face à l'incontrôlable. Ces trucs qu'on peut pas maîtriser. Ces situations qu'on peut pas forcer. Et toi tu navigues ça. Tu lâches ce qui doit être lâché. Tu tiens ce qui peut être tenu. Joyeux anniversaire [Prénom].
Distinguer ce qu'on contrôle de ce qu'on contrôle pas c'est de la sagesse,
— Quelqu'un qui apprend encore à faire cette distinction et t'observe pour s'en inspirer ⚖️` },
            { id: "a25_s1_019", angle: "Joyeux anniversaire tu gères ta croissance personnelle avec honnêteté.", body: `19. "Joyeux anniversaire tu gères ta croissance personnelle avec honnêteté."
Cette honnêteté. Sur toi-même. Sur ce qui marche et ce qui marche pas. Sur les progrès et les régressions. Sur ce qu'il reste à faire. Cette façon honnête de te regarder et de continuer quand même. Joyeux anniversaire [Prénom].
L'honnêteté sur sa propre croissance c'est le premier pas,
— Quelqu'un qui apprécie cette honnêteté et essaie de l'appliquer à lui-même 🌱` },
            { id: "a25_s1_020", angle: "Joyeux anniversaire [Prénom] tu gères et c\'est suffisant comme raison de célébrer.", body: `20. "Joyeux anniversaire [Prénom] tu gères et c'est suffisant comme raison de célébrer."
Pas besoin de raisons extraordinaires. Pas besoin de grandes réalisations. T'as géré une année. T'as été toi. T'as avancé. T'as tenu. C'est suffisant. C'est même beaucoup. C'est la raison de célébrer aujourd'hui. Joyeux anniversaire [Prénom].
Gérer c'est suffisant et mérite d'être célébré,
— Quelqu'un qui célèbre ça aujourd'hui avec conviction ❤️

On continue avec` },
          ],
        },
        {
          id: 'chelou',
          label: "T'es chelou mais t'es mon chelou",
          emoji: '🌀',
          messages: [
            { id: "a25_s2_001", angle: "Joyeux anniversaire [Prénom] t\'as une personnalité qui demande un temps d\'adaptation et c\'est un compliment.", body: `1. "Joyeux anniversaire [Prénom] t'as une personnalité qui demande un temps d'adaptation et c'est un compliment."
Pas tout le monde te comprend immédiatement. Il faut du temps. De l'exposition. Une certaine ouverture d'esprit. Et ceux qui prennent ce temps découvrent quelque chose de rare. Quelque chose qui vaut largement l'adaptation. Joyeux anniversaire [Prénom].
Le temps d'adaptation est un investissement qui rapporte,
— Quelqu'un qui a pris ce temps et confirme que ça valait largement 🌟` },
            { id: "a25_s2_002", angle: "Joyeux anniversaire t\'as des façons de faire les choses qui sont juste les tiennes et c\'est parfait.", body: `2. "Joyeux anniversaire t'as des façons de faire les choses qui sont juste les tiennes et c'est parfait."
Ces façons. Développées au fil du temps. Qui ne ressemblent à personne d'autre. Qui ont leur logique interne. Qui donnent des résultats. Qui sont inefficaces selon les standards classiques et pourtant ça marche. Joyeux anniversaire [Prénom].
L'efficacité non conventionnelle est une forme d'intelligence,
— Quelqu'un qui a adopté certaines de tes façons sans l'admettre 🎯` },
            { id: "a25_s2_003", angle: "Joyeux anniversaire [Prénom] tu fonctionnes différemment et le monde est mieux pour ça.", body: `3. "Joyeux anniversaire [Prénom] tu fonctionnes différemment et le monde est mieux pour ça."
Différemment. Dans la façon de penser. De réagir. De voir les situations. De traiter l'information. Cette différence qui apporte quelque chose. Qui enrichit les conversations. Qui déplace les angles. Joyeux anniversaire [Prénom].
Fonctionner différemment c'est une contribution au monde,
— Quelqu'un qui a eu sa vision du monde élargie grâce à toi 🌍` },
            { id: "a25_s2_004", angle: "Joyeux anniversaire t\'as des contradictions et elles font partie de ce qui te rend intéressant.", body: `4. "Joyeux anniversaire t'as des contradictions et elles font partie de ce qui te rend intéressant."
Ces contradictions. Ces trucs qui semblent pas cohérents de l'extérieur. Qui tiennent ensemble seulement de l'intérieur. Cette complexité humaine. Ces multiples facettes qui coexistent. Cette richesse dans la contradiction. Joyeux anniversaire [Prénom].
Les contradictions sont le signe d'une personnalité riche,
— Quelqu'un qui a accepté tes contradictions et les trouve fascinantes 🌀` },
            { id: "a25_s2_005", angle: "Joyeux anniversaire [Prénom] tu vois le monde avec un filtre qui est juste différent du mien.", body: `5. "Joyeux anniversaire [Prénom] tu vois le monde avec un filtre qui est juste différent du mien."
Ce filtre. Cette façon de traiter la réalité. Ces lunettes particulières à travers lesquelles tu regardes les situations. Qui donnent des interprétations inattendues. Des conclusions surprenantes. Une lecture du monde enrichissante. Joyeux anniversaire [Prénom].
Les filtres différents donnent des images plus complètes,
— Quelqu'un qui emprunte ton filtre parfois pour voir les choses autrement 👓` },
            { id: "a25_s2_006", angle: "Joyeux anniversaire t\'as une énergie particulière qui prend du temps à apprécier pleinement.", body: `6. "Joyeux anniversaire t'as une énergie particulière qui prend du temps à apprécier pleinement."
Cette énergie. Qui n'est pas immédiatement lisible. Qui se dévoile progressivement. Qui a des niveaux. Des couches. Des aspects qu'on découvre au fil du temps. Et plus on la connaît plus on l'apprécie. Joyeux anniversaire [Prénom].
Les énergies qui se dévoilent progressivement sont les plus intéressantes,
— Quelqu'un qui en est encore à découvrir de nouvelles couches de ton énergie ⚡` },
            { id: "a25_s2_007", angle: "Joyeux anniversaire [Prénom] tes centres d\'intérêt sont un univers à part entière.", body: `7. "Joyeux anniversaire [Prénom] tes centres d'intérêt sont un univers à part entière."
Cet univers. Ces sujets. Ces passions. Ces domaines que tu maîtrises de façon inattendue. Cette profondeur dans des endroits insolites. Cette façon d'être expert de trucs que personne autour de toi connaît vraiment. Joyeux anniversaire [Prénom].
Les univers parallèles que certains maîtrisent enrichissent tout le monde,
— Quelqu'un qui a été introduit dans ton univers et en est ressorti différent 🔭` },
            { id: "a25_s2_008", angle: "Joyeux anniversaire t\'as une façon de communiquer qui est unique et efficace une fois qu\'on la comprend.", body: `8. "Joyeux anniversaire t'as une façon de communiquer qui est unique et efficace une fois qu'on la comprend."
Cette façon. Avec ses codes. Ses raccourcis. Ses implicites. Ses façons de dire les choses qui ne sont pas les façons standard. Et une fois qu'on comprend le code c'est d'une efficacité remarquable. Joyeux anniversaire [Prénom].
Les systèmes de communication custom sont plus précis que les standards,
— Quelqu'un qui parle couramment ton code et apprécie sa précision 🗣️` },
            { id: "a25_s2_009", angle: "Joyeux anniversaire [Prénom] tu traites l\'information différemment et ça donne des résultats inattendus.", body: `9. "Joyeux anniversaire [Prénom] tu traites l'information différemment et ça donne des résultats inattendus."
Ce traitement. Ces associations que tu fais. Ces connexions inattendues. Ces conclusions qui arrivent par des chemins que personne d'autre emprunterait. Et qui sont souvent plus intéressantes que les conclusions classiques. Joyeux anniversaire [Prénom].
Les chemins inattendus mènent parfois aux meilleures destinations,
— Quelqu'un qui a suivi tes chemins de pensée et découvert des endroits intéressants 🗺️` },
            { id: "a25_s2_010", angle: "Joyeux anniversaire t\'as des rituels et des habitudes chelou et ils font partie de ton charme.", body: `10. "Joyeux anniversaire t'as des rituels et des habitudes chelou et ils font partie de ton charme."
Ces rituels. Ces trucs que tu fais. Dans un ordre particulier. Avec une logique interne. Qui semblent bizarres de l'extérieur. Qui ont tout leur sens de l'intérieur. Ces habitudes qui constituent ta façon d'être dans le monde. Joyeux anniversaire [Prénom].
Les rituels personnels sont une forme d'identité,
— Quelqu'un qui a observé tes rituels avec curiosité et les a trouvés attachants 🌿` },
            { id: "a25_s2_011", angle: "Joyeux anniversaire [Prénom] t\'as des réactions émotionnelles inattendues et elles sont honnêtes.", body: `11. "Joyeux anniversaire [Prénom] t'as des réactions émotionnelles inattendues et elles sont honnêtes."
Ces réactions. Qui arrivent pas là où on les attend. Qui sont fortes sur des trucs qui semblent petits. Plus discrètes sur des trucs qui semblent grands. Qui ont leur propre carte émotionnelle. Qui sont vraies en tout cas. Joyeux anniversaire [Prénom].
Les réactions honnêtes valent mieux que les réactions performées,
— Quelqu'un qui préfère tes vraies réactions aux réactions attendues 💛` },
            { id: "a25_s2_012", angle: "Joyeux anniversaire t\'as une façon d\'aborder les problèmes qui déroute et qui marche.", body: `12. "Joyeux anniversaire t'as une façon d'aborder les problèmes qui déroute et qui marche."
Cette approche. Non linéaire peut-être. Non conventionnelle certainement. Qui prend les problèmes par des angles inattendus. Qui déroute ceux qui observent. Et qui arrive quand même à des solutions. Joyeux anniversaire [Prénom].
L'approche non conventionnelle des problèmes donne souvent les meilleures solutions,
— Quelqu'un qui a adopté ton approche sur quelques problèmes et confirme son efficacité 🔧` },
            { id: "a25_s2_013", angle: "Joyeux anniversaire [Prénom] tu t\'exprimes d\'une façon qui est juste la tienne et c\'est précieux.", body: `13. "Joyeux anniversaire [Prénom] tu t'exprimes d'une façon qui est juste la tienne et c'est précieux."
Cette façon. Avec ses mots. Ses formulations. Ses façons de dire les choses. Qui ne ressemble pas aux façons standard. Qui dit exactement ce que tu veux dire d'une façon que personne d'autre dirait. Cette voix propre. Joyeux anniversaire [Prénom].
Avoir sa propre voix c'est rare et précieux,
— Quelqu'un qui reconnaît ton expression entre mille et l'apprécie 🎤` },
            { id: "a25_s2_014", angle: "Joyeux anniversaire t\'as des besoins particuliers et tu les connais bien.", body: `14. "Joyeux anniversaire t'as des besoins particuliers et tu les connais bien."
Cette connaissance de toi-même. Ces besoins. Spécifiques. Parfois insolites. Que tu as identifiés. Que tu sais nommer. Que tu arrives à communiquer ou à gérer. Cette conscience de tes propres besoins particuliers. Joyeux anniversaire [Prénom].
Connaître ses besoins particuliers c'est une forme d'intelligence de soi,
— Quelqu'un qui essaie de mieux connaître ses propres besoins et t'observe pour s'inspirer 🧘` },
            { id: "a25_s2_015", angle: "Joyeux anniversaire [Prénom] t\'as une sensibilité particulière qui enrichit tout ce que tu touches.", body: `15. "Joyeux anniversaire [Prénom] t'as une sensibilité particulière qui enrichit tout ce que tu touches."
Cette sensibilité. Qui capte des choses. Qui ressent des nuances. Qui perçoit ce que d'autres ratent. Qui s'exprime dans tout ce que tu fais. Dans tes choix. Tes créations. Tes relations. Cette sensibilité qui enrichit. Joyeux anniversaire [Prénom].
La sensibilité particulière est un prisme qui enrichit le monde,
— Quelqu'un qui a vu le monde à travers ta sensibilité et l'a trouvé plus riche 🌸` },
            { id: "a25_s2_016", angle: "Joyeux anniversaire t\'as une façon de créer du lien qui est pas classique mais qui marche.", body: `16. "Joyeux anniversaire t'as une façon de créer du lien qui est pas classique mais qui marche."
Pas les méthodes standard. Pas les trucs habituels. Ta façon à toi. De créer des connexions. D'établir des liens. De faire que les gens se sentent vus. Pas conventionnelle. Mais efficace. Et sincère. Joyeux anniversaire [Prénom].
Les liens créés non conventionnellement sont souvent les plus solides,
— Quelqu'un qui a été lié à toi de cette façon et confirme la solidité du lien 🤝` },
            { id: "a25_s2_017", angle: "Joyeux anniversaire [Prénom] tu penses à des trucs auxquels personne pense et c\'est utile.", body: `17. "Joyeux anniversaire [Prénom] tu penses à des trucs auxquels personne pense et c'est utile."
Ces trucs. Ces angles morts que tout le monde rate. Ces questions que personne pose. Ces perspectives que personne envisage. Et toi tu y penses. Tu les soulèves. Tu les explores. Cette façon de voir ce que les autres voient pas. Joyeux anniversaire [Prénom].
Voir ce que les autres voient pas c'est un don précieux,
— Quelqu'un qui a bénéficié de ta façon de voir les angles morts 👁️` },
            { id: "a25_s2_018", angle: "Joyeux anniversaire t\'as un rapport à la normalité qui est sain et libérateur.", body: `18. "Joyeux anniversaire t'as un rapport à la normalité qui est sain et libérateur."
Ce rapport. Cette façon de pas te soumettre totalement aux standards. De faire les trucs à ta façon. De t'affranchir de ce qui est censé être normal. Sans pour autant être dans la rébellion permanente. Juste dans ta liberté. Joyeux anniversaire [Prénom].
Un rapport sain à la normalité c'est une liberté précieuse,
— Quelqu'un qui essaie d'avoir le même rapport et y travaille 🌿` },
            { id: "a25_s2_019", angle: "Joyeux anniversaire [Prénom] t\'as une profondeur qui se révèle pas immédiatement et c\'est bien.", body: `19. "Joyeux anniversaire [Prénom] t'as une profondeur qui se révèle pas immédiatement et c'est bien."
Cette profondeur. Qui n'est pas en surface. Qui demande du temps. De la confiance. De la patience. Qui se révèle progressivement. Qui récompense ceux qui restent assez longtemps pour la voir. Joyeux anniversaire [Prénom].
La profondeur qui se révèle progressivement récompense la patience,
— Quelqu'un qui est resté assez longtemps et a été récompensé par ce qu'il a découvert 💎` },
            { id: "a25_s2_020", angle: "Joyeux anniversaire t\'es chelou à ta façon t\'es mon chelou et c\'est un privilège.", body: `20. "Joyeux anniversaire t'es chelou à ta façon t'es mon chelou et c'est un privilège."
Un vrai privilège. D'avoir accès au chelou. De comprendre les codes. D'apprécier les nuances. D'être dans le cercle de ceux qui comprennent vraiment. Ce privilège-là se mérite. Et je l'apprécie. Joyeux anniversaire [Prénom].
Le privilège d'accès au chelou est reconnu et apprécié,
— Quelqu'un qui est content d'avoir mérité ce privilège et ne le prend pas pour acquis ❤️

On continue avec` },
          ],
        },
        {
          id: 'vieilli',
          label: "Franchement t'as vieilli",
          emoji: '😄',
          messages: [
            { id: "a25_s3_001", angle: "Joyeux anniversaire. Franchement t\'as vieilli et c\'est pas une insulte.", body: `1. "Joyeux anniversaire. Franchement t'as vieilli et c'est pas une insulte."
C'est un constat. Neutre. Objectif. T'avais un âge l'année dernière. T'en as un autre maintenant. Le chiffre a bougé dans une direction. Une seule direction disponible d'ailleurs. Et avec ce chiffre qui bouge vient quelque chose. Quelque chose de bien en fait. Joyeux anniversaire [Prénom].
Le vieillissement comme constat neutre et bienveillant,
— Quelqu'un qui fait le même constat sur lui-même et préfère l'accepter 📊` },
            { id: "a25_s3_002", angle: "Joyeux anniversaire [Prénom] t\'as des opinions sur des matelas maintenant et c\'est officiel.", body: `2. "Joyeux anniversaire [Prénom] t'as des opinions sur des matelas maintenant et c'est officiel."
C'est le signe. Pas les cheveux gris. Pas les genoux qui craquent. Le moment où on développe une opinion sur les matelas. Avec des arguments. Des marques citées. Une fermeté idéale défendue avec conviction. Ce moment est passé pour toi. Joyeux anniversaire [Prénom].
L'opinion sur les matelas c'est le rite de passage vers l'âge adulte,
— Quelqu'un qui a aussi une opinion sur les matelas et assume totalement 🛏️` },
            { id: "a25_s3_003", angle: "Joyeux anniversaire t\'as commencé à parler de qualité du sommeil et on t\'accueille.", body: `3. "Joyeux anniversaire t'as commencé à parler de qualité du sommeil et on t'accueille."
Dans ce club. Celui des gens qui dorment avec intention. Qui optimisent leur sommeil. Qui parlent de cycles. De qualité. De récupération. Qui annulent des trucs parce que c'est trop tard. T'es officiellement dans ce club. Joyeux anniversaire [Prénom].
Le club du sommeil intentionnel est un bon club,
— Quelqu'un qui est dans ce club depuis un moment et confirme que c'est très bien 😴` },
            { id: "a25_s3_004", angle: "Joyeux anniversaire [Prénom] tu commences à avoir des trucs qui font mal de façon régulière.", body: `4. "Joyeux anniversaire [Prénom] tu commences à avoir des trucs qui font mal de façon régulière."
Ce dos. Cette épaule. Ce genou parfois. Ces petits signaux corporels. Ces messageries internes du corps qui commencent à s'activer. Ces nouveaux locataires permanents. Joyeux anniversaire [Prénom] bienvenue dans la propriété corporelle adulte.
Les douleurs récurrentes c'est le loyer qu'on paie pour vieillir,
— Quelqu'un qui a aussi ses locataires corporels et compatit totalement 🦴` },
            { id: "a25_s3_005", angle: "Joyeux anniversaire t\'as un budget maintenant. Un vrai.", body: `5. "Joyeux anniversaire t'as un budget maintenant. Un vrai."
Pas approximatif. Un vrai. Avec des catégories. Des plafonds. Des arbitrages. Des moments où tu regardes une chose et tu calcules si c'est raisonnable. Ce rapport au budget qui dit quelque chose sur l'âge adulte atteint. Joyeux anniversaire [Prénom].
Avoir un vrai budget c'est une forme de sagesse financière,
— Quelqu'un qui a aussi un budget et le respecte avec des résultats variables 💸` },
            { id: "a25_s3_006", angle: "Joyeux anniversaire [Prénom] tu dis les jeunes maintenant.", body: `6. "Joyeux anniversaire [Prénom] tu dis les jeunes maintenant."
T'as dit cette phrase. Avec cette intonation. Cette intonation qu'on reconnaît. Qui dit qu'on est passé de l'autre côté. Qui dit que les jeunes c'est plus tout à fait toi. Cette phrase que tu jurais de jamais dire. T'as dit. Joyeux anniversaire [Prénom].
Le passage de l'autre côté est officiellement acté,
— Quelqu'un qui a dit la même chose la semaine dernière et ne s'en excuse pas 👴` },
            { id: "a25_s3_007", angle: "Joyeux anniversaire t\'as des habitudes du soir qui ressemblent à celles de tes parents.", body: `7. "Joyeux anniversaire t'as des habitudes du soir qui ressemblent à celles de tes parents."
Cette routine. Ce démaquillage. Cette tisane peut-être. Ces vérifications avant de dormir. Ces habitudes qui s'installent. Qui ressemblent à des trucs qu'on regardait faire et qu'on trouvait vieux. Et qui sont maintenant les tiennes. Joyeux anniversaire [Prénom].
Devenir ses parents sur certains trucs c'est inévitable et finalement okay,
— Quelqu'un qui a les mêmes habitudes du soir et trouve ça très bien 🌙` },
            { id: "a25_s3_008", angle: "Joyeux anniversaire [Prénom] les soirées qui finissent tard te coûtent plus qu\'avant.", body: `8. "Joyeux anniversaire [Prénom] les soirées qui finissent tard te coûtent plus qu'avant."
Cette facture. Du lendemain. Qui s'alourdit. Qui demande plus de récupération. Ces lendemains de soirée qui prennent plus de temps. Ces calculs avant de dire oui. Ces arbitrages entre la soirée et le lendemain. Joyeux anniversaire [Prénom].
La facture du lendemain qui s'alourdit c'est un phénomène universel,
— Quelqu'un qui fait les mêmes calculs maintenant et comprend totalement 🧮` },
            { id: "a25_s3_009", angle: "Joyeux anniversaire t\'as une routine et tu la défends.", body: `9. "Joyeux anniversaire t'as une routine et tu la défends."
Cette routine. Installée. Avec ses horaires. Ses habitudes. Ses petits rituels. Et tu la défends. Contre les perturbations. Contre les imprévus. Contre ceux qui veulent modifier les plans. Cette routine est précieuse et tu le sais. Joyeux anniversaire [Prénom].
Défendre sa routine c'est défendre sa santé mentale,
— Quelqu'un qui a aussi une routine sacrée et la comprend parfaitement 📋` },
            { id: "a25_s3_010", angle: "Joyeux anniversaire [Prénom] tu comprends maintenant ce que tes parents essayaient de te dire.", body: `10. "Joyeux anniversaire [Prénom] tu comprends maintenant ce que tes parents essayaient de te dire."
Ces trucs. Ces conseils. Ces mises en garde. Ces phrases incompréhensibles à l'époque. Qui avaient l'air de radotage. Et qui maintenant font sens. Qui maintenant tu comprends de l'intérieur. Cette compréhension tardive mais réelle. Joyeux anniversaire [Prénom].
Comprendre ses parents c'est un signe de maturité,
— Quelqu'un qui a eu le même moment de révélation et en a été légèrement gêné 💡` },
            { id: "a25_s3_011", angle: "Joyeux anniversaire t\'as un médecin régulier et tu connais son prénom.", body: `11. "Joyeux anniversaire t'as un médecin régulier et tu connais son prénom."
Pas juste un cabinet. Un médecin. Avec un prénom. Que tu peux citer naturellement. À qui tu prends des rendez-vous proactivement. Pas seulement aux urgences. Ce changement de rapport à la médecine. Joyeux anniversaire [Prénom].
Avoir un médecin régulier c'est prendre soin de soi sérieusement,
— Quelqu'un qui a aussi un médecin avec un prénom et trouve ça adulte 🏥` },
            { id: "a25_s3_012", angle: "Joyeux anniversaire [Prénom] tu apprécies le calme d\'une façon que tu n\'aurais pas comprise avant.", body: `12. "Joyeux anniversaire [Prénom] tu apprécies le calme d'une façon que tu n'aurais pas comprise avant."
Ce calme. Qui était ennuyeux avant. Qui semblait une absence de quelque chose. Et qui maintenant est une présence. Un truc qu'on cherche. Qu'on protège. Qu'on apprécie profondément. Cette évolution du rapport au calme. Joyeux anniversaire [Prénom].
Apprécier le calme c'est une évolution de goût vers le premium,
— Quelqu'un qui protège son calme férocement maintenant et comprend la valeur 🌿` },
            { id: "a25_s3_013", angle: "Joyeux anniversaire t\'as des opinions sur l\'alimentation qui se sont précisées.", body: `13. "Joyeux anniversaire t'as des opinions sur l'alimentation qui se sont précisées."
Ces opinions. Sur ce qu'on mange. Comment. Pourquoi. Ces préférences développées. Ces trucs qu'on évite maintenant. Ces trucs qu'on recherche. Ce rapport à la nourriture qui s'est sophistiqué. Joyeux anniversaire [Prénom].
Des opinions précises sur l'alimentation c'est une forme d'intelligence corporelle,
— Quelqu'un qui a aussi des opinions sur l'alimentation et pourrait en parler longtemps 🥗` },
            { id: "a25_s3_014", angle: "Joyeux anniversaire [Prénom] le fait de rester chez toi un vendredi soir est devenu une récompense.", body: `14. "Joyeux anniversaire [Prénom] le fait de rester chez toi un vendredi soir est devenu une récompense."
Cette évolution. Où rester chez soi est passé de consolation à récompense. De plan B à plan A. De ce qui arrive quand tout est annulé à ce qu'on espère. Cette inversion totale. Joyeux anniversaire [Prénom].
Rester chez soi comme récompense c'est le sommet de la maturité,
— Quelqu'un qui a atteint ce sommet et s'y trouve très bien 🛋️` },
            { id: "a25_s3_015", angle: "Joyeux anniversaire t\'as des projets qui s\'inscrivent dans le temps long maintenant.", body: `15. "Joyeux anniversaire t'as des projets qui s'inscrivent dans le temps long maintenant."
Ces projets. Qui ne se réalisent pas dans la semaine. Qui demandent des mois. Des années peut-être. Cette façon de se projeter loin. D'investir dans quelque chose qui prendra du temps. Cette relation différente au temps. Joyeux anniversaire [Prénom].
Penser en temps long c'est une marque de maturité,
— Quelqu'un qui commence à avoir les mêmes projets en temps long et trouve ça bien 🌱` },
            { id: "a25_s3_016", angle: "Joyeux anniversaire [Prénom] tu récupères différemment et t\'as accepté cette réalité.", body: `16. "Joyeux anniversaire [Prénom] tu récupères différemment et t'as accepté cette réalité."
Cette réalité. Du corps qui récupère à son rythme. Pas le rythme d'avant. Un autre rythme. Plus long parfois. Plus exigeant. Et t'as accepté. T'adaptes. Tu prévois la récupération. Joyeux anniversaire [Prénom].
Accepter le rythme de récupération de son corps c'est de la sagesse,
— Quelqu'un qui a eu la même révélation et planifie ses récupérations maintenant 🔋` },
            { id: "a25_s3_017", angle: "Joyeux anniversaire t\'as des références culturelles qui commencent à dater légèrement.", body: `17. "Joyeux anniversaire t'as des références culturelles qui commencent à dater légèrement."
Ces références. Ces films. Ces trucs. Que tu cites. Que les gens un peu plus jeunes que toi connaissent comme histoire ancienne. Ou connaissent pas. Cette légère dissonance temporelle. Cette première indication. Joyeux anniversaire [Prénom].
Les références qui datent sont des badges d'honneur générationnels,
— Quelqu'un qui doit aussi expliquer ses références de plus en plus souvent 📺` },
            { id: "a25_s3_018", angle: "Joyeux anniversaire [Prénom] tu commences à valoriser la stabilité d\'une façon nouvelle.", body: `18. "Joyeux anniversaire [Prénom] tu commences à valoriser la stabilité d'une façon nouvelle."
Cette stabilité. Qui était ennuyeuse avant. Qui ressemblait à une limitation. Et qui maintenant a de la valeur. Une valeur concrète. Mesurable. Cette chose précieuse qu'on cherche à construire. Joyeux anniversaire [Prénom].
Valoriser la stabilité c'est comprendre ce qui compte vraiment,
— Quelqu'un qui cherche aussi cette stabilité et comprend sa valeur 🏡` },
            { id: "a25_s3_019", angle: "Joyeux anniversaire t\'as vieilli mais t\'as gardé ce qui compte.", body: `19. "Joyeux anniversaire t'as vieilli mais t'as gardé ce qui compte."
Ce truc. Ce fond. Cette curiosité peut-être. Cette façon de rire. Cette ouverture. Cette chaleur. Ce truc essentiel qui était là avant. Qui est là maintenant. Que les années n'ont pas érodé. Joyeux anniversaire [Prénom].
Garder ce qui compte en vieillissant c'est le vrai défi,
— Quelqu'un qui confirme que tu as gardé ce qui compte et en est soulagé 💛` },
            { id: "a25_s3_020", angle: "Joyeux anniversaire [Prénom] vieillir avec toi c\'est rassurant parce que tu le fais bien.", body: `20. "Joyeux anniversaire [Prénom] vieillir avec toi c'est rassurant parce que tu le fais bien."
Cette façon de vieillir. Avec grâce. Avec humour sur soi. Avec acceptation. Sans drama excessif. En tirant les leçons. En gardant l'essentiel. En avançant. Cette façon de vieillir qui donne envie de faire pareil. Joyeux anniversaire [Prénom].
Bien vieillir c'est un art et tu le pratiques,
— Quelqu'un qui prend des notes sur ta façon de vieillir pour s'en inspirer ❤️

On continue avec` },
          ],
        },
        {
          id: 'trucs',
          label: "On a vécu des trucs",
          emoji: '🧡',
          messages: [
            { id: "a25_s4_001", angle: "Joyeux anniversaire [Prénom] on a vécu des trucs et ils ont construit quelque chose.", body: `1. "Joyeux anniversaire [Prénom] on a vécu des trucs et ils ont construit quelque chose."
Pas juste des souvenirs. Quelque chose de plus concret. Une connaissance mutuelle. Une confiance. Une façon d'être là l'un pour l'autre qui s'est développée à travers ces trucs. Ces expériences partagées qui ont construit un lien réel. Joyeux anniversaire [Prénom].
Les trucs vécus ensemble construisent les liens les plus solides,
— Quelqu'un qui mesure ce qui a été construit et en est reconnaissant 🏗️` },
            { id: "a25_s4_002", angle: "Joyeux anniversaire t\'étais là pendant des périodes de ma vie qui comptaient vraiment.", body: `2. "Joyeux anniversaire t'étais là pendant des périodes de ma vie qui comptaient vraiment."
Ces périodes. Ces moments charnières. Ces passages. Ces transitions. Ces nuits difficiles. Ces journées importantes. T'étais là. Avec ce que ça implique d'être vraiment là. Pas juste présent. Là. Joyeux anniversaire [Prénom].
Être vraiment là pendant les périodes qui comptent c'est irremplaçable,
— Quelqu'un qui se souvient précisément de ces moments et de ce que ta présence représentait 💛` },
            { id: "a25_s4_003", angle: "Joyeux anniversaire [Prénom] on a eu des conversations qui ont changé des trucs.", body: `3. "Joyeux anniversaire [Prénom] on a eu des conversations qui ont changé des trucs."
Ces conversations. Pas les petites. Les grandes. Celles qui ont déplacé quelque chose. Qui ont clarté un truc. Qui ont nommé quelque chose qui était là sans nom. Ces échanges qui restent. Qui font partie de qui on est maintenant. Joyeux anniversaire [Prénom].
Les conversations qui changent des trucs sont rares et précieuses,
— Quelqu'un qui pense à une conversation précise là et mesure son impact 💬` },
            { id: "a25_s4_004", angle: "Joyeux anniversaire t\'as été témoin de versions de moi que peu de gens ont vues.", body: `4. "Joyeux anniversaire t'as été témoin de versions de moi que peu de gens ont vues."
Ces versions. Moins présentables. Moins filtrées. Plus vraies. Ces moments où la façade était moins haute. Où t'avais accès à quelque chose de plus authentique. Cet accès exclusif. Cette confiance implicite. Joyeux anniversaire [Prénom].
Être témoin des versions non filtrées de quelqu'un c'est un privilège rare,
— Quelqu'un qui apprécie l'accès que tu lui as accordé et le traite avec soin 🤍` },
            { id: "a25_s4_005", angle: "Joyeux anniversaire [Prénom] on a traversé des désaccords et le lien a tenu.", body: `5. "Joyeux anniversaire [Prénom] on a traversé des désaccords et le lien a tenu."
Ces désaccords. Ces moments de friction. Ces visions différentes. Ces conversations difficiles. Et le lien a tenu. Pas malgré ça. Parfois grâce à ça. Ces désaccords traversés qui prouvent que quelque chose de solide existe. Joyeux anniversaire [Prénom].
Les désaccords traversés sont des preuves de solidité,
— Quelqu'un qui est content d'avoir traversé ces désaccords et de te trouver encore là 🤝` },
            { id: "a25_s4_006", angle: "Joyeux anniversaire t\'as été là pendant des moments où j\'aurais pu me retrouver seul.", body: `6. "Joyeux anniversaire t'as été là pendant des moments où j'aurais pu me retrouver seul."
Ces moments. Où la présence de quelqu'un fait une différence réelle. Où être seul aurait coûté quelque chose. Et t'étais là. Par choix. Par attention. Par ce que tu es. Cette présence qui a changé quelque chose. Joyeux anniversaire [Prénom].
La présence choisie dans les moments difficiles c'est un cadeau concret,
— Quelqu'un qui mesure ce que ta présence a représenté dans ces moments 💙` },
            { id: "a25_s4_007", angle: "Joyeux anniversaire [Prénom] on a ri de trucs qu\'on peut pas expliquer aux autres.", body: `7. "Joyeux anniversaire [Prénom] on a ri de trucs qu'on peut pas expliquer aux autres."
Ces rires. Ces situations. Ces moments d'humour qu'on ne peut pas reproduire. Qui tenaient à un contexte. À une dynamique. À ce qu'on était ce jour-là. Ces rires irrépétables. Ces complicités ponctuelles devenues permanentes. Joyeux anniversaire [Prénom].
Les rires inexplicables aux autres sont les plus précieux,
— Quelqu'un qui rit encore en y pensant et sait que toi aussi 😄` },
            { id: "a25_s4_008", angle: "Joyeux anniversaire t\'as vu des trucs sur moi que je montrais pas facilement.", body: `8. "Joyeux anniversaire t'as vu des trucs sur moi que je montrais pas facilement."
Ces trucs. Ces aspects. Ces parties moins présentables. Ces doutes. Ces failles. Ces moments de vulnérabilité. Que t'as vus. Pas par accident. Parce que la confiance était là pour ça. Parce que ta présence créait un espace pour ça. Joyeux anniversaire [Prénom].
Voir les trucs que quelqu'un montre pas facilement c'est une responsabilité,
— Quelqu'un qui apprécie que tu aies porté ces trucs vus avec soin 🌿` },
            { id: "a25_s4_009", angle: "Joyeux anniversaire [Prénom] on a fait des choix ensemble dont on est fiers ou presque.", body: `9. "Joyeux anniversaire [Prénom] on a fait des choix ensemble dont on est fiers ou presque."
Ces choix. Ces décisions partagées. Ces trucs qu'on a décidé à deux. Certains ont bien tourné. D'autres moins. Mais ils étaient à nous. Pris ensemble. Avec ce que ça implique de confiance et de complicité. Joyeux anniversaire [Prénom].
Les choix faits ensemble sont partagés dans leur réussite et leurs conséquences,
— Quelqu'un qui assume les choix partagés dans les deux sens 🎯` },
            { id: "a25_s4_010", angle: "Joyeux anniversaire t\'as été honnête avec moi à des moments où c\'était plus facile de pas l\'être.", body: `10. "Joyeux anniversaire t'as été honnête avec moi à des moments où c'était plus facile de pas l'être."
Ces moments. Où la vérité coûtait quelque chose. Où le mensonge confortable était disponible. Et t'as choisi la vérité. Pour moi. Parce que tu estimais que je méritais ça. Cette honnêteté courageuse. Joyeux anniversaire [Prénom].
L'honnêteté courageuse c'est un cadeau qu'on offre rarement,
— Quelqu'un qui t'en a voulu sur le coup et t'en est reconnaissant après 💎` },
            { id: "a25_s4_011", angle: "Joyeux anniversaire [Prénom] on a partagé des silences qui disaient des trucs.", body: `11. "Joyeux anniversaire [Prénom] on a partagé des silences qui disaient des trucs."
Ces silences. Pas gênants. Pas vides. Chargés. De compréhension. De présence. De ce qu'on n'avait pas besoin de verbaliser. Ces silences confortables qui prouvent qu'on est à l'aise l'un avec l'autre. Joyeux anniversaire [Prénom].
Les silences confortables sont le signe d'une vraie proximité,
— Quelqu'un qui apprécie ces silences autant que les conversations 🌙` },
            { id: "a25_s4_012", angle: "Joyeux anniversaire t\'as été une présence stable pendant des périodes instables.", body: `12. "Joyeux anniversaire t'as été une présence stable pendant des périodes instables."
Ces périodes. Où tout bougeait. Où les certitudes partaient. Où les repères se déplaçaient. Et toi t'étais là. Stable. Constant. Fiable. Cette présence stable dans l'instabilité. Ce truc précieux. Joyeux anniversaire [Prénom].
Une présence stable dans l'instabilité c'est ce qu'on cherche tous,
— Quelqu'un qui a eu besoin de cette stabilité et t'en est profondément reconnaissant ⚓` },
            { id: "a25_s4_013", angle: "Joyeux anniversaire [Prénom] on a traversé des étapes de vie différentes et le lien a suivi.", body: `13. "Joyeux anniversaire [Prénom] on a traversé des étapes de vie différentes et le lien a suivi."
Ces étapes. Ces transitions. Ces moments où nos vies prenaient des formes différentes. Où les contextes changeaient. Où les distances apparaissaient. Et le lien suivait. S'adaptait. Trouvait sa nouvelle forme. Joyeux anniversaire [Prénom].
Un lien qui suit les étapes de vie c'est un lien vivant,
— Quelqu'un qui est content que le lien ait su s'adapter à chaque transition 🌊` },
            { id: "a25_s4_014", angle: "Joyeux anniversaire t\'as célébré mes trucs avec une sincérité qui se voit.", body: `14. "Joyeux anniversaire t'as célébré mes trucs avec une sincérité qui se voit."
Ces trucs. Ces réussites. Ces moments importants. Ces choses qui méritaient d'être célébrées. Et toi tu célébrais. Vraiment. Pas poliment. Sincèrement. Cette joie pour moi qui était réelle. Pas performée. Joyeux anniversaire [Prénom].
La joie sincère pour les trucs des autres c'est rare et précieux,
— Quelqu'un qui a senti cette sincérité et l'a appréciée profondément 🎉` },
            { id: "a25_s4_015", angle: "Joyeux anniversaire [Prénom] on a navigué des dynamiques complexes ensemble.", body: `15. "Joyeux anniversaire [Prénom] on a navigué des dynamiques complexes ensemble."
Ces dynamiques. Ces situations. Ces contextes où les relations étaient compliquées. Où naviguer demandait de l'intelligence et de la délicatesse. Et on a navigué. Ensemble. Avec plus ou moins d'élégance. Mais ensemble. Joyeux anniversaire [Prénom].
Naviguer les dynamiques complexes ensemble renforce les liens,
— Quelqu'un qui est content d'avoir eu un co-navigateur pour ces eaux compliquées 🗺️` },
            { id: "a25_s4_016", angle: "Joyeux anniversaire t\'as gardé mes secrets avec une discrétion que j\'apprécie.", body: `16. "Joyeux anniversaire t'as gardé mes secrets avec une discrétion que j'apprécie."
Ces secrets. Ces confidences. Ces trucs partagés dans des moments de confiance. Qui sont restés là où ils devaient rester. Sans fuites. Sans glissements. Avec une discrétion qui dit que tu comprends la valeur de ce qu'on te confie. Joyeux anniversaire [Prénom].
La discrétion avec les confidences c'est une forme de respect profond,
— Quelqu'un qui continuera de te confier des choses parce que tu as prouvé que tu les portes bien 🤫` },
            { id: "a25_s4_017", angle: "Joyeux anniversaire [Prénom] on s\'est dit des vérités difficiles et on est plus proches pour ça.", body: `17. "Joyeux anniversaire [Prénom] on s'est dit des vérités difficiles et on est plus proches pour ça."
Ces vérités. Ces moments où quelqu'un dit quelque chose de difficile à entendre. Ou reçoit quelque chose de difficile à dire. Ces échanges courageux. Qui auraient pu abîmer. Et qui ont renforcé. Joyeux anniversaire [Prénom].
Les vérités difficiles dites avec soin rapprochent plus qu'elles n'éloignent,
— Quelqu'un qui est plus proche de toi après chacune de ces vérités 💛` },
            { id: "a25_s4_018", angle: "Joyeux anniversaire t\'as été quelqu\'un sur qui je savais que je pouvais compter.", body: `18. "Joyeux anniversaire t'as été quelqu'un sur qui je savais que je pouvais compter."
Cette certitude. Cette fiabilité. Cette façon de savoir que si quelque chose se passait t'étais disponible. Cette sécurité. Ce filet. Cette confiance dans la présence de l'autre. Joyeux anniversaire [Prénom].
Être quelqu'un sur qui on peut compter c'est un engagement quotidien,
— Quelqu'un qui apprécie cette fiabilité plus qu'il ne le dit habituellement 🏡` },
            { id: "a25_s4_019", angle: "Joyeux anniversaire [Prénom] les trucs qu\'on a vécus ensemble ont une valeur qui grandit avec le temps.", body: `19. "Joyeux anniversaire [Prénom] les trucs qu'on a vécus ensemble ont une valeur qui grandit avec le temps."
Cette valeur. Qui s'apprécie. Qui prend de l'importance à mesure que le temps passe. Ces souvenirs qui deviennent plus précieux. Ces moments qui prennent de la profondeur. Cette richesse qui s'accumule. Joyeux anniversaire [Prénom].
Les souvenirs partagés s'apprécient comme un bon vin,
— Quelqu'un qui mesure cette valeur grandissante et en est touché ⏳` },
            { id: "a25_s4_020", angle: "Joyeux anniversaire t\'es quelqu\'un avec qui j\'ai grandi et je suis content que ce soit toi.", body: `20. "Joyeux anniversaire t'es quelqu'un avec qui j'ai grandi et je suis content que ce soit toi."
Ce choix. Cette personne. Avec qui les années se sont passées. Avec qui les trucs ont été traversés. Avec qui la croissance s'est faite. Et si c'était à refaire. Ce serait toi. Sans hésitation. Joyeux anniversaire [Prénom].
Grandir avec les bonnes personnes c'est ce qui compte,
— Quelqu'un qui referait ce choix et en est certain ❤️

On continue avec` },
          ],
        },
        {
          id: 'no_cap',
          label: "No cap t'assures",
          emoji: '⭐',
          messages: [
            { id: "a25_s5_001", angle: "Joyeux anniversaire [Prénom] t\'assures avec une constance qui force le respect.", body: `1. "Joyeux anniversaire [Prénom] t'assures avec une constance qui force le respect."
Pas juste parfois. Pas juste quand c'est facile. Pas juste quand tout va bien. De façon constante. Cette régularité dans l'assurance. Cette fiabilité du niveau. Cette façon de tenir sur la durée. C'est ça qui impressionne vraiment. Joyeux anniversaire [Prénom].
La constance dans l'assurance c'est plus difficile que le pic occasionnel,
— Quelqu'un qui observe cette constance sur le long terme et la trouve remarquable 📈` },
            { id: "a25_s5_002", angle: "Joyeux anniversaire t\'assures dans ta façon de traiter les gens.", body: `2. "Joyeux anniversaire t'assures dans ta façon de traiter les gens."
Cette façon. De voir les gens. De les traiter. De les respecter. De les considérer. De te souvenir d'eux. De te soucier de ce qu'ils vivent. Cette façon de traiter les gens qui dit tout sur qui tu es vraiment. Joyeux anniversaire [Prénom].
La façon de traiter les gens c'est le vrai indicateur du caractère,
— Quelqu'un qui a bénéficié de cette façon d'être traité et l'apprécie profondément 🤝` },
            { id: "a25_s5_003", angle: "Joyeux anniversaire [Prénom] t\'assures dans ta façon de gérer l\'incertitude.", body: `3. "Joyeux anniversaire [Prénom] t'assures dans ta façon de gérer l'incertitude."
Cette incertitude. Ces moments où on sait pas. Où les certitudes manquent. Où l'avenir est flou. Et toi tu navigues ça. Avec une stabilité qui ne vient pas de l'absence de doute mais de ta façon de fonctionner malgré le doute. Joyeux anniversaire [Prénom].
Gérer l'incertitude avec stabilité c'est une compétence rare,
— Quelqu'un qui essaie de développer cette compétence et t'observe pour s'en inspirer 🧭` },
            { id: "a25_s5_004", angle: "Joyeux anniversaire t\'assures dans ta capacité à te remettre en question.", body: `4. "Joyeux anniversaire t'assures dans ta capacité à te remettre en question."
Cette capacité. Rare. De regarder ses propres trucs. De remettre en question ses propres certitudes. De changer d'avis quand c'est justifié. De reconnaître ce qui ne marche pas. Cette honnêteté avec soi-même. T'assures avec ça vraiment. Joyeux anniversaire [Prénom].
Se remettre en question honnêtement c'est un acte de courage,
— Quelqu'un qui t'a vu faire ça et en a été impressionné 🔄` },
            { id: "a25_s5_005", angle: "Joyeux anniversaire [Prénom] t\'assures avec ton intégrité.", body: `5. "Joyeux anniversaire [Prénom] t'assures avec ton intégrité."
Cette intégrité. Entre ce que tu dis et ce que tu fais. Entre ce que tu défends et comment tu agis. Cette cohérence. Cette ligne que tu tiens. Pas parfaitement toujours. Mais avec une constance qui dit que c'est réel. Joyeux anniversaire [Prénom].
L'intégrité cohérente sur le long terme c'est plus rare qu'on le pense,
— Quelqu'un qui a observé cette intégrité dans des situations diverses et la confirme 💎` },
            { id: "a25_s5_006", angle: "Joyeux anniversaire t\'assures dans ta façon de prendre soin de toi.", body: `6. "Joyeux anniversaire t'assures dans ta façon de prendre soin de toi."
Cette façon. De te traiter avec le même soin que tu traites les autres. De reconnaître tes besoins. De les respecter. De pas te mettre systématiquement en dernier. Cette façon de prendre soin de toi qui dit que tu te values. Joyeux anniversaire [Prénom].
Prendre soin de soi c'est la base de tout le reste,
— Quelqu'un qui apprend encore à faire ça et t'observe pour s'en inspirer 🌸` },
            { id: "a25_s5_007", angle: "Joyeux anniversaire [Prénom] t\'assures avec ta façon d\'affronter les trucs difficiles.", body: `7. "Joyeux anniversaire [Prénom] t'assures avec ta façon d'affronter les trucs difficiles."
Ces trucs difficiles. Ces situations. Ces moments où c'est lourd. Où c'est compliqué. Où la facilité serait d'éviter. Et toi tu y vas. Tu affrontes. Avec la peur peut-être. Mais tu y vas quand même. Cette façon d'affronter. Joyeux anniversaire [Prénom].
Affronter les trucs difficiles avec la peur c'est plus courageux que sans,
— Quelqu'un qui t'a vu affronter des trucs et en a été inspiré 🦁` },
            { id: "a25_s5_008", angle: "Joyeux anniversaire t\'assures avec ta capacité à créer de la chaleur autour de toi.", body: `8. "Joyeux anniversaire t'assures avec ta capacité à créer de la chaleur autour de toi."
Cette chaleur. Que tu génères. Qui fait que les gens sont bien avec toi. Qui fait que l'espace que tu occupes devient plus confortable. Cette façon de rendre les endroits et les moments plus accueillants par ta seule présence. Joyeux anniversaire [Prénom].
Créer de la chaleur autour de soi c'est un don qu'on sous-estime,
— Quelqu'un qui se sent toujours mieux dans les espaces que tu occupes 🌡️` },
            { id: "a25_s5_009", angle: "Joyeux anniversaire [Prénom] t\'assures avec ta façon de communiquer les trucs difficiles.", body: `9. "Joyeux anniversaire [Prénom] t'assures avec ta façon de communiquer les trucs difficiles."
Ces trucs difficiles à dire. Ces conversations compliquées. Ces vérités inconfortables. Ces choses qui demandent du courage à formuler. Et toi tu trouves comment les dire. Avec soin. Avec précision. Sans esquiver. Joyeux anniversaire [Prénom].
Communiquer les trucs difficiles avec soin c'est une compétence précieuse,
— Quelqu'un qui a reçu des trucs difficiles de ta part et apprécie la façon dont tu les as dits 💬` },
            { id: "a25_s5_010", angle: "Joyeux anniversaire t\'assures avec ta vision long terme.", body: `10. "Joyeux anniversaire t'assures avec ta vision long terme."
Cette vision. Ces objectifs qui s'inscrivent dans le temps. Cette façon de pas juste réagir au présent mais de construire quelque chose. De voir où tu vas. De prendre des décisions qui ont du sens sur la durée. Joyeux anniversaire [Prénom].
Avoir une vision long terme c'est rare et précieux,
— Quelqu'un qui admire ta capacité à penser en long terme 🌅` },
            { id: "a25_s5_011", angle: "Joyeux anniversaire [Prénom] t\'assures avec ton sens des priorités.", body: `11. "Joyeux anniversaire [Prénom] t'assures avec ton sens des priorités."
Ces priorités. Clairement établies. Défendues. Ces trucs qui passent avant les autres trucs. Cette façon de pas se laisser emporter par tout ce qui est urgent au détriment de ce qui est important. Ce sens des priorités. Joyeux anniversaire [Prénom].
Distinguer l'urgent de l'important c'est une sagesse pratique,
— Quelqu'un qui travaille encore sur ce distinguo et t'envie ta clarté 🎯` },
            { id: "a25_s5_012", angle: "Joyeux anniversaire t\'assures avec ta façon de recevoir les critiques.", body: `12. "Joyeux anniversaire t'assures avec ta façon de recevoir les critiques."
Ces critiques. Ces retours difficiles. Ces trucs qu'on dit sur ce que tu fais ou ce que tu es. Et toi tu reçois ça. Pas parfaitement toujours. Mais avec une ouverture réelle. Sans te fermer. Sans tout rejeter. Avec la capacité d'entendre. Joyeux anniversaire [Prénom].
Recevoir les critiques avec ouverture c'est une compétence rare,
— Quelqu'un qui t'a donné des retours et apprécie la façon dont tu les reçois 🔄` },
            { id: "a25_s5_013", angle: "Joyeux anniversaire [Prénom] t\'assures avec ton rapport à l\'échec.", body: `13. "Joyeux anniversaire [Prénom] t'assures avec ton rapport à l'échec."
Ce rapport. Ces moments où ça ne marche pas. Où c'est raté. Où les résultats ne sont pas là. Et toi tu gères ça. Tu extrais ce qu'il y a à extraire. Tu continues. Tu recommences si nécessaire. Ce rapport sain à l'échec. Joyeux anniversaire [Prénom].
Un rapport sain à l'échec c'est la condition de tout progrès,
— Quelqu'un qui essaie d'avoir le même rapport et y arrive progressivement 💪` },
            { id: "a25_s5_014", angle: "Joyeux anniversaire t\'assures avec ta façon de te montrer disponible.", body: `14. "Joyeux anniversaire t'assures avec ta façon de te montrer disponible."
Cette disponibilité. Réelle. Pas seulement annoncée. Qui se traduit en actes. En présences. En réponses. En temps accordé. Cette façon de rendre concrète une disponibilité qui chez certains reste théorique. Joyeux anniversaire [Prénom].
La disponibilité concrète vaut infiniment plus que la disponibilité déclarée,
— Quelqu'un qui a bénéficié de cette disponibilité concrète et ne l'oublie pas 📱` },
            { id: "a25_s5_015", angle: "Joyeux anniversaire [Prénom] t\'assures avec ta capacité à t\'adapter sans te perdre.", body: `15. "Joyeux anniversaire [Prénom] t'assures avec ta capacité à t'adapter sans te perdre."
Cette adaptation. Ces changements de contexte. Ces nouvelles situations. Ces environments différents. Et toi tu t'adaptes. Tu trouves comment être toi dans chaque contexte. Sans perdre le fil de qui tu es. Cette flexibilité sans dissolution. Joyeux anniversaire [Prénom].
S'adapter sans se perdre c'est l'équilibre le plus difficile à trouver,
— Quelqu'un qui t'a vu dans des contextes très différents et confirme que t'étais toujours toi 🌊` },
            { id: "a25_s5_016", angle: "Joyeux anniversaire t\'assures avec ta façon d\'investir dans tes relations.", body: `16. "Joyeux anniversaire t'assures avec ta façon d'investir dans tes relations."
Cet investissement. Ce temps. Cette énergie. Cette attention. Ces efforts pour maintenir les liens. Pour les nourrir. Pour les faire durer. Cette façon active de prendre soin des relations qui comptent. Joyeux anniversaire [Prénom].
Investir activement dans ses relations c'est ce qui les fait durer,
— Quelqu'un qui bénéficie de cet investissement et essaie de le rendre 💛` },
            { id: "a25_s5_017", angle: "Joyeux anniversaire [Prénom] t\'assures avec ta capacité à reconnaître ce qui compte vraiment.", body: `17. "Joyeux anniversaire [Prénom] t'assures avec ta capacité à reconnaître ce qui compte vraiment."
Cette capacité. De trier. De distinguer ce qui est important de ce qui est bruit. Ces trucs essentiels que tu gardes. Ces trucs secondaires que tu lâches. Cette clarté sur ce qui compte vraiment. Joyeux anniversaire [Prénom].
Reconnaître ce qui compte vraiment c'est une sagesse pratique quotidienne,
— Quelqu'un qui apprend encore à faire ce tri et trouve ton exemple utile 🌿` },
            { id: "a25_s5_018", angle: "Joyeux anniversaire t\'assures avec ta façon de rester curieux.", body: `18. "Joyeux anniversaire t'assures avec ta façon de rester curieux."
Cette curiosité. Qui reste. Qui ne s'émousse pas. Qui continue de s'intéresser. De chercher. De questionner. De vouloir comprendre. Cette façon de rester intellectuellement vivant. De pas se laisser aller à la certitude confortable. Joyeux anniversaire [Prénom].
Rester curieux c'est rester vivant intellectuellement,
— Quelqu'un qui apprécie ta curiosité et en bénéficie régulièrement 🔍` },
            { id: "a25_s5_019", angle: "Joyeux anniversaire [Prénom] t\'assures avec ta façon d\'être présent vraiment.", body: `19. "Joyeux anniversaire [Prénom] t'assures avec ta façon d'être présent vraiment."
Cette présence. Vraie. Qui n'est pas divisée entre ici et le téléphone. Qui n'est pas à moitié ailleurs. Qui est vraiment là. Dans la conversation. Dans le moment. Cette présence complète qui se fait de plus en plus rare. Joyeux anniversaire [Prénom].
La présence vraie est devenue une denrée rare et précieuse,
— Quelqu'un qui se sent vraiment vu quand tu es là et en est reconnaissant 👁️` },
            { id: "a25_s5_020", angle: "Joyeux anniversaire t\'assures et le meilleur c\'est que tu t\'en rends pas forcément compte.", body: `20. "Joyeux anniversaire t'assures et le meilleur c'est que tu t'en rends pas forcément compte."
Cette inconscience. Cette façon de faire des trucs bien sans chercher la validation. Sans mesurer l'impact. Sans calculer l'effet. Juste en étant toi. Cette assurance naturelle qui n'a pas besoin de miroir. Joyeux anniversaire [Prénom].
L'assurance qui ne se cherche pas c'est la plus authentique,
— Quelqu'un qui te le dit aujourd'hui pour que tu le saches au moins une fois ❤️

On finit avec` },
          ],
        },
        {
          id: 'move',
          label: "C'est pas le move mais on t'aime",
          emoji: '💛',
          messages: [
            { id: "a25_s6_001", angle: "Joyeux anniversaire [Prénom] t\'as fait des choix discutables et on t\'aime avec le dossier complet.", body: `1. "Joyeux anniversaire [Prénom] t'as fait des choix discutables et on t'aime avec le dossier complet."
Ce dossier. Ces décisions. Ces trucs qui ont surpris. Ces moments où on se regardait avec des yeux qui disaient vraiment. Ces choix qu'on comprenait pas toujours. Qu'on supportait quand même. Parce que le deal c'était toi complet. Pas toi filtré. Joyeux anniversaire [Prénom].
Le dossier complet est accepté et l'amour est inconditionnel,
— Quelqu'un qui a signé pour le dossier complet et ne regrette pas 📋` },
            { id: "a25_s6_002", angle: "Joyeux anniversaire t\'as eu des périodes compliquées et on a tenu.", body: `2. "Joyeux anniversaire t'as eu des périodes compliquées et on a tenu."
Ces périodes. Ces phases difficiles. Ces moments où t'étais moins toi. Moins disponible. Moins facile. Et on a tenu. Pas parce que c'était simple. Parce que certaines choses méritent qu'on tienne même quand c'est compliqué. Joyeux anniversaire [Prénom].
Tenir pendant les périodes compliquées c'est la preuve que c'est réel,
— Quelqu'un qui a tenu et referait ce choix sans hésitation 💙` },
            { id: "a25_s6_003", angle: "Joyeux anniversaire [Prénom] t\'as mis du temps à comprendre certains trucs et on a attendu.", body: `3. "Joyeux anniversaire [Prénom] t'as mis du temps à comprendre certains trucs et on a attendu."
Ces trucs. Ces leçons. Ces prises de conscience. Qui prenaient le temps qu'elles prenaient. Qu'on voyait arriver de loin. Qu'on attendait. Sans forcément précipiter. Sans toujours dire on te l'avait dit. En attendant que tu arrives toi-même à la conclusion. Joyeux anniversaire [Prénom].
Attendre que quelqu'un arrive à ses propres conclusions c'est du respect,
— Quelqu'un qui a attendu plusieurs fois et trouve que ça valait l'attente 🕰️` },
            { id: "a25_s6_004", angle: "Joyeux anniversaire t\'as des habitudes qui coûtent parfois et on t\'aime quand même.", body: `4. "Joyeux anniversaire t'as des habitudes qui coûtent parfois et on t'aime quand même."
Ces habitudes. Ces patterns. Ces trucs récurrents. Qui coûtent quelque chose. À toi parfois. Aux autres parfois. Ces habitudes qu'on a identifiées. Qu'on a peut-être mentionnées. Et qu'on accepte parce que l'ensemble vaut largement les habitudes. Joyeux anniversaire [Prénom].
L'ensemble vaut largement ses habitudes coûteuses,
— Quelqu'un qui a fait le calcul et confirme que la balance est très positive 🧮` },
            { id: "a25_s6_005", angle: "Joyeux anniversaire [Prénom] t\'as eu des élans de tout changer et on a navigué avec toi.", body: `5. "Joyeux anniversaire [Prénom] t'as eu des élans de tout changer et on a navigué avec toi."
Ces élans. Ces envies soudaines de tout réorganiser. Ces réinventions périodiques. Ces nouveaux départs. Ces réorientations. Certains ont tenu. D'autres moins. Et on naviguait avec toi dans tous les cas. Joyeux anniversaire [Prénom].
Naviguer avec quelqu'un dans ses réinventions c'est une forme d'amitié avancée,
— Quelqu'un qui a navigué plusieurs réinventions et attend la prochaine avec curiosité 🗺️` },
            { id: "a25_s6_006", angle: "Joyeux anniversaire t\'as parfois disparu et on était là quand tu es revenu.", body: `6. "Joyeux anniversaire t'as parfois disparu et on était là quand tu es revenu."
Ces disparitions. Ces périodes de silence. Ces moments où tu rentrais dans ta bulle. Où le contact était minimal. Et on était là quand tu revenais. Sans faire de la disparition un sujet. Sans punir le retour. Là. Joyeux anniversaire [Prénom].
Être là au retour sans punir la disparition c'est de l'amour mature,
— Quelqu'un qui était là à chaque retour et le sera pour les prochains 🚪` },
            { id: "a25_s6_007", angle: "Joyeux anniversaire [Prénom] t\'as eu des priorités changeantes et on s\'est adaptés.", body: `7. "Joyeux anniversaire [Prénom] t'as eu des priorités changeantes et on s'est adaptés."
Ces priorités. Qui changeaient. Qui se réorganisaient. Qui mettaient en avant des trucs différents selon les périodes. Et on s'adaptait. Sans te demander de la cohérence permanente. Sans exiger que tu sois le même à toutes les étapes. Joyeux anniversaire [Prénom].
L'adaptation aux priorités changeantes de quelqu'un c'est du respect de son évolution,
— Quelqu'un qui s'est adapté à plusieurs configurations de tes priorités 🔄` },
            { id: "a25_s6_008", angle: "Joyeux anniversaire t\'as demandé des trucs compliqués à des moments compliqués et on a géré.", body: `8. "Joyeux anniversaire t'as demandé des trucs compliqués à des moments compliqués et on a géré."
Ces demandes. Ces moments où tu avais besoin. Où c'était pas simple. Où le timing était pas parfait. Où ça demandait quelque chose. Et on gérait. Parce que certaines personnes méritent qu'on gère même quand c'est compliqué. Joyeux anniversaire [Prénom].
Gérer les demandes compliquées aux moments compliqués c'est l'amitié réelle,
— Quelqu'un qui a géré et recommencerait parce que t'en ferais autant 🤝` },
            { id: "a25_s6_009", angle: "Joyeux anniversaire [Prénom] t\'as eu des phases d\'overthinking et on a tenu le cap avec toi.", body: `9. "Joyeux anniversaire [Prénom] t'as eu des phases d'overthinking et on a tenu le cap avec toi."
Ces phases. Ces spirales. Ces moments où la pensée tournait. Où les scénarios se multipliaient. Où tout était analysé et réanalysé. Et on tenait le cap. On ramenait à la réalité. On restait là pendant les tours. Joyeux anniversaire [Prénom].
Tenir le cap pendant les phases d'overthinking c'est un service précieux,
— Quelqu'un qui t'a ramené à la réalité plusieurs fois et recommencerait 🧠` },
            { id: "a25_s6_010", angle: "Joyeux anniversaire t\'as eu des moments de doute sur tout et on a douté avec toi.", body: `10. "Joyeux anniversaire t'as eu des moments de doute sur tout et on a douté avec toi."
Ces doutes. Ces remises en question. Ces moments où tout semblait incertain. Où les certitudes manquaient. Et on était là. Pas pour tout résoudre. Pas pour tout expliquer. Pour douter avec toi. Pour que ce soit moins lourd à porter seul. Joyeux anniversaire [Prénom].
Douter avec quelqu'un c'est mieux que douter seul,
— Quelqu'un qui a ses propres doutes et apprécie qu'on puisse les partager 💭` },
            { id: "a25_s6_011", angle: "Joyeux anniversaire [Prénom] t\'as pris des décisions sans consulter et on a soutenu après.", body: `11. "Joyeux anniversaire [Prénom] t'as pris des décisions sans consulter et on a soutenu après."
Ces décisions. Prises seul. Sans demander. Sans consulter. Déjà faites quand on les apprenait. Et on soutenait. Parce que c'était ton droit. Parce que le soutien après coup c'est quand même du soutien. Parce qu'on t'aimait quelles que soient les décisions. Joyeux anniversaire [Prénom].
Soutenir les décisions déjà prises c'est respecter l'autonomie de l'autre,
— Quelqu'un qui a soutenu après coup plusieurs fois et le referait 🎯` },
            { id: "a25_s6_012", angle: "Joyeux anniversaire t\'as eu des exigences envers les autres et on a compris.", body: `12. "Joyeux anniversaire t'as eu des exigences envers les autres et on a compris."
Ces exigences. Ces standards. Ces attentes. Que tu avais. Envers les gens autour de toi. Qui étaient parfois hautes. Qui venaient de quelque chose de réel en toi. Et on comprenait. Même quand c'était beaucoup. Joyeux anniversaire [Prénom].
Comprendre les exigences de quelqu'un sans les juger c'est de l'acceptation vraie,
— Quelqu'un qui a compris d'où venaient tes exigences et les a acceptées 🌿` },
            { id: "a25_s6_013", angle: "Joyeux anniversaire [Prénom] t\'as eu des moments de fermeture et on a attendu l\'ouverture.", body: `13. "Joyeux anniversaire [Prénom] t'as eu des moments de fermeture et on a attendu l'ouverture."
Ces moments. Où tu te fermais. Où l'accès était limité. Où le contact était difficile. Où il fallait attendre. Et on attendait. Sans forcer. Sans insister au-delà du raisonnable. En sachant que l'ouverture reviendrait. Joyeux anniversaire [Prénom].
Attendre l'ouverture sans forcer c'est respecter le rythme de l'autre,
— Quelqu'un qui a attendu plusieurs fois et trouvé que l'ouverture valait l'attente 🚪` },
            { id: "a25_s6_014", angle: "Joyeux anniversaire t\'as eu du mal à demander de l\'aide et on a proposé sans attendre.", body: `14. "Joyeux anniversaire t'as eu du mal à demander de l'aide et on a proposé sans attendre."
Cette difficulté. À demander. À dire j'ai besoin. À admettre que c'est trop. Et on proposait. Sans attendre la demande. Parce qu'on voyait. Parce qu'on savait. Parce que l'aide offerte vaut l'aide demandée. Joyeux anniversaire [Prénom].
Proposer sans attendre la demande c'est lire les gens avec attention,
— Quelqu'un qui essaie de voir quand tu as besoin avant que tu le dises 🤲` },
            { id: "a25_s6_015", angle: "Joyeux anniversaire [Prénom] t\'as eu des contradictions et on les a acceptées.", body: `15. "Joyeux anniversaire [Prénom] t'as eu des contradictions et on les a acceptées."
Ces contradictions. Ces trucs qui semblaient pas cohérents. Ces positions qui changeaient. Ces valeurs parfois en tension avec les actes. Ces humains complexités. Et on les acceptait. Parce que les gens simples sont rares et les gens complexes sont intéressants. Joyeux anniversaire [Prénom].
Accepter les contradictions de quelqu'un c'est accepter son humanité complète,
— Quelqu'un qui a ses propres contradictions et apprécie la réciprocité de l'acceptation 🌀` },
            { id: "a25_s6_016", angle: "Joyeux anniversaire t\'as mis du temps à faire confiance et on a attendu.", body: `16. "Joyeux anniversaire t'as mis du temps à faire confiance et on a attendu."
Ce temps. Cette méfiance initiale peut-être. Ces couches à traverser. Ces preuves à accumuler. Ce processus lent. Et on attendait. Sans prendre ça personnellement. En comprenant que la confiance ça se construit. Joyeux anniversaire [Prénom].
Attendre que quelqu'un soit prêt à faire confiance c'est respecter son histoire,
— Quelqu'un qui a attendu et est content d'avoir été patient 🌱` },
            { id: "a25_s6_017", angle: "Joyeux anniversaire [Prénom] t\'as eu du mal à lâcher certains trucs et on a compris.", body: `17. "Joyeux anniversaire [Prénom] t'as eu du mal à lâcher certains trucs et on a compris."
Ces trucs. Ces attachements. Ces choses difficiles à lâcher. Ces situations qu'on gardait plus longtemps que nécessaire peut-être. Ces liens qu'on maintenait au-delà du raisonnable. Et on comprenait. Parce que lâcher c'est difficile pour tout le monde. Joyeux anniversaire [Prénom].
La difficulté à lâcher c'est une forme de fidélité parfois,
— Quelqu'un qui a ses propres difficultés à lâcher et compatit totalement 🤍` },
            { id: "a25_s6_018", angle: "Joyeux anniversaire t\'as occupé beaucoup de place parfois et on a fait de l\'espace.", body: `18. "Joyeux anniversaire t'as occupé beaucoup de place parfois et on a fait de l'espace."
Cette place. Que tu prenais. Pas méchamment. Par ta personnalité. Par tes besoins. Par ce que tu traversais. Et on faisait de l'espace. Parce que certaines personnes méritent qu'on fasse de la place. Parce que toi tu en méritais. Joyeux anniversaire [Prénom].
Faire de l'espace pour quelqu'un c'est un choix actif d'amour,
— Quelqu'un qui a fait de l'espace et ne l'a jamais regretté 🏠` },
            { id: "a25_s6_019", angle: "Joyeux anniversaire [Prénom] avec tout ce que ça implique de t\'aimer on choisit de continuer.", body: `19. "Joyeux anniversaire [Prénom] avec tout ce que ça implique de t'aimer on choisit de continuer."
Ce choix. Actif. Conscient. Renouvelé. Avec la connaissance du dossier. Des belles parties et des moins belles. Des faciles et des compliquées. Et on choisit de continuer. Pas par habitude. Par choix réel. Joyeux anniversaire [Prénom].
L'amour qui se choisit activement est plus fort que celui qui s'installe passivement,
— Quelqu'un qui fait ce choix conscient aujourd'hui et le referait demain 💛` },
            { id: "a25_s6_020", angle: "Joyeux anniversaire t\'es pas toujours le move mais t\'es mon move préféré et c\'est définitif.", body: `20. "Joyeux anniversaire t'es pas toujours le move mais t'es mon move préféré et c'est définitif."
Définitif. Sans appel. Avec tout le contexte. Avec tout le dossier. Avec tout ce qu'on a traversé. T'es le move préféré. Pas parce que t'es parfait. Parce que t'es toi. Et toi c'est ce qu'il y a de mieux disponible. Joyeux anniversaire [Prénom].
Le move préféré c'est définitif et assumé,
— Quelqu'un qui a choisi ce move et le reconfirme aujourd'hui ❤️

Voilà 🎂 Anniversaire — Niveau 18-25 ans complet ! 120 cartes en 6 sous-catégories 🎉` },
          ],
        },
      ],
    },
  ],
  nameday: [
    {
      id: 'ado',
      label: '13-17 ans',
      minAge: 13,
      maxAge: 17,
      subCategories: [
        {
          id: 'tu_geres',
          label: "Tu gères",
          emoji: '🙌',
          messages: [
            { id: "n13_s1_001", angle: "Joyeuse fête frr t\'es une légende et ton prénom le confirme.", body: `1. "Joyeuse fête frr t'es une légende et ton prénom le confirme."
Ton prénom a son jour. Un jour entier. Dans le calendrier. Pour toi. Pour les gens comme toi. Et franchement c'est mérité. Parce que t'es une légende. Une vraie. Vivante. Qui gère ses trucs. Qui existe avec style. Joyeuse fête [Prénom] t'es literally iconic.
Iconic confirmé le jour de ta fête,
— Quelqu'un qui te le dit no cap aujourd'hui 🔥` },
            { id: "n13_s1_002", angle: "Joyeuse fête [Prénom] ton prénom assure autant que toi.", body: `2. "Joyeuse fête [Prénom] ton prénom assure autant que toi."
Ce prénom. Il a une énergie. Une vibe. Il correspond. Il te ressemble. Il dit quelque chose sur toi avant même que les gens te connaissent. Et toi tu confirmes ce que le prénom promettait. T'assures autant que lui. Joyeuse fête [Prénom].
Le prénom et la personne sont au même niveau d'assurance,
— Quelqu'un qui trouve que ton prénom te va parfaitement 💫` },
            { id: "n13_s1_003", angle: "Joyeuse fête frr t\'as un jour dans le calendrier et tu le mérites trop.", body: `3. "Joyeuse fête frr t'as un jour dans le calendrier et tu le mérites trop."
Un jour. À toi. Officiel. Reconnu. Dans le calendrier républicain qui a décidé que ce jour c'était pour les [Prénom]. Et toi t'es un [Prénom] qui mérite ce jour. Qui le remplit. Qui lui donne un sens. Joyeuse fête [Prénom].
Le jour dans le calendrier est amplement mérité,
— Quelqu'un qui pense que le calendrier a bien fait de te réserver ce jour 📅` },
            { id: "n13_s1_004", angle: "Joyeuse fête [Prénom] tu gères ta life et ton prénom le sait.", body: `4. "Joyeuse fête [Prénom] tu gères ta life et ton prénom le sait."
Quelque part dans l'univers ton prénom est fier. Fier de la personne qui le porte. De la façon dont tu le portes. Avec style. Avec énergie. Avec cette façon de gérer les trucs qui t'appartient. Joyeuse fête [Prénom].
Le prénom est fier de son porteur,
— Quelqu'un qui confirme que tu portes bien ce prénom 🌟` },
            { id: "n13_s1_005", angle: "Joyeuse fête frr c\'est le jour de ton prénom et t\'as une aura de ouf.", body: `5. "Joyeuse fête frr c'est le jour de ton prénom et t'as une aura de ouf."
Ce jour. Cette aura. Ces deux trucs ensemble. Ton prénom qui a son moment. Et toi qui as ton aura permanente. L'alignement est parfait. C'est le bon jour pour être toi. Joyeuse fête [Prénom].
L'alignement prénom-aura est optimal aujourd'hui,
— Quelqu'un qui voit l'aura depuis longtemps et confirme qu'elle est là ✨` },
            { id: "n13_s1_006", angle: "Joyeuse fête [Prénom] t\'es built different et ton prénom le sait depuis toujours.", body: `6. "Joyeuse fête [Prénom] t'es built different et ton prénom le sait depuis toujours."
Ce prénom existe depuis longtemps. Porté par des gens différents. Et toi t'as apporté quelque chose de nouveau. Une version built different. Une façon de porter ce prénom que personne avait fait avant. Joyeuse fête [Prénom].
La version built different du prénom c'est toi,
— Quelqu'un qui confirme que t'as rendu ce prénom encore meilleur 🔥` },
            { id: "n13_s1_007", angle: "Joyeuse fête frr ton prénom a de la chance de tomber sur quelqu\'un comme toi.", body: `7. "Joyeuse fête frr ton prénom a de la chance de tomber sur quelqu'un comme toi."
La chance du prénom. D'être porté par quelqu'un qui lui donne vie. Qui lui donne une personnalité. Une énergie. Un sens. Ton prénom a tiré le bon numéro avec toi. Joyeuse fête [Prénom].
Le prénom a eu de la chance et il le sait,
— Quelqu'un qui pense que c'est réciproque d'ailleurs 🎲` },
            { id: "n13_s1_008", angle: "Joyeuse fête [Prénom] t\'as un jour entier pour toi et tu gères ça avec style.", body: `8. "Joyeuse fête [Prénom] t'as un jour entier pour toi et tu gères ça avec style."
Ce jour. Ces vingt-quatre heures officiellement à ton prénom. Et toi tu gères ça. Avec style. Avec cette façon d'être toi qui est juste au-dessus. Cette façon d'occuper un jour qui t'appartient. Joyeuse fête [Prénom].
Gérer son jour avec style c'est un talent,
— Quelqu'un qui observe ton style et le valide aujourd'hui 😎` },
            { id: "n13_s1_009", angle: "Joyeuse fête frr les gens qui portent ton prénom sont chanceux de te compter parmi eux.", body: `9. "Joyeuse fête frr les gens qui portent ton prénom sont chanceux de te compter parmi eux."
Cette communauté. Tous les [Prénom] du monde. Qui partagent ce prénom. Et toi t'es dans cette communauté. Et tu l'élèves. Tu représentes bien. T'es la version que les autres [Prénom] aimeraient être. Joyeuse fête [Prénom].
La représentation des [Prénom] dans le monde est assurée grâce à toi,
— Quelqu'un qui confirme que t'es une bonne ambassadrice ou ambassadeur du prénom 🌍` },
            { id: "n13_s1_010", angle: "Joyeuse fête [Prénom] t\'assures tellement que même le saint de ton prénom est impressionné.", body: `10. "Joyeuse fête [Prénom] t'assures tellement que même le saint de ton prénom est impressionné."
Ce saint. Quelque part. Qui regarde. Qui voit comment son prénom est porté aujourd'hui. Et qui est impressionné. Par ton énergie. Par ta façon de gérer. Par ce que tu fais avec ce prénom qu'on partage. Joyeuse fête [Prénom].
Le saint est impressionné c'est confirmé,
— Quelqu'un qui pense que le saint valide totalement ta façon de porter le prénom 🙏` },
            { id: "n13_s1_011", angle: "Joyeuse fête frr t\'as une énergie de ouf et aujourd\'hui c\'est officiel.", body: `11. "Joyeuse fête frr t'as une énergie de ouf et aujourd'hui c'est officiel."
Officiel. Certifié. Validé par le calendrier. T'as une énergie de ouf et ce jour c'est la reconnaissance institutionnelle de cette énergie. C'est le jour où le système dit ouais on le sait. Joyeuse fête [Prénom].
La reconnaissance institutionnelle de l'énergie est accordée,
— Quelqu'un qui la reconnaissait depuis avant le calendrier ⚡` },
            { id: "n13_s1_012", angle: "Joyeuse fête [Prénom] tu slay et ton prénom slay avec toi.", body: `12. "Joyeuse fête [Prénom] tu slay et ton prénom slay avec toi."
Ce tandem. Toi et ton prénom. Qui slayent ensemble. Qui font équipe. Qui se renforcent mutuellement. Ce prénom qui prend de la valeur parce que t'es toi. Joyeuse fête [Prénom].
Le tandem prénom-personne est un slay collectif,
— Quelqu'un qui confirme que le tandem assure totalement 💅` },
            { id: "n13_s1_013", angle: "Joyeuse fête frr t\'as un jour dans le calendrier et t\'as une squad qui le célèbre.", body: `13. "Joyeuse fête frr t'as un jour dans le calendrier et t'as une squad qui le célèbre."
Ce jour. Cette squad. Ces gens qui pensent à toi aujourd'hui. Qui envoient des messages. Qui célèbrent. Parce que t'es quelqu'un qui mérite une squad. Qui mérite des gens qui célèbrent. Joyeuse fête [Prénom].
La squad qui célèbre dit quelque chose sur la personne célébrée,
— Quelqu'un qui fait partie de la squad et est content d'en faire partie 🎉` },
            { id: "n13_s1_014", angle: "Joyeuse fête [Prénom] no cap t\'es top tier et aujourd\'hui c\'est ton jour.", body: `14. "Joyeuse fête [Prénom] no cap t'es top tier et aujourd'hui c'est ton jour."
Top tier. Ce classement. Cette catégorie supérieure. Et aujourd'hui c'est le jour des top tier comme toi. Le jour où le calendrier met en avant les personnes qui méritent d'être mises en avant. Joyeuse fête [Prénom].
Le top tier a son jour et c'est aujourd'hui,
— Quelqu'un qui confirme le classement top tier sans hésitation 🏆` },
            { id: "n13_s1_015", angle: "Joyeuse fête frr tu gères les trucs et ton prénom le rappelle chaque année.", body: `15. "Joyeuse fête frr tu gères les trucs et ton prénom le rappelle chaque année."
Ce rappel annuel. Ce jour qui revient. Qui dit chaque année que t'existes. Que ton prénom existe. Que tu gères. Ce rendez-vous calendaire avec ta propre existence qui gère. Joyeuse fête [Prénom].
Le rappel annuel de l'existence qui gère c'est précieux,
— Quelqu'un qui note ce rendez-vous avec plaisir chaque année 🗓️` },
            { id: "n13_s1_016", angle: "Joyeuse fête [Prénom] t\'as un prénom qui te va et une personnalité qui assure.", body: `16. "Joyeuse fête [Prénom] t'as un prénom qui te va et une personnalité qui assure."
Cette correspondance. Entre le prénom et la personnalité. Ce match parfait. Ce prénom choisi ou donné qui finalement te correspond exactement. Et cette personnalité qui assure largement. Joyeuse fête [Prénom].
Le match prénom-personnalité est confirmé,
— Quelqu'un qui trouve que t'as eu ou donné le bon prénom 🎯` },
            { id: "n13_s1_017", angle: "Joyeuse fête frr c\'est ton jour et t\'es W comme toujours.", body: `17. "Joyeuse fête frr c'est ton jour et t'es W comme toujours."
Comme toujours. Cette constance du W. Qui ne dépend pas du jour. Qui est là le 364 autres jours aussi. Mais aujourd'hui c'est officiel. Le jour de la fête le W est certifié institutionnellement. Joyeuse fête [Prénom].
Le W institutionnellement certifié aujourd'hui,
— Quelqu'un qui certifiait ce W avant même le calendrier 🥇` },
            { id: "n13_s1_018", angle: "Joyeuse fête [Prénom] tu mérites ce jour et tous les messages qui viennent avec.", body: `18. "Joyeuse fête [Prénom] tu mérites ce jour et tous les messages qui viennent avec."
Ces messages. Ces notifications. Ces gens qui pensent à toi. Ces reconnaissances. Tu les mérites. Chacune. Parce que t'es quelqu'un qui mérite qu'on pense à lui. Qu'on lui envoie quelque chose. Qu'on prenne le temps. Joyeuse fête [Prénom].
Chaque message reçu aujourd'hui est mérité,
— Quelqu'un qui a pris le temps et confirme que c'était évident 📱` },
            { id: "n13_s1_019", angle: "Joyeuse fête frr t\'as une vibe unique et le calendrier t\'a réservé un jour.", body: `19. "Joyeuse fête frr t'as une vibe unique et le calendrier t'a réservé un jour."
Ce jour réservé. Pour cette vibe unique. Pour cette façon d'être. Pour cette personnalité qui méritait un jour dans le calendrier. Et le calendrier a bien fait. Joyeuse fête [Prénom].
Le calendrier a fait le bon choix en réservant ce jour,
— Quelqu'un qui valide la décision du calendrier à 100% 🌟` },
            { id: "n13_s1_020", angle: "Joyeuse fête [Prénom] no cap t\'es une des meilleures personnes que je connais et ton prénom le confirme.", body: `20. "Joyeuse fête [Prénom] no cap t'es une des meilleures personnes que je connais et ton prénom le confirme."
Ce prénom. Qui confirme. Qui dit quelque chose. Qui aujourd'hui prend toute la place pour dire ce que tu représentes. Et ce que tu représentes c'est une des meilleures personnes. No cap. Joyeuse fête [Prénom].
No cap absolu sur cette déclaration aujourd'hui,
— Quelqu'un qui le pense vraiment et profite de ta fête pour le dire ❤️` },
          ],
        },
        {
          id: 'chelou',
          label: "T'es chelou mais t'es mon chelou",
          emoji: '🌀',
          messages: [
            { id: "n13_s2_001", angle: "Joyeuse fête à toi et à ton prénom chelou d\'être fêté.", body: `001. "Joyeuse fête à toi et à ton prénom chelou d'être fêté."
Sérieusement t'as un saint qui s'appelle comme toi et ce saint a un jour dans le calendrier et ce jour c'est aujourd'hui et on est censés fêter ça. C'est le truc le plus bizarre que j'aie entendu depuis que t'as expliqué ton système pour ranger tes playlists. Mais bon. T'es chelou. Ta fête est chelou. C'est cohérent. Joyeuse fête, [Prénom].
Avec acceptation totale du chelou que t'es et de la fête que c'est,
— ton ami qui a arrêté de chercher la logique dans tout ce que tu fais 🙃` },
            { id: "n13_s2_002", angle: "T\'as un prénom. Ce prénom a un saint. Ce saint a une fête. T\'as décidé que c\'était important.", body: `002. "T'as un prénom. Ce prénom a un saint. Ce saint a une fête. T'as décidé que c'était important."
J'aurais pu passer cette journée sans savoir que t'avais une fête du prénom. Mais non. T'as prévenu une semaine à l'avance. T'as mis un rappel sur le groupe. T'as fait en sorte qu'on sache. C'est tellement toi. Insister pour exister. Joyeuse fête, [Prénom], continue d'insister.
Avec respect pour ta capacité à transformer n'importe quoi en événement,
— ton ami qui a finalement mis le rappel aussi 📅` },
            { id: "n13_s2_003", angle: "La façon dont tu fêtes ta fête du prénom dit beaucoup sur toi.", body: `003. "La façon dont tu fêtes ta fête du prénom dit beaucoup sur toi."
D'autres gens laissent passer. Pas toi. Toi tu notes. Tu rappelles. Tu attends que les gens y pensent. Et si ils oublient tu fais cette tête. Cette tête précise que t'as quand quelqu'un rate quelque chose d'important selon toi. Je connais cette tête. Je la redoute. Joyeuse fête, [Prénom], j'avais pas oublié.
Avec soulagement d'avoir pensé à envoyer ça à temps,
— ton ami qui a coché la case pour éviter la tête 😬` },
            { id: "n13_s2_004", angle: "T\'es la seule personne que je connais qui traite sa fête du prénom comme son anniversaire.", body: `004. "T'es la seule personne que je connais qui traite sa fête du prénom comme son anniversaire."
Niveau d'excitation pareil. Niveau d'attente pareil. Niveau de déception si les gens oublient pareil. T'as deux jours dans l'année où t'exiges d'être célébré et honnêtement ça me semble raisonnable. T'as raison de prendre ton espace. Joyeuse fête, [Prénom].
Avec admiration pour ta façon de revendiquer tes deux jours sans complexe,
— ton ami qui se demande si lui aussi devrait commencer à fêter son prénom 🤔` },
            { id: "n13_s2_005", angle: "Joyeuse fête à mon ami le plus particulier.", body: `005. "Joyeuse fête à mon ami le plus particulier."
Particulier dans le sens : tu fais les choses d'une façon que personne d'autre ferait. Ta façon de parler. Ta façon de réagir. Ta façon d'être content de quelque chose. Ta façon d'être vexé. Tout est calibré différemment chez toi. C'est chelou. C'est toi. Joyeuse fête, [Prénom].
Avec affection pour ton calibrage unique,
— ton ami qui a fini par trouver ça normal 🎛️` },
            { id: "n13_s2_006", angle: "Y\'a des choses chez toi que j\'ai arrêté d\'essayer de comprendre.", body: `006. "Y'a des choses chez toi que j'ai arrêté d'essayer de comprendre."
Pourquoi tu fais ça comme ça. Pourquoi tu réagis à ça comme ça. Pourquoi t'aimes ce truc précis et pas l'autre. J'ai arrêté de chercher. J'accepte. Et honnêtement depuis que j'ai arrêté de chercher à comprendre je profite beaucoup mieux de ta compagnie. Joyeuse fête, [Prénom], mystère que t'es.
Avec paix retrouvée depuis l'abandon de la recherche de logique,
— ton ami qui a fait la paix avec le fait de pas tout comprendre 🤷` },
            { id: "n13_s2_007", angle: "Tu te souviens du truc que t\'as fait l\'année dernière à ta fête du prénom ?", body: `007. "Tu te souviens du truc que t'as fait l'année dernière à ta fête du prénom ?"
Moi oui. Je m'en souviendrai probablement longtemps. C'était tellement typiquement toi que j'aurais pu le prédire si quelqu'un m'avait demandé. Personne d'autre que toi aurait fait exactement ça de cette façon-là à ce moment-là. C'est pour ça que c'est chelou. Et c'est pour ça que c'est bien. Joyeuse fête, [Prénom].
Avec mémoire intacte de tous tes moments chelous pour toujours,
— ton ami qui archive mentalement chaque épisode 🗂️` },
            { id: "n13_s2_008", angle: "Joyeuse fête. T\'es le genre de personne qui a une fête du prénom et qui s\'en souvient.", body: `008. "Joyeuse fête. T'es le genre de personne qui a une fête du prénom et qui s'en souvient."
Dans notre groupe y'a des gens qui ont une fête du prénom et qui savent même pas quand c'est. Toi c'est marqué quelque part. Noté. Suivi. Tu te rappelles que t'existes et tu t'assures que les autres s'en rappellent aussi. C'est chelou mais c'est une qualité. Joyeuse fête, [Prénom].
Avec reconnaissance pour ta façon de te rappeler que t'existes,
— ton ami qui parfois oublie même son propre prénom 😅` },
            { id: "n13_s2_009", angle: "Tu peux pas savoir à quel point ta façon d\'être chelou est précise.", body: `009. "Tu peux pas savoir à quel point ta façon d'être chelou est précise."
C'est pas chelou en général. C'est chelou de façon très ciblée. Dans des situations très spécifiques. Tu fonctionnes normalement pendant des jours et puis y'a ce moment. Ce moment très précis où tu fais quelque chose que personne avait anticipé. Et tout le monde te regarde. Et toi tu vois pas pourquoi. Joyeuse fête, [Prénom].
Avec documentation de tous tes moments chelous ciblés,
— ton ami expert en prévision de tes comportements imprévisibles 📊` },
            { id: "n13_s2_010", angle: "Joyeuse fête à toi qui assumes tout ce que t\'es.", body: `010. "Joyeuse fête à toi qui assumes tout ce que t'es."
C'est ça le truc en fait. T'es chelou mais tu le sais et tu t'en fous. T'assumes tes goûts bizarres. T'assumes tes réactions décalées. T'assumes ta façon d'être. Y'a des gens qui passent des années à essayer de pas être chelou. Toi tu l'as jamais essayé. Respect. Joyeuse fête, [Prénom].
Avec respect sincère pour ton absence totale de complexe,
— ton ami qui essaie d'apprendre de toi sur ce point 🫡` },
            { id: "n13_s2_011", angle: "T\'as des opinions sur des trucs tellement précis que j\'arrive même pas à suivre.", body: `011. "T'as des opinions sur des trucs tellement précis que j'arrive même pas à suivre."
T'as une opinion sur le format exact d'une bonne notification. T'as une opinion sur la bonne façon de dire au revoir. T'as une opinion sur des détails que les autres gens ont jamais remarqués. Et ces opinions sont toujours très arrêtées. C'est chelou. C'est fascinant. Joyeuse fête, [Prénom].
Avec fascination pour la précision de tes opinions sur les petites choses,
— ton ami qui prend des notes pour suivre 📝` },
            { id: "n13_s2_012", angle: "La première fois qu\'on s\'est parlé j\'ai pas compris la moitié de ce que t\'as dit.", body: `012. "La première fois qu'on s'est parlé j'ai pas compris la moitié de ce que t'as dit."
Pas parce que tu parlais mal. Parce que tu parlais chelou. Ta façon de formuler. Tes références. Ta logique interne. J'ai mis du temps à décoder. Maintenant je comprends presque tout. Presque. Y'a encore des phrases où je hoche la tête en espérant. Joyeuse fête, [Prénom], je progresse.
Avec bilan d'apprentissage positif après toutes ces années,
— ton ami encore en formation mais qui fait des progrès 📈` },
            { id: "n13_s2_013", angle: "Joyeuse fête. Quelqu\'un devait te dire que t\'es vraiment toi.", body: `013. "Joyeuse fête. Quelqu'un devait te dire que t'es vraiment toi."
Vraiment toi dans le sens : y'a pas beaucoup de filtres. Ce que tu penses arrive assez vite dans ce que tu dis. Ce que tu ressens se lit assez vite sur ta tête. T'es transparent d'une façon chelou. Et honnêtement dans un monde où tout le monde fait semblant c'est reposant. Joyeuse fête, [Prénom].
Avec gratitude pour ta transparence involontaire,
— ton ami à qui ça repose de pas avoir à deviner ce que tu penses 🔍` },
            { id: "n13_s2_014", angle: "T\'as une énergie très particulière les jours de fête.", body: `014. "T'as une énergie très particulière les jours de fête."
Un niveau d'enthousiasme légèrement au-dessus de la normale. Une façon de vérifier que les gens ont pensé à toi. Une attention aux messages reçus. C'est chelou mais c'est aussi touchant de voir quelqu'un qui veut vraiment être célébré et qui l'assume. Joyeuse fête, [Prénom].
Avec tendresse pour ton énergie de fête assumée,
— ton ami qui trouve ça finalement assez attendrissant 🥺` },
            { id: "n13_s2_015", angle: "Y\'a des trucs que tu fais que je ferais jamais. Mais que je suis content de regarder.", body: `015. "Y'a des trucs que tu fais que je ferais jamais. Mais que je suis content de regarder."
Tes plans. Tes idées. Tes façons de gérer des situations. Moi j'aurais fait différemment. Toi tu fais comme ça. Et souvent ça marche d'une façon bizarre que j'aurais pas prévue. C'est chelou. Mais c'est efficace. Et c'est divertissant. Joyeuse fête, [Prénom].
Avec appréciation pour le spectacle que tu offres régulièrement,
— ton ami spectateur de tes méthodes non conventionnelles 🎭` },
            { id: "n13_s2_016", angle: "Joyeuse fête à mon ami qui a une logique que je comprends pas mais qui fonctionne.", body: `016. "Joyeuse fête à mon ami qui a une logique que je comprends pas mais qui fonctionne."
Tu arrives à des conclusions par des chemins que je suis pas. Tu prends des décisions avec des critères que j'aurais pas utilisés. Et pourtant les résultats sont là. Ta vie a l'air de fonctionner. Peut-être que c'est moi le chelou en fait. Joyeuse fête, [Prénom].
Avec remise en question de qui est vraiment chelou entre nous deux,
— ton ami qui commence à douter de sa propre normalité 🤨` },
            { id: "n13_s2_017", angle: "Tu te souviens du moment où j\'ai réalisé que t\'étais mon ami chelou préféré ?", body: `017. "Tu te souviens du moment où j'ai réalisé que t'étais mon ami chelou préféré ?"
C'était ce moment précis. Ce truc que t'as fait. Cette façon d'être tellement toi que j'ai compris que j'avais besoin de t'avoir dans ma vie. Pas malgré le chelou. Grâce au chelou. C'est le chelou qui m'a convaincu. Joyeuse fête, [Prénom].
Avec clarté sur le moment fondateur de notre amitié chelou,
— ton ami converti par l'un de tes épisodes les plus chelous 🎯` },
            { id: "n13_s2_018", angle: "Joyeuse fête. Je sais même pas comment te décrire aux gens qui te connaissent pas.", body: `018. "Joyeuse fête. Je sais même pas comment te décrire aux gens qui te connaissent pas."
Je dis quelqu'un de cool. Mais c'est pas assez précis. Je dis quelqu'un de marrant. Mais c'est pas que ça. Je dis quelqu'un de chelou. Et là les gens demandent chelou comment. Et je dis chelou d'une façon qu'il faut voir pour comprendre. Joyeuse fête, [Prénom], t'es indescriptible.
Avec capitulation devant l'impossibilité de te décrire correctement,
— ton ami qui a abandonné et dit juste viens rencontrer cette personne 🤌` },
            { id: "n13_s2_019", angle: "Joyeuse fête à toi qui rends les jours ordinaires moins ordinaires.", body: `019. "Joyeuse fête à toi qui rends les jours ordinaires moins ordinaires."
Y'a des jours où il se passe rien. Et puis t'es là. Et il se passe quelque chose. Souvent quelque chose d'inattendu. Souvent quelque chose que j'aurais pas pu prédire. Souvent quelque chose de chelou. Mais quelque chose. Joyeuse fête, [Prénom], tu remplis les jours.
Avec reconnaissance pour ton talent à remplir les jours vides,
— ton ami qui sait que les jours avec toi seront jamais vides 🎪` },
            { id: "n13_s2_020", angle: "Joyeuse fête. T\'es chelou mais t\'es mon chelou. Et je changerais rien.", body: `020. "Joyeuse fête. T'es chelou mais t'es mon chelou. Et je changerais rien."
Vraiment rien. Même les trucs qui m'énervent. Même les trucs que je comprends pas. Même les moments où je me demande comment t'es arrivé à cette conclusion. Tout ça c'est toi. Et toi c'est mon ami. Et mon ami est chelou. Et je suis bien avec ça. Joyeuse fête, [Prénom].
Avec affirmation définitive et sans réserve,
— ton ami pour le chelou long terme ❤️` },
          ],
        },
        {
          id: 'vieilli',
          label: "Franchement t'as vieilli",
          emoji: '😄',
          messages: [
            { id: "n13_s3_001", angle: "Joyeuse fête. T\'as un an de plus dans le prénom aussi.", body: `001. "Joyeuse fête. T'as un an de plus dans le prénom aussi."
Je sais pas si ça compte officiellement mais à chaque fête du prénom je te regarde et je me dis que t'es clairement pas la même personne qu'il y a un an. Même prénom. Personne différente. C'est chelou le temps. Joyeuse fête, [Prénom].
Avec observation philosophique du temps qui passe via le calendrier des saints,
— ton ami qui se fait la même réflexion sur lui-même et c'est flippant 🕰️` },
            { id: "n13_s3_002", angle: "T\'as l\'âge que t\'as et franchement ça se voit.", body: `002. "T'as l'âge que t'as et franchement ça se voit."
Pas dans le mauvais sens. Dans le sens : t'es plus la personne que j'ai rencontrée. T'as des opinions maintenant. T'as des limites maintenant. T'as une façon d'être qui s'est précisée. C'est ça vieillir en fait. Devenir plus toi. Joyeuse fête, [Prénom].
Avec constat positif que vieillir c'est devenir plus soi,
— ton ami qui observe ta précision croissante avec admiration 🔭` },
            { id: "n13_s3_003", angle: "Joyeuse fête. T\'aurais pas dit ça il y a deux ans.", body: `003. "Joyeuse fête. T'aurais pas dit ça il y a deux ans."
La phrase que t'as dite l'autre jour. Cette opinion. Cette façon de voir les choses. Y'a deux ans t'aurais pensé différemment. T'aurais réagi différemment. Le fait que tu penses ça maintenant dit que quelque chose a changé. Que t'as vécu des trucs. Que t'as grandi. Joyeuse fête, [Prénom].
Avec archivage mental de qui t'étais avant et comparaison avec maintenant,
— ton ami qui conserve les versions précédentes de toi pour référence 📁` },
            { id: "n13_s3_004", angle: "Y\'a des trucs que tu faisais avant que tu ferais plus maintenant.", body: `004. "Y'a des trucs que tu faisais avant que tu ferais plus maintenant."
Je les connais ces trucs. Je t'ai vu les faire. Et je t'ai vu arrêter de les faire. Pas parce que quelqu'un t'a dit d'arrêter. Parce que t'as décidé que c'était plus toi. C'est ça grandir. Décider ce qui est toi et ce qui l'est plus. Joyeuse fête, [Prénom].
Avec respect pour tes décisions silencieuses sur ce qui te ressemble et ce qui te ressemble plus,
— ton ami qui a vu toutes les versions de toi et préfère celle-là 🎯` },
            { id: "n13_s3_005", angle: "Joyeuse fête. Tu t\'énerves pour des trucs différents qu\'avant.", body: `005. "Joyeuse fête. Tu t'énerves pour des trucs différents qu'avant."
Avant c'était autre chose qui te mettait hors de toi. Maintenant c'est ça. L'évolution de ce qui t'énerve dit beaucoup sur où t'en es. Sur ce qui compte pour toi. Sur ce que tu tolères plus. Ton énervement est devenu plus précis. C'est mûr ça. Joyeuse fête, [Prénom].
Avec analyse de l'évolution de tes énervements comme indicateur de maturité,
— ton ami chercheur en cartographie de tes déclencheurs 📊` },
            { id: "n13_s3_006", angle: "T\'as commencé à dire des trucs que les adultes disent.", body: `006. "T'as commencé à dire des trucs que les adultes disent."
J'allais te le signaler mais j'ai réalisé que moi aussi j'avais commencé. C'est peut-être ça le vrai signe qu'on grandit. Pas les anniversaires. Pas les fêtes du prénom. Le moment où les phrases qu'on imitait deviennent les phrases qu'on dit vraiment. Joyeuse fête, [Prénom].
Avec solidarité dans notre glissement commun vers le vocabulaire adulte,
— ton ami qui a aussi commencé à dire ces trucs et qui l'assume moyennement 😬` },
            { id: "n13_s3_007", angle: "Joyeuse fête. Ta façon de gérer les trucs difficiles a changé.", body: `007. "Joyeuse fête. Ta façon de gérer les trucs difficiles a changé."
Je t'ai vu gérer des trucs difficiles il y a quelques années. Et je t'ai vu en gérer d'autres récemment. C'est pas pareil. T'as développé des réflexes. Des façons de faire. Une espèce de calme que t'avais pas avant. Ou en tout cas une meilleure simulation du calme. Joyeuse fête, [Prénom].
Avec observation de l'évolution de ta gestion du difficile sur plusieurs années,
— ton ami témoin de long terme et plutôt impressionné 👀` },
            { id: "n13_s3_008", angle: "Tu te souviens comme on réagissait à des trucs il y a trois ans ?", body: `008. "Tu te souviens comme on réagissait à des trucs il y a trois ans ?"
Je me souviens. Et si je te montrais une vidéo de nous à l'époque je pense qu'on aurait tous les deux un peu honte. Pas vraiment honte. Plutôt cette sensation de voir quelqu'un qui était toi mais qui est plus tout à fait toi. C'est normal. C'est bien même. Joyeuse fête, [Prénom].
Avec gratitude collective pour le chemin parcouru depuis nos versions précédentes,
— ton ami qui brûlerait volontiers certaines preuves de nos années d'avant 🔥` },
            { id: "n13_s3_009", angle: "Joyeuse fête. T\'as l\'air de savoir ce que tu veux un peu plus qu\'avant.", body: `009. "Joyeuse fête. T'as l'air de savoir ce que tu veux un peu plus qu'avant."
Pas complètement. Pas toujours. Mais il y a des moments où tu parles de ce que tu veux faire et y'a une clarté dedans. Une direction. Un truc qui ressemble à une intention. C'est nouveau ça. C'est bien. Joyeuse fête, [Prénom].
Avec observation de ta clarté croissante sur ce que tu veux,
— ton ami qui cherche encore la sienne et qui prend des notes sur toi 📝` },
            { id: "n13_s3_010", angle: "Les trucs qui t\'impressionnaient avant t\'impressionnent plus pareil.", body: `010. "Les trucs qui t'impressionnaient avant t'impressionnent plus pareil."
Y'a des choses qui nous faisaient effet à une époque. Des gens. Des situations. Des performances. Et maintenant on regarde ça différemment. Pas froidement. Juste avec plus de recul. C'est ça aussi grandir. Changer d'échelle. Joyeuse fête, [Prénom].
Avec réflexion partagée sur l'évolution de nos échelles d'impression,
— ton ami qui constate la même chose chez lui et trouve ça un peu mélancolique 🌅` },
            { id: "n13_s3_011", angle: "Joyeuse fête. T\'es moins pressé sur certains trucs et plus pressé sur d\'autres.", body: `011. "Joyeuse fête. T'es moins pressé sur certains trucs et plus pressé sur d'autres."
J'ai remarqué. Les trucs qui t'urgentaient avant te semblent moins urgents. Et des trucs que tu reportais t'urgentent maintenant. C'est le réajustement de ce qui compte. C'est en cours. C'est bien en cours. Joyeuse fête, [Prénom].
Avec observation de ton réajustement des urgences en temps réel,
— ton ami qui fait le même réajustement de son côté 🔄` },
            { id: "n13_s3_012", angle: "T\'as vieilli mais dans le bon sens du terme.", body: `012. "T'as vieilli mais dans le bon sens du terme."
Le bon sens du terme c'est : t'as gardé ce qui était bien chez toi et t'as mis à jour le reste. T'as pas perdu l'essentiel. T'as juste amélioré l'emballage et mis à jour certains logiciels. T'es une version améliorée. Joyeuse fête, [Prénom].
Avec métaphore technologique probablement trop précise mais qui te correspond,
— ton ami qui te voit comme une mise à jour réussie 📲` },
            { id: "n13_s3_013", angle: "Joyeuse fête. Tu ris de trucs différents qu\'avant.", body: `013. "Joyeuse fête. Tu ris de trucs différents qu'avant."
Les trucs qui te faisaient mourir de rire il y a quelques années te font encore sourire mais c'est plus pareil. Et des trucs qui te passaient au-dessus te font maintenant vraiment rire. L'évolution de ce qui fait rire quelqu'un c'est l'évolution de qui il est. Joyeuse fête, [Prénom].
Avec analyse de l'évolution de tes déclencheurs de rire comme portrait de toi,
— ton ami qui suit attentivement les mises à jour de ton sens de l'humour 😄` },
            { id: "n13_s3_014", angle: "On a grandi ensemble et c\'est chelou de réaliser ça.", body: `014. "On a grandi ensemble et c'est chelou de réaliser ça."
On était plus jeunes. On pensait des trucs différents. On réagissait différemment. Et on a fait ça ensemble. En parallèle. En se regardant grandir. C'est chelou et c'est une chance en même temps. Joyeuse fête, [Prénom].
Avec émotion soudaine et inattendue sur la chance qu'on a eu de grandir en parallèle,
— ton ami qui devient philosophe sans prévenir parfois 🫂` },
            { id: "n13_s3_015", angle: "Joyeuse fête. T\'as plus peur des mêmes trucs.", body: `015. "Joyeuse fête. T'as plus peur des mêmes trucs."
Les peurs évoluent. Ce qui était flippant avant l'est moins. Et des trucs auxquels on pensait pas commencent à avoir l'air un peu flippants. C'est normal. C'est l'ajustement des peurs à la réalité de ce qu'on comprend mieux. Joyeuse fête, [Prénom], même si c'est un peu existentiel comme pensée.
Avec observation de l'évolution de tes peurs comme indicateur de ta compréhension du monde,
— ton ami qui pense trop à des trucs comme ça les jours de fête 🎃` },
            { id: "n13_s3_016", angle: "T\'as des responsabilités maintenant et tu les gères.", body: `016. "T'as des responsabilités maintenant et tu les gères."
Petites responsabilités. Pas encore les grandes. Mais des vraies. Des trucs qui comptent. Des trucs qui dépendent de toi. Et tu les gères. Pas toujours parfaitement. Mais tu les gères. C'est plus jeune que ça. Joyeuse fête, [Prénom].
Avec constat factuel et sincère de ta capacité à gérer ce qui te revient,
— ton ami qui trouve ça impressionnant même si il le dit rarement 🫡` },
            { id: "n13_s3_017", angle: "Joyeuse fête. La version de toi d\'il y a trois ans serait impressionnée par toi maintenant.", body: `017. "Joyeuse fête. La version de toi d'il y a trois ans serait impressionnée par toi maintenant."
Je dis pas que t'es parfait. Je dis que si t'avais pu te voir maintenant depuis l'époque t'aurais pensé ah ouais ok il/elle s'en sort bien. C'est pas rien. C'est même assez bien. Joyeuse fête, [Prénom].
Avec perspective temporelle qui change la façon de voir où t'en es,
— ton ami qui te demande d'appliquer cette perspective toi-même de temps en temps 📐` },
            { id: "n13_s3_018", angle: "T\'as l\'air de moins chercher à prouver des trucs.", body: `018. "T'as l'air de moins chercher à prouver des trucs."
Avant y'avait plus d'énergie dans les démonstrations. Maintenant t'es plus dans l'être que dans le montrer. Ou en tout cas t'oscilles mieux entre les deux. C'est un signe. Un bon. Joyeuse fête, [Prénom].
Avec observation subtile mais réelle de cette évolution dans ta façon d'être,
— ton ami qui la remarque même si il en parle pas d'habitude 🌿` },
            { id: "n13_s3_019", angle: "Joyeuse fête. T\'as grandi et moi aussi et on est encore là ensemble.", body: `019. "Joyeuse fête. T'as grandi et moi aussi et on est encore là ensemble."
C'est pas acquis. Des gens grandissent et partent dans des directions différentes et se perdent. Nous on a grandi et on est encore là. Ça veut dire quelque chose. Ça veut dire qu'on a choisi de rester dans le périmètre l'un de l'autre. Joyeuse fête, [Prénom].
Avec prise de conscience de ce que ça représente d'être encore là après tout ça,
— ton ami qui choisit de rester dans ton périmètre consciemment 💛` },
            { id: "n13_s3_020", angle: "Joyeuse fête. T\'as vieilli. Moi aussi. Et franchement on s\'en sort pas trop mal.", body: `020. "Joyeuse fête. T'as vieilli. Moi aussi. Et franchement on s'en sort pas trop mal."
On est pas parfaits. On a encore des trucs à régler. Des trucs à apprendre. Des trucs à arrêter. Mais dans l'ensemble. Vue d'ensemble. On est des gens qui avancent. Qui grandissent. Qui font ce qu'ils peuvent. Joyeuse fête, [Prénom], on fait pas trop mal.
Avec bilan d'ensemble honnête et plutôt positif,
— ton ami pour la suite du vieillissement collectif 🚀` },
          ],
        },
        {
          id: 'trucs',
          label: "On a vécu des trucs",
          emoji: '🧡',
          messages: [
            { id: "n13_s4_001", angle: "Joyeuse fête. On a quand même vécu des trucs toi et moi.", body: `001. "Joyeuse fête. On a quand même vécu des trucs toi et moi."
Pas des trucs de dingue. Pas des aventures de film. Des trucs normaux mais qui étaient les nôtres. Des moments où on était là tous les deux et où il se passait quelque chose. Ces trucs-là ils existent que pour nous. Personne d'autre a exactement ces souvenirs. Joyeuse fête, [Prénom].
Avec conscience de l'exclusivité de nos souvenirs communs,
— ton ami gardien de sa moitié de l'histoire qu'on a construite 🗝️` },
            { id: "n13_s4_002", angle: "T\'as été là des fois où j\'avais besoin que quelqu\'un soit là.", body: `002. "T'as été là des fois où j'avais besoin que quelqu'un soit là."
Tu savais pas forcément que j'en avais besoin. Peut-être que t'étais juste là par hasard. Mais t'étais là. Et ça comptait. Et je l'ai pas dit à l'époque. Je le dis maintenant. Joyeuse fête, [Prénom].
Avec retard assumé sur un remerciement qui aurait dû venir plus tôt,
— ton ami qui règle ses dettes émotionnelles les jours de fête 💛` },
            { id: "n13_s4_003", angle: "Joyeuse fête. On a survécu à des trucs ensemble.", body: `003. "Joyeuse fête. On a survécu à des trucs ensemble."
Des petits trucs. Des moments compliqués. Des situations où on savait pas trop comment ça allait finir. Et ça a fini. Et on est là. Ensemble encore. C'est pas rien de survivre aux trucs même quand les trucs sont pas dramatiques. Joyeuse fête, [Prénom].
Avec fierté tranquille d'avoir traversé les trucs et d'être encore là,
— ton ami survivant avec toi depuis le début 🏅` },
            { id: "n13_s4_004", angle: "Y\'a des trucs qu\'on a vécus ensemble que je pourrais raconter à personne d\'autre.", body: `004. "Y'a des trucs qu'on a vécus ensemble que je pourrais raconter à personne d'autre."
Pas parce que c'est honteux. Parce que personne d'autre comprendrait vraiment. Faudrait tout réexpliquer. Le contexte. Les personnes. L'ambiance. Et même avec tout ça ils comprendraient pas pareil. Certaines choses sont que pour ceux qui étaient là. Joyeuse fête, [Prénom].
Avec respect pour les trucs qui n'appartiennent qu'à ceux qui étaient là,
— ton ami dépositaire de plusieurs de ces trucs 🔒` },
            { id: "n13_s4_005", angle: "Joyeuse fête. Je me souviens du premier truc un peu difficile qu\'on a traversé ensemble.", body: `005. "Joyeuse fête. Je me souviens du premier truc un peu difficile qu'on a traversé ensemble."
On savait pas trop comment se comporter. On avait pas les codes. On a fait ce qu'on pouvait. C'était maladroit. Mais c'était sincère. Et on s'en est sortis. Et ça a posé quelque chose entre nous. Une base. Joyeuse fête, [Prénom].
Avec mémoire intacte de ce premier truc difficile et de ce qu'il a posé,
— ton ami qui sait exactement de quel moment il parle même si il le nomme pas 🧱` },
            { id: "n13_s4_006", angle: "On a ri de trucs qui étaient pas drôles sur le moment.", body: `006. "On a ri de trucs qui étaient pas drôles sur le moment."
Y'a des situations qui se sont passées et qui étaient stressantes ou nulles ou les deux. Et maintenant qu'on en parle on rit. Le temps a transformé ces trucs en histoires. En nos histoires. C'est bien le temps parfois. Joyeuse fête, [Prénom].
Avec gratitude pour le temps qui transforme les mauvais moments en bonnes histoires,
— ton ami qui attend avec impatience que certains trucs récents deviennent drôles aussi ⏳` },
            { id: "n13_s4_007", angle: "Joyeuse fête. T\'as été honnête avec moi des fois où c\'était pas facile à entendre.", body: `007. "Joyeuse fête. T'as été honnête avec moi des fois où c'était pas facile à entendre."
T'aurais pu dire ce que je voulais entendre. T'as dit ce qui était vrai. Sur le moment j'aimais pas trop. Après j'ai compris que c'était ça un ami. Quelqu'un qui dit le vrai même quand c'est pas confortable. Joyeuse fête, [Prénom].
Avec reconnaissance tardive mais sincère pour tes vérités inconfortables,
— ton ami qui préfère tes vérités à n'importe quel mensonge confortable 🪞` },
            { id: "n13_s4_008", angle: "On a eu des conversations qui ont changé des trucs.", body: `008. "On a eu des conversations qui ont changé des trucs."
Pas des grandes conversations avec des violons. Des conversations normales. Parfois même des conversations qui avaient l'air de rien. Et après ces conversations quelque chose était différent. Dans ma façon de voir un truc. Dans ma façon de penser à quelque chose. T'as changé des trucs sans faire exprès. Joyeuse fête, [Prénom].
Avec inventaire des conversations qui ont changé quelque chose sans prévenir,
— ton ami influencé par toi plus qu'il ne le montre 🌊` },
            { id: "n13_s4_009", angle: "Joyeuse fête. On a fait des erreurs ensemble et on s\'est pas jugés.", body: `009. "Joyeuse fête. On a fait des erreurs ensemble et on s'est pas jugés."
Enfin pas trop. Enfin si un peu. Mais on s'est pas perdus à cause des erreurs. On a regardé les erreurs. On a dit ah ouais c'était nul. Et on a continué. C'est ça aussi l'amitié. Continuer après les erreurs. Joyeuse fête, [Prénom].
Avec bilan honnête des erreurs communes et satisfaction d'être encore là après,
— ton ami qui a sa part de responsabilité dans plusieurs de ces erreurs 🙋` },
            { id: "n13_s4_010", angle: "Y\'a un truc précis que t\'as dit qui est resté.", body: `010. "Y'a un truc précis que t'as dit qui est resté."
Je te dirai peut-être un jour lequel. Ou peut-être pas. Mais il y a une phrase. Un moment. Quelque chose que t'as dit et qui s'est installé quelque part dans ma tête et qui en est pas vraiment parti. T'as laissé une trace sans savoir que tu la laissais. Joyeuse fête, [Prénom].
Avec conscience de cette trace que tu as laissée sans t'en rendre compte,
— ton ami qui porte cette phrase quelque part depuis ce jour-là 💬` },
            { id: "n13_s4_011", angle: "Joyeuse fête. On a attendu des trucs ensemble.", body: `011. "Joyeuse fête. On a attendu des trucs ensemble."
Des résultats. Des nouvelles. Des réponses. Ces moments d'attente où on savait pas encore comment ça allait tourner. Et on attendait ensemble. Et ça changeait quelque chose d'attendre à deux. C'était moins long. Ou en tout cas différent. Joyeuse fête, [Prénom].
Avec mémoire des attentes partagées et de ce qu'elles valaient,
— ton ami de salle d'attente depuis le début 🕐` },
            { id: "n13_s4_012", angle: "On s\'est perdus un peu à un moment et on s\'est retrouvés.", body: `012. "On s'est perdus un peu à un moment et on s'est retrouvés."
Y'a eu une période. Un moment où on se parlait moins. Où les trucs avaient changé sans qu'on sache vraiment pourquoi. Et puis ça a repris. Naturellement. Comme si ça avait besoin d'une pause. Joyeuse fête, [Prénom], content qu'on se soit retrouvés.
Avec soulagement tranquille d'être de l'autre côté de cette période-là,
— ton ami qui a remarqué la pause et qui est content qu'elle soit finie 🔁` },
            { id: "n13_s4_013", angle: "Joyeuse fête. T\'as défendu un truc que je faisais devant des gens.", body: `013. "Joyeuse fête. T'as défendu un truc que je faisais devant des gens."
T'as pas demandé mon avis avant. T'as juste pris ma défense. T'as dit ce que tu pensais de moi à des gens qui pensaient autre chose. Je l'ai su après. Et ça m'a touché plus que je l'aurais cru. Joyeuse fête, [Prénom].
Avec reconnaissance pour cette défense spontanée dont j'ai su après coup,
— ton ami qui sait que t'as fait ça et qui l'a pas oublié 🛡️` },
            { id: "n13_s4_014", angle: "On a partagé des trucs qu\'on partage pas avec tout le monde.", body: `014. "On a partagé des trucs qu'on partage pas avec tout le monde."
Des pensées. Des doutes. Des choses qu'on dit pas facilement. Pas dans un sens dramatique. Juste dans le sens : y'a des trucs qui restent entre nous parce que c'est là qu'ils ont leur place. Joyeuse fête, [Prénom].
Avec conscience de la valeur de ce qu'on garde entre nous,
— ton ami dépositaire de ce que tu lui as confié 🤝` },
            { id: "n13_s4_015", angle: "Joyeuse fête. On a vécu des trucs nuls et on en a fait des blagues.", body: `015. "Joyeuse fête. On a vécu des trucs nuls et on en a fait des blagues."
C'est notre façon de gérer. Transformer le nul en drôle. Pas toujours. Pas immédiatement. Mais avec du recul. Et ces blagues-là sont que pour nous parce qu'il faut avoir vécu le truc nul pour trouver la blague drôle. Joyeuse fête, [Prénom].
Avec patrimoine de blagues internes construites sur des trucs nuls,
— ton ami co-auteur de toutes ces blagues que personne d'autre comprend 😂` },
            { id: "n13_s4_016", angle: "Y\'a un truc qu\'on a fait ensemble dont je suis encore fier.", body: `016. "Y'a un truc qu'on a fait ensemble dont je suis encore fier."
Je te dirai lequel si t'es pas sûr. Mais je pense que tu sais. Ce truc qu'on a fait. Qui était un peu risqué ou un peu difficile ou les deux. Et qu'on a fait quand même. Et que ça a marché. Je suis encore fier de ça. Joyeuse fête, [Prénom].
Avec fierté intacte pour ce truc précis qu'on a fait ensemble,
— ton ami qui repense à ce truc de temps en temps et qui sourit encore 🏆` },
            { id: "n13_s4_017", angle: "Joyeuse fête. T\'as été patient avec moi des fois où j\'étais pas facile.", body: `017. "Joyeuse fête. T'as été patient avec moi des fois où j'étais pas facile."
Y'a des moments où j'étais dans mes trucs. Pas très disponible. Pas très agréable peut-être. Et t'as attendu. T'as pas disparu. T'as laissé passer. C'est un truc que tout le monde fait pas. Joyeuse fête, [Prénom].
Avec reconnaissance pour ta patience dans mes périodes pas faciles,
— ton ami qui sait qu'il t'en a demandé parfois beaucoup sur ce point 🙏` },
            { id: "n13_s4_018", angle: "On a eu des fous rires dont j\'arrive encore pas à expliquer pourquoi.", body: `018. "On a eu des fous rires dont j'arrive encore pas à expliquer pourquoi."
Ces rires qui partent de nulle part. Sur un truc qui était objectivement pas si drôle. Et qui durent trop longtemps. Et qui reprennent quand on se regarde. Ces rires-là sont ma mesure de la qualité d'une amitié. On en a eu plusieurs. Joyeuse fête, [Prénom].
Avec classement de nos fous rires parmi les meilleurs moments,
— ton ami qui repense à au moins deux d'entre eux en écrivant ça 😂` },
            { id: "n13_s4_019", angle: "Joyeuse fête. On a grandi pendant les trucs qu\'on a vécus.", body: `019. "Joyeuse fête. On a grandi pendant les trucs qu'on a vécus."
Chaque truc a changé un truc. Chaque moment difficile a appris quelque chose. Chaque bonne période a donné quelque chose à garder. On a pas vécu des trucs pour rien. Ça a servi. On est qui on est aussi à cause de ce qu'on a traversé ensemble. Joyeuse fête, [Prénom].
Avec conscience que nos vécus communs ont contribué à qui on est maintenant,
— ton ami façonné en partie par les trucs qu'on a traversés à deux 🧩` },
            { id: "n13_s4_020", angle: "Joyeuse fête. J\'aurais pas voulu vivre ces trucs avec quelqu\'un d\'autre.", body: `020. "Joyeuse fête. J'aurais pas voulu vivre ces trucs avec quelqu'un d'autre."
Les bons. Les moins bons. Les drôles. Les compliqués. Les moments d'attente. Les moments de fou rire. Si j'avais pu choisir avec qui vivre tout ça j'aurais choisi toi quand même. Joyeuse fête, [Prénom].
Avec certitude tranquille sur ce choix,
— ton ami pour tous les trucs à venir aussi ❤️` },
          ],
        },
        {
          id: 'no_cap',
          label: "No cap t'assures",
          emoji: '⭐',
          messages: [
            { id: "n13_s5_001", angle: "Joyeuse fête. No cap t\'assures vraiment.", body: `001. "Joyeuse fête. No cap t'assures vraiment."
Pas de façon dramatique. Pas de façon que tout le monde voit. Mais de façon constante. Régulière. Fiable. T'es là quand t'es censé être là. Tu fais ce que tu dis que tu vas faire. Tu gères ce qui te revient. C'est pas spectaculaire mais c'est rare. Joyeuse fête, [Prénom].
Avec constat sincère et sans exagération de ce que t'es vraiment,
— ton ami qui mesure les gens à la régularité et qui te met haut 📏` },
            { id: "n13_s5_002", angle: "T\'assures dans des trucs que les gens remarquent pas.", body: `002. "T'assures dans des trucs que les gens remarquent pas."
Pas les grandes choses visibles. Les petites. Tu réponds quand quelqu'un a besoin d'une réponse. Tu te souviens des trucs importants pour les autres. Tu fais attention sans que ça se voie. Ces trucs-là personne les applaudit mais moi je les vois. Joyeuse fête, [Prénom].
Avec reconnaissance pour les trucs invisibles que tu fais et que je vois quand même,
— ton ami qui tient la liste de tes actions discrètes 📋` },
            { id: "n13_s5_003", angle: "Joyeuse fête. T\'as assuré un truc récemment et je voulais le dire.", body: `003. "Joyeuse fête. T'as assuré un truc récemment et je voulais le dire."
T'as géré quelque chose. Pas parfaitement peut-être. Mais t'as géré. T'as pas évité. T'as pas repoussé indéfiniment. T'as fait face et t'as géré. C'est pas anodin. C'est exactement ce qu'il fallait faire. Joyeuse fête, [Prénom].
Avec mention spéciale pour ce truc récent que t'as géré comme il fallait,
— ton ami qui a remarqué et qui te le dit aujourd'hui 🎯` },
            { id: "n13_s5_004", angle: "T\'es fiable. Genre vraiment fiable.", body: `004. "T'es fiable. Genre vraiment fiable."
Si tu dis que t'es là t'es là. Si tu dis que tu fais quelque chose tu le fais. Si tu dis que tu gardes quelque chose pour toi tu le gardes. La fiabilité c'est un truc que beaucoup de gens pensent avoir et que peu de gens ont vraiment. Toi t'as vraiment. Joyeuse fête, [Prénom].
Avec attestation officielle de ta fiabilité réelle et pas juste supposée,
— ton ami qui a testé ta fiabilité plusieurs fois et qui confirme 🔒` },
            { id: "n13_s5_005", angle: "Joyeuse fête. No cap tu gères des trucs que d\'autres géreraient pas.", body: `005. "Joyeuse fête. No cap tu gères des trucs que d'autres géreraient pas."
Y'a des situations. Des contextes. Des trucs compliqués dans ta vie. Et tu les gères. Pas en mode tout va bien. En mode je gère ce qui est à moi de gérer. C'est une posture. C'est pas donné à tout le monde. Joyeuse fête, [Prénom].
Avec respect pour ta façon de gérer ce qui est à toi sans faire semblant que c'est facile,
— ton ami qui voit ce que tu portes et qui trouve que tu le portes bien 💪` },
            { id: "n13_s5_006", angle: "T\'as une façon de rassurer les gens sans dire grand chose.", body: `006. "T'as une façon de rassurer les gens sans dire grand chose."
C'est un talent. Être là. Avoir l'air calme. Dire le truc simple qui remet les choses en place. T'as pas besoin de grands discours. T'as juste besoin d'être présent d'une certaine façon. Et ça marche. Joyeuse fête, [Prénom].
Avec admiration pour ton talent de présence rassurante sans grands effets,
— ton ami qui a bénéficié de ce talent plusieurs fois 🌊` },
            { id: "n13_s5_007", angle: "Joyeuse fête. T\'assures dans les moments où les gens comptent sur toi.", body: `007. "Joyeuse fête. T'assures dans les moments où les gens comptent sur toi."
C'est là que ça compte vraiment. Pas quand c'est facile. Quand quelqu'un a besoin de toi. Quand y'a une attente. Quand ça compte vraiment. Ces moments-là tu les gères. T'es présent. T'es utile. T'es là. Joyeuse fête, [Prénom].
Avec constat que t'es le genre de personne sur qui on peut compter quand ça compte,
— ton ami qui sait qu'il peut compter sur toi et qui trouve ça précieux 🫂` },
            { id: "n13_s5_008", angle: "No cap t\'as géré des trucs cette année.", body: `008. "No cap t'as géré des trucs cette année."
Je sais pas tout. Tu me dis pas tout. Mais ce que je sais c'est que t'as traversé des trucs et que t'es là. Debout. Qui continue. Qui avance. C'est de la gestion. Même si ça ressemble à rien de l'extérieur. Joyeuse fête, [Prénom].
Avec reconnaissance pour tout ce que t'as géré cette année y compris ce que je vois pas,
— ton ami qui te voit avancer et qui trouve que t'avances bien 🚶` },
            { id: "n13_s5_009", angle: "Joyeuse fête. T\'assures avec les gens que t\'aimes.", body: `009. "Joyeuse fête. T'assures avec les gens que t'aimes."
Ta façon de traiter les gens qui comptent pour toi. D'être attentif. De te souvenir. De faire des trucs pour eux sans qu'ils demandent. C'est une façon d'aimer qui se voit dans les actes. Et tes actes sont cohérents avec ce que tu dis. C'est rare. Joyeuse fête, [Prénom].
Avec observation de la cohérence entre ce que tu dis et ce que tu fais pour les gens que t'aimes,
— ton ami bénéficiaire de cette cohérence depuis un moment 💛` },
            { id: "n13_s5_010", angle: "T\'as un niveau d\'effort que les gens voient pas toujours.", body: `010. "T'as un niveau d'effort que les gens voient pas toujours."
T'as l'air de pas forcer. Mais je sais que t'as forcé. Je sais ce que ça t'a coûté certains trucs. Je sais l'effort derrière la façade décontractée. Et je veux que tu saches que je vois cet effort. Joyeuse fête, [Prénom].
Avec vision claire de l'effort derrière la décontraction apparente,
— ton ami qui voit ce que t'as mis dedans même quand ça paraît facile 👁️` },
            { id: "n13_s5_011", angle: "Joyeuse fête. No cap t\'aurais pu lâcher des trucs et t\'as pas lâché.", body: `011. "Joyeuse fête. No cap t'aurais pu lâcher des trucs et t'as pas lâché."
Y'a des moments où lâcher aurait été plus simple. Plus confortable. Moins coûteux à court terme. Et t'as pas lâché. T'as continué. T'as tenu. Et maintenant t'es là avec tout ce que t'as tenu. Joyeuse fête, [Prénom].
Avec respect pour tout ce que t'as tenu quand c'était plus simple de lâcher,
— ton ami qui sait exactement de quels trucs il parle 🏋️` },
            { id: "n13_s5_012", angle: "T\'assures avec ta famille même quand c\'est compliqué.", body: `012. "T'assures avec ta famille même quand c'est compliqué."
La famille c'est compliqué pour tout le monde. Et t'as une façon de gérer le compliqué familial avec une maturité qui m'impressionne. T'es ni dans l'évitement total ni dans le conflit permanent. T'as trouvé un truc. Joyeuse fête, [Prénom].
Avec admiration pour ta navigation dans le compliqué familial,
— ton ami qui galère plus que toi sur ce point et qui prend des notes 📝` },
            { id: "n13_s5_013", angle: "Joyeuse fête. T\'es honnête même quand c\'est pas confortable.", body: `013. "Joyeuse fête. T'es honnête même quand c'est pas confortable."
T'aurais pu dire autre chose. T'aurais pu esquiver. T'as dit le vrai. Dans plusieurs situations. À plusieurs personnes y compris moi. Cette honnêteté-là c'est une façon d'assurer. C'est respecter les gens assez pour leur dire le vrai. Joyeuse fête, [Prénom].
Avec gratitude pour une honnêteté qui dit que tu nous respectes assez pour pas mentir,
— ton ami qui préfère ta vérité inconfortable à un mensonge facile 🪞` },
            { id: "n13_s5_014", angle: "No cap tu progresses sur des trucs qui étaient difficiles pour toi.", body: `014. "No cap tu progresses sur des trucs qui étaient difficiles pour toi."
Je t'ai vu. J'ai vu les trucs qui te bloquaient avant. Et je te vois maintenant. Ces trucs te bloquent moins. T'as travaillé dessus. Ou t'as grandi autour. Dans tous les cas c'est du progrès. Et le progrès mérite d'être nommé. Joyeuse fête, [Prénom].
Avec nomination officielle de tes progrès sur les trucs qui étaient durs,
— ton ami témoin de ta progression sur le long terme 📈` },
            { id: "n13_s5_015", angle: "Joyeuse fête. T\'assures dans les petits trucs du quotidien.", body: `015. "Joyeuse fête. T'assures dans les petits trucs du quotidien."
Les grands trucs tout le monde voit. Les petits trucs du quotidien c'est là que le caractère se voit vraiment. Ta façon d'être régulier. Ponctuel. Présent. De faire les petites choses sans qu'on te le demande. Ces petits trucs c'est la fondation. Et ta fondation est solide. Joyeuse fête, [Prénom].
Avec attention portée à ta fondation quotidienne et constat de sa solidité,
— ton ami qui construit sur du solide en étant ton ami 🧱` },
            { id: "n13_s5_016", angle: "T\'as géré des situations cette année sans te plaindre.", body: `016. "T'as géré des situations cette année sans te plaindre."
Tu t'es pas plaint ou très peu. T'as géré. T'as avancé. T'as fait ce qu'il y avait à faire. Ce silence-là dans la gestion des trucs difficiles c'est une forme de force. Pas la seule. Mais une vraie. Joyeuse fête, [Prénom].
Avec respect pour ton silence dans la gestion et ce qu'il dit sur ta force,
— ton ami qui t'a vu gérer sans bruit et qui a noté 🤫` },
            { id: "n13_s5_017", angle: "Joyeuse fête. No cap t\'es quelqu\'un de bien.", body: `017. "Joyeuse fête. No cap t'es quelqu'un de bien."
Pas parfait. Pas sans défauts. Pas sans zones à améliorer. Mais quelqu'un de bien dans le sens fondamental. Dans les valeurs. Dans la façon de traiter les gens. Dans ce qui compte pour toi. Dans ce que tu refuses de faire même quand ce serait plus simple. Joyeuse fête, [Prénom].
Avec affirmation simple et directe sans fioritures,
— ton ami qui le pense vraiment et qui le dit sans gêne 🫶` },
            { id: "n13_s5_018", angle: "T\'as soutenu des gens autour de toi cette année.", body: `018. "T'as soutenu des gens autour de toi cette année."
Je l'ai vu. T'as été là pour des gens. T'as donné de ton temps. De ton énergie. De ton attention. Sans toujours avoir quelque chose en retour. Juste parce que ces gens avaient besoin et que t'étais en capacité de donner. Joyeuse fête, [Prénom].
Avec reconnaissance pour tout ce que t'as donné aux gens autour de toi,
— ton ami qui fait partie des gens qui bénéficient de ta générosité 🌱` },
            { id: "n13_s5_019", angle: "Joyeuse fête. T\'assures et tu le sais même pas toujours.", body: `019. "Joyeuse fête. T'assures et tu le sais même pas toujours."
Des fois t'es dur avec toi-même. Tu vois ce que tu fais pas bien. Ce que tu rates. Ce que tu aurais pu mieux faire. Et tu vois moins ce que tu fais bien. Ce que tu tiens. Ce que tu réussis. Alors je te le dis moi : t'assures. Vraiment. Joyeuse fête, [Prénom].
Avec mission de te dire ce que tu vois pas toujours toi-même,
— ton ami miroir qui reflète aussi les bonnes choses pas que les zones à améliorer 🪞` },
            { id: "n13_s5_020", angle: "Joyeuse fête. No cap je suis content que tu sois dans ma vie.", body: `020. "Joyeuse fête. No cap je suis content que tu sois dans ma vie."
Pas parce que t'es parfait. Parce que t'es toi. Parce que t'assures à ta façon. Parce que t'es fiable. Parce que t'es là. Parce que t'as été là. Parce que tu seras là. C'est tout ce que je demande et t'as tout ça. Joyeuse fête, [Prénom].
Avec clarté totale sur pourquoi je suis content que t'existes dans mon périmètre,
— ton ami pour le long terme no cap ❤️` },
          ],
        },
        {
          id: 'move',
          label: "C'est pas le move mais on t'aime",
          emoji: '💛',
          messages: [
            { id: "n13_s6_001", angle: "Joyeuse fête. T\'as fait des choix cette année. Certains étaient pas le move.", body: `001. "Joyeuse fête. T'as fait des choix cette année. Certains étaient pas le move."
Je dis pas lesquels. Tu sais lesquels. Y'a eu ce truc. Et cet autre truc. Et peut-être ce troisième truc aussi. Sur le moment t'étais convaincu. Après t'as vu. On en a parlé ou pas. Mais tu sais. Et moi je sais. Et on t'aime quand même. Joyeuse fête, [Prénom].
Avec inventaire discret des moves discutables de l'année sans les nommer,
— ton ami qui sait lesquels et qui t'aime malgré eux 🙈` },
            { id: "n13_s6_002", angle: "T\'as dit un truc récemment qui était vraiment pas le move.", body: `002. "T'as dit un truc récemment qui était vraiment pas le move."
T'as dit ça. Dans ce contexte. À ce moment précis. Et t'as vu les têtes. Ou t'as pas vu les têtes et quelqu'un t'a dit après. Dans tous les cas c'était pas le move. Mais c'était tellement toi que tout le monde a fini par rire. Joyeuse fête, [Prénom].
Avec mémoire intacte du truc que t'as dit et du silence qui a suivi,
— ton ami qui était là et qui en parle encore 😬` },
            { id: "n13_s6_003", angle: "Joyeuse fête. Ta façon de gérer certaines situations est vraiment particulière.", body: `003. "Joyeuse fête. Ta façon de gérer certaines situations est vraiment particulière."
Particulière dans le sens : personne d'autre aurait géré comme ça. T'as ton propre protocole. Ta propre logique. Ça donne des résultats variables. Parfois ça marche mieux qu'attendu. Parfois c'est clairement pas le move. Mais c'est toujours divertissant. Joyeuse fête, [Prénom].
Avec appréciation pour le divertissement que procure ton protocole personnel,
— ton ami spectateur privilégié de tes méthodes non conventionnelles 🎭` },
            { id: "n13_s6_004", angle: "Y\'a un move que t\'as fait dont on parle encore.", body: `004. "Y'a un move que t'as fait dont on parle encore."
Dans le groupe. Entre nous. Ce truc que t'as fait. Cette décision. Cette action. Cette phrase peut-être. Qui est devenue une référence. Un étalon du pas le move. On le cite encore. Affectueusement. Joyeuse fête, [Prénom], tu fais partie du patrimoine.
Avec intégration officielle de ton move dans le patrimoine collectif du groupe,
— ton ami conservateur de ce patrimoine précieux 🏛️` },
            { id: "n13_s6_005", angle: "Joyeuse fête. T\'aurais pu t\'abstenir des fois. Tu t\'es pas abstenu.", body: `005. "Joyeuse fête. T'aurais pu t'abstenir des fois. Tu t'es pas abstenu."
Y'a des situations où le move c'était de rien dire. De rien faire. D'attendre. Toi t'as dit. Toi t'as fait. Toi t'as pas attendu. Le résultat était pas toujours optimal. Mais au moins on s'est jamais ennuyés. Joyeuse fête, [Prénom].
Avec gratitude pour ton incapacité à t'abstenir qui rend nos vies moins ennuyeuses,
— ton ami qui bénéficie de ton absence de retenue depuis le début 🎢` },
            { id: "n13_s6_006", angle: "T\'as un talent pour choisir le pire moment pour dire les vraies choses.", body: `006. "T'as un talent pour choisir le pire moment pour dire les vraies choses."
T'as raison sur le fond. Vraiment. Mais le moment. Le contexte. La façon. C'était pas le move. La vérité c'est bien mais la vérité au mauvais moment dans le mauvais contexte ça fait des dégâts. T'es encore en apprentissage sur ce point. On t'aime quand même. Joyeuse fête, [Prénom].
Avec bilan d'apprentissage en cours sur le timing des vérités,
— ton ami qui attend avec impatience la version de toi qui maîtrisera ce timing 📅` },
            { id: "n13_s6_007", angle: "Joyeuse fête. Ta confiance en toi est une qualité qui devient parfois un défaut.", body: `007. "Joyeuse fête. Ta confiance en toi est une qualité qui devient parfois un défaut."
C'est bien d'être sûr de soi. C'est bien d'avancer. C'est bien de pas douter tout le temps. Mais des fois. Des fois précises. Un peu de doute aurait évité le move discutable. Juste un peu. Juste le temps de vérifier. Joyeuse fête, [Prénom], on t'aime avec ta confiance et ses conséquences.
Avec amour inconditionnel pour toi et tes conséquences,
— ton ami qui ramasse parfois les conséquences avec toi et qui le fait volontiers 🧹` },
            { id: "n13_s6_008", angle: "On t\'a dit que c\'était pas le move. T\'as fait quand même. C\'était pas le move.", body: `008. "On t'a dit que c'était pas le move. T'as fait quand même. C'était pas le move."
On t'avait prévenu. Collectivement ou individuellement selon les cas. T'as entendu. T'as pesé. T'as décidé de faire quand même. Et après. Après t'as vu qu'on avait raison. Est-ce que tu nous consulteras plus tôt la prochaine fois ? Probablement pas. On t'aime quand même. Joyeuse fête, [Prénom].
Avec résignation affectueuse devant ta récidive probable,
— ton ami conseil que tu consultes après et non avant mais qui reste disponible 📞` },
            { id: "n13_s6_009", angle: "Joyeuse fête. T\'as une façon de te mettre dans des situations évitables.", body: `009. "Joyeuse fête. T'as une façon de te mettre dans des situations évitables."
Des situations qui existaient pas avant que tu arrives. Qui sont apparues parce que t'as fait un truc. Dit un truc. Décidé un truc. Et ensuite t'as géré la situation. Avec plus ou moins de succès. C'est un cycle. C'est ton cycle. On le connaît. On t'aime dedans. Joyeuse fête, [Prénom].
Avec acceptation totale de ton cycle situation-gestion-situation,
— ton ami qui a appris à anticiper les phases de ton cycle 🔄` },
            { id: "n13_s6_010", angle: "Le move c\'était pas ça. Mais le courage c\'était quand même là.", body: `010. "Le move c'était pas ça. Mais le courage c'était quand même là."
C'était pas le bon choix. Probablement. Mais c'était un choix courageux dans le sens où t'as pas eu peur de te lancer. T'as pas hésité indéfiniment. T'as fait. Le résultat était discutable. L'élan était là. On t'aime pour l'élan. Joyeuse fête, [Prénom].
Avec distinction importante entre la qualité du move et la qualité de l'élan,
— ton ami qui salue l'élan même quand le move était raté 🚀` },
            { id: "n13_s6_011", angle: "Joyeuse fête. T\'es le genre de personne qui apprend de ses erreurs lentement.", body: `011. "Joyeuse fête. T'es le genre de personne qui apprend de ses erreurs lentement."
Pas en mode critique. En mode factuel. T'as besoin de faire l'erreur plusieurs fois avant que la leçon s'installe vraiment. C'est une façon d'apprendre. Coûteuse. Mais efficace sur le long terme. Et on est là pour les répétitions. Joyeuse fête, [Prénom].
Avec engagement à rester présent pour toutes les répétitions nécessaires,
— ton ami pour la répétition n+1 de la même leçon si nécessaire 📚` },
            { id: "n13_s6_012", angle: "C\'était clairement pas le move mais t\'avais l\'air tellement convaincu.", body: `012. "C'était clairement pas le move mais t'avais l'air tellement convaincu."
C'est ça le truc avec toi. T'es jamais à moitié. Quand t'es convaincu t'es convaincu à fond. Même quand t'as tort. Cette conviction totale même dans le mauvais move c'est fascinant. C'est parfois catastrophique. Mais c'est toujours impressionnant. Joyeuse fête, [Prénom].
Avec fascination sincère pour ta conviction absolue même dans les mauvais moves,
— ton ami à la fois effrayé et impressionné par ton niveau de conviction 😅` },
            { id: "n13_s6_013", angle: "Joyeuse fête. T\'as dit des trucs qui t\'ont précédé.", body: `013. "Joyeuse fête. T'as dit des trucs qui t'ont précédé."
Des trucs que les gens ont retenus. Qui circulent encore. Qui sont devenus des citations de référence dans notre groupe. Certains parce que c'était brillant. D'autres parce que c'était vraiment pas le move. Les deux contribuent à ta légende. Joyeuse fête, [Prénom].
Avec contribution à la légende en cours de constitution,
— ton ami archiviste de tes citations mémorables dans les deux sens du terme 📜` },
            { id: "n13_s6_014", angle: "Y\'a des trucs que tu fais qui font que tout le monde te regarde.", body: `014. "Y'a des trucs que tu fais qui font que tout le monde te regarde."
Pas toujours pour les bonnes raisons. Parfois parce que personne avait vu ça venir. Parfois parce que t'as dit l'impensable. Parfois parce que t'as fait le truc que tout le monde pensait mais que personne allait faire. T'as ce talent. Joyeuse fête, [Prénom].
Avec reconnaissance de ton talent à capter l'attention de façon totalement imprévisible,
— ton ami dans le public à chaque fois et jamais déçu du spectacle 👀` },
            { id: "n13_s6_015", angle: "Joyeuse fête. On t\'aime avec tes moves discutables.", body: `015. "Joyeuse fête. On t'aime avec tes moves discutables."
Pas malgré. Avec. Tes moves discutables font partie de toi. Ils font partie de nos histoires. Ils font partie de ce qui rend notre amitié divertissante et vivante. Un ami avec que des bons moves c'est moins intéressant. Joyeuse fête, [Prénom].
Avec théorie que les mauvais moves contribuent à la richesse d'une amitié,
— ton ami convaincu que tes moves discutables sont un asset pas un défaut 📊` },
            { id: "n13_s6_016", angle: "T\'as tenté des trucs qui étaient ambitieux. Certains ont marché. D\'autres moins.", body: `016. "T'as tenté des trucs qui étaient ambitieux. Certains ont marché. D'autres moins."
Le bilan est mitigé mais le fait de tenter est pas mitigé. T'es quelqu'un qui tente. Qui essaie. Qui se lance. Les résultats sont variables. L'attitude est constante. Et l'attitude je la respecte. Joyeuse fête, [Prénom].
Avec respect pour l'attitude de tentative indépendamment des résultats,
— ton ami qui préfère quelqu'un qui tente et rate à quelqu'un qui tente pas 🎯` },
            { id: "n13_s6_017", angle: "Joyeuse fête. T\'as une façon d\'aggraver involontairement certaines situations.", body: `017. "Joyeuse fête. T'as une façon d'aggraver involontairement certaines situations."
T'essaies d'aider. Vraiment. L'intention est là. Mais parfois la façon dont tu aides crée un problème supplémentaire. Et alors t'essaies de régler ce problème supplémentaire et ça en crée un autre. C'est une cascade. C'est toi. On t'aime dans la cascade. Joyeuse fête, [Prénom].
Avec amour pour toi et ta cascade d'améliorations involontairement aggravantes,
— ton ami pompier de tes cascades depuis le début 🚒` },
            { id: "n13_s6_018", angle: "C\'était pas le move mais t\'as assumé après.", body: `018. "C'était pas le move mais t'as assumé après."
T'as pas fui. T'as pas prétendu que c'était pas toi. T'as pas cherché des excuses pendant des heures. T'as vu que c'était pas le move et t'as assumé. Vite ou lentement selon les cas mais t'as assumé. C'est ça qui fait que les mauvais moves sont pardonnables. Joyeuse fête, [Prénom].
Avec respect pour ta capacité à assumer tes moves discutables une fois que tu les vois,
— ton ami qui trouve que l'assomption rachète beaucoup de mauvais moves 🙋` },
            { id: "n13_s6_019", angle: "Joyeuse fête. Tu rends les choses compliquées parfois et c\'est souvent divertissant.", body: `019. "Joyeuse fête. Tu rends les choses compliquées parfois et c'est souvent divertissant."
Les trucs simples entre tes mains deviennent parfois des aventures. Des détours. Des épisodes. C'est pas toujours pratique. C'est souvent divertissant. Et nos meilleures histoires viennent souvent d'un truc simple que t'as rendu compliqué. Joyeuse fête, [Prénom].
Avec gratitude pour ta façon de transformer le simple en épisode mémorable,
— ton ami scénariste involontaire de tout ce que tu touches 🎬` },
            { id: "n13_s6_020", angle: "Joyeuse fête. C\'est pas toujours le move. Et on t\'aime quand même. No cap.", body: `020. "Joyeuse fête. C'est pas toujours le move. Et on t'aime quand même. No cap."
Les deux ensemble. Le constat et l'amour. Sans contradiction. T'es quelqu'un qui fait pas toujours le bon move. Et t'es quelqu'un qu'on aime. Ces deux trucs coexistent parfaitement. L'un n'annule pas l'autre. Joyeuse fête, [Prénom], moves discutables et tout.
Avec déclaration finale claire et sans ambiguïté,
— ton ami pour les bons moves et les mauvais et tout ce qui est entre les deux ❤️` },
          ],
        },
      ],
    },
    {
      id: 'young_adult',
      label: '18-25 ans',
      minAge: 18,
      maxAge: 25,
      subCategories: [
        {
          id: 'tu_geres',
          label: "Tu gères",
          emoji: '🙌',
          messages: [
            { id: "n25_s1_001", angle: "Joyeuse fête. T\'as un prénom et ce prénom a un jour et ce jour c\'est aujourd\'hui et tu gères ça avec beaucoup de classe.", body: `001. "Joyeuse fête. T'as un prénom et ce prénom a un jour et ce jour c'est aujourd'hui et tu gères ça avec beaucoup de classe."
Certaines personnes laissent passer leur fête du prénom sans rien dire. Toi t'as décidé que ça comptait. Que ça méritait d'être marqué. Cette capacité à décider que les petites choses comptent c'est exactement ce qui te différencie. Joyeuse fête, [Prénom].
Avec respect pour ta façon de décider que les petites choses méritent d'exister,
— ton ami qui a appris de toi à fêter les trucs qui semblent pas importants 🥂` },
            { id: "n25_s1_002", angle: "Tu gères ta vie d\'adulte avec une sérénité que j\'ai pas encore trouvée.", body: `002. "Tu gères ta vie d'adulte avec une sérénité que j'ai pas encore trouvée."
T'as les mêmes galères que tout le monde. Les mêmes questions sans réponse. Les mêmes trucs flottants et non réglés. Mais t'as une façon de naviguer dedans sans te noyer. Comme si t'avais accepté que c'est comme ça et que t'avançais quand même. Joyeuse fête, [Prénom].
Avec admiration sincère pour ta navigation dans le chaos commun à tous,
— ton ami qui nage encore et qui regarde comment tu fais 🏊` },
            { id: "n25_s1_003", angle: "Joyeuse fête. T\'as des responsabilités maintenant et tu les assumes.", body: `003. "Joyeuse fête. T'as des responsabilités maintenant et tu les assumes."
Pas les responsabilités de façade. Les vraies. Les trucs qui dépendent de toi. Les engagements que t'as pris. Les gens qui comptent sur toi. Tu portes ça. Pas toujours facilement. Mais tu le portes. Et ça se voit que tu le portes avec soin. Joyeuse fête, [Prénom].
Avec reconnaissance pour la façon dont tu portes ce qui t'appartient de porter,
— ton ami qui voit le poids et qui respecte la façon dont tu le tiens 💪` },
            { id: "n25_s1_004", angle: "T\'as appris à dire non cette année et franchement respect.", body: `004. "T'as appris à dire non cette année et franchement respect."
C'est un apprentissage long. Douloureux parfois. T'as dit non à des trucs. À des gens peut-être. T'as protégé ton énergie. Ton temps. Tes limites. C'est de la gestion adulte de soi-même. C'est pas donné. Joyeuse fête, [Prénom].
Avec respect profond pour tes non de cette année et ce qu'ils ont coûté,
— ton ami qui est encore en apprentissage du non et qui prend exemple sur toi 🛡️` },
            { id: "n25_s1_005", angle: "Joyeuse fête. Tu gères ta santé mentale avec plus de conscience qu\'avant.", body: `005. "Joyeuse fête. Tu gères ta santé mentale avec plus de conscience qu'avant."
T'en parles différemment. T'y fais attention différemment. T'as des trucs qui t'aident et tu les utilises. T'as des signaux d'alarme et tu les reconnais. Cette conscience-là c'est un truc qu'on acquiert avec du temps et de l'honnêteté envers soi-même. Joyeuse fête, [Prénom].
Avec admiration pour ta conscience croissante de ce dont tu as besoin,
— ton ami qui travaille sur la même chose et qui trouve ça plus facile de pas être seul à le faire 🌱` },
            { id: "n25_s1_006", angle: "T\'as un projet. T\'avances dessus. C\'est plus que beaucoup.", body: `006. "T'as un projet. T'avances dessus. C'est plus que beaucoup."
Avoir un projet c'est bien. Avancer dessus c'est autre chose. Entre les deux y'a l'énergie quotidienne. La discipline sans motivation. Les jours où ça avance pas. Et tu continues quand même. C'est ça qui distingue ceux qui font de ceux qui veulent faire. Joyeuse fête, [Prénom].
Avec constat que t'es dans la catégorie de ceux qui font et pas juste de ceux qui veulent,
— ton ami qui observe ta progression et qui en tire de la motivation pour la sienne 🎯` },
            { id: "n25_s1_007", angle: "Joyeuse fête. T\'as géré une rupture cette année et t\'es debout.", body: `007. "Joyeuse fête. T'as géré une rupture cette année et t'es debout."
Ou une amitié qui s'est terminée. Ou un deuil d'une autre forme. Quelque chose s'est terminé et c'était difficile. Et t'es debout. Pas forcément bien tous les jours. Mais debout. Qui continue. C'est de la gestion. Joyeuse fête, [Prénom].
Avec respect pour tout ce que t'as traversé pour être debout aujourd'hui,
— ton ami qui sait ce que ça t'a coûté d'être encore là 🫂` },
            { id: "n25_s1_008", angle: "Tu gères ta relation à l\'argent mieux que la plupart des gens de notre âge.", body: `008. "Tu gères ta relation à l'argent mieux que la plupart des gens de notre âge."
Pas parfaitement. Personne gère parfaitement à notre âge. Mais t'as une conscience. Un rapport. Une façon de penser à ça qui est plus mature que la moyenne. Tu planifies un minimum. Tu dépenses pas tout immédiatement. T'as compris quelque chose que beaucoup tardent à comprendre. Joyeuse fête, [Prénom].
Avec reconnaissance de ta maturité financière relative dans un contexte où c'est rare,
— ton ami qui te consulte parfois sur ces sujets et qui suit pas toujours les conseils mais qui les entend 💶` },
            { id: "n25_s1_009", angle: "Joyeuse fête. T\'as su quand partir.", body: `009. "Joyeuse fête. T'as su quand partir."
D'une situation. D'un endroit. D'une relation peut-être. Savoir quand partir c'est un des trucs les plus difficiles. Rester trop longtemps ou partir trop tôt font tous les deux des dégâts. T'as trouvé le moment. Ou en tout cas un moment acceptable. C'est de la gestion. Joyeuse fête, [Prénom].
Avec respect pour ta capacité à identifier le bon moment pour partir,
— ton ami qui rate encore parfois ce moment et qui apprend de tes exemples 🚪` },
            { id: "n25_s1_010", angle: "Tu gères les attentes des autres sans te perdre dedans.", body: `010. "Tu gères les attentes des autres sans te perdre dedans."
Les attentes de la famille. Des amis. De la société sur ce que t'es censé faire à ton âge. T'entends tout ça. T'en tiens compte ou pas. Mais t'as pas l'air de te définir par ces attentes. T'as l'air de te définir par ce que tu veux vraiment. C'est plus rare qu'on croit. Joyeuse fête, [Prénom].
Avec admiration pour ta résistance aux définitions extérieures de ce que tu devrais être,
— ton ami qui lutte encore avec ces attentes et qui trouve ça reposant de te voir y résister 🧭` },
            { id: "n25_s1_011", angle: "Joyeuse fête. T\'as demandé de l\'aide cette année quand t\'en avais besoin.", body: `011. "Joyeuse fête. T'as demandé de l'aide cette année quand t'en avais besoin."
C'est underrated comme compétence. Reconnaître qu'on a besoin d'aide. Accepter de la demander. Accepter de la recevoir. Sans en faire trop. Sans minimiser non plus. T'as fait ça. C'est de la gestion adulte de soi. Joyeuse fête, [Prénom].
Avec respect pour ta capacité à demander de l'aide sans que ça te coûte ton identité,
— ton ami qui travaille encore à développer cette capacité 🤝` },
            { id: "n25_s1_012", angle: "T\'as une vie qui ressemble à ce que tu veux qu\'elle ressemble.", body: `012. "T'as une vie qui ressemble à ce que tu veux qu'elle ressemble."
Pas encore parfaitement. Pas encore complètement. Mais dans les grandes lignes. Dans les choix principaux. Dans la direction. T'avances vers quelque chose qui a l'air d'être toi. Pas vers quelque chose que les autres ont décidé pour toi. Joyeuse fête, [Prénom].
Avec observation que ta vie a de plus en plus l'air d'avoir été choisie par toi,
— ton ami qui trouve ça inspirant de voir quelqu'un construire sa vie vraiment 🏗️` },
            { id: "n25_s1_013", angle: "Joyeuse fête. Tu gères les déceptions sans t\'effondrer.", body: `013. "Joyeuse fête. Tu gères les déceptions sans t'effondrer."
Y'en a eu. Des trucs qui se sont pas passés comme prévu. Des portes qui se sont pas ouvertes. Des espoirs qui ont pas abouti. T'as vécu ça. T'as été déçu. Et t'as continué. Pas en faisant semblant que ça faisait pas mal. En le vivant et en continuant quand même. Joyeuse fête, [Prénom].
Avec respect pour ta façon de vivre les déceptions sans les nier et sans t'y noyer,
— ton ami qui t'a vu traverser certaines d'entre elles et qui est impressionné 🌊` },
            { id: "n25_s1_014", angle: "T\'as des valeurs et tu vis en accord avec elles.", body: `014. "T'as des valeurs et tu vis en accord avec elles."
C'est pas évident. Y'a plein de moments où vivre en accord avec ses valeurs coûte quelque chose. Un confort. Une opportunité. Une relation parfois. T'as payé ce prix plusieurs fois. Sans te plaindre. En sachant pourquoi. Joyeuse fête, [Prénom].
Avec admiration pour le prix que tu paies régulièrement pour être cohérent avec toi-même,
— ton ami qui trouve que cette cohérence est l'une de tes plus belles qualités 🧭` },
            { id: "n25_s1_015", angle: "Joyeuse fête. Tu gères ta solitude au lieu de la fuir.", body: `015. "Joyeuse fête. Tu gères ta solitude au lieu de la fuir."
T'as des moments seul. T'en profites. T'en as besoin même. T'as pas cette panique de la solitude que beaucoup ont à notre âge. T'as compris que être bien seul c'est la condition pour être bien avec les autres. Joyeuse fête, [Prénom].
Avec admiration pour ton rapport apaisé à ta propre compagnie,
— ton ami qui a appris de toi que la solitude est une compétence et pas une punition 🌿` },
            { id: "n25_s1_016", angle: "T\'as su reconnaître les gens qui te font du bien et les garder près.", body: `016. "T'as su reconnaître les gens qui te font du bien et les garder près."
Et tu sais aussi reconnaître les autres. Et tu gères la distance avec ces autres sans drama. Sans rupture violente. Juste un réajustement de la place que chacun occupe. C'est de la gestion relationnelle mature. C'est rare à notre âge. Joyeuse fête, [Prénom].
Avec respect pour ta gestion spatiale et émotionnelle de tes relations,
— ton ami qui se réjouit d'être dans la catégorie des gens que tu gardes près 💛` },
            { id: "n25_s1_017", angle: "Joyeuse fête. T\'as fait des choix difficiles et t\'assumes les conséquences.", body: `017. "Joyeuse fête. T'as fait des choix difficiles et t'assumes les conséquences."
Les choix faciles tout le monde les fait. Les difficiles c'est là que le caractère se révèle. T'as fait des choix qui coûtaient quelque chose. Et t'assumes ce qu'ils ont coûté. Sans te victimiser. Sans regretter indéfiniment. En vivant avec tes choix. Joyeuse fête, [Prénom].
Avec respect pour ta façon de vivre avec tes choix difficiles sans te lamenter,
— ton ami qui t'a vu faire certains de ces choix et qui comprend ce qu'ils t'ont coûté 🎯` },
            { id: "n25_s1_018", angle: "Tu travailles sur toi. Vraiment. Et ça se voit.", body: `018. "Tu travailles sur toi. Vraiment. Et ça se voit."
Pas de façon performative. Pas pour le montrer. Dans le silence. Dans les petits changements. Dans les réactions différentes. Dans les trucs que tu fais plus de la même façon. Ce travail silencieux sur soi c'est ce qui change vraiment les choses. Joyeuse fête, [Prénom].
Avec observation des changements silencieux que ton travail produit,
— ton ami témoin de tes évolutions discrètes depuis un moment 🌱` },
            { id: "n25_s1_019", angle: "Joyeuse fête. T\'as trouvé un équilibre qui te ressemble.", body: `019. "Joyeuse fête. T'as trouvé un équilibre qui te ressemble."
Pas l'équilibre parfait. Pas l'équilibre de quelqu'un d'autre. Le tien. Avec tes priorités. Tes besoins. Tes limites. Cet équilibre-là il a l'air fragile parfois mais il tient. Parce qu'il est vraiment le tien. Joyeuse fête, [Prénom].
Avec admiration pour ton équilibre personnel qui tient parce qu'il est authentiquement le tien,
— ton ami qui cherche encore le sien et qui observe le tien avec intérêt 🧘` },
            { id: "n25_s1_020", angle: "Joyeuse fête. Tu gères. Vraiment. Et c\'est pas rien.", body: `020. "Joyeuse fête. Tu gères. Vraiment. Et c'est pas rien."
Tout ce que t'as traversé cette année. Tout ce que tu portes. Tout ce que tu construis. Tout ce que tu répares. Tout ce que tu maintiens. Tu gères tout ça. Pas parfaitement. Mais vraiment. Et dans le monde compliqué qu'on habite à notre âge vraiment gérer c'est déjà énorme. Joyeuse fête, [Prénom].
Avec bilan d'ensemble sincère et sans fioriture,
— ton ami pour toute la suite de la gestion ❤️` },
          ],
        },
        {
          id: 'chelou',
          label: "T'es chelou mais t'es mon chelou",
          emoji: '🌀',
          messages: [
            { id: "n25_s2_001", angle: "Joyeuse fête. T\'as un prénom. Ce prénom a un saint. Ce saint a un jour. Et toi t\'as décidé que tout ça avait un sens.", body: `001. "Joyeuse fête. T'as un prénom. Ce prénom a un saint. Ce saint a un jour. Et toi t'as décidé que tout ça avait un sens."
La plupart des gens de notre âge s'en foutent de leur fête du prénom. Toi t'as décidé que ça comptait. C'est chelou dans le bon sens. Cette capacité à trouver du sens dans des trucs que les autres ignorent. C'est tellement toi. Joyeuse fête, [Prénom].
Avec respect pour ta façon de décider souverainement de ce qui compte,
— ton ami qui a mis le rappel parce que toi t'as décidé que ça comptait 📅` },
            { id: "n25_s2_002", angle: "T\'as une façon de penser qui prend des chemins que j\'aurais jamais pris.", body: `002. "T'as une façon de penser qui prend des chemins que j'aurais jamais pris."
T'arrives à des conclusions correctes. Souvent. Mais par des routes que personne d'autre aurait empruntées. Ta logique interne est cohérente. Elle est juste décalée de quelques degrés par rapport à celle de tout le monde. Ce décalage c'est ce qui rend tes perspectives intéressantes. Joyeuse fête, [Prénom].
Avec appréciation pour tes routes alternatives vers les bonnes conclusions,
— ton ami qui emprunte parfois tes chemins et qui trouve des trucs qu'il aurait manqués 🗺️` },
            { id: "n25_s2_003", angle: "Joyeuse fête. T\'as des intérêts très précis dans des domaines très inattendus.", body: `003. "Joyeuse fête. T'as des intérêts très précis dans des domaines très inattendus."
T'as une expertise sur des trucs que personne avait demandés. Une connaissance approfondie d'un sujet que la plupart des gens effleurent. Cette façon d'aller en profondeur là où les autres restent en surface. C'est chelou. C'est fascinant. C'est toi. Joyeuse fête, [Prénom].
Avec fascination sincère pour tes expertises non sollicitées mais toujours bienvenues,
— ton ami qui a appris des trucs inattendus grâce à toi 📚` },
            { id: "n25_s2_004", angle: "Y\'a des trucs chez toi que j\'ai arrêté d\'essayer de changer.", body: `004. "Y'a des trucs chez toi que j'ai arrêté d'essayer de changer."
Pas parce que j'ai abandonné. Parce que j'ai compris que ces trucs font partie de toi de façon fondamentale. Les changer ce serait changer toi. Et toi tel que t'es c'est ce que je veux comme ami. Alors j'accepte le package. Joyeuse fête, [Prénom].
Avec acceptation complète et définitive du package que tu représentes,
— ton ami qui a signé pour le package entier depuis le début 📦` },
            { id: "n25_s2_005", angle: "Joyeuse fête. Ta façon de gérer les situations sociales est vraiment unique.", body: `005. "Joyeuse fête. Ta façon de gérer les situations sociales est vraiment unique."
Unique dans le sens : personne d'autre ne naviguerait comme ça. T'as ton propre protocole. Tes propres règles. Ta propre façon de te positionner dans les groupes. Les gens qui te connaissent pas encore trouvent ça chelou. Ceux qui te connaissent trouvent ça inimitable. Joyeuse fête, [Prénom].
Avec reconnaissance que ton protocol social est inimitable et c'est une qualité,
— ton ami qui a appris à lire ton protocole et qui ne le changerait pour rien au monde 🎭` },
            { id: "n25_s2_006", angle: "T\'as des opinions très arrêtées sur des trucs très précis.", body: `006. "T'as des opinions très arrêtées sur des trucs très précis."
Des trucs que la plupart des gens ont jamais réfléchi. Et toi t'as une position. Claire. Argumentée. Défendue. Sur ce sujet précis que personne avait mis sur la table. C'est chelou dans le meilleur sens. T'as réfléchi à des trucs que les autres ont pas pris le temps de réfléchir. Joyeuse fête, [Prénom].
Avec respect pour ta façon de réfléchir à des trucs que les autres laissent flotter,
— ton ami qui a été obligé de se forger une opinion sur des sujets auxquels il pensait pas grâce à toi 🧠` },
            { id: "n25_s2_007", angle: "Joyeuse fête. La première fois qu\'on s\'est rencontrés j\'avais pas compris ce que t\'étais.", body: `007. "Joyeuse fête. La première fois qu'on s'est rencontrés j'avais pas compris ce que t'étais."
T'avais l'air d'un truc. T'étais autre chose. Et l'autre chose était beaucoup plus intéressant que ce que j'avais cru au départ. Ce décalage entre la première impression et la réalité c'est une de tes caractéristiques. Les gens qui restent à la première impression ratent quelque chose. Joyeuse fête, [Prénom].
Avec gratitude d'avoir dépassé la première impression et découvert ce qu'il y avait derrière,
— ton ami content d'avoir regardé au-delà de ce qu'il avait cru voir au départ 🔭` },
            { id: "n25_s2_008", angle: "T\'as un humour que tout le monde comprend pas immédiatement.", body: `008. "T'as un humour que tout le monde comprend pas immédiatement."
Y'a un temps de latence. Un moment où les gens cherchent. Et puis ça arrive. Pour certains tout de suite. Pour d'autres plus tard. Pour d'autres jamais. Ceux pour qui ça arrive sont les bons. Ton humour filtre naturellement les gens qui sont faits pour être dans ta vie. Joyeuse fête, [Prénom].
Avec fierté d'être dans la catégorie de ceux pour qui ça arrive,
— ton ami pour qui le déclic s'est fait et qui est content de l'autre côté 😄` },
            { id: "n25_s2_009", angle: "Joyeuse fête. T\'assumes des trucs que les gens de notre âge assument pas encore.", body: `009. "Joyeuse fête. T'assumes des trucs que les gens de notre âge assument pas encore."
Des goûts. Des façons d'être. Des trucs qui pourraient sembler chelous si t'en avais honte. Mais t'en as pas honte. T'assumes. Et cette absence de honte transforme le chelou en singularité. C'est une alchimie que peu de gens maîtrisent. Joyeuse fête, [Prénom].
Avec admiration pour ton alchimie personnelle qui transforme le chelou en singularité,
— ton ami qui apprend de toi l'art d'assumer ce qui le rend différent 🧪` },
            { id: "n25_s2_010", angle: "Tu vois des connexions entre des trucs que les autres voient pas reliés.", body: `010. "Tu vois des connexions entre des trucs que les autres voient pas reliés."
T'as cette façon de relier des domaines. Des idées. Des situations qui semblent sans rapport. Et souvent la connexion que tu vois est réelle. Et intéressante. Et personne d'autre l'avait vue. C'est une façon de penser chelou et précieuse en même temps. Joyeuse fête, [Prénom].
Avec reconnaissance pour les connexions que tu montres et qu'on aurait manquées sans toi,
— ton ami dont la façon de voir le monde a été élargie par les tiennes 🕸️` },
            { id: "n25_s2_011", angle: "Joyeuse fête. T\'es chelou mais d\'une façon qui enrichit les gens autour de toi.", body: `011. "Joyeuse fête. T'es chelou mais d'une façon qui enrichit les gens autour de toi."
C'est la distinction importante. Y'a le chelou qui isole et le chelou qui enrichit. Le tien enrichit. Il apporte une perspective. Un angle. Une façon de voir. Les gens qui passent du temps avec toi repartent avec quelque chose qu'ils avaient pas en arrivant. Joyeuse fête, [Prénom].
Avec constat que je repars toujours avec quelque chose de nouveau après t'avoir vu,
— ton ami enrichi de façon répétée et reconnaissante 💎` },
            { id: "n25_s2_012", angle: "T\'as des rituels et des habitudes que j\'ai arrêté de questionner.", body: `012. "T'as des rituels et des habitudes que j'ai arrêté de questionner."
Ces trucs que tu fais. Ces façons précises de faire certaines choses. Ces détails auxquels tu tiens. J'ai questionné au début. T'as expliqué ou pas. Maintenant je sais que c'est toi. Que ça fait partie du système. Que le système fonctionne. Alors je respecte les rituels. Joyeuse fête, [Prénom].
Avec respect total pour tes rituels même ceux dont j'ai jamais compris la logique,
— ton ami qui respecte le système sans forcément le comprendre 🔮` },
            { id: "n25_s2_013", angle: "Joyeuse fête. T\'as une façon d\'être intense sur des trucs de façon très sélective.", body: `013. "Joyeuse fête. T'as une façon d'être intense sur des trucs de façon très sélective."
Sur certains trucs t'es là à fond. Complètement. Intensément. Et sur d'autres t'es totalement indifférent. Ce contraste. Cette sélectivité de l'intensité. C'est chelou et fascinant. Savoir exactement ce qui mérite ton énergie totale et ce qui ne la mérite pas. Joyeuse fête, [Prénom].
Avec fascination pour ta sélectivité de l'intensité et sa cohérence interne,
— ton ami qui essaie d'apprendre de toi cette économie de l'énergie 🔋` },
            { id: "n25_s2_014", angle: "Les gens qui te connaissent pas encore ont pas encore eu de chance.", body: `014. "Les gens qui te connaissent pas encore ont pas encore eu de chance."
C'est ça la vérité. Ce que les gens voient en premier c'est pas le plus intéressant chez toi. Le plus intéressant ça prend du temps. Ça se mérite. Ça se découvre progressivement. Et ceux qui font l'effort de découvrir trouvent quelque chose de rare. Joyeuse fête, [Prénom].
Avec certitude que les gens qui te découvrent vraiment font une bonne affaire,
— ton ami qui a fait l'effort de découvrir et qui confirme que ça valait tout l'effort 🎁` },
            { id: "n25_s2_015", angle: "Joyeuse fête. T\'es la preuve que chelou et fiable c\'est pas incompatible.", body: `015. "Joyeuse fête. T'es la preuve que chelou et fiable c'est pas incompatible."
T'es imprévisible sur certains trucs. T'as tes particularités. Tes bizarreries. Et en même temps t'es là. T'es présent. T'es fiable. Ces deux choses coexistent parfaitement chez toi et démontrent que la normalité n'est pas une condition de la fiabilité. Joyeuse fête, [Prénom].
Avec gratitude pour ta démonstration vivante que chelou et fiable vont ensemble,
— ton ami qui s'appuie sur ta fiabilité avec confiance malgré ou grâce au chelou 🏗️` },
            { id: "n25_s2_016", angle: "T\'es difficile à décrire aux gens qui te connaissent pas.", body: `016. "T'es difficile à décrire aux gens qui te connaissent pas."
Je peux pas dire juste sympa. C'est insuffisant. Je peux pas dire marrant. C'est incomplet. Je dis quelqu'un d'unique et les gens font une tête. Alors je dis viens le rencontrer. C'est la seule façon. Joyeuse fête, [Prénom], indescriptible.
Avec capitulation devant l'impossibilité de te résumer en quelques adjectifs,
— ton ami qui a arrêté d'essayer de te décrire et qui invite directement à te rencontrer 🤌` },
            { id: "n25_s2_017", angle: "Joyeuse fête. T\'as une façon d\'être présent qui est pas comme les autres.", body: `017. "Joyeuse fête. T'as une façon d'être présent qui est pas comme les autres."
Quand t'es là t'es vraiment là. D'une façon particulière. T'écoutes différemment. Tu regardes différemment. Tu réagis différemment. Cette présence-là elle se ressent. Elle marque. Les conversations avec toi laissent quelque chose. Joyeuse fête, [Prénom].
Avec reconnaissance pour la qualité particulière de ta présence quand tu es là,
— ton ami qui ressort différemment de chaque conversation avec toi 🌊` },
            { id: "n25_s2_018", angle: "No cap t\'es un des trucs les plus intéressants qui me soit arrivé.", body: `018. "No cap t'es un des trucs les plus intéressants qui me soit arrivé."
Pas romantiquement. Humainement. T'as élargi ma façon de voir. T'as challengé des trucs que je pensais acquis. T'as apporté des perspectives que j'aurais pas eu sans toi. T'as rendu ma vie intellectuellement plus riche. C'est pas rien. Joyeuse fête, [Prénom].
Avec bilan honnête de ce que ton existence dans ma vie a produit comme enrichissement,
— ton ami reconnaissant pour tout ce que t'as apporté à sa façon de voir le monde 🧩` },
            { id: "n25_s2_019", angle: "Joyeuse fête. J\'arrive même plus à imaginer mon cercle sans toi dedans.", body: `019. "Joyeuse fête. J'arrive même plus à imaginer mon cercle sans toi dedans."
T'as pris une place. Pas par défaut. Par ce que t'es. Par ce que t'apportes. Par ce que les moments avec toi produisent. Cette place elle est tienne. Elle a toujours été tienne depuis le moment où t'as décidé de la prendre. Joyeuse fête, [Prénom].
Avec constat que ta place dans mon cercle est indéboulonnable et c'est voulu,
— ton ami qui ne conçoit plus son périmètre sans toi dedans 🔵` },
            { id: "n25_s2_020", angle: "Joyeuse fête. T\'es chelou mais t\'es mon chelou. Et à notre âge trouver son chelou c\'est précieux.", body: `020. "Joyeuse fête. T'es chelou mais t'es mon chelou. Et à notre âge trouver son chelou c'est précieux."
À 18-25 ans tout le monde cherche sa tribu. Ses gens. Ceux avec qui ça fait sens. Toi t'es un de mes gens. Chelou et tout. Peut-être chelou d'abord. Et précieux ensuite. Et les deux ensemble. Joyeuse fête, [Prénom].
Avec clarté sur ta place dans ma tribu et sur ce qu'elle représente,
— ton ami pour le chelou long terme et tout ce qui vient avec ❤️` },
          ],
        },
        {
          id: 'vieilli',
          label: "Franchement t'as vieilli",
          emoji: '😄',
          messages: [
            { id: "n25_s3_001", angle: "Joyeuse fête. T\'as vieilli et ça se voit de la meilleure façon qui soit.", body: `001. "Joyeuse fête. T'as vieilli et ça se voit de la meilleure façon qui soit."
Pas dans le sens physique. Dans le sens : t'es plus la personne que j'ai rencontrée. Les couches se sont ajoutées. Les expériences ont laissé des traces. Les trucs difficiles ont construit quelque chose. T'as vieilli vers quelque chose. Pas juste vieilli. Joyeuse fête, [Prénom].
Avec observation que ton vieillissement a une direction et que cette direction est bien,
— ton ami qui suit ta trajectoire depuis un moment et qui confirme qu'elle va quelque part de bien 🧭` },
            { id: "n25_s3_002", angle: "T\'aurais pas dit ça il y a trois ans.", body: `002. "T'aurais pas dit ça il y a trois ans."
Cette opinion. Cette façon de voir ce truc précis. Ce positionnement. Y'a trois ans t'avais une autre version. Moins nuancée. Moins construite. Moins toi peut-être. Ce que tu penses maintenant c'est le résultat de trucs vécus et réfléchis. Ça s'entend. Joyeuse fête, [Prénom].
Avec archivage mental de tes versions précédentes pour mesurer le chemin parcouru,
— ton ami qui conserve les anciennes versions de toi comme points de référence 📁` },
            { id: "n25_s3_003", angle: "Joyeuse fête. Tu gères les relations différemment qu\'avant.", body: `003. "Joyeuse fête. Tu gères les relations différemment qu'avant."
T'investis différemment. Tu choisis différemment. Tu poses des limites différemment. Tu lâches différemment aussi. Cette évolution dans ta façon de gérer les relations dit que t'as appris des trucs. Parfois à tes dépens. Mais t'as appris. Joyeuse fête, [Prénom].
Avec respect pour les apprentissages relationnels que tu as accumulés,
— ton ami qui a observé cette évolution et qui en a profité aussi 🌱` },
            { id: "n25_s3_004", angle: "T\'as développé un rapport à toi-même que t\'avais pas avant.", body: `004. "T'as développé un rapport à toi-même que t'avais pas avant."
Une façon de te connaître. De savoir ce dont t'as besoin. Ce qui te convient et ce qui te convient pas. Ce qui te fatigue et ce qui te recharge. Cette connaissance de soi elle se construit lentement. Et la tienne s'est construite visiblement. Joyeuse fête, [Prénom].
Avec observation de ta connaissance croissante de toi-même et de ce qu'elle produit,
— ton ami qui trouve que tu te connais mieux que la plupart des gens de notre âge 🪞` },
            { id: "n25_s3_005", angle: "Joyeuse fête. Ta façon de parler de l\'avenir a changé.", body: `005. "Joyeuse fête. Ta façon de parler de l'avenir a changé."
Avant c'était plus flottant. Plus anxieux peut-être. Ou plus utopique dans l'autre sens. Maintenant t'en parles avec plus de pragmatisme. Pas de résignation. Du pragmatisme. T'as intégré que l'avenir se construit avec ce qu'on a maintenant. Joyeuse fête, [Prénom].
Avec observation de ton pragmatisme croissant sur l'avenir et ce qu'il dit de ta maturité,
— ton ami qui préfère ton pragmatisme actuel à l'anxiété ou l'utopie d'avant 🔭` },
            { id: "n25_s3_006", angle: "T\'as fait la paix avec des trucs que tu portais.", body: `006. "T'as fait la paix avec des trucs que tu portais."
Je sais pas exactement lesquels. T'en as parlé de certains. D'autres je les devine. Mais quelque chose s'est allégé. Une façon d'être moins défensif sur certains sujets. Moins chargé sur d'autres. Cette paix-là elle se gagne. T'as travaillé pour elle. Joyeuse fête, [Prénom].
Avec reconnaissance de la paix visible que t'as gagnée sur certains trucs,
— ton ami qui a vu le poids et qui voit l'allègement et qui est content pour toi 🕊️` },
            { id: "n25_s3_007", angle: "Joyeuse fête. Tu te définis moins par ce que t\'es pas.", body: `007. "Joyeuse fête. Tu te définis moins par ce que t'es pas."
Avant y'avait plus de définition par opposition. Je suis pas comme ci. Je fais pas comme ça. Je veux pas être ce truc. Maintenant t'as l'air de te définir plus par ce que t'es vraiment. Par ce que tu veux. Par ce qui compte pour toi. C'est une évolution significative. Joyeuse fête, [Prénom].
Avec observation de ton passage de la définition par opposition à la définition par affirmation,
— ton ami qui trouve cette évolution une des plus importantes qu'il t'a vues faire ✨` },
            { id: "n25_s3_008", angle: "T\'as des priorités claires maintenant.", body: `008. "T'as des priorités claires maintenant."
Pas complètement. Pas toujours. Mais comparé à avant. T'as fait des choix. T'as décidé ce qui méritait ton énergie et ce qui la méritait pas. Ces décisions-là te définissent. Et les tiennes définissent quelqu'un qui sait de mieux en mieux ce qui compte. Joyeuse fête, [Prénom].
Avec observation de tes priorités qui se clarifient progressivement,
— ton ami qui voit la clarification en cours et qui trouve ça bien à regarder 🎯` },
            { id: "n25_s3_009", angle: "Joyeuse fête. T\'as arrêté de chercher l\'approbation de certains gens.", body: `009. "Joyeuse fête. T'as arrêté de chercher l'approbation de certains gens."
Certains gens précis. Dont certains qui auraient mérité que tu continues pas à chercher leur approbation depuis longtemps. T'as arrêté. Progressivement. Sans drama. Tu t'en es juste détaché. C'est de la liberté gagnée. Joyeuse fête, [Prénom].
Avec satisfaction de te voir libre d'approbations qui ne méritaient pas autant de place,
— ton ami qui attendait que tu fasses cette paix et qui est soulagé que t'y sois arrivé 🔓` },
            { id: "n25_s3_010", angle: "T\'as un rapport à l\'échec qui a changé.", body: `010. "T'as un rapport à l'échec qui a changé."
Avant l'échec avait l'air plus lourd. Plus définitif. Plus identitaire. Maintenant t'en parles différemment. Tu l'intègres différemment. Tu rebondis différemment. T'as compris que l'échec c'est de l'information. Pas une sentence. Joyeuse fête, [Prénom].
Avec observation de ton rapport transformé à l'échec et ce que ça change concrètement,
— ton ami qui apprend de ta façon de traiter l'échec comme de l'information 📊` },
            { id: "n25_s3_011", angle: "Joyeuse fête. Tu sais mieux ce que tu veux dans une relation.", body: `011. "Joyeuse fête. Tu sais mieux ce que tu veux dans une relation."
Amicale. Amoureuse. Professionnelle. T'as des critères maintenant. Pas des critères rigides. Des directions. Des trucs qui comptent. Des trucs qui comptent pas. Cette clarté-là elle vient de l'expérience et de l'honnêteté envers soi-même. T'as les deux. Joyeuse fête, [Prénom].
Avec respect pour la clarté que t'as développée sur ce que tu veux des relations,
— ton ami qui bénéficie de ta clarté relationnelle et qui s'en trouve bien 💛` },
            { id: "n25_s3_012", angle: "T\'as grandi et t\'as gardé l\'essentiel.", body: `012. "T'as grandi et t'as gardé l'essentiel."
C'est le truc le plus difficile en grandissant. Garder ce qui était bien. Ce qui était vrai. Ce qui était toi avant que les trucs difficiles arrivent. T'as gardé ça. Tout en ajoutant ce que l'expérience donne. C'est la version la plus réussie du vieillissement. Joyeuse fête, [Prénom].
Avec admiration pour ta capacité à évoluer sans perdre l'essentiel,
— ton ami qui reconnaît en toi maintenant ce qu'il aimait en toi avant 🧬` },
            { id: "n25_s3_013", angle: "Joyeuse fête. Ta façon d\'être en désaccord a évolué.", body: `013. "Joyeuse fête. Ta façon d'être en désaccord a évolué."
Avant le désaccord avait parfois l'air d'un combat. Maintenant t'as l'air de pouvoir être en désaccord tout en restant en lien. De défendre ton point sans avoir besoin que l'autre capitule. Cette évolution-là dit quelque chose de fort sur ta maturité. Joyeuse fête, [Prénom].
Avec observation de ton évolution vers un désaccord qui n'est plus une guerre,
— ton ami qui a bénéficié de cette évolution dans nos propres désaccords 🤝` },
            { id: "n25_s3_014", angle: "T\'as moins besoin de te justifier.", body: `014. "T'as moins besoin de te justifier."
Avant y'avait plus d'explications. Plus de justifications de tes choix. Comme si t'avais besoin que les autres comprennent pour que tes choix soient valides. Maintenant tu fais et tu expliques si t'en as envie. Pas parce que t'as besoin qu'on valide. Joyeuse fête, [Prénom].
Avec respect pour ton rapport transformé à la validation extérieure,
— ton ami qui trouve cette autonomie de validation une de tes plus belles évolutions 🌿` },
            { id: "n25_s3_015", angle: "Joyeuse fête. T\'as développé une tolérance à l\'incertitude.", body: `015. "Joyeuse fête. T'as développé une tolérance à l'incertitude."
À notre âge tout est incertain. L'avenir. Les relations. Le travail. L'identité parfois. Et toi t'as développé une façon de vivre dans cette incertitude sans être paralysé. Sans avoir besoin que tout soit résolu pour avancer. C'est une compétence rare. Joyeuse fête, [Prénom].
Avec admiration pour ta tolérance à l'incertitude dans un monde qui en est plein,
— ton ami qui apprend de toi à avancer sans avoir toutes les réponses 🌫️` },
            { id: "n25_s3_016", angle: "Tu prends soin de toi différemment qu\'avant.", body: `016. "Tu prends soin de toi différemment qu'avant."
Pas juste physiquement. Dans tous les sens. Tu te ménages plus. Tu te respectes plus. Tu t'accordes des trucs que t'aurais pas considérés avant. Ce soin de soi c'est un apprentissage long. Et t'es clairement plus loin dans cet apprentissage qu'il y a quelques années. Joyeuse fête, [Prénom].
Avec observation de ton évolution vers un meilleur soin de toi-même,
— ton ami qui trouve que tu mérites tout le soin que tu commences à te donner 🌸` },
            { id: "n25_s3_017", angle: "Joyeuse fête. T\'as vieilli ensemble avec moi et c\'est pas anodin.", body: `017. "Joyeuse fête. T'as vieilli ensemble avec moi et c'est pas anodin."
On s'est vus grandir. On s'est vus changer. On s'est vus traverser des trucs. Et on est encore là ensemble. Les amitiés qui survivent au vieillissement des deux côtés c'est pas donné. La nôtre a survécu. Elle a même grandi avec nous. Joyeuse fête, [Prénom].
Avec conscience que notre amitié a aussi vieilli et que cette version-là est la meilleure,
— ton ami pour toutes les prochaines versions de nous deux 💛` },
            { id: "n25_s3_018", angle: "T\'as une façon d\'occuper l\'espace différente.", body: `018. "T'as une façon d'occuper l'espace différente."
Pas physiquement. Énergétiquement. Socialement. T'occupes ta place avec plus d'assurance. Moins d'excuses. Moins d'effacement. Plus de présence assumée. Cette façon d'être là vraiment là c'est quelque chose qui se développe avec le temps et la confiance. Joyeuse fête, [Prénom].
Avec observation de ta présence assumée et de ce qu'elle dit de ton évolution,
— ton ami qui trouve que ta façon d'occuper l'espace maintenant te ressemble vraiment 🌟` },
            { id: "n25_s3_019", angle: "Joyeuse fête. La version de toi d\'il y a cinq ans serait fière.", body: `019. "Joyeuse fête. La version de toi d'il y a cinq ans serait fière."
Pas parce que t'as tout réussi. Parce que t'as avancé. Parce que t'as traversé des trucs. Parce que t'es là. Parce que t'es devenu quelqu'un de plus construit. Plus cohérent. Plus toi. Cette version ancienne de toi aurait vu où tu en es et aurait dit ah ouais. Bien. Joyeuse fête, [Prénom].
Avec perspective temporelle qui change la façon dont tu peux voir ton propre chemin,
— ton ami qui te demande d'appliquer cette perspective sur toi-même régulièrement 📐` },
            { id: "n25_s3_020", angle: "Joyeuse fête. T\'as vieilli. Et franchement c\'est une bonne nouvelle pour tout le monde.", body: `020. "Joyeuse fête. T'as vieilli. Et franchement c'est une bonne nouvelle pour tout le monde."
Pour toi d'abord. Pour les gens autour de toi ensuite. La version que t'es maintenant est plus riche. Plus nuancée. Plus solide. Plus toi. Le vieillissement a été généreux avec toi dans le sens où il t'a construit plus qu'il t'a abîmé. Joyeuse fête, [Prénom].
Avec bilan positif et sincère de ce que le temps a produit en toi,
— ton ami pour toutes les prochaines années de vieillissement en bonne compagnie ❤️` },
          ],
        },
        {
          id: 'trucs',
          label: "On a vécu des trucs",
          emoji: '🧡',
          messages: [
            { id: "n25_s4_001", angle: "Joyeuse fête. On a quand même accumulé des trucs toi et moi.", body: `001. "Joyeuse fête. On a quand même accumulé des trucs toi et moi."
Pas des trucs de film. Des trucs réels. Des moments ordinaires qui sont devenus les nôtres. Des situations qu'on a traversées ensemble et qui existent maintenant dans nos mémoires respectives sous des formes légèrement différentes. Ces trucs-là appartiennent qu'à nous deux. Joyeuse fête, [Prénom].
Avec conscience de l'exclusivité de ce qu'on a construit ensemble,
— ton ami gardien de sa version de l'histoire commune 🗝️` },
            { id: "n25_s4_002", angle: "T\'as été là pendant une période difficile. Je l\'oublie pas.", body: `002. "T'as été là pendant une période difficile. Je l'oublie pas."
T'aurais pu être ailleurs. T'avais tes propres trucs. Et t'as quand même été là. D'une façon ou d'une autre. Présent. Disponible. Ou juste pas parti. Ça compte énormément. Et je te le dis aujourd'hui parce que je te l'ai peut-être pas dit assez à l'époque. Joyeuse fête, [Prénom].
Avec retard assumé sur un remerciement qui aurait dû venir plus tôt,
— ton ami qui règle ses dettes de reconnaissance les jours qui comptent 💛` },
            { id: "n25_s4_003", angle: "Joyeuse fête. On a survécu à des trucs qui auraient pu nous séparer.", body: `003. "Joyeuse fête. On a survécu à des trucs qui auraient pu nous séparer."
Des malentendus. Des périodes de distance. Des moments où la communication était pas au top. Des trucs extérieurs qui mettent la pression sur les amitiés. On a traversé tout ça. Et on est là. Ensemble encore. Ce n'est pas anodin à notre âge où les amitiés bougent beaucoup. Joyeuse fête, [Prénom].
Avec fierté tranquille d'être de l'autre côté de tous les trucs qui auraient pu nous séparer,
— ton ami survivant avec toi de tout ce qui aurait pu avoir raison de nous 🏅` },
            { id: "n25_s4_004", angle: "On a eu des conversations qui ont changé des trucs pour de vrai.", body: `004. "On a eu des conversations qui ont changé des trucs pour de vrai."
Pas les conversations de surface. Les autres. Celles qui arrivent tard le soir ou dans des moments inattendus. Celles où on dit des trucs vrais. Où on entend des trucs vrais. Ces conversations-là ont laissé des traces dans ma façon de voir certaines choses. T'as changé des trucs sans faire exprès. Joyeuse fête, [Prénom].
Avec inventaire des conversations qui ont produit des changements réels,
— ton ami influencé par toi plus profondément qu'il ne le montre habituellement 🌊` },
            { id: "n25_s4_005", angle: "Joyeuse fête. On a ri de trucs qu\'on aurait pas dû trouver drôles.", body: `005. "Joyeuse fête. On a ri de trucs qu'on aurait pas dû trouver drôles."
Des situations qui étaient pas drôles sur le moment. Des trucs qu'on pouvait pas dire à voix haute devant tout le monde. Et entre nous c'est devenu des blagues. Ces blagues-là sont scellées. Elles appartiennent à nous deux et à personne d'autre. Joyeuse fête, [Prénom].
Avec patrimoine de blagues inavouables soigneusement conservé,
— ton ami co-détenteur de ce patrimoine et gardien discret de son contenu 😂` },
            { id: "n25_s4_006", angle: "T\'as fait un truc pour moi que j\'ai pas oublié.", body: `006. "T'as fait un truc pour moi que j'ai pas oublié."
Je te dirai peut-être lequel aujourd'hui. Ou peut-être pas. Mais tu sais qu'il y a ce truc. Ce moment où t'as fait quelque chose. Pas parce que t'y étais obligé. Juste parce que c'était toi. Et moi j'ai vu. Et je l'ai mis quelque part que je perds pas. Joyeuse fête, [Prénom].
Avec mémoire intacte de ce truc précis que t'as fait et que je garde,
— ton ami qui porte ce truc quelque part de permanent 🔒` },
            { id: "n25_s4_007", angle: "Joyeuse fête. On a vécu des trucs qui nous ont changés tous les deux.", body: `007. "Joyeuse fête. On a vécu des trucs qui nous ont changés tous les deux."
Pas les mêmes changements. Pas dans les mêmes proportions. Mais on est ressortis différents de certaines périodes. Et le fait qu'on les ait traversées ensemble signifie qu'on s'est vus changer. Qu'on a été témoins l'un de l'autre. C'est une forme d'intimité rare. Joyeuse fête, [Prénom].
Avec conscience d'être témoins mutuels de nos changements depuis tout ce temps,
— ton ami qui a vu tes transformations et qui est fier d'avoir été là pour les voir 👁️` },
            { id: "n25_s4_008", angle: "On s\'est perdus et retrouvés et la version retrouvée était meilleure.", body: `008. "On s'est perdus et retrouvés et la version retrouvée était meilleure."
Y'a eu une période. Un moment de distance. Intentionnel ou pas. Et puis le retour. Et le retour était plus riche que ce qu'on avait avant. Comme si la pause avait laissé grandir quelque chose. La version actuelle de notre amitié doit quelque chose à cette période de distance. Joyeuse fête, [Prénom].
Avec gratitude inattendue pour la période de distance qui a rendu le retour plus riche,
— ton ami content d'être de l'autre côté de cette période et de ce qu'elle a produit 🌱` },
            { id: "n25_s4_009", angle: "Joyeuse fête. T\'as tenu des trucs que je t\'avais confiés.", body: `009. "Joyeuse fête. T'as tenu des trucs que je t'avais confiés."
Des choses que je t'ai dites. Des trucs que je t'ai montrés. Des vulnérabilités que j'ai partagées. T'as tenu tout ça. Avec soin. Sans en faire autre chose que ce que c'était. Cette façon de tenir ce qu'on te confie c'est une des choses que j'admire le plus chez toi. Joyeuse fête, [Prénom].
Avec gratitude pour ta façon de tenir ce qu'on te confie sans jamais en faire autre chose,
— ton ami qui sait que ce qu'il te dit reste là où il le met 🤝` },
            { id: "n25_s4_010", angle: "On a attendu des nouvelles ensemble.", body: `010. "On a attendu des nouvelles ensemble."
Des résultats. Des réponses. Des verdicts de toutes sortes. Ces moments où on sait pas encore comment ça va tourner et où on est deux à pas savoir. Ces attentes partagées. Elles créent quelque chose entre les gens. Une solidarité dans l'incertitude. On en a eu plusieurs. Joyeuse fête, [Prénom].
Avec mémoire des attentes partagées et de ce qu'elles ont construit entre nous,
— ton ami de salle d'attente pour toutes les prochaines nouvelles aussi 🕐` },
            { id: "n25_s4_011", angle: "Joyeuse fête. On a fait des erreurs ensemble et on s\'en est remis.", body: `011. "Joyeuse fête. On a fait des erreurs ensemble et on s'en est remis."
Pas toujours facilement. Pas toujours rapidement. Mais on s'en est remis. Ces erreurs font partie de l'histoire. Elles ont mis la pression. Elles ont demandé des ajustements. Et notre amitié a absorbé tout ça et a continué. C'est ce que font les vraies amitiés. Joyeuse fête, [Prénom].
Avec respect pour la résistance de ce qu'on a construit face aux erreurs des deux côtés,
— ton ami qui assume sa part des erreurs communes et qui est content qu'on soit passés dessus 🙋` },
            { id: "n25_s4_012", angle: "T\'as dit un truc qui est resté.", body: `012. "T'as dit un truc qui est resté."
Une phrase. Un moment. Quelque chose que t'as dit et qui s'est installé quelque part en moi et qui en est pas parti. T'as laissé une empreinte verbale sans savoir que tu la laissais. Ces empreintes-là c'est ce qui reste longtemps après les conversations. Joyeuse fête, [Prénom].
Avec mémoire intacte de cette phrase précise et de l'endroit où elle est restée,
— ton ami qui porte cette empreinte sans te l'avoir dit jusqu'à aujourd'hui 💬` },
            { id: "n25_s4_013", angle: "Joyeuse fête. On a célébré des trucs ensemble.", body: `013. "Joyeuse fête. On a célébré des trucs ensemble."
Les bons trucs. Les réussites. Les étapes. Les moments où quelque chose de bien se passait et où t'étais là pour le marquer avec moi ou moi avec toi. Ces célébrations partagées elles comptent autant que les moments difficiles traversés ensemble. Peut-être plus. Joyeuse fête, [Prénom].
Avec inventaire des célébrations partagées et leur valeur dans notre histoire commune,
— ton ami pour toutes les prochaines réussites à célébrer ensemble 🥂` },
            { id: "n25_s4_014", angle: "On a vécu des trucs qui ont renforcé ce qu\'on était l\'un pour l\'autre.", body: `014. "On a vécu des trucs qui ont renforcé ce qu'on était l'un pour l'autre."
Certains trucs testent les amitiés. Certains les fragilisent. Certains les renforcent. Les nôtres ont majoritairement renforcé. Ce bilan c'est pas dû au hasard. C'est dû à la façon dont on a géré les trucs quand ils arrivaient. Des deux côtés. Joyeuse fête, [Prénom].
Avec constat que notre bilan commun est majoritairement dans la colonne renforcement,
— ton ami qui attribue ce bilan à nous deux et à la façon dont on a géré ensemble 🧱` },
            { id: "n25_s4_015", angle: "Joyeuse fête. T\'as été honnête avec moi à des moments où c\'était inconfortable.", body: `015. "Joyeuse fête. T'as été honnête avec moi à des moments où c'était inconfortable."
T'aurais pu dire ce que je voulais entendre. C'était disponible. C'était plus facile. T'as dit le vrai. Pas cruellement. Honnêtement. Et sur le moment j'appréciais pas toujours. Et après j'appréciais toujours. Parce que le vrai m'avançait plus que le confortable. Joyeuse fête, [Prénom].
Avec reconnaissance pour toutes tes vérités inconfortables et ce qu'elles m'ont apporté,
— ton ami qui préfère tes vérités difficiles à n'importe quel mensonge doux 🪞` },
            { id: "n25_s4_016", angle: "On a traversé nos premières vraies galères d\'adultes ensemble.", body: `016. "On a traversé nos premières vraies galères d'adultes ensemble."
Ces galères qui arrivent après 18 ans. Administratives. Financières. Relationnelles. Professionnelles. Ces galères adultes qui sont différentes des galères d'avant. Plus lourdes parfois. Plus concrètes. On les a traversées en parallèle. Pas toujours les mêmes. Mais en sachant que l'autre traversait aussi. Joyeuse fête, [Prénom].
Avec solidarité pour toutes les galères adultes traversées en parallèle,
— ton ami de tranchée pour toutes les galères qui restent à venir 🫂` },
            { id: "n25_s4_017", angle: "Joyeuse fête. On a grandi ensemble et nos versions actuelles se ressemblent encore.", body: `017. "Joyeuse fête. On a grandi ensemble et nos versions actuelles se ressemblent encore."
C'est pas acquis. Des gens grandissent et divergent tellement qu'ils se retrouvent étrangers. Nous on a grandi et nos versions actuelles sont encore compatibles. Encore complémentaires. Encore capables de se comprendre. C'est une chance que je mesure. Joyeuse fête, [Prénom].
Avec mesure consciente de la chance que nos trajectoires restent compatibles,
— ton ami qui choisit activement que ça reste comme ça 💛` },
            { id: "n25_s4_018", angle: "T\'as défendu quelque chose qui me concernait devant des gens.", body: `018. "T'as défendu quelque chose qui me concernait devant des gens."
Sans me demander. Sans prévenir. T'as pris position. T'as dit ce que tu pensais. T'as mis ton nom sur quelque chose qui me concernait. Je l'ai su après. Et ça m'a touché plus que n'importe quel geste préparé à l'avance. Joyeuse fête, [Prénom].
Avec reconnaissance pour cette défense spontanée et ce qu'elle dit sur toi,
— ton ami qui sait que t'as fait ça et qui le porte quelque part de précieux 🛡️` },
            { id: "n25_s4_019", angle: "Joyeuse fête. On a eu des fous rires qui m\'ont fait du bien à des moments où j\'en avais besoin.", body: `019. "Joyeuse fête. On a eu des fous rires qui m'ont fait du bien à des moments où j'en avais besoin."
Ces rires qui arrivent au bon moment. Pas planifiés. Pas forcés. Qui partent d'un truc et qui durent trop longtemps. Ces rires-là ils ont une fonction thérapeutique que personne n'a commandée. T'as été la source de plusieurs d'entre eux à des moments clés. Joyeuse fête, [Prénom].
Avec gratitude pour les fous rires arrivés exactement quand il fallait,
— ton ami qui mesure la valeur de tes rires à leur timing autant qu'à leur intensité 😂` },
            { id: "n25_s4_020", angle: "Joyeuse fête. J\'aurais pas voulu vivre tout ça avec quelqu\'un d\'autre.", body: `020. "Joyeuse fête. J'aurais pas voulu vivre tout ça avec quelqu'un d'autre."
Les bons trucs. Les moins bons. Les moments d'attente. Les célébrations. Les vérités difficiles. Les fous rires. Tout l'ensemble. Si j'avais pu choisir avec qui accumuler tout ça depuis le début j'aurais choisi toi. Sans hésiter. Joyeuse fête, [Prénom].
Avec certitude absolue sur ce choix rétrospectif,
— ton ami pour tous les trucs qui restent encore à vivre ensemble ❤️` },
          ],
        },
        {
          id: 'no_cap',
          label: "No cap t'assures",
          emoji: '⭐',
          messages: [
            { id: "n25_s5_001", angle: "Joyeuse fête. No cap t\'assures dans une période où assurer c\'est pas simple.", body: `001. "Joyeuse fête. No cap t'assures dans une période où assurer c'est pas simple."
Notre âge c'est pas l'âge où tout est stable. Tout bouge. Tout se redéfinit. Les repères changent. Et toi dans tout ça t'avances. T'as pas tout résolu. T'as pas tout réglé. Mais t'avances avec une cohérence qui force le respect. Joyeuse fête, [Prénom].
Avec respect pour ta cohérence dans une période qui ne facilite pas la cohérence,
— ton ami qui observe ton avancée et qui s'en inspire pour la sienne 🧭` },
            { id: "n25_s5_002", angle: "T\'assures dans ta vie professionnelle même quand c\'est chaotique.", body: `002. "T'assures dans ta vie professionnelle même quand c'est chaotique."
Le monde du travail à notre âge c'est rarement linéaire. C'est des ajustements. Des remises en question. Des trucs qui marchent pas comme prévu. Et toi tu navigues dans ce chaos avec une direction. Même floue. Même imparfaite. T'as une direction. Joyeuse fête, [Prénom].
Avec admiration pour ta navigation professionnelle dans un contexte qui ne facilite rien,
— ton ami qui galère aussi sur ce terrain et qui trouve du réconfort à te voir avancer 🗺️` },
            { id: "n25_s5_003", angle: "Joyeuse fête. T\'assures dans tes relations et ça se voit.", body: `003. "Joyeuse fête. T'assures dans tes relations et ça se voit."
La façon dont tu traites les gens qui comptent pour toi. La qualité de présence que tu leur offres. Le soin que tu mets dans tes liens. Ces trucs-là ne sont pas automatiques. Ils demandent de l'attention. De l'intention. Et toi tu les mets. Joyeuse fête, [Prénom].
Avec observation de l'intention que tu mets dans tes relations et de ce qu'elle produit,
— ton ami bénéficiaire de cette intention depuis un moment 💛` },
            { id: "n25_s5_004", angle: "No cap tu tiens tes engagements.", body: `004. "No cap tu tiens tes engagements."
Dans un monde où les engagements flottent. Où les plans tombent. Où les promesses s'érodent. Toi tu tiens ce que tu dis. Si tu dis que t'es là t'es là. Si tu dis que tu fais quelque chose tu le fais. Cette fiabilité-là est devenue rare. Et toi t'as ça. Joyeuse fête, [Prénom].
Avec attestation de ta fiabilité dans un contexte où elle est de moins en moins évidente,
— ton ami qui s'appuie sur ta parole avec confiance depuis le début 🔒` },
            { id: "n25_s5_005", angle: "Joyeuse fête. T\'assures financièrement dans une période où c\'est un défi.", body: `005. "Joyeuse fête. T'assures financièrement dans une période où c'est un défi."
Le contexte économique est ce qu'il est à notre âge. Les loyers. Les charges. Les imprévus. T'as un rapport à tout ça qui est plus conscient que la moyenne. T'anticipes. T'ajustes. T'as pas résolu l'équation mais t'as une façon de la gérer qui mérite le respect. Joyeuse fête, [Prénom].
Avec respect pour ta gestion économique dans un contexte particulièrement difficile,
— ton ami qui te consulte parfois et qui suit tes conseils avec un taux de réussite acceptable 💶` },
            { id: "n25_s5_006", angle: "T\'as porté des trucs lourds cette année sans que ça se voie trop.", body: `006. "T'as porté des trucs lourds cette année sans que ça se voie trop."
Je sais ce que t'as porté. Pas tout. Mais assez pour savoir que c'était pas léger. Et t'as continué à avancer. À être présent. À assurer pour les autres aussi. Ce portage silencieux c'est une forme de force que peu de gens voient et que moi je vois. Joyeuse fête, [Prénom].
Avec vision claire de ce que t'as porté en silence et respect pour la façon dont tu l'as porté,
— ton ami qui voit le poids même quand tu fais tout pour qu'il paraisse léger 💪` },
            { id: "n25_s5_007", angle: "Joyeuse fête. No cap t\'as pris des décisions difficiles et tu les assumes.", body: `007. "Joyeuse fête. No cap t'as pris des décisions difficiles et tu les assumes."
Des choix qui coûtaient quelque chose. Qui demandaient de renoncer à autre chose. Qui avaient des conséquences pas toutes prévisibles. T'as fait ces choix. Avec les informations que t'avais. Et t'assumes ce qu'ils ont produit. Sans te victimiser. Sans regretter indéfiniment. Joyeuse fête, [Prénom].
Avec respect pour ta façon d'assumer tes choix difficiles et leurs conséquences,
— ton ami qui trouve cette posture une des plus matures qui soit 🎯` },
            { id: "n25_s5_008", angle: "T\'assures avec les gens qui dépendent de toi.", body: `008. "T'assures avec les gens qui dépendent de toi."
Que ce soit ta famille. Des amis dans des moments difficiles. Des engagements pris. Quand quelqu'un dépend de toi tu es là. T'honores cette dépendance. Tu la prends au sérieux. Sans te plaindre de ce qu'elle demande. Joyeuse fête, [Prénom].
Avec observation de ta façon sérieuse et silencieuse d'honorer ce qu'on attend de toi,
— ton ami qui sait qu'il peut compter sur toi et qui ne prend pas ça pour acquis 🫂` },
            { id: "n25_s5_009", angle: "Joyeuse fête. T\'as investi dans des trucs qui comptent vraiment.", body: `009. "Joyeuse fête. T'as investi dans des trucs qui comptent vraiment."
Ton temps. Ton énergie. Ton attention. T'as pas tout mis dans des trucs superficiels. T'as fait des choix sur où mettre ce que t'as de précieux. Et ces choix-là disent quelque chose sur ce qui compte vraiment pour toi. Sur tes vraies valeurs. Pas les valeurs déclarées. Les valeurs vécues. Joyeuse fête, [Prénom].
Avec observation de tes valeurs vécues à travers tes investissements réels,
— ton ami qui fait partie des trucs où tu investis et qui en est conscient 🌱` },
            { id: "n25_s5_010", angle: "No cap tu progresses sur des trucs difficiles.", body: `010. "No cap tu progresses sur des trucs difficiles."
Ces domaines où c'était compliqué pour toi. Ces zones où t'avais des blocages. Ces patterns que tu voulais changer. Je t'observe depuis un moment. Et je vois des changements réels. Pas spectaculaires. Réels. Et les changements réels valent mille fois les spectaculaires. Joyeuse fête, [Prénom].
Avec témoignage de tes progrès réels sur le long terme,
— ton ami témoin de tes changements discrets et convaincu de leur valeur 📈` },
            { id: "n25_s5_011", angle: "Joyeuse fête. T\'assures dans ta façon de prendre soin de toi.", body: `011. "Joyeuse fête. T'assures dans ta façon de prendre soin de toi."
C'est un apprentissage de notre âge. Apprendre à se traiter avec le soin qu'on accorde aux autres. T'as fait des progrès là-dessus. Tu te ménages plus. Tu poses des limites pour toi. Tu t'accordes des trucs dont t'as besoin. C'est de la gestion adulte de soi. Joyeuse fête, [Prénom].
Avec admiration pour tes progrès dans l'art de prendre soin de toi comme tu prends soin des autres,
— ton ami qui trouve que tu mérites tout le soin que tu commences à te donner 🌸` },
            { id: "n25_s5_012", angle: "T\'as une intégrité qui est constante.", body: `012. "T'as une intégrité qui est constante."
Dans les petites choses comme dans les grandes. T'es le même en public et en privé. Ce que tu dis et ce que tu fais sont cohérents. Cette intégrité constante c'est une rareté. Et c'est une des choses qui me font le plus te respecter. No cap. Joyeuse fête, [Prénom].
Avec respect sincère pour ton intégrité constante dans les grands et les petits trucs,
— ton ami qui a testé cette cohérence dans plusieurs contextes et qui confirme 🧭` },
            { id: "n25_s5_013", angle: "Joyeuse fête. No cap t\'as géré une période vraiment difficile avec classe.", body: `013. "Joyeuse fête. No cap t'as géré une période vraiment difficile avec classe."
Je sais ce que c'était. Je sais ce que ça t'a demandé. Et t'as traversé ça avec une dignité que beaucoup auraient pas eue. T'as pas tout explosé. T'as pas tout effondré. T'as traversé. Avec classe. Joyeuse fête, [Prénom].
Avec respect profond pour la façon dont tu as traversé cette période précise,
— ton ami qui était là pendant et qui a été témoin de ta façon de tenir 🫂` },
            { id: "n25_s5_014", angle: "T\'as su reconnaître tes limites et les communiquer.", body: `014. "T'as su reconnaître tes limites et les communiquer."
C'est deux compétences distinctes et difficiles. Reconnaître où sont ses limites. Et avoir le courage de les communiquer sans s'excuser d'en avoir. T'as développé ça. Et les gens autour de toi t'en respectent plus. Même s'ils le disent pas toujours. Joyeuse fête, [Prénom].
Avec admiration pour ta double compétence limite-communication,
— ton ami qui apprend de toi à nommer ses limites sans s'en excuser 🛡️` },
            { id: "n25_s5_015", angle: "Joyeuse fête. T\'assures en silence sur des trucs que les gens voient pas.", body: `015. "Joyeuse fête. T'assures en silence sur des trucs que les gens voient pas."
Ces trucs quotidiens. Ces efforts discrets. Ces maintiens invisibles. Ces petites choses que tu fais régulièrement et qui ne font jamais l'objet d'applaudissements. Le travail silencieux est le plus honnête. Et t'en fais beaucoup. Joyeuse fête, [Prénom].
Avec reconnaissance pour tout le travail silencieux que tu fais sans que personne l'annonce,
— ton ami qui tient la liste de tes actions discrètes et qui la trouve longue 📋` },
            { id: "n25_s5_016", angle: "No cap t\'es quelqu\'un sur qui on peut compter.", body: `016. "No cap t'es quelqu'un sur qui on peut compter."
Dans notre génération où tout est fluide et rien est certain t'es un point fixe. Un repère. Quelqu'un dont on sait qu'il sera là si on a besoin. Cette solidité-là elle est précieuse. Elle est rare. Et toi t'as ça naturellement. Joyeuse fête, [Prénom].
Avec reconnaissance d'être un de ceux qui peuvent compter sur toi,
— ton ami qui sait que t'es là et qui trouve ça immensément précieux dans le monde dans lequel on vit 🔒` },
            { id: "n25_s5_017", angle: "Joyeuse fête. T\'assures dans ta façon d\'être ami.", body: `017. "Joyeuse fête. T'assures dans ta façon d'être ami."
La qualité de présence que t'offres. Le soin que tu mets. La façon dont tu te souviens des trucs importants pour les autres. La façon dont tu apparais quand ça compte. Être un bon ami à notre âge avec tout ce que la vie demande c'est un effort. Et toi tu le fais. Joyeuse fête, [Prénom].
Avec gratitude pour la qualité de ton amitié dans une période où tout le monde est busy,
— ton ami qui mesure l'effort que ça représente et qui l'apprécie vraiment 💛` },
            { id: "n25_s5_018", angle: "T\'as des rêves et tu travailles dessus.", body: `018. "T'as des rêves et tu travailles dessus."
Pas juste en parler. Travailler dessus. Concrètement. Dans le quotidien. Dans les choix. Dans ce à quoi tu consacres ton énergie. Cette cohérence entre ce que tu veux et ce que tu fais pour y arriver c'est ce qui sépare les rêves qui se réalisent des autres. Joyeuse fête, [Prénom].
Avec admiration pour ta cohérence entre tes rêves et ton travail quotidien,
— ton ami qui croit en ta capacité à y arriver et qui le dit sans réserve 🎯` },
            { id: "n25_s5_019", angle: "Joyeuse fête. No cap t\'es une des meilleures personnes que je connaisse.", body: `019. "Joyeuse fête. No cap t'es une des meilleures personnes que je connaisse."
Pas parfaite. Pas sans zones à améliorer. Mais dans le fond. Dans les valeurs. Dans la façon d'être aux autres. Dans ce qui t'anime vraiment. T'es quelqu'un de bien. Profondément. Et à notre âge le croiser c'est pas si courant. Joyeuse fête, [Prénom].
Avec affirmation directe et sans détour de ce que je pense vraiment,
— ton ami qui le pense depuis longtemps et qui le dit enfin clairement 🫶` },
            { id: "n25_s5_020", angle: "Joyeuse fête. No cap je suis fier de ce que t\'es devenu.", body: `020. "Joyeuse fête. No cap je suis fier de ce que t'es devenu."
Fier dans le sens ami. Dans le sens j'ai vu d'où tu viens. J'ai vu ce que t'as traversé. Et je vois où t'en es. Et ce chemin-là mérite d'être reconnu. Pas juste par toi. Par les gens qui étaient là et qui ont suivi. Moi j'étais là. J'ai suivi. Je suis fier. Joyeuse fête, [Prénom].
Avec fierté d'ami sincère et sans condescendance,
— ton ami pour toute la suite du chemin ❤️` },
          ],
        },
        {
          id: 'move',
          label: "C'est pas le move mais on t'aime",
          emoji: '💛',
          messages: [
            { id: "n25_s6_001", angle: "Joyeuse fête. T\'as fait des choix cette année qui étaient clairement pas le move.", body: `001. "Joyeuse fête. T'as fait des choix cette année qui étaient clairement pas le move."
Je dis pas lesquels. Tu sais lesquels. Y'a eu ce truc. Et probablement cet autre truc. Et peut-être ce troisième qu'on a pas encore débriefé. Sur le moment t'étais convaincu. Après t'as vu. On a commenté ou pas selon les cas. Mais tu sais. Et on t'aime quand même. Joyeuse fête, [Prénom].
Avec inventaire discret des moves discutables sans les nommer pour préserver ta dignité,
— ton ami qui connaît la liste et qui t'aime avec elle 🙈` },
            { id: "n25_s6_002", angle: "T\'as une façon de te mettre dans des situations que personne d\'autre n\'aurait créées.", body: `002. "T'as une façon de te mettre dans des situations que personne d'autre n'aurait créées."
Des situations qui existaient pas avant que tu arrives. Qui sont apparues parce que t'as dit quelque chose. Fait quelque chose. Décidé quelque chose. Et maintenant la situation existe et elle demande d'être gérée. C'est ton talent particulier. Et on t'aime avec. Joyeuse fête, [Prénom].
Avec acceptation totale de ton talent à créer des situations inédites,
— ton ami pompier de certaines de ces situations qui reste disponible pour les prochaines 🚒` },
            { id: "n25_s6_003", angle: "Joyeuse fête. Tu textes pas comme quelqu\'un qui a réfléchi avant d\'envoyer.", body: `003. "Joyeuse fête. Tu textes pas comme quelqu'un qui a réfléchi avant d'envoyer."
Y'a des messages. Des messages précis. Envoyés dans des contextes précis. À des moments précis. Où la sagesse aurait été de poser le téléphone. T'as pas posé le téléphone. T'as envoyé. Et après. Après on a géré ensemble les conséquences du message. Joyeuse fête, [Prénom].
Avec mémoire intacte de plusieurs messages envoyés avant la réflexion complète,
— ton ami gestionnaire des conséquences de tes envois impulsifs depuis trop longtemps 📱` },
            { id: "n25_s6_004", angle: "On t\'avait dit que c\'était pas le move. T\'as fait quand même. C\'était pas le move.", body: `004. "On t'avait dit que c'était pas le move. T'as fait quand même. C'était pas le move."
Le cycle complet. L'avertissement collectif ou individuel. Ta considération apparente de l'avertissement. Ta décision souveraine d'ignorer l'avertissement. L'exécution du move. Les conséquences. Le débrief. Ce cycle on le connaît. On t'aime dedans. Joyeuse fête, [Prénom].
Avec résignation affectueuse devant le cycle et son caractère répétitif,
— ton ami disponible pour le prochain débrief comme pour tous les précédents 🔄` },
            { id: "n25_s6_005", angle: "Joyeuse fête. Ta confiance en ton propre jugement est admirable et parfois catastrophique.", body: `005. "Joyeuse fête. Ta confiance en ton propre jugement est admirable et parfois catastrophique."
Les deux en même temps. Cette conviction que ton analyse est bonne. Que ton plan va marcher. Que cette fois c'est différent. C'est une qualité qui te fait avancer. C'est aussi une qualité qui te fait parfois foncer dans des murs que les autres voient venir. On t'aime avec ta conviction et ses murs. Joyeuse fête, [Prénom].
Avec amour pour toi ta conviction et tes murs occasionnels,
— ton ami qui a essayé de signaler plusieurs de ces murs et qui continue quand même 🧱` },
            { id: "n25_s6_006", angle: "T\'as un rapport à l\'escalade émotionnelle qui est vraiment particulier.", body: `006. "T'as un rapport à l'escalade émotionnelle qui est vraiment particulier."
Des situations qui auraient pu rester petites. Qui ont grandi. Qui ont pris de l'ampleur. Pas toujours par malveillance. Par intensité. Par ta façon d'être pleinement dans les trucs. Cette intensité c'est ce qui te rend vivant. C'est aussi ce qui escalade parfois. On t'aime dans l'escalade. Joyeuse fête, [Prénom].
Avec amour pour ton intensité qui est à la fois ta force et ta source d'escalades occasionnelles,
— ton ami de désescalade depuis le début et pour la suite 🎢` },
            { id: "n25_s6_007", angle: "Joyeuse fête. T\'as dit des vérités au mauvais moment dans le mauvais contexte.", body: `007. "Joyeuse fête. T'as dit des vérités au mauvais moment dans le mauvais contexte."
La vérité c'est bien. Vraiment. Mais la vérité dite à 23h dans un groupe en plein milieu d'autre chose c'est pas toujours le move même si la vérité est vraie. Le contenu était juste. Le timing et le contexte étaient discutables. T'es encore en apprentissage sur cette combinaison. On t'aime quand même. Joyeuse fête, [Prénom].
Avec distinction entre la qualité du contenu et la qualité du timing et du contexte,
— ton ami qui attend avec optimisme ta maîtrise future de cette combinaison 📅` },
            { id: "n25_s6_008", angle: "T\'as une façon de surestimer ce que les gens peuvent gérer comme information.", body: `008. "T'as une façon de surestimer ce que les gens peuvent gérer comme information."
T'as dit des trucs. À des gens. Des trucs vrais. Mais des trucs que ces gens-là étaient pas prêts à recevoir dans ce format à ce moment-là. Ton honnêteté est une qualité. Son calibrage est encore en cours d'ajustement. On t'aime dans le calibrage. Joyeuse fête, [Prénom].
Avec amour pour ton honnêteté brute et confiance dans le calibrage en cours,
— ton ami qui a parfois reçu des informations non calibrées et qui a survécu 🎛️` },
            { id: "n25_s6_009", angle: "Joyeuse fête. T\'as pris des décisions importantes dans des états émotionnels suboptimaux.", body: `009. "Joyeuse fête. T'as pris des décisions importantes dans des états émotionnels suboptimaux."
Ce mail envoyé. Ce message laissé. Cette décision prise. À un moment précis. Dans un état précis. Qui n'était pas l'état idéal pour décider. On t'avait peut-être dit d'attendre. T'as pas attendu. Les conséquences ont été variables. On t'aime quand même. Joyeuse fête, [Prénom].
Avec bienveillance pour tes décisions prises dans des états suboptimaux et leurs conséquences,
— ton ami qui t'a parfois dit d'attendre et qui continue de le dire pour les prochaines fois ⏸️` },
            { id: "n25_s6_010", angle: "T\'as un talent pour rendre les trucs simples compliqués.", body: `010. "T'as un talent pour rendre les trucs simples compliqués."
Un truc qui demandait deux étapes en est devenu six. Une situation qui était réglée s'est rouverte. Un truc simple a été analysé jusqu'à devenir un problème. C'est ton cerveau. Il cherche la complexité là où elle était pas. C'est parfois brillant. C'est parfois pas le move. On t'aime avec ton cerveau. Joyeuse fête, [Prénom].
Avec amour pour ton cerveau complexifiant et tout ce qu'il produit de bien et de moins bien,
— ton ami simplificateur à tes côtés pour rééquilibrer depuis le début 🧩` },
            { id: "n25_s6_011", angle: "Joyeuse fête. T\'as une vision romantique de certaines situations qui te joue des tours.", body: `011. "Joyeuse fête. T'as une vision romantique de certaines situations qui te joue des tours."
T'as vu les trucs comme tu voulais qu'ils soient. Pas comme ils étaient. Et t'as agi en conséquence. Et la réalité a été différente de la vision. Et t'as été surpris. Plusieurs fois. Cette façon de voir le meilleur scénario en premier c'est touchant et parfois pas le move. On t'aime dedans. Joyeuse fête, [Prénom].
Avec tendresse pour ta vision romantique du monde et ses conséquences occasionnelles,
— ton ami réaliste qui compense ta vision romantique depuis qu'on se connaît 🌹` },
            { id: "n25_s6_012", angle: "T\'assumes tes moves discutables avec une désinvolture que j\'admire franchement.", body: `012. "T'assumes tes moves discutables avec une désinvolture que j'admire franchement."
T'as fait le truc. T'as vu que c'était pas le move. Et t'as dit ouais bon. Avec cet air. Cet air précis de quelqu'un qui assume sans se flageller. Ni trop d'excuses ni trop d'indifférence. Juste ouais bon. C'est une posture que peu de gens maîtrisent. Joyeuse fête, [Prénom].
Avec admiration sincère pour ta désinvolture assumante qui est en fait une forme de sagesse,
— ton ami qui essaie d'apprendre cette désinvolture et qui n'y est pas encore 🤷` },
            { id: "n25_s6_013", angle: "Joyeuse fête. T\'as des angles morts sur toi-même qui produisent des moves intéressants.", body: `013. "Joyeuse fête. T'as des angles morts sur toi-même qui produisent des moves intéressants."
Ces trucs que tu vois pas sur toi. Ces patterns que les autres voient et que toi tu vois moins. Ils produisent des situations. Des moves. Des moments où tout le monde autour comprend ce qui se passe sauf toi. C'est humain. C'est toi en particulier. On t'aime avec tes angles morts. Joyeuse fête, [Prénom].
Avec amour pour toi et tes angles morts qui font partie du package,
— ton ami miroir disponible quand tu veux réduire la surface des angles morts 🪞` },
            { id: "n25_s6_014", angle: "T\'as répondu à des trucs qui méritaient pas de réponse.", body: `014. "T'as répondu à des trucs qui méritaient pas de réponse."
Des provocations. Des trucs qui demandaient juste d'être ignorés. Et toi t'as répondu. Avec conviction. Avec énergie. T'as mis de l'investissement dans des trucs qui méritaient zéro investissement. L'énergie était bien. La cible était pas le move. On t'aime quand même. Joyeuse fête, [Prénom].
Avec respect pour ton énergie et suggestion amicale sur ses prochaines cibles,
— ton ami filtre qui essaie d'intercepter les réponses aux trucs qui méritent pas 🚦` },
            { id: "n25_s6_015", angle: "Joyeuse fête. T\'as une façon de t\'expliquer qui dure parfois trop longtemps.", body: `015. "Joyeuse fête. T'as une façon de t'expliquer qui dure parfois trop longtemps."
T'as raison sur le fond. T'as de bons arguments. Et t'as tendance à les présenter. Tous. Dans l'ordre. Avec les nuances. Et les contre-arguments que t'as anticipés. Et les réponses à ces contre-arguments. À un moment le point était fait. T'as continué quand même. On t'aime dans la longueur. Joyeuse fête, [Prénom].
Avec amour pour tes explications complètes et suggestion douce de les calibrer parfois,
— ton ami qui t'écoute jusqu'au bout et qui le fera toujours 👂` },
            { id: "n25_s6_016", angle: "No cap t\'as fait un move cette année dont on parlera longtemps.", body: `016. "No cap t'as fait un move cette année dont on parlera longtemps."
Dans le groupe. Entre nous. Ce truc précis. Cette décision. Cette action. Qui est devenue une référence. Un étalon. Une histoire qu'on raconte. Affectueusement. Avec le recul que le temps donne. T'as contribué au patrimoine collectif. Joyeuse fête, [Prénom].
Avec intégration officielle de ce move dans le patrimoine durable du groupe,
— ton ami conservateur de ce patrimoine avec affection et sans jugement 🏛️` },
            { id: "n25_s6_017", angle: "Joyeuse fête. T\'as une façon d\'ignorer les signaux d\'alarme qui est fascinante.", body: `017. "Joyeuse fête. T'as une façon d'ignorer les signaux d'alarme qui est fascinante."
Les signaux étaient là. Visibles. Audibles parfois. Et toi t'as avancé quand même. Pas par bêtise. Par conviction que cette fois c'était différent. Ou par cette énergie qui t'empêche de t'arrêter quand t'es lancé. Cette façon d'ignorer les alarmes c'est parfois courageux et souvent pas le move. On t'aime dans les deux cas. Joyeuse fête, [Prénom].
Avec amour pour ton courage et ta surdité occasionnelle aux alarmes,
— ton ami alarme humaine toujours disponible pour les prochaines fois 🚨` },
            { id: "n25_s6_018", angle: "T\'as overcommité sur des trucs et tu t\'en es rendu compte après.", body: `018. "T'as overcommité sur des trucs et tu t'en es rendu compte après."
T'as dit oui. À plusieurs trucs. En même temps. Avec la meilleure intention. Et après la réalité de tout ces oui s'est présentée en même temps. Et t'as géré. Pas toujours parfaitement. Mais t'as géré. Et t'as probablement recommencé depuis. On t'aime dans l'overcommit. Joyeuse fête, [Prénom].
Avec amour pour ton enthousiasme commitant et tes gestions d'overcommit qui s'améliorent,
— ton ami qui t'aide parfois à faire l'inventaire de tes oui avant que tu les envoies 📊` },
            { id: "n25_s6_019", angle: "Joyeuse fête. C\'est pas toujours le move. Et t\'es quand même une des meilleures personnes que je connaisse.", body: `019. "Joyeuse fête. C'est pas toujours le move. Et t'es quand même une des meilleures personnes que je connaisse."
Les deux ensemble. Sans contradiction. Les moves discutables coexistent parfaitement avec le fait d'être quelqu'un de bien. L'un n'annule pas l'autre. T'as des zones à améliorer. Et t'es fondamentalement quelqu'un de bien. Ces deux vérités sont vraies en même temps. Joyeuse fête, [Prénom].
Avec clarté sur la coexistence parfaite de tes moves discutables et de ta valeur fondamentale,
— ton ami qui tient les deux vérités en même temps sans problème 🫶` },
            { id: "n25_s6_020", angle: "Joyeuse fête. C\'est pas le move mais on t\'aime. No cap. Pour de vrai. Sans conditions.", body: `020. "Joyeuse fête. C'est pas le move mais on t'aime. No cap. Pour de vrai. Sans conditions."
Les moves discutables. Les angles morts. Les escalades. Les messages envoyés trop vite. Les situations créées. Tout ça fait partie de toi. Et toi on t'aime. Pas malgré tout ça. Avec tout ça. Parce que tout ça c'est toi. Et toi t'es quelqu'un qu'on choisit. Joyeuse fête, [Prénom].
Avec déclaration finale complète sans réserve et sans conditions,
— ton ami pour les bons moves les mauvais et tout ce qui est entre les deux maintenant et pour toujours ❤️` },
          ],
        },
      ],
    },
  ],
};


// ── Diplôme / Bac / Brevet (13-17 ans) ──────────────────────────────────────
// ── Premier job / Stage (18-25 ans) ─────────────────────────────────────────

export const YOUTH_GRADUATION_LIBRARY: YouthAgeGroup[] = [
  {
    id: 'ado',
    label: '13-17 ans',
    minAge: 13,
    maxAge: 17,
    subCategories: [
        {
          id: 'tu_las_eu',
          label: "Tu l'as eu et on savait que t'allais l'avoir",
          emoji: '🎓',
          messages: [
            { id: "gr13_s1_001", angle: "Tu l\'as eu. Comme on savait que t\'allais l\'avoir.", body: `001. "Tu l'as eu. Comme on savait que t'allais l'avoir."
Y'a des résultats qui surprennent. Le tien c'était pas une surprise. C'était une confirmation. La confirmation de ce que tout le monde autour de toi savait déjà. Que t'étais capable. Que t'allais y arriver. Que ce bout de papier allait finir par porter ton nom. Il le porte. Félicitations, [Prénom].
Avec satisfaction d'avoir eu raison depuis le début,
— quelqu'un qui n'a jamais douté et qui le prouve rétrospectivement 📄` },
            { id: "gr13_s1_002", angle: "Félicitations. On t\'attendait de l\'autre côté.", body: `002. "Félicitations. On t'attendait de l'autre côté."
On savait que t'allais traverser. La question c'était pas si. C'était quand. Et le quand c'est maintenant. Et de l'autre côté y'a nous qui attendions avec cette certitude tranquille que t'allais arriver. T'es arrivé. Félicitations, [Prénom].
Avec accueil chaleureux de l'autre côté de l'épreuve,
— quelqu'un qui attendait tranquillement parce qu'il savait 🚪` },
            { id: "gr13_s1_003", angle: "T\'as eu ton diplôme. Le jury a officialisé ce qu\'on savait déjà.", body: `003. "T'as eu ton diplôme. Le jury a officialisé ce qu'on savait déjà."
Le jury a délibéré. Le jury a statué. Le jury a rendu un verdict. Ce verdict c'est ce que les gens autour de toi savaient depuis un moment. Le jury a juste mis le tampon officiel sur quelque chose qui était déjà évident. Félicitations, [Prénom], tu méritais ce tampon.
Avec respect poli pour le jury qui a fini par rejoindre notre consensus,
— quelqu'un qui était arrivé à cette conclusion bien avant la délibération 🔏` },
            { id: "gr13_s1_004", angle: "Ce résultat c\'est toi. Pas la chance. Pas le hasard. Toi.", body: `004. "Ce résultat c'est toi. Pas la chance. Pas le hasard. Toi."
Y'a des gens qui attribuent leurs réussites à des facteurs extérieurs. Le sujet tombé au bon moment. L'examinateur sympa. La chance. Ton résultat c'est ton travail. Tes efforts. Ta tête. Assume-le entièrement. T'as le droit. Félicitations, [Prénom].
Avec insistance pour que tu assumes complètement ce qui t'appartient complètement,
— quelqu'un qui refuse que tu minimises ce que t'as accompli 🎯` },
            { id: "gr13_s1_005", angle: "Félicitations. T\'as prouvé quelque chose à tout le monde. Surtout à toi.", body: `005. "Félicitations. T'as prouvé quelque chose à tout le monde. Surtout à toi."
Aux autres d'abord peut-être. À ceux qui doutaient. À ceux qui regardaient. Mais surtout à toi. Cette preuve que t'es capable. Que le travail paie. Que tu peux aller au bout. Cette preuve-là elle t'appartient. Personne peut te l'enlever. Félicitations, [Prénom].
Avec insistance sur la preuve à soi-même comme la plus importante de toutes,
— quelqu'un qui sait que c'est celle-là qui compte le plus sur le long terme 💡` },
            { id: "gr13_s1_006", angle: "T\'as bossé. Ça s\'est vu. Ça a payé.", body: `006. "T'as bossé. Ça s'est vu. Ça a payé."
Équation simple. Travail en entrée. Résultat en sortie. T'as mis ce qu'il fallait. T'as eu ce qu'il fallait. C'est pas toujours aussi simple que ça dans la vie. Profite du moment où l'équation a fonctionné exactement comme elle était censée fonctionner. Félicitations, [Prénom].
Avec satisfaction de voir l'équation fonctionner comme prévu,
— quelqu'un qui a observé le travail en entrée et qui confirme la logique du résultat ➕` },
            { id: "gr13_s1_007", angle: "Félicitations. T\'as eu ton diplôme et t\'as l\'air surpris. Tu devrais pas.", body: `007. "Félicitations. T'as eu ton diplôme et t'as l'air surpris. Tu devrais pas."
Cette tête que t'as faite en voyant le résultat. Cette surprise. Ce soulagement qui ressemblait presque à de l'incrédulité. T'aurais dû savoir. On savait tous. T'étais le dernier informé de ce que t'étais capable de faire. Félicitations, [Prénom], bienvenue dans ce que les autres savaient déjà.
Avec légère exaspération affectueuse devant ta surprise non justifiée,
— quelqu'un qui aurait aimé que tu sois aussi confiant que nous l'étions 🙄` },
            { id: "gr13_s1_008", angle: "T\'as traversé les révisions. Les partiels. Le stress. Et t\'es là.", body: `008. "T'as traversé les révisions. Les partiels. Le stress. Et t'es là."
Étape par étape. Chaque révision. Chaque moment de doute. Chaque matin où t'avais pas envie. Chaque soir où t'as continué quand même. Tout ça a produit ce résultat. Chaque petit effort compte dans le total. Et ton total est bon. Félicitations, [Prénom].
Avec décompte respectueux de tous les petits efforts qui ont produit le grand résultat,
— quelqu'un qui sait que les grandes réussites sont faites de petits matins difficiles 🌅` },
            { id: "gr13_s1_009", angle: "Félicitations. Ce diplôme c\'est le premier d\'une longue série.", body: `009. "Félicitations. Ce diplôme c'est le premier d'une longue série."
Le premier bout de papier officiel qui dit que t'as réussi quelque chose. Il y en aura d'autres. De formes différentes. Pas tous des diplômes. Mais des preuves que t'avances. Que t'apprends. Que t'arrives au bout des trucs que tu commences. Celui-là c'est le premier. Félicitations, [Prénom].
Avec perspective sur tous les prochains bouts de papier qui vont suivre celui-là,
— quelqu'un qui prédit avec confiance la suite de ta collection 📚` },
            { id: "gr13_s1_010", angle: "T\'as eu ton diplôme. La prochaine étape t\'attend. Et t\'es prêt.", body: `010. "T'as eu ton diplôme. La prochaine étape t'attend. Et t'es prêt."
Ce diplôme c'est une porte qui se ferme et une autre qui s'ouvre. La porte qui s'ouvre est plus grande. Moins balisée. Plus intimidante peut-être. Et toi t'es prêt pour elle. Pas parce que t'as tout les réponses. Parce que t'as prouvé que tu peux traverser les trucs. Félicitations, [Prénom].
Avec confiance dans ta capacité à traverser ce qui vient aussi,
— quelqu'un qui te regarde avancer vers la prochaine porte sans inquiétude 🚀` },
            { id: "gr13_s1_011", angle: "Félicitations. T\'as fait ce que t\'avais à faire.", body: `011. "Félicitations. T'as fait ce que t'avais à faire."
Simple. Direct. Sans fioritures. Y'avait un truc à faire. T'as fait le truc. Le truc est fait. Le résultat est là. Cette capacité à faire ce qu'il y a à faire même quand t'as pas envie même quand c'est difficile même quand t'aurais préféré autre chose. C'est ça qui compte. Félicitations, [Prénom].
Avec éloge de ta capacité basique et fondamentale à faire ce qu'il y a à faire,
— quelqu'un qui sait que c'est cette capacité-là qui fera toute ta vie 🔧` },
            { id: "gr13_s1_012", angle: "On savait. Toi tu savais aussi au fond. Le diplôme a juste confirmé.", body: `012. "On savait. Toi tu savais aussi au fond. Le diplôme a juste confirmé."
Quelque part dans ta tête il y avait cette certitude. Même noyée sous le stress. Même cachée sous les doutes. Elle était là. Cette petite voix qui disait que t'allais y arriver. Le diplôme a donné raison à cette voix. Écoute-la plus souvent. Félicitations, [Prénom].
Avec invitation à faire confiance à cette petite voix plus souvent à l'avenir,
— quelqu'un qui espère que tu l'écouteras pour la prochaine étape aussi 🎙️` },
            { id: "gr13_s1_013", angle: "Félicitations. T\'as réussi et maintenant t\'as le droit de souffler.", body: `013. "Félicitations. T'as réussi et maintenant t'as le droit de souffler."
Le stress des révisions. L'anxiété des examens. L'attente des résultats. Tout ça c'est derrière. T'as le droit de poser tout ça. De souffler vraiment. De profiter du résultat sans déjà penser à la suite. Juste un moment. Juste pour toi. Félicitations, [Prénom].
Avec permission officielle de souffler avant de penser à la suite,
— quelqu'un qui t'autorise à profiter sans culpabilité 😮‍💨` },
            { id: "gr13_s1_014", angle: "T\'as eu ton diplôme sans trop d\'histoires. C\'est classe.", body: `014. "T'as eu ton diplôme sans trop d'histoires. C'est classe."
Y'a des gens pour qui c'est un drame. Un suspense insoutenable. Une saga en plusieurs actes. Toi t'as fait le truc. T'as eu le truc. Sans trop d'histoires. Cette efficacité tranquille c'est une façon d'être qui va te servir toute ta vie. Félicitations, [Prénom].
Avec éloge de ton efficacité tranquille qui ne fait pas de bruit,
— quelqu'un qui apprécie les réussites sans drama à leur juste valeur 😎` },
            { id: "gr13_s1_015", angle: "Félicitations. Maintenant tout le monde peut arrêter de te demander comment ça se passe.", body: `015. "Félicitations. Maintenant tout le monde peut arrêter de te demander comment ça se passe."
Les questions. Les t'as bien révisé. Les tu te sens comment. Les t'as l'impression que ça s'est bien passé. Toutes ces questions auxquelles tu pouvais pas encore répondre avec certitude. Maintenant t'as la réponse définitive. Ça s'est bien passé. Félicitations, [Prénom].
Avec soulagement partagé que les questions anxieuses puissent enfin s'arrêter,
— quelqu'un qui promet de ne plus jamais te demander comment ça se passe 🤐` },
            { id: "gr13_s1_016", angle: "T\'as travaillé. T\'as réussi. C\'est dans l\'ordre des choses.", body: `016. "T'as travaillé. T'as réussi. C'est dans l'ordre des choses."
Pas de miracle. Pas de magie. Pas de coup de chance extraordinaire. Juste la logique simple du travail qui produit des résultats. T'as mis du travail. T'as eu des résultats. C'est dans l'ordre des choses. Et dans cet ordre-là t'as ta place. Félicitations, [Prénom].
Avec constat serein que ton résultat est exactement dans l'ordre logique des choses,
— quelqu'un qui trouve que cet ordre des choses te va très bien 📐` },
            { id: "gr13_s1_017", angle: "Félicitations. T\'as eu ton diplôme et maintenant t\'es officiellement quelqu\'un qui a eu son diplôme.", body: `017. "Félicitations. T'as eu ton diplôme et maintenant t'es officiellement quelqu'un qui a eu son diplôme."
C'est un statut. Permanent. Irrévocable. Personne peut te l'enlever. Même dans vingt ans quand tu seras ailleurs et autre chose tu seras encore quelqu'un qui a eu son diplôme. Ce truc-là c'est pour toujours. Félicitations, [Prénom].
Avec solennité légèrement excessive mais sincère sur le caractère permanent de ce statut,
— quelqu'un qui trouve que certains statuts méritent d'être soulignés 🏛️` },
            { id: "gr13_s1_018", angle: "On t\'a vu bosser. On t\'a vu douter. On t\'a vu continuer quand même.", body: `018. "On t'a vu bosser. On t'a vu douter. On t'a vu continuer quand même."
Le processus entier. Pas juste le résultat. Les révisions difficiles. Les moments de découragement. Les soirs où t'aurais préféré autre chose. Et le lendemain matin où t'as repris quand même. Ce parcours-là mérite autant de reconnaissance que le résultat. Félicitations, [Prénom].
Avec reconnaissance pour le parcours entier pas juste pour la ligne d'arrivée,
— quelqu'un qui a observé chaque étape et qui salue l'ensemble 👀` },
            { id: "gr13_s1_019", angle: "Félicitations. T\'as eu ton diplôme. Maintenant la vraie vie commence.", body: `019. "Félicitations. T'as eu ton diplôme. Maintenant la vraie vie commence."
Pas pour faire peur. Pour dire que t'es prêt. Ce diplôme c'est la preuve que t'as ce qu'il faut pour commencer. Pas tout. Personne a tout au début. Mais assez. Assez pour se lancer. Assez pour apprendre en avançant. La vraie vie commence et t'es équipé. Félicitations, [Prénom].
Avec enthousiasme sincère pour ce qui commence maintenant,
— quelqu'un qui est convaincu que t'as ce qu'il faut pour la suite 🌅` },
            { id: "gr13_s1_020", angle: "T\'as eu ton diplôme. On le savait. Tu le méritais. Point.", body: `020. "T'as eu ton diplôme. On le savait. Tu le méritais. Point."
Pas besoin d'en dire plus. T'as travaillé. T'as réussi. Tu méritais ce résultat. Ces trois phrases sont vraies. Elles sont complètes. Elles résument tout. Le reste c'est du bonus. Félicitations, [Prénom], point.
Avec économie de mots assumée parce que parfois trois phrases suffisent,
— quelqu'un qui sait quand s'arrêter et qui s'arrête là ✅` },
          ],
        },
        {
          id: 'galere',
          label: "T'as galéré mais t'as tenu",
          emoji: '💪',
          messages: [
            { id: "gr13_s2_001", angle: "Félicitations. T\'as galéré et t\'as tenu quand même.", body: `001. "Félicitations. T'as galéré et t'as tenu quand même."
C'était pas facile. Pas linéaire. Pas ce qu'on appelle un parcours sans accroc. Y'a eu des moments difficiles. Des passages compliqués. Des jours où ça avançait pas. Et t'as tenu. Pas parce que c'était simple. Malgré le fait que c'était pas simple. C'est ça qui compte. Félicitations, [Prénom].
Avec respect pour la tenue dans la difficulté qui vaut plus que la facilité sans effort,
— quelqu'un qui sait ce que ça t'a coûté et qui te félicite pour le coût autant que pour le résultat 💪` },
            { id: "gr13_s2_002", angle: "T\'as eu ton diplôme après avoir vraiment galéré. C\'est le meilleur genre de réussite.", body: `002. "T'as eu ton diplôme après avoir vraiment galéré. C'est le meilleur genre de réussite."
Les réussites faciles sont bien. Les réussites après galère sont meilleures. Parce qu'elles disent quelque chose sur toi. Sur ta capacité à tenir. À traverser. À continuer quand c'est difficile. Cette réussite-là elle a un poids que les autres ont pas. Félicitations, [Prénom].
Avec conviction que les réussites difficiles ont une valeur supérieure,
— quelqu'un qui préfère ta réussite compliquée à une réussite facile n'importe quand 🏋️` },
            { id: "gr13_s2_003", angle: "Félicitations. T\'as failli lâcher. T\'as pas lâché.", body: `003. "Félicitations. T'as failli lâcher. T'as pas lâché."
Y'a eu ce moment. Peut-être plusieurs. Où lâcher semblait plus simple. Plus raisonnable même. Et t'as pas lâché. T'as choisi de tenir encore. Et encore. Jusqu'à ce que ça passe. Et ça a passé. Et t'es là. Félicitations, [Prénom].
Avec mémoire de ces moments où t'aurais pu lâcher et tu l'as pas fait,
— quelqu'un qui sait exactement de quel moment il parle même si il le nomme pas 🔥` },
            { id: "gr13_s2_004", angle: "T\'as galéré sur des trucs qui semblaient pas galérants pour les autres.", body: `004. "T'as galéré sur des trucs qui semblaient pas galérants pour les autres."
C'est le truc le plus difficile. Voir des gens pour qui ça semble simple. Et sentir que pour toi c'est plus compliqué. Et devoir fournir plus d'efforts pour arriver au même endroit. T'as fait ces efforts supplémentaires. Sans te plaindre ou presque. Félicitations, [Prénom].
Avec reconnaissance pour les efforts supplémentaires que personne ne voyait et qui étaient bien réels,
— quelqu'un qui sait que certaines galères sont invisibles et qui les voit quand même 👁️` },
            { id: "gr13_s2_005", angle: "Félicitations. Le chemin était compliqué. L\'arrivée est la même pour tout le monde.", body: `005. "Félicitations. Le chemin était compliqué. L'arrivée est la même pour tout le monde."
Peu importe comment t'es arrivé. Par quel chemin. Avec quelles difficultés. Le diplôme est le même. La réussite est la même. L'arrivée est la même. Et toi t'y es. Avec ton chemin compliqué derrière toi et le même diplôme dans les mains que tout le monde. Félicitations, [Prénom].
Avec insistance sur l'égalité de l'arrivée peu importe la difficulté du chemin,
— quelqu'un qui trouve que ton chemin compliqué rend l'arrivée encore plus belle 🏁` },
            { id: "gr13_s2_006", angle: "T\'as galéré et t\'as continué. C\'est la définition exacte de la persévérance.", body: `006. "T'as galéré et t'as continué. C'est la définition exacte de la persévérance."
Pas une définition abstraite. Une définition vécue. Incarnée. La persévérance c'est exactement ça. Continuer quand c'est difficile. Avancer quand t'as pas envie. Tenir quand lâcher serait plus simple. T'as fait tout ça. T'es la définition. Félicitations, [Prénom].
Avec proposition de t'utiliser comme exemple vivant dans les dictionnaires,
— quelqu'un qui pense que ta définition de la persévérance est la meilleure qui soit 📖` },
            { id: "gr13_s2_007", angle: "Félicitations. T\'as eu des moments de doute. T\'as continué quand même.", body: `007. "Félicitations. T'as eu des moments de doute. T'as continué quand même."
Ces moments précis. Où tu savais pas si t'allais y arriver. Où la certitude était absente. Où t'avançais sans filet. Ces moments-là sont les plus difficiles. Et t'as continué dedans. Sans certitude. Juste avec l'élan. Félicitations, [Prénom].
Avec respect pour ta capacité à continuer même quand la certitude n'était pas là,
— quelqu'un qui trouve que continuer sans certitude est la forme de courage la plus honnête 🌫️` },
            { id: "gr13_s2_008", angle: "T\'as galéré sur la forme. T\'as assuré sur le fond.", body: `008. "T'as galéré sur la forme. T'as assuré sur le fond."
Peut-être que le processus était chaotique. Les révisions pas toujours optimales. L'organisation perfectible. Mais sur le fond. Sur ce qui comptait vraiment. T'as été là. T'as su ce qu'il fallait savoir. T'as fait ce qu'il fallait faire. Félicitations, [Prénom].
Avec distinction importante entre la forme perfectible et le fond qui a tenu,
— quelqu'un qui sait que c'est le fond qui est évalué et que le tien était bon 📐` },
            { id: "gr13_s2_009", angle: "Félicitations. T\'as eu besoin d\'aide et t\'as su la demander.", body: `009. "Félicitations. T'as eu besoin d'aide et t'as su la demander."
C'est une compétence à part entière. Reconnaître qu'on galère. Accepter qu'on a besoin d'aide. Avoir le courage de la demander. T'as fait tout ça. Et cette aide t'a permis d'arriver jusqu'ici. Demander de l'aide quand on en a besoin c'est de l'intelligence pas de la faiblesse. Félicitations, [Prénom].
Avec éloge de ta capacité à demander de l'aide comme une compétence et non une faiblesse,
— quelqu'un qui espère que tu garderas cette compétence pour toute la suite 🤝` },
            { id: "gr13_s2_010", angle: "T\'as galéré mais t\'as jamais abandonné l\'idée que t\'allais y arriver.", body: `010. "T'as galéré mais t'as jamais abandonné l'idée que t'allais y arriver."
Même dans les moments les plus difficiles. Quelque part t'avais encore l'idée que c'était possible. Que t'allais y arriver. Cette idée-là même petite même fragile t'a porté jusqu'à la fin. Garde cette idée pour tous les prochains trucs difficiles. Félicitations, [Prénom].
Avec invitation à garder cette petite idée pour tous les prochains défis,
— quelqu'un qui sait que cette idée-là sera ton meilleur outil pour la suite 💡` },
            { id: "gr13_s2_011", angle: "Félicitations. T\'as prouvé que la galère c\'est temporaire et le diplôme c\'est permanent.", body: `011. "Félicitations. T'as prouvé que la galère c'est temporaire et le diplôme c'est permanent."
La galère a une fin. Les nuits de révision ont une fin. Le stress a une fin. Le diplôme n'a pas de fin. Il reste. Il t'appartient. Pour toujours. La galère était le prix temporaire d'un résultat permanent. Et t'as payé ce prix. Et t'as ton résultat. Félicitations, [Prénom].
Avec mise en perspective entre la temporalité de la galère et la permanence du résultat,
— quelqu'un qui trouve que ce rapport qualité-prix était excellent 📊` },
            { id: "gr13_s2_012", angle: "T\'as eu des journées nulles. T\'as continué le lendemain.", body: `012. "T'as eu des journées nulles. T'as continué le lendemain."
C'est ça la vraie mesure. Pas les bonnes journées. Les lendemains des mauvaises. Ces matins où t'aurais pu décider que c'était trop. Et où t'as repris quand même. Ces lendemains-là c'est ce qui t'a amené jusqu'ici. Félicitations, [Prénom].
Avec hommage à tous tes lendemains de mauvaises journées qui ont fait toute la différence,
— quelqu'un qui sait que les champions se définissent à leurs lendemains pas à leurs bons jours 🌅` },
            { id: "gr13_s2_013", angle: "Félicitations. T\'as galéré et ça t\'a appris des trucs que la facilité aurait jamais appris.", body: `013. "Félicitations. T'as galéré et ça t'a appris des trucs que la facilité aurait jamais appris."
La galère enseigne. Pas agréablement. Mais efficacement. Elle apprend la persévérance. La gestion du stress. La résolution de problèmes. La connaissance de ses propres limites et de comment les dépasser. T'as eu un cours intensif de tout ça. Félicitations, [Prénom].
Avec perspective sur tout ce que ta galère t'a enseigné et que la facilité n'aurait pas donné,
— quelqu'un qui est convaincu que ces apprentissages valent plus que le diplôme lui-même 🎓` },
            { id: "gr13_s2_014", angle: "T\'as pas eu le parcours le plus simple. T\'as eu le tien.", body: `014. "T'as pas eu le parcours le plus simple. T'as eu le tien."
Et le tien t'a amené jusqu'ici. Avec ses détours. Ses difficultés. Ses moments compliqués. Ce parcours-là c'est le tien. Il t'appartient. Il t'a construit. Et il t'a amené à ce résultat. Pas malgré ses difficultés. Grâce à elles aussi. Félicitations, [Prénom].
Avec valorisation de ton parcours spécifique avec toutes ses spécificités,
— quelqu'un qui ne changerait rien à ton chemin parce qu'il a produit toi 🗺️` },
            { id: "gr13_s2_015", angle: "Félicitations. Les gens qui ont galéré pour réussir réussissent mieux après.", body: `015. "Félicitations. Les gens qui ont galéré pour réussir réussissent mieux après."
C'est pas une consolation. C'est une réalité. Ceux qui ont appris à traverser les difficultés sont mieux équipés pour les suivantes. T'as développé des muscles que ceux pour qui c'était facile n'ont pas. Ces muscles vont servir. Longtemps. Félicitations, [Prénom].
Avec conviction que tes muscles de la galère sont ton meilleur investissement pour la suite,
— quelqu'un qui préférerait presque avoir galéré comme toi pour avoir ces muscles 💪` },
            { id: "gr13_s2_016", angle: "T\'as galéré seul parfois. T\'aurais pas dû rester seul avec ça.", body: `016. "T'as galéré seul parfois. T'aurais pas dû rester seul avec ça."
Y'a des moments où t'aurais pu partager la difficulté. Demander. Dire que c'était dur. T'as peut-être pas toujours osé. Pour la prochaine fois sache que la galère partagée est moins lourde. Et que les gens autour de toi auraient voulu être là. Félicitations quand même, [Prénom].
Avec message doux pour la prochaine fois sur le partage des galères,
— quelqu'un qui aurait voulu être là pendant et qui promet d'être plus disponible la prochaine fois 🫂` },
            { id: "gr13_s2_017", angle: "Félicitations. T\'as tenu sur la longueur. C\'est le truc le plus difficile.", body: `017. "Félicitations. T'as tenu sur la longueur. C'est le truc le plus difficile."
Les sprints tout le monde peut les faire. La durée c'est autre chose. Tenir sur des semaines. Des mois. Avec l'énergie qui fluctue. La motivation qui monte et descend. L'ennui parfois. La fatigue souvent. T'as tenu sur la longueur. C'est le truc le plus difficile et le plus précieux. Félicitations, [Prénom].
Avec éloge particulier de ta tenue sur la longueur comme compétence rare et précieuse,
— quelqu'un qui sait que cette compétence-là va te servir toute ta vie 🏃` },
            { id: "gr13_s2_018", angle: "T\'as galéré mais t\'es resté toi.", body: `018. "T'as galéré mais t'es resté toi."
T'as pas changé de personnalité sous la pression. T'as pas explosé sur tout le monde enfin pas trop. T'as pas renoncé à ce qui te définit pour réussir. T'as traversé la difficulté en restant toi. C'est un équilibre difficile à tenir. T'as tenu. Félicitations, [Prénom].
Avec reconnaissance pour ta capacité à rester toi sous la pression de la difficulté,
— quelqu'un qui a retrouvé le même toi de l'autre côté et qui en est soulagé 🌿` },
            { id: "gr13_s2_019", angle: "Félicitations. La galère c\'est fini. Le diplôme c\'est pour toujours.", body: `019. "Félicitations. La galère c'est fini. Le diplôme c'est pour toujours."
Archive. Classe. Ferme. La galère va dans la case passé. Le diplôme va dans la case acquis permanent. Ce classement est définitif. La galère n'a plus de prise. Le diplôme ne disparaît pas. C'est le bon bilan. Félicitations, [Prénom].
Avec classement définitif et satisfaisant des éléments dans leurs cases respectives,
— quelqu'un qui t'invite à faire ce classement toi-même et à t'y tenir 🗂️` },
            { id: "gr13_s2_020", angle: "T\'as galéré. T\'as tenu. T\'as réussi. Ces trois phrases résument quelqu\'un d\'exceptionnel.", body: `020. "T'as galéré. T'as tenu. T'as réussi. Ces trois phrases résument quelqu'un d'exceptionnel."
Pas quelqu'un de parfait. Quelqu'un d'exceptionnel. Quelqu'un qui galère et qui tient quand même. Qui fait face à la difficulté et qui continue. Qui arrive au bout des trucs difficiles. Ces trois phrases c'est toi. Garde-les. Elles te décrivent mieux que n'importe quel diplôme. Félicitations, [Prénom].
Avec portrait en trois phrases qui dit plus sur toi que n'importe quel bulletin,
— quelqu'un qui espère que tu garderas ces trois phrases pour les moments de doute à venir ❤️` },
          ],
        },
        {
          id: 'no_cap',
          label: "No cap t'as assuré",
          emoji: '⭐',
          messages: [
            { id: "gr13_s3_001", angle: "No cap t\'as assuré sur toute la ligne.", body: `001. "No cap t'as assuré sur toute la ligne."
Pas juste le jour J. Sur toute la ligne. Les révisions. L'organisation. La gestion du stress. Le jour de l'examen. L'attente des résultats. Chaque étape t'as été là. Chaque étape t'as fait ce qu'il fallait. Le résultat c'est la somme de toutes ces étapes. Et toutes ces étapes étaient bonnes. Félicitations, [Prénom].
Avec bilan positif sur l'ensemble du parcours pas juste sur la ligne d'arrivée,
— quelqu'un qui a observé chaque étape et qui confirme que toutes étaient au niveau 📊` },
            { id: "gr13_s3_002", angle: "T\'as assuré et ça surprend personne qui te connaît.", body: `002. "T'as assuré et ça surprend personne qui te connaît."
Les gens qui te connaissent savaient. Ils savaient que quand tu te mets sur quelque chose tu vas au bout. Que quand c'est important pour toi tu donnes ce qu'il faut. Ce diplôme c'est une confirmation de ce que ceux qui te connaissent savent déjà sur toi. Félicitations, [Prénom].
Avec constat que ton résultat était prévisible pour tous ceux qui te connaissent vraiment,
— quelqu'un qui était dans l'équipe des pas surpris depuis le début 🎯` },
            { id: "gr13_s3_003", angle: "Félicitations. No cap t\'as géré le stress mieux que la plupart.", body: `003. "Félicitations. No cap t'as géré le stress mieux que la plupart."
Le stress des examens c'est un truc à part. Certains s'effondrent dedans. Certains le paralysent. Toi t'as trouvé un moyen de le gérer. De continuer à fonctionner malgré lui. De le mettre à ta place. C'est une compétence que beaucoup n'ont pas encore à ton âge. Félicitations, [Prénom].
Avec admiration pour ta gestion du stress comme compétence distincte du contenu,
— quelqu'un qui sait que gérer le stress c'est la moitié de la bataille 🧘` },
            { id: "gr13_s3_004", angle: "T\'as assuré dans ta préparation. Ça se voit dans ton résultat.", body: `004. "T'as assuré dans ta préparation. Ça se voit dans ton résultat."
La préparation c'est invisible. Personne la voit. Personne applaudit les heures de révision. Les fiches. Les exercices. Le travail silencieux. Mais il produit quelque chose de visible. Ton résultat. Et ton résultat dit que ta préparation était sérieuse. Félicitations, [Prénom].
Avec reconnaissance pour tout le travail invisible qui a produit le résultat visible,
— quelqu'un qui sait lire les résultats et qui voit la préparation derrière le tien 📚` },
            { id: "gr13_s3_005", angle: "Félicitations. No cap t\'as été régulier et la régularité ça paie.", body: `005. "Félicitations. No cap t'as été régulier et la régularité ça paie."
Pas les coups d'éclat ponctuels. La régularité. Faire le travail chaque jour. Même les jours sans motivation. Même les jours où t'avais pas envie. Cette régularité silencieuse c'est ce qui produit les résultats durables. Et le tien est durable. Félicitations, [Prénom].
Avec éloge de ta régularité comme moteur principal de ton résultat,
— quelqu'un qui croit plus en la régularité qu'en les coups d'éclat et qui est content d'avoir raison 📅` },
            { id: "gr13_s3_006", angle: "T\'as assuré le jour J. Quand ça comptait vraiment.", body: `006. "T'as assuré le jour J. Quand ça comptait vraiment."
T'aurais pu craquer sous la pression. T'aurais pu ne pas être au niveau le jour précis où il fallait être au niveau. T'as été là. T'as livré ce que t'avais préparé. Dans les conditions de l'examen avec tout ce que ça implique. C'est pas rien. Félicitations, [Prénom].
Avec respect particulier pour ta performance le jour où la performance comptait vraiment,
— quelqu'un qui sait que performer sous pression est une compétence à part entière 🎯` },
            { id: "gr13_s3_007", angle: "Félicitations. T\'as assuré et t\'as rendu les gens qui croyaient en toi fiers.", body: `007. "Félicitations. T'as assuré et t'as rendu les gens qui croyaient en toi fiers."
Ces gens qui misaient sur toi. Qui savaient. Qui attendaient ce résultat avec confiance. T'as confirmé leur confiance. T'as donné raison à leur pari. Et les rendre fiers tout en te rendant fier toi-même c'est la meilleure combinaison possible. Félicitations, [Prénom].
Avec satisfaction d'être dans l'équipe de ceux dont tu as confirmé la confiance,
— quelqu'un qui misait sur toi et qui encaisse sa victoire avec plaisir 🏆` },
            { id: "gr13_s3_008", angle: "No cap ton niveau le jour de l\'exam était exactement ce qu\'il fallait.", body: `008. "No cap ton niveau le jour de l'exam était exactement ce qu'il fallait."
Ni trop ni pas assez. Exactement calibré. T'as sorti ce que t'avais. T'as pas sous-performé par le stress. T'as pas survécu par la chance. T'as été à ton niveau. Et ton niveau était le bon. Félicitations, [Prénom].
Avec constat que ton calibrage le jour J était précis,
— quelqu'un qui apprécie la précision du calibrage autant que le résultat 🎛️` },
            { id: "gr13_s3_009", angle: "Félicitations. T\'as assuré sans te vanter. C\'est la meilleure façon.", body: `009. "Félicitations. T'as assuré sans te vanter. C'est la meilleure façon."
T'as fait le travail. T'as eu le résultat. Sans grandes déclarations. Sans annonces. Juste le travail et le résultat. Cette discrétion dans l'effort et dans la réussite c'est une classe que peu de gens ont. Félicitations, [Prénom], discrètement.
Avec éloge discret pour ta discrétion dans l'effort et la réussite,
— quelqu'un qui trouve que les grandes réussites silencieuses sont les plus élégantes 🤫` },
            { id: "gr13_s3_010", angle: "T\'as assuré sur un truc qui comptait vraiment pour toi.", body: `010. "T'as assuré sur un truc qui comptait vraiment pour toi."
C'est ça le plus important. Pas juste réussir un examen. Réussir quelque chose qui avait de l'importance. Pour toi. Pour ta suite. Pour ce que tu veux construire. Quand on assure sur les trucs qui comptent vraiment c'est là que la réussite a le plus de sens. Félicitations, [Prénom].
Avec mise en perspective de ton résultat dans le contexte de ce qui compte vraiment pour toi,
— quelqu'un qui sait que cette réussite-là a du sens au-delà du diplôme 🌟` },
            { id: "gr13_s3_011", angle: "Félicitations. No cap t\'as montré de quoi t\'étais capable.", body: `011. "Félicitations. No cap t'as montré de quoi t'étais capable."
À toi d'abord. Aux autres ensuite. Cette démonstration de capacité c'est précieuse. Pas pour les prouver aux autres. Pour les connaître toi-même. Pour savoir ce que tu peux faire quand tu t'y mets vraiment. Cette connaissance-là va servir longtemps. Félicitations, [Prénom].
Avec insistance sur la connaissance de ses propres capacités comme le vrai cadeau de cette réussite,
— quelqu'un qui espère que tu gardes cette connaissance précieusement 💡` },
            { id: "gr13_s3_012", angle: "T\'as assuré dans les conditions difficiles. C\'est le seul test qui compte vraiment.", body: `012. "T'as assuré dans les conditions difficiles. C'est le seul test qui compte vraiment."
Assurer quand c'est facile c'est pas un test. Assurer sous pression. Dans les conditions de l'examen. Avec le stress. Avec les enjeux. C'est le vrai test. Et t'as passé le vrai test. Félicitations, [Prénom].
Avec distinction entre les performances dans les conditions faciles et dans les conditions réelles,
— quelqu'un qui ne juge les gens que dans les conditions difficiles et qui te juge très bien 🔬` },
            { id: "gr13_s3_013", angle: "Félicitations. No cap t\'as assuré et maintenant t\'as une base solide pour la suite.", body: `013. "Félicitations. No cap t'as assuré et maintenant t'as une base solide pour la suite."
Ce diplôme c'est une fondation. Pas une destination. Une base à partir de laquelle tu construis. Et cette base elle est solide parce que t'as mis du sérieux dedans. Ce que tu construiras dessus sera aussi solide que ce que t'as mis dans cette fondation. Félicitations, [Prénom].
Avec perspective architecturale sur ce que ce diplôme représente pour la suite,
— quelqu'un qui est impatient de voir ce que tu vas construire sur cette fondation 🏗️` },
            { id: "gr13_s3_014", angle: "T\'as assuré sur la durée. C\'est plus difficile qu\'un coup d\'éclat ponctuel.", body: `014. "T'as assuré sur la durée. C'est plus difficile qu'un coup d'éclat ponctuel."
Un coup d'éclat tout le monde peut en avoir. Un bon jour. Un sujet qui tombe bien. La chance au bon moment. La durée c'est différent. Tenir sur des semaines. Maintenir le niveau. Rester dans la course. T'as fait ça. C'est plus difficile et c'est plus précieux. Félicitations, [Prénom].
Avec éloge de ta performance dans la durée comme supérieure au coup d'éclat ponctuel,
— quelqu'un qui mesure la vraie valeur à la durée et qui te met très haut 🏃` },
            { id: "gr13_s3_015", angle: "Félicitations. No cap t\'as été sérieux quand il fallait être sérieux.", body: `015. "Félicitations. No cap t'as été sérieux quand il fallait être sérieux."
Y'a un temps pour tout. Un temps pour déconner. Un temps pour être sérieux. T'as su identifier le temps pour être sérieux et t'as été sérieux à ce moment-là. Cette intelligence situationnelle c'est une compétence de vie. T'as prouvé que t'as ça. Félicitations, [Prénom].
Avec reconnaissance de ton intelligence situationnelle entre déconner et être sérieux,
— quelqu'un qui apprécie que tu saches encore faire la différence 🎭` },
            { id: "gr13_s3_016", angle: "T\'as assuré et maintenant tu peux te permettre de souffler vraiment.", body: `016. "T'as assuré et maintenant tu peux te permettre de souffler vraiment."
Le travail est fait. Le résultat est là. T'as mérité la pause. Pas une pause coupable. Une pause méritée. Totalement méritée. Prends le temps de ne rien faire. De te reposer. De profiter. T'as payé pour cette pause et elle est entièrement à toi. Félicitations, [Prénom].
Avec permission officielle et enthousiaste de souffler autant que t'en as besoin,
— quelqu'un qui te donne la pause sans condition et sans limite de temps 😮‍💨` },
            { id: "gr13_s3_017", angle: "Félicitations. No cap ton résultat reflète exactement ce que t\'as mis dedans.", body: `017. "Félicitations. No cap ton résultat reflète exactement ce que t'as mis dedans."
Ni plus ni moins. Exactement le reflet de ton investissement. Cette équité-là elle est satisfaisante. T'as mis du travail. T'as eu un bon résultat. Le miroir est fidèle. Et ce que le miroir montre est bien. Félicitations, [Prénom].
Avec satisfaction de la fidélité du miroir entre investissement et résultat,
— quelqu'un qui trouve que ce reflet te ressemble bien 🪞` },
            { id: "gr13_s3_018", angle: "T\'as assuré. Les gens qui doutaient ont tort. Ceux qui croyaient en toi ont raison.", body: `018. "T'as assuré. Les gens qui doutaient ont tort. Ceux qui croyaient en toi ont raison."
Les deux camps existent toujours. Ceux qui doutent et ceux qui croient. Ton résultat a tranché. Il a donné tort aux premiers et raison aux seconds. Et moi j'étais dans le deuxième camp depuis le début. Et j'ai raison. Félicitations, [Prénom].
Avec satisfaction d'avoir été dans le bon camp et d'être confirmé par les faits,
— quelqu'un du bon camp qui encaisse sa victoire avec beaucoup de modestie 😌` },
            { id: "gr13_s3_019", angle: "Félicitations. No cap ce résultat c\'est le début de quelque chose.", body: `019. "Félicitations. No cap ce résultat c'est le début de quelque chose."
Pas une fin. Un début. Le début de la suite. De ce que tu vas construire. De ce que tu vas devenir. Ce diplôme ouvre des portes. Pas toutes les portes. Mais des portes réelles. Et derrière ces portes y'a des trucs qui t'attendent. Félicitations, [Prénom], la suite commence.
Avec enthousiasme pour tout ce que ce résultat ouvre comme possibilités,
— quelqu'un qui est impatient de voir ce que tu vas faire de toutes ces portes ouvertes 🚀` },
            { id: "gr13_s3_020", angle: "No cap t\'as assuré. C\'est dit. C\'est acté. C\'est mérité.", body: `020. "No cap t'as assuré. C'est dit. C'est acté. C'est mérité."
Trois phrases. Trois constats. Trois vérités. T'as assuré. Ce constat est dit à voix haute par quelqu'un qui le pense vraiment. Il est acté dans les faits par ton résultat. Et il est mérité par tout ce que t'as mis dedans. Ces trois phrases sont vraies toutes les trois. Félicitations, [Prénom].
Avec acte officiel en trois phrases de ta réussite méritée,
— quelqu'un qui signe cet acte avec conviction et sans réserve ✅` },
          ],
        },
        {
          id: 'stress',
          label: "C'est pas le move d'avoir autant stressé mais on t'aime",
          emoji: '🫂',
          messages: [
            { id: "gr13_s4_001", angle: "Félicitations. T\'as réussi. Et t\'avais stressé pour rien.", body: `001. "Félicitations. T'as réussi. Et t'avais stressé pour rien."
Je dis pas ça pour t'énerver. Je dis ça parce que c'est vrai. Tout ce stress. Toute cette énergie dépensée à imaginer le pire. Tout ce temps passé à angoisser. Et le résultat est là. Bon. Comme on te le disait. Comme tu aurais pu le savoir si tu nous avais écoutés. Félicitations, [Prénom].
Avec légère satisfaction d'avoir eu raison sur le fait que tu stressais pour rien,
— quelqu'un qui avait dit que ça allait bien se passer et qui le rappelle avec douceur 😌` },
            { id: "gr13_s4_002", angle: "T\'as stressé à un niveau qui méritait pas le sujet. On t\'aime quand même.", body: `002. "T'as stressé à un niveau qui méritait pas le sujet. On t'aime quand même."
Le sujet méritait peut-être un stress de cinq sur dix. T'as fourni un stress de douze sur dix. Cette disproportion entre le niveau de stress et le niveau de danger réel c'est ton truc particulier. C'est pas le move. Et t'as réussi quand même. Félicitations, [Prénom].
Avec bienveillance pour ta disproportion stress-danger qui est ton truc et qu'on accepte,
— quelqu'un qui a survécu à ton niveau douze sur dix et qui est là pour les prochains 🎛️` },
            { id: "gr13_s4_003", angle: "Félicitations. Tu t\'es convaincu que ça allait mal se passer. Ça s\'est bien passé.", body: `003. "Félicitations. Tu t'es convaincu que ça allait mal se passer. Ça s'est bien passé."
Le scénario catastrophe que t'avais construit dans ta tête. Les détails. Les conséquences en cascade. La fin du monde version examen. Rien de tout ça ne s'est produit. Le vrai scénario était beaucoup plus simple. Et beaucoup mieux. Félicitations, [Prénom], ton cerveau avait tort.
Avec constat factuel que le scénario catastrophe ne s'est pas réalisé,
— quelqu'un qui espère que tu enregistres ça pour la prochaine fois que ton cerveau invente un scénario catastrophe 🧠` },
            { id: "gr13_s4_004", angle: "T\'as passé des nuits à stresser. T\'aurais pu dormir. T\'as réussi quand même.", body: `004. "T'as passé des nuits à stresser. T'aurais pu dormir. T'as réussi quand même."
L'équation est là. Nuits de stress plus nuits de sommeil normal égale même résultat. Ce qui veut dire que les nuits de stress étaient du bonus non nécessaire. Un investissement émotionnel sans retour sur investissement. Pour la prochaine fois dors. Félicitations, [Prénom].
Avec analyse coût-bénéfice des nuits de stress qui conclut à leur inutilité,
— quelqu'un qui te prescrit le sommeil comme stratégie principale pour la prochaine fois 😴` },
            { id: "gr13_s4_005", angle: "Félicitations. T\'as stressé les gens autour de toi avec ton stress. On t\'aime quand même.", body: `005. "Félicitations. T'as stressé les gens autour de toi avec ton stress. On t'aime quand même."
On a absorbé. On a rassuré. On a répondu aux messages à des heures improbables. On a dit que ça allait bien se passer un nombre de fois que je préfère pas compter. On a fait tout ça avec amour. Et on recommencera pour la prochaine fois. Félicitations, [Prénom].
Avec déclaration d'amour inconditionnel malgré le stress contaminant que tu as produit,
— quelqu'un qui a absorbé beaucoup de ton stress et qui s'en est remis 🫂` },
            { id: "gr13_s4_006", angle: "T\'as dit que t\'allais rater au moins cinquante fois. T\'as pas raté.", body: `006. "T'as dit que t'allais rater au moins cinquante fois. T'as pas raté."
Je les ai comptés. Enfin pas vraiment. Mais y'en avait beaucoup. Ces je vais rater. Ces c'est foutu. Ces je sais rien. Et à chaque fois c'était pas vrai. Et le résultat final prouve que c'était pas vrai. Pour la prochaine fois limite à dix le nombre de je vais rater. Félicitations, [Prénom].
Avec proposition de quota sur les déclarations de défaite anticipée pour la prochaine fois,
— quelqu'un qui propose dix comme plafond raisonnable et négociable 🔢` },
            { id: "gr13_s4_007", angle: "Félicitations. Ton niveau de stress était inversement proportionnel à ton niveau de préparation.", body: `007. "Félicitations. Ton niveau de stress était inversement proportionnel à ton niveau de préparation."
Plus tu étais préparé plus tu stressais. C'est ton fonctionnement. C'est chelou mais c'est toi. Et pourtant ta préparation était bonne et ton résultat est bon. Le stress était un bruit de fond non informatif. Pas un signal réel. Félicitations, [Prénom].
Avec analyse de l'absence de corrélation entre ton stress et ta préparation réelle,
— quelqu'un qui espère que tu finiras par voir cette absence de corrélation toi-même 📉` },
            { id: "gr13_s4_008", angle: "T\'as imaginé le pire. Le pire ne s\'est pas produit. Note mentale pour la prochaine fois.", body: `008. "T'as imaginé le pire. Le pire ne s'est pas produit. Note mentale pour la prochaine fois."
Le cerveau qui imagine le pire c'est un mécanisme de protection. Utile dans la savane. Moins utile avant un examen de maths. Pour la prochaine fois rappelle à ton cerveau qu'on est plus dans la savane. Félicitations, [Prénom].
Avec message doux au cerveau catastrophiste pour lui signaler qu'on est plus dans la savane,
— quelqu'un qui espère que ton cerveau lira ce message et en tiendra compte 🦁` },
            { id: "gr13_s4_009", angle: "Félicitations. T\'as stressé avec conviction et t\'as réussi avec la même conviction.", body: `009. "Félicitations. T'as stressé avec conviction et t'as réussi avec la même conviction."
Au moins t'es pas à moitié. Quand tu stresses tu stresses vraiment. Et quand tu réussis tu réussis vraiment. Cette intensité dans tout ce que tu fais c'est quelque chose. Parfois c'est épuisant. Souvent c'est admirable. Toujours c'est toi. Félicitations, [Prénom].
Avec amour pour ton intensité dans le stress comme dans la réussite,
— quelqu'un qui préférerait que l'intensité soit moins dans le stress mais qui t'aime dans les deux cas 🌊` },
            { id: "gr13_s4_010", angle: "T\'avais tout révisé. T\'as quand même stressé comme si t\'avais rien révisé.", body: `010. "T'avais tout révisé. T'as quand même stressé comme si t'avais rien révisé."
C'est le paradoxe de toi. La préparation objective et le stress subjectif évoluent indépendamment. L'un ne rassure pas l'autre. Ton cerveau stress indépendamment de l'état de ta préparation. C'est pas le move. Et tu t'en sors quand même. Félicitations, [Prénom].
Avec documentation du paradoxe stress-préparation qui te caractérise,
— quelqu'un qui a observé ce paradoxe plusieurs fois et qui commence à le trouver attachant 🔬` },
            { id: "gr13_s4_011", angle: "Félicitations. On a tous survécu à ton stress. Y compris toi.", body: `011. "Félicitations. On a tous survécu à ton stress. Y compris toi."
Toi en premier. Les gens autour ensuite. Tout le monde a traversé la période de stress et tout le monde est de l'autre côté. Debout. Vivant. Avec le diplôme pour toi et le soulagement pour tout le monde. La survie collective est complète. Félicitations, [Prénom].
Avec bilan de survie collective satisfaisant,
— quelqu'un qui confirme que tout le monde a survécu et que personne n'en garde de séquelles durables 😅` },
            { id: "gr13_s4_012", angle: "T\'as stressé sur des détails qui changeaient rien au résultat final.", body: `012. "T'as stressé sur des détails qui changeaient rien au résultat final."
Ce truc dans le cours que t'avais pas vu. Ce chapitre que t'avais révisé différemment. Ces points de détail qui t'avaient empêché de dormir. Aucun d'eux n'a changé le résultat final. Le résultat final est bon. Les détails étaient du bruit. Félicitations, [Prénom].
Avec constat que les détails stressants étaient du bruit pas du signal,
— quelqu'un qui espère que tu apprennes à distinguer le bruit du signal avant la prochaine fois 📻` },
            { id: "gr13_s4_013", angle: "Félicitations. Ton stress était contagieux. Ton résultat l\'est aussi.", body: `013. "Félicitations. Ton stress était contagieux. Ton résultat l'est aussi."
On a tous un peu stressé avec toi pendant la période. Et maintenant on est tous un peu contents avec toi. La contagion émotionnelle fonctionne dans les deux sens. Et la version bonheur est beaucoup plus agréable que la version stress. Félicitations, [Prénom], contamine-nous plus souvent comme ça.
Avec préférence marquée pour la version contagion bonheur sur la version contagion stress,
— quelqu'un qui accepte la contagion dans ce sens-là sans aucune réserve 🎉` },
            { id: "gr13_s4_014", angle: "T\'as envoyé des messages à des heures improbables pendant la période de stress.", body: `014. "T'as envoyé des messages à des heures improbables pendant la période de stress."
Ces messages. Ces 2h du matin je sais rien. Ces 6h du matin c'est foutu. Ces messages du dimanche soir qui commençaient par je pense que. On a répondu. Parce qu'on t'aime. Pour la prochaine fois essaie de limiter aux heures ouvrables. Félicitations, [Prénom].
Avec demande douce de respecter les heures ouvrables pour les prochaines crises de stress,
— quelqu'un qui a répondu à 2h du matin et qui le referait mais qui demande quand même 📱` },
            { id: "gr13_s4_015", angle: "Félicitations. T\'as prouvé que le stress intense et la réussite ne sont pas incompatibles.", body: `015. "Félicitations. T'as prouvé que le stress intense et la réussite ne sont pas incompatibles."
Si t'avais besoin de la preuve. La voilà. On peut stresser énormément. Imaginer le pire en détail. Passer des nuits difficiles. Et réussir quand même. Le stress n'a pas empêché la réussite. Il l'a juste rendue plus inconfortable. Félicitations, [Prénom].
Avec démonstration empirique de la compatibilité stress intense et réussite,
— quelqu'un qui préférerait que tu testes aussi la version sans stress intense juste pour comparer 🧪` },
            { id: "gr13_s4_016", angle: "T\'as stressé. On t\'a rassuré. T\'as stressé encore. On t\'a rassuré encore.", body: `016. "T'as stressé. On t'a rassuré. T'as stressé encore. On t'a rassuré encore."
Ce cycle. Ce cycle précis. Qu'on a répété ensemble un nombre de fois respectable. On rassurait. Tu étais rassuré. Puis le stress revenait. On rassurait à nouveau. Boucle infinie. On l'a fait avec amour. On le referait. Félicitations, [Prénom].
Avec description affectueuse du cycle rassurage infini qu'on a traversé ensemble,
— quelqu'un disponible pour la prochaine boucle infinie quand elle arrivera 🔄` },
            { id: "gr13_s4_017", angle: "Félicitations. Pour la prochaine fois retiens une chose. Tu t\'en sors toujours.", body: `017. "Félicitations. Pour la prochaine fois retiens une chose. Tu t'en sors toujours."
Regarde l'historique. Les trucs difficiles que t'as traversés. Les examens. Les épreuves. Les moments où tu étais convaincu que ça allait pas. T'as traversé. T'as réussi. T'es là. L'historique est clair. Pour la prochaine fois consulte l'historique avant de stresser. Félicitations, [Prénom].
Avec invitation à consulter l'historique avant la prochaine crise de stress,
— quelqu'un qui conserve cet historique pour toi et qui te le soumettra à chaque fois que nécessaire 📁` },
            { id: "gr13_s4_018", angle: "T\'as stressé pour un résultat qui méritait la confiance pas le stress.", body: `018. "T'as stressé pour un résultat qui méritait la confiance pas le stress."
Ton niveau méritait la confiance. Ta préparation méritait la confiance. Ton historique méritait la confiance. Et toi t'as choisi le stress. Pour la prochaine fois essaie la confiance. Juste une fois. Pour voir. Le résultat sera probablement le même mais l'expérience sera meilleure. Félicitations, [Prénom].
Avec suggestion expérimentale d'essayer la confiance comme alternative au stress,
— quelqu'un qui propose cette expérience sans pression et avec beaucoup d'espoir 🌱` },
            { id: "gr13_s4_019", angle: "Félicitations. Ton niveau de catastrophisme était épique. Ton résultat l\'est aussi.", body: `019. "Félicitations. Ton niveau de catastrophisme était épique. Ton résultat l'est aussi."
Tout était épique chez toi pendant cette période. L'intensité du stress. La créativité des scénarios catastrophes. Et maintenant le résultat. Épique dans les deux sens. T'es quelqu'un d'intense. Dans le bon et le moins bon. On t'aime dans les deux. Félicitations, [Prénom].
Avec amour pour toute ton épicité dans tous ses aspects,
— quelqu'un qui trouve que vivre à ton côté n'est jamais ennuyeux 🎢` },
            { id: "gr13_s4_020", angle: "C\'était pas le move d\'avoir autant stressé. T\'as réussi. On t\'aime. Les trois sont vrais.", body: `020. "C'était pas le move d'avoir autant stressé. T'as réussi. On t'aime. Les trois sont vrais."
Trois vérités simultanées. Le stress excessif n'était pas le move. Le résultat est là et il est bon. Et on t'aime avec ton stress excessif et tout le reste. Ces trois vérités coexistent parfaitement. Aucune n'annule les autres. Félicitations, [Prénom], stress et tout.
Avec affirmation définitive des trois vérités simultanées sans contradiction,
— quelqu'un qui t'aime avec ton stress excessif et qui ne changerait rien à ce package ❤️` },
          ],
        },
        {
          id: 'suite',
          label: "La suite fait un peu peur mais on gère",
          emoji: '🚀',
          messages: [
            { id: "gr13_s5_001", angle: "Félicitations. T\'as eu ton diplôme. La suite fait un peu peur. C\'est normal.", body: `001. "Félicitations. T'as eu ton diplôme. La suite fait un peu peur. C'est normal."
Ce serait bizarre que ça fasse pas un peu peur. La suite c'est nouveau. C'est inconnu. C'est plus grand que ce que t'as connu jusqu'ici. La peur de la suite c'est pas un signe que tu peux pas gérer. C'est un signe que tu prends ça au sérieux. Félicitations, [Prénom], et bienvenue dans le nouveau.
Avec validation que la peur de la suite est normale et même un bon signe,
— quelqu'un qui pense que ceux qui ont pas peur ont pas bien regardé ce qui les attend 👀` },
            { id: "gr13_s5_002", angle: "T\'as eu ton diplôme. Maintenant y\'a la suite. Et la suite on la gère ensemble.", body: `002. "T'as eu ton diplôme. Maintenant y'a la suite. Et la suite on la gère ensemble."
T'es pas seul face à la suite. Les gens autour de toi ont traversé leurs propres suites. Ont eu leurs propres peurs de ce qui venait après. Sont encore là. Et sont là pour toi maintenant. La suite se gère mieux à plusieurs. Félicitations, [Prénom], on est là.
Avec rappel explicite que la suite se gère à plusieurs et que plusieurs sont disponibles,
— quelqu'un qui sera là pour la suite comme il était là pour l'avant 🫂` },
            { id: "gr13_s5_003", angle: "Félicitations. La prochaine étape est floue. C\'est pas un problème.", body: `003. "Félicitations. La prochaine étape est floue. C'est pas un problème."
Le flou c'est pas l'ennemi. Le flou c'est de l'espace. De l'espace pour décider. Pour explorer. Pour changer d'avis. Pour tester des trucs. La clarté totale à ton âge sur ce qui vient après c'est suspect. Le flou c'est honnête. Et honnête c'est bien. Félicitations, [Prénom].
Avec réhabilitation du flou comme espace de possibilités plutôt que comme problème,
— quelqu'un qui préfère ton flou honnête à une fausse certitude rassurante 🌫️` },
            { id: "gr13_s5_004", angle: "T\'as géré l\'étape d\'avant. Tu géreras l\'étape d\'après.", body: `004. "T'as géré l'étape d'avant. Tu géreras l'étape d'après."
L'étape d'avant semblait grande. T'as géré. L'étape d'après semble grande. Tu géreras. C'est la logique de ton historique. T'as un track record de gestion des étapes qui semblaient grandes. Ce track record s'applique à la suivante aussi. Félicitations, [Prénom].
Avec application logique de ton track record à l'étape suivante,
— quelqu'un qui consulte ton historique et qui fait confiance à sa continuité 📈` },
            { id: "gr13_s5_005", angle: "Félicitations. La suite fait peur à tout le monde. T\'es pas le seul.", body: `005. "Félicitations. La suite fait peur à tout le monde. T'es pas le seul."
Cette peur-là elle est universelle. Tout le monde qui arrive là où t'es ressent quelque chose de similaire. L'inconnu c'est universel. Ce que t'as c'est aussi ce que tout le monde a eu. Et tout le monde a traversé quand même. Félicitations, [Prénom], t'es en bonne compagnie.
Avec rappel que ta peur est universelle et non un signe de faiblesse personnelle,
— quelqu'un qui a eu la même peur et qui confirme que ça passe 🌍` },
            { id: "gr13_s5_006", angle: "La suite c\'est grand. T\'es capable de grand.", body: `006. "La suite c'est grand. T'es capable de grand."
Y'a une correspondance entre la taille de la suite et ta capacité à la gérer. Tu grandis avec ce qui est devant toi. C'est comme ça que ça marche. La suite est grande parce que toi t'es capable de grand. Pas par hasard. Par logique. Félicitations, [Prénom].
Avec théorie de la correspondance entre la grandeur de la suite et la capacité à la gérer,
— quelqu'un qui croit à cette correspondance et qui pense qu'elle s'applique parfaitement à toi 🏔️` },
            { id: "gr13_s5_007", angle: "Félicitations. T\'as pas besoin d\'avoir toutes les réponses maintenant.", body: `007. "Félicitations. T'as pas besoin d'avoir toutes les réponses maintenant."
La pression d'avoir tout figé. Tout décidé. Tout planifié. À ton âge. C'est pas réaliste. Et c'est pas nécessaire. T'as besoin d'une direction. Pas d'un plan détaillé. Une direction ça suffit pour commencer. Le reste se précise en avançant. Félicitations, [Prénom].
Avec soulagement de la pression d'avoir tout décidé maintenant,
— quelqu'un qui pense qu'une direction vaut mieux qu'un plan rigide à ton stade 🧭` },
            { id: "gr13_s5_008", angle: "La suite fait peur parce que c\'est important. C\'est bon signe.", body: `008. "La suite fait peur parce que c'est important. C'est bon signe."
On a peur des trucs qui comptent. On stresse pas pour les trucs qui nous indiffèrent. Ta peur dit que la suite compte pour toi. Que t'y es investi. Que t'as des attentes. Cette peur-là c'est de l'engagement déguisé. Félicitations, [Prénom].
Avec réinterprétation de ta peur comme preuve d'engagement et non de faiblesse,
— quelqu'un qui préfère ta peur engagée à l'indifférence désengagée 🔥` },
            { id: "gr13_s5_009", angle: "Félicitations. T\'as survécu à tout ce qui te faisait peur avant. La suite aussi.", body: `009. "Félicitations. T'as survécu à tout ce qui te faisait peur avant. La suite aussi."
Liste mentale. Tous les trucs qui te faisaient peur avant. Tous les trucs qui semblaient impossibles à traverser. T'as traversé. La liste est longue. Et la suite va s'y ajouter. Comme tous les autres trucs que t'as traversés. Félicitations, [Prénom].
Avec invitation à faire toi-même la liste de tout ce que t'as déjà traversé,
— quelqu'un qui pense que cette liste est ton meilleur antidote à la peur de la suite 📋` },
            { id: "gr13_s5_010", angle: "La suite c\'est toi qui la construis. C\'est pour ça que c\'est intimidant.", body: `010. "La suite c'est toi qui la construis. C'est pour ça que c'est intimidant."
Quand c'est balisé c'est moins intimidant. Là c'est moins balisé. Y'a plus de cases à cocher dans l'ordre. Y'a des choix à faire. Des directions à prendre. Cette liberté c'est intimidant parce que c'est de la responsabilité vraie. Et toi t'es prêt pour la responsabilité vraie. Félicitations, [Prénom].
Avec identification de la source réelle de l'intimidation comme liberté et responsabilité,
— quelqu'un qui pense que t'es prêt pour les deux même si tu penses pas encore ça de toi 🏗️` },
            { id: "gr13_s5_011", angle: "Félicitations. La peur de la suite c\'est la peur de grandir. Et grandir c\'est bien.", body: `011. "Félicitations. La peur de la suite c'est la peur de grandir. Et grandir c'est bien."
Grandir c'est inconfortable. Toujours. C'est sortir de ce qui est connu. De ce qui est maîtrisé. De ce qui est sécurisant. Pour aller vers quelque chose de plus grand. L'inconfort de grandir c'est le prix à payer. Et le résultat en vaut le prix. Félicitations, [Prénom].
Avec conviction que l'inconfort de grandir vaut toujours son prix,
— quelqu'un qui a payé ce prix plusieurs fois et qui confirme que ça vaut le coup 🌱` },
            { id: "gr13_s5_012", angle: "La suite est moins effrayante quand on y va un pas à la fois.", body: `012. "La suite est moins effrayante quand on y va un pas à la fois."
Tout voir en même temps c'est écrasant. Un pas à la fois c'est gérable. Le prochain pas seulement. Pas tous les pas de toute la suite. Juste le prochain. Et ensuite le suivant. Et ainsi de suite. La suite se mange par petits morceaux. Félicitations, [Prénom].
Avec stratégie concrète du pas à la fois pour rendre la suite gérable,
— quelqu'un qui te recommande de ne regarder que le prochain pas et pas toute l'autoroute 👣` },
            { id: "gr13_s5_013", angle: "Félicitations. T\'auras des gens pour t\'accompagner dans la suite.", body: `013. "Félicitations. T'auras des gens pour t'accompagner dans la suite."
T'es pas seul pour y aller. Les gens autour de toi sont là. Certains ont déjà marché sur ces chemins. Certains marcheront à côté. Certains seront là quand tu auras besoin de souffler. La suite se fait avec des gens. Et t'as des gens. Félicitations, [Prénom].
Avec rappel des gens disponibles pour la suite comme ressource réelle et concrète,
— quelqu'un qui sera dans ces gens-là et qui le dit explicitement 🤝` },
            { id: "gr13_s5_014", angle: "La suite fait peur et c\'est ok d\'avoir peur et d\'avancer quand même.", body: `014. "La suite fait peur et c'est ok d'avoir peur et d'avancer quand même."
Le courage c'est pas l'absence de peur. C'est avancer malgré la peur. Avec la peur. En la portant. Sans la laisser décider à ta place. T'as déjà fait ça. T'as avancé sur des trucs qui te faisaient peur. La suite c'est pareil. Juste plus grand. Félicitations, [Prénom].
Avec définition du courage comme avancer avec la peur et non sans la peur,
— quelqu'un qui a vu plusieurs fois avancer avec ta peur et qui sait que t'en es capable 🦁` },
            { id: "gr13_s5_015", angle: "Félicitations. Dans un an tu regarderas la suite actuelle comme quelque chose que t\'as géré.", body: `015. "Félicitations. Dans un an tu regarderas la suite actuelle comme quelque chose que t'as géré."
Recul temporel. Dans un an cette peur actuelle sera derrière. Ce qui semble grand maintenant semblera plus petit avec du recul. Et toi tu seras de l'autre côté en train de regarder en arrière avec cette satisfaction tranquille. Ça arrive toujours. Ça arrivera pour ça aussi. Félicitations, [Prénom].
Avec perspective temporelle d'un an pour relativiser la peur actuelle,
— quelqu'un qui prédit avec confiance ce que tu penseras dans un an de cette période 📅` },
            { id: "gr13_s5_016", angle: "La suite c\'est nouveau. Le nouveau c\'est bien même quand c\'est effrayant.", body: `016. "La suite c'est nouveau. Le nouveau c'est bien même quand c'est effrayant."
Le nouveau apporte des trucs que l'ancien avait pas. Des opportunités. Des rencontres. Des versions de toi que t'aurais pas développées autrement. Le nouveau effraie parce qu'il est inconnu. Mais l'inconnu c'est aussi là où les bonnes surprises se cachent. Félicitations, [Prénom].
Avec éloge du nouveau comme lieu des bonnes surprises cachées,
— quelqu'un qui espère que tu trouveras les bonnes surprises que la suite t'a préparées 🎁` },
            { id: "gr13_s5_017", angle: "Félicitations. T\'as les outils pour la suite. Tu les vois pas encore tous.", body: `017. "Félicitations. T'as les outils pour la suite. Tu les vois pas encore tous."
Certains outils tu les as développés sans le savoir. La gestion du stress. La persévérance. La capacité à traverser les trucs difficiles. Ces outils sont dans ton sac. T'en as conscience de certains. D'autres tu les découvriras en route. Mais ils sont là. Félicitations, [Prénom].
Avec inventaire partiel des outils que tu as dans ton sac sans forcément le savoir,
— quelqu'un qui voit ton sac d'outils mieux que toi parfois et qui confirme qu'il est bien rempli 🎒` },
            { id: "gr13_s5_018", angle: "La suite on la gère comme on a géré jusqu\'ici. Ensemble.", body: `018. "La suite on la gère comme on a géré jusqu'ici. Ensemble."
Ce qui a marché jusqu'ici c'est pas toi seul. C'est toi avec des gens. Des gens qui étaient là. Qui ont aidé. Qui ont accompagné. Qui ont cru. Ce qui a marché jusqu'ici continuera à marcher pour la suite. Parce que les gens sont toujours là. Félicitations, [Prénom].
Avec confirmation que la formule qui a marché jusqu'ici reste disponible pour la suite,
— quelqu'un qui fait partie de cette formule et qui confirme sa disponibilité 🫂` },
            { id: "gr13_s5_019", angle: "Félicitations. T\'as peur de la suite parce que tu veux que ça se passe bien.", body: `019. "Félicitations. T'as peur de la suite parce que tu veux que ça se passe bien."
Cette peur-là vient de quelque part de bien. Elle vient du fait que ça compte pour toi. Que t'as des espoirs. Des attentes. Des envies pour ce qui vient. Les gens qui veulent que ça se passe bien font en sorte que ça se passe bien. T'es ce genre de personne. Félicitations, [Prénom].
Avec réinterprétation de ta peur comme preuve de tes aspirations pour la suite,
— quelqu'un qui voit tes aspirations dans ta peur et qui les trouve belles 🌟` },
            { id: "gr13_s5_020", angle: "Félicitations. La suite fait peur. On gère. T\'es pas seul. Point.", body: `020. "Félicitations. La suite fait peur. On gère. T'es pas seul. Point."
Trois phrases. Courtes. Vraies. La suite fait peur c'est un fait. On gère c'est une certitude. T'es pas seul c'est une promesse. Ces trois choses sont vraies en même temps. Et elles suffisent. Pour maintenant. Pour la suite. Pour tout ce qui vient. Félicitations, [Prénom].
Avec économie de mots sur trois vérités qui n'ont pas besoin d'être développées davantage,
— quelqu'un qui tient les trois et qui les tiendra pour toute la suite ❤️` },
          ],
        },
    ],
  },
];

export const YOUTH_FIRSTJOB_LIBRARY: YouthAgeGroup[] = [
  {
    id: 'young_adult',
    label: '18-25 ans',
    minAge: 18,
    maxAge: 25,
    subCategories: [
        {
          id: 'survie',
          label: "T'as survécu à la recherche",
          emoji: '🏁',
          messages: [
            { id: "fj25_s1_001", angle: "Félicitations. T\'as survécu à la recherche. C\'est déjà énorme.", body: `001. "Félicitations. T'as survécu à la recherche. C'est déjà énorme."
La recherche c'est un truc à part. Les candidatures envoyées dans le vide. Les relances sans réponse. Les refus polis. Les entretiens qui donnaient de l'espoir et qui aboutissaient à rien. Tout ça t'as traversé. Et t'es de l'autre côté avec le poste. Félicitations, [Prénom].
Avec respect pour tout ce que la recherche t'a demandé avant d'aboutir,
— quelqu'un qui sait ce que cette traversée coûte et qui te félicite pour les deux 🏁` },
            { id: "fj25_s1_002", angle: "T\'as envoyé des candidatures dans le vide. Et une a atterri.", body: `002. "T'as envoyé des candidatures dans le vide. Et une a atterri."
Toutes ces candidatures. Ces lettres de motivation écrites et réécrites. Ces CV ajustés. Ces envois sans confirmation de réception. Et puis une qui a atterri. Une qui a produit quelque chose. Une qui a mené jusqu'ici. Cette une-là valait toutes les autres. Félicitations, [Prénom].
Avec perspective sur le ratio candidatures-résultat et sa valeur finale,
— quelqu'un qui sait que le jeu des candidatures se gagne à l'endurance 📬` },
            { id: "fj25_s1_003", angle: "Félicitations. T\'as appris à réécrire ta lettre de motivation dix fois.", body: `003. "Félicitations. T'as appris à réécrire ta lettre de motivation dix fois."
Chaque réécriture était un apprentissage. Sur toi. Sur ce que tu voulais dire. Sur comment te présenter. Sur ce qui comptait vraiment. Ces dix réécritures t'ont appris des trucs sur toi-même qu'une seule version n'aurait pas appris. Félicitations, [Prénom].
Avec valorisation de chaque réécriture comme apprentissage sur soi,
— quelqu'un qui pense que la lettre de motivation est en fait un exercice d'introspection déguisé ✍️` },
            { id: "fj25_s1_004", angle: "T\'as géré les refus. C\'est une compétence.", body: `004. "T'as géré les refus. C'est une compétence."
Les refus font partie du jeu. Mais les savoir et les vivre c'est deux trucs différents. T'as vécu des refus. T'as continué quand même. T'as pas laissé les refus définir ta valeur. T'as pas abandonné. Cette gestion des refus c'est une compétence de vie que tu as maintenant. Félicitations, [Prénom].
Avec reconnaissance de la gestion des refus comme compétence acquise dans la douleur,
— quelqu'un qui sait que cette compétence servira bien au-delà de la recherche d'emploi 💪` },
            { id: "fj25_s1_005", angle: "Félicitations. T\'as attendu des nouvelles qui tardaient. T\'as tenu.", body: `005. "Félicitations. T'as attendu des nouvelles qui tardaient. T'as tenu."
Ces attentes. Ces après les entretiens. Ces on vous recontactera sous deux semaines qui devenaient trois puis quatre. Ces silences radio. Ces vérifications de boîte mail. T'as attendu. T'as pas perdu espoir. T'as tenu. Félicitations, [Prénom].
Avec respect pour ta tenue dans les silences radio post-entretien,
— quelqu'un qui sait que ces silences sont parfois le plus dur à gérer 📱` },
            { id: "fj25_s1_006", angle: "T\'as passé des entretiens. Certains bien. Certains moins bien.", body: `006. "T'as passé des entretiens. Certains bien. Certains moins bien."
Les entretiens où tu sortais satisfait. Et ceux où tu sortais en sachant que c'était pas ça. Les deux ont appris des trucs. Les bons ont montré ce que tu pouvais faire. Les mauvais ont montré ce qui restait à travailler. Les deux t'ont amené jusqu'ici. Félicitations, [Prénom].
Avec valorisation égale des bons et des mauvais entretiens comme éléments du chemin,
— quelqu'un qui pense que les mauvais entretiens enseignent plus que les bons 🎭` },
            { id: "fj25_s1_007", angle: "Félicitations. T\'as adapté ton discours à chaque entreprise.", body: `007. "Félicitations. T'as adapté ton discours à chaque entreprise."
Cette capacité à comprendre ce que chaque entreprise cherchait. À ajuster ta présentation. À montrer ce qui était pertinent pour ce contexte précis. Pas en mentant. En choisissant les bons angles. C'est une intelligence situationnelle que peu de gens ont d'emblée. Félicitations, [Prénom].
Avec admiration pour ton intelligence situationnelle dans les candidatures,
— quelqu'un qui sait que cette capacité d'adaptation sera utile dans tout le reste aussi 🎯` },
            { id: "fj25_s1_008", angle: "T\'as douté de toi pendant la recherche. C\'était normal.", body: `008. "T'as douté de toi pendant la recherche. C'était normal."
Ces moments où tu te demandais si tu allais trouver. Si t'étais bon enough. Si le marché avait de la place pour toi. Ces doutes-là ils arrivent à tout le monde dans la recherche. T'as traversé ces doutes et t'es là. Le résultat a répondu aux doutes. Félicitations, [Prénom].
Avec validation de tes doutes pendant la recherche comme normaux et maintenant résolus,
— quelqu'un qui espère que tu notes que le résultat a répondu aux doutes 💡` },
            { id: "fj25_s1_009", angle: "Félicitations. T\'as survécu aux questions d\'entretien bizarres.", body: `009. "Félicitations. T'as survécu aux questions d'entretien bizarres."
Ces questions. Où vous voyez-vous dans cinq ans. Quelle est votre plus grande qualité et votre plus grand défaut. Si vous étiez un animal. Ces questions auxquelles t'as dû répondre avec le sérieux qu'elles méritaient parfois pas. T'as survécu à ça. C'est une victoire en soi. Félicitations, [Prénom].
Avec solidarité pour avoir traversé les questions d'entretien les plus absurdes avec dignité,
— quelqu'un qui trouve ces questions absurdes mais qui reconnaît que t'as bien joué le jeu 🦁` },
            { id: "fj25_s1_010", angle: "T\'as mis du temps à trouver. Le temps était pas du temps perdu.", body: `010. "T'as mis du temps à trouver. Le temps était pas du temps perdu."
Ce temps de la recherche. Ces semaines ou ces mois. Qui semblaient du temps perdu. Qui n'en étaient pas. C'était du temps d'apprentissage. De construction. De précision de ce que tu voulais vraiment. Le temps de la recherche fait partie de la construction de la suite. Félicitations, [Prénom].
Avec réhabilitation du temps de la recherche comme temps de construction et non de perte,
— quelqu'un qui est convaincu que le chemin jusqu'ici fait partie du résultat 🗓️` },
            { id: "fj25_s1_011", angle: "Félicitations. T\'as négocié quelque chose. Même un peu. C\'est le move.", body: `011. "Félicitations. T'as négocié quelque chose. Même un peu. C'est le move."
Ce moment. Où t'as pas juste accepté ce qui était proposé. Où t'as posé une question. Demandé quelque chose. Négocié un détail. Cette capacité à pas juste dire oui à tout c'est quelque chose qui se développe. Et tu l'as fait. Félicitations, [Prénom].
Avec éloge particulier pour ta capacité à négocier même un peu au lieu de juste accepter,
— quelqu'un qui sait que cette compétence-là paie sur le long terme 💶` },
            { id: "fj25_s1_012", angle: "T\'as cherché ce que tu voulais vraiment. Pas juste n\'importe quoi.", body: `012. "T'as cherché ce que tu voulais vraiment. Pas juste n'importe quoi."
T'aurais pu prendre n'importe quoi juste pour arrêter de chercher. T'as pas fait ça. T'as attendu quelque chose qui avait du sens. Qui correspondait à une direction. Cette exigence sur toi-même c'est une qualité. Félicitations, [Prénom].
Avec respect pour ton exigence à chercher quelque chose qui avait du sens pas juste n'importe quoi,
— quelqu'un qui pense que cette exigence te servira toute ta vie professionnelle 🧭` },
            { id: "fj25_s1_013", angle: "Félicitations. T\'as géré l\'incertitude de la recherche sans t\'effondrer.", body: `013. "Félicitations. T'as géré l'incertitude de la recherche sans t'effondrer."
L'incertitude de la recherche c'est une des plus difficiles. Pas savoir quand. Pas savoir si. Pas avoir de timeline claire. Et continuer quand même. Et rester fonctionnel. Et avancer malgré le flou. T'as fait ça. Félicitations, [Prénom].
Avec admiration pour ta gestion de l'incertitude prolongée sans effondrement,
— quelqu'un qui sait que l'incertitude de la recherche est un test de caractère 🌫️` },
            { id: "fj25_s1_014", angle: "T\'as eu de l\'aide pendant la recherche. Accepter l\'aide c\'est bien.", body: `014. "T'as eu de l'aide pendant la recherche. Accepter l'aide c'est bien."
Des gens qui ont regardé ton CV. Qui ont fait du réseau pour toi. Qui t'ont donné des contacts. Qui t'ont relu. Qui t'ont encouragé. T'as accepté cette aide. Sans la refuser par fierté. Sans y mettre de la honte. Cette façon de recevoir l'aide est une compétence. Félicitations, [Prénom].
Avec éloge de ta capacité à recevoir de l'aide pendant la recherche sans que l'ego bloque,
— quelqu'un qui était peut-être dans cette aide et qui est content que tu l'aies acceptée 🤝` },
            { id: "fj25_s1_015", angle: "Félicitations. T\'as trouvé. Maintenant ça commence vraiment.", body: `015. "Félicitations. T'as trouvé. Maintenant ça commence vraiment."
La recherche c'était un chapitre. Ce chapitre est fermé. Le suivant commence. Et le suivant c'est le vrai. Le concret. Le quotidien du poste. Tout ce que t'as fait pour arriver ici c'était pour ça. Et ça commence. Félicitations, [Prénom].
Avec enthousiasme pour le début de ce pour quoi tout le reste était la préparation,
— quelqu'un qui est impatient de voir ce que tu vas faire de ce que tu as trouvé 🚀` },
            { id: "fj25_s1_016", angle: "T\'as fait confiance au processus même quand le processus était long.", body: `016. "T'as fait confiance au processus même quand le processus était long."
Cette confiance dans le fait que quelque chose allait finir par aboutir. Même quand le timing était pas là. Même quand les résultats tardaient. Même quand le doute était là. T'as continué à faire confiance au processus. Et le processus a abouti. Félicitations, [Prénom].
Avec reconnaissance pour ta confiance au processus quand rien ne garantissait qu'il aboutirait,
— quelqu'un qui retient ça pour te le rappeler les prochaines fois où un processus sera long 🌱` },
            { id: "fj25_s1_017", angle: "Félicitations. T\'as appris à parler de toi. C\'est plus dur qu\'il y paraît.", body: `017. "Félicitations. T'as appris à parler de toi. C'est plus dur qu'il y paraît."
Parler de soi dans un contexte professionnel. Valoriser ce qu'on a fait. Présenter ses compétences sans arrogance et sans fausse modestie. Raconter son parcours de façon cohérente. Ces choses-là ne sont pas naturelles. Tu les as apprises. Félicitations, [Prénom].
Avec reconnaissance de l'apprentissage difficile de parler de soi de façon professionnelle,
— quelqu'un qui sait que cette compétence reste utile bien au-delà de la recherche 🗣️` },
            { id: "fj25_s1_018", angle: "T\'as pesé des options. T\'as choisi. C\'est toi qui décides de ta trajectoire.", body: `018. "T'as pesé des options. T'as choisi. C'est toi qui décides de ta trajectoire."
T'as peut-être eu plusieurs possibilités. T'as évalué. Réfléchi. Choisi. Cette décision c'est la tienne. Cette trajectoire c'est la tienne. Pas celle que quelqu'un d'autre a définie pour toi. Celle que tu as choisie avec les informations que t'avais. Félicitations, [Prénom].
Avec éloge de ta prise en main de ta propre trajectoire professionnelle,
— quelqu'un qui pense que c'est toi qui tiens le volant et qui trouve ça bien 🚗` },
            { id: "fj25_s1_019", angle: "Félicitations. T\'as survécu à la recherche et t\'en sors plus fort.", body: `019. "Félicitations. T'as survécu à la recherche et t'en sors plus fort."
La recherche change les gens. Elle apprend la résilience. La gestion du rejet. L'art de se présenter. La connaissance de soi. La patience. T'es ressorti de la recherche avec tout ça en plus. Le poste c'est le résultat visible. Tout le reste c'est le résultat invisible. Félicitations, [Prénom].
Avec inventaire du résultat invisible de la recherche au-delà du poste obtenu,
— quelqu'un qui pense que le résultat invisible vaut autant que le visible 💎` },
            { id: "fj25_s1_020", angle: "T\'as cherché. T\'as trouvé. La suite commence. Félicitations, [Prénom].", body: `020. "T'as cherché. T'as trouvé. La suite commence. Félicitations, [Prénom]."
Trois phrases. L'essentiel. La recherche est derrière. Le résultat est là. La suite commence. Tout ce qu'il fallait dire est dit. Tout ce qu'il fallait traverser est traversé. Maintenant c'est le début de quelque chose de nouveau. Félicitations, [Prénom].
Avec économie de mots totale parce que parfois trois phrases suffisent,
— quelqu'un qui te souhaite la meilleure des suites 🌅` },
          ],
        },
        {
          id: 'no_cap',
          label: "No cap t'assures dans le monde réel",
          emoji: '⭐',
          messages: [
            { id: "fj25_s2_001", angle: "Félicitations. No cap t\'assures dans le monde réel.", body: `001. "Félicitations. No cap t'assures dans le monde réel."
Le monde réel c'est pas l'école. Les règles sont différentes. Les enjeux sont différents. Les relations sont différentes. Et toi tu navigues dedans. Avec une façon d'être qui fonctionne. Qui produit des résultats. Qui crée de la confiance autour de toi. No cap t'assures. Félicitations, [Prénom].
Avec constat sincère de ta façon de fonctionner dans le monde réel,
— quelqu'un qui observe ton atterrissage dans le monde réel avec satisfaction 🌍` },
            { id: "fj25_s2_002", angle: "T\'assures dans les petits trucs. C\'est là que tout se joue.", body: `002. "T'assures dans les petits trucs. C'est là que tout se joue."
Les grands projets tout le monde les voit. Les petits trucs quotidiens c'est là que le caractère se révèle. Ta façon d'être à l'heure. De répondre aux mails. De faire ce qu'on te demande sans qu'on te le rappelle deux fois. Ces petits trucs-là construisent ta réputation. Et les tiens sont bons. Félicitations, [Prénom].
Avec éloge particulier des petits trucs quotidiens comme fondation de la réputation,
— quelqu'un qui sait que la réputation se fait dans les petits trucs pas dans les grands discours 🧱` },
            { id: "fj25_s2_003", angle: "Félicitations. T\'as montré que t\'étais fiable. C\'est la première chose qu\'on regarde.", body: `003. "Félicitations. T'as montré que t'étais fiable. C'est la première chose qu'on regarde."
Dans un nouveau poste la première chose qu'on évalue c'est la fiabilité. Est-ce que cette personne fait ce qu'elle dit. Est-ce qu'on peut compter sur elle. Est-ce qu'elle tient ses engagements. T'as montré ça. C'est la fondation. Félicitations, [Prénom].
Avec identification de la fiabilité comme première compétence à établir dans un nouveau poste,
— quelqu'un qui sait que tout le reste se construit sur cette fondation 🔒` },
            { id: "fj25_s2_004", angle: "T\'assures dans ta façon de t\'intégrer sans perdre ce que t\'es.", body: `004. "T'assures dans ta façon de t'intégrer sans perdre ce que t'es."
S'intégrer sans se dissoudre. Trouver sa place dans un environnement existant. Comprendre les codes. Les adopter. Sans perdre sa personnalité dans le processus. Sans devenir quelqu'un d'autre pour être accepté. T'as trouvé cet équilibre. Félicitations, [Prénom].
Avec admiration pour ton intégration sans dissolution de ta personnalité,
— quelqu'un qui trouve cet équilibre rare et précieux 🧩` },
            { id: "fj25_s2_005", angle: "Félicitations. T\'as posé des questions quand t\'avais pas compris. C\'est le move.", body: `005. "Félicitations. T'as posé des questions quand t'avais pas compris. C'est le move."
Le piège du nouveau poste c'est de faire semblant de comprendre pour pas avoir l'air de ne pas savoir. T'as posé des questions. T'as demandé des clarifications. T'as montré que tu voulais bien faire plutôt que paraître. C'est exactement le move. Félicitations, [Prénom].
Avec éloge de ta capacité à poser des questions plutôt que de faire semblant,
— quelqu'un qui pense que poser des questions intelligentes est une compétence en soi 🙋` },
            { id: "fj25_s2_006", angle: "T\'assures dans ta façon de gérer les relations au travail.", body: `006. "T'assures dans ta façon de gérer les relations au travail."
Les collègues. Les supérieurs. Les dynamiques de groupe. Les personnalités différentes. T'as navigué dans tout ça avec une intelligence relationnelle qui n'est pas donnée à tout le monde. T'as su qui être avec qui. Comment te positionner. Comment créer de la confiance. Félicitations, [Prénom].
Avec admiration pour ton intelligence relationnelle dans le contexte professionnel,
— quelqu'un qui sait que cette compétence est souvent plus précieuse que les compétences techniques 🤝` },
            { id: "fj25_s2_007", angle: "Félicitations. T\'as livré ce qu\'on t\'avait demandé dans les temps.", body: `007. "Félicitations. T'as livré ce qu'on t'avait demandé dans les temps."
Basique en apparence. Fondamental en réalité. Livrer ce qu'on demande dans les temps c'est la base sur laquelle tout le reste se construit. T'as fait ça. T'as pas cherché à faire plus avant d'avoir fait ça. Cette discipline-là est essentielle. Félicitations, [Prénom].
Avec éloge de la discipline de base comme fondation de tout le reste,
— quelqu'un qui sait que beaucoup de gens ne maîtrisent pas encore cette base 📅` },
            { id: "fj25_s2_008", angle: "T\'assures dans ta façon de gérer les feedbacks.", body: `008. "T'assures dans ta façon de gérer les feedbacks."
Recevoir du feedback c'est un art. Ne pas le prendre personnellement. En extraire ce qui est utile. L'intégrer. Sans se décourager. Sans se braquer. T'as développé cette capacité. Et elle va te servir toute ta carrière. Félicitations, [Prénom].
Avec admiration pour ta capacité à recevoir et intégrer les feedbacks,
— quelqu'un qui sait que cette capacité est rare et précieuse 🪞` },
            { id: "fj25_s2_009", angle: "Félicitations. T\'as appris vite. Ça se voit.", body: `009. "Félicitations. T'as appris vite. Ça se voit."
L'apprentissage rapide c'est une des qualités les plus précieuses dans un nouveau poste. T'as intégré les codes. Les outils. Les façons de faire. Plus vite que la moyenne. Et ça s'est vu. Et ça a produit de la confiance autour de toi. Félicitations, [Prénom].
Avec reconnaissance de ta vitesse d'apprentissage comme qualité visible,
— quelqu'un qui a observé cet apprentissage rapide et qui le salue 📈` },
            { id: "fj25_s2_010", angle: "T\'assures dans ta façon d\'être proactif sans dépasser les limites.", body: `010. "T'assures dans ta façon d'être proactif sans dépasser les limites."
L'équilibre difficile. Prendre des initiatives. Faire plus que le minimum. Sans empiéter. Sans dépasser ce qui t'appartient. Sans aller sur les plates-bandes des autres. T'as trouvé cet équilibre. Cette proactivité calibrée c'est ce qu'on cherche dans un bon collaborateur. Félicitations, [Prénom].
Avec admiration pour ton équilibre proactivité-calibrage dans le contexte professionnel,
— quelqu'un qui sait que cet équilibre est difficile à trouver et que tu l'as trouvé 🎛️` },
            { id: "fj25_s2_011", angle: "Félicitations. T\'as géré les trucs ennuyeux sans te plaindre.", body: `011. "Félicitations. T'as géré les trucs ennuyeux sans te plaindre."
Y'a toujours des trucs ennuyeux dans un travail. Des tâches répétitives. Des réunions inutiles. Des trucs administratifs. T'as géré tout ça sans t'en faire une montagne. Sans en parler en permanence. En faisant ce qu'il y avait à faire. C'est du professionnalisme. Félicitations, [Prénom].
Avec respect pour ta gestion silencieuse des aspects ennuyeux du travail,
— quelqu'un qui sait que cette qualité est plus rare qu'il n'y paraît 😶` },
            { id: "fj25_s2_012", angle: "T\'assures dans ta façon de communiquer ce que tu fais.", body: `012. "T'assures dans ta façon de communiquer ce que tu fais."
Faire des choses bien c'est une partie. Les communiquer c'est l'autre partie. T'as compris que le travail invisible reste invisible. Tu communiques ce que tu fais. De façon claire. Sans te mettre trop en avant. Juste assez pour que les bonnes personnes sachent. Félicitations, [Prénom].
Avec reconnaissance de ta maîtrise de la communication de ton travail,
— quelqu'un qui sait que cette compétence est souvent sous-estimée et que tu l'as bien comprise 📣` },
            { id: "fj25_s2_013", angle: "Félicitations. T\'as géré une situation difficile au travail avec classe.", body: `013. "Félicitations. T'as géré une situation difficile au travail avec classe."
Cette situation. Ce moment compliqué. Avec un collègue. Un projet. Une pression. Un imprévu. T'as géré ça avec une maturité qui dit que t'es fait pour ce que tu fais. Pas parfaitement peut-être. Mais avec classe. Félicitations, [Prénom].
Avec respect particulier pour ta gestion avec classe d'une situation difficile,
— quelqu'un qui pense que c'est dans ces moments-là que le vrai caractère se révèle 🎭` },
            { id: "fj25_s2_014", angle: "T\'assures dans ta façon d\'être curieux et de vouloir comprendre.", body: `014. "T'assures dans ta façon d'être curieux et de vouloir comprendre."
Cette curiosité professionnelle. De vouloir comprendre comment les choses fonctionnent. Pourquoi les décisions sont prises. Quelle est la logique derrière. Cette curiosité produit des gens qui comprennent vraiment leur environnement. Et qui finissent par y avoir plus d'impact. Félicitations, [Prénom].
Avec éloge de ta curiosité professionnelle comme moteur d'impact à long terme,
— quelqu'un qui est convaincu que cette curiosité te mènera loin 🔭` },
            { id: "fj25_s2_015", angle: "Félicitations. T\'as représenté quelque chose de bien dans ce premier poste.", body: `015. "Félicitations. T'as représenté quelque chose de bien dans ce premier poste."
La façon dont tu t'es présenté. Dont tu t'es comporté. Dont tu as traité les gens. La réputation que tu as commencé à construire. Ces premières impressions dans un premier poste elles restent. Et les tiennes sont bonnes. Tu représentes quelque chose de bien. Félicitations, [Prénom].
Avec satisfaction de la réputation que tu as commencé à construire dans ce premier poste,
— quelqu'un qui pense que cette réputation initiale est un actif précieux 🌟` },
            { id: "fj25_s2_016", angle: "T\'assures dans ta façon de gérer les ambiguïtés.", body: `016. "T'assures dans ta façon de gérer les ambiguïtés."
Le monde professionnel est plein d'ambiguïtés. Des missions pas clairement définies. Des attentes implicites. Des situations sans mode d'emploi. T'as navigué dans ces ambiguïtés. T'as pris des décisions sans avoir toutes les informations. Et globalement tu as bien navigué. Félicitations, [Prénom].
Avec admiration pour ta navigation dans les ambiguïtés professionnelles,
— quelqu'un qui sait que cette compétence devient de plus en plus précieuse 🧭` },
            { id: "fj25_s2_017", angle: "Félicitations. T\'as montré que t\'étais là pour apprendre pas juste pour performer.", body: `017. "Félicitations. T'as montré que t'étais là pour apprendre pas juste pour performer."
Cette posture d'apprentissage dans un premier poste. Cette façon d'être ouvert. Réceptif. En mode je suis là pour comprendre d'abord. Cette posture-là elle crée plus de confiance que la performance sans apprentissage. T'as eu cette posture. Félicitations, [Prénom].
Avec éloge de ta posture d'apprentissage comme stratégie gagnante dans un premier poste,
— quelqu'un qui pense que cette posture t'a mis sur le bon pied dès le début 🌱` },
            { id: "fj25_s2_018", angle: "T\'assures et les gens autour de toi commencent à le voir.", body: `018. "T'assures et les gens autour de toi commencent à le voir."
La réputation se construit lentement. Par accumulation de petites preuves. Et les gens autour de toi commencent à avoir ces preuves. À avoir une image de toi. À savoir ce qu'ils peuvent attendre. Et ce qu'ils attendent de toi c'est du bon. Félicitations, [Prénom].
Avec observation du début de ta réputation professionnelle qui se construit autour de toi,
— quelqu'un qui voit cette construction en cours et qui confirme qu'elle va dans le bon sens 👀` },
            { id: "fj25_s2_019", angle: "Félicitations. No cap tu gères le monde réel mieux que tu le croyais.", body: `019. "Félicitations. No cap tu gères le monde réel mieux que tu le croyais."
T'avais peut-être des appréhensions. Des doutes sur ta capacité à fonctionner dans ce contexte. Et maintenant t'es dedans. Et tu t'en sors. Mieux que tu le pensais peut-être. Le monde réel était moins effrayant que tu l'imaginais et toi tu étais plus prêt que tu le croyais. Félicitations, [Prénom].
Avec invitation à noter l'écart entre tes appréhensions et la réalité en ta faveur,
— quelqu'un qui espère que tu enregistres ça pour les prochaines appréhensions 📝` },
            { id: "fj25_s2_020", angle: "No cap t\'assures dans le monde réel. C\'est dit. C\'est acté. C\'est mérité.", body: `020. "No cap t'assures dans le monde réel. C'est dit. C'est acté. C'est mérité."
Trois phrases. L'essentiel. Ta façon de fonctionner dans le monde réel est bonne. Ce constat est dit à voix haute. Il est acté par les faits. Il est mérité par tout ce que t'as mis dedans. Félicitations, [Prénom].
Avec acte officiel en trois phrases de ta réussite dans le monde réel,
— quelqu'un qui signe cet acte avec conviction et sans réserve ✅` },
          ],
        },
        {
          id: 'chelou',
          label: "C'est chelou d'être adulte mais tu gères",
          emoji: '🌀',
          messages: [
            { id: "fj25_s3_001", angle: "Félicitations. T\'es officiellement dans le monde du travail. C\'est chelou et c\'est bien.", body: `001. "Félicitations. T'es officiellement dans le monde du travail. C'est chelou et c'est bien."
Chelou dans le sens : hier t'étais encore dans un contexte d'apprentissage et aujourd'hui on te paie pour faire des trucs et des gens comptent sur ce que tu fais. Ce passage est rapide. Il est réel. Il est chelou. Et toi tu navigues dedans. Félicitations, [Prénom].
Avec validation de la chelou-ité de ce passage et de ta façon d'y naviguer,
— quelqu'un qui se souvient de ce sentiment et qui confirme que ça se normalise 🌀` },
            { id: "fj25_s3_002", angle: "C\'est chelou d\'avoir un contrat avec ton nom dessus. Et pourtant.", body: `002. "C'est chelou d'avoir un contrat avec ton nom dessus. Et pourtant."
Ce papier. Avec ton nom. Et une entreprise. Et des termes. Et une date de début. Et un salaire. Cette réalité concrète et contractuelle. C'est chelou à réaliser. Et pourtant c'est réel. Et c'est bien. Et c'est toi qui l'as obtenu. Félicitations, [Prénom].
Avec reconnaissance de la chelou-ité du contrat et de sa réalité concrète,
— quelqu'un qui pense que ce papier mérite d'être reconnu pour ce qu'il représente 📄` },
            { id: "fj25_s3_003", angle: "Félicitations. T\'as eu ta première fiche de paie. C\'est chelou et satisfaisant en même temps.", body: `003. "Félicitations. T'as eu ta première fiche de paie. C'est chelou et satisfaisant en même temps."
Ce moment précis. Voir son nom sur une fiche de paie. Avec un montant. Qui correspond à du travail fait. Pas à un virement parental. À du travail. C'est chelou. C'est satisfaisant. C'est les deux ensemble. Félicitations, [Prénom].
Avec reconnaissance de la chelou-ité satisfaisante de la première fiche de paie,
— quelqu'un qui se souvient de ce moment précis et de ce qu'il représentait 💶` },
            { id: "fj25_s3_004", angle: "T\'as réalisé que les adultes improvisent beaucoup. Et tu gères quand même.", body: `004. "T'as réalisé que les adultes improvisent beaucoup. Et tu gères quand même."
Le grand secret que personne dit. Les adultes improvisent. Beaucoup. Tout le monde fait semblant de savoir ce qu'il fait. Et progressivement on finit par vraiment savoir. T'as découvert ça. Et tu navigues dans cette réalité avec une assurance que beaucoup n'ont pas. Félicitations, [Prénom].
Avec révélation du grand secret de l'improvisation adulte et reconnaissance de ta navigation dedans,
— quelqu'un qui improvise aussi depuis des années et qui te confirme que c'est normal 🎭` },
            { id: "fj25_s3_005", angle: "Félicitations. T\'as géré tes premières réunions. C\'est un art à part entière.", body: `005. "Félicitations. T'as géré tes premières réunions. C'est un art à part entière."
Les réunions. Ces moments. Où il faut écouter. Intervenir au bon moment. Pas trop. Pas trop peu. Sembler engagé. Prendre des notes qui ont l'air pertinents. Comprendre ce qui se joue vraiment au-delà de ce qui se dit. T'as navigué dans ça. Félicitations, [Prénom].
Avec reconnaissance de la réunion comme art à part entière et de ta maîtrise en développement,
— quelqu'un qui pense que maîtriser les réunions est une compétence sous-estimée 🪑` },
            { id: "fj25_s3_006", angle: "C\'est chelou d\'avoir des collègues. Et tu t\'y fais.", body: `006. "C'est chelou d'avoir des collègues. Et tu t'y fais."
Ces gens. Avec qui tu passes plus de temps qu'avec certains amis. Que t'as pas choisis. Qui ont des vies et des personnalités et des habitudes. Et avec qui tu dois trouver un mode de fonctionnement. C'est chelou au début. Et t'y fais. Et tu gères. Félicitations, [Prénom].
Avec validation de la chelou-ité des collègues non choisis et de ton adaptation,
— quelqu'un qui pense que s'adapter à des gens non choisis est une compétence majeure 🤝` },
            { id: "fj25_s3_007", angle: "Félicitations. T\'as compris que le travail c\'est aussi de la politique.", body: `007. "Félicitations. T'as compris que le travail c'est aussi de la politique."
Pas de la mauvaise politique. De la navigation dans les relations. Dans les dynamiques. Dans qui compte pour qui. Dans comment les décisions se prennent vraiment. T'as commencé à comprendre ça. Et cette compréhension-là va te servir plus que n'importe quelle compétence technique. Félicitations, [Prénom].
Avec éloge de ta compréhension émergente de la dimension politique du travail,
— quelqu'un qui sait que cette compréhension est souvent ce qui fait la différence 🧠` },
            { id: "fj25_s3_008", angle: "C\'est chelou de pas pouvoir partir quand t\'as envie. Et tu gères.", body: `008. "C'est chelou de pas pouvoir partir quand t'as envie. Et tu gères."
Cette liberté perdue. De pouvoir juste partir. De décider que c'est assez pour aujourd'hui. Dans le travail y'a des horaires. Des engagements. Des gens qui attendent. T'as intégré ça. T'as adapté ton rapport au temps. Et tu gères. Félicitations, [Prénom].
Avec reconnaissance de l'adaptation à la contrainte horaire comme ajustement non trivial,
— quelqu'un qui sait que cette adaptation demande du temps et que tu l'as faite ⏰` },
            { id: "fj25_s3_009", angle: "Félicitations. T\'as survécu à ta première semaine. Et à toutes celles qui ont suivi.", body: `009. "Félicitations. T'as survécu à ta première semaine. Et à toutes celles qui ont suivi."
La première semaine. Intense. Déstabilisante. Pleine d'informations nouvelles. De visages nouveaux. De codes nouveaux. T'as survécu à ça. Et aux semaines suivantes. Et tu continues à survivre et à progresser. Félicitations, [Prénom].
Avec respect pour la survie à la première semaine et à toutes celles qui ont suivi,
— quelqu'un qui sait que la première semaine est souvent la plus difficile 🏁` },
            { id: "fj25_s3_010", angle: "C\'est chelou d\'être pris au sérieux par des adultes. Et tu t\'y habitues.", body: `010. "C'est chelou d'être pris au sérieux par des adultes. Et tu t'y habitues."
Ce moment. Où des gens avec plus d'expérience te demandent ton avis. Écoutent ce que tu dis. Considèrent ta perspective. C'est chelou au début. Comme si c'était pas pour toi. Et progressivement tu t'habitues à être pris au sérieux. Parce que tu le mérites. Félicitations, [Prénom].
Avec validation de la chelou-ité d'être pris au sérieux et de ton adaptation à ce statut,
— quelqu'un qui pense que tu mérites d'être pris au sérieux et qui est content que les autres le voient aussi 🌟` },
            { id: "fj25_s3_011", angle: "Félicitations. T\'as géré les trucs administratifs que personne t\'avait appris.", body: `011. "Félicitations. T'as géré les trucs administratifs que personne t'avait appris."
Ces trucs. Que l'école t'apprend pas. Les formulaires. Les procédures internes. Les outils spécifiques. Les façons de faire propres à chaque entreprise. T'as appris tout ça sur le tas. Sans manuel. En débrouillant. Félicitations, [Prénom].
Avec respect pour ton apprentissage autodidacte de tous les trucs administratifs non enseignés,
— quelqu'un qui pense que cette capacité à se débrouiller est plus précieuse qu'on ne le dit 🔧` },
            { id: "fj25_s3_012", angle: "C\'est chelou d\'avoir une messagerie professionnelle. Et tu t\'y fais.", body: `012. "C'est chelou d'avoir une messagerie professionnelle. Et tu t'y fais."
Cette adresse mail. Avec le nom de l'entreprise. Ces emails formels. Ce ton professionnel. Ces réponses qui doivent être réfléchies. Ce canal de communication qui a ses propres codes. C'est chelou au début. Et t'y fais. Et tes emails sont bons. Félicitations, [Prénom].
Avec reconnaissance de l'adaptation au code de la messagerie professionnelle,
— quelqu'un qui a lu tes emails et qui confirme que le ton est bien calibré 📧` },
            { id: "fj25_s3_013", angle: "Félicitations. T\'as appris à séparer ce que tu penses de ce que tu dis au travail.", body: `013. "Félicitations. T'as appris à séparer ce que tu penses de ce que tu dis au travail."
Cette compétence adulte essentielle. Avoir une pensée. Et choisir ce qu'on en exprime. Pas en mentant. En étant stratégique. En disant ce qui est utile à dire dans ce contexte. Cette maîtrise-là elle prend du temps. T'as commencé à l'acquérir. Félicitations, [Prénom].
Avec éloge de ta maîtrise croissante de ce qu'on dit et ce qu'on garde pour soi au travail,
— quelqu'un qui sait que cette compétence est une des plus importantes de la vie professionnelle 🤫` },
            { id: "fj25_s3_014", angle: "C\'est chelou d\'avoir des responsabilités vraies. Et tu les gères.", body: `014. "C'est chelou d'avoir des responsabilités vraies. Et tu les gères."
Des trucs qui dépendent de toi. Vraiment. Pas des exercices. Pas des simulations. Des trucs réels. Avec des conséquences réelles. T'as des responsabilités comme ça. Et tu les gères. Avec le sérieux que ça demande. Félicitations, [Prénom].
Avec respect pour ta gestion des responsabilités réelles dans le monde réel,
— quelqu'un qui voit que tu prends ces responsabilités au sérieux 💪` },
            { id: "fj25_s3_015", angle: "Félicitations. T\'as trouvé comment être toi dans un contexte professionnel.", body: `015. "Félicitations. T'as trouvé comment être toi dans un contexte professionnel."
Comment garder sa personnalité dans un contexte qui demande une certaine conformité. Comment être professionnel sans être faux. Comment s'adapter sans se trahir. T'as commencé à trouver cet équilibre. Et il te ressemble. Félicitations, [Prénom].
Avec admiration pour ton équilibre entre personnalité et professionnalisme,
— quelqu'un qui trouve que ta version professionnelle est authentique et c'est rare 🌿` },
            { id: "fj25_s3_016", angle: "C\'est chelou de rentrer le soir en ayant accompli des trucs pour une organisation.", body: `016. "C'est chelou de rentrer le soir en ayant accompli des trucs pour une organisation."
Cette fin de journée. Ce sentiment d'avoir contribué à quelque chose qui existait avant toi et qui continuera après toi. C'est chelou à intégrer. Cette façon d'être partie d'un truc plus grand que soi. Et tu t'y fais. Et ça a du sens. Félicitations, [Prénom].
Avec reconnaissance de la chelou-ité de contribuer à quelque chose de plus grand que soi,
— quelqu'un qui pense que cette contribution a du sens même quand elle semble petite 🏢` },
            { id: "fj25_s3_017", angle: "Félicitations. T\'as géré le syndrome de l\'imposteur. Au moins un peu.", body: `017. "Félicitations. T'as géré le syndrome de l'imposteur. Au moins un peu."
Ce sentiment. Que t'es pas à ta place. Que les autres vont s'en rendre compte. Que t'as pas les compétences qu'on croit que t'as. Tout le monde a ça dans un nouveau poste. T'as traversé ces moments. T'as continué malgré. Et les faits ont peu à peu contredit ce sentiment. Félicitations, [Prénom].
Avec validation du syndrome de l'imposteur comme universel et reconnaissance de ta traversée,
— quelqu'un qui a aussi eu ça et qui te confirme que les faits finissent par gagner 🧠` },
            { id: "fj25_s3_018", angle: "C\'est chelou d\'avoir une carte de visite ou un badge. Et c\'est satisfaisant.", body: `018. "C'est chelou d'avoir une carte de visite ou un badge. Et c'est satisfaisant."
Ce truc physique. Avec ton nom. Et un titre. Et le nom de l'entreprise. Cette matérialisation de ton appartenance à un truc. C'est chelou. C'est satisfaisant. Ces deux choses ensemble. Garde ce sentiment. Il s'estompe avec le temps mais il vaut la peine d'être savouré. Félicitations, [Prénom].
Avec invitation à savourer la chelou-ité satisfaisante de ce truc physique avant qu'il devienne banal,
— quelqu'un qui pense que ces petits symboles méritent d'être reconnus pour ce qu'ils représentent 🪪` },
            { id: "fj25_s3_019", angle: "Félicitations. T\'as réalisé que le monde du travail est humain.", body: `019. "Félicitations. T'as réalisé que le monde du travail est humain."
Pas une machine. Des humains. Avec leurs forces. Leurs faiblesses. Leurs bons jours et leurs mauvais. Leurs politiques et leurs générosités. Leurs rigidités et leurs souplesses. T'as commencé à voir ça. Cette réalité humaine du monde du travail. Félicitations, [Prénom].
Avec reconnaissance de ta compréhension de la dimension humaine du monde professionnel,
— quelqu'un qui pense que voir les gens comme des humains est la base de tout dans le travail 🌍` },
            { id: "fj25_s3_020", angle: "C\'est chelou d\'être adulte. Tu gères. No cap.", body: `020. "C'est chelou d'être adulte. Tu gères. No cap."
Le constat final. Simple. L'état adulte dans le monde du travail est chelou. C'est une nouvelle configuration. Et toi tu la gères. Pas parfaitement. Mais vraiment. Avec honnêteté et effort et une façon d'être qui dit que t'es à ta place. No cap. Félicitations, [Prénom].
Avec constat final simple direct et sans fioritures,
— quelqu'un qui pense que tu gères l'état adulte mieux que tu le crois ❤️` },
          ],
        },
        {
          id: 'galeres',
          label: "Les galères du taf on les traverse ensemble",
          emoji: '🫂',
          messages: [
            { id: "fj25_s4_001", angle: "Félicitations pour ce premier poste. Et solidarité pour les galères qui viennent avec.", body: `001. "Félicitations pour ce premier poste. Et solidarité pour les galères qui viennent avec."
Parce qu'il y en a. Toujours. Dans tout travail. Des galères de toutes tailles. Des petites irritantes. Des moyennes décourageantes. Des grandes qui remettent tout en question. Ces galères font partie du package. Et on les traverse ensemble. Félicitations, [Prénom].
Avec solidarité préventive pour toutes les galères du package travail,
— quelqu'un qui sera là pour les galères comme pour les réussites 🫂` },
            { id: "fj25_s4_002", angle: "Le taf c\'est pas toujours fun. Et c\'est ok de trouver ça dur parfois.", body: `002. "Le taf c'est pas toujours fun. Et c'est ok de trouver ça dur parfois."
Le discours ambiant dit que t'as de la chance d'avoir un poste. Que c'est une opportunité. Que tu devrais être content. Tout ça est vrai. Et en même temps certains jours c'est dur. Et c'est ok de trouver ça dur. Ces deux vérités coexistent. Félicitations, [Prénom].
Avec validation que trouver le travail dur parfois coexiste avec la gratitude d'en avoir un,
— quelqu'un qui refuse de te faire culpabiliser pour les jours difficiles 💙` },
            { id: "fj25_s4_003", angle: "Félicitations. Et si y\'a un collègue difficile sache que ça arrive partout.", body: `003. "Félicitations. Et si y'a un collègue difficile sache que ça arrive partout."
Le collègue difficile. C'est presque universel. Chaque environnement de travail a son archétype. Sa façon particulière d'être difficile. T'as peut-être déjà rencontré le tien. T'as peut-être pas encore. Dans tous les cas c'est pas personnel. C'est le travail. Félicitations, [Prénom].
Avec préparation amicale à la rencontre du collègue difficile si pas encore faite,
— quelqu'un qui a les siens et qui partage ses stratégies de cohabitation 😬` },
            { id: "fj25_s4_004", angle: "Les jours où t\'as pas envie d\'y aller ça arrive à tout le monde.", body: `004. "Les jours où t'as pas envie d'y aller ça arrive à tout le monde."
Ces matins. Ces dimanches soirs. Ces moments où la perspective du lendemain est lourde. Ces trucs-là arrivent à tout le monde dans tout travail. Même dans le meilleur. Même dans celui qu'on a choisi avec soin. C'est humain. C'est pas un signal que quelque chose va pas. C'est juste humain. Félicitations, [Prénom].
Avec validation des jours sans envie comme universels et non signaux d'alarme,
— quelqu'un qui a aussi ces jours et qui te confirme qu'ils passent 🌧️` },
            { id: "fj25_s4_005", angle: "Félicitations. Et si tu te plantes sur un truc c\'est pas la fin.", body: `005. "Félicitations. Et si tu te plantes sur un truc c'est pas la fin."
Cette peur du premier plantage. Cette pression de ne pas se tromper. De tout faire bien dès le début. Tu vas te planter sur des trucs. C'est inévitable. Et ce n'est pas la fin. C'est de l'information. C'est de l'apprentissage. C'est de la construction. Félicitations, [Prénom].
Avec préparation au premier plantage et réassurance sur son statut de non-fin,
— quelqu'un qui s'est planté et qui confirme que la vie continue et s'améliore 🔧` },
            { id: "fj25_s4_006", angle: "Les réunions inutiles c\'est une galère universelle. T\'es pas seul.", body: `006. "Les réunions inutiles c'est une galère universelle. T'es pas seul."
Ces réunions. Qui auraient pu être des emails. Qui durent trop longtemps. Dont tu sors pas sûr de savoir ce qui a été décidé. Ces réunions sont une galère partagée par tous. T'es en bonne compagnie dans cette galère. Solidarité totale. Félicitations, [Prénom].
Avec solidarité totale pour la galère universelle des réunions inutiles,
— quelqu'un qui a fait une thèse mentale sur les réunions qui auraient pu être des emails 🪑` },
            { id: "fj25_s4_007", angle: "Félicitations. Et si tu te demandes si t\'es à ta place c\'est normal.", body: `007. "Félicitations. Et si tu te demandes si t'es à ta place c'est normal."
Ce questionnement. Est-ce que c'est bien pour moi. Est-ce que je suis au bon endroit. Est-ce que c'est la bonne direction. Ces questions arrivent à tout le monde dans un premier poste. Elles sont utiles. Elles signalent que tu réfléchis. Elles méritent d'être entendues pas ignorées. Félicitations, [Prénom].
Avec validation des questionnements sur sa place comme normaux et utiles,
— quelqu'un qui pense que ces questions méritent d'être entendues et explorées 🧭` },
            { id: "fj25_s4_008", angle: "La fatigue du taf c\'est différente des autres fatigues. Et c\'est réel.", body: `008. "La fatigue du taf c'est différente des autres fatigues. Et c'est réel."
Cette fatigue de fin de journée de travail. Qui n'est pas la fatigue physique. Ni la fatigue de la révision. Une fatigue particulière. Mentale. Relationnelle. Cette fatigue-là est réelle et légitime. Et se reposer de cette fatigue-là c'est nécessaire. Félicitations, [Prénom].
Avec validation de la fatigue professionnelle comme spécifique et légitime,
— quelqu'un qui te dit que se reposer de cette fatigue est une nécessité pas un luxe 😴` },
            { id: "fj25_s4_009", angle: "Félicitations. Et les galères administratives du travail on les traverse ensemble.", body: `009. "Félicitations. Et les galères administratives du travail on les traverse ensemble."
Les formulaires. Les process internes. Les outils qui marchent pas. Les procédures kafkaïennes. Les emails qui restent sans réponse. Ces galères administratives font partie du quotidien de tout travail. Et on les traverse. À plusieurs c'est plus supportable. Félicitations, [Prénom].
Avec solidarité pour toutes les galères administratives du quotidien professionnel,
— quelqu'un qui a ses propres stories administratives et qui les partage volontiers 📋` },
            { id: "fj25_s4_010", angle: "Les trucs injustes au travail ça arrive. Et c\'est ok d\'être énervé.", body: `010. "Les trucs injustes au travail ça arrive. Et c'est ok d'être énervé."
Ces moments. Où quelque chose est clairement injuste. Où le mérite n'est pas reconnu. Où les règles s'appliquent inégalement. Être énervé par l'injustice c'est normal. C'est même sain. Ce qui compte c'est comment on gère cet énervement. Et ça on l'apprend avec le temps. Félicitations, [Prénom].
Avec validation de l'énervement face à l'injustice comme réaction normale et saine,
— quelqu'un qui a ses propres stories d'injustice et qui partage ses stratégies de gestion 🌊` },
            { id: "fj25_s4_011", angle: "Félicitations. Et si le travail te prend trop de place parfois c\'est une information.", body: `011. "Félicitations. Et si le travail te prend trop de place parfois c'est une information."
Ces périodes où le travail occupe tout. Où t'as plus d'énergie pour autre chose. Où les frontières entre travail et vie disparaissent. Ces périodes sont une information. Sur les limites. Sur ce qui est soutenable. Sur ce qui mérite d'être ajusté. Écoute cette information. Félicitations, [Prénom].
Avec invitation à écouter les signaux quand le travail prend trop de place,
— quelqu'un qui pense que ces signaux méritent d'être pris au sérieux très tôt 🚦` },
            { id: "fj25_s4_012", angle: "Les feedbacks durs ça fait mal. Et ça passe. Et ça construit.", body: `012. "Les feedbacks durs ça fait mal. Et ça passe. Et ça construit."
Ce moment. Où on te dit quelque chose de difficile sur ton travail. Ou sur ta façon de faire. Ça fait mal. C'est désagréable. Et ça passe. Et derrière la douleur y'a quelque chose d'utile si on arrive à le voir. Ces feedbacks durs sont souvent les plus formateurs. Félicitations, [Prénom].
Avec préparation aux feedbacks durs et perspective sur ce qu'ils construisent,
— quelqu'un qui a reçu des feedbacks durs et qui confirme le processus douleur-construction 🪞` },
            { id: "fj25_s4_013", angle: "Félicitations. Et les galères de deadline on les connaît tous.", body: `013. "Félicitations. Et les galères de deadline on les connaît tous."
Ces fins de projet. Ces deadlines qui approchent. Ces nuits à finir un truc. Cette pression du délai. Ces moments où le temps est l'ennemi. Ces galères-là sont universelles. Tout le monde les vit. Et tout le monde survit. Et t'en sortiras aussi. Félicitations, [Prénom].
Avec solidarité universelle pour les galères de deadline,
— quelqu'un qui a ses propres cicatrices de deadline et qui confirme que ça passe 🕐` },
            { id: "fj25_s4_014", angle: "Y\'a des jours où tout va bien et des jours où rien va. Les deux font partie du truc.", body: `014. "Y'a des jours où tout va bien et des jours où rien va. Les deux font partie du truc."
Cette alternance. Ces jours de flow où tout s'enchaîne. Et ces jours où rien avance. Où tout est lourd. Où l'énergie manque. Les deux font partie de la réalité du travail. Les bons jours sont pas acquis et les mauvais sont pas permanents. Les deux passent. Félicitations, [Prénom].
Avec perspective sur l'alternance normale des bons et des mauvais jours dans tout travail,
— quelqu'un qui pense que reconnaître cette alternance comme normale change tout 🌤️` },
            { id: "fj25_s4_015", angle: "Félicitations. Et si tu te sens seul dans une galère dis-le.", body: `015. "Félicitations. Et si tu te sens seul dans une galère dis-le."
La tendance à garder les galères pour soi. À faire semblant que ça va. À pas montrer que c'est difficile. Cette tendance est compréhensible. Et elle isole. Dire quand c'est dur. Demander de l'aide. Ces trucs changent tout. Et les gens autour de toi sont disponibles pour ça. Félicitations, [Prénom].
Avec invitation explicite à dire quand c'est dur plutôt que de garder ça pour soi,
— quelqu'un qui est disponible pour ces moments et qui le dit clairement 🤝` },
            { id: "fj25_s4_016", angle: "Les comparaisons avec les autres c\'est une galère mentale à éviter.", body: `016. "Les comparaisons avec les autres c'est une galère mentale à éviter."
Cette tendance. À se comparer aux autres. Qui semblent avancer plus vite. Qui semblent avoir trouvé mieux. Qui semblent avoir tout compris. Ces comparaisons sont une galère mentale auto-infligée. Tout le monde improvise. Tout le monde galère. Juste différemment. Félicitations, [Prénom].
Avec mise en garde contre les comparaisons comme galère mentale à éviter,
— quelqu'un qui se bat contre cette tendance lui-même et qui partage ses stratégies 📊` },
            { id: "fj25_s4_017", angle: "Félicitations. Et les galères de la vie d\'adulte au travail on les traverse ensemble.", body: `017. "Félicitations. Et les galères de la vie d'adulte au travail on les traverse ensemble."
La vie d'adulte au travail c'est un ensemble. Le travail lui-même. Et tout ce qui vient avec. Les trucs pratiques. Les impôts. Les cotisations. Les papiers. Les trucs qui s'accumulent. Les galères sont réelles. Et on les traverse. À plusieurs. Ensemble. Félicitations, [Prénom].
Avec solidarité pour l'ensemble des galères de la vie adulte au travail,
— quelqu'un qui est disponible pour les galères grandes et petites 🫂` },
            { id: "fj25_s4_018", angle: "Y\'a des moments où tu te demanderas si t\'as fait le bon choix. C\'est normal.", body: `018. "Y'a des moments où tu te demanderas si t'as fait le bon choix. C'est normal."
Ce questionnement sur le bon choix. Sur la bonne voie. Sur si t'es là où tu devrais être. Ces questions arrivent. Dans tout travail. Même dans le meilleur choix. Elles signalent que tu réfléchis à ta vie. Elles méritent d'être entendues et explorées avec soin. Félicitations, [Prénom].
Avec validation du questionnement sur le bon choix comme normal et utile à explorer,
— quelqu'un qui pense que ces questions méritent d'être prises au sérieux sans panique 🧭` },
            { id: "fj25_s4_019", angle: "Félicitations. Et quand ça va pas tu peux le dire. On est là.", body: `019. "Félicitations. Et quand ça va pas tu peux le dire. On est là."
Message simple. Direct. Quand ça va pas. Quand c'est difficile. Quand t'as besoin de parler. Quand t'as besoin d'être écouté. On est là. Pas juste pour les félicitations. Pour les galères aussi. Pour les deux. Pour tout. Félicitations, [Prénom].
Avec disponibilité explicite et sans condition pour les galères autant que pour les réussites,
— quelqu'un qui sera là pour les deux et qui te le dit clairement 💛` },
            { id: "fj25_s4_020", angle: "Les galères du taf on les traverse ensemble. No cap. Pour toute la suite.", body: `020. "Les galères du taf on les traverse ensemble. No cap. Pour toute la suite."
Engagement. Pour la suite. Pas juste pour maintenant. Pour tous les postes. Toutes les galères. Tous les questionnements. Toutes les difficultés qui vont venir. On les traverse ensemble. C'est une promesse. Félicitations, [Prénom].
Avec promesse de solidarité pour toute la suite de ta vie professionnelle,
— quelqu'un qui s'engage pour les galères à venir autant que pour les réussites ❤️` },
          ],
        },
        {
          id: 'move',
          label: "C'est pas le move le monde du travail mais on t'aime",
          emoji: '💛',
          messages: [
            { id: "fj25_s5_001", angle: "Félicitations. Le monde du travail c\'est pas le move. T\'es dedans quand même.", body: `001. "Félicitations. Le monde du travail c'est pas le move. T'es dedans quand même."
C'est honnête de le dire. Le monde du travail avec toutes ses absurdités. Ses réunions inutiles. Ses process kafkaïens. Ses dynamiques parfois bizarres. C'est pas toujours le move. Et t'es dedans. Et tu navigues. Et on t'aime dans cette navigation. Félicitations, [Prénom].
Avec honnêteté sur les absurdités du monde du travail et amour pour ta navigation dedans,
— quelqu'un qui est aussi dans ce monde et qui confirme que c'est chelou mais gérable 🌀` },
            { id: "fj25_s5_002", angle: "T\'as découvert que certaines règles au travail ont pas de logique apparente.", body: `002. "T'as découvert que certaines règles au travail ont pas de logique apparente."
Ces règles. Ces process. Ces façons de faire instituées depuis longtemps. Dont personne sait vraiment l'origine. Dont tout le monde suit quand même. T'as découvert ça. T'as eu l'air choqué peut-être. Ou résigné. C'est une étape normale de l'entrée dans le monde du travail. Félicitations, [Prénom].
Avec validation de ta découverte des règles sans logique apparente comme étape normale,
— quelqu'un qui en a encore beaucoup à te révéler sur ce sujet 😅` },
            { id: "fj25_s5_003", angle: "Félicitations. Le monde du travail a des codes absurdes. T\'as appris à les jouer.", body: `003. "Félicitations. Le monde du travail a des codes absurdes. T'as appris à les jouer."
Ces codes. Ce vocabulaire. Ces façons de formuler. Ce théâtre social particulier au monde professionnel. T'as appris à jouer ce jeu. Pas en étant faux. En comprenant les règles. En choisissant comment y participer. Cette maîtrise-là c'est une compétence réelle. Félicitations, [Prénom].
Avec éloge de ta maîtrise des codes absurdes du monde du travail,
— quelqu'un qui pense que maîtriser les codes absurdes est une forme d'intelligence 🎭` },
            { id: "fj25_s5_004", angle: "Y\'a des trucs au travail qui sont clairement pas le move. Et tu les gères quand même.", body: `004. "Y'a des trucs au travail qui sont clairement pas le move. Et tu les gères quand même."
Ces trucs précis. Ces décisions prises au-dessus de toi. Ces choses imposées sans concertation. Ces absurdités organisationnelles. Tu les vois. Tu les nommes entre personnes de confiance. Et tu continues. C'est de la maturité. C'est du professionnalisme. Félicitations, [Prénom].
Avec respect pour ta façon de voir les absurdités sans te laisser paralyser par elles,
— quelqu'un qui a les siennes et qui partage cette gestion silencieuse avec toi 🤫` },
            { id: "fj25_s5_005", angle: "Félicitations. T\'as appris que le bullshit professionnel est une langue à part.", body: `005. "Félicitations. T'as appris que le bullshit professionnel est une langue à part."
Ce vocabulaire. Ces synergies. Ces disruptions. Ces agilités. Ces valeurs d'entreprise. Cette langue du monde professionnel qui dit des trucs qui veulent dire autre chose ou rien du tout. T'as appris à la décoder. Et parfois à la parler. C'est une compétence de survie. Félicitations, [Prénom].
Avec reconnaissance de ta maîtrise croissante de la langue du bullshit professionnel,
— quelqu'un qui a un dictionnaire complet de cette langue et qui le partage volontiers 📖` },
            { id: "fj25_s5_006", angle: "Le management c\'est pas toujours le move. Et t\'apprends à naviguer quand même.", body: `006. "Le management c'est pas toujours le move. Et t'apprends à naviguer quand même."
Les managers. Certains brillants. Certains moins. Certains qui auraient pas dû manager. Ces managers-là ils existent partout. T'as peut-être déjà rencontré tes premiers. Et t'apprends à naviguer avec. C'est une compétence que tu développeras toute ta vie. Félicitations, [Prénom].
Avec préparation à la diversité des qualités managériales et à la navigation dans cette diversité,
— quelqu'un qui a ses histoires de management et qui les partage volontiers 🧭` },
            { id: "fj25_s5_007", angle: "Félicitations. T\'as survécu à ton premier team building.", body: `007. "Félicitations. T'as survécu à ton premier team building."
Ce moment. Ce team building. Avec ces activités. Ces jeux de cohésion. Ces trucs censés créer du lien entre des gens qui travaillent ensemble. T'as peut-être adoré. T'as peut-être pas. Dans tous les cas t'as participé. Avec plus ou moins d'enthousiasme. Et t'en es sorti vivant. Félicitations, [Prénom].
Avec solidarité pour la traversée du premier team building dans toute sa gloire,
— quelqu'un qui a ses propres stories de team building et qui les partage 🏓` },
            { id: "fj25_s5_008", angle: "Les emails professionnels c\'est un art pas toujours le move. Et tu l\'apprends.", body: `008. "Les emails professionnels c'est un art pas toujours le move. Et tu l'apprends."
Ces emails. Ces formulations. Veuillez trouver ci-joint. En espérant que ce message vous trouve bien. Suite à notre conversation téléphonique. Ces formules rituelles. Ce théâtre épistolaire professionnel. C'est pas le move dans l'absolu. C'est le code. Et tu l'apprends. Félicitations, [Prénom].
Avec solidarité pour l'apprentissage des formulations professionnelles pas toujours le move,
— quelqu'un qui utilise ces formules depuis des années et qui s'y est fait 📧` },
            { id: "fj25_s5_009", angle: "Félicitations. T\'as compris que le monde du travail est parfois absurde et que c\'est ok.", body: `009. "Félicitations. T'as compris que le monde du travail est parfois absurde et que c'est ok."
L'acceptation des absurdités organisationnelles comme partie intégrante de la réalité. Pas pour les cautionner. Pour ne pas perdre d'énergie à les combattre toutes. Choisir ses batailles. Accepter le reste. Cette sagesse-là se construit avec le temps. T'y es déjà. Félicitations, [Prénom].
Avec reconnaissance de ta sagesse émergente sur le choix des batailles,
— quelqu'un qui pense que cette sagesse est une des plus précieuses dans la vie professionnelle 🧘` },
            { id: "fj25_s5_010", angle: "Le monde du travail est pas parfait. T\'y apportes quand même quelque chose de bien.", body: `010. "Le monde du travail est pas parfait. T'y apportes quand même quelque chose de bien."
Avec tout ce qui est pas le move dans ce monde. Ses absurdités. Ses injustices parfois. Ses rigidités. Toi tu y apportes quelque chose. Ta façon d'être. Ta façon de traiter les gens. Tes valeurs. Cette contribution-là est réelle même si elle est invisible. Félicitations, [Prénom].
Avec reconnaissance de ta contribution au monde du travail malgré ses imperfections,
— quelqu'un qui pense que chaque personne qui y apporte du bien compte 🌱` },
            { id: "fj25_s5_011", angle: "Félicitations. T\'as géré des réunions qui auraient pu être des emails.", body: `011. "Félicitations. T'as géré des réunions qui auraient pu être des emails."
Ces réunions. Convoquées. Avec ordre du jour. Qui auraient été plus efficaces en deux phrases par mail. T'as participé. T'as contribué. T'as semblé engagé. T'as survécu. Et t'as probablement envoyé l'email qui résumait tout à la fin. Félicitations, [Prénom].
Avec solidarité pour toutes les réunions qui auraient pu être des emails,
— quelqu'un qui milite silencieusement depuis des années pour plus d'emails et moins de réunions 📧` },
            { id: "fj25_s5_012", angle: "Y\'a des jours où le monde du travail est vraiment pas le move. C\'est ok de le penser.", body: `012. "Y'a des jours où le monde du travail est vraiment pas le move. C'est ok de le penser."
Ces journées. Où tout semble absurde. Où les priorités semblent inversées. Où les décisions prises font pas sens. Ces journées arrivent. Et penser que c'est pas le move ces jours-là c'est une réaction normale et honnête. Ce qui compte c'est ce qu'on en fait. Félicitations, [Prénom].
Avec validation de la pensée que c'est pas le move comme réaction normale les mauvais jours,
— quelqu'un qui pense la même chose certains jours et qui te confirme que c'est humain 🌧️` },
            { id: "fj25_s5_013", angle: "Félicitations. T\'as appris à sourire dans des situations qui méritaient pas le sourire.", body: `013. "Félicitations. T'as appris à sourire dans des situations qui méritaient pas le sourire."
Cette compétence professionnelle. Répondre poliment à quelque chose d'irritant. Sourire dans une réunion ennuyeuse. Paraître engagé dans une tâche répétitive. Cette façon de maintenir une façade professionnelle. C'est de l'endurance sociale. Et tu l'as développée. Félicitations, [Prénom].
Avec reconnaissance de ton endurance sociale comme compétence professionnelle réelle,
— quelqu'un qui pratique aussi cet art et qui partage cette solidarité du sourire forcé 😊` },
            { id: "fj25_s5_014", angle: "Le monde du travail a ses propres politiques. C\'est pas toujours le move. Tu navigues.", body: `014. "Le monde du travail a ses propres politiques. C'est pas toujours le move. Tu navigues."
Ces politiques internes. Ces dynamiques de pouvoir. Ces alliances. Ces non-dits. Cette carte politique de chaque entreprise qui prend du temps à comprendre. T'as commencé à la cartographier. Et tu navigues dedans avec une intelligence que tu développeras toute ta vie. Félicitations, [Prénom].
Avec reconnaissance de ta navigation dans les politiques internes comme compétence en développement,
— quelqu'un qui pense que cette compétence est souvent plus importante que les compétences techniques 🗺️` },
            { id: "fj25_s5_015", angle: "Félicitations. T\'as gardé tes valeurs dans un monde qui teste les valeurs.", body: `015. "Félicitations. T'as gardé tes valeurs dans un monde qui teste les valeurs."
Le monde du travail teste les valeurs. Y'a des pressions. Des incitations à faire des trucs qui sont pas toujours alignés. Des situations qui demandent de choisir entre ce qui est commode et ce qui est juste. T'as gardé tes valeurs. Ça ne va pas toujours de soi. Félicitations, [Prénom].
Avec respect pour ta façon de garder tes valeurs dans un monde qui les teste,
— quelqu'un qui pense que cette résistance est une des formes de courage les plus courantes et les moins vues 🧭` },
            { id: "fj25_s5_016", angle: "C\'est pas le move le monde du travail. Et t\'y trouves quand même des trucs bien.", body: `016. "C'est pas le move le monde du travail. Et t'y trouves quand même des trucs bien."
Malgré tout. Malgré les absurdités. Les réunions inutiles. Les process kafkaïens. Y'a des trucs bien. Des collègues qui deviennent des amis. Des projets qui ont du sens. Des moments de vraie satisfaction. Des apprentissages réels. Ces trucs bien existent. Ils valent d'être cherchés. Félicitations, [Prénom].
Avec invitation à chercher et reconnaître les trucs bien malgré les pas le move,
— quelqu'un qui pense que ces trucs bien existent dans tout travail et qu'ils méritent d'être vus 🌟` },
            { id: "fj25_s5_017", angle: "Félicitations. T\'as développé un rapport sain à ce que tu contrôles et ce que tu contrôles pas.", body: `017. "Félicitations. T'as développé un rapport sain à ce que tu contrôles et ce que tu contrôles pas."
Ce que tu contrôles. Ta façon de travailler. Ton attitude. Tes efforts. Ce que tu contrôles pas. Les décisions au-dessus de toi. Les comportements des autres. Les absurdités organisationnelles. T'as commencé à faire cette distinction. C'est une des clés de la santé mentale au travail. Félicitations, [Prénom].
Avec éloge de ta distinction croissante entre ce tu contrôles et ce que tu contrôles pas,
— quelqu'un qui pense que cette distinction est fondamentale pour tenir sur la longueur 🔑` },
            { id: "fj25_s5_018", angle: "Le monde du travail c\'est pas le move parfois. Et on en rit ensemble.", body: `018. "Le monde du travail c'est pas le move parfois. Et on en rit ensemble."
Parce que rire des absurdités c'est une façon de les traverser. Ces histoires qu'on raconte. Ces situations improbables qu'on partage. Ces moments d'absurde collectif. Rire ensemble de ce qui est pas le move dans le monde du travail c'est de la solidarité. Et c'est précieux. Félicitations, [Prénom].
Avec invitation à rire ensemble des absurdités plutôt que de les subir seul,
— quelqu'un qui a un stock d'histoires absurdes du monde du travail et qui attend le tien 😄` },
            { id: "fj25_s5_019", angle: "Félicitations. C\'est pas le move le monde du travail. Et t\'as quand même trouvé ta place dedans.", body: `019. "Félicitations. C'est pas le move le monde du travail. Et t'as quand même trouvé ta place dedans."
Malgré tout. Avec tout ce qui est pas le move. T'as trouvé une façon d'être là. De contribuer. D'exister professionnellement. Cette façon d'être à sa place dans un monde imparfait c'est quelque chose. C'est même beaucoup. Félicitations, [Prénom].
Avec reconnaissance de ta façon de trouver ta place dans un monde imparfait,
— quelqu'un qui pense que trouver sa place dans un monde imparfait est la définition de réussir 🏠` },
            { id: "fj25_s5_020", angle: "C\'est pas le move le monde du travail. On t\'aime dedans. No cap. Pour toute la suite.", body: `020. "C'est pas le move le monde du travail. On t'aime dedans. No cap. Pour toute la suite."
Déclaration finale. Le monde du travail avec toutes ses imperfections. Et toi dedans. Et on t'aime. Pas malgré les galères. Avec. Pas malgré les absurdités. Dans. Pour toute la suite. Pour tous les postes. Pour toutes les navigations à venir. No cap. Félicitations, [Prénom].
Avec déclaration d'amour inconditionnel pour toute la suite de ta vie professionnelle,
— quelqu'un qui sera là pour les absurdités et les réussites pour toute la suite ❤️` },
          ],
        },
    ],
  },
];
