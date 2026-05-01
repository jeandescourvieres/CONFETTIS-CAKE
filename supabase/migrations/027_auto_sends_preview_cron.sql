-- ═══════════════════════════════════════════════
--  027 — Cron pour notify-auto-sends-preview (20h UTC)
--  Envoie une notif push J-1 pour chaque envoi automatique prévu le lendemain
-- ═══════════════════════════════════════════════

create extension if not exists pg_cron;

-- Supprimer le job s'il existe déjà
select cron.unschedule('notify-auto-sends-preview') where exists (
  select 1 from cron.job where jobname = 'notify-auto-sends-preview'
);

-- Lancer notify-auto-sends-preview chaque soir à 20h UTC (21h Paris hiver, 22h été)
select cron.schedule(
  'notify-auto-sends-preview',
  '0 20 * * *',
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/notify-auto-sends-preview',
    headers := jsonb_build_object(
      'Content-Type',    'application/json',
      'Authorization',   'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
