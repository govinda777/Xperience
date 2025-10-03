import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Idea from "../../../../assets/svg/idea.svg";
import Warranty from "../../../../assets/svg/warranty.svg";
import ArrowDown from "../../../../assets/svg/arrowDown.svg";
const TypePlans = ({ type, title, description, benefits, }) => {
    return (_jsxs("div", { className: "flex flex-col py-8 px-6 rounded-[49px] bg-white gap-6 max-w-sm", children: [_jsx("img", { src: type === "MENTORIA" ? Idea : Warranty, alt: type, className: "w-12 h-12" }), _jsx("h2", { className: "text-xl md:text-3xl font-bold text-[#1A1A1A]", children: title }), _jsx("p", { className: "text-[#1A1A1A] text-sm md:text-base", children: description }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("h3", { className: "text-[#060606] font-bold", children: "Benef\u00EDcios:" }), _jsx("ul", { className: "flex flex-col gap-2", children: benefits.map((benefit, index) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("img", { src: ArrowDown, alt: "Arrow", className: "w-5 h-5" }), _jsx("p", { className: "text-[#1A1A1A]", children: benefit })] }, index))) })] }), _jsx("div", { children: _jsxs("button", { className: "p-3 border border-[#1A1A1A] text-[#1A1A1A] rounded-full md:rounded-[20px] flex items-center justify-center gap-2 hover:bg-gray-100", children: [_jsx("p", { className: "text-sm font-bold", children: "Saiba mais" }), _jsx("img", { src: ArrowDown, alt: "Flecha para baixo", className: "md:w-5 md:h-5" })] }) })] }));
};
export default TypePlans;
