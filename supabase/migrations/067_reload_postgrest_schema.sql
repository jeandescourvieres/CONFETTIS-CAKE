-- ═══════════════════════════════════════════════════════════════
--  067 — Force le rechargement du cache de schéma PostgREST
--  Nécessaire après ajout de colonnes (favourite_color, civilite,
--  pet_gender, etc.) non encore visibles par l'API REST.
-- ═══════════════════════════════════════════════════════════════

NOTIFY pgrst, 'reload schema';
