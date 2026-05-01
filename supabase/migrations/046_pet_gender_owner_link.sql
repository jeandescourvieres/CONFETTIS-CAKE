-- Champs supplémentaires pour les animaux de compagnie
-- pet_gender   : male | female
-- pet_owner_contact_id : lien vers la fiche du maître/maîtresse

ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS pet_gender text CHECK (pet_gender IN ('male', 'female')),
  ADD COLUMN IF NOT EXISTS pet_owner_contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL;
