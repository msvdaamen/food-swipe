import { useCallback, useRef, useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  useColorScheme,
  BackHandler,
  Image,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import Animated from "react-native-reanimated";

export default function RecipeModal() {
  const inset = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? Colors.dark900 : Colors.gray50;
  const textColor = theme === "dark" ? Colors.gray500 : Colors.dark900;

  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(20)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  // render
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     () => {
  //       sheetRef.current?.close();
  //       return true;
  //     }
  //   );

  //   return () => backHandler.remove();
  // });
  return (
    // <GestureHandlerRootView style={styles.container}>
    //   <BottomSheet
    //     ref={sheetRef}
    //     snapPoints={["93%"]}
    //     enableDynamicSizing={false}
    //     onClose={() => router.back()}
    //     enablePanDownToClose={true}
    //     animateOnMount={false}
    //     animationConfigs={{
    //       velocity: 0.5,
    //     }}
    //     backdropComponent={(e) => (
    //       <BottomSheetBackdrop
    //         animatedIndex={e.animatedIndex}
    //         animatedPosition={e.animatedPosition}
    //         opacity={0}
    //       />
    //     )}
    //     backgroundStyle={{
    //       backgroundColor,
    //     }}
    //     handleStyle={{
    //       position: "absolute",
    //       top: 0,
    //       left: 0,
    //       right: 0,
    //       height: 40,
    //       borderRadius: 100,
    //     }}
    //     handleIndicatorStyle={{
    //       backgroundColor: Colors.gray500,
    //     }}

    //     // topInset={inset.top}
    //   >
    //     <BottomSheetScrollView>
    <Animated.Image
      style={styles.recipeImage}
      source={{
        uri: "https://static.food-swipe.app/9b9b6ccc-ac28-45af-a245-1d0dd9d00547.jpeg",
      }}
      sharedTransitionTag="tag"
    />
    //     </BottomSheetScrollView>
    //   </BottomSheet>
    // </GestureHandlerRootView>
  );
}

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
    // height: 200,
    objectFit: "cover",
    borderRadius: 4,
    aspectRatio: 2 / 1,
    position: "absolute",
    bottom: 0,
  },
});
