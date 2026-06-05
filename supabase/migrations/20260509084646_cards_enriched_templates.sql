-- ════════════════════════════════════════════════════════════
--  cards_enriched_templates
--  Nouveaux fonds, effets et templates pour toutes les occasions
--  Moods : joyful | tender | elegant | funny | epic | romantic
-- ════════════════════════════════════════════════════════════

-- ── Nouveaux fonds vidéo ─────────────────────────────────────

INSERT INTO public.card_backgrounds
  (title, category, mp4_url, thumbnail_url, dominant_color, loop, duration_ms, tier)
VALUES
  ('Fleurs Roses','nature','https://assets.mixkit.co/videos/preview/mixkit-pink-flowers-falling-in-slow-motion-24-small.mp4','https://picsum.photos/seed/flowers/300/533','#FFB7C5',true,6000,'free'),
  ('Etoiles Nuit','abstract','https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-small.mp4','https://picsum.photos/seed/stars2/300/533','#0D0D2B',true,10000,'free'),
  ('Lumieres Chaleureuses','abstract','https://assets.mixkit.co/videos/preview/mixkit-glowing-bokeh-lights-loop-1228-small.mp4','https://picsum.photos/seed/warmlight/300/533','#F4A261',true,8000,'free'),
  ('Neige Noel','nature','https://assets.mixkit.co/videos/preview/mixkit-snowflakes-falling-outside-a-home-window-4498-small.mp4','https://picsum.photos/seed/christmas/300/533','#C8E6F9',true,6000,'free'),
  ('Coeurs Roses','romantic','https://assets.mixkit.co/videos/preview/mixkit-heart-shaped-confetti-in-slow-motion-7992-small.mp4','https://picsum.photos/seed/hearts/300/533','#FF69B4',true,5000,'free'),
  ('Confettis Or','festive','https://assets.mixkit.co/videos/preview/mixkit-colorful-confetti-falling-in-close-up-4511-small.mp4','https://picsum.photos/seed/goldconf/300/533','#FFD700',true,6000,'free'),
  ('Halloween Sombre','dark','https://assets.mixkit.co/videos/preview/mixkit-dark-forest-with-fog-at-night-1735-small.mp4','https://picsum.photos/seed/halloween/300/533','#1A0A00',true,8000,'free'),
  ('Diplome Dore','festive','https://assets.mixkit.co/videos/preview/mixkit-golden-confetti-glitter-falling-on-black-48769-small.mp4','https://picsum.photos/seed/diploma/300/533','#BFA100',true,7000,'free');

-- ── Nouveaux effets Lottie ────────────────────────────────────

INSERT INTO public.card_effects
  (title, effect_type, lottie_url, thumbnail_url, loop, has_name_layer, occasions, tier)
VALUES
  ('Fleurs Tombantes','flowers','https://assets10.lottiefiles.com/packages/lf20_O6eHsSwLW2.json','https://picsum.photos/seed/flowersfx/60/60',true,false,'{"nameday","mothersday","wedding","valentines"}','free'),
  ('Etoiles Dorees','stars','https://assets3.lottiefiles.com/packages/lf20_qm8eqzse.json','https://picsum.photos/seed/starsfx/60/60',true,false,'{"graduation","promotion","universal"}','free'),
  ('Flocons Noel','snowflakes','https://assets9.lottiefiles.com/packages/lf20_ak9n8s8y.json','https://picsum.photos/seed/xmasfx/60/60',true,false,'{"christmas","newyear"}','free'),
  ('Coeurs Flottants','hearts_float','https://assets5.lottiefiles.com/packages/lf20_yd2n1htt.json','https://picsum.photos/seed/heartsfloat/60/60',true,false,'{"valentines","wedding","mothersday"}','free'),
  ('Fantomes Halloween','ghosts','https://assets2.lottiefiles.com/packages/lf20_9uqj8q7g.json','https://picsum.photos/seed/ghostsfx/60/60',true,false,'{"halloween"}','free'),
  ('Confettis Or','confetti_gold','https://assets4.lottiefiles.com/packages/lf20_jzsplrsl.json','https://picsum.photos/seed/goldconfx/60/60',true,false,'{"graduation","promotion","newyear","wedding"}','free');

-- ── Nouveaux styles texte ─────────────────────────────────────

