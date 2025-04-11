import { Spinner } from "@/components/spinner";
import { AppButton } from "@/components/ui/button";
import { AppInput } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { View } from "react-native";
import { z } from "zod";

const validator = z.object({
    email: z.string().email(),
    username: z.string().min(1),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  });

type SignUpFormValues = z.infer<typeof validator>;

export function SignUpForm({onSubmit}: {onSubmit: (value: SignUpFormValues) => void}) {
    const form = useForm({
        defaultValues: {
          email: "msv.daamen@outlook.com",
          username: "msvdaamen",
          password: "Gymshark98!",
          firstName: "Mischa",
          lastName: "Daamen",
        },
        validators: {
          onChange: validator,
        },
        onSubmit: async ({value}) => {
          await onSubmit(value);
        },
      });

    return (
        <>
        <View style={{width: "100%", flexDirection: "row",  gap: 16}}>
              <form.Field name="firstName" children={e => (
                <AppInput
                  id={e.name}
                  color="transparent"
                  placeholder="First Name"
                  value={e.state.value}
                  onChangeText={e.handleChange}
                  style={{flex: 1}}
                >
                  First Name
                </AppInput>
              )}/>
              <form.Field name="lastName" children={e => (
                <AppInput
                  id={e.name}
                  color="transparent"
                  placeholder="Last Name"
                  value={e.state.value}
                  onChangeText={e.handleChange}
                  style={{flex: 1}}
                >
                  First Name
                </AppInput>
              )}/>
              
            </View>
            <form.Field name="email" children={e => (
           <AppInput
              color="transparent"
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              value={e.state.value}
              onChangeText={e.handleChange}
            >
              Email
            </AppInput>
            )}/>
            <form.Field name="username" children={e => (
            <AppInput
              color="transparent"
              placeholder="example"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect={false}
              value={e.state.value}
              onChangeText={e.handleChange}
            >
              Username
            </AppInput>
            )}/>
            <form.Field name="password" children={e => (
            <AppInput
              color="transparent"
              placeholder="Password"
              secureTextEntry={true}
              value={e.state.value}
              onChangeText={e.handleChange}
            >
              Password
            </AppInput>
            )}/>
            <form.Subscribe
              selector={state => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <AppButton size="full" disabled={!canSubmit} onPress={form.handleSubmit} PreIcon={isSubmitting && <Spinner />}>
                  Sign up
                </AppButton>
              )}
            />
            </>
    )
}