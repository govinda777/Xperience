import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { usePrivy } from "@privy-io/react-auth";
import { formatCurrency } from "../../types/cart";
import { CreditCard, User, MapPin } from "lucide-react";
const CheckoutForm = ({ onNext, isLoading = false, }) => {
    const { cart, getCartSummary } = useCart();
    const { user } = usePrivy();
    const summary = getCartSummary();
    const [customerInfo, setCustomerInfo] = useState({
        name: user?.google?.name || user?.github?.name || "",
        email: user?.email?.address || "",
        phone: "",
        document: "",
        documentType: "cpf",
    });
    const [billingAddress, setBillingAddress] = useState({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        country: "BR",
    });
    const [useAddress, setUseAddress] = useState(false);
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        // Validar informações do cliente
        if (!customerInfo.name.trim()) {
            newErrors.name = "Nome é obrigatório";
        }
        if (!customerInfo.email.trim()) {
            newErrors.email = "Email é obrigatório";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            newErrors.email = "Email inválido";
        }
        if (!customerInfo.phone?.trim()) {
            newErrors.phone = "Telefone é obrigatório";
        }
        else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(customerInfo.phone)) {
            newErrors.phone = "Telefone inválido (ex: (11) 99999-9999)";
        }
        if (customerInfo.document && customerInfo.documentType === "cpf") {
            const cpf = customerInfo.document.replace(/\D/g, "");
            if (cpf.length !== 11) {
                newErrors.document = "CPF deve ter 11 dígitos";
            }
        }
        if (customerInfo.document && customerInfo.documentType === "cnpj") {
            const cnpj = customerInfo.document.replace(/\D/g, "");
            if (cnpj.length !== 14) {
                newErrors.document = "CNPJ deve ter 14 dígitos";
            }
        }
        // Validar endereço se necessário
        if (useAddress) {
            if (!billingAddress.street.trim()) {
                newErrors.street = "Rua é obrigatória";
            }
            if (!billingAddress.number.trim()) {
                newErrors.number = "Número é obrigatório";
            }
            if (!billingAddress.neighborhood.trim()) {
                newErrors.neighborhood = "Bairro é obrigatório";
            }
            if (!billingAddress.city.trim()) {
                newErrors.city = "Cidade é obrigatória";
            }
            if (!billingAddress.state.trim()) {
                newErrors.state = "Estado é obrigatório";
            }
            if (!billingAddress.zipCode.trim()) {
                newErrors.zipCode = "CEP é obrigatório";
            }
            else if (!/^\d{5}-?\d{3}$/.test(billingAddress.zipCode)) {
                newErrors.zipCode = "CEP inválido (ex: 12345-678)";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        onNext(customerInfo, useAddress ? billingAddress : undefined);
    };
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
        }
        else {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        }
    };
    const formatDocument = (value, type) => {
        const numbers = value.replace(/\D/g, "");
        if (type === "cpf") {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
        else {
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        }
    };
    const formatZipCode = (value) => {
        const numbers = value.replace(/\D/g, "");
        return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
    };
    return (_jsx("div", { className: "max-w-4xl mx-auto p-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx(User, { className: "w-5 h-5" }), "Informa\u00E7\u00F5es Pessoais"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nome Completo *" }), _jsx("input", { type: "text", value: customerInfo.name, onChange: (e) => setCustomerInfo({ ...customerInfo, name: e.target.value }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`, placeholder: "Seu nome completo" }), errors.name && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.name }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email *" }), _jsx("input", { type: "email", value: customerInfo.email, onChange: (e) => setCustomerInfo({
                                                            ...customerInfo,
                                                            email: e.target.value,
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`, placeholder: "seu@email.com" }), errors.email && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Telefone *" }), _jsx("input", { type: "tel", value: customerInfo.phone, onChange: (e) => setCustomerInfo({
                                                            ...customerInfo,
                                                            phone: formatPhone(e.target.value),
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"}`, placeholder: "(11) 99999-9999", maxLength: 15 }), errors.phone && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.phone }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Documento" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: customerInfo.documentType, onChange: (e) => setCustomerInfo({
                                                                    ...customerInfo,
                                                                    documentType: e.target.value,
                                                                    document: "",
                                                                }), className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [_jsx("option", { value: "cpf", children: "CPF" }), _jsx("option", { value: "cnpj", children: "CNPJ" })] }), _jsx("input", { type: "text", value: customerInfo.document, onChange: (e) => setCustomerInfo({
                                                                    ...customerInfo,
                                                                    document: formatDocument(e.target.value, customerInfo.documentType || "cpf"),
                                                                }), className: `flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.document ? "border-red-500" : "border-gray-300"}`, placeholder: customerInfo.documentType === "cpf"
                                                                    ? "000.000.000-00"
                                                                    : "00.000.000/0000-00", maxLength: customerInfo.documentType === "cpf" ? 14 : 18 })] }), errors.document && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.document }))] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5" }), "Endere\u00E7o de Cobran\u00E7a"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: useAddress, onChange: (e) => setUseAddress(e.target.checked), className: "rounded" }), _jsx("span", { className: "text-sm", children: "Adicionar endere\u00E7o" })] })] }), useAddress && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "CEP *" }), _jsx("input", { type: "text", value: billingAddress.zipCode, onChange: (e) => setBillingAddress({
                                                            ...billingAddress,
                                                            zipCode: formatZipCode(e.target.value),
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.zipCode ? "border-red-500" : "border-gray-300"}`, placeholder: "12345-678", maxLength: 9 }), errors.zipCode && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.zipCode }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Rua *" }), _jsx("input", { type: "text", value: billingAddress.street, onChange: (e) => setBillingAddress({
                                                            ...billingAddress,
                                                            street: e.target.value,
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.street ? "border-red-500" : "border-gray-300"}`, placeholder: "Nome da rua" }), errors.street && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.street }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "N\u00FAmero *" }), _jsx("input", { type: "text", value: billingAddress.number, onChange: (e) => setBillingAddress({
                                                            ...billingAddress,
                                                            number: e.target.value,
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.number ? "border-red-500" : "border-gray-300"}`, placeholder: "123" }), errors.number && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.number }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Complemento" }), _jsx("input", { type: "text", value: billingAddress.complement, onChange: (e) => setBillingAddress({
                                                            ...billingAddress,
                                                            complement: e.target.value,
                                                        }), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Apto, sala, etc." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Bairro *" }), _jsx("input", { type: "text", value: billingAddress.neighborhood, onChange: (e) => setBillingAddress({
                                                            ...billingAddress,
                                                            neighborhood: e.target.value,
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.neighborhood
                                                            ? "border-red-500"
                                                            : "border-gray-300"}`, placeholder: "Nome do bairro" }), errors.neighborhood && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.neighborhood }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cidade *" }), _jsx("input", { type: "text", value: billingAddress.city, onChange: (e) => setBillingAddress({
                                                            ...billingAddress,
                                                            city: e.target.value,
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? "border-red-500" : "border-gray-300"}`, placeholder: "Nome da cidade" }), errors.city && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.city }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Estado *" }), _jsxs("select", { value: billingAddress.state, onChange: (e) => setBillingAddress({
                                                            ...billingAddress,
                                                            state: e.target.value,
                                                        }), className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? "border-red-500" : "border-gray-300"}`, children: [_jsx("option", { value: "", children: "Selecione o estado" }), _jsx("option", { value: "SP", children: "S\u00E3o Paulo" }), _jsx("option", { value: "RJ", children: "Rio de Janeiro" }), _jsx("option", { value: "MG", children: "Minas Gerais" }), _jsx("option", { value: "RS", children: "Rio Grande do Sul" }), _jsx("option", { value: "PR", children: "Paran\u00E1" }), _jsx("option", { value: "SC", children: "Santa Catarina" })] }), errors.state && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.state }))] })] }))] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: isLoading, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "Processando..."] })) : (_jsxs(_Fragment, { children: [_jsx(CreditCard, { className: "w-4 h-4" }), "Continuar para Pagamento"] })) }) })] }) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6 sticky top-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Resumo do Pedido" }), _jsx("div", { className: "space-y-3 mb-4", children: cart?.items.map((item) => (_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-sm", children: item.name }), _jsxs("p", { className: "text-xs text-gray-500", children: [item.quantity, "x \u2022 ", item.duration, " meses"] })] }), _jsx("p", { className: "font-medium text-sm", children: formatCurrency(item.price * item.quantity, item.currency) })] }, item.id))) }), _jsxs("div", { className: "border-t pt-4 space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Subtotal" }), _jsx("span", { children: formatCurrency(summary.subtotal, summary.currency) })] }), summary.discount > 0 && (_jsxs("div", { className: "flex justify-between text-sm text-green-600", children: [_jsx("span", { children: "Desconto" }), _jsxs("span", { children: ["-", formatCurrency(summary.discount, summary.currency)] })] })), summary.tax > 0 && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Impostos" }), _jsx("span", { children: formatCurrency(summary.tax, summary.currency) })] })), _jsxs("div", { className: "flex justify-between font-bold text-lg pt-2 border-t", children: [_jsx("span", { children: "Total" }), _jsx("span", { children: formatCurrency(summary.total, summary.currency) })] })] })] }) })] }) }));
};
export default CheckoutForm;
