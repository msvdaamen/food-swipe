import { FText } from "@/components/f-text";
import { useRouter } from "expo-router";
import { Clock } from "lucide-react-native";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FView } from "@/components/f-view";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRecipesQueryOptions } from "@/features/recipe/api/get-recipes";
import { Suspense } from "react";
import { Recipe } from "@/features/recipe/types/recipe.type";

export default function RecipesView() {
  return (
    <Suspense fallback={<Loading />}>
      <RecipesList />
    </Suspense>
  );
}

function Loading() {
  return <FText>🌀 Loading...</FText>;
}

function RecipesList() {
  // const data = [{ id: 1 }];
  const { data, isLoading, error } = useSuspenseQuery(getRecipesQueryOptions());

  // if (isLoading) return <Loading />;

  // if (error) return <FText>Error...</FText>;

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

function RecipeItem({ recipe }: { recipe: Recipe }) {
  const router = useRouter();

  const handleRecipeCardPress = () => {
    router.navigate("/recipe-modal");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.recipeCard}
      onPress={handleRecipeCardPress}
    >
      <Image
        style={styles.recipeImage}
        source={{
          uri: recipe.coverImageUrl,
        }}
      />
      <FView style={styles.recipeCardOverlay}>
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
          <FText style={styles.recipeCardText}>
            Airfryer chicken 'tandoori' with rice and cucumber skyr
          </FText>
          <View style={styles.recipeCardDetailsContainer}>
            <FText style={styles.recipeCardDetailText}>1 cal</FText>
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
              <FText style={styles.recipeCardDetailText}>25 mins</FText>
            </View>
          </View>
        </View>
      </FView>
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
    height: 200,
    objectFit: "cover",
    borderRadius: 4,
    zIndex: 1,
  },
});
