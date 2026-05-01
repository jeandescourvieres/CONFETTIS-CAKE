-- Migration 050 : Fête des Pères + Promotion
-- 60 messages each × 2 occasions = 120 messages

ALTER TABLE message_templates ADD COLUMN IF NOT EXISTS ton TEXT CHECK (ton IN ('tu','vous'));
ALTER TABLE message_templates ADD COLUMN IF NOT EXISTS longueur TEXT CHECK (longueur IN ('court','moyen','long'));

-- ════════════════════════════════════════════════════════
-- FÊTE DES PÈRES (fathersday)
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','tu','court','Bonne fête papa 💛','Bonne fête papa 💛',true),
('fathersday','tu','court','Bonne fête !','Bonne fête {prenom} !',true),
('fathersday','tu','court','Une très belle fête à toi','Une très belle fête à toi',true),
('fathersday','tu','court','Bonne fête !','Bonne fête !',true),
('fathersday','tu','court','Je pense à toi aujourd''hui','Je pense à toi aujourd''hui',true),
('fathersday','tu','court','Belle fête des pères','Belle fête des pères',true),
('fathersday','tu','court','Bonne fête papa ❤️','Bonne fête papa ❤️',true),
('fathersday','tu','court','Profite bien de ta journée','Profite bien de ta journée',true),
('fathersday','tu','court','Bonne fête !','Bonne fête !',true),
('fathersday','tu','court','Une pensée pour toi','Une pensée pour toi',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','tu','moyen','Bonne fête papa 💛','Bonne fête papa 💛 Je te souhaite une très belle journée.',true),
('fathersday','tu','moyen','Merci pour tout ce que tu fais','Bonne fête {prenom} ! Merci pour tout ce que tu fais.',true),
('fathersday','tu','moyen','Une belle occasion de te dire merci','Bonne fête ! Une belle occasion de te dire merci.',true),
('fathersday','tu','moyen','Profite bien de ta journée','Bonne fête papa ❤️ Profite bien de ta journée.',true),
('fathersday','tu','moyen','Beaucoup de bonheur','Bonne fête {prenom} ! Je te souhaite beaucoup de bonheur.',true),
('fathersday','tu','moyen','Une pensée pour toi aujourd''hui','Bonne fête ! Une pensée pour toi aujourd''hui.',true),
('fathersday','tu','moyen','Merci pour ton soutien','Bonne fête papa 💛 Merci pour ton soutien.',true),
('fathersday','tu','moyen','Une belle journée','Bonne fête {prenom} ! Je te souhaite une belle journée.',true),
('fathersday','tu','moyen','Profite bien de ce moment','Bonne fête ! Profite bien de ce moment.',true),
('fathersday','tu','moyen','Plein de beaux moments','Bonne fête papa ! Je te souhaite plein de beaux moments.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','tu','long','Combien tu es important pour moi','Bonne fête papa 💛 Je voulais te dire combien tu es important pour moi. Merci pour tout ce que tu fais et pour ton soutien. Je te souhaite une très belle journée.',true),
('fathersday','tu','long','Te remercier pour tout','Bonne fête {prenom} ! Une belle occasion de te remercier pour tout. Je te souhaite beaucoup de bonheur aujourd''hui.',true),
('fathersday','tu','long','Une journée spéciale pour te dire merci','Bonne fête ! Une journée spéciale pour te dire merci et te souhaiter une belle journée.',true),
('fathersday','tu','long','Ta présence et ton soutien','Bonne fête papa ❤️ Merci pour ta présence et ton soutien. Je te souhaite une journée douce et agréable.',true),
('fathersday','tu','long','Remplie de moments agréables','Bonne fête {prenom} ! Je te souhaite une journée remplie de moments agréables.',true),
('fathersday','tu','long','Beaucoup d''affection','Bonne fête ! Une pensée pour toi avec beaucoup d''affection.',true),
('fathersday','tu','long','Beaucoup de bonheur','Bonne fête papa 💛 Je te souhaite beaucoup de bonheur.',true),
('fathersday','tu','long','Merci pour tout ce que tu fais','Bonne fête {prenom} ! Merci pour tout ce que tu fais.',true),
('fathersday','tu','long','Une journée pour te faire plaisir','Bonne fête ! Une journée pour te faire plaisir.',true),
('fathersday','tu','long','Une très belle journée','Bonne fête papa ! Je te souhaite une très belle journée.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','vous','court','Bonne fête {prenom} !','Bonne fête {prenom} !',true),
('fathersday','vous','court','Très belle fête à vous','Très belle fête à vous',true),
('fathersday','vous','court','Bonne fête !','Bonne fête !',true),
('fathersday','vous','court','Une pensée pour vous','Une pensée pour vous',true),
('fathersday','vous','court','Belle fête des pères','Belle fête des pères',true),
('fathersday','vous','court','Bonne fête !','Bonne fête !',true),
('fathersday','vous','court','Je vous souhaite une belle journée','Je vous souhaite une belle journée',true),
('fathersday','vous','court','Bonne fête {prenom}','Bonne fête {prenom}',true),
('fathersday','vous','court','Profitez bien de cette journée','Profitez bien de cette journée',true),
('fathersday','vous','court','Bonne fête !','Bonne fête !',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','vous','moyen','Une très belle journée','Bonne fête {prenom} ! Je vous souhaite une très belle journée.',true),
('fathersday','vous','moyen','Une pensée pour vous aujourd''hui','Bonne fête ! Une pensée pour vous aujourd''hui.',true),
('fathersday','vous','moyen','Merci pour tout ce que vous faites','Bonne fête {prenom} ! Merci pour tout ce que vous faites.',true),
('fathersday','vous','moyen','Beaucoup de bonheur','Bonne fête ! Je vous souhaite beaucoup de bonheur.',true),
('fathersday','vous','moyen','Profitez bien de cette journée','Bonne fête {prenom} ! Profitez bien de cette journée.',true),
('fathersday','vous','moyen','Une journée agréable','Bonne fête ! Je vous souhaite une journée agréable.',true),
('fathersday','vous','moyen','Une belle journée à vous','Bonne fête {prenom} ! Une belle journée à vous.',true),
('fathersday','vous','moyen','Mes pensées','Bonne fête ! Je vous adresse mes pensées.',true),
('fathersday','vous','moyen','De beaux moments','Bonne fête {prenom} ! Je vous souhaite de beaux moments.',true),
('fathersday','vous','moyen','Profitez bien de cette journée','Bonne fête ! Profitez bien de cette journée.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','vous','long','Remplie de douceur et de moments agréables','Bonne fête {prenom} ! Je vous souhaite une très belle journée remplie de douceur et de moments agréables. Profitez pleinement de cette occasion.',true),
('fathersday','vous','long','Une journée spéciale pour vous dire merci','Bonne fête ! Une journée spéciale pour vous dire merci. Je vous souhaite beaucoup de bonheur.',true),
('fathersday','vous','long','Je vous remercie pour tout ce que vous faites','Bonne fête {prenom} ! Je vous remercie pour tout ce que vous faites. Je vous souhaite une belle journée.',true),
('fathersday','vous','long','En cette journée particulière','Bonne fête ! Je vous adresse mes pensées en cette journée particulière.',true),
('fathersday','vous','long','De beaux moments aujourd''hui','Bonne fête {prenom} ! Je vous souhaite de beaux moments aujourd''hui.',true),
('fathersday','vous','long','Une belle journée à vous','Bonne fête ! Une belle journée à vous.',true),
('fathersday','vous','long','Une journée agréable','Bonne fête {prenom} ! Je vous souhaite une journée agréable.',true),
('fathersday','vous','long','Profitez bien de cette journée','Bonne fête ! Profitez bien de cette journée.',true),
('fathersday','vous','long','Mes meilleurs vœux','Bonne fête {prenom} ! Je vous adresse mes meilleurs vœux.',true),
('fathersday','vous','long','Une très belle journée','Bonne fête ! Je vous souhaite une très belle journée.',true);

-- ════════════════════════════════════════════════════════
-- PROMOTION
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('promotion','tu','court','Félicitations pour ta promotion 🎉','Félicitations pour ta promotion 🎉',true),
('promotion','tu','court','Bravo !','Bravo {prenom} !',true),
('promotion','tu','court','Quelle belle réussite !','Quelle belle réussite !',true),
('promotion','tu','court','Félicitations !','Félicitations !',true),
('promotion','tu','court','Bien mérité 👏','Bien mérité 👏',true),
('promotion','tu','court','Bravo pour cette promotion','Bravo pour cette promotion',true),
('promotion','tu','court','Félicitations 🎉','Félicitations 🎉',true),
('promotion','tu','court','Une belle étape franchie','Une belle étape franchie',true),
('promotion','tu','court','Bravo !','Bravo !',true),
('promotion','tu','court','Félicitations pour cette évolution','Félicitations pour cette évolution',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('promotion','tu','moyen','Tu peux être fier(ère) de toi','Félicitations pour ta promotion {prenom} 🎉 Tu peux être fier(ère) de toi.',true),
('promotion','tu','moyen','Une étape importante franchie','Bravo pour cette belle réussite ! Une étape importante franchie.',true),
('promotion','tu','moyen','Cette promotion est bien méritée','Félicitations ! Cette promotion est bien méritée.',true),
('promotion','tu','moyen','Ton travail a payé','Bravo {prenom} ! Ton travail a payé.',true),
('promotion','tu','moyen','Une belle évolution','Félicitations pour ta promotion ! Une belle évolution.',true),
('promotion','tu','moyen','Beaucoup de réussite','Bravo ! Je te souhaite beaucoup de réussite.',true),
('promotion','tu','moyen','Une nouvelle étape commence','Félicitations {prenom} ! Une nouvelle étape commence.',true),
('promotion','tu','moyen','Tu peux être fier(ère)','Bravo pour cette promotion ! Tu peux être fier(ère).',true),
('promotion','tu','moyen','Une belle récompense pour ton travail','Félicitations ! Une belle récompense pour ton travail.',true),
('promotion','tu','moyen','Le meilleur pour la suite','Bravo {prenom} ! Je te souhaite le meilleur pour la suite.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('promotion','tu','long','Une belle reconnaissance de ton travail','Félicitations pour ta promotion {prenom} 🎉 C''est une belle reconnaissance de ton travail et de ton engagement. Tu peux être fier(ère) de ton parcours. Je te souhaite beaucoup de réussite pour la suite.',true),
('promotion','tu','long','Tout ce que tu as accompli','Bravo pour cette belle réussite ! Cette promotion marque une étape importante et reflète tout ce que tu as accompli. Je te souhaite beaucoup de succès.',true),
('promotion','tu','long','T''épanouir dans ce nouveau rôle','Félicitations ! Une belle évolution qui récompense ton travail. Je te souhaite de t''épanouir pleinement dans ce nouveau rôle.',true),
('promotion','tu','long','Le fruit de ton investissement','Bravo {prenom} ! Cette promotion est le fruit de ton investissement. Je te souhaite beaucoup de réussite.',true),
('promotion','tu','long','De belles opportunités','Félicitations pour ta promotion ! Une nouvelle étape commence avec de belles opportunités.',true),
('promotion','tu','long','Amplement mérité','Bravo ! Ton travail a été reconnu, et c''est amplement mérité.',true),
('promotion','tu','long','Une étape importante dans ton parcours','Félicitations {prenom} ! Une étape importante dans ton parcours.',true),
('promotion','tu','long','Beaucoup de réussite pour la suite','Bravo pour cette promotion ! Je te souhaite beaucoup de réussite pour la suite.',true),
('promotion','tu','long','Une belle reconnaissance','Félicitations ! Une belle reconnaissance de ton travail.',true),
('promotion','tu','long','Continuer sur cette belle lancée','Bravo {prenom} ! Je te souhaite de continuer sur cette belle lancée.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('promotion','vous','court','Félicitations pour votre promotion 🎉','Félicitations pour votre promotion 🎉',true),
('promotion','vous','court','Bravo !','Bravo {prenom} !',true),
('promotion','vous','court','Quelle belle réussite !','Quelle belle réussite !',true),
('promotion','vous','court','Félicitations !','Félicitations !',true),
('promotion','vous','court','Bien mérité 👏','Bien mérité 👏',true),
('promotion','vous','court','Bravo pour cette promotion','Bravo pour cette promotion',true),
('promotion','vous','court','Félicitations 🎉','Félicitations 🎉',true),
('promotion','vous','court','Une belle étape franchie','Une belle étape franchie',true),
('promotion','vous','court','Bravo !','Bravo !',true),
('promotion','vous','court','Félicitations pour cette évolution','Félicitations pour cette évolution',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('promotion','vous','moyen','Vous pouvez être fier(ère)','Félicitations pour votre promotion {prenom} 🎉 Vous pouvez être fier(ère).',true),
('promotion','vous','moyen','Une étape importante franchie','Bravo pour cette belle réussite ! Une étape importante franchie.',true),
('promotion','vous','moyen','Cette promotion est bien méritée','Félicitations ! Cette promotion est bien méritée.',true),
('promotion','vous','moyen','Votre travail a porté ses fruits','Bravo {prenom} ! Votre travail a porté ses fruits.',true),
('promotion','vous','moyen','Une belle évolution','Félicitations pour votre promotion ! Une belle évolution.',true),
('promotion','vous','moyen','Beaucoup de réussite','Bravo ! Je vous souhaite beaucoup de réussite.',true),
('promotion','vous','moyen','Une nouvelle étape commence','Félicitations {prenom} ! Une nouvelle étape commence.',true),
('promotion','vous','moyen','Vous pouvez être fier(ère)','Bravo pour cette promotion ! Vous pouvez être fier(ère).',true),
('promotion','vous','moyen','Une belle récompense pour votre travail','Félicitations ! Une belle récompense pour votre travail.',true),
('promotion','vous','moyen','Le meilleur pour la suite','Bravo {prenom} ! Je vous souhaite le meilleur pour la suite.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('promotion','vous','long','Une belle reconnaissance de votre travail','Félicitations pour votre promotion {prenom} 🎉 C''est une belle reconnaissance de votre travail et de votre engagement. Je vous souhaite beaucoup de réussite pour la suite.',true),
('promotion','vous','long','Une étape importante dans votre parcours','Bravo pour cette belle réussite ! Cette promotion marque une étape importante dans votre parcours. Je vous souhaite beaucoup de succès.',true),
('promotion','vous','long','Vous épanouir dans ce nouveau rôle','Félicitations ! Une belle évolution qui récompense votre travail. Je vous souhaite de vous épanouir dans ce nouveau rôle.',true),
('promotion','vous','long','Le fruit de votre investissement','Bravo {prenom} ! Cette promotion est le fruit de votre investissement.',true),
('promotion','vous','long','Une nouvelle étape pleine d''opportunités','Félicitations pour votre promotion ! Une nouvelle étape pleine d''opportunités.',true),
('promotion','vous','long','Votre travail a été reconnu','Bravo ! Votre travail a été reconnu, et c''est mérité.',true),
('promotion','vous','long','Une étape importante dans votre parcours','Félicitations {prenom} ! Une étape importante dans votre parcours.',true),
('promotion','vous','long','Beaucoup de réussite','Bravo pour cette promotion ! Je vous souhaite beaucoup de réussite.',true),
('promotion','vous','long','Une belle reconnaissance de votre travail','Félicitations ! Une belle reconnaissance de votre travail.',true),
('promotion','vous','long','Continuer sur cette lancée','Bravo {prenom} ! Je vous souhaite de continuer sur cette lancée.',true);
