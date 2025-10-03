import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Slice from "../../../assets/svg/slice.svg";
const Cards = ({ title, subtitle, isCircle }) => {
    return (_jsxs("main", { className: "w-full bg-white relative p-10 rounded-3xl md:rounded-2xl regular", children: [isCircle && (_jsx("img", { src: Slice, alt: "Peda\u00E7o bola", className: "w-24 h-24 md:w-40 md:h-40 absolute md:-top-10 -top-0 -right-2 rotate-90 md:-right-8" })), _jsxs("div", { className: "flex flex-col gap-2 text-[#1A1A1A]", children: [_jsx("h1", { className: "font-bold text-3xl md:text-xl w-60", children: title }), _jsx("h2", { className: "font-semibold text-lg", children: subtitle })] })] }));
};
export default Cards;
