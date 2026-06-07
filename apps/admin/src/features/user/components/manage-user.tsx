import { Form } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { z } from "zod";
import { useEffect } from "react";
import { useCreateUser } from "../api/create-user";
import { useUpdateUser } from "../api/update-user";
import type { User } from "@food-swipe/types";
import { createDialogState } from "@/lib/dialog";

export const useManageUserDialogState = createDialogState<User | null>();

const validatorCreate = z.object({
  email: z.email(),
  username: z.string().regex(/^[a-z0-9_-]{3,30}$/),
  name: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(["admin", "user"])
});

const validatorUpdate = z.object({
  email: z.email(),
  username: z.string().regex(/^[a-z0-9_-]{3,30}$/),
  name: z.string().min(1),
  password: z.string(),
  role: z.enum(["admin", "user"])
});

export function ManagerUserDialog() {
  const state = useManageUserDialogState();
  const data = state.data;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const form = useAppForm({
    defaultValues: {
      email: data?.email || "",
      username: data?.username || "",
      name: data?.name || "",
      password: "",
      role: data?.role || "user"
    },
    validators: {
      onSubmit: data ? validatorUpdate : validatorCreate
    },
    onSubmit: async ({ value }) => {
      try {
        if (data == null) {
          await createUser.mutateAsync(value);
        } else {
          await updateUser.mutateAsync({ id: data.id, ...value });
        }

        state.onClose();
      } catch {}
    }
  });

  useEffect(() => {
    if (state.isOpen) {
      form.reset();
    }
  }, [form, state.isOpen]);

  return (
    <Dialog
      open={state.isOpen}
      onOpenChange={(open) => useManageUserDialogState.setState({ isOpen: open })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{state.data == null ? "Create" : "Edit"} user</DialogTitle>
          <DialogDescription>Manage a user</DialogDescription>
        </DialogHeader>
        <Form
          onSubmit={() => {
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField label="E-mail" placeholder="E-mail" type="email" />
              )}
            />
            <form.AppField
              name="username"
              children={(field) => <field.TextField label="Username" placeholder="Username" />}
            />
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Name" placeholder="Name" />}
            />
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField label="Password" placeholder="Password" type="password" />
              )}
            />
            <form.AppField
              name="role"
              children={(field) => <field.TextField label="Role" placeholder="Role" />}
            />
          </FieldGroup>
        </Form>

        <DialogFooter>
          <Button onClick={state.onClose} variant="outline">
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
