-- Migration 053 : Remplacement Engagement + Birth + Baptism
-- DELETE old templates from migration 048, INSERT better quality versions

DELETE FROM message_templates WHERE occasion IN ('engagement','birth','baptism') AND is_system = true;

-- ════════════════════════════════════════════════════════
-- FIANÇAILLES (engagement)
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('engagement','tu','court','Félicitations pour vos fiançailles ! 💍','Félicitations pour vos fiançailles ! 💍',true),
('engagement','tu','court','Un pas de plus vers le grand jour !','Un pas de plus vers le grand jour. Bonne chance à vous deux !',true),
('engagement','tu','court','Le début d''une belle aventure','Que cette promesse soit le début d''une belle aventure.',true),
('engagement','tu','court','Que votre amour grandisse encore !','Félicitations, et que votre amour grandisse encore !',true),
('engagement','tu','court','Une bague, un sourire, un avenir à deux. Bravo !','Une bague, un sourire, et un avenir à deux. Bravo !',true),
('engagement','tu','court','L''amour en mode "préparation" 😉','Les fiançailles, c''est l''amour en mode "préparation". 😉',true),
('engagement','tu','court','Aussi belle que votre histoire','Que cette étape soit aussi belle que votre histoire.',true),
('engagement','tu','court','Le meilleur est à venir !','Félicitations ! Le meilleur est à venir.',true),
('engagement','tu','court','Un oui pour la vie','Un oui pour les fiançailles, un oui pour la vie.',true),
('engagement','tu','court','Aussi solide que votre amour','Que votre engagement soit aussi solide que votre amour.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('engagement','vous','court','Félicitations pour vos fiançailles !','Félicitations pour vos fiançailles !',true),
('engagement','vous','court','Un pas de plus vers le grand jour','Un pas de plus vers le grand jour. Bonne chance à vous deux.',true),
('engagement','vous','court','Le début d''une belle aventure','Que cette promesse soit le début d''une belle aventure.',true),
('engagement','vous','court','Que votre amour grandisse encore','Félicitations, et que votre amour grandisse encore.',true),
('engagement','vous','court','Une bague, un sourire, un avenir à deux','Une bague, un sourire, et un avenir à deux. Bravo.',true),
('engagement','vous','court','Une étape importante vers une vie commune','Les fiançailles, c''est une étape importante vers une vie commune.',true),
('engagement','vous','court','Aussi belle que votre histoire','Que cette étape soit aussi belle que votre histoire.',true),
('engagement','vous','court','Le meilleur est à venir','Félicitations ! Le meilleur est à venir.',true),
('engagement','vous','court','Un oui pour la vie','Un oui pour les fiançailles, un oui pour la vie.',true),
('engagement','vous','court','Aussi solide que votre amour','Que votre engagement soit aussi solide que votre amour.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('engagement','tu','moyen','Remplie de bonheur et de complicité','Félicitations pour vos fiançailles ! Que cette étape soit remplie de bonheur, de complicité et de préparatifs excitants pour le grand jour. Vous formez un couple magnifique, et nous sommes ravis pour vous.',true),
('engagement','tu','moyen','Aussi belle que votre amour','Que vos fiançailles soient le début d''une aventure aussi belle que votre amour. Félicitations, et que chaque moment de cette période soit aussi joyeux que votre sourire aujourd''hui.',true),
('engagement','tu','moyen','Aussi magiques que votre histoire d''amour','Une bague, une promesse, et un avenir à construire ensemble. Que vos fiançailles soient aussi magiques que votre histoire d''amour.',true),
('engagement','tu','moyen','Remplie de rires, de rêves et de moments précieux','Vous avez choisi de vous engager l''un envers l''autre, et nous ne pourrions être plus heureux pour vous. Que cette période de fiançailles soit remplie de rires, de rêves et de moments précieux.',true),
('engagement','tu','moyen','Un avant-goût du bonheur à venir','Les fiançailles, c''est comme un avant-goût du bonheur à venir. Félicitations, et que cette étape soit aussi douce que votre amour.',true),
('engagement','tu','moyen','Chaque détail vous rapproche encore plus','Que vos fiançailles soient une période de joie pure, où chaque détail vous rapproche encore plus l''un de l''autre. Bravo pour cette belle décision !',true),
('engagement','tu','moyen','Ce n''est que le début d''une belle histoire','Vous avez dit "oui" aux fiançailles, et nous savons que ce n''est que le début d''une belle histoire. Que cette étape soit aussi lumineuse que votre avenir.',true),
('engagement','tu','moyen','Aussi uniques que votre couple','Félicitations ! Que vos fiançailles soient aussi uniques que votre couple, et que chaque instant vous rappelle pourquoi vous avez choisi de vous engager.',true),
('engagement','tu','moyen','Une bague au doigt, un cœur rempli de bonheur','Une promesse d''amour, une bague au doigt, et un cœur rempli de bonheur. Que vos fiançailles soient aussi inoubliables que ce moment.',true),
('engagement','tu','moyen','Une source de joie et de complicité','Que cette période de fiançailles soit pour vous une source de joie, de complicité et de préparatifs excitants. Félicitations !',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('engagement','vous','moyen','Remplie de bonheur et de complicité','Félicitations pour vos fiançailles ! Que cette étape soit remplie de bonheur, de complicité et de préparatifs excitants pour le grand jour. Vous formez un couple admirable, et nous sommes ravis pour vous.',true),
('engagement','vous','moyen','Aussi belle que votre amour','Que vos fiançailles soient le début d''une aventure aussi belle que votre amour. Félicitations, et que chaque moment de cette période soit aussi joyeux que votre sourire aujourd''hui.',true),
('engagement','vous','moyen','Aussi magiques que votre histoire d''amour','Une bague, une promesse, et un avenir à construire ensemble. Que vos fiançailles soient aussi magiques que votre histoire d''amour.',true),
('engagement','vous','moyen','Remplie de rires, de rêves et de moments précieux','Vous avez choisi de vous engager l''un envers l''autre, et nous ne pourrions être plus heureux pour vous. Que cette période de fiançailles soit remplie de rires, de rêves et de moments précieux.',true),
('engagement','vous','moyen','Un avant-goût du bonheur à venir','Les fiançailles, c''est comme un avant-goût du bonheur à venir. Félicitations, et que cette étape soit aussi douce que votre amour.',true),
('engagement','vous','moyen','Chaque détail vous rapproche encore plus','Que vos fiançailles soient une période de joie pure, où chaque détail vous rapproche encore plus l''un de l''autre. Bravo pour cette belle décision !',true),
('engagement','vous','moyen','Ce n''est que le début d''une belle histoire','Vous avez dit "oui" aux fiançailles, et nous savons que ce n''est que le début d''une belle histoire. Que cette étape soit aussi lumineuse que votre avenir.',true),
('engagement','vous','moyen','Aussi uniques que votre couple','Félicitations ! Que vos fiançailles soient aussi uniques que votre couple, et que chaque instant vous rappelle pourquoi vous avez choisi de vous engager.',true),
('engagement','vous','moyen','Une bague au doigt, un cœur rempli de bonheur','Une promesse d''amour, une bague au doigt, et un cœur rempli de bonheur. Que vos fiançailles soient aussi inoubliables que ce moment.',true),
('engagement','vous','moyen','Une source de joie et de complicité','Que cette période de fiançailles soit pour vous une source de joie, de complicité et de préparatifs excitants. Félicitations !',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('engagement','tu','long','Un pas de plus vers une vie commune','Félicitations pour vos fiançailles ! Aujourd''hui, vous avez fait un pas de plus vers une vie commune, et nous ne pourrions être plus heureux pour vous. Que cette période soit remplie de bonheur, de complicité et de moments inoubliables. Vous formez un couple incroyable, et nous savons que votre histoire sera aussi belle que cette étape. Que chaque jour de vos fiançailles soit une nouvelle raison de sourire, et que votre amour grandisse avec le temps, comme une plante que vous arrosez avec tendresse. Bonne route à vous deux !',true),
('engagement','tu','long','Le début d''une aventure aussi riche que vos rêves','Que vos fiançailles soient bien plus qu''une simple étape : qu''elles soient le début d''une aventure aussi riche que vos rêves. Vous avez choisi de vous engager l''un envers l''autre, et nous espérons que cette période sera remplie de joie, de tendresse et de préparatifs excitants. Félicitations, et que votre amour soit aussi solide que les promesses que vous vous êtes faites aujourd''hui.',true),
('engagement','tu','long','Une belle preuve d''amour','Aujourd''hui, vous avez scellé votre engagement avec une bague et une promesse, et ce geste résonne comme une belle preuve d''amour. Que vos fiançailles soient le début d''une histoire aussi profonde que votre relation. Nous vous souhaitons une période remplie de rires, de défis relevés ensemble, et de cette complicité qui fait des couples comme le vôtre une source d''inspiration. Félicitations !',true),
('engagement','tu','long','Chaque détail compte','Les fiançailles, c''est comme un voyage où chaque détail compte. Que cette période soit aussi belle que votre amour, aussi forte que votre engagement, et aussi lumineuse que vos sourires. Nous sommes si heureux de faire partie de ce moment si spécial pour vous. Que chaque jour qui passe renforce votre lien et vous apporte encore plus de bonheur.',true),
('engagement','tu','long','Une célébration de l''amour et de la confiance','Félicitations pour cette belle nouvelle ! Vos fiançailles sont une célébration de l''amour, de la confiance et de l''engagement. Que cette période soit aussi riche en émotions que cette journée l''a été. Nous vous souhaitons une aventure remplie de succès, de joie et de moments partagés avec ceux qui vous aiment. Que votre amour soit votre guide, et votre bonheur, votre plus grande réussite.',true),
('engagement','tu','long','Chaque jour, une nouvelle page de bonheur','Aujourd''hui, vous avez choisi de vous engager officiellement l''un envers l''autre, et nous savons que cette décision apportera à chacun de vous encore plus de bonheur. Que vos fiançailles soient le début d''une histoire remplie de tendresse, de respect et de complicité. Félicitations, et que chaque jour de cette période soit une nouvelle page de bonheur.',true),
('engagement','tu','long','Aussi inspirantes que ce moment','Que cette journée reste à jamais gravée dans vos cœurs comme le début d''une vie commune aussi belle que votre amour. Vous formez un couple exceptionnel, et nous espérons que vos fiançailles seront aussi inspirantes que ce moment. Félicitations, et que votre amour soit aussi éternel que vos souvenirs d''aujourd''hui.',true),
('engagement','tu','long','Un livre dont chaque chapitre vous rapproche du grand jour','Les fiançailles, c''est comme un livre dont chaque chapitre vous rapproche du grand jour. Que cette aventure soit aussi passionnante que vous l''imaginez, et que chaque étape vous unisse encore plus. Félicitations, et que vos fiançailles soient aussi magiques que ce jour.',true),
('engagement','tu','long','Aussi fort que les liens qui vous unissent','Vous avez choisi de partager votre vie, et aujourd''hui, nous célébrons ce choix avec vous. Que vos fiançailles soient le début d''une histoire remplie de bonheur, de succès et de moments précieux. Félicitations, et que votre amour soit aussi fort que les liens qui vous unissent.',true),
('engagement','tu','long','Aussi unique que votre amour','Que vos fiançailles soient le début d''une vie aussi belle que vos rêves. Vous formez un couple admirable, et nous savons que votre histoire sera aussi unique que votre amour. Félicitations, et que chaque jour de cette période soit une nouvelle raison de célébrer.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('engagement','vous','long','Un pas de plus vers une vie commune','Félicitations pour vos fiançailles ! Aujourd''hui, vous avez fait un pas de plus vers une vie commune, et nous ne pourrions être plus heureux pour vous. Que cette période soit remplie de bonheur, de complicité et de moments inoubliables. Vous formez un couple admirable, et nous savons que votre histoire sera aussi belle que cette étape. Que chaque jour de vos fiançailles soit une nouvelle raison de sourire, et que votre amour grandisse avec le temps, comme une plante que vous arrosez avec tendresse. Bonne route à vous deux !',true),
('engagement','vous','long','Le début d''une aventure aussi riche que vos rêves','Que vos fiançailles soient bien plus qu''une simple étape : qu''elles soient le début d''une aventure aussi riche que vos rêves. Vous avez choisi de vous engager l''un envers l''autre, et nous espérons que cette période sera remplie de joie, de tendresse et de préparatifs excitants. Félicitations, et que votre amour soit aussi solide que les promesses que vous vous êtes faites aujourd''hui.',true),
('engagement','vous','long','Une belle preuve d''amour','Aujourd''hui, vous avez scellé votre engagement avec une bague et une promesse, et ce geste résonne comme une belle preuve d''amour. Que vos fiançailles soient le début d''une histoire aussi profonde que votre relation. Nous vous souhaitons une période remplie de rires, de défis relevés ensemble, et de cette complicité qui fait des couples comme le vôtre une source d''inspiration. Félicitations !',true),
('engagement','vous','long','Chaque détail compte','Les fiançailles, c''est comme un voyage où chaque détail compte. Que cette période soit aussi belle que votre amour, aussi forte que votre engagement, et aussi lumineuse que vos sourires. Nous sommes si heureux de faire partie de ce moment si spécial pour vous. Que chaque jour qui passe renforce votre lien et vous apporte encore plus de bonheur.',true),
('engagement','vous','long','Une célébration de l''amour et de la confiance','Félicitations pour cette belle nouvelle ! Vos fiançailles sont une célébration de l''amour, de la confiance et de l''engagement. Que cette période soit aussi riche en émotions que cette journée l''a été. Nous vous souhaitons une aventure remplie de succès, de joie et de moments partagés avec ceux qui vous aiment. Que votre amour soit votre guide, et votre bonheur, votre plus grande réussite.',true),
('engagement','vous','long','Chaque jour, une nouvelle page de bonheur','Aujourd''hui, vous avez choisi de vous engager officiellement l''un envers l''autre, et nous savons que cette décision apportera à chacun de vous encore plus de bonheur. Que vos fiançailles soient le début d''une histoire remplie de tendresse, de respect et de complicité. Félicitations, et que chaque jour de cette période soit une nouvelle page de bonheur.',true),
('engagement','vous','long','Aussi inspirantes que ce moment','Que cette journée reste à jamais gravée dans vos cœurs comme le début d''une vie commune aussi belle que votre amour. Vous formez un couple exceptionnel, et nous espérons que vos fiançailles seront aussi inspirantes que ce moment. Félicitations, et que votre amour soit aussi éternel que vos souvenirs d''aujourd''hui.',true),
('engagement','vous','long','Un livre dont chaque chapitre vous rapproche du grand jour','Les fiançailles, c''est comme un livre dont chaque chapitre vous rapproche du grand jour. Que cette aventure soit aussi passionnante que vous l''imaginez, et que chaque étape vous unisse encore plus. Félicitations, et que vos fiançailles soient aussi magiques que ce jour.',true),
('engagement','vous','long','Aussi fort que les liens qui vous unissent','Vous avez choisi de partager votre vie, et aujourd''hui, nous célébrons ce choix avec vous. Que vos fiançailles soient le début d''une histoire remplie de bonheur, de succès et de moments précieux. Félicitations, et que votre amour soit aussi fort que les liens qui vous unissent.',true),
('engagement','vous','long','Aussi unique que votre amour','Que vos fiançailles soient le début d''une vie aussi belle que vos rêves. Vous formez un couple admirable, et nous savons que votre histoire sera aussi unique que votre amour. Félicitations, et que chaque jour de cette période soit une nouvelle raison de célébrer.',true);

-- ════════════════════════════════════════════════════════
-- NAISSANCE (birth)
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birth','tu','court','Félicitations pour cette merveilleuse naissance ! 👶','Félicitations pour cette merveilleuse naissance ! 👶',true),
('birth','tu','court','Bienvenue à ce petit bout de bonheur !','Bienvenue à ce petit bout de bonheur !',true),
('birth','tu','court','Autant de joie que de sourires','Que ce bébé apporte autant de joie que de sourires.',true),
('birth','tu','court','La vie vient de s''agrandir !','Félicitations, la vie vient de s''agrandir !',true),
('birth','tu','court','Avec des nuits courtes ! 😉','Un nouveau chapitre commence… avec des nuits courtes ! 😉',true),
('birth','tu','court','Aussi adorable que ses parents','Que ce bébé soit aussi adorable que ses parents.',true),
('birth','tu','court','Bienvenue dans ce monde, petit miracle !','Bienvenue dans ce monde, petit miracle !',true),
('birth','tu','court','Félicitations pour cette belle nouvelle !','Félicitations pour cette belle nouvelle !',true),
('birth','tu','court','Que ce bébé comble votre vie de bonheur','Que ce bébé comble votre vie de bonheur.',true),
('birth','tu','court','Un amour infini vient de naître','Un amour infini vient de naître.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birth','vous','court','Félicitations pour cette merveilleuse naissance !','Félicitations pour cette merveilleuse naissance !',true),
('birth','vous','court','Bienvenue à ce petit bout de bonheur','Bienvenue à ce petit bout de bonheur.',true),
('birth','vous','court','Autant de joie que de sourires','Que ce bébé apporte autant de joie que de sourires.',true),
('birth','vous','court','La vie vient de s''agrandir','Félicitations, la vie vient de s''agrandir.',true),
('birth','vous','court','Un nouveau chapitre commence pour vous','Un nouveau chapitre commence pour vous.',true),
('birth','vous','court','Une source de bonheur infini','Que ce bébé soit une source de bonheur infini.',true),
('birth','vous','court','Bienvenue dans ce monde, petit miracle','Bienvenue dans ce monde, petit miracle.',true),
('birth','vous','court','Félicitations pour cette belle nouvelle','Félicitations pour cette belle nouvelle.',true),
('birth','vous','court','Que ce bébé comble votre vie de joie','Que ce bébé comble votre vie de joie.',true),
('birth','vous','court','Un amour infini vient de naître','Un amour infini vient de naître dans votre famille.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birth','tu','moyen','Bonheur, santé et rires','Félicitations pour la naissance de votre bébé ! Que cette nouvelle vie soit remplie de bonheur, de santé et de rires. Ce petit être a déjà la chance d''avoir des parents aussi aimants.',true),
('birth','tu','moyen','Aussi précieux que ce jour','Bienvenue à ce petit miracle qui va illuminer vos journées. Que chaque moment passé avec ce bébé soit aussi précieux que ce jour.',true),
('birth','tu','moyen','Aussi belle que votre amour pour ce petit bout','La naissance d''un enfant, c''est le début d''une aventure incroyable. Félicitations, et que cette nouvelle étape soit aussi belle que votre amour pour ce petit bout.',true),
('birth','tu','moyen','Entouré d''amour, de tendresse et de joie','Que ce bébé grandisse entouré d''amour, de tendresse et de joie. Félicitations pour cette merveilleuse nouvelle !',true),
('birth','tu','moyen','Un peu de magie dans une vie','Un enfant, c''est un peu de magie qui entre dans une vie. Que ce petit être vous apporte autant de bonheur que vous en donnez autour de vous.',true),
('birth','tu','moyen','Aussi doux que vos rêves','Félicitations pour cette naissance ! Que ce bébé soit aussi doux que vos rêves et aussi fort que votre amour.',true),
('birth','tu','moyen','Chaque jour, une nouvelle raison de sourire','Bienvenue à ce petit ange qui va changer votre vie pour le meilleur. Que chaque jour avec ce bébé soit une nouvelle raison de sourire.',true),
('birth','tu','moyen','Comme un nouveau soleil qui se lève','La naissance d''un enfant, c''est comme un nouveau soleil qui se lève. Que ce bébé illumine votre vie de lumière et de joie.',true),
('birth','tu','moyen','Dans un environnement aussi aimant que le vôtre','Félicitations ! Que ce bébé grandisse dans un environnement aussi aimant que le vôtre.',true),
('birth','tu','moyen','D''amour inconditionnel','Que cette naissance soit le début d''une histoire remplie de bonheur, de découvertes et d''amour inconditionnel.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birth','vous','moyen','Bonheur, santé et rires','Félicitations pour la naissance de votre bébé ! Que cette nouvelle vie soit remplie de bonheur, de santé et de rires. Ce petit être a déjà la chance d''avoir des parents aussi attentionnés.',true),
('birth','vous','moyen','Aussi précieux que ce jour','Bienvenue à ce petit miracle qui va illuminer vos journées. Que chaque moment passé avec ce bébé soit aussi précieux que ce jour.',true),
('birth','vous','moyen','Aussi belle que votre amour pour ce petit bout','La naissance d''un enfant, c''est le début d''une aventure incroyable. Félicitations, et que cette nouvelle étape soit aussi belle que votre amour pour ce petit bout.',true),
('birth','vous','moyen','Entouré d''amour, de tendresse et de joie','Que ce bébé grandisse entouré d''amour, de tendresse et de joie. Félicitations pour cette merveilleuse nouvelle !',true),
('birth','vous','moyen','Un peu de magie dans une vie','Un enfant, c''est un peu de magie qui entre dans une vie. Que ce petit être vous apporte autant de bonheur que vous en offrez autour de vous.',true),
('birth','vous','moyen','Aussi doux que vos rêves','Félicitations pour cette naissance ! Que ce bébé soit aussi doux que vos rêves et aussi fort que votre amour.',true),
('birth','vous','moyen','Chaque jour, une nouvelle raison de sourire','Bienvenue à ce petit ange qui va changer votre vie pour le meilleur. Que chaque jour avec ce bébé soit une nouvelle raison de sourire.',true),
('birth','vous','moyen','Comme un nouveau soleil qui se lève','La naissance d''un enfant, c''est comme un nouveau soleil qui se lève. Que ce bébé illumine votre vie de lumière et de joie.',true),
('birth','vous','moyen','Dans un environnement aussi aimant que le vôtre','Félicitations ! Que ce bébé grandisse dans un environnement aussi aimant que le vôtre.',true),
('birth','vous','moyen','D''amour inconditionnel','Que cette naissance soit le début d''une histoire remplie de bonheur, de découvertes et d''amour inconditionnel.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birth','tu','long','Une vague de bonheur, de tendresse et d''amour infini','Félicitations pour la naissance de votre bébé ! Aujourd''hui, un petit être est entré dans votre vie, et avec lui, une vague de bonheur, de tendresse et d''amour infini. Que ce bébé grandisse entouré de tout ce qu''il y a de plus beau : votre amour, votre patience et votre joie. Que chaque jour avec ce petit bout soit une nouvelle aventure, remplie de découvertes, de rires et de moments précieux. Vous allez être des parents formidables, et nous savons que ce bébé aura une vie aussi merveilleuse que vous la rêvez.',true),
('birth','tu','long','Un nouveau chapitre rempli de promesses','Bienvenue à ce petit miracle qui va transformer vos journées en moments magiques. La naissance d''un enfant, c''est comme un nouveau chapitre qui s''écrit, rempli de promesses, de défis et de joies immenses. Que ce bébé vous apporte autant de bonheur que vous en donnez autour de vous. Félicitations, et que cette nouvelle étape soit aussi belle que votre amour pour ce petit être.',true),
('birth','tu','long','Rendre chaque instant aussi précieux que ce jour','Aujourd''hui, vous avez accueilli un nouveau membre dans votre famille, et nous ne pourrions être plus heureux pour vous. Que ce bébé grandisse dans un environnement rempli d''amour, de sécurité et de rires. La naissance d''un enfant, c''est le début d''une aventure incroyable, et nous savons que vous allez rendre chaque instant aussi précieux que ce jour. Félicitations, et que votre vie avec ce petit bout soit aussi lumineuse que vos sourires aujourd''hui.',true),
('birth','tu','long','Il illumine tout sur son passage','Un enfant, c''est un peu comme un rayon de soleil qui entre dans une vie : il illumine tout sur son passage. Que ce bébé soit pour vous une source de joie, de fierté et d''émerveillement. Félicitations pour cette naissance, et que chaque jour avec ce petit être soit une nouvelle raison de célébrer la vie. Vous allez vivre des moments inoubliables, et nous sommes si heureux de faire partie de cette belle aventure avec vous.',true),
('birth','tu','long','Une histoire d''amour qui durera toute une vie','La naissance de votre bébé, c''est bien plus qu''un événement : c''est le début d''une histoire d''amour qui durera toute une vie. Que ce petit être grandisse entouré de tout ce qu''il y a de plus précieux : votre tendresse, votre soutien et votre amour inconditionnel. Félicitations, et que cette nouvelle vie à trois (ou plus !) soit aussi belle que vos rêves.',true),
('birth','tu','long','Un cadeau du destin','Aujourd''hui, vous avez accueilli un petit être qui va changer votre vie pour toujours. Que ce bébé vous apporte autant de bonheur que vous en avez donné autour de vous. La naissance d''un enfant, c''est comme un cadeau du destin, et nous espérons que chaque jour avec ce petit bout sera aussi magique que ce moment. Félicitations, et que votre aventure parentale soit remplie de joie, de découvertes et d''amour.',true),
('birth','tu','long','Guider ce petit être, l''aimer et le voir grandir','Que cette naissance soit le début d''une histoire remplie de bonheur, de défis relevés et de moments inoubliables. Vous avez maintenant la responsabilité de guider ce petit être, de l''aimer et de le voir grandir. Félicitations, et que chaque étape de cette nouvelle vie soit aussi belle que votre amour pour ce bébé.',true),
('birth','tu','long','Une histoire remplie d''amour, de rires et de tendresse','Un bébé, c''est comme une page blanche sur laquelle vous allez écrire une histoire remplie d''amour, de rires et de tendresse. Que ce petit être grandisse dans un environnement aussi aimant que le vôtre. Félicitations pour cette naissance, et que chaque jour avec ce bébé soit une nouvelle aventure à savourer.',true),
('birth','tu','long','Un voyage incroyable','Aujourd''hui, vous avez accueilli un petit miracle dans votre vie, et nous sommes si heureux pour vous. Que ce bébé vous apporte autant de joie que vous en avez donné à ceux qui vous entourent. La naissance d''un enfant, c''est le début d''un voyage incroyable, et nous savons que vous allez rendre chaque instant aussi précieux que ce jour. Félicitations, et que votre vie avec ce petit bout soit aussi belle que vos rêves.',true),
('birth','tu','long','Chaque jour sera une nouvelle raison de sourire','Que cette naissance soit le début d''une aventure remplie de bonheur, de découvertes et d''amour inconditionnel. Vous allez maintenant vivre une nouvelle vie, où chaque jour sera une nouvelle raison de sourire. Félicitations pour ce petit être qui va illuminer votre existence, et que chaque moment avec ce bébé soit aussi magique que ce jour.',true);

-- vous / long (same structure, "vous" form)
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('birth','vous','long','Une vague de bonheur, de tendresse et d''amour infini','Félicitations pour la naissance de votre bébé ! Aujourd''hui, un petit être est entré dans votre vie, et avec lui, une vague de bonheur, de tendresse et d''amour infini. Que ce bébé grandisse entouré de tout ce qu''il y a de plus beau : votre amour, votre patience et votre joie. Que chaque jour avec ce petit bout soit une nouvelle aventure, remplie de découvertes, de rires et de moments précieux. Vous allez être des parents formidables, et nous savons que ce bébé aura une vie aussi merveilleuse que vous la rêvez.',true),
('birth','vous','long','Un nouveau chapitre rempli de promesses','Bienvenue à ce petit miracle qui va transformer vos journées en moments magiques. La naissance d''un enfant, c''est comme un nouveau chapitre qui s''écrit, rempli de promesses, de défis et de joies immenses. Que ce bébé vous apporte autant de bonheur que vous en offrez autour de vous. Félicitations, et que cette nouvelle étape soit aussi belle que votre amour pour ce petit être.',true),
('birth','vous','long','Rendre chaque instant aussi précieux que ce jour','Aujourd''hui, vous avez accueilli un nouveau membre dans votre famille, et nous ne pourrions être plus heureux pour vous. Que ce bébé grandisse dans un environnement rempli d''amour, de sécurité et de rires. La naissance d''un enfant, c''est le début d''une aventure incroyable, et nous savons que vous allez rendre chaque instant aussi précieux que ce jour. Félicitations, et que votre vie avec ce petit bout soit aussi lumineuse que vos sourires aujourd''hui.',true),
('birth','vous','long','Il illumine tout sur son passage','Un enfant, c''est un peu comme un rayon de soleil qui entre dans une vie : il illumine tout sur son passage. Que ce bébé soit pour vous une source de joie, de fierté et d''émerveillement. Félicitations pour cette naissance, et que chaque jour avec ce petit être soit une nouvelle raison de célébrer la vie. Vous allez vivre des moments inoubliables, et nous sommes si heureux de faire partie de cette belle aventure avec vous.',true),
('birth','vous','long','Une histoire d''amour qui durera toute une vie','La naissance de votre bébé, c''est bien plus qu''un événement : c''est le début d''une histoire d''amour qui durera toute une vie. Que ce petit être grandisse entouré de tout ce qu''il y a de plus précieux : votre tendresse, votre soutien et votre amour inconditionnel. Félicitations, et que cette nouvelle vie à trois (ou plus !) soit aussi belle que vos rêves.',true),
('birth','vous','long','Un cadeau du destin','Aujourd''hui, vous avez accueilli un petit être qui va changer votre vie pour toujours. Que ce bébé vous apporte autant de bonheur que vous en avez donné autour de vous. La naissance d''un enfant, c''est comme un cadeau du destin, et nous espérons que chaque jour avec ce petit bout sera aussi magique que ce moment. Félicitations, et que votre aventure parentale soit remplie de joie, de découvertes et d''amour.',true),
('birth','vous','long','Guider ce petit être, l''aimer et le voir grandir','Que cette naissance soit le début d''une histoire remplie de bonheur, de défis relevés et de moments inoubliables. Vous avez maintenant la responsabilité de guider ce petit être, de l''aimer et de le voir grandir. Félicitations, et que chaque étape de cette nouvelle vie soit aussi belle que votre amour pour ce bébé.',true),
('birth','vous','long','Une histoire remplie d''amour, de rires et de tendresse','Un bébé, c''est comme une page blanche sur laquelle vous allez écrire une histoire remplie d''amour, de rires et de tendresse. Que ce petit être grandisse dans un environnement aussi aimant que le vôtre. Félicitations pour cette naissance, et que chaque jour avec ce bébé soit une nouvelle aventure à savourer.',true),
('birth','vous','long','Un voyage incroyable','Aujourd''hui, vous avez accueilli un petit miracle dans votre vie, et nous sommes si heureux pour vous. Que ce bébé vous apporte autant de joie que vous en avez donné à ceux qui vous entourent. La naissance d''un enfant, c''est le début d''un voyage incroyable, et nous savons que vous allez rendre chaque instant aussi précieux que ce jour. Félicitations, et que votre vie avec ce petit bout soit aussi belle que vos rêves.',true),
('birth','vous','long','Chaque jour sera une nouvelle raison de sourire','Que cette naissance soit le début d''une aventure remplie de bonheur, de découvertes et d''amour inconditionnel. Vous allez maintenant vivre une nouvelle vie, où chaque jour sera une nouvelle raison de sourire. Félicitations pour ce petit être qui va illuminer votre existence, et que chaque moment avec ce bébé soit aussi magique que ce jour.',true);

-- ════════════════════════════════════════════════════════
-- BAPTÊME (baptism)
-- ════════════════════════════════════════════════════════

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('baptism','tu','court','Félicitations pour ce beau baptême ! 🌊','Félicitations pour ce beau baptême ! 🌊',true),
('baptism','tu','court','Aussi pur que l''eau du baptême','Que ce jour soit aussi pur que l''eau du baptême.',true),
('baptism','tu','court','Bienvenue dans la communauté, petit ange !','Bienvenue dans la communauté, petit ange !',true),
('baptism','tu','court','Le début d''une vie remplie de bénédictions','Que ce baptême marque le début d''une vie remplie de bénédictions.',true),
('baptism','tu','court','Un jour spécial pour une vie spéciale. Bravo !','Un jour spécial pour une vie spéciale. Bravo !',true),
('baptism','tu','court','Une source de joie et de paix','Que ce baptême soit une source de joie et de paix.',true),
('baptism','tu','court','Bienvenue dans la famille de Dieu !','Bienvenue dans la famille de Dieu !',true),
('baptism','tu','court','Félicitations pour cette belle cérémonie','Félicitations pour cette belle cérémonie.',true),
('baptism','tu','court','Que ce jour reste gravé dans vos mémoires','Que ce jour reste gravé dans vos mémoires.',true),
('baptism','tu','court','L''amour et la foi réunis','Un baptême, c''est l''amour et la foi réunis.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('baptism','vous','court','Félicitations pour ce beau baptême !','Félicitations pour ce beau baptême !',true),
('baptism','vous','court','Aussi pur que l''eau du baptême','Que ce jour soit aussi pur que l''eau du baptême.',true),
('baptism','vous','court','Bienvenue dans la communauté, petit ange','Bienvenue dans la communauté, petit ange.',true),
('baptism','vous','court','Le début d''une vie remplie de bénédictions','Que ce baptême marque le début d''une vie remplie de bénédictions.',true),
('baptism','vous','court','Un jour spécial pour une vie spéciale','Un jour spécial pour une vie spéciale. Félicitations.',true),
('baptism','vous','court','Une source de joie et de paix','Que ce baptême soit une source de joie et de paix.',true),
('baptism','vous','court','Bienvenue dans la famille de Dieu','Bienvenue dans la famille de Dieu.',true),
('baptism','vous','court','Félicitations pour cette belle cérémonie','Félicitations pour cette belle cérémonie.',true),
('baptism','vous','court','Que ce jour reste gravé dans vos mémoires','Que ce jour reste gravé dans vos mémoires.',true),
('baptism','vous','court','L''amour et la foi réunis','Un baptême, c''est l''amour et la foi réunis.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('baptism','tu','moyen','La protection et l''amour de la communauté','Félicitations pour le baptême de ton enfant ! Que ce jour soit rempli de joie, de paix et de bénédictions. Ce petit être a maintenant la protection et l''amour de la communauté autour de lui.',true),
('baptism','tu','moyen','Une promesse d''amour et de soutien pour la vie','Le baptême, c''est bien plus qu''une cérémonie : c''est une promesse d''amour, de foi et de soutien pour la vie. Que ce jour soit aussi beau que ton engagement envers ton enfant.',true),
('baptism','tu','moyen','Le début d''une vie remplie de lumière','Que ce baptême marque le début d''une vie remplie de lumière, de bonheur et de grâce. Félicitations pour cette belle étape !',true),
('baptism','tu','moyen','Une aventure spirituelle riche','Aujourd''hui, ton enfant a reçu une bénédiction spéciale. Que ce baptême soit le début d''une aventure spirituelle aussi riche que ton amour pour lui.',true),
('baptism','tu','moyen','Une graine plantée dans le cœur','Un baptême, c''est comme une graine plantée dans le cœur : elle grandira avec la foi et l''amour. Que ce jour soit aussi précieux que ton enfant.',true),
('baptism','tu','moyen','Une source de force et de réconfort','Que ce baptême soit une source de force et de réconfort pour ton enfant tout au long de sa vie. Félicitations pour cette belle célébration !',true),
('baptism','tu','moyen','Dans la famille de la foi','Bienvenue à ton enfant dans la famille de la foi. Que ce baptême soit le début d''une vie remplie de sens et de bonheur.',true),
('baptism','tu','moyen','Une lumière sur son chemin','Félicitations pour ce moment si important ! Que ce baptême soit une lumière sur le chemin de ton enfant.',true),
('baptism','tu','moyen','Aussi joyeux que l''amour que tu portes','Que ce jour de baptême soit aussi joyeux que l''amour que tu portes à ton enfant. Toutes nos félicitations !',true),
('baptism','tu','moyen','Un engagement envers la vie et la foi','Le baptême, c''est un engagement envers la vie, la foi et l''amour. Que ce jour soit aussi beau que ton cœur de parent.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('baptism','vous','moyen','La protection et l''amour de la communauté','Félicitations pour le baptême de votre enfant ! Que ce jour soit rempli de joie, de paix et de bénédictions. Ce petit être a maintenant la protection et l''amour de la communauté autour de lui.',true),
('baptism','vous','moyen','Une promesse d''amour et de soutien pour la vie','Le baptême, c''est bien plus qu''une cérémonie : c''est une promesse d''amour, de foi et de soutien pour la vie. Que ce jour soit aussi beau que votre engagement envers votre enfant.',true),
('baptism','vous','moyen','Le début d''une vie remplie de lumière','Que ce baptême marque le début d''une vie remplie de lumière, de bonheur et de grâce. Félicitations pour cette belle étape !',true),
('baptism','vous','moyen','Une aventure spirituelle riche','Aujourd''hui, votre enfant a reçu une bénédiction spéciale. Que ce baptême soit le début d''une aventure spirituelle aussi riche que votre amour pour lui.',true),
('baptism','vous','moyen','Une graine plantée dans le cœur','Un baptême, c''est comme une graine plantée dans le cœur : elle grandira avec la foi et l''amour. Que ce jour soit aussi précieux que votre enfant.',true),
('baptism','vous','moyen','Une source de force et de réconfort','Que ce baptême soit une source de force et de réconfort pour votre enfant tout au long de sa vie. Félicitations pour cette belle célébration !',true),
('baptism','vous','moyen','Dans la famille de la foi','Bienvenue à votre enfant dans la famille de la foi. Que ce baptême soit le début d''une vie remplie de sens et de bonheur.',true),
('baptism','vous','moyen','Une lumière sur son chemin','Félicitations pour ce moment si important ! Que ce baptême soit une lumière sur le chemin de votre enfant.',true),
('baptism','vous','moyen','Aussi joyeux que l''amour que vous portez','Que ce jour de baptême soit aussi joyeux que l''amour que vous portez à votre enfant. Toutes nos félicitations !',true),
('baptism','vous','moyen','Un engagement envers la vie et la foi','Le baptême, c''est un engagement envers la vie, la foi et l''amour. Que ce jour soit aussi beau que votre cœur de parent.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('baptism','tu','long','Une place dans une communauté d''amour et de foi','Félicitations pour le baptême de ton enfant ! Aujourd''hui, tu as offert à ce petit être bien plus qu''un nom : tu lui as donné une place dans une communauté d''amour et de foi. Que ce jour soit le début d''une vie remplie de bénédictions, de joie et de paix. Le baptême, c''est comme une lumière qui éclaire le chemin de ton enfant, et nous savons que tu seras toujours là pour le guider. Que chaque étape de sa vie soit aussi belle que ce moment, et que ton amour pour lui soit aussi infini que ta foi.',true),
('baptism','tu','long','Un chemin de foi, d''espoir et d''amour','Le baptême de ton enfant, c''est une journée remplie de sens et d''émotion. Aujourd''hui, tu as fait le choix de l''accompagner sur un chemin de foi, d''espoir et d''amour. Que ce jour reste gravé dans ton cœur comme le début d''une aventure spirituelle aussi riche que ton engagement de parent. Félicitations, et que chaque moment de la vie de ton enfant soit aussi précieux que cette cérémonie.',true),
('baptism','tu','long','Grandir entouré d''amour, de soutien et de lumière','Aujourd''hui, ton enfant a reçu une bénédiction qui l''accompagnera toute sa vie. Le baptême, c''est comme une promesse : celle de grandir entouré d''amour, de soutien et de lumière. Que ce jour soit aussi joyeux que ton sourire, aussi pur que ton cœur, et aussi inspirant que ton amour pour ton enfant. Félicitations pour cette belle étape, et que la vie de ton petit bout soit aussi merveilleuse que tu la rêves.',true),
('baptism','tu','long','Un acte d''amour et de foi','Un baptême, c''est bien plus qu''une tradition : c''est un acte d''amour et de foi qui marque le début d''une vie remplie de sens. Que ton enfant grandisse avec la certitude d''être aimé, protégé et guidé. Félicitations pour ce moment si spécial, et que chaque jour de sa vie soit une nouvelle raison de célébrer la beauté de l''existence.',true),
('baptism','tu','long','Elle grandira avec la foi, l''espoir et l''amour','Aujourd''hui, tu as partagé un moment sacré avec ton enfant, et nous sommes si heureux pour toi. Le baptême, c''est comme une graine que tu as plantée dans son cœur : elle grandira avec la foi, l''espoir et l''amour que tu lui donneras. Que ce jour soit aussi lumineux que ton amour pour lui, et que sa vie soit aussi belle que tes rêves.',true),
('baptism','tu','long','Un chemin de lumière','Félicitations pour le baptême de ton enfant ! Que ce jour soit le début d''une aventure remplie de grâce, de joie et de découvertes spirituelles. Tu as maintenant la mission de guider ce petit être sur un chemin de lumière, et nous savons que tu seras à la hauteur. Que chaque instant de sa vie soit aussi précieux que ce moment, et que ton amour pour lui soit aussi fort que ta foi.',true),
('baptism','tu','long','Dans un monde rempli de sens','Le baptême, c''est un engagement envers la vie, envers l''amour et envers la foi. Aujourd''hui, tu as montré à ton enfant à quel point il compte pour toi, et à quel point tu veux qu''il grandisse dans un monde rempli de sens. Que ce jour soit aussi beau que ton cœur, et que la vie de ton enfant soit aussi riche que ton amour pour lui.',true),
('baptism','tu','long','Faire partie d''une communauté aimante','Que ce baptême soit une source de force et d''inspiration pour ton enfant tout au long de sa vie. Aujourd''hui, tu lui as offert un cadeau précieux : celui de faire partie d''une communauté aimante et bienveillante. Félicitations pour cette belle cérémonie, et que chaque étape de sa vie soit aussi lumineuse que ce jour.',true),
('baptism','tu','long','Il n''est jamais seul','Aujourd''hui, ton enfant a reçu une bénédiction qui l''accompagnera à jamais. Le baptême, c''est comme un phare dans la nuit : il éclaire le chemin de ton enfant et lui rappelle qu''il n''est jamais seul. Que ce jour soit aussi joyeux que ton amour pour lui, et que sa vie soit aussi belle que tes espérances.',true),
('baptism','tu','long','Une célébration de l''amour, de la foi et de l''espoir','Félicitations pour ce moment si important dans la vie de ton enfant ! Le baptême, c''est une célébration de l''amour, de la foi et de l''espoir. Que ce jour reste gravé dans ton cœur comme le début d''une aventure aussi belle que ton engagement de parent. Que chaque instant de la vie de ton enfant soit une nouvelle raison de sourire, et que ton amour pour lui soit aussi infini que ta joie aujourd''hui.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('baptism','vous','long','Une place dans une communauté d''amour et de foi','Félicitations pour le baptême de votre enfant ! Aujourd''hui, vous avez offert à ce petit être bien plus qu''un nom : vous lui avez donné une place dans une communauté d''amour et de foi. Que ce jour soit le début d''une vie remplie de bénédictions, de joie et de paix. Le baptême, c''est comme une lumière qui éclaire le chemin de votre enfant, et nous savons que vous serez toujours là pour le guider. Que chaque étape de sa vie soit aussi belle que ce moment, et que votre amour pour lui soit aussi infini que votre foi.',true),
('baptism','vous','long','Un chemin de foi, d''espoir et d''amour','Le baptême de votre enfant, c''est une journée remplie de sens et d''émotion. Aujourd''hui, vous avez fait le choix de l''accompagner sur un chemin de foi, d''espoir et d''amour. Que ce jour reste gravé dans votre cœur comme le début d''une aventure spirituelle aussi riche que votre engagement de parent. Félicitations, et que chaque moment de la vie de votre enfant soit aussi précieux que cette cérémonie.',true),
('baptism','vous','long','Grandir entouré d''amour, de soutien et de lumière','Aujourd''hui, votre enfant a reçu une bénédiction qui l''accompagnera toute sa vie. Le baptême, c''est comme une promesse : celle de grandir entouré d''amour, de soutien et de lumière. Que ce jour soit aussi joyeux que votre sourire, aussi pur que votre cœur, et aussi inspirant que votre amour pour votre enfant. Félicitations pour cette belle étape, et que la vie de votre petit bout soit aussi merveilleuse que vous la rêvez.',true),
('baptism','vous','long','Un acte d''amour et de foi','Un baptême, c''est bien plus qu''une tradition : c''est un acte d''amour et de foi qui marque le début d''une vie remplie de sens. Que votre enfant grandisse avec la certitude d''être aimé, protégé et guidé. Félicitations pour ce moment si spécial, et que chaque jour de sa vie soit une nouvelle raison de célébrer la beauté de l''existence.',true),
('baptism','vous','long','Elle grandira avec la foi, l''espoir et l''amour','Aujourd''hui, vous avez partagé un moment sacré avec votre enfant, et nous sommes si heureux pour vous. Le baptême, c''est comme une graine que vous avez plantée dans son cœur : elle grandira avec la foi, l''espoir et l''amour que vous lui donnerez. Que ce jour soit aussi lumineux que votre amour pour lui, et que sa vie soit aussi belle que vos rêves.',true),
('baptism','vous','long','Un chemin de lumière','Félicitations pour le baptême de votre enfant ! Que ce jour soit le début d''une aventure remplie de grâce, de joie et de découvertes spirituelles. Vous avez maintenant la mission de guider ce petit être sur un chemin de lumière, et nous savons que vous serez à la hauteur. Que chaque instant de sa vie soit aussi précieux que ce moment, et que votre amour pour lui soit aussi fort que votre foi.',true),
('baptism','vous','long','Dans un monde rempli de sens','Le baptême, c''est un engagement envers la vie, envers l''amour et envers la foi. Aujourd''hui, vous avez montré à votre enfant à quel point il compte pour vous, et à quel point vous voulez qu''il grandisse dans un monde rempli de sens. Que ce jour soit aussi beau que votre cœur, et que la vie de votre enfant soit aussi riche que votre amour pour lui.',true),
('baptism','vous','long','Faire partie d''une communauté aimante','Que ce baptême soit une source de force et d''inspiration pour votre enfant tout au long de sa vie. Aujourd''hui, vous lui avez offert un cadeau précieux : celui de faire partie d''une communauté aimante et bienveillante. Félicitations pour cette belle cérémonie, et que chaque étape de sa vie soit aussi lumineuse que ce jour.',true),
('baptism','vous','long','Il n''est jamais seul','Aujourd''hui, votre enfant a reçu une bénédiction qui l''accompagnera à jamais. Le baptême, c''est comme un phare dans la nuit : il éclaire le chemin de votre enfant et lui rappelle qu''il n''est jamais seul. Que ce jour soit aussi joyeux que votre amour pour lui, et que sa vie soit aussi belle que vos espérances.',true),
('baptism','vous','long','Une célébration de l''amour, de la foi et de l''espoir','Félicitations pour ce moment si important dans la vie de votre enfant ! Le baptême, c''est une célébration de l''amour, de la foi et de l''espoir. Que ce jour reste gravé dans votre cœur comme le début d''une aventure aussi belle que votre engagement de parent. Que chaque instant de la vie de votre enfant soit une nouvelle raison de sourire, et que votre amour pour lui soit aussi infini que votre joie aujourd''hui.',true);
