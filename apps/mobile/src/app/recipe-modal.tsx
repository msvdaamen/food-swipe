import { useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  EntryAnimationsValues,
  ExitAnimationsValues,
  interpolateColor,
  LayoutAnimation,
  SharedValue,
  StyleProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { AppButton } from "@/components/ui/button";
import { ArrowLeft, Heart, Minus, Plus } from "lucide-react-native";
import { AppCheckbox } from "@/components/ui/checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/theme";
import { FText } from "@/components/f-text";

interface RecipeModalHeaderProps {
  scrollY: SharedValue<number>;
}

const AnimatedHeardIcon = Animated.createAnimatedComponent(Heart);
const AnimatedFText = Animated.createAnimatedComponent(FText);

export function RecipeModalHeader({ scrollY }: RecipeModalHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme();
  const borderColor = theme === "dark" ? Colors.stone800 : Colors.stone200;
  const backgroundColor = theme === "dark" ? Colors.stone900 : Colors.gray50;
  const textColor = theme === "dark" ? "white" : "black";

  const barStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [195, 210],
        ["transparent", backgroundColor],
      ),
      borderBottomColor: scrollY.value > 210 ? borderColor : "transparent",
    };
  });

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 2,
      }}
    >
      <View style={{ position: "relative" }}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.5)", "transparent"]}
          style={{
            width: "100%",
            height: 100,
            position: "absolute",
            inset: 0,
          }}
        />
        <Animated.View
          style={[
            {
              paddingTop: insets.top,
              paddingHorizontal: 16,
              paddingBottom: 8,
              position: "absolute",
              width: "100%",
              borderBottomWidth: 1,
            },
            barStyle,
          ]}
        >
          <AppButton
            color="transparent"
            type="icon"
            onPress={() => router.back()}
          >
            <ArrowLeft color={textColor} />
          </AppButton>
        </Animated.View>
      </View>
    </View>
  );
}