INSERT INTO public.card_text_styles (title, config) VALUES
  ('Fete Prenom Rose','{"position":"center","align":"center","prefix":"Bonne Fête","suffix":" !","name_size":40,"prefix_size":18,"color":"#FFB7C5","shadow":true,"animation":"fade_in","animation_delay_ms":600}'),
  ('Noel Blanc','{"position":"center","align":"center","prefix":"Joyeux Noël","suffix":" !","name_size":36,"prefix_size":20,"color":"#ffffff","shadow":true,"animation":"slide_up","animation_delay_ms":800}'),
  ('Saint Valentin','{"position":"center","align":"center","prefix":"Pour toi","suffix":" ❤️","name_size":42,"prefix_size":18,"color":"#FF69B4","shadow":true,"animation":"fade_in","animation_delay_ms":500}'),
  ('Diplome Or','{"position":"center","align":"center","prefix":"Félicitations","suffix":" !","name_size":38,"prefix_size":20,"color":"#FFD700","shadow":true,"animation":"slide_up","animation_delay_ms":700}'),
  ('Soutien Doux','{"position":"center","align":"center","prefix":"Pour toi","suffix":"","name_size":42,"prefix_size":18,"color":"#ffffff","shadow":true,"animation":"fade_in","animation_delay_ms":400}'),
  ('Halloween Orange','{"position":"top","align":"center","prefix":"Happy Halloween","suffix":" 🎃","name_size":34,"prefix_size":18,"color":"#FF6600","shadow":true,"animation":"bounce","animation_delay_ms":600}'),
  ('Naissance Pastel','{"position":"center","align":"center","prefix":"Bienvenue","suffix":" 👶","name_size":40,"prefix_size":18,"color":"#ffffff","shadow":true,"animation":"fade_in","animation_delay_ms":600}'),
  ('Mariage Blanc','{"position":"bottom","align":"center","prefix":"Félicitations","suffix":"","name_size":38,"prefix_size":18,"color":"#ffffff","shadow":true,"animation":"fade_in","animation_delay_ms":800}');

-- ── Templates — Fête de prénom ───────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Fête Fleurs Tender','nameday','tender','name',b.id,e.id,t.id,'free',1,'Fleurs tombantes doux pour la fête du prénom'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Fleurs Roses' AND e.effect_type='flowers' AND t.title='Fete Prenom Rose';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Fête Bokeh Elegant','nameday','elegant','name',b.id,e.id,t.id,'free',2,'Fond bokeh étoilé élégant pour la fête'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Bokeh' AND e.effect_type='none' AND t.title='Centre elegant';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Fête Confettis Joyful','nameday','joyful','name',b.id,e.id,t.id,'free',3,'Confettis festifs pour la fête'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Confettis Rose' AND e.effect_type='confetti' AND t.title='Fete Prenom Rose';

-- ── Templates — Naissance ────────────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Naissance Ballons Tender','birth','tender','name',b.id,e.id,t.id,'free',1,'Ballons doux pour annoncer une naissance'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Ballons Colors' AND e.effect_type='balloons' AND t.title='Naissance Pastel';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Naissance Fleurs','birth','tender','name',b.id,e.id,t.id,'free',2,'Fleurs tendres pour la naissance'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Fleurs Roses' AND e.effect_type='flowers' AND t.title='Naissance Pastel';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Naissance Etoilee','birth','elegant','name',b.id,e.id,t.id,'free',3,'Fond étoilé élégant pour la naissance'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Etoiles Nuit' AND e.effect_type='none' AND t.title='Naissance Pastel';

-- ── Templates — Mariage ──────────────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Mariage Petales Romantic','wedding','romantic','name',b.id,e.id,t.id,'free',2,'Pétales + coeurs romantique pour le mariage'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Petales de Rose' AND e.effect_type='hearts_float' AND t.title='Mariage Blanc';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Mariage Bokeh Elegant','wedding','elegant','name',b.id,e.id,t.id,'free',3,'Bokeh + or élégant pour le mariage'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Bokeh' AND e.effect_type='confetti_gold' AND t.title='Mariage Blanc';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Mariage Festif','wedding','joyful','name',b.id,e.id,t.id,'free',4,'Confettis festifs pour le mariage'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Confettis Rose' AND e.effect_type='confetti' AND t.title='Mariage Blanc';

-- ── Templates — Saint-Valentin ───────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Valentin Coeurs Romantic','valentines','romantic','name',b.id,e.id,t.id,'free',1,'Fond coeurs + coeurs flottants romantique'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Coeurs Roses' AND e.effect_type='hearts_float' AND t.title='Saint Valentin';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Valentin Petales Tender','valentines','tender','name',b.id,e.id,t.id,'free',2,'Pétales tendre pour la Saint-Valentin'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Petales de Rose' AND e.effect_type='flowers' AND t.title='Saint Valentin';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Valentin Bokeh Elegant','valentines','elegant','name',b.id,e.id,t.id,'free',3,'Fond étoilé élégant pour la Saint-Valentin'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Etoiles Nuit' AND e.effect_type='none' AND t.title='Saint Valentin';

-- ── Templates — Noël ─────────────────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Noel Neige Tender','christmas','tender','name',b.id,e.id,t.id,'free',1,'Neige douce + flocons tendre pour Noël'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Neige Noel' AND e.effect_type='snowflakes' AND t.title='Noel Blanc';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Noel Confettis Joyful','christmas','joyful','name',b.id,e.id,t.id,'free',2,'Confettis festifs joyeux pour Noël'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Confettis Rose' AND e.effect_type='confetti' AND t.title='Noel Blanc';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Noel Bokeh Elegant','christmas','elegant','name',b.id,e.id,t.id,'free',3,'Lumières + flocons élégant pour Noël'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Chaleureuses' AND e.effect_type='snowflakes' AND t.title='Noel Blanc';

