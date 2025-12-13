import { View, StyleSheet } from "react-native";
import { FText } from "@/components/f-text";
import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image as ImageIcon } from "lucide-react-native";

type FeedPlaceholderProps = {
  isOwnProfile: boolean;
};

export function FeedPlaceholder({ isOwnProfile }: FeedPlaceholderProps) {
  const borderColor = useThemeColor({
    light: Colors.stone200,
    dark: Colors.stone700,
  });

  const iconColor = useThemeColor({
    light: Colors.stone300,
    dark: Colors.stone600,
  });

  const textColor = useThemeColor({
    light: Colors.stone500,
    dark: Colors.stone400,
  });

  const subtextColor = useThemeColor({
    light: Colors.stone400,
    dark: Colors.stone500,
  });

  const gridItemBg = useThemeColor({
    light: Colors.stone100,
    dark: Colors.stone800,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FText style={styles.headerText}>Posts</FText>
      </View>

      <View style={[styles.placeholderContainer, { borderColor }]}>
        <View style={[styles.iconContainer, { borderColor: iconColor }]}>
          <ImageIcon size={40} color={iconColor} />
        </View>
        <FText style={[styles.title, { color: textColor }]}>
          {isOwnProfile ? "Share Your First Post" : "No Posts Yet"}
        </FText>
        <FText style={[styles.subtitle, { color: subtextColor }]}>
          {isOwnProfile
            ? "When you share food photos and recipes, they will appear on your profile."
            : "When this user shares food photos and recipes, they will appear here."}
        </FText>
      </View>

      {/* Grid placeholder for future feed items */}
      <View style={styles.gridPlaceholder}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[styles.gridItem, { backgroundColor: gridItemBg }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  gridPlaceholder: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 2,
    opacity: 0.3,
  },
  gridItem: {
    width: "32.5%",
    aspectRatio: 1,
    borderRadius: 4,
  },
});
