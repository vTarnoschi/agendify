import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useBookingForm } from "./use-booking-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { addDays } from "date-fns";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
};

// Mock the react query hooks to test the form logic in isolation
vi.mock("~/queries/use-booking", () => ({
  useAvailabilityQuery: vi
    .fn()
    .mockReturnValue({ data: ["10:00", "11:00"], isLoading: false }),
  useCreatePublicAppointmentMutation: vi.fn().mockReturnValue({
    mutate: vi.fn((data, options) => {
      // Simulate success
      if (options?.onSuccess) {
        options.onSuccess(true);
      }
    }),
  }),
}));

describe("useBookingForm", () => {
  const defaultServices = [
    { id: "1", name: "Service 1", description: null, price: 50, duration: 30 },
    {
      id: "2",
      name: "Service 2",
      description: "Desc",
      price: 100,
      duration: 60,
    },
  ];

  it("should initialize with default values", () => {
    const { result } = renderHook(
      () =>
        useBookingForm({ slug: "test", initialServices: [], defaultServices }),
      { wrapper: createWrapper() },
    );

    expect(result.current.servicesList).toEqual(defaultServices);
    expect(result.current.selectedService).toEqual(defaultServices[0]);
    expect(result.current.selectedTime).toBeNull();
    expect(result.current.bookingStatus).toBe("idle");
    expect(result.current.weekDays.length).toBe(7);
  });

  it("should reset selectedTime when date changes", () => {
    const { result } = renderHook(
      () =>
        useBookingForm({ slug: "test", initialServices: [], defaultServices }),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.setSelectedTime("10:00");
    });
    expect(result.current.selectedTime).toBe("10:00");

    act(() => {
      result.current.setSelectedDate(addDays(new Date(), 1));
    });
    expect(result.current.selectedTime).toBeNull();
  });

  it("should handle week pagination", () => {
    const { result } = renderHook(
      () =>
        useBookingForm({ slug: "test", initialServices: [], defaultServices }),
      { wrapper: createWrapper() },
    );

    const initialWeekStart = result.current.currentWeekStart;

    act(() => {
      result.current.handleNextWeek();
    });
    expect(result.current.currentWeekStart).toEqual(
      addDays(initialWeekStart, 7),
    );

    act(() => {
      result.current.handlePrevWeek();
    });
    expect(result.current.currentWeekStart).toEqual(initialWeekStart);
  });

  it("should process booking successfully", async () => {
    const { result } = renderHook(
      () =>
        useBookingForm({ slug: "test", initialServices: [], defaultServices }),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.setSelectedTime("10:00");
      result.current.setClientName("Alice");
      result.current.setClientEmail("alice@example.com");
    });

    await act(async () => {
      await result.current.handleConfirmBooking();
    });

    expect(result.current.bookingStatus).toBe("success");
  });

  it("should process guest data directly on handleConfirmBooking", async () => {
    const { result } = renderHook(
      () =>
        useBookingForm({ slug: "test", initialServices: [], defaultServices }),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.setSelectedTime("10:00");
    });

    await act(async () => {
      await result.current.handleConfirmBooking({
        name: "Bob",
        email: "bob@example.com",
        phone: "123",
      });
    });

    expect(result.current.clientName).toBe("Bob");
    expect(result.current.clientEmail).toBe("bob@example.com");
    expect(result.current.bookingStatus).toBe("success");
  });
});
