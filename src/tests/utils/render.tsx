import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

// Clerk mock provider
const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="clerk-provider-mock">{children}</div>;
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  withClerk?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for faster tests
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    let content = (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );

    if (options?.withClerk) {
      content = <MockClerkProvider>{content}</MockClerkProvider>;
    }

    return content;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything
export * from "@testing-library/react";
export { userEvent } from "@testing-library/user-event";
