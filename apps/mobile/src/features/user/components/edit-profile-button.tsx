import { StyleSheet, Pressable } from "react-native";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Settings } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type EditProfileButtonProps = {
  onPress?: () => void;
};

export function EditProfileButton({ onPress }: EditProfileButtonProps) {
  const scale = useSharedValue(1);

  const backgroundColor = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone700,
  });

  const textColor = useThemeColor({
    light: Colors.stone700,
    dark: Colors.stone200,
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 50 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.container, animatedStyle, { backgroundColor }]}
      >
        <Settings size={16} color={textColor} />
        <FText style={[styles.text, { color: textColor }]}>Edit Profile</FText>
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
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
});
