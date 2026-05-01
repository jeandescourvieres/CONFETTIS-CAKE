-- Templates système pour toutes les occasions (hors birthday et nameday déjà présents)

INSERT INTO message_templates (user_id, title, content, tone, is_system, occasion) VALUES

-- ── Mariage ──────────────────────────────────────────────────────────────────
(NULL, '💍 Romantique',         'Quelle belle journée pour célébrer votre amour, {prenom} ! Que votre union soit aussi lumineuse que ce jour magnifique. Je vous souhaite une vie remplie de bonheur, de rires et de complicité. Avec tout mon amour. 💍', 'touching', true, 'wedding'),
(NULL, '🥹 Émouvant',           '{prenom}, aujourd''hui vous dites "oui" à une vie entière ensemble. C''est un bonheur immense de partager ce moment avec vous. Que chaque jour de votre vie commune soit aussi merveilleux que celui-ci. 💛', 'touching', true, 'wedding'),
(NULL, '😄 Joyeux',             'Alors {prenom}, c''est le grand saut ! 😄 Je vous souhaite une vie de couple pleine de surprises, de fous rires et de moments inoubliables. Que l''aventure commence ! 🎉', 'humorous', true, 'wedding'),
(NULL, '🌸 Poétique',           'Aujourd''hui deux cœurs s''unissent, {prenom}. Que votre amour grandisse à chaque saison qui passe, que votre bonheur soit aussi infini que le ciel au-dessus de vous. Tout mon amour vous accompagne. 🌸', 'poetic', true, 'wedding'),
(NULL, '⭐ Court & Percutant',  'Félicitations {prenom} ! Que cette belle union soit le début d''une aventure extraordinaire. Tout mon bonheur pour vous deux ! 💍', 'short', true, 'wedding'),

-- ── Fiançailles ───────────────────────────────────────────────────────────────
(NULL, '💎 Romantique',         'Quelle magnifique nouvelle, {prenom} ! Vos fiançailles sont la promesse d''une belle aventure à deux. Que cet amour continue de grandir et que votre futur soit aussi brillant que le diamant de votre bague. Félicitations de tout cœur ! 💎', 'touching', true, 'engagement'),
(NULL, '🎉 Joyeux',             '{prenom}, c''est officiel — vous avez trouvé votre plus belle moitié ! 🎉 Toutes mes félicitations pour vos fiançailles. Que cette belle promesse d''amour soit le début de votre plus belle histoire. 💛', 'humorous', true, 'engagement'),
(NULL, '🥹 Touchant',           '{prenom}, apprendre vos fiançailles m''a rempli le cœur de joie. Vous méritez tout le bonheur du monde. Que cet engagement soit le début d''une vie entière partagée dans l''amour et la complicité. 💍✨', 'touching', true, 'engagement'),
(NULL, '🌸 Poétique',           'Deux âmes qui se choisissent, c''est la plus belle des histoires, {prenom}. Vos fiançailles annoncent un avenir radieux — qu''il soit doux, lumineux et rempli de tout ce qui compte vraiment. 🌸', 'poetic', true, 'engagement'),
(NULL, '⚡ Court & Percutant',  'Félicitations {prenom} ! Quel bonheur d''apprendre vos fiançailles. Le bonheur vous attend. 💎🎉', 'short', true, 'engagement'),

-- ── Naissance ─────────────────────────────────────────────────────────────────
(NULL, '👶 Émerveillé',         'Bienvenue dans ce monde, petit·e {prenom} ! 👶 Quelle joie d''apprendre cette merveilleuse nouvelle. Je souhaite à ce beau bébé une vie remplie d''amour, de découvertes et de bonheur. Félicitations aux heureux parents ! 🌟', 'touching', true, 'birth'),
(NULL, '🥹 Touchant',           'Un bébé, c''est un miracle qui change tout. Félicitations {prenom} ! Que cette nouvelle vie apporte une lumière incroyable dans votre famille. Je vous souhaite de beaux moments de tendresse et de complicité. 💛👶', 'touching', true, 'birth'),
(NULL, '😄 Joyeux',             'Alors {prenom}, bienvenue dans le club des parents ! 😄 Les nuits sans sommeil sont commencées, mais avec elles arrivent aussi les plus beaux sourires du monde. Félicitations et bon courage ! 🍼', 'humorous', true, 'birth'),
(NULL, '🌸 Poétique',           'Un tout petit être vient de faire son entrée dans ce grand monde, {prenom}. Qu''il/elle grandisse entouré·e d''amour, de douceur et de mille belles choses à découvrir. Toutes mes félicitations. 🌸', 'poetic', true, 'birth'),
(NULL, '⭐ Court & Percutant',  'Félicitations {prenom} ! L''arrivée de ce bébé est une joie immense. Je vous souhaite de merveilleux moments en famille. 👶💛', 'short', true, 'birth'),

