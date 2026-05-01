-- Migration 059 : Soutien — 240 messages avec sous-catégories
-- Ajoute la colonne support_type + remplace les templates soutien existants

-- Ajout de la colonne support_type (nullable pour compatibilité)
ALTER TABLE message_templates ADD COLUMN IF NOT EXISTS support_type TEXT;

-- Suppression des anciens templates soutien
DELETE FROM message_templates WHERE occasion = 'support' AND is_system = true;

-- ============================================================
-- SOUTIEN – DEUIL (bereavement)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','court','bereavement','Je suis là pour toi dans cette épreuve','Je suis là pour toi dans cette épreuve.',true),
('support','tu','court','bereavement','Toutes mes pensées t''accompagnent','Toutes mes pensées t''accompagnent.',true),
('support','tu','court','bereavement','Je partage ta peine','Je partage ta peine avec tout mon cœur.',true),
('support','tu','court','bereavement','Réconfort dans les souvenirs','Puisses-tu trouver du réconfort dans les souvenirs.',true),
('support','tu','court','bereavement','Je suis à tes côtés','Je suis à tes côtés.',true),
('support','tu','court','bereavement','Ton chagrin est aussi le mien','Ton chagrin est aussi le mien.',true),
('support','tu','court','bereavement','Je t''envoie tout mon soutien','Je t''envoie tout mon soutien.',true),
('support','tu','court','bereavement','Que les beaux souvenirs t''apaisent','Que les beaux souvenirs t''apaisent.',true),
('support','tu','court','bereavement','Je pense très fort à toi','Je pense très fort à toi.',true),
('support','tu','court','bereavement','Prends soin de toi, je suis là','Prends soin de toi, je suis là.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','moyen','bereavement','Je suis là si tu as besoin','Je sais que ces moments sont difficiles, et je veux que tu saches que je suis là pour toi. Si tu as besoin de parler, de pleurer ou simplement de silence, je suis là.',true),
('support','tu','moyen','bereavement','Tu n''es pas seul(e)','Ton chagrin est immense, mais sache que tu n''es pas seul(e). Je partage ta peine et t''envoie tout mon soutien.',true),
('support','tu','moyen','bereavement','Les souvenirs resteront','Les souvenirs que tu as partagés avec cette personne resteront à jamais dans ton cœur. Puissent-ils t''apporter un peu de réconfort.',true),
('support','tu','moyen','bereavement','Mon écoute et mon amitié','Je ne peux pas effacer ta douleur, mais je peux t''offrir mon écoute et mon amitié. Je suis là pour toi.',true),
('support','tu','moyen','bereavement','Entouré(e) d''amour','Dans ces moments sombres, n''oublie pas que tu es entouré(e) d''amour. Je suis là pour toi, aujourd''hui et toujours.',true),
('support','tu','moyen','bereavement','N''hésite pas à me le dire','Je pense à toi et à ce que tu traverses. Si tu as besoin de quoi que ce soit, n''hésite pas à me le dire.',true),
('support','tu','moyen','bereavement','Les souvenirs et l''amour restent','La perte est difficile, mais les souvenirs et l''amour restent. Je suis là pour t''aider à traverser cette épreuve.',true),
('support','tu','moyen','bereavement','Je suis là, à tes côtés','Je ne sais pas quoi dire pour apaiser ta peine, mais sache que je suis là, à tes côtés.',true),
('support','tu','moyen','bereavement','Ton courage m''inspire','Ton courage m''inspire. Je suis là pour te soutenir, pas à pas.',true),
('support','tu','moyen','bereavement','Sans jugement, sans attente','Prends le temps dont tu as besoin. Je suis là pour toi, sans jugement, sans attente.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','long','bereavement','Tu n''es pas seul(e) dans ce chagrin','Je ne trouve pas les mots pour apaiser ta douleur, mais je veux que tu saches que je suis là pour toi. Dans ces moments de chagrin, il est important de se rappeler que tu n''es pas seul(e). Les souvenirs que tu as partagés avec cette personne sont précieux, et ils resteront à jamais gravés dans ton cœur. Puissent-ils t''apporter un peu de réconfort. Je suis là pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés dans le silence. Prends le temps dont tu as besoin, et sache que je suis là, aujourd''hui et toujours.',true),
('support','tu','long','bereavement','Je suis là pour partager ta peine','La perte d''un être cher est une épreuve difficile, et je comprends à quel point tu dois te sentir submergé(e) par la tristesse. Mais sache que tu n''as pas à traverser cela seul(e). Je suis là pour toi, pour partager ta peine, pour t''offrir mon épaule ou simplement pour t''écouter. Les souvenirs que tu as créés avec cette personne sont une lumière dans l''obscurité. Puissent-ils t''aider à trouver un peu de paix. Je t''envoie tout mon amour et mon soutien.',true),
('support','tu','long','bereavement','Tu peux me parler','Je ne peux pas imaginer ce que tu ressens en ce moment, mais je veux que tu saches que je suis là pour toi. Ton chagrin est légitime, et il est important de le laisser s''exprimer. Si tu as besoin de parler, de pleurer ou simplement de te taire, je suis là. Les souvenirs que tu as partagés avec cette personne sont un trésor, et ils resteront toujours avec toi. Puissent-ils t''apporter un peu de réconfort dans ces moments difficiles.',true),
('support','tu','long','bereavement','Des personnes qui t''aiment','Dans ces moments de deuil, il est facile de se sentir seul(e) et submergé(e) par la tristesse. Mais sache que tu es entouré(e) de personnes qui t''aiment et qui sont là pour toi. Je suis l''une d''elles. Je ne peux pas effacer ta douleur, mais je peux t''offrir mon écoute, mon soutien et mon amitié. Prends le temps dont tu as besoin pour guérir, et sache que je suis là, à chaque étape du chemin.',true),
('support','tu','long','bereavement','Les souvenirs restent à jamais','La perte d''un être cher laisse un vide immense, mais les souvenirs et l''amour que tu as partagés avec cette personne restent à jamais. Puissent-ils t''apporter un peu de réconfort dans ces moments difficiles. Je suis là pour toi, pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés. Tu n''es pas seul(e), et je suis là pour t''aider à traverser cette épreuve.',true),
('support','tu','long','bereavement','Tu es entouré(e) d''amour','Je ne sais pas quoi dire pour apaiser ta peine, mais je veux que tu saches que je suis là pour toi. Ton chagrin est profond, mais sache que tu es entouré(e) d''amour. Les souvenirs que tu as créés avec cette personne sont une source de réconfort, et ils resteront toujours avec toi. Puissent-ils t''aider à trouver un peu de paix. Je suis là pour toi, aujourd''hui et toujours.',true),
('support','tu','long','bereavement','Pas à pas, ensemble','Dans ces moments de deuil, il est important de se rappeler que tu n''es pas seul(e). Je suis là pour toi, pour partager ta peine, pour t''offrir mon épaule ou simplement pour t''écouter. Les souvenirs que tu as partagés avec cette personne sont précieux, et ils resteront à jamais gravés dans ton cœur. Puissent-ils t''apporter un peu de réconfort. Prends le temps dont tu as besoin, et sache que je suis là.',true),
('support','tu','long','bereavement','Tu peux compter sur moi','La perte est difficile, mais les souvenirs et l''amour restent. Je suis là pour t''aider à traverser cette épreuve, pas à pas. Ton courage m''inspire, et je veux que tu saches que tu peux compter sur moi, aujourd''hui et toujours. Puisses-tu trouver un peu de paix dans les souvenirs que tu as partagés avec cette personne.',true),
('support','tu','long','bereavement','Dans les bons comme dans les mauvais moments','Je ne peux pas effacer ta douleur, mais je peux t''offrir mon écoute, mon soutien et mon amitié. Je suis là pour toi, dans les bons comme dans les mauvais moments. Les souvenirs que tu as créés avec cette personne sont un trésor, et ils resteront toujours avec toi. Puissent-ils t''aider à trouver un peu de réconfort dans ces moments difficiles.',true),
('support','tu','long','bereavement','Je suis là, à chaque étape','Dans ces moments sombres, n''oublie pas que tu es entouré(e) d''amour. Je suis là pour toi, pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés. Prends le temps dont tu as besoin pour guérir, et sache que je suis là, à chaque étape du chemin. Ton courage m''inspire, et je veux que tu saches que tu peux compter sur moi.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','court','bereavement','Je suis là pour vous dans cette épreuve','Je suis là pour vous dans cette épreuve.',true),
('support','vous','court','bereavement','Toutes mes pensées vous accompagnent','Toutes mes pensées vous accompagnent.',true),
('support','vous','court','bereavement','Je partage votre peine','Je partage votre peine avec tout mon cœur.',true),
('support','vous','court','bereavement','Réconfort dans les souvenirs','Puissiez-vous trouver du réconfort dans les souvenirs.',true),
('support','vous','court','bereavement','Je suis à vos côtés','Je suis à vos côtés.',true),
('support','vous','court','bereavement','Votre chagrin est aussi le mien','Votre chagrin est aussi le mien.',true),
('support','vous','court','bereavement','Je vous envoie tout mon soutien','Je vous envoie tout mon soutien.',true),
('support','vous','court','bereavement','Que les beaux souvenirs vous apaisent','Que les beaux souvenirs vous apaisent.',true),
('support','vous','court','bereavement','Je pense très fort à vous','Je pense très fort à vous.',true),
('support','vous','court','bereavement','Prenez soin de vous, je suis là','Prenez soin de vous, je suis là.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','moyen','bereavement','Je suis là si vous avez besoin','Je sais que ces moments sont difficiles, et je veux que vous sachiez que je suis là pour vous. Si vous avez besoin de parler, de pleurer ou simplement de silence, je suis là.',true),
('support','vous','moyen','bereavement','Vous n''êtes pas seul(e)','Votre chagrin est immense, mais sachez que vous n''êtes pas seul(e). Je partage votre peine et vous envoie tout mon soutien.',true),
('support','vous','moyen','bereavement','Les souvenirs resteront','Les souvenirs que vous avez partagés avec cette personne resteront à jamais dans votre cœur. Puissent-ils vous apporter un peu de réconfort.',true),
('support','vous','moyen','bereavement','Mon écoute et mon amitié','Je ne peux pas effacer votre douleur, mais je peux vous offrir mon écoute et mon amitié. Je suis là pour vous.',true),
('support','vous','moyen','bereavement','Entouré(e) d''amour','Dans ces moments sombres, n''oubliez pas que vous êtes entouré(e) d''amour. Je suis là pour vous, aujourd''hui et toujours.',true),
('support','vous','moyen','bereavement','N''hésitez pas à me le dire','Je pense à vous et à ce que vous traversez. Si vous avez besoin de quoi que ce soit, n''hésitez pas à me le dire.',true),
('support','vous','moyen','bereavement','Les souvenirs et l''amour restent','La perte est difficile, mais les souvenirs et l''amour restent. Je suis là pour vous aider à traverser cette épreuve.',true),
('support','vous','moyen','bereavement','Je suis là, à vos côtés','Je ne sais pas quoi dire pour apaiser votre peine, mais sachez que je suis là, à vos côtés.',true),
('support','vous','moyen','bereavement','Votre courage m''inspire','Votre courage m''inspire. Je suis là pour vous soutenir, pas à pas.',true),
('support','vous','moyen','bereavement','Sans jugement, sans attente','Prenez le temps dont vous avez besoin. Je suis là pour vous, sans jugement, sans attente.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','long','bereavement','Vous n''êtes pas seul(e) dans ce chagrin','Je ne trouve pas les mots pour apaiser votre douleur, mais je veux que vous sachiez que je suis là pour vous. Dans ces moments de chagrin, il est important de se rappeler que vous n''êtes pas seul(e). Les souvenirs que vous avez partagés avec cette personne sont précieux, et ils resteront à jamais gravés dans votre cœur. Puissent-ils vous apporter un peu de réconfort. Je suis là pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés dans le silence. Prenez le temps dont vous avez besoin, et sachez que je suis là, aujourd''hui et toujours.',true),
('support','vous','long','bereavement','Je suis là pour partager votre peine','La perte d''un être cher est une épreuve difficile, et je comprends à quel point vous devez vous sentir submergé(e) par la tristesse. Mais sachez que vous n''avez pas à traverser cela seul(e). Je suis là pour vous, pour partager votre peine, pour vous offrir mon épaule ou simplement pour vous écouter. Les souvenirs que vous avez créés avec cette personne sont une lumière dans l''obscurité. Puissent-ils vous aider à trouver un peu de paix. Je vous envoie tout mon amour et mon soutien.',true),
('support','vous','long','bereavement','Vous pouvez me parler','Je ne peux pas imaginer ce que vous ressentez en ce moment, mais je veux que vous sachiez que je suis là pour vous. Votre chagrin est légitime, et il est important de le laisser s''exprimer. Si vous avez besoin de parler, de pleurer ou simplement de vous taire, je suis là. Les souvenirs que vous avez partagés avec cette personne sont un trésor, et ils resteront toujours avec vous. Puissent-ils vous apporter un peu de réconfort dans ces moments difficiles.',true),
('support','vous','long','bereavement','Des personnes qui vous aiment','Dans ces moments de deuil, il est facile de se sentir seul(e) et submergé(e) par la tristesse. Mais sachez que vous êtes entouré(e) de personnes qui vous aiment et qui sont là pour vous. Je suis l''une d''elles. Je ne peux pas effacer votre douleur, mais je peux vous offrir mon écoute, mon soutien et mon amitié. Prenez le temps dont vous avez besoin pour guérir, et sachez que je suis là, à chaque étape du chemin.',true),
('support','vous','long','bereavement','Les souvenirs restent à jamais','La perte d''un être cher laisse un vide immense, mais les souvenirs et l''amour que vous avez partagés avec cette personne restent à jamais. Puissent-ils vous apporter un peu de réconfort dans ces moments difficiles. Je suis là pour vous, pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés. Vous n''êtes pas seul(e), et je suis là pour vous aider à traverser cette épreuve.',true),
('support','vous','long','bereavement','Vous êtes entouré(e) d''amour','Je ne sais pas quoi dire pour apaiser votre peine, mais je veux que vous sachiez que je suis là pour vous. Votre chagrin est profond, mais sachez que vous êtes entouré(e) d''amour. Les souvenirs que vous avez créés avec cette personne sont une source de réconfort, et ils resteront toujours avec vous. Puissent-ils vous aider à trouver un peu de paix. Je suis là pour vous, aujourd''hui et toujours.',true),
('support','vous','long','bereavement','Pas à pas, ensemble','Dans ces moments de deuil, il est important de se rappeler que vous n''êtes pas seul(e). Je suis là pour vous, pour partager votre peine, pour vous offrir mon épaule ou simplement pour vous écouter. Les souvenirs que vous avez partagés avec cette personne sont précieux, et ils resteront à jamais gravés dans votre cœur. Puissent-ils vous apporter un peu de réconfort. Prenez le temps dont vous avez besoin, et sachez que je suis là.',true),
('support','vous','long','bereavement','Vous pouvez compter sur moi','La perte est difficile, mais les souvenirs et l''amour restent. Je suis là pour vous aider à traverser cette épreuve, pas à pas. Votre courage m''inspire, et je veux que vous sachiez que vous pouvez compter sur moi, aujourd''hui et toujours. Puissiez-vous trouver un peu de paix dans les souvenirs que vous avez partagés avec cette personne.',true),
('support','vous','long','bereavement','Dans les bons comme dans les mauvais moments','Je ne peux pas effacer votre douleur, mais je peux vous offrir mon écoute, mon soutien et mon amitié. Je suis là pour vous, dans les bons comme dans les mauvais moments. Les souvenirs que vous avez créés avec cette personne sont un trésor, et ils resteront toujours avec vous. Puissent-ils vous aider à trouver un peu de réconfort dans ces moments difficiles.',true),
('support','vous','long','bereavement','Je suis là, à chaque étape','Dans ces moments sombres, n''oubliez pas que vous êtes entouré(e) d''amour. Je suis là pour vous, pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés. Prenez le temps dont vous avez besoin pour guérir, et sachez que je suis là, à chaque étape du chemin. Votre courage m''inspire, et je veux que vous sachiez que vous pouvez compter sur moi.',true);

