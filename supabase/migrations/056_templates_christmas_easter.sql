-- Migration 056 : Noël + Pâques — 120 messages haute qualité avec {annee}
-- Remplace les templates de base de la migration 048

DELETE FROM message_templates WHERE occasion IN ('christmas','easter') AND is_system = true;

-- ============================================================
-- NOËL (christmas)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('christmas','tu','court','Joyeux Noël {annee} ! 🎄','Joyeux Noël {annee} ! 🎄',true),
('christmas','tu','court','Rempli de magie et de bonheur !','Que ce Noël {annee} soit rempli de magie et de bonheur !',true),
('christmas','tu','court','Aussi chaleureux que ton cœur','Passe un Noël {annee} aussi chaleureux que ton cœur.',true),
('christmas','tu','court','Que la joie soit au rendez-vous !','Joyeux Noël {annee}, et que la joie soit au rendez-vous !',true),
('christmas','tu','court','Un Noël inoubliable','Que {annee} t''apporte un Noël inoubliable.',true),
('christmas','tu','court','Célébrer l''amour et la famille','Noël {annee} : l''occasion de célébrer l''amour et la famille.',true),
('christmas','tu','court','Aussi doux que tes rêves','Que ce Noël {annee} soit aussi doux que tes rêves.',true),
('christmas','tu','court','Que la lumière brille pour toi','Joyeux Noël {annee} ! Que la lumière brille pour toi.',true),
('christmas','tu','court','Rempli de rires et de cadeaux','Que {annee} soit un Noël rempli de rires et de cadeaux.',true),
('christmas','tu','court','Le moment de partager et de s''émerveiller','Noël {annee} : le moment de partager et de s''émerveiller.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('christmas','tu','moyen','Aussi magique que ton sourire','Joyeux Noël {annee} ! Que cette fête soit remplie de chaleur, de rires et de moments précieux avec ceux que tu aimes. Que chaque instant soit aussi magique que ton sourire.',true),
('christmas','tu','moyen','Autant de bonheur que tu en donnes','Que ce Noël {annee} t''apporte autant de bonheur que tu en donnes autour de toi. Passe une belle fête, entouré(e) de ceux qui comptent.',true),
('christmas','tu','moyen','Aussi lumineux que ton cœur','Noël {annee}, c''est l''occasion de se rappeler à quel point la vie est belle. Que cette fête soit aussi lumineuse que ton cœur.',true),
('christmas','tu','moyen','Rempli de magie, de paix et de joie','Que ce Noël {annee} soit rempli de magie, de paix et de joie. Que chaque moment soit une nouvelle raison de sourire.',true),
('christmas','tu','moyen','Aussi doux que tes rêves','Joyeux Noël {annee} ! Que cette fête soit aussi douce que tes rêves et aussi chaleureuse que ton âme.',true),
('christmas','tu','moyen','Partager, donner et recevoir','Noël {annee}, c''est le moment de partager, de donner et de recevoir. Que cette fête soit aussi belle que ton engagement envers ceux que tu aimes.',true),
('christmas','tu','moyen','Entouré(e) de ceux qui te sont chers','Que ce Noël {annee} soit une source de bonheur et de réconfort. Passe une belle fête, entouré(e) de ceux qui te sont chers.',true),
('christmas','tu','moyen','Aussi généreux que ton cœur','Joyeux Noël {annee} ! Que cette année soit aussi généreuse que ton cœur.',true),
('christmas','tu','moyen','Surprises agréables et moments inoubliables','Que ce Noël {annee} soit rempli de surprises agréables, de rires et de moments inoubliables.',true),
('christmas','tu','moyen','Célébrer l''amour, la famille et la joie','Noël {annee}, c''est l''occasion de célébrer l''amour, la famille et la joie. Que cette fête soit aussi belle que toi.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('christmas','tu','long','Aussi chaleureux que ton cœur','Joyeux Noël {annee} ! Aujourd''hui, c''est le moment de célébrer l''amour, la famille et la magie de cette fête. Que ce Noël soit aussi chaleureux que ton cœur, aussi lumineux que ton sourire, et aussi doux que tes rêves. Que chaque instant passé avec tes proches soit une nouvelle raison de sourire, et que cette fête reste gravée dans ta mémoire comme un moment inoubliable. Que {annee} t''apporte tout ce que tu désires : bonheur, paix et joie partagée.',true),
('christmas','tu','long','Le symbole de tout ce qui compte','Que ce Noël {annee} soit bien plus qu''une simple fête : qu''il soit le symbole de tout ce qui compte pour toi. Que chaque moment soit rempli de rires, de tendresse et de magie. Que cette fête te rappelle à quel point tu es entouré(e) d''amour, et que chaque cadeau que tu reçois soit aussi précieux que ceux que tu offres. Joyeux Noël, et que cette année soit aussi belle que ton âme.',true),
('christmas','tu','long','Croire en la magie de la vie','Noël {annee}, c''est l''occasion de se retrouver, de partager et de célébrer ensemble. Que cette fête soit aussi joyeuse que tes rires, aussi chaleureuse que ton cœur, et aussi lumineuse que tes espérances. Que chaque instant soit une nouvelle raison de croire en la magie de la vie. Joyeux Noël, et que cette année t''apporte tout ce que tu mérites.',true),
('christmas','tu','long','La vie est précieuse','Aujourd''hui, c''est Noël {annee}, et avec lui, l''occasion de se rappeler à quel point la vie est précieuse. Que cette fête soit remplie de moments inoubliables, de rires partagés et de cadeaux qui viennent du cœur. Que chaque instant soit une nouvelle preuve de l''amour qui t''entoure. Joyeux Noël, et que cette année soit aussi exceptionnelle que toi.',true),
('christmas','tu','long','Aussi magique que tes rêves','Que ce Noël {annee} soit le début d''une période remplie de bonheur, de paix et de joie. Que chaque moment passé avec tes proches soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les guirlandes du sapin. Joyeux Noël, et que cette fête soit aussi magique que tes rêves.',true),
('christmas','tu','long','Un conte de fées qui devient réalité','Noël {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que tes rêves, aussi chaleureuse que ton cœur, et aussi joyeuse que tes rires. Que chaque instant soit une nouvelle raison de croire en la magie de Noël. Joyeux Noël, et que cette année t''apporte tout ce que tu désires.',true),
('christmas','tu','long','Aussi belle que ton âme','Que ce Noël {annee} soit rempli de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour toi. Que cette fête soit aussi belle que ton âme, et que chaque cadeau soit aussi précieux que ton cœur. Joyeux Noël !',true),
('christmas','tu','long','Aussi lumineux que ton sourire','Aujourd''hui, c''est Noël {annee}, et c''est l''occasion de célébrer tout ce qui rend la vie belle. Que cette fête soit aussi joyeuse que tes rires, aussi douce que tes rêves, et aussi lumineuse que ton sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que toi.',true),
('christmas','tu','long','Chaque cadeau aussi beau que ceux que tu offres','Que ce Noël {annee} soit une fête remplie de magie, de rires et de moments précieux. Que chaque cadeau que tu reçois soit aussi beau que ceux que tu offres, et que chaque instant soit une nouvelle preuve de l''amour qui t''entoure. Joyeux Noël, et que cette année soit aussi belle que ton cœur.',true),
('christmas','tu','long','La magie de la vie','Noël {annee}, c''est le moment de se retrouver, de partager et de célébrer ensemble. Que cette fête soit aussi chaleureuse que ton cœur, aussi lumineuse que ton sourire, et aussi douce que tes rêves. Que chaque instant soit une nouvelle raison de croire en la magie de la vie. Joyeux Noël !',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('christmas','vous','court','Joyeux Noël {annee} !','Joyeux Noël {annee} !',true),
('christmas','vous','court','Rempli de magie et de bonheur','Que ce Noël {annee} soit rempli de magie et de bonheur.',true),
('christmas','vous','court','Aussi chaleureux que votre cœur','Passez un Noël {annee} aussi chaleureux que votre cœur.',true),
('christmas','vous','court','Que la joie soit au rendez-vous','Joyeux Noël {annee}, et que la joie soit au rendez-vous.',true),
('christmas','vous','court','Un Noël inoubliable','Que {annee} vous apporte un Noël inoubliable.',true),
('christmas','vous','court','Célébrer l''amour et la famille','Noël {annee} : l''occasion de célébrer l''amour et la famille.',true),
('christmas','vous','court','Aussi doux que vos rêves','Que ce Noël {annee} soit aussi doux que vos rêves.',true),
('christmas','vous','court','Que la lumière brille pour vous','Joyeux Noël {annee} ! Que la lumière brille pour vous.',true),
('christmas','vous','court','Rempli de rires et de cadeaux','Que {annee} soit un Noël rempli de rires et de cadeaux.',true),
('christmas','vous','court','Le moment de partager et de s''émerveiller','Noël {annee} : le moment de partager et de s''émerveiller.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('christmas','vous','moyen','Aussi magique que votre sourire','Joyeux Noël {annee} ! Que cette fête soit remplie de chaleur, de rires et de moments précieux avec ceux que vous aimez. Que chaque instant soit aussi magique que votre sourire.',true),
('christmas','vous','moyen','Autant de bonheur que vous en offrez','Que ce Noël {annee} vous apporte autant de bonheur que vous en offrez autour de vous. Passez une belle fête, entouré(e) de ceux qui comptent.',true),
('christmas','vous','moyen','Aussi lumineux que votre cœur','Noël {annee}, c''est l''occasion de se rappeler à quel point la vie est belle. Que cette fête soit aussi lumineuse que votre cœur.',true),
('christmas','vous','moyen','Rempli de magie, de paix et de joie','Que ce Noël {annee} soit rempli de magie, de paix et de joie. Que chaque moment soit une nouvelle raison de sourire.',true),
('christmas','vous','moyen','Aussi doux que vos rêves','Joyeux Noël {annee} ! Que cette fête soit aussi douce que vos rêves et aussi chaleureuse que votre âme.',true),
('christmas','vous','moyen','Partager, donner et recevoir','Noël {annee}, c''est le moment de partager, de donner et de recevoir. Que cette fête soit aussi belle que votre engagement envers ceux que vous aimez.',true),
('christmas','vous','moyen','Entouré(e) de ceux qui vous sont chers','Que ce Noël {annee} soit une source de bonheur et de réconfort. Passez une belle fête, entouré(e) de ceux qui vous sont chers.',true),
('christmas','vous','moyen','Aussi généreux que votre cœur','Joyeux Noël {annee} ! Que cette année soit aussi généreuse que votre cœur.',true),
('christmas','vous','moyen','Surprises agréables et moments inoubliables','Que ce Noël {annee} soit rempli de surprises agréables, de rires et de moments inoubliables.',true),
('christmas','vous','moyen','Célébrer l''amour, la famille et la joie','Noël {annee}, c''est l''occasion de célébrer l''amour, la famille et la joie. Que cette fête soit aussi belle que vous.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('christmas','vous','long','Aussi chaleureux que votre cœur','Joyeux Noël {annee} ! Aujourd''hui, c''est le moment de célébrer l''amour, la famille et la magie de cette fête. Que ce Noël soit aussi chaleureux que votre cœur, aussi lumineux que votre sourire, et aussi doux que vos rêves. Que chaque instant passé avec vos proches soit une nouvelle raison de sourire, et que cette fête reste gravée dans votre mémoire comme un moment inoubliable. Que {annee} vous apporte tout ce que vous désirez : bonheur, paix et joie partagée.',true),
('christmas','vous','long','Le symbole de tout ce qui compte','Que ce Noël {annee} soit bien plus qu''une simple fête : qu''il soit le symbole de tout ce qui compte pour vous. Que chaque moment soit rempli de rires, de tendresse et de magie. Que cette fête vous rappelle à quel point vous êtes entouré de bienveillance, et que chaque cadeau que vous recevez soit aussi précieux que ceux que vous offrez. Joyeux Noël, et que cette année soit aussi belle que votre âme.',true),
('christmas','vous','long','Croire en la magie de la vie','Noël {annee}, c''est l''occasion de se retrouver, de partager et de célébrer ensemble. Que cette fête soit aussi joyeuse que vos rires, aussi chaleureuse que votre cœur, et aussi lumineuse que vos espérances. Que chaque instant soit une nouvelle raison de croire en la magie de la vie. Joyeux Noël, et que cette année vous apporte tout ce que vous méritez.',true),
('christmas','vous','long','La vie est précieuse','Aujourd''hui, c''est Noël {annee}, et avec lui, l''occasion de vous rappeler à quel point la vie est précieuse. Que cette fête soit remplie de moments inoubliables, de rires partagés et de cadeaux qui viennent du cœur. Que chaque instant soit une nouvelle preuve de l''amour qui vous entoure. Joyeux Noël, et que cette année soit aussi exceptionnelle que vous.',true),
('christmas','vous','long','Aussi magique que vos rêves','Que ce Noël {annee} soit le début d''une période remplie de bonheur, de paix et de joie. Que chaque moment passé avec vos proches soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les guirlandes du sapin. Joyeux Noël, et que cette fête soit aussi magique que vos rêves.',true),
('christmas','vous','long','Un conte de fées qui devient réalité','Noël {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que vos rêves, aussi chaleureuse que votre cœur, et aussi joyeuse que vos rires. Que chaque instant soit une nouvelle raison de croire en la magie de Noël. Joyeux Noël, et que cette année vous apporte tout ce que vous désirez.',true),
('christmas','vous','long','Aussi belle que votre âme','Que ce Noël {annee} soit rempli de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour vous. Que cette fête soit aussi belle que votre âme, et que chaque cadeau soit aussi précieux que votre cœur. Joyeux Noël !',true),
('christmas','vous','long','Aussi lumineux que votre sourire','Aujourd''hui, c''est Noël {annee}, et c''est l''occasion de célébrer tout ce qui rend la vie belle. Que cette fête soit aussi joyeuse que vos rires, aussi douce que vos rêves, et aussi lumineuse que votre sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que vous.',true),
('christmas','vous','long','Chaque cadeau aussi beau que ceux que vous offrez','Que ce Noël {annee} soit une fête remplie de magie, de rires et de moments précieux. Que chaque cadeau que vous recevez soit aussi beau que ceux que vous offrez, et que chaque instant soit une nouvelle preuve de l''amour qui vous entoure. Joyeux Noël, et que cette année soit aussi belle que votre cœur.',true),
('christmas','vous','long','La magie de la vie','Noël {annee}, c''est le moment de vous retrouver, de partager et de célébrer ensemble. Que cette fête soit aussi chaleureuse que votre cœur, aussi lumineuse que votre sourire, et aussi douce que vos rêves. Que chaque instant soit une nouvelle raison de croire en la magie de la vie. Joyeux Noël !',true);

-- ============================================================
-- PÂQUES (easter)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('easter','tu','court','Joyeuses Pâques {annee} ! 🐣','Joyeuses Pâques {annee} ! 🐣',true),
('easter','tu','court','Aussi lumineuse que ton sourire !','Que Pâques {annee} soit aussi lumineuse que ton sourire !',true),
('easter','tu','court','L''occasion de célébrer le renouveau','Pâques {annee} : l''occasion de célébrer le renouveau.',true),
('easter','tu','court','Remplie de joie et de douceur','Que cette Pâques {annee} soit remplie de joie et de douceur.',true),
('easter','tu','court','Que la lumière brille pour toi !','Joyeuses Pâques {annee}, et que la lumière brille pour toi !',true),
('easter','tu','court','Un temps pour se retrouver et partager','Pâques {annee} : un temps pour se retrouver et partager.',true),
('easter','tu','court','Bonheur et sérénité','Que Pâques {annee} t''apporte bonheur et sérénité.',true),
('easter','tu','court','Que chaque œuf soit une surprise','Joyeuses Pâques {annee} ! Que chaque œuf soit une surprise.',true),
('easter','tu','court','Une Pâques inoubliable','Que {annee} soit une Pâques inoubliable.',true),
('easter','tu','court','Le printemps du cœur !','Pâques {annee} : le printemps du cœur !',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('easter','tu','moyen','Aussi doux que le printemps','Joyeuses Pâques {annee} ! Que cette fête soit remplie de lumière, de joie et de moments précieux avec ceux que tu aimes. Que chaque instant soit aussi doux que le printemps.',true),
('easter','tu','moyen','Le renouveau et l''espoir','Pâques {annee}, c''est l''occasion de célébrer le renouveau et l''espoir. Que cette fête soit aussi lumineuse que ton cœur et aussi joyeuse que tes rires.',true),
('easter','tu','moyen','Aussi précieux que ton sourire','Que Pâques {annee} t''apporte autant de bonheur que tu en donnes autour de toi. Que chaque œuf que tu trouves soit aussi précieux que ton sourire.',true),
('easter','tu','moyen','Aussi colorée que tes rêves','Joyeuses Pâques {annee} ! Que cette fête soit aussi chaleureuse que ton âme et aussi colorée que tes rêves.',true),
('easter','tu','moyen','Se retrouver, partager et célébrer','Pâques {annee}, c''est le moment de se retrouver, de partager et de célébrer ensemble. Que chaque instant soit une nouvelle raison de sourire.',true),
('easter','tu','moyen','Moments inoubliables','Que cette Pâques {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que ton avenir.',true),
('easter','tu','moyen','Aussi joyeuse que ton cœur','Joyeuses Pâques {annee} ! Que cette fête soit aussi douce que tes rêves et aussi joyeuse que ton cœur.',true),
('easter','tu','moyen','La beauté de la vie','Pâques {annee}, c''est l''occasion de se rappeler à quel point la vie est belle. Que chaque moment soit une nouvelle preuve de l''amour qui t''entoure.',true),
('easter','tu','moyen','Aussi précieux que ton sourire','Que Pâques {annee} soit une source de bonheur et de réconfort. Que chaque instant soit aussi précieux que ton sourire.',true),
('easter','tu','moyen','Aussi chaleureuse que ton cœur','Joyeuses Pâques {annee} ! Que cette fête soit aussi lumineuse que ton âme et aussi chaleureuse que ton cœur.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('easter','tu','long','Le renouveau, la lumière et l''espoir','Joyeuses Pâques {annee} ! Aujourd''hui, c''est le moment de célébrer le renouveau, la lumière et l''espoir. Que cette fête soit aussi lumineuse que ton sourire, aussi douce que ton cœur, et aussi joyeuse que tes rires. Que chaque instant passé avec tes proches soit une nouvelle raison de croire en la beauté de la vie. Que Pâques {annee} t''apporte tout ce que tu désires : bonheur, paix et sérénité. Que chaque œuf que tu trouves soit aussi précieux que les moments que tu partages, et que chaque jour soit une nouvelle aventure à savourer.',true),
('easter','tu','long','Une célébration de la vie','Pâques {annee}, c''est bien plus qu''une fête : c''est une célébration de la vie, de l''amour et de la renaissance. Que cette année soit aussi riche en émotions que ton cœur l''est en générosité. Que chaque moment soit une nouvelle preuve de la magie qui t''entoure, et que chaque instant soit aussi précieux que ton sourire. Joyeuses Pâques, et que cette fête reste gravée dans ta mémoire comme un moment inoubliable.',true),
('easter','tu','long','Source de joie, de lumière et de réconfort','Que Pâques {annee} soit pour toi une source de joie, de lumière et de réconfort. Aujourd''hui, c''est l''occasion de te rappeler à quel point la vie est belle, surtout quand on est entouré de ceux qu''on aime. Que chaque œuf que tu découvres soit aussi surprenant que les moments que tu vis, et que chaque jour soit une nouvelle raison de sourire. Joyeuses Pâques, et que cette année soit aussi exceptionnelle que toi.',true),
('easter','tu','long','Aussi colorée que tes rêves','Joyeuses Pâques {annee} ! Que cette fête soit aussi colorée que tes rêves, aussi chaleureuse que ton cœur, et aussi lumineuse que ton âme. Que chaque instant soit une nouvelle aventure à partager avec ceux qui comptent pour toi. Que Pâques {annee} t''apporte tout ce que tu mérites : bonheur, amour et sérénité. Que chaque moment soit aussi précieux que ton sourire.',true),
('easter','tu','long','La magie de la vie','Aujourd''hui, c''est Pâques {annee}, et avec elle, l''occasion de célébrer tout ce qui rend la vie belle. Que cette fête soit aussi joyeuse que tes rires, aussi douce que tes rêves, et aussi lumineuse que ton avenir. Que chaque instant soit une nouvelle raison de croire en la magie de la vie. Joyeuses Pâques, et que cette année soit aussi exceptionnelle que toi.',true),
('easter','tu','long','Un rayon de soleil après l''hiver','Pâques {annee}, c''est comme un rayon de soleil après l''hiver : elle apporte lumière, chaleur et espoir. Que cette fête soit aussi lumineuse que ton cœur, aussi joyeuse que tes rires, et aussi douce que tes rêves. Que chaque moment soit une nouvelle preuve de l''amour qui t''entoure. Joyeuses Pâques, et que cette année soit aussi belle que ton âme.',true),
('easter','tu','long','Des souvenirs aussi beaux','Que Pâques {annee} soit une fête remplie de magie, de rires et de moments précieux. Que chaque œuf que tu trouves soit aussi beau que les souvenirs que tu crées, et que chaque instant soit une nouvelle raison de sourire. Joyeuses Pâques, et que cette année t''apporte tout ce que tu désires : bonheur, paix et amour.',true),
('easter','tu','long','Une nouvelle aventure à savourer','Joyeuses Pâques {annee} ! Que cette fête soit aussi chaleureuse que ton cœur, aussi lumineuse que ton sourire, et aussi douce que tes rêves. Que chaque moment passé avec tes proches soit une nouvelle aventure à savourer. Que Pâques {annee} soit aussi inoubliable que toi.',true),
('easter','tu','long','La beauté de la vie','Aujourd''hui, c''est Pâques {annee}, et c''est l''occasion de se retrouver, de partager et de célébrer ensemble. Que cette fête soit aussi joyeuse que tes rires, aussi lumineuse que ton âme, et aussi douce que ton cœur. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuses Pâques !',true),
('easter','tu','long','Aussi exceptionnelle que toi','Que Pâques {annee} soit pour toi une source de bonheur, de paix et de lumière. Que chaque moment soit aussi précieux que ton sourire, et que chaque jour soit une nouvelle aventure à vivre. Joyeuses Pâques, et que cette année soit aussi exceptionnelle que toi.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('easter','vous','court','Joyeuses Pâques {annee} !','Joyeuses Pâques {annee} !',true),
('easter','vous','court','Aussi lumineuse que votre sourire !','Que Pâques {annee} soit aussi lumineuse que votre sourire !',true),
('easter','vous','court','L''occasion de célébrer le renouveau','Pâques {annee} : l''occasion de célébrer le renouveau.',true),
('easter','vous','court','Remplie de joie et de douceur','Que cette Pâques {annee} soit remplie de joie et de douceur.',true),
('easter','vous','court','Que la lumière brille pour vous !','Joyeuses Pâques {annee}, et que la lumière brille pour vous !',true),
('easter','vous','court','Un temps pour vous retrouver et partager','Pâques {annee} : un temps pour vous retrouver et partager.',true),
('easter','vous','court','Bonheur et sérénité','Que Pâques {annee} vous apporte bonheur et sérénité.',true),
('easter','vous','court','Que chaque moment soit précieux','Joyeuses Pâques {annee} ! Que chaque moment soit précieux.',true),
('easter','vous','court','Une Pâques inoubliable','Que {annee} soit une Pâques inoubliable.',true),
('easter','vous','court','Le printemps du cœur !','Pâques {annee} : le printemps du cœur !',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('easter','vous','moyen','Aussi doux que le printemps','Joyeuses Pâques {annee} ! Que cette fête soit remplie de lumière, de joie et de moments précieux avec ceux que vous aimez. Que chaque instant soit aussi doux que le printemps.',true),
('easter','vous','moyen','Le renouveau et l''espoir','Pâques {annee}, c''est l''occasion de célébrer le renouveau et l''espoir. Que cette fête soit aussi lumineuse que votre cœur et aussi joyeuse que vos rires.',true),
('easter','vous','moyen','Aussi précieux que votre sourire','Que Pâques {annee} vous apporte autant de bonheur que vous en offrez autour de vous. Que chaque moment soit aussi précieux que votre sourire.',true),
('easter','vous','moyen','Aussi colorée que vos rêves','Joyeuses Pâques {annee} ! Que cette fête soit aussi chaleureuse que votre âme et aussi colorée que vos rêves.',true),
('easter','vous','moyen','Se retrouver, partager et célébrer','Pâques {annee}, c''est le moment de vous retrouver, de partager et de célébrer ensemble. Que chaque instant soit une nouvelle raison de sourire.',true),
('easter','vous','moyen','Moments inoubliables','Que cette Pâques {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que votre avenir.',true),
('easter','vous','moyen','Aussi joyeuse que votre cœur','Joyeuses Pâques {annee} ! Que cette fête soit aussi douce que vos rêves et aussi joyeuse que votre cœur.',true),
('easter','vous','moyen','La beauté de la vie','Pâques {annee}, c''est l''occasion de vous rappeler à quel point la vie est belle. Que chaque moment soit une nouvelle preuve de l''amour qui vous entoure.',true),
('easter','vous','moyen','Aussi précieux que votre sourire','Que Pâques {annee} soit une source de bonheur et de réconfort. Que chaque instant soit aussi précieux que votre sourire.',true),
('easter','vous','moyen','Aussi chaleureuse que votre cœur','Joyeuses Pâques {annee} ! Que cette fête soit aussi lumineuse que votre âme et aussi chaleureuse que votre cœur.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('easter','vous','long','Le renouveau, la lumière et l''espoir','Joyeuses Pâques {annee} ! Aujourd''hui, c''est le moment de célébrer le renouveau, la lumière et l''espoir. Que cette fête soit aussi lumineuse que votre sourire, aussi douce que votre cœur, et aussi joyeuse que vos rires. Que chaque instant passé avec vos proches soit une nouvelle raison de croire en la beauté de la vie. Que Pâques {annee} vous apporte tout ce que vous désirez : bonheur, paix et sérénité. Que chaque moment soit aussi précieux que les souvenirs que vous créez, et que chaque jour soit une nouvelle aventure à savourer.',true),
('easter','vous','long','Une célébration de la vie','Pâques {annee}, c''est bien plus qu''une fête : c''est une célébration de la vie, de l''amour et de la renaissance. Que cette année soit aussi riche en émotions que votre cœur l''est en générosité. Que chaque moment soit une nouvelle preuve de la magie qui vous entoure, et que chaque instant soit aussi précieux que votre sourire. Joyeuses Pâques, et que cette fête reste gravée dans votre mémoire comme un moment inoubliable.',true),
('easter','vous','long','Source de joie, de lumière et de réconfort','Que Pâques {annee} soit pour vous une source de joie, de lumière et de réconfort. Aujourd''hui, c''est l''occasion de vous rappeler à quel point la vie est belle, surtout quand on est entouré de ceux qu''on aime. Que chaque moment soit aussi surprenant que les découvertes que vous faites, et que chaque jour soit une nouvelle raison de sourire. Joyeuses Pâques, et que cette année soit aussi exceptionnelle que vous.',true),
('easter','vous','long','Aussi colorée que vos rêves','Joyeuses Pâques {annee} ! Que cette fête soit aussi colorée que vos rêves, aussi chaleureuse que votre cœur, et aussi lumineuse que votre âme. Que chaque instant soit une nouvelle aventure à partager avec ceux qui comptent pour vous. Que Pâques {annee} vous apporte tout ce que vous méritez : bonheur, amour et sérénité. Que chaque moment soit aussi précieux que votre sourire.',true),
('easter','vous','long','La magie de la vie','Aujourd''hui, c''est Pâques {annee}, et avec elle, l''occasion de célébrer tout ce qui rend la vie belle. Que cette fête soit aussi joyeuse que vos rires, aussi douce que vos rêves, et aussi lumineuse que votre avenir. Que chaque instant soit une nouvelle raison de croire en la magie de la vie. Joyeuses Pâques, et que cette année soit aussi exceptionnelle que vous.',true),
('easter','vous','long','Un rayon de soleil après l''hiver','Pâques {annee}, c''est comme un rayon de soleil après l''hiver : elle apporte lumière, chaleur et espoir. Que cette fête soit aussi lumineuse que votre cœur, aussi joyeuse que vos rires, et aussi douce que vos rêves. Que chaque moment soit une nouvelle preuve de l''amour qui vous entoure. Joyeuses Pâques, et que cette année soit aussi belle que votre âme.',true),
('easter','vous','long','Des souvenirs aussi beaux','Que Pâques {annee} soit une fête remplie de magie, de rires et de moments précieux. Que chaque moment soit aussi beau que les souvenirs que vous créez, et que chaque instant soit une nouvelle raison de sourire. Joyeuses Pâques, et que cette année vous apporte tout ce que vous désirez : bonheur, paix et amour.',true),
('easter','vous','long','Une nouvelle aventure à savourer','Joyeuses Pâques {annee} ! Que cette fête soit aussi chaleureuse que votre cœur, aussi lumineuse que votre sourire, et aussi douce que vos rêves. Que chaque moment passé avec vos proches soit une nouvelle aventure à savourer. Que Pâques {annee} soit aussi inoubliable que vous.',true),
('easter','vous','long','La beauté de la vie','Aujourd''hui, c''est Pâques {annee}, et c''est l''occasion de vous retrouver, de partager et de célébrer ensemble. Que cette fête soit aussi joyeuse que vos rires, aussi lumineuse que votre âme, et aussi douce que votre cœur. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuses Pâques !',true),
('easter','vous','long','Aussi exceptionnelle que vous','Que Pâques {annee} soit pour vous une source de bonheur, de paix et de lumière. Que chaque moment soit aussi précieux que votre sourire, et que chaque jour soit une nouvelle aventure à vivre. Joyeuses Pâques, et que cette année soit aussi exceptionnelle que vous.',true);
