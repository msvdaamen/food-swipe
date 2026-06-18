import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context.ts";
import TextField from "../components/form/text-field.tsx";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField
  },
  formComponents: {}
});
