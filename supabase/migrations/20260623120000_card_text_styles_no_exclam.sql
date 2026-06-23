-- ═══════════════════════════════════════════════════════════════
--  Retire le "!" automatique en fin de suffixe des styles de carte
--  (ex: " ans !" -> " ans", " !" -> "", "... en retard !" -> "... en retard")
-- ═══════════════════════════════════════════════════════════════

update card_text_styles
set config = jsonb_set(
  config,
  '{suffix}',
  to_jsonb(regexp_replace(config->>'suffix', '\s*!$', ''))
)
where config->>'suffix' ~ '!$';
