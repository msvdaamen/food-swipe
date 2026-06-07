import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import type { RecipeStep } from "@food-swipe/types";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";
import { useRecipeSteps } from "@/features/recipes/api/steps/get-recipe-steps";
import { useRecipeStepCreate } from "@/features/recipes/api/steps/create-recipe-step";
import { useRecipeStepUpdate } from "@/features/recipes/api/steps/update-recipe-step";
import { createDialogState } from "@/lib/dialog";

interface ManageRecipeStepDialogProps {
  recipeId: string;
}

const validator = z.object({
  description: z.string().min(1),
  order: z.number()
});

export const useManageRecipeStepDialog = createDialogState<number | null>();

export function ManageRecipeStepDialog({ recipeId }: ManageRecipeStepDialogProps) {
  const { isOpen, onClose, data: stepId } = useManageRecipeStepDialog();

  const { data: steps } = useRecipeSteps(recipeId);
  const queryClient = useQueryClient();
  const createStep = useRecipeStepCreate();
  const updateStep = useRecipeStepUpdate();

  const form = useForm({
    defaultValues: {
      description: "",
      order: steps ? steps.length + 1 : 1
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value, formApi }) => {
      if (stepId) {
        await updateStep.mutateAsync({ recipeId, stepId, data: value });
      } else {
        await createStep.mutateAsync({ recipeId, data: value });
      }
      formApi.reset();
      onClose();
    }
  });

  useEffect(() => {
    if (stepId) {
      const steps = queryClient.getQueryData<RecipeStep[]>(["recipe", recipeId, "steps"]);
      const step = steps?.find((step) => step.id === stepId);
      if (step) {
        form.setFieldValue("description", step.description);
        form.setFieldValue("order", step.stepNumber);
      }
    }
  }, [form, queryClient, recipeId, stepId]);

  useEffect(() => {
    const steps = queryClient.getQueryData<RecipeStep[]>(["recipe", recipeId, "steps"]);
    if (steps) {
      form.setFieldValue("order", steps.length + 1);
    }
  }, [recipeId, form, queryClient, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{stepId ? "Edit Step" : "Create Step"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="description"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="description"
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
