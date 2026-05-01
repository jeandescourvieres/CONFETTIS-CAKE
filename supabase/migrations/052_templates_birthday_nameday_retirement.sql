-- Migration 052 : Remplacement Birthday + Nameday + Retirement
-- DELETE old templates from migration 048, INSERT better quality versions

DELETE FROM message_templates WHERE occasion IN ('birthday','nameday','retirement') AND is_system = true;

-- ════════════════════════════════════════════════════════
-- ANNIVERSAIRE (birthday)
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birthday','tu','court','Joyeux anniversaire ! 🎉','Joyeux anniversaire ! 🎉',true),
('birthday','tu','court','Que cette année soit la meilleure','Bonne fête, et que cette année soit la meilleure.',true),
('birthday','tu','court','Toujours aussi jeune ! 😉','Un an de plus, une bougie de plus… et toujours aussi jeune ! 😉',true),
('birthday','tu','court','Tu mérites le meilleur','Joyeux anniversaire, tu mérites le meilleur.',true),
('birthday','tu','court','Aussi géniale que toi','Que cette journée soit aussi géniale que toi.',true),
('birthday','tu','court','Que tous tes vœux se réalisent','Bonne fête, et que tous tes vœux se réalisent.',true),
('birthday','tu','court','Une raison de plus de célébrer ! 🎂','Un an de plus, une raison de plus de célébrer ! 🎂',true),
('birthday','tu','court','Joyeux anniversaire, superstar !','Joyeux anniversaire, superstar !',true),
('birthday','tu','court','Bonheur et réussite','Que cette année t''apporte bonheur et réussite.',true),
('birthday','tu','court','Que la joie soit au rendez-vous','Bonne fête, et que la joie soit au rendez-vous.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birthday','vous','court','Joyeux anniversaire !','Joyeux anniversaire !',true),
('birthday','vous','court','À la hauteur de vos espérances','Bonne fête, et que cette année soit à la hauteur de vos espérances.',true),
('birthday','vous','court','Tous nos vœux pour votre anniversaire','Tous nos vœux pour votre anniversaire.',true),
('birthday','vous','court','Aussi belle que vous','Que cette journée soit aussi belle que vous.',true),
('birthday','vous','court','Bonheur et santé','Bonne fête, et que cette nouvelle année vous apporte bonheur et santé.',true),
('birthday','vous','court','Que tous vos projets se réalisent','Joyeux anniversaire, et que tous vos projets se réalisent.',true),
('birthday','vous','court','Une merveilleuse journée d''anniversaire','Nous vous souhaitons une merveilleuse journée d''anniversaire.',true),
('birthday','vous','court','Succès et joie','Que cette année soit remplie de succès et de joie.',true),
('birthday','vous','court','Que chaque instant soit précieux','Bonne fête, et que chaque instant soit précieux.',true),
('birthday','vous','court','Que cette journée soit inoubliable','Joyeux anniversaire, et que cette journée soit inoubliable.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birthday','tu','moyen','Autant de bonheur que tu en donnes','Joyeux anniversaire ! Que cette année t''apporte autant de bonheur que tu en donnes autour de toi.',true),
('birthday','tu','moyen','Profite de cette journée spéciale','Bonne fête ! Profite de cette journée spéciale, tu le mérites.',true),
('birthday','tu','moyen','Une nouvelle aventure à vivre','Un an de plus, une nouvelle aventure à vivre. Joyeux anniversaire.',true),
('birthday','tu','moyen','Rires, amour et réussite','Que cette année soit remplie de rires, d''amour et de réussite. Bonne fête.',true),
('birthday','tu','moyen','Que tous tes rêves deviennent réalité','Joyeux anniversaire ! Que tous tes rêves deviennent réalité.',true),
('birthday','tu','moyen','Cette journée doit l''être aussi','Tu es une personne incroyable, et cette journée doit l''être aussi. Bonne fête.',true),
('birthday','tu','moyen','Santé, bonheur et belles surprises','Que cette année t''apporte santé, bonheur et plein de belles surprises. Joyeux anniversaire.',true),
('birthday','tu','moyen','Aussi unique que toi','Bonne fête ! Que cette journée soit aussi unique que toi.',true),
('birthday','tu','moyen','Tu comptes énormément pour nous','Joyeux anniversaire ! Merci d''être là, tu comptes énormément pour nous.',true),
('birthday','tu','moyen','Que cette année soit la plus belle','Que cette année soit la plus belle de toutes. Bonne fête.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birthday','vous','moyen','Autant de bonheur que vous en offrez','Joyeux anniversaire ! Que cette année vous apporte autant de bonheur que vous en offrez autour de vous.',true),
('birthday','vous','moyen','Profitez de cette journée spéciale','Bonne fête ! Profitez de cette journée spéciale, vous le méritez.',true),
('birthday','vous','moyen','Une nouvelle aventure à vivre','Un an de plus, une nouvelle aventure à vivre. Joyeux anniversaire.',true),
('birthday','vous','moyen','Rires, amour et réussite','Que cette année soit remplie de rires, d''amour et de réussite. Bonne fête.',true),
('birthday','vous','moyen','Que tous vos rêves deviennent réalité','Joyeux anniversaire ! Que tous vos rêves deviennent réalité.',true),
('birthday','vous','moyen','Cette journée doit l''être aussi','Vous êtes une personne inspirante, et cette journée doit l''être aussi. Bonne fête.',true),
('birthday','vous','moyen','Santé, bonheur et belles surprises','Que cette année vous apporte santé, bonheur et plein de belles surprises. Joyeux anniversaire.',true),
('birthday','vous','moyen','Aussi unique que vous','Bonne fête ! Que cette journée soit aussi unique que vous.',true),
('birthday','vous','moyen','Vous comptez énormément pour nous','Joyeux anniversaire ! Merci d''être là, vous comptez énormément pour nous.',true),
('birthday','vous','moyen','Que cette année soit la plus belle','Que cette année soit la plus belle de toutes. Bonne fête.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birthday','tu','long','À quel point tu comptes pour nous','Joyeux anniversaire ! Aujourd''hui, c''est ta journée, et nous voulons que tu saches à quel point tu comptes pour nous. Que cette nouvelle année t''apporte tout ce que tu désires : bonheur, santé, amour et réussite. Profite de chaque instant, car tu le mérites amplement. Que cette journée soit aussi exceptionnelle que toi.',true),
('birthday','tu','long','Une nouvelle page dans le livre de ta vie','Bonne fête ! Un an de plus, c''est une nouvelle page à écrire dans le livre de ta vie. Nous espérons que cette année sera remplie de joies, de défis relevés et de moments inoubliables. Merci d''être qui tu es, et que cette journée soit à la hauteur de ta personnalité rayonnante.',true),
('birthday','tu','long','Un cœur immense et une énergie contagieuse','Joyeux anniversaire ! Tu es une personne unique, avec un cœur immense et une énergie contagieuse. Que cette année t''apporte tout ce que tu mérites : du bonheur, de la réussite, et surtout, beaucoup d''amour. Nous sommes chanceux de t''avoir dans notre vie. Bonne fête.',true),
('birthday','tu','long','Aussi belle que ton sourire','Que cette journée soit aussi belle que ton sourire, aussi chaude que ton cœur, et aussi lumineuse que ta présence. Joyeux anniversaire ! Que cette nouvelle année soit remplie de rêves réalisés, de projets aboutis et de moments partagés avec ceux qui comptent.',true),
('birthday','tu','long','Nous célébrons la personne incroyable que tu es','Joyeux anniversaire ! Aujourd''hui, nous célébrons bien plus qu''un anniversaire : nous célébrons la personne incroyable que tu es. Que cette année t''apporte tout ce que tu désires, et que chaque jour soit une nouvelle raison de sourire.',true),
('birthday','tu','long','Illuminer les journées de ceux qui t''entourent','Bonne fête ! Tu as cette capacité unique à illuminer les journées de ceux qui t''entourent. Que cette année soit aussi radieuse que toi, et que chaque moment soit une nouvelle aventure. Joyeux anniversaire.',true),
('birthday','tu','long','Rires, joie et moments précieux','Joyeux anniversaire ! Que cette journée soit remplie de rires, de joie et de moments précieux. Tu mérites le meilleur, et nous espérons que cette année te le donnera. Merci d''être là, et que cette fête soit inoubliable.',true),
('birthday','tu','long','Vivre pleinement, aimer profondément','Un an de plus, c''est une nouvelle opportunité de vivre pleinement, d''aimer profondément et de rêver sans limites. Joyeux anniversaire ! Que cette année soit aussi exceptionnelle que toi, et que chaque jour t''apporte son lot de bonheur.',true),
('birthday','tu','long','Tu es important pour nous','Joyeux anniversaire ! Aujourd''hui, nous voulons te dire à quel point tu es important pour nous. Que cette année soit remplie de succès, de santé et de bonheur. Profite de cette journée spéciale, car tu le mérites plus que tout.',true),
('birthday','tu','long','Des projets fous et des rencontres inoubliables','Bonne fête ! Que cette année soit celle de tous les possibles : des projets fous, des rencontres inoubliables et des moments de pur bonheur. Joyeux anniversaire, et que chaque jour soit une nouvelle aventure.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birthday','vous','long','À quel point vous comptez pour nous','Joyeux anniversaire ! Aujourd''hui, c''est votre journée, et nous tenons à vous dire à quel point vous comptez pour nous. Que cette nouvelle année vous apporte tout ce que vous désirez : bonheur, santé, amour et réussite. Profitez de chaque instant, car vous le méritez amplement. Que cette journée soit aussi exceptionnelle que vous.',true),
('birthday','vous','long','Une nouvelle page dans le livre de votre vie','Bonne fête ! Un an de plus, c''est une nouvelle page à écrire dans le livre de votre vie. Nous espérons que cette année sera remplie de joies, de défis relevés et de moments inoubliables. Merci d''être qui vous êtes, et que cette journée soit à la hauteur de votre personnalité rayonnante.',true),
('birthday','vous','long','Un cœur immense et une énergie contagieuse','Joyeux anniversaire ! Vous êtes une personne unique, avec un cœur immense et une énergie contagieuse. Que cette année vous apporte tout ce que vous méritez : du bonheur, de la réussite, et surtout, beaucoup d''amour. Nous sommes chanceux de vous avoir dans notre vie. Bonne fête.',true),
('birthday','vous','long','Aussi belle que votre sourire','Que cette journée soit aussi belle que votre sourire, aussi chaude que votre cœur, et aussi lumineuse que votre présence. Joyeux anniversaire ! Que cette nouvelle année soit remplie de rêves réalisés, de projets aboutis et de moments partagés avec ceux qui comptent.',true),
('birthday','vous','long','Nous célébrons la personne inspirante que vous êtes','Joyeux anniversaire ! Aujourd''hui, nous célébrons bien plus qu''un anniversaire : nous célébrons la personne inspirante que vous êtes. Que cette année vous apporte tout ce que vous désirez, et que chaque jour soit une nouvelle raison de sourire.',true),
('birthday','vous','long','Illuminer les journées de ceux qui vous entourent','Bonne fête ! Vous avez cette capacité unique à illuminer les journées de ceux qui vous entourent. Que cette année soit aussi radieuse que vous, et que chaque moment soit une nouvelle aventure. Joyeux anniversaire.',true),
('birthday','vous','long','Rires, joie et moments précieux','Joyeux anniversaire ! Que cette journée soit remplie de rires, de joie et de moments précieux. Vous méritez le meilleur, et nous espérons que cette année vous le donnera. Merci d''être là, et que cette fête soit inoubliable.',true),
('birthday','vous','long','Vivre pleinement, aimer profondément','Un an de plus, c''est une nouvelle opportunité de vivre pleinement, d''aimer profondément et de rêver sans limites. Joyeux anniversaire ! Que cette année soit aussi exceptionnelle que vous, et que chaque jour vous apporte son lot de bonheur.',true),
('birthday','vous','long','Vous êtes important pour nous','Joyeux anniversaire ! Aujourd''hui, nous voulons vous dire à quel point vous êtes important pour nous. Que cette année soit remplie de succès, de santé et de bonheur. Profitez de cette journée spéciale, car vous le méritez plus que tout.',true),
('birthday','vous','long','Des projets fous et des rencontres inoubliables','Bonne fête ! Que cette année soit celle de tous les possibles : des projets fous, des rencontres inoubliables et des moments de pur bonheur. Joyeux anniversaire, et que chaque jour soit une nouvelle aventure.',true);

