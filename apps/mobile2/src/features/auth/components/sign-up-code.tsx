import { AppInput } from "@/components/ui/input";
import { StyleSheet, View } from "react-native";
import { AppButton } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/spinner";

type Props = {
    isLoading: boolean
    onSubmit: (code: string) => void
}

export function SignUpCode({isLoading, onSubmit}: Props) {
    const [code, setCode] = useState<string>("");

    const valid = code.trim().length === 6
    return (
          <>
            <AppInput
             color="transparent"
              placeholder="Enter the code you received"
              value={code}
              onChangeText={setCode}
               >Enter the code you received</AppInput>
              
            <AppButton size="full" disabled={!valid || isLoading} onPress={() => onSubmit(code)} PreIcon={isLoading && <Spinner />}>
                Sign in
            </AppButton>
          </>
    )
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
      padding: 20,
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