-- ── Baptême ───────────────────────────────────────────────────────────────────
(NULL, '🕊️ Doux & Spirituel',   'Quel beau jour de lumière et de grâce pour la famille de {prenom} ! Que ce baptême soit le début d''un chemin de vie entouré de bienveillance et d''amour. Je vous souhaite une belle célébration. 🕊️✨', 'touching', true, 'baptism'),
(NULL, '💛 Chaleureux',          'Bienvenue dans cette grande famille, {prenom} ! Ce jour de baptême est un moment de joie et de paix que je partage avec vous de tout cœur. Que cet enfant grandisse entouré d''amour et de bienveillance. 💛🌿', 'touching', true, 'baptism'),
(NULL, '🌿 Nature & Épuré',      'Ce beau jour de baptême restera gravé dans les cœurs de toute la famille. Je vous adresse mes vœux les plus sincères pour {prenom} — que la lumière guide chacun de ses pas. 🌿💫', 'poetic', true, 'baptism'),
(NULL, '✨ Solennel',             'Félicitations pour le baptême de {prenom}. Que cette belle journée soit le début d''un chemin de vie plein de grâce, d''amour et de sérénité. Avec toute mon affection. ✝️🕊️', 'professional', true, 'baptism'),
(NULL, '💫 Céleste',             'Que ce baptême soit comme une étoile qui commence à briller, {prenom}. Je vous souhaite à tous une journée remplie de tendresse et de bonheur partagé. 💫🌸', 'poetic', true, 'baptism'),

-- ── Communion ─────────────────────────────────────────────────────────────────
(NULL, '✝️ Solennel & Tendre',   'Quelle belle étape dans ta vie, {prenom} ! Ta communion est un moment unique que tu porteras toujours dans ton cœur. Je te souhaite une journée remplie de joie, de paix et de tendresse entouré·e de ceux qui t''aiment. 💛✝️', 'touching', true, 'communion'),
(NULL, '🌿 Bienveillant',        '{prenom}, en ce jour de communion, je pense à toi avec beaucoup d''affection. Tu grandis si bien — que cette belle journée soit un souvenir précieux que tu chériras toute ta vie. 🌿💫', 'touching', true, 'communion'),
(NULL, '✨ Doré & Élégant',       'Félicitations pour ta communion, {prenom}. C''est un jour important, plein de lumière et de sens. Je te souhaite une belle cérémonie entourée de ceux qui t''aiment. Avec toute mon affection. ✨', 'professional', true, 'communion'),
(NULL, '🕊️ Doux',                'Ce jour de communion est un moment de grâce, {prenom}. Que la paix et la bienveillance t''accompagnent sur ton chemin. Je suis là pour toi, aujourd''hui et toujours. 🕊️💛', 'poetic', true, 'communion'),
(NULL, '💛 Chaleureux',           '{prenom}, ta communion est un beau moment dans ta vie. Je te souhaite une journée douce et joyeuse, entourée de ta famille et de tes proches. Avec tout mon amour. 💛🌸', 'touching', true, 'communion'),

