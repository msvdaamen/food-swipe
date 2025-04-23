import { useCallback, useRef, useMemo, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  BackHandler,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import Animated from "react-native-reanimated";
import { AppText } from "@/components/ui/text";
import { AppButton } from "@/components/ui/button";
import { Heart, Minus, Plus } from "lucide-react-native";
import Checkbox from "expo-checkbox";
import { AppCheckbox } from "@/components/ui/checkbox";

export default function RecipeModal() {
  const router = useRouter();
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? Colors.dark900 : Colors.gray50;

  const sheetRef = useRef<BottomSheet>(null);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        sheetRef.current?.close();
        return false;
      }
    );

    return () => backHandler.remove();
  });
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={["94%"]}
        enableDynamicSizing={false}
        onClose={() => router.back()}
        enablePanDownToClose={true}
        backdropComponent={(e) => (
          <BottomSheetBackdrop
            animatedIndex={e.animatedIndex}
            animatedPosition={e.animatedPosition}
            opacity={0}
          />
        )}
        backgroundStyle={{
          backgroundColor,
        }}
        handleStyle={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          borderRadius: 100,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors.gray500,
        }}
      >
        <BottomSheetScrollView>
          <Animated.Image
            style={styles.recipeImage}
            source={{
              uri: "https://static.food-swipe.app/9b9b6ccc-ac28-45af-a245-1d0dd9d00547.jpeg",
            }}
            sharedTransitionTag="tag"
          />
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <AppText style={styles.headerTitle}>
                Airfryer chicken 'tandoori' with rice and cucumber skyr
              </AppText>
              <AppButton color="transparent" type="icon">
                <Heart size={30} color={Colors.red500} />
              </AppButton>
            </View>
            <AppText style={styles.caloriesText}>1000 calories</AppText>
            <AppText style={styles.descriptionText}>
              This healthy dinner is inspired by Indian chicken tandoori. You
              easily cook the chicken and vegetables in the airfryer and serve
              it with rice and a refreshing cucumber sauce.
            </AppText>
            <Ingredients />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const Ingredients = () => {
  const ingredients = [
    { amount: 2, unit: "tbsp", name: "olive oil" },
    { amount: 1, unit: "tsp", name: "garam masala" },
    { amount: 2, unit: "tbsp", name: "tandoori paste" },
    { amount: 4, unit: "pieces", name: "chicken thighs" },
    { amount: 200, unit: "g", name: "rice" },
    { amount: 1, unit: "piece", name: "cucumber" },
    { amount: 200, unit: "g", name: "skyr" },
  ];
  const [checked, setChecked] = useState(true);

  return (
    <View style={styles.ingredientsContainer}>
      <AppText style={styles.ingredientsTitle}>Ingredients</AppText>
      <View style={styles.amountContainer}>
        <AppButton size="small" type="icon">
          <Minus size={16} color="white" />
        </AppButton>
        <AppText style={styles.ingredientAmountText}>10</AppText>
        <AppButton size="small" type="icon">
          <Plus size={16} color="white" />
        </AppButton>
      </View>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <View style={styles.checkboxContainer}>
            <AppCheckbox value={checked} onValueChange={setChecked} />
          </View>
          <View style={styles.amountContainer}>
            <AppText style={styles.amountText}>
              {ingredient.amount} {ingredient.unit}
            </AppText>
          </View>
          <View style={styles.nameContainer}>
            <AppText style={styles.nameText}>{ingredient.name}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  recipeImage: {
    width: "100%",
    height: 300,
    objectFit: "cover",
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
    fontWeight: "bold",
    fontSize: 24,
  },
  caloriesText: {
    fontSize: 16,
    color: Colors.gray400,
  },
  descriptionText: {
    marginBottom: 8,
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
    marginBottom: 8,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
});
