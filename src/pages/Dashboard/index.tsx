import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { user, logout } = useAuth0();

  return (
    <div>
      <h1>Área Logada</h1>
      <p>Bem-vindo, {user?.name}!</p>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