-- ── Diplôme ───────────────────────────────────────────────────────────────────
(NULL, '🎓 Fier & Enthousiaste', 'Félicitations {prenom} ! Ce diplôme, c''est le résultat de tout ton travail, ta persévérance et ta détermination. Tu peux être fier·e — et je le suis pour toi. Que cette belle réussite ouvre de magnifiques portes ! 🎓🌟', 'touching', true, 'graduation'),
(NULL, '😄 Humoristique',        'Alors {prenom}, plus d''excuses pour rester au lit ! 😄 Ce diplôme en poche, le monde s''ouvre à toi. Félicitations pour ce bel accomplissement — la suite s''annonce encore plus belle ! 🚀', 'humorous', true, 'graduation'),
(NULL, '🥹 Touchant',            '{prenom}, je te regarde grandir et réussir, et mon cœur déborde de fierté. Ce diplôme est le symbole de tout ce que tu es — courageux·se, travailleur·se, brillant·e. Bravo du fond du cœur. 💛', 'touching', true, 'graduation'),
(NULL, '🌟 Inspirant',           'Félicitations {prenom} ! Chaque effort que tu as fourni t''a mené jusqu''ici. Ce diplôme n''est pas une fin, c''est un tremplin vers tout ce que tu vas accomplir. L''avenir est à toi ! 🌟🎓', 'touching', true, 'graduation'),
(NULL, '⚡ Court & Percutant',   'Bravo {prenom} ! Ce diplôme, tu le mérites amplement. Que ce beau succès soit le premier d''une longue série ! 🎓🎉', 'short', true, 'graduation'),

-- ── Promotion ─────────────────────────────────────────────────────────────────
(NULL, '🚀 Fier & Dynamique',    'Quelle excellente nouvelle, {prenom} ! Cette promotion est la juste récompense de ton travail et de ton talent. Tu vas exceller dans ce nouveau rôle, j''en suis convaincu·e. Félicitations ! 🚀🏆', 'touching', true, 'promotion'),
(NULL, '😄 Humoristique',        'Félicitations {prenom} ! Plus de responsabilités, plus de travail... mais aussi plus de prestige ! 😄 Tu mérites cette promotion — profite bien de ton nouveau titre. 📈', 'humorous', true, 'promotion'),
(NULL, '🥹 Touchant',            '{prenom}, cette promotion est la reconnaissance de tout ce que tu apportes. Ta valeur, ton engagement et ta bienveillance ont été vus. Je suis tellement fier·e de toi. Bravo ! 💛', 'touching', true, 'promotion'),
(NULL, '💼 Professionnel',        'Félicitations pour cette belle promotion, {prenom}. C''est une excellente nouvelle qui témoigne de tes compétences et de ton investissement. Je vous souhaite le meilleur dans ce nouveau rôle. 🌟', 'professional', true, 'promotion'),
(NULL, '⚡ Court & Percutant',   'Bravo {prenom} ! Cette promotion, tu la mérites plus que quiconque. Que cette belle réussite soit le début de nouvelles aventures professionnelles. 🎉', 'short', true, 'promotion'),

-- ── Retraite ──────────────────────────────────────────────────────────────────
(NULL, '🌴 Chaleureux & Joyeux', 'Et voilà, {prenom}, le moment tant attendu est arrivé ! Une nouvelle vie s''ouvre à toi — des matins sans réveil, des après-midis à ta guise, et tout le temps du monde pour ce qui compte vraiment. Profite bien, tu l''as mérité ! 🌴🎉', 'touching', true, 'retirement'),
(NULL, '😄 Humoristique',        'Félicitations {prenom} ! Tu peux enfin raccrocher le téléphone de bureau et ne plus jamais entendre "réunion à 9h" ! 😄 Une belle vie de liberté commence — profites-en à fond. 🌅', 'humorous', true, 'retirement'),
(NULL, '🥹 Nostalgique & Tendre', '{prenom}, une belle page se tourne. Merci pour tout ce que tu as apporté — ta sagesse, ton engagement, ta bienveillance. Une nouvelle aventure t''attend, et elle sera sûrement aussi belle. Tout mon amour t''accompagne. 💛', 'touching', true, 'retirement'),
(NULL, '🌟 Inspirant',           '{prenom}, ta retraite n''est pas une fin mais un nouveau départ. Le temps est enfin à toi — pour voyager, créer, partager, vivre. Félicitations pour cette belle carrière, et bienvenue dans cette nouvelle liberté ! ✈️🌿', 'touching', true, 'retirement'),
(NULL, '⚡ Court & Percutant',   'Félicitations {prenom} ! La liberté t''attend les bras ouverts. Profite de chaque instant de cette belle retraite méritée. 🌴🎊', 'short', true, 'retirement'),

