-- ═══════════════════════════════════════════════════════════
--  039 — Bucket pour les fichiers audio générés (TTS + musique)
-- ═══════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'generated-audio',
  'generated-audio',
  true,
  20971520,  -- 20 Mo max
  array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
)
on conflict (id) do nothing;

-- Lecture publique (URL publique pour lecture audio)
drop policy if exists "generated-audio: lecture publique" on storage.objects;
create policy "generated-audio: lecture publique"
  on storage.objects for select
  using (bucket_id = 'generated-audio');

-- Upload via service role uniquement (edge functions)
-- Les edge functions utilisent la service_role_key qui bypasse les RLS
