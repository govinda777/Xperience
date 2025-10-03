import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export const PaymentStatusModal = ({ payment, status, method, onClose, onCancel, }) => {
    const [showQRCode, setShowQRCode] = useState(true);
    const [copiedAddress, setCopiedAddress] = useState(false);
    // Copiar endereço para clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedAddress(true);
            setTimeout(() => setCopiedAddress(false), 2000);
        }
        catch (error) {
            console.error("Erro ao copiar:", error);
        }
    };
    // Configurações por método de pagamento
    const methodConfig = {
        pix: {
            title: "Pagamento PIX",
            icon: "🏦",
            color: "green",
            instructions: "Escaneie o QR Code com seu app bancário ou copie o código PIX",
        },
        bitcoin: {
            title: "Pagamento Bitcoin",
            icon: "₿",
            color: "orange",
            instructions: "Envie Bitcoin para o endereço abaixo",
        },
        usdt: {
            title: "Pagamento USDT",
            icon: "💰",
            color: "green",
            instructions: "Envie USDT para o endereço abaixo",
        },
    };
    const config = methodConfig[method];
    // Status do pagamento
    const getStatusInfo = () => {
        switch (status) {
            case "pending":
                return {
                    icon: "⏳",
                    title: "Aguardando Pagamento",
                    description: "Realize o pagamento para continuar",
                    color: "yellow",
                };
            case "processing":
                return {
                    icon: "🔄",
                    title: "Processando Pagamento",
                    description: "Seu pagamento está sendo confirmado",
                    color: "blue",
                };
            case "completed":
                return {
                    icon: "✅",
                    title: "Pagamento Confirmado!",
                    description: "Seu acesso foi liberado com sucesso",
                    color: "green",
                };
            case "failed":
                return {
                    icon: "❌",
                    title: "Pagamento Falhou",
                    description: "Houve um problema com seu pagamento",
                    color: "red",
                };
            case "expired":
                return {
                    icon: "⏰",
                    title: "Pagamento Expirado",
                    description: "O tempo limite para pagamento foi excedido",
                    color: "gray",
                };
            default:
                return {
                    icon: "⏳",
                    title: "Aguardando",
                    description: "Preparando pagamento...",
                    color: "gray",
                };
        }
    };
    const statusInfo = getStatusInfo();
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-3xl", children: config.icon }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: config.title }), _jsxs("p", { className: "text-sm text-gray-600", children: ["ID: ", payment.transactionId.slice(-8)] })] })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 text-2xl", children: "\u00D7" })] }) }), _jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("span", { className: "text-2xl", children: statusInfo.icon }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-800", children: statusInfo.title }), _jsx("p", { className: "text-sm text-gray-600", children: statusInfo.description })] })] }), status === "processing" && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-sm text-blue-800", children: method === "pix"
                                            ? "Confirmando pagamento PIX..."
                                            : "Aguardando confirmações na blockchain..." })] }) }))] }), (status === "pending" || status === "processing") && (_jsxs("div", { className: "p-6", children: [_jsx("p", { className: "text-sm text-gray-600 mb-4", children: config.instructions }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600", children: "Valor a pagar:" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "font-bold text-lg", children: method === "pix"
                                                    ? `R$ ${payment.amount.toFixed(2)}`
                                                    : method === "bitcoin"
                                                        ? `₿ ${payment.amount.toFixed(8)}`
                                                        : `$${payment.amount.toFixed(2)} USDT` }), method !== "pix" && (_jsxs("div", { className: "text-xs text-gray-500", children: ["\u2248 R$ ", payment.metadata?.originalAmount?.toFixed(2)] }))] })] }) }), payment.qrCodeBase64 && showQRCode && (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "QR Code:" }), _jsx("button", { onClick: () => setShowQRCode(false), className: "text-xs text-gray-500 hover:text-gray-700", children: "Ocultar" })] }), _jsx("div", { className: "flex justify-center p-4 bg-white border-2 border-gray-200 rounded-lg", children: _jsx("img", { src: `data:image/png;base64,${payment.qrCodeBase64}`, alt: "QR Code", className: "w-48 h-48" }) })] })), (payment.paymentAddress || payment.qrCode) && (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: method === "pix" ? "Código PIX:" : "Endereço:" }), !showQRCode && payment.qrCodeBase64 && (_jsx("button", { onClick: () => setShowQRCode(true), className: "text-xs text-blue-600 hover:text-blue-800", children: "Mostrar QR Code" }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", value: payment.paymentAddress || payment.qrCode || "", readOnly: true, className: "flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono" }), _jsx("button", { onClick: () => copyToClipboard(payment.paymentAddress || payment.qrCode || ""), className: `
                      px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${copiedAddress
                                                ? "bg-green-100 text-green-800"
                                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"}
                    `, children: copiedAddress ? "✓ Copiado" : "Copiar" })] })] })), payment.expiresAt && (_jsx("div", { className: "mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-yellow-500", children: "\u23F0" }), _jsxs("span", { className: "text-sm text-yellow-800", children: ["Expira em:", " ", new Date(payment.expiresAt).toLocaleString("pt-BR")] })] }) })), method === "bitcoin" && (_jsx("div", { className: "mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-orange-800", children: [_jsx("strong", { children: "Importante:" }), " Envie exatamente \u20BF", " ", payment.amount.toFixed(8), ". A confirma\u00E7\u00E3o pode levar de 10 a 30 minutos."] }) })), method === "usdt" && (_jsx("div", { className: "mb-4 p-3 bg-green-50 border border-green-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-green-800", children: [_jsx("strong", { children: "Rede:" }), " ", payment.metadata?.networkId === 1 ? "Ethereum" : "Polygon", _jsx("br", {}), _jsx("strong", { children: "Valor:" }), " Exatamente $", payment.amount.toFixed(2), " USDT"] }) }))] })), status === "completed" && (_jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83C\uDF89" }), _jsx("h3", { className: "text-xl font-bold text-green-600 mb-2", children: "Pagamento Confirmado!" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Seu acesso foi liberado com sucesso. Voc\u00EA j\u00E1 pode come\u00E7ar a usar todos os recursos do seu plano." }), _jsx("button", { onClick: onClose, className: "w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors", children: "Continuar" })] })), (status === "failed" || status === "expired") && (_jsxs("div", { className: "p-6 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: status === "failed" ? "❌" : "⏰" }), _jsx("h3", { className: "text-xl font-bold text-red-600 mb-2", children: status === "failed" ? "Pagamento Falhou" : "Pagamento Expirado" }), _jsx("p", { className: "text-gray-600 mb-4", children: status === "failed"
                                ? "Houve um problema com seu pagamento. Tente novamente ou escolha outro método."
                                : "O tempo limite para pagamento foi excedido. Você pode tentar novamente." }), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { onClick: onClose, className: "w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors", children: "Tentar Novamente" }), _jsx("button", { onClick: onCancel, className: "w-full py-2 px-6 text-gray-600 hover:text-gray-800 transition-colors", children: "Cancelar" })] })] })), (status === "pending" || status === "processing") && (_jsxs("div", { className: "p-6 border-t border-gray-200 space-y-2", children: [_jsx("button", { onClick: onCancel, className: "w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors", children: "Cancelar Pagamento" }), _jsx("p", { className: "text-xs text-gray-500 text-center", children: "Voc\u00EA pode fechar esta janela e o pagamento continuar\u00E1 sendo monitorado" })] }))] }) }));
};
