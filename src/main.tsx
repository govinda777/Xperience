import React from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import App from "./App";
import { CartProvider } from "./contexts/CartContext";
import { AppAuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Unregister any legacy service workers to prevent stale cache issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

if (typeof window !== 'undefined') {
  // Suprime avisos conhecidos da MetaMask
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (message.includes('web3') && message.includes('MetaMask')) {
      return; // Ignora aviso do web3
    }
    originalWarn.apply(console, args);
  };
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <AppAuthProvider>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json">
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <App />
          </CartProvider>
        </QueryClientProvider>
      </TonConnectUIProvider>
    </AppAuthProvider>,
  );
}