-- ============================================================
-- SOUTIEN – MALADIE (illness)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','court','illness','Je t''envoie tout mon soutien','Je t''envoie tout mon soutien dans cette épreuve.',true),
('support','tu','court','illness','Prends soin de toi, je suis là','Prends soin de toi, je suis là.',true),
('support','tu','court','illness','Je pense très fort à toi','Je pense très fort à toi.',true),
('support','tu','court','illness','Ton courage m''inspire','Ton courage m''inspire.',true),
('support','tu','court','illness','Je suis là pour toi, toujours','Je suis là pour toi, toujours.',true),
('support','tu','court','illness','La force de guérir','Puisses-tu trouver la force de guérir.',true),
('support','tu','court','illness','Je t''envoie des ondes positives','Je t''envoie des ondes positives.',true),
('support','tu','court','illness','N''hésite pas à me demander de l''aide','N''hésite pas à me demander de l''aide.',true),
('support','tu','court','illness','Je partage ta peine et ton espoir','Je partage ta peine et ton espoir.',true),
('support','tu','court','illness','Que chaque jour t''apporte un peu plus de force','Que chaque jour t''apporte un peu plus de force.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','moyen','illness','Tu vas trouver la force','Je sais que cette période est difficile pour toi, mais sache que je suis là pour te soutenir. Ton courage est admirable, et je suis sûr(e) que tu vas trouver la force de traverser cette épreuve.',true),
('support','tu','moyen','illness','Tu n''es pas seul(e)','Prends soin de toi, et n''oublie pas que tu n''es pas seul(e). Je suis là pour t''écouter, pour t''aider ou simplement pour être à tes côtés.',true),
('support','tu','moyen','illness','Ton courage m''inspire','Je pense très fort à toi et à ce que tu traverses. Si tu as besoin de quoi que ce soit, n''hésite pas à me le dire. Ton courage m''inspire.',true),
('support','tu','moyen','illness','Je suis là pour toi','Je ne peux pas imaginer ce que tu ressens, mais je veux que tu saches que je suis là pour toi. Puisses-tu trouver la force et l''espoir pour guérir.',true),
('support','tu','moyen','illness','Chaque jour, une étape vers la guérison','Chaque jour est une nouvelle étape vers la guérison. Je suis là pour te soutenir, pas à pas.',true),
('support','tu','moyen','illness','Ondes positives','Je t''envoie tout mon soutien et des ondes positives. Que chaque jour t''apporte un peu plus de force et d''espoir.',true),
('support','tu','moyen','illness','N''hésite pas','N''hésite pas à me demander de l''aide si tu en as besoin. Je suis là pour toi, dans les bons comme dans les mauvais moments.',true),
('support','tu','moyen','illness','Une source d''inspiration','Ton courage est une source d''inspiration pour moi. Je suis là pour te soutenir, aujourd''hui et toujours.',true),
('support','tu','moyen','illness','La lumière au bout du tunnel','Je partage ta peine, mais aussi ton espoir. Puisses-tu trouver la lumière au bout du tunnel.',true),
('support','tu','moyen','illness','Encore plus fort(e)','Que cette épreuve te rende encore plus fort(e). Je suis là pour toi, toujours.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','long','illness','Ton courage est admirable','Je ne sais pas par où commencer pour te dire à quel point je suis là pour toi dans cette épreuve. Ta maladie est une bataille difficile, mais ton courage est admirable. Je veux que tu saches que tu n''es pas seul(e) : je suis là pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés. Chaque jour est une nouvelle étape vers la guérison, et je suis sûr(e) que tu vas trouver la force de traverser cette période. Puisses-tu sentir tout l''amour et le soutien qui t''entourent. Je suis là pour toi, aujourd''hui et toujours.',true),
('support','tu','long','illness','Je suis là pour te soutenir','Prends soin de toi, et n''oublie pas que tu es entouré(e) de personnes qui t''aiment. Je suis l''une d''elles. Je ne peux pas effacer ta douleur, mais je peux t''offrir mon écoute, mon soutien et mon amitié. Ton courage m''inspire, et je sais que tu vas trouver la force de guérir. Que chaque jour t''apporte un peu plus d''espoir et de sérénité. Je suis là pour toi, pas à pas.',true),
('support','tu','long','illness','La lumière au bout du tunnel','Je pense très fort à toi et à ce que tu traverses. Si tu as besoin de parler, de te reposer ou simplement de te sentir soutenu(e), je suis là. Ta maladie est une épreuve, mais ton courage est une source d''inspiration pour moi. Puisses-tu trouver la lumière au bout du tunnel, et sache que je suis là pour t''aider à chaque étape du chemin.',true),
('support','tu','long','illness','Tout l''amour qui t''entoure','Je ne peux pas imaginer ce que tu ressens en ce moment, mais je veux que tu saches que je suis là pour toi. Ton courage est admirable, et je suis sûr(e) que tu vas trouver la force de traverser cette épreuve. Chaque jour est une nouvelle opportunité de guérir, et je suis là pour te soutenir. Puisses-tu sentir tout l''amour qui t''entoure.',true),
('support','tu','long','illness','Tu peux compter sur moi','Dans ces moments difficiles, il est important de se rappeler que tu n''es pas seul(e). Je suis là pour toi, pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés. Ton courage m''inspire, et je veux que tu saches que tu peux compter sur moi. Puisses-tu trouver la force et l''espoir pour guérir. Je suis là pour toi, aujourd''hui et toujours.',true),
('support','tu','long','illness','Force et détermination','Je t''envoie tout mon soutien et des ondes positives. Que chaque jour t''apporte un peu plus de force, d''espoir et de sérénité. Ta maladie est une bataille, mais ton courage est une source d''inspiration pour moi. Je suis là pour toi, pas à pas, et je sais que tu vas traverser cette épreuve avec force et détermination.',true),
('support','tu','long','illness','Tu peux guérir','N''hésite pas à me demander de l''aide si tu en as besoin. Je suis là pour toi, dans les bons comme dans les mauvais moments. Ton courage est admirable, et je veux que tu saches que tu peux compter sur moi. Puisses-tu trouver la lumière au bout du tunnel, et que chaque jour soit une nouvelle étape vers la guérison.',true),
('support','tu','long','illness','Je suis là, pas à pas','Ton courage est une source d''inspiration pour moi. Je suis là pour te soutenir, aujourd''hui et toujours. Ta maladie est une épreuve, mais je sais que tu vas trouver la force de la traverser. Puisses-tu sentir tout l''amour et le soutien qui t''entourent. Je suis là pour toi, pas à pas.',true),
('support','tu','long','illness','Je suis là à chaque étape','Je partage ta peine, mais aussi ton espoir. Puisses-tu trouver la force de guérir, et sache que je suis là pour toi, à chaque étape du chemin. Ton courage m''inspire, et je veux que tu saches que tu n''es pas seul(e). Je suis là pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés.',true),
('support','tu','long','illness','Encore plus fort(e)','Que cette épreuve te rende encore plus fort(e). Je suis là pour toi, toujours. Ton courage est admirable, et je sais que tu vas traverser cette période avec détermination. Puisses-tu trouver la lumière au bout du tunnel, et que chaque jour t''apporte un peu plus de force et d''espoir.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','court','illness','Je vous envoie tout mon soutien','Je vous envoie tout mon soutien dans cette épreuve.',true),
('support','vous','court','illness','Prenez soin de vous, je suis là','Prenez soin de vous, je suis là.',true),
('support','vous','court','illness','Je pense très fort à vous','Je pense très fort à vous.',true),
('support','vous','court','illness','Votre courage m''inspire','Votre courage m''inspire.',true),
('support','vous','court','illness','Je suis là pour vous, toujours','Je suis là pour vous, toujours.',true),
('support','vous','court','illness','La force de guérir','Puissiez-vous trouver la force de guérir.',true),
('support','vous','court','illness','Je vous envoie des ondes positives','Je vous envoie des ondes positives.',true),
('support','vous','court','illness','N''hésitez pas à me demander de l''aide','N''hésitez pas à me demander de l''aide.',true),
('support','vous','court','illness','Je partage votre peine et votre espoir','Je partage votre peine et votre espoir.',true),
('support','vous','court','illness','Que chaque jour vous apporte un peu plus de force','Que chaque jour vous apporte un peu plus de force.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','moyen','illness','Vous allez trouver la force','Je sais que cette période est difficile pour vous, mais sachez que je suis là pour vous soutenir. Votre courage est admirable, et je suis sûr(e) que vous allez trouver la force de traverser cette épreuve.',true),
('support','vous','moyen','illness','Vous n''êtes pas seul(e)','Prenez soin de vous, et n''oubliez pas que vous n''êtes pas seul(e). Je suis là pour vous écouter, pour vous aider ou simplement pour être à vos côtés.',true),
('support','vous','moyen','illness','Votre courage m''inspire','Je pense très fort à vous et à ce que vous traversez. Si vous avez besoin de quoi que ce soit, n''hésitez pas à me le dire. Votre courage m''inspire.',true),
('support','vous','moyen','illness','Je suis là pour vous','Je ne peux pas imaginer ce que vous ressentez, mais je veux que vous sachiez que je suis là pour vous. Puissiez-vous trouver la force et l''espoir pour guérir.',true),
('support','vous','moyen','illness','Chaque jour, une étape vers la guérison','Chaque jour est une nouvelle étape vers la guérison. Je suis là pour vous soutenir, pas à pas.',true),
('support','vous','moyen','illness','Ondes positives','Je vous envoie tout mon soutien et des ondes positives. Que chaque jour vous apporte un peu plus de force et d''espoir.',true),
('support','vous','moyen','illness','N''hésitez pas','N''hésitez pas à me demander de l''aide si vous en avez besoin. Je suis là pour vous, dans les bons comme dans les mauvais moments.',true),
('support','vous','moyen','illness','Une source d''inspiration','Votre courage est une source d''inspiration pour moi. Je suis là pour vous soutenir, aujourd''hui et toujours.',true),
('support','vous','moyen','illness','La lumière au bout du tunnel','Je partage votre peine, mais aussi votre espoir. Puissiez-vous trouver la lumière au bout du tunnel.',true),
('support','vous','moyen','illness','Encore plus fort(e)','Que cette épreuve vous rende encore plus fort(e). Je suis là pour vous, toujours.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','long','illness','Votre courage est admirable','Je ne sais pas par où commencer pour vous dire à quel point je suis là pour vous dans cette épreuve. Votre maladie est une bataille difficile, mais votre courage est admirable. Je veux que vous sachiez que vous n''êtes pas seul(e) : je suis là pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés. Chaque jour est une nouvelle étape vers la guérison, et je suis sûr(e) que vous allez trouver la force de traverser cette période. Puissiez-vous sentir tout l''amour et le soutien qui vous entourent. Je suis là pour vous, aujourd''hui et toujours.',true),
('support','vous','long','illness','Je suis là pour vous soutenir','Prenez soin de vous, et n''oubliez pas que vous êtes entouré(e) de personnes qui vous aiment. Je suis l''une d''elles. Je ne peux pas effacer votre douleur, mais je peux vous offrir mon écoute, mon soutien et mon amitié. Votre courage m''inspire, et je sais que vous allez trouver la force de guérir. Que chaque jour vous apporte un peu plus d''espoir et de sérénité. Je suis là pour vous, pas à pas.',true),
('support','vous','long','illness','La lumière au bout du tunnel','Je pense très fort à vous et à ce que vous traversez. Si vous avez besoin de parler, de vous reposer ou simplement de vous sentir soutenu(e), je suis là. Votre maladie est une épreuve, mais votre courage est une source d''inspiration pour moi. Puissiez-vous trouver la lumière au bout du tunnel, et sachez que je suis là pour vous aider à chaque étape du chemin.',true),
('support','vous','long','illness','Tout l''amour qui vous entoure','Je ne peux pas imaginer ce que vous ressentez en ce moment, mais je veux que vous sachiez que je suis là pour vous. Votre courage est admirable, et je suis sûr(e) que vous allez trouver la force de traverser cette épreuve. Chaque jour est une nouvelle opportunité de guérir, et je suis là pour vous soutenir. Puissiez-vous sentir tout l''amour qui vous entoure.',true),
('support','vous','long','illness','Vous pouvez compter sur moi','Dans ces moments difficiles, il est important de vous rappeler que vous n''êtes pas seul(e). Je suis là pour vous, pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés. Votre courage m''inspire, et je veux que vous sachiez que vous pouvez compter sur moi. Puissiez-vous trouver la force et l''espoir pour guérir. Je suis là pour vous, aujourd''hui et toujours.',true),
('support','vous','long','illness','Force et détermination','Je vous envoie tout mon soutien et des ondes positives. Que chaque jour vous apporte un peu plus de force, d''espoir et de sérénité. Votre maladie est une bataille, mais votre courage est une source d''inspiration pour moi. Je suis là pour vous, pas à pas, et je sais que vous allez traverser cette épreuve avec force et détermination.',true),
('support','vous','long','illness','Vous pouvez guérir','N''hésitez pas à me demander de l''aide si vous en avez besoin. Je suis là pour vous, dans les bons comme dans les mauvais moments. Votre courage est admirable, et je veux que vous sachiez que vous pouvez compter sur moi. Puissiez-vous trouver la lumière au bout du tunnel, et que chaque jour soit une nouvelle étape vers la guérison.',true),
('support','vous','long','illness','Je suis là, pas à pas','Votre courage est une source d''inspiration pour moi. Je suis là pour vous soutenir, aujourd''hui et toujours. Votre maladie est une épreuve, mais je sais que vous allez trouver la force de la traverser. Puissiez-vous sentir tout l''amour et le soutien qui vous entourent. Je suis là pour vous, pas à pas.',true),
('support','vous','long','illness','Je suis là à chaque étape','Je partage votre peine, mais aussi votre espoir. Puissiez-vous trouver la force de guérir, et sachez que je suis là pour vous, à chaque étape du chemin. Votre courage m''inspire, et je veux que vous sachiez que vous n''êtes pas seul(e). Je suis là pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés.',true),
('support','vous','long','illness','Encore plus fort(e)','Que cette épreuve vous rende encore plus fort(e). Je suis là pour vous, toujours. Votre courage est admirable, et je sais que vous allez traverser cette période avec détermination. Puissiez-vous trouver la lumière au bout du tunnel, et que chaque jour vous apporte un peu plus de force et d''espoir.',true);

