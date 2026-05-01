-- ═══════════════════════════════════════════════
--  036 — Couleur préférée du contact
-- ═══════════════════════════════════════════════

alter table contacts
  add column if not exists favourite_color text;
