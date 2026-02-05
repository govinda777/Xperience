import {
  PaymentProviderInterface,
  PaymentResult,
  PaymentStatus,
  PaymentCurrency,
} from "../../types/payment";
import { PAYMENT_CONFIG, PAYMENT_CONSTANTS } from "../../config/payment";

// Tipos específicos do Mercado Pago
interface MercadoPagoPreference {
  items: Array<{
    title: string;
    unit_price: number;
    quantity: number;
  }>;
  payment_methods: {
    excluded_payment_types: Array<{ id: string }>;
    included_payment_methods: Array<{ id: string }>;
  };
  external_reference: string;
  notification_url: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

interface MercadoPagoResponse {
  id: string;
  init_point: string;
  qr_code?: string;
  qr_code_base64?: string;
}

interface MercadoPagoPayment {
  id: string;
  status: string;
  status_detail: string;
  external_reference: string;
  transaction_amount: number;
  date_created: string;
  date_approved?: string;
}

export class PixPaymentProvider implements PaymentProviderInterface {
  // Public properties
  public readonly id = "pix" as const;
  public readonly name = "PIX";
  public readonly type = "fiat" as const;
  public readonly supportedCurrencies: PaymentCurrency[] = ["BRL"];

  // Private properties
  private baseUrl: string;
  // private accessToken: string; // Removed for security

  constructor() {
    // Access token removed from frontend config for security
    this.baseUrl = PAYMENT_CONFIG.mercadoPago.sandboxMode
      ? "https://api.mercadopago.com/sandbox"
      : "https://api.mercadopago.com";
  }

