-- Migration: gender, milestones d'âge, occasions quotidiennes

-- ── 1. Gender column ──────────────────────────────────────────────────────────
ALTER TABLE card_templates
  ADD COLUMN IF NOT EXISTS gender text DEFAULT 'neutral'
  CHECK (gender IN ('neutral', 'female', 'male', 'child'));

-- ── 2. Update existing templates — set gender where relevant ─────────────────
UPDATE card_templates SET gender = 'female'
WHERE title ILIKE '%Fleur%' OR title ILIKE '%Rose%' OR title ILIKE '%Petale%'
   OR title ILIKE '%Coeur%' OR title ILIKE '%Valentin%' OR title ILIKE '%Mere%';

-- ── 3. New video backgrounds ──────────────────────────────────────────────────
INSERT INTO card_backgrounds (id, title, category, mp4_url, thumbnail_url, duration_ms, loop, dominant_color, tier) VALUES
  (gen_random_uuid(), 'Confettis Retard', 'birthday_late',
   'https://assets.mixkit.co/videos/preview/mixkit-colorful-confetti-pieces-on-a-dark-table-5213-small.mp4',
   'https://picsum.photos/seed/retard/400/600', 8000, true, '#FF6B35', 'free'),
  (gen_random_uuid(), 'Coucher Soleil', 'quotidien',
   'https://assets.mixkit.co/videos/preview/mixkit-landscape-sunset-filmed-in-super-slow-motion-11-small.mp4',
   'https://picsum.photos/seed/weekend/400/600', 10000, true, '#FF8C42', 'free'),
  (gen_random_uuid(), 'Aurore Doree', 'quotidien',
   'https://assets.mixkit.co/videos/preview/mixkit-golden-light-shining-in-a-forest-2208-small.mp4',
   'https://picsum.photos/seed/courage/400/600', 8000, true, '#F4A261', 'free'),
  (gen_random_uuid(), 'Ballons Arc-en-ciel', 'birthday',
   'https://assets.mixkit.co/videos/preview/mixkit-colourful-sparklers-lit-in-party-219-small.mp4',
   'https://picsum.photos/seed/childbirthday/400/600', 8000, true, '#E040FB', 'free'),
  (gen_random_uuid(), 'Explosion Or', 'birthday',
   'https://assets.mixkit.co/videos/preview/mixkit-golden-fireworks-1953-small.mp4',
   'https://picsum.photos/seed/malebirthday/400/600', 6000, true, '#FFB300', 'free');

-- ── 4. New Lottie effects ─────────────────────────────────────────────────────
INSERT INTO card_effects (id, title, effect_type, lottie_url, thumbnail_url, loop, has_name_layer, name_layer_id, occasions, tier) VALUES
  (gen_random_uuid(), 'Confettis Colores', 'lottie',
   'https://assets9.lottiefiles.com/packages/lf20_touohxv0.json',
   'https://picsum.photos/seed/confcol/80/80', true, false, null, ARRAY['birthday_late','birthday'], 'free'),
  (gen_random_uuid(), 'Rayons Soleil', 'lottie',
   'https://assets1.lottiefiles.com/packages/lf20_jjwkk5qa.json',
   'https://picsum.photos/seed/soleil/80/80', true, false, null, ARRAY['weekend','universal'], 'free'),
  (gen_random_uuid(), 'Etoiles Filantes', 'lottie',
   'https://assets3.lottiefiles.com/packages/lf20_hy4txm7l.json',
   'https://picsum.photos/seed/etoilesfil/80/80', true, false, null, ARRAY['courage','universal'], 'free');

