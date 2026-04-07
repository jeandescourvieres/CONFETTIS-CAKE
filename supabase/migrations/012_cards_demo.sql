-- ════════════════════════════════════════════════════════════
--  012_cards_demo.sql
--  Remplace les donnees placeholder par des URLs fonctionnelles
--  Sources :
--    thumbnails : picsum.photos (stable, gratuit, CORS OK)
--    videos     : Mixkit CDN (libres de droits, .mp4 direct)
--    Lottie     : LottieFiles public CDN (CORS OK)
-- ════════════════════════════════════════════════════════════

-- Vider les donnees placeholder de la migration 011
delete from public.card_templates;
delete from public.card_effects;
delete from public.card_text_styles;
delete from public.card_backgrounds;

-- ── Brique 1 : Fonds MP4 ────────────────────────────────────

insert into public.card_backgrounds
  (title, category, mp4_url, thumbnail_url, dominant_color, loop, duration_ms, tier)
values
  (
    'Confettis Rose',
    'festive',
    'https://assets.mixkit.co/videos/preview/mixkit-colorful-confetti-falling-in-close-up-4511-small.mp4',
    'https://picsum.photos/seed/celebrate/300/533',
    '#FF6B9D',
    true, 5000, 'free'
  ),
  (
    'Ballons Colors',
    'festive',
    'https://assets.mixkit.co/videos/preview/mixkit-colorful-balloons-in-blue-sky-466-small.mp4',
    'https://picsum.photos/seed/balloons/300/533',
    '#9b59b6',
    true, 6000, 'free'
  ),
  (
    'Feux Artifice',
    'festive',
    'https://assets.mixkit.co/videos/preview/mixkit-fireworks-exploding-in-the-night-sky-1268-small.mp4',
    'https://picsum.photos/seed/fireworks/300/533',
    '#fdd34d',
    true, 8000, 'free'
  ),
  (
    'Lumieres Bokeh',
    'abstract',
    'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-small.mp4',
    'https://picsum.photos/seed/bokeh/300/533',
    '#1a1a2e',
    true, 10000, 'free'
  ),
  (
    'Neige Magique',
    'nature',
    'https://assets.mixkit.co/videos/preview/mixkit-snowflakes-falling-outside-a-home-window-4498-small.mp4',
    'https://picsum.photos/seed/snowfall/300/533',
    '#e8f4fd',
    true, 6000, 'pro'
  ),
  (
    'Petales de Rose',
    'romantic',
    'https://assets.mixkit.co/videos/preview/mixkit-pink-flowers-falling-in-slow-motion-24-small.mp4',
    'https://picsum.photos/seed/petals/300/533',
    '#2a0a14',
    true, 5000, 'pro'
  );

-- ── Brique 2 : Effets Lottie ────────────────────────────────

insert into public.card_effects
  (title, effect_type, lottie_url, thumbnail_url, loop, has_name_layer, occasions, tier)
values
  (
    'Confettis Festifs',
    'confetti',
    'https://assets7.lottiefiles.com/packages/lf20_obhph3to.json',
    'https://picsum.photos/seed/confettifx/60/60',
    true, false,
    '{"birthday","newyear","graduation","wedding"}',
    'free'
  ),
  (
    'Ballons Flottants',
    'balloons',
    'https://assets5.lottiefiles.com/packages/lf20_xyuqsqb7.json',
    'https://picsum.photos/seed/balloonsfx/60/60',
    true, false,
    '{"birthday","birth"}',
    'free'
  ),
  (
    'Feux Artifice',
    'fireworks',
    'https://assets2.lottiefiles.com/packages/lf20_xlmz9xwm.json',
    'https://picsum.photos/seed/fireworksfx/60/60',
    true, false,
    '{"newyear","birthday","graduation"}',
    'free'
  ),
  (
    'Neige Douce',
    'snow',
    'https://assets3.lottiefiles.com/packages/lf20_iqzlhhiw.json',
    'https://picsum.photos/seed/snowfx/60/60',
    true, false,
    '{"newyear","universal"}',
    'free'
  ),
  (
    'Coeurs Volants',
    'hearts',
    'https://assets4.lottiefiles.com/packages/lf20_yd2n1htt.json',
    'https://picsum.photos/seed/heartsfx/60/60',
    true, false,
    '{"wedding","thanks"}',
    'pro'
  ),
  (
    'Etincelles',
    'sparkle',
    'https://assets2.lottiefiles.com/packages/lf20_jzsplrsl.json',
    'https://picsum.photos/seed/sparklefx/60/60',
    true, false,
    '{"birthday","wedding","universal"}',
    'pro'
  ),
  (
    'Aucun effet',
    'none',
    '',
    'https://picsum.photos/seed/nofx/60/60',
    false, false,
    '{"universal"}',
    'free'
  );

