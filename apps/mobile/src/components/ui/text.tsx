import { TextProps, useColorScheme } from "react-native";
import { Text as RNText } from "react-native";

export const AppText = ({ children, style, ...props }: TextProps) => {
    const theme = useColorScheme();
    const textColor = theme === 'dark' ? 'white' : 'black';
  return <RNText style={[{color: textColor}, style]} {...props}>{children}</RNText>;
};
