-- ═══════════════════════════════════════════════
--  015 — Ajout de contact_name dans messages
-- ═══════════════════════════════════════════════

alter table public.messages
  add column if not exists contact_name text,
  alter column contact_id drop not null;