-- ── Brique 3 : Styles texte ──────────────────────────────────

insert into public.card_text_styles (title, config) values
  (
    'Anniversaire festif',
    '{"position":"center","align":"center","prefix":"Joyeux Anniversaire","suffix":" !","name_size":38,"prefix_size":18,"color":"#ffffff","shadow":true,"animation":"slide_up","animation_delay_ms":800}'
  ),
  (
    'Bas dore',
    '{"position":"bottom","align":"center","prefix":"Pour toi","suffix":" !","name_size":34,"prefix_size":16,"color":"#fdd34d","shadow":true,"animation":"fade_in","animation_delay_ms":600}'
  ),
  (
    'Centre elegant',
    '{"position":"center","align":"center","prefix":"","suffix":"","name_size":44,"prefix_size":0,"color":"#ffffff","shadow":true,"animation":"fade_in","animation_delay_ms":400}'
  ),
  (
    'Haut festif',
    '{"position":"top","align":"left","prefix":"Happy Birthday","suffix":"!","name_size":32,"prefix_size":16,"color":"#ffffff","shadow":true,"animation":"bounce","animation_delay_ms":500}'
  ),
  (
    'Bonne Annee',
    '{"position":"center","align":"center","prefix":"Bonne Annee","suffix":"!","name_size":40,"prefix_size":20,"color":"#fdd34d","shadow":true,"animation":"slide_up","animation_delay_ms":1000}'
  ),
  (
    'Mariage',
    '{"position":"bottom","align":"center","prefix":"Pour","suffix":"et son partenaire","name_size":36,"prefix_size":16,"color":"#fff8f0","shadow":true,"animation":"fade_in","animation_delay_ms":700}'
  );

-- ── Templates : combinaisons curatoriales ───────────────────

-- 1. Anniversaire Confettis
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Anniversaire Confettis', 'birthday', 'joyful',
  b.id, e.id, t.id, 'free', 1,
  'Confettis roses + effet Lottie festif - ideal anniversaire adulte'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Confettis Rose'
  and e.effect_type = 'confetti'
  and t.title = 'Anniversaire festif';

-- 2. Anniversaire Ballons
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Anniversaire Ballons', 'birthday', 'tender',
  b.id, e.id, t.id, 'free', 2,
  'Ballons colores + effet Lottie flottant - doux pour anniversaire enfant'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Ballons Colors'
  and e.effect_type = 'balloons'
  and t.title = 'Bas dore';

-- 3. Anniversaire Elegant
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Anniversaire Elegant', 'birthday', 'elegant',
  b.id, e.id, t.id, 'free', 3,
  'Fond etoile bokeh + texte epure sans effet - sobre pour adulte'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Lumieres Bokeh'
  and e.effect_type = 'none'
  and t.title = 'Centre elegant';

-- 4. Happy Birthday
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Happy Birthday', 'birthday', 'funny',
  b.id, e.id, t.id, 'free', 4,
  'Confettis + texte haut gauche festif style americain'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Confettis Rose'
  and e.effect_type = 'confetti'
  and t.title = 'Haut festif';

-- 5. Nouvel An Feux Artifice
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Nouvel An Feux Artifice', 'newyear', 'epic',
  b.id, e.id, t.id, 'free', 1,
  'Feux artifice explosifs + effet Lottie + texte Bonne Annee dore'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Feux Artifice'
  and e.effect_type = 'fireworks'
  and t.title = 'Bonne Annee';

-- 6. Nouvel An Neige
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Nouvel An Neige', 'newyear', 'tender',
  b.id, e.id, t.id, 'free', 2,
  'Neige tombante + flocons Lottie + texte bas dore - hivernal et doux'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Neige Magique'
  and e.effect_type = 'snow'
  and t.title = 'Bas dore';

-- 7. Mariage Petales
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Mariage Petales', 'wedding', 'romantic',
  b.id, e.id, t.id, 'pro', 1,
  'Petales de rose tombants + coeurs Lottie + texte mariage romantique'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Petales de Rose'
  and e.effect_type = 'hearts'
  and t.title = 'Mariage';

-- 8. Carte Lumieres
insert into public.card_templates
  (title, occasion, mood, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
select
  'Carte Lumieres', 'universal', 'elegant',
  b.id, e.id, t.id, 'free', 1,
  'Fond etoile bokeh minimal sans effet - polyvalent pour toute occasion'
from card_backgrounds b, card_effects e, card_text_styles t
where b.title = 'Lumieres Bokeh'
  and e.effect_type = 'none'
  and t.title = 'Bas dore';
