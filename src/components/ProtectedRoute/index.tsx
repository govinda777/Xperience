import { usePrivy } from "@privy-io/react-auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authenticated, ready } = usePrivy();

  if (!ready) return <p>Carregando...</p>;

  return authenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
