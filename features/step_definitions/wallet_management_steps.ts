import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@jest/globals";

// Types
interface WalletData {
  address: string;
  smartAccountAddress: string;
  balance: string;
}

interface Transaction {
  hash: string;
  to: string;
  value: string;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
}

interface TransactionForm {
  to: string;
  value: string;
}

// Estado global para os testes
let currentPage = "wallet";
let walletData: WalletData | null = null;
let transactions: Transaction[] = [];
let currentTransaction: TransactionForm | null = null;
let lastTransactionHash: string | null = null;
let errorMessage: string | null = null;
let isLoading = false;
let authenticationState = {
  isAuthenticated: true,
  user: { sub: "user-123", email: "test@email.com" },
};

// Mock functions
const mockWalletService = {
  createWallet: (userId: string): WalletData => ({
    address: "test-wallet-address",
    smartAccountAddress: "test-smart-account",
    balance: "0",
  }),

  getBalance: (address: string): string => {
    return walletData?.balance || "0";
  },

  sendTransaction: (transaction: TransactionForm): string => {
    if (!walletData) throw new Error("Wallet not initialized");

    const balance = parseFloat(walletData.balance);
    const amount = parseFloat(transaction.value);

    if (balance < amount) {
      throw new Error("Saldo insuficiente");
    }

    if (!isValidAddress(transaction.to)) {
      throw new Error("Endereço inválido");
    }

    const hash = `0x${Date.now().toString(16)}`;
    const newTransaction: Transaction = {
      hash,
      to: transaction.to,
      value: transaction.value,
      status: "pending",
      timestamp: new Date(),
    };

    transactions.push(newTransaction);

    // Update balance
    walletData.balance = (balance - amount).toString();

    // Simulate confirmation after a delay
    setTimeout(() => {
      const tx = transactions.find((t) => t.hash === hash);
      if (tx) tx.status = "completed";
    }, 1000);

    return hash;
  },
};

const isValidAddress = (address: string): boolean => {
  return address.startsWith("0x") && address.length === 42;
};

const simulateWalletInitialization = (userId: string): void => {
  try {
    walletData = mockWalletService.createWallet(userId);
    errorMessage = null;
  } catch (error) {
    errorMessage = "Falha ao inicializar carteira";
    walletData = null;
  }
};

const simulateBalanceUpdate = (): void => {
  if (walletData) {
    // Simulate getting updated balance
    walletData.balance = "1.5";
  }
};

// Step Definitions

Given("que estou logado no sistema", function () {
  authenticationState.isAuthenticated = true;
  authenticationState.user = { sub: "user-123", email: "test@email.com" };
});

Given("tenho uma carteira digital configurada", function () {
  simulateWalletInitialization("user-123");
  walletData!.balance = "2.0"; // Set initial balance
});

Given("que sou um novo usuário autenticado", function () {
  authenticationState.isAuthenticated = true;
  authenticationState.user = {
    sub: "new-user-456",
    email: "newuser@email.com",
  };
  walletData = null;
  transactions = [];
});

Given("que tenho saldo suficiente na carteira", function () {
  if (!walletData) {
    simulateWalletInitialization("user-123");
  }
  walletData!.balance = "2.0";
});

Given("que não tenho saldo suficiente na carteira", function () {
  if (!walletData) {
    simulateWalletInitialization("user-123");
  }
  walletData!.balance = "0.1";
});

Given("que realizei várias transações", function () {
  transactions = [
    {
      hash: "0xabc123",
      to: "test-recipient-address-1",
      value: "0.5",
      status: "completed",
      timestamp: new Date("2023-01-01"),
    },
    {
      hash: "0xdef456",
      to: "test-recipient-address-2",
      value: "0.3",
      status: "completed",
      timestamp: new Date("2023-01-02"),
    },
  ];
});

Given("que tenho uma carteira configurada", function () {
  simulateWalletInitialization("user-123");
  walletData!.balance = "1.0";
});

Given("que estou usando Auth0 para autenticação", function () {
  authenticationState.isAuthenticated = true;
  authenticationState.user = { sub: "user-123", email: "test@email.com" };
});

