-- ═══════════════════════════════════════════════════════════
--  040 — Liste de souhaits par contact (Phase 2)
-- ═══════════════════════════════════════════════════════════

create table if not exists public.wish_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  contact_id  uuid not null references public.contacts(id) on delete cascade,
  description text not null,
  category    text,                   -- 'livre', 'tech', 'mode', etc.
  budget_max  integer,                -- en centimes (ex: 5000 = 50€)
  is_done     boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.wish_items enable row level security;

create policy "owner_all_wish_items"
  on public.wish_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists wish_items_contact_idx on public.wish_items(contact_id);
