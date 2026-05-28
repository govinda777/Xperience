import React from "react";
import { AuthContext, AuthContextValue } from "./AuthContext";

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({
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
