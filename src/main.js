import { jsx as _jsx } from "react/jsx-runtime";
import * as ReactDOM from "react-dom/client";
// import { Auth0Provider } from "@auth0/auth0-react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import App from "./App";
// import { auth0Config } from "./auth0-config";
import { privyConfig } from "./config/privy";
import { CartProvider } from "./contexts/CartContext";
import "./index.css";
const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
});
const root = document.getElementById("root");
if (root) {
    ReactDOM.createRoot(root).render(_jsx(PrivyProvider, { appId: privyConfig.appId, config: privyConfig.config, children: _jsx(TonConnectUIProvider, { manifestUrl: "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json", children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(CartProvider, { children: _jsx(App, {}) }) }) }) }));
}
