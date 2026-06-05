// Messages de l'animal vers un tiers (from_to_third)
// Placeholders :
//   {prenom}     → prénom du destinataire
//   {identite}   → "Boop, la berger allemand de Sophie CLOT"
//   {nom_animal} → "Boop" (références courtes dans le texte)
//   {maitre}     → prénom du maître/maîtresse

export type PetThirdPartyOccasion = 'birthday' | 'nameday' | 'bonjour' | 'merci' | 'encouragement' | 'bonne_nouvelle';
export type PetThirdPartyType     = 'chien' | 'chat' | 'autre';

const CHIEN_BIRTHDAY = [
  "Ouaf ! C'est moi, {identite} ! {maitre} m'a demandé de t'écrire, mais je l'aurais fait de toute façon — t'es vraiment sympa. JOYEUX ANNIVERSAIRE {prenom} ! 🐾🎂 Je t'envoie un câlin baveux.",
  "Salut {prenom} ! Je suis {identite}. Ce matin j'ai demandé à {maitre} comment on écrit 'joyeux anniversaire'. Elle m'a aidé. Alors voilà : JOYEUX ANNIVERSAIRE ! Maintenant je retourne dormir. Bisous. 🐶",
  "Waf waf WA-HAF ! (Traduction : joyeux anniversaire {prenom} !) Je suis {identite} et {maitre} dit que tu le mérites vraiment. Moi je dis pareil — je sais reconnaître les gens bien, je les renifle. C'est infaillible. 🐾🎉",
  "Cher {prenom}, je suis {identite} et tu fais partie des humains que j'apprécie. Et quand j'apprécie quelqu'un, je le sens — au sens propre. Joyeux anniversaire de la part de {nom_animal} et de {maitre} ! ❤️🐾",
  "Waf waf waf ! {prenom} ! C'est {identite} ! Je sais pas exactement ce qu'on fête aujourd'hui, mais {maitre} a sorti le champagne donc ça doit être sérieux. JOYEUX ANNIVERSAIRE ! Je me suis mis beau pour l'occasion. Enfin... j'ai remué la queue. 🐾🎊",
  "{prenom} ! Tu sais quoi ? Chaque fois que {maitre} prononce ton nom, je remue la queue. Je sais même pas pourquoi. C'est instinctif. Alors joyeux anniversaire d'instinct. 🐶💛",
  "Bonjour {prenom}. Ici {identite}. Je voulais te souhaiter un joyeux anniversaire moi-même, sans passer par {maitre}. Bon, elle m'a quand même aidé à écrire. Et à tenir le stylo. Mais c'est MON idée. Joyeux anniversaire ! 🐾",
  "Joyeux anniversaire {prenom} ! C'est {identite}. {maitre} dit que tu es quelqu'un de formidable. Moi je ne sais pas ce que ça veut dire exactement, mais à voir sa tête quand elle parle de toi, ça doit être vrai. 🐶✨",
  "Salut {prenom} ! Je suis {identite} et aujourd'hui c'est ton grand jour ! {maitre} m'a dit de rester sage pour ne pas gâcher le message. J'essaie. C'est dur. Joyeux anniversaire quand même ! 🐾🎂",
  "Ouaf {prenom} ! Je suis {identite}. {maitre} dit que c'est ton anniversaire et que je dois être gentil dans mon message. Alors voilà mon message gentil : tu mérites tout le bonheur du monde. Et des croquettes. Non attends, les croquettes c'est pour moi. Joyeux anniversaire ! 🐶😂",
];

