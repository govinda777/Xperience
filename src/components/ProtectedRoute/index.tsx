import { useAppAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authenticated, ready } = useAppAuth();

  if (!ready) return <p>Carregando...</p>;

  return authenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
