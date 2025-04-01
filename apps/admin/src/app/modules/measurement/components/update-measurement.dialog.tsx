import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { type } from "arktype";
import { useForm } from "@tanstack/react-form";
import { Loader } from "lucide-react";
import { FC, useEffect } from "react";
import { useUpdateMeasurement } from "../hooks/measurement.hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Measurement } from "../types/measurement.type";

interface UpdateMeasurementProps {
  isOpen: boolean;
  onClose: () => void;
  measurementId: number;
}

const validator = type({
  name: "string",
  abbreviation: "string",
});

export const UpdateMeasurementDialog: FC<UpdateMeasurementProps> = ({
  isOpen,
  onClose,
  measurementId,
}) => {
  const queryClient = useQueryClient();
  const updateMeasurement = useUpdateMeasurement(measurementId);

  const form = useForm({
    defaultValues: {
      name: "",
      abbreviation: "",
    },
    validators: {
      onChange: validator,
    },
    onSubmit: async ({ value, formApi }) => {
      await updateMeasurement.mutateAsync(value);
      formApi.reset();
      onClose();
    },
  });

  useEffect(() => {
    const measurements = queryClient.getQueryData<Measurement[]>([
      "measurements",
    ]);
    if (!measurements) return;

    const measurement = measurements.find(
      (measurement) => measurement.id === measurementId
    );
    form.setFieldValue("name", measurement?.name || "");
    form.setFieldValue("abbreviation", measurement?.abbreviation || "");
  }, [isOpen, measurementId, queryClient, form]);

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
