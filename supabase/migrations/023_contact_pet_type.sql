-- Migration 023 : type d'animal (chien, chat, lapin, oiseau, autre)
alter table contacts
  add column if not exists pet_type text check (pet_type in ('chien', 'chat', 'lapin', 'oiseau', 'autre'));