export default function RecipeModal() {
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? Colors.stone900 : Colors.gray50;
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      scrollY.set(contentOffset.y);
    },
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/*<RecipeModalHeader scrollY={scrollY} />*/}
      <Animated.ScrollView
        style={styles.scrollContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Animated.Image
          style={styles.recipeImage}
          source={{
            uri: "https://static-dev.food-swipe.app/9c55494e-21f3-4d96-be6b-d423b7df02a3.jpeg",
          }}
        />
        <Animated.View style={[styles.contentContainer]}>
          <View style={styles.headerContainer}>
            <FText style={styles.headerTitle}>
              Airfryer chicken 'tandoori' with rice and cucumber skyr
            </FText>
            <LikeButton />
          </View>
          <FText style={styles.caloriesText}>1000 calories</FText>
          <FText style={styles.descriptionText}>
            This healthy dinner is inspired by Indian chicken tandoori. You
            easily cook the chicken and vegetables in the airfryer and serve it
            with rice and a refreshing cucumber sauce.
          </FText>
          <Ingredients />
          <Steps />
          <Nutritions />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

function LikeButton() {
  const [liked, setLiked] = useState(false);

  const shakeValue = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: shakeValue.value.toString() + "deg" }],
  }));

  const likePressed = () => {
    setLiked(!liked);
    if (!liked) {
      shakeValue.value = withSequence(
        withTiming(-20, { duration: 50 }),
        withRepeat(withTiming(20, { duration: 100 }), 3, true),
        withTiming(0, { duration: 50 }),
      );
    }
  };

  return (
    <AppButton color="transparent" type="icon" onPress={() => likePressed()}>
      <AnimatedHeardIcon
        size={30}
        color={Colors.red500}
        fill={liked ? Colors.red500 : "transparent"}
        style={[animatedStyles]}
      />
    </AppButton>
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
  const [amount, setAmount] = useState(2);
  const range =
    amount > 1 ? [amount - 1, amount, amount + 1] : [amount, amount + 1];

  const changeAmount = (newAmount: number) => {
    direction.value = newAmount > amount ? 1 : 0;
    setAmount(newAmount);
  };

  const direction = useSharedValue(0);

  const upAnimation = (values: EntryAnimationsValues): LayoutAnimation => {
    "worklet";
    const animations: StyleProps = {
      transform: [
        {
          translateY: withTiming("0%", { duration: 100 }),
        },
        {
          rotateX: withTiming("0deg", { duration: 100 }),
        },
      ],
    };
    const initialValues: StyleProps = {
      transform: [
        {
          translateY: direction.value === 1 ? "-100%" : "100%",
        },
        {
          rotateX: direction.value === 1 ? "90deg" : "-90deg",
        },
      ],
    };

    return {
      initialValues,
      animations,
    };
  };

  const downAnimation = (values: ExitAnimationsValues): LayoutAnimation => {
    "worklet";
    const animations: StyleProps = {
      transform: [
        {
          translateY: withTiming(direction.value === 1 ? "100%" : "-100%", {
            duration: 100,
          }),
        },
        {
          rotateX: withTiming(direction.value === 1 ? "90deg" : "-90deg", {
            duration: 100,
          }),
        },
      ],
    };
    const initialValues: StyleProps = {
      transform: [
        {
          translateY: "0%",
        },
        {
          rotateX: "0deg",
        },
      ],
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <View style={styles.ingredientsContainer}>
      <FText style={styles.ingredientsTitle}>Ingredients</FText>
      <View style={styles.amountContainer}>
        <AppButton
          size="small"
          type="icon"
          onPress={() => changeAmount(amount - 1)}
          disabled={amount === 1}
        >
          <Minus size={16} color="white" />
        </AppButton>
        {range.map((value) =>
          value === amount ? (
            <AnimatedFText
              style={styles.ingredientAmountText}
              key={value}
              entering={upAnimation}
              exiting={downAnimation}
            >
              {value}
            </AnimatedFText>
          ) : null,
        )}
        <AppButton
          size="small"
          type="icon"
          onPress={() => changeAmount(amount + 1)}
        >
          <Plus size={16} color="white" />
        </AppButton>
      </View>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <View style={styles.checkboxContainer}>
            <AppCheckbox
              value={checked}
              onValueChange={setChecked}
              color={Colors.emerald500}
            />
          </View>
          <View style={styles.amountContainer}>
            <FText style={styles.amountText}>
              {ingredient.amount} {ingredient.unit}
            </FText>
          </View>
          <View style={styles.nameContainer}>
            <FText style={styles.nameText}>{ingredient.name}</FText>
          </View>
        </View>
      ))}
    </View>
  );
};

const Steps = () => {
  const theme = useColorScheme();
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <View style={styles.stepsContainer}>
      <FText style={styles.stepsTitle}>Steps</FText>
      <View style={styles.stepRow}>
        <View style={[styles.stepNumberContainer, { borderColor: textColor }]}>
          <FText style={[styles.stepNumberText]}>1</FText>
        </View>
        <FText style={[styles.stepText]}>
          Halve the chicken thighs and place them in a boHalve the chicken
          thighs and place them in a bowl. Add the tandoori masala, skyr, and
          vinegar. Grate the garlic on top and mix everything well.wl. Add the
          tandoori masala, skyr, and vinegar. Grate the garlic on top and mix
          everything well.
        </FText>
      </View>
    </View>
  );
};

const Nutritions = () => {
  return (
    <View style={styles.nutritionsContainer}>
      <FText style={styles.nutritionsTitle}>Nutritions</FText>
      {Array.from({ length: 10 }).map((_, index) => (
        <View key={index} style={styles.nutritionsRow}>
          <FText style={styles.nutritionsItemTitle}>Calories</FText>
          <FText>1000</FText>
          <FText>g</FText>
        </View>
      ))}
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
});
