-- Ajout de la civilité sur le profil utilisateur
-- Remplace la question genre de l'onboarding
-- Utilisé pour les signatures famille et la personnalisation des messages IA

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS civilite text CHECK (civilite IN ('M.', 'Mme'));
