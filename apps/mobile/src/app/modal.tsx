import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { FText } from "@/components/f-text";
import { FView } from "@/components/f-view";

export default function ModalScreen() {
  return (
    <FView style={styles.container}>
      <FText>This is a modal</FText>
      <Link href="/" dismissTo style={styles.link}>
        <FText>Go to home screen</FText>
      </Link>
    </FView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
