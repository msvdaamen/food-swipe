import { Colors } from "@/constants/theme";
import Checkbox, { CheckboxProps } from "expo-checkbox";
import { StyleSheet } from "react-native";

export const AppCheckbox = ({ style, ...props }: CheckboxProps) => {
  return <Checkbox {...props} style={[styles.checkbox, style]} />;
};

const styles = StyleSheet.create({
  checkbox: {
    borderColor: Colors.gray400,
    borderWidth: 1,
    width: 20,
    height: 20,
    borderRadius: 4,
    padding: -4,
  },
});
