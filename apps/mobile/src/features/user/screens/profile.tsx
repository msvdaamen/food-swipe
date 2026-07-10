import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as ImagePicker from "expo-image-picker";
import { useUploadProfilePicture } from "@/features/user/api/upload-profile-picture";
import { Colors } from "@/constants/colors";
import { AppText } from "@/components/ui/text";
import { useMe } from "../api/me";
import {
  useNavigation,
} from '@react-navigation/native';
import { ProfileHeader } from "../components/profile-header";
import { EditProfileButton } from "../components/edit-profile-button";
import { ProfileStats } from "../components/profile-stats";
import { FeedPlaceholder } from "../components/feed-placeholder";

export function ProfileScreen() {
  const { data: user, isPending, error } = useMe();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const uploadProfilePicture = useUploadProfilePicture();

  const headerBorderColor = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone800,
  });

  if (isPending || error) {
    return null;
  }

  const handleAvatarPress = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (result.canceled) {
      return;
    }
    const asset = result.assets[0];
    await uploadProfilePicture.mutateAsync({ uri: asset.uri });
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log("Navigate to edit profile");
  };

  const handleFollowersPress = () => {
    navigation.navigate('UserStack', {
      screen: 'FollowsScreen',
      params: {
        id: user.id,
        username: user.username!,
        tab: "followers",
      }
    })
  };

  const handleFollowingPress = () => {
    navigation.navigate('UserStack', {
      screen: 'FollowsScreen',
      params: {
        id: user.id,
        username: user.username!,
        tab: "following",
      }
    })
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: headerBorderColor }]}>
        <AppText style={styles.headerTitle}>{user.username}</AppText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          avatarUrl={user.imageUrl ?? user.image ?? undefined}
          name={user.name}
          username={user.username!}
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
