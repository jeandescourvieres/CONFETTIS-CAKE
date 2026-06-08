-- Challenge prescripteurs : date de victoire (null = pas encore gagné)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS challenge_won_at timestamptz;
