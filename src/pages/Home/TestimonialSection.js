import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const testimonials = [
    {
        id: 1,
        image: new URL("/public/home/testimonial-1.png", import.meta.url).href,
        quote: "Como seria bom ir a um lugar e pensar: nossa, aqui é diferente dos outros.",
        name: "Marcos Ishino",
        role: "CEO Xperience",
    },
    {
        id: 2,
        image: new URL("/public/home/testimonial-1.png", import.meta.url).href,
        quote: "A Xperience transformou completamente nossa visão de negócio.",
        name: "Ana Silva",
        role: "Fundadora Startup XYZ",
    },
    {
        id: 3,
        image: new URL("/public/home/testimonial-1.png", import.meta.url).href,
        quote: "Resultados surpreendentes em poucos meses de consultoria.",
        name: "João Santos",
        role: "Diretor Comercial ABC Ltda",
    },
    {
        id: 4,
        image: new URL("/public/home/testimonial-1.png", import.meta.url).href,
        quote: "A melhor decisão que tomamos foi contar com a Xperience.",
        name: "Maria Costa",
        role: "CEO Tech Solutions",
    },
];
const TestimonialSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handlePrevious = () => {
        setCurrentIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
    };
    const handleNext = () => {
        setCurrentIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1);
    };
    return (_jsxs("div", { className: "w-full min-h-screen bg-white relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFF5F1] rounded-full translate-x-1/3 -translate-y-1/3" }), _jsx("div", { className: "absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFFBE5] rounded-full -translate-x-1/3 translate-y-1/3" }), _jsxs("div", { className: "max-w-[1200px] mx-auto px-8 py-24 relative flex flex-col", children: [_jsx("h2", { className: "text-5xl md:hidden font-bold  tracking-tight uppercase", children: "Depoimentos" }), _jsxs("div", { className: "w-full md:grid md:grid-cols-2 gap-16 items-center", children: [_jsx("div", { className: "md:rounded-[48px] rounded-[38px] overflow-hidden py-6", children: _jsx("img", { src: testimonials[currentIndex].image, alt: testimonials[currentIndex].name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h2", { className: "hidden md:block md:text-[48px] font-bold mb-16 tracking-tight uppercase", children: "Depoimentos" }), _jsxs("div", { className: "mb-12", children: [_jsxs("blockquote", { className: "text-2xl md:text-[32px] leading-tight mb-8", children: [_jsx("span", { className: "text-[#E85D04] inline-block mr-2", children: "\"" }), testimonials[currentIndex].quote, _jsx("span", { className: "text-[#E85D04] inline-block ml-2", children: "\"" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xl font-medium", children: testimonials[currentIndex].name }), _jsx("p", { className: "text-gray-600", children: testimonials[currentIndex].role })] })] }), _jsxs("div", { className: "flex items-center gap-8", children: [_jsx("div", { className: "flex items-center gap-2", children: testimonials.map((_, index) => (_jsx("button", { onClick: () => setCurrentIndex(index), className: `w-12 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-[#E85D04]" : "bg-gray-200"}`, "aria-label": `Ir para depoimento ${index + 1}` }, index))) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: handlePrevious, className: "w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center\n                           hover:border-[#E85D04] transition-colors", "aria-label": "Depoimento anterior", children: _jsx(ChevronLeft, { className: "md:w-6 w-5 h-5 md:h-6" }) }), _jsx("button", { onClick: handleNext, className: "w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center\n                           hover:border-[#E85D04] transition-colors", "aria-label": "Pr\u00F3ximo depoimento", children: _jsx(ChevronRight, { className: "md:w-6 w-5 h-5 md:h-6" }) })] })] })] })] })] })] }));
};
export default TestimonialSection;
