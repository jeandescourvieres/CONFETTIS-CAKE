-- Ajout d'une colonne subtype sur message_templates
-- Permet de classer les messages par sous-catégorie au sein d'une même occasion
-- Valeurs : 'bff' | 'sans_filtre' | 'ex' | null (= classique)

ALTER TABLE message_templates
  ADD COLUMN IF NOT EXISTS subtype text
  CHECK (subtype IN ('bff', 'sans_filtre', 'ex'));
