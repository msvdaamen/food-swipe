import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SignIn, useAuth } from "@clerk/clerk-react";

export const Route = createFileRoute("/auth/sign-in")({
  component: RouteComponent,
});
function RouteComponent() {
  const auth = useAuth();

  if (auth.isSignedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <SignIn  />
    </div>
  );
}
