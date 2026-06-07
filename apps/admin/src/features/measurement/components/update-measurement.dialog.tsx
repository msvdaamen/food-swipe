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
import { useEffect } from "react";
import { measurementKeys } from "@/features/measurement/api/measurement-keys";
import { useUpdateMeasurement } from "@/features/measurement/api/update-measurement";
import type { Measurement } from "@food-swipe/types";
import { useQueryClient } from "@tanstack/react-query";
import { createDialogState } from "@/lib/dialog";

const validator = z.object({
  name: z.string(),
  abbreviation: z.string()
});

export const useUpdateMeasurementDialog = createDialogState<{ measurementId: number }>();

export const UpdateMeasurementDialog = () => {
  const queryClient = useQueryClient();
  const updateMeasurement = useUpdateMeasurement();
  const { isOpen, data, onClose } = useUpdateMeasurementDialog();

  const form = useForm({
    defaultValues: {
      name: "",
      abbreviation: ""
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value, formApi }) => {
      await updateMeasurement.mutateAsync({
        measurementId: data!.measurementId,
        data: value
      });
      formApi.reset();
      onClose();
    }
  });

  useEffect(() => {
    const measurements = queryClient.getQueryData<Measurement[]>(measurementKeys.list());
    if (!measurements) return;

    const measurement = measurements.find((measurement) => measurement.id === data?.measurementId);
    form.setFieldValue("name", measurement?.name || "");
    form.setFieldValue("abbreviation", measurement?.abbreviation || "");
  }, [isOpen, data, queryClient, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update measurement</DialogTitle>
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
