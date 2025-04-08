import { Colors } from "@/constants/colors";
import { useTheme } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacityProps,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Color = "primary" | "secondary" | "default" | "transparent";
type Size = "auto" | "small" | "medium" | "large" | "full" | "icon";
type Type = "normal" | "icon";

type Props = TouchableOpacityProps & {
  children: React.ReactNode;
  color?: Color;
  size?: Size;
  type?: Type;
};

export function AppButton({
  children,
  style,
  color = "primary",
  size = "auto",
  type = "normal",
  ...props
}: Props) {
  const progress = useSharedValue(0);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (isPressed) {
      progress.value = withTiming(1, { duration: 100 });
    } else {
      progress.value = withTiming(0, { duration: 100 });
    }
  }, [isPressed, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    let colors = [Colors.emerald600, Colors.emerald700];
    switch (color) {
      case "secondary":
        colors = [Colors.amber500, Colors.amber700];
        break;
      case "default":
        colors = [Colors.gray200, Colors.gray300];
        break;
      case "transparent":
        colors = ["transparent", "transparent"];
        break;
    }

    const backgroundColor = interpolateColor(progress.value, [0, 1], colors);
    return {
      backgroundColor,
    };
  }, [color, progress]);

  const textColor = useMemo(() => {
    if (color === "default") return "black";
    return "white";
  }, [color]);

  const paddingHorizontal = useMemo(() => {
    if (size === "small") return 12;
    if (size === "medium") return 16;
    if (size === "large") return 20;
    return 12;
  }, [size]);

  const paddingVertical = useMemo(() => {
    if (size === "small") return 8;
    if (size === "medium") return 12;
    if (size === "large") return 16;
    return 8;
  }, [size]);

  const width = useMemo(() => {
    if (size === "auto") return "auto";
    if (size === "full") return "100%";
    return "auto";
  }, [size]);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{
        width,
      }}
      {...props}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            paddingHorizontal,
            paddingVertical,
            width,
          },
          styles.button,
        ]}
        {...props}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
  },
  buttonText: {
    width: "100%",
    textAlign: "center",
    color: "white",
  },
});
