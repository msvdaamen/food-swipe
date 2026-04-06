import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  StyleProps,
  LayoutAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppButton } from "./ui/button";
import { Minus, Plus } from "lucide-react-native";
import { FText } from "./f-text";

const AnimatedFText = Animated.createAnimatedComponent(FText);

type Props = {
  initialValue: number;
  onChange: (value: number) => void;
};

export function NumberStepper({ initialValue, onChange }: Props) {
  const [amount, setAmount] = useState(initialValue);
  const range =
    amount > 1 ? [amount - 1, amount, amount + 1] : [amount, amount + 1];

  const changeAmount = (newAmount: number) => {
    direction.value = newAmount > amount ? 1 : 0;
    setAmount(newAmount);
    onChange(newAmount);
  };

  const direction = useSharedValue(0);

  const upAnimation = (): LayoutAnimation => {
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

  const downAnimation = (): LayoutAnimation => {
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
    <View style={styles.container}>
      <AppButton
        size="small"
        type="icon"
        onPress={() => changeAmount(amount - 1)}
        disabled={amount === 1}
      >
        <Minus size={16} color="white" />
      </AppButton>
      {range.map(
        (value) =>
          value === amount && (
            <AnimatedFText
              style={styles.text}
              key={value}
              entering={upAnimation}
              exiting={downAnimation}
            >
              {value}
            </AnimatedFText>
          ),
      )}
      <AppButton
        size="small"
        type="icon"
        onPress={() => changeAmount(amount + 1)}
      >
        <Plus size={16} color="white" />
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    width: 30,
    fontSize: 16,
    textAlign: "center",
  },
});
