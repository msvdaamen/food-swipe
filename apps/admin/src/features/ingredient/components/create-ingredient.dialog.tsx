import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Loader } from "lucide-react";
import { useCreateIngredient } from "@/features/ingredient/api/create-ingredient";
import { createDialogState } from "@/lib/dialog";

const validator = z.object({
  name: z.string()
});

export const useCreateIngredientDialog = createDialogState(); // oxlint-disable-line only-export-components

export function CreateIngredientDialog() {
  const { isOpen, onClose } = useCreateIngredientDialog();
  const createIngredient = useCreateIngredient();

  const form = useForm({
    defaultValues: {
      name: ""
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value, formApi }) => {
      await createIngredient.mutateAsync({ data: value });
      formApi.reset();
      onClose();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create ingredient</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <form.Field
            name="name"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Ingredient</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Name"
                />
              </>
            )}
          />
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
}
