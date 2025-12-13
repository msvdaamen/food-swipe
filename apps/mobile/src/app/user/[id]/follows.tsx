import { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ChevronLeft } from "lucide-react-native";
import {
  UserListItem,
  type UserListItemData,
} from "@/features/user/components/user-list-item";

type TabType = "followers" | "following";

// Mock data - in the future this would come from API
const MOCK_FOLLOWERS: UserListItemData[] = [
  {
    id: "2",
    name: "Jane Smith",
    username: "janesmith",
    avatarUrl: null,
    isFollowing: true,
  },
  {
    id: "3",
    name: "Bob Wilson",
    username: "bobwilson",
    avatarUrl: null,
    isFollowing: false,
  },
  {
    id: "4",
    name: "Alice Johnson",
    username: "alicej",
    avatarUrl: null,
    isFollowing: true,
  },
  {
    id: "5",
    name: "Charlie Brown",
    username: "charlieb",
    avatarUrl: null,
    isFollowing: false,
  },
  {
    id: "6",
    name: "Diana Prince",
    username: "wonderwoman",
    avatarUrl: null,
    isFollowing: true,
  },
];

const MOCK_FOLLOWING: UserListItemData[] = [
  {
    id: "2",
    name: "Jane Smith",
    username: "janesmith",
    avatarUrl: null,
    isFollowing: true,
  },
  {
    id: "4",
    name: "Alice Johnson",
    username: "alicej",
    avatarUrl: null,
    isFollowing: true,
  },
  {
    id: "6",
    name: "Diana Prince",
    username: "wonderwoman",
    avatarUrl: null,
    isFollowing: true,
  },
  {
    id: "7",
    name: "Gordon Ramsay",
    username: "gordonramsay",
    avatarUrl: null,
    isFollowing: true,
  },
];

// This would come from auth context in the future
const CURRENT_USER_ID = "1";

export default function FollowsScreen() {
  const { id, username, tab } = useLocalSearchParams<{
    id: string;
    username: string;
    tab?: TabType;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabType>(tab || "followers");
  const [isLoading] = useState(false);

  const headerBorderColor = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone800,
  });

  const tabInactiveColor = useThemeColor({
    light: Colors.stone400,
    dark: Colors.stone500,
  });

  const tabActiveColor = useThemeColor({
    light: Colors.stone900,
    dark: Colors.stone100,
  });

  const tabIndicatorColor = useThemeColor({
    light: Colors.emerald500,
    dark: Colors.emerald500,
  });

  const iconColor = useThemeColor({
    light: Colors.stone700,
    dark: Colors.stone300,
  });

  const emptyTextColor = useThemeColor({
    light: Colors.stone500,
    dark: Colors.stone400,
  });

  const data = activeTab === "followers" ? MOCK_FOLLOWERS : MOCK_FOLLOWING;

  const handleBack = () => {
    router.back();
  };

  const handleUserPress = (userId: string) => {
    router.navigate({
      pathname: "/user/[id]",
      params: { id: userId },
    });
    // TODO: Navigate to user profile
    console.log("Navigate to user profile:", userId);
  };

  const handleFollowPress = (userId: string) => {
    // TODO: Implement follow/unfollow API call
    console.log("Follow/Unfollow user:", userId);
  };

  const renderItem = ({ item }: { item: UserListItemData }) => (
    <UserListItem
      user={item}
      currentUserId={CURRENT_USER_ID}
      onPress={handleUserPress}
      onFollowPress={handleFollowPress}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <FText style={[styles.emptyText, { color: emptyTextColor }]}>
        {activeTab === "followers"
          ? "No followers yet"
          : "Not following anyone yet"}
      </FText>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: headerBorderColor }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={28} color={iconColor} />
        </Pressable>
        <FText style={styles.headerTitle}>@{username}</FText>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { borderBottomColor: headerBorderColor }]}>
        <Pressable style={styles.tab} onPress={() => setActiveTab("followers")}>
          <FText
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "followers" ? tabActiveColor : tabInactiveColor,
              },
            ]}
          >
            Followers
          </FText>
          {activeTab === "followers" && (
            <View
              style={[
                styles.tabIndicator,
                { backgroundColor: tabIndicatorColor },
              ]}
            />
          )}
        </Pressable>

        <Pressable style={styles.tab} onPress={() => setActiveTab("following")}>
          <FText
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "following" ? tabActiveColor : tabInactiveColor,
              },
            ]}
          >
            Following
          </FText>
          {activeTab === "following" && (
            <View
              style={[
                styles.tabIndicator,
                { backgroundColor: tabIndicatorColor },
              ]}
            />
          )}
        </Pressable>
      </View>

      {/* User List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.emerald500} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    position: "relative",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    borderRadius: 1.5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
});
