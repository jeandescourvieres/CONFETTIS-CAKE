-- Élargit la contrainte pet_type pour accepter tous les types d'animaux
-- proposés dans le formulaire "Nouvel animal"

ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_pet_type_check;

ALTER TABLE contacts
  ADD CONSTRAINT contacts_pet_type_check
  CHECK (pet_type IN ('chien', 'chat', 'lapin', 'perroquet', 'hamster', 'poisson', 'cheval', 'oiseau', 'autre'));
