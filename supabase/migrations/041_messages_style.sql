-- Migration 041 — Style visuel des messages (fond animé + police)
-- Ajoute bg_theme, font_style, font_size, is_italic à la table messages

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS bg_theme   TEXT    NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS font_style TEXT    NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS font_size  TEXT    NOT NULL DEFAULT 'md',
  ADD COLUMN IF NOT EXISTS is_italic  BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN messages.bg_theme   IS 'Fond animé choisi : none|auto|birthday|petales|flocons|coeurs|etoiles';
COMMENT ON COLUMN messages.font_style IS 'Police : standard|caveat_bold|dancing|satisfy|patrick|pacifico|special_elite|bangers';
COMMENT ON COLUMN messages.font_size  IS 'Taille : sm|md|lg';
COMMENT ON COLUMN messages.is_italic  IS 'Italique activé';