-- ── Nouvel An ─────────────────────────────────────────────────────────────────
(NULL, '🎆 Festif & Pétillant',  'Bonne année {prenom} ! 🎆 Que cette nouvelle année t''apporte tout ce dont tu rêves — santé, bonheur, amour et mille belles surprises. Je suis tellement reconnaissant·e de t''avoir dans ma vie. Que 2025 soit magique ! ✨', 'touching', true, 'newyear'),
(NULL, '😄 Humoristique',        'Bonne année {prenom} ! 😄 Cette année, on garde les bonnes résolutions au moins jusqu''en février ! Sérieusement, je te souhaite une belle année remplie de joie et de moments partagés. 🥂', 'humorous', true, 'newyear'),
(NULL, '🥹 Touchant',            '{prenom}, une nouvelle année commence et ma première pensée va à toi. Merci pour tout ce que tu apportes dans ma vie. Que cette année soit douce, joyeuse et remplie de beaux moments. 💛', 'touching', true, 'newyear'),
(NULL, '🌟 Optimiste',           'Bonne année {prenom} ! Que cette nouvelle page soit remplie de projets qui t''enthousiasment, de rencontres qui t''élèvent et de moments qui restent gravés dans ton cœur. L''avenir est lumineux ! 🌟', 'touching', true, 'newyear'),
(NULL, '⚡ Court & Percutant',   'Bonne année {prenom} ! Que cette année soit belle, intense et inoubliable. À très vite pour fêter ça ! 🎊🥂', 'short', true, 'newyear'),

-- ── Noël ──────────────────────────────────────────────────────────────────────
(NULL, '🎄 Chaleureux',          'Joyeux Noël {prenom} ! 🎄 Que cette belle période de l''année t''apporte douceur, chaleur et bonheur partagé. Je pense à toi avec beaucoup d''affection et te souhaite de passer de magnifiques fêtes entourée des personnes qui te sont chères. 💛', 'touching', true, 'christmas'),
(NULL, '😄 Joyeux & Complice',   'Joyeux Noël {prenom} ! 😄 J''espère que le Père Noël a été généreux avec toi... ou que tu t''es fait toi-même un beau cadeau ! Passe de très belles fêtes et mange bien ! 🍪🎁', 'humorous', true, 'christmas'),
(NULL, '✨ Magique',              '{prenom}, en cette période magique de Noël, je t''envoie toute ma chaleur et mon affection. Que ces fêtes soient remplies de lumière, de rires et de moments précieux. Joyeux Noël ! 🕯️✨', 'touching', true, 'christmas'),
(NULL, '🌟 Poétique',            'C''est Noël, {prenom} — le temps des lumières, des retrouvailles et des cœurs qui se réchauffent. Je te souhaite une soirée magique entourée de ceux que tu aimes. 🎄🌟', 'poetic', true, 'christmas'),
(NULL, '⚡ Court & Percutant',   'Joyeux Noël {prenom} ! Que cette belle nuit t''apporte magie, douceur et souvenirs précieux. À très vite ! 🎄💛', 'short', true, 'christmas'),

-- ── Pâques ────────────────────────────────────────────────────────────────────
(NULL, '🐣 Joyeux & Printanier', 'Joyeuses Pâques {prenom} ! 🐣 Que ce beau dimanche printanier t''apporte joie et douceur. J''espère que tu auras trouvé plein de chocolats — et que tu les partageras (ou pas) ! Passe une belle journée. 🌸', 'humorous', true, 'easter'),
(NULL, '🌸 Chaleureux',          '{prenom}, joyeuses Pâques ! 🌸 Que ce beau jour de printemps te remplisse de légèreté et de bonheur. Je pense à toi et te souhaite une journée douce entourée de tes proches. 💛', 'touching', true, 'easter'),
(NULL, '🌿 Poétique',            'Pâques arrive avec le printemps, {prenom} — le temps de la douceur retrouvée, des jardins qui s''éveillent et des cœurs qui s''ouvrent. Je te souhaite une belle et heureuse journée. 🐰🌿', 'poetic', true, 'easter'),
(NULL, '⚡ Court & Percutant',   'Joyeuses Pâques {prenom} ! Que le chocolat coule à flots et que cette journée soit remplie de bonheur. 🐣🌸', 'short', true, 'easter'),

