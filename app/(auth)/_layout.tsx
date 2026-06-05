import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="callback" />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
    </Stack>
  );
}
