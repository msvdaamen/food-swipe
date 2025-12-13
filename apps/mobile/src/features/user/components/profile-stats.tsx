import { View, StyleSheet, Pressable } from "react-native";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

type StatItemProps = {
  label: string;
  value: number;
  onPress?: () => void;
};

function StatItem({ label, value, onPress }: StatItemProps) {
  const textColor = useThemeColor({
    light: Colors.stone700,
    dark: Colors.stone300,
  });

  return (
    <Pressable onPress={onPress} style={styles.statItem}>
      <FText style={styles.statValue}>{value.toLocaleString()}</FText>
      <FText style={[styles.statLabel, { color: textColor }]}>{label}</FText>
    </Pressable>
  );
}

type ProfileStatsProps = {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
};

export function ProfileStats({
  postsCount,
  followersCount,
  followingCount,
  onFollowersPress,
  onFollowingPress,
}: ProfileStatsProps) {
  const borderColor = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone700,
  });

  return (
    <View style={[styles.container, { borderColor }]}>
      <StatItem label="Posts" value={postsCount} />
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <StatItem
        label="Followers"
        value={followersCount}
        onPress={onFollowersPress}
      />
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <StatItem
        label="Following"
        value={followingCount}
        onPress={onFollowingPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
  },
});
