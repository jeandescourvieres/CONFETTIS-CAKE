-- Ajoute une colonne is_manual_only sur message_templates
-- true  → accessible uniquement depuis "À ma façon" (panneau Idées)
-- false → accessible depuis "Choisir un modèle" (et panneau Idées)

ALTER TABLE message_templates
  ADD COLUMN IF NOT EXISTS is_manual_only BOOLEAN NOT NULL DEFAULT false;

-- Les 60 templates "greetings" déjà insérés (migration 063)
-- sont réservés au mode "À ma façon"
UPDATE message_templates
  SET is_manual_only = true
  WHERE occasion = 'greetings' AND is_system = true;
