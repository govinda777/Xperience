import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ContactForm from "../../components/ContactForm";
import SEOHead from "../../components/SEOHead";
const Contact = () => {
    return (_jsxs("main", { className: "relative bg-white", children: [_jsx(SEOHead, { title: "Contato | Xperience - Fale Conosco", description: "Entre em contato com a Xperience. Estamos prontos para ajudar a simplificar e escalar seu neg\u00F3cio com nossas solu\u00E7\u00F5es personalizadas.", keywords: "contato xperience, fale conosco, consultoria empresarial, or\u00E7amento, atendimento", ogImage: "/contact/hero.png", canonical: "https://xperience.com.br/contact" }), _jsxs("div", { className: "text-left md:text-center md:justify-center justify-left items-left md:items-center py-8 md:px-0 px-6 flex flex-col gap-4", children: [_jsx("h1", { className: "font-extrabold w-64 md:w-auto text-4xl md:text-5xl", children: "Pronto para simplificar e escalar seu neg\u00F3cio?" }), _jsxs("h2", { className: "font-extrabold text-4xl md:text-5xl text-[#F34A0D] w-64 md:w-auto", children: [" ", "Fale conosco agora mesmo!"] })] }), _jsx(ContactForm, { isPageContact: true })] }));
};
export default Contact;
