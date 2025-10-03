import { jsx as _jsx } from "react/jsx-runtime";
import { usePrivy } from "@privy-io/react-auth";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
    const { authenticated, ready } = usePrivy();
    if (!ready)
        return _jsx("p", { children: "Carregando..." });
    return authenticated ? children : _jsx(Navigate, { to: "/" });
};
export default ProtectedRoute;
