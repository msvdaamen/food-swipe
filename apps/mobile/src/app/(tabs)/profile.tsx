import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  ProfileHeader,
  ProfileStats,
  EditProfileButton,
  FeedPlaceholder,
} from "@/features/user/components";
import { authClient } from "@/lib/auth";

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const headerBorderColor = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone800,
  });

  const handleAvatarPress = () => {
    // TODO: Implement image picker for profile photo upload
    console.log("Open image picker");
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log("Navigate to edit profile");
  };

  const handleFollowersPress = () => {
    router.push({
      pathname: "/user/[id]/follows",
      params: {
        id: session!.user.id,
        username: session!.user.username!,
        tab: "followers",
      },
    });
  };

  const handleFollowingPress = () => {
    router.push({
      pathname: "/user/[id]/follows",
      params: {
        id: session!.user.id,
        username: session!.user.username!,
        tab: "following",
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: headerBorderColor }]}>
        <FText style={styles.headerTitle}>{session!.user.username}</FText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          avatarUrl={""}
          name={session!.user.name}
          username={session!.user.username!}
          bio={""}
          isOwnProfile={true}
          onAvatarPress={handleAvatarPress}
        />

        <View style={styles.actionContainer}>
          <EditProfileButton onPress={handleEditProfile} />
        </View>

        <ProfileStats
          postsCount={123}
          followersCount={1233}
          followingCount={12333}
          onFollowersPress={handleFollowersPress}
          onFollowingPress={handleFollowingPress}
        />

        <FeedPlaceholder isOwnProfile={true} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  actionContainer: {
    alignItems: "center",
    paddingBottom: 16,
  },
});
