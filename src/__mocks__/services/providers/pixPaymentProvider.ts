// Mock implementation for testing
class PixPaymentProvider {
  id = "pix";
  name = "PIX";
  type = "fiat";
  supportedCurrencies = ["BRL"];
  
  constructor() {
    // Mock constructor
  }

  async process(amount: number, planId: string, userId: string) {
    return {
      transactionId: `pix-${Date.now()}`,
      paymentUrl: `https://pix.example.com/pay/${Date.now()}`,
      qrCode: `data:image/png;base64,mock-qr-code-${Date.now()}`,
      amount,
      currency: "BRL",
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    };
  }

  async verify(transactionId: string) {
    return "completed";
  }

  async cancel(transactionId: string) {
    return true;
  }

  // Additional methods required by tests
  calculateDiscountedAmount(amount: number, currency: string) {
    // PIX has no discount
    return amount;
  }

  getSupportedNetworks() {
    // PIX is not tied to any specific network
    return [];
  }

  getEstimatedConfirmationTime() {
    return "Instantâneo";
  }

  getPaymentInstructions(locale = "pt-BR") {
    return "PIX payment instructions in " + locale;
  }

  validatePaymentData(data: any) {
    const errors: string[] = [];
    
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push("Invalid amount");
    } else {
      if (data.amount < 1) {
        errors.push("Minimum amount is R$ 1,00");
      }
      if (data.amount > 10000) {
        errors.push("Maximum amount is R$ 10.000,00");
      }
    }
    
    if (data.currency !== 'BRL') {
      errors.push("Only BRL currency is supported");
    }
    
    if (!data.description || typeof data.description !== 'string') {
      errors.push("Description is required");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  formatAmount(amount: number, currency: string) {
    if (currency === 'BRL') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);
    }
    return amount.toString();
  }

  isPaymentExpired(expiresAt: string | Date): boolean {
    const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
    return expiryDate < new Date();
  }
}

export { PixPaymentProvider };
