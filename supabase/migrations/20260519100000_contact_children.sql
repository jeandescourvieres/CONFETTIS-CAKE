-- Enfants rattachés à un contact
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS child_parent_name text,
  ADD COLUMN IF NOT EXISTS child_parent_contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS child_gender text CHECK (child_gender IN ('male', 'female'));
