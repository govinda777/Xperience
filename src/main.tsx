import React from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import App from "./App";
import { CartProvider } from "./contexts/CartContext";
import { AppAuthProvider } from "./contexts/AuthContext";
import "./index.css";

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
