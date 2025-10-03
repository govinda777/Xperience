import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
const PaginationDots = ({ total, activeIndex, onPrev, onNext, }) => {
    return (_jsxs("div", { className: "pt-5 pb-12 flex flex-col items-center gap-4 md:hidden", children: [_jsx("div", { className: "flex justify-center items-center gap-2", children: Array.from({ length: total }).map((_, index) => (_jsx("div", { className: `w-4 h-4 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-[#F34A0D] w-16" : "bg-[#E3E3E3]"}` }, index))) }), _jsxs("div", { className: "flex justify-center items-center gap-4", children: [_jsx("button", { onClick: onPrev, disabled: activeIndex === 0, className: `bg-[#F34A0D] text-white p-3 rounded-2xl shadow-md ${activeIndex === 0 ? "bg-opacity-90 cursor-not-allowed" : ""}`, children: _jsx(ChevronLeft, { size: 30 }) }), _jsx("button", { onClick: onNext, disabled: activeIndex === total - 1, className: `bg-[#F34A0D] text-white p-3 rounded-2xl shadow-md ${activeIndex === total - 1 ? "bg-opacity-90 cursor-not-allowed" : ""}`, children: _jsx(ChevronRight, { size: 30 }) })] })] }));
};
export default PaginationDots;
