import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  ProfileHeader,
  ProfileStats,
  FollowButton,
  EditProfileButton,
  FeedPlaceholder,
} from "@/features/user/components";
import { ChevronLeft } from "lucide-react-native";

// Mock data - in the future this would come from API/auth context
const MOCK_USER = {
  id: "1",
  name: "John Doe",
  username: "johndoe",
  bio: "Food enthusiast | Home chef | Sharing my culinary adventures one recipe at a time 🍳🥗",
  avatarUrl: null,
  postsCount: 42,
  followersCount: 1234,
  followingCount: 567,
};

// This would come from auth context in the future
const CURRENT_USER_ID = "1";

export default function ProfileScreen() {
  const { id: userId } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // Determine if viewing own profile
  const profileUserId = userId ?? CURRENT_USER_ID;
  const isOwnProfile = profileUserId === CURRENT_USER_ID;

  // Mock following state for other profiles
  const isFollowing = false;

  const headerBorderColor = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone800,
  });

  const iconColor = useThemeColor({
    light: Colors.stone700,
    dark: Colors.stone300,
  });

  const handleAvatarPress = () => {
    // TODO: Implement image picker for profile photo upload
    console.log("Open image picker");
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log("Navigate to edit profile");
  };

  const handleFollow = () => {
    // TODO: Implement follow/unfollow API call
    console.log("Follow/Unfollow user");
  };

  const handlePostsPress = () => {
    // TODO: Scroll to posts section or navigate
    console.log("View posts");
  };

  const handleFollowersPress = (userId: string, username: string) => {
    router.push({
      pathname: "/user/[id]/follows",
      params: { id: userId, username: username, tab: "followers" },
    });
  };

  const handleFollowingPress = (userId: string, username: string) => {
    router.push({
      pathname: "/user/[id]/follows",
      params: { id: userId, username: username, tab: "following" },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: headerBorderColor }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={28} color={iconColor} />
        </Pressable>
        <FText style={styles.headerTitle}>
          {isOwnProfile ? "Profile" : MOCK_USER.username}
        </FText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          avatarUrl={MOCK_USER.avatarUrl}
          name={MOCK_USER.name}
          username={MOCK_USER.username}
          bio={MOCK_USER.bio}
          isOwnProfile={isOwnProfile}
          onAvatarPress={handleAvatarPress}
        />

        <View style={styles.actionContainer}>
          {isOwnProfile ? (
            <EditProfileButton onPress={handleEditProfile} />
          ) : (
            <FollowButton isFollowing={isFollowing} onPress={handleFollow} />
          )}
        </View>

        <ProfileStats
          postsCount={MOCK_USER.postsCount}
          followersCount={MOCK_USER.followersCount}
          followingCount={MOCK_USER.followingCount}
          onFollowersPress={() =>
            handleFollowersPress(MOCK_USER.id, MOCK_USER.username)
          }
          onFollowingPress={() =>
            handleFollowingPress(MOCK_USER.id, MOCK_USER.username)
          }
        />

        <FeedPlaceholder isOwnProfile={isOwnProfile} />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
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