-- ════════════════════════════════════════════════════════
-- BONNE FÊTE (nameday)
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('nameday','tu','court','Bonne fête ! 🎉','Bonne fête ! 🎉',true),
('nameday','tu','court','Aussi joyeuse que toi !','Que cette journée soit aussi joyeuse que toi !',true),
('nameday','tu','court','Profite bien de ta fête','Profite bien de ta fête, tu le mérites.',true),
('nameday','tu','court','Que le bonheur soit au rendez-vous !','Bonne fête, et que le bonheur soit au rendez-vous !',true),
('nameday','tu','court','Une journée spéciale pour une personne spéciale','Une journée spéciale pour une personne spéciale. Bonne fête !',true),
('nameday','tu','court','Que cette fête soit inoubliable !','Que cette fête soit inoubliable !',true),
('nameday','tu','court','Que tous tes vœux se réalisent','Bonne fête, et que tous tes vœux se réalisent.',true),
('nameday','tu','court','Savoure-la à fond !','C''est ta journée : savoure-la à fond !',true),
('nameday','tu','court','Que la joie t''accompagne toute l''année','Bonne fête, et que la joie t''accompagne toute l''année.',true),
('nameday','tu','court','Aussi brillante que ton sourire !','Que cette fête soit aussi brillante que ton sourire !',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('nameday','vous','court','Bonne fête !','Bonne fête !',true),
('nameday','vous','court','Aussi joyeuse que vous','Que cette journée soit aussi joyeuse que vous.',true),
('nameday','vous','court','Profitez bien de votre fête','Profitez bien de votre fête, vous le méritez.',true),
('nameday','vous','court','Que le bonheur soit au rendez-vous','Bonne fête, et que le bonheur soit au rendez-vous.',true),
('nameday','vous','court','Une journée spéciale pour une personne spéciale','Une journée spéciale pour une personne spéciale. Bonne fête !',true),
('nameday','vous','court','Que cette fête soit inoubliable','Que cette fête soit inoubliable.',true),
('nameday','vous','court','Que tous vos vœux se réalisent','Bonne fête, et que tous vos vœux se réalisent.',true),
('nameday','vous','court','Savourez-la à fond','C''est votre journée : savourez-la à fond.',true),
('nameday','vous','court','Que la joie vous accompagne toute l''année','Bonne fête, et que la joie vous accompagne toute l''année.',true),
('nameday','vous','court','Aussi brillante que votre sourire','Que cette fête soit aussi brillante que votre sourire.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('nameday','tu','moyen','Rires, joie et moments précieux','Bonne fête ! Que cette journée soit remplie de rires, de joie et de moments précieux.',true),
('nameday','tu','moyen','À la hauteur de tout ce que tu mérites','Aujourd''hui, c''est ta fête, et nous espérons qu''elle sera à la hauteur de tout ce que tu mérites.',true),
('nameday','tu','moyen','Autant de bonheur que tu en donnes','Que cette fête t''apporte autant de bonheur que tu en donnes autour de toi.',true),
('nameday','tu','moyen','Cette journée est la tienne','Bonne fête ! Profite de chaque instant, car cette journée est la tienne.',true),
('nameday','tu','moyen','Aussi belle que cette fête','Que cette année soit aussi belle que cette fête. Joyeuse célébration !',true),
('nameday','tu','moyen','Cette fête doit l''être aussi','Tu es une personne unique, et cette fête doit l''être aussi. Bonne journée !',true),
('nameday','tu','moyen','Le début d''une année remplie de succès','Que cette fête soit le début d''une année remplie de succès et de bonheur.',true),
('nameday','tu','moyen','Tu comptes énormément pour nous','Bonne fête ! Merci d''être là, tu comptes énormément pour nous.',true),
('nameday','tu','moyen','Aussi lumineuse que ta présence','Que cette journée soit aussi lumineuse que ta présence. Bonne fête !',true),
('nameday','tu','moyen','Célébrer ce qui compte : toi','Une fête, c''est fait pour célébrer ce qui compte : toi. Bonne journée !',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('nameday','vous','moyen','Rires, joie et moments précieux','Bonne fête ! Que cette journée soit remplie de rires, de joie et de moments précieux.',true),
('nameday','vous','moyen','À la hauteur de tout ce que vous méritez','Aujourd''hui, c''est votre fête, et nous espérons qu''elle sera à la hauteur de tout ce que vous méritez.',true),
('nameday','vous','moyen','Autant de bonheur que vous en offrez','Que cette fête vous apporte autant de bonheur que vous en offrez autour de vous.',true),
('nameday','vous','moyen','Cette journée est la vôtre','Bonne fête ! Profitez de chaque instant, car cette journée est la vôtre.',true),
('nameday','vous','moyen','Aussi belle que cette fête','Que cette année soit aussi belle que cette fête. Joyeuse célébration !',true),
('nameday','vous','moyen','Cette fête doit l''être aussi','Vous êtes une personne unique, et cette fête doit l''être aussi. Bonne journée !',true),
('nameday','vous','moyen','Le début d''une année remplie de succès','Que cette fête soit le début d''une année remplie de succès et de bonheur.',true),
('nameday','vous','moyen','Vous comptez énormément pour nous','Bonne fête ! Merci d''être là, vous comptez énormément pour nous.',true),
('nameday','vous','moyen','Aussi lumineuse que votre présence','Que cette journée soit aussi lumineuse que votre présence. Bonne fête !',true),
('nameday','vous','moyen','Célébrer ce qui compte : vous','Une fête, c''est fait pour célébrer ce qui compte : vous. Bonne journée !',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('nameday','tu','long','À quel point tu comptes pour nous','Bonne fête ! Aujourd''hui, c''est ta journée, et nous voulons que tu saches à quel point tu comptes pour nous. Que cette fête soit remplie de bonheur, de rires et de moments inoubliables. Profite de chaque instant, car tu le mérites amplement. Que cette journée soit aussi exceptionnelle que toi, et que l''année à venir soit à la hauteur de tes rêves.',true),
('nameday','tu','long','Unique, rayonnant(e), et plein(e) de vie','Que cette fête soit le reflet de tout ce que tu es : unique, rayonnant(e), et plein(e) de vie. Nous te souhaitons une journée aussi belle que ton cœur, aussi chaude que ton sourire, et aussi lumineuse que ta présence. Bonne fête, et que cette année t''apporte tout ce que tu désires.',true),
('nameday','tu','long','La personne incroyable que tu es','Bonne fête ! Aujourd''hui, nous célébrons bien plus qu''une date : nous célébrons la personne incroyable que tu es. Que cette journée soit remplie de joie, de succès et de moments partagés avec ceux qui comptent pour toi. Merci d''être là, et que cette fête soit le début d''une année exceptionnelle.',true),
('nameday','tu','long','La vie est belle quand on a des personnes comme toi','Une fête, c''est l''occasion de se rappeler à quel point la vie est belle, surtout quand on a des personnes comme toi à nos côtés. Que cette journée soit aussi magique que tu l''as toujours rendue pour nous. Bonne fête, et que chaque moment soit une nouvelle raison de sourire.',true),
('nameday','tu','long','Le point de départ d''une année remplie de bonheur','Joyeuse fête ! Que cette journée soit aussi riche en émotions que tu l''as été pour nous. Merci pour ta présence, ton énergie et ta bonne humeur. Nous espérons que cette fête sera le point de départ d''une année remplie de bonheur et de réussite.',true),
('nameday','tu','long','Une journée hors du commun','Bonne fête ! Tu as cette capacité unique à rendre chaque moment spécial, et aujourd''hui, c''est à ton tour de vivre une journée hors du commun. Que cette fête soit aussi inoubliable que les souvenirs que tu nous as offerts.',true),
('nameday','tu','long','Le début d''une nouvelle aventure','Que cette fête soit le début d''une nouvelle aventure, remplie de rêves réalisés et de projets aboutis. Bonne fête, et que chaque jour de cette nouvelle année t''apporte son lot de bonheur et de réussite.',true),
('nameday','tu','long','Une source d''inspiration, de joie et de motivation','Aujourd''hui, nous fêtons tout ce que tu représentes pour nous : une source d''inspiration, de joie et de motivation. Bonne fête, et que cette journée soit aussi exceptionnelle que toi. Merci d''être qui tu es.',true),
('nameday','tu','long','Aussi colorée que ta personnalité','Bonne fête ! Que cette journée soit aussi colorée que ta personnalité, aussi vibrante que ton énergie, et aussi douce que ton cœur. Nous te souhaitons une année remplie de succès, de santé et de bonheur.',true),
('nameday','tu','long','Multicolore comme ta vie','Une fête, c''est comme un arc-en-ciel : chaque couleur représente un moment de joie. Que cette journée soit aussi multicolore que ta vie, et que chaque instant soit une nouvelle raison de célébrer. Bonne fête !',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('nameday','vous','long','À quel point vous comptez pour nous','Bonne fête ! Aujourd''hui, c''est votre journée, et nous tenons à vous dire à quel point vous comptez pour nous. Que cette fête soit remplie de bonheur, de rires et de moments inoubliables. Profitez de chaque instant, car vous le méritez amplement. Que cette journée soit aussi exceptionnelle que vous, et que l''année à venir soit à la hauteur de vos rêves.',true),
('nameday','vous','long','Unique, rayonnant(e), et plein(e) de vie','Que cette fête soit le reflet de tout ce que vous êtes : unique, rayonnant(e), et plein(e) de vie. Nous vous souhaitons une journée aussi belle que votre cœur, aussi chaude que votre sourire, et aussi lumineuse que votre présence. Bonne fête, et que cette année vous apporte tout ce que vous désirez.',true),
('nameday','vous','long','La personne inspirante que vous êtes','Bonne fête ! Aujourd''hui, nous célébrons bien plus qu''une date : nous célébrons la personne inspirante que vous êtes. Que cette journée soit remplie de joie, de succès et de moments partagés avec ceux qui comptent pour vous. Merci d''être là, et que cette fête soit le début d''une année exceptionnelle.',true),
('nameday','vous','long','La vie est belle quand on a des personnes comme vous','Une fête, c''est l''occasion de se rappeler à quel point la vie est belle, surtout quand on a des personnes comme vous à nos côtés. Que cette journée soit aussi magique que vous l''avez toujours rendue pour nous. Bonne fête, et que chaque moment soit une nouvelle raison de sourire.',true),
('nameday','vous','long','Le point de départ d''une année remplie de bonheur','Joyeuse fête ! Que cette journée soit aussi riche en émotions que vous l''avez été pour nous. Merci pour votre présence, votre énergie et votre bonne humeur. Nous espérons que cette fête sera le point de départ d''une année remplie de bonheur et de réussite.',true),
('nameday','vous','long','Une journée hors du commun','Bonne fête ! Vous avez cette capacité unique à rendre chaque moment spécial, et aujourd''hui, c''est à votre tour de vivre une journée hors du commun. Que cette fête soit aussi inoubliable que les souvenirs que vous nous avez offerts.',true),
('nameday','vous','long','Le début d''une nouvelle aventure','Que cette fête soit le début d''une nouvelle aventure, remplie de rêves réalisés et de projets aboutis. Bonne fête, et que chaque jour de cette nouvelle année vous apporte son lot de bonheur et de réussite.',true),
('nameday','vous','long','Une source d''inspiration, de joie et de motivation','Aujourd''hui, nous fêtons tout ce que vous représentez pour nous : une source d''inspiration, de joie et de motivation. Bonne fête, et que cette journée soit aussi exceptionnelle que vous. Merci d''être qui vous êtes.',true),
('nameday','vous','long','Aussi colorée que votre personnalité','Bonne fête ! Que cette journée soit aussi colorée que votre personnalité, aussi vibrante que votre énergie, et aussi douce que votre cœur. Nous vous souhaitons une année remplie de succès, de santé et de bonheur.',true),
('nameday','vous','long','Multicolore comme votre vie','Une fête, c''est comme un arc-en-ciel : chaque couleur représente un moment de joie. Que cette journée soit aussi multicolore que votre vie, et que chaque instant soit une nouvelle raison de célébrer. Bonne fête !',true);

-- ════════════════════════════════════════════════════════
-- RETRAITE (retirement)
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('retirement','tu','court','Enfin libre ! 🌴','Enfin libre ! Profite bien de ta retraite, tu l''as méritée.',true),
('retirement','tu','court','Tu vas nous manquer','Bonne retraite, tu vas nous manquer.',true),
('retirement','tu','court','Plus de réveil, plus de stress ! 🎉','La retraite, c''est le top : plus de réveil, plus de stress ! 🎉',true),
('retirement','tu','court','On ne t''oubliera pas','Tu pars, mais on ne t''oubliera pas. Bonne route.',true),
('retirement','tu','court','Temps pour toi','Retraite = temps pour toi. Profites-en à fond.',true),
('retirement','tu','court','Sans alarmes matinales ! 😴','Un nouveau chapitre commence… sans alarmes matinales ! 😴',true),
('retirement','tu','court','Merci pour tout','Merci pour tout, et bonne retraite.',true),
('retirement','tu','court','Tu as bossé sans compter','Tu as bossé sans compter, maintenant repose-toi.',true),
('retirement','tu','court','Comme des vacances… sans fin ! 🌴','La retraite, c''est comme des vacances… mais sans fin ! 🌴',true),
('retirement','tu','court','On t''envie déjà','On t''envie déjà. Bonne retraite.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('retirement','vous','court','Enfin libre !','Enfin libre ! Profitez bien de votre retraite, vous l''avez méritée.',true),
('retirement','vous','court','Vous allez nous manquer','Bonne retraite, vous allez nous manquer.',true),
('retirement','vous','court','Une récompense après tant d''efforts','La retraite est une récompense après tant d''efforts. Félicitations.',true),
('retirement','vous','court','Des souvenirs inoubliables','Votre départ laisse des souvenirs inoubliables. Bonne continuation.',true),
('retirement','vous','court','Vous le méritez','Profitez de cette nouvelle étape, vous le méritez.',true),
('retirement','vous','court','Merci pour votre travail','Un grand merci pour votre travail, et bonne retraite.',true),
('retirement','vous','court','Savourer la vie','La retraite, c''est le moment de savourer la vie. Bon vent.',true),
('retirement','vous','court','Votre présence nous a marqués','Votre présence nous a marqués. Bonne retraite.',true),
('retirement','vous','court','L''heure de vous reposer','Après tant d''années, c''est l''heure de vous reposer. Bonne route.',true),
('retirement','vous','court','Aussi belle que votre carrière','Nous vous souhaitons une retraite aussi belle que votre carrière.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('retirement','tu','moyen','L''heure de la détente','Après toutes ces années de travail acharné, te voilà enfin à l''heure de la détente. Bonne retraite, et merci pour tout.',true),
('retirement','tu','moyen','N''oublie pas de venir nous voir','Ta présence nous a tant appris. Bonne continuation, et n''oublie pas de venir nous voir.',true),
('retirement','tu','moyen','Faire tout ce que tu as toujours repoussé','La retraite, c''est le moment de faire tout ce que tu as toujours repoussé. Bon courage pour cette belle étape.',true),
('retirement','tu','moyen','Merci pour ces souvenirs','Tu as été un collègue incroyable. Bonne retraite, et merci pour ces souvenirs.',true),
('retirement','tu','moyen','Voyages, passions et grasses mat'' ☕','Maintenant, c''est l''heure des voyages, des passions et des grasses mat''. Bonne retraite ! ☕',true),
('retirement','tu','moyen','Ta bonne humeur va nous manquer','Ton énergie et ta bonne humeur vont nous manquer. Profite bien de ta liberté.',true),
('retirement','tu','moyen','Une seconde jeunesse 😉','La retraite, c''est comme une seconde jeunesse… mais avec plus de sagesse ! 😉',true),
('retirement','tu','moyen','Merci pour ton engagement','Merci pour ton engagement, et bonne aventure en retraite.',true),
('retirement','tu','moyen','On espère te recroiser souvent','On espère te recroiser souvent. Bonne retraite.',true),
('retirement','tu','moyen','Tu as marqué cette entreprise','Tu as marqué cette entreprise. Bonne retraite, et à bientôt.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('retirement','vous','moyen','L''heure de la détente','Après toutes ces années de travail acharné, vous voilà enfin à l''heure de la détente. Bonne retraite, et merci pour tout.',true),
('retirement','vous','moyen','N''oubliez pas de venir nous voir','Votre présence nous a tant appris. Bonne continuation, et n''oubliez pas de venir nous voir.',true),
('retirement','vous','moyen','Faire tout ce que vous avez toujours repoussé','La retraite, c''est le moment de faire tout ce que vous avez toujours repoussé. Bon courage pour cette belle étape.',true),
('retirement','vous','moyen','Merci pour ces années partagées','Vous avez été un collègue exemplaire. Bonne retraite, et merci pour ces années partagées.',true),
('retirement','vous','moyen','Aussi épanouissante que votre carrière','Nous vous souhaitons une retraite aussi épanouissante que votre carrière l''a été.',true),
('retirement','vous','moyen','Votre professionnalisme nous a inspirés','Votre professionnalisme nous a inspirés. Bonne retraite.',true),
('retirement','vous','moyen','Bonheur et sérénité','Que cette nouvelle étape vous apporte bonheur et sérénité. Bonne route.',true),
('retirement','vous','moyen','Merci pour votre dévouement','Merci pour votre dévouement. Profitez bien de votre retraite.',true),
('retirement','vous','moyen','Une belle opportunité pour vous','Votre départ est une perte pour nous, mais une belle opportunité pour vous. Bonne continuation.',true),
('retirement','vous','moyen','Un excellent souvenir de vous','Nous garderons un excellent souvenir de vous. Bonne retraite.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('retirement','tu','long','La fin d''un chapitre, le début d''une nouvelle histoire','Aujourd''hui marque la fin d''un chapitre, mais aussi le début d''une nouvelle histoire pour toi. Merci pour ton engagement, ta bonne humeur et ces années passées à nos côtés. Nous te souhaitons une retraite aussi riche et épanouissante que ta carrière l''a été. Profite de chaque instant, tu le mérites amplement.',true),
('retirement','tu','long','De merveilleux souvenirs','Ton départ laisse un vide, mais aussi de merveilleux souvenirs. Ta rigueur, ton professionnalisme et ta gentillesse ont marqué notre équipe. Que cette retraite t''apporte bonheur, sérénité et beaucoup de temps pour toi et tes proches. Bonne route.',true),
('retirement','tu','long','Avec émotion et gratitude','C''est avec émotion que nous te disons au revoir, mais avec une immense gratitude pour tout ce que tu nous as offert. Ta présence a été une vraie chance pour nous tous. Nous espérons que cette nouvelle étape sera à la hauteur de tout ce que tu as accompli. Bonne retraite, et à très bientôt.',true),
('retirement','tu','long','Plus qu''un collègue : un ami','Tu as été bien plus qu''un collègue : un ami, un mentor, une source d''inspiration. Merci pour tout, et bonne retraite. Que cette nouvelle vie soit remplie de joies et de découvertes.',true),
('retirement','tu','long','Enfin ton tour de recevoir','Après tant d''années à donner le meilleur de toi-même, c''est enfin ton tour de recevoir : du temps, de la paix, et des moments précieux avec ceux que tu aimes. Bonne retraite, et n''oublie pas de nous donner des nouvelles.',true),
('retirement','tu','long','Ton sourire et ta bienveillance','Ton sourire, ta détermination et ta bienveillance ont illuminé nos journées. Merci pour tout, et bonne retraite. Que cette nouvelle aventure soit à la hauteur de tes rêves.',true),
('retirement','tu','long','Un grand voyage passionnant','La retraite, c''est comme un grand voyage : on ne sait pas toujours où ça mène, mais on est sûr que ce sera passionnant. Bonne route, et merci pour ces années inoubliables.',true),
('retirement','tu','long','Une empreinte indélébile','Tu as laissé une empreinte indélébile dans cette entreprise. Merci pour ton travail, ton énergie et ta bonne humeur. Nous te souhaitons une retraite aussi belle que tu l''as méritée.',true),
('retirement','tu','long','L''espoir de te recroiser souvent','C''est avec le cœur lourd que nous te disons au revoir, mais avec l''espoir de te recroiser souvent. Bonne retraite, et que chaque jour t''apporte son lot de bonheur.',true),
('retirement','tu','long','Un pilier pour nous tous','Tu as été un pilier pour nous tous. Merci pour ton soutien, tes conseils et ces moments partagés. Bonne retraite, et que cette nouvelle vie soit aussi exceptionnelle que toi.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('retirement','vous','long','La fin d''un chapitre, le début d''une nouvelle histoire','Aujourd''hui marque la fin d''un chapitre, mais aussi le début d''une nouvelle histoire pour vous. Merci pour votre engagement, votre bonne humeur et ces années passées à nos côtés. Nous vous souhaitons une retraite aussi riche et épanouissante que votre carrière l''a été. Profitez de chaque instant, vous le méritez amplement.',true),
('retirement','vous','long','De merveilleux souvenirs','Votre départ laisse un vide, mais aussi de merveilleux souvenirs. Votre rigueur, votre professionnalisme et votre gentillesse ont marqué notre équipe. Que cette retraite vous apporte bonheur, sérénité et beaucoup de temps pour vous et vos proches. Bonne route.',true),
('retirement','vous','long','Avec émotion et gratitude','C''est avec émotion que nous vous disons au revoir, mais avec une immense gratitude pour tout ce que vous nous avez offert. Votre présence a été une vraie chance pour nous tous. Nous espérons que cette nouvelle étape sera à la hauteur de tout ce que vous avez accompli. Bonne retraite, et à très bientôt.',true),
('retirement','vous','long','Plus qu''un collègue : un mentor','Vous avez été bien plus qu''un collègue : un mentor, une source d''inspiration et un modèle de professionnalisme. Merci pour tout, et bonne retraite. Que cette nouvelle vie soit remplie de joies et de découvertes.',true),
('retirement','vous','long','Enfin votre tour de recevoir','Après tant d''années à donner le meilleur de vous-même, c''est enfin votre tour de recevoir : du temps, de la paix, et des moments précieux avec ceux que vous aimez. Bonne retraite, et n''oubliez pas de nous donner des nouvelles.',true),
('retirement','vous','long','Votre sourire et votre bienveillance','Votre sourire, votre détermination et votre bienveillance ont illuminé nos journées. Merci pour tout, et bonne retraite. Que cette nouvelle aventure soit à la hauteur de vos rêves.',true),
('retirement','vous','long','Un grand voyage passionnant','La retraite, c''est comme un grand voyage : on ne sait pas toujours où cela mène, mais on est sûr que ce sera passionnant. Bonne route, et merci pour ces années inoubliables.',true),
('retirement','vous','long','Une empreinte indélébile','Vous avez laissé une empreinte indélébile dans cette entreprise. Merci pour votre travail, votre énergie et votre bonne humeur. Nous vous souhaitons une retraite aussi belle que vous l''avez méritée.',true),
('retirement','vous','long','L''espoir de vous recroiser souvent','C''est avec le cœur lourd que nous vous disons au revoir, mais avec l''espoir de vous recroiser souvent. Bonne retraite, et que chaque jour vous apporte son lot de bonheur.',true),
('retirement','vous','long','Un pilier pour nous tous','Vous avez été un pilier pour nous tous. Merci pour votre soutien, vos conseils et ces moments partagés. Bonne retraite, et que cette nouvelle vie soit aussi exceptionnelle que vous.',true);
