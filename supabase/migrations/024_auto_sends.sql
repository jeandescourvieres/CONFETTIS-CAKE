-- ── Envois automatiques ─────────────────────────────────────────────────────
-- message_templates : modèles de messages texte (système + personnalisés)
-- scheduled_sends   : liens contact ↔ template + déclencheur

CREATE TABLE IF NOT EXISTS message_templates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title         text NOT NULL,
  content       text NOT NULL,
  tone          text NOT NULL DEFAULT 'festif',
  is_system     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "message_templates_select" ON message_templates;
DROP POLICY IF EXISTS "message_templates_insert" ON message_templates;
DROP POLICY IF EXISTS "message_templates_update" ON message_templates;
DROP POLICY IF EXISTS "message_templates_delete" ON message_templates;

CREATE POLICY "message_templates_select" ON message_templates
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "message_templates_insert" ON message_templates
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "message_templates_update" ON message_templates
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "message_templates_delete" ON message_templates
  FOR DELETE USING (user_id = auth.uid());

-- ── scheduled_sends ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scheduled_sends (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id     uuid NOT NULL REFERENCES message_templates(id) ON DELETE CASCADE,
  contact_id      uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  trigger_event   text NOT NULL CHECK (trigger_event IN ('birthday', 'nameday')),
  channel         text NOT NULL DEFAULT 'sms' CHECK (channel IN ('sms', 'email')),
  is_active       boolean NOT NULL DEFAULT true,
  last_sent_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scheduled_sends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scheduled_sends_all" ON scheduled_sends;
CREATE POLICY "scheduled_sends_all" ON scheduled_sends
  FOR ALL USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS scheduled_sends_active_idx
  ON scheduled_sends (user_id, is_active, trigger_event);

-- ── 10 modèles système ───────────────────────────────────────────────────────
INSERT INTO message_templates (user_id, title, content, tone, is_system) VALUES
  (NULL, '🎉 Festif',          'Joyeux anniversaire {prenom} ! 🎉 Que cette nouvelle année t''apporte tout ce dont tu rêves. Je pense fort à toi aujourd''hui !', 'festif', true),
  (NULL, '😄 Humoristique',    'Alors {prenom}, encore un an de plus ? 😄 T''inquiète, avec l''âge vient la sagesse... ou pas ! Joyeux anniversaire quand même !', 'humorous', true),
  (NULL, '🥹 Touchant',        'Aujourd''hui c''est ton jour, {prenom}. Je voulais juste te dire que tu comptes beaucoup pour moi. Joyeux anniversaire, du fond du cœur. 💜', 'touching', true),
  (NULL, '🌸 Poétique',        'En ce beau jour qui est le tien, {prenom}, je t''envoie tout mon amour et mes vœux les plus sincères. Que ta journée soit aussi belle que tu l''es. 🌸', 'poetic', true),
  (NULL, '⚡ Court & Percutant','BON ANNIVERSAIRE {prenom} ! 🎊 Cette journée t''appartient, profites-en à fond !', 'short', true),
  (NULL, '🙏 Simple & Sincère','Joyeux anniversaire {prenom}. Je pense à toi aujourd''hui et je te souhaite une belle journée entourée des gens que tu aimes.', 'sincere', true),
  (NULL, '🎵 Musical',         '🎵 Joyeux anniversaire à toi, joyeux anniversaire à toi, joyeux anniversaire {prenom}... allez tu connais la suite ! Belle journée ! 🎊', 'musical', true),
  (NULL, '💼 Pro & Discret',   'Bonjour {prenom}, je vous souhaite un très joyeux anniversaire et une excellente journée.', 'pro', true),
  (NULL, '🌟 Inspirant',       'Joyeux anniversaire {prenom} ! 🌟 Chaque année qui passe est une nouvelle aventure qui commence. Que celle-ci soit la plus belle !', 'inspiring', true),
  (NULL, '🤗 Chaleureux',      'Coucou {prenom} ! 🤗 Je voulais être parmi les premiers à te souhaiter un joyeux anniversaire. Profite bien de ta journée !', 'warm', true)
ON CONFLICT DO NOTHING;
