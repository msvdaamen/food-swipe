import { Suspense, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { AppCheckbox } from "@/components/ui/checkbox";
import { Colors } from "@/constants/theme";
import { FText } from "@/components/f-text";
import { useRecipe } from "@/features/recipe/api/get-recipe";
import { useLocalSearchParams } from "expo-router";
import { getRecipeIngredientsOptions } from "@/features/recipe/api/get-recipe-ingredients";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NumberStepper } from "@/components/number-stepper";
import { LikeButton } from "@/components/like-button";
import { getRecipeStepsOptions } from "@/features/recipe/api/get-recipe-steps";
import { RecipeNutrition } from "@/features/recipe/types/recipe-nutrition.type";
import { nutritionOrder } from "@/features/recipe/constants/nutritions";
import { getRecipeNutritionOptions } from "@/features/recipe/api/get-recipe-nutrition";
import { Skeleton } from "@/components/skeleton";

export default function RecipeModal() {
  const { id: recipeId, coverImageUrl } = useLocalSearchParams<{
    id: string;
    coverImageUrl?: string;
  }>();
  const { data: recipe } = useRecipe(recipeId);
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? Colors.stone950 : Colors.gray50;
  const [isLiked, setIsLiked] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollContainer} scrollEventThrottle={16}>
        <Image
          style={styles.recipeImage}
          source={{
            uri: coverImageUrl || recipe?.coverImageUrl,
          }}
        />
        {recipe && (
          <View style={[styles.contentContainer]}>
            <View style={styles.headerContainer}>
              <FText style={styles.headerTitle}>{recipe.title}</FText>
              <LikeButton isLiked={isLiked} onChange={setIsLiked} />
            </View>
            {recipe.nutrition.energy && (
              <FText style={styles.caloriesText}>
                {recipe.nutrition.energy?.value} calories
              </FText>
            )}
            <FText style={styles.descriptionText}>{recipe.description}</FText>
            <Suspense fallback={<Loader />}>
              <Ingredients id={recipe.id} servings={recipe.servings} />
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
  const { data: ingredients } = useSuspenseQuery(
    getRecipeIngredientsOptions(id),
  );
  const [checked, setChecked] = useState(true);
  const [amount, setAmount] = useState(servings);

  function formatAmount(ingredientAmount: number) {
    const caculatedAmount = (ingredientAmount / servings) * amount;
    const isFloat = caculatedAmount % 1 !== 0;
    return isFloat ? caculatedAmount.toFixed(1) : caculatedAmount;
  }

  return (
    <View style={styles.ingredientsContainer}>
      <FText style={styles.ingredientsTitle}>Ingredients</FText>
      <NumberStepper initialValue={amount} onChange={setAmount} />
      {ingredients.map((ingredient, index) => (
        <View key={ingredient.ingredientId} style={styles.ingredientRow}>
          <View style={styles.checkboxContainer}>
            <AppCheckbox
              value={checked}
              onValueChange={setChecked}
              color={Colors.emerald500}
            />
          </View>
          <View style={styles.amountContainer}>
            <FText style={styles.amountText}>
              {formatAmount(ingredient.amount)} {ingredient.measurement}
            </FText>
          </View>
          <View style={styles.nameContainer}>
            <FText style={styles.nameText}>{ingredient.ingredient}</FText>
          </View>
        </View>
      ))}
    </View>
  );
};

const Steps = ({ id }: { id: string }) => {
  const { data: steps } = useSuspenseQuery(getRecipeStepsOptions(id));

  const theme = useColorScheme();
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <View style={styles.stepsContainer}>
      <FText style={styles.stepsTitle}>Steps</FText>
      {steps.map((step) => (
        <View key={step.id} style={styles.stepRow}>
          <View
            style={[styles.stepNumberContainer, { borderColor: textColor }]}
          >
            <FText style={[styles.stepNumberText]}>{step.stepNumber}</FText>
          </View>
          <FText style={[styles.stepText]}>{step.description}</FText>
        </View>
      ))}
    </View>
  );
};

const Nutritions = ({ id }: { id: string }) => {
  const { data: recipeNutrition } = useSuspenseQuery(
    getRecipeNutritionOptions(id),
  );

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
      <FText style={styles.nutritionsTitle}>Nutritions</FText>
      {nutritions.map((nutrition, index) => (
        <View key={index} style={styles.nutritionsRow}>
          <FText style={styles.nutritionsItemTitle}>{nutrition.name}</FText>
          <FText>{nutrition.value}</FText>
          <FText>{nutrition.unit}</FText>
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
    height: 400,
    objectFit: "fill",
    borderRadius: 4,
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
