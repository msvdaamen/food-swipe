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

import { getIngredientsQueryOptions } from "@/features/ingredient/api";
import { getMeasurementsQueryOptions } from "@/features/measurement/api";
import type { Measurement } from "@food-swipe/types";
import { useAppForm } from "@/hooks/form";
import { type } from "arktype";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import type { RecipeIngredient } from "@food-swipe/types";
import { useRecipeIngredientUpdate } from "@/features/recipes/api";

interface UpdateRecipeIngredientProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
  ingredient: RecipeIngredient;
}

const validator = type({
  ingredientId: "number",
  amount: "number",
  measurementId: "number?"
});

export const UpdateRecipeIngredientDialog: FC<UpdateRecipeIngredientProps> = ({
  isOpen,
  onClose,
  recipeId,
  ingredient
}) => {

  const updateIngredient = useRecipeIngredientUpdate();
  const { data: ingredients = { data: [] as Ingredient[] } } = useQuery(
    getIngredientsQueryOptions({
      page: 1,
      amount: 100
    })
  );
  const { data: measurements = [] as Measurement[] } = useQuery(getMeasurementsQueryOptions());

  const form = useAppForm({
    defaultValues: {
      ingredientId: ingredient.ingredientId || null,
      amount: ingredient.amount || null,
      measurementId: ingredient.measurementId || null
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value, formApi }) => {
      await updateIngredient.mutateAsync({
        recipeId,
        ingredientId: ingredient.ingredientId,
        data: {
          amount: Number(value.amount),
          measurementId: value.measurementId
        }
      });
      formApi.reset();
      onClose();
    }
  });

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
                  onValueChange={(value) => field.handleChange(value ? Number(value) : null)}
                  value={field.state.value ? Number(field.state.value) : null}
                >
                  <ComboboxInput placeholder="Select a ingredient" />
                  <ComboboxContent>
                    <ComboboxEmpty>No ingredient found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item.id}>
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
