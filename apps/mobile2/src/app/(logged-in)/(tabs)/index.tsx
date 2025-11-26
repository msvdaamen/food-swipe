import { AppText } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  console.log("home screen");

  return (
    <View style={styles.container}>
      <AppText style={styles.title} onPress={() => router.navigate("/sign-in")}>
        Home
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
