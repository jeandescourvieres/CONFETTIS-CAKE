-- Migration 069 : Correction templates fiançailles ton='tu'
-- Les templates 'tu' de migration 053 utilisaient 'vous/vos/votre' partout
-- On corrige pour utiliser 'tu/tes/ton' quand on s'adresse au destinataire

-- ════════════════════════════════════════════
-- tu / court
-- ════════════════════════════════════════════

UPDATE message_templates SET
  title   = 'Félicitations pour tes fiançailles ! 💍',
  content = 'Félicitations pour tes fiançailles ! 💍'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'court'
  AND title = 'Félicitations pour vos fiançailles ! 💍';

UPDATE message_templates SET
  title   = 'Que ton amour grandisse encore !',
  content = 'Félicitations, et que ton amour grandisse encore !'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'court'
  AND title = 'Que votre amour grandisse encore !';

UPDATE message_templates SET
  title   = 'Aussi solide que ton amour',
  content = 'Que cet engagement soit aussi solide que ton amour.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'court'
  AND title = 'Aussi solide que votre amour';

UPDATE message_templates SET
  title   = 'Aussi belle que ton histoire',
  content = 'Que cette étape soit aussi belle que ton histoire.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'court'
  AND title = 'Aussi belle que votre histoire';

-- ════════════════════════════════════════════
-- tu / moyen
-- ════════════════════════════════════════════

UPDATE message_templates SET
  content = 'Félicitations pour tes fiançailles ! Que cette étape soit remplie de bonheur, de complicité et de préparatifs excitants pour le grand jour. Vous formez un couple magnifique, et je suis si heureux(se) pour toi.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Remplie de bonheur et de complicité';

UPDATE message_templates SET
  title   = 'Aussi belle que ton amour',
  content = 'Que tes fiançailles soient le début d''une aventure aussi belle que ton amour. Félicitations, et que chaque moment de cette période soit aussi joyeux que ton sourire aujourd''hui.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Aussi belle que votre amour';

UPDATE message_templates SET
  title   = 'Aussi magiques que ton histoire d''amour',
  content = 'Une bague, une promesse, et un avenir à construire ensemble. Que tes fiançailles soient aussi magiques que ton histoire d''amour.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Aussi magiques que votre histoire d''amour';

UPDATE message_templates SET
  content = 'Tu as choisi de t''engager, et je ne pourrais être plus heureux(se) pour toi. Que cette période de fiançailles soit remplie de rires, de rêves et de moments précieux.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Remplie de rires, de rêves et de moments précieux';

UPDATE message_templates SET
  content = 'Les fiançailles, c''est comme un avant-goût du bonheur à venir. Félicitations, et que cette étape soit aussi douce que ton amour.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Un avant-goût du bonheur à venir';

UPDATE message_templates SET
  content = 'Que tes fiançailles soient une période de joie pure, où chaque détail te rapproche encore plus de l''être que tu aimes. Bravo pour cette belle décision !'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Chaque détail vous rapproche encore plus';

UPDATE message_templates SET
  content = 'Tu as dit "oui" aux fiançailles, et je sais que ce n''est que le début d''une belle histoire. Que cette étape soit aussi lumineuse que ton avenir.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Ce n''est que le début d''une belle histoire';

UPDATE message_templates SET
  title   = 'Aussi uniques que vous deux',
  content = 'Félicitations ! Que tes fiançailles soient aussi uniques que vous deux, et que chaque instant te rappelle pourquoi tu as choisi de t''engager.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Aussi uniques que votre couple';

UPDATE message_templates SET
  content = 'Une promesse d''amour, une bague au doigt, et un cœur rempli de bonheur. Que tes fiançailles soient aussi inoubliables que ce moment.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Une bague au doigt, un cœur rempli de bonheur';

UPDATE message_templates SET
  content = 'Que cette période de fiançailles soit pour toi une source de joie, de complicité et de préparatifs excitants. Félicitations !'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'moyen'
  AND title = 'Une source de joie et de complicité';

-- ════════════════════════════════════════════
-- tu / long
-- ════════════════════════════════════════════

