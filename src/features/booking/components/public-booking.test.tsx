import React from "react";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PublicBooking from "./public-booking";
import { renderWithProviders } from "~/tests/utils/render";
import { useBookingForm } from "../hooks/use-booking-form";

// Mock the useBookingForm hook to avoid dealing with date selection logic in a basic UI test
vi.mock("../hooks/use-booking-form", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../hooks/use-booking-form")>();
  return {
    ...actual,
    useBookingForm: vi.fn().mockReturnValue({
      selectedDate: new Date("2026-05-22T12:00:00Z"),
      selectedTime: "10:00",
      selectedService: {
        id: "test-service",
        name: "Test Service",
        price: 50,
        duration: 30,
      },
      bookingStatus: "idle",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      setClientName: vi.fn(),
      setClientEmail: vi.fn(),
      setClientPhone: vi.fn(),
      submitBooking: vi.fn(),
      isModalOpen: true,
      setIsModalOpen: vi.fn(),
      availableSlots: ["09:00", "10:00"],
      isLoadingAvailability: false,
      servicesList: [
        {
          id: "test-service",
          name: "Test Service",
          price: 50,
          duration: 30,
        },
      ],
      setSelectedDate: vi.fn(),
      setSelectedTime: vi.fn(),
      setNotes: vi.fn(),
      setBookingStatus: vi.fn(),
      setErrorMessage: vi.fn(),
      setSelectedService: vi.fn(),
      handleNextWeek: vi.fn(),
      handlePrevWeek: vi.fn(),
      handleConfirmBooking: vi.fn(),
      weekDays: [new Date("2026-05-22T12:00:00Z")],
      currentWeekStart: new Date("2026-05-22T12:00:00Z"),
      notes: "",
      errorMessage: "",
      slots: ["09:00", "10:00"],
    }),
  };
});

describe("PublicBooking Component", () => {
  it("renders the provider details correctly", () => {
    renderWithProviders(
      <PublicBooking
        slug="test-provider"
        providerName="John Doe"
        businessName="John Barbershop"
        category="Barber"
      />,
      { withClerk: true },
    );

    expect(screen.getByText("John Barbershop")).toBeInTheDocument();
    expect(screen.getByText("Barber")).toBeInTheDocument();
  });

  it("renders success state when bookingStatus is success", () => {
    // Override the mock for this specific test
    vi.mocked(useBookingForm).mockReturnValueOnce({
      selectedDate: new Date("2026-05-22T12:00:00Z"),
      selectedTime: "10:00",
      selectedService: {
        id: "test-service",
        name: "Test Service",
        description: null,
        price: 50,
        duration: 30,
      },
      bookingStatus: "success",
      clientName: "Alice",
      clientEmail: "alice@test.com",
      clientPhone: "123",
    } as unknown as ReturnType<typeof useBookingForm>);

    renderWithProviders(
      <PublicBooking
        slug="test-provider"
        providerName="John Doe"
        businessName="John Barbershop"
        category="Barber"
      />,
      { withClerk: true },
    );

    expect(screen.getByText(/Agendamento Confirmado!/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Service/i)).toBeInTheDocument();
  });
});
