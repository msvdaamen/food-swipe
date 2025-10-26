import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function MainStacks() {
  const auth = useAuth()

    return (
      <Stack>
        <Stack.Protected guard={!!auth.isSignedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack.Protected>
        <Stack.Protected guard={!auth.isSignedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    )
}

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ClerkProvider tokenCache={tokenCache}>
        <MainStacks />
        <StatusBar style="auto" />
      </ClerkProvider>
    </ThemeProvider>
  );
}
