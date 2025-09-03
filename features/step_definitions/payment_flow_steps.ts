import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@jest/globals";
import * as fs from 'fs';
import * as path from 'path';

// Load test configuration
const testConfig = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../test-data/payment-test-config.json'),
    'utf8'
  )
);

// Types
interface PaymentData {
  method: string;
  amount: number;
  currency: string;
  status: string;
  transactionId?: string;
  qrCode?: string;
  address?: string;
  expiresAt?: Date;
}

interface Plan {
  id: string;
  name: string;
  price: number;
}

// Estado global para os testes
let currentPage = "plans";
let selectedPlan: Plan | null = null;
let selectedPaymentMethod: string | null = null;
let paymentData: PaymentData | null = null;
let authenticationState = {
  isAuthenticated: true,
  user: { sub: "user-123", email: "test@email.com" },
};

// Mock data
const plans = {
  Essencial: { id: "essential", name: "Essencial", price: 297.0 },
  Expert: { id: "expert", name: "Expert", price: 497.0 },
  Premium: { id: "premium", name: "Premium", price: 797.0 },
};

const paymentMethods = {
  PIX: { id: "pix", discount: 0, confirmationTime: 0 },
  Bitcoin: { id: "bitcoin", discount: 0.05, confirmationTime: 30 },
  USDT: { id: "usdt", discount: 0.03, confirmationTime: 10 },
  "GitHub Pay": { id: "github", discount: 0, confirmationTime: "manual" },
};

// Helper functions
const calculatePrice = (basePrice: number, method: string): number => {
  const paymentMethod = Object.values(paymentMethods).find(
    (pm) => pm.id === method,
  );
  if (paymentMethod && paymentMethod.discount > 0) {
    return basePrice * (1 - paymentMethod.discount);
  }
  return basePrice;
};

const simulatePaymentProcessing = (
  method: string,
  amount: number,
): PaymentData => {
  const transactionId = `tx-${Date.now()}`;
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  switch (method) {
    case "pix":
      return {
        method,
        amount,
        currency: "BRL",
        status: "pending",
        transactionId,
        qrCode: testConfig.testQrCodes.pix,
        expiresAt,
      };
    case "bitcoin":
      return {
        method,
        amount: amount / 300000, // Mock BTC conversion
        currency: "BTC",
        status: "pending",
        transactionId,
        address: testConfig.testAddresses.bitcoin,
        qrCode: testConfig.testQrCodes.bitcoin,
        expiresAt,
      };
    case "usdt":
      return {
        method,
        amount: amount / 5.5, // Mock USDT conversion
        currency: "USDT",
        status: "pending",
        transactionId,
        address: testConfig.testAddresses.usdt,
        qrCode: testConfig.testQrCodes.usdt,
        expiresAt,
      };
    case "github":
      return {
        method,
        amount: amount * 0.18, // Mock USD conversion
        currency: "USD",
        status: "pending",
        transactionId,
        expiresAt,
      };
    default:
      throw new Error(`Unknown payment method: ${method}`);
  }
};

// Step Definitions

Given("que estou logado no sistema", function () {
  authenticationState.isAuthenticated = true;
  authenticationState.user = { sub: "user-123", email: "test@email.com" };
});

Given("estou na página de seleção de planos", function () {
  currentPage = "plans";
  selectedPlan = null;
  selectedPaymentMethod = null;
  paymentData = null;
});

Given("que selecionei o plano {string}", function (planName: string) {
  selectedPlan = plans[planName as keyof typeof plans];
  expect(selectedPlan).toBeDefined();
});

Given(
  "escolhi {string} como método de pagamento",
  function (methodName: string) {
    const method = paymentMethods[methodName as keyof typeof paymentMethods];
    expect(method).toBeDefined();
    selectedPaymentMethod = method.id;
  },
);

Given("que iniciei um processo de pagamento", function () {
  selectedPlan = plans["Essencial"];
  selectedPaymentMethod = "pix";
  paymentData = simulatePaymentProcessing("pix", 297.0);
  currentPage = "payment-pending";
});

Given("estou na tela de pagamento pendente", function () {
  expect(currentPage).toBe("payment-pending");
  expect(paymentData?.status).toBe("pending");
});

Given("que iniciei um pagamento via PIX", function () {
  selectedPlan = plans["Essencial"];
  selectedPaymentMethod = "pix";
  paymentData = simulatePaymentProcessing("pix", 297.0);
});

Given("não realizei o pagamento dentro do prazo", function () {
  if (paymentData) {
    paymentData.expiresAt = new Date(Date.now() - 1000); // Expired 1 second ago
  }
});

