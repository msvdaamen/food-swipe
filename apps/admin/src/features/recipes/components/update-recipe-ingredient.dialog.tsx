import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { Ingredient } from "@food-swipe/types";
import { useIngredients } from "@/features/ingredient/api/get-ingredients";
import { useMeasurements } from "@/features/measurement/api/get-measurements";
import type { Measurement } from "@food-swipe/types";
import { useAppForm } from "@/hooks/form";
import { z } from "zod";
import { Loader } from "lucide-react";
import { FC, useEffect, useMemo } from "react";
import type { RecipeIngredient } from "@food-swipe/types";
import { useRecipeIngredientUpdate } from "@/features/recipes/api/ingredients/update-recipe-ingredient";
import { createDialogState } from "@/lib/dialog";

interface UpdateRecipeIngredientProps {
  recipeId: string;
}

const validator = z.object({
  ingredientId: z
    .number()
    .nullable()
    .refine((value) => value !== null),
  amount: z
    .number()
    .nullable()
    .refine((value) => value !== null),
  measurementId: z.number().nullable()
});

export const useUpdateRecipeIngredientDialog = createDialogState<RecipeIngredient>();

export const UpdateRecipeIngredientDialog: FC<UpdateRecipeIngredientProps> = ({ recipeId }) => {
  const { isOpen, onClose, data } = useUpdateRecipeIngredientDialog();

  const updateIngredient = useRecipeIngredientUpdate();
  const { data: ingredients = { data: [] as Ingredient[] } } = useIngredients({
    page: 1,
    amount: 100
  });
  const { data: measurements = [] as Measurement[] } = useMeasurements();
  const ingredientsMap = useMemo(
    () => new Map(ingredients.data.map((ingredient) => [ingredient.id, ingredient])),
    [ingredients.data]
  );

  const form = useAppForm({
    defaultValues: {
      ingredientId: data?.ingredientId ?? null,
      amount: data?.amount ?? null,
      measurementId: data?.measurementId ?? null
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value, formApi }) => {
      await updateIngredient.mutateAsync({
        recipeId,
        ingredientId: value.ingredientId!,
        data: {
          amount: Number(value.amount),
          measurementId: value.measurementId
        }
      });
      formApi.reset();
      onClose();
    }
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      ingredientId: data.ingredientId,
      amount: data.amount,
      measurementId: data.measurementId ?? null
    });
  }, [data, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update ingredient</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <form.Field
            name="ingredientId"
            children={(field) => (
              <>
                <Label>Ingredient</Label>
                <Combobox
                  items={ingredients.data}
                  value={ingredientsMap.get(field.state.value!) ?? null}
                  onValueChange={(ingredient) => field.handleChange(ingredient?.id ?? null)}
                  itemToStringLabel={(ingredient) => ingredient.name}
                  itemToStringValue={(ingredient) => ingredient.id.toString()}
                >
                  <ComboboxInput placeholder="Select an ingredient" />
                  <ComboboxContent>
                    <ComboboxEmpty>No ingredient found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </>
            )}
          />
          <div className="mt-4">
            <form.AppField
              name="amount"
              children={(field) => (
                <field.TextField label="Amount" placeholder="Amount" type="number" />
              )}
            />
          </div>
          <div className="mt-4">
            <form.Field
              name="measurementId"
              children={(field) => (
                <>
                  <Label>Measurement</Label>
                  <Select
                    value={field.state.value?.toString() ?? ""}
                    onValueChange={(value: string | null) =>
                      field.handleChange(value ? Number(value) : null)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select measurement" />
                    </SelectTrigger>
                    <SelectContent>
                      {measurements.map((m: Measurement) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit]}
            children={([isSubmitting, canSubmit]) => (
              <Button disabled={!canSubmit} onClick={() => form.handleSubmit()}>
                {isSubmitting ? <Loader className="animate-spin" /> : null}
                Submit
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
