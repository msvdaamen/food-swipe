import { FText } from "@/components/f-text";
import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSignIn } from "@/features/auth/api/sign-in";

const signInSchema = type({
  email: "string.email",
  password: "string >= 1",
});

export default function SignIn() {
  const signIn = useSignIn();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "msv.daamen@outlook.com",
      password: "Gymshark98!",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await signIn.mutateAsync(value);
      if (!response.error) {
        router.replace("/");
      }
    },
  });

  return (
    <ImageBackground
      source={require("@assets/images/auth_background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <BlurView intensity={50} tint="dark" style={styles.contentContainer}>
          <View style={styles.header}>
            <FText style={styles.title}>Food Swipe</FText>
            <FText style={styles.subtitle}>Sign in to continue</FText>
          </View>

          <View style={styles.form}>
            <form.Field
              name="email"
              children={(field) => (
                <View style={styles.field}>
                  <AppInput
                    placeholder="Email"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    color="transparent"
                  />
                  {field.state.meta.errors ? (
                    <FText style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </FText>
                  ) : null}
                </View>
              )}
            />

            <form.Field
              name="password"
              children={(field) => (
                <View style={styles.field}>
                  <AppInput
                    placeholder="Password"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    secureTextEntry
                    color="transparent"
                  />
                  {field.state.meta.errors ? (
                    <FText style={styles.errorText}>
                      {field.state.meta.errors.join(", ")}
                    </FText>
                  ) : null}
                </View>
              )}
            />

            <AppButton
              onPress={form.handleSubmit}
              size="full"
              color="primary"
              style={styles.submitButton}
            >
              Sign In
            </AppButton>
          </View>

          <View style={styles.footer}>
            <FText style={styles.footerText}>
              Don&apos;t have an account?{" "}
            </FText>
            <Link href="/sign-up" replace>
              <FText style={styles.linkText}>Sign Up</FText>
            </Link>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  contentContainer: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 24,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.gray300,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 4,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: Colors.gray300,
  },
  linkText: {
    color: Colors.emerald400,
  },
});
