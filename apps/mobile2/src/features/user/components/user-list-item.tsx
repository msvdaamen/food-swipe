import { View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { FollowButton } from "./follow-button";

export type UserListItemData = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  isFollowing: boolean;
};

type UserListItemProps = {
  user: UserListItemData;
  currentUserId: string;
  onPress?: (userId: string) => void;
  onFollowPress?: (userId: string) => void;
};

export function UserListItem({
  user,
  currentUserId,
  onPress,
  onFollowPress,
}: UserListItemProps) {
  const isOwnProfile = user.id === currentUserId;

  const placeholderBg = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone700,
  });

  const usernameColor = useThemeColor({
    light: Colors.stone500,
    dark: Colors.stone400,
  });

  const borderColor = useThemeColor({
    light: Colors.stone100,
    dark: Colors.stone800,
  });

  const handlePress = () => {
    onPress?.(user.id);
  };

  const handleFollowPress = () => {
    onFollowPress?.(user.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: borderColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.leftContent}>
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
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
              {user.name.charAt(0).toUpperCase()}
            </FText>
          </View>
        )}

        <View style={styles.userInfo}>
          <FText style={styles.name} numberOfLines={1}>
            {user.name}
          </FText>
          <FText
            style={[styles.username, { color: usernameColor }]}
            numberOfLines={1}
          >
            @{user.username}
          </FText>
        </View>
      </View>

      {!isOwnProfile && (
        <FollowButton
          isFollowing={user.isFollowing}
          onPress={handleFollowPress}
          size="small"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.stone500,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
});
