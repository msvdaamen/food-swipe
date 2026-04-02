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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useIngredients } from "@/features/ingredient/api/get-ingredients";
import { Ingredient } from "@/features/ingredient/types/ingredient.type";
import { useMeasurements } from "@/features/measurement/api/get-measurements";
import { Measurement } from "@/features/measurement/types/measurement.type";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { Loader } from "lucide-react";
import { FC } from "react";
import { useRecipeIngredientCreate } from "../api/ingredients/create-recipe-ingredient";

interface CreateRecipeIngredientProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
}

const validator = type({
  ingredientId: "number",
  amount: "number",
  measurementId: "number?"
});

export const CreateRecipeIngredientDialog: FC<CreateRecipeIngredientProps> = ({
  isOpen,
  onClose,
  recipeId
}) => {
  const createIngredient = useRecipeIngredientCreate();
  const { data: ingredients = { data: [] as Ingredient[] } } = useIngredients({
    page: 1,
    amount: 100
  });
  const { data: measurements = [] as Measurement[] } = useMeasurements();

  const form = useForm({
    defaultValues: {
      ingredientId: null as number | null,
      amount: null as number | null,
      measurementId: null as number | null
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value, formApi }) => {
      await createIngredient.mutateAsync({
        recipeId,
        data: {
          amount: Number(value.amount),
          measurementId: value.measurementId,
          ingredientId: value.ingredientId!
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
          <DialogTitle>Add ingredient</DialogTitle>
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
                  value={field.state.value ? Number(field.state.value) : null}
                  onValueChange={(value) => field.handleChange(value ? Number(value) : null)}
                >
                  <ComboboxInput placeholder="Select a ingredient" />
                  <ComboboxContent>
                    <ComboboxEmpty>No ingredient found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item.id}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
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
                    defaultValue={field.state.value?.toString() ?? ""}
                    onValueChange={(value: string | null) =>
                      field.handleChange(value ? Number(value) : null)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select measurement" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="">No measurement</SelectItem> */}
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
