-- Préférence de signature virale sur les messages partagés
-- Les membres Premium peuvent la désactiver
alter table public.profiles
  add column if not exists show_signature boolean not null default true;
