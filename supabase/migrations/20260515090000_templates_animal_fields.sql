-- Ajoute les champs pour les modèles de messages animaux
alter table public.message_templates
  add column if not exists animal_type      text,
  add column if not exists animal_direction text check (animal_direction in ('from', 'to'));

notify pgrst, 'reload schema';
