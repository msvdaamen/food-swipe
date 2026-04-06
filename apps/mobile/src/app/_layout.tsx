import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";

import { api } from "@/lib/api-client";
import { ApiClientProvider } from "@food-swipe/client-api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { authClient } from "@/lib/auth";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hide();
    }
  }, [isPending]);

  if (isPending) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApiClientProvider client={api}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Protected guard={!!session}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="recipe/[id]"
                options={{
                  presentation: "pageSheet",
                  title: "Recipe",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="user/[id]"
                options={{
                  presentation: "card",
                  title: "User",
                  headerShown: false,
                }}
              />
            </Stack.Protected>
            <Stack.Protected guard={!session}>
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="sign-up" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
        </QueryClientProvider>
      </ApiClientProvider>
    </ThemeProvider>
  );
}
