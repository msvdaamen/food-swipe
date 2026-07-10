import { Suspense, useState } from "react";
import { ScrollView, StyleSheet, View, useColorScheme } from "react-native";
import { AppCheckbox } from "@/components/ui/checkbox";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NumberStepper } from "@/components/number-stepper";
import { LikeButton } from "@/components/like-button";
import type { RecipeNutrition } from "@food-swipe/types";
import { nutritionOrder } from "@food-swipe/types";
import { Skeleton } from "@/components/skeleton";
import { AppText } from "@/components/ui/text";
import { Colors } from "@/constants/colors";
import { useRecipe } from "../api/get-recipe";
import { getRecipeIngredientsQueryOptions } from "../api/get-recipe-ingredients";
import { getRecipeStepsQueryOptions } from "../api/get-recipe-steps";
import { getRecipeNutritionQueryOptions } from "../api/get-recipe-nutrition";
import { StaticScreenProps } from "@react-navigation/native";
import { Image } from "expo-image";

type Props = StaticScreenProps<{
  id: string;
  coverImageUrl?: string;
}>;
export function RecipeScreen({ route }: Props) {
  const { id: recipeId, coverImageUrl } = route.params;

  const { data: recipe } = useRecipe({ recipeId: recipeId ?? "" }, { enabled: Boolean(recipeId) });
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? Colors.stone950 : Colors.gray50;
  const [isLiked, setIsLiked] = useState(false);

  const imageUri = coverImageUrl || recipe?.coverImageUrl;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollContainer} scrollEventThrottle={16}>
        {imageUri ? (
          <Image
            style={styles.recipeImage}
            source={{
              uri: imageUri,
            }}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.recipeImage, { backgroundColor: Colors.gray200 }]} />
        )}
        {recipe && (
          <View style={[styles.contentContainer]}>
            <View style={styles.headerContainer}>
              <AppText style={styles.headerTitle}>{recipe.title}</AppText>
              <LikeButton isLiked={isLiked} onChange={setIsLiked} />
            </View>
            {recipe.nutrition.energy && (
              <AppText style={styles.caloriesText}>
                {recipe.nutrition.energy?.value} calories
              </AppText>
            )}
            <AppText style={styles.descriptionText}>{recipe.description ?? ""}</AppText>
            <Suspense fallback={<Loader />}>
              <Ingredients id={recipe.id} servings={recipe.servings ?? 1} />
              <Steps id={recipe.id} />
              <Nutritions id={recipe.id} />
            </Suspense>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const Ingredients = ({ id, servings }: { id: string; servings: number }) => {
  const { data: ingredients } = useSuspenseQuery(getRecipeIngredientsQueryOptions(id));
  const [checked, setChecked] = useState(true);
  const [amount, setAmount] = useState(servings);

  function formatAmount(ingredientAmount: number) {
    const caculatedAmount = (ingredientAmount / servings) * amount;
    const isFloat = caculatedAmount % 1 !== 0;
    return isFloat ? caculatedAmount.toFixed(1) : caculatedAmount;
  }

  return (
    <View style={styles.ingredientsContainer}>
      <AppText style={styles.ingredientsTitle}>Ingredients</AppText>
      <NumberStepper initialValue={amount} onChange={setAmount} />
      {ingredients.map((ingredient) => (
        <View key={ingredient.ingredientId} style={styles.ingredientRow}>
          <View style={styles.checkboxContainer}>
            <AppCheckbox value={checked} onValueChange={setChecked} color={Colors.emerald500} />
          </View>
          <View style={styles.amountContainer}>
            <AppText style={styles.amountText}>
              {formatAmount(ingredient.amount)} {ingredient.measurement}
            </AppText>
          </View>
          <View style={styles.nameContainer}>
            <AppText style={styles.nameText}>{ingredient.ingredient}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
};

const Steps = ({ id }: { id: string }) => {
  const { data: steps } = useSuspenseQuery(getRecipeStepsQueryOptions(id));

  const theme = useColorScheme();
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <View style={styles.stepsContainer}>
      <AppText style={styles.stepsTitle}>Steps</AppText>
      {steps.map((step) => (
        <View key={step.id} style={styles.stepRow}>
          <View style={[styles.stepNumberContainer, { borderColor: textColor }]}>
            <AppText style={[styles.stepNumberText]}>{step.stepNumber}</AppText>
          </View>
          <AppText style={[styles.stepText]}>{step.description}</AppText>
        </View>
      ))}
    </View>
  );
};

const Nutritions = ({ id }: { id: string }) => {
  const { data: recipeNutrition } = useSuspenseQuery(getRecipeNutritionQueryOptions(id));

  const nutritionMap = new Map<string, RecipeNutrition>(
    recipeNutrition.map((nutrition) => [nutrition.name, nutrition]),
  );
  const nutritions: RecipeNutrition[] = [];
  for (const name of nutritionOrder) {
    const nutrition = nutritionMap.get(name);
    if (nutrition) {
      nutritions.push(nutrition);
    }
  }
  return (
    <View style={styles.nutritionsContainer}>
      <AppText style={styles.nutritionsTitle}>Nutritions</AppText>
      {nutritions.map((nutrition, index) => (
        <View key={index} style={styles.nutritionsRow}>
          <AppText style={styles.nutritionsItemTitle}>{nutrition.name}</AppText>
          <AppText>{nutrition.value}</AppText>
          <AppText>{nutrition.unit}</AppText>
        </View>
      ))}
    </View>
  );
};

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <Skeleton height={18} width={150} />
      <Skeleton height={30} width={200} />
      <Skeleton height={18} width={"100%"} />
      <Skeleton height={18} width={"100%"} />
      <Skeleton height={18} width={"100%"} />
      <Skeleton height={18} width={"100%"} />
      <Skeleton style={{ marginTop: 8 }} height={18} width={100} />
      <Skeleton height={40} width={"100%"} />
      <Skeleton height={40} width={"100%"} />
      <Skeleton height={40} width={"100%"} />
      <Skeleton height={40} width={"100%"} />
      <Skeleton height={40} width={"100%"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContainer: {
    flex: 1,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  recipeImage: {
    width: "100%",
    maxHeight: 300,
    height: "100%",
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    gap: 2,
    flexDirection: "row",
  },
  headerTitle: {
    flex: 1,
    fontFamily: "RobotoBold",
    fontSize: 24,
  },
  caloriesText: {
    fontSize: 16,
    color: Colors.gray400,
    marginBottom: 8,
  },
  descriptionText: {
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ingredientAmountText: {
    width: 30,
    fontSize: 16,
    textAlign: "center",
  },
  ingredientsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontFamily: "RobotoBold",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  amountText: {
    fontSize: 16,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
  },
  stepsContainer: {
    gap: 8,
    marginBottom: 8,
  },
  stepsTitle: {
    fontSize: 18,
    fontFamily: "RobotoBold",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "100%",
    borderWidth: 2,
  },
  stepNumberText: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "RobotoBold",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
  nutritionsContainer: {
    gap: 8,
    marginBottom: 8,
  },
  nutritionsTitle: {
    fontSize: 18,
    fontFamily: "RobotoBold",
  },
  nutritionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nutritionsItemTitle: {
    flex: 1,
  },
  loaderContainer: {
    marginTop: 16,
    gap: 8,
  },
});