  // Public methods
  public validatePaymentData(data: {
    amount: number;
    currency: PaymentCurrency;
    description: string;
    externalId: string;
  }) {
    const errors: string[] = [];

    if (data.amount < 1) {
      errors.push("Minimum amount is R$ 1,00");
    }

    if (data.amount > 10000) {
      errors.push("Maximum amount is R$ 10.000,00");
    }

    if (!this.supportedCurrencies.includes(data.currency)) {
      errors.push(`Currency ${data.currency} not supported`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public formatAmount(amount: number, currency: PaymentCurrency): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  }

  public isPaymentExpired(expirationDate: string): boolean {
    return new Date(expirationDate).getTime() < Date.now();
  }

  public calculateDiscountedAmount(amount: number, currency: PaymentCurrency): number {
    return amount; // No discount for PIX
  }

  public getSupportedNetworks(): string[] {
    return []; // PIX doesn't use blockchain networks
  }

  public getEstimatedConfirmationTime(): string {
    return "Instantâneo";
  }

  public getPaymentInstructions(locale: string): string {
    return "1. Abra o aplicativo do seu banco\n2. Selecione a opção PIX\n3. Escaneie o QR Code ou copie o código PIX\n4. Confirme o pagamento";
  }

  public async process(
    amount: number,
    planId: string,
    userId: string,
  ): Promise<PaymentResult> {
    try {
      const externalReference = `${userId}-${planId}-${Date.now()}`;
      const expirationDate = new Date(
        Date.now() + PAYMENT_CONSTANTS.PIX_TIMEOUT,
      );

      const preference: MercadoPagoPreference = {
        items: [
          {
            title: `Xperience - Plano ${planId}`,
            unit_price: amount,
            quantity: 1,
          },
        ],
        payment_methods: {
          excluded_payment_types: [
            { id: "credit_card" },
            { id: "debit_card" },
            { id: "ticket" },
          ],
          included_payment_methods: [{ id: "pix" }],
        },
        external_reference: externalReference,
        notification_url: `${PAYMENT_CONFIG.webhookUrl}/pix`,
        expires: true,
        expiration_date_to: expirationDate.toISOString(),
      };

      const response = await this.createPreference(preference);

      // Gerar QR Code PIX específico
      const pixData = await this.generatePixQRCode(response.id, amount);

      return {
        transactionId: response.id,
        paymentUrl: response.init_point,
        qrCode: pixData.qr_code,
        qrCodeBase64: pixData.qr_code_base64,
        amount,
        currency: "BRL",
        expiresAt: expirationDate,
        metadata: {
          externalReference,
          preferenceId: response.id,
          pixData,
        },
      };
    } catch (error) {
      console.error("Erro ao processar pagamento PIX:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      throw new Error(`Falha ao processar pagamento PIX: ${errorMessage}`);
    }
  }

  public async verify(transactionId: string): Promise<PaymentStatus> {
    try {
      // Buscar pagamentos pela preferência
      const payments = await this.getPaymentsByPreference(transactionId);

      if (!payments || payments.length === 0) {
        return "pending";
      }

      // Pegar o pagamento mais recente
      const latestPayment = payments.sort(
        (a, b) =>
          new Date(b.date_created).getTime() -
          new Date(a.date_created).getTime(),
      )[0];

      return this.mapMercadoPagoStatus(latestPayment.status);
    } catch (error) {
      console.error("Erro ao verificar pagamento PIX:", error);
      return "failed";
    }
  }

  public async cancel(transactionId: string): Promise<boolean> {
    // PIX não suporta cancelamento após geração, apenas expiração
    return false;
  }

  public async processWebhook(payload: any): Promise<{
    transactionId: string;
    status: PaymentStatus;
    amount?: number;
  }> {
    try {
      const { type, data } = payload;

      if (type === "payment") {
        const paymentId = data.id;

        // Buscar detalhes do pagamento
        const payment = await this.getPaymentDetails(paymentId);

        return {
          transactionId: payment.external_reference || paymentId,
          status: this.mapMercadoPagoStatus(payment.status),
          amount: payment.transaction_amount,
        };
      }

      throw new Error("Tipo de webhook não suportado");
    } catch (error) {
      console.error("Erro ao processar webhook PIX:", error);
      throw error;
    }
  }

  // Private methods
  private async createPreference(
    preference: MercadoPagoPreference,
  ): Promise<MercadoPagoResponse> {
    console.error("SECURITY ALERT: Attempting to create PIX preference from frontend using secrets.");
    throw new Error(
      "Security Update: PIX payments must be processed via backend API to protect credentials. Frontend direct access to MercadoPago API has been disabled."
    );
  }

  private async generatePixQRCode(
    preferenceId: string,
    amount: number,
  ): Promise<{
    qr_code: string;
    qr_code_base64: string;
  }> {
    console.error("SECURITY ALERT: Attempting to get PIX data from frontend using secrets.");
    throw new Error(
      "Security Update: PIX data retrieval must be processed via backend API."
    );
  }

  private async generateQRCodeFromUrl(url: string): Promise<string> {
     // This method is safe, but unused if the above methods throw error.
     // Kept for future backend integration reference or utility.
      try {
      const QRCode = await import("qrcode");
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrCodeDataUrl.split(",")[1];
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      throw new Error("Falha ao gerar QR Code");
    }
  }

  private async getPaymentsByPreference(
    preferenceId: string,
  ): Promise<MercadoPagoPayment[]> {
    console.error("SECURITY ALERT: Attempting to search payments from frontend using secrets.");
    throw new Error(
      "Security Update: Payment verification must be processed via backend API."
    );
  }

  private mapMercadoPagoStatus(mpStatus: string): PaymentStatus {
    switch (mpStatus) {
      case "pending":
        return "pending";
      case "approved":
        return "completed";
      case "authorized":
        return "processing";
      case "in_process":
        return "processing";
      case "in_mediation":
        return "processing";
      case "rejected":
        return "failed";
      case "cancelled":
        return "cancelled";
      case "refunded":
        return "cancelled";
      case "charged_back":
        return "failed";
      default:
        return "pending";
    }
  }

  private async getPaymentDetails(
    paymentId: string,
  ): Promise<MercadoPagoPayment> {
     console.error("SECURITY ALERT: Attempting to get payment details from frontend using secrets.");
    throw new Error(
      "Security Update: Payment details retrieval must be processed via backend API."
    );
  }
}
