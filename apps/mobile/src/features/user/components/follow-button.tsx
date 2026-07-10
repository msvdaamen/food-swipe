import { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { UserPlus, UserCheck } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";
import { AppText } from "@/components/ui/text";

type FollowButtonProps = {
  isFollowing: boolean;
  onPress?: () => void;
  size?: "default" | "small";
};

export function FollowButton({
  isFollowing,
  onPress,
  size = "default",
}: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const scale = useSharedValue(1);

  const followingBg = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone700,
  });

  const followingTextColor = useThemeColor({
    light: Colors.stone700,
    dark: Colors.stone200,
  });

  const handlePress = () => {
    scale.value = withTiming(0.95, { duration: 50 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
    setFollowing(!following);
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isSmall = size === "small";
  const iconSize = isSmall ? 14 : 16;

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.container,
          isSmall && styles.containerSmall,
          animatedStyle,
          following
            ? { backgroundColor: followingBg }
            : { backgroundColor: Colors.emerald500 },
        ]}
      >
        {following ? (
          <UserCheck size={iconSize} color={followingTextColor} />
        ) : (
          <UserPlus size={iconSize} color={Colors.white} />
        )}
        <AppText
          style={[
            styles.text,
            isSmall && styles.textSmall,
            { color: following ? followingTextColor : Colors.white },
          ]}
        >
          {following ? "Following" : "Follow"}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  containerSmall: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
    minWidth: 90,
    borderRadius: 6,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  textSmall: {
    fontSize: 13,
  },
});
