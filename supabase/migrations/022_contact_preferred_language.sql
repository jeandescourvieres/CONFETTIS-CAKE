-- Migration 022 — Langue préférée du destinataire
alter table public.contacts
  add column if not exists preferred_language text; -- ex: 'fr', 'en', 'de', 'es', 'it', 'pt', 'ar'