UPDATE message_templates SET
  content = 'Félicitations pour tes fiançailles ! Aujourd''hui, tu as fait un pas de plus vers une vie commune, et je ne pourrais être plus heureux(se) pour toi. Que cette période soit remplie de bonheur, de complicité et de moments inoubliables. Vous formez un couple incroyable, et je sais que votre histoire sera aussi belle que cette étape. Que chaque jour de tes fiançailles soit une nouvelle raison de sourire, et que ton amour grandisse avec le temps, comme une plante que tu arroses avec tendresse. Bonne route à vous deux !'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Un pas de plus vers une vie commune';

UPDATE message_templates SET
  title   = 'Le début d''une aventure aussi riche que tes rêves',
  content = 'Que tes fiançailles soient bien plus qu''une simple étape : qu''elles soient le début d''une aventure aussi riche que tes rêves. Tu as choisi de t''engager, et j''espère que cette période sera remplie de joie, de tendresse et de préparatifs excitants. Félicitations, et que ton amour soit aussi solide que les promesses que vous vous êtes faites aujourd''hui.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Le début d''une aventure aussi riche que vos rêves';

UPDATE message_templates SET
  content = 'Aujourd''hui, tu as scellé ton engagement avec une bague et une promesse, et ce geste résonne comme une belle preuve d''amour. Que tes fiançailles soient le début d''une histoire aussi profonde que ta relation. Je te souhaite une période remplie de rires, de défis relevés ensemble, et de cette complicité qui fait des couples comme le vôtre une source d''inspiration. Félicitations !'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Une belle preuve d''amour';

UPDATE message_templates SET
  content = 'Les fiançailles, c''est comme un voyage où chaque détail compte. Que cette période soit aussi belle que ton amour, aussi forte que ton engagement, et aussi lumineuse que ton sourire. Je suis si heureux(se) de faire partie de ce moment si spécial pour toi. Que chaque jour qui passe renforce votre lien et t''apporte encore plus de bonheur.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Chaque détail compte';

UPDATE message_templates SET
  title   = 'Une célébration de l''amour et de la confiance',
  content = 'Félicitations pour cette belle nouvelle ! Tes fiançailles sont une célébration de l''amour, de la confiance et de l''engagement. Que cette période soit aussi riche en émotions que cette journée l''a été. Je te souhaite une aventure remplie de succès, de joie et de moments partagés avec ceux qui t''aiment. Que ton amour soit ton guide, et ton bonheur, ta plus grande réussite.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Une célébration de l''amour et de la confiance';

UPDATE message_templates SET
  content = 'Aujourd''hui, tu as choisi de t''engager officiellement, et je sais que cette décision t''apportera encore plus de bonheur. Que tes fiançailles soient le début d''une histoire remplie de tendresse, de respect et de complicité. Félicitations, et que chaque jour de cette période soit une nouvelle page de bonheur.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Chaque jour, une nouvelle page de bonheur';

UPDATE message_templates SET
  content = 'Que cette journée reste à jamais gravée dans ton cœur comme le début d''une vie commune aussi belle que ton amour. Tu formes un couple exceptionnel, et j''espère que tes fiançailles seront aussi inspirantes que ce moment. Félicitations, et que ton amour soit aussi éternel que tes souvenirs d''aujourd''hui.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Aussi inspirantes que ce moment';

UPDATE message_templates SET
  title   = 'Un livre dont chaque chapitre te rapproche du grand jour',
  content = 'Les fiançailles, c''est comme un livre dont chaque chapitre te rapproche du grand jour. Que cette aventure soit aussi passionnante que tu l''imagines, et que chaque étape vous unisse encore plus. Félicitations, et que tes fiançailles soient aussi magiques que ce jour.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Un livre dont chaque chapitre vous rapproche du grand jour';

UPDATE message_templates SET
  content = 'Tu as choisi de partager ta vie, et aujourd''hui, je célèbre ce choix avec toi. Que tes fiançailles soient le début d''une histoire remplie de bonheur, de succès et de moments précieux. Félicitations, et que ton amour soit aussi fort que les liens qui vous unissent.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Aussi fort que les liens qui vous unissent';

UPDATE message_templates SET
  title   = 'Aussi unique que ton amour',
  content = 'Que tes fiançailles soient le début d''une vie aussi belle que tes rêves. Tu formes un couple admirable, et je sais que votre histoire sera aussi unique que ton amour. Félicitations, et que chaque jour de cette période soit une nouvelle raison de célébrer.'
WHERE occasion = 'engagement' AND ton = 'tu' AND longueur = 'long'
  AND title = 'Aussi unique que votre amour';
