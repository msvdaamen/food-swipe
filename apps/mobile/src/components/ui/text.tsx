import { TextProps, Text } from "react-native"
import { useTheme } from '@react-navigation/native';

export function AppText({ style, ...props }: TextProps) {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      style={[{ color: colors.text }, style]}
    />
  );
}
