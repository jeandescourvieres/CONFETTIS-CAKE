-- ═══════════════════════════════════════════════
--  007 — Cron pour process-music-queue
-- ═══════════════════════════════════════════════

-- Activer l'extension pg_cron si elle n'est pas déjà active
-- (disponible sur Supabase Pro — commenter si tier Free)
create extension if not exists pg_cron;

-- Appeler l'Edge Function process-music-queue toutes les 5 minutes
select cron.schedule(
  'process-music-queue',        -- nom unique du job
  '*/5 * * * *',                -- toutes les 5 minutes
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/process-music-queue',
    headers := jsonb_build_object(
      'Content-Type',    'application/json',
      'Authorization',   'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- Note : les variables app.supabase_url et app.supabase_service_role_key
-- doivent être définies dans les paramètres de la DB Supabase ou via :
--   alter database postgres set app.supabase_url = 'https://xxx.supabase.co';
--   alter database postgres set app.supabase_service_role_key = 'eyJ...';
