import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { usePrivy } from "@privy-io/react-auth";
const AuthButton = () => {
    const { login, logout, authenticated, user } = usePrivy();
    // Obtém apenas o primeiro nome do usuário
    const firstName = user?.email?.address?.split("@")[0] ||
        user?.wallet?.address?.slice(0, 6) + "..." ||
        "Usuário";
    return (_jsx("div", { children: authenticated ? (_jsxs(_Fragment, { children: [_jsxs("p", { children: ["Bem-vindo, ", firstName] }), _jsx("button", { onClick: () => logout(), children: "Logout" })] })) : (_jsx("button", { onClick: () => login(), children: "Login" })) }));
};
export default AuthButton;
