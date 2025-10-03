import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import Peoples from "../../../assets/peoples.png";
const ContactForm = ({ isPageContact }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        contactPreference: [],
        businessSegment: "",
        needs: "",
        agreeToTerms: false,
    });
    const [characterCount, setCharacterCount] = useState(0);
    const handlePreferenceToggle = (preference) => {
        setFormData((prev) => ({
            ...prev,
            contactPreference: prev.contactPreference.includes(preference)
                ? prev.contactPreference.filter((p) => p !== preference)
                : [...prev.contactPreference, preference],
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };
    const img = new URL("/public/home/contact-form.png", import.meta.url).href;
    return (_jsxs("div", { className: "pt-10 bg-[#F9F6F1] relative overflow-hidden", children: [isPageContact && (_jsx("div", { className: "block md:hidden p-6", children: _jsx("div", { className: "relative", children: _jsx("img", { src: Peoples, alt: "Pessoas sorrindo", className: "relative z-10 h-auto" }) }) })), _jsxs("div", { className: "md:pl-[calc((100%-74rem)/2)] flex items-center md:flex-row flex-col", children: [_jsxs("div", { className: "max-w-md relative z-10 xl:px-0 md:px-9 px-12", children: [_jsxs("div", { className: "flex flex-col gap-0 md:gap-4", children: [_jsx("h2", { className: "text-3xl font-bold mb-2 py-7 md:py-0", children: "Vamos nos conhecer?!" }), _jsx("p", { className: "text-gray-600 mb-6 text-base w-[370px]", children: "Preencha as informa\u00E7\u00F5es e nossos especialistas ir\u00E3o entrar em contato com voc\u00EA" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "Nome", className: "w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none bg-white", value: formData.name, onChange: (e) => setFormData((prev) => ({ ...prev, name: e.target.value })) }), _jsx("input", { type: "email", placeholder: "E-mail", className: "w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none bg-white", value: formData.email, onChange: (e) => setFormData((prev) => ({ ...prev, email: e.target.value })) }), _jsx("input", { type: "tel", placeholder: "Telefone", className: "w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none bg-white", value: formData.phone, onChange: (e) => setFormData((prev) => ({ ...prev, phone: e.target.value })) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-7", children: [_jsx("span", { className: "text-gray-800", children: "Prefer\u00EAncia de contato" }), _jsx("span", { className: "text-gray-400 text-sm", children: "(Opcional)" })] }), _jsx("div", { className: "flex gap-2", children: [
                                                    { label: "E-mail", value: "email" },
                                                    { label: "Telefone", value: "phone" },
                                                    { label: "WhatsApp", value: "whatsapp" },
                                                ].map(({ label, value }) => (_jsx("button", { type: "button", onClick: () => handlePreferenceToggle(value), className: `px-4 py-2 rounded-full border-2 transition-colors font-bold
                      ${formData.contactPreference.includes(value)
                                                        ? "bg-[#F34A0D] border-[#F34A0D] text-white"
                                                        : "bg-white text-[#F34A0D] hover:bg-[#F34A0D] hover:text-white border-[#F34A0D]"}`, children: label }, value))) })] }), _jsxs("select", { className: "w-full px-4 py-3 rounded-full border-2 border-[#A3A3A3] focus:outline-none appearance-none bg-white", value: formData.businessSegment, onChange: (e) => setFormData((prev) => ({
                                            ...prev,
                                            businessSegment: e.target.value,
                                        })), children: [_jsx("option", { value: "", children: "Segmento do seu neg\u00F3cio" }), _jsx("option", { value: "retail", children: "Varejo" }), _jsx("option", { value: "services", children: "Servi\u00E7os" }), _jsx("option", { value: "food", children: "Alimenta\u00E7\u00E3o" })] }), _jsxs("div", { className: "relative", children: [_jsx("textarea", { placeholder: "Explique sua necessidade", className: "w-full px-4 py-3 rounded-2xl border-2 border-[#A3A3A3] focus:outline-none resize-none h-28", value: formData.needs, onChange: (e) => {
                                                    const text = e.target.value;
                                                    if (text.length <= 100) {
                                                        setFormData((prev) => ({ ...prev, needs: text }));
                                                        setCharacterCount(text.length);
                                                    }
                                                } }), _jsxs("span", { className: "absolute bottom-3 right-4 text-sm text-gray-400", children: [characterCount, "/100"] })] }), _jsxs("label", { className: "flex items-center gap-2 text-gray-600", children: [_jsx("input", { type: "checkbox", checked: formData.agreeToTerms, onChange: (e) => setFormData((prev) => ({
                                                    ...prev,
                                                    agreeToTerms: e.target.checked,
                                                })), className: "rounded border-gray-300" }), _jsx("span", { children: "Concordo em receber informa\u00E7\u00F5es" })] }), _jsx("div", { className: "pb-10", children: _jsx("button", { type: "submit", className: "w-full bg-black text-white rounded-2xl py-4  font-bold hover:bg-opacity-90 transition-colors", children: "Enviar mensagem" }) })] })] }), isPageContact ? (_jsx(_Fragment, { children: _jsx("div", { className: "hidden md:block pl-72", children: _jsx("div", { className: "relative", children: _jsx("img", { src: Peoples, alt: "Pessoas sorrindo", className: "relative z-10 h-auto" }) }) }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute right-0 bottom-0 hidden md:block", children: _jsx("div", { className: "relative", children: _jsx("img", { src: img, alt: "Pessoa sorrindo", className: "relative z-10 w-[400px] h-auto" }) }) }), _jsx("div", { className: "block md:hidden relative w-full mt-8", children: _jsx("div", { className: "relative flex justify-end -right-4", children: _jsx("img", { src: img, alt: "Pessoa sorrindo", className: "relative z-10 w-full max-w-[300px] -rigth-8" }) }) })] }))] })] }));
};
export default ContactForm;