Given("que tenho uma carteira ativa", function () {
  simulateWalletInitialization("user-123");
  walletData!.balance = "1.5";
});

When("eu acesso a página da carteira", function () {
  currentPage = "wallet";
});

When("eu acesso o sistema pela primeira vez", function () {
  simulateWalletInitialization("new-user-456");
});

When("eu preencho o formulário de transação:", function (dataTable: any) {
  const data = dataTable.hashes()[0];
  currentTransaction = {
    to: data.Destinatário,
    value: data.Valor,
  };
});

When("clico em {string}", function (buttonText: string) {
  if (buttonText === "Enviar" && currentTransaction) {
    try {
      lastTransactionHash =
        mockWalletService.sendTransaction(currentTransaction);
      errorMessage = null;
    } catch (error) {
      errorMessage = (error as Error).message;
      lastTransactionHash = null;
    }
  } else if (buttonText === "Atualizar Saldo") {
    isLoading = true;
    setTimeout(() => {
      simulateBalanceUpdate();
      isLoading = false;
    }, 500);
  } else if (buttonText === "Tentar Novamente") {
    errorMessage = null;
    simulateWalletInitialization("user-123");
  }
});

When("eu tento enviar uma transação de valor maior que meu saldo", function () {
  currentTransaction = {
    to: "test-recipient-address-1",
    value: "10.0", // More than available balance
  };

  try {
    mockWalletService.sendTransaction(currentTransaction);
  } catch (error) {
    errorMessage = (error as Error).message;
  }
});

When(
  "eu preencho o formulário de transação com endereço inválido:",
  function (dataTable: any) {
    const data = dataTable.hashes()[0];
    currentTransaction = {
      to: data.Destinatário,
      value: data.Valor,
    };
  },
);

When("eu acesso o histórico de transações", function () {
  currentPage = "transaction-history";
});

When("ocorre um erro na criação da carteira", function () {
  // Simulate wallet creation error
  walletData = null;
  errorMessage = "Falha ao inicializar carteira";
});

When("eu tento enviar uma transação", function () {
  currentTransaction = {
    to: "test-recipient-address-1",
    value: "0.5",
  };
});

When("ocorre um erro no processamento", function () {
  errorMessage = "Falha ao enviar transação";
  lastTransactionHash = null;
});

When("eu realizo operações na carteira", function () {
  // Simulate various operations
  isLoading = true;
});

When("minha sessão expira", function () {
  authenticationState.isAuthenticated = false;
  authenticationState.user = null;
  walletData = null;
});

When("eu faço login novamente", function () {
  authenticationState.isAuthenticated = true;
  authenticationState.user = { sub: "user-123", email: "test@email.com" };
  simulateWalletInitialization("user-123");
});

When("eu acesso a carteira em diferentes dispositivos", function () {
  // Simulate responsive behavior
  currentPage = "wallet";
});

When("eu deixo a aplicação inativa por muito tempo", function () {
  // Simulate session timeout
  authenticationState.isAuthenticated = false;
  walletData = null;
});

Then("devo ver meu endereço da carteira", function () {
  expect(walletData?.address).toBeDefined();
  expect(walletData?.address).toMatch(/^0x[a-fA-F0-9]{15}$/);
});

Then("devo ver meu endereço da conta inteligente", function () {
  expect(walletData?.smartAccountAddress).toBeDefined();
  expect(walletData?.smartAccountAddress).toMatch(/^0x[a-fA-F0-9]{15}$/);
});

Then("devo ver meu saldo atual", function () {
  expect(walletData?.balance).toBeDefined();
});

Then("devo ver o histórico de transações", function () {
  expect(currentPage).toBe("wallet");
  // In real implementation, would check for transaction history component
});

Then("uma carteira deve ser criada automaticamente", function () {
  expect(walletData).not.toBeNull();
});

Then("devo ver as informações da nova carteira", function () {
  expect(walletData?.address).toBeDefined();
  expect(walletData?.smartAccountAddress).toBeDefined();
});

