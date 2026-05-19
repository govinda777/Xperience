import React from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { CartProvider } from "./contexts/CartContext";
import { AppAuthProvider } from "./contexts/AuthContext";
import "./index.css";

// Unregister any legacy service workers to prevent stale cache issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    Promise.all(registrations.map((registration) => registration.unregister()));
  });
}

if (typeof window !== 'undefined') {
  // Suprime avisos conhecidos da MetaMask, Turnstile e erros de aninhamento DOM do Privy
  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (
      (message.includes('web3') && message.includes('MetaMask')) ||
      message.includes('Cloudflare Turnstile') ||
      message.includes('cf-chl-widget') ||
      message.includes('turnstile.remove') ||
      (message.includes('validateDOMNesting') && message.includes('div') && message.includes('p'))
    ) {
      return; // Ignora avisos externos
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    if (
      (message.includes('validateDOMNesting') && message.includes('div') && message.includes('p')) ||
      message.includes('Cloudflare Turnstile') ||
      message.includes('cf-chl-widget') ||
      message.includes('turnstile.remove')
    ) {
      return; // Ignora erros de validação estrutural do próprio SDK do Privy / Turnstile
    }
    originalError.apply(console, args);
  };
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <AppAuthProvider>

        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <App />
          </CartProvider>
        </QueryClientProvider>

    </AppAuthProvider>,
  );
}