-- ── Templates — Diplôme ──────────────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Diplome Or Epic','graduation','epic','name',b.id,e.id,t.id,'free',1,'Particules dorées spectaculaire pour un diplôme'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Diplome Dore' AND e.effect_type='confetti_gold' AND t.title='Diplome Or';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Diplome Feux Joyful','graduation','joyful','name',b.id,e.id,t.id,'free',2,'Feux dartifice joyeux pour un diplôme'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Feux Artifice' AND e.effect_type='fireworks' AND t.title='Diplome Or';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Diplome Bokeh Elegant','graduation','elegant','name',b.id,e.id,t.id,'free',3,'Bokeh + étoiles élégant pour un diplôme'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Bokeh' AND e.effect_type='stars' AND t.title='Diplome Or';

-- ── Templates — Halloween ────────────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Halloween Funny','halloween','funny','name',b.id,e.id,t.id,'free',1,'Fond sombre + fantômes amusant pour Halloween'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Halloween Sombre' AND e.effect_type='ghosts' AND t.title='Halloween Orange';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Halloween Epic','halloween','epic','name',b.id,e.id,t.id,'free',2,'Fond sombre épique pour Halloween'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Halloween Sombre' AND e.effect_type='none' AND t.title='Halloween Orange';

-- ── Templates — Soutien ──────────────────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Soutien Fleurs Tender','support','tender','name',b.id,e.id,t.id,'free',1,'Fleurs douces + fond apaisant soutien tendre'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Fleurs Roses' AND e.effect_type='flowers' AND t.title='Soutien Doux';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Soutien Lumieres','support','elegant','name',b.id,e.id,t.id,'free',2,'Lumières chaudes réconfortantes pour le soutien'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Chaleureuses' AND e.effect_type='none' AND t.title='Soutien Doux';

-- ── Templates — Fête des mères/pères ────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Fete Meres Fleurs','mothersday','tender','name',b.id,e.id,t.id,'free',1,'Fleurs roses + coeurs tendre fête des mères'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Fleurs Roses' AND e.effect_type='hearts_float' AND t.title='Fete Prenom Rose';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Fete Meres Elegant','mothersday','elegant','name',b.id,e.id,t.id,'free',2,'Bokeh + fleurs élégant fête des mères'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Bokeh' AND e.effect_type='flowers' AND t.title='Centre elegant';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Fete Peres Confettis','fathersday','joyful','name',b.id,e.id,t.id,'free',1,'Confettis or joyeux fête des pères'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Confettis Or' AND e.effect_type='confetti_gold' AND t.title='Diplome Or';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Fete Peres Bokeh','fathersday','elegant','name',b.id,e.id,t.id,'free',2,'Bokeh épuré sobre fête des pères'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Bokeh' AND e.effect_type='none' AND t.title='Centre elegant';

-- ── Templates — Promotion/Retraite ───────────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Promotion Or Epic','promotion','epic','name',b.id,e.id,t.id,'free',1,'Or + étoiles spectaculaire pour une promotion'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Diplome Dore' AND e.effect_type='stars' AND t.title='Diplome Or';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Promotion Confettis Joyful','promotion','joyful','name',b.id,e.id,t.id,'free',2,'Confettis festifs pour une promotion'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Confettis Rose' AND e.effect_type='confetti' AND t.title='Bas dore';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Retraite Lumieres Tender','retirement','tender','name',b.id,e.id,t.id,'free',1,'Lumières chaudes pour le départ en retraite'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Lumieres Chaleureuses' AND e.effect_type='none' AND t.title='Bas dore';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Retraite Confettis Joyful','retirement','joyful','name',b.id,e.id,t.id,'free',2,'Confettis festifs pour la retraite'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Confettis Rose' AND e.effect_type='confetti' AND t.title='Bas dore';

-- ── Templates — Universel supplémentaires ────────────────────

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Universel Fleurs Tender','universal','tender','name',b.id,e.id,t.id,'free',2,'Fleurs douces universel tendre'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Fleurs Roses' AND e.effect_type='flowers' AND t.title='Centre elegant';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Universel Romantic','universal','romantic','name',b.id,e.id,t.id,'free',3,'Coeurs roses universel romantique'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Coeurs Roses' AND e.effect_type='hearts_float' AND t.title='Centre elegant';

INSERT INTO public.card_templates (title, occasion, mood, mode, background_id, effect_id, text_style_id, tier, sort_order, ai_description)
SELECT 'Universel Epic','universal','epic','name',b.id,e.id,t.id,'free',4,'Feux dartifice spectaculaire universel'
FROM card_backgrounds b,card_effects e,card_text_styles t
WHERE b.title='Feux Artifice' AND e.effect_type='fireworks' AND t.title='Bas dore';
