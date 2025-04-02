import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import { RecipeStep } from "../types/recipe-step.type";
import { useQueryClient } from "@tanstack/react-query";
import { recipeApi } from "../recipe.api";
import { Loader } from "lucide-react";
import { type } from "arktype";
import React, { useEffect } from "react";
import {
  useRecipeStepCreate,
  useRecipeSteps,
} from "../hooks/recipe-step.hooks";
import { useRecipeStepUpdate } from "../hooks/recipe-step.hooks";

interface ManageRecipeStepDialogProps {
  recipeId: number;
  stepId?: number;
  isOpen: boolean;
  onClose: () => void;
}

const validator = type({
  description: "string",
  order: "number",
});

export function ManageRecipeStepDialog({
  recipeId,
  stepId,
  isOpen,
  onClose,
}: ManageRecipeStepDialogProps) {
  const queryClient = useQueryClient();
  const createStep = useRecipeStepCreate({ recipeId });
  const updateStep = useRecipeStepUpdate({
    recipeId,
    stepId: stepId as number,
  });
  const form = useForm({
    defaultValues: {
      description: "",
      order: 1,
    },
    validators: {
      onChange: validator,
    },
    onSubmit: async ({ value, formApi }) => {
      if (stepId) {
        await updateStep.mutateAsync(value);
      } else {
        await createStep.mutateAsync(value);
      }
      formApi.reset();
      onClose();
    },
  });

  useEffect(() => {
    if (stepId) {
      const steps = queryClient.getQueryData<RecipeStep[]>([
        "recipe",
        recipeId,
        "steps",
      ]);
      const step = steps?.find((step) => step.id === stepId);
      if (step) {
        form.setFieldValue("description", step.description);
        form.setFieldValue("order", step.stepNumber);
      }
    }
  }, [form, queryClient, recipeId, stepId]);

  useEffect(() => {
    const steps = queryClient.getQueryData<RecipeStep[]>([
      "recipe",
      recipeId,
      "steps",
    ]);
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
