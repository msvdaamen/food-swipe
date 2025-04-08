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

{
  /* <div
  className="overflow-hidden rounded-xl border border-pink-100 bg-white shadow-md dark:border-pink-900 dark:bg-dark-800"
  tabIndex="0"
>
  <div className="flex items-center p-4">
    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-400 to-red-500">
      <fa-icon size="2xl" class="ng-fa-icon text-white">
        <svg
          role="img"
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          data-icon="heart"
          className="svg-inline--fa fa-heart fa-2xl"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
          ></path>
        </svg>
      </fa-icon>
    </div>
    <div className="ml-4 flex-1">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {" "}
        Liked Recipes{" "}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {" "}
        All your favorite recipes in one place{" "}
      </p>
    </div>
    <div className="text-gray-400 dark:text-gray-500">
      <fa-icon class="ng-fa-icon">
        <svg
          role="img"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="chevron-right"
          className="svg-inline--fa fa-chevron-right"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
          ></path>
        </svg>
      </fa-icon>
    </div>
  </div>
</div>; */
}
