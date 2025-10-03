import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import TypePlans from "../../components/Plans/TypePlans";
import Bols1 from "../../../assets/svg/bols1.svg";
import Bols2 from "../../../assets/svg/bols2.svg";
import Warranty from "../../../assets/svg/warranty.svg";
import ContactForm from "../../components/ContactForm";
import EnjoyTools from "./EnjoyTools";
import PlansTable from "../../components/Plans/PlansTable";
import SEOHead from "../../components/SEOHead";
const Plans = () => {
    const [activeTab, setActiveTab] = useState("MENTORIA");
    const mentoringPlans = [
        {
            category: "START",
            title: "Start",
            price: 1500,
            participationPercentage: 0,
            duration: "3 meses",
            sessions: {
                total: 4,
                details: "1 sessão x 2h, 3 sessões x 1h",
            },
            periodicity: "1 sessão/mês",
            modules: ["Módulo 1", "Módulo 2"],
            isRecomendad: false,
            link: "/plans/start",
        },
        {
            category: "ESSENCIAL",
            title: "Essencial",
            price: 3000,
            participationPercentage: 0,
            duration: "3 meses",
            sessions: {
                total: 6,
                details: "1 sessão x 2h, 5 sessões x 1h",
            },
            periodicity: "1 sessão/15 dias",
            modules: ["Módulo 1", "Módulo 2", "Módulo 3"],
            isRecomendad: false,
            link: "/plans/essencial",
        },
        {
            category: "PRINCIPAL",
            title: "Principal",
            price: 6000,
            participationPercentage: 0,
            duration: "3 meses",
            sessions: {
                total: 9,
                details: "1 sessão x 3h, 8 sessões x 1,5h",
            },
            periodicity: "1 sessão/semana",
            modules: ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5"],
            isRecomendad: true,
            link: "/plans/principal",
        },
        {
            category: "AVANÇADA",
            title: "Avançada",
            price: 10000,
            participationPercentage: 0,
            duration: "6 meses",
            sessions: {
                total: 25,
                details: "1 sessão x 3h, 24 sessões x 1,5h",
            },
            periodicity: "1 sessão/15 dias",
            modules: ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5"],
            isRecomendad: false,
            link: "/plans/avancada",
        },
        {
            category: "PREMIUM",
            title: "Premium",
            price: 30000,
            participationPercentage: 0,
            duration: "12 meses",
            sessions: {
                total: 0,
                details: "a combinar",
            },
            periodicity: "a combinar",
            modules: [
                "Módulo 1",
                "Módulo 2",
                "Módulo 3",
                "Módulo 4",
                "Módulo 5",
                "Módulo 6",
            ],
            isRecomendad: false,
            link: "/plans/premium",
        },
    ];
    const incubatorPlans = [
        {
            category: "START",
            title: "Start",
            price: 500,
            participationPercentage: 5,
            duration: "3 meses",
            sessions: {
                total: 4,
                details: "1 sessão x 2h, 3 sessões x 1h",
            },
            periodicity: "1 sessão/mês",
            modules: ["Build: Site", "Build: Social Media"],
            isRecomendad: false,
            link: "/plans/incubator/start",
        },
        {
            category: "ESSENCIAL",
            title: "Essencial",
            price: 1000,
            participationPercentage: 7,
            duration: "3 meses",
            sessions: {
                total: 6,
                details: "1 sessão x 2h, 5 sessões x 1h",
            },
            periodicity: "1 sessão/15 dias",
            modules: ["Build: Site", "Build: Social Media", "Build: Process Map"],
            isRecomendad: false,
            link: "/plans/incubator/essencial",
        },
        {
            category: "PRINCIPAL",
            title: "Principal",
            price: 2000,
            participationPercentage: 10,
            duration: "3 meses",
            sessions: {
                total: 9,
                details: "1 sessão x 3h, 8 sessões x 1,5h",
            },
            periodicity: "1 sessão/semana",
            modules: [
                "Build: Site",
                "Build: Social Media",
                "Build: Process Map",
                "Build: Member channel",
                "Build: YouTube channel",
            ],
            isRecomendad: true,
            link: "/plans/incubator/principal",
        },
        {
            category: "AVANÇADA",
            title: "Avançada",
            price: 4000,
            participationPercentage: 15,
            duration: "6 meses",
            sessions: {
                total: 25,
                details: "1 sessão x 3h, 24 sessões x 1,5h",
            },
            periodicity: "1 sessão/15 dias",
            modules: [
                "Build: Site",
                "Build: Social Media",
                "Build: Process Map",
                "Build: Member channel",
                "Build: YouTube channel",
            ],
            isRecomendad: false,
            link: "/plans/incubator/avancada",
        },
        {
            category: "PREMIUM",
            title: "Premium",
            price: 8000,
            participationPercentage: 20,
            duration: "12 meses",
            sessions: {
                total: 0,
                details: "a combinar",
            },
            periodicity: "a combinar",
            modules: [
                "Build: Site",
                "Build: Social Media",
                "Build: Process Map",
                "Build: Member channel",
                "Build: YouTube channel",
                "Build: Token / NFT",
            ],
            isRecomendad: false,
            link: "/plans/incubator/premium",
        },
    ];
    return (_jsxs("main", { className: "relative bg-gradient-to-r from-[#FADD6B] to-[#FACC15]", children: [_jsx(SEOHead, { title: "Planos de Mentoria e Encubadora | Xperience", description: "Escolha o plano ideal para seu neg\u00F3cio. Mentoria individual ou programa de encubadora com consultoria personalizada e ferramentas inovadoras.", keywords: "planos de mentoria, encubadora de neg\u00F3cios, consultoria personalizada, mentoria individual, programa de acelera\u00E7\u00E3o", ogImage: "/plans/hero.png", canonical: "https://xperience.com.br/plans" }), _jsx("img", { src: Bols1, alt: "bolas 1", className: "flex absolute left-0 top-2 md:top-8 md:w-auto w-14" }), _jsx("img", { src: Bols2, alt: "bolas 2", className: "md:block absolute right-0 top-0 md:top-1 md:w-auto w-14 hidden" }), _jsxs("header", { className: "text-center pt-10 md:pt-28 pb-12 relative z-10", children: [_jsx("h1", { className: "font-bold text-4xl md:w-auto w-72 mx-auto md:text-5xl", children: "Escolha o plano certo e veja seu neg\u00F3cio crescer" }), _jsxs("h2", { className: "text-lg w-[360px] md:w-auto md:text-xl md:mt-0 mt-12 mx-auto", children: ["Al\u00E9m da nossa ferramenta ", _jsx("span", { className: "font-bold", children: "gratuita" }), ", oferecemos consultoria personalizada para levar o seu neg\u00F3cio ao pr\u00F3ximo n\u00EDvel."] })] }), _jsxs("section", { className: "justify-center items-center flex flex-col py-16 px-4 gap-6 bg-[#FBE151]", children: [_jsx("h1", { className: "font-bold text-[#F34A0D] text-center text-4xl", children: "Escolha o programa ideal para voc\u00EA" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsx(TypePlans, { type: "MENTORIA", title: "Mentoria Individual", description: "Consultoria personalizada com nossos especialistas", benefits: [
                                    "Mentoria individual",
                                    "Acompanhamento personalizado",
                                    "Suporte dedicado",
                                ] }), _jsx(TypePlans, { type: "ENCUBADORA", title: "Encubadora", description: "Processo completo de incuba\u00E7\u00E3o de experi\u00EAncias", benefits: [
                                    "Desenvolvimento completo",
                                    "Pacotes de serviços",
                                    "Suporte premium",
                                ] })] })] }), _jsxs("div", { className: "flex justify-center gap-4 py-8", children: [_jsx("button", { onClick: () => setActiveTab("MENTORIA"), className: `px-6 py-3 rounded-lg font-semibold ${activeTab === "MENTORIA"
                            ? "bg-[#F34A0D] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`, children: "Mentoria Individual" }), _jsx("button", { onClick: () => setActiveTab("ENCUBADORA"), className: `px-6 py-3 rounded-lg font-semibold ${activeTab === "ENCUBADORA"
                            ? "bg-[#F34A0D] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`, children: "Encubadora" })] }), _jsx("section", { className: "py-16 px-4", children: activeTab === "MENTORIA" ? (_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-center mb-8", children: "Programa Xperience - Mentoria Individual" }), _jsx(PlansTable, { type: "MENTORIA", plans: mentoringPlans })] })) : (_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-center mb-8", children: "Programa Xperience - Encubadora" }), _jsx(PlansTable, { type: "ENCUBADORA", plans: incubatorPlans })] })) }), _jsx(EnjoyTools, { link: "#" }), _jsx("section", { className: "py-16 px-4 bg-white", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("img", { src: Warranty, alt: "Garantia", className: "mx-auto mb-8" }), _jsx("h2", { className: "text-3xl font-bold mb-4", children: "Garantia de Satisfa\u00E7\u00E3o" }), _jsx("p", { className: "text-lg text-gray-600", children: "Se voc\u00EA n\u00E3o ficar satisfeito com nossos servi\u00E7os nos primeiros 7 dias, devolvemos seu dinheiro." })] }) }), _jsx(ContactForm, { isPageContact: false })] }));
};
export default Plans;
