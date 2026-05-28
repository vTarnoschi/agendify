import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  useAvailabilityQuery,
  useCreatePublicAppointmentMutation,
  useConvertGuestMutation,
} from "./use-booking";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { HttpResponse, http } from "msw";
import { server } from "../tests/msw/server";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

// Precisamos mockar as funções internas de fetch se não quisermos testar a integração inteira,
// mas como a queryFn chama getAvailability (que presumivelmente usa axios/fetch para bater em /api/availability),
// o MSW vai interceptar a chamada e retornar o dado correto.

describe("useAvailabilityQuery", () => {
  it("should fetch availability slots successfully", async () => {
    const { result } = renderHook(
      () =>
        useAvailabilityQuery({
          slug: "test-slug",
          date: "2026-05-22",
          serviceId: "123",
        }),
      { wrapper: createWrapper() },
    );

    // Initial state
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // The data should match our MSW mock
    expect(result.current.data).toEqual(["09:00", "11:00"]);
  });

  it("should handle API errors", async () => {
    server.use(
      http.get("/api/availability", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(
      () =>
        useAvailabilityQuery({
          slug: "test-slug-error",
          date: "2026-05-22",
          serviceId: "123",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreatePublicAppointmentMutation", () => {
  it("should successfully create an appointment", async () => {
    // MSW handler for POST /api/appointments should be mocked in handlers/index.ts
    // or we mock it here.
    server.use(
      http.post("/api/appointments", () => {
        return HttpResponse.json({ success: true, data: null });
      }),
    );

    const { result } = renderHook(() => useCreatePublicAppointmentMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      slug: "test",
      date: "2026-05-22",
      title: "Test",
      description: "",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe("useConvertGuestMutation", () => {
  it("should successfully convert a guest", async () => {
    server.use(
      http.post("/api/appointments/convert-guest", () => {
        return HttpResponse.json({ success: true, data: null });
      }),
    );

    const { result } = renderHook(() => useConvertGuestMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      email: "test@example.com",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
