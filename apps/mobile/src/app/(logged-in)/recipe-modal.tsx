import { useState } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { AppText } from '@/components/ui/text';
import { AppButton } from '@/components/ui/button';
import { ArrowLeft, Heart, Minus, Plus } from 'lucide-react-native';
import { AppCheckbox } from '@/components/ui/checkbox';
import { LinearGradient } from 'expo-linear-gradient';

interface RecipeModalHeaderProps {
  scrollY: SharedValue<number>;
}

export function RecipeModalHeader({ scrollY }: RecipeModalHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme();
  const borderColor = theme === 'dark' ? Colors.dark800 : Colors.dark200;
  const backgroundColor = theme === 'dark' ? Colors.dark900 : Colors.gray50;
  const textColor = theme === 'dark' ? 'white' : 'black';

  const barStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [195, 210],
        ['transparent', backgroundColor]
      ),
      borderBottomColor: scrollY.value > 210 ? borderColor : 'transparent',
    };
  });

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 2,
      }}
    >
      <View style={{ position: 'relative' }}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
          style={{
            width: '100%',
            height: 100,
            position: 'absolute',
            inset: 0,
          }}
        />
        <Animated.View
          style={[
            {
              paddingTop: insets.top,
              paddingHorizontal: 16,
              paddingBottom: 8,
              position: 'absolute',
              width: '100%',
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
  const [liked, setLiked] = useState(false);
  const backgroundColor = theme === 'dark' ? Colors.dark900 : Colors.gray50;
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      scrollY.set(contentOffset.y);
    },
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <RecipeModalHeader scrollY={scrollY} />
      <Animated.ScrollView
        style={styles.scrollContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Animated.Image
          style={styles.recipeImage}
          source={{
            uri: 'https://static.food-swipe.app/9b9b6ccc-ac28-45af-a245-1d0dd9d00547.jpeg',
          }}
          sharedTransitionTag="tag"
        />
        <Animated.View style={[styles.contentContainer]}>
          <View style={styles.headerContainer}>
            <AppText style={styles.headerTitle}>
              Airfryer chicken 'tandoori' with rice and cucumber skyr
            </AppText>
            <AppButton
              color="transparent"
              type="icon"
              onPress={() => setLiked(!liked)}
            >
              <Heart
                size={30}
                color={Colors.red500}
                fill={liked ? Colors.red500 : 'transparent'}
              />
            </AppButton>
          </View>
          <AppText style={styles.caloriesText}>1000 calories</AppText>
          <AppText style={styles.descriptionText}>
            This healthy dinner is inspired by Indian chicken tandoori. You
            easily cook the chicken and vegetables in the airfryer and serve it
            with rice and a refreshing cucumber sauce.
          </AppText>
          <Ingredients />
          <Steps />
          <Nutritions />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const Ingredients = () => {
  const ingredients = [
    { amount: 2, unit: 'tbsp', name: 'olive oil' },
    { amount: 1, unit: 'tsp', name: 'garam masala' },
    { amount: 2, unit: 'tbsp', name: 'tandoori paste' },
    { amount: 4, unit: 'pieces', name: 'chicken thighs' },
    { amount: 200, unit: 'g', name: 'rice' },
    { amount: 1, unit: 'piece', name: 'cucumber' },
    { amount: 200, unit: 'g', name: 'skyr' },
  ];
  const [checked, setChecked] = useState(true);
  const [amount, setAmount] = useState(2);

  return (
    <View style={styles.ingredientsContainer}>
      <AppText style={styles.ingredientsTitle}>Ingredients</AppText>
      <View style={styles.amountContainer}>
        <AppButton
          size="small"
          type="icon"
          onPress={() => setAmount(amount - 1)}
          disabled={amount === 1}
        >
          <Minus size={16} color="white" />
        </AppButton>
        <AppText style={styles.ingredientAmountText}>{amount}</AppText>
        <AppButton
          size="small"
          type="icon"
          onPress={() => setAmount(amount + 1)}
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

const Steps = () => {
  const theme = useColorScheme();
  const textColor = theme === 'dark' ? 'white' : 'black';

  return (
    <View style={styles.stepsContainer}>
      <AppText style={styles.stepsTitle}>Steps</AppText>
      <View style={styles.stepRow}>
        <View style={[styles.stepNumberContainer, { borderColor: textColor }]}>
          <AppText style={[styles.stepNumberText]}>1</AppText>
        </View>
        <AppText style={[styles.stepText]}>
          Halve the chicken thighs and place them in a boHalve the chicken
          thighs and place them in a bowl. Add the tandoori masala, skyr, and
          vinegar. Grate the garlic on top and mix everything well.wl. Add the
          tandoori masala, skyr, and vinegar. Grate the garlic on top and mix
          everything well.
        </AppText>
      </View>
    </View>
  );
};

const Nutritions = () => {
  return (
    <View style={styles.nutritionsContainer}>
      <AppText style={styles.nutritionsTitle}>Nutritions</AppText>
      {Array.from({ length: 100 }).map((_, index) => (
        <View key={index} style={styles.nutritionsRow}>
          <AppText style={styles.nutritionsItemTitle}>Calories</AppText>
          <AppText>1000</AppText>
          <AppText>g</AppText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
  recipeImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    borderRadius: 4,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    gap: 2,
    flexDirection: 'row',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'RobotoBold',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ingredientAmountText: {
    width: 30,
    fontSize: 16,
    textAlign: 'center',
  },
  ingredientsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontFamily: 'RobotoBold',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'RobotoBold',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
    borderWidth: 2,
  },
  stepNumberText: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'RobotoBold',
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
    fontFamily: 'RobotoBold',
  },
  nutritionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nutritionsItemTitle: {
    flex: 1,
  },
});
