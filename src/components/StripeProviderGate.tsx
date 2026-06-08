// Wrapper natif — Stripe React Native n'est disponible que sur iOS/Android.
// Voir StripeProviderGate.web.tsx pour la variante web (passthrough).
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Config } from '../constants/config';

export function StripeProviderGate({ children }: { children: React.ReactNode }) {
  return (
    <StripeProvider publishableKey={Config.stripePublishableKey}>
      {children as React.ReactElement}
    </StripeProvider>
  );
}
