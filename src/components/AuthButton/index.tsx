import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  // Obtém apenas o primeiro nome do usuário
  const firstName = user?.name?.split(" ")[0];

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Bem-vindo, {firstName}</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
};

export default AuthButton;