-- ── Saint-Valentin ────────────────────────────────────────────────────────────
(NULL, '❤️ Romantique & Passionné', 'Bonne Saint-Valentin {prenom} ! ❤️ En ce jour dédié à l''amour, je voulais juste te dire que tu comptes énormément pour moi. Tu rends chaque jour plus beau. Je t''aime. 💛', 'touching', true, 'valentines'),
(NULL, '🌸 Tendre',              '{prenom}, aujourd''hui et tous les jours, tu es la plus belle chose qui me soit arrivée. Bonne Saint-Valentin — et merci d''être toi. 🌸💝', 'poetic', true, 'valentines'),
(NULL, '😄 Humoristique',        'Bonne Saint-Valentin {prenom} ! 😄 Je t''offre tout mon amour... et aussi un peu de chocolat, parce que soyons honnêtes, le chocolat c''est important. 🍫❤️', 'humorous', true, 'valentines'),
(NULL, '✨ Poétique',             'En ce jour de Saint-Valentin, {prenom}, je t''envoie toute la lumière de mon cœur. Que notre amour continue de grandir et de briller à chaque saison. 💝✨', 'poetic', true, 'valentines'),
(NULL, '⚡ Court & Percutant',   'Bonne Saint-Valentin {prenom} ! Tu es mon préféré·e, aujourd''hui et tous les jours. ❤️', 'short', true, 'valentines'),

-- ── Fête des Mères ────────────────────────────────────────────────────────────
(NULL, '🌸 Tendre & Reconnaissant', 'Bonne fête des Mères {prenom} ! 🌸 Merci pour tout ce que tu fais, vu et invisible. Ta présence, ton amour et ta bienveillance sont mes plus grands trésors. Je t''aime de tout mon cœur. 💛', 'touching', true, 'mothersday'),
(NULL, '🥹 Émouvant',            '{prenom}, en ce beau jour qui t''est dédié, je voulais te dire à quel point tu comptes pour moi. Tu es la personne la plus précieuse de ma vie. Bonne fête des Mères, avec tout mon amour. ❤️', 'touching', true, 'mothersday'),
(NULL, '😄 Complice',            'Bonne fête des Mères {prenom} ! 😄 Je te souhaite une journée où tu n''as rien à faire, où tout le monde s''occupe de toi... au moins une fois dans l''année ! Tu le mérites tellement. 💛🌸', 'humorous', true, 'mothersday'),
(NULL, '🌟 Inspirant',           '{prenom}, tu m''as appris ce qu''est l''amour véritable — celui qui donne sans compter, qui protège sans étouffer, qui encourage sans jamais juger. Bonne fête des Mères. Tu es mon modèle. 🌸', 'poetic', true, 'mothersday'),
(NULL, '⚡ Court & Percutant',   'Bonne fête des Mères {prenom} ! Tu es la meilleure — aujourd''hui et tous les jours. Je t''aime. 🌸💛', 'short', true, 'mothersday'),

-- ── Fête des Pères ────────────────────────────────────────────────────────────
(NULL, '💙 Chaleureux & Complice', 'Bonne fête des Pères {prenom} ! 💙 Merci pour tout ce que tu m''as appris, en actes et en silence. Ta force, ta présence et ton amour sont pour moi des cadeaux inestimables. Je t''aime. 🛠️', 'touching', true, 'fathersday'),
(NULL, '🥹 Touchant',            '{prenom}, en ce jour qui t''est dédié, je voulais simplement te dire à quel point tu comptes pour moi. Tu es bien plus qu''un père — tu es une référence, un soutien, une fierté. Bonne fête. 💛', 'touching', true, 'fathersday'),
(NULL, '😄 Humoristique',        'Bonne fête des Pères {prenom} ! 😄 Ce jour t''appartient — tu peux donc zapper les chaînes sans négociation, choisir le restaurant et ne pas toucher à la vaisselle. Au moins une fois dans l''année ! 🏆', 'humorous', true, 'fathersday'),
(NULL, '🌟 Inspirant',           '{prenom}, tu m''as montré par l''exemple ce que signifie être courageux, généreux et bienveillant. Je grandis chaque jour en essayant de te ressembler un peu. Bonne fête des Pères. 💙🌟', 'poetic', true, 'fathersday'),
(NULL, '⚡ Court & Percutant',   'Bonne fête des Pères {prenom} ! Tu es le meilleur, sans discussion. Je t''aime. 💙🏆', 'short', true, 'fathersday'),