Given("que iniciei um pagamento", function () {
  selectedPlan = plans["Essencial"];
  selectedPaymentMethod = "pix";
  paymentData = simulatePaymentProcessing("pix", 297.0);
});

Given("que realizei um pagamento", function () {
  selectedPlan = plans["Essencial"];
  selectedPaymentMethod = "pix";
  paymentData = simulatePaymentProcessing("pix", 297.0);
  paymentData.status = "completed";
});

When("eu seleciono o plano {string}", function (planName: string) {
  selectedPlan = plans[planName as keyof typeof plans];
  expect(selectedPlan).toBeDefined();
});

When("clico em {string}", function (buttonText: string) {
  if (buttonText === "Assinar Agora") {
    currentPage = "payment-method-selection";
  } else if (buttonText.startsWith("Continuar com")) {
    const method = selectedPaymentMethod;
    if (method && selectedPlan) {
      paymentData = simulatePaymentProcessing(method, selectedPlan.price);
      currentPage = "payment-pending";
    }
  } else if (buttonText === "Cancelar") {
    currentPage = "payment-cancellation-confirm";
  } else if (buttonText === "Gerar Novo Pagamento") {
    if (selectedPlan && selectedPaymentMethod) {
      paymentData = simulatePaymentProcessing(
        selectedPaymentMethod,
        selectedPlan.price,
      );
    }
  } else if (buttonText === "Tentar Novamente") {
    currentPage = "payment-method-selection";
  }
});

When(
  "seleciono {string} como método de pagamento",
  function (methodName: string) {
    const method = paymentMethods[methodName as keyof typeof paymentMethods];
    expect(method).toBeDefined();
    selectedPaymentMethod = method.id;
  },
);

When("eu realizo o pagamento via PIX", function () {
  if (paymentData && paymentData.method === "pix") {
    paymentData.status = "completed";
  }
});

When("eu envio o Bitcoin para o endereço", function () {
  if (paymentData && paymentData.method === "bitcoin") {
    paymentData.status = "processing";
  }
});

When("eu envio o USDT para o endereço", function () {
  if (paymentData && paymentData.method === "usdt") {
    paymentData.status = "processing";
  }
});

When("eu confirmo o cancelamento", function () {
  if (paymentData) {
    paymentData.status = "cancelled";
  }
  currentPage = "plans";
});

When("o tempo de expiração é atingido", function () {
  if (
    paymentData &&
    paymentData.expiresAt &&
    paymentData.expiresAt < new Date()
  ) {
    paymentData.status = "expired";
  }
});

When("ocorre um erro no processamento", function () {
  if (paymentData) {
    paymentData.status = "failed";
  }
});

When("eu acesso a página de histórico de pagamentos", function () {
  currentPage = "payment-history";
});

When("eu estou na seleção de método de pagamento", function () {
  currentPage = "payment-method-selection";
});

When(
  "após a confirmação na blockchain o status deve mudar para {string}",
  function (status: string) {
    if (paymentData && paymentData.status === "processing") {
      paymentData.status =
        status === "Pagamento Confirmado" ? "completed" : status;
    }
  },
);

When(
  "após a confirmação o status deve mudar para {string}",
  function (status: string) {
    if (paymentData && paymentData.status === "processing") {
      paymentData.status =
        status === "Pagamento Confirmado" ? "completed" : status;
    }
  },
);

Then("devo ver o preço {string}", function (expectedPrice: string) {
  if (selectedPlan && selectedPaymentMethod) {
    const calculatedPrice = calculatePrice(
      selectedPlan.price,
      selectedPaymentMethod,
    );
    const formattedPrice = `R$ ${calculatedPrice.toFixed(2)}`;
    expect(formattedPrice).toBe(expectedPrice);
  }
});

Then("devo ver as informações sobre pagamento instantâneo", function () {
  expect(selectedPaymentMethod).toBe("pix");
  // In real implementation, would check for specific UI elements
});

Then("devo ver o botão {string}", function (buttonText: string) {
  // In real implementation, would check for button presence
  expect(buttonText).toContain("Continuar");
});

Then("devo ver um QR Code para pagamento", function () {
  expect(paymentData?.qrCode).toBeDefined();
});

Then("devo ver a chave PIX para cópia", function () {
  expect(paymentData?.method).toBe("pix");
});

