import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { AppText } from "@/components/ui/text";
import { Colors } from "@/constants/colors";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { ImageBackground } from "expo-image";
import { SignUpForm } from "./sign-up-form";
import { useSignUp } from "@/features/auth/api/sign-up";

type SignUpFormValues = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export default function SignUpScreen() {
  const signUp = useSignUp();
  const router = useRouter();

  async function handleSignUp(value: SignUpFormValues) {
    try {
      await signUp.mutateAsync(value);
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ImageBackground
      source={{ uri: "auth_background" }}
      contentFit="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.title}>Food Swipe</AppText>
          <AppText style={styles.subtitle}>Sign up for a account</AppText>
        </View>
        <View style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}>
          <BlurView intensity={90} tint="dark" style={styles.form}>
            <SignUpForm onSubmit={handleSignUp} />
          </BlurView>
        </View>
        <View style={styles.footer}>
          <AppText style={{ color: Colors.gray400 }}>
            Already have an account?
          </AppText>
          <Link href="/sign-in">
            <AppText>Sign in</AppText>
          </Link>
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
    padding: 15,
    borderRadius: 12,
    gap: 16,
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
