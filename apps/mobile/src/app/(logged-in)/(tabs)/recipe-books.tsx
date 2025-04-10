import { AppText } from "@/components/ui/text";
import { ChevronRight, Heart } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function RecipeBooksScreen() {
  const theme = useColorScheme();

  const likedBorderColor = theme === "dark" ? "#831843" : "#fce7f3";
  const likedBackgroundColor = theme === "dark" ? "#424242" : "#ffffff";
  const likedTextColor = theme === "dark" ? "#9ca3af" : "#6b7280";

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.likedContainer,
          {
            borderColor: likedBorderColor,
            backgroundColor: likedBackgroundColor,
          },
        ]}
      >
        <View style={styles.likedHeartContainer}>
          <LinearGradient
            style={styles.likedHeart}
            colors={["#f472b6", "#ef4444"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Heart size={32} color="white" />
          </LinearGradient>
          <View style={styles.likedTextContainer}>
            <AppText style={{ fontWeight: "bold", fontSize: 18 }}>
              Liked Recipes
            </AppText>
            <AppText style={{ color: likedTextColor }}>
              All your favorite recipes in one place
            </AppText>
          </View>
          <View style={styles.likedArrowContainer}>
            <ChevronRight color={likedTextColor} />
          </View>
        </View>
      </View>
      <View style={styles.yourBooksHeader}>
        <AppText style={styles.yourBooksHeaderText}>Your Books</AppText>
      </View>
      <View style={styles.yourBooksContainer}>
        <View style={styles.yourBooksRow}>
          <View
            style={[
              styles.yourBooksItem,
              { backgroundColor: likedBackgroundColor },
            ]}
          >
            <LinearGradient
              style={styles.yourBooksItemGradient}
              colors={["#f472b6", "#ef4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            ></LinearGradient>
            <View style={styles.yourBooksItemTextContainer}>
              <AppText>Your asdf</AppText>
              <AppText style={{ color: likedTextColor }}>12 recipes</AppText>
            </View>
          </View>
          <View
            style={[
              styles.yourBooksItem,
              { backgroundColor: likedBackgroundColor },
            ]}
          >
            <LinearGradient
              style={styles.yourBooksItemGradient}
              colors={["#f472b6", "#ef4444"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            ></LinearGradient>
            <View style={styles.yourBooksItemTextContainer}>
              <AppText>Your asdf</AppText>
              <AppText style={{ color: likedTextColor }}>12 recipes</AppText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  likedContainer: {
    borderRadius: 12,
    borderWidth: 1,
  },
  likedHeartContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  likedHeart: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  likedTextContainer: {
    flex: 1,
    marginLeft: 16,
    display: "flex",
    justifyContent: "center",
  },
  likedArrowContainer: {
    display: "flex",
    justifyContent: "center",
  },
  yourBooksHeader: {
    marginVertical: 16,
    display: "flex",
  },
  yourBooksHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    flexGrow: 1,
  },
  yourBooksContainer: {
    display: "flex",
    rowGap: 16,
  },
  yourBooksRow: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  yourBooksItem: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  yourBooksItemGradient: {
    height: 128,
    width: "100%",
  },
  yourBooksItemTextContainer: {
    padding: 12,
  },
});
