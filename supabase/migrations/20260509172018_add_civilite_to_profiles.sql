-- Ajout de la colonne civilite sur la table profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS civilite text
  CHECK (civilite IN ('M.', 'Mme'));

NOTIFY pgrst, 'reload schema';