const CHAT_BIRTHDAY = [
  "Bonjour {prenom}. Je suis {identite}. C'est apparemment ton anniversaire. Félicitations pour avoir survécu une année de plus. — {nom_animal} 🐱",
  "Considère ce message comme un privilège rarissime. Je suis {identite} et j'ai daigné prendre sur mon précieux temps de sommeil (14h/jour, c'est serré) pour te souhaiter un joyeux anniversaire. {maitre} dit que tu le mérites. Je lui fais confiance — elle a bon goût. Elle m'a choisi, après tout. 🐱✨",
  "{prenom}. Je suis {identite}. Sache que je n'écris à personne d'habitude. Mais {maitre} avait l'air d'y tenir, et quand elle insiste je capitule (faiblesse de ma part). Joyeux anniversaire. Ne l'ébruite pas, ça nuirait à ma réputation. 🐱",
  "{maitre} voulait te souhaiter un bon anniversaire mais elle était occupée à me nourrir — les priorités. Je suis {identite} et j'ai pris le relais. Joyeux anniversaire {prenom}. Et ne me remercie pas. 🐱🎂",
  "Bonjour {prenom}. {identite} ici. Je t'écris depuis ma position habituelle — allongé sur le meilleur canapé. {maitre} voulait te souhaiter un joyeux anniversaire et j'ai accepté de cosigner. Ne te méprends pas, ce n'est pas de l'affection. C'est de la politesse. 🐱",
  "{prenom}. Sache que j'observe les humains depuis des années. J'en ai vu beaucoup. Les bons sont rares. {maitre} dit que tu en fais partie. Je lui fais confiance sur ce point. Joyeux anniversaire. — {nom_animal} 🐱🔍",
  "Cher {prenom}, je suis {identite}. J'ai longuement réfléchi à ce message — environ 3 secondes, ce qui est beaucoup pour moi. Conclusion : joyeux anniversaire. Et maintenant laisse-moi dormir. 🐱💤",
  "{prenom}. C'est ton anniversaire. Je suis {identite} et je dois avouer que ce concept m'laisse perplexe. Les chats, ça ne fête pas les anniversaires. On se contente d'exister, magnifiquement. Mais pour toi, je fais une exception. Joyeux anniversaire. 🐱",
  "Bonjour {prenom}. Je suis {identite}. {maitre} a insisté pour que je t'écrive quelque chose de chaleureux. Voilà ce que j'ai trouvé de plus chaleureux : joyeux anniversaire. Tu remarqueras l'absence de point d'exclamation. C'est voulu. Je suis un chat. 🐱",
  "Cher {prenom}. Je suis {identite}. Aujourd'hui {maitre} m'a regardé avec ses grands yeux et m'a dit que c'était ton anniversaire. Alors j'ai miaulé une fois. Elle dit que ça ne suffit pas. Donc je t'écris aussi. Joyeux anniversaire. — {nom_animal} 🐱",
];

const CHIEN_NAMEDAY = [
  "Waf ! Bonne fête {prenom} ! Je suis {identite} ! {maitre} m'a dit que c'est ta fête aujourd'hui. Je sais pas trop ce que ça veut dire mais ça a l'air bien ! Je t'envoie un câlin poilu et des léchouilles ! 🐾🌸",
  "Bonne fête {prenom} ! C'est {identite} ! {maitre} dit que tu portes un prénom qu'on fête aujourd'hui. L'occasion rêvée pour te souhaiter plein de bonnes choses : des promenades, du soleil, et des gens qui te grattent derrière les oreilles. C'est ce que j'aime, moi. 🐶🌸",
  "Ouaf ouaf ! {identite} à l'appareil. {maitre} m'a dit de te souhaiter bonne fête et j'ai aboyé très fort dans le jardin. Elle dit que ça ne compte pas. Alors je t'écris aussi. Bonne fête {prenom} ! 🐶",
  "Cher {prenom}, je suis {identite}. {maitre} dit que c'est ta fête. Moi j'aurais préféré t'apporter un cadeau en vrai — genre une de mes balles préférées. Mais elle a dit non. Alors je t'envoie ce message à la place. Bonne fête ! 🐾🎁",
  "Bonne fête {prenom} ! Je suis {identite} et {maitre} m'a dit de te transmettre ses plus belles pensées. Moi j'ajoute les miennes : une bonne balade, du soleil, et quelqu'un pour te gratter le ventre. Enfin, pour les humains ça marche aussi non ? 🐾🌸",
  "Salut {prenom} ! C'est {identite} ! Tu sais, moi j'ai pas de prénom à fêter. Enfin si, j'en ai un — {nom_animal} — mais personne ne me fait de gâteau. Pas grave. L'important c'est toi aujourd'hui. Bonne fête ! 🐶🎁",
  "Bonne fête {prenom} ! C'est {identite} ! {maitre} dit que tu mérites d'être fêté{E_DEST} aujourd'hui. Moi je dis pareil. Et pour marquer le coup, j'ai aboyé en ton honneur ce matin. {maitre} n'a pas trop apprécié. Mais c'était sincère ! 🐾",
  "{prenom} ! Bonne fête ! Je suis {identite} et j'avais envie de te le dire moi-même. Sans façon. Sans discours. Juste : bonne fête, et merci d'exister. {maitre} dit pareil mais en plus long. Moi je fais court. 🐶🌸",
  "Waf {prenom} ! C'est {identite}. {maitre} m'a expliqué que ta fête c'est comme ton anniversaire mais sans les bougies. Je comprends pas trop la différence. Mais si ça se fête, alors bonne fête ! 🐾🎶",
  "Bonne fête {prenom} ! Je suis {identite}. {maitre} dit que tu es quelqu'un de vraiment bien. Et moi je sais reconnaître les gens bien — c'est une question de flair. Littéralement. Passe une excellente journée ! 🐶✨",
];

