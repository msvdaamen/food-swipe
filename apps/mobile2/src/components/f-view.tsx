import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors } from "@/constants/theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function FView({ style, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: Colors.stone50, dark: Colors.stone900 },
    "background",
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
