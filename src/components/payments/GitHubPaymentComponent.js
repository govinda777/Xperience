import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { GitHubPaymentProvider } from "../../services/providers/githubPaymentProvider";
export const GitHubPaymentComponent = ({ amount, planId, userId, onPaymentComplete, onPaymentError, onCancel, }) => {
    const [paymentResult, setPaymentResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [instructions, setInstructions] = useState(null);
    const [githubProvider] = useState(() => new GitHubPaymentProvider());
    useEffect(() => {
        initializePayment();
    }, [amount, planId, userId]);
    const initializePayment = async () => {
        try {
            setIsLoading(true);
            // Validar configuração
            const validation = githubProvider.validateConfiguration();
            if (!validation.isValid) {
                throw new Error(`Configuração inválida: ${validation.errors.join(", ")}`);
            }
            // Processar pagamento
            const result = await githubProvider.process(amount, planId, userId);
            setPaymentResult(result);
            // Gerar instruções
            const paymentInstructions = githubProvider.generatePaymentInstructions(result);
            setInstructions(paymentInstructions);
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Erro ao inicializar pagamento GitHub";
            onPaymentError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handlePayWithGitHub = () => {
        if (paymentResult?.paymentUrl) {
            // Abrir GitHub Sponsors em nova aba
            window.open(paymentResult.paymentUrl, "_blank", "noopener,noreferrer");
            // Marcar como processando
            setPaymentStatus("processing");
            // Simular verificação (em produção seria um polling ou webhook)
            setTimeout(() => {
                // Por enquanto, marcar como pendente para verificação manual
                setPaymentStatus("pending");
            }, 2000);
        }
    };
    const handleManualConfirmation = () => {
        if (paymentResult) {
            // Simular confirmação manual (em produção seria via admin panel)
            setPaymentStatus("completed");
            onPaymentComplete(paymentResult);
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "github-payment-loading", children: _jsxs("div", { className: "flex flex-col items-center justify-center p-8", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4" }), _jsx("p", { className: "text-gray-600", children: "Preparando pagamento GitHub..." })] }) }));
    }
    if (!paymentResult || !instructions) {
        return (_jsx("div", { className: "github-payment-error", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "text-red-500 text-xl mr-3", children: "\u26A0\uFE0F" }), _jsxs("div", { children: [_jsx("h3", { className: "text-red-800 font-medium", children: "Erro na inicializa\u00E7\u00E3o" }), _jsx("p", { className: "text-red-600 text-sm mt-1", children: "N\u00E3o foi poss\u00EDvel inicializar o pagamento GitHub." })] })] }) }) }));
    }
    const metadata = paymentResult.metadata;
    return (_jsx("div", { className: "github-payment-component", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white text-xl", children: "\uD83D\uDC19" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "GitHub Pay" }), _jsx("p", { className: "text-sm text-gray-600", children: "Patrocine via GitHub Sponsors" })] })] }), _jsx("button", { onClick: onCancel, className: "text-gray-400 hover:text-gray-600 transition-colors", children: "\u2715" })] }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4 mb-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-600", children: "Valor do patroc\u00EDnio:" }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900", children: ["$", paymentResult.amount, " USD"] }), _jsxs("div", { className: "text-sm text-gray-500", children: ["\u2248 R$", " ", githubProvider
                                                .convertUsdToBrl(paymentResult.amount)
                                                .toFixed(2)] })] })] }) }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: `
            flex items-center space-x-2 p-3 rounded-lg
            ${paymentStatus === "pending" ? "bg-yellow-50 text-yellow-800" : ""}
            ${paymentStatus === "processing" ? "bg-blue-50 text-blue-800" : ""}
            ${paymentStatus === "completed" ? "bg-green-50 text-green-800" : ""}
          `, children: [_jsxs("span", { className: "text-lg", children: [paymentStatus === "pending" && "⏳", paymentStatus === "processing" && "🔄", paymentStatus === "completed" && "✅"] }), _jsxs("span", { className: "font-medium", children: [paymentStatus === "pending" && "Aguardando pagamento", paymentStatus === "processing" && "Processando pagamento...", paymentStatus === "completed" && "Pagamento confirmado!"] })] }) }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-3", children: instructions.title }), _jsx("div", { className: "space-y-2 mb-4", children: instructions.steps.map((step, index) => (_jsxs("div", { className: "flex items-start space-x-2", children: [_jsxs("span", { className: "text-blue-500 font-medium text-sm mt-0.5", children: [step.split(".")[0], "."] }), _jsx("span", { className: "text-gray-700 text-sm", children: step.substring(step.indexOf(".") + 1).trim() })] }, index))) }), _jsxs("div", { className: "bg-blue-50 rounded-lg p-3", children: [_jsx("h4", { className: "text-sm font-medium text-blue-800 mb-2", children: "\uD83D\uDCCB Informa\u00E7\u00F5es importantes:" }), _jsx("div", { className: "space-y-1", children: instructions.notes.map((note, index) => (_jsx("p", { className: "text-xs text-blue-700", children: note }, index))) })] })] }), _jsxs("div", { className: "space-y-3", children: [paymentStatus === "pending" && (_jsxs("button", { onClick: handlePayWithGitHub, className: "w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2", children: [_jsx("span", { children: "\uD83D\uDC19" }), _jsx("span", { children: "Pagar com GitHub Sponsors" })] })), paymentStatus === "processing" && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "bg-blue-100 border border-blue-200 rounded-lg p-3", children: _jsxs("p", { className: "text-blue-800 text-sm", children: [_jsx("strong", { children: "Pagamento em andamento!" }), _jsx("br", {}), "Complete o pagamento na aba do GitHub que foi aberta."] }) }), _jsx("button", { onClick: handleManualConfirmation, className: "w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm", children: "\u2705 J\u00E1 paguei - Confirmar manualmente" })] })), paymentStatus === "completed" && (_jsx("div", { className: "bg-green-100 border border-green-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-green-600 text-xl", children: "\uD83C\uDF89" }), _jsxs("div", { children: [_jsx("h4", { className: "text-green-800 font-medium", children: "Pagamento confirmado!" }), _jsx("p", { className: "text-green-700 text-sm", children: "Obrigado pelo seu patroc\u00EDnio! Seu acesso ser\u00E1 liberado em breve." })] })] }) }))] }), _jsx("div", { className: "mt-6 pt-4 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [_jsxs("span", { children: ["Patrocinando: @", metadata.username] }), _jsx("a", { href: `https://github.com/${metadata.username}`, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:text-blue-800 transition-colors", children: "Ver perfil GitHub \u2192" })] }) }), _jsx("div", { className: "mt-4 p-3 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex items-center space-x-2 text-xs text-gray-600", children: [_jsx("span", { children: "\uD83D\uDD12" }), _jsx("span", { children: "Pagamento processado de forma segura pelo GitHub Sponsors. Seus dados est\u00E3o protegidos." })] }) })] }) }));
};
