-- ── Suivi des QR codes générés (quota gratuit avant mur Premium) ─────────────
-- Une ligne par (utilisateur, message) : un même message ne compte qu'une fois.

CREATE TABLE IF NOT EXISTS qr_generations (
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_id  uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, message_id)
);

ALTER TABLE qr_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qr_generations_select" ON qr_generations;
DROP POLICY IF EXISTS "qr_generations_insert" ON qr_generations;

CREATE POLICY "qr_generations_select" ON qr_generations
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "qr_generations_insert" ON qr_generations
  FOR INSERT WITH CHECK (user_id = auth.uid());
