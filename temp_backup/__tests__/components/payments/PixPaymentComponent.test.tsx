import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PixPaymentComponent } from "../../../components/payments/PixPaymentComponent";
import { Plan } from "../../../types/payment";

describe("PixPaymentComponent", () => {
  const mockOnProcess = jest.fn();
  const mockPlan: Plan = {
    id: "basic",
    name: "Plano Básico",
    description: "Acesso básico ao programa",
    price: 100.0,
    features: ["Feature 1", "Feature 2"],
    duration: 30,
    popular: false,
  };

  beforeEach(() => {
    mockOnProcess.mockClear();
  });

  it("should render pix payment component with plan information", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    expect(screen.getByText("Pagamento via PIX")).toBeInTheDocument();
    expect(screen.getByText("Plano Básico")).toBeInTheDocument();
    expect(screen.getByText("R$ 100.00")).toBeInTheDocument();
  });

  it("should display pix benefits", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    expect(
      screen.getByText("Confirmação instantânea • Disponível 24/7"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("⚡")).toHaveLength(2); // One in benefits, one in features
    expect(screen.getByText("Pagamento instantâneo")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Após confirmar o pagamento PIX, seu acesso será liberado imediatamente.",
      ),
    ).toBeInTheDocument();
  });

  it("should show pix method with no fees badge", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    expect(screen.getByText("PIX")).toBeInTheDocument();
    expect(screen.getAllByText("Sem taxas")).toHaveLength(2); // One in method info, one in features
  });

  it("should toggle instructions when clicked", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    const instructionsButton = screen.getByText(
      "Como funciona o pagamento PIX?",
    );

    // Instructions should not be visible initially
    expect(
      screen.queryByText('Clique em "Gerar QR Code PIX" abaixo'),
    ).not.toBeInTheDocument();

    // Click to show instructions
    fireEvent.click(instructionsButton);
    expect(
      screen.getByText('Clique em "Gerar QR Code PIX" abaixo'),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Abra o app do seu banco e escaneie o QR Code"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Confirme o pagamento no seu app bancário"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Seu acesso será liberado automaticamente"),
    ).toBeInTheDocument();

    // Click to hide instructions
    fireEvent.click(instructionsButton);
    expect(
      screen.queryByText('Clique em "Gerar QR Code PIX" abaixo'),
    ).not.toBeInTheDocument();
  });

  it("should call onProcess when payment button is clicked", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    const paymentButton = screen.getByText("Gerar QR Code PIX");
    fireEvent.click(paymentButton);

    expect(mockOnProcess).toHaveBeenCalledTimes(1);
  });

  it("should show processing state when isProcessing is true", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={true}
      />,
    );

    expect(screen.getByText("Gerando QR Code PIX...")).toBeInTheDocument();
    expect(screen.queryByText("Gerar QR Code PIX")).not.toBeInTheDocument();
  });

  it("should disable button when disabled prop is true", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
        disabled={true}
      />,
    );

    const paymentButton = screen
      .getByText("Gerar QR Code PIX")
      .closest("button");
    expect(paymentButton).toBeDisabled();
    expect(paymentButton).toHaveClass("bg-gray-400", "cursor-not-allowed");
  });

  it("should disable button when processing", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={true}
      />,
    );

    const paymentButton = screen
      .getByText("Gerando QR Code PIX...")
      .closest("button");
    expect(paymentButton).toBeDisabled();
  });

  it("should not call onProcess when button is disabled", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
        disabled={true}
      />,
    );

    const paymentButton = screen
      .getByText("Gerar QR Code PIX")
      .closest("button");
    fireEvent.click(paymentButton!);

    expect(mockOnProcess).not.toHaveBeenCalled();
  });

  it("should display security features", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    expect(screen.getByText("Seguro")).toBeInTheDocument();
    expect(screen.getByText("Instantâneo")).toBeInTheDocument();
    expect(screen.getAllByText("Sem taxas")).toHaveLength(2); // One in method info, one in features
  });

  it("should display expiration information", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    expect(
      screen.getByText("O QR Code PIX expira em 15 minutos após a geração"),
    ).toBeInTheDocument();
  });

  it("should display compatible banks", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={100.0}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    expect(
      screen.getByText("Bancos e carteiras compatíveis:"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nubank")).toBeInTheDocument();
    expect(screen.getByText("Inter")).toBeInTheDocument();
    expect(screen.getByText("Itaú")).toBeInTheDocument();
    expect(screen.getByText("Bradesco")).toBeInTheDocument();
    expect(screen.getByText("Santander")).toBeInTheDocument();
    expect(screen.getByText("Caixa")).toBeInTheDocument();
    expect(screen.getByText("Banco do Brasil")).toBeInTheDocument();
    expect(screen.getByText("+ outros")).toBeInTheDocument();
  });

  it("should format price correctly", () => {
    render(
      <PixPaymentComponent
        plan={mockPlan}
        finalPrice={99.99}
        onProcess={mockOnProcess}
        isProcessing={false}
      />,
    );

    expect(screen.getByText("R$ 99.99")).toBeInTheDocument();
  });
});
