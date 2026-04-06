import { LoaderCircle } from "lucide-react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

type Props = {
  size?: number;
  color?: string;
};

export function Spinner({ size = 15, color = "white" }: Props) {
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.get()}deg` }],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.inOut(Easing.cubic) }),
      -2,
      false,
    );
  }, []);

  return (
    <Animated.View style={animatedStyle}>
      <LoaderCircle size={size} color={color} />
    </Animated.View>
  );
}
