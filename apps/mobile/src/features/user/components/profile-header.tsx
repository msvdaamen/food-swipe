import { View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Camera } from "lucide-react-native";

type ProfileHeaderProps = {
  avatarUrl?: string | null;
  name: string;
  username: string;
  bio?: string;
  isOwnProfile: boolean;
  onAvatarPress?: () => void;
};

export function ProfileHeader({
  avatarUrl,
  name,
  username,
  bio,
  isOwnProfile,
  onAvatarPress,
}: ProfileHeaderProps) {
  const placeholderBg = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone700,
  });

  const usernameColor = useThemeColor({
    light: Colors.stone500,
    dark: Colors.stone400,
  });

  const bioColor = useThemeColor({
    light: Colors.stone600,
    dark: Colors.stone300,
  });

  const cameraOverlayBg = useThemeColor({
    light: "rgba(0, 0, 0, 0.5)",
    dark: "rgba(0, 0, 0, 0.6)",
  });

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Pressable
          onPress={onAvatarPress}
          style={({ pressed }) => [
            styles.avatarPressable,
            pressed && onAvatarPress && styles.avatarPressed,
          ]}
          disabled={!onAvatarPress}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                styles.avatarPlaceholder,
                { backgroundColor: placeholderBg },
              ]}
            >
              <FText style={styles.avatarPlaceholderText}>
                {name.charAt(0).toUpperCase()}
              </FText>
            </View>
          )}
          {isOwnProfile && (
            <View
              style={[
                styles.cameraOverlay,
                { backgroundColor: cameraOverlayBg },
              ]}
            >
              <Camera size={20} color={Colors.white} />
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.infoContainer}>
        <FText style={styles.name}>{name}</FText>
        <FText style={[styles.username, { color: usernameColor }]}>
          @{username}
        </FText>
        {bio ? (
          <FText style={[styles.bio, { color: bioColor }]}>{bio}</FText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarPressable: {
    position: "relative",
  },
  avatarPressed: {
    opacity: 0.8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 40,
    fontWeight: "600",
    color: Colors.stone500,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  infoContainer: {
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  username: {
    fontSize: 15,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
