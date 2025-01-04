import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialProps {
  id: number;
  image: string;
  quote: string;
  name: string;
  role: string;
}

const testimonials: TestimonialProps[] = [
  {
    id: 1,
    image: new URL("/public/home/testimonial-1.png", import.meta.url).href,
    quote: "Como seria bom ir a um lugar e pensar: nossa, aqui é diferente dos outros.",
    name: "Marcos Ishino",
    role: "CEO Xperience"
  },
  {
    id: 2,
    image: new URL("/public/home/testimonial-1.png", import.meta.url).href, 
    quote: "A Xperience transformou completamente nossa visão de negócio.",
    name: "Ana Silva",
    role: "Fundadora Startup XYZ"
  },
  {
    id: 3,
    image: new URL("/public/home/testimonial-1.png", import.meta.url).href, 
    quote: "Resultados surpreendentes em poucos meses de consultoria.",
    name: "João Santos",
    role: "Diretor Comercial ABC Ltda"
  },
  {
    id: 4,
    image: new URL("/public/home/testimonial-1.png", import.meta.url).href, 
    quote: "A melhor decisão que tomamos foi contar com a Xperience.",
    name: "Maria Costa",
    role: "CEO Tech Solutions"
  }
];

const TestimonialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFF5F1] rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFFBE5] rounded-full -translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-[1200px] mx-auto px-8 py-24 relative flex">
        <div className="w-full grid grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="w-[450px] h-[450px] rounded-[48px] overflow-hidden">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col">
            <h2 className="text-[48px] font-bold mb-16 tracking-tight uppercase">
              Depoimentos
            </h2>

            <div className="mb-12">
              <blockquote className="text-[32px] leading-tight mb-8">
                <span className="text-[#E85D04] inline-block mr-2">"</span>
                {testimonials[currentIndex].quote}
                <span className="text-[#E85D04] inline-block ml-2">"</span>
              </blockquote>
              
              <div>
                <p className="text-xl font-medium">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-gray-600">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-12 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-[#E85D04]' : 'bg-gray-200'
                    }`}
                    aria-label={`Ir para depoimento ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevious}
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center
                           hover:border-[#E85D04] transition-colors"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center
                           hover:border-[#E85D04] transition-colors"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;