-- Migration 037 — Champs TTS (message vocal ElevenLabs)
-- Ajoute les colonnes de suivi TTS sur la table messages

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS tts_url    TEXT,
  ADD COLUMN IF NOT EXISTS tts_status TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS tts_voice  TEXT;

-- Index pour retrouver rapidement les messages avec TTS ready
CREATE INDEX IF NOT EXISTS idx_messages_tts_status
  ON messages (user_id, tts_status)
  WHERE tts_status <> 'none';