-- ── 5. New text styles ────────────────────────────────────────────────────────
INSERT INTO card_text_styles (id, title, config) VALUES
  (gen_random_uuid(), 'Milestone Or', jsonb_build_object(
    'position','center','align','center','prefix','Enfin','suffix',' ans !',
    'name_size',110,'prefix_size',34,'color','#FFD700','shadow',true,
    'animation','bounce','animation_delay_ms',200)),
  (gen_random_uuid(), 'Milestone Blanc', jsonb_build_object(
    'position','center','align','center','prefix','Enfin','suffix',' ans !',
    'name_size',110,'prefix_size',34,'color','#FFFFFF','shadow',true,
    'animation','bounce','animation_delay_ms',200)),
  (gen_random_uuid(), 'Milestone Rose', jsonb_build_object(
    'position','center','align','center','prefix','Enfin','suffix',' ans !',
    'name_size',100,'prefix_size',30,'color','#FFB3C6','shadow',true,
    'animation','bounce','animation_delay_ms',200)),
  (gen_random_uuid(), 'Quotidien Doux', jsonb_build_object(
    'position','center','align','center','prefix','','suffix','',
    'name_size',40,'prefix_size',22,'color','#FFFFFF','shadow',true,
    'animation','fade_in','animation_delay_ms',400)),
  (gen_random_uuid(), 'Retard Fun', jsonb_build_object(
    'position','center','align','center','prefix','Joyeux anniv','suffix','... en retard !',
    'name_size',52,'prefix_size',26,'color','#FFFFFF','shadow',true,
    'animation','bounce','animation_delay_ms',300)),
  (gen_random_uuid(), 'Enfant Festif', jsonb_build_object(
    'position','center','align','center','prefix','Bon anniversaire','suffix',' !',
    'name_size',58,'prefix_size',24,'color','#FFE082','shadow',true,
    'animation','bounce','animation_delay_ms',200));

-- ── 6. New templates ──────────────────────────────────────────────────────────

-- MILESTONES (mode=age_name)
INSERT INTO card_templates (id,title,occasion,mood,mode,gender,tier,tags,sort_order,background_id,effect_id,text_style_id,active,ai_description) VALUES

  (gen_random_uuid(),'Enfin 18 ans !','birthday','joyful','age_name','neutral','free',
   ARRAY['18ans','milestone','age'],200,
   (SELECT id FROM card_backgrounds WHERE title='Confettis Rose'    LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Confettis Festifs' LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Milestone Or'      LIMIT 1),
   true,'Milestone 18 ans confettis or'),

  (gen_random_uuid(),'20 ans et des etoiles','birthday','joyful','age_name','neutral','free',
   ARRAY['20ans','milestone','age'],201,
   (SELECT id FROM card_backgrounds WHERE title='Etoiles Nuit'      LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Etoiles Dorees'    LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Milestone Blanc'   LIMIT 1),
   true,'Milestone 20 ans etoiles'),

  (gen_random_uuid(),'Les magnifiques 30 ans','birthday','elegant','age_name','neutral','free',
   ARRAY['30ans','milestone','age'],202,
   (SELECT id FROM card_backgrounds WHERE title='Lumieres Bokeh'    LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Confettis Or'      LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Milestone Or'      LIMIT 1),
   true,'Milestone 30 ans bokeh elegant'),

  (gen_random_uuid(),'Enfin 40 ans !','birthday','funny','age_name','neutral','free',
   ARRAY['40ans','milestone','age'],203,
   (SELECT id FROM card_backgrounds WHERE title='Feux Artifice'     LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Feux Artifice'     LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Milestone Blanc'   LIMIT 1),
   true,'Milestone 40 ans feux humor'),

  (gen_random_uuid(),'Splendides 50 ans','birthday','elegant','age_name','neutral','free',
   ARRAY['50ans','milestone','age'],204,
   (SELECT id FROM card_backgrounds WHERE title='Confettis Or'      LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Confettis Or'      LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Milestone Or'      LIMIT 1),
   true,'Milestone 50 ans confettis or'),

  (gen_random_uuid(),'Magnifiques 60 ans','birthday','tender','age_name','neutral','free',
   ARRAY['60ans','milestone','age'],205,
   (SELECT id FROM card_backgrounds WHERE title='Fleurs Roses'      LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Fleurs Tombantes'  LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Milestone Rose'    LIMIT 1),
   true,'Milestone 60 ans fleurs tender'),

-- EN RETARD
  (gen_random_uuid(),'Anniv en retard !','birthday_late','funny','name','neutral','free',
   ARRAY['retard','fun'],300,
   (SELECT id FROM card_backgrounds WHERE title='Confettis Retard'  LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Confettis Colores' LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Retard Fun'        LIMIT 1),
   true,'Anniversaire en retard humoristique'),

  (gen_random_uuid(),'Mieux vaut tard...','birthday_late','tender','name','neutral','free',
   ARRAY['retard','sincere'],301,
   (SELECT id FROM card_backgrounds WHERE title='Lumieres Chaleureuses' LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Confettis Festifs'     LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Fete Prenom Rose'      LIMIT 1),
   true,'Anniversaire en retard sincere'),

