import React, { createContext, useContext } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { privyConfig } from "../config/privy";

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

const MockPrivyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockValue = {
    user: { id: "mock-user-id" },
    authenticated: true,
    ready: true,
  };
  return <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>;
};

export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (import.meta.env.VITE_MOCK_AUTH === "true") {
    return <MockPrivyProvider>{children}</MockPrivyProvider>;
  }

  return (
    <PrivyProvider appId={privyConfig.appId} config={privyConfig.config}>
      {children}
    </PrivyProvider>
  );
};

export const useAppAuth = () => {
  if (import.meta.env.VITE_MOCK_AUTH === "true") {
    return useAuth();
  }
  return usePrivy();
};
