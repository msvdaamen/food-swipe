import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors } from "@/constants/theme";
export function FText({ style, ...rest }: TextProps) {
  const color = useThemeColor({ light: Colors.black, dark: Colors.white });

  return <Text style={[{ color }, style]} {...rest} />;
}
