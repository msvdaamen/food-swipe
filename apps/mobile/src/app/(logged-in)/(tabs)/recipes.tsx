import { AppText } from "@/components/ui/text";
import { AppInput } from "@/components/ui/input";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Clock, Search } from "lucide-react-native";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function RecipesScreen() {
  const router = useRouter();

  const handleRecipeCardPress = () => {
    router.push("/recipe-modal");
  };

  return (
    <View style={styles.container}>
      <View>
        <AppInput placeholder="Search recipes" Icon={Search} />
      </View>
      <View style={styles.recipesContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.recipeCard}
          onPress={handleRecipeCardPress}
        >
          <Image
            style={styles.recipeImage}
            source={{
              uri: "https://static.food-swipe.app/9b9b6ccc-ac28-45af-a245-1d0dd9d00547.jpeg",
            }}
          />
          <View style={styles.recipeCardOverlay}>
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.5)"]}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0,
              }}
            />
            <View style={styles.recipeCardOverlayContent}>
              <AppText style={styles.recipeCardText}>
                Airfryer chicken 'tandoori' with rice and cucumber skyr
              </AppText>
              <View style={styles.recipeCardDetailsContainer}>
                <AppText style={styles.recipeCardDetailText}>1 cal</AppText>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Clock size={16} color="#d1d5db" />
                  <AppText style={styles.recipeCardDetailText}>25 mins</AppText>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  recipesContainer: {
    display: "flex",
    marginBottom: 4,
    gap: 16,
    marginTop: 16,
  },
  recipeCard: {
    position: "relative",
    overflow: "hidden",
  },
  recipeCardOverlay: {
    position: "absolute",
    inset: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  recipeCardOverlayContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    color: "white",
    zIndex: 100,
  },
  recipeCardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeCardDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeCardDetailText: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "bold",
  },
  recipeImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    borderRadius: 4,
  },
});