const CHAT_NAMEDAY = [
  "Bonne fête, {prenom}. Je suis {identite}. Je trouve ce concept humain très étrange — on ne fête pas mon nom à moi, et je suis pourtant exceptionnel. Mais soit. Profite bien. 🐱🌸",
  "{prenom}. C'est ta fête. Je suis {identite} et {maitre} voulait te l'écrire elle-même mais elle s'occupait de remplir ma gamelle (tâche noble entre toutes). J'ai donc pris le relais. Bonne fête. 🐱",
  "Bonne fête {prenom}. {identite} à l'appareil. Je t'écris depuis le canapé de {maitre} où je règne en maître absolu. Elle dit que tu es quelqu'un de bien. C'est le plus beau compliment qu'elle puisse faire. 🐱✨",
  "Cher {prenom}, j'aurais pu ignorer ce message. C'est d'ailleurs ce que je fais en général avec tout. Mais {maitre} avait ce regard insistant. Tu connais ce regard. Je suis {identite} et je te dis : bonne fête. Voilà. C'est dit. 🐱",
  "Bonne fête {prenom}. Je suis {identite}. {maitre} dit que c'est un jour spécial pour toi. Je ne partage généralement pas l'enthousiasme humain pour les jours spéciaux. Mais bon. Bonne fête. — {nom_animal} 🐱",
  "{prenom}. Ta fête. Je suis {identite} et j'ai décidé de t'écrire après mûre réflexion (j'étais en train de fixer le mur, comme d'habitude). Bonne fête. Que cette journée soit digne de toi. 🐱🌸",
  "Cher {prenom}, je suis {identite}. {maitre} fête ton prénom aujourd'hui. Les humains ont ce genre de coutume. Je trouve ça attendrissant, dans le fond. Bonne fête. Et non, ne me remerciez pas. 🐱",
  "Bonne fête {prenom}. C'est {identite}. {maitre} m'a demandé d'être particulièrement aimable dans ce message. J'ai fait de mon mieux. Tu as remarqué. 🐱✨",
  "{prenom}. Je suis {identite}. J'ai observé {maitre} écrire des messages toute la matinée. J'ai décidé d'intervenir moi-même pour être sûr que c'était bien fait. Bonne fête. De rien. 🐱🌸",
  "Bonne fête {prenom}. Je suis {identite}. Aujourd'hui {maitre} porte une tenue de fête. Elle a aussi mis mes croquettes préférées. Je pense que c'est lié à toi d'une façon ou d'une autre. Alors merci, et bonne fête. 🐱🎁",
];

const AUTRE_BIRTHDAY = [
  "Bonjour {prenom} ! Je suis {identite}. {maitre} m'a demandé de te souhaiter un joyeux anniversaire. Je ne sais pas trop comment ça marche, les anniversaires, mais il paraît que c'est important. Alors : joyeux anniversaire ! 🎂🐾",
  "{prenom}, c'est {identite}. {maitre} dit que c'est ton anniversaire aujourd'hui. Je lui fais confiance — elle est plutôt fiable sur ces choses-là. Joyeux anniversaire de ma part aussi ! 🐾🎉",
];

const AUTRE_NAMEDAY = [
  "Bonne fête {prenom} ! C'est {identite}. {maitre} m'a demandé de te transmettre ses voeux — et les miens par la même occasion. Bonne fête ! 🌸🐾",
  "{prenom}, je suis {identite}. {maitre} dit que c'est ta fête. Je ne sais pas ce que ça veut dire exactement, mais elle avait l'air contente. Alors bonne fête ! 🐾",
];

