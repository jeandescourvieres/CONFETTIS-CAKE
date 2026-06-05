-- Templates "Salutations / Coucou" pour l'option "Choisir un modèle"
-- is_manual_only = false (valeur par défaut) → accessibles depuis "Choisir un modèle"
-- 10 court/tu + 10 court/vous + 10 moyen/tu + 10 moyen/vous + 10 long/tu + 10 long/vous = 60 templates

INSERT INTO message_templates (id, occasion, ton, longueur, title, content, is_system, is_manual_only, created_at) VALUES

-- ── COURT / TU ────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Hello', 'Hello !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Bonjour', 'Bonjour !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Salut', 'Salut !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Hey', 'Hey !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Coucou', 'Coucou !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Hello toi', 'Hello toi !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Salut toi', 'Salut toi !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Hey toi', 'Hey toi !', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Comment ça va', 'Hello, comment ça va ?', true, false, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Comment vas-tu', 'Salut, comment vas-tu ?', true, false, now()),

-- ── COURT / VOUS ──────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonjour simple', 'Bonjour.', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonjour prénom', 'Bonjour, {prenom}.', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Hello', 'Hello.', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonjour à vous', 'Bonjour à vous.', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Comment allez-vous', 'Bonjour, comment allez-vous ?', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonjour prénom comment allez-vous', 'Bonjour, {prenom}, comment allez-vous ?', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonne journée', 'Je vous souhaite une bonne journée.', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'En quoi puis-je vous aider', 'Bonjour, en quoi puis-je vous aider ?', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Mes salutations', 'Je vous adresse mes salutations.', true, false, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Excellente journée', 'Hello, je vous souhaite une excellente journée.', true, false, now()),

-- ── MOYEN / TU ────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Te dire bonjour',
'Hello ! Je voulais juste te dire bonjour.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Bonne journée',
'Salut ! Je t''envoie un petit mot pour te souhaiter une bonne journée.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Je pensais à toi',
'Hey ! Je pensais à toi et je voulais te dire hello.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Comment vas-tu aujourd''hui',
'Bonjour, comment vas-tu aujourd''hui ?', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Excellente journée',
'Hello ! Je tenais à te souhaiter une excellente journée.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Petit message pour dire hello',
'Coucou, je t''adresse ce petit message pour te dire hello.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Prendre des nouvelles',
'Salut ! Je te fais un petit coucou pour prendre des nouvelles.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Te souhaiter le meilleur',
'Hello ! Je tenais à te dire bonjour et à te souhaiter le meilleur.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'J''espère que tu vas bien',
'Bonjour, j''espère que tu vas bien !', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Je pense à toi',
'Hello ! Je t''envoie ce message pour te dire que je pense à toi.', true, false, now()),

-- ── MOYEN / VOUS ──────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Excellente journée',
'Hello ! Je tenais à vous souhaiter une excellente journée.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Comment allez-vous aujourd''hui',
'Bonjour, comment allez-vous aujourd''hui ?', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'J''espère que vous allez bien',
'Bonjour, {prenom}, j''espère que vous allez bien.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Bonne journée',
'Hello, je tenais à vous souhaiter une bonne journée.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Comment puis-je vous aider',
'Bonjour, comment puis-je vous aider aujourd''hui ?', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Journée productive',
'Bonjour, je vous souhaite une journée productive.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Vous souhaiter le meilleur',
'Hello, je tenais à vous dire bonjour et vous souhaiter le meilleur.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Comment se passe votre journée',
'Bonjour, comment se passe votre journée ?', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Vous saluer',
'Hello, je vous adresse ce message pour vous saluer.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Simplement vous dire hello',
'Bonjour, je souhaitais simplement vous dire hello.', true, false, now()),

