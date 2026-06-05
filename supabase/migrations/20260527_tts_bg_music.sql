-- Migration : Musique de fond pour le lecteur vocal
ALTER TABLE messages ADD COLUMN IF NOT EXISTS tts_bg_music TEXT DEFAULT 'aucune';