// ── Bonjour ──────────────────────────────────────────────────────────────────

const CHIEN_BONJOUR = [
  "Waf ! Salut {prenom} ! C'est {identite} ! Je voulais juste dire bonjour. C'est tout. Pas d'occasion particulière. Juste... bonjour ! {maitre} dit que c'est une bonne idée de penser aux gens. Moi je pense à tout le monde tout le temps. C'est mon truc. 🐾👋",
  "{prenom} ! C'est {nom_animal} ! Je passais par là — enfin, pas vraiment, je suis sur le canapé — et j'ai pensé à toi. Alors voilà : bonjour ! {maitre} dit que c'est mignon. Je trouve aussi. 🐶",
  "Bonjour {prenom} ! Je suis {identite} et aujourd'hui j'avais envie de dire bonjour à quelqu'un. J'ai choisi toi. C'est un honneur, non ? {maitre} confirme que oui. Bonne journée ! 🐾✨",
  "Ouaf {prenom} ! {identite} à l'appareil. {maitre} m'a demandé si je voulais envoyer un bonjour à quelqu'un. J'ai aboyé une fois pour dire oui. Voilà le bonjour. C'est officiel. 🐶👋",
  "Salut {prenom} ! C'est {nom_animal} ! Je sais pas trop pourquoi j'écris, {maitre} avait juste l'air content de te donner des nouvelles. Et moi j'aime quand {maitre} est content. Donc : bonjour ! 🐾💛",
];

const CHAT_BONJOUR = [
  "{prenom}. {identite} ici. Je t'écris depuis le rebord de la fenêtre où j'observe le monde avec le mépris habituel. {maitre} voulait te dire bonjour. J'ai accepté de transmettre. Bonjour. — {nom_animal} 🐱",
  "Bonjour {prenom}. Je suis {identite}. Ce message ne signifie pas que je t'apprécie particulièrement. Il signifie que {maitre} avait besoin de te donner signe de vie et que j'ai bien voulu servir d'intermédiaire. Ne lis pas plus que ça. 🐱",
  "{prenom}. {nom_animal}. Bonjour. {maitre} dit que tu mérites qu'on pense à toi. Je ne valide pas ce jugement mais je ne l'infirme pas non plus. C'est ma façon à moi de dire bonjour. 🐱✨",
  "Cher {prenom}, je suis {identite}. Je t'écris parce que {maitre} m'y a fortement encouragé. 'Encouragé' est un euphémisme — il y avait des croquettes en jeu. Bonjour. 🐱",
  "{prenom}. Sache que je ne dis bonjour à personne d'habitude. Tu es l'exception. {maitre} dit que tu le mérites. Je lui fais confiance sur ce point précis, et uniquement celui-là. Bonjour. — {nom_animal} 🐱",
];

const AUTRE_BONJOUR = [
  "Bonjour {prenom} ! C'est {identite}. {maitre} voulait te dire qu'on pensait à toi. Alors voilà : on pense à toi ! Passe une belle journée 🌟🐾",
  "{prenom}, bonjour ! Je suis {identite} et {maitre} m'a demandé de t'envoyer un petit signe de vie. Considère que c'est fait — et avec beaucoup d'affection ! 🐾💛",
  "Bonjour {prenom} ! {identite} ici. Pas d'occasion particulière, juste l'envie de te dire que {maitre} pense à toi. Et moi aussi, à ma façon. Bonne journée ! 🐾",
];

// ── Remerciement ─────────────────────────────────────────────────────────────

