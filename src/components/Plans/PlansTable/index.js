import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const moduleNames = [
    "MÓDULO 1",
    "MÓDULO 2",
    "MÓDULO 3",
    "MÓDULO 4",
    "MÓDULO 5",
    "MÓDULO 6",
];
const cellBorder = "border border-[#F2F2F2]";
const PlansTable = ({ type, plans }) => {
    const hasNinja = type === "MENTORIA";
    const columns = [
        ...plans.map((plan) => plan.title),
        ...(hasNinja ? ["NINJA"] : []),
    ];
    const getModuleCell = (plan, moduleIndex) => {
        if (plan.modules.length > moduleIndex && plan.modules[moduleIndex])
            return "X";
        return "-";
    };
    const ninjaCells = {
        INVESTIMENTO: "Fechado para novos inscritos",
        DURAÇÃO: "-",
        SESSÕES: "-",
        PERIODICIDADE: "-",
        MODULES: ["-", "-", "-", "-", "-", "-"],
    };
    const formatPrice = (price) => {
        if (typeof price === "string")
            return price;
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };
    return (_jsx("div", { className: "w-full overflow-x-auto py-10 flex justify-center", style: { fontFamily: "Quicksand, Poppins, Inter, sans-serif" }, children: _jsx("div", { className: "rounded-2xl shadow-2xl bg-white w-full max-w-[1200px] border border-[#F2F2F2]", children: _jsxs("table", { className: "min-w-[900px] w-full border-separate", style: { borderSpacing: 0 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: `sticky left-0 z-20 py-6 px-4 text-xl font-extrabold text-black bg-[#FFF1E7] rounded-tl-2xl align-middle shadow-md ${cellBorder}`, children: "CATEGORIA" }), plans.map((plan, idx) => (_jsx("th", { className: `py-6 px-4 text-xl font-extrabold align-middle bg-white text-center ${cellBorder} ${idx === plans.length - 1 && !hasNinja ? "rounded-tr-2xl" : ""}`, style: { color: "#F34A0D", fontWeight: 800 }, children: _jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("span", { children: plan.title }), plan.isRecomendad && (_jsx("span", { className: "mt-2 px-3 py-1 bg-[#F34A0D] text-white text-xs font-bold rounded-full shadow", style: { letterSpacing: 1 }, children: "RECOMENDADO" }))] }) }, plan.title))), hasNinja && (_jsx("th", { className: `py-6 px-4 text-xl font-extrabold align-middle bg-white text-center rounded-tr-2xl ${cellBorder}`, style: { color: "#F34A0D", fontWeight: 800 }, children: "NINJA" }))] }) }), _jsxs("tbody", { children: [_jsxs("tr", { style: { background: "#FFFDF8" }, children: [_jsx("td", { className: `sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`, children: "INVESTIMENTO" }), plans.map((plan) => (_jsxs("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: [formatPrice(plan.price), plan.participationPercentage > 0 && (_jsxs("div", { className: "text-sm text-[#F34A0D] mt-1", children: ["+ ", plan.participationPercentage, "% de participa\u00E7\u00E3o"] }))] }, plan.title))), hasNinja && (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: ninjaCells.INVESTIMENTO }))] }), _jsxs("tr", { style: { background: "#F9F6F1" }, children: [_jsx("td", { className: `sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`, children: "DURA\u00C7\u00C3O" }), plans.map((plan) => (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: plan.duration }, plan.title))), hasNinja && (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: ninjaCells.DURAÇÃO }))] }), _jsxs("tr", { style: { background: "#FFFDF8" }, children: [_jsx("td", { className: `sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`, children: "SESS\u00D5ES" }), plans.map((plan) => (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: _jsxs("div", { className: "whitespace-pre-line", children: [plan.sessions.total, " SESS\u00D5ES:", _jsx("br", {}), plan.sessions.details] }) }, plan.title))), hasNinja && (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: ninjaCells.SESSÕES }))] }), _jsxs("tr", { style: { background: "#F9F6F1" }, children: [_jsx("td", { className: `sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`, children: "PERIODICIDADE" }), plans.map((plan) => (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: plan.periodicity }, plan.title))), hasNinja && (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: ninjaCells.PERIODICIDADE }))] }), moduleNames.map((mod, i) => (_jsxs("tr", { style: { background: i % 2 === 0 ? "#FFFDF8" : "#F9F6F1" }, children: [_jsxs("td", { className: `sticky left-0 z-10 py-6 px-4 font-bold text-black bg-[#FFF1E7] align-middle shadow-md ${cellBorder}`, children: ["**", mod, " ***"] }), plans.map((plan) => (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: getModuleCell(plan, i) }, plan.title))), hasNinja && (_jsx("td", { className: `py-6 px-4 text-[#1A1A1A] align-middle text-center bg-white ${cellBorder}`, children: "-" }))] }, mod)))] })] }) }) }));
};
export default PlansTable;
