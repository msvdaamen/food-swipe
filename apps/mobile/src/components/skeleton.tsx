import { useEffect } from "react";
import { type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
  width: number | `${number}%`;
  height: number | `${number}%`;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width, height, borderRadius = 4, style }: Props) {
  const shimmer = useSharedValue(0);
  const backgroundColor = useThemeColor({
    light: Colors.stone300,
    dark: Colors.stone700,
  });

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor,
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
