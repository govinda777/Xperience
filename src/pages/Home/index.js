import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Hero from "./Hero";
import Solutions from "./Solutions";
import IaDoEmpreendedor from "./IaDoEmpreendedor";
import WhyXperience from "./WhyXperience";
import CommunitySection from "./CommunitySection";
import PageTitle from "../../components/PageTitle";
import TestimonialSection from "./TestimonialSection";
import ContactForm from "../../components/ContactForm";
import SEOHead from "../../components/SEOHead";
const Home = () => {
    const heroImage = new URL("/public/home/hero.png", import.meta.url).href;
    const solutionsImage = new URL("/public/home/solutions.png", import.meta.url)
        .href;
    return (_jsxs(_Fragment, { children: [_jsx(SEOHead, { title: "Xperience - Mentoria para Empreendedores | IA do Empreendedor", description: "Transforme sua ideia em um neg\u00F3cio de sucesso com nossa mentoria especializada. Descubra nossa IA do Empreendedor gratuita e impulsione seu neg\u00F3cio com solu\u00E7\u00F5es pr\u00E1ticas e inovadoras.", keywords: "mentoria empresarial, consultoria para empreendedores, IA do empreendedor, neg\u00F3cios, startup, empreendedorismo, consultoria empresarial", ogImage: "/home/hero.png", canonical: "https://xperience.com.br/" }), _jsx(Hero, { title: "Explore nossa", highlightedText: '"IA do empreendedor"', subtitle: "e avalie o seu neg\u00F3cio", description: "Descubra como valorizar sua empresa e encantar seus clientes de forma r\u00E1pida e", emphasizedText: " GRATUITA", buttonText: "Descubra", imageSrc: heroImage, imageAlt: "Empreendedor" }), _jsx(Solutions, { title: "Impulsione seu", subtitle: "neg\u00F3cio com solu\u00E7\u00F5es pr\u00E1ticas e inovadoras", description: "Na Xperience Consultoria Empresarial, oferecemos solu\u00E7\u00F5es pr\u00E1ticas e imediatas para pequenos e empreendedores, combinando a experi\u00EAncia humana com a inova\u00E7\u00E3o da Intelig\u00EAncia Artificial. Somos especialistas em ajudar pequenos empreendedores a otimizar seus neg\u00F3cios de forma simples, eficiente e de impacto imediato.", linkText: "Conhe\u00E7a todas as solu\u00E7\u00F5es", solutionsImageSrc: solutionsImage }), _jsx(IaDoEmpreendedor, { title: "IA do Empreendedor", subtitle: "chatbot Xperience", description: "Nossa nova ferramenta, IA do Empreendedor, permite que voc\u00EA fa\u00E7a uma avalia\u00E7\u00E3o r\u00E1pida e personalizada do seu com\u00E9rcio e descubra oportunidades de melhoria em minutos.", highlightPart1: "TUDO DE FORMA", highlightPart2: "GRATUITA!", buttonText: "Explore a IA" }), _jsx(WhyXperience, {}), _jsx(CommunitySection, {}), _jsx(PageTitle, { title: "Venha construir experi\u00EAncias inesquec\u00EDveis para os seus clientes", highlightedWord: "clientes" }), _jsx(ContactForm, { isPageContact: false }), _jsx(TestimonialSection, {})] }));
};
export default Home;
