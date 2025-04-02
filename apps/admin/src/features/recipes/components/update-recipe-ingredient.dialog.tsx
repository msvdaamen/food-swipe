import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type } from "arktype";
import { useForm } from "@tanstack/react-form";
import { Loader } from "lucide-react";
import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboBox } from "@/components/ui/combobox";
import { RecipeIngredient } from "../types/recipe-ingredient.type";
import { Ingredient } from "@/features/ingredient/types/ingredient.type";
import { Measurement } from "@/features/measurement/types/measurement.type";
import { useIngredients } from "@/features/ingredient/api/get-ingredients";
import { useMeasurements } from "@/features/measurement/api/get-measurements";
import { useRecipeIngredientUpdate } from "../api/ingredients/update-recipe-ingredient";
import { useDebounce } from "@uidotdev/usehooks";

interface UpdateRecipeIngredientProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: number;
  ingredient: RecipeIngredient;
}

const validator = type({
  ingredientId: "number",
  amount: "number",
  measurementId: "number?",
});

export const UpdateRecipeIngredientDialog: FC<UpdateRecipeIngredientProps> = ({
  isOpen,
  onClose,
  recipeId,
  ingredient,
}) => {
  const updateIngredient = useRecipeIngredientUpdate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const { data: ingredients = { data: [] as Ingredient[] } } = useIngredients({
    page: 1,
    amount: 100,
  });
  const { data: measurements = [] as Measurement[] } = useMeasurements();

  const form = useForm({
    defaultValues: {
      ingredientId: ingredient.ingredientId || null,
      amount: ingredient.amount || null,
      measurementId: ingredient.measurementId || null,
    },
    validators: {
      onChange: validator,
    },
    onSubmit: async ({ value, formApi }) => {
      await updateIngredient.mutateAsync({
        recipeId,
        ingredientId: ingredient.ingredientId,
        data: {
          amount: Number(value.amount),
          measurementId: value.measurementId,
        },
      });
      formApi.reset();
      onClose();
    },
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
                <ComboBox<Ingredient>
                  items={ingredients.data}
                  value={field.state.value?.toString() ?? ""}
                  onValueChange={(value) => {
                    field.handleChange(value ? Number(value) : null);
                  }}
                  placeholder="Select ingredient"
                  valueFn={(item) => item.id.toString()}
                  displayFn={(item) => item?.name ?? ""}
                  filterFn={(item, search) =>
                    item.name.toLowerCase().includes(search.toLowerCase())
                  }
                  onSearchChange={(search) => {
                    setSearch(search);
                  }}
                />
              </>
            )}
          />
          <div className="mt-4">
            <form.Field
              name="amount"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Amount</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                    placeholder="Amount"
                  />
                </>
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
                    onValueChange={(value: string) =>
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
