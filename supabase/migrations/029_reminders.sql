-- ═══════════════════════════════════════════════
--  029 — Table rappels personnalisés
-- ═══════════════════════════════════════════════

create type recurrence_type as enum ('weekly', 'monthly', 'yearly', 'once');

create table if not exists reminders (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  contact_id    uuid        references contacts(id) on delete set null,
  title         text        not null,
  recurrence    recurrence_type not null,
  day_of_week   int         check (day_of_week  between 0 and 6),   -- 0=Sun (JS)
  day_of_month  int         check (day_of_month between 1 and 31),  -- pour monthly/yearly
  month         int         check (month        between 1 and 12),  -- pour yearly
  once_date     date,                                                -- pour once
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now()
);

alter table reminders enable row level security;

create policy "users manage own reminders" on reminders
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
