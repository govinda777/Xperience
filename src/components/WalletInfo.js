import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUserWallet } from "../hooks/useUserWallet";
/**
 * Component to display wallet information
 */
const WalletInfo = () => {
    const { walletData, isLoading, error, refreshBalance } = useUserWallet();
    if (isLoading) {
        return (_jsx("div", { className: "p-4 border rounded shadow-sm", children: "Carregando dados da carteira..." }));
    }
    if (error) {
        return (_jsxs("div", { className: "p-4 border rounded shadow-sm bg-red-50 text-red-600", children: [_jsxs("p", { children: ["Erro ao carregar carteira: ", error] }), _jsx("button", { className: "mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700", onClick: () => window.location.reload(), children: "Tentar Novamente" })] }));
    }
    if (!walletData) {
        return (_jsx("div", { className: "p-4 border rounded shadow-sm", children: "Conecte-se para visualizar sua carteira" }));
    }
    // Format the wallet address to show only first and last characters
    const formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };
    return (_jsxs("div", { className: "p-4 border rounded shadow-sm bg-white", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Sua Carteira" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600", children: "Endere\u00E7o:" }), _jsx("span", { className: "font-mono bg-gray-100 p-1 rounded text-sm", children: formatAddress(walletData.smartAccountAddress) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600", children: "Saldo:" }), _jsxs("span", { className: "font-semibold", children: [Number(walletData.balance).toFixed(4), " ETH"] })] })] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx("button", { className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", onClick: refreshBalance, children: "Atualizar Saldo" }) }), _jsxs("div", { className: "mt-4 pt-4 border-t text-xs text-gray-500", children: [_jsx("p", { children: "Carteira ERC-4337 - Conta Inteligente" }), _jsx("p", { className: "mt-1", children: _jsx("a", { href: `https://etherscan.io/address/${walletData.smartAccountAddress}`, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:underline", children: "Ver no Etherscan \u2192" }) })] })] }));
};
export default WalletInfo;
