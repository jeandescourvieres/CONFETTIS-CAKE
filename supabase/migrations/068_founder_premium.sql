-- ═══════════════════════════════════════════════════════════════
--  068 — Compte fondateur en premium avec crédits illimités
-- ═══════════════════════════════════════════════════════════════

UPDATE profiles
SET credits = 9999,
    plan    = 'premium'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'jeandescourvieres@gmail.com'
  LIMIT 1
);
