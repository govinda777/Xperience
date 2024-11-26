import ReactDOM from "react-dom/client";

// Mock do ReactDOM como default export
jest.mock("react-dom/client", () => ({
  __esModule: true,
  default: {
    createRoot: jest.fn(() => ({
      render: jest.fn(),
    })),
  },
}));

describe("Main.tsx", () => {
  let rootDiv: HTMLDivElement;

  beforeEach(() => {
    // Simula o elemento root no DOM
    rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);
  });

  afterEach(() => {
    // Limpa o DOM após o teste
    document.body.removeChild(rootDiv);
    jest.clearAllMocks();
  });

  test("renders the app using ReactDOM.createRoot", () => {
    // Usa jest.isolateModules para garantir que o mock seja aplicado corretamente
    jest.isolateModules(() => {
      // Importa o arquivo main.tsx após o mock estar configurado
      require("../main");
    });

    // Verifica se ReactDOM.createRoot foi chamado com o elemento correto
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootDiv);
  });
});
