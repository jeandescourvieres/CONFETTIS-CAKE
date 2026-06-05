-- Cache des courbes INSEE par prénom (partagé entre tous les utilisateurs)
create table if not exists public.insee_prenoms_cache (
  name       text        not null primary key,
  data       jsonb       not null,  -- [{year, count}]
  peak_year  int,
  peak_count int,
  created_at timestamptz not null default now()
);

create policy "insee_prenoms_cache: lecture publique"
  on public.insee_prenoms_cache for select
  using (auth.role() = 'authenticated');

create policy "insee_prenoms_cache: écriture publique"
  on public.insee_prenoms_cache for insert
  with check (auth.role() = 'authenticated');

alter table public.insee_prenoms_cache enable row level security;

notify pgrst, 'reload schema';
