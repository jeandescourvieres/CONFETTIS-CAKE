-- ═══════════════════════════════════════════════
--  030 — Cron pour process-reminders (8h UTC)
-- ═══════════════════════════════════════════════

select cron.unschedule('process-reminders') where exists (
  select 1 from cron.job where jobname = 'process-reminders'
);

select cron.schedule(
  'process-reminders',
  '0 8 * * *',
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/process-reminders',
    headers := jsonb_build_object(
      'Content-Type',    'application/json',
      'Authorization',   'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