-- WEEKEND
  (gen_random_uuid(),'Bon weekend ensoleille !','weekend','joyful','name','neutral','free',
   ARRAY['weekend','soleil'],400,
   (SELECT id FROM card_backgrounds WHERE title='Coucher Soleil'   LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Rayons Soleil'    LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Quotidien Doux'   LIMIT 1),
   true,'Bon weekend coucher de soleil'),

  (gen_random_uuid(),'Profite de ton weekend !','weekend','tender','name','neutral','free',
   ARRAY['weekend','zen'],401,
   (SELECT id FROM card_backgrounds WHERE title='Lumieres Chaleureuses' LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Fleurs Tombantes'      LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Quotidien Doux'        LIMIT 1),
   true,'Bon weekend zen'),

-- COURAGE
  (gen_random_uuid(),'Tu vas y arriver !','courage','epic','name','neutral','free',
   ARRAY['courage','motivation'],500,
   (SELECT id FROM card_backgrounds WHERE title='Aurore Doree'     LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Etoiles Filantes' LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Diplome Or'       LIMIT 1),
   true,'Bon courage motivant aurore'),

  (gen_random_uuid(),'Je pense a toi','courage','tender','name','neutral','free',
   ARRAY['courage','soutien'],501,
   (SELECT id FROM card_backgrounds WHERE title='Lumieres Bokeh'   LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Etoiles Dorees'   LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Soutien Doux'     LIMIT 1),
   true,'Bon courage doux bienveillant'),

-- ANNIVERSAIRE FEMININ
  (gen_random_uuid(),'Anniversaire pour Elle','birthday','tender','name','female','free',
   ARRAY['femme','fleurs'],150,
   (SELECT id FROM card_backgrounds WHERE title='Fleurs Roses'     LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Fleurs Tombantes' LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Fete Prenom Rose' LIMIT 1),
   true,'Anniversaire feminin floral'),

  (gen_random_uuid(),'Elegance pour Elle','birthday','elegant','name','female','free',
   ARRAY['femme','elegant'],151,
   (SELECT id FROM card_backgrounds WHERE title='Coeurs Roses'     LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Coeurs Flottants' LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Saint Valentin'   LIMIT 1),
   true,'Anniversaire feminin elegant coeurs'),

-- ANNIVERSAIRE MASCULIN
  (gen_random_uuid(),'Anniversaire pour Lui','birthday','epic','name','male','free',
   ARRAY['homme','feux'],160,
   (SELECT id FROM card_backgrounds WHERE title='Explosion Or'     LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Confettis Or'     LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Diplome Or'       LIMIT 1),
   true,'Anniversaire masculin epique or'),

  (gen_random_uuid(),'Gros anniv pour Lui !','birthday','joyful','name','male','free',
   ARRAY['homme','fun'],161,
   (SELECT id FROM card_backgrounds WHERE title='Feux Artifice'    LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Feux Artifice'    LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Age grand bounce' LIMIT 1),
   true,'Anniversaire masculin joyeux feux'),

-- ANNIVERSAIRE ENFANT
  (gen_random_uuid(),'Super anniversaire petit(e) !','birthday','joyful','name','child','free',
   ARRAY['enfant','couleurs'],170,
   (SELECT id FROM card_backgrounds WHERE title='Ballons Arc-en-ciel' LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Ballons Flottants'   LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Enfant Festif'       LIMIT 1),
   true,'Anniversaire enfant colore festif'),

  (gen_random_uuid(),'Ton grand jour est la !','birthday','tender','name','child','free',
   ARRAY['enfant','cadeau'],171,
   (SELECT id FROM card_backgrounds WHERE title='Ballons Colors'      LIMIT 1),
   (SELECT id FROM card_effects     WHERE title='Confettis Festifs'   LIMIT 1),
   (SELECT id FROM card_text_styles WHERE title='Age et prenom slide' LIMIT 1),
   true,'Anniversaire enfant doux cadeau');

-- ── 7. PostgREST reload ───────────────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';
