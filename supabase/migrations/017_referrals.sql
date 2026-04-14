-- Table de suivi des parrainages
CREATE TABLE IF NOT EXISTS referrals (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id      uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  referred_email  text,
  credits_awarded integer     NOT NULL DEFAULT 5,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Index pour accès rapide par parrain
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON referrals(referrer_id);

-- RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_select_own" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "referrals_insert_service" ON referrals
  FOR INSERT WITH CHECK (true);
