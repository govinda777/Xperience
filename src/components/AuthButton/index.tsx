import React from "react";
import { usePrivy } from "@privy-io/react-auth";

const AuthButton = () => {
  const { login, logout, authenticated, user } = usePrivy();

  // Obtém apenas o primeiro nome do usuário
  const firstName = user?.email?.address?.split("@")[0] || user?.wallet?.address?.slice(0, 6) + "..." || "Usuário";

  return (
    <div>
      {authenticated ? (
        <>
          <p>Bem-vindo, {firstName}</p>
          <button onClick={() => logout()}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => login()}>Login</button>
      )}
    </div>
  );
};

export default AuthButton;
