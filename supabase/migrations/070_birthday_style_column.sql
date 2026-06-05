-- Migration 070 : Ajout colonne style + suppression des templates anniversaire classiques
-- Le style permet de distinguer les 6 ambiances (chaleureux, elegant, drole, poetique, famille, collegue)

ALTER TABLE message_templates
  ADD COLUMN IF NOT EXISTS style TEXT;

-- Supprimer tous les templates système anniversaire (seront remplacés par les nouveaux)
DELETE FROM message_templates
WHERE is_system = true
  AND occasion = 'birthday'
  AND support_type IS NULL
  AND style IS NULL;
