-- ═══════════════════════════════════════════════
--  014 — Cron pour birthday-reminders (9h UTC)
-- ═══════════════════════════════════════════════

create extension if not exists pg_cron;

-- Supprimer le job s'il existe déjà
select cron.unschedule('birthday-reminders') where exists (
  select 1 from cron.job where jobname = 'birthday-reminders'
);

-- Lancer birthday-reminders chaque matin à 9h UTC (10h Paris hiver, 11h été)
select cron.schedule(
  'birthday-reminders',
  '0 9 * * *',
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/birthday-reminders',
    headers := jsonb_build_object(
      'Content-Type',    'application/json',
      'Authorization',   'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
