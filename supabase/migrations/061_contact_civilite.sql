-- Civilité (M. / Mme) sur la fiche contact
-- Utilisée pour personnaliser les messages IA (ex: "Cher Michel" / "Chère Marie")

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS civilite text CHECK (civilite IN ('M.', 'Mme'));
