import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useUserWallet } from "../hooks/useUserWallet";
/**
 * Transaction component for sending ETH transactions
 */
const Transaction = () => {
    const { walletData, isLoading, error, sendTransaction } = useUserWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [txHash, setTxHash] = useState(null);
    const [txError, setTxError] = useState(null);
    const [isSending, setIsSending] = useState(false);
    /**
     * Handle form submission to send a transaction
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!recipient || !amount || parseFloat(amount) <= 0) {
            setTxError("Por favor, preencha todos os campos corretamente");
            return;
        }
        setTxHash(null);
        setTxError(null);
        setIsSending(true);
        try {
            // Convert amount to Wei (1 ETH = 10^18 Wei)
            const valueInEther = amount;
            // Send the transaction
            const hash = await sendTransaction({
                to: recipient,
                value: valueInEther,
            });
            // Set the transaction hash
            setTxHash(hash);
            // Clear form
            setRecipient("");
            setAmount("");
        }
        catch (err) {
            console.error("Transaction error:", err);
            setTxError(err instanceof Error ? err.message : "Erro ao enviar transação");
        }
        finally {
            setIsSending(false);
        }
    };
    if (!walletData) {
        return (_jsx("div", { className: "p-4 border rounded shadow-sm", children: "Conecte-se para enviar transa\u00E7\u00F5es" }));
    }
    return (_jsxs("div", { className: "p-4 border rounded shadow-sm bg-white", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Enviar Transa\u00E7\u00E3o" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "recipient", className: "block text-sm font-medium text-gray-700 mb-1", children: "Endere\u00E7o do Destinat\u00E1rio" }), _jsx("input", { type: "text", id: "recipient", value: recipient, onChange: (e) => setRecipient(e.target.value), placeholder: "0x...", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500", disabled: isSending || isLoading })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "amount", className: "block text-sm font-medium text-gray-700 mb-1", children: "Valor (ETH)" }), _jsx("input", { type: "number", id: "amount", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.01", step: "0.000001", min: "0", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500", disabled: isSending || isLoading }), walletData && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Saldo dispon\u00EDvel: ", Number(walletData.balance).toFixed(4), " ETH"] }))] }), _jsx("div", { className: "pt-2", children: _jsx("button", { type: "submit", className: "w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed", disabled: isSending || isLoading || !recipient || !amount, children: isSending ? "Enviando..." : "Enviar Transação" }) })] }), txHash && (_jsxs("div", { className: "mt-4 p-3 bg-green-50 border border-green-200 rounded", children: [_jsx("p", { className: "text-green-700 text-sm font-medium", children: "Transa\u00E7\u00E3o enviada com sucesso!" }), _jsx("p", { className: "text-xs mt-1 font-mono break-all", children: txHash }), _jsx("a", { href: `https://etherscan.io/tx/${txHash}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-blue-600 hover:underline mt-2 inline-block", children: "Ver no Etherscan \u2192" })] })), (txError || error) && (_jsx("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded", children: _jsx("p", { className: "text-red-700 text-sm", children: txError || error }) }))] }));
};
export default Transaction;
