import { DefaultTheme, DarkTheme as NativeDarkTheme } from "@react-navigation/native";

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
} as const;

export const DarkTheme: typeof LightTheme = {
  ...NativeDarkTheme,
  colors: {
    ...NativeDarkTheme.colors,
    background: "#151718",
    text: "#fff",
  },
} as const;
