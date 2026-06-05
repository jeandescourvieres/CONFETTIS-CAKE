-- Templates pour l'occasion "Coucou / Salutations" (greetings)
-- 10 court/tu + 10 court/vous + 10 moyen/tu + 10 moyen/vous + 10 long/tu + 10 long/vous = 60 templates

INSERT INTO message_templates (id, occasion, ton, longueur, title, content, is_system, created_at) VALUES

-- ── COURT / TU ────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Coucou', 'Coucou {prenom} 😊', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Salut', 'Salut !', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Hello', 'Hello !', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Petit coucou', 'Petit coucou 👋', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Je pense à toi', 'Je pense à toi', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Coucou ça va', 'Coucou, ça va ?', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Salut prénom', 'Salut {prenom} !', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Un petit message', 'Un petit message pour toi', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Comment ça va', 'Hello, comment ça va ?', true, now()),
(gen_random_uuid(), 'greetings', 'tu', 'court', 'Coucou smiley', 'Coucou 😊', true, now()),

-- ── COURT / VOUS ──────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonjour', 'Bonjour {prenom}', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonjour simple', 'Bonjour !', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Hello', 'Hello !', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Un petit message', 'Un petit message pour vous', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Je pense à vous', 'Je pense à vous', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Comment allez-vous', 'Bonjour, comment allez-vous ?', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'J''espère que vous allez bien', 'Bonjour {prenom}, j''espère que vous allez bien', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Un petit bonjour', 'Un petit bonjour 👋', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Hello vous allez bien', 'Hello, j''espère que vous allez bien', true, now()),
(gen_random_uuid(), 'greetings', 'vous', 'court', 'Bonjour smiley', 'Bonjour 😊', true, now()),

-- ── MOYEN / TU ────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Prendre de tes nouvelles',
'Coucou {prenom} 😊 Je voulais prendre de tes nouvelles, j''espère que tu vas bien.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Ça fait un moment',
'Salut ! Ça fait un moment, je voulais voir comment tu allais.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Tout va bien de ton côté',
'Hello ! J''espère que tout va bien de ton côté.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Une petite pensée',
'Coucou ! Une petite pensée pour toi aujourd''hui.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Tout roule',
'Salut {prenom} ! J''espère que tout roule pour toi.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Petit signe',
'Coucou 😊 Je voulais juste te faire un petit signe.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Comment ça va en ce moment',
'Hello ! Comment ça va en ce moment ?', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Bonnes journées',
'Salut ! J''espère que tu passes de bonnes journées.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Je pense à toi',
'Coucou {prenom} ! Je pense à toi, j''espère que tout va bien.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'moyen', 'Juste tes nouvelles',
'Salut 😊 Je voulais juste prendre de tes nouvelles.', true, now()),

-- ── MOYEN / VOUS ──────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Prendre de vos nouvelles',
'Bonjour {prenom}, je voulais prendre de vos nouvelles, j''espère que vous allez bien.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Cela faisait un moment',
'Bonjour ! Cela faisait un moment, je voulais savoir comment vous alliez.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Tout va bien de votre côté',
'Hello ! J''espère que tout va bien de votre côté.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Une petite pensée',
'Bonjour, une petite pensée pour vous aujourd''hui.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Tout se passe bien',
'Bonjour {prenom}, j''espère que tout se passe bien pour vous.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Un petit message',
'Bonjour 😊 Je voulais simplement vous adresser un petit message.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Comment allez-vous',
'Bonjour ! Comment allez-vous en ce moment ?', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Bonnes journées',
'Bonjour, j''espère que vos journées se passent bien.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Je pense à vous',
'Bonjour {prenom}, je pense à vous et espère que tout va bien.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'moyen', 'Simplement vos nouvelles',
'Bonjour 😊 Je voulais simplement prendre de vos nouvelles.', true, now()),

