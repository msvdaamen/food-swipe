import { createStaticNavigation } from "@react-navigation/native";
import { Text, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkTheme, LightTheme } from "./constants/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authClient } from "./lib/auth";
import { RootStack } from "./stacks/root.stack";

type RootStackType = typeof RootStack;

declare module "@react-navigation/native" {
  interface RootNavigator extends RootStackType {}
}

const Navigation = createStaticNavigation(RootStack);
const queryClient = new QueryClient();

export default function App() {
  const scheme = useColorScheme();
  const { isPending } = authClient.useSession();
  if (isPending) return <Text>Loading</Text>;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation theme={scheme === "dark" ? DarkTheme : LightTheme} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
