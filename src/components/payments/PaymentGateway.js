import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { PixPaymentProvider } from "../../services/providers/pixPaymentProvider";
import { BitcoinPaymentProvider } from "../../services/providers/bitcoinPaymentProvider";
import { USDTPaymentProvider } from "../../services/providers/usdtPaymentProvider";
import { GitHubPaymentProvider } from "../../services/providers/githubPaymentProvider";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PixPaymentComponent } from "./PixPaymentComponent";
import { BitcoinPaymentComponent } from "./BitcoinPaymentComponent";
import { USDTPaymentComponent } from "./USDTPaymentComponent";
import { GitHubPaymentComponent } from "./GitHubPaymentComponent";
import { PaymentStatusModal } from "./PaymentStatusModal";
import { PAYMENT_CONSTANTS } from "../../config/payment";
export const PaymentGateway = ({ plan, userId, onPaymentComplete, onPaymentError, onCancel, }) => {
    const [selectedMethod, setSelectedMethod] = useState("pix");
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [error, setError] = useState(null);
    // Inicializar provedores de pagamento
    useEffect(() => {
        try {
            const pixProvider = new PixPaymentProvider();
            const bitcoinProvider = new BitcoinPaymentProvider();
            const usdtProvider = new USDTPaymentProvider();
            const githubProvider = new GitHubPaymentProvider();
            paymentService.registerProvider(pixProvider);
            paymentService.registerProvider(bitcoinProvider);
            paymentService.registerProvider(usdtProvider);
            paymentService.registerProvider(githubProvider);
        }
        catch (error) {
            console.error("Erro ao inicializar provedores:", error);
            setError("Erro na configuração dos métodos de pagamento");
        }
    }, []);
    // Calcular preço com desconto baseado no método de pagamento
    const calculateFinalPrice = (method) => {
        const discount = PAYMENT_CONSTANTS.PAYMENT_DISCOUNTS[method] || 0;
        return plan.price * (1 - discount);
    };
    // Processar pagamento
    const handlePaymentProcess = async (method) => {
        setIsProcessing(true);
        setError(null);
        try {
            const finalPrice = calculateFinalPrice(method);
            const currency = method === "pix"
                ? "BRL"
                : method === "bitcoin"
                    ? "BTC"
                    : method === "usdt"
                        ? "USDT"
                        : "USD";
            const result = await paymentService.processPayment(method, finalPrice, currency, plan.id, userId);
            setCurrentPayment(result);
            setPaymentStatus("pending");
            setShowStatusModal(true);
            // Iniciar monitoramento do pagamento
            startPaymentMonitoring(result.transactionId, method);
        }
        catch (error) {
            console.error("Erro ao processar pagamento:", error);
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            setError(errorMessage);
            onPaymentError(error instanceof Error ? error : new Error(errorMessage));
        }
        finally {
            setIsProcessing(false);
        }
    };
    // Monitorar status do pagamento
    const startPaymentMonitoring = (transactionId, method) => {
        const checkStatus = async () => {
            try {
                const status = await paymentService.verifyPayment(method, transactionId);
                setPaymentStatus(status);
                if (status === "completed") {
                    clearInterval(interval);
                    onPaymentComplete(currentPayment);
                }
                else if (status === "failed" || status === "expired") {
                    clearInterval(interval);
                    setError("Pagamento falhou ou expirou");
                }
            }
            catch (error) {
                console.error("Erro ao verificar status:", error);
            }
        };
        // Intervalo baseado no tipo de pagamento
        const intervalTime = method === "pix"
            ? PAYMENT_CONSTANTS.PIX_POLLING_INTERVAL
            : PAYMENT_CONSTANTS.CRYPTO_POLLING_INTERVAL;
        const interval = setInterval(checkStatus, intervalTime);
        // Timeout baseado no tipo de pagamento
        const timeout = method === "pix"
            ? PAYMENT_CONSTANTS.PIX_TIMEOUT
            : PAYMENT_CONSTANTS.CRYPTO_TIMEOUT;
        setTimeout(() => {
            clearInterval(interval);
            if (paymentStatus === "pending" || paymentStatus === "processing") {
                setPaymentStatus("expired");
                setError("Pagamento expirou");
            }
        }, timeout);
    };
    // Cancelar pagamento
    const handleCancel = async () => {
        if (currentPayment) {
            try {
                await paymentService.cancelPayment(selectedMethod, currentPayment.transactionId);
            }
            catch (error) {
                console.error("Erro ao cancelar pagamento:", error);
            }
        }
        setCurrentPayment(null);
        setPaymentStatus("pending");
        setShowStatusModal(false);
        onCancel();
    };
    // Tentar novamente
    const handleRetry = () => {
        setCurrentPayment(null);
        setPaymentStatus("pending");
        setShowStatusModal(false);
        setError(null);
    };
    return (_jsxs("div", { className: "payment-gateway bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Finalizar Pagamento" }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [_jsx("h3", { className: "font-semibold text-gray-700", children: plan.name }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: plan.description }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-lg font-bold text-gray-800", children: ["R$ ", calculateFinalPrice(selectedMethod).toFixed(2)] }), PAYMENT_CONSTANTS.PAYMENT_DISCOUNTS[selectedMethod] > 0 && (_jsxs("span", { className: "text-sm text-green-600 font-medium", children: [(PAYMENT_CONSTANTS.PAYMENT_DISCOUNTS[selectedMethod] * 100).toFixed(0), "% OFF"] }))] }), plan.price !== calculateFinalPrice(selectedMethod) && (_jsxs("p", { className: "text-sm text-gray-500 line-through", children: ["De: R$ ", plan.price.toFixed(2)] }))] })] }), error && (_jsxs("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsx("p", { className: "text-red-700 text-sm", children: error }), _jsx("button", { onClick: handleRetry, className: "mt-2 text-red-600 hover:text-red-800 text-sm font-medium", children: "Tentar novamente" })] })), _jsx("div", { className: "mb-6", children: _jsx(PaymentMethodSelector, { selected: selectedMethod, onChange: setSelectedMethod, prices: {
                        pix: calculateFinalPrice("pix"),
                        bitcoin: calculateFinalPrice("bitcoin"),
                        usdt: calculateFinalPrice("usdt"),
                        github: calculateFinalPrice("github"),
                    }, disabled: isProcessing }) }), _jsxs("div", { className: "payment-component", children: [selectedMethod === "pix" && (_jsx(PixPaymentComponent, { plan: plan, finalPrice: calculateFinalPrice("pix"), onProcess: () => handlePaymentProcess("pix"), isProcessing: isProcessing, disabled: isProcessing })), selectedMethod === "bitcoin" && (_jsx(BitcoinPaymentComponent, { plan: plan, finalPrice: calculateFinalPrice("bitcoin"), onProcess: () => handlePaymentProcess("bitcoin"), isProcessing: isProcessing, disabled: isProcessing })), selectedMethod === "usdt" && (_jsx(USDTPaymentComponent, { plan: plan, finalPrice: calculateFinalPrice("usdt"), onProcess: () => handlePaymentProcess("usdt"), isProcessing: isProcessing, disabled: isProcessing })), selectedMethod === "github" && (_jsx(GitHubPaymentComponent, { amount: calculateFinalPrice("github"), planId: plan.id, userId: userId, onPaymentComplete: onPaymentComplete, onPaymentError: (error) => onPaymentError(new Error(error)), onCancel: handleCancel }))] }), _jsx("div", { className: "mt-6 pt-4 border-t border-gray-200", children: _jsx("button", { onClick: handleCancel, className: "w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors", disabled: isProcessing, children: "Cancelar" }) }), showStatusModal && currentPayment && (_jsx(PaymentStatusModal, { payment: currentPayment, status: paymentStatus, method: selectedMethod, onClose: () => setShowStatusModal(false), onCancel: handleCancel }))] }));
};
