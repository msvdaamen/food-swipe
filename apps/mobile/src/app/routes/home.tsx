import { AppText } from "@/components/ui/text";
import { useClerk } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

export function HomeScreen() {
  const { signOut } = useClerk();
  const navigation = useNavigation();

  signOut();

  return (
    <View style={styles.container}>
      <AppText
        style={styles.title}
        onPress={() => navigation.navigate("SignIn")}
      >
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
