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
    // Log para debug
    console.log("Privy App ID:", privyConfig.appId);
    
    ReactDOM.createRoot(root).render(
        _jsx(PrivyProvider, { 
            appId: "cmdwdbrix009rky0ch4w7hgvm", 
            config: {
                loginMethods: ["email", "google", "github"],
                appearance: {
                    theme: "dark",
                    accentColor: "#FD9526",
                    logo: "/logo.svg",
                }
            }, 
            children: _jsx(QueryClientProvider, { 
                client: queryClient, 
                children: _jsx(CartProvider, { 
                    children: _jsx(App, {}) 
                }) 
            }) 
        })
    );
}