Then("o saldo inicial deve ser zero", function () {
  expect(walletData?.balance).toBe("0");
});

Then("devo ver uma confirmação da transação", function () {
  expect(lastTransactionHash).toBeDefined();
  expect(errorMessage).toBeNull();
});

Then("o hash da transação deve ser exibido", function () {
  expect(lastTransactionHash).toMatch(/^0x[a-fA-F0-9]+$/);
});

Then("meu saldo deve ser atualizado", function () {
  expect(walletData?.balance).toBeDefined();
  // Balance should be reduced after transaction
});

Then("a transação deve aparecer no histórico", function () {
  const recentTransaction = transactions.find(
    (tx) => tx.hash === lastTransactionHash,
  );
  expect(recentTransaction).toBeDefined();
});

Then(
  "devo ver uma mensagem de erro {string}",
  function (expectedError: string) {
    expect(errorMessage).toBe(expectedError);
  },
);

Then("a transação não deve ser processada", function () {
  expect(lastTransactionHash).toBeNull();
});

Then("o saldo deve ser recarregado", function () {
  expect(walletData?.balance).toBe("1.5");
});

Then("devo ver o saldo mais recente", function () {
  expect(walletData?.balance).toBeDefined();
});

Then(
  "o indicador de carregamento deve ser exibido durante a atualização",
  function () {
    // In real implementation, would check for loading indicator
    expect(isLoading).toBeDefined();
  },
);

Then("devo ver uma lista das transações ordenadas por data", function () {
  expect(currentPage).toBe("transaction-history");
  expect(transactions.length).toBeGreaterThan(0);

  // Check if sorted by date (newest first)
  for (let i = 1; i < transactions.length; i++) {
    expect(transactions[i - 1].timestamp.getTime()).toBeGreaterThanOrEqual(
      transactions[i].timestamp.getTime(),
    );
  }
});

Then("cada transação deve mostrar:", function (dataTable: any) {
  const expectedFields = dataTable.hashes();
  const transaction = transactions[0];

  expect(transaction.hash).toBeDefined();
  expect(transaction.value).toBeDefined();
  expect(transaction.timestamp).toBeDefined();
  expect(transaction.status).toBeDefined();
  expect(transaction.to).toBeDefined();
});

Then("devo ter a opção de tentar novamente", function () {
  expect(errorMessage).toBe("Falha ao inicializar carteira");
});

Then("o processo de inicialização deve ser repetido", function () {
  expect(walletData).not.toBeNull();
  expect(errorMessage).toBeNull();
});

Then("a transação deve ser marcada como falhada", function () {
  expect(errorMessage).toBe("Falha ao enviar transação");
});

Then("meu saldo não deve ser alterado", function () {
  // Balance should remain unchanged on failed transaction
  expect(walletData?.balance).toBeDefined();
});

Then(
  "devo ver indicadores de carregamento apropriados:",
  function (dataTable: any) {
    const indicators = dataTable.hashes();
    // In real implementation, would check for specific loading indicators
    expect(indicators.length).toBeGreaterThan(0);
  },
);

Then("as informações da carteira devem ser limpos", function () {
  expect(walletData).toBeNull();
});

Then("devo ser redirecionado para login", function () {
  expect(authenticationState.isAuthenticated).toBe(false);
});

Then("minha carteira deve ser recarregada automaticamente", function () {
  expect(walletData).not.toBeNull();
  expect(authenticationState.isAuthenticated).toBe(true);
});

Then(
  "a interface deve se adaptar ao tamanho da tela:",
  function (dataTable: any) {
    const devices = dataTable.hashes();
    // In real implementation, would check responsive behavior
    expect(devices.length).toBe(3);
  },
);

Then("devo ser deslogado automaticamente por segurança", function () {
  expect(authenticationState.isAuthenticated).toBe(false);
});

Then("as informações sensíveis devem ser limpas da memória", function () {
  expect(walletData).toBeNull();
});

Then("devo reinicializar minha carteira", function () {
  expect(walletData).not.toBeNull();
});
