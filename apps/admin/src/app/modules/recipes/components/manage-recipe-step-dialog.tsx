import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import { RecipeStep } from "../types/recipe-step.type";
import { useQueryClient } from "@tanstack/react-query";
import { recipeApi } from "../recipe.api";
import { Loader } from "lucide-react";
import { type } from "arktype";
import React, { useEffect } from "react";

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
  const form = useForm({
    defaultValues: {
      description: "",
      order: 1,
    },
    validators: {
      onChange: validator,
    },
    onSubmit: async (form) => {
      const key = ["recipe", recipeId, "steps"];
      if (stepId) {
        await recipeApi.updateStep(recipeId, stepId, form.value);
        const steps = queryClient.getQueryData<RecipeStep[]>(key);
        if (steps) {
          queryClient.setQueryData(
            key,
            steps.map((step) => {
              if (step.id === stepId) {
                return form.value;
              }
              return step;
            })
          );
        }
      } else {
        await recipeApi.createStep(recipeId, form.value);
        queryClient.setQueryData(key, (old: RecipeStep[]) => [
          ...old,
          form.value,
        ]);
      }
      form.formApi.reset();
      onClose();
    },
  });

  useEffect(() => {
    const steps = queryClient.getQueryData<RecipeStep[]>([
      "recipe",
      recipeId,
      "steps",
    ]);
    if (steps) {
      form.setFieldValue("order", steps.length + 1);
    }
  }, [recipeId, form, queryClient]);

  // useEffect(() => {
  //   const allSteps = steps();
  //   setCurrentSteps(allSteps);

  //   // Set order based on last step
  //   const lastStep = allSteps[allSteps.length - 1];
  //   if (lastStep) {
  //     setValue("order", lastStep.stepNumber + 1);
  //   }

  //   // If editing existing step, populate form
  //   if (stepId) {
  //     const step = stepEntities()[stepId];
  //     if (step) {
  //       setValue("description", step.description);
  //       setValue("order", step.stepNumber);
  //     }
  //   }
  // }, [stepId, steps, stepEntities, setValue]);

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
