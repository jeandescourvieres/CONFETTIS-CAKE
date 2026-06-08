// Variante web — @stripe/stripe-react-native importe des modules natifs RN
// (codegenNativeComponent) qui ne peuvent pas être bundlés pour le web.
// Le paiement Stripe sur web passe par Edge Functions / Checkout, pas par ce SDK natif.
import React from 'react';

export function StripeProviderGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
