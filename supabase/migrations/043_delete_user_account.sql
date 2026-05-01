-- ═══════════════════════════════════════════════════════════
--  Migration 043 — RPC delete_user_account
--  Supprime toutes les données d'un utilisateur authentifié
--  et déclenche la suppression du compte auth.users via
--  supabase.auth.admin.deleteUser (géré côté app)
-- ═══════════════════════════════════════════════════════════

create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Données liées
  delete from public.notifications    where user_id = auth.uid();
  delete from public.reminders        where user_id = auth.uid();
  delete from public.auto_sends       where user_id = auth.uid();
  delete from public.guestbooks       where user_id = auth.uid();
  delete from public.pots             where creator_id = auth.uid();
  delete from public.messages         where user_id = auth.uid();
  delete from public.contacts         where user_id = auth.uid();
  delete from public.custom_events    where user_id = auth.uid();
  delete from public.referrals        where referrer_id = auth.uid();
  -- Le profil (cascade depuis auth.users via trigger si configuré,
  -- sinon suppression explicite)
  delete from public.profiles         where id = auth.uid();
end;
$$;

-- Seul l'utilisateur authentifié peut appeler sa propre suppression
revoke all on function public.delete_user_account() from public;
grant execute on function public.delete_user_account() to authenticated;
