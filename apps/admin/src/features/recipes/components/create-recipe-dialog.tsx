import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateRecipe } from "@/features/recipes/api/create-recipe";
import { z } from "zod";
import { Loader } from "lucide-react";
import { createDialogState } from "@/lib/dialog";

const validator = z.object({
  title: z.string()
});

export const useCreateRecipeDialog = createDialogState(); // oxlint-disable-line only-export-components

export const CreateRecipeDialog = () => {
  const createRecipe = useCreateRecipe();
  const { isOpen, onClose } = useCreateRecipeDialog();

  const form = useForm({
    defaultValues: {
      title: ""
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value }) => {
      await createRecipe.mutateAsync({ title: value.title.trim() });
      onClose();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create recipe</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Recipe title"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                )}
              </div>
            )}
          </form.Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <form.Subscribe
              selector={({ canSubmit, isSubmitting }) => [canSubmit, isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  Submit
                  {isSubmitting && <Loader className="animate-spin" />}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
