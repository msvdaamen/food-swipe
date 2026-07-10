import { Clock } from "lucide-react-native";
import { FlatList, StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import { getRecipesQueryOptions } from "@/features/recipe/api/get-recipes";
import type { Recipe } from "@food-swipe/types";
import { AppText } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "@/components/skeleton";

export function RecipesScreen() {
  const { data, isPending, error } = useQuery(getRecipesQueryOptions());

  if (isPending) return <Loading />;
  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppText>{error.message}</AppText>
      </View>
    );

  return (
    <SafeAreaView>
      <FlatList
        style={styles.recipesContainer}
        data={data}
        renderItem={({ item }) => <RecipeItem recipe={item} />}
        keyExtractor={(recipe) => recipe.id.toString()}
        contentContainerStyle={{
          gap: 16,
          marginBottom: 16,
        }}
      />
    </SafeAreaView>
  );
}

function Loading() {
  return (
    <SafeAreaView>
      <View style={{ ...styles.container, gap: 16 }}>
        <Skeleton height={200} width={"100%"} />
        <Skeleton height={200} width={"100%"} />
        <Skeleton height={200} width={"100%"} />
      </View>
    </SafeAreaView>
  );
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AppText>🌀 Loading...</AppText>
    </View>
  );
}

function RecipeItem({ recipe }: { recipe: Recipe }) {
  const navigation = useNavigation();
  const coverUri = recipe.coverImageUrl ?? "";

  const handleRecipeCardPress = () => {
    navigation.navigate("RecipeScreen", {
      id: recipe.id,
      coverImageUrl: recipe.coverImageUrl ?? undefined,
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.recipeCard} onPress={handleRecipeCardPress}>
      <Image
        style={styles.recipeImage}
        source={{
          uri: coverUri,
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
            zIndex: 2,
          }}
        />
        <View style={styles.recipeCardOverlayContent}>
          <AppText style={styles.recipeCardText}>{recipe.title}</AppText>
          <View style={styles.recipeCardDetailsContainer}>
            {recipe.nutrition.energy && (
              <AppText style={styles.recipeCardDetailText}>
                {recipe.nutrition.energy.value} cal
              </AppText>
            )}
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
              <AppText style={styles.recipeCardDetailText}>
                {recipe.prepTime != null ? `${recipe.prepTime} mins` : "—"}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
    paddingHorizontal: 16,
  },
  recipeCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 4,
    height: 200,
  },
  recipeCardOverlay: {
    position: "absolute",
    inset: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recipeCardOverlayContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    color: "white",
    zIndex: 2,
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
    height: "100%",
    objectFit: "cover",
    borderRadius: 4,
    zIndex: 1,
  },
});
