-- Compteur d'interactions par contact (visites fiche + générations de messages)
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS interaction_count   integer     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_interaction_at timestamptz;

-- Fonction RPC pour incrémenter de façon atomique
CREATE OR REPLACE FUNCTION public.increment_contact_interaction(p_contact_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE contacts
  SET interaction_count   = interaction_count + 1,
      last_interaction_at = now()
  WHERE id = p_contact_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_contact_interaction(uuid) TO authenticated;
