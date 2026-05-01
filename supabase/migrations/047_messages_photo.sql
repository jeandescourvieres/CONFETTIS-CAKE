-- Migration 047 — Photo dans les messages (carte photo)
-- Ajoute photo_url à la table messages

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS photo_url TEXT DEFAULT NULL;

COMMENT ON COLUMN messages.photo_url IS 'URL de la photo attachée à la carte (stockée dans le bucket card-photos)';

-- Bucket card-photos (photos attachées aux messages/cartes)
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-photos', 'card-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Politique : lecture publique
CREATE POLICY "card-photos public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'card-photos');

-- Politique : upload par l'utilisateur authentifié
CREATE POLICY "card-photos auth upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'card-photos');

-- Politique : suppression par l'utilisateur authentifié
CREATE POLICY "card-photos auth delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'card-photos');
