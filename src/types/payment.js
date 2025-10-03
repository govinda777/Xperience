// Tipos e interfaces para o sistema de pagamentos
export class PaymentError extends Error {
    code;
    provider;
    transactionId;
    details;
    constructor(options) {
        super(options.message);
        this.name = "PaymentError";
        this.code = options.code;
        this.provider = options.provider;
        this.transactionId = options.transactionId;
        this.details = options.details;
    }
}
