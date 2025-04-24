import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { AppText } from "@/components/ui/text";
import { Colors } from "@/constants/colors";
import { BlurView } from "expo-blur";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { ImageBackground } from "expo-image";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Spinner } from "@/components/spinner";
import { useSignIn } from "@/features/auth/api/sign-in";

const validator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function SignInScreen() {
  const signIn = useSignIn();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: validator,
    },
    onSubmit: async ({ value }) => {
      const res = await signIn.mutateAsync({
        email: value.email,
        password: value.password,
      });
      console.log(res);
      router.replace("/");
    },
  });

  return (
    <ImageBackground
      source={{ uri: "auth_background" }}
      contentFit="cover"
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AppText style={styles.title}>Food Swipe</AppText>
            <AppText style={styles.subtitle}>Sign in to your account</AppText>
          </View>
          <View style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}>
            <BlurView intensity={90} tint="dark" style={styles.form}>
              <form.Field
                name="email"
                children={(field) => (
                  <AppInput
                    id={field.name}
                    color="transparent"
                    placeholder="example@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                  >
                    Email
                  </AppInput>
                )}
              />
              <form.Field
                name="password"
                children={(field) => (
                  <AppInput
                    id={field.name}
                    color="transparent"
                    placeholder="Password"
                    secureTextEntry={true}
                    value={field.state.value}
                    onChangeText={field.handleChange}
                  >
                    Password
                  </AppInput>
                )}
              />
              <AppText style={styles.forgotPassword}>Forgot password?</AppText>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <AppButton
                    size="full"
                    disabled={!canSubmit}
                    onPress={form.handleSubmit}
                    PreIcon={isSubmitting && <Spinner />}
                  >
                    Sign in
                  </AppButton>
                )}
              />
            </BlurView>
          </View>
          <View style={styles.footer}>
            <AppText style={{ color: Colors.gray400 }}>
              Don't have an account?
            </AppText>
            <Link href="/sign-up">
              <AppText>Sign up</AppText>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
    height: "100%",
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