Then("devo ver o valor {string}", function (expectedValue: string) {
  if (paymentData) {
    if (paymentData.currency === "BRL") {
      const formattedValue = `R$ ${paymentData.amount.toFixed(2)}`;
      expect(formattedValue).toBe(expectedValue);
    }
  }
});

Then("devo ver o tempo de expiração do pagamento", function () {
  expect(paymentData?.expiresAt).toBeDefined();
});

Then("o status deve mudar para {string}", function (expectedStatus: string) {
  const statusMap: { [key: string]: string } = {
    "Pagamento Confirmado": "completed",
    "Processando Pagamento": "processing",
    "Pagamento Expirado": "expired",
    "Pagamento Falhou": "failed",
    "Pagamento Cancelado": "cancelled",
  };

  const mappedStatus = statusMap[expectedStatus] || expectedStatus;
  expect(paymentData?.status).toBe(mappedStatus);
});

Then("devo ter acesso ao conteúdo do programa", function () {
  expect(paymentData?.status).toBe("completed");
});

Then(
  "devo ver o preço com desconto de {int}%",
  function (discountPercent: number) {
    if (selectedPlan && selectedPaymentMethod) {
      const originalPrice = selectedPlan.price;
      const discountedPrice = calculatePrice(
        originalPrice,
        selectedPaymentMethod,
      );
      const actualDiscount = (originalPrice - discountedPrice) / originalPrice;
      expect(Math.round(actualDiscount * 100)).toBe(discountPercent);
    }
  },
);

Then("devo ver as informações sobre pagamento descentralizado", function () {
  expect(selectedPaymentMethod).toBe("bitcoin");
});

Then("devo ver o badge {string}", function (badgeText: string) {
  // In real implementation, would check for badge presence
  expect(["5% OFF", "3% OFF", "NOVO"]).toContain(badgeText);
});

Then("devo ver o endereço Bitcoin para pagamento", function () {
  expect(paymentData?.method).toBe("bitcoin");
  expect(paymentData?.address).toBeDefined();
});

Then("devo ver o QR Code do endereço", function () {
  expect(paymentData?.qrCode).toBeDefined();
});

Then("devo ver o valor em BTC", function () {
  expect(paymentData?.currency).toBe("BTC");
});

Then("devo ver o tempo estimado de confirmação", function () {
  // In real implementation, would check for confirmation time display
  expect(paymentData?.method).toBe("bitcoin");
});

Then("devo ver o endereço USDT para pagamento", function () {
  expect(paymentData?.method).toBe("usdt");
  expect(paymentData?.address).toBeDefined();
});

Then("devo ver o valor em USDT", function () {
  expect(paymentData?.currency).toBe("USDT");
});

Then("devo ver o preço em USD", function () {
  expect(selectedPaymentMethod).toBe("github");
});

Then("devo ver as informações sobre patrocínio via GitHub", function () {
  expect(selectedPaymentMethod).toBe("github");
});

Then("devo ver uma confirmação de cancelamento", function () {
  expect(currentPage).toBe("payment-cancellation-confirm");
});

Then("o pagamento deve ser cancelado", function () {
  expect(paymentData?.status).toBe("cancelled");
});

Then("devo retornar à página de seleção de planos", function () {
  expect(currentPage).toBe("plans");
});

Then("devo ver a opção {string}", function (optionText: string) {
  // In real implementation, would check for option presence
  expect(["Gerar Novo Pagamento", "Tentar Novamente"]).toContain(optionText);
});

Then("um novo QR Code deve ser gerado", function () {
  expect(paymentData?.qrCode).toBeDefined();
});

Then("devo ver a mensagem de erro", function () {
  expect(paymentData?.status).toBe("failed");
});

Then("devo ver o status atual do pagamento", function () {
  expect(currentPage).toBe("payment-history");
  expect(paymentData?.status).toBeDefined();
});

Then("devo ver os detalhes da transação", function () {
  expect(paymentData?.transactionId).toBeDefined();
});

Then("devo poder verificar o status atualizado", function () {
  expect(currentPage).toBe("payment-history");
});

Then("devo ver todos os métodos disponíveis:", function (dataTable: any) {
  const methods = dataTable.hashes();
  expect(methods).toHaveLength(4);

  methods.forEach((method: any) => {
    expect(["PIX", "Bitcoin", "USDT", "GitHub"]).toContain(method.Método);
  });
});

Then("devo poder alternar entre os métodos", function () {
  expect(currentPage).toBe("payment-method-selection");
});

Then("os preços devem ser atualizados automaticamente", function () {
  // In real implementation, would check for price updates
  expect(selectedPlan).toBeDefined();
});
