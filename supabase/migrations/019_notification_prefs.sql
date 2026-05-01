-- Préférences de notifications sur les profils
alter table profiles
  add column if not exists notif_birthday boolean not null default true,
  add column if not exists notif_nameday  boolean not null default true,
  add column if not exists notif_pot      boolean not null default true;
