import React from "react";
import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { server } from "./msw/server";

// MSW Setup
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Clerk
vi.mock("@clerk/nextjs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@clerk/nextjs")>();
  return {
    ...actual,
    useUser: () => ({ isSignedIn: false, isLoaded: true, user: null }),
    useClerk: () => ({ setActive: vi.fn() }),
    useSignIn: () => ({ signIn: { create: vi.fn() } }),
    SignInButton: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        "div",
        { "data-testid": "sign-in-button-mock" },
        children,
      ),
  };
});

// Mock ResizeObserver for some UI components (like Recharts or radix-ui)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
