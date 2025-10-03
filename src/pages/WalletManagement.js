import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePrivy } from "@privy-io/react-auth";
import WalletInfo from "../components/WalletInfo";
import Transaction from "../components/Transaction";
/**
 * Wallet Management Page
 */
const WalletManagement = () => {
    const { authenticated, ready, login, user } = usePrivy();
    if (!ready) {
        return (_jsx("div", { className: "flex items-center justify-center h-96", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Carregando..." })] }) }));
    }
    if (!authenticated) {
        return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-8", children: _jsxs("div", { className: "text-center bg-white p-8 rounded-lg shadow-sm border", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Gerencie sua Carteira Digital" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Fa\u00E7a login para acessar sua carteira digital e gerenciar suas transa\u00E7\u00F5es." }), _jsx("button", { onClick: () => login(), className: "px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors", children: "Fazer Login" }), _jsxs("div", { className: "mt-10 pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "text-lg font-medium mb-2", children: "Recursos da Carteira" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4", children: [_jsxs("div", { className: "p-4 bg-blue-50 rounded-md", children: [_jsx("h4", { className: "font-medium text-blue-800", children: "Sem Gas" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Transa\u00E7\u00F5es sem custos de gas para voc\u00EA" })] }), _jsxs("div", { className: "p-4 bg-green-50 rounded-md", children: [_jsx("h4", { className: "font-medium text-green-800", children: "Recupera\u00E7\u00E3o Social" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Nunca perca acesso \u00E0 sua carteira" })] }), _jsxs("div", { className: "p-4 bg-purple-50 rounded-md", children: [_jsx("h4", { className: "font-medium text-purple-800", children: "Seguran\u00E7a Avan\u00E7ada" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Prote\u00E7\u00E3o com tecnologia de contrato inteligente" })] })] })] })] }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Sua Carteira Digital" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Bem-vindo(a),", " ", user?.email?.address?.split("@")[0] ||
                                user?.wallet?.address?.slice(0, 10) + "..." ||
                                "Usuário", "! Gerencie sua carteira e fa\u00E7a transa\u00E7\u00F5es."] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx("div", { children: _jsx(WalletInfo, {}) }), _jsx("div", { children: _jsx(Transaction, {}) })] }), _jsxs("div", { className: "mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200", children: [_jsx("h3", { className: "text-lg font-medium text-blue-800 mb-2", children: "Sobre Carteiras ERC-4337" }), _jsx("p", { className: "text-sm text-gray-700", children: "Sua carteira utiliza a tecnologia de Account Abstraction (ERC-4337), que oferece recursos avan\u00E7ados como recupera\u00E7\u00E3o de acesso, transa\u00E7\u00F5es sem gas, e maior seguran\u00E7a. Todos esses benef\u00EDcios s\u00E3o gerenciados automaticamente para voc\u00EA." }), _jsx("p", { className: "text-sm text-gray-700 mt-2", children: "Quando voc\u00EA faz login com sua conta, nossa plataforma vincula uma carteira digital \u00FAnica para voc\u00EA, n\u00E3o sendo necess\u00E1rio instalar nenhum software adicional ou extens\u00E3o de navegador." })] })] }));
};
export default WalletManagement;
