import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Check from "../../../../assets/svg/check.svg";
import { Link, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import Crown from "../../../../assets/svg/crown.svg";
const PlansCards = ({ category, title, price, duration, sessions, periodicity, modules, isRecomendad, link, }) => {
    return (_jsxs("div", { className: `h-full relative md:gap-10 gap-3 justify-center flex flex-col py-8 px-6 rounded-[30px] bg-white max-w-xs md:max-w-xl border-4 ${isRecomendad ? "border-[#CC3600]" : "border-[#F2F2F2]"}`, children: [isRecomendad && (_jsx("div", { className: "py-2 px-6 bg-[#CC3600] rounded-full absolute -top-5 left-1/2 transform -translate-x-1/2", children: _jsx("p", { className: "text-white uppercase font-bold text-lg", children: "Recomendado" }) })), isRecomendad && (_jsx("div", { className: "absolute md:-top-20 md:-right-16 -top-20 -right-10 transform", children: _jsx("img", { src: Crown, alt: "Coroa", className: "md:w-24 md:h-24 xl:w-24 xl:h-24 w-20 h-20" }) })), _jsx("h1", { className: "text-xl md:text-2xl font-bold text-[#F34A0D]", children: title }), _jsx("div", { className: "mb-4 flex flex-row gap-2 items-end", children: _jsxs("h1", { className: "text-4xl md:text-5xl font-bold text-[#060606]", children: ["R$ ", price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })] }) }), _jsxs("div", { className: "flex flex-row gap-2 items-center", children: [_jsx("img", { src: Check, alt: "Check", className: "md:w-5 md:h-5 mt-0.5" }), _jsxs("p", { className: "text-[#1A1A1A]", children: [_jsx("span", { className: "font-bold", children: "Dura\u00E7\u00E3o:" }), " ", duration] })] }), _jsxs("div", { className: "flex flex-row gap-2 items-center", children: [_jsx("img", { src: Check, alt: "Check", className: "md:w-5 md:h-5 mt-0.5" }), _jsxs("p", { className: "text-[#1A1A1A]", children: [_jsx("span", { className: "font-bold", children: "Sess\u00F5es:" }), " ", sessions.total, " (", sessions.details, ")"] })] }), _jsxs("div", { className: "flex flex-row gap-2 items-center", children: [_jsx("img", { src: Check, alt: "Check", className: "md:w-5 md:h-5 mt-0.5" }), _jsxs("p", { className: "text-[#1A1A1A]", children: [_jsx("span", { className: "font-bold", children: "Periodicidade:" }), " ", periodicity] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-[#060606] font-bold mb-2", children: "M\u00F3dulos Inclusos:" }), _jsx("ul", { className: "flex flex-col gap-2", children: modules.map((module, index) => (_jsxs("div", { className: "flex flex-row gap-2 items-start", children: [_jsx("img", { src: Check, alt: "Check", className: "md:w-5 md:h-5" }), _jsx("p", { className: "text-[#1A1A1A]", children: module })] }, index))) })] }), _jsx("div", { className: "mt-auto mx-auto", children: _jsx(PlanButton, { link: link, isRecomendad: isRecomendad }) })] }));
};
const PlanButton = ({ link, isRecomendad, }) => {
    const { login } = usePrivy();
    const navigate = useNavigate();
    const handlePlanSelection = (e) => {
        e.preventDefault();
        login();
    };
    return (_jsx(Link, { to: link, onClick: handlePlanSelection, className: `py-3 px-6 rounded-full text-white font-bold ${isRecomendad ? "bg-[#CC3600]" : "bg-[#F34A0D]"}`, children: "Come\u00E7ar Agora" }));
};
export default PlansCards;
