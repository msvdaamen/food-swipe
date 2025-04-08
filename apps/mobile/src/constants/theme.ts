import { Theme } from "@react-navigation/native";
import {
  DefaultTheme,
  DarkTheme as RNDarkTheme,
} from "@react-navigation/native";
export const LightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: "#f9fafb",
    primary: "#10b981",
    card: "white",
    border: "#dbdbdb",
    text: "#121212",
  },
};

export const DarkTheme: Theme = {
  ...RNDarkTheme,
  colors: {
    ...RNDarkTheme.colors,
    background: "#121212",
    primary: "#10b981",
    card: "#121212",
    border: "#27272a",
    text: "#f9fafb",
  },
};