const CHIEN_MERCI = [
  "Waf waf WAF {prenom} ! Je suis {identite} et je voulais te dire MERCI ! {maitre} m'a expliqué ce que tu as fait. Moi je comprends pas tout mais j'ai compris que c'était super bien. Alors MERCI ! Je t'envoie des léchouilles de gratitude ! 🐾🙏",
  "{prenom} ! C'est {nom_animal} ! {maitre} est vraiment touché par ce que tu as fait. Et quand {maitre} est touché, moi je remue la queue très fort. Là je remue tellement que j'ai failli renverser ma gamelle. C'est dire. Merci {prenom} ! 🐶💛",
  "Bonjour {prenom}. Je suis {identite}. {maitre} dit qu'on te doit un grand merci. Moi je sais pas trop ce que ça veut dire 'devoir' quelque chose, mais j'ai compris que t'as été vraiment là pour {maitre}. Alors merci, du fond de mes pattes. 🐾🙏",
  "Ouaf {prenom} ! {identite} à l'appareil ! Je voulais te remercier moi-même parce que {maitre} était trop ému pour écrire correctement. T'as fait quelque chose de bien. {maitre} le gardera longtemps dans son cœur. Et moi dans mon flair — je reconnais les bonnes personnes. 🐶✨",
  "{prenom} ! C'est {nom_animal} ! MERCI MERCI MERCI ! Voilà. {maitre} dit que c'est trop mais moi je trouve que trois fois c'est le minimum. T'es quelqu'un de bien. Je le sens. Littéralement. 🐾🙏",
];

const CHAT_MERCI = [
  "{prenom}. {identite} ici. {maitre} m'a demandé de te remercier. Je le fais. Merci. Ce n'est pas dans mes habitudes d'exprimer de la gratitude mais {maitre} y tenait et j'avais envie de lui faire plaisir. Ne le répète pas. 🐱",
  "Cher {prenom}, je suis {identite}. {maitre} dit que ce que tu as fait mérite un grand merci. Je ne suis pas expert en 'grands mercis' mais je peux confirmer que {maitre} était sincèrement touché. Et quand {maitre} est content, je dors mieux. Donc merci. 🐱🙏",
  "{prenom}. {nom_animal}. Je t'écris pour te remercier au nom de {maitre} et — je dis ça une seule fois — en mon nom aussi. Tu as été là quand il le fallait. C'est rare. Je note. 🐱✨",
  "Bonjour {prenom}. Je suis {identite}. {maitre} voulait que je te dise merci. J'ai réfléchi à la question — environ deux secondes, ce qui est long pour moi — et j'ai conclu que oui, tu mérites ce merci. Reçois-le donc. 🐱",
  "{prenom}. Sache que je ne dis merci à personne. Jamais. Sauf aujourd'hui. {maitre} t'est vraiment reconnaissant et cette gratitude méritait d'être transmise. Merci. — {nom_animal} 🐱🙏",
];

const AUTRE_MERCI = [
  "Bonjour {prenom} ! Je suis {identite} et {maitre} voulait absolument te remercier. Ce que tu as fait, ça compte vraiment. Un grand merci de nous deux ! 🙏🐾",
  "{prenom}, merci ! C'est {identite}. {maitre} m'a demandé de te transmettre toute sa reconnaissance. Tu as été formidable — et ça ne s'oublie pas. Merci du fond du cœur 💛🐾",
  "Bonjour {prenom} ! {identite} ici. {maitre} est vraiment touché par ce que tu as fait. Alors merci, sincèrement, de notre part à tous les deux. 🙏🐾",
];

// ── Encouragement ────────────────────────────────────────────────────────────

const CHIEN_ENCOURAGEMENT = [
  "ALLEZ {prenom} ! C'est {identite} ! {maitre} m'a dit que t'avais besoin d'un coup de boost. ALORS LÀ JE TE BOOSTE ! TU PEUX LE FAIRE ! T'ES INCROYABLE ! J'ABOIS POUR TOI ! 🐾💪🔥",
  "{prenom} ! C'est {nom_animal} ! {maitre} m'a dit que t'avais un truc difficile devant toi. Moi j'ai pas compris exactement quoi mais j'ai compris que c'était dur. Alors je t'envoie toute mon énergie. Et j'en ai BEAUCOUP. Allez ! 🐶⚡",
  "Bonjour {prenom} ! Je suis {identite}. Tu sais ce que je fais quand j'ai peur d'un truc ? J'aboie très fort et je fonce. {maitre} dit que c'est pas toujours adapté pour les humains. Mais l'idée est bonne : fonce ! Tu vas y arriver ! 🐾💪",
  "{prenom} ! {identite} à l'appareil ! {maitre} dit que tu traverses quelque chose de compliqué. Moi je sais pas résoudre les problèmes humains mais je sais reconnaître quelqu'un de courageux. Et toi, t'es courageux. C'est mon rapport d'expert. 🐶✨",
  "Waf {prenom} ! C'est {nom_animal} ! {maitre} voulait t'encourager et m'a demandé de l'aider. Alors voilà mon encouragement de chien : TU GÈRES. C'est court mais c'est sincère. Allez ! 🐾💛",
];

