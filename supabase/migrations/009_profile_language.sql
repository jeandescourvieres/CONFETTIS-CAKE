-- Ajout de la langue utilisateur dans le profil
alter table public.profiles
  add column if not exists language text not null default 'fr'
  check (language in ('fr', 'en', 'de', 'es', 'it', 'ar', 'pt'));
