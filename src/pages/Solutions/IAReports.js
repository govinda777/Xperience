import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import IAReport from "../../components/IAReport";
const solutions1 = new URL("/public/solutions/solutions1.png", import.meta.url)
    .href;
const solutions2 = new URL("/public/solutions/solutions2.png", import.meta.url)
    .href;
const solutions3 = new URL("/public/solutions/solutions3.png", import.meta.url)
    .href;
const IAReports = () => {
    return (_jsxs("div", { className: "space-y-24", children: [_jsx(IAReport, { imageLeft: false, title: "Mapa do Seu Neg\u00F3cio", description: "Um mapa mental automatizado que mostra:", bullets: ["Onde sua empresa está agora.", "Para onde ela pode ir."], buttonText: "Solicitar mapa", imageSrc: solutions1, imageAlt: "Foto do Mapa do Seu Neg\u00F3cio" }), _jsx(IAReport, { imageLeft: true, title: "Relat\u00F3rio Xperience", description: "An\u00E1lise que utiliza o m\u00E9todo Blue Ocean (Oceano azul) e \u00E9 gerado pela nossa IA do Empreendedor para que voc\u00EA:", bullets: [
                    "Identifique novas possibilidades e criar mercados inexplorados.",
                    "Receba orientações direcionadas para o seu negócio.",
                ], buttonText: "Solicitar relat\u00F3rio", imageSrc: solutions2, imageAlt: "Foto Relat\u00F3rio Xperience" }), _jsx(IAReport, { imageLeft: false, title: "Relat\u00F3rio SEO", description: "Uma forma de manter seu neg\u00F3cio conectado ao mundo digital, e obter:", bullets: [
                    "Compartilhe fornecedores.",
                    "Relatório de gestão de tráfego no Google e Facebook.",
                ], buttonText: "Solicitar relat\u00F3rio", imageSrc: solutions3, imageAlt: "Foto Relat\u00F3rio SEO" })] }));
};
export default IAReports;