const CHAT_ENCOURAGEMENT = [
  "{prenom}. {identite} ici. {maitre} m'a dit que tu traversais quelque chose de difficile. Je ne suis pas du genre à distribuer des encouragements à tout va. Mais pour toi, aujourd'hui : tu vas y arriver. C'est dit. — {nom_animal} 🐱💪",
  "Cher {prenom}, je suis {identite}. {maitre} voulait t'encourager. J'ai décidé de m'y associer — ce qui est pour moi un effort considérable. La raison : tu le mérites. Continue. Tu es plus fort que tu ne le crois. 🐱",
  "{prenom}. {nom_animal}. Je ne fais habituellement pas dans l'encouragement. C'est trop... humain. Mais {maitre} m'assure que tu en as besoin et que tu le mérites. Alors voilà : courage. Et c'est sincère. 🐱✨",
  "Bonjour {prenom}. Je suis {identite}. J'observe les humains depuis longtemps. Ceux qui s'en sortent ont un point commun : ils continuent malgré tout. Toi, tu continues. C'est la définition du courage. — {nom_animal} 🐱",
  "{prenom}. {identite} à l'appareil. {maitre} est fier de toi. Et moi — dans la mesure où un chat peut être fier de quelqu'un d'autre que lui-même — je le suis aussi. Continue. 🐱💪",
];

const AUTRE_ENCOURAGEMENT = [
  "Bonjour {prenom} ! Je suis {identite} et {maitre} voulait t'encourager. Tu traverses quelque chose de difficile mais tu vas y arriver — on le sait tous les deux. Courage ! 💪🐾",
  "{prenom}, allez ! C'est {identite}. {maitre} pense fort à toi en ce moment. Tu as tout ce qu'il faut pour y arriver. On est dans ton équipe ! 💛🐾",
  "Coucou {prenom} ! {identite} ici. {maitre} m'a demandé de te dire que tu es plus fort que tu ne le penses. Et que tout le monde croit en toi. Courage ! 🌟🐾",
];

// ── Bonne nouvelle ───────────────────────────────────────────────────────────

const CHIEN_BONNE_NOUVELLE = [
  "WAHOUUU {prenom} ! C'est {identite} ! {maitre} vient de m'annoncer ta bonne nouvelle et j'ai ABOYÉ DE JOIE ! {maitre} dit que c'était un peu trop fort. Je m'en fiche. C'est GÉNIAL ! FÉLICITATIONS ! 🐾🎉🔥",
  "{prenom} ! {nom_animal} à l'appareil ! J'ai entendu la nouvelle ! {maitre} avait l'air tellement content que j'ai cru qu'il sortait ma laisse. C'était pas ça mais c'était presque aussi bien. BRAVO {prenom} ! 🐶🎊",
  "Waf waf {prenom} ! Je suis {identite} ! {maitre} m'a dit ta super nouvelle et je voulais te féliciter moi-même ! Je sais pas exactement ce qui s'est passé mais {maitre} souriait alors c'est forcément fantastique. Bravo ! 🐾✨",
  "{prenom} ! C'est {nom_animal} ! BONNE NOUVELLE BONNE NOUVELLE BONNE NOUVELLE ! {maitre} était aux anges. Et quand {maitre} est aux anges, je tourne en rond pendant dix minutes. C'est ma façon de fêter. Félicitations ! 🐶🎉",
  "Bonjour {prenom} ! {identite} ici ! {maitre} dit que t'as une super nouvelle à célébrer. Alors je célèbre avec toi — à ma façon, c'est-à-dire en aboyant joyeusement et en renversant mon bol d'eau. Bravo {prenom} ! 🐾🎊",
];

