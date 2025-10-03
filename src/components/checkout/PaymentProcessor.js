import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useCart } from "../../contexts/CartContext";
import { PrivyPaymentProvider } from "../../services/providers/privyPaymentProvider";
import { formatCurrency } from "../../types/cart";
import { QRCodeSVG } from "qrcode.react";
import { Copy, ExternalLink, CheckCircle, XCircle, Clock, RefreshCw, } from "lucide-react";
const PaymentProcessor = ({ paymentMethod, customerInfo, billingAddress, onSuccess, onError, onCancel, }) => {
    const { user } = usePrivy();
    const { cart, getCartSummary } = useCart();
    const summary = getCartSummary();
    const [paymentResult, setPaymentResult] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(null);
    const paymentProvider = new PrivyPaymentProvider();
    // Iniciar processamento do pagamento
    useEffect(() => {
        if (!user || !cart)
            return;
        const processPayment = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                let result;
                switch (paymentMethod) {
                    case "pix":
                        result = await paymentProvider.processPixPayment(summary.total, cart.items[0]?.planId || "default", user.id, customerInfo);
                        break;
                    case "bitcoin":
                        result = await paymentProvider.processBitcoinPayment(summary.total, cart.items[0]?.planId || "default", user.id);
                        break;
                    case "usdt":
                        result = await paymentProvider.processUSDTPayment(summary.total, cart.items[0]?.planId || "default", user.id);
                        break;
                    case "github":
                        result = await paymentProvider.processGitHubPayment(summary.total, cart.items[0]?.planId || "default", user.id, user.github?.username || undefined);
                        break;
                    default:
                        throw new Error("Método de pagamento não suportado");
                }
                setPaymentResult(result);
                // Configurar timer se houver expiração
                if (result.expiresAt) {
                    const expirationTime = result.expiresAt.getTime();
                    const now = Date.now();
                    setTimeRemaining(Math.max(0, Math.floor((expirationTime - now) / 1000)));
                }
                // Iniciar verificação de status
                startStatusPolling(result.transactionId);
            }
            catch (err) {
                console.error("Erro ao processar pagamento:", err);
                setError(err instanceof Error ? err.message : "Erro desconhecido");
                onError(err instanceof Error ? err.message : "Erro desconhecido");
            }
            finally {
                setIsProcessing(false);
            }
        };
        processPayment();
    }, [user, cart, paymentMethod, customerInfo]);
    // Timer para expiração
    useEffect(() => {
        if (timeRemaining <= 0)
            return;
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setPaymentStatus("expired");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeRemaining]);
    // Polling para verificar status do pagamento
    const startStatusPolling = (transactionId) => {
        const pollInterval = setInterval(async () => {
            try {
                const status = await paymentProvider.verify(transactionId);
                setPaymentStatus(status);
                if (status === "completed") {
                    clearInterval(pollInterval);
                    onSuccess(transactionId);
                }
                else if (status === "failed" ||
                    status === "expired" ||
                    status === "cancelled") {
                    clearInterval(pollInterval);
                }
            }
            catch (error) {
                console.error("Erro ao verificar status:", error);
            }
        }, 5000); // Verificar a cada 5 segundos
        // Limpar polling após 30 minutos
        setTimeout(() => {
            clearInterval(pollInterval);
        }, 30 * 60 * 1000);
    };
    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        }
        catch (error) {
            console.error("Erro ao copiar:", error);
        }
    };
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };
    const getStatusIcon = () => {
        switch (paymentStatus) {
            case "completed":
                return _jsx(CheckCircle, { className: "w-8 h-8 text-green-500" });
            case "failed":
            case "expired":
            case "cancelled":
                return _jsx(XCircle, { className: "w-8 h-8 text-red-500" });
            case "processing":
                return _jsx(RefreshCw, { className: "w-8 h-8 text-blue-500 animate-spin" });
            default:
                return _jsx(Clock, { className: "w-8 h-8 text-yellow-500" });
        }
    };
    const getStatusMessage = () => {
        switch (paymentStatus) {
            case "completed":
                return "Pagamento confirmado com sucesso!";
            case "processing":
                return "Processando pagamento...";
            case "failed":
                return "Pagamento falhou. Tente novamente.";
            case "expired":
                return "Pagamento expirou. Inicie um novo pagamento.";
            case "cancelled":
                return "Pagamento cancelado.";
            default:
                return "Aguardando pagamento...";
        }
    };
    if (isProcessing) {
        return (_jsx("div", { className: "max-w-2xl mx-auto p-6", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Processando pagamento..." }), _jsx("p", { className: "text-gray-600", children: "Aguarde enquanto configuramos seu pagamento" })] }) }));
    }
    if (error) {
        return (_jsx("div", { className: "max-w-2xl mx-auto p-6", children: _jsxs("div", { className: "text-center", children: [_jsx(XCircle, { className: "w-12 h-12 text-red-500 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-2 text-red-600", children: "Erro no Pagamento" }), _jsx("p", { className: "text-gray-600 mb-4", children: error }), _jsx("button", { onClick: onCancel, className: "bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "Voltar" })] }) }));
    }
    if (!paymentResult) {
        return (_jsx("div", { className: "max-w-2xl mx-auto p-6", children: _jsx("div", { className: "text-center", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2 mx-auto" })] }) }) }));
    }
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-6", children: [_jsxs("div", { className: "text-center mb-8", children: [getStatusIcon(), _jsx("h2", { className: "text-2xl font-bold mt-4 mb-2", children: getStatusMessage() }), timeRemaining > 0 && paymentStatus === "pending" && (_jsxs("p", { className: "text-gray-600", children: ["Tempo restante:", " ", _jsx("span", { className: "font-mono font-bold", children: formatTime(timeRemaining) })] }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Detalhes do Pagamento" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "M\u00E9todo:" }), _jsx("span", { className: "font-medium capitalize", children: paymentMethod })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Valor:" }), _jsx("span", { className: "font-bold", children: formatCurrency(paymentResult.amount, paymentResult.currency) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "ID da Transa\u00E7\u00E3o:" }), _jsx("span", { className: "font-mono text-sm", children: paymentResult.transactionId })] })] })] }), paymentMethod === "pix" && paymentResult.qrCode && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Pagamento via PIX" }), _jsx("div", { className: "text-center mb-4", children: _jsx(QRCodeSVG, { value: paymentResult.qrCode, size: 200, className: "mx-auto" }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "C\u00F3digo PIX (Copia e Cola):" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: paymentResult.qrCode, readOnly: true, className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono" }), _jsx("button", { onClick: () => copyToClipboard(paymentResult.qrCode, "pix"), className: "px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: copied === "pix" ? (_jsx(CheckCircle, { className: "w-4 h-4" })) : (_jsx(Copy, { className: "w-4 h-4" })) })] })] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 mb-2", children: "Como pagar:" }), _jsxs("ol", { className: "text-sm text-blue-800 space-y-1", children: [_jsx("li", { children: "1. Abra o app do seu banco" }), _jsx("li", { children: "2. Escaneie o QR Code ou cole o c\u00F3digo PIX" }), _jsx("li", { children: "3. Confirme o pagamento" }), _jsx("li", { children: "4. Aguarde a confirma\u00E7\u00E3o autom\u00E1tica" })] })] })] })] })), paymentMethod === "bitcoin" && paymentResult.paymentAddress && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Pagamento via Bitcoin" }), _jsx("div", { className: "text-center mb-4", children: _jsx(QRCodeSVG, { value: `bitcoin:${paymentResult.paymentAddress}?amount=${paymentResult.amount}`, size: 200, className: "mx-auto" }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Endere\u00E7o Bitcoin:" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: paymentResult.paymentAddress, readOnly: true, className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono" }), _jsx("button", { onClick: () => copyToClipboard(paymentResult.paymentAddress, "address"), className: "px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors", children: copied === "address" ? (_jsx(CheckCircle, { className: "w-4 h-4" })) : (_jsx(Copy, { className: "w-4 h-4" })) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Valor em BTC:" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: `${paymentResult.amount} BTC`, readOnly: true, className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono" }), _jsx("button", { onClick: () => copyToClipboard(paymentResult.amount.toString(), "amount"), className: "px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors", children: copied === "amount" ? (_jsx(CheckCircle, { className: "w-4 h-4" })) : (_jsx(Copy, { className: "w-4 h-4" })) })] })] }), _jsxs("div", { className: "bg-orange-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-medium text-orange-900 mb-2", children: "Instru\u00E7\u00F5es:" }), _jsxs("ul", { className: "text-sm text-orange-800 space-y-1", children: [_jsxs("li", { children: ["\u2022 Envie exatamente ", paymentResult.amount, " BTC para o endere\u00E7o acima"] }), _jsx("li", { children: "\u2022 A confirma\u00E7\u00E3o pode levar de 10 minutos a 1 hora" }), _jsx("li", { children: "\u2022 N\u00E3o envie de exchanges, use uma carteira pessoal" }), _jsx("li", { children: "\u2022 Verifique sempre o endere\u00E7o antes de enviar" })] })] })] })] })), paymentMethod === "usdt" && paymentResult.paymentAddress && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Pagamento via USDT" }), _jsx("div", { className: "text-center mb-4", children: _jsx(QRCodeSVG, { value: paymentResult.paymentAddress, size: 200, className: "mx-auto" }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Endere\u00E7o USDT (", paymentResult.metadata?.network || "Ethereum", "):"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: paymentResult.paymentAddress, readOnly: true, className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono" }), _jsx("button", { onClick: () => copyToClipboard(paymentResult.paymentAddress, "usdt-address"), className: "px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors", children: copied === "usdt-address" ? (_jsx(CheckCircle, { className: "w-4 h-4" })) : (_jsx(Copy, { className: "w-4 h-4" })) })] })] }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-medium text-green-900 mb-2", children: "Importante:" }), _jsxs("ul", { className: "text-sm text-green-800 space-y-1", children: [_jsx("li", { children: "\u2022 Envie apenas USDT para este endere\u00E7o" }), _jsxs("li", { children: ["\u2022 Rede: ", paymentResult.metadata?.network || "Ethereum"] }), _jsxs("li", { children: ["\u2022 Valor: ", paymentResult.amount, " USDT"] }), _jsx("li", { children: "\u2022 Confirma\u00E7\u00E3o em 1-5 minutos" })] })] })] })] })), paymentMethod === "github" && paymentResult.paymentUrl && (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Pagamento via GitHub Sponsors" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-purple-50 p-4 rounded-lg", children: [_jsx("h4", { className: "font-medium text-purple-900 mb-2", children: "Como proceder:" }), _jsxs("ol", { className: "text-sm text-purple-800 space-y-1", children: [_jsx("li", { children: "1. Clique no bot\u00E3o abaixo para ir ao GitHub Sponsors" }), _jsxs("li", { children: ["2. Escolha o tier de $", paymentResult.amount, "/m\u00EAs"] }), _jsx("li", { children: "3. Complete o processo de sponsorship" }), _jsx("li", { children: "4. Retorne aqui para confirma\u00E7\u00E3o" })] })] }), _jsx("div", { className: "text-center", children: _jsxs("a", { href: paymentResult.paymentUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors", children: [_jsx(ExternalLink, { className: "w-4 h-4" }), "Ir para GitHub Sponsors"] }) }), paymentResult.metadata?.instructions && (_jsx("div", { className: "text-sm text-gray-600 text-center", children: paymentResult.metadata.instructions }))] })] })), _jsxs("div", { className: "flex gap-4 justify-center", children: [paymentStatus === "pending" && (_jsx("button", { onClick: onCancel, className: "bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "Cancelar" })), (paymentStatus === "failed" || paymentStatus === "expired") && (_jsx("button", { onClick: () => window.location.reload(), className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "Tentar Novamente" }))] })] }));
};
export default PaymentProcessor;
