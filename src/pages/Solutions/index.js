import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Hero from "./Hero";
import IntroSection from "../../components/IntroSection";
import BannerIntro from "../../components/BannerIntro";
import IaDoEmpreendedorBanner from "./IaDoEmpreendedorBanner";
import IAReports from "./IAReports";
import SEOHead from "../../components/SEOHead";
const Solutions = () => {
    const introSectionImage = new URL("/public/components/intro-section/happy-woman.png", import.meta.url).href;
    return (_jsxs("div", { className: "bg-[#F34A0D]", children: [_jsx(SEOHead, { title: "Solu\u00E7\u00F5es Empresariais | Xperience", description: "Consultoria empresarial sob medida para pequenos empreendedores. Solu\u00E7\u00F5es inovadoras e pr\u00E1ticas para organiza\u00E7\u00E3o de processos e estrat\u00E9gias de expans\u00E3o.", keywords: "consultoria empresarial, solu\u00E7\u00F5es para pequenos neg\u00F3cios, organiza\u00E7\u00E3o de processos, estrat\u00E9gias de expans\u00E3o, IA do empreendedor", ogImage: "/solutions/hero.png", canonical: "https://xperience.com.br/solutions" }), _jsx(Hero, {}), _jsx(IntroSection, { imageSrc: introSectionImage, imageAlt: "Mulher sorridente fazendo sinal de OK", title: "Consultoria empresarial sob medida para pequenos empreendedores", description: "A Xperience oferece servi\u00E7os inovadores, projetados para atender as principais necessidades de pequenos neg\u00F3cios, desde organiza\u00E7\u00E3o de processos at\u00E9 estrat\u00E9gias de expans\u00E3o.", highlightedText: "trazer resultados r\u00E1pidos e eficientes, com solu\u00E7\u00F5es pr\u00E1ticas e acess\u00EDveis!!!" }), _jsx(BannerIntro, { imageSrc: new URL("/public/solutions/consulting-intro.png", import.meta.url)
                    .href, title: "Solu\u00E7\u00F5es", highlightedText: "personalizadas", textColor: "#FFFFFF" }), _jsx(IaDoEmpreendedorBanner, { title: "IA do Empreendedor", subtitle: "chatbot Xperience", description: "Utilizamos nossa expertise e a inova\u00E7\u00E3o da IA do Empreendedor para identificar e aplicar as melhores estrat\u00E9gias para pequenos empreendedores.", highlightText: "TUDO DE FORMA GRATUITA!", buttonText: "Explore a IA" }), _jsx(IAReports, {})] }));
};
export default Solutions;
