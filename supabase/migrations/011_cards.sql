-- ════════════════════════════════════════════════════════════
--  011_cards.sql
--  Systeme de Cartes Animees - structure uniquement
--  Les donnees de demo sont dans 012_cards_demo.sql
-- ════════════════════════════════════════════════════════════

create table if not exists public.card_backgrounds (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text not null,
  mp4_url       text not null,
  thumbnail_url text not null,
  duration_ms   int  not null default 4000,
  loop          boolean not null default true,
  dominant_color text not null default '#1a1a2e',
  tier          text not null default 'free' check (tier in ('free', 'pro')),
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.card_effects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  effect_type   text not null,
  lottie_url    text not null,
  thumbnail_url text not null,
  loop          boolean not null default true,
  has_name_layer  boolean not null default false,
  name_layer_id   text,
  occasions     text[] not null default '{}',
  tier          text not null default 'free' check (tier in ('free', 'pro')),
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.card_text_styles (
  id     uuid primary key default gen_random_uuid(),
  title  text not null,
  config jsonb not null,
  active boolean not null default true
);

create table if not exists public.card_templates (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  occasion      text not null,
  mood          text not null,
  background_id uuid not null references public.card_backgrounds(id) on delete cascade,
  effect_id     uuid not null references public.card_effects(id) on delete cascade,
  text_style_id uuid not null references public.card_text_styles(id) on delete cascade,
  tier          text not null default 'free' check (tier in ('free', 'pro')),
  tags          text[] not null default '{}',
  sort_order    int  not null default 0,
  active        boolean not null default true,
  ai_description text,
  created_at    timestamptz not null default now()
);

create index if not exists card_templates_occasion on public.card_templates(occasion, active, sort_order);
create index if not exists card_templates_mood     on public.card_templates(mood, active);
create index if not exists card_templates_tier     on public.card_templates(tier, active);

alter table public.card_backgrounds  enable row level security;
alter table public.card_effects      enable row level security;
alter table public.card_text_styles  enable row level security;
alter table public.card_templates    enable row level security;

drop policy if exists "card_backgrounds_public_read" on public.card_backgrounds;
create policy "card_backgrounds_public_read"
  on public.card_backgrounds for select using (active = true);

drop policy if exists "card_effects_public_read" on public.card_effects;
create policy "card_effects_public_read"
  on public.card_effects for select using (active = true);

drop policy if exists "card_text_styles_public_read" on public.card_text_styles;
create policy "card_text_styles_public_read"
  on public.card_text_styles for select using (active = true);

drop policy if exists "card_templates_public_read" on public.card_templates;
create policy "card_templates_public_read"
  on public.card_templates for select using (active = true);
