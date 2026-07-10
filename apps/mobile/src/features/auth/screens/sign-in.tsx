import { useForm } from "@tanstack/react-form";
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import z from "zod";
import { Colors } from "@/constants/colors";
import { BlurTargetView, BlurView } from "expo-blur";
import { AppText } from "@/components/ui/text";
import { useRef } from "react";
import { AppInput } from "@/components/ui/input";
import { AppButton } from "@/components/ui/button";
import { Link } from "@react-navigation/native";
import { useSignIn } from "@/features/auth/api/sign-in";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export function SignIn() {
  const signIn = useSignIn();
  const targetRef = useRef<View | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      await signIn.mutateAsync(value);
    },
  });

  return <ImageBackground
    source={require("@assets/images/auth_background.jpg")}
    style={styles.background}
    resizeMode="cover"
  >
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
    >
      <BlurTargetView ref={targetRef}></BlurTargetView>
      <BlurView blurTarget={targetRef} intensity={50} tint="dark" blurMethod="dimezisBlurView" style={styles.contentContainer}>
        <View style={styles.header}>
          <AppText style={styles.title}>Food Swipe</AppText>
          <AppText style={styles.subtitle}>Sign in to continue</AppText>
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
                  <AppText style={styles.errorText}>
                    {field.state.meta.errors.join(", ")}
                  </AppText>
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
                  <AppText style={styles.errorText}>
                    {field.state.meta.errors.join(", ")}
                  </AppText>
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
          <AppText style={styles.footerText}>
            Don&apos;t have an account?{" "}
          </AppText>
          <Link screen="SignUp">
            <AppText style={styles.linkText}>Sign Up</AppText>
          </Link>
        </View>
      </BlurView>
  </KeyboardAvoidingView>
  </ImageBackground>
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
