-- Patch: first message of each chien anniv volume 4-10 (missed by parser)

insert into public.message_templates (user_id,title,content,tone,is_system,is_manual_only,occasion,animal_type,animal_direction) values

(null,'Joyeux anniversaire. J''ai observé ta façon de choisir le gâteau.',$$Joyeux anniversaire. J''ai observé ta façon de choisir le gâteau.
Tu en avais regardé plusieurs. En ligne d''abord. Puis tu es allé en chercher un en vrai. Tu es revenu avec celui-là. Je l''ai senti depuis l''entrée avant même que tu l''aies posé. Tu avais choisi le bon. Je le savais à l''odeur. Toi tu le savais autrement. On était d''accord tous les deux. Joyeux anniversaire, mon humain préféré.
Avec validation olfactive du choix et accord inter-espèces confirmé, — {prenom}, ton animal expert en sélection de gâteaux par le nez 🎂$$,'humorous',true,false,'birthday','chien','from'),

(null,'Joyeux anniversaire. J''ai observé ta façon de tenir la porte pour quelqu''un.',$$Joyeux anniversaire. J''ai observé ta façon de tenir la porte pour quelqu''un.
Tu le fais toujours. Même si tu es loin. Tu attends. Tu tiens la porte plus longtemps que nécessaire pour que l''autre n''ait pas à se presser. Ce geste coûte deux secondes. Il dit tout sur ta façon d''être. Ces deux secondes de considération pour quelqu''un d''autre. Répétées chaque fois. Sans exception. Joyeux anniversaire, mon humain préféré, dont les deux secondes comptent.
Avec observation de tes deux secondes de politesse et leur signification profonde, — {prenom}, ton animal attentif à tes gestes les plus petits 🚪$$,'touching',true,false,'birthday','chien','from'),

(null,'Joyeux anniversaire. J''ai observé ta façon d''ouvrir le vin.',$$Joyeux anniversaire. J''ai observé ta façon d''ouvrir le vin.
Avec le tire-bouchon que tu utilises depuis des années. Tu vérifies l''étiquette encore une fois. Tu coupes la capsule proprement. Tu insères la vis avec soin. Et tu tires avec cette légère inclinaison de la tête qui dit que tu fais attention. Ce geste répété cent fois qui reste quand même un geste. Joyeux anniversaire, mon humain préféré.
Avec observation du rituel du tire-bouchon et respect pour sa répétition soigneuse, — {prenom}, ton animal amateur de tes gestes rituels 🍷$$,'humorous',true,false,'birthday','chien','from'),

(null,'Joyeux anniversaire. J''ai observé ta façon de circuler entre les groupes de conversation.',$$Joyeux anniversaire. J''ai observé ta façon de circuler entre les groupes de conversation.
Tu ne restes jamais trop longtemps dans un groupe. Tu fais le tour. Tu t''arrêtes. Tu contribues. Tu relances. Tu passes. Personne ne se sent abandonné. Tu es partout et nulle part à la fois. C''est l''art de recevoir dans sa forme la plus accomplie. Joyeux anniversaire, mon humain préféré.
Avec admiration pour ta chorégraphie sociale et sa précision non ostentatoire, — {prenom}, ton animal spectateur de ton art de recevoir 💃$$,'humorous',true,false,'birthday','chien','from'),

(null,'Pour ton anniversaire j''ai observé ta façon de tenir la porte pour quelqu''un qui part.',$$Pour ton anniversaire j''ai observé ta façon de tenir la porte pour quelqu''un qui part.
Même chose qu''à l''arrivée. Tu te lèves. Tu accompagnes jusqu''à la porte. Tu tiens. Tu attends que l''autre soit vraiment parti. Cette symétrie entre l''accueil et le départ. Chaque personne est reçue et quittée avec le même soin. Joyeux anniversaire, mon humain préféré.
Avec observation de ta symétrie entre accueil et départ et sa signification sur ta valeur des gens, — {prenom}, ton animal admirateur de ta cohérence 🚪$$,'touching',true,false,'birthday','chien','from'),

(null,'Pour ton anniversaire j''ai observé ta façon de retrouver tes affaires dans le chaos post-fête.',$$Pour ton anniversaire j''ai observé ta façon de retrouver tes affaires dans le chaos post-fête.
Ton téléphone. Tes clés. Le tire-bouchon. Les choses qui migrent pendant une soirée. Tu cherches avec méthode. Tu sais approximativement où chercher parce que tu connais les habitudes des objets chez toi. Et tu trouves. Toujours. Joyeux anniversaire, mon humain préféré.
Avec admiration pour ta cartographie intime de tes propres objets, — {prenom}, ton animal qui observe ta maîtrise de ton territoire 🗺️$$,'touching',true,false,'birthday','chien','from'),

(null,'Joyeux anniversaire. J''ai observé ta façon de te préparer le matin de ton anniversaire.',$$Joyeux anniversaire. J''ai observé ta façon de te préparer le matin de ton anniversaire.
Pas différemment des autres matins en apparence. Mêmes gestes. Même ordre. Mais quelque chose dans le rythme était légèrement différent. Un peu plus attentif. Un peu plus présent à chaque geste. Comme quelqu''un qui sait que la journée qui commence a du sens. Joyeux anniversaire, mon humain préféré.
Avec détection de ta légère différence matinale d''anniversaire et sa signification, — {prenom}, ton animal expert en variations de tes routines 🌅$$,'humorous',true,false,'birthday','chien','from')

on conflict do nothing;
