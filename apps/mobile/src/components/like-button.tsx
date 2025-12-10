import { Heart } from "lucide-react-native";
import { useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { AppButton } from "./ui/button";
import { Colors } from "@/constants/theme";

const AnimatedHeardIcon = Animated.createAnimatedComponent(Heart);

export function LikeButton({
  isLiked,
  onChange,
}: {
  isLiked: boolean;
  onChange: (liked: boolean) => void;
}) {
  const [liked, setLiked] = useState(isLiked);

  const shakeValue = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: shakeValue.value.toString() + "deg" }],
  }));

  const likePressed = () => {
    setLiked(!liked);
    onChange(!liked);
    if (!liked) {
      shakeValue.value = withSequence(
        withTiming(-20, { duration: 50 }),
        withRepeat(withTiming(20, { duration: 100 }), 3, true),
        withTiming(0, { duration: 50 }),
      );
    }
  };

  return (
    <AppButton color="transparent" type="icon" onPress={() => likePressed()}>
      <AnimatedHeardIcon
        size={30}
        color={Colors.red500}
        fill={liked ? Colors.red500 : "transparent"}
        style={[animatedStyles]}
      />
    </AppButton>
  );
}
