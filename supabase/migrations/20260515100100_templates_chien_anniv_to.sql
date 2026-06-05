-- Templates : message de l'humain AU chien du contact, pour son anniversaire
-- animal_type = 'chien' | animal_direction = 'to' | occasion = 'birthday'

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'Joyeux anniversaire mon grand. T''as encore grandi cette année ?',
$$"Joyeux anniversaire mon grand. T'as encore grandi cette année ?" Non je déconne, t'es parfait comme t'es. Un peu poilu, un peu baveux, légèrement obsédé par les odeurs de trottoir, mais parfait. J'ai demandé à ton humain ce que tu voulais comme cadeau. Il a dit "des croquettes". J'ai trouvé ça triste alors j'ai pris les croquettes ET un jouet. Parce que t'as des goûts simples mais tu mérites mieux que ce que ton humain imagine pour toi. Joyeux anniversaire, boule de poils que j'aime comme si t'étais le mien.
Avec affection assumée et cadeaux soigneusement sélectionnés, Ton fan numéro un qui n'est même pas chez toi 🐾$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'On se voit pas souvent mais je pense à toi.',
$$"On se voit pas souvent mais je pense à toi." Chaque fois que je vois un chien dans la rue je compare. Spoiler : ils perdent tous. T'as un truc indéfinissable. Un charisme. Une présence. Les autres chiens sont des chiens. Toi t'es toi. Joyeux anniversaire, célébrité canine de mon cercle social.
Avec fidélité à toute épreuve et jalousie de ton humain, Celui/celle qui te préfère secrètement à ton maître 👀$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'J''arrive dans deux heures et j''espère que tu vas encore me sauter dessus.',
$$"J'arrive dans deux heures et j'espère que tu vas encore me sauter dessus." Ton humain dit que c'est une mauvaise habitude. Moi je dis que c'est le meilleur accueil que je reçois dans ma vie entière. Personne d'autre est aussi content de me voir. Personne. Joyeux anniversaire, seul être sur terre qui me donne l'impression d'être une rockstar à chaque visite.
Avec gratitude sincère et veste déjà sacrifiée, Ton visiteur préféré qui arrive avec des treats 🎸$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'T''as pas changé depuis qu''on se connaît.',
$$"T'as pas changé depuis qu'on se connaît." Même regard. Même énergie. Même façon de renifler mon sac comme s'il contenait des secrets d'État. Pendant ce temps moi j'ai vieilli, changé de boulot, déménagé deux fois, traversé des crises existentielles. Toi t'es juste là, heureux, stable, parfait. T'es mon modèle de vie. Joyeux anniversaire, gourou à quatre pattes.
Avec admiration profonde et complexe d'infériorité assumé, Ton disciple humain en quête de sérénité 🧘$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'Ton humain m''a dit que c''était ton anniversaire. Ton humain pense à tout.',
$$"Ton humain m'a dit que c'était ton anniversaire. Ton humain pense à tout." Enfin surtout à toi. Honnêtement t'occupe 80% de ses conversations. Ses stories. Ses photos. Son écran de veille. À un moment faut qu'on parle de cette dynamique. Mais aujourd'hui c'est ton jour alors profites-en. Joyeux anniversaire, tyran adorable à fourrure.
Avec tendresse pour toi et légère inquiétude pour ton humain, L'ami qui observe la situation de loin 🔭$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'Je t''ai apporté un gâteau spécial chien. Ton humain a voulu y goûter.',
$$"Je t'ai apporté un gâteau spécial chien. Ton humain a voulu y goûter." Je lui ai dit non. Ce gâteau c'est pour toi. Il a boudé dix minutes. Tu méritais mieux que de partager ton anniversaire avec quelqu'un qui mange déjà du gâteau normal toute l'année. Joyeux anniversaire, roi de la journée sans partage obligatoire.
Avec justice sociale canine et gâteau intégralement préservé, Ton allié officiel contre le vol de dessert 🎂$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'J''ai cherché quoi t''écrire pendant une heure.',
$$"J'ai cherché quoi t'écrire pendant une heure." Puis j'ai réalisé que tu saurais pas lire de toute façon. Mais ton humain va te lire ça à voix haute avec cette petite voix qu'il prend pour te parler et toi tu vas remuer la queue sans comprendre un mot. Et ce sera le plus beau moment de la journée pour vous deux. Joyeux anniversaire, déclencheur de bonheur involontaire.
Avec émotion anticipée et stylo bien choisi, Celui/celle qui écrit pour la voix de ton humain 📝$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'T''es le seul être vivant pour qui je traverse un parc sous la pluie avec le sourire.',
$$"T'es le seul être vivant pour qui je traverse un parc sous la pluie avec le sourire." Ton humain m'a appelé. Il a dit "viens on promène le chien." Il pleuvait des cordes. J'ai mis mes bottes et je suis venu. Pour toi. Parce que te voir trottiner dans les flaques avec cette joie absurde ça vaut tous les ciels bleus du monde. Joyeux anniversaire, raison de sortir par tous les temps.
Avec imperméable mouillé et cœur réchauffé, Ton complice de promenade par n'importe quel temps ☔$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'La première fois qu''on s''est rencontrés tu m''as reniflé les chaussures.',
$$"La première fois qu'on s'est rencontrés tu m'as reniflé les chaussures pendant trois minutes." Je suis resté immobile. Respectueusement. Parce que j'avais compris que c'était ton protocole d'accueil et que ton jugement comptait. Tu as levé les yeux. Tu as remué la queue. J'ai été accepté. C'est le moment de validation dont je suis le plus fier dans ma vie sociale. Joyeux anniversaire, jury le plus honnête que je connaisse.
Avec fierté d'avoir été approuvé dès le premier jour, Ton ami certifié conforme depuis l'odorat 👃$$,
'humorous', true, false, 'birthday', 'chien', 'to'),

(null, 'Ton humain t''aime tellement que ça me rend parfois jaloux(se).',
$$"Ton humain t'aime tellement que ça me rend parfois jaloux(se)." Il parle de toi comme d'un enfant prodige. Il annule des sorties pour rester avec toi. Il a plus de photos de toi dans son téléphone que de n'importe qui d'autre. Au début ça m'agaçait. Puis je t'ai rencontré. Et maintenant je comprends totalement. Joyeux anniversaire, être absolument irresistible à fourrure.
Avec jalousie définitivement convertie en admiration, Ton fan numéro deux, juste derrière ton humain ❤️$$,
'humorous', true, false, 'birthday', 'chien', 'to');
