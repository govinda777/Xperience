import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Feature = ({ iconSrc, title, description }) => (_jsxs("div", { className: "flex flex-col items-center text-center", children: [_jsxs("div", { className: "mb-4 relative w-[70px] h-[70px] flex items-center justify-center", children: [_jsx("img", { src: iconSrc, alt: title, className: "w-full h-full object-contain" }), _jsx("div", { className: "absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full" })] }), _jsx("h3", { className: "text-2xl font-bold mb-2", children: title }), _jsx("p", { className: "text-gray-600 max-w-[300px] text-base", children: description })] }));
const WhyXperience = () => {
    const icons = {
        simplicidade: new URL("/public/home/por-que-xperience--simplicidade.png", import.meta.url).href,
        facilidade: new URL("/public/home/por-que-xperience--facilidade.png", import.meta.url).href,
        baixoCusto: new URL("/public/home/por-que-xperience--baixo-custo.png", import.meta.url).href,
        resultados: new URL("/public/home/por-que-xperience--resultados.png", import.meta.url).href,
        comunidade: new URL("/public/home/por-que-xperience--comunidade.png", import.meta.url).href,
    };
    const topFeatures = [
        {
            iconSrc: icons.simplicidade,
            title: "Simplicidade",
            description: "Metodologia simplificada de coleta de dados.",
        },
        {
            iconSrc: icons.facilidade,
            title: "Facilidade",
            description: "Acesso fácil e rápido ao que sua empresa precisa.",
        },
        {
            iconSrc: icons.baixoCusto,
            title: "Baixo custo",
            description: "Preço acessível para você investir no melhor.",
        },
    ];
    const bottomFeatures = [
        {
            iconSrc: icons.resultados,
            title: "Resultados",
            description: "Ferramentas para melhorar seus resultados de forma eficiente.",
        },
        {
            iconSrc: icons.comunidade,
            title: "Comunidade",
            description: "Acesso a uma rede de empreendedores como você",
        },
    ];
    return (_jsx("section", { className: "bg-white py-16 md:py-32 flex items-center", children: _jsxs("div", { className: "max-w-[1200px] mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-[40px] font-bold mb-4", children: "Por que a Xperience" }), _jsx("p", { className: "text-gray-600 text-lg max-w-[1000px] mx-auto", children: "Voc\u00EA contar\u00E1 com v\u00E1rias ferramentas para proporcionar experi\u00EAncias inesquec\u00EDveis aos seus clientes e ao seu time. Pensamos na viv\u00EAncia de empreender como um todo." })] }), _jsxs("div", { className: "space-y-16", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: topFeatures.map((feature, index) => (_jsx(Feature, { iconSrc: feature.iconSrc, title: feature.title, description: feature.description }, index))) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto", children: bottomFeatures.map((feature, index) => (_jsx(Feature, { iconSrc: feature.iconSrc, title: feature.title, description: feature.description }, index))) })] })] }) }));
};
export default WhyXperience;
