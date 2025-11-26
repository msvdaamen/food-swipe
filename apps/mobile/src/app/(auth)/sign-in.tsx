import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { BlurView } from "expo-blur";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { ImageBackground } from "expo-image";

import { type } from "arktype"
import { useForm } from "@tanstack/react-form";
import { Spinner } from "@/components/spinner";
import { Colors } from "@/constants/theme";
import { FText } from "@/components/f-text";
// import { useSignIn } from "@/features/auth/api/sign-in";

const validator = type({
  email: "string.email",
  password: "string >= 8"
});

export default function SignInScreen() {
  // const signIn = useSignIn();
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
      // const res = await signIn.mutateAsync({
      //   email: value.email,
      //   password: value.password,
      // });
      // console.log(res);
      // router.replace("/");
    },
  });

  return (
    <ImageBackground
      source={require('@assets/images/auth_background.jpg')}
      contentFit="cover"
      style={styles.background}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Food Swipe</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
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
              <FText style={styles.forgotPassword}>Forgot password?</FText>
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
            <FText style={{ color: Colors.gray400 }}>
              Don't have an account?
            </FText>
            <Link replace href="/(auth)/(sign-up)/sign-up">
              <FText style={{ color: Colors.white }}>Sign up</FText>
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
    color: Colors.white,
  },
  subtitle: {
    fontSize: 24,
    color: Colors.white,
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
