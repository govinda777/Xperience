import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentMethodSelector } from "../../components/payments/PaymentMethodSelector";
import { PaymentProvider } from "../../types/payment";

describe("PaymentMethodSelector", () => {
  const mockPrices = {
    pix: 100,
    bitcoin: 95,
    usdt: 98,
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render all payment methods", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    expect(screen.getByText("PIX")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("USDT (Tether)")).toBeInTheDocument();
  });

  test("should display correct prices for each method", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 95,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 98,00")).toBeInTheDocument();
  });

  test("should show selected method as active", () => {
    render(
      <PaymentMethodSelector
        selected="bitcoin"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    const bitcoinOption = screen.getByTestId("payment-method-bitcoin");
    expect(bitcoinOption).toHaveClass("ring-2", "ring-orange-500");
  });

  test("should call onChange when method is selected", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    const bitcoinOption = screen.getByTestId("payment-method-bitcoin");
    fireEvent.click(bitcoinOption);

    expect(mockOnChange).toHaveBeenCalledWith("bitcoin");
  });

  test("should display discount badges correctly", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    expect(screen.getByText("5% OFF")).toBeInTheDocument();
    expect(screen.getByText("2% OFF")).toBeInTheDocument();
  });

  test("should show payment method features", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    expect(screen.getByText("Confirmação instantânea")).toBeInTheDocument();
    expect(screen.getByText("Disponível 24/7")).toBeInTheDocument();
    expect(screen.getByText("Sem taxas adicionais")).toBeInTheDocument();
    expect(screen.getByText("Descentralizado")).toBeInTheDocument();
    expect(screen.getByText("Segurança máxima")).toBeInTheDocument();
    expect(screen.getByText("Stablecoin confiável")).toBeInTheDocument();
  });

  test("should disable all methods when disabled prop is true", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
        disabled={true}
      />,
    );

    const pixOption = screen.getByTestId("payment-method-pix");
    const bitcoinOption = screen.getByTestId("payment-method-bitcoin");
    const usdtOption = screen.getByTestId("payment-method-usdt");

    expect(pixOption).toHaveClass("opacity-50", "cursor-not-allowed");
    expect(bitcoinOption).toHaveClass("opacity-50", "cursor-not-allowed");
    expect(usdtOption).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  test("should not call onChange when disabled", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
        disabled={true}
      />,
    );

    const bitcoinOption = screen.getByTestId("payment-method-bitcoin");
    fireEvent.click(bitcoinOption);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("should display payment method icons", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    expect(screen.getByText("🏦")).toBeInTheDocument();
    expect(screen.getByText("₿")).toBeInTheDocument();
    expect(screen.getByText("💰")).toBeInTheDocument();
  });

  test("should handle keyboard navigation", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    const bitcoinOption = screen.getByTestId("payment-method-bitcoin");

    // Simulate Enter key press
    fireEvent.keyDown(bitcoinOption, { key: "Enter", code: "Enter" });
    expect(mockOnChange).toHaveBeenCalledWith("bitcoin");

    // Simulate Space key press
    fireEvent.keyDown(bitcoinOption, { key: " ", code: "Space" });
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  test("should format prices correctly", () => {
    const customPrices = {
      pix: 1234.56,
      bitcoin: 999.99,
      usdt: 1000.01,
    };

    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={customPrices}
      />,
    );

    expect(screen.getByText("R$ 1.234,56")).toBeInTheDocument();
    expect(screen.getByText("R$ 999,99")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.000,01")).toBeInTheDocument();
  });

  test("should handle zero prices", () => {
    const zeroPrices = {
      pix: 0,
      bitcoin: 0,
      usdt: 0,
    };

    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={zeroPrices}
      />,
    );

    const priceElements = screen.getAllByText("R$ 0,00");
    expect(priceElements).toHaveLength(3);
  });

  test("should maintain selection state correctly", () => {
    const { rerender } = render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    expect(screen.getByTestId("payment-method-pix")).toHaveClass("ring-2");

    rerender(
      <PaymentMethodSelector
        selected="usdt"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    expect(screen.getByTestId("payment-method-usdt")).toHaveClass("ring-2");
    expect(screen.getByTestId("payment-method-pix")).not.toHaveClass("ring-2");
  });

  test("should show correct badge colors", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    const bitcoinBadge = screen.getByText("5% OFF");
    const usdtBadge = screen.getByText("2% OFF");

    expect(bitcoinBadge).toHaveClass("bg-orange-100", "text-orange-800");
    expect(usdtBadge).toHaveClass("bg-green-100", "text-green-800");
  });

  test("should be accessible", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    const pixOption = screen.getByTestId("payment-method-pix");
    const bitcoinOption = screen.getByTestId("payment-method-bitcoin");
    const usdtOption = screen.getByTestId("payment-method-usdt");

    expect(pixOption).toHaveAttribute("role", "button");
    expect(bitcoinOption).toHaveAttribute("role", "button");
    expect(usdtOption).toHaveAttribute("role", "button");

    expect(pixOption).toHaveAttribute("tabIndex", "0");
    expect(bitcoinOption).toHaveAttribute("tabIndex", "0");
    expect(usdtOption).toHaveAttribute("tabIndex", "0");
  });

  test("should handle rapid clicks correctly", () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />,
    );

    const bitcoinOption = screen.getByTestId("payment-method-bitcoin");

    // Rapid clicks
    fireEvent.click(bitcoinOption);
    fireEvent.click(bitcoinOption);
    fireEvent.click(bitcoinOption);

    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenCalledWith("bitcoin");
  });
});
