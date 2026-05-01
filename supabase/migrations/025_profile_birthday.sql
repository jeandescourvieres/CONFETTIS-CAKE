-- Ajout de la date de naissance sur le profil utilisateur
-- Utilisé pour le calcul de compatibilité zodiacale

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS birthday text; -- format "YYYY-MM-DD" ou "0000-MM-DD" (sans année)
