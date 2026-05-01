-- ═══════════════════════════════════════════════════════════
--  Migration 042 — Table notifications
-- ═══════════════════════════════════════════════════════════

create table if not exists public.notifications (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  contact_id   uuid        references public.contacts(id) on delete set null,
  type         text        not null default 'birthday_reminder',
  content      text        not null,
  scheduled_at timestamptz not null default now(),
  sent_at      timestamptz,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

-- RLS
alter table public.notifications enable row level security;

create policy "user_select_notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "user_update_notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Index
create index if not exists notifications_user_id_idx      on public.notifications(user_id);
create index if not exists notifications_scheduled_at_idx on public.notifications(scheduled_at desc);
create index if not exists notifications_read_at_idx      on public.notifications(read_at) where read_at is null;
