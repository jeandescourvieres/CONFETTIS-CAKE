-- Migration 055 : Remerciements + Nouvel An — 120 messages haute qualité
-- Remplace les templates de base de la migration 048

DELETE FROM message_templates WHERE occasion IN ('thanks','newyear') AND is_system = true;

-- ============================================================
-- REMERCIEMENTS (thanks)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('thanks','tu','court','Merci pour tout ! 🙏','Merci pour tout ! 🙏',true),
('thanks','tu','court','Ton aide a été précieuse','Ton aide a été précieuse. Merci !',true),
('thanks','tu','court','Sans toi, ce n''aurait pas été possible','Sans toi, ce n''aurait pas été possible. Merci !',true),
('thanks','tu','court','Un grand merci pour ton soutien','Un grand merci pour ton soutien.',true),
('thanks','tu','court','Merci pour ta générosité et ton temps','Merci pour ta générosité et ton temps.',true),
('thanks','tu','court','Ton aide a fait toute la différence','Ton aide a fait toute la différence. Merci !',true),
('thanks','tu','court','Merci pour ta présence et ton écoute','Merci pour ta présence et ton écoute.',true),
('thanks','tu','court','Un immense merci pour tout ce que tu as fait','Un immense merci pour tout ce que tu as fait.',true),
('thanks','tu','court','Merci d''être là, toujours','Merci d''être là, toujours.',true),
('thanks','tu','court','Ton soutien a été inestimable','Ton soutien a été inestimable. Merci !',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('thanks','tu','moyen','Inestimable','Merci pour tout ce que tu as fait pour moi. Ton aide, ton soutien et ta générosité ont été inestimables. Sans toi, tout aurait été bien plus difficile.',true),
('thanks','tu','moyen','Merci pour ta présence à mes côtés','Un grand merci pour ta présence à mes côtés. Que ce soit par tes conseils, ton écoute ou simplement ton amitié, tu as rendu les choses bien plus faciles.',true),
('thanks','tu','moyen','Que la vie te rende tout le bien','Je tenais à te dire à quel point ton soutien a compté pour moi. Merci pour tout, et que la vie te rende tout le bien que tu m''as apporté.',true),
('thanks','tu','moyen','Tu as été là dans les moments importants','Merci pour ton aide précieuse. Tu as été là dans les moments importants, et je ne l''oublierai jamais.',true),
('thanks','tu','moyen','Un vrai rayon de soleil','Ton soutien a été un vrai rayon de soleil dans ma vie. Merci pour tout ce que tu as fait, et pour tout ce que tu es.',true),
('thanks','tu','moyen','Je ne sais pas comment te remercier assez','Je ne sais pas comment te remercier assez pour tout ce que tu as fait. Ton aide a été essentielle, et je t''en suis profondément reconnaissant(e).',true),
('thanks','tu','moyen','Un vrai pilier','Merci pour ta générosité, ton temps et ton énergie. Tu as été un vrai pilier pour moi.',true),
('thanks','tu','moyen','Sans toi, je n''y serais pas arrivé','Un immense merci pour tout ce que tu as accompli pour moi. Sans toi, je n''y serais pas arrivé.',true),
('thanks','tu','moyen','Dans les bons comme dans les mauvais moments','Merci d''avoir été là, dans les bons comme dans les mauvais moments. Ta présence a été un vrai réconfort.',true),
('thanks','tu','moyen','Tu comptes énormément pour moi','Je voulais simplement te dire merci. Merci pour ton aide, ton soutien et ton amitié. Tu comptes énormément pour moi.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('thanks','tu','long','Tu as fait toute la différence','Je ne sais même pas par où commencer pour te remercier. Tu as été là pour moi dans les moments les plus importants, et ton soutien a fait toute la différence. Que ce soit par tes conseils, ton écoute ou simplement ta présence, tu as rendu les choses bien plus faciles à traverser. Merci pour tout ce que tu as fait, et pour tout ce que tu es. Sans toi, je n''aurais pas pu y arriver, et je t''en suis éternellement reconnaissant(e). Que la vie te rende tout le bien que tu m''as apporté, et que chaque jour t''apporte autant de bonheur que tu m''en as donné.',true),
('thanks','tu','long','Tu as été un vrai pilier','Aujourd''hui, je veux prendre un moment pour te dire à quel point ton aide a compté pour moi. Tu as été un vrai pilier, une source de réconfort et d''inspiration. Merci pour ta générosité, ton temps et ton énergie. Tu as été là dans les bons comme dans les mauvais moments, et je ne sais pas comment je pourrais te rendre tout ce que tu as fait pour moi. Que ce message soit une petite preuve de ma gratitude, et que tu saches à quel point tu comptes pour moi.',true),
('thanks','tu','long','Les mots ne suffisent pas','Parfois, les mots ne suffisent pas pour exprimer tout ce qu''on ressent. Alors je vais essayer : merci. Merci pour ton aide, ton soutien et ton amitié. Tu as été là quand j''en avais le plus besoin, et tu as rendu les choses possibles là où je pensais qu''elles ne l''étaient pas. Que ce message soit un petit pas vers te montrer à quel point je suis reconnaissant(e) pour tout ce que tu as fait. Que la vie te sourie comme tu l''as fait pour moi.',true),
('thanks','tu','long','J''ai de la chance de t''avoir dans ma vie','Je repense souvent à tous les moments où tu as été là pour moi, et je me dis à quel point j''ai de la chance de t''avoir dans ma vie. Ton soutien a été inestimable, et je ne sais pas comment je pourrais te remercier à la hauteur de ce que tu as fait. Merci pour ta présence, ton écoute et ta générosité. Que chaque jour t''apporte autant de bonheur que tu m''en as donné.',true),
('thanks','tu','long','Tu marques notre vie de manière indélébile','Il y a des personnes qui marquent notre vie de manière indélébile, et toi, tu en fais partie. Ton aide a été précieuse, ton soutien a été essentiel, et ta présence a été un vrai réconfort. Merci pour tout ce que tu as fait, et pour tout ce que tu es. Que ce message soit une petite preuve de ma gratitude, et que tu saches à quel point tu es important(e) pour moi.',true),
('thanks','tu','long','Tu m''as soutenu, conseillé, encouragé','Je ne sais pas comment exprimer toute ma reconnaissance pour tout ce que tu as fait pour moi. Tu as été là dans les moments difficiles, tu m''as soutenu, conseillé et encouragé. Sans toi, je n''aurais pas pu traverser ces épreuves. Merci pour ton aide, ta générosité et ton amitié. Que la vie te rende tout le bien que tu m''as apporté.',true),
('thanks','tu','long','Tu as été un vrai rayon de soleil','Aujourd''hui, je veux te dire merci. Merci pour ton soutien indéfectible, pour ta présence rassurante et pour ton aide précieuse. Tu as été un vrai rayon de soleil dans ma vie, et je ne sais pas comment je pourrais te remercier assez. Que ce message soit une petite preuve de ma gratitude, et que tu saches à quel point je suis reconnaissant(e) pour tout ce que tu as fait.',true),
('thanks','tu','long','Tu as rendu les choses possibles','Parfois, on ne réalise pas à quel point une personne compte pour nous jusqu''à ce qu''on prenne le temps de réfléchir. Et aujourd''hui, je réalise à quel point tu as été important(e) pour moi. Merci pour ton aide, ton soutien et ton amitié. Tu as rendu les choses possibles là où je pensais qu''elles ne l''étaient pas, et je t''en suis profondément reconnaissant(e).',true),
('thanks','tu','long','Ton aide a été essentielle','Je ne sais pas comment te remercier pour tout ce que tu as fait pour moi. Ton aide a été essentielle, ton soutien a été inestimable, et ta présence a été un vrai réconfort. Merci pour tout, et que la vie te rende tout le bien que tu m''as apporté. Que chaque jour t''apporte autant de bonheur que tu m''en as donné.',true),
('thanks','tu','long','Tu comptes pour moi','Aujourd''hui, je veux simplement te dire merci. Merci pour ton aide, ton soutien et ton amitié. Tu as été là dans les moments importants, et je ne l''oublierai jamais. Que ce message soit une petite preuve de ma gratitude, et que tu saches à quel point tu comptes pour moi. Que la vie te sourie comme tu l''as fait pour moi.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('thanks','vous','court','Merci pour tout !','Merci pour tout !',true),
('thanks','vous','court','Votre aide a été précieuse','Votre aide a été précieuse. Merci !',true),
('thanks','vous','court','Sans vous, ce n''aurait pas été possible','Sans vous, ce n''aurait pas été possible. Merci !',true),
('thanks','vous','court','Un grand merci pour votre soutien','Un grand merci pour votre soutien.',true),
('thanks','vous','court','Merci pour votre générosité et votre temps','Merci pour votre générosité et votre temps.',true),
('thanks','vous','court','Votre aide a fait toute la différence','Votre aide a fait toute la différence. Merci !',true),
('thanks','vous','court','Merci pour votre présence et votre écoute','Merci pour votre présence et votre écoute.',true),
('thanks','vous','court','Un immense merci pour tout ce que vous avez fait','Un immense merci pour tout ce que vous avez fait.',true),
('thanks','vous','court','Merci d''être là, toujours','Merci d''être là, toujours.',true),
('thanks','vous','court','Votre soutien a été inestimable','Votre soutien a été inestimable. Merci !',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('thanks','vous','moyen','Inestimable','Merci pour tout ce que vous avez fait pour moi. Votre aide, votre soutien et votre générosité ont été inestimables. Sans vous, tout aurait été bien plus difficile.',true),
('thanks','vous','moyen','Merci pour votre présence à mes côtés','Un grand merci pour votre présence à mes côtés. Que ce soit par vos conseils, votre écoute ou simplement votre bienveillance, vous avez rendu les choses bien plus faciles.',true),
('thanks','vous','moyen','Que la vie vous rende tout le bien','Je tenais à vous dire à quel point votre soutien a compté pour moi. Merci pour tout, et que la vie vous rende tout le bien que vous m''avez apporté.',true),
('thanks','vous','moyen','Vous avez été là dans les moments importants','Merci pour votre aide précieuse. Vous avez été là dans les moments importants, et je ne l''oublierai jamais.',true),
('thanks','vous','moyen','Un vrai rayon de soleil','Votre soutien a été un vrai rayon de soleil dans ma vie. Merci pour tout ce que vous avez fait, et pour tout ce que vous êtes.',true),
('thanks','vous','moyen','Je ne sais pas comment vous remercier assez','Je ne sais pas comment vous remercier assez pour tout ce que vous avez fait. Votre aide a été essentielle, et je vous en suis profondément reconnaissant(e).',true),
('thanks','vous','moyen','Un vrai pilier','Merci pour votre générosité, votre temps et votre énergie. Vous avez été un vrai pilier pour moi.',true),
('thanks','vous','moyen','Sans vous, je n''y serais pas arrivé','Un immense merci pour tout ce que vous avez accompli pour moi. Sans vous, je n''y serais pas arrivé.',true),
('thanks','vous','moyen','Dans les bons comme dans les mauvais moments','Merci d''avoir été là, dans les bons comme dans les mauvais moments. Votre présence a été un vrai réconfort.',true),
('thanks','vous','moyen','Vous comptez énormément pour moi','Je voulais simplement vous dire merci. Merci pour votre aide, votre soutien et votre bienveillance. Vous comptez énormément pour moi.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('thanks','vous','long','Vous avez fait toute la différence','Je ne sais même pas par où commencer pour vous remercier. Vous avez été là pour moi dans les moments les plus importants, et votre soutien a fait toute la différence. Que ce soit par vos conseils, votre écoute ou simplement votre présence, vous avez rendu les choses bien plus faciles à traverser. Merci pour tout ce que vous avez fait, et pour tout ce que vous êtes. Sans vous, je n''aurais pas pu y arriver, et je vous en suis éternellement reconnaissant(e). Que la vie vous rende tout le bien que vous m''avez apporté, et que chaque jour vous apporte autant de bonheur que vous m''en avez donné.',true),
('thanks','vous','long','Vous avez été un vrai pilier','Aujourd''hui, je veux prendre un moment pour vous dire à quel point votre aide a compté pour moi. Vous avez été un vrai pilier, une source de réconfort et d''inspiration. Merci pour votre générosité, votre temps et votre énergie. Vous avez été là dans les bons comme dans les mauvais moments, et je ne sais pas comment je pourrais vous rendre tout ce que vous avez fait pour moi. Que ce message soit une petite preuve de ma gratitude, et que vous sachiez à quel point vous comptez pour moi.',true),
('thanks','vous','long','Les mots ne suffisent pas','Parfois, les mots ne suffisent pas pour exprimer tout ce qu''on ressent. Alors je vais essayer : merci. Merci pour votre aide, votre soutien et votre bienveillance. Vous avez été là quand j''en avais le plus besoin, et vous avez rendu les choses possibles là où je pensais qu''elles ne l''étaient pas. Que ce message soit un petit pas vers vous montrer à quel point je suis reconnaissant(e) pour tout ce que vous avez fait. Que la vie vous sourie comme vous l''avez fait pour moi.',true),
('thanks','vous','long','J''ai de la chance de vous avoir dans ma vie','Je repense souvent à tous les moments où vous avez été là pour moi, et je me dis à quel point j''ai de la chance de vous avoir dans ma vie. Votre soutien a été inestimable, et je ne sais pas comment je pourrais vous remercier à la hauteur de ce que vous avez fait. Merci pour votre présence, votre écoute et votre générosité. Que chaque jour vous apporte autant de bonheur que vous m''en avez donné.',true),
('thanks','vous','long','Vous marquez notre vie de manière indélébile','Il y a des personnes qui marquent notre vie de manière indélébile, et vous, vous en faites partie. Votre aide a été précieuse, votre soutien a été essentiel, et votre présence a été un vrai réconfort. Merci pour tout ce que vous avez fait, et pour tout ce que vous êtes. Que ce message soit une petite preuve de ma gratitude, et que vous sachiez à quel point vous êtes important(e) pour moi.',true),
('thanks','vous','long','Vous m''avez soutenu, conseillé, encouragé','Je ne sais pas comment exprimer toute ma reconnaissance pour tout ce que vous avez fait pour moi. Vous avez été là dans les moments difficiles, vous m''avez soutenu, conseillé et encouragé. Sans vous, je n''aurais pas pu traverser ces épreuves. Merci pour votre aide, votre générosité et votre bienveillance. Que la vie vous rende tout le bien que vous m''avez apporté.',true),
('thanks','vous','long','Vous avez été un vrai rayon de soleil','Aujourd''hui, je veux vous dire merci. Merci pour votre soutien indéfectible, pour votre présence rassurante et pour votre aide précieuse. Vous avez été un vrai rayon de soleil dans ma vie, et je ne sais pas comment je pourrais vous remercier assez. Que ce message soit une petite preuve de ma gratitude, et que vous sachiez à quel point je suis reconnaissant(e) pour tout ce que vous avez fait.',true),
('thanks','vous','long','Vous avez rendu les choses possibles','Parfois, on ne réalise pas à quel point une personne compte pour nous jusqu''à ce qu''on prenne le temps de réfléchir. Et aujourd''hui, je réalise à quel point vous avez été important(e) pour moi. Merci pour votre aide, votre soutien et votre bienveillance. Vous avez rendu les choses possibles là où je pensais qu''elles ne l''étaient pas, et je vous en suis profondément reconnaissant(e).',true),
('thanks','vous','long','Votre aide a été essentielle','Je ne sais pas comment vous remercier pour tout ce que vous avez fait pour moi. Votre aide a été essentielle, votre soutien a été inestimable, et votre présence a été un vrai réconfort. Merci pour tout, et que la vie vous rende tout le bien que vous m''avez apporté. Que chaque jour vous apporte autant de bonheur que vous m''en avez donné.',true),
('thanks','vous','long','Vous comptez pour moi','Aujourd''hui, je veux simplement vous dire merci. Merci pour votre aide, votre soutien et votre bienveillance. Vous avez été là dans les moments importants, et je ne l''oublierai jamais. Que ce message soit une petite preuve de ma gratitude, et que vous sachiez à quel point vous comptez pour moi. Que la vie vous sourie comme vous l''avez fait pour moi.',true);

-- ============================================================
-- NOUVEL AN (newyear)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('newyear','tu','court','Bonne année ! 🎆','Bonne année ! 🎆',true),
('newyear','tu','court','Aussi belle que toi !','Que cette année soit aussi belle que toi !',true),
('newyear','tu','court','Meilleurs vœux pour cette nouvelle année !','Meilleurs vœux pour cette nouvelle année !',true),
('newyear','tu','court','Que 2026 t''apporte bonheur et réussite !','Que 2026 t''apporte bonheur et réussite !',true),
('newyear','tu','court','Une nouvelle année, de nouveaux rêves','Une nouvelle année, de nouveaux rêves. Bonne année !',true),
('newyear','tu','court','Remplie de joie et de succès','Que cette année soit remplie de joie et de succès.',true),
('newyear','tu','court','Que tous tes vœux se réalisent !','Bonne année, et que tous tes vœux se réalisent !',true),
('newyear','tu','court','Que 2026 soit ton année !','Que 2026 soit ton année !',true),
('newyear','tu','court','Que la santé t''accompagne !','Bonne année, et que la santé t''accompagne !',true),
('newyear','tu','court','Aussi lumineuse que ton sourire !','Que cette année soit aussi lumineuse que ton sourire !',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('newyear','tu','moyen','Bonheur, santé et réussite','Bonne année ! Que 2026 soit une année remplie de bonheur, de santé et de réussite. Que chaque jour t''apporte son lot de joie et de surprises agréables.',true),
('newyear','tu','moyen','Aussi lumineuse que ton sourire','Meilleurs vœux pour cette nouvelle année ! Que cette année soit aussi belle que tes rêves et aussi lumineuse que ton sourire.',true),
('newyear','tu','moyen','L''année où tout devient possible','Une nouvelle année commence, et avec elle, de nouvelles opportunités. Que 2026 soit l''année où tout devient possible pour toi.',true),
('newyear','tu','moyen','Moments inoubliables, rires et succès','Que cette année soit remplie de moments inoubliables, de rires et de succès. Bonne année, et que chaque jour soit une nouvelle aventure !',true),
('newyear','tu','moyen','Amour, santé, bonheur et réussite','Bonne année ! Que 2026 t''apporte tout ce que tu désires : amour, santé, bonheur et réussite.',true),
('newyear','tu','moyen','Aussi riche en émotions','Que cette nouvelle année soit aussi riche en émotions que l''année précédente l''a été. Bonne année, et que chaque instant soit précieux.',true),
('newyear','tu','moyen','Celle de tous les possibles','Meilleurs vœux pour 2026 ! Que cette année soit celle de tous les possibles, où chaque rêve devient réalité.',true),
('newyear','tu','moyen','Aussi joyeuse que tes rires','Bonne année ! Que cette année soit aussi joyeuse que tes rires et aussi douce que ton cœur.',true),
('newyear','tu','moyen','Réussite, bonheur et paix','Que 2026 soit une année de réussite, de bonheur et de paix. Bonne année, et que chaque jour t''apporte son lot de bonheur.',true),
('newyear','tu','moyen','Aussi lumineuse que tes espérances','Bonne année ! Que cette nouvelle année soit aussi belle que ton âme et aussi lumineuse que tes espérances.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('newyear','tu','long','Une nouvelle page se tourne','Bonne année 2026 ! Aujourd''hui, une nouvelle page se tourne, et avec elle, de nouvelles opportunités, de nouveaux défis et de nouveaux rêves à réaliser. Que cette année soit aussi belle que ton cœur, aussi lumineuse que ton sourire, et aussi riche que tes espérances. Que chaque jour t''apporte son lot de bonheur, de santé et de réussite. Que 2026 soit l''année où tout devient possible, où chaque rêve se réalise et où chaque instant est une nouvelle raison de sourire. Je te souhaite une année aussi exceptionnelle que toi, remplie de joie, d''amour et de paix.',true),
('newyear','tu','long','Une année de renouveau','Meilleurs vœux pour cette nouvelle année ! Que 2026 soit une année de renouveau, de croissance et de bonheur. Que chaque jour soit une nouvelle aventure, chaque défi une nouvelle opportunité, et chaque moment un nouveau souvenir à chérir. Que cette année t''apporte tout ce que tu désires : amour, santé, réussite et sérénité. Que ton cœur soit aussi léger que tes rires, et que ton âme soit aussi lumineuse que tes rêves.',true),
('newyear','tu','long','L''espoir d''un avenir meilleur','Une nouvelle année commence, et avec elle, l''espoir d''un avenir meilleur. Que 2026 soit pour toi une année de réussite, de joie et de paix. Que chaque jour soit rempli de moments précieux, de rires partagés et de succès mérités. Que cette année soit aussi belle que ton âme, aussi douce que ton cœur, et aussi radieuse que ton sourire. Bonne année, et que chaque instant soit une nouvelle raison de célébrer la vie.',true),
('newyear','tu','long','Celle de tous les possibles','Bonne année 2026 ! Que cette année soit celle de tous les possibles, où chaque rêve devient réalité et chaque défi est relevé avec brio. Que ton cœur soit aussi ouvert que tes bras, et que ton âme soit aussi pure que tes intentions. Que 2026 t''apporte tout ce que tu mérites : bonheur, santé, amour et réussite. Que chaque jour soit une nouvelle aventure à savourer, et que chaque moment soit un nouveau souvenir à chérir.',true),
('newyear','tu','long','Aussi lumineuse que tes rêves','Que cette nouvelle année soit aussi belle que tes espérances et aussi lumineuse que tes rêves. Que 2026 t''apporte tout ce que tu désires : joie, paix, amour et réussite. Que chaque jour soit une nouvelle opportunité de grandir, d''apprendre et de sourire. Bonne année, et que cette année soit aussi exceptionnelle que toi.',true),
('newyear','tu','long','Moments inoubliables','Bonne année ! Que 2026 soit une année de renouveau, de croissance et de bonheur. Que chaque jour soit rempli de moments inoubliables, de rires et de succès. Que cette année soit aussi riche en émotions que l''année précédente l''a été, et que chaque instant soit une nouvelle raison de célébrer la vie. Que ton cœur soit aussi léger que tes rires, et que ton âme soit aussi pure que tes intentions.',true),
('newyear','tu','long','Où chaque rêve se réalise','Meilleurs vœux pour 2026 ! Que cette année soit celle où tout devient possible. Que chaque rêve se réalise, chaque défi soit relevé, et chaque moment soit une nouvelle aventure à vivre. Que 2026 t''apporte tout ce que tu mérites : bonheur, santé, amour et réussite. Que chaque jour soit aussi lumineux que ton sourire, et que chaque instant soit aussi précieux que ton cœur.',true),
('newyear','tu','long','Aussi radieuse que ton âme','Bonne année 2026 ! Que cette année soit aussi joyeuse que tes rires, aussi douce que ton cœur, et aussi radieuse que ton âme. Que chaque jour t''apporte son lot de bonheur, de paix et de réussite. Que 2026 soit l''année où tout devient possible, où chaque rêve se réalise et où chaque instant est une nouvelle raison de sourire.',true),
('newyear','tu','long','Des moments précieux et des succès mérités','Que cette nouvelle année soit remplie de moments inoubliables, de rires partagés et de succès mérités. Que 2026 t''apporte tout ce que tu désires : amour, santé, bonheur et sérénité. Que chaque jour soit une nouvelle aventure à savourer, et que chaque moment soit un nouveau souvenir à chérir. Bonne année, et que cette année soit aussi exceptionnelle que toi.',true),
('newyear','tu','long','Aussi lumineux que ton sourire','Bonne année 2026 ! Que cette année soit celle de la réalisation de tous tes rêves. Que chaque jour soit aussi lumineux que ton sourire, aussi doux que ton cœur, et aussi joyeux que tes rires. Que 2026 t''apporte tout ce que tu mérites : bonheur, santé, amour et réussite. Que chaque instant soit une nouvelle raison de célébrer la vie, et que chaque défi soit une nouvelle opportunité de grandir.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('newyear','vous','court','Bonne année !','Bonne année !',true),
('newyear','vous','court','Aussi belle que vous !','Que cette année soit aussi belle que vous !',true),
('newyear','vous','court','Meilleurs vœux pour cette nouvelle année !','Meilleurs vœux pour cette nouvelle année !',true),
('newyear','vous','court','Que 2026 vous apporte bonheur et réussite !','Que 2026 vous apporte bonheur et réussite !',true),
('newyear','vous','court','Une nouvelle année, de nouveaux rêves','Une nouvelle année, de nouveaux rêves. Bonne année !',true),
('newyear','vous','court','Remplie de joie et de succès','Que cette année soit remplie de joie et de succès.',true),
('newyear','vous','court','Que tous vos vœux se réalisent !','Bonne année, et que tous vos vœux se réalisent !',true),
('newyear','vous','court','Que 2026 soit votre année !','Que 2026 soit votre année !',true),
('newyear','vous','court','Que la santé vous accompagne !','Bonne année, et que la santé vous accompagne !',true),
('newyear','vous','court','Aussi lumineuse que votre sourire !','Que cette année soit aussi lumineuse que votre sourire !',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('newyear','vous','moyen','Bonheur, santé et réussite','Bonne année ! Que 2026 soit une année remplie de bonheur, de santé et de réussite. Que chaque jour vous apporte son lot de joie et de surprises agréables.',true),
('newyear','vous','moyen','Aussi lumineuse que votre sourire','Meilleurs vœux pour cette nouvelle année ! Que cette année soit aussi belle que vos rêves et aussi lumineuse que votre sourire.',true),
('newyear','vous','moyen','L''année où tout devient possible','Une nouvelle année commence, et avec elle, de nouvelles opportunités. Que 2026 soit l''année où tout devient possible pour vous.',true),
('newyear','vous','moyen','Moments inoubliables, rires et succès','Que cette année soit remplie de moments inoubliables, de rires et de succès. Bonne année, et que chaque jour soit une nouvelle aventure !',true),
('newyear','vous','moyen','Amour, santé, bonheur et réussite','Bonne année ! Que 2026 vous apporte tout ce que vous désirez : amour, santé, bonheur et réussite.',true),
('newyear','vous','moyen','Aussi riche en émotions','Que cette nouvelle année soit aussi riche en émotions que l''année précédente l''a été. Bonne année, et que chaque instant soit précieux.',true),
('newyear','vous','moyen','Celle de tous les possibles','Meilleurs vœux pour 2026 ! Que cette année soit celle de tous les possibles, où chaque rêve devient réalité.',true),
('newyear','vous','moyen','Aussi joyeuse que vos rires','Bonne année ! Que cette année soit aussi joyeuse que vos rires et aussi douce que votre cœur.',true),
('newyear','vous','moyen','Réussite, bonheur et paix','Que 2026 soit une année de réussite, de bonheur et de paix. Bonne année, et que chaque jour vous apporte son lot de bonheur.',true),
('newyear','vous','moyen','Aussi lumineuse que vos espérances','Bonne année ! Que cette nouvelle année soit aussi belle que votre âme et aussi lumineuse que vos espérances.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES
('newyear','vous','long','Une nouvelle page se tourne','Bonne année 2026 ! Aujourd''hui, une nouvelle page se tourne, et avec elle, de nouvelles opportunités, de nouveaux défis et de nouveaux rêves à réaliser. Que cette année soit aussi belle que votre cœur, aussi lumineuse que votre sourire, et aussi riche que vos espérances. Que chaque jour vous apporte son lot de bonheur, de santé et de réussite. Que 2026 soit l''année où tout devient possible, où chaque rêve se réalise et où chaque instant est une nouvelle raison de sourire. Je vous souhaite une année aussi exceptionnelle que vous, remplie de joie, d''amour et de paix.',true),
('newyear','vous','long','Une année de renouveau','Meilleurs vœux pour cette nouvelle année ! Que 2026 soit une année de renouveau, de croissance et de bonheur. Que chaque jour soit une nouvelle aventure, chaque défi une nouvelle opportunité, et chaque moment un nouveau souvenir à chérir. Que cette année vous apporte tout ce que vous désirez : amour, santé, réussite et sérénité. Que votre cœur soit aussi léger que vos rires, et que votre âme soit aussi lumineuse que vos rêves.',true),
('newyear','vous','long','L''espoir d''un avenir meilleur','Une nouvelle année commence, et avec elle, l''espoir d''un avenir meilleur. Que 2026 soit pour vous une année de réussite, de joie et de paix. Que chaque jour soit rempli de moments précieux, de rires partagés et de succès mérités. Que cette année soit aussi belle que votre âme, aussi douce que votre cœur, et aussi radieuse que votre sourire. Bonne année, et que chaque instant soit une nouvelle raison de célébrer la vie.',true),
('newyear','vous','long','Celle de tous les possibles','Bonne année 2026 ! Que cette année soit celle de tous les possibles, où chaque rêve devient réalité et chaque défi est relevé avec brio. Que votre cœur soit aussi ouvert que vos bras, et que votre âme soit aussi pure que vos intentions. Que 2026 vous apporte tout ce que vous méritez : bonheur, santé, amour et réussite. Que chaque jour soit une nouvelle aventure à savourer, et que chaque moment soit un nouveau souvenir à chérir.',true),
('newyear','vous','long','Aussi lumineuse que vos rêves','Que cette nouvelle année soit aussi belle que vos espérances et aussi lumineuse que vos rêves. Que 2026 vous apporte tout ce que vous désirez : joie, paix, amour et réussite. Que chaque jour soit une nouvelle opportunité de grandir, d''apprendre et de sourire. Bonne année, et que cette année soit aussi exceptionnelle que vous.',true),
('newyear','vous','long','Moments inoubliables','Bonne année ! Que 2026 soit une année de renouveau, de croissance et de bonheur. Que chaque jour soit rempli de moments inoubliables, de rires et de succès. Que cette année soit aussi riche en émotions que l''année précédente l''a été, et que chaque instant soit une nouvelle raison de célébrer la vie. Que votre cœur soit aussi léger que vos rires, et que votre âme soit aussi pure que vos intentions.',true),
('newyear','vous','long','Où chaque rêve se réalise','Meilleurs vœux pour 2026 ! Que cette année soit celle où tout devient possible. Que chaque rêve se réalise, chaque défi soit relevé, et chaque moment soit une nouvelle aventure à vivre. Que 2026 vous apporte tout ce que vous méritez : bonheur, santé, amour et réussite. Que chaque jour soit aussi lumineux que votre sourire, et que chaque instant soit aussi précieux que votre cœur.',true),
('newyear','vous','long','Aussi radieuse que votre âme','Bonne année 2026 ! Que cette année soit aussi joyeuse que vos rires, aussi douce que votre cœur, et aussi radieuse que votre âme. Que chaque jour vous apporte son lot de bonheur, de paix et de réussite. Que 2026 soit l''année où tout devient possible, où chaque rêve se réalise et où chaque instant est une nouvelle raison de sourire.',true),
('newyear','vous','long','Des moments précieux et des succès mérités','Que cette nouvelle année soit remplie de moments inoubliables, de rires partagés et de succès mérités. Que 2026 vous apporte tout ce que vous désirez : amour, santé, bonheur et sérénité. Que chaque jour soit une nouvelle aventure à savourer, et que chaque moment soit un nouveau souvenir à chérir. Bonne année, et que cette année soit aussi exceptionnelle que vous.',true),
('newyear','vous','long','Aussi lumineux que votre sourire','Bonne année 2026 ! Que cette année soit celle de la réalisation de tous vos rêves. Que chaque jour soit aussi lumineux que votre sourire, aussi doux que votre cœur, et aussi joyeux que vos rires. Que 2026 vous apporte tout ce que vous méritez : bonheur, santé, amour et réussite. Que chaque instant soit une nouvelle raison de célébrer la vie, et que chaque défi soit une nouvelle opportunité de grandir.',true);
