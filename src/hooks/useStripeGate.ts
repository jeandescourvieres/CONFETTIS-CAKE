// Wrapper natif — Stripe React Native n'est disponible que sur iOS/Android.
// Voir useStripeGate.web.ts pour la variante web (stub).
export { useStripe as useStripeGate } from '@stripe/stripe-react-native';
