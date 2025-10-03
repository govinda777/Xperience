import { jsx as _jsx } from "react/jsx-runtime";
jest.mock("@tonconnect/ui-react", () => ({
    TonConnectUIProvider: ({ children }) => _jsx("div", { children: children }),
}));
describe("App component", () => {
    test("renders without crashing", () => { });
});
