-- ═══════════════════════════════════════════════════════════════
--  Challenge mensuel des prescripteurs — classement volume + qualité
-- ═══════════════════════════════════════════════════════════════
-- Une ligne par mois écoulé : gagnant "volume" (le plus de filleuls)
-- et gagnant "qualité" (le plus de filleuls passés en Premium).

CREATE TABLE IF NOT EXISTS referral_monthly_challenges (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start            date        NOT NULL,
  period_end              date        NOT NULL,
  volume_winner_id        uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  volume_winner_name      text,
  volume_winner_count     integer     NOT NULL DEFAULT 0,
  quality_winner_id       uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  quality_winner_name     text,
  quality_winner_count    integer     NOT NULL DEFAULT 0,
  created_at              timestamptz NOT NULL DEFAULT now(),
  UNIQUE (period_start, period_end)
);

ALTER TABLE referral_monthly_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referral_monthly_challenges_select" ON referral_monthly_challenges;
CREATE POLICY "referral_monthly_challenges_select" ON referral_monthly_challenges
  FOR SELECT USING (true);

-- ── Cron : calcul le 1er de chaque mois à 6h UTC (challenge du mois précédent) ──
create extension if not exists pg_cron;

select cron.unschedule('process-referral-challenge') where exists (
  select 1 from cron.job where jobname = 'process-referral-challenge'
);

select cron.schedule(
  'process-referral-challenge',
  '0 6 1 * *',
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/process-referral-challenge',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
