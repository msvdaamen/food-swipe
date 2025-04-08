import { AppText } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View style={{ paddingTop: insets.top }}>
      <AppText>Sign Up</AppText>
      <AppText onPress={() => navigation.navigate("SignIn")}>Sign In</AppText>
    </View>
  );
}