-- ============================================================
-- SOUTIEN – PÉRIODE DIFFICILE (hardtime)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','court','hardtime','Je suis là pour toi','Je suis là pour toi dans cette période difficile.',true),
('support','tu','court','hardtime','Prends soin de toi, je pense à toi','Prends soin de toi, je pense à toi.',true),
('support','tu','court','hardtime','Ton courage m''impressionne','Ton courage m''impressionne.',true),
('support','tu','court','hardtime','Je t''envoie tout mon soutien','Je t''envoie tout mon soutien.',true),
('support','tu','court','hardtime','N''hésite pas à me parler','N''hésite pas à me parler.',true),
('support','tu','court','hardtime','Je partage ta peine','Je partage ta peine.',true),
('support','tu','court','hardtime','La force de traverser cette épreuve','Puisses-tu trouver la force de traverser cette épreuve.',true),
('support','tu','court','hardtime','Je suis là, toujours','Je suis là, toujours.',true),
('support','tu','court','hardtime','Un peu d''espoir chaque jour','Que chaque jour t''apporte un peu d''espoir.',true),
('support','tu','court','hardtime','Tu n''es pas seul(e)','Tu n''es pas seul(e).',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','moyen','hardtime','Tu vas trouver la force','Je sais que cette période est difficile pour toi, mais sache que je suis là pour te soutenir. Ton courage est admirable, et je suis sûr(e) que tu vas trouver la force de traverser cette épreuve.',true),
('support','tu','moyen','hardtime','Tu n''es pas seul(e)','Prends soin de toi, et n''oublie pas que tu n''es pas seul(e). Je suis là pour t''écouter, pour t''aider ou simplement pour être à tes côtés.',true),
('support','tu','moyen','hardtime','Ton courage m''inspire','Je pense très fort à toi et à ce que tu traverses. Si tu as besoin de quoi que ce soit, n''hésite pas à me le dire. Ton courage m''inspire.',true),
('support','tu','moyen','hardtime','La lumière au bout du tunnel','Je ne peux pas imaginer ce que tu ressens, mais je veux que tu saches que je suis là pour toi. Puisses-tu trouver la lumière au bout du tunnel.',true),
('support','tu','moyen','hardtime','Chaque jour, une nouvelle étape','Chaque jour est une nouvelle étape. Je suis là pour te soutenir, pas à pas.',true),
('support','tu','moyen','hardtime','Force et espoir','Je t''envoie tout mon soutien. Que chaque jour t''apporte un peu plus de force et d''espoir.',true),
('support','tu','moyen','hardtime','N''hésite pas','N''hésite pas à me demander de l''aide si tu en as besoin. Je suis là pour toi, dans les bons comme dans les mauvais moments.',true),
('support','tu','moyen','hardtime','Une source d''inspiration','Ton courage est une source d''inspiration pour moi. Je suis là pour te soutenir, aujourd''hui et toujours.',true),
('support','tu','moyen','hardtime','Ton espoir aussi','Je partage ta peine, mais aussi ton espoir. Puisses-tu trouver la force de traverser cette épreuve.',true),
('support','tu','moyen','hardtime','Encore plus fort(e)','Que cette période te rende encore plus fort(e). Je suis là pour toi, toujours.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','long','hardtime','Tu n''es pas seul(e)','Je ne sais pas par où commencer pour te dire à quel point je suis là pour toi dans cette période difficile. Les épreuves que tu traverses sont lourdes, mais ton courage est admirable. Je veux que tu saches que tu n''es pas seul(e) : je suis là pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés. Chaque jour est une nouvelle étape, et je suis sûr(e) que tu vas trouver la force de traverser cette période. Puisses-tu sentir tout l''amour et le soutien qui t''entourent. Je suis là pour toi, aujourd''hui et toujours.',true),
('support','tu','long','hardtime','Je suis là pour te soutenir','Prends soin de toi, et n''oublie pas que tu es entouré(e) de personnes qui t''aiment. Je suis l''une d''elles. Je ne peux pas effacer tes difficultés, mais je peux t''offrir mon écoute, mon soutien et mon amitié. Ton courage m''inspire, et je sais que tu vas trouver la force de surmonter cette épreuve. Que chaque jour t''apporte un peu plus d''espoir et de sérénité. Je suis là pour toi, pas à pas.',true),
('support','tu','long','hardtime','La lumière au bout du tunnel','Je pense très fort à toi et à ce que tu traverses. Si tu as besoin de parler, de te reposer ou simplement de te sentir soutenu(e), je suis là. Tes difficultés sont réelles, mais ton courage est une source d''inspiration pour moi. Puisses-tu trouver la lumière au bout du tunnel, et sache que je suis là pour t''aider à chaque étape du chemin.',true),
('support','tu','long','hardtime','Tout l''amour qui t''entoure','Je ne peux pas imaginer ce que tu ressens en ce moment, mais je veux que tu saches que je suis là pour toi. Ton courage est admirable, et je suis sûr(e) que tu vas trouver la force de traverser cette période. Chaque jour est une nouvelle opportunité de t''en sortir, et je suis là pour te soutenir. Puisses-tu sentir tout l''amour qui t''entoure.',true),
('support','tu','long','hardtime','Tu peux compter sur moi','Dans ces moments difficiles, il est important de se rappeler que tu n''es pas seul(e). Je suis là pour toi, pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés. Ton courage m''inspire, et je veux que tu saches que tu peux compter sur moi. Puisses-tu trouver la force et l''espoir pour surmonter cette épreuve. Je suis là pour toi, aujourd''hui et toujours.',true),
('support','tu','long','hardtime','Force et détermination','Je t''envoie tout mon soutien. Que chaque jour t''apporte un peu plus de force, d''espoir et de sérénité. Tes difficultés sont temporaires, mais ton courage est une source d''inspiration pour moi. Je suis là pour toi, pas à pas, et je sais que tu vas traverser cette période avec force et détermination.',true),
('support','tu','long','hardtime','Vers une vie plus sereine','N''hésite pas à me demander de l''aide si tu en as besoin. Je suis là pour toi, dans les bons comme dans les mauvais moments. Ton courage est admirable, et je veux que tu saches que tu peux compter sur moi. Puisses-tu trouver la lumière au bout du tunnel, et que chaque jour soit une nouvelle étape vers une vie plus sereine.',true),
('support','tu','long','hardtime','Je suis là, pas à pas','Ton courage est une source d''inspiration pour moi. Je suis là pour te soutenir, aujourd''hui et toujours. Tes difficultés sont réelles, mais je sais que tu vas trouver la force de les surmonter. Puisses-tu sentir tout l''amour et le soutien qui t''entourent. Je suis là pour toi, pas à pas.',true),
('support','tu','long','hardtime','À chaque étape','Je partage ta peine, mais aussi ton espoir. Puisses-tu trouver la force de traverser cette période, et sache que je suis là pour toi, à chaque étape du chemin. Ton courage m''inspire, et je veux que tu saches que tu n''es pas seul(e). Je suis là pour t''écouter, pour te soutenir, ou simplement pour être à tes côtés.',true),
('support','tu','long','hardtime','Encore plus fort(e)','Que cette épreuve te rende encore plus fort(e). Je suis là pour toi, toujours. Ton courage est admirable, et je sais que tu vas traverser cette période avec détermination. Puisses-tu trouver la lumière au bout du tunnel, et que chaque jour t''apporte un peu plus de force et d''espoir.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','court','hardtime','Je suis là pour vous','Je suis là pour vous dans cette période difficile.',true),
('support','vous','court','hardtime','Prenez soin de vous, je pense à vous','Prenez soin de vous, je pense à vous.',true),
('support','vous','court','hardtime','Votre courage m''impressionne','Votre courage m''impressionne.',true),
('support','vous','court','hardtime','Je vous envoie tout mon soutien','Je vous envoie tout mon soutien.',true),
('support','vous','court','hardtime','N''hésitez pas à me parler','N''hésitez pas à me parler.',true),
('support','vous','court','hardtime','Je partage votre peine','Je partage votre peine.',true),
('support','vous','court','hardtime','La force de traverser cette épreuve','Puissiez-vous trouver la force de traverser cette épreuve.',true),
('support','vous','court','hardtime','Je suis là, toujours','Je suis là, toujours.',true),
('support','vous','court','hardtime','Un peu d''espoir chaque jour','Que chaque jour vous apporte un peu d''espoir.',true),
('support','vous','court','hardtime','Vous n''êtes pas seul(e)','Vous n''êtes pas seul(e).',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','moyen','hardtime','Vous allez trouver la force','Je sais que cette période est difficile pour vous, mais sachez que je suis là pour vous soutenir. Votre courage est admirable, et je suis sûr(e) que vous allez trouver la force de traverser cette épreuve.',true),
('support','vous','moyen','hardtime','Vous n''êtes pas seul(e)','Prenez soin de vous, et n''oubliez pas que vous n''êtes pas seul(e). Je suis là pour vous écouter, pour vous aider ou simplement pour être à vos côtés.',true),
('support','vous','moyen','hardtime','Votre courage m''inspire','Je pense très fort à vous et à ce que vous traversez. Si vous avez besoin de quoi que ce soit, n''hésitez pas à me le dire. Votre courage m''inspire.',true),
('support','vous','moyen','hardtime','La lumière au bout du tunnel','Je ne peux pas imaginer ce que vous ressentez, mais je veux que vous sachiez que je suis là pour vous. Puissiez-vous trouver la lumière au bout du tunnel.',true),
('support','vous','moyen','hardtime','Chaque jour, une nouvelle étape','Chaque jour est une nouvelle étape. Je suis là pour vous soutenir, pas à pas.',true),
('support','vous','moyen','hardtime','Force et espoir','Je vous envoie tout mon soutien. Que chaque jour vous apporte un peu plus de force et d''espoir.',true),
('support','vous','moyen','hardtime','N''hésitez pas','N''hésitez pas à me demander de l''aide si vous en avez besoin. Je suis là pour vous, dans les bons comme dans les mauvais moments.',true),
('support','vous','moyen','hardtime','Une source d''inspiration','Votre courage est une source d''inspiration pour moi. Je suis là pour vous soutenir, aujourd''hui et toujours.',true),
('support','vous','moyen','hardtime','Votre espoir aussi','Je partage votre peine, mais aussi votre espoir. Puissiez-vous trouver la force de traverser cette épreuve.',true),
('support','vous','moyen','hardtime','Encore plus fort(e)','Que cette période vous rende encore plus fort(e). Je suis là pour vous, toujours.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','long','hardtime','Vous n''êtes pas seul(e)','Je ne sais pas par où commencer pour vous dire à quel point je suis là pour vous dans cette période difficile. Les épreuves que vous traversez sont lourdes, mais votre courage est admirable. Je veux que vous sachiez que vous n''êtes pas seul(e) : je suis là pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés. Chaque jour est une nouvelle étape, et je suis sûr(e) que vous allez trouver la force de traverser cette période. Puissiez-vous sentir tout l''amour et le soutien qui vous entourent. Je suis là pour vous, aujourd''hui et toujours.',true),
('support','vous','long','hardtime','Je suis là pour vous soutenir','Prenez soin de vous, et n''oubliez pas que vous êtes entouré(e) de personnes qui vous aiment. Je suis l''une d''elles. Je ne peux pas effacer vos difficultés, mais je peux vous offrir mon écoute, mon soutien et mon amitié. Votre courage m''inspire, et je sais que vous allez trouver la force de surmonter cette épreuve. Que chaque jour vous apporte un peu plus d''espoir et de sérénité. Je suis là pour vous, pas à pas.',true),
('support','vous','long','hardtime','La lumière au bout du tunnel','Je pense très fort à vous et à ce que vous traversez. Si vous avez besoin de parler, de vous reposer ou simplement de vous sentir soutenu(e), je suis là. Vos difficultés sont réelles, mais votre courage est une source d''inspiration pour moi. Puissiez-vous trouver la lumière au bout du tunnel, et sachez que je suis là pour vous aider à chaque étape du chemin.',true),
('support','vous','long','hardtime','Tout l''amour qui vous entoure','Je ne peux pas imaginer ce que vous ressentez en ce moment, mais je veux que vous sachiez que je suis là pour vous. Votre courage est admirable, et je suis sûr(e) que vous allez trouver la force de traverser cette période. Chaque jour est une nouvelle opportunité de vous en sortir, et je suis là pour vous soutenir. Puissiez-vous sentir tout l''amour qui vous entoure.',true),
('support','vous','long','hardtime','Vous pouvez compter sur moi','Dans ces moments difficiles, il est important de vous rappeler que vous n''êtes pas seul(e). Je suis là pour vous, pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés. Votre courage m''inspire, et je veux que vous sachiez que vous pouvez compter sur moi. Puissiez-vous trouver la force et l''espoir pour surmonter cette épreuve. Je suis là pour vous, aujourd''hui et toujours.',true),
('support','vous','long','hardtime','Force et détermination','Je vous envoie tout mon soutien. Que chaque jour vous apporte un peu plus de force, d''espoir et de sérénité. Vos difficultés sont temporaires, mais votre courage est une source d''inspiration pour moi. Je suis là pour vous, pas à pas, et je sais que vous allez traverser cette période avec force et détermination.',true),
('support','vous','long','hardtime','Vers une vie plus sereine','N''hésitez pas à me demander de l''aide si vous en avez besoin. Je suis là pour vous, dans les bons comme dans les mauvais moments. Votre courage est admirable, et je veux que vous sachiez que vous pouvez compter sur moi. Puissiez-vous trouver la lumière au bout du tunnel, et que chaque jour soit une nouvelle étape vers une vie plus sereine.',true),
('support','vous','long','hardtime','Je suis là, pas à pas','Votre courage est une source d''inspiration pour moi. Je suis là pour vous soutenir, aujourd''hui et toujours. Vos difficultés sont réelles, mais je sais que vous allez trouver la force de les surmonter. Puissiez-vous sentir tout l''amour et le soutien qui vous entourent. Je suis là pour vous, pas à pas.',true),
('support','vous','long','hardtime','À chaque étape','Je partage votre peine, mais aussi votre espoir. Puissiez-vous trouver la force de traverser cette période, et sachez que je suis là pour vous, à chaque étape du chemin. Votre courage m''inspire, et je veux que vous sachiez que vous n''êtes pas seul(e). Je suis là pour vous écouter, pour vous soutenir, ou simplement pour être à vos côtés.',true),
('support','vous','long','hardtime','Encore plus fort(e)','Que cette épreuve vous rende encore plus fort(e). Je suis là pour vous, toujours. Votre courage est admirable, et je sais que vous allez traverser cette période avec détermination. Puissiez-vous trouver la lumière au bout du tunnel, et que chaque jour vous apporte un peu plus de force et d''espoir.',true);

-- ============================================================
-- SOUTIEN – ENCOURAGEMENT (encouragement)
-- ============================================================

-- tu / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','court','encouragement','Je crois en toi, tu vas y arriver !','Je crois en toi, tu vas y arriver !',true),
('support','tu','court','encouragement','Ton courage est inspirant','Ton courage est inspirant.',true),
('support','tu','court','encouragement','Tu es sur la bonne voie','Continue comme ça, tu es sur la bonne voie.',true),
('support','tu','court','encouragement','Je suis fier/fière de toi','Je suis fier/fière de toi.',true),
('support','tu','court','encouragement','Tu as tout pour réussir','Tu as tout pour réussir.',true),
('support','tu','court','encouragement','Tu es presque arrivé(e) !','Ne lâche rien, tu es presque arrivé(e) !',true),
('support','tu','court','encouragement','Plein d''énergie positive','Je t''envoie plein d''énergie positive.',true),
('support','tu','court','encouragement','Plus fort(e) que tu ne le penses','Tu es plus fort(e) que tu ne le penses.',true),
('support','tu','court','encouragement','Chaque pas compte','Chaque pas compte, continue !',true),
('support','tu','court','encouragement','Je suis là pour te soutenir','Je suis là pour te soutenir.',true);

-- tu / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','moyen','encouragement','Tu vas continuer à avancer','Je sais que les choses ne sont pas toujours faciles, mais je crois en toi et en ta capacité à surmonter les obstacles. Tu as déjà accompli tellement, et je suis sûr(e) que tu vas continuer à avancer.',true),
('support','tu','moyen','encouragement','Tu es sur la bonne voie !','Ton courage est une vraie source d''inspiration. Chaque pas que tu fais te rapproche de tes objectifs. Continue comme ça, tu es sur la bonne voie !',true),
('support','tu','moyen','encouragement','Tu as tout pour réussir','Je suis fier/fière de toi et de tout ce que tu as accompli jusqu''ici. Ne lâche rien, tu as tout pour réussir.',true),
('support','tu','moyen','encouragement','Chaque effort compte','Je t''envoie plein d''énergie positive pour t''aider à continuer. Tu es plus fort(e) que tu ne le penses, et chaque effort compte.',true),
('support','tu','moyen','encouragement','Tu es presque arrivé(e) !','Les défis que tu relèves montrent à quel point tu es déterminé(e). Continue, tu es presque arrivé(e) !',true),
('support','tu','moyen','encouragement','Ne doute pas de toi','Je suis là pour te soutenir, aujourd''hui et toujours. Chaque pas que tu fais est important, alors ne doute pas de toi.',true),
('support','tu','moyen','encouragement','Je crois en toi','Tu as déjà surmonté tellement d''épreuves, et je sais que tu vas continuer à le faire. Je crois en toi, et je suis là pour t''encourager.',true),
('support','tu','moyen','encouragement','Tu es capable de grandes choses','Ne sous-estime pas ta force. Chaque petit pas te rapproche de tes rêves. Continue, tu es capable de grandes choses.',true),
('support','tu','moyen','encouragement','Fonce !','Je t''envoie tout mon soutien pour t''aider à avancer. Tu as tout ce qu''il faut pour réussir, alors fonce !',true),
('support','tu','moyen','encouragement','Tu es sur la bonne voie','Je suis là pour toi, dans les bons comme dans les mauvais moments. Continue à avancer, tu es sur la bonne voie.',true);

-- tu / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','tu','long','encouragement','Tu es capable de grandes choses','Je veux que tu saches à quel point je crois en toi. Les défis que tu relèves, les obstacles que tu surmontes, tout cela montre à quel point tu es fort(e) et déterminé(e). Je suis là pour te soutenir, pour t''encourager, et pour te rappeler que tu as tout ce qu''il faut pour réussir. Chaque pas que tu fais, aussi petit soit-il, te rapproche de tes objectifs. Ne lâche rien, car tu es capable de grandes choses. Je suis fier/fière de toi, et je sais que tu vas continuer à avancer, aujourd''hui et toujours.',true),
('support','tu','long','encouragement','Tu vas atteindre tes rêves','Ton courage est une vraie source d''inspiration pour moi. Chaque fois que je te vois relever un défi, je me dis à quel point tu es déterminé(e) et résilient(e). Continue comme ça, car tu es sur la bonne voie. Je suis là pour te soutenir, pour t''écouter, et pour t''encourager à chaque étape. Ne doute pas de toi, car tu as déjà accompli tellement. Je crois en toi, et je sais que tu vas atteindre tes rêves.',true),
('support','tu','long','encouragement','Chaque effort compte','Je suis fier/fière de toi et de tout ce que tu as accompli jusqu''ici. Les épreuves que tu as traversées montrent à quel point tu es fort(e), et je suis sûr(e) que tu vas continuer à avancer. Ne lâche rien, car chaque effort compte. Je suis là pour te soutenir, pour te rappeler que tu es capable de grandes choses, et pour t''encourager à continuer. Tu as tout pour réussir, alors fonce !',true),
('support','tu','long','encouragement','Ne sous-estime pas ta force','Je t''envoie plein d''énergie positive pour t''aider à continuer. Les défis que tu relèves sont la preuve de ta détermination, et je sais que tu vas surmonter les obstacles qui se présentent à toi. Chaque pas que tu fais est important, alors ne sous-estime pas ta force. Je suis là pour toi, dans les bons comme dans les mauvais moments, et je crois en toi plus que tout.',true),
('support','tu','long','encouragement','Tu es presque arrivé(e) !','Les défis que tu relèves montrent à quel point tu es déterminé(e). Chaque obstacle que tu surmontes te rapproche de tes objectifs, et je suis là pour te soutenir à chaque étape. Continue comme ça, car tu es presque arrivé(e) ! Je suis fier/fière de toi, et je sais que tu vas réussir. Ne lâche rien, car tu as tout ce qu''il faut pour y arriver.',true),
('support','tu','long','encouragement','Chaque pas est une victoire','Je suis là pour te soutenir, aujourd''hui et toujours. Chaque pas que tu fais, aussi petit soit-il, est une victoire. Ne doute pas de toi, car tu es plus fort(e) que tu ne le penses. Je crois en toi, et je sais que tu vas continuer à avancer, pas à pas. Les défis que tu relèves sont la preuve de ta détermination, et je suis là pour t''encourager à chaque étape.',true),
('support','tu','long','encouragement','Tu vas continuer à le faire','Tu as déjà surmonté tellement d''épreuves, et je sais que tu vas continuer à le faire. Ton courage est une source d''inspiration pour moi, et je veux que tu saches que je suis là pour toi, dans les bons comme dans les mauvais moments. Continue à avancer, car tu es capable de grandes choses. Je crois en toi, et je sais que tu vas atteindre tes rêves.',true),
('support','tu','long','encouragement','Continue, tu es sur la bonne voie','Ne sous-estime pas ta force. Chaque petit pas que tu fais te rapproche de tes objectifs, et chaque défi que tu relèves montre à quel point tu es déterminé(e). Je suis là pour te soutenir, pour t''encourager, et pour te rappeler que tu es capable de grandes choses. Continue comme ça, car tu es sur la bonne voie.',true),
('support','tu','long','encouragement','Ta détermination est éternelle','Je t''envoie tout mon soutien pour t''aider à avancer. Les obstacles que tu rencontres sont temporaires, mais ta détermination est éternelle. Je crois en toi, et je sais que tu vas surmonter chaque défi avec courage et persévérance. Continue à avancer, car tu as tout ce qu''il faut pour réussir.',true),
('support','tu','long','encouragement','Tu vas atteindre tes rêves','Je suis là pour toi, dans les bons comme dans les mauvais moments. Les défis que tu relèves montrent à quel point tu es fort(e), et je veux que tu saches que je suis là pour te soutenir à chaque étape. Continue à avancer, car tu es sur la bonne voie. Je crois en toi, et je sais que tu vas atteindre tes rêves.',true);

-- vous / court
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','court','encouragement','Je crois en vous, vous allez y arriver !','Je crois en vous, vous allez y arriver !',true),
('support','vous','court','encouragement','Votre courage est inspirant','Votre courage est inspirant.',true),
('support','vous','court','encouragement','Vous êtes sur la bonne voie','Continuez comme ça, vous êtes sur la bonne voie.',true),
('support','vous','court','encouragement','Je suis fier/fière de vous','Je suis fier/fière de vous.',true),
('support','vous','court','encouragement','Vous avez tout pour réussir','Vous avez tout pour réussir.',true),
('support','vous','court','encouragement','Vous êtes presque arrivé(e) !','Ne lâchez rien, vous êtes presque arrivé(e) !',true),
('support','vous','court','encouragement','Plein d''énergie positive','Je vous envoie plein d''énergie positive.',true),
('support','vous','court','encouragement','Plus fort(e) que vous ne le pensez','Vous êtes plus fort(e) que vous ne le pensez.',true),
('support','vous','court','encouragement','Chaque pas compte','Chaque pas compte, continuez !',true),
('support','vous','court','encouragement','Je suis là pour vous soutenir','Je suis là pour vous soutenir.',true);

-- vous / moyen
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','moyen','encouragement','Vous allez continuer à avancer','Je sais que les choses ne sont pas toujours faciles, mais je crois en vous et en votre capacité à surmonter les obstacles. Vous avez déjà accompli tellement, et je suis sûr(e) que vous allez continuer à avancer.',true),
('support','vous','moyen','encouragement','Vous êtes sur la bonne voie !','Votre courage est une vraie source d''inspiration. Chaque pas que vous faites vous rapproche de vos objectifs. Continuez comme ça, vous êtes sur la bonne voie !',true),
('support','vous','moyen','encouragement','Vous avez tout pour réussir','Je suis fier/fière de vous et de tout ce que vous avez accompli jusqu''ici. Ne lâchez rien, vous avez tout pour réussir.',true),
('support','vous','moyen','encouragement','Chaque effort compte','Je vous envoie plein d''énergie positive pour vous aider à continuer. Vous êtes plus fort(e) que vous ne le pensez, et chaque effort compte.',true),
('support','vous','moyen','encouragement','Vous êtes presque arrivé(e) !','Les défis que vous relevez montrent à quel point vous êtes déterminé(e). Continuez, vous êtes presque arrivé(e) !',true),
('support','vous','moyen','encouragement','Ne doutez pas de vous','Je suis là pour vous soutenir, aujourd''hui et toujours. Chaque pas que vous faites est important, alors ne doutez pas de vous.',true),
('support','vous','moyen','encouragement','Je crois en vous','Vous avez déjà surmonté tellement d''épreuves, et je sais que vous allez continuer à le faire. Je crois en vous, et je suis là pour vous encourager.',true),
('support','vous','moyen','encouragement','Vous êtes capable de grandes choses','Ne sous-estimez pas votre force. Chaque petit pas vous rapproche de vos rêves. Continuez, vous êtes capable de grandes choses.',true),
('support','vous','moyen','encouragement','Foncez !','Je vous envoie tout mon soutien pour vous aider à avancer. Vous avez tout ce qu''il faut pour réussir, alors foncez !',true),
('support','vous','moyen','encouragement','Vous êtes sur la bonne voie','Je suis là pour vous, dans les bons comme dans les mauvais moments. Continuez à avancer, vous êtes sur la bonne voie.',true);

-- vous / long
INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES
('support','vous','long','encouragement','Vous êtes capable de grandes choses','Je veux que vous sachiez à quel point je crois en vous. Les défis que vous relevez, les obstacles que vous surmontez, tout cela montre à quel point vous êtes fort(e) et déterminé(e). Je suis là pour vous soutenir, pour vous encourager, et pour vous rappeler que vous avez tout ce qu''il faut pour réussir. Chaque pas que vous faites, aussi petit soit-il, vous rapproche de vos objectifs. Ne lâchez rien, car vous êtes capable de grandes choses. Je suis fier/fière de vous, et je sais que vous allez continuer à avancer, aujourd''hui et toujours.',true),
('support','vous','long','encouragement','Vous allez atteindre vos rêves','Votre courage est une vraie source d''inspiration pour moi. Chaque fois que je vous vois relever un défi, je me dis à quel point vous êtes déterminé(e) et résilient(e). Continuez comme ça, car vous êtes sur la bonne voie. Je suis là pour vous soutenir, pour vous écouter, et pour vous encourager à chaque étape. Ne doutez pas de vous, car vous avez déjà accompli tellement. Je crois en vous, et je sais que vous allez atteindre vos rêves.',true),
('support','vous','long','encouragement','Chaque effort compte','Je suis fier/fière de vous et de tout ce que vous avez accompli jusqu''ici. Les épreuves que vous avez traversées montrent à quel point vous êtes fort(e), et je suis sûr(e) que vous allez continuer à avancer. Ne lâchez rien, car chaque effort compte. Je suis là pour vous soutenir, pour vous rappeler que vous êtes capable de grandes choses, et pour vous encourager à continuer. Vous avez tout pour réussir, alors foncez !',true),
('support','vous','long','encouragement','Ne sous-estimez pas votre force','Je vous envoie plein d''énergie positive pour vous aider à continuer. Les défis que vous relevez sont la preuve de votre détermination, et je sais que vous allez surmonter les obstacles qui se présentent à vous. Chaque pas que vous faites est important, alors ne sous-estimez pas votre force. Je suis là pour vous, dans les bons comme dans les mauvais moments, et je crois en vous plus que tout.',true),
('support','vous','long','encouragement','Vous êtes presque arrivé(e) !','Les défis que vous relevez montrent à quel point vous êtes déterminé(e). Chaque obstacle que vous surmontez vous rapproche de vos objectifs, et je suis là pour vous soutenir à chaque étape. Continuez comme ça, car vous êtes presque arrivé(e) ! Je suis fier/fière de vous, et je sais que vous allez réussir. Ne lâchez rien, car vous avez tout ce qu''il faut pour y arriver.',true),
('support','vous','long','encouragement','Chaque pas est une victoire','Je suis là pour vous soutenir, aujourd''hui et toujours. Chaque pas que vous faites, aussi petit soit-il, est une victoire. Ne doutez pas de vous, car vous êtes plus fort(e) que vous ne le pensez. Je crois en vous, et je sais que vous allez continuer à avancer, pas à pas. Les défis que vous relevez sont la preuve de votre détermination, et je suis là pour vous encourager à chaque étape.',true),
('support','vous','long','encouragement','Vous allez continuer à le faire','Vous avez déjà surmonté tellement d''épreuves, et je sais que vous allez continuer à le faire. Votre courage est une source d''inspiration pour moi, et je veux que vous sachiez que je suis là pour vous, dans les bons comme dans les mauvais moments. Continuez à avancer, car vous êtes capable de grandes choses. Je crois en vous, et je sais que vous allez atteindre vos rêves.',true),
('support','vous','long','encouragement','Continuez, vous êtes sur la bonne voie','Ne sous-estimez pas votre force. Chaque petit pas que vous faites vous rapproche de vos objectifs, et chaque défi que vous relevez montre à quel point vous êtes déterminé(e). Je suis là pour vous soutenir, pour vous encourager, et pour vous rappeler que vous êtes capable de grandes choses. Continuez comme ça, car vous êtes sur la bonne voie.',true),
('support','vous','long','encouragement','Votre détermination est éternelle','Je vous envoie tout mon soutien pour vous aider à avancer. Les obstacles que vous rencontrez sont temporaires, mais votre détermination est éternelle. Je crois en vous, et je sais que vous allez surmonter chaque défi avec courage et persévérance. Continuez à avancer, car vous avez tout ce qu''il faut pour réussir.',true),
('support','vous','long','encouragement','Vous allez atteindre vos rêves','Je suis là pour vous, dans les bons comme dans les mauvais moments. Les défis que vous relevez montrent à quel point vous êtes fort(e), et je veux que vous sachiez que je suis là pour vous soutenir à chaque étape. Continuez à avancer, car vous êtes sur la bonne voie. Je crois en vous, et je sais que vous allez atteindre vos rêves.',true);
