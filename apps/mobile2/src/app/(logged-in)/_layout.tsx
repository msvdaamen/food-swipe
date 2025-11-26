import { getAccessTokenSync } from '@/features/auth/api/set-tokens';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { RecipeModalHeader } from './recipe-modal';
export default function LoggedInLayout() {
  const isAuthenticated = getAccessTokenSync() !== null;
  const theme = useColorScheme();
  const backgroundColor = theme === 'dark' ? '#121212' : '#f9fafb';
  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="recipe-modal"
        options={{
          headerShown: false,
          headerTransparent: true,
          // header: () => <RecipeModalHeader />,
        }}
      />
    </Stack>
  );
}
