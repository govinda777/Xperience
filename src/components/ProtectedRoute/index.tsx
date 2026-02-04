import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authenticated, ready } = useAuth();

  if (!ready) return <p>Carregando...</p>;

  return authenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
