create table if not exists public.contact_share_tokens (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  token        text not null unique default encode(gen_random_bytes(24), 'base64url'),
  contact_ids  uuid[] not null,
  expires_at   timestamptz not null default now() + interval '24 hours',
  used_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists contact_share_tokens_token_idx on public.contact_share_tokens(token);
create index if not exists contact_share_tokens_user_id_idx on public.contact_share_tokens(user_id);

alter table public.contact_share_tokens enable row level security;

create policy "owner can manage own tokens"
  on public.contact_share_tokens
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);