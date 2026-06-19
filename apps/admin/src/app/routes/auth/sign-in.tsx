import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { useSignIn } from "@/features/auth/api/sign-in";
import { authClient } from "@/lib/auth";
import { useState } from "react";

export const Route = createFileRoute("/auth/sign-in")({
  component: RouteComponent
});

const validator = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

function RouteComponent() {
  const { data: session } = authClient.useSession();
  const [error, setError] = useState<string>("");

  const signIn = useSignIn();
  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onChange: validator
    },
    onSubmit: async ({ value }) => {
      const { data, error: authError } = await signIn.mutateAsync(value);
      if (authError) {
        setError("Unauthorized");
        return;
      }
      const { user } = data;
      if (user.role === "admin") {
        return <Navigate to="/" />;
      } else if (session) {
        setError("Unauthorized");
        authClient.signOut();
      }
    }
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <img src="/images/logo.png" alt="FoodSwipe Logo" />
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <div className="text-red-500">{error}</div>}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <form.Field
                      name="email"
                      children={(field) => (
                        <>
                          <Label htmlFor={field.name}>Email</Label>
                          <Input
                            id={field.name}
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <form.Field
                      name="password"
                      children={(field) => (
                        <>
                          <div className="flex items-center">
                            <Label htmlFor={field.name}>Password</Label>
                            <a
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                              Forgot your password?
                            </a>
                          </div>
                          <Input
                            id={field.name}
                            type="password"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </>
                      )}
                    />
                  </div>
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <Button type="submit" className="w-full" disabled={!canSubmit}>
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : ""}
                        Login
                      </Button>
                    )}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