const CHAT_BONNE_NOUVELLE = [
  "{prenom}. {identite} ici. {maitre} m'a informé de ta bonne nouvelle. Je dois admettre — à contrecœur — que c'est réjouissant. Félicitations. Et ne t'y habitue pas, je ne félicite personne d'habitude. 🐱🎉",
  "Cher {prenom}, je suis {identite}. Ta bonne nouvelle est parvenue jusqu'à moi via {maitre}, qui ne tenait plus en place. C'est agaçant. Mais la nouvelle, elle, est excellente. Félicitations. — {nom_animal} 🐱✨",
  "{prenom}. {nom_animal}. J'ai su pour ta bonne nouvelle. {maitre} m'a regardé avec ces yeux brillants d'excitation que je trouve généralement épuisants. Mais là, pour une fois, l'excitation était justifiée. Bravo. 🐱🎊",
  "Bonjour {prenom}. Je suis {identite}. {maitre} dit que tu as une excellente nouvelle à célébrer. Je ne suis pas grand amateur de célébrations, mais je reconnais les succès méritables. Le tien l'est. Félicitations. 🐱",
  "{prenom}. Je suis {identite}. Ta nouvelle est arrivée aux oreilles de {maitre} — et donc aux miennes, car j'écoute tout. C'est une très bonne nouvelle. Je te félicite. C'est rare que je felicite quelqu'un. Profites-en. 🐱🎉",
];

const AUTRE_BONNE_NOUVELLE = [
  "Bonjour {prenom} ! Je suis {identite} et {maitre} vient de m'annoncer ta super nouvelle ! On est vraiment contents pour toi — félicitations ! 🎉🐾",
  "{prenom}, félicitations ! C'est {identite}. {maitre} rayonne de bonheur pour toi. Tu mérites cette belle nouvelle — profites-en bien ! 🌟🐾",
  "Coucou {prenom} ! {identite} ici. {maitre} m'a dit la bonne nouvelle et on voulait te féliciter tous les deux. Bravo et encore bravo ! 🎊🐾",
];

export function getPetThirdPartyMessages(
  petType: string,
  occasion: PetThirdPartyOccasion,
): string[] {
  if (occasion === 'birthday') {
    if (petType === 'chien') return CHIEN_BIRTHDAY;
    if (petType === 'chat')  return CHAT_BIRTHDAY;
    return AUTRE_BIRTHDAY;
  }
  if (occasion === 'nameday') {
    if (petType === 'chien') return CHIEN_NAMEDAY;
    if (petType === 'chat')  return CHAT_NAMEDAY;
    return AUTRE_NAMEDAY;
  }
  if (occasion === 'bonjour') {
    if (petType === 'chien') return CHIEN_BONJOUR;
    if (petType === 'chat')  return CHAT_BONJOUR;
    return AUTRE_BONJOUR;
  }
  if (occasion === 'merci') {
    if (petType === 'chien') return CHIEN_MERCI;
    if (petType === 'chat')  return CHAT_MERCI;
    return AUTRE_MERCI;
  }
  if (occasion === 'encouragement') {
    if (petType === 'chien') return CHIEN_ENCOURAGEMENT;
    if (petType === 'chat')  return CHAT_ENCOURAGEMENT;
    return AUTRE_ENCOURAGEMENT;
  }
  if (occasion === 'bonne_nouvelle') {
    if (petType === 'chien') return CHIEN_BONNE_NOUVELLE;
    if (petType === 'chat')  return CHAT_BONNE_NOUVELLE;
    return AUTRE_BONNE_NOUVELLE;
  }
  // fallback
  if (petType === 'chien') return CHIEN_BIRTHDAY;
  if (petType === 'chat')  return CHAT_BIRTHDAY;
  return AUTRE_BIRTHDAY;
}

function formatOwnerName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const upper = parts.filter(p => p.length > 1 && p === p.toUpperCase());
  const mixed = parts.filter(p => p.length <= 1 || p !== p.toUpperCase());
  return mixed.length && upper.length ? [...mixed, ...upper].join(' ') : name;
}

export function buildPetIdentite(
  petName: string,
  petType: string,
  breed: string | null | undefined,
  petGender: string | null | undefined,
  ownerName: string,
): string {
  const article    = petGender === 'female' ? 'la' : 'le';
  const descriptor = breed || petType || 'animal';
  return `${petName}, ${article} ${descriptor} de ${formatOwnerName(ownerName)}`;
}

export function fillPetThirdPartyMessage(
  template: string,
  prenom: string,
  identite: string,
  nomAnimal: string,
  maitre: string,
): string {
  return template
    .replace(/\{prenom\}/gi,     prenom)
    .replace(/\{identite\}/gi,   identite)
    .replace(/\{nom_animal\}/gi, nomAnimal)
    .replace(/\{maitre\}/gi,     maitre);
}
