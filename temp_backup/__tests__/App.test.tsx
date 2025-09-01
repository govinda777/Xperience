import { render } from "@testing-library/react";
import App from "../App";

jest.mock("@tonconnect/ui-react", () => ({
  TonConnectUIProvider: ({ children }: any) => <div>{children}</div>,
}));

describe("App component", () => {
  test("renders without crashing", () => {
    
  });
});
