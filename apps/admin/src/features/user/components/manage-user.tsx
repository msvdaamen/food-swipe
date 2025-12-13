import { DialogState } from "@/types/dialog-state";
import { create } from "zustand";
import { User } from "../types/user.type";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
} from "@/components/ui/field"
import { useAppForm } from "@/hooks/form";
import { Form } from "@/components/form/form";
import { type } from "arktype";
import { useEffect } from "react";
import { useCreateUser } from "../api/create-user";
import { useUpdateUser } from "../api/update-user";

export const useManageUserDialogState = create<DialogState<User>>(set =>({
    isOpen: false,
    open: (user?: User) => set(state => ({ isOpen: !state.isOpen, data: user })),
    close: () => set(state => ({ isOpen: !state.isOpen })),
    data: null
}));

const validatorCreate = type({
  email: "string.email",
  username: "/^[a-z0-9_-]{3,30}$/",
  name: "string > 0",
  password: "string > 5",
  role: "'admin' | 'user'"
});


const validatorUpdate = type({
  email: "string.email",
  username: "/^[a-z0-9_-]{3,30}$/",
  name: "string > 0",
  password: "string",
  role: "'admin' | 'user'"
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

        state.close();
      } catch {}
    }
  });

  useEffect(() => {
    if (state.isOpen) {
      form.reset();
    }
  }, [state.isOpen]);

  return (
    <Dialog open={state.isOpen} onOpenChange={state.close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {state.data == null ? "Create" : "Edit"} user
          </DialogTitle>
          <DialogDescription>
            Manage a user
          </DialogDescription>
        </DialogHeader>
        <Form
          onSubmit={() => {
            form.handleSubmit()
          }}
        >
        <FieldGroup>
          <form.AppField
          name="email"
          children={field => <field.TextField label="E-mail" placeholder="E-mail" type="email" />}
          />
          <form.AppField
          name="username"
          children={field => <field.TextField label="Username" placeholder="Username" />}
          />
          <form.AppField
          name="name"
          children={field => <field.TextField label="Name" placeholder="Name" />}
          />
          <form.AppField
          name="password"
          children={field => <field.TextField label="Password" placeholder="Password" type="password" />}
          />
          <form.AppField
          name="role"
          children={field => <field.TextField label="Role" placeholder="Role" />}
          />
        </FieldGroup>
        </Form>

        <DialogFooter>
          <Button onClick={state.close} variant="outline">
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
