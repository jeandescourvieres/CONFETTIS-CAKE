-- ═══════════════════════════════════════════════
--  018 — Bucket storage pour les avatars contacts
-- ═══════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'contact-avatars',
  'contact-avatars',
  true,
  5242880, -- 5 Mo max
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Lecture publique (URL publique pour affichage)
drop policy if exists "contact-avatars: lecture publique" on storage.objects;
create policy "contact-avatars: lecture publique"
  on storage.objects for select
  using (bucket_id = 'contact-avatars');

-- Upload dans son propre dossier (userId/filename)
drop policy if exists "contact-avatars: upload propre" on storage.objects;
create policy "contact-avatars: upload propre"
  on storage.objects for insert
  with check (
    bucket_id = 'contact-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Mise à jour de ses propres fichiers
drop policy if exists "contact-avatars: mise à jour propre" on storage.objects;
create policy "contact-avatars: mise à jour propre"
  on storage.objects for update
  using (
    bucket_id = 'contact-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Suppression de ses propres fichiers
drop policy if exists "contact-avatars: suppression propre" on storage.objects;
create policy "contact-avatars: suppression propre"
  on storage.objects for delete
  using (
    bucket_id = 'contact-avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
