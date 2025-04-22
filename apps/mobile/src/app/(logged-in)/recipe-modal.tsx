import { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Button, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

export default function RecipeModal() {
  const inset = useSafeAreaInsets();
  const router = useRouter();
  const theme = useColorScheme();
  const backgroundColor = theme === "dark" ? Colors.dark900 : Colors.gray50;
  const textColor = theme === "dark" ? Colors.gray50 : Colors.dark900;

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
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={["93%"]}
        enableDynamicSizing={false}
        onClose={() => router.back()}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{
          backgroundColor: textColor,
          position: "absolute",
          top: 0,
          left: "50%",
          height: 4,
          //   transform: [{ translateX: "-50%" }],
        }}

        // topInset={inset.top}
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={(i) => i}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    // backgroundColor: "green",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
