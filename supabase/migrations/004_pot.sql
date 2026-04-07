-- ═══════════════════════════════════════════════
--  004 — Cagnotte collective
-- ═══════════════════════════════════════════════

do $$ begin
  create type pot_status as enum ('open', 'completed', 'closed');
exception when duplicate_object then null;
end $$;

create table if not exists public.pots (
  id                  uuid primary key default gen_random_uuid(),
  creator_id          uuid not null references public.profiles(id) on delete cascade,
  contact_id          uuid not null references public.contacts(id) on delete cascade,
  title               text not null,
  target_amount       numeric(10,2) not null check (target_amount > 0),
  current_amount      numeric(10,2) not null default 0,
  gift_description    text,
  status              pot_status not null default 'open',
  deadline            date,
  purchase_photo_url  text,
  share_token         text unique not null default substr(md5(gen_random_uuid()::text), 1, 16),
  created_at          timestamptz not null default now()
);

create table if not exists public.contributions (
  id                     uuid primary key default gen_random_uuid(),
  pot_id                 uuid not null references public.pots(id) on delete cascade,
  contributor_name       text not null,
  contributor_email      text not null,
  amount                 numeric(10,2) not null check (amount > 0),
  stripe_payment_intent  text,
  paid_at                timestamptz,
  created_at             timestamptz not null default now()
);

-- Mise à jour automatique de current_amount après chaque contribution confirmée
create or replace function public.update_pot_amount()
returns trigger language plpgsql security definer
as $$
begin
  update public.pots
  set current_amount = (
    select coalesce(sum(amount), 0)
    from public.contributions
    where pot_id = new.pot_id
      and paid_at is not null
  )
  where id = new.pot_id;
  return new;
end;
$$;

drop trigger if exists on_contribution_paid on public.contributions;
create trigger on_contribution_paid
  after insert or update of paid_at on public.contributions
  for each row execute procedure public.update_pot_amount();

create index if not exists pots_creator_id_idx      on public.pots(creator_id);
create index if not exists pots_share_token_idx     on public.pots(share_token);
create index if not exists contributions_pot_id_idx on public.contributions(pot_id);

-- RLS pots
alter table public.pots enable row level security;

drop policy if exists "pots: lecture propre" on public.pots;
create policy "pots: lecture propre"
  on public.pots for select
  using (auth.uid() = creator_id);

drop policy if exists "pots: écriture propre" on public.pots;
create policy "pots: écriture propre"
  on public.pots for insert
  with check (auth.uid() = creator_id);

drop policy if exists "pots: mise à jour propre" on public.pots;
create policy "pots: mise à jour propre"
  on public.pots for update
  using (auth.uid() = creator_id);

-- RLS contributions : lecture publique (via share_token) + insert public
alter table public.contributions enable row level security;

drop policy if exists "contributions: lecture creator" on public.contributions;
create policy "contributions: lecture creator"
  on public.contributions for select
  using (
    exists (
      select 1 from public.pots
      where pots.id = contributions.pot_id
        and pots.creator_id = auth.uid()
    )
  );

drop policy if exists "contributions: insert public" on public.contributions;
create policy "contributions: insert public"
  on public.contributions for insert
  with check (true);  -- Le webhook Stripe insère via service_role
