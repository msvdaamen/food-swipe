import { AppText } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ paddingTop: insets.top }}>
      <AppText onPress={() => navigation.navigate("HomeTabs")}>Home</AppText>
      <AppText>Sign In</AppText>
      <AppText
        onPress={() =>
          navigation.reset({ index: 1, routes: [{ name: "SignUp" }] })
        }
      >
        Sign Up
      </AppText>
    </View>
  );
}
