import { Cell, Address } from "ton-core";
import Counter from "../counter"; // Certifique-se de que o caminho está correto

describe("Counter Contract", () => {
  it("deve criar o contrato para deploy", () => {
    const mockCode = new Cell();
    const initialCounterValue = 10;

    // Cria uma instância da classe Counter
    const counterContract = Counter.createForDeploy(mockCode, initialCounterValue);

    // Verifica se o contrato foi criado corretamente
    expect(counterContract).toBeInstanceOf(Counter);
    expect(counterContract.address).toBeDefined();
  });
});
