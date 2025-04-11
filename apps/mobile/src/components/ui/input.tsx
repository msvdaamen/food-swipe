import { useMemo, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInputProps,
  View,
  useColorScheme,
} from "react-native";
import { TextInput } from "react-native";
import { AppText } from "./text";
import { Colors } from "@/constants/colors";

type Color = "transparent";

type Props = TextInputProps & {
  Icon?: React.ElementType;
  color?: Color;
};

export const AppInput = ({ children, style, Icon, color, ...props }: Props) => {
  const theme = useColorScheme();
  const [focused, setFocused] = useState(false);

  const backgroundColor = useMemo(() => {
    if (color === "transparent") return "rgba(255, 255, 255, 0.1)";
    return theme === "dark" ? "#424242" : "white";
  }, [theme, color]);
  const placeholderColor = theme === "dark" ? "#a1a1aa" : "#4b5563";
  const textColor = theme === "dark" ? "white" : "black";
  const borderColor = useMemo(() => {
    if (focused) return "rgb(5 150 105)";
    if (color === "transparent") return Colors.dark700;
    return "rgb(97 97 97)";
  }, [focused, color]);

  function onBlur() {
    setFocused(false);
  }

  function onFocus() {
    setFocused(true);
  }

  return (
    <View style={[styles.container, style]}>
      {children && <AppText>{children}</AppText>}
      <View style={[styles.inputContainer, { backgroundColor, borderColor }]}>
        {Icon && (
          <View style={[styles.icon]}>
            <Icon color={placeholderColor} size={18} />
          </View>
        )}
        <TextInput
          {...props}
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={placeholderColor}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

export const AppLabel = ({ children, style }: Props) => {
  return (
    // <View style={styles.labelContainer}>
      <AppText style={[style]}>{children}</AppText>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // textAlign: "left",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: 4
  },
  input: {
    flexGrow: 1,
    borderColor: "gray",
    height: 30,
    padding: 0
  },
  icon: {
    marginRight: 4,
  },
});
