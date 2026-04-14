# Confettis & Cake — Notes de session

## État général (2026-04-12)
Phase de **tests sur téléphone physique**.

## Fonctionnalités implémentées
- [x] Flux création complet (contact → occasion → personnalisation → format/ton → génération IA → preview → envoi)
- [x] Occasions : birthday, nameday, wedding, birth, graduation, promotion, thanks, newyear, custom
- [x] Formats : song, poem, message, joke
- [x] Tons : humorous, touching, poetic, playful, professional
- [x] Mode "J'ai oublié" (lateMode)
- [x] Studio carte (CardComposer, Lottie, fond vidéo)
- [x] Contacts (import téléphone + manuel)
- [x] Calendrier événements à venir
- [x] Cagnotte (Pot) + Stripe
- [x] Notifications rappels
- [x] Parrainage / referral
- [x] Multilingue (fr, en, de, es, it, ar, pt)
- [x] Plans free/premium + crédits

## Edge Functions Supabase
- `generate-message` — génération texte IA
- `generate-music` — génération audio
- `process-music-queue` — file traitement musique
- `birthday-reminders` — rappels auto
- `create-payment-intent` + `stripe-webhook` — Stripe
- `send-email` / `send-sms`

## En cours / À faire
<!-- Mettre à jour à chaque session -->

## Bugs connus
<!-- Mettre à jour à chaque session -->

## Décisions techniques
<!-- Mettre à jour à chaque session -->
