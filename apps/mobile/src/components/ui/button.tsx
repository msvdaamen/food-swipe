import { Colors } from "@/constants/colors";
import { LoaderCircle } from "lucide-react-native";
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
  PreIcon?: React.ReactNode;
};

export function AppButton({
  children,
  style,
  color = "primary",
  size = "auto",
  type = "normal",
  disabled = false,
  PreIcon,
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
  }, [isPressed, progress, disabled]);

  const animatedStyle = useAnimatedStyle(() => {
    if (disabled) {
      switch (color) {
        case "secondary":
          return {
            backgroundColor: Colors.amber700,
          };
        case "default":
          return {
            backgroundColor: Colors.gray300,
          };
        default:
          return {
            backgroundColor: Colors.emerald700,
          };
      }
    }

    let colors = [Colors.emerald500, Colors.emerald600];
    switch (color) {
      case "secondary":
        colors = [Colors.amber500, Colors.amber600];
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
  }, [color, progress, disabled]);

  const textColor = useMemo(() => {
    if (color === "default") return "black";
    return "white";
  }, [color]);

  const paddingHorizontal = useMemo(() => {
    if (size === "small") return 12;
    if (size === "medium") return 16;
    if (size === "large") return 20;
    if (type === "icon") return 12;
    return 12;
  }, [size, type]);

  const paddingVertical = useMemo(() => {
    if (size === "small") return 6;
    if (size === "medium") return 12;
    if (size === "large") return 16;
    if (type === "icon") return 4;
    return 8;
  }, [size, type]);

  const width = useMemo(() => {
    if (size === "auto") return "auto";
    if (size === "full") return "100%";
    return "auto";
  }, [size]);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
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
        {PreIcon && PreIcon}
        {type !== "icon" && (
          <Text style={[styles.buttonText, { color: textColor }]}>
            {children}
          </Text>
        )}
        {type === "icon" && children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    flexGrow: 1,
    width: "100%",
    textAlign: "center",
    color: "white",
  },
});