-- ── LONG / TU ─────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'tu', 'long', 'Excellente journée et soutien',
E'Hello ! Je tenais à te dire bonjour et à te souhaiter une excellente journée. J\'espère que tout va bien pour toi et que cette journée sera aussi belle que ton sourire. N\'hésite pas à me faire signe si tu as besoin de quoi que ce soit, je suis là pour toi.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Tu comptes pour moi',
E'Salut ! Je t\'envoie ce petit message pour te dire hello et te rappeler à quel point tu comptes pour moi. Que cette journée soit remplie de bonheur, de sérénité et de moments agréables. Prends soin de toi, et sache que je suis toujours là pour toi.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Journée lumineuse',
E'Hey ! Je tenais à te dire hello et à te souhaiter une journée aussi lumineuse que ton cœur. J\'espère que tu vas bien et que chaque moment sera une nouvelle raison de sourire. Si jamais tu as besoin de parler, je suis là pour t\'écouter.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Journée aussi belle que toi',
E'Hello, comment vas-tu aujourd\'hui ? Je tenais à te souhaiter une journée aussi belle que toi. Que chaque instant soit une nouvelle raison de sourire, et n\'oublie pas que tu es entouré(e) de personnes qui t\'aiment.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Tu es formidable',
E'Hello ! Je voulais juste te dire bonjour et te rappeler que tu es une personne formidable. Que cette journée t\'apporte tout ce que tu mérites : bonheur, paix et réussite. Je suis là pour toi, toujours.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Journée remplie de joie',
E'Coucou ! Je t\'envoie ce message pour te dire hello et te souhaiter une journée remplie de joie. J\'espère que tu passes un excellent moment et que tout se passe bien pour toi.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Tu es important pour moi',
E'Salut ! Je tenais à te dire hello et à te rappeler que tu es important(e) pour moi. Que cette journée soit aussi belle que ton sourire, et que chaque moment soit une nouvelle raison de croire en la beauté de la vie.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Je devais te dire bonjour',
E'Hello ! Je passais par ici (en pensée) et je me suis dit que je devais te dire bonjour. J\'espère que ta journée est aussi lumineuse que ton cœur.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Je pense à toi aujourd''hui',
E'Bonjour ! Je tenais à te dire que je pense à toi aujourd\'hui. Que cette journée soit remplie de bonheur et de sérénité, et que chaque instant soit une nouvelle aventure à savourer.', true, false, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Tu comptes tellement',
E'Hello ! Je tenais à te souhaiter une journée aussi belle que toi. Que chaque moment soit une nouvelle raison de sourire, et que tu saches à quel point tu comptes pour moi.', true, false, now()),

-- ── LONG / VOUS ───────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'vous', 'long', 'Excellente journée productive',
E'Hello ! Je tenais à vous souhaiter une excellente journée. J\'espère que tout va bien pour vous et que cette journée sera aussi productive que vous le souhaitez. N\'hésitez pas à me contacter si vous avez besoin de quoi que ce soit, je suis là pour vous.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Vous comptez pour moi',
E'Bonjour, {prenom} ! Je voulais simplement prendre un moment pour vous dire hello et vous rappeler à quel point vous comptez pour moi. Que cette journée soit remplie de bonheur, de sérénité et de moments agréables. Prenez soin de vous, et sachez que je suis toujours là pour vous.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Journée lumineuse',
E'Hello ! Je vous adresse ce message pour vous dire bonjour et vous souhaiter une journée aussi lumineuse que votre cœur. J\'espère que vous allez bien et que chaque moment sera une nouvelle raison de sourire. Si jamais vous avez besoin de parler, je suis là pour vous écouter.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Journée aussi belle que vous',
E'Bonjour, comment allez-vous aujourd\'hui ? Je tenais à vous souhaiter une journée aussi belle que vous. Que chaque moment soit une nouvelle raison de sourire, et n\'oubliez pas que vous êtes entouré(e) de personnes qui vous aiment.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Vous êtes formidable',
E'Hello, {prenom} ! Je tenais à vous dire bonjour et à vous rappeler que vous êtes une personne formidable. Que cette journée vous apporte tout ce que vous méritez : bonheur, paix et réussite. Je suis là pour vous, toujours.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Journée remplie de joie',
E'Hello ! Je vous envoie ce message pour vous dire bonjour et vous souhaiter une journée remplie de joie. J\'espère que vous passez un excellent moment et que tout se passe bien pour vous.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Vous êtes important pour moi',
E'Bonjour ! Je tenais à vous dire hello et à vous rappeler que vous êtes important(e) pour moi. Que cette journée soit aussi belle que votre sourire, et que chaque moment soit une nouvelle raison de croire en la beauté de la vie.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Votre journée lumineuse',
E'Hello ! Je vous adresse ce message pour vous dire bonjour. J\'espère que votre journée est aussi lumineuse que votre cœur.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Vous comptez tellement',
E'Bonjour ! Je tenais à vous souhaiter une journée aussi belle que vous. Que chaque moment soit une nouvelle raison de sourire, et que vous sachiez à quel point vous comptez pour moi.', true, false, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Bonheur et sérénité',
E'Hello, {prenom} ! Je tenais à vous dire bonjour et à vous souhaiter une journée remplie de bonheur et de sérénité. Que chaque instant soit une nouvelle aventure à savourer.', true, false, now());
