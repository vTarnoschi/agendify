import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { GuestContactModal } from "./GuestContactModal";
import { renderWithProviders } from "~/tests/utils/render";

describe("GuestContactModal Component", () => {
  const mockState = {
    isContactModalOpen: true,
    setIsContactModalOpen: vi.fn(),
    handleConfirmBooking: vi.fn(),
    bookingStatus: "idle" as const,
  } as unknown as import("../hooks/use-booking-form").BookingFormType;

  it("renders correctly when open", () => {
    renderWithProviders(<GuestContactModal state={mockState} />);
    expect(screen.getByText("Dados de Contato")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderWithProviders(<GuestContactModal state={mockState} />);

    const submitButton = screen.getByText("Confirmar Agendamento");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getAllByText("O nome completo é obrigatório")[0],
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Endereço de e-mail inválido")[0],
      ).toBeInTheDocument();
    });
  });

  it("calls handleConfirmBooking with valid data", async () => {
    renderWithProviders(<GuestContactModal state={mockState} />);

    const nameInput = screen.getByPlaceholderText("Ex: João da Silva");
    const emailInput = screen.getByPlaceholderText("Ex: joao@email.com");
    const phoneInput = screen.getByPlaceholderText("(11) 99999-9999");

    await userEvent.type(nameInput, "João Teste");
    await userEvent.type(emailInput, "joao@teste.com");
    await userEvent.type(phoneInput, "11999999999"); // should trigger the mask

    expect(phoneInput).toHaveValue("(11) 99999-9999");

    const submitButton = screen.getByText("Confirmar Agendamento");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockState.handleConfirmBooking).toHaveBeenCalledWith({
        name: "João Teste",
        email: "joao@teste.com",
        phone: "(11) 99999-9999",
      });
      expect(mockState.setIsContactModalOpen).toHaveBeenCalledWith(false);
    });
  });
});
