import { getAccessTokenSync } from "@/features/auth/api/set-tokens";
import { Redirect, Stack } from "expo-router";

export default function LoggedInLayout() {
  const isAuthenticated = getAccessTokenSync() !== null;

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "ios_from_left" }}
      />
    </Stack>
  );
}
