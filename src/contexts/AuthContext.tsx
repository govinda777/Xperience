import React, { createContext, useContext } from "react";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { privyConfig } from "../config/privy";

// 1. Define Generic User Interface
export interface User {
  id: string;
  email?: { address: string };
  wallet?: { address: string };
  google?: { name: string };
  github?: { name: string; username?: string };
}

// 2. Define Context Value
export interface AuthContextValue {
  user: User | null;
  authenticated: boolean;
  ready: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppAuthProvider");
  }
  return context;
};

// Internal component to bridge Privy to AuthContext
const PrivyAuthBridge: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, authenticated, ready, login, logout } = usePrivy();

  const mappedUser: User | null = user
    ? {
        id: user.id,
        email: user.email ? { address: user.email.address } : undefined,
        wallet: user.wallet ? { address: user.wallet.address } : undefined,
        google: user.google ? { name: user.google.name } : undefined,
        github: user.github
          ? { name: user.github.name, username: user.github.username }
          : undefined,
      }
    : null;

  const value: AuthContextValue = {
    user: mappedUser,
    authenticated,
    ready,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const MockPrivyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mockValue: AuthContextValue = {
    user: {
      id: "mock-user-id",
      email: { address: "mock@example.com" },
      wallet: { address: "0xMockAddress..." },
    },
    authenticated: true,
    ready: true,
    login: () => console.log("Mock login"),
    logout: async () => console.log("Mock logout"),
  };
  return (
    <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
  );
};

export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (import.meta.env.VITE_MOCK_AUTH === "true") {
    return <MockPrivyProvider>{children}</MockPrivyProvider>;
  }

  return (
    <PrivyProvider appId={privyConfig.appId} config={privyConfig.config}>
      <PrivyAuthBridge>{children}</PrivyAuthBridge>
    </PrivyProvider>
  );
};
