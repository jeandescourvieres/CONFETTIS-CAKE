-- ════════════════════════════════════════════════════════════════════
--  Permissions explicites pour l'API Supabase
--
--  À partir du 30 octobre 2026, Supabase ne grant plus automatiquement
--  les rôles anon/authenticated sur les tables publiques.
--  GRANTs conditionnels : appliqués seulement si la table existe.
-- ════════════════════════════════════════════════════════════════════

do $grants$
declare
  t text;
begin

  -- profiles
  if exists (select from pg_tables where schemaname='public' and tablename='profiles') then
    grant select, update on public.profiles to authenticated;
  end if;

  -- contacts
  if exists (select from pg_tables where schemaname='public' and tablename='contacts') then
    grant select, insert, update, delete on public.contacts to authenticated;
  end if;

  -- messages
  if exists (select from pg_tables where schemaname='public' and tablename='messages') then
    grant select, insert, update, delete on public.messages to authenticated;
  end if;

  -- pots
  if exists (select from pg_tables where schemaname='public' and tablename='pots') then
    grant select, insert, update, delete on public.pots to authenticated;
    grant select on public.pots to anon;
  end if;

  -- contributions
  if exists (select from pg_tables where schemaname='public' and tablename='contributions') then
    grant select on public.contributions to authenticated;
    grant select, insert on public.contributions to anon;
  end if;

  -- pot_watchers
  if exists (select from pg_tables where schemaname='public' and tablename='pot_watchers') then
    grant select, insert, delete on public.pot_watchers to authenticated;
  end if;

  -- music_queue (insert/update via edge functions service_role)
  if exists (select from pg_tables where schemaname='public' and tablename='music_queue') then
    grant select on public.music_queue to authenticated;
  end if;

  -- custom_events
  if exists (select from pg_tables where schemaname='public' and tablename='custom_events') then
    grant select, insert, update, delete on public.custom_events to authenticated;
  end if;

  -- card catalog (données publiques)
  if exists (select from pg_tables where schemaname='public' and tablename='card_backgrounds') then
    grant select on public.card_backgrounds to anon, authenticated;
  end if;
  if exists (select from pg_tables where schemaname='public' and tablename='card_effects') then
    grant select on public.card_effects to anon, authenticated;
  end if;
  if exists (select from pg_tables where schemaname='public' and tablename='card_text_styles') then
    grant select on public.card_text_styles to anon, authenticated;
  end if;
  if exists (select from pg_tables where schemaname='public' and tablename='card_templates') then
    grant select on public.card_templates to anon, authenticated;
  end if;

  -- referrals
  if exists (select from pg_tables where schemaname='public' and tablename='referrals') then
    grant select, insert on public.referrals to authenticated;
  end if;

  -- message_templates (system templates lisibles par anon)
  if exists (select from pg_tables where schemaname='public' and tablename='message_templates') then
    grant select on public.message_templates to anon;
    grant select, insert, update, delete on public.message_templates to authenticated;
  end if;

  -- scheduled_sends
  if exists (select from pg_tables where schemaname='public' and tablename='scheduled_sends') then
    grant select, insert, update, delete on public.scheduled_sends to authenticated;
  end if;

  -- reminders
  if exists (select from pg_tables where schemaname='public' and tablename='reminders') then
    grant select, insert, update, delete on public.reminders to authenticated;
  end if;

  -- group_messages (page publique de co-signature)
  if exists (select from pg_tables where schemaname='public' and tablename='group_messages') then
    grant select on public.group_messages to anon;
    grant select, insert, update, delete on public.group_messages to authenticated;
  end if;

  -- group_signatures (n'importe qui peut signer)
  if exists (select from pg_tables where schemaname='public' and tablename='group_signatures') then
    grant select, insert on public.group_signatures to anon;
    grant select, insert on public.group_signatures to authenticated;
  end if;

  -- couple_links
  if exists (select from pg_tables where schemaname='public' and tablename='couple_links') then
    grant select, insert, update, delete on public.couple_links to authenticated;
  end if;

  -- postcards
  if exists (select from pg_tables where schemaname='public' and tablename='postcards') then
    grant select, insert, update, delete on public.postcards to authenticated;
  end if;

  -- message_reactions (page publique de réaction)
  if exists (select from pg_tables where schemaname='public' and tablename='message_reactions') then
    grant select, insert on public.message_reactions to anon;
    grant select, insert on public.message_reactions to authenticated;
  end if;

  -- guestbooks (page publique du livre d'or)
  if exists (select from pg_tables where schemaname='public' and tablename='guestbooks') then
    grant select on public.guestbooks to anon;
    grant select, insert, update, delete on public.guestbooks to authenticated;
  end if;

  -- guestbook_entries (insert via edge function service_role)
  if exists (select from pg_tables where schemaname='public' and tablename='guestbook_entries') then
    grant select on public.guestbook_entries to anon;
    grant select on public.guestbook_entries to authenticated;
  end if;

  -- wish_items
  if exists (select from pg_tables where schemaname='public' and tablename='wish_items') then
    grant select, insert, update, delete on public.wish_items to authenticated;
  end if;

  -- notifications (insert via edge functions service_role)
  if exists (select from pg_tables where schemaname='public' and tablename='notifications') then
    grant select, update on public.notifications to authenticated;
  end if;

end $grants$;

notify pgrst, 'reload schema';
