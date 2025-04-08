import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { AppText } from "@/components/ui/text";
import { Colors } from "@/constants/colors";
import { Link, useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";

export function SignUpScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../../../assets/images/auth-background.jpg")}
      resizeMode="cover"
      style={styles.background}
      onError={console.error}
      onLoad={console.log}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.title}>Food Swipe</AppText>
          <AppText style={styles.subtitle}>Sign up for a account</AppText>
        </View>
        <View style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}>
          <BlurView intensity={90} tint="dark" style={styles.form}>
            <AppInput
              color="transparent"
              placeholder="example@email.com"
              keyboardType="email-address"
            >
              Email
            </AppInput>
            <AppInput
              color="transparent"
              placeholder="Password"
              secureTextEntry={true}
            >
              Password
            </AppInput>
            <AppText style={styles.forgotPassword}>Forgot password?</AppText>
            <AppButton size="full" onPress={() => {}}>
              Sign in
            </AppButton>
          </BlurView>
        </View>
        <View style={styles.footer}>
          <AppText style={{ color: Colors.gray400 }}>
            Don't have an account?
          </AppText>
          <Pressable onPress={() => navigation.navigate("SignIn")}>
            <AppText>Sign in</AppText>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 24,
  },
  form: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    borderRadius: 12,
    gap: 16,
  },
  // forgotPasswordContainer: {
  //   width: "100%",
  //   alignItems: "flex-end",
  // },
  forgotPassword: {
    width: "100%",
    textAlign: "right",
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
