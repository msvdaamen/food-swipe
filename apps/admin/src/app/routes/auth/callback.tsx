import { signInSocialCallback } from "@/features/auth/api/exchange-code";
import { useAuthStore } from "@/features/auth/auth.store";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { type } from "arktype";

const callbackSearchSchema = type({
  code: "string",
  state: "string",
  error: "string?",
});

export const Route = createFileRoute("/auth/callback")({
  component: RouteComponent,
  validateSearch: callbackSearchSchema,
  loaderDeps: ({ search: { code, state, error } }) => ({ code, state, error }),
  loader: async ({ deps: { code, state, error } }) => {
    if (error) {
      return;
    }
    const response = await signInSocialCallback({
      provider: "google",
      code,
      state,
    });
    useAuthStore
      .getState()
      .setTokens(response.accessToken, response.refreshToken);
    return redirect({
      to: "/activities/login-activity",
      replace: true,
    });
  },
});

function RouteComponent() {
  const { error } = Route.useSearch();

  if (error) {
    return <div>Error: {error}</div>;
  }
  return <div>SPINNER PLEASEEEE</div>;
}
