-- ════════════════════════════════════════════════════════════
--  013_cards_modes.sql
--  Ajout du mode dynamique aux cartes animees :
--    'name'     → prenom du destinataire (comportement actuel)
--    'age'      → chiffre de l'age anime dynamiquement
--    'age_name' → chiffre + prenom animes ensemble
-- ════════════════════════════════════════════════════════════

-- Colonne mode sur card_templates
alter table public.card_templates
  add column if not exists mode text not null default 'name'
  check (mode in ('name', 'age', 'age_name'));

create index if not exists card_templates_mode on public.card_templates(mode, active);

-- Deux nouveaux styles texte pour les modes age
-- name_size = taille du chiffre d'age
-- prefix_size = taille du prenom (en mode age_name) ou du libelle
insert into public.card_text_styles (title, config) values
  (
    'Age grand bounce',
    '{"position":"center","align":"center","prefix":"","suffix":" ans","name_size":88,"prefix_size":22,"color":"#ffffff","shadow":true,"animation":"bounce","animation_delay_ms":300}'
  ),
  (
    'Age et prenom slide',
    '{"position":"center","align":"center","prefix":"","suffix":" ans","name_size":76,"prefix_size":28,"color":"#ffffff","shadow":true,"animation":"slide_up","animation_delay_ms":300}'
  );

-- ── Templates mode 'age' ─────────────────────────────────────

insert into public.card_templates
  (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Anniversaire Age Confettis', 'birthday', 'joyful', 'age',
  b.id, e.id, t.id, 'free', 10,
  'Age en grand + confettis Lottie - chiffre genere dynamiquement pour tout anniversaire'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Confettis Rose'
  and e.effect_type = 'confetti'
  and t.title = 'Age grand bounce';

insert into public.card_templates
  (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Anniversaire Age Ballons', 'birthday', 'tender', 'age',
  b.id, e.id, t.id, 'free', 11,
  'Age en grand + ballons flottants - doux pour anniversaire enfant ou adulte'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Ballons Colors'
  and e.effect_type = 'balloons'
  and t.title = 'Age grand bounce';

insert into public.card_templates
  (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Anniversaire Age Feux', 'birthday', 'epic', 'age',
  b.id, e.id, t.id, 'free', 12,
  'Age en grand + feux artifice - spectaculaire pour 30 40 50 60 ans'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Feux Artifice'
  and e.effect_type = 'fireworks'
  and t.title = 'Age grand bounce';

-- ── Templates mode 'age_name' ────────────────────────────────

insert into public.card_templates
  (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Age et Prenom Confettis', 'birthday', 'joyful', 'age_name',
  b.id, e.id, t.id, 'free', 20,
  'Age + prenom animes ensemble - carte combinee festive pour anniversaire'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Confettis Rose'
  and e.effect_type = 'confetti'
  and t.title = 'Age et prenom slide';

insert into public.card_templates
  (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Age et Prenom Bokeh', 'birthday', 'elegant', 'age_name',
  b.id, e.id, t.id, 'free', 21,
  'Age + prenom sur fond etoile bokeh - sobre et elegant pour anniversaire adulte'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Lumieres Bokeh'
  and e.effect_type = 'none'
  and t.title = 'Age et prenom slide';
