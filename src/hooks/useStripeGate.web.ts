// Variante web — @stripe/stripe-react-native importe des modules natifs RN
// (codegenNativeComponent) qui ne peuvent pas être bundlés pour le web.
// Le paiement Stripe sur web passe par Edge Functions / Checkout, pas par ce SDK natif.
const unavailable = async () => ({
  error: { code: 'Failed', message: 'Le paiement par carte est disponible uniquement dans l\'application mobile.' },
});

export function useStripeGate() {
  return {
    initPaymentSheet: unavailable,
    presentPaymentSheet: unavailable,
  };
}
