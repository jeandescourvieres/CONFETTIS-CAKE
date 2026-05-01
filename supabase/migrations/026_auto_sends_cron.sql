-- ═══════════════════════════════════════════════
--  026 — Cron pour process-auto-sends (8h UTC)
-- ═══════════════════════════════════════════════

create extension if not exists pg_cron;

-- Supprimer le job s'il existe déjà
select cron.unschedule('process-auto-sends') where exists (
  select 1 from cron.job where jobname = 'process-auto-sends'
);

-- Lancer process-auto-sends chaque matin à 8h UTC (9h Paris hiver, 10h été)
select cron.schedule(
  'process-auto-sends',
  '0 8 * * *',
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/process-auto-sends',
    headers := jsonb_build_object(
      'Content-Type',    'application/json',
      'Authorization',   'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
