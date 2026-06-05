-- Lien couple entre deux contacts
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS partner_contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL;
