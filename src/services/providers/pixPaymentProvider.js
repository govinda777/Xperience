import { PAYMENT_CONFIG, PAYMENT_CONSTANTS } from "../../config/payment";
export class PixPaymentProvider {
    // Public properties
    id = "pix";
    name = "PIX";
    type = "fiat";
    supportedCurrencies = ["BRL"];
    // Private properties
    baseUrl;
    accessToken;
    constructor() {
        this.accessToken = PAYMENT_CONFIG.mercadoPago.accessToken;
        this.baseUrl = PAYMENT_CONFIG.mercadoPago.sandboxMode
            ? "https://api.mercadopago.com/sandbox"
            : "https://api.mercadopago.com";
        if (!this.accessToken) {
            throw new Error("Token de acesso do Mercado Pago não configurado");
        }
    }
    // Public methods
    validatePaymentData(data) {
        const errors = [];
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
    formatAmount(amount, currency) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(amount);
    }
    isPaymentExpired(expirationDate) {
        return new Date(expirationDate).getTime() < Date.now();
    }
    calculateDiscountedAmount(amount, currency) {
        return amount; // No discount for PIX
    }
    getSupportedNetworks() {
        return []; // PIX doesn't use blockchain networks
    }
    getEstimatedConfirmationTime() {
        return "Instantâneo";
    }
    getPaymentInstructions(locale) {
        return "1. Abra o aplicativo do seu banco\n2. Selecione a opção PIX\n3. Escaneie o QR Code ou copie o código PIX\n4. Confirme o pagamento";
    }
    async process(amount, planId, userId) {
        try {
            const externalReference = `${userId}-${planId}-${Date.now()}`;
            const expirationDate = new Date(Date.now() + PAYMENT_CONSTANTS.PIX_TIMEOUT);
            const preference = {
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
        }
        catch (error) {
            console.error("Erro ao processar pagamento PIX:", error);
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            throw new Error(`Falha ao processar pagamento PIX: ${errorMessage}`);
        }
    }
    async verify(transactionId) {
        try {
            // Buscar pagamentos pela preferência
            const payments = await this.getPaymentsByPreference(transactionId);
            if (!payments || payments.length === 0) {
                return "pending";
            }
            // Pegar o pagamento mais recente
            const latestPayment = payments.sort((a, b) => new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime())[0];
            return this.mapMercadoPagoStatus(latestPayment.status);
        }
        catch (error) {
            console.error("Erro ao verificar pagamento PIX:", error);
            return "failed";
        }
    }
    async cancel(transactionId) {
        // PIX não suporta cancelamento após geração, apenas expiração
        return false;
    }
    async processWebhook(payload) {
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
        }
        catch (error) {
            console.error("Erro ao processar webhook PIX:", error);
            throw error;
        }
    }
    // Private methods
    async createPreference(preference) {
        const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(preference),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao criar preferência: ${error}`);
        }
        return await response.json();
    }
    async generatePixQRCode(preferenceId, amount) {
        try {
            // Buscar dados PIX da preferência
            const response = await fetch(`${this.baseUrl}/checkout/preferences/${preferenceId}`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar dados PIX");
            }
            const preferenceData = await response.json();
            // Se o Mercado Pago já forneceu o QR Code, usar ele
            if (preferenceData.qr_code && preferenceData.qr_code_base64) {
                return {
                    qr_code: preferenceData.qr_code,
                    qr_code_base64: preferenceData.qr_code_base64,
                };
            }
            // Caso contrário, gerar QR Code com a URL de pagamento
            const qrCode = await this.generateQRCodeFromUrl(preferenceData.init_point);
            return {
                qr_code: preferenceData.init_point,
                qr_code_base64: qrCode,
            };
        }
        catch (error) {
            console.error("Erro ao gerar QR Code PIX:", error);
            throw error;
        }
    }
    async generateQRCodeFromUrl(url) {
        try {
            // Usar biblioteca QRCode para gerar o código
            const QRCode = await import("qrcode");
            const qrCodeDataUrl = await QRCode.toDataURL(url, {
                width: 256,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            });
            // Extrair apenas a parte base64
            return qrCodeDataUrl.split(",")[1];
        }
        catch (error) {
            console.error("Erro ao gerar QR Code:", error);
            throw new Error("Falha ao gerar QR Code");
        }
    }
    async getPaymentsByPreference(preferenceId) {
        try {
            const response = await fetch(`${this.baseUrl}/v1/payments/search?preference_id=${preferenceId}`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao buscar pagamentos");
            }
            const data = await response.json();
            return data.results || [];
        }
        catch (error) {
            console.error("Erro ao buscar pagamentos:", error);
            return [];
        }
    }
    mapMercadoPagoStatus(mpStatus) {
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
    async getPaymentDetails(paymentId) {
        const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar detalhes do pagamento");
        }
        return await response.json();
    }
}
