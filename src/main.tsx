import React from "react";
import * as ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import App from "./App";
import { auth0Config } from "./auth0-config";
import { privyConfig } from "./config/privy";
import { CartProvider } from "./contexts/CartContext";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

// Callback function to handle redirection after authentication
const onRedirectCallback = (appState: any) => {
  if (appState?.returnTo) {
    window.history.replaceState({}, document.title, appState.returnTo);
    // Force a page reload to ensure the correct component renders
    window.location.reload();
  }
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
    >
      <Auth0Provider 
        {...auth0Config}
        onRedirectCallback={onRedirectCallback}
      >
        <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json">
          <QueryClientProvider client={queryClient}>
            <CartProvider>
              <App />
            </CartProvider>
          </QueryClientProvider>
        </TonConnectUIProvider>
      </Auth0Provider>
    </PrivyProvider>
  );
}