-- ── Halloween ─────────────────────────────────────────────────────────────────
(NULL, '🎃 Festif & Amusant',    '🎃 BOO ! Joyeux Halloween {prenom} ! Que cette nuit soit remplie de frissons délicieux, de bonbons à gogo et de déguisements inoubliables. Et rappelle-toi : les vraies horreurs, c''est quand il n''y a plus de chocolat. 🍬👻', 'humorous', true, 'halloween'),
(NULL, '👻 Mystérieux',          'Bonne nuit de Halloween {prenom} ! 👻 Que les fantômes soient gentils avec toi, que les citrouilles illuminent ton chemin et que cette nuit étrange reste gravée dans ta mémoire. 🎃✨', 'humorous', true, 'halloween'),
(NULL, '🕷️ Décalé',             '{prenom}, en cette nuit entre deux mondes... les monstres rôdent, les chauves-souris volent et quelque chose te guette dans l''obscurité. Ou alors c''est juste moi pour te souhaiter un joyeux Halloween ! 🦇😈', 'humorous', true, 'halloween'),
(NULL, '⚡ Court & Percutant',   'Joyeux Halloween {prenom} ! Que cette nuit soit effrayante à souhait et les bonbons bien mérités. 🎃🍬', 'short', true, 'halloween'),

-- ── Remerciements ─────────────────────────────────────────────────────────────
(NULL, '🙏 Sincère & Chaleureux', 'Merci du fond du cœur, {prenom}. Ce que tu as fait pour moi compte énormément et je ne l''oublierai pas. Ta générosité et ta bienveillance sont précieuses. Avec toute ma gratitude. 💛', 'touching', true, 'thanks'),
(NULL, '😄 Chaleureux & Complice', 'Merci {prenom} ! 😄 Tu es officiellement déclaré·e "meilleure personne de mon entourage". Pour de vrai — merci pour tout. Je t''en suis vraiment reconnaissant·e. 🙏💛', 'humorous', true, 'thanks'),
(NULL, '🥹 Émouvant',            '{prenom}, il y a des gestes qui font toute la différence. Le tien en fait partie. Merci pour ta présence, ton aide et tout ce que tu représentes pour moi. Je t''en suis infiniment reconnaissant·e. ❤️', 'touching', true, 'thanks'),
(NULL, '💼 Professionnel',        'Je tenais à vous remercier sincèrement, {prenom}. Votre aide a été précieuse et votre disponibilité très appréciée. Avec mes remerciements les plus chaleureux. 🙏', 'professional', true, 'thanks'),
(NULL, '⚡ Court & Percutant',   'Un grand merci {prenom} ! Ce que tu as fait compte vraiment pour moi. Avec toute ma gratitude. 🙏💛', 'short', true, 'thanks'),

-- ── Soutien ───────────────────────────────────────────────────────────────────
(NULL, '🤍 Doux & Bienveillant', 'Je pense à toi {prenom}. Je sais que ce moment n''est pas facile. Je suis là — pour t''écouter, pour te soutenir, pour être présent·e. Tu n''es pas seul·e dans cette épreuve. 💛', 'touching', true, 'support'),
(NULL, '🌟 Présence & Force',    '{prenom}, je ne sais pas toujours quoi dire dans ces moments-là. Mais je veux que tu saches que je pense à toi et que tu peux compter sur moi. Prends soin de toi. ❤️', 'touching', true, 'support'),
(NULL, '🌿 Doux & Apaisant',     'Je t''envoie tout mon soutien, {prenom}. Traverse ce moment à ton rythme — pas d''injonction à aller bien, juste ma présence sincère à tes côtés quand tu en as besoin. 🌿', 'touching', true, 'support'),
(NULL, '💪 Encouragement',        '{prenom}, je crois en toi. Pas parce que tout va bien, mais parce que je sais de quoi tu es capable. Tiens bon — je suis là. 🌟💛', 'touching', true, 'support'),
(NULL, '🕊️ Simple & Sincère',   '{prenom}, je voulais juste que tu saches que je pense à toi en ce moment. Sans grande phrase, juste avec tout mon cœur. 🤍', 'touching', true, 'support')

ON CONFLICT DO NOTHING;
