-- Migration 057 : Saint-Valentin + Fête des Mères + Fête des Pères — 180 messages avec {annee}
-- Remplace les templates de base des migrations 048/049/050

DELETE FROM message_templates WHERE occasion IN ('valentines','mothersday','fathersday') AND is_system = true;

-- ============================================================
-- SAINT-VALENTIN (valentines)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('valentines','tu','court','Bonne Saint-Valentin {annee} ! ❤️','Bonne Saint-Valentin {annee} ! ❤️',true),
('valentines','tu','court','Aussi douce que ton cœur','Que cette Saint-Valentin {annee} soit aussi douce que ton cœur.',true),
('valentines','tu','court','L''amour est dans l''air','Joyeuse Saint-Valentin {annee} ! L''amour est dans l''air.',true),
('valentines','tu','court','Une Saint-Valentin inoubliable','Que {annee} t''apporte une Saint-Valentin inoubliable.',true),
('valentines','tu','court','L''occasion de célébrer l''amour','Saint-Valentin {annee} : l''occasion de célébrer l''amour.',true),
('valentines','tu','court','Remplie de tendresse','Que cette Saint-Valentin {annee} soit remplie de tendresse.',true),
('valentines','tu','court','Que l''amour brille pour toi !','Bonne Saint-Valentin {annee}, et que l''amour brille pour toi !',true),
('valentines','tu','court','Un jour pour aimer et être aimé','Saint-Valentin {annee} : un jour pour aimer et être aimé.',true),
('valentines','tu','court','Aussi belle que toi','Que {annee} soit une Saint-Valentin aussi belle que toi.',true),
('valentines','tu','court','Que l''amour soit ton guide','Joyeuse Saint-Valentin {annee} ! Que l''amour soit ton guide.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('valentines','tu','moyen','Aussi doux que ton cœur','Bonne Saint-Valentin {annee} ! Que cette journée soit remplie d''amour, de tendresse et de moments précieux avec ceux qui comptent pour toi. Que chaque instant soit aussi doux que ton cœur.',true),
('valentines','tu','moyen','Aussi magique que ton sourire','Que cette Saint-Valentin {annee} t''apporte autant de bonheur que tu en donnes autour de toi. Que chaque moment soit aussi magique que ton sourire.',true),
('valentines','tu','moyen','Aussi lumineuse que ton âme','Joyeuse Saint-Valentin {annee} ! Que cette fête soit aussi lumineuse que ton âme et aussi joyeuse que tes rires.',true),
('valentines','tu','moyen','L''amour sous toutes ses formes','Saint-Valentin {annee}, c''est l''occasion de célébrer l''amour sous toutes ses formes. Que chaque instant soit une nouvelle raison de sourire.',true),
('valentines','tu','moyen','Moments inoubliables','Que cette Saint-Valentin {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que ton avenir.',true),
('valentines','tu','moyen','Aussi douce que tes rêves','Bonne Saint-Valentin {annee} ! Que cette journée soit aussi douce que tes rêves et aussi chaleureuse que ton cœur.',true),
('valentines','tu','moyen','L''amour est précieux','Saint-Valentin {annee}, c''est le moment de se rappeler à quel point l''amour est précieux. Que chaque instant soit une nouvelle preuve de la beauté de la vie.',true),
('valentines','tu','moyen','Aussi précieux que ton sourire','Que cette Saint-Valentin {annee} soit une source de bonheur et de réconfort. Que chaque moment soit aussi précieux que ton sourire.',true),
('valentines','tu','moyen','Aussi joyeuse que ton cœur','Joyeuse Saint-Valentin {annee} ! Que cette fête soit aussi lumineuse que ton âme et aussi joyeuse que ton cœur.',true),
('valentines','tu','moyen','Un jour pour aimer et célébrer','Saint-Valentin {annee} : un jour pour aimer, partager et célébrer l''amour. Que chaque instant soit aussi beau que toi.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('valentines','tu','long','Célébrer l''amour, la tendresse','Bonne Saint-Valentin {annee} ! Aujourd''hui, c''est le moment de célébrer l''amour, la tendresse et tout ce qui rend la vie belle. Que cette journée soit aussi douce que ton cœur, aussi lumineuse que ton sourire, et aussi joyeuse que tes rires. Que chaque instant passé avec ceux que tu aimes soit une nouvelle raison de croire en la magie de l''amour. Que {annee} t''apporte tout ce que tu désires : bonheur, paix et moments précieux. Que chaque moment soit aussi précieux que ton sourire, et que chaque jour soit une nouvelle aventure à savourer.',true),
('valentines','tu','long','Le symbole de tout ce qui compte','Que cette Saint-Valentin {annee} soit bien plus qu''une simple fête : qu''elle soit le symbole de tout ce qui compte pour toi. Que chaque moment soit rempli de tendresse, de magie et de joie. Que cette journée te rappelle à quel point tu es entouré d''amour, et que chaque instant soit aussi précieux que ceux que tu offres. Joyeuse Saint-Valentin, et que cette année soit aussi belle que ton âme.',true),
('valentines','tu','long','Célébrer l''amour sous toutes ses formes','Saint-Valentin {annee}, c''est l''occasion de se retrouver, de partager et de célébrer l''amour sous toutes ses formes. Que cette fête soit aussi joyeuse que tes rires, aussi chaleureuse que ton cœur, et aussi lumineuse que tes espérances. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Saint-Valentin, et que cette année t''apporte tout ce que tu mérites.',true),
('valentines','tu','long','L''amour est précieux','Aujourd''hui, c''est la Saint-Valentin {annee}, et avec elle, l''occasion de te rappeler à quel point l''amour est précieux. Que cette fête soit remplie de moments inoubliables, de tendresse et de joie. Que chaque instant soit une nouvelle preuve de l''amour qui t''entoure. Joyeuse Saint-Valentin, et que cette année soit aussi exceptionnelle que toi.',true),
('valentines','tu','long','Aussi magique que tes rêves','Que cette Saint-Valentin {annee} soit le début d''une période remplie de bonheur, de paix et d''amour. Que chaque moment passé avec ceux que tu aimes soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les étoiles. Joyeuse Saint-Valentin, et que cette fête soit aussi magique que tes rêves.',true),
('valentines','tu','long','Un conte de fées qui devient réalité','La Saint-Valentin {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que tes rêves, aussi chaleureuse que ton cœur, et aussi joyeuse que tes rires. Que chaque instant soit une nouvelle raison de croire en la magie de l''amour. Joyeuse Saint-Valentin, et que cette année t''apporte tout ce que tu désires.',true),
('valentines','tu','long','Aussi belle que ton âme','Que cette Saint-Valentin {annee} soit remplie de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour toi. Que cette fête soit aussi belle que ton âme, et que chaque instant soit aussi précieux que ton cœur. Joyeuse Saint-Valentin !',true),
('valentines','tu','long','Tout ce qui rend l''amour beau','Aujourd''hui, c''est la Saint-Valentin {annee}, et c''est l''occasion de célébrer tout ce qui rend l''amour beau. Que cette fête soit aussi joyeuse que tes rires, aussi douce que tes rêves, et aussi lumineuse que ton sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que toi.',true),
('valentines','tu','long','Chaque instant une preuve de l''amour','Que cette Saint-Valentin {annee} soit une fête remplie de magie, de tendresse et de moments précieux. Que chaque instant soit aussi beau que les souvenirs que tu crées, et que chaque moment soit une nouvelle preuve de l''amour qui t''entoure. Joyeuse Saint-Valentin, et que cette année soit aussi belle que ton cœur.',true),
('valentines','tu','long','La beauté de la vie','Saint-Valentin {annee}, c''est le moment de te retrouver, de partager et de célébrer l''amour. Que cette fête soit aussi chaleureuse que ton cœur, aussi lumineuse que ton sourire, et aussi douce que tes rêves. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Saint-Valentin !',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('valentines','vous','court','Bonne Saint-Valentin {annee} !','Bonne Saint-Valentin {annee} !',true),
('valentines','vous','court','Aussi douce que votre cœur','Que cette Saint-Valentin {annee} soit aussi douce que votre cœur.',true),
('valentines','vous','court','L''amour est dans l''air','Joyeuse Saint-Valentin {annee} ! L''amour est dans l''air.',true),
('valentines','vous','court','Une Saint-Valentin inoubliable','Que {annee} vous apporte une Saint-Valentin inoubliable.',true),
('valentines','vous','court','L''occasion de célébrer l''amour','Saint-Valentin {annee} : l''occasion de célébrer l''amour.',true),
('valentines','vous','court','Remplie de tendresse','Que cette Saint-Valentin {annee} soit remplie de tendresse.',true),
('valentines','vous','court','Que l''amour brille pour vous !','Bonne Saint-Valentin {annee}, et que l''amour brille pour vous !',true),
('valentines','vous','court','Un jour pour aimer et être aimé','Saint-Valentin {annee} : un jour pour aimer et être aimé.',true),
('valentines','vous','court','Aussi belle que vous','Que {annee} soit une Saint-Valentin aussi belle que vous.',true),
('valentines','vous','court','Que l''amour soit votre guide','Joyeuse Saint-Valentin {annee} ! Que l''amour soit votre guide.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('valentines','vous','moyen','Aussi doux que votre cœur','Bonne Saint-Valentin {annee} ! Que cette journée soit remplie d''amour, de tendresse et de moments précieux avec ceux qui comptent pour vous. Que chaque instant soit aussi doux que votre cœur.',true),
('valentines','vous','moyen','Aussi magique que votre sourire','Que cette Saint-Valentin {annee} vous apporte autant de bonheur que vous en offrez autour de vous. Que chaque moment soit aussi magique que votre sourire.',true),
('valentines','vous','moyen','Aussi lumineuse que votre âme','Joyeuse Saint-Valentin {annee} ! Que cette fête soit aussi lumineuse que votre âme et aussi joyeuse que vos rires.',true),
('valentines','vous','moyen','L''amour sous toutes ses formes','Saint-Valentin {annee}, c''est l''occasion de célébrer l''amour sous toutes ses formes. Que chaque instant soit une nouvelle raison de sourire.',true),
('valentines','vous','moyen','Moments inoubliables','Que cette Saint-Valentin {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que votre avenir.',true),
('valentines','vous','moyen','Aussi douce que vos rêves','Bonne Saint-Valentin {annee} ! Que cette journée soit aussi douce que vos rêves et aussi chaleureuse que votre cœur.',true),
('valentines','vous','moyen','L''amour est précieux','Saint-Valentin {annee}, c''est le moment de vous rappeler à quel point l''amour est précieux. Que chaque instant soit une nouvelle preuve de la beauté de la vie.',true),
('valentines','vous','moyen','Aussi précieux que votre sourire','Que cette Saint-Valentin {annee} soit une source de bonheur et de réconfort. Que chaque moment soit aussi précieux que votre sourire.',true),
('valentines','vous','moyen','Aussi joyeuse que votre cœur','Joyeuse Saint-Valentin {annee} ! Que cette fête soit aussi lumineuse que votre âme et aussi joyeuse que votre cœur.',true),
('valentines','vous','moyen','Un jour pour aimer et célébrer','Saint-Valentin {annee} : un jour pour aimer, partager et célébrer l''amour. Que chaque instant soit aussi beau que vous.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('valentines','vous','long','Célébrer l''amour, la tendresse','Bonne Saint-Valentin {annee} ! Aujourd''hui, c''est le moment de célébrer l''amour, la tendresse et tout ce qui rend la vie belle. Que cette journée soit aussi douce que votre cœur, aussi lumineuse que votre sourire, et aussi joyeuse que vos rires. Que chaque instant passé avec ceux que vous aimez soit une nouvelle raison de croire en la magie de l''amour. Que {annee} vous apporte tout ce que vous désirez : bonheur, paix et moments précieux. Que chaque moment soit aussi précieux que votre sourire, et que chaque jour soit une nouvelle aventure à savourer.',true),
('valentines','vous','long','Le symbole de tout ce qui compte','Que cette Saint-Valentin {annee} soit bien plus qu''une simple fête : qu''elle soit le symbole de tout ce qui compte pour vous. Que chaque moment soit rempli de tendresse, de magie et de joie. Que cette journée vous rappelle à quel point vous êtes entouré d''amour, et que chaque instant soit aussi précieux que ceux que vous offrez. Joyeuse Saint-Valentin, et que cette année soit aussi belle que votre âme.',true),
('valentines','vous','long','Célébrer l''amour sous toutes ses formes','Saint-Valentin {annee}, c''est l''occasion de vous retrouver, de partager et de célébrer l''amour sous toutes ses formes. Que cette fête soit aussi joyeuse que vos rires, aussi chaleureuse que votre cœur, et aussi lumineuse que vos espérances. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Saint-Valentin, et que cette année vous apporte tout ce que vous méritez.',true),
('valentines','vous','long','L''amour est précieux','Aujourd''hui, c''est la Saint-Valentin {annee}, et avec elle, l''occasion de vous rappeler à quel point l''amour est précieux. Que cette fête soit remplie de moments inoubliables, de tendresse et de joie. Que chaque instant soit une nouvelle preuve de l''amour qui vous entoure. Joyeuse Saint-Valentin, et que cette année soit aussi exceptionnelle que vous.',true),
('valentines','vous','long','Aussi magique que vos rêves','Que cette Saint-Valentin {annee} soit le début d''une période remplie de bonheur, de paix et d''amour. Que chaque moment passé avec ceux que vous aimez soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les étoiles. Joyeuse Saint-Valentin, et que cette fête soit aussi magique que vos rêves.',true),
('valentines','vous','long','Un conte de fées qui devient réalité','La Saint-Valentin {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que vos rêves, aussi chaleureuse que votre cœur, et aussi joyeuse que vos rires. Que chaque instant soit une nouvelle raison de croire en la magie de l''amour. Joyeuse Saint-Valentin, et que cette année vous apporte tout ce que vous désirez.',true),
('valentines','vous','long','Aussi belle que votre âme','Que cette Saint-Valentin {annee} soit remplie de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour vous. Que cette fête soit aussi belle que votre âme, et que chaque instant soit aussi précieux que votre cœur. Joyeuse Saint-Valentin !',true),
('valentines','vous','long','Tout ce qui rend l''amour beau','Aujourd''hui, c''est la Saint-Valentin {annee}, et c''est l''occasion de célébrer tout ce qui rend l''amour beau. Que cette fête soit aussi joyeuse que vos rires, aussi douce que vos rêves, et aussi lumineuse que votre sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que vous.',true),
('valentines','vous','long','Chaque instant une preuve de l''amour','Que cette Saint-Valentin {annee} soit une fête remplie de magie, de tendresse et de moments précieux. Que chaque instant soit aussi beau que les souvenirs que vous créez, et que chaque moment soit une nouvelle preuve de l''amour qui vous entoure. Joyeuse Saint-Valentin, et que cette année soit aussi belle que votre cœur.',true),
('valentines','vous','long','La beauté de la vie','Saint-Valentin {annee}, c''est le moment de vous retrouver, de partager et de célébrer l''amour. Que cette fête soit aussi chaleureuse que votre cœur, aussi lumineuse que votre sourire, et aussi douce que vos rêves. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Saint-Valentin !',true);

-- ============================================================
-- FÊTE DES MÈRES (mothersday)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('mothersday','tu','court','Bonne Fête des Mères {annee} ! 🌸','Bonne Fête des Mères {annee} ! 🌸',true),
('mothersday','tu','court','Aussi belle que ton amour','Que cette Fête des Mères {annee} soit aussi belle que ton amour.',true),
('mothersday','tu','court','Merci pour tout','Joyeuse Fête des Mères {annee} ! Merci pour tout.',true),
('mothersday','tu','court','Aussi douce que ton cœur','Que {annee} t''apporte une journée aussi douce que ton cœur.',true),
('mothersday','tu','court','L''occasion de te dire merci','Fête des Mères {annee} : l''occasion de te dire merci.',true),
('mothersday','tu','court','Remplie de bonheur','Que cette Fête des Mères {annee} soit remplie de bonheur.',true),
('mothersday','tu','court','Que l''amour brille pour toi !','Bonne Fête des Mères {annee}, et que l''amour brille pour toi !',true),
('mothersday','tu','court','Célébrer ton dévouement','Fête des Mères {annee} : un jour pour célébrer ton dévouement.',true),
('mothersday','tu','court','Une journée inoubliable','Que {annee} soit une Fête des Mères inoubliable.',true),
('mothersday','tu','court','Tu es incroyable','Joyeuse Fête des Mères {annee} ! Tu es incroyable.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('mothersday','tu','moyen','Aussi doux que ton cœur','Bonne Fête des Mères {annee} ! Que cette journée soit remplie d''amour, de tendresse et de moments précieux avec ceux qui comptent pour toi. Que chaque instant soit aussi doux que ton cœur.',true),
('mothersday','tu','moyen','Aussi magique que ton sourire','Que cette Fête des Mères {annee} t''apporte autant de bonheur que tu en donnes autour de toi. Que chaque moment soit aussi magique que ton sourire.',true),
('mothersday','tu','moyen','Aussi lumineuse que ton âme','Joyeuse Fête des Mères {annee} ! Que cette fête soit aussi lumineuse que ton âme et aussi joyeuse que tes rires.',true),
('mothersday','tu','moyen','Ton amour et ton dévouement','Fête des Mères {annee}, c''est l''occasion de célébrer ton amour et ton dévouement. Que chaque instant soit une nouvelle raison de sourire.',true),
('mothersday','tu','moyen','Moments inoubliables','Que cette Fête des Mères {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que ton avenir.',true),
('mothersday','tu','moyen','Aussi douce que tes rêves','Bonne Fête des Mères {annee} ! Que cette journée soit aussi douce que tes rêves et aussi chaleureuse que ton cœur.',true),
('mothersday','tu','moyen','Tu es importante','Fête des Mères {annee}, c''est le moment de te rappeler à quel point tu es importante. Que chaque instant soit une nouvelle preuve de l''amour qui t''entoure.',true),
('mothersday','tu','moyen','Aussi précieux que ton sourire','Que cette Fête des Mères {annee} soit une source de bonheur et de réconfort. Que chaque moment soit aussi précieux que ton sourire.',true),
('mothersday','tu','moyen','Aussi joyeuse que ton cœur','Joyeuse Fête des Mères {annee} ! Que cette fête soit aussi lumineuse que ton âme et aussi joyeuse que ton cœur.',true),
('mothersday','tu','moyen','Ton amour inconditionnel','Fête des Mères {annee} : un jour pour célébrer ton amour inconditionnel. Que chaque instant soit aussi beau que toi.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('mothersday','tu','long','Ton amour inconditionnel et ton dévouement','Bonne Fête des Mères {annee} ! Aujourd''hui, c''est le moment de célébrer tout ce que tu fais pour nous, ton amour inconditionnel et ton dévouement sans limites. Que cette journée soit aussi douce que ton cœur, aussi lumineuse que ton sourire, et aussi joyeuse que tes rires. Que chaque instant passé avec toi soit une nouvelle raison de croire en la beauté de la vie. Que {annee} t''apporte tout ce que tu mérites : bonheur, paix et moments précieux. Que chaque moment soit aussi précieux que ton amour, et que chaque jour soit une nouvelle aventure à savourer.',true),
('mothersday','tu','long','Le symbole de tout ce que tu représentes','Que cette Fête des Mères {annee} soit bien plus qu''une simple journée : qu''elle soit le symbole de tout ce que tu représentes pour nous. Que chaque moment soit rempli de tendresse, de magie et de joie. Que cette fête te rappelle à quel point tu es aimée et appréciée, et que chaque instant soit aussi précieux que ceux que tu nous offres. Joyeuse Fête des Mères, et que cette année soit aussi belle que ton âme.',true),
('mothersday','tu','long','Tu comptes pour nous','Fête des Mères {annee}, c''est l''occasion de te dire à quel point tu comptes pour nous. Que cette fête soit aussi joyeuse que tes rires, aussi chaleureuse que ton cœur, et aussi lumineuse que tes espérances. Que chaque instant soit une nouvelle raison de croire en la beauté de l''amour maternel. Joyeuse Fête des Mères, et que cette année t''apporte tout ce que tu mérites.',true),
('mothersday','tu','long','Ton amour est précieux','Aujourd''hui, c''est la Fête des Mères {annee}, et avec elle, l''occasion de te rappeler à quel point ton amour est précieux. Que cette fête soit remplie de moments inoubliables, de tendresse et de joie. Que chaque instant soit une nouvelle preuve de l''amour qui nous unit. Joyeuse Fête des Mères, et que cette année soit aussi exceptionnelle que toi.',true),
('mothersday','tu','long','Aussi magique que tes rêves','Que cette Fête des Mères {annee} soit le début d''une période remplie de bonheur, de paix et d''amour. Que chaque moment passé avec toi soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les étoiles. Joyeuse Fête des Mères, et que cette fête soit aussi magique que tes rêves.',true),
('mothersday','tu','long','Un conte de fées qui devient réalité','La Fête des Mères {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que tes rêves, aussi chaleureuse que ton cœur, et aussi joyeuse que tes rires. Que chaque instant soit une nouvelle raison de croire en la magie de l''amour maternel. Joyeuse Fête des Mères, et que cette année t''apporte tout ce que tu désires.',true),
('mothersday','tu','long','Aussi belle que ton âme','Que cette Fête des Mères {annee} soit remplie de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour toi. Que cette fête soit aussi belle que ton âme, et que chaque instant soit aussi précieux que ton cœur. Joyeuse Fête des Mères !',true),
('mothersday','tu','long','Ce qui rend ton amour si spécial','Aujourd''hui, c''est la Fête des Mères {annee}, et c''est l''occasion de célébrer tout ce qui rend ton amour si spécial. Que cette fête soit aussi joyeuse que tes rires, aussi douce que tes rêves, et aussi lumineuse que ton sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que toi.',true),
('mothersday','tu','long','Chaque moment une preuve de l''amour','Que cette Fête des Mères {annee} soit une fête remplie de magie, de tendresse et de moments précieux. Que chaque instant soit aussi beau que les souvenirs que tu crées, et que chaque moment soit une nouvelle preuve de l''amour qui t''entoure. Joyeuse Fête des Mères, et que cette année soit aussi belle que ton cœur.',true),
('mothersday','tu','long','La beauté de la vie','Fête des Mères {annee}, c''est le moment de te retrouver, de partager et de célébrer ton amour. Que cette fête soit aussi chaleureuse que ton cœur, aussi lumineuse que ton sourire, et aussi douce que tes rêves. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Fête des Mères !',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('mothersday','vous','court','Bonne Fête des Mères {annee} !','Bonne Fête des Mères {annee} !',true),
('mothersday','vous','court','Aussi belle que votre amour','Que cette Fête des Mères {annee} soit aussi belle que votre amour.',true),
('mothersday','vous','court','Merci pour tout','Joyeuse Fête des Mères {annee} ! Merci pour tout.',true),
('mothersday','vous','court','Aussi douce que votre cœur','Que {annee} vous apporte une journée aussi douce que votre cœur.',true),
('mothersday','vous','court','L''occasion de vous dire merci','Fête des Mères {annee} : l''occasion de vous dire merci.',true),
('mothersday','vous','court','Remplie de bonheur','Que cette Fête des Mères {annee} soit remplie de bonheur.',true),
('mothersday','vous','court','Que l''amour brille pour vous !','Bonne Fête des Mères {annee}, et que l''amour brille pour vous !',true),
('mothersday','vous','court','Célébrer votre dévouement','Fête des Mères {annee} : un jour pour célébrer votre dévouement.',true),
('mothersday','vous','court','Une journée inoubliable','Que {annee} soit une Fête des Mères inoubliable.',true),
('mothersday','vous','court','Vous êtes formidable','Joyeuse Fête des Mères {annee} ! Vous êtes formidable.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('mothersday','vous','moyen','Aussi doux que votre cœur','Bonne Fête des Mères {annee} ! Que cette journée soit remplie d''amour, de tendresse et de moments précieux avec ceux qui comptent pour vous. Que chaque instant soit aussi doux que votre cœur.',true),
('mothersday','vous','moyen','Aussi magique que votre sourire','Que cette Fête des Mères {annee} vous apporte autant de bonheur que vous en offrez autour de vous. Que chaque moment soit aussi magique que votre sourire.',true),
('mothersday','vous','moyen','Aussi lumineuse que votre âme','Joyeuse Fête des Mères {annee} ! Que cette fête soit aussi lumineuse que votre âme et aussi joyeuse que vos rires.',true),
('mothersday','vous','moyen','Votre amour et votre dévouement','Fête des Mères {annee}, c''est l''occasion de célébrer votre amour et votre dévouement. Que chaque instant soit une nouvelle raison de sourire.',true),
('mothersday','vous','moyen','Moments inoubliables','Que cette Fête des Mères {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que votre avenir.',true),
('mothersday','vous','moyen','Aussi douce que vos rêves','Bonne Fête des Mères {annee} ! Que cette journée soit aussi douce que vos rêves et aussi chaleureuse que votre cœur.',true),
('mothersday','vous','moyen','Vous êtes importante','Fête des Mères {annee}, c''est le moment de vous rappeler à quel point vous êtes importante. Que chaque instant soit une nouvelle preuve de l''amour qui vous entoure.',true),
('mothersday','vous','moyen','Aussi précieux que votre sourire','Que cette Fête des Mères {annee} soit une source de bonheur et de réconfort. Que chaque moment soit aussi précieux que votre sourire.',true),
('mothersday','vous','moyen','Aussi joyeuse que votre cœur','Joyeuse Fête des Mères {annee} ! Que cette fête soit aussi lumineuse que votre âme et aussi joyeuse que votre cœur.',true),
('mothersday','vous','moyen','Votre amour inconditionnel','Fête des Mères {annee} : un jour pour célébrer votre amour inconditionnel. Que chaque instant soit aussi beau que vous.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('mothersday','vous','long','Votre amour inconditionnel et votre dévouement','Bonne Fête des Mères {annee} ! Aujourd''hui, c''est le moment de célébrer tout ce que vous faites pour nous, votre amour inconditionnel et votre dévouement sans limites. Que cette journée soit aussi douce que votre cœur, aussi lumineuse que votre sourire, et aussi joyeuse que vos rires. Que chaque instant passé avec vous soit une nouvelle raison de croire en la beauté de la vie. Que {annee} vous apporte tout ce que vous méritez : bonheur, paix et moments précieux. Que chaque moment soit aussi précieux que votre amour, et que chaque jour soit une nouvelle aventure à savourer.',true),
('mothersday','vous','long','Le symbole de tout ce que vous représentez','Que cette Fête des Mères {annee} soit bien plus qu''une simple journée : qu''elle soit le symbole de tout ce que vous représentez pour nous. Que chaque moment soit rempli de tendresse, de magie et de joie. Que cette fête vous rappelle à quel point vous êtes aimée et appréciée, et que chaque instant soit aussi précieux que ceux que vous nous offrez. Joyeuse Fête des Mères, et que cette année soit aussi belle que votre âme.',true),
('mothersday','vous','long','Vous comptez pour nous','Fête des Mères {annee}, c''est l''occasion de vous dire à quel point vous comptez pour nous. Que cette fête soit aussi joyeuse que vos rires, aussi chaleureuse que votre cœur, et aussi lumineuse que vos espérances. Que chaque instant soit une nouvelle raison de croire en la beauté de l''amour maternel. Joyeuse Fête des Mères, et que cette année vous apporte tout ce que vous méritez.',true),
('mothersday','vous','long','Votre amour est précieux','Aujourd''hui, c''est la Fête des Mères {annee}, et avec elle, l''occasion de vous rappeler à quel point votre amour est précieux. Que cette fête soit remplie de moments inoubliables, de tendresse et de joie. Que chaque instant soit une nouvelle preuve de l''amour qui nous unit. Joyeuse Fête des Mères, et que cette année soit aussi exceptionnelle que vous.',true),
('mothersday','vous','long','Aussi magique que vos rêves','Que cette Fête des Mères {annee} soit le début d''une période remplie de bonheur, de paix et d''amour. Que chaque moment passé avec vous soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les étoiles. Joyeuse Fête des Mères, et que cette fête soit aussi magique que vos rêves.',true),
('mothersday','vous','long','Un conte de fées qui devient réalité','La Fête des Mères {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que vos rêves, aussi chaleureuse que votre cœur, et aussi joyeuse que vos rires. Que chaque instant soit une nouvelle raison de croire en la magie de l''amour maternel. Joyeuse Fête des Mères, et que cette année vous apporte tout ce que vous désirez.',true),
('mothersday','vous','long','Aussi belle que votre âme','Que cette Fête des Mères {annee} soit remplie de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour vous. Que cette fête soit aussi belle que votre âme, et que chaque instant soit aussi précieux que votre cœur. Joyeuse Fête des Mères !',true),
('mothersday','vous','long','Ce qui rend votre amour si spécial','Aujourd''hui, c''est la Fête des Mères {annee}, et c''est l''occasion de célébrer tout ce qui rend votre amour si spécial. Que cette fête soit aussi joyeuse que vos rires, aussi douce que vos rêves, et aussi lumineuse que votre sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que vous.',true),
('mothersday','vous','long','Chaque moment une preuve de l''amour','Que cette Fête des Mères {annee} soit une fête remplie de magie, de tendresse et de moments précieux. Que chaque instant soit aussi beau que les souvenirs que vous créez, et que chaque moment soit une nouvelle preuve de l''amour qui vous entoure. Joyeuse Fête des Mères, et que cette année soit aussi belle que votre cœur.',true),
('mothersday','vous','long','La beauté de la vie','Fête des Mères {annee}, c''est le moment de vous retrouver, de partager et de célébrer votre amour. Que cette fête soit aussi chaleureuse que votre cœur, aussi lumineuse que votre sourire, et aussi douce que vos rêves. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Fête des Mères !',true);

-- ============================================================
-- FÊTE DES PÈRES (fathersday)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','tu','court','Bonne Fête des Pères {annee} ! 🎣','Bonne Fête des Pères {annee} ! 🎣',true),
('fathersday','tu','court','Aussi belle que ton amour','Que cette Fête des Pères {annee} soit aussi belle que ton amour.',true),
('fathersday','tu','court','Merci pour tout','Joyeuse Fête des Pères {annee} ! Merci pour tout.',true),
('fathersday','tu','court','Aussi forte que ton cœur','Que {annee} t''apporte une journée aussi forte que ton cœur.',true),
('fathersday','tu','court','L''occasion de te dire merci','Fête des Pères {annee} : l''occasion de te dire merci.',true),
('fathersday','tu','court','Remplie de bonheur','Que cette Fête des Pères {annee} soit remplie de bonheur.',true),
('fathersday','tu','court','Que la fierté brille pour toi !','Bonne Fête des Pères {annee}, et que la fierté brille pour toi !',true),
('fathersday','tu','court','Célébrer ton rôle unique','Fête des Pères {annee} : un jour pour célébrer ton rôle unique.',true),
('fathersday','tu','court','Une journée inoubliable','Que {annee} soit une Fête des Pères inoubliable.',true),
('fathersday','tu','court','Tu es un pilier','Joyeuse Fête des Pères {annee} ! Tu es un pilier.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','tu','moyen','Aussi fort que ton cœur','Bonne Fête des Pères {annee} ! Que cette journée soit remplie de fierté, de joie et de moments précieux avec ceux qui comptent pour toi. Que chaque instant soit aussi fort que ton cœur.',true),
('fathersday','tu','moyen','Aussi précieux que ton sourire','Que cette Fête des Pères {annee} t''apporte autant de bonheur que tu en donnes autour de toi. Que chaque moment soit aussi précieux que ton sourire.',true),
('fathersday','tu','moyen','Aussi lumineux que ton âme','Joyeuse Fête des Pères {annee} ! Que cette fête soit aussi lumineuse que ton âme et aussi joyeuse que tes rires.',true),
('fathersday','tu','moyen','Ton rôle, ton soutien et ton amour','Fête des Pères {annee}, c''est l''occasion de célébrer ton rôle, ton soutien et ton amour. Que chaque instant soit une nouvelle raison de sourire.',true),
('fathersday','tu','moyen','Moments inoubliables','Que cette Fête des Pères {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que ton avenir.',true),
('fathersday','tu','moyen','Aussi douce que tes rêves','Bonne Fête des Pères {annee} ! Que cette journée soit aussi douce que tes rêves et aussi chaleureuse que ton cœur.',true),
('fathersday','tu','moyen','Tu es important','Fête des Pères {annee}, c''est le moment de te rappeler à quel point tu es important. Que chaque instant soit une nouvelle preuve de l''amour qui t''entoure.',true),
('fathersday','tu','moyen','Aussi précieux que ton sourire','Que cette Fête des Pères {annee} soit une source de bonheur et de réconfort. Que chaque moment soit aussi précieux que ton sourire.',true),
('fathersday','tu','moyen','Aussi joyeux que ton cœur','Joyeuse Fête des Pères {annee} ! Que cette fête soit aussi lumineuse que ton âme et aussi joyeuse que ton cœur.',true),
('fathersday','tu','moyen','Ton amour et ta force','Fête des Pères {annee} : un jour pour célébrer ton amour et ta force. Que chaque instant soit aussi beau que toi.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','tu','long','Ton soutien sans faille et ton amour inconditionnel','Bonne Fête des Pères {annee} ! Aujourd''hui, c''est le moment de célébrer tout ce que tu fais pour nous, ton soutien sans faille et ton amour inconditionnel. Que cette journée soit aussi forte que ton cœur, aussi lumineuse que ton sourire, et aussi joyeuse que tes rires. Que chaque instant passé avec toi soit une nouvelle raison de croire en la beauté de la vie. Que {annee} t''apporte tout ce que tu mérites : bonheur, paix et moments précieux. Que chaque moment soit aussi précieux que ton amour, et que chaque jour soit une nouvelle aventure à savourer.',true),
('fathersday','tu','long','Le symbole de tout ce que tu représentes','Que cette Fête des Pères {annee} soit bien plus qu''une simple journée : qu''elle soit le symbole de tout ce que tu représentes pour nous. Que chaque moment soit rempli de fierté, de magie et de joie. Que cette fête te rappelle à quel point tu es aimé et apprécié, et que chaque instant soit aussi précieux que ceux que tu nous offres. Joyeuse Fête des Pères, et que cette année soit aussi belle que ton âme.',true),
('fathersday','tu','long','Tu comptes pour nous','Fête des Pères {annee}, c''est l''occasion de te dire à quel point tu comptes pour nous. Que cette fête soit aussi joyeuse que tes rires, aussi chaleureuse que ton cœur, et aussi lumineuse que tes espérances. Que chaque instant soit une nouvelle raison de croire en la beauté de l''amour paternel. Joyeuse Fête des Pères, et que cette année t''apporte tout ce que tu mérites.',true),
('fathersday','tu','long','Ton rôle est précieux','Aujourd''hui, c''est la Fête des Pères {annee}, et avec elle, l''occasion de te rappeler à quel point ton rôle est précieux. Que cette fête soit remplie de moments inoubliables, de fierté et de joie. Que chaque instant soit une nouvelle preuve de l''amour qui nous unit. Joyeuse Fête des Pères, et que cette année soit aussi exceptionnelle que toi.',true),
('fathersday','tu','long','Aussi magique que tes rêves','Que cette Fête des Pères {annee} soit le début d''une période remplie de bonheur, de paix et d''amour. Que chaque moment passé avec toi soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les étoiles. Joyeuse Fête des Pères, et que cette fête soit aussi magique que tes rêves.',true),
('fathersday','tu','long','Un conte de fées qui devient réalité','La Fête des Pères {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que tes rêves, aussi chaleureuse que ton cœur, et aussi joyeuse que tes rires. Que chaque instant soit une nouvelle raison de croire en la magie de l''amour paternel. Joyeuse Fête des Pères, et que cette année t''apporte tout ce que tu désires.',true),
('fathersday','tu','long','Aussi belle que ton âme','Que cette Fête des Pères {annee} soit remplie de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour toi. Que cette fête soit aussi belle que ton âme, et que chaque instant soit aussi précieux que ton cœur. Joyeuse Fête des Pères !',true),
('fathersday','tu','long','Ce qui rend ton rôle si spécial','Aujourd''hui, c''est la Fête des Pères {annee}, et c''est l''occasion de célébrer tout ce qui rend ton rôle si spécial. Que cette fête soit aussi joyeuse que tes rires, aussi douce que tes rêves, et aussi lumineuse que ton sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que toi.',true),
('fathersday','tu','long','Chaque moment une preuve de l''amour','Que cette Fête des Pères {annee} soit une fête remplie de magie, de fierté et de moments précieux. Que chaque instant soit aussi beau que les souvenirs que tu crées, et que chaque moment soit une nouvelle preuve de l''amour qui t''entoure. Joyeuse Fête des Pères, et que cette année soit aussi belle que ton cœur.',true),
('fathersday','tu','long','La beauté de la vie','Fête des Pères {annee}, c''est le moment de te retrouver, de partager et de célébrer ton amour. Que cette fête soit aussi chaleureuse que ton cœur, aussi lumineuse que ton sourire, et aussi douce que tes rêves. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Fête des Pères !',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','vous','court','Bonne Fête des Pères {annee} !','Bonne Fête des Pères {annee} !',true),
('fathersday','vous','court','Aussi belle que votre amour','Que cette Fête des Pères {annee} soit aussi belle que votre amour.',true),
('fathersday','vous','court','Merci pour tout','Joyeuse Fête des Pères {annee} ! Merci pour tout.',true),
('fathersday','vous','court','Aussi forte que votre cœur','Que {annee} vous apporte une journée aussi forte que votre cœur.',true),
('fathersday','vous','court','L''occasion de vous dire merci','Fête des Pères {annee} : l''occasion de vous dire merci.',true),
('fathersday','vous','court','Remplie de bonheur','Que cette Fête des Pères {annee} soit remplie de bonheur.',true),
('fathersday','vous','court','Que la fierté brille pour vous !','Bonne Fête des Pères {annee}, et que la fierté brille pour vous !',true),
('fathersday','vous','court','Célébrer votre rôle unique','Fête des Pères {annee} : un jour pour célébrer votre rôle unique.',true),
('fathersday','vous','court','Une journée inoubliable','Que {annee} soit une Fête des Pères inoubliable.',true),
('fathersday','vous','court','Vous êtes un pilier','Joyeuse Fête des Pères {annee} ! Vous êtes un pilier.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','vous','moyen','Aussi fort que votre cœur','Bonne Fête des Pères {annee} ! Que cette journée soit remplie de fierté, de joie et de moments précieux avec ceux qui comptent pour vous. Que chaque instant soit aussi fort que votre cœur.',true),
('fathersday','vous','moyen','Aussi précieux que votre sourire','Que cette Fête des Pères {annee} vous apporte autant de bonheur que vous en offrez autour de vous. Que chaque moment soit aussi précieux que votre sourire.',true),
('fathersday','vous','moyen','Aussi lumineux que votre âme','Joyeuse Fête des Pères {annee} ! Que cette fête soit aussi lumineuse que votre âme et aussi joyeuse que vos rires.',true),
('fathersday','vous','moyen','Votre rôle, votre soutien et votre amour','Fête des Pères {annee}, c''est l''occasion de célébrer votre rôle, votre soutien et votre amour. Que chaque instant soit une nouvelle raison de sourire.',true),
('fathersday','vous','moyen','Moments inoubliables','Que cette Fête des Pères {annee} soit remplie de magie, de paix et de moments inoubliables. Que chaque jour soit aussi lumineux que votre avenir.',true),
('fathersday','vous','moyen','Aussi douce que vos rêves','Bonne Fête des Pères {annee} ! Que cette journée soit aussi douce que vos rêves et aussi chaleureuse que votre cœur.',true),
('fathersday','vous','moyen','Vous êtes important','Fête des Pères {annee}, c''est le moment de vous rappeler à quel point vous êtes important. Que chaque instant soit une nouvelle preuve de l''amour qui vous entoure.',true),
('fathersday','vous','moyen','Aussi précieux que votre sourire','Que cette Fête des Pères {annee} soit une source de bonheur et de réconfort. Que chaque moment soit aussi précieux que votre sourire.',true),
('fathersday','vous','moyen','Aussi joyeux que votre cœur','Joyeuse Fête des Pères {annee} ! Que cette fête soit aussi lumineuse que votre âme et aussi joyeuse que votre cœur.',true),
('fathersday','vous','moyen','Votre amour et votre force','Fête des Pères {annee} : un jour pour célébrer votre amour et votre force. Que chaque instant soit aussi beau que vous.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('fathersday','vous','long','Votre soutien sans faille et votre amour inconditionnel','Bonne Fête des Pères {annee} ! Aujourd''hui, c''est le moment de célébrer tout ce que vous faites pour nous, votre soutien sans faille et votre amour inconditionnel. Que cette journée soit aussi forte que votre cœur, aussi lumineuse que votre sourire, et aussi joyeuse que vos rires. Que chaque instant passé avec vous soit une nouvelle raison de croire en la beauté de la vie. Que {annee} vous apporte tout ce que vous méritez : bonheur, paix et moments précieux. Que chaque moment soit aussi précieux que votre amour, et que chaque jour soit une nouvelle aventure à savourer.',true),
('fathersday','vous','long','Le symbole de tout ce que vous représentez','Que cette Fête des Pères {annee} soit bien plus qu''une simple journée : qu''elle soit le symbole de tout ce que vous représentez pour nous. Que chaque moment soit rempli de fierté, de magie et de joie. Que cette fête vous rappelle à quel point vous êtes aimé et apprécié, et que chaque instant soit aussi précieux que ceux que vous nous offrez. Joyeuse Fête des Pères, et que cette année soit aussi belle que votre âme.',true),
('fathersday','vous','long','Vous comptez pour nous','Fête des Pères {annee}, c''est l''occasion de vous dire à quel point vous comptez pour nous. Que cette fête soit aussi joyeuse que vos rires, aussi chaleureuse que votre cœur, et aussi lumineuse que vos espérances. Que chaque instant soit une nouvelle raison de croire en la beauté de l''amour paternel. Joyeuse Fête des Pères, et que cette année vous apporte tout ce que vous méritez.',true),
('fathersday','vous','long','Votre rôle est précieux','Aujourd''hui, c''est la Fête des Pères {annee}, et avec elle, l''occasion de vous rappeler à quel point votre rôle est précieux. Que cette fête soit remplie de moments inoubliables, de fierté et de joie. Que chaque instant soit une nouvelle preuve de l''amour qui nous unit. Joyeuse Fête des Pères, et que cette année soit aussi exceptionnelle que vous.',true),
('fathersday','vous','long','Aussi magique que vos rêves','Que cette Fête des Pères {annee} soit le début d''une période remplie de bonheur, de paix et d''amour. Que chaque moment passé avec vous soit aussi précieux que l''or, et que chaque sourire soit aussi lumineux que les étoiles. Joyeuse Fête des Pères, et que cette fête soit aussi magique que vos rêves.',true),
('fathersday','vous','long','Un conte de fées qui devient réalité','La Fête des Pères {annee}, c''est comme un conte de fées qui devient réalité. Que cette fête soit aussi douce que vos rêves, aussi chaleureuse que votre cœur, et aussi joyeuse que vos rires. Que chaque instant soit une nouvelle raison de croire en la magie de l''amour paternel. Joyeuse Fête des Pères, et que cette année vous apporte tout ce que vous désirez.',true),
('fathersday','vous','long','Aussi belle que votre âme','Que cette Fête des Pères {annee} soit remplie de lumière, de chaleur et d''amour. Que chaque moment soit une nouvelle aventure à partager avec ceux qui comptent pour vous. Que cette fête soit aussi belle que votre âme, et que chaque instant soit aussi précieux que votre cœur. Joyeuse Fête des Pères !',true),
('fathersday','vous','long','Ce qui rend votre rôle si spécial','Aujourd''hui, c''est la Fête des Pères {annee}, et c''est l''occasion de célébrer tout ce qui rend votre rôle si spécial. Que cette fête soit aussi joyeuse que vos rires, aussi douce que vos rêves, et aussi lumineuse que votre sourire. Que chaque instant soit une nouvelle raison de sourire, et que cette année soit aussi exceptionnelle que vous.',true),
('fathersday','vous','long','Chaque moment une preuve de l''amour','Que cette Fête des Pères {annee} soit une fête remplie de magie, de fierté et de moments précieux. Que chaque instant soit aussi beau que les souvenirs que vous créez, et que chaque moment soit une nouvelle preuve de l''amour qui vous entoure. Joyeuse Fête des Pères, et que cette année soit aussi belle que votre cœur.',true),
('fathersday','vous','long','La beauté de la vie','Fête des Pères {annee}, c''est le moment de vous retrouver, de partager et de célébrer votre amour. Que cette fête soit aussi chaleureuse que votre cœur, aussi lumineuse que votre sourire, et aussi douce que vos rêves. Que chaque instant soit une nouvelle raison de croire en la beauté de la vie. Joyeuse Fête des Pères !',true);
