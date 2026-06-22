-- ═══════════════════════════════════════════════════════════════
--  20260622 — Essai gratuit Premium 1 mois
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles
  add column if not exists trial_ends_at timestamptz;

-- Les nouveaux inscrits démarrent directement en Premium avec 1 mois d'essai
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, plan, trial_ends_at)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'premium',
    now() + interval '1 month'
  );
  return new;
end;
$$;

-- Comptes free existants : on leur offre aussi le mois d'essai
update public.profiles
set plan = 'premium',
    trial_ends_at = now() + interval '1 month'
where plan = 'free';

-- Repasse en free chaque jour les essais arrivés à échéance
create extension if not exists pg_cron;

select cron.unschedule('expire-premium-trials') where exists (
  select 1 from cron.job where jobname = 'expire-premium-trials'
);

select cron.schedule(
  'expire-premium-trials',
  '0 1 * * *',
  $$
  update public.profiles
  set plan = 'free'
  where plan = 'premium'
    and trial_ends_at is not null
    and trial_ends_at < now();
  $$
);
