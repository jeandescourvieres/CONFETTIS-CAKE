-- ═══════════════════════════════════════════════════════════════
--  20260623 — Rappels collectifs
--  Rappelle à d'autres destinataires la date à venir d'un contact
--  (ex: "N'oubliez pas l'anniversaire de Mamie le 15 juin")
-- ═══════════════════════════════════════════════════════════════

create table if not exists group_reminders (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references profiles(id) on delete cascade,
  contact_id             uuid not null references contacts(id) on delete cascade,
  trigger_event          text not null check (trigger_event in ('birthday', 'nameday')),
  days_before            integer not null default 3,
  content                text,
  channel                text not null default 'sms' check (channel in ('sms', 'email')),
  recipient_contact_ids  uuid[] not null default '{}',
  is_active              boolean not null default true,
  last_sent_at           timestamptz,
  created_at             timestamptz not null default now()
);

alter table group_reminders enable row level security;

drop policy if exists "group_reminders_all" on group_reminders;
create policy "group_reminders_all" on group_reminders
  for all using (user_id = auth.uid());

create index if not exists group_reminders_active_idx
  on group_reminders (user_id, is_active, trigger_event);

-- ── Cron quotidien ───────────────────────────────────────────────
create extension if not exists pg_cron;

select cron.unschedule('process-group-reminders') where exists (
  select 1 from cron.job where jobname = 'process-group-reminders'
);

select cron.schedule(
  'process-group-reminders',
  '0 8 * * *',
  $$
  select net.http_post(
    url     := current_setting('app.supabase_url') || '/functions/v1/process-group-reminders',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
    ),
    body    := '{}'::jsonb
  );
  $$
);
