-- Ajout colonne occasion sur message_templates
-- Permet de filtrer les modèles selon l'occasion en cours (birthday, nameday, etc.)

ALTER TABLE message_templates
  ADD COLUMN IF NOT EXISTS occasion text NOT NULL DEFAULT 'birthday';

-- Mettre à jour les 10 modèles système existants → anniversary
UPDATE message_templates
  SET occasion = 'birthday'
  WHERE is_system = true AND occasion = 'birthday';

-- Insérer 10 modèles système pour les fêtes de prénoms
INSERT INTO message_templates (user_id, title, content, tone, is_system, occasion) VALUES
  (NULL, '🌸 Festif',           'Bonne fête {prenom} ! 🌸 Que cette journée qui t''est dédiée soit remplie de joie et de douceur. Je pense à toi !', 'festif', true, 'nameday'),
  (NULL, '😄 Humoristique',     'Bonne fête {prenom} ! 😄 Une journée dans l''année où tout le monde pense à toi... profites-en, ça ne dure que 24h !', 'humorous', true, 'nameday'),
  (NULL, '🥹 Touchant',         'C''est ta fête aujourd''hui, {prenom}. Je voulais juste te dire que ton prénom me rappelle toujours à toi. Belle journée, du fond du cœur. 💜', 'touching', true, 'nameday'),
  (NULL, '🌸 Poétique',         'En ce jour dédié à ton prénom, {prenom}, je t''envoie tout mon affection et mes vœux les plus sincères. Que ta journée soit aussi lumineuse que tu l''es. 🌸', 'poetic', true, 'nameday'),
  (NULL, '⚡ Court & Percutant', 'BONNE FÊTE {prenom} ! 🎊 Ta journée, tes règles — profite !', 'short', true, 'nameday'),
  (NULL, '🙏 Simple & Sincère', 'Bonne fête {prenom}. Je pense à toi en ce jour particulier et te souhaite une belle journée entourée des personnes qui t''aiment.', 'sincere', true, 'nameday'),
  (NULL, '🎵 Musical',          '🎵 Bonne fête à toi, bonne fête à toi, bonne fête {prenom}... tu mérites cette attention ! Belle journée ! 🌸', 'musical', true, 'nameday'),
  (NULL, '💼 Pro & Discret',    'Bonjour {prenom}, je vous souhaite une très bonne fête et une agréable journée.', 'pro', true, 'nameday'),
  (NULL, '🌟 Inspirant',        'Bonne fête {prenom} ! 🌟 Ton prénom porte une histoire unique — que cette journée te rappelle combien tu es précieux·se.', 'inspiring', true, 'nameday'),
  (NULL, '🤗 Chaleureux',       'Coucou {prenom} ! 🤗 Je voulais être parmi les premiers à te souhaiter une bonne fête. Profite bien de ta journée !', 'warm', true, 'nameday')
ON CONFLICT DO NOTHING;
