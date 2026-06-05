-- Templates : message de l'humain AU chat du contact, pour son anniversaire
-- animal_type = 'chat' | animal_direction = 'to' | occasion = 'birthday'

insert into public.message_templates
  (user_id, title, content, tone, is_system, is_manual_only, occasion, animal_type, animal_direction)
values

(null, 'Joyeux anniversaire. Je sais pas si ça t''intéresse.',
$$"Joyeux anniversaire. Je sais pas si ça t'intéresse mais je te le souhaite quand même." Ton humain m'a dit que t'aimais pas trop les démonstrations. J'ai quand même pris le temps d'écrire cette carte. Je l'ai relue trois fois. Je l'ai trouvée bien. Toi tu vas probablement t'asseoir dessus sans la regarder. C'est correct. Joyeux anniversaire, être insondable que j'essaie de comprendre depuis des années.
Avec efforts consentis et attentes revues à la baisse, Celui/celle qui tente quand même 📝$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'La première fois qu''on s''est rencontrés tu m''as ignoré.',
$$"La première fois qu'on s'est rencontrés tu m'as ignoré pendant deux heures." Puis t'es venu(e) renifler mon sac. Puis t'es reparti(e). Puis t'as dormi sur mes genoux sans prévenir. J'ai pas bougé pendant 47 minutes pour pas te déranger. J'avais mal au dos. J'ai rien dit. Joyeux anniversaire, être pour qui je sacrifie mon confort physique sans hésiter.
Avec dos encore légèrement douloureux et fierté intacte, Ton coussin humain agréé 🛋️$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'Ton humain m''a envoyé 14 photos de toi cette semaine.',
$$"Ton humain m'a envoyé 14 photos de toi cette semaine." Lundi tu dormais. Mardi tu dormais ailleurs. Mercredi tu regardais par la fenêtre. Jeudi tu dormais encore. Vendredi une photo floue de toi qui disparaissais derrière le canapé. J'ai tout regardé. J'ai tout trouvé fascinant. On a un problème tous les deux. Joyeux anniversaire, star involontaire de ma galerie photo.
Avec complicité inquiétante et notifications activées, Ton spectateur à distance 📱$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'J''ai apporté un cadeau spécialement sélectionné pour toi.',
$$"J'ai apporté un cadeau spécialement sélectionné pour toi." Ton humain m'avait dit que t'aimais les jouets avec des plumes. J'ai pris le plus beau. Le plus cher. Celui avec les clochettes et les plumes multicolores. Tu l'as reniflé quatre secondes. Tu es parti(e). T'as passé le reste de la soirée dans le carton d'emballage. Joyeux anniversaire, critique impitoyable de mes goûts.
Avec budget non rentabilisé et leçon retenue pour l'année prochaine, Ton fournisseur officiel de cartons 📦$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'Je t''ai dit bonjour en arrivant tout à l''heure.',
$$"Je t'ai dit bonjour en arrivant tout à l'heure." T'étais sur le radiateur. Tu m'as regardé(e) une seconde et demi. Puis t'as fermé les yeux. J'aurais pu le prendre mal. J'ai décidé d'y voir une forme de reconnaissance subtile et profonde. C'est ça ou admettre que je compte pour rien dans ta vie. Joyeux anniversaire, maître de l'interprétation favorable.
Avec optimisme à toute épreuve et ego préservé de justesse, Celui/celle qui cherche des signes là où y'en a pas 🔍$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'Ton humain dit que tu le réveilles chaque nuit à 3h du matin.',
$$"Ton humain dit que tu le réveilles chaque nuit à 3h du matin." Il a l'air épuisé. Il a l'air à bout. Et pourtant il te regarde avec les yeux de quelqu'un qui referait tout pareil demain. C'est toi qui fais ça. T'as ce pouvoir. Joyeux anniversaire, être mystérieux qui tient les humains en otage avec de l'amour.
Avec admiration pour ton pouvoir et compassion pour ton humain, Le témoin extérieur de votre relation codépendante 👁️$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'J''ai essayé de te faire un câlin tout à l''heure.',
$$"J'ai essayé de te faire un câlin tout à l'heure." T'as toléré exactement quatre secondes. Puis t'as posé une patte sur mon bras. Doucement mais fermement. Comme un videur poli. J'ai retiré mes mains. On s'est regardés. T'as cligné des yeux lentement. Ton humain dit que c'est un signe d'amour. Je veux bien le croire. Joyeux anniversaire, être aux conditions strictes.
Avec quatre secondes chéries et espoir d'en obtenir cinq l'année prochaine, Ton câlineur officiel sous conditions 🤲$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'Je sais pas quel âge t''as exactement.',
$$"Je sais pas quel âge t'as exactement." Ton humain m'a donné un chiffre mais en années humaines ou en années chat j'ai plus suivi. Ce que je sais c'est que t'as l'air intemporel(le). Comme si le temps prenait pas vraiment prise sur toi. Majestueux(se) le premier jour. Majestueux(se) aujourd'hui. Probablement majestueux(se) pour l'éternité. Joyeux anniversaire, être au-delà du temps.
Avec respect pour ton mystère et confusion mathématique assumée, Ton admirateur/admiratrice déconcerté(e) ⏳$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'T''es passé(e) devant moi trois fois ce soir sans t''arrêter.',
$$"T'es passé(e) devant moi trois fois ce soir sans t'arrêter." La première fois j'ai tendu la main. T'as continué. La deuxième fois j'ai fait un bruit de bouche. T'as accéléré légèrement. La troisième fois j'ai rien fait. T'as ralenti. T'es resté(e) à 40 centimètres. Trente secondes. Puis t'es reparti(e). C'était le plus beau moment de ma soirée. Joyeux anniversaire, distributeur de proximité dosée.
Avec trente secondes gravées dans ma mémoire, Ton voisin de soirée officiellement ignoré mais pas tout à fait 🕰️$$,
'humorous', true, false, 'birthday', 'chat', 'to'),

(null, 'Ton humain t''aime d''une façon que je comprends et que j''envie.',
$$"Ton humain t'aime d'une façon que je comprends et que j'envie à la fois." Il réorganise sa vie entière autour de tes horaires. Il rentre plus tôt. Il sort moins tard. Il a acheté cinq types de croquettes différentes pour trouver celle que tu daignes manger. Et toi tu le regardes parfois avec ce calme absolu qui ressemble à de la gratitude. Ou pas. On sait jamais vraiment avec toi. Joyeux anniversaire, enigme à fourrure qui vaut visiblement tous les sacrifices.
Avec tendresse pour vous deux et légère jalousie de votre lien, L'ami qui observe votre histoire depuis le canapé 🐾$$,
'humorous', true, false, 'birthday', 'chat', 'to');
