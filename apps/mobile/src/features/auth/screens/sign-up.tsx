import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { BlurView } from "expo-blur";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AppText } from "@/components/ui/text";
import { Colors } from "@/constants/colors";
import { Link, StackActions } from "@react-navigation/native";
import { useSignUp } from "@/features/auth/api/sign-up";

const signUpSchema = z.object({
  email: z.email(),
  username: z.string().regex(/^[a-z0-9_-]{3,30}$/),
  password: z.string().min(6),
  passwordConfirmation: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export function SignUp() {
  const signUp = useSignUp();

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
      firstName: "",
      lastName: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      await signUp.mutateAsync(value);
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BlurView intensity={50} tint="dark" style={styles.contentContainer}>
            <View style={styles.header}>
              <AppText style={styles.title}>Food Swipe</AppText>
              <AppText style={styles.subtitle}>Create your account</AppText>
            </View>

            <View style={styles.form}>
              <View style={styles.row}>
                <form.Field
                  name="firstName"
                  children={(field) => (
                    <View style={[styles.field, styles.halfField]}>
                      <AppInput
                        placeholder="First Name"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
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
                  name="lastName"
                  children={(field) => (
                    <View style={[styles.field, styles.halfField]}>
                      <AppInput
                        placeholder="Last Name"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
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
              </View>

              <form.Field
                name="username"
                children={(field) => (
                  <View style={styles.field}>
                    <AppInput
                      placeholder="Username"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      autoCapitalize="none"
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

              <form.Field
                name="passwordConfirmation"
                children={(field) => (
                  <View style={styles.field}>
                    <AppInput
                      placeholder="Password Confirmation"
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
                Sign Up
              </AppButton>
            </View>

            <View style={styles.footer}>
              <AppText style={styles.footerText}>Already have an account? </AppText>
              <Link screen="SignIn" action={StackActions.popTo('SignIn')}>
                <AppText style={styles.linkText}>Sign In</AppText>
              </Link>
            </View>
          </BlurView>
        </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  field: {
    gap: 4,
  },
  halfField: {
    flex: 1,
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
