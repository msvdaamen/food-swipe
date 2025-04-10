import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";


export default function LoggedInLayout() {
  const { isSignedIn } = useUser();
    const isAuthenticated = isSignedIn; /* check for valid auth token/session */

    if (!isAuthenticated) {
      return <Redirect href="/sign-in" />;
    }

    return <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'ios_from_left' }} />
    </Stack>
}