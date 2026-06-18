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
import { useCreateMeasurement } from "@/features/measurement/api/create-measurement";
import { createDialogState } from "@/lib/dialog";

const validator = z.object({
  name: z.string(),
  abbreviation: z.string()
});

export const useCreateMeasurementDialog = createDialogState(); // oxlint-disable-line only-export-components

export const CreateMeasurementDialog = () => {
  const createMeasurement = useCreateMeasurement();
  const { isOpen, onClose } = useCreateMeasurementDialog();

  const form = useForm({
    defaultValues: {
      name: "",
      abbreviation: ""
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value, formApi }) => {
      await createMeasurement.mutateAsync(value);
      formApi.reset();
      onClose();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create measurement</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <form.Field
            name="name"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Measurement</Label>
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
          <div className="mt-2">
            <form.Field
              name="abbreviation"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Abbreviation</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Abbreviation"
                  />
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
