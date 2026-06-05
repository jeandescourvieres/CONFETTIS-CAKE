-- Cache partagé des significations de prénoms et noms de famille
-- Évite les appels répétés à Mistral pour le même prénom
-- Partagé entre tous les utilisateurs de l'app

create table if not exists public.name_meanings_cache (
  name        text        not null,
  type        text        not null check (type in ('prénom', 'nom')),
  meaning     text        not null,
  created_at  timestamptz not null default now(),
  primary key (name, type)
);

-- Lecture pour tous les utilisateurs connectés
create policy "name_meanings_cache: lecture publique"
  on public.name_meanings_cache for select
  using (auth.role() = 'authenticated');

-- Écriture pour tous les utilisateurs connectés
create policy "name_meanings_cache: écriture publique"
  on public.name_meanings_cache for insert
  with check (auth.role() = 'authenticated');

alter table public.name_meanings_cache enable row level security;

notify pgrst, 'reload schema';
