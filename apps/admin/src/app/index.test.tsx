import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./index";

vi.mock("./provider", () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-provider">{children}</div>
  )
}));

vi.mock("./router", () => ({
  AppRouter: () => <div data-testid="app-router">router</div>
}));

vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="app-toaster">toaster</div>
}));

describe("App", () => {
  it("renders the provider, toaster, and router shell", () => {
    render(<App />);

    expect(screen.getByTestId("app-provider")).toBeTruthy();
    expect(screen.getByTestId("app-toaster")).toBeTruthy();
    expect(screen.getByTestId("app-router")).toBeTruthy();
  });
});