-- ── LONG / TU ─────────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'tu', 'long', 'Ça faisait un moment',
E'Coucou {prenom} 😊\nJe me suis dit que ça faisait un moment et que ce serait sympa de prendre de tes nouvelles.\nJ\'espère que tout va bien pour toi en ce moment.\nÇa me ferait plaisir d\'avoir de tes nouvelles.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Un petit message',
E'Salut !\nJe voulais juste t\'envoyer un petit message pour savoir comment tu allais.\nJ\'espère que tout se passe bien de ton côté.\nDonne-moi de tes nouvelles quand tu peux.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Une petite pensée',
E'Hello {prenom} !\nUne petite pensée pour toi aujourd\'hui, j\'espère que tout va bien.\nÇa fait toujours plaisir de prendre des nouvelles.\nJ\'espère que tout roule pour toi.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Comment tu allais',
E'Coucou 😊\nJe voulais simplement prendre de tes nouvelles et voir comment tu allais.\nJ\'espère que tout se passe bien pour toi en ce moment.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Je t''allais écrire',
E'Salut {prenom} !\nJe me suis dit que j\'allais t\'écrire pour savoir comment tu allais.\nJ\'espère que tout va bien de ton côté.\nÇa me ferait plaisir d\'avoir de tes nouvelles.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Je pense à toi',
E'Hello !\nUn petit message pour prendre de tes nouvelles et te dire que je pense à toi.\nJ\'espère que tout va bien.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Ces derniers temps',
E'Coucou {prenom} 😊\nJe voulais te faire un petit signe et voir comment tu allais ces derniers temps.\nJ\'espère que tout se passe bien.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Je prends le temps',
E'Salut !\nÇa faisait un moment, alors je prends le temps de t\'écrire.\nJ\'espère que tout va bien pour toi.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'De ton côté',
E'Hello {prenom} !\nUne petite pensée pour toi aujourd\'hui.\nJ\'espère que tout se passe bien de ton côté.', true, now()),

(gen_random_uuid(), 'greetings', 'tu', 'long', 'Tu vas bien',
E'Coucou 😊\nJuste un petit message pour prendre de tes nouvelles.\nJ\'espère que tu vas bien.', true, now()),

-- ── LONG / VOUS ───────────────────────────────────────────────────────────────
(gen_random_uuid(), 'greetings', 'vous', 'long', 'Prendre un moment',
E'Bonjour {prenom},\nJe souhaitais prendre un moment pour vous écrire et prendre de vos nouvelles.\nJ\'espère que tout se passe bien pour vous en ce moment.\nCe serait un plaisir d\'avoir de vos nouvelles.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Comment vous allez',
E'Bonjour,\nJe me permets de vous envoyer ce message pour savoir comment vous allez.\nJ\'espère que tout va bien de votre côté.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Une pensée pour vous',
E'Bonjour {prenom},\nUne petite pensée pour vous aujourd\'hui.\nJ\'espère que tout se passe bien et que vous allez bien.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Vos nouvelles',
E'Bonjour 😊\nJe voulais simplement prendre de vos nouvelles.\nJ\'espère que tout va bien pour vous.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Cela faisait un moment',
E'Bonjour {prenom},\nCela faisait un moment, alors je me permets de vous écrire.\nJ\'espère que tout se passe bien de votre côté.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Ce message pour vous',
E'Bonjour,\nJe vous adresse ce message pour prendre de vos nouvelles.\nJ\'espère que tout va bien.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Je pensais à vous',
E'Bonjour {prenom},\nJe pensais à vous et souhaitais savoir comment vous alliez.\nJ\'espère que tout se passe bien.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Un petit message',
E'Bonjour 😊\nUn petit message pour prendre de vos nouvelles.\nJ\'espère que tout va bien pour vous.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Vous adresser un message',
E'Bonjour {prenom},\nJe souhaitais simplement vous adresser un message et prendre de vos nouvelles.\nJ\'espère que vous allez bien.', true, now()),

(gen_random_uuid(), 'greetings', 'vous', 'long', 'Ces derniers temps',
E'Bonjour,\nJe voulais simplement savoir comment vous alliez ces derniers temps.\nJ\'espère que tout se passe bien.', true, now());
