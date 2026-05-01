-- ═══════════════════════════════════════════════
--  028 — Cron pour birthday-email-reminder (9h UTC)
--  Envoie un email à l'utilisateur à J-7 et J-1 avant chaque anniversaire/fête
-- ═══════════════════════════════════════════════

create extension if not exists pg_cron;

select cron.unschedule('birthday-email-reminder') where exists (
  select 1 from cron.job where jobname = 'birthday-email-reminder'
);

select cron.schedule(
  'birthday-email-reminder',
  '0 9 * * *',
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/birthday-email-reminder',
    headers := jsonb_build_object(
      'Content-Type',    'application/json',
      'Authorization',   'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